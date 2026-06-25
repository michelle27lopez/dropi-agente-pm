import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "dropi";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3004";

async function notifySuppliers(dropshipperName: string, totalAccepted: number, totalCommitted: number) {
  if (!supabase) return;

  const { data: suppliers } = await supabase
    .from("pulso_demo_attendees")
    .select("name, email, whatsapp")
    .eq("role", "supplier");

  if (!suppliers || suppliers.length === 0) return;

  const portalUrl = `${BASE_URL}/pulso-demo/proveedor`;

  await Promise.allSettled(
    suppliers.map(async (s) => {
      const promises = [];

      if (s.whatsapp && EVOLUTION_URL && EVOLUTION_KEY) {
        const normalized = s.whatsapp.replace(/[^0-9]/g, "");
        const text =
          `⚡ *Dropi Pulso — Señal de demanda*\n\n` +
          `*${dropshipperName}* acaba de confirmar la campaña.\n\n` +
          `📊 Total confirmados: *${totalAccepted} dropshipper${totalAccepted !== 1 ? "s" : ""}*\n` +
          (totalCommitted > 0 ? `📦 Unidades comprometidas: *${totalCommitted.toLocaleString("es-CO")}*\n\n` : "\n") +
          `👉 Ver señal en tu portal:\n${portalUrl}`;
        promises.push(
          fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
            method: "POST",
            headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
            body: JSON.stringify({ number: normalized, text, options: { delay: 1200 } }),
          })
        );
      }

      if (s.email) {
        const { createTransport } = await import("nodemailer");
        const smtpUser = process.env.SMTP_USER;
        const smtpPass = process.env.SMTP_PASS;
        if (smtpUser && smtpPass) {
          const transporter = createTransport({
            host: process.env.SMTP_HOST ?? "smtp.gmail.com",
            port: parseInt(process.env.SMTP_PORT ?? "587"),
            secure: false,
            auth: { user: smtpUser, pass: smtpPass },
          });
          promises.push(
            transporter.sendMail({
              from: `Dropi Pulso <${smtpUser}>`,
              to: s.email,
              subject: `⚡ ${totalAccepted} dropshipper${totalAccepted !== 1 ? "s" : ""} confirmaron tu campaña`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #fff;">
                  <div style="background: #111; padding: 24px; text-align: center;">
                    <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
                      alt="Dropi" style="height: 28px; filter: brightness(0) invert(1); margin-bottom: 10px;" />
                    <div style="color: #F77F00; font-size: 14px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase;">
                      ⚡ SEÑAL DE DEMANDA
                    </div>
                  </div>
                  <div style="padding: 28px 24px;">
                    <p style="font-size: 16px; font-weight: 800; color: #111; margin-bottom: 8px;">
                      ${dropshipperName} acaba de confirmar
                    </p>
                    <p style="font-size: 14px; color: #555; line-height: 1.6; margin-bottom: 24px;">
                      Ya hay <strong>${totalAccepted} dropshipper${totalAccepted !== 1 ? "s" : ""}</strong> que confirmaron interés en tu campaña.
                      ${totalCommitted > 0 ? `Han comprometido un total de <strong>${totalCommitted.toLocaleString("es-CO")} unidades</strong>.` : ""}
                      Revisa la señal completa en tu portal y acepta las condiciones.
                    </p>
                    <div style="display: flex; gap: 16px; margin-bottom: 24px;">
                      <div style="flex: 1; background: #FFF8F0; border: 1px solid #FED7AA; border-radius: 10px; padding: 16px; text-align: center;">
                        <div style="font-size: 32px; font-weight: 900; color: #F77F00;">${totalAccepted}</div>
                        <div style="font-size: 12px; color: #888; margin-top: 4px;">dropshippers</div>
                      </div>
                      ${totalCommitted > 0 ? `
                      <div style="flex: 1; background: #F0FDF4; border: 1px solid #BBF7D0; border-radius: 10px; padding: 16px; text-align: center;">
                        <div style="font-size: 32px; font-weight: 900; color: #10B981;">${totalCommitted.toLocaleString("es-CO")}</div>
                        <div style="font-size: 12px; color: #888; margin-top: 4px;">unidades</div>
                      </div>` : ""}
                    </div>
                    <a href="${portalUrl}"
                       style="display: block; background: #F77F00; color: #fff; text-align: center;
                              padding: 16px; border-radius: 10px; font-size: 16px; font-weight: 800;
                              text-decoration: none;">
                      Ver señal y aceptar condiciones →
                    </a>
                  </div>
                  <div style="padding: 14px 24px; border-top: 1px solid #eee; text-align: center; font-size: 11px; color: #aaa;">
                    Dropi Pulso · Motor de matching de catálogo
                  </div>
                </div>
              `,
            })
          );
        }
      }

      await Promise.allSettled(promises);
    })
  );
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { token, committed_units } = await req.json();
  if (!token) return NextResponse.json({ error: "token required" }, { status: 400 });

  const { data: attendee, error: findError } = await supabase
    .from("pulso_demo_attendees")
    .select("id, name, accepted_at")
    .eq("token", token)
    .single();

  if (findError || !attendee) {
    return NextResponse.json({ error: "Token inválido" }, { status: 404 });
  }

  if (attendee.accepted_at) {
    return NextResponse.json({ ok: true, already: true, name: attendee.name });
  }

  const updatePayload: Record<string, unknown> = { accepted_at: new Date().toISOString() };
  if (committed_units != null) updatePayload.committed_units = committed_units;

  const { error: updateError } = await supabase
    .from("pulso_demo_attendees")
    .update(updatePayload)
    .eq("token", token);

  if (updateError) {
    const { error: retryError } = await supabase
      .from("pulso_demo_attendees")
      .update({ accepted_at: new Date().toISOString() })
      .eq("token", token);
    if (retryError) return NextResponse.json({ error: retryError.message }, { status: 500 });
  }

  // Obtener stats actualizados para notificar al proveedor
  const { data: allAccepted } = await supabase
    .from("pulso_demo_attendees")
    .select("committed_units")
    .eq("role", "dropshipper")
    .not("accepted_at", "is", null);

  const totalAccepted = (allAccepted ?? []).length;
  const totalCommitted = (allAccepted ?? []).reduce((sum, a) => sum + (a.committed_units ?? 0), 0);

  // Notificar a los proveedores registrados (sin await para no bloquear la respuesta)
  notifySuppliers(attendee.name, totalAccepted, totalCommitted).catch(() => null);

  return NextResponse.json({ ok: true, name: attendee.name });
}
