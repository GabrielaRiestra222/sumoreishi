import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function ContactSection() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "" });
  const [sent, setSent] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (!form.nombre || !form.email) return;
    setSent(true);
  };

  const fields = [
    { name: "nombre", label: "Nombre", type: "text", placeholder: "Tu nombre" },
    { name: "email", label: "Email", type: "email", placeholder: "tu@email.com" },
    { name: "telefono", label: "Teléfono", type: "tel", placeholder: "+34 600 000 000" },
  ];

  return (
    <section style={{ backgroundColor: "#F0F0EC", color: "#1a1a1a" }}>

      {/* TICKER */}
      <div style={{ borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "1.1rem 0", overflow: "hidden" }}>
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: "-50%" }}
          transition={{ repeat: Infinity, repeatType: "loop", duration: 30, ease: "linear" }}
          style={{
            whiteSpace: "nowrap",
            display: "flex",
            fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
            fontSize: "0.55rem",
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(0,0,0,0.25)",
          }}
        >
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} style={{ marginRight: "3rem" }}>
              Contacto · Sumo Reishi · Escríbenos ·
            </span>
          ))}
        </motion.div>
      </div>

      {/* GRID */}
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: isMobile ? "3rem 1.5rem 4rem" : "5rem 2.5rem 6rem",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
          gap: isMobile ? "3rem" : "6rem",
          alignItems: "start",
        }}
      >

        {/* IZQUIERDA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <span
            style={{
              display: "block",
              fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
              fontSize: "0.58rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.3)",
              marginBottom: isMobile ? "1.5rem" : "2rem",
            }}
          >
            Contacto
          </span>

          <h2
            style={{
              fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
              fontWeight: 900,
              fontSize: isMobile ? "clamp(2.5rem, 12vw, 4rem)" : "clamp(3rem, 5vw, 5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.04em",
              textTransform: "uppercase",
              margin: "0 0 2rem 0",
              color: "#1a1a1a",
            }}
          >
            ¿Tienes<br />
            <span style={{ color: "rgba(0,0,0,0.2)" }}>alguna</span><br />
            pregunta?
          </h2>

          <p
            style={{
              fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
              fontSize: "0.82rem",
              lineHeight: 1.75,
              color: "rgba(0,0,0,0.45)",
              maxWidth: "300px",
              margin: "0 0 2.5rem 0",
            }}
          >
            Respondemos en menos de 24 horas. Sin formularios eternos, sin bots.
          </p>

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "1.75rem" }}>
            <p style={{
              fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
              fontSize: "0.58rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(0,0,0,0.25)",
              margin: "0 0 0.4rem 0",
            }}>
              Email directo
            </p>
            <p style={{
              fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
              fontSize: "0.82rem",
              color: "#1a1a1a",
              margin: 0,
            }}>
              hola@sumoreishi.com
            </p>
          </div>
        </motion.div>

        {/* DERECHA — formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: isMobile ? 0 : 0.15 }}
        >
          {!sent ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              {fields.map((field, i) => (
                <div
                  key={field.name}
                  style={{
                    borderBottom: "1px solid",
                    borderBottomColor: focused === field.name ? "rgba(0,0,0,0.55)" : "rgba(0,0,0,0.12)",
                    paddingTop: i > 0 ? "1.75rem" : "0",
                    paddingBottom: "1.25rem",
                    transition: "border-color 0.3s",
                  }}
                >
                  <label style={{
                    display: "block",
                    fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                    fontSize: "0.58rem",
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    color: focused === field.name ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0.3)",
                    marginBottom: "0.55rem",
                    transition: "color 0.3s",
                  }}>
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name as keyof typeof form]}
                    onChange={handleChange}
                    onFocus={() => setFocused(field.name)}
                    onBlur={() => setFocused(null)}
                    placeholder={field.placeholder}
                    style={{
                      width: "100%",
                      background: "transparent",
                      border: "none",
                      outline: "none",
                      fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                      fontSize: isMobile ? "1.1rem" : "1.05rem",
                      fontWeight: 500,
                      color: "#1a1a1a",
                      letterSpacing: "-0.01em",
                      padding: 0,
                      caretColor: "#1a1a1a",
                    }}
                  />
                </div>
              ))}

              <button
                onClick={handleSubmit}
                style={{
                  marginTop: "2.5rem",
                  padding: "1rem 2rem",
                  backgroundColor: "transparent",
                  color: "#1a1a1a",
                  border: "1px solid rgba(0,0,0,0.25)",
                  fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                  fontSize: "0.62rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  alignSelf: "flex-start",
                  width: isMobile ? "100%" : "auto",
                  transition: "background 0.3s, color 0.3s",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.backgroundColor = "#1a1a1a";
                  e.currentTarget.style.color = "#F0F0EC";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#1a1a1a";
                }}
              >
                Enviar mensaje
              </button>

              <p style={{
                marginTop: "1rem",
                fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                fontSize: "0.58rem",
                color: "rgba(0,0,0,0.22)",
                letterSpacing: "0.04em",
              }}>
                Tus datos no serán compartidos con terceros.
              </p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p style={{
                fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                fontSize: "0.58rem",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                color: "rgba(0,0,0,0.35)",
                marginBottom: "1rem",
              }}>
                Mensaje enviado
              </p>
              <h3 style={{
                fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                fontWeight: 800,
                fontSize: "2rem",
                letterSpacing: "-0.03em",
                textTransform: "uppercase",
                color: "#1a1a1a",
                margin: "0 0 1rem 0",
                lineHeight: 1.1,
              }}>
                Gracias,<br />{form.nombre}.
              </h3>
              <p style={{
                fontFamily: '"Helvetica Neue","Helvetica","Arial",sans-serif',
                fontSize: "0.8rem",
                color: "rgba(0,0,0,0.45)",
                lineHeight: 1.7,
              }}>
                Te contestamos en menos de 24h en {form.email}.
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </section>
  );
}