import type { IncomingMessage, ServerResponse } from 'node:http';
import { handleContact } from '../server/api';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method === 'POST') {
    return handleContact(req, res);
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ ok: false, error: 'Method Not Allowed' }));
}
