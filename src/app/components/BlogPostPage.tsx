import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { POSTS } from "./BlogPage";

const FONT_TITLE = '"Manrope","Inter","Helvetica Now",sans-serif';
const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';
const GOLD = "#c9a84c";

const CONTENT: Record<string, { sections: { title?: string; body: string }[] }> = {
  "que-es-el-reishi": {
    sections: [
      { body: "El Ganoderma lucidum — conocido popularmente como Reishi — es un hongo de la familia Ganodermataceae que crece de forma natural en troncos de árboles caducifolios en Asia. Su aspecto es inconfundible: una superficie lacada de color rojo-marrón brillante, con forma de riñón o abanico." },
      { title: "2.000 años de historia", body: "Los primeros registros escritos del uso del Reishi datan del siglo I a.C. en China, en el Shennong Bencao Jing, uno de los tratados de medicina tradicional más antiguos del mundo. Se clasificaba como una sustancia de la categoría más alta — superior incluso al ginseng — y se reservaba para emperadores y la élite.\n\nEn Japón, el hongo se conoce como Mannentake, que significa literalmente «el hongo de los 10.000 años». Era tan escaso y apreciado que durante siglos solo podía ser cultivado de forma silvestre, lo que lo hacía prácticamente inaccesible para la mayoría de la población." },
      { title: "Qué contiene realmente", body: "El Reishi debe su actividad biológica a más de 400 compuestos identificados. Los más estudiados son:\n\n— Polisacáridos beta-glucanos: modulan la respuesta inmune\n— Triterpenos (ganodéricos): más de 100 tipos distintos, con actividad antiinflamatoria y adaptógena\n— Peptidoglucanos: contribuyen a la actividad inmunomoduladora\n— Esteroles: precursores de vitamina D\n\nLa clave está en la fuente: el cuerpo fructífero (la parte visible del hongo) concentra la mayor parte de estos compuestos. El micelio — que es lo que usan la mayoría de marcas baratas — tiene una concentración mucho menor, especialmente cuando se cultiva en sustratos de arroz." },
      { title: "Reishi silvestre vs extracto", body: "El Reishi silvestre de alta calidad es extremadamente difícil de encontrar y carísimo. La alternativa legítima es el extracto de cuerpo fructífero cultivado bajo condiciones controladas, con un proceso de extracción que garantiza la concentración de los compuestos activos.\n\nUn extracto 30:1 significa que se necesitan 30 gramos de hongo fresco para obtener 1 gramo de extracto. Es la diferencia entre un suplemento que hace algo y uno que no hace nada." },
      { title: "Por qué importa la procedencia", body: "No todos los extractos son iguales. La mayoría de los suplementos del mercado usan micelio cultivado en arroz — una práctica económica que resulta en un producto con bajo contenido en beta-glucanos y alto contenido en almidón.\n\nLa forma de distinguirlos es simple: busca en la etiqueta «cuerpo fructífero completo» y el ratio de extracción. Si no lo especifica, probablemente no lo tengas." },
    ]
  },
  "beneficios-ganoderma-lucidum": {
    sections: [
      { body: "La evidencia científica sobre el Reishi ha crecido exponencialmente en los últimos 20 años. Con más de 2.000 estudios publicados, es uno de los hongos medicinales más investigados del mundo. Esto es lo que sabemos — y lo que no sabemos." },
      { title: "Sistema inmune", body: "Los beta-glucanos del Reishi son los compuestos más estudiados en relación con el sistema inmune. Actúan como moduladores — no como estimulantes puros — lo que los hace especialmente interesantes: activan el sistema inmune cuando está deprimido y lo regulan cuando está sobreactivado.\n\nEstudios clínicos han mostrado un aumento en la actividad de células NK (Natural Killer) y macrófagos con suplementación regular de extracto de Reishi en dosis de 1–3g diarios." },
      { title: "Adaptógeno y estrés", body: "Los triterpenos ganodéricos tienen propiedades adaptógenas documentadas: ayudan al organismo a gestionar el estrés fisiológico y psicológico. Modulan el eje HPA (hipotálamo-hipófisis-adrenal), reduciendo los niveles de cortisol en situaciones de estrés crónico.\n\nEsto no significa que el Reishi cure el estrés — significa que puede ayudar al cuerpo a manejar mejor sus efectos a nivel hormonal." },
      { title: "Sueño y recuperación", body: "Varios estudios en humanos han asociado la suplementación con extracto de Reishi con una mejora en la calidad del sueño, particularmente en personas con insomnio leve o trastornos del sueño relacionados con el estrés.\n\nEl mecanismo parece estar relacionado con la regulación del sistema nervioso autónomo y la modulación de neurotransmisores como la serotonina." },
      { title: "Estrés oxidativo", body: "El Reishi tiene una actividad antioxidante significativa, con capacidad para neutralizar radicales libres tanto en sistemas acuosos como lipídicos. Los polisacáridos y triterpenos contribuyen a esta actividad de forma sinérgica.\n\nEn contextos de ejercicio físico intenso o exposición a contaminantes, esto puede traducirse en una recuperación más rápida y menor daño celular acumulado." },
      { title: "Lo que la ciencia no dice", body: "Es importante ser honestos: muchos estudios son in vitro o en modelos animales. La extrapolación directa a humanos no siempre es válida. Los efectos documentados en humanos son reales, pero modestos — el Reishi no es un medicamento ni un tratamiento para ninguna enfermedad.\n\nEs un adaptógeno con una acumulación sólida de evidencia sobre su seguridad y sus efectos moduladores. Eso, en el contexto del bienestar a largo plazo, es suficientemente relevante." },
    ]
  },
  "como-tomar-reishi": {
    sections: [
      { body: "La mayoría de personas que no ven resultados con el Reishi cometen el mismo error: dosis insuficiente, producto de baja calidad o expectativas incorrectas. Esta guía va al grano." },
      { title: "Dosis recomendada", body: "La dosis efectiva estudiada en la mayoría de ensayos clínicos se sitúa entre 1 y 3 gramos diarios de extracto de cuerpo fructífero.\n\nCon nuestras cápsulas de 500mg, esto equivale a 2–6 cápsulas diarias. Para comenzar, 2 cápsulas (1g) es una dosis de inicio razonable. Si buscas efectos más pronunciados en sistema inmune o recuperación, 4 cápsulas (2g) es el rango óptimo." },
      { title: "Momento del día", body: "No hay un momento universalmente ideal, pero sí recomendaciones según el objetivo:\n\n— Mañana en ayunas: máxima absorción, ideal si buscas efectos adaptógenos y energía sostenida\n— Con el desayuno: si tienes el estómago sensible, reduce posibles molestias digestivas\n— Noche: si tu objetivo principal es mejorar la calidad del sueño\n\nLo más importante es la consistencia. Tómalo siempre a la misma hora." },
      { title: "Duración del ciclo", body: "El Reishi no es un suplemento de efecto inmediato. Los estudios que muestran resultados significativos en humanos van de 4 a 12 semanas de uso continuado.\n\nRecomendamos:\n— Mínimo: 4 semanas para evaluar cualquier efecto\n— Óptimo: 8–12 semanas de ciclo continuo\n— Descanso: algunos protocolos sugieren 2–4 semanas de descanso entre ciclos, aunque no hay evidencia sólida de que sea necesario" },
      { title: "Con qué combinarlo", body: "El Reishi se combina bien con otros adaptógenos. Las combinaciones con evidencia científica más sólida:\n\n— Reishi + Vitamina C: puede potenciar la absorción de polisacáridos\n— Reishi + Magnesio (por la noche): sinergia interesante para el sueño y la recuperación\n— Reishi + Lion's Mane: combinación popular para función cognitiva y sistema nervioso\n\nEvita tomarlo con anticoagulantes o inmunosupresores sin consultar a un médico." },
      { title: "Señales de que está funcionando", body: "El Reishi no se siente como la cafeína. Sus efectos son graduales y subtiles:\n\n— Semanas 1–2: posible mejora en la calidad del sueño\n— Semanas 3–4: sensación de mayor resistencia al estrés, menos agotamiento mental\n— Semanas 6–8: efectos más consolidados en sistema inmune y recuperación general\n\nSi no notas nada tras 8 semanas con una dosis de 2g diarios, revisa la calidad del producto que estás usando." },
    ]
  }
};

