"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  NODE_DEFINITIONS, PLANNING_NODES, SavedNode, CampaignExtra, PHASE_LABEL, computeCampaignExtra,
  milestoneEndDate,
} from "../planeacion/nodes";
import { Sidebar } from "../Sidebar";

type Campaign = {
  id: string;
  name: string;
  status: string;
  current_node: number;
  created_at: string;
};

type Row = {
  campaign: Campaign;
  extra: CampaignExtra;
  objective: string;
  country: string;
  responsible: string;
};

const NODE_COUNT = NODE_DEFINITIONS.length;
const PLANNING_COUNT = PLANNING_NODES.length;

function daysLabel(dateText: string): string {
  const end = milestoneEndDate(dateText);
  if (!end) return "";
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diffDays = Math.round((end.getTime() - todayStart.getTime()) / 86400000);
  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Mañana";
  if (diffDays > 1) return `En ${diffDays} días`;
  return "Vencido";
}

export default function PanelCampanasPage() {
  const router = useRouter();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch("/api/campaigns-planeacion")
      .then((r) => r.json())
      .then(async (d) => {
        const list: Campaign[] = Array.isArray(d) ? d : [];
        const built = await Promise.all(list.map(async (campaign) => {
          let nodes: SavedNode[] = [];
          try {
            nodes = await fetch(`/api/campaigns-planeacion/${campaign.id}/nodes`).then((r) => r.json());
            if (!Array.isArray(nodes)) nodes = [];
          } catch {
            nodes = [];
          }
          const identidad = nodes.find((n) => n.node_key === "identidad")?.data ?? {};
          return {
            campaign,
            extra: computeCampaignExtra(nodes),
            objective: identidad.objective ?? "",
            country: (identidad.country ?? "").split("||").filter(Boolean).join(", "),
            responsible: identidad.responsible ?? "",
          };
        }));
        setRows(built);
        setLoading(false);
      })
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
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
        <div style={{ marginBottom: 24, display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
              Panel de campañas
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted)", maxWidth: 620, lineHeight: 1.6 }}>
              Cada campaña recorre {PLANNING_COUNT} nodos de planeación y 2 de cierre. Entra a una para ver su dashboard y las 3 fases.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: "var(--dropi)", color: "#fff", border: "none",
              borderRadius: 9, padding: "9px 18px", fontWeight: 700,
              fontSize: 13, cursor: "pointer", flexShrink: 0,
            }}
          >
            + Nueva campaña
          </button>
        </div>

        {loading && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando campañas...</p>
        )}

        {!loading && rows.length === 0 && (
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

        {!loading && rows.length > 0 && (
          <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "var(--bg, #F8F9FA)" }}>
                  {["Campaña", "Fase", "Objetivo", "País", "Responsable", "Próximo hito", "Progreso"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontSize: 11.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
                      {h}
                    </th>
                  ))}
                  <th style={{ borderBottom: "1px solid var(--border)" }} />
                </tr>
              </thead>
              <tbody>
                {rows.map(({ campaign: c, extra, objective, country, responsible }) => {
                  const pill = PHASE_LABEL[extra.phase];
                  const progress = Math.min(Math.round((c.current_node / NODE_COUNT) * 100), 100);
                  const days = extra.nextMilestone ? daysLabel(extra.nextMilestone.date) : "";
                  return (
                    <tr
                      key={c.id}
                      onClick={() => router.push(`/proyectos/dinamicas-catalogo/planeacion/${c.id}/seguimiento`)}
                      style={{ cursor: "pointer", borderBottom: "1px solid #F3F4F6" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg, #F8F9FA)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td style={{ padding: "14px 16px", fontSize: 14, fontWeight: 700, color: "var(--fg)", whiteSpace: "nowrap" }}>{c.name}</td>
                      <td style={{ padding: "14px 16px" }}>
                        <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20, color: pill.color, background: pill.bg, whiteSpace: "nowrap" }}>
                          {pill.text}
                        </span>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--fg)" }}>{objective || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--fg)" }}>{country || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--fg)" }}>{responsible || "—"}</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: "var(--fg)" }}>
                        {extra.nextMilestone ? (
                          <>
                            {extra.nextMilestone.label}
                            {days && <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 700, color: days === "Hoy" ? "#F77F00" : "var(--muted)" }}>{days}</span>}
                          </>
                        ) : "—"}
                      </td>
                      <td style={{ padding: "14px 16px", minWidth: 140 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ flex: 1, height: 6, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${progress}%`, background: progress === 100 ? "#10B981" : "var(--dropi)", borderRadius: 99 }} />
                          </div>
                          <span style={{ fontSize: 11.5, color: "var(--muted)", whiteSpace: "nowrap" }}>{Math.min(c.current_node, NODE_COUNT)}/{NODE_COUNT}</span>
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", fontSize: 18, color: "var(--muted)" }}>→</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
    </div>
  );
}
