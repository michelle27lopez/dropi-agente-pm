"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { type Item, matchesQuery } from "@/components/HomeSections";

function SidebarGroup({ title, items, currentPath }: { title: string; items: Item[]; currentPath: string }) {
  if (items.length === 0) return null;
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: 0.4, margin: "0 0 8px", padding: "0 10px" }}>
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {items.map((item) => {
          const active = !!item.url && currentPath === item.url;
          return (
            <a
              key={item.key}
              href={item.url}
              style={{
                display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8,
                textDecoration: "none", fontSize: 13, fontWeight: 600,
                color: active ? "var(--dropi)" : "var(--fg)",
                background: active ? "var(--dropi-light)" : "transparent",
              }}
            >
              <span style={{ fontSize: 15, width: 20, textAlign: "center", flexShrink: 0 }}>{item.icon}</span>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// Sidebar de navegación de "mi día": cada botón es un proyecto del hub,
// siempre visible — reemplaza la sección colapsada que quedaba al fondo
// de la página. Ver [[project_darwin_pd_dashboard]].
export default function ProjectSidebar({
  allProjects = [],
  allPoc = [],
}: {
  allProjects?: Item[];
  allPoc?: Item[];
}) {
  const [query, setQuery] = useState("");
  const pathname = usePathname();

  const filteredProjects = allProjects.filter((item) => matchesQuery(item, query));
  const filteredPoc = allPoc.filter((item) => matchesQuery(item, query));
  const hasResults = filteredProjects.length > 0 || filteredPoc.length > 0;

  return (
    <aside style={{
      width: 240, flexShrink: 0, borderRight: "1px solid var(--border)",
      padding: "24px 12px", position: "sticky", top: 0, alignSelf: "flex-start",
      maxHeight: "100vh", overflowY: "auto",
    }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar proyecto…"
        style={{
          width: "100%", fontSize: 13, color: "var(--fg)", background: "var(--card)",
          border: "1px solid var(--border)", borderRadius: 8, padding: "8px 10px",
          fontFamily: "inherit", marginBottom: 20, boxSizing: "border-box",
        }}
      />
      <SidebarGroup title="Proyectos" items={filteredProjects} currentPath={pathname} />
      <SidebarGroup title="Pruebas de concepto" items={filteredPoc} currentPath={pathname} />
      {!hasResults && (
        <p style={{ fontSize: 12, color: "var(--muted)", padding: "0 10px" }}>Sin resultados.</p>
      )}
    </aside>
  );
}
