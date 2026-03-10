import { motion } from "framer-motion";

const faqs = [
  {
    q: "¿Qué es el Reishi?",
    a: "El Reishi es un hongo medicinal utilizado tradicionalmente en Asia por sus propiedades adaptógenas."
  },
  {
    q: "¿Cómo se toma?",
    a: "Se recomienda tomar una o dos cápsulas al día, preferiblemente con comida."
  },
  {
    q: "¿Es apto para uso diario?",
    a: "Sí, el Reishi es conocido por su uso continuado y progresivo."
  },
  {
    q: "¿Tiene efectos secundarios?",
    a: "En general es bien tolerado. Si tienes dudas, consulta con un profesional."
  }
];

export function FAQSection() {
  return (
    <section className="bg-[#F5F5F3] py-32">
      <div className="max-w-5xl mx-auto px-6">

        <h2 className="text-[36px] md:text-[48px] font-black tracking-tight mb-16">
          PREGUNTAS FRECUENTES
        </h2>

        <div className="space-y-10">
          {faqs.map((item, i) => (
            <motion.div
              key={item.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.05 }}
              className="border-t border-[#111111]/20 pt-6"
            >
              <h3 className="text-sm font-semibold mb-2">
                {item.q}
              </h3>
              <p className="text-sm text-[#111111]/70 leading-relaxed">
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
