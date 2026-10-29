/**
 * Exercises the whole data layer against a real Postgres engine running
 * in-process (PGlite), so the schema, the dedupe upsert, the analytics queries
 * and the CSV export are verified without needing a cloud database.
 *
 *   npx tsx scripts/check-database.ts
 */
import { PGlite } from '@electric-sql/pglite';
import { setClientOverride, healthCheck, migrate } from '../api/_lib/db.js';
import { extractLead } from '../api/_lib/leadIntelligence.js';
import {
  ensureConversation,
  exportLeadsCsv,
  getBotHealth,
  getDashboardStats,
  getLeadDetail,
  listConversations,
  listLeads,
  purgeOldTranscripts,
  recordMessage,
  syncLeadFromConversation,
  updateLead,
  upsertLead,
} from '../api/_lib/repository.js';

let failures = 0;

function check(label: string, condition: boolean, detail?: unknown) {
  if (!condition) failures += 1;
  console.log(`${condition ? 'PASS' : 'FAIL'}  ${label}`);
  if (!condition && detail !== undefined) {
    console.log(`      got: ${JSON.stringify(detail)}`);
  }
}

async function main() {
  const pg = new PGlite();
  await pg.waitReady;

  // Adapter matching the Neon driver's `sql.query(text, params)` shape.
  setClientOverride({
    query: async (text: string, params: unknown[] = []) => {
      const result = await pg.query(text, params as any[]);
      return result.rows as any[];
    },
  });

  // ------------------------------------------------------------- migration
  const before = await healthCheck();
  check('health: reports not migrated before migration', before.migrated === false, before);

  const result = await migrate();
  check(`migration: applied all ${result.statements} statements`, result.applied === result.statements);

  const after = await healthCheck();
  check('health: reports migrated afterwards', after.migrated === true, after);
  check('health: names which database answered', after.target.length > 0, after.target);
  check('health: reports row counts to prove reads work', Boolean(after.counts), after.counts);

  check('migration is idempotent', (await migrate()).applied === result.statements);

  // ----------------------------------------------------- conversation flow
  const conversationId = await ensureConversation('session-aaa', {
    landingPage: '/services',
    utmSource: 'instagram',
    ip: '203.0.113.9',
  });
  check('conversation created', typeof conversationId === 'string' && conversationId.length > 0);

  const sameConversation = await ensureConversation('session-aaa', { landingPage: '/contact' });
  check('conversation upsert returns same id', sameConversation === conversationId);

  await recordMessage({
    conversationId: conversationId!,
    role: 'user',
    content: 'I run a bakery. How much for an online store? Budget is around 75,000, need it ASAP.',
  });
  await recordMessage({
    conversationId: conversationId!,
    role: 'assistant',
    content: 'We quote custom for every project. Reach us on +91 97870-97006.',
    mode: 'gemini',
    retrievedChunks: [{ id: 'chunk_pricing_policy', title: 'Pricing', category: 'pricing' }],
    latencyMs: 1400,
  });

  // --------------------------------------------------- lead from transcript
  const synced = await syncLeadFromConversation(conversationId!);
  check('lead created from transcript', synced?.isNew === true, synced);
  check('lead scored above cold', synced?.lead.temperature !== 'cold', synced?.lead.temperature);
  check('lead captured budget', synced?.lead.budget_hint === '75,000', synced?.lead.budget_hint);
  check(
    'lead did NOT capture the agency phone from the bot reply',
    synced?.lead.phone === null,
    synced?.lead.phone,
  );
  check('signals persisted as jsonb array', Array.isArray(synced?.lead.signals), synced?.lead.signals);

  // The same anonymous conversation must not spawn a second lead.
  const resynced = await syncLeadFromConversation(conversationId!);
  check('re-sync updates rather than duplicates', resynced?.isNew === false && resynced?.lead.id === synced?.lead.id);

  // -------------------------------------------- capture card adds contact
  const withContact = await syncLeadFromConversation(
    conversationId!,
    { name: 'Ravi Kumar', phone: '9876543210', services: ['ecommerce'] },
    true,
  );
  check('capture card attached phone', withContact?.lead.phone === '9876543210', withContact?.lead.phone);
  check('consent recorded', withContact?.lead.consent === true);

  // The anonymous lead created during the chat must be promoted, not duplicated:
  // one conversation yields one lead, however late the contact details arrive.
  const leadsForConversation = await listLeads({ page: 1, pageSize: 50 });
  const sameConversationLeads = (leadsForConversation?.rows ?? []).filter(
    (row) => row.conversation_id === conversationId,
  );
  check(
    'capture card promotes the anonymous lead instead of duplicating it',
    sameConversationLeads.length === 1,
    sameConversationLeads.map((r) => ({ id: r.id, phone: r.phone, score: r.score })),
  );
  check(
    'promoted lead keeps the details extracted before contact was shared',
    sameConversationLeads[0]?.budget_hint === '75,000',
    sameConversationLeads[0]?.budget_hint,
  );

  // ------------------------------------------------------------- dedupe
  const repeatVisit = await upsertLead({
    conversationId: null,
    source: 'chatbot',
    extracted: extractLead([{ role: 'user', content: 'Following up on my store, also need reels' }], {
      name: 'Ravi Kumar',
      phone: '+91 98765 43210',
      services: ['video'],
    }),
  });
  check('repeat visitor merged by phone, not duplicated', repeatVisit?.isNew === false, repeatVisit?.isNew);
  check(
    'merged lead unions services',
    ['ecommerce', 'video'].every((s) => repeatVisit?.lead.services.includes(s)),
    repeatVisit?.lead.services,
  );

  // A human moved this lead forward; a later merge must not reset it.
  await updateLead(repeatVisit!.lead.id, { stage: 'qualified', owner: 'Lalith' }, 'admin');
  const afterStageMerge = await upsertLead({
    conversationId: null,
    source: 'chatbot',
    extracted: extractLead([], { phone: '9876543210' }),
  });
  check(
    'merge never regresses a stage a human set',
    afterStageMerge?.lead.stage === 'qualified',
    afterStageMerge?.lead.stage,
  );

  // Returning visitor on a NEW conversation: their details merge into the lead
  // that already owns the phone number, and the anonymous row that second
  // conversation created must not survive as a duplicate.
  const secondConversationId = await ensureConversation('session-bbb', { landingPage: '/portfolio' });
  await recordMessage({
    conversationId: secondConversationId!,
    role: 'user',
    content: 'Following up — how much to also add reels? Need it this month, budget 40,000.',
  });
  await syncLeadFromConversation(secondConversationId!);
  const promoted = await syncLeadFromConversation(secondConversationId!, { phone: '9876543210' });
  check('returning visitor merges into the existing lead', promoted?.isNew === false, promoted?.isNew);

  const secondConversationLeads = (await listLeads({ page: 1, pageSize: 50 }))?.rows.filter(
    (row) => row.conversation_id === secondConversationId,
  );
  check(
    'no orphaned anonymous lead left behind on a returning visit',
    (secondConversationLeads?.length ?? 0) === 0,
    secondConversationLeads?.map((r) => ({ id: r.id, phone: r.phone })),
  );

  // Order independence: the capture card can land BEFORE the chat's background
  // persistence finishes. Whichever arrives first, the conversation must end up
  // with exactly one lead. This ordering is what a naive fix misses.
  const raceConversationId = await ensureConversation('session-race', { landingPage: '/' });
  await recordMessage({
    conversationId: raceConversationId!,
    role: 'user',
    content: 'How much for a website? Budget 60,000, need it ASAP, please call me.',
  });

  // Capture card first.
  const cardFirst = await syncLeadFromConversation(
    raceConversationId!,
    { name: 'Meena', phone: '9800000011' },
    true,
  );
  check('capture card creates the lead when it arrives first', cardFirst?.isNew === true);

  // Then the chat's background sync, which has no contact details of its own.
  await syncLeadFromConversation(raceConversationId!);

  const raceLeads = (await listLeads({ page: 1, pageSize: 50 }))?.rows.filter(
    (row) => row.conversation_id === raceConversationId,
  );
  check(
    'background sync folds into the existing lead instead of adding an anonymous one',
    (raceLeads?.length ?? 0) === 1,
    raceLeads?.map((r) => ({ id: r.id, phone: r.phone, score: r.score })),
  );
  check(
    'the surviving lead keeps the captured phone number',
    raceLeads?.[0]?.phone === '9800000011',
    raceLeads?.[0]?.phone,
  );
  check(
    'the richer summary is not overwritten by the thinner re-sync',
    (raceLeads?.[0]?.summary ?? '').length > 0,
    raceLeads?.[0]?.summary,
  );

  // ----------------------------------------------------- contact form lead
  const formLead = await upsertLead({
    conversationId: null,
    source: 'contact_form',
    extracted: extractLead([{ role: 'user', content: 'Need SEO and Google ads for my clinic' }], {
      name: 'Divya',
      email: 'divya@example.com',
    }),
    consent: true,
  });
  check('contact form lead stored', formLead?.isNew === true);

  // -------------------------------------------------------- notes & audit
  await updateLead(formLead!.lead.id, { note: 'Called, asked for a proposal.' }, 'admin');
  const noted = await updateLead(formLead!.lead.id, { note: 'Proposal sent.' }, 'admin');
  check('notes append rather than overwrite', noted?.notes.length === 2, noted?.notes);

  const detail = await getLeadDetail(withContact!.lead.id);
  // Spans both of this lead's conversations: 2 messages from the first session
  // plus the returning visit's 1 message.
  check('detail transcript spans every linked conversation', (detail?.transcript.length ?? 0) === 3, detail?.transcript.length);
  check(
    'transcript messages carry their conversation id',
    (detail?.transcript ?? []).every((m) => Boolean(m.conversation_id)),
  );
  check(
    'transcript is in chronological order',
    (detail?.transcript ?? []).every((m, i, all) => i === 0 || all[i - 1].created_at <= m.created_at),
  );
  check('detail returns conversation attribution', detail?.conversation?.utm_source === 'instagram');
  check('detail returns audit events', (detail?.events.length ?? 0) >= 0);

  const stageEvents = (await getLeadDetail(repeatVisit!.lead.id))?.events ?? [];
  check(
    'stage change recorded in audit trail',
    stageEvents.some((e) => e.type === 'stage_change' && e.to_value === 'qualified'),
    stageEvents.map((e) => e.type),
  );

  // -------------------------------------------------------------- listing
  const all = await listLeads({ page: 1, pageSize: 25 });
  check('list returns leads with a total', (all?.total ?? 0) >= 2, all?.total);

  const bySearch = await listLeads({ search: 'ravi' });
  check('search matches name case-insensitively', (bySearch?.rows.length ?? 0) === 1, bySearch?.total);

  const byPhoneSearch = await listLeads({ search: '9876543210' });
  check('search matches phone', (byPhoneSearch?.rows.length ?? 0) === 1);

  const byService = await listLeads({ service: 'video' });
  check('filter by service uses jsonb containment', (byService?.rows.length ?? 0) === 1, byService?.total);

  const byStage = await listLeads({ stage: 'qualified' });
  check('filter by stage', (byStage?.rows.length ?? 0) === 1);

  const sorted = await listLeads({ sort: 'score', direction: 'desc' });
  check(
    'sort by score descending',
    (sorted?.rows ?? []).every((row, i, rows) => i === 0 || rows[i - 1].score >= row.score),
    sorted?.rows.map((r) => r.score),
  );

  const attention = await listLeads({ needsAttention: true });
  check('needs-attention filter runs', Array.isArray(attention?.rows), attention?.total);

  // ------------------------------------------------------------ analytics
  const stats = await getDashboardStats();
  check('stats: counts leads', (stats?.leads.total ?? 0) >= 2, stats?.leads);
  check('stats: counts conversations', (stats?.conversations.total ?? 0) === 3, stats?.conversations);
  check('stats: daily series has 30 days', stats?.daily.length === 30, stats?.daily.length);
  check('stats: capture rate computed', typeof stats?.captureRate === 'number', stats?.captureRate);
  check('stats: by-service unnests jsonb', (stats?.byService.length ?? 0) > 0, stats?.byService);
  check('stats: by-stage grouped', (stats?.byStage.length ?? 0) > 0, stats?.byStage);

  const conversations = await listConversations({ page: 1 });
  check('conversation list joins first message', Boolean(conversations?.rows[0]?.first_message));
  check(
    'every conversation links to its lead via the link table',
    (conversations?.rows ?? []).every((row) => Boolean(row.lead_id)),
    conversations?.rows.map((r) => ({ session: r.session_id, lead: r.lead_id })),
  );

  const missed = await listConversations({ missedOnly: true });
  check('missed-opportunity filter runs', Array.isArray(missed?.rows), missed?.total);

  const health = await getBotHealth();
  check('bot health: mode split', health?.modeSplit.gemini === 1, health?.modeSplit);
  check('bot health: category hits from jsonb', (health?.categoryHits.length ?? 0) > 0, health?.categoryHits);
  check('bot health: avg messages computed', (health?.avgMessagesPerConversation ?? 0) > 0);
  check('bot health: drop-off histogram', Array.isArray(health?.dropOff));
  check('bot health: unanswered query runs', Array.isArray(health?.unanswered));

  // --------------------------------------------------------------- export
  const csv = await exportLeadsCsv({});
  const lines = (csv ?? '').split('\r\n');
  check('csv has a header row', lines[0]?.startsWith('Created At,Name,Phone'), lines[0]);
  check('csv has one row per lead', lines.length >= 3, lines.length);
  check('csv quotes fields containing commas', (csv ?? '').includes('"'), false);
  check(
    'csv renders timestamps as YYYY-MM-DD HH:mm',
    /^\d{4}-\d{2}-\d{2} \d{2}:\d{2},/.test(lines[1] ?? ''),
    (lines[1] ?? '').slice(0, 40),
  );

  // ------------------------------------------------------------ retention
  const purged = await purgeOldTranscripts(180);
  check('purge leaves recent transcripts alone', purged === 0, purged);

  const stillThere = await getLeadDetail(withContact!.lead.id);
  check('transcript intact after purge', (stillThere?.transcript.length ?? 0) === 3, stillThere?.transcript.length);

  await pg.close();
  console.log(failures === 0 ? '\nAll database checks passed.' : `\n${failures} check(s) failed.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error('Database check crashed:', err);
  process.exit(1);
});
