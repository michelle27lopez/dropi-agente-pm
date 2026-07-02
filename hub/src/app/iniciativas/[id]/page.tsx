"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Archivo = {
  id: string;
  nombre: string;
  tipo: "excel" | "pdf" | "audio" | "otro";
  transcripcion: string | null;
  created_at: string;
};

type Iniciativa = {
  id: string;
  nombre: string;
  area: string;
  urgencia: "alta" | "media" | "baja";
  descripcion: string | null;
  creada_por: string;
  estado: "nueva" | "en_revision" | "procesada";
  created_at: string;
  archivos: Archivo[];
};

const URGENCIA_COLOR: Record<string, string> = {
  alta: "#EF4444", media: "#F59E0B", baja: "#6366F1",
};

const ESTADO_OPTS: { value: string; label: string }[] = [
  { value: "nueva", label: "Nueva" },
  { value: "en_revision", label: "En revisión" },
  { value: "procesada", label: "Procesada" },
];

const TIPO_ICON: Record<string, string> = {
  excel: "📊", pdf: "📄", audio: "🎙️", otro: "📎",
};

export default function IniciativaDetalle() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [iniciativa, setIniciativa] = useState<Iniciativa | null>(null);
  const [loading, setLoading] = useState(true);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Grabador de audio
  const [recording, setRecording] = useState(false);
  const [processingAudio, setProcessingAudio] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Estado update
  const [updatingEstado, setUpdatingEstado] = useState(false);

  // Transcripción expandida
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Eliminar archivo
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // Copiar transcripción
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchIniciativa();
  }, [id]);

  async function fetchIniciativa() {
    setLoading(true);
    const res = await fetch(`/api/iniciativas/${id}`);
    if (!res.ok) { setLoading(false); return; }
    const data = await res.json();
    setIniciativa(data);
    setLoading(false);
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadMsg(null);

    const form = new FormData();
    form.append("file", file);

    const res = await fetch(`/api/iniciativas/${id}/archivos`, { method: "POST", body: form });
    if (res.ok) {
      setUploadMsg(`"${file.name}" cargado correctamente.`);
      await fetchIniciativa();
    } else {
      const err = await res.json();
      setUploadMsg(`Error: ${err.error}`);
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "audio/mp4";
      const mr = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mr;

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const ext = mimeType.includes("webm") ? "webm" : "mp4";
        const file = new File([blob], `audio-${Date.now()}.${ext}`, { type: mimeType });
        setProcessingAudio(true);
        setUploadMsg("Transcribiendo audio con Whisper... puede tomar unos segundos.");
        const form = new FormData();
        form.append("file", file);
        const res = await fetch(`/api/iniciativas/${id}/archivos`, { method: "POST", body: form });
        if (res.ok) {
          setUploadMsg("Audio transcrito y guardado.");
          await fetchIniciativa();
        } else {
          const err = await res.json();
          setUploadMsg(`Error: ${err.error}`);
        }
        setProcessingAudio(false);
      };

      mr.start(1000);
      setRecording(true);
      setRecordingSeconds(0);
      timerRef.current = setInterval(() => setRecordingSeconds(s => s + 1), 1000);
    } catch {
      setUploadMsg("No se pudo acceder al micrófono. Verifica los permisos del navegador.");
    }
  }

  function stopRecording() {
    mediaRecorderRef.current?.stop();
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
  }

  async function handleEstadoChange(nuevoEstado: string) {
    if (!iniciativa) return;
    setUpdatingEstado(true);
    const res = await fetch(`/api/iniciativas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado: nuevoEstado }),
    });
    if (res.ok) {
      const updated = await res.json();
      setIniciativa(prev => prev ? { ...prev, estado: updated.estado } : prev);
    }
    setUpdatingEstado(false);
  }

  async function handleDeleteArchivo(archivoId: string) {
    setDeletingId(archivoId);
    const res = await fetch(`/api/iniciativas/${id}/archivos/${archivoId}`, { method: "DELETE" });
    if (res.ok) {
      setIniciativa(prev => prev ? { ...prev, archivos: prev.archivos.filter(a => a.id !== archivoId) } : prev);
    } else {
      const err = await res.json();
      setUploadMsg(`Error al eliminar: ${err.error}`);
    }
    setDeletingId(null);
    setConfirmDeleteId(null);
  }

  function wordCount(text: string): number {
    return text.trim().split(/\s+/).filter(Boolean).length;
  }

  // Whisper devuelve un bloque continuo de texto. Lo partimos en
  // párrafos cada ~4 oraciones para que sea escaneable en vez de un muro de texto.
  function toParagraphs(text: string): string[] {
    const sentences = text.match(/[^.!?]+[.!?]+|\S+$/g) ?? [text];
    const paragraphs: string[] = [];
    for (let i = 0; i < sentences.length; i += 4) {
      paragraphs.push(sentences.slice(i, i + 4).join(" ").trim());
    }
    return paragraphs.filter(Boolean);
  }

  async function handleCopy(archivoId: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopiedId(archivoId);
    setTimeout(() => setCopiedId(null), 1500);
  }

  function formatSeconds(s: number) {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = (s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando...</p>
      </main>
    );
  }

  if (!iniciativa) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--bg)", padding: 32 }}>
        <p style={{ color: "#EF4444" }}>Iniciativa no encontrada.</p>
        <a href="/iniciativas" style={{ fontSize: 13, color: "#6366F1" }}>← Volver al inbox</a>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "18px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button onClick={() => router.push("/iniciativas")} style={{ fontSize: 12, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
            ← Inbox
          </button>
          <span style={{ color: "var(--border)" }}>·</span>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>
            <span style={{ fontWeight: 700, color: URGENCIA_COLOR[iniciativa.urgencia] }}>{iniciativa.urgencia.toUpperCase()}</span>
            {" · "}{iniciativa.area}
          </span>
        </div>

        {/* Cambiar estado */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "var(--muted)" }}>Estado:</span>
          <select
            value={iniciativa.estado}
            disabled={updatingEstado}
            onChange={e => handleEstadoChange(e.target.value)}
            style={{
              fontSize: 12, fontWeight: 700, color: "#fff",
              background: iniciativa.estado === "nueva" ? "#0EA5E9" : iniciativa.estado === "en_revision" ? "#F77F00" : "#22C55E",
              border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer",
            }}
          >
            {ESTADO_OPTS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      </header>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "32px 24px" }}>
        {/* Info de la iniciativa */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 8 }}>
            {iniciativa.nombre}
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: iniciativa.descripcion ? 12 : 0 }}>
            Por {iniciativa.creada_por} · {new Date(iniciativa.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
          </p>
          {iniciativa.descripcion && (
            <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.6, background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px" }}>
              {iniciativa.descripcion}
            </p>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 32 }}>
          {/* Grabador de audio */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>🎙️ Grabar audio</h3>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18, lineHeight: 1.5 }}>
              Explica el contexto, la urgencia, lo que has visto. Se transcribe automáticamente con Whisper.
            </p>

            {!recording && !processingAudio && (
              <button
                onClick={startRecording}
                style={{
                  width: "100%", fontSize: 14, fontWeight: 700, color: "#fff",
                  background: "#EF4444", border: "none", borderRadius: 10, padding: "12px",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                }}
              >
                <span style={{ fontSize: 16 }}>⏺</span> Grabar
              </button>
            )}

            {recording && (
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#EF4444", fontVariantNumeric: "tabular-nums", marginBottom: 12 }}>
                  {formatSeconds(recordingSeconds)}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 16 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", display: "inline-block", animation: "pulse 1s infinite" }} />
                  <span style={{ fontSize: 12, color: "#EF4444", fontWeight: 600 }}>Grabando...</span>
                </div>
                <button
                  onClick={stopRecording}
                  style={{
                    width: "100%", fontSize: 14, fontWeight: 700, color: "#fff",
                    background: "#111827", border: "none", borderRadius: 10, padding: "12px",
                    cursor: "pointer",
                  }}
                >
                  ⏹ Detener y transcribir
                </button>
              </div>
            )}

            {processingAudio && (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <p style={{ fontSize: 13, color: "#6366F1", fontWeight: 600 }}>Transcribiendo con Whisper...</p>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Puede tomar unos segundos.</p>
              </div>
            )}
          </div>

          {/* Upload de archivos */}
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>📎 Adjuntar archivo</h3>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 18, lineHeight: 1.5 }}>
              Excel, PDF u otro documento con datos o evidencia del problema.
            </p>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              style={{
                width: "100%", fontSize: 14, fontWeight: 700,
                color: uploading ? "var(--muted)" : "#6366F1",
                background: uploading ? "var(--bg)" : "#EEF2FF",
                border: `1px dashed ${uploading ? "var(--border)" : "#C7D2FE"}`,
                borderRadius: 10, padding: "12px",
                cursor: uploading ? "not-allowed" : "pointer",
              }}
            >
              {uploading ? "Subiendo..." : "Seleccionar archivo"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv,.pdf,.doc,.docx"
              onChange={handleFileUpload}
              style={{ display: "none" }}
            />
          </div>
        </div>

        {/* Mensaje de feedback */}
        {uploadMsg && (
          <div style={{
            fontSize: 13, color: uploadMsg.startsWith("Error") ? "#EF4444" : "#22C55E",
            background: uploadMsg.startsWith("Error") ? "#FEF2F2" : "#F0FDF4",
            border: `1px solid ${uploadMsg.startsWith("Error") ? "#FCA5A5" : "#86EFAC"}`,
            borderRadius: 8, padding: "10px 14px", marginBottom: 20,
          }}>
            {uploadMsg}
          </div>
        )}

        {/* Lista de archivos */}
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>
            Archivos y audios ({iniciativa.archivos.length})
          </h3>

          {iniciativa.archivos.length === 0 ? (
            <div style={{
              background: "#fff", border: "1px dashed var(--border)", borderRadius: 12,
              padding: "32px", textAlign: "center",
            }}>
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Todavía no hay archivos. Graba un audio o adjunta un documento.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {iniciativa.archivos.map(a => (
                <div key={a.id} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 20px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 20 }}>{TIPO_ICON[a.tipo]}</span>
                      <div>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{a.nombre}</p>
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>
                          {new Date(a.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      {a.transcripcion && (
                        <button
                          onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
                          style={{
                            fontSize: 12, color: "#6366F1", background: "#EEF2FF",
                            border: "1px solid #C7D2FE", borderRadius: 6, padding: "4px 10px",
                            cursor: "pointer", fontWeight: 600,
                          }}
                        >
                          {expandedId === a.id ? "Ocultar" : `Ver transcripción · ${wordCount(a.transcripcion)} palabras`}
                        </button>
                      )}

                      {confirmDeleteId === a.id ? (
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <button
                            onClick={() => handleDeleteArchivo(a.id)}
                            disabled={deletingId === a.id}
                            style={{
                              fontSize: 12, fontWeight: 700, color: "#fff",
                              background: "#EF4444", border: "none", borderRadius: 6,
                              padding: "4px 10px", cursor: "pointer",
                            }}
                          >
                            {deletingId === a.id ? "..." : "Confirmar"}
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            style={{
                              fontSize: 12, color: "var(--muted)", background: "var(--bg)",
                              border: "1px solid var(--border)", borderRadius: 6,
                              padding: "4px 10px", cursor: "pointer",
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDeleteId(a.id)}
                          title="Eliminar archivo"
                          style={{
                            fontSize: 13, color: "#EF4444", background: "transparent",
                            border: "none", cursor: "pointer", padding: "4px 6px",
                          }}
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                  {expandedId === a.id && a.transcripcion && (
                    <div style={{ marginTop: 14 }}>
                      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
                        <button
                          onClick={() => handleCopy(a.id, a.transcripcion!)}
                          style={{
                            fontSize: 11, fontWeight: 600,
                            color: copiedId === a.id ? "#22C55E" : "var(--muted)",
                            background: "transparent", border: "none", cursor: "pointer",
                            padding: "2px 4px",
                          }}
                        >
                          {copiedId === a.id ? "✓ Copiado" : "📋 Copiar texto"}
                        </button>
                      </div>
                      <div style={{
                        padding: "16px 18px",
                        background: "#F8F9FA", border: "1px solid var(--border)", borderRadius: 8,
                        fontSize: 13, color: "var(--fg)", lineHeight: 1.7,
                        maxHeight: 360, overflowY: "auto",
                      }}>
                        {toParagraphs(a.transcripcion).map((p, idx) => (
                          <p key={idx} style={{ marginBottom: idx < toParagraphs(a.transcripcion!).length - 1 ? 12 : 0 }}>
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
