import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { listNotas, createNota } from "@/lib/notas-store";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  return NextResponse.json(listNotas());
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const carpeta_id = body?.carpeta_id ?? null;

  const nota = createNota(carpeta_id);
  return NextResponse.json(nota, { status: 201 });
}
