import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { isMiDiaOwner } from "@/lib/sprint-access";
import { supabase } from "@/lib/supabase";
import { getTodayEvents } from "@/lib/google-calendar";

// Sync a demanda (botón "Actualizar" en el panel "Hoy"), reemplaza el
// patrón anterior de sync "por conversación" (seed_today_meetings.py) — ver
// [[project_darwin_pd_dashboard]]. Requiere haber pasado una vez por
// /api/auth/google/login para tener refresh_token guardado.
export async function POST(request: NextRequest) {
  const user = await requireUser();
  if (!isMiDiaOwner(user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  const personEmail = user!.email!;

  const { data: tokenRow, error: tokenError } = await supabase
    .from("google_oauth_tokens")
    .select("refresh_token")
    .eq("person_email", personEmail)
    .maybeSingle();

  if (tokenError) return NextResponse.json({ error: tokenError.message }, { status: 500 });
  if (!tokenRow) {
    return NextResponse.json(
      { error: "Calendar no conectado — visita /api/auth/google/login para autorizarlo" },
      { status: 400 }
    );
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;

  let events;
  try {
    events = await getTodayEvents(tokenRow.refresh_token, redirectUri);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error desconocido" }, { status: 500 });
  }

  const today = new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
  const now = new Date().toISOString();

  const { error: deleteError } = await supabase
    .from("today_meetings")
    .delete()
    .eq("person_email", personEmail)
    .eq("event_date", today);

  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  if (events.length > 0) {
    const { error: insertError } = await supabase.from("today_meetings").insert(
      events.map((event) => ({
        person_email: personEmail,
        event_date: today,
        start_time: event.start_time,
        end_time: event.end_time,
        title: event.title,
        join_url: event.join_url,
        is_personal: event.is_personal,
        synced_at: now,
      }))
    );

    if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ synced: events.length, synced_at: now });
}
