"use client";

// Gantt de roadmap reutilizable — fechas estimadas a partir del estado más
// reciente reportado en el Weekly Status de cada proyecto (no fechas
// confirmadas por Jira/PM salvo que se indique lo contrario).

export type FaseEstado = "completada" | "en-curso" | "bloqueada" | "proxima";

export type GanttFase = {
  nombre: string;
  detalle: string;
  estado: FaseEstado;
  inicio: string; // "YYYY-MM"
  fin: string; // "YYYY-MM" (inclusive)
  href?: string;
  bloqueo?: string;
};

const ESTADO_META: Record<FaseEstado, { color: string; bg: string; icon: string; label: string }> = {
  completada: { color: "#15803D", bg: "#DCFCE7", icon: "✅", label: "Completada" },
  "en-curso": { color: "#1D4ED8", bg: "#DBEAFE", icon: "🔵", label: "En curso" },
  bloqueada: { color: "#B91C1C", bg: "#FEE2E2", icon: "⛔", label: "Bloqueada" },
  proxima: { color: "#6B7280", bg: "#F3F4F6", icon: "⏳", label: "Próxima" },
};

const MES_LABEL = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

function monthIndex(ym: string) {
  const [y, m] = ym.split("-").map(Number);
  return y * 12 + (m - 1);
}

export default function RoadmapGantt({
  fases,
  axisStart,
  axisEnd,
  nota,
}: {
  fases: GanttFase[];
  axisStart: string;
  axisEnd: string;
  nota?: string;
}) {
  const start = monthIndex(axisStart);
  const end = monthIndex(axisEnd);
  const totalMonths = end - start + 1;
  const months = Array.from({ length: totalMonths }, (_, i) => start + i);

  const today = new Date();
  const todayIdx = today.getFullYear() * 12 + today.getMonth();
  const showToday = todayIdx >= start && todayIdx <= end;
  const todayPct = ((todayIdx - start + (today.getDate() / 30)) / totalMonths) * 100;

  const rowH = 58;

  return (
    <div>
      {/* Leyenda — estado nunca solo por color, siempre con ícono + texto */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
        {(Object.keys(ESTADO_META) as FaseEstado[]).map((k) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--muted)" }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: ESTADO_META[k].color, display: "inline-block", flexShrink: 0 }} />
            <span>{ESTADO_META[k].icon} {ESTADO_META[k].label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex" }}>
        {/* Columna de etiquetas */}
        <div style={{ width: 190, flexShrink: 0 }}>
          <div style={{ height: 26 }} />
          {fases.map((f) => (
            <div key={f.nombre} style={{ height: rowH, display: "flex", flexDirection: "column", justifyContent: "center", paddingRight: 10, borderTop: "1px solid var(--border)" }}>
              <span style={{ fontSize: 12.5, fontWeight: 800, color: "var(--fg)", lineHeight: 1.3 }}>{f.nombre}</span>
              {f.bloqueo && (
                <span style={{ fontSize: 10.5, color: "#B91C1C", fontWeight: 600, marginTop: 2 }}>⛔ {f.bloqueo}</span>
              )}
            </div>
          ))}
        </div>

        {/* Área del timeline */}
        <div style={{ flex: 1, position: "relative", minWidth: 0 }}>
          {/* Eje de meses */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${totalMonths}, 1fr)`, height: 26 }}>
            {months.map((m) => (
              <div
                key={m}
                style={{
                  textAlign: "center",
                  fontSize: 10.5,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.04em",
                  color: "var(--muted)",
                  borderLeft: "1px solid var(--border)",
                }}
              >
                {MES_LABEL[((m % 12) + 12) % 12]}
              </div>
            ))}
          </div>

          {/* Línea de HOY */}
          {showToday && (
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: `${todayPct}%`,
                width: 2,
                background: "#DC2626",
                zIndex: 2,
              }}
            >
              <span style={{ position: "absolute", top: -1, left: 5, fontSize: 9.5, fontWeight: 800, color: "#DC2626", whiteSpace: "nowrap" }}>
                HOY
              </span>
            </div>
          )}

          {/* Filas / barras */}
          {fases.map((f) => {
            const s = monthIndex(f.inicio) - start;
            const e = monthIndex(f.fin) - start + 1;
            const leftPct = (s / totalMonths) * 100;
            const widthPct = ((e - s) / totalMonths) * 100;
            const meta = ESTADO_META[f.estado];

            const row = (
              <div style={{ position: "relative", height: rowH, borderTop: "1px solid var(--border)" }}>
                {/* Gridlines verticales */}
                <div style={{ position: "absolute", inset: 0, display: "grid", gridTemplateColumns: `repeat(${totalMonths}, 1fr)` }}>
                  {months.map((m, i) => (
                    <div key={m} style={{ borderLeft: i > 0 ? "1px solid var(--border)" : "none" }} />
                  ))}
                </div>
                {/* Barra */}
                <div
                  title={`${meta.label} · ${f.detalle}`}
                  style={{
                    position: "absolute",
                    left: `${leftPct}%`,
                    width: `${widthPct}%`,
                    top: "50%",
                    transform: "translateY(-50%)",
                    height: 22,
                    borderRadius: 5,
                    background: meta.color,
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "0 8px",
                    boxSizing: "border-box",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                  }}
                >
                  <span style={{ fontSize: 11 }}>{meta.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {meta.label}
                  </span>
                </div>
              </div>
            );

            return f.href ? (
              <a key={f.nombre} href={f.href} style={{ display: "block", textDecoration: "none", color: "inherit" }}>
                {row}
              </a>
            ) : (
              <div key={f.nombre}>{row}</div>
            );
          })}
        </div>
      </div>

      {/* Detalle textual de cada fase, debajo del Gantt (nada queda oculto solo en el hover) */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 16 }}>
        {fases.map((f) => (
          <div key={f.nombre} style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: "var(--fg)" }}>{f.nombre}:</span> {f.detalle}
            {f.href && (
              <a href={f.href} style={{ marginLeft: 6, color: "var(--dropi)", fontWeight: 600 }}>
                Ver detalle →
              </a>
            )}
          </div>
        ))}
      </div>

      {nota && (
        <p style={{ fontSize: 11, color: "var(--muted)", fontStyle: "italic", marginTop: 14, marginBottom: 0 }}>
          {nota}
        </p>
      )}
    </div>
  );
}
