/**
 * Every database read and write for leads, conversations and admin analytics.
 *
 * Write paths are deliberately forgiving: if the database is unreachable the
 * public chat and contact form must still answer the visitor, so these return
 * null rather than throwing. Read paths used by the admin dashboard surface the
 * unconfigured state to the caller instead.
 */
import { query, queryOne, hashIp } from './db.js';
import {
  dedupeKey,
  extractLead,
  type ChatTurn,
  type ExtractedLead,
  type ProvidedLeadFields,
} from './leadIntelligence.js';

export const LEAD_STAGES = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
  'junk',
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number];

/** Stages that no longer need chasing. */
const CLOSED_STAGES = ['won', 'lost', 'junk'];

export interface LeadNote {
  at: string;
  author: string;
  text: string;
}

export interface LeadRow {
  id: string;
  conversation_id: string | null;
  source: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  company: string | null;
  business_type: string | null;
  services: string[];
  budget_hint: string | null;
  timeline_hint: string | null;
  summary: string | null;
  score: number;
  signals: { key: string; label: string; points: number }[];
  temperature: string;
  stage: string;
  owner: string | null;
  next_action_at: string | null;
  notes: LeadNote[];
  dedupe_key: string | null;
  consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationContext {
  landingPage?: string;
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  userAgent?: string;
  ip?: string;
}

// ---------------------------------------------------------------- conversations

/**
 * Finds or creates the conversation for a session id.
 * Context fields are only written on creation so the original landing page and
 * campaign attribution survive later messages.
 */
export async function ensureConversation(
  sessionId: string,
  context: ConversationContext = {},
): Promise<string | null> {
  if (!sessionId) return null;
  const row = await queryOne<{ id: string }>(
    `INSERT INTO conversations (
       session_id, landing_page, referrer, utm_source, utm_medium, utm_campaign, user_agent, ip_hash
     ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (session_id) DO UPDATE SET last_message_at = now()
     RETURNING id`,
    [
      sessionId,
      context.landingPage ?? null,
      context.referrer ?? null,
      context.utmSource ?? null,
      context.utmMedium ?? null,
      context.utmCampaign ?? null,
      context.userAgent ?? null,
      context.ip ? hashIp(context.ip) : null,
    ],
  );
  return row?.id ?? null;
}

export async function recordMessage(params: {
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  mode?: string | null;
  retrievedChunks?: unknown[];
  latencyMs?: number | null;
}): Promise<void> {
  const { conversationId, role, content, mode, retrievedChunks, latencyMs } = params;

  await query(
    `INSERT INTO messages (conversation_id, role, content, mode, retrieved_chunks, latency_ms)
     VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
    [
      conversationId,
      role,
      content,
      mode ?? null,
      JSON.stringify(retrievedChunks ?? []),
      latencyMs ?? null,
    ],
  );

  await query(
    `UPDATE conversations SET
       message_count   = message_count + 1,
       last_message_at = now(),
       gemini_count    = gemini_count + CASE WHEN $2 = 'gemini' THEN 1 ELSE 0 END,
       fallback_count  = fallback_count + CASE WHEN $2 = 'rule_fallback' THEN 1 ELSE 0 END
     WHERE id = $1`,
    [conversationId, mode ?? null],
  );
}

/** Full transcript in chronological order, used for extraction and the drawer. */
export async function getTranscript(conversationId: string): Promise<ChatTurn[]> {
  const rows = await query<{ role: 'user' | 'assistant'; content: string }>(
    `SELECT role, content FROM messages WHERE conversation_id = $1 ORDER BY created_at, id`,
    [conversationId],
  );
  return rows ?? [];
}

// ----------------------------------------------------------------------- leads

/** Links a conversation to a lead. Idempotent, so it is safe on every sync. */
async function linkConversation(leadId: string, conversationId: string | null): Promise<void> {
  if (!conversationId) return;
  await query(
    `INSERT INTO lead_conversations (lead_id, conversation_id)
     VALUES ($1, $2) ON CONFLICT DO NOTHING`,
    [leadId, conversationId],
  );
}

/**
 * Creates or merges a lead.
 *
 * Merging is keyed on normalised phone or email, so a visitor who comes back a
 * week later lands on their existing record instead of creating a duplicate. A
 * merge never downgrades a stage that a human has already moved forward.
 *
 * Returns the row plus whether this call created it, which is what decides
 * whether a WhatsApp alert goes out.
 */
export async function upsertLead(params: {
  conversationId: string | null;
  source: 'chatbot' | 'contact_form';
  extracted: ExtractedLead;
  consent?: boolean;
}): Promise<{ lead: LeadRow; isNew: boolean } | null> {
  const { conversationId, source, extracted, consent = false } = params;
  const key = dedupeKey(extracted.email, extracted.phone);

  const values = [
    conversationId,
    source,
    extracted.name ?? null,
    extracted.email ?? null,
    extracted.phone ?? null,
    extracted.company ?? null,
    extracted.businessType ?? null,
    JSON.stringify(extracted.services ?? []),
    extracted.budgetHint ?? null,
    extracted.timelineHint ?? null,
    extracted.summary ?? null,
    extracted.score,
    JSON.stringify(extracted.signals ?? []),
    extracted.temperature,
    key,
    consent,
  ];

  // Shared by both branches: keep whichever value is known, never regress.
  const mergeAssignments = `
    conversation_id = COALESCE(leads.conversation_id, EXCLUDED.conversation_id),
    name            = COALESCE(EXCLUDED.name, leads.name),
    email           = COALESCE(EXCLUDED.email, leads.email),
    phone           = COALESCE(EXCLUDED.phone, leads.phone),
    company         = COALESCE(EXCLUDED.company, leads.company),
    business_type   = COALESCE(EXCLUDED.business_type, leads.business_type),
    services        = (
      SELECT COALESCE(jsonb_agg(DISTINCT v), '[]'::jsonb)
      FROM jsonb_array_elements(leads.services || EXCLUDED.services) AS t(v)
    ),
    budget_hint     = COALESCE(EXCLUDED.budget_hint, leads.budget_hint),
    timeline_hint   = COALESCE(EXCLUDED.timeline_hint, leads.timeline_hint),
    summary         = COALESCE(EXCLUDED.summary, leads.summary),
    score           = GREATEST(leads.score, EXCLUDED.score),
    signals         = CASE WHEN EXCLUDED.score > leads.score
                           THEN EXCLUDED.signals ELSE leads.signals END,
    temperature     = CASE WHEN EXCLUDED.score > leads.score
                           THEN EXCLUDED.temperature ELSE leads.temperature END,
    consent         = leads.consent OR EXCLUDED.consent,
    updated_at      = now()`;

  if (key) {
    // A conversation usually produces an anonymous lead first (someone described
    // their project before sharing a number). Claim that row for this key so the
    // upsert below merges into it, instead of leaving an orphaned duplicate for
    // the same conversation. Skipped when another lead already owns the key,
    // which is the returning-visitor case handled after the upsert.
    if (conversationId) {
      await query(
        `UPDATE leads SET dedupe_key = $1
         WHERE conversation_id = $2
           AND dedupe_key IS NULL
           AND NOT EXISTS (SELECT 1 FROM leads existing WHERE existing.dedupe_key = $1)`,
        [key, conversationId],
      );
    }

    const row = await queryOne<LeadRow & { inserted: boolean }>(
      `INSERT INTO leads (
         conversation_id, source, name, email, phone, company, business_type,
         services, budget_hint, timeline_hint, summary, score, signals, temperature, dedupe_key, consent
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13::jsonb,$14,$15,$16)
       ON CONFLICT (dedupe_key) WHERE dedupe_key IS NOT NULL
       DO UPDATE SET ${mergeAssignments}
       RETURNING *, (xmax = 0) AS inserted`,
      values,
    );
    if (!row) return null;
    const { inserted, ...lead } = row;

    // Returning visitor: their details merged into the lead that already owned
    // this key, so any anonymous row still attached to this conversation is a
    // duplicate of data the surviving lead now holds.
    if (conversationId) {
      await query(
        `DELETE FROM leads
         WHERE conversation_id = $1 AND dedupe_key IS NULL AND id <> $2`,
        [conversationId, lead.id],
      );
    }

    await linkConversation(lead.id, conversationId);
    return { lead: lead as LeadRow, isNew: Boolean(inserted) };
  }

  // No contact details in this extraction: fold into whichever lead this
  // conversation already has. A keyed lead is preferred, because the capture
  // card may have landed first — persistence runs in the background, so the two
  // paths can complete in either order and neither may create a second row.
  if (conversationId) {
    const existing = await queryOne<{ id: string }>(
      `SELECT id FROM leads
       WHERE conversation_id = $1
       ORDER BY (dedupe_key IS NULL), created_at
       LIMIT 1`,
      [conversationId],
    );
    if (existing) {
      const updated = await queryOne<LeadRow>(
        `UPDATE leads SET
           name          = COALESCE($2, name),
           company       = COALESCE($3, company),
           business_type = COALESCE($4, business_type),
           services      = (
             SELECT COALESCE(jsonb_agg(DISTINCT v), '[]'::jsonb)
             FROM jsonb_array_elements(services || $5::jsonb) AS t(v)
           ),
           budget_hint   = COALESCE($6, budget_hint),
           timeline_hint = COALESCE($7, timeline_hint),
           -- Summary tracks the better-scoring extraction, so a thin re-sync
           -- cannot overwrite the richer one the capture card produced.
           summary       = CASE WHEN $9 > score THEN COALESCE($8, summary) ELSE summary END,
           score         = GREATEST(score, $9),
           signals       = CASE WHEN $9 > score THEN $11::jsonb ELSE signals END,
           temperature   = CASE WHEN $9 > score THEN $10 ELSE temperature END,
           updated_at    = now()
         WHERE id = $1
         RETURNING *`,
        [
          existing.id,
          extracted.name ?? null,
          extracted.company ?? null,
          extracted.businessType ?? null,
          JSON.stringify(extracted.services ?? []),
          extracted.budgetHint ?? null,
          extracted.timelineHint ?? null,
          extracted.summary ?? null,
          extracted.score,
          extracted.temperature,
          JSON.stringify(extracted.signals ?? []),
        ],
      );
      if (updated) await linkConversation(updated.id, conversationId);
      return updated ? { lead: updated, isNew: false } : null;
    }
  }

  const row = await queryOne<LeadRow>(
    `INSERT INTO leads (
       conversation_id, source, name, email, phone, company, business_type,
       services, budget_hint, timeline_hint, summary, score, signals, temperature, dedupe_key, consent
     ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8::jsonb,$9,$10,$11,$12,$13::jsonb,$14,$15,$16)
     RETURNING *`,
    values,
  );
  if (row) await linkConversation(row.id, conversationId);
  return row ? { lead: row, isNew: true } : null;
}

/**
 * Re-derives a lead from the stored transcript. Called after each assistant
 * reply so the dashboard reflects details the visitor revealed mid-conversation.
 */
export async function syncLeadFromConversation(
  conversationId: string,
  provided: ProvidedLeadFields = {},
  consent = false,
): Promise<{ lead: LeadRow; isNew: boolean } | null> {
  const transcript = await getTranscript(conversationId);
  if (transcript.length === 0) return null;

  const extracted = extractLead(transcript, provided);
  const hasProvidedContact = Boolean(provided.phone || provided.email);
  if (!extracted.isLeadWorthy && !hasProvidedContact) return null;

  return upsertLead({
    conversationId,
    source: 'chatbot',
    extracted,
    consent,
  });
}

export async function logLeadEvent(params: {
  leadId: string;
  type: string;
  field?: string;
  from?: string | null;
  to?: string | null;
  actor?: string;
}): Promise<void> {
  await query(
    `INSERT INTO lead_events (lead_id, type, field, from_value, to_value, actor)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      params.leadId,
      params.type,
      params.field ?? null,
      params.from ?? null,
      params.to ?? null,
      params.actor ?? 'system',
    ],
  );
}

