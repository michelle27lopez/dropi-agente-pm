"use client";

import { useIsEmbedded } from "@/lib/use-is-embedded";
import { SEMANAS } from "./semanas";
import Breadcrumb from "@/components/Breadcrumb";

const ACCENT = "#0891B2";
const ACCENT_BG = "#ECFEFF";

export default function CelulaPage() {
  const isEmbedded = useIsEmbedded();
  const semanas = [...SEMANAS].reverse();

  return (
    <div style={{ minHeight: "100vh", background: "var(--card)" }}>
      {!isEmbedded && (
        <header style={{ background: "#fff", padding: "16px 0" }}>
          <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: "16px" }}>
            <Breadcrumb items={[{ label: "Proyectos", href: "/proyectos" }, { label: "Célula" }]} />
          </div>
        </header>
      )}

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "32px" }}>
        <div style={{ marginBottom: 28 }}>
          <span style={{
            fontSize: 11, fontWeight: 700, color: ACCENT, background: ACCENT_BG,
            padding: "3px 9px", borderRadius: 999,
          }}>
            🧬 Supplier Success
          </span>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginTop: 10, marginBottom: 6 }}>
            Célula
          </h1>
          <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, maxWidth: 560 }}>
            Presentaciones semanales del cellboard con el equipo — un registro histórico, no solo la de hoy.
            Cada semana trae los temas que tocaba discutir, con demo en vivo y decisiones cerradas con dueño.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {semanas.map((s) => (
            <a
              key={s.slug}
              href={`/proyectos/celula/${s.slug}`}
              style={{
                display: "block", textDecoration: "none",
                background: "var(--card)", border: "1px solid var(--border)",
                borderRadius: 12, padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8, gap: 12 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{s.fecha}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>Abrir →</span>
              </div>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginBottom: 10 }}>{s.resumen}</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {s.temas.map((t) => (
                  <span key={t} style={{
                    fontSize: 11, fontWeight: 600, color: "var(--muted)",
                    background: "#F3F4F6", padding: "3px 8px", borderRadius: 999,
                  }}>
                    {t}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
