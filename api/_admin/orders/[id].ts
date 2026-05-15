import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../_lib/prisma.js';
import { setCors } from '../../_lib/cors.js';
import { verifyAdminToken } from '../../_lib/auth.js';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token || !verifyAdminToken(token)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const order = await prisma.order.findUnique({
        where: { id: id as string },
        include: {
          customer: true,
          shippingAddress: true,
          items: true,
          shipment: true
        }
      });

      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }

      return res.status(200).json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { status, carrier, trackingNumber, internalNotes } = req.body as {
        status?: string;
        carrier?: string | null;
        trackingNumber?: string | null;
        internalNotes?: string | null;
      };

      // Actualizar pedido
      await prisma.order.update({
        where: { id: id as string },
        data: {
          ...(status && { status: status as never }),
          internalNotes: internalNotes ?? undefined,
        }
      });

      // Actualizar o crear shipment si hay datos de envío
      if (carrier !== undefined || trackingNumber !== undefined) {
        const shipmentData: Record<string, unknown> = {};
        if (carrier !== undefined) shipmentData.carrier = carrier;
        if (trackingNumber !== undefined) shipmentData.trackingNumber = trackingNumber;
        if (status === 'SHIPPED') {
          shipmentData.status = 'SHIPPED';
          shipmentData.shippedAt = new Date();
        }

        await prisma.shipment.upsert({
          where: { orderId: id as string },
          update: shipmentData,
          create: {
            orderId: id as string,
            ...shipmentData,
            status: (status === 'SHIPPED' ? 'SHIPPED' : 'PENDING') as never
          }
        });
      }

      // Devolver pedido actualizado con todas las relaciones
      const updatedOrder = await prisma.order.findUnique({
        where: { id: id as string },
        include: {
          customer: true,
          shippingAddress: true,
          items: true,
          shipment: true
        }
      });

      return res.status(200).json(updatedOrder);
    } catch (error) {
      console.error('Error updating order:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE — eliminar pedido
  if (req.method === 'DELETE') {
    try {
      // Borrar en cascada: items, eventos de pago, envío, direcciones
      await prisma.$transaction([
        prisma.paymentEvent.deleteMany({ where: { orderId: id as string } }),
        prisma.shipment.deleteMany({ where: { orderId: id as string } }),
        prisma.orderItem.deleteMany({ where: { orderId: id as string } }),
        prisma.address.deleteMany({
          where: {
            OR: [
              { shippingOrderId: id as string },
              { billingOrderId: id as string },
            ],
          },
        }),
        prisma.order.delete({ where: { id: id as string } }),
      ]);
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error('Error deleting order:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
