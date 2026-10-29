/**
 * Implementation of every /api/admin/* endpoint.
 *
 * It lives here rather than in the route file so the Vite dev middleware can
 * import it directly, which keeps local development and production on one code
 * path. The route wrapper at api/admin/[...path].ts is what Vercel deploys.
 *
 * Only `login` is reachable without a session. Everything else returns 401.
 */
import {
  attemptLogin,
  clearedSessionCookie,
  requireAdmin,
  sessionCookie,
  type AdminIdentity,
} from './adminAuth.js';
import { healthCheck, isDbConfigured, migrate } from './db.js';
import { fail, json, ok, preflight, send, toApiRequest, type ApiRequest, type ApiResult } from './http.js';
import { SERVICE_CATALOG } from './leadIntelligence.js';
import {
  LEAD_STAGES,
  deleteLead,
  exportLeadsCsv,
  getBotHealth,
  getConversationTranscript,
  getDashboardStats,
  getLeadDetail,
  listConversations,
  listNotifications,
  listLeads,
  purgeOldTranscripts,
  updateLead,
  type LeadFilters,
  type LeadPatch,
} from './repository.js';
import { sendTestAlert, whatsappStatus } from './whatsapp.js';

export const config = {
  maxDuration: 30,
};

const DB_UNAVAILABLE =
  'The database is not reachable. Check DATABASE_URL, then run the migration from Settings.';

/** Reply used whenever a repository read returns null. */
const dbError = (): ApiResult => fail(503, DB_UNAVAILABLE, { dbConfigured: isDbConfigured() });

/**
 * Splits the path after /api/admin into route segments.
 *
 * Falls back to the repeated `path` query parameter, which is how Vercel surfaces
 * the segments of a `[...path]` catch-all route. Reading both means the router
 * works whether the runtime hands us the original URL or a rewritten one.
 */
function segments(request: ApiRequest): string[] {
  const fromPath = request.path
    .replace(/^\/+api\/+admin\/?/, '')
    .split('/')
    .filter(Boolean)
    .map((part) => decodeURIComponent(part));

  if (fromPath.length > 0) return fromPath;
  return request.query.getAll('path').filter(Boolean);
}

function readFilters(request: ApiRequest): LeadFilters {
  const q = request.query;
  const value = (key: string) => q.get(key)?.trim() || undefined;
  return {
    stage: value('stage'),
    source: value('source'),
    service: value('service'),
    temperature: value('temperature'),
    owner: value('owner'),
    search: value('q'),
    from: value('from'),
    to: value('to'),
    needsAttention: q.get('needsAttention') === 'true',
    sort: value('sort'),
    direction: q.get('direction') === 'asc' ? 'asc' : 'desc',
    page: Number(q.get('page')) || 1,
    pageSize: Number(q.get('pageSize')) || 25,
  };
}

/** Whitelists the fields an admin edit may touch. */
function readPatch(body: Record<string, any>): LeadPatch {
  const patch: LeadPatch = {};
  const str = (value: unknown, max = 300): string | null | undefined => {
    if (value === null) return null;
    if (typeof value !== 'string') return undefined;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed.slice(0, max) : null;
  };

  if (typeof body.stage === 'string' && (LEAD_STAGES as readonly string[]).includes(body.stage)) {
    patch.stage = body.stage;
  }
  if (typeof body.temperature === 'string' && ['hot', 'warm', 'cold'].includes(body.temperature)) {
    patch.temperature = body.temperature;
  }

  for (const key of ['owner', 'name', 'email', 'phone', 'company'] as const) {
    if (key in body) {
      const parsed = str(body[key]);
      if (parsed !== undefined) patch[key] = parsed;
    }
  }
  if ('businessType' in body) patch.business_type = str(body.businessType) ?? null;
  if ('budget' in body) patch.budget_hint = str(body.budget, 100) ?? null;
  if ('timeline' in body) patch.timeline_hint = str(body.timeline, 100) ?? null;

  if ('nextActionAt' in body) {
    const raw = body.nextActionAt;
    if (raw === null || raw === '') patch.next_action_at = null;
    else if (typeof raw === 'string' && !Number.isNaN(Date.parse(raw))) {
      patch.next_action_at = new Date(raw).toISOString();
    }
  }

  if (Array.isArray(body.services)) {
    patch.services = body.services.filter((s: unknown) => typeof s === 'string').slice(0, 20);
  }

  if (typeof body.note === 'string' && body.note.trim()) {
    patch.note = body.note.trim().slice(0, 2000);
  }

  return patch;
}

// ------------------------------------------------------------- route handlers

async function handleLogin(request: ApiRequest): Promise<ApiResult> {
  const outcome = await attemptLogin(request, request.body.password);

  switch (outcome.status) {
    case 'ok':
      return {
        status: 200,
        json: { ok: true },
        cookies: [sessionCookie(request, outcome.token)],
      };
    case 'unconfigured':
      return fail(
        503,
        'Admin access is not configured on the server. Set the ADMIN_PASSWORD environment variable in Vercel and redeploy.',
      );
    case 'throttled':
      return fail(
        429,
        `Too many failed attempts. Try again in ${outcome.retryAfterMinutes} minutes.`,
      );
    default:
      return fail(401, 'Incorrect password.');
  }
}

