"use client";

import { useState } from "react";
import {
  X, Info, Bold, Italic, List, AlignLeft, AlignCenter, AlignRight,
  CircleDot, Circle, Trash, Bot, CheckSquare, Square,
} from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function ProductCreateWizard({ onBack, onSaveSuccess, interceptSave }: { onBack?: () => void, onSaveSuccess?: () => void, interceptSave?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Paso 1
  const [productName, setProductName] = useState("jabon");

  // Paso 2
  const [stockQuantity, setStockQuantity] = useState<number | "">("");

  // Paso 3
  const [imagesCount, setImagesCount] = useState(0);

  // Paso 4 — 3 garantías originales + texto descriptivo por cada una
  const [garantiaIncompleta, setGarantiaIncompleta] = useState(false);
  const [garantiaIncompletaText, setGarantiaIncompletaText] = useState("");
  const [garantiaMalFuncionamiento, setGarantiaMalFuncionamiento] = useState(false);
  const [garantiaMalFuncionamientoText, setGarantiaMalFuncionamientoText] = useState("");
  const [garantiaRoto, setGarantiaRoto] = useState(false);
  const [garantiaRotoText, setGarantiaRotoText] = useState("");

  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const steps = [
    { id: 1, name: "General" },
    { id: 2, name: "Stock" },
    { id: 3, name: "Imágenes" },
    { id: 4, name: "Garantías" },
  ];

  const handleNext = () => {
    setErrorMsg("");

    if (currentStep === 1) {
      if (!productName.trim()) {
        setErrorMsg("El nombre del producto es obligatorio.");
        return;
      }
      trackEvent("wizard_step_completed", { step: 1, name: "General" });
      setCurrentStep(2);
    } else if (currentStep === 2) {
      const qty = typeof stockQuantity === "number" ? stockQuantity : 0;
      if (qty < 100) {
        setErrorMsg("Al menos una bodega debe tener un mínimo de 100 unidades.");
        trackEvent("wizard_validation_failed", { step: 2, reason: "stock_low" });
        return;
      }
      trackEvent("wizard_step_completed", { step: 2, name: "Stock" });
      setCurrentStep(3);
    } else if (currentStep === 3) {
      if (imagesCount < 3) {
        setErrorMsg("Debes subir al menos 3 imágenes del producto.");
        trackEvent("wizard_validation_failed", { step: 3, reason: "images_low" });
        return;
      }
      trackEvent("wizard_step_completed", { step: 3, name: "Imágenes" });
      setCurrentStep(4);
    } else if (currentStep === 4) {
      if (!garantiaIncompleta || !garantiaMalFuncionamiento || !garantiaRoto) {
        setErrorMsg("Las tres garantías por defecto son obligatorias. Actívalas y agrega una descripción.");
        trackEvent("wizard_validation_failed", { step: 4, reason: "warranties_missing" });
        return;
      }
      trackEvent("wizard_step_completed", { step: 4, name: "Garantías" });
      handleSaveAttempt();
    }
  };

  const handlePrev = () => {
    setErrorMsg("");
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleSaveAttempt = () => {
    trackEvent("product_save_attempted", { variant: "wizard" });
    if (interceptSave) {
      interceptSave();
    } else {
      setShowVerifyModal(true);
    }
  };

  const handleVerifyStart = () => {
    trackEvent("product_saved", { variant: "wizard" });
    trackEvent("survey_started");
    window.open("https://link.dropi.co/widget/survey/RHwFslXWbg01teWQk04b", "_blank");
    if (onSaveSuccess) onSaveSuccess();
  };

  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in duration-300 relative max-w-4xl mx-auto w-full">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-800">Crear Producto (Wizard)</h1>
        {onBack && (
          <button onClick={onBack} className="text-zinc-500 hover:text-zinc-700 text-sm">
            Volver
          </button>
        )}
      </div>

      {/* Stepper Header */}
      <div className="bg-white rounded-xl border border-zinc-200 p-6 flex justify-between items-center shadow-sm">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center flex-1 relative">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm z-10 ${
                currentStep >= step.id ? "bg-[#0ea5e9] text-white" : "bg-zinc-100 text-zinc-400"
              }`}
            >
              {step.id}
            </div>
            <span
              className={`text-xs mt-2 font-medium ${
                currentStep >= step.id ? "text-[#0ea5e9]" : "text-zinc-400"
              }`}
            >
              {step.name}
            </span>
            {step.id !== 4 && (
              <div
                className={`absolute top-4 left-[50%] w-full h-[2px] ${
                  currentStep > step.id ? "bg-[#0ea5e9]" : "bg-zinc-100"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Modal: Verificar operación */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 backdrop-blur-[2px]">
          <div className="bg-white rounded-2xl shadow-2xl w-[500px] overflow-hidden animate-in zoom-in-95 duration-200 relative">
            <button
              onClick={() => setShowVerifyModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-8">
              <h3 className="text-2xl font-bold text-zinc-800 mb-6">Verificar operación</h3>
              <p className="text-[15px] text-zinc-700 mb-6 leading-relaxed">
                Antes de publicar tu primer producto en el catálogo público, queremos conocerte y
                acompañarte para que tengas todo listo como proveedor Dropi.
                <br />
                <br />
                Por eso, realizaremos una verificación de tu operación.
              </p>
              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={handleVerifyStart}
                  className="flex-1 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-colors border-2 border-[#f08c3e] hover:border-[#e67e22]"
                >
                  Comenzar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm p-8 min-h-[500px] flex flex-col">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium flex items-center gap-2">
            <Bot className="w-5 h-5 flex-shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="flex-1">

          {/* ── PASO 1: GENERAL ── */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-zinc-800 border-b pb-2">Información General</h2>

              {/* Nombre */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-zinc-700">Nombre del producto *</label>
                <p className="text-xs text-zinc-500 leading-relaxed">
                  Usa el nombre comercial real del producto. Sé específico para que los dropshippers lo encuentren fácilmente en el catálogo. Evita nombres genéricos como "producto 1".
                </p>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="Ej: Jabón artesanal de avena 200g"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm"
                />
              </div>

              {/* Medidas */}
              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-sm font-semibold text-zinc-700 block mb-1">Medidas del producto *</label>
                  <div className="bg-sky-50 border border-sky-100 rounded-lg p-3.5 flex gap-3 text-sky-800">
                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-semibold mb-0.5">Mide el empaque listo para despachar, no el producto sin empacar.</p>
                      <p className="text-sky-700 text-xs leading-relaxed">
                        El costo del envío se calcula con estas medidas. Si ingresas medidas incorrectas, la transportadora
                        puede refacturar el flete posteriormente.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Peso (g)", placeholder: "Ej: 250" },
                    { label: "Largo (cm)", placeholder: "Ej: 15" },
                    { label: "Ancho (cm)", placeholder: "Ej: 8" },
                    { label: "Alto (cm)", placeholder: "Ej: 5" },
                  ].map(({ label, placeholder }) => (
                    <div key={label} className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-600">{label}</label>
                      <input
                        type="number"
                        placeholder={placeholder}
                        defaultValue="10"
                        className="w-full px-3 py-2 border border-zinc-200 rounded-md text-sm focus:outline-none focus:border-orange-400"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PASO 2: STOCK ── */}
          {currentStep === 2 && (
            <div className="space-y-5 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-zinc-800 border-b pb-2">Asignar Stock</h2>

              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3.5 flex gap-3 text-sky-800">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-0.5">¿Por qué se piden mínimo 100 unidades?</p>
                  <p className="text-sky-700 text-xs leading-relaxed">
                    Los dropshippers de Dropi pueden generar pedidos simultáneos. Con menos de 100 unidades el
                    producto se considera con stock insuficiente para el catálogo público y no quedará visible
                    hasta que alcances ese mínimo.
                  </p>
                </div>
              </div>

              <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-zinc-800 text-sm">bodega 1 (Principal)</p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Asigna cuántas unidades de este producto están disponibles en esta bodega para despachar.
                  </p>
                </div>
                <div className="flex flex-col items-end flex-shrink-0">
                  <input
                    type="number"
                    value={stockQuantity}
                    onChange={(e) =>
                      setStockQuantity(e.target.value === "" ? "" : Number(e.target.value))
                    }
                    placeholder="0"
                    className="w-32 px-4 py-2.5 border border-zinc-200 rounded-lg text-center focus:outline-none focus:border-orange-400 text-sm font-semibold"
                  />
                  <span className="text-xs text-zinc-400 mt-1">Mínimo para publicar: 100</span>
                </div>
              </div>
            </div>
          )}

          {/* ── PASO 3: IMÁGENES ── */}
          {currentStep === 3 && (
            <div className="space-y-5 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-zinc-800 border-b pb-2">Imágenes del Producto</h2>

              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3.5 flex gap-3 text-sky-800">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-0.5">Consejos para tus fotos</p>
                  <ul className="text-sky-700 text-xs space-y-1 leading-relaxed mt-1">
                    <li>• Usa buena luz natural o artificial, fondo limpio (blanco o neutro).</li>
                    <li>• Incluye al menos una foto frontal, una lateral y una del empaque o producto en uso.</li>
                    <li>• No necesitas cámara profesional — un celular con buena luz es suficiente.</li>
                    <li>• Evita imágenes borrosas, con marca de agua o tomadas de internet.</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  setImagesCount((c) => c + 1);
                  setErrorMsg("");
                }}
                className="w-full border-2 border-dashed border-emerald-400 bg-emerald-50/50 text-emerald-600 rounded-xl py-8 flex flex-col items-center justify-center font-bold transition-all hover:bg-emerald-50 gap-1"
              >
                <span>AGREGAR UNA IMAGEN</span>
                <span className="text-xs font-normal text-zinc-400">
                  {imagesCount} de 3 mínimas cargadas · Formatos: JPG, PNG, WEBP · Máx 10 MB
                </span>
              </button>

              {imagesCount > 0 && (
                <div className="flex flex-wrap gap-4">
                  {Array.from({ length: imagesCount }).map((_, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24 bg-zinc-100 rounded-lg border border-zinc-200 overflow-visible"
                    >
                      <div
                        className="absolute inset-0 bg-cover bg-center rounded-lg opacity-80"
                        style={{
                          backgroundImage:
                            "url('https://images.unsplash.com/photo-1600857062241-98e5dba7f214?q=80&w=100&auto=format&fit=crop')",
                        }}
                      />
                      <button
                        onClick={() => setImagesCount((c) => c - 1)}
                        className="absolute -top-2 -right-2 bg-red-400 text-white p-1 rounded-full hover:bg-red-500 shadow"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── PASO 4: GARANTÍAS ── */}
          {currentStep === 4 && (
            <div className="space-y-5 animate-in slide-in-from-right-4">
              <h2 className="text-xl font-bold text-zinc-800 border-b pb-2">Garantías por Defecto</h2>

              <div className="bg-sky-50 border border-sky-100 rounded-lg p-3.5 flex gap-3 text-sky-800">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-0.5">¿Qué son las garantías por defecto?</p>
                  <p className="text-sky-700 text-xs leading-relaxed">
                    Son las condiciones mínimas que defines para proteger al comprador y al dropshipper en caso
                    de problemas con el producto. Activa cada garantía y describe brevemente cuándo aplica,
                    el plazo y cualquier condición relevante.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Garantía 1 */}
                <GarantiaItem
                  label="Orden incompleta"
                  sublabel="Aplica cuando falta uno o más productos, piezas o accesorios dentro del paquete."
                  checked={garantiaIncompleta}
                  onToggle={() => { setGarantiaIncompleta((v) => !v); setErrorMsg(""); }}
                  textValue={garantiaIncompletaText}
                  onTextChange={(v) => setGarantiaIncompletaText(v)}
                  placeholder="Ej: Aplica dentro de los 10 días de entrega. El proveedor repondrá la pieza faltante o realizará el reembolso correspondiente al dropshipper."
                />

                {/* Garantía 2 */}
                <GarantiaItem
                  label="Mal funcionamiento"
                  sublabel="Aplica cuando el producto no cumple su función principal o presenta fallas de fabricación."
                  checked={garantiaMalFuncionamiento}
                  onToggle={() => { setGarantiaMalFuncionamiento((v) => !v); setErrorMsg(""); }}
                  textValue={garantiaMalFuncionamientoText}
                  onTextChange={(v) => setGarantiaMalFuncionamientoText(v)}
                  placeholder="Ej: Garantía de 10 días desde la entrega. No aplica si el daño es causado por mal uso o manipulación incorrecta por parte del cliente final."
                />

                {/* Garantía 3 */}
                <GarantiaItem
                  label="Producto roto"
                  sublabel="Aplica cuando el cliente recibe el producto con daños físicos visibles."
                  checked={garantiaRoto}
                  onToggle={() => { setGarantiaRoto((v) => !v); setErrorMsg(""); }}
                  textValue={garantiaRotoText}
                  onTextChange={(v) => setGarantiaRotoText(v)}
                  placeholder="Ej: Aplica dentro de los 10 días de entrega. El cliente debe reportar el daño con foto. Se repondrá el producto o se realizará reembolso según el caso."
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentStep === 1}
            className={`px-6 py-2.5 rounded-lg font-bold transition-colors ${
              currentStep === 1
                ? "text-zinc-300 bg-zinc-50 cursor-not-allowed"
                : "text-zinc-600 bg-zinc-100 hover:bg-zinc-200"
            }`}
          >
            Atrás
          </button>
          <button
            onClick={handleNext}
            className="px-8 py-2.5 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold rounded-lg shadow-sm transition-colors"
          >
            {currentStep === 4 ? "Guardar y Finalizar" : "Siguiente"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── GarantiaItem ────────────────────────────────────────────────────────────

function GarantiaItem({
  label,
  sublabel,
  checked,
  onToggle,
  textValue,
  onTextChange,
  placeholder,
}: {
  label: string;
  sublabel: string;
  checked: boolean;
  onToggle: () => void;
  textValue: string;
  onTextChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className={`border rounded-xl transition-all ${checked ? "border-[#0ea5e9] bg-sky-50/40" : "border-zinc-200 bg-zinc-50/50"}`}>
      {/* Checkbox row */}
      <label className="flex items-start gap-3 p-4 cursor-pointer">
        <div
          className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
            checked ? "bg-[#0ea5e9] text-white" : "bg-white border border-zinc-300"
          }`}
          onClick={onToggle}
        >
          {checked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-zinc-300" />}
        </div>
        <div>
          <p className="font-semibold text-zinc-800 text-sm">{label}</p>
          <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{sublabel}</p>
        </div>
      </label>

      {/* Textarea descriptivo — siempre visible si está activada */}
      {checked && (
        <div className="px-4 pb-4">
          <label className="text-xs font-semibold text-zinc-500 block mb-1.5">
            Describe las condiciones de esta garantía
          </label>
          <textarea
            rows={3}
            value={textValue}
            onChange={(e) => onTextChange(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2.5 border border-sky-200 bg-white rounded-lg focus:outline-none focus:border-[#0ea5e9] focus:ring-2 focus:ring-sky-100 text-sm text-zinc-700 resize-none leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}
