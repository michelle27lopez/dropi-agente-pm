import { NextRequest, NextResponse } from "next/server";
import { localImportProductOrders } from "@/lib/local-store-planeacion";
import { supabaseImportProductOrders } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

type ImportRow = { productId: string; productName?: string; ordersCount: number };

// Import de CSV/Excel ya parseado en el cliente (mismo patrón que el Excel de
// convocatoria en Ejecución) — reemplaza en bloque las órdenes de los
// productos que vienen en el archivo, sin tocar los que no aparecen en él.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const rows: unknown = body?.rows;
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "Falta 'rows' (array de {productId, productName?, ordersCount})" }, { status: 400 });
  }

  const cleaned: ImportRow[] = rows
    .map((r: { productId?: unknown; productName?: unknown; ordersCount?: unknown }) => ({
      productId: String(r?.productId ?? "").trim(),
      productName: r?.productName != null ? String(r.productName).trim() : undefined,
      ordersCount: Number(r?.ordersCount),
    }))
    .filter((r) => r.productId && Number.isFinite(r.ordersCount) && r.ordersCount >= 0);

  if (cleaned.length === 0) {
    return NextResponse.json({ error: "Ninguna fila válida (revisa las columnas producto/órdenes)" }, { status: 400 });
  }

  const updated =
    (await supabaseImportProductOrders(id, cleaned)) ??
    (await localImportProductOrders(id, cleaned));
  return NextResponse.json({ imported: cleaned.length, entries: updated });
}
