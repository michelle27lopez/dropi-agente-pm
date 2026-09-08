import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  bearerDeHeader,
  tokenCoincide,
  leerCuerpo,
  headersRelevantes,
  procesarEntrega,
} from "@/lib/webhooks/registro";

// Receptor genérico de webhooks entrantes registrados desde /integraciones.
// No llega con cookie de sesión del hub — llega con `Authorization: Bearer
// <token>`, que se valida acá contra el hash guardado. La ruta es pública en
// src/proxy.ts (prefijo /api/webhooks/).
//
// Runtime nodejs (no edge): usa node:crypto y node:zlib, y el destino es
// Postgres/Supabase por socket TCP.
export const runtime = "nodejs";
export const maxDuration = 60;

async function buscarWebhook(slug: string) {
  if (!supabase) return null;
  const { data } = await supabase
    .from("webhooks_registro")
    .select("id, slug, nombre, activo, token_sha256")
    .eq("slug", slug)
    .maybeSingle();
  return data;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Supabase no configurado" }, { status: 500 });
  }

  const wh = await buscarWebhook(slug);
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

  const raw = Buffer.from(await req.arrayBuffer());
  const cuerpo = leerCuerpo(raw, req.headers.get("content-encoding"));
  if (!cuerpo.ok) {
    return NextResponse.json({ ok: false, error: cuerpo.error }, { status: cuerpo.status });
  }

  const campo = new URL(req.url).searchParams.get("campo");
  const { status, acuse } = await procesarEntrega({
    webhook: { id: wh.id, slug: wh.slug, nombre: wh.nombre },
    texto: cuerpo.texto,
    campo,
    bytes: raw.length,
    headers: headersRelevantes(req.headers),
    fuente: "externo",
  });

  return NextResponse.json(acuse, { status });
}

// GET — contrato del webhook, para que quien lo va a usar sepa cómo llamarlo.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const wh = await buscarWebhook(slug);
  if (!wh) return NextResponse.json({ error: "Webhook no encontrado" }, { status: 404 });

  return NextResponse.json({
    status: wh.activo ? "active" : "inactive",
    nombre: wh.nombre,
    endpoint: `/api/webhooks/in/${wh.slug}`,
    metodo: "POST",
    auth: "Authorization: Bearer <token>",
    body: "JSON (objeto, arreglo o { registros: [...] }) o NDJSON. Un arreglo se guarda como una fila por elemento.",
    comprimido: "opcional: Content-Encoding: gzip | deflate",
    tope: "4 MB descomprimidos por request — si es más, enviar en lotes",
    override_campo: "?campo=<nombre> fuerza qué propiedad del objeto se explota",
  });
}
