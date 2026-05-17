import { useEffect, useState } from "react";
import type { FormEvent } from "react";

const PROFILE_KEY = "sumoreishiCustomerProfile";

interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
}

export function AccountPage() {
  const [profile, setProfile] = useState<CustomerProfile>({ name: "", email: "", phone: "" });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(PROFILE_KEY);
    if (!stored) return;
    try {
      setProfile(JSON.parse(stored) as CustomerProfile);
    } catch {
      localStorage.removeItem(PROFILE_KEY);
    }
  }, []);

  const saveProfile = (event: FormEvent) => {
    event.preventDefault();
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <main className="min-h-screen bg-[#F5F5F3] px-6 py-32">
      <div className="mx-auto max-w-2xl">
        <p className="mb-4 text-xs uppercase tracking-[0.3em] text-black/40">Mi cuenta</p>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight text-[#111] md:text-5xl">
          Guarda tus datos para futuras compras
        </h1>
        <p className="mb-10 max-w-xl text-sm leading-relaxed text-black/55">
          Usaremos estos datos para pre-rellenar el checkout siempre que compres desde este dispositivo.
          Stripe guardará el cliente de forma segura cuando completes el pago.
        </p>

        <form onSubmit={saveProfile} className="bg-white p-6 shadow-sm md:p-8">
          <div className="grid gap-5">
            <label className="grid gap-2 text-sm text-black/70">
              Nombre
              <input
                value={profile.name}
                onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                className="border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/40"
                placeholder="Tu nombre"
              />
            </label>

            <label className="grid gap-2 text-sm text-black/70">
              Email
              <input
                type="email"
                value={profile.email}
                onChange={(event) => setProfile((current) => ({ ...current, email: event.target.value }))}
                className="border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/40"
                placeholder="tu@email.com"
                required
              />
            </label>

            <label className="grid gap-2 text-sm text-black/70">
              Teléfono
              <input
                value={profile.phone}
                onChange={(event) => setProfile((current) => ({ ...current, phone: event.target.value }))}
                className="border border-black/10 bg-white px-4 py-3 text-sm text-black outline-none focus:border-black/40"
                placeholder="+34 600 000 000"
              />
            </label>
          </div>

          <button className="mt-8 w-full bg-[#111] px-5 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-black">
            Guardar datos
          </button>

          {saved && <p className="mt-4 text-sm text-green-700">Datos guardados correctamente.</p>}
        </form>
      </div>
    </main>
  );
}

export function readStoredCustomerProfile(): Partial<CustomerProfile> | null {
  const stored = localStorage.getItem(PROFILE_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored) as CustomerProfile;
  } catch {
    return null;
  }
}
