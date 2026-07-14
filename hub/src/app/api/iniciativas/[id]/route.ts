import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const { id } = await params;

  const { data: iniciativa, error } = await supabase
    .from("iniciativas")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const { data: archivos } = await supabase
    .from("iniciativa_archivos")
    .select("*")
    .eq("iniciativa_id", id)
    .order("created_at", { ascending: true });

  return NextResponse.json({ ...iniciativa, archivos: archivos ?? [] });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const { id } = await params;
  const body = await req.json();

  const allowed = ["estado", "nombre", "descripcion", "urgencia"];
  const updates: Record<string, string> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  updates.updated_at = new Date().toISOString();

  const { data, error } = await supabase
    .from("iniciativas")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
