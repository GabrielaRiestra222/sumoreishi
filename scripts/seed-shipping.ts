import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const rates = [
  {
    name: "Envío gratuito Península",
    description: "Gratis a partir de 50 €",
    country: "ES",
    region: "Peninsula",
    priceEurCents: 0,
    minOrderEurCents: 5000,
    estimatedDays: "2-3",
    active: true,
    priority: 0,
    isPickup: false,
  },
  {
    name: "Envío estándar Península",
    description: "Entrega en 2-3 días hábiles",
    country: "ES",
    region: "Peninsula",
    priceEurCents: 495,
    minOrderEurCents: 0,
    estimatedDays: "2-3",
    active: true,
    priority: 1,
    isPickup: false,
  },
  {
    name: "Envío Baleares",
    description: "Islas Baleares",
    country: "ES",
    region: "Baleares",
    priceEurCents: 695,
    minOrderEurCents: 0,
    estimatedDays: "3-5",
    active: true,
    priority: 2,
    isPickup: false,
  },
  {
    name: "Envío Canarias",
    description: "Islas Canarias",
    country: "ES",
    region: "Canarias",
    priceEurCents: 995,
    minOrderEurCents: 0,
    estimatedDays: "4-6",
    active: true,
    priority: 3,
    isPickup: false,
  },
  {
    name: "Envío Portugal",
    country: "PT",
    priceEurCents: 795,
    minOrderEurCents: 0,
    estimatedDays: "3-5",
    active: true,
    priority: 4,
    isPickup: false,
  },
  {
    name: "Envío Europa",
    description: "FR, DE, IT, GB, BE, NL",
    country: "*",
    priceEurCents: 1495,
    minOrderEurCents: 0,
    estimatedDays: "5-8",
    active: true,
    priority: 5,
    isPickup: false,
  },
  {
    name: "Recogida en tienda",
    description: "Recoge tu pedido en nuestro punto de recogida",
    country: "ES",
    priceEurCents: 0,
    minOrderEurCents: 0,
    estimatedDays: "0",
    active: true,
    priority: 10,
    isPickup: true,
  },
];

async function main() {
  console.log("Seeding shipping rates…");

  for (const rate of rates) {
    const existing = await prisma.shippingRate.findFirst({
      where: { name: rate.name, country: rate.country },
    });
    if (existing) {
      await prisma.shippingRate.update({ where: { id: existing.id }, data: rate });
      console.log(`  updated: ${rate.name}`);
    } else {
      await prisma.shippingRate.create({ data: rate });
      console.log(`  created: ${rate.name}`);
    }
  }

  const count = await prisma.shippingRate.count();
  console.log(`Done. ${count} shipping rate(s) in database.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
