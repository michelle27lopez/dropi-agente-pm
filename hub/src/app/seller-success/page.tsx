"use client";

import { useEffect, useState } from "react";
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
    url: `/proyectos/${p.project_code || p.id}`,
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

type MetricsStats = {
  totalSellers: number;
  activationCount: number;
  activationRate: number;
  activeCount: number;
  activeRate: number;
  bounceCount: number;
  bounceRate: number;
  nsmCurrent: number;
  okrTarget: number;
  percentageToOkr: number;
  gapToOkr: number;
};
type FunnelStep = { step: string; count: number; pct: number; color: string };
type SellersMetrics = {
  source: string;
  stats: MetricsStats;
  funnel: FunnelStep[];
};

export default function SellerSuccessHub() {
  const [celula, setCelula] = useState<CelulaHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", summary: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SellersMetrics | null>(null);

  useEffect(() => {
    // Apuntamos al slug real en la base de datos de tu célula (sellers)
    fetch(`/api/celulas/sellers`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        setCelula(data);
      })
      .finally(() => setLoading(false));

    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => setProfile(data?.profile ?? null))
      .catch(() => setProfile(null));

    // Consumir métricas dinámicas cruzadas con Userpilot
    fetch("/api/metrics/sellers")
      .then((res) => res.json())
      .then((data) => setMetrics(data))
      .catch((err) => console.error("Error cargando métricas de Sellers:", err));
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const res = await fetch(`/api/celulas/sellers`, {
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
  }

  if (loading) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Conectando a Supabase…</p></main>;
  if (!celula) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Error al cargar los datos reales.</p></main>;

  // No hace falta filtrar demos antiguas porque ya estás leyendo tu propia célula 'sellers'
  const proyectos = celula.proyectos.filter(p => p.type !== "POC").map(proyectoToItem);
  const poc = celula.proyectos.filter(p => p.type === "POC").map(proyectoToItem);
  
  // Como este es tu entorno aislado, tienes poder de creación siempre
  const canCreate = true;

  const semanasCelula = SEMANAS.filter((s) => s.celula === "sellers" && REGISTRY[s.date]);
  const updateEntries = [
    ...celula.updates.map((u) => ({ item: updateToItem(u), sortKey: u.week_date })),
    ...semanasCelula.map((s) => ({ item: weeklyToItem(s), sortKey: s.date.slice(0, 10) })),
  ].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const updates = updateEntries.map((e) => e.item);

  return (
    <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
      <HubHeader
        title="Seller Success"
        subtitle="Dashboard Oficial Conectado a DB"
        currentSlug="seller-success"
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        
        <div style={{ marginBottom: 40, borderBottom: "1px solid var(--border)", paddingBottom: 24 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
              Tu Dashboard Vivo
            </h2>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
              Este entorno está conectado 100% a la base de datos de Supabase. Todo lo que crees aquí se guardará bajo tu célula, pero la vista filtra automáticamente las demos antiguas para mantener tu espacio limpio.
            </p>
        </div>

        {/* OKR & NSM Progress Section */}
        {metrics && (
          <div style={{
            background: "linear-gradient(135deg, #111827 0%, #1f2937 55%, #c2410c 100%)",
            borderRadius: 16, padding: "24px 32px", marginBottom: 36, color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.15)", padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  OKR 1.1 · Escalar Volumen de Ventas
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", margin: "8px 0 0" }}>
                  Órdenes de Sellers Activos (NSM)
                </h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 24, fontWeight: 900, color: "#F77F00" }}>{metrics.stats.percentageToOkr}%</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}> de la meta</span>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{ height: 8, background: "rgba(255,255,255,0.16)", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ height: "100%", width: `${metrics.stats.percentageToOkr}%`, background: "linear-gradient(90deg, #F77F00 0%, #ffaa44 100%)", borderRadius: 999 }} />
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              <span>Actual: <strong>{(metrics.stats.nsmCurrent / 1000000).toFixed(1)}M/mes</strong></span>
              <span>Meta: <strong>{(metrics.stats.okrTarget / 1000000).toFixed(1)}M/mes</strong></span>
              <span>Brecha: <strong>{(metrics.stats.gapToOkr / 1000000).toFixed(1)}M/mes</strong></span>
            </div>
          </div>
        )}

        {/* Live Metrics Grid */}
        {metrics && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 36 }}>
            {[
              { label: "Sellers Registrados", value: metrics.stats.totalSellers.toLocaleString(), sub: "Sincronizados de Userpilot", color: "#6366F1", icon: "👥" },
              { label: "Tasa de Activación", value: `${metrics.stats.activationRate}%`, sub: "Sellers con ≥1 orden", color: "#EC4899", icon: "⚡" },
              { label: "Sellers Activos (30d)", value: `${metrics.stats.activeRate}%`, sub: "Actividad constante en plataforma", color: "#22C55E", icon: "🎯" },
              { label: "Tasa de Rebote (Bounce)", value: `${metrics.stats.bounceRate}%`, sub: "Sellers con ≤1 sesión web", color: "#EF4444", icon: "🚪" }
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "#fff", border: "1px solid var(--border)",
                  borderRadius: 14, padding: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between"
                }}
              >
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em" }}>
                      {m.label}
                    </span>
                    <span style={{ fontSize: 16 }}>{m.icon}</span>
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: 4 }}>
                    {m.value}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>{m.sub}</div>
                  <div style={{ height: 4, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: m.value.includes("%") ? m.value : "100%", background: m.color, borderRadius: 999 }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conversion Funnel Section */}
        {metrics && (
          <div style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: 16, padding: 24, marginBottom: 40,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
          }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
              Embudo de Conversión de Sellers (UserPilot → DB)
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {metrics.funnel.map((step, idx) => (
                <div key={step.step} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "var(--muted)", width: 20 }}>
                    {idx + 1}
                  </span>
                  <div style={{
                    flex: 1, background: "#F8FAFC", border: "1px solid var(--border)",
                    borderRadius: 10, padding: "12px 16px", display: "flex",
                    justifyContent: "space-between", alignItems: "center",
                    position: "relative", overflow: "hidden"
                  }}>
                    <div style={{
                      position: "absolute", top: 0, left: 0, bottom: 0,
                      width: `${step.pct}%`, background: `${step.color}0c`,
                      zIndex: 0
                    }} />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", zIndex: 1 }}>
                      {step.step}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
                      <span style={{ fontSize: 13, fontWeight: 800, color: "var(--fg)" }}>
                        {step.count.toLocaleString()}
                      </span>
                      <span style={{
                        fontSize: 10, fontWeight: 700, background: `${step.color}18`,
                        color: step.color, padding: "2px 8px", borderRadius: 20
                      }}>
                        {step.pct}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 56 }}>
          <Section title="Updates Reales" items={updates} ctaLabel="Ver →" />
          {updates.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay updates registrados en la DB.</p>
          )}
        </div>

        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>
              Proyectos en DB
            </p>
            {canCreate && (
              <button
                onClick={() => { setShowForm((v) => !v); setFormError(null); }}
                style={{
                  fontSize: 12, fontWeight: 700, color: "var(--dropi)",
                  background: "none", border: "1px solid var(--border)", borderRadius: 8,
                  padding: "6px 12px", cursor: "pointer",
                }}
              >
                {showForm ? "Cancelar" : "+ Nuevo proyecto"}
              </button>
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
                {submitting ? "Creando…" : "Guardar en Supabase"}
              </button>
            </form>
          )}

          <Section title="" items={proyectos} ctaLabel="Ver proyecto →" />
          {proyectos.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay proyectos reales cargados en tu DB.</p>
          )}
        </div>

        <div>
          <Section title="Pruebas de concepto" items={poc} ctaLabel="Ver proyecto →" />
        </div>
      </div>
      </div>
      <HubFooter />
    </main>
  );
}
