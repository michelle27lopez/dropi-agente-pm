"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HubFooter from "@/components/HubFooter";

type Miembro = { id: string; email: string; nombre: string | null; is_super_admin: boolean };
type Proyecto = {
  id: string; name: string; project_code: string | null;
  status: string | null; type: string | null; handoff_status: string | null;
};
type Update = { id: string; week_date: string; title: string; content: string };
type RoadmapItem = {
  id: string; title: string; description: string | null;
  quarter: string | null; status: string; target_date: string | null;
};

type CelulaHome = {
  id: string; nombre: string; slug: string; lead: string | null; area: string | null;
  ve_hub_completo: boolean;
  miembros: Miembro[]; proyectos: Proyecto[]; updates: Update[]; roadmap: RoadmapItem[];
};

type CelulaLink = { nombre: string; slug: string };

const TYPE_COLOR: Record<string, string> = {
  Idea: "#94A3B8", Oportunidad: "#0EA5E9", POC: "#7C3AED", Proyecto: "#1A6B52",
};
const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B", "Listo para handoff": "#0EA5E9", "Handoff hecho": "#22C55E",
};
const ROADMAP_COLOR: Record<string, string> = {
  Planeado: "#94A3B8", "En curso": "#0EA5E9", Hecho: "#22C55E", Movido: "#F59E0B",
};

function Badge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: color + "18", border: `1px solid ${color}33`,
      borderRadius: 6, padding: "2px 8px", whiteSpace: "nowrap",
    }}>
      {label}
    </span>
  );
}

function Section({ title, count, children, emptyLabel }: {
  title: string; count: number; children: React.ReactNode; emptyLabel: string;
}) {
  return (
    <div style={{ marginBottom: 32 }}>
      <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
        {title} ({count})
      </p>
      {count === 0 ? (
        <p style={{ fontSize: 13, color: "var(--muted)" }}>{emptyLabel}</p>
      ) : children}
    </div>
  );
}

export default function CelulaHomePage() {
  const params = useParams<{ slug: string }>();
  const [celula, setCelula] = useState<CelulaHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [otrasCelulas, setOtrasCelulas] = useState<CelulaLink[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
    fetch(`/api/celulas/${params.slug}`)
      .then(async (res) => {
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setCelula(data);
        if (data.ve_hub_completo) {
          fetch("/api/celulas")
            .then((r) => r.json())
            .then((celulas) => {
              if (Array.isArray(celulas)) {
                setOtrasCelulas(celulas.map((c) => ({ nombre: c.nombre, slug: c.slug })));
              }
            });
        }
      })
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p></main>;
  if (notFound || !celula) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Célula no encontrada.</p></main>;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "20px 32px", display: "flex", alignItems: "center", gap: 12,
      }}>
        <img src="/darwin-logo.png" alt="Darwin" width={36} height={36} style={{ display: "block", borderRadius: 8 }} />
        {celula.ve_hub_completo ? (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", cursor: "pointer", padding: 0, textAlign: "left" }}
            >
              <div>
                <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2, display: "flex", alignItems: "center", gap: 6 }}>
                  {celula.nombre} <span style={{ fontSize: 11, color: "var(--muted)" }}>▾</span>
                </h1>
                <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                  {celula.lead ? `Lead: ${celula.lead}` : "Home de célula · Darwin"}
                </p>
              </div>
            </button>
            {menuOpen && (
              <div style={{
                position: "absolute", top: "100%", left: 0, marginTop: 8,
                background: "#fff", border: "1px solid var(--border)", borderRadius: 10,
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)", minWidth: 200, zIndex: 10, overflow: "hidden",
              }}>
                {otrasCelulas.map((c) => (
                  <a
                    key={c.slug}
                    href={c.slug === "suppliers" ? "/" : `/celula/${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    style={{
                      display: "block", padding: "10px 14px", fontSize: 13,
                      color: "var(--fg)", textDecoration: "none",
                      background: c.slug === celula.slug ? "var(--bg)" : "transparent",
                      fontWeight: c.slug === celula.slug ? 700 : 500,
                    }}
                  >
                    🏠 {c.nombre}
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              {celula.nombre}
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              {celula.lead ? `Lead: ${celula.lead}` : "Home de célula · Darwin"}
            </p>
          </div>
        )}
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        <Section title="Proyectos" count={celula.proyectos.length} emptyLabel="Aún no hay proyectos cargados para esta célula.">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {celula.proyectos.map((p) => (
              <div key={p.id} style={{
                display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                fontSize: 13, color: "var(--fg)", padding: "10px 14px",
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
              }}>
                <span style={{ fontWeight: 600 }}>{p.name}</span>
                {p.project_code && <span style={{ color: "var(--muted)" }}>{p.project_code}</span>}
                {p.type && <Badge label={p.type} color={TYPE_COLOR[p.type] ?? "#94A3B8"} />}
                {p.handoff_status && <Badge label={p.handoff_status} color={HANDOFF_COLOR[p.handoff_status] ?? "#94A3B8"} />}
              </div>
            ))}
          </div>
        </Section>

        <Section title="Updates semanales" count={celula.updates.length} emptyLabel="Aún no hay updates registrados.">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {celula.updates.map((u) => (
              <div key={u.id} style={{
                padding: "12px 16px", background: "var(--card)",
                border: "1px solid var(--border)", borderRadius: 8,
              }}>
                <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{u.week_date}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--fg)" }}>{u.title}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="Roadmap" count={celula.roadmap.length} emptyLabel="Aún no hay roadmap cargado.">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {celula.roadmap.map((r) => (
              <div key={r.id} style={{
                display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap",
                fontSize: 13, color: "var(--fg)", padding: "10px 14px",
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8,
              }}>
                <span style={{ fontWeight: 600 }}>{r.title}</span>
                {r.quarter && <span style={{ color: "var(--muted)" }}>{r.quarter}</span>}
                <Badge label={r.status} color={ROADMAP_COLOR[r.status] ?? "#94A3B8"} />
              </div>
            ))}
          </div>
        </Section>

        <Section title="Personas" count={celula.miembros.length} emptyLabel="Nadie registrado aún en esta célula.">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {celula.miembros.map((m) => (
              <span key={m.id} style={{
                fontSize: 12, color: "var(--fg)", background: "var(--bg)",
                border: "1px solid var(--border)", borderRadius: 8, padding: "4px 10px",
              }}>
                {m.nombre ?? m.email}
              </span>
            ))}
          </div>
        </Section>
      </div>
      </div>
      <HubFooter />
    </main>
  );
}
