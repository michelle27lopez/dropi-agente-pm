"use client";

import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import ProjectWeekly, { type ProjectUpdate } from "@/components/ProjectWeekly";
import {
  ChevronDown, ChevronUp, FileText,
  Users, GitBranch,
} from "lucide-react";

/* ── Shared styles (mismos tokens que gro-001 / gro-002 / gro-004 / gro-006) ── */
const badgeStyle = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  borderRadius: 999,
  padding: "4px 10px",
  fontSize: 12,
  fontWeight: 700,
  color,
  background: bg,
  whiteSpace: "nowrap",
});

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
  color: "#0F172A",
  margin: "0 0 10px 0",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const subHeadingStyle: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 800,
  color: "#0F172A",
  margin: "18px 0 8px 0",
};

const pStyle: React.CSSProperties = { fontSize: 13, color: "#334155", lineHeight: 1.65, marginBottom: 10 };
const ulStyle: React.CSSProperties = { fontSize: 13, color: "#334155", lineHeight: 1.65, paddingLeft: 20, marginBottom: 12 };

function Callout({ tone, title, children }: { tone: "warning" | "info" | "danger" | "success"; title: string; children: React.ReactNode }) {
  const map = {
    warning: { bg: "#FFFBEB", border: "#FDE68A", fg: "#92400E" },
    info: { bg: "#EFF6FF", border: "#93C5FD", fg: "#1E40AF" },
    danger: { bg: "#FEF2F2", border: "#FCA5A5", fg: "#991B1B" },
    success: { bg: "#F0FDF4", border: "#86EFAC", fg: "#166534" },
  }[tone];
  return (
    <div style={{ background: map.bg, border: `1px solid ${map.border}`, borderRadius: 10, padding: 16, marginBottom: 16 }}>
      <strong style={{ color: map.fg, fontSize: 13 }}>{title}</strong>
      <div style={{ fontSize: 12.5, color: map.fg, marginTop: 6, lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

type PocChild = { id: string; name: string; project_code: string | null; estado_interno: string | null };

export default function Gro017ProjectPage() {
  const [docOpen, setDocOpen] = useState(true);
  const [tab, setTab] = useState("resumen");
  const [pocs, setPocs] = useState<PocChild[]>([]);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);

  useEffect(() => {
    fetch("/api/proyectos/gro-017")
      .then((res) => res.json())
      .then((data) => {
        setPocs((data?.children ?? []).filter((c: { type: string }) => c.type === "POC"));
        setUpdates(data?.updates ?? []);
      })
      .catch(() => {});
  }, []);

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="GRO-017 · BackOffice Operación Líderes de Comunidad"
        subtitle="José Pineda · Growth Product Manager"
        currentSlug="gro-017"
      />

      <main style={{ maxWidth: 1200, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>

        {/* ── Breadcrumb & título ── */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 12 }}>
            <a href="/" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}>
              ← Volver al Hub
            </a>
            <ProjectWeekly updates={updates} />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={badgeStyle("#C2410C", "var(--dropi-light)")}>🌱 Célula Growth</span>
                <span style={badgeStyle("#B45309", "#FEF3C7")}>🟡 Pausado — solapamiento con Webe</span>
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
                BackOffice Operación Líderes de Comunidad
              </h1>
              <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0", maxWidth: 760 }}>
                Herramienta de gestión para que el equipo interno de Dropi pueda abordar las actividades relacionadas con la operación de los líderes de comunidad.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Growth Product Manager</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>José Pineda</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", padding: "10px 16px", borderRadius: 10, textAlign: "right" }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>Pendiente de indicaciones</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: "#0F172A" }}>Nicolás Pérez</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Fase actual", value: "Pausado", sub: "por solapamiento con Webe", color: "#B45309" },
            { label: "Motivo de la pausa", value: "Webe", sub: "podría funcionar como la herramienta de gestión interna del segmento", color: "#7C3AED" },
            { label: "Pendiente", value: "Indicaciones", sub: "cómo abordar la operación, o documentar features a Nicolás Pérez", color: "#0E7C74" },
          ].map((k) => (
            <div key={k.label} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 18 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase" }}>{k.label}</div>
              <div style={{ fontSize: 24, fontWeight: 900, color: k.color, marginTop: 4 }}>{k.value}</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>

        {/* ── POCs de este proyecto ── */}
        {pocs.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 10 }}>
              🧩 POCs de este proyecto ({pocs.length})
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
              {pocs.map((p) => (
                <a
                  key={p.id}
                  href={p.project_code ? `/proyectos/${p.project_code.toLowerCase()}` : "#"}
                  style={{ textDecoration: "none", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, padding: "12px 14px" }}
                >
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>{p.project_code}</div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: "#0F172A", marginTop: 2 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 3 }}>{p.estado_interno ?? "Sin definir"}</div>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Estado narrativo ── */}
        <Callout tone="warning" title="🟡 En pausa por solapamiento con Webe (28 ago 2026)">
          Webe podría funcionar como la herramienta de gestión interna para operar el segmento de líderes de comunidad, por lo que construir un backoffice propio en paralelo podría duplicar esfuerzo. Se esperan indicaciones sobre cómo abordar esta operación, o si en su lugar conviene dejarle documentado a <strong>Nicolás Pérez</strong> los features que Webe debe garantizar para cerrar la brecha de experiencia del cliente de cara a la operación de todo el segmento de líderes de comunidad.
        </Callout>

        {/* ════════════════════════════════════════════════════════════
            ACCORDION — CONTEXTO COMPLETO
        ════════════════════════════════════════════════════════════ */}
        <div style={{ background: "#ffffff", border: "2px solid #7C3AED", borderRadius: 16, marginBottom: 32, overflow: "hidden", boxShadow: "0 4px 20px rgba(124,58,237,0.08)" }}>
          <button
            onClick={() => setDocOpen(!docOpen)}
            style={{ width: "100%", background: docOpen ? "linear-gradient(90deg,#F3E8FF 0%,#FAF5FF 100%)" : "#ffffff", border: "none", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer", textAlign: "left", borderBottom: docOpen ? "1px solid #E9D5FF" : "none", transition: "all 0.2s ease" }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: "#7C3AED", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                <FileText size={24} />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 18, fontWeight: 900, color: "#1E1B4B" }}>Contexto ampliado del proyecto</span>
                  <span style={badgeStyle("#7C3AED", "#F3E8FF")}>Fuente: nota de proyecto, agosto 2026</span>
                </div>
                <p style={{ fontSize: 13, color: "#475569", margin: "2px 0 0 0" }}>
                  Objetivo, motivo de la pausa, relación con Webe, y pendientes.
                </p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#7C3AED", background: "#fff", padding: "6px 12px", borderRadius: 8, border: "1px solid #E9D5FF" }}>
                {docOpen ? "Ocultar contexto" : "Ver contexto"}
              </span>
              {docOpen ? <ChevronUp size={20} color="#7C3AED" /> : <ChevronDown size={20} color="#7C3AED" />}
            </div>
          </button>

          {docOpen && (
            <div style={{ padding: 24 }}>
              <div style={{ background: "#FAFAFA", border: "1px solid #E2E8F0", borderRadius: 14, padding: 20 }}>

                {/* Tab nav */}
                <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8, marginBottom: 20, borderBottom: "1px solid #E2E8F0" }}>
                  {[
                    { id: "resumen", label: "🧠 Resumen & objetivo" },
                    { id: "relacion", label: "🔗 Relación con Webe" },
                    { id: "pendientes", label: "🗺️ Pendientes" },
                  ].map((t) => (
                    <button key={t.id} onClick={() => setTab(t.id)} style={{ background: tab === t.id ? "#7C3AED" : "#ffffff", color: tab === t.id ? "#ffffff" : "#475569", border: tab === t.id ? "1px solid #7C3AED" : "1px solid #CBD5E1", borderRadius: 8, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease" }}>
                      {t.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1 — RESUMEN & OBJETIVO */}
                {tab === "resumen" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><span>🧠 Resumen ejecutivo</span></h3>
                    <p style={pStyle}>
                      El proyecto busca construir una herramienta de gestión para que el equipo interno de Dropi pueda abordar las actividades relacionadas con la operación de los líderes de comunidad — no es una experiencia de cara al líder, sino una herramienta de backoffice para el equipo que opera ese segmento.
                    </p>

                    <h4 style={subHeadingStyle}>Por qué está en pausa</h4>
                    <p style={pStyle}>
                      El proyecto está pausado porque hay un fuerte solapamiento con Webe: esta plataforma podría funcionar como la herramienta de gestión interna para operar el segmento de líderes de comunidad. Construir un backoffice propio en paralelo, sin resolver esa superposición, podría duplicar esfuerzo.
                    </p>
                  </div>
                )}

                {/* TAB 2 — RELACIÓN CON WEBE */}
                {tab === "relacion" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><GitBranch size={16} /><span>Webe como posible herramienta de gestión interna</span></h3>
                    <p style={pStyle}>
                      A diferencia de GRO-001 (CRM para que el líder gestione su relación con cada afiliado) y de GRO-006 (Perfil de Líderes de Comunidad, de cara al propio líder), este proyecto es de cara al <strong>equipo interno de Dropi</strong>: busca darle a ese equipo las herramientas para operar el segmento completo de líderes de comunidad.
                    </p>
                    <p style={pStyle}>
                      Webe podría cubrir esa misma necesidad desde su propia plataforma. Por eso el proyecto no avanza hasta que exista claridad sobre si Webe puede asumir ese rol, y qué features debe garantizar para hacerlo.
                    </p>
                  </div>
                )}

                {/* TAB 3 — PENDIENTES */}
                {tab === "pendientes" && (
                  <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20 }}>
                    <h3 style={sectionHeadingStyle}><Users size={16} /><span>Pendientes</span></h3>
                    <ul style={ulStyle}>
                      <li>Recibir indicaciones sobre cómo abordar la operación interna del segmento de líderes de comunidad.</li>
                      <li>Definir si conviene dejarle documentado a <strong>Nicolás Pérez</strong> los features que Webe debe garantizar para cerrar la brecha de experiencia del cliente de cara a esta operación.</li>
                      <li>Confirmar si este proyecto se retoma como backoffice propio, o si su alcance queda absorbido por Webe.</li>
                    </ul>
                  </div>
                )}

              </div>
            </div>
          )}
        </div>

      </main>
      <HubFooter />
    </div>
  );
}
