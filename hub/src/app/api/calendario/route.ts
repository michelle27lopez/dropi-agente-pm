import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("calendar_events")
    .select("*")
    .order("event_date", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const { title, event_type, event_date, project_code, project_name, notes } = body ?? {};

  if (!title || typeof title !== "string" || !title.trim()) {
    return NextResponse.json({ error: "Falta el título" }, { status: 400 });
  }
  if (!["lanzamiento", "handoff", "otro"].includes(event_type)) {
    return NextResponse.json({ error: "Tipo de evento inválido" }, { status: 400 });
  }
  if (!event_date || typeof event_date !== "string") {
    return NextResponse.json({ error: "Falta la fecha" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("calendar_events")
    .insert({
      title: title.trim(),
      event_type,
      event_date,
      project_code: project_code || null,
      project_name: project_name || null,
      notes: notes || null,
    })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
