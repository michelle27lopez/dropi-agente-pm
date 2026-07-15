import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { renameCarpeta, deleteCarpeta } from "@/lib/notas-store";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const { nombre } = await req.json();
  if (!nombre?.trim()) return NextResponse.json({ error: "nombre es requerido" }, { status: 400 });

  const carpeta = renameCarpeta(id, nombre.trim());
  if (!carpeta) return NextResponse.json({ error: "Carpeta no encontrada" }, { status: 404 });
  return NextResponse.json(carpeta);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  deleteCarpeta(id);
  return NextResponse.json({ ok: true });
}
