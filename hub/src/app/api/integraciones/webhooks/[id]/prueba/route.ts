import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";
import { procesarEntrega, payloadDePrueba } from "@/lib/webhooks/registro";

// POST — dispara una entrega sintética por el mismo camino que el receptor
// real, pero sin pasar por Bearer token: la autorización acá es la sesión del
// hub. Sirve para ver "mandé algo y llegó" sin exponer el token al browser.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { id } = await params;
  const { data: wh, error } = await supabase
    .from("webhooks_registro")
    .select("id, slug, nombre")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!wh) return NextResponse.json({ error: "Webhook no encontrado" }, { status: 404 });

  const texto = payloadDePrueba();
  const { status, acuse } = await procesarEntrega({
    webhook: wh,
    texto,
    bytes: Buffer.byteLength(texto),
    headers: { "content-type": "application/json", "x-origen": "prueba-integraciones" },
    fuente: "prueba",
  });

  return NextResponse.json(acuse, { status });
}
