import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

const BUCKET = "iniciativas-archivos";

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string; archivoId: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const { archivoId } = await params;

  const { data: archivo, error: fetchError } = await supabase
    .from("iniciativa_archivos")
    .select("storage_path")
    .eq("id", archivoId)
    .single();

  if (fetchError) return NextResponse.json({ error: fetchError.message }, { status: 404 });

  const { error: storageError } = await supabase.storage.from(BUCKET).remove([archivo.storage_path]);
  if (storageError) return NextResponse.json({ error: storageError.message }, { status: 500 });

  const { error: deleteError } = await supabase.from("iniciativa_archivos").delete().eq("id", archivoId);
  if (deleteError) return NextResponse.json({ error: deleteError.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
