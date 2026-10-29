/**
 * Every chat, not just the ones that became leads.
 *
 * The "missed opportunities" filter is the reason this screen exists: someone
 * asked about price or a call and left without sharing contact details. That set
 * is where the capture rate gets fixed.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MessageSquare, Search, X } from 'lucide-react';
import { adminApi } from './adminApi';
import type { ConversationSummary, TranscriptMessage } from './types';
import { Badge, EmptyState, Notice, Spinner, VIZ, relativeTime } from './ui';

const PAGE_SIZE = 25;

export const ConversationsTab: React.FC<{ onOpenLead: (id: string) => void }> = ({ onOpenLead }) => {
  const [rows, setRows] = useState<ConversationSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [missedOnly, setMissedOnly] = useState(false);
  const [search, setSearch] = useState('');
  const [searchDraft, setSearchDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openId, setOpenId] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<TranscriptMessage[] | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.conversations({
        page,
        missedOnly: missedOnly || undefined,
        q: search || undefined,
      });
      setRows(result.conversations);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load conversations.');
    } finally {
      setLoading(false);
    }
  }, [page, missedOnly, search]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchDraft);
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [searchDraft]);

  const openTranscript = async (id: string) => {
    setOpenId(id);
    setTranscript(null);
    try {
      const result = await adminApi.conversation(id);
      setTranscript(result.transcript);
    } catch {
      setTranscript([]);
    }
  };

  const lastPage = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898781]" />
          <input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search inside chat messages…"
            className="w-full rounded-lg border border-white/10 bg-[#0e0e13] py-1.5 pl-9 pr-3 text-xs text-white outline-none focus:border-lime/50"
          />
        </div>

        <button
          type="button"
          onClick={() => {
            setMissedOnly((value) => !value);
            setPage(1);
          }}
          className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
            missedOnly
              ? 'border-lime/50 bg-lime/10 text-lime'
              : 'border-white/10 bg-[#0e0e13] text-[#c3c2b7] hover:border-white/20'
          }`}
        >
          Missed opportunities only
        </button>
      </div>

      {missedOnly && (
        <Notice tone="warn">
          These visitors asked about pricing, rates or a call but never shared contact details.
          Each one is a lead the chatbot nearly captured.
        </Notice>
      )}

      {error && <Notice tone="error">{error}</Notice>}

      <div className="rounded-xl border border-white/10 bg-[#0e0e13]">
        {loading ? (
          <Spinner label="Loading conversations…" />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No conversations yet"
            hint="Every chat with the website assistant is recorded here, whether or not it becomes a lead."
          />
        ) : (
          <ul className="divide-y divide-white/[0.05]">
            {rows.map((row) => (
              <li key={row.id} className="px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => openTranscript(row.id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <p className="truncate text-sm text-white">
                      {row.first_message || 'Opened the chat without sending a message'}
                    </p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-[#898781]">
                      <span>{relativeTime(row.started_at)}</span>
                      <span>· {row.message_count} messages</span>
                      {row.landing_page && <span>· {row.landing_page}</span>}
                      {row.utm_source && <span>· {row.utm_source}</span>}
                      {row.fallback_count > 0 && (
                        <span style={{ color: VIZ.warm }}>· {row.fallback_count} fallback</span>
                      )}
                    </p>
                  </button>

                  <div className="flex shrink-0 items-center gap-2">
                    {row.lead_id ? (
                      <button type="button" onClick={() => onOpenLead(row.lead_id!)}>
                        <Badge label="Lead" color={VIZ.good} />
                      </button>
                    ) : (
                      <Badge label="No contact" color={VIZ.muted} />
                    )}
                    <button
                      type="button"
                      onClick={() => openTranscript(row.id)}
                      className="rounded-lg border border-white/10 p-1.5 text-[#c3c2b7] transition hover:border-white/25 hover:text-white"
                    >
                      <MessageSquare size={13} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {total > PAGE_SIZE && (
        <div className="flex items-center justify-between text-xs text-[#898781]">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="rounded-lg border border-white/10 p-1.5 transition hover:border-white/20 disabled:opacity-40"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="px-2 tabular-nums">
              {page} / {lastPage}
            </span>
            <button
              type="button"
              disabled={page >= lastPage}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-lg border border-white/10 p-1.5 transition hover:border-white/20 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {openId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpenId(null)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative flex max-h-[80vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-ink">
            <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <h3 className="text-sm font-semibold text-white">Transcript</h3>
              <button
                type="button"
                onClick={() => setOpenId(null)}
                className="rounded-lg border border-white/10 p-1.5 text-[#c3c2b7] transition hover:text-white"
              >
                <X size={14} />
              </button>
            </header>
            <div className="overflow-y-auto p-4">
              {transcript === null ? (
                <Spinner />
              ) : transcript.length === 0 ? (
                <EmptyState title="No messages stored" />
              ) : (
                <ul className="flex flex-col gap-2.5">
                  {transcript.map((message, index) => (
                    <li
                      key={index}
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
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
