// Fuente: agente-delivery/Documentos/plan-de-ataque-jul2026-v2.html (corte 20-jul-2026)
// Datos: fact_marcas.csv · dim_marcas.csv · KAMs válidos: 21553 y 71445
// v2: unificado a 2 lentes (L1 portafolio comercial / L2 ecosistema completo),
// sin subtipos (Ocultos/Huérfanos ya no se desagregan). Madurez recalculada
// sobre promedio de ordenes_mes_propias en 6 meses completos (ene-jun 2026).

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const RED = "#DC2626";
const AMBER = "#D97706";
const GREEN = "#16A34A";
const PURPLE = "#7C3AED";
const TEAL = "#0D9488";
const RED_BG = "#FEF2F2";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const GRN_BG = "#F0FDF4";
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
const lensChip = (color: string, bg: string, border: string): React.CSSProperties => ({
  fontSize: 9,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  padding: "2px 7px",
  border: `1px solid ${border}`,
  borderRadius: 2,
  color,
  background: bg,
  whiteSpace: "nowrap",
});

// ─── Progreso (2 lentes, sin subtipos) ────────────────────────────────────
const SUMA_ROWS = [
  { icon: "◉", label: "Lente 1 · Portafolio comercial", desc: "comercial_id 71445 + 21553", val: "289,972", pct: "48.3%", variant: "normal" },
  { icon: "◈", label: "Lente 2 · Ecosistema completo de Marcas", desc: "todas las propias del ecosistema, sin importar comercial asignado (referencia de tamaño, no forma parte del NSM)", val: "474,733", pct: "79.1%*", variant: "total" },
  { icon: "◎", label: "Meta NSM", desc: "aplica solo al portafolio comercial (L1)", val: "600,000", pct: "100%", variant: "meta" },
] as const;

// ─── Funnel 4 etapas (Lente 1) ─────────────────────────────────────────────
const FUNNEL = [
  { tag: "1 · Adquisición", color: BLUE, val: "4,309u", sub: "registrados portafolio L1 · 1,770u activos en jun (41.1%)" },
  { tag: "2 · Activación", color: AMBER, val: "TTFO Med 12d · Avg 23d", sub: "TTV Med 18d · Avg 27d · meta ambas: 7 días · cohorte 2026 (294u)" },
  { tag: "3 · Retención", color: RED, val: "88.8%", sub: "mensual jun-2026 (L1) · 89.3% ecosistema (L2) · balance neto L1: −69u/mes" },
  { tag: "4 · Resurrección", color: PURPLE, val: "118u/mes", sub: "reactivados en jun, L1 · 2,539u inactivos L1 · 6,135u inactivos ecosistema" },
];

// ─── Definición de estancamiento ───────────────────────────────────────────
const ESTANCAMIENTO_NIVELES = [
  { name: "Iniciando · 1–50 órdenes/mes", months: "4+ meses" },
  { name: "Creciendo · 51–300 órdenes/mes", months: "3+ meses" },
  { name: "Consolidando · 301–700 órdenes/mes", months: "2+ meses" },
  { name: "Pre-Escalando · 701–1,000 órdenes/mes", months: "2+ meses" },
];
const ESTANCAMIENTO_POSICION = [
  { color: RED, title: "Cerca del techo (P75 de su lente)", text: "Ya está casi listo para cruzar. El bloqueo es de conversión, no de crecimiento." },
  { color: AMBER, title: "En el centro de su nivel", text: "Estancado genuino. Necesita diagnóstico: demanda, catálogo o canal." },
  { color: BLUE, title: "Cerca del piso de su nivel", text: "En riesgo de retroceder al nivel anterior." },
];

