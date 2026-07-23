import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

export async function GET(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const id = req.nextUrl.searchParams.get("id");
  if (!id || !supabase) return NextResponse.json(null);

  const { data, error } = await supabase
    .from("projects")
    .select("project_code, name, status, summary")
    .eq("id", id)
    .single();

  if (error) return NextResponse.json(null);
  return NextResponse.json(data);
}
