import { NextRequest, NextResponse } from "next/server";
import { localApplySupplierEvent, SupplierStatus, SUPPLIER_STATUS_ORDER } from "@/lib/local-store-planeacion";
import { supabaseApplySupplierEvent } from "@/lib/supabase-store-planeacion";

// Webhook ENTRANTE del CRM (GoHighLevel) — a diferencia de /send-crm (que es
// saliente: nosotros avisamos al CRM), este lo llama el CRM cuando un
// proveedor cambia de etapa en su pipeline. Contrato a compartir con Kique:
//
//   POST /api/campaigns-planeacion/<campaign_id>/suppliers/webhook
//   Header: x-webhook-secret: <CRM_INBOUND_WEBHOOK_SECRET>
//   Body: { "identifier": "<mismo valor que la columna identificadora del Excel de convocatoria>", "status": "respondio" | "aplico" | "activo" }
//
// "activo" solo debería dispararse si el CRM tiene forma de confirmar que el
// proveedor de verdad activó (no solo que avanzó de etapa en el pipeline) —
// si esa señal no existe todavía del lado de GHL, dejar "activo" en manual
// hasta cruzarlo con datos reales de órdenes.

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const secret = process.env.CRM_INBOUND_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "CRM_INBOUND_WEBHOOK_SECRET no está configurado todavía." }, { status: 501 });
  }
  if (req.headers.get("x-webhook-secret") !== secret) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  const body = await req.json();
  const { identifier, status } = body as { identifier?: string; status?: string };

  if (!identifier?.trim()) {
    return NextResponse.json({ error: "Falta 'identifier'." }, { status: 400 });
  }
  if (!status || !SUPPLIER_STATUS_ORDER.includes(status as SupplierStatus)) {
    return NextResponse.json({ error: `'status' debe ser uno de: ${SUPPLIER_STATUS_ORDER.join(", ")}.` }, { status: 400 });
  }

  const supabaseResult = await supabaseApplySupplierEvent(id, identifier.trim(), status as SupplierStatus);
  if (supabaseResult) return NextResponse.json(supabaseResult);

  const updated = await localApplySupplierEvent(id, identifier.trim(), status as SupplierStatus);
  return NextResponse.json(updated);
}
