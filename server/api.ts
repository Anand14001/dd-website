import type { IncomingMessage, ServerResponse } from 'node:http';

/** Reads a JSON request body without pulling in body-parser. */
async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  if (chunks.length === 0) return {};
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return {};
  }
}

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  services: string[];
  message: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** POST /api/contact */
export async function handleContact(req: IncomingMessage, res: ServerResponse) {
  const body = (await readJson(req)) as Partial<ContactSubmission>;

  const errors: Record<string, string> = {};
  if (!body.name?.trim()) errors.name = 'Name is required.';
  if (!body.email?.trim()) errors.email = 'Email is required.';
  else if (!EMAIL_RE.test(body.email.trim())) errors.email = 'That email address looks wrong.';
  if (!body.message?.trim()) errors.message = 'Tell us a little about the project.';

  if (Object.keys(errors).length > 0) {
    return sendJson(res, 400, { ok: false, errors });
  }

  const submission: ContactSubmission = {
    name: body.name!.trim(),
    email: body.email!.trim(),
    phone: body.phone?.trim() || undefined,
    company: body.company?.trim() || undefined,
    services: Array.isArray(body.services) ? body.services : [],
    message: body.message!.trim(),
  };

  // Delivery integration goes here (email service, CRM, sheet append...).
  // Until one is configured the submission is logged so nothing is silently dropped.
  console.log('[contact] new enquiry', {
    ...submission,
    receivedAt: new Date().toISOString(),
  });

  return sendJson(res, 200, { ok: true });
}

/** Connect/Express-compatible middleware mounting the API routes. */
export async function apiMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): Promise<void> {
  const url = (req.url ?? '').split('?')[0];

  if (req.method !== 'POST') return next();
  if (url === '/api/contact') return handleContact(req, res);

  return next();
}
