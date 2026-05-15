import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "../_lib/prisma.js";
import { requireAdmin } from "../_lib/auth.js";
import { setCors, handlePreflight } from "../_lib/cors.js";

function escapeCsv(value: string | null | undefined): string {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;
  if (!requireAdmin(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      customer: true,
      items: { include: { product: true } },
      shippingAddress: true,
      shipment: true,
    },
  });

  const headers = [
    "ID",
    "Fecha",
    "Estado",
    "Email cliente",
    "Nombre cliente",
    "Productos",
    "Total (€)",
    "Dirección",
    "Ciudad",
    "Código postal",
    "País",
    "Transportista",
    "Tracking",
    "Estado envío",
    "Enviado el",
    "Notas internas",
  ];

  const rows = orders.map((o) => {
    const products = o.items
      .map((i) => `${i.product.name} x${i.quantity}`)
      .join(" | ");

    return [
      escapeCsv(o.id),
      escapeCsv(o.createdAt.toISOString()),
      escapeCsv(o.status),
      escapeCsv(o.customer?.email),
      escapeCsv(o.customer?.name),
      escapeCsv(products),
      escapeCsv((o.totalEurCents / 100).toFixed(2)),
      escapeCsv(o.shippingAddress?.line1),
      escapeCsv(o.shippingAddress?.city),
      escapeCsv(o.shippingAddress?.postalCode),
      escapeCsv(o.shippingAddress?.country),
      escapeCsv(o.shipment?.carrier),
      escapeCsv(o.shipment?.trackingNumber),
      escapeCsv(o.shipment?.status),
      escapeCsv(o.shipment?.shippedAt?.toISOString()),
      escapeCsv(o.internalNotes),
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const date = new Date().toISOString().slice(0, 10);

  res.setHeader("Content-Type", "text/csv; charset=utf-8");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="sumoreishi-pedidos-${date}.csv"`
  );
  res.setHeader("Cache-Control", "no-store");

  return res.status(200).send("﻿" + csv); // BOM para Excel
}
