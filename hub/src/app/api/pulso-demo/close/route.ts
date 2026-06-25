import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "dropi";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3004";

const IMAGE_CIERRE = "https://fwwkesboxlbmimzyoztq.supabase.co/storage/v1/object/public/imagenes/negociacioncerrada.png";

type ProductData = { name: string; supplier_name: string; category: string };

async function sendWhatsApp(number: string, caption: string) {
  if (!EVOLUTION_URL || !EVOLUTION_KEY) return;
  const normalized = number.replace(/[^0-9]/g, "");
  await fetch(`${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: JSON.stringify({
      number: normalized,
      mediatype: "image",
      mimetype: "image/png",
      media: IMAGE_CIERRE,
      caption,
      options: { delay: 1200 },
    }),
  });
}

async function sendKitEmail(to: string, name: string, kitLink: string, product: ProductData) {
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
    subject: `🚀 ¡Negociación cerrada! Tu kit de campaña está listo, ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff;">
        <div style="background: #111; padding: 24px; text-align: center;">
          <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
            alt="Dropi" style="height: 28px; filter: brightness(0) invert(1); margin-bottom: 10px;" />
          <div style="color: #4ade80; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
            🎉 ¡CAMPAÑA CERRADA!
          </div>
        </div>
        <div style="padding: 28px 24px;">
          <p style="font-size: 16px; font-weight: 800; color: #111; margin-bottom: 8px;">
            ¡${name}, la negociación fue exitosa!
          </p>
          <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 24px;">
            <strong>${product.supplier_name}</strong> confirmó las condiciones y la campaña está lista.
            Aquí están todos los materiales para empezar a vender <strong>${product.name}</strong>.
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

export async function POST() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  // 1. Verificar que el proveedor haya aceptado
  const sessionRes = await supabase
    .from("pulso_demo_sessions")
    .select("id, supplier_accepted_at, triggered_at")
    .eq("active", true)
    .order("triggered_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const session = sessionRes.data;

  if (!session) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 400 });
  }

  if (!session.supplier_accepted_at) {
    return NextResponse.json(
      { error: "El proveedor aún no ha aceptado las condiciones" },
      { status: 400 }
    );
  }

  // 2. Obtener dropshippers que aceptaron + producto
  const [dropshippersRes, productRes] = await Promise.all([
    supabase
      .from("pulso_demo_attendees")
      .select("name, email, whatsapp, token")
      .eq("role", "dropshipper")
      .not("accepted_at", "is", null),
    supabase
      .from("pulso_demo_product")
      .select("name, supplier_name, category")
      .eq("id", "00000000-0000-0000-0000-000000000001")
      .single(),
  ]);

  const dropshippers = dropshippersRes.data ?? [];
  const product: ProductData = productRes.data ?? {
    name: "Yoga Mat Premium",
    supplier_name: "Sports Supply Colombia",
    category: "Fitness & Bienestar",
  };

  // 3. Enviar kit a cada dropshipper
  await Promise.allSettled(
    dropshippers.map(async (ds) => {
      const kitLink = `${BASE_URL}/pulso-demo/kit/${ds.token}`;
      const text =
        `🎉 *¡Negociación cerrada con éxito!*\n\n` +
        `Hola *${ds.name}*, el proveedor *${product.supplier_name}* confirmó las condiciones.\n\n` +
        `La campaña de *${product.name}* está lista para publicar 🚀\n\n` +
        `En tu kit encontrás:\n` +
        `📸 *Gráficos* — imágenes del producto listas para usar\n` +
        `✍️ *Copies* — textos para WhatsApp, Instagram y TikTok\n` +
        `🎥 *Videos* — brief con ángulos y guión sugerido\n` +
        `📋 *Brief* — toda la info del producto y la campaña\n\n` +
        `👉 Accedé a todos los repositorios acá:\n${kitLink}`;

      const promises = [];
      if (ds.whatsapp) promises.push(sendWhatsApp(ds.whatsapp, text));
      if (ds.email) promises.push(sendKitEmail(ds.email, ds.name, kitLink, product));
      await Promise.allSettled(promises);
    })
  );

  return NextResponse.json({ ok: true, notified: dropshippers.length });
}
