import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Fase 1: correo a Soporte pre-llenado, un clic de confirmar, sin investigar nada.
// Va al mismo contacto de prueba mientras estamos en piloto.
const SOPORTE_EMAIL = "jaime.guevara@dropi.co";

async function notificarSoporte(oferta: {
  supplier_id: number;
  supplier_name: string;
  nivel_actual: string;
  nivel_objetivo: string;
}) {
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
    from: `Dropi · Indicadores <${smtpUser}>`,
    to: SOPORTE_EMAIL,
    subject: `[Ascenso aceptado] Actualizar tipo de proveedor · #${oferta.supplier_id}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <p>El proveedor <strong>${oferta.supplier_name}</strong> (ID ${oferta.supplier_id}) aceptó su ascenso.</p>
        <table style="border-collapse: collapse; margin: 16px 0;">
          <tr><td style="padding:4px 12px 4px 0; color:#888;">Tipo actual</td><td style="padding:4px 0; font-weight:700;">${oferta.nivel_actual}</td></tr>
          <tr><td style="padding:4px 12px 4px 0; color:#888;">Tipo nuevo</td><td style="padding:4px 0; font-weight:700; color:#10B981;">${oferta.nivel_objetivo}</td></tr>
        </table>
        <p style="color:#555; font-size:13px;">Acción solicitada: actualizar el tipo de proveedor en BD según el pipeline estándar. No requiere análisis adicional — el criterio ya fue validado por el sistema.</p>
      </div>
    `,
  });
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { token } = await params;

  const { data, error } = await supabase
    .from("ascenso_ofertas")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Oferta no encontrada" }, { status: 404 });

  return NextResponse.json(data);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { token } = await params;
  const { accepted, motivo } = await req.json();

  const { data: oferta, error: fetchError } = await supabase
    .from("ascenso_ofertas")
    .select("*")
    .eq("token", token)
    .maybeSingle();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 500 });
  if (!oferta) return NextResponse.json({ error: "Oferta no encontrada" }, { status: 404 });
  if (oferta.estado !== "enviada") {
    return NextResponse.json({ error: "Esta oferta ya fue respondida" }, { status: 400 });
  }

  const { data: updated, error: updateError } = await supabase
    .from("ascenso_ofertas")
    .update({
      estado: accepted ? "aceptada" : "rechazada",
      motivo_rechazo: accepted ? null : (motivo ?? null),
      respondida_at: new Date().toISOString(),
    })
    .eq("token", token)
    .select()
    .single();

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  if (accepted) {
    notificarSoporte(oferta).catch(() => null);
  }

  return NextResponse.json({ ok: true, oferta: updated });
}
