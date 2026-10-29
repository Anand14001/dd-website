/**
 * Thin client for /api/admin.
 *
 * The session lives in an HttpOnly cookie, so every call just needs
 * `credentials: 'same-origin'` — there is no token for this code to hold, and
 * nothing sensitive is kept in the browser.
 */
import type {
  BotHealth,
  ConversationSummary,
  DashboardStats,
  FilterOptions,
  Lead,
  LeadDetail,
  LeadQuery,
  SystemHealth,
  TranscriptMessage,
} from './types';

const BASE = '/api/admin';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    credentials: 'same-origin',
    headers: init.body ? { 'Content-Type': 'application/json' } : undefined,
    ...init,
  });

  const text = await response.text();
  let payload: any = {};
  try {
    payload = text ? JSON.parse(text) : {};
  } catch {
    payload = { error: text.slice(0, 200) };
  }

  if (!response.ok || payload.ok === false) {
    throw new ApiError(response.status, payload.error || `Request failed (${response.status})`);
  }
  return payload as T;
}

function toQueryString(query: Record<string, unknown>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === '' || value === false) continue;
    params.set(key, String(value));
  }
  const encoded = params.toString();
  return encoded ? `?${encoded}` : '';
}

export const adminApi = {
  session: () =>
    request<{ authenticated: boolean; actor: string | null }>('/session'),

  login: (password: string) =>
    request<{ ok: true }>('/login', {
      method: 'POST',
      body: JSON.stringify({ password }),
    }),

  logout: () => request<{ ok: true }>('/logout', { method: 'POST' }),

  stats: () => request<{ stats: DashboardStats }>('/stats').then((r) => r.stats),

  options: () => request<FilterOptions>('/options'),

  leads: (query: LeadQuery) =>
    request<{ leads: Lead[]; total: number; page: number; pageSize: number }>(
      `/leads${toQueryString(query as Record<string, unknown>)}`,
    ),

  lead: (id: string) => request<LeadDetail>(`/leads/${id}`),

  updateLead: (id: string, patch: Record<string, unknown>) =>
    request<{ lead: Lead }>(`/leads/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(patch),
    }).then((r) => r.lead),

  deleteLead: (id: string) => request<{ deleted: boolean }>(`/leads/${id}`, { method: 'DELETE' }),

  conversations: (query: { q?: string; missedOnly?: boolean; page?: number }) =>
    request<{ conversations: ConversationSummary[]; total: number }>(
      `/conversations${toQueryString(query)}`,
    ),

  conversation: (id: string) =>
    request<{ conversation: Record<string, any>; transcript: TranscriptMessage[] }>(
      `/conversations/${id}`,
    ),

  botHealth: () => request<{ health: BotHealth }>('/bot-health').then((r) => r.health),

  health: () => request<SystemHealth>('/health'),

  migrate: () => request<{ applied: number; statements: number }>('/migrate', { method: 'POST' }),

  testWhatsApp: () =>
    request<{ sent: string[]; errors: string[] }>('/test-whatsapp', { method: 'POST' }),

  purge: (days: number) =>
    request<{ deleted: number; days: number }>('/purge', {
      method: 'POST',
      body: JSON.stringify({ days }),
    }),

  /** CSV export is a browser download, so it bypasses the JSON helper. */
  exportUrl: (query: LeadQuery) => `${BASE}/export${toQueryString(query as Record<string, unknown>)}`,
};
