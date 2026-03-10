import { motion } from "framer-motion";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

export function NotFoundPage() {
  return (
    <div style={{ backgroundColor: "#0e0e0e", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}
      >
        <span style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: "1.5rem" }}>
          Error 404
        </span>

        <h1 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "clamp(2rem, 8vw, 3.5rem)", letterSpacing: "-0.04em", color: "#ffffff", margin: "0 0 1.25rem", lineHeight: 1.05 }}>
          Página no encontrada
        </h1>

        <p style={{ fontFamily: FONT, fontSize: "0.8rem", lineHeight: 1.85, color: "rgba(255,255,255,0.35)", margin: "0 0 2.5rem" }}>
          La página que buscas no existe o ha sido movida.
        </p>

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