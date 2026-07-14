import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("iniciativas")
    .select(`
      *,
      iniciativa_archivos(count)
    `)
    .order("urgencia", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const body = await req.json();
  const { nombre, area, urgencia, descripcion, creada_por } = body;

  if (!nombre || !area || !creada_por) {
    return NextResponse.json({ error: "nombre, area y creada_por son requeridos" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("iniciativas")
    .insert({ nombre, area, urgencia: urgencia ?? "media", descripcion, creada_por })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
