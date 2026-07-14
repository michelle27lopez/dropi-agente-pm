import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const [attendeesRes, matchesRes] = await Promise.all([
    supabase.from("activa_demo_attendees").select("role, category, match_id"),
    supabase.from("activa_demo_matches").select("id, status").eq("status", "active"),
  ]);

  const attendees = attendeesRes.data ?? [];
  const matches = matchesRes.data ?? [];

  const suppliers = attendees.filter((a) => a.role === "supplier").length;
  const dropshippers = attendees.filter((a) => a.role === "dropshipper").length;
  const matched = attendees.filter((a) => a.match_id).length;
  const activated = matches.length > 0;

  const byCategory: Record<string, { suppliers: number; dropshippers: number }> = {};
  for (const a of attendees) {
    if (!byCategory[a.category]) byCategory[a.category] = { suppliers: 0, dropshippers: 0 };
    if (a.role === "supplier") byCategory[a.category].suppliers++;
    else byCategory[a.category].dropshippers++;
  }

  return NextResponse.json({ suppliers, dropshippers, total: attendees.length, matched, activated, byCategory });
}
