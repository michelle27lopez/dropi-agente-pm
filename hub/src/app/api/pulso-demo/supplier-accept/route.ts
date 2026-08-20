import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "dropi";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3004";

const IMAGE_CIERRE = "https://fwwkesboxlbmimzyoztq.supabase.co/storage/v1/object/public/imagenes/negociacioncerrada.png";

async function notifyDropshippers() {
  if (!supabase || !EVOLUTION_URL || !EVOLUTION_KEY) return;

  const { data: dropshippers } = await supabase
    .from("pulso_demo_attendees")
    .select("name, whatsapp, token")
    .eq("role", "dropshipper")
    .not("accepted_at", "is", null);

  if (!dropshippers || dropshippers.length === 0) return;

  await Promise.allSettled(
    dropshippers.map((ds) => {
      if (!ds.whatsapp) return Promise.resolve();
      const normalized = ds.whatsapp.replace(/[^0-9]/g, "");
      const kitLink = `${BASE_URL}/pulso-demo/kit/${ds.token}`;
      const caption =
        `✅ *¡El proveedor aceptó la negociación!*\n\n` +
        `Hola *${ds.name}*, las condiciones fueron confirmadas.\n\n` +
        `La campaña está aprobada y ya podés empezar a publicar 🚀\n\n` +
        `En breve recibirás todos los repositorios de materiales:\n` +
        `📸 Gráficos · ✍️ Copies · 🎥 Videos · 📋 Brief\n\n` +
        `👉 Accedé a tu kit:\n${kitLink}`;
      return fetch(`${EVOLUTION_URL}/message/sendMedia/${EVOLUTION_INSTANCE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
        body: JSON.stringify({
          number: normalized,
          mediatype: "image",
          mimetype: "image/png",
          media: IMAGE_CIERRE,
          caption,
          options: { delay: 1200 },
        }),
      });
    })
  );
}

export async function POST() {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const sessionRes = await supabase
    .from("pulso_demo_sessions")
    .select("id")
    .eq("active", true)
    .order("triggered_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!sessionRes.data?.id) {
    return NextResponse.json({ error: "No hay sesión activa" }, { status: 400 });
  }

  await supabase
    .from("pulso_demo_sessions")
    .update({ supplier_accepted_at: new Date().toISOString() })
    .eq("id", sessionRes.data.id);

  notifyDropshippers().catch(() => null);

  return NextResponse.json({ ok: true });
}
