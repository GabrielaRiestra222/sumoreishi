// ─── Servicio de emails — Resend ─────────────────────────────────────────────
//
// Para activar: añade RESEND_API_KEY en las variables de entorno de Vercel.
// Sin la clave, las funciones logean en consola pero no fallan.
//
// Documentación Resend: https://resend.com/docs
// ─────────────────────────────────────────────────────────────────────────────

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = process.env.RESEND_FROM ?? "Sumo Reishi <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "gabriela.riestra.lucas@gmail.com";
const RESEND_TEST_EMAIL = process.env.RESEND_TEST_EMAIL ?? "gabriela.riestra.lucas@gmail.com";
const USING_RESEND_TEST_DOMAIN = FROM_ADDRESS.includes("@resend.dev");
const ADMIN_NOTIFICATION_EMAIL = USING_RESEND_TEST_DOMAIN
  ? RESEND_TEST_EMAIL
  : ADMIN_EMAIL.split(",").map((email) => email.trim()).filter(Boolean);
const PRIMARY_ADMIN_EMAIL = Array.isArray(ADMIN_NOTIFICATION_EMAIL)
  ? ADMIN_NOTIFICATION_EMAIL[0] ?? ADMIN_EMAIL
  : ADMIN_NOTIFICATION_EMAIL;

interface OrderItem {
  name: string;
  quantity: number;
  unitEurCents: number;
}

async function sendEmail(payload: {
  to: string | string[];
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    console.log("[email] RESEND_API_KEY no configurada — email omitido:", payload.subject, "→", payload.to);
    return;
  }

  if (USING_RESEND_TEST_DOMAIN && payload.to !== RESEND_TEST_EMAIL) {
    console.log(
      "[email] Email omitido: onboarding@resend.dev solo puede enviar al email de la cuenta Resend.",
      payload.subject,
      "→",
      payload.to,
      "Permitido:",
      RESEND_TEST_EMAIL
    );
    return;
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    console.error("[email] Resend rejected email:", response.status, body);
    throw new Error(`Resend error ${response.status}: ${body}`);
  }

  console.log("[email] Sent:", payload.subject, "→", payload.to);
}

// ─── Notificación de formulario de contacto ─────────────────────────────────

export async function sendContactNotificationToAdmin(params: {
  name: string;
  email: string;
  message: string;
}): Promise<void> {
  const html = `
    <div style="font-family:Helvetica Neue,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
      <h2>Nuevo mensaje de contacto</h2>
      <p><b>Nombre:</b> ${params.name}</p>
      <p><b>Email:</b> ${params.email}</p>
      <p><b>Mensaje:</b></p>
      <p style="white-space:pre-line">${params.message}</p>
    </div>
  `;

  await sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `Nuevo mensaje de contacto de ${params.name}`,
    html,
  });
}

// ─── Email de confirmación al cliente ────────────────────────────────────────

