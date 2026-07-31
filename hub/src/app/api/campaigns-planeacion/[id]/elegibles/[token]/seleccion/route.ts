import { NextRequest, NextResponse } from "next/server";
import { localGetEligibleByToken, localSetEligibleSelection } from "@/lib/local-store-planeacion";
import { supabaseGetEligibleByToken, supabaseSetEligibleSelection } from "@/lib/supabase-store-planeacion";

const MAX_PRODUCTS = 10;
// Cierre de la ventana de selección — mismo hardcode de campaña única que el
// journey del GET ([token]/route.ts). Hasta esta fecha (inclusive) el
// proveedor puede reenviar su selección las veces que quiera; después queda
// sellada y los cambios van por WhatsApp.
const SELECTION_END = "2026-07-31";

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
  if (new Date().toISOString().slice(0, 10) > SELECTION_END) {
    return NextResponse.json({ error: "La selección cerró el 31 de julio. Escríbenos por WhatsApp para cambios." }, { status: 403 });
  }
  if (entry.approved_at) {
    return NextResponse.json({ error: "Tu selección ya fue aprobada y no se puede editar. Escríbenos por WhatsApp para cambios." }, { status: 403 });
  }

  const updated = usingSupabase
    ? await supabaseSetEligibleSelection(id, token, productIds)
    : await localSetEligibleSelection(id, token, productIds);
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}
