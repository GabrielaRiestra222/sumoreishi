import { motion } from "framer-motion";

export function AboutSection() {
  return (
    <section className="bg-white py-24 px-4">
      <div className="max-w-5xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >

          {/* TITLE */}
          <h2 className="
            text-2xl
            md:text-4xl
            font-semibold
            tracking-tight
            text-[#111]
          ">
            Qué es Rokkaku Reishi
          </h2>

          {/* SUBLINE */}
          <p className="
            mt-4
            text-sm
            md:text-base
            text-[#111]/60
            max-w-xl
          ">
            Un suplemento de Ganoderma lucidum cultivado bajo protocolos controlados
            para maximizar consistencia, pureza y biodisponibilidad.
          </p>

          {/* CONTENT */}
          <div className="
            mt-12
            space-y-6
            text-base
            md:text-lg
            leading-relaxed
            text-[#111]/80
            max-w-3xl
          ">
            <p>
              <span className="font-medium text-[#111]">
                六角霊芝 (Rokkaku Reishi)
              </span>{" "}
              es una forma estandarizada de <em>Ganoderma lucidum</em>, un hongo
              funcional ampliamente estudiado por su perfil de polisacáridos y
              triterpenos.
            </p>

            <p>
              Nuestro método de cultivo utiliza una estructura hexagonal
              controlada que optimiza el desarrollo del micelio y el cuerpo
              fructífero, reduciendo variaciones y contaminantes.
            </p>

            <p>
              El resultado es un extracto en cápsulas con composición estable,
              trazable y diseñado para un uso diario consistente.
            </p>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
