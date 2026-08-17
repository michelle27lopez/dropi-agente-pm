import { NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { supabase } from "@/lib/supabase";

// Backend-for-frontend de /integraciones: solo lectura, para usuarios logueados
// del hub. No confundir con /api/webhooks/cuidado-de-campanas, que es el
// receptor externo autenticado con Bearer token.
export async function GET() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ configurado: false, logs: [] });

  const { data: logs, error } = await supabase
    .from("cuidado_campanas_webhook_logs")
    .select("*")
    .order("recibido_en", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const tokenConfigurado = Boolean(process.env.CUIDADO_CAMPANAS_TOKEN);

  return NextResponse.json({
    configurado: tokenConfigurado,
    logs: logs ?? [],
  });
}
