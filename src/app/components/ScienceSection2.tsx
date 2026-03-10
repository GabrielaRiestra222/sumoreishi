export function ScienceSection2() {
  const concerns = [
    {
      title: "Estrés crónico",
      text: "Para personas expuestas a carga mental constante, presión sostenida o fatiga nerviosa prolongada.",
    },
    {
      title: "Sistema inmune debilitado",
      text: "En etapas de defensas bajas, cambios de estación o recuperación física prolongada.",
    },
    {
      title: "Fatiga mental",
      text: "Cuando el foco, la claridad o la energía cognitiva se ven comprometidos por el ritmo diario.",
    },
    {
      title: "Sueño irregular",
      text: "En procesos donde el descanso no es profundo o el ciclo sueño–vigilia está alterado.",
    },
    {
      title: "Envejecimiento celular",
      text: "Como apoyo adaptógeno en rutinas de cuidado integral a largo plazo.",
    },
  ];

  return (
    <section className="relative bg-[#F5F5F3] py-28">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="max-w-3xl mb-20">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-[#111] mb-6">
            Aplicaciones reales
          </h2>
          <p className="text-lg text-[#555] leading-relaxed">
            El Reishi no actúa de forma aislada. Se integra en procesos físicos
            y mentales concretos, acompañando al cuerpo en estados prolongados
            de adaptación.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {concerns.map((item, i) => (
            <div key={i} className="max-w-sm">
              
              {/* Número */}
              <span className="block text-sm text-[#999] mb-3 font-mono">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Título */}
              <h3 className="text-xl font-semibold text-[#111] mb-4">
                {item.title}
              </h3>

              {/* Línea */}
              <div className="h-px w-10 bg-[#ccc] mb-4" />

              {/* Texto */}
              <p className="text-sm leading-relaxed text-[#555]">
                {item.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
