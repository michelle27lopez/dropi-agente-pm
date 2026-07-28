"use client";

import { useEffect, useMemo, useState } from "react";

type Status = "Backlog" | "Programada" | "Hecha" | "Documentada";
type Source = "Programa" | "Comunidad";
type Resource = { label: string; url: string };

type Sesion = {
  id: string;
  title: string;
  facilitator: string | null;
  track: string | null;
  description: string | null;
  session_date: string | null;
  duration: string | null;
  status: Status;
  resources: Resource[];
  notes: string | null;
  proposed_by: string | null;
  source: Source;
  sort_order: number;
  created_at: string;
};

type Me = {
  user: { id: string; email: string } | null;
  profile: { nombre: string | null } | null;
};

type FormState = {
  id: string | null;
  title: string;
  facilitator: string;
  track: string;
  description: string;
  session_date: string;
  duration: string;
  status: Status;
  resources: Resource[];
  notes: string;
};

const DURATION_PRESETS = ["30 min", "1 hora", "1.5 horas", "2 horas"];

const TRACKS = ["Célula", "E-commerce", "Chatea Pro", "Shopi", "Estados", "ROAX", "ATOM", "Fennix", "Otro"];

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

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

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
  facilitator: s.facilitator,
  track: s.track,
  description: null,
  session_date: null,
  duration: null,
  status: "Backlog" as Status,
  resources: [],
  notes: null,
  proposed_by: null,
  source: "Programa" as Source,
  sort_order: s.sort_order,
  created_at: new Date().toISOString(),
}));

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function dateKey(d: Date) {
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function buildCalendarGrid(monthStart: Date): Date[] {
  const year = monthStart.getFullYear();
  const month = monthStart.getMonth();
  const lastDay = new Date(year, month + 1, 0);
  const firstWeekday = (monthStart.getDay() + 6) % 7; // 0 = lunes
  const lastWeekday = (lastDay.getDay() + 6) % 7;
  const days: Date[] = [];
  for (let i = firstWeekday; i > 0; i--) days.push(new Date(year, month, 1 - i));
  for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d));
  for (let i = 1; i <= 6 - lastWeekday; i++) days.push(new Date(year, month, lastDay.getDate() + i));
  return days;
}

function inputStyle(): React.CSSProperties {
  return {
    width: "100%", fontSize: 13, padding: "8px 10px", borderRadius: 8,
    border: "1px solid var(--border)", color: "var(--fg)", background: "#fff",
  };
}

function labelStyle(): React.CSSProperties {
  return { fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: 4 };
}

function emptyForm(dateKeyStr?: string): FormState {
  return {
    id: null,
    title: "",
    facilitator: "",
    track: TRACKS[0],
    description: "",
    session_date: dateKeyStr ?? "",
    duration: "",
    status: dateKeyStr ? "Programada" : "Backlog",
    resources: [],
    notes: "",
  };
}

function formFromSesion(s: Sesion): FormState {
  return {
    id: s.id,
    title: s.title,
    facilitator: s.facilitator ?? "",
    track: s.track ?? TRACKS[0],
    description: s.description ?? "",
    session_date: s.session_date ?? "",
    duration: s.duration ?? "",
    status: s.status,
    resources: s.resources ?? [],
    notes: s.notes ?? "",
  };
}

