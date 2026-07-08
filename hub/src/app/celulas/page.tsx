"use client";

import { useEffect, useState } from "react";

type Miembro = {
  id: string;
  email: string;
  nombre: string | null;
  is_super_admin: boolean;
};

type Proyecto = {
  id: string;
  name: string;
  project_code: string | null;
  status: string | null;
  type: string | null;
  handoff_status: string | null;
};

type Celula = {
  id: string;
  nombre: string;
  lead: string | null;
  area: string | null;
  miembros: Miembro[];
  proyectos: Proyecto[];
};

const TYPE_COLOR: Record<string, string> = {
  Idea: "#94A3B8",
  Oportunidad: "#0EA5E9",
  POC: "#7C3AED",
  Proyecto: "#1A6B52",
};

const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B",
  "Listo para handoff": "#0EA5E9",
  "Handoff hecho": "#22C55E",
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: color + "18",
      border: `1px solid ${color}33`,
      borderRadius: 6, padding: "2px 8px",
      whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

export default function CelulasPage() {
  const [celulas, setCelulas] = useState<Celula[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/celulas")
      .then((res) => res.json())
      .then((data) => setCelulas(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: "0" }}>
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "20px 32px",
        display: "flex",
        alignItems: "center",
        gap: 12,
      }}>
        <img
          src="/darwin-logo.png"
          alt="Darwin"
          width={36}
          height={36}
          style={{ display: "block", borderRadius: 8 }}
        />
        <div>
          <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
            Darwin · Células
          </h1>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
            Directorio de células, personas y proyectos. Vista de solo lectura.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {loading && (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>
        )}

        {!loading && celulas.length === 0 && (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>
            Aún no hay células registradas.
          </p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {celulas.map((celula) => (
            <div key={celula.id} style={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: 24,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>{celula.nombre}</h2>
                {celula.lead && (
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>Lead: {celula.lead}</span>
                )}
              </div>
              {celula.area && (
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16 }}>{celula.area}</p>
              )}

              {/* Miembros */}
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Personas ({celula.miembros.length})
              </p>
              {celula.miembros.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16 }}>Nadie registrado aún.</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
                  {celula.miembros.map((m) => (
                    <span key={m.id} style={{
                      fontSize: 12, color: "var(--fg)",
                      background: "var(--bg)", border: "1px solid var(--border)",
                      borderRadius: 8, padding: "4px 10px",
                      display: "flex", alignItems: "center", gap: 6,
                    }}>
                      {m.nombre ?? m.email}
                      {m.is_super_admin && <Badge label="super admin" color="#7C3AED" />}
                    </span>
                  ))}
                </div>
              )}

              {/* Proyectos */}
              <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                Proyectos ({celula.proyectos.length})
              </p>
              {celula.proyectos.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Sin proyectos asignados aún.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {celula.proyectos.map((p) => (
                    <div key={p.id} style={{
                      display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                      fontSize: 13, color: "var(--fg)",
                      padding: "8px 12px",
                      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
                    }}>
                      <span style={{ fontWeight: 600 }}>{p.name}</span>
                      {p.project_code && <span style={{ color: "var(--muted)" }}>{p.project_code}</span>}
                      {p.type && <Badge label={p.type} color={TYPE_COLOR[p.type] ?? "#94A3B8"} />}
                      {p.handoff_status && (
                        <Badge label={p.handoff_status} color={HANDOFF_COLOR[p.handoff_status] ?? "#94A3B8"} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
