// ─── STORE API DE WOOCOMMERCE ────────────────────────────────────────────────
//
// Usamos la Store API pública (/wp-json/wc/store/v1) en lugar de la REST API v3.
// Motivos:
//   - La REST API v3 requiere Consumer Key + Secret. Exponerlos en el bundle de
//     React es un riesgo de seguridad grave (cualquiera puede hacer pedidos,
//     modificar productos, ver órdenes). NUNCA uses las keys en el frontend.
//   - La Store API es pública y está diseñada exactamente para este flujo:
//     frontend selecciona productos → añade al carrito → redirige a /checkout.
//
// Por qué daba 401 antes:
//   Las mutaciones del carrito (POST add-item, etc.) requieren un header "Nonce"
//   que WordPress genera por sesión. Sin él → 401. La solución es hacer primero
//   un GET al carrito para obtener ese nonce, y luego usarlo en los POSTs.
//
// ─────────────────────────────────────────────────────────────────────────────

const WC_BASE = (import.meta.env.VITE_WC_URL as string | undefined) ?? "";

function apiUrl(path: string): string {
  return `${WC_BASE}/wp-json/wc/store/v1/${path}`;
}


// Mapeo de IDs locales del contexto React → IDs reales en WooCommerce
const WC_PRODUCT_IDS: Record<string, number> = {
  "1-unit":  353, // Sumo Reishi Original — 32€
  "3-pack":  655, // Nuestra opción más elegida — 82€
  "10-pack": 354, // Combo Vita — 272€
};

export interface CartItem {
  id: string;
  quantity: number;
}

interface CartSession {
  nonce: string;
  cartToken: string;
}

// Paso 1: obtener la sesión del carrito.
// WooCommerce devuelve los headers "Nonce" y "Cart-Token" en la primera
// respuesta. El nonce es obligatorio para cualquier mutación posterior.
async function fetchCartSession(): Promise<CartSession> {
  const response = await fetch(apiUrl("cart"), {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      `No se pudo conectar con la tienda (${response.status}). ` +
      `Comprueba que VITE_WC_URL es correcto y que WooCommerce está activo.`
    );
  }

  const nonce     = response.headers.get("Nonce")      ?? "";
  const cartToken = response.headers.get("Cart-Token") ?? "";

  if (!nonce) {
    // WooCommerce < 6.9 usa el header en minúsculas
    const nonceFallback = response.headers.get("nonce") ?? "";
    return { nonce: nonceFallback, cartToken };
  }

  return { nonce, cartToken };
}

// Paso 2: añadir un producto al carrito usando la sesión obtenida.
async function addSingleItem(
  wcProductId: number,
  quantity: number,
  session: CartSession
): Promise<void> {
  const response = await fetch(apiUrl("cart/add-item"), {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Nonce":      session.nonce,
      "Cart-Token": session.cartToken,
    },
    body: JSON.stringify({ id: wcProductId, quantity }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({})) as { message?: string };
    throw new Error(
      body.message ??
      `Error ${response.status} al añadir el producto ${wcProductId}.`
    );
  }
}

// Función principal: obtiene sesión y añade todos los items seleccionados.
export async function addItemsToWooCart(items: CartItem[]): Promise<void> {
  const itemsToAdd = items.filter(({ id, quantity }) => {
    return WC_PRODUCT_IDS[id] !== undefined && quantity > 0;
  });

  if (itemsToAdd.length === 0) {
    throw new Error("Selecciona al menos un producto antes de continuar.");
  }

  const session = await fetchCartSession();

  for (const { id, quantity } of itemsToAdd) {
    await addSingleItem(WC_PRODUCT_IDS[id], quantity, session);
  }
}
