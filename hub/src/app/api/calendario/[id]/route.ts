import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { supabase } from "@/lib/supabase";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { title, event_type, event_date, project_code, project_name, notes } = body ?? {};

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (title !== undefined) patch.title = title;
  if (event_type !== undefined) patch.event_type = event_type;
  if (event_date !== undefined) patch.event_date = event_date;
  if (project_code !== undefined) patch.project_code = project_code || null;
  if (project_name !== undefined) patch.project_name = project_name || null;
  if (notes !== undefined) patch.notes = notes || null;

  const { data, error } = await supabase
    .from("calendar_events")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { id } = await params;
  const { error } = await supabase.from("calendar_events").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
