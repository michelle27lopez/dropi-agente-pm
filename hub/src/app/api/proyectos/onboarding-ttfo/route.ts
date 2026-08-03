import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { leerResultado } from "@/lib/onboarding-ttfo/almacenLocal";

// Lee hub/data/onboarding-ttfo.json — resultado completo escrito por
// /importar en cada carga confirmada. Sin Supabase mientras las migraciones
// 039/040 sigan sin aplicar (decisión 2026-07-29: CSV, no BD).

export const runtime = "nodejs";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const resultado = await leerResultado();
  if (!resultado) {
    return NextResponse.json({ filas: [], alertas: null, comparacionOnboarding: null, ultimaImportacion: null });
  }
  return NextResponse.json(resultado);
}
