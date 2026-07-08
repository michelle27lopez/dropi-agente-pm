"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { NODE_DEFINITIONS, PLANNING_NODES } from "./nodes";

type Campaign = {
  id: string;
  name: string;
  status: string;
  current_node: number;
  created_at: string;
};

const NODE_COUNT = NODE_DEFINITIONS.length;
const PLANNING_COUNT = PLANNING_NODES.length;

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

export default function PlaneacionListPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/campaigns-planeacion")
      .then((r) => r.json())
      .then((d) => { setCampaigns(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const createCampaign = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    const res = await fetch("/api/campaigns-planeacion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (data?.id) router.push(`/proyectos/dinamicas-catalogo/planeacion/${data.id}`);
    setCreating(false);
  };

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap",
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <a href="/proyectos/dinamicas-catalogo" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>Dinámicas de Catálogo</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Planeación</span>
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
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Planeación de campañas
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 620, lineHeight: 1.6 }}>
            Herramienta de experimento — planeas y documentas la campaña acá; la ejecución sigue siendo manual.
            Si el experimento valida, esto se convierte en el insumo para construirlo en la plataforma.
          </p>
        </div>

        <div style={{
          background: "#FFF8F0", border: "1px solid rgba(247,127,0,0.25)",
          borderRadius: 12, padding: "14px 18px", marginBottom: 28,
          display: "flex", gap: 12, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 17, flexShrink: 0 }}>🧪</span>
          <p style={{ fontSize: 12.5, color: "#7a4f1e", lineHeight: 1.6, margin: 0 }}>
            {PLANNING_COUNT} nodos de planeación (antes de lanzar) + {NODE_COUNT - PLANNING_COUNT} nodos de cierre
            (después de que la campaña corrió — resultados y decisión). El cierre se habilita cuando la planeación
            está completa.
          </p>
        </div>

        {loading && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando campañas...</p>
        )}

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
              Crea tu primera campaña para empezar a planearla nodo por nodo.
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

        {!loading && campaigns.length > 0 && (
          <div style={{ display: "grid", gap: 12 }}>
            {campaigns.map((c) => {
              const progress = Math.min(Math.round((c.current_node / NODE_COUNT) * 100), 100);
              const inClosing = c.current_node >= PLANNING_COUNT;
              return (
                <div
                  key={c.id}
                  onClick={() => router.push(`/proyectos/dinamicas-catalogo/planeacion/${c.id}`)}
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
                        {inClosing && c.current_node < NODE_COUNT && (
                          <span style={{
                            fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                            color: "#6366F1", background: "#EEF2FF",
                          }}>
                            En cierre
                          </span>
                        )}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ flex: 1, height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
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
                    <span style={{ fontSize: 20, color: "var(--muted)" }}>→</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <div
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            style={{ background: "#fff", borderRadius: 18, padding: "32px", width: 440, boxShadow: "0 24px 60px rgba(0,0,0,0.16)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Nueva campaña</h2>
            <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 24 }}>
              Dale un nombre. Podrás completar todo lo demás en el flujo guiado.
            </p>
            <label style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", display: "block", marginBottom: 8 }}>
              Nombre de la campaña *
            </label>
            <input
              autoFocus
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createCampaign()}
              placeholder="ej. Cyber Days, Remates de Julio..."
              style={{
                width: "100%", border: "1px solid var(--border)", borderRadius: 10,
                padding: "10px 14px", fontSize: 14, outline: "none", marginBottom: 24,
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--dropi)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowModal(false)}
                style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
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
