/**
 * Settings: configuration status, the schema migration, the WhatsApp test and
 * transcript retention.
 *
 * Everything here answers "is this actually wired up?" without needing the Vercel
 * dashboard, which is where most setup confusion comes from.
 */
import React, { useEffect, useState } from 'react';
import { Check, Database, MessageSquare, Shield, Sparkles, Trash2 } from 'lucide-react';
import { adminApi } from './adminApi';
import type { SystemHealth } from './types';
import { Card, Notice, Spinner, VIZ } from './ui';

const StatusRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  ok: boolean;
  detail: string;
}> = ({ icon, label, ok, detail }) => (
  <div className="flex items-start gap-3 border-b border-white/[0.05] py-3 last:border-0">
    <span className="mt-0.5 text-[#898781]">{icon}</span>
    <div className="min-w-0 flex-1">
      <p className="text-xs font-medium text-white">{label}</p>
      <p className="mt-0.5 text-[11px] leading-relaxed text-[#898781]">{detail}</p>
    </div>
    <span
      className="mt-0.5 shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold"
      style={{
        color: ok ? VIZ.good : VIZ.warm,
        backgroundColor: `${ok ? VIZ.good : VIZ.warm}1f`,
      }}
    >
      {ok ? 'READY' : 'ACTION NEEDED'}
    </span>
  </div>
);

