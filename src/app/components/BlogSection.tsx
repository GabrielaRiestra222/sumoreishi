import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { POSTS } from "./BlogPage";

const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

interface DbPost {
  id: string; title: string; slug: string; excerpt?: string;
  category?: string; publishedAt?: string; imageUrl?: string;
}

export function BlogSection() {
  const [dbPosts, setDbPosts] = useState<DbPost[]>([]);

  useEffect(() => {
    fetch("/api/blog/posts")
      .then(r => r.ok ? r.json() : [])
      .then((data: DbPost[]) => setDbPosts(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Mezcla posts de DB (publicados) con los estáticos, dando prioridad a los de DB
  const dbSlugs = new Set(dbPosts.map(p => p.slug));
  const staticPosts = POSTS.filter(p => !dbSlugs.has(p.slug)).slice(0, 3);

  const allPosts = [
    ...dbPosts.slice(0, 3).map(p => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? "",
      date: p.publishedAt ? new Date(p.publishedAt).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" }) : "",
      category: p.category ?? "",
      readTime: "",
    })),
    ...staticPosts.map(p => ({
      slug: p.slug, title: p.title, excerpt: p.excerpt,
      date: p.date, category: p.category, readTime: p.readTime,
    })),
  ].slice(0, 3);

  if (allPosts.length === 0) return null;

  return (
    <section style={{ backgroundColor: "#F0F0EC", padding: "6rem 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1.5rem", flexWrap: "wrap", marginBottom: "3.5rem" }}>
          <div>
            <p style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", marginBottom: "0.5rem" }}>
              Blog
            </p>
            <h2 style={{ fontFamily: FONT, fontWeight: 900, fontSize: "clamp(2rem, 4vw, 3.5rem)", letterSpacing: "-0.04em", textTransform: "uppercase", color: "#1a1a1a", margin: 0 }}>
              Del hongo al<br />
              <span style={{ color: "rgba(0,0,0,0.2)" }}>conocimiento</span>
            </h2>
            <p style={{ fontFamily: FONT, fontSize: "0.82rem", lineHeight: 1.75, color: "rgba(0,0,0,0.48)", maxWidth: "360px", margin: "1.25rem 0 0" }}>
              Guías breves sobre Reishi, evidencia científica y uso diario para comprar con más criterio.
            </p>
          </div>
          <Link
            to="/blog"
            style={{
              fontFamily: FONT,
              fontSize: "0.62rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "#1a1a1a",
              border: "1px solid rgba(0,0,0,0.22)",
              padding: "0.9rem 1.2rem",
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Consulta nuestro blog
          </Link>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          {allPosts.map((post, i) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={`/blog/${post.slug}`} style={{ textDecoration: "none", display: "block" }}>
                <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: "2rem" }}>
                  {post.category && (
                    <p style={{ fontFamily: FONT, fontSize: "0.55rem", letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD, marginBottom: "0.75rem" }}>
                      {post.category}
                    </p>
                  )}
                  <h3 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em", color: "#1a1a1a", marginBottom: "0.75rem", lineHeight: 1.3 }}>
                    {post.title}
                  </h3>
                  <p style={{ fontFamily: FONT, fontSize: "0.75rem", color: "rgba(0,0,0,0.45)", lineHeight: 1.7, marginBottom: "1rem" }}>
                    {post.excerpt}
                  </p>
                  <p style={{ fontFamily: FONT, fontSize: "0.58rem", color: "rgba(0,0,0,0.25)", letterSpacing: "0.08em" }}>
                    {post.date}{post.readTime && ` · ${post.readTime}`}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
