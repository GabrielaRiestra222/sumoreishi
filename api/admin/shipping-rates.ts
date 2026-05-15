import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../_lib/prisma.js";
import { setCors, handlePreflight } from "../_lib/cors.js";
import { verifyAdminToken } from "../_lib/auth.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  const token = (req.headers.authorization ?? "").replace("Bearer ", "");
  if (!verifyAdminToken(token)) return res.status(401).json({ error: "Unauthorized" });

  if (req.method === "GET") {
    const rates = await prisma.shippingRate.findMany({
      orderBy: [{ priority: "asc" }, { priceEurCents: "asc" }],
    });
    return res.json(rates);
  }

  if (req.method === "POST") {
    const { name, description, country, region, priceEurCents, minOrderEurCents, estimatedDays, active, priority, isPickup } = req.body as Record<string, unknown>;
    if (!name || priceEurCents === undefined) {
      return res.status(400).json({ error: "name y priceEurCents son obligatorios" });
    }
    const rate = await prisma.shippingRate.create({
      data: {
        name: String(name),
        description: description ? String(description) : undefined,
        country: country ? String(country) : "*",
        region: region ? String(region) : undefined,
        priceEurCents: Number(priceEurCents),
        minOrderEurCents: Number(minOrderEurCents ?? 0),
        estimatedDays: estimatedDays ? String(estimatedDays) : undefined,
        active: active !== undefined ? Boolean(active) : true,
        priority: Number(priority ?? 0),
        isPickup: Boolean(isPickup ?? false),
      },
    });
    return res.status(201).json(rate);
  }

  if (req.method === "PATCH") {
    const { id, ...rest } = req.body as Record<string, unknown>;
    if (!id) return res.status(400).json({ error: "id requerido" });
    const data: Record<string, unknown> = { ...rest };
    if (rest.priceEurCents !== undefined) data.priceEurCents = Number(rest.priceEurCents);
    if (rest.minOrderEurCents !== undefined) data.minOrderEurCents = Number(rest.minOrderEurCents);
    if (rest.priority !== undefined) data.priority = Number(rest.priority);
    const rate = await prisma.shippingRate.update({ where: { id: String(id) }, data });
    return res.json(rate);
  }

  if (req.method === "DELETE") {
    const id = req.query.id as string;
    if (!id) return res.status(400).json({ error: "id requerido" });
    await prisma.shippingRate.delete({ where: { id } });
    return res.status(204).end();
  }

  return res.status(405).end();
}
