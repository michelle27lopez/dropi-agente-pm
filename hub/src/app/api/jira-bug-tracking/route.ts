import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json([]);

  const { data, error } = await supabase
    .from("jira_bug_tracking")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
