import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { requireUser } from "@/lib/require-auth";

const BUCKET = "iniciativas-archivos";

function detectType(filename: string): "excel" | "pdf" | "audio" | "otro" {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  if (["xlsx", "xls", "csv"].includes(ext)) return "excel";
  if (ext === "pdf") return "pdf";
  if (["mp3", "mp4", "webm", "ogg", "wav", "m4a"].includes(ext)) return "audio";
  return "otro";
}

async function transcribeAudio(blob: Blob, filename: string): Promise<string | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return null;

  const form = new FormData();
  form.append("file", blob, filename);
  form.append("model", "whisper-1");
  form.append("language", "es");

  const res = await fetch("https://api.openai.com/v1/audio/transcriptions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });

  if (!res.ok) return null;
  const json = await res.json();
  return json.text ?? null;
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  if (!supabase) return NextResponse.json({ error: "No client" }, { status: 500 });

  const { id: iniciativaId } = await params;
  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 });

  const tipo = detectType(file.name);
  const timestamp = Date.now();
  const storagePath = `${iniciativaId}/${timestamp}_${file.name}`;

  const arrayBuffer = await file.arrayBuffer();
  const fileBlob = new Blob([arrayBuffer], { type: file.type });

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, fileBlob, { contentType: file.type, upsert: false });

  if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

  let transcripcion: string | null = null;
  if (tipo === "audio") {
    transcripcion = await transcribeAudio(fileBlob, file.name);
  }

  const { data, error: insertError } = await supabase
    .from("iniciativa_archivos")
    .insert({ iniciativa_id: iniciativaId, nombre: file.name, tipo, storage_path: storagePath, transcripcion })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
