"use client";

import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  Plus, Trash2, ChevronDown, ChevronRight, Calculator, Sparkles, RotateCcw,
  CheckCircle2, AlertTriangle, XCircle, Info, X,
} from "lucide-react";

// Adaptación del prototipo "CX Tracker — Dashboard de Métricas CX en Dropshipping"
// (Metricas/Project Metrics Dashboard) a la línea gráfica de Darwin — mismo motor
// de diagnóstico y modelo de datos (M1 semanal / M2 quincenal / M3 mensual +
// bugs + calculadora CES/CSAT), aplicado a los proyectos reales de Experience.
// Todo el estado es local al navegador (no persiste en Supabase todavía).

// ── Tipos ──────────────────────────────────────────────────────────────────
type PhaseKey = "m1" | "m2" | "m3" | "opt" | "pend";
type BugStatus = "proceso" | "bloqueado" | "resuelto";

interface BugItem { id: string; tipo: string; desc: string; status: BugStatus }
interface Usuarios { perfil: string; perfilOtro: string; cantidad: string; notas: string }

interface MetricRow {
  id: string;
  fecha: string;
  objetivo: string;
  usuarios: Usuarios;
  adopcion: string; retencion: string; cesScore: string; csatScore: string;
  hallazgos: string;
  dolores: string;
  bugs: BugItem[];
  linkEntrevistas: string;
  linkDashboard: string;
  proximosPasos: string;
}

interface ProjectEntry {
  id: string; name: string; code: string; href: string; categoria: string;
  phase: PhaseKey; fechaInicio: string; objetivoGeneral: string;
  /** Substrings (case-insensitive) para reconocer el bloque de este proyecto
   * dentro del `content` de un update semanal — ver `weeklyUpdateToRow`. */
  updateAliases: string[];
  m1: MetricRow[]; m2: MetricRow[]; m3: MetricRow[];
}

interface Diagnosis { estado: string; dot: string; bg: string; border: string; text: string; desc: string }

// ── Metadata visual (línea gráfica de Darwin) ───────────────────────────────
const PHASE_META: Record<PhaseKey, { label: string; dot: string; color: string; bg: string }> = {
  m1: { label: "M1 · Semanal", dot: "🔵", color: "#2563EB", bg: "#EFF6FF" },
  m2: { label: "M2 · Quincenal", dot: "🟢", color: "#16A34A", bg: "#F0FDF4" },
  m3: { label: "M3 · Mensual", dot: "🟡", color: "#CA8A04", bg: "#FFFBEB" },
  opt: { label: "Optimización", dot: "🚀", color: "#7C3AED", bg: "#F5F3FF" },
  pend: { label: "Bloqueado", dot: "⛔", color: "#6B7280", bg: "#F3F4F6" },
};

const BUG_STATUS: Record<BugStatus, { label: string; color: string; bg: string; dot: string }> = {
  proceso: { label: "En proceso", color: "#CA8A04", bg: "#FEFCE8", dot: "🟡" },
  bloqueado: { label: "Bloqueado", color: "#DC2626", bg: "#FEF2F2", dot: "⛔" },
  resuelto: { label: "Resuelto", color: "#16A34A", bg: "#F0FDF4", dot: "✅" },
};

const PERFIL_OPTIONS = ["Dropshipper", "Proveedor", "Marca", "Usuario final", "Otros"];

function emptyUsuarios(): Usuarios { return { perfil: "", perfilOtro: "", cantidad: "", notas: "" }; }
function emptyRow(): MetricRow {
  return {
    id: Math.random().toString(36).slice(2),
    fecha: "", objetivo: "", usuarios: emptyUsuarios(),
    adopcion: "", retencion: "", cesScore: "", csatScore: "",
    hallazgos: "", dolores: "", bugs: [],
    linkEntrevistas: "", linkDashboard: "", proximosPasos: "",
  };
}

// ── Motor de diagnóstico — umbrales de Metricas/PROYECTO.md ────────────────
// CES 1–7: ≥5.5 fluido · 4.0–5.4 regular · <4.0 fricción
// CSAT %: ≥80 bueno · 70–79 regular · <70 crítico (act. 2026-09-07, Diana)
function diagnose(row: MetricRow): Diagnosis | null {
  const adoption = row.adopcion ? parseFloat(row.adopcion) : null;
  const retention = row.retencion ? parseFloat(row.retencion) : null;
  const ces = row.cesScore ? parseFloat(row.cesScore) : null;
  const csat = row.csatScore ? parseFloat(row.csatScore) : null;
  const hasBugs = row.bugs.some((b) => b.status !== "resuelto");

  if (!row.fecha && !row.objetivo && adoption === null) return null;

  if (hasBugs && adoption !== null && adoption < 40)
    return { estado: "Reportar errores + Ajustar flujo", dot: "⚠️", bg: "#FEF9C3", border: "#FCD34D", text: "#78350F", desc: "Bugs activos y adopción baja. Doble acción requerida." };
  if (hasBugs)
    return { estado: "Reportar errores técnicos", dot: "⚠️", bg: "#FEF3C7", border: "#FCD34D", text: "#92400E", desc: "Bugs detectados. Notificar al equipo técnico." };
  if (adoption !== null && adoption < 20 && (retention === null || retention < 15))
    return { estado: "Move On / Roll Back", dot: "⛔", bg: "#FEE2E2", border: "#FCA5A5", text: "#7F1D1D", desc: "Adopción y retención críticas. Evaluar discontinuación." };
  if (adoption !== null && adoption >= 70 && (retention === null || retention >= 60) && (ces === null || ces >= 5.5) && (csat === null || csat >= 80))
    return { estado: "Nueva fase", dot: "🚀", bg: "#EDE9FE", border: "#C4B5FD", text: "#4C1D95", desc: "Feature-Product Fit logrado. Listo para escalar." };
  if ((ces !== null && ces < 4.0) || (adoption !== null && adoption < 40) || (csat !== null && csat < 70))
    return {
      estado: "Ajustar flujo", dot: "🛠️", bg: "#FEF3C7", border: "#FDE68A", text: "#78350F",
      desc: ces !== null && ces < 4.0 ? `CES ${ces}/7 — alta fricción percibida.`
        : csat !== null && csat < 70 ? `CSAT ${csat}% — satisfacción crítica.`
          : `Adopción ${adoption}% — fricción en el proceso.`,
    };
  return { estado: "Seguir midiendo", dot: "🔵", bg: "#EFF6FF", border: "#BFDBFE", text: "#1E40AF", desc: "Sin alertas críticas. Monitoreo continuo." };
}

