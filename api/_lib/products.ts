// Catálogo canónico del backend — fuente de verdad para precios y validación.
// El frontend solo envía slugs; los precios nunca vienen del cliente.

export interface CatalogProduct {
  slug: string;
  name: string;
  format: string;
  priceEurCents: number;
}

export const CATALOG: Record<string, CatalogProduct> = {
  "1-unit": {
    slug: "1-unit",
    name: "Sumo Reishi Original",
    format: "1 ud · 60 cápsulas",
    priceEurCents: 3200,
  },
  "3-pack": {
    slug: "3-pack",
    name: "Sumo Reishi — Opción más elegida",
    format: "3 unidades · 180 cápsulas",
    priceEurCents: 8200,
  },
  "10-pack": {
    slug: "10-pack",
    name: "Sumo Reishi Combo Vita",
    format: "10 + 1 unidades",
    priceEurCents: 27200,
  },
};

export const FREE_SHIPPING_THRESHOLD_CENTS = 6500; // 65 €