// ─── Ataque 1 · Retención — lens compare ──────────────────────────────────
const ATAQUE1_L1 = {
  val: "174,286 órdenes/mes",
  sub: "39 Escalando (152,693 órdenes/mes) + 25 Pre-Escalando (21,593 órdenes/mes)",
  rows: [
    { label: "% del portafolio comercial (289,972 órdenes/mes)", val: "60.1%" },
    { label: "% del NSM · meta 600,000", val: "29.0%" },
    { label: "Retención jun vs may", val: "34/64 · 53.1%" },
    { label: "· Escalando", val: "23/39 · 59.0%" },
    { label: "· Pre-Escalando", val: "11/25 · 44.0%" },
  ],
};
const ATAQUE1_L2 = {
  val: "267,193 órdenes/mes",
  sub: "68 Escalando (226,391 órdenes/mes) + 48 Pre-Escalando (40,802 órdenes/mes)",
  rows: [
    { label: "% del ecosistema completo (474,733 órdenes/mes)", val: "56.3%" },
    { label: "Equivalente a % de 600,000 (ref., no es NSM)", val: "44.5%" },
    { label: "Retención jun vs may", val: "60/116 · 51.7%" },
    { label: "· Escalando", val: "38/68 · 55.9%" },
    { label: "· Pre-Escalando", val: "22/48 · 45.8%" },
  ],
};
const COST_METRICA_EXPERIMENTO = [
  { lente: "L1 · Portafolio", n: "64", mantienen: "34", baseline: "53.1%", meta: "56–58%" },
  { lente: "L2 · Ecosistema", n: "116", mantienen: "60", baseline: "51.7%", meta: "54.7–56.7%" },
];
const COST_ORDENES_EN_JUEGO = [
  { lente: "L1 · Portafolio", perdidas: "−11,947", ganadas: "+32,052", neto: "+20,105" },
  { lente: "L2 · Ecosistema", perdidas: "−25,372", ganadas: "+53,229", neto: "+27,857" },
];
const COST_SI_PIERDO_1 = [
  { level: "Escalando", avg: "3,915 órd/u", consolidando: "9 usuarios Consolidando", creciendo: "26 usuarios Creciendo", iniciando: "196 usuarios Iniciando", highlight: true },
  { level: "Pre-Escalando", avg: "864 órd/u", consolidando: "2 usuarios Consolidando", creciendo: "6 usuarios Creciendo", iniciando: "44 usuarios Iniciando", highlight: true },
  { level: "Consolidando", avg: "482 órd/u", consolidando: "—", creciendo: "4 usuarios Creciendo", iniciando: "25 usuarios Iniciando", highlight: false },
  { level: "Creciendo", avg: "153 órd/u", consolidando: "—", creciendo: "—", iniciando: "8 usuarios Iniciando", highlight: false },
];

// ─── Ataque 2a · Resurrección — lens compare ──────────────────────────────
const RESURRECCION_L1 = {
  val: "2,539 inactivos", sub: "(foto jun) · 2,497 con historial de propias · 42 nunca tuvieron propias",
  rows: [
    { label: "En Riesgo (may→jun)", val: "202u" },
    { label: "Recientes (mar–may)", val: "510u" },
    { label: "2026 (ene–feb)", val: "217u" },
    { label: "Fríos (6m+)", val: "1,812u" },
    { label: "Ex-Consolidando+", val: "329u" },
    { label: "Ya reactivados en jul (confirmado)", val: "−89u", good: true },
    { label: "Prioridad real de contacto hoy", val: "2,450u", bad: true },
  ],
};
const RESURRECCION_L2 = {
  val: "6,135 inactivos", sub: "(foto jun) · 5,840 con historial de propias · 295 nunca tuvieron propias",
  rows: [
    { label: "En Riesgo (may→jun)", val: "335u" },
    { label: "Recientes (mar–may)", val: "946u" },
    { label: "2026 (ene–feb)", val: "411u" },
    { label: "Fríos (6m+)", val: "4,778u" },
    { label: "Ex-Consolidando+", val: "915u" },
    { label: "Ya reactivados en jul (confirmado)", val: "−197u", good: true },
    { label: "Prioridad real de contacto hoy", val: "5,938u", bad: true },
  ],
};
const URGENCIA_HEADERS = ["Nivel", "En Riesgo (may)", "Recientes (mar–abr)", "2026 (ene–feb)", "Fríos (6m+)"];
const URGENCIA_L1 = [
  { nivel: "Escalando", vals: ["4", "7", "10", "75"], highlight: true },
  { nivel: "Pre-Escalando", vals: ["7", "3", "1", "34"], highlight: true },
  { nivel: "Consolidando", vals: ["13", "21", "13", "141"], highlight: false },
  { nivel: "Creciendo", vals: ["42", "92", "54", "473"], highlight: false },
  { nivel: "Iniciando", vals: ["117", "191", "138", "1,061"], highlight: false, muted: true },
  { nivel: "Sin propias", vals: ["8", "5", "1", "28"], highlight: false, muted: true },
];
const URGENCIA_L2 = [
  { nivel: "Escalando", vals: ["12", "26", "20", "265"], highlight: true },
  { nivel: "Pre-Escalando", vals: ["13", "11", "3", "104"], highlight: true },
  { nivel: "Consolidando", vals: ["24", "34", "28", "375"], highlight: false },
  { nivel: "Creciendo", vals: ["74", "142", "98", "1,064"], highlight: false },
  { nivel: "Iniciando", vals: ["215", "357", "253", "2,722"], highlight: false, muted: true },
  { nivel: "Sin propias", vals: ["16", "22", "9", "248"], highlight: false, muted: true },
];

