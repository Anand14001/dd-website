import { answerCustomerQuery, type ChatMessage } from './_lib/chatbotEngine.js';

export const config = {
  maxDuration: 30,
};

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

async function parseBody(req: any): Promise<any> {
  if (typeof req.json === 'function') {
    try {
      return await req.json();
    } catch {
      return {};
    }
  }
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'object') return req.body;
    if (typeof req.body === 'string') {
      try {
        return JSON.parse(req.body);
      } catch {
        return {};
      }
    }
  }
  if (typeof req.on === 'function') {
    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
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
      const timeout = setTimeout(finish, 2000);
      req.on('data', (chunk: any) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      req.on('end', () => {
        clearTimeout(timeout);
        finish();
      });
      req.on('error', () => {
        clearTimeout(timeout);
        finish();
      });
    });
  }
  return {};
}

function sendResponse(res: any, status: number, data: unknown) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.status(status).json(data);
  }
  if (typeof res.setHeader === 'function' && typeof res.end === 'function') {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.end(JSON.stringify(data));
  }
}

export default async function handler(req: any, res?: any) {
  const method = req.method || 'GET';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    if (res) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      if (typeof res.status === 'function') return res.status(204).end();
      res.statusCode = 204;
      return res.end();
    }
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (method !== 'POST') {
    const errorPayload = { ok: false, error: 'Method Not Allowed' };
    if (res) {
      return sendResponse(res, 405, errorPayload);
    }
    return new Response(JSON.stringify(errorPayload), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  try {
    const body = await parseBody(req);
    const query = (body.message || body.prompt || '').trim();

    if (!query) {
      const errPayload = { ok: false, error: 'Question or message is required.' };
      if (res) {
        return sendResponse(res, 400, errPayload);
      }
      return new Response(JSON.stringify(errPayload), {
        status: 400,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const history: ChatMessage[] = Array.isArray(body.history) ? body.history : [];
    const result = await answerCustomerQuery(query, history);

    const payload = {
      ok: true,
      reply: result.reply,
      retrievedChunks: result.retrievedChunks,
      mode: result.mode,
    };

    if (res) {
      return sendResponse(res, 200, payload);
    }
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[Digital Dude Assistant API error]', errorMessage);

    const fallbackPayload = {
      ok: true,
      reply:
        "I don't have enough confirmed information about that in my current Digital Dude knowledge base. Please contact Digital Dude directly for the exact details.",
      retrievedChunks: [],
      mode: 'rule_fallback',
    };

    if (res) {
      return sendResponse(res, 200, fallbackPayload);
    }
    return new Response(JSON.stringify(fallbackPayload), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
}

export async function OPTIONS(req?: any, res?: any) {
  return handler(req || { method: 'OPTIONS' }, res);
}

export async function POST(req: any, res?: any) {
  if (req && !req.method) req.method = 'POST';
  return handler(req, res);
}
