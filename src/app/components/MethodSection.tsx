import { motion } from "framer-motion";
import { Hexagon, Sprout, FlaskConical, Microscope } from "lucide-react";

const methodSteps = [
  {
    icon: Hexagon,
    title: "Cultivo estructurado",
    description:
      "Sistema de crecimiento con geometría controlada que optimiza la distribución de nutrientes y oxígeno durante el desarrollo del hongo."
  },
  {
    icon: Sprout,
    title: "Condiciones de CO₂ controladas",
    description:
      "Ambiente regulado para favorecer la síntesis de compuestos bioactivos y reducir variaciones inducidas por estrés ambiental."
  },
  {
    icon: FlaskConical,
    title: "Extracción dual estandarizada",
    description:
      "Proceso secuencial acuoso y alcohólico diseñado para preservar polisacáridos y triterpenos de forma consistente."
  },
  {
    icon: Microscope,
    title: "Análisis y trazabilidad",
    description:
      "Cada lote es analizado para microbiología, metales pesados y perfil activo antes del encapsulado."
  }
];

export function MethodSection() {
  return (
    <section className="bg-[#F6F6F6] py-24 px-4">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h2 className="text-2xl md:text-4xl font-semibold text-[#111]">
            Método y proceso
          </h2>

          <p className="mt-4 text-[#111]/60 text-sm md:text-base">
            Desde el cultivo hasta la cápsula, cada etapa se realiza bajo
            condiciones controladas para garantizar consistencia y calidad.
          </p>
        </motion.div>

        {/* STEPS */}
        <div className="
          mt-16
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-4
          gap-12
        ">
          {methodSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              className="flex flex-col gap-4"
            >
              <step.icon
                className="w-5 h-5 text-[#111]/70"
                strokeWidth={1.5}
              />

              <h3 className="text-sm font-medium text-[#111]">
                {step.title}
              </h3>

              <p className="text-sm text-[#111]/60 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
