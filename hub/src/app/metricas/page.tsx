"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";

type MetricsProject = {
  key: string;
  name: string;
  icon: string;
  color: string;
  url: string;
};

// Cada proyecto ya mide lo suyo en su propio contexto (PRODUCT.md) — esta
// página no unifica esos datos, solo deja pasar de uno a otro sin salir del
// mismo panel. Cuando un proyecto tiene una vista de métricas dedicada se
// apunta ahí; si no, se muestra su página principal.
const METRICS_PROJECTS: MetricsProject[] = [
  { key: "time-to-value", name: "Time to Value", icon: "⚡", color: "#F77F00", url: "/proyectos/time-to-value/metricas" },
  { key: "dinamicas-catalogo", name: "Dinámicas de Catálogo", icon: "🗂️", color: "#0EA5E9", url: "/proyectos/dinamicas-catalogo/metas" },
  { key: "indicadores", name: "Indicadores · Postulaciones", icon: "📈", color: "#6366F1", url: "/proyectos/indicadores" },
  { key: "negociaciones", name: "Negociaciones · Proveedor–Líder Comunidad", icon: "🤝", color: "#0D9488", url: "/proyectos/negociaciones" },
  { key: "categorizacion", name: "Categorización y Enriquecimiento", icon: "🏷️", color: "#7C3AED", url: "/proyectos/categorizacion" },
  { key: "caza-productos", name: "Caza Productos", icon: "🔍", color: "#EC4899", url: "/proyectos/caza-productos" },
  { key: "descuentos", name: "Descuentos en Catálogo", icon: "🏷️", color: "#F59E0B", url: "/proyectos/descuentos" },
  { key: "negociaciones-dropshipper", name: "Negociaciones · Proveedor–Dropshipper", icon: "🤝", color: "#F77F00", url: "/proyectos/negociaciones-dropshipper" },
  { key: "combos", name: "Combos Dropshipper", icon: "📦", color: "#F77F00", url: "/proyectos/combos" },
  { key: "dropi-activa", name: "Dropi Activa · ACT-001", icon: "🚀", color: "#7C3AED", url: "/proyectos/dropi-activa" },
  { key: "gali-demo", name: "Gali - Demo", icon: "🦊", color: "#FF6102", url: "/proyectos/gali-demo" },
  { key: "pulso-demo", name: "Dropi Pulso · Demo", icon: "⚡", color: "#F77F00", url: "/proyectos/pulso-demo" },
];

export default function MetricasPage() {
  return (
    <Suspense fallback={null}>
      <MetricasContent />
    </Suspense>
  );
}

function MetricasContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("p");

  const [selectedKey, setSelectedKey] = useState(
    METRICS_PROJECTS.some((p) => p.key === initial) ? (initial as string) : METRICS_PROJECTS[0].key
  );

  const selected = METRICS_PROJECTS.find((p) => p.key === selectedKey) ?? METRICS_PROJECTS[0];

  const selectProject = (key: string) => {
    setSelectedKey(key);
    router.replace(`/metricas?p=${key}`, { scroll: false });
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--card)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <Breadcrumb items={[{ label: "Following" }]} />
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <aside style={{
          width: 240, flexShrink: 0, overflowY: "auto",
          borderRight: "1px solid var(--border)", padding: "16px 10px",
        }}>
          {METRICS_PROJECTS.map((p) => {
            const active = p.key === selectedKey;
            return (
              <button
                key={p.key}
                onClick={() => selectProject(p.key)}
                className="hub-nav-item"
                style={{
                  ["--item-accent" as string]: p.color,
                  ["--item-tint" as string]: `${p.color}12`,
                  display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                  padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? p.color : "var(--fg)",
                  marginBottom: 2,
                  ...(active ? { background: `${p.color}12` } : {}),
                }}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </aside>

        <iframe
          key={selected.key}
          src={selected.url}
          title={`Métricas — ${selected.name}`}
          style={{ flex: 1, border: "none", height: "100%" }}
        />
      </div>
    </div>
  );
}
