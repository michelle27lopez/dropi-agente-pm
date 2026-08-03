import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { isMiDiaOwner, MI_DIA_OWNER_EMAIL } from "@/lib/sprint-access";
import { supabase } from "@/lib/supabase";

// Reuniones de hoy para el panel "Hoy" del home privado — sincronizadas por
// conversación en `today_meetings` (ver supabase/039_today_meetings.sql),
// no en vivo. Mismo alcance que el resto de "mi día": solo MI_DIA_OWNER_EMAIL.
export async function GET() {
  const user = await requireUser();
  if (!isMiDiaOwner(user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!supabase) return NextResponse.json({ meetings: [] });

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

  const { data, error } = await supabase
    .from("today_meetings")
    .select("*")
    .eq("person_email", MI_DIA_OWNER_EMAIL)
    .eq("event_date", today)
    .order("start_time", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ meetings: data ?? [] });
}
