import { NextRequest, NextResponse } from "next/server";
import { localListEligibleProducts, QA_ELIGIBLE_TOKEN } from "@/lib/local-store-planeacion";
import { supabaseListEligibleProducts } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Uso interno (detrás del login) — descarga las selecciones postuladas como
// CSV para trabajar la curaduría en Excel. BOM UTF-8 para que Excel muestre
// bien las tildes y separador ";" que es el que espera Excel en es-CO.
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const entries = (await supabaseListEligibleProducts(id)) ?? (await localListEligibleProducts(id));

  const esc = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const rows: string[] = ["Proveedor;ID proveedor;ID producto;Producto;Categoría;Stock;Fecha postulación;Aprobado"];
  for (const e of entries) {
    if (e.token === QA_ELIGIBLE_TOKEN) continue;
    if (!e.submitted_at) continue;
    const fecha = new Date(e.submitted_at).toLocaleDateString("es-CO");
    const aprobado = e.approved_at ? new Date(e.approved_at).toLocaleDateString("es-CO") : "Pendiente";
    for (const pid of e.selectedProductIds ?? []) {
      const p = e.products.find((x) => String(x.id) === String(pid));
      rows.push([
        esc(e.supplier_name),
        esc(String(e.supplier_id).replace(".0", "")),
        esc(pid),
        esc(p?.name ?? ""),
        esc(p?.category ?? ""),
        esc(p?.stock ?? ""),
        esc(fecha),
        esc(aprobado),
      ].join(";"));
    }
  }

  return new NextResponse("\uFEFF" + rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="selecciones-cyberdays.csv"',
    },
  });
}