// ─── Ataque 2b · Desbloqueo — lens compare ────────────────────────────────
const DESBLOQUEO_L1 = {
  val: "215 estancados", sub: "de 1,400 activos con nivel · 67 además cerca del techo",
  rows: [
    { label: "Iniciando (4+m)", val: "40 / 17 techo" },
    { label: "Creciendo (3+m)", val: "118 / 36 techo" },
    { label: "Consolidando (2+m)", val: "43 / 10 techo" },
    { label: "Pre-Escalando (2+m)", val: "14 / 4 techo" },
  ],
};
const DESBLOQUEO_L2 = {
  val: "312 estancados", sub: "de 2,368 activos con nivel · 96 además cerca del techo",
  rows: [
    { label: "Iniciando (4+m)", val: "65 / 26 techo" },
    { label: "Creciendo (3+m)", val: "159 / 49 techo" },
    { label: "Consolidando (2+m)", val: "66 / 17 techo" },
    { label: "Pre-Escalando (2+m)", val: "22 / 4 techo" },
  ],
};

// ─── Ataque 3 · Activar Iniciando — lens compare ──────────────────────────
const ATAQUE3_L1 = { val: "887u", sub: "18,181 órdenes/mes · avg 20 propias/u (jun) · 6.3% del NSM (volumen tiered de L1)" };
const ATAQUE3_L2 = { val: "1,525u", sub: "31,894 órdenes/mes · avg 21 propias/u (jun) · 6.7% del volumen tiered del ecosistema (referencia, no es NSM)" };

