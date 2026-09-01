import { NextRequest, NextResponse } from "next/server";
import { localResetEligibleEstado } from "@/lib/local-store-planeacion";
import { supabaseResetEligibleEstado } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Uso interno (detrás del login) — devuelve un proveedor al estado inicial
// conservando su link. Es lo que hace reusable al proveedor de QA (token fijo
// `qa-cyberdays`): se puede recorrer el flujo completo y volver a empezar sin
// tener que copiar un link nuevo cada vez, como sí obliga /reset.
export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, token } = await params;

  const entry = (await supabaseResetEligibleEstado(id, token)) ?? (await localResetEligibleEstado(id, token));
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ token: entry.token });
}
