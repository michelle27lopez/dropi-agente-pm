"use client";

import { useEffect, useState, useCallback } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type MonthlyData = {
  id: string; month_number: number;
  contactos_meta: number; contactos_real: number | null;
  auditados_meta: number; auditados_real: number | null;
  listos_meta: number;    listos_real:    number | null;
};
type Segment6m = {
  id: string; segment_key: string; segment_label: string; sort_order: number;
  contactos_meta: number; contactos_real: number | null;
  auditados_meta: number; auditados_real: number | null;
  listos_meta: number;    listos_real:    number | null;
  conversion_meta: string;
};
type MonthlySegment = {
  id: string; month_number: number; segment_key: string; sort_order: number;
  contactos_meta: number; contactos_real: number | null;
  auditados_meta: number; auditados_real: number | null;
  listos_meta: number;    listos_real:    number | null;
};
type PipelineMetric = {
  id: string; metric_key: string; metric_label: string; target_pct: string; sort_order: number;
  mes1_real: string | null; mes2_real: string | null; mes3_real: string | null;
  mes4_real: string | null; mes5_real: string | null; mes6_real: string | null;
};
type TimeMetric = {
  id: string; scope: string;
  promedio_activacion_dias: number | null;
  promedio_primera_orden_dias: number | null;
};
type WeeklyData = {
  id: string; month_number: number; week_number: number;
  contactos_meta: number; contactos_real: number | null;
  auditados_meta: number; auditados_real: number | null;
  listos_meta: number;    listos_real:    number | null;
};
type TtvData = {
  monthly: MonthlyData[];
  segments6m: Segment6m[];
  monthlySegments: MonthlySegment[];
  pipelineMetrics: PipelineMetric[];
  timeMetrics: TimeMetric[];
  weeklyData: WeeklyData[];
};
type Tab = "home" | "pipeline" | "mes1" | "mes2" | "mes3" | "mes4" | "mes5" | "mes6";

// ─── Shared styles ───────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700,
  color, background: bg, whiteSpace: "nowrap",
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase",
  letterSpacing: "0.06em", fontWeight: 700,
  padding: "12px 10px", borderBottom: "1px solid var(--border)",
  textAlign: "left", whiteSpace: "nowrap",
};
const tdStyle: React.CSSProperties = {
  padding: "11px 10px", borderBottom: "1px solid var(--border)",
  fontSize: 13, verticalAlign: "middle",
};
const tdR: React.CSSProperties = { ...tdStyle, textAlign: "right" };
const thR: React.CSSProperties = { ...thStyle, textAlign: "right" };
const tfootTd: React.CSSProperties = {
  ...tdStyle,
  background: "#FFF7EF", fontWeight: 700,
  borderBottom: "none", borderTop: "2px solid rgba(247,127,0,0.18)",
};
const tfootTdR: React.CSSProperties = { ...tfootTd, textAlign: "right" };

// ─── EditCell ────────────────────────────────────────────────────────────────
function EditCell({
  value, onSave,
}: { value: string | number | null; onSave: (v: string) => void }) {
  const [v, setV] = useState(value !== null && value !== undefined ? String(value) : "");
  useEffect(() => { setV(value !== null && value !== undefined ? String(value) : ""); }, [value]);
  return (
    <input
      value={v}
      onChange={e => setV(e.target.value)}
      onBlur={() => onSave(v)}
      onKeyDown={e => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
      placeholder="—"
      style={{
        border: "1px dashed var(--border)", borderRadius: 6,
        padding: "4px 6px", width: 64, textAlign: "center",
        fontSize: 13, background: "#FBFCFF", color: "var(--fg)",
        outline: "none", fontFamily: "inherit",
      }}
      onFocus={e => (e.currentTarget.style.borderColor = "var(--dropi)")}
      onBlurCapture={e => (e.currentTarget.style.borderColor = "var(--border)")}
    />
  );
}

// ─── StatusBadge ─────────────────────────────────────────────────────────────
function StatusBadge({ real }: { real: number | string | null }) {
  const has = real !== null && real !== undefined && String(real) !== "" && String(real) !== "—";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", borderRadius: 999,
      padding: "3px 8px", fontSize: 11, fontWeight: 600,
      background: has ? "#ECFDF5" : "#F3F4F6",
      color: has ? "#10B981" : "var(--muted)",
    }}>
      {has ? "Con data" : "Sin data"}
    </span>
  );
}

