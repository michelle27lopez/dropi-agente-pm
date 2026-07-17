import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { updateNota, deleteNota } from "@/lib/notas-store";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  const patch: Parameters<typeof updateNota>[1] = {};
  if (typeof body.titulo === "string") patch.titulo = body.titulo;
  if (typeof body.contenido === "string") patch.contenido = body.contenido;
  if (body.carpeta_id === null || typeof body.carpeta_id === "string") patch.carpeta_id = body.carpeta_id;

  const nota = updateNota(id, patch);
  if (!nota) return NextResponse.json({ error: "Nota no encontrada" }, { status: 404 });
  return NextResponse.json(nota);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  deleteNota(id);
  return NextResponse.json({ ok: true });
}
