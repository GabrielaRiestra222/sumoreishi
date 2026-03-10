import { useState } from "react";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "./CartContext";

export function Header() {
  const [open, setOpen] = useState(false);
  const { count, openCart } = useCart();

  const links = [
    { label: "Sobre", href: "#about" },
    { label: "Método", href: "#method" },
    { label: "Ciencia", href: "#science" },
    { label: "Producto", href: "#product" },
    { label: "Origen", href: "#origin" },
  ];

  return (
    <>
      {/* TOP BAR */}
      <header className="
        fixed top-0 left-0 right-0 z-50
        h-[64px]
        bg-black/60
        backdrop-blur
        border-b border-white/10
      ">
        <nav className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          <span className="text-white text-xs tracking-[0.18em] uppercase">
            SUMOREISHI
          </span>

          <div className="flex items-center gap-5">
            {/* Carrito */}
            <button
              onClick={openCart}
              className="relative text-white flex items-center"
              aria-label="Abrir carrito"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
              {count > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{
                    position: "absolute",
                    top: "-6px",
                    right: "-7px",
                    backgroundColor: "#c9a84c",
                    color: "#000000",
                    fontSize: "0.55rem",
                    fontWeight: 700,
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    letterSpacing: 0,
                  }}
                >
                  {count}
                </motion.span>
              )}
            </button>

            {/* Menú */}
            <button onClick={() => setOpen(true)} className="text-white">
              <Menu size={18} />
            </button>
          </div>
        </nav>
      </header>

      {/* FULLSCREEN MENU */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col"
          >
            {/* Close */}
            <div className="absolute top-6 right-6">
              <button onClick={() => setOpen(false)}>
                <X size={24} className="text-white" />
              </button>
            </div>

            {/* Nav */}
            <div className="flex-1 flex flex-col items-center justify-center space-y-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="text-white text-[36px] md:text-[48px] font-semibold tracking-[-0.03em]"
                  style={{ fontFamily: '"Inter","Helvetica Now","Neue Haas Grotesk",sans-serif' }}
                >
                  {l.label}
                </motion.a>
              ))}
            </div>

            {/* Footer CTA */}
            <div className="pb-12 flex justify-center">
              <a
                href="#purchase"
                onClick={() => setOpen(false)}
                className="text-white text-sm uppercase tracking-wide border border-white/30 px-8 py-3"
              >
                Tienda
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}