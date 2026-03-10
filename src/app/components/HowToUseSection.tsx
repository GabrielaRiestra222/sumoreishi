import { motion } from "framer-motion";

export function HowToUseSection() {
  return (
    <section className="bg-white py-28">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[32px] md:text-[44px] font-black tracking-tight mb-12"
        >
          CÓMO TOMARLO
        </motion.h2>

        <div className="max-w-xl mx-auto text-sm text-[#111111]/80 leading-relaxed space-y-4">
          <p>
            Incorpora Sumoreishi a tu rutina diaria como un gesto consciente.
          </p>
          <p>
            Tómalo por la mañana o antes de dormir, acompañado de agua,
            sin prisas.
          </p>
        </div>

      </div>
    </section>
  );
}
