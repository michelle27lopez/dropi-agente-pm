import { NextRequest, NextResponse } from "next/server";
import { localUpdateSupplierStatus, localUpdateSupplierNote, SupplierStatus } from "@/lib/local-store-planeacion";
import { supabaseUpdateSupplierStatus, supabaseUpdateSupplierNote } from "@/lib/supabase-store-planeacion";
import { requireUser } from "@/lib/require-auth";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; supplierId: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const { id, supplierId } = await params;
  const body = await req.json();
  const { status, note } = body as { status?: SupplierStatus; note?: string };

  const supabaseResult = status
    ? await supabaseUpdateSupplierStatus(id, supplierId, status)
    : await supabaseUpdateSupplierNote(id, supplierId, note ?? "");
  if (supabaseResult) return NextResponse.json(supabaseResult);

  const updated = status
    ? await localUpdateSupplierStatus(id, supplierId, status)
    : await localUpdateSupplierNote(id, supplierId, note ?? "");
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}