const sectionStyle = {
  fontFamily: FONT,
  fontSize: "0.88rem",
  lineHeight: 1.9,
  color: "rgba(0,0,0,0.6)",
  margin: "0 0 1.5rem",
  whiteSpace: "pre-line" as const,
};

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const post = POSTS.find(p => p.slug === slug);
  const content = slug ? CONTENT[slug] : null;

  if (!post || !content) {
    return (
      <div style={{ backgroundColor: "#f5f5f3", minHeight: "100vh", paddingTop: "100px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontFamily: FONT, color: "rgba(0,0,0,0.4)" }}>Artículo no encontrado.</p>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#f5f5f3", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "4rem 2rem 8rem" }}>

        {/* Back */}
        <Link to="/blog" style={{ fontFamily: FONT, fontSize: "0.65rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(0,0,0,0.3)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", marginBottom: "3rem" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Blog
        </Link>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <span style={{ fontFamily: FONT, fontSize: "0.58rem", letterSpacing: "0.16em", textTransform: "uppercase", color: GOLD }}>{post.category}</span>
            <span style={{ fontFamily: FONT, fontSize: "0.58rem", color: "rgba(0,0,0,0.3)" }}>{post.date} · {post.readTime} de lectura</span>
          </div>

          <h1 style={{ fontFamily: FONT_TITLE, fontWeight: 900, fontSize: "clamp(1.8rem, 4vw, 2.8rem)", letterSpacing: "-0.04em", color: "#0e0e0e", margin: "0 0 3rem", lineHeight: 1.1 }}>
            {post.title}
          </h1>

          <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "3rem" }}>
            {content.sections.map((section, i) => (
              <div key={i} style={{ marginBottom: "2.5rem" }}>
                {section.title && (
                  <h2 style={{ fontFamily: FONT_TITLE, fontWeight: 800, fontSize: "1.1rem", letterSpacing: "-0.02em", color: "#0e0e0e", margin: "0 0 0.75rem" }}>
                    {section.title}
                  </h2>
                )}
                <p style={sectionStyle}>{section.body}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: "3rem", marginTop: "2rem" }}>
            <p style={{ fontFamily: FONT, fontSize: "0.75rem", color: "rgba(0,0,0,0.4)", marginBottom: "1.5rem" }}>
              ¿Listo para probarlo?
            </p>
            <a href="/#purchase" style={{
              display: "inline-block",
              fontFamily: FONT,
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "#ffffff",
              backgroundColor: "#0e0e0e",
              padding: "0.9rem 2rem",
              textDecoration: "none",
            }}>
              Ver producto →
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}