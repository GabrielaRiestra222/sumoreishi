import stressImg from "../../assets/concern-stress.jpg";
import sleepImg from "../../assets/concern-sleep.jpg";
import focusImg from "../../assets/concern-focus.jpg";
import immuneImg from "../../assets/concern-immune.jpg";

const concerns = [
  { title: "Estrés crónico", img: stressImg },
  { title: "Sueño irregular", img: sleepImg },
  { title: "Fatiga mental", img: focusImg },
  { title: "Sistema inmune débil", img: immuneImg },
];

export function BenefitsScienceSection2() {
  return (
    <section className="bg-[#F5F5F3] py-24">
      <div className="max-w-7xl mx-auto px-6 space-y-24">

        {/* 1. SUMO BENEFICIOS */}
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-6">
            SUMO BENEFICIOS
          </h2>

          <div className="space-y-4 text-sm text-black/70 leading-relaxed">
            <p>No es un estimulante. No fuerza al cuerpo.</p>

            <p>
              Apoya la respuesta natural al estrés,  
              el equilibrio del sistema inmune  
              y la claridad mental sostenida.
            </p>

            <p>
              Resultados acumulativos.  
              Sin picos. Sin dependencia.
            </p>
          </div>
        </div>

        {/* 2. PREOCUPACIONES COMUNES */}
        <div>
          <h3 className="text-xl font-medium mb-2">
            Preocupaciones comunes
          </h3>
          <p className="text-sm text-black/60 max-w-xl mb-8">
            Estados frecuentes asociados al estrés crónico y al desequilibrio del sistema nervioso.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {concerns.map((item) => (
              <div key={item.title} className="space-y-3">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full aspect-square object-cover transition-opacity duration-300 hover:opacity-90"
                />
                <p className="text-sm text-black/80">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. COMPARACIÓN HONESTA */}
        <div>
          <h3 className="text-xl font-medium mb-2">
            Comparación honesta
          </h3>
          <p className="text-sm text-black/60 mb-8">
            Diferencias reales entre formulaciones.
          </p>

          <div className="border border-black/10 divide-y divide-black/10">
            {[
              ["Materia prima", "Micelio industrial", "Cuerpo fructífero completo"],
              ["Extracción", "Genérica / baja concentración", "Extracción lenta en agua"],
              ["Transparencia", "Etiquetas opacas", "Trazabilidad total"],
              ["Efecto", "Estimulante", "Adaptógeno real"],
            ].map(([label, other, sumo]) => (
              <div
                key={label}
                className="grid grid-cols-3 text-sm"
              >
                <div className="p-4 text-black/60">
                  {label}
                </div>
                <div className="p-4 text-black/40">
                  {other}
                </div>
                <div className="p-4 font-medium bg-black/5">
                  {sumo}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
