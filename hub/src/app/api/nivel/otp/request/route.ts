import { NextRequest, NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Correo inválido" }, { status: 400 });
    }

    const code = generateCode();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutos

    // Invalidate any existing challenge for this email
    otpStore.delete(email);

    // Store new challenge
    otpStore.set(email, {
      code,
      expiresAt,
      attemptsLeft: 5,
    });

    console.log(`[DEV] OTP para ${email}: ${code}`);

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      // Sin credenciales SMTP no hay forma de enviar el correo real — se lo
      // decimos al usuario en vez de fingir que se envió. El bypass "000000"
      // en /api/nivel/otp/verify sigue funcionando en dev para pruebas.
      return NextResponse.json(
        {
          error:
            "El envío de correo no está configurado (faltan SMTP_USER/SMTP_PASS en hub/.env.local). Pide esas credenciales al equipo o usa el bypass de desarrollo.",
        },
        { status: 503 }
      );
    }

    try {
      const { createTransport } = await import("nodemailer");
      const transporter = createTransport({
        host: process.env.SMTP_HOST ?? "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT ?? "587"),
        secure: false,
        auth: { user: smtpUser, pass: smtpPass },
      });
      await transporter.sendMail({
        from: `Leyendas Dropi <${smtpUser}>`,
        to: email,
        subject: "Tu código Leyendas Dropi",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 420px; margin: 0 auto;">
            <div style="background: #0b0b0b; padding: 24px; text-align: center;">
              <div style="color: #FF8500; font-size: 14px; font-weight: 800; letter-spacing: 3px; text-transform: uppercase;">Leyendas Dropi</div>
            </div>
            <div style="padding: 24px; text-align: center;">
              <p style="font-size: 14px; color: #555;">Tu código para consultar tu nivel es:</p>
              <p style="font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #111; margin: 12px 0;">${code}</p>
              <p style="font-size: 12px; color: #999;">Vence en 10 minutos. Si no lo pediste, ignora este correo.</p>
            </div>
          </div>
        `,
      });
    } catch (mailErr) {
      console.error("[OTP Request] Error enviando correo:", mailErr);
      return NextResponse.json({ error: "No pudimos enviar el correo. Intenta de nuevo." }, { status: 502 });
    }

    return NextResponse.json({ success: true, message: "Código enviado" });
  } catch (err) {
    console.error("[OTP Request Error]", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
