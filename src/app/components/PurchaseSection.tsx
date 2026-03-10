import { motion } from "framer-motion";

export function PurchaseSection() {
  return (
    <section id="purchase" className="bg-white py-24 px-4">
      <div className="max-w-3xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs uppercase tracking-widest text-[#111]/50">
            Compra
          </p>

          <h2 className="mt-2 text-2xl md:text-3xl font-semibold text-[#111]">
            Rokkaku Reishi
          </h2>

          <p className="mt-4 text-sm md:text-base text-[#111]/60">
            Extracto estandarizado de <em>Ganoderma lucidum</em> formulado para
            un uso diario consistente.
          </p>
        </motion.div>

        {/* CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-12 border border-[#E5E5E5]"
        >
          <div className="p-6 md:p-8 space-y-6">

            {/* PRICE */}
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-[#111]/60">
                60 cápsulas · 30 días
              </span>
              <span className="text-2xl font-semibold text-[#111]">
                39 €
              </span>
            </div>

            {/* OPTIONS */}
            <div className="space-y-3">

              {/* SUBSCRIPTION */}
              <label className="
                flex
                items-start
                gap-3
                border
                border-[#111]
                p-4
                cursor-pointer
              ">
                <input type="radio" name="purchase" defaultChecked />
                <div>
                  <p className="text-sm font-medium text-[#111]">
                    Suscripción mensual
                  </p>
                  <p className="text-xs text-[#111]/60">
                    Entrega automática · Cancela cuando quieras
                  </p>
                </div>
                <span className="ml-auto text-sm font-medium">
                  35 €
                </span>
              </label>

              {/* ONE TIME */}
              <label className="
                flex
                items-start
                gap-3
                border
                border-[#E5E5E5]
                p-4
                cursor-pointer
              ">
                <input type="radio" name="purchase" />
                <div>
                  <p className="text-sm font-medium text-[#111]">
                    Compra única
                  </p>
                  <p className="text-xs text-[#111]/60">
                    Sin compromiso
                  </p>
                </div>
                <span className="ml-auto text-sm font-medium">
                  39 €
                </span>
              </label>
            </div>

            {/* CTA */}
            <button className="
              w-full
              mt-6
              bg-[#111]
              text-white
              py-3
              text-sm
              font-medium
              hover:bg-black
              transition
            ">
              Añadir al carrito
            </button>

            {/* INFO */}
            <div className="pt-4 border-t border-[#E5E5E5] space-y-2">
              <p className="text-xs text-[#111]/60">
                Envío gratuito a partir de 50 €.
              </p>
              <p className="text-xs text-[#111]/60">
                Cápsulas vegetales. Sin rellenos ni excipientes.
              </p>
            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
