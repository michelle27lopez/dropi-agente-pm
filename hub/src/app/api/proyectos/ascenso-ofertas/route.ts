import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "dropi";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3004";

// Prototipo en prueba: todos los envíos van al contacto de prueba de Jaime,
// sin importar el email/whatsapp real del proveedor en supplier_ascenso_panel.
const TEST_RECIPIENT_EMAIL = "jaime.guevara@dropi.co";
const TEST_RECIPIENT_WHATSAPP = "3224400784";

// Evolution API valida existencia en WhatsApp contra el número con indicativo
// de país. Los celulares colombianos (10 dígitos, empiezan en 3) llegan sin
// indicativo desde formularios/CRM — se antepone 57 si hace falta.
function normalizeCoWhatsapp(number: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  if (digits.length === 10 && digits.startsWith("3")) return `57${digits}`;
  return digits;
}

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

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { data, error } = await supabase.from("ascenso_ofertas").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const body = await req.json();
  const {
    supplierId, supplierName, email,
    nivelActual, nivelObjetivo,
    ordenesMovilizadas90d, umbralObjetivo,
  } = body;

  if (!supplierId || !supplierName || !nivelObjetivo) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const token = randomUUID();

  const { data, error } = await supabase
    .from("ascenso_ofertas")
    .insert({
      token,
      supplier_id: supplierId,
      supplier_name: supplierName,
      email: email ?? null,
      nivel_actual: nivelActual,
      nivel_objetivo: nivelObjetivo,
      ordenes_movilizadas_90d: ordenesMovilizadas90d ?? null,
      umbral_objetivo: umbralObjetivo,
      estado: "enviada",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await Promise.allSettled([
    sendEmail(TEST_RECIPIENT_EMAIL, supplierName, token, nivelObjetivo),
    sendWhatsApp(TEST_RECIPIENT_WHATSAPP, supplierName, token, nivelObjetivo),
  ]);

  return NextResponse.json({ ok: true, oferta: data, testRecipients: { email: TEST_RECIPIENT_EMAIL, whatsapp: TEST_RECIPIENT_WHATSAPP } });
}
