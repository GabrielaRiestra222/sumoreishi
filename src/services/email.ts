// ─── Servicio de emails — Resend ─────────────────────────────────────────────
//
// Para activar: añade RESEND_API_KEY en las variables de entorno de Vercel.
// Sin la clave, las funciones logean en consola pero no fallan.
//
// Documentación Resend: https://resend.com/docs
// ─────────────────────────────────────────────────────────────────────────────

const RESEND_API_URL = "https://api.resend.com/emails";
const FROM_ADDRESS = process.env.RESEND_FROM ?? "Sumo Reishi <pedidos@sumoreishi.com>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "gabriela.riestra.lucas@gmail.com,tsmeragdina@gmail.com";
const RESEND_TEST_EMAIL = process.env.RESEND_TEST_EMAIL ?? "gabriela.riestra.lucas@gmail.com";
const SITE_URL = (process.env.SITE_URL ?? "https://sumoreishi.com").replace(/\/$/, "");
const EMAIL_HERO_IMAGE_URL = process.env.EMAIL_HERO_IMAGE_URL ?? `${SITE_URL}/email-hero.png`;
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

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatEur(cents: number): string {
  return `${(cents / 100).toFixed(2)} €`;
}

function renderEmailLayout(params: {
  eyebrow?: string;
  title: string;
  intro?: string;
  body: string;
  footer?: string;
  showHero?: boolean;
}): string {
  return `
    <div style="margin:0;padding:0;background:#f4f1ea">
      <div style="display:none;overflow:hidden;line-height:1px;opacity:0;max-height:0;max-width:0">
        ${escapeHtml(params.title)}
      </div>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4f1ea;border-collapse:collapse">
        <tr>
          <td align="center" style="padding:28px 14px">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;background:#ffffff;border-collapse:collapse;color:#111111;font-family:Helvetica Neue,Arial,sans-serif">
              <tr>
                <td style="background:#0d0d0d;padding:28px 32px;text-align:center">
                  <div style="font-size:11px;letter-spacing:0.34em;text-transform:uppercase;color:#d6b75b;font-weight:700">SUMO REISHI</div>
                </td>
              </tr>
              ${params.showHero === false ? "" : `
                <tr>
                  <td>
                    <img src="${EMAIL_HERO_IMAGE_URL}" width="640" alt="Sumo Reishi" style="display:block;width:100%;max-width:640px;height:240px;object-fit:cover;border:0" />
                  </td>
                </tr>
              `}
              <tr>
                <td style="padding:38px 34px 30px">
                  ${params.eyebrow ? `<p style="margin:0 0 14px;color:#9a7b24;font-size:11px;font-weight:700;letter-spacing:0.22em;text-transform:uppercase">${escapeHtml(params.eyebrow)}</p>` : ""}
                  <h1 style="margin:0 0 14px;color:#111111;font-size:28px;line-height:1.08;font-weight:800;letter-spacing:-0.02em">${escapeHtml(params.title)}</h1>
                  ${params.intro ? `<p style="margin:0 0 28px;color:#5f5a50;font-size:15px;line-height:1.65">${escapeHtml(params.intro)}</p>` : ""}
                  ${params.body}
                </td>
              </tr>
              <tr>
                <td style="background:#111111;padding:24px 34px;text-align:center;color:#aaa49a;font-size:12px;line-height:1.6">
                  ${params.footer ?? `¿Dudas? Escríbenos a <a href="mailto:${PRIMARY_ADMIN_EMAIL}" style="color:#d6b75b;text-decoration:none">${PRIMARY_ADMIN_EMAIL}</a>`}
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  `;
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
  const html = renderEmailLayout({
    eyebrow: "Contacto web",
    title: "Nuevo mensaje de contacto",
    showHero: false,
    body: `
      <div style="background:#f7f4ed;padding:20px;border-left:3px solid #d6b75b">
        <p style="margin:0 0 10px"><b>Nombre:</b> ${escapeHtml(params.name)}</p>
        <p style="margin:0 0 18px"><b>Email:</b> ${escapeHtml(params.email)}</p>
        <p style="margin:0 0 8px"><b>Mensaje:</b></p>
        <p style="margin:0;white-space:pre-line;color:#5f5a50;line-height:1.6">${escapeHtml(params.message)}</p>
      </div>
    `,
  });

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
          <td style="padding:12px 0;border-bottom:1px solid #eee8dc;color:#111">${escapeHtml(i.name)}</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee8dc;text-align:center;color:#6b6256">×${i.quantity}</td>
          <td style="padding:12px 0;border-bottom:1px solid #eee8dc;text-align:right;color:#111">${formatEur(i.unitEurCents * i.quantity)}</td>
        </tr>`
    )
    .join("");

  const html = renderEmailLayout({
    eyebrow: "Pedido confirmado",
    title: `Gracias, ${params.customerName}`,
    intro: "Hemos recibido tu pedido. Te avisaremos cuando esté en camino.",
    body: `
        <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">
          ${itemsHtml}
          <tr>
            <td colspan="2" style="padding:16px 0;font-weight:800;color:#111">Total</td>
            <td style="padding:16px 0;font-weight:800;text-align:right;color:#111">${formatEur(params.totalEurCents)}</td>
          </tr>
        </table>
        <div style="margin-top:24px;background:#f7f4ed;padding:18px;color:#6b6256;font-size:13px;line-height:1.7">
          Referencia: <code>${escapeHtml(params.orderId)}</code><br />
          Entrega estimada: 48-72 horas hábiles
        </div>
    `,
  });

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
      <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px">
        ${params.items.map((item) => `
          <tr>
            <td style="padding:10px 0;border-bottom:1px solid #eee8dc">${escapeHtml(item.name)} ×${item.quantity}</td>
            <td style="padding:10px 0;border-bottom:1px solid #eee8dc;text-align:right">${formatEur(item.unitEurCents * item.quantity)}</td>
          </tr>
        `).join("")}
      </table>
    `
    : "";

  const html = renderEmailLayout({
    eyebrow: "Venta online",
    title: "Nuevo pedido",
    intro: `Total: ${formatEur(params.totalEurCents)}`,
    showHero: false,
    body: `
      <div style="background:#f7f4ed;padding:20px;margin-bottom:22px;color:#4f473c;font-size:14px;line-height:1.8">
        <p style="margin:0"><b>ID:</b> ${escapeHtml(params.orderId)}</p>
        <p style="margin:0"><b>Cliente:</b> ${escapeHtml(params.customerName || "—")}</p>
        <p style="margin:0"><b>Email:</b> ${escapeHtml(params.customerEmail)}</p>
        <p style="margin:0"><b>Teléfono:</b> ${escapeHtml(params.customerPhone || "—")}</p>
      </div>
      ${itemsHtml}
      <p style="margin:26px 0 0">
        <a href="${SITE_URL}/admin/orders/${encodeURIComponent(params.orderId)}" style="display:inline-block;background:#111;color:#ffffff;text-decoration:none;padding:13px 18px;font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase">Ver pedido</a>
      </p>
    `,
  });

  await sendEmail({
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: `[SumoReishi] Nuevo pedido — ${formatEur(params.totalEurCents)}`,
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
  const html = renderEmailLayout({
    eyebrow: "Envío actualizado",
    title: "Tu pedido está en camino",
    intro: `Hola ${params.customerName}, tu pedido ha sido enviado.`,
    body: `
        <div style="background:#f7f4ed;padding:20px;margin-bottom:24px;color:#4f473c;font-size:14px;line-height:1.8">
          <p style="margin:0"><b>Transportista:</b> ${escapeHtml(params.carrier || "—")}</p>
          <p style="margin:0"><b>Número de seguimiento:</b> <code>${escapeHtml(params.trackingNumber)}</code></p>
        </div>
        <p style="color:#8a8378;font-size:13px;margin:0">
          Referencia del pedido: <code>${escapeHtml(params.orderId)}</code>
        </p>
    `,
  });

  await sendEmail({
    to: params.to,
    subject: "Tu pedido de Sumo Reishi está en camino",
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
  const html = renderEmailLayout({
    eyebrow: "Actualización de pedido",
    title: params.refunded ? "Reembolso procesado" : "Pedido cancelado",
    intro: params.refunded
      ? `Hola ${params.customerName}, hemos procesado el reembolso de tu pedido. El importe aparecerá en tu cuenta en 5-10 días hábiles.`
      : `Hola ${params.customerName}, tu pedido ha sido cancelado. Si tienes dudas, contáctanos.`,
    showHero: false,
    body: `<p style="color:#8a8378;font-size:13px;margin:0">Referencia: <code>${escapeHtml(params.orderId)}</code></p>`,
  });

  await sendEmail({
    to: params.to,
    subject: params.refunded ? "Reembolso confirmado — Sumo Reishi" : "Pedido cancelado — Sumo Reishi",
    html,
  });
}
