// Fuente: agente-delivery/Documentos/plan-de-ataque-jul2026.html (9 jul 2026)
// Datos: fact_marcas.csv · dim_marcas.csv · jun 2026 · KAMs válidos: 21553 y 71445

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const RED = "#DC2626";
const AMBER = "#D97706";
const PURPLE = "#7C3AED";
const TEAL = "#0D9488";
const RED_BG = "#FEF2F2";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const PUR_BG = "#F5F3FF";
const TEAL_BG = "#F0FDFA";

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "20px 22px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginTop: 32,
  marginBottom: 12,
};
const tagChip = (color: string, bg: string): React.CSSProperties => ({
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "2px 8px",
  borderRadius: 4,
  color,
  background: bg,
  whiteSpace: "nowrap",
});

// ─── Suma del ecosistema ──────────────────────────────────────────────────
const SUMA_ROWS = [
  { icon: "◉", label: "Portafolio L1", desc: "comercial asignado + comunidad Brands", pm: "269,153", pct: "44.9%", variant: "normal" },
  { icon: "+", label: "Otro L2", desc: "emprendedores gestionados por otros portafolios", pm: "+172,894", pct: "", variant: "normal" },
  { icon: "+", label: "Ocultos activos", desc: "23u · propias + externas reales", pm: "+9,301", pct: "", variant: "normal" },
  { icon: "+", label: "Huérfanos activos", desc: "92u sin KAM ni comunidad", pm: "+2,733", pct: "", variant: "normal" },
  { icon: "=", label: "Ecosistema completo L2", desc: "todo el universo emprendedor", pm: "446,897", pct: "74.5%", variant: "total" },
  { icon: "◎", label: "Meta NSM", desc: "", pm: "600,000", pct: "100%", variant: "meta" },
] as const;

// ─── Funnel 4 etapas ──────────────────────────────────────────────────────
const FUNNEL = [
  { tag: "1 · Adquisición", color: BLUE, val: "4,338u", sub: "registrados portafolio · 44.9% activó alguna vez" },
  { tag: "2 · Activación", color: AMBER, val: "TTFO Med 11d · TTV Med 15d", sub: "1ª orden creada → 1ª orden entregada · meta ambas: 7 días" },
  { tag: "3 · Retención", color: RED, val: "87.6%", sub: "mensual actual · −242u/mes churn · balance neto −46u/mes" },
  { tag: "4 · Resurrección", color: PURPLE, val: "162u/mes", sub: "vuelven solos · 2,385u inactivos totales" },
];

