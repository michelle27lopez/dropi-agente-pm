"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import HubFooter from "@/components/HubFooter";
import { ESTADOS_DELIVERY } from "@/components/ProjectCard";

type Proyecto = {
  id: string;
  name: string;
  project_code: string | null;
  type: string | null;
  estado_interno: string | null;
  prioridad: string | null;
  celula_owner_id: string;
  updated_at: string | null;
};

type ProyectoConCelula = Proyecto & { celulaNombre?: string };

type Celula = {
  id: string;
  nombre: string;
  slug: string;
  proyectos: Proyecto[];
};

const NIVELES_PRIORIDAD = ["P0", "P1", "P2", "P3", "P4"] as const;

const PRIORIDAD_COLOR: Record<string, string> = {
  P0: "#DC2626",
  P1: "#EA580C",
  P2: "#D97706",
  P3: "#2563EB",
  P4: "#6B7280",
};

// P0 primero, sin prioridad al final — mismo criterio usado en Houston.
function priorityRank(prioridad: string | null) {
  const idx = NIVELES_PRIORIDAD.indexOf(prioridad as (typeof NIVELES_PRIORIDAD)[number]);
  return idx === -1 ? NIVELES_PRIORIDAD.length : idx;
}

function diasDesde(iso: string | null) {
  if (!iso) return null;
  return Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
}

// Mismo criterio que projectUrl en ProjectCard.tsx, reimplementado acá
// porque este type local no trae todos los campos que exige ese type.
function projectUrl(p: { project_code: string | null; id: string }) {
  return `/proyectos/${p.project_code ? p.project_code.toLowerCase() : p.id}`;
}

function agruparPorEtapa(proyectos: ProyectoConCelula[]) {
  const canon = ESTADOS_DELIVERY.map((estado) => ({
    estado,
    items: proyectos.filter((p) => p.estado_interno === estado),
  }));
  const extras = Array.from(
    new Set(
      proyectos.map((p) => p.estado_interno).filter((e): e is string => !ESTADOS_DELIVERY.includes(e ?? "")),
    ),
  ).map((estado) => ({
    estado: estado ?? "Sin estado",
    items: proyectos.filter((p) => (p.estado_interno ?? null) === (estado ?? null)),
  }));
  return [...canon, ...extras];
}

function tabButtonStyle(active: boolean): CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: 8,
    border: "none",
    background: active ? "var(--fg)" : "transparent",
    color: active ? "#fff" : "var(--muted)",
    cursor: "pointer",
  };
}

function pillStyle(active: boolean): CSSProperties {
  return {
    fontSize: 12,
    fontWeight: 600,
    padding: "5px 12px",
    borderRadius: 999,
    border: `1px solid ${active ? "var(--dropi)" : "var(--border)"}`,
    background: active ? "var(--dropi-light)" : "#fff",
    color: active ? "var(--dropi)" : "var(--gray-400)",
    cursor: "pointer",
  };
}

