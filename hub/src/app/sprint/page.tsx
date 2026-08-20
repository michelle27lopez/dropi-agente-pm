"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { isSprintAllowed } from "@/lib/sprint-access";
import Breadcrumb from "@/components/Breadcrumb";
import { PriorityBadge } from "@/components/PriorityBadge";

type SectionStatus = "pendiente" | "en_curso" | "hecho";
type Section = { name: string; status: SectionStatus; notes: string; updatedAt?: string };
type Link = { label: string; url: string };

type Task = {
  id: string;
  jira_key: string;
  jira_url: string;
  summary: string;
  jira_status: string | null;
  sprint_label: string | null;
  sections: Section[];
  links: Link[];
  last_synced_to_jira_at: string | null;
  updated_at: string;
  is_meetings_task: boolean;
  hours_estimate: number | null;
  hours_breakdown: { title: string; hours: number }[];
  priority: string | null;
};

type SprintPeriod = { start_date: string; end_date: string; holiday_dates: string[] };

const STATUS_LABEL: Record<SectionStatus, string> = {
  pendiente: "Pendiente",
  en_curso: "En curso",
  hecho: "Hecho",
};
const STATUS_COLOR: Record<SectionStatus, { fg: string; bg: string }> = {
  pendiente: { fg: "var(--muted)", bg: "#F3F4F6" },
  en_curso: { fg: "var(--info)", bg: "var(--info-tint)" },
  hecho: { fg: "var(--success)", bg: "var(--success-tint)" },
};
// hecho = 100%, en_curso = 50%, pendiente = 0% — promediado por tarea y por sprint.
const STATUS_PCT: Record<SectionStatus, number> = { pendiente: 0, en_curso: 0.5, hecho: 1 };

const cardStyle: React.CSSProperties = {
  background: "#fff", border: "1px solid var(--border)", borderRadius: 12,
  padding: 20, marginBottom: 16,
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "nunca";
  try {
    return new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return iso;
  }
}

function taskProgress(sections: Section[]): number {
  if (sections.length === 0) return 0;
  const sum = sections.reduce((acc, s) => acc + STATUS_PCT[s.status], 0);
  return Math.round((sum / sections.length) * 100);
}

function overallProgress(docTasks: Task[]): number {
  if (docTasks.length === 0) return 0;
  const sum = docTasks.reduce((acc, t) => acc + taskProgress(t.sections), 0);
  return Math.round(sum / docTasks.length);
}

function progressColor(pct: number): string {
  if (pct >= 100) return "var(--success)";
  if (pct >= 40) return "var(--info)";
  return "var(--muted)";
}

const PRIORITY_ORDER: Record<string, number> = { Highest: 0, High: 1, Medium: 2, Low: 3, Lowest: 4 };

function priorityRank(p: string | null): number {
  return p != null && p in PRIORITY_ORDER ? PRIORITY_ORDER[p] : 99;
}

function bogotaToday(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Bogota" }).format(new Date());
}

// Cuenta días hábiles (lunes a viernes, sin festivos) entre dos fechas ISO, ambas inclusive.
function countBusinessDays(startISO: string, endISO: string, holidays: string[]): number {
  if (startISO > endISO) return 0;
  const holidaySet = new Set(holidays);
  let count = 0;
  const cur = new Date(`${startISO}T00:00:00Z`);
  const end = new Date(`${endISO}T00:00:00Z`);
  while (cur <= end) {
    const day = cur.getUTCDay();
    const iso = cur.toISOString().slice(0, 10);
    if (day !== 0 && day !== 6 && !holidaySet.has(iso)) count++;
    cur.setUTCDate(cur.getUTCDate() + 1);
  }
  return count;
}

