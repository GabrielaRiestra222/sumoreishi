import ingredientImg from "../../assets/producto.png";

export function IngredientSection2() {
  return (
    <section className="w-full bg-[#F5F5F3]">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[80vh] ">
        
        {/* IMAGEN */}
        <div className="relative w-full h-[50vh] md:h-auto">
          <img
            src={ingredientImg}
            alt="Reishi — ingrediente"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* TEXTO */}
        <div className="flex items-center">
          <div className="max-w-xl px-6 md:px-16 py-16">
            <span className="block text-xs tracking-[0.35em] uppercase text-neutral-500 mb-6">
              El ingrediente
            </span>

            <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-8 text-[#0e0e0e]">
              Ganoderma lucidum.
              <br />
              Reishi auténtico.
            </h2>

            <p className="text-lg leading-relaxed text-neutral-700 mb-6">
              Utilizamos exclusivamente el cuerpo fructífero completo del
              hongo Reishi, cultivado lentamente en su entorno natural.Un hongo extraordinario, cultivado con precisión japonesa y distribuido exclusivamente en Europa.
            </p>

            <p className="text-base leading-relaxed text-neutral-600">
              Sin micelio industrial. Sin rellenos. Sin atajos.
              Solo el ingrediente que la tradición ha valorado
              durante siglos.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
