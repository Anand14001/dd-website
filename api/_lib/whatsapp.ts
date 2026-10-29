/**
 * WhatsApp lead alerts via the Meta WhatsApp Cloud API.
 *
 * Business-initiated messages must use an approved template, so the default
 * path sends a template with five body parameters. See WHATSAPP_SETUP.md for the
 * exact template text to register — the parameter order below must match it.
 *
 * Everything here is optional: with no credentials configured the notifier logs
 * and returns, so leads are still captured and the site is unaffected.
 */
import { serviceLabel } from './leadIntelligence.js';
import { hasSentNotification, logNotification, type LeadRow } from './repository.js';

const TEMPERATURE_RANK: Record<string, number> = { cold: 0, warm: 1, hot: 2 };

export interface WhatsAppStatus {
  configured: boolean;
  recipients: number;
  mode: 'template' | 'text';
  templateName: string;
  missing: string[];
}

function recipients(): string[] {
  return (process.env.WHATSAPP_ALERT_TO || '')
    .split(',')
    .map((value) => value.replace(/\D/g, ''))
    .filter((value) => value.length >= 10);
}

function useTextMode(): boolean {
  return process.env.WHATSAPP_USE_TEXT?.trim().toLowerCase() === 'true';
}

function templateName(): string {
  return process.env.WHATSAPP_TEMPLATE_NAME?.trim() || 'new_lead_alert';
}

export function whatsappStatus(): WhatsAppStatus {
  const missing: string[] = [];
  if (!process.env.WHATSAPP_PHONE_NUMBER_ID?.trim()) missing.push('WHATSAPP_PHONE_NUMBER_ID');
  if (!process.env.WHATSAPP_ACCESS_TOKEN?.trim()) missing.push('WHATSAPP_ACCESS_TOKEN');
  if (recipients().length === 0) missing.push('WHATSAPP_ALERT_TO');

  return {
    configured: missing.length === 0,
    recipients: recipients().length,
    mode: useTextMode() ? 'text' : 'template',
    templateName: templateName(),
    missing,
  };
}

export function isWhatsAppConfigured(): boolean {
  return whatsappStatus().configured;
}

/**
 * Template parameters may not contain newlines, tabs, or runs of four or more
 * spaces — Meta rejects the whole message if they do.
 */
