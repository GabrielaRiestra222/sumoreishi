import ingredientImg from "../../assets/0bfe49d587842b89deb7d5ec1f9048e2.jpg";

export function ProductInfo() {
  return (
    <section className="w-full bg-[#F5F5F3]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh]">

        {/* IMAGEN (arriba en mobile, derecha en desktop) */}
        <div className="relative w-full h-[50vh] md:h-auto md:order-2">
          <img
            src={ingredientImg}
            alt="Reishi — ingrediente"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* TEXTO */}
        <div className="flex items-center md:order-1">
          <div className="max-w-xl px-6 md:px-16 py-16">
            <span className="block text-xs tracking-[0.35em] uppercase text-neutral-500 mb-6">
              Nuestro producto
            </span>

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-8 text-[#0e0e0e]">
              SUMO REISHI
              <br />
              El auténtico.
            </h2>

            <p className="text-sm text-black/60 leading-relaxed max-w-md">
              Extracto completo de Ganoderma lucidum, cultivado lentamente
              y procesado sin comprometer su integridad.
            </p>

            <ul className="mt-10 space-y-3 text-sm text-black/80">
              <li>— 60 cápsulas vegetales</li>
              <li>— Extracto estandarizado</li>
              <li>— Alta biodisponibilidad</li>
            </ul>

            <a
              href="#purchase"
              className="
                inline-block mt-12
                border border-[#111111]
                px-8 py-3
                text-xs tracking-[0.2em] uppercase
                hover:bg-[#111111] hover:text-white
                transition
              "
            >
              Comprar
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
