import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "dropi";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3004";

async function sendWhatsApp(number: string, text: string) {
  if (!EVOLUTION_URL || !EVOLUTION_KEY) return;
  const normalized = number.replace(/[^0-9]/g, "");
  await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: JSON.stringify({ number: normalized, text, options: { delay: 1200 } }),
  });
}

async function sendEmail(to: string, name: string, kitLink: string, product: ProductData) {
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

  await transporter.sendMail({
    from: `Dropi Pulso <${smtpUser}>`,
    to,
    subject: `🚀 ¡El proveedor aceptó! Tu kit de campaña está listo, ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff;">
        <div style="background: #111; padding: 24px; text-align: center;">
          <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
            alt="Dropi" style="height: 28px; filter: brightness(0) invert(1); margin-bottom: 10px;" />
          <div style="color: #4ade80; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
            ✅ PROVEEDOR CONFIRMÓ
          </div>
        </div>
        <div style="padding: 28px 24px;">
          <p style="font-size: 16px; font-weight: 800; color: #111; margin-bottom: 8px;">
            ¡${name}, tu campaña está lista!
          </p>
          <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 24px;">
            <strong>${product.supplier_name}</strong> aceptó las condiciones de la campaña.
            Ya tienes acceso a todos los materiales para empezar a vender <strong>${product.name}</strong>.
          </p>
          <div style="background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 16px; margin-bottom: 24px;">
            <div style="font-size: 13px; color: #15803D; font-weight: 700; margin-bottom: 8px;">Tu kit incluye:</div>
            <div style="font-size: 13px; color: #166534; line-height: 1.8;">
              📸 Gráficos del producto listos para usar<br>
              ✍️ Copies para WhatsApp, Instagram y TikTok<br>
              🎥 Brief de video con ángulos sugeridos<br>
              📋 Brief completo de la campaña
            </div>
          </div>
          <a href="${kitLink}"
             style="display: block; background: #F77F00; color: #fff; text-align: center;
                    padding: 16px; border-radius: 10px; font-size: 16px; font-weight: 800;
                    text-decoration: none;">
            Ver mi kit de campaña →
          </a>
        </div>
        <div style="padding: 14px 24px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #aaa;">
          Dropi Pulso · Motor de matching de catálogo
        </div>
      </div>
    `,
  });
}

type ProductData = {
  name: string;
  supplier_name: string;
  category: string;
};

export async function POST() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const [acceptedRes, productRes, sessionRes] = await Promise.all([
    supabase
      .from("pulso_demo_attendees")
      .select("*")
      .eq("role", "dropshipper")
      .not("accepted_at", "is", null),
    supabase
      .from("pulso_demo_product")
      .select("name, supplier_name, category")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single(),
    supabase
      .from("pulso_demo_sessions")
      .select("id")
      .eq("active", true)
      .order("triggered_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const dropshippers = acceptedRes.data ?? [];
  const product: ProductData = productRes.data ?? {
    name: "Yoga Mat Premium",
    supplier_name: "Sports Supply Colombia",
    category: "Fitness & Bienestar",
  };

  // Marcar sesión como aceptada por proveedor
  if (sessionRes.data?.id) {
    await supabase
      .from("pulso_demo_sessions")
      .update({ supplier_accepted_at: new Date().toISOString() })
      .eq("id", sessionRes.data.id);
  }

  // Notificar a cada dropshipper
  await Promise.allSettled(
    dropshippers.map(async (ds) => {
      const kitLink = `${BASE_URL}/pulso-demo/kit/${ds.token}`;
      const text =
        `✅ *¡${product.supplier_name} aceptó!*\n\n` +
        `Hola *${ds.name}*, tu campaña de *${product.name}* está confirmada.\n\n` +
        `Ya tienes acceso a todos los materiales:\n` +
        `📸 Gráficos · ✍️ Copies · 🎥 Videos · 📋 Brief\n\n` +
        `👉 Ver tu kit:\n${kitLink}`;

      const promises = [];
      if (ds.whatsapp) promises.push(sendWhatsApp(ds.whatsapp, text));
      if (ds.email) promises.push(sendEmail(ds.email, ds.name, kitLink, product));
      await Promise.allSettled(promises);
    })
  );

  return NextResponse.json({ ok: true, notified: dropshippers.length });
}
