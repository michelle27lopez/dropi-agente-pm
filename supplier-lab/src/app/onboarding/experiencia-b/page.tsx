"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/analytics";

type Phase = "intro" | "wizard" | "final";
type WizardStep = "bodega" | "general" | "stock" | "imagenes" | "garantias";

const PRODUCT_STEPS: WizardStep[] = ["general", "stock", "imagenes", "garantias"];
const PRODUCT_STEP_LABELS = ["General", "Stock", "Imágenes", "Garantías"];

const MINI_STEPS: { key: WizardStep; label: string; num: number }[] = [
  { key: "bodega", label: "Bodega", num: 1 },
  { key: "general", label: "General", num: 2 },
  { key: "stock", label: "Stock", num: 3 },
  { key: "imagenes", label: "Imágenes", num: 4 },
  { key: "garantias", label: "Garantías", num: 5 },
];

const GUIDES: Record<WizardStep, { title: string; time: string; text: string }> = {
  bodega: { title: "Guía de bodega", time: "45 segundos", text: "Aprende qué poner como bodega, qué teléfono usar y cómo escribir la dirección." },
  general: { title: "Guía de datos del producto", time: "60 segundos", text: "Te mostramos cómo nombrar el producto y cómo tomar medidas reales en gramos y centímetros." },
  stock: { title: "Guía de stock", time: "40 segundos", text: "Entiende por qué se pide stock mínimo y cómo asignarlo a tu bodega principal." },
  imagenes: { title: "Guía de fotos del producto", time: "60 segundos", text: "Mira ejemplos de fotos simples: frontal, lateral y producto en uso o empaque." },
  garantias: { title: "Guía de garantías", time: "50 segundos", text: "Conoce qué cubren las garantías obligatorias y por qué protegen el ecosistema." },
};

