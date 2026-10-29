/**
 * Dev-server API mount.
 *
 * This used to hold its own copy of the chatbot engine, knowledge base and
 * system prompt, which meant local behaviour could drift from production. It now
 * dispatches straight to the same handlers Vercel deploys from api/, so there is
 * a single code path and the admin dashboard works under `npm run dev`.
 */
import type { IncomingMessage, ServerResponse } from 'node:http';
import chatHandler from '../api/chat.js';
import contactHandler from '../api/contact.js';
import leadsHandler from '../api/leads.js';
import assistantInfoHandler from '../api/assistant/info.js';
import adminHandler from '../api/_lib/adminRouter.js';

type Handler = (req: any, res: any) => unknown;

/**
 * Local database for development.
 *
 * With no DATABASE_URL set, the dev server falls back to PGlite — Postgres
 * compiled to WebAssembly — persisted under ./.pglite. That means the admin
 * dashboard, lead capture and the analytics queries all work on localhost without
 * signing up for a cloud database, and the data survives a restart.
 *
 * Set DATABASE_URL in .env to point local development at the real Neon database
 * instead. This path only ever runs under Vite; Vercel executes the handlers in
 * api/ directly and never loads this file.
 */
let devDatabase: Promise<void> | null = null;

async function ensureDevDatabase(): Promise<void> {
  if (process.env.DATABASE_URL?.trim()) return;
  if (devDatabase) return devDatabase;

  devDatabase = (async () => {
    try {
      // Imported dynamically so `vite build` never pulls in the WASM bundle.
      const [{ PGlite }, { migrate, setClientOverride }] = await Promise.all([
        import('@electric-sql/pglite'),
        import('../api/_lib/db.js'),
      ]);

      const pg = new PGlite('./.pglite');
      await pg.waitReady;

      setClientOverride(
        {
          query: async (text: string, params: unknown[] = []) =>
            (await pg.query(text, params as any[])).rows as any[],
        },
        'local dev database (./.pglite)',
      );

      await migrate();
      console.log('[dev api] local PGlite database ready (./.pglite) — set DATABASE_URL to use Neon instead');
    } catch (err) {
      console.warn(
        '[dev api] could not start the local database; lead storage is disabled for this session:',
        err instanceof Error ? err.message : err,
      );
    }
  })();

  return devDatabase;
}

/** Longest-prefix match so /api/admin/leads/:id reaches the admin router. */
const ROUTES: { prefix: string; handler: Handler }[] = [
  { prefix: '/api/admin', handler: adminHandler },
  { prefix: '/api/assistant/info', handler: assistantInfoHandler },
  { prefix: '/api/chat/info', handler: assistantInfoHandler },
  { prefix: '/api/contact', handler: contactHandler },
  { prefix: '/api/leads', handler: leadsHandler },
  { prefix: '/api/chat', handler: chatHandler },
  { prefix: '/api/assistant', handler: chatHandler },
];

function matchRoute(pathname: string): Handler | null {
  for (const route of ROUTES) {
    if (pathname === route.prefix || pathname.startsWith(`${route.prefix}/`)) {
      return route.handler;
    }
  }
  return null;
}

/** Connect/Express-compatible middleware mounting the API routes. */
export async function apiMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): Promise<void> {
  const pathname = (req.url ?? '').split('?')[0];
  if (!pathname.startsWith('/api/')) return next();

  const handler = matchRoute(pathname);
  if (!handler) return next();

  await ensureDevDatabase();

  try {
    await handler(req, res);
  } catch (err) {
    console.error('[dev api] handler threw', err);
    if (!res.headersSent) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, error: 'Internal server error' }));
    }
  }
}
