const FONT = '"Helvetica Neue","Helvetica","Arial",sans-serif';

export function CondicionesVentaPage() {
  return (
    <div style={{ backgroundColor: "#f5f5f3", minHeight: "100vh", paddingTop: "100px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "4rem 2rem 8rem" }}>
        <span style={{ fontFamily: FONT, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: "#c9a84c" }}>
          Legal
        </span>
        <h1 style={{ fontFamily: FONT, fontWeight: 800, fontSize: "2.5rem", letterSpacing: "-0.03em", margin: "1rem 0 3rem", color: "#0e0e0e" }}>
          Condiciones de Venta
        </h1>

        {[
          {
            title: "1. Objeto",
            body: `Las presentes condiciones regulan la compra de productos a través de sumoreishi.com. Al realizar un pedido, el cliente acepta estas condiciones en su totalidad.`
          },
          {
            title: "2. Proceso de compra",
            body: `El proceso de compra es el siguiente:\n— Selección del producto y formato\n— Introducción de datos de envío\n— Selección del método de pago\n— Confirmación del pedido\n\nEl contrato se perfecciona en el momento en que el cliente recibe la confirmación del pedido por email.`
          },
          {
            title: "3. Precios",
            body: `Todos los precios incluyen IVA. Los gastos de envío son gratuitos para pedidos superiores a 65€. Para pedidos inferiores, el coste de envío se indicará antes de confirmar la compra.`
          },
          {
            title: "4. Pago",
            body: `El pago se realiza mediante tarjeta de crédito o débito a través de la pasarela de pago segura Redsys (TPV Virtual). No almacenamos datos de tarjetas bancarias.`
          },
          {
            title: "5. Envío y entrega",
            body: `Los pedidos se procesan en 24h laborables. La entrega estimada es de 48–72 horas en España peninsular. Para Baleares, Canarias, Ceuta y Melilla, los plazos pueden variar.`
          },
          {
            title: "6. Derecho de desistimiento",
            body: `De conformidad con la Ley 3/2014, el cliente dispone de 30 días naturales desde la recepción del pedido para ejercer su derecho de desistimiento, sin necesidad de justificación.\n\nPara ejercerlo, contacte con nosotros en hola@sumoreishi.com. El producto debe estar sin abrir y en su embalaje original. Los gastos de devolución corren a cargo del cliente.`
          },
          {
            title: "7. Garantía y reclamaciones",
            body: `Todos nuestros productos cumplen con la normativa europea de complementos alimenticios. Si recibe un producto en mal estado, contáctenos en hola@sumoreishi.com en un plazo de 48h adjuntando foto del producto.`
          },
          {
            title: "8. Legislación aplicable",
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