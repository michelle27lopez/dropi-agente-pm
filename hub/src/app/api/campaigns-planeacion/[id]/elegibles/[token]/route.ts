import { NextRequest, NextResponse } from "next/server";
import { localGetEligibleByToken, localRegisterEligibleView } from "@/lib/local-store-planeacion";
import { supabaseGetEligibleByToken, supabaseRegisterEligibleView } from "@/lib/supabase-store-planeacion";

// Público a propósito (sin login) — el token es opaco y no se puede adivinar
// ni derivar del ID real del proveedor, así que solo quien recibió su propio
// link ve su propia lista. Un proveedor no puede ver la de otro cambiando
// un número en la URL, porque no hay número: solo el token sirve.

export type JourneyStep = {
  key: "seleccion" | "curaduria" | "fotos" | "vivo";
  label: string;
  window: string;
  state: "hecho" | "actual" | "bloqueado";
  /** Fecha ISO de cierre de la fase — el frontend arma cronómetros con esto. */
  end: string;
};

// Fechas reales del nodo "calendario" de esta campaña (Supabase, campaign_id
// 54944bdf-...). Campaña de un solo uso — se hardcodea aquí igual que el "24
// JULIO" de la página, en vez de armar un fetch genérico multi-campaña que
// hoy nadie más necesita.
const PHASES: { key: JourneyStep["key"]; label: string; window: string; start: string; end: string }[] = [
  // ⚠️ TEMPORAL PARA QA (18/07): la selección abre de verdad el 25 jul —
  // start real "2026-07-25". Adelantada para que Michelle pruebe el flujo
  // postular → recibo → editar de punta a punta. REVERTIR antes del deploy.
  { key: "seleccion", label: "Elige tus productos", window: "25 – 31 jul", start: "2026-07-18", end: "2026-07-31" },
  { key: "curaduria", label: "Curaduría", window: "31 jul – 3 ago", start: "2026-07-31", end: "2026-08-03" },
  { key: "fotos", label: "Prepara tus productos", window: "3 – 10 ago", start: "2026-08-03", end: "2026-08-10" },
  { key: "vivo", label: "Cyber Days en vivo", window: "11 – 24 ago", start: "2026-08-11", end: "2026-08-24" },
];

function computeJourney(): JourneyStep[] {
  const today = new Date().toISOString().slice(0, 10);
  return PHASES.map(({ key, label, window, start, end }) => ({
    key,
    label,
    window,
    end,
    state: today > end ? "hecho" : today >= start ? "actual" : "bloqueado",
  }));
}

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const { id, token } = await params;
  const entry = (await supabaseGetEligibleByToken(id, token)) ?? (await localGetEligibleByToken(id, token));
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  // Cuenta la visita real a la página pública — no bloquea la respuesta al
  // proveedor si falla, es solo analítica interna.
  const viewed = (await supabaseRegisterEligibleView(id, token)) ?? (await localRegisterEligibleView(id, token));

  return NextResponse.json({ ...entry, ...(viewed ? { view_count: viewed.view_count, last_viewed_at: viewed.last_viewed_at } : {}), journey: computeJourney() });
}
