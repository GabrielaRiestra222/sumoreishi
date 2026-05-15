import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../_lib/prisma.js';
import { verifyAdminToken } from '../_lib/auth.js';
import { setCors } from '../_lib/cors.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // GET — lista paginada
  if (req.method === 'GET') {
    const { page = '1', limit = '50', unread } = req.query as Record<string, string>;
    const take = Math.min(Number(limit), 100);
    const skip = (Number(page) - 1) * take;
    const where = unread === 'true' ? { read: false } : {};

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take }),
      prisma.contact.count({ where }),
    ]);

    return res.status(200).json({ contacts, total });
  }

  // PATCH — marcar leído/no leído
  if (req.method === 'PATCH') {
    const { id, read } = req.body as { id: string; read: boolean };
    const contact = await prisma.contact.update({ where: { id }, data: { read } });
    return res.status(200).json(contact);
  }

  // DELETE — borrar contacto
  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string };
    await prisma.contact.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
