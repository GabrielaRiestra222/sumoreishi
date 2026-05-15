import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

interface ShippingRate {
  id: string; name: string; description?: string; priceEurCents: number;
  minOrderEurCents: number; estimatedDays?: string; isPickup: boolean; active: boolean;
}

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, total, count } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRateId, setSelectedRateId] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    fetch("/api/shipping-rates")
      .then(r => r.ok ? r.json() : [])
      .then((data: ShippingRate[]) => setShippingRates(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, [isOpen]);

  const subtotalCents = Math.round(total * 100);
  const eligibleRates = shippingRates.filter(r => subtotalCents >= r.minOrderEurCents);

  useEffect(() => {
    if (eligibleRates.length === 0) return;
    if (!selectedRateId || !eligibleRates.find(r => r.id === selectedRateId)) {
      setSelectedRateId(eligibleRates[0].id);
    }
  }, [eligibleRates.map(r => r.id).join(','), selectedRateId]); // eslint-disable-line react-hooks/exhaustive-deps

  const selectedRate = eligibleRates.find(r => r.id === selectedRateId) ?? null;
  const fallbackShippingCents = subtotalCents >= 6500 ? 0 : 495;
  const shippingCostEur = (selectedRate?.priceEurCents ?? fallbackShippingCents) / 100;
  const grandTotal = total + shippingCostEur;

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ id: i.id, quantity: i.quantity })),
          ...(selectedRateId ? { shippingRateId: selectedRateId } : {}),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({})) as { error?: string };
        throw new Error(data.error ?? `Error ${response.status}`);
      }

      const { url } = await response.json() as { url: string };
      window.location.href = url;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error desconocido";
      setCheckoutError(msg || "No se pudo procesar el carrito. Inténtalo de nuevo.");
      setIsCheckingOut(false);
    }
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
                {/* Subtotal */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "1rem",
                }}>
                  <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                    Subtotal
                  </span>
                  <span style={{ fontFamily: FONT, fontSize: "0.85rem", color: "rgba(255,255,255,0.7)" }}>
                    {total.toFixed(0)}€
                  </span>
                </div>

                {/* Opciones de envío */}
                {eligibleRates.length > 0 ? (
                  <div style={{ marginBottom: "1rem" }}>
                    <p style={{ fontFamily: FONT, fontSize: "0.62rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)", marginBottom: "0.6rem" }}>
                      Envío
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      {eligibleRates.map(rate => (
                        <label
                          key={rate.id}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "0.55rem 0.75rem",
                            border: `1px solid ${selectedRateId === rate.id ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.07)"}`,
                            backgroundColor: selectedRateId === rate.id ? "rgba(201,168,76,0.06)" : "transparent",
                            cursor: "pointer",
                            transition: "border-color 0.2s, background-color 0.2s",
                          }}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <input
                              type="radio"
                              name="shippingRate"
                              value={rate.id}
                              checked={selectedRateId === rate.id}
                              onChange={() => setSelectedRateId(rate.id)}
                              style={{ accentColor: GOLD, width: "13px", height: "13px" }}
                            />
                            <div>
                              <p style={{ fontFamily: FONT, fontSize: "0.72rem", color: "#ffffff", margin: 0, lineHeight: 1.3 }}>
                                {rate.name}
                              </p>
                              {rate.estimatedDays && (
                                <p style={{ fontFamily: FONT, fontSize: "0.6rem", color: "rgba(255,255,255,0.3)", margin: "0.15rem 0 0", letterSpacing: "0.04em" }}>
                                  {rate.estimatedDays} días hábiles
                                </p>
                              )}
                            </div>
                          </div>
                          <span style={{
                            fontFamily: FONT,
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            color: rate.priceEurCents === 0 ? GOLD : "#ffffff",
                            letterSpacing: "0.03em",
                          }}>
                            {rate.priceEurCents === 0 ? "Gratis" : `${(rate.priceEurCents / 100).toFixed(2)}€`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                ) : shippingRates.length === 0 ? (
                  /* Fallback when no rates in DB */
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                    <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>Envío</span>
                    {fallbackShippingCents === 0 ? (
                      <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: GOLD }}>Gratis</span>
                    ) : (
                      <div style={{ textAlign: "right" }}>
                        <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: "#ffffff" }}>{(fallbackShippingCents / 100).toFixed(2)}€</span>
                        <p style={{ fontFamily: FONT, fontSize: "0.62rem", color: GOLD, margin: "0.2rem 0 0" }}>
                          Gratis a partir de 65€ — te faltan {(65 - total).toFixed(0)}€
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}

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
                    {grandTotal.toFixed(0)}€
                  </span>
                </div>

                {/* CTA Checkout */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  style={{
                    width: "100%",
                    padding: "1.1rem",
                    backgroundColor: isCheckingOut ? "rgba(255,255,255,0.5)" : "#ffffff",
                    color: "#0e0e0e",
                    border: "none",
                    fontFamily: FONT,
                    fontWeight: 700,
                    fontSize: "0.68rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    cursor: isCheckingOut ? "not-allowed" : "pointer",
                    transition: "background 0.3s, color 0.3s",
                    marginBottom: checkoutError ? "0.5rem" : "0.85rem",
                  }}
                  onMouseEnter={e => {
                    if (!isCheckingOut) e.currentTarget.style.backgroundColor = GOLD;
                  }}
                  onMouseLeave={e => {
                    if (!isCheckingOut) e.currentTarget.style.backgroundColor = "#ffffff";
                  }}
                >
                  {isCheckingOut ? "Procesando…" : "Proceder al pago →"}
                </button>

                {checkoutError && (
                  <p style={{
                    fontFamily: FONT,
                    fontSize: "0.62rem",
                    textAlign: "center",
                    color: "#ff6b6b",
                    letterSpacing: "0.04em",
                    margin: "0 0 0.85rem",
                  }}>
                    {checkoutError}
                  </p>
                )}

                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.58rem",
                  textAlign: "center",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.08em",
                  margin: 0,
                }}>
                  Pago seguro · Tarjeta · Apple Pay · Google Pay
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
