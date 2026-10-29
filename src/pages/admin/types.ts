/** Shapes returned by the /api/admin endpoints. */

export type LeadStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'proposal_sent'
  | 'won'
  | 'lost'
  | 'junk';

export type Temperature = 'hot' | 'warm' | 'cold';

export interface LeadNote {
  at: string;
  author: string;
  text: string;
}

export interface Lead {
  id: string;
  conversation_id: string | null;
  source: 'chatbot' | 'contact_form';
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
  temperature: Temperature;
  stage: LeadStage;
  owner: string | null;
  next_action_at: string | null;
  notes: LeadNote[];
  consent: boolean;
  created_at: string;
  updated_at: string;
}

export interface TranscriptMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  mode: string | null;
  retrieved_chunks: { id: string; title: string; category: string }[];
  /** Present when a transcript spans more than one conversation. */
  conversation_id?: string;
}

export interface LeadEvent {
  type: string;
  field: string | null;
  from_value: string | null;
  to_value: string | null;
  actor: string;
  created_at: string;
}

export interface LeadDetail {
  lead: Lead;
  transcript: TranscriptMessage[];
  events: LeadEvent[];
  conversation: {
    session_id: string;
    started_at: string;
    landing_page: string | null;
    referrer: string | null;
    utm_source: string | null;
    utm_medium: string | null;
    utm_campaign: string | null;
    message_count: number;
    gemini_count: number;
    fallback_count: number;
  } | null;
}

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

export interface ConversationSummary {
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

export interface SystemHealth {
  db: {
    configured: boolean;
    reachable: boolean;
    migrated: boolean;
    driver: 'neon' | 'local';
    target: string;
    counts?: { leads: number; conversations: number; messages: number };
    error?: string;
  };
  whatsapp: {
    configured: boolean;
    recipients: number;
    mode: 'template' | 'text';
    templateName: string;
    missing: string[];
  };
  gemini: { configured: boolean };
  session: { actor: string; expiresAt: number };
}

export interface FilterOptions {
  services: { id: string; label: string }[];
  stages: LeadStage[];
  temperatures: Temperature[];
  sources: string[];
}

export interface LeadQuery {
  stage?: string;
  source?: string;
  service?: string;
  temperature?: string;
  q?: string;
  from?: string;
  to?: string;
  needsAttention?: boolean;
  sort?: string;
  direction?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export const STAGE_LABELS: Record<LeadStage, string> = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal_sent: 'Proposal Sent',
  won: 'Won',
  lost: 'Lost',
  junk: 'Junk',
};

/** Pipeline order, used for the funnel and the stage selector. */
export const STAGE_ORDER: LeadStage[] = [
  'new',
  'contacted',
  'qualified',
  'proposal_sent',
  'won',
  'lost',
  'junk',
];