// % de días hábiles del sprint ya transcurridos hoy — sin fines de semana ni festivos en Colombia.
function expectedPace(period: SprintPeriod): { expectedPct: number; elapsed: number; total: number } {
  const today = bogotaToday();
  const total = countBusinessDays(period.start_date, period.end_date, period.holiday_dates);
  if (total === 0) return { expectedPct: 0, elapsed: 0, total: 0 };
  const elapsedEnd = today < period.start_date ? period.start_date : today > period.end_date ? period.end_date : today;
  const elapsed = today < period.start_date ? 0 : countBusinessDays(period.start_date, elapsedEnd, period.holiday_dates);
  return { expectedPct: Math.round((elapsed / total) * 100), elapsed, total };
}

// Barra rellena con transform en vez de width — evita layout thrash y anima suave.
function ProgressBar({ pct, height = 8 }: { pct: number; height?: number }) {
  return (
    <div style={{ width: "100%", height, borderRadius: 999, background: "#F3F4F6", overflow: "hidden" }}>
      <div
        className="sprint-bar-fill"
        style={{ width: "100%", height: "100%", borderRadius: 999, background: progressColor(pct), transform: `scaleX(${Math.max(pct, 0) / 100})`, transformOrigin: "left" }}
      />
    </div>
  );
}

