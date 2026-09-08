"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronRight } from "lucide-react";
import HubFooter from "@/components/HubFooter";
import HubHeader from "@/components/HubHeader";
import { type Item, Section } from "@/components/HomeSections";
import { SEMANAS, REGISTRY } from "@/app/weekly/data/index";
import { localCellBoards } from "@/app/celula/_cell-board";
import { ProjectCard, type Proyecto } from "@/components/ProjectCard";
import { ModoLecturaBanner } from "@/components/ModoLecturaBanner";
import ObjetivoPanel, { type Objetivo } from "./_components/ObjetivoPanel";
import { previewUpdateContent } from "@/lib/update-preview";
import { esProyectoVisible } from "@/lib/curated-projects";
import MiDiaShell from "@/app/proyectos/mi-dia/MiDiaShell";

// El weekly de logística arrastra el registro completo del tablero
// (proyectos/logistica/_lib/data.ts, ~1.800 líneas). Se carga aparte para que
// ese peso no entre en el bundle de las demás células, que no lo usan. Por lo
// mismo, el mapa de etapas se pide con un `import()` dentro del efecto.
const WeeklyBanner = dynamic(() => import("./_components/WeeklyBanner"), { ssr: false });
const SellersMetricsPanel = dynamic(() => import("./_components/SellersMetricsPanel"), { ssr: false });
type Update = { id: string; week_date: string; title: string; content: string; url: string | null };

type Profile = { celula_id: string | null; is_super_admin: boolean; email: string | null };
// celula_id primario ≠ dónde puede editar: un perfil también puede tener
// permiso adicional vía `celula_editores` (proyectos transversales, ver
// 055_celula_editores_transversales.sql) sin que le cambie su célula "de
// verdad". `/api/me` ya devuelve esa lista aparte.

type CelulaHome = {
  id: string; nombre: string; slug: string; lead: string | null; area: string | null;
  ve_hub_completo: boolean;
  mision: string | null; vision: string | null; nsm: string | null;
  foco_trimestre: string | null; enlace_direccionamiento: string | null;
  proyectos: Proyecto[]; updates: Update[];
};

const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B", "Listo para handoff": "#0EA5E9", "Handoff hecho": "#22C55E",
};
const TYPE_ICON: Record<string, string> = {
  Idea: "💡", Oportunidad: "🔭", POC: "🧪", Proyecto: "🚀", "Delivery Proyecto": "🚚",
};

function truncate(text: string | undefined | null, max: number) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

function proyectoToItem(p: Proyecto): Item {
  return {
    key: p.id,
    name: p.name,
    description: truncate(p.summary ?? p.business_area ?? "Sin descripción aún.", 160),
    url: p.prototype_url ?? `/proyectos/${p.project_code ? p.project_code.toLowerCase() : p.id}`,
    tag: p.project_code ?? p.handoff_status ?? "Sin código",
    color: (p.handoff_status && HANDOFF_COLOR[p.handoff_status]) ?? "#94A3B8",
    icon: (p.type && TYPE_ICON[p.type]) ?? "📁",
  };
}

function updateToItem(u: Update): Item {
  return {
    key: u.id,
    name: u.title,
    description: previewUpdateContent(u.content),
    url: u.url ?? undefined,
    tag: u.week_date,
    color: "#6366F1",
    icon: "📋",
  };
}

function weeklyToItem(semana: { date: string; label: string }): Item {
  const snapshot = REGISTRY[semana.date];
  return {
    key: `weekly-${semana.date}`,
    name: "Weekly PM",
    description: truncate(snapshot.subtitle, 160),
    url: `/weekly?week=${semana.date}`,
    tag: semana.date.slice(0, 10),
    color: "#F77F00",
    icon: "📅",
  };
}

