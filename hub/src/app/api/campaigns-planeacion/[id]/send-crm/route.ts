import { NextRequest, NextResponse } from "next/server";
import { localAddSend, localListSends } from "@/lib/local-store-planeacion";
import { renderMessageTemplate } from "@/lib/message-template";

// Envía la convocatoria de una campaña al CRM vía webhook, para que dispare
// los mensajes a los proveedores del Excel adjunto. La URL la da el equipo
// de CRM — hasta que exista, la ruta responde "not_configured" sin perder
// el intento (queda en el historial para reintentar cuando llegue la URL).

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(await localListSends(id));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { fileName, rows, message, campaignName, messageLabel } = body as {
    fileName: string;
    rows: Record<string, string | number>[];
    message: string;
    campaignName: string;
    messageLabel?: string | null;
  };

  const webhookUrl = process.env.CRM_WEBHOOK_URL;

  if (!webhookUrl) {
    const entry = await localAddSend(id, {
      file_name: fileName,
      row_count: rows?.length ?? 0,
      message,
      message_label: messageLabel,
      status: "not_configured",
      response_summary: "CRM_WEBHOOK_URL no está configurado todavía.",
    });
    return NextResponse.json(
      { error: "El webhook del CRM aún no está configurado (falta CRM_WEBHOOK_URL en el entorno).", entry },
      { status: 501 }
    );
  }

  try {
    // Cada proveedor recibe su propia versión del mensaje: {{Columna}} en el
    // texto se sustituye con el valor de esa columna en su fila del Excel
    // (ej. {{Productos aprobados}}) — así un solo mensaje sirve para los N
    // proveedores sin escribirlo uno por uno.
    const personalizedSuppliers = (rows ?? []).map((r) => ({ ...r, _mensaje_personalizado: renderMessageTemplate(message, r) }));
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ campaign_id: id, campaign_name: campaignName, message, suppliers: personalizedSuppliers }),
    });
    const summary = `HTTP ${res.status}`;
    const entry = await localAddSend(id, {
      file_name: fileName,
      row_count: rows?.length ?? 0,
      message,
      message_label: messageLabel,
      status: res.ok ? "sent" : "failed",
      response_summary: summary,
    });
    if (!res.ok) return NextResponse.json({ error: summary, entry }, { status: 502 });
    return NextResponse.json({ ok: true, entry });
  } catch (err) {
    const entry = await localAddSend(id, {
      file_name: fileName,
      row_count: rows?.length ?? 0,
      message,
      message_label: messageLabel,
      status: "failed",
      response_summary: err instanceof Error ? err.message : "Error desconocido",
    });
    return NextResponse.json({ error: "No se pudo contactar el webhook del CRM.", entry }, { status: 502 });
  }
}
