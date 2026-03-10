import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const FONT_TITLE = '"Manrope","Inter","Helvetica Now",sans-serif';
const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

export const POSTS = [
  {
    slug: "que-es-el-reishi",
    title: "Qué es el Reishi y por qué lleva 2.000 años en la medicina tradicional",
    excerpt: "El Ganoderma lucidum es mucho más que un hongo. Descubre por qué las culturas asiáticas lo han utilizado durante milenios y qué dice la ciencia moderna.",
    date: "3 marzo 2026",
    readTime: "5 min",
    category: "Ingrediente",
  },
  {
    slug: "beneficios-ganoderma-lucidum",
    title: "Beneficios del Ganoderma lucidum respaldados por la ciencia",
    excerpt: "Más de 400 compuestos bioactivos. Revisamos la evidencia científica actual sobre el Reishi: sistema inmune, estrés oxidativo, sueño y mucho más.",
    date: "5 marzo 2026",
    readTime: "7 min",
    category: "Ciencia",
  },
  {
    slug: "como-tomar-reishi",
    title: "Cómo tomar Reishi correctamente para obtener resultados reales",
    excerpt: "Dosis, momento del día, duración del ciclo, combinaciones. Todo lo que necesitas saber para sacar el máximo partido al extracto de Reishi.",
    date: "7 marzo 2026",
    readTime: "6 min",
    category: "Guía",
  },
];

export function BlogPage() {
  return (
    <div style={{ backgroundColor: "#f5f5f3", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "4rem 2rem 8rem" }}>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", color: GOLD, display: "block", marginBottom: "1rem" }}>
            Blog
          </span>
          <h1 style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: "clamp(2rem, 5vw, 3.5rem)", letterSpacing: "-0.04em", color: "#0e0e0e", margin: "0 0 4rem", lineHeight: 1.05 }}>
            Conocimiento<br />
            <span style={{ color: "rgba(0,0,0,0.2)" }}>sin filtros.</span>
          </h1>
        </motion.div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {POSTS.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/blog/${post.slug}`}
                style={{ textDecoration: "none", display: "block" }}
              >
                <div
                  style={{
                    padding: "2.5rem 0",
                    borderBottom: "1px solid rgba(0,0,0,0.08)",
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: "2rem",
                    alignItems: "start",
                    transition: "padding-left 0.3s",
                    cursor: "pointer",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.paddingLeft = "1rem")}
                  onMouseLeave={e => (e.currentTarget.style.paddingLeft = "0")}
                >
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.75rem" }}>
                      <span style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD }}>
                        {post.category}
                      </span>
                      <span style={{ fontFamily: FONT, fontSize: "0.58rem", color: "rgba(0,0,0,0.3)", letterSpacing: "0.08em" }}>
                        {post.date} · {post.readTime}
                      </span>
                    </div>
                    <h2 style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: "clamp(1.1rem, 2.5vw, 1.5rem)", letterSpacing: "-0.03em", color: "#0e0e0e", margin: "0 0 0.75rem", lineHeight: 1.2 }}>
                      {post.title}
                    </h2>
                    <p style={{ fontFamily: FONT, fontSize: "0.78rem", lineHeight: 1.75, color: "rgba(0,0,0,0.45)", margin: 0 }}>
                      {post.excerpt}
                    </p>
                  </div>
                  <div style={{ paddingTop: "0.25rem", color: "rgba(0,0,0,0.2)", flexShrink: 0 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}