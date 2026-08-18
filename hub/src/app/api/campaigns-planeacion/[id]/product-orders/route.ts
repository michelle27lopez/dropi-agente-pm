import { NextRequest, NextResponse } from "next/server";
import { localListProductOrders, localUpsertProductOrder } from "@/lib/local-store-planeacion";
import { supabaseListProductOrders, supabaseUpsertProductOrder } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Uso interno (detrás del login) — órdenes generadas por producto dentro de
// la campaña. No hay integración en vivo con órdenes reales de Dropi: el
// número se carga a mano o por import de CSV (ver ./import).
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const entries = (await supabaseListProductOrders(id)) ?? (await localListProductOrders(id));
  return NextResponse.json(entries);
}

// Carga manual de un producto a la vez.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const productId = typeof body?.productId === "string" ? body.productId.trim() : "";
  const ordersCount = Number(body?.ordersCount);
  if (!productId || !Number.isFinite(ordersCount) || ordersCount < 0) {
    return NextResponse.json({ error: "Falta 'productId' o 'ordersCount' inválido" }, { status: 400 });
  }

  const productName = typeof body?.productName === "string" ? body.productName.trim() : undefined;
  const updated =
    (await supabaseUpsertProductOrder(id, productId, productName, ordersCount, "manual")) ??
    (await localUpsertProductOrder(id, productId, productName, ordersCount, "manual"));
  return NextResponse.json(updated);
}
