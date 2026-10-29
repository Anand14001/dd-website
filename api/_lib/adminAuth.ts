/**
 * Admin authentication.
 *
 * The password is only ever compared on the server, read from the
 * ADMIN_PASSWORD environment variable. It is never shipped to the browser, and
 * there is deliberately no fallback default: if the variable is missing, login
 * fails with a configuration error rather than accepting a value baked into the
 * repository.
 *
 * A successful login sets a stateless HMAC-signed cookie. Tampering with the
 * payload invalidates the signature, so no server-side session table is needed.
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { readCookie, type ApiRequest } from './http.js';
import { clearLoginFailures, countRecentLoginFailures, recordLoginAttempt } from './repository.js';

export const SESSION_COOKIE = 'dd_admin';

const MAX_FAILURES = 5;
const FAILURE_WINDOW_MINUTES = 15;

interface SessionPayload {
  sub: string;
  iat: number;
  exp: number;
}

function sessionHours(): number {
  const raw = Number(process.env.ADMIN_SESSION_HOURS);
  return Number.isFinite(raw) && raw > 0 && raw <= 720 ? raw : 8;
}

function adminPassword(): string | null {
  const raw = process.env.ADMIN_PASSWORD;
  if (!raw) return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/**
 * Signing key. Prefers an explicit secret, otherwise derives one from the
 * password so a single environment variable is enough to be secure. Changing
 * the password therefore invalidates existing sessions, which is the behaviour
 * we want.
 */
function signingKey(): string | null {
  const explicit = process.env.ADMIN_SESSION_SECRET?.trim();
  if (explicit) return explicit;
  const password = adminPassword();
  if (!password) return null;
  return createHash('sha256').update(`dd-admin-session:${password}`).digest('hex');
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, 'utf8').toString('base64url');
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, 'base64url').toString('utf8');
}

function sign(payload: string, key: string): string {
  return createHmac('sha256', key).update(payload).digest('hex');
}

/** Constant-time string comparison that tolerates differing lengths. */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a, 'utf8');
  const bufB = Buffer.from(b, 'utf8');
  if (bufA.length !== bufB.length) {
    // Still run a comparison so timing does not leak the length.
    timingSafeEqual(bufA, bufA);
    return false;
  }
  return timingSafeEqual(bufA, bufB);
}

export function createSessionToken(subject = 'admin'): string | null {
  const key = signingKey();
  if (!key) return null;
  const now = Date.now();
  const payload: SessionPayload = {
    sub: subject,
    iat: now,
    exp: now + sessionHours() * 60 * 60 * 1000,
  };
  const encoded = base64UrlEncode(JSON.stringify(payload));
  return `${encoded}.${sign(encoded, key)}`;
}

export function verifySessionToken(token: string | null): SessionPayload | null {
  if (!token) return null;
  const key = signingKey();
  if (!key) return null;

  const separator = token.lastIndexOf('.');
  if (separator <= 0) return null;

  const encoded = token.slice(0, separator);
  const signature = token.slice(separator + 1);
  if (!safeEqual(signature, sign(encoded, key))) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(encoded)) as SessionPayload;
    if (typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Local http needs the cookie without Secure, deployments must have it. */
function isSecureRequest(req: ApiRequest): boolean {
  const host = req.headers.host || '';
  if (host.startsWith('localhost') || host.startsWith('127.0.0.1')) return false;
  const proto = req.headers['x-forwarded-proto'];
  return proto ? proto.split(',')[0].trim() === 'https' : true;
}

export function sessionCookie(req: ApiRequest, token: string): string {
  const parts = [
    `${SESSION_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Strict',
    `Max-Age=${sessionHours() * 60 * 60}`,
  ];
  if (isSecureRequest(req)) parts.push('Secure');
  return parts.join('; ');
}

export function clearedSessionCookie(req: ApiRequest): string {
  const parts = [`${SESSION_COOKIE}=`, 'Path=/', 'HttpOnly', 'SameSite=Strict', 'Max-Age=0'];
  if (isSecureRequest(req)) parts.push('Secure');
  return parts.join('; ');
}

export interface AdminIdentity {
  actor: string;
  expiresAt: number;
}

/** Returns the signed-in admin, or null. Every /api/admin route calls this. */
export function requireAdmin(req: ApiRequest): AdminIdentity | null {
  const payload = verifySessionToken(readCookie(req, SESSION_COOKIE));
  if (!payload) return null;
  return { actor: payload.sub || 'admin', expiresAt: payload.exp };
}

export type LoginOutcome =
  | { status: 'ok'; token: string }
  | { status: 'unconfigured' }
  | { status: 'invalid' }
  | { status: 'throttled'; retryAfterMinutes: number };

/**
 * Verifies a submitted password.
 *
 * Throttling is backed by Postgres because serverless instances share no
 * memory. If the database is unavailable the throttle cannot be enforced, so
 * the attempt is still checked against the password but the lockout is skipped.
 */
export async function attemptLogin(req: ApiRequest, submitted: unknown): Promise<LoginOutcome> {
  const expected = adminPassword();
  if (!expected) return { status: 'unconfigured' };

  const failures = await countRecentLoginFailures(req.ip, FAILURE_WINDOW_MINUTES);
  if (failures >= MAX_FAILURES) {
    return { status: 'throttled', retryAfterMinutes: FAILURE_WINDOW_MINUTES };
  }

  const candidate = typeof submitted === 'string' ? submitted : '';
  if (!safeEqual(candidate, expected)) {
    await recordLoginAttempt(req.ip, false);
    return { status: 'invalid' };
  }

  await recordLoginAttempt(req.ip, true);
  await clearLoginFailures(req.ip);
  const token = createSessionToken('admin');
  if (!token) return { status: 'unconfigured' };
  return { status: 'ok', token };
}
