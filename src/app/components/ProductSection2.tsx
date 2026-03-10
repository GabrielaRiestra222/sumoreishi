import product1 from "../../assets/product-pack-3.jpg";
import product1Hand from "../../assets/product-hand-3.jpg";
import product2 from "../../assets/product-pack-1.jpg";
import product2Hand from "../../assets/product-hand-1.jpg";
import product3 from "../../assets/product-pack-10.jpg";
import product3Hand from "../../assets/product-hand-10.jpg";
import { useCart, PRODUCTS } from "./CartContext";

const products = [
  {
    id: "3-pack",
    title: "Nuestra opción más elegida",
    subtitle: "Más cantidad, mejor precio y bienestar sostenido en el tiempo.",
    format: "3 unidades",
    price: "82,00 €",
    image: product1,
    imageHover: product1Hand,
    featured: true,
    cta: "Comprar ahora",
  },
  {
    id: "1-unit",
    title: "Sumo Reishi Original",
    subtitle: "Perfecto para quienes quieren iniciarse y descubrir los beneficios del Reishi japonés.",
    format: "1 ud · 60 cápsulas",
    price: "32,00 €",
    image: product2,
    imageHover: product2Hand,
    featured: false,
    cta: "Añadir al carrito",
  },
  {
    id: "10-pack",
    title: "Combo Vita",
    subtitle: "Formato ahorro máximo: perfecto para disfrutar y compartir con familia o amigos.",
    format: "10 + 1 unidades",
    price: "272,00 €",
    image: product3,
    imageHover: product3Hand,
    featured: false,
    cta: "Añadir al carrito",
  },
];

export function ProductSection2() {
  const { addItem } = useCart();

  const handleAdd = (productId: string) => {
    const cartProduct = PRODUCTS.find(p => p.id === productId);
    if (cartProduct) addItem(cartProduct);
  };

  return (
    <section className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">
            Elige tu formato
          </h2>
          <p className="text-black/60 text-sm">
            Mismo Reishi. Distintas formas de integrarlo en tu rutina.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((product) => (
            <div
              key={product.id}
              className="group border-t border-black/10 pt-8 flex flex-col min-h-[560px] relative"
            >
              {/* Badge */}
              {product.featured && (
                <span className="absolute top-0 left-0 -translate-y-1/2 bg-black text-white text-[10px] tracking-widest uppercase px-3 py-1">
                  Más elegido
                </span>
              )}

              {/* Imagen */}
              <div className="relative aspect-square mb-6 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover transition-opacity duration-300 md:group-hover:opacity-0"
                />
                <img
                  src={product.imageHover}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 md:group-hover:opacity-100"
                />
              </div>

              {/* Contenido */}
              <div className="flex-1 flex flex-col space-y-3">
                <h3 className="font-medium text-lg">{product.title}</h3>
                <p className="text-sm text-black/60 leading-relaxed">{product.subtitle}</p>
                <p className="text-xs uppercase tracking-wide text-black/40">{product.format}</p>
                <p className="text-lg font-medium">{product.price}</p>
              </div>

              {/* Botón */}
              <button
                onClick={() => handleAdd(product.id)}
                className="mt-6 w-full border border-black py-3 text-xs uppercase tracking-widest transition hover:bg-black hover:text-white"
              >
                {product.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}