import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { supabase } from "@/lib/supabase";

// Reuniones de hoy para el panel "Hoy" del home privado — sincronizadas por
// conversación en `today_meetings` (ver supabase/039_today_meetings.sql),
// no en vivo. Cualquier usuario autenticado puede pedir las suyas
// (person_email = quien pide, no un email fijo) — pero solo quien ya pasó
// por /api/auth/google/login tiene algo real: `connected` le dice al front
// si debe mostrar "Pendiente, conecta tu calendario" o "sin reuniones hoy".
export async function GET() {
  const user = await requireUser();
  if (!user?.email) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!supabase) return NextResponse.json({ meetings: [], connected: false });

  const { data: tokenRow } = await supabase
    .from("google_oauth_tokens")
    .select("person_email")
    .eq("person_email", user.email)
    .maybeSingle();

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());

  const { data, error } = await supabase
    .from("today_meetings")
    .select("*")
    .eq("person_email", user.email)
    .eq("event_date", today)
    .order("start_time", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ meetings: data ?? [], connected: !!tokenRow });
}
