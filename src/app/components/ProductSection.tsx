import { motion } from 'framer-motion';
import { ShoppingBag, Shield, Leaf } from 'lucide-react';
import productImage from "../../assets/producto.png";

<img src={productImage} alt="Rokkaku Reishi" />

const features = [
  { icon: Leaf, text: "100% Ganoderma lucidum (cuerpo fructífero)" },
  { icon: Shield, text: "Producción certificada GMP. Análisis por lote." },
  { icon: ShoppingBag, text: "60 cápsulas vegetales · 30 días" }
];

export function ProductSection() {
  return (
    <section className="bg-[#F6F6F6] py-24 px-4">
      <div className="max-w-7xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* IMAGE */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex justify-center"
          >
            <div className="w-full max-w-md bg-white">
              <img
                src={productImage}
                alt="Rokkaku Reishi"
                className="w-full object-contain"
              />
            </div>
          </motion.div>

          {/* CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-xl"
          >
            {/* CATEGORY */}
            <p className="text-xs uppercase tracking-widest text-[#111]/50">
              Suplemento alimenticio
            </p>

            {/* TITLE */}
            <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-[#111]">
              Rokkaku Reishi
            </h2>

            {/* DESCRIPTION */}
            <p className="mt-6 text-sm md:text-base text-[#111]/70 leading-relaxed">
              Extracto estandarizado de <em>Ganoderma lucidum</em>, formulado
              para un uso diario consistente. Sin rellenos, sin excipientes
              innecesarios.
            </p>

            {/* FEATURES */}
            <ul className="mt-10 space-y-3">
              {features.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[#111]/70">
                  <item.icon className="w-4 h-4 mt-0.5 text-[#111]/50" />
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>

            {/* CTA */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button className="
                bg-[#111]
                text-white
                px-6
                py-3
                text-sm
                font-medium
                hover:bg-[#000]
                transition
              ">
                Comprar
              </button>

              <button className="
                border
                border-[#111]/20
                text-[#111]
                px-6
                py-3
                text-sm
                hover:border-[#111]
                transition
              ">
                Ver formulación
              </button>
            </div>

            {/* NOTE */}
            <p className="mt-6 text-xs text-[#111]/50">
              Envío gratuito a partir de 50 €.
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
