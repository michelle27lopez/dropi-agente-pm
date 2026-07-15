import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";

// Encola ofertas de ascenso para todo un segmento (Verificado o Premium) sin
// enviar nada todavía — solo crea las filas en ascenso_ofertas con estado
// 'pendiente_envio'. El envío real lo hace /procesar-lote, en tandas
// pequeñas, para no intentar mandar cientos de mensajes en una sola llamada.
export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const { nivelObjetivo } = await req.json();
  if (nivelObjetivo !== "Verificado" && nivelObjetivo !== "Premium") {
    return NextResponse.json({ error: "nivelObjetivo debe ser 'Verificado' o 'Premium'" }, { status: 400 });
  }

  // 1. Traer todos los que cumplen umbral para ese nivel objetivo (paginado).
  const candidatos: { supplier_id: number; supplier_name: string; email: string | null; nivel_actual: string; ordenes_movilizadas_90d: number | null; umbral_objetivo: number }[] = [];
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from("supplier_ascenso_panel")
      .select("supplier_id, supplier_name, email, nivel_actual, ordenes_movilizadas_90d, umbral_objetivo")
      .eq("nivel_objetivo", nivelObjetivo)
      .gte("pct_umbral", 1)
      .range(from, from + 999);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!data || data.length === 0) break;
    candidatos.push(...data);
    if (data.length < 1000) break;
    from += 1000;
  }

  // 2. Excluir a quienes ya tienen una oferta (en cualquier estado).
  const { data: existentes, error: existentesError } = await supabase
    .from("ascenso_ofertas")
    .select("supplier_id");
  if (existentesError) return NextResponse.json({ error: existentesError.message }, { status: 500 });
  const yaTienenOferta = new Set((existentes ?? []).map(o => o.supplier_id));

  const nuevos = candidatos.filter(c => !yaTienenOferta.has(c.supplier_id));

  if (nuevos.length === 0) {
    return NextResponse.json({ encoladas: 0, yaExistian: candidatos.length });
  }

  // 3. Insertar en lote, estado pendiente_envio.
  const rows = nuevos.map(c => ({
    token: randomUUID(),
    supplier_id: c.supplier_id,
    supplier_name: c.supplier_name,
    email: c.email,
    nivel_actual: c.nivel_actual,
    nivel_objetivo: nivelObjetivo,
    ordenes_movilizadas_90d: c.ordenes_movilizadas_90d,
    umbral_objetivo: c.umbral_objetivo,
    estado: "pendiente_envio",
  }));

  const { error: insertError } = await supabase.from("ascenso_ofertas").insert(rows);
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({ encoladas: nuevos.length, yaExistian: candidatos.length - nuevos.length });
}
