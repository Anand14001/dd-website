import { KNOWLEDGE_CHUNKS } from '../_lib/knowledgeBase.js';

export const config = {
  maxDuration: 30,
};

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
};

function sendResponse(res: any, status: number, data: unknown) {
  if (typeof res.status === 'function' && typeof res.json === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.status(status).json(data);
  }
  if (typeof res.setHeader === 'function' && typeof res.end === 'function') {
    res.statusCode = status;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    return res.end(JSON.stringify(data));
  }
}

export default async function handler(req: any, res?: any) {
  const method = req.method || 'GET';

  if (method === 'OPTIONS') {
    if (res) {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      if (typeof res.status === 'function') return res.status(204).end();
      res.statusCode = 204;
      return res.end();
    }
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  if (method !== 'GET') {
    const errorPayload = { ok: false, error: 'Method Not Allowed' };
    if (res) {
      return sendResponse(res, 405, errorPayload);
    }
    return new Response(JSON.stringify(errorPayload), {
      status: 405,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }

  const payload = {
    ok: true,
    assistantName: 'Digital Dude Assistant',
    agency: 'Digital Dude',
    location: 'Chennai, Tamil Nadu, India',
    operatingSince: 2022,
    workingHours: '9:30 AM to 5:30 PM',
    supportedLanguages: ['English', 'Tanglish (Tamil in Latin script)'],
    knowledgeChunkCount: KNOWLEDGE_CHUNKS.length,
    chunks: KNOWLEDGE_CHUNKS.map((c) => ({
      id: c.id,
      title: c.title,
      category: c.category,
    })),
  };

  if (res) {
    return sendResponse(res, 200, payload);
  }
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

export async function OPTIONS(req?: any, res?: any) {
  return handler(req || { method: 'OPTIONS' }, res);
}

export async function GET(req?: any, res?: any) {
  return handler(req, res);
}
