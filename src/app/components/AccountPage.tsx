import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const PROFILE_KEY = "sumoreishiCustomerProfile";
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente de pago",
  PAID: "Pedido confirmado",
  PREPARING: "En preparación",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_HELP: Record<string, string> = {
  PENDING: "Estamos esperando la confirmación del pago.",
  PAID: "Hemos recibido el pedido y pasará a preparación.",
  PREPARING: "Estamos preparando tu Sumo Reishi para enviarlo.",
  SHIPPED: "Tu pedido ya ha salido de almacén.",
  DELIVERED: "El pedido figura como entregado.",
  CANCELLED: "Este pedido se canceló.",
  REFUNDED: "El importe de este pedido fue reembolsado.",
};

interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
}

interface CustomerOrder {
  id: string;
  status: string;
  totalEurCents: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    productName: string;
    productFormat: string;
    quantity: number;
    unitEurCents: number;
  }>;
  shipment?: {
    status: string;
    carrier?: string | null;
    trackingNumber?: string | null;
    shippedAt?: string | null;
    estimatedAt?: string | null;
  } | null;
}

interface CustomerOrdersResponse {
  orders: CustomerOrder[];
  currentOrder: CustomerOrder | null;
}

function formatMoney(cents: number, currency = "eur") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function OrderSummary({ order, compact = false }: { order: CustomerOrder; compact?: boolean }) {
  const tracking = order.shipment?.trackingNumber;

  return (
    <article className="border border-black/10 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.22em] text-black/35">
            Pedido {order.id.slice(0, 8)}
          </p>
          <h3 className="mt-2 text-lg font-semibold text-[#111]">
            {STATUS_LABELS[order.status] ?? order.status}
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-black/55">
            {STATUS_HELP[order.status] ?? "Estado actualizado en tu cuenta."}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-sm font-semibold text-[#111]">{formatMoney(order.totalEurCents, order.currency)}</p>
          <p className="mt-1 text-xs text-black/45">{formatDate(order.createdAt)}</p>
        </div>
      </div>

      {!compact && (
        <div className="mt-5 border-t border-black/10 pt-4">
          <div className="grid gap-2">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 text-sm text-black/65">
                <span>
                  {item.productName} · {item.productFormat} ×{item.quantity}
                </span>
                <span className="shrink-0">{formatMoney(item.unitEurCents * item.quantity, order.currency)}</span>
              </div>
            ))}
          </div>

          {tracking && (
            <div className="mt-4 bg-[#F5F5F3] p-4 text-sm text-black/65">
              <p><span className="font-semibold text-[#111]">Seguimiento:</span> {tracking}</p>
              {order.shipment?.carrier && <p className="mt-1">Transportista: {order.shipment.carrier}</p>}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function AccountPage() {
  const [profile, setProfile] = useState<CustomerProfile>({ name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);
  const [ordersData, setOrdersData] = useState<CustomerOrdersResponse>({ orders: [], currentOrder: null });
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return;
    try {
      setProfile(JSON.parse(stored) as CustomerProfile);
    } catch {
      localStorage.removeItem(PROFILE_KEY);
    }
  }, []);

  useEffect(() => {
    const email = profile.email.trim();
    if (!email || !email.includes("@")) {
      setOrdersData({ orders: [], currentOrder: null });
      return;
    }

    const controller = new AbortController();
    setOrdersLoading(true);
    setOrdersError(null);

    fetch(`/api/customer-orders?email=${encodeURIComponent(email)}`, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json().catch(() => ({})) as { error?: string };
          throw new Error(data.error ?? "No se pudieron cargar tus pedidos");
        }
        return response.json() as Promise<CustomerOrdersResponse>;
      })
      .then((data) => setOrdersData({
        orders: data.orders ?? [],
        currentOrder: data.currentOrder ?? null,
      }))
      .catch((error) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setOrdersError(error instanceof Error ? error.message : "No se pudieron cargar tus pedidos");
      })
      .finally(() => setOrdersLoading(false));

    return () => controller.abort();
  }, [profile.email]);

  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    const normalizedProfile = { ...profile, email: profile.email.trim().toLowerCase() };
    localStorage.setItem(PROFILE_KEY, JSON.stringify(normalizedProfile));
    setProfile(normalizedProfile);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  const previousOrders = ordersData.currentOrder
    ? ordersData.orders.filter((order) => order.id !== ordersData.currentOrder?.id)
    : ordersData.orders;

  return (
    <main className="min-h-screen bg-[#F5F5F3] px-6 py-32">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <section>
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-black/40">Mi cuenta</p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-[#111] md:text-5xl">
          Tus datos y pedidos
        </h1>
        <p className="mb-10 max-w-xl text-sm leading-relaxed text-black/55">
          Guarda tu email para pre-rellenar el checkout y consultar los pedidos asociados a tu cuenta.
          El estado se actualiza cuando confirmamos el pago, preparamos el envío o añadimos seguimiento.
        </p>

        <form onSubmit={saveProfile} className="bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm text-black/70">
              Nombre
              <input
                value={profile.name}
                onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                className="border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/40"
                placeholder="Tu nombre"
              />
            </label>

            <label className="grid gap-2 text-sm text-black/70">
              Email
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                className="border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/40"
                placeholder="tu@email.com"
                required
              />
            </label>

            <label className="grid gap-2 text-sm text-black/70">
              Teléfono
              <input
                value={profile.phone}
                onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                className="border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/40"
                placeholder="+34 600 000 000"
              />
            </label>
          </div>

          <button className="mt-8 w-full bg-[#111] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black">
            Guardar datos
          </button>

          {saved && <p className="mt-4 text-sm text-green-700">Datos guardados correctamente.</p>}
        </form>
        </section>

        <section className="grid content-start gap-6">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-black/40">Pedido actual</p>
            {ordersLoading && <div className="bg-white p-6 text-sm text-black/50 shadow-sm">Cargando pedidos...</div>}
            {!ordersLoading && ordersError && (
              <div className="bg-white p-6 text-sm text-red-700 shadow-sm">{ordersError}</div>
            )}
            {!ordersLoading && !ordersError && !profile.email && (
              <div className="bg-white p-6 text-sm text-black/50 shadow-sm">
                Añade tu email para ver aquí tu pedido actual y el historial.
              </div>
            )}
            {!ordersLoading && !ordersError && profile.email && !ordersData.currentOrder && (
              <div className="bg-white p-6 text-sm text-black/50 shadow-sm">
                Todavía no hay pedidos asociados a este email.
              </div>
            )}
            {!ordersLoading && !ordersError && ordersData.currentOrder && (
              <OrderSummary order={ordersData.currentOrder} />
            )}
          </div>

          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.24em] text-black/40">Pedidos anteriores</p>
            {previousOrders.length === 0 ? (
              <div className="bg-white p-6 text-sm text-black/45 shadow-sm">Sin pedidos anteriores.</div>
            ) : (
              <div className="grid gap-3">
                {previousOrders.map((order) => <OrderSummary key={order.id} order={order} compact />)}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export function readStoredCustomerProfile(): Partial<CustomerProfile> | null {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as CustomerProfile;
  } catch {
    return null;
  }
}
