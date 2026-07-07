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
const RESEARCH_BG = "#F8FAFC"; const RESEARCH_BD = "#CBD5E1"; const RESEARCH_TX = "#64748B";
const EXP_BG      = "#F0FDF4"; const EXP_BD      = "#86EFAC"; const EXP_TX      = "#15803D";

// ─── 6-month scale (S2 2026): Jul 1=day 0, Dec 31=day 183, total 184d ──────────
// Jul 7=3.3%  Jul 21=10.9%  Jul 28=14.7%  Aug 18=26.1%  Aug 31=33.2%
// Sep 30=49.5%  Oct 31=66.3%  Nov 30=82.6%  Dec 22=94.6%
// ─── 12-month scale (S2+H1): Jul 1 2026=day 0, Jun 30 2027=day 364, total 365d ─
// Jul 7=1.6%  Jul 28=7.4%  Aug 18=13.2%  Sep 29=24.7%
// Nov 10=36.2%  Dec 22=47.7%  Jan 1=50.4%  Feb 2=59.2%

// ─── Types ────────────────────────────────────────────────────────────────────
interface DevProject {
  name: string; code: string;
  devLeft?: string; devWidth?: string; devEnd?: string; endLabel?: string;
  pmReady?: true; pmReadyLabel?: string;
  queueLeft?: string; queueWidth?: string; queueWeeks?: string;
}

interface Milestone {
  left: string; label: string; color?: string; conditional?: boolean;
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
  name: string; code: string;
  researchLeft: string; researchWidth: string;
  expLeft: string;      expWidth: string;
  handoffLeft: string;  handoffDate: string;
}

interface ProjectCard {
  name: string; code: string;
  statusLabel: string; statusColor: string; statusBg: string;
  dev: string; kr: string; note: string;
}

// ─── Dev queue  (12-month scale: Jul 2026 → Jun 2027, 365 days) ──────────────
const DEV_QUEUE: DevProject[] = [
  {
    name: "Negociaciones S↔D", code: "NEG-001 / NEG-002",
    devLeft: "1.6%", devWidth: "11.6%", devEnd: "13.2%", endLabel: "18-ago",
    pmReady: true, pmReadyLabel: "Listo · 7-jul",
  },
  {
    name: "Combos Dropshipper", code: "COM-002",
    devLeft: "13.2%", devWidth: "11.5%", devEnd: "24.7%", endLabel: "29-sep",
    pmReady: true, pmReadyLabel: "Listo · 7-jul",
    queueLeft: "1.6%", queueWidth: "11.6%", queueWeeks: "~6 sem en cola",
  },
  {
    name: "Descuentos · Antes/Ahora", code: "DESC-001",
    devLeft: "24.7%", devWidth: "11.5%", devEnd: "36.2%", endLabel: "10-nov",
    pmReady: true, pmReadyLabel: "Listo · 7-jul",
    queueLeft: "1.6%", queueWidth: "23.1%", queueWeeks: "~12 sem en cola",
  },
  {
    name: "Herramienta Campañas", code: "DCA · Campañas",
    devLeft: "36.2%", devWidth: "11.5%", devEnd: "47.7%", endLabel: "22-dic",
    pmReady: true, pmReadyLabel: "Listo · ~oct 31",
    queueLeft: "33.4%", queueWidth: "2.8%", queueWeeks: "~10d",
  },
  {
    name: "Categorización Catálogo", code: "CAT-001",
    devLeft: "47.7%", devWidth: "11.5%", devEnd: "59.2%", endLabel: "~feb 2027",
    pmReady: true, pmReadyLabel: "Listo · ~28-jul",
    queueLeft: "7.4%", queueWidth: "40.3%", queueWeeks: "~22 sem en cola",
  },
];

