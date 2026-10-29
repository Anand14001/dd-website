/**
 * POST /api/contact
 *
 * Contact-form enquiries. These used to be written to the console only, which
 * meant every submission was lost once the log window rolled over. They now land
 * in the same leads table as chatbot enquiries so one pipeline covers both.
 */
import { fail, ok, preflight, send, toApiRequest } from './_lib/http.js';
import { detectServices, extractLead, normalisePhone, type ProvidedLeadFields } from './_lib/leadIntelligence.js';
import { upsertLead } from './_lib/repository.js';
import { leadRowFromExtracted, notifyNewLead } from './_lib/whatsapp.js';

export const config = {
  maxDuration: 30,
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: any, res?: any) {
  const request = await toApiRequest(req);

  if (request.method === 'OPTIONS') return preflight(res);
  if (request.method !== 'POST') return send(fail(405, 'Method Not Allowed'), res);

  const body = request.body;
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const message = typeof body.message === 'string' ? body.message.trim() : '';
  const phoneRaw = typeof body.phone === 'string' ? body.phone.trim() : '';
  const company = typeof body.company === 'string' ? body.company.trim() : '';

  const errors: Record<string, string> = {};
  if (!name) errors.name = 'Name is required.';
  if (!email) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(email)) errors.email = 'That email address looks wrong.';
  if (!message) errors.message = 'Tell us a little about the project.';

  if (Object.keys(errors).length > 0) {
    return send({ status: 400, json: { ok: false, errors } }, res);
  }

  // The form sends service titles, not catalog ids, so match them as keywords.
  const selectedTitles: string[] = Array.isArray(body.services)
    ? body.services.filter((s: unknown) => typeof s === 'string')
    : [];

  const provided: ProvidedLeadFields = {
    name,
    email,
    phone: phoneRaw ? normalisePhone(phoneRaw) : undefined,
    company: company || undefined,
    services: detectServices([...selectedTitles, message].join(' ')),
  };

  // Scoring reads the enquiry text, so a form that mentions budget or a deadline
  // scores the same way an equivalent chat message would.
  const extracted = extractLead([{ role: 'user', content: message }], provided);
  extracted.summary = selectedTitles.length > 0
    ? `${selectedTitles.join(', ')} — ${message.slice(0, 200)}`
    : message.slice(0, 240);

  try {
    const result = await upsertLead({
      conversationId: null,
      source: 'contact_form',
      extracted,
      consent: true,
    });

    if (result) {
      if (result.isNew) await notifyNewLead(result.lead);
      return send(ok({ stored: true }), res);
    }

    console.error('[contact] could not persist enquiry, alerting only', { name, email });
    await notifyNewLead(leadRowFromExtracted(extracted, 'contact_form'));
    return send(ok({ stored: false }), res);
  } catch (err) {
    console.error('[contact] unexpected failure', err instanceof Error ? err.message : err);
    return send(ok({ stored: false }), res);
  }
}

export async function OPTIONS(req?: any, res?: any) {
  return handler(req || { method: 'OPTIONS' }, res);
}

export async function POST(req: any, res?: any) {
  if (req && !req.method) req.method = 'POST';
  return handler(req, res);
}
