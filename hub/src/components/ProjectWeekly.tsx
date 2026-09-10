"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";

export type ProjectUpdate = { id: string; week_date: string; title: string; content: string };

// Mismo parser de contenido que el weekly a nivel célula
// (celula/[slug]/proyectos/page.tsx) — "## " es encabezado de sección, "---"
// es separador, línea vacía es espaciado, el resto es texto plano.
function renderUpdateContent(content: string) {
  return content.split("\n").map((line, i) => {
    const trimmed = line.trim();
    if (trimmed === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />;
    if (trimmed === "") return <div key={i} style={{ height: 6 }} />;
    if (trimmed.startsWith("## ")) return <h3 key={i} style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>{trimmed.slice(3)}</h3>;
    return <p key={i} style={{ margin: "0 0 4px", whiteSpace: "pre-wrap" }}>{line}</p>;
  });
}

function formatWeekDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-CO", { day: "numeric", month: "short", year: "numeric" });
}

// Botón + modal de "Weekly de Producto" propio de un proyecto — historial
// independiente del weekly agregado a nivel célula. Ver 056_project_updates.sql.
export default function ProjectWeekly({ updates }: { updates: ProjectUpdate[] }) {
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const historial = updates.slice().sort((a, b) => b.week_date.localeCompare(a.week_date));
  const active = historial.find((u) => u.id === selectedId) ?? historial[0] ?? null;

  return (
    <>
      <button
        type="button"
        onClick={() => {
          setSelectedId(null);
          setOpen(true);
        }}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          fontSize: 13, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
          padding: "9px 16px", borderRadius: 10,
          border: "1px solid var(--dropi)", background: "var(--dropi-light)", color: "var(--dropi)",
        }}
      >
        <ClipboardList size={15} />
        Weekly de Producto
      </button>

      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--bg)", borderRadius: 14, padding: 24, maxWidth: 620, width: "100%",
              maxHeight: "80vh", overflowY: "auto", border: "1px solid var(--border)",
            }}
          >
            {active ? (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--fg)", margin: 0 }}>Weekly de Producto</h2>
                  <button
                    onClick={() => setOpen(false)}
                    style={{ flexShrink: 0, background: "none", border: "none", fontSize: 20, color: "var(--muted)", cursor: "pointer", lineHeight: 1, padding: 4 }}
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>

                {historial.length > 1 && (
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "12px 0 18px" }}>
                    {historial.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedId(u.id)}
                        style={{
                          fontSize: 11.5, fontWeight: 700, fontFamily: "inherit", cursor: "pointer",
                          padding: "5px 10px", borderRadius: 999,
                          border: `1px solid ${u.id === active.id ? "var(--dropi)" : "var(--border)"}`,
                          background: u.id === active.id ? "var(--dropi-light)" : "transparent",
                          color: u.id === active.id ? "var(--dropi)" : "var(--muted)",
                        }}
                      >
                        {formatWeekDate(u.week_date)}
                      </button>
                    ))}
                  </div>
                )}

                <h3 style={{ fontSize: 14.5, fontWeight: 800, color: "var(--fg)", lineHeight: 1.35, margin: "0 0 2px" }}>{active.title}</h3>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 0, marginBottom: 18 }}>{formatWeekDate(active.week_date)}</p>
                <div style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.7 }}>
                  {renderUpdateContent(active.content)}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
                  <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--fg)", margin: 0 }}>Weekly de Producto</h2>
                  <button
                    onClick={() => setOpen(false)}
                    style={{ flexShrink: 0, background: "none", border: "none", fontSize: 20, color: "var(--muted)", cursor: "pointer", lineHeight: 1, padding: 4 }}
                    aria-label="Cerrar"
                  >
                    ×
                  </button>
                </div>
                <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12 }}>
                  Aún no hay un weekly de producto publicado para este proyecto.
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
