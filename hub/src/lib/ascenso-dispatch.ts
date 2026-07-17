// Envío de ofertas de ascenso (IND-001). Único punto de contacto con el canal
// de mensajería — hoy es Evolution API (WhatsApp) + SMTP, apuntando siempre
// al contacto de prueba. Cuando el webhook de GoHighLevel esté listo, este es
// el único archivo que cambia: se reemplaza el cuerpo de dispatchOferta por
// un POST al webhook de GHL y el resto del pipeline (cola, estados, UI) no
// se toca.
//
// Nunca envía al proveedor real: mientras no exista integración con un canal
// oficial (GHL), todo envío —individual o por lote— va al contacto de
// prueba. No quitar este límite sin decisión explícita (riesgo de baneo del
// número de WhatsApp usado para pruebas).

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "dropi";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3004";

export const TEST_RECIPIENT_EMAIL = "jaime.guevara@dropi.co";
export const TEST_RECIPIENT_WHATSAPP = "3224400784";

const BENEFICIOS: Record<string, string[]> = {
  Verificado: [
    "Aprobación automática de productos",
    "Acceso a Caza Productos",
    "Banner destacado en catálogo",
  ],
  Premium: [
    "Visita comercial personalizada",
    "Presencia en lives de Dropi",
    "Relacionamiento con comunidades",
  ],
};

// Evolution API valida existencia en WhatsApp contra el número con indicativo
// de país. Los celulares colombianos (10 dígitos, empiezan en 3) llegan sin
// indicativo desde formularios/CRM — se antepone 57 si hace falta.
function normalizeCoWhatsapp(number: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  if (digits.length === 10 && digits.startsWith("3")) return `57${digits}`;
  return digits;
}

async function sendEmail(to: string, nombre: string, token: string, nivelObjetivo: string) {
  const { createTransport } = await import("nodemailer");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  if (!smtpUser || !smtpPass) return;

  const transporter = createTransport({
    host: process.env.SMTP_HOST ?? "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT ?? "587"),
    secure: false,
    auth: { user: smtpUser, pass: smtpPass },
  });

  const link = `${BASE_URL}/proyectos/indicadores/ascenso/${token}`;
  const beneficios = BENEFICIOS[nivelObjetivo] ?? [];

  await transporter.sendMail({
    from: `Dropi · Indicadores <${smtpUser}>`,
    to,
    subject: `🎯 Ya calificas para ascender a ${nivelObjetivo}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff;">
        <div style="background: #111; padding: 28px 24px; text-align: center;">
          <div style="color: #6366F1; font-size: 16px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">🎯 ASCENSO DETECTADO</div>
        </div>
        <div style="padding: 28px 24px;">
          <p style="font-size: 16px; color: #111; margin-bottom: 8px;">Hola <strong>${nombre}</strong>,</p>
          <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 20px;">
            Nuestro sistema detectó que cumples con lo básico para ascender a <strong>${nivelObjetivo}</strong> y obtener nuevos beneficios.
          </p>
          <div style="background: #F8F9FA; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            ${beneficios.map(b => `<div style="font-size: 13px; color: #333; margin-bottom: 8px;">✓ ${b}</div>`).join("")}
          </div>
          <a href="${link}"
             style="display: block; background: #6366F1; color: #fff; text-align: center;
                    padding: 16px; border-radius: 10px; font-size: 16px; font-weight: 800;
                    text-decoration: none;">
            Ver beneficios y responder →
          </a>
        </div>
        <div style="padding: 16px 24px; border-top: 1px solid #eee; text-align: center;">
          <div style="font-size: 11px; color: #aaa;">Dropi · Panel de Indicadores</div>
        </div>
      </div>
    `,
  });
}

async function sendWhatsApp(number: string, nombre: string, token: string, nivelObjetivo: string) {
  if (!EVOLUTION_URL || !EVOLUTION_KEY) return;
  const link = `${BASE_URL}/proyectos/indicadores/ascenso/${token}`;
  const normalized = normalizeCoWhatsapp(number);

  const caption =
    `🎯 *Ascenso detectado*\n\n` +
    `Hola *${nombre}*,\n\n` +
    `Nuestro sistema detectó que cumples con lo básico para ascender a *${nivelObjetivo}* y obtener nuevos beneficios.\n\n` +
    `👉 Ver beneficios y responder:\n${link}`;

  await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: JSON.stringify({
      number: normalized,
      text: caption,
      options: { delay: 1200 },
    }),
  });
}

export type OfertaParaEnvio = {
  token: string;
  supplier_name: string;
  nivel_objetivo: string;
};

export async function dispatchOferta(oferta: OfertaParaEnvio) {
  await Promise.allSettled([
    sendEmail(TEST_RECIPIENT_EMAIL, oferta.supplier_name, oferta.token, oferta.nivel_objetivo),
    sendWhatsApp(TEST_RECIPIENT_WHATSAPP, oferta.supplier_name, oferta.token, oferta.nivel_objetivo),
  ]);
}

export function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─── Envío por lote vía webhook n8n (Enrique) ────────────────────────────────
// Un solo POST con el array completo — n8n resuelve destinatario (busca el
// WhatsApp del proveedor por supplier_id en su propio CRM/GHL) y hace el
// throttling real de envío del lado de él, con la API oficial de WhatsApp
// Business. Nosotros no reenviamos uno por uno acá.
//
// Contrato en borrador (Enrique aún no lo confirmó): "tipo" distingue este
// payload del que ya usa Dropi Pulso en el mismo webhook compartido.

const PULSO_SUPPLIERS_WEBHOOK_URL = process.env.PULSO_SUPPLIERS_WEBHOOK_URL ?? "";

export type OfertaParaWebhook = {
  supplier_id: number;
  supplier_name: string;
  email: string | null;
  nivel_actual: string;
  nivel_objetivo: string;
  token: string;
};

export async function dispatchBatchWebhook(ofertas: OfertaParaWebhook[]) {
  if (!PULSO_SUPPLIERS_WEBHOOK_URL) {
    throw new Error("PULSO_SUPPLIERS_WEBHOOK_URL no está configurado");
  }
  if (ofertas.length === 0) return { ok: true, enviados: 0 };

  const beneficiosDe = (nivel: string) => BENEFICIOS[nivel] ?? [];

  const payload = {
    tipo: "ascenso",
    ofertas: ofertas.map(o => ({
      supplier_id: o.supplier_id,
      nombre: o.supplier_name,
      email: o.email,
      nivel_actual: o.nivel_actual,
      nivel_objetivo: o.nivel_objetivo,
      beneficios: beneficiosDe(o.nivel_objetivo),
      link: `${BASE_URL}/proyectos/indicadores/ascenso/${o.token}`,
    })),
  };

  const res = await fetch(PULSO_SUPPLIERS_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Webhook respondió ${res.status}: ${body}`);
  }

  return { ok: true, enviados: ofertas.length };
}
