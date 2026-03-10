import { ProductSelector } from "./ProductSelector";

export function PurchaseSection2() {
  return (
    <section className="w-full bg-[#0b0b0b] text-white">
      <div className="max-w-6xl mx-auto px-6 py-32">

        {/* HEADER */}
        <div className="max-w-3xl mb-20">
          <span className="block text-xs tracking-[0.35em] uppercase text-white/50 mb-6">
            Compra directa
          </span>
          <h2 className="text-4xl md:text-5xl font-semibold leading-tight mb-8">
            Rokkaku Reishi
          </h2>
          <p className="text-lg text-white/70 leading-relaxed">
            Extracto de cuerpo fructífero completo.
            Sin aditivos. Sin rellenos.
            Elaborado con respeto al ingrediente.
          </p>
        </div>

        {/* PRODUCT CARD */}
        <div className="max-w-4xl bg-white text-black rounded-sm p-10 md:p-14">
          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* INFO */}
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-medium mb-2">Cápsulas de Reishi</h3>
                <p className="text-sm text-black/60">60 cápsulas · 500 mg por cápsula</p>
              </div>
              <ul className="space-y-4 text-sm text-black/70">
                <li>• Cuerpo fructífero completo</li>
                <li>• Extracción lenta y controlada</li>
                <li>• Sin excipientes artificiales</li>
                <li>• Cultivo responsable</li>
              </ul>
              <div className="pt-6 border-t border-black/10">
                <span className="block text-sm text-black/50 mb-1">Desde</span>
                <span className="text-3xl font-medium">32 €</span>
              </div>
            </div>

            {/* SELECTOR CON CARRITO */}
            <div>
              <ProductSelector />
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