// ─── Pirámide de madurez ──────────────────────────────────────────────────
const PYRAMID = [
  {
    level: "Escalando", range: "1,001+ propias/mes", count: "48u",
    pm: "155,140 órd/mes · 57.6% del NSM", pct: 100, color: "#B91C1C",
    meta: "3,232 órd/u avg · med 1,970", stag: null,
    badge: { label: "Retener", color: RED, bg: RED_BG },
    equiv: [["7", "Consolidando"], ["24", "Creciendo"], ["269", "Iniciando"]],
    connector: "↑ +2,397 órd/u promedio al cruzar a Escalando — el salto más grande del ecosistema",
  },
  {
    level: "Pre-Escalando", range: "701–1,000 propias/mes", count: "21u",
    pm: "17,536 órd/mes · 6.5%", pct: 11.3, color: RED,
    meta: "835 órd/u avg · med 837", stag: "5 estancados · cerca del techo: ≥851 pm",
    badge: { label: "Retener + Subir", color: RED, bg: RED_BG },
    equiv: [["6", "Creciendo"], ["69", "Iniciando"]],
    connector: "↑ +391 órd/u promedio al cruzar a Pre-Escalando",
  },
  {
    level: "Consolidando", range: "301–700 propias/mes", count: "80u",
    pm: "35,546 órd/mes · 13.2%", pct: 22.9, color: AMBER,
    meta: "444 órd/u avg · med 422", stag: "34 estancados · cerca del techo: ≥596 pm",
    badge: { label: "Desbloquear", color: AMBER, bg: AMB_BG },
    equiv: [["3", "Creciendo"], ["37", "Iniciando"]],
    connector: "↑ +311 órd/u promedio al cruzar a Consolidando",
  },
  {
    level: "Creciendo", range: "51–300 propias/mes", count: "367u",
    pm: "49,027 órd/mes · 18.2%", pct: 31.6, color: AMBER,
    meta: "133 órd/u avg · med 119", stag: "108 estancados · 21 cerca del techo (≥256 pm)",
    badge: { label: "Desbloquear", color: AMBER, bg: AMB_BG },
    equiv: [["11", "Iniciando"]],
    connector: "↑ +121 órd/u promedio al cruzar a Creciendo · umbral objetivo Ataque 3",
  },
  {
    level: "Iniciando", range: "1–50 propias/mes", count: "966u",
    pm: "11,904 órd/mes · 4.4%", pct: 7.7, color: BLUE,
    meta: "12 órd/u avg · med 7 · base", stag: "60 estancados · cerca del techo: ≥43 pm",
    badge: { label: "Activar", color: BLUE, bg: BLU_BG },
    equiv: [], equivNote: "referencia base — todas las equivalencias se calculan sobre este nivel",
    connector: "— 471u activos en portafolio L1 con 0 propias · Suppliers puros · no contribuyen al NSM",
    connector2: "⟳ 2,385 inactivos — 608 recientes · 231 ene-feb 2026 · 1,546 fríos (6m+)",
  },
  {
    level: "Inactivos", range: "0 pm este mes", count: "2,385u",
    pm: "608 recientes (1–3m) · 231 ene-feb 2026 (4–6m) · 1,546 fríos (6m+)", pct: 0, color: PURPLE,
    meta: "", stag: null,
    badge: { label: "Resurrección", color: PURPLE, bg: PUR_BG },
    equiv: [["9", "ex-Escalando/Pre"], ["37", "ex-Consolidando"]],
    equivNote: "46 llegaron a Consolidando+ · 513u tenían 0 propias — Suppliers, no prioridad",
    isInactive: true,
  },
];

// ─── Ataque 1 — cost matrix ───────────────────────────────────────────────
const COST_MATRIX = [
  { level: "Escalando", avg: "3,232 órd/u", ini: "269 usuarios Iniciando", cre: "24 usuarios Creciendo", highlight: true },
  { level: "Pre-Escalando", avg: "835 órd/u", ini: "69 usuarios Iniciando", cre: "6 usuarios Creciendo", highlight: true },
  { level: "Consolidando", avg: "444 órd/u", ini: "37 usuarios Iniciando", cre: "3 usuarios Creciendo", highlight: false },
  { level: "Creciendo", avg: "133 órd/u", ini: "11 usuarios Iniciando", cre: "—", highlight: false },
  { level: "Iniciando", avg: "12 órd/u", ini: "referencia base", cre: "—", highlight: false, muted: true },
];

