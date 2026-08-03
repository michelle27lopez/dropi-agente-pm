import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { leerExclusiones, agregarExclusion, quitarExclusion } from "@/lib/onboarding-ttfo/almacenLocal";

// Lista de exclusión manual de cuentas de prueba — para casos NO detectables
// por patrón (ej. Catalina Trujillo, confirmada como cuenta de prueba por el
// equipo el 28-jul-2026 pese a tener nombre de apariencia real). Guardada en
// hub/data/onboarding-ttfo-exclusiones.json, no en Supabase (ver route.ts).

export const runtime = "nodejs";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const exclusiones = await leerExclusiones();
  return NextResponse.json({ exclusiones });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const userId = Number(body?.userId);
  const motivo = String(body?.motivo ?? "").trim();
  if (!Number.isFinite(userId) || !motivo) {
    return NextResponse.json({ error: "Falta userId (número) o motivo." }, { status: 400 });
  }

  await agregarExclusion(userId, motivo, user.email ?? user.id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const userId = Number(req.nextUrl.searchParams.get("userId"));
  if (!Number.isFinite(userId)) {
    return NextResponse.json({ error: "Falta userId (número) en el query string." }, { status: 400 });
  }

  await quitarExclusion(userId);
  return NextResponse.json({ ok: true });
}
