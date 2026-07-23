import { NextRequest, NextResponse } from "next/server";
import { localApproveEligible, localApproveAllEligible } from "@/lib/local-store-planeacion";
import { supabaseApproveEligible, supabaseApproveAllEligible } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Uso interno (detrás del login) — el equipo aprueba la curaduría desde el
// Resumen. `{ token }` aprueba a un proveedor; `{ all: true }` aprueba de un
// golpe a todos los que postularon y siguen pendientes (el momento del
// WhatsApp masivo). La página pública del proveedor reacciona a `approved_at`.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);

  if (body?.all === true) {
    const supabaseCount = await supabaseApproveAllEligible(id);
    const count = supabaseCount ?? (await localApproveAllEligible(id));
    return NextResponse.json({ approved: count });
  }

  const token = typeof body?.token === "string" ? body.token : "";
  if (!token) return NextResponse.json({ error: "Falta token o all" }, { status: 400 });

  const entry = (await supabaseApproveEligible(id, token)) ?? (await localApproveEligible(id, token));
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (!entry.submitted_at) return NextResponse.json({ error: "Este proveedor no ha postulado" }, { status: 400 });
  return NextResponse.json({ approved_at: entry.approved_at });
}