// ------------------------------------------------------------- admin: listing

export interface LeadFilters {
  stage?: string;
  source?: string;
  service?: string;
  temperature?: string;
  owner?: string;
  search?: string;
  from?: string;
  to?: string;
  needsAttention?: boolean;
  sort?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

const SORTABLE: Record<string, string> = {
  created_at: 'l.created_at',
  updated_at: 'l.updated_at',
  score: 'l.score',
  name: 'l.name',
  stage: 'l.stage',
  next_action_at: 'l.next_action_at',
};

/** Builds the shared WHERE clause for list and export. */
function buildLeadWhere(filters: LeadFilters): { clause: string; params: unknown[] } {
  const conditions: string[] = [];
  const params: unknown[] = [];
  const push = (value: unknown) => {
    params.push(value);
    return `$${params.length}`;
  };

  if (filters.stage) conditions.push(`l.stage = ${push(filters.stage)}`);
  if (filters.source) conditions.push(`l.source = ${push(filters.source)}`);
  if (filters.temperature) conditions.push(`l.temperature = ${push(filters.temperature)}`);
  if (filters.owner) conditions.push(`l.owner = ${push(filters.owner)}`);
  if (filters.service) conditions.push(`l.services @> ${push(JSON.stringify([filters.service]))}::jsonb`);
  if (filters.from) conditions.push(`l.created_at >= ${push(filters.from)}`);
  if (filters.to) conditions.push(`l.created_at <= ${push(filters.to)}`);

  if (filters.search) {
    const needle = `%${filters.search.toLowerCase()}%`;
    const p = push(needle);
    conditions.push(`(
      lower(coalesce(l.name, ''))    LIKE ${p} OR
      lower(coalesce(l.email, ''))   LIKE ${p} OR
      coalesce(l.phone, '')          LIKE ${p} OR
      lower(coalesce(l.company, '')) LIKE ${p} OR
      lower(coalesce(l.summary, '')) LIKE ${p}
    )`);
  }

  if (filters.needsAttention) {
    conditions.push(`(
      (l.next_action_at IS NOT NULL AND l.next_action_at < now())
      OR (l.next_action_at IS NULL AND l.stage NOT IN ('won', 'lost', 'junk'))
    )`);
  }

  return {
    clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
    params,
  };
}

export async function listLeads(
  filters: LeadFilters,
): Promise<{ rows: LeadRow[]; total: number } | null> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, filters.pageSize ?? 25));
  const { clause, params } = buildLeadWhere(filters);

  const sortColumn = SORTABLE[filters.sort ?? 'created_at'] ?? 'l.created_at';
  const direction = filters.direction === 'asc' ? 'ASC' : 'DESC';

  const rows = await query<LeadRow>(
    `SELECT l.* FROM leads l
     ${clause}
     ORDER BY ${sortColumn} ${direction} NULLS LAST, l.id
     LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
    params,
  );
  if (rows === null) return null;

  const countRow = await queryOne<{ count: string }>(
    `SELECT count(*)::text AS count FROM leads l ${clause}`,
    params,
  );

  return { rows, total: Number(countRow?.count ?? rows.length) };
}

export interface LeadDetail {
  lead: LeadRow;
  transcript: {
    role: string;
    content: string;
    created_at: string;
    mode: string | null;
    retrieved_chunks: { id: string; title: string; category: string }[];
    conversation_id?: string;
  }[];
  events: {
    type: string;
    field: string | null;
    from_value: string | null;
    to_value: string | null;
    actor: string;
    created_at: string;
  }[];
  conversation: Record<string, any> | null;
}

export async function getLeadDetail(id: string): Promise<LeadDetail | null> {
  const lead = await queryOne<LeadRow>(`SELECT * FROM leads WHERE id = $1`, [id]);
  if (!lead) return null;

  // Spans every conversation linked to this lead, so a returning visitor's
  // later sessions are not lost from the drawer. conversation_id is carried on
  // each message so the UI can mark where a new session starts.
  const transcript = await query<LeadDetail['transcript'][number]>(
    `SELECT m.role, m.content, m.created_at, m.mode, m.retrieved_chunks, m.conversation_id
     FROM messages m
     WHERE m.conversation_id IN (
       SELECT conversation_id FROM lead_conversations WHERE lead_id = $1
       UNION
       SELECT $2::uuid WHERE $2 IS NOT NULL
     )
     ORDER BY m.created_at, m.id`,
    [id, lead.conversation_id],
  );

  const events = await query<LeadDetail['events'][number]>(
    `SELECT type, field, from_value, to_value, actor, created_at
     FROM lead_events WHERE lead_id = $1 ORDER BY created_at DESC LIMIT 100`,
    [id],
  );

  const conversation = lead.conversation_id
    ? await queryOne(`SELECT * FROM conversations WHERE id = $1`, [lead.conversation_id])
    : null;

  return {
    lead,
    transcript: transcript ?? [],
    events: events ?? [],
    conversation,
  };
}

export interface LeadPatch {
  stage?: string;
  owner?: string | null;
  next_action_at?: string | null;
  temperature?: string;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  business_type?: string | null;
  budget_hint?: string | null;
  timeline_hint?: string | null;
  services?: string[];
  note?: string;
}

const PATCHABLE_COLUMNS: (keyof LeadPatch)[] = [
  'stage',
  'owner',
  'next_action_at',
  'temperature',
  'name',
  'email',
  'phone',
  'company',
  'business_type',
  'budget_hint',
  'timeline_hint',
];

/** Applies an admin edit and records an audit event per changed field. */
export async function updateLead(
  id: string,
  patch: LeadPatch,
  actor: string,
): Promise<LeadRow | null> {
  const before = await queryOne<LeadRow>(`SELECT * FROM leads WHERE id = $1`, [id]);
  if (!before) return null;

  const assignments: string[] = [];
  const params: unknown[] = [id];
  const push = (value: unknown) => {
    params.push(value);
    return `$${params.length}`;
  };

  for (const column of PATCHABLE_COLUMNS) {
    if (patch[column] === undefined) continue;
    assignments.push(`${column} = ${push(patch[column])}`);
  }

  if (patch.services !== undefined) {
    assignments.push(`services = ${push(JSON.stringify(patch.services))}::jsonb`);
  }

  if (patch.note?.trim()) {
    const note: LeadNote = {
      at: new Date().toISOString(),
      author: actor,
      text: patch.note.trim(),
    };
    assignments.push(`notes = notes || ${push(JSON.stringify([note]))}::jsonb`);
  }

  if (assignments.length === 0) return before;

  assignments.push('updated_at = now()');

  const after = await queryOne<LeadRow>(
    `UPDATE leads SET ${assignments.join(', ')} WHERE id = $1 RETURNING *`,
    params,
  );
  if (!after) return null;

  for (const column of PATCHABLE_COLUMNS) {
    if (patch[column] === undefined) continue;
    const from = (before as any)[column];
    const to = (after as any)[column];
    if (String(from ?? '') === String(to ?? '')) continue;
    await logLeadEvent({
      leadId: id,
      type: column === 'stage' ? 'stage_change' : 'field_change',
      field: column,
      from: from === null ? null : String(from),
      to: to === null ? null : String(to),
      actor,
    });
  }

  if (patch.note?.trim()) {
    await logLeadEvent({ leadId: id, type: 'note', to: patch.note.trim(), actor });
  }

  return after;
}

export async function deleteLead(id: string, actor: string): Promise<boolean> {
  await logLeadEvent({ leadId: id, type: 'deleted', actor });
  const rows = await query(`DELETE FROM leads WHERE id = $1 RETURNING id`, [id]);
  return Boolean(rows && rows.length > 0);
}

// ----------------------------------------------------------- admin: analytics

export interface DashboardStats {
  leads: { today: number; last7: number; last30: number; total: number };
  conversations: { today: number; last7: number; last30: number; total: number };
  captureRate: number;
  openHot: number;
  wonThisMonth: number;
  needsAttention: number;
  byStage: { stage: string; count: number }[];
  bySource: { source: string; count: number }[];
  byService: { service: string; count: number }[];
  byTemperature: { temperature: string; count: number }[];
  daily: { day: string; leads: number; conversations: number }[];
}

export async function getDashboardStats(): Promise<DashboardStats | null> {
  const leadCounts = await queryOne<Record<string, string>>(
    `SELECT
       count(*) FILTER (WHERE created_at >= date_trunc('day', now()))::text AS today,
       count(*) FILTER (WHERE created_at >= now() - interval '7 days')::text  AS last7,
       count(*) FILTER (WHERE created_at >= now() - interval '30 days')::text AS last30,
       count(*)::text AS total
     FROM leads`,
  );
  if (!leadCounts) return null;

  const conversationCounts = await queryOne<Record<string, string>>(
    `SELECT
       count(*) FILTER (WHERE started_at >= date_trunc('day', now()))::text AS today,
       count(*) FILTER (WHERE started_at >= now() - interval '7 days')::text  AS last7,
       count(*) FILTER (WHERE started_at >= now() - interval '30 days')::text AS last30,
       count(*)::text AS total
     FROM conversations`,
  );

  const headline = await queryOne<Record<string, string>>(
    `SELECT
       count(*) FILTER (
         WHERE temperature = 'hot' AND stage NOT IN ('won', 'lost', 'junk')
       )::text AS open_hot,
       count(*) FILTER (
         WHERE stage = 'won' AND updated_at >= date_trunc('month', now())
       )::text AS won_this_month,
       count(*) FILTER (
         WHERE (next_action_at IS NOT NULL AND next_action_at < now())
            OR (next_action_at IS NULL AND stage NOT IN ('won', 'lost', 'junk'))
       )::text AS needs_attention
     FROM leads`,
  );

  const byStage = await query<{ stage: string; count: string }>(
    `SELECT stage, count(*)::text AS count FROM leads GROUP BY stage ORDER BY count DESC`,
  );
  const bySource = await query<{ source: string; count: string }>(
    `SELECT source, count(*)::text AS count FROM leads GROUP BY source ORDER BY count DESC`,
  );
  const byTemperature = await query<{ temperature: string; count: string }>(
    `SELECT temperature, count(*)::text AS count FROM leads GROUP BY temperature`,
  );
  const byService = await query<{ service: string; count: string }>(
    `SELECT value #>> '{}' AS service, count(*)::text AS count
     FROM leads, jsonb_array_elements(services) AS value
     GROUP BY service ORDER BY count DESC`,
  );

  const daily = await query<{ day: string; leads: string; conversations: string }>(
    `WITH days AS (
       SELECT generate_series(date_trunc('day', now()) - interval '29 days',
                              date_trunc('day', now()), interval '1 day') AS day
     )
     SELECT to_char(days.day, 'YYYY-MM-DD') AS day,
            (SELECT count(*) FROM leads l
              WHERE l.created_at >= days.day AND l.created_at < days.day + interval '1 day')::text AS leads,
            (SELECT count(*) FROM conversations c
              WHERE c.started_at >= days.day AND c.started_at < days.day + interval '1 day')::text AS conversations
     FROM days ORDER BY days.day`,
  );

  const leads30 = Number(leadCounts.last30 ?? 0);
  const conversations30 = Number(conversationCounts?.last30 ?? 0);

  return {
    leads: {
      today: Number(leadCounts.today ?? 0),
      last7: Number(leadCounts.last7 ?? 0),
      last30: leads30,
      total: Number(leadCounts.total ?? 0),
    },
    conversations: {
      today: Number(conversationCounts?.today ?? 0),
      last7: Number(conversationCounts?.last7 ?? 0),
      last30: conversations30,
      total: Number(conversationCounts?.total ?? 0),
    },
    captureRate: conversations30 > 0 ? Math.round((leads30 / conversations30) * 100) : 0,
    openHot: Number(headline?.open_hot ?? 0),
    wonThisMonth: Number(headline?.won_this_month ?? 0),
    needsAttention: Number(headline?.needs_attention ?? 0),
    byStage: (byStage ?? []).map((r) => ({ stage: r.stage, count: Number(r.count) })),
    bySource: (bySource ?? []).map((r) => ({ source: r.source, count: Number(r.count) })),
    byService: (byService ?? []).map((r) => ({ service: r.service, count: Number(r.count) })),
    byTemperature: (byTemperature ?? []).map((r) => ({
      temperature: r.temperature,
      count: Number(r.count),
    })),
    daily: (daily ?? []).map((r) => ({
      day: r.day,
      leads: Number(r.leads),
      conversations: Number(r.conversations),
    })),
  };
}

export interface ConversationListRow {
  id: string;
  session_id: string;
  started_at: string;
  last_message_at: string;
  message_count: number;
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  gemini_count: number;
  fallback_count: number;
  lead_id: string | null;
  first_message: string | null;
}

/**
 * Conversation list for the dashboard. `missedOnly` surfaces the valuable set:
 * someone asked about price or a call, and we never captured their contact.
 */
export async function listConversations(options: {
  search?: string;
  missedOnly?: boolean;
  page?: number;
  pageSize?: number;
}): Promise<{ rows: ConversationListRow[]; total: number } | null> {
  const page = Math.max(1, options.page ?? 1);
  const pageSize = Math.min(200, Math.max(1, options.pageSize ?? 25));

  const conditions: string[] = [];
  const params: unknown[] = [];
  const push = (value: unknown) => {
    params.push(value);
    return `$${params.length}`;
  };

  if (options.search) {
    const p = push(`%${options.search.toLowerCase()}%`);
    conditions.push(`EXISTS (
      SELECT 1 FROM messages m
      WHERE m.conversation_id = c.id AND lower(m.content) LIKE ${p}
    )`);
  }

  if (options.missedOnly) {
    // Checks the link table as well, so a returning visitor whose details we
    // already hold is not reported as a lead we missed.
    conditions.push(`NOT EXISTS (
      SELECT 1 FROM leads l
      LEFT JOIN lead_conversations lc ON lc.lead_id = l.id
      WHERE (l.conversation_id = c.id OR lc.conversation_id = c.id)
        AND (l.phone IS NOT NULL OR l.email IS NOT NULL)
    )`);
    conditions.push(`EXISTS (
      SELECT 1 FROM messages m
      WHERE m.conversation_id = c.id AND m.role = 'user'
        AND m.content ~* '(price|pricing|cost|charge|quote|how much|rate|budget|call|meet|schedule|evlo)'
    )`);
  }

  const clause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const rows = await query<ConversationListRow>(
    `SELECT c.*,
            (SELECT lc.lead_id FROM lead_conversations lc WHERE lc.conversation_id = c.id LIMIT 1) AS lead_id,
            (SELECT m.content FROM messages m
              WHERE m.conversation_id = c.id AND m.role = 'user'
              ORDER BY m.created_at LIMIT 1) AS first_message
     FROM conversations c
     ${clause}
     ORDER BY c.last_message_at DESC
     LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}`,
    params,
  );
  if (rows === null) return null;

  const countRow = await queryOne<{ count: string }>(
    `SELECT count(*)::text AS count FROM conversations c ${clause}`,
    params,
  );

  return { rows, total: Number(countRow?.count ?? rows.length) };
}

export async function getConversationTranscript(id: string): Promise<{
  conversation: Record<string, any> | null;
  transcript: LeadDetail['transcript'];
} | null> {
  const conversation = await queryOne(`SELECT * FROM conversations WHERE id = $1`, [id]);
  if (!conversation) return null;
  const transcript = await query<LeadDetail['transcript'][number]>(
    `SELECT role, content, created_at, mode, retrieved_chunks
     FROM messages WHERE conversation_id = $1 ORDER BY created_at, id`,
    [id],
  );
  return { conversation, transcript: transcript ?? [] };
}

export interface BotHealth {
  modeSplit: { gemini: number; fallback: number; fallbackRate: number };
  avgMessagesPerConversation: number;
  avgLatencyMs: number;
  missingInfoHits: number;
  topQuestions: { question: string; count: number }[];
  unanswered: { question: string; created_at: string }[];
  dropOff: { messages: number; conversations: number }[];
  categoryHits: { category: string; count: number }[];
}

/**
 * Bot quality metrics. The fallback rate is the first thing to look at: a spike
 * means the Gemini key is missing or the model is erroring, which otherwise
 * looks like a working chatbot giving vague answers.
 */
export async function getBotHealth(): Promise<BotHealth | null> {
  const modes = await queryOne<{ gemini: string; fallback: string; avg_latency: string | null }>(
    `SELECT
       count(*) FILTER (WHERE mode = 'gemini')::text        AS gemini,
       count(*) FILTER (WHERE mode = 'rule_fallback')::text AS fallback,
       round(avg(latency_ms))::text                         AS avg_latency
     FROM messages WHERE role = 'assistant'`,
  );
  if (!modes) return null;

  const conversationAvg = await queryOne<{ avg: string | null }>(
    `SELECT round(avg(message_count), 1)::text AS avg FROM conversations WHERE message_count > 0`,
  );

  const categories = await query<{ category: string; count: string }>(
    `SELECT chunk->>'category' AS category, count(*)::text AS count
     FROM messages, jsonb_array_elements(retrieved_chunks) AS chunk
     GROUP BY category ORDER BY count DESC`,
  );

  const topQuestions = await query<{ question: string; count: string }>(
    `SELECT lower(trim(content)) AS question, count(*)::text AS count
     FROM messages
     WHERE role = 'user' AND length(trim(content)) BETWEEN 3 AND 120
     GROUP BY question
     HAVING count(*) > 1
     ORDER BY count(*) DESC
     LIMIT 20`,
  );

  // A user message is "unanswered" when the reply it triggered fell back.
  const unanswered = await query<{ question: string; created_at: string }>(
    `SELECT u.content AS question, u.created_at
     FROM messages u
     JOIN messages a
       ON a.conversation_id = u.conversation_id
      AND a.role = 'assistant'
      AND a.id = (
        SELECT min(m2.id) FROM messages m2
        WHERE m2.conversation_id = u.conversation_id
          AND m2.role = 'assistant' AND m2.id > u.id
      )
     WHERE u.role = 'user' AND a.mode = 'rule_fallback'
     ORDER BY u.created_at DESC
     LIMIT 50`,
  );

  const dropOff = await query<{ messages: string; conversations: string }>(
    `SELECT message_count::text AS messages, count(*)::text AS conversations
     FROM conversations WHERE message_count > 0
     GROUP BY message_count ORDER BY message_count`,
  );

  const gemini = Number(modes.gemini ?? 0);
  const fallback = Number(modes.fallback ?? 0);
  const total = gemini + fallback;

  const missingInfo = (categories ?? []).find((c) => c.category === 'missing_info');

  return {
    modeSplit: {
      gemini,
      fallback,
      fallbackRate: total > 0 ? Math.round((fallback / total) * 100) : 0,
    },
    avgMessagesPerConversation: Number(conversationAvg?.avg ?? 0),
    avgLatencyMs: Number(modes.avg_latency ?? 0),
    missingInfoHits: Number(missingInfo?.count ?? 0),
    topQuestions: (topQuestions ?? []).map((r) => ({ question: r.question, count: Number(r.count) })),
    unanswered: unanswered ?? [],
    dropOff: (dropOff ?? []).map((r) => ({
      messages: Number(r.messages),
      conversations: Number(r.conversations),
    })),
    categoryHits: (categories ?? [])
      .filter((r) => r.category)
      .map((r) => ({ category: r.category, count: Number(r.count) })),
  };
}

// --------------------------------------------------------------------- export

const CSV_COLUMNS: { key: keyof LeadRow | 'services_text'; header: string }[] = [
  { key: 'created_at', header: 'Created At' },
  { key: 'name', header: 'Name' },
  { key: 'phone', header: 'Phone' },
  { key: 'email', header: 'Email' },
  { key: 'company', header: 'Company' },
  { key: 'business_type', header: 'Business Type' },
  { key: 'services_text', header: 'Services' },
  { key: 'budget_hint', header: 'Budget' },
  { key: 'timeline_hint', header: 'Timeline' },
  { key: 'score', header: 'Score' },
  { key: 'temperature', header: 'Temperature' },
  { key: 'stage', header: 'Stage' },
  { key: 'owner', header: 'Owner' },
  { key: 'next_action_at', header: 'Next Action' },
  { key: 'source', header: 'Source' },
  { key: 'summary', header: 'Summary' },
];

/**
 * Timestamps are rendered as "YYYY-MM-DD HH:mm" in IST rather than the driver's
 * default Date string, which Excel does not parse and nobody wants to read.
 */
function formatCsvDate(value: Date): string {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(value);

  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? '';
  return `${get('year')}-${get('month')}-${get('day')} ${get('hour')}:${get('minute')}`;
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = value instanceof Date ? formatCsvDate(value) : String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function exportLeadsCsv(filters: LeadFilters): Promise<string | null> {
  const { clause, params } = buildLeadWhere(filters);
  const rows = await query<LeadRow>(
    `SELECT l.* FROM leads l ${clause} ORDER BY l.created_at DESC LIMIT 10000`,
    params,
  );
  if (rows === null) return null;

  const lines = [CSV_COLUMNS.map((c) => csvEscape(c.header)).join(',')];
  for (const row of rows) {
    lines.push(
      CSV_COLUMNS.map((column) => {
        if (column.key === 'services_text') {
          return csvEscape((row.services ?? []).join('; '));
        }
        return csvEscape((row as any)[column.key]);
      }).join(','),
    );
  }
  return lines.join('\r\n');
}

// ----------------------------------------------------------- login throttling

export async function recordLoginAttempt(ip: string, successful: boolean): Promise<void> {
  await query(`INSERT INTO login_attempts (ip_hash, successful) VALUES ($1, $2)`, [
    hashIp(ip),
    successful,
  ]);
}

export async function countRecentLoginFailures(ip: string, minutes = 15): Promise<number> {
  const row = await queryOne<{ count: string }>(
    `SELECT count(*)::text AS count FROM login_attempts
     WHERE ip_hash = $1 AND successful = false
       AND created_at > now() - ($2 || ' minutes')::interval`,
    [hashIp(ip), String(minutes)],
  );
  return Number(row?.count ?? 0);
}

export async function logNotification(params: {
  leadId?: string | null;
  recipient?: string | null;
  status: string;
  detail?: string | null;
}): Promise<void> {
  await query(
    `INSERT INTO notification_log (lead_id, recipient, status, detail)
     VALUES ($1, $2, $3, $4)`,
    [params.leadId ?? null, params.recipient ?? null, params.status, params.detail ?? null],
  );
}

export async function listNotifications(limit = 50) {
  return query(
    `SELECT n.*, l.name AS lead_name FROM notification_log n
     LEFT JOIN leads l ON l.id = n.lead_id
     ORDER BY n.created_at DESC LIMIT ${Math.min(200, Math.max(1, limit))}`,
  );
}

// ------------------------------------------------------------------ retention

/**
 * Deletes message bodies older than the retention window while keeping the
 * conversation rows that the aggregate stats are built from.
 */
export async function purgeOldTranscripts(days: number): Promise<number> {
  const rows = await query<{ id: string }>(
    `DELETE FROM messages
     WHERE created_at < now() - ($1 || ' days')::interval
     RETURNING id`,
    [String(Math.max(1, days))],
  );
  return rows?.length ?? 0;
}

export { CLOSED_STAGES };

/** True when an alert has already gone out for this lead (one alert per lead). */
export async function hasSentNotification(leadId: string): Promise<boolean> {
  const row = await queryOne<{ exists: boolean }>(
    `SELECT EXISTS (
       SELECT 1 FROM notification_log WHERE lead_id = $1 AND status = 'sent'
     ) AS exists`,
    [leadId],
  );
  return Boolean(row?.exists);
}

/**
 * Clears an IP's failed attempts after a successful login, so earlier typos
 * cannot combine with a later one to lock out someone who knows the password.
 */
export async function clearLoginFailures(ip: string): Promise<void> {
  await query(`DELETE FROM login_attempts WHERE ip_hash = $1 AND successful = false`, [hashIp(ip)]);
}
