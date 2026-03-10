import { useRef } from "react";
import { motion, useInView } from "framer-motion";

import stressImg from "../../assets/concern-stress.jpg";
import sleepImg from "../../assets/concern-sleep.jpg";
import focusImg from "../../assets/concern-focus.jpg";
import immuneImg from "../../assets/concern-immune.jpg";

const FONT_TITLE = '"Manrope","Inter","Helvetica Now",sans-serif';
const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

const concerns = [
  { title: "Estrés crónico", img: stressImg, stat: "68%", statLabel: "de adultos lo reportan", improvement: "Mejora en 3–4 semanas" },
  { title: "Sueño irregular", img: sleepImg, stat: "1/3", statLabel: "no duerme bien", improvement: "Primeros cambios en 2 semanas" },
  { title: "Fatiga mental", img: focusImg, stat: "4x", statLabel: "más común post-pandemia", improvement: "Claridad sostenida sin picos" },
  { title: "Sistema inmune débil", img: immuneImg, stat: "↓40%", statLabel: "actividad NK sin adaptógenos", improvement: "Modulación progresiva" },
];

const comparison = [
  { label: "Materia prima", other: "Micelio industrial", sumo: "Cuerpo fructífero completo" },
  { label: "Extracción", other: "Genérica · baja concentración", sumo: "Extracción lenta en agua" },
  { label: "Transparencia", other: "Etiquetas opacas", sumo: "Trazabilidad total" },
  { label: "Concentración", other: "Sin especificar", sumo: "Extracto 30:1 · 500mg" },
  { label: "Efecto", other: "Estimulante", sumo: "Adaptógeno real" },
];

