import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  if (!supabase) return NextResponse.json({ accepted: 0, total: 0, session: null });

  const [attendeesRes, sessionRes] = await Promise.all([
    supabase.from("pulso_demo_attendees").select("id, name, accepted_at, committed_units"),
    supabase
      .from("pulso_demo_sessions")
      .select("*")
      .eq("active", true)
      .order("triggered_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const attendees = attendeesRes.data ?? [];
  const accepted = attendees.filter((a) => a.accepted_at);
  const totalCommitted = accepted.reduce((sum, a) => sum + (a.committed_units ?? 0), 0);

  // Breakdown por cantidad
  const breakdown = [50, 100, 300, 500].map((qty) => ({
    units: qty,
    count: accepted.filter((a) => a.committed_units === qty).length,
  })).filter((b) => b.count > 0);

  return NextResponse.json({
    total: attendees.length,
    accepted: accepted.length,
    totalCommitted,
    breakdown,
    session: sessionRes.data ?? null,
    acceptedAt: accepted.map((a) => ({
      name: a.name,
      at: a.accepted_at,
      units: a.committed_units,
    })),
  });
}