async function handleAuthed(
  request: ApiRequest,
  identity: AdminIdentity,
  parts: string[],
): Promise<ApiResult> {
  const [head, second] = parts;

  // ------------------------------------------------------------------ leads
  if (head === 'leads') {
    if (!second) {
      if (request.method !== 'GET') return fail(405, 'Method Not Allowed');
      const result = await listLeads(readFilters(request));
      if (!result) return dbError();
      const filters = readFilters(request);
      return ok({
        leads: result.rows,
        total: result.total,
        page: filters.page,
        pageSize: filters.pageSize,
      });
    }

    if (request.method === 'GET') {
      const detail = await getLeadDetail(second);
      if (!detail) return fail(404, 'Lead not found.');
      return ok({ ...detail });
    }

    if (request.method === 'PATCH') {
      const patch = readPatch(request.body);
      if (Object.keys(patch).length === 0) return fail(400, 'Nothing to update.');
      const updated = await updateLead(second, patch, identity.actor);
      if (!updated) return fail(404, 'Lead not found.');
      return ok({ lead: updated });
    }

    if (request.method === 'DELETE') {
      const removed = await deleteLead(second, identity.actor);
      if (!removed) return fail(404, 'Lead not found.');
      return ok({ deleted: true });
    }

    return fail(405, 'Method Not Allowed');
  }

  // ---------------------------------------------------------- conversations
  if (head === 'conversations') {
    if (request.method !== 'GET') return fail(405, 'Method Not Allowed');

    if (second) {
      const detail = await getConversationTranscript(second);
      if (!detail) return fail(404, 'Conversation not found.');
      return ok({ ...detail });
    }

    const result = await listConversations({
      search: request.query.get('q')?.trim() || undefined,
      missedOnly: request.query.get('missedOnly') === 'true',
      page: Number(request.query.get('page')) || 1,
      pageSize: Number(request.query.get('pageSize')) || 25,
    });
    if (!result) return dbError();
    return ok({ conversations: result.rows, total: result.total });
  }

  // ------------------------------------------------------------------ stats
  if (head === 'stats') {
    const stats = await getDashboardStats();
    if (!stats) return dbError();
    return ok({ stats });
  }

  if (head === 'bot-health') {
    const health = await getBotHealth();
    if (!health) return dbError();
    return ok({ health });
  }

  // ----------------------------------------------------------------- export
  if (head === 'export') {
    const csv = await exportLeadsCsv(readFilters(request));
    if (csv === null) return dbError();
    const stamp = new Date().toISOString().slice(0, 10);
    return {
      status: 200,
      text: csv,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="digital-dude-leads-${stamp}.csv"`,
      },
    };
  }

  // --------------------------------------------------------------- settings
  if (head === 'health') {
    const db = await healthCheck();
    return ok({
      db,
      whatsapp: whatsappStatus(),
      gemini: { configured: Boolean(process.env.GEMINI_API_KEY?.trim()) },
      session: { actor: identity.actor, expiresAt: identity.expiresAt },
    });
  }

  if (head === 'migrate') {
    if (request.method !== 'POST') return fail(405, 'Method Not Allowed');
    try {
      const result = await migrate();
      return ok({ ...result });
    } catch (err) {
      return fail(500, err instanceof Error ? err.message : 'Migration failed.');
    }
  }

  if (head === 'test-whatsapp') {
    if (request.method !== 'POST') return fail(405, 'Method Not Allowed');
    const result = await sendTestAlert();
    return ok({ ...result });
  }

  if (head === 'notifications') {
    const rows = await listNotifications(Number(request.query.get('limit')) || 50);
    if (rows === null) return dbError();
    return ok({ notifications: rows });
  }

  if (head === 'purge') {
    if (request.method !== 'POST') return fail(405, 'Method Not Allowed');
    const days = Number(request.body.days);
    if (!Number.isFinite(days) || days < 7) {
      return fail(400, 'Retention window must be at least 7 days.');
    }
    const deleted = await purgeOldTranscripts(days);
    return ok({ deleted, days });
  }

  // Facet options for the dashboard's filter controls.
  if (head === 'options') {
    return ok({
      services: SERVICE_CATALOG.map(({ id, label }) => ({ id, label })),
      stages: LEAD_STAGES,
      temperatures: ['hot', 'warm', 'cold'],
      sources: ['chatbot', 'contact_form'],
    });
  }

  return fail(404, 'Unknown admin endpoint.');
}

export default async function handleAdmin(req: any, res?: any) {
  const request = await toApiRequest(req);

  if (request.method === 'OPTIONS') return preflight(res);

  const parts = segments(request);
  const head = parts[0];

  try {
    if (head === 'login') {
      if (request.method !== 'POST') return send(fail(405, 'Method Not Allowed'), res);
      return send(await handleLogin(request), res);
    }

    if (head === 'logout') {
      return send(
        { status: 200, json: { ok: true }, cookies: [clearedSessionCookie(request)] },
        res,
      );
    }

    const identity = requireAdmin(request);

    // Lets the dashboard decide between the login screen and the app on load.
    if (head === 'session') {
      return send(
        json(200, {
          ok: true,
          authenticated: Boolean(identity),
          actor: identity?.actor ?? null,
          expiresAt: identity?.expiresAt ?? null,
        }),
        res,
      );
    }

    if (!identity) return send(fail(401, 'Not signed in.'), res);

    return send(await handleAuthed(request, identity, parts), res);
  } catch (err) {
    console.error('[admin] unhandled error', err instanceof Error ? err.stack : err);
    return send(fail(500, 'Something went wrong handling that request.'), res);
  }
}
