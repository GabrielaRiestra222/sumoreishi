export function AdminSettingsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-1">Configuración</h1>
      <p className="text-zinc-500 text-sm mb-8">Ajustes de la tienda</p>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 max-w-lg">
        <h2 className="font-semibold mb-4 text-sm text-zinc-400 uppercase tracking-wider">Envíos</h2>
        <div className="space-y-4 text-sm text-zinc-300">
          <div className="flex justify-between py-3 border-b border-zinc-800">
            <span>Envío gratuito a partir de</span>
            <span className="font-semibold text-yellow-400">65 €</span>
          </div>
          <div className="flex justify-between py-3 border-b border-zinc-800">
            <span>Coste de envío estándar</span>
            <span className="font-semibold">4,95 €</span>
          </div>
          <div className="flex justify-between py-3">
            <span>Países de envío</span>
            <span className="text-zinc-500 text-xs">ES, PT, FR, DE, IT, GB, BE, NL</span>
          </div>
        </div>
        <p className="text-xs text-zinc-600 mt-4">
          Para modificar estos valores, actualiza las variables en <code className="text-zinc-400">api/checkout.ts</code>.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 max-w-lg mt-4">
        <h2 className="font-semibold mb-4 text-sm text-zinc-400 uppercase tracking-wider">Variables de entorno</h2>
        <div className="space-y-2 text-xs font-mono">
          {['DATABASE_URL', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'RESEND_API_KEY', 'ADMIN_PASSWORD', 'ADMIN_JWT_SECRET', 'ADMIN_EMAIL'].map(v => (
            <div key={v} className="flex items-center gap-2 py-1.5 border-b border-zinc-800 last:border-0">
              <span className="text-zinc-400">{v}</span>
              <span className="text-zinc-700 ml-auto">Vercel → Settings → Env vars</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
