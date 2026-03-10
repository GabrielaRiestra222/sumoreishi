import bg1 from "../../assets/reishi-hero-1.jpg";
import bg2 from "../../assets/reishi-hero-2.jpg";
import bg3 from "../../assets/reishi-hero-3.jpg";
import bg4 from "../../assets/reishi-hero-4.jpg";
import bg5 from "../../assets/reishi-hero-5.jpg";
import bg6 from "../../assets/reishi-hero-6.jpg";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";

const backgrounds = [bg1, bg2, bg3, bg4, bg5, bg6];
const SLIDE_DURATION = 12000;

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startInterval = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setIndex((prev) => (prev + 1) % backgrounds.length);
    }, SLIDE_DURATION);
  };

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const goToSlide = (i: number) => {
    setIndex(i);
    startInterval();
  };

  const slideLabel = String(index + 1).padStart(2, "0");
  const totalLabel = String(backgrounds.length).padStart(2, "0");

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;1,300;1,400&family=Archivo:wght@300;400&display=swap"
        rel="stylesheet"
      />

      <section className="relative min-h-screen overflow-hidden bg-black">

        {/* ── BACKGROUND ── */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.div
              key={index}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1.0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2.4, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ willChange: "opacity, transform" }}
            >
              <img
                src={backgrounds[index]}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: "brightness(0.68) contrast(1.05)" }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Vignette radial sutil */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.52) 100%)",
            }}
          />
          {/* Gradiente lateral izquierda */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.08) 55%, transparent 100%)",
            }}
          />
          {/* Gradiente inferior */}
          <div
            className="absolute bottom-0 inset-x-0 h-56 pointer-events-none"
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)",
            }}
          />
        </div>

        {/* ── NÚMERO VERTICAL — derecha ── */}
        <div
          className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3"
          style={{ zIndex: 20 }}
        >
          <motion.span
            key={slideLabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.4)",
              writingMode: "vertical-rl",
            }}
          >
            {slideLabel}
          </motion.span>
          <div
            style={{
              width: "1px",
              height: "44px",
              backgroundColor: "rgba(255,255,255,0.12)",
            }}
          />
          <span
            style={{
              fontFamily: "'Archivo', sans-serif",
              fontSize: "0.6rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.18)",
              writingMode: "vertical-rl",
            }}
          >
            {totalLabel}
          </span>
        </div>

        {/* ── CONTENT ── */}
        <div className="relative z-10 min-h-screen flex flex-col">

          {/* Texto — anclado al fondo */}
          <div className="flex-1 flex items-end">
            <div className="max-w-7xl mx-auto px-8 md:px-16 w-full pb-28 md:pb-36">
              <div className="max-w-2xl">

                {/* Eyebrow */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2, duration: 1.2 }}
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontSize: "0.6rem",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.38)",
                    marginBottom: "1.75rem",
                    margin: "0 0 1.75rem 0",
                  }}
                >
                  Ganoderma lucidum · Extracto 30:1
                </motion.p>

                {/* Título serif italic */}
                <motion.h1
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 300,
                    fontStyle: "italic",
                    fontSize: "clamp(68px, 12vw, 152px)",
                    lineHeight: 0.9,
                    letterSpacing: "-0.01em",
                    color: "#ffffff",
                    margin: 0,
                  }}
                >
                  Sumo<br />Reishi
                </motion.h1>

                {/* Claim */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.65, duration: 1.1 }}
                  style={{
                    fontFamily: "'Archivo', sans-serif",
                    fontWeight: 300,
                    fontSize: "0.72rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.42)",
                    marginTop: "2rem",
                    margin: "2rem 0 0 0",
                  }}
                >
                  El hongo de la inmortalidad
                </motion.p>

                {/* CTA único — underline style */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 1 }}
                  style={{ marginTop: "2.75rem" }}
                >
                  <a
                    href="#purchase"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.9rem",
                      fontFamily: "'Archivo', sans-serif",
                      fontWeight: 300,
                      fontSize: "0.68rem",
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.75)",
                      textDecoration: "none",
                      paddingBottom: "5px",
                      borderBottom: "1px solid rgba(255,255,255,0.22)",
                      transition: "color 0.4s, border-color 0.4s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "#ffffff";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "rgba(255,255,255,0.75)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.22)";
                    }}
                  >
                    Descubrir el producto
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                    >
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </a>
                </motion.div>

              </div>
            </div>
          </div>

          {/* ── BOTTOM BAR ── */}
          <div
            className="relative z-10 max-w-7xl mx-auto px-8 md:px-16 w-full pb-8 flex items-center justify-between"
          >
            {/* Rating sin iconos */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.9 }}
              style={{
                fontFamily: "'Archivo', sans-serif",
                fontWeight: 300,
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.25)",
                margin: 0,
              }}
            >
              5.0 — 3.200 clientes en Europa
            </motion.p>

            {/* Dots minimalistas */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.9 }}
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              {backgrounds.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  style={{
                    width: i === index ? "32px" : "4px",
                    height: "1px",
                    backgroundColor:
                      i === index
                        ? "rgba(255,255,255,0.6)"
                        : "rgba(255,255,255,0.18)",
                    border: "none",
                    padding: 0,
                    cursor: "pointer",
                    transition: "all 0.5s ease",
                  }}
                  aria-label={`Imagen ${i + 1}`}
                />
              ))}
            </motion.div>
          </div>

        </div>
      </section>
    </>
  );
}