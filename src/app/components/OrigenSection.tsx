import { useRef } from "react";
import { motion, useInView } from "framer-motion";

const FONT_TITLE = '"Manrope","Inter","Helvetica Now",sans-serif';
const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

export function OrigenSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} style={{ backgroundColor: "#0b0b0b", overflow: "hidden" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "8rem 2rem" }}>

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{
            display: "block",
            fontFamily: FONT,
            fontSize: "0.6rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: GOLD,
            marginBottom: "2rem",
          }}
        >
          Origen
        </motion.span>

        {/* Layout dos columnas */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "6rem",
          alignItems: "center",
        }}
        className="origen-grid"
        >
          {/* Texto */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              style={{
                fontFamily: FONT_TITLE,
                fontWeight: 900,
                fontSize: "clamp(2.2rem, 4vw, 3.5rem)",
                letterSpacing: "-0.04em",
                lineHeight: 1.05,
                color: "#ffffff",
                margin: "0 0 2.5rem",
              }}
            >
              Nace en las<br />
              <span style={{ color: "rgba(255,255,255,0.2)" }}>montañas de</span><br />
              Japón.
            </motion.h2>

            {[
              {
                title: "Ganoderma lucidum",
                body: "El Reishi lleva más de 2.000 años en la medicina tradicional japonesa y china. Se le conoce como el «hongo de la inmortalidad» — no por casualidad."
              },
              {
                title: "Extracto 30:1",
                body: "Necesitamos 30 gramos de hongo fresco para obtener 1 gramo de extracto. Ningún atajo, ningún compromiso. Solo la concentración máxima del cuerpo fructífero completo."
              },
              {
                title: "Sin rellenos",
                body: "La mayoría de suplementos contienen micelio cultivado en arroz. El nuestro no. Solo cuerpo fructífero real, sin excipientes artificiales, sin maltodextrina, sin nada que no sea Reishi."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                style={{
                  marginBottom: "1.75rem",
                  paddingLeft: "1.25rem",
                  borderLeft: `1px solid rgba(255,255,255,0.08)`,
                }}
              >
                <p style={{
                  fontFamily: FONT,
                  fontWeight: 700,
                  fontSize: "0.7rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  color: GOLD,
                  margin: "0 0 0.4rem",
                }}>{item.title}</p>
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.82rem",
                  lineHeight: 1.8,
                  color: "rgba(255,255,255,0.45)",
                  margin: 0,
                }}>{item.body}</p>
              </motion.div>
            ))}
          </div>

          {/* Stats visuales */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ display: "flex", flexDirection: "column", gap: "1px", backgroundColor: "rgba(255,255,255,0.04)" }}
          >
            {[
              { num: "2.000", unit: "años", label: "de uso medicinal documentado" },
              { num: "30:1", unit: "", label: "ratio de concentración del extracto" },
              { num: "500", unit: "mg", label: "por cápsula de cuerpo fructífero puro" },
              { num: "3.200", unit: "+", label: "clientes satisfechos en Europa" },
            ].map((stat, i) => (
              <div
                key={i}
                style={{
                  padding: "2rem 2.5rem",
                  backgroundColor: "#0b0b0b",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.35rem",
                  transition: "background 0.3s",
                  cursor: "default",
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#141414")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#0b0b0b")}
              >
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.3rem" }}>
                  <span style={{
                    fontFamily: FONT_TITLE,
                    fontWeight: 900,
                    fontSize: "2.8rem",
                    letterSpacing: "-0.05em",
                    color: "#ffffff",
                    lineHeight: 1,
                  }}>{stat.num}</span>
                  {stat.unit && (
                    <span style={{ fontFamily: FONT, fontSize: "0.9rem", color: GOLD, fontWeight: 600 }}>
                      {stat.unit}
                    </span>
                  )}
                </div>
                <p style={{
                  fontFamily: FONT,
                  fontSize: "0.65rem",
                  letterSpacing: "0.08em",
                  color: "rgba(255,255,255,0.3)",
                  margin: 0,
                  textTransform: "uppercase",
                }}>{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <style>{`
        .origen-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 768px) { .origen-grid { grid-template-columns: 1fr !important; gap: 3rem !important; } }
      `}</style>
    </section>
  );
}