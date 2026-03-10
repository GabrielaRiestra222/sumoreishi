const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';

export function PrivacidadPage() {
  return (
    <div style={{ backgroundColor: "#f5f5f3", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 2rem 8rem" }}>
        <span style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c" }}>
          Legal
        </span>
        <h1 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "2.5rem", letterSpacing: "-0.03em", margin: "1rem 0 3rem", color: "#0e0e0e" }}>
          Política de Privacidad
        </h1>

        {[
          {
            title: "1. Responsable del tratamiento",
            body: `En cumplimiento del Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD), le informamos que el responsable del tratamiento de sus datos es:\n\nSumo Reishi · hola@sumoreishi.com`
          },
          {
            title: "2. Datos que recopilamos",
            body: `Recopilamos los datos que usted nos facilita voluntariamente a través de los formularios de contacto y compra: nombre, dirección de correo electrónico, teléfono y dirección de entrega. También recopilamos automáticamente datos de navegación mediante cookies (ver Política de Cookies).`
          },
          {
            title: "3. Finalidad del tratamiento",
            body: `Los datos se utilizan para:\n— Gestionar su pedido y envío\n— Atender sus consultas\n— Enviarle comunicaciones comerciales si nos ha dado su consentimiento\n— Cumplir con obligaciones legales`
          },
          {
            title: "4. Base legal",
            body: `La base legal para el tratamiento es la ejecución de un contrato (pedidos), el consentimiento del interesado (comunicaciones comerciales) y el cumplimiento de obligaciones legales.`
          },
          {
            title: "5. Conservación de datos",
            body: `Sus datos se conservarán mientras dure la relación comercial y durante los plazos legalmente exigidos (mínimo 5 años para datos fiscales).`
          },
          {
            title: "6. Sus derechos",
            body: `Puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a hola@sumoreishi.com. También tiene derecho a presentar una reclamación ante la Agencia Española de Protección de Datos (aepd.es).`
          },
          {
            title: "7. Transferencias internacionales",
            body: `No realizamos transferencias internacionales de datos fuera del Espacio Económico Europeo.`
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