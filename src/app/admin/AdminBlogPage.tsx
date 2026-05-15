import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, Eye, X, Save } from 'lucide-react';

interface Post {
  id: string; title: string; slug: string; excerpt?: string; category?: string;
  status: string; publishedAt?: string; createdAt: string; imageUrl?: string;
}
interface PostForm {
  title: string; slug: string; content: string; excerpt: string;
  imageUrl: string; category: string; status: string;
}

const EMPTY_FORM: PostForm = { title: '', slug: '', content: '', excerpt: '', imageUrl: '', category: '', status: 'draft' };
const token = () => localStorage.getItem('adminToken') ?? '';

async function readError(response: Response) {
  const data = await response.json().catch(() => ({})) as { error?: string };
  return data.error ?? `Error ${response.status}`;
}

function slugify(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function AdminBlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<{ id?: string; form: PostForm } | null>(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/blog', { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then((data: Post[]) => setPosts(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const openNew = () => setEditing({ form: { ...EMPTY_FORM } });

  const openEdit = async (id: string) => {
    const res = await fetch(`/api/admin/blog/${id}`, { headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      alert(`Error al abrir el post: ${await readError(res)}`);
      return;
    }
    const data = await res.json() as PostForm & { id: string };
    setEditing({ id, form: { title: data.title, slug: data.slug, content: data.content, excerpt: data.excerpt ?? '', imageUrl: data.imageUrl ?? '', category: data.category ?? '', status: data.status } });
  };

  const handleSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const url = editing.id ? `/api/admin/blog/${editing.id}` : '/api/admin/blog';
      const method = editing.id ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(editing.form),
      });
      if (!res.ok) { alert(`Error al guardar: ${await readError(res)}`); return; }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este post?')) return;
    const res = await fetch(`/api/admin/blog/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    if (!res.ok) {
      alert(`Error al eliminar: ${await readError(res)}`);
      return;
    }
    load();
  };

  const setField = (field: keyof PostForm, value: string) => {
    setEditing(prev => {
      if (!prev) return prev;
      const form = { ...prev.form, [field]: value };
      if (field === 'title' && !prev.id) form.slug = slugify(value);
      return { ...prev, form };
    });
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Blog</h1>
          <p className="text-zinc-500 text-sm">{posts.length} post{posts.length !== 1 ? 's' : ''}</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded hover:bg-yellow-400 transition-colors">
          <Plus size={14} /> Nuevo post
        </button>
      </div>

      {loading ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Cargando…</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Sin posts todavía</div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['Título', 'Slug', 'Categoría', 'Estado', 'Fecha', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[11px] text-zinc-500 uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map(post => (
                <tr key={post.id} className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-800/40 transition-colors">
                  <td className="px-4 py-3 font-medium max-w-[240px] truncate">{post.title}</td>
                  <td className="px-4 py-3 font-mono text-xs text-zinc-500">{post.slug}</td>
                  <td className="px-4 py-3 text-xs text-zinc-400">{post.category ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[11px] px-2 py-0.5 rounded-full border ${
                      post.status === 'published' ? 'border-green-500/30 text-green-400' : 'border-zinc-600 text-zinc-500'
                    }`}>
                      {post.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-zinc-600 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {post.status === 'published' && (
                        <a href={`/blog/${post.slug}`} target="_blank" rel="noopener noreferrer"
                          className="p-1.5 rounded text-zinc-600 hover:text-blue-400 hover:bg-blue-500/10 transition-colors">
                          <Eye size={13} />
                        </a>
                      )}
                      <button onClick={() => void openEdit(post.id)}
                        className="p-1.5 rounded text-zinc-600 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors">
                        <Edit2 size={13} />
                      </button>
                      <button onClick={() => void handleDelete(post.id)}
                        className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors">
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
        <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-3xl my-8">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
              <h2 className="font-semibold">{editing.id ? 'Editar post' : 'Nuevo post'}</h2>
              <div className="flex gap-2">
                <button onClick={() => setPreview(p => !p)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${preview ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}>
                  <Eye size={12} /> {preview ? 'Editor' : 'Preview'}
                </button>
                <button onClick={() => setEditing(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
              </div>
            </div>

            {preview ? (
              /* Preview */
              <div className="p-6 prose prose-invert max-w-none">
                <h1 className="text-2xl font-bold mb-2">{editing.form.title || 'Sin título'}</h1>
                {editing.form.imageUrl && <img src={editing.form.imageUrl} alt="" className="w-full rounded mb-4 max-h-60 object-cover" />}
                <div className="text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">{editing.form.content || 'Sin contenido'}</div>
              </div>
            ) : (
              /* Editor */
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Título *</label>
                    <input value={editing.form.title} onChange={e => setField('title', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Slug *</label>
                    <input value={editing.form.slug} onChange={e => setField('slug', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm font-mono focus:outline-none focus:border-yellow-500/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Categoría</label>
                    <input value={editing.form.category} onChange={e => setField('category', e.target.value)}
                      placeholder="Ciencia, Ingrediente…"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                  </div>
                  <div>
                    <label className="block text-xs text-zinc-400 mb-1.5">Estado</label>
                    <select value={editing.form.status} onChange={e => setField('status', e.target.value)}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none">
                      <option value="draft">Borrador</option>
                      <option value="published">Publicado</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">URL de imagen</label>
                  <input value={editing.form.imageUrl} onChange={e => setField('imageUrl', e.target.value)}
                    placeholder="https://…"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-yellow-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Extracto</label>
                  <textarea value={editing.form.excerpt} onChange={e => setField('excerpt', e.target.value)}
                    rows={2} placeholder="Resumen corto para listados y SEO…"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm resize-none focus:outline-none focus:border-yellow-500/50" />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 mb-1.5">Contenido *</label>
                  <textarea value={editing.form.content} onChange={e => setField('content', e.target.value)}
                    rows={14} placeholder="Escribe el contenido del post…"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm resize-y font-mono focus:outline-none focus:border-yellow-500/50" />
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-800 flex justify-end gap-3">
              <button onClick={() => setEditing(null)} className="px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
                Cancelar
              </button>
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
