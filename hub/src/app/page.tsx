"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HubFooter from "@/components/HubFooter";
import HubHeader from "@/components/HubHeader";
import { type Item, Section, matchesQuery } from "@/components/HomeSections";
import { isSprintAllowed, isMiDiaOwner } from "@/lib/sprint-access";
import { PROJECT_STYLE } from "@/lib/curated-projects";
import MiDiaShell from "@/app/proyectos/mi-dia/MiDiaShell";
import { ProjectCard, type Proyecto } from "@/components/ProjectCard";
import { TTV_FASE_1, TTV_FASE_2 } from "@/lib/ttv-fases-data";
import { CATALOGO_METAS } from "@/lib/catalogo-metas-data";

const updates: Item[] = [
  {
    key: "roadmap-s2-2026",
    name: "Roadmap S2 2026",
    description: "Proyección Jul–Dic: cola de desarrollo (NEG → COM-002 → DESC-001 → DCA Campañas), frentes paralelos, KRs y KPIs por trimestre.",
    url: "/roadmap-s2-2026",
    tag: "S2 2026 · Jul→Dic",
    color: "#1A6B52",
    icon: "🗺️",
  },
  {
    key: "weekly-pm",
    name: "Weekly · PM",
    description: "Update ejecutivo semanal: oportunidades aprobadas, hipótesis numéricas y accionables clasificados por ruta.",
    url: "/weekly",
    tag: "Weekly · Jun 2026",
    color: "#F77F00",
    icon: "📋",
  },
  {
    key: "weekly-celula",
    name: "Weekly · Célula",
    description: "Updates semanales de la célula Supplier Success para el jefe. Registro histórico por semana.",
    url: "/updates-celula",
    tag: "Célula · Supplier Success",
    color: "#6366F1",
    icon: "🏠",
  },
  {
    key: "informe-1-1-junio",
    name: "Informe 1:1 · Junio 2026",
    description: "Auto-observación cuantitativa del mes: cruce de calendario y Jira, fricciones, mapa de iniciativas y simulador de rituales para el 1:1 con Laura.",
    url: "/informes/1-1-junio-2026",
    tag: "Personal · 1:1",
    color: "#7C3AED",
    icon: "🗞️",
  },
  {
    key: "bugs-tracking",
    name: "Seguimiento de Bugs",
    description: "HUs de bug publicadas en Jira (PROD) con asignado, épica y estado — para que todo el equipo le haga seguimiento sin entrar a Jira.",
    url: "/bugs",
    tag: "Jira · PROD",
    color: "#EF4444",
    icon: "🐞",
  },
];

function matchesProyectoQuery(p: Proyecto, q: string) {
  const query = q.trim().toLowerCase();
  if (!query) return true;
  return (
    p.name.toLowerCase().includes(query) ||
    (p.summary ?? "").toLowerCase().includes(query) ||
    (p.project_code ?? "").toLowerCase().includes(query)
  );
}

