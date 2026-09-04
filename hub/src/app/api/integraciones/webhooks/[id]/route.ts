import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

const COLS = "id, nombre, slug, descripcion, celula_id, token_prefix, activo, creado_por, creado_en, token_rotado_en, ultima_entrega_en";

// PATCH — editar webhook. Body: { nombre?, descripcion?, celula_id?, activo? }
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { id } = await params;
  const body = await req.json().catch(() => ({})) as {
    nombre?: string; descripcion?: string; celula_id?: string | null; activo?: boolean;
  };

  const patch: Record<string, unknown> = {};
  if (typeof body.nombre === "string" && body.nombre.trim()) patch.nombre = body.nombre.trim();
  if (typeof body.descripcion === "string") patch.descripcion = body.descripcion.trim() || null;
  if (body.celula_id === null || typeof body.celula_id === "string") patch.celula_id = body.celula_id || null;
  if (typeof body.activo === "boolean") patch.activo = body.activo;

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nada que actualizar" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("webhooks_registro")
    .update(patch)
    .eq("id", id)
    .select(COLS)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — borra el webhook y en cascada sus entregas y entradas.
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { id } = await params;
  const { error } = await supabase.from("webhooks_registro").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
