import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "./_lib/prisma.js";
import { setCors, handlePreflight } from "./_lib/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "GET") return res.status(405).end();

  const { country } = req.query;

  const rates = await prisma.shippingRate.findMany({
    where: {
      active: true,
      ...(country
        ? { OR: [{ country: country as string }, { country: "*" }] }
        : {}),
    },
    orderBy: [{ priority: "asc" }, { priceEurCents: "asc" }],
  });

  return res.json(rates);
}
