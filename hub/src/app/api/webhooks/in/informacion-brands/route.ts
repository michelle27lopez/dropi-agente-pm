import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { bearerDeHeader, tokenCoincide, leerCuerpo } from "@/lib/webhooks/registro";
import { DATASETS, filtrarColumnas } from "@/lib/webhooks/informacionBrands";

// Receptor dedicado del webhook «Tablero de Célula Marcas» (Data, Miguel
// Gutiérrez — spec v1.0, 04-sep-2026). A diferencia del receptor genérico en
// ../[slug]/route.ts (que guarda cualquier body como filas jsonb sueltas),
// este webhook trae un `dataset` explícito por lote y cada dataset tiene su
// propia tabla tipada con PK real (ver 058_webhooks_informacion_brands.sql):
// acá se hace upsert real (INSERT ... ON CONFLICT DO UPDATE) por lote, no un
// insert ciego. La auth (token, activo, célula) sigue viviendo en
// `webhooks_registro` — mismo registro que usa el receptor genérico, slug
// "informacion-brands" (ya creado desde /integraciones).
//
// Al ser un segmento literal, Next.js la resuelve antes que la ruta dinámica
// [slug] para este path exacto — no hace falta tocar esa ruta genérica.
export const runtime = "nodejs";
export const maxDuration = 120; // Data espera hasta 120s por lote antes de reintentar

const SLUG = "informacion-brands";

interface SobreWebhook {
  origen?: string;
  dataset?: string;
  version?: number;
  ventana?: Record<string, unknown>;
  lote?: { numero?: number; total?: number; filas?: number; filas_totales?: number };
  registros?: unknown[];
}

async function buscarWebhook() {
  if (!supabase) return null;
  const { data } = await supabase
    .from("webhooks_registro")
    .select("id, slug, nombre, activo, token_sha256")
    .eq("slug", SLUG)
    .maybeSingle();
  return data;
}

async function registrarEntrega(a: {
  webhookId: string;
  ok: boolean;
  dataset: string | null;
  loteNumero: number | null;
  loteTotal: number | null;
  idempotencyKey: string | null;
  recibidos: number;
  escritos: number;
  bytes: number;
  headers: Record<string, string>;
  mensaje: string | null;
}) {
  if (!supabase) return;
  const { error } = await supabase.from("webhooks_entregas").insert({
    webhook_id: a.webhookId,
    ok: a.ok,
    fuente: "externo",
    dataset: a.dataset,
    lote_numero: a.loteNumero,
    lote_total: a.loteTotal,
    idempotency_key: a.idempotencyKey,
    registros_recibidos: a.recibidos,
    registros_escritos: a.escritos,
    bytes: a.bytes,
    headers: a.headers,
    mensaje: a.mensaje,
  });
  if (error) console.error("[webhooks/informacion-brands] no se pudo escribir la entrega:", error.message);
}

