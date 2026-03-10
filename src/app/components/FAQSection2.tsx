
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    q: "¿Cuándo empezaré a notar los efectos?",
    a: "El Reishi actúa de forma acumulativa. Algunas personas notan cambios en el descanso y el estrés en 7–14 días. Los beneficios profundos se perciben con uso continuado."
  },
  {
    q: "¿Puedo tomarlo a diario?",
    a: "Sí. Está formulado para un uso diario prolongado. No genera dependencia ni tolerancia."
  },
  {
    q: "¿Tiene efectos estimulantes?",
    a: "No. No es un estimulante. Ayuda al cuerpo a regular su respuesta al estrés sin provocar picos de energía."
  },
  {
    q: "¿Es compatible con otros suplementos?",
    a: "En general sí. Si estás bajo tratamiento médico o tomas medicación, recomendamos consultar con un profesional."
  },
  {
    q: "¿Para quién no está recomendado?",
    a: "No recomendado durante embarazo o lactancia sin supervisión médica."
  },
  
  {
    q: "¿Cómo debo tomar el Sumo Reishi?",
    a: "El Sumo Reishi está pensado para un uso diario y constante. Recomendamos tomarlo una vez al día, preferiblemente por la mañana o al mediodía, con agua o junto a una comida ligera. No es un estimulante y no genera picos de energía.Se recomienda tomar 6 cápsulas al día, de golpe por la mañana o dividiendo por la mañana y tarde. Preferiblemente 30min antes de las comidas. En caso de toma de niños, consúltanos."
  },
  {
    q: "¿Qué pasa si un día olvido tomarlo?",
    a: "No ocurre nada. El Reishi actúa de forma acumulativa. Simplemente continúa al día siguiente con tu toma habitual. La clave está en la constancia, no en la perfección."
  },
  {
    q: "¿Cuánto tiempo tarda en notarse el efecto?",
    a: "Depende de cada persona. Algunas notan mejoras en el descanso o la gestión del estrés en las primeras 1–2 semanas. Los beneficios más profundos suelen percibirse con un uso continuado de varias semanas."
  },
  {
    q: "¿Tiene efectos secundarios?",
    a: "El Reishi es generalmente bien tolerado. En casos poco frecuentes pueden aparecer molestias digestivas leves al inicio. Si estás embarazada, en periodo de lactancia o bajo tratamiento médico, consulta con un profesional."
  },
  {
    q: "¿Cuál es la diferencia entre el Sumo Reishi y otros tipos de Reishi?",
    a: "El Reishi Rokkaku se considera superior al Reishi convencional porque contiene hasta 5 veces más nutrientes y β-glucanos, que favorecen el sistema inmune. Esto se debe a que el Reishi rokkaku conserva su forma sin abrir el sombrero, lo que permite que concentre más energía y componentes beneficiosos."
  },
];

export function FAQSection2() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="bg-[#F5F5F3] py-32">
      <div className="max-w-3xl mx-auto px-6">

        {/* TARJETA */}
        <div className="bg-[#0e0e0e] text-white rounded-2xl p-10 md:p-14 shadow-2xl">

          <h2 className="text-2xl md:text-3xl font-medium mb-10">
            Preguntas frecuentes
          </h2>

          <div className="divide-y divide-white/10">
            {faqs.map((item, i) => {
              const isOpen = open === i;

              return (
                <div key={i} className="py-6">
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex justify-between items-center text-left"
                  >
                    <span className="text-sm md:text-base font-light">
                      {item.q}
                    </span>

                    <span className="ml-4 text-white/60">
                      {isOpen ? "–" : "+"}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-sm text-white/70 leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
