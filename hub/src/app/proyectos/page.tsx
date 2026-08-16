"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import HubFooter from "@/components/HubFooter";
import { type Item, matchesQuery } from "@/components/HomeSections";
import { proyectoToItem } from "@/lib/curated-projects";
import { ESTADOS_DISCOVERY, ESTADOS_POC, ESTADOS_DELIVERY, type Proyecto } from "@/components/ProjectCard";
import { type Fase, faseDe, FASE_LABEL, FASE_COLOR } from "@/lib/fase";

// Estados válidos de `estado_interno` según `type` — mismo mapeo que usa
// ProjectCard y el endpoint /api/proyectos/[slug].
function estadosValidosPara(type: string | null) {
  if (type === "POC") return ESTADOS_POC;
  if (type === "Delivery Proyecto") return ESTADOS_DELIVERY;
  return ESTADOS_DISCOVERY;
}

// Landing de Proyectos: reemplaza el buscador + lista que antes vivía en el
// sidebar de mi-día (ProjectSidebar, removido) — ahora es una página propia
// en vez de vivir en el menú, así el menú no crece con la cantidad de
// proyectos. Ver [[project_darwin_pd_dashboard]].

// Tabs de fase (rediseño privado, 2026-08-03): Discovery/POC/Delivery/
// Following/Todos según [[project_nomenclatura_fases]]. Confirmado con
// Michelle 2026-08-04: usar el mecanismo REAL que Jaime ya construyó en
// Darwin (migraciones 036 + 039, 24 y 29-jul-2026) — `type` ubica
// Discovery/POC/Delivery, y `estado_interno` es el sub-estado editable a
// mano (mismo selector que ya existe en ProjectCard). Ese modelo no tiene
// ningún estado "Following" — es una fase de Jira (Épica "Operación
// Product") que Darwin aún no sincroniza, así que la tab existe pero se
// queda vacía hasta que ese cruce se construya. No se usa `handoff_status`
// como proxy: es un campo de cumplimiento de otro eje, no de esta jerarquía.
// `faseDe`/FASE_LABEL/FASE_COLOR viven en @/lib/fase — compartidos con el
// breadcrumb de cada página de proyecto.
const FASES: { value: Fase | "todas"; label: string }[] = [
  { value: "discovery", label: "Discovery" },
  { value: "poc", label: "POC" },
  { value: "delivery", label: "Delivery" },
  { value: "following", label: "Following" },
  { value: "todas", label: "Todos" },
];

// Varios prototipos por proyecto se guardan en `prototype_url` separados por
// coma o salto de línea — sin migración nueva mientras se decide si esto
// necesita su propia columna. Si solo hay uno, se abre directo; si hay más,
// se despliega un dropdown.
function parsePrototypeUrls(raw: string | null): string[] {
  if (!raw) return [];
  return raw.split(/[\n,]/).map((u) => u.trim()).filter(Boolean);
}

export default function ProyectosPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [fase, setFase] = useState<Fase | "todas">("todas");
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

  // Edición rápida tipo Jira: cambiar el estado desde la tabla, sin entrar
  // al proyecto — mismo PATCH que ya usa ProjectCard en el detalle.
  async function handleEstadoChange(id: string, estado: string) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_interno: estado }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProyectosReales((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  const porFase = (p: Proyecto) => fase === "todas" || faseDe(p.type) === fase;

  function toRows(source: Proyecto[]) {
    return source
      .filter(porFase)
      .map((proyecto) => ({ proyecto, item: proyectoToItem(proyecto) }))
      .filter((row): row is { proyecto: Proyecto; item: Item } => row.item !== null)
      .filter((row) => matchesQuery(row.item, query));
  }

  const proyectos = toRows(proyectosReales.filter((p) => p.type !== "POC"));
  const poc = toRows(proyectosReales.filter((p) => p.type === "POC"));

  const hasResults = proyectos.length + poc.length > 0;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="gnav-page" style={{ flex: 1, maxWidth: 1280, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>Proyectos</h1>

        <div className="proy-search-wrap" style={{ position: "relative", margin: "32px 0 20px" }}>
          <Search
            size={20}
            strokeWidth={1.8}
            style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--gray-500)", pointerEvents: "none" }}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyecto…"
            className="proy-search"
          />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 32 }}>
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
            <ProjectsTable title="Proyectos" rows={proyectos} router={router} onEstadoChange={handleEstadoChange} />
          </div>
        )}
        {poc.length > 0 && (
          <ProjectsTable title="Pruebas de concepto" rows={poc} router={router} onEstadoChange={handleEstadoChange} />
        )}
      </div>
      <HubFooter />
    </main>
  );
}

type Row = { proyecto: Proyecto; item: Item };

type RouterLike = { push: (href: string) => void };

