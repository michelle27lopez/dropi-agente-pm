import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { restaurarRespaldoRawData } from "@/lib/onboarding-ttfo/almacenLocal";

// Deshace SOLO la última carga de Raw Data confirmada — vuelve al estado de
// justo antes de esa carga (la base histórica, o un empalme de Raw Data
// previo), sin tocar el respaldo histórico. Ver almacenLocal.ts.

export const runtime = "nodejs";

export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    await restaurarRespaldoRawData();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error restaurando la carga de Raw Data anterior" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
