import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Inicializar cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || "";
const CELL_SECRET_KEY = process.env.SELLER_SUCCESS_WEBHOOK_KEY || "seller-success-secret-2026";

const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;

// Lista blanca de columnas conocidas en userpilot_suppliers
const VALID_COLUMNS = new Set([
  "user_id", "name", "email", "phone", "country", "role", "tipo_proveedor",
  "real_orders_delivered", "real_products_created", "es_activo_30d", "dias_en_activarse",
  "referred_by", "belong_to_community", "owner_of_community", "survey_brand_sales",
  "survey_volume", "survey_stage", "survey_source", "survey_purpose", "survey_role",
  "survey_sell_pref", "survey_shipping_pref", "billing_information", "verified",
  "fecha_activacion", "real_dropshipper_clients", "web_sessions", "device_type",
  "os", "browser", "browser_language", "first_seen", "last_seen", "signed_up", "created_at"
]);

// Mapa de alias comunes (Español / Nombres alternativos de columnas Data Analyst)
const ALIAS_MAP: Record<string, string> = {
  id: "user_id",
  userId: "user_id",
  nombre: "name",
  seller_name: "name",
  correo: "email",
  telefono: "phone",
  celular: "phone",
  pais: "country",
  rol: "role",
  total_orders: "real_orders_delivered",
  ordenes_entregadas: "real_orders_delivered",
  ordenes: "real_orders_delivered",
  productos_creados: "real_products_created",
  productos: "real_products_created",
  ttv_dias: "dias_en_activarse",
  dias_activacion: "dias_en_activarse",
  nivel_leyendas: "tipo_proveedor",
  segmento: "tipo_proveedor",
  kam: "referred_by",
  kam_asignado: "referred_by",
  comunidad: "belong_to_community",
  comunidad_nombre: "belong_to_community",
  lider_comunidad: "owner_of_community",
  categoria: "survey_brand_sales",
  categoria_producto: "survey_brand_sales",
  volumen_declarado: "survey_volume",
  etapa_onboarding: "survey_stage",
  origen_registro: "survey_source",
  billing: "billing_information",
  datos_facturacion: "billing_information"
};

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
    const records = Array.isArray(body) ? body : body.records || body.sellers || body.data || [body];
    const processedRecords = [];

    for (const rawRecord of records) {
      if (!rawRecord || typeof rawRecord !== "object") continue;

      const recordToProcess: Record<string, any> = {};

      // A. Mapeo dinámico por clave directa o alias
      for (const [key, value] of Object.entries(rawRecord)) {
        if (value === undefined || value === null || value === "") continue;

        const targetColumn = ALIAS_MAP[key] || (VALID_COLUMNS.has(key) ? key : null);

        if (targetColumn && VALID_COLUMNS.has(targetColumn)) {
          recordToProcess[targetColumn] = value;
        }
      }

      // B. Verificar que exista user_id
      const userId = rawRecord.user_id || rawRecord.id || rawRecord.userId || recordToProcess.user_id;
      if (!userId) continue;

      recordToProcess.user_id = String(userId).trim();

      // C. Valores por defecto para consistencia
      if (!recordToProcess.role) recordToProcess.role = "DROPSHIPPER";
      if (recordToProcess.es_activo_30d !== undefined) recordToProcess.es_activo_30d = Boolean(recordToProcess.es_activo_30d);
      recordToProcess.last_seen = new Date().toISOString();

      processedRecords.push(recordToProcess);
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

      console.log(`[Webhook Seller Success] ${processedRecords.length} registros dinámicos guardados exitosamente en Supabase.`);
    }

    return NextResponse.json({
      success: true,
      records_processed: processedRecords.length,
      sample_record_fields: Object.keys(processedRecords[0] || {}),
      message: `Carga exitosa de ${processedRecords.length} sellers para la Célula Seller Success (modo dinámico activo)`,
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
    mode: "dynamic_all_columns",
    cell: "Seller Success",
    endpoint: "/api/webhooks/seller-success",
    supported_columns_count: VALID_COLUMNS.size,
    usage: "Envía un POST JSON con cualquier combinación de columnas o alias en español/inglés."
  });
}
