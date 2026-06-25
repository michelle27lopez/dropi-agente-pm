"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";

const updates = [
  {
    key: "weekly-pm",
    name: "Weekly · PM",
    description: "Update ejecutivo semanal: oportunidades aprobadas, hipótesis numéricas y accionables clasificados por ruta.",
    url: "/weekly",
    color: "#F77F00",
    tag: "Weekly · Jun 2026",
    icon: "📋",
  },
  {
    key: "weekly-celula",
    name: "Weekly · Célula",
    description: "Updates semanales de la célula Supplier Success para el jefe. Registro histórico por semana.",
    url: "/updates-celula",
    color: "#6366F1",
    tag: "Célula · Supplier Success",
    icon: "🏠",
  },
];

const projects = [
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
  {
    key: "indicadores",
    name: "Indicadores · Postulaciones",
    description: "Cuántos suppliers ven su tablero de desempeño y cuántos se postulan para avanzar de nivel. Distribución por tipo de proveedor.",
    url: "/proyectos/indicadores",
    color: "#6366F1",
    tag: "IND-001 · Métricas",
    icon: "📈",
  },
  {
    key: "caza-productos",
    name: "Caza Productos",
    description: "Solicitudes de productos que los dropshippers no encuentran en catálogo. Señal de demanda explícita y tasa de atención de suppliers.",
    url: "/proyectos/caza-productos",
    color: "#EC4899",
    tag: "CAZ-001 · Demanda",
    icon: "🔍",
  },
  {
    key: "pulso-demo",
    name: "Dropi Pulso · Demo",
    description: "Prototipo interactivo del motor de matching de catálogo. Notificaciones reales por WhatsApp y email, registro por QR, dashboard en vivo y kit de campaña.",
    url: "/proyectos/pulso-demo",
    color: "#F77F00",
    tag: "Demo · Stakeholders",
    icon: "⚡",
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

        {/* Updates section */}
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          Updates
        </p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 20,
          marginBottom: 56,
        }}>
          {updates.map((u) => (
            <a
              key={u.key}
              href={u.url}
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
                  background: `${u.color}15`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22,
                }}>
                  {u.icon}
                </div>
                <span style={{
                  fontSize: 11, fontWeight: 600,
                  color: u.color,
                  background: `${u.color}12`,
                  padding: "3px 8px", borderRadius: 20,
                  marginTop: 4,
                }}>
                  {u.tag}
                </span>
              </div>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
                {u.name}
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                {u.description}
              </p>
              <div style={{ marginTop: 20, fontSize: 12, fontWeight: 600, color: u.color }}>
                Ver →
              </div>
            </a>
          ))}
        </div>

        {/* Proyectos section */}
        <div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
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
