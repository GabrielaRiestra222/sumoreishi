import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, MessageSquare, FileText, Package, Truck, Settings, LogOut } from 'lucide-react';

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/orders', label: 'Pedidos', icon: ShoppingBag },
  { to: '/admin/contacts', label: 'Contactos', icon: MessageSquare },
  { to: '/admin/blog', label: 'Blog', icon: FileText },
  { to: '/admin/products', label: 'Productos', icon: Package },
  { to: '/admin/shipping', label: 'Envíos', icon: Truck },
  { to: '/admin/settings', label: 'Configuración', icon: Settings },
];

export function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) {
      navigate('/admin/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-zinc-950 text-white">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-zinc-900 flex flex-col border-r border-zinc-800">
        {/* Brand */}
        <div className="px-5 py-5 border-b border-zinc-800">
          <p className="text-[10px] tracking-[.2em] text-yellow-500 uppercase font-medium">Sumo Reishi</p>
          <p className="text-xs text-zinc-500 mt-0.5">Panel admin</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`
              }
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-zinc-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded text-sm text-zinc-500 hover:text-red-400 hover:bg-zinc-800 transition-colors"
          >
            <LogOut size={16} />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
