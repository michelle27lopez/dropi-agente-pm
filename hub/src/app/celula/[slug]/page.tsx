"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HubFooter from "@/components/HubFooter";
import { type Item, Section } from "@/components/HomeSections";

type Proyecto = {
  id: string; name: string; project_code: string | null;
  status: string | null; type: string | null; handoff_status: string | null;
  summary: string | null; business_area: string | null; prototype_url: string | null;
};
type Update = { id: string; week_date: string; title: string; content: string };

type CelulaHome = {
  id: string; nombre: string; slug: string; lead: string | null; area: string | null;
  ve_hub_completo: boolean;
  proyectos: Proyecto[]; updates: Update[];
};

type CelulaLink = { nombre: string; slug: string };

const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B", "Listo para handoff": "#0EA5E9", "Handoff hecho": "#22C55E",
};
const TYPE_ICON: Record<string, string> = {
  Idea: "💡", Oportunidad: "🔭", POC: "🧪", Proyecto: "🚀",
};

function truncate(text: string, max: number) {
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

function proyectoToItem(p: Proyecto): Item {
  return {
    key: p.id,
    name: p.name,
    description: truncate(p.summary ?? p.business_area ?? "Sin descripción aún.", 160),
    url: p.prototype_url ?? undefined,
    tag: p.project_code ?? p.handoff_status ?? "Sin código",
    color: (p.handoff_status && HANDOFF_COLOR[p.handoff_status]) ?? "#94A3B8",
    icon: (p.type && TYPE_ICON[p.type]) ?? "📁",
  };
}

function updateToItem(u: Update): Item {
  return {
    key: u.id,
    name: u.title,
    description: truncate(u.content, 160),
    tag: u.week_date,
    color: "#6366F1",
    icon: "📋",
  };
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

  const updates = celula.updates.map(updateToItem);
  const proyectos = celula.proyectos.filter((p) => p.type !== "POC").map(proyectoToItem);
  const poc = celula.proyectos.filter((p) => p.type === "POC").map(proyectoToItem);

  return (
    <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
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

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 56 }}>
          <Section title="Updates" items={updates} ctaLabel="Ver →" />
          {updates.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay updates registrados.</p>
          )}
        </div>

        <div style={{ marginBottom: 56 }}>
          <Section title="Proyectos" items={proyectos} ctaLabel="Ver proyecto →" />
          {proyectos.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay proyectos cargados para esta célula.</p>
          )}
        </div>

        <div>
          <Section title="Pruebas de concepto" items={poc} ctaLabel="Ver proyecto →" />
          {poc.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay POCs cargadas para esta célula.</p>
          )}
        </div>
      </div>
      </div>
      <HubFooter />
    </main>
  );
}