export default function DeliveryPage() {
  const [celulas, setCelulas] = useState<Celula[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownCelulaId, setOwnCelulaId] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [vista, setVista] = useState<"celula" | "prioridad">("celula");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    fetch("/api/celulas")
      .then((res) => res.json())
      .then((data) => {
        const list: Celula[] = Array.isArray(data) ? data : [];
        setCelulas(list);
        setSelectedIds(list.map((c) => c.id));
      })
      .finally(() => setLoading(false));

    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setOwnCelulaId(data?.profile?.celula_id ?? null);
        setIsSuperAdmin(!!data?.profile?.is_super_admin);
      })
      .catch(() => {});
  }, []);

  // Edición rápida tipo Jira, mismo patrón que EstadoEditor en
  // /celula/[slug]/proyectos: optimista, revierte si el PATCH falla.
  async function handlePrioridadChange(celulaId: string, projectId: string, prioridad: string | null) {
    let prev: string | null = null;
    setCelulas((cs) =>
      cs.map((c) => {
        if (c.id !== celulaId) return c;
        return {
          ...c,
          proyectos: c.proyectos.map((p) => {
            if (p.id !== projectId) return p;
            prev = p.prioridad;
            return { ...p, prioridad };
          }),
        };
      }),
    );

    const res = await fetch(`/api/proyectos/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prioridad }),
    }).catch(() => null);

    if (!res || !res.ok) {
      setCelulas((cs) =>
        cs.map((c) => {
          if (c.id !== celulaId) return c;
          return {
            ...c,
            proyectos: c.proyectos.map((p) => (p.id === projectId ? { ...p, prioridad: prev } : p)),
          };
        }),
      );
    }
  }

  const allSelected = celulas.length > 0 && selectedIds.length === celulas.length;
  const toggleCelula = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  const selectAll = () => setSelectedIds(celulas.map((c) => c.id));

  const toggleCollapse = (id: string) =>
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const visibleCelulas = celulas.filter((c) => selectedIds.includes(c.id));

  const deliveryPorCelula = useMemo(() => {
    const map = new Map<string, Proyecto[]>();
    celulas.forEach((c) => map.set(c.id, (c.proyectos || []).filter((p) => p.type === "Delivery Proyecto")));
    return map;
  }, [celulas]);

  const flatPrioridad = useMemo<ProyectoConCelula[]>(
    () =>
      visibleCelulas.flatMap((c) =>
        (deliveryPorCelula.get(c.id) || []).map((p) => ({ ...p, celulaNombre: c.nombre })),
      ),
    [visibleCelulas, deliveryPorCelula],
  );

  return (
    <main style={{ minHeight: "100vh", padding: "0", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <div className="gnav-page" style={{ maxWidth: 1400, margin: "0 auto" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>Delivery</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Proyectos de Delivery de todas las células, por etapa del pipeline. P0 es la más urgente.
            Cada célula solo puede editar la prioridad de sus propios proyectos.
          </p>

          <div
            style={{
              display: "inline-flex",
              border: "1px solid var(--border)",
              borderRadius: 10,
              padding: 2,
              marginBottom: 14,
              background: "#fff",
            }}
          >
            <button type="button" onClick={() => setVista("celula")} style={tabButtonStyle(vista === "celula")}>
              Por célula
            </button>
            <button
              type="button"
              onClick={() => setVista("prioridad")}
              style={tabButtonStyle(vista === "prioridad")}
            >
              Por prioridad
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            <button type="button" onClick={selectAll} style={pillStyle(allSelected)}>
              Todas
            </button>
            {celulas.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCelula(c.id)}
                style={pillStyle(selectedIds.includes(c.id))}
              >
                {c.nombre}
              </button>
            ))}
          </div>

          {loading && <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>}

          {!loading && visibleCelulas.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Selecciona al menos una célula.</p>
          )}

          {!loading &&
            visibleCelulas.length > 0 &&
            (vista === "prioridad" ? (
              flatPrioridad.length === 0 ? (
                <EmptyState />
              ) : (
                <PipelineBoard
                  proyectos={flatPrioridad}
                  mostrarCelula
                  editableFn={(p) => p.celula_owner_id === ownCelulaId || isSuperAdmin}
                  onPrioridadChange={handlePrioridadChange}
                />
              )
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {visibleCelulas.map((c) => {
                  const proyectos = deliveryPorCelula.get(c.id) || [];
                  const editable = c.id === ownCelulaId || isSuperAdmin;
                  const collapsed = collapsedIds.has(c.id);
                  return (
                    <div key={c.id}>
                      <button
                        type="button"
                        onClick={() => toggleCollapse(c.id)}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          gap: 8,
                          marginBottom: 8,
                          padding: 0,
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          textAlign: "left",
                        }}
                      >
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <ChevronDown
                            size={16}
                            style={{
                              color: "var(--gray-400)",
                              transform: collapsed ? "rotate(-90deg)" : "none",
                              transition: "transform 0.15s ease",
                            }}
                          />
                          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>{c.nombre}</h2>
                        </span>
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 700,
                            color: "var(--muted)",
                            background: "var(--gray-100)",
                            borderRadius: 999,
                            padding: "1px 8px",
                          }}
                        >
                          {proyectos.length} en delivery
                        </span>
                      </button>
                      {!collapsed &&
                        (proyectos.length === 0 ? (
                          <EmptyState />
                        ) : (
                          <PipelineBoard
                            proyectos={proyectos}
                            mostrarCelula={false}
                            editableFn={() => editable}
                            onPrioridadChange={handlePrioridadChange}
                          />
                        ))}
                    </div>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
      <HubFooter />
    </main>
  );
}

function EmptyState() {
  return (
    <p style={{ fontSize: 12, color: "var(--gray-300)", fontStyle: "italic", padding: "8px 0" }}>
      No hay proyectos de tipo Delivery Proyecto acá.
    </p>
  );
}

function PipelineBoard({
  proyectos,
  mostrarCelula,
  editableFn,
  onPrioridadChange,
}: {
  proyectos: ProyectoConCelula[];
  mostrarCelula: boolean;
  editableFn: (p: Proyecto) => boolean;
  onPrioridadChange: (celulaId: string, projectId: string, prioridad: string | null) => void;
}) {
  const grupos = useMemo(() => agruparPorEtapa(proyectos), [proyectos]);

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
      {grupos.map((g) => (
        <div
          key={g.estado}
          style={{
            flex: "1 1 260px",
            minWidth: 260,
            background: "var(--gray-50, #F7F8FA)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "10px 14px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>{g.estado}</span>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: "var(--muted)",
                background: "var(--gray-100)",
                borderRadius: 999,
                padding: "1px 8px",
              }}
            >
              {g.items.length}
            </span>
          </div>

          <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
            {g.items.length === 0 ? (
              <p style={{ fontSize: 11, color: "var(--gray-300)", fontStyle: "italic" }}>Nada en esta etapa.</p>
            ) : (
              g.items
                .slice()
                .sort((a, b) => {
                  const pa = priorityRank(a.prioridad);
                  const pb = priorityRank(b.prioridad);
                  if (pa !== pb) return pa - pb;
                  if (!mostrarCelula) return 0;
                  return (a.celulaNombre ?? "").localeCompare(b.celulaNombre ?? "");
                })
                .map((p) => (
                  <DeliveryCard
                    key={p.id}
                    proyecto={p}
                    celulaNombre={mostrarCelula ? p.celulaNombre : undefined}
                    editable={editableFn(p)}
                    onPrioridadChange={(v) => onPrioridadChange(p.celula_owner_id, p.id, v)}
                  />
                ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Tarjeta clickeable — lleva al detalle del proyecto (mismo destino que
// projectUrl de ProjectCard). El editor de prioridad frena la propagación
// del click para no navegar sin querer al tocarlo.
function DeliveryCard({
  proyecto: p,
  celulaNombre,
  editable,
  onPrioridadChange,
}: {
  proyecto: Proyecto;
  celulaNombre?: string;
  editable: boolean;
  onPrioridadChange: (prioridad: string | null) => void;
}) {
  const dias = diasDesde(p.updated_at);

  return (
    <Link
      href={projectUrl(p)}
      style={{
        display: "block",
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 10,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4, flexWrap: "wrap" }}>
        {p.project_code && (
          <span
            style={{
              fontSize: 9.5,
              fontWeight: 700,
              color: "var(--dropi)",
              background: "var(--dropi-light)",
              borderRadius: 4,
              padding: "1px 5px",
            }}
          >
            {p.project_code}
          </span>
        )}
        <span onClick={(e) => e.stopPropagation()}>
          <PrioridadEditor prioridad={p.prioridad} editable={editable} onChange={onPrioridadChange} />
        </span>
        {dias !== null && (
          <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--gray-400)" }}>hace {dias}d</span>
        )}
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", lineHeight: 1.35 }}>
        {p.name}
        {celulaNombre && (
          <span style={{ fontSize: 10, fontWeight: 400, color: "var(--gray-400)" }}> ({celulaNombre})</span>
        )}
      </p>
    </Link>
  );
}

// Edición rápida al estilo del EstadoEditor de /celula/[slug]/proyectos:
// chip clickeable que se vuelve <select> al hacer click, guarda apenas se
// elige una opción.
function PrioridadEditor({
  prioridad,
  editable,
  onChange,
}: {
  prioridad: string | null;
  editable: boolean;
  onChange: (prioridad: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const color = prioridad ? PRIORIDAD_COLOR[prioridad] : "var(--gray-300)";

  if (!editable) {
    return (
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          color,
          border: `1px solid ${color}`,
          borderRadius: 999,
          padding: "1px 6px",
        }}
      >
        {prioridad ?? "Sin prioridad"}
      </span>
    );
  }

  if (editing) {
    return (
      <select
        autoFocus
        defaultValue={prioridad ?? ""}
        onChange={(e) => {
          onChange(e.target.value || null);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        style={{
          fontSize: 11,
          fontFamily: "inherit",
          color: "var(--gray-600)",
          background: "#fff",
          border: "1px solid var(--gray-200)",
          borderRadius: 6,
          padding: "2px 4px",
        }}
      >
        <option value="">Sin prioridad</option>
        {NIVELES_PRIORIDAD.map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Cambiar prioridad"
      style={{
        fontSize: 10,
        fontWeight: 700,
        color,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: "1px 6px",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {prioridad ?? "Sin prioridad"}
    </button>
  );
}
