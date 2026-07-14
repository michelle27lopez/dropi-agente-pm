import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "dropi";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

// SMTP via nodemailer — opcional, si no está configurado se omite el email
async function sendEmail(to: string, name: string, token: string, product: PulsoProduct) {
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

  const link = `${BASE_URL}/pulso-demo/${token}`;
  const margin = Math.round((product.price_suggested - product.price_cost) * 100 / product.price_suggested);
  const profit = (product.price_suggested - product.price_cost).toLocaleString("es-CO");

  await transporter.sendMail({
    from: `Dropi Pulso <${smtpUser}>`,
    to,
    subject: `⚡ Pulso detectado — Oportunidad para ti, ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff;">
        <div style="background: #111; padding: 28px 24px; text-align: center;">
          <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style="height: 32px; width: auto; margin-bottom: 10px; filter: brightness(0) invert(1);" />
          <div style="color: #F77F00; font-size: 16px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">⚡ PULSO DETECTADO</div>
          <div style="color: rgba(255,255,255,0.5); font-size: 12px; margin-top: 6px; text-transform: uppercase; letter-spacing: 1px;">Señal detectada · ${product.category}</div>
        </div>
        <div style="padding: 28px 24px;">
          <p style="font-size: 16px; color: #111; margin-bottom: 8px;">Hola <strong>${name}</strong>,</p>
          <div style="background: #fff8e1; border-left: 3px solid #F77F00; padding: 10px 14px; border-radius: 6px; margin-bottom: 16px; font-size: 13px; color: #78350f;">
            🎭 <strong>En este ejercicio, tú eres un dropshipper de Dropi.</strong>
            El sistema te eligió porque tu perfil coincide con esta oportunidad.
          </div>
          <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 24px;">
            El Pulso identificó una oportunidad de alto potencial.
            Revisa el producto, elige cuántas unidades podrías mover y confirma tu participación.
          </p>
          <div style="background: #F8F9FA; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <div style="font-size: 18px; font-weight: 800; color: #111; margin-bottom: 4px;">${product.name}</div>
            <div style="font-size: 13px; color: #888; margin-bottom: 16px;">${product.category} · ${product.stock.toLocaleString("es-CO")} unidades · ${product.supplier_city}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px;">
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800; color: #F77F00;">${margin}%</div>
                <div style="font-size: 11px; color: #888;">Margen</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800; color: #111;">$${profit}</div>
                <div style="font-size: 11px; color: #888;">Por unidad</div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 20px; font-weight: 800; color: #111;">15</div>
                <div style="font-size: 11px; color: #888;">Días</div>
              </div>
            </div>
          </div>
          <a href="${link}"
             style="display: block; background: #F77F00; color: #fff; text-align: center;
                    padding: 16px; border-radius: 10px; font-size: 16px; font-weight: 800;
                    text-decoration: none;">
            Ver oferta y confirmar →
          </a>
        </div>
        <div style="padding: 16px 24px; border-top: 1px solid #eee; text-align: center;">
          <div style="font-size: 11px; color: #aaa;">Dropi Pulso · Motor de matching de catálogo</div>
        </div>
      </div>
    `,
  });
}

const IMAGE_SENAL = "https://fwwkesboxlbmimzyoztq.supabase.co/storage/v1/object/public/imagenes/nuevasenal.png";

async function sendWhatsApp(number: string, name: string, token: string, product: PulsoProduct) {
  if (!EVOLUTION_URL || !EVOLUTION_KEY) return;
  const link = `${BASE_URL}/pulso-demo/${token}`;
  const margin = Math.round((product.price_suggested - product.price_cost) * 100 / product.price_suggested);
  const profit = (product.price_suggested - product.price_cost).toLocaleString("es-CO");

  const normalized = number.replace(/[^0-9]/g, "");

  const caption =
    `⚡ *DROPI PULSO — Señal detectada*\n\n` +
    `Hola *${name}*,\n\n` +
    `El sistema identificó una oportunidad en *${product.category}*:\n\n` +
    `📦 *${product.name}*\n` +
    `📍 ${product.supplier_city} · ${product.stock.toLocaleString("es-CO")} unidades\n` +
    `💰 Margen: *${margin}%* · $${profit} por unidad\n` +
    `⏱ Ventana: 15 días\n\n` +
    `👉 Revisar oferta:\n${link}`;

  await fetch(`${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: JSON.stringify({
      number: normalized,
      mediatype: "image",
      mimetype: "image/png",
      media: IMAGE_SENAL,
      caption,
      options: { delay: 1200 },
    }),
  });
}

type PulsoProduct = {
  name: string;
  category: string;
  price_cost: number;
  price_suggested: number;
  margin_pct: number;
  stock: number;
  supplier_name: string;
  supplier_city: string;
};

export async function POST() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  // 1. Leer solo dropshippers y producto
  const [attendeesRes, productRes] = await Promise.all([
    supabase.from("pulso_demo_attendees").select("*").eq("role", "dropshipper"),
    supabase.from("pulso_demo_product").select("*").eq("id", "00000000-0000-0000-0000-000000000001").single(),
  ]);

  const attendees = attendeesRes.data ?? [];
  const product: PulsoProduct = productRes.data ?? {
    name: "Yoga Mat Premium",
    category: "Fitness & Bienestar",
    price_cost: 52000,
    price_suggested: 89900,
    margin_pct: 42,
    stock: 820,
    supplier_name: "Sports Supply Colombia",
    supplier_city: "Medellín",
  };

  // 2. Desactivar sesiones anteriores
  await supabase.from("pulso_demo_sessions").update({ active: false }).eq("active", true);

  // 3. Crear nueva sesión
  await supabase.from("pulso_demo_sessions").insert({
    triggered_by: "admin",
    total_sent: attendees.length,
    active: true,
  });

  // 4. Enviar notificaciones en paralelo
  const results = await Promise.allSettled(
    attendees.map(async (a) => {
      const promises: Promise<void>[] = [];
      if (a.whatsapp) promises.push(sendWhatsApp(a.whatsapp, a.name, a.token, product));
      if (a.email) promises.push(sendEmail(a.email, a.name, a.token, product));
      await Promise.allSettled(promises);
    })
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;

  return NextResponse.json({ ok: true, sent, total: attendees.length });
}