const STATUS_ACTIONS = [
  { estado: "Seguir midiendo", dot: "🔵", color: "#2563EB", descripcion: "Monitoreo constante de adopción y eficiencia técnica.", criterio: "Funcionalidad reciente que necesita validar si el target completa el evento de adopción sin bloqueos técnicos." },
  { estado: "Reportar errores técnicos", dot: "⚠️", color: "#CA8A04", descripcion: "Notificar al equipo de tecnología sobre deficiencias de rendimiento.", criterio: "Se activa ante fallos técnicos o bugs que afectan la experiencia del usuario." },
  { estado: "Ajustar flujo", dot: "🛠️", color: "#CA8A04", descripcion: "Rediseño de UX/UI para reducir fricción y mejorar usabilidad.", criterio: "CES < 4.0/7 o CSAT < 70% son señales directas de fricción o complejidad." },
  { estado: "Nueva fase", dot: "🚀", color: "#7C3AED", descripcion: "Nuevo ciclo de desarrollo para escalar el impacto.", criterio: "Feature-Product Fit: adopción ≥70%, CES ≥5.5, CSAT ≥80%." },
  { estado: "Move On / Roll Back", dot: "⛔", color: "#DC2626", descripcion: "Cese de mantenimiento o eliminación de la función.", criterio: "Baja retención (<15%) y adopción crítica (<20%)." },
];

// ── Sync con Updates — el Following se alimenta de celula_updates ─────────
// Cada semana ya se publica un update en /celula/experience/updates con un
// bloque de texto libre por proyecto (separados por "---"). En vez de
// retipear ese mismo contenido a mano en el CX Tracker (como se hacía antes,
// con el riesgo de que ambos textos diverjan), cada revisión M1 se deriva
// directo de ese contenido — 2026-09-07, pedido de Diana.
//
// El formato de cada bloque no es 100% consistente entre semanas (algunas
// traen "Fase:/Prioridad:/Estado:/Próximos pasos:" con etiqueta, otras son
// prosa libre), así que el parseo es deliberadamente conservador: solo separa
// como campo propio lo que puede identificar con una regla clara ("Próximos
// pasos:" y la línea que menciona "bloque(ado/o)"); el resto queda tal cual en
// hallazgos, sin adivinar qué es "dolor" vs "hallazgo" en prosa libre. Si un
// update no menciona un proyecto, simplemente no genera fila esa semana —
// nunca se fuerza ni se inventa una revisión.
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

function formatWeekDate(weekDate: string): string {
  const [y, m, d] = weekDate.split("-").map(Number);
  const mes = MESES[m - 1] ?? "";
  return `${d} de ${mes.charAt(0).toUpperCase()}${mes.slice(1)}, ${y}`;
}

function splitProjectBlocks(content: string): { heading: string; body: string }[] {
  return content
    .split(/\n\s*-{3,}\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const lines = chunk.split("\n");
      const headingIdx = lines.findIndex((l) => /^#+\s*/.test(l.trim()));
      const headingLine = headingIdx >= 0 ? lines[headingIdx] : lines[0];
      const heading = headingLine.replace(/^#+\s*\d*\.?\s*/, "").trim();
      const body = lines.filter((_, i) => i !== headingIdx).join("\n").trim();
      return { heading, body };
    });
}

function matchProjectBlock(blocks: { heading: string; body: string }[], aliases: string[]) {
  return blocks.find((b) => aliases.some((a) => b.heading.toLowerCase().includes(a.toLowerCase()))) ?? null;
}

function extractProximosPasos(body: string): string {
  const line = body.split("\n").find((l) => /pr[oó]ximos pasos/i.test(l));
  if (!line) return "";
  const match = line.match(/pr[oó]ximos pasos[^:]*:\s*(.+)/i);
  return (match?.[1] ?? line.replace(/^-\s*/, "")).trim();
}

function extractBloqueo(body: string): string {
  const line = body.split("\n").find((l) => /bloque/i.test(l));
  if (!line) return "";
  return line.replace(/^-\s*/, "").replace(/^Estado:\s*/i, "").trim();
}

function flattenBody(body: string): string {
  return body
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && l !== "---" && !/pr[oó]ximos pasos/i.test(l) && !/bloque/i.test(l))
    .map((l) => l.replace(/^-\s*/, ""))
    .join(" · ");
}

function weeklyUpdateToRow(weekDate: string, content: string, aliases: string[], objetivo: string): MetricRow | null {
  const match = matchProjectBlock(splitProjectBlocks(content), aliases);
  if (!match) return null;
  return {
    ...emptyRow(),
    fecha: formatWeekDate(weekDate),
    objetivo,
    hallazgos: flattenBody(match.body),
    dolores: extractBloqueo(match.body),
    proximosPasos: extractProximosPasos(match.body),
  };
}

