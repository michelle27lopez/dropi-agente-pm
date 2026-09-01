"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ChevronDown, MessageSquare, Plus, X } from "lucide-react";
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
  created_at: string | null;
  // Pipeline de fechas — ver 055_darwin_delivery_fechas_pipeline.sql.
  fecha_handoff: string | null;
  fecha_inicio_dev: string | null;
  fecha_entrega_qa: string | null;
  fecha_salida_produccion: string | null;
};

// Campos de fecha editables de un Delivery Proyecto, en orden del ciclo.
type FechaCampo = "fecha_handoff" | "fecha_inicio_dev" | "fecha_entrega_qa" | "fecha_salida_produccion";

// Estados de un Delivery Proyecto en los que ya tiene sentido registrar
// cuándo arrancó desarrollo.
const ESTADOS_CON_INICIO_DEV = new Set(["Pendiente Handoff", "en DEV", "Activo", "Cerrado"]);

const ESTADO_BAR_COLOR: Record<string, string> = {
  "En definición": "#94A3B8",
  "En priorización": "#94A3B8",
  "Pendiente Handoff": "#D97706",
  "en DEV": "#2563EB",
  Activo: "#0EA5E9",
  Cerrado: "#0ABB87",
};

function fmtFechaCorta(iso: string | null) {
  if (!iso) return null;
  // iso es 'YYYY-MM-DD' — se parsea como fecha local sin desfase de zona.
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

// 'YYYY-MM-DD' de hoy en hora local (no UTC, para no saltar de día de noche).
function hoyISO() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// Tras un PATCH el servidor puede haber tocado campos por su cuenta (autofill
// de fecha_inicio_dev al pasar a 'en DEV', p. ej.). Trae estado + las 4 fechas
// desde la fila devuelta, preservando el resto del proyecto local.
function reconciliarProyecto(p: Proyecto, fila: Record<string, unknown>): Proyecto {
  return {
    ...p,
    estado_interno: (fila.estado_interno as string | null) ?? p.estado_interno,
    fecha_handoff: (fila.fecha_handoff as string | null) ?? null,
    fecha_inicio_dev: (fila.fecha_inicio_dev as string | null) ?? null,
    fecha_entrega_qa: (fila.fecha_entrega_qa as string | null) ?? null,
    fecha_salida_produccion: (fila.fecha_salida_produccion as string | null) ?? null,
  };
}

type Comentario = { id: string; autor: string; comentario: string; created_at: string };

type Cambio = {
  id: string;
  autor: string | null;
  campo: string;
  valor_anterior: string | null;
  valor_nuevo: string | null;
  nota: string | null;
  created_at: string;
};

const CAMPO_LABEL: Record<string, string> = {
  fecha_handoff: "Handoff",
  fecha_inicio_dev: "Inicio dev",
  fecha_entrega_qa: "Entrega / inicio QA",
  fecha_salida_produccion: "Salida a producción",
  estado_interno: "Estado",
  prioridad: "Prioridad",
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
  const [ownCelulaSlug, setOwnCelulaSlug] = useState<string | null>(null);
  const [ownCelulaNombre, setOwnCelulaNombre] = useState<string | null>(null);
  const [ownEmail, setOwnEmail] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [vista, setVista] = useState<"celula" | "prioridad" | "roadmap">("celula");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [showCrear, setShowCrear] = useState(false);
  const [commentTarget, setCommentTarget] = useState<Proyecto | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  // Proyecto en el que se está confirmando el paso 'Pendiente Handoff' → 'en DEV'.
  const [pasoDevTarget, setPasoDevTarget] = useState<ProyectoConCelula | null>(null);
  const [detalleTarget, setDetalleTarget] = useState<ProyectoConCelula | null>(null);
  // La primera carga fija la selección de células a "todas"; los refetch
  // posteriores (tras crear un Delivery) respetan lo que el usuario tenga
  // seleccionado.
  const primeraCarga = useRef(true);

  const loadCelulas = useCallback(async () => {
    const res = await fetch("/api/celulas").catch(() => null);
    const data = res ? await res.json().catch(() => null) : null;
    const list: Celula[] = Array.isArray(data) ? data : [];
    setCelulas(list);
    if (primeraCarga.current) {
      setSelectedIds(list.map((c) => c.id));
      primeraCarga.current = false;
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCelulas();

    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setOwnCelulaId(data?.profile?.celula_id ?? null);
        setOwnCelulaSlug(data?.profile?.celulas?.slug ?? null);
        setOwnCelulaNombre(data?.profile?.celulas?.nombre ?? null);
        setOwnEmail(data?.profile?.email ?? data?.user?.email ?? null);
        setIsSuperAdmin(!!data?.profile?.is_super_admin);
      })
      .catch(() => {});
  }, [loadCelulas]);

  // Discovery projects de la célula del usuario — candidatos a los que
  // colgar un Delivery Proyecto nuevo. Discovery = type que no sea POC /
  // Delivery Proyecto / Following (incluye NULL y 'Idea'/'Oportunidad').
  const misDiscovery = useMemo(() => {
    const mia = celulas.find((c) => c.id === ownCelulaId);
    return (mia?.proyectos ?? []).filter(
      (p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following",
    );
  }, [celulas, ownCelulaId]);

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

  // Cambia el estado_interno de un Delivery Proyecto. Optimista y con
  // reconciliación: al pasar a 'en DEV' el servidor puede sellar
  // fecha_inicio_dev con hoy. Cambiar el estado re-agrupa la card en el
  // Roadmap (otra lista / barra / hito).
  async function handleEstadoChange(celulaId: string, projectId: string, estado: string | null) {
    let prev: string | null = null;
    setCelulas((cs) =>
      cs.map((c) =>
        c.id !== celulaId
          ? c
          : {
              ...c,
              proyectos: c.proyectos.map((p) => {
                if (p.id !== projectId) return p;
                prev = p.estado_interno;
                return { ...p, estado_interno: estado };
              }),
            },
      ),
    );

    const res = await fetch(`/api/proyectos/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_interno: estado }),
    }).catch(() => null);

    if (!res || !res.ok) {
      setCelulas((cs) =>
        cs.map((c) =>
          c.id !== celulaId
            ? c
            : { ...c, proyectos: c.proyectos.map((p) => (p.id === projectId ? { ...p, estado_interno: prev } : p)) },
        ),
      );
      return;
    }

    const actualizado = await res.json().catch(() => null);
    if (actualizado?.id) {
      setCelulas((cs) =>
        cs.map((c) =>
          c.id !== celulaId
            ? c
            : {
                ...c,
                proyectos: c.proyectos.map((p) => (p.id === projectId ? reconciliarProyecto(p, actualizado) : p)),
              },
        ),
      );
    }
  }

  // Confirma el paso 'Pendiente Handoff' → 'en DEV' con las fechas del ciclo
  // de dev en un solo PATCH (una fila de log por cada fecha que cambia).
  // Optimista; revierte el proyecto completo si el PATCH falla.
  async function handlePasoADev(
    celulaId: string,
    projectId: string,
    fechas: { fecha_inicio_dev: string | null; fecha_entrega_qa: string | null; fecha_salida_produccion: string | null },
    nota: string | null,
  ): Promise<boolean> {
    let prev: Proyecto | null = null;
    setCelulas((cs) =>
      cs.map((c) =>
        c.id !== celulaId
          ? c
          : {
              ...c,
              proyectos: c.proyectos.map((p) => {
                if (p.id !== projectId) return p;
                prev = p;
                return { ...p, estado_interno: "en DEV", ...fechas };
              }),
            },
      ),
    );

    const res = await fetch(`/api/proyectos/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_interno: "en DEV", ...fechas, ...(nota ? { nota } : {}) }),
    }).catch(() => null);

    if (!res || !res.ok) {
      const snapshot = prev;
      if (snapshot) {
        setCelulas((cs) =>
          cs.map((c) =>
            c.id !== celulaId
              ? c
              : { ...c, proyectos: c.proyectos.map((p) => (p.id === projectId ? snapshot : p)) },
          ),
        );
      }
      return false;
    }

    const actualizado = await res.json().catch(() => null);
    if (actualizado?.id) {
      setCelulas((cs) =>
        cs.map((c) =>
          c.id !== celulaId
            ? c
            : {
                ...c,
                proyectos: c.proyectos.map((p) => (p.id === projectId ? reconciliarProyecto(p, actualizado) : p)),
              },
        ),
      );
    }
    return true;
  }

  // Edición optimista de una de las 4 fechas del pipeline. `valor` es
  // 'YYYY-MM-DD' o null; `nota` es un comentario opcional que se guarda en el
  // log de cambios junto a esa edición. Devuelve true si el PATCH pasó.
  async function handleFechaChange(
    celulaId: string,
    projectId: string,
    campo: FechaCampo,
    valor: string | null,
    nota?: string | null,
  ): Promise<boolean> {
    let prev: string | null = null;
    setCelulas((cs) =>
      cs.map((c) =>
        c.id !== celulaId
          ? c
          : {
              ...c,
              proyectos: c.proyectos.map((p) => {
                if (p.id !== projectId) return p;
                prev = p[campo];
                return { ...p, [campo]: valor };
              }),
            },
      ),
    );

    const res = await fetch(`/api/proyectos/${projectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nota ? { [campo]: valor, nota } : { [campo]: valor }),
    }).catch(() => null);

    if (!res || !res.ok) {
      setCelulas((cs) =>
        cs.map((c) =>
          c.id !== celulaId
            ? c
            : { ...c, proyectos: c.proyectos.map((p) => (p.id === projectId ? { ...p, [campo]: prev } : p)) },
        ),
      );
      return false;
    }

    // El servidor puede haber autollenado fecha_inicio_dev (al pasar a 'en
    // DEV'); reconciliar con la fila devuelta.
    const actualizado = await res.json().catch(() => null);
    if (actualizado?.id) {
      setCelulas((cs) =>
        cs.map((c) =>
          c.id !== celulaId
            ? c
            : {
                ...c,
                proyectos: c.proyectos.map((p) => (p.id === projectId ? reconciliarProyecto(p, actualizado) : p)),
              },
        ),
      );
    }
    return true;
  }

  const allSelected = celulas.length > 0 && selectedIds.length === celulas.length;
  const toggleCelula = (id: string) =>
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  // "Todas" alterna: si ya están todas seleccionadas, las deselecciona.
  const toggleAll = () => setSelectedIds(allSelected ? [] : celulas.map((c) => c.id));

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
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>Delivery</h1>
            {ownCelulaSlug && (
              <button
                type="button"
                onClick={() => setShowCrear(true)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                  padding: "8px 14px", borderRadius: 9, border: "none",
                  background: "var(--dropi)", color: "#fff",
                }}
              >
                <Plus size={15} strokeWidth={2.4} />
                Delivery Proyecto
              </button>
            )}
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Proyectos de Delivery de todas las células, por etapa del pipeline. P0 es la más urgente.
            Cada célula solo puede editar la prioridad de sus propios proyectos.
            {ownCelulaNombre && ` Al crear uno, se asocia a tu célula (${ownCelulaNombre}).`}
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
            <button
              type="button"
              onClick={() => setVista("roadmap")}
              style={tabButtonStyle(vista === "roadmap")}
            >
              Roadmap
            </button>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            <button type="button" onClick={toggleAll} style={pillStyle(allSelected)}>
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
            (vista === "roadmap" ? (
              <GanttBoard
                proyectos={flatPrioridad}
                editableFn={(p) => p.celula_owner_id === ownCelulaId || isSuperAdmin}
                onFechaChange={handleFechaChange}
                onEstadoChange={handleEstadoChange}
                onPrioridadChange={handlePrioridadChange}
                onPasoADev={setPasoDevTarget}
                onOpenDetalle={setDetalleTarget}
              />
            ) : vista === "prioridad" ? (
              flatPrioridad.length === 0 ? (
                <EmptyState />
              ) : (
                <PipelineBoard
                  proyectos={flatPrioridad}
                  mostrarCelula
                  editableFn={(p) => p.celula_owner_id === ownCelulaId || isSuperAdmin}
                  onPrioridadChange={handlePrioridadChange}
                  onFechaChange={handleFechaChange}
                  commentCounts={commentCounts}
                  onOpenComentarios={setCommentTarget}
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
                            onFechaChange={handleFechaChange}
                            commentCounts={commentCounts}
                            onOpenComentarios={setCommentTarget}
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

      {showCrear && ownCelulaSlug && (
        <CrearDeliveryModal
          celulaSlug={ownCelulaSlug}
          celulaNombre={ownCelulaNombre}
          discoveryOptions={misDiscovery}
          onCancel={() => setShowCrear(false)}
          onCreated={async () => {
            setShowCrear(false);
            await loadCelulas();
          }}
        />
      )}

      {commentTarget && (
        <ComentariosModal
          proyecto={commentTarget}
          autorEmail={ownEmail}
          onClose={() => setCommentTarget(null)}
          onCountChange={(n) =>
            setCommentCounts((prev) => ({ ...prev, [commentTarget.id]: n }))
          }
        />
      )}

      {detalleTarget && (
        <RoadmapDetalleModal
          proyecto={detalleTarget}
          autorEmail={ownEmail}
          editable={detalleTarget.celula_owner_id === ownCelulaId || isSuperAdmin}
          onFechaChange={(campo, valor, nota) =>
            handleFechaChange(detalleTarget.celula_owner_id, detalleTarget.id, campo, valor, nota)
          }
          onClose={() => setDetalleTarget(null)}
          onCountChange={(n) =>
            setCommentCounts((prev) => ({ ...prev, [detalleTarget.id]: n }))
          }
        />
      )}

      {pasoDevTarget && (
        <PasoADevModal
          proyecto={pasoDevTarget}
          onCancel={() => setPasoDevTarget(null)}
          onConfirm={async (fechas, nota) => {
            const ok = await handlePasoADev(
              pasoDevTarget.celula_owner_id,
              pasoDevTarget.id,
              fechas,
              nota,
            );
            if (ok) setPasoDevTarget(null);
            return ok;
          }}
        />
      )}
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
  onFechaChange,
  commentCounts,
  onOpenComentarios,
}: {
  proyectos: ProyectoConCelula[];
  mostrarCelula: boolean;
  editableFn: (p: Proyecto) => boolean;
  onPrioridadChange: (celulaId: string, projectId: string, prioridad: string | null) => void;
  onFechaChange: (
    celulaId: string,
    projectId: string,
    campo: FechaCampo,
    valor: string | null,
  ) => void;
  commentCounts: Record<string, number>;
  onOpenComentarios: (p: Proyecto) => void;
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
                    onFechaChange={(campo, valor) => onFechaChange(p.celula_owner_id, p.id, campo, valor)}
                    commentCount={commentCounts[p.id]}
                    onOpenComentarios={() => onOpenComentarios(p)}
                  />
                ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Tarjeta NO navegable: antes toda la card era un <Link> y cualquier click
// —incluido el chip de prioridad— llevaba al detalle del proyecto porque
// stopPropagation no cancela el default del <a>. Ahora es un <div> y entrar
// al proyecto es un botón explícito "Ver proyecto", sin choque con el editor
// de prioridad ni con el botón de comentarios.
function DeliveryCard({
  proyecto: p,
  celulaNombre,
  editable,
  onPrioridadChange,
  onFechaChange,
  commentCount,
  onOpenComentarios,
}: {
  proyecto: Proyecto;
  celulaNombre?: string;
  editable: boolean;
  onPrioridadChange: (prioridad: string | null) => void;
  onFechaChange: (campo: FechaCampo, valor: string | null) => void;
  commentCount?: number;
  onOpenComentarios: () => void;
}) {
  const dias = diasDesde(p.updated_at);
  const mostrarInicioDev = !!p.fecha_inicio_dev || ESTADOS_CON_INICIO_DEV.has(p.estado_interno ?? "");

  return (
    <div
      style={{
        background: "#fff",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: 10,
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
        <PrioridadEditor prioridad={p.prioridad} editable={editable} onChange={onPrioridadChange} />
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

      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 12px", marginTop: 8 }}>
        {(!!p.fecha_handoff || p.estado_interno === "Pendiente Handoff") && (
          <FechaEditor
            label="Handoff"
            valor={p.fecha_handoff}
            editable={editable}
            onChange={(v) => onFechaChange("fecha_handoff", v)}
          />
        )}
        {mostrarInicioDev && (
          <FechaEditor
            label="Inicio dev"
            valor={p.fecha_inicio_dev}
            editable={editable}
            onChange={(v) => onFechaChange("fecha_inicio_dev", v)}
          />
        )}
        <FechaEditor
          label="Producción"
          valor={p.fecha_salida_produccion}
          editable={editable}
          onChange={(v) => onFechaChange("fecha_salida_produccion", v)}
        />
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
          marginTop: 8,
          paddingTop: 8,
          borderTop: "1px solid var(--gray-100)",
        }}
      >
        <button
          type="button"
          onClick={onOpenComentarios}
          title="Comentarios"
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 11, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
            border: "none", background: "transparent", color: "var(--gray-500)", padding: 0,
          }}
        >
          <MessageSquare size={13} strokeWidth={1.8} />
          {commentCount ? commentCount : "Comentar"}
        </button>
        <Link
          href={projectUrl(p)}
          style={{
            fontSize: 11, fontWeight: 700, textDecoration: "none",
            color: "var(--dropi)",
          }}
        >
          Ver proyecto →
        </Link>
      </div>
    </div>
  );
}

// Modal para crear un Delivery Proyecto asociado a la célula del usuario. Se
// cuelga de un Discovery project existente de esa célula o de uno nuevo que
// se crea en el mismo flujo (POST /api/celulas/[slug] → type 'Idea', que
// cuenta como Discovery). Luego POST /api/proyectos/[discoveryId] con
// type 'Delivery Proyecto'.
function CrearDeliveryModal({
  celulaSlug,
  celulaNombre,
  discoveryOptions,
  onCancel,
  onCreated,
}: {
  celulaSlug: string;
  celulaNombre: string | null;
  discoveryOptions: Proyecto[];
  onCancel: () => void;
  onCreated: () => void | Promise<void>;
}) {
  const hayDiscovery = discoveryOptions.length > 0;
  const [modo, setModo] = useState<"asociar" | "nuevo">(hayDiscovery ? "asociar" : "nuevo");
  const [discoveryId, setDiscoveryId] = useState(hayDiscovery ? discoveryOptions[0].id : "");
  const [discoveryName, setDiscoveryName] = useState("");
  const [discoverySummary, setDiscoverySummary] = useState("");
  const [deliveryName, setDeliveryName] = useState("");
  const [deliverySummary, setDeliverySummary] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const discoveryListo = modo === "asociar" ? !!discoveryId : discoveryName.trim() && discoverySummary.trim();
  const puedeCrear = !!discoveryListo && deliveryName.trim().length > 0 && deliverySummary.trim().length > 0;

  const inputStyle: CSSProperties = {
    width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
    fontSize: 13, boxSizing: "border-box", fontFamily: "inherit", background: "#fff", color: "var(--fg)",
  };

  async function crear() {
    setSaving(true);
    setError(null);
    try {
      let parentId = discoveryId;

      if (modo === "nuevo") {
        const rd = await fetch(`/api/celulas/${celulaSlug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: discoveryName.trim(), summary: discoverySummary.trim() }),
        });
        if (!rd.ok) {
          const d = await rd.json().catch(() => null);
          throw new Error(d?.error ?? "No se pudo crear el Discovery project.");
        }
        parentId = (await rd.json()).id;
      }

      const re = await fetch(`/api/proyectos/${parentId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: deliveryName.trim(),
          summary: deliverySummary.trim(),
          type: "Delivery Proyecto",
        }),
      });
      if (!re.ok) {
        const d = await re.json().catch(() => null);
        throw new Error(d?.error ?? "No se pudo crear el Delivery Proyecto.");
      }
      await onCreated();
    } catch (e: any) {
      setError(e.message ?? "No se pudo crear.");
      setSaving(false);
    }
  }

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, zIndex: 100, backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", border: "1px solid var(--border)", borderRadius: 16,
          maxWidth: 460, width: "100%", padding: 24, maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--fg)", margin: "0 0 4px" }}>
          Nuevo Delivery Proyecto
        </h3>
        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 16px" }}>
          Se asocia a tu célula{celulaNombre ? ` (${celulaNombre})` : ""}.
        </p>

        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
          Discovery project
        </p>
        <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 8, padding: 2, marginBottom: 10 }}>
          <button
            type="button"
            onClick={() => setModo("asociar")}
            disabled={!hayDiscovery}
            style={{
              fontSize: 11.5, fontWeight: 700, fontFamily: "inherit", padding: "5px 12px", borderRadius: 6, border: "none",
              cursor: hayDiscovery ? "pointer" : "not-allowed",
              background: modo === "asociar" ? "var(--fg)" : "transparent",
              color: modo === "asociar" ? "#fff" : hayDiscovery ? "var(--muted)" : "var(--gray-300)",
            }}
          >
            Asociar a uno existente
          </button>
          <button
            type="button"
            onClick={() => setModo("nuevo")}
            style={{
              fontSize: 11.5, fontWeight: 700, fontFamily: "inherit", padding: "5px 12px", borderRadius: 6, border: "none", cursor: "pointer",
              background: modo === "nuevo" ? "var(--fg)" : "transparent",
              color: modo === "nuevo" ? "#fff" : "var(--muted)",
            }}
          >
            Crear uno nuevo
          </button>
        </div>

        {modo === "asociar" ? (
          <select value={discoveryId} onChange={(e) => setDiscoveryId(e.target.value)} style={{ ...inputStyle, marginBottom: 16 }}>
            {discoveryOptions.map((d) => (
              <option key={d.id} value={d.id}>
                {d.project_code ? `${d.project_code} · ` : ""}{d.name}
              </option>
            ))}
          </select>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16 }}>
            <input
              value={discoveryName}
              onChange={(e) => setDiscoveryName(e.target.value)}
              placeholder="Nombre del Discovery project"
              style={inputStyle}
            />
            <textarea
              value={discoverySummary}
              onChange={(e) => setDiscoverySummary(e.target.value)}
              placeholder="De qué se trata"
              rows={2}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>
        )}

        <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
          Delivery Proyecto
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input
            value={deliveryName}
            onChange={(e) => setDeliveryName(e.target.value)}
            placeholder="Nombre del Delivery Proyecto"
            style={inputStyle}
          />
          <textarea
            value={deliverySummary}
            onChange={(e) => setDeliverySummary(e.target.value)}
            placeholder="De qué se trata"
            rows={2}
            style={{ ...inputStyle, resize: "vertical" }}
          />
        </div>

        {error && <p style={{ fontSize: 12, color: "#DC2626", margin: "12px 0 0" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: "8px 14px", borderRadius: 8,
              border: "1px solid var(--border)", background: "#fff", color: "var(--fg)", cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={!puedeCrear || saving}
            onClick={crear}
            style={{
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: "8px 14px", borderRadius: 8, border: "none",
              background: puedeCrear ? "var(--dropi)" : "var(--gray-200)", color: puedeCrear ? "#fff" : "var(--muted)",
              cursor: puedeCrear && !saving ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Creando…" : "Crear"}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hilo de comentarios de un proyecto (tabla project_comments vía
// /api/proyectos/[id]/comentarios). Cualquier usuario autenticado puede leer
// y agregar; la autoría queda por correo del lado del servidor.
function ComentariosModal({
  proyecto,
  autorEmail,
  onClose,
  onCountChange,
}: {
  proyecto: Proyecto;
  autorEmail: string | null;
  onClose: () => void;
  onCountChange: (n: number) => void;
}) {
  const [comentarios, setComentarios] = useState<Comentario[] | null>(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let vivo = true;
    fetch(`/api/proyectos/${proyecto.id}/comentarios`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("No se pudieron cargar los comentarios."))))
      .then((data: Comentario[]) => {
        if (!vivo) return;
        setComentarios(data);
        onCountChange(data.length);
      })
      .catch((e) => vivo && setError(e.message));
    return () => {
      vivo = false;
    };
    // onCountChange se recrea en cada render del padre; no debe re-disparar el fetch.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyecto.id]);

  async function enviar() {
    if (!texto.trim()) return;
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch(`/api/proyectos/${proyecto.id}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario: texto.trim() }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => null);
        throw new Error(d?.error ?? "No se pudo enviar el comentario.");
      }
      const nuevo: Comentario = await r.json();
      setComentarios((prev) => {
        const next = [...(prev ?? []), nuevo];
        onCountChange(next.length);
        return next;
      });
      setTexto("");
    } catch (e: any) {
      setError(e.message ?? "No se pudo enviar.");
    } finally {
      setEnviando(false);
    }
  }

  function fmtFecha(iso: string) {
    return new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, zIndex: 100, backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", border: "1px solid var(--border)", borderRadius: 16,
          maxWidth: 460, width: "100%", padding: 20, maxHeight: "85vh", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 4 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--fg)", margin: 0 }}>Comentarios</h3>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0" }}>
              {proyecto.project_code ? `${proyecto.project_code} · ` : ""}{proyecto.name}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--gray-400)", padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", margin: "12px 0", display: "flex", flexDirection: "column", gap: 10 }}>
          {comentarios === null && !error && (
            <p style={{ fontSize: 12, color: "var(--muted)" }}>Cargando…</p>
          )}
          {comentarios !== null && comentarios.length === 0 && (
            <p style={{ fontSize: 12, color: "var(--gray-300)", fontStyle: "italic" }}>Sin comentarios todavía.</p>
          )}
          {comentarios?.map((c) => (
            <div key={c.id} style={{ borderLeft: "2px solid var(--gray-100)", paddingLeft: 10 }}>
              <div style={{ display: "flex", gap: 6, alignItems: "baseline", flexWrap: "wrap" }}>
                <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--fg)" }}>
                  {c.autor === autorEmail ? "Tú" : c.autor}
                </span>
                <span style={{ fontSize: 10, color: "var(--gray-400)" }}>{fmtFecha(c.created_at)}</span>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--fg)", margin: "2px 0 0", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                {c.comentario}
              </p>
            </div>
          ))}
        </div>

        {error && <p style={{ fontSize: 12, color: "#DC2626", margin: "0 0 8px" }}>{error}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 8, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          <textarea
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escribe un comentario…"
            rows={2}
            style={{
              width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
              fontSize: 13, boxSizing: "border-box", fontFamily: "inherit", resize: "vertical",
            }}
          />
          <button
            type="button"
            disabled={!texto.trim() || enviando}
            onClick={enviar}
            style={{
              alignSelf: "flex-end",
              fontSize: 12.5, fontWeight: 700, fontFamily: "inherit", padding: "7px 14px", borderRadius: 8, border: "none",
              background: texto.trim() ? "var(--dropi)" : "var(--gray-200)", color: texto.trim() ? "#fff" : "var(--muted)",
              cursor: texto.trim() && !enviando ? "pointer" : "not-allowed",
            }}
          >
            {enviando ? "Enviando…" : "Comentar"}
          </button>
        </div>
      </div>
    </div>
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

// Mismo patrón que PrioridadEditor pero para estado_interno: chip clickeable
// que se vuelve <select> con las etapas de un Delivery Proyecto. Cambiar el
// estado re-agrupa la card en el Roadmap.
function EstadoEditor({
  estado,
  editable,
  onChange,
}: {
  estado: string | null;
  editable: boolean;
  onChange: (estado: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const color = estado ? ESTADO_BAR_COLOR[estado] ?? "var(--gray-400)" : "var(--gray-300)";

  if (!editable) {
    return (
      <span
        style={{
          fontSize: 9,
          fontWeight: 700,
          color,
          border: `1px solid ${color}`,
          borderRadius: 999,
          padding: "0 6px",
        }}
      >
        {estado ?? "sin estado"}
      </span>
    );
  }

  if (editing) {
    return (
      <select
        autoFocus
        defaultValue={estado ?? ""}
        onChange={(e) => {
          onChange(e.target.value || null);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        style={{
          fontSize: 10.5,
          fontFamily: "inherit",
          color: "var(--gray-600)",
          background: "#fff",
          border: "1px solid var(--gray-200)",
          borderRadius: 6,
          padding: "1px 4px",
        }}
      >
        {ESTADOS_DELIVERY.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Cambiar estado"
      style={{
        fontSize: 9,
        fontWeight: 700,
        color,
        border: `1px solid ${color}`,
        borderRadius: 999,
        padding: "0 6px",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      {estado ?? "sin estado"}
    </button>
  );
}

// Chip "label: fecha" que al hacer click se vuelve un <input type="date"> y
// guarda al elegir/salir. Mismo patrón que PrioridadEditor. Read-only si no
// se puede editar (célula ajena).
function FechaEditor({
  label,
  valor,
  editable,
  onChange,
}: {
  label: string;
  valor: string | null;
  editable: boolean;
  onChange: (valor: string | null) => void;
}) {
  const [editing, setEditing] = useState(false);
  const texto = valor ? fmtFechaCorta(valor) : "—";

  if (editing && editable) {
    return (
      <input
        type="date"
        autoFocus
        defaultValue={valor ?? ""}
        onChange={(e) => {
          onChange(e.target.value || null);
          setEditing(false);
        }}
        onBlur={() => setEditing(false)}
        style={{
          fontSize: 10.5, fontFamily: "inherit", color: "var(--gray-600)",
          background: "#fff", border: "1px solid var(--gray-200)", borderRadius: 6, padding: "1px 4px",
        }}
      />
    );
  }

  return (
    <span
      onClick={editable ? () => setEditing(true) : undefined}
      title={editable ? `Editar ${label.toLowerCase()}` : undefined}
      style={{
        fontSize: 10, fontWeight: 600, color: valor ? "var(--gray-600)" : "var(--gray-400)",
        cursor: editable ? "pointer" : "default",
        display: "inline-flex", alignItems: "center", gap: 3,
      }}
    >
      <span style={{ color: "var(--gray-400)", fontWeight: 500 }}>{label}:</span>
      {texto}
    </span>
  );
}

// Modal de detalle de un proyecto del Roadmap: editar las 4 fechas del
// pipeline (handoff, inicio dev, entrega/inicio QA, salida a producción), ver
// el log de cambios (project_changelog vía /api/proyectos/[id]/historial) y
// dejar comentarios (project_comments, misma ruta que ComentariosModal).
function RoadmapDetalleModal({
  proyecto,
  autorEmail,
  editable,
  onFechaChange,
  onClose,
  onCountChange,
}: {
  proyecto: ProyectoConCelula;
  autorEmail: string | null;
  editable: boolean;
  onFechaChange: (
    campo: FechaCampo,
    valor: string | null,
    nota?: string | null,
  ) => Promise<boolean>;
  onClose: () => void;
  onCountChange: (n: number) => void;
}) {
  const [fechas, setFechas] = useState<Record<FechaCampo, string | null>>({
    fecha_handoff: proyecto.fecha_handoff,
    fecha_inicio_dev: proyecto.fecha_inicio_dev,
    fecha_entrega_qa: proyecto.fecha_entrega_qa,
    fecha_salida_produccion: proyecto.fecha_salida_produccion,
  });
  const [notaFecha, setNotaFecha] = useState("");
  const [historial, setHistorial] = useState<Cambio[] | null>(null);
  const [comentarios, setComentarios] = useState<Comentario[] | null>(null);
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cargarHistorial = useCallback(() => {
    fetch(`/api/proyectos/${proyecto.id}/historial`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("No se pudo cargar el historial."))))
      .then((data: Cambio[]) => setHistorial(data))
      .catch(() => setHistorial([]));
  }, [proyecto.id]);

  useEffect(() => {
    cargarHistorial();
    fetch(`/api/proyectos/${proyecto.id}/comentarios`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error("No se pudieron cargar los comentarios."))))
      .then((data: Comentario[]) => {
        setComentarios(data);
        onCountChange(data.length);
      })
      .catch(() => setComentarios([]));
    // onCountChange se recrea cada render del padre; no debe re-disparar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [proyecto.id, cargarHistorial]);

  async function cambiarFecha(campo: FechaCampo, valor: string | null) {
    const prev = fechas[campo];
    setFechas((f) => ({ ...f, [campo]: valor }));
    const ok = await onFechaChange(campo, valor, notaFecha.trim() || null);
    if (!ok) {
      setFechas((f) => ({ ...f, [campo]: prev }));
      setError("No se pudo guardar la fecha.");
      return;
    }
    setNotaFecha("");
    setTimeout(cargarHistorial, 250);
  }

  async function enviarComentario() {
    if (!texto.trim()) return;
    setEnviando(true);
    setError(null);
    try {
      const r = await fetch(`/api/proyectos/${proyecto.id}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comentario: texto.trim() }),
      });
      if (!r.ok) {
        const d = await r.json().catch(() => null);
        throw new Error(d?.error ?? "No se pudo enviar el comentario.");
      }
      const nuevo: Comentario = await r.json();
      setComentarios((prev) => {
        const next = [...(prev ?? []), nuevo];
        onCountChange(next.length);
        return next;
      });
      setTexto("");
    } catch (e: any) {
      setError(e.message ?? "No se pudo enviar.");
    } finally {
      setEnviando(false);
    }
  }

  function fmtRel(iso: string) {
    return new Date(iso).toLocaleString("es-CO", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  function fmtValor(campo: string, v: string | null) {
    if (v == null || v === "") return "—";
    if (campo.startsWith("fecha_")) return fmtFechaCorta(v) ?? v;
    return v;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, zIndex: 100, backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", border: "1px solid var(--border)", borderRadius: 16,
          maxWidth: 520, width: "100%", padding: 20, maxHeight: "88vh", display: "flex", flexDirection: "column",
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 800, color: "var(--fg)", margin: 0 }}>
              {proyecto.project_code ? `${proyecto.project_code} · ` : ""}{proyecto.name}
            </h3>
            <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0" }}>
              {proyecto.celulaNombre} · {proyecto.estado_interno ?? "sin estado"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ border: "none", background: "transparent", cursor: "pointer", color: "var(--gray-400)", padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>

        <div style={{ overflowY: "auto", marginTop: 14, display: "flex", flexDirection: "column", gap: 18 }}>
          {/* Fechas */}
          <section>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
              Fechas
            </p>
            <div style={{ display: "flex", gap: "8px 20px", flexWrap: "wrap" }}>
              <FechaEditor
                label="Handoff"
                valor={fechas.fecha_handoff}
                editable={editable}
                onChange={(v) => cambiarFecha("fecha_handoff", v)}
              />
              <FechaEditor
                label="Inicio dev"
                valor={fechas.fecha_inicio_dev}
                editable={editable}
                onChange={(v) => cambiarFecha("fecha_inicio_dev", v)}
              />
              <FechaEditor
                label="Entrega / inicio QA"
                valor={fechas.fecha_entrega_qa}
                editable={editable}
                onChange={(v) => cambiarFecha("fecha_entrega_qa", v)}
              />
              <FechaEditor
                label="Salida a producción"
                valor={fechas.fecha_salida_produccion}
                editable={editable}
                onChange={(v) => cambiarFecha("fecha_salida_produccion", v)}
              />
            </div>
            {editable && (
              <input
                value={notaFecha}
                onChange={(e) => setNotaFecha(e.target.value)}
                placeholder="Nota para el próximo cambio de fecha (opcional)"
                style={{
                  width: "100%", marginTop: 8, padding: "6px 10px", borderRadius: 8, border: "1px solid var(--border)",
                  fontSize: 12, boxSizing: "border-box", fontFamily: "inherit",
                }}
              />
            )}
          </section>

          {/* Log de cambios */}
          <section>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
              Log de cambios
            </p>
            {historial === null && <p style={{ fontSize: 12, color: "var(--muted)" }}>Cargando…</p>}
            {historial !== null && historial.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--gray-300)", fontStyle: "italic" }}>Sin cambios registrados.</p>
            )}
            {historial && historial.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {historial.map((h) => (
                  <div key={h.id} style={{ borderLeft: "2px solid var(--gray-100)", paddingLeft: 10 }}>
                    <div style={{ fontSize: 11.5, color: "var(--fg)" }}>
                      <strong>{CAMPO_LABEL[h.campo] ?? h.campo}</strong>{" "}
                      <span style={{ color: "var(--gray-400)" }}>{fmtValor(h.campo, h.valor_anterior)}</span>
                      {" → "}
                      <span style={{ fontWeight: 700 }}>{fmtValor(h.campo, h.valor_nuevo)}</span>
                    </div>
                    {h.nota && <div style={{ fontSize: 11.5, color: "var(--fg)", marginTop: 1 }}>“{h.nota}”</div>}
                    <div style={{ fontSize: 10, color: "var(--gray-400)", marginTop: 1 }}>
                      {h.autor === autorEmail ? "Tú" : h.autor ?? "—"} · {fmtRel(h.created_at)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Comentarios */}
          <section>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 8px" }}>
              Comentarios
            </p>
            {comentarios === null && <p style={{ fontSize: 12, color: "var(--muted)" }}>Cargando…</p>}
            {comentarios !== null && comentarios.length === 0 && (
              <p style={{ fontSize: 12, color: "var(--gray-300)", fontStyle: "italic" }}>Sin comentarios todavía.</p>
            )}
            {comentarios && comentarios.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 10 }}>
                {comentarios.map((c) => (
                  <div key={c.id} style={{ borderLeft: "2px solid var(--gray-100)", paddingLeft: 10 }}>
                    <div style={{ display: "flex", gap: 6, alignItems: "baseline", flexWrap: "wrap" }}>
                      <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--fg)" }}>
                        {c.autor === autorEmail ? "Tú" : c.autor}
                      </span>
                      <span style={{ fontSize: 10, color: "var(--gray-400)" }}>{fmtRel(c.created_at)}</span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--fg)", margin: "2px 0 0", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                      {c.comentario}
                    </p>
                  </div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <textarea
                value={texto}
                onChange={(e) => setTexto(e.target.value)}
                placeholder="Escribe un comentario…"
                rows={2}
                style={{
                  width: "100%", padding: "8px 12px", borderRadius: 8, border: "1px solid var(--border)",
                  fontSize: 13, boxSizing: "border-box", fontFamily: "inherit", resize: "vertical",
                }}
              />
              <button
                type="button"
                disabled={!texto.trim() || enviando}
                onClick={enviarComentario}
                style={{
                  alignSelf: "flex-end",
                  fontSize: 12.5, fontWeight: 700, fontFamily: "inherit", padding: "7px 14px", borderRadius: 8, border: "none",
                  background: texto.trim() ? "var(--dropi)" : "var(--gray-200)", color: texto.trim() ? "#fff" : "var(--muted)",
                  cursor: texto.trim() && !enviando ? "pointer" : "not-allowed",
                }}
              >
                {enviando ? "Enviando…" : "Comentar"}
              </button>
            </div>
          </section>
        </div>

        {error && <p style={{ fontSize: 12, color: "#DC2626", margin: "10px 0 0" }}>{error}</p>}
      </div>
    </div>
  );
}

// ─── Roadmap / Gantt ──────────────────────────────────────────────────────
// Un solo timeline agrupado por célula, con dos tipos de marca según la etapa
// del Delivery Proyecto:
//   • "en DEV" / "Activo" / "Cerrado" con salida a producción → barra completa
//     (fecha_inicio_dev → fecha_salida_produccion).
//   • "Pendiente Handoff" con fecha de handoff                → hito ◆ sobre
//     fecha_handoff. Solo marca la fecha tentativa en que Ingeniería nos
//     recibe; no lleva fin porque todavía está por validar.
// Todo lo demás ("En definición" / "En priorización", o proyectos a los que
// les falta la fecha que su etapa necesita) baja a las listas por etapa de
// "Sin planear en el timeline" para no esconderlo.

const PX_POR_DIA = 5;

function isoADate(iso: string | null): Date | null {
  if (!iso) return null;
  const solo = iso.slice(0, 10);
  const [y, m, d] = solo.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function difDias(a: Date, b: Date) {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

function primerDiaDelMes(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function fechaCortaDeDate(d: Date) {
  return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" });
}

const DEV_ESTADOS = new Set(["en DEV", "Activo", "Cerrado"]);

type TimelineItem =
  | { kind: "bar"; p: ProyectoConCelula; ini: Date; fin: Date }
  | { kind: "hito"; p: ProyectoConCelula; fecha: Date };

function GanttBoard({
  proyectos,
  editableFn,
  onFechaChange,
  onEstadoChange,
  onPrioridadChange,
  onPasoADev,
  onOpenDetalle,
}: {
  proyectos: ProyectoConCelula[];
  editableFn: (p: Proyecto) => boolean;
  onFechaChange: (
    celulaId: string,
    projectId: string,
    campo: FechaCampo,
    valor: string | null,
  ) => void;
  onEstadoChange: (celulaId: string, projectId: string, estado: string | null) => void;
  onPrioridadChange: (celulaId: string, projectId: string, prioridad: string | null) => void;
  onPasoADev: (p: ProyectoConCelula) => void;
  onOpenDetalle: (p: ProyectoConCelula) => void;
}) {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  // Cambio de estado desde el Roadmap. El paso 'Pendiente Handoff' → 'en DEV'
  // abre el modal de fechas; el resto es un cambio directo.
  const cambiarEstado = (p: ProyectoConCelula, next: string | null) => {
    if (p.estado_interno === "Pendiente Handoff" && next === "en DEV") {
      onPasoADev(p);
    } else {
      onEstadoChange(p.celula_owner_id, p.id, next);
    }
  };

  // Clasificación por etapa: barra (DEV con salida a producción), hito
  // (Pendiente Handoff con fecha de handoff) o "sin planear" (el resto —
  // incluye "En definición").
  const { items, sinPlanear } = useMemo(() => {
    const items: TimelineItem[] = [];
    const sinPlanear: ProyectoConCelula[] = [];
    for (const p of proyectos) {
      const estado = p.estado_interno ?? "";
      if (DEV_ESTADOS.has(estado) && p.fecha_salida_produccion) {
        const fin = isoADate(p.fecha_salida_produccion)!;
        let ini = isoADate(p.fecha_inicio_dev) ?? isoADate(p.created_at) ?? fin;
        if (ini.getTime() > fin.getTime()) ini = fin;
        items.push({ kind: "bar", p, ini, fin });
      } else if (estado === "Pendiente Handoff" && p.fecha_handoff) {
        items.push({ kind: "hito", p, fecha: isoADate(p.fecha_handoff)! });
      } else {
        sinPlanear.push(p);
      }
    }
    items.sort((a, b) => {
      const da = a.kind === "bar" ? a.ini.getTime() : a.fecha.getTime();
      const db = b.kind === "bar" ? b.ini.getTime() : b.fecha.getTime();
      if (da !== db) return da - db;
      const fa = a.kind === "bar" ? a.fin.getTime() : da;
      const fb = b.kind === "bar" ? b.fin.getTime() : db;
      return fa - fb;
    });
    return { items, sinPlanear };
  }, [proyectos]);

  if (items.length === 0 && sinPlanear.length === 0) {
    return <EmptyState />;
  }

  const HANDOFF_COLOR = ESTADO_BAR_COLOR["Pendiente Handoff"];

  // Sin nada que ubicar en el tiempo: solo las listas por etapa.
  if (items.length === 0) {
    return (
      <SinPlanearLista
        proyectos={sinPlanear}
        editableFn={editableFn}
        onFechaChange={onFechaChange}
        onCambiarEstado={cambiarEstado}
        onPrioridadChange={onPrioridadChange}
        onOpenDetalle={onOpenDetalle}
      />
    );
  }

  // Rango temporal: cubre barras (ini/fin), hitos (fecha) y hoy.
  const fechas = items
    .flatMap((it) => (it.kind === "bar" ? [it.ini, it.fin] : [it.fecha]))
    .concat([hoy]);
  const min = primerDiaDelMes(new Date(Math.min(...fechas.map((d) => d.getTime()))));
  const maxRaw = new Date(Math.max(...fechas.map((d) => d.getTime())));
  const fin = new Date(maxRaw.getFullYear(), maxRaw.getMonth() + 1, 0); // último día de su mes
  const totalDias = Math.max(1, difDias(min, fin));
  const anchoTotal = totalDias * PX_POR_DIA;

  // Cabecera de meses.
  const meses: { label: string; dias: number }[] = [];
  const cursor = new Date(min);
  while (cursor.getTime() <= fin.getTime()) {
    const finMes = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0);
    const desde = cursor.getTime() < min.getTime() ? min : cursor;
    const hasta = finMes.getTime() > fin.getTime() ? fin : finMes;
    meses.push({
      label: cursor.toLocaleDateString("es-CO", { month: "short", year: "2-digit" }),
      dias: difDias(desde, hasta) + 1,
    });
    cursor.setMonth(cursor.getMonth() + 1, 1);
  }

  const hoyLeft = difDias(min, hoy) * PX_POR_DIA;

  // Agrupar por célula, preservando orden de aparición.
  const porCelula: { celula: string; items: TimelineItem[] }[] = [];
  for (const it of items) {
    const nombre = it.p.celulaNombre ?? "Sin célula";
    let grupo = porCelula.find((g) => g.celula === nombre);
    if (!grupo) {
      grupo = { celula: nombre, items: [] };
      porCelula.push(grupo);
    }
    grupo.items.push(it);
  }

  const LABEL_W = 300;
  const ROW_H = 54;

  return (
    <div>
      <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 12, background: "#fff" }}>
        <div style={{ minWidth: LABEL_W + anchoTotal }}>
          {/* Cabecera de meses */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border)", background: "var(--gray-50, #F7F8FA)" }}>
            <div style={{ flex: `0 0 ${LABEL_W}px`, padding: "6px 12px", fontSize: 11, fontWeight: 700, color: "var(--muted)" }}>
              Proyecto
            </div>
            <div style={{ position: "relative", width: anchoTotal, display: "flex" }}>
              {meses.map((m, i) => (
                <div
                  key={i}
                  style={{
                    width: m.dias * PX_POR_DIA,
                    padding: "6px 8px",
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "var(--gray-400)",
                    textTransform: "capitalize",
                    borderLeft: i === 0 ? "none" : "1px solid var(--border)",
                    boxSizing: "border-box",
                  }}
                >
                  {m.label}
                </div>
              ))}
            </div>
          </div>

          {/* Filas por célula */}
          {porCelula.map((g) => (
            <div key={g.celula}>
              <div
                style={{
                  padding: "5px 12px",
                  fontSize: 11,
                  fontWeight: 800,
                  color: "var(--fg)",
                  background: "var(--gray-50, #F7F8FA)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                {g.celula}
              </div>
              {g.items.map((it) => {
                const p = it.p;
                const puedeEditar = editableFn(p);
                const esHito = it.kind === "hito";
                const refDate = it.kind === "bar" ? it.ini : it.fecha;
                const left = difDias(min, refDate) * PX_POR_DIA;
                return (
                  <div key={p.id} style={{ display: "flex", alignItems: "stretch", borderBottom: "1px solid var(--gray-100)", minHeight: ROW_H }}>
                    <div style={{ flex: `0 0 ${LABEL_W}px`, padding: "6px 12px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "center", gap: 3 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        {p.project_code && (
                          <span style={{ fontSize: 9, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", borderRadius: 3, padding: "0 4px" }}>
                            {p.project_code}
                          </span>
                        )}
                        <Link href={projectUrl(p)} style={{ fontSize: 11, fontWeight: 600, color: "var(--fg)", textDecoration: "none", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.name}
                        </Link>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "2px 10px", flexWrap: "wrap" }}>
                        <EstadoEditor
                          estado={p.estado_interno}
                          editable={puedeEditar}
                          onChange={(v) => cambiarEstado(p, v)}
                        />
                        {esHito ? (
                          <FechaEditor
                            label="Handoff"
                            valor={p.fecha_handoff}
                            editable={puedeEditar}
                            onChange={(v) => onFechaChange(p.celula_owner_id, p.id, "fecha_handoff", v)}
                          />
                        ) : (
                          <>
                            <FechaEditor
                              label="Inicio"
                              valor={p.fecha_inicio_dev}
                              editable={puedeEditar}
                              onChange={(v) => onFechaChange(p.celula_owner_id, p.id, "fecha_inicio_dev", v)}
                            />
                            <FechaEditor
                              label="Producción"
                              valor={p.fecha_salida_produccion}
                              editable={puedeEditar}
                              onChange={(v) => onFechaChange(p.celula_owner_id, p.id, "fecha_salida_produccion", v)}
                            />
                          </>
                        )}
                        <button
                          type="button"
                          onClick={() => onOpenDetalle(p)}
                          style={{
                            fontSize: 9.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                            border: "none", background: "transparent", color: "var(--dropi)", padding: 0,
                          }}
                        >
                          Detalles
                        </button>
                      </div>
                    </div>
                    <div style={{ position: "relative", width: anchoTotal, minHeight: ROW_H }}>
                      {/* línea de hoy */}
                      {hoyLeft >= 0 && hoyLeft <= anchoTotal && (
                        <div style={{ position: "absolute", left: hoyLeft, top: 0, bottom: 0, width: 1, background: "#DC2626", opacity: 0.5 }} />
                      )}
                      {it.kind === "bar" ? (
                        <div
                          onClick={() => onOpenDetalle(p)}
                          title={`${p.name}\n${fechaCortaDeDate(it.ini)} → ${fechaCortaDeDate(it.fin)}\n${p.estado_interno ?? "sin estado"}`}
                          style={{
                            position: "absolute",
                            left,
                            top: (ROW_H - 18) / 2,
                            width: Math.max(PX_POR_DIA, (difDias(it.ini, it.fin) + 1) * PX_POR_DIA),
                            height: 18,
                            background: ESTADO_BAR_COLOR[p.estado_interno ?? ""] ?? "#94A3B8",
                            borderRadius: 5,
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: 6,
                            fontSize: 9.5,
                            fontWeight: 700,
                            color: "#fff",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            cursor: "pointer",
                          }}
                        >
                          {p.prioridad ?? ""}
                        </div>
                      ) : (
                        <div
                          onClick={() => onOpenDetalle(p)}
                          title={`${p.name}\nHandoff tentativo: ${fechaCortaDeDate(it.fecha)}\n${p.estado_interno ?? "sin estado"} — fin por validar`}
                          style={{
                            position: "absolute",
                            left: left - 8,
                            top: (ROW_H - 16) / 2,
                            width: 16,
                            height: 16,
                            background: HANDOFF_COLOR,
                            borderRadius: 3,
                            transform: "rotate(45deg)",
                            cursor: "pointer",
                          }}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 10, fontSize: 10, color: "var(--muted)" }}>
        {Object.entries(ESTADO_BAR_COLOR)
          .filter(([k]) => k !== "En priorización" && k !== "Pendiente Handoff")
          .map(([k, v]) => (
            <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: v, display: "inline-block" }} />
              {k === "En definición" ? "En definición / priorización" : k}
            </span>
          ))}
        <span style={{ display: "inline-flex", alignItems: "center", gap: 7 }}>
          <span
            style={{
              width: 10,
              height: 10,
              background: HANDOFF_COLOR,
              display: "inline-block",
              transform: "rotate(45deg)",
            }}
          />
          Pendiente Handoff (fecha tentativa)
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <span style={{ width: 1, height: 12, background: "#DC2626", display: "inline-block" }} /> Hoy
        </span>
      </div>

      {sinPlanear.length > 0 && (
        <SinPlanearLista
          proyectos={sinPlanear}
          editableFn={editableFn}
          onFechaChange={onFechaChange}
          onCambiarEstado={cambiarEstado}
          onPrioridadChange={onPrioridadChange}
          onOpenDetalle={onOpenDetalle}
        />
      )}
    </div>
  );
}

// Proyectos que no entran al timeline (todavía sin las fechas que su etapa
// necesita): se muestran en listas separadas por estado — "en DEV",
// "Pendiente Handoff", "En definición", etc. Dentro de cada lista van por
// prioridad (P0 → P4, sin prioridad al final). Prioridad y estado se editan
// en la fila: cambiar el estado mueve la card a la lista que corresponde (y el
// paso a 'en DEV' abre el modal de fechas vía onCambiarEstado).
function SinPlanearLista({
  proyectos,
  editableFn,
  onFechaChange,
  onCambiarEstado,
  onPrioridadChange,
  onOpenDetalle,
}: {
  proyectos: ProyectoConCelula[];
  editableFn: (p: Proyecto) => boolean;
  onFechaChange: (
    celulaId: string,
    projectId: string,
    campo: FechaCampo,
    valor: string | null,
  ) => void;
  onCambiarEstado: (p: ProyectoConCelula, estado: string | null) => void;
  onPrioridadChange: (celulaId: string, projectId: string, prioridad: string | null) => void;
  onOpenDetalle: (p: ProyectoConCelula) => void;
}) {
  // Orden de las listas en el Roadmap: primero lo más en marcha ("en DEV"),
  // luego lo que espera recepción ("Pendiente Handoff"), y el resto en el
  // orden del pipeline. No sigue el orden canónico de ESTADOS_DELIVERY.
  const ORDEN_LISTAS = ["en DEV", "Pendiente Handoff", "En definición", "En priorización", "Activo", "Cerrado"];
  const rankLista = (estado: string) => {
    const i = ORDEN_LISTAS.indexOf(estado);
    return i === -1 ? ORDEN_LISTAS.length : i;
  };
  const grupos = agruparPorEtapa(proyectos)
    .filter((g) => g.items.length > 0)
    .sort((a, b) => rankLista(a.estado) - rankLista(b.estado));

  return (
    <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 14 }}>
      {grupos.map((g) => {
        const color = ESTADO_BAR_COLOR[g.estado] ?? "var(--gray-400)";
        return (
          <div
            key={g.estado}
            style={{ border: "1px dashed var(--border)", borderRadius: 12, padding: "12px 14px", background: "var(--gray-50, #F7F8FA)" }}
          >
            <p style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 800, color: "var(--fg)", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: color, display: "inline-block" }} />
              {g.estado}
              <span style={{ fontWeight: 700, color: "var(--muted)" }}>({g.items.length})</span>
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {g.items
                .slice()
                .sort((a, b) => priorityRank(a.prioridad) - priorityRank(b.prioridad) || a.name.localeCompare(b.name))
                .map((p) => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                  {p.project_code && (
                    <span style={{ fontSize: 9, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", borderRadius: 3, padding: "0 4px" }}>
                      {p.project_code}
                    </span>
                  )}
                  <PrioridadEditor
                    prioridad={p.prioridad}
                    editable={editableFn(p)}
                    onChange={(v) => onPrioridadChange(p.celula_owner_id, p.id, v)}
                  />
                  <Link href={projectUrl(p)} style={{ fontSize: 11.5, fontWeight: 600, color: "var(--fg)", textDecoration: "none" }}>
                    {p.name}
                  </Link>
                  <span style={{ fontSize: 10, color: "var(--gray-400)" }}>({p.celulaNombre})</span>
                  <EstadoEditor
                    estado={p.estado_interno}
                    editable={editableFn(p)}
                    onChange={(v) => onCambiarEstado(p, v)}
                  />
                  <button
                    type="button"
                    onClick={() => onOpenDetalle(p)}
                    style={{
                      fontSize: 9.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                      border: "none", background: "transparent", color: "var(--dropi)", padding: 0,
                    }}
                  >
                    Detalles
                  </button>
                  <span style={{ marginLeft: "auto", display: "flex", gap: 12, flexWrap: "wrap" }}>
                    {g.estado === "Pendiente Handoff" ? (
                      <FechaEditor
                        label="Handoff"
                        valor={p.fecha_handoff}
                        editable={editableFn(p)}
                        onChange={(v) => onFechaChange(p.celula_owner_id, p.id, "fecha_handoff", v)}
                      />
                    ) : (
                      <>
                        <FechaEditor
                          label="Inicio"
                          valor={p.fecha_inicio_dev}
                          editable={editableFn(p)}
                          onChange={(v) => onFechaChange(p.celula_owner_id, p.id, "fecha_inicio_dev", v)}
                        />
                        <FechaEditor
                          label="Producción"
                          valor={p.fecha_salida_produccion}
                          editable={editableFn(p)}
                          onChange={(v) => onFechaChange(p.celula_owner_id, p.id, "fecha_salida_produccion", v)}
                        />
                      </>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Modal al pasar un proyecto de 'Pendiente Handoff' a 'en DEV': captura las
// fechas del ciclo de desarrollo en un solo PATCH. Inicio dev se precarga con
// hoy (o la fecha que ya tuviera); QA y producción quedan vacías si no las
// llenan. La nota se adjunta a las filas del log de ese cambio.
function PasoADevModal({
  proyecto,
  onCancel,
  onConfirm,
}: {
  proyecto: ProyectoConCelula;
  onCancel: () => void;
  onConfirm: (
    fechas: {
      fecha_inicio_dev: string | null;
      fecha_entrega_qa: string | null;
      fecha_salida_produccion: string | null;
    },
    nota: string | null,
  ) => Promise<boolean>;
}) {
  const [inicioDev, setInicioDev] = useState(proyecto.fecha_inicio_dev ?? hoyISO());
  const [entregaQa, setEntregaQa] = useState(proyecto.fecha_entrega_qa ?? "");
  const [salidaProd, setSalidaProd] = useState(proyecto.fecha_salida_produccion ?? "");
  const [nota, setNota] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmar() {
    setSaving(true);
    setError(null);
    const ok = await onConfirm(
      {
        fecha_inicio_dev: inicioDev || hoyISO(),
        fecha_entrega_qa: entregaQa || null,
        fecha_salida_produccion: salidaProd || null,
      },
      nota.trim() || null,
    );
    if (!ok) {
      setError("No se pudo pasar el proyecto a DEV.");
      setSaving(false);
    }
  }

  const inputStyle: CSSProperties = {
    width: "100%", padding: "7px 10px", borderRadius: 8, border: "1px solid var(--border)",
    fontSize: 13, boxSizing: "border-box", fontFamily: "inherit", background: "#fff", color: "var(--fg)",
  };
  const labelStyle: CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.05em",
    display: "block", margin: "0 0 4px",
  };

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24, zIndex: 100, backdropFilter: "blur(4px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", border: "1px solid var(--border)", borderRadius: 16,
          maxWidth: 420, width: "100%", padding: 22, maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <h3 style={{ fontSize: 16, fontWeight: 800, color: "var(--fg)", margin: "0 0 2px" }}>Pasar a DEV</h3>
        <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 4px" }}>
          {proyecto.project_code ? `${proyecto.project_code} · ` : ""}{proyecto.name}
        </p>
        <p style={{ fontSize: 12, color: "var(--gray-400)", margin: "0 0 16px" }}>
          Confirma las fechas del ciclo de desarrollo. Si todavía no tienes QA o producción, déjalas vacías.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <label style={labelStyle}>Inicio dev</label>
            <input type="date" value={inicioDev} onChange={(e) => setInicioDev(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Entrega / inicio QA</label>
            <input type="date" value={entregaQa} onChange={(e) => setEntregaQa(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Salida a producción</label>
            <input type="date" value={salidaProd} onChange={(e) => setSalidaProd(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Nota para el log (opcional)</label>
            <input
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Por qué se mueven estas fechas"
              style={inputStyle}
            />
          </div>
        </div>

        {error && <p style={{ fontSize: 12, color: "#DC2626", margin: "12px 0 0" }}>{error}</p>}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              fontSize: 13, fontWeight: 600, fontFamily: "inherit", padding: "8px 14px", borderRadius: 8,
              border: "1px solid var(--border)", background: "#fff", color: "var(--fg)", cursor: "pointer",
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={confirmar}
            style={{
              fontSize: 13, fontWeight: 700, fontFamily: "inherit", padding: "8px 14px", borderRadius: 8, border: "none",
              background: "var(--dropi)", color: "#fff", cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Guardando…" : "Pasar a DEV"}
          </button>
        </div>
      </div>
    </div>
  );
}
