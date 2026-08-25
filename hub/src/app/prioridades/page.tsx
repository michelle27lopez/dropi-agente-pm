"use client";

import { useEffect, useMemo, useState } from "react";
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

export default function PrioridadesPage() {
  const [celulas, setCelulas] = useState<Celula[]>([]);
  const [loading, setLoading] = useState(true);
  const [ownCelulaId, setOwnCelulaId] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    fetch("/api/celulas")
      .then((res) => res.json())
      .then((data) => setCelulas(Array.isArray(data) ? data : []))
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

  const flat = useMemo(
    () =>
      celulas.flatMap((c) =>
        (c.proyectos || [])
          .filter((p) => p.type === "Delivery Proyecto")
          .map((p) => ({ ...p, celulaNombre: c.nombre })),
      ),
    [celulas],
  );

  const grupos = useMemo(() => {
    const canon = ESTADOS_DELIVERY.map((estado) => ({
      estado,
      items: flat.filter((p) => p.estado_interno === estado),
    }));
    const extras = Array.from(
      new Set(
        flat.map((p) => p.estado_interno).filter((e): e is string => !ESTADOS_DELIVERY.includes(e ?? "")),
      ),
    ).map((estado) => ({
      estado: estado ?? "Sin estado",
      items: flat.filter((p) => (p.estado_interno ?? null) === (estado ?? null)),
    }));
    return [...canon, ...extras];
  }, [flat]);

  return (
    <main style={{ minHeight: "100vh", padding: "0", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <div className="gnav-page" style={{ maxWidth: 1400, margin: "0 auto" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>Prioridades</h1>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
            Proyectos de Delivery de todas las células, por etapa del pipeline. P0 es la más urgente.
            Cada célula solo puede editar la prioridad de sus propios proyectos.
          </p>

          {loading && <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>}

          {!loading && flat.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>No hay proyectos de tipo Delivery Proyecto todavía.</p>
          )}

          {!loading && flat.length > 0 && (
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
                      <p style={{ fontSize: 11, color: "var(--gray-300)", fontStyle: "italic" }}>
                        Nada en esta etapa.
                      </p>
                    ) : (
                      g.items
                        .slice()
                        .sort((a, b) => {
                          const pa = priorityRank(a.prioridad);
                          const pb = priorityRank(b.prioridad);
                          if (pa !== pb) return pa - pb;
                          return a.celulaNombre.localeCompare(b.celulaNombre);
                        })
                        .map((p) => {
                          const editable = p.celula_owner_id === ownCelulaId || isSuperAdmin;
                          const dias = diasDesde(p.updated_at);
                          return (
                            <div
                              key={p.id}
                              style={{
                                background: "#fff",
                                border: "1px solid var(--border)",
                                borderRadius: 10,
                                padding: 10,
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 6,
                                  marginBottom: 4,
                                  flexWrap: "wrap",
                                }}
                              >
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
                                <PrioridadEditor
                                  prioridad={p.prioridad}
                                  editable={editable}
                                  onChange={(v) => handlePrioridadChange(p.celula_owner_id, p.id, v)}
                                />
                                {dias !== null && (
                                  <span style={{ marginLeft: "auto", fontSize: 10, color: "var(--gray-400)" }}>
                                    hace {dias}d
                                  </span>
                                )}
                              </div>
                              <p style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", lineHeight: 1.35 }}>
                                {p.name}{" "}
                                <span style={{ fontSize: 10, fontWeight: 400, color: "var(--gray-400)" }}>
                                  ({p.celulaNombre})
                                </span>
                              </p>
                            </div>
                          );
                        })
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <HubFooter />
    </main>
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
