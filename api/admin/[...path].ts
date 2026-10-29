/**
 * Catch-all route for /api/admin/*.
 *
 * Vercel's Hobby plan allows 12 serverless functions per deployment, so all
 * admin endpoints share this one. The implementation lives in _lib/adminRouter
 * so the Vite dev middleware can reuse it without importing a bracketed path.
 */
import handleAdmin from '../_lib/adminRouter.js';

export const config = {
  maxDuration: 30,
};

export default handleAdmin;

export async function OPTIONS(req?: any, res?: any) {
  return handleAdmin(req || { method: 'OPTIONS' }, res);
}

export async function GET(req: any, res?: any) {
  if (req && !req.method) req.method = 'GET';
  return handleAdmin(req, res);
}

export async function POST(req: any, res?: any) {
  if (req && !req.method) req.method = 'POST';
  return handleAdmin(req, res);
}

export async function PATCH(req: any, res?: any) {
  if (req && !req.method) req.method = 'PATCH';
  return handleAdmin(req, res);
}

export async function DELETE(req: any, res?: any) {
  if (req && !req.method) req.method = 'DELETE';
  return handleAdmin(req, res);
}
