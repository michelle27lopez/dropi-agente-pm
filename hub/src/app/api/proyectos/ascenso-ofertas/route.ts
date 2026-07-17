import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { supabase } from "@/lib/supabase";
import { dispatchOferta, TEST_RECIPIENT_EMAIL, TEST_RECIPIENT_WHATSAPP } from "@/lib/ascenso-dispatch";

export async function GET() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { data, error } = await supabase.from("ascenso_ofertas").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const body = await req.json();
  const {
    supplierId, supplierName, email,
    nivelActual, nivelObjetivo,
    ordenesMovilizadas90d, umbralObjetivo,
  } = body;

  if (!supplierId || !supplierName || !nivelObjetivo) {
    return NextResponse.json({ error: "Faltan campos requeridos" }, { status: 400 });
  }

  const token = randomUUID();

  const { data, error } = await supabase
    .from("ascenso_ofertas")
    .insert({
      token,
      supplier_id: supplierId,
      supplier_name: supplierName,
      email: email ?? null,
      nivel_actual: nivelActual,
      nivel_objetivo: nivelObjetivo,
      ordenes_movilizadas_90d: ordenesMovilizadas90d ?? null,
      umbral_objetivo: umbralObjetivo,
      estado: "enviada",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await dispatchOferta({ token, supplier_name: supplierName, nivel_objetivo: nivelObjetivo });

  return NextResponse.json({ ok: true, oferta: data, testRecipients: { email: TEST_RECIPIENT_EMAIL, whatsapp: TEST_RECIPIENT_WHATSAPP } });
}
