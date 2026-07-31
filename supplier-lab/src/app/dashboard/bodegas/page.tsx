"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Download, Plus, Edit2, Share, Save, X, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export default function BodegasPage() {
  // Estado para alternar entre lista y formulario
  const [view, setView] = useState<"list" | "form">("list");
  
  // Estado para mostrar modal de éxito
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Escuchar eventos del AdminLabControls para forzar estados
  useEffect(() => {
    const handleSetBodegaState = (e: any) => {
      setView(e.detail.hasBodega ? "list" : "form");
    };
    window.addEventListener("set-bodega-state", handleSetBodegaState);
    return () => window.removeEventListener("set-bodega-state", handleSetBodegaState);
  }, []);

  const handleSave = () => {
    trackEvent('bodega_created');
    setShowSuccessModal(true);
  };

  return (
    <div className="flex flex-col gap-6 pb-24">
      <h1 className="text-2xl font-bold text-zinc-800">Bodegas</h1>
      
      {view === "list" ? (
        <BodegasList onAdd={() => setView("form")} />
      ) : (
        <BodegaForm onSave={handleSave} />
      )}

      {/* Modal de Éxito al Guardar */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-zinc-800 mb-2">¡Bodega guardada!</h3>
            <p className="text-zinc-500 text-sm mb-6">Tu nueva bodega ha sido configurada exitosamente.</p>
            <button 
              onClick={() => {
                setShowSuccessModal(false);
                setView("list");
              }}
              className="w-full bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-2.5 rounded-lg transition-colors"
            >
              Volver al listado
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------------------------
// Componente: Lista de Bodegas
// ----------------------------------------------------------------------
function BodegasList({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative w-full max-w-xs">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-zinc-400" />
          </div>
          <input 
            type="text" 
            placeholder="Buscar..." 
            className="w-full pl-9 pr-4 py-2 bg-zinc-100 border-transparent rounded-md text-sm focus:bg-white focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-md text-sm font-medium transition-colors">
            <Download className="w-4 h-4" />
            Descargar en Excel
          </button>
          <button 
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] hover:bg-sky-600 text-white rounded-md text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            Agregar
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50/50 text-zinc-500 font-semibold border-b border-zinc-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Es Bodega<br/>principal</th>
              <th className="px-6 py-4">Proveedor</th>
              <th className="px-6 py-4">Nombre<br/>de Bodega</th>
              <th className="px-6 py-4">Teléfono</th>
              <th className="px-6 py-4">Departamento</th>
              <th className="px-6 py-4">Ciudad</th>
              <th className="px-6 py-4">Dirección</th>
              <th className="px-6 py-4 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100 text-zinc-700">
            <tr className="hover:bg-zinc-50/50 transition-colors">
              <td className="px-6 py-4">42053</td>
              <td className="px-6 py-4">No</td>
              <td className="px-6 py-4">
                <div className="font-medium text-zinc-900">jaime dario viteri</div>
                <div className="text-zinc-400 text-xs">(jaimeguevara802+1@gmail.com)</div>
              </td>
              <td className="px-6 py-4">bodega 1</td>
              <td className="px-6 py-4">3224456767</td>
              <td className="px-6 py-4">VALLE</td>
              <td className="px-6 py-4">CALI</td>
              <td className="px-6 py-4">
                <div className="max-w-[150px] truncate" title="Kra 56 # 7 oeste 96 Casa C1">
                  Kra 56 # 7 oeste 96 Casa C1
                </div>
              </td>
              <td className="px-6 py-4 text-right">
                <button className="text-emerald-500 hover:text-emerald-700 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------
// Componente: Formulario de Bodega con Tooltips de Onboarding
// ----------------------------------------------------------------------
function BodegaForm({ onSave }: { onSave: () => void }) {
  const [tourStep, setTourStep] = useState<number>(0);
  
  // Referencias para anclar los tooltips
  const nombreRef = useRef<HTMLDivElement>(null);
  const guideRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Verificar si ya hizo el tour
    const hasSeenTour = localStorage.getItem("bodega_tour_completed");
    if (!hasSeenTour) {
      setTourStep(1);
      trackEvent('bodega_tour_started');
    }
  }, []);

  const handleNextTour = () => {
    trackEvent('bodega_tour_step_completed', { step: 1 });
    setTourStep(2);
  };

  const handleFinishTour = () => {
    trackEvent('bodega_tour_completed');
    localStorage.setItem("bodega_tour_completed", "true");
    setTourStep(0);
  };

  const handlePrevTour = () => {
    trackEvent('bodega_tour_step_reversed', { from_step: 2 });
    setTourStep(1);
  };

  const carriers = [
    "VELOCES", "ENVIA", "INTERRAPIDISIMO", "DOMINA", 
    "COORDINADORA", "99MINUTOS", "TCC"
  ];

  return (
    <div className="bg-white rounded-xl border border-zinc-200 shadow-sm relative">
      {/* Overlay oscuro cuando el tour está activo */}
      {tourStep > 0 && (
        <div className="absolute inset-0 bg-zinc-900/10 z-10 rounded-xl pointer-events-none" />
      )}

      {/* Header Formulario */}
      <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-800">Datos de la Bodega</h2>
        <div className="flex items-center gap-4">
          <button className="text-zinc-500 hover:text-zinc-700">
            <Share className="w-5 h-5" />
          </button>
          <button 
            onClick={onSave}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            Guardar
          </button>
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Datos Básicos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          
          <div ref={nombreRef} className={`space-y-1.5 relative ${tourStep === 1 ? 'z-20 bg-white p-2 -m-2 rounded-lg shadow-sm' : ''}`}>
            <label className="text-sm font-semibold text-zinc-700">Nombre</label>
            <input 
              type="text" 
              placeholder="Nombre" 
              className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm"
            />
            
            {/* Tooltip Paso 1 */}
            {tourStep === 1 && (
              <div className="absolute top-0 left-[105%] w-72 bg-white rounded-xl shadow-xl border border-zinc-200 overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="h-1 bg-orange-400 w-1/2" />
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-zinc-800 text-sm">Crea tu primera bodega 🚚</h4>
                    <button onClick={handleFinishTour} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4"/></button>
                  </div>
                  <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                    Completa los datos y verifica que sean correctos. Después podrás crear cuantas bodegas necesites.
                  </p>
                  <div className="flex justify-end">
                    <button onClick={handleNextTour} className="px-4 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-xs font-bold rounded-md transition-colors">
                      Continuar
                    </button>
                  </div>
                </div>
                {/* Triangulito a la izquierda */}
                <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-l border-b border-zinc-200 rotate-45" />
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Teléfono</label>
            <input 
              type="text" 
              placeholder="Teléfono" 
              className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Departamento</label>
            <select className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm bg-white text-zinc-500">
              <option>Departamento</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Ciudad</label>
            <select className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm bg-white text-zinc-500">
              <option>Ciudad</option>
            </select>
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-zinc-700">Dirección</label>
            <textarea 
              placeholder="Dirección" 
              rows={2}
              className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm resize-none"
            />
          </div>
        </div>

        {/* Separador */}
        <hr className="border-zinc-100" />

        {/* Guide Format */}
        <div ref={guideRef} className={`relative ${tourStep === 2 ? 'z-20 bg-white p-4 -m-4 rounded-xl shadow-sm' : ''}`}>
          <h3 className="text-sm font-bold text-zinc-800 mb-4">Guide Format</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {carriers.map((carrier) => (
              <div key={carrier} className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-500 tracking-wide">{carrier}</label>
                <select className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm bg-white text-zinc-500 appearance-none">
                  <option value="">Guide format</option>
                  <option value="CARTA">CARTA</option>
                  <option value="STICKER">STICKER 10x15</option>
                </select>
              </div>
            ))}
          </div>

          {/* Tooltip Paso 2 */}
          {tourStep === 2 && (
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-72 bg-white rounded-xl shadow-2xl border border-zinc-200 overflow-visible animate-in slide-in-from-bottom-4 duration-200">
              <div className="h-1 bg-orange-400 w-full rounded-t-xl" />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold text-zinc-800 text-sm">Formato de guía 🏷️</h4>
                  <button onClick={handleFinishTour} className="text-zinc-400 hover:text-zinc-600"><X className="w-4 h-4"/></button>
                </div>
                <p className="text-xs text-zinc-500 leading-relaxed mb-4">
                  Selecciona el formato de guía para cada transportadora y haz clic en <span className="italic font-semibold">Guardar</span>.
                </p>
                <div className="flex justify-between items-center">
                  <button onClick={handlePrevTour} className="text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors">
                    Atrás
                  </button>
                  <button onClick={handleFinishTour} className="px-4 py-1.5 bg-orange-400 hover:bg-orange-500 text-white text-xs font-bold rounded-md transition-colors shadow-sm">
                    Empezar
                  </button>
                </div>
              </div>
              {/* Triangulito hacia abajo */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-r border-b border-zinc-200 rotate-45" />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
