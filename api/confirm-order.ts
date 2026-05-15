import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { prisma } from "./_lib/prisma.js";
import { setCors, handlePreflight } from "./_lib/cors.js";
import { sendNewOrderNotificationToAdmin } from "../src/services/email.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-04-22.dahlia",
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST" && req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body as { sessionId?: string } | undefined;
  const sessionId =
    req.method === "POST"
      ? body?.sessionId
      : typeof req.query.session_id === "string"
        ? req.query.session_id
        : undefined;

  if (!sessionId) {
    return res.status(400).json({ error: "sessionId requerido" });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "customer_details", "shipping_cost"],
    });

    if (session.payment_status !== "paid") {
      return res.status(202).json({ synced: false, reason: "payment_not_paid" });
    }

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return res.status(400).json({ error: "Session sin orderId" });
    }

    const customerDetails = session.customer_details;
    const shippingDetails = session.collected_information?.shipping_details;
    const customerName = customerDetails?.name ?? shippingDetails?.name ?? undefined;

    const order = await prisma.$transaction(async (tx) => {
      const existingOrder = await tx.order.findUnique({
        where: { id: orderId },
        include: { shippingAddress: true },
      });
      if (!existingOrder) throw new Error("Order not found");

      let customerId: string | undefined;
      if (customerDetails?.email) {
        const customer = await tx.customer.upsert({
          where: { id: `email:${customerDetails.email}` },
          update: {
            name: customerName,
            phone: customerDetails.phone ?? undefined,
          },
          create: {
            id: `email:${customerDetails.email}`,
            email: customerDetails.email,
            name: customerName,
            phone: customerDetails.phone ?? undefined,
          },
        });
        customerId = customer.id;
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          customerId,
        },
      });

      const shipping = shippingDetails?.address;
      if (shipping && !existingOrder.shippingAddress) {
        await tx.address.create({
          data: {
            shippingOrderId: orderId,
            line1: shipping.line1 ?? "",
            line2: shipping.line2 ?? undefined,
            city: shipping.city ?? "",
            state: shipping.state ?? undefined,
            postalCode: shipping.postal_code ?? "",
            country: shipping.country ?? "",
          },
        });
      }

      await tx.shipment.upsert({
        where: { orderId },
        update: {},
        create: { orderId, status: "PENDING" },
      });

      return tx.order.findUniqueOrThrow({
        where: { id: orderId },
        include: {
          items: { include: { product: true } },
          customer: true,
          shippingAddress: true,
        },
      });
    });

    const markerId = `admin-notification:${session.id}`;
    try {
      await prisma.paymentEvent.create({
        data: {
          orderId: order.id,
          stripeEventId: markerId,
          type: "admin_notification_sent",
          data: { source: "confirm-order", sessionId: session.id },
        },
      });
    } catch {
      return res.status(200).json({ synced: true, emailSent: false, duplicate: true });
    }

    await sendNewOrderNotificationToAdmin({
      orderId: order.id,
      customerName,
      customerEmail: customerDetails?.email ?? "desconocido",
      customerPhone: customerDetails?.phone ?? undefined,
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        unitEurCents: item.unitEurCents,
      })),
      totalEurCents: order.totalEurCents,
    });

    return res.status(200).json({ synced: true, emailSent: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    console.error("[confirm-order]", message);
    return res.status(500).json({ error: message });
  }
}