type CelulaUpdate = { week_date: string; content: string };

/** Deriva el m1 de cada proyecto a partir de los updates semanales reales,
 * ordenados de más antiguo a más reciente (así el acordeón muestra el avance
 * cronológico). Proyectos sin match en ningún update quedan con m1 vacío. */
function syncM1FromUpdates(projects: ProjectEntry[], updates: CelulaUpdate[]): ProjectEntry[] {
  const sorted = [...updates].sort((a, b) => a.week_date.localeCompare(b.week_date));
  return projects.map((p) => {
    const rows = sorted
      .map((u) => weeklyUpdateToRow(u.week_date, u.content, p.updateAliases, p.objetivoGeneral))
      .filter((r): r is MetricRow => r !== null);
    return rows.length > 0 ? { ...p, m1: rows } : p;
  });
}

// ── Seed — proyectos de la Célula Experience ────────────────────────────────
// Métricas de UX (adopción/retención/CES/CSAT) sin medir todavía → en blanco.
// m1 arranca vacío: se llena en el montaje de la página con `syncM1FromUpdates`
// a partir de los updates semanales reales de /celula/experience/updates.
const PROJECTS_SEED: ProjectEntry[] = [
  {
    id: "rearquitectura", name: "Rearquitectura", code: "DROP-25312", href: "/proyectos/rearquitectura",
    categoria: "Célula Experience", phase: "m1", fechaInicio: "2026",
    objetivoGeneral: "Reorganizar la navegación y pantallas de Dropi por módulo, sin alterar la lógica de negocio.",
    updateAliases: ["rearquitectura"],
    m1: [], m2: [], m3: [],
  },
  {
    id: "ordenes", name: "Órdenes", code: "EXP-002", href: "/proyectos/ordenes",
    categoria: "Célula Experience", phase: "pend", fechaInicio: "2026",
    objetivoGeneral: "MVP Órdenes 2.0 — importación, exportación, etiquetas y optimización de creación manual de órdenes.",
    updateAliases: ["órdenes", "ordenes"],
    m1: [], m2: [], m3: [],
  },
  {
    id: "dropi-app", name: "Dropi App — Novedades", code: "DROP-25313", href: "/proyectos/dropi-app",
    categoria: "Célula Experience", phase: "m2", fechaInicio: "2025",
    objetivoGeneral: "Gestión de Novedades: implementación y centralización de la gestión de novedades para optimizar la operativa inicial.",
    updateAliases: ["dropi app", "novedades"],
    m1: [], m2: [], m3: [],
  },
  {
    id: "exp-004", name: "Dashboard de Indicadores", code: "EXP-004", href: "/proyectos/exp-004",
    categoria: "Célula Experience", phase: "m2", fechaInicio: "2025",
    objetivoGeneral: "Dashboard de indicadores centralizado para Proveedor, Marca y Marca Blanca — centro de mando al iniciar sesión.",
    updateAliases: ["dashboard de indicadores", "indicadores"],
    m1: [], m2: [], m3: [],
  },
  {
    id: "dropi-testers", name: "Dropi Testers", code: "EXP-006", href: "/proyectos/dropi-testers",
    categoria: "Célula Experience", phase: "pend", fechaInicio: "2026",
    objetivoGeneral: "MVP para capturar usuarios interesados en ser testers de Dropi, de cara a ExpoWinner.",
    updateAliases: ["dropi testers"],
    m1: [], m2: [], m3: [],
  },
  {
    id: "sherlock", name: "Proyecto Sherlock", code: "EXP-005", href: "/celula/experience",
    categoria: "Célula Experience", phase: "m1", fechaInicio: "2026",
    objetivoGeneral: "Escuchar la voz de los usuarios integrando fuentes de datos alternas al ecosistema Dropi.",
    updateAliases: ["sherlock"],
    m1: [], m2: [], m3: [],
  },
];

// ── Componentes base ─────────────────────────────────────────────────────
function Badge({ children, color, bg }: { children: React.ReactNode; color: string; bg?: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700,
      color, background: bg ?? `${color}18`, borderRadius: 999, padding: "3px 10px", whiteSpace: "nowrap",
    }}>
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, mono }: { value: string; onChange: (v: string) => void; placeholder?: string; mono?: boolean }) {
  return (
    <input
      type="text" value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", fontSize: 13, padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border)",
        background: "var(--card)", color: "var(--fg)", fontFamily: mono ? "monospace" : "inherit",
      }}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 2 }: { value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <textarea
      value={value} placeholder={placeholder} rows={rows} onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%", fontSize: 13, padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border)",
        background: "var(--card)", color: "var(--fg)", fontFamily: "inherit", resize: "vertical",
      }}
    />
  );
}

function MetricInput({ label, value, onChange, unit, color }: { label: string; value: string; onChange: (v: string) => void; unit: string; color: string }) {
  return (
    <div>
      <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <input
          type="number" value={value} placeholder="—" onChange={(e) => onChange(e.target.value)}
          style={{ width: 72, fontSize: 14, fontWeight: 700, color, padding: "6px 8px", borderRadius: 8, border: `1px solid ${color}55`, background: `${color}0D` }}
        />
        <span style={{ fontSize: 11, color: "var(--muted)" }}>{unit}</span>
      </div>
    </div>
  );
}