export default function CelulaHomePage() {
  const params = useParams<{ slug: string }>();
  const [celula, setCelula] = useState<CelulaHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [celulasEditor, setCelulasEditor] = useState<string[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", summary: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [openUpdate, setOpenUpdate] = useState<Update | null>(null);
  // Modo lectura (2026-08-17, Jaime): ver la home de una célula que no es la
  // tuya (vía el switcher de GlobalTopBar) ya no da los mismos poderes de
  // edición que tu propia célula — antes cualquier super admin podía crear/
  // editar/eliminar en cualquier célula sin distinción visual. El toggle
  // "Editar de todos modos" es la única forma de recuperar esos poderes,
  // pensado para cuando de verdad hay que corregir algo de otra célula.
  const [modoEdicionForzado, setModoEdicionForzado] = useState(false);

  useEffect(() => {
    fetch(`/api/celulas/${params.slug}`)
      .then(async (res) => {
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setCelula(data);
      })
      .finally(() => setLoading(false));

    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        setProfile(data?.profile ?? null);
        setCelulasEditor(data?.celulasEditor ?? []);
      })
      .catch(() => setProfile(null));
  }, [params.slug]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const res = await fetch(`/api/celulas/${params.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setFormError(data.error ?? "No se pudo crear el proyecto.");
      return;
    }

    setCelula((prev) => prev ? { ...prev, proyectos: [...prev.proyectos, data] } : prev);
    setForm({ name: "", summary: "" });
    setShowForm(false);
  }

  if (loading) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p></main>;
  if (notFound || !celula) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Célula no encontrada.</p></main>;

  const visibles = celula.proyectos.filter(esProyectoVisible);
  const proyectos = visibles.filter((p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following").map(proyectoToItem);
  const poc = visibles.filter((p) => p.type === "POC").map(proyectoToItem);
  const esCelulaPropia = !!profile && (profile.celula_id === celula.id || celulasEditor.includes(celula.id));
  const canCreate = esCelulaPropia || modoEdicionForzado;

  const pocsByParent = new Map<string, Proyecto[]>();
  const deliveriesByParent = new Map<string, Proyecto[]>();
  const followingsByDelivery = new Map<string, Proyecto[]>();
  for (const p of celula.proyectos) {
    if (p.type === "POC" && p.parent_project_id) {
      const list = pocsByParent.get(p.parent_project_id) ?? [];
      list.push(p);
      pocsByParent.set(p.parent_project_id, list);
    }
    if (p.type === "Delivery Proyecto" && p.parent_project_id) {
      const list = deliveriesByParent.get(p.parent_project_id) ?? [];
      list.push(p);
      deliveriesByParent.set(p.parent_project_id, list);
    }
    if (p.type === "Following" && p.related_delivery_id) {
      const list = followingsByDelivery.get(p.related_delivery_id) ?? [];
      list.push(p);
      followingsByDelivery.set(p.related_delivery_id, list);
    }
  }

  async function handleEstadoChange(id: string, estado: string) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_interno: estado }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: prev.proyectos.map((p) => (p.id === updated.id ? updated : p)) } : prev);
  }

  async function handleVpvChange(id: string, vpv: number | null) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vpv }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: prev.proyectos.map((p) => (p.id === updated.id ? updated : p)) } : prev);
  }

  async function handleCrearPoc(parent: Proyecto, name: string, summary: string) {
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary }),
    });
    if (!res.ok) return;
    const created = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: [...prev.proyectos, created] } : prev);
  }

  async function handleCrearDelivery(parent: Proyecto, name: string, summary: string, relatedPocId: string | null) {
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary, type: "Delivery Proyecto", related_poc_id: relatedPocId }),
    });
    if (!res.ok) return;
    const created = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: [...prev.proyectos, created] } : prev);
  }

  async function handleRelatedPocChange(id: string, relatedPocId: string | null) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ related_poc_id: relatedPocId }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: prev.proyectos.map((p) => (p.id === updated.id ? updated : p)) } : prev);
  }

  async function handleCrearFollowing(parent: Proyecto, name: string, summary: string): Promise<string | null> {
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary, type: "Following" }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return data?.error ?? "No se pudo crear el Following.";
    }
    const created = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: [...prev.proyectos, created] } : prev);
    return null;
  }

  // La home de célula ya NO se reemplaza por "Mi día" (2026-08-17,
  // globalización aprobada por Jaime) — todas las células muestran la misma
  // interfaz estándar (grid Discovery/POC/Delivery/Following). "Mi día"
  // sigue existiendo como su propia página en el sidebar (/), no acá — ver
  // [[project_darwin_pd_dashboard]].

  // "Updates" mezcla los registros de celula_updates con el historial del
  // Weekly PM de esta célula (si tiene alguno) — mismo look de tarjeta,
  // ordenado por fecha descendente.
  const semanasCelula = SEMANAS.filter((s) => s.celula === celula.slug && REGISTRY[s.date]);
  // Cell Board servido desde el repo (hub/src/app/celula/_cell-board) — mismo
  // flujo que el Weekly PM. Si una fecha ya viene como fila de la base, gana
  // el archivo del repo.
  const localCB = localCellBoards(celula.slug);
  const localCBDates = new Set(localCB.map((u) => u.week_date));
  const updateEntries = [
    ...celula.updates
      .filter((u) => !localCBDates.has(u.week_date))
      .map((u) => ({ item: updateToItem(u), sortKey: u.week_date })),
    ...localCB.map((u) => ({ item: updateToItem(u), sortKey: u.week_date })),
    ...semanasCelula.map((s) => ({ item: weeklyToItem(s), sortKey: s.date.slice(0, 10) })),
  ].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const updates = updateEntries.map((e) => e.item);
  const updatesById = new Map<string, Update>([
    ...celula.updates.map((u) => [u.id, u] as const),
    ...localCB.map((u) => [u.id, u] as const),
  ]);

  const isSellers = params.slug === "sellers";
  // El grid de tarjetas, el filtro de etapa y "sin ficha Darwin" de logística
  // ya viven en /celula/logistica/proyectos (2026-08-17, Jaime) — acá los
  // proyectos de la célula ya no se filtran ni se anotan con datos del
  // tablero, solo se cuentan para el panel compacto de más abajo.
  const discoveryProjects = celula.proyectos.filter(
    (p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following",
  );
  const pruebasConcepto = celula.proyectos.filter((p) => p.type === "POC");
  const deliveryProjects = celula.proyectos.filter((p) => p.type === "Delivery Proyecto");
  const followings = celula.proyectos.filter((p) => p.type === "Following");
  if (isSellers) {
    return (
      <main style={{ minHeight: "100vh", padding: "0", background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", color: "#0f172a", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
        {/* Header Section */}
        <div style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
          <HubHeader
            title={celula.nombre}
            subtitle={celula.lead ? `Lead: ${celula.lead} · Control Tower PM OS` : "Control Tower de Célula · Darwin"}
            currentSlug={celula.slug}
          />
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px", width: "100%", flex: 1 }}>

          {!esCelulaPropia && profile?.is_super_admin && (
            <ModoLecturaBanner activo={modoEdicionForzado} onToggle={() => setModoEdicionForzado((v) => !v)} />
          )}

          {/* "Mi día" de Sellers (2026-08-17, Jaime): arriba lo de la célula
              — sus métricas globales reales (antes vivían acá mismo, luego
              se movieron a Updates, ahora vuelven a casa) — abajo lo
              personal, mismos paneles que el resto de células. */}
          <ObjetivoPanel
            slug={celula.slug}
            objetivo={{
              mision: celula.mision,
              vision: celula.vision,
              nsm: celula.nsm,
              foco_trimestre: celula.foco_trimestre,
              enlace_direccionamiento: celula.enlace_direccionamiento,
            }}
            editable={canCreate}
            onSaved={(next: Objetivo) => setCelula((prev) => (prev ? { ...prev, ...next } : prev))}
          />
          <SellersMetricsPanel />
          <MiDiaShell />

          {/* Weekly Célula Banner / Action Bar */}
          <WeeklyBanner />

          {/* Discovery projects list */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, margin: 0 }}>
                Discovery Projects
              </p>
              {canCreate && (
                <button
                  onClick={() => { setShowForm(true); setFormError(null); }}
                  style={{
                    fontSize: 12, fontWeight: 700, color: "#F77F00",
                    background: "#FFF7ED", border: "1px solid #FFEDD5", borderRadius: 8,
                    padding: "6px 12px", cursor: "pointer",
                  }}
                >
                  + Proyecto vacío
                </button>
              )}
            </div>

            {/* Custom light list wrapper */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={pocsByParent.get(p.id) ?? []}
                  deliveries={deliveriesByParent.get(p.id) ?? []}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                  onCrearDelivery={handleCrearDelivery}
                />
              ))}
            </div>
          </div>

          {/* Pruebas de concepto list */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 20 }}>
              Pruebas de concepto (POCs)
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type === "POC").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                />
              ))}
              {poc.length === 0 && (
                <p style={{ fontSize: 13, color: "#64748b" }}>Aún no hay POCs cargadas para esta célula.</p>
              )}
            </div>
          </div>

          {/* Delivery Proyectos list */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 20 }}>
              Delivery Proyectos
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type === "Delivery Proyecto").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  siblingPocs={p.parent_project_id ? pocsByParent.get(p.parent_project_id) ?? [] : []}
                  followings={followingsByDelivery.get(p.id) ?? []}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                  onRelatedPocChange={handleRelatedPocChange}
                  onCrearFollowing={handleCrearFollowing}
                />
              ))}
              {celula.proyectos.filter((p) => p.type === "Delivery Proyecto").length === 0 && (
                <p style={{ fontSize: 13, color: "#64748b" }}>Aún no hay Delivery Proyectos cargados para esta célula.</p>
              )}
            </div>
          </div>

          {/* Followings list */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 20 }}>
              Followings
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type === "Following").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                />
              ))}
              {celula.proyectos.filter((p) => p.type === "Following").length === 0 && (
                <p style={{ fontSize: 13, color: "#64748b" }}>Aún no hay Followings cargados para esta célula.</p>
              )}
            </div>
          </div>

        </div>

        <HubFooter />
        
        {openUpdate && (
          <div
            onClick={() => setOpenUpdate(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24, zIndex: 50, backdropFilter: "blur(4px)"
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, maxWidth: 640, width: "100%",
                maxHeight: "80vh", overflowY: "auto", padding: 0,
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)", color: "#0f172a"
              }}
            >
              <div
                style={{
                  position: "sticky", top: 0, background: "#ffffff", zIndex: 1,
                  display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
                  padding: "24px 28px 16px", borderBottom: "1px solid #e2e8f0",
                }}
              >
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, margin: "0 0 8px" }}>{openUpdate.title}</h2>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700,
                    color: "#6D28D9", background: "#F5F3FF", borderRadius: 999, padding: "3px 10px",
                  }}>
                    🗓️ {openUpdate.week_date}
                  </span>
                </div>
                <button
                  onClick={() => setOpenUpdate(null)}
                  style={{
                    flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                    background: "#f8fafc", border: "1px solid #e2e8f0",
                    fontSize: 16, color: "#64748b", cursor: "pointer", lineHeight: 1,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7, padding: "20px 28px 28px" }}>
                {(() => {
                  const palette = ["#7C3AED", "#2563EB", "#DB2777", "#F77F00", "#0D9488", "#16A34A", "#475569"];
                  let headingIdx = -1;
                  return openUpdate.content.split("\n").map((line, i) => {
                    const trimmed = line.trim();
                    if (trimmed === "---") return <div key={i} style={{ height: 1, background: "#e2e8f0", margin: "20px 0" }} />;
                    if (trimmed === "") return <div key={i} style={{ height: 6 }} />;
                    if (trimmed.startsWith("## ")) {
                      headingIdx += 1;
                      const color = palette[headingIdx % palette.length];
                      return (
                        <h3 key={i} style={{
                          display: "flex", alignItems: "center", gap: 8,
                          fontSize: 15, fontWeight: 800, margin: headingIdx === 0 ? "0 0 10px" : "24px 0 10px", color: "#0f172a",
                        }}>
                          <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                          {trimmed.slice(3)}
                        </h3>
                      );
                    }
                    if (trimmed.startsWith("- ")) {
                      return (
                        <div key={i} style={{ display: "flex", gap: 8, margin: "0 0 6px" }}>
                          <span aria-hidden style={{ color: "#64748b", flexShrink: 0 }}>•</span>
                          <span style={{ whiteSpace: "pre-wrap" }}>{trimmed.slice(2)}</span>
                        </div>
                      );
                    }
                    if (trimmed.endsWith(":") && trimmed.length > 1) {
                      return <p key={i} style={{ margin: "10px 0 4px", fontWeight: 700 }}>{trimmed}</p>;
                    }
                    return <p key={i} style={{ margin: "0 0 4px", whiteSpace: "pre-wrap" }}>{line}</p>;
                  });
                })()}
              </div>
            </div>
          </div>
        )}
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
      <HubHeader
        title={celula.nombre}
        subtitle={celula.lead ? `Lead: ${celula.lead}` : "Home de célula · Darwin"}
        currentSlug={celula.slug}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        {!esCelulaPropia && profile?.is_super_admin && (
          <ModoLecturaBanner activo={modoEdicionForzado} onToggle={() => setModoEdicionForzado((v) => !v)} />
        )}

        {/* Panel "Célula": misión / visión / NSM / foco del trimestre. Dato
            editable en `celulas` (059_darwin_celula_objetivos.sql) — lo llena
            el lead o super admin. Antes era estático (y logística tenía su
            texto hardcodeado, ahora migrado a la fila de la BD). Debajo, "Mi
            día" personal (mismos paneles de /app/proyectos/mi-dia). */}
        <ObjetivoPanel
          slug={celula.slug}
          objetivo={{
            mision: celula.mision,
            vision: celula.vision,
            nsm: celula.nsm,
            foco_trimestre: celula.foco_trimestre,
            enlace_direccionamiento: celula.enlace_direccionamiento,
          }}
          editable={canCreate}
          onSaved={(next: Objetivo) => setCelula((prev) => (prev ? { ...prev, ...next } : prev))}
        />

        <MiDiaShell />

        {/* Teaser compacto (2026-08-17, Jaime): el feed completo — incluidos
            los componentes propios de Logística/Backoffice y las métricas de
            Sellers — se movió a /celula/[slug]/updates, su propia parada en
            el sidebar. Acá solo se ve un adelanto con link a la página
            completa, mismo patrón que el panel de Proyectos de más abajo. */}
        <div style={{ marginBottom: 32 }}>
          <Section
            title="Updates"
            items={updates.slice(0, 2)}
            ctaLabel="Ver →"
            onItemClick={(item) => {
              const u = updatesById.get(item.key);
              if (u) setOpenUpdate(u);
            }}
          />
          {updates.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay updates registrados.</p>
          )}
          <div style={{ padding: updates.length > 0 ? "10px 20px 0" : 0 }}>
            <Link href={`/celula/${celula.slug}/updates`} className="midia-panel-link">
              Ver todos los updates
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>



        {/* Panel compacto de Proyectos (2026-08-17, Jaime) — reemplaza el grid
            de tarjetas para cualquier célula, incluida logística (su filtro
            de etapa y "sin ficha Darwin" ya viven en /celula/[slug]/proyectos,
            no hace falta duplicar el grid acá): conteo por fase + link a la
            tabla completa. La creación de POC/Delivery/Following por proyecto
            se hace desde la ficha de cada proyecto (/proyectos/[slug]). */}
        {(
          <div className="midia-panel" style={{ marginBottom: 32 }}>
            <div className="midia-panel-header">
              <div className="midia-panel-header-left">
                <span className="midia-panel-label">Proyectos</span>
              </div>
              {canCreate && (
                <button
                  type="button"
                  onClick={() => { setShowForm((v) => !v); setFormError(null); }}
                  className="midia-sync-btn"
                >
                  {showForm ? "Cancelar" : "+ Proyecto vacío"}
                </button>
              )}
            </div>

            {showForm && (
              <form
                onSubmit={handleCreate}
                style={{
                  margin: "0 20px 16px", padding: 16, borderRadius: 10,
                  border: "1px solid var(--border)", background: "var(--bg)",
                  display: "flex", flexDirection: "column", gap: 10,
                }}
              >
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>Nombre</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                    required
                    placeholder="Nombre del proyecto"
                    style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)" }}
                  />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>Resumen</label>
                  <textarea
                    value={form.summary}
                    onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                    required
                    rows={3}
                    placeholder="De qué se trata este proyecto"
                    style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", fontFamily: "inherit", resize: "vertical" }}
                  />
                </div>
                {formError && <p style={{ fontSize: 12, color: "#DC2626", margin: 0 }}>{formError}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  style={{
                    fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--dropi)",
                    border: "none", borderRadius: 8, padding: "10px 16px", cursor: submitting ? "default" : "pointer",
                    opacity: submitting ? 0.7 : 1, alignSelf: "flex-start",
                  }}
                >
                  {submitting ? "Creando…" : "Crear proyecto"}
                </button>
              </form>
            )}

            <div className="midia-row" style={{ gap: 24, flexWrap: "wrap" }}>
              {[
                { label: "Discovery", n: discoveryProjects.length },
                { label: "POC", n: pruebasConcepto.length },
                { label: "Delivery", n: deliveryProjects.length },
                { label: "Following", n: followings.length },
              ].map((s) => (
                <div key={s.label}>
                  <p style={{ fontSize: 20, fontWeight: 800, color: "var(--fg)", margin: 0, fontVariantNumeric: "tabular-nums" }}>{s.n}</p>
                  <p style={{ fontSize: 11, color: "var(--muted)", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ padding: "14px 20px" }}>
              <Link href={`/celula/${celula.slug}/proyectos`} className="midia-panel-link">
                Ver todos los proyectos
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        )}
      </div>
      </div>
      <HubFooter />
      {openUpdate && (
        <div
          onClick={() => setOpenUpdate(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(10,22,40,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card)", borderRadius: 16, maxWidth: 640, width: "100%",
              maxHeight: "80vh", overflowY: "auto", padding: 0,
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div
              style={{
                position: "sticky", top: 0, background: "var(--card)", zIndex: 1,
                display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16,
                padding: "24px 28px 16px", borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--fg)", lineHeight: 1.3, margin: "0 0 8px" }}>{openUpdate.title}</h2>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11.5, fontWeight: 700,
                  color: "#6D28D9", background: "#F5F3FF", borderRadius: 999, padding: "3px 10px",
                }}>
                  🗓️ {openUpdate.week_date}
                </span>
              </div>
              <button
                onClick={() => setOpenUpdate(null)}
                style={{
                  flexShrink: 0, width: 28, height: 28, borderRadius: "50%",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  fontSize: 16, color: "var(--muted)", cursor: "pointer", lineHeight: 1,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <div style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.7, padding: "20px 28px 28px" }}>
              {(() => {
                const palette = ["#7C3AED", "#2563EB", "#DB2777", "#F77F00", "#0D9488", "#16A34A", "#475569"];
                let headingIdx = -1;
                return openUpdate.content.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (trimmed === "---") return <div key={i} style={{ height: 1, background: "var(--border)", margin: "20px 0" }} />;
                  if (trimmed === "") return <div key={i} style={{ height: 6 }} />;
                  if (trimmed.startsWith("## ")) {
                    headingIdx += 1;
                    const color = palette[headingIdx % palette.length];
                    return (
                      <h3 key={i} style={{
                        display: "flex", alignItems: "center", gap: 8,
                        fontSize: 15, fontWeight: 800, margin: headingIdx === 0 ? "0 0 10px" : "24px 0 10px", color: "var(--fg)",
                      }}>
                        <span aria-hidden style={{ width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0 }} />
                        {trimmed.slice(3)}
                      </h3>
                    );
                  }
                  if (trimmed.startsWith("- ")) {
                    return (
                      <div key={i} style={{ display: "flex", gap: 8, margin: "0 0 6px" }}>
                        <span aria-hidden style={{ color: "var(--muted)", flexShrink: 0 }}>•</span>
                        <span style={{ whiteSpace: "pre-wrap" }}>{trimmed.slice(2)}</span>
                      </div>
                    );
                  }
                  if (trimmed.endsWith(":") && trimmed.length > 1) {
                    return <p key={i} style={{ margin: "10px 0 4px", fontWeight: 700 }}>{trimmed}</p>;
                  }
                  return <p key={i} style={{ margin: "0 0 4px", whiteSpace: "pre-wrap" }}>{line}</p>;
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
