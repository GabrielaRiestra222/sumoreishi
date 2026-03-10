import { useEffect, useRef } from "react";

const items = [
  "Envío gratis a partir de 65€",
  "Garantía 30 días",
  "+3.200 clientes en Europa",
  "Pago seguro Redsys",
  "100% natural · Sin aditivos",
  "Extracto 30:1 · Cuerpo fructífero completo",
  "Envío en 48–72h",
];

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

// Triple para loop infinito suave
const ticker = [...items, ...items, ...items];

export function TrustBanner() {
  return (
    <div style={{
      backgroundColor: "#0e0e0e",
      borderTop: "1px solid rgba(255,255,255,0.06)",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      overflow: "hidden",
      padding: "0.9rem 0",
      position: "relative",
    }}>
      {/* Fade izquierda */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "60px",
        background: "linear-gradient(to right, #0e0e0e, transparent)",
        zIndex: 2, pointerEvents: "none",
      }}/>
      {/* Fade derecha */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "60px",
        background: "linear-gradient(to left, #0e0e0e, transparent)",
        zIndex: 2, pointerEvents: "none",
      }}/>

      {/* Track animado */}
      <div style={{
        display: "flex",
        width: "max-content",
        animation: "trust-ticker 30s linear infinite",
      }}>
        {ticker.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "1rem",
              paddingRight: "2.5rem",
              fontFamily: FONT,
              fontSize: "clamp(0.55rem, 1.5vw, 0.65rem)",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.5)",
              whiteSpace: "nowrap",
            }}
          >
            {item}
            <span style={{ color: GOLD, fontSize: "0.35rem", flexShrink: 0 }}>◆</span>
          </span>
        ))}
      </div>

      <style>{`
        @keyframes trust-ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }
        @media (prefers-reduced-motion: reduce) {
          div[style*="trust-ticker"] { animation: none; }
        }
      `}</style>
    </div>
  );
}