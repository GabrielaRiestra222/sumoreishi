import { useEffect, useState, useCallback } from 'react';
import { Mail, MailOpen, Trash2, X } from 'lucide-react';

interface Contact {
  id: string; name: string; email: string; message: string; read: boolean; createdAt: string;
}

const token = () => localStorage.getItem('adminToken') ?? '';

export function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Contact | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    fetch('/api/admin/contacts?limit=100', { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.json())
      .then((data: { contacts: Contact[]; total: number }) => {
        setContacts(data.contacts ?? []);
        setTotal(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRead = async (id: string, read: boolean) => {
    await fetch('/api/admin/contacts', {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, read }),
    });
    setContacts(prev => prev.map(c => c.id === id ? { ...c, read } : c));
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, read } : null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este mensaje?')) return;
    await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token()}` } });
    setContacts(prev => prev.filter(c => c.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const open = (c: Contact) => {
    setSelected(c);
    if (!c.read) void handleRead(c.id, true);
  };

  const unread = contacts.filter(c => !c.read).length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Contactos</h1>
          <p className="text-zinc-500 text-sm">
            {total} mensaje{total !== 1 ? 's' : ''}
            {unread > 0 && <span className="ml-2 text-yellow-400">· {unread} sin leer</span>}
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Cargando…</div>
      ) : contacts.length === 0 ? (
        <div className="text-center text-zinc-600 py-16 text-sm">Sin mensajes todavía</div>
      ) : (
        <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800">
                {['', 'Nombre', 'Email', 'Mensaje', 'Fecha', ''].map((h, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[11px] text-zinc-500 uppercase tracking-wider font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr
                  key={c.id}
                  onClick={() => open(c)}
                  className={`border-b border-zinc-800/60 last:border-0 cursor-pointer transition-colors ${
                    c.read ? 'hover:bg-zinc-800/40' : 'bg-yellow-500/5 hover:bg-yellow-500/10'
                  }`}
                >
                  <td className="px-4 py-3">
                    {c.read
                      ? <MailOpen size={14} className="text-zinc-600" />
                      : <Mail size={14} className="text-yellow-400" />
                    }
                  </td>
                  <td className="px-4 py-3 font-medium">{c.name}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs">{c.email}</td>
                  <td className="px-4 py-3 text-zinc-400 text-xs max-w-[260px] truncate">{c.message}</td>
                  <td className="px-4 py-3 text-zinc-600 text-xs whitespace-nowrap">
                    {new Date(c.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => void handleRead(c.id, !c.read)}
                        className="p-1.5 rounded text-zinc-600 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                        title={c.read ? 'Marcar no leído' : 'Marcar leído'}
                      >
                        {c.read ? <Mail size={13} /> : <MailOpen size={13} />}
                      </button>
                      <button
                        onClick={() => void handleDelete(c.id)}
                        className="p-1.5 rounded text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Eliminar"
                      >
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

      {/* Modal detalle */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelected(null)}>
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="font-semibold text-lg">{selected.name}</h2>
                <a href={`mailto:${selected.email}`} className="text-sm text-yellow-500 hover:underline">{selected.email}</a>
              </div>
              <button onClick={() => setSelected(null)} className="text-zinc-500 hover:text-white"><X size={18} /></button>
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">{selected.message}</p>
            <p className="text-zinc-600 text-xs">
              {new Date(selected.createdAt).toLocaleString('es-ES')}
            </p>
            <div className="flex gap-2 mt-4">
              <a
                href={`mailto:${selected.email}`}
                className="flex-1 text-center py-2 bg-yellow-500 text-black text-sm font-semibold rounded hover:bg-yellow-400 transition-colors"
              >
                Responder por email
              </a>
              <button
                onClick={() => void handleDelete(selected.id)}
                className="px-4 py-2 bg-zinc-800 hover:bg-red-500/20 text-red-400 text-sm rounded transition-colors"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
