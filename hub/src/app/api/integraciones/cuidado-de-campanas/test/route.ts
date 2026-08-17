import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { procesarLoteCuidadoCampanas, payloadDePrueba } from "@/lib/webhooks/cuidadoCampanas";

// Dispara el mismo mapeo/upsert que el webhook real, pero sin pasar por
// Bearer token: la autorización acá es la sesión del hub (requireUser), y el
// payload es sintético (ver payloadDePrueba). Así "enviar una prueba y recibir
// 200" se verifica desde la propia UI sin exponer el token al navegador.
export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { status, acuse } = await procesarLoteCuidadoCampanas(payloadDePrueba(), "test");
  return NextResponse.json(acuse, { status });
}
