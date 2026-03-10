import { motion } from "framer-motion";

const items = [
  {
    title: "TRADICIÓN MILENARIA",
    text: "El Reishi ha sido utilizado durante siglos en la medicina tradicional asiática como hongo adaptógeno."
  },
  {
    title: "CIENCIA MODERNA",
    text: "Cultivo controlado, extracción precisa y estandarización de compuestos bioactivos."
  },
  {
    title: "PUREZA ABSOLUTA",
    text: "Sin aditivos. Sin rellenos. Solo cuerpo fructífero completo."
  }
];

export function ValueSection() {
  return (
    <section className="bg-[#F5F5F3] py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
            >
              <h3 className="text-xs tracking-[0.25em] uppercase text-[#111111]/60 mb-4">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[#111111]/80">
                {item.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
