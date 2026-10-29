/**
 * Neon Postgres access over HTTP.
 *
 * Two rules hold everywhere in this file:
 *  1. A missing or broken DATABASE_URL must never break the public site. Writes
 *     are best-effort and log instead of throwing; reads return null/empty.
 *  2. All values go through parameterised queries, never string interpolation.
 */
import { neon } from '@neondatabase/serverless';
import { createHash } from 'node:crypto';
import { SCHEMA_STATEMENTS } from './schema.js';

type SqlClient = ReturnType<typeof neon>;

let cached: SqlClient | null = null;
let cachedUrl: string | null = null;

/**
 * Replaces the driver with any client exposing `query(text, params)`.
 *
 * Used in two places, neither of them production: the check scripts point it at
 * an in-process Postgres so the SQL is exercised for real, and the Vite dev
 * middleware points it at a local PGlite database when DATABASE_URL is unset, so
 * the dashboard works on localhost without a cloud database. Vercel runs the
 * handlers in api/ directly and never calls this.
 */
let injectedClient: { query: (text: string, params?: unknown[]) => Promise<any[]> } | null = null;
let injectedLabel: string | null = null;

export function setClientOverride(
  client: { query: (text: string, params?: unknown[]) => Promise<any[]> } | null,
  label = 'local development database',
): void {
  injectedClient = client;
  injectedLabel = client ? label : null;
}

/**
 * Names the database actually in use, so "is it connected?" has a definite
 * answer rather than just a green tick. Hostname only — credentials are never
 * returned to the browser.
 */
export function describeTarget(): { driver: 'neon' | 'local'; target: string } {
  if (injectedClient) {
    return { driver: 'local', target: injectedLabel ?? 'local development database' };
  }
  const url = connectionString();
  if (!url) return { driver: 'neon', target: 'not configured' };
  try {
    const parsed = new URL(url);
    return { driver: 'neon', target: `${parsed.hostname}${parsed.pathname}` };
  } catch {
    return { driver: 'neon', target: 'unparseable connection string' };
  }
}

function connectionString(): string | null {
  const raw =
    process.env.DATABASE_URL?.trim() ||
    process.env.POSTGRES_URL?.trim() ||
    process.env.NEON_DATABASE_URL?.trim() ||
    '';
  if (!raw) return null;
  // Tolerate a value pasted with surrounding quotes.
  const unquoted =
    (raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))
      ? raw.slice(1, -1).trim()
      : raw;
  return unquoted || null;
}

export function isDbConfigured(): boolean {
  return injectedClient !== null || connectionString() !== null;
}

/** Returns a client, or null when the database is not configured. */
export function getSql(): SqlClient | null {
  if (injectedClient) return injectedClient as unknown as SqlClient;
  const url = connectionString();
  if (!url) return null;
  if (cached && cachedUrl === url) return cached;
  try {
    cached = neon(url);
    cachedUrl = url;
    return cached;
  } catch (err) {
    console.error('[db] failed to create client', err);
    return null;
  }
}

/**
 * Runs a parameterised query. Returns null on any failure (including an
 * unconfigured database) so callers can degrade instead of 500ing.
 */
export async function query<T = Record<string, any>>(
  text: string,
  params: unknown[] = [],
): Promise<T[] | null> {
  const sql = getSql();
  if (!sql) return null;
  try {
    const rows = await sql.query(text, params as any[]);
    return rows as T[];
  } catch (err) {
    console.error('[db] query failed', { text: text.slice(0, 120), err });
    return null;
  }
}

/** Same as `query` but for statements where a failure should surface (migrations). */
export async function queryStrict<T = Record<string, any>>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const sql = getSql();
  if (!sql) throw new Error('DATABASE_URL is not configured');
  const rows = await sql.query(text, params as any[]);
  return rows as T[];
}

export async function queryOne<T = Record<string, any>>(
  text: string,
  params: unknown[] = [],
): Promise<T | null> {
  const rows = await query<T>(text, params);
  return rows && rows.length > 0 ? rows[0] : null;
}

/** Applies the schema. Idempotent, so it is safe to re-run on every deploy. */
export async function migrate(): Promise<{ applied: number; statements: number }> {
  if (!isDbConfigured()) throw new Error('DATABASE_URL is not configured');
  let applied = 0;
  for (const statement of SCHEMA_STATEMENTS) {
    await queryStrict(statement);
    applied += 1;
  }
  return { applied, statements: SCHEMA_STATEMENTS.length };
}

/** Confirms the connection works and reports whether the schema is present. */
export interface DbHealth {
  configured: boolean;
  reachable: boolean;
  migrated: boolean;
  /** 'neon' for a real DATABASE_URL, 'local' for the dev-only PGlite fallback. */
  driver: 'neon' | 'local';
  /** Hostname and database name, or the label of the local fallback. */
  target: string;
  /** Row counts, proving reads actually work rather than just connecting. */
  counts?: { leads: number; conversations: number; messages: number };
  error?: string;
}

/**
 * Proves the database is genuinely usable: connected, migrated, and returning
 * real row counts. Reports which database answered, because a green tick that
 * does not say *which* one is how a local database gets mistaken for production.
 */
export async function healthCheck(): Promise<DbHealth> {
  const { driver, target } = describeTarget();

  if (!isDbConfigured()) {
    return { configured: false, reachable: false, migrated: false, driver, target };
  }

  try {
    const rows = await queryStrict<{ present: boolean }>(
      `SELECT EXISTS (
         SELECT 1 FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'leads'
       ) AS present`,
    );
    const migrated = Boolean(rows[0]?.present);

    if (!migrated) {
      return { configured: true, reachable: true, migrated: false, driver, target };
    }

    const counts = await queryStrict<{ leads: string; conversations: string; messages: string }>(
      `SELECT
         (SELECT count(*) FROM leads)::text         AS leads,
         (SELECT count(*) FROM conversations)::text AS conversations,
         (SELECT count(*) FROM messages)::text      AS messages`,
    );

    return {
      configured: true,
      reachable: true,
      migrated: true,
      driver,
      target,
      counts: {
        leads: Number(counts[0]?.leads ?? 0),
        conversations: Number(counts[0]?.conversations ?? 0),
        messages: Number(counts[0]?.messages ?? 0),
      },
    };
  } catch (err) {
    return {
      configured: true,
      reachable: false,
      migrated: false,
      driver,
      target,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

/**
 * Hashes an IP before storage. We need dedupe and coarse rate limiting, not the
 * address itself, so the raw value is never persisted.
 */
export function hashIp(ip: string): string {
  const salt = process.env.ADMIN_SESSION_SECRET || 'digital-dude-default-salt';
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}
