"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const AREAS = ["Comercial", "Operaciones", "Diseño", "Producto", "Tech", "Legal", "Data", "Otra"];

type Iniciativa = {
  id: string;
  nombre: string;
  area: string;
  urgencia: "alta" | "media" | "baja";
  descripcion: string | null;
  creada_por: string;
  estado: "nueva" | "en_revision" | "procesada";
  created_at: string;
  iniciativa_archivos: { count: number }[];
};

const URGENCIA_COLOR: Record<string, string> = {
  alta: "#EF4444",
  media: "#F59E0B",
  baja: "#6366F1",
};

const ESTADO_COLOR: Record<string, string> = {
  nueva: "#0EA5E9",
  en_revision: "#F77F00",
  procesada: "#22C55E",
};

const ESTADO_LABEL: Record<string, string> = {
  nueva: "Nueva",
  en_revision: "En revisión",
  procesada: "Procesada",
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: color + "18",
      border: `1px solid ${color}33`,
      borderRadius: 6, padding: "2px 8px",
      textTransform: "capitalize",
    }}>
      {label}
    </span>
  );
}

export default function IniciativasPage() {
  const router = useRouter();
  const [tab, setTab] = useState<"nueva" | "inbox">("inbox");
  const [iniciativas, setIniciativas] = useState<Iniciativa[]>([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [nombre, setNombre] = useState("");
  const [area, setArea] = useState(AREAS[0]);
  const [urgencia, setUrgencia] = useState<"alta" | "media" | "baja">("media");
  const [descripcion, setDescripcion] = useState("");
  const [creadaPor, setCreadaPor] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetchIniciativas();
  }, []);

  async function fetchIniciativas() {
    setLoading(true);
    const res = await fetch("/api/iniciativas");
    const data = await res.json();
    setIniciativas(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!nombre.trim() || !creadaPor.trim()) {
      setFormError("Nombre e iniciador son obligatorios.");
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/iniciativas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre: nombre.trim(), area, urgencia, descripcion: descripcion.trim() || null, creada_por: creadaPor.trim() }),
    });
    if (!res.ok) {
      const err = await res.json();
      setFormError(err.error ?? "Error al crear la iniciativa.");
      setSubmitting(false);
      return;
    }
    const iniciativa = await res.json();
    setSubmitting(false);
    router.push(`/iniciativas/${iniciativa.id}`);
  }

  function archivosCount(i: Iniciativa): number {
    return i.iniciativa_archivos?.[0]?.count ?? 0;
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <a href="/" style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>← Hub</a>
          <span style={{ color: "var(--border)" }}>·</span>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#6366F1",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
            }}>📥</div>
            <div>
              <h1 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>Research Inbox</h1>
              <p style={{ fontSize: 11, color: "var(--muted)" }}>Iniciativas del equipo</p>
            </div>
          </div>
        </div>

        <button
          onClick={() => { setTab("nueva"); }}
          style={{
            fontSize: 12, fontWeight: 700, color: "#fff",
            background: "#6366F1",
            border: "none", borderRadius: 8, padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          + Nueva Iniciativa
        </button>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: "#fff", border: "1px solid var(--border)", borderRadius: 10, padding: 4, width: "fit-content" }}>
          {[
            { key: "inbox", label: "📋 Inbox PM" },
            { key: "nueva", label: "✏️ Nueva Iniciativa" },
          ].map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "nueva" | "inbox")}
              style={{
                fontSize: 13, fontWeight: tab === t.key ? 700 : 500,
                color: tab === t.key ? "#6366F1" : "var(--muted)",
                background: tab === t.key ? "#EEF2FF" : "transparent",
                border: "none", borderRadius: 8, padding: "7px 16px",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB: Inbox PM */}
        {tab === "inbox" && (
          <div>
            {loading ? (
              <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando iniciativas...</p>
            ) : iniciativas.length === 0 ? (
              <div style={{
                background: "#fff", border: "1px solid var(--border)", borderRadius: 12,
                padding: "48px 32px", textAlign: "center",
              }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>📭</div>
                <p style={{ fontSize: 15, color: "var(--muted)" }}>No hay iniciativas todavía.</p>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
                  Comparte el link con tu equipo para que suban la primera.
                </p>
                <button
                  onClick={() => setTab("nueva")}
                  style={{
                    marginTop: 16, fontSize: 13, fontWeight: 700, color: "#6366F1",
                    background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 8,
                    padding: "8px 16px", cursor: "pointer",
                  }}
                >
                  Crear la primera
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {iniciativas.map(i => (
                  <div
                    key={i.id}
                    onClick={() => router.push(`/iniciativas/${i.id}`)}
                    style={{
                      background: "#fff", border: "1px solid var(--border)", borderRadius: 12,
                      padding: "18px 22px", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      gap: 16, transition: "box-shadow 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.08)")}
                    onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
                  >
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <Badge label={i.urgencia} color={URGENCIA_COLOR[i.urgencia]} />
                        <Badge label={ESTADO_LABEL[i.estado]} color={ESTADO_COLOR[i.estado]} />
                        <span style={{ fontSize: 11, color: "var(--muted)" }}>{i.area}</span>
                      </div>
                      <p style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)", marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {i.nombre}
                      </p>
                      <p style={{ fontSize: 12, color: "var(--muted)" }}>
                        {i.creada_por} · {new Date(i.created_at).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)" }}>{archivosCount(i)}</p>
                      <p style={{ fontSize: 11, color: "var(--muted)" }}>archivo{archivosCount(i) !== 1 ? "s" : ""}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB: Nueva Iniciativa */}
        {tab === "nueva" && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 16, padding: "32px" }}>
            <h2 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Nueva Iniciativa</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 28 }}>
              Cuéntanos qué está pasando. Después de crear la iniciativa podrás agregar documentos y grabar audios.
            </p>

            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label style={labelStyle}>¿Cuál es la iniciativa o problema?</label>
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Ej: Caída en conversión de búsqueda móvil"
                  required
                  style={inputStyle}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={labelStyle}>Área que reporta</label>
                  <select value={area} onChange={e => setArea(e.target.value)} style={inputStyle}>
                    {AREAS.map(a => <option key={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Urgencia</label>
                  <select value={urgencia} onChange={e => setUrgencia(e.target.value as "alta" | "media" | "baja")} style={inputStyle}>
                    <option value="alta">Alta</option>
                    <option value="media">Media</option>
                    <option value="baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Tu nombre</label>
                <input
                  value={creadaPor}
                  onChange={e => setCreadaPor(e.target.value)}
                  placeholder="Ej: María García"
                  required
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>Contexto breve (opcional)</label>
                <textarea
                  value={descripcion}
                  onChange={e => setDescripcion(e.target.value)}
                  placeholder="2-3 líneas de contexto. Puedes agregar más detalle con documentos y audios en el siguiente paso."
                  rows={3}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              {formError && (
                <p style={{ fontSize: 13, color: "#EF4444", background: "#FEF2F2", padding: "10px 14px", borderRadius: 8 }}>
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontSize: 14, fontWeight: 700, color: "#fff",
                  background: submitting ? "#A5B4FC" : "#6366F1",
                  border: "none", borderRadius: 10, padding: "12px",
                  cursor: submitting ? "not-allowed" : "pointer",
                }}
              >
                {submitting ? "Creando..." : "Crear iniciativa →"}
              </button>
            </form>
          </div>
        )}
      </div>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 12, fontWeight: 600,
  color: "var(--muted)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.05em",
};

const inputStyle: React.CSSProperties = {
  width: "100%", fontSize: 14, color: "var(--fg)",
  background: "var(--bg)", border: "1px solid var(--border)",
  borderRadius: 8, padding: "10px 12px",
  outline: "none", boxSizing: "border-box",
};
