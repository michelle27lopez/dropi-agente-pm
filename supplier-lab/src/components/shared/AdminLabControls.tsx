"use client";

import { useState } from "react";
import Link from "next/link";
import { Settings2, RotateCcw, Activity, Zap } from "lucide-react";

export function AdminLabControls() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasBodega, setHasBodega] = useState(true);

  const resetOnboarding = () => {
    window.dispatchEvent(new Event("reset-onboarding"));
    setIsOpen(false);
  };

  const toggleBodegaState = () => {
    const newState = !hasBodega;
    setHasBodega(newState);
    window.dispatchEvent(new CustomEvent("set-bodega-state", { detail: { hasBodega: newState } }));
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-6 z-[200]">
      {isOpen && (
        <div className="absolute bottom-14 left-0 w-64 bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl p-4 text-zinc-100 mb-2 animate-in slide-in-from-bottom-2">
          <div className="flex items-center gap-2 border-b border-zinc-700 pb-2 mb-3">
            <Activity className="w-4 h-4 text-emerald-400" />
            <h4 className="font-bold text-sm">Lab Controls (Admin)</h4>
          </div>
          
          <div className="space-y-2">
            <button 
              onClick={resetOnboarding}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border border-zinc-700"
            >
              <RotateCcw className="w-4 h-4 text-orange-400" />
              Resetear Onboarding
            </button>
            <button 
              onClick={toggleBodegaState}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border border-zinc-700"
            >
              <Activity className="w-4 h-4 text-emerald-400" />
              Simular: {hasBodega ? "Sin Bodegas" : "Con Bodegas"}
            </button>
            <div className="border-t border-zinc-700 pt-2 mt-1">
              <p className="text-[10px] text-zinc-500 mb-2">Variantes de activación</p>
              <Link
                href="/onboarding/activacion-guiada"
                className="w-full flex items-center gap-2 px-3 py-2 text-sm bg-zinc-800 hover:bg-zinc-700 rounded-md transition-colors border border-zinc-700"
              >
                <Zap className="w-4 h-4 text-yellow-400" />
                Activación Guiada (Var. D)
              </Link>
            </div>
            <p className="text-[10px] text-zinc-500 mt-2">
              Usa estos controles para iterar rápidamente sobre flujos sin borrar cookies manualmente.
            </p>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isOpen ? "bg-emerald-500 text-white" : "bg-zinc-900 text-zinc-400 hover:text-white"
        }`}
        title="Controles de Laboratorio"
      >
        <Settings2 className="w-5 h-5" />
      </button>
    </div>
  );
}
