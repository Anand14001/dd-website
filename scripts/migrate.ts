/**
 * Applies the lead database schema.
 *
 *   npm run db:migrate
 *
 * Idempotent, so it is safe to re-run after a schema change. The same migration
 * is also available from the dashboard's Settings tab, which is handier on
 * production where DATABASE_URL lives in Vercel rather than a local .env.
 */
import 'dotenv/config';
import { healthCheck, migrate } from '../api/_lib/db.js';

async function main() {
  const before = await healthCheck();

  if (!before.configured) {
    console.error('DATABASE_URL is not set. Add it to .env (see .env.example) and try again.');
    process.exit(1);
  }

  if (!before.reachable) {
    console.error(`Could not reach the database: ${before.error ?? 'unknown error'}`);
    process.exit(1);
  }

  console.log(before.migrated ? 'Schema present — applying updates…' : 'Creating schema…');

  const result = await migrate();
  console.log(`Done. ${result.applied}/${result.statements} statements applied.`);

  const after = await healthCheck();
  console.log(`Verified: tables ${after.migrated ? 'present' : 'MISSING'}.`);
}

main().catch((err) => {
  console.error('Migration failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
