"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import HubFooter from "@/components/HubFooter";
import HubHeader from "@/components/HubHeader";
import { type Item, Section } from "@/components/HomeSections";
import { SEMANAS, REGISTRY } from "@/app/weekly/data/index";

type Proyecto = {
  id: string; name: string; project_code: string | null;
  status: string | null; type: string | null; handoff_status: string | null;
  summary: string | null; business_area: string | null; prototype_url: string | null;
};
type Update = { id: string; week_date: string; title: string; content: string };

type Profile = { celula_id: string | null; is_super_admin: boolean };

type CelulaHome = {
  id: string; nombre: string; slug: string; lead: string | null; area: string | null;
  ve_hub_completo: boolean;
  proyectos: Proyecto[]; updates: Update[];
};

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
    url: p.prototype_url ?? `/proyectos/${p.project_code ? p.project_code.toLowerCase() : p.id}`,
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

export default function CelulaHomePage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const [celula, setCelula] = useState<CelulaHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [launchLens, setLaunchLens] = useState(false);
  const [form, setForm] = useState({ name: "", summary: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/celulas/${params.slug}`)
      .then(async (res) => {
        if (!res.ok) { setNotFound(true); return; }
        const data = await res.json();
        setCelula(data);
      })
      .finally(() => setLoading(false));

    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setProfile(data?.profile ?? null))
      .catch(() => setProfile(null));
  }, [params.slug]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const res = await fetch(`/api/celulas/${params.slug}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      setFormError(data.error ?? "No se pudo crear el proyecto.");
      return;
    }

    setCelula((prev) => prev ? { ...prev, proyectos: [...prev.proyectos, data] } : prev);
    setForm({ name: "", summary: "" });
    setShowForm(false);

    if (launchLens) {
      const code = data.project_code ? data.project_code.toLowerCase() : data.id;
      router.push(`/proyectos/${code}/discovery`);
    }
  }

  if (loading) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p></main>;
  if (notFound || !celula) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Célula no encontrada.</p></main>;

  const proyectos = celula.proyectos.filter((p) => p.type !== "POC").map(proyectoToItem);
  const poc = celula.proyectos.filter((p) => p.type === "POC").map(proyectoToItem);
  const canCreate = !!profile && (profile.is_super_admin || profile.celula_id === celula.id);

  // "Updates" mezcla los registros de celula_updates con el historial del
  // Weekly PM de esta célula (si tiene alguno) — mismo look de tarjeta,
  // ordenado por fecha descendente.
  const semanasCelula = SEMANAS.filter((s) => s.celula === celula.slug && REGISTRY[s.date]);
  const updateEntries = [
    ...celula.updates.map((u) => ({ item: updateToItem(u), sortKey: u.week_date })),
    ...semanasCelula.map((s) => ({ item: weeklyToItem(s), sortKey: s.date.slice(0, 10) })),
  ].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const updates = updateEntries.map((e) => e.item);

  return (
    <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
      <HubHeader
        title={celula.nombre}
        subtitle={celula.lead ? `Lead: ${celula.lead}` : "Home de célula · Darwin"}
        currentSlug={celula.slug}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ marginBottom: 56 }}>
          <Section title="Updates" items={updates} ctaLabel="Ver →" />
          {updates.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay updates registrados.</p>
          )}
        </div>

        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>
              Proyectos
            </p>
            {canCreate && (
              <div style={{ display: "flex", gap: 8 }}>
                {showForm ? (
                  <button
                    onClick={() => { setShowForm(false); setFormError(null); }}
                    style={{
                      fontSize: 12, fontWeight: 700, color: "var(--muted)",
                      background: "none", border: "1px solid var(--border)", borderRadius: 8,
                      padding: "6px 12px", cursor: "pointer",
                    }}
                  >
                    Cancelar
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => { setShowForm(true); setLaunchLens(false); setFormError(null); }}
                      style={{
                        fontSize: 12, fontWeight: 700, color: "var(--dropi)",
                        background: "none", border: "1px solid var(--border)", borderRadius: 8,
                        padding: "6px 12px", cursor: "pointer",
                      }}
                    >
                      + Proyecto vacío
                    </button>
                    <button
                      onClick={() => { setShowForm(true); setLaunchLens(true); setFormError(null); }}
                      style={{
                        fontSize: 12, fontWeight: 700, color: "#fff",
                        background: "var(--dropi)", border: "none", borderRadius: 8,
                        padding: "6px 12px", cursor: "pointer",
                      }}
                    >
                      🚀 Iniciar con Lente B=MAP
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {showForm && (
            <form
              onSubmit={handleCreate}
              style={{
                border: "1px solid var(--border)", borderRadius: 12, padding: 20,
                marginBottom: 20, display: "flex", flexDirection: "column", gap: 12,
                background: "var(--card)",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>Nombre</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  placeholder="Nombre del proyecto"
                  style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--fg)" }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>Resumen</label>
                <textarea
                  value={form.summary}
                  onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                  required
                  rows={3}
                  placeholder="De qué se trata este proyecto"
                  style={{ fontSize: 13, padding: "8px 10px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)", color: "var(--fg)", fontFamily: "inherit", resize: "vertical" }}
                />
              </div>
              {formError && <p style={{ fontSize: 12, color: "#DC2626", margin: 0 }}>{formError}</p>}
              <button
                type="submit"
                disabled={submitting}
                style={{
                  fontSize: 13, fontWeight: 700, color: "#fff", background: "var(--dropi)",
                  border: "none", borderRadius: 8, padding: "10px 16px", cursor: submitting ? "default" : "pointer",
                  opacity: submitting ? 0.7 : 1, alignSelf: "flex-start",
                }}
              >
                {submitting ? "Creando…" : launchLens ? "Crear e Iniciar Lente B=MAP 🚀" : "Crear proyecto"}
              </button>
            </form>
          )}

          <Section title="" items={proyectos} ctaLabel="Ver proyecto →" />
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
