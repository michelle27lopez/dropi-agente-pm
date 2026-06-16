"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const tools = [
  {
    key: "metrics",
    name: "Metrics Lab",
    description: "Dashboard CRM en vivo. Pipelines de verificación, ascensos y embudo del proveedor.",
    url: "/metrics",
    color: "#F77F00",
    tag: "CRM · Analytics",
    icon: "📊",
  },
  {
    key: "supplier",
    name: "Supplier Lab",
    description: "Clon de app.dropi.co para proveedores. Laboratorio de experimentos de UX.",
    url: process.env.NEXT_PUBLIC_SUPPLIER_URL ?? "#",
    color: "#10B981",
    tag: "UX · Experimentos",
    icon: "🏭",
  },
  {
    key: "dropshipper",
    name: "Dropshipper Lab",
    description: "Clon de app.dropi.co para dropshippers. Canvas de flujos y variantes.",
    url: process.env.NEXT_PUBLIC_DROPSHIPPER_URL ?? "#",
    color: "#6366F1",
    tag: "UX · Flujos",
    icon: "🛒",
  },
  {
    key: "research",
    name: "Research Brain",
    description: "Base de conocimiento de product research. Estudios, hallazgos y perfiles.",
    url: process.env.NEXT_PUBLIC_RESEARCH_URL ?? "#",
    color: "#EC4899",
    tag: "Research · Knowledge",
    icon: "🧠",
  },
];

const projects = [
  {
    key: "weekly",
    name: "Weekly · Supplier Success",
    description: "Update ejecutivo semanal: oportunidades aprobadas, hipótesis numéricas y accionables de Comercial clasificados por ruta.",
    url: "/weekly",
    color: "#F77F00",
    tag: "Weekly · Jun 2026",
    icon: "📋",
  },
  {
    key: "dinamicas-catalogo",
    name: "Dinámicas de Catálogo",
    description: "Experimento lean de catálogo preseleccionado. Validación manual de campañas con suppliers antes de desarrollar el módulo formal.",
    url: "/proyectos/dinamicas-catalogo",
    color: "#0EA5E9",
    tag: "DCA-001 · Experimento",
    icon: "🗂️",
  },
  {
    key: "time-to-value",
    name: "Time to Value",
    description: "Activación operativa de suppliers nuevos. Meta: 620 listos para vender en 6 meses. North Star: registro → listo en ≤ 5 días.",
    url: "/proyectos/time-to-value",
    color: "#F77F00",
    tag: "TTV-001 · Activación",
    icon: "⚡",
  },
  {
    key: "categorizacion",
    name: "Categorización y Enriquecimiento",
    description: "Estrategia de taxonomía y enriquecimiento inteligente de catálogo. Consolidación de categorías fragmentadas y piloto de IA.",
    url: "/proyectos/categorizacion",
    color: "#7C3AED",
    tag: "CAT-001 · Habilitador",
    icon: "🏷️",
  },
];

export default function HubPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
    });
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <main style={{ minHeight: "100vh", padding: "0" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "var(--dropi)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
          }}>
            🧩
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              Dropi PM Tools
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              Supplier Success · Herramientas internas
            </p>
          </div>
        </div>

        {userEmail && (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 13, color: "var(--muted)" }}>{userEmail}</span>
            <button
              onClick={handleLogout}
              style={{
                fontSize: 12, fontWeight: 600,
                color: "var(--muted)",
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "6px 12px",
                cursor: "pointer",
              }}
            >
              Salir
            </button>
          </div>
        )}
      </header>

      {/* Grid */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          Proyectos activos
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
        }}>
          {tools.map((tool) => (
            <a
              key={tool.key}
              href={tool.url}
              target={tool.url.startsWith("/") ? undefined : "_blank"}
              rel={tool.url.startsWith("/") ? undefined : "noopener noreferrer"}
              style={{
                background: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: 14,
                padding: "24px",
                textDecoration: "none",
                display: "block",
                transition: "box-shadow 0.15s, transform 0.15s",
                cursor: tool.url === "#" ? "default" : "pointer",
              }}
              onMouseEnter={(e) => {
                if (tool.url !== "#") {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                (e.currentTarget as HTMLAnchorElement).style.transform = "none";
              }}
            >
              {/* Icon + tag row */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: `${tool.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>
                  {tool.icon}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: tool.url === "#" ? "var(--muted)" : tool.color,
                  background: tool.url === "#" ? "var(--bg)" : `${tool.color}12`,
                  padding: "3px 8px", borderRadius: 20,
                  marginTop: 4,
                }}>
                  {tool.url === "#" ? "Próximamente" : tool.tag}
                </span>
              </div>

              {/* Name + description */}
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
                {tool.name}
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                {tool.description}
              </p>

              {/* CTA */}
              {tool.url !== "#" && (
                <div style={{
                  marginTop: 20, fontSize: 12, fontWeight: 600,
                  color: tool.color, display: "flex", alignItems: "center", gap: 4,
                }}>
                  Abrir →
                </div>
              )}
            </a>
          ))}
        </div>

        {/* Proyectos section */}
        <div style={{ marginTop: 56 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
            Proyectos
          </p>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
          }}>
            {projects.map((project) => (
              <a
                key={project.key}
                href={project.url}
                style={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 14,
                  padding: "24px",
                  textDecoration: "none",
                  display: "block",
                  transition: "box-shadow 0.15s, transform 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "none";
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${project.color}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>
                    {project.icon}
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600,
                    color: project.color,
                    background: `${project.color}12`,
                    padding: "3px 8px", borderRadius: 20,
                    marginTop: 4,
                  }}>
                    {project.tag}
                  </span>
                </div>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
                  {project.name}
                </h2>
                <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                  {project.description}
                </p>
                <div style={{ marginTop: 20, fontSize: 12, fontWeight: 600, color: project.color, display: "flex", alignItems: "center", gap: 4 }}>
                  Ver proyecto →
                </div>
              </a>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 48, textAlign: "center" }}>
          Dropi · Supplier Success · {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