// ─── KpiCard ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, barColor = "var(--dropi)", barWidth = "100%" }: {
  label: string; value: string; sub: string; barColor?: string; barWidth?: string;
}) {
  return (
    <div style={card}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.4 }}>{sub}</div>
      <div style={{ marginTop: 12, height: 6, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: barWidth, background: barColor, borderRadius: 999, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

// ─── TtvBlock ────────────────────────────────────────────────────────────────
function TtvBlock({
  tm, onSaveActivacion, onSavePrimeraOrden,
}: {
  tm: TimeMetric | undefined;
  onSaveActivacion: (v: string) => void;
  onSavePrimeraOrden: (v: string) => void;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "minmax(240px, 0.9fr) 1fr", gap: 14, alignItems: "stretch" }}>
      {/* Orange card */}
      <div style={{
        background: "linear-gradient(135deg, var(--dropi), #FF8A2B)",
        color: "#fff", borderRadius: 18, padding: "20px",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
        position: "relative", overflow: "hidden", minHeight: 200,
      }}>
        <div style={{
          position: "absolute", width: 220, height: 220, borderRadius: "50%",
          background: "rgba(255,255,255,0.12)", right: -90, bottom: -120, pointerEvents: "none",
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.78)", marginBottom: 6 }}>
            Meta global
          </div>
          <div style={{ fontSize: 50, fontWeight: 800, letterSpacing: "-0.06em", lineHeight: 1 }}>
            ≤ 25 días
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.88)", marginTop: 8, lineHeight: 1.45 }}>
            Registro → Primera orden. Tiempo máximo para que un supplier genere valor real.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
            {[
              { v: "≤ 5 días", l: "Promedio activación" },
              { v: "≤ 25 días", l: "Promedio primera orden" },
            ].map(({ v, l }) => (
              <div key={l} style={{ border: "1px solid rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.15)", borderRadius: 12, padding: 10 }}>
                <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>{v}</div>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.78)", marginTop: 3 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.78)", marginTop: 12, position: "relative", zIndex: 1 }}>
          Primera orden siempre desde el registro: incluye activación + tiempo hasta primera orden.
        </div>
      </div>

      {/* Progress cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {[
          { label: "Promedio activación", sub: "Registro → Listo para vender", target: "≤ 5 días", field: "activacion" as const },
          { label: "Promedio primera orden", sub: "Registro → Primera orden. Incluye activación + tiempo hasta primera orden.", target: "≤ 25 días", field: "primera_orden" as const },
        ].map(({ label, sub, target, field }) => {
          const val = field === "activacion" ? tm?.promedio_activacion_dias : tm?.promedio_primera_orden_dias;
          const onSave = field === "activacion" ? onSaveActivacion : onSavePrimeraOrden;
          const targetDays = field === "activacion" ? 5 : 25;
          const ok = val !== null && val !== undefined && val <= targetDays;
          return (
            <div key={label} style={{ ...card, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
                  {label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                  <EditCell value={val ?? null} onSave={onSave} />
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>días</span>
                  {val !== null && val !== undefined && (
                    <span style={tag(ok ? "#10B981" : "#F59E0B", ok ? "#ECFDF5" : "#FFFBEB")}>
                      {ok ? "OK" : "Revisar"}
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{sub}</div>
              </div>
              <div style={{ marginTop: 12, fontSize: 11, color: "var(--muted)" }}>Target: {target}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── SegmentTable ─────────────────────────────────────────────────────────────
function SegmentTable<T extends {
  id: string; segment_key: string; sort_order: number;
  contactos_meta: number; contactos_real: number | null;
  auditados_meta: number; auditados_real: number | null;
  listos_meta:    number; listos_real:    number | null;
  conversion_meta?: string;
}>({
  rows, onUpdate, showConversion = false,
}: {
  rows: T[];
  onUpdate: (id: string, field: string, v: string) => void;
  showConversion?: boolean;
}) {
  const totals = rows.reduce(
    (acc, r) => ({
      c_meta: acc.c_meta + r.contactos_meta,
      c_real: acc.c_real + (r.contactos_real ?? 0),
      a_meta: acc.a_meta + r.auditados_meta,
      a_real: acc.a_real + (r.auditados_real ?? 0),
      l_meta: acc.l_meta + r.listos_meta,
      l_real: acc.l_real + (r.listos_real ?? 0),
      has_real_c: acc.has_real_c || r.contactos_real !== null,
      has_real_a: acc.has_real_a || r.auditados_real !== null,
      has_real_l: acc.has_real_l || r.listos_real !== null,
    }),
    { c_meta: 0, c_real: 0, a_meta: 0, a_real: 0, l_meta: 0, l_real: 0, has_real_c: false, has_real_a: false, has_real_l: false }
  );
  const LABELS: Record<string, string> = {
    pequenos: "Pequeños / exploratorios",
    "50_300": "50–300 órdenes/mes",
    "300_1000": "300–1.000 órdenes/mes",
    "1000_plus": "+1.000 órdenes/mes",
  };
  const CONV: Record<string, string> = {
    pequenos: "20%", "50_300": "30%", "300_1000": "45%", "1000_plus": "55%",
  };
  return (
    <div style={{ width: "100%", overflowX: "auto", border: "1px solid var(--border)", borderRadius: 12, background: "#fff" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 760 }}>
        <thead>
          <tr>
            <th style={thStyle}>Segmento</th>
            <th style={thR}>C meta</th>
            <th style={thR}>C real</th>
            <th style={thR}>A meta</th>
            <th style={thR}>A real</th>
            <th style={thR}>L meta</th>
            <th style={thR}>L real</th>
            {showConversion && <th style={thR}>Conv. C→L</th>}
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {[...rows].sort((a, b) => a.sort_order - b.sort_order).map(r => (
            <tr key={r.id}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>{LABELS[r.segment_key] ?? r.segment_key}</td>
              <td style={tdR}>{r.contactos_meta.toLocaleString("es-CO")}</td>
              <td style={tdR}><EditCell value={r.contactos_real} onSave={v => onUpdate(r.id, "contactos_real", v)} /></td>
              <td style={tdR}>{r.auditados_meta.toLocaleString("es-CO")}</td>
              <td style={tdR}><EditCell value={r.auditados_real} onSave={v => onUpdate(r.id, "auditados_real", v)} /></td>
              <td style={tdR}>{r.listos_meta.toLocaleString("es-CO")}</td>
              <td style={tdR}><EditCell value={r.listos_real} onSave={v => onUpdate(r.id, "listos_real", v)} /></td>
              {showConversion && <td style={tdR}>{(r as unknown as Segment6m).conversion_meta ?? CONV[r.segment_key]}</td>}
              <td style={tdStyle}><StatusBadge real={r.listos_real} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ ...tfootTd, color: "var(--dropi)" }}>Total</td>
            <td style={tfootTdR}>{totals.c_meta.toLocaleString("es-CO")}</td>
            <td style={tfootTdR}>{totals.has_real_c ? totals.c_real.toLocaleString("es-CO") : "—"}</td>
            <td style={tfootTdR}>{totals.a_meta.toLocaleString("es-CO")}</td>
            <td style={tfootTdR}>{totals.has_real_a ? totals.a_real.toLocaleString("es-CO") : "—"}</td>
            <td style={tfootTdR}>{totals.l_meta.toLocaleString("es-CO")}</td>
            <td style={tfootTdR}>{totals.has_real_l ? totals.l_real.toLocaleString("es-CO") : "—"}</td>
            {showConversion && <td style={tfootTdR}>35% aprox.</td>}
            <td style={tfootTd}><StatusBadge real={totals.has_real_l ? totals.l_real : null} /></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── WeeklyTable ──────────────────────────────────────────────────────────────
function WeeklyTable({ rows, onUpdate }: {
  rows: WeeklyData[];
  onUpdate: (id: string, field: string, v: string) => void;
}) {
  const sorted = [...rows].sort((a, b) => a.week_number - b.week_number);
  const totals = sorted.reduce(
    (acc, r) => ({
      c_meta: acc.c_meta + r.contactos_meta,
      c_real: acc.c_real + (r.contactos_real ?? 0),
      a_meta: acc.a_meta + r.auditados_meta,
      a_real: acc.a_real + (r.auditados_real ?? 0),
      l_meta: acc.l_meta + r.listos_meta,
      l_real: acc.l_real + (r.listos_real ?? 0),
      has_c: acc.has_c || r.contactos_real !== null,
      has_a: acc.has_a || r.auditados_real !== null,
      has_l: acc.has_l || r.listos_real !== null,
    }),
    { c_meta: 0, c_real: 0, a_meta: 0, a_real: 0, l_meta: 0, l_real: 0, has_c: false, has_a: false, has_l: false }
  );
  return (
    <div style={{ width: "100%", overflowX: "auto", border: "1px solid var(--border)", borderRadius: 12, background: "#fff" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
        <thead>
          <tr>
            <th style={thStyle}>Semana</th>
            <th style={thR}>C meta</th>
            <th style={thR}>C real</th>
            <th style={thR}>A meta</th>
            <th style={thR}>A real</th>
            <th style={thR}>L meta</th>
            <th style={thR}>L real</th>
            <th style={thStyle}>Estado</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map(r => (
            <tr key={r.id}>
              <td style={{ ...tdStyle, fontWeight: 600 }}>S{r.week_number}</td>
              <td style={tdR}>{r.contactos_meta}</td>
              <td style={tdR}><EditCell value={r.contactos_real} onSave={v => onUpdate(r.id, "contactos_real", v)} /></td>
              <td style={tdR}>{r.auditados_meta}</td>
              <td style={tdR}><EditCell value={r.auditados_real} onSave={v => onUpdate(r.id, "auditados_real", v)} /></td>
              <td style={tdR}>{r.listos_meta}</td>
              <td style={tdR}><EditCell value={r.listos_real} onSave={v => onUpdate(r.id, "listos_real", v)} /></td>
              <td style={tdStyle}><StatusBadge real={r.listos_real} /></td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ ...tfootTd, color: "var(--dropi)" }}>Total mes</td>
            <td style={tfootTdR}>{totals.c_meta}</td>
            <td style={tfootTdR}>{totals.has_c ? totals.c_real : "—"}</td>
            <td style={tfootTdR}>{totals.a_meta}</td>
            <td style={tfootTdR}>{totals.has_a ? totals.a_real : "—"}</td>
            <td style={tfootTdR}>{totals.l_meta}</td>
            <td style={tfootTdR}>{totals.has_l ? totals.l_real : "—"}</td>
            <td style={tfootTd}><StatusBadge real={totals.has_l ? totals.l_real : null} /></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

// ─── FunnelStep ───────────────────────────────────────────────────────────────
function FunnelRow({ steps }: { steps: { label: string; value: string; sub: string }[] }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${steps.length}, minmax(0,1fr))`, gap: 12 }}>
      {steps.map((s, i) => (
        <div key={s.label} style={{ ...card, position: "relative" }}>
          {i < steps.length - 1 && (
            <span style={{
              position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)",
              fontSize: 16, color: "#D1D5DB", fontWeight: 700, zIndex: 2,
            }}>→</span>
          )}
          <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{s.label}</div>
          <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1 }}>{s.value}</div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{s.sub}</div>
        </div>
      ))}
    </div>
  );
}

// ─── HomeTab ──────────────────────────────────────────────────────────────────
function HomeTab({ data, onUpdate }: { data: TtvData; onUpdate: (t: string, id: string, u: Record<string, unknown>) => void }) {
  const globalTm = data.timeMetrics.find(t => t.scope === "global");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14 }}>
        <KpiCard label="Registros esperados"    value="12.000" sub="Entrada estimada en 6 meses"       barColor="var(--dropi)" />
        <KpiCard label="Contactados necesarios" value="1.760"  sub="Base operativa estimada"           barColor="#3B82F6"      barWidth="15%" />
        <KpiCard label="Auditados esperados"    value="940"    sub="Validación operativa estimada"     barColor="#F59E0B"      barWidth="53%" />
        <KpiCard label="Listos para vender"     value="620"    sub="Meta de salida del experimento"    barColor="#10B981"      barWidth="66%" />
      </div>

      {/* Embudo */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={sectionTitle}>Embudo objetivo</div>
            <div style={sectionSub}>620 es la salida esperada. Contactados y auditados son volumen necesario para llegar a esa meta.</div>
          </div>
        </div>
        <FunnelRow steps={[
          { label: "Registros",   value: "12.000", sub: "Entrada total" },
          { label: "Priorizados", value: "2.400",  sub: "20% de registros" },
          { label: "Contactados", value: "1.760",  sub: "Base gestionada" },
          { label: "Auditados",   value: "940",    sub: "Validación" },
          { label: "Listos",      value: "620",    sub: "Meta final" },
        ]} />
      </div>

      {/* TTV global */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={sectionTitle}>Métrica global de tiempo</div>
            <div style={sectionSub}>Meta global y dos promedios: activación y primera orden desde el registro.</div>
          </div>
          <span style={tag("#10B981", "#ECFDF5")}>TTV</span>
        </div>
        <TtvBlock
          tm={globalTm}
          onSaveActivacion={v => globalTm && onUpdate("ttv_time_metrics", globalTm.id, { promedio_activacion_dias: parseFloat(v) || null })}
          onSavePrimeraOrden={v => globalTm && onUpdate("ttv_time_metrics", globalTm.id, { promedio_primera_orden_dias: parseFloat(v) || null })}
        />
      </div>

      {/* Segmentos */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={sectionTitle}>Segmentos objetivo</div>
            <div style={sectionSub}>Meta total de 6 meses por tipo de proveedor. De aquí salen los 620 listos para vender.</div>
          </div>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>Meta / Real</span>
        </div>
        <SegmentTable
          rows={data.segments6m}
          showConversion
          onUpdate={(id, field, v) =>
            onUpdate("ttv_segments_6m", id, { [field]: parseInt(v) || null })
          }
        />
      </div>
    </div>
  );
}

// ─── PipelineTab ──────────────────────────────────────────────────────────────
function PipelineTab({ data, onUpdate }: { data: TtvData; onUpdate: (t: string, id: string, u: Record<string, unknown>) => void }) {
  const MONTHS = ["mes1", "mes2", "mes3", "mes4", "mes5", "mes6"] as const;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14 }}>
        <KpiCard label="Formulario completo" value="100%" sub="Perfil calificado · base de entrada"         barColor="var(--dropi)" />
        <KpiCard label="Bodega creada"       value="65%"  sub="Meta de avance operativo inicial"            barColor="#3B82F6"      barWidth="65%" />
        <KpiCard label="Auditoría aprobada"  value="24%"  sub="Meta interna de validación operativa"        barColor="#10B981"      barWidth="24%" />
        <KpiCard label="Primera orden"       value="15%"  sub="Meta interna de conversión final"            barColor="#F59E0B"      barWidth="15%" />
      </div>

      {/* Tabla pipeline */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={sectionTitle}>Métricas del pipeline</div>
            <div style={sectionSub}>Movimiento porcentual por etapa. No reemplaza la meta de 620 listos para vender ni el TTV.</div>
          </div>
          <span style={tag("#3B82F6", "#EFF6FF")}>Interno</span>
        </div>
        <div style={{ width: "100%", overflowX: "auto", border: "1px solid var(--border)", borderRadius: 12, background: "#fff" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 860 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, minWidth: 220 }}>Métrica</th>
                <th style={thR}>Target</th>
                <th style={thR}>Mes 1</th>
                <th style={thR}>Mes 2</th>
                <th style={thR}>Mes 3</th>
                <th style={thR}>Mes 4</th>
                <th style={thR}>Mes 5</th>
                <th style={thR}>Mes 6</th>
                <th style={thStyle}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {[...data.pipelineMetrics].sort((a, b) => a.sort_order - b.sort_order).map(pm => (
                <tr key={pm.id}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{pm.metric_label}</td>
                  <td style={{ ...tdR, color: "var(--dropi)", fontWeight: 700 }}>{pm.target_pct}</td>
                  {MONTHS.map(m => {
                    const field = `${m}_real` as keyof PipelineMetric;
                    return (
                      <td key={m} style={tdR}>
                        <EditCell
                          value={pm[field] as string | null}
                          onSave={v => onUpdate("ttv_pipeline_metrics", pm.id, { [field]: v || null })}
                        />
                      </td>
                    );
                  })}
                  <td style={tdStyle}><StatusBadge real={pm.mes1_real} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lectura visual */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={sectionTitle}>Cómo leer esta vista</div>
            <div style={sectionSub}>Cada bloque muestra en qué parte del pipeline se pierden suppliers.</div>
          </div>
          <span style={tag("var(--muted)", "#F3F4F6")}>Lectura</span>
        </div>
        <FunnelRow steps={[
          { label: "Entrada",       value: "100%",    sub: "Formulario completo" },
          { label: "Configuración", value: "65–70%",  sub: "Bodega / producto" },
          { label: "Auditoría",     value: "28–50%",  sub: "Solicitada / en curso" },
          { label: "Aprobación",    value: "24%",     sub: "Auditoría aprobada" },
          { label: "Valor",         value: "15%",     sub: "Primera orden" },
        ]} />
      </div>
    </div>
  );
}

// ─── MonthTab ─────────────────────────────────────────────────────────────────
function MonthTab({
  monthNum, data, onUpdate,
}: {
  monthNum: number;
  data: TtvData;
  onUpdate: (t: string, id: string, u: Record<string, unknown>) => void;
}) {
  const label = `Mes ${monthNum}`;
  const md = data.monthly.find(m => m.month_number === monthNum);
  const segs = data.monthlySegments.filter(s => s.month_number === monthNum);
  const tm = data.timeMetrics.find(t => t.scope === `mes_${monthNum}`);
  const weekRows = data.weeklyData.filter(w => w.month_number === monthNum);

  // Acumulado hasta este mes
  const acum = data.monthly
    .filter(m => m.month_number <= monthNum)
    .reduce(
      (acc, m) => ({
        c_meta: acc.c_meta + m.contactos_meta,
        a_meta: acc.a_meta + m.auditados_meta,
        l_meta: acc.l_meta + m.listos_meta,
        c_real: acc.c_real + (m.contactos_real ?? 0),
        a_real: acc.a_real + (m.auditados_real ?? 0),
        l_real: acc.l_real + (m.listos_real ?? 0),
        has_c: acc.has_c || m.contactos_real !== null,
        has_a: acc.has_a || m.auditados_real !== null,
        has_l: acc.has_l || m.listos_real !== null,
      }),
      { c_meta: 0, a_meta: 0, l_meta: 0, c_real: 0, a_real: 0, l_real: 0, has_c: false, has_a: false, has_l: false }
    );

  if (!md) return <p style={{ color: "var(--muted)", fontSize: 14 }}>Datos no encontrados para {label}.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Resumen + Acumulado */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {/* Resumen mensual */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>{label}</div>
              <div style={sectionSub}>Meta de la cohorte.</div>
            </div>
            <span style={tag("#3B82F6", "#EFF6FF")}>Cohorte</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { l: "Contactos",  meta: md.contactos_meta, real: md.contactos_real, field: "contactos_real" },
              { l: "Auditados",  meta: md.auditados_meta, real: md.auditados_real, field: "auditados_real" },
              { l: "Listos",     meta: md.listos_meta,    real: md.listos_real,    field: "listos_real" },
            ].map(({ l, meta, real, field }) => (
              <div key={l} style={{ background: "#F8F9FA", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6 }}>{l}</div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>{meta}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>Meta</div>
                <div style={{ marginTop: 8 }}>
                  <EditCell value={real} onSave={v => onUpdate("ttv_monthly_data", md.id, { [field]: parseInt(v) || null })} />
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3 }}>Real</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Acumulado */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Acumulado hasta {label}</div>
              <div style={sectionSub}>Meta acumulada desde Mes 1.</div>
            </div>
            <span style={tag("#10B981", "#ECFDF5")}>Corte</span>
          </div>
          <FunnelRow steps={[
            { label: "Contactos", value: acum.c_meta.toLocaleString("es-CO"), sub: acum.has_c ? `Real: ${acum.c_real.toLocaleString("es-CO")}` : "Meta acumulada" },
            { label: "Auditados", value: acum.a_meta.toLocaleString("es-CO"), sub: acum.has_a ? `Real: ${acum.a_real.toLocaleString("es-CO")}` : "Meta acumulada" },
            { label: "Listos",    value: acum.l_meta.toLocaleString("es-CO"), sub: acum.has_l ? `Real: ${acum.l_real.toLocaleString("es-CO")}` : "Meta acumulada" },
          ]} />
        </div>
      </div>

      {/* Seguimiento semanal */}
      {weekRows.length > 0 && (
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Seguimiento semanal</div>
              <div style={sectionSub}>Avance por semana · Contactados, auditados y listos para vender.</div>
            </div>
            <span style={tag("#3B82F6", "#EFF6FF")}>S1 – S4</span>
          </div>
          <WeeklyTable
            rows={weekRows}
            onUpdate={(id, field, v) => onUpdate("ttv_weekly_data", id, { [field]: parseInt(v) || null })}
          />
        </div>
      )}

      {/* TTV cohorte */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={sectionTitle}>TTV de la cohorte</div>
            <div style={sectionSub}>Tiempos reales para los suppliers de {label}.</div>
          </div>
          <span style={tag("#10B981", "#ECFDF5")}>TTV</span>
        </div>
        <TtvBlock
          tm={tm}
          onSaveActivacion={v => tm && onUpdate("ttv_time_metrics", tm.id, { promedio_activacion_dias: parseFloat(v) || null })}
          onSavePrimeraOrden={v => tm && onUpdate("ttv_time_metrics", tm.id, { promedio_primera_orden_dias: parseFloat(v) || null })}
        />
      </div>

      {/* Segmentos del mes */}
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <div style={sectionTitle}>Segmentos · {label}</div>
            <div style={sectionSub}>Meta de contactados, auditados y listos por segmento.</div>
          </div>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>Meta / Real</span>
        </div>
        <SegmentTable
          rows={segs}
          onUpdate={(id, field, v) => onUpdate("ttv_monthly_segments", id, { [field]: parseInt(v) || null })}
        />
      </div>

      {/* Conversión esperada */}
      <div style={card}>
        <div style={{ marginBottom: 16 }}>
          <div style={sectionTitle}>Conversión esperada</div>
          <div style={sectionSub}>Tasas objetivo internas del embudo para {label}.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 12 }}>
          {[
            { label: "Contactados → Auditados", value: "~53%", color: "#3B82F6", bg: "#EFF6FF" },
            { label: "Auditados → Listos",      value: "~66%", color: "#10B981", bg: "#ECFDF5" },
            { label: "Contactados → Listos",    value: "~35%", color: "var(--dropi)", bg: "var(--dropi-light)" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} style={{ ...card, textAlign: "center" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>{label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.03em", color }}>
                {value}
              </div>
              <div style={{ marginTop: 10, height: 4, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", background: color, borderRadius: 999, width: value.replace("~", "").replace("%", "") + "%" }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 11, padding: "2px 8px", borderRadius: 20, display: "inline-block", background: bg, color }}>
                Target
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TtvMetricasPage() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const [data, setData] = useState<TtvData | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    fetch("/api/ttv")
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const onUpdate = useCallback(
    async (table: string, id: string, updates: Record<string, unknown>) => {
      // Optimistic: update local state
      setData(prev => {
        if (!prev) return prev;
        const patch = (arr: { id: string }[]) =>
          arr.map(r => (r.id === id ? { ...r, ...updates } : r));
        return {
          ...prev,
          monthly:          table === "ttv_monthly_data"     ? patch(prev.monthly)          as MonthlyData[]    : prev.monthly,
          segments6m:       table === "ttv_segments_6m"      ? patch(prev.segments6m)       as Segment6m[]      : prev.segments6m,
          monthlySegments:  table === "ttv_monthly_segments" ? patch(prev.monthlySegments)  as MonthlySegment[] : prev.monthlySegments,
          pipelineMetrics:  table === "ttv_pipeline_metrics" ? patch(prev.pipelineMetrics)  as PipelineMetric[] : prev.pipelineMetrics,
          timeMetrics:      table === "ttv_time_metrics"     ? patch(prev.timeMetrics)      as TimeMetric[]     : prev.timeMetrics,
          weeklyData:       table === "ttv_weekly_data"      ? patch(prev.weeklyData)       as WeeklyData[]     : prev.weeklyData,
        };
      });
      // Persist
      await fetch("/api/ttv", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id, updates }),
      });
    },
    []
  );

  const TABS: { key: Tab; label: string }[] = [
    { key: "home",     label: "Home" },
    { key: "pipeline", label: "Pipeline interno" },
    { key: "mes1",     label: "Mes 1" },
    { key: "mes2",     label: "Mes 2" },
    { key: "mes3",     label: "Mes 3" },
    { key: "mes4",     label: "Mes 4" },
    { key: "mes5",     label: "Mes 5" },
    { key: "mes6",     label: "Mes 6" },
  ];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/proyectos/time-to-value" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Time to Value
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Métricas</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>TTV-001</span>
          <span style={tag("var(--muted)", "#F3F4F6")}>📅 6 meses</span>
          <span style={tag("#10B981", "#ECFDF5")}>🎯 620 listos</span>
        </div>
      </header>

      {/* Tabs */}
      <div style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "0 32px", overflowX: "auto",
      }}>
        <div style={{ display: "flex", gap: 2, minWidth: "max-content" }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                border: "none", background: "none", cursor: "pointer",
                padding: "14px 16px", fontSize: 13, fontWeight: 600,
                color: activeTab === t.key ? "var(--dropi)" : "var(--muted)",
                borderBottom: activeTab === t.key
                  ? "2px solid var(--dropi)"
                  : "2px solid transparent",
                whiteSpace: "nowrap", transition: "color 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {loading && <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando datos...</p>}

        {!loading && !data && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>
            Sin datos. Asegúrate de haber ejecutado la migración 007_ttv.sql en Supabase.
          </p>
        )}

        {!loading && data && (
          <>
            {activeTab === "home"     && <HomeTab     data={data} onUpdate={onUpdate} />}
            {activeTab === "pipeline" && <PipelineTab data={data} onUpdate={onUpdate} />}
            {(["mes1","mes2","mes3","mes4","mes5","mes6"] as Tab[]).includes(activeTab) && (
              <MonthTab
                monthNum={parseInt(activeTab.replace("mes", ""))}
                data={data}
                onUpdate={onUpdate}
              />
            )}
          </>
        )}
      </div>
    </main>
  );
}
