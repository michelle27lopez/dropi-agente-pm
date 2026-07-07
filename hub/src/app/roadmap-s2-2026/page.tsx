"use client";

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN      = "#1A6B52";
const GREEN_BG   = "#E2EFE9";
const AMBER      = "#B45309";
const AMBER_BG   = "#FEF3C7";
const RED        = "#B91C1C";
const RED_BG     = "#FEE2E2";
const SLATE      = "#475569";
const SLATE_BG   = "#F1F5F9";
const QUEUE_COL  = "#6366F1";

// POC phase colors
const RESEARCH_BG  = "#F8FAFC"; const RESEARCH_BD = "#CBD5E1"; const RESEARCH_TX = "#64748B";
const IMPL_BG      = "#EFF6FF"; const IMPL_BD     = "#BFDBFE"; const IMPL_TX     = "#3B82F6";
const EXP_BG       = "#F0FDF4"; const EXP_BD      = "#86EFAC"; const EXP_TX      = "#15803D";

// ─── Day-accurate positions: Jul 1 = 0, Dec 31 = 183, total 184 days ─────────
// n / 184 * 100 = %
// Jul 7  = 6   →  3.26%    Jul 20 = 19  → 10.33%    Jul 21 = 20  → 10.87%
// Jul 28 = 27  → 14.67%    Jul 31 = 30  → 16.30%    Aug 3  = 33  → 17.93%
// Aug 10 = 40  → 21.74%    Aug 18 = 48  → 26.09%    Aug 31 = 61  → 33.15%
// Sep 28 = 89  → 48.37%    Sep 29 = 90  → 48.91%    Sep 30 = 91  → 49.46%
// Oct 10 = 101 → 54.89%    Oct 31 = 122 → 66.30%    Nov 10 = 132 → 71.74%
// Nov 30 = 152 → 82.61%    Dec 22 = 174 → 94.57%

// ─── Types ────────────────────────────────────────────────────────────────────
interface DevProject {
  name: string; code: string;
  devLeft: string; devWidth: string; devEnd: string;
  pmReady?: true; pmReadyLabel?: string;
  queueLeft?: string; queueWidth?: string; queueWeeks?: string;
}

interface Milestone {
  left: string;
  label: string;
  color?: string;
  conditional?: boolean; // adds "?" to label
}

interface TrackSeg {
  left: string; width: string;
  bg: string; border: string; color: string; label: string;
}

interface OpTrack {
  name: string; code: string;
  segments: TrackSeg[];
  milestones?: Milestone[];
}

interface PocProject {
  name: string; code: string; startLabel: string;
  researchLeft: string; researchWidth: string;
  implLeft: string;     implWidth: string;
  expLeft: string;      expWidth: string;
  handoffLeft: string;  handoffDate: string;
}

interface ProjectCard {
  name: string; code: string;
  statusLabel: string; statusColor: string; statusBg: string;
  dev: string; kr: string; note: string;
}

// ─── Dev queue data ───────────────────────────────────────────────────────────
const DEV_QUEUE: DevProject[] = [
  {
    name: "Negociaciones S↔D", code: "NEG-001 / NEG-002",
    devLeft: "3.3%", devWidth: "22.8%", devEnd: "26.1%",
    pmReady: true, pmReadyLabel: "Listo · 7-jul",
  },
  {
    name: "Combos Dropshipper", code: "COM-002",
    devLeft: "26.1%", devWidth: "22.8%", devEnd: "48.9%",
    pmReady: true, pmReadyLabel: "Listo · 7-jul",
    queueLeft: "3.3%", queueWidth: "22.8%", queueWeeks: "~6 sem en cola",
  },
  {
    name: "Descuentos · Antes/Ahora", code: "DESC-001",
    devLeft: "48.9%", devWidth: "22.8%", devEnd: "71.7%",
    pmReady: true, pmReadyLabel: "Listo · 7-jul",
    queueLeft: "3.3%", queueWidth: "45.6%", queueWeeks: "~12 sem en cola",
  },
  {
    name: "Herramienta Campañas", code: "DCA · Campañas",
    devLeft: "71.7%", devWidth: "22.9%", devEnd: "94.6%",
  },
];

