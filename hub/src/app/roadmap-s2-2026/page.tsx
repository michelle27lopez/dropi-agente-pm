"use client";

// ─── Palette ──────────────────────────────────────────────────────────────────
const GREEN = "#1A6B52";
const GREEN_BG = "#E2EFE9";
const AMBER = "#B45309";
const AMBER_BG = "#FEF3C7";
const RED = "#B91C1C";
const RED_BG = "#FEE2E2";
const SLATE = "#475569";
const SLATE_BG = "#F1F5F9";

// ─── Day-accurate Gantt math: Jul 1 → Dec 31 = 184 days ──────────────────────
// pct(n) = (n / 184) * 100  where n = days since Jul 1 (Jul 1 = 0)
// Jul 6  (today) = 5  →  2.72%
// Jul 7  (start) = 6  →  3.26%
// Jul 21 (NEG carga masiva) = 20 → 10.87%
// Aug 18 = 48  → 26.09%
// Sep 29 = 90  → 48.91%
// Nov 10 = 132 → 71.74%
// Dec 22 = 174 → 94.57%

// ─── Types ────────────────────────────────────────────────────────────────────
interface DevProject {
  name: string;
  code: string;
  left: string;
  width: string;
  endLeft: string;
}

interface ParallelTrack {
  name: string;
  code: string;
  segments: { left: string; width: string; color: string; bg: string; border: string; label: string }[];
  milestone?: { left: string; color: string; title: string };
}

