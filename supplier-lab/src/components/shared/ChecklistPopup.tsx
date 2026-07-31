"use client";

import { useState } from "react";
import { Handshake, MessageCircle, ChevronDown, Check, Fingerprint, Radio } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

export function ChecklistPopup() {
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // El checklist solo debe aparecer en el inicio (/dashboard)
  const showChecklist = pathname === "/dashboard";

  const steps = [
    { 
      title: "Crea tu primera bodega", 
      desc: "Agrega el punto de recolección y elige el formato de guía por transportadora.", 
      completed: true,
      action: () => router.push("/dashboard/bodegas")
    },
    { 
      title: "Sube tus productos", 
      desc: "Carga tu inventario con fotos y descripciones claras para atraer más dropshippers.", 
      completed: false,
      action: () => router.push("/dashboard/productos")
    },
    { title: "Gestiona tus órdenes y guías", desc: "Recibe pedidos, revisa cada orden y despacha rápido para vender sin fricciones.", completed: false },
    { title: "Gestiona tus despachos y recogida", desc: "Conoce como coordinar despachos y recogidas de tus órdenes.", completed: false },
    { title: "Recibe tus ganancias", desc: "Recibe pagos seguros en tu Wallet y controla tus ganancias desde un solo lugar.", completed: false },
    { title: "Regístrate en Dropi Academy", desc: "Aprende a usar la plataforma y maximizar tus ventas con nuestros cursos.", completed: false },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-end gap-3">
      
      {/* Container for Checklist and Primeros Pasos button */}
      {showChecklist && (
        <div className="flex flex-col items-end">
          {isOpen && (
            <div className="w-[420px] bg-white rounded-t-xl rounded-bl-xl shadow-2xl border border-zinc-200 overflow-hidden mb-4 origin-bottom-right animate-in fade-in slide-in-from-bottom-4 duration-300">
              {/* Header */}
              <div className="bg-[#f08c3e] text-white p-5 flex flex-col relative">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-md transition-colors"
                >
                  <ChevronDown className="w-6 h-6" />
                </button>
                
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">🤖</span>
                  <h3 className="font-bold text-lg">Actívate como Proveedor</h3>
                </div>
                <p className="text-white/90 text-sm mb-4">Activa tu negocio y empieza a vender</p>
                
                <div className="flex items-center justify-end text-xs font-bold mb-1">
                  <span>17%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2.5">
                  <div className="bg-white h-2.5 rounded-full" style={{ width: "17%" }}></div>
                </div>
              </div>

              {/* Checklist items */}
              <div className="p-0 max-h-[420px] overflow-y-auto scrollbar-thin">
                <div className="relative p-6 space-y-6">
                  {/* Connecting Line */}
                  <div className="absolute left-[33px] top-8 bottom-8 w-[2px] bg-emerald-600/30" />
                  
                  {steps.map((step, idx) => (
                    <div 
                      key={idx} 
                      className="flex gap-4 relative z-10 group cursor-pointer"
                      onClick={step.action}
                    >
                      <div className="flex-shrink-0 relative bg-white pb-2">
                        {step.completed ? (
                          <div className="w-[18px] h-[18px] rounded-full bg-emerald-600 flex items-center justify-center text-white mt-1 relative z-20">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        ) : (
                          <div className="w-[18px] h-[18px] rounded-full border-[2px] border-emerald-600 bg-white mt-1 relative z-20" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-zinc-800 text-sm">{step.title}</h4>
                        <p className="text-sm text-zinc-500 leading-relaxed mt-0.5 pr-2">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Trigger Button */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-l-xl rounded-r-md bg-[#f08c3e] hover:bg-[#e67e22] text-white shadow-lg transition-transform hover:scale-105 font-bold relative"
          >
            <div className="absolute -top-3 -right-2 w-5 h-5 bg-white text-zinc-800 rounded-full text-xs flex items-center justify-center font-bold shadow-sm border border-zinc-200">
              5
            </div>
            <span className="text-xl leading-none">🤖</span>
            <span className="text-sm">¡Primeros pasos!</span>
          </button>
        </div>
      )}

      {/* Right side floating buttons stack */}
      <div className="flex flex-col gap-3 items-center">
        <button className="w-10 h-10 rounded-full bg-[#f08c3e] hover:bg-[#e67e22] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105">
          <Fingerprint className="w-5 h-5" />
        </button>
        <button className="w-10 h-10 rounded-full bg-[#f08c3e] hover:bg-[#e67e22] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105">
          <Radio className="w-5 h-5" />
        </button>
        <button className="w-11 h-11 rounded-xl bg-[#f08c3e] hover:bg-[#e67e22] text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105">
          <MessageCircle className="w-6 h-6 fill-current" />
        </button>
      </div>
    </div>
  );
}