export async function sendOrderConfirmationToCustomer(params: {
  to: string;
  customerName: string;
  orderId: string;
  items: OrderItem[];
  totalEurCents: number;
}): Promise<void> {
  const itemsHtml = params.items
    .map(
      (i) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0">${i.name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:center">×${i.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid #f0f0f0;text-align:right">${((i.unitEurCents * i.quantity) / 100).toFixed(2)} €</td>
        </tr>`
    )
    .join("");

  const html = `
    <div style="font-family:Helvetica Neue,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
      <div style="background:#0e0e0e;padding:32px;text-align:center">
        <p style="color:#c9a84c;letter-spacing:.2em;font-size:11px;text-transform:uppercase;margin:0">SUMO REISHI</p>
      </div>
      <div style="padding:40px 32px">
        <h1 style="font-size:22px;font-weight:800;margin:0 0 8px">¡Gracias, ${params.customerName}!</h1>
        <p style="color:#666;margin:0 0 32px">Hemos recibido tu pedido. Te avisaremos cuando esté en camino.</p>

        <table style="width:100%;border-collapse:collapse">
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding:12px 0;font-weight:700">Total</td>
            <td style="padding:12px 0;font-weight:700;text-align:right">${(params.totalEurCents / 100).toFixed(2)} €</td>
          </tr>
        </table>

        <p style="color:#999;font-size:12px;margin:32px 0 0">
          Referencia: <code>${params.orderId}</code><br>
          Entrega estimada: 48–72 horas hábiles
        </p>
      </div>
      <div style="background:#f9f9f9;padding:24px 32px;text-align:center;font-size:12px;color:#999">
        <p style="margin:0">¿Dudas? Escríbenos a <a href="mailto:${PRIMARY_ADMIN_EMAIL}" style="color:#c9a84c">${PRIMARY_ADMIN_EMAIL}</a></p>
      </div>
    </div>
  `;

  await sendEmail({
    to: params.to,
    subject: "Pedido confirmado — Sumo Reishi",
    html,
  });
}

// ─── Notificación interna de nuevo pedido ────────────────────────────────────

export async function sendNewOrderNotificationToAdmin(params: {
  orderId: string;
  customerName?: string;
  customerEmail: string;
  customerPhone?: string;
  items?: OrderItem[];
  totalEurCents: number;
}): Promise<void> {
  const itemsHtml = params.items?.length
    ? `
      <p><b>Productos:</b></p>
      <ul>
        ${params.items.map((item) => `<li>${item.name} ×${item.quantity}</li>`).join("")}
      </ul>
    `
    : "";

  const html = `
    <div style="font-family:monospace;padding:24px">
      <h2>🛒 Nuevo pedido</h2>
      <p><b>ID:</b> ${params.orderId}</p>
      <p><b>Cliente:</b> ${params.customerName || "—"}</p>
      <p><b>Email:</b> ${params.customerEmail}</p>
      <p><b>Teléfono:</b> ${params.customerPhone || "—"}</p>
      <p><b>Total:</b> ${(params.totalEurCents / 100).toFixed(2)} €</p>
      ${itemsHtml}
      <p><a href="https://sumoreishi.com/admin/orders/${params.orderId}">Ver pedido en el panel</a></p>
    </div>
  `;

  await sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `[SumoReishi] Nuevo pedido — ${(params.totalEurCents / 100).toFixed(2)} €`,
    html,
  });
}

// ─── Notificación de tracking al cliente ─────────────────────────────────────

export async function sendTrackingNotificationToCustomer(params: {
  to: string;
  customerName: string;
  orderId: string;
  carrier: string;
  trackingNumber: string;
}): Promise<void> {
  const html = `
    <div style="font-family:Helvetica Neue,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
      <div style="background:#0e0e0e;padding:32px;text-align:center">
        <p style="color:#c9a84c;letter-spacing:.2em;font-size:11px;text-transform:uppercase;margin:0">SUMO REISHI</p>
      </div>
      <div style="padding:40px 32px">
        <h1 style="font-size:22px;font-weight:800;margin:0 0 8px">Tu pedido está en camino</h1>
        <p style="color:#666;margin:0 0 32px">Hola ${params.customerName}, tu pedido ha sido enviado.</p>

        <div style="background:#f9f9f9;padding:20px;margin-bottom:24px">
          <p style="margin:0 0 8px"><b>Transportista:</b> ${params.carrier || "—"}</p>
          <p style="margin:0"><b>Número de seguimiento:</b> <code>${params.trackingNumber}</code></p>
        </div>

        <p style="color:#999;font-size:12px;margin:0">
          Referencia del pedido: <code>${params.orderId}</code>
        </p>
      </div>
      <div style="background:#f9f9f9;padding:24px 32px;text-align:center;font-size:12px;color:#999">
        <p style="margin:0">¿Dudas? <a href="mailto:${PRIMARY_ADMIN_EMAIL}" style="color:#c9a84c">${PRIMARY_ADMIN_EMAIL}</a></p>
      </div>
    </div>
  `;

  await sendEmail({
    to: params.to,
    subject: "Tu pedido de Sumo Reishi está en camino 🚀",
    html,
  });
}

// ─── Notificación de cancelación/reembolso al cliente ────────────────────────

export async function sendOrderCancelledToCustomer(params: {
  to: string;
  customerName: string;
  orderId: string;
  refunded: boolean;
}): Promise<void> {
  const html = `
    <div style="font-family:Helvetica Neue,Arial,sans-serif;max-width:560px;margin:0 auto;color:#0e0e0e">
      <div style="padding:40px 32px">
        <h1 style="font-size:22px;font-weight:800;margin:0 0 8px">
          ${params.refunded ? "Reembolso procesado" : "Pedido cancelado"}
        </h1>
        <p style="color:#666;margin:0 0 24px">
          Hola ${params.customerName},
          ${params.refunded
            ? " hemos procesado el reembolso de tu pedido. El importe aparecerá en tu cuenta en 5–10 días hábiles."
            : " tu pedido ha sido cancelado. Si tienes dudas, contáctanos."
          }
        </p>
        <p style="color:#999;font-size:12px">Referencia: <code>${params.orderId}</code></p>
      </div>
    </div>
  `;

  await sendEmail({
    to: params.to,
    subject: params.refunded ? "Reembolso confirmado — Sumo Reishi" : "Pedido cancelado — Sumo Reishi",
    html,
  });
}