export async function POST(req: NextRequest) {
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase no configurado" }, { status: 500 });
  }

  const wh = await buscarWebhook();
  if (!wh) {
    return NextResponse.json({ ok: false, error: "Webhook no encontrado" }, { status: 404 });
  }

  // Auth ANTES de leer el cuerpo.
  const token = bearerDeHeader(req.headers.get("authorization"));
  if (!token || !tokenCoincide(token, wh.token_sha256)) {
    return NextResponse.json({ ok: false, error: "No autorizado" }, { status: 401 });
  }
  if (!wh.activo) {
    return NextResponse.json({ ok: false, error: "Webhook inactivo" }, { status: 403 });
  }

  const idempotencyKey = req.headers.get("x-idempotency-key");
  const raw = Buffer.from(await req.arrayBuffer());
  const cuerpo = leerCuerpo(raw, req.headers.get("content-encoding"));
  if (!cuerpo.ok) {
    return NextResponse.json({ ok: false, error: cuerpo.error }, { status: cuerpo.status });
  }

  let sobre: SobreWebhook;
  try {
    sobre = JSON.parse(cuerpo.texto);
  } catch {
    return NextResponse.json({ ok: false, error: "Body no es JSON válido" }, { status: 400 });
  }

  const dataset = sobre.dataset ?? null;
  const loteNumero = sobre.lote?.numero ?? null;
  const loteTotal = sobre.lote?.total ?? null;
  const headers: Record<string, string> = {};
  for (const k of ["content-type", "content-encoding", "content-length", "user-agent"]) {
    const v = req.headers.get(k);
    if (v) headers[k] = v;
  }

  const acuseBase = { dataset, lote: loteNumero };

  if (!dataset || !DATASETS[dataset]) {
    const mensaje = `Dataset desconocido: "${dataset ?? ""}"`;
    await registrarEntrega({
      webhookId: wh.id, ok: false, dataset, loteNumero, loteTotal, idempotencyKey,
      recibidos: 0, escritos: 0, bytes: raw.length, headers, mensaje,
    });
    return NextResponse.json({ ok: false, ...acuseBase, error: mensaje, errores: [mensaje] }, { status: 422 });
  }

  const registros = Array.isArray(sobre.registros) ? sobre.registros : [];
  if (registros.length === 0) {
    const mensaje = "Lote vacío no permitido";
    await registrarEntrega({
      webhookId: wh.id, ok: false, dataset, loteNumero, loteTotal, idempotencyKey,
      recibidos: 0, escritos: 0, bytes: raw.length, headers, mensaje,
    });
    return NextResponse.json({ ok: false, ...acuseBase, recibidos: 0, escritos: 0, error: mensaje, errores: [mensaje] }, { status: 400 });
  }

  const spec = DATASETS[dataset];
  const filas = registros.map((r) => filtrarColumnas(r, spec)).filter((f): f is Record<string, unknown> => f !== null);

  if (filas.length !== registros.length) {
    const mensaje = `${registros.length - filas.length} registro(s) no son objetos JSON válidos`;
    await registrarEntrega({
      webhookId: wh.id, ok: false, dataset, loteNumero, loteTotal, idempotencyKey,
      recibidos: registros.length, escritos: 0, bytes: raw.length, headers, mensaje,
    });
    return NextResponse.json({ ok: false, ...acuseBase, recibidos: registros.length, escritos: 0, error: mensaje, errores: [mensaje] }, { status: 422 });
  }

  const { error } = await supabase.from(spec.tabla).upsert(filas, { onConflict: spec.conflictoEn.join(",") });
  const escritos = error ? 0 : filas.length;
  const ok = !error;

  await registrarEntrega({
    webhookId: wh.id, ok, dataset, loteNumero, loteTotal, idempotencyKey,
    recibidos: registros.length, escritos, bytes: raw.length, headers,
    mensaje: error?.message ?? null,
  });

  if (ok) {
    await supabase.from("webhooks_registro").update({ ultima_entrega_en: new Date().toISOString() }).eq("id", wh.id);
    return NextResponse.json({ ok: true, ...acuseBase, recibidos: registros.length, escritos, errores: [] }, { status: 200 });
  }

  return NextResponse.json(
    { ok: false, ...acuseBase, recibidos: registros.length, escritos: 0, error: error!.message, errores: [error!.message] },
    { status: 500 },
  );
}

// GET — contrato del webhook, para que Data sepa cómo llamarlo.
export async function GET() {
  const wh = await buscarWebhook();
  if (!wh) return NextResponse.json({ error: "Webhook no encontrado" }, { status: 404 });

  return NextResponse.json({
    status: wh.activo ? "active" : "inactive",
    endpoint: `/api/webhooks/in/${SLUG}`,
    metodo: "POST",
    auth: "Authorization: Bearer <token>",
    idempotencia: "Header X-Idempotency-Key — el upsert por PK ya es idempotente por diseño",
    datasets: Object.keys(DATASETS),
    body: "Sobre { origen, dataset, version, ventana, lote, registros: [...] } — ver spec v1.0 04-sep-2026",
    acuse: "{ ok, dataset, lote, recibidos, escritos, errores }",
  });
}
