import { NextRequest, NextResponse } from "next/server";
import { localSetChecklistItem, type ReadyChecklistKey } from "@/lib/local-store-planeacion";
import { supabaseSetChecklistItem } from "@/lib/supabase-store-planeacion";

const VALID_KEYS: ReadyChecklistKey[] = ["nombre", "categoria", "fotoDropi", "fotoCanva"];

// Pública (sin login), igual que /seleccion — el proveedor marca su propio
// avance en el checklist de preparación (nombre, categoría, fotos). Es
// autorreporte: no verificamos contra Dropi que de verdad lo haya hecho,
// solo guardamos lo que el proveedor dice que ya hizo.
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string; token: string }> }) {
  const { id, token } = await params;
  const body = await req.json().catch(() => null);
  const key = body?.key;
  const value = !!body?.value;

  if (typeof key !== "string" || !VALID_KEYS.includes(key as ReadyChecklistKey)) {
    return NextResponse.json({ error: "Ítem inválido" }, { status: 400 });
  }

  const updated =
    (await supabaseSetChecklistItem(id, token, key as ReadyChecklistKey, value)) ??
    (await localSetChecklistItem(id, token, key as ReadyChecklistKey, value));
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ readyChecklist: updated.readyChecklist ?? {} });
}
