/**
 * Lead detail panel.
 *
 * Built around what actually happens next: reach the person, record what was
 * said, set the following action. The WhatsApp button comes first because that is
 * how most Chennai enquiries are answered, and it needs no API — wa.me opens the
 * chat with the number already filled in.
 */
import React, { useEffect, useState } from 'react';
import {
  Clock,
  ExternalLink,
  Mail,
  MessageSquare,
  Phone,
  Save,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { adminApi } from './adminApi';
import type { FilterOptions, LeadDetail, LeadStage } from './types';
import { STAGE_LABELS, STAGE_ORDER } from './types';
import {
  Badge,
  Notice,
  Spinner,
  TEMPERATURE_COLOR,
  VIZ,
  formatDateTime,
  relativeTime,
  whatsappLink,
} from './ui';

const fieldClass =
  'w-full rounded-lg border border-white/10 bg-ink px-3 py-2 text-xs text-white outline-none focus:border-lime/50';

/** Converts a timestamp into the value a datetime-local input expects. */
function toLocalInput(value: string | null): string {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export const LeadDrawer: React.FC<{
  leadId: string;
  options: FilterOptions | null;
  onClose: () => void;
  onChanged: () => void;
}> = ({ leadId, options, onClose, onChanged }) => {
  const [detail, setDetail] = useState<LeadDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [owner, setOwner] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    adminApi
      .lead(leadId)
      .then((result) => {
        if (cancelled) return;
        setDetail(result);
        setOwner(result.lead.owner ?? '');
        setNextAction(toLocalInput(result.lead.next_action_at));
      })
      .catch((err) => !cancelled && setError(err instanceof Error ? err.message : 'Load failed.'))
      .finally(() => !cancelled && setLoading(false));

    return () => {
      cancelled = true;
    };
  }, [leadId]);

  // Escape closes the drawer, matching the rest of the site's overlays.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const applyPatch = async (patch: Record<string, unknown>) => {
    setSaving(true);
    setError(null);
    try {
      const lead = await adminApi.updateLead(leadId, patch);
      setDetail((current) => (current ? { ...current, lead } : current));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onChanged();
      // Re-fetch so the activity log reflects what just changed.
      const fresh = await adminApi.lead(leadId);
      setDetail(fresh);
      setNote('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this lead permanently? This cannot be undone.')) return;
    try {
      await adminApi.deleteLead(leadId);
      onChanged();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete.');
    }
  };

  const serviceLabel = (id: string) =>
    options?.services.find((service) => service.id === id)?.label ?? id;

  const lead = detail?.lead;
  const waLink = lead
    ? whatsappLink(
        lead.phone,
        `Hi ${lead.name || 'there'}, this is Digital Dude from Chennai. Thanks for reaching out about your project!`,
      )
    : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="flex-1 bg-black/60 backdrop-blur-sm"
      />

      <aside className="flex h-full w-full max-w-xl flex-col overflow-y-auto border-l border-white/10 bg-ink">
        <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-white/10 bg-ink/95 px-5 py-4 backdrop-blur">
          <div className="min-w-0">
            <h2 className="truncate text-base font-semibold text-white">
              {lead?.name || 'Lead detail'}
            </h2>
            {lead && (
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Badge
                  label={lead.temperature.toUpperCase()}
                  color={TEMPERATURE_COLOR[lead.temperature]}
                />
                <Badge label={`Score ${lead.score}`} color={VIZ.series1} />
                <Badge
                  label={lead.source === 'contact_form' ? 'Contact form' : 'Chatbot'}
                  color={VIZ.muted}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-1.5 text-[#c3c2b7] transition hover:border-white/25 hover:text-white"
          >
            <X size={15} />
          </button>
        </header>

        {loading ? (
          <Spinner label="Loading lead…" />
        ) : !lead ? (
          <div className="p-5">
            <Notice tone="error">{error || 'Lead not found.'}</Notice>
          </div>
        ) : (
          <div className="flex flex-col gap-5 p-5">
            {error && <Notice tone="error">{error}</Notice>}
            {saved && <Notice tone="success">Saved.</Notice>}

            {/* ------------------------------------------------ reach out */}
            <div className="flex flex-wrap gap-2">
              {waLink && (
                <a
                  href={waLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 rounded-lg bg-lime px-3 py-2 text-xs font-semibold text-ink transition hover:bg-lime-dim"
                >
                  <MessageSquare size={13} /> WhatsApp
                </a>
              )}
              {lead.phone && (
                <a
                  href={`tel:+91${lead.phone}`}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#c3c2b7] transition hover:border-white/25 hover:text-white"
                >
                  <Phone size={13} /> +91 {lead.phone}
                </a>
              )}
              {lead.email && (
                <a
                  href={`mailto:${lead.email}?subject=${encodeURIComponent('Your enquiry with Digital Dude')}`}
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-xs text-[#c3c2b7] transition hover:border-white/25 hover:text-white"
                >
                  <Mail size={13} /> {lead.email}
                </a>
              )}
              {!lead.phone && !lead.email && (
                <Notice tone="warn">
                  No contact details captured. Open the transcript below — if they described their
                  business, it may still be worth matching against your records.
                </Notice>
              )}
            </div>

            {/* ------------------------------------------------- snapshot */}
            <section className="rounded-xl border border-white/10 bg-[#0e0e13] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#898781]">
                Snapshot
              </h3>
              <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2.5 text-xs">
                {[
                  ['Business', lead.company || lead.business_type],
                  ['Budget', lead.budget_hint],
                  ['Timeline', lead.timeline_hint],
                  ['Captured', relativeTime(lead.created_at)],
                ].map(([label, value]) => (
                  <div key={label as string}>
                    <dt className="text-[#898781]">{label}</dt>
                    <dd className="mt-0.5 text-[#c3c2b7]">{(value as string) || '—'}</dd>
                  </div>
                ))}
              </dl>

              {lead.services.length > 0 && (
                <div className="mt-3">
                  <p className="text-[#898781] text-xs">Interested in</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {lead.services.map((service) => (
                      <Badge key={service} label={serviceLabel(service)} color={VIZ.series1} />
                    ))}
                  </div>
                </div>
              )}

              {lead.summary && (
                <p className="mt-3 border-t border-white/[0.07] pt-3 text-xs leading-relaxed text-[#c3c2b7]">
                  {lead.summary}
                </p>
              )}
            </section>

            {/* --------------------------------------- why this score */}
            {lead.signals?.length > 0 && (
              <section className="rounded-xl border border-white/10 bg-[#0e0e13] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#898781]">
                  Why score {lead.score}
                </h3>
                <ul className="mt-3 flex flex-col gap-1.5">
                  {[...lead.signals]
                    .sort((a, b) => b.points - a.points)
                    .map((signal) => (
                      <li
                        key={signal.key}
                        className="flex items-baseline justify-between gap-3 text-xs"
                      >
                        <span className="text-[#c3c2b7]">{signal.label}</span>
                        <span className="tabular-nums text-white">+{signal.points}</span>
                      </li>
                    ))}
                </ul>
              </section>
            )}

            {/* ------------------------------------------------ pipeline */}
            <section className="rounded-xl border border-white/10 bg-[#0e0e13] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#898781]">
                Pipeline
              </h3>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {STAGE_ORDER.map((stage) => {
                  const active = lead.stage === stage;
                  return (
                    <button
                      key={stage}
                      type="button"
                      disabled={saving}
                      onClick={() => !active && applyPatch({ stage })}
                      className={`rounded-lg border px-2.5 py-1.5 text-[11px] transition disabled:opacity-50 ${
                        active
                          ? 'border-lime/50 bg-lime/10 text-lime'
                          : 'border-white/10 text-[#c3c2b7] hover:border-white/25 hover:text-white'
                      }`}
                    >
                      {STAGE_LABELS[stage as LeadStage]}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] text-[#898781]">
                    <User size={11} /> Owner
                  </label>
                  <input
                    value={owner}
                    onChange={(event) => setOwner(event.target.value)}
                    placeholder="Who is handling this?"
                    className={`mt-1.5 ${fieldClass}`}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 text-[11px] text-[#898781]">
                    <Clock size={11} /> Next action
                  </label>
                  <input
                    type="datetime-local"
                    value={nextAction}
                    onChange={(event) => setNextAction(event.target.value)}
                    className={`mt-1.5 ${fieldClass}`}
                  />
                </div>
              </div>

              <button
                type="button"
                disabled={saving}
                onClick={() =>
                  applyPatch({
                    owner: owner || null,
                    nextActionAt: nextAction ? new Date(nextAction).toISOString() : null,
                  })
                }
                className="mt-3 flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-[#c3c2b7] transition hover:border-white/25 hover:text-white disabled:opacity-50"
              >
                <Save size={12} /> Save owner & next action
              </button>
            </section>

            {/* --------------------------------------------------- notes */}
            <section className="rounded-xl border border-white/10 bg-[#0e0e13] p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#898781]">
                Notes
              </h3>

              <textarea
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="What was discussed? Agreed next step?"
                className={`mt-3 resize-y ${fieldClass}`}
              />
              <button
                type="button"
                disabled={saving || !note.trim()}
                onClick={() => applyPatch({ note })}
                className="mt-2 rounded-lg bg-white/10 px-3 py-1.5 text-xs text-white transition hover:bg-white/15 disabled:opacity-40"
              >
                Add note
              </button>

              {lead.notes?.length > 0 && (
                <ul className="mt-4 flex flex-col gap-3 border-t border-white/[0.07] pt-3">
                  {[...lead.notes].reverse().map((entry, index) => (
                    <li key={`${entry.at}-${index}`}>
                      <p className="text-[11px] text-[#898781]">
                        {entry.author} · {formatDateTime(entry.at)}
                      </p>
                      <p className="mt-0.5 whitespace-pre-wrap text-xs leading-relaxed text-[#c3c2b7]">
                        {entry.text}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* ---------------------------------------------- transcript */}
            {detail.transcript.length > 0 && (
              <section className="rounded-xl border border-white/10 bg-[#0e0e13] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#898781]">
                  Conversation ({detail.transcript.length} messages)
                </h3>

                {detail.conversation && (
                  <p className="mt-2 text-[11px] text-[#898781]">
                    Landed on {detail.conversation.landing_page || 'the site'}
                    {detail.conversation.utm_source
                      ? ` · campaign ${detail.conversation.utm_source}`
                      : ''}
                    {detail.conversation.referrer ? ` · from ${detail.conversation.referrer}` : ''}
                  </p>
                )}

                <ul className="mt-3 flex flex-col gap-2.5">
                  {detail.transcript.map((message, index) => {
                    // A lead can hold several sessions (a returning visitor on
                    // another device). Mark where each new one starts.
                    const previous = detail.transcript[index - 1];
                    const isNewSession =
                      index > 0 &&
                      Boolean(message.conversation_id) &&
                      message.conversation_id !== previous?.conversation_id;

                    return (
                      <React.Fragment key={index}>
                        {isNewSession && (
                          <li className="flex items-center gap-2 py-1 text-[10px] uppercase tracking-wider text-[#898781]">
                            <span className="h-px flex-1 bg-white/10" />
                            Returned {formatDateTime(message.created_at)}
                            <span className="h-px flex-1 bg-white/10" />
                          </li>
                        )}
                        <li
                          className={`max-w-[88%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                            message.role === 'user'
                              ? 'bg-white/[0.06] text-white'
                              : 'bg-lime/[0.07] text-[#c3c2b7]'
                          }`}
                          style={{ alignSelf: message.role === 'user' ? 'flex-start' : 'flex-end' }}
                        >
                          <p className="mb-1 text-[10px] uppercase tracking-wider text-[#898781]">
                            {message.role === 'user' ? 'Visitor' : 'Assistant'}
                            {message.mode === 'rule_fallback' && ' · fallback'}
                          </p>
                          <p className="whitespace-pre-wrap">{message.content}</p>
                        </li>
                      </React.Fragment>
                    );
                  })}
                </ul>
              </section>
            )}

            {/* ------------------------------------------------- history */}
            {detail.events.length > 0 && (
              <section className="rounded-xl border border-white/10 bg-[#0e0e13] p-4">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[#898781]">
                  Activity
                </h3>
                <ul className="mt-3 flex flex-col gap-2">
                  {detail.events.map((event, index) => (
                    <li key={index} className="flex items-baseline gap-2 text-[11px]">
                      <span className="text-[#898781]">{formatDateTime(event.created_at)}</span>
                      <span className="text-[#c3c2b7]">
                        {event.type === 'stage_change'
                          ? `Stage ${event.from_value || 'none'} → ${event.to_value}`
                          : event.type === 'note'
                            ? 'Note added'
                            : `${event.field} changed`}
                        {` · ${event.actor}`}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <div className="flex items-center justify-between border-t border-white/[0.07] pt-4">
              {detail.conversation && (
                <span className="flex items-center gap-1 text-[11px] text-[#898781]">
                  <ExternalLink size={11} /> Session {detail.conversation.session_id.slice(0, 8)}
                </span>
              )}
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs transition hover:border-white/25"
                style={{ color: VIZ.hot }}
              >
                <Trash2 size={12} /> Delete lead
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
