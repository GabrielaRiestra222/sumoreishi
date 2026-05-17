import { useEffect, useState } from 'react';

interface EmailStatus {
  hasResendApiKey: boolean;
  adminEmail: string;
  resendFrom: string;
}

const token = () => localStorage.getItem('adminToken') ?? '';

export function AdminSettingsPage() {
  const [emailStatus, setEmailStatus] = useState<EmailStatus | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/email-test', { headers: { Authorization: `Bearer ${token()}` } })
      .then(r => r.ok ? r.json() : null)
      .then((data: EmailStatus | null) => setEmailStatus(data))
      .catch(() => {});
  }, []);

  const testEmail = async () => {
    setTestingEmail(true);
    setEmailMessage(null);
    try {
      const response = await fetch('/api/admin/email-test', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token()}` },
      });
      const data = await response.json().catch(() => ({})) as { error?: string };
      if (!response.ok) throw new Error(data.error ?? 'No se pudo enviar el email de prueba');
      setEmailMessage('Email de prueba enviado. Revisa Resend y la bandeja admin.');
    } catch (error) {
      setEmailMessage(error instanceof Error ? error.message : 'Error enviando email de prueba');
    } finally {
      setTestingEmail(false);
    }
  };

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
        <h2 className="font-semibold mb-4 text-sm text-zinc-400 uppercase tracking-wider">Promociones</h2>
        <div className="space-y-3 text-sm text-zinc-300">
          <div className="flex justify-between gap-4 py-3 border-b border-zinc-800">
            <span>Códigos promocionales</span>
            <span className="font-semibold text-green-400">Activos en Stripe Checkout</span>
          </div>
          <div className="flex justify-between gap-4 py-3">
            <span>Clientes recurrentes</span>
            <span className="text-zinc-500 text-right">Marcados en Pedidos</span>
          </div>
        </div>
        <p className="text-xs text-zinc-600 mt-4">
          Crea cupones y códigos desde Stripe Dashboard. El checkout ya muestra el campo para introducirlos.
        </p>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 max-w-lg mt-4">
        <h2 className="font-semibold mb-4 text-sm text-zinc-400 uppercase tracking-wider">Variables de entorno</h2>
        <div className="space-y-2 text-xs font-mono">
          {['DATABASE_URL', 'STRIPE_SECRET_KEY', 'STRIPE_WEBHOOK_SECRET', 'RESEND_API_KEY', 'RESEND_FROM', 'ADMIN_PASSWORD', 'ADMIN_JWT_SECRET', 'ADMIN_EMAIL'].map(v => (
            <div key={v} className="flex items-center gap-2 py-1.5 border-b border-zinc-800 last:border-0">
              <span className="text-zinc-400">{v}</span>
              <span className="text-zinc-700 ml-auto">Vercel → Settings → Env vars</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 rounded-lg border border-zinc-800 p-6 max-w-lg mt-4">
        <h2 className="font-semibold mb-4 text-sm text-zinc-400 uppercase tracking-wider">Email</h2>
        <div className="space-y-3 text-sm text-zinc-300">
          <div className="flex justify-between gap-4">
            <span>RESEND_API_KEY</span>
            <span className={emailStatus?.hasResendApiKey ? 'text-green-400' : 'text-red-400'}>
              {emailStatus ? (emailStatus.hasResendApiKey ? 'Configurada' : 'No configurada') : '...'}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span>ADMIN_EMAIL</span>
            <span className="text-zinc-500">{emailStatus?.adminEmail ?? '...'}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span>RESEND_FROM</span>
            <span className="text-zinc-500 text-right">{emailStatus?.resendFrom ?? '...'}</span>
          </div>
        </div>
        <button
          onClick={() => void testEmail()}
          disabled={testingEmail}
          className="mt-5 px-4 py-2 bg-yellow-500 text-black text-sm font-semibold rounded hover:bg-yellow-400 disabled:opacity-50 transition-colors"
        >
          {testingEmail ? 'Enviando...' : 'Enviar email de prueba'}
        </button>
        {emailMessage && (
          <p className="text-xs text-zinc-400 mt-3">{emailMessage}</p>
        )}
      </div>
    </div>
  );
}
