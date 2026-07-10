"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import HubFooter from "@/components/HubFooter";
import { type Item, Section, matchesQuery } from "@/components/HomeSections";

const TEAM_NAMES: Record<string, string> = {
  "jaime.guevara@dropi.co": "Jaime",
  "michelle.lopez@dropi.co": "Michelle",
};

function greetingFor(email: string | null): string {
  if (!email) return "Hola";
  const name = TEAM_NAMES[email.toLowerCase()];
  return name ? `Hola, ${name}` : "Hola";
}

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
];

const projects: Item[] = [
  {
    key: "celula",
    name: "Célula",
    description: "Presentaciones semanales del cellboard con el equipo — registro histórico por semana, con demo en vivo y decisiones a cerrar por tema.",
    url: "/proyectos/celula",
    tag: "Supplier Success · Semanal",
    color: "#0891B2",
    icon: "🧬",
  },
  {
    key: "dinamicas-catalogo",
    name: "Dinámicas de Catálogo",
    description: "Experimento lean de catálogo preseleccionado. Validación manual de campañas con suppliers antes de desarrollar el módulo formal.",
    url: "/proyectos/dinamicas-catalogo",
    tag: "DCA-001 · Experimento",
    color: "#0EA5E9",
    icon: "🗂️",
  },
  {
    key: "time-to-value",
    name: "Time to Value",
    description: "Activación operativa de suppliers nuevos. Meta: 620 listos para vender en 6 meses. North Star: registro → listo en ≤ 5 días.",
    url: "/proyectos/time-to-value",
    tag: "TTV-001 · Activación",
    color: "#F77F00",
    icon: "⚡",
  },
  {
    key: "categorizacion",
    name: "Categorización y Enriquecimiento",
    description: "Estrategia de taxonomía y enriquecimiento inteligente de catálogo. Consolidación de categorías fragmentadas y piloto de IA.",
    url: "/proyectos/categorizacion",
    tag: "CAT-001 · Habilitador",
    color: "#7C3AED",
    icon: "🏷️",
  },
  {
    key: "indicadores",
    name: "Indicadores · Postulaciones",
    description: "Cuántos suppliers ven su tablero de desempeño y cuántos se postulan para avanzar de nivel. Distribución por tipo de proveedor.",
    url: "/proyectos/indicadores",
    tag: "IND-001 · Métricas",
    color: "#6366F1",
    icon: "📈",
  },
  {
    key: "negociaciones",
    name: "Negociaciones · Proveedor–Líder Comunidad",
    description: "Bitácora de seguimiento semanal de ambos roles: adopción, engagement, funnels de creación/respuesta, retención y hallazgos cualitativos.",
    url: "/proyectos/negociaciones",
    tag: "NEG-001 · Live",
    color: "#0D9488",
    icon: "🤝",
  },
  {
    key: "negociaciones-dropshipper",
    name: "Negociaciones · Proveedor–Dropshipper",
    description: "Guía de flujo paso a paso para crear una negociación directa con un dropshipper. Screenshots del Figma con descripciones listas para hand-off.",
    url: "/proyectos/negociaciones-dropshipper",
    tag: "NEG-002 · Wireframes",
    color: "#F77F00",
    icon: "🤝",
  },
  {
    key: "caza-productos",
    name: "Caza Productos",
    description: "Solicitudes de productos que los dropshippers no encuentran en catálogo. Señal de demanda explícita y tasa de atención de suppliers.",
    url: "/proyectos/caza-productos",
    tag: "CAZ-001 · Demanda",
    color: "#EC4899",
    icon: "🔍",
  },
  {
    key: "combos",
    name: "Combos Dropshipper",
    description: "Guía de flujo paso a paso para crear y editar combos. Screenshots del Figma con descripciones listas para handoff.",
    url: "/proyectos/combos",
    tag: "PROD-545 · Hand-off",
    color: "#F77F00",
    icon: "📦",
  },
  {
    key: "descuentos-catalogo",
    name: "Descuentos en Catálogo",
    description: "Precio antes / precio ahora visible para el dropshipper en toda campaña activa. Trigger: Cyber Days agosto 2026. Ecosistema completo: Dropi, Shopify, WooCommerce, Tienda Nube, CAS, ECOM Scanner.",
    url: "/proyectos/descuentos",
    tag: "DESC-001 · Campañas",
    color: "#F59E0B",
    icon: "🏷️",
  },
];

const poc: Item[] = [
  {
    key: "pulso-demo",
    name: "Dropi Pulso · Demo",
    description: "Prototipo interactivo del motor de matching de catálogo. Notificaciones reales por WhatsApp y email, registro por QR, dashboard en vivo y kit de campaña.",
    url: "/proyectos/pulso-demo",
    tag: "Demo · Stakeholders",
    color: "#F77F00",
    icon: "⚡",
  },
  {
    key: "gali-demo",
    name: "Gali - Demo",
    description: "Propuesta de valor y copiloto para selección de productos ganadores (v5). Chat interactivo con mentores de comunidad, grilla con 1M de productos y generador de creativos.",
    url: "/proyectos/gali-demo",
    tag: "Demo · Caza Productos v5",
    color: "#FF6102",
    icon: "🦊",
  },
  {
    key: "dropi-activa",
    name: "Dropi Activa · ACT-001",
    description: "POC de activación de suppliers por matching de demanda. Reduce tiempo a primera negociación de 60+ días a 7. El sistema conecta proactivamente al supplier con dropshippers que ya lo están buscando.",
    url: "/proyectos/dropi-activa",
    tag: "ACT-001 · Activación",
    color: "#7C3AED",
    icon: "🚀",
  },
];

function HeaderLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="hub-link"
      style={{
        fontSize: 12, fontWeight: 700,
        color: "var(--fg)",
        borderRadius: 8,
        padding: "6px 14px",
        textDecoration: "none",
        display: "flex", alignItems: "center", gap: 6,
      }}
    >
      {children}
    </a>
  );
}

type CelulaLink = { nombre: string; slug: string };

export default function HubPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [canSwitchCelulas, setCanSwitchCelulas] = useState(false);
  const [otrasCelulas, setOtrasCelulas] = useState<CelulaLink[]>([]);
  const [checkingRole, setCheckingRole] = useState(true);
  const [celulaMenuOpen, setCelulaMenuOpen] = useState(false);
  const router = useRouter();

  const hasSupabase = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    if (!hasSupabase) return;
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, [hasSupabase]);

  // Este home es el de Suppliers (tu célula). Si quien entra es de otra
  // célula, lo mandamos a la home de su propia célula. Solo el super admin
  // se queda aquí y ve el resto de células como navegación.
  useEffect(() => {
    if (!hasSupabase) { setCheckingRole(false); return; }
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        const profile = data?.profile;
        if (!profile) { setCheckingRole(false); return; }

        const mySlug = profile.celulas?.slug;
        const fullAccess = profile.is_super_admin || !!profile.celulas?.ve_hub_completo;

        // Con ve_hub_completo (o super admin), "/" es el origen: aterriza
        // siempre aquí y navega libre entre células con el dropdown. Sin
        // ve_hub_completo, queda restringido a su propia home.
        if (mySlug && mySlug !== "suppliers" && !fullAccess) {
          router.replace(`/celula/${mySlug}`);
          return;
        }

        setCheckingRole(false);
        if (fullAccess) {
          setCanSwitchCelulas(true);
          fetch("/api/celulas")
            .then((res) => res.json())
            .then((celulas) => {
              if (Array.isArray(celulas)) {
                setOtrasCelulas(celulas.map((c) => ({ nombre: c.nombre, slug: c.slug })));
              }
            });
        }
      });
  }, [hasSupabase, router]);

  async function handleLogout() {
    if (!hasSupabase) return;
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  if (checkingRole) {
    return <main style={{ minHeight: "100vh" }} />;
  }

  const filteredUpdates = updates.filter((item) => matchesQuery(item, query));
  const filteredProjects = projects.filter((item) => matchesQuery(item, query));
  const filteredPoc = poc.filter((item) => matchesQuery(item, query));
  const hasResults = filteredUpdates.length + filteredProjects.length + filteredPoc.length > 0;

  return (
    <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", position: "relative" }}>
          <img
            src="/darwin-logo.png"
            alt="Darwin"
            width={36}
            height={36}
            style={{ display: "block", borderRadius: 8 }}
          />
          {canSwitchCelulas ? (
            <div style={{ position: "relative" }}>
              <button
                onClick={() => setCelulaMenuOpen((v) => !v)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left",
                }}
              >
                <div>
                  <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2, display: "flex", alignItems: "center", gap: 6 }}>
                    Darwin <span style={{ fontSize: 11, color: "var(--muted)" }}>▾</span>
                  </h1>
                  <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                    Supplier Success · Herramientas internas
                  </p>
                </div>
              </button>
              {celulaMenuOpen && (
                <div style={{
                  position: "absolute", top: "100%", left: 0, marginTop: 8,
                  background: "#fff", border: "1px solid var(--border)", borderRadius: 10,
                  boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: 200, zIndex: 10, overflow: "hidden",
                }}>
                  {otrasCelulas.map((c) => (
                    <a
                      key={c.slug}
                      href={c.slug === "suppliers" ? "/" : `/celula/${c.slug}`}
                      onClick={() => setCelulaMenuOpen(false)}
                      style={{
                        display: "block", padding: "10px 14px", fontSize: 13,
                        color: "var(--fg)", textDecoration: "none",
                        background: c.slug === "suppliers" ? "var(--bg)" : "transparent",
                        fontWeight: c.slug === "suppliers" ? 700 : 500,
                      }}
                    >
                      🏠 {c.nombre}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                Darwin
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Supplier Success · Herramientas internas
              </p>
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <HeaderLink href="/iniciativas">📥 Iniciativas</HeaderLink>
          <HeaderLink href="/data-solicitada">📊 Data solicitada</HeaderLink>
          <HeaderLink href="/metricas">📈 Métricas</HeaderLink>
          <HeaderLink href="/celulas">🧬 Células</HeaderLink>
          <HeaderLink href="/pruebas-usuarios">🧪 Pruebas con Usuarios</HeaderLink>
          {userEmail && (
            <>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{greetingFor(userEmail)}</span>
              <button
                onClick={handleLogout}
                className="hub-link"
                style={{
                  fontSize: 12, fontWeight: 600,
                  color: "var(--muted)",
                  borderRadius: 8,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                Salir
              </button>
            </>
          )}
        </div>
      </header>

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

        <Section title="Proyectos" items={filteredProjects} ctaLabel="Ver proyecto →" />

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
