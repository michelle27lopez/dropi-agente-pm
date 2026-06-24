"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface CelulaUpdate {
  id: string;
  week_date: string;
  title: string;
  content: string;
  created_at: string;
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "20px 24px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
  cursor: "pointer",
  transition: "border-color 0.15s",
};

const ACCENT = "#6366F1";

function formatWeekDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "long", year: "numeric" });
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function UpdatesCelulaPage() {
  const [updates, setUpdates] = useState<CelulaUpdate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/celula-updates")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setUpdates(data);
          if (data.length > 0) setOpenId(data[0].id);
        } else {
          setError("Error cargando updates");
        }
      })
      .catch(() => setError("Error de red"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            background: "#EEF2FF", color: ACCENT,
            borderRadius: 999, padding: "3px 10px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Célula · Supplier Success
          </div>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", margin: 0 }}>
          Updates Semanales
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
          Registro histórico de updates de la célula para el jefe de Supplier Success.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ color: "var(--muted)", fontSize: 14, padding: "40px 0", textAlign: "center" }}>
          Cargando...
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: "#FEF2F2", border: "1px solid #FECACA",
          borderRadius: 10, padding: "14px 18px", color: "#B91C1C", fontSize: 13,
        }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && updates.length === 0 && (
        <div style={{
          ...card, cursor: "default", textAlign: "center",
          padding: "48px 24px", color: "var(--muted)", fontSize: 14,
        }}>
          No hay updates todavía. El primero aparecerá aquí después de la próxima reunión de célula.
        </div>
      )}

      {/* Update list */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {updates.map((u, i) => {
          const isOpen = openId === u.id;
          return (
            <div
              key={u.id}
              style={{
                ...card,
                borderColor: isOpen ? ACCENT : "var(--border)",
                background: isOpen ? "var(--card)" : "var(--card)",
              }}
              onClick={() => setOpenId(isOpen ? null : u.id)}
            >
              {/* Card header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    background: i === 0 ? ACCENT : "var(--border)",
                    color: i === 0 ? "#fff" : "var(--muted)",
                    borderRadius: 8, padding: "4px 10px",
                    fontSize: 11, fontWeight: 700, whiteSpace: "nowrap",
                  }}>
                    {i === 0 ? "🔴 Live" : formatWeekDate(u.week_date)}
                  </div>
                  {i === 0 && (
                    <span style={{ fontSize: 12, color: "var(--muted)" }}>
                      {formatWeekDate(u.week_date)}
                    </span>
                  )}
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>
                    {u.title}
                  </span>
                </div>
                <span style={{ fontSize: 18, color: "var(--muted)", flexShrink: 0 }}>
                  {isOpen ? "↑" : "↓"}
                </span>
              </div>

              {/* Expanded content */}
              {isOpen && (
                <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 20 }}>
                  <pre style={{
                    fontFamily: "inherit",
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: "var(--fg)",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    margin: 0,
                  }}>
                    {u.content}
                  </pre>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