// ─── Ataque 2 — grupos de resurrección ────────────────────────────────────
const RESURRECCION_GRUPOS = [
  {
    tag: "⚡ Prioridad 0 · En Riesgo", color: RED, bg: RED_BG, borderColor: RED,
    count: "163 usuarios", sub: "activos en mayo 2026 · 0 órdenes en junio · acción esta semana",
    body: "Pararon este mes. Todavía tienen el contexto activo — el KAM los conoce, ellos conocen la plataforma. Son los más fáciles de recuperar y los que menos tiempo tienen: cada semana sin contacto los acerca a Perdido. Están incluidos dentro del Grupo 1.",
    cta: "→ KAM los contacta esta semana, antes de que se conviertan en Perdido. No esperar al ciclo de 2 semanas.",
  },
  {
    tag: "Grupo 1 · Recuperables recientes", color: PURPLE, bg: "transparent", borderColor: PURPLE,
    count: "608 usuarios", sub: "pararon hace 1–3 meses · Mar–May 2026 · incluye los 163 En Riesgo",
    body: "Estaban activos en 2026 y pararon hace menos de 90 días. Conocen la plataforma, tuvieron resultados recientes. Son los más fáciles y baratos de recuperar.",
    chips: [
      { label: "1 ex-Escalando", color: RED, bg: RED_BG },
      { label: "1 ex-Pre-Escalando", color: RED, bg: RED_BG },
      { label: "2 ex-Consolidando", color: AMBER, bg: AMB_BG },
      { label: "24 ex-Creciendo", color: AMBER, bg: AMB_BG },
      { label: "349 ex-Iniciando", color: BLUE, bg: BLU_BG },
      { label: "231 sin propias", color: "var(--muted)", bg: "var(--bg)" },
    ],
    cta: "→ Los 4 de Consolidando+ van a KAM directo. Los 231 sin propias son Suppliers — no prioridad de resurrección.",
  },
  {
    tag: "Grupo 2 · Recuperables 2026", color: "#7C3AED", bg: "transparent", borderColor: "#A78BFA",
    count: "231 usuarios", sub: "pararon hace 4–6 meses · Ene–Feb 2026",
    body: "Pararon al inicio de 2026. Responden mejor a un mensaje que reconoce su nivel anterior y propone un plan concreto de vuelta.",
    chips: [
      { label: "10 ex-Creciendo", color: AMBER, bg: AMB_BG },
      { label: "147 ex-Iniciando", color: BLUE, bg: BLU_BG },
      { label: "74 sin propias", color: "var(--muted)", bg: "var(--bg)" },
    ],
    cta: "→ Ninguno llegó a Consolidando+. Campaña segmentada por nivel previo. Los 74 sin propias: Suppliers, no prioridad.",
  },
  {
    tag: "Grupo 3 · Fríos", color: "#6D28D9", bg: "transparent", borderColor: "#C4B5FD",
    count: "1,546 usuarios", sub: "llevan 6+ meses sin actividad · último registro antes de 2026",
    body: "Ya perdieron el hábito de plataforma. Dentro de este grupo hay 42 usuarios que llegaron a Consolidando o más — ese es el segmento más valioso.",
    chips: [
      { label: "4 ex-Escalando", color: RED, bg: RED_BG },
      { label: "4 ex-Pre-Escalando", color: RED, bg: RED_BG },
      { label: "34 ex-Consolidando", color: AMBER, bg: AMB_BG },
      { label: "161 ex-Creciendo", color: AMBER, bg: AMB_BG },
      { label: "1,135 ex-Iniciando", color: BLUE, bg: BLU_BG },
      { label: "208 sin propias", color: "var(--muted)", bg: "var(--bg)" },
    ],
    cta: "→ 42 ex-Consolidando+ van a campaña específica. Los 208 sin propias: Suppliers, no prioridad de resurrección.",
  },
];

const TRUTH = [
  "Aun sumando todo el ecosistema (L1 + Otro L2 + ocultos + huérfanos): 446,897 pm — 74.5% de la meta. Brecha estructural de 153,103 pm.",
  "Solo con los 3 ataques (portafolio L1, sin adquisición externa): proteger 172,676 propias/mes de Escalando+Pre-Escalando, sumar ~9,300 de resurrección y desbloqueo, y ~7,400 de Iniciando que cruzan a Creciendo. Potencial total portafolio: ~286K propias/mes. La palanca más rápida no es adquirir.",
  "Sumando oportunidades L2 (ocultos + huérfanos): +12,034 propias/mes adicionales → techo alcanzable ~298K propias/mes. Brecha estructural a 600K: ~302K que no se cierra solo con el portafolio actual.",
  "Para 600K propias: ejecutar los 3 ataques en orden + incorporar oportunidades L2 + 18–24 meses de ejecución sostenida. No es este trimestre — es el año bien ejecutado.",
  "Pregunta pendiente que cambia todo: ¿la meta fue calibrada sobre propias o sobre movilizadas totales? El ecosistema ya genera 1,782,555 movilizadas totales — el 297% de la meta. Si la definición original incluía externas, la conversación con stakeholders cambia completamente.",
];

