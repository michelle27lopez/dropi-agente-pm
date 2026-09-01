import { NextRequest, NextResponse } from "next/server";
import { localListEligibleProducts, QA_ELIGIBLE_TOKEN } from "@/lib/local-store-planeacion";
import { supabaseListEligibleProducts } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Uso interno (detrás del login) — a diferencia de ./export/route.ts (que
// solo trae a quien ya postuló), este trae a los 77 proveedores completos
// de la campaña con su link personalizado, para la convocatoria previa a la
// postulación (ej. subir el token como atributo a UserPilot).
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const entries = (await supabaseListEligibleProducts(id)) ?? (await localListEligibleProducts(id));
  const origin = req.nextUrl.origin;

  const esc = (v: string | number | null | undefined) => {
    const s = v == null ? "" : String(v);
    return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };

  const rows: string[] = ["Proveedor;ID proveedor;Token;Link personalizado"];
  for (const e of entries) {
    // El link de QA no puede colarse en la convocatoria.
    if (e.token === QA_ELIGIBLE_TOKEN) continue;
    rows.push([
      esc(e.supplier_name),
      esc(String(e.supplier_id).replace(".0", "")),
      esc(e.token),
      esc(`${origin}/c/${e.token}`),
    ].join(";"));
  }

  return new NextResponse("﻿" + rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="links-proveedores-cyberdays.csv"',
    },
  });
}
