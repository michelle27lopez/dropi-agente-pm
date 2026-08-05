import { NextRequest, NextResponse } from "next/server";
import { localGetEligibleByToken, localRegisterEligibleView } from "@/lib/local-store-planeacion";
import { supabaseGetEligibleByToken, supabaseRegisterEligibleView } from "@/lib/supabase-store-planeacion";

// Público a propósito (sin login) — el token es opaco y no se puede adivinar
// ni derivar del ID real del proveedor, así que solo quien recibió su propio
// link ve su propia lista. Un proveedor no puede ver la de otro cambiando
// un número en la URL, porque no hay número: solo el token sirve.

export type JourneyStep = {
  key: "seleccion" | "fotos" | "vivo";
  label: string;
  window: string;
  state: "hecho" | "actual" | "bloqueado";
  /** Fecha ISO de cierre de la fase — el frontend muestra esto como fecha exacta. */
  end: string;
};

// Fechas reales del nodo "calendario" de esta campaña (Supabase, campaign_id
// 54944bdf-...). Campaña de un solo uso — se hardcodea aquí igual que el "24
// JULIO" de la página, en vez de armar un fetch genérico multi-campaña que
// hoy nadie más necesita.
//
// Sin paso de curaduría: "fotos" empieza el mismo día que cierra "seleccion"
// (no hay gate manual de aprobación entre medio — decidido con Kate/Michelle,
// el equipo revisa por dentro pero el proveedor no espera a nadie).
const PHASES: { key: JourneyStep["key"]; label: string; window: string; start: string; end: string }[] = [
  // "seleccion" abre desde el arranque de la convocatoria (31/07), no desde
  // el Meet (6/08) — Michelle decidió 30/07 que los proveedores que entren
  // el día del link deben poder elegir productos de una vez, en vez de
  // toparse con la pantalla bloqueada "Podrás seleccionar a partir del 6".
  { key: "seleccion", label: "Elige tus productos", window: "31 jul – 14 ago", start: "2026-07-31", end: "2026-08-14" },
  { key: "fotos", label: "Prepara tus productos", window: "14 – 17 ago", start: "2026-08-14", end: "2026-08-17" },
  { key: "vivo", label: "Cyber Days en vivo", window: "18 – 31 ago", start: "2026-08-18", end: "2026-08-31" },
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

// Token fijo de QA (ver scratchpad de seed) — cada vez que alguien del equipo
// entra a este link, la respuesta se fuerza a estado "recién postulado" (sin
// selección, sin checklist, sin feedback) aunque la fila real en la base
// tenga cosas guardadas de la última prueba. Así el link siempre se siente
// como la primera visita de un proveedor, sin tener que borrar nada a mano
// entre pruebas — y sin arriesgar resetear la fila de un proveedor real.
const QA_RESET_TOKEN = "qa-preview-campanas";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const { id, token } = await params;
  const entry = (await supabaseGetEligibleByToken(id, token)) ?? (await localGetEligibleByToken(id, token));
  if (!entry) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  if (token === QA_RESET_TOKEN) {
    return NextResponse.json({
      ...entry,
      selectedProductIds: [],
      submitted_at: null,
      selection_updated_at: null,
      approved_at: null,
      readyChecklist: {},
      feedback: undefined,
      view_count: 0,
      first_viewed_at: null,
      last_viewed_at: null,
      journey: computeJourney(),
    });
  }

  // Cuenta la visita real a la página pública — no bloquea la respuesta al
  // proveedor si falla, es solo analítica interna.
  const viewed = (await supabaseRegisterEligibleView(id, token)) ?? (await localRegisterEligibleView(id, token));

  return NextResponse.json({ ...entry, ...(viewed ? { view_count: viewed.view_count, last_viewed_at: viewed.last_viewed_at } : {}), journey: computeJourney() });
}
