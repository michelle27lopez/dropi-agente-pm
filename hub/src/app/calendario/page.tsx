"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PROJECT_STYLE } from "@/lib/curated-projects";

type EventType = "lanzamiento" | "handoff" | "otro";

type CalendarEvent = {
  id: string;
  title: string;
  event_type: EventType;
  event_date: string; // YYYY-MM-DD
  project_code: string | null;
  project_name: string | null;
  notes: string | null;
};

const TYPE_META: Record<EventType, { label: string; color: string; icon: string }> = {
  lanzamiento: { label: "Lanzamiento", color: "#F77F00", icon: "🚀" },
  handoff: { label: "Handoff", color: "#0891B2", icon: "🤝" },
  otro: { label: "Otro", color: "#6B7280", icon: "📌" },
};

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

const DIAS = ["L", "M", "X", "J", "V", "S", "D"];

function toISODate(d: Date) {
  return new Intl.DateTimeFormat("en-CA").format(d);
}

function buildMonthGrid(year: number, month: number) {
  const first = new Date(year, month, 1);
  // 0=domingo → lo convertimos a lunes-primero
  const firstWeekday = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export default function CalendarioPage() {
  const router = useRouter();
  const today = useMemo(() => new Date(), []);
  const [cursor, setCursor] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    event_type: "lanzamiento" as EventType,
    event_date: toISODate(today),
    project_code: "",
    notes: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/calendario");
    if (res.status === 401) {
      router.push("/login");
      return;
    }
    const data = await res.json();
    setEvents(Array.isArray(data) ? data : []);
    setLoading(false);
  }

  const eventsByDate = useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    for (const e of events) {
      (map[e.event_date] ??= []).push(e);
    }
    return map;
  }, [events]);

  const proximosEventos = useMemo(() => {
    const todayISO = toISODate(today);
    return events
      .filter((e) => e.event_date >= todayISO)
      .sort((a, b) => a.event_date.localeCompare(b.event_date))
      .slice(0, 8);
  }, [events, today]);

  const cells = buildMonthGrid(cursor.getFullYear(), cursor.getMonth());
  const todayISO = toISODate(today);

  function openFormFor(dateISO?: string) {
    setForm((f) => ({ ...f, event_date: dateISO ?? f.event_date }));
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const proyecto = form.project_code ? PROJECT_STYLE[form.project_code] : null;
    const res = await fetch("/api/calendario", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title.trim(),
        event_type: form.event_type,
        event_date: form.event_date,
        project_code: form.project_code || null,
        project_name: form.project_code || null,
        notes: form.notes.trim() || null,
      }),
    });
    if (res.ok) {
      const created = await res.json();
      setEvents((prev) => [...prev, created]);
      setForm({ title: "", event_type: "lanzamiento", event_date: form.event_date, project_code: "", notes: "" });
      setShowForm(false);
    }
    void proyecto;
  }

  async function handleDelete(id: string) {
    if (!confirm("¿Eliminar este evento del calendario?")) return;
    const res = await fetch(`/api/calendario/${id}`, { method: "DELETE" });
    if (res.ok) setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      <header style={{
        background: "var(--card)",
        padding: "20px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
      }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>Calendario</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
            Hitos importantes de los proyectos: lanzamientos, handoffs y más.
          </p>
        </div>
        <button
          onClick={() => openFormFor()}
          style={{
            fontSize: 13, fontWeight: 700, color: "#fff", background: "#F49A3D",
            border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer", whiteSpace: "nowrap",
          }}
        >
          + Nuevo evento
        </button>
      </header>

      <div className="gnav-page" style={{ flex: 1, display: "flex", gap: 24, flexWrap: "wrap" }}>
        {/* Calendario mensual */}
        <section style={{ flex: "2 1 560px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
              style={{ border: "1px solid var(--border)", background: "var(--bg)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "var(--fg)" }}
            >‹</button>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>
              {MESES[cursor.getMonth()]} {cursor.getFullYear()}
            </h2>
            <button
              onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
              style={{ border: "1px solid var(--border)", background: "var(--bg)", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "var(--fg)" }}
            >›</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 6 }}>
            {DIAS.map((d) => (
              <div key={d} style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textAlign: "center", padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 }}>
            {cells.map((date, i) => {
              if (!date) return <div key={i} />;
              const iso = toISODate(date);
              const dayEvents = eventsByDate[iso] ?? [];
              const isToday = iso === todayISO;
              const isSelected = iso === selectedDate;
              return (
                <button
                  key={iso}
                  onClick={() => setSelectedDate(isSelected ? null : iso)}
                  style={{
                    minHeight: 64, borderRadius: 10, padding: 6, textAlign: "left",
                    border: isSelected ? "2px solid #F49A3D" : "1px solid var(--border)",
                    background: isToday ? "var(--dropi-light)" : "var(--bg)",
                    cursor: "pointer", display: "flex", flexDirection: "column", gap: 4,
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: isToday ? 800 : 600, color: "var(--fg)" }}>{date.getDate()}</span>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        title={e.title}
                        style={{ width: 6, height: 6, borderRadius: "50%", background: TYPE_META[e.event_type]?.color ?? "#6B7280" }}
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          {selectedDate && (
            <div style={{ marginTop: 16, borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{selectedDate}</h3>
                <button
                  onClick={() => openFormFor(selectedDate)}
                  style={{ fontSize: 12, fontWeight: 600, color: "#F49A3D", background: "transparent", border: "none", cursor: "pointer" }}
                >
                  + agregar aquí
                </button>
              </div>
              {(eventsByDate[selectedDate] ?? []).length === 0 ? (
                <p style={{ fontSize: 12, color: "var(--muted)" }}>Sin eventos este día.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {(eventsByDate[selectedDate] ?? []).map((e) => (
                    <EventRow key={e.id} event={e} onDelete={() => handleDelete(e.id)} />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* Próximos eventos */}
        <section style={{ flex: "1 1 280px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>Próximos</h3>
          {loading ? (
            <p style={{ fontSize: 12, color: "var(--muted)" }}>Cargando…</p>
          ) : proximosEventos.length === 0 ? (
            <p style={{ fontSize: 12, color: "var(--muted)" }}>No hay eventos próximos registrados.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {proximosEventos.map((e) => (
                <EventRow key={e.id} event={e} onDelete={() => handleDelete(e.id)} showDate />
              ))}
            </div>
          )}
        </section>
      </div>

      {showForm && (
        <div
          onClick={() => setShowForm(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50,
          }}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{
              background: "var(--card)", borderRadius: 14, padding: 24, width: 360,
              display: "flex", flexDirection: "column", gap: 12,
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>Nuevo evento</h3>

            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
              Título
              <input
                autoFocus
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Ej. Lanzamiento Descuentos Fase 1"
                style={{ width: "100%", marginTop: 4, fontSize: 13, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8 }}
              />
            </label>

            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
              Tipo
              <select
                value={form.event_type}
                onChange={(e) => setForm((f) => ({ ...f, event_type: e.target.value as EventType }))}
                style={{ width: "100%", marginTop: 4, fontSize: 13, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, background: "#fff" }}
              >
                {Object.entries(TYPE_META).map(([key, meta]) => (
                  <option key={key} value={key}>{meta.icon} {meta.label}</option>
                ))}
              </select>
            </label>

            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
              Fecha
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm((f) => ({ ...f, event_date: e.target.value }))}
                style={{ width: "100%", marginTop: 4, fontSize: 13, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8 }}
              />
            </label>

            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
              Proyecto (opcional)
              <select
                value={form.project_code}
                onChange={(e) => setForm((f) => ({ ...f, project_code: e.target.value }))}
                style={{ width: "100%", marginTop: 4, fontSize: 13, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, background: "#fff" }}
              >
                <option value="">Sin proyecto asociado</option>
                {Object.keys(PROJECT_STYLE).map((code) => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
            </label>

            <label style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>
              Notas (opcional)
              <textarea
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                rows={2}
                style={{ width: "100%", marginTop: 4, fontSize: 13, padding: "8px 10px", border: "1px solid var(--border)", borderRadius: 8, resize: "vertical" }}
              />
            </label>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", background: "transparent", border: "none", cursor: "pointer", padding: "8px 12px" }}
              >
                Cancelar
              </button>
              <button
                type="submit"
                style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: "#F49A3D", border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer" }}
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}

function EventRow({ event, onDelete, showDate }: { event: CalendarEvent; onDelete: () => void; showDate?: boolean }) {
  const meta = TYPE_META[event.event_type] ?? TYPE_META.otro;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 8, padding: "8px 10px",
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
    }}>
      <span style={{ fontSize: 16 }}>{meta.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>{event.title}</p>
        <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>
          {meta.label}
          {event.project_code ? ` · ${event.project_code}` : ""}
          {showDate ? ` · ${event.event_date}` : ""}
        </p>
        {event.notes && <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{event.notes}</p>}
      </div>
      <button
        onClick={onDelete}
        style={{ fontSize: 11, color: "#EF4444", background: "transparent", border: "none", cursor: "pointer" }}
      >
        ✕
      </button>
    </div>
  );
}
