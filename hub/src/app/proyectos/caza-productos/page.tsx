"use client";

import { useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts";

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13,
};
const tdR: React.CSSProperties = { ...tdStyle, textAlign: "right" };
const thR: React.CSSProperties = { ...thStyle, textAlign: "right" };

const ACCENT = "#EC4899";       // Dropshippers
const ACCENT_BG = "#FDF2F8";
const PROV_COLOR = "#10B981";   // Proveedores
const PROV_BG = "#ECFDF5";

// Meta de producto: >80 proveedores activos para Q3, confirmada por Michelle
// (ya citada en Próximos pasos, paso 2) — no es una cifra derivada de datos.
const PROV_ACTIVOS_META = 80;
const PROV_ACTIVOS_ACTUAL = 56; // Fuente: Dropi DB, última cifra conocida (Q2), sin dato nuevo en Q3.

// Experimento activo · sin desarrollo — definido 06/07/2026.
const EXPERIMENTO = {
  nombre: "Reactivación manual de proveedores premium inactivos",
  estado: "Por iniciar",
  hipotesis: "Si Ops/CS contacta directamente (WhatsApp o llamada) a proveedores premium/verificados que entraron al módulo pero nunca enviaron oferta, o que enviaron antes y pararon, un % relevante vuelve a activarse.",
  muestra: "15–20 proveedores premium/verificados inactivos en Caza Productos.",
  accion: "Contacto directo 1:1 ofreciendo ayuda para publicar/enviar su primera oferta esta semana.",
  ventana: "1 semana de contacto + 1 semana de observación.",
  metrica: "% de los contactados que envía al menos 1 oferta en los 7 días posteriores al contacto.",
  metaExito: "20–30% reactivados (4–6 de 15–20).",
  aprendizaje: "Si funciona: el problema es de fricción/confianza, arreglable con soporte humano u onboarding. Si no reactiva a nadie pese al contacto 1:1: el problema es más estructural — el canal no les interesa y hay que replantear la propuesta de valor para proveedores.",
};

const axisTick = { fontSize: 11, fill: "#6B7280" };
const gridStroke = "#E5E7EB";
const tooltipStyle = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const labelStyle = { fontSize: 10, fill: "#6B7280", fontWeight: 700 };

// ─── KPI strip (snapshot global, no varía por período) ───────────────────────
const KPIS = [
  { label: "Dropi base plataforma", value: "6.234", sub: "Total activos · abr–jun 2026",              color: "var(--fg)", bg: "#F8FAFC", note: "Fuente: Dropi DB"        },
  { label: "Prov. activos",         value: "56",    sub: "Sin cifra nueva Q3 · última de Q2",         color: "#F59E0B",   bg: "#FFFBEB", note: "Crítico: ratio 1:30"    },
  { label: "Conversión dropi",      value: "44.1%", sub: "Q3 jun–jul · nuevo máximo (Q2: 34.1%)",     color: "#10B981",   bg: "#ECFDF5", note: "Fuente: UserPilot"      },
  { label: "CSAT «no avanzó»",      value: "55.6%", sub: "Q3 · subió desde 42.9% en Q2",              color: "#EF4444",   bg: "#FEF2F2", note: "Retrocede"              },
  { label: "Acordó precio Q3",      value: "0%",    sub: "Cayó desde 21.4% en Q2 · opción sigue activa", color: "#EF4444", bg: "#FEF2F2", note: "Señal PMF se enfría"     },
  { label: "Clics WhatsApp Q3",     value: "8",     sub: "↑33% vs Q2 (6) · KPI real",                color: "#8B5CF6",   bg: "#F5F3FF", note: "Tendencia positiva"     },
];

// ─── Tipos ────────────────────────────────────────────────────────────────────
type CsatItem = { label: string; pct: number; color: string };

type DropiMetrics = {
  crearonPublicacion: number;
  publicaron: number;
  conversion: number; // %
  clicWhatsapp: number | null;
  siAcuerdo: number | null;
  noAcuerdo: number | null;
  recurrencia: number | null; // %
};

type ProveedorMetrics = {
  vieronDetalle: number | null;
  crearonOferta: number | null;
  enviaronOferta: number | null;
  tasaEnvio: number | null; // % — fórmula confirmada en UserPilot: enviaron/(crearon+enviaron)*100
};

type Periodo = {
  id: string;
  fechas: string;
  cadencia: "Semanal" | "Quincenal";
  hallazgo: string;
  hallazgoColor: string;
  dropi: DropiMetrics;
  proveedor: ProveedorMetrics;
  csat: { respuestas: number; items: CsatItem[] } | null;
  ces: { respuestas: number; items: CsatItem[] } | null;
  notasMetodologicas?: string[];
};

