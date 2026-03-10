import { motion } from "framer-motion";

const cards = [
  {
    number: "01",
    title: "Cultivo consciente",
    body: "Crece lentamente, en condiciones controladas, sin forzar ciclos ni acelerar procesos.",
  },
  {
    number: "02",
    title: "Extracción íntegra",
    body: "Conservamos el espectro completo de polisacáridos y triterpenos activos.",
  },
  {
    number: "03",
    title: "Sin compromisos",
    body: "Sin micelio industrial, sin rellenos, sin fórmulas diluidas.",
  },
];

export function ValueDarkSection2() {
  return (
    <section className="w-full bg-[#0b0b0b] text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-8 md:px-12 py-32 md:py-40">

        {/* HEADER — dos columnas editorial */}
        <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-end mb-24 md:mb-32">

          {/* Izquierda — título grande */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <span className="block text-[0.6rem] tracking-[0.3em] uppercase text-white/35 mb-8">
              Nuestra filosofía
            </span>
            <h2
              style={{
                fontFamily: '"Manrope","Inter","Helvetica Now",sans-serif',
                fontWeight: 800,
                fontSize: "clamp(2.8rem, 6vw, 5rem)",
                lineHeight: 0.92,
                letterSpacing: "-0.04em",
              }}
            >
              No todos<br />
              los Reishi<br />
              <span style={{ color: "rgba(255,255,255,0.25)" }}>son iguales.</span>
            </h2>
          </motion.div>

          {/* Derecha — cuerpo + línea decorativa */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex flex-col justify-end gap-8"
          >
            <div
              style={{
                width: "1px",
                height: "80px",
                backgroundColor: "rgba(255,255,255,0.1)",
              }}
            />
            <p
              style={{
                fontSize: "1rem",
                lineHeight: 1.75,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 300,
                maxWidth: "380px",
              }}
            >
              El valor de un ingrediente no está en lo que promete,
              sino en cómo se cultiva, se extrae y se respeta.
            </p>
          </motion.div>
        </div>

        {/* CARDS — grid con hover */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
          {cards.map((card, i) => (
            <motion.div
              key={card.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.12 }}
              className="group relative bg-[#0b0b0b] p-10 md:p-12 flex flex-col gap-10 cursor-default"
              style={{ transition: "background 0.4s ease" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#111111")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#0b0b0b")
              }
            >
              {/* Número */}
              <span
                style={{
                  fontFamily: '"Manrope","Inter",sans-serif',
                  fontSize: "0.6rem",
                  letterSpacing: "0.25em",
                  color: "rgba(255,255,255,0.2)",
                }}
              >
                {card.number}
              </span>

              {/* Línea decorativa que crece en hover */}
              <div
                className="group-hover:w-12 transition-all duration-500"
                style={{
                  width: "24px",
                  height: "1px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              />

              {/* Contenido */}
              <div className="flex flex-col gap-4 flex-1">
                <h3
                  style={{
                    fontFamily: '"Manrope","Inter",sans-serif',
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    letterSpacing: "-0.02em",
                    color: "#ffffff",
                  }}
                >
                  {card.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.85rem",
                    lineHeight: 1.75,
                    color: "rgba(255,255,255,0.45)",
                    fontWeight: 300,
                  }}
                >
                  {card.body}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
