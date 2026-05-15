import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRequireAdmin, useAdminFetch, clearAdminToken } from "./useAdminAuth";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendiente",
  PAID: "Pagado",
  PREPARING: "Preparando",
  SHIPPED: "Enviado",
  DELIVERED: "Entregado",
  CANCELLED: "Cancelado",
  REFUNDED: "Reembolsado",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#666",
  PAID: "#22c55e",
  PREPARING: "#f59e0b",
  SHIPPED: "#3b82f6",
  DELIVERED: "#10b981",
  CANCELLED: "#ef4444",
  REFUNDED: "#8b5cf6",
};

interface Order {
  id: string;
  status: string;
  totalEurCents: number;
  createdAt: string;
  customer?: { email: string; name?: string };
  items: Array<{ product: { name: string }; quantity: number; productName: string }>;
  shipment?: { trackingNumber?: string; carrier?: string; status: string };
}

const ALL_STATUSES = ["", "PENDING", "PAID", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

export function AdminOrdersPage() {
  const ready = useRequireAdmin();
  const adminFetch = useAdminFetch();
  const navigate = useNavigate();

  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const LIMIT = 50;

  useEffect(() => {
    if (!ready) return;

    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (statusFilter) params.set("status", statusFilter);

    setLoading(true);
    adminFetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((data: { orders: Order[]; total: number }) => {
        setOrders(data.orders);
        setTotal(data.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [ready, adminFetch, statusFilter, page]);

  const handleExport = async () => {
    const token = sessionStorage.getItem("sr_admin_token") ?? "";
    const res = await fetch("/api/admin/export", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sumoreishi-pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  if (!ready) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#0c0c0c", fontFamily: FONT, color: "#fff" }}>
      {/* Header */}
      <div style={{
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        padding: "1.25rem 2rem",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div>
          <p style={{ color: GOLD, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", margin: 0 }}>Sumo Reishi</p>
          <h1 style={{ fontSize: "1rem", fontWeight: 700, margin: "0.25rem 0 0", letterSpacing: "-0.02em" }}>Pedidos</h1>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", alignItems: "center" }}>
          <button
            onClick={handleExport}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.6)",
              fontFamily: FONT,
              fontSize: "0.65rem",
              letterSpacing: "0.08em",
              cursor: "pointer",
            }}
          >
            Exportar CSV
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.3)",
              fontFamily: FONT,
              fontSize: "0.65rem",
              cursor: "pointer",
            }}
          >
            Salir
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ padding: "1rem 2rem", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {ALL_STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            style={{
              padding: "0.35rem 0.85rem",
              fontSize: "0.6rem",
              letterSpacing: "0.08em",
              fontFamily: FONT,
              cursor: "pointer",
              border: "1px solid",
              borderColor: statusFilter === s ? GOLD : "rgba(255,255,255,0.1)",
              background: statusFilter === s ? "rgba(201,168,76,0.1)" : "transparent",
              color: statusFilter === s ? GOLD : "rgba(255,255,255,0.4)",
            }}
          >
            {s ? STATUS_LABELS[s] : "Todos"}
          </button>
        ))}
        <span style={{ marginLeft: "auto", fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", alignSelf: "center" }}>
          {total} pedido{total !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Tabla */}
      {loading ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>Cargando…</div>
      ) : orders.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: "0.75rem" }}>Sin pedidos</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.72rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {["ID", "Fecha", "Cliente", "Productos", "Total", "Estado", "Envío"].map((h) => (
                  <th key={h} style={{
                    padding: "0.75rem 1rem",
                    textAlign: "left",
                    color: "rgba(255,255,255,0.25)",
                    fontWeight: 400,
                    letterSpacing: "0.08em",
                    fontSize: "0.6rem",
                    textTransform: "uppercase",
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  style={{
                    borderBottom: "1px solid rgba(255,255,255,0.04)",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "rgba(255,255,255,0.03)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  <td style={{ padding: "0.85rem 1rem", fontFamily: "monospace", fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>
                    {order.id.slice(0, 8)}…
                  </td>
                  <td style={{ padding: "0.85rem 1rem", color: "rgba(255,255,255,0.4)" }}>
                    {new Date(order.createdAt).toLocaleDateString("es-ES", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    {order.customer?.email ?? <span style={{ color: "rgba(255,255,255,0.2)" }}>—</span>}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", color: "rgba(255,255,255,0.6)" }}>
                    {order.items.map((i) => `${i.productName} ×${i.quantity}`).join(", ")}
                  </td>
                  <td style={{ padding: "0.85rem 1rem", fontWeight: 600 }}>
                    {(order.totalEurCents / 100).toFixed(2)} €
                  </td>
                  <td style={{ padding: "0.85rem 1rem" }}>
                    <span style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.08em",
                      padding: "0.2rem 0.6rem",
                      border: `1px solid ${STATUS_COLORS[order.status]}40`,
                      color: STATUS_COLORS[order.status],
                    }}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td style={{ padding: "0.85rem 1rem", color: "rgba(255,255,255,0.4)" }}>
                    {order.shipment?.trackingNumber
                      ? <span style={{ color: GOLD }}>{order.shipment.trackingNumber}</span>
                      : <span style={{ color: "rgba(255,255,255,0.15)" }}>Sin tracking</span>
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {total > LIMIT && (
        <div style={{ padding: "1.5rem 2rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{ padding: "0.4rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontFamily: FONT, fontSize: "0.65rem", cursor: page === 1 ? "not-allowed" : "pointer" }}
          >
            ← Anterior
          </button>
          <span style={{ alignSelf: "center", fontSize: "0.65rem", color: "rgba(255,255,255,0.3)" }}>
            Página {page} de {Math.ceil(total / LIMIT)}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page * LIMIT >= total}
            style={{ padding: "0.4rem 1rem", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontFamily: FONT, fontSize: "0.65rem", cursor: page * LIMIT >= total ? "not-allowed" : "pointer" }}
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
