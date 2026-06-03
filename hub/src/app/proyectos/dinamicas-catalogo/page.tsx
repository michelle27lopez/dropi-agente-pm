"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Campaign = {
  id: string;
  name: string;
  status: string;
  current_node: number;
  created_at: string;
};

const NODE_COUNT = 7;

const statusLabel: Record<string, string> = {
  draft: "Borrador",
  in_progress: "En progreso",
  completed: "Completada",
};
const statusColor: Record<string, string> = {
  draft: "#6B7280",
  in_progress: "#F77F00",
  completed: "#10B981",
};
const statusBg: Record<string, string> = {
  draft: "#F3F4F6",
  in_progress: "#FFF3E0",
  completed: "#ECFDF5",
};

export default function DinamicasCatalogoPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [docsOpen, setDocsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/campaigns")
      .then((r) => r.json())
      .then((d) => { setCampaigns(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const createCampaign = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (data?.id) router.push(`/proyectos/dinamicas-catalogo/${data.id}`);
    setCreating(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: "16px",
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Dinámicas de Catálogo</span>
        <div style={{ marginLeft: "auto" }}>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "var(--dropi)", color: "#fff", border: "none",
              borderRadius: 9, padding: "8px 16px", fontWeight: 700,
              fontSize: 13, cursor: "pointer",
            }}
          >
            + Nueva campaña
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Campañas
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)" }}>
            Cada campaña recorre un flujo guiado de 7 nodos para estructurar el experimento de catálogo.
          </p>
        </div>

        {/* Panel de recursos */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, marginBottom: 32, overflow: "hidden",
        }}>
          <button
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "14px 20px", display: "flex", alignItems: "center", gap: 10,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 15 }}>📂</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>Recursos del proyecto</span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>DCA-001 · Dinámicas de Catálogo</span>
            <span style={{ fontSize: 16, color: "var(--muted)", transition: "transform 0.2s", display: "inline-block", transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
          </button>

          {docsOpen && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px", display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a
                href="/proyectos/dinamicas-catalogo/docs"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#F8FAFC", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "12px 16px", textDecoration: "none",
                  flex: "1 1 200px", minWidth: 200, maxWidth: 260,
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>📋</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>Documentación</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Nodos, campos, ejemplos y casos de uso</div>
                </div>
              </a>

              <a
                href="/proyectos/dinamicas-catalogo/metas"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#F8FAFC", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "12px 16px", textDecoration: "none",
                  flex: "1 1 200px", minWidth: 200, maxWidth: 260,
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>Metas del experimento</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Productividad del catálogo · ruta a 10M</div>
                </div>
              </a>

              <a
                href="/proyectos/dinamicas-catalogo/plan"
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  background: "#F8FAFC", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "12px 16px", textDecoration: "none",
                  flex: "1 1 200px", minWidth: 200, maxWidth: 260,
                  transition: "box-shadow 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                <span style={{ fontSize: 22, flexShrink: 0 }}>📅</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>Plan de campañas</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>9 campañas · 6 meses · portafolio</div>
                </div>
              </a>
            </div>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando campañas...</p>
        )}

        {/* Empty state */}
        {!loading && campaigns.length === 0 && (
          <div style={{
            background: "#fff", border: "2px dashed var(--border)",
            borderRadius: 14, padding: "56px 24px", textAlign: "center",
          }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🗂️</div>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)", marginBottom: 6 }}>
              Sin campañas todavía
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
              Crea tu primera campaña para empezar a construir el experimento nodo por nodo.
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: "var(--dropi)", color: "#fff", border: "none",
                borderRadius: 9, padding: "10px 20px", fontWeight: 700,
                fontSize: 13, cursor: "pointer",
              }}
            >
              + Nueva campaña
            </button>
          </div>
        )}

        {/* Campaign list */}
        {!loading && campaigns.length > 0 && (
          <div style={{ display: "grid", gap: 12 }}>
            {campaigns.map((c) => {
              const progress = Math.min(Math.round((c.current_node / NODE_COUNT) * 100), 100);
              return (
                <div
                  key={c.id}
                  onClick={() => router.push(`/proyectos/dinamicas-catalogo/${c.id}`)}
                  style={{
                    background: "#fff", border: "1px solid var(--border)",
                    borderRadius: 14, padding: "20px 24px", cursor: "pointer",
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>{c.name}</span>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                          color: statusColor[c.status] ?? "#6B7280",
                          background: statusBg[c.status] ?? "#F3F4F6",
                        }}>
                          {statusLabel[c.status] ?? c.status}
                        </span>
                      </div>
                      {/* Progress bar */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{
                          flex: 1, height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden",
                        }}>
                          <div style={{
                            height: "100%", width: `${progress}%`,
                            background: progress === 100 ? "#10B981" : "var(--dropi)",
                            borderRadius: 99, transition: "width 0.3s",
                          }} />
                        </div>
                        <span style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>
                          Nodo {Math.min(c.current_node, NODE_COUNT)} / {NODE_COUNT}
                        </span>
                      </div>
                    </div>
                    {c.current_node >= NODE_COUNT && (
                      <a
                        href={`/proyectos/dinamicas-catalogo/${c.id}/handoff`}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                          background: "#ECFDF5", color: "#10B981",
                          border: "1.5px solid #10B98130",
                          borderRadius: 9, padding: "7px 14px",
                          fontSize: 12, fontWeight: 700, textDecoration: "none",
                          whiteSpace: "nowrap", flexShrink: 0,
                          display: "flex", alignItems: "center", gap: 5,
                        }}
                      >
                        ↓ Handoff
                      </a>
                    )}
                    <span style={{ fontSize: 20, color: "var(--muted)" }}>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal nueva campaña */}
      {showModal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{
              background: "#fff", borderRadius: 18, padding: "32px",
              width: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.16)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
              Nueva campaña
            </h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
              Dale un nombre a esta campaña. Podrás completar todos los detalles en el flujo guiado.
            </p>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", display: "block", marginBottom: 8 }}>
              Nombre de la campaña *
            </label>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createCampaign()}
              placeholder="ej. Dropicup Mundial, Black Week, Remates Junio..."
              style={{
                width: "100%", border: "1px solid var(--border)", borderRadius: 10,
                padding: "10px 14px", fontSize: 14, outline: "none",
                marginBottom: 24,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--dropi)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{
                  background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer",
                }}
              >
                Cancelar
              </button>
              <button
                onClick={createCampaign}
                disabled={!newName.trim() || creating}
                style={{
                  background: newName.trim() ? "var(--dropi)" : "#D1D5DB",
                  color: "#fff", border: "none", borderRadius: 9,
                  padding: "9px 18px", fontSize: 13, fontWeight: 700,
                  cursor: newName.trim() ? "pointer" : "default",
                }}
              >
                {creating ? "Creando..." : "Crear y comenzar →"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