function SessionModal({
  mode, form, onChange, onCancel, onSave, saving, error, extra,
}: {
  mode: "create" | "edit";
  form: FormState;
  onChange: (f: FormState) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  extra?: { proposedBy: string | null; createdAt: string } | null;
}) {
  function updateResource(i: number, field: keyof Resource, value: string) {
    const next = form.resources.slice();
    next[i] = { ...next[i], [field]: value };
    onChange({ ...form, resources: next });
  }
  function addResource() {
    onChange({ ...form, resources: [...form.resources, { label: "", url: "" }] });
  }
  function removeResource(i: number) {
    onChange({ ...form, resources: form.resources.filter((_, idx) => idx !== i) });
  }

  return (
    <div
      onClick={onCancel}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, width: "min(560px, 100%)", maxHeight: "88vh", overflowY: "auto", padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 16 }}>
          {mode === "create" ? "Nueva capacitación" : "Editar capacitación"}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle()}>Tema</label>
            <input type="text" value={form.title} onChange={(e) => onChange({ ...form, title: e.target.value })} placeholder="Ej. Conozcamos el módulo de facturación" style={inputStyle()} />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle()}>Moderador</label>
              <input type="text" value={form.facilitator} onChange={(e) => onChange({ ...form, facilitator: e.target.value })} style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle()}>Categoría</label>
              <select value={form.track} onChange={(e) => onChange({ ...form, track: e.target.value })} style={inputStyle()}>
                {TRACKS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle()}>Fecha</label>
              <input type="date" value={form.session_date} onChange={(e) => onChange({ ...form, session_date: e.target.value, status: e.target.value ? "Programada" : "Backlog" })} style={inputStyle()} />
            </div>
            <div>
              <label style={labelStyle()}>Duración</label>
              <input type="text" list="duracion-presets" placeholder="ej. 1 hora" value={form.duration} onChange={(e) => onChange({ ...form, duration: e.target.value })} style={inputStyle()} />
              <datalist id="duracion-presets">
                {DURATION_PRESETS.map((d) => <option key={d} value={d} />)}
              </datalist>
            </div>
            <div>
              <label style={labelStyle()}>Estado</label>
              <select value={form.status} onChange={(e) => onChange({ ...form, status: e.target.value as Status })} style={inputStyle()}>
                {(["Backlog", "Programada", "Hecha", "Documentada"] as Status[]).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle()}>Descripción / preguntas esenciales</label>
            <textarea rows={3} value={form.description} onChange={(e) => onChange({ ...form, description: e.target.value })} style={{ ...inputStyle(), resize: "vertical" }} />
          </div>

          <div>
            <label style={labelStyle()}>Recursos (grabación, transcripción, material previo…)</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.resources.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 6 }}>
                  <input type="text" placeholder="Etiqueta (ej. Grabación)" value={r.label} onChange={(e) => updateResource(i, "label", e.target.value)} style={{ ...inputStyle(), flex: "0 0 40%" }} />
                  <input type="url" placeholder="https://…" value={r.url} onChange={(e) => updateResource(i, "url", e.target.value)} style={{ ...inputStyle(), flex: 1 }} />
                  <button type="button" onClick={() => removeResource(i)} style={{ border: "1px solid var(--border)", background: "#fff", borderRadius: 8, width: 32, cursor: "pointer", color: "var(--muted)" }}>×</button>
                </div>
              ))}
              <button
                type="button"
                onClick={addResource}
                style={{ alignSelf: "flex-start", fontSize: 12, fontWeight: 700, color: "var(--dropi)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}
              >
                + Agregar recurso
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle()}>Aprendizaje clave (opcional, para después de la sesión)</label>
            <textarea rows={2} value={form.notes} onChange={(e) => onChange({ ...form, notes: e.target.value })} style={{ ...inputStyle(), resize: "vertical" }} />
          </div>

          {extra && (
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>
              {extra.proposedBy && <>Agregada por {extra.proposedBy} · </>}
              {new Date(extra.createdAt).toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" })}
            </div>
          )}

          {error && <div style={{ fontSize: 12, color: "#B91C1C" }}>{error}</div>}

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 6 }}>
            <button onClick={onCancel} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 16px", cursor: "pointer" }}>
              Cancelar
            </button>
            <button onClick={onSave} disabled={saving} style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", opacity: saving ? 0.6 : 1 }}>
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ExpertosNegocioRoadmapPage() {
  const [sesiones, setSesiones] = useState<Sesion[] | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [viewMonth, setViewMonth] = useState(() => { const d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1); });
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [modalExtra, setModalExtra] = useState<{ proposedBy: string | null; createdAt: string } | null>(null);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [dragOverKey, setDragOverKey] = useState<string | null>(null);

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

  const usingFallback = !!sesiones && sesiones.length > 0 && sesiones[0].id.startsWith("fallback-");
  const canEdit = !!me?.user && !usingFallback;

  const byDate = useMemo(() => {
    const map: Record<string, Sesion[]> = {};
    (sesiones ?? []).forEach((s) => {
      if (s.session_date) (map[s.session_date] ??= []).push(s);
    });
    return map;
  }, [sesiones]);

  const backlog = useMemo(
    () => (sesiones ?? []).filter((s) => !s.session_date).sort((a, b) => a.sort_order - b.sort_order || a.created_at.localeCompare(b.created_at)),
    [sesiones]
  );

  function openCreate(dateStr?: string) {
    if (!canEdit) return;
    setModalExtra(null);
    setForm(emptyForm(dateStr));
    setModalMode("create");
    setFormError(null);
  }

  function openEdit(s: Sesion) {
    if (!canEdit) return;
    setModalExtra({ proposedBy: s.proposed_by, createdAt: s.created_at });
    setForm(formFromSesion(s));
    setModalMode("edit");
    setFormError(null);
  }

  function closeModal() {
    setModalMode(null);
    setForm(null);
    setModalExtra(null);
  }

  async function saveForm() {
    if (!form) return;
    if (!form.title.trim()) {
      setFormError("El tema es requerido.");
      return;
    }
    setSaving(true);
    setFormError(null);
    const payload = {
      title: form.title.trim(),
      facilitator: form.facilitator.trim() || null,
      track: form.track,
      description: form.description.trim() || null,
      session_date: form.session_date || null,
      duration: form.duration.trim() || null,
      status: form.status,
      resources: form.resources.filter((r) => r.label.trim() || r.url.trim()),
      notes: form.notes.trim() || null,
    };
    const res = modalMode === "create"
      ? await fetch("/api/expertos-sesiones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      : await fetch(`/api/expertos-sesiones/${form.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setFormError(body.error || "No se pudo guardar.");
      return;
    }
    closeModal();
    refetchSesiones();
  }

  async function scheduleViaDrop(sessionId: string, dateStr: string) {
    await fetch(`/api/expertos-sesiones/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_date: dateStr, status: "Programada" }),
    });
    refetchSesiones();
  }

  if (!sesiones) {
    return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p></main>;
  }

  const today = new Date();
  const days = buildCalendarGrid(viewMonth);
  const monthLabel = viewMonth.toLocaleDateString("es-CO", { month: "long", year: "numeric" });

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
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Expertos en el Negocio · Calendario</span>
      </header>

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px 80px" }}>
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 700, background: "#F5F3FF", color: "#7C3AED", padding: "3px 9px", borderRadius: 20 }}>
            EXP-001
          </span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", margin: "8px 0 6px" }}>
            Expertos en el Negocio · Calendario de capacitaciones
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 680 }}>
            Programación mes a mes de las sesiones para volvernos expertos en el negocio Dropi:
            <strong> capacitarnos</strong> semana a semana y <strong>documentar</strong> lo aprendido para
            construir el cerebro de negocio-producto.
          </p>
        </div>

        {usingFallback && (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: "10px 14px", marginBottom: 20, fontSize: 12.5, color: "#B45309" }}>
            👀 Vista previa con el backlog de ejemplo — falta conectar la tabla en Supabase para que sea
            interactiva (agendar, editar y agregar capacitaciones).
          </div>
        )}

        {/* Controles del calendario */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
          <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() - 1, 1))} style={{ border: "1px solid var(--border)", background: "#fff", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>‹</button>
          <button onClick={() => setViewMonth(new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 1))} style={{ border: "1px solid var(--border)", background: "#fff", borderRadius: 8, width: 30, height: 30, cursor: "pointer", fontSize: 14 }}>›</button>
          <button onClick={() => setViewMonth(new Date(today.getFullYear(), today.getMonth(), 1))} style={{ border: "1px solid var(--border)", background: "#fff", borderRadius: 8, padding: "0 12px", height: 30, cursor: "pointer", fontSize: 12.5, fontWeight: 600, color: "var(--fg)" }}>Hoy</button>
          <span style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", textTransform: "capitalize", marginLeft: 4 }}>{monthLabel}</span>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => openCreate()}
            disabled={!canEdit}
            title={!me?.user ? "Inicia sesión para agregar capacitaciones" : undefined}
            style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "9px 16px", cursor: canEdit ? "pointer" : "not-allowed", opacity: canEdit ? 1 : 0.5 }}
          >
            + Nueva capacitación
          </button>
        </div>

        {!me?.user && !usingFallback && (
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
            <a href="/login" style={{ color: "var(--dropi)", fontWeight: 700, textDecoration: "none" }}>Inicia sesión</a> para agendar o editar capacitaciones.
          </p>
        )}

        {/* Grid del calendario */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 32 }}>
          {WEEKDAYS.map((w) => (
            <div key={w} style={{ background: "#F8FAFC", padding: "8px 6px", fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textAlign: "center", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              {w}
            </div>
          ))}
          {days.map((d) => {
            const key = dateKey(d);
            const daySessions = byDate[key] ?? [];
            const inMonth = d.getMonth() === viewMonth.getMonth();
            const isToday = isSameDay(d, today);
            const isDragOver = dragOverKey === key;
            return (
              <div
                key={key}
                onClick={() => openCreate(key)}
                onDragOver={(e) => { if (canEdit) { e.preventDefault(); setDragOverKey(key); } }}
                onDragLeave={() => setDragOverKey((k) => (k === key ? null : k))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOverKey(null);
                  if (!canEdit) return;
                  const sessionId = e.dataTransfer.getData("text/plain");
                  if (sessionId) scheduleViaDrop(sessionId, key);
                }}
                style={{
                  minHeight: 92, background: isDragOver ? "#F0F9FF" : "#fff", padding: 6, opacity: inMonth ? 1 : 0.4,
                  cursor: canEdit ? "pointer" : "default", display: "flex", flexDirection: "column", gap: 3,
                  outline: isDragOver ? "2px dashed var(--dropi)" : "none", outlineOffset: -2,
                }}
              >
                <span style={{
                  alignSelf: "flex-end", fontSize: 11, fontWeight: isToday ? 800 : 600,
                  color: isToday ? "#fff" : "var(--fg)", background: isToday ? "var(--dropi)" : "transparent",
                  width: 20, height: 20, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {d.getDate()}
                </span>
                {daySessions.slice(0, 3).map((s) => (
                  <div
                    key={s.id}
                    onClick={(e) => { e.stopPropagation(); openEdit(s); }}
                    style={{
                      fontSize: 10.5, fontWeight: 700, color: "#fff",
                      background: TRACK_COLOR[s.track ?? "Otro"] ?? "#64748B",
                      borderRadius: 6, padding: "2px 6px", whiteSpace: "nowrap",
                      overflow: "hidden", textOverflow: "ellipsis", cursor: canEdit ? "pointer" : "default",
                    }}
                    title={`${s.title}${s.duration ? " · " + s.duration : ""}`}
                  >
                    {s.title}
                  </div>
                ))}
                {daySessions.length > 3 && (
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700 }}>+{daySessions.length - 3} más</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Backlog sin programar */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>🗂️ Sin programar</h2>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 12 }}>
            Temas ya definidos, pendientes de una fecha. {canEdit ? "Arrastra uno hacia un día del calendario para agendarlo, o haz clic para editarlo." : "Haz clic para ver el detalle."}
          </p>
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            {backlog.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)", padding: 16 }}>No hay temas sin programar.</p>
            )}
            {backlog.map((s, idx) => (
              <div
                key={s.id}
                onClick={() => openEdit(s)}
                draggable={canEdit}
                onDragStart={(e) => { e.dataTransfer.setData("text/plain", s.id); e.dataTransfer.effectAllowed = "move"; }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                  borderTop: idx === 0 ? "none" : "1px solid #F3F4F6", cursor: canEdit ? "grab" : "default",
                }}
              >
                {canEdit && <span style={{ color: "var(--muted)", fontSize: 13, cursor: "grab" }}>⠿</span>}
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: TRACK_COLOR[s.track ?? "Otro"] ?? "#64748B", flexShrink: 0 }} />
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", flex: 1 }}>{s.title}</span>
                {s.duration && <span style={{ fontSize: 12, color: "var(--muted)" }}>⏱ {s.duration}</span>}
                {s.facilitator && <span style={{ fontSize: 12, color: "var(--muted)" }}>🎤 {s.facilitator}</span>}
                <span style={{ fontSize: 11, fontWeight: 700, background: STATUS_META[s.status].bg, color: STATUS_META[s.status].fg, padding: "2px 8px", borderRadius: 20 }}>
                  {s.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {modalMode && form && (
        <SessionModal
          mode={modalMode}
          form={form}
          onChange={setForm}
          onCancel={closeModal}
          onSave={saveForm}
          saving={saving}
          error={formError}
          extra={modalExtra}
        />
      )}
    </main>
  );
}
