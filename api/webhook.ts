import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { prisma } from "./_lib/prisma.js";
import { sendOrderConfirmationToCustomer, sendNewOrderNotificationToAdmin } from "../src/services/email.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

// Vercel no hace bodyParser para esta ruta — necesitamos el raw body
export const config = { api: { bodyParser: false } };

async function getRawBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const rawBody = await getRawBody(req);
  const signature = req.headers["stripe-signature"] as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Invalid signature";
    console.error("[webhook] Signature verification failed:", msg);
    return res.status(400).json({ error: `Webhook Error: ${msg}` });
  }

  // Evitar procesar el mismo evento dos veces
  const existing = await prisma.paymentEvent.findUnique({
    where: { stripeEventId: event.id },
  });
  if (existing) {
    return res.status(200).json({ received: true, duplicate: true });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event);
        break;
      case "payment_intent.payment_failed":
        await handlePaymentFailed(event);
        break;
      case "charge.refunded":
        await handleRefund(event);
        break;
      default:
        console.log(`[webhook] Unhandled event type: ${event.type}`);
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Internal error";
    console.error(`[webhook] Error processing ${event.type}:`, msg);
    return res.status(500).json({ error: msg });
  }
}

// ─── Handlers ────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(event: Stripe.Event) {
  const session = event.data.object as Stripe.Checkout.Session;
  const orderId = session.metadata?.orderId;

  if (!orderId) {
    console.error("[webhook] checkout.session.completed sin orderId en metadata");
    return;
  }

  // Obtener detalles extendidos (dirección de envío, cliente)
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items", "customer_details", "shipping_cost"],
  });

  const customerDetails = fullSession.customer_details;
  const shippingDetails = fullSession.shipping_details;

  // Actualizar pedido en transacción
  const order = await prisma.$transaction(async (tx) => {
    // Upsert cliente
    let customerId: string | undefined;
    if (customerDetails?.email) {
      const customer = await tx.customer.upsert({
        where: { id: `email:${customerDetails.email}` },
        update: { name: customerDetails.name ?? undefined },
        create: {
          id: `email:${customerDetails.email}`,
          email: customerDetails.email,
          name: customerDetails.name ?? undefined,
          phone: customerDetails.phone ?? undefined,
        },
      });
      customerId = customer.id;
    }

    // Guardar dirección de envío
    const shipping = shippingDetails?.address;
    const shippingAddressData = shipping
      ? {
          shippingAddress: {
            create: {
              line1: shipping.line1 ?? "",
              line2: shipping.line2 ?? undefined,
              city: shipping.city ?? "",
              state: shipping.state ?? undefined,
              postalCode: shipping.postal_code ?? "",
              country: shipping.country ?? "",
            },
          },
        }
      : {};

    // Actualizar pedido a PAID
    const paidOrder = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        customerId,
        ...shippingAddressData,
      },
      include: { items: { include: { product: true } }, customer: true, shippingAddress: true },
    });

    // Crear Shipment vacío (listo para gestión manual)
    await tx.shipment.upsert({
      where: { orderId: paidOrder.id },
      update: {},
      create: { orderId: paidOrder.id, status: "PENDING" },
    });

    // Registrar evento de pago
    await tx.paymentEvent.create({
      data: {
        orderId: paidOrder.id,
        stripeEventId: event.id,
        type: event.type,
        data: event.data.object as object,
      },
    });

    return paidOrder;
  });

  // En serverless conviene esperar a Resend antes de responder al webhook.
  const emailJobs: Promise<void>[] = [];
  if (customerDetails?.email) {
    emailJobs.push(sendOrderConfirmationToCustomer({
      to: customerDetails.email,
      customerName: customerDetails.name ?? "Cliente",
      orderId: order.id,
      items: order.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        unitEurCents: i.unitEurCents,
      })),
      totalEurCents: order.totalEurCents,
    }));
  }

  emailJobs.push(sendNewOrderNotificationToAdmin({
    orderId: order.id,
    customerEmail: customerDetails?.email ?? "desconocido",
    totalEurCents: order.totalEurCents,
  }));

  const emailResults = await Promise.allSettled(emailJobs);
  emailResults.forEach((result) => {
    if (result.status === "rejected") {
      console.error("[email] Order email failed:", result.reason);
    }
  });
}

async function handlePaymentFailed(event: Stripe.Event) {
  const paymentIntent = event.data.object as Stripe.PaymentIntent;

  // Buscar pedido asociado por session (vía metadata en el PaymentIntent)
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: paymentIntent.id,
    limit: 1,
  });
  const session = sessions.data[0];
  if (!session?.metadata?.orderId) return;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: session.metadata.orderId },
      data: { status: "CANCELLED" },
    }),
    prisma.paymentEvent.create({
      data: {
        orderId: session.metadata.orderId,
        stripeEventId: event.id,
        type: event.type,
        data: event.data.object as object,
      },
    }),
  ]);
}

async function handleRefund(event: Stripe.Event) {
  const charge = event.data.object as Stripe.Charge;
  if (!charge.payment_intent) return;

  const sessions = await stripe.checkout.sessions.list({
    payment_intent: charge.payment_intent as string,
    limit: 1,
  });
  const session = sessions.data[0];
  if (!session?.metadata?.orderId) return;

  await prisma.$transaction([
    prisma.order.update({
      where: { id: session.metadata.orderId },
      data: { status: "REFUNDED" },
    }),
    prisma.paymentEvent.create({
      data: {
        orderId: session.metadata.orderId,
        stripeEventId: event.id,
        type: event.type,
        data: event.data.object as object,
      },
    }),
  ]);
}