export default function HubPage() {
  const [query, setQuery] = useState("");
  const [checkingRole, setCheckingRole] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [profile, setProfile] = useState<{ is_super_admin: boolean; celula_id: string | null } | null>(null);
  const [celulaId, setCelulaId] = useState<string | null>(null);
  const [proyectosReales, setProyectosReales] = useState<Proyecto[]>([]);
  const router = useRouter();

  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Este home es el de Suppliers (tu célula). Recién logueado, cada quien
  // aterriza en la home de su propia célula (o /resumen si es stakeholder) —
  // sin importar ve_hub_completo NI is_super_admin, ambos flags controlan
  // permisos, no dónde aterriza. Pero ese rebote solo debe pasar UNA VEZ por
  // sesión: si alguien ya está navegando y vuelve a "/" a propósito (ej. el
  // switcher del header, que para Suppliers apunta aquí), no lo mandamos de
  // vuelta a su célula — si no, nadie podría ver este home salvo Jaime.
  useEffect(() => {
    if (!hasSupabase) { setCheckingRole(false); return; }
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        const profile = data?.profile;
        setUserEmail(data?.user?.email ?? profile?.email ?? null);
        if (!profile) { setCheckingRole(false); return; }
        setProfile({ is_super_admin: !!profile.is_super_admin, celula_id: profile.celula_id ?? null });

        const yaRedirigido = sessionStorage.getItem("darwin-home-routed") === "1";
        sessionStorage.setItem("darwin-home-routed", "1");
        if (yaRedirigido) { setCheckingRole(false); return; }

        const mySlug = profile.celulas?.slug;

        // Stakeholder (Lucho, María): no pertenece a ninguna célula — su
        // origen es el resumen ejecutivo cross-célula, no "/" ni /celula/x.
        if (profile.is_stakeholder && !profile.is_super_admin) {
          router.replace("/resumen");
          return;
        }

        if (mySlug && mySlug !== "suppliers") {
          router.replace(`/celula/${mySlug}`);
          return;
        }

        setCheckingRole(false);
      });

    fetch("/api/celulas/suppliers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data?.proyectos)) setProyectosReales(data.proyectos);
        if (data?.id) setCelulaId(data.id);
      })
      .catch(() => {});
  }, [hasSupabase, router, userEmail]);

  if (checkingRole) {
    return <main style={{ minHeight: "100vh" }} />;
  }

  const canCreate = !!profile && (profile.is_super_admin || profile.celula_id === celulaId);

  // Aunque este home muestre solo la lista curada de PROJECT_STYLE, los
  // badges de POC hijos se calculan sobre TODOS los proyectos reales — así
  // un POC nuevo se ve como acceso directo desde su padre aunque su propio
  // código no esté (todavía) en la curaduría.
  const pocsByParent = new Map<string, Proyecto[]>();
  const deliveriesByParent = new Map<string, Proyecto[]>();
  for (const p of proyectosReales) {
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
  }

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

  async function handleVpvChange(id: string, vpv: number | null) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vpv }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProyectosReales((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  async function handleCrearPoc(parent: Proyecto, name: string, summary: string) {
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary }),
    });
    if (!res.ok) return;
    const created = await res.json();
    setProyectosReales((prev) => [...prev, created]);
  }

  async function handleCrearDelivery(parent: Proyecto, name: string, summary: string, relatedPocId: string | null) {
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary, type: "Delivery Proyecto", related_poc_id: relatedPocId }),
    });
    if (!res.ok) return;
    const created = await res.json();
    setProyectosReales((prev) => [...prev, created]);
  }

  async function handleRelatedPocChange(id: string, relatedPocId: string | null) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ related_poc_id: relatedPocId }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setProyectosReales((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  // Home privada: este es el home real de Michelle (célula "suppliers" cae
  // aquí, no en celula/[slug]) — reemplaza el grid estándar por el
  // dashboard de "mi día". Ver [[project_darwin_pd_dashboard]].
  if (isMiDiaOwner(userEmail)) {
    return (
      <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <HubHeader title="Darwin" subtitle="Tu día · Darwin" currentSlug="suppliers" />
          <MiDiaShell />
        </div>
        <HubFooter />
      </main>
    );
  }

  // /sprint solo es visible para Michelle y Jaime (alcance confirmado
  // 2026-07-15) — no se agrega al array estático `updates` porque ese
  // mismo home lo ven otras personas de la célula Suppliers.
  const visibleUpdates = isSprintAllowed(userEmail)
    ? [...updates, {
        key: "sprint-checklist",
        name: "Sprint · Checklist",
        description: "Checklist de documentación por tarea del sprint activo — objetivo, qué se hizo, hallazgos y links, con estado por bloque.",
        url: "/sprint",
        tag: "Solo tú y Jaime",
        color: "#1A6B52",
        icon: "🗓️",
      }]
    : updates;

  const filteredUpdates = visibleUpdates.filter((item) => matchesQuery(item, query));

  // Lista curada (PROJECT_STYLE) pero ya con los datos reales de `projects`
  // — así el select de estado y el VPV quedan conectados a la base.
  const curatedProjects = proyectosReales.filter((p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.project_code && PROJECT_STYLE[p.project_code]);
  const curatedPoc = proyectosReales.filter((p) => p.type === "POC" && p.project_code && PROJECT_STYLE[p.project_code]);
  const curatedDelivery = proyectosReales.filter((p) => p.type === "Delivery Proyecto");
  const filteredCuratedProjects = curatedProjects.filter((p) => matchesProyectoQuery(p, query));
  const filteredCuratedPoc = curatedPoc.filter((p) => matchesProyectoQuery(p, query));
  const filteredCuratedDelivery = curatedDelivery.filter((p) => matchesProyectoQuery(p, query));
  const hasResults = filteredUpdates.length + filteredCuratedProjects.length + filteredCuratedPoc.length + filteredCuratedDelivery.length > 0;

  return (
    <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
      <HubHeader
        title="Darwin"
        subtitle="Supplier Success · Herramientas internas"
        currentSlug="suppliers"
      />

      {/* Grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ position: "relative", marginBottom: 40 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--muted)", fontSize: 14 }}>
            🔍
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar proyectos, updates o pruebas de concepto…"
            className="hub-search"
            style={{
              width: "100%",
              fontSize: 13,
              color: "var(--fg)",
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
              padding: "10px 12px 10px 38px",
              fontFamily: "inherit",
            }}
          />
        </div>

        {!hasResults && (
          <p style={{ fontSize: 13, color: "var(--muted)", padding: "24px 0", textAlign: "center" }}>
            Sin resultados para “{query}”.
          </p>
        )}

        {/* Activación TTV + Metas de Catálogo */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 56 }}>
          {/* TTV — Activación */}
          <a href="/proyectos/time-to-value/asis" style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
              padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", height: "100%",
              transition: "box-shadow 0.15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>
                  ⚡ TTV-001 · Activación
                </p>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", padding: "3px 9px", borderRadius: 20 }}>
                  Ver diagnóstico →
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 16 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Fase 1 · Baseline</div>
                  <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>
                    {TTV_FASE_1.tasaActivacion}
                  </div>
                </div>
                <div style={{ fontSize: 20, color: "var(--muted)" }}>→</div>
                <div>
                  <div style={{ fontSize: 11, color: "#059669", marginBottom: 4 }}>Fase 2 · Pipeline (neta)</div>
                  <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "#10B981" }}>
                    {TTV_FASE_2.activacionNeta}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>⏱️ Registro → orden entregada (prom., desde 30-jun-2026)</div>
                <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>
                  {TTV_FASE_2.tiempoRegistroEntrega}
                </div>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 14, lineHeight: 1.5 }}>
                Activación neta ya supera el baseline. La brecha sigue entre generar la orden ({TTV_FASE_2.activacionBruta})
                y entregarla — punto exacto detrás del pivote a agente de WA.
              </div>
            </div>
          </a>

          {/* Catálogo — Metas */}
          <a href={CATALOGO_METAS.detalleUrl} style={{ textDecoration: "none", color: "inherit" }}>
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
              padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", height: "100%",
              transition: "box-shadow 0.15s",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>
                  🗂️ DCA-001 · Metas de Catálogo
                </p>
                <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", padding: "3px 9px", borderRadius: 20 }}>
                  Ver detalle →
                </span>
              </div>
              <div style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Meta de órdenes/mes</div>
                <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>
                  {CATALOGO_METAS.metaOrdenesMes}
                </div>
              </div>
              <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>% catálogo con orden</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{CATALOGO_METAS.pctConOrden}</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Productividad (actual → meta)</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>
                    {CATALOGO_METAS.productividadActual} → {CATALOGO_METAS.productividadMeta}
                  </div>
                </div>
              </div>
              <div style={{ fontSize: 11, color: "var(--faint, #9CA3AF)", marginTop: 12, fontStyle: "italic" }}>
                Prototipo de escenarios — no es data en vivo.
              </div>
            </div>
          </a>
        </div>

        <div style={{ marginBottom: filteredUpdates.length ? 56 : 0 }}>
          <Section title="Updates" items={filteredUpdates} ctaLabel="Ver →" />
        </div>

        <div>
          <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 20 }}>
            Discovery projects
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filteredCuratedProjects.map((p) => {
              const style = p.project_code ? PROJECT_STYLE[p.project_code] : undefined;
              return (
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
                  urlOverride={style?.url}
                  colorOverride={style?.color}
                  iconOverride={style?.icon}
                />
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: filteredCuratedPoc.length ? 56 : 0 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 20 }}>
            Pruebas de concepto
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filteredCuratedPoc.map((p) => {
              const style = p.project_code ? PROJECT_STYLE[p.project_code] : undefined;
              return (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                  urlOverride={style?.url}
                  colorOverride={style?.color}
                  iconOverride={style?.icon}
                />
              );
            })}
          </div>
        </div>

        <div style={{ marginTop: filteredCuratedDelivery.length ? 56 : 0 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 20 }}>
            Delivery Proyectos
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
            {filteredCuratedDelivery.map((p) => {
              const style = p.project_code ? PROJECT_STYLE[p.project_code] : undefined;
              return (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  siblingPocs={p.parent_project_id ? pocsByParent.get(p.parent_project_id) ?? [] : []}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                  onRelatedPocChange={handleRelatedPocChange}
                  urlOverride={style?.url}
                  colorOverride={style?.color}
                  iconOverride={style?.icon}
                />
              );
            })}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 48, textAlign: "center" }}>
          Dropi · Supplier Success · {new Date().getFullYear()}
        </p>
      </div>
      </div>
      <HubFooter />
    </main>
  );
}
