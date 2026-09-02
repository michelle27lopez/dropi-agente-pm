"use client";

import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Target,
  Filter,
  RefreshCw,
  BarChart3,
  HelpCircle,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Info,
} from "lucide-react";

export default function DashboardPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("90d");
  const [selectedCountry, setSelectedCountry] = useState("TODOS");
  const [metricMode, setMetricMode] = useState<"pm" | "seller">("pm");

  const countryData = [
    { code: "CO", name: "Colombia", income: "$1.61 USD", spread: "$2.61 USD", volume: "5.2M", status: "ok" },
    { code: "MX", name: "México", income: "$2.97 USD", spread: "$6.49 USD", volume: "1.28M", status: "ok" },
    { code: "CL", name: "Chile", income: "$1.60 USD", spread: "$4.45 USD", volume: "318K", status: "ok" },
    { code: "GT", name: "Guatemala", income: "$0.06 USD", spread: "$2.42 USD", volume: "576K", status: "warning", note: "Subconteo instrumental (dropi_shipping_increment_amount vacío)" },
    { code: "EC", name: "Ecuador", income: "$0.85 USD", spread: "$1.95 USD", volume: "286K", status: "notice", note: "Recaudo a pérdida -$0.25 USD/ord" },
    { code: "PY", name: "Paraguay", income: "$1.12 USD", spread: "$2.10 USD", volume: "30K", status: "ok" },
    { code: "PA", name: "Panamá", income: "$1.40 USD", spread: "$3.20 USD", volume: "23K", status: "ok" },
    { code: "CR", name: "Costa Rica", income: "$1.25 USD", spread: "$2.80 USD", volume: "4.4K", status: "ok" },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-dropi text-xs font-bold uppercase tracking-wider">
              Entorno Real Dropi
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              S2 2026 Auditado
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-zinc-900 mt-1">
            Tablero de Control & Pulsómetros Operativos PM
          </h1>
          <p className="text-sm text-zinc-500">
            Vista oficial de métricas validadas sobre Parquet (PROD-1341) con vectores WoW y rangos de control.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-zinc-100 p-1 rounded-xl flex items-center gap-1 border border-zinc-200">
            <button
              onClick={() => setMetricMode("pm")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metricMode === "pm"
                  ? "bg-dropi text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Visión PM (Doble Pulso)
            </button>
            <button
              onClick={() => setMetricMode("seller")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                metricMode === "seller"
                  ? "bg-dropi text-white shadow-xs"
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              Visión Seller
            </button>
          </div>

          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-white border border-zinc-200 text-zinc-700 text-xs font-semibold px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-dropi"
          >
            <option value="90d">Brief: Abril – Junio 2026 (90d)</option>
            <option value="jul">Cierre Julio 2026</option>
            <option value="19m">Histórico Completo (19m)</option>
          </select>
        </div>
      </div>

      {/* Alert Banner for GT Instrumental Bug */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-amber-900 text-xs">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">
            🔴 Salvedad de Instrumentación en Guatemala (GT) & Filtros por Defecto
          </p>
          <p className="text-amber-800 leading-relaxed">
            GT reporta $0,06 USD/orden de ingreso canónico por vacíos en <code className="bg-amber-100 px-1 py-0.5 rounded text-amber-900 font-mono">dropi_shipping_increment_amount</code>, a pesar de mover 576k entregas con spread de flete normal ($2,42 USD). No presentar a Finanzas sin este caveat. Las tarjetas de esta vista fijan por defecto el período del brief (Abr-Jun) para no mezclar 19 meses acumulados.
          </p>
        </div>
      </div>

      {/* Grid of Pulsómetros Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Pulsómetro 1: Activación Bruta */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-pink-300 transition-colors">
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Activación Bruta (Con 1ª Venta Creada)</h3>
                  <p className="text-xs text-zinc-400">Sellers registrados que crearon su primer pedido en plataforma</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-pink-50 text-pink-700 text-[10px] font-extrabold uppercase">
                Creación Inicial
              </span>
            </div>

            {/* Doble Pulso */}
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">7.7%</span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> ▲ +0.3 pp vs. Semana Pasada
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">📈 Creció +0.3 pp respecto a la semana pasada</p>
              </div>
              
              <div className="text-right bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-zinc-500 block">Pulso Semanal</span>
                <span className="text-lg font-extrabold text-pink-600">8.9%</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Creación esta semana</span>
              </div>
            </div>

            {/* Bullet Chart Visual */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                <span className="text-zinc-500">Actual: 7.7%</span>
                <span className="text-emerald-600 font-bold">Meta S2: 12.0% (Falta 4.3 pp)</span>
              </div>
              <div className="h-3 bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200">
                <div className="absolute left-0 top-0 bottom-0 w-[64.1%] bg-gradient-to-r from-pink-400 to-pink-600 rounded-full" />
                <div className="absolute left-[64.1%] top-0 bottom-0 w-1 bg-zinc-900 shadow-md" />
              </div>
            </div>
          </div>

          {/* Footer Card info */}
          <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-500">
            <span>📈 Tendencia: <strong className="text-emerald-600 font-bold"> ▂▃▅▄▅▇█ (+0.8pp Q3)</strong></span>
            <span>⏱️ Status: <strong className="text-zinc-900 font-bold">Falta 4.3 pp</strong></span>
          </div>
        </div>

        {/* Pulsómetro 2: Activación Neta */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors">
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Activación Neta (Con 1ª Venta Entregada)</h3>
                  <p className="text-xs text-zinc-400">Sellers registrados que lograron entregar su 1ª orden</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase">
                Entrega Exitosa
              </span>
            </div>

            {/* Doble Pulso */}
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">4.8%</span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> ▲ +0.5 pp vs. Semana Pasada
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">📈 Creció +0.5 pp respecto a la semana pasada</p>
              </div>
              
              <div className="text-right bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-zinc-500 block">Pulso Semanal</span>
                <span className="text-lg font-extrabold text-dropi">6.2%</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Cohorte esta semana</span>
              </div>
            </div>

            {/* Bullet Chart Visual */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                <span className="text-zinc-500">Actual: 4.8%</span>
                <span className="text-emerald-600 font-bold">Meta S2: 8.0% (Falta 3.2 pp)</span>
              </div>
              <div className="h-3 bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200">
                <div className="absolute left-0 top-0 bottom-0 w-[60%] bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full" />
                <div className="absolute left-[60%] top-0 bottom-0 w-1 bg-zinc-900 shadow-md" />
              </div>
            </div>
          </div>

          {/* Footer Card info */}
          <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-500">
            <span>📈 Tendencia: <strong className="text-emerald-600 font-bold"> ▂▃▅▄▅▇█ (+1.4pp Q3)</strong></span>
            <span>⏱️ Status: <strong className="text-zinc-900 font-bold">Falta 3.2 pp</strong></span>
          </div>
        </div>

        {/* Pulsómetro 3: Retención Real Multi-Día */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-orange-300 transition-colors">
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-orange-50 text-dropi flex items-center justify-center font-bold">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Retención Real (Venta en Días Posteriores)</h3>
                  <p className="text-xs text-zinc-400">Sellers que regresan a vender en un día distinto al primero</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-dropi text-[10px] font-extrabold uppercase">
                Recurrencia Día 2+
              </span>
            </div>

            {/* Doble Pulso */}
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">30.0%</span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> ▲ +1.2 pp vs. Mes Anterior
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">🌱 Subió +1.2 pp respecto al cohorte del mes anterior</p>
              </div>

              <div className="text-right bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-zinc-500 block">Pulso Semanal</span>
                <span className="text-lg font-extrabold text-emerald-600">34.5%</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Recurrencia activa</span>
              </div>
            </div>

            {/* Bullet Chart Visual */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                <span className="text-zinc-500">Actual: 30.0%</span>
                <span className="text-emerald-600 font-bold">Meta S2: 75.0%</span>
              </div>
              <div className="h-3 bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200">
                <div className="absolute left-0 top-0 bottom-0 w-[40%] bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
                <div className="absolute left-[40%] top-0 bottom-0 w-1 bg-zinc-900 shadow-md" />
              </div>
            </div>
          </div>

          {/* Footer Card info */}
          <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-500">
            <span className="text-amber-700 font-medium">ℹ️ 68% compra el mismo día (Carga inicial)</span>
            <span>⏱️ Status: <strong className="text-orange-600 font-bold">Día 2+ Activo</strong></span>
          </div>
        </div>

        {/* Pulsómetro 4: TTV Neto */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 transition-colors">
          <div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">TTV Neto (Días Hasta 1ª Venta Entregada)</h3>
                  <p className="text-xs text-zinc-400">Mediana de días entre Registro y 1ª orden ENTREGADA</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase">
                🟢 En Meta S2
              </span>
            </div>

            {/* Doble Pulso */}
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">12.1 <span className="text-lg">días</span></span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> ▼ -1.8 días vs. Mes Anterior
                  </span>
                </div>
                <p className="text-[11px] font-semibold text-emerald-600 mt-0.5">⚡ Se redujo 1.8 días la latencia respecto al mes anterior</p>
              </div>

              <div className="text-right bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-zinc-500 block">Pulso Semanal</span>
                <span className="text-lg font-extrabold text-emerald-600">10.4 d</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Velocidad entregas</span>
              </div>
            </div>

            {/* Bullet Chart Visual */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                <span className="text-emerald-600 font-bold">Meta S2: &lt; 12.0d</span>
                <span className="text-zinc-900 font-bold">Actual: 12.1d</span>
              </div>
              <div className="h-3 bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200">
                <div className="absolute left-0 top-0 bottom-0 w-[99.1%] bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full" />
                <div className="absolute left-[99.1%] top-0 bottom-0 w-1 bg-zinc-900 shadow-md" />
              </div>
            </div>
          </div>

          {/* Footer Card info */}
          <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-500">
            <span>📉 Tendencia: <strong className="text-emerald-600 font-bold">█▇▆▅▄▃▂ (-3.9d Q3)</strong></span>
            <span>⏱️ Status: <strong className="text-emerald-600 font-bold">🟢 Cumpliendo Meta</strong></span>
          </div>
        </div>

      </div>

      {/* Hero Card Estratégica: Mediana de Órdenes por Seller Activo & Segmentación de Volumen */}
      <div className="bg-white border-l-4 border-l-indigo-600 border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider border border-indigo-100">
                Palanca de LTV & Profundidad de Cuenta
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider border border-emerald-200">
                ▲ +1.4 ord/mes vs. Mes Anterior
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-zinc-900 mt-1 flex items-center gap-2">
              🛍️ Mediana de Órdenes por Seller Activo (Profundidad del Seller)
            </h3>
            <p className="text-xs text-zinc-500">
              Mediana del volumen mensual de ventas que genera un dropshipper activo en Dropi.
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-xl text-right">
            <span className="text-[10px] font-bold text-zinc-400 uppercase block">Mediana Global</span>
            <span className="text-2xl font-extrabold text-indigo-600">14.2 <span className="text-sm font-bold text-zinc-600">ord/mes</span></span>
            <span className="text-[11px] font-bold text-emerald-600 block">Meta S2: 15.0 ord (Falta 0.8 ord)</span>
          </div>
        </div>

        {/* Strategic Breakdown Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-dashed border-zinc-200">
          
          {/* Segment 1: Novatos */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-zinc-800">🥉 Nivel 1: Novato (1–100 ord)</span>
              <span className="text-[10px] font-bold text-zinc-600 bg-zinc-200 px-1.5 py-0.5 rounded">69.8% Base</span>
            </div>
            <div className="text-xl font-extrabold text-zinc-900">11.833 sellers</div>
            <p className="text-[11px] text-zinc-500 leading-normal pt-1">
              Mueven el <strong>6.2% del volumen total</strong> (32.3k órdenes). Grupo con mayor tasa de fricción en onboarding.
            </p>
          </div>

          {/* Segment 2: Exploradores */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-blue-900">🥈 Nivel 2: Explorador (101–500 ord)</span>
              <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-1.5 py-0.5 rounded">18.8% Base</span>
            </div>
            <div className="text-xl font-extrabold text-blue-950">3.181 sellers</div>
            <p className="text-[11px] text-blue-900 leading-normal pt-1">
              Mueven el <strong>15.4% del volumen total</strong> (80.6k órdenes). <em>Superar 100 ord reduce churn 82%.</em>
            </p>
          </div>

          {/* Segment 3: Master & Leyendas */}
          <div className="bg-orange-50/60 border border-orange-200 rounded-xl p-4 space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-xs font-extrabold text-orange-950">🥇 Nivel 3+ Master & Leyenda (&gt;500 ord)</span>
              <span className="text-[10px] font-bold text-orange-800 bg-orange-100 px-1.5 py-0.5 rounded">11.4% Base</span>
            </div>
            <div className="text-xl font-extrabold text-orange-950">1.929 sellers</div>
            <p className="text-[11px] text-orange-900 leading-normal pt-1">
              Concentran el <strong>78.5% del volumen Pareto</strong> (411.9k órdenes). Núcleo del volumen de la plataforma.
            </p>
          </div>

        </div>

        {/* Footer Metric Bar */}
        <div className="pt-3 border-t border-zinc-100 flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-zinc-600 gap-2">
          <div>
            💵 <strong>Ticket Promedio Venta Seller:</strong> $65.800 COP · 💵 <strong>GMV Generado por Seller Mediano:</strong> $934.360 COP/mes
          </div>
          <div className="font-bold text-indigo-600">
            📈 Promedio Ponderado General: 42.6 ord/mes
          </div>
        </div>
      </div>

      {/* Pulsómetro Extra: TTV Bruto */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-300 transition-colors">
        <div>
          <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <BarChart3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900">Time-to-Value (TTV) Bruto</h3>
                  <p className="text-xs text-zinc-400">Mediana de días entre Registro y 1ª orden CREADA</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-extrabold uppercase">
                Creación Inicial
              </span>
            </div>

            {/* Doble Pulso */}
            <div className="mt-4 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-zinc-900">5.2 <span className="text-lg">días</span></span>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> -0.8 d WoW
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-0.5">Creación de 1ª orden</p>
              </div>

              <div className="text-right bg-zinc-50 border border-zinc-100 p-2.5 rounded-xl">
                <span className="text-xs font-bold text-zinc-500 block">Pulso Semanal</span>
                <span className="text-lg font-extrabold text-purple-600">4.1 d</span>
                <span className="text-[10px] text-emerald-600 font-semibold block">Aceleración novatos</span>
              </div>
            </div>

            {/* Bullet Chart Visual */}
            <div className="mt-5 space-y-1.5">
              <div className="flex justify-between text-[11px] font-semibold text-zinc-500">
                <span className="text-emerald-600 font-bold">Meta: &lt;4.0 d</span>
                <span className="text-zinc-900 font-bold">Actual: 5.2 d</span>
                <span className="text-red-500">Techo Max: 8.0 d</span>
              </div>
              <div className="h-3 bg-zinc-100 rounded-full overflow-hidden relative border border-zinc-200">
                <div className="absolute left-0 top-0 bottom-0 w-[65%] bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full" />
                <div className="absolute left-[65%] top-0 bottom-0 w-1 bg-zinc-900 shadow-md" />
              </div>
            </div>
          </div>

          {/* Footer Card info */}
          <div className="pt-3 border-t border-zinc-100 flex justify-between items-center text-xs text-zinc-500">
            <span>📈 Foco: <strong>Onboarding Page Pilot</strong></span>
            <span>⏱️ Status: <strong className="text-amber-600 font-bold">🟨 Cerca (+1.2d)</strong></span>
          </div>
        </div>

      {/* Breakdown Table by Country with GT Caveat */}
      <div className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-zinc-900">
              Desglose de Ingreso y Margen Dropi por País (USD)
            </h3>
            <p className="text-xs text-zinc-500">
              Reconciliación financiera trazada a $0,00 de diferencia con TRM 100% mapped.
            </p>
          </div>
          <span className="text-xs font-semibold text-zinc-400 bg-zinc-100 px-3 py-1.5 rounded-lg">
            8 Meses Acumulado 2026
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 text-zinc-500 uppercase tracking-wider font-bold border-b border-zinc-200">
              <tr>
                <th className="py-3 px-4">País</th>
                <th className="py-3 px-4">Ingreso Dropi / Orden</th>
                <th className="py-3 px-4">Spread Flete Real</th>
                <th className="py-3 px-4">Volumen Entregas</th>
                <th className="py-3 px-4">Diagnóstico / Salvedad de BD</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-700">
              {countryData.map((c, i) => (
                <tr
                  key={i}
                  className={`hover:bg-zinc-50/80 transition-colors ${
                    c.status === "warning" ? "bg-amber-50/40" : ""
                  }`}
                >
                  <td className="py-3.5 px-4 font-bold flex items-center gap-2 text-zinc-900">
                    <span className="w-6 h-4 bg-zinc-200 rounded text-center text-[10px] font-mono leading-4">
                      {c.code}
                    </span>
                    {c.name}
                  </td>
                  <td className={`py-3.5 px-4 font-extrabold ${c.status === "warning" ? "text-red-600" : "text-zinc-900"}`}>
                    {c.income}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-emerald-700">{c.spread}</td>
                  <td className="py-3.5 px-4 font-medium text-zinc-600">{c.volume}</td>
                  <td className="py-3.5 px-4">
                    {c.status === "warning" ? (
                      <span className="inline-flex items-center text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" /> {c.note}
                      </span>
                    ) : c.status === "notice" ? (
                      <span className="inline-flex items-center text-zinc-700 font-semibold bg-zinc-100 px-2 py-0.5 rounded text-[11px]">
                        <Info className="w-3.5 h-3.5 mr-1 text-zinc-500" /> {c.note}
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Fórmula Canónica Validada
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
