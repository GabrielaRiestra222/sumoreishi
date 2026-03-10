import { motion } from "framer-motion";

const benefits = [
  "Equilibrio diario y adaptación al estrés",
  "Apoyo al sistema inmunológico",
  "Vitalidad sostenida sin estimulación artificial",
  "Claridad mental y bienestar general"
];

export function BenefitsSection() {
  return (
    <section className="bg-white py-28">
      <div className="max-w-6xl mx-auto px-6">
        
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-[32px] md:text-[48px] font-black tracking-tight mb-12"
          style={{ fontFamily: '"Manrope","Inter",sans-serif' }}
        >
          BENEFICIOS
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8">
          {benefits.map((b, i) => (
            <motion.div
              key={b}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="border-l border-[#111111]/20 pl-6"
            >
              <p className="text-[#111111]/80 text-sm leading-relaxed">
                {b}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
