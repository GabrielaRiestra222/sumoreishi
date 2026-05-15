import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail, Package, User, MapPin } from 'lucide-react';

type OrderStatus = 'PENDING' | 'PAID' | 'PREPARING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
type ShipmentStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED' | 'FAILED' | 'RETURNED';

interface Order {
  id: string;
  stripeSessionId: string | null;
  status: OrderStatus;
  totalEurCents: number;
  currency: string;
  internalNotes: string | null;
  createdAt: string;
  updatedAt: string;
  customer: {
    email: string;
    name: string | null;
    phone: string | null;
  } | null;
  shippingAddress: {
    line1: string;
    line2: string | null;
    city: string;
    state: string | null;
    postalCode: string;
    country: string;
  } | null;
  items: Array<{
    productName: string;
    productFormat: string;
    quantity: number;
    unitEurCents: number;
  }>;
  shipment: {
    status: ShipmentStatus;
    carrier: string | null;
    trackingNumber: string | null;
    shippedAt: string | null;
  } | null;
}

const statusLabels: Record<OrderStatus, string> = {
  PENDING: 'Pendiente',
  PAID: 'Pagado',
  PREPARING: 'Preparando',
  SHIPPED: 'Enviado',
  DELIVERED: 'Entregado',
  CANCELLED: 'Cancelado',
  REFUNDED: 'Reembolsado'
};

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Estados editables
  const [status, setStatus] = useState<OrderStatus>('PENDING');
  const [carrier, setCarrier] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    fetch(`/api/admin/orders/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(r => r.json())
      .then((data: Order) => {
        setOrder(data);
        setStatus(data.status);
        setCarrier(data.shipment?.carrier || '');
        setTrackingNumber(data.shipment?.trackingNumber || '');
        setInternalNotes(data.internalNotes || '');
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id, navigate]);

  const handleUpdate = async () => {
    const token = localStorage.getItem('adminToken');
    setUpdating(true);

    try {
      const response = await fetch(`/api/admin/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status,
          carrier: carrier || null,
          trackingNumber: trackingNumber || null,
          internalNotes: internalNotes || null
        })
      });

      if (response.ok) {
        const updated = await response.json() as Order;
        setOrder(updated);
        alert('Pedido actualizado correctamente');
      } else {
        alert('Error al actualizar el pedido');
      }
    } catch {
      alert('Error al actualizar el pedido');
    } finally {
      setUpdating(false);
    }
  };

  const handleSendOrderEmail = async () => {
    const token = localStorage.getItem('adminToken');
    setSendingEmail(true);

    try {
      const response = await fetch(`/api/admin/orders/${id}/email`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? 'No se pudo enviar el email del pedido');
      }
      alert('Aviso de pedido enviado correctamente');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error enviando el email del pedido');
    } finally {
      setSendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-xl">Pedido no encontrado</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button
          onClick={() => navigate('/admin/orders')}
          className="flex items-center gap-2 text-zinc-400 hover:text-white mb-6 transition"
        >
          <ArrowLeft size={20} />
          Volver a pedidos
        </button>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Pedido #{order.id.slice(0, 8)}</h1>
            <p className="text-zinc-400">{new Date(order.createdAt).toLocaleString('es-ES')}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-yellow-500">
              {(order.totalEurCents / 100).toFixed(2)} €
            </div>
            <div className="text-sm text-zinc-400 mt-1">{statusLabels[order.status]}</div>
            <button
              onClick={() => { void handleSendOrderEmail(); }}
              disabled={sendingEmail}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded text-xs transition disabled:opacity-50"
            >
              <Mail size={14} />
              {sendingEmail ? 'Enviando...' : 'Enviar aviso email'}
            </button>
          </div>
        </div>

        {/* Estado y Edición */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Package size={20} />
            Gestión del Pedido
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-zinc-400 mb-2">Estado del pedido</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as OrderStatus)}
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white"
              >
                <option value="PENDING">Pendiente</option>
                <option value="PAID">Pagado</option>
                <option value="PREPARING">Preparando</option>
                <option value="SHIPPED">Enviado</option>
                <option value="DELIVERED">Entregado</option>
                <option value="CANCELLED">Cancelado</option>
                <option value="REFUNDED">Reembolsado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-zinc-400 mb-2">Transportista</label>
              <input
                type="text"
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                placeholder="Ej: Correos, MRW, SEUR..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Número de seguimiento</label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="Ej: ABC123456789"
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">Notas internas</label>
            <textarea
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Notas privadas sobre este pedido..."
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 rounded px-4 py-2 text-white"
            />
          </div>

          <button
            onClick={() => { void handleUpdate(); }}
            disabled={updating}
            className="w-full bg-yellow-500 text-black font-semibold py-3 rounded hover:bg-yellow-400 transition disabled:opacity-50"
          >
            {updating ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>

        {/* Productos */}
        <div className="bg-zinc-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Productos</h2>
          <div className="space-y-3">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0">
                <div>
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-sm text-zinc-400">{item.productFormat}</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">×{item.quantity}</div>
                  <div className="text-sm text-zinc-400">
                    {(item.unitEurCents / 100).toFixed(2)} € c/u
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cliente */}
        {order.customer && (
          <div className="bg-zinc-900 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <User size={20} />
              Cliente
            </h2>
            <div className="space-y-2">
              <div><span className="text-zinc-400">Email:</span> {order.customer.email}</div>
              {order.customer.name && (
                <div><span className="text-zinc-400">Nombre:</span> {order.customer.name}</div>
              )}
              {order.customer.phone && (
                <div><span className="text-zinc-400">Teléfono:</span> {order.customer.phone}</div>
              )}
            </div>
          </div>
        )}

        {/* Dirección de envío */}
        {order.shippingAddress && (
          <div className="bg-zinc-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Dirección de Envío
            </h2>
            <div className="text-zinc-300">
              <div>{order.shippingAddress.line1}</div>
              {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
              <div>
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </div>
              {order.shippingAddress.state && <div>{order.shippingAddress.state}</div>}
              <div>{order.shippingAddress.country}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
