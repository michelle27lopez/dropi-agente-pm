import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializar cliente Supabase con service_role key
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("[Userpilot Webhook Received]:", JSON.stringify(payload, null, 2));

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

      console.log(`[Userpilot Webhook Success] Seller ${userId} (${supplierRecord.name || "Sin nombre"}) sincronizado en Supabase.`);
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
