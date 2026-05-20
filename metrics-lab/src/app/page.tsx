import { getCRMSnapshot, type StageRow } from "@/lib/crm-db";
import { PipelineChart } from "@/components/PipelineChart";
import { KpiCard } from "@/components/KpiCard";
import { FunnelSummary } from "@/components/FunnelSummary";

function approvalRate(stages: StageRow[], approvedKey: string): string {
  const total = stages.reduce((s, r) => s + r.n, 0);
  const approved = stages.filter((r) => r.stage_name.toUpperCase().includes(approvedKey)).reduce((s, r) => s + r.n, 0);
  if (total === 0) return "—";
  return `${Math.round((approved / total) * 100)}%`;
}

export default async function DashboardPage() {
  let snapshot;
  try {
    snapshot = await getCRMSnapshot();
  } catch {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 font-medium">No se pudo conectar al CRM. Revisa las variables de entorno.</p>
      </main>
    );
  }

  const { pipelines, fetchedAt } = snapshot;
  const { verificacion, ascensosVerificados, ascensosPremium } = pipelines;

  const verAprobados = verificacion.stages.find((s) => s.stage_name.toUpperCase().includes("APROBADO"))?.n ?? 0;
  const ascVAprobados = ascensosVerificados.stages.find((s) => s.stage_name.toUpperCase().includes("APROBADO"))?.n ?? 0;
  const ascPDenegados = ascensosPremium.stages.find((s) => s.stage_name.toUpperCase().includes("DENEGADO"))?.n ?? 0;

  return (
    <main className="min-h-screen bg-[var(--background)]">
      {/* Header */}
      <header className="bg-white border-b border-[var(--border)] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-dropi flex items-center justify-center">
            <span className="text-white font-bold text-sm">M</span>
          </div>
          <div>
            <h1 className="font-semibold text-[var(--foreground)] leading-tight">Metrics Lab</h1>
            <p className="text-xs text-[var(--muted-foreground)]">Dropi · Supplier Success</p>
          </div>
        </div>
        <p className="text-xs text-[var(--muted-foreground)]">
          Actualizado: {new Date(fetchedAt).toLocaleString("es-CO", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

        {/* KPI Cards */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Resumen CRM</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KpiCard
              title="Verificación de Proveedores"
              total={verificacion.total}
              approved={verAprobados}
              approvalRate={approvalRate(verificacion.stages, "APROBADO")}
              color="#F77F00"
            />
            <KpiCard
              title="Ascensos a Verificado"
              total={ascensosVerificados.total}
              approved={ascVAprobados}
              approvalRate={approvalRate(ascensosVerificados.stages, "APROBADO")}
              color="#10B981"
            />
            <KpiCard
              title="Ascensos a Premium"
              total={ascensosPremium.total}
              approved={ascPDenegados}
              approvalLabel="Denegados"
              approvalRate={approvalRate(ascensosPremium.stages, "DENEGADO")}
              color="#6366F1"
            />
          </div>
        </section>

        {/* Funnel del proveedor */}
        <section>
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-4">Embudo del Proveedor</h2>
          <FunnelSummary
            steps={[
              { label: "Solicitudes de Verificación", value: verificacion.total, color: "#F77F00" },
              { label: "Ascensos a Verificado", value: ascensosVerificados.total, color: "#10B981" },
              { label: "Ascensos a Premium", value: ascensosPremium.total, color: "#6366F1" },
            ]}
          />
        </section>

        {/* Pipeline charts */}
        <section className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          <PipelineChart
            title="Pipeline: Verificación"
            stages={verificacion.stages}
            color="#F77F00"
          />
          <PipelineChart
            title="Pipeline: Ascensos Verificado"
            stages={ascensosVerificados.stages}
            color="#10B981"
          />
          <PipelineChart
            title="Pipeline: Ascensos Premium"
            stages={ascensosPremium.stages}
            color="#6366F1"
          />
        </section>

      </div>
    </main>
  );
}