export function BenefitsScienceSection2() {
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const inView1 = useInView(ref1, { once: true, margin: "-80px" });
  const inView2 = useInView(ref2, { once: true, margin: "-80px" });
  const inView3 = useInView(ref3, { once: true, margin: "-80px" });

  return (
    <section style={{ backgroundColor: "#F5F5F3", overflow: "hidden" }}>

      {/* ── BLOQUE 1: HERO COPY ── */}
      <div ref={ref1} style={{ maxWidth: "1200px", margin: "0 auto", padding: "8rem 2rem 6rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "end" }}
          className="benefits-hero-grid">

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <span style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: "1.5rem" }}>
              Por qué funciona
            </span>
            <h2 style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: "clamp(2.5rem, 5vw, 4rem)", letterSpacing: "-0.04em", lineHeight: 1.0, color: "#0e0e0e", margin: 0 }}>
              No es un<br />
              estimulante.<br />
              <span style={{ color: "rgba(0,0,0,0.18)" }}>Es un aliado.</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView1 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.15 }}
            style={{ paddingBottom: "0.5rem" }}
          >
            {[
              { num: "01", text: "Apoya la respuesta natural al estrés sin forzar al cuerpo." },
              { num: "02", text: "Equilibra el sistema inmune de forma progresiva y sostenida." },
              { num: "03", text: "Resultados acumulativos. Sin picos. Sin dependencia." },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                animate={inView1 ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                style={{ display: "flex", gap: "1.5rem", alignItems: "flex-start", padding: "1.5rem 0", borderBottom: "1px solid rgba(0,0,0,0.07)" }}
              >
                <span style={{ fontFamily: FONT, fontSize: "0.6rem", color: GOLD, letterSpacing: "0.1em", paddingTop: "0.15rem", flexShrink: 0 }}>
                  {item.num}
                </span>
                <p style={{ fontFamily: FONT, fontSize: "0.85rem", lineHeight: 1.75, color: "rgba(0,0,0,0.55)", margin: 0 }}>
                  {item.text}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── BLOQUE 2: SOCIAL PROOF + CONCERNS ── */}
      <div ref={ref2} style={{ backgroundColor: "#0e0e0e", padding: "6rem 0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 2rem" }}>

          {/* Header con prueba social */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView2 ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            style={{ marginBottom: "4rem" }}
          >
            <span style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: "1.25rem" }}>
              Lo que notan nuestros clientes
            </span>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "end" }}
              className="concerns-header-grid">

              <h3 style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.04em", color: "#ffffff", margin: 0, lineHeight: 1.05 }}>
                +3.200 personas<br />
                <span style={{ color: "rgba(255,255,255,0.2)" }}>han notado</span><br />
                una diferencia real.
              </h3>

              {/* Stats 2x2 */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", backgroundColor: "rgba(255,255,255,0.04)" }}>
                {[
                  { num: "87%", label: "notó mejora en el sueño en las primeras 2 semanas" },
                  { num: "92%", label: "repetiría la compra según encuesta post-pedido" },
                  { num: "4.9★", label: "valoración media verificada en más de 800 reseñas" },
                  { num: "30d", label: "garantía de devolución sin preguntas ni condiciones" },
                ].map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={inView2 ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                    style={{ padding: "1.5rem", backgroundColor: "#0e0e0e" }}
                  >
                    <p style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: "1.8rem", letterSpacing: "-0.05em", color: GOLD, margin: "0 0 0.35rem", lineHeight: 1 }}>
                      {s.num}
                    </p>
                    <p style={{ fontFamily: FONT, fontSize: "0.62rem", color: "rgba(255,255,255,0.3)", margin: 0, lineHeight: 1.6, letterSpacing: "0.02em" }}>
                      {s.label}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Grid fotos */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: "rgba(255,255,255,0.04)" }}
            className="concerns-grid">
            {concerns.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView2 ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                style={{ position: "relative", overflow: "hidden", backgroundColor: "#0e0e0e", cursor: "default" }}
              >
                <div style={{ position: "relative", aspectRatio: "3/4", overflow: "hidden" }}>
                  <img
                    src={item.img}
                    alt={item.title}
                    style={{ width: "100%", height: "100%", objectFit: "cover", filter: "grayscale(30%) brightness(0.7)", transition: "transform 0.6s ease, filter 0.4s ease" }}
                    className="concern-img"
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.1) 55%, transparent 100%)" }}/>
                  <div style={{ position: "absolute", top: "1.25rem", left: "1.25rem" }}>
                    <span style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: "1.6rem", color: GOLD, letterSpacing: "-0.04em", lineHeight: 1, display: "block" }}>
                      {item.stat}
                    </span>
                    <span style={{ fontFamily: FONT, fontSize: "0.55rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                      {item.statLabel}
                    </span>
                  </div>
                  <div style={{ position: "absolute", bottom: "1.25rem", left: "1.25rem", right: "1.25rem" }}>
                    <p style={{ fontFamily: FONT, fontWeight: 600, fontSize: "0.78rem", color: "#ffffff", margin: "0 0 0.35rem", letterSpacing: "0.04em" }}>
                      {item.title}
                    </p>
                    <p style={{ fontFamily: FONT, fontSize: "0.6rem", color: GOLD, margin: 0, letterSpacing: "0.06em" }}>
                      {item.improvement}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>

      {/* ── BLOQUE 3: COMPARACIÓN ── */}
      <div ref={ref3} style={{ maxWidth: "1200px", margin: "0 auto", padding: "8rem 2rem" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView3 ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "6rem", alignItems: "start" }}
          className="comparison-grid"
        >
          <div style={{ position: "sticky", top: "100px" }}>
            <span style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: "1rem" }}>
              Comparación honesta
            </span>
            <h3 style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: "clamp(1.8rem, 3vw, 2.5rem)", letterSpacing: "-0.04em", lineHeight: 1.05, color: "#0e0e0e", margin: "0 0 1.5rem" }}>
              No todos los<br />
              <span style={{ color: "rgba(0,0,0,0.2)" }}>Reishi son</span><br />
              iguales.
            </h3>
            <p style={{ fontFamily: FONT, fontSize: "0.75rem", lineHeight: 1.8, color: "rgba(0,0,0,0.4)", margin: 0 }}>
              La mayoría de marcas usan micelio en arroz. Nosotros usamos cuerpo fructífero completo. La diferencia es real.
            </p>
          </div>

          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "0.75rem" }}>
              <span style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.25)" }}></span>
              <span style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(0,0,0,0.25)" }}>Otros</span>
              <span style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase", color: GOLD }}>Sumo Reishi</span>
            </div>

            {comparison.map((row, i) => (
              <motion.div
                key={row.label}
                initial={{ opacity: 0, x: 20 }}
                animate={inView3 ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "1.25rem 0", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "rgba(0,0,0,0.02)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: "rgba(0,0,0,0.4)", alignSelf: "center" }}>{row.label}</span>
                <span style={{ fontFamily: FONT, fontSize: "0.72rem", color: "rgba(0,0,0,0.25)", textDecoration: "line-through", alignSelf: "center" }}>{row.other}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div style={{ width: "4px", height: "4px", borderRadius: "50%", backgroundColor: GOLD, flexShrink: 0 }}/>
                  <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: "0.72rem", color: "#0e0e0e" }}>{row.sumo}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .benefits-hero-grid { grid-template-columns: 1fr 1fr; }
        .concerns-header-grid { grid-template-columns: 1fr 1fr; }
        .concerns-grid { grid-template-columns: repeat(4, 1fr); }
        .comparison-grid { grid-template-columns: 1fr 2fr; }
        .concern-img:hover { transform: scale(1.04); filter: grayscale(0%) brightness(0.8) !important; }
        @media (max-width: 900px) {
          .benefits-hero-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
          .concerns-header-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }
          .concerns-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .comparison-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
        }
      `}</style>
    </section>
  );
}