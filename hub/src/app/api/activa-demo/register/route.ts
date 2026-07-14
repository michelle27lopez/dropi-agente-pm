import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const VALID_ROLES = ["supplier", "dropshipper"];
const VALID_CATEGORIES = ["ropa", "tech", "cosmeticos", "hogar"];

export async function POST(req: NextRequest) {
  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });
  const { name, email, whatsapp, role, category } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "name required" }, { status: 400 });
  if (!VALID_ROLES.includes(role)) return NextResponse.json({ error: "invalid role" }, { status: 400 });
  if (!VALID_CATEGORIES.includes(category)) return NextResponse.json({ error: "invalid category" }, { status: 400 });

  const { data, error } = await supabase
    .from("activa_demo_attendees")
    .insert({ name: name.trim(), email: email?.trim() || null, whatsapp: whatsapp?.trim() || null, role, category })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, token: data.token, name: data.name, role, category });
}
