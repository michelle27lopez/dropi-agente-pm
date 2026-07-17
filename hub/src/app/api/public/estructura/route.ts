import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

// Endpoint de solo lectura para consumidores externos (ej. RPP de Michele
// Pino) que necesitan espejar la estructura célula → proyecto de Darwin
// para organizar sus propios prototipos en carpetas. Protegido por API key
// compartida — no usa la sesión de Supabase del hub porque el consumidor
// no tiene cuenta en Dropi PM Tools. Ver RPP_API_KEY en .env.local.
export async function GET(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.RPP_API_KEY) {
    return NextResponse.json({ error: "API key inválida o ausente" }, { status: 401 });
  }

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const { data: celulas, error: celulasError } = await supabase
    .from("celulas")
    .select("id, nombre, slug")
    .order("nombre", { ascending: true });

  if (celulasError) return NextResponse.json({ error: celulasError.message }, { status: 500 });

  const { data: proyectos, error: proyectosError } = await supabase
    .from("projects")
    .select("project_code, name, type, status, summary, celula_owner_id")
    .order("project_code", { ascending: true });

  if (proyectosError) return NextResponse.json({ error: proyectosError.message }, { status: 500 });

  const result = (celulas ?? []).map((celula) => ({
    celula: { nombre: celula.nombre, slug: celula.slug },
    proyectos: (proyectos ?? [])
      .filter((p) => p.celula_owner_id === celula.id)
      .map((p) => ({
        codigo: p.project_code,
        nombre: p.name,
        tipo: p.type,
        estado: p.status,
        resumen: p.summary,
      })),
  }));

  return NextResponse.json(result);
}
