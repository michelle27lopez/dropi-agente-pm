"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle,
  Database,
  RefreshCw,
  ArrowLeft,
  Sparkles,
  Layers,
  ShoppingBag,
  DollarSign,
  Users,
  Compass,
  AlertCircle,
} from "lucide-react";

type MetricDetail = {
  value_num: number;
  value_display: string;
  trend: "up" | "down" | "stable";
  trend_value: string;
  health: "good" | "warning" | "critical" | "neutral";
  level: number;
  name: string;
  unit: string;
};

type MetricsResponse = {
  source: "supabase" | "mock";
  crmSource: "postgres" | "mock";
  country: string;
  days: number;
  summary: Record<string, MetricDetail>;
  history: Record<string, any>[];
};

export default function PMDashboard() {
  const [country, setCountry] = useState<string>("ALL");
  const [days, setDays] = useState<number>(30);
  const [data, setData] = useState<MetricsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [seeding, setSeeding] = useState<boolean>(false);
  const [seedSuccess, setSeedSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<number>(1);
  const [activeChartKey, setActiveChartKey] = useState<string>("gmv");
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/metrics?country=${country}&days=${days}`);
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("Error loading metrics:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [country, days]);

  const handleSeed = async () => {
    setSeeding(true);
    setSeedSuccess(null);
    try {
      const res = await fetch("/api/metrics/seed", { method: "POST" });
      if (res.ok) {
        const json = await res.json();
        setSeedSuccess(json.message);
        setTimeout(() => setSeedSuccess(null), 5000);
        fetchData(); // Volver a cargar para ver los datos de Supabase
      } else {
        const err = await res.json();
        alert(`Error al sembrar: ${err.error || "Error desconocido"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error al conectar con la API de sembrado");
    } finally {
      setSeeding(false);
    }
  };

  if (!isClient) return null;

  const summary = data?.summary || {};
  const history = data?.history || [];
  const source = data?.source || "mock";
  const crmSource = data?.crmSource || "mock";

  // Colores del framework
  const primaryColor = "#F77F00"; // Naranja Dropi
  const activeColor = "#10B981"; // Verde
  const premiumColor = "#6366F1"; // Indigo

  const getTrendIcon = (trend: string, health: string) => {
    if (trend === "up") {
      return <TrendingUp className={`w-4 h-4 ${health === "good" ? "text-emerald-500" : "text-amber-500"}`} />;
    } else if (trend === "down") {
      return <TrendingDown className={`w-4 h-4 ${health === "good" ? "text-emerald-500" : "text-rose-500"}`} />;
    }
    return <Activity className="w-4 h-4 text-gray-400" />;
  };

  const getHealthBadge = (health: string) => {
    switch (health) {
      case "good":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">Saludable</span>;
      case "warning":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 rounded-full">Riesgo</span>;
      case "critical":
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200 rounded-full">Crítico</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold bg-slate-50 text-slate-700 border border-slate-200 rounded-full">Neutro</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-slate-100 transition-colors text-slate-500"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="w-[1px] h-6 bg-slate-200" />
            <div>
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-[#F77F00]/10 text-[#F77F00]">
                  <Layers className="w-4 h-4" />
                </span>
                <h1 className="font-bold text-sm sm:text-base tracking-tight text-slate-800">Metrics Lab</h1>
              </div>
              <p className="text-[10px] text-slate-500 font-medium">Célula Supplier Success · PM Control</p>
            </div>
          </div>

          {/* Database & CRM Status pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/metrics/behavior"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#6366F1]/10 text-[#6366F1] hover:bg-[#6366F1]/20 rounded-full text-[10px] sm:text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Análisis de Comportamiento 📊</span>
            </Link>

            {/* Supabase Status */}
            {source === "supabase" ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-[10px] sm:text-xs font-semibold shadow-sm">
                <Database className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
                <span>Supabase Live</span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-[10px] sm:text-xs font-semibold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span>Supabase Mock</span>
                </div>
                <button
                  onClick={handleSeed}
                  disabled={seeding}
                  className="flex items-center gap-1 px-2.5 py-1.5 bg-[#F77F00] hover:bg-[#d66c00] active:scale-95 disabled:opacity-50 text-white rounded-full text-[10px] sm:text-xs font-bold transition-all shadow-sm shadow-[#F77F00]/20 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${seeding ? "animate-spin" : ""}`} />
                  <span>{seeding ? "Sembrando..." : "Sincronizar"}</span>
                </button>
              </div>
            )}

            {/* CRM Status */}
            {crmSource === "postgres" ? (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-800 text-[10px] sm:text-xs font-semibold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>CRM Live (PG)</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-[10px] sm:text-xs font-semibold shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>CRM Mock</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        
        {/* Banner de Sincronización exitosa */}
        {seedSuccess && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-3 animate-fade-in text-emerald-900 shadow-md">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-sm">Base de Datos Inicializada</p>
              <p className="text-xs text-emerald-700">{seedSuccess}</p>
            </div>
          </div>
        )}

        {/* Controles superiores (Filtros) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">País:</span>
            {[
              { code: "ALL", name: "Todos" },
              { code: "CO", name: "Colombia" },
              { code: "MX", name: "México" },
              { code: "EC", name: "Ecuador" },
            ].map((c) => (
              <button
                key={c.code}
                onClick={() => setCountry(c.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  country === c.code
                    ? "bg-[#F77F00] text-white shadow-sm shadow-[#F77F00]/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">Período:</span>
            {[
              { val: 7, label: "7D" },
              { val: 30, label: "30D" },
              { val: 90, label: "90D" },
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => setDays(d.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  days === d.val
                    ? "bg-slate-800 text-white"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <RefreshCw className="w-8 h-8 text-[#F77F00] animate-spin" />
            <p className="text-slate-500 text-sm font-medium">Cargando métricas de producto...</p>
          </div>
        ) : (
          <div className="mt-6 flex flex-col gap-6">
            
            {/* Niveles del Tablero (La Pirámide de Métricas) */}
            <div className="flex border-b border-slate-200">
              {[
                { level: 1, name: "Nivel 1: Negocio & Impacto", icon: <DollarSign className="w-4 h-4" /> },
                { level: 2, name: "Nivel 2: Adopción & Valor", icon: <ShoppingBag className="w-4 h-4" /> },
                { level: 3, name: "Nivel 3: Eficiencia & Embudos", icon: <Compass className="w-4 h-4" /> },
                { level: 4, name: "Nivel 4: Entradas & Gestión", icon: <Users className="w-4 h-4" /> },
              ].map((t) => (
                <button
                  key={t.level}
                  onClick={() => {
                    setActiveTab(t.level);
                    // Cambiar el gráfico activo por defecto de ese nivel
                    if (t.level === 1) setActiveChartKey("gmv");
                    else if (t.level === 2) setActiveChartKey("activation_rate");
                    else if (t.level === 3) setActiveChartKey("time_to_first_sale");
                    else if (t.level === 4) setActiveChartKey("new_registrations");
                  }}
                  className={`flex items-center gap-2 px-5 py-3 border-b-2 font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                    activeTab === t.level
                      ? "border-[#F77F00] text-[#F77F00]"
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  }`}
                >
                  {t.icon}
                  <span className="hidden md:inline">{t.name}</span>
                  <span className="md:hidden">Nivel {t.level}</span>
                </button>
              ))}
            </div>

            {/* VISTA NIVEL 1 */}
            {activeTab === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-4">
                  {/* GMV Card */}
                  <div
                    onClick={() => setActiveChartKey("gmv")}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      activeChartKey === "gmv"
                        ? "bg-white border-[#F77F00] shadow-md shadow-[#F77F00]/5"
                        : "bg-white border-slate-200/70 shadow-sm hover:border-slate-300"
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00]/5 rounded-bl-full -z-1 group-hover:scale-105 transition-transform" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">GMV de la Célula</p>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                      {summary.gmv?.value_display ?? "$0"}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {getTrendIcon(summary.gmv?.trend, summary.gmv?.health)}
                        <span>{summary.gmv?.trend_value}</span>
                      </div>
                      {getHealthBadge(summary.gmv?.health)}
                    </div>
                  </div>

                  {/* Volumen de Órdenes */}
                  <div
                    onClick={() => setActiveChartKey("orders")}
                    className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                      activeChartKey === "orders"
                        ? "bg-white border-[#F77F00] shadow-md shadow-[#F77F00]/5"
                        : "bg-white border-slate-200/70 shadow-sm hover:border-slate-300"
                    }`}
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00]/5 rounded-bl-full -z-1 group-hover:scale-105 transition-transform" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Órdenes Despachadas</p>
                    <h3 className="text-3xl font-extrabold text-slate-900 mt-2 tracking-tight">
                      {summary.orders?.value_display ?? "0"}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        {getTrendIcon(summary.orders?.trend, summary.orders?.health)}
                        <span>{summary.orders?.trend_value}</span>
                      </div>
                      {getHealthBadge(summary.orders?.health)}
                    </div>
                  </div>
                </div>

                {/* Grafico */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Historial de {activeChartKey === "gmv" ? "GMV ($ USD)" : "Órdenes Totales"}
                      </h4>
                      <p className="text-xs text-slate-400">Tendencia histórica en el período seleccionado</p>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {days} días
                    </span>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorGmv" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={primaryColor} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={primaryColor} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <Tooltip
                          contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}
                          formatter={(value: any) => [
                            activeChartKey === "gmv" ? `$${value.toLocaleString()}` : value,
                            activeChartKey === "gmv" ? "GMV" : "Órdenes",
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey={activeChartKey}
                          stroke={primaryColor}
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorGmv)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA NIVEL 2 */}
            {activeTab === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-4">
                  {[
                    { key: "activation_rate", name: "Tasa de Activación (%)" },
                    { key: "active_suppliers_a15", name: "Activos A15" },
                    { key: "active_suppliers_a30", name: "Activos A30" },
                    { key: "aov", name: "Ticket Promedio (AOV)" },
                    { key: "catalog_health", name: "Salud del Catálogo" },
                  ].map((m) => (
                    <div
                      key={m.key}
                      onClick={() => setActiveChartKey(m.key)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        activeChartKey === m.key
                          ? "bg-white border-[#10B981] shadow-sm shadow-[#10B981]/5"
                          : "bg-white border-slate-200/70 shadow-sm hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.name}</p>
                        <h4 className="text-xl font-extrabold text-slate-800 mt-1">
                          {summary[m.key]?.value_display ?? "0"}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {getTrendIcon(summary[m.key]?.trend, summary[m.key]?.health)}
                          <span>{summary[m.key]?.trend_value}</span>
                        </div>
                        {getHealthBadge(summary[m.key]?.health)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grafico */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Historial de {summary[activeChartKey]?.name || activeChartKey}
                      </h4>
                      <p className="text-xs text-slate-400">Tendencia e indicadores de valor</p>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {days} días
                    </span>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <Tooltip
                          contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }}
                          formatter={(value: any) => [
                            summary[activeChartKey]?.unit === "%"
                              ? `${value}%`
                              : summary[activeChartKey]?.unit === "USD"
                              ? `$${value}`
                              : value,
                            summary[activeChartKey]?.name,
                          ]}
                        />
                        <Line
                          type="monotone"
                          dataKey={activeChartKey}
                          stroke={activeColor}
                          strokeWidth={2.5}
                          dot={{ r: 2 }}
                          activeDot={{ r: 6 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA NIVEL 3 */}
            {activeTab === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-4">
                  {[
                    { key: "time_to_first_sale", name: "Time to First Sale", reverse: true },
                    { key: "checklist_completion_rate", name: "% Completion Checklist", reverse: false },
                    { key: "negotiation_conversion_rate", name: "Conv. de Negociaciones", reverse: false },
                    { key: "external_sync_rate", name: "% Sincronización Externa", reverse: false },
                  ].map((m) => (
                    <div
                      key={m.key}
                      onClick={() => setActiveChartKey(m.key)}
                      className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-3 ${
                        activeChartKey === m.key
                          ? "bg-white border-[#6366F1] shadow-sm shadow-[#6366F1]/5"
                          : "bg-white border-slate-200/70 shadow-sm hover:border-slate-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.name}</p>
                        {getHealthBadge(summary[m.key]?.health)}
                      </div>
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-2xl font-extrabold text-slate-800">
                          {summary[m.key]?.value_display ?? "0"}
                        </h4>
                        <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {getTrendIcon(summary[m.key]?.trend, summary[m.key]?.health)}
                          <span>{summary[m.key]?.trend_value}</span>
                        </div>
                      </div>
                      {/* Simple progress bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-[#6366F1] h-1.5 rounded-full transition-all duration-500"
                          style={{
                            width: `${
                              m.key === "time_to_first_sale"
                                ? Math.max(10, Math.min(100, 100 - (summary[m.key]?.value_num || 0) * 8))
                                : summary[m.key]?.value_num || 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grafico */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Historial de {summary[activeChartKey]?.name || activeChartKey}
                      </h4>
                      <p className="text-xs text-slate-400">Eficiencia y fluidez en el onboarding/conversiones</p>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {days} días
                    </span>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLevel3" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={premiumColor} stopOpacity={0.2} />
                            <stop offset="95%" stopColor={premiumColor} stopOpacity={0.0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <Tooltip
                          contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }}
                          formatter={(value: any) => [
                            summary[activeChartKey]?.unit === "%" ? `${value}%` : `${value} ${summary[activeChartKey]?.unit}`,
                            summary[activeChartKey]?.name,
                          ]}
                        />
                        <Area
                          type="monotone"
                          dataKey={activeChartKey}
                          stroke={premiumColor}
                          strokeWidth={2.5}
                          fillOpacity={1}
                          fill="url(#colorLevel3)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* VISTA NIVEL 4 */}
            {activeTab === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 flex flex-col gap-4">
                  {[
                    { key: "new_registrations", name: "Nuevos Registros" },
                    { key: "ascenso_verificado", name: "Postulaciones Verificado" },
                    { key: "ascenso_premium", name: "Postulaciones Premium" },
                    { key: "aprobacion_visibilidad", name: "Aprobación Visibilidad" },
                    { key: "audit_tat", name: "TAT de Auditoría (horas)" },
                  ].map((m) => (
                    <div
                      key={m.key}
                      onClick={() => setActiveChartKey(m.key)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        activeChartKey === m.key
                          ? "bg-white border-slate-700 shadow-sm"
                          : "bg-white border-slate-200/70 shadow-sm hover:border-slate-300"
                      }`}
                    >
                      <div>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{m.name}</p>
                        <h4 className="text-xl font-extrabold text-slate-800 mt-1">
                          {summary[m.key]?.value_display ?? "0"}
                        </h4>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-0.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          {getTrendIcon(summary[m.key]?.trend, summary[m.key]?.health)}
                          <span>{summary[m.key]?.trend_value}</span>
                        </div>
                        {getHealthBadge(summary[m.key]?.health)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grafico */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/70 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">
                        Historial de {summary[activeChartKey]?.name || activeChartKey}
                      </h4>
                      <p className="text-xs text-slate-400">Control operativo semanal y volumen de entrada</p>
                    </div>
                    <span className="text-xs font-bold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
                      {days} días
                    </span>
                  </div>
                  <div className="h-[280px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={history} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis dataKey="date" tickFormatter={(v) => v.slice(5)} tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <YAxis tick={{ fontSize: 10, fill: "#94a3b8" }} stroke="#e2e8f0" />
                        <Tooltip
                          contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "12px", fontSize: "12px" }}
                        />
                        <Bar
                          dataKey={activeChartKey}
                          fill={
                            activeChartKey === "audit_tat" ? "#EF4444" :
                            activeChartKey === "ascenso_verificado" ? "#6366F1" :
                            activeChartKey === "ascenso_premium" ? "#F59E0B" :
                            activeChartKey === "aprobacion_visibilidad" ? "#10B981" :
                            "#475569"
                          }
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* DIAGNÓSTICOS Y PLAN DE ACCIÓN PLAYBOOK */}
            <div className="mt-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="p-6 bg-slate-800 text-white flex items-center gap-3">
                <span className="p-2 bg-white/10 rounded-xl">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                </span>
                <div>
                  <h3 className="font-bold text-base">Playbook de Gestión de Producto</h3>
                  <p className="text-xs text-slate-300">Monitoreo Semanal & Plan de Acción para Caídas de Métricas</p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="px-6 py-4">Métrica</th>
                      <th className="px-6 py-4">Meta / Línea Base</th>
                      <th className="px-6 py-4">Pregunta Clave de Diagnóstico</th>
                      <th className="px-6 py-4">Plan de Acción (Si la métrica cae)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">GMV & Volumen de Órdenes (N1)</td>
                      <td className="px-6 py-4">Crecimiento Mensual</td>
                      <td className="px-6 py-4">¿Estamos creciendo en volumen o estamos estancados?</td>
                      <td className="px-6 py-4 text-slate-500">Revisar si la caída es por falta de stock de proveedores "Top" o caída en conversión de dropshippers.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">Tasa de Activación (N2)</td>
                      <td className="px-6 py-4">&gt; 65% activados &lt; 30d</td>
                      <td className="px-6 py-4">¿Los proveedores nuevos están llegando a su primer venta rápido?</td>
                      <td className="px-6 py-4 text-slate-500">Validar el embudo de inactividad de UserPilot. Ajustar visibilidad del checklist en UI.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">TAT de Auditoría (N4)</td>
                      <td className="px-6 py-4">&lt; 24 horas</td>
                      <td className="px-6 py-4">¿Tenemos cuellos de botella en la aprobación de nuevos proveedores?</td>
                      <td className="px-6 py-4 text-slate-500">Revisar el pipeline en CRM con Emerson y redistribuir carga de validación.</td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-800">Salud del Catálogo (N2)</td>
                      <td className="px-6 py-4">&gt; 70% catálogo activo</td>
                      <td className="px-6 py-4">¿Tenemos demasiado "ruido" en el catálogo que confunde a dropshippers?</td>
                      <td className="px-6 py-4 text-slate-500">Ajustar insights de clasificación de productos y sugerir depuración de stock inactivo.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
