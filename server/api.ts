import type { IncomingMessage, ServerResponse } from 'node:http';
import { answerCustomerQuery, type ChatMessage } from './chatbotEngine';
import { KNOWLEDGE_CHUNKS } from './knowledgeBase';

/** Reads a JSON request body without pulling in body-parser. */
async function readJson(req: IncomingMessage): Promise<Record<string, unknown>> {
  if ((req as any).body) {
    if (typeof (req as any).body === 'object' && (req as any).body !== null) {
      return (req as any).body as Record<string, unknown>;
    }
    if (typeof (req as any).body === 'string') {
      try {
        return JSON.parse((req as any).body);
      } catch {
        return {};
      }
    }
  }

  const contentLength = parseInt(req.headers['content-length'] || '0', 10);

  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    let receivedBytes = 0;
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      clearTimeout(timeout);
      try {
        if (chunks.length > 0) {
          const raw = Buffer.concat(chunks).toString('utf8');
          resolve(JSON.parse(raw));
        } else {
          resolve({});
        }
      } catch {
        resolve({});
      }
    };

    const timeout = setTimeout(finish, 1200);

    req.on('data', (chunk: Buffer | string) => {
      const b = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      chunks.push(b);
      receivedBytes += b.length;
      if (contentLength > 0 && receivedBytes >= contentLength) {
        finish();
      }
    });

    req.on('end', finish);
    req.on('error', finish);
  });
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

  console.log('[contact] new enquiry', {
    ...submission,
    receivedAt: new Date().toISOString(),
  });

  return sendJson(res, 200, { ok: true });
}

export interface ChatRequestBody {
  message?: string;
  prompt?: string;
  history?: ChatMessage[];
}

/** POST /api/chat & POST /api/assistant */
export async function handleChat(req: IncomingMessage, res: ServerResponse) {
  try {
    const body = (await readJson(req)) as ChatRequestBody;
    const query = (body.message || body.prompt || '').trim();

    if (!query) {
      return sendJson(res, 400, {
        ok: false,
        error: 'Question or message is required.',
      });
    }

    const history = Array.isArray(body.history) ? body.history : [];
    const result = await answerCustomerQuery(query, history);

    return sendJson(res, 200, {
      ok: true,
      reply: result.reply,
      retrievedChunks: result.retrievedChunks,
      mode: result.mode,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Digital Dude Assistant API error]', errorMessage);

    // Fall back gracefully with 200 OK so the chat UI doesn't crash or display 500
    return sendJson(res, 200, {
      ok: true,
      reply:
        "I don't have enough confirmed information about that in my current Digital Dude knowledge base. Please contact Digital Dude directly for the exact details.",
      retrievedChunks: [],
      mode: 'rule_fallback',
    });
  }
}

/** GET /api/assistant/info */
export function handleAssistantInfo(_req: IncomingMessage, res: ServerResponse) {
  return sendJson(res, 200, {
    ok: true,
    assistantName: 'Digital Dude Assistant',
    agency: 'Digital Dude',
    location: 'Chennai, Tamil Nadu, India',
    operatingSince: 2022,
    workingHours: '9:30 AM to 5:30 PM',
    supportedLanguages: ['English', 'Tanglish (Tamil in Latin script)'],
    knowledgeChunkCount: KNOWLEDGE_CHUNKS.length,
    chunks: KNOWLEDGE_CHUNKS.map(c => ({ id: c.id, title: c.title, category: c.category })),
  });
}

/** Connect/Express-compatible middleware mounting the API routes. */
export async function apiMiddleware(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
): Promise<void> {
  const url = (req.url ?? '').split('?')[0];

  if (req.method === 'POST') {
    if (url === '/api/contact') return handleContact(req, res);
    if (url === '/api/chat' || url === '/api/assistant') return handleChat(req, res);
  }

  if (req.method === 'GET') {
    if (url === '/api/assistant/info' || url === '/api/chat/info') {
      return handleAssistantInfo(req, res);
    }
  }

  return next();
}