// ── Bug manager ──────────────────────────────────────────────────────────
function BugManager({ bugs, onChange }: { bugs: BugItem[]; onChange: (b: BugItem[]) => void }) {
  function update(id: string, patch: Partial<BugItem>) {
    onChange(bugs.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  }
  function add() {
    onChange([...bugs, { id: Math.random().toString(36).slice(2), tipo: "", desc: "", status: "proceso" }]);
  }
  function remove(id: string) {
    onChange(bugs.filter((b) => b.id !== id));
  }
  return (
    <div>
      {bugs.map((b, i) => (
        <div key={b.id} style={{ display: "flex", gap: 8, alignItems: "flex-start", marginBottom: 8, background: "var(--bg)", borderRadius: 8, padding: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginTop: 8 }}>{i + 1}.</span>
          <div style={{ flex: 1, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 8 }}>
            <TextInput value={b.tipo} onChange={(v) => update(b.id, { tipo: v })} placeholder="Tipo (ej. Funcional)" />
            <TextInput value={b.desc} onChange={(v) => update(b.id, { desc: v })} placeholder="Descripción del bug" />
            <select
              value={b.status} onChange={(e) => update(b.id, { status: e.target.value as BugStatus })}
              style={{ fontSize: 12, fontWeight: 600, padding: "6px 8px", borderRadius: 8, border: `1px solid ${BUG_STATUS[b.status].color}55`, background: BUG_STATUS[b.status].bg, color: BUG_STATUS[b.status].color }}
            >
              {(Object.keys(BUG_STATUS) as BugStatus[]).map((s) => <option key={s} value={s}>{BUG_STATUS[s].dot} {BUG_STATUS[s].label}</option>)}
            </select>
          </div>
          <button onClick={() => remove(b.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", marginTop: 6 }}>
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        onClick={add}
        style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "var(--dropi)", background: "none", border: "1px dashed var(--border)", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}
      >
        <Plus size={13} /> Agregar bug
      </button>
    </div>
  );
}

// ── Diagnóstico ──────────────────────────────────────────────────────────
function DiagnosisBadge({ row }: { row: MetricRow }) {
  const d = diagnose(row);
  if (!d) return <Badge color="#6B7280">⚪ Sin datos</Badge>;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, color: d.text, background: d.bg, border: `1px solid ${d.border}`, borderRadius: 999, padding: "4px 12px" }}>
      {d.dot} {d.estado}
    </span>
  );
}

// ── Tarjeta de revisión (M1/M2/M3) — acordeón ───────────────────────────
function MetricRowCard({ row, onUpdate, onDelete }: { row: MetricRow; onUpdate: (r: MetricRow) => void; onDelete: () => void }) {
  const [open, setOpen] = useState(false);
  const d = diagnose(row);
  const set = <K extends keyof MetricRow>(key: K) => (v: MetricRow[K]) => onUpdate({ ...row, [key]: v });

  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 12, overflow: "hidden" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          {open ? <ChevronDown size={16} color="var(--muted)" /> : <ChevronRight size={16} color="var(--muted)" />}
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{row.fecha || "Sin fecha"}</div>
            <div style={{ fontSize: 12, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 420 }}>{row.objetivo || "Sin objetivo definido"}</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {row.adopcion && <Badge color="#2563EB">Adop. {row.adopcion}%</Badge>}
          {row.cesScore && <Badge color="#0D9488">CES {row.cesScore}</Badge>}
          {row.csatScore && <Badge color="#7C3AED">CSAT {row.csatScore}%</Badge>}
          <DiagnosisBadge row={row} />
        </div>
      </button>

      {open && (
        <div style={{ padding: "0 16px 18px", borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginTop: 14 }}>
            <Field label="Fecha de la revisión"><TextInput value={row.fecha} onChange={set("fecha")} placeholder="ej. 31 de Agosto, 2026" /></Field>
            <Field label="Perfil de usuario">
              <select value={row.usuarios.perfil} onChange={(e) => set("usuarios")({ ...row.usuarios, perfil: e.target.value })}
                style={{ width: "100%", fontSize: 13, padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)" }}>
                <option value="">—</option>
                {PERFIL_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </Field>
            <Field label="Cantidad (n)"><TextInput value={row.usuarios.cantidad} onChange={(v) => set("usuarios")({ ...row.usuarios, cantidad: v })} placeholder="ej. 6000" mono /></Field>
          </div>

          <Field label="Objetivo de la revisión"><TextArea value={row.objetivo} onChange={set("objetivo")} placeholder="¿Qué se busca validar en esta revisión?" /></Field>
          <Field label="Notas del segmento"><TextInput value={row.usuarios.notas} onChange={(v) => set("usuarios")({ ...row.usuarios, notas: v })} placeholder="ej. Dropshippers activos, todos los países" /></Field>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, margin: "14px 0" }}>
            <MetricInput label="Adopción" value={row.adopcion} onChange={set("adopcion")} unit="%" color="#2563EB" />
            <MetricInput label="Retención" value={row.retencion} onChange={set("retencion")} unit="%" color="#0D9488" />
            <MetricInput label="CES" value={row.cesScore} onChange={set("cesScore")} unit="/ 7" color="#2563EB" />
            <MetricInput label="CSAT" value={row.csatScore} onChange={set("csatScore")} unit="%" color="#7C3AED" />
          </div>

          <Field label="Hallazgos"><TextArea value={row.hallazgos} onChange={set("hallazgos")} placeholder="¿Qué dice la data de forma objetiva?" /></Field>
          <Field label="Dolores / fricciones"><TextArea value={row.dolores} onChange={set("dolores")} placeholder="¿Dónde se traba la experiencia?" /></Field>

          <Field label="Bugs">
            <BugManager bugs={row.bugs} onChange={set("bugs")} />
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            <Field label="Link entrevistas"><TextInput value={row.linkEntrevistas} onChange={set("linkEntrevistas")} placeholder="https://…" /></Field>
            <Field label="Link dashboard"><TextInput value={row.linkDashboard} onChange={set("linkDashboard")} placeholder="https://…" /></Field>
          </div>

          <Field label="Próximos pasos"><TextArea value={row.proximosPasos} onChange={set("proximosPasos")} placeholder="Acciones concretas para la siguiente revisión" rows={3} /></Field>

          {d && (
            <div style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 10, padding: "10px 14px", marginBottom: 12 }}>
              <strong style={{ fontSize: 12.5, color: d.text }}>{d.dot} {d.estado}</strong>
              <p style={{ fontSize: 12, color: d.text, margin: "4px 0 0" }}>{d.desc}</p>
            </div>
          )}

          <button
            onClick={onDelete}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: "#B91C1C", background: "none", border: "1px solid #FECACA", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}
          >
            <Trash2 size={13} /> Eliminar esta revisión
          </button>
        </div>
      )}
    </div>
  );
}

