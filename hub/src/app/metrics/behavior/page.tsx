"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  ArrowLeft,
  Users,
  Calendar,
  Activity,
  AlertTriangle,
  Smartphone,
  Globe,
  MessageSquare,
  Search,
  RefreshCw,
  Compass,
  Laptop,
  CheckCircle,
  Clock,
  Filter,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type Cohort = {
  name: string;
  value: number;
  color: string;
};

type ItemData = {
  name: string;
  value: number;
  color?: string;
};

type ChurnTier = {
  key: string;
  name: string;
  range: string;
  count: number;
  percentage: number;
  avgSessions: number;
  avgLifespan: number;
  action: string;
  color: string;
};

type ActivationCohort = {
  key: string;
  name: string;
  description: string;
  count: number;
  percentage: number;
  color: string;
};

type WeeklyCohort = {
  weekStart: string;
  size: number;
  retention: (number | null)[];
};

type AgeCohort = {
  name: string;
  count: number;
  avgSessions: number;
  activeRate: number;
};

type RiskSupplier = {
  name: string;
  email: string;
  phone: string;
  country: string;
  web_sessions: number;
  days_inactive: number;
  signed_up: string;
  status: "dormant" | "critical" | "churned";
  priority: "high" | "medium" | "low";
  survey_role: string | null;
  survey_stage: string | null;
  survey_volume: string | null;
  survey_purpose: string | null;
  survey_brand_sales: string | null;
  survey_shipping_pref: string | null;
  survey_sell_pref: string | null;
  survey_source: "comunidades" | "huerfanos" | null;
  referred_by: string | null;
  belong_to_community: string | null;
  owner_of_community: string | null;
  resolved_community: string | null;
};

type CommunityMetric = {
  name: string;
  count: number;
  activeCount: number;
  activeRate: number;
  verifiedRate: number;
  avgSessions: number;
  billingRate: number;
  supplierRate: number;
  highVolumeRate: number;
  bounceRate: number;
  avgInactiveDays: number;
  avgLifespanDays: number;
};

type SurveyStats = {
  totalWithSurvey: number;
  roles: ItemData[];
  volumes: ItemData[];
  sources: ItemData[];
  crossSegments: {
    supplierComunidad: number;
    supplierHuerfano: number;
    brandComunidad: number;
    brandHuerfano: number;
  };
};

type BehaviorResponse = {
  source: "supabase" | "mock";
  country: string;
  stats: {
    totalSuppliers: number;
    avgSessions: number;
    activeRate: number;
    verifiedRate: number;
    dormantCount: number;
    churnedCount: number;
    churnRate: number;
  };
  cohorts: Cohort[];
  devices: ItemData[];
  operatingSystems: ItemData[];
  countries: ItemData[];
  churnTiers: ChurnTier[];
  activationCohorts: ActivationCohort[];
  weeklyCohorts: WeeklyCohort[];
  ageCohorts: AgeCohort[];
  riskSuppliers: RiskSupplier[];
  communities: CommunityMetric[];
  surveyStats: SurveyStats;
};

