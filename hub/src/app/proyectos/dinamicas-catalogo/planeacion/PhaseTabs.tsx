"use client";

import { useRouter } from "next/navigation";
import { Check, Lock } from "lucide-react";

export type PhaseTabKey = "seguimiento" | "metricas" | "ejecucion" | "resumen";

const TABS: { key: PhaseTabKey; label: string }[] = [
  { key: "seguimiento", label: "Seguimiento" },
  { key: "metricas", label: "Métricas" },
  { key: "resumen", label: "Resumen" },
];

export function PhaseTabs({
  campaignId,
  active,
  planningComplete,
  isActive,
  resultadosDone,
}: {
  campaignId: string;
  active: PhaseTabKey;
  planningComplete: boolean;
  /** true si la campaña ya inició Ejecución (nodo de ejecución activo). */
  isActive: boolean;
  /** true si el nodo Resultados ya tiene los campos obligatorios completos — solo para el check visual de Métricas. */
  resultadosDone?: boolean;
}) {
  const router = useRouter();

  const locked: Record<PhaseTabKey, boolean> = {
    seguimiento: false,
    metricas: false,
    ejecucion: !planningComplete,
    resumen: false,
  };
  const done: Record<PhaseTabKey, boolean> = {
    seguimiento: false,
    metricas: !!resultadosDone,
    ejecucion: isActive,
    resumen: false,
  };

  const goTo = (tab: PhaseTabKey) => {
    if (locked[tab] || tab === active) return;
    const base = `/proyectos/dinamicas-catalogo/planeacion/${campaignId}`;
    if (tab === "seguimiento") router.push(`${base}/seguimiento`);
    if (tab === "metricas") router.push(`${base}/metricas`);
    if (tab === "ejecucion") router.push(`${base}/ejecucion`);
    if (tab === "resumen") router.push(`${base}/dashboard`);
  };

  return (
    <div style={{ display: "flex", gap: 24, borderBottom: "1px solid var(--border)" }}>
      {TABS.map((t) => {
        const isActiveTab = t.key === active;
        const isLocked = locked[t.key];
        const isDone = done[t.key];
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => goTo(t.key)}
            disabled={isLocked}
            title={isLocked ? "Todavía no está disponible" : t.label}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: "none", border: "none",
              borderBottom: isActiveTab ? "2px solid var(--dropi)" : "2px solid transparent",
              padding: "0 2px 10px", marginBottom: -1,
              fontSize: 14, fontWeight: isActiveTab ? 700 : 600,
              color: isLocked ? "#D1D5DB" : isActiveTab ? "var(--dropi)" : "var(--muted)",
              cursor: isLocked ? "default" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {isLocked ? <Lock size={12} strokeWidth={2.5} /> : isDone ? <Check size={13} strokeWidth={2.5} color={isActiveTab ? "var(--dropi)" : "#10B981"} /> : null}
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
