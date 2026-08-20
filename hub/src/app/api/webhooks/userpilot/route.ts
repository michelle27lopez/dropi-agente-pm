import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { timingSafeEqual } from "crypto";

// Inicializar cliente Supabase con service_role key
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

function isValidSecret(received: string | null, expected: string): boolean {
  if (!received) return false;
  const a = Buffer.from(received);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function POST(req: NextRequest) {
  // Configura el mismo valor como header personalizado en el webhook de
  // Userpilot (Settings → Webhooks) y en USERPILOT_WEBHOOK_SECRET acá.
  const expectedSecret = process.env.USERPILOT_WEBHOOK_SECRET;
  if (!expectedSecret) {
    return NextResponse.json({ error: "USERPILOT_WEBHOOK_SECRET no está configurado todavía." }, { status: 501 });
  }
  if (!isValidSecret(req.headers.get("x-webhook-secret"), expectedSecret)) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  try {
    const payload = await req.json();

    if (!payload) {
      return NextResponse.json({ error: "Payload vacío" }, { status: 400 });
    }

    // Userpilot suele enviar los datos del usuario en payload.user o en la raíz
    const userData = payload.user || payload.data || payload;
    const userId = userData.user_id || userData.id || userData.userId;

    if (!userId) {
      console.warn("[Userpilot Webhook] No se encontró user_id en el payload");
      return NextResponse.json({ message: "Evento recibido pero sin user_id para registrar" }, { status: 200 });
    }

    // Mapeo seguro para userpilot_suppliers en Supabase
    const supplierRecord = {
      user_id: String(userId).trim(),
      name: userData.name || userData.full_name || userData.display_name || undefined,
      email: userData.email || undefined,
      phone: userData.phone || userData.phone_number || undefined,
      country: userData.country || userData.country_code || undefined,
      role: userData.role || "DROPSHIPPER",
      first_seen: userData.first_seen || new Date().toISOString(),
      last_seen: userData.last_seen || new Date().toISOString(),
      signed_up: userData.signed_up || userData.created_at || undefined,
      web_sessions: userData.web_sessions || userData.sessions || 1,
      device_type: userData.device_type || userData.device || undefined,
      browser: userData.browser || undefined,
      os: userData.os || userData.operating_system || undefined,
      survey_volume: userData.survey_volume || undefined,
      survey_stage: userData.survey_stage || undefined,
      survey_purpose: userData.survey_purpose || undefined,
      created_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from("userpilot_suppliers")
        .upsert([supplierRecord], { onConflict: "user_id" });

      if (error) {
        console.error("[Userpilot Webhook Supabase Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log(`[Userpilot Webhook Success] Seller ${userId} sincronizado en Supabase.`);
    }

    return NextResponse.json({
      success: true,
      message: `Webhook procesado con éxito para el usuario ${userId}`,
      timestamp: new Date().toISOString(),
    }, { status: 200 });

  } catch (error: any) {
    console.error("[Userpilot Webhook Processing Error]:", error);
    return NextResponse.json({ error: error.message || "Error procesando webhook" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    endpoint: "/api/webhooks/userpilot",
    description: "Receptor de Webhooks de Userpilot para sincronización en tiempo real con Supabase userpilot_suppliers",
  });
}