// ─── Datos reales · Bitácora UX · 8 abr – 1 jul 2026 ─────────────────────────
const PERIODOS: Periodo[] = [
  {
    id: "S1", fechas: "8–15 abr 2026", cadencia: "Semanal",
    hallazgo: "Bug WhatsApp 0 clics", hallazgoColor: "#EF4444",
    dropi: { crearonPublicacion: 368, publicaron: 105, conversion: 28.5, clicWhatsapp: 0, siAcuerdo: null, noAcuerdo: null, recurrencia: 45 },
    proveedor: { vieronDetalle: null, crearonOferta: null, enviaronOferta: 28, tasaEnvio: null },
    csat: null, ces: null,
  },
  {
    id: "S2", fechas: "15–22 abr 2026", cadencia: "Semanal",
    hallazgo: "PMF en nicho detectado", hallazgoColor: "#10B981",
    dropi: { crearonPublicacion: 436, publicaron: 113, conversion: 25.9, clicWhatsapp: null, siAcuerdo: null, noAcuerdo: null, recurrencia: 81.4 },
    proveedor: { vieronDetalle: null, crearonOferta: null, enviaronOferta: null, tasaEnvio: null },
    csat: null, ces: null,
  },
  {
    id: "S3", fechas: "22–29 abr 2026", cadencia: "Semanal",
    hallazgo: "Live event · 26.6% acuerdos", hallazgoColor: "#10B981",
    dropi: { crearonPublicacion: 430, publicaron: 113, conversion: 26.3, clicWhatsapp: 22, siAcuerdo: null, noAcuerdo: null, recurrencia: 96 },
    proveedor: { vieronDetalle: null, crearonOferta: null, enviaronOferta: 25, tasaEnvio: null },
    csat: null, ces: null,
  },
  {
    id: "S4", fechas: "29 abr–12 may 2026", cadencia: "Semanal",
    hallazgo: "Post-live decay", hallazgoColor: "#F59E0B",
    dropi: { crearonPublicacion: 402, publicaron: 106, conversion: 26.4, clicWhatsapp: null, siAcuerdo: null, noAcuerdo: null, recurrencia: 50.9 },
    proveedor: { vieronDetalle: null, crearonOferta: null, enviaronOferta: null, tasaEnvio: null },
    csat: null, ces: null,
  },
  {
    id: "Q1", fechas: "14–28 may 2026", cadencia: "Quincenal",
    hallazgo: "Discovery · mínimo histórico", hallazgoColor: "#EF4444",
    dropi: { crearonPublicacion: 882, publicaron: 150, conversion: 17, clicWhatsapp: 2, siAcuerdo: null, noAcuerdo: null, recurrencia: null },
    proveedor: { vieronDetalle: null, crearonOferta: null, enviaronOferta: 11, tasaEnvio: null },
    csat: null,
    ces: {
      respuestas: 14,
      items: [
        { label: "1 — Bug técnico (muy difícil)", pct: 21.4, color: "#EF4444" },
        { label: "4 — Aceptable",                 pct: 14.3, color: "#F59E0B" },
        { label: "5 — Muy fácil (sin problemas)", pct: 64.3, color: "#10B981" },
      ],
    },
    notasMetodologicas: [
      "El embudo detallado (vieron detalle / crearon oferta) queda como \"sin dato\" para Q1: los valores 172/13/8 que el archivo original etiquetaba como \"Q1\" tienen fechas (28 may–11 jun) y un enviaron-oferta (8) que en realidad coinciden con Q2 — se reasignaron a Q2 en este rebuild. Confirmar con UserPilot cuál es el embudo real de Q1.",
    ],
  },
  {
    id: "Q2", fechas: "28 may–11 jun 2026", cadencia: "Quincenal",
    hallazgo: "Máximo histórico · Clarity", hallazgoColor: "#10B981",
    dropi: { crearonPublicacion: 700, publicaron: 239, conversion: 34.1, clicWhatsapp: 6, siAcuerdo: 1, noAcuerdo: null, recurrencia: null },
    proveedor: { vieronDetalle: 172, crearonOferta: 13, enviaronOferta: 8, tasaEnvio: 38.1 },
    csat: {
      respuestas: 14,
      items: [
        { label: "La negociación no avanzó", pct: 42.9, color: "#EF4444" },
        { label: "Estamos conversando",        pct: 28.6, color: "#F59E0B" },
        { label: "Ya acordamos precio",        pct: 21.4, color: "#10B981" },
        { label: "Ya estoy vendiendo",         pct: 7.1,  color: "#10B981" },
      ],
    },
    ces: null,
    notasMetodologicas: [
      "El embudo de proveedores (172 vieron detalle / 13 crearon oferta / 8 enviaron oferta) se reasignó aquí desde una sección que el archivo original rotulaba \"Q1\" — las fechas (28 may–11 jun) y el valor de enviaron oferta (8) coinciden con Q2, no con Q1.",
    ],
  },
  {
    id: "Q3", fechas: "16 jun–1 jul 2026", cadencia: "Quincenal",
    hallazgo: "Conv. sube, CSAT retrocede", hallazgoColor: "#F59E0B",
    dropi: { crearonPublicacion: 469, publicaron: 207, conversion: 44.1, clicWhatsapp: 8, siAcuerdo: 1, noAcuerdo: 4, recurrencia: null },
    proveedor: { vieronDetalle: 214, crearonOferta: 16, enviaronOferta: 12, tasaEnvio: 42.86 },
    csat: {
      respuestas: 18,
      items: [
        { label: "La negociación no avanzó",             pct: 55.6, color: "#EF4444" },
        { label: "Estamos conversando",                   pct: 27.8, color: "#F59E0B" },
        { label: "Ya estoy vendiendo",                    pct: 11.1, color: "#10B981" },
        { label: "Ya hice un pedido / separé stock 🆕",   pct: 5.6,  color: "#10B981" },
        { label: "Ya acordamos precio",                   pct: 0,    color: "#9CA3AF" },
      ],
    },
    ces: null,
    notasMetodologicas: [
      "CES proveedores sin respuestas nuevas en Q3: 0 de 2 mostradas completadas — no se puede confirmar si el bug \"no se envió mi oferta\" (visto en Q1) persiste.",
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function withPct(items: { label: string; value: number }[]) {
  const max = Math.max(...items.map(i => i.value), 1);
  return items.map(i => ({ ...i, pct: Math.round((i.value / max) * 100) }));
}

function BarRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>{label}</div>
      <div style={{ height: 26, background: "#F3F4F6", borderRadius: 7, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${Math.max(pct, 8)}%`, background: color, borderRadius: 7,
          display: "flex", alignItems: "center", paddingLeft: 10, minWidth: 34,
        }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{value}</span>
        </div>
      </div>
    </div>
  );
}

function FunnelStep({ n, label, value, pctOfTop, color, sub }: { n: number; label: string; value: number; pctOfTop: number; color: string; sub?: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: "50%", background: color,
            color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>{n}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{label}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ fontSize: 17, fontWeight: 800, color }}>{value}</span>
          <span style={{ fontSize: 11, color: "var(--muted)", width: 42, textAlign: "right" }}>{pctOfTop.toFixed(1)}%</span>
        </div>
      </div>
      <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden", marginLeft: 30 }}>
        <div style={{ height: "100%", width: `${Math.max(Math.min(pctOfTop, 100), 1.5)}%`, background: color, borderRadius: 999 }} />
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--muted)", marginLeft: 30, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Meter({ label, value, target, color, unit }: { label: string; value: number; target: number; color: string; unit?: "count" | "pct" }) {
  const rawPct = (value / target) * 100;
  const fmt = (n: number) => (n < 1 ? n.toFixed(1) : n.toFixed(0));
  const fillPct = Math.min(Math.max(rawPct, 1.5), 100);
  const valueLabel = unit === "pct" ? `${fmt(value)}%` : String(value);
  const targetLabel = unit === "pct" ? `meta ${target}%` : `/ ${target}`;
  return (
    <div style={{ marginBottom: 4 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{valueLabel} <span style={{ color: "var(--muted)", fontWeight: 600 }}>{targetLabel}</span></span>
      </div>
      <div style={{ height: 12, background: `${color}1A`, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${fillPct}%`, background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function Narrativa({ role, color, bg, hallazgo, detalle }: { role: string; color: string; bg: string; hallazgo: string; detalle: string }) {
  return (
    <div style={{ padding: "16px 18px", background: bg, borderRadius: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        🔎 {role} · Hallazgo clave
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", lineHeight: 1.4, marginBottom: 8 }}>{hallazgo}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{detalle}</div>
    </div>
  );
}

function KpiCard({ label, value, color, delta, deltaUnit }: { label: string; value: string | number; color: string; delta?: number | null; deltaUnit?: string }) {
  return (
    <div style={{ ...card, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      {delta != null && (
        <div style={{ fontSize: 11, color: delta > 0 ? "#10B981" : delta < 0 ? "#EF4444" : "var(--muted)", marginTop: 4, fontWeight: 600 }}>
          {delta > 0 ? "↑" : delta < 0 ? "↓" : "="} {Math.abs(delta)}{deltaUnit ?? ""} vs. período anterior
        </div>
      )}
    </div>
  );
}

function CsatCard({ title, respuestas, items, nota, notaColor, notaBg }: {
  title: string; respuestas: number; items: CsatItem[];
  nota?: string; notaColor?: string; notaBg?: string;
}) {
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
        <div style={sectionTitle}>{title}</div>
        <span style={tag("#F59E0B", "#FFFBEB")}>{respuestas} resp.</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {items.map(c => (
          <div key={c.label}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{c.label}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: c.color }}>{c.pct}%</span>
            </div>
            <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${c.pct}%`, background: c.color, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
      {nota && (
        <div style={{ marginTop: 14, padding: "10px 12px", background: notaBg ?? "#F8FAFC", borderRadius: 8, fontSize: 12, color: notaColor ?? "var(--muted)", border: "1px solid var(--border)", lineHeight: 1.4 }}>
          {nota}
        </div>
      )}
    </div>
  );
}

function SinDatoCard({ title, motivo }: { title: string; motivo: string }) {
  return (
    <div style={{ ...card, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", gap: 6, color: "var(--muted)" }}>
      <div style={sectionTitle}>{title}</div>
      <div style={{ fontSize: 12, lineHeight: 1.4 }}>{motivo}</div>
    </div>
  );
}

// ─── Panel de un período ──────────────────────────────────────────────────────
function PeriodoPanel({ p, prev }: { p: Periodo; prev: Periodo | null }) {
  const d = p.dropi;
  const pr = p.proveedor;

  const dropiDetalle =
    `${d.crearonPublicacion.toLocaleString("es-CO")} dropis intentaron crear una publicación, ${d.publicaron} publicaron (${d.conversion}% conversión)` +
    (d.recurrencia != null ? `, recurrencia de ${d.recurrencia}%` : "") +
    (d.clicWhatsapp != null ? `, ${d.clicWhatsapp} clics a WhatsApp` : "") +
    (d.siAcuerdo != null ? `, ${d.siAcuerdo} acuerdo${d.siAcuerdo === 1 ? "" : "s"} registrado${d.siAcuerdo === 1 ? "" : "s"}` : "") +
    ".";

  const provDetalle = pr.enviaronOferta != null
    ? `${pr.enviaronOferta} proveedores enviaron oferta` +
      (pr.vieronDetalle != null ? ` de ${pr.vieronDetalle} que vieron el detalle (${pr.crearonOferta} crearon oferta, ${pr.tasaEnvio}% tasa de envío)` : "") +
      "."
    : "Sin dato de proveedores que enviaron oferta este período.";

  const whatsappPct = d.clicWhatsapp != null ? (d.clicWhatsapp / d.crearonPublicacion) * 100 : null;
  const acuerdoPct = d.siAcuerdo != null ? (d.siAcuerdo / d.crearonPublicacion) * 100 : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={tag(ACCENT, ACCENT_BG)}>{p.id}</span>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{p.fechas}</span>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>· {p.cadencia}</span>
      </div>

      {p.notasMetodologicas?.map(n => (
        <div key={n} style={{ fontSize: 12, color: "#78350F", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 12px", lineHeight: 1.4 }}>
          ⚠️ {n}
        </div>
      ))}

      <Narrativa role="Dropshippers" color={ACCENT} bg={ACCENT_BG} hallazgo={p.hallazgo} detalle={dropiDetalle} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
        <KpiCard label="Crearon publicación" value={d.crearonPublicacion} color={ACCENT} delta={prev ? d.crearonPublicacion - prev.dropi.crearonPublicacion : null} />
        <KpiCard label="Publicaron" value={d.publicaron} color="#3B82F6" delta={prev ? d.publicaron - prev.dropi.publicaron : null} />
        <KpiCard label="Conversión" value={`${d.conversion}%`} color="#10B981" delta={prev ? Number((d.conversion - prev.dropi.conversion).toFixed(1)) : null} deltaUnit="pp" />
        <KpiCard label="Clic WhatsApp" value={d.clicWhatsapp ?? "—"} color="#8B5CF6" delta={prev && d.clicWhatsapp != null && prev.dropi.clicWhatsapp != null ? d.clicWhatsapp - prev.dropi.clicWhatsapp : null} />
      </div>

      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 14 }}>🔻 Embudo Dropshippers</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <FunnelStep n={1} label="Crearon publicación" value={d.crearonPublicacion} pctOfTop={100} color={ACCENT} />
          <FunnelStep n={2} label="Publicaron" value={d.publicaron} pctOfTop={d.conversion} color="#10B981" />
          {whatsappPct != null && d.clicWhatsapp != null && (
            <FunnelStep n={3} label="Clic WhatsApp" value={d.clicWhatsapp} pctOfTop={whatsappPct} color="#8B5CF6" />
          )}
          {acuerdoPct != null && d.siAcuerdo != null && (
            <FunnelStep
              n={whatsappPct != null ? 4 : 3} label="Acuerdo registrado" value={d.siAcuerdo} pctOfTop={acuerdoPct} color="#9CA3AF"
              sub={d.noAcuerdo != null ? `${d.noAcuerdo} marcaron "no acuerdo" en el mismo período` : undefined}
            />
          )}
        </div>
      </div>

      <Narrativa
        role="Proveedores"
        color={PROV_COLOR}
        bg={PROV_BG}
        hallazgo={pr.enviaronOferta != null ? `${pr.enviaronOferta} enviaron oferta` : "Sin dato de embudo de proveedores"}
        detalle={provDetalle}
      />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
        <KpiCard label="Vieron detalle" value={pr.vieronDetalle ?? "—"} color={PROV_COLOR} delta={prev && pr.vieronDetalle != null && prev.proveedor.vieronDetalle != null ? pr.vieronDetalle - prev.proveedor.vieronDetalle : null} />
        <KpiCard label="Crearon oferta" value={pr.crearonOferta ?? "—"} color="#3B82F6" delta={prev && pr.crearonOferta != null && prev.proveedor.crearonOferta != null ? pr.crearonOferta - prev.proveedor.crearonOferta : null} />
        <KpiCard label="Enviaron oferta" value={pr.enviaronOferta ?? "—"} color="#6366F1" delta={prev && pr.enviaronOferta != null && prev.proveedor.enviaronOferta != null ? pr.enviaronOferta - prev.proveedor.enviaronOferta : null} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {p.csat ? (
          <CsatCard title="CSAT Dropi · Estado de la negociación" respuestas={p.csat.respuestas} items={p.csat.items} />
        ) : (
          <SinDatoCard title="CSAT Dropi" motivo="Sin desglose disponible para este período." />
        )}
        {p.ces ? (
          <CsatCard title="CES Proveedores · Facilidad de oferta" respuestas={p.ces.respuestas} items={p.ces.items} />
        ) : (
          <SinDatoCard title="CES Proveedores" motivo="Sin desglose disponible para este período." />
        )}
      </div>
    </div>
  );
}

// ─── Panel de resumen (todos los períodos) ───────────────────────────────────
function ResumenPanel({ periodos }: { periodos: Periodo[] }) {
  const chartData = periodos.map(p => ({
    id: p.id,
    conversion: p.dropi.conversion,
    publicaron: p.dropi.publicaron,
    enviaronOferta: p.proveedor.enviaronOferta ?? undefined,
  }));

  const opcionesCardItemsProv = withPct(
    periodos.filter(p => p.proveedor.enviaronOferta != null).map(p => ({ label: `${p.id} (${p.proveedor.enviaronOferta})`, value: p.proveedor.enviaronOferta! }))
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPI strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 12 }}>
        {KPIS.map(k => (
          <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}`, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>
              {k.label}
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: k.color, lineHeight: 1 }}>
              {k.value}
            </div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, lineHeight: 1.3 }}>{k.sub}</div>
            <div style={{ marginTop: 6, fontSize: 10, background: "#F8FAFC", color: "var(--muted)", padding: "2px 7px", borderRadius: 20, display: "inline-block", fontWeight: 600 }}>
              {k.note}
            </div>
          </div>
        ))}
      </div>

      {/* Meta: proveedores activos */}
      <div style={{ ...card, background: "#FAFAF9" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--fg)", marginBottom: 14 }}>🎯 Meta: proveedores activos</div>
        <Meter label="Proveedores activos (Dropi DB)" value={PROV_ACTIVOS_ACTUAL} target={PROV_ACTIVOS_META} color="#F59E0B" />
      </div>

      {/* Experimento activo */}
      <div style={{ ...card, border: "1px solid #FDE68A", background: "#FFFBEB" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18 }}>🧪</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#78350F" }}>Experimento activo · {EXPERIMENTO.nombre}</div>
              <div style={{ fontSize: 11, color: "#92400E" }}>Sin desarrollo — ataca el cuello de botella de supply (56 proveedores activos vs meta 80)</div>
            </div>
          </div>
          <span style={tag("#D97706", "#FFFBEB")}>{EXPERIMENTO.estado}</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { titulo: "Hipótesis", texto: EXPERIMENTO.hipotesis },
            { titulo: "Muestra", texto: EXPERIMENTO.muestra },
            { titulo: "Acción", texto: EXPERIMENTO.accion },
            { titulo: "Ventana", texto: EXPERIMENTO.ventana },
            { titulo: "Métrica de éxito", texto: `${EXPERIMENTO.metrica} Meta: ${EXPERIMENTO.metaExito}` },
            { titulo: "Qué aprendemos", texto: EXPERIMENTO.aprendizaje },
          ].map(b => (
            <div key={b.titulo} style={{ padding: "10px 12px", background: "#fff", borderRadius: 8, border: "1px solid #FDE68A" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#78350F", marginBottom: 3 }}>{b.titulo}</div>
              <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.4 }}>{b.texto}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Hallazgos clave */}
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 800, color: ACCENT, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          🔎 Hallazgos clave · Discovery Q1–Q3 (mayo–jul 2026)
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "🟢", titulo: "Conversión sigue en máximo histórico — 44.1% Q3",      desc: "Sube de 34.1% (Q2) a 44.1% (Q3) — segundo período consecutivo de mejora (Q1 fue el mínimo histórico con 17%). Ojo: es una mejora de tasa, no de volumen — publicaron menos dropis en términos absolutos (207 vs 239 en Q2), pero cayeron menos que los que intentaron crear (469 vs 700). Sin dato aún de si es mejor calidad de tráfico o solo menos exposición al feature." },
            { icon: "🟡", titulo: "CSAT: posible retroceso, pero muestra chica",     desc: "«No avanzó» sube de 42.9% a 55.6% — en personas reales, 6 de 14 (Q2) → 10 de 18 (Q3). «Acordamos precio» cae de 21.4% a 0%, pero en Q2 eso eran solo 3 personas. Con muestras tan chicas, mover 3-4 respuestas cambia el % ~15 puntos — vigilar con más datos antes de confirmar un retroceso real." },
            { icon: "🔴", titulo: "Supply sigue en mínimos críticos",       desc: "56 proveedores (sin cifra nueva) para 207 publicaciones en Q3. Solo 12 enviaron oferta. La mejora de conversión dropi hace más urgente el problema del lado supply." },
          ].map(h => (
            <div key={h.titulo} style={{ display: "flex", gap: 10, padding: "12px", background: "#F8FAFC", borderRadius: 10, border: "1px solid var(--border)" }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>{h.titulo}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{h.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tendencias */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Dropi · Conversión por período (%)</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={gridStroke} />
              <XAxis dataKey="id" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
              <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="conversion" name="Conversión %" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={40}>
                <LabelList dataKey="conversion" position="top" style={labelStyle} formatter={(v: unknown) => `${v}%`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Proveedores · Enviaron oferta por período</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={gridStroke} />
              <XAxis dataKey="id" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
              <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
              <ReferenceLine y={PROV_ACTIVOS_META} stroke="#9CA3AF" strokeDasharray="4 4" label={{ value: `Meta: ${PROV_ACTIVOS_META} prov. activos`, position: "insideTopRight", fill: "#6B7280", fontSize: 10, fontWeight: 700 }} />
              <Bar dataKey="enviaronOferta" name="Enviaron oferta" fill={PROV_COLOR} radius={[4, 4, 0, 0]} maxBarSize={40}>
                <LabelList dataKey="enviaronOferta" position="top" style={labelStyle} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
            Sin dato en S2 y S4. La meta de {PROV_ACTIVOS_META} es sobre proveedores activos totales, no sobre este conteo por período — se muestra como referencia visual.
          </div>
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>🗂️ Proveedores que enviaron oferta, por período</div>
        {opcionesCardItemsProv.map(it => <BarRow key={it.label} label={it.label} value={String(it.value)} pct={it.pct} color={PROV_COLOR} />)}
      </div>

      {/* Tabla de evolución */}
      <details style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px" }}>
        <summary style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", cursor: "pointer" }}>Ver tabla de evolución completa · S1 – Q3</summary>
        <div style={{ overflowX: "auto", marginTop: 12, border: "1px solid var(--border)", borderRadius: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Período</th>
                <th style={thStyle}>Fechas</th>
                <th style={thR}>Dropi crearon</th>
                <th style={thR}>Publicaron</th>
                <th style={thR}>Conversión</th>
                <th style={thR}>Prov. enviaron</th>
                <th style={thR}>Recurrencia dropi</th>
                <th style={thStyle}>Hallazgo</th>
              </tr>
            </thead>
            <tbody>
              {periodos.map((p, i) => (
                <tr key={p.id} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                  <td style={{ ...tdStyle, fontWeight: 800, color: ACCENT }}>{p.id}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", fontSize: 12 }}>{p.fechas}</td>
                  <td style={{ ...tdR, fontWeight: 700 }}>{p.dropi.crearonPublicacion.toLocaleString("es-CO")}</td>
                  <td style={tdR}>{p.dropi.publicaron}</td>
                  <td style={{ ...tdR, fontWeight: 700, color: p.dropi.conversion >= 25 ? "#10B981" : "#EF4444" }}>{p.dropi.conversion}%</td>
                  <td style={{ ...tdR, color: "#6366F1", fontWeight: 600 }}>{p.proveedor.enviaronOferta ?? "—"}</td>
                  <td style={{ ...tdR, color: "#3B82F6", fontWeight: 600 }}>{p.dropi.recurrencia != null ? `${p.dropi.recurrencia}%` : "—"}</td>
                  <td style={{ ...tdStyle, fontSize: 11, color: p.hallazgoColor, fontWeight: 600 }}>{p.hallazgo}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={2} style={{ ...tdStyle, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>Acumulado S1–Q3</td>
                <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: ACCENT }}>3.687</td>
                <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}>1.033</td>
                <td style={{ ...tdR, fontWeight: 700, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none", color: "#10B981" }}>28.0%</td>
                <td colSpan={3} style={{ ...tdStyle, background: "#F8FAFC", borderTop: "2px solid var(--border)", borderBottom: "none" }}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </details>

      {/* Sesiones de validación con proveedores */}
      <div style={card}>
        <div style={{ marginBottom: 14 }}>
          <div style={sectionTitle}>🗣️ Sesiones de validación con proveedores · 08/07/2026</div>
          <div style={sectionSub}>2 entrevistas moderadas (30 min c/u) · Michelle + Jaime · recorrido en vivo de Caza Productos, Categorización y Descuentos.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 12, marginBottom: 14 }}>
          <div style={{ padding: "14px 16px", borderRadius: 10, background: "#F8FAFC", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--fg)", marginBottom: 4 }}>Gisela · Gold Stone International S.A.S.</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>Multicategoría · 4 años en Dropi</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--fg)", lineHeight: 1.6 }}>
              <li>Usó la herramienta a diario al inicio, luego bajó la frecuencia; ha hecho ofertas pero <strong>nunca cerró un negocio</strong> a través del módulo.</li>
              <li>Motivo principal: después de ofertar <strong>no hay contraoferta ni respuesta</strong> del dropi dentro de la plataforma.</li>
              <li>Mismatch de categoría: en las últimas semanas la mayoría de búsquedas eran de laboratorio/cremas/calzado — ella no maneja esos nichos.</li>
              <li>Evita deliberadamente productos de temporada (mundial, navidad) por riesgo de devoluciones/inventario muerto — y eso es justo lo que veía publicado.</li>
              <li>Sigue negociando por fuera (WhatsApp, base de contactos propia de 4 años) porque le funciona mejor.</li>
              <li>No reporta bugs: el flujo de crear oferta funcionó bien en el recorrido en vivo.</li>
            </ul>
          </div>
          <div style={{ padding: "14px 16px", borderRadius: 10, background: "#F8FAFC", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--fg)", marginBottom: 4 }}>Andrés · Katz Supply (Cup Play)</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 8 }}>Bodega premium/verificada · importador</div>
            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 12, color: "var(--fg)", lineHeight: 1.6 }}>
              <li>~8 de 10 productos buscados no son de su nicho (Amazon, otro país, dimensiones no transportables).</li>
              <li>No sabe si un producto buscado ya tiene <strong>campaña activa</strong> (demanda validada) o si es solo tanteo — le hace dudar si vale la pena cotizar.</li>
              <li>Ha ofertado y no recibido respuesta dentro de la plataforma; toda la negociación real ocurre por WhatsApp externo.</li>
              <li>Su foco es productos/órdenes/garantías; el resto lo percibe como «más administrativo».</li>
            </ul>
          </div>
        </div>
        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, padding: "10px 14px", background: "#FFFBEB", border: "1px solid var(--border)", borderRadius: 10 }}>
          Ambas entrevistas apuntan a la misma causa raíz detrás del CSAT «no avanzó» (55.6% en Q3) y el 0% de acuerdos de precio: no es solo fricción/confianza — hay un <strong>mismatch estructural de categoría</strong> y <strong>ausencia de un loop de negociación dentro del producto</strong> (sin contraoferta ni señal de demanda validada). Esto valida y complementa el experimento de reactivación manual ya definido.
        </div>
      </div>

      {/* Próximos pasos */}
      <div style={card}>
        <div style={{ marginBottom: 14 }}>
          <div style={sectionTitle}>Próximos pasos · priorizado</div>
          <div style={sectionSub}>Plan de acción post Q3 · priorizado por impacto y urgencia · actualizado 08/07/2026 con hallazgos de sesiones de validación.</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {[
            { n: "1", paso: "Medir el CTA «¿No lo encuentras? Pídelo a un proveedor» — ya implementado en el catálogo. Falta instrumentar el clic en UserPilot (evento + funnel) para confirmar si está resolviendo el modelo mental equivocado que generaba abandono antes del formulario.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
            { n: "2", paso: "Activación urgente de proveedores — «Tráfico de proveedores» ya es queja explícita en CSAT. Contacto directo con prov. premium que abandonaron + plan de reactivación. Meta: >80 prov. activos.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
            { n: "3", paso: "Cerrar bug «No se envió mi oferta» — presente desde S1. En Q2, de 13 que crearon oferta solo 8 la enviaron (38.5% pérdida). CES sin respuestas nuevas en Q3 (0 de 2) — no se puede confirmar si persiste.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
            { n: "4", paso: "Investigar por qué el CSAT empeora pese a mejor conversión — «no avanzó» sube a 55.6% en Q3 y «acordamos precio» cae a 0%. Confirmado en sesión 08/07: ambas proveedoras entrevistadas nunca cerraron un negocio por falta de contraoferta/respuesta dentro de la plataforma.", urgencia: "Crítico", color: "#EF4444", bg: "#FEF2F2" },
            { n: "5", paso: "Análisis Clarity profundo — identificar los términos que los dropis intentan buscar cuando entran al módulo. Insumo directo para el roadmap de categorización.", urgencia: "Alta", color: "#F59E0B", bg: "#FFFBEB" },
            { n: "6", paso: "Diseñar prototipo Publicaciones a Ciegas — mostrar solo métricas del dropi (precio, volumen) sin revelar el producto. Testear con 5 dropis exitosos.", urgencia: "Alta", color: "#F59E0B", bg: "#FFFBEB" },
            { n: "7", paso: "Score Dropshipper + Categorización + micro-survey post-WhatsApp — Score visible para proveedores · Filtros por nicho · Survey para capturar cierres reales que hoy son invisibles para el sistema.", urgencia: "Media", color: "#3B82F6", bg: "#EFF6FF" },
            { n: "8", paso: "Habilitar loop de contraoferta dentro de la plataforma — Gold Stone y Katz Supply confirman que hoy la negociación real ocurre 100% por WhatsApp externo porque no hay respuesta/contraoferta visible dentro de Caza Productos tras enviar una oferta.", urgencia: "Alta", color: "#F59E0B", bg: "#FFFBEB" },
            { n: "9", paso: "Mostrar señal de demanda validada (campaña activa) en cada producto buscado — Katz Supply no sabe si un producto pedido ya tiene campaña real o es solo tanteo, lo que le hace dudar si vale la pena cotizar.", urgencia: "Alta", color: "#F59E0B", bg: "#FFFBEB" },
          ].map(p => (
            <div key={p.n} style={{
              display: "flex", gap: 12, alignItems: "flex-start",
              padding: "12px 14px", borderRadius: 10,
              background: "#F8FAFC", border: "1px solid var(--border)",
            }}>
              <div style={{
                width: 24, height: 24, borderRadius: "50%", background: p.color,
                color: "#fff", fontSize: 12, fontWeight: 800, flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{p.n}</div>
              <div style={{ flex: 1, fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{p.paso}</div>
              <span style={tag(p.color, p.bg)}>{p.urgencia}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CazaProductosPage() {
  const isEmbedded = useIsEmbedded();
  const [tabId, setTabId] = useState("resumen");
  const latest = PERIODOS[PERIODOS.length - 1];

  const tabs = [
    { id: "resumen", label: "Resumen" },
    ...PERIODOS.map(p => ({ id: p.id, label: p.id })),
  ];

  const activePeriodIndex = PERIODOS.findIndex(p => p.id === tabId);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      {!isEmbedded && (
        <header style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            ← Dropi PM Tools
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Caza Productos</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={tag(ACCENT, ACCENT_BG)}>CAZ-001</span>
            <span style={tag("#3B82F6", "#EFF6FF")}>Oportunidad · Discovery</span>
            <span style={tag("#EF4444", "#FEF2F2")}>Alerta crítica activa</span>
            <span style={tag("#10B981", "#ECFDF5")}>8 abr – 1 jul 2026</span>
          </div>
        </header>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Caza Productos · Adopción y Retención
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Seguimiento del feature de matching dropi↔proveedor. {PERIODOS.length} períodos evaluados (S1–S4 + Q1 + Q2 + Q3).
            Fuente: <strong>UserPilot · Clarity · Bitácora UX</strong> · actualizado al cierre de {latest.id} ({latest.fechas}).
          </p>
        </div>

        {/* Alerta crítica */}
        <div style={{ background: "linear-gradient(135deg, #EF4444, #F87171)", borderRadius: 14, padding: "18px 20px", color: "#fff" }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>Q3: conversión sigue subiendo, pero CSAT se deteriora — señal mixta</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.95 }}>
            Conversión <strong>44.1% en Q3</strong> (nuevo máximo histórico, vs 34.1% en Q2). Pero CSAT "no avanzó" subió de 42.9% → <strong>55.6%</strong>, y "acordamos precio" cayó de 21.4% → <strong>0%</strong> (la opción sigue activa en la encuesta, solo que nadie la marcó en 18 respuestas). El embudo mejora pero la percepción del dropi empeora. Proveedores activos siguen en <strong>56 — sin cifra nueva</strong>. Clarity y el bloqueante de modelo mental siguen sin confirmación de fix.
          </p>
        </div>

        {/* Tab bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: "var(--bg)", paddingTop: 4, paddingBottom: 4 }}>
          <div style={{
            display: "inline-flex", gap: 2, padding: 4, background: "#F3F4F6",
            borderRadius: 12, maxWidth: "100%", overflowX: "auto",
          }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTabId(t.id)}
                style={{
                  padding: "8px 18px", fontSize: 13, fontWeight: 700, border: "none", borderRadius: 9,
                  background: tabId === t.id ? "#fff" : "transparent",
                  color: tabId === t.id ? ACCENT : "var(--muted)",
                  boxShadow: tabId === t.id ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tabId === "resumen" && <ResumenPanel periodos={PERIODOS} />}
        {activePeriodIndex >= 0 && (
          <PeriodoPanel p={PERIODOS[activePeriodIndex]} prev={activePeriodIndex > 0 ? PERIODOS[activePeriodIndex - 1] : null} />
        )}

        {/* Fuente de datos */}
        <details style={{ ...card, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
          <summary style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", cursor: "pointer" }}>
            Fuente de datos · Cómo actualizar
          </summary>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 12 }}>
            {[
              { icon: "📊", titulo: "Embudos y retención",   desc: "UserPilot Dashboard → Flows y Cohortes. Bitácora actualizada el 01/07/2026. Próxima actualización: cierre Q4." },
              { icon: "😊", titulo: "CSAT y CES",             desc: "UserPilot → Surveys. CSAT dropi con desglose completo en Q2 (14 resp.) y Q3 (18 resp.). CES proveedores con desglose completo solo en Q1 (14 resp.) — sin respuestas nuevas desde entonces." },
              { icon: "🗄️", titulo: "Proveedores activos",    desc: "Dropi DB. Total activos plataforma general. Para Caza Productos específico: proveedores que enviaron oferta en el período (datos parciales, ver panel de cada período)." },
              { icon: "💬", titulo: "WhatsApp (KPI real)",    desc: "Clic al botón WhatsApp en plataforma. S1 tuvo bug (0 clics). Fix en S3 (22 clics). Q1 solo 2 clics — bug parcialmente activo. Sin dato en S2/S4." },
            ].map(f => (
              <div key={f.titulo} style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>{f.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </details>

      </div>
    </main>
  );
}
