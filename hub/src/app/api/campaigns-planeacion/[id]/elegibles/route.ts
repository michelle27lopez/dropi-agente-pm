import { NextRequest, NextResponse } from "next/server";
import { localListEligibleProducts } from "@/lib/local-store-planeacion";
import { supabaseListEligibleProducts } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Uso interno (detrás del login) — lista los links de "productos elegibles"
// de todos los proveedores, para que el equipo los encuentre rápido desde
// Resumen. La ruta pública de solo un proveedor vive en ./[token]/route.ts.
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const entries = (await supabaseListEligibleProducts(id)) ?? (await localListEligibleProducts(id));
  return NextResponse.json(
    entries.map((e) => ({
      token: e.token,
      supplier_id: e.supplier_id,
      supplier_name: e.supplier_name,
      product_count: e.products.length,
      submitted_at: e.submitted_at ?? null,
      approved_at: e.approved_at ?? null,
      view_count: e.view_count ?? 0,
      last_viewed_at: e.last_viewed_at ?? null,
      meet_click_count: e.meet_click_count ?? 0,
      meet_last_clicked_at: e.meet_last_clicked_at ?? null,
      meet_attended: e.meet_attended ?? false,
      // Los productos que postuló, resueltos a nombre — para que el equipo
      // haga la curaduría viendo qué es cada cosa, no solo IDs.
      selected: (e.selectedProductIds ?? []).map((pid) => {
        const p = e.products.find((x) => String(x.id) === String(pid));
        return { id: pid, name: p?.name ?? String(pid), stock: p?.stock ?? null };
      }),
    }))
  );
}