export default function BehaviorDashboard() {
  const [country, setCountry] = useState<string>("ALL");
  const [activeTab, setActiveTab] = useState<string>("churn");
  const [data, setData] = useState<BehaviorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isClient, setIsClient] = useState<boolean>(false);

  // Filtros del Directorio de Recuperación
  const [search, setSearch] = useState<string>("");
  const [filterWeek, setFilterWeek] = useState<string>("ALL");
  const [filterRisk, setFilterRisk] = useState<string>("ALL");
  const [filterSource, setFilterSource] = useState<string>("ALL");
  const [filterVolume, setFilterVolume] = useState<string>("ALL");
  const [filterPriority, setFilterPriority] = useState<string>("ALL");
  const [filterCommunity, setFilterCommunity] = useState<string>("ALL");
  const [chartMetric, setChartMetric] = useState<"count" | "activeRate" | "billingRate" | "avgSessions" | "bounceRate" | "avgInactiveDays" | "avgLifespanDays">("count");

  // Toggle del Heatmap: % de retención vs cantidad absoluta
  const [heatmapMode, setHeatmapMode] = useState<"percentage" | "count">("percentage");

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchBehaviorData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/metrics/behavior?country=${country}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Error loading behavior metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBehaviorData();
  }, [country]);

  if (!isClient) return null;

  const stats = data?.stats || {
    totalSuppliers: 0,
    avgSessions: 0,
    activeRate: 0,
    verifiedRate: 0,
    dormantCount: 0,
    churnedCount: 0,
    churnRate: 0,
  };
  const cohorts = data?.cohorts || [];
  const devices = data?.devices || [];
  const countries = data?.countries || [];
  const churnTiers = data?.churnTiers || [];
  const activationCohorts = data?.activationCohorts || [];
  const weeklyCohorts = data?.weeklyCohorts || [];
  const ageCohorts = data?.ageCohorts || [];
  const riskSuppliers = data?.riskSuppliers || [];
  const surveyStats = data?.surveyStats || {
    totalWithSurvey: 0,
    roles: [],
    volumes: [],
    sources: [],
    crossSegments: {
      supplierComunidad: 0,
      supplierHuerfano: 0,
      brandComunidad: 0,
      brandHuerfano: 0,
    },
  };
  const source = data?.source || "mock";

  // Helper para obtener el string del lunes de una semana dada
  const getMondayStr = (dateStr: string): string => {
    const d = new Date(dateStr);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, "0")}-${String(monday.getDate()).padStart(2, "0")}`;
  };

  // Formato legible para fechas de semanas (ej. 2026-05-19 -> May 19)
  const formatWeekStr = (dateStr: string) => {
    const parts = dateStr.split("-");
    if (parts.length !== 3) return dateStr;
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const month = months[parseInt(parts[1], 10) - 1];
    return `${parts[2]} de ${month}`;
  };

  // Extraer semanas únicas de la lista de riesgos para el filtro
  const uniqueSignupWeeks: string[] = [];
  riskSuppliers.forEach((s) => {
    if (s.signed_up) {
      const mondayStr = getMondayStr(s.signed_up);
      if (!uniqueSignupWeeks.includes(mondayStr)) {
        uniqueSignupWeeks.push(mondayStr);
      }
    }
  });
  uniqueSignupWeeks.sort().reverse();

  // Extraer comunidades únicas de los datos de comportamiento para el filtro
  const uniqueCommunities = data?.communities.map((c) => c.name) || [];

  // Filtrado de proveedores en riesgo (Directorio)
  const filteredRisk = riskSuppliers.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      s.email.toLowerCase().includes(search.trim().toLowerCase());

    const matchesWeek = (() => {
      if (filterWeek === "ALL") return true;
      return getMondayStr(s.signed_up) === filterWeek;
    })();

    const matchesRisk = (() => {
      if (filterRisk === "ALL") return true;
      return s.status === filterRisk;
    })();

    const matchesSource = (() => {
      if (filterSource === "ALL") return true;
      return s.survey_source === filterSource;
    })();

    const matchesVolume = (() => {
      if (filterVolume === "ALL") return true;
      const vol = s.survey_volume || s.survey_brand_sales || "";
      if (filterVolume === "over1000") return vol.includes("Más de 1.000");
      if (filterVolume === "301to1000") return vol.includes("301 a 1.000");
      if (filterVolume === "51to300") return vol.includes("51 a 300");
      if (filterVolume === "under50") return vol.includes("Menos de 50");
      if (filterVolume === "not_selling") return vol.includes("Aún no vendo");
      if (filterVolume === "not_managing") return vol.includes("Aún no gestiono") || vol.includes("Aún no gestiona");
      if (filterVolume === "no_data") return vol === "";
      return true;
    })();

    const matchesPriority = (() => {
      if (filterPriority === "ALL") return true;
      return s.priority === filterPriority;
    })();

    const matchesCommunity = (() => {
      if (filterCommunity === "ALL") return true;
      return s.resolved_community === filterCommunity;
    })();

    return matchesSearch && matchesWeek && matchesRisk && matchesSource && matchesVolume && matchesPriority && matchesCommunity;
  });

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#EC4899", "#8B5CF6", "#14B8A6", "#3B82F6"];

  // Generador de mensajes personalizados para WhatsApp según perfil de uso y volumen de productos
  const getWhatsAppLink = (phone: string, name: string, sessions: number, volStr: string | null) => {
    const cleanPhone = phone.replace(/\s+/g, "").replace(/\+/g, "");
    let finalPhone = cleanPhone;
    if (cleanPhone.startsWith("3") && cleanPhone.length === 10) {
      finalPhone = `57${cleanPhone}`;
    }

    const valueContext = volStr ? ` Vimos en la encuesta que gestionas un gran volumen de productos (${volStr}).` : "";
    let message = "";
    
    if (sessions <= 1) {
      message = `Hola ${name}, te saludamos del equipo de Dropi.${valueContext} Vimos que creaste tu cuenta de proveedor pero solo pudiste ingresar una vez. ¿Tuviste algún inconveniente técnico subiendo tus productos o integrando tus envíos? Nos gustaría agendar una llamada rápida para dejar tu cuenta totalmente activa.`;
    } else if (sessions <= 3) {
      message = `Hola ${name}, te saludamos de Dropi.${valueContext} Notamos que ingresaste un par de veces para explorar el panel pero no has vuelto recientemente. Queremos ayudarte a publicar tus productos en el catálogo de dropshipping para que empieces a vender. ¿Te sirve una sesión de 5 minutos de soporte?`;
    } else {
      message = `Hola ${name}, te saludamos de Dropi.${valueContext} Vimos que ya estabas utilizando el panel activamente, pero no registras visitas últimamente. ¿Hay algo en lo que podamos ayudarte para impulsar tu stock o mejorar tus despachos con nosotros?`;
    }

    return `https://wa.me/${finalPhone}?text=${encodeURIComponent(message)}`;
  };

  // Helper para asignar color a los cuadritos del heatmap
  const getCohortBgColor = (pct: number | null) => {
    if (pct === null) return "bg-slate-100/40 text-slate-300 border-dashed border-slate-200";
    if (pct === 100) return "bg-indigo-600 text-white font-bold";
    if (pct >= 80) return "bg-indigo-500 text-white font-bold";
    if (pct >= 60) return "bg-indigo-400 text-white";
    if (pct >= 40) return "bg-indigo-300 text-indigo-950";
    if (pct >= 20) return "bg-indigo-200 text-indigo-900";
    if (pct >= 5) return "bg-indigo-100 text-indigo-800";
    return "bg-indigo-50/50 text-indigo-700/60";
  };

  // Encontrar insights de comunidades destacadas (excluyendo Orgánico y requiriendo un volumen mínimo de 5 registros para ser representativo)
  const nonOrganicComs = data?.communities.filter(c => c.name !== "Orgánico / Sin comunidad" && c.count >= 5) || [];
  
  const bestAcquisition = nonOrganicComs.length > 0 
    ? [...nonOrganicComs].sort((a, b) => b.count - a.count)[0] 
    : null;
    
  const bestActivation = nonOrganicComs.length > 0 
    ? [...nonOrganicComs].sort((a, b) => b.activeRate - a.activeRate)[0] 
    : null;
    
  const lowestBounce = nonOrganicComs.length > 0 
    ? [...nonOrganicComs].sort((a, b) => a.bounceRate - b.bounceRate)[0] 
    : null;
    
  const bestBilling = nonOrganicComs.length > 0 
    ? [...nonOrganicComs].sort((a, b) => b.billingRate - a.billingRate)[0] 
    : null;

  const chartMetricOptions = [
    { key: "count", name: "Registrados", color: "#8B5CF6", unit: "proveedores" },
    { key: "activeRate", name: "Tasa de Activación", color: "#10B981", unit: "%" },
    { key: "billingRate", name: "Facturación Configurada", color: "#F59E0B", unit: "%" },
    { key: "avgSessions", name: "Sesiones Promedio", color: "#3B82F6", unit: "ses" },
    { key: "bounceRate", name: "Tasa de Rebote", color: "#EF4444", unit: "%" },
    { key: "avgInactiveDays", name: "Inactividad Promedio", color: "#64748B", unit: "días" },
    { key: "avgLifespanDays", name: "Permanencia Promedio", color: "#EC4899", unit: "días" },
  ] as const;

  const activeMetricOption = chartMetricOptions.find((opt) => opt.key === chartMetric) || chartMetricOptions[0];

  const chartData = [...nonOrganicComs]
    .sort((a, b) => {
      if (chartMetric === "bounceRate" || chartMetric === "avgInactiveDays") {
        // Para inactividad y rebote, a veces se prefiere ver de menor a mayor,
        // pero para mantener coherencia en barras visuales ordenamos de mayor a menor (los peores o de mayor volumen).
        // Dejamos descendente para destacar los picos de inactividad o rebote.
        return b[chartMetric] - a[chartMetric];
      }
      return b[chartMetric] - a[chartMetric];
    })
    .slice(0, 10);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 backdrop-blur-md bg-white/95 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/metrics"
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-[1px] h-6 bg-slate-200" />
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-indigo-500/10 text-indigo-600">
                  <Compass className="w-4 h-4" />
                </span>
                <h1 className="font-bold text-sm sm:text-base tracking-tight text-slate-800">
                  Supplier Behavior Lab
                </h1>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">
                Análisis de Retención, Inactividad y Abandono (Userpilot 90D)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {source === "supabase" ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-xs font-semibold shadow-sm">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Supabase Live ({stats.totalSuppliers} rows)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-semibold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Modo Simulación (Mock)</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Filtro General de País */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Filtrar por País:</span>
            {[
              { code: "ALL", name: "Todos" },
              { code: "CO", name: "Colombia" },
              { code: "MX", name: "México" },
              { code: "EC", name: "Ecuador" },
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  country === c.code
                    ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400 font-medium">
            Referencia de análisis fija al **25 de Mayo, 2026**
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Calculando métricas y cohortes...</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -z-1 group-hover:scale-105 transition-transform" />
                <div className="flex items-center gap-2 text-slate-400">
                  <Users className="w-4 h-4" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Total Registrados</p>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {stats.totalSuppliers.toLocaleString("es-CO")}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1.5">En los últimos 90 días</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -z-1 group-hover:scale-105 transition-transform" />
                <div className="flex items-center gap-2 text-slate-400">
                  <Activity className="w-4 h-4" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Sesiones Promedio</p>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {stats.avgSessions}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1.5">Sesiones acumuladas por usuario</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-slate-50 rounded-bl-full -z-1 group-hover:scale-105 transition-transform" />
                <div className="flex items-center gap-2 text-slate-400">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Tasa de Activación</p>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mt-1 tracking-tight">
                  {stats.activeRate}%
                </h3>
                <p className="text-[10px] text-slate-400 mt-1.5">% con más de 7 sesiones web</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-16 h-16 bg-rose-50 rounded-bl-full -z-1 group-hover:scale-105 transition-transform" />
                <div className="flex items-center gap-2 text-rose-500/80">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">Tasa de Churn</p>
                </div>
                <h3 className="text-3xl font-extrabold text-rose-600 mt-1 tracking-tight">
                  {stats.churnRate}%
                </h3>
                <p className="text-[10px] text-rose-500/70 mt-1.5">
                  {stats.churnedCount} proveedores inactivos &gt;14d
                </p>
              </div>
            </div>

            {/* Selector de Pestañas de Análisis */}
            <div className="flex border-b border-slate-200 bg-white p-1 rounded-xl border border-slate-200/60 shadow-sm">
              {[
                { id: "churn", name: "Inactividad y Churn", icon: <AlertTriangle className="w-4 h-4" /> },
                { id: "cohorts", name: "Matriz de Cohortes", icon: <Calendar className="w-4 h-4" /> },
                { id: "survey_insights", name: "Perfil de Encuestas 📊", icon: <Sparkles className="w-4 h-4" /> },
                { id: "demographics", name: "Comportamiento y Demografía", icon: <Activity className="w-4 h-4" /> },
                { id: "recovery", name: "Directorio de Recuperación", icon: <Users className="w-4 h-4" /> },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  {tab.icon}
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* PESTAÑA 1: INACTIVIDAD Y CHURN */}
            {activeTab === "churn" && (
              <div className="flex flex-col gap-6">
                
                {/* Cohortes de Activación Temprana */}
                <div>
                  <h3 className="text-sm font-bold text-slate-800 mb-3 uppercase tracking-wider">
                    Análisis de Activación Temprana (Se registraron y...)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {activationCohorts.map((c) => (
                      <div
                        key={c.key}
                        className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between"
                        style={{ borderLeft: `4px solid ${c.color}` }}
                      >
                        <div>
                          <span
                            className="px-2 py-0.5 text-[9px] font-bold rounded-full"
                            style={{ backgroundColor: `${c.color}15`, color: c.color }}
                          >
                            {c.name}
                          </span>
                          <h4 className="text-2xl font-extrabold text-slate-800 mt-2">
                            {c.percentage}%
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {c.description}
                          </p>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-[11px] font-semibold text-slate-400">
                          <span>Volumen:</span>
                          <span className="text-slate-700">{c.count} proveedores</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tabla de Niveles de Churn por Inactividad (Multitier) */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                  <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Segmentación de Churn por Inactividad (Multitier)</h4>
                      <p className="text-xs text-slate-400">Clasificación detallada según el tiempo transcurrido desde su última sesión</p>
                    </div>
                    <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded-full uppercase">
                      5 Niveles de Acción
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          <th className="px-6 py-4">Nivel / Estado</th>
                          <th className="px-6 py-4">Inactividad</th>
                          <th className="px-6 py-4 text-center">Proveedores</th>
                          <th className="px-6 py-4 text-center">% de la Base</th>
                          <th className="px-6 py-4 text-center">Sesiones Prom.</th>
                          <th className="px-6 py-4 text-center">Vida Media (días)</th>
                          <th className="px-6 py-4">Acción Recomendada</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                        {churnTiers.map((tier) => (
                          <tr key={tier.key} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: tier.color }} />
                              <span>{tier.name}</span>
                            </td>
                            <td className="px-6 py-4 text-slate-500 font-medium">{tier.range}</td>
                            <td className="px-6 py-4 text-center font-bold text-slate-800">
                              {tier.count.toLocaleString("es-CO")}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-slate-700">
                                {tier.percentage}%
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center font-semibold text-slate-700">{tier.avgSessions}</td>
                            <td className="px-6 py-4 text-center font-semibold text-slate-700">{tier.avgLifespan} d</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-[11px] text-slate-500">{tier.action}</span>
                                {tier.key !== "active" && (
                                  <button
                                    onClick={() => {
                                      setActiveTab("recovery");
                                      setFilterRisk(
                                        tier.key === "slightRisk"
                                          ? "dormant"
                                          : tier.key === "churnRisk"
                                          ? "dormant"
                                          : tier.key === "highRisk"
                                          ? "critical"
                                          : "churned"
                                      );
                                    }}
                                    className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <span>Ver lista</span>
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* PESTAÑA 2: MATRIZ DE COHORTES */}
            {activeTab === "cohorts" && (
              <div className="flex flex-col gap-6">
                
                {/* Cohort Heatmap Table */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Matriz de Cohortes por Semana de Registro</h4>
                      <p className="text-xs text-slate-400">
                        Retención porcentual o absoluta de los proveedores según las semanas transcurridas desde su registro.
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200/50 self-start">
                      <button
                        onClick={() => setHeatmapMode("percentage")}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          heatmapMode === "percentage" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                        }`}
                      >
                        % Retención
                      </button>
                      <button
                        onClick={() => setHeatmapMode("count")}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                          heatmapMode === "count" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                        }`}
                      >
                        Usuarios
                      </button>
                    </div>
                  </div>

                  {/* Tabla Heatmap */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-center border-collapse min-w-[800px]">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-500 uppercase">
                          <th className="px-3 py-3 text-left">Semana de Registro</th>
                          <th className="px-3 py-3 text-right pr-6">Tamaño</th>
                          {Array.from({ length: 13 }).map((_, wIdx) => (
                            <th key={wIdx} className="px-2 py-3">W{wIdx}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {weeklyCohorts.length > 0 ? (
                          weeklyCohorts.map((cohort, idx) => (
                            <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50/20 text-xs">
                              <td className="px-3 py-3 text-left font-bold text-slate-800">
                                {formatWeekStr(cohort.weekStart)}
                              </td>
                              <td className="px-3 py-3 text-right pr-6 font-bold text-slate-500">
                                {cohort.size}
                              </td>
                              {cohort.retention.map((val, wIdx) => {
                                const displayVal =
                                  val === null
                                    ? "-"
                                    : heatmapMode === "percentage"
                                    ? `${val}%`
                                    : Math.round((val / 100) * cohort.size);
                                return (
                                  <td
                                    key={wIdx}
                                    className={`px-2 py-3 border-r border-slate-100/50 ${getCohortBgColor(val)}`}
                                  >
                                    {displayVal}
                                  </td>
                                );
                              })}
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={15} className="py-8 text-center text-slate-400">
                              No hay cohortes de registro disponibles.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5 text-xs text-slate-500">
                    <Clock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-700">¿Cómo leer esta matriz?</p>
                      <p className="mt-0.5">
                        Cada fila representa el grupo de proveedores registrados en esa semana. Las columnas (W0 a W12) muestran su evolución. 
                        W0 es el momento de registro (100% activos). Las semanas vacías con guión (-) corresponden a períodos futuros que la cohorte aún no ha alcanzado.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Comportamiento por Antigüedad */}
                <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm p-5">
                  <h4 className="font-bold text-slate-800 text-sm mb-4">Comportamiento Agregado por Edad de Cuenta</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {ageCohorts.map((cohort, index) => (
                      <div key={index} className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center">
                        <p className="text-xs font-bold text-slate-500 uppercase">{cohort.name}</p>
                        <h5 className="text-xl font-extrabold text-slate-800 mt-2">{cohort.count} users</h5>
                        
                        <div className="mt-4 pt-3 border-t border-slate-200/50 grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase">Sesiones Prom.</p>
                            <p className="font-bold text-slate-700 mt-0.5">{cohort.avgSessions}</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase">% Conexión 7d</p>
                            <p className="font-bold text-emerald-600 mt-0.5">{cohort.activeRate}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* PESTAÑA 3: PERFIL DE ENCUESTAS (INSIGHTS) */}
            {activeTab === "survey_insights" && (
              <div className="flex flex-col gap-6">
                
                {/* Header de Encuestas */}
                <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-slate-800 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                      <h3 className="font-bold text-base sm:text-lg">Insights de Perfilado Comercial de Proveedores</h3>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Métricas acumuladas a partir de las respuestas registradas en las encuestas de Dropi.
                    </p>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-xl text-center border border-white/5">
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Encuestas Cruzadas</p>
                    <p className="text-xl font-extrabold text-indigo-300 mt-0.5">
                      {surveyStats.totalWithSurvey.toLocaleString("es-CO")}
                    </p>
                  </div>
                </div>

                {/* Graficos de Encuestas */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* Rol o Intención */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Intención de Uso (Roles)</h4>
                      <p className="text-xs text-slate-400">¿Cómo se perfilan en la plataforma?</p>
                    </div>

                    <div className="h-[180px] w-full relative flex items-center justify-center mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={surveyStats.roles}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {surveyStats.roles.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center">
                        <Users className="w-5 h-5 text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Roles</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-4">
                      {surveyStats.roles.map((r, index) => (
                        <div key={r.name} className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-50 pb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: r.color || COLORS[index % COLORS.length] }} />
                            <span className="font-medium">{r.name}</span>
                          </div>
                          <span className="font-bold text-slate-800">
                            {r.value.toLocaleString("es-CO")} ({surveyStats.totalWithSurvey > 0 ? Math.round((r.value / surveyStats.totalWithSurvey) * 100) : 0}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Volumen Declarado (Rangos de Pedidos/Productos) */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between lg:col-span-2">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Volumen de Pedidos/Ventas Mensuales</h4>
                      <p className="text-xs text-slate-400">Distribución de rangos de cantidad de transacciones declaradas</p>
                    </div>

                    <div className="h-[280px] w-full mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={surveyStats.volumes} layout="vertical" margin={{ top: 10, right: 20, left: 60, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                          <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} stroke="#e2e8f0" />
                          <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fill: "#475569" }} width={150} stroke="#e2e8f0" />
                          <Tooltip
                            contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px" }}
                          />
                          <Bar dataKey="value" fill="#6366F1" radius={[0, 4, 4, 0]} barSize={16}>
                            {surveyStats.volumes.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Origen de Registro */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Origen de Registro</h4>
                      <p className="text-xs text-slate-400">¿De qué canal o embudo provienen?</p>
                    </div>

                    <div className="h-[180px] w-full relative flex items-center justify-center mt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={surveyStats.sources}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={65}
                            paddingAngle={3}
                            dataKey="value"
                          >
                            {surveyStats.sources.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute flex flex-col items-center justify-center">
                        <Globe className="w-5 h-5 text-slate-400" />
                        <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Canales</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mt-4">
                      {surveyStats.sources.map((src, index) => (
                        <div key={src.name} className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-50 pb-1">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ background: src.color || COLORS[index % COLORS.length] }} />
                            <span className="font-medium">{src.name}</span>
                          </div>
                          <span className="font-bold text-slate-800">
                            {src.value.toLocaleString("es-CO")} ({surveyStats.totalWithSurvey > 0 ? Math.round((src.value / surveyStats.totalWithSurvey) * 100) : 0}%)
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cruzado de Segmentos (Canal y Rol) */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Cruzado de Segmentos (Rol y Canal)</h4>
                      <p className="text-xs text-slate-400">Distribución cruzada de Proveedores vs. Marcas según comunidades / huérfanos</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                      <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 text-center">
                        <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider">Proveedores en Comunidades</p>
                        <h5 className="text-2xl font-extrabold text-indigo-950 mt-1.5">
                          {surveyStats.crossSegments.supplierComunidad.toLocaleString("es-CO")}
                        </h5>
                        <p className="text-[10px] text-indigo-700/70 mt-1">
                          {surveyStats.totalWithSurvey > 0 ? Math.round((surveyStats.crossSegments.supplierComunidad / surveyStats.totalWithSurvey) * 100) : 0}% de los encuestados
                        </p>
                      </div>

                      <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100/50 text-center">
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Proveedores Huérfanos</p>
                        <h5 className="text-2xl font-extrabold text-emerald-950 mt-1.5">
                          {surveyStats.crossSegments.supplierHuerfano.toLocaleString("es-CO")}
                        </h5>
                        <p className="text-[10px] text-emerald-700/70 mt-1">
                          {surveyStats.totalWithSurvey > 0 ? Math.round((surveyStats.crossSegments.supplierHuerfano / surveyStats.totalWithSurvey) * 100) : 0}% de los encuestados
                        </p>
                      </div>

                      <div className="bg-purple-50/50 p-4 rounded-xl border border-purple-100/50 text-center">
                        <p className="text-[10px] font-bold text-purple-600 uppercase tracking-wider">Marcas en Comunidades</p>
                        <h5 className="text-2xl font-extrabold text-purple-950 mt-1.5">
                          {surveyStats.crossSegments.brandComunidad.toLocaleString("es-CO")}
                        </h5>
                        <p className="text-[10px] text-purple-700/70 mt-1">
                          {surveyStats.totalWithSurvey > 0 ? Math.round((surveyStats.crossSegments.brandComunidad / surveyStats.totalWithSurvey) * 100) : 0}% de los encuestados
                        </p>
                      </div>

                      <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 text-center">
                        <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Marcas Huérfanas</p>
                        <h5 className="text-2xl font-extrabold text-amber-950 mt-1.5">
                          {surveyStats.crossSegments.brandHuerfano.toLocaleString("es-CO")}
                        </h5>
                        <p className="text-[10px] text-amber-700/70 mt-1">
                          {surveyStats.totalWithSurvey > 0 ? Math.round((surveyStats.crossSegments.brandHuerfano / surveyStats.totalWithSurvey) * 100) : 0}% de los encuestados
                        </p>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Rendimiento por Comunidades */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm mt-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-slate-100 pb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">Rendimiento y Penetración de Comunidades</h4>
                      <p className="text-xs text-slate-400">Atribución de registros por comunidades directas, propietarios o referidos</p>
                    </div>
                    <span className="text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 px-2.5 py-1 rounded-full uppercase">
                      Adquisición y Activación
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Top 10 Comunidades Chart */}
                    <div className="lg:col-span-5 border-r border-slate-100 pr-0 lg:pr-6">
                      <p className="text-xs font-bold text-slate-600 mb-2 uppercase tracking-wider">
                        Top 10 Comunidades por {activeMetricOption.name}
                      </p>
                      
                      {/* Control Selector de Métrica */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-4">
                        {chartMetricOptions.map((opt) => (
                          <button
                            key={opt.key}
                            onClick={() => setChartMetric(opt.key)}
                            className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                              chartMetric === opt.key
                                ? "bg-slate-900 text-white shadow-sm"
                                : "bg-slate-50 text-slate-500 hover:bg-slate-100"
                            }`}
                          >
                            {opt.name}
                          </button>
                        ))}
                      </div>

                      <div className="h-[320px] w-full">
                        {chartData && chartData.length > 0 ? (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={chartData}
                              layout="vertical"
                              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis type="number" tick={{ fontSize: 10, fill: "#64748b" }} stroke="#e2e8f0" />
                              <YAxis
                                dataKey="name"
                                type="category"
                                tick={{ fontSize: 9, fill: "#475569" }}
                                width={120}
                                stroke="#e2e8f0"
                              />
                              <Tooltip
                                contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "11px" }}
                                formatter={(value: any) => [`${value} ${activeMetricOption.unit}`, activeMetricOption.name]}
                              />
                              <Bar dataKey={chartMetric} name={activeMetricOption.name} fill={activeMetricOption.color} radius={[0, 4, 4, 0]} barSize={12}>
                                {chartData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-400 text-xs italic">
                            No hay datos de comunidades disponibles
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tarjeta de Resumen / Comunidades Destacadas */}
                    <div className="lg:col-span-7 flex flex-col justify-between bg-slate-50/50 p-5 rounded-2xl border border-slate-200/50">
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-4 uppercase tracking-wider">Líderes y Comunidades Destacadas</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Mejor Adquisición */}
                          {bestAcquisition && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm flex items-start gap-3">
                              <span className="p-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold shrink-0">📈</span>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Mayor Captación</p>
                                <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[170px]" title={bestAcquisition.name}>{bestAcquisition.name}</p>
                                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                                  {bestAcquisition.count} registrados
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Mejor Activación */}
                          {bestActivation && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm flex items-start gap-3">
                              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold shrink-0">⚡</span>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Mejor Activación (Retención)</p>
                                <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[170px]" title={bestActivation.name}>{bestActivation.name}</p>
                                <p className="text-[11px] text-emerald-600 mt-1 font-bold">
                                  {bestActivation.activeRate}% entran y continúan
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Menor Rebote */}
                          {lowestBounce && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm flex items-start gap-3">
                              <span className="p-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold shrink-0">🎯</span>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Menor Rebote (Bounce)</p>
                                <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[170px]" title={lowestBounce.name}>{lowestBounce.name}</p>
                                <p className="text-[11px] text-slate-500 mt-1 font-semibold">
                                  Solo <span className="text-rose-600 font-bold">{lowestBounce.bounceRate}%</span> abandonan al registrarse
                                </p>
                              </div>
                            </div>
                          )}

                          {/* Mejor Facturación */}
                          {bestBilling && (
                            <div className="bg-white p-4 rounded-xl border border-slate-200/50 shadow-sm flex items-start gap-3">
                              <span className="p-2 bg-amber-50 text-amber-600 rounded-lg text-xs font-bold shrink-0">💳</span>
                              <div>
                                <p className="text-[10px] text-slate-400 font-bold uppercase">Facturación Lista</p>
                                <p className="text-xs font-bold text-slate-800 mt-0.5 truncate max-w-[170px]" title={bestBilling.name}>{bestBilling.name}</p>
                                <p className="text-[11px] text-amber-600 mt-1 font-bold">
                                  {bestBilling.billingRate}% con facturación configurada
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-200/40 text-[10px] text-slate-400 font-semibold italic">
                        * Muestra comunidades con mínimo 5 registros. Se excluye el flujo puramente orgánico.
                      </div>
                    </div>
                  </div>

                  {/* Tabla de Métricas de Comunidades Detallada (Full Width) */}
                  <div className="mt-6 border-t border-slate-100 pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">Métricas Analíticas Completas de Conversión y Uso</p>
                      <span className="text-[10px] text-slate-400 font-medium">Mostrando {data?.communities.length} comunidades / canales detectados</span>
                    </div>

                    <div className="overflow-x-auto border border-slate-200/80 rounded-2xl shadow-sm">
                      <table className="w-full text-left border-collapse min-w-[900px]">
                        <thead>
                          <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            <th className="px-6 py-4">Comunidad / Canal</th>
                            <th className="px-6 py-4 text-center">Registrados</th>
                            <th className="px-6 py-4 text-center">Activos (&gt;7 ses)</th>
                            <th className="px-6 py-4 text-center">Tasa Activación</th>
                            <th className="px-6 py-4 text-center">Verificados</th>
                            <th className="px-6 py-4 text-center">Rebote (1 ses)</th>
                            <th className="px-6 py-4 text-center">Sesiones Prom.</th>
                            <th className="px-6 py-4 text-center">Facturación Lista</th>
                            <th className="px-6 py-4 text-center">Perfil Proveedor</th>
                            <th className="px-6 py-4 text-center">Alto Volumen</th>
                            <th className="px-6 py-4 text-center">Inactividad Prom.</th>
                            <th className="px-6 py-4 text-center">Permanencia Prom.</th>
                            <th className="px-6 py-4 text-right">Recuperación</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                          {data?.communities && data.communities.length > 0 ? (
                            data.communities.map((c, idx) => {
                              const isOrganic = c.name === "Orgánico / Sin comunidad";
                              return (
                                <tr key={idx} className={`hover:bg-slate-50/50 transition-colors ${isOrganic ? "bg-slate-50/20 font-medium" : ""}`}>
                                  <td className="px-6 py-4 font-bold text-slate-800 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full shrink-0 ${isOrganic ? "bg-slate-400" : "bg-purple-500"}`} />
                                    <span>{c.name}</span>
                                  </td>
                                  <td className="px-6 py-4 text-center font-bold text-slate-800">
                                    {c.count.toLocaleString("es-CO")}
                                  </td>
                                  <td className="px-6 py-4 text-center text-slate-500">
                                    {c.activeCount.toLocaleString("es-CO")}
                                  </td>
                                  
                                  {/* Tasa Activación */}
                                  <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                      c.activeRate >= 50
                                        ? "bg-emerald-100 text-emerald-800"
                                        : c.activeRate >= 25
                                        ? "bg-emerald-50 text-emerald-700"
                                        : c.activeRate >= 10
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-rose-50 text-rose-700"
                                    }`}>
                                      {c.activeRate}%
                                    </span>
                                  </td>

                                  {/* Tasa Verificados */}
                                  <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                      c.verifiedRate >= 30
                                        ? "bg-indigo-100 text-indigo-800"
                                        : c.verifiedRate >= 10
                                        ? "bg-indigo-50/70 text-indigo-700"
                                        : "bg-slate-100 text-slate-500"
                                    }`}>
                                      {c.verifiedRate}%
                                    </span>
                                  </td>
 
                                  {/* Rebote (Bounce) */}
                                  <td className="px-6 py-4 text-center">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                                      c.bounceRate > 60
                                        ? "bg-red-50 text-red-600"
                                        : c.bounceRate > 30
                                        ? "bg-amber-50 text-amber-600"
                                        : "bg-green-50 text-green-600"
                                    }`}>
                                      {c.bounceRate}%
                                    </span>
                                  </td>
 
                                  {/* Sesiones Promedio */}
                                  <td className="px-6 py-4 text-center font-semibold text-slate-700">
                                    {c.avgSessions}
                                  </td>
 
                                  {/* Facturación Lista */}
                                  <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-amber-500 h-full" style={{ width: `${c.billingRate}%` }} />
                                      </div>
                                      <span className="text-[10px] text-slate-500 font-bold w-7 text-right">{c.billingRate}%</span>
                                    </div>
                                  </td>
 
                                  {/* Perfil Proveedor */}
                                  <td className="px-6 py-4 text-center font-medium text-slate-600">
                                    {c.supplierRate}%
                                  </td>
 
                                  {/* Alto Volumen */}
                                  <td className="px-6 py-4 text-center">
                                    <div className="flex items-center justify-center gap-1">
                                      <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                        <div className="bg-indigo-500 h-full" style={{ width: `${c.highVolumeRate}%` }} />
                                      </div>
                                      <span className="text-[10px] text-slate-500 font-bold w-7 text-right">{c.highVolumeRate}%</span>
                                    </div>
                                  </td>
 
                                  {/* Inactividad Promedio */}
                                  <td className="px-6 py-4 text-center">
                                    <span className={`font-bold ${c.avgInactiveDays > 14 ? "text-rose-600" : "text-slate-700"}`}>
                                      {c.avgInactiveDays}
                                    </span>{" "}
                                    días
                                  </td>

                                  {/* Permanencia Promedio */}
                                  <td className="px-6 py-4 text-center">
                                    <span className={`font-bold ${c.avgLifespanDays >= 30 ? "text-emerald-600" : "text-slate-700"}`}>
                                      {c.avgLifespanDays}
                                    </span>{" "}
                                    días
                                  </td>
 
                                  {/* Acción */}
                                  <td className="px-6 py-4 text-right">
                                    <button
                                      onClick={() => {
                                        setFilterCommunity(c.name);
                                        setActiveTab("recovery");
                                      }}
                                      className="inline-flex items-center gap-0.5 text-[10px] font-bold text-indigo-600 hover:text-indigo-800 hover:underline cursor-pointer"
                                    >
                                      <span>Ver lista</span>
                                      <ArrowRight className="w-3 h-3" />
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={13} className="px-6 py-12 text-center text-slate-400 italic">
                                No hay datos de métricas analíticas de comunidades
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PESTAÑA 4: COMPORTAMIENTO Y DEMOGRAFÍA */}
            {activeTab === "demographics" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Distribución de Frecuencia */}
                <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Distribución de Frecuencia de Sesiones</h4>
                    <p className="text-xs text-slate-400">Segmentación de proveedores basada en la cantidad acumulada de visitas</p>
                  </div>
                  
                  <div className="h-[250px] w-full mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={cohorts} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#64748b" }} stroke="#e2e8f0" />
                        <YAxis tick={{ fontSize: 10, fill: "#64748b" }} stroke="#e2e8f0" />
                        <Tooltip
                          contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }}
                        />
                        <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]}>
                          {cohorts.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Dispositivos Donut */}
                <div className="lg:col-span-1 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Tipo de Dispositivo</h4>
                    <p className="text-xs text-slate-400">¿Desde qué dispositivos acceden?</p>
                  </div>

                  <div className="h-[180px] w-full relative flex items-center justify-center mt-2">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={devices}
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={70}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {devices.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute flex flex-col items-center justify-center">
                      <Laptop className="w-5 h-5 text-slate-400" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase mt-0.5">Acceso</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mt-2">
                    {devices.map((d, index) => (
                      <div key={d.name} className="flex items-center justify-between text-xs text-slate-600 border-b border-slate-50 pb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[index % COLORS.length] }} />
                          <span className="font-medium">{d.name}</span>
                        </div>
                        <span className="font-bold text-slate-800">
                          {d.value.toLocaleString("es-CO")} ({Math.round((d.value / stats.totalSuppliers) * 100)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Distribución por Países */}
                <div className="lg:col-span-3 bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm">
                  <h4 className="font-bold text-slate-800 text-sm mb-4">Ubicación Geográfica de Proveedores</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {countries.map((c, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="p-2 bg-indigo-500/10 text-indigo-600 rounded-lg">
                          <Globe className="w-4 h-4" />
                        </span>
                        <div>
                          <p className="text-xs font-bold text-slate-800">{c.name}</p>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {c.value.toLocaleString("es-CO")} proveedores ({Math.round((c.value / stats.totalSuppliers) * 100)}%)
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* PESTAÑA 5: DIRECTORIO DE RECUPERACIÓN */}
            {activeTab === "recovery" && (
              <div className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
                <div className="p-5 bg-slate-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-white/10 rounded-xl text-amber-400">
                      <AlertTriangle className="w-5 h-5 animate-pulse" />
                    </span>
                    <div>
                      <h3 className="font-bold text-sm sm:text-base">Centro de Recuperación de Proveedores</h3>
                      <p className="text-xs text-slate-400">
                        Lista de proveedores inactivos en riesgo. Muestra datos de encuestas y resalta a los de alto potencial.
                      </p>
                    </div>
                  </div>

                  {/* Input Search */}
                  <div className="relative w-full md:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Buscar por bodega o email..."
                      className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-slate-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Barra de Filtros Avanzados */}
                <div className="bg-slate-50 p-4 border-b border-slate-100 flex flex-wrap items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5">
                    <Filter className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-500">Filtrar lista:</span>
                  </div>

                  {/* Filtro de Semana de Registro */}
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400">Semana:</span>
                    <select
                      value={filterWeek}
                      onChange={(e) => setFilterWeek(e.target.value)}
                      className="focus:outline-none font-bold text-slate-700 bg-transparent cursor-pointer"
                    >
                      <option value="ALL">Todas las semanas</option>
                      {uniqueSignupWeeks.map((week) => (
                        <option key={week} value={week}>
                          Semana del {formatWeekStr(week)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro de Nivel de Riesgo */}
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400">Nivel de Riesgo:</span>
                    <select
                      value={filterRisk}
                      onChange={(e) => setFilterRisk(e.target.value)}
                      className="focus:outline-none font-bold text-slate-700 bg-transparent cursor-pointer"
                    >
                      <option value="ALL">Todos los riesgos</option>
                      <option value="dormant">Riesgo Leve/Medio (Inactivo 8-14d)</option>
                      <option value="critical">Riesgo Crítico (Inactivo 15-30d)</option>
                      <option value="churned">Abandono Confirmado (Inactivo 30d+)</option>
                    </select>
                  </div>

                  {/* Filtro de Origen de Encuesta */}
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400">Origen Encuesta:</span>
                    <select
                      value={filterSource}
                      onChange={(e) => setFilterSource(e.target.value)}
                      className="focus:outline-none font-bold text-slate-700 bg-transparent cursor-pointer"
                    >
                      <option value="ALL">Todos</option>
                      <option value="comunidades">Comunidades</option>
                      <option value="huerfanos">Huérfanos / Orgánicos</option>
                    </select>
                  </div>

                  {/* Filtro de Comunidad Específica */}
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400">Comunidad:</span>
                    <select
                      value={filterCommunity}
                      onChange={(e) => setFilterCommunity(e.target.value)}
                      className="focus:outline-none font-bold text-slate-700 bg-transparent cursor-pointer text-xs max-w-[150px]"
                    >
                      <option value="ALL">Todas las Comunidades</option>
                      {uniqueCommunities.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Filtro de Volumen de la Encuesta */}
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400">Volumen Comercial:</span>
                    <select
                      value={filterVolume}
                      onChange={(e) => setFilterVolume(e.target.value)}
                      className="focus:outline-none font-bold text-slate-700 bg-transparent cursor-pointer text-xs"
                    >
                      <option value="ALL">Todos los Volúmenes</option>
                      <option value="over1000">Más de 1.000 al mes</option>
                      <option value="301to1000">301 a 1.000 al mes</option>
                      <option value="51to300">51 a 300 al mes</option>
                      <option value="under50">Menos de 50 al mes</option>
                      <option value="not_selling">Aún no vendo (Marcas)</option>
                      <option value="not_managing">Aún no gestiono pedidos</option>
                      <option value="no_data">Sin datos (No completó)</option>
                    </select>
                  </div>

                  {/* Filtro de Prioridad Comercial */}
                  <div className="flex items-center gap-1 bg-white px-2.5 py-1.5 rounded-lg border border-slate-200 shadow-sm">
                    <span className="text-slate-400">Prioridad:</span>
                    <select
                      value={filterPriority}
                      onChange={(e) => setFilterPriority(e.target.value)}
                      className="focus:outline-none font-bold text-slate-700 bg-transparent cursor-pointer"
                    >
                      <option value="ALL">Todas</option>
                      <option value="high">🔥 Alta Prioridad (Proveedor + Gran Vol)</option>
                      <option value="medium">⚡ Media Priority</option>
                      <option value="low">Baja Prioridad</option>
                    </select>
                  </div>

                  <div className="ml-auto text-slate-400 font-medium">
                    Mostrando <span className="font-bold text-slate-700">{filteredRisk.length}</span> resultados
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="px-6 py-4">Prioridad / Proveedor</th>
                        <th className="px-6 py-4">Perfil Encuesta (Dropi)</th>
                        <th className="px-6 py-4">Volumen Declarado</th>
                        <th className="px-6 py-4">Origen / Canal</th>
                        <th className="px-6 py-4 text-center">País / Sesiones</th>
                        <th className="px-6 py-4 text-center">Días Inactivo</th>
                        <th className="px-6 py-4 text-center">Estado</th>
                        <th className="px-6 py-4 text-right">Recuperación</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                      {filteredRisk.length > 0 ? (
                        filteredRisk.slice(0, 100).map((s, idx) => {
                          const hasSurvey = s.survey_role !== null;
                          const isHigh = s.priority === "high";
                          const isMed = s.priority === "medium";
                          return (
                            <tr key={idx} className={`hover:bg-slate-50/50 transition-colors ${isHigh ? "bg-red-50/20" : ""}`}>
                              {/* Prioridad y Proveedor */}
                              <td className="px-6 py-4">
                                <div className="flex items-start gap-2">
                                  {isHigh ? (
                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-red-100 text-red-700 rounded-full flex items-center gap-0.5 shrink-0 animate-pulse">
                                      🔥 Alta
                                    </span>
                                  ) : isMed ? (
                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-700 rounded-full shrink-0">
                                      ⚡ Media
                                    </span>
                                  ) : (
                                    <span className="px-2 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-500 rounded-full shrink-0">
                                      Baja
                                    </span>
                                  )}
                                  <div>
                                    <p className="font-bold text-slate-800">{s.name}</p>
                                    <p className="text-[10px] text-slate-400">{s.email}</p>
                                  </div>
                                </div>
                              </td>

                              {/* Perfil Encuesta */}
                              <td className="px-6 py-4 max-w-[200px]">
                                {hasSurvey ? (
                                  <div>
                                    <p className="font-semibold text-slate-700 truncate" title={s.survey_role || ""}>
                                      {s.survey_role && s.survey_role.includes("Proveedor") ? "Proveedor" : "Marca/Emprendedor"}
                                    </p>
                                    <p className="text-[10px] text-slate-400 truncate" title={s.survey_purpose || s.survey_sell_pref || ""}>
                                      {s.survey_purpose || s.survey_sell_pref || "-"}
                                    </p>
                                  </div>
                                ) : (
                                  <span className="text-slate-400 italic">Sin encuesta completada</span>
                                )}
                              </td>

                              {/* Volumen Declarado */}
                              <td className="px-6 py-4">
                                {hasSurvey ? (
                                  <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                                    (s.survey_volume || s.survey_brand_sales || "").includes("1.000") || (s.survey_volume || s.survey_brand_sales || "").includes("301 a 1.000")
                                      ? "bg-indigo-50 text-indigo-700 border border-indigo-100"
                                      : "bg-slate-100 text-slate-600"
                                  }`}>
                                    {s.survey_volume || s.survey_brand_sales || "No indica"}
                                  </span>
                                ) : (
                                  <span className="text-slate-400">-</span>
                                )}
                              </td>

                              {/* Origen / Canal */}
                              <td className="px-6 py-4">
                                <div className="flex flex-col gap-0.5">
                                  {s.survey_source ? (
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider self-start ${
                                      s.survey_source === "comunidades" 
                                        ? "bg-purple-50 text-purple-700 border border-purple-100" 
                                        : "bg-slate-100 text-slate-600"
                                    }`}>
                                      {s.survey_source === "comunidades" ? "Comunidad" : "Huérfano"}
                                    </span>
                                  ) : (
                                    <span className="text-slate-400 italic">Orgánico</span>
                                  )}
                                  {s.resolved_community && s.resolved_community !== "Orgánico / Sin comunidad" && (
                                    <span className="text-[10px] font-bold text-purple-600 truncate max-w-[130px]" title={s.resolved_community}>
                                      {s.resolved_community}
                                    </span>
                                  )}
                                </div>
                              </td>

                              {/* País / Sesiones */}
                              <td className="px-6 py-4 text-center">
                                <div className="flex flex-col items-center">
                                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-700">
                                    <Globe className="w-3 h-3 text-slate-400" />
                                    <span>{s.country}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-400 mt-0.5">
                                    {s.web_sessions} {s.web_sessions === 1 ? "sesión" : "sesiones"}
                                  </span>
                                </div>
                              </td>

                              {/* Inactividad */}
                              <td className="px-6 py-4 text-center">
                                <span className="font-bold text-slate-900">{s.days_inactive}</span> días
                              </td>

                              {/* Estado */}
                              <td className="px-6 py-4 text-center">
                                {s.status === "churned" ? (
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-red-50 text-red-700 border border-red-100 rounded-full">
                                    Abandono
                                  </span>
                                ) : s.status === "critical" ? (
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-50 text-rose-700 border border-rose-100 rounded-full">
                                    Crítico
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100 rounded-full">
                                    Churn &gt;10d
                                  </span>
                                )}
                              </td>

                              {/* Contacto */}
                              <td className="px-6 py-4 text-right">
                                {s.phone && s.phone !== "-" ? (
                                  <a
                                    href={getWhatsAppLink(s.phone, s.name, s.web_sessions, s.survey_volume || s.survey_brand_sales)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white rounded-lg text-[10px] font-bold transition-all shadow-sm shadow-emerald-500/10 cursor-pointer"
                                  >
                                    <MessageSquare className="w-3.5 h-3.5" />
                                    <span>Contactar</span>
                                  </a>
                                ) : (
                                  <span className="text-[10px] text-slate-400">Sin teléfono</span>
                                )}
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-6 py-12 text-center text-slate-400 font-medium">
                            No se encontraron proveedores inactivos que coincidan con la búsqueda o filtros.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {filteredRisk.length > 100 && (
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                    Mostrando los primeros 100 registros. Refine su búsqueda o use filtros para ver el resto.
                  </div>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
