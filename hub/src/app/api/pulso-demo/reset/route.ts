import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  await Promise.all([
    // Desactivar todas las sesiones
    supabase.from("pulso_demo_sessions").update({ active: false }).eq("active", true),
    // Borrar aceptaciones y unidades comprometidas de todos los asistentes
    supabase.from("pulso_demo_attendees").update({ accepted_at: null, committed_units: null }),
  ]);

  return NextResponse.json({ ok: true });
}