export const SettingsTab: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{ tone: 'success' | 'error' | 'warn'; text: string } | null>(
    null,
  );
  const [busy, setBusy] = useState<string | null>(null);
  const [retentionDays, setRetentionDays] = useState(180);

  const refresh = () =>
    adminApi
      .health()
      .then(setHealth)
      .catch((err) =>
        setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Load failed.' }),
      )
      .finally(() => setLoading(false));

  useEffect(() => {
    void refresh();
  }, []);

  const run = async (key: string, task: () => Promise<string>) => {
    setBusy(key);
    setMessage(null);
    try {
      setMessage({ tone: 'success', text: await task() });
      await refresh();
    } catch (err) {
      setMessage({ tone: 'error', text: err instanceof Error ? err.message : 'Failed.' });
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <Spinner label="Checking configuration…" />;
  if (!health) return <Notice tone="error">{message?.text || 'Could not load settings.'}</Notice>;

  const buttonClass =
    'rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#c3c2b7] transition hover:border-white/25 hover:text-white disabled:opacity-40';

  return (
    <div className="flex flex-col gap-5">
      {message && <Notice tone={message.tone}>{message.text}</Notice>}

      <Card title="System status">
        <StatusRow
          icon={<Database size={14} />}
          label={health.db.driver === 'local' ? 'Database (local development)' : 'Database (Neon Postgres)'}
          ok={health.db.configured && health.db.reachable && health.db.migrated}
          detail={
            !health.db.configured
              ? 'DATABASE_URL is not set. Add your Neon connection string in Vercel, then redeploy.'
              : !health.db.reachable
                ? `Configured but unreachable: ${health.db.error ?? 'unknown error'}`
                : !health.db.migrated
                  ? `Connected to ${health.db.target}, but the tables do not exist yet. Run the migration below.`
                  : `Connected to ${health.db.target} — holding ${health.db.counts?.leads ?? 0} leads, ` +
                    `${health.db.counts?.conversations ?? 0} conversations, ` +
                    `${health.db.counts?.messages ?? 0} messages.`
          }
        />

        {health.db.driver === 'local' && health.db.reachable && (
          <div className="pb-3">
            <Notice tone="warn">
              This is the <strong>local development database</strong> stored in{' '}
              <code>./.pglite</code>, not Neon. Leads captured here stay on this machine and are
              never visible in production. Set <code>DATABASE_URL</code> in <code>.env</code> to
              point local development at your real Neon database instead.
            </Notice>
          </div>
        )}
        <StatusRow
          icon={<Sparkles size={14} />}
          label="Gemini AI"
          ok={health.gemini.configured}
          detail={
            health.gemini.configured
              ? 'GEMINI_API_KEY is set. The assistant answers with AI.'
              : 'GEMINI_API_KEY is missing, so every reply is canned fallback text. Add it in Vercel.'
          }
        />
        <StatusRow
          icon={<MessageSquare size={14} />}
          label="WhatsApp lead alerts"
          ok={health.whatsapp.configured}
          detail={
            health.whatsapp.configured
              ? `Sending to ${health.whatsapp.recipients} number(s) in ${health.whatsapp.mode} mode${
                  health.whatsapp.mode === 'template'
                    ? ` using template "${health.whatsapp.templateName}"`
                    : ''
                }.`
              : `Not configured. Missing: ${health.whatsapp.missing.join(', ')}. See WHATSAPP_SETUP.md — leads are still captured without this.`
          }
        />
        <StatusRow
          icon={<Shield size={14} />}
          label="Admin session"
          ok
          detail={`Signed in as ${health.session.actor}. Session expires ${new Date(
            health.session.expiresAt,
          ).toLocaleString('en-IN')}.`}
        />
      </Card>

      <Card
        title="Database migration"
        subtitle="Creates or updates the tables. Safe to run more than once."
      >
        <button
          type="button"
          disabled={busy === 'migrate' || !health.db.configured}
          onClick={() =>
            run('migrate', async () => {
              const result = await adminApi.migrate();
              return `Migration complete — ${result.applied} statements applied.`;
            })
          }
          className={buttonClass}
        >
          {busy === 'migrate' ? 'Running…' : 'Run migration'}
        </button>
        {!health.db.configured && (
          <p className="mt-2 text-[11px] text-[#898781]">
            Set DATABASE_URL first. Until then nothing can be stored.
          </p>
        )}
      </Card>

      <Card
        title="Test WhatsApp alert"
        subtitle="Sends a sample lead notification to every configured recipient."
      >
        <button
          type="button"
          disabled={busy === 'whatsapp' || !health.whatsapp.configured}
          onClick={() =>
            run('whatsapp', async () => {
              const result = await adminApi.testWhatsApp();
              if (result.errors.length > 0) {
                throw new Error(result.errors.join(' · '));
              }
              return `Test alert sent to ${result.sent.length} number(s). Check WhatsApp.`;
            })
          }
          className={buttonClass}
        >
          {busy === 'whatsapp' ? 'Sending…' : 'Send test alert'}
        </button>
      </Card>

      <Card
        title="Transcript retention"
        subtitle="Deletes chat message bodies older than the window. Lead records and aggregate stats are kept."
      >
        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs text-[#c3c2b7]">
            Keep transcripts for
            <input
              type="number"
              min={7}
              value={retentionDays}
              onChange={(event) => setRetentionDays(Number(event.target.value))}
              className="mx-2 w-20 rounded-lg border border-white/10 bg-ink px-2 py-1 text-xs text-white outline-none focus:border-lime/50"
            />
            days
          </label>
          <button
            type="button"
            disabled={busy === 'purge' || retentionDays < 7}
            onClick={() => {
              if (
                !window.confirm(
                  `Permanently delete all chat messages older than ${retentionDays} days?`,
                )
              ) {
                return;
              }
              void run('purge', async () => {
                const result = await adminApi.purge(retentionDays);
                return `Deleted ${result.deleted} message(s) older than ${result.days} days.`;
              });
            }}
            className={`flex items-center gap-1.5 ${buttonClass}`}
            style={{ color: VIZ.hot }}
          >
            <Trash2 size={12} />
            {busy === 'purge' ? 'Purging…' : 'Purge now'}
          </button>
        </div>
        <p className="mt-3 text-[11px] leading-relaxed text-[#898781]">
          You are storing names, phone numbers and conversation transcripts, which is personal
          data under India&apos;s DPDP Act. Decide a retention window and hold to it — 180 days is a
          reasonable default for sales follow-up.
        </p>
      </Card>

      <Card title="Security checklist">
        <ul className="flex flex-col gap-2 text-xs text-[#c3c2b7]">
          {[
            'ADMIN_PASSWORD is set as a Vercel environment variable, not committed to the repository.',
            'The session cookie is HttpOnly, Secure and SameSite=Strict, so page scripts cannot read it.',
            'Login is rate limited to 5 failed attempts per 15 minutes per IP.',
            'Visitor IPs are stored only as salted hashes, never in the clear.',
            '/admin is excluded from search engines via robots.txt and a noindex tag.',
          ].map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check size={13} className="mt-0.5 shrink-0" style={{ color: VIZ.good }} />
              {item}
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
};
