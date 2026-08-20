"use client";

import { Suspense, useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HubHeader from "@/components/HubHeader";
import Breadcrumb from "@/components/Breadcrumb";
import { TABS, WEEK_CHIPS, type TabId, type WeekId } from "./data";
import ResumenPanel from "./ResumenPanel";
import WeekPanel from "./WeekPanel";
import ComparativoPanel from "./ComparativoPanel";
import { HallazgosPanel, SiguePanel, VocesPanel } from "./VocesHallazgos";
import { Tag } from "./ui";
import "./bitacora.css";

function isTab(v: string | null): v is TabId {
  return TABS.some((t) => t.id === v);
}

function isWeek(v: string | null): v is WeekId {
  return WEEK_CHIPS.some((w) => w.id === v);
}

function BitacoraBody() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const tab: TabId = isTab(searchParams.get("tab")) ? (searchParams.get("tab") as TabId) : "resumen";
  const semana: WeekId = isWeek(searchParams.get("semana"))
    ? (searchParams.get("semana") as WeekId)
    : "s4";

  const setParams = useCallback(
    (next: { tab?: TabId; semana?: WeekId }) => {
      const p = new URLSearchParams(searchParams.toString());
      const t = next.tab ?? tab;
      p.set("tab", t);
      if (t === "semanas") p.set("semana", next.semana ?? semana);
      else p.delete("semana");
      router.replace(`${pathname}?${p.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams, semana, tab],
  );

  return (
    <div className="exp003-bitacora" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <HubHeader
        title="Bitácora: búsqueda con IA en Paraguay"
        subtitle="Proyecto EXP-003 · Célula Experience"
        currentSlug="seguimiento"
      />

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "24px 24px 64px" }}>
        <Breadcrumb
          items={[
            { label: "Seguimiento", href: "/proyectos/seguimiento" },
            { label: "EXP-003", href: "/proyectos/exp-003" },
            { label: "Bitácora" },
          ]}
        />

        <div style={{ margin: "20px 0 8px" }}>
          <h1
            style={{
              fontSize: "var(--fs-headline)",
              fontWeight: 800,
              color: "var(--fg)",
              margin: 0,
              lineHeight: "var(--lh-headline)",
            }}
          >
            Bitácora: búsqueda con IA en Paraguay
          </h1>
          <p
            style={{
              fontSize: "var(--fs-body)",
              color: "var(--muted)",
              marginTop: 8,
              lineHeight: "var(--lh-body)",
              maxWidth: 640,
            }}
          >
            Paraguay tiene IA por defecto desde el 17 jun 2026. Colombia sigue con Clásica. Cuatro semanas + línea base.
            Actualizado: 24 jul 2026.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          <Tag tone="blue">99,1% adopción IA en Paraguay</Tag>
          <Tag tone="red">0,9% reversión a Clásica (↑ 2 semanas)</Tag>
          <Tag tone="green">Favoritos y contacto ya registran bien</Tag>
        </div>

        <div
          role="tablist"
          aria-label="Secciones de la bitácora"
          style={{
            display: "flex",
            gap: 4,
            marginBottom: 16,
            borderBottom: "1px solid var(--border)",
            overflowX: "auto",
          }}
        >
          {TABS.map((t) => {
            const selected = tab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => setParams({ tab: t.id })}
                style={{
                  padding: "10px 14px",
                  minHeight: 44,
                  fontSize: "var(--fs-body)",
                  fontWeight: selected ? 700 : 500,
                  color: selected ? "var(--dropi)" : "var(--muted)",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  borderBottom: selected ? "2px solid var(--dropi)" : "2px solid transparent",
                  whiteSpace: "nowrap",
                  outlineOffset: 2,
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {tab === "semanas" && (
          <div
            role="group"
            aria-label="Semana"
            style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}
          >
            {WEEK_CHIPS.map((w) => {
              const selected = semana === w.id;
              return (
                <button
                  key={w.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setParams({ tab: "semanas", semana: w.id })}
                  style={{
                    padding: "8px 14px",
                    minHeight: 44,
                    fontSize: "var(--fs-body)",
                    fontWeight: selected ? 700 : 500,
                    color: selected ? "#fff" : "var(--fg)",
                    background: selected ? "var(--dropi)" : "var(--card)",
                    border: selected ? "1px solid var(--dropi)" : "1px solid var(--border)",
                    borderRadius: 999,
                    cursor: "pointer",
                  }}
                >
                  {w.label}
                </button>
              );
            })}
          </div>
        )}

        <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
          {tab === "resumen" && <ResumenPanel />}
          {tab === "semanas" && <WeekPanel weekId={semana} />}
          {tab === "comparativo" && <ComparativoPanel />}
          {tab === "voces" && <VocesPanel />}
          {tab === "hallazgos" && <HallazgosPanel />}
          {tab === "sigue" && <SiguePanel />}
        </div>
      </div>
    </div>
  );
}

export default function Exp003BitacoraPage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", background: "var(--bg)", padding: 40, color: "var(--muted)" }}>
          Cargando bitácora…
        </div>
      }
    >
      <BitacoraBody />
    </Suspense>
  );
}