function ProjectsTable({
  title,
  rows,
  router,
  onEstadoChange,
}: {
  title: string;
  rows: Row[];
  router: RouterLike;
  onEstadoChange: (id: string, estado: string) => void;
}) {
  return (
    <div>
      {title !== "Proyectos" && (
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          {title}
        </p>
      )}
      <div className="proytable-wrap" style={{ overflowX: "auto" }}>
        <table className="proytable">
          <thead>
            <tr>
              <th style={{ width: 68 }}></th>
              <th>Proyecto</th>
              <th style={{ width: 110 }}>Código</th>
              <th style={{ width: 110 }}>Fase</th>
              <th style={{ width: 160 }}>Estado</th>
              <th style={{ width: 150 }}>Prototipo</th>
              <th style={{ width: 32 }}></th>
            </tr>
          </thead>
          <tbody>
            {rows.map(({ item, proyecto }) => {
              const isExternal = item.url?.startsWith("http");
              const prototypeUrls = parsePrototypeUrls(proyecto.prototype_url);
              const fase = faseDe(proyecto.type);
              return (
                <tr
                  key={item.key}
                  onClick={() => {
                    if (!item.url) return;
                    if (isExternal) window.open(item.url, "_blank", "noopener,noreferrer");
                    else router.push(item.url);
                  }}
                >
                  <td>
                    <span className="proytable-icon">{item.icon}</span>
                  </td>
                  <td>
                    <a
                      href={item.url}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                      className="proytable-name"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {item.name}
                    </a>
                  </td>
                  <td>
                    <span className="proytable-code">{proyecto.project_code ?? "—"}</span>
                  </td>
                  <td>
                    <span className="proytable-badge" style={{ background: FASE_COLOR[fase] }}>
                      {FASE_LABEL[fase]}
                    </span>
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <EstadoEditor
                      proyecto={proyecto}
                      onChange={(estado) => onEstadoChange(proyecto.id, estado)}
                    />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <PrototypeLinks urls={prototypeUrls} />
                  </td>
                  <td className="proytable-arrow">→</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Edición rápida del estado interno directo desde la tabla, al estilo del
// status chip de Jira: se muestra como texto, al hacer click se vuelve un
// select con los estados válidos para el `type` de ese proyecto y guarda
// apenas se elige uno — sin salir de la tabla. La edición completa (type,
// vpv, related_poc_id) se queda dentro del proyecto, en ProjectCard.
function EstadoEditor({ proyecto, onChange }: { proyecto: Proyecto; onChange: (estado: string) => void }) {
  const [editing, setEditing] = useState(false);
  const estados = estadosValidosPara(proyecto.type);

  if (editing) {
    return (
      <select
        autoFocus
        defaultValue={proyecto.estado_interno ?? ""}
        onChange={(e) => {
          onChange(e.target.value);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        style={{
          marginTop: 4, fontSize: 11, fontFamily: "inherit", color: "var(--gray-600)",
          background: "#fff", border: "1px solid var(--gray-200)", borderRadius: 6, padding: "2px 4px",
        }}
      >
        <option value="" disabled>Sin definir</option>
        {estados.map((estado) => (
          <option key={estado} value={estado}>{estado}</option>
        ))}
      </select>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="proytable-substate proytable-substate--editable"
      title="Cambiar estado"
    >
      {proyecto.estado_interno ?? "Sin definir"}
    </button>
  );
}

// Link directo al prototipo desde la fila, sin entrar al proyecto. Con más
// de un prototipo se abre un dropdown en vez de intentar mostrarlos todos en
// línea. `stopPropagation` evita que el click dispare también el link de la
// fila (que lleva al detalle del proyecto).
function PrototypeLinks({ urls }: { urls: string[] }) {
  const [open, setOpen] = useState(false);

  if (urls.length === 0) return null;

  if (urls.length === 1) {
    return (
      <a
        href={urls[0]}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        title="Ver prototipo"
        style={{
          flexShrink: 0, fontSize: 12, fontWeight: 600, textDecoration: "none",
          color: "var(--dropi)", background: "var(--dropi-light)",
          padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4,
        }}
      >
        🔗 Prototipo
      </a>
    );
  }

  return (
    <div
      style={{ position: "relative", flexShrink: 0 }}
      onClick={(e) => e.stopPropagation()}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        style={{
          fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
          color: "var(--dropi)", background: "var(--dropi-light)", border: "none",
          padding: "4px 10px", borderRadius: 999, display: "flex", alignItems: "center", gap: 4,
        }}
      >
        🔗 Prototipos ({urls.length}) {open ? "▴" : "▾"}
      </button>
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 4px)", right: 0, zIndex: 10,
            background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
            boxShadow: "0 8px 24px rgba(0,0,0,0.12)", minWidth: 180, overflow: "hidden",
          }}
        >
          {urls.map((url, i) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "block", fontSize: 12, color: "var(--fg)", textDecoration: "none",
                padding: "8px 12px", borderTop: i === 0 ? "none" : "1px solid var(--border)",
              }}
            >
              Prototipo {i + 1}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
