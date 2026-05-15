import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Save } from 'lucide-react';

interface ShippingRate {
  id: string; name: string; description?: string; country: string; region?: string;
  priceEurCents: number; minOrderEurCents: number; estimatedDays?: string;
  active: boolean; priority: number; isPickup: boolean; createdAt: string;
}
interface RateForm {
  name: string; description: string; country: string; region: string;
  priceEurCents: string; minOrderEurCents: string; estimatedDays: string;
  active: boolean; priority: string; isPickup: boolean;
}

const EMPTY_FORM: RateForm = {
  name: '', description: '', country: 'ES', region: '', priceEurCents: '',
  minOrderEurCents: '0', estimatedDays: '', active: true, priority: '0', isPickup: false,
};
const COUNTRIES = [
  { code: '*', label: 'Todos' }, { code: 'ES', label: 'España' }, { code: 'PT', label: 'Portugal' },
  { code: 'FR', label: 'Francia' }, { code: 'DE', label: 'Alemania' }, { code: 'IT', label: 'Italia' },
  { code: 'GB', label: 'Reino Unido' }, { code: 'BE', label: 'Bélgica' }, { code: 'NL', label: 'Países Bajos' },
];
const token = () => localStorage.getItem('adminToken') ?? '';

export function AdminShippingPage() {
  const [rates, setRates] = useState<ShippingRate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; form: RateForm } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/shipping-rates', { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then((data: ShippingRate[]) => setRates(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => setEditing({ form: { ...EMPTY_FORM } });
  const openEdit = (r: ShippingRate) => setEditing({
    id: r.id,
    form: {
      name: r.name, description: r.description ?? '', country: r.country,
      region: r.region ?? '', priceEurCents: String(r.priceEurCents),
      minOrderEurCents: String(r.minOrderEurCents), estimatedDays: r.estimatedDays ?? '',
      active: r.active, priority: String(r.priority), isPickup: r.isPickup,
    },
  });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const { form } = editing;
      if (!form.name || form.priceEurCents === '') { alert('Nombre y precio son obligatorios'); return; }
      const body = {
        name: form.name, description: form.description || undefined, country: form.country,
        region: form.region || undefined, priceEurCents: parseInt(form.priceEurCents, 10),
        minOrderEurCents: parseInt(form.minOrderEurCents || '0', 10),
        estimatedDays: form.estimatedDays || undefined, active: form.active,
        priority: parseInt(form.priority || '0', 10), isPickup: form.isPickup,
        ...(editing.id && { id: editing.id }),
      };
      const method = editing.id ? 'PATCH' : 'POST';
      const res = await fetch('/api/admin/shipping-rates', {
        method,
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { alert('Error al guardar'); return; }
      setEditing(null);
      load();
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta tarifa de envío?')) return;
    await fetch(`/api/admin/shipping-rates?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    load();
  };

  const setField = <K extends keyof RateForm>(field: K, value: RateForm[K]) =>
    setEditing(prev => prev ? { ...prev, form: { ...prev.form, [field]: value } } : null);

  const fmt = (cents: number) => cents === 0 ? 'Gratis' : `${(cents / 100).toFixed(2)} €`;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Envíos</h1>
          <p className="text-zinc-500 text-sm">{rates.length} tarifa{rates.length !== 1 ? 's' : ''} configurada{rates.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded hover:bg-yellow-400 transition-colors">
          <Plus size={14} /> Nueva tarifa
        </button>
      </div>

      {loading ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Cargando…</div>
      ) : rates.length === 0 ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Sin tarifas — crea una o ejecuta <code className="text-zinc-400">npm run seed:shipping</code></div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Nombre', 'País/Región', 'Precio', 'Pedido mín.', 'Plazo', 'Prioridad', 'Estado', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[11px] text-zinc-500 uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rates.map(r => (
                <tr key={r.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium">{r.name}</div>
                    {r.description && <div className="text-xs text-zinc-500 mt-0.5">{r.description}</div>}
                    {r.isPickup && <span className="text-[10px] text-blue-400">Recogida</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-400">
                    {COUNTRIES.find(c => c.code === r.country)?.label ?? r.country}
                    {r.region && <span className="block text-zinc-600">{r.region}</span>}
                  </td>
                  <td className="px-4 py-3 font-semibold text-yellow-400">{fmt(r.priceEurCents)}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{r.minOrderEurCents > 0 ? `≥ ${(r.minOrderEurCents / 100).toFixed(0)} €` : '—'}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{r.estimatedDays ? `${r.estimatedDays} días` : '—'}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{r.priority}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${r.active ? 'border-green-500/30 text-green-400' : 'border-zinc-600 text-zinc-500'}`}>
                      {r.active ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => openEdit(r)} className="p-1.5 rounded text-zinc-600 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors" title="Editar">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => void handleDelete(r.id)} className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Eliminar">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-lg my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">{editing.id ? 'Editar tarifa' : 'Nueva tarifa de envío'}</h2>
              <button onClick={() => setEditing(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Nombre *</label>
                <input value={editing.form.name} onChange={e => setField('name', e.target.value)}
                  placeholder="Envío estándar Península"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Descripción</label>
                <input value={editing.form.description} onChange={e => setField('description', e.target.value)}
                  placeholder="Descripción opcional para el cliente"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">País</label>
                  <select value={editing.form.country} onChange={e => setField('country', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none">
                    {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Región</label>
                  <input value={editing.form.region} onChange={e => setField('region', e.target.value)}
                    placeholder="Peninsula, Baleares…"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Precio (céntimos) *</label>
                  <input type="number" value={editing.form.priceEurCents} onChange={e => setField('priceEurCents', e.target.value)}
                    placeholder="495 = 4,95 €  ·  0 = Gratis"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                  {editing.form.priceEurCents !== '' && !isNaN(Number(editing.form.priceEurCents)) && (
                    <p className="text-xs text-zinc-600 mt-1">= {fmt(Number(editing.form.priceEurCents))}</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Pedido mínimo (céntimos)</label>
                  <input type="number" value={editing.form.minOrderEurCents} onChange={e => setField('minOrderEurCents', e.target.value)}
                    placeholder="0 = sin mínimo"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                  {editing.form.minOrderEurCents !== '' && Number(editing.form.minOrderEurCents) > 0 && (
                    <p className="text-xs text-zinc-600 mt-1">≥ {(Number(editing.form.minOrderEurCents) / 100).toFixed(2)} €</p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Plazo estimado</label>
                  <input value={editing.form.estimatedDays} onChange={e => setField('estimatedDays', e.target.value)}
                    placeholder="2-3"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Prioridad (menor = antes)</label>
                  <input type="number" value={editing.form.priority} onChange={e => setField('priority', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editing.form.active} onChange={e => setField('active', e.target.checked)}
                    className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm text-zinc-300">Tarifa activa (visible en el carrito)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={editing.form.isPickup} onChange={e => {
                    setField('isPickup', e.target.checked);
                    if (e.target.checked) setField('priceEurCents', '0');
                  }} className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm text-zinc-300">Recogida en tienda (fuerza precio 0)</span>
                </label>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white">Cancelar</button>
              <button onClick={() => { void handleSave(); }} disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-yellow-500 text-black text-sm font-semibold rounded hover:bg-yellow-400 disabled:opacity-50 transition-colors">
                <Save size={14} /> {saving ? 'Guardando…' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
