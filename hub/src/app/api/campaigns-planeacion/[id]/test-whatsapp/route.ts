import { NextRequest, NextResponse } from "next/server";
import { renderMessageTemplate } from "@/lib/message-template";

// Envío de PRUEBA de la convocatoria por WhatsApp (Evolution API) — nunca al
// proveedor real. Sirve para validar el canal antes de decidir si complementa
// o reemplaza el envío por CRM (ver /send-crm). Siempre va al mismo número de
// prueba, sin importar qué Excel esté cargado en la campaña.

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "dropi";

const TEST_RECIPIENT_WHATSAPP = "3052270634";

// Evolution API valida contra el número con indicativo de país. Los celulares
// colombianos (10 dígitos, empiezan en 3) llegan sin indicativo — se antepone
// 57 si hace falta (mismo criterio que hub/src/lib/ascenso-dispatch.ts).
function normalizeCoWhatsapp(number: string): string {
  const digits = number.replace(/[^0-9]/g, "");
  if (digits.length === 10 && digits.startsWith("3")) return `57${digits}`;
  return digits;
}

export async function POST(req: NextRequest) {
  if (!EVOLUTION_URL || !EVOLUTION_KEY) {
    return NextResponse.json(
      { error: "Evolution API no está configurada todavía (falta EVOLUTION_API_URL / EVOLUTION_API_KEY en el entorno)." },
      { status: 501 }
    );
  }

  const body = await req.json();
  const { campaignName, message, sampleRow } = body as {
    campaignName: string;
    message: string;
    sampleRow: Record<string, string | number>;
  };

  // Sustituye {{Columna}} con el valor real de la fila de muestra, para que
  // la prueba muestre exactamente lo que recibiría un proveedor de verdad
  // (no el texto crudo con placeholders sin resolver).
  const personalized = renderMessageTemplate(message?.trim() ?? "", sampleRow ?? {});

  const text = `🧪 *Prueba de convocatoria — ${campaignName}*\n\n${personalized || "(mensaje vacío)"}`;

  try {
    const res = await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
      body: JSON.stringify({
        number: normalizeCoWhatsapp(TEST_RECIPIENT_WHATSAPP),
        text,
        options: { delay: 1200 },
      }),
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json({ error: `Evolution API respondió HTTP ${res.status}. ${errText}`.trim() }, { status: 502 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "No se pudo contactar Evolution API." }, { status: 502 });
  }
}
