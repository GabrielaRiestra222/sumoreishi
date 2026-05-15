import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useRequireAdmin, useAdminFetch } from "./useAdminAuth";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

const STATUS_OPTIONS = ["PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];
const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente", PAID: "Pagado", PREPARING: "Preparando",
  SHIPPED: "Enviado", DELIVERED: "Entregado", CANCELLED: "Cancelado", REFUNDED: "Reembolsado",
};
const SHIPMENT_STATUS_OPTIONS = ["PENDING", "PROCESSING", "SHIPPED", "IN_TRANSIT", "DELIVERED", "FAILED", "RETURNED"];

interface Address { line1: string; line2?: string; city: string; state?: string; postalCode: string; country: string; }
interface Order {
  id: string; status: string; totalEurCents: number; currency: string;
  createdAt: string; updatedAt: string; internalNotes?: string;
  stripeSessionId?: string;
  customer?: { id: string; email: string; name?: string; phone?: string };
  items: Array<{ id: string; productName: string; productFormat: string; quantity: number; unitEurCents: number }>;
  shippingAddress?: Address; billingAddress?: Address;
  shipment?: {
    id: string; status: string; carrier?: string; trackingNumber?: string;
    shippedAt?: string; estimatedAt?: string; notes?: string;
  };
  paymentEvents: Array<{ id: string; type: string; createdAt: string }>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "1rem" }}>
      <p style={{ fontSize: "0.58rem", color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 0.3rem" }}>{label}</p>
      <div style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.85)" }}>{children}</div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ border: "1px solid rgba(255,255,255,0.07)", padding: "1.5rem", marginBottom: "1rem" }}>
      <h2 style={{ fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", color: GOLD, margin: "0 0 1.25rem", fontWeight: 400 }}>{title}</h2>
      {children}
    </div>
  );
}

export function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const ready = useRequireAdmin();
  const adminFetch = useAdminFetch();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Editable state
  const [status, setStatus] = useState("");
  const [internalNotes, setInternalNotes] = useState("");
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [shipmentStatus, setShipmentStatus] = useState("");
  const [shipmentNotes, setShipmentNotes] = useState("");

  useEffect(() => {
    if (!ready || !id) return;
    adminFetch(`/api/admin/orders/${id}`)
      .then((r) => r.json())
      .then((data: Order) => {
        setOrder(data);
        setStatus(data.status);
        setInternalNotes(data.internalNotes ?? "");
        setCarrier(data.shipment?.carrier ?? "");
        setTrackingNumber(data.shipment?.trackingNumber ?? "");
        setShipmentStatus(data.shipment?.status ?? "PENDING");
        setShipmentNotes(data.shipment?.notes ?? "");
      })
      .finally(() => setLoading(false));
  }, [ready, id, adminFetch]);

  const handleSave = async () => {
    if (!id) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await adminFetch(`/api/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({
          status,
          internalNotes,
          shipment: { carrier, trackingNumber, status: shipmentStatus, notes: shipmentNotes },
        }),
      });
      const updated = await res.json() as Order;
      setOrder(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  if (!ready || loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0c0c0c", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontFamily: FONT, fontSize: "0.75rem" }}>
        Cargando…
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ minHeight: "100vh", background: "#0c0c0c", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.2)", fontFamily: FONT, fontSize: "0.75rem" }}>
        Pedido no encontrado
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "0.6rem 0.75rem",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#fff", fontFamily: FONT, fontSize: "0.8rem",
    outline: "none", boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", fontFamily: FONT, color: "#fff" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "1.25rem 2rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <Link to="/admin/orders" style={{ color: "rgba(255,255,255,0.3)", textDecoration: "none", fontSize: "0.7rem" }}>← Pedidos</Link>
        <span style={{ color: "rgba(255,255,255,0.1)" }}>|</span>
        <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.35)", margin: 0, fontFamily: "monospace" }}>{order.id}</p>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>

          {/* Columna izquierda */}
          <div>
            <Section title="Pedido">
              <Field label="ID">{order.id}</Field>
              <Field label="Fecha">{new Date(order.createdAt).toLocaleString("es-ES")}</Field>
              <Field label="Total">{(order.totalEurCents / 100).toFixed(2)} €</Field>
              {order.stripeSessionId && (
                <Field label="Stripe Session">
                  <span style={{ fontFamily: "monospace", fontSize: "0.68rem", color: "rgba(255,255,255,0.4)" }}>
                    {order.stripeSessionId}
                  </span>
                </Field>
              )}
              <Field label="Estado del pedido">
                <select value={status} onChange={(e) => setStatus(e.target.value)} style={selectStyle}>
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                  ))}
                </select>
              </Field>
              <Field label="Notas internas">
                <textarea
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                  placeholder="Solo visible en el panel…"
                />
              </Field>
            </Section>

            <Section title="Productos">
              {order.items.map((item) => (
                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div>
                    <p style={{ margin: 0, fontSize: "0.8rem" }}>{item.productName}</p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>{item.productFormat}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ margin: 0, fontSize: "0.75rem" }}>×{item.quantity}</p>
                    <p style={{ margin: "0.2rem 0 0", fontSize: "0.75rem", color: GOLD }}>{((item.unitEurCents * item.quantity) / 100).toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </Section>

            <Section title="Historial de pagos">
              {order.paymentEvents.length === 0 ? (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>Sin eventos</p>
              ) : (
                order.paymentEvents.map((e) => (
                  <div key={e.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.68rem" }}>
                    <span style={{ fontFamily: "monospace", color: "rgba(255,255,255,0.5)" }}>{e.type}</span>
                    <span style={{ color: "rgba(255,255,255,0.25)" }}>{new Date(e.createdAt).toLocaleString("es-ES")}</span>
                  </div>
                ))
              )}
            </Section>
          </div>

          {/* Columna derecha */}
          <div>
            <Section title="Cliente">
              {order.customer ? (
                <>
                  <Field label="Email">{order.customer.email}</Field>
                  {order.customer.name && <Field label="Nombre">{order.customer.name}</Field>}
                  {order.customer.phone && <Field label="Teléfono">{order.customer.phone}</Field>}
                </>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>Sin datos de cliente</p>
              )}
            </Section>

            <Section title="Dirección de envío">
              {order.shippingAddress ? (
                <>
                  <Field label="Dirección">
                    {order.shippingAddress.line1}
                    {order.shippingAddress.line2 && <><br />{order.shippingAddress.line2}</>}
                  </Field>
                  <Field label="Ciudad / CP">
                    {order.shippingAddress.city}, {order.shippingAddress.postalCode}
                  </Field>
                  <Field label="País">{order.shippingAddress.country}</Field>
                </>
              ) : (
                <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.7rem" }}>Sin dirección</p>
              )}
            </Section>

            <Section title="Envío">
              <Field label="Estado del envío">
                <select value={shipmentStatus} onChange={(e) => setShipmentStatus(e.target.value)} style={selectStyle}>
                  {SHIPMENT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </Field>
              <Field label="Transportista">
                <input
                  type="text"
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  style={inputStyle}
                  placeholder="Correos, MRW, GLS…"
                />
              </Field>
              <Field label="Número de tracking">
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  style={inputStyle}
                  placeholder="ES123456789CN"
                />
              </Field>
              <Field label="Notas de envío">
                <textarea
                  value={shipmentNotes}
                  onChange={(e) => setShipmentNotes(e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </Field>
            </Section>
          </div>
        </div>

        {/* Guardar */}
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.5rem" }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "0.85rem 2.5rem",
              background: saving ? "rgba(255,255,255,0.3)" : "#fff",
              color: "#0e0e0e",
              border: "none",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Guardando…" : "Guardar cambios"}
          </button>
          {saved && (
            <span style={{ fontSize: "0.7rem", color: "#22c55e" }}>✓ Guardado</span>
          )}
        </div>
      </div>
    </div>
  );
}
