/**
 * POST /api/leads
 *
 * Receives the chat widget's contact-capture card. This is the highest-quality
 * capture path: the visitor typed the fields themselves and ticked consent, so
 * these values override anything the text extractor guessed.
 *
 * If the database is unavailable the visitor still gets a success response and
 * the WhatsApp alert is sent anyway, so the enquiry reaches the team.
 */
import { fail, ok, preflight, send, toApiRequest } from './_lib/http.js';
import { detectServices, extractLead, normalisePhone, type ProvidedLeadFields } from './_lib/leadIntelligence.js';
import { ensureConversation, syncLeadFromConversation, upsertLead } from './_lib/repository.js';
import { leadRowFromExtracted, notifyNewLead } from './_lib/whatsapp.js';

export const config = {
  maxDuration: 30,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max = 200): string | undefined {
  if (typeof value !== 'string') return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed.slice(0, max) : undefined;
}

export default async function handler(req: any, res?: any) {
  const request = await toApiRequest(req);

  if (request.method === 'OPTIONS') return preflight(res);
  if (request.method !== 'POST') return send(fail(405, 'Method Not Allowed'), res);

  const body = request.body;
  const name = text(body.name, 120);
  const rawPhone = text(body.phone, 30);
  const email = text(body.email, 160)?.toLowerCase();
  const phone = rawPhone ? normalisePhone(rawPhone) : undefined;

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Please tell us your name.';
  if (!rawPhone && !email) errors.phone = 'A WhatsApp number or email is required.';
  if (rawPhone && !phone) errors.phone = 'That does not look like a valid Indian mobile number.';
  if (email && !EMAIL_RE.test(email)) errors.email = 'That email address looks wrong.';

  if (Object.keys(errors).length > 0) {
    return send({ status: 400, json: { ok: false, errors } }, res);
  }

  // Service pills arrive as catalog ids; free text is keyword-matched as a backup.
  const requested = Array.isArray(body.services) ? body.services.filter((s: unknown) => typeof s === 'string') : [];
  const extraContext = [text(body.message, 1000), text(body.businessType, 120)].filter(Boolean).join(' ');

  const provided: ProvidedLeadFields = {
    name,
    email,
    phone,
    company: text(body.company, 160),
    businessType: text(body.businessType, 120),
    services: Array.from(new Set([...requested, ...detectServices(extraContext)])),
    budgetHint: text(body.budget, 80),
    timelineHint: text(body.timeline, 80),
  };

  const consent = body.consent === true;
  const sessionId = text(body.sessionId, 64);

  try {
    let result: Awaited<ReturnType<typeof upsertLead>> = null;

    if (sessionId) {
      const conversationId = await ensureConversation(sessionId, {
        userAgent: request.headers['user-agent']?.slice(0, 500),
        ip: request.ip,
      });
      if (conversationId) {
        // Re-derives from the stored transcript so the lead keeps the context of
        // the conversation, with these fields taking precedence.
        result = await syncLeadFromConversation(conversationId, provided, consent);
      }
    }

    if (!result) {
      const turns = text(body.message, 1000)
        ? [{ role: 'user' as const, content: text(body.message, 1000)! }]
        : [];
      result = await upsertLead({
        conversationId: null,
        source: 'chatbot',
        extracted: extractLead(turns, provided),
        consent,
      });
    }

    if (result) {
      if (result.isNew) await notifyNewLead(result.lead);
      return send(ok({ leadId: result.lead.id, stored: true }), res);
    }

    // Database unavailable: alert the team so the lead is not lost, and do not
    // show the visitor an error they can do nothing about.
    const extracted = extractLead([], provided);
    console.error('[leads] could not persist lead, alerting only', { name, phone, email });
    await notifyNewLead(leadRowFromExtracted(extracted, 'chatbot'));
    return send(ok({ stored: false }), res);
  } catch (err) {
    console.error('[leads] unexpected failure', err instanceof Error ? err.message : err);
    return send(ok({ stored: false }), res);
  }
}

export async function OPTIONS(req?: any, res?: any) {
  return handler(req || { method: 'OPTIONS' }, res);
}

export async function POST(req: any, res?: any) {
  if (req && !req.method) req.method = 'POST';
  return handler(req, res);
}
