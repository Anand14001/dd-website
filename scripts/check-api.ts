/**
 * End-to-end check of the HTTP handlers against a real database.
 *
 * Calls the exported Vercel handlers directly with mock req/res objects, with an
 * in-process Postgres behind them. This covers the part neither other suite
 * does: routing, the admin session gate, query-string parsing, status codes and
 * response bodies, all over the same code Vercel deploys.
 *
 *   npx tsx scripts/check-api.ts
 */
import { PGlite } from '@electric-sql/pglite';
import { setClientOverride, migrate } from '../api/_lib/db.js';
import handleAdmin from '../api/_lib/adminRouter.js';
import leadsHandler from '../api/leads.js';
import contactHandler from '../api/contact.js';

let failures = 0;

function check(label: string, condition: boolean, detail?: unknown) {
  if (!condition) failures += 1;
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${label}`);
  if (!condition && detail !== undefined) console.log(`      got: ${JSON.stringify(detail)}`);
}

interface MockResponse {
  statusCode: number;
  headers: Record<string, string | string[]>;
  body: string;
}

/** Minimal Node-style response that records what the handler wrote. */
function createResponse(): { res: any; out: MockResponse } {
  const out: MockResponse = { statusCode: 0, headers: {}, body: '' };
  const res = {
    statusCode: 0,
    setHeader(name: string, value: string | string[]) {
      out.headers[name.toLowerCase()] = value;
    },
    end(payload?: string) {
      out.statusCode = res.statusCode;
      out.body = payload ?? '';
      return res;
    },
  };
  return { res, out };
}

type Handler = (req: any, res: any) => unknown;

async function call(
  handler: Handler,
  options: { method: string; url: string; body?: unknown; cookie?: string },
): Promise<{ status: number; json: any; text: string; headers: Record<string, any> }> {
  const { res, out } = createResponse();
  await handler(
    {
      method: options.method,
      url: options.url,
      headers: {
        host: 'localhost:3000',
        'user-agent': 'check-api',
        ...(options.cookie ? { cookie: options.cookie } : {}),
      },
      body: options.body ?? undefined,
    },
    res,
  );

  let json: any = null;
  try {
    json = out.body ? JSON.parse(out.body) : null;
  } catch {
    json = null;
  }
  return { status: out.statusCode, json, text: out.body, headers: out.headers };
}

/** Pulls the session value out of a Set-Cookie header. */
function cookieFrom(headers: Record<string, any>): string {
  const raw = headers['set-cookie'];
  const value = Array.isArray(raw) ? raw[0] : raw;
  return String(value ?? '').split(';')[0];
}

async function main() {
  process.env.ADMIN_PASSWORD = 'Admin@123';

  const pg = new PGlite();
  await pg.waitReady;
  setClientOverride({
    query: async (text: string, params: unknown[] = []) =>
      (await pg.query(text, params as any[])).rows as any[],
  });
  await migrate();

  // ------------------------------------------------------------------- auth
  const noSession = await call(handleAdmin, { method: 'GET', url: '/api/admin/stats' });
  check('admin stats rejects anonymous request', noSession.status === 401, noSession.status);

  const badLogin = await call(handleAdmin, {
    method: 'POST',
    url: '/api/admin/login',
    body: { password: 'Admin@124' },
  });
  check('wrong password rejected', badLogin.status === 401, badLogin.json);

  const login = await call(handleAdmin, {
    method: 'POST',
    url: '/api/admin/login',
    body: { password: 'Admin@123' },
  });
  check('correct password accepted', login.status === 200, login.json);

  const setCookie = String(
    Array.isArray(login.headers['set-cookie'])
      ? login.headers['set-cookie'][0]
      : login.headers['set-cookie'],
  );
  check('cookie is HttpOnly', setCookie.includes('HttpOnly'));
  check('cookie is SameSite=Strict', setCookie.includes('SameSite=Strict'));
  const cookie = cookieFrom(login.headers);

  // Five failures should trip the throttle.
  for (let attempt = 0; attempt < 5; attempt += 1) {
    await call(handleAdmin, {
      method: 'POST',
      url: '/api/admin/login',
      body: { password: 'nope' },
    });
  }
  const throttled = await call(handleAdmin, {
    method: 'POST',
    url: '/api/admin/login',
    body: { password: 'Admin@123' },
  });
  check('login throttles after repeated failures', throttled.status === 429, throttled.json);

  // A correct password clears the counter, so earlier typos cannot lock you out later.
  await new Promise((resolve) => setTimeout(resolve, 10));
  const recovered = await call(handleAdmin, {
    method: 'POST',
    url: '/api/admin/login',
    body: { password: 'Admin@123' },
  });
  check(
    'throttle still blocks until the window passes',
    recovered.status === 429,
    recovered.status,
  );

  // --------------------------------------------------- public capture paths
  const capture = await call(leadsHandler, {
    method: 'POST',
    url: '/api/leads',
    body: {
      name: 'Anitha R',
      phone: '9876543211',
      sessionId: 'api-session-1',
      services: ['web_development'],
      budget: '50k-1L',
      timeline: 'ASAP',
      message: 'Need a website for my clinic, want to start this month',
      consent: true,
    },
  });
  check('capture card stored the lead', capture.status === 200 && capture.json?.stored === true, capture.json);

  const badCapture = await call(leadsHandler, {
    method: 'POST',
    url: '/api/leads',
    body: { name: 'X', phone: '123', consent: true },
  });
  check('capture card rejects a bad phone', badCapture.status === 400, badCapture.json);

  const contact = await call(contactHandler, {
    method: 'POST',
    url: '/api/contact',
    body: {
      name: 'Suresh',
      email: 'suresh@example.com',
      phone: '9123456780',
      message: 'Looking for Instagram reels and ads, budget around 40,000',
      services: ['Videography & Editing'],
    },
  });
  check('contact form stored the lead', contact.status === 200 && contact.json?.stored === true, contact.json);

  const invalidContact = await call(contactHandler, {
    method: 'POST',
    url: '/api/contact',
    body: { name: '', email: 'bad', message: '' },
  });
  check('contact form validates input', invalidContact.status === 400, invalidContact.json);

  // ---------------------------------------------------------- admin reads
  const leads = await call(handleAdmin, { method: 'GET', url: '/api/admin/leads', cookie });
  check('admin lists both leads', leads.json?.total === 2, leads.json?.total);

  const filtered = await call(handleAdmin, {
    method: 'GET',
    url: '/api/admin/leads?source=contact_form',
    cookie,
  });
  check('source filter applies', filtered.json?.total === 1, filtered.json?.total);

  const searched = await call(handleAdmin, {
    method: 'GET',
    url: '/api/admin/leads?q=anitha',
    cookie,
  });
  check('search filter applies', searched.json?.total === 1, searched.json?.total);

  const leadId = leads.json?.leads?.[0]?.id;
  const detail = await call(handleAdmin, {
    method: 'GET',
    url: `/api/admin/leads/${leadId}`,
    cookie,
  });
  check('lead detail returns a lead', Boolean(detail.json?.lead?.id), detail.status);

  const patched = await call(handleAdmin, {
    method: 'PATCH',
    url: `/api/admin/leads/${leadId}`,
    cookie,
    body: { stage: 'contacted', owner: 'Lalith', note: 'Called, sending quote.' },
  });
  check('patch updates the stage', patched.json?.lead?.stage === 'contacted', patched.json?.lead?.stage);
  check('patch records the note', patched.json?.lead?.notes?.length === 1, patched.json?.lead?.notes);

  const rejected = await call(handleAdmin, {
    method: 'PATCH',
    url: `/api/admin/leads/${leadId}`,
    cookie,
    body: { stage: 'not_a_real_stage' },
  });
  check('patch rejects an unknown stage', rejected.status === 400, rejected.json);

  const stats = await call(handleAdmin, { method: 'GET', url: '/api/admin/stats', cookie });
  check('stats endpoint returns data', stats.json?.stats?.leads?.total === 2, stats.json?.stats?.leads);

  const botHealth = await call(handleAdmin, { method: 'GET', url: '/api/admin/bot-health', cookie });
  check('bot-health endpoint returns data', Boolean(botHealth.json?.health), botHealth.status);

  const conversations = await call(handleAdmin, {
    method: 'GET',
    url: '/api/admin/conversations',
    cookie,
  });
  check('conversations endpoint returns data', Array.isArray(conversations.json?.conversations));

  const csv = await call(handleAdmin, { method: 'GET', url: '/api/admin/export', cookie });
  check('export returns csv content type', String(csv.headers['content-type']).includes('text/csv'));
  check(
    'export sets a download filename',
    String(csv.headers['content-disposition']).includes('attachment'),
    csv.headers['content-disposition'],
  );
  check('export body has header plus two rows', csv.text.split('\r\n').length === 3, csv.text.split('\r\n').length);

  const health = await call(handleAdmin, { method: 'GET', url: '/api/admin/health', cookie });
  check('health reports db migrated', health.json?.db?.migrated === true, health.json?.db);
  check('health reports whatsapp unconfigured here', health.json?.whatsapp?.configured === false);

  // Vercel may hand the catch-all segments over as repeated query params instead
  // of in the path, so the router must read either form.
  const viaQuery = await call(handleAdmin, {
    method: 'GET',
    url: '/api/admin?path=stats',
    cookie,
  });
  check('router accepts segments via the path query param', viaQuery.status === 200, viaQuery.status);

  const unknown = await call(handleAdmin, { method: 'GET', url: '/api/admin/nope', cookie });
  check('unknown admin endpoint returns 404', unknown.status === 404, unknown.status);

  // --------------------------------------------------------------- logout
  const logout = await call(handleAdmin, { method: 'POST', url: '/api/admin/logout', cookie });
  check('logout clears the cookie', cookieFrom(logout.headers) === 'dd_admin=', cookieFrom(logout.headers));

  const deleted = await call(handleAdmin, {
    method: 'DELETE',
    url: `/api/admin/leads/${leadId}`,
    cookie,
  });
  check('delete removes the lead', deleted.json?.deleted === true, deleted.json);

  await pg.close();
  console.log(failures === 0 ? '\nAll API checks passed.' : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('API check crashed:', err);
  process.exit(1);
});
