"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import HubFooter from "@/components/HubFooter";
import HubHeader from "@/components/HubHeader";
import { type Item, Section } from "@/components/HomeSections";
import { SEMANAS, REGISTRY } from "@/app/weekly/data/index";
import { isMiDiaOwner } from "@/lib/sprint-access";
import MiDiaShell from "@/app/proyectos/mi-dia/MiDiaShell";
import { ProjectCard, type Proyecto } from "@/components/ProjectCard";

// La torre de logística arrastra el registro completo del tablero
// (proyectos/logistica/_lib/data.ts, ~1.500 líneas). Se carga aparte para que
// ese peso no entre en el bundle de las demás células, que no lo usan.
const TorreLogistica = dynamic(() => import("./_components/TorreLogistica"), { ssr: false });
const ProyectosPorEtapa = dynamic(() => import("./_components/ProyectosPorEtapa"), { ssr: false });
const UpdatesLogistica = dynamic(() => import("./_components/UpdatesLogistica"), { ssr: false });
const UpdatesBackoffice = dynamic(() => import("./_components/UpdatesBackoffice"), { ssr: false });
const WeeklyBanner = dynamic(() => import("./_components/WeeklyBanner"), { ssr: false });
type Update = { id: string; week_date: string; title: string; content: string; url: string | null };

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
  activationRateNet?: number;
  okrTargetCompany?: number;
  percentageToCompanyOKR?: number;
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
  Idea: "💡", Oportunidad: "🔭", POC: "🧪", Proyecto: "🚀", "Delivery Proyecto": "🚚",
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
  // Etapa seleccionada en el mapa de la orden (solo logística). null = todas.
  const [etapaFiltro, setEtapaFiltro] = useState<string | null>(null);

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

  const proyectos = celula.proyectos.filter((p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following").map(proyectoToItem);
  const poc = celula.proyectos.filter((p) => p.type === "POC").map(proyectoToItem);
  const canCreate = !!profile && (profile.is_super_admin || profile.celula_id === celula.id);

  const pocsByParent = new Map<string, Proyecto[]>();
  const deliveriesByParent = new Map<string, Proyecto[]>();
  const followingsByDelivery = new Map<string, Proyecto[]>();
  for (const p of celula.proyectos) {
    if (p.type === "POC" && p.parent_project_id) {
      const list = pocsByParent.get(p.parent_project_id) ?? [];
      list.push(p);
      pocsByParent.set(p.parent_project_id, list);
    }
    if (p.type === "Delivery Proyecto" && p.parent_project_id) {
      const list = deliveriesByParent.get(p.parent_project_id) ?? [];
      list.push(p);
      deliveriesByParent.set(p.parent_project_id, list);
    }
    if (p.type === "Following" && p.related_delivery_id) {
      const list = followingsByDelivery.get(p.related_delivery_id) ?? [];
      list.push(p);
      followingsByDelivery.set(p.related_delivery_id, list);
    }
  }

  async function handleEstadoChange(id: string, estado: string) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ estado_interno: estado }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: prev.proyectos.map((p) => (p.id === updated.id ? updated : p)) } : prev);
  }

  async function handleVpvChange(id: string, vpv: number | null) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vpv }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: prev.proyectos.map((p) => (p.id === updated.id ? updated : p)) } : prev);
  }

  async function handleCrearPoc(parent: Proyecto, name: string, summary: string) {
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary }),
    });
    if (!res.ok) return;
    const created = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: [...prev.proyectos, created] } : prev);
  }

  async function handleCrearDelivery(parent: Proyecto, name: string, summary: string, relatedPocId: string | null) {
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary, type: "Delivery Proyecto", related_poc_id: relatedPocId }),
    });
    if (!res.ok) return;
    const created = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: [...prev.proyectos, created] } : prev);
  }

  async function handleRelatedPocChange(id: string, relatedPocId: string | null) {
    const res = await fetch(`/api/proyectos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ related_poc_id: relatedPocId }),
    });
    if (!res.ok) return;
    const updated = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: prev.proyectos.map((p) => (p.id === updated.id ? updated : p)) } : prev);
  }

  async function handleCrearFollowing(parent: Proyecto, name: string, summary: string): Promise<string | null> {
    const res = await fetch(`/api/proyectos/${parent.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, summary, type: "Following" }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => null);
      return data?.error ?? "No se pudo crear el Following.";
    }
    const created = await res.json();
    setCelula((prev) => prev ? { ...prev, proyectos: [...prev.proyectos, created] } : prev);
    return null;
  }

  // Home privada: solo para MI_DIA_OWNER_EMAIL, reemplaza el body estándar de
  // célula por el dashboard de "mi día" — ver [[project_darwin_pd_dashboard]].
  if (isMiDiaOwner(profile?.email)) {
    return (
      <main style={{ minHeight: "100vh", padding: "0", background: "var(--card)", display: "flex", flexDirection: "column" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <HubHeader title={celula.nombre} subtitle="Tu día · Darwin" currentSlug={celula.slug} />
          <MiDiaShell />
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
  // Logística cambia el cuerpo de la home: abre con la torre de control y
  // agrupa las iniciativas por etapa del viaje de la orden en vez de la
  // rejilla plana. El resto de las células no se toca.
  const isLogistica = params.slug === "logistica";
  // Backoffice suma su propio Weekly (acordeones por fecha) a la sección
  // Updates, igual que logística — ver UpdatesBackoffice.
  const isBackoffice = params.slug === "backoffice";

  // Get active country stats
  const activeStats = (metrics?.stats?.countries as any)?.[selectedCountry] || metrics?.stats;
  const activeFunnel = activeStats?.funnel || metrics?.funnel || [];

  const sellersCss = `
    .country-tab {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      color: #64748b;
      transition: all 0.2s ease;
      cursor: pointer;
    }
    .country-tab:hover {
      color: #0f172a;
      background: #f8fafc;
      border-color: #cbd5e1;
    }
    .country-tab.active {
      background: linear-gradient(90deg, #F77F00 0%, #ffaa44 100%);
      border-color: transparent;
      color: #ffffff;
      box-shadow: 0 4px 14px rgba(247, 127, 0, 0.25);
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
      <main style={{ minHeight: "100vh", padding: "0", background: "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)", color: "#0f172a", display: "flex", flexDirection: "column", fontFamily: "'Inter', sans-serif" }}>
        <style dangerouslySetInnerHTML={{ __html: sellersCss }} />
        
        {/* Header Section */}
        <div style={{ borderBottom: "1px solid #e2e8f0", background: "#ffffff" }}>
          <HubHeader
            title={celula.nombre}
            subtitle={celula.lead ? `Lead: ${celula.lead} · Control Tower PM OS` : "Control Tower de Célula · Darwin"}
            currentSlug={celula.slug}
          />
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px", width: "100%", flex: 1 }}>
          
          {/* Weekly Célula Banner / Action Bar */}
          <WeeklyBanner />

          {/* Country Filter Tab Bar */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 28, background: "#f1f5f9", padding: 6, borderRadius: 12, border: "1px solid #e2e8f0" }}>
            {[
              { key: "global", label: "🌍 Global" },
              { key: "CO", label: "🇨🇴 Colombia" },
              { key: "EC", label: "🇪🇨 Ecuador" },
              { key: "CL", label: "🇨🇱 Chile" },
              { key: "MX", label: "🇲🇽 México" },
              { key: "GT", label: "🇬🇹 Guatemala" },
              { key: "PY", label: "🇵🇾 Paraguay" },
              { key: "PA", label: "🇵🇦 Panamá" },
              { key: "AR", label: "🇦🇷 Argentina" },
              { key: "CR", label: "🇨🇷 Costa Rica" },
              { key: "PE", label: "🇵🇪 Perú" }
            ].map((country) => (
              <button
                key={country.key}
                onClick={() => setSelectedCountry(country.key)}
                className={`country-tab ${selectedCountry === country.key ? "active" : ""}`}
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: 6
                }}
              >
                {country.label}
              </button>
            ))}
          </div>

          {/* OKR Progress Card — Dynamic Ceiling (Global = 7.8M Holding, Country = CPO Meta Julio) */}
          {metrics && (() => {
            const isGlobal = selectedCountry === "global";
            const ceilingTarget = isGlobal ? 7800000 : okrTarget;
            const actualPctOfCeiling = ceilingTarget > 0 ? (nsmCurrent / ceilingTarget) * 100 : 0;
            const formattedCurrent = nsmCurrent >= 1000000 ? `${(nsmCurrent / 1000000).toFixed(2)}M` : nsmCurrent.toLocaleString();
            const formattedTarget = ceilingTarget >= 1000000 ? `${(ceilingTarget / 1000000).toFixed(2)}M` : ceilingTarget.toLocaleString();
            
            return (
              <div style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: 16, padding: "28px 32px", marginBottom: 24, color: "#0f172a",
                boxShadow: "0 8px 30px rgba(0,0,0,0.05)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 850, background: "#FFF7ED", color: "#F77F00", border: "1px solid #FFEDD5", padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      {isGlobal ? "OKR 1 / KR 1.1 HOLDING · TECHO GLOBAL: 7.80M ÓRDENES/MES" : `TECHO META JULIO CPO (${selectedCountry.toUpperCase()})`}
                    </span>
                    <h3 style={{ fontSize: 19, fontWeight: 900, letterSpacing: "-0.02em", color: "#0f172a", margin: "8px 0 0" }}>
                      {isGlobal ? "Órdenes Movilizadas de Sellers Activos (NSM Global)" : `Órdenes Movilizadas en ${selectedCountry === "CO" ? "Colombia" : selectedCountry === "EC" ? "Ecuador" : selectedCountry === "CL" ? "Chile" : selectedCountry === "MX" ? "México" : selectedCountry === "GT" ? "Guatemala" : selectedCountry === "PY" ? "Paraguay" : selectedCountry === "PA" ? "Panamá" : selectedCountry === "AR" ? "Argentina" : selectedCountry === "CR" ? "Costa Rica" : selectedCountry === "PE" ? "Perú" : selectedCountry}`}
                    </h3>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: "#F77F00" }}>
                      {actualPctOfCeiling.toFixed(1)}%
                    </span>
                    <span style={{ fontSize: 12, color: "#64748b", display: "block" }}>
                      {isGlobal ? "del Techo OKR 1.1 (7.80M/mes)" : `alcanzado de la Meta Julio (${percentageToOkr}% proy.)`}
                    </span>
                  </div>
                </div>
                
                {/* Progress Bar towards Ceiling */}
                <div style={{ height: 12, background: "#f1f5f9", borderRadius: 999, overflow: "hidden", marginBottom: 16, border: "1px solid #e2e8f0" }}>
                  <div style={{
                    height: "100%",
                    width: `${Math.min(actualPctOfCeiling, 100)}%`,
                    background: actualPctOfCeiling >= 100 ? "linear-gradient(90deg, #10B981 0%, #34D399 100%)" : "linear-gradient(90deg, #F77F00 0%, #ffaa44 100%)",
                    borderRadius: 999,
                  }} />
                </div>
                
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, fontSize: 12, borderTop: "1px dashed #e2e8f0", paddingTop: 14 }}>
                  <div>
                    <span style={{ color: "#64748b", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>Estado Actual (Tabla CPO 1-29 Jul)</span>
                    <strong style={{ color: "#0f172a", fontSize: 14, fontWeight: 800 }}>{formattedCurrent}/mes</strong>
                    <span style={{ fontSize: 11, color: "#64748b", display: "block" }}>{nsmCurrent.toLocaleString()} ord movilizadas</span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>
                      {isGlobal ? "Hito Julio CPO" : "Meta Julio CPO (Techo País)"}
                    </span>
                    <strong style={{ color: "#0f172a", fontSize: 14, fontWeight: 800 }}>
                      {isGlobal ? "3.57M/mes" : `${formattedTarget}/mes`}
                    </strong>
                    <span style={{ fontSize: 11, color: "#16a34a", fontWeight: 700, display: "block" }}>
                      {isGlobal ? "93.85% alcanzado (100.32% proy)" : `${percentageToOkr}% proy. cumplimiento`}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#64748b", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>
                      {isGlobal ? "Techo OKR 1.1 Holding" : "Brecha a la Meta Julio"}
                    </span>
                    <strong style={{ color: "#F77F00", fontSize: 14, fontWeight: 900 }}>
                      {isGlobal ? "7.80M/mes" : gapToOkr > 0 ? `-${gapToOkr.toLocaleString()} ord` : `+${Math.abs(gapToOkr).toLocaleString()} ord 🎉`}
                    </strong>
                    <span style={{ fontSize: 11, color: isGlobal ? "#dc2626" : gapToOkr > 0 ? "#dc2626" : "#16a34a", fontWeight: 700, display: "block" }}>
                      {isGlobal ? "Brecha: -4.45M ord (43.0% cumpl.)" : gapToOkr > 0 ? "Falta para completar meta" : "Meta del mes superada!"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Metrics Grid — Termómetros Visuales por Métrica a Escala */}
          {metrics && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 18, marginBottom: 28 }}>
              {[
                {
                  label: "Tasa de Activación Neta",
                  value: `${activeStats?.activationRateNet ?? 5.2}%`,
                  targetVal: "8.0%",
                  progressPct: ((activeStats?.activationRateNet ?? 5.2) / 8.0) * 100,
                  meta: "Meta Q3: 8.0% · Brecha: -2.8 pp",
                  sub: "% de sellers registrados que logran entregar exitosamente su 1ª orden (TTV neto).",
                  color: "#10B981", bg: "#ECFDF5", icon: "⚡"
                },
                {
                  label: "Tiempo de Activación Neta (TTV)",
                  value: `${ttvNetoMedian} días`,
                  targetVal: "< 12.0d",
                  progressPct: (12.0 / ttvNetoMedian) * 100,
                  meta: "Meta Q3: < 12.0 días · Exceso: +4.0 días",
                  sub: "Mediana de días transcurridos desde el registro hasta la 1ª orden entregada.",
                  color: "#D97706", bg: "#FEF3C7", icon: "⏱️"
                },
                {
                  label: "Tasa de Activación Bruta",
                  value: `${activationRate}%`,
                  targetVal: "12.0%",
                  progressPct: (activationRate / 12.0) * 100,
                  meta: "Meta Q3: 12.0% · Brecha: -4.4 pp",
                  sub: "% de sellers registrados que crean su 1ª orden en la plataforma (TTFO).",
                  color: "#DB2777", bg: "#FCE7F3", icon: "📦"
                },
                {
                  label: "Retención a 30 Días",
                  value: `${survivalRate}%`,
                  targetVal: "75.0%",
                  progressPct: (survivalRate / 75.0) * 100,
                  meta: "Meta S2: 75.0% · Brecha: -5.62 pp",
                  sub: "% de sellers que continúan vendiendo pasados 30 días de su registro.",
                  color: "#7C3AED", bg: "#F3E8FF", icon: "🌱"
                },
                {
                  label: "Base de Sellers Identificados",
                  value: totalSellers.toLocaleString(),
                  targetVal: "46.2k DB",
                  progressPct: (36056 / totalSellers) * 100,
                  meta: "36,056 Dropshippers Target + 8,744 Proveedores",
                  sub: "Total de cuentas registradas y auditadas en la base de datos Supabase.",
                  color: "#2563EB", bg: "#EFF6FF", icon: "👥"
                },
                {
                  label: "Usuarios Activos Diarios (DAU)",
                  value: "14,262",
                  targetVal: "81.5k MAU",
                  progressPct: (14262 / 81521) * 100,
                  meta: "MAU Mensual: 81,521 usuarios/mes",
                  sub: "Usuarios operando en vivo diariamente (~31% del volumen activo mensual).",
                  color: "#16A34A", bg: "#DCFCE7", icon: "🎯"
                }
              ].map((m) => (
                <div key={m.label} style={{
                  background: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderLeft: `4px solid ${m.color}`,
                  borderRadius: 16,
                  padding: "20px 22px",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}>
                  <div>
                    {/* Header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        {m.label}
                      </span>
                      <span style={{ fontSize: 18 }}>{m.icon}</span>
                    </div>

                    {/* Big Value */}
                    <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: "#0f172a", marginBottom: 8 }}>
                      {m.value}
                    </div>

                    {/* Meta Badge */}
                    <div style={{
                      background: m.bg,
                      padding: "6px 12px",
                      borderRadius: 8,
                      marginBottom: 12
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 850, color: m.color, letterSpacing: "0.01em" }}>
                        {m.meta}
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div style={{ margin: "10px 0 14px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>
                        <span style={{ color: "#64748b" }}>Avance a la Meta</span>
                        <span style={{ color: m.color, fontWeight: 900 }}>
                          {m.progressPct.toFixed(1)}%
                        </span>
                      </div>

                      {/* Thermometer Tube */}
                      <div style={{
                        height: 10,
                        background: "#f1f5f9",
                        borderRadius: 999,
                        padding: 1,
                        border: "1px solid #e2e8f0",
                        position: "relative",
                        overflow: "hidden"
                      }}>
                        <div style={{
                          height: "100%",
                          width: `${Math.min(m.progressPct, 100)}%`,
                          background: `linear-gradient(90deg, ${m.color}cc 0%, ${m.color} 100%)`,
                          borderRadius: 999,
                        }} />
                      </div>

                      {/* Scale Legends */}
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748b", marginTop: 4, fontWeight: 600 }}>
                        <span>0</span>
                        <span>Actual: <strong style={{ color: "#0f172a" }}>{m.value}</strong></span>
                        <span>Meta: <strong style={{ color: m.color }}>{m.targetVal}</strong></span>
                      </div>
                    </div>
                  </div>

                  {/* Explanation Footer */}
                  <div style={{
                    fontSize: 12,
                    color: "#475569",
                    fontWeight: 500,
                    lineHeight: 1.45,
                    borderTop: "1px dashed #e2e8f0",
                    paddingTop: 10
                  }}>
                    {m.sub}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Discovery projects list */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, margin: 0 }}>
                Discovery Projects
              </p>
              {canCreate && (
                <button
                  onClick={() => { setShowForm(true); setFormError(null); }}
                  style={{
                    fontSize: 12, fontWeight: 700, color: "#F77F00",
                    background: "#FFF7ED", border: "1px solid #FFEDD5", borderRadius: 8,
                    padding: "6px 12px", cursor: "pointer",
                  }}
                >
                  + Proyecto vacío
                </button>
              )}
            </div>

            {/* Custom light list wrapper */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={pocsByParent.get(p.id) ?? []}
                  deliveries={deliveriesByParent.get(p.id) ?? []}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                  onCrearDelivery={handleCrearDelivery}
                />
              ))}
            </div>
          </div>

          {/* Pruebas de concepto list */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 20 }}>
              Pruebas de concepto (POCs)
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type === "POC").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                />
              ))}
              {poc.length === 0 && (
                <p style={{ fontSize: 13, color: "#64748b" }}>Aún no hay POCs cargadas para esta célula.</p>
              )}
            </div>
          </div>

          {/* Delivery Proyectos list */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 20 }}>
              Delivery Proyectos
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type === "Delivery Proyecto").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  siblingPocs={p.parent_project_id ? pocsByParent.get(p.parent_project_id) ?? [] : []}
                  followings={followingsByDelivery.get(p.id) ?? []}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                  onRelatedPocChange={handleRelatedPocChange}
                  onCrearFollowing={handleCrearFollowing}
                />
              ))}
              {celula.proyectos.filter((p) => p.type === "Delivery Proyecto").length === 0 && (
                <p style={{ fontSize: 13, color: "#64748b" }}>Aún no hay Delivery Proyectos cargados para esta célula.</p>
              )}
            </div>
          </div>

          {/* Followings list */}
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, marginBottom: 20 }}>
              Followings
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
              {celula.proyectos.filter((p) => p.type === "Following").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                />
              ))}
              {celula.proyectos.filter((p) => p.type === "Following").length === 0 && (
                <p style={{ fontSize: 13, color: "#64748b" }}>Aún no hay Followings cargados para esta célula.</p>
              )}
            </div>
          </div>

        </div>

        <HubFooter />
        
        {openUpdate && (
          <div
            onClick={() => setOpenUpdate(null)}
            style={{
              position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)",
              display: "flex", alignItems: "center", justifyContent: "center",
              padding: 24, zIndex: 50, backdropFilter: "blur(4px)"
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 16, maxWidth: 640, width: "100%",
                maxHeight: "80vh", overflowY: "auto", padding: "28px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)", color: "#0f172a"
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 4 }}>
                <h2 style={{ fontSize: 17, fontWeight: 800, color: "#0f172a", lineHeight: 1.3, margin: 0 }}>{openUpdate.title}</h2>
                <button
                  onClick={() => setOpenUpdate(null)}
                  style={{ flexShrink: 0, background: "none", border: "none", fontSize: 20, color: "#64748b", cursor: "pointer", lineHeight: 1, padding: 4 }}
                  aria-label="Cerrar"
                >
                  ×
                </button>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", marginTop: 0, marginBottom: 18 }}>{openUpdate.week_date}</p>
              <div style={{ fontSize: 13.5, color: "#334155", lineHeight: 1.7 }}>
                {openUpdate.content.split("\n").map((line, i) => {
                  const trimmed = line.trim();
                  if (trimmed === "---") return <hr key={i} style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "16px 0" }} />;
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
        {/* Torre de control — solo logística. Abre la home con los indicadores
            de la orden y el mapa que filtra las iniciativas de más abajo. */}
        {isLogistica && (
          <TorreLogistica
            deDarwin={celula.proyectos}
            etapaActiva={etapaFiltro}
            onEtapaChange={setEtapaFiltro}
          />
        )}

        {/* OKR & NSM Progress Section — OKR 1.1 (7.8M/mes) como Techo */}
        {params.slug === "sellers" && metrics && (
          <div style={{
            background: "linear-gradient(135deg, #111827 0%, #1f2937 55%, #c2410c 100%)",
            borderRadius: 16, padding: "28px 32px", marginBottom: 36, color: "#fff",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 12 }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 800, background: "rgba(255,255,255,0.15)", padding: "3px 8px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  OKR 1 / KR 1.1 Holding · TECHO OBJETIVO: 7.80M ÓRDENES/MES
                </span>
                <h3 style={{ fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em", margin: "8px 0 0" }}>
                  Volumen de Órdenes de Sellers Activos (NSM Global)
                </h3>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: 28, fontWeight: 900, color: "#F77F00" }}>43.0%</span>
                <span style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", display: "block" }}>del Techo OKR 1.1 (7.80M/mes)</span>
              </div>
            </div>
            
            {/* Progress Bar for Holding OKR 1.1 */}
            <div style={{ height: 10, background: "rgba(255,255,255,0.16)", borderRadius: 999, overflow: "hidden", marginBottom: 16 }}>
              <div style={{ height: "100%", width: "42.96%", background: "linear-gradient(90deg, #F77F00 0%, #ffaa44 100%)", borderRadius: 999 }} />
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12, fontSize: 12, borderTop: "1px dashed rgba(255,255,255,0.15)", paddingTop: 14 }}>
              <div>
                <span style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>Estado Actual (Tabla CPO 1-29 Jul)</span>
                <strong style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>3.35M/mes</strong>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", display: "block" }}>3.351.359 ord movilizadas</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>Hito Julio CPO</span>
                <strong style={{ color: "#fff", fontSize: 14, fontWeight: 800 }}>3.57M/mes</strong>
                <span style={{ fontSize: 11, color: "#22C55E", fontWeight: 700, display: "block" }}>93.85% alcanzado (100.32% proy)</span>
              </div>
              <div>
                <span style={{ color: "rgba(255,255,255,0.6)", textTransform: "uppercase", fontSize: 10, fontWeight: 700, display: "block" }}>Techo OKR 1.1 Holding</span>
                <strong style={{ color: "#F77F00", fontSize: 14, fontWeight: 900 }}>7.80M/mes</strong>
                <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 700, display: "block" }}>Brecha: -4.45M ord (43.0% cumpl.)</span>
              </div>
            </div>
          </div>
        )}

        {/* Live Metrics Grid — Termómetros Visuales por Métrica a Escala */}
        {params.slug === "sellers" && metrics && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(310px, 1fr))", gap: 18, marginBottom: 36 }}>
            {[
              {
                label: "Tasa de Activación Neta",
                value: `${metrics.stats.activationRateNet ?? 5.2}%`,
                targetVal: "8.0%",
                progressPct: ((metrics.stats.activationRateNet ?? 5.2) / 8.0) * 100,
                meta: "Meta Q3: 8.0% · Brecha: -2.8 pp",
                sub: "% de sellers registrados que logran entregar exitosamente su 1ª orden (TTV neto).",
                color: "#10B981", icon: "⚡"
              },
              {
                label: "Tiempo de Activación Neta (TTV)",
                value: `${metrics.stats.ttvNetoMedian ?? 16.0} días`,
                targetVal: "< 12.0d",
                progressPct: (12.0 / (metrics.stats.ttvNetoMedian ?? 16.0)) * 100,
                meta: "Meta Q3: < 12.0 días · Exceso: +4.0 días",
                sub: "Mediana de días transcurridos desde el registro hasta la 1ª orden entregada.",
                color: "#D97706", icon: "⏱️"
              },
              {
                label: "Tasa de Activación Bruta",
                value: `${metrics.stats.activationRate}%`,
                targetVal: "12.0%",
                progressPct: (metrics.stats.activationRate / 12.0) * 100,
                meta: "Meta Q3: 12.0% · Brecha: -4.4 pp",
                sub: "% de sellers registrados que crean su 1ª orden en la plataforma (TTFO).",
                color: "#DB2777", icon: "📦"
              },
              {
                label: "Retención a 30 Días",
                value: `${metrics.stats.survivalRate ?? 69.38}%`,
                targetVal: "75.0%",
                progressPct: ((metrics.stats.survivalRate ?? 69.38) / 75.0) * 100,
                meta: "Meta S2: 75.0% · Brecha: -5.62 pp",
                sub: "% de sellers que continúan vendiendo pasados 30 días de su registro.",
                color: "#7C3AED", icon: "🌱"
              },
              {
                label: "Base de Sellers Identificados",
                value: metrics.stats.totalSellers.toLocaleString(),
                targetVal: "46.2k DB",
                progressPct: (36056 / metrics.stats.totalSellers) * 100,
                meta: "36,056 Dropshippers Target + 8,744 Proveedores",
                sub: "Total de cuentas registradas y auditadas en la base de datos Supabase.",
                color: "#2563EB", icon: "👥"
              },
              {
                label: "Usuarios Activos Diarios (DAU)",
                value: "14,262",
                targetVal: "81.5k MAU",
                progressPct: (14262 / 81521) * 100,
                meta: "MAU Mensual: 81,521 usuarios/mes",
                sub: "Usuarios operando en vivo diariamente (~31% del volumen activo mensual).",
                color: "#059669", icon: "🎯"
              }
            ].map((m) => (
              <div
                key={m.label}
                style={{
                  background: "#ffffff",
                  border: `1px solid ${m.color}35`,
                  borderRadius: 16,
                  padding: "20px 22px",
                  boxShadow: `0 4px 14px rgba(0,0,0,0.06), 0 0 10px ${m.color}10`,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between"
                }}
              >
                <div>
                  {/* Header */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: "#475569", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {m.label}
                    </span>
                    <span style={{ fontSize: 18 }}>{m.icon}</span>
                  </div>

                  {/* Big Value */}
                  <div style={{ fontSize: 32, fontWeight: 900, letterSpacing: "-0.03em", color: "#0F172A", marginBottom: 8 }}>
                    {m.value}
                  </div>

                  {/* Meta Badge */}
                  <div style={{
                    background: "#F8FAFC",
                    borderLeft: `4px solid ${m.color}`,
                    padding: "6px 12px",
                    borderRadius: "0 8px 8px 0",
                    marginBottom: 12
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 850, color: m.color, letterSpacing: "0.01em" }}>
                      {m.meta}
                    </div>
                  </div>

                  {/* Visual Progress Bar */}
                  <div style={{ margin: "10px 0 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 5 }}>
                      <span style={{ color: "#64748B" }}>Avance a la Meta</span>
                      <span style={{ color: m.color, fontWeight: 900 }}>
                        {m.progressPct.toFixed(1)}%
                      </span>
                    </div>

                    {/* Thermometer Tube */}
                    <div style={{
                      height: 10,
                      background: "#F1F5F9",
                      borderRadius: 999,
                      padding: 1,
                      border: "1px solid #CBD5E1",
                      position: "relative",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${Math.min(m.progressPct, 100)}%`,
                        background: `linear-gradient(90deg, ${m.color}AA 0%, ${m.color} 100%)`,
                        borderRadius: 999,
                        boxShadow: `0 0 8px ${m.color}60`
                      }} />
                    </div>

                    {/* Scale Legends */}
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "#64748B", marginTop: 4, fontWeight: 600 }}>
                      <span>0</span>
                      <span>Actual: <strong style={{ color: "#0F172A" }}>{m.value}</strong></span>
                      <span>Meta: <strong style={{ color: m.color }}>{m.targetVal}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Explanation Footer */}
                <div style={{
                  fontSize: 12,
                  color: "#475569",
                  fontWeight: 500,
                  lineHeight: 1.45,
                  borderTop: "1px dashed #E2E8F0",
                  paddingTop: 10
                }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        )}



        {isLogistica && (
          <div style={{ marginBottom: 56 }}>
            <UpdatesLogistica
              extra={updates}
              onItemClick={(item) => {
                const u = updatesById.get(item.key);
                if (u) setOpenUpdate(u);
              }}
            />
          </div>
        )}

        {isBackoffice && (
          <div style={{ marginBottom: 56 }}>
            <UpdatesBackoffice
              extra={updates}
              onItemClick={(item) => {
                const u = updatesById.get(item.key);
                if (u) setOpenUpdate(u);
              }}
            />
          </div>
        )}

        <div style={{ marginBottom: 56 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>
              {isLogistica ? "Iniciativas por etapa" : "Discovery projects"}
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

          {isLogistica ? (
            <ProyectosPorEtapa
              deDarwin={celula.proyectos}
              etapaActiva={etapaFiltro}
              canCreate={canCreate}
              pocsByParent={pocsByParent}
              onEstadoChange={handleEstadoChange}
              onVpvChange={handleVpvChange}
              onCrearPoc={handleCrearPoc}
            />
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
                {celula.proyectos.filter((p) => p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following").map((p) => (
                  <ProjectCard
                    key={p.id}
                    project={p}
                    dark={false}
                    canCreate={canCreate}
                    pocs={pocsByParent.get(p.id) ?? []}
                    deliveries={deliveriesByParent.get(p.id) ?? []}
                    onEstadoChange={handleEstadoChange}
                    onVpvChange={handleVpvChange}
                    onCrearPoc={handleCrearPoc}
                    onCrearDelivery={handleCrearDelivery}
                  />
                ))}
              </div>
              {proyectos.length === 0 && (
                <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay proyectos cargados para esta célula.</p>
              )}
            </>
          )}
        </div>

        {/* Los POC de logística no van en una sección aparte: se muestran dentro
            de su etapa, que es el eje de organización de esa célula. */}
        {!isLogistica && (
          <div style={{ marginBottom: 56 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 20 }}>
              Pruebas de concepto
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {celula.proyectos.filter((p) => p.type === "POC").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                />
              ))}
            </div>
            {poc.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay POCs cargadas para esta célula.</p>
            )}
          </div>
        )}

        {!isLogistica && (
          <div>
            <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 20 }}>
              Delivery Proyectos
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {celula.proyectos.filter((p) => p.type === "Delivery Proyecto").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  siblingPocs={p.parent_project_id ? pocsByParent.get(p.parent_project_id) ?? [] : []}
                  followings={followingsByDelivery.get(p.id) ?? []}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                  onRelatedPocChange={handleRelatedPocChange}
                  onCrearFollowing={handleCrearFollowing}
                />
              ))}
            </div>
            {celula.proyectos.filter((p) => p.type === "Delivery Proyecto").length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay Delivery Proyectos cargados para esta célula.</p>
            )}
          </div>
        )}

        {!isLogistica && (
          <div style={{ marginTop: 56 }}>
            <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, marginBottom: 20 }}>
              Followings
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {celula.proyectos.filter((p) => p.type === "Following").map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  dark={false}
                  canCreate={canCreate}
                  pocs={[]}
                  onEstadoChange={handleEstadoChange}
                  onVpvChange={handleVpvChange}
                  onCrearPoc={handleCrearPoc}
                />
              ))}
            </div>
            {celula.proyectos.filter((p) => p.type === "Following").length === 0 && (
              <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay Followings cargados para esta célula.</p>
            )}
          </div>
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
