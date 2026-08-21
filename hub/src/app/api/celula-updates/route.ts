import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { data, error } = await supabase
    .from("celula_updates")
    .select("*")
    .order("week_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const body = await req.json();
  const { week_date, title, content, tipo } = body;

  if (!week_date || !title || !content) {
    return NextResponse.json({ error: "Faltan campos: week_date, title, content" }, { status: 400 });
  }

  // El UNIQUE pasó de (week_date) a (celula_id, week_date, tipo) — ver
  // 051_celula_updates_tipo.sql. Este endpoint legacy no recibe celula_id,
  // así que el onConflict ya no puede apuntar solo a week_date.
  const { data, error } = await supabase
    .from("celula_updates")
    .upsert({ week_date, title, content, tipo: tipo ?? "weekly" }, { onConflict: "celula_id,week_date,tipo" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
