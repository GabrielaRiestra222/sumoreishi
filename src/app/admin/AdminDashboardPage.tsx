import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, MessageSquare, TrendingUp, Clock } from 'lucide-react';

interface Stats {
  totalOrders: number;
  paidOrders: number;
  revenueEurCents: number;
  unreadContacts: number;
  pendingShipments: number;
  recentOrders: Array<{
    id: string;
    status: string;
    totalEurCents: number;
    createdAt: string;
    customer?: { email: string };
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400', PAID: 'text-green-400', PREPARING: 'text-blue-400',
  SHIPPED: 'text-purple-400', DELIVERED: 'text-emerald-400',
  CANCELLED: 'text-red-400', REFUNDED: 'text-orange-400',
};
const STATUS_LABELS: Record<string, string> = {
  PENDING: 'Pendiente', PAID: 'Pagado', PREPARING: 'Preparando',
  SHIPPED: 'Enviado', DELIVERED: 'Entregado', CANCELLED: 'Cancelado', REFUNDED: 'Reembolsado',
};

export function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const token = localStorage.getItem('adminToken') ?? '';

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/orders?limit=5', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
      fetch('/api/admin/contacts?unread=true&limit=1', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    ]).then(([ordersData, contactsData]) => {
      const orders = ordersData.orders ?? [];
      const paid = orders.filter((o: { status: string }) => ['PAID', 'PREPARING', 'SHIPPED', 'DELIVERED'].includes(o.status));
      setStats({
        totalOrders: ordersData.total ?? 0,
        paidOrders: paid.length,
        revenueEurCents: paid.reduce((acc: number, o: { totalEurCents: number }) => acc + o.totalEurCents, 0),
        unreadContacts: contactsData.total ?? 0,
        pendingShipments: orders.filter((o: { status: string }) => o.status === 'PAID' || o.status === 'PREPARING').length,
        recentOrders: orders,
      });
    }).catch(() => {});
  }, [token]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-zinc-500 text-sm mb-8">Resumen de actividad reciente</p>

      {/* Métricas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Pedidos totales', value: stats?.totalOrders ?? '—', icon: ShoppingBag, color: 'text-yellow-400' },
          { label: 'Ingresos (últimos)', value: stats ? `${(stats.revenueEurCents / 100).toFixed(0)} €` : '—', icon: TrendingUp, color: 'text-green-400' },
          { label: 'Pendientes de envío', value: stats?.pendingShipments ?? '—', icon: Clock, color: 'text-blue-400' },
          { label: 'Contactos sin leer', value: stats?.unreadContacts ?? '—', icon: MessageSquare, color: 'text-purple-400' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-zinc-900 rounded-lg p-5 border border-zinc-800">
            <div className={`${color} mb-3`}><Icon size={20} /></div>
            <div className="text-2xl font-bold mb-1">{value}</div>
            <div className="text-xs text-zinc-500">{label}</div>
          </div>
        ))}
      </div>

      {/* Pedidos recientes */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="px-5 py-4 border-b border-zinc-800 flex justify-between items-center">
          <h2 className="font-semibold">Pedidos recientes</h2>
          <Link to="/admin/orders" className="text-xs text-yellow-500 hover:text-yellow-400">Ver todos →</Link>
        </div>
        {!stats ? (
          <div className="p-8 text-center text-zinc-600 text-sm">Cargando…</div>
        ) : stats.recentOrders.length === 0 ? (
          <div className="p-8 text-center text-zinc-600 text-sm">Sin pedidos todavía</div>
        ) : (
          <div>
            {stats.recentOrders.map(o => (
              <Link
                key={o.id}
                to={`/admin/orders/${o.id}`}
                className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-800 last:border-0 hover:bg-zinc-800/50 transition-colors"
              >
                <div>
                  <p className="text-sm font-mono text-zinc-400">{o.id.slice(0, 8)}…</p>
                  <p className="text-xs text-zinc-600">{o.customer?.email ?? '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{(o.totalEurCents / 100).toFixed(2)} €</p>
                  <p className={`text-xs ${STATUS_COLORS[o.status] ?? 'text-zinc-400'}`}>
                    {STATUS_LABELS[o.status] ?? o.status}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
