/**
 * Request/response plumbing shared by every API route.
 *
 * The same handlers run in three shapes: Vercel's Node adapter (req, res),
 * Vercel's Web adapter (Request -> Response), and the Vite dev middleware
 * (IncomingMessage, ServerResponse). Handlers below work against the
 * normalised `ApiRequest`/`ApiResult` pair, and the adapters at the bottom
 * translate to whichever shape the runtime handed us.
 */

export interface ApiRequest {
  method: string;
  /** Pathname only, no query string. */
  path: string;
  query: URLSearchParams;
  headers: Record<string, string>;
  body: Record<string, any>;
  /** Best-effort client IP, used for rate limiting and coarse geography. */
  ip: string;
}

export interface ApiResult {
  status: number;
  /** Serialised as JSON unless `text` is set. */
  json?: unknown;
  text?: string;
  headers?: Record<string, string>;
  /** Raw Set-Cookie values. */
  cookies?: string[];
}

export const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

export const json = (status: number, body: unknown): ApiResult => ({ status, json: body });

export const ok = (body: Record<string, unknown> = {}): ApiResult => json(200, { ok: true, ...body });

export const fail = (status: number, error: string, extra: Record<string, unknown> = {}): ApiResult =>
  json(status, { ok: false, error, ...extra });

function headerValue(raw: unknown): string {
  if (Array.isArray(raw)) return raw[0] ?? '';
  return typeof raw === 'string' ? raw : '';
}

/** Normalises headers from either a Headers instance or a Node headers object. */
function collectHeaders(req: any): Record<string, string> {
  const out: Record<string, string> = {};
  const h = req?.headers;
  if (!h) return out;
  if (typeof h.forEach === 'function' && typeof h.get === 'function') {
    h.forEach((value: string, key: string) => {
      out[key.toLowerCase()] = value;
    });
    return out;
  }
  for (const [key, value] of Object.entries(h)) {
    out[key.toLowerCase()] = headerValue(value);
  }
  return out;
}

function clientIp(headers: Record<string, string>, req: any): string {
  const forwarded = headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return headers['x-real-ip'] || req?.socket?.remoteAddress || '0.0.0.0';
}

/** Reads and JSON-parses a body from any of the three runtime shapes. */
async function parseBody(req: any): Promise<Record<string, any>> {
  if (typeof req?.json === 'function') {
    try {
      return (await req.json()) ?? {};
    } catch {
      return {};
    }
  }

  if (req?.body !== undefined && req?.body !== null) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
  }

  if (typeof req?.on !== 'function') return {};

  const declaredLength = parseInt(req.headers?.['content-length'] || '0', 10);

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let received = 0;
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        resolve(chunks.length > 0 ? JSON.parse(Buffer.concat(chunks).toString('utf8')) : {});
      } catch {
        resolve({});
      }
    };

    const timer = setTimeout(finish, 2000);

    req.on('data', (chunk: Buffer | string) => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      chunks.push(buf);
      received += buf.length;
      if (declaredLength > 0 && received >= declaredLength) finish();
    });
    req.on('end', finish);
    req.on('error', finish);
  });
}

/** Builds the normalised request. Body is only read for methods that carry one. */
export async function toApiRequest(req: any): Promise<ApiRequest> {
  const headers = collectHeaders(req);
  const method = (req?.method || 'GET').toUpperCase();
  const rawUrl: string = req?.url || '/';
  const base = `http://${headers.host || 'localhost'}`;
  const parsed = new URL(rawUrl.startsWith('http') ? rawUrl : `${base}${rawUrl}`);

  const body = method === 'POST' || method === 'PATCH' || method === 'PUT' ? await parseBody(req) : {};

  return {
    method,
    path: parsed.pathname,
    query: parsed.searchParams,
    headers,
    body: body ?? {},
    ip: clientIp(headers, req),
  };
}

/** Reads a single cookie out of the request's Cookie header. */
export function readCookie(req: ApiRequest, name: string): string | null {
  const raw = req.headers.cookie;
  if (!raw) return null;
  for (const part of raw.split(';')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    if (part.slice(0, idx).trim() === name) {
      return decodeURIComponent(part.slice(idx + 1).trim());
    }
  }
  return null;
}

function resultHeaders(result: ApiResult): Record<string, string> {
  return {
    'Content-Type': result.text !== undefined ? 'text/plain; charset=utf-8' : 'application/json',
    ...CORS_HEADERS,
    ...(result.headers || {}),
  };
}

function resultBody(result: ApiResult): string {
  if (result.text !== undefined) return result.text;
  return JSON.stringify(result.json ?? {});
}

/**
 * Writes an ApiResult to whichever response channel the runtime provided.
 * Returns a Response when running on the Web adapter (no `res` argument).
 */
export function send(result: ApiResult, res?: any): any {
  const headers = resultHeaders(result);

  if (!res) {
    const webHeaders = new Headers(headers);
    for (const cookie of result.cookies || []) webHeaders.append('Set-Cookie', cookie);
    return new Response(resultBody(result), { status: result.status, headers: webHeaders });
  }

  for (const [key, value] of Object.entries(headers)) res.setHeader(key, value);
  if (result.cookies?.length) res.setHeader('Set-Cookie', result.cookies);

  if (typeof res.status === 'function' && typeof res.send === 'function') {
    return res.status(result.status).send(resultBody(result));
  }
  res.statusCode = result.status;
  return res.end(resultBody(result));
}

/** Standard CORS preflight reply. */
export function preflight(res?: any): any {
  return send({ status: 204, text: '' }, res);
}

type WaitUntil = (task: Promise<unknown>) => void;

// `undefined` means "not looked up yet", `null` means "not available here".
let cachedWaitUntil: WaitUntil | null | undefined;

async function resolveWaitUntil(): Promise<WaitUntil | null> {
  if (cachedWaitUntil !== undefined) return cachedWaitUntil;

  // Only on Vercel. The package imports fine anywhere, but off-platform there is
  // no request context to extend, so handing it the promise neither blocks nor
  // guarantees completion — background writes would silently race each other.
  if (!process.env.VERCEL) {
    cachedWaitUntil = null;
    return cachedWaitUntil;
  }

  try {
    const mod = await import('@vercel/functions');
    cachedWaitUntil = typeof mod.waitUntil === 'function' ? (mod.waitUntil as WaitUntil) : null;
  } catch {
    cachedWaitUntil = null;
  }
  return cachedWaitUntil;
}

/**
 * Keeps background work alive past the response.
 *
 * On Vercel this hands the promise to the platform so the visitor is not kept
 * waiting on lead persistence or a WhatsApp call. Anywhere else (the Vite dev
 * middleware) it awaits, which is slower but never drops the work — losing a
 * lead to a fire-and-forget promise is the exact failure this avoids.
 */
export async function afterResponse(task: Promise<unknown>): Promise<void> {
  const guarded = task.catch((err) => {
    console.error('[afterResponse] background task failed', err);
  });

  const waitUntil = await resolveWaitUntil();
  if (waitUntil) {
    waitUntil(guarded);
    return;
  }
  await guarded;
}