function Impact({ value, desc }: { value: string; desc: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
      <div style={{ fontSize: 22, fontWeight: 800, color: NAVY, letterSpacing: "-0.02em", whiteSpace: "nowrap" }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{desc}</div>
    </div>
  );
}

function ActionItem({ n, color, children }: { n: number; color: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 13, color: "var(--fg)", lineHeight: 1.55 }}>
      <div style={{ flexShrink: 0, width: 20, height: 20, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", marginTop: 1 }}>
        {n}
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

export default function MarcasPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 24px 0" }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
      </div>

      {/* Header */}
      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi · Plan de ataque · Julio 2026
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            3 ataques para mover la aguja
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>
            En orden. Cada ataque corresponde a un nivel de madurez y una etapa del funnel.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px" }}>

        {/* PROGRESO */}
        <div style={{ ...card, borderRadius: 0, borderTop: "none", marginTop: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 9 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: NAVY, letterSpacing: "-0.03em" }}>269,153</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>propias movilizadas/mes · portafolio L1 actual</div>
          </div>
          <div style={{ height: 7, background: "var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: 5 }}>
            <div style={{ height: "100%", width: "44.9%", background: BLUE, borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 16 }}>
            <span style={{ color: BLUE, fontWeight: 700 }}>44.9% — hoy (L1 portafolio)</span>
            <span style={{ color: "var(--muted)" }}>meta 600,000 pm</span>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
            ¿Qué pasa si sumamos todo el ecosistema?
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
            {SUMA_ROWS.map((r, i) => (
              <div
                key={i}
                style={{
                  display: "flex", alignItems: "center", padding: "8px 12px", gap: 8, fontSize: 12,
                  borderBottom: i < SUMA_ROWS.length - 1 ? "1px solid var(--border)" : "none",
                  background: r.variant === "total" ? NAVY : r.variant === "meta" ? AMB_BG : "transparent",
                }}
              >
                <div style={{ fontSize: 10, color: r.variant === "total" ? "rgba(255,255,255,.4)" : "var(--muted)", width: 12, textAlign: "center" }}>{r.icon}</div>
                <div style={{ flex: 1, color: r.variant === "total" ? "rgba(255,255,255,.6)" : r.variant === "meta" ? "#92400E" : "var(--muted)", lineHeight: 1.3 }}>
                  <strong style={{ color: r.variant === "total" ? "white" : r.variant === "meta" ? "#78350F" : "var(--fg)" }}>{r.label}</strong>
                  {r.desc && <> — {r.desc}</>}
                </div>
                <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", color: r.variant === "total" ? "white" : r.variant === "meta" ? "#92400E" : "var(--fg)" }}>{r.pm}</div>
                <div style={{ fontSize: 11, fontWeight: 700, minWidth: 38, textAlign: "right", color: r.variant === "total" ? "rgba(255,255,255,.5)" : r.variant === "meta" ? AMBER : "var(--muted)" }}>{r.pct}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted)", lineHeight: 1.5, padding: "8px 10px", background: RED_BG, borderLeft: `3px solid ${RED}` }}>
            <strong style={{ color: RED }}>Aun sumando todo el ecosistema, la brecha es −153,103 pm (25.5%).</strong> El ecosistema ya está al 74.5% de la meta. Los 3 ataques apuntan a cerrar esa brecha desde adentro antes de escalar adquisición.
          </div>
        </div>

        {/* FUNNEL */}
        <div style={sectionLabel}>El funnel · 4 etapas</div>
        <div style={{ display: "flex", flexWrap: "wrap", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {FUNNEL.map((f, i) => (
            <div key={i} style={{ flex: "1 1 200px", padding: "12px 12px", borderRight: i < FUNNEL.length - 1 ? "1px solid var(--border)" : "none", borderTop: `3px solid ${f.color}` }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: f.color, marginBottom: 5 }}>{f.tag}</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: NAVY, lineHeight: 1.2, marginBottom: 3 }}>{f.val}</div>
              <div style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.35 }}>{f.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5, padding: "10px 12px", background: "var(--card)", border: "1px solid var(--border)", borderTop: "none", borderRadius: "0 0 10px 10px" }}>
          <strong>TTFO vs TTV:</strong> TTFO (bruta) mide días hasta la primera orden creada. TTV (neta) mide hasta la primera orden entregada — el momento real de valor. La mediana (11d / 15d) es más representativa; el promedio alto (21d / 25d) indica una cola de usuarios que se traban. <strong>Resurrección ≠ Activación:</strong> Resurrección es para quien YA tuvo órdenes y paró.
        </div>

        {/* PIRÁMIDE */}
        <div style={sectionLabel}>Mapa de madurez · volúmenes, estancados y costo de perder cada nivel</div>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 10, color: "var(--muted)", marginBottom: 8 }}>
          <span>📦 <strong style={{ color: "var(--fg)" }}>órd/mes</strong> = total de órdenes propias en el mes</span>
          <span>👤 <strong style={{ color: "var(--fg)" }}>órd/u</strong> = promedio de órdenes por usuario</span>
          <span>👥 <strong style={{ color: "var(--fg)" }}>u</strong> = cantidad de usuarios</span>
        </div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {PYRAMID.map((p, i) => (
            <div key={p.level}>
              <div style={{ display: "grid", gridTemplateColumns: "140px 50px 1fr 160px", borderBottom: "1px solid var(--border)", background: p.isInactive ? PUR_BG : "transparent" }}>
                <div style={{ padding: "10px", borderRight: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: p.isInactive ? PURPLE : NAVY, display: "block" }}>{p.level}</span>
                  <span style={{ fontSize: 10, color: "var(--muted)" }}>{p.range}</span>
                </div>
                <div style={{ padding: "10px 6px", textAlign: "center", borderRight: "1px solid var(--border)", fontSize: 12, fontWeight: 700, color: p.isInactive ? PURPLE : "var(--muted)" }}>{p.count}</div>
                <div style={{ padding: "10px", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ height: 16, background: "rgba(20,88,168,.06)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${p.pct}%`, background: p.color, display: "flex", alignItems: "center", padding: "0 5px" }}>
                      <span style={{ fontSize: 9, fontWeight: 700, color: "white", whiteSpace: "nowrap" }}>{p.pm}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, fontSize: 10, color: "var(--muted)", flexWrap: "wrap" }}>
                    {p.meta && <span>{p.meta}</span>}
                    {p.stag && <span style={{ color: RED, fontWeight: 700 }}>{p.stag}</span>}
                  </div>
                </div>
                <div style={{ padding: "10px", display: "flex", flexDirection: "column", gap: 3 }}>
                  <span style={tagChip(p.badge.color, p.badge.bg)}>{p.badge.label}</span>
                  <div style={{ marginTop: 4, paddingTop: 4, borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 9, color: "var(--muted)", marginBottom: 3 }}>{p.equivNote ?? "1 perdido de aquí ="}</div>
                    {p.equiv.map(([n, l], j) => (
                      <div key={j} style={{ display: "flex", gap: 4, fontSize: 10, color: "var(--fg)" }}>
                        <span style={{ fontWeight: 800, minWidth: 22, textAlign: "right" }}>{n}</span>
                        <span style={{ color: "var(--muted)" }}>{l}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {p.connector && (
                <div style={{ padding: "5px 10px", fontSize: 10, color: "var(--muted)", background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                  {p.connector}
                </div>
              )}
              {p.connector2 && (
                <div style={{ padding: "5px 10px", fontSize: 10, color: PURPLE, background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
                  {p.connector2}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ATAQUE 1 */}
        <div style={sectionLabel}>Ataque 1 · Esta semana · Retención</div>
        <div style={{ ...card, borderTop: `4px solid ${RED}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(RED, RED_BG)}>Urgente</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Proteger Escalando y Pre-Escalando</span>
            <span style={tagChip(BLUE, BLU_BG)}>Lente 1 · Portafolio comercial</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
            <span style={{ ...tagChip(RED, RED_BG), border: `1px solid ${RED}` }}>Escalando · 48u · 155,140 órd/mes</span>
            <span style={{ ...tagChip(RED, RED_BG), border: `1px solid ${RED}`, opacity: 0.8 }}>Pre-Escalando · 21u · 17,536 órd/mes</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12, maxWidth: "58ch" }}>
            Estos dos niveles concentran el 64.2% de las propias actuales del portafolio y el 28.8% de la meta de 600K. Perder usuarios aquí es el escenario más costoso — ninguna campaña de adquisición lo compensa en el corto plazo.
          </p>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
            Si pierdo 1 usuario de cada nivel, ¿cuántos necesito en otro nivel para compensar?
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "140px 90px 1fr 1fr", background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "5px 10px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", gap: 8 }}>
              <div>Nivel</div><div>Propias/u avg</div><div>Iniciando a reponer</div><div>Creciendo a reponer</div>
            </div>
            {COST_MATRIX.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "140px 90px 1fr 1fr", padding: "7px 10px", borderBottom: i < COST_MATRIX.length - 1 ? "1px solid var(--border)" : "none", gap: 8, fontSize: 12, background: r.highlight ? RED_BG : r.muted ? "var(--bg)" : "transparent" }}>
                <div style={{ fontWeight: 700, color: r.muted ? "var(--muted)" : NAVY }}>{r.level}</div>
                <div style={{ color: r.muted ? "var(--muted)" : "var(--fg)" }}>{r.avg}</div>
                <div style={{ fontWeight: r.muted ? 400 : 700, color: r.muted ? "var(--muted)" : RED }}>{r.ini}</div>
                <div style={{ color: "var(--muted)" }}>{r.cre}</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionItem n={1} color={RED}><strong>Revisar los 48 Escalando esta semana</strong> — ¿alguno con 2+ semanas sin actividad? Esos están en riesgo. KAM los contacta esta semana.</ActionItem>
            <ActionItem n={2} color={RED}><strong>Los 5 Pre-Escalando estancados son críticos.</strong> Si uno cruza a Escalando gana +2,397 pm/u. Si uno churnea, necesitas 69 Iniciando para compensar.</ActionItem>
            <ActionItem n={3} color={RED}><strong>Alerta de caída:</strong> cualquier usuario de estos niveles que baje 30% vs su promedio → acción inmediata antes de que salga.</ActionItem>
          </div>
          <Impact value="172,676 órd/mes" desc="protegidos en Escalando + Pre-Escalando — 64.2% del NSM total del portafolio" />
        </div>

        {/* ATAQUE 2 — RESURRECCIÓN */}
        <div style={sectionLabel}>Ataque 2 · Próximas 2 semanas · Resurrección + Desbloqueo</div>
        <div style={{ ...card, borderTop: `4px solid ${PURPLE}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(PURPLE, PUR_BG)}>Resurrección</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Despertar los 2,385 inactivos — todos tuvieron actividad previa</span>
            <span style={tagChip(BLUE, BLU_BG)}>Lente 1 · Portafolio comercial</span>
          </div>
          <div style={{ background: PUR_BG, border: "1px solid #DDD6FE", borderRadius: 6, padding: "9px 12px", marginBottom: 12, fontSize: 11, color: "#5B21B6", lineHeight: 1.6 }}>
            <strong>Criterio Lente 1 · propias:</strong> de los 2,385 inactivos del portafolio comercial, <strong>1,872u tuvieron propias reales</strong> — esos son los Marcas a reactivar. Los otros 513u tuvieron actividad pero 0 propias (Suppliers) — no son objetivo de resurrección de Marcas.<br />
            <strong>Por tipo_activo_churn:</strong> <strong>163u En Riesgo</strong> · <strong>2,222u Perdido</strong> (pendiente incorporar a métricas activas — confirmar con Kate).
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 12 }}>
            {RESURRECCION_GRUPOS.map((g, i) => (
              <div key={i} style={{ border: "1px solid var(--border)", borderLeft: `3px solid ${g.borderColor}`, borderRadius: 6, padding: "11px 13px", background: g.bg === "transparent" ? "var(--card)" : g.bg }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 5, flexWrap: "wrap" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: g.color }}>{g.tag}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: NAVY }}>{g.count}</div>
                  <div style={{ fontSize: 10, color: "var(--muted)" }}>{g.sub}</div>
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, marginBottom: 7 }}>{g.body}</div>
                {g.chips && (
                  <div style={{ display: "flex", gap: 5, flexWrap: "wrap", marginBottom: 7 }}>
                    {g.chips.map((c, j) => (
                      <span key={j} style={{ fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 4, background: c.bg, color: c.color }}>{c.label}</span>
                    ))}
                  </div>
                )}
                <div style={{ fontSize: 11, color: g.color, fontWeight: 700 }}>{g.cta}</div>
              </div>
            ))}
          </div>

          <div style={{ background: RED_BG, border: "1px solid #FECACA", borderRadius: 6, padding: "9px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: RED, marginBottom: 5 }}>Los 46 inactivos de nivel alto · Consolidando o superior</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              <div style={{ textAlign: "center", padding: "6px 0" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>4</div>
                <div style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.3 }}>Recuperables recientes</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: PURPLE, marginTop: 2 }}>→ KAM esta semana</div>
              </div>
              <div style={{ textAlign: "center", padding: "6px 0", borderLeft: "1px solid var(--border)", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>0</div>
                <div style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.3 }}>Recuperables 2026</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", marginTop: 2 }}>ninguno llegó a Consolidando+</div>
              </div>
              <div style={{ textAlign: "center", padding: "6px 0" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: NAVY }}>42</div>
                <div style={{ fontSize: 10, color: "var(--muted)", lineHeight: 1.3 }}>Fríos nivel alto</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#6D28D9", marginTop: 2 }}>→ Campaña específica</div>
              </div>
            </div>
          </div>
          <Impact value="~4,600 pm" desc="si 30% de los 534 recuperables con historial propias vuelven — medido en propias, 513 inactivos sin propias son Suppliers" />
        </div>

        {/* DESBLOQUEO */}
        <div style={{ ...card, borderTop: `4px solid ${AMBER}`, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(AMBER, AMB_BG)}>Desbloqueo</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Mover los estancados próximos al siguiente nivel</span>
            <span style={tagChip(BLUE, BLU_BG)}>Lente 1 · Portafolio comercial</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 11 }}>
            <span style={{ ...tagChip(AMBER, AMB_BG), border: `1px solid ${AMBER}` }}>21 Creciendo cerca del techo (≥256 órd/mes)</span>
            <span style={{ ...tagChip(RED, RED_BG), border: `1px solid ${RED}`, opacity: 0.8 }}>5 Pre-Escalando estancados</span>
            <span style={{ ...tagChip(AMBER, AMB_BG), border: `1px solid ${AMBER}` }}>34 Consolidando estancados</span>
            <span style={{ ...tagChip(BLUE, BLU_BG), border: `1px solid ${BLUE}` }}>60 Iniciando estancados · 36 cerca del techo</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12, maxWidth: "58ch" }}>
            207 activos no están creciendo. Priorizar por costo de cruzar: Pre-Escalando primero (+2,397 órd/u al cruzar a Escalando), luego los 21 Creciendo próximos (+311 órd/u al cruzar a Consolidando).
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionItem n={1} color={AMBER}><strong>5 Pre-Escalando estancados — máxima prioridad.</strong> Si uno cruza a Escalando añade +2,397 órd/u. El mayor retorno posible de desbloqueo en todo el portafolio.</ActionItem>
            <ActionItem n={2} color={AMBER}><strong>21 Creciendo próximos a cruzar (≥256 órd/mes).</strong> Diagnóstico rápido: ¿qué los bloquea? demanda, catálogo, canal. Están a menos del 15% del umbral.</ActionItem>
            <ActionItem n={3} color={AMBER}><strong>36 Iniciando cerca del techo (≥43 órd/mes): filtrar antes de actuar.</strong> Solo estos tienen sentido de empujar ahora — los 24 restantes en el piso o centro no están listos.</ActionItem>
          </div>
          <Impact value="~4,700 órd/mes" desc="si 20% de los 207 estancados empieza a crecer — mayor retorno: 1 Pre-Escalando cruzando a Escalando = +2,397 órd/u" />
        </div>

        {/* ATAQUE 3 */}
        <div style={sectionLabel}>Ataque 3 · Próximo mes · Activar los Iniciando del portafolio (solo si 1 y 2 van bien)</div>
        <div style={{ ...card, borderTop: `4px solid ${BLUE}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(BLUE, BLU_BG)}>Crecimiento base</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Crecer los 966 Iniciando del portafolio hacia Creciendo</span>
            <span style={tagChip(BLUE, BLU_BG)}>Lente 1 · Portafolio comercial</span>
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 11 }}>
            <span style={{ ...tagChip(BLUE, BLU_BG), border: `1px solid ${BLUE}` }}>966u activos en Iniciando · 11,904 órd/mes · avg 12 propias/u</span>
            <span style={{ ...tagChip(AMBER, AMB_BG), border: `1px solid ${AMBER}` }}>Objetivo: cruzar el umbral de 51 propias/mes</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12, maxWidth: "58ch" }}>
            El 62% de los usuarios activos del portafolio está en Iniciando. Cada uno que cruza a Creciendo añade mínimo +39 propias/mes. El potencial está en diagnosticar qué los bloquea — sin adquirir usuarios nuevos.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionItem n={1} color={BLUE}><strong>Diagnóstico de bloqueo:</strong> revisar TTFO y TTV de estos 966 usuarios. ¿Activaron rápido pero no crecieron? ¿Cuántos llevan más de 3 meses en Iniciando sin subir?</ActionItem>
            <ActionItem n={2} color={BLUE}><strong>Catálogo y demanda:</strong> ¿tienen productos activos con demanda real? Un Iniciando sin catálogo competitivo no crece por más acompañamiento que tenga.</ActionItem>
            <ActionItem n={3} color={BLUE}><strong>Segmentar por antigüedad en plataforma:</strong> los de 1–3 meses tienen inercia de aprendizaje — intervención temprana. Los de 6+ meses pueden estar en techo natural.</ActionItem>
          </div>
          <Impact value="~7,400 órd/mes" desc="si 20% de los Iniciando (193u) cruza a Creciendo — sin adquisición nueva, solo diagnóstico y activación" />
        </div>

        {/* OCULTOS Y HUÉRFANOS */}
        <div style={sectionLabel}>Oportunidades adicionales · Ecosistema (Lente 2)</div>
        <div style={{ ...card, borderTop: `4px solid ${TEAL}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(TEAL, TEAL_BG)}>Más allá del portafolio</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Ocultos y huérfanos — gestión, no adquisición</span>
            <span style={tagChip(TEAL, TEAL_BG)}>Lente 2 · Ecosistema — no están en portafolio L1</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12, maxWidth: "58ch" }}>
            Usuarios con volumen real de Marca que operan fuera del portafolio comercial. No requieren adquisición — solo identificación y acompañamiento.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ padding: "10px 12px", border: "1px solid var(--border)", borderLeft: `3px solid ${PURPLE}`, borderRadius: 6, background: "var(--bg)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: PURPLE, marginBottom: 3 }}>Ocultos activos</div>
              <span style={{ fontSize: 16, fontWeight: 800, color: NAVY, display: "block", marginBottom: 2 }}>23u · +9,301 órd/mes</span>
              <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>Sus propias + externas = volumen real de Marca. Operan con inventario privado a través de un solo Dropshipper por desconocimiento de la plataforma. Reclasificar su volumen.</div>
            </div>
            <div style={{ padding: "10px 12px", border: "1px solid var(--border)", borderLeft: `3px solid ${TEAL}`, borderRadius: 6, background: "var(--bg)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: TEAL, marginBottom: 3 }}>Huérfanos activos</div>
              <span style={{ fontSize: 16, fontWeight: 800, color: NAVY, display: "block", marginBottom: 2 }}>92u · +2,733 órd/mes</span>
              <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>Sin KAM ni comunidad Brands. Fidelidad 64% — la más baja del ecosistema. Acompañamiento básico los hace subir.</div>
            </div>
          </div>
          <Impact value="+12,034 órd/mes" desc="sin costo de adquisición — solo gestión e identificación" />
        </div>

        {/* LA VERDAD */}
        <div style={sectionLabel}>La verdad sobre 600K</div>
        <div style={{ background: NAVY, borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 10 }}>Mirada conservadora</div>
          {TRUTH.map((t, i) => {
            const parts = t.split(/:(.+)/);
            const hasColon = parts.length > 1 && t.indexOf(":") < 60;
            return (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, marginBottom: i < TRUTH.length - 1 ? 7 : 0 }}>
                <div style={{ flexShrink: 0, width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,.28)", marginTop: 7 }} />
                <div style={{ fontSize: 12, color: "rgba(255,255,255,.55)", lineHeight: 1.55 }}>
                  {hasColon ? (
                    <>
                      <strong style={{ color: "white" }}>{parts[0]}:</strong>{parts[1]}
                    </>
                  ) : t}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 30, padding: "12px 0", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
          Datos: fact_marcas.csv · dim_marcas.csv · jun 2026 · KAMs válidos: 21553 y 71445 · L1: 4,338u total · 1,953u activos<br />
          Pirámide clasificada por ordenes_mes_propias · Análisis agente Data_Brands · Uso interno Célula Brands Success · Jul 2026
        </div>
      </div>
    </main>
  );
}
