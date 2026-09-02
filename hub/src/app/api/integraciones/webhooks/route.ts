import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";
import { generarToken, slugify, slugDisponible } from "@/lib/webhooks/registro";

// BFF de /integraciones — solo para usuarios logueados del hub. No confundir
// con /api/webhooks/in/[slug], que es el receptor externo con Bearer token.
// El hash del token (token_sha256) nunca se selecciona acá: no llega al browser.

const COLS = "id, nombre, slug, descripcion, celula_id, token_prefix, activo, creado_por, creado_en, token_rotado_en, ultima_entrega_en";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ webhooks: [], celulas: [] });

  const { data: webhooks, error } = await supabase
    .from("webhooks_registro")
    .select(COLS)
    .order("creado_en", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: celulas } = await supabase
    .from("celulas")
    .select("id, nombre")
    .order("nombre", { ascending: true });

  // Conteos por webhook: entradas totales y última entrega ok/fallida.
  const ids = (webhooks ?? []).map((w) => w.id);
  const conteos: Record<string, { entradas: number; entregas: number; ultima_ok: boolean | null }> = {};
  if (ids.length) {
    const { data: entregas } = await supabase
      .from("webhooks_entregas")
      .select("webhook_id, ok, registros_escritos, recibido_en")
      .in("webhook_id", ids)
      .order("recibido_en", { ascending: false });
    for (const e of entregas ?? []) {
      const c = conteos[e.webhook_id] ?? { entradas: 0, entregas: 0, ultima_ok: null };
      c.entregas += 1;
      c.entradas += e.registros_escritos ?? 0;
      if (c.ultima_ok === null) c.ultima_ok = e.ok;
      conteos[e.webhook_id] = c;
    }
  }

  const conMeta = (webhooks ?? []).map((w) => ({
    ...w,
    entradas: conteos[w.id]?.entradas ?? 0,
    entregas: conteos[w.id]?.entregas ?? 0,
    ultima_ok: conteos[w.id]?.ultima_ok ?? null,
  }));

  return NextResponse.json({ webhooks: conMeta, celulas: celulas ?? [] });
}

// POST — crear webhook. Body: { nombre, celula_id?, descripcion? }
// Devuelve el token UNA vez (nunca se vuelve a poder ver).
export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const body = await req.json().catch(() => ({})) as {
    nombre?: string; celula_id?: string | null; descripcion?: string;
  };

  const nombre = (body.nombre ?? "").trim();
  if (!nombre) return NextResponse.json({ error: "El nombre es obligatorio" }, { status: 400 });

  const slug = await slugDisponible(slugify(nombre));
  const { token, sha256, prefix } = generarToken();

  const { data, error } = await supabase
    .from("webhooks_registro")
    .insert({
      nombre,
      slug,
      descripcion: (body.descripcion ?? "").trim() || null,
      celula_id: body.celula_id || null,
      token_sha256: sha256,
      token_prefix: prefix,
      creado_por: user.email ?? null,
    })
    .select(COLS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ webhook: data, token });
}
