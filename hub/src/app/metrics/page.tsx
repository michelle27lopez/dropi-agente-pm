"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Layers,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Upload,
  ArrowRight,
  Compass,
  Users,
  Settings,
  Terminal,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

type SyncStatus = {
  count: number;
  lastSync: string | null;
  hasApiKey: boolean;
};

export default function MetricsHubPage() {
  const [status, setStatus] = useState<SyncStatus | null>(null);
  const [loadingStatus, setLoadingStatus] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{
    success: boolean;
    message: string;
    output?: string;
    errorOutput?: string;
  } | null>(null);
  const [showLogs, setShowLogs] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    // Por defecto hace 90 días
    const d = new Date();
    d.setDate(d.getDate() - 90);
    return d.toISOString().split("T")[0];
  });

  const fetchStatus = async () => {
    setLoadingStatus(true);
    try {
      const res = await fetch("/api/metrics/sync");
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error("Failed to fetch sync status:", e);
    } finally {
      setLoadingStatus(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const triggerApiSync = async () => {
    setSyncing(true);
    setSyncResult(null);
    setShowLogs(false);
    try {
      const res = await fetch("/api/metrics/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "api", startDate }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSyncResult({
          success: true,
          message: "Sincronización de API completada exitosamente.",
          output: data.output,
          errorOutput: data.errorOutput,
        });
        fetchStatus();
      } else {
        setSyncResult({
          success: false,
          message: data.error || "Ocurrió un error inesperado al sincronizar.",
          output: data.output,
          errorOutput: data.details || data.errorOutput,
        });
      }
    } catch (e: any) {
      setSyncResult({
        success: false,
        message: e.message || "Fallo en la comunicación con el servidor.",
      });
    } finally {
      setSyncing(false);
      setShowLogs(true);
    }
  };

  const handleCsvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSyncing(true);
    setSyncResult(null);
    setShowLogs(false);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvData = event.target?.result as string;
        try {
          const res = await fetch("/api/metrics/sync", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ mode: "csv", csvData }),
          });
          const data = await res.json();
          if (res.ok && data.success) {
            setSyncResult({
              success: true,
              message: "Carga y procesamiento de CSV completado exitosamente.",
              output: data.output,
              errorOutput: data.errorOutput,
            });
            fetchStatus();
          } else {
            setSyncResult({
              success: false,
              message: data.error || "Error al procesar el archivo CSV.",
              output: data.output,
              errorOutput: data.details || data.errorOutput,
            });
          }
        } catch (err: any) {
          setSyncResult({
            success: false,
            message: err.message || "Error al enviar archivo al servidor.",
          });
        } finally {
          setSyncing(false);
          setShowLogs(true);
        }
      };
      reader.readAsText(file);
    } catch (err: any) {
      console.error(err);
      setSyncResult({
        success: false,
        message: "Error al leer el archivo local.",
      });
      setSyncing(false);
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "Nunca";
    try {
      const date = new Date(dateStr);
      return date.toLocaleString("es-CO", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-16">
      {/* Background blur accents for rich aesthetic styling */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-[400px] right-1/4 w-[400px] h-[400px] bg-[#F77F00]/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="bg-slate-950/70 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-base">
              📊
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-base tracking-tight text-white">
                Dropi PM Analytics Hub
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">
                Célula Brands Success · Centro de Proyectos
              </p>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            ← Volver al Portal principal
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 relative z-10">
        
        {/* Title and Intro */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="px-3 py-1 text-[10px] font-bold tracking-widest text-indigo-400 bg-indigo-500/10 rounded-full uppercase border border-indigo-500/20">
            Metrics Project Control
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-4 tracking-tight leading-none">
            Centro de Proyectos de Métricas
          </h2>
          <p className="text-sm text-slate-400 mt-4 leading-relaxed">
            Monitorea el comportamiento, activación y métricas operativas de nuestros proveedores en Dropi.
            Selecciona un proyecto de análisis para generar y visualizar diagramas.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          
          {/* Card 1: Brands Success */}
          <div className="bg-slate-950/40 border border-slate-800 hover:border-[#F77F00]/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#F77F00]/5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#F77F00]/5 rounded-bl-full -z-10 group-hover:scale-105 transition-transform duration-300" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#F77F00]/10 flex items-center justify-center text-2xl text-[#F77F00]">
                  📈
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#F77F00] bg-[#F77F00]/10 border border-[#F77F00]/20 px-2.5 py-1 rounded-full">
                  Negocio & Operaciones
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Métricas de Brands Success
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Visualización detallada de KPIs de negocio: GMV, volumen de órdenes despachadas, tasas de activación mensuales y TAT de auditorías operativas en CRM.
              </p>
              
              {/* Quick stats placeholder or values */}
              <div className="grid grid-cols-3 gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800/40 mb-6 text-center">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">GMV</p>
                  <p className="text-xs font-extrabold text-slate-300 mt-0.5">Live CRM</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Órdenes</p>
                  <p className="text-xs font-extrabold text-slate-300 mt-0.5">Nivel 1</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Activación</p>
                  <p className="text-xs font-extrabold text-slate-300 mt-0.5">Nivel 2</p>
                </div>
              </div>
            </div>
            <Link
              href="/metrics/supplier-success"
              className="w-full py-3 bg-gradient-to-r from-[#F77F00] to-[#d66c00] hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-[#F77F00]/10 hover:shadow-[#F77F00]/25 flex items-center justify-center gap-2"
            >
              <span>Abrir Métricas de Negocio</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Card 2: Userpilot Behavior */}
          <div className="bg-slate-950/40 border border-slate-800 hover:border-indigo-500/50 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-bl-full -z-10 group-hover:scale-105 transition-transform duration-300" />
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-600/10 flex items-center justify-center text-2xl text-indigo-400">
                  🧭
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-full">
                  Comportamiento & Retención
                </span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Análisis de Comportamiento (Userpilot)
              </h3>
              <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                Análisis de retención por cohortes de 90 días, rebotes en onboarding, segmentación de inactividad, respuestas de encuestas de marca/proveedor y directorio de WhatsApp para reactivación.
              </p>
              
              {/* Quick stats placeholder or values */}
              <div className="grid grid-cols-3 gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800/40 mb-6 text-center">
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Retención</p>
                  <p className="text-xs font-extrabold text-slate-300 mt-0.5">Heatmap</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Inactividad</p>
                  <p className="text-xs font-extrabold text-slate-300 mt-0.5">5 Niveles</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-500 uppercase">Recuperación</p>
                  <p className="text-xs font-extrabold text-slate-300 mt-0.5">Directo WA</p>
                </div>
              </div>
            </div>
            <Link
              href="/metrics/behavior"
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-700 hover:brightness-110 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/25 flex items-center justify-center gap-2"
            >
              <span>Abrir Análisis de Comportamiento</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>

        {/* Sync Control Center (Data Management) */}
        <div className="bg-slate-950/60 border border-slate-850 rounded-2xl p-6 md:p-8 mt-16 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 text-[9px] font-bold text-slate-700 uppercase flex items-center gap-1">
            <Database className="w-3 h-3 text-indigo-500" />
            Supabase Storage
          </div>

          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-8 pb-6 border-b border-slate-800">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Settings className="w-5 h-5 text-indigo-400 animate-spin-slow" />
                Centro de Sincronización de Datos (Userpilot ↔ Supabase)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Actualiza la base de datos de proveedores para mantener al día los análisis y cohortes de comportamiento.
              </p>
            </div>

            {/* Live Database Count */}
            <div className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800 self-start lg:self-auto shrink-0 min-w-[240px]">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xl text-emerald-400 shrink-0">
                🗃️
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-500 uppercase">Proveedores Cargados</p>
                {loadingStatus ? (
                  <div className="h-5 w-16 bg-slate-800 rounded animate-pulse mt-1" />
                ) : (
                  <p className="text-base font-extrabold text-white">
                    {status?.count.toLocaleString("es-CO")} rows
                  </p>
                )}
                <p className="text-[9px] text-slate-400 mt-0.5">
                  Última carga: {loadingStatus ? "..." : formatDate(status ? status.lastSync : null)}
                </p>
              </div>
            </div>
          </div>

          {/* Sync actions row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            
            {/* Action 1: API Sync */}
            <div className="flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-2">
                  Opción A: Sincronización Automática por API
                </h4>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  Genera una exportación en Userpilot vía API, espera su procesamiento en segundo plano y descarga/upserta el resultado en Supabase.
                </p>
                
                {/* Date Input for Sync Range */}
                <div className="flex flex-col gap-1.5 mb-4 max-w-[200px]">
                  <label className="text-[10px] font-bold text-slate-500 uppercase">
                    Fecha de Inicio de Exportación:
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {status?.hasApiKey ? (
                <button
                  onClick={triggerApiSync}
                  disabled={syncing}
                  className="w-max px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} />
                  <span>{syncing ? "Sincronizando..." : "Iniciar Sincronización API"}</span>
                </button>
              ) : (
                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-start gap-2 max-w-md">
                  <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-amber-400/90 leading-normal">
                    <p className="font-bold">API Key no configurada</p>
                    <p className="mt-0.5">
                      Configura la variable `USERPILOT_API_KEY` en el archivo `hub/.env.local` para habilitar este método automático.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Action 2: CSV Sync */}
            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800 pt-8 md:pt-0 md:pl-8">
              <div>
                <h4 className="text-sm font-bold text-slate-200 mb-2">
                  Opción B: Carga Manual de Archivo CSV
                </h4>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  Exporta la lista de usuarios en formato CSV desde el Dashboard de Userpilot (Users & Companies) y súbela aquí para procesarla e impactar la base de datos de manera inmediata.
                </p>
              </div>

              <div>
                <input
                  type="file"
                  id="csv-file-upload"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  disabled={syncing}
                  className="hidden"
                />
                <label
                  htmlFor="csv-file-upload"
                  className={`w-max px-6 py-2.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer ${
                    syncing ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{syncing ? "Procesando..." : "Subir Archivo CSV"}</span>
                </label>
              </div>
            </div>

          </div>

          {/* Sync result details block */}
          {syncResult && (
            <div className={`mt-8 p-4 rounded-xl border ${
              syncResult.success 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/20 text-rose-300"
            }`}>
              <div className="flex items-start gap-2.5">
                {syncResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">
                    {syncResult.success ? "Sincronización Exitosa" : "Fallo de Sincronización"}
                  </p>
                  <p className="text-xs mt-1 text-slate-300">{syncResult.message}</p>
                  
                  {/* Collapsible logs terminal container */}
                  {(syncResult.output || syncResult.errorOutput) && (
                    <div className="mt-4">
                      <button
                        onClick={() => setShowLogs(!showLogs)}
                        className="flex items-center gap-1 text-[11px] font-bold text-indigo-400 hover:text-indigo-300 focus:outline-none"
                      >
                        <Terminal className="w-3 h-3" />
                        <span>{showLogs ? "Ocultar detalles de consola" : "Ver detalles de consola"}</span>
                        {showLogs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {showLogs && (
                        <div className="mt-2 bg-black/85 text-[10px] text-slate-300 font-mono p-3 rounded-lg border border-slate-800 max-h-60 overflow-y-auto whitespace-pre-wrap">
                          {syncResult.output && (
                            <div>
                              <p className="text-indigo-400 font-bold border-b border-slate-850 pb-1 mb-1">STDOUT</p>
                              {syncResult.output}
                            </div>
                          )}
                          {syncResult.errorOutput && (
                            <div className="mt-3">
                              <p className="text-rose-400 font-bold border-b border-slate-850 pb-1 mb-1">STDERR / DETAILS</p>
                              {syncResult.errorOutput}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>

      </main>
    </div>
  );
}
