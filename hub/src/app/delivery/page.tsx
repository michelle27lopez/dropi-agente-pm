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
};

type Comentario = { id: string; autor: string; comentario: string; created_at: string };

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
  const [vista, setVista] = useState<"celula" | "prioridad">("celula");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [showCrear, setShowCrear] = useState(false);
  const [commentTarget, setCommentTarget] = useState<Proyecto | null>(null);
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
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
  commentCounts,
  onOpenComentarios,
}: {
  proyectos: ProyectoConCelula[];
  mostrarCelula: boolean;
  editableFn: (p: Proyecto) => boolean;
  onPrioridadChange: (celulaId: string, projectId: string, prioridad: string | null) => void;
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
  commentCount,
  onOpenComentarios,
}: {
  proyecto: Proyecto;
  celulaNombre?: string;
  editable: boolean;
  onPrioridadChange: (prioridad: string | null) => void;
  commentCount?: number;
  onOpenComentarios: () => void;
}) {
  const dias = diasDesde(p.updated_at);

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
