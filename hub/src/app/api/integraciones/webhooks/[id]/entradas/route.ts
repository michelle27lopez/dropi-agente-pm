import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

// GET — últimas entregas (acuses) y últimas entradas (registros) de un webhook,
// para inspeccionar desde /integraciones qué está llegando.
// Query: ?entregas=20&entradas=50
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ entregas: [], entradas: [] });

  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const nEntregas = Math.min(parseInt(searchParams.get("entregas") ?? "20", 10) || 20, 100);
  const nEntradas = Math.min(parseInt(searchParams.get("entradas") ?? "50", 10) || 50, 200);

  const { data: entregas, error: e1 } = await supabase
    .from("webhooks_entregas")
    .select("id, recibido_en, fuente, ok, registros_recibidos, registros_escritos, bytes, lote_id, mensaje")
    .eq("webhook_id", id)
    .order("recibido_en", { ascending: false })
    .limit(nEntregas);
  if (e1) return NextResponse.json({ error: e1.message }, { status: 500 });

  const { data: entradas, error: e2 } = await supabase
    .from("webhooks_entradas")
    .select("id, recibido_en, lote_id, lote_seq, payload, lote_meta")
    .eq("webhook_id", id)
    .order("recibido_en", { ascending: false })
    .limit(nEntradas);
  if (e2) return NextResponse.json({ error: e2.message }, { status: 500 });

  return NextResponse.json({ entregas: entregas ?? [], entradas: entradas ?? [] });
}
