import type Stripe from "stripe";
import type { Prisma } from "@prisma/client";
import { prisma } from "./prisma.js";
import {
  sendNewOrderNotificationToAdmin,
  sendOrderConfirmationToCustomer,
} from "../../src/services/email.js";

type ExpandedCheckoutSession = Stripe.Checkout.Session & {
  shipping_details?: {
    name?: string | null;
    address?: Stripe.Address | null;
  } | null;
};

function readCheckoutCustomer(session: Stripe.Checkout.Session) {
  const expandedSession = session as ExpandedCheckoutSession;
  const customerDetails = session.customer_details;
  const shippingDetails =
    expandedSession.shipping_details ??
    session.collected_information?.shipping_details ??
    null;
  const address = shippingDetails?.address ?? customerDetails?.address ?? null;

  return {
    email: customerDetails?.email ?? undefined,
    name: customerDetails?.name ?? shippingDetails?.name ?? undefined,
    phone: customerDetails?.phone ?? undefined,
    address,
  };
}

function emailCustomerId(email: string) {
  return `email:${email.trim().toLowerCase()}`;
}

export async function syncPaidCheckoutSession(params: {
  session: Stripe.Checkout.Session;
  paymentEvent?: {
    stripeEventId: string;
    type: string;
    data: Prisma.InputJsonValue;
  };
}) {
  if (params.session.payment_status !== "paid") {
    return { synced: false as const, reason: "payment_not_paid" as const };
  }

  const orderId = params.session.metadata?.orderId;
  if (!orderId) {
    throw new Error("Session sin orderId");
  }

  const checkoutCustomer = readCheckoutCustomer(params.session);

  const order = await prisma.$transaction(async (tx) => {
    const existingOrder = await tx.order.findUnique({
      where: { id: orderId },
      include: { shippingAddress: true },
    });
    if (!existingOrder) throw new Error("Order not found");

    let customerId: string | undefined;
    if (checkoutCustomer.email) {
      const customer = await tx.customer.upsert({
        where: { id: emailCustomerId(checkoutCustomer.email) },
        update: {
          email: checkoutCustomer.email,
          name: checkoutCustomer.name,
          phone: checkoutCustomer.phone,
        },
        create: {
          id: emailCustomerId(checkoutCustomer.email),
          email: checkoutCustomer.email,
          name: checkoutCustomer.name,
          phone: checkoutCustomer.phone,
        },
      });
      customerId = customer.id;
    }

    await tx.order.update({
      where: { id: orderId },
      data: {
        status: "PAID",
        stripeSessionId: params.session.id,
        customerId,
      },
    });

    const shipping = checkoutCustomer.address;
    if (shipping) {
      await tx.address.upsert({
        where: { shippingOrderId: orderId },
        update: {
          line1: shipping.line1 ?? "",
          line2: shipping.line2 ?? undefined,
          city: shipping.city ?? "",
          state: shipping.state ?? undefined,
          postalCode: shipping.postal_code ?? "",
          country: shipping.country ?? "",
        },
        create: {
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

    if (params.paymentEvent) {
      await tx.paymentEvent.upsert({
        where: { stripeEventId: params.paymentEvent.stripeEventId },
        update: {},
        create: {
          orderId,
          stripeEventId: params.paymentEvent.stripeEventId,
          type: params.paymentEvent.type,
          data: params.paymentEvent.data,
        },
      });
    }

    return tx.order.findUniqueOrThrow({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        customer: true,
        shippingAddress: true,
      },
    });
  });

  return {
    synced: true as const,
    order,
    customer: checkoutCustomer,
  };
}

async function hasEvent(stripeEventId: string) {
  const existing = await prisma.paymentEvent.findUnique({ where: { stripeEventId } });
  return Boolean(existing);
}

async function markEvent(params: {
  orderId: string;
  stripeEventId: string;
  type: string;
  data: Prisma.InputJsonValue;
}) {
  await prisma.paymentEvent.upsert({
    where: { stripeEventId: params.stripeEventId },
    update: {},
    create: params,
  });
}

export async function sendOrderEmailsOnce(params: {
  order: Awaited<ReturnType<typeof syncPaidCheckoutSession>> extends { order: infer T } ? T : never;
  customer: ReturnType<typeof readCheckoutCustomer>;
  source: string;
}) {
  const items = params.order.items.map((item) => ({
    name: item.product.name,
    quantity: item.quantity,
    unitEurCents: item.unitEurCents,
  }));

  const jobs: Promise<void>[] = [];

  if (params.customer.email) {
    const customerMarker = `customer-confirmation:${params.order.id}`;
    jobs.push(
      (async () => {
        if (await hasEvent(customerMarker)) return;
        await sendOrderConfirmationToCustomer({
          to: params.customer.email!,
          customerName: params.customer.name ?? "Cliente",
          orderId: params.order.id,
          items,
          totalEurCents: params.order.totalEurCents,
        });
        await markEvent({
          orderId: params.order.id,
          stripeEventId: customerMarker,
          type: "customer_confirmation_sent",
          data: { source: params.source },
        });
      })()
    );
  }

  const adminMarker = `admin-notification:${params.order.id}`;
  jobs.push(
    (async () => {
      if (await hasEvent(adminMarker)) return;
      await sendNewOrderNotificationToAdmin({
        orderId: params.order.id,
        customerName: params.customer.name,
        customerEmail: params.customer.email ?? "desconocido",
        customerPhone: params.customer.phone,
        items,
        totalEurCents: params.order.totalEurCents,
      });
      await markEvent({
        orderId: params.order.id,
        stripeEventId: adminMarker,
        type: "admin_notification_sent",
        data: { source: params.source },
      });
    })()
  );

  return Promise.allSettled(jobs);
}
