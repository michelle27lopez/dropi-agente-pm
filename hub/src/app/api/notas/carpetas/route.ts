import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { listCarpetas, createCarpeta } from "@/lib/notas-store";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json(listCarpetas());
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { nombre } = await req.json();
  if (!nombre?.trim()) return NextResponse.json({ error: "nombre es requerido" }, { status: 400 });

  const carpeta = createCarpeta(nombre.trim());
  return NextResponse.json(carpeta, { status: 201 });
}
