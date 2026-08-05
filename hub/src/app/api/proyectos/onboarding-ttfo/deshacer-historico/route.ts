import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { restaurarRespaldoHistorico } from "@/lib/onboarding-ttfo/almacenLocal";

// Deshace la última carga HISTÓRICA (CSV) confirmada, volviendo al estado
// justo antes de ella. Como la base histórica es el piso sobre el que se
// suma todo el Raw Data posterior, esto arrastra también cualquier Raw Data
// acumulado desde entonces — restaurarRespaldoHistorico ya invalida ese
// respaldo aparte. Ver almacenLocal.ts.

export const runtime = "nodejs";

export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  try {
    await restaurarRespaldoHistorico();
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error restaurando la carga histórica anterior" }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}
