import { NextRequest, NextResponse } from "next/server";
import { localListSuppliers, localUpsertSuppliers } from "@/lib/local-store-planeacion";
import { supabaseListSuppliers, supabaseUpsertSuppliers } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

// Seguimiento de suppliers por campaña: se puebla al enviar la convocatoria
// por CRM (cada fila del Excel entra aquí como "contactado") y luego se
// actualiza manualmente conforme avanzan (respondió / aplicó / activó).

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const suppliers = await supabaseListSuppliers(id);
  if (suppliers) return NextResponse.json(suppliers);
  return NextResponse.json(await localListSuppliers(id));
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { rows, messageLabel } = body as { rows: { identifier: string; data: Record<string, string | number> }[]; messageLabel?: string | null };

  const supabaseResult = await supabaseUpsertSuppliers(id, rows ?? [], messageLabel);
  if (supabaseResult) return NextResponse.json(supabaseResult);

  const suppliers = await localUpsertSuppliers(id, rows ?? [], messageLabel);
  return NextResponse.json(suppliers);
}
