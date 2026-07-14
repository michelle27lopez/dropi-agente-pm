import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
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
