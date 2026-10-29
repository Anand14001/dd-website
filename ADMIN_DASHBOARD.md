# Admin dashboard — `/admin`

Lead capture and pipeline management for the Digital Dude website. Records every
chatbot conversation, turns the qualifying ones into leads, and gives the team a
place to work them.

---

## Deploy checklist

Three steps, in this order.

### 1. Create the database

Neon Postgres, free tier:

- **Via Vercel** (easiest): Project → **Storage** → **Create Database** →
  **Neon**. Vercel sets `DATABASE_URL` for you.
- **Or directly**: sign up at <https://neon.tech>, create a project, copy the
  **pooled** connection string, and add it as `DATABASE_URL` in
  Vercel → Settings → Environment Variables.

### 2. Set the admin password

In Vercel → Settings → Environment Variables (Production):

```
ADMIN_PASSWORD=Admin@123
```

This is required. There is no hard-coded fallback — if the variable is missing,
login returns a configuration error rather than accepting a password committed to
the repository.

### 3. Redeploy, then migrate

Redeploy so the new variables are picked up. Then open `/admin`, sign in, go to
**Settings**, and click **Run migration**. That creates the tables.

Locally you can instead run:

```bash
npm run db:migrate
```

Confirm everything is green on the Settings tab: Database, Gemini AI, and
(optionally) WhatsApp.

---

## Is the database actually connected?

Three ways to check, strongest last.

**1. Dashboard** — `/admin` → **Settings**. The Database row names the database
that answered and its row counts, for example:

> Connected to `ep-cool-sun-123456.ap-southeast-1.aws.neon.tech/neondb` —
> holding 14 leads, 37 conversations, 212 messages

**2. Command line** — confirms the tables exist, counts rows, and performs a real
write-then-delete, so a read-only or misdirected connection cannot pass:

```bash
npm run db:status                                  # whatever .env points at
DATABASE_URL="postgresql://..." npm run db:status  # check production
```

**3. End to end** — submit the contact form (or chat and fill the capture card),
then open **Leads**. If the lead is there, the whole path works.

### Local development uses a different database by default

With no `DATABASE_URL` in `.env`, the dev server starts a **local Postgres**
(PGlite) in `./.pglite` so the dashboard works without a cloud signup. It is
gitignored and never deployed.

This means **leads captured on localhost are not in Neon**, and Settings says so
in plain terms whenever the local database is in use. Two consequences worth
knowing:

- Test leads from local development never pollute production data. That is the
  reason this is the default.
- A green Database row on localhost does **not** mean production is configured.
  Check production separately, from the deployed `/admin` → Settings.

To point local development at the real Neon database, add `DATABASE_URL` to
`.env` and restart. To wipe local test data: `rm -rf .pglite` and restart.

---

## What gets recorded

Two layers, deliberately separate:

| | What it is | When it is created |
|---|---|---|
| **Conversation** | Every chat session, with full transcript and campaign attribution | Always, on the first message |
| **Lead** | A person worth following up | When contact details are captured, or the enquiry scores ≥ 40 |

Keeping conversations even when they do not become leads is what makes the
**Conversations → Missed opportunities** filter possible: visitors who asked
about pricing or a call and left without sharing contact details. That set is
where the capture rate gets improved.

### Lead scoring

Score is 0–100, built from signals stored alongside the lead so the drawer can
show exactly why a lead scored what it did:

| Signal | Points |
|---|---|
| Shared a phone number | 30 |
| Asked about pricing | 15 |
| Asked to talk or meet | 15 |
| Shared an email address | 15 |
| Signalled readiness to start | 10 |
| Gave a timeline | 10 |
| Mentioned a budget | 10 |
| Named a service | 8 |
| Described their business | 7 |
| Urgent timeline | 5 |
| Engagement (2 per message, max 10) | ≤10 |

Temperature: **hot** at ≥60 or contact-plus-intent, **warm** at ≥30 or any
contact, otherwise **cold**.

### Capture paths

1. **Capture card in the chat widget** — appears when the visitor shows buying
   intent, or after three messages. Two required fields (name, WhatsApp number);
   business, services, budget and timeline sit behind an optional step, because
   every extra required field costs completions.
2. **Passive extraction** — scans the visitor's own messages for phone, email,
   name, business, budget and timeline. This only reads user messages: the bot's
   replies quote Digital Dude's own number, and scanning them would stamp the
   agency's contact details onto every lead.
3. **Contact form** — `/api/contact` submissions land in the same pipeline.

### Deduplication

Leads are merged on normalised phone (or email). A returning visitor updates
their existing record instead of creating a duplicate, services are unioned, and
a stage a human has already moved forward is never reset by a later merge.

---

## Screens