function StatusBadge({ status }: { status: SectionStatus }) {
  const c = STATUS_COLOR[status];
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 999, padding: "3px 10px",
      fontSize: 11, fontWeight: 700, color: c.fg, background: c.bg,
    }}>
      <span
        className={status === "en_curso" ? "sprint-pulse-dot" : undefined}
        style={{ width: 7, height: 7, borderRadius: "50%", background: c.fg, display: "inline-block" }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

// Cuenta de 0 al valor final con easing — le da vida a los números del dashboard.
function useCountUp(target: number, duration = 700): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    let start: number | null = null;
    const step = (ts: number) => {
      if (start === null) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

function StatTile({ label, value, suffix = "", color, delay = 0 }: { label: string; value: number | null; suffix?: string; color?: string; delay?: number }) {
  const animated = useCountUp(value ?? 0);
  return (
    <div className="sprint-fade-in sprint-card-hover" style={{ ...cardStyle, marginBottom: 0, padding: 16, animationDelay: `${delay}ms` }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontSize: 28, fontWeight: 800, color: color ?? "var(--fg)", lineHeight: 1 }}>
        {value == null ? "—" : `${animated}${suffix}`}
      </p>
    </div>
  );
}

// Clasifica el status real de Jira en las 3 categorías del dashboard — mismo criterio que /bugs,
// para que "Hechas/En curso/Pendientes" reflejen el board de Jira, no el checklist de documentación.
function classifyJiraStatus(status: string | null): SectionStatus {
  const s = (status ?? "").toLowerCase();
  if (/(resuelt|cerrad|hecho|complet|done)/.test(s)) return "hecho";
  if (/(progreso|revisi[oó]n|curso|review|doing)/.test(s)) return "en_curso";
  return "pendiente";
}

function SprintSummary({ docTasks, meetingsTask }: { docTasks: Task[]; meetingsTask: Task | null }) {
  const overallPct = useMemo(() => overallProgress(docTasks), [docTasks]);

  const hecho = docTasks.filter((t) => classifyJiraStatus(t.jira_status) === "hecho").length;
  const enCurso = docTasks.filter((t) => classifyJiraStatus(t.jira_status) === "en_curso").length;
  const pendiente = docTasks.length - hecho - enCurso;

  return (
    <div style={{
      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12, marginBottom: 28,
    }}>
      <StatTile label="Avance del sprint" value={overallPct} suffix="%" color={progressColor(overallPct)} delay={0} />
      <StatTile label="Hechas" value={hecho} color="var(--success)" delay={40} />
      <StatTile label="En curso" value={enCurso} color="var(--info)" delay={80} />
      <StatTile label="Pendientes" value={pendiente} color="var(--muted)" delay={120} />
      <StatTile label="Reuniones generales" value={meetingsTask?.hours_estimate ?? null} suffix="h" color="var(--fg)" delay={160} />
    </div>
  );
}

function SprintPacing({ actualPct, period }: { actualPct: number; period: SprintPeriod | null }) {
  if (!period) return null;
  const { expectedPct, elapsed, total } = expectedPace(period);
  if (total === 0) return null;

  const diff = actualPct - expectedPct;
  const status =
    diff >= 0
      ? { label: "Vas al día", color: "var(--success)" }
      : diff >= -15
      ? { label: `${Math.abs(diff)} pts por debajo de lo esperado`, color: "var(--info)" }
      : { label: `${Math.abs(diff)} pts por debajo de lo esperado`, color: "var(--danger)" };
  const markerLeft = Math.min(100, Math.max(0, expectedPct));

  return (
    <div className="sprint-fade-in" style={{ ...cardStyle, marginBottom: 28, animationDelay: "120ms" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 18 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.3 }}>
          Ritmo del sprint
        </p>
        <span style={{ fontSize: 12, fontWeight: 700, color: status.color }}>{status.label}</span>
      </div>

      <div style={{ position: "relative" }}>
        <div
          style={{
            position: "absolute", left: `${markerLeft}%`, top: -18, transform: "translateX(-50%)",
            fontSize: 10, fontWeight: 700, color: "var(--fg)", whiteSpace: "nowrap",
          }}
        >
          hoy: {expectedPct}%
        </div>
        <div style={{ position: "relative", height: 10 }}>
          <ProgressBar pct={actualPct} height={10} />
          <div
            style={{
              position: "absolute", left: `${markerLeft}%`, top: -2, bottom: -2, width: 2,
              background: "var(--fg)", transform: "translateX(-1px)",
            }}
          />
        </div>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
        {elapsed} de {total} días hábiles del sprint transcurridos (sin fines de semana ni festivos en Colombia).
      </p>
    </div>
  );
}

function MeetingsCard({ task, delay = 0 }: { task: Task; delay?: number }) {
  const animatedHours = useCountUp(task.hours_estimate ?? 0);
  return (
    <div className="sprint-fade-in sprint-card-hover" style={{ ...cardStyle, marginBottom: 0, animationDelay: `${delay}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div>
          <a
            href={task.jira_url}
            target="_blank"
            rel="noreferrer"
            style={{ color: "var(--info)", fontWeight: 700, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, textDecoration: "none" }}
          >
            {task.jira_key} ↗
          </a>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", marginTop: 4 }}>🗓️ {task.summary}</p>
        </div>
        <p style={{ fontSize: 28, fontWeight: 800, color: "var(--fg)", lineHeight: 1 }}>
          {task.hours_estimate != null ? `${animatedHours}h` : "—"}
        </p>
      </div>

      <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 14, marginTop: -6 }}>
        Solo reuniones generales — el tiempo de proyecto queda como worklog en cada tarea, no acá.
      </p>

      {task.hours_breakdown.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {task.hours_breakdown.map((b) => (
            <div key={b.title} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--muted)" }}>
              <span>{b.title}</span>
              <span style={{ fontWeight: 600, color: "var(--fg)" }}>{b.hours}h</span>
            </div>
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: "var(--muted)" }}>
          Aún sin calcular — pídele a Claude que corra <code>sprint-reuniones</code>.
        </p>
      )}
    </div>
  );
}

function TaskCard({ task, delay = 0 }: { task: Task; delay?: number }) {
  const pct = taskProgress(task.sections);

  return (
    <div className="sprint-fade-in sprint-card-hover" style={{ ...cardStyle, marginBottom: 0, animationDelay: `${delay}ms` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <a
              href={task.jira_url}
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--info)", fontWeight: 700, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 13, textDecoration: "none" }}
            >
              {task.jira_key} ↗
            </a>
            <PriorityBadge priority={task.priority} />
          </div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", marginTop: 4 }}>{task.summary}</p>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          {task.jira_status && (
            <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", background: "#F3F4F6", borderRadius: 999, padding: "3px 9px" }}>
              {task.jira_status}
            </span>
          )}
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
            Sync a Jira: {formatDateTime(task.last_synced_to_jira_at)}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ flex: 1 }}><ProgressBar pct={pct} /></div>
        <span style={{ fontSize: 12, fontWeight: 700, color: progressColor(pct), minWidth: 32, textAlign: "right" }}>{pct}%</span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {task.sections.map((s) => (
          <div key={s.name} style={{ borderLeft: `2px solid ${STATUS_COLOR[s.status].fg}`, paddingLeft: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{s.name}</span>
              <StatusBadge status={s.status} />
            </div>
            {s.notes && (
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{s.notes}</p>
            )}
          </div>
        ))}
      </div>

      {task.links.length > 0 && (
        <div style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}>
          {task.links.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noreferrer"
              style={{
                fontSize: 12, color: "var(--fg)", background: "#F3F4F6", borderRadius: 999,
                padding: "4px 10px", textDecoration: "none", fontWeight: 600,
              }}
            >
              🔗 {l.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function buildSummaryText(docTasks: Task[], meetingsTask: Task | null): string {
  const today = new Date().toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  const overallPct = overallProgress(docTasks);
  const header = `Sprint activo — ${today} (${overallPct}% documentado)`;
  const lines = docTasks.map((t) => {
    const pct = taskProgress(t.sections);
    const sectionLines = t.sections
      .filter((s) => s.notes)
      .map((s) => `    - ${s.name} (${STATUS_LABEL[s.status]}): ${s.notes}`)
      .join("\n");
    return `• ${t.jira_key} — ${t.summary} (${pct}%)${sectionLines ? `\n${sectionLines}` : ""}`;
  });
  const meetings = meetingsTask?.hours_estimate != null ? `\nReuniones generales: ${meetingsTask.hours_estimate}h` : "";
  return [header, "", ...lines, meetings].join("\n");
}

const PERSON_NAME: Record<string, string> = {
  "michelle.lopez@dropi.co": "Michelle",
  "jaime.guevara@dropi.co": "Jaime",
};

function displayName(email: string): string {
  return PERSON_NAME[email] ?? email;
}

const HELP_COMMANDS: { phrase: string; result: string }[] = [
  { phrase: "\"Trae mis tareas nuevas del sprint\"", result: "Arma el checklist inicial de cada tarea a partir de su descripción en Jira." },
  { phrase: "\"Ya empecé a trabajar en PROD-XXXX\"", result: "Te pregunta una vez si la pasa a En curso en Jira." },
  { phrase: "\"En PROD-XXXX ya armé los escenarios, el hallazgo fue...\"", result: "Actualiza esa sección del checklist (estado + notas) en el dashboard." },
  { phrase: "\"Ya terminé PROD-XXXX\"", result: "Arma un resumen y, si lo confirmas, lo sube como comentario a Jira (nunca reescribe la descripción)." },
  { phrase: "\"Calcula mis reuniones del sprint\"", result: "Suma las horas reales de reuniones (sin bloques personales) y actualiza la tarea de Reuniones." },
  { phrase: "\"Copiar resumen\" (botón, arriba)", result: "Copia un texto listo para pegar en tu update o standup." },
];

function HelpModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      className="sprint-overlay-in"
      style={{
        position: "fixed", inset: 0, background: "rgba(20,18,14,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 20,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="sprint-modal-in"
        style={{
          background: "#fff", borderRadius: 14, border: "1px solid var(--border)",
          maxWidth: 560, width: "100%", maxHeight: "85vh", overflowY: "auto", padding: 28,
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>¿Cómo funciona este dashboard?</h2>
          <button
            onClick={onClose}
            style={{ border: "none", background: "none", color: "var(--muted)", fontSize: 18, cursor: "pointer", lineHeight: 1 }}
            aria-label="Cerrar"
          >
            ✕
          </button>
        </div>

        <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 18 }}>
          Esta página es de <strong>solo lectura</strong> — no hay campos para editar acá. Todo lo que ves
          (el checklist, el % de avance, las horas de reuniones) se alimenta cuando le cuentas a
          Claude qué hiciste, en <strong>cualquier chat</strong>, mencionando el ticket de Jira o el proyecto.
          Cada quien ve sus propias tareas; los PM además pueden ver el dashboard de los PD de su equipo.
        </p>

        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.3, marginBottom: 10 }}>
          Frases que puedes usar
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 }}>
          {HELP_COMMANDS.map((c) => (
            <div key={c.phrase} style={{ borderLeft: "2px solid var(--info)", paddingLeft: 12 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{c.phrase}</p>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{c.result}</p>
            </div>
          ))}
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, background: "var(--info-tint)", borderRadius: 8, padding: 12 }}>
          Nada se sube a Jira solo — ni el estado "En curso", ni comentarios, ni horas de reuniones.
          Claude siempre te muestra lo que va a escribir y espera tu confirmación antes de tocar Jira.
        </p>
      </div>
    </div>
  );
}

export default function SprintPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);
  const [tasks, setTasks] = useState<Task[] | null>(null);
  const [periods, setPeriods] = useState<Record<string, SprintPeriod>>({});
  const [viewable, setViewable] = useState<string[]>([]);
  const [viewing, setViewing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
      setChecked(true);
    });
  }, []);

  const allowed = useMemo(() => isSprintAllowed(userEmail), [userEmail]);

  useEffect(() => {
    if (!checked || !allowed) return;
    const url = viewing ? `/api/sprint?person=${encodeURIComponent(viewing)}` : "/api/sprint";
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (data?.error) { setError(data.error); return; }
        setTasks(data.tasks ?? []);
        setPeriods(data.periods ?? {});
        setViewable(data.viewable ?? []);
      })
      .catch((e) => setError(String(e)));
  }, [checked, allowed, viewing]);

  if (!checked) return <main style={{ minHeight: "100vh" }} />;

  if (!allowed) {
    return (
      <main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--card)" }}>
        <p style={{ fontSize: 14, color: "var(--muted)" }}>No autorizado.</p>
      </main>
    );
  }

  const docTasks = (tasks?.filter((t) => !t.is_meetings_task) ?? [])
    .slice()
    .sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  const meetingsTask = tasks?.find((t) => t.is_meetings_task) ?? null;
  const activeViewing = viewing ?? userEmail?.toLowerCase() ?? viewable[0] ?? "";
  const viewingSelf = activeViewing === userEmail?.toLowerCase();

  async function handleCopy() {
    await navigator.clipboard.writeText(buildSummaryText(docTasks, meetingsTask));
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      <style>{`
        @keyframes sprintFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .sprint-fade-in { animation: sprintFadeIn 0.45s ease-out both; }
        .sprint-bar-fill { transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1); }
        .sprint-card-hover { transition: transform 0.18s ease, box-shadow 0.18s ease; }
        .sprint-card-hover:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(17,24,39,0.08); }
        @keyframes sprintPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.35); }
          50% { box-shadow: 0 0 0 4px rgba(59,130,246,0); }
        }
        .sprint-pulse-dot { animation: sprintPulse 1.8s ease-in-out infinite; }
        @keyframes sprintPop {
          0% { transform: scale(0.92); }
          60% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .sprint-pop { animation: sprintPop 0.25s ease-out; }
        @keyframes sprintOverlayIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .sprint-overlay-in { animation: sprintOverlayIn 0.15s ease-out; }
        @keyframes sprintModalIn {
          from { opacity: 0; transform: scale(0.96) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sprint-modal-in { animation: sprintModalIn 0.2s ease-out; }
        @media (prefers-reduced-motion: reduce) {
          .sprint-fade-in, .sprint-pulse-dot, .sprint-pop, .sprint-overlay-in, .sprint-modal-in { animation: none; }
          .sprint-bar-fill, .sprint-card-hover { transition: none; }
        }
      `}</style>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Breadcrumb items={[{ label: "Sprint" }]} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={() => setShowHelp(true)}
            className="hub-link"
            style={{
              display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8, padding: "9px 14px",
              fontSize: 12, fontWeight: 700, color: "var(--fg)", cursor: "pointer",
              border: "1px solid var(--border)", background: "#fff",
            }}
            title="Cómo funciona este dashboard, y qué decirle a Claude"
          >
            ❓ Cómo funciona
          </button>
          {docTasks.length > 0 && (
            <button
              onClick={handleCopy}
              className={`hub-link${copied ? " sprint-pop" : ""}`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6, borderRadius: 8, padding: "9px 14px",
                fontSize: 12, fontWeight: 700, color: copied ? "var(--success)" : "var(--fg)", cursor: "pointer",
                border: "1px solid var(--border)", background: "#fff",
              }}
              title="Copia un resumen en texto plano, listo para tu update o standup"
            >
              {copied ? "✓ Copiado" : "📋 Copiar resumen"}
            </button>
          )}
        </div>
      </header>

      {showHelp && <HelpModal onClose={() => setShowHelp(false)} />}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
            🗓️ Sprint activo
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, maxWidth: "70ch" }}>
            Dashboard de solo lectura — cuéntale a Claude qué avanzaste en cualquier chat y él
            actualiza esto por ti. Nada se edita acá, y nada sube a Jira solo: eso se sincroniza
            cuando se lo pides a Claude explícitamente.
          </p>

          {viewable.length > 1 && (
            <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
              {viewable.map((email) => {
                const active = email === activeViewing;
                return (
                  <button
                    key={email}
                    onClick={() => setViewing(email)}
                    style={{
                      borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                      border: `1px solid ${active ? "var(--fg)" : "var(--border)"}`,
                      background: active ? "var(--fg)" : "#fff",
                      color: active ? "#fff" : "var(--muted)",
                    }}
                  >
                    {email === userEmail?.toLowerCase() ? "Mi dashboard" : displayName(email)}
                  </button>
                );
              })}
            </div>
          )}
          {!viewingSelf && (
            <p style={{ fontSize: 12, color: "var(--info)", fontWeight: 600, marginTop: 10 }}>
              👀 Viendo el dashboard de {displayName(activeViewing)}
            </p>
          )}
        </div>

        {error && (
          <div style={{ padding: 16, fontSize: 13, color: "var(--danger)", background: "#fff", border: "1px solid var(--border)", borderRadius: 12 }}>
            Error cargando datos: {error}
          </div>
        )}

        {!error && tasks === null && (
          <div style={{ padding: 16, fontSize: 13, color: "var(--muted)" }}>Cargando…</div>
        )}

        {!error && tasks !== null && tasks.length === 0 && (
          <div style={{ padding: 20, fontSize: 13, color: "var(--muted)", background: "#fff", border: "1px solid var(--border)", borderRadius: 12 }}>
            Todavía no hay tareas cargadas para este sprint. Pídele a Claude que traiga las tareas
            del sprint activo desde Jira para empezar.
          </div>
        )}

        {tasks && tasks.length > 0 && <SprintSummary docTasks={docTasks} meetingsTask={meetingsTask} />}

        {tasks && tasks.length > 0 && (
          <SprintPacing
            actualPct={overallProgress(docTasks)}
            period={
              periods[
                docTasks[0]?.sprint_label ?? meetingsTask?.sprint_label ?? ""
              ] ?? null
            }
          />
        )}

        {tasks && tasks.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: 16 }}>
            {meetingsTask && <MeetingsCard task={meetingsTask} delay={0} />}
            {docTasks.map((task, i) => (
              <TaskCard key={task.jira_key} task={task} delay={(meetingsTask ? i + 1 : i) * 60} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
