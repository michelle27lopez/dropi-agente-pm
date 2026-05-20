"use client";

import type { ConversionData, AgingData } from "@/lib/crm-db";

type Props = { conversion: ConversionData; aging: AgingData };

export function InsightsBanner({ conversion, aging }: Props) {
  const ver = conversion.steps[0];
  const ascV = conversion.steps[1];
  const ascP = conversion.steps[2];

  const insights = [
    {
      label: "Tasa aprobación verificación",
      value: `${ver.tasaAprobacion}%`,
      sub: `${ver.aprobados} aprobados de ${ver.total}`,
      color: "#EF4444",
      icon: "⚠️",
    },
    {
      label: "Tasa aprobación ascenso verificado",
      value: `${ascV.tasaAprobacion}%`,
      sub: `${ascV.aprobados} aprobados · ${ascV.denegados} denegados`,
      color: "#F59E0B",
      icon: "📊",
    },
    {
      label: "Aprobados en ascenso premium",
      value: ascP.aprobados === 0 ? "Ninguno" : `${ascP.aprobados}`,
      sub: `${ascP.denegados} denegados · ${ascP.enEspera} en espera`,
      color: "#6366F1",
      icon: "🔒",
    },
    {
      label: "Atascados más de 90 días",
      value: aging.mas90dias.toString(),
      sub: `${aging.mas180dias} llevan más de 180 días`,
      color: "#EF4444",
      icon: "🚨",
    },
    {
      label: "Tiempo promedio a aprobación",
      value: `~${ver.avgDiasAprobados}d`,
      sub: "Desde registro hasta verificación",
      color: "#6B7280",
      icon: "⏱️",
    },
  ];

  return (
    <div style={{
      background: "#111827",
      padding: "12px 24px",
      display: "flex",
      gap: 0,
      overflowX: "auto",
      borderBottom: "1px solid #1F2937",
    }}>
      {insights.map((ins, i) => (
        <div key={i} style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 20px",
          borderRight: i < insights.length - 1 ? "1px solid #1F2937" : "none",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: 16 }}>{ins.icon}</span>
          <div>
            <p style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2, whiteSpace: "nowrap" }}>{ins.label}</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <span style={{ fontSize: 16, fontWeight: 700, color: ins.color }}>{ins.value}</span>
              <span style={{ fontSize: 10, color: "#6B7280", whiteSpace: "nowrap" }}>{ins.sub}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
