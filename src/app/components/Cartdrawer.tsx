import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();

  const handleCheckout = () => {
    // Redsys: redirigir al TPV virtual del banco
    // Necesita backend para generar firma HMAC-SHA256
    // Ver instrucciones al final del archivo
    alert("Integración Redsys pendiente de configurar con tu banco.");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            style={{
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.5)",
              zIndex: 998,
              backdropFilter: "blur(2px)",
            }}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "fixed",
              top: 0,
              right: 0,
              bottom: 0,
              width: "min(480px, 100vw)",
              backgroundColor: "#0e0e0e",
              zIndex: 999,
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* HEADER */}
            <div style={{
              padding: "2rem 2rem 1.5rem",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
              <div>
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.58rem",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  color: GOLD,
                  margin: "0 0 0.3rem 0",
                }}>
                  Tu selección
                </p>
                <h2 style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "1rem",
                  color: "#ffffff",
                  margin: 0,
                  letterSpacing: "-0.02em",
                }}>
                  Carrito {count > 0 && <span style={{ color: "rgba(255,255,255,0.35)", fontWeight: 400 }}>({count})</span>}
                </h2>
              </div>
              <button
                onClick={closeCart}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "rgba(255,255,255,0.4)",
                  padding: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  transition: "color 0.2s",
                }}
                onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
                onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.4)"}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ITEMS */}
            <div style={{ flex: 1, overflowY: "auto", padding: "1.5rem 2rem" }}>
              {items.length === 0 ? (
                <div style={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1rem",
                  color: "rgba(255,255,255,0.2)",
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                  </svg>
                  <p style={{ fontFamily: FONT, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    Tu carrito está vacío
                  </p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "1.25rem",
                        paddingBottom: "1.5rem",
                        marginBottom: "1.5rem",
                        borderBottom: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      {/* Imagen placeholder */}
                      <div style={{
                        width: "72px",
                        height: "72px",
                        backgroundColor: "#1a1a1a",
                        border: "1px solid rgba(255,255,255,0.07)",
                        flexShrink: 0,
                        overflow: "hidden",
                      }}>
                        {item.image ? (
                          <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>🍄</div>
                        )}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontFamily: FONT,
                          fontWeight: 600,
                          fontSize: "0.85rem",
                          color: "#ffffff",
                          margin: "0 0 0.25rem 0",
                          letterSpacing: "-0.01em",
                        }}>
                          {item.name}
                        </p>
                        <p style={{
                          fontFamily: FONT,
                          fontSize: "0.7rem",
                          color: "rgba(255,255,255,0.35)",
                          margin: "0 0 0.85rem 0",
                          letterSpacing: "0.02em",
                        }}>
                          {item.format}
                        </p>

                        {/* Qty + precio */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{
                            display: "flex",
                            alignItems: "center",
                            border: "1px solid rgba(255,255,255,0.1)",
                          }}>
                            <button
                              onClick={() => updateQty(item.id, item.quantity - 1)}
                              style={{
                                width: "28px", height: "28px",
                                background: "none", border: "none",
                                color: "rgba(255,255,255,0.5)",
                                cursor: "pointer", fontSize: "1rem",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "color 0.2s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
                              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                            >−</button>
                            <span style={{
                              fontFamily: FONT,
                              fontSize: "0.8rem",
                              color: "#ffffff",
                              width: "28px",
                              textAlign: "center",
                            }}>{item.quantity}</span>
                            <button
                              onClick={() => updateQty(item.id, item.quantity + 1)}
                              style={{
                                width: "28px", height: "28px",
                                background: "none", border: "none",
                                color: "rgba(255,255,255,0.5)",
                                cursor: "pointer", fontSize: "1rem",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                transition: "color 0.2s",
                              }}
                              onMouseEnter={e => e.currentTarget.style.color = "#ffffff"}
                              onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.5)"}
                            >+</button>
                          </div>

                          <p style={{
                            fontFamily: FONT,
                            fontWeight: 700,
                            fontSize: "0.95rem",
                            color: "#ffffff",
                            margin: 0,
                          }}>
                            {(item.price * item.quantity).toFixed(0)}€
                          </p>
                        </div>
                      </div>

                      {/* Eliminar */}
                      <button
                        onClick={() => removeItem(item.id)}
                        style={{
                          background: "none", border: "none",
                          cursor: "pointer",
                          color: "rgba(255,255,255,0.2)",
                          padding: "0.25rem",
                          transition: "color 0.2s",
                          flexShrink: 0,
                        }}
                        onMouseEnter={e => e.currentTarget.style.color = "rgba(255,255,255,0.7)"}
                        onMouseLeave={e => e.currentTarget.style.color = "rgba(255,255,255,0.2)"}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* FOOTER */}
            {items.length > 0 && (
              <div style={{
                padding: "1.5rem 2rem 2rem",
                borderTop: "1px solid rgba(255,255,255,0.06)",
              }}>
                {/* Envío */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "0.75rem",
                }}>
                  <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                    Envío
                  </span>
                  {total >= 65 ? (
                    <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: GOLD, letterSpacing: "0.05em" }}>
                      Gratis
                    </span>
                  ) : (
                    <div style={{ textAlign: "right" }}>
                      <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                        Calculado al pagar
                      </span>
                      <p style={{ fontFamily: FONT, fontSize: "0.62rem", color: GOLD, margin: "0.2rem 0 0", letterSpacing: "0.04em" }}>
                        Gratis a partir de 65€ — te faltan {(65 - total).toFixed(0)}€
                      </p>
                    </div>
                  )}
                </div>

                {/* Total */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  marginBottom: "1.5rem",
                  paddingTop: "0.75rem",
                  borderTop: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <span style={{ fontFamily: FONT, fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>
                    Total
                  </span>
                  <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1.4rem", color: "#ffffff", letterSpacing: "-0.02em" }}>
                    {total.toFixed(0)}€
                  </span>
                </div>

                {/* CTA Checkout */}
                <button
                  onClick={handleCheckout}
                  style={{
                    width: "100%",
                    padding: "1.1rem",
                    backgroundColor: "#ffffff",
                    color: "#0e0e0e",
                    border: "none",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.3s, color 0.3s",
                    marginBottom: "0.85rem",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = GOLD;
                    e.currentTarget.style.color = "#0e0e0e";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = "#ffffff";
                    e.currentTarget.style.color = "#0e0e0e";
                  }}
                >
                  Proceder al pago →
                </button>

                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.58rem",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}>
                  Pago seguro · TPV Redsys · SSL
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}