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
        customer: { include: { _count: { select: { orders: true } } } },
        items: { include: { product: true } },
        shipment: true,
      },
    }),
    prisma.order.count({ where }),
  ]);

  return res.status(200).json({ orders, total, page: Number(page), limit: take });
}
