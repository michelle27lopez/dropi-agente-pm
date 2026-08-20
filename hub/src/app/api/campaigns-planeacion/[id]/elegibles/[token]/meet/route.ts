import { NextRequest, NextResponse } from "next/server";
import { localRegisterMeetClick, localSetMeetAttendance } from "@/lib/local-store-planeacion";
import { supabaseRegisterMeetClick, supabaseSetMeetAttendance } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Pública (sin login) — se llama desde el link del Meet en la página del
// proveedor, antes de navegar a Google Meet. Es solo señal de clic, no
// confirma asistencia real (eso se marca a mano, ver PATCH abajo).
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const { id, token } = await params;
  const updated = (await supabaseRegisterMeetClick(id, token)) ?? (await localRegisterMeetClick(id, token));
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({
    meet_click_count: updated.meet_click_count ?? 0,
    meet_first_clicked_at: updated.meet_first_clicked_at ?? null,
    meet_last_clicked_at: updated.meet_last_clicked_at ?? null,
  });
}

// Uso interno (detrás del login) — el comercial confirma a mano quién
// asistió de verdad al Meet, cruzando contra la lista de invitados.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, token } = await params;
  const body = await req.json().catch(() => null);
  if (typeof body?.attended !== "boolean") {
    return NextResponse.json({ error: "Falta 'attended' (boolean)" }, { status: 400 });
  }

  const updated =
    (await supabaseSetMeetAttendance(id, token, body.attended)) ??
    (await localSetMeetAttendance(id, token, body.attended));
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({
    meet_attended: updated.meet_attended ?? false,
    meet_attended_marked_at: updated.meet_attended_marked_at ?? null,
  });
}
