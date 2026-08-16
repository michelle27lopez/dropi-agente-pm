"use client";

import { useEffect, useState } from "react";
import { Gauge, Timer, Percent, Package, HeartPulse, Users, ChevronRight } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

type TimeMetric = {
  scope: string;
  promedio_activacion_dias: number | null;
  promedio_primera_orden_dias: number | null;
};

type MonthlyRow = {
  month_number: number;
  contactos_real: number | null;
  listos_real: number | null;
  promedio_activacion_dias: number | null;
  promedio_primera_orden_dias: number | null;
};

// Metas reales ya usadas en /proyectos/time-to-value/metricas (línea ~200:
// "Promedio activación" ≤5 días, "Promedio primera orden" ≤25 días) — no se
// inventan umbrales nuevos.
const TARGETS = { activacion: 5, primera_orden: 25 } as const;

// Bucketing "No alcanzada / En camino / En meta" (2026-08-07, criterio propio
// para acercar el pill a 3 estados como en la referencia de Michelle): en
// meta si ya cumple, en camino si está a menos de 20% de la meta, no
// alcanzada en el resto. El 20% es una regla de UI para clasificar el pill,
// no un dato — queda documentado por transparencia.
function statusFor(value: number, target: number): "success" | "warning" | "danger" {
  if (value <= target) return "success";
  if (value <= target * 1.2) return "warning";
  return "danger";
}

const STATUS_LABEL: Record<"success" | "warning" | "danger", string> = {
  success: "En meta",
  warning: "En camino",
  danger: "No alcanzada",
};

