"use client";

import { useEffect, useState } from "react";

type Status = "Backlog" | "Programada" | "Hecha" | "Documentada";
type Source = "Programa" | "Comunidad";

type Sesion = {
  id: string;
  title: string;
  track: string | null;
  facilitator: string | null;
  description: string | null;
  status: Status;
  source: Source;
  session_date: string | null;
  proposed_by: string | null;
  doc_url: string | null;
  recording_url: string | null;
  notes: string | null;
  sort_order: number;
  created_at: string;
};

type Me = {
  user: { id: string; email: string } | null;
  profile: { nombre: string | null } | null;
};

type Draft = {
  status: Status;
  session_date: string;
  doc_url: string;
  recording_url: string;
  notes: string;
  facilitator: string;
};

const TRACKS = ["Célula", "E-commerce", "Chatea Pro", "Shopi", "Estados", "ROAX", "ATOM", "Fennix", "Otro"];

// Vista previa mientras no exista la tabla `expertos_sessions` en Supabase (migración 023).
// En cuanto la migración corra, el fetch real trae filas y esto deja de usarse.
const FALLBACK_SESIONES: Sesion[] = [
  { title: "Intensivo células", track: "Célula", facilitator: null, sort_order: 1 },
  { title: "Capacitación de e-commerce", track: "E-commerce", facilitator: "María Ossa", sort_order: 2 },
  { title: "Chatea Pro: socialicemos el modelo de chateo y las posibilidades", track: "Chatea Pro", facilitator: null, sort_order: 3 },
  { title: "Conozcamos Shopi", track: "Shopi", facilitator: null, sort_order: 4 },
  { title: "Estados a profundidad", track: "Estados", facilitator: null, sort_order: 5 },
  { title: "Conozcamos ROAX", track: "ROAX", facilitator: null, sort_order: 6 },
  { title: "Conozcamos ATOM", track: "ATOM", facilitator: null, sort_order: 7 },
  { title: "Conozcamos Fennix", track: "Fennix", facilitator: null, sort_order: 8 },
].map((s, i) => ({
  id: `fallback-${i + 1}`,
  title: s.title,
  track: s.track,
  facilitator: s.facilitator,
  description: null,
  status: "Backlog",
  source: "Programa",
  session_date: null,
  proposed_by: null,
  doc_url: null,
  recording_url: null,
  notes: null,
  sort_order: s.sort_order,
  created_at: new Date().toISOString(),
}));

const TRACK_COLOR: Record<string, string> = {
  "Célula": "#7C3AED",
  "E-commerce": "#F77F00",
  "Chatea Pro": "#0EA5E9",
  "Shopi": "#059669",
  "Estados": "#DB2777",
  "ROAX": "#DC2626",
  "ATOM": "#4F46E5",
  "Fennix": "#B45309",
  "Otro": "#64748B",
};

const STATUS_META: Record<Status, { bg: string; fg: string }> = {
  Backlog: { bg: "#F3F4F6", fg: "#6B7280" },
  Programada: { bg: "#DBEAFE", fg: "#1D4ED8" },
  Hecha: { bg: "#DCFCE7", fg: "#15803D" },
  Documentada: { bg: "#F5F3FF", fg: "#7C3AED" },
};

function fmtDate(iso: string) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("es-CO", { weekday: "short", day: "numeric", month: "short" });
}

function weekLabel(iso: string) {
  const d = new Date(iso + "T00:00:00");
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1) - day;
  const monday = new Date(d);
  monday.setDate(d.getDate() + diff);
  return `Semana del ${monday.toLocaleDateString("es-CO", { day: "numeric", month: "long" })}`;
}

function TrackBadge({ track }: { track: string | null }) {
  const color = TRACK_COLOR[track ?? "Otro"] ?? "#64748B";
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 700, color, background: `${color}1A`,
      padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      {track ?? "Otro"}
    </span>
  );
}

function StatusBadge({ status }: { status: Status }) {
  const meta = STATUS_META[status];
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, background: meta.bg, color: meta.fg,
      padding: "3px 9px", borderRadius: 20, whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 8,
    border: "1px solid var(--border)", color: "var(--fg)", background: "#fff",
  };
}

