import HubFooter from "@/components/HubFooter";
import Breadcrumb from "@/components/Breadcrumb";

const guias = [
  {
    slug: "entendimiento-360-ecosistema",
    icon: "🧭",
    title: "Entendimiento 360 del ecosistema",
    description: "Qué sabemos hoy de arquetipos/user personas y journeys de experiencia y servicio, célula por célula — por usuario y por proceso.",
    tag: "Service design · Proyecto PRO-001",
  },
  {
    slug: "conceptos-basicos",
    icon: "🧭",
    title: "Conceptos básicos",
    description: "Qué es una rama de git y cómo se usan bien, cómo están organizadas las carpetas del repo, cómo arrancar en un proyecto y qué es Antigravity.",
    tag: "Onboarding · Fundamentos",
  },
  {
    slug: "como-unirte-a-darwin",
    icon: "🧬",
    title: "Cómo unirte a Darwin",
    description: "Clonar el repo, configurar tu .env.local, correr el hub en local, entrar a tu home de célula y abrir tu primer PR.",
    tag: "Onboarding · Nueva célula",
  },
  {
    slug: "skills-disponibles",
    icon: "🧩",
    title: "Directorio de Skills",
    description: "Qué skills hay disponibles, agrupadas por categoría, y cuándo usar cada una en el trabajo de un PD.",
    tag: "Referencia · Skills",
  },
  {
    slug: "nomenclatura-fases",
    icon: "🧭",
    title: "Nomenclatura de fases de proyecto",
    description: "Cómo se nombran proyectos, fases (Epic) y subfases (tarea) en Jira. Borrador para revisar con Laura Contreras.",
    tag: "Referencia · Nomenclatura",
  },
  {
    slug: "product-lab",
    icon: "🧪",
    title: "Product Lab",
    description: "Índice de sesiones de Product Lab 2.0 — fecha, facilitador y punteros al detalle completo en el Dropi Brain (Confluence).",
    tag: "Referencia · Product Lab",
  },
  {
    slug: "userpilot-mcp",
    icon: "🔌",
    title: "Documentar tu vertical con UserPilot + Claude Code",
    description: "Cómo conectar UserPilot vía MCP con la cuenta compartida del equipo y el prompt para replicar la doc de /proveedores en tu propio vertical.",
    tag: "Onboarding · Nuevo vertical",
  },
  {
    slug: "metricas",
    icon: "📊",
    title: "Métricas",
    description: "Métricas clave del ecosistema, activación (TTFO/TTV), retención/churn mensual y clasificación de madurez operativa — con cifras y metas de referencia.",
    tag: "Referencia · Métricas",
  },
  {
    slug: "entendimiento-negocio",
    icon: "🧠",
    title: "Entendimiento del Negocio",
    description: "Roles (Supplier vs. Marca/Emprendedor), comportamiento algorítmico, las dos lentes de análisis y el modelo de Funnel, Palancas y Loops del ecosistema Dropi.",
    tag: "Referencia · Negocio",
  },
];

export default function GuiasIndexPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <Breadcrumb items={[{ label: "Guías" }]} />
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              📚 Guías
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Cómo se hacen las cosas en Darwin, paso a paso.
            </p>
          </div>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {guias.map((g) => (
              <a
                key={g.slug}
                href={`/guias/${g.slug}`}
                className="hub-card"
                style={{
                  display: "flex", alignItems: "flex-start", gap: 16,
                  background: "var(--card)", border: "1px solid var(--border)",
                  borderRadius: 14, padding: 20, textDecoration: "none",
                }}
              >
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flex: "none",
                  background: "var(--bg)", border: "1px solid var(--border)",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>
                  {g.icon}
                </div>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "var(--dropi)",
                    background: "var(--dropi-light)", padding: "3px 8px", borderRadius: 999,
                  }}>
                    {g.tag}
                  </span>
                  <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginTop: 8, marginBottom: 4 }}>
                    {g.title}
                  </h2>
                  <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    {g.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
