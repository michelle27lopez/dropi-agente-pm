"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import HubFooter from "@/components/HubFooter";
import { type Item, Section } from "@/components/HomeSections";
import { SEMANAS, REGISTRY } from "@/app/weekly/data/index";
import { previewUpdateContent } from "@/lib/update-preview";

// Updates por célula (2026-08-17, Jaime) — antes vivía embebido en la home de
// célula, mezclado con el grid de proyectos. Ahora es su propia parada en el
// sidebar, célula-scoped igual que Proyectos/Data/Following. La home de
// célula se queda con un teaser + link acá. Las métricas de Sellers viven en
// la home ("Mi día" de la célula), no acá — mismo criterio que las secciones
// propias de Logística/Backoffice, que se mueven tal cual sin tocar su
// lógica de datos.
const UpdatesLogistica = dynamic(() => import("../_components/UpdatesLogistica"), { ssr: false });
const UpdatesBackoffice = dynamic(() => import("../_components/UpdatesBackoffice"), { ssr: false });

type Update = { id: string; week_date: string; title: string; content: string; url: string | null };
type CelulaHome = { id: string; nombre: string; slug: string; updates: Update[] };

function truncate(text: string | undefined | null, max: number) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max - 1).trimEnd() + "…" : text;
}

function updateToItem(u: Update): Item {
  return {
    key: u.id,
    name: u.title,
    description: previewUpdateContent(u.content),
    url: u.url ?? undefined,
    tag: u.week_date,
    color: "#6366F1",
    icon: "📋",
  };
}

function weeklyToItem(semana: { date: string; label: string }): Item {
  const snapshot = REGISTRY[semana.date];
  return {
    key: `weekly-${semana.date}`,
    name: "Weekly PM",
    description: truncate(snapshot.subtitle, 160),
    url: `/weekly?week=${semana.date}`,
    tag: semana.date.slice(0, 10),
    color: "#F77F00",
    icon: "📅",
  };
}

export default function UpdatesPorCelulaPage() {
  const params = useParams<{ slug: string }>();
  const [celula, setCelula] = useState<CelulaHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [openUpdate, setOpenUpdate] = useState<Update | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/celulas/${params.slug}`)
      .then((res) => res.json())
      .then((data) => setCelula(data))
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p></main>;
  if (!celula) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Célula no encontrada.</p></main>;

  const isLogistica = params.slug === "logistica";
  const isBackoffice = params.slug === "backoffice";

  const semanasCelula = SEMANAS.filter((s) => s.celula === celula.slug && REGISTRY[s.date]);
  const updateEntries = [
    ...celula.updates.map((u) => ({ item: updateToItem(u), sortKey: u.week_date })),
    ...semanasCelula.map((s) => ({ item: weeklyToItem(s), sortKey: s.date.slice(0, 10) })),
  ].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const updates = updateEntries.map((e) => e.item);
  const updatesById = new Map(celula.updates.map((u) => [u.id, u]));

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div className="gnav-page" style={{ flex: 1, maxWidth: 900, margin: "0 auto", width: "100%" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>
          Updates <span style={{ color: "var(--muted)", fontWeight: 600 }}>· {celula.nombre}</span>
        </h1>

        <div style={{ marginTop: 32 }}>
          {isLogistica && (
            <UpdatesLogistica
              extra={updates}
              onItemClick={(item) => {
                const u = updatesById.get(item.key);
                if (u) setOpenUpdate(u);
              }}
            />
          )}

          {isBackoffice && (
            <UpdatesBackoffice
              extra={updates}
              onItemClick={(item) => {
                const u = updatesById.get(item.key);
                if (u) setOpenUpdate(u);
              }}
            />
          )}

          {!isLogistica && !isBackoffice && (
            <Section
              title="Updates"
              items={updates}
              ctaLabel="Ver →"
              onItemClick={(item) => {
                const u = updatesById.get(item.key);
                if (u) setOpenUpdate(u);
              }}
            />
          )}

          {/* Solo para las células que se renderizan con <Section>. Logística y
              Backoffice traen su propio contenido —que no sale de `updates`— y
              su propio mensaje de vacío: sin esta guarda, la pantalla mostraba
              el weekly de Logística Y "aún no hay updates" debajo. */}
          {!isLogistica && !isBackoffice && updates.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay updates registrados.</p>
          )}
        </div>
      </div>
      <HubFooter />

      {openUpdate && (
        <div
          onClick={() => setOpenUpdate(null)}
          style={{
            position: "fixed", inset: 0, background: "rgba(10,22,40,0.55)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 24, zIndex: 50,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "var(--card)", borderRadius: 16, maxWidth: 640, width: "100%",
              maxHeight: "80vh", overflowY: "auto", padding: "28px 28px 24px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--fg)", lineHeight: 1.3, margin: 0 }}>{openUpdate.title}</h2>
              <button
                onClick={() => setOpenUpdate(null)}
                style={{ flexShrink: 0, background: "none", border: "none", fontSize: 20, color: "var(--muted)", cursor: "pointer", lineHeight: 1, padding: 4 }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 0, marginBottom: 18 }}>{openUpdate.week_date}</p>
            <div style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.7 }}>
              {openUpdate.content.split("\n").map((line, i) => {
                const trimmed = line.trim();
                if (trimmed === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid var(--border)", margin: "16px 0" }} />;
                if (trimmed === "") return <div key={i} style={{ height: 6 }} />;
                if (trimmed.startsWith("## ")) return <h3 key={i} style={{ fontSize: 15, fontWeight: 800, margin: "0 0 8px" }}>{trimmed.slice(3)}</h3>;
                return <p key={i} style={{ margin: "0 0 4px", whiteSpace: "pre-wrap" }}>{line}</p>;
              })}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
