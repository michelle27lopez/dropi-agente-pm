"use client";

import { useEffect, useMemo, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";

type Status = "Backlog" | "Programada" | "Hecha" | "Documentada";
type Source = "Programa" | "Comunidad";
type Resource = { label: string; url: string };
type Compromiso = { item: string; responsable: string; hecho: boolean };
type Faq = { pregunta: string; respuesta: string };

type Sesion = {
  id: string;
  title: string;
  facilitator: string | null;
  track: string | null;
  description: string | null;
  session_date: string | null;
  duration: string | null;
  meeting_url: string | null;
  status: Status;
  resources: Resource[];
  compromisos: Compromiso[];
  faq: Faq[];
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
  meeting_url: string;
  status: Status;
  resources: Resource[];
  compromisos: Compromiso[];
  faq: Faq[];
  notes: string;
};

const DURATION_PRESETS = ["30 min", "1 hora", "1.5 horas", "2 horas"];

// Reportes de cierre/avance del proyecto — agregar uno nuevo aquí cada vez que se genere.
const PROJECT_REPORTS: { label: string; date: string; url: string }[] = [
  {
    label: "Reporte para María — de Business Expert a MBA",
    date: "30 jul 2026",
    url: "https://claude.ai/code/artifact/298262bd-dd43-4904-92e3-ece785863f01",
  },
];

const TRACKS = ["Célula", "E-commerce", "Chatea Pro", "Shopi", "Estados", "ROAX", "ATOM", "Fennix", "MBA", "Otro"];

const TRACK_COLOR: Record<string, string> = {
  "Célula": "#7C3AED",
  "E-commerce": "#F77F00",
  "Chatea Pro": "#0EA5E9",
  "Shopi": "#059669",
  "Estados": "#DB2777",
  "ROAX": "#DC2626",
  "ATOM": "#4F46E5",
  "Fennix": "#B45309",
  "MBA": "#0D9488",
  "Otro": "#64748B",
};

// Malla curricular del "Dropi Product Leadership MBA" (6 meses, 24 viernes).
const MBA_MODULES: { mes: number; modulo: string; semanas: { topic: string; invitado: string; parrafo: string; entregable: string }[] }[] = [
  {
    mes: 1, modulo: "Mentalidad de Product Leadership",
    semanas: [
      { topic: "La felicidad como habilidad de alto rendimiento", invitado: "Profesor invitado / psicólogo organizacional", parrafo: "Bienestar, energía, propósito y relaciones como condiciones para decidir mejor y liderar de forma sostenible.", entregable: "Plan personal de energía y liderazgo." },
      { topic: "Modelos mentales y primeros principios", invitado: "Founder / Product Leader", parrafo: "Separar hechos de supuestos, desmontar problemas y reconstruir soluciones desde restricciones reales.", entregable: "Mapa de supuestos de un reto real." },
      { topic: "Pensamiento sistémico y efectos de segundo orden", invitado: "Especialista en sistemas", parrafo: "Loops, demoras, dependencias y consecuencias no intencionales dentro de un marketplace.", entregable: "Diagrama causal de una métrica Dropi." },
      { topic: "Influencia, ownership y decisiones difíciles", invitado: "Coach ejecutivo / Head of Product", parrafo: "Cómo liderar sin autoridad formal, asumir outcomes y sostener trade-offs.", entregable: "Filosofía personal de liderazgo." },
    ],
  },
  {
    mes: 2, modulo: "Discovery y Experimentación",
    semanas: [
      { topic: "Lean Startup y velocidad de aprendizaje", invitado: "Experto en Lean Startup", parrafo: "Build–Measure–Learn, hipótesis de valor y crecimiento, MVP y aprendizaje validado.", entregable: "Canvas de experimento." },
      { topic: "Research y Jobs To Be Done", invitado: "UX Researcher", parrafo: "Entrevistas sin sesgo, progreso buscado, circunstancias y alternativas actuales.", entregable: "Job map y hallazgos cualitativos." },
      { topic: "Opportunity Solution Tree y priorización", invitado: "Product Coach", parrafo: "Conectar outcome, oportunidades, soluciones y experimentos con evidencia.", entregable: "Árbol de oportunidades." },
      { topic: "Diseño de experimentos y MVPs", invitado: "Growth PM", parrafo: "Variables, población, criterio de éxito, guardrails, concierge, fake door y prototipos.", entregable: "Backlog de hipótesis con pruebas diseñadas." },
    ],
  },
  {
    mes: 3, modulo: "Data, Métricas y Causalidad",
    semanas: [
      { topic: "North Star Metric e input metrics", invitado: "Head of Analytics", parrafo: "Definir una métrica de valor y los indicadores de entrada que predicen su movimiento.", entregable: "Árbol de métricas por célula." },
      { topic: "Leading indicators, funnels y cohorts", invitado: "Product Analyst", parrafo: "Activación, retención, conversión, tiempo al valor y lectura por cohortes.", entregable: "Análisis de una cohorte real." },
      { topic: "Estadística, A/B testing y causalidad", invitado: "Data Scientist", parrafo: "Intervalos de confianza, tamaño de muestra, control, tratamiento, correlación y contrafactual.", entregable: "Diseño de prueba y criterio de decisión." },
      { topic: "Storytelling con datos", invitado: "BI Lead / CFO", parrafo: "Transformar dashboards en narrativa ejecutiva: contexto, insight, decisión y riesgo.", entregable: "Presentación ejecutiva de cinco minutos." },
    ],
  },
  {
    mes: 4, modulo: "Estrategia y Portafolio",
    semanas: [
      { topic: "Buena estrategia y OKRs", invitado: "VP Product / Estratega", parrafo: "Diagnóstico, política guía, acciones coherentes y conexión con outcomes.", entregable: "One-page strategy." },
      { topic: "Portfolio Thinking y trade-offs", invitado: "CPO / Portfolio Manager", parrafo: "Core, growth bets, exploración, horizonte, apetito y costo de oportunidad.", entregable: "Mapa de portafolio." },
      { topic: "Wardley Maps y posicionamiento", invitado: "Estratega de negocio", parrafo: "Evolución de capacidades, dependencia, commoditización y decisiones build–buy–partner.", entregable: "Mapa estratégico." },
      { topic: "Opportunity Review Board", invitado: "CEO / CFO / CTO", parrafo: "Defensa de prioridades ante comité ejecutivo con evidencia, riesgos y renuncias claras.", entregable: "Portafolio priorizado y decisiones explícitas." },
    ],
  },
  {
    mes: 5, modulo: "Tecnología para PMs",
    semanas: [
      { topic: "Arquitectura de software para dummies", invitado: "Arquitecto de Software", parrafo: "Capas, componentes, servicios, dependencias, deuda técnica, disponibilidad y escalabilidad.", entregable: "Diagrama de arquitectura simplificado." },
      { topic: "APIs, eventos, datos y microservicios", invitado: "Backend Lead", parrafo: "Request/response, webhooks, colas, contratos, bases de datos y consistencia.", entregable: "Diseño conceptual de integración." },
      { topic: "Cloud, seguridad y observabilidad", invitado: "DevOps / Security Lead", parrafo: "Infraestructura, costos, privacidad, accesos, fraude, logging y monitoreo.", entregable: "Checklist de riesgos técnicos." },
      { topic: "IA, agentes y vibe coding responsable", invitado: "AI Engineer / CTO", parrafo: "Prototipado rápido, límites entre demo y producción, evaluación y guardrails.", entregable: "Prototipo funcional con nota técnica." },
    ],
  },
  {
    mes: 6, modulo: "Growth, Ejecución y Adopción",
    semanas: [
      { topic: "Growth loops y economía del marketplace", invitado: "Growth Director / Marketplace Expert", parrafo: "Loops, liquidez, oferta, demanda, efectos de red, concentración y crecimiento compuesto.", entregable: "Mapa de growth loop." },
      { topic: "Unit economics, pricing y monetización", invitado: "CFO / Pricing Expert", parrafo: "CAC, LTV, margen de contribución, payback, packaging y disposición a pagar.", entregable: "Modelo de unit economics." },
      { topic: "Go-to-Market, adopción y change management", invitado: "Product Marketing / Customer Success", parrafo: "Beta, rollout, comunicación, enablement, activación, retención y guardrails.", entregable: "Plan de lanzamiento y adopción." },
      { topic: "Demo Day y Capstone", invitado: "Comité ejecutivo", parrafo: "Defensa de una iniciativa real con problema, evidencia, experimento, arquitectura, impacto y roadmap.", entregable: "Investment memo + demo final." },
    ],
  },
];

const MBA_SESSIONS = MBA_MODULES.flatMap((mod) =>
  mod.semanas.map((s, i) => {
    const semana = (mod.mes - 1) * 4 + i + 1;
    return {
      title: `Semana ${semana} · ${s.topic}`,
      track: "MBA",
      facilitator: s.invitado,
      description: `🎓 Dropi Product Leadership MBA — Mes ${mod.mes}: ${mod.modulo}. ${s.parrafo} Entregable: ${s.entregable}`,
      sort_order: 100 + semana,
    };
  })
);

const STATUS_META: Record<Status, { bg: string; fg: string }> = {
  Backlog: { bg: "#F3F4F6", fg: "#6B7280" },
  Programada: { bg: "#DBEAFE", fg: "#1D4ED8" },
  Hecha: { bg: "#DCFCE7", fg: "#15803D" },
  Documentada: { bg: "#F5F3FF", fg: "#7C3AED" },
};

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

// Vista previa mientras no exista la tabla `expertos_sessions` en Supabase (migración 023).
// En cuanto la migración corra, el fetch real trae filas y esto deja de usarse.
const FALLBACK_SESIONES: Sesion[] = ([
  { title: "Intensivo células", track: "Célula", facilitator: null, sort_order: 1, description: null },
  { title: "Capacitación de e-commerce", track: "E-commerce", facilitator: "María Ossa", sort_order: 2, description: null },
  { title: "Chatea Pro: socialicemos el modelo de chateo y las posibilidades", track: "Chatea Pro", facilitator: null, sort_order: 3, description: null },
  { title: "Conozcamos Shopi", track: "Shopi", facilitator: null, sort_order: 4, description: null },
  { title: "Estados a profundidad", track: "Estados", facilitator: null, sort_order: 5, description: null },
  { title: "Conozcamos ROAX", track: "ROAX", facilitator: null, sort_order: 6, description: null },
  { title: "Conozcamos ATOM", track: "ATOM", facilitator: null, sort_order: 7, description: null },
  { title: "Conozcamos Fennix", track: "Fennix", facilitator: null, sort_order: 8, description: null },
  ...MBA_SESSIONS,
] as { title: string; track: string; facilitator: string | null; sort_order: number; description: string | null }[]).map((s, i) => ({
  id: `fallback-${i + 1}`,
  title: s.title,
  facilitator: s.facilitator,
  track: s.track,
  description: s.description,
  session_date: null,
  duration: null,
  meeting_url: null,
  status: "Backlog" as Status,
  resources: [],
  compromisos: [],
  faq: [],
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
    meeting_url: "",
    status: dateKeyStr ? "Programada" : "Backlog",
    resources: [],
    compromisos: [],
    faq: [],
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
    meeting_url: s.meeting_url ?? "",
    status: s.status,
    resources: s.resources ?? [],
    compromisos: s.compromisos ?? [],
    faq: s.faq ?? [],
    notes: s.notes ?? "",
  };
}

function SessionModal({
  mode, form, onChange, onCancel, onSave, saving, error, extra, onDelete,
}: {
  mode: "create" | "edit";
  form: FormState;
  onChange: (f: FormState) => void;
  onCancel: () => void;
  onSave: () => void;
  saving: boolean;
  error: string | null;
  extra?: { proposedBy: string | null; createdAt: string } | null;
  onDelete?: () => void;
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

  function updateCompromiso(i: number, field: keyof Compromiso, value: string | boolean) {
    const next = form.compromisos.slice();
    next[i] = { ...next[i], [field]: value };
    onChange({ ...form, compromisos: next });
  }
  function addCompromiso() {
    onChange({ ...form, compromisos: [...form.compromisos, { item: "", responsable: "", hecho: false }] });
  }
  function removeCompromiso(i: number) {
    onChange({ ...form, compromisos: form.compromisos.filter((_, idx) => idx !== i) });
  }

  function updateFaq(i: number, field: keyof Faq, value: string) {
    const next = form.faq.slice();
    next[i] = { ...next[i], [field]: value };
    onChange({ ...form, faq: next });
  }
  function addFaq() {
    onChange({ ...form, faq: [...form.faq, { pregunta: "", respuesta: "" }] });
  }
  function removeFaq(i: number) {
    onChange({ ...form, faq: form.faq.filter((_, idx) => idx !== i) });
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

          <div>
            <label style={labelStyle()}>Link de reunión (Meet / Zoom)</label>
            <input type="url" placeholder="https://meet.google.com/…" value={form.meeting_url} onChange={(e) => onChange({ ...form, meeting_url: e.target.value })} style={inputStyle()} />
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
            <label style={labelStyle()}>Compromisos y pendientes</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.compromisos.map((c, i) => (
                <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <input
                    type="checkbox" checked={c.hecho}
                    onChange={(e) => updateCompromiso(i, "hecho", e.target.checked)}
                    style={{ width: 16, height: 16, flexShrink: 0 }}
                  />
                  <input type="text" placeholder="Compromiso o pendiente" value={c.item} onChange={(e) => updateCompromiso(i, "item", e.target.value)} style={{ ...inputStyle(), flex: 1, textDecoration: c.hecho ? "line-through" : "none", color: c.hecho ? "var(--muted)" : "var(--fg)" }} />
                  <input type="text" placeholder="Responsable" value={c.responsable} onChange={(e) => updateCompromiso(i, "responsable", e.target.value)} style={{ ...inputStyle(), flex: "0 0 30%" }} />
                  <button type="button" onClick={() => removeCompromiso(i)} style={{ border: "1px solid var(--border)", background: "#fff", borderRadius: 8, width: 32, flexShrink: 0, cursor: "pointer", color: "var(--muted)" }}>×</button>
                </div>
              ))}
              <button type="button" onClick={addCompromiso} style={{ alignSelf: "flex-start", fontSize: 12, fontWeight: 700, color: "var(--dropi)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                + Agregar compromiso
              </button>
            </div>
          </div>

          <div>
            <label style={labelStyle()}>Biblia de dudas resueltas</label>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {form.faq.map((f, i) => (
                <div key={i} style={{ display: "flex", gap: 6 }}>
                  <input type="text" placeholder="Pregunta" value={f.pregunta} onChange={(e) => updateFaq(i, "pregunta", e.target.value)} style={{ ...inputStyle(), flex: 1 }} />
                  <input type="text" placeholder="Respuesta" value={f.respuesta} onChange={(e) => updateFaq(i, "respuesta", e.target.value)} style={{ ...inputStyle(), flex: 1 }} />
                  <button type="button" onClick={() => removeFaq(i)} style={{ border: "1px solid var(--border)", background: "#fff", borderRadius: 8, width: 32, flexShrink: 0, cursor: "pointer", color: "var(--muted)" }}>×</button>
                </div>
              ))}
              <button type="button" onClick={addFaq} style={{ alignSelf: "flex-start", fontSize: 12, fontWeight: 700, color: "var(--dropi)", background: "none", border: "none", cursor: "pointer", padding: "4px 0" }}>
                + Agregar pregunta resuelta
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

          <div style={{ display: "flex", gap: 8, justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
            {mode === "edit" && onDelete ? (
              <button onClick={onDelete} style={{ fontSize: 12.5, fontWeight: 700, color: "#B91C1C", background: "none", border: "1px solid #FCA5A5", borderRadius: 8, padding: "9px 16px", cursor: "pointer" }}>
                Eliminar
              </button>
            ) : <span />}
            <div style={{ display: "flex", gap: 8 }}>
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
    </div>
  );
}

function SessionViewCard({ sesion, canEdit, onClose, onEdit }: { sesion: Sesion; canEdit: boolean; onClose: () => void; onEdit: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 16 }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ background: "#fff", borderRadius: 16, width: "min(480px, 100%)", maxHeight: "88vh", overflowY: "auto", padding: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
          <span style={{
            fontSize: 10.5, fontWeight: 700, color: TRACK_COLOR[sesion.track ?? "Otro"] ?? "#64748B",
            background: `${TRACK_COLOR[sesion.track ?? "Otro"] ?? "#64748B"}1A`, padding: "2px 8px", borderRadius: 20,
          }}>
            {sesion.track ?? "Otro"}
          </span>
          <span style={{ fontSize: 11, fontWeight: 700, background: STATUS_META[sesion.status].bg, color: STATUS_META[sesion.status].fg, padding: "3px 9px", borderRadius: 20 }}>
            {sesion.status}
          </span>
        </div>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: "var(--fg)", marginBottom: 12, lineHeight: 1.35 }}>
          {sesion.title}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, fontSize: 13, color: "var(--fg)" }}>
          {sesion.session_date && (
            <div>📅 {new Date(sesion.session_date + "T00:00:00").toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" })}{sesion.duration ? ` · ⏱ ${sesion.duration}` : ""}</div>
          )}
          {sesion.facilitator && <div>🎤 {sesion.facilitator}</div>}
          {sesion.meeting_url && (
            <a
              href={sesion.meeting_url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start",
                fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--dropi)",
                borderRadius: 8, padding: "7px 14px", textDecoration: "none",
              }}
            >
              🔗 Unirse a la reunión
            </a>
          )}
          {sesion.description && (
            <div style={{ color: "var(--muted)", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>{sesion.description}</div>
          )}
          {(sesion.resources ?? []).length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {sesion.resources.map((r, i) => (
                <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--dropi)", fontWeight: 600, textDecoration: "none" }}>
                  🔗 {r.label || r.url}
                </a>
              ))}
            </div>
          )}
          {(sesion.compromisos ?? []).length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                Compromisos y pendientes
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {sesion.compromisos.map((c, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13 }}>
                    <span>{c.hecho ? "✅" : "⬜️"}</span>
                    <span style={{ flex: 1, textDecoration: c.hecho ? "line-through" : "none", color: c.hecho ? "var(--muted)" : "var(--fg)" }}>
                      {c.item}{c.responsable ? ` — ${c.responsable}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {(sesion.faq ?? []).length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 6 }}>
                Biblia de dudas resueltas
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {sesion.faq.map((f, i) => (
                  <div key={i} style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                    <div style={{ fontWeight: 700, color: "var(--fg)" }}>❓ {f.pregunta}</div>
                    <div style={{ color: "var(--muted)" }}>{f.respuesta}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {sesion.notes && (
            <div style={{ fontSize: 12.5, color: "var(--fg)", background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", lineHeight: 1.5 }}>
              🧠 {sesion.notes}
            </div>
          )}
          {sesion.proposed_by && (
            <div style={{ fontSize: 11.5, color: "var(--muted)" }}>Agregada por {sesion.proposed_by}</div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 20 }}>
          <button onClick={onClose} style={{ fontSize: 12.5, fontWeight: 600, color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 16px", cursor: "pointer" }}>
            Cerrar
          </button>
          {canEdit && (
            <button onClick={onEdit} style={{ fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer" }}>
              ✎ Editar
            </button>
          )}
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
  const [viewingSession, setViewingSession] = useState<Sesion | null>(null);

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

  function openView(s: Sesion) {
    setViewingSession(s);
  }

  function editFromView() {
    if (!viewingSession) return;
    const s = viewingSession;
    setViewingSession(null);
    openEdit(s);
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
      meeting_url: form.meeting_url.trim() || null,
      status: form.status,
      resources: form.resources.filter((r) => r.label.trim() || r.url.trim()),
      compromisos: form.compromisos.filter((c) => c.item.trim()),
      faq: form.faq.filter((f) => f.pregunta.trim() || f.respuesta.trim()),
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

  async function deleteForm() {
    if (!form?.id) return;
    if (!window.confirm(`¿Eliminar "${form.title}"? Esta acción no se puede deshacer.`)) return;
    setSaving(true);
    const res = await fetch(`/api/expertos-sesiones/${form.id}`, { method: "DELETE" });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setFormError(body.error || "No se pudo eliminar.");
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
      <header style={{ background: "#fff", padding: "16px 0" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb
            items={[
              { label: "Proyectos", href: "/proyectos" },
              { label: "Expertos en el Negocio · Calendario" },
            ]}
          />
        </div>
      </header>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>
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
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
            {PROJECT_REPORTS.map((r) => (
              <a
                key={r.url}
                href={r.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600,
                  color: "var(--dropi)", background: "#F5F3FF", border: "1px solid #E9D5FF",
                  borderRadius: 20, padding: "5px 12px", textDecoration: "none",
                }}
              >
                📄 {r.label} <span style={{ color: "var(--muted)", fontWeight: 500 }}>· {r.date}</span>
              </a>
            ))}
          </div>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: 14, background: "linear-gradient(90deg,#F0FDFA,#fff)",
          border: "1px solid #99F6E4", borderRadius: 14, padding: "14px 18px", marginBottom: 20,
        }}>
          <span style={{ fontSize: 24 }}>🎓</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#0D9488" }}>Dropi Product Leadership MBA</div>
            <div style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
              Programa interno de 6 meses / 24 viernes para formar PMs con criterio de decisión, liderazgo y ejecución — sus 24 talleres ya están en la cola "Sin programar", categoría <strong>MBA</strong>.
            </div>
          </div>
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
                  minHeight: 118, background: isDragOver ? "#F0F9FF" : "#fff", padding: 6, opacity: inMonth ? 1 : 0.4,
                  cursor: canEdit ? "pointer" : "default", display: "flex", flexDirection: "column", gap: 4,
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
                {daySessions.slice(0, 2).map((s) => {
                  const meta = [s.facilitator ? `🎤 ${s.facilitator}` : null, s.duration ? `⏱ ${s.duration}` : null].filter(Boolean).join(" · ");
                  return (
                    <div
                      key={s.id}
                      onClick={(e) => { e.stopPropagation(); openView(s); }}
                      style={{
                        color: "#fff", background: TRACK_COLOR[s.track ?? "Otro"] ?? "#64748B",
                        borderRadius: 6, padding: "3px 6px", cursor: "pointer", lineHeight: 1.25,
                      }}
                      title={`${s.title}${meta ? " · " + meta : ""}`}
                    >
                      <div style={{ fontSize: 10.5, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {s.title}
                      </div>
                      {meta && (
                        <div style={{ fontSize: 9, fontWeight: 600, color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {meta}
                        </div>
                      )}
                    </div>
                  );
                })}
                {daySessions.length > 2 && (
                  <div style={{ fontSize: 10, color: "var(--muted)", fontWeight: 700 }}>+{daySessions.length - 2} más</div>
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
                onClick={() => openView(s)}
                draggable={canEdit}
                onDragStart={(e) => { e.dataTransfer.setData("text/plain", s.id); e.dataTransfer.effectAllowed = "move"; }}
                style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "12px 16px",
                  borderTop: idx === 0 ? "none" : "1px solid #F3F4F6", cursor: "pointer",
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
          onDelete={modalMode === "edit" ? deleteForm : undefined}
        />
      )}

      {viewingSession && !modalMode && (
        <SessionViewCard
          sesion={viewingSession}
          canEdit={canEdit}
          onClose={() => setViewingSession(null)}
          onEdit={editFromView}
        />
      )}
    </main>
  );
}