| Tab | What it is for |
|---|---|
| **Overview** | Leads today / 7d / 30d, capture rate, hot leads, needs-attention, 30-day trend, pipeline, service interest |
| **Leads** | Filter, search, sort, open a lead, export CSV |
| **Conversations** | Every chat including non-leads; missed-opportunity filter |
| **Bot health** | Fallback rate, knowledge gaps, top questions, conversation depth |
| **Settings** | Configuration status, migration, WhatsApp test, retention purge |

### The number to watch

**Bot health → fallback rate.** When `GEMINI_API_KEY` is missing or the model
errors, the assistant keeps answering from canned text. From outside it looks
like a working chatbot giving vague answers, which quietly costs leads. A
fallback rate above 50% raises a warning on that tab.

### Lead drawer

Contact buttons first — **WhatsApp** (a `wa.me` deep link, needs no API),
call, email. Then the score breakdown, pipeline stage, owner, next action,
notes, the full transcript, and an audit trail of every change.

---

## Security

| | |
|---|---|
| Password | Server-side only, from `ADMIN_PASSWORD`. Never in the client bundle. Compared with a constant-time comparison. |
| Session | Stateless HMAC-signed cookie — `HttpOnly`, `Secure`, `SameSite=Strict`, 8-hour expiry. Page scripts cannot read it. |
| Signing key | `ADMIN_SESSION_SECRET` if set, otherwise derived from the password, so changing the password invalidates sessions. |
| Rate limiting | 5 failed logins per 15 minutes per IP, tracked in Postgres because serverless instances share no memory. A correct password clears the counter. |
| Authorisation | Every `/api/admin/*` request is checked. The `/admin` route guard is convenience only — the API is the real boundary. |
| Visitor IPs | Stored as salted SHA-256 hashes, never in the clear. |
| Indexing | `Disallow: /admin` in robots.txt plus a `noindex` meta tag. |

**The route guard is not the security boundary.** A visitor can load the admin
JavaScript; they cannot get data out of it, because every endpoint rejects
requests without a valid session cookie.

---

## Privacy and retention

You are storing names, phone numbers and conversation transcripts — personal
data under India's DPDP Act 2023.

- The capture card carries an explicit consent line, and consent is stored per
  lead.
- **Settings → Transcript retention** deletes message bodies older than a chosen
  window (180 days is a reasonable default) while keeping lead records and
  aggregate stats.
- Decide the retention window now. Retrofitting deletion onto a year of
  transcripts is far more painful.

Add a line to the site's privacy policy covering chat-transcript storage.

---

## Architecture notes

### One function for all admin routes

Vercel's Hobby plan allows **12 serverless functions per deployment**. Eleven
separate admin endpoints would have consumed most of that, so they share a
catch-all at [api/admin/\[...path\].ts](api/admin/[...path].ts), which delegates
to [api/_lib/adminRouter.ts](api/_lib/adminRouter.ts). Current count: 5 of 12.

### Failures never reach the visitor

- Database writes are best-effort. If `DATABASE_URL` is wrong or Neon is down,
  chat and the contact form still work — they return success and log the problem.
- If a lead cannot be stored, the WhatsApp alert is sent anyway, so the enquiry
  still reaches the team.
- Persistence and notification run after the response via `waitUntil`, so they
  are never in the visitor's latency path.

### ESM imports need file extensions

`package.json` sets `"type": "module"`, so Vercel's compiled functions run under
Node's ESM loader, which does not guess extensions. **Every relative import under
`api/` must end in `.js`** (TypeScript maps it to the `.ts` source). Omitting it
produces `ERR_MODULE_NOT_FOUND` at runtime — a 500 with no stack trace from your
own code.

### One code path for dev and production

[server/api.ts](server/api.ts) is the Vite dev middleware. It dispatches to the
same handlers Vercel deploys, so `npm run dev` exercises production code
including the admin API.

---

## Verification

```bash
npm run check          # everything below
npm run lint           # tsc --noEmit
npm run check:extraction   # lead extraction and scoring
npm run check:db       # schema, dedupe, analytics, CSV — against real Postgres
npm run check:api      # HTTP handlers, auth, filters — against real Postgres
npm run db:status      # is the database connected, migrated and writable?
```

`check:db` and `check:api` run [PGlite](https://pglite.dev), Postgres compiled to
WebAssembly, in-process. No cloud database or network is needed, and the SQL is
exercised for real rather than mocked.

---

## Environment variables

See [.env.example](.env.example) for the full list with comments. The short
version:

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | for lead storage | Neon Postgres connection string |
| `ADMIN_PASSWORD` | for `/admin` | Dashboard password |
| `GEMINI_API_KEY` | for AI replies | Without it, every reply is canned fallback |
| `ADMIN_SESSION_SECRET` | no | Explicit cookie signing key |
| `ADMIN_SESSION_HOURS` | no | Session lifetime, default 8 |
| `WHATSAPP_*` | no | Lead alerts — see [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) |
