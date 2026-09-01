import { NextRequest, NextResponse } from "next/server";
import { localGetEligibleByToken, localSetEligibleSelection } from "@/lib/local-store-planeacion";
import { supabaseGetEligibleByToken, supabaseSetEligibleSelection } from "@/lib/supabase-store-planeacion";

const MAX_PRODUCTS = 10;
// Sin cierre por fecha (24/08): antes había un SELECTION_END que sellaba la
// selección el 23 de agosto, y quien entrara después se topaba con la grilla
// muerta y un 403. Decisión de Michelle — la selección queda siempre abierta;
// lo único que la sella es que el equipo apruebe la curaduría (ver abajo).
// Las fechas del journey ([token]/route.ts) siguen siendo informativas.

// Pública (sin login) — el proveedor postula sus productos directo desde su
// página de token, reemplazando el formulario de Google.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const { id, token } = await params;
  const body = await req.json().catch(() => null);
  const productIds = Array.isArray(body?.productIds) ? body.productIds : null;

  if (!productIds || productIds.length === 0) {
    return NextResponse.json({ error: "Elige al menos 1 producto" }, { status: 400 });
  }
  if (productIds.length > MAX_PRODUCTS) {
    return NextResponse.json({ error: `Máximo ${MAX_PRODUCTS} productos` }, { status: 400 });
  }

  const usingSupabase = Boolean(await supabaseGetEligibleByToken(id, token));
  const entry = usingSupabase ? await supabaseGetEligibleByToken(id, token) : await localGetEligibleByToken(id, token);
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  if (entry.approved_at) {
    return NextResponse.json({ error: "Tu selección ya fue aprobada y no se puede editar. Escríbenos por WhatsApp para cambios." }, { status: 403 });
  }

  const updated = usingSupabase
    ? await supabaseSetEligibleSelection(id, token, productIds)
    : await localSetEligibleSelection(id, token, productIds);
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}