// ─── Operational parallel tracks ─────────────────────────────────────────────
const OP_TRACKS: OpTrack[] = [
  {
    name: "Time to Value", code: "TTV-001 · desde 30-jun",
    segments: [{ left: "0%", width: "100%", bg: AMBER_BG, border: AMBER, color: AMBER, label: "Pipeline GHL activo" }],
    // Cortes mensuales — acumulado de suppliers "listos"
    milestones: [
      { left: "33.2%", label: "C1 · 104",  color: AMBER },
      { left: "49.5%", label: "C2 · 207",  color: AMBER },
      { left: "66.3%", label: "C3 · 310",  color: AMBER },
      { left: "82.6%", label: "C4 · 517",  color: AMBER },
      { left: "99.5%", label: "C5 · 620",  color: AMBER },
    ],
  },
  {
    name: "Caza Productos", code: "CAZ-001 · Bug crítico",
    segments: [
      { left: "0%",  width: "16%",  bg: RED_BG,   border: RED,       color: RED,   label: "Bug WhatsApp" },
      { left: "16%", width: "84%",  bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "Adopción · apertura países · seguimiento órdenes" },
    ],
    milestones: [
      { left: "16.8%", label: "Apertura países",      color: SLATE },
      { left: "33.2%", label: "Def. metas × órdenes", color: SLATE },
    ],
  },
  {
    name: "Categorías Catálogo", code: "CAT-001 · Piloto usuarios",
    segments: [
      { left: "0%",    width: "14.7%", bg: SLATE_BG, border: "#CBD5E1", color: SLATE,    label: "Discovery + Piloto usuarios" },
      { left: "14.7%", width: "85.3%", bg: "#FAFAFA", border: "#E5E7EB", color: "#9CA3AF", label: "Seguimiento · pendiente slot dev (→ 2027)" },
    ],
    milestones: [
      { left: "14.7%", label: "Listo handoff", color: GREEN },
    ],
  },
  {
    name: "Indicadores Proveedores", code: "IND-001 · UserPilot",
    segments: [{ left: "0%", width: "100%", bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "Discovery metas saludables + Dashboard Comercial + seguimiento pipeline" }],
    milestones: [
      { left: "10.9%", label: "Levantamiento",   color: SLATE },
      { left: "49.5%", label: "Dashboard listo",  color: SLATE },
      { left: "66.3%", label: "Meta verificados", color: SLATE, conditional: true },
    ],
  },
  {
    name: "NEG · Piloto adopción", code: "NEG-001 · Emilille",
    segments: [{ left: "0%", width: "50%", bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "1 comunidad · 5 neg. meta" }],
    milestones: [
      { left: "10.9%", label: "Carga masiva", color: AMBER },
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

// ─── POC experiments (Research 2s → Experimento 2m → Handoff TI ?) ───────────
const POC_PROJECTS: PocProject[] = [
  {
    name: "Dropi Pulso", code: "POC-Pulso · desde 7-jul",
    researchLeft: "3.3%",  researchWidth: "7.6%",
    expLeft:      "10.9%", expWidth:      "37.5%",   // Jul 21 → Sep 28
    handoffLeft:  "48.4%", handoffDate:   "sep 28",
  },
  {
    name: "Dropi Activa", code: "POC-Activa · desde 20-jul",
    researchLeft: "10.3%", researchWidth: "7.6%",
    expLeft:      "17.9%", expWidth:      "37.0%",   // Aug 3 → Oct 10
    handoffLeft:  "54.9%", handoffDate:   "oct 10",
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
  { name: "Categorización Catálogo", code: "CAT-001",
    statusLabel: "Listo PM", statusColor: QUEUE_COL, statusBg: "#EEF2FF",
    dev: "Dev 2027 — cola llena S2", kr: "KR1.1 — calidad y conversión de catálogo",
    note: "Handoff listo ~28-jul · ~22 sem en cola" },
  { name: "Caza Productos + Búsqueda", code: "CAZ-001",
    statusLabel: "Bug crítico", statusColor: RED, statusBg: RED_BG,
    dev: "Fix Jul · Apertura países Ago", kr: "KR1.1 — −68% proveedores · 17% conversión",
    note: "Paralelo · no bloquea cola dev" },
];

// ─── Gantt atoms ──────────────────────────────────────────────────────────────
function TrackBg() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(6,1fr)", pointerEvents: "none" }}>
      {[0,1,2,3,4,5].map((i) => (
        <div key={i} style={{ borderRight: i < 5 ? "1px solid #F3F4F6" : "none" }} />
      ))}
    </div>
  );
}
// 12-col background (S2 2026 | H1 2027). Bold divider at col 6 (Jan boundary).
function TrackBg12() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(12,1fr)", pointerEvents: "none" }}>
      {Array.from({ length: 12 }, (_, i) => (
        <div key={i} style={{ borderRight: i === 5 ? "1.5px solid #D1D5DB" : i < 11 ? "1px solid #F3F4F6" : "none" }} />
      ))}
    </div>
  );
}
function TodayLine({ pos = "3.3%" }: { pos?: string }) {
  return <div style={{ position: "absolute", left: pos, top: 0, bottom: 0, width: 1.5, background: GREEN, opacity: 0.2, zIndex: 3, pointerEvents: "none" }} />;
}
// 12-month ruler with quarterly bands (Jul 2026 → Jun 2027)
function MonthRuler12() {
  const months = ["Jul","Ago","Sep","Oct","Nov","Dic","Ene","Feb","Mar","Abr","May","Jun"];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", marginBottom: 4 }}>
        {[
          { label: "Q3 2026", col: "1/4", color: GREEN,  bg: GREEN_BG  },
          { label: "Q4 2026", col: "4/7", color: AMBER,  bg: AMBER_BG  },
          { label: "Q1 2027", col: "7/10", color: QUEUE_COL, bg: "#EEF2FF" },
          { label: "Q2 2027", col: "10/13", color: SLATE, bg: SLATE_BG  },
        ].map((q) => (
          <div key={q.label} style={{ gridColumn: q.col, background: q.bg, borderTop: `2px solid ${q.color}`, padding: "2px 6px" }}>
            <span style={{ fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: q.color }}>{q.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(12,1fr)", borderBottom: "1px solid var(--border)", paddingBottom: 5, marginBottom: 10 }}>
        {months.map((m, i) => (
          <div key={i} style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase" as const, color: i >= 6 ? QUEUE_COL : "var(--muted)", textAlign: "center" }}>{m}</div>
        ))}
      </div>
    </div>
  );
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

// ─── Dev queue row (12-month scale: today = 1.6%) ────────────────────────────
function DevRow({ p }: { p: DevProject }) {
  const hasTwoTracks = !!p.pmReady;
  // Track A (24px) + gap (4px) + Track B (24px) + endLabel (14px) = 66px with two tracks
  // Single track: Track B (28px) + endLabel (14px) = 46px
  const rowH = hasTwoTracks ? (p.endLabel ? 70 : 54) : (p.endLabel ? 50 : 44);
  // Track B vertical top position (absolute within rowH container)
  const barTop = hasTwoTracks ? 28 : 8;
  const barH = 24;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", alignItems: "center", minHeight: rowH, marginBottom: 5 }}>
      <RowLabel name={p.name} code={p.code} />
      <div style={{ position: "relative", height: rowH }}>
        <TrackBg12 />
        <TodayLine pos="1.6%" />

        {/* Track A — PM ready chip + queue wait bar */}
        {hasTwoTracks && (
          <>
            <div style={{ position: "absolute", left: p.queueLeft ?? "1.6%", top: 0, bottom: 0, width: 2, background: QUEUE_COL, zIndex: 4, borderRadius: 1 }} />
            <div style={{ position: "absolute", left: p.queueLeft ?? "1.6%", top: 3, marginLeft: 5, fontSize: 9, fontWeight: 700, color: QUEUE_COL, background: "#EEF2FF", padding: "1px 6px", borderRadius: 3, whiteSpace: "nowrap", zIndex: 5, border: `1px solid ${QUEUE_COL}40` }}>
              {p.pmReadyLabel ?? "Listo PM"}
            </div>
            {p.queueLeft && p.queueWidth ? (
              <div style={{ position: "absolute", left: p.queueLeft, width: p.queueWidth, top: 3, height: 18, background: "#F5F3FF", border: `1.5px dashed ${QUEUE_COL}80`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: QUEUE_COL, whiteSpace: "nowrap", overflow: "hidden", zIndex: 1 }}>
                {p.queueWeeks}
              </div>
            ) : (
              <div style={{ position: "absolute", left: "1.6%", top: 10, marginLeft: 5, fontSize: 9, color: GREEN, fontWeight: 600 }}>entra inmediato →</div>
            )}
          </>
        )}

        {/* Track B — dev bar */}
        {p.devLeft && (
          <>
            <div style={{ position: "absolute", left: p.devLeft, width: p.devWidth, top: barTop, height: barH, background: GREEN, color: "#fff", display: "flex", alignItems: "center", padding: "0 9px", fontSize: 11, fontWeight: 600, zIndex: 2, whiteSpace: "nowrap", overflow: "hidden" }}>
              {p.name.split("·")[0].trim()}
            </div>
            {[p.devLeft, p.devEnd!].map((pos, i) => (
              <div key={i} style={{ position: "absolute", left: pos, marginLeft: -5, width: 10, height: 10, background: GREEN, border: "2px solid var(--card)", transform: "rotate(45deg)", top: barTop + barH / 2 - 5, zIndex: 4 }} />
            ))}
            {p.endLabel && (
              <div style={{ position: "absolute", left: p.devEnd, top: barTop + barH + 3, marginLeft: -20, fontSize: 9, fontWeight: 700, color: GREEN, whiteSpace: "nowrap", zIndex: 3 }}>
                ✓ {p.endLabel}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Operational track row ────────────────────────────────────────────────────
function OpRow({ t }: { t: OpTrack }) {
  const hasMilestones = !!(t.milestones?.length);
  const rowH = hasMilestones ? 70 : 44;
  return (
    <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", alignItems: "flex-start", minHeight: rowH, marginBottom: 5 }}>
      <div style={{ paddingRight: 14, paddingTop: hasMilestones ? 10 : 0, alignSelf: "center" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
        <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "monospace" }}>{t.code}</div>
      </div>
      <div style={{ position: "relative", height: rowH }}>
        <TrackBg />
        <div style={{ position: "absolute", left: "2.72%", top: 0, bottom: 0, width: 1.5, background: GREEN, opacity: 0.2, zIndex: 3, pointerEvents: "none" }} />
        {t.segments.map((seg, si) => (
          <div key={si} style={{ position: "absolute", top: 10, left: seg.left, width: seg.width, height: 26, background: seg.bg, border: `1px solid ${seg.border}`, display: "flex", alignItems: "center", padding: "0 8px", fontSize: 11, color: seg.color, fontWeight: 600, zIndex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {seg.label}
          </div>
        ))}
        {t.milestones?.map((m, mi) => (
          <div key={mi}>
            <div style={{ position: "absolute", left: m.left, marginLeft: -5, width: 10, height: 10, background: m.color ?? GREEN, border: "2px solid var(--card)", transform: "rotate(45deg)", top: 18, zIndex: 4 }} />
            <div style={{ position: "absolute", left: m.left, top: 37, transform: "translateX(-50%)", fontSize: 9, fontWeight: 700, color: m.color ?? GREEN, whiteSpace: "nowrap", zIndex: 3 }}>
              {m.label}{m.conditional ? " ?" : ""}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── POC experiment row (Research + Experiment operativo) ─────────────────────
function PocRow({ p }: { p: PocProject }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", alignItems: "center", minHeight: 52, marginBottom: 5 }}>
      <RowLabel name={p.name} code={p.code} />
      <div style={{ position: "relative", height: 52, display: "flex", alignItems: "center" }}>
        <TrackBg />
        <TodayLine />
        {/* Research segment */}
        <div style={{ position: "absolute", left: p.researchLeft, width: p.researchWidth, height: 26, background: RESEARCH_BG, border: `1px solid ${RESEARCH_BD}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, color: RESEARCH_TX, zIndex: 1 }}>
          Research 2s
        </div>
        {/* Experiment segment */}
        <div style={{ position: "absolute", left: p.expLeft, width: p.expWidth, height: 26, background: EXP_BG, border: `1px solid ${EXP_BD}`, borderLeft: "none", display: "flex", alignItems: "center", padding: "0 8px", fontSize: 11, fontWeight: 600, color: EXP_TX, zIndex: 1, overflow: "hidden", whiteSpace: "nowrap" }}>
          Experimento operativo
        </div>
        {/* Start marker */}
        <div style={{ position: "absolute", left: p.researchLeft, marginLeft: -5, width: 10, height: 10, background: RESEARCH_TX, border: "2px solid var(--card)", transform: "rotate(45deg)", top: "50%", marginTop: -5, zIndex: 4 }} />
        {/* Handoff TI? */}
        <div style={{ position: "absolute", left: p.handoffLeft, marginLeft: -5, width: 10, height: 10, background: AMBER, border: "2px solid var(--card)", transform: "rotate(45deg)", top: "50%", marginTop: -5, zIndex: 4 }} />
        <div style={{ position: "absolute", left: p.handoffLeft, top: "50%", marginTop: 8, marginLeft: -32, fontSize: 9, fontWeight: 700, color: AMBER, whiteSpace: "nowrap", zIndex: 3 }}>
          Handoff TI ? · {p.handoffDate}
        </div>
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
            <span style={{ fontSize: 11, fontWeight: 700, background: GREEN_BG,   color: GREEN,    padding: "3px 9px", borderRadius: 20 }}>Supplier Success</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#EEF2FF", color: "#6366F1", padding: "3px 9px", borderRadius: 20 }}>S2 2026</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: AMBER_BG,  color: AMBER,    padding: "3px 9px", borderRadius: 20 }}>Jul → Dic 2026</span>
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

        {/* ══ Proyección S2 · Iniciativas activas ══ */}
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          {/* Header row */}
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 18, flexWrap: "wrap", gap: 8 }}>
            <div>
              <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)" }}>Proyección S2 · Iniciativas activas</span>
              <span style={{ fontSize: 10, color: "var(--muted)", marginLeft: 10 }}>datos semana 03 jul 2026</span>
            </div>
            <div style={{ display: "flex", gap: 20 }}>
              {[
                { label: "Base actual", value: "38.4M", color: "var(--muted)" },
                { label: "Brecha a cerrar", value: "55.2M", color: RED },
                { label: "Próximo hito", value: "21-jul · carga masiva NEG-001", color: AMBER },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>{s.label}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.color, fontVariantNumeric: "tabular-nums" }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Per-project bars */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { code: "TTV-001",       name: "Time to Value",        orders: 105000, label: "~105K",  sub: "620 suppliers activos · USD 1.57M GMV",    color: AMBER,      pct: 70 },
              { code: "DCA · Campañas", name: "Campañas Catálogo",   orders: 149300, label: "149.3K", sub: "Cyber Days + DCA-001 · USD 2.24M GMV est.", color: QUEUE_COL,  pct: 100 },
              { code: "CAZ-001",       name: "Caza Productos",       orders:  54000, label: "~54K",   sub: "Búsqueda semántica activa",                 color: SLATE,      pct: 36 },
            ].map((p) => (
              <div key={p.code} style={{ display: "grid", gridTemplateColumns: "130px 1fr 70px 260px", alignItems: "center", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--fg)" }}>{p.name}</div>
                  <div style={{ fontSize: 10, fontFamily: "monospace", color: "var(--muted)" }}>{p.code}</div>
                </div>
                <div style={{ height: 8, background: "var(--bg)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${p.pct}%`, background: p.color, borderRadius: 99, transition: "width 0.4s" }} />
                </div>
                <div style={{ fontSize: 14, fontWeight: 800, color: p.color, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>{p.label}</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>{p.sub}</div>
              </div>
            ))}
            {/* Total */}
            <div style={{ display: "grid", gridTemplateColumns: "130px 1fr 70px 260px", alignItems: "center", gap: 12, borderTop: "1px solid var(--border)", paddingTop: 10, marginTop: 2 }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)" }}>Total proyectado</div>
              <div />
              <div style={{ fontSize: 16, fontWeight: 800, color: GREEN, fontVariantNumeric: "tabular-nums", textAlign: "right" }}>308.3K</div>
              <div style={{ fontSize: 10, color: "var(--muted)" }}>órdenes/año adicionales · proyección sumada de iniciativas S2</div>
            </div>
          </div>
        </div>

        {/* ══ GANTT 1: Cola de desarrollo ══ */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>Cola de desarrollo</p>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px 20px", marginBottom: 24, overflowX: "auto" }}>
          <div style={{ minWidth: 580 }}>
            <div style={{ display: "grid", gridTemplateColumns: "192px 1fr" }}><div /><MonthRuler12 /></div>
            {DEV_QUEUE.map((p) => <DevRow key={p.code} p={p} />)}
            {/* Legend */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {[
                { el: <div style={{ width: 18, height: 11, background: GREEN }} />, label: "Desarrollo activo" },
                { el: <div style={{ width: 18, height: 14, background: "#F5F3FF", border: `1.5px dashed ${QUEUE_COL}80` }} />, label: "En cola TI (listo PM, sin slot)" },
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

            <SubHead title="Experimentos POC" note="Research 2s → Experimento 2m → Handoff TI si funciona" />
            {POC_PROJECTS.map((p) => <PocRow key={p.code} p={p} />)}

            {/* Legend */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 16, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {[
                { bg: AMBER_BG,    border: AMBER,      label: "Operacional" },
                { bg: SLATE_BG,    border: "#CBD5E1",  label: "Frente paralelo" },
                { bg: RED_BG,      border: RED,         label: "Crítico" },
                { bg: RESEARCH_BG, border: RESEARCH_BD, label: "Research POC" },
                { bg: EXP_BG,      border: EXP_BD,      label: "Experimento POC" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--muted)" }}>
                  <div style={{ width: 16, height: 10, background: l.bg, border: `1px solid ${l.border}`, flexShrink: 0 }} />{l.label}
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 10, color: "var(--muted)" }}>
                <div style={{ width: 10, height: 10, background: AMBER, transform: "rotate(45deg)", flexShrink: 0 }} />Handoff TI (condicional)
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
                  { k: "Estado", v: <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase" as const, padding: "2px 7px", borderRadius: 4, background: p.statusBg, color: p.statusColor }}>{p.statusLabel}</span> },
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
            {["Activación de proveedores · TTV en operación", "Destrabar regulación que trunca activación", "NEG completo · COM-002 entregado", "Experimentos Pulso + Activa en curso · C3 TTV: 310 listos"].map((item) => (
              <div key={item} style={{ display: "flex", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 7, lineHeight: 1.4 }}>
                <div style={{ width: 6, height: 6, background: GREEN, flexShrink: 0, marginTop: 5 }} />{item}
              </div>
            ))}
          </div>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderLeft: `3px solid ${AMBER}`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: AMBER, marginBottom: 14 }}>Q4 · Oct – Dic</div>
            {["Por definir — sale del wonder del Product Backlog", "DESC-001 + DCA Campañas entregados", "Handoff TI experimentos (si resultados positivos)", "C5 TTV: meta 620 suppliers listos"].map((item) => (
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
            1 dev (Giancarlos) · capacidad secuencial · ~6 sem/proyecto. Cola confirmada: NEG → COM-002 → DESC-001 → DCA Campañas.<br />
            CAT-001 listo para handoff ~Jul 28 — sin slot disponible en S2 (primera oportunidad: 2027).<br />
            Experimentos POC (Pulso + Activa): construcción desde producto, sin slot de dev formal. Handoff a TI es condicional a resultados.
          </p>
        </div>

      </div>
    </main>
  );
}
