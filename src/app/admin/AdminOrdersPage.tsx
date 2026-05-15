import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, Trash2 } from 'lucide-react';

const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente', PAID: 'Pagado', PREPARING: 'Preparando',
  SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado', REFUNDED: 'Reembolsado',
};
const STATUS_COLORS: Record<string, string> = {
  PENDING: '#a3a3a3', PAID: '#22c55e', PREPARING: '#f59e0b',
  SHIPPED: '#3b82f6', DELIVERED: '#10b981', CANCELLED: '#ef4444', REFUNDED: '#8b5cf6',
};
const ALL_STATUSES = ['', 'PENDING', 'PAID', 'PREPARING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

interface Order {
  id: string; status: string; totalEurCents: number; createdAt: string;
  customer?: { email: string; name?: string; phone?: string };
  items: Array<{ productName: string; quantity: number }>;
  shipment?: { trackingNumber?: string };
}

const LIMIT = 20;
const token = () => localStorage.getItem('adminToken') ?? '';

export function AdminOrdersPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const load = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: String(LIMIT) });
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/admin/orders?${params}`, { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then((data: { orders: Order[]; total: number }) => {
        setOrders(data.orders ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('¿Eliminar este pedido? Esta acción no se puede deshacer.')) return;
    await fetch(`/api/admin/orders/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    load();
  };

  const handleExport = async () => {
    const res = await fetch('/api/admin/export', { headers: { Authorization: `Bearer ${token()}` } });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pedidos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = search
    ? orders.filter(o =>
        o.id.includes(search) ||
        o.customer?.email?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
        o.customer?.phone?.toLowerCase().includes(search.toLowerCase())
      )
    : orders;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Pedidos</h1>
          <p className="text-zinc-500 text-sm">{total} pedido{total !== 1 ? 's' : ''} en total</p>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-sm transition-colors"
        >
          <Download size={14} /> Exportar CSV
        </button>
      </div>

      {/* Búsqueda + filtros */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Buscar por ID, email, nombre o teléfono…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-700 rounded pl-8 pr-4 py-2 text-sm focus:outline-none focus:border-yellow-500/50"
          />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {ALL_STATUSES.map(s => (
            <button
              key={s}
              onClick={() => { setStatusFilter(s); setPage(1); }}
              className={`px-3 py-1.5 rounded text-xs border transition-colors ${
                statusFilter === s
                  ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
                  : 'border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-600'
              }`}
            >
              {s ? STATUS_LABELS[s] : 'Todos'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla */}
      {loading ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Cargando…</div>
      ) : filtered.length === 0 ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Sin pedidos</div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['ID', 'Fecha', 'Cliente', 'Productos', 'Total', 'Estado', 'Tracking', ''].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] text-zinc-500 uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr
                  key={order.id}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/40 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3 font-mono text-[11px] text-zinc-500">{order.id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs whitespace-nowrap">
                    {new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {order.customer ? (
                      <div className="space-y-0.5">
                        <div className="font-medium text-zinc-200">{order.customer.name || 'Sin nombre'}</div>
                        <div className="text-zinc-500">{order.customer.email}</div>
                        {order.customer.phone && <div className="text-zinc-500">{order.customer.phone}</div>}
                      </div>
                    ) : (
                      <span className="text-zinc-600">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400 max-w-[180px] truncate">
                    {order.items.map(i => `${i.productName} ×${i.quantity}`).join(', ')}
                  </td>
                  <td className="px-4 py-3 font-semibold text-sm">{(order.totalEurCents / 100).toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className="text-[11px] px-2 py-0.5 rounded-full border" style={{
                      borderColor: `${STATUS_COLORS[order.status]}40`,
                      color: STATUS_COLORS[order.status],
                    }}>
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    {order.shipment?.trackingNumber
                      ? <span className="text-yellow-500">{order.shipment.trackingNumber}</span>
                      : <span className="text-zinc-700">—</span>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={e => { void handleDelete(order.id, e); }}
                      className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Eliminar pedido"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
      {total > LIMIT && (
        <div className="flex gap-2 justify-center mt-5">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded transition-colors"
          >
            ← Anterior
          </button>
          <span className="self-center text-xs text-zinc-500">
            {page} / {Math.ceil(total / LIMIT)}
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={page * LIMIT >= total}
            className="px-4 py-2 text-xs bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 rounded transition-colors"
          >
            Siguiente →
          </button>
        </div>
      )}
    </div>
  );
}
