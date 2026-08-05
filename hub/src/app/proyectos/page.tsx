"use client";

import { useEffect, useState } from "react";
import HubFooter from "@/components/HubFooter";
import { type Item, matchesQuery } from "@/components/HomeSections";
import { proyectoToItem } from "@/lib/curated-projects";
import type { Proyecto } from "@/components/ProjectCard";

// Landing de Proyectos: reemplaza el buscador + lista que antes vivía en el
// sidebar de mi-día (ProjectSidebar, removido) — ahora es una página propia
// en vez de vivir en el menú, así el menú no crece con la cantidad de
// proyectos. Ver [[project_darwin_pd_dashboard]].
const FASES: { value: string; label: string }[] = [
  { value: "todas", label: "Todas las fases" },
  { value: "Experimentación", label: "Experimentación" },
  { value: "Listo para handoff", label: "Listo para handoff" },
  { value: "Handoff hecho", label: "Handoff hecho" },
];

export default function ProyectosPage() {
  const [query, setQuery] = useState("");
  const [fase, setFase] = useState("todas");
  const [loading, setLoading] = useState(true);
  const [proyectosReales, setProyectosReales] = useState<Proyecto[]>([]);

  useEffect(() => {
    fetch("/api/celulas/suppliers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.proyectos)) setProyectosReales(data.proyectos);
      })
      .finally(() => setLoading(false));
  }, []);

  const porFase = (p: Proyecto) => fase === "todas" || p.handoff_status === fase;

  const proyectos = proyectosReales
    .filter((p) => p.type !== "POC")
    .filter(porFase)
    .map(proyectoToItem)
    .filter((item): item is Item => item !== null)
    .filter((item) => matchesQuery(item, query));

  const poc = proyectosReales
    .filter((p) => p.type === "POC")
    .filter(porFase)
    .map(proyectoToItem)
    .filter((item): item is Item => item !== null)
    .filter((item) => matchesQuery(item, query));

  const hasResults = proyectos.length + poc.length > 0;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, maxWidth: 1100, margin: "0 auto", padding: "48px 32px", width: "100%" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>Proyectos</h1>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4 }}>
          Todos los proyectos y pruebas de concepto de Supplier Success.
        </p>

        <div style={{ position: "relative", margin: "32px 0 20px" }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 14 }}>
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyecto…"
            className="hub-search"
            style={{
              width: "100%", fontSize: 13, color: "var(--fg)", background: "var(--card)",
              border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px 10px 38px",
              fontFamily: "inherit",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 40 }}>
          {FASES.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFase(f.value)}
              style={{
                fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                padding: "6px 14px", borderRadius: 999,
                border: `1px solid ${fase === f.value ? "var(--dropi)" : "var(--border)"}`,
                background: fase === f.value ? "var(--dropi-light)" : "var(--card)",
                color: fase === f.value ? "var(--dropi)" : "var(--muted)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading && (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>
        )}

        {!loading && !hasResults && (
          <p style={{ fontSize: 13, color: "var(--muted)", padding: "24px 0", textAlign: "center" }}>
            Sin resultados{query ? ` para "${query}"` : ""}.
          </p>
        )}

        {proyectos.length > 0 && (
          <div style={{ marginBottom: poc.length ? 40 : 0 }}>
            <ProjectsTable title="Proyectos" items={proyectos} />
          </div>
        )}
        {poc.length > 0 && <ProjectsTable title="Pruebas de concepto" items={poc} />}
      </div>
      <HubFooter />
    </main>
  );
}

function ProjectsTable({ title, items }: { title: string; items: Item[] }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
        {title}
      </p>
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        {items.map((item, index) => {
          const isExternal = item.url?.startsWith("http");
          return (
            <a
              key={item.key}
              href={item.url}
              target={isExternal ? "_blank" : undefined}
              rel={isExternal ? "noopener noreferrer" : undefined}
              className="hub-card"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 20px",
                textDecoration: "none",
                borderTop: index === 0 ? "none" : "1px solid var(--border)",
                background: "var(--card)",
              }}
            >
              <span style={{ fontSize: 18, width: 24, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)", flex: 1, minWidth: 0 }}>
                {item.name}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 600,
                color: item.color,
                background: `${item.color}12`,
                padding: "3px 8px", borderRadius: 999,
                flexShrink: 0,
              }}>
                {item.tag}
              </span>
              <span style={{ fontSize: 13, color: "var(--muted)", flexShrink: 0 }}>→</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
