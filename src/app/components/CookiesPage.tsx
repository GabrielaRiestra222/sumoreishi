const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';

export function CookiesPage() {
  return (
    <div style={{ backgroundColor: "#f5f5f3", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 2rem 8rem" }}>
        <span style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c" }}>
          Legal
        </span>
        <h1 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "2.5rem", letterSpacing: "-0.03em", margin: "1rem 0 3rem", color: "#0e0e0e" }}>
          Política de Cookies
        </h1>

        {[
          {
            title: "1. ¿Qué son las cookies?",
            body: `Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita un sitio web. Permiten recordar sus preferencias y mejorar su experiencia de navegación.`
          },
          {
            title: "2. Cookies que utilizamos",
            body: `Cookies técnicas (necesarias): Imprescindibles para el funcionamiento del sitio. No requieren consentimiento.\n— Sesión de carrito de compra\n— Preferencias de idioma\n— Aceptación de cookies\n\nCookies analíticas (opcionales): Nos permiten entender cómo se usa el sitio para mejorarlo.\n— Google Analytics (anonimizado)\n\nCookies de marketing (opcionales): Para mostrarte publicidad relevante.\n— Meta Pixel (Facebook/Instagram)`
          },
          {
            title: "3. ¿Cómo gestionar las cookies?",
            body: `Puede aceptar o rechazar las cookies opcionales a través del banner que aparece al visitar el sitio por primera vez. También puede configurar su navegador para bloquear todas las cookies, aunque esto puede afectar al funcionamiento del sitio.\n\nInstrucciones por navegador:\n— Chrome: Ajustes > Privacidad > Cookies\n— Safari: Preferencias > Privacidad\n— Firefox: Opciones > Privacidad`
          },
          {
            title: "4. Cookies de terceros",
            body: `Algunos servicios integrados en nuestra web (como pasarelas de pago) pueden instalar sus propias cookies. No tenemos control sobre ellas. Consulte la política de privacidad de cada proveedor.`
          },
          {
            title: "5. Actualizaciones",
            body: `Podemos actualizar esta política cuando cambiemos los servicios que usamos. Le informaremos mediante el banner de cookies.`
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.04em", color: "#0e0e0e", margin: "0 0 0.75rem" }}>
              {section.title}
            </h2>
            <p style={{ fontFamily: FONT, fontSize: "0.82rem", lineHeight: 1.85, color: "rgba(0,0,0,0.55)", margin: 0, whiteSpace: "pre-line" }}>
              {section.body}
            </p>
          </div>
        ))}

        <p style={{ fontFamily: FONT, fontSize: "0.65rem", color: "rgba(0,0,0,0.3)", letterSpacing: "0.05em" }}>
          Última actualización: marzo 2026
        </p>
      </div>
    </div>
  );
}