import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { viewableSprintEmails } from "@/lib/sprint-access";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const user = await requireUser();
  const viewable = viewableSprintEmails(user?.email);
  if (viewable.length === 0) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!supabase) return NextResponse.json([]);

  const requested = request.nextUrl.searchParams.get("person")?.toLowerCase();
  const personEmail = requested && viewable.includes(requested) ? requested : viewable[0];

  const { data, error } = await supabase
    .from("sprint_task_checklist")
    .select("*")
    .eq("person_email", personEmail)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const sprintLabels = Array.from(
    new Set((data ?? []).map((t) => t.sprint_label).filter((l): l is string => !!l))
  );

  let periods: Record<string, { start_date: string; end_date: string; holiday_dates: string[] }> = {};
  if (sprintLabels.length > 0) {
    const { data: periodRows } = await supabase
      .from("sprint_periods")
      .select("sprint_label, start_date, end_date, holiday_dates")
      .in("sprint_label", sprintLabels);
    periods = Object.fromEntries((periodRows ?? []).map((p) => [p.sprint_label, p]));
  }

  return NextResponse.json({ tasks: data ?? [], periods, viewable, viewing: personEmail });
}