function sanitiseParam(value: string | null | undefined, fallback: string, max = 220): string {
  const cleaned = (value ?? '').replace(/[\r\n\t]+/g, ' ').replace(/\s{2,}/g, ' ').trim();
  const text = cleaned.length > 0 ? cleaned : fallback;
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function endpoint(): string {
  const version = process.env.WHATSAPP_API_VERSION?.trim() || 'v21.0';
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID?.trim();
  return `https://graph.facebook.com/${version}/${phoneId}/messages`;
}

/** The five ordered template parameters, also used to build the plain-text body. */
function buildParams(lead: LeadRow): string[] {
  const services = (lead.services ?? []).map(serviceLabel).join(', ');
  return [
    sanitiseParam(lead.temperature?.toUpperCase(), 'NEW', 10),
    sanitiseParam(lead.name, 'Unnamed visitor', 60),
    sanitiseParam(lead.phone ? `+91 ${lead.phone}` : lead.email, 'no contact shared', 60),
    sanitiseParam(services, 'not specified yet', 120),
    sanitiseParam(lead.summary, 'Chat enquiry', 220),
  ];
}

function buildTextBody(lead: LeadRow): string {
  const [temperature, name, contact, services, summary] = buildParams(lead);
  return [
    `${temperature} lead from the website chatbot`,
    `Name: ${name}`,
    `Contact: ${contact}`,
    `Interested in: ${services}`,
    `Details: ${summary}`,
    `Score: ${lead.score}/100`,
  ].join('\n');
}

async function postMessage(to: string, payload: Record<string, unknown>): Promise<void> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN?.trim();
  const response = await fetch(endpoint(), {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', to, ...payload }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new Error(`WhatsApp API ${response.status}: ${detail.slice(0, 400)}`);
  }
}

/** Sends one alert to one recipient. Throws on API failure so callers can log it. */
export async function sendLeadAlert(lead: LeadRow, to: string): Promise<void> {
  if (useTextMode()) {
    await postMessage(to, {
      type: 'text',
      text: { preview_url: false, body: buildTextBody(lead) },
    });
    return;
  }

  await postMessage(to, {
    type: 'template',
    template: {
      name: templateName(),
      language: { code: process.env.WHATSAPP_TEMPLATE_LANG?.trim() || 'en' },
      components: [
        {
          type: 'body',
          parameters: buildParams(lead).map((text) => ({ type: 'text', text })),
        },
      ],
    },
  });
}

function minimumTemperature(): number {
  const configured = process.env.WHATSAPP_ALERT_MIN_TEMPERATURE?.trim().toLowerCase() || 'warm';
  return TEMPERATURE_RANK[configured] ?? TEMPERATURE_RANK.warm;
}

/**
 * Alerts the sales team about a lead, at most once per lead.
 *
 * Deliberately never throws: this runs after the visitor's response has already
 * been sent, and a notification failure must not lose the lead.
 */
export async function notifyNewLead(lead: LeadRow): Promise<void> {
  const status = whatsappStatus();

  if (!status.configured) {
    console.log('[whatsapp] alert skipped, not configured', {
      leadId: lead.id,
      missing: status.missing,
    });
    return;
  }

  if ((TEMPERATURE_RANK[lead.temperature] ?? 0) < minimumTemperature()) return;

  // A lead with no phone or email cannot be acted on, so alerting about it is
  // just noise. It is still recorded and visible in the dashboard.
  if (!lead.phone && !lead.email) return;

  if (await hasSentNotification(lead.id)) return;

  for (const to of recipients()) {
    try {
      await sendLeadAlert(lead, to);
      await logNotification({
        leadId: lead.id,
        recipient: to,
        status: 'sent',
        detail: `${lead.temperature} lead, score ${lead.score}`,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('[whatsapp] alert failed', { leadId: lead.id, to, message });
      await logNotification({
        leadId: lead.id,
        recipient: to,
        status: 'failed',
        detail: message,
      });
    }
  }
}

/** Sends a sample alert so the admin can verify credentials from the dashboard. */
export async function sendTestAlert(): Promise<{ sent: string[]; errors: string[] }> {
  const status = whatsappStatus();
  if (!status.configured) {
    return { sent: [], errors: [`Not configured. Missing: ${status.missing.join(', ')}`] };
  }

  const sample: LeadRow = {
    id: 'test',
    conversation_id: null,
    source: 'chatbot',
    name: 'Test Lead',
    email: null,
    phone: '9000000000',
    company: 'Test Business',
    business_type: 'bakery',
    services: ['web_development'],
    budget_hint: '50k',
    timeline_hint: 'this month',
    summary: 'This is a test alert from the Digital Dude admin dashboard.',
    score: 72,
    signals: [{ key: 'test', label: 'Test signal', points: 72 }],
    temperature: 'hot',
    stage: 'new',
    owner: null,
    next_action_at: null,
    notes: [],
    dedupe_key: null,
    consent: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const sent: string[] = [];
  const errors: string[] = [];

  for (const to of recipients()) {
    try {
      await sendLeadAlert(sample, to);
      sent.push(to);
    } catch (err) {
      errors.push(`${to}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  return { sent, errors };
}

/**
 * Builds a LeadRow-shaped object from extraction output without touching the
 * database. Used as a last resort: if the database write fails we still want the
 * team to get the WhatsApp alert rather than silently lose the enquiry.
 */
export function leadRowFromExtracted(
  extracted: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    businessType?: string;
    services: string[];
    budgetHint?: string;
    timelineHint?: string;
    summary: string;
    signals?: { key: string; label: string; points: number }[];
    score: number;
    temperature: 'hot' | 'warm' | 'cold';
  },
  source: 'chatbot' | 'contact_form',
): LeadRow {
  const now = new Date().toISOString();
  return {
    id: `unsaved-${now}`,
    conversation_id: null,
    source,
    name: extracted.name ?? null,
    email: extracted.email ?? null,
    phone: extracted.phone ?? null,
    company: extracted.company ?? null,
    business_type: extracted.businessType ?? null,
    services: extracted.services ?? [],
    budget_hint: extracted.budgetHint ?? null,
    timeline_hint: extracted.timelineHint ?? null,
    summary: extracted.summary,
    score: extracted.score,
    signals: extracted.signals ?? [],
    temperature: extracted.temperature,
    stage: 'new',
    owner: null,
    next_action_at: null,
    notes: [],
    dedupe_key: null,
    consent: false,
    created_at: now,
    updated_at: now,
  };
}
