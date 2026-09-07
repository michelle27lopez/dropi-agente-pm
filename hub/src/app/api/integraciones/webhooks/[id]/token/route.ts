import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";
import { generarToken } from "@/lib/webhooks/registro";

// POST — regenera el token del webhook. El anterior deja de servir de inmediato.
// Devuelve el nuevo token UNA vez.
export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  if (!supabase) return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });

  const { id } = await params;
  const { token, sha256, prefix } = generarToken();

  const { data, error } = await supabase
    .from("webhooks_registro")
    .update({ token_sha256: sha256, token_prefix: prefix, token_rotado_en: new Date().toISOString() })
    .eq("id", id)
    .select("id, token_prefix, token_rotado_en")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ webhook: data, token });
}
