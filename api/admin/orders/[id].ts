import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../../_lib/prisma.js";
import { requireAdmin } from "../../_lib/auth.js";
import { setCors, handlePreflight } from "../../_lib/cors.js";
import { sendTrackingNotificationToCustomer } from "../../../src/services/email.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;
  if (!requireAdmin(req, res)) return;

  const id = req.query.id as string;

  // ── GET /api/admin/orders/:id ─────────────────────────────────────────────
  if (req.method === "GET") {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
        shippingAddress: true,
        billingAddress: true,
        paymentEvents: { orderBy: { createdAt: "desc" } },
        shipment: true,
      },
    });

    if (!order) return res.status(404).json({ error: "Pedido no encontrado" });
    return res.status(200).json(order);
  }

  // ── PATCH /api/admin/orders/:id ───────────────────────────────────────────
  if (req.method === "PATCH") {
    const body = req.body as {
      status?: string;
      internalNotes?: string;
      shipment?: {
        carrier?: string;
        trackingNumber?: string;
        status?: string;
        shippedAt?: string;
        estimatedAt?: string;
        notes?: string;
      };
    };

    const orderUpdate: Record<string, unknown> = {};
    if (body.status) orderUpdate.status = body.status;
    if (body.internalNotes !== undefined) orderUpdate.internalNotes = body.internalNotes;

    let updatedOrder = await prisma.order.update({
      where: { id },
      data: orderUpdate,
      include: { customer: true, shipment: true },
    });

    // Actualizar envío si se proporcionó
    if (body.shipment) {
      const prevShipment = updatedOrder.shipment;
      const shipData = {
        ...(body.shipment.carrier !== undefined && { carrier: body.shipment.carrier }),
        ...(body.shipment.trackingNumber !== undefined && { trackingNumber: body.shipment.trackingNumber }),
        ...(body.shipment.status !== undefined && { status: body.shipment.status as never }),
        ...(body.shipment.shippedAt && { shippedAt: new Date(body.shipment.shippedAt) }),
        ...(body.shipment.estimatedAt && { estimatedAt: new Date(body.shipment.estimatedAt) }),
        ...(body.shipment.notes !== undefined && { notes: body.shipment.notes }),
      };

      await prisma.shipment.upsert({
        where: { orderId: id },
        update: shipData,
        create: { orderId: id, ...shipData },
      });

      // Enviar email de tracking si se añade número por primera vez
      const trackingAdded =
        body.shipment.trackingNumber &&
        body.shipment.trackingNumber !== prevShipment?.trackingNumber;

      if (trackingAdded && updatedOrder.customer?.email) {
        void sendTrackingNotificationToCustomer({
          to: updatedOrder.customer.email,
          customerName: updatedOrder.customer.name ?? "Cliente",
          orderId: id,
          carrier: body.shipment.carrier ?? prevShipment?.carrier ?? "",
          trackingNumber: body.shipment.trackingNumber!,
        }).catch((e) => console.error("[email] Tracking notification failed:", e));
      }
    }

    // Refetch actualizado
    updatedOrder = await prisma.order.findUniqueOrThrow({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
        shippingAddress: true,
        billingAddress: true,
        paymentEvents: { orderBy: { createdAt: "desc" } },
        shipment: true,
      },
    });

    return res.status(200).json(updatedOrder);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
