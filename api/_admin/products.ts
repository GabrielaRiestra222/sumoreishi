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

  // GET — lista de productos
  if (req.method === 'GET') {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'asc' } });
    return res.status(200).json(products);
  }

  // POST — crear producto
  if (req.method === 'POST') {
    const { slug, name, format, priceEurCents, active } = req.body as {
      slug: string; name: string; format: string; priceEurCents: number; active?: boolean;
    };

    if (!slug || !name || !format || !priceEurCents) {
      return res.status(400).json({ error: 'slug, name, format y priceEurCents son obligatorios' });
    }

    const product = await prisma.product.create({
      data: { slug, name, format, priceEurCents, active: active ?? true },
    });
    return res.status(201).json(product);
  }

  // PATCH — editar producto
  if (req.method === 'PATCH') {
    const { id, slug, name, format, priceEurCents, active } = req.body as {
      id: string; slug?: string; name?: string; format?: string; priceEurCents?: number; active?: boolean;
    };

    if (!id) return res.status(400).json({ error: 'id es obligatorio' });

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(slug !== undefined && { slug }),
        ...(name !== undefined && { name }),
        ...(format !== undefined && { format }),
        ...(priceEurCents !== undefined && { priceEurCents }),
        ...(active !== undefined && { active }),
      },
    });
    return res.status(200).json(product);
  }

  // DELETE — borrar producto
  if (req.method === 'DELETE') {
    const { id } = req.query as { id: string };
    if (!id) return res.status(400).json({ error: 'id es obligatorio' });
    await prisma.product.delete({ where: { id } });
    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
