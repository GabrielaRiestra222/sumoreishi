import { motion } from "framer-motion";
import productImage from "../../assets/reishi-hero-6.jpg"; // cápsulas o pack

export function ProductInfo() {
  return (
    <section className="bg-white py-32">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

        {/* TEXT */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2
            className="text-[40px] md:text-[56px] font-black tracking-tight mb-8"
            style={{ fontFamily: '"Manrope","Inter",sans-serif' }}
          >
            ROKKAKU REISHI
          </h2>

          <div className="space-y-4 text-sm text-[#111111]/80 leading-relaxed">
            <p>
              Suplemento de Reishi (Ganoderma lucidum) elaborado exclusivamente
              a partir del cuerpo fructífero completo.
            </p>
            <p>
              Sin aditivos, sin rellenos, sin ingredientes innecesarios.
            </p>
          </div>

          <ul className="mt-10 space-y-3 text-sm">
            <li>— 60 cápsulas vegetales</li>
            <li>— Extracto estandarizado</li>
            <li>— Alta biodisponibilidad</li>
          </ul>

          <a
            href="#purchase"
            className="
              inline-block mt-12
              border border-[#111111]
              px-8 py-3
              text-xs tracking-[0.2em] uppercase
              hover:bg-[#111111] hover:text-white
              transition
            "
          >
            Comprar
          </a>
        </motion.div>

        {/* IMAGE */}
        <motion.img
          src={productImage}
          alt="Sumoreishi cápsulas"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9 }}
          className="w-full max-w-md mx-auto"
        />

      </div>
    </section>
  );
}