// ─── Operational parallel tracks ─────────────────────────────────────────────
const OP_TRACKS: OpTrack[] = [
  {
    name: "Time to Value", code: "TTV-001 · desde 30-jun",
    segments: [{ left: "0%", width: "100%", bg: AMBER_BG, border: AMBER, color: AMBER, label: "Pipeline GHL activo" }],
    milestones: [
      { left: "16.3%",  label: "Cohorte 1",     color: AMBER },
      { left: "33.2%",  label: "Ajuste flujo",   color: AMBER },
      { left: "49.5%",  label: "Meta 20%",        color: AMBER },
      { left: "66.3%",  label: "200 activos",     color: AMBER },
      { left: "82.6%",  label: "620 suppliers",   color: AMBER },
    ],
  },
  {
    name: "Caza Productos", code: "CAZ-001 · Bug crítico",
    segments: [
      { left: "0%",  width: "16%",  bg: RED_BG,   border: RED,       color: RED,   label: "Bug WhatsApp" },
      { left: "16%", width: "84%",  bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "Adopción · apertura países" },
    ],
    milestones: [
      { left: "21.7%", label: "Seguimiento órdenes", color: SLATE },
    ],
  },
  {
    name: "Categorías Catálogo", code: "CAT-001 · Piloto 10 suppliers",
    segments: [{ left: "0%", width: "54%", bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "Piloto comercial → decisión técnica" }],
  },
  {
    name: "Indicadores Proveedores", code: "IND-001 · UserPilot",
    segments: [{ left: "0%", width: "100%", bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "Monitoreo continuo · exp. 3 pasos" }],
    milestones: [
      { left: "10.87%", label: "Levantamiento metas", color: SLATE },
      { left: "49.5%",  label: "Meta verificados",    color: SLATE, conditional: true },
    ],
  },
  {
    name: "NEG · Piloto adopción", code: "NEG-001 · Emilille",
    segments: [{ left: "0%", width: "50%", bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "1 comunidad · 5 neg. meta" }],
    milestones: [
      { left: "10.87%", label: "Carga masiva", color: AMBER },
    ],
  },
  {
    name: "Campañas · Experimento", code: "DCA-001 · manual",
    segments: [{ left: "0%", width: "100%", bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "Experimento manual → insights → TOBE → cola dev" }],
    milestones: [
      { left: "49.5%", label: "Primeros insights", color: GREEN },
      { left: "66.3%", label: "TOBE listo",         color: GREEN },
    ],
  },
];

// ─── POC Experiment data ──────────────────────────────────────────────────────
const POC_PROJECTS: PocProject[] = [
  {
    name: "Dropi Pulso", code: "POC-Pulso · desde 7-jul", startLabel: "7-jul",
    researchLeft: "3.3%",   researchWidth: "7.6%",
    implLeft:     "10.9%",  implWidth:     "3.8%",
    expLeft:      "14.7%",  expWidth:      "33.7%",
    handoffLeft:  "48.4%",  handoffDate:   "sep 28",
  },
  {
    name: "Dropi Activa", code: "POC-Activa · desde 20-jul", startLabel: "20-jul",
    researchLeft: "10.3%",  researchWidth: "7.6%",
    implLeft:     "17.9%",  implWidth:     "3.8%",
    expLeft:      "21.7%",  expWidth:      "33.2%",
    handoffLeft:  "54.9%",  handoffDate:   "oct 10",
  },
];

