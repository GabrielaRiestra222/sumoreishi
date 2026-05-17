import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../_lib/prisma.js";
import { requireAdmin } from "../_lib/auth.js";
import { setCors, handlePreflight } from "../_lib/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;
  if (!requireAdmin(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { status, page = "1", limit = "50" } = req.query as Record<string, string>;

  const where = status ? { status: status as never } : {};
  const take = Math.min(Number(limit), 100);
  const skip = (Number(page) - 1) * take;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        customer: true,
        items: { include: { product: true } },
        shipment: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  const customerIds = orders
    .map((order) => order.customerId)
    .filter((id): id is string => Boolean(id));

  const counts = customerIds.length
    ? await prisma.order.groupBy({
        by: ["customerId"],
        where: { customerId: { in: customerIds } },
        _count: { _all: true },
      })
    : [];

  const countByCustomerId = new Map(
    counts.map((count) => [count.customerId, count._count._all])
  );

  const ordersWithCustomerCounts = orders.map((order) => ({
    ...order,
    customer: order.customer
      ? {
          ...order.customer,
          orderCount: countByCustomerId.get(order.customerId ?? "") ?? 1,
        }
      : null,
  }));

  return res.status(200).json({ orders: ordersWithCustomerCounts, total, page: Number(page), limit: take });
}
