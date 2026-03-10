export function BenefitsSection2() {
  return (
    <section className="w-full bg-[#f5f5f3] text-[#0b0b0b]">
      <div className="max-w-6xl mx-auto px-6 py-28">

        {/* HEADER */}
        <div className="max-w-3xl mb-24">
          <span className="block text-xs tracking-[0.35em] uppercase text-black/50 mb-6">
            Lo esencial
          </span>

          <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-8">
            Beneficios que no se
            <br />
            fuerzan.
          </h2>

          <p className="text-lg text-black/70 leading-relaxed">
            El Reishi no actúa como un estimulante.
            Su valor aparece con el tiempo,
            cuando el cuerpo vuelve a su equilibrio natural.
          </p>
        </div>

        {/* MANIFIESTO */}
        <div className="space-y-20">

          {/* BENEFIT 1 */}
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-medium mb-4">
              Calma profunda
            </h3>
            <p className="text-base leading-relaxed text-black/70">
              Ayuda al sistema nervioso a salir del modo constante
              de alerta y recuperar una sensación de estabilidad
              interna sostenida.
            </p>
          </div>

          {/* BENEFIT 2 */}
          <div className="max-w-2xl ml-auto">
            <h3 className="text-2xl md:text-3xl font-medium mb-4">
              Resiliencia diaria
            </h3>
            <p className="text-base leading-relaxed text-black/70">
              No impulsa picos de energía.
              Refuerza la capacidad del cuerpo
              para adaptarse mejor al estrés físico y mental.
            </p>
          </div>

          {/* BENEFIT 3 */}
          <div className="max-w-2xl">
            <h3 className="text-2xl md:text-3xl font-medium mb-4">
              Equilibrio sostenido
            </h3>
            <p className="text-base leading-relaxed text-black/70">
              El efecto no es inmediato ni artificial.
              Es gradual, acumulativo y coherente
              con los ritmos biológicos naturales.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
