import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerSupabase } from "@/lib/supabase-server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("expertos_sessions")
    .select("*")
    .order("session_date", { ascending: true, nullsFirst: false })
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const authClient = await createServerSupabase();
  const { data: { user } } = await authClient.auth.getUser();
  if (!user) return NextResponse.json({ error: "Inicia sesión para proponer un tema" }, { status: 401 });

  const body = await req.json();
  const { title, track, session_date, description, facilitator, resources, status, duration } = body;

  if (!title) {
    return NextResponse.json({ error: "title es requerido" }, { status: 400 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre")
    .eq("id", user.id)
    .maybeSingle();

  const { data, error } = await supabase
    .from("expertos_sessions")
    .insert({
      title,
      track: track || "Otro",
      description: description || null,
      facilitator: facilitator || null,
      session_date: session_date || null,
      duration: duration || null,
      resources: Array.isArray(resources) ? resources : [],
      status: status || (session_date ? "Programada" : "Backlog"),
      source: "Comunidad",
      proposed_by: profile?.nombre || user.email,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
