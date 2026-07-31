import Link from "next/link";
import { Package, Beaker, Truck, ArrowRight, FlaskConical, Rocket } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-orange-200">
            <FlaskConical className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl mb-4">
            Supplier Journey Lab
          </h1>
          <p className="text-lg text-zinc-600 max-w-2xl mx-auto">
            Directorio central de experimentos y variantes de UI. Selecciona un flujo para interactuar con la interfaz o entra al laboratorio para ver simulaciones sintéticas.
          </p>
        </div>

        <div className="space-y-8">
          
          {/* PROYECTO 1: SIMULADOR (LAB) */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="bg-indigo-50/50 border-b border-indigo-100 p-6 flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-indigo-600 border border-indigo-100">
                <Beaker className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-800">Motor de Simulaciones</h2>
                <p className="text-sm text-zinc-500">Prueba perfiles sintéticos en múltiples variantes de UI.</p>
              </div>
            </div>
            <div className="p-6">
              <Link href="/dashboard/laboratorio" className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all">
                <div>
                  <h3 className="font-bold text-zinc-800 group-hover:text-indigo-700">Ir al Laboratorio 🧪</h3>
                  <p className="text-sm text-zinc-500">Ejecutar simulaciones LLM y Deterministas.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* PROYECTO 2: CREACIÓN DE PRODUCTO */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="bg-sky-50/50 border-b border-sky-100 p-6 flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-sky-600 border border-sky-100">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-800">Flujo: Creación de Producto</h2>
                <p className="text-sm text-zinc-500">Experimento activo: Pestañas Libres vs Wizard Secuencial.</p>
              </div>
            </div>
            <div className="p-6 grid gap-4">
              <Link href="/dashboard/productos?variant=a_tabs" className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 hover:border-sky-400 hover:bg-sky-50 transition-all">
                <div>
                  <h3 className="font-bold text-zinc-800 group-hover:text-sky-700">Variante A: Pestañas (Base actual)</h3>
                  <p className="text-sm text-zinc-500">Navegación libre con validaciones estrictas al final del flujo.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-sky-600 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/dashboard/productos?variant=wizard" className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 hover:border-orange-400 hover:bg-orange-50 transition-all">
                <div>
                  <h3 className="font-bold text-zinc-800 group-hover:text-orange-700">Variante B: Wizard Secuencial</h3>
                  <p className="text-sm text-zinc-500">Navegación guiada paso a paso con bloqueos por etapa.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* PROYECTO 3: ACTIVACIÓN SUPPLIER (EXPERIENCIA C) */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="bg-orange-50/50 border-b border-orange-100 p-6 flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-orange-500 border border-orange-100">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-800">Flujo: Activación de Supplier</h2>
                <p className="text-sm text-zinc-500">Variante C — Ruta guiada con sidebar bloqueado y pipeline de 5 pasos.</p>
              </div>
            </div>
            <div className="p-6">
              <Link href="/onboarding/experiencia-c" className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 hover:border-orange-400 hover:bg-orange-50 transition-all">
                <div>
                  <h3 className="font-bold text-zinc-800 group-hover:text-orange-700">Variante C: Ruta de activación</h3>
                  <p className="text-sm text-zinc-500">Sidebar limitado + pipeline progresivo + modales de contexto.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* PROYECTO 5: CREACIÓN DE BODEGA */}
          <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
            <div className="bg-emerald-50/50 border-b border-emerald-100 p-6 flex items-center gap-4">
              <div className="p-3 bg-white rounded-xl shadow-sm text-emerald-600 border border-emerald-100">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-zinc-800">Flujo: Creación de Bodega</h2>
                <p className="text-sm text-zinc-500">Configuración operativa inicial del supplier.</p>
              </div>
            </div>
            <div className="p-6">
              <Link href="/dashboard/bodegas" className="group flex items-center justify-between p-4 rounded-xl border border-zinc-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all">
                <div>
                  <h3 className="font-bold text-zinc-800 group-hover:text-emerald-700">Flujo Base: Tooltips Guiados</h3>
                  <p className="text-sm text-zinc-500">Asistencia mediante overlays contextuales (Tour de onboarding).</p>
                </div>
                <ArrowRight className="w-5 h-5 text-zinc-400 group-hover:text-emerald-600 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
