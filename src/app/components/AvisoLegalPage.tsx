const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';

export function AvisoLegalPage() {
  return (
    <div style={{ backgroundColor: "#f5f5f3", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 2rem 8rem" }}>
        <span style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c" }}>
          Legal
        </span>
        <h1 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "2.5rem", letterSpacing: "-0.03em", margin: "1rem 0 3rem", color: "#0e0e0e" }}>
          Aviso Legal
        </h1>

        {[
          {
            title: "1. Datos identificativos",
            body: `En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información (LSSI), se informa:\n\nDenominación social: Sumo Reishi\nEmail de contacto: hola@sumoreishi.com\nDominio: sumoreishi.com`
          },
          {
            title: "2. Objeto y ámbito de aplicación",
            body: `El presente Aviso Legal regula el acceso y uso del sitio web sumoreishi.com, cuya titularidad corresponde a Sumo Reishi. El acceso al sitio implica la aceptación de las presentes condiciones.`
          },
          {
            title: "3. Propiedad intelectual e industrial",
            body: `Todos los contenidos del sitio web (textos, imágenes, diseño, logotipos) son propiedad de Sumo Reishi o se dispone de licencia para su uso. Queda prohibida su reproducción, distribución o comunicación pública sin autorización expresa.`
          },
          {
            title: "4. Exclusión de responsabilidad",
            body: `Sumo Reishi no se responsabiliza de los daños derivados del uso del sitio web, ni de posibles errores en los contenidos. Los productos se ofrecen como complemento alimenticio y no sustituyen a una dieta equilibrada ni tratamiento médico.`
          },
          {
            title: "5. Legislación aplicable",
            body: `Las presentes condiciones se rigen por la legislación española. Para cualquier controversia, las partes se someten a los Juzgados y Tribunales del domicilio del consumidor.`
          },
        ].map((section, i) => (
          <div key={i} style={{ marginBottom: "2.5rem", paddingBottom: "2.5rem", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
            <h2 style={{ fontFamily: FONT, fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.04em", color: "#0e0e0e", margin: "0 0 0.75rem" }}>
              {section.title}
            </h2>
            <p style={{ fontFamily: FONT, fontSize: "0.82rem", lineHeight: 1.85, color: "rgba(0,0,0,0.55)", margin: 0, whiteSpace: "pre-line" }}>
              {section.body}
            </p>
          </div>
        ))}

        <p style={{ fontFamily: FONT, fontSize: "0.65rem", color: "rgba(0,0,0,0.3)", letterSpacing: "0.05em" }}>
          Última actualización: marzo 2026
        </p>
      </div>
    </div>
  );
}