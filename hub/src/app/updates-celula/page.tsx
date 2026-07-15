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

interface AreaBlock {
  area: string;
  owner: string;
  color: string;
  avances: string[];
  compromisos: string[];
}

interface ProximoPaso {
  item: string;
  owner: string;
}

interface CanvasContent {
  format: "canvas-v1";
  metricas: { label: string; value: string; sub?: string }[];
  ataque: { titulo: string; detalle: string };
  areas: AreaBlock[];
  hallazgos: string[];
  proximosPasos: ProximoPaso[];
  asistentes: string;
}

function isCanvasContent(x: unknown): x is CanvasContent {
  return !!x && typeof x === "object" && (x as { format?: string }).format === "canvas-v1";
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

// ─── Canvas sub-components ─────────────────────────────────────────────────────
function AreaCard({ area }: { area: AreaBlock }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, borderTop: `4px solid ${area.color}`, background: "var(--bg)", padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "var(--fg)" }}>{area.area}</div>
      </div>
      <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, fontWeight: 700, color: area.color, background: `${area.color}15`, borderRadius: 999, padding: "3px 9px", marginBottom: 12 }}>
        👤 {area.owner}
      </div>

      {area.avances.length > 0 && (
        <div style={{ marginBottom: area.compromisos.length > 0 ? 12 : 0 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Avances</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {area.avances.map((a, i) => (
              <div key={i} style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.5, display: "flex", gap: 6 }}>
                <span style={{ color: area.color, flexShrink: 0 }}>✓</span>
                <span>{a}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {area.compromisos.length > 0 && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 6 }}>Compromisos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {area.compromisos.map((c, i) => (
              <div key={i} style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5, display: "flex", gap: 6 }}>
                <span style={{ color: area.color, flexShrink: 0 }}>→</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Canvas({ data }: { data: CanvasContent }) {
  return (
    <div>
      {/* Métricas banner */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16 }}>
        {data.metricas.map((m, i) => (
          <div key={i} style={{ flex: "1 1 140px", border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px", background: "var(--bg)" }}>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--fg)", letterSpacing: "-0.01em" }}>{m.value}</div>
            <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{m.label}</div>
            {m.sub && <div style={{ fontSize: 10, color: "var(--muted)", opacity: 0.8 }}>{m.sub}</div>}
          </div>
        ))}
      </div>

      {/* Ataque de la semana */}
      <div style={{ background: "#0A1628", borderRadius: 12, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 4 }}>
          🎯 Ataque acordado esta semana
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "white", marginBottom: 3 }}>{data.ataque.titulo}</div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.6)", lineHeight: 1.5 }}>{data.ataque.detalle}</div>
      </div>

      {/* Canvas de áreas */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
        Ownership por célula
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginBottom: 20 }}>
        {data.areas.map((a, i) => (
          <AreaCard key={i} area={a} />
        ))}
      </div>

      {/* Hallazgos */}
      {data.hallazgos.length > 0 && (
        <>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
            Hallazgos
          </div>
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", background: "var(--bg)", marginBottom: 20 }}>
            {data.hallazgos.map((h, i) => (
              <div key={i} style={{ display: "flex", gap: 8, fontSize: 12.5, color: "var(--fg)", lineHeight: 1.55, marginBottom: i < data.hallazgos.length - 1 ? 8 : 0 }}>
                <span style={{ color: "#D97706", flexShrink: 0 }}>◆</span>
                <span>{h}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Próximos pasos */}
      <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
        Próximos pasos
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
        {data.proximosPasos.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, border: "1px solid var(--border)", borderRadius: 8, padding: "8px 12px", fontSize: 12.5 }}>
            <span style={{ color: "var(--fg)", lineHeight: 1.5 }}>{p.item}</span>
            <span style={{ flexShrink: 0, fontSize: 10, fontWeight: 700, color: ACCENT, background: "#EEF2FF", borderRadius: 999, padding: "2px 9px", whiteSpace: "nowrap" }}>{p.owner}</span>
          </div>
        ))}
      </div>

      <div style={{ fontSize: 11, color: "var(--muted)", paddingTop: 10, borderTop: "1px solid var(--border)" }}>
        Asistentes: {data.asistentes}
      </div>
    </div>
  );
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
    <div style={{ maxWidth: 980, margin: "0 auto", padding: "40px 24px" }}>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            background: "#EEF2FF", color: ACCENT,
            borderRadius: 999, padding: "3px 10px",
            fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
          }}>
            Célula · Brands Success
          </div>
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", margin: 0 }}>
          Updates Semanales
        </h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginTop: 4 }}>
          Registro histórico de updates de la célula para el jefe de Brands Success.
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
          let parsed: CanvasContent | null = null;
          try {
            const maybeJson = JSON.parse(u.content);
            if (isCanvasContent(maybeJson)) parsed = maybeJson;
          } catch {
            parsed = null;
          }

          return (
            <div
              key={u.id}
              style={{
                ...card,
                borderColor: isOpen ? ACCENT : "var(--border)",
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
                <div style={{ marginTop: 20, borderTop: "1px solid var(--border)", paddingTop: 20, cursor: "default" }} onClick={(e) => e.stopPropagation()}>
                  {parsed ? (
                    <Canvas data={parsed} />
                  ) : (
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
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
