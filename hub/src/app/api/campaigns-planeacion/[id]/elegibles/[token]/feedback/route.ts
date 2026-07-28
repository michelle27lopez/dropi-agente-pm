import { NextRequest, NextResponse } from "next/server";
import { localSetFeedback } from "@/lib/local-store-planeacion";
import { supabaseSetFeedback } from "@/lib/supabase-store-planeacion";

// Pública (sin login), igual que /checklist — el proveedor deja feedback de
// cierre una sola vez. La UI ya se encarga de no reenviar si `entry.feedback`
// existe, pero el endpoint no lo bloquea (permite corregir si vuelve a postear).
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const { id, token } = await params;
  const body = await req.json().catch(() => null);
  const rating = Number(body?.rating);
  const comment = typeof body?.comment === "string" && body.comment.trim() ? body.comment.trim().slice(0, 500) : undefined;

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating inválido" }, { status: 400 });
  }

  const updated =
    (await supabaseSetFeedback(id, token, rating, comment)) ??
    (await localSetFeedback(id, token, rating, comment));
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ feedback: updated.feedback ?? null });
}
