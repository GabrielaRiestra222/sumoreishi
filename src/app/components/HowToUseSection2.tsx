import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const steps = [
  {
    number: "01",
    title: "Una cápsula\nal día",
    body: "La consistencia es lo que transforma un gesto en resultado.",
    detail: "500mg · Extracto 30:1",
  },
  {
    number: "02",
    title: "Con\ncomida",
    body: "Mañana o noche, lo que encaje en tu rutina diaria.",
    detail: "Preferiblemente por la mañana",
  },
  {
    number: "03",
    title: "Constancia,\nno prisa",
    body: "Los primeros efectos se notan entre 2 y 4 semanas.",
    detail: "Mínimo 8 semanas recomendadas",
  },
];

export function HowToUseSection2() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section style={{ backgroundColor: "#E8E8E4", color: "#1a1a1a", padding: isMobile ? "4rem 0 3rem" : "6rem 0 5rem" }}>

      {/* EYEBROW */}
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{
          textAlign: "center",
          fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
          fontSize: "0.6rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.35)",
          marginBottom: isMobile ? "2.5rem" : "4rem",
        }}
      >
        Modo de uso
      </motion.p>

      {/* TÍTULO GRANDE CENTRAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ textAlign: "center", marginBottom: isMobile ? "3.5rem" : "6rem", padding: "0 1.5rem" }}
      >
        <h2
          style={{
            fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
            fontWeight: 900,
            fontSize: isMobile ? "clamp(3rem, 14vw, 5rem)" : "clamp(5rem, 10vw, 9rem)",
            lineHeight: 0.9,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
            color: "#1a1a1a",
            margin: 0,
          }}
        >
          Cómo
          <br />
          <span style={{ color: "rgba(0,0,0,0.18)" }}>tomarlo</span>
        </h2>
      </motion.div>

      {/* STEPS */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile ? "0 1.5rem" : "0 2.5rem",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)",
          gap: isMobile ? "2.5rem" : "0",
        }}
      >
        {steps.map((step, i) => (
          <motion.div
            key={step.number}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.15 }}
            style={{
              padding: isMobile ? "0" : "0 3rem",
              borderLeft: !isMobile && i > 0 ? "1px solid rgba(0,0,0,0.1)" : "none",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem",
            }}
          >
            {/* Número grande */}
            <span
              style={{
                fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                fontWeight: 900,
                fontSize: isMobile ? "5rem" : "7rem",
                lineHeight: 1,
                letterSpacing: "-0.06em",
                color: "rgba(0,0,0,0.08)",
                display: "block",
                marginBottom: "-0.5rem",
              }}
            >
              {step.number}
            </span>

            {/* Título */}
            <h3
              style={{
                fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                fontWeight: 800,
                fontSize: isMobile ? "1.9rem" : "clamp(1.6rem, 2.5vw, 2.2rem)",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                margin: 0,
                lineHeight: 1.05,
                whiteSpace: "pre-line",
              }}
            >
              {step.title}
            </h3>

            {/* Body */}
            <p
              style={{
                fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                fontSize: "0.85rem",
                lineHeight: 1.7,
                color: "rgba(0,0,0,0.5)",
                margin: 0,
              }}
            >
              {step.body}
            </p>

            {/* Tag */}
            <span
              style={{
                display: "inline-block",
                padding: "0.4rem 0.8rem",
                backgroundColor: "rgba(0,0,0,0.07)",
                fontSize: "0.6rem",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.4)",
                fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                alignSelf: "flex-start",
                borderRadius: "2px",
              }}
            >
              {step.detail}
            </span>
          </motion.div>
        ))}
      </div>

    </section>
  );
}