interface ProjectCard {
  name: string;
  code: string;
  statusLabel: string;
  statusColor: string;
  statusBg: string;
  dev: string;
  kr: string;
  note: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const DEV_QUEUE: DevProject[] = [
  { name: "Negociaciones S↔D",   code: "NEG-001 / NEG-002", left: "3.3%",  width: "22.8%", endLeft: "26.1%" },
  { name: "Combos Dropshipper",  code: "COM-002",            left: "26.1%", width: "22.8%", endLeft: "48.9%" },
  { name: "Descuentos · Antes/Ahora", code: "DESC-001",     left: "48.9%", width: "22.8%", endLeft: "71.7%" },
  { name: "Herramienta Campañas", code: "DCA · Campañas",   left: "71.7%", width: "22.9%", endLeft: "94.6%" },
];

const PARALLEL_TRACKS: ParallelTrack[] = [
  {
    name: "Time to Value", code: "TTV-001 · Pipeline GHL",
    segments: [{ left: "0%", width: "100%", color: AMBER, bg: AMBER_BG, border: AMBER, label: "En operación — seguimiento semanal cohortes" }],
  },
  {
    name: "Caza Productos", code: "CAZ-001 · Bug crítico",
    segments: [
      { left: "0%",   width: "16%",  color: RED,   bg: RED_BG,   border: RED,   label: "Bug WhatsApp" },
      { left: "16%",  width: "84%",  color: SLATE,  bg: SLATE_BG, border: "#CBD5E1", label: "Adopción · apertura países + verificados" },
    ],
  },
  {
    name: "Categorías Catálogo", code: "CAT-001 · Piloto 10 suppliers",
    segments: [{ left: "0%", width: "54%", color: SLATE, bg: SLATE_BG, border: "#CBD5E1", label: "Piloto comercial → decisión técnica" }],
  },
  {
    name: "Indicadores Proveedores", code: "IND-001 · UserPilot",
    segments: [{ left: "0%", width: "100%", color: SLATE, bg: SLATE_BG, border: "#CBD5E1", label: "Monitoreo continuo · experimentos UX" }],
  },
  {
    name: "NEG · Piloto adopción", code: "NEG-001 · Emilille",
    segments: [{ left: "0%", width: "50%", color: SLATE, bg: SLATE_BG, border: "#CBD5E1", label: "1 comunidad · 5 neg. meta · carga masiva 21-jul" }],
    milestone: { left: "10.87%", color: AMBER, title: "Carga masiva 21-jul" },
  },
  {
    name: "Campañas · Experimento", code: "DCA-001 · manual",
    segments: [{ left: "0%", width: "100%", color: SLATE, bg: SLATE_BG, border: "#CBD5E1", label: "Experimento manual → insights → herramienta Q4" }],
  },
];

const PROJECTS: ProjectCard[] = [
  {
    name: "Negociaciones Supplier↔Dropshipper",
    code: "NEG", statusLabel: "En dev", statusColor: GREEN, statusBg: GREEN_BG,
    dev: "Jul 7 → Ago 18 · 6 semanas", kr: "KR1.1 · KR1.2 — acorta ciclo comercial",
    note: "Carga masiva 21-jul · nueva arquitectura Ago",
  },
  {
    name: "Combos desde Dropshipper",
    code: "COM-002", statusLabel: "Cola Q3", statusColor: GREEN, statusBg: GREEN_BG,
    dev: "Ago 18 → Sep 29 · 6 semanas", kr: "KR1.1 · KR1.2 — aumenta ticket promedio",
    note: "Discovery + TOBE aprobado en junta",
  },
  {
    name: "Descuentos · Precio Antes/Ahora",
    code: "DESC-001", statusLabel: "Cola Q4", statusColor: AMBER, statusBg: AMBER_BG,
    dev: "Sep 29 → Nov 10 · 6 semanas", kr: "KR1.2 — incentiva GMV vía precio percibido",
    note: "Validar alcance técnico con TI",
  },
  {
    name: "Herramienta Campañas DCA",
    code: "DCA-Camp.", statusLabel: "Cola Q4", statusColor: AMBER, statusBg: AMBER_BG,
    dev: "Nov 10 → Dic 22 · 6 semanas", kr: "KR1.1 · KR1.2 — activa catálogo durmiente",
    note: "Insights del experimento manual S2",
  },
  {
    name: "Caza Productos + Búsqueda Semántica",
    code: "CAZ-001", statusLabel: "Bug crítico", statusColor: RED, statusBg: RED_BG,
    dev: "Fix prioritario Jul", kr: "KR1.1 — −68% proveedores · 17% conversión",
    note: "Paralelo · no bloquea cola dev",
  },
  {
    name: "Dropi Pulso",
    code: "Aspirac.", statusLabel: "2027", statusColor: SLATE, statusBg: SLATE_BG,
    dev: "Piloto Dic 2026 · escala 2027", kr: "KR1.1 — proveeduría puente, comunidades",
    note: "Riesgo: stock fantasma · privatización manual",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function MonthRuler({ showQ }: { showQ?: boolean }) {
  const months = ["Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", borderBottom: "1px solid var(--border)", paddingBottom: 5, marginBottom: showQ ? 4 : 12 }}>
        {months.map((m) => (
          <div key={m} style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", textAlign: "center" }}>
            {m}
          </div>
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

function TrackBg() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: "repeat(6,1fr)", pointerEvents: "none" }}>
      {[0,1,2,3,4,5].map((i) => (
        <div key={i} style={{ borderRight: i < 5 ? "1px solid #F3F4F6" : "none" }} />
      ))}
    </div>
  );
}

function Diamond({ left, color, marginLeft = -5 }: { left: string; color: string; marginLeft?: number }) {
  return (
    <div style={{
      position: "absolute", left, marginLeft,
      width: 10, height: 10,
      background: color,
      border: "2px solid var(--card)",
      transform: "rotate(45deg)",
      top: "50%", marginTop: -5,
      zIndex: 2,
    }} />
  );
}

function GanttRow({ label, code, children }: { label: string; code: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", alignItems: "center", minHeight: 44, marginBottom: 5 }}>
      <div style={{ paddingRight: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{label}</div>
        <div style={{ fontSize: 10, color: "var(--muted)", fontFamily: "monospace" }}>{code}</div>
      </div>
      <div style={{ position: "relative", height: 44, display: "flex", alignItems: "center" }}>
        <TrackBg />
        {/* today line — Jul 6 = 2.72% */}
        <div style={{ position: "absolute", left: "2.72%", top: 0, bottom: 0, width: 1.5, background: GREEN, opacity: 0.3, zIndex: 3 }} />
        {children}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RoadmapS2Page() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Nav header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Roadmap S2 2026</span>
      </header>

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Title */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: GREEN_BG, color: GREEN, padding: "3px 9px", borderRadius: 20 }}>
              Supplier Success
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#EEF2FF", color: "#6366F1", padding: "3px 9px", borderRadius: 20 }}>
              S2 2026
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: AMBER_BG, color: AMBER, padding: "3px 9px", borderRadius: 20 }}>
              Jul → Dic 2026
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", marginBottom: 6 }}>Roadmap S2 2026</h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 640 }}>
            Proyección a Diciembre con cola de desarrollo, frentes paralelos y KRs de compañía.
            1 desarrollador (Giancarlos) · ~6 semanas por proyecto · handoff secuencial.
          </p>
        </div>

        {/* KR strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 1, background: "var(--border)",
          border: "1px solid var(--border)", borderRadius: 14,
          overflow: "hidden", marginBottom: 36,
        }}>
          {[
            { label: "KR 1.1 · Volumen", value: "93.6M", sub: "órdenes anuales · 7.8M / mes" },
            { label: "KR 1.2 · GMV",     value: "$3.74B", sub: "COP · meta anual" },
          ].map((kr) => (
            <div key={kr.label} style={{ background: "var(--card)", padding: "20px 24px" }}>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
                {kr.label}
              </div>
              <div style={{ fontSize: 30, fontWeight: 800, color: GREEN, fontVariantNumeric: "tabular-nums", letterSpacing: "-0.02em", lineHeight: 1 }}>
                {kr.value}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{kr.sub}</div>
            </div>
          ))}
        </div>

        {/* ── Gantt 1: Dev queue ── */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>
          Cola de desarrollo
        </p>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px 20px", marginBottom: 24, overflowX: "auto" }}>
          <div style={{ minWidth: 560 }}>

            {/* ruler */}
            <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", marginBottom: 0 }}>
              <div />
              <MonthRuler showQ />
            </div>

            {/* rows */}
            {DEV_QUEUE.map((p) => (
              <GanttRow key={p.code} label={p.name} code={p.code}>
                <div style={{
                  position: "absolute", left: p.left, width: p.width,
                  height: 28, background: GREEN, color: "#fff",
                  display: "flex", alignItems: "center",
                  padding: "0 9px", fontSize: 11, fontWeight: 600,
                  zIndex: 1, whiteSpace: "nowrap",
                }}>
                  {p.name.split("·")[0].trim()}
                </div>
                <Diamond left={p.left}    color={GREEN} />
                <Diamond left={p.endLeft} color={GREEN} />
              </GanttRow>
            ))}

            {/* Dropi Pulso aspiracional */}
            <GanttRow label="Dropi Pulso" code="Aspiracional · 2027">
              <div style={{
                position: "absolute", left: "86.9%", width: "11%",
                height: 26, border: "1.5px dashed var(--border)", background: "transparent",
                display: "flex", alignItems: "center",
                padding: "0 9px", fontSize: 11, color: "var(--muted)",
                zIndex: 1,
              }}>
                Piloto
              </div>
            </GanttRow>

            {/* legend */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {[
                { swatch: <div style={{ width: 18, height: 11, background: GREEN }} />, label: "Desarrollo activo" },
                { swatch: <div style={{ width: 18, height: 11, border: "1.5px dashed var(--border)", background: "transparent" }} />, label: "Aspiracional" },
                { swatch: <div style={{ width: 10, height: 10, background: GREEN, transform: "rotate(45deg)" }} />, label: "Hito / entrega" },
                { swatch: <div style={{ width: 1.5, height: 14, background: GREEN, opacity: 0.4 }} />, label: "Hoy (6-jul)" },
              ].map((l, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: "var(--muted)" }}>
                  <div style={{ flexShrink: 0 }}>{l.swatch}</div>
                  {l.label}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── Gantt 2: Parallel tracks ── */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 10 }}>
          Frentes paralelos
        </p>
        <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px 20px", marginBottom: 32, overflowX: "auto" }}>
          <div style={{ minWidth: 560 }}>

            <div style={{ display: "grid", gridTemplateColumns: "192px 1fr", marginBottom: 0 }}>
              <div />
              <MonthRuler />
            </div>

            {PARALLEL_TRACKS.map((t) => (
              <GanttRow key={t.code} label={t.name} code={t.code}>
                {t.segments.map((seg, si) => (
                  <div key={si} style={{
                    position: "absolute", left: seg.left, width: seg.width,
                    height: 26, background: seg.bg,
                    border: `1px solid ${seg.border}`,
                    display: "flex", alignItems: "center",
                    padding: "0 8px", fontSize: 11, color: seg.color, fontWeight: 600,
                    zIndex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                  }}>
                    {seg.label}
                  </div>
                ))}
                {t.milestone && (
                  <Diamond left={t.milestone.left} color={t.milestone.color} />
                )}
              </GanttRow>
            ))}

            {/* legend */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
              {[
                { bg: AMBER_BG, border: AMBER, color: AMBER, label: "Operacional" },
                { bg: SLATE_BG, border: "#CBD5E1", color: SLATE, label: "Frente paralelo" },
                { bg: RED_BG,   border: RED,      color: RED,   label: "Crítico" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: "var(--muted)" }}>
                  <div style={{ width: 18, height: 11, background: l.bg, border: `1px solid ${l.border}`, flexShrink: 0 }} />
                  {l.label}
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, color: "var(--muted)" }}>
                <div style={{ width: 10, height: 10, background: AMBER, transform: "rotate(45deg)", flexShrink: 0 }} />
                Hito paralelo
              </div>
            </div>

          </div>
        </div>

        {/* ── Project cards ── */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>
          Proyectos
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px,1fr))", gap: 12, marginBottom: 32 }}>
          {PROJECTS.map((p) => (
            <div key={p.code} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 18px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", lineHeight: 1.3 }}>{p.name}</div>
                <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--muted)", background: "var(--bg)", padding: "2px 7px", whiteSpace: "nowrap", borderRadius: 4, flexShrink: 0 }}>
                  {p.code}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                {[
                  { k: "Estado", v: <span style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.06em", textTransform: "uppercase", padding: "2px 7px", borderRadius: 4, background: p.statusBg, color: p.statusColor }}>{p.statusLabel}</span> },
                  { k: "Dev",    v: p.dev },
                  { k: "KR",     v: p.kr },
                  { k: "Nota",   v: p.note },
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

        {/* ── Quarter KPIs ── */}
        <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--muted)", marginBottom: 12 }}>
          KPI por trimestre
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 }}>
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>Q3 · Jul – Sep</div>
            {[
              "Activación de proveedores",
              "Time to Value — pipeline GHL en operación",
              "Destrabar regulación que trunca activación",
              "NEG completo · COM-002 entregado en cierre Q3",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 7, lineHeight: 1.4 }}>
                <div style={{ width: 6, height: 6, background: GREEN, flexShrink: 0, marginTop: 4 }} />
                {item}
              </div>
            ))}
          </div>
          <div style={{ background: "var(--card)", border: `1px solid var(--border)`, borderLeft: `3px solid ${AMBER}`, borderRadius: 14, padding: "20px 22px" }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: AMBER, marginBottom: 14 }}>Q4 · Oct – Dic</div>
            {[
              "Por definir — sale del wonder del Product Backlog",
              "Impacto de nuevos proveedores en órdenes",
              "DESC-001 + DCA Campañas entregados",
              "Cronograma se planifica al cierre de Q3",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: "var(--muted)", marginBottom: 7, lineHeight: 1.4 }}>
                <div style={{ width: 6, height: 6, background: AMBER, flexShrink: 0, marginTop: 4 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── Constraints ── */}
        <div style={{ borderLeft: "3px solid var(--border)", paddingLeft: 16, background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>
            Supuestos y restricciones
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.75 }}>
            1 desarrollador (Giancarlos) · capacidad secuencial · ~6 semanas por proyecto · handoff incluye buffer de refinamiento.<br />
            Cola confirmada: NEG → COM-002 → DESC-001 → DCA Campañas. Ajuste posible si María cambia prioridad al cierre de Q3.<br />
            Dropi Pulso entra a cola 2027 salvo que se libere capacidad extraordinaria en Dic.
            TTV-001 opera en paralelo sin ocupar slot de desarrollo.
          </p>
        </div>

      </div>
    </main>
  );
}
