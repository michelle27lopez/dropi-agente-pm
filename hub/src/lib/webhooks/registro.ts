import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { gunzipSync, inflateSync } from "node:zlib";
import { supabase } from "@/lib/supabase";

// Registro genérico de webhooks entrantes. Esta lib es la única que sabe:
//   - cómo se genera y verifica un token,
//   - cómo se explota un body (objeto / arreglo / NDJSON) a filas,
//   - cómo se deja el acuse de cada entrega.
// La comparten la ruta pública /api/webhooks/in/[slug] y la ruta de prueba
// interna, para no divergir en el mapeo.

export const MAX_BYTES = 4 * 1024 * 1024; // 4 MB descomprimidos — techo real de Vercel
export const CHUNK = 500;                 // filas por sentencia de insert
const CAMPOS_ARREGLO = ["registros", "data", "items", "rows", "records", "payload", "results"];

// ── Token ────────────────────────────────────────────────────────────────

export function generarToken(): { token: string; sha256: string; prefix: string } {
  const token = "whk_" + randomBytes(24).toString("base64url");
  return { token, sha256: sha256Hex(token), prefix: token.slice(0, 10) };
}

export function sha256Hex(valor: string): string {
  return createHash("sha256").update(valor, "utf8").digest("hex");
}

/** Compara el token recibido contra el hash guardado, en tiempo constante. */
export function tokenCoincide(tokenRecibido: string, sha256Guardado: string): boolean {
  const a = Buffer.from(sha256Hex(tokenRecibido), "hex");
  const b = Buffer.from(sha256Guardado, "hex");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function bearerDeHeader(authHeader: string | null): string | null {
  if (!authHeader) return null;
  const m = authHeader.match(/^Bearer\s+(.+)$/i);
  return m ? m[1].trim() : null;
}

// ── Slug ─────────────────────────────────────────────────────────────────

export function slugify(nombre: string): string {
  return nombre
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "webhook";
}

/** Devuelve un slug libre, agregando -2, -3… si ya existe. */
export async function slugDisponible(base: string): Promise<string> {
  if (!supabase) return base;
  const { data } = await supabase
    .from("webhooks_registro")
    .select("slug")
    .like("slug", `${base}%`);
  const usados = new Set((data ?? []).map((r) => r.slug));
  if (!usados.has(base)) return base;
  for (let i = 2; i < 999; i++) {
    if (!usados.has(`${base}-${i}`)) return `${base}-${i}`;
  }
  return `${base}-${Date.now()}`;
}

// ── Lectura del body ─────────────────────────────────────────────────────

/** Descomprime si viene con Content-Encoding y valida el tope de tamaño. */
export function leerCuerpo(buf: Buffer, contentEncoding: string | null): { ok: true; texto: string } | { ok: false; error: string; status: number } {
  let bytes = buf;
  try {
    const enc = (contentEncoding || "").toLowerCase();
    if (enc.includes("gzip")) bytes = gunzipSync(buf);
    else if (enc.includes("deflate")) bytes = inflateSync(buf);
  } catch {
    return { ok: false, error: "No se pudo descomprimir el body", status: 400 };
  }
  if (bytes.length > MAX_BYTES) {
    return { ok: false, error: `Body de ${bytes.length} bytes supera el tope de ${MAX_BYTES}. Envía en lotes.`, status: 413 };
  }
  return { ok: true, texto: bytes.toString("utf8") };
}

type Explotado = { registros: unknown[]; meta: Record<string, unknown> };

/**
 * Convierte el texto del body en una lista de registros:
 *   - arreglo JSON            → un registro por elemento
 *   - objeto con un campo array conocido (registros/data/items…) → explota ese
 *     campo, el resto de props escalares quedan como `meta`
 *   - NDJSON (una línea = un JSON) → un registro por línea
 *   - objeto suelto           → un solo registro
 * `campoForzado` (query ?campo=) tiene prioridad sobre la detección.
 */
export function explotarBody(texto: string, campoForzado?: string | null): { ok: true; datos: Explotado } | { ok: false; error: string } {
  const limpio = texto.trim();
  if (!limpio) return { ok: false, error: "Body vacío" };

  let json: unknown;
  try {
    json = JSON.parse(limpio);
  } catch {
    // ¿NDJSON?
    const lineas = limpio.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsed: unknown[] = [];
    for (const l of lineas) {
      try { parsed.push(JSON.parse(l)); }
      catch { return { ok: false, error: "Body no es JSON ni NDJSON válido" }; }
    }
    if (parsed.length === 0) return { ok: false, error: "Body no es JSON ni NDJSON válido" };
    return { ok: true, datos: { registros: parsed, meta: {} } };
  }

  if (Array.isArray(json)) {
    return { ok: true, datos: { registros: json, meta: {} } };
  }

  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    const campo = campoForzado && Array.isArray(obj[campoForzado])
      ? campoForzado
      : CAMPOS_ARREGLO.find((c) => Array.isArray(obj[c]));
    if (campo) {
      const meta: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(obj)) {
        if (k !== campo) meta[k] = v;
      }
      return { ok: true, datos: { registros: obj[campo] as unknown[], meta } };
    }
    return { ok: true, datos: { registros: [obj], meta: {} } };
  }

  return { ok: false, error: "Body debe ser un objeto o arreglo JSON" };
}

