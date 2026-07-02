import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const EVOLUTION_URL = process.env.EVOLUTION_API_URL ?? "";
const EVOLUTION_KEY = process.env.EVOLUTION_API_KEY ?? "";
const EVOLUTION_INSTANCE = process.env.EVOLUTION_API_INSTANCE ?? "asistente";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

const CATEGORY_LABELS: Record<string, string> = {
  ropa: "Ropa y accesorios",
  tech: "Tecnología",
  cosmeticos: "Cosméticos y cuidado",
  hogar: "Hogar y decoración",
};

async function sendWhatsApp(number: string, message: string) {
  if (!EVOLUTION_URL || !EVOLUTION_KEY || !number) return;
  const normalized = number.replace(/[^0-9]/g, "");
  await fetch(`${EVOLUTION_URL}/message/sendText/${EVOLUTION_INSTANCE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", apikey: EVOLUTION_KEY },
    body: JSON.stringify({ number: normalized, text: message, options: { delay: 1200 } }),
  });
}

type Attendee = {
  id: string;
  name: string;
  whatsapp: string | null;
  role: string;
  category: string;
  token: string;
  match_id?: string | null;
};

export async function POST() {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const { data: attendees } = await supabase
    .from("activa_demo_attendees")
    .select("id, name, whatsapp, role, category, token");

  if (!attendees?.length) return NextResponse.json({ error: "No attendees" }, { status: 400 });

  // Group by category + role
  const suppliers: Record<string, Attendee[]> = {};
  const dropshippers: Record<string, Attendee[]> = {};
  for (const a of attendees as Attendee[]) {
    if (a.role === "supplier") {
      if (!suppliers[a.category]) suppliers[a.category] = [];
      suppliers[a.category].push(a);
    } else {
      if (!dropshippers[a.category]) dropshippers[a.category] = [];
      dropshippers[a.category].push(a);
    }
  }

  const allCategories = new Set([...Object.keys(suppliers), ...Object.keys(dropshippers)]);
  const notifications: Promise<void>[] = [];
  let matchCount = 0;

  for (const cat of allCategories) {
    const catSuppliers = suppliers[cat] ?? [];
    const catDropshippers = dropshippers[cat] ?? [];
    const catLabel = CATEGORY_LABELS[cat] ?? cat;

    // Create one match per dropshipper (rotate suppliers if needed)
    for (let i = 0; i < catDropshippers.length; i++) {
      const ds = catDropshippers[i];
      const sup = catSuppliers.length > 0 ? catSuppliers[i % catSuppliers.length] : null;

      const { data: match } = await supabase
        .from("activa_demo_matches")
        .insert({ category: cat, supplier_token: sup?.token ?? null, dropshipper_token: ds.token, status: "active" })
        .select()
        .single();

      if (!match) continue;
      matchCount++;

      // Update attendees with match_id
      await supabase.from("activa_demo_attendees").update({ match_id: match.id }).eq("token", ds.token);
      if (sup) await supabase.from("activa_demo_attendees").update({ match_id: match.id }).eq("token", sup.token);

      // WhatsApp to dropshipper
      const dsLink = `${BASE_URL}/activa-demo/d/${ds.token}`;
      const dsMsg =
        `🔍 *DROPI ACTIVA — Señal para ti*\n\n` +
        `Hola *${ds.name.split(" ")[0]}*,\n\n` +
        `Encontramos un proveedor en *${catLabel}* con lo que buscas.\n` +
        `Stock disponible. Despacha en 48h.\n\n` +
        `Solo tú recibiste esta señal. La conversación sucede aquí:\n` +
        `👉 ${dsLink}`;
      notifications.push(sendWhatsApp(ds.whatsapp ?? "", dsMsg));

      // WhatsApp to supplier
      if (sup) {
        const supLink = `${BASE_URL}/activa-demo/s/${sup.token}`;
        const supMsg =
          `🚀 *DROPI ACTIVA — Bienvenido al programa*\n\n` +
          `Hola *${sup.name.split(" ")[0]}*,\n\n` +
          `Revisamos tu perfil. Tienes lo que el mercado está buscando en *${catLabel}*.\n\n` +
          `A partir de ahora, Dropi trabaja para ti.\n` +
          `No esperas a que te encuentren — nosotros te presentamos.\n\n` +
          `Alguien ya está mirando lo que vendes. 👀\n\n` +
          `Ver tu señal de demanda:\n` +
          `👉 ${supLink}`;
        notifications.push(sendWhatsApp(sup.whatsapp ?? "", supMsg));
      }
    }

    // Suppliers with no dropshippers in category — solo match (AI-only)
    if (catDropshippers.length === 0) {
      for (const sup of catSuppliers) {
        if (sup.match_id) continue; // already matched
        const { data: match } = await supabase
          .from("activa_demo_matches")
          .insert({ category: cat, supplier_token: sup.token, dropshipper_token: null, status: "active" })
          .select()
          .single();
        if (!match) continue;
        matchCount++;
        await supabase.from("activa_demo_attendees").update({ match_id: match.id }).eq("token", sup.token);

        const supLink = `${BASE_URL}/activa-demo/s/${sup.token}`;
        const supMsg =
          `🚀 *DROPI ACTIVA — Bienvenido al programa*\n\n` +
          `Hola *${sup.name.split(" ")[0]}*,\n\n` +
          `Hay demanda activa en *${catLabel}*. Estamos conectándote.\n\n` +
          `Ver tu señal:\n👉 ${supLink}`;
        notifications.push(sendWhatsApp(sup.whatsapp ?? "", supMsg));
      }
    }
  }

  await Promise.allSettled(notifications);
  return NextResponse.json({ ok: true, matches: matchCount, notified: notifications.length });
}
