import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { prisma } from "./_lib/prisma.js";
import { CATALOG, FREE_SHIPPING_THRESHOLD_CENTS } from "./_lib/products.js";
import { setCors, handlePreflight } from "./_lib/cors.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-04-30.basil",
});

interface CartItem {
  id: string;
  quantity: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  setCors(res);
  if (handlePreflight(req, res)) return;

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { items, shippingRateId } = req.body as { items: CartItem[]; shippingRateId?: string };

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items provided" });
  }

  // Validar y calcular precios desde el catálogo del backend (nunca del cliente)
  const validItems = items
    .map((item) => ({ product: CATALOG[item.id], quantity: item.quantity }))
    .filter(
      ({ product, quantity }) =>
        product && Number.isInteger(quantity) && quantity > 0
    );

  if (validItems.length === 0) {
    return res.status(400).json({ error: "No valid items" });
  }

  const subtotalCents = validItems.reduce(
    (acc, { product, quantity }) => acc + product.priceEurCents * quantity,
    0
  );

  const origin =
    (req.headers.origin as string) || `https://${req.headers.host}`;

  try {
    // Resolver tarifa de envío desde la base de datos o usar fallback
    let shippingName = "Envío estándar";
    let shippingCents = 0;

    if (shippingRateId) {
      const rate = await prisma.shippingRate.findFirst({
        where: { id: shippingRateId, active: true },
      });
      if (rate) {
        shippingName = rate.name;
        shippingCents = rate.priceEurCents;
      } else {
        shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : 495;
        shippingName =
          shippingCents === 0 ? "Envío gratuito" : "Envío estándar (2–3 días hábiles)";
      }
    } else {
      shippingCents = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : 495;
      shippingName =
        shippingCents === 0 ? "Envío gratuito" : "Envío estándar (2–3 días hábiles)";
    }

    const totalCents = subtotalCents + shippingCents;

    // 1. Crear pedido en la base de datos en estado PENDING
    const order = await prisma.order.create({
      data: {
        totalEurCents: totalCents,
        items: {
          create: await Promise.all(
            validItems.map(async ({ product, quantity }) => {
              const dbProduct = await prisma.product.upsert({
                where: { slug: product.slug },
                update: { priceEurCents: product.priceEurCents, active: true },
                create: {
                  slug: product.slug,
                  name: product.name,
                  format: product.format,
                  priceEurCents: product.priceEurCents,
                },
              });
              return {
                productId: dbProduct.id,
                quantity,
                unitEurCents: product.priceEurCents,
                productName: product.name,
                productFormat: product.format,
              };
            })
          ),
        },
      },
    });

    // 2. Crear sesión de Stripe Checkout
    const productLines = validItems.map(({ product, quantity }) => ({
      price_data: {
        currency: "eur",
        product_data: { name: `${product.name} — ${product.format}` },
        unit_amount: product.priceEurCents,
      },
      quantity,
    }));

    const shippingLine =
      shippingCents > 0
        ? [
            {
              price_data: {
                currency: "eur",
                product_data: { name: shippingName },
                unit_amount: shippingCents,
              },
              quantity: 1,
            },
          ]
        : [];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [...productLines, ...shippingLine],
      mode: "payment",
      shipping_address_collection: {
        allowed_countries: ["ES", "PT", "FR", "DE", "IT", "GB", "BE", "NL"],
      },
      locale: "es",
      success_url: `${origin}/confirmacion?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#purchase`,
      metadata: {
        orderId: order.id,
        source: "sumoreishi-web",
      },
    });

    // 3. Guardar stripeSessionId en el pedido
    await prisma.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Error interno";
    console.error("[checkout]", message);
    return res.status(500).json({ error: message });
  }
}