// ── Vista por fase (M1/M2/M3) ───────────────────────────────────────────
function MTab({ rows, onChange, phase }: { rows: MetricRow[]; onChange: (rows: MetricRow[]) => void; phase: "m1" | "m2" | "m3" }) {
  const meta = PHASE_META[phase];
  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <Badge color={meta.color} bg={meta.bg}>{meta.dot} {meta.label}</Badge>
        <button
          onClick={() => onChange([...rows, emptyRow()])}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer" }}
        >
          <Plus size={13} /> Agregar revisión
        </button>
      </div>
      {rows.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--muted)", textAlign: "center", padding: "24px 0" }}>Aún no hay revisiones registradas en esta fase.</p>
      )}
      {rows.map((row, i) => (
        <MetricRowCard
          key={row.id}
          row={row}
          onUpdate={(r) => onChange(rows.map((x, j) => (j === i ? r : x)))}
          onDelete={() => onChange(rows.filter((_, j) => j !== i))}
        />
      ))}
    </div>
  );
}

// ── Resumen ──────────────────────────────────────────────────────────────
function statValue(v: string, unit: string) { return v ? `${v}${unit}` : "—"; }

function AiRecommendation({ project }: { project: ProjectEntry }) {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cx-tracker/ai-recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectName: project.name, projectCode: project.code, m1: project.m1, m2: project.m2, m3: project.m3 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error generando la recomendación.");
      setRecommendation(data.recommendation);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: 16, marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Sparkles size={15} color="#7C3AED" />
          <strong style={{ fontSize: 13, color: "#4C1D95" }}>Recomendación con IA</strong>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          style={{
            display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700,
            color: "#fff", background: loading ? "#A78BFA" : "#7C3AED", border: "none", borderRadius: 8,
            padding: "7px 14px", cursor: loading ? "default" : "pointer",
          }}
        >
          <Sparkles size={13} /> {loading ? "Analizando…" : recommendation ? "Regenerar" : "Generar recomendación"}
        </button>
      </div>
      {!recommendation && !error && !loading && (
        <p style={{ fontSize: 12, color: "#6D28D9", margin: "8px 0 0" }}>
          Analiza todo el historial de M1/M2/M3 registrado hasta ahora (métricas, hallazgos, dolores, bugs) y sugiere próximos pasos.
        </p>
      )}
      {error && <p style={{ fontSize: 12, color: "#B91C1C", margin: "8px 0 0" }}>{error}</p>}
      {recommendation && (
        <p style={{ fontSize: 12.5, color: "#3B0764", margin: "10px 0 0", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{recommendation}</p>
      )}
    </div>
  );
}

function ResumenTab({ project }: { project: ProjectEntry }) {
  const allRows = [...project.m1, ...project.m2, ...project.m3];
  const latest = allRows[allRows.length - 1] ?? null;
  const d = latest ? diagnose(latest) : null;

  return (
    <div>
      <AiRecommendation project={project} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[
          { label: "Adopción", value: statValue(latest?.adopcion ?? "", "%"), color: "#2563EB" },
          { label: "Retención", value: statValue(latest?.retencion ?? "", "%"), color: "#0D9488" },
          { label: "CES", value: statValue(latest?.cesScore ?? "", "/7"), color: "#2563EB" },
          { label: "CSAT", value: statValue(latest?.csatScore ?? "", "%"), color: "#7C3AED" },
        ].map((s) => (
          <div key={s.label} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px", textAlign: "center" }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.value === "—" ? "var(--muted)" : s.color }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {d ? (
        <div style={{ background: d.bg, border: `1px solid ${d.border}`, borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: d.text, textTransform: "uppercase", marginBottom: 4 }}>Diagnóstico automático más reciente</div>
          <strong style={{ fontSize: 14, color: d.text }}>{d.dot} {d.estado}</strong>
          <p style={{ fontSize: 12.5, color: d.text, margin: "4px 0 0" }}>{d.desc}</p>
        </div>
      ) : (
        <div style={{ background: "var(--bg)", border: "1px dashed var(--border)", borderRadius: 10, padding: "14px 16px", marginBottom: 20, textAlign: "center", fontSize: 12.5, color: "var(--muted)" }}>
          Aún no hay revisiones con datos para diagnosticar.
        </div>
      )}

      {latest && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 20 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>HALLAZGOS</div>
            <p style={{ fontSize: 12.5, color: "var(--fg)", margin: 0, lineHeight: 1.5 }}>{latest.hallazgos || "—"}</p>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>DOLORES</div>
            <p style={{ fontSize: 12.5, color: "var(--fg)", margin: 0, lineHeight: 1.5 }}>{latest.dolores || "—"}</p>
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>PRÓXIMOS PASOS</div>
            <p style={{ fontSize: 12.5, color: "var(--fg)", margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{latest.proximosPasos || "—"}</p>
          </div>
        </div>
      )}

      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10 }}>
        Estados y acciones del esquema
      </div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5, minWidth: 480 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid var(--border)", fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase" }}>Estado</th>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid var(--border)", fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase" }}>Acción</th>
              <th style={{ textAlign: "left", padding: "8px 10px", borderBottom: "1px solid var(--border)", fontSize: 10.5, color: "var(--muted)", textTransform: "uppercase" }}>Criterio</th>
            </tr>
          </thead>
          <tbody>
            {STATUS_ACTIONS.map((s) => (
              <tr key={s.estado}>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", fontWeight: 700, color: s.color, whiteSpace: "nowrap" }}>{s.dot} {s.estado}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", color: "var(--fg)" }}>{s.descripcion}</td>
                <td style={{ padding: "8px 10px", borderBottom: "1px solid var(--border)", color: "var(--muted)" }}>{s.criterio}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Calculadora de Métricas (drawer) ─────────────────────────────────────
function bandaColor(v: number, goodMin: number, okMin: number) {
  if (v >= goodMin) return { color: "#15803D", bg: "#F0FDF4", border: "#BBF7D0", label: "Bueno", icon: CheckCircle2 };
  if (v >= okMin) return { color: "#B45309", bg: "#FFFBEB", border: "#FDE68A", label: "Regular", icon: AlertTriangle };
  return { color: "#B91C1C", bg: "#FEF2F2", border: "#FECACA", label: "Malo", icon: XCircle };
}

function MiniAlerta({ n }: { n: number }) {
  if (n <= 0 || n >= 50) return null;
  const critico = n < 20;
  return (
    <div style={{ display: "flex", gap: 6, fontSize: 11, padding: "8px 10px", borderRadius: 8, background: critico ? "#FEF2F2" : "#FFFBEB", border: `1px solid ${critico ? "#FECACA" : "#FDE68A"}`, color: critico ? "#B91C1C" : "#B45309", marginTop: 8 }}>
      <span>{critico ? "🔴" : "🟡"}</span>
      <span><strong>{critico ? "Muestra insuficiente" : "Muestra limitada"} (n={n})</strong> — {critico ? "no representativo, evita decidir solo con este dato." : "señal direccional, no conclusión definitiva."}</span>
    </div>
  );
}

function CalculatorDrawer({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<"ces" | "csat" | "retencion" | "adopcion">("ces");
  const [cesSuma, setCesSuma] = useState(""); const [cesTotal, setCesTotal] = useState("");
  const [csatSat, setCsatSat] = useState(""); const [csatTotal, setCsatTotal] = useState("");
  const [crrStart, setCrrStart] = useState(""); const [crrNew, setCrrNew] = useState(""); const [crrEnd, setCrrEnd] = useState("");
  const [adopModo, setAdopModo] = useState<"producto" | "funcionalidad">("producto");
  const [adopActivos, setAdopActivos] = useState(""); const [adopBase, setAdopBase] = useState("");

  const cesN = parseInt(cesTotal) || 0;
  const ces = cesN > 0 ? (parseInt(cesSuma) || 0) / cesN : null;
  const csatN = parseInt(csatTotal) || 0;
  const csat = csatN > 0 ? ((parseInt(csatSat) || 0) / csatN) * 100 : null;
  const crrS = parseInt(crrStart) || 0;
  const crr = crrS > 0 ? ((parseInt(crrEnd) || 0) - (parseInt(crrNew) || 0)) / crrS * 100 : null;
  const adopBaseN = parseInt(adopBase) || 0;
  const adopcionPct = adopBaseN > 0 ? ((parseInt(adopActivos) || 0) / adopBaseN) * 100 : null;

  return (
    <div style={{
      position: "fixed", top: 0, right: 0, bottom: 0, width: 340, maxWidth: "90vw", background: "var(--card)",
      borderLeft: "1px solid var(--border)", boxShadow: "-8px 0 24px rgba(0,0,0,0.08)", zIndex: 50,
      padding: 20, overflowY: "auto",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <strong style={{ fontSize: 14, color: "var(--fg)" }}>🧮 Calculadora de Métricas</strong>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}><X size={18} /></button>
      </div>
      <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
        <button onClick={() => setTab("ces")} style={{ flex: 1, fontSize: 12.5, fontWeight: 700, padding: "7px 0", borderRadius: 8, border: `1px solid ${tab === "ces" ? "#2563EB" : "var(--border)"}`, background: tab === "ces" ? "#EFF6FF" : "var(--card)", color: tab === "ces" ? "#2563EB" : "var(--muted)", cursor: "pointer" }}>CES</button>
        <button onClick={() => setTab("csat")} style={{ flex: 1, fontSize: 12.5, fontWeight: 700, padding: "7px 0", borderRadius: 8, border: `1px solid ${tab === "csat" ? "#0D9488" : "var(--border)"}`, background: tab === "csat" ? "#F0FDFA" : "var(--card)", color: tab === "csat" ? "#0D9488" : "var(--muted)", cursor: "pointer" }}>CSAT</button>
        <button onClick={() => setTab("retencion")} style={{ flex: 1, fontSize: 12.5, fontWeight: 700, padding: "7px 0", borderRadius: 8, border: `1px solid ${tab === "retencion" ? "#7C3AED" : "var(--border)"}`, background: tab === "retencion" ? "#F5F3FF" : "var(--card)", color: tab === "retencion" ? "#7C3AED" : "var(--muted)", cursor: "pointer" }}>CRR</button>
        <button onClick={() => setTab("adopcion")} style={{ flex: 1, fontSize: 12.5, fontWeight: 700, padding: "7px 0", borderRadius: 8, border: `1px solid ${tab === "adopcion" ? "#2563EB" : "var(--border)"}`, background: tab === "adopcion" ? "#EFF6FF" : "var(--card)", color: tab === "adopcion" ? "#2563EB" : "var(--muted)", cursor: "pointer" }}>Adopción</button>
      </div>

      {tab === "ces" ? (
        <div>
          <Field label="Suma total de puntos"><TextInput value={cesSuma} onChange={setCesSuma} placeholder="0" mono /></Field>
          <Field label="Total de respuestas"><TextInput value={cesTotal} onChange={setCesTotal} placeholder="0" mono /></Field>
          <MiniAlerta n={cesN} />
          {ces !== null && (() => {
            const b = bandaColor(ces, 5.5, 4.0); const Icon = b.icon;
            return (
              <div style={{ marginTop: 12, background: b.bg, border: `1px solid ${b.border}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: b.color }}>{ces.toFixed(1)}<span style={{ fontSize: 13 }}> / 7</span></div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4 }}><Icon size={13} color={b.color} /><span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.label}</span></div>
              </div>
            );
          })()}
        </div>
      ) : tab === "csat" ? (
        <div>
          <Field label="Respuestas 4 y 5 ★"><TextInput value={csatSat} onChange={setCsatSat} placeholder="0" mono /></Field>
          <Field label="Total de respuestas"><TextInput value={csatTotal} onChange={setCsatTotal} placeholder="0" mono /></Field>
          <MiniAlerta n={csatN} />
          {csat !== null && (() => {
            const b = bandaColor(csat, 80, 70); const Icon = b.icon;
            return (
              <div style={{ marginTop: 12, background: b.bg, border: `1px solid ${b.border}`, borderRadius: 10, padding: 16, textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: b.color }}>{Math.round(csat)}%</div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5, marginTop: 4 }}><Icon size={13} color={b.color} /><span style={{ fontSize: 12, fontWeight: 700, color: b.color }}>{b.label}</span></div>
              </div>
            );
          })()}
        </div>
      ) : tab === "retencion" ? (
        <div>
          <Field label="Clientes al inicio del periodo (S)"><TextInput value={crrStart} onChange={setCrrStart} placeholder="0" mono /></Field>
          <Field label="Clientes nuevos adquiridos (N)"><TextInput value={crrNew} onChange={setCrrNew} placeholder="0" mono /></Field>
          <Field label="Clientes al final del periodo (E)"><TextInput value={crrEnd} onChange={setCrrEnd} placeholder="0" mono /></Field>
          {crr !== null && (
            <div style={{ marginTop: 12, background: "#F5F3FF", border: "1px solid #DDD6FE", borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#7C3AED" }}>{crr.toFixed(1)}%</div>
              <div style={{ fontSize: 11, color: "#6D28D9", marginTop: 4 }}>Tasa de Retención de Clientes</div>
            </div>
          )}
          <p style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 10, fontFamily: "monospace" }}>CRR = ((E − N) / S) × 100</p>
        </div>
      ) : (
        <div>
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            <button onClick={() => setAdopModo("producto")} style={{ flex: 1, fontSize: 11.5, fontWeight: 700, padding: "6px 0", borderRadius: 8, border: `1px solid ${adopModo === "producto" ? "#2563EB" : "var(--border)"}`, background: adopModo === "producto" ? "#EFF6FF" : "var(--card)", color: adopModo === "producto" ? "#2563EB" : "var(--muted)", cursor: "pointer" }}>Producto</button>
            <button onClick={() => setAdopModo("funcionalidad")} style={{ flex: 1, fontSize: 11.5, fontWeight: 700, padding: "6px 0", borderRadius: 8, border: `1px solid ${adopModo === "funcionalidad" ? "#2563EB" : "var(--border)"}`, background: adopModo === "funcionalidad" ? "#EFF6FF" : "var(--card)", color: adopModo === "funcionalidad" ? "#2563EB" : "var(--muted)", cursor: "pointer" }}>Funcionalidad</button>
          </div>
          {adopModo === "producto" ? (
            <>
              <Field label="Usuarios activos (DAU / WAU / MAU)"><TextInput value={adopActivos} onChange={setAdopActivos} placeholder="0" mono /></Field>
              <Field label="Total usuarios registrados"><TextInput value={adopBase} onChange={setAdopBase} placeholder="0" mono /></Field>
            </>
          ) : (
            <>
              <Field label="Usuarios activos de la funcionalidad"><TextInput value={adopActivos} onChange={setAdopActivos} placeholder="0" mono /></Field>
              <Field label="Usuarios activos totales (mismo periodo)"><TextInput value={adopBase} onChange={setAdopBase} placeholder="0" mono /></Field>
            </>
          )}
          {adopcionPct !== null && (
            <div style={{ marginTop: 12, background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: 16, textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: "#2563EB" }}>{adopcionPct.toFixed(1)}%</div>
              <div style={{ fontSize: 11, color: "#1D4ED8", marginTop: 4 }}>{adopModo === "producto" ? "Tasa de Adopción del Producto" : "Tasa de Adopción de la Funcionalidad"}</div>
            </div>
          )}
          <p style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 10, fontFamily: "monospace" }}>
            {adopModo === "producto" ? "Adopción = (Usuarios activos / Total registrados) × 100" : "Adopción = (Activos de la funcionalidad / Activos totales) × 100"}
          </p>
        </div>
      )}

      <div style={{ marginTop: 20, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
        <p style={{ fontSize: 10.5, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
          <Info size={11} style={{ display: "inline", marginRight: 3, marginBottom: -1 }} />
          Umbrales: CES 🟢≥5.5 🟡4.0–5.4 🔴&lt;4.0 · CSAT 🟢≥80% 🟡70–79% 🔴&lt;70%. CRR = clientes al final menos nuevos, sobre clientes al inicio. Adopción = activos sobre la base total (producto) o sobre activos totales (funcionalidad). Calculadora completa con más contexto en <a href="/guias/medicion-ces-csat-nps" style={{ color: "var(--dropi)" }}>Guías → Métricas de CX</a>.
        </p>
      </div>
    </div>
  );
}

// ── Página ───────────────────────────────────────────────────────────────
export default function CxTrackerPage() {
  const [projects, setProjects] = useState(PROJECTS_SEED);
  const [selectedId, setSelectedId] = useState(PROJECTS_SEED[0].id);
  const [tab, setTab] = useState<"resumen" | "m1" | "m2" | "m3">("resumen");
  const [calcOpen, setCalcOpen] = useState(false);
  const [syncing, setSyncing] = useState(true);

  // El Following se alimenta de los Updates semanales reales de la célula
  // (celula_updates) en vez de datos retipeados a mano — se corre una sola
  // vez al montar; ediciones manuales posteriores del usuario ya no se
  // vuelven a pisar porque este efecto no reintenta.
  useEffect(() => {
    fetch("/api/celulas/experience")
      .then((res) => res.json())
      .then((data: { updates?: CelulaUpdate[] }) => {
        if (data.updates) setProjects((prev) => syncM1FromUpdates(prev, data.updates!));
      })
      .catch(() => {})
      .finally(() => setSyncing(false));
  }, []);

  const project = projects.find((p) => p.id === selectedId)!;

  function updateProject(patch: Partial<ProjectEntry>) {
    setProjects((prev) => prev.map((p) => (p.id === selectedId ? { ...p, ...patch } : p)));
  }

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Agente de Seguimiento de Métricas"
        subtitle="Célula Experience · PO: Diana Aldana"
        currentSlug="cx-tracker"
      />

      <main style={{ maxWidth: 1280, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>
        <div style={{ marginBottom: 20 }}>
          <a href="/celula/experience" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Volver a Célula Experience
          </a>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <div>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#7C3AED", background: "#F3E8FF" }}>🧬 Célula Experience</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#1458A8", background: "#EFF6FF" }}>🚚 Following · Activo</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#EA580C", background: "#FFEDD5" }}>EXP-007</span>
                {syncing && (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999, padding: "4px 10px", fontSize: 12, fontWeight: 700, color: "#6B7280", background: "#F3F4F6" }}>⏳ Sincronizando con Updates…</span>
                )}
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>Agente de Seguimiento de Métricas</h1>
            </div>
            <button
              onClick={() => setCalcOpen(true)}
              style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "9px 16px", cursor: "pointer", flexShrink: 0 }}
            >
              <Calculator size={14} /> Calculadora de Métricas
            </button>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 20, alignItems: "flex-start" }}>
          {/* Sidebar de proyectos */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 14 }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--muted)", textTransform: "uppercase", marginBottom: 10, padding: "0 4px" }}>
              Proyectos ({projects.length})
            </div>
            {projects.map((p) => {
              const meta = PHASE_META[p.phase];
              const active = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  onClick={() => { setSelectedId(p.id); setTab("resumen"); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left", padding: "10px 12px", borderRadius: 10, marginBottom: 4,
                    background: active ? meta.bg : "transparent", border: active ? `1px solid ${meta.color}55` : "1px solid transparent", cursor: "pointer",
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 700, color: active ? meta.color : "var(--fg)" }}>{p.name}</div>
                  <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 2 }}>{meta.dot} {meta.label}</div>
                </button>
              );
            })}
          </div>

          {/* Panel principal */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <strong style={{ fontSize: 17, color: "var(--fg)" }}>{project.name}</strong>
                <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: 8 }}>{project.code}</span>
              </div>
              <a href={project.href} style={{ fontSize: 12.5, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>Ver ficha completa →</a>
            </div>

            <div style={{ display: "flex", gap: 4, marginBottom: 18, borderBottom: "1px solid var(--border)" }}>
              {([
                ["resumen", "Resumen"], ["m1", "M1 · Semanal"], ["m2", "M2 · Quincenal"], ["m3", "M3 · Mensual"],
              ] as const).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  style={{
                    fontSize: 13, fontWeight: 700, padding: "10px 14px", background: "none", border: "none", cursor: "pointer",
                    color: tab === key ? "var(--dropi)" : "var(--muted)",
                    borderBottom: tab === key ? "2px solid var(--dropi)" : "2px solid transparent", marginBottom: -1,
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "resumen" && <ResumenTab key={project.id} project={project} />}
            {tab === "m1" && <MTab rows={project.m1} onChange={(rows) => updateProject({ m1: rows })} phase="m1" />}
            {tab === "m2" && <MTab rows={project.m2} onChange={(rows) => updateProject({ m2: rows })} phase="m2" />}
            {tab === "m3" && <MTab rows={project.m3} onChange={(rows) => updateProject({ m3: rows })} phase="m3" />}
          </div>
        </div>
      </main>

      {calcOpen && (
        <div onClick={() => setCalcOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.3)", zIndex: 40 }}>
          <div onClick={(e) => e.stopPropagation()}>
            <CalculatorDrawer onClose={() => setCalcOpen(false)} />
          </div>
        </div>
      )}

      <HubFooter />
    </div>
  );
}