function draftFromSesion(s: Sesion): Draft {
  return {
    status: s.status,
    session_date: s.session_date ?? "",
    doc_url: s.doc_url ?? "",
    recording_url: s.recording_url ?? "",
    notes: s.notes ?? "",
    facilitator: s.facilitator ?? "",
  };
}

function SessionRow({
  sesion, canEdit, editing, draft, onStartEdit, onCancelEdit, onChangeDraft, onSave, showProposer,
}: {
  sesion: Sesion;
  canEdit: boolean;
  editing: boolean;
  draft: Draft | null;
  onStartEdit: () => void;
  onCancelEdit: () => void;
  onChangeDraft: (d: Draft) => void;
  onSave: () => void;
  showProposer?: boolean;
}) {
  return (
    <div style={{ padding: "14px 16px", borderTop: "1px solid #F3F4F6" }}>
      <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 4 }}>
            <span style={{ fontSize: 13.5, fontWeight: 700, color: "var(--fg)" }}>{sesion.title}</span>
            <TrackBadge track={sesion.track} />
            <StatusBadge status={sesion.status} />
          </div>
          {sesion.description && (
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, marginBottom: 4 }}>
              {sesion.description}
            </div>
          )}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", fontSize: 12, color: "var(--muted)" }}>
            {sesion.facilitator && <span>🎤 {sesion.facilitator}</span>}
            {showProposer && sesion.proposed_by && <span>💬 Propuesta por {sesion.proposed_by}</span>}
            {sesion.doc_url && (
              <a href={sesion.doc_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--dropi)", textDecoration: "none", fontWeight: 600 }}>
                📄 Ficha en el cerebro ↗
              </a>
            )}
            {sesion.recording_url && (
              <a href={sesion.recording_url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--dropi)", textDecoration: "none", fontWeight: 600 }}>
                🎥 Grabación ↗
              </a>
            )}
          </div>
          {sesion.notes && (
            <div style={{ fontSize: 12, color: "var(--fg)", background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 10px", marginTop: 8, lineHeight: 1.4 }}>
              🧠 {sesion.notes}
            </div>
          )}
        </div>
        {canEdit && !editing && (
          <button
            onClick={onStartEdit}
            style={{ fontSize: 11.5, fontWeight: 700, color: "var(--dropi)", background: "none", border: "1px solid var(--border)", borderRadius: 20, padding: "4px 10px", cursor: "pointer", whiteSpace: "nowrap" }}
          >
            ✎ Editar
          </button>
        )}
      </div>

      {editing && draft && (
        <div style={{ marginTop: 12, padding: 14, background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 10 }}>
          <div>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Estado</label>
            <select
              value={draft.status}
              onChange={(e) => onChangeDraft({ ...draft, status: e.target.value as Status })}
              style={inputStyle()}
            >
              {(["Backlog", "Programada", "Hecha", "Documentada"] as Status[]).map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Fecha</label>
            <input type="date" value={draft.session_date} onChange={(e) => onChangeDraft({ ...draft, session_date: e.target.value })} style={inputStyle()} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Facilitador</label>
            <input type="text" value={draft.facilitator} onChange={(e) => onChangeDraft({ ...draft, facilitator: e.target.value })} style={inputStyle()} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Ficha en Confluence</label>
            <input type="url" placeholder="https://…" value={draft.doc_url} onChange={(e) => onChangeDraft({ ...draft, doc_url: e.target.value })} style={inputStyle()} />
          </div>
          <div>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Grabación</label>
            <input type="url" placeholder="https://…" value={draft.recording_url} onChange={(e) => onChangeDraft({ ...draft, recording_url: e.target.value })} style={inputStyle()} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Aprendizaje clave</label>
            <textarea rows={2} value={draft.notes} onChange={(e) => onChangeDraft({ ...draft, notes: e.target.value })} style={{ ...inputStyle(), resize: "vertical" }} />
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button onClick={onCancelEdit} style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              Cancelar
            </button>
            <button onClick={onSave} style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}>
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ExpertosNegocioRoadmapPage() {
  const [sesiones, setSesiones] = useState<Sesion[] | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newTrack, setNewTrack] = useState(TRACKS[0]);
  const [newDate, setNewDate] = useState("");
  const [newDescription, setNewDescription] = useState("");

  function refetchSesiones() {
    fetch("/api/expertos-sesiones")
      .then((r) => r.json())
      .then((data) => setSesiones(Array.isArray(data) && data.length > 0 ? data : FALLBACK_SESIONES))
      .catch(() => setSesiones(FALLBACK_SESIONES));
  }

  useEffect(() => {
    refetchSesiones();
    fetch("/api/me").then((r) => r.json()).then(setMe);
  }, []);

  function startEdit(s: Sesion) {
    setEditingId(s.id);
    setDraft(draftFromSesion(s));
  }

  async function saveEdit(id: string) {
    if (!draft) return;
    setSaving(true);
    await fetch(`/api/expertos-sesiones/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...draft, session_date: draft.session_date || null }),
    });
    setSaving(false);
    setEditingId(null);
    setDraft(null);
    refetchSesiones();
  }

  async function submitProposal(e: React.FormEvent) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setSaving(true);
    setFormError(null);
    const res = await fetch("/api/expertos-sesiones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: newTitle.trim(),
        track: newTrack,
        session_date: newDate || null,
        description: newDescription.trim() || null,
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setFormError(body.error || "No se pudo guardar la propuesta.");
      return;
    }
    setNewTitle("");
    setNewDate("");
    setNewDescription("");
    setShowForm(false);
    refetchSesiones();
  }

  if (!sesiones) {
    return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p></main>;
  }

  const usingFallback = sesiones.length > 0 && sesiones[0].id.startsWith("fallback-");
  const canEdit = !!me?.user && !usingFallback;
  const proximas = sesiones.filter((s) => s.session_date);
  const backlogPrograma = sesiones
    .filter((s) => s.source === "Programa" && s.status === "Backlog")
    .sort((a, b) => a.sort_order - b.sort_order);
  const propuestasComunidad = sesiones.filter((s) => s.source === "Comunidad" && s.status === "Backlog");
  const documentadas = sesiones.filter((s) => s.status === "Documentada").length;
  const en4Semanas = proximas.filter((s) => {
    const d = new Date(s.session_date + "T00:00:00");
    const diffDays = (d.getTime() - Date.now()) / 86400000;
    return diffDays >= -1 && diffDays <= 28;
  }).length;

  let lastWeek = "";

  const rowProps = (s: Sesion, showProposer?: boolean) => ({
    sesion: s,
    canEdit,
    editing: editingId === s.id,
    draft: editingId === s.id ? draft : null,
    onStartEdit: () => startEdit(s),
    onCancelEdit: () => { setEditingId(null); setDraft(null); },
    onChangeDraft: setDraft,
    onSave: () => saveEdit(s.id),
    showProposer,
  });

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Expertos en el Negocio · Roadmap</span>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#F5F3FF", color: "#7C3AED", padding: "3px 9px", borderRadius: 20 }}>
              EXP-001
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Expertos en el Negocio · Roadmap
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 680 }}>
            Programa de capacitación y contextualización del equipo en el negocio Dropi. Tiene dos partes:
            <strong> capacitarnos</strong> en sesiones semanales sobre cómo funciona cada módulo, y{" "}
            <strong>documentar</strong> lo aprendido para construir el cerebro de negocio-producto — la
            traducción de la estrategia y la lógica detrás de las definiciones de producto.
          </p>
        </div>

        {usingFallback && (
          <div style={{
            background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10,
            padding: "10px 14px", marginBottom: 24, fontSize: 12.5, color: "#B45309",
          }}>
            👀 Vista previa con el backlog de ejemplo — falta conectar la tabla en Supabase para que sea
            interactiva (editar, agendar y recibir propuestas). En cuanto se aplique la migración, esta
            sección se reemplaza sola con los datos reales.
          </div>
        )}

        {/* KPI strip */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: "Sesiones totales", value: String(sesiones.length), color: "var(--dropi)" },
            { label: "Documentadas en el cerebro", value: String(documentadas), color: "#7C3AED" },
            { label: "Próximas 4 semanas", value: String(en4Semanas), color: "#1D4ED8" },
            { label: "Propuestas pendientes", value: String(propuestasComunidad.length), color: "#DC2626" },
          ].map((c) => (
            <div key={c.label} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Próximas sesiones */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>📅 Próximas sesiones</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>Cadencia semanal, ordenadas por fecha.</p>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {proximas.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)", padding: 16 }}>Aún no hay sesiones agendadas con fecha.</p>
            )}
            {proximas.map((s) => {
              const wl = weekLabel(s.session_date!);
              const showHeader = wl !== lastWeek;
              lastWeek = wl;
              return (
                <div key={s.id}>
                  {showHeader && (
                    <div style={{ padding: "10px 16px 4px", fontSize: 11, fontWeight: 700, color: "var(--dropi)", textTransform: "uppercase", letterSpacing: "0.04em", background: "#FAFAFA" }}>
                      {wl} · {fmtDate(s.session_date!)}
                    </div>
                  )}
                  <SessionRow {...rowProps(s, true)} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Backlog oficial */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>🗂️ Backlog del programa</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            Sesiones ya definidas, pendientes de agendar semana a semana.
          </p>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {backlogPrograma.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)", padding: 16 }}>Backlog vacío.</p>
            )}
            {backlogPrograma.map((s) => <SessionRow key={s.id} {...rowProps(s)} />)}
          </div>
        </div>

        {/* Propuestas de la comunidad */}
        <div style={{ marginBottom: 36 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>💡 Propuestas de la comunidad</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            Temas que cualquier persona del equipo propuso para sumar a la cola.
          </p>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {propuestasComunidad.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)", padding: 16 }}>Todavía no hay propuestas de la comunidad.</p>
            )}
            {propuestasComunidad.map((s) => <SessionRow key={s.id} {...rowProps(s, true)} />)}
          </div>
        </div>

        {/* Sugerir un tema */}
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>✍️ Sugerir un tema</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 14 }}>
            ¿Tienes un tema o taller que quieras traer al equipo? Agrégalo aquí con la fecha en la que te gustaría presentarlo.
          </p>

          {usingFallback ? (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 20, fontSize: 13, color: "var(--muted)" }}>
              El formulario se activa en cuanto se conecte la base de datos (ver aviso arriba).
            </div>
          ) : !me?.user ? (
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 20, fontSize: 13, color: "var(--muted)" }}>
              <a href="/login" style={{ color: "var(--dropi)", fontWeight: 700, textDecoration: "none" }}>Inicia sesión</a> para proponer un tema.
            </div>
          ) : !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer" }}
            >
              + Proponer un tema
            </button>
          ) : (
            <form onSubmit={submitProposal} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 12 }}>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Tema</label>
                <input type="text" required value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Ej. Conozcamos el módulo de facturación" style={inputStyle()} />
              </div>
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Categoría</label>
                <select value={newTrack} onChange={(e) => setNewTrack(e.target.value)} style={inputStyle()}>
                  {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Fecha deseada (opcional)</label>
                <input type="date" value={newDate} onChange={(e) => setNewDate(e.target.value)} style={inputStyle()} />
              </div>
              <div style={{ gridColumn: "1 / -1" }}>
                <label style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>¿Por qué es útil? (opcional)</label>
                <textarea rows={2} value={newDescription} onChange={(e) => setNewDescription(e.target.value)} style={{ ...inputStyle(), resize: "vertical" }} />
              </div>
              {formError && <div style={{ gridColumn: "1 / -1", fontSize: 12, color: "#B91C1C" }}>{formError}</div>}
              <div style={{ gridColumn: "1 / -1", display: "flex", gap: 8, justifyContent: "flex-end" }}>
                <button type="button" onClick={() => setShowForm(false)} style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}>
                  Cancelar
                </button>
                <button type="submit" disabled={saving} style={{ fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
                  {saving ? "Guardando…" : "Agregar a la cola"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
