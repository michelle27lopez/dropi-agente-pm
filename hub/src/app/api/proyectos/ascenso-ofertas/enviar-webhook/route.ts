import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { dispatchBatchWebhook } from "@/lib/ascenso-dispatch";
import { requireUser } from "@/lib/require-auth";

// Envía TODA la cola pendiente en un solo POST al webhook de n8n (Enrique) —
// a diferencia de /procesar-lote (Evolution API, tandas chicas con pausa),
// acá no hay throttling de nuestro lado: n8n se encarga de distribuir el
// envío real. Pensado para usarse cuando el webhook ya esté confirmado por
// Enrique, no mientras seguimos solo probando conectividad.
//
// Sin `{ confirmar: true }` en el body, solo hace dry-run: cuenta y muestra
// quién está en la cola sin llamar al webhook. El envío real requiere ese
// flag explícito — evita que un llamado accidental (o una prueba de
// conectividad) saque datos reales de proveedores sin querer.
export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const body = await req.json().catch(() => ({}));
  const confirmar = body?.confirmar === true;

  const { data: pendientes, error } = await supabase
    .from("ascenso_ofertas")
    .select("token, supplier_id, supplier_name, email, nivel_actual, nivel_objetivo")
    .eq("estado", "pendiente_envio")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!pendientes || pendientes.length === 0) {
    return NextResponse.json({ ok: true, enviados: 0, mensaje: "No hay nada pendiente en la cola." });
  }

  if (!confirmar) {
    return NextResponse.json({
      dryRun: true,
      enCola: pendientes.length,
      proveedores: pendientes.map(p => ({ supplier_id: p.supplier_id, nombre: p.supplier_name })),
      mensaje: "Nada enviado todavía. Repetí el llamado con { confirmar: true } para disparar el webhook de verdad.",
    });
  }

  try {
    const resultado = await dispatchBatchWebhook(pendientes);

    const tokens = pendientes.map(p => p.token);
    await supabase
      .from("ascenso_ofertas")
      .update({ estado: "enviada", enviada_at: new Date().toISOString() })
      .in("token", tokens);

    return NextResponse.json(resultado);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido llamando al webhook" },
      { status: 502 }
    );
  }
}
