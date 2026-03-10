import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";
const KEY = "sumo-cookies-accepted";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(KEY);
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(KEY, "true");
    setVisible(false);
  };

  const reject = () => {
    localStorage.setItem(KEY, "false");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: "1.5rem",
            left: "1.5rem",
            right: "1.5rem",
            maxWidth: "480px",
            zIndex: 200,
            backgroundColor: "#0e0e0e",
            border: "1px solid rgba(255,255,255,0.08)",
            padding: "1.5rem 1.75rem",
          }}
        >
          <p style={{
            fontFamily: FONT,
            fontSize: "0.72rem",
            lineHeight: 1.75,
            color: "rgba(255,255,255,0.5)",
            margin: "0 0 1.25rem",
          }}>
            Usamos cookies propias y de terceros para mejorar tu experiencia y analizar el tráfico.
            Puedes aceptarlas o rechazarlas.{" "}
            <a href="/cookies" style={{ color: GOLD, textDecoration: "none" }}>
              Más información
            </a>
          </p>

          <div style={{ display: "flex", gap: "0.75rem" }}>
            <button
              onClick={accept}
              style={{
                flex: 1,
                padding: "0.65rem",
                backgroundColor: "#ffffff",
                color: "#0e0e0e",
                border: "none",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = GOLD; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "#ffffff"; }}
            >
              Aceptar
            </button>
            <button
              onClick={reject}
              style={{
                flex: 1,
                padding: "0.65rem",
                backgroundColor: "transparent",
                color: "rgba(255,255,255,0.3)",
                border: "1px solid rgba(255,255,255,0.1)",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "0.58rem",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={e => { e.currentTarget.style.color = "#ffffff"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)"; }}
              onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.3)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
            >
              Rechazar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}