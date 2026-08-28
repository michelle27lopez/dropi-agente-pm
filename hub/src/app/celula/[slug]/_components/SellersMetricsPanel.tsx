"use client";

import { useEffect, useState } from "react";

// OKR/NSM + grid de métricas de Sellers, extraído de la home de célula
// (2026-08-17, Jaime) para vivir en /celula/sellers/updates junto al feed de
// updates — la home de célula ya no lo muestra, queda con el mismo panel
// compacto de Proyectos que el resto de células. Self-contained: trae sus
// propios datos vía /api/metrics/sellers, no depende del padre.
type MetricsStats = {
  totalSellers: number;
  activationCount: number;
  activationRate: number;
  activeCount: number;
  activeRate: number;
  bounceCount: number;
  bounceRate: number;
  nsmCurrent: number;
  okrTarget: number;
  percentageToOkr: number;
  gapToOkr: number;
  survivalRate?: number;
  ttvNetoMedian?: number;
  activationRateNet?: number;
  okrTargetCompany?: number;
  percentageToCompanyOKR?: number;
  countries?: Record<string, any>;
};
type FunnelStep = { step: string; count: number; pct: number; color: string };
type SellersMetrics = {
  source: string;
  stats: MetricsStats;
  funnel: FunnelStep[];
};

const sellersCss = `
  .country-tab {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    color: #64748b;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  .country-tab:hover {
    color: #0f172a;
    background: #f8fafc;
    border-color: #cbd5e1;
  }
  .country-tab.active {
    background: linear-gradient(90deg, #F77F00 0%, #ffaa44 100%);
    border-color: transparent;
    color: #ffffff;
    box-shadow: 0 4px 14px rgba(247, 127, 0, 0.25);
  }
`;

export default function SellersMetricsPanel() {
  const [metrics, setMetrics] = useState<SellersMetrics | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("global");

  useEffect(() => {
    fetch("/api/metrics/sellers")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error cargando métricas de Sellers:", err));
  }, []);

  const activeStats = (metrics?.stats?.countries as any)?.[selectedCountry] || metrics?.stats;
  if (!activeStats) return null;

  const totalSellers = activeStats?.totalSellers ?? 0;
  const activationRate = activeStats?.activationRate ?? 0;
  const survivalRate = activeStats?.survivalRate ?? 0;
  const ttvNetoMedian = activeStats?.ttvNetoMedian ?? 0;
  const nsmCurrent = activeStats?.nsmCurrent ?? 0;
  const okrTarget = activeStats?.okrTarget ?? 0;
  const percentageToOkr = activeStats?.percentageToOkr ?? 0;
  const gapToOkr = activeStats?.gapToOkr ?? 0;

  const isGlobal = selectedCountry === "global";
  const ceilingTarget = isGlobal ? 7800000 : okrTarget;
  const actualPctOfCeiling = ceilingTarget > 0 ? (nsmCurrent / ceilingTarget) * 100 : 0;
  const formattedCurrent = nsmCurrent >= 1000000 ? `${(nsmCurrent / 1000000).toFixed(2)}M` : nsmCurrent.toLocaleString();
  const formattedTarget = ceilingTarget >= 1000000 ? `${(ceilingTarget / 1000000).toFixed(2)}M` : ceilingTarget.toLocaleString();

  return (
    <div style={{ marginBottom: 32 }}>
      <style dangerouslySetInnerHTML={{ __html: sellersCss }} />

      {/* Country Filter Tab Bar */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20, background: "#f1f5f9", padding: 6, borderRadius: 12, border: "1px solid #e2e8f0" }}>
        {[
          { key: "global", label: "🌍 Global" },
          { key: "CO", label: "🇨🇴 Colombia" },
          { key: "EC", label: "🇪🇨 Ecuador" },
          { key: "CL", label: "🇨🇱 Chile" },
          { key: "MX", label: "🇲🇽 México" },
          { key: "GT", label: "🇬🇹 Guatemala" },
          { key: "PY", label: "🇵🇾 Paraguay" },
          { key: "PA", label: "🇵🇦 Panamá" },
          { key: "AR", label: "🇦🇷 Argentina" },
          { key: "CR", label: "🇨🇷 Costa Rica" },
          { key: "PE", label: "🇵🇪 Perú" }
        ].map((country) => (
          <button
            key={country.key}
            onClick={() => setSelectedCountry(country.key)}
            className={`country-tab ${selectedCountry === country.key ? "active" : ""}`}
            style={{
              padding: "6px 14px",
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 6
            }}
          >
            {country.label}
          </button>
        ))}
      </div>

      {/* OKR Progress Card — Dynamic Ceiling (Global = 7.8M Holding, Country = CPO Meta Julio) */}
      <div style={{
        background: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: 16, padding: "28px 32px", marginBottom: 24, color: "#0f172a",
        boxShadow: "0 8px 30px rgba(0,0,0,0.05)"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 850, background: "#FFF7ED", color: "#F77F00", border: "1px solid #FFEDD5", padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {isGlobal ? "OKR 1 / KR 1.1 HOLDING · TECHO GLOBAL: 7.80M ÓRDENES/MES" : `TECHO META JULIO CPO (${selectedCountry.toUpperCase()})`}
            </span>
            <h3 style={{ fontSize: 19, fontWeight: 900, letterSpacing: "-0.02em", color: "#0f172a", margin: "8px 0 0" }}>
              {isGlobal ? "Órdenes Movilizadas de Sellers Activos (NSM Global)" : `Órdenes Movilizadas en ${selectedCountry === "CO" ? "Colombia" : selectedCountry === "EC" ? "Ecuador" : selectedCountry === "CL" ? "Chile" : selectedCountry === "MX" ? "México" : selectedCountry === "GT" ? "Guatemala" : selectedCountry === "PY" ? "Paraguay" : selectedCountry === "PA" ? "Panamá" : selectedCountry === "AR" ? "Argentina" : selectedCountry === "CR" ? "Costa Rica" : selectedCountry === "PE" ? "Perú" : selectedCountry}`}
            </h3>
          </div>
          <div style={{ textAlign: "right" }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: "#F77F00" }}>
              {actualPctOfCeiling.toFixed(1)}%
            </span>
            <span style={{ fontSize: 12, color: "#64748b", display: "block" }}>
              {isGlobal ? "del Techo OKR 1.1 (7.80M/mes)" : `alcanzado de la Meta Julio (${percentageToOkr}% proy.)`}
            </span>
          </div>
        </div>

        {/* Progress Bar towards Ceiling */}
        <div style={{ height: 12, background: "#f1f5f9", borderRadius: 999, overflow: "hidden", marginBottom: 16, border: "1px solid #e2e8f0" }}>
          <div style={{
            height: "100%",
            width: `${Math.min(actualPctOfCeiling, 100)}%`,
            background: actualPctOfCeiling >= 100 ? "linear-gradient(90deg, #10B981 0%, #34D399 100%)" : "linear-gradient(90deg, #F77F00 0%, #ffaa44 100%)",
            borderRadius: 999,
          }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, fontSize: 12, borderTop: "1px dashed #e2e8f0", paddingTop: 14 }}>
          <div>
            <span style={{ color: "#64748b", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>Estado Actual (Tabla CPO 1-29 Jul)</span>
            <strong style={{ color: "#0f172a", fontSize: 14, fontWeight: 800 }}>{formattedCurrent}/mes</strong>
            <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>{nsmCurrent.toLocaleString()} ord movilizadas</span>
          </div>
          <div>
            <span style={{ color: "#64748b", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>
              {isGlobal ? "Hito Julio CPO" : "Meta Julio CPO (Techo País)"}
            </span>
            <strong style={{ color: "#0f172a", fontSize: 14, fontWeight: 800 }}>
              {isGlobal ? "3.57M/mes" : `${formattedTarget}/mes`}
            </strong>
            <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, display: "block" }}>
              {isGlobal ? "93.85% alcanzado (100.32% proy)" : `${percentageToOkr}% proy. cumplimiento`}
            </span>
          </div>
          <div>
            <span style={{ color: "#64748b", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>
              {isGlobal ? "Techo OKR 1.1 Holding" : "Brecha a la Meta Julio"}
            </span>
            <strong style={{ color: "#F77F00", fontSize: 14, fontWeight: 900 }}>
              {isGlobal ? "7.80M/mes" : gapToOkr > 0 ? `-${gapToOkr.toLocaleString()} ord` : `+${Math.abs(gapToOkr).toLocaleString()} ord 🎉`}
            </strong>
            <span style={{ fontSize: 11, color: isGlobal ? "#dc2626" : gapToOkr > 0 ? "#dc2626" : "#16a34a", fontWeight: 700, display: "block" }}>
              {isGlobal ? "Brecha: -4.45M ord (43.0% cumpl.)" : gapToOkr > 0 ? "Falta para completar meta" : "Meta del mes superada!"}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid — Termómetros Visuales por Métrica a Escala */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 18 }}>
        {[
          {
            label: "Tasa de Activación Neta",
            value: `${activeStats?.activationRateNet ?? 5.2}%`,
            targetVal: "8.0%",
            progressPct: ((activeStats?.activationRateNet ?? 5.2) / 8.0) * 100,
            meta: "Meta Q3: 8.0% · Brecha: -2.8 pp",
            sub: "% de sellers registrados que logran entregar exitosamente su 1ª orden (TTV neto).",
            color: "#10B981", bg: "#ECFDF5", icon: "⚡"
          },
          {
            label: "Tiempo de Activación Neta (TTV)",
            value: `${ttvNetoMedian} días`,
            targetVal: "< 12.0d",
            progressPct: (12.0 / ttvNetoMedian) * 100,
            meta: "Meta Q3: < 12.0 días · Exceso: +4.0 días",
            sub: "Mediana de días transcurridos desde el registro hasta la 1ª orden entregada.",
            color: "#D97706", bg: "#FEF3C7", icon: "⏱️"
          },
          {
            label: "Tasa de Activación Bruta",
            value: `${activationRate}%`,
            targetVal: "12.0%",
            progressPct: (activationRate / 12.0) * 100,
            meta: "Meta Q3: 12.0% · Brecha: -4.4 pp",
            sub: "% de sellers registrados que crean su 1ª orden en la plataforma (TTFO).",
            color: "#DB2777", bg: "#FCE7F3", icon: "📦"
          },
          {
            label: "Retención a 30 Días",
            value: `${survivalRate}%`,
            targetVal: "75.0%",
            progressPct: (survivalRate / 75.0) * 100,
            meta: "Meta S2: 75.0% · Brecha: -5.62 pp",
            sub: "% de sellers que continúan vendiendo pasados 30 días de su registro.",
            color: "#7C3AED", bg: "#F3E8FF", icon: "🌱"
          },
          {
            label: "Base de Sellers Identificados",
            value: totalSellers.toLocaleString(),
            targetVal: "46.2k DB",
            progressPct: (36056 / totalSellers) * 100,
            meta: "36,056 Dropshippers Target + 8,744 Proveedores",
            sub: "Total de cuentas registradas y auditadas en la base de datos Supabase.",
            color: "#2563EB", bg: "#EFF6FF", icon: "👥"
          },
          {
            label: "Usuarios Activos Diarios (DAU)",
            value: "14,262",
            targetVal: "81.5k MAU",
            progressPct: (14262 / 81521) * 100,
            meta: "MAU Mensual: 81,521 usuarios/mes",
            sub: "Usuarios operando en vivo diariamente (~31% del volumen activo mensual).",
            color: "#16A34A", bg: "#DCFCE7", icon: "🎯"
          }
        ].map((m) => (
          <div key={m.label} style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderLeft: `4px solid ${m.color}`,
            borderRadius: 16,
            padding: "20px 22px",
            boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  {m.label}
                </span>
                <span style={{ fontSize: 18 }}>{m.icon}</span>
              </div>

              <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: 8 }}>
                {m.value}
              </div>

              <div style={{
                background: m.bg,
                padding: "6px 12px",
                borderRadius: 8,
                marginBottom: 12
              }}>
                <div style={{ fontSize: 11, fontWeight: 850, color: m.color, letterSpacing: "0.01em" }}>
                  {m.meta}
                </div>
              </div>

              <div style={{ margin: "10px 0 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>
                  <span style={{ color: "#64748b" }}>Avance a la Meta</span>
                  <span style={{ color: m.color, fontWeight: 900 }}>
                    {m.progressPct.toFixed(1)}%
                  </span>
                </div>

                <div style={{
                  height: 10,
                  background: "#f1f5f9",
                  borderRadius: 999,
                  padding: 1,
                  border: "1px solid #e2e8f0",
                  position: "relative",
                  overflow: "hidden"
                }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min(m.progressPct, 100)}%`,
                    background: `linear-gradient(90deg, ${m.color}cc 0%, ${m.color} 100%)`,
                    borderRadius: 999,
                  }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b", marginTop: 4, fontWeight: 600 }}>
                  <span>0</span>
                  <span>Actual: <strong style={{ color: "#0f172a" }}>{m.value}</strong></span>
                  <span>Meta: <strong style={{ color: m.color }}>{m.targetVal}</strong></span>
                </div>
              </div>
            </div>

            <div style={{
              fontSize: 12,
              color: "#475569",
              fontWeight: 500,
              lineHeight: 1.45,
              borderTop: "1px dashed #e2e8f0",
              paddingTop: 10
            }}>
              {m.sub}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
