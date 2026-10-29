/**
 * The leads table — the screen a salesperson lives in.
 *
 * Filters sit in one row above the table, selection drives a URL-less query
 * object, and the export button carries the current filters so what you download
 * is what you are looking at.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  Download,
  RotateCcw,
  Search,
} from 'lucide-react';
import { adminApi } from './adminApi';
import type { FilterOptions, Lead, LeadQuery } from './types';
import { STAGE_LABELS } from './types';
import {
  Badge,
  EmptyState,
  Notice,
  Spinner,
  TEMPERATURE_COLOR,
  VIZ,
  formatDateTime,
  relativeTime,
} from './ui';

const selectClass =
  'rounded-lg border border-white/10 bg-[#0e0e13] px-2.5 py-1.5 text-xs text-[#c3c2b7] outline-none focus:border-lime/50';

const SORT_COLUMNS: { key: string; label: string; className?: string }[] = [
  { key: 'name', label: 'Lead' },
  { key: '', label: 'Interest' },
  { key: 'score', label: 'Score' },
  { key: 'stage', label: 'Stage' },
  { key: 'next_action_at', label: 'Next action' },
  { key: 'created_at', label: 'Captured' },
];

export const LeadsTab: React.FC<{
  options: FilterOptions | null;
  query: LeadQuery;
  onQueryChange: (next: LeadQuery) => void;
  onOpenLead: (id: string) => void;
  refreshToken: number;
}> = ({ options, query, onQueryChange, onOpenLead, refreshToken }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchDraft, setSearchDraft] = useState(query.q ?? '');

  const pageSize = query.pageSize ?? 25;
  const page = query.page ?? 1;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await adminApi.leads(query);
      setLeads(result.leads);
      setTotal(result.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load leads.');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    void load();
  }, [load, refreshToken]);

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const timer = setTimeout(() => {
      if ((query.q ?? '') !== searchDraft) {
        onQueryChange({ ...query, q: searchDraft || undefined, page: 1 });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchDraft]); // eslint-disable-line react-hooks/exhaustive-deps

  const setFilter = (patch: Partial<LeadQuery>) => onQueryChange({ ...query, ...patch, page: 1 });

  const toggleSort = (key: string) => {
    if (!key) return;
    const direction = query.sort === key && query.direction === 'desc' ? 'asc' : 'desc';
    onQueryChange({ ...query, sort: key, direction });
  };

  const serviceLabel = (id: string) =>
    options?.services.find((service) => service.id === id)?.label ?? id;

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const filtersActive = Boolean(
    query.stage || query.source || query.service || query.temperature || query.q || query.needsAttention,
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[200px] flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898781]" />
          <input
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search name, phone, email, company…"
            className="w-full rounded-lg border border-white/10 bg-[#0e0e13] py-1.5 pl-9 pr-3 text-xs text-white outline-none focus:border-lime/50"
          />
        </div>

        <select
          value={query.stage ?? ''}
          onChange={(event) => setFilter({ stage: event.target.value || undefined })}
          className={selectClass}
        >
          <option value="">All stages</option>
          {(options?.stages ?? []).map((stage) => (
            <option key={stage} value={stage}>
              {STAGE_LABELS[stage]}
            </option>
          ))}
        </select>

        <select
          value={query.temperature ?? ''}
          onChange={(event) => setFilter({ temperature: event.target.value || undefined })}
          className={selectClass}
        >
          <option value="">Any temperature</option>
          <option value="hot">Hot</option>
          <option value="warm">Warm</option>
          <option value="cold">Cold</option>
        </select>

        <select
          value={query.service ?? ''}
          onChange={(event) => setFilter({ service: event.target.value || undefined })}
          className={selectClass}
        >
          <option value="">All services</option>
          {(options?.services ?? []).map((service) => (
            <option key={service.id} value={service.id}>
              {service.label}
            </option>
          ))}
        </select>

        <select
          value={query.source ?? ''}
          onChange={(event) => setFilter({ source: event.target.value || undefined })}
          className={selectClass}
        >
          <option value="">All sources</option>
          <option value="chatbot">Chatbot</option>
          <option value="contact_form">Contact form</option>
        </select>

        <button
          type="button"
          onClick={() => setFilter({ needsAttention: !query.needsAttention })}
          className={`rounded-lg border px-2.5 py-1.5 text-xs transition ${
            query.needsAttention
              ? 'border-lime/50 bg-lime/10 text-lime'
              : 'border-white/10 bg-[#0e0e13] text-[#c3c2b7] hover:border-white/20'
          }`}
        >
          Needs attention
        </button>

        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setSearchDraft('');
              onQueryChange({ page: 1, pageSize });
            }}
            className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#0e0e13] px-2.5 py-1.5 text-xs text-[#c3c2b7] transition hover:border-white/20"
          >
            <RotateCcw size={12} /> Clear
          </button>
        )}

        <a
          href={adminApi.exportUrl(query)}
          className="flex items-center gap-1 rounded-lg border border-white/10 bg-[#0e0e13] px-2.5 py-1.5 text-xs text-[#c3c2b7] transition hover:border-white/20"
        >
          <Download size={12} /> Export CSV
        </a>
      </div>

      {error && <Notice tone="error">{error}</Notice>}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0e0e13]">
        {loading ? (
          <Spinner label="Loading leads…" />
        ) : leads.length === 0 ? (
          <EmptyState
            title={filtersActive ? 'No leads match these filters' : 'No leads captured yet'}
            hint={
              filtersActive
                ? 'Try clearing a filter.'
                : 'Leads appear here as soon as someone shares their details in the chatbot or submits the contact form.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-white/[0.07] text-[11px] uppercase tracking-wider text-[#898781]">
                  {SORT_COLUMNS.map((column) => (
                    <th key={column.label} className="px-4 py-3 font-medium">
                      {column.key ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(column.key)}
                          className="flex items-center gap-1 transition hover:text-white"
                        >
                          {column.label}
                          {query.sort === column.key &&
                            (query.direction === 'asc' ? (
                              <ArrowUp size={11} />
                            ) : (
                              <ArrowDown size={11} />
                            ))}
                        </button>
                      ) : (
                        column.label
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    onClick={() => onOpenLead(lead.id)}
                    className="cursor-pointer border-b border-white/[0.04] transition last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-white">
                        {lead.name || 'Unnamed visitor'}
                      </p>
                      <p className="mt-0.5 text-xs text-[#898781]">
                        {lead.phone ? `+91 ${lead.phone}` : lead.email || 'No contact shared'}
                        {lead.company ? ` · ${lead.company}` : ''}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex max-w-[220px] flex-wrap gap-1">
                        {lead.services.slice(0, 2).map((service) => (
                          <Badge key={service} label={serviceLabel(service)} color={VIZ.series1} />
                        ))}
                        {lead.services.length > 2 && (
                          <Badge label={`+${lead.services.length - 2}`} />
                        )}
                        {lead.services.length === 0 && (
                          <span className="text-xs text-[#898781]">—</span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm tabular-nums text-white">{lead.score}</span>
                        <Badge
                          label={lead.temperature.toUpperCase()}
                          color={TEMPERATURE_COLOR[lead.temperature]}
                        />
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Badge
                        label={STAGE_LABELS[lead.stage] ?? lead.stage}
                        color={
                          lead.stage === 'won'
                            ? VIZ.good
                            : lead.stage === 'lost' || lead.stage === 'junk'
                              ? VIZ.muted
                              : VIZ.series1
                        }
                      />
                      {lead.owner && (
                        <p className="mt-1 text-[11px] text-[#898781]">{lead.owner}</p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-xs">
                      {lead.next_action_at ? (
                        <span
                          style={{
                            color:
                              new Date(lead.next_action_at) < new Date() ? VIZ.warm : VIZ.textSecondary,
                          }}
                        >
                          {formatDateTime(lead.next_action_at)}
                        </span>
                      ) : (
                        <span className="text-[#898781]">Not set</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <p className="text-xs text-[#c3c2b7]">{relativeTime(lead.created_at)}</p>
                      <p className="mt-0.5 text-[11px] text-[#898781]">
                        {lead.source === 'contact_form' ? 'Contact form' : 'Chatbot'}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > pageSize && (
        <div className="flex items-center justify-between text-xs text-[#898781]">
          <span>
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => onQueryChange({ ...query, page: page - 1 })}
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
              onClick={() => onQueryChange({ ...query, page: page + 1 })}
              className="rounded-lg border border-white/10 p-1.5 transition hover:border-white/20 disabled:opacity-40"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
