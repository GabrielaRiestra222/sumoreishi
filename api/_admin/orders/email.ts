import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../_lib/prisma.js';
import { setCors, handlePreflight } from '../../_lib/cors.js';
import { verifyAdminToken } from '../../_lib/auth.js';
import { sendNewOrderNotificationToAdmin } from '../../../src/services/email.js';

function getRouteId(req: VercelRequest): string {
  const queryId = req.query.id;
  if (typeof queryId === 'string' && queryId) return queryId;
  if (Array.isArray(queryId) && queryId[0]) return queryId[0];

  const requestUrl = new URL(req.url ?? '/api/admin/orders', `https://${req.headers.host ?? 'localhost'}`);
  const path = requestUrl.pathname.replace(/^\/api\/admin/, '');
  const idFromPath = path.match(/^\/orders\/([^/]+)\/email$/)?.[1];
  return idFromPath ? decodeURIComponent(idFromPath) : '';
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const id = getRouteId(req);
  if (!id) return res.status(400).json({ error: 'Order id requerido' });

  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    });

    if (!order) return res.status(404).json({ error: 'Order not found' });

    await sendNewOrderNotificationToAdmin({
      orderId: order.id,
      customerName: order.customer?.name ?? undefined,
      customerEmail: order.customer?.email ?? 'desconocido',
      customerPhone: order.customer?.phone ?? undefined,
      items: order.items.map((item) => ({
        name: item.product?.name ?? item.productName,
        quantity: item.quantity,
        unitEurCents: item.unitEurCents,
      })),
      totalEurCents: order.totalEurCents,
    });

    return res.status(200).json({ sent: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error enviando email';
    console.error('[admin/order-email]', message);
    return res.status(500).json({ error: message });
  }
}