export default function OnboardingE2EPage() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [wizardStep, setWizardStep] = useState<WizardStep>("bodega");
  const [completed, setCompleted] = useState<Set<WizardStep>>(new Set());
  const [error, setError] = useState("");

  // Bodega fields
  const [warehouseName, setWarehouseName] = useState("");
  const [warehousePhone, setWarehousePhone] = useState("");
  const [warehouseAddress, setWarehouseAddress] = useState("");

  // Product fields
  const [productName, setProductName] = useState("");
  const [peso, setPeso] = useState("");
  const [largo, setLargo] = useState("");
  const [ancho, setAncho] = useState("");
  const [alto, setAlto] = useState("");
  const [stockQty, setStockQty] = useState("");
  const [imagesCount, setImagesCount] = useState(0);
  const [g1, setG1] = useState(true);
  const [g2, setG2] = useState(true);
  const [g3, setG3] = useState(true);

  const mark = (step: WizardStep) =>
    setCompleted((prev) => new Set([...prev, step]));

  const goTo = (step: WizardStep) => {
    setError("");
    setWizardStep(step);
  };

  const startWizard = () => {
    trackEvent("onboarding_welcome_accepted");
    setPhase("wizard");
    setWizardStep("bodega");
  };

  const fillDemo = () => {
    setWarehouseName("Bodega principal Cali");
    setWarehousePhone("3224400784");
    setWarehouseAddress("Cra 56 # 7 oeste 96 Casa C1");
    setProductName("Jabón artesanal");
    setPeso("250"); setLargo("10"); setAncho("8"); setAlto("4");
    setStockQty("100");
    setImagesCount(3);
    startWizard();
  };

  const nextBodega = () => {
    if (!warehouseName.trim() || !warehousePhone.trim() || !warehouseAddress.trim()) {
      setError("Completa nombre, teléfono y dirección de la bodega para continuar.");
      return;
    }
    mark("bodega");
    trackEvent("bodega_created");
    goTo("general");
  };

  const nextGeneral = () => {
    if (!productName.trim() || !peso || !largo || !ancho || !alto) {
      setError("Completa nombre, peso y medidas para continuar.");
      return;
    }
    mark("general");
    trackEvent("wizard_step_completed", { step: 1, name: "General" });
    goTo("stock");
  };

  const nextStock = () => {
    if (Number(stockQty) < 100) {
      setError("Agrega al menos 100 unidades para continuar.");
      return;
    }
    mark("stock");
    trackEvent("wizard_step_completed", { step: 2, name: "Stock" });
    goTo("imagenes");
  };

  const nextImagenes = () => {
    if (imagesCount < 3) {
      setError("Sube mínimo 3 imágenes para continuar.");
      return;
    }
    mark("imagenes");
    trackEvent("wizard_step_completed", { step: 3, name: "Imágenes" });
    goTo("garantias");
  };

  const finish = () => {
    if (!g1 || !g2 || !g3) {
      setError("Acepta las garantías obligatorias para finalizar.");
      return;
    }
    mark("garantias");
    trackEvent("product_saved", { variant: "wizard" });
    setPhase("final");
  };

  // ── INTRO ─────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start animate-in fade-in duration-500">
        {/* Left: intro card */}
        <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-8">
          <div className="inline-flex gap-2 items-center rounded-full px-3 py-2 bg-indigo-50 text-indigo-600 text-xs font-black uppercase tracking-wider mb-5">
            Primeros pasos
          </div>
          <h1 className="text-4xl font-black leading-tight tracking-tight text-zinc-900 mb-3">
            Deja tu primer producto listo para el catálogo de Dropi.
          </h1>
          <p className="text-lg text-zinc-500 mb-6">
            En este flujo vas a crear tu punto de despacho y subir un producto con lo necesario para que pueda avanzar en la plataforma.
          </p>

          <div className="flex gap-3 flex-wrap mb-6">
            <button
              onClick={startWizard}
              className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-[15px] shadow-md hover:brightness-95 transition-all"
            >
              Empezar activación
            </button>
            <button
              onClick={fillDemo}
              className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-700 font-black text-[15px] hover:bg-zinc-200 transition-all"
            >
              Usar ejemplo rápido
            </button>
          </div>

          <div className="grid gap-3">
            {[
              { num: "1", title: "Crea tu primera bodega", desc: "Puede ser tu local, oficina, casa, bodega o punto de despacho." },
              { num: "2", title: "Sube tu primer producto", desc: "Te guiaremos paso a paso: datos, stock, imágenes y garantías." },
              { num: "3", title: "Conoce el estado final", desc: "Al terminar sabrás si el producto quedó creado, pendiente o listo para el siguiente paso." },
            ].map(({ num, title, desc }) => (
              <div key={num} className="grid grid-cols-[34px_1fr] gap-3 p-3.5 border border-zinc-200 rounded-2xl bg-zinc-50/60">
                <div className="w-[34px] h-[34px] rounded-xl grid place-items-center bg-green-50 text-green-700 font-black text-sm">{num}</div>
                <div>
                  <strong className="block text-sm font-black text-zinc-800 mb-0.5">{title}</strong>
                  <span className="text-sm text-zinc-500">{desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: tutorial panel */}
        <aside className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-6">
          <h2 className="text-2xl font-black text-zinc-800 mb-2">Aprende antes de empezar</h2>
          <p className="text-zinc-500 mb-4 text-sm">
            Una guía corta te explica qué vas a hacer y qué necesitas tener listo para completar la activación sin frustrarte.
          </p>
          <div className="border border-zinc-200 rounded-[22px] overflow-hidden bg-white shadow-sm">
            {/* Video thumbnail */}
            <div
              className="min-h-[150px] relative flex items-center justify-center"
              style={{ background: "radial-gradient(circle at 78% 28%, rgba(251,146,60,0.34), transparent 22%), linear-gradient(135deg, #111827, #4338ca 72%, #fb923c 160%)" }}
            >
              <div className="w-[74px] h-[74px] rounded-full bg-gradient-to-br from-orange-50 to-orange-200 border-4 border-white/50 shadow-xl relative">
                <div className="absolute top-[28px] left-[22px] w-2 h-2 rounded-full bg-amber-900" />
                <div className="absolute top-[28px] right-[22px] w-2 h-2 rounded-full bg-amber-900" />
                <div className="absolute left-6 top-[43px] w-6 h-3 border-b-[3px] border-amber-900 rounded-b-3xl" />
              </div>
              <div className="absolute right-4 bottom-4 w-[54px] h-[54px] rounded-full bg-white/90 text-indigo-600 grid place-items-center font-black text-xl shadow-lg">
                ▶
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-black text-zinc-800 text-base mb-1.5">Guía rápida: crea tu primer producto</h3>
              <p className="text-sm text-zinc-500 mb-3">Video de 60 segundos con una explicación simple del proceso.</p>
              <div className="grid gap-2">
                {[
                  "Qué es una bodega y por qué se pide.",
                  "Qué datos necesitas del producto.",
                  "Qué fotos y garantías debes completar.",
                ].map((item) => (
                  <div key={item} className="flex gap-2 items-start text-sm text-zinc-600 font-bold">
                    <div className="w-[18px] h-[18px] rounded-[7px] bg-green-50 text-green-700 grid place-items-center text-xs font-black shrink-0">✓</div>
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  // ── FINAL ─────────────────────────────────────────────────────────────────
  if (phase === "final") {
    return (
      <div className="animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-gradient-to-br from-green-50 to-emerald-50/60 border border-green-200 rounded-[26px] p-8 shadow-lg">
          <h1 className="text-3xl font-black text-green-900 mb-2">Tu producto está listo para revisión</h1>
          <p className="text-lg text-green-700 mb-6">Completaste bodega, información general, stock, imágenes y garantías.</p>

          <div className="grid grid-cols-[120px_1fr] gap-5 bg-white border border-zinc-200 rounded-[22px] p-5 shadow-sm">
            <div
              className="w-[120px] h-[120px] rounded-[22px]"
              style={{ background: "radial-gradient(circle at 30% 30%, rgba(22,163,74,0.24), transparent 28%), linear-gradient(135deg, #eee8da, #d8c7aa)" }}
            />
            <div>
              <h2 className="text-xl font-black text-zinc-800 mb-1">{productName || "Producto"}</h2>
              <p className="text-sm text-zinc-500 mb-4">
                Este producto queda creado en la plataforma. La visibilidad pública dependerá del proceso de validación correspondiente.
              </p>
              <div className="grid grid-cols-2 gap-2.5 mb-5">
                {[
                  { label: "Bodega", value: warehouseName || "Bodega principal" },
                  { label: "Stock", value: `${stockQty || 0} unidades` },
                  { label: "Imágenes", value: `${imagesCount} cargadas` },
                  { label: "Estado", value: "Pendiente de validación" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-zinc-50 border border-zinc-200 rounded-[14px] p-3">
                    <b className="block text-xs font-black text-zinc-700">{label}</b>
                    <span className="text-sm text-zinc-500">{value}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => { setPhase("intro"); setCompleted(new Set()); setError(""); }}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-md hover:brightness-95 transition-all"
                >
                  Crear otro producto
                </button>
                <button
                  onClick={() => (window.location.href = "/")}
                  className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-700 font-black text-sm hover:bg-zinc-200 transition-all"
                >
                  Volver al inicio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── WIZARD ────────────────────────────────────────────────────────────────
  const isProductStep = PRODUCT_STEPS.includes(wizardStep);
  const guide = GUIDES[wizardStep];

  return (
    <div className="animate-in fade-in duration-300">
      {/* Stage pill */}
      <div className="flex w-max mx-auto bg-white border border-zinc-200 rounded-full px-4 py-2.5 shadow-lg gap-3.5 items-center mb-7">
        {[
          { label: "Bodega", active: !isProductStep },
          { label: "Producto", active: isProductStep },
        ].map(({ label, active }, i) => (
          <div key={label} className="flex items-center gap-2.5">
            {i > 0 && <span className="text-zinc-300 font-black">›</span>}
            <div className={`flex items-center gap-2 font-black text-sm ${active ? "text-indigo-600" : "text-zinc-400"}`}>
              <div className={`w-7 h-7 rounded-full grid place-items-center font-black text-xs ${active ? "bg-indigo-50 text-indigo-600" : "bg-zinc-100 text-zinc-400"}`}>
                {i + 1}
              </div>
              {label}
            </div>
          </div>
        ))}
      </div>

      {/* Page header */}
      <div className="mb-5">
        <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-zinc-800">
          <span className="w-8 h-8 rounded-xl grid place-items-center bg-indigo-50 text-indigo-600 text-base">
            {isProductStep ? "▧" : "⌂"}
          </span>
          {isProductStep ? "Sube tu primer producto" : "Crea tu primera bodega"}
        </h2>
        <p className="text-base text-zinc-500 mt-1">
          {isProductStep
            ? "Sigue los pasos para que tu producto quede listo para revisión."
            : "Configura el punto de origen para tus despachos."}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 items-start">
        <div>
          {/* Product sub-stepper */}
          {isProductStep && (
            <div className="bg-white border border-zinc-200 rounded-[20px] shadow-sm p-5 mb-5">
              <div className="grid grid-cols-4 items-center">
                {PRODUCT_STEPS.map((step, i) => {
                  const done = completed.has(step);
                  const active = wizardStep === step;
                  return (
                    <div key={step} className="text-center relative">
                      {i < PRODUCT_STEPS.length - 1 && (
                        <div className={`absolute top-4 left-[calc(50%+17px)] w-[calc(100%-34px)] h-0.5 ${done ? "bg-sky-500" : "bg-zinc-200"}`} />
                      )}
                      <div className={`w-[34px] h-[34px] rounded-full mx-auto mb-2 grid place-items-center font-black text-sm relative z-10 ${done || active ? "bg-sky-500 text-white" : "bg-zinc-200 text-zinc-400"}`}>
                        {i + 1}
                      </div>
                      <span className={`text-xs font-bold ${done || active ? "text-sky-500" : "text-zinc-400"}`}>
                        {PRODUCT_STEP_LABELS[i]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Form card */}
          <div className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-6">
            {error && (
              <div className="mb-4 border border-red-200 bg-red-50 text-red-800 rounded-[14px] px-4 py-3 text-sm font-bold">
                {error}
              </div>
            )}

            {/* BODEGA */}
            {wizardStep === "bodega" && (
              <fieldset className="border-0 p-0 m-0">
                <legend className="text-xl font-black text-zinc-800 mb-4">Datos de la bodega</legend>
                <div className="bg-sky-50 border border-sky-200 text-sky-800 rounded-[14px] px-4 py-3 text-sm font-bold mb-5">
                  Este es el lugar desde donde despachas o entregas tus productos.
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-zinc-700">Nombre de la bodega *</label>
                    <input value={warehouseName} onChange={(e) => setWarehouseName(e.target.value)} placeholder="Ej. Bodega principal Cali" className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-zinc-700">Teléfono *</label>
                    <input value={warehousePhone} onChange={(e) => setWarehousePhone(e.target.value)} placeholder="320..." className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                  </div>
                </div>
                <div className="grid gap-2 mb-6">
                  <label className="text-sm font-bold text-zinc-700">Dirección completa *</label>
                  <textarea value={warehouseAddress} onChange={(e) => setWarehouseAddress(e.target.value)} placeholder="Ej. Calle 123 #45-67" className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 resize-y min-h-[96px]" />
                </div>
                <div className="flex justify-between items-center border-t border-zinc-100 pt-5">
                  <span className="text-sm text-zinc-400">Tu progreso se guarda automáticamente.</span>
                  <button onClick={nextBodega} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-md hover:brightness-95 transition-all">
                    Guardar y continuar →
                  </button>
                </div>
              </fieldset>
            )}

            {/* GENERAL */}
            {wizardStep === "general" && (
              <fieldset className="border-0 p-0 m-0">
                <legend className="text-xl font-black text-zinc-800 mb-4">Información general</legend>
                <div className="grid gap-2 mb-4">
                  <label className="text-sm font-bold text-zinc-700">Nombre del producto *</label>
                  <input value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Ej. Jabón artesanal" className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                </div>
                <div className="bg-sky-50 border border-sky-200 text-sky-800 rounded-[14px] px-4 py-3 text-sm font-bold mb-4">
                  Asegúrate de ingresar medidas reales para calcular el envío correctamente.
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Peso (g) *", value: peso, setter: setPeso, placeholder: "Ej. 250" },
                    { label: "Largo (cm) *", value: largo, setter: setLargo, placeholder: "Ej. 10" },
                    { label: "Ancho (cm) *", value: ancho, setter: setAncho, placeholder: "Ej. 8" },
                    { label: "Alto (cm) *", value: alto, setter: setAlto, placeholder: "Ej. 4" },
                  ].map(({ label, value, setter, placeholder }) => (
                    <div key={label} className="grid gap-2">
                      <label className="text-sm font-bold text-zinc-700">{label}</label>
                      <input type="number" value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-zinc-100 pt-5">
                  <button onClick={() => goTo("bodega")} className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-700 font-black text-sm hover:bg-zinc-200 transition-all">Atrás</button>
                  <button onClick={nextGeneral} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-md hover:brightness-95 transition-all">Siguiente →</button>
                </div>
              </fieldset>
            )}

            {/* STOCK */}
            {wizardStep === "stock" && (
              <fieldset className="border-0 p-0 m-0">
                <legend className="text-xl font-black text-zinc-800 mb-2">Asignar stock</legend>
                <p className="text-sm text-zinc-500 mb-5">Para productos públicos, requerimos al menos 100 unidades en stock para garantizar disponibilidad a los dropshippers.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-zinc-700">Bodega</label>
                    <input disabled value={warehouseName || "bodega 1 (principal)"} className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 text-base bg-zinc-50 text-zinc-400" />
                  </div>
                  <div className="grid gap-2">
                    <label className="text-sm font-bold text-zinc-700">Cantidad *</label>
                    <input type="number" min={0} value={stockQty} onChange={(e) => setStockQty(e.target.value)} placeholder="Mínimo 100" className="w-full border border-zinc-200 rounded-xl px-4 py-3.5 text-base outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" />
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-zinc-100 pt-5">
                  <button onClick={() => goTo("general")} className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-700 font-black text-sm hover:bg-zinc-200 transition-all">Atrás</button>
                  <button onClick={nextStock} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-md hover:brightness-95 transition-all">Siguiente →</button>
                </div>
              </fieldset>
            )}

            {/* IMÁGENES */}
            {wizardStep === "imagenes" && (
              <fieldset className="border-0 p-0 m-0">
                <legend className="text-xl font-black text-zinc-800 mb-2">Imágenes del producto</legend>
                <p className="text-sm text-zinc-500 mb-3">Sube mínimo 3 imágenes que muestren tu producto desde distintos ángulos.</p>
                <div className="bg-sky-50 border border-sky-200 text-sky-800 rounded-[14px] px-4 py-3 text-sm font-bold mb-4">
                  No necesitas fotos profesionales. Usa buena luz, fondo limpio y muestra el producto claramente.
                </div>
                <button
                  onClick={() => setImagesCount((c) => c + 1)}
                  className="w-full border-2 border-dashed border-green-400 bg-green-50 rounded-[18px] py-6 grid place-items-center text-green-700 font-black cursor-pointer mb-4 hover:bg-green-100 transition-all"
                >
                  AGREGAR UNA IMAGEN ({imagesCount} cargadas)
                </button>
                {imagesCount > 0 && (
                  <div className="grid grid-cols-3 gap-3.5 mb-5">
                    {Array.from({ length: imagesCount }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[120px] rounded-2xl border border-zinc-200"
                        style={{ background: "radial-gradient(circle at 30% 30%, rgba(22,163,74,0.22), transparent 28%), linear-gradient(135deg, #eee8da, #d8c7aa)" }}
                      />
                    ))}
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-zinc-100 pt-5">
                  <button onClick={() => goTo("stock")} className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-700 font-black text-sm hover:bg-zinc-200 transition-all">Atrás</button>
                  <button onClick={nextImagenes} className="px-5 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm shadow-md hover:brightness-95 transition-all">Siguiente →</button>
                </div>
              </fieldset>
            )}

            {/* GARANTÍAS */}
            {wizardStep === "garantias" && (
              <fieldset className="border-0 p-0 m-0">
                <legend className="text-xl font-black text-zinc-800 mb-2">Garantías por defecto</legend>
                <p className="text-sm text-zinc-500 mb-5">Estas garantías son obligatorias para proteger a compradores, dropshippers y proveedores. Usaremos una política estándar que podrás revisar más adelante.</p>
                <div className="grid gap-3 mb-6">
                  {[
                    { checked: g1, setter: setG1, title: "Orden incompleta", desc: "Aplica cuando falta uno o más productos, piezas o componentes." },
                    { checked: g2, setter: setG2, title: "Mal funcionamiento", desc: "Aplica cuando el producto no cumple su función correctamente." },
                    { checked: g3, setter: setG3, title: "Producto roto", desc: "Aplica cuando el cliente recibe el producto con daños físicos visibles." },
                  ].map(({ checked, setter, title, desc }) => (
                    <label key={title} className="grid grid-cols-[28px_1fr] gap-3 border border-zinc-200 bg-zinc-50 rounded-2xl p-4 cursor-pointer">
                      <input type="checkbox" checked={checked} onChange={(e) => { setter(e.target.checked); setError(""); }} className="w-[22px] h-[22px] mt-0.5 accent-sky-500" />
                      <div>
                        <strong className="block text-sm font-black text-zinc-800 mb-1">{title}</strong>
                        <span className="text-sm text-zinc-500">{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
                <div className="flex justify-between items-center border-t border-zinc-100 pt-5">
                  <button onClick={() => goTo("imagenes")} className="px-5 py-3 rounded-2xl bg-zinc-100 text-zinc-700 font-black text-sm hover:bg-zinc-200 transition-all">Atrás</button>
                  <button onClick={finish} className="px-5 py-3 rounded-2xl bg-orange-400 text-white font-black text-sm shadow-md hover:bg-orange-500 transition-all">
                    Guardar y finalizar
                  </button>
                </div>
              </fieldset>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="bg-white border border-zinc-200 rounded-3xl shadow-lg p-5 sticky top-24">
          <h3 className="font-black text-zinc-800 text-base mb-1">Avance de activación</h3>
          <p className="text-sm text-zinc-500 mb-4">Completa cada paso para dejar tu producto listo para revisión.</p>

          <div className="grid gap-2.5 mb-5">
            {MINI_STEPS.map(({ key, label, num }) => {
              const done = completed.has(key);
              const active = wizardStep === key;
              return (
                <div key={key} className="grid grid-cols-[26px_1fr] gap-2.5 items-center text-sm">
                  <div className={`w-6 h-6 rounded-[9px] grid place-items-center font-black text-xs ${done ? "bg-green-50 text-green-700" : active ? "bg-indigo-50 text-indigo-600" : "bg-zinc-100 text-zinc-400"}`}>
                    {done ? "✓" : num}
                  </div>
                  <span className={`font-bold ${done ? "text-green-800" : active ? "text-indigo-700" : "text-zinc-500"}`}>{label}</span>
                </div>
              );
            })}
          </div>

          {/* Contextual guide card */}
          <div className="border border-zinc-200 rounded-[18px] overflow-hidden bg-white">
            <div className="min-h-[94px] grid grid-cols-[58px_1fr_42px] gap-3 items-center px-3.5 bg-gradient-to-br from-indigo-50 to-orange-50">
              <div className="w-[58px] h-[58px] rounded-full bg-gradient-to-br from-white to-orange-100 border-2 border-white shadow-md relative">
                <div className="absolute top-[23px] left-[18px] w-1.5 h-1.5 rounded-full bg-amber-900" />
                <div className="absolute top-[23px] right-[18px] w-1.5 h-1.5 rounded-full bg-amber-900" />
                <div className="absolute left-[19px] top-[36px] w-[18px] h-[9px] border-b-2 border-amber-900 rounded-b-[14px]" />
              </div>
              <div>
                <div className="font-black text-zinc-800 text-sm leading-tight">{guide.title}</div>
                <div className="text-zinc-400 text-xs mt-0.5">{guide.time}</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-600 grid place-items-center text-white font-black text-sm">▶</div>
            </div>
            <div className="px-3.5 py-3 text-sm text-zinc-500">{guide.text}</div>
          </div>
        </aside>
      </div>
    </div>
  );
}
