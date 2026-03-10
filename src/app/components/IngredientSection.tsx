import ingredientImg from "../../assets/producto.png";

export function IngredientSection() {
  return (
    <section className="w-full bg-[#f5f5f3]">
      <div className="grid grid-cols-1 md:grid-cols-2">

        {/* IMAGEN */}
        <div className="relative h-[60vh] md:h-auto md:min-h-[85vh]">
          <img
            src={ingredientImg}
            alt="Ganoderma lucidum"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* TEXTO */}
        <div className="flex items-center py-20 md:py-0">
          <div className="max-w-xl px-8 md:px-16">
            <h2
              className="
                text-[48px]
                md:text-[80px]
                font-black
                leading-[0.95]
                mb-8
                text-[#1a1a1a]
              "
            >
              EL INGREDIENTE
            </h2>

            <div className="h-px w-20 bg-[#1a1a1a]/20 mb-8" />

            <p className="text-xl font-medium text-[#1a1a1a]/70 leading-relaxed">
              Ganoderma lucidum.
              <br />
              Cuerpo fructífero completo.
            </p>

            <p className="mt-6 text-base text-[#1a1a1a]/60 leading-relaxed">
              Cultivado lentamente en su entorno natural y procesado
              sin alterar su estructura original. Sin rellenos.
              Sin atajos.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