const TRUTH = [
  "Lente 1 (portafolio comercial) — esta es la lectura oficial del NSM: 289,972 órdenes/mes — 48.3% de la meta.",
  "Lente 2 (ecosistema completo) — solo referencia, el NSM no aplica aquí: 474,733 órdenes/mes, equivalente a 79.1% de esa misma cifra si se sumara (no se suma oficialmente). Sirve para dimensionar cuánto más grande es el ecosistema que el portafolio gestionado, no como avance de meta.",
  "Solo con los 3 ataques sobre L1 (sin adquisición externa) — esto sí es NSM: partiendo de la base actual (289,972 órdenes/mes, que ya incluye lo protegido en Ataque 1), sumar ~4,280 de resurrección y un rango de ~11,500–53,700 de desbloqueo + Iniciando (20% a 100% de los candidatos cruzando). Techo del portafolio: ~306,000–348,000 órdenes/mes (51%–58% de la meta).",
  "Los mismos 3 ataques leídos en L2 — ejercicio de dimensionamiento, no meta oficial: partiendo de la base ecosistema (474,733 órdenes/mes), sumar ~8,250 de resurrección y un rango de ~16,500–80,600 de desbloqueo + Iniciando. Techo del ecosistema: ~499,500–563,600 órdenes/mes — equivalente a 83%–94% de 600K si aplicara, útil solo para ver la magnitud del playbook a mayor escala.",
  "Lectura clave de esta v2: en los 3 ataques, L2 no se comporta distinto a L1 — mismas tasas de retención, mismos patrones de estancamiento, mismo perfil de inactivos. La diferencia es puramente de escala (2–3x más usuarios y volumen fuera del portafolio). Eso sugiere que el problema no es que el ecosistema no gestionado se comporte peor — es que no tiene a nadie ejecutando el mismo playbook ahí.",
  "Pregunta pendiente que cambia todo: ¿la meta de 600K fue calibrada sobre propias o sobre movilizadas totales? Sigue sin resolverse — sigue siendo la que más cambia la lectura de este documento.",
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

type LensRow = { label: string; val: string; good?: boolean; bad?: boolean };
type LensData = { val: string; sub: string; rows: LensRow[] };

function LensCompare({ l1, l2 }: { l1: LensData; l2: LensData }) {
  const Box = ({ data, variant }: { data: LensData; variant: "l1" | "l2" }) => (
    <div
      style={{
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${variant === "l1" ? BLUE : TEAL}`,
        background: variant === "l1" ? BLU_BG : TEAL_BG,
        padding: "11px 13px",
      }}
    >
      <div style={{ fontSize: 9, fontWeight: 800, letterSpacing: ".10em", textTransform: "uppercase", color: variant === "l1" ? BLUE : TEAL, marginBottom: 7 }}>
        {variant === "l1" ? "Lente 1 · Portafolio comercial" : "Lente 2 · Ecosistema completo"}
      </div>
      <span style={{ fontSize: 21, fontWeight: 800, color: NAVY, letterSpacing: "-.02em", display: "block", marginBottom: 3 }}>{data.val}</span>
      <div style={{ fontSize: 10, color: "var(--fg)", marginBottom: 6, lineHeight: 1.4 }}>{data.sub}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 3, paddingTop: 6, borderTop: "1px solid rgba(11,11,11,.08)" }}>
        {data.rows.map((r, i) => (
          <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--fg)", gap: 8 }}>
            <span>{r.label}</span>
            <strong style={{ color: r.good ? GREEN : r.bad ? RED : NAVY, whiteSpace: "nowrap" }}>{r.val}</strong>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
      <Box data={l1} variant="l1" />
      <Box data={l2} variant="l2" />
    </div>
  );
}

function UrgencyTable({ title, color, rows }: { title: string; color: string; rows: typeof URGENCIA_L1 }) {
  return (
    <>
      <div style={{ fontSize: 10, fontWeight: 800, color, marginBottom: 4, marginTop: 12 }}>{title}</div>
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "100px repeat(4,1fr)", background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "5px 8px", fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted)", gap: 4 }}>
          {URGENCIA_HEADERS.map((h) => <div key={h}>{h}</div>)}
        </div>
        {rows.map((r, i) => (
          <div
            key={r.nivel}
            style={{
              display: "grid", gridTemplateColumns: "100px repeat(4,1fr)", padding: "6px 8px", gap: 4, fontSize: 11,
              borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
              background: r.highlight ? RED_BG : "transparent",
            }}
          >
            <div style={{ fontWeight: 700, color: r.muted ? "var(--muted)" : NAVY }}>{r.nivel}</div>
            {r.vals.map((v, j) => <div key={j} style={{ color: "var(--fg)" }}>{v}</div>)}
          </div>
        ))}
      </div>
    </>
  );
}

export default function MarcasPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 24px 0" }}>
        <a href="/celula/brands" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
      </div>

      {/* Header */}
      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi · Plan de ataque · Julio 2026{" "}
            <span style={{ display: "inline-block", fontSize: 10, fontWeight: 800, letterSpacing: ".08em", textTransform: "uppercase", background: "#B45309", color: "white", padding: "3px 9px", borderRadius: 3, marginLeft: 8, verticalAlign: 2 }}>v2</span>
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            3 ataques para mover la aguja
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>
            Cada ataque, leído en los 2 lentes: Portafolio comercial (L1) y Ecosistema completo de Marcas (L2).
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,.65)", fontWeight: 700, marginTop: 6 }}>📅 Corte de información: 20 de julio de 2026</div>
          <a
            href="/proyectos/marcas/experimentos"
            style={{ display: "inline-block", marginTop: 10, fontSize: 12, fontWeight: 700, color: "white", textDecoration: "none", opacity: 0.85 }}
          >
            🧪 Ver experimentos en marcha →
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 24px" }}>

        {/* VERSION NOTE */}
        <div style={{ background: AMB_BG, border: "1px solid #FDE68A", borderTop: "none", padding: "14px 18px", fontSize: 12, color: "#78350F", lineHeight: 1.6 }}>
          <strong style={{ color: "#92400E" }}>Qué cambió en esta v2:</strong>
          <ul style={{ margin: "6px 0 0 18px" }}>
            <li style={{ marginBottom: 3 }}><strong>Datos:</strong> corte de información al 20-jul-2026. Junio-2026 mes cerrado; julio no cierra todavía, no se usa para clasificar madurez.</li>
            <li style={{ marginBottom: 3 }}><strong>Lente 1 corregida:</strong> portafolio = solo comercial_id 71445 + 21553 (4,309u). Ya no suma comunidad Brands (regla descontinuada 2026-07-17).</li>
            <li style={{ marginBottom: 3 }}><strong>Madurez recalculada</strong> sobre promedio de ordenes_mes_propias en 6 meses completos (ene–jun 2026), no un solo mes.</li>
            <li style={{ marginBottom: 3 }}><strong>Unificado a 2 lentes únicamente</strong> — se eliminaron Otro L2/Ocultos/Huérfanos como líneas separadas.</li>
          </ul>
        </div>

        {/* PROGRESO */}
        <div style={{ ...card, borderRadius: 0, borderTop: "none", marginTop: 0 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 9 }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: NAVY, letterSpacing: "-0.03em" }}>289,972</div>
            <div style={{ fontSize: 12, color: "var(--muted)" }}>órdenes/mes · Lente 1 (portafolio comercial), jun-2026</div>
          </div>
          <div style={{ height: 7, background: "var(--border)", borderRadius: 3, overflow: "hidden", marginBottom: 5 }}>
            <div style={{ height: "100%", width: "48.3%", background: BLUE, borderRadius: 3 }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 16 }}>
            <span style={{ color: BLUE, fontWeight: 700 }}>48.3% — Lente 1</span>
            <span style={{ color: "var(--muted)" }}>meta 600,000 órdenes/mes</span>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
            Los 2 lentes, sin desagregar en subtipos
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
                <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 700, fontSize: 12, whiteSpace: "nowrap", color: r.variant === "total" ? "white" : r.variant === "meta" ? "#92400E" : "var(--fg)" }}>{r.val}</div>
                <div style={{ fontSize: 11, fontWeight: 700, minWidth: 38, textAlign: "right", color: r.variant === "total" ? "rgba(255,255,255,.5)" : r.variant === "meta" ? AMBER : "var(--muted)" }}>{r.pct}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11, color: "var(--muted)", lineHeight: 1.5, padding: "8px 10px", background: RED_BG, borderLeft: `3px solid ${RED}` }}>
            <strong style={{ color: RED }}>El NSM (600,000 órdenes/mes) es exclusivo del portafolio comercial — no del ecosistema.</strong> El 79.1%* de Lente 2 es solo referencia de tamaño; no es avance oficial de meta. La diferencia entre lentes (184,761 órdenes/mes) es lo que el ecosistema ya genera fuera de la gestión del portafolio — no se desagrega por qué, eso es diagnóstico posterior.
          </div>
        </div>

        {/* FUNNEL */}
        <div style={sectionLabel}>El funnel · 4 etapas <span style={lensChip(BLUE, BLU_BG, "#93C5FD")}>Lente 1</span></div>
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
          <strong>TTFO vs TTV (cohorte 2026, Lente 1):</strong> mediana 12d/18d — la mayoría activa razonablemente bien; el promedio más alto (23d/27d) indica una cola que se traba. <strong>Retención casi idéntica en ambos lentes</strong> (88.8% L1 vs 89.3% L2) — la salud de retención del portafolio gestionado no es distinta a la del ecosistema sin gestionar; la diferencia entre lentes está en volumen y madurez, no en tasa de retención.
        </div>

        {/* DEFINICIÓN DE ESTANCAMIENTO */}
        <div style={sectionLabel}>¿Cuándo un usuario está estancado? · Criterio y sesgos a considerar</div>
        <div style={{ ...card, borderRadius: 0, borderTop: "none", marginTop: 0 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, marginBottom: 10 }}>Criterio base + posición en el rango — dos ejes para definirlo sin sesgar</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            <div style={{ padding: "10px 12px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Eje 1 — Tiempo sin crecer</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {ESTANCAMIENTO_NIVELES.map((n) => (
                  <div key={n.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                    <span style={{ flex: "0 0 160px", color: "var(--fg)" }}>{n.name}</span>
                    <span style={{ fontWeight: 700, color: NAVY, whiteSpace: "nowrap" }}>{n.months}</span>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8, lineHeight: 1.4 }}>&quot;Sin crecer&quot; = el mes no subió más de 15% respecto al anterior, medido sobre ene–jun 2026. Aplica igual en ambos lentes.</div>
            </div>
            <div style={{ padding: "10px 12px", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Eje 2 — Dónde está dentro de su nivel (P75, por lente)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {ESTANCAMIENTO_POSICION.map((p) => (
                  <div key={p.title} style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
                    <div style={{ flexShrink: 0, width: 8, height: 8, borderRadius: "50%", background: p.color, marginTop: 3 }} />
                    <div style={{ fontSize: 11, color: "var(--fg)", lineHeight: 1.4 }}>
                      <strong style={{ color: NAVY }}>{p.title}</strong><br />{p.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.45, padding: "8px 10px", background: AMB_BG, borderLeft: `3px solid ${AMBER}` }}>
            <strong style={{ color: "#92400E" }}>Sesgos a considerar:</strong> el P75 se calcula por separado en cada lente (la composición de usuarios no es la misma), así que un mismo usuario puede estar &quot;cerca del techo&quot; en Lente 2 y no en Lente 1, o viceversa.
          </div>
        </div>

        {/* ATAQUE 1 */}
        <div style={sectionLabel}>Ataque 1 · Esta semana · Retención <span style={lensChip("#4338CA", "#EEF2FF", "#C7D2FE")}>Lente 1 + Lente 2</span></div>
        <div style={{ ...card, borderTop: `4px solid ${RED}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(RED, RED_BG)}>Urgente</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Proteger Escalando y Pre-Escalando</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12, maxWidth: "58ch" }}>
            Perder usuarios en estos dos niveles es el escenario más costoso — ninguna campaña de adquisición lo compensa en el corto plazo. Se ve casi igual de frágil en ambos lentes.
          </p>

          <LensCompare l1={ATAQUE1_L1} l2={ATAQUE1_L2} />

          <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5, padding: "8px 10px", background: "var(--bg)", borderLeft: "3px solid var(--muted)", marginBottom: 12 }}>
            <strong style={{ color: "var(--fg)" }}>Solo estos dos niveles ya representan el 29.0% del NSM</strong> (L1, meta 600,000). Dentro del portafolio, esas 64 marcas son el 60.1% de las 289,972 órdenes/mes que hoy genera todo L1.<br /><br />
            <strong style={{ color: "var(--fg)" }}>52 marcas (92,907 órdenes/mes) de este ataque viven fuera del portafolio comercial</strong> — 116 Escalando/Pre-Escalando en todo el ecosistema vs. 64 dentro de L1. Esa diferencia no tiene KAM asignado hoy.
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
            Métrica del experimento (ambos lentes) — retención jun vs may
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "110px 40px 100px 90px 90px", background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "5px 10px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", gap: 8 }}>
              <div>Lente</div><div>n</div><div>Mantienen o crecen</div><div>Baseline</div><div>Meta</div>
            </div>
            {COST_METRICA_EXPERIMENTO.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 40px 100px 90px 90px", padding: "7px 10px", borderBottom: i < COST_METRICA_EXPERIMENTO.length - 1 ? "1px solid var(--border)" : "none", gap: 8, fontSize: 12, background: RED_BG }}>
                <div style={{ fontWeight: 700, color: NAVY }}>{r.lente}</div>
                <div style={{ color: "var(--muted)" }}>{r.n}</div>
                <div style={{ fontWeight: 700, color: RED }}>{r.mantienen}</div>
                <div style={{ color: "var(--muted)" }}>{r.baseline}</div>
                <div style={{ fontWeight: 700, color: RED }}>{r.meta}</div>
              </div>
            ))}
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
            Órdenes/mes en juego detrás de esa retención (jun vs may)
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 1fr", background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "5px 10px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", gap: 8 }}>
              <div>Lente</div><div>Perdidas</div><div>Ganadas</div><div>Neto</div>
            </div>
            {COST_ORDENES_EN_JUEGO.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "110px 1fr 1fr 1fr", padding: "7px 10px", borderBottom: i < COST_ORDENES_EN_JUEGO.length - 1 ? "1px solid var(--border)" : "none", gap: 8, fontSize: 12 }}>
                <div style={{ fontWeight: 700, color: NAVY }}>{r.lente}</div>
                <div style={{ color: RED }}>{r.perdidas}</div>
                <div style={{ color: GREEN }}>{r.ganadas}</div>
                <div style={{ fontWeight: 700, color: "var(--fg)" }}>{r.neto}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>
            El neto es positivo en ambos lentes porque las marcas que crecen ganan más volumen del que pierden las que declinan — pero seguimos midiendo por cantidad de marcas (retention rate), no por volumen.
          </div>

          <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderLeft: `3px solid ${BLUE}`, padding: "10px 12px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: BLUE, marginBottom: 5 }}>Cómo se mide el experimento una vez lanzado</div>
            <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.6 }}>
              <strong>Métrica oficial: mes vs. mes anterior</strong> (rolling 1 mes) — en agosto, ago vs. jul; en septiembre, sep vs. ago.
            </div>
            <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.6, marginTop: 6 }}>
              <strong>Regla para no sobre-reaccionar:</strong> un solo mes de caída no se trata como señal de fracaso — se necesitan <strong>2 meses seguidos</strong> de retroceso para considerarlo un problema real.
            </div>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 7 }}>
            Si pierdo 1 usuario de cada nivel (mismo avg jun por nivel L1)
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 14 }}>
            <div style={{ display: "grid", gridTemplateColumns: "120px 80px 1fr 1fr 1fr", background: "var(--bg)", borderBottom: "1px solid var(--border)", padding: "5px 10px", fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", gap: 8 }}>
              <div>Nivel</div><div>Propias/u avg</div><div>Consolidando a reponer</div><div>Creciendo a reponer</div><div>Iniciando a reponer</div>
            </div>
            {COST_SI_PIERDO_1.map((r, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "120px 80px 1fr 1fr 1fr", padding: "7px 10px", borderBottom: i < COST_SI_PIERDO_1.length - 1 ? "1px solid var(--border)" : "none", gap: 8, fontSize: 12, background: r.highlight ? RED_BG : "transparent" }}>
                <div style={{ fontWeight: 700, color: NAVY }}>{r.level}</div>
                <div style={{ color: "var(--fg)" }}>{r.avg}</div>
                <div style={{ color: "var(--muted)" }}>{r.consolidando}</div>
                <div style={{ color: "var(--muted)" }}>{r.creciendo}</div>
                <div style={{ color: "var(--muted)" }}>{r.iniciando}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionItem n={1} color={RED}><strong>KAM revisa los 39 Escalando + 25 Pre-Escalando de L1 esta semana</strong> — 30 de 64 ya están en declive jun vs may.</ActionItem>
            <ActionItem n={2} color={RED}><strong>Los 52 Escalando/Pre-Escalando fuera de L1 son la oportunidad de asignación comercial más clara de todo este plan</strong> — mismo nivel de riesgo, cero gestión hoy.</ActionItem>
            <ActionItem n={3} color={RED}><strong>Pre-Escalando es más frágil que Escalando en ambos lentes</strong> (44.0%/45.8% vs 59.0%/55.9%) — mayor apalancamiento por esfuerzo dirigido ahí.</ActionItem>
          </div>
          <Impact value="174,286 / 267,193 órdenes/mes" desc="protegidos en Escalando + Pre-Escalando — L1 / L2" />
        </div>

        {/* ATAQUE 2 — RESURRECCIÓN */}
        <div style={sectionLabel}>Ataque 2 · Próximas 2 semanas · Resurrección + Desbloqueo <span style={lensChip("#4338CA", "#EEF2FF", "#C7D2FE")}>Lente 1 + Lente 2</span></div>
        <div style={{ ...card, borderTop: `4px solid ${PURPLE}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(PURPLE, "#F5F3FF")}>Resurrección</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Despertar inactivos — la mayoría tuvo actividad previa</span>
          </div>

          <LensCompare l1={RESURRECCION_L1} l2={RESURRECCION_L2} />

          <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.5, padding: "8px 10px", background: "var(--bg)", borderLeft: "3px solid var(--muted)", marginBottom: 12 }}>
            El ecosistema tiene <strong style={{ color: "var(--fg)" }}>2.4x más inactivos con historial de propias</strong> que el portafolio (5,840 vs 2,497) y <strong style={{ color: "var(--fg)" }}>casi 3x más ex-Consolidando+</strong> (915 vs 329) — la resurrección de alto valor es, en volumen absoluto, mayor fuera del portafolio que dentro.
          </div>

          <div style={{ background: GRN_BG, border: "1px solid #BBF7D0", borderLeft: `4px solid ${GREEN}`, padding: "11px 13px", marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.6 }}>
              La foto de junio es la base estructural. Pero julio ya nos dice algo real: <strong>89 (L1) / 197 (L2) ya generaron órdenes propias en julio</strong> por su cuenta — 3,589 / 6,019 órdenes/mes recuperadas sin que nadie los contactara. Esos pasan a monitoreo. La lista real de a quién contactar esta semana baja a <strong>2,450 (L1) / 5,938 (L2)</strong>.
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 7, lineHeight: 1.5 }}>
              <strong>Por qué no ajusto en la otra dirección:</strong> julio lleva ~3 semanas, no está cerrado — si alguien tiene 0 órdenes en julio todavía, no puedo asumir que se puso inactivo. Julio solo sirve para <em>confirmar reactivación</em>, nunca para declarar nueva inactividad.
            </div>
          </div>

          <div style={{ background: RED_BG, border: `1px solid ${RED}`, borderLeft: `4px solid ${RED}`, padding: "11px 13px", marginBottom: 12 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: RED, marginBottom: 5 }}>⚡ Prioridad 0 · En Riesgo (jun-2026, tipo_activo_churn)</div>
            <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.55 }}>
              <strong>&quot;En Riesgo&quot; se activa por una sola causa:</strong> tuvo al menos 1 orden propia en mayo, y 0 en junio.<br />
              L1: <strong>202u</strong> cayeron a 0. L2: <strong>335u</strong> — de esos, 133 están fuera del portafolio comercial, sin KAM que los llame.
            </div>
            <div style={{ fontSize: 11, color: RED, fontWeight: 700, marginTop: 6 }}>→ KAM contacta los 202 de L1 esta semana. Los 133 restantes son candidatos a asignación comercial urgente.</div>
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
            Matriz de urgencia: nivel que tenía × hace cuánto dejó de vender
          </div>
          <UrgencyTable title="L1 · Portafolio comercial" color={BLUE} rows={URGENCIA_L1} />
          <UrgencyTable title="L2 · Ecosistema completo" color={TEAL} rows={URGENCIA_L2} />
          <div style={{ fontSize: 11, color: "var(--muted)", margin: "8px 0 12px", lineHeight: 1.5 }}>
            Máxima urgencia: <strong style={{ color: "var(--fg)" }}>4 ex-Escalando y 7 ex-Pre-Escalando en L1</strong> (12 y 13 en L2) están En Riesgo — cayeron a 0 este mes viniendo de los niveles de mayor volumen.
          </div>

          <Impact value="~4,280 / ~8,250 órdenes/mes" desc="si 30% de los recuperables recientes/2026 con historial (713 L1 / 1,310 L2) vuelven a nivel Iniciando — proyección, no medición" />
        </div>

        {/* DESBLOQUEO */}
        <div style={{ ...card, borderTop: `4px solid ${AMBER}`, marginTop: 10 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(AMBER, AMB_BG)}>Desbloqueo</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Mover los estancados próximos al siguiente nivel</span>
          </div>

          <LensCompare l1={DESBLOQUEO_L1} l2={DESBLOQUEO_L2} />

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionItem n={1} color={AMBER}><strong>4 Pre-Escalando de L1 (o 4 de L2 fuera de portafolio) estancados y cerca del techo — máxima prioridad.</strong> Cruzar a Escalando añade +3,051 órd/u.</ActionItem>
            <ActionItem n={2} color={AMBER}><strong>Consolidando + Creciendo cerca del techo:</strong> 46 en L1, 66 en L2 — diagnóstico rápido de qué los bloquea.</ActionItem>
          </div>
          <Impact value="~6,000–30,000 / ~7,300–36,700 órdenes/mes" desc="rango entre 20% y 100% de los candidatos cruzando de nivel, L1 / L2 — el extremo alto depende de que los Pre-Escalando crucen a Escalando" />
        </div>

        {/* ATAQUE 3 */}
        <div style={sectionLabel}>Ataque 3 · Próximo mes · Activar Iniciando (solo si 1 y 2 van bien) <span style={lensChip("#4338CA", "#EEF2FF", "#C7D2FE")}>Lente 1 + Lente 2</span></div>
        <div style={{ ...card, borderTop: `4px solid ${BLUE}` }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={tagChip(BLUE, BLU_BG)}>Crecimiento base</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: NAVY }}>Crecer los Iniciando hacia Creciendo</span>
          </div>

          <LensCompare
            l1={{ ...ATAQUE3_L1, rows: [] }}
            l2={{ ...ATAQUE3_L2, rows: [] }}
          />

          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12, maxWidth: "58ch" }}>
            El nivel más poblado en ambos lentes (63% de L1, 64% de L2 de los activos con nivel) genera la menor proporción de volumen. Cruzar el umbral de 51 órdenes/mes (avg 6m) es la meta — mínimo +31 sobre el promedio actual.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <ActionItem n={1} color={BLUE}><strong>222 (L1) / 385 (L2) ya están en el 25% superior del nivel</strong> (cerca del techo) — cruzar esos primero.</ActionItem>
            <ActionItem n={2} color={BLUE}><strong>Catálogo y demanda:</strong> filtrar por SKUs activos y conversión antes de invertir acompañamiento.</ActionItem>
          </div>
          <Impact value="~5,500 / ~9,150 órdenes/mes" desc="si 20% de los Iniciando (177u L1 / 305u L2) llega apenas al piso de Creciendo — hasta ~23,500/~43,900 si llegaran al promedio pleno" />
        </div>

        {/* LA VERDAD */}
        <div style={sectionLabel}>La verdad sobre 600K</div>
        <div style={{ background: NAVY, borderRadius: 10, padding: "18px 20px" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,.35)", marginBottom: 10 }}>Mirada conservadora — 2 lentes, sin desagregar subtipos</div>
          {TRUTH.map((t, i) => {
            const parts = t.split(/:(.+)/);
            const hasColon = parts.length > 1 && t.indexOf(":") < 90;
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
          Datos: fact_marcas.csv · dim_marcas.csv — corte de información 20-jul-2026 (mes cerrado más reciente: jun-2026) · KAMs válidos: 21553 y 71445<br />
          L1 = comercial_id 71445/21553 (4,309u) · L2 = ecosistema completo (9,251u), ambos regidos por ordenes_mes_propias · Madurez: promedio 6 meses completos (ene–jun 2026)<br />
          v2 · Análisis agente Data_Brands · Uso interno Célula Brands Success · Jul 2026
        </div>
      </div>
    </main>
  );
}
