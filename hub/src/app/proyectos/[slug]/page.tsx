"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";

type ProjectDetails = {
  id: string;
  name: string;
  project_code: string | null;
  status: string | null;
  summary: string | null;
  celulas?: {
    nombre: string;
    slug: string;
  } | null;
};

type Cycle = {
  id: string;
  title: string;
  estado: "activo" | "cerrado";
  fase_actual: string;
  brief?: {
    causa?: "M" | "A" | "P" | "";
    subPerfil?: string;
    target?: string;
    hipotesis?: string;
    experimento?: string;
    indicadores?: string;
  };
  risks?: { id: string; text: string; resolved: boolean }[];
};

type Decision = {
  id: string;
  tipo: string;
  texto: string;
  fecha: string;
  actor: string | null;
};

export default function ProjectDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const slug = typeof params?.slug === "string" ? params.slug : "";

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [decisions, setDecisions] = useState<Decision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [docsOpen, setDocsOpen] = useState(true);
  const [briefOpen, setBriefOpen] = useState(true);

  useEffect(() => {
    if (!slug) return;

    fetch(`/api/proyectos/${slug}`)
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("No se pudo cargar el proyecto.");
        }
        const data = await res.json();
        setProject(data.project);
        setCycles(data.cycles || []);
        setDecisions(data.decisions || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main style={{ padding: 48, background: "var(--card)", minHeight: "100vh" }}>
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando detalles del proyecto…</p>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main style={{ padding: 48, background: "var(--card)", minHeight: "100vh" }}>
        <p style={{ fontSize: 13, color: "#DC2626" }}>Error: {error || "Proyecto no encontrado."}</p>
        <button onClick={() => router.push("/")} style={{ background: "none", border: "1px solid var(--border)", padding: "6px 12px", borderRadius: 8, cursor: "pointer", fontSize: 12, marginTop: 12 }}>
          Volver al Inicio
        </button>
      </main>
    );
  }

  const cellName = project.celulas?.nombre ?? "Célula";
  const cellSlug = project.celulas?.slug ?? "";
  const code = project.project_code || "PRJ";
  
  // Find active or latest cycle
  const activeCycle = cycles.find((c) => c.estado === "activo") || cycles[0];
  const brief = activeCycle?.brief;

  const CAUSA_LABELS = {
    M: "🧠 M · Modelo Mental (Causa Cognitiva)",
    A: "📈 A · Adopción (Causa Operativa)",
    P: "⚡ P · Performance (Causa de Habilitación)",
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title={project.name}
        subtitle={`Proyecto ${code} · ${cellName}`}
        currentSlug={cellSlug}
      />

      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto", padding: "40px 24px", boxSizing: "border-box" }}>
        
        {/* Navigation Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 13 }}>
          <a
            href={cellSlug ? `/celula/${cellSlug}` : "/"}
            onClick={(e) => {
              e.preventDefault();
              if (window.history.length > 1) {
                router.back();
              } else {
                router.push(cellSlug ? `/celula/${cellSlug}` : "/");
              }
            }}
            style={{ color: "var(--muted)", textDecoration: "none" }}
          >
            ← Volver
          </a>
        </div>

        {/* Project Metadata Card */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "var(--dropi-light)", color: "var(--dropi)", padding: "3px 9px", borderRadius: 20 }}>
              {code}
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#ECFDF5", color: "#10B981", padding: "3px 9px", borderRadius: 20 }}>
              {project.status === "in_progress" ? "En Progreso" : project.status || "Activo"}
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.6, margin: 0 }}>
            {project.summary || "Sin resumen registrado."}
          </p>
        </div>

        {/* Recursos Accordion */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 32, overflow: "hidden" }}>
          <button
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 10,
              textAlign: "left", borderBottom: docsOpen ? "1px solid var(--border)" : "none"
            }}
          >
            <span style={{ fontSize: 16 }}>📂</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>
              Recursos del proyecto
            </span>
            <span style={{ fontSize: 16, color: "var(--muted)", transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>
              ⌄
            </span>
          </button>

          {docsOpen && (
            <div style={{ padding: "20px" }}>
              {/* Product Lens Section */}
              {activeCycle ? (
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, margin: 0, color: "var(--fg)" }}>
                      Lente de Producto B=MAP (Fase actual: {activeCycle.fase_actual})
                    </h3>
                    <button
                      onClick={() => router.push(`/proyectos/${slug}/discovery`)}
                      style={{
                        fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--dropi)",
                        border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer"
                      }}
                    >
                      💬 Reabrir Chat de Discovery
                    </button>
                  </div>

                  {/* Brief View */}
                  <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: 18, marginBottom: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, borderBottom: "1px solid #E2E8F0", paddingBottom: 8 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>
                        BRIEF DE INTERVENCIÓN ACTIVO
                      </span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Causa B=MAP</strong>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>
                          {brief?.causa ? CAUSA_LABELS[brief.causa] || brief.causa : "No especificado aún por el discovery."}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Sub-Perfil Conductual</strong>
                        <span style={{ fontSize: 13, color: "var(--fg)" }}>
                          {brief?.subPerfil || "No especificado aún por el discovery."}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Público Objetivo (Target)</strong>
                        <span style={{ fontSize: 13, color: "var(--fg)" }}>
                          {brief?.target || "No especificado aún por el discovery."}
                        </span>
                      </div>
                      <div>
                        <strong style={{ fontSize: 11, color: "var(--muted)", textTransform: "uppercase", display: "block" }}>Hipótesis / Reto</strong>
                        <span style={{ fontSize: 13, color: "var(--fg)", whiteSpace: "pre-line" }}>
                          {brief?.hipotesis || "No especificado aún por el discovery."}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Decisions Ledger */}
                  {decisions.length > 0 && (
                    <div style={{ borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>
                        Registro de Decisiones (Ledger)
                      </h4>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {decisions.map((dec) => (
                          <div key={dec.id} style={{ background: "#F1F5F9", borderRadius: 8, padding: 12, borderLeft: "4px solid #64748B" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "#64748B", marginBottom: 4 }}>
                              <strong>Decisión · {dec.tipo.toUpperCase()}</strong>
                              <span>{new Date(dec.fecha).toLocaleDateString()}</span>
                            </div>
                            <p style={{ fontSize: 12, color: "var(--fg)", margin: 0, lineHeight: 1.4 }}>
                              {dec.texto}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: "center", padding: "30px 10px" }}>
                  <span style={{ fontSize: 32, display: "block", marginBottom: 10 }}>🔭</span>
                  <h4 style={{ fontSize: 14, fontWeight: 700, margin: "0 0 6px 0", color: "var(--fg)" }}>
                    Lente B=MAP no iniciado
                  </h4>
                  <p style={{ fontSize: 12, color: "var(--muted)", maxWidth: 400, margin: "0 auto 16px auto", lineHeight: 1.4 }}>
                    Este proyecto aún no cuenta con un ciclo de discovery para perfilar sus causas conductuales e hipótesis.
                  </p>
                  <button
                    onClick={() => router.push(`/proyectos/${slug}/discovery`)}
                    style={{
                      fontSize: 12, fontWeight: 700, color: "#fff", background: "var(--dropi)",
                      border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer"
                    }}
                  >
                    🚀 Iniciar Lente de Producto B=MAP
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
