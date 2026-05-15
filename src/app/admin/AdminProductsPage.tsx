import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Copy, X, Save } from 'lucide-react';

interface Product {
  id: string; slug: string; name: string; format: string; priceEurCents: number; active: boolean; createdAt: string;
}
interface ProductForm { slug: string; name: string; format: string; priceEurCents: string; active: boolean; }

const EMPTY_FORM: ProductForm = { slug: '', name: '', format: '', priceEurCents: '', active: true };
const token = () => localStorage.getItem('adminToken') ?? '';

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; form: ProductForm } | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/products', { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then((data: Product[]) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => setEditing({ form: { ...EMPTY_FORM } });
  const openEdit = (p: Product) => setEditing({ id: p.id, form: { slug: p.slug, name: p.name, format: p.format, priceEurCents: String(p.priceEurCents), active: p.active } });
  const duplicate = (p: Product) => setEditing({ form: { slug: `${p.slug}-copia`, name: `${p.name} (copia)`, format: p.format, priceEurCents: String(p.priceEurCents), active: false } });

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const price = parseInt(editing.form.priceEurCents, 10);
      if (!editing.form.slug || !editing.form.name || !editing.form.format || isNaN(price)) {
        alert('Rellena todos los campos obligatorios'); return;
      }
      const body = { ...editing.form, priceEurCents: price, ...(editing.id && { id: editing.id }) };
      const method = editing.id ? 'PATCH' : 'POST';
      const res = await fetch('/api/admin/products', {
        method,
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) { alert('Error al guardar'); return; }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    load();
  };

  const setField = <K extends keyof ProductForm>(field: K, value: ProductForm[K]) => {
    setEditing(prev => prev ? { ...prev, form: { ...prev.form, [field]: value } } : null);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Productos</h1>
          <p className="text-zinc-500 text-sm">{products.length} producto{products.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded hover:bg-yellow-400 transition-colors">
          <Plus size={14} /> Nuevo producto
        </button>
      </div>

      {loading ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Cargando…</div>
      ) : products.length === 0 ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Sin productos</div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Nombre', 'Slug', 'Formato', 'Precio', 'Activo', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[11px] text-zinc-500 uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{p.slug}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{p.format}</td>
                  <td className="px-4 py-3 font-semibold">{(p.priceEurCents / 100).toFixed(2)} €</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${p.active ? 'border-green-500/30 text-green-400' : 'border-zinc-600 text-zinc-500'}`}>
                      {p.active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <button onClick={() => duplicate(p)} className="p-1.5 rounded text-zinc-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors" title="Duplicar">
                        <Copy size={13} />
                      </button>
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded text-zinc-600 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors" title="Editar">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => void handleDelete(p.id)} className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Eliminar">
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

      {/* Modal editor */}
      {editing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">{editing.id ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button onClick={() => setEditing(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Nombre *</label>
                <input value={editing.form.name} onChange={e => setField('name', e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Slug *</label>
                  <input value={editing.form.slug} onChange={e => setField('slug', e.target.value)}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-yellow-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Precio (céntimos) *</label>
                  <input type="number" value={editing.form.priceEurCents} onChange={e => setField('priceEurCents', e.target.value)}
                    placeholder="3200 = 32,00 €"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-zinc-400 mb-1.5">Formato *</label>
                <input value={editing.form.format} onChange={e => setField('format', e.target.value)}
                  placeholder="1 ud · 60 cápsulas"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={editing.form.active} onChange={e => setField('active', e.target.checked)}
                  className="w-4 h-4 accent-yellow-500" />
                <span className="text-sm text-zinc-300">Producto activo (visible en tienda)</span>
              </label>
              {editing.form.priceEurCents && !isNaN(Number(editing.form.priceEurCents)) && (
                <p className="text-xs text-zinc-500">= {(Number(editing.form.priceEurCents) / 100).toFixed(2)} €</p>
              )}
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
