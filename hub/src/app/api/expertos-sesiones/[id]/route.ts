import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";
import { extractMissingColumn } from "@/lib/pgrst-retry";

const EDITABLE_FIELDS = [
  "status",
  "session_date",
  "duration",
  "meeting_url",
  "resources",
  "compromisos",
  "faq",
  "notes",
  "facilitator",
  "track",
  "title",
  "description",
] as const;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inicia sesión para editar" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const updates: Record<string, unknown> = {};
  for (const field of EDITABLE_FIELDS) {
    if (field in body) updates[field] = body[field];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "Nada para actualizar" }, { status: 400 });
  }

  let data, error;
  for (let attempt = 0; attempt < 10; attempt++) {
    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Los campos enviados no existen todavía en la tabla" }, { status: 400 });
    }
    ({ data, error } = await supabase.from("expertos_sessions").update(updates).eq("id", id).select().single());
    const missingColumn = extractMissingColumn(error);
    if (!missingColumn) break;
    delete updates[missingColumn];
  }

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inicia sesión para eliminar" }, { status: 401 });

  const { id } = await params;
  const { error } = await supabase.from("expertos_sessions").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
