"use client";

import { useState, useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

const WIZARD_STORAGE_KEY = "supplier_lab_wizard_completed";

export function OnboardingWizard() {
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Revisar si ya se completó el onboarding
    const isCompleted = localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!isCompleted) {
      setIsVisible(true);
      trackEvent("onboarding_started", { step: 1 });
    }
  }, []);

  // For testing/admin panel listener
  useEffect(() => {
    const handleReset = () => {
      localStorage.removeItem(WIZARD_STORAGE_KEY);
      setStep(1);
      setIsVisible(true);
      trackEvent("onboarding_reset");
    };

    window.addEventListener("reset-onboarding", handleReset);
    return () => window.removeEventListener("reset-onboarding", handleReset);
  }, []);

  if (!isVisible) return null;

  const handleOptionSelect = (question: string, answer: string) => {
    trackEvent("onboarding_step_completed", { step, question, answer });
    
    // Auto avance inmediato
    setStep((prev) => prev + 1);
  };

  const handleFinalize = () => {
    trackEvent("onboarding_completed", { total_steps: 4 });
    setIsClosing(true);
    
    // Guardar estado local
    localStorage.setItem(WIZARD_STORAGE_KEY, "true");
    
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // duración animación
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className={`bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col items-center transition-all duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}>
        
        {step === 1 && (
          <div className="w-full p-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <h2 className="text-2xl font-bold text-center text-zinc-800 mb-2">¿Cuéntanos en qué etapa estás?</h2>
            <p className="text-center text-zinc-500 mb-8 font-medium">Selecciona una opción</p>
            
            <div className="space-y-3">
              <OptionCard 
                label="Estoy explorando y aún no tengo productos"
                onClick={() => handleOptionSelect("etapa", "explorando")}
              />
              <OptionCard 
                label="Tengo productos, pero nunca he sido proveedor de dropshipping"
                onClick={() => handleOptionSelect("etapa", "tiene_productos_nuevo")}
              />
              <OptionCard 
                label="Tengo productos y ya vendo online, pero nunca he sido proveedor de dropshipping"
                onClick={() => handleOptionSelect("etapa", "vende_online_nuevo")}
              />
              <OptionCard 
                label="Ya he sido proveedor de dropshipping"
                onClick={() => handleOptionSelect("etapa", "ya_es_proveedor")}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="w-full p-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <h2 className="text-2xl font-bold text-center text-zinc-800 mb-2">¿Cuántos pedidos gestionas al mes?</h2>
            <p className="text-center text-zinc-500 mb-8 font-medium">Selecciona un rango</p>
            
            <div className="space-y-3">
              <OptionCard 
                label="Aún no gestiono pedidos"
                onClick={() => handleOptionSelect("volumen", "0")}
              />
              <OptionCard 
                label="Menos de 50 al mes"
                onClick={() => handleOptionSelect("volumen", "<50")}
              />
              <OptionCard 
                label="51 a 300 al mes"
                onClick={() => handleOptionSelect("volumen", "51-300")}
              />
              <OptionCard 
                label="301 a 1.000 al mes"
                onClick={() => handleOptionSelect("volumen", "301-1000")}
              />
              <OptionCard 
                label="Más de 1.000 al mes"
                onClick={() => handleOptionSelect("volumen", ">1000")}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="w-full p-8 animate-in slide-in-from-right-4 fade-in duration-300">
            <h2 className="text-2xl font-bold text-center text-zinc-800 mb-2">¿Cómo quieres vender tus productos?</h2>
            <p className="text-center text-zinc-500 mb-8 font-medium">Selecciona una opción</p>
            
            <div className="space-y-3">
              <OptionCard 
                label="Solo vender a través de dropshippers"
                onClick={() => handleOptionSelect("canal", "solo_dropshippers")}
              />
              <OptionCard 
                label="Quiero vender a través de dropshippers y por mis canales"
                onClick={() => handleOptionSelect("canal", "dropshippers_y_propios")}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="w-full p-8 py-12 flex flex-col items-center animate-in zoom-in-95 fade-in duration-500">
            <h2 className="text-3xl font-bold text-center text-zinc-800 mb-2">¡Gracias por elegir Dropi!</h2>
            <p className="text-center text-zinc-600 mb-10 font-medium flex items-center gap-2">
              Lo mejor está por empezar <span className="text-xl">🧡</span>
            </p>
            
            <button 
              onClick={handleFinalize}
              className="w-full sm:w-64 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3.5 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Finalizar
            </button>
          </div>
        )}

      </div>
    </div>
  );
}

function OptionCard({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 px-5 py-4 border border-zinc-200 hover:border-orange-400 rounded-lg bg-white hover:bg-orange-50 transition-all group text-left shadow-sm"
    >
      <div className="w-5 h-5 rounded-full border-2 border-zinc-300 group-hover:border-orange-500 flex-shrink-0 flex items-center justify-center">
        {/* Simulamos radio button vacio, y en hover parece que se va a seleccionar */}
      </div>
      <span className="text-zinc-700 font-medium group-hover:text-zinc-900">{label}</span>
    </button>
  );
}
