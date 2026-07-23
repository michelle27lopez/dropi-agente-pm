"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HubFooter from "@/components/HubFooter";
import HubHeader from "@/components/HubHeader";
import { type Item, Section, matchesQuery } from "@/components/HomeSections";
import { isSprintAllowed } from "@/lib/sprint-access";

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

type Proyecto = {
  id: string; name: string; project_code: string | null;
  handoff_status: string | null; type: string | null; summary: string | null;
};

// Home curado de Suppliers: solo estos 13 proyectos reales de la tabla
// `projects` se muestran aquí (10 Discovery projects + 3 POC), aunque la
// célula tenga más filas en la base — el resto vive en /celula/suppliers.
// color/icon no existen en la tabla, así que se mantienen aquí por código.
const PROJECT_STYLE: Record<string, { url: string; color: string; icon: string }> = {
  "CELL-001": { url: "/proyectos/celula", color: "#0891B2", icon: "🧬" },
  "DCA-001": { url: "/proyectos/dinamicas-catalogo", color: "#0EA5E9", icon: "🗂️" },
  "TTV-001": { url: "/proyectos/time-to-value", color: "#F77F00", icon: "⚡" },
  "CAT-001": { url: "/proyectos/categorizacion", color: "#7C3AED", icon: "🏷️" },
  "IND-001": { url: "/proyectos/indicadores", color: "#6366F1", icon: "📈" },
  "NEG-001": { url: "/proyectos/negociaciones", color: "#0D9488", icon: "🤝" },
  "NEG-002": { url: "/proyectos/negociaciones-dropshipper", color: "#F77F00", icon: "🤝" },
  "CAZ-001": { url: "/proyectos/caza-productos", color: "#EC4899", icon: "🔍" },
  "COM-002": { url: "/proyectos/combos", color: "#F77F00", icon: "📦" },
  "DESC-001": { url: "/proyectos/descuentos", color: "#F59E0B", icon: "🏷️" },
  "PULSO-001": { url: "/proyectos/pulso-demo", color: "#F77F00", icon: "⚡" },
  "GALI-001": { url: "/proyectos/gali-demo", color: "#FF6102", icon: "🦊" },
  "ACT-001": { url: "/proyectos/dropi-activa", color: "#7C3AED", icon: "🚀" },
};

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

function proyectoToItem(p: Proyecto): Item | null {
  const style = p.project_code ? PROJECT_STYLE[p.project_code] : undefined;
  if (!style) return null;
  return {
    key: p.id,
    name: p.name,
    description: truncate(p.summary ?? "Sin descripción aún.", 160),
    url: style.url,
    tag: p.project_code ?? p.handoff_status ?? "Sin código",
    color: style.color,
    icon: style.icon,
  };
}

export default function HubPage() {
  const [query, setQuery] = useState("");
  const [checkingRole, setCheckingRole] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
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
      })
      .catch(() => {});
  }, [hasSupabase, router, userEmail]);

  if (checkingRole) {
    return <main style={{ minHeight: "100vh" }} />;
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

  const projects = proyectosReales
    .filter((p) => p.type !== "POC")
    .map(proyectoToItem)
    .filter((item): item is Item => item !== null);
  const poc = proyectosReales
    .filter((p) => p.type === "POC")
    .map(proyectoToItem)
    .filter((item): item is Item => item !== null);

  const filteredUpdates = visibleUpdates.filter((item) => matchesQuery(item, query));
  const filteredProjects = projects.filter((item) => matchesQuery(item, query));
  const filteredPoc = poc.filter((item) => matchesQuery(item, query));
  const hasResults = filteredUpdates.length + filteredProjects.length + filteredPoc.length > 0;

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

        <div style={{ marginBottom: filteredUpdates.length ? 56 : 0 }}>
          <Section title="Updates" items={filteredUpdates} ctaLabel="Ver →" />
        </div>

        <Section title="Discovery projects" items={filteredProjects} ctaLabel="Ver proyecto →" />

        <div style={{ marginTop: filteredPoc.length ? 56 : 0 }}>
          <Section title="Pruebas de concepto" items={filteredPoc} ctaLabel="Ver proyecto →" />
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
