/**
 * Reports whether the lead database is genuinely connected and usable.
 *
 *   npm run db:status
 *
 * Reads DATABASE_URL from .env. To check production, run it with that database's
 * connection string:
 *
 *   DATABASE_URL="postgresql://..." npm run db:status
 *
 * It does more than open a socket: it confirms the tables exist, counts rows, and
 * performs a real write-then-delete so a read-only or misconfigured connection
 * cannot pass as healthy.
 */
import 'dotenv/config';
import { healthCheck, isDbConfigured, query } from '../api/_lib/db.js';

async function main() {
  if (!isDbConfigured()) {
    console.log('NOT CONNECTED — DATABASE_URL is not set.\n');
    console.log('Add it to .env for local development, or in Vercel for production.');
    console.log('Without it the site still works, but no leads are stored.');
    process.exit(1);
  }

  const health = await healthCheck();

  console.log(`Target     : ${health.target}`);
  console.log(`Driver     : ${health.driver === 'local' ? 'local dev (PGlite)' : 'Neon Postgres'}`);
  console.log(`Reachable  : ${health.reachable ? 'yes' : 'NO'}`);
  console.log(`Migrated   : ${health.migrated ? 'yes' : 'NO — run npm run db:migrate'}`);

  if (!health.reachable) {
    console.log(`\nError: ${health.error}`);
    process.exit(1);
  }

  if (!health.migrated) {
    console.log('\nConnected, but the tables do not exist yet. Run: npm run db:migrate');
    process.exit(1);
  }

  console.log(
    `Rows       : ${health.counts?.leads} leads, ${health.counts?.conversations} conversations, ` +
      `${health.counts?.messages} messages`,
  );

  // A write proves the credentials are not read-only, which a count cannot.
  const marker = `db-status-${Date.now()}`;
  const inserted = await query<{ id: string }>(
    `INSERT INTO conversations (session_id) VALUES ($1) RETURNING id`,
    [marker],
  );

  if (!inserted || inserted.length === 0) {
    console.log('\nWRITE FAILED — reads work but inserts do not. Check the role permissions.');
    process.exit(1);
  }

  await query(`DELETE FROM conversations WHERE id = $1`, [inserted[0].id]);
  console.log('Write test : passed (inserted and removed a temporary row)');

  console.log('\nCONNECTED — the database is reachable, migrated and writable.');

  if (health.driver === 'local') {
    console.log(
      '\nNote: this is the local development database in ./.pglite, not Neon.\n' +
        'Leads captured here stay on this machine. Set DATABASE_URL to use Neon.',
    );
  }
}

main().catch((err) => {
  console.error('Check failed:', err instanceof Error ? err.message : err);
  process.exit(1);
});
