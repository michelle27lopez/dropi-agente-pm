import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// Inventario de POCs de TODAS las células, para /guias/directorio-pocs.
//
// Misma forma que /api/public/estructura (celulas + projects agrupados por
// celula_owner_id), pero con dos diferencias: acá el consumidor es el hub
// mismo, así que autentica con la sesión de Supabase en vez de RPP_API_KEY;
// y filtra `type = 'POC'` porque esta vista solo lista POCs.
//
// El punto de esta ruta es que cruza células: /celula/[slug]/proyectos solo
// muestra la célula de la URL, y nadie tiene una vista del total.
//
// El string del select va como literal único (sin concatenar) — supabase-js
// lo parsea a nivel de tipos y con `"a" + "b"` pierde la inferencia y cae a
// GenericStringError. Son los campos de `Proyecto` (components/ProjectCard)
// para poder reusar projectUrl(), más celula_owner_id para agrupar.

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ celulas: [], huerfanos: [], total: 0 });

  const { data: celulas, error: celulasError } = await supabase
    .from("celulas")
    .select("id, nombre, slug")
    .order("nombre", { ascending: true });

  if (celulasError) return NextResponse.json({ error: celulasError.message }, { status: 500 });

  const { data: pocs, error: pocsError } = await supabase
    .from("projects")
    .select("id, name, project_code, status, type, handoff_status, summary, business_area, prototype_url, parent_project_id, estado_interno, vpv, related_poc_id, related_delivery_id, celula_owner_id")
    .eq("type", "POC")
    .order("project_code", { ascending: true });

  if (pocsError) return NextResponse.json({ error: pocsError.message }, { status: 500 });

  const filas = pocs ?? [];

  const porCelula = (celulas ?? []).map((celula) => ({
    celula: { nombre: celula.nombre, slug: celula.slug },
    pocs: filas.filter((p) => p.celula_owner_id === celula.id),
  }));

  // Un POC sin celula_owner_id no aparecería en ningún grupo y se perdería
  // en silencio — se agrupa aparte en vez de desaparecer del inventario.
  const idsConCelula = new Set((celulas ?? []).map((c) => c.id));
  const huerfanos = filas.filter(
    (p) => !p.celula_owner_id || !idsConCelula.has(p.celula_owner_id)
  );

  return NextResponse.json({
    celulas: porCelula.filter((g) => g.pocs.length > 0),
    huerfanos,
    total: filas.length,
  });
}
