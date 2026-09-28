import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleAssistantInfo } from '../../server/api';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'GET') {
    return handleAssistantInfo(req, res);
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
}
