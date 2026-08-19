import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { localResetEligibleToken } from "@/lib/local-store-planeacion";
import { supabaseResetEligibleToken } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Uso interno (detrás del login) — invalida el link actual de un proveedor
// (por ejemplo si se filtró o se compartió por error) y le asigna uno nuevo.
export async function POST(_: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, token } = await params;
  const newToken = randomUUID().replace(/-/g, "").slice(0, 22);

  const entry = (await supabaseResetEligibleToken(id, token, newToken)) ?? (await localResetEligibleToken(id, token, newToken));
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ token: entry.token });
}
