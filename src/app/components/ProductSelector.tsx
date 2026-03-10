import { useState } from "react";
import { motion } from "framer-motion";
import { useCart, PRODUCTS } from "./CartContext";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

export function ProductSelector() {
  const [selected, setSelected] = useState(PRODUCTS[1].id);
  const { addItem } = useCart();

  const selectedProduct = PRODUCTS.find(p => p.id === selected)!;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>

      {PRODUCTS.map((product) => {
        const isSelected = selected === product.id;
        return (
          <motion.div
            key={product.id}
            onClick={() => setSelected(product.id)}
            whileTap={{ scale: 0.99 }}
            style={{
              border: `1px solid ${isSelected ? "#1a1a1a" : "rgba(0,0,0,0.1)"}`,
              padding: "1rem 1.25rem",
              cursor: "pointer",
              backgroundColor: isSelected ? "#f9f9f7" : "transparent",
              transition: "all 0.2s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "1rem",
              position: "relative",
            }}
          >
            {/* Badge */}
            {product.badge && (
              <span style={{
                position: "absolute",
                top: "-1px",
                right: "1rem",
                backgroundColor: "#1a1a1a",
                color: "#ffffff",
                fontFamily: FONT,
                fontSize: "0.5rem",
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                padding: "0.2rem 0.5rem",
              }}>
                {product.badge}
              </span>
            )}

            {/* Radio + info */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
              <div style={{
                width: "16px", height: "16px",
                borderRadius: "50%",
                border: `1.5px solid ${isSelected ? "#1a1a1a" : "rgba(0,0,0,0.2)"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "border-color 0.2s",
              }}>
                {isSelected && (
                  <div style={{
                    width: "8px", height: "8px",
                    borderRadius: "50%",
                    backgroundColor: "#1a1a1a",
                  }} />
                )}
              </div>
              <div>
                <p style={{
                  fontFamily: FONT,
                  fontWeight: 600,
                  fontSize: "0.82rem",
                  color: "#1a1a1a",
                  margin: 0,
                  letterSpacing: "-0.01em",
                }}>
                  {product.format}
                </p>
                {product.originalPrice && (
                  <p style={{
                    fontFamily: FONT,
                    fontSize: "0.62rem",
                    color: GOLD,
                    margin: "0.15rem 0 0",
                    letterSpacing: "0.04em",
                  }}>
                    Ahorras {product.originalPrice - product.price}€
                  </p>
                )}
              </div>
            </div>

            {/* Precio */}
            <div style={{ textAlign: "right", flexShrink: 0 }}>
              {product.originalPrice && (
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.65rem",
                  color: "rgba(0,0,0,0.3)",
                  margin: "0 0 0.1rem",
                  textDecoration: "line-through",
                }}>
                  {product.originalPrice}€
                </p>
              )}
              <p style={{
                fontFamily: FONT,
                fontWeight: 700,
                fontSize: "1rem",
                color: "#1a1a1a",
                margin: 0,
                letterSpacing: "-0.02em",
              }}>
                {product.price}€
              </p>
            </div>
          </motion.div>
        );
      })}

      {/* CTA */}
      <button
        onClick={() => addItem(selectedProduct)}
        style={{
          marginTop: "0.5rem",
          width: "100%",
          padding: "1rem",
          backgroundColor: "#1a1a1a",
          color: "#ffffff",
          border: "none",
          fontFamily: FONT,
          fontWeight: 700,
          fontSize: "0.65rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = GOLD)}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#1a1a1a")}
      >
        Añadir al carrito
      </button>

      <p style={{
        fontFamily: FONT,
        fontSize: "0.58rem",
        textAlign: "center",
        color: "rgba(0,0,0,0.3)",
        letterSpacing: "0.06em",
        margin: 0,
      }}>
        Envío gratis · Pago seguro · Garantía 30 días
      </p>
    </div>
  );
}