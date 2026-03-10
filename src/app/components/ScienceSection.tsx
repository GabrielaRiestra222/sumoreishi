import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from "recharts";

const comparisonData = [
  { name: "β-glucanos", rokkaku: 45, estándar: 28 },
  { name: "Triterpenos", rokkaku: 15, estándar: 8 },
  { name: "Polisacáridos", rokkaku: 38, estándar: 22 }
];

const bioactiveProfile = [
  { compound: "Ganodérico A", value: 92 },
  { compound: "Ganodérico B", value: 85 },
  { compound: "Lucidénico A", value: 78 },
  { compound: "Polisacáridos", value: 88 },
  { compound: "β-glucanos", value: 95 }
];

export function ScienceSection() {
  return (
    <section className="bg-white py-24 px-4">
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
            Ciencia y datos
          </h2>

          <p className="mt-4 text-sm md:text-base text-[#111]/60">
            Datos obtenidos a partir de análisis de laboratorio y literatura
            científica sobre Ganoderma lucidum.
          </p>
        </motion.div>

        {/* CHARTS */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* BAR CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-sm font-medium text-[#111] mb-6">
              Concentración de compuestos activos (%)
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={comparisonData}>
                <CartesianGrid stroke="#E5E5E5" />
                <XAxis dataKey="name" stroke="#111" fontSize={12} />
                <YAxis stroke="#111" fontSize={12} />
                <Tooltip />
                <Bar dataKey="rokkaku" fill="#111" name="Rokkaku Reishi" />
                <Bar dataKey="estándar" fill="#CCCCCC" name="Promedio mercado" />
              </BarChart>
            </ResponsiveContainer>

            <p className="mt-4 text-xs text-[#111]/50">
              Comparativa basada en análisis de laboratorio independiente.
            </p>
          </motion.div>

          {/* RADAR CHART */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-sm font-medium text-[#111] mb-6">
              Perfil de bioactividad relativa
            </h3>

            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={bioactiveProfile}>
                <PolarGrid stroke="#E5E5E5" />
                <PolarAngleAxis
                  dataKey="compound"
                  fontSize={11}
                  stroke="#111"
                />
                <PolarRadiusAxis domain={[0, 100]} fontSize={10} />
                <Radar
                  dataKey="value"
                  stroke="#111"
                  fill="#111"
                  fillOpacity={0.15}
                />
              </RadarChart>
            </ResponsiveContainer>

            <p className="mt-4 text-xs text-[#111]/50">
              Índice interno de concentración relativa (escala 0–100).
            </p>
          </motion.div>

        </div>

        {/* REFERENCES */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 max-w-4xl"
        >
          <h3 className="text-sm font-medium text-[#111] mb-6">
            Referencias científicas
          </h3>

          <div className="space-y-4 text-sm text-[#111]/70 leading-relaxed">
            <p>
              <strong>β-glucanos:</strong> Evidencia de actividad inmunomoduladora
              descrita en estudios clínicos y preclínicos (Boh et al., 2007;
              Wachtel-Galor et al., 2011).
            </p>

            <p>
              <strong>Triterpenos ganodéricos:</strong> Asociados a propiedades
              antioxidantes y hepatoprotectoras (Sanodiya et al., 2009).
            </p>

            <p>
              <strong>Condiciones de cultivo:</strong> Estudios indican que
              ambientes con CO₂ controlado influyen en la síntesis de metabolitos
              secundarios (Tang et al., 2016).
            </p>

            <p className="pt-4 mt-6 border-t border-[#E5E5E5] text-xs text-[#111]/50">
              Este producto es un suplemento alimenticio. No está destinado a
              diagnosticar, tratar, curar o prevenir ninguna enfermedad.
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
