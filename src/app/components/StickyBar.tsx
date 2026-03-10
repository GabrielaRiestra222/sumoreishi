import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart, PRODUCTS } from "./CartContext";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

export function StickyBar() {
  const [visible, setVisible] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      // Aparece cuando el usuario pasa el hero (aprox 600px)
      setVisible(window.scrollY > 600);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAdd = () => {
    const product = PRODUCTS.find(p => p.id === "3-pack")!;
    addItem(product);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 90,
            backgroundColor: "#0e0e0e",
            borderTop: "1px solid rgba(255,255,255,0.08)",
            padding: "0.9rem 1.5rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          {/* Info producto */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.15rem" }}>
            <span style={{
              fontFamily: FONT,
              fontSize: "0.65rem",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#ffffff",
            }}>
              Sumo Reishi
            </span>
            <span style={{
              fontFamily: FONT,
              fontSize: "0.58rem",
              color: "rgba(255,255,255,0.35)",
              letterSpacing: "0.06em",
            }}>
              3 unidades · Más vendido
            </span>
          </div>

          {/* Precio + CTA */}
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ textAlign: "right" }}>
              <span style={{
                fontFamily: FONT,
                fontSize: "0.6rem",
                color: "rgba(255,255,255,0.25)",
                textDecoration: "line-through",
                display: "block",
              }}>
                96€
              </span>
              <span style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "1rem",
                color: GOLD,
                letterSpacing: "-0.02em",
              }}>
                82€
              </span>
            </div>

            <button
              onClick={handleAdd}
              style={{
                backgroundColor: "#ffffff",
                color: "#0e0e0e",
                border: "none",
                padding: "0.75rem 1.5rem",
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "0.6rem",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                cursor: "pointer",
                whiteSpace: "nowrap",
                transition: "background 0.2s, color 0.2s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = GOLD;
                e.currentTarget.style.color = "#000000";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = "#ffffff";
                e.currentTarget.style.color = "#0e0e0e";
              }}
            >
              Añadir al carrito
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}