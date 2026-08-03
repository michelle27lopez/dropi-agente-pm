import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";
const CELL_SECRET_KEY = process.env.SELLER_SUCCESS_WEBHOOK_KEY || "seller-success-secret-2026";

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

export async function POST(req: NextRequest) {
  try {
    // 1. Validar autenticación simple de la Célula
    const apiKeyHeader = req.headers.get("x-api-key") || req.headers.get("authorization");
    if (apiKeyHeader && !apiKeyHeader.includes(CELL_SECRET_KEY) && apiKeyHeader !== CELL_SECRET_KEY) {
      return NextResponse.json({ error: "No autorizado. Token de la Célula inválido." }, { status: 401 });
    }

    const body = await req.json();
    console.log("[Webhook Seller Success] Payload recibido de Data Analyst:", JSON.stringify(body, null, 2));

    if (!body) {
      return NextResponse.json({ error: "Payload de datos vacío" }, { status: 400 });
    }

    // Normalizar si viene un solo registro o una lista/lote de registros
    const records = Array.isArray(body) ? body : body.records || body.sellers || [body];
    const processedRecords = [];

    for (const r of records) {
      const userId = r.user_id || r.id || r.userId;
      if (!userId) continue;

      processedRecords.push({
        user_id: String(userId).trim(),
        name: r.name || r.nombre || r.seller_name || undefined,
        email: r.email || r.correo || undefined,
        phone: r.phone || r.telefono || undefined,
        country: r.country || r.pais || undefined,
        role: r.role || r.rol || "DROPSHIPPER",
        real_orders_delivered: r.total_orders || r.real_orders_delivered || r.ordenes_entregadas || undefined,
        real_products_created: r.real_products_created || r.productos_creados || undefined,
        es_activo_30d: r.es_activo_30d !== undefined ? Boolean(r.es_activo_30d) : undefined,
        dias_en_activarse: r.dias_en_activarse || r.ttv_dias || undefined,
        tipo_proveedor: r.tipo_proveedor || r.nivel_leyendas || undefined,
        last_seen: new Date().toISOString(),
        created_at: new Date().toISOString()
      });
    }

    if (processedRecords.length === 0) {
      return NextResponse.json({ message: "No se encontraron registros válidos con user_id" }, { status: 400 });
    }

    if (supabase) {
      const { data, error } = await supabase
        .from("userpilot_suppliers")
        .upsert(processedRecords, { onConflict: "user_id" });

      if (error) {
        console.error("[Webhook Seller Success - Supabase Error]:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      console.log(`[Webhook Seller Success] ${processedRecords.length} registros guardados exitosamente en Supabase.`);
    }

    return NextResponse.json({
      success: true,
      records_processed: processedRecords.length,
      message: `Carga exitosa de ${processedRecords.length} sellers para la Célula Seller Success`,
      timestamp: new Date().toISOString()
    }, { status: 200 });

  } catch (error: any) {
    console.error("[Webhook Seller Success Error]:", error);
    return NextResponse.json({ error: error.message || "Error interno procesando datos" }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: "active",
    cell: "Seller Success",
    endpoint: "/api/webhooks/seller-success",
    usage: "Envía un POST JSON con la data de sellers (lote o individual) incluyendo la cabecera x-api-key."
  });
}