// ─── Project cards ────────────────────────────────────────────────────────────
const PROJECTS: ProjectCard[] = [
  { name: "Negociaciones Supplier↔Dropshipper", code: "NEG",
    statusLabel: "En dev", statusColor: GREEN, statusBg: GREEN_BG,
    dev: "Jul 7 → Ago 18 · 6 semanas", kr: "KR1.1 · KR1.2 — acorta ciclo comercial",
    note: "Carga masiva 21-jul · nueva arquitectura Ago" },
  { name: "Combos desde Dropshipper", code: "COM-002",
    statusLabel: "Listo PM", statusColor: QUEUE_COL, statusBg: "#EEF2FF",
    dev: "Ago 18 → Sep 29 · 6 semanas", kr: "KR1.1 · KR1.2 — aumenta ticket promedio",
    note: "Handoff 7-jul · ~6 sem en cola de dev" },
  { name: "Descuentos · Precio Antes/Ahora", code: "DESC-001",
    statusLabel: "Listo PM", statusColor: QUEUE_COL, statusBg: "#EEF2FF",
    dev: "Sep 29 → Nov 10 · 6 semanas", kr: "KR1.2 — incentiva GMV vía precio percibido",
    note: "Handoff 7-jul · ~12 sem en cola de dev" },
  { name: "Herramienta Campañas DCA", code: "DCA-Camp.",
    statusLabel: "Cola Q4", statusColor: AMBER, statusBg: AMBER_BG,
    dev: "Nov 10 → Dic 22 · 6 semanas", kr: "KR1.1 · KR1.2 — activa catálogo durmiente",
    note: "Insights del experimento manual S2" },
  { name: "Caza Productos + Búsqueda Semántica", code: "CAZ-001",
    statusLabel: "Bug crítico", statusColor: RED, statusBg: RED_BG,
    dev: "Fix prioritario Jul · luego operativo", kr: "KR1.1 — −68% proveedores · 17% conversión",
    note: "Paralelo · no bloquea cola dev" },
  { name: "Dropi Pulso", code: "POC",
    statusLabel: "POC activo", statusColor: EXP_TX, statusBg: EXP_BG,
    dev: "Exp. Jul-Sep · Handoff TI ¿Sep 28?", kr: "KR1.1 — proveeduría puente, comunidades",
    note: "Condicional si funciona → dev 2027" },
];

// ─── Shared Gantt atoms ───────────────────────────────────────────────────────
function TrackBg() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(6,1fr)", pointerEvents: "none" }}>
      {[0,1,2,3,4,5].map((i) => (
        <div key={i} style={{ borderRight: i < 5 ? "1px solid #F3F4F6" : "none" }} />
      ))}
    </div>
  );
}

function TodayLine() {
  return <div style={{ position: "absolute", left: "2.72%", top: 0, bottom: 0, width: 1.5, background: GREEN, opacity: 0.2, zIndex: 3, pointerEvents: "none" }} />;
}

function RowLabel({ name, code, dimmed }: { name: string; code: string; dimmed?: boolean }) {
  return (
    <div style={{ paddingRight: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: dimmed ? "var(--muted)" : "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
      <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "monospace" }}>{code}</div>
    </div>
  );
}

function MonthRuler({ showQ }: { showQ?: boolean }) {
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", borderBottom: "1px solid var(--border)", paddingBottom: 5, marginBottom: showQ ? 4 : 10 }}>
        {["Jul","Ago","Sep","Oct","Nov","Dic"].map((m) => (
          <div key={m} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textAlign: "center" }}>{m}</div>
        ))}
      </div>
      {showQ && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", marginBottom: 10 }}>
          <div style={{ gridColumn: "1/4", background: GREEN_BG, borderTop: `2px solid ${GREEN}`, padding: "2px 8px" }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: GREEN }}>Q3</span>
          </div>
          <div style={{ gridColumn: "4/7", background: AMBER_BG, borderTop: `2px solid ${AMBER}`, padding: "2px 8px", textAlign: "right" }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: AMBER }}>Q4</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Dev queue row (two-track with PM ready) ──────────────────────────────────