function Sparkline({ data, color }: { data: number[]; color: string }) {
  if (data.length < 2) return null;
  const points = data.map((v, i) => ({ i, v }));
  const gradientId = `midia-kpi-spark-${color.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div className="midia-kpi-spark">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={points} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.28} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function KpiCard({
  variant,
  icon,
  label,
  value,
  meta,
  pill,
  spark,
  sparkColor,
}: {
  variant: "accent" | "info" | "success" | "warning" | "danger" | "empty";
  icon: React.ReactNode;
  label: string;
  value: string;
  meta: string | null;
  pill: { tone: "success" | "warning" | "danger" | "neutral"; label: string } | null;
  spark: number[];
  sparkColor: string;
}) {
  return (
    <div className={`midia-kpi-card midia-kpi-card--${variant}`}>
      <div className="midia-kpi-card-top">
        <span className="midia-kpi-icon">{icon}</span>
        <span className="midia-kpi-label">{label}</span>
      </div>
      <p className="midia-kpi-value">{value}</p>
      {meta && <p className="midia-kpi-meta">{meta}</p>}
      {pill && <span className={`midia-kpi-pill midia-kpi-pill--${pill.tone}`}>{pill.label}</span>}
      <Sparkline data={spark} color={sparkColor} />
    </div>
  );
}

// KPI de célula del Q3 (Activación de proveedores · Time-to-Value, ver
// [[project_supplier_success_okr]]) — reusa /api/ttv (ttv_time_metrics y
// ttv_monthly_data), no crea una fuente de datos nueva.
//
// Excepción de diseño confirmada por Michelle (2026-08-07, mismo criterio
// que el topbar/chrome global): color libre en esta sección. Ver
// [[project_darwin_pd_dashboard]].
//
// 5 KPIs pedidos por Michelle: Órdenes movilizadas, Tasa de activación,
// Tiempo de activación, Retención, Usuarios activos. Suppliers hoy solo
// tiene dato real para "Tiempo de activación" (2 cards, bruta/neta) y "Tasa
// de activación" (derivada de listos_real/contactos_real, con sparkline del
// histórico mensual real de ttv_monthly_data). "Órdenes movilizadas",
// "Retención" y "Usuarios activos" no tienen ninguna fuente de Suppliers en
// el hub (lo que existe con esos nombres en /celula/[slug] es de Seller
// Success, otro vertical) — se muestran como cards "sin dato aún" a pedido
// explícito de Michelle.
export default function KpiPreviewPanel() {
  const [globalMetric, setGlobalMetric] = useState<TimeMetric | null | undefined>(undefined);
  const [monthly, setMonthly] = useState<MonthlyRow[]>([]);

  useEffect(() => {
    fetch("/api/ttv")
      .then((res) => res.json())
      .then((data) => {
        const metrics: TimeMetric[] = data.timeMetrics ?? [];
        setGlobalMetric(metrics.find((m) => m.scope === "global") ?? null);
        setMonthly((data.monthly ?? []).slice().sort((a: MonthlyRow, b: MonthlyRow) => a.month_number - b.month_number));
      })
      .catch(() => setGlobalMetric(null));
  }, []);

  if (globalMetric === undefined) return null;

  const activacionSpark = monthly.filter((m) => m.promedio_activacion_dias != null).map((m) => m.promedio_activacion_dias as number);
  const primeraOrdenSpark = monthly
    .filter((m) => m.promedio_primera_orden_dias != null)
    .map((m) => m.promedio_primera_orden_dias as number);

  const tasaRows = monthly.filter((m) => m.contactos_real != null && m.contactos_real > 0);
  const tasaSpark = tasaRows.map((m) => Math.round(((m.listos_real ?? 0) / (m.contactos_real as number)) * 100));
  const tasaActual = tasaSpark.length > 0 ? tasaSpark[tasaSpark.length - 1] : null;

  return (
    <div className="midia-panel" style={{ animationDelay: "0ms" }}>
      <div className="midia-panel-header">
        <div className="midia-panel-header-left">
          <span className="midia-panel-icon">
            <Gauge size={14} />
          </span>
          <span className="midia-panel-label">Activación de proveedores · Q3</span>
        </div>
      </div>
      {globalMetric === null ? (
        <p style={{ fontSize: 13, color: "var(--muted)", margin: "0 20px 16px" }}>
          Sin datos de Time to Value todavía.
        </p>
      ) : (
        <div className="midia-kpi-grid">
          <KpiCard
            variant="accent"
            icon={<Timer size={16} />}
            label="Activación promedio"
            value={globalMetric.promedio_activacion_dias != null ? `${globalMetric.promedio_activacion_dias}d` : "—"}
            meta={`Meta: ≤ ${TARGETS.activacion}d`}
            pill={
              globalMetric.promedio_activacion_dias != null
                ? (() => {
                    const s = statusFor(globalMetric.promedio_activacion_dias as number, TARGETS.activacion);
                    return { tone: s, label: STATUS_LABEL[s] };
                  })()
                : null
            }
            spark={activacionSpark}
            sparkColor="var(--dropi)"
          />
          <KpiCard
            variant="info"
            icon={<Timer size={16} />}
            label="Primera orden promedio"
            value={globalMetric.promedio_primera_orden_dias != null ? `${globalMetric.promedio_primera_orden_dias}d` : "—"}
            meta={`Meta: ≤ ${TARGETS.primera_orden}d`}
            pill={
              globalMetric.promedio_primera_orden_dias != null
                ? (() => {
                    const s = statusFor(globalMetric.promedio_primera_orden_dias as number, TARGETS.primera_orden);
                    return { tone: s, label: STATUS_LABEL[s] };
                  })()
                : null
            }
            spark={primeraOrdenSpark}
            sparkColor="var(--info)"
          />
          <KpiCard
            variant="success"
            icon={<Percent size={16} />}
            label="Tasa de activación"
            value={tasaActual != null ? `${tasaActual}%` : "—"}
            meta={tasaActual != null ? "Listos / contactados del mes" : null}
            pill={tasaActual != null ? { tone: "neutral", label: "Dato del pipeline TTV" } : null}
            spark={tasaSpark}
            sparkColor="var(--success)"
          />
          <KpiCard
            variant="empty"
            icon={<Package size={16} />}
            label="Órdenes movilizadas"
            value="—"
            meta={null}
            pill={{ tone: "neutral", label: "Sin dato aún" }}
            spark={[]}
            sparkColor="var(--muted)"
          />
          <KpiCard
            variant="empty"
            icon={<HeartPulse size={16} />}
            label="Retención"
            value="—"
            meta={null}
            pill={{ tone: "neutral", label: "Sin dato aún" }}
            spark={[]}
            sparkColor="var(--muted)"
          />
          <KpiCard
            variant="empty"
            icon={<Users size={16} />}
            label="Usuarios activos"
            value="—"
            meta={null}
            pill={{ tone: "neutral", label: "Sin dato aún" }}
            spark={[]}
            sparkColor="var(--muted)"
          />
        </div>
      )}
      <a
        href="/metricas?p=time-to-value"
        className="midia-panel-link"
        style={{ display: "inline-flex", margin: "14px 20px 16px" }}
      >
        Ver métricas completas
        <ChevronRight size={14} />
      </a>
    </div>
  );
}
