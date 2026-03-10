import { motion } from "framer-motion";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

export function ConfirmacionPage() {
  return (
    <div style={{ backgroundColor: "#0e0e0e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: "520px", width: "100%", textAlign: "center" }}
      >
        {/* Icono check */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          style={{
            width: "64px", height: "64px",
            borderRadius: "50%",
            border: `1.5px solid ${GOLD}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 2.5rem",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </motion.div>

        <span style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: "1rem" }}>
          Pedido confirmado
        </span>

        <h1 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "2.2rem", letterSpacing: "-0.03em", color: "#ffffff", margin: "0 0 1.25rem", lineHeight: 1.1 }}>
          Gracias por tu confianza
        </h1>

        <p style={{ fontFamily: FONT, fontSize: "0.8rem", lineHeight: 1.85, color: "rgba(255,255,255,0.4)", margin: "0 0 2.5rem" }}>
          Tu pedido ha sido procesado correctamente. Recibirás un email de confirmación en breve con los detalles del envío. La entrega estimada es de 48–72 horas.
        </p>

        <div style={{
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "1.5rem",
          marginBottom: "2.5rem",
          textAlign: "left",
        }}>
          {[
            { label: "Producto", value: "Sumo Reishi" },
            { label: "Envío", value: "48–72 horas" },
            { label: "Soporte", value: "hola@sumoreishi.com" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontFamily: FONT, fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", letterSpacing: "0.06em" }}>{row.label}</span>
              <span style={{ fontFamily: FONT, fontSize: "0.65rem", color: "rgba(255,255,255,0.6)", letterSpacing: "0.04em" }}>{row.value}</span>
            </div>
          ))}
        </div>

        <a
          href="/"
          style={{
            display: "inline-block",
            fontFamily: FONT,
            fontWeight: 700,
            fontSize: "0.6rem",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "#0e0e0e",
            backgroundColor: "#ffffff",
            padding: "0.9rem 2.5rem",
            textDecoration: "none",
            transition: "background 0.2s",
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = GOLD; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
        >
          Volver al inicio
        </a>
      </motion.div>
    </div>
  );
}