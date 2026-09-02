import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// Progreso de "Service design: Entendimiento 360 del ecosistema" (PRO-001).
// El % de entendimiento es una columna generada en Postgres a partir de 4
// criterios booleanos (25% c/u) — nunca un número libre — para que quede
// auditable qué evidencia real sustenta cada cifra. Cualquier persona
// autenticada puede leer y actualizar: el avance lo marca cada célula sobre
// su propia fila, no solo Product team.

const SELECT = "id, dimension, criterio_1, criterio_2, criterio_3, criterio_4, porcentaje, notas, guia_url, updated_at, celulas(id, nombre, slug)";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { data, error } = await supabase
    .from("service_design_360_progress")
    .select(SELECT)
    .order("updated_at", { ascending: false });

  // La tabla puede no existir todavía si la migración 054 no se ha corrido
  // en Supabase (paso manual pendiente) — se distingue de un error real para
  // que la página muestre el aviso correcto en vez de un 500 genérico.
  //
  // Dos formas reales de ver este error según de dónde venga: PostgREST vía
  // supabase-js devuelve code "PGRST205" con "Could not find the table ...
  // in the schema cache" (esto es lo que de verdad se vio en producción);
  // Postgres crudo devolvería "42P01"/"does not exist" — se cubren ambas.
  if (error) {
    const tablaFalta =
      error.code === "42P01" ||
      error.code === "PGRST205" ||
      /does not exist/i.test(error.message) ||
      /could not find the table/i.test(error.message);
    return NextResponse.json(
      { error: error.message, migracionPendiente: tablaFalta },
      { status: tablaFalta ? 200 : 500 },
    );
  }

  return NextResponse.json({ rows: data ?? [] });
}

export async function PATCH(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const body = await req.json();
  const id = typeof body.id === "string" ? body.id : "";
  if (!id) return NextResponse.json({ error: "Falta id" }, { status: 400 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };

  for (const campo of ["criterio_1", "criterio_2", "criterio_3", "criterio_4"] as const) {
    if (body[campo] !== undefined) {
      if (typeof body[campo] !== "boolean") {
        return NextResponse.json({ error: `${campo} debe ser booleano` }, { status: 400 });
      }
      update[campo] = body[campo];
    }
  }

  if (body.notas !== undefined) update.notas = body.notas;
  if (body.guia_url !== undefined) update.guia_url = body.guia_url;

  const { data, error } = await supabase
    .from("service_design_360_progress")
    .update(update)
    .eq("id", id)
    .select(SELECT)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
