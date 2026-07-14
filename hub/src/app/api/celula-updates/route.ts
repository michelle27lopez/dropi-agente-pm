import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { data, error } = await supabase
    .from("celula_updates")
    .select("*")
    .order("week_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const body = await req.json();
  const { week_date, title, content } = body;

  if (!week_date || !title || !content) {
    return NextResponse.json({ error: "Faltan campos: week_date, title, content" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("celula_updates")
    .upsert({ week_date, title, content }, { onConflict: "week_date" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
