/**
 * Database schema, as an ordered list of idempotent statements.
 *
 * Kept in TypeScript rather than a .sql file so the migrate endpoint works on
 * Vercel without relying on the bundler tracing a data file into the function.
 * Every statement must be safe to run repeatedly.
 */
export const SCHEMA_STATEMENTS: string[] = [
  // ---------------------------------------------------------------- conversations
  `CREATE TABLE IF NOT EXISTS conversations (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id      text UNIQUE NOT NULL,
    started_at      timestamptz NOT NULL DEFAULT now(),
    last_message_at timestamptz NOT NULL DEFAULT now(),
    message_count   integer NOT NULL DEFAULT 0,
    landing_page    text,
    referrer        text,
    utm_source      text,
    utm_medium      text,
    utm_campaign    text,
    user_agent      text,
    ip_hash         text,
    gemini_count    integer NOT NULL DEFAULT 0,
    fallback_count  integer NOT NULL DEFAULT 0
  )`,
  `CREATE INDEX IF NOT EXISTS conversations_last_message_idx ON conversations (last_message_at DESC)`,
  `CREATE INDEX IF NOT EXISTS conversations_started_idx ON conversations (started_at DESC)`,

  // -------------------------------------------------------------------- messages
  `CREATE TABLE IF NOT EXISTS messages (
    id                   bigserial PRIMARY KEY,
    conversation_id      uuid NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
    role                 text NOT NULL CHECK (role IN ('user', 'assistant')),
    content              text NOT NULL,
    created_at           timestamptz NOT NULL DEFAULT now(),
    mode                 text,
    retrieved_chunks     jsonb NOT NULL DEFAULT '[]'::jsonb,
    latency_ms           integer
  )`,
  `CREATE INDEX IF NOT EXISTS messages_conversation_idx ON messages (conversation_id, created_at)`,
  `CREATE INDEX IF NOT EXISTS messages_created_idx ON messages (created_at DESC)`,

  // ----------------------------------------------------------------------- leads
  `CREATE TABLE IF NOT EXISTS leads (
    id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id uuid REFERENCES conversations (id) ON DELETE SET NULL,
    source          text NOT NULL DEFAULT 'chatbot',
    name            text,
    email           text,
    phone           text,
    company         text,
    business_type   text,
    services        jsonb NOT NULL DEFAULT '[]'::jsonb,
    budget_hint     text,
    timeline_hint   text,
    summary         text,
    score           integer NOT NULL DEFAULT 0,
    signals         jsonb NOT NULL DEFAULT '[]'::jsonb,
    temperature     text NOT NULL DEFAULT 'cold',
    stage           text NOT NULL DEFAULT 'new',
    owner           text,
    next_action_at  timestamptz,
    notes           jsonb NOT NULL DEFAULT '[]'::jsonb,
    dedupe_key      text,
    consent         boolean NOT NULL DEFAULT false,
    created_at      timestamptz NOT NULL DEFAULT now(),
    updated_at      timestamptz NOT NULL DEFAULT now()
  )`,
  // Additive guard so re-running the migration upgrades a table created earlier.
  `ALTER TABLE leads ADD COLUMN IF NOT EXISTS signals jsonb NOT NULL DEFAULT '[]'::jsonb`,
  `CREATE UNIQUE INDEX IF NOT EXISTS leads_dedupe_idx ON leads (dedupe_key) WHERE dedupe_key IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS leads_created_idx ON leads (created_at DESC)`,
  `CREATE INDEX IF NOT EXISTS leads_stage_idx ON leads (stage)`,
  `CREATE INDEX IF NOT EXISTS leads_temperature_idx ON leads (temperature)`,
  `CREATE INDEX IF NOT EXISTS leads_next_action_idx ON leads (next_action_at) WHERE next_action_at IS NOT NULL`,
  `CREATE INDEX IF NOT EXISTS leads_conversation_idx ON leads (conversation_id)`,

  // ---------------------------------------------------------- lead_conversations
  // A lead can hold several conversations: a returning visitor on another device
  // starts a new session, and merging on phone must not orphan that transcript.
  // Without this link the Conversations tab would show a captured visitor as
  // "no contact" and wrongly flag them as a missed opportunity.
  `CREATE TABLE IF NOT EXISTS lead_conversations (
    lead_id         uuid NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
    conversation_id uuid NOT NULL REFERENCES conversations (id) ON DELETE CASCADE,
    created_at      timestamptz NOT NULL DEFAULT now(),
    PRIMARY KEY (lead_id, conversation_id)
  )`,
  `CREATE INDEX IF NOT EXISTS lead_conversations_conversation_idx ON lead_conversations (conversation_id)`,

  // ----------------------------------------------------------------- lead_events
  `CREATE TABLE IF NOT EXISTS lead_events (
    id         bigserial PRIMARY KEY,
    lead_id    uuid NOT NULL REFERENCES leads (id) ON DELETE CASCADE,
    type       text NOT NULL,
    field      text,
    from_value text,
    to_value   text,
    actor      text NOT NULL DEFAULT 'system',
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS lead_events_lead_idx ON lead_events (lead_id, created_at DESC)`,

  // -------------------------------------------------------------- login_attempts
  // Rate limiting lives in Postgres because serverless instances share no memory.
  `CREATE TABLE IF NOT EXISTS login_attempts (
    id         bigserial PRIMARY KEY,
    ip_hash    text NOT NULL,
    successful boolean NOT NULL DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS login_attempts_ip_idx ON login_attempts (ip_hash, created_at DESC)`,

  // ----------------------------------------------------------- notification_log
  `CREATE TABLE IF NOT EXISTS notification_log (
    id         bigserial PRIMARY KEY,
    lead_id    uuid REFERENCES leads (id) ON DELETE SET NULL,
    channel    text NOT NULL DEFAULT 'whatsapp',
    recipient  text,
    status     text NOT NULL,
    detail     text,
    created_at timestamptz NOT NULL DEFAULT now()
  )`,
  `CREATE INDEX IF NOT EXISTS notification_log_created_idx ON notification_log (created_at DESC)`,
];
