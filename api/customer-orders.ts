import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "./_lib/prisma.js";
import { setCors, handlePreflight } from "./_lib/cors.js";

const ACTIVE_STATUSES = ["PENDING", "PAID", "PREPARING", "SHIPPED"] as const;

function normalizeEmail(value: unknown): string {
  const email = Array.isArray(value) ? value[0] : value;
  return typeof email === "string" ? email.trim().toLowerCase() : "";
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const email = normalizeEmail(req.query.email);
  if (!email || !email.includes("@")) {
    return res.status(400).json({ error: "Email requerido" });
  }

  const orders = await prisma.order.findMany({
    where: {
      customer: {
        email: { equals: email, mode: "insensitive" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
    select: {
      id: true,
      status: true,
      totalEurCents: true,
      currency: true,
      createdAt: true,
      updatedAt: true,
      items: {
        select: {
          id: true,
          productName: true,
          productFormat: true,
          quantity: true,
          unitEurCents: true,
        },
      },
      shipment: {
        select: {
          status: true,
          carrier: true,
          trackingNumber: true,
          shippedAt: true,
          estimatedAt: true,
        },
      },
    },
  });

  const currentOrder = orders.find((order) =>
    ACTIVE_STATUSES.includes(order.status as (typeof ACTIVE_STATUSES)[number])
  ) ?? orders[0] ?? null;

  return res.status(200).json({ orders, currentOrder });
}