function DevRow({ p }: { p: DevProject }) {
  const hasTwoTracks = !!p.pmReady;
  const rowHeight = hasTwoTracks ? 60 : 44;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", alignItems: "center", minHeight: rowHeight, marginBottom: 5 }}>
      <RowLabel name={p.name} code={p.code} />
      <div style={{ position: "relative", height: rowHeight, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        <TrackBg />
        <TodayLine />
        {hasTwoTracks ? (
          <>
            {/* Track A: PM ready + queue */}
            <div style={{ position: "relative", height: 20, marginBottom: 4 }}>
              <div style={{ position: "absolute", left: "3.3%", top: 0, bottom: 0, width: 2, background: QUEUE_COL, zIndex: 4, borderRadius: 1 }} />
              <div style={{ position: "absolute", left: "3.3%", top: 2, marginLeft: 5, fontSize: 9, fontWeight: 700, color: QUEUE_COL, background: "#EEF2FF", padding: "1px 6px", borderRadius: 3, whiteSpace: "nowrap", zIndex: 5, border: `1px solid ${QUEUE_COL}40` }}>
                {p.pmReadyLabel ?? "Listo PM"}
              </div>
              {p.queueLeft && p.queueWidth && (
                <div style={{ position: "absolute", left: p.queueLeft, width: p.queueWidth, top: "50%", marginTop: -9, height: 18, background: "#F5F3FF", border: `1.5px dashed ${QUEUE_COL}80`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: QUEUE_COL, opacity: 0.9, whiteSpace: "nowrap", overflow: "hidden", zIndex: 1 }}>
                  {p.queueWeeks}
                </div>
              )}
              {p.pmReady && !p.queueLeft && (
                <div style={{ position: "absolute", left: "3.3%", top: "50%", marginTop: -9, marginLeft: 5, fontSize: 9, color: GREEN, fontWeight: 600 }}>entra inmediato →</div>
              )}
            </div>
            {/* Track B: dev bar */}
            <div style={{ position: "relative", height: 24 }}>
              <div style={{ position: "absolute", left: p.devLeft, width: p.devWidth, height: 24, background: GREEN, color: "#fff", display: "flex", alignItems: "center", padding: "0 9px", fontSize: 11, fontWeight: 600, zIndex: 2, whiteSpace: "nowrap" }}>
                {p.name.split("·")[0].trim()}
              </div>
              {[p.devLeft, p.devEnd].map((pos, i) => (
                <div key={i} style={{ position: "absolute", left: pos, marginLeft: -5, width: 10, height: 10, background: GREEN, border: "2px solid var(--card)", transform: "rotate(45deg)", top: "50%", marginTop: -5, zIndex: 4 }} />
              ))}
            </div>
          </>
        ) : (
          <div style={{ position: "relative", height: 28 }}>
            <div style={{ position: "absolute", left: p.devLeft, width: p.devWidth, height: 28, background: GREEN, color: "#fff", display: "flex", alignItems: "center", padding: "0 9px", fontSize: 11, fontWeight: 600, zIndex: 2, whiteSpace: "nowrap" }}>
              {p.name.split("·")[0].trim()}
            </div>
            {[p.devLeft, p.devEnd].map((pos, i) => (
              <div key={i} style={{ position: "absolute", left: pos, marginLeft: -5, width: 10, height: 10, background: GREEN, border: "2px solid var(--card)", transform: "rotate(45deg)", top: "50%", marginTop: -5, zIndex: 4 }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Operational track row (with optional milestone labels below) ──────────────
function OpRow({ t }: { t: OpTrack }) {
  const hasMilestones = !!(t.milestones && t.milestones.length > 0);
  const rowH = hasMilestones ? 68 : 44;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", alignItems: "flex-start", minHeight: rowH, marginBottom: 5 }}>
      <div style={{ paddingRight: 14, paddingTop: hasMilestones ? 10 : 0, alignSelf: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
        <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "monospace" }}>{t.code}</div>
      </div>
      <div style={{ position: "relative", height: rowH }}>
        <TrackBg />
        <div style={{ position: "absolute", left: "2.72%", top: 0, bottom: 0, width: 1.5, background: GREEN, opacity: 0.2, zIndex: 3, pointerEvents: "none" }} />
        {/* bar segments */}
        {t.segments.map((seg, si) => (
          <div key={si} style={{ position: "absolute", top: 10, left: seg.left, width: seg.width, height: 26, background: seg.bg, border: `1px solid ${seg.border}`, display: "flex", alignItems: "center", padding: "0 8px", fontSize: 11, color: seg.color, fontWeight: 600, zIndex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {seg.label}
          </div>
        ))}
        {/* milestones */}
        {t.milestones?.map((m, mi) => (
          <div key={mi}>
            {/* diamond */}
            <div style={{ position: "absolute", left: m.left, marginLeft: -5, width: 10, height: 10, background: m.color ?? GREEN, border: "2px solid var(--card)", transform: "rotate(45deg)", top: 18, zIndex: 4 }} />
            {/* label below */}
            <div style={{ position: "absolute", left: m.left, top: 36, transform: "translateX(-50%)", fontSize: 9, fontWeight: 700, color: m.color ?? GREEN, whiteSpace: "nowrap", textAlign: "center", zIndex: 3 }}>
              {m.label}{m.conditional ? " ?" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── POC experiment row (3-phase bar) ─────────────────────────────────────────
function PocRow({ p }: { p: PocProject }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", alignItems: "center", minHeight: 52, marginBottom: 5 }}>
      <RowLabel name={p.name} code={p.code} />
      <div style={{ position: "relative", height: 52, display: "flex", alignItems: "center" }}>
        <TrackBg />
        <TodayLine />
        {/* Research */}
        <div style={{ position: "absolute", left: p.researchLeft, width: p.researchWidth, height: 26, background: RESEARCH_BG, border: `1px solid ${RESEARCH_BD}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: RESEARCH_TX, zIndex: 1, whiteSpace: "nowrap" }}>
          Research
        </div>
        {/* Impl */}
        <div style={{ position: "absolute", left: p.implLeft, width: p.implWidth, height: 26, background: IMPL_BG, border: `1px solid ${IMPL_BD}`, borderLeft: "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: IMPL_TX, zIndex: 1, overflow: "hidden" }}>
          {parseFloat(p.implWidth) > 4 ? "Impl" : ""}
        </div>
        {/* Experiment */}
        <div style={{ position: "absolute", left: p.expLeft, width: p.expWidth, height: 26, background: EXP_BG, border: `1px solid ${EXP_BD}`, borderLeft: "none", display: "flex", alignItems: "center", padding: "0 8px", fontSize: 11, fontWeight: 600, color: EXP_TX, zIndex: 1, whiteSpace: "nowrap", overflow: "hidden" }}>
          Experimento operativo
        </div>
        {/* Handoff TI? diamond + label */}
        <div style={{ position: "absolute", left: p.handoffLeft, marginLeft: -5, width: 10, height: 10, background: AMBER, border: "2px solid var(--card)", transform: "rotate(45deg)", top: "50%", marginTop: -5, zIndex: 4 }} />
        <div style={{ position: "absolute", left: p.handoffLeft, top: "50%", marginTop: 8, marginLeft: -30, fontSize: 9, fontWeight: 700, color: AMBER, whiteSpace: "nowrap", zIndex: 3 }}>
          Handoff TI ? · {p.handoffDate}
        </div>
        {/* Start marker */}
        <div style={{ position: "absolute", left: p.researchLeft, marginLeft: -5, width: 10, height: 10, background: RESEARCH_TX, border: "2px solid var(--card)", transform: "rotate(45deg)", top: "50%", marginTop: -5, zIndex: 4 }} />
      </div>
    </div>
  );
}

// ─── Subsection header ────────────────────────────────────────────────────────
function SubHead({ title, note }: { title: string; note?: string }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", marginBottom: 8, marginTop: 16 }}>
      <div />
      <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px dashed var(--border)", paddingBottom: 5 }}>
        <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>{title}</span>
        {note && <span style={{ fontSize: 10, color: "var(--muted)" }}>{note}</span>}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapS2Page() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>

      <header style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "16px 32px", display: "flex", alignItems: "center", gap: 16 }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Roadmap S2 2026</span>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: GREEN_BG, color: GREEN, padding: "3px 9px", borderRadius: 20 }}>Supplier Success</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#EEF2FF", color: "#6366F1", padding: "3px 9px", borderRadius: 20 }}>S2 2026</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: AMBER_BG, color: AMBER, padding: "3px 9px", borderRadius: 20 }}>Jul → Dic 2026</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", marginBottom: 6 }}>Roadmap S2 2026</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 640 }}>
            Cola de desarrollo + frentes operativos + experimentos POC. 1 dev (Giancarlos) · ~6 sem/proyecto · handoff secuencial.
          </p>
        </div>

        {/* KR strip */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden", marginBottom: 36 }}>
          {[
            { label: "KR 1.1 · Volumen", value: "93.6M", sub: "órdenes anuales · 7.8M / mes" },
            { label: "KR 1.2 · GMV",     value: "$3.74B", sub: "COP · meta anual" },
          ].map((kr) => (
            <div key={kr.label} style={{ background: "var(--card)", padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>{kr.label}</div>
              <div style={{ fontSize: 30, fontWeight: 800, color: GREEN, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", lineHeight: 1 }}>{kr.value}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{kr.sub}</div>
            </div>
          ))}
        </div>

        {/* ══ GANTT 1: Cola de desarrollo ══ */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>Cola de desarrollo</p>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px 20px", marginBottom: 24, overflowX: "auto" }}>
          <div style={{ minWidth: 580 }}>
            <div style={{ display: "grid", gridTemplateColumns: "192px 1fr" }}><div /><MonthRuler showQ /></div>
            {DEV_QUEUE.map((p) => <DevRow key={p.code} p={p} />)}
            {/* Dropi Pulso aspiracional */}
            <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", alignItems: "center", minHeight: 44, marginBottom: 5 }}>
              <RowLabel name="Dropi Pulso" code="Aspiracional · 2027" dimmed />
              <div style={{ position: "relative", height: 44, display: "flex", alignItems: "center" }}>
                <TrackBg />
                <div style={{ position: "absolute", left: "86.9%", width: "11%", height: 26, border: "1.5px dashed var(--border)", background: "transparent", display: "flex", alignItems: "center", padding: "0 9px", fontSize: 11, color: "var(--muted)", zIndex: 1 }}>Piloto</div>
              </div>
            </div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {[
                { el: <div style={{ width: 18, height: 11, background: GREEN }} />, label: "Desarrollo activo" },
                { el: <div style={{ width: 18, height: 14, background: "#F5F3FF", border: `1.5px dashed ${QUEUE_COL}80` }} />, label: "En cola TI" },
                { el: <div style={{ width: 2, height: 14, background: QUEUE_COL, borderRadius: 1 }} />, label: "Handoff PM → TI" },
                { el: <div style={{ width: 10, height: 10, background: GREEN, transform: "rotate(45deg)" }} />, label: "Hito" },
                { el: <div style={{ width: 1.5, height: 14, background: GREEN, opacity: 0.4 }} />, label: "Hoy" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: "var(--muted)" }}>
                  <div style={{ flexShrink: 0 }}>{l.el}</div>{l.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ══ GANTT 2: Frentes paralelos + POC ══ */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>Frentes paralelos</p>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px 24px", marginBottom: 32, overflowX: "auto" }}>
          <div style={{ minWidth: 580 }}>
            <div style={{ display: "grid", gridTemplateColumns: "192px 1fr" }}><div /><MonthRuler /></div>

            <SubHead title="Seguimiento operativo" />
            {OP_TRACKS.map((t) => <OpRow key={t.code} t={t} />)}

            <SubHead title="Experimentos POC" note="Research 2s · Impl 1s · Experimento operativo · Handoff TI si funciona" />
            {POC_PROJECTS.map((p) => <PocRow key={p.code} p={p} />)}

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {[
                { bg: AMBER_BG,    border: AMBER,       label: "Operacional" },
                { bg: SLATE_BG,    border: "#CBD5E1",   label: "Frente paralelo" },
                { bg: RED_BG,      border: RED,          label: "Crítico" },
                { bg: RESEARCH_BG, border: RESEARCH_BD, label: "Research" },
                { bg: IMPL_BG,     border: IMPL_BD,     label: "Implementación" },
                { bg: EXP_BG,      border: EXP_BD,      label: "Experimento" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--muted)" }}>
                  <div style={{ width: 16, height: 10, background: l.bg, border: `1px solid ${l.border}`, flexShrink: 0 }} />{l.label}
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--muted)" }}>
                <div style={{ width: 10, height: 10, background: AMBER, transform: "rotate(45deg)", flexShrink: 0 }} />
                Handoff TI (condicional)
              </div>
            </div>
          </div>
        </div>

        {/* ══ Project cards ══ */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>Proyectos</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 12, marginBottom: 32 }}>
          {PROJECTS.map((p) => (
            <div key={p.code} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--muted)", background: "var(--bg)", padding: "2px 7px", whiteSpace: "nowrap", borderRadius: 4, flexShrink: 0 }}>{p.code}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { k: "Estado", v: <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, background: p.statusBg, color: p.statusColor }}>{p.statusLabel}</span> },
                  { k: "Dev",  v: p.dev },
                  { k: "KR",   v: p.kr },
                  { k: "Nota", v: p.note },
                ].map((row) => (
                  <div key={row.k} style={{ display: "flex", alignItems: "baseline", gap: 8, fontSize: 12 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--muted)", width: 44, flexShrink: 0 }}>{row.k}</span>
                    <span style={{ color: "var(--muted)" }}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ══ Quarter KPIs ══ */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>KPI por trimestre</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>Q3 · Jul – Sep</div>
            {["Activación de proveedores · TTV en operación", "Destrabar regulación que trunca activación", "NEG completo · COM-002 entregado", "Experimentos Pulso + Activa en curso"].map((item) => (
              <div key={item} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 7, lineHeight: 1.4 }}>
                <div style={{ width: 6, height: 6, background: GREEN, flexShrink: 0, marginTop: 5 }} />{item}
              </div>
            ))}
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderLeft: `3px solid ${AMBER}`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: AMBER, marginBottom: 14 }}>Q4 · Oct – Dic</div>
            {["Por definir — sale del wonder del Product Backlog", "DESC-001 + DCA Campañas entregados", "Handoff TI experimentos (si resultados positivos)", "Cronograma se planifica al cierre de Q3"].map((item) => (
              <div key={item} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 7, lineHeight: 1.4 }}>
                <div style={{ width: 6, height: 6, background: AMBER, flexShrink: 0, marginTop: 5 }} />{item}
              </div>
            ))}
          </div>
        </div>

        {/* ══ Constraints ══ */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Supuestos y restricciones</div>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.75 }}>
            1 dev (Giancarlos) · capacidad secuencial · ~6 sem/proyecto. Cola: NEG → COM-002 → DESC-001 → DCA Campañas.<br />
            Experimentos POC (Pulso + Activa) no ocupan slot de dev — son construction from product side. Si funcionan → handoff TI condicional.<br />
            Dropi Pulso en cola de dev 2027 salvo capacidad extraordinaria en Dic.
          </p>
        </div>

      </div>
    </main>
  );
}