/** Headers que vale la pena conservar en el acuse (sin Authorization). */
export function headersRelevantes(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  for (const k of ["content-type", "content-encoding", "content-length", "user-agent", "x-forwarded-for", "x-origen", "x-lote", "x-lote-total"]) {
    const v = h.get(k);
    if (v) out[k] = v;
  }
  return out;
}

// ── Persistencia ─────────────────────────────────────────────────────────

export interface AcuseWebhook {
  ok: boolean;
  lote_id: string;
  registros_recibidos: number;
  registros_escritos: number;
  mensaje: string | null;
}

export interface WebhookRow {
  id: string;
  slug: string;
  nombre: string;
}

/**
 * Guarda una entrega completa: explota el body, hace inserts por chunks de
 * CHUNK filas (nunca fila por fila) y deja el acuse en webhooks_entregas.
 */
export async function procesarEntrega(args: {
  webhook: WebhookRow;
  texto: string;
  campo?: string | null;
  bytes: number;
  headers: Record<string, string>;
  fuente: "externo" | "prueba";
}): Promise<{ status: number; acuse: AcuseWebhook }> {
  const loteId = randomUUID();
  const base: AcuseWebhook = { ok: false, lote_id: loteId, registros_recibidos: 0, registros_escritos: 0, mensaje: null };

  if (!supabase) {
    return { status: 500, acuse: { ...base, mensaje: "Supabase no configurado" } };
  }

  const explotado = explotarBody(args.texto, args.campo);
  if (!explotado.ok) {
    await registrarEntrega({ webhook_id: args.webhook.id, ok: false, recibidos: 0, escritos: 0, bytes: args.bytes, lote_id: loteId, headers: args.headers, fuente: args.fuente, mensaje: explotado.error });
    return { status: 400, acuse: { ...base, mensaje: explotado.error } };
  }

  const { registros, meta } = explotado.datos;
  const recibidos = registros.length;
  const ahora = new Date().toISOString();

  const filas = registros.map((payload, i) => ({
    webhook_id: args.webhook.id,
    lote_id: loteId,
    lote_seq: i,
    recibido_en: ahora,
    payload: payload ?? null,
    lote_meta: meta,
  }));

  let escritos = 0;
  let errorMsg: string | null = null;
  for (let i = 0; i < filas.length; i += CHUNK) {
    const trozo = filas.slice(i, i + CHUNK);
    const { error } = await supabase.from("webhooks_entradas").insert(trozo);
    if (error) { errorMsg = error.message; break; }
    escritos += trozo.length;
  }

  const ok = !errorMsg && escritos === recibidos && recibidos > 0;

  await registrarEntrega({ webhook_id: args.webhook.id, ok, recibidos, escritos, bytes: args.bytes, lote_id: loteId, headers: args.headers, fuente: args.fuente, mensaje: errorMsg ?? (recibidos === 0 ? "0 registros en el body" : null) });

  if (ok || escritos > 0) {
    await supabase.from("webhooks_registro").update({ ultima_entrega_en: ahora }).eq("id", args.webhook.id);
  }

  return {
    status: errorMsg ? 500 : 200,
    acuse: { ok, lote_id: loteId, registros_recibidos: recibidos, registros_escritos: escritos, mensaje: errorMsg ?? (recibidos === 0 ? "0 registros en el body" : null) },
  };
}

async function registrarEntrega(a: {
  webhook_id: string; ok: boolean; recibidos: number; escritos: number;
  bytes: number; lote_id: string; headers: Record<string, string>;
  fuente: "externo" | "prueba"; mensaje: string | null;
}) {
  if (!supabase) return;
  const { error } = await supabase.from("webhooks_entregas").insert({
    webhook_id: a.webhook_id,
    ok: a.ok,
    fuente: a.fuente,
    registros_recibidos: a.recibidos,
    registros_escritos: a.escritos,
    bytes: a.bytes,
    lote_id: a.lote_id,
    headers: a.headers,
    mensaje: a.mensaje,
  });
  if (error) console.error("[webhooks] no se pudo escribir la entrega:", error.message);
}

/** Payload sintético para el botón «Enviar prueba» de /integraciones. */
export function payloadDePrueba(): string {
  return JSON.stringify({
    origen: "prueba-integraciones",
    generado_en: new Date().toISOString(),
    registros: [
      { id: 1, ejemplo: "fila de prueba", valor: 42 },
      { id: 2, ejemplo: "segunda fila", valor: 7 },
    ],
  });
}
