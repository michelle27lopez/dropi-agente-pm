import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { dispatchOferta, sleep } from "@/lib/ascenso-dispatch";

// En prueba real: 15 envíos (WA + email cada uno) tardaron ~60s, muy cerca
// o por encima del límite por defecto de una función serverless en Vercel
// (10-60s según plan). Un lote de 5 se queda con margen real.
const LOTE_DEFAULT = 5;
const LOTE_MAX = 8;
const PAUSA_MS = 1500; // margen para no saturar Evolution API / SMTP entre mensajes.

export const maxDuration = 30;

// Toma un lote pequeño de la cola (estado 'pendiente_envio'), lo envía con
// pausa entre cada uno, y lo marca 'enviada'. Pensado para llamarse repetidas
// veces desde la UI hasta vaciar la cola — nunca manda todo de una sola vez
// porque una función serverless no aguanta cientos de envíos secuenciales
// en una sola invocación.
export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const limite = typeof body.limite === "number" ? Math.min(body.limite, LOTE_MAX) : LOTE_DEFAULT;

  const { data: lote, error } = await supabase
    .from("ascenso_ofertas")
    .select("token, supplier_name, nivel_objetivo")
    .eq("estado", "pendiente_envio")
    .order("created_at", { ascending: true })
    .limit(limite);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let procesados = 0;
  for (const oferta of lote ?? []) {
    await dispatchOferta(oferta);
    await supabase
      .from("ascenso_ofertas")
      .update({ estado: "enviada", enviada_at: new Date().toISOString() })
      .eq("token", oferta.token);
    procesados++;
    await sleep(PAUSA_MS);
  }

  const { count: restantes } = await supabase
    .from("ascenso_ofertas")
    .select("*", { count: "exact", head: true })
    .eq("estado", "pendiente_envio");

  return NextResponse.json({ procesados, restantes: restantes ?? 0 });
}
