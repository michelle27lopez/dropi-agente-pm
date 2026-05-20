"use client";

import { useState } from "react";
import type { CRMSnapshot, CitasData } from "@/lib/crm-db";
import { KpiCard } from "./KpiCard";
import { FunnelSummary } from "./FunnelSummary";
import { PipelineChart } from "./PipelineChart";
import { CitasView } from "./CitasView";

type Props = { snapshot: CRMSnapshot; citasData: CitasData };

const TABS = [
  { key: "pipelines", label: "Pipelines" },
  { key: "citas", label: "Tiempo a Cita" },
];

function approvalRate(stages: { stage_name: string; n: number }[], key: string) {
  const total = stages.reduce((s, r) => s + r.n, 0);
  const matched = stages.filter((r) => r.stage_name.toUpperCase().includes(key)).reduce((s, r) => s + r.n, 0);
  return total === 0 ? "—" : `${Math.round((matched / total) * 100)}%`;
}

export function Dashboard({ snapshot, citasData }: Props) {
  const [tab, setTab] = useState<"pipelines" | "citas">("pipelines");
  const { pipelines, fetchedAt } = snapshot;
  const { verificacion, ascensosVerificados, ascensosPremium } = pipelines;
  const verAprobados = verificacion.stages.find((s) => s.stage_name.toUpperCase().includes("APROBADO"))?.n ?? 0;
  const ascVAprobados = ascensosVerificados.stages.find((s) => s.stage_name.toUpperCase().includes("APROBADO"))?.n ?? 0;
  const ascPDenegados = ascensosPremium.stages.find((s) => s.stage_name.toUpperCase().includes("DENEGADO"))?.n ?? 0;

  return (
    <main style={{ minHeight: "100vh", background: "var(--background)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "#F77F00",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontWeight: 700, fontSize: 14,
          }}>M</div>
          <div>
            <p style={{ fontWeight: 600, fontSize: 14, color: "var(--foreground)" }}>Metrics Lab</p>
            <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>Dropi · Supplier Success</p>
          </div>
        </div>
        <p style={{ fontSize: 11, color: "var(--muted-foreground)" }}>
          Actualizado: {new Date(fetchedAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </header>

      {/* Tabs */}
      <div style={{ background: "#fff", borderBottom: "1px solid var(--border)", padding: "0 24px" }}>
        <div style={{ display: "flex", gap: 0 }}>
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as "pipelines" | "citas")}
              style={{
                padding: "12px 20px",
                fontSize: 13,
                fontWeight: tab === t.key ? 600 : 400,
                color: tab === t.key ? "#F77F00" : "var(--muted-foreground)",
                background: "transparent",
                border: "none",
                borderBottom: tab === t.key ? "2px solid #F77F00" : "2px solid transparent",
                cursor: "pointer",
                transition: "color 0.15s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 24px" }}>

        {tab === "pipelines" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            {/* KPI Cards */}
            <section>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                Resumen CRM
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
                <KpiCard title="Verificación de Proveedores" total={verificacion.total} approved={verAprobados} approvalRate={approvalRate(verificacion.stages, "APROBADO")} color="#F77F00" />
                <KpiCard title="Ascensos a Verificado" total={ascensosVerificados.total} approved={ascVAprobados} approvalRate={approvalRate(ascensosVerificados.stages, "APROBADO")} color="#10B981" />
                <KpiCard title="Ascensos a Premium" total={ascensosPremium.total} approved={ascPDenegados} approvalLabel="Denegados" approvalRate={approvalRate(ascensosPremium.stages, "DENEGADO")} color="#6366F1" />
              </div>
            </section>

            {/* Funnel */}
            <section>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                Embudo del Proveedor
              </p>
              <FunnelSummary
                steps={[
                  { label: "Solicitudes de Verificación", value: verificacion.total, color: "#F77F00" },
                  { label: "Ascensos a Verificado", value: ascensosVerificados.total, color: "#10B981" },
                  { label: "Ascensos a Premium", value: ascensosPremium.total, color: "#6366F1" },
                ]}
              />
            </section>

            {/* Pipeline Charts */}
            <section>
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
                Detalle por Pipeline
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
                <PipelineChart title="Pipeline: Verificación" stages={verificacion.stages} color="#F77F00" />
                <PipelineChart title="Pipeline: Ascensos Verificado" stages={ascensosVerificados.stages} color="#10B981" />
                <PipelineChart title="Pipeline: Ascensos Premium" stages={ascensosPremium.stages} color="#6366F1" />
              </div>
            </section>
          </div>
        )}

        {tab === "citas" && <CitasView data={citasData} />}
      </div>
    </main>
  );
}
