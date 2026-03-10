import { Link } from "react-router-dom";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

const linkStyle = {
  display: "block" as const,
  fontFamily: FONT,
  fontSize: "0.75rem",
  color: "rgba(255,255,255,0.4)",
  textDecoration: "none",
  marginBottom: "0.65rem",
  transition: "color 0.2s",
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer style={{ backgroundColor: "#0a0a0a", borderTop: "1px solid rgba(255,255,255,0.06)" }}>

      {/* MAIN */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "4rem 2rem 3rem" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "3rem",
        }}
        className="footer-grid"
        >

          {/* Brand */}
          <div>
            <p style={{ fontFamily: FONT, fontWeight: 800, fontSize: "1rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "#ffffff", margin: "0 0 1rem" }}>
              Sumo Reishi
            </p>
            <p style={{ fontFamily: FONT, fontSize: "0.75rem", lineHeight: 1.75, color: "rgba(255,255,255,0.35)", margin: "0 0 1.5rem", maxWidth: "240px" }}>
              Extracto de Ganoderma lucidum de cuerpo fructífero completo. Sin compromisos.
            </p>
            <div style={{ display: "flex", gap: "1rem" }}>
              {[
                {
                  label: "Instagram", href: "https://instagram.com/sumoreishi",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                },
                {
                  label: "TikTok", href: "https://tiktok.com/@sumoreishi",
                  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.22 8.22 0 0 0 4.82 1.56V6.79a4.85 4.85 0 0 1-1.05-.1z"/></svg>
                },
              ].map(s => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  style={{ color: "rgba(255,255,255,0.3)", transition: "color 0.2s", display: "flex" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                  onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Producto */}
          <div>
            <p style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, margin: "0 0 1.25rem" }}>
              Producto
            </p>
            {[
              { label: "Ingredientes", to: "/#ingredient" },
              { label: "Cómo tomarlo", to: "/#how-to-use" },
              { label: "Preguntas frecuentes", to: "/#faq" },
              { label: "Tienda", to: "/#purchase" },
              { label: "Blog", to: "/blog" },
            ].map(l => (
              <a key={l.label} href={l.to} style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {l.label}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, margin: "0 0 1.25rem" }}>
              Legal
            </p>
            {[
              { label: "Política de privacidad", to: "/privacidad" },
              { label: "Política de cookies", to: "/cookies" },
              { label: "Aviso legal", to: "/aviso-legal" },
              { label: "Condiciones de venta", to: "/condiciones-venta" },
            ].map(l => (
              <Link key={l.label} to={l.to} style={linkStyle}
                onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contacto */}
          <div>
            <p style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, margin: "0 0 1.25rem" }}>
              Contacto
            </p>
            <a href="mailto:hola@sumoreishi.com" style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              hola@sumoreishi.com
            </a>
            <a href="/#contacto" style={linkStyle}
              onMouseEnter={e => (e.currentTarget.style.color = "#ffffff")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.4)")}
            >
              Formulario de contacto
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "1.25rem 2rem", maxWidth: "1200px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" as const, gap: "1rem" }}>
        <p style={{ fontFamily: FONT, fontSize: "0.6rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.08em", margin: 0 }}>
          © {year} Sumo Reishi. Todos los derechos reservados.
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <p style={{ fontFamily: FONT, fontSize: "0.58rem", color: "rgba(255,255,255,0.15)", letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>
            Pago seguro
          </p>
          {["VISA", "MC", "REDSYS"].map(brand => (
            <span key={brand} style={{ fontFamily: FONT, fontSize: "0.5rem", letterSpacing: "0.1em", color: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.1)", padding: "0.2rem 0.5rem" }}>
              {brand}
            </span>
          ))}
        </div>
      </div>

      <style>{`
        .footer-grid { grid-template-columns: repeat(4, 1fr) !important; }
        @media (max-width: 768px) { .footer-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 480px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}