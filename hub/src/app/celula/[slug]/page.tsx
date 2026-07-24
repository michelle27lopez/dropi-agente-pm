"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HubFooter from "@/components/HubFooter";
import HubHeader from "@/components/HubHeader";
import { type Item, Section } from "@/components/HomeSections";
import { SEMANAS, REGISTRY } from "@/app/weekly/data/index";
import { isMiDiaOwner } from "@/lib/sprint-access";
import HomeDashboard from "@/app/proyectos/mi-dia/HomeDashboard";
import ProjectSidebar from "@/app/proyectos/mi-dia/ProjectSidebar";

type Proyecto = {
  id: string; name: string; project_code: string | null;
  status: string | null; type: string | null; handoff_status: string | null;
  summary: string | null; business_area: string | null; prototype_url: string | null;
};
type Update = { id: string; week_date: string; title: string; content: string };

type Profile = { celula_id: string | null; is_super_admin: boolean; email: string | null };

type CelulaHome = {
  id: string; nombre: string; slug: string; lead: string | null; area: string | null;
  ve_hub_completo: boolean;
  proyectos: Proyecto[]; updates: Update[];
};

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
  survivalRate?: number;
  ttvNetoMedian?: number;
  countries?: Record<string, any>;
};
type FunnelStep = { step: string; count: number; pct: number; color: string };
type JiraBug = { key: string; summary: string; status: string; assignee: string; url: string };
type SprintTask = { key: string; summary: string; status: string; priority: string; url: string; sections: any[] };
type CrmStats = { totalOpps: number; stages: Record<string, number> };
type SellersMetrics = {
  source: string;
  stats: MetricsStats;
  funnel: FunnelStep[];
  jira: { totalBugs: number; pendingBugs: number; completedBugs: number; bugsList: JiraBug[] };
  sprint: { totalTasks: number; completedTasks: number; tasksList: SprintTask[] };
  crm: CrmStats;
};

const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B", "Listo para handoff": "#0EA5E9", "Handoff hecho": "#22C55E",
};
const TYPE_ICON: Record<string, string> = {
  Idea: "💡", Oportunidad: "🔭", POC: "🧪", Proyecto: "🚀",
};

function truncate(text: string | undefined | null, max: number) {
  if (!text) return "";
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
  const [celula, setCelula] = useState<CelulaHome | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", summary: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<SellersMetrics | null>(null);
  const [openUpdate, setOpenUpdate] = useState<Update | null>(null);
  const [selectedCountry, setSelectedCountry] = useState("global");

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

    // Si la célula es de Sellers, cargamos sus métricas cruzadas en vivo
    if (params.slug === "sellers") {
      fetch("/api/metrics/sellers")
        .then((res) => res.json())
        .then((data) => setMetrics(data))
        .catch((err) => console.error("Error cargando métricas de Sellers:", err));
    }
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
  }

  if (loading) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p></main>;
  if (notFound || !celula) return <main style={{ padding: 48 }}><p style={{ fontSize: 13, color: "var(--muted)" }}>Célula no encontrada.</p></main>;

  const proyectos = celula.proyectos.filter((p) => p.type !== "POC").map(proyectoToItem);
  const poc = celula.proyectos.filter((p) => p.type === "POC").map(proyectoToItem);
  const canCreate = !!profile && (profile.is_super_admin || profile.celula_id === celula.id);

  // Home privada: solo para MI_DIA_OWNER_EMAIL, reemplaza el body estándar de
  // célula por el dashboard de "mi día" — ver [[project_darwin_pd_dashboard]].
  if (isMiDiaOwner(profile?.email)) {
    return (
      <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, display: "flex", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <HubHeader title={celula.nombre} subtitle="Tu día · Darwin" currentSlug={celula.slug} />
            <div style={{ display: "flex", alignItems: "flex-start" }}>
              <ProjectSidebar allProjects={proyectos} allPoc={poc} />
              <div style={{ flex: 1, minWidth: 0, maxWidth: 900, padding: "48px 32px" }}>
                <HomeDashboard />
              </div>
            </div>
          </div>
        </div>
        <HubFooter />
      </main>
    );
  }

  // "Updates" mezcla los registros de celula_updates con el historial del
  // Weekly PM de esta célula (si tiene alguno) — mismo look de tarjeta,
  // ordenado por fecha descendente.
  const semanasCelula = SEMANAS.filter((s) => s.celula === celula.slug && REGISTRY[s.date]);
  const updateEntries = [
    ...celula.updates.map((u) => ({ item: updateToItem(u), sortKey: u.week_date })),
    ...semanasCelula.map((s) => ({ item: weeklyToItem(s), sortKey: s.date.slice(0, 10) })),
  ].sort((a, b) => b.sortKey.localeCompare(a.sortKey));
  const updates = updateEntries.map((e) => e.item);
  const updatesById = new Map(celula.updates.map((u) => [u.id, u]));

  const isSellers = params.slug === "sellers";

  // Get active country stats
  const activeStats = (metrics?.stats?.countries as any)?.[selectedCountry] || metrics?.stats;
  const activeFunnel = activeStats?.funnel || metrics?.funnel || [];

  const sellersCss = `
    .glass-card {
      background: rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.24);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .glass-card:hover {
      transform: translateY(-2px);
      border-color: rgba(247, 127, 0, 0.4);
      box-shadow: 0 12px 40px rgba(247, 127, 0, 0.08);
    }
    .neon-text-orange {
      color: #F77F00;
      text-shadow: 0 0 10px rgba(247, 127, 0, 0.3);
    }
    .country-tab {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      color: rgba(255,255,255,0.6);
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .country-tab:hover {
      color: #fff;
      background: rgba(255,255,255,0.08);
    }
    .country-tab.active {
      background: linear-gradient(90deg, #F77F00 0%, #ffaa44 100%);
      border-color: transparent;
      color: #fff;
      box-shadow: 0 0 15px rgba(247, 127, 0, 0.35);
    }
    .glow-border {
      position: relative;
    }
    .glow-border::after {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 16px;
      padding: 1px;
      background: linear-gradient(135deg, rgba(247,127,0,0.5), transparent, rgba(99,102,241,0.5));
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
      pointer-events: none;
    }
  `;

  if (isSellers) {
    const totalSellers = activeStats?.totalSellers ?? 0;
    const activationRate = activeStats?.activationRate ?? 0;
    const activeRate = activeStats?.activeRate ?? 0;
    const bounceRate = activeStats?.bounceRate ?? 0;
    const survivalRate = activeStats?.survivalRate ?? 0;
    const ttvNetoMedian = activeStats?.ttvNetoMedian ?? 0;
    const nsmCurrent = activeStats?.nsmCurrent ?? 0;
    const okrTarget = activeStats?.okrTarget ?? 0;
    const percentageToOkr = activeStats?.percentageToOkr ?? 0;
    const gapToOkr = activeStats?.gapToOkr ?? 0;

    return (
      <main style={{ minHeight: "100vh", padding: "0", background: "radial-gradient(120% 90% at 50% -10%, #0c1020 0%, #030712 100%)", color: "#f1f5f9", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
        <style dangerouslySetInnerHTML={{ __html: sellersCss }} />
        
        {/* Header Section */}
        <div style={{ position: "relative", overflow: "hidden", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(3,7,18,0.4)" }}>
          <div className="login-aurora" style={{ opacity: 0.4 }} />
          <HubHeader
            title={celula.nombre}
            subtitle={celula.lead ? `Lead: ${celula.lead} · Control Tower PM OS` : "Control Tower de Célula · Darwin"}
            currentSlug={celula.slug}
          />
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px", width: "100%", flex: 1 }}>
          
          {/* Country Filter Tab Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28, background: "rgba(255,255,255,0.02)", padding: 6, borderRadius: 12, border: "1px solid rgba(255,255,255,0.05)" }}>
            {[
              { key: "global", label: "🌍 Global" },
              { key: "CO", label: "🇨🇴 Colombia" },
              { key: "EC", label: "🇪🇨 Ecuador" },
              { key: "CL", label: "🇨🇱 Chile" },
              { key: "MX", label: "🇲🇽 México" },
              { key: "AR", label: "🇦🇷 Argentina" }
            ].map((country) => (
              <button
                key={country.key}
                onClick={() => setSelectedCountry(country.key)}
                className={`country-tab ${selectedCountry === country.key ? "active" : ""}`}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  border: "1px solid rgba(255,255,255,0.05)",
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                {country.label}
              </button>
            ))}
          </div>

          {/* OKR Progress Card */}
          {metrics && (
            <div className="glow-border" style={{
              background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(3, 7, 18, 0.9) 100%)",
              borderRadius: 16, padding: "28px 32px", marginBottom: 24, color: "#fff",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 850, background: "rgba(247, 127, 0, 0.15)", color: "#F77F00", border: "1px solid rgba(247, 127, 0, 0.3)", padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    OKR 1.1 · ESCALAR VOLUMEN DE VENTAS
                  </span>
                  <h3 style={{ fontSize: 19, fontWeight: 900, letterSpacing: "-0.02em", margin: "8px 0 0" }}>
                    Órdenes de Sellers Activos (NSM)
                  </h3>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span className="neon-text-orange" style={{ fontSize: 28, fontWeight: 900 }}>{percentageToOkr}%</span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.5)" }}> de la meta</span>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div style={{ height: 10, background: "rgba(255,255,255,0.08)", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
                <div style={{ height: "100%", width: `${percentageToOkr}%`, background: "linear-gradient(90deg, #F77F00 0%, #ffaa44 100%)", borderRadius: 999, boxShadow: "0 0 10px rgba(247, 127, 0, 0.5)" }} />
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>
                <span>Actual: <strong style={{ color: "#fff" }}>{(nsmCurrent / 1000000).toFixed(2)}M/mes</strong></span>
                <span>Meta: <strong style={{ color: "#fff" }}>{(okrTarget / 1000000).toFixed(2)}M/mes</strong></span>
                <span>Brecha: <strong style={{ color: "#fff" }}>{(gapToOkr / 1000000).toFixed(2)}M/mes</strong></span>
              </div>
            </div>
          )}

          {/* Metrics Grid */}
          {metrics && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16, marginBottom: 28 }}>
              {[
                { label: "Sellers Registrados", value: totalSellers.toLocaleString(), sub: "Total histórico en cohorte", color: "#6366F1", icon: "👥", sparkline: "M0,25 Q15,10 30,20 T60,5 T90,15 T100,2" },
                { label: "Tasa de Activación", value: `${activationRate}%`, sub: "Sellers con ≥1 orden creada", color: "#EC4899", icon: "⚡", sparkline: "M0,20 Q15,25 30,12 T60,28 T90,5 T100,8" },
                { label: "Sellers Activos (30d)", value: `${activeRate}%`, sub: "Con actividad constante", color: "#22C55E", icon: "🎯", sparkline: "M0,15 Q15,5 30,18 T60,8 T90,25 T100,3" },
                { label: "Tasa de Rebote (Bounce)", value: `${bounceRate}%`, sub: "Sellers con ≤1 sesión web", color: "#EF4444", icon: "🚪", sparkline: "M0,5 Q15,22 30,10 T60,25 T90,12 T100,28" },
                { label: "Supervivencia (30d)", value: `${survivalRate}%`, sub: "Sellers con ≥1 orden adicional", color: "#8B5CF6", icon: "🌱", sparkline: "M0,22 Q15,12 30,15 T60,5 T90,18 T100,4" },
                { label: "TTV Neto (Mediana)", value: `${ttvNetoMedian} días`, sub: "Registro hasta entrega exitosa", color: "#F59E0B", icon: "⏱️", sparkline: "M0,10 Q15,28 30,14 T60,22 T90,5 T100,12" }
              ].map((m) => (
                <div key={m.label} className="glass-card" style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                        {m.label}
                      </span>
                      <span style={{ fontSize: 16 }}>{m.icon}</span>
                    </div>
                    <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: "-0.03em", color: "#fff", marginBottom: 2 }}>
                      {m.value}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{m.sub}</div>
                    
                    {/* Simulated Sparkline */}
                    <div style={{ height: 24, position: "relative", marginBottom: 4 }}>
                      <svg viewBox="0 0 100 30" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                        <path d={m.sparkline} fill="none" stroke={m.color} strokeWidth="2" strokeLinecap="round" opacity="0.8" />
                        <path d={`${m.sparkline} L100,30 L0,30 Z`} fill={`url(#gradient-${m.color.replace("#","")})`} opacity="0.06" />
                        <defs>
                          <linearGradient id={`gradient-${m.color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={m.color} />
                            <stop offset="100%" stopColor="transparent" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Strategic OS Frame Card */}
          <div className="glass-card" style={{ marginBottom: 28 }}>
            <h3 style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16, display: "flex", alignItems: "center", gap: 6 }}>
              <span>🔭</span> Direccionamiento Estratégico & Lentes PM OS
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>
                  Norte & Propósito
                </div>
                <p style={{ fontSize: 13, color: "#fff", fontWeight: 700, margin: "0 0 4px" }}>
                  Que cada dropshipper gane dinero vendiendo en la plataforma.
                </p>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  Activación = 1ª orden rentable · Retención = ganancia sostenida.
                </span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>
                  Territorio & Perfil
                </div>
                <p style={{ fontSize: 13, color: "#fff", fontWeight: 700, margin: "0 0 4px" }}>
                  Territorio E-commerce (Seller Success)
                </p>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  Foco: Dropshippers (Rebuscador, Empleado Aspirante, Joven Visionario).
                </span>
              </div>
              <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 14 }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 6 }}>
                  Lentes & Madurez (Q3 Focus)
                </div>
                <p style={{ fontSize: 13, color: "#fff", fontWeight: 700, margin: "0 0 4px" }}>
                  Nivel A (Iniciando) → TTV / Reptiliano
                </p>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  Q3: Aumentar la activación neta y bajar TTV.
                </span>
              </div>
            </div>
          </div>

          {/* Onboarding Funnel Redesign */}
          {metrics && (
            <div className="glass-card" style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20 }}>
                🎛️ EMBUDO DE CONVERSIÓN DE SELLERS & COVERAGE FUNNEL
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {activeFunnel.map((step: any, idx: number) => {
                  const isGap = step.pct === 0 || isNaN(step.pct);
                  const alignmentPct = isGap ? 8 : step.pct;
                  
                  return (
                    <div key={step.step} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "rgba(255,255,255,0.3)", width: 20 }}>
                        {idx + 1}
                      </span>
                      <div style={{
                        flex: 1, background: "rgba(255,255,255,0.01)", border: isGap ? "1px dashed rgba(239, 68, 68, 0.4)" : "1px solid rgba(255, 255, 255, 0.05)",
                        borderRadius: 10, padding: "12px 16px", display: "flex",
                        justifyContent: "space-between", alignItems: "center",
                        position: "relative", overflow: "hidden"
                      }}>
                        <div style={{
                          position: "absolute", top: 0, left: 0, bottom: 0,
                          width: `${alignmentPct}%`, background: isGap ? "rgba(239, 68, 68, 0.08)" : `${step.color}15`,
                          zIndex: 0
                        }} />
                        <span style={{ fontSize: 13, fontWeight: 700, color: isGap ? "rgba(239, 68, 68, 0.85)" : "#fff", zIndex: 1, display: "flex", alignItems: "center", gap: 6 }}>
                          {isGap && <span>⚠️</span>}
                          {step.step}
                          {isGap && <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(239, 68, 68, 0.15)", color: "#EF4444", padding: "1px 6px", borderRadius: 4, marginLeft: 8 }}>DEUDA DE TRACKING</span>}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: 12, zIndex: 1 }}>
                          <span style={{ fontSize: 12, fontWeight: 800, color: isGap ? "#EF4444" : "#fff" }}>
                            {isGap ? "[DATO FALTANTE]" : step.count.toLocaleString()}
                          </span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, background: isGap ? "rgba(239,68,68,0.15)" : `${step.color}25`,
                            color: isGap ? "#EF4444" : step.color, padding: "2px 8px", borderRadius: 20
                          }}>
                            {isGap ? "NaN%" : `${step.pct}%`}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Jira and Sprints Card Container */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24, marginBottom: 28 }}>
            
            {/* GoHighLevel CRM Onboarding Pipeline Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🤝</span> CRM GoHighLevel Onboarding
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {metrics?.crm?.stages ? (
                  Object.entries(metrics.crm.stages).map(([stage, count]) => (
                    <div key={stage} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.06)", paddingBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{stage}</span>
                      <span style={{ fontSize: 12, fontWeight: 800, background: "rgba(255,255,255,0.05)", color: "#fff", padding: "3px 10px", borderRadius: 20 }}>
                        {count} leads
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>Cargando datos del CRM...</p>
                )}
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 6, fontStyle: "italic" }}>
                  Fuente: Oportunidades GHL en tiempo real.
                </div>
              </div>
            </div>

            {/* Sprint Active Checklist Card */}
            <div className="glass-card">
              <h3 style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <span>📅</span> Sprint Activo (Checklist de Producto)
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {metrics?.sprint?.tasksList ? (
                  metrics.sprint.tasksList.map((task) => (
                    <div key={task.key} style={{ border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10, padding: 12, background: "rgba(255,255,255,0.01)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                        <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#F77F00", textDecoration: "none" }}>
                          {task.key}
                        </a>
                        <span style={{
                          fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                          padding: "2px 6px", borderRadius: 4,
                          background: task.status === "Listo" || task.status === "Done" || task.status === "Finished" ? "rgba(34, 197, 94, 0.15)" : "rgba(245, 158, 11, 0.15)",
                          color: task.status === "Listo" || task.status === "Done" || task.status === "Finished" ? "#22C55E" : "#F59E0B"
                        }}>
                          {task.status}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: "#fff", fontWeight: 700, marginBottom: 8 }}>{task.summary}</div>
                      {task.sections && task.sections.length > 0 && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid rgba(255,255,255,0.05)", paddingTop: 8 }}>
                          {task.sections.map((sec: any) => (
                            <div key={sec.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                              <span>{sec.status === "hecho" ? "✅" : "⏳"}</span>
                              <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{sec.name}:</span>
                              <span style={{ color: "rgba(255,255,255,0.4)" }}>{sec.notes}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>Cargando checklist del sprint...</p>
                )}
              </div>
            </div>

          </div>

          {/* Jira Bugs Tracking Card */}
          {metrics && (
            <div className="glass-card" style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🐛</span> Bugs Activos en Jira (Caza-productos / Notificaciones)
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {metrics.jira?.bugsList ? (
                  metrics.jira.bugsList.map((bug) => (
                    <div key={bug.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed rgba(255,255,255,0.06)", paddingBottom: 10 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <a href={bug.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "#F77F00", textDecoration: "none" }}>
                            {bug.key}
                          </a>
                          <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>{bug.summary}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>Asignado a: <strong>{bug.assignee}</strong></div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                        padding: "4px 8px", borderRadius: 6,
                        background: bug.status === "Done" || bug.status === "Resuelto" || bug.status === "Finished" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                        color: bug.status === "Done" || bug.status === "Resuelto" || bug.status === "Finished" ? "#22C55E" : "#EF4444"
                      }}>
                        {bug.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>Cargando bugs activos...</p>
                )}
              </div>
            </div>
          )}

          {/* Updates list */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, margin: 0 }}>
                Updates
              </p>
            </div>
            
            {/* Custom dark list wrapper */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {updates.map((item) => (
                <div
                  key={item.key}
                  onClick={() => {
                    const u = updatesById.get(item.key);
                    if (u) setOpenUpdate(u);
                  }}
                  className="glass-card"
                  style={{ cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20 }}
                >
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                      <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(99, 102, 241, 0.15)", color: "#6366F1", padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                        {item.tag}
                      </span>
                      <span style={{ fontSize: 14 }}>{item.icon}</span>
                    </div>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.name}</h4>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.description}</p>
                  </div>
                  <div style={{ marginTop: 14, fontSize: 11, fontWeight: 700, color: "#F77F00", display: "flex", alignItems: "center", gap: 4 }}>
                    Ver →
                  </div>
                </div>
              ))}
              {updates.length === 0 && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Aún no hay updates registrados.</p>
              )}
            </div>
          </div>

          {/* Discovery projects list */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, margin: 0 }}>
                Discovery Projects
              </p>
              {canCreate && (
                <button
                  onClick={() => { setShowForm(true); setFormError(null); }}
                  style={{
                    fontSize: 12, fontWeight: 700, color: "#F77F00",
                    background: "rgba(247, 127, 0, 0.08)", border: "1px solid rgba(247, 127, 0, 0.2)", borderRadius: 8,
                    padding: "6px 12px", cursor: "pointer",
                  }}
                >
                  + Proyecto vacío
                </button>
              )}
            </div>

            {/* Custom dark list wrapper */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type !== "POC").map((p) => {
                const item = proyectoToItem(p);
                return (
                  <a
                    key={item.key}
                    href={item.url}
                    className="glass-card"
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20 }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, background: `${item.color}25`, color: item.color, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                          {item.tag}
                        </span>
                        <span style={{ fontSize: 14 }}>{item.icon}</span>
                      </div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.name}</h4>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.description}</p>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 11, fontWeight: 700, color: "#F77F00", display: "flex", alignItems: "center", gap: 4 }}>
                      Ver proyecto →
                    </div>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Pruebas de concepto list */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 20 }}>
              Pruebas de concepto
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type === "POC").map((p) => {
                const item = proyectoToItem(p);
                return (
                  <a
                    key={item.key}
                    href={item.url}
                    className="glass-card"
                    style={{ textDecoration: "none", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 20 }}
                  >
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                        <span style={{ fontSize: 10, fontWeight: 800, background: `${item.color}25`, color: item.color, padding: "2px 8px", borderRadius: 4, textTransform: "uppercase" }}>
                          {item.tag}
                        </span>
                        <span style={{ fontSize: 14 }}>{item.icon}</span>
                      </div>
                      <h4 style={{ fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{item.name}</h4>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>{item.description}</p>
                    </div>
                    <div style={{ marginTop: 14, fontSize: 11, fontWeight: 700, color: "#F77F00", display: "flex", alignItems: "center", gap: 4 }}>
                      Ver proyecto →
                    </div>
                  </a>
                );
              })}
              {poc.length === 0 && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Aún no hay POCs cargadas para esta célula.</p>
              )}
            </div>
          </div>

        </div>

        <HubFooter />
        
        {openUpdate && (
          <div
            onClick={() => setOpenUpdate(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(3,7,18,0.75)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24, zIndex: 50, backdropFilter: "blur(4px)"
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#0c1020", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, maxWidth: 640, width: "100%",
                maxHeight: "80vh", overflowY: "auto", padding: "28px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)", color: "#fff"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", lineHeight: 1.3, margin: 0 }}>{openUpdate.title}</h2>
                <button
                  onClick={() => setOpenUpdate(null)}
                  style={{ flexShrink: 0, background: "none", border: "none", fontSize: 20, color: "rgba(255,255,255,0.4)", cursor: "pointer", lineHeight: 1, padding: 4 }}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 0, marginBottom: 18 }}>{openUpdate.week_date}</p>
              <div style={{ fontSize: 13.5, color: "rgba(255,255,255,0.8)", lineHeight: 1.7 }}>
                {openUpdate.content.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (trimmed === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid rgba(255,255,255,0.1)", margin: "16px 0" }} />;
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

  return (
    <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
      <HubHeader
        title={celula.nombre}
        subtitle={celula.lead ? `Lead: ${celula.lead}` : "Home de célula · Darwin"}
        currentSlug={celula.slug}
      />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "48px 24px" }}>
        {/* OKR & NSM Progress Section */}
        {params.slug === "sellers" && metrics && (
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
        {params.slug === "sellers" && metrics && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 36 }}>
            {[
              { label: "Sellers Registrados", value: metrics.stats.totalSellers.toLocaleString(), sub: "Sincronizados de Userpilot", color: "#6366F1", icon: "👥" },
              { label: "Tasa de Activación", value: `${metrics.stats.activationRate}%`, sub: "Sellers con ≥1 orden", color: "#EC4899", icon: "⚡" },
              { label: "Sellers Activos (30d)", value: `${metrics.stats.activeRate}%`, sub: "Actividad constante en plataforma", color: "#22C55E", icon: "🎯" },
              { label: "Tasa de Rebote (Bounce)", value: `${metrics.stats.bounceRate}%`, sub: "Sellers con ≤1 sesión web", color: "#EF4444", icon: "🚪" },
              { label: "Supervivencia (30d)", value: `${metrics.stats.survivalRate ?? 69.38}%`, sub: "Sellers con ≥1 orden adicional", color: "#8B5CF6", icon: "🌱" },
              { label: "TTV Neto (Mediana)", value: `${metrics.stats.ttvNetoMedian ?? 16.0} días`, sub: "Registro hasta entrega exitosa", color: "#F59E0B", icon: "⏱️" }
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

        {/* Direccionamiento Estratégico Section */}
        {params.slug === "sellers" && metrics && (
          <div style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: 16, padding: 24, marginBottom: 36,
            boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
          }}>
            <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
              <span>🎯</span> Direccionamiento Estratégico & Lentes PM OS
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
              <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  Norte & Propósito
                </div>
                <p style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600, margin: "0 0 4px" }}>
                  Que cada dropshipper gane dinero vendiendo en la plataforma.
                </p>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  Activación = 1ª orden rentable · Retención = ganancia sostenida.
                </span>
              </div>

              <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  Territorio & Perfil
                </div>
                <p style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600, margin: "0 0 4px" }}>
                  Territorio E-commerce (Seller Success)
                </p>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  Foco: Dropshippers (Rebuscador, Empleado Aspirante, Joven Visionario).
                </span>
              </div>

              <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  Lentes & Madurez (Q3 Focus)
                </div>
                <p style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600, margin: "0 0 4px" }}>
                  Nivel A (Iniciando) → TTV/Reptiliano
                </p>
                <span style={{ fontSize: 11, color: "var(--muted)" }}>
                  Q3: Reducir fricción de activación neta (5.2%) y bruta (7.6%).
                </span>
              </div>
            </div>
            
            <div style={{ marginTop: 16, fontSize: 11, color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: 16, borderTop: "1px dashed var(--border)", paddingTop: 12 }}>
              <span>🔑 <strong>Ownership:</strong> Módulo de marketing y herramientas de ventas/marketing.</span>
              <span>📈 <strong>Alineación OKR:</strong> Todas las iniciativas empujan el KR1.1 de la holding (7.8M órdenes/mes).</span>
            </div>
          </div>
        )}

        {/* Conversion Funnel Section */}
        {params.slug === "sellers" && metrics && (
          <>
            <div style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: 16, padding: 24, marginBottom: 36,
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

            {/* Two-column layout for Jira and Sprints */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: 24, marginBottom: 36 }}>
              {/* GoHighLevel CRM Onboarding Pipeline Card */}
              <div style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
              }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>🤝</span> CRM GoHighLevel Onboarding
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {metrics.crm?.stages ? (
                    Object.entries(metrics.crm.stages).map(([stage, count]) => (
                      <div key={stage} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: 8 }}>
                        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>{stage}</span>
                        <span style={{ fontSize: 12, fontWeight: 800, background: "var(--bg)", color: "var(--fg)", padding: "3px 10px", borderRadius: 20 }}>
                          {count} leads
                        </span>
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>Cargando datos del CRM...</p>
                  )}
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, fontStyle: "italic" }}>
                    Fuente: Oportunidades GHL sincronizadas en tiempo real.
                  </div>
                </div>
              </div>

              {/* Sprints Tasks & Checklist Card */}
              <div style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: 16, padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
              }}>
                <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                  <span>📅</span> Sprint Activo (Checklist de Producto)
                </h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {metrics.sprint?.tasksList ? (
                    metrics.sprint.tasksList.map((task) => (
                      <div key={task.key} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 12, background: "var(--bg)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                          <a href={task.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>
                            {task.key}
                          </a>
                          <span style={{
                            fontSize: 9, fontWeight: 800, textTransform: "uppercase",
                            padding: "2px 6px", borderRadius: 4,
                            background: task.status === "Listo" || task.status === "Done" || task.status === "Finished" ? "#DCFCE7" : "#FEF3C7",
                            color: task.status === "Listo" || task.status === "Done" || task.status === "Finished" ? "#166534" : "#92400E"
                          }}>
                            {task.status}
                          </span>
                        </div>
                        <div style={{ fontSize: 12, color: "var(--fg)", fontWeight: 600, marginBottom: 8 }}>{task.summary}</div>
                        {task.sections && task.sections.length > 0 && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 4, borderTop: "1px solid var(--border)", paddingTop: 8 }}>
                            {task.sections.map((sec: any) => (
                              <div key={sec.name} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11 }}>
                                <span>{sec.status === "hecho" ? "✅" : "⏳"}</span>
                                <span style={{ color: "var(--fg)", fontWeight: 550 }}>{sec.name}:</span>
                                <span style={{ color: "var(--muted)" }}>{sec.notes}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>Cargando checklist del sprint...</p>
                  )}
                </div>
              </div>
            </div>

            {/* Jira Bugs Tracking Card */}
            <div style={{
              background: "#fff", border: "1px solid var(--border)",
              borderRadius: 16, padding: 24, marginBottom: 40,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)"
            }}>
              <h3 style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 20, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🐛</span> Bugs Activos en Jira (Caza-productos / Notificaciones)
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {metrics.jira?.bugsList ? (
                  metrics.jira.bugsList.map((bug) => (
                    <div key={bug.key} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border)", paddingBottom: 10 }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <a href={bug.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>
                            {bug.key}
                          </a>
                          <span style={{ fontSize: 12, color: "var(--fg)", fontWeight: 600 }}>{bug.summary}</span>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--muted)" }}>Asignado a: <strong>{bug.assignee}</strong></div>
                      </div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, textTransform: "uppercase",
                        padding: "4px 8px", borderRadius: 6,
                        background: bug.status === "Done" || bug.status === "Resuelto" || bug.status === "Finished" ? "#DCFCE7" : "#FEE2E2",
                        color: bug.status === "Done" || bug.status === "Resuelto" || bug.status === "Finished" ? "#166534" : "#991B1B"
                      }}>
                        {bug.status}
                      </span>
                    </div>
                  ))
                ) : (
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>Cargando bugs activos...</p>
                )}
                {metrics.jira?.bugsList && metrics.jira.bugsList.length === 0 && (
                  <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>No hay bugs activos reportados.</p>
                )}
              </div>
            </div>
          </>
        )}

        <div style={{ marginBottom: 56 }}>
          <Section
            title="Updates"
            items={updates}
            ctaLabel="Ver →"
            onItemClick={(item) => {
              const u = updatesById.get(item.key);
              if (u) setOpenUpdate(u);
            }}
          />
          {updates.length === 0 && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay updates registrados.</p>
          )}
        </div>

        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>
              Discovery projects
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
                      onClick={() => { setShowForm(true); setFormError(null); }}
                      style={{
                        fontSize: 12, fontWeight: 700, color: "var(--dropi)",
                        background: "none", border: "1px solid var(--border)", borderRadius: 8,
                        padding: "6px 12px", cursor: "pointer",
                      }}
                    >
                      + Proyecto vacío
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
                {submitting ? "Creando…" : "Crear proyecto"}
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
