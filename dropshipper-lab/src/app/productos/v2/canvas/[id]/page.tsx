"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  X,
  Check,
  Clock,
  Loader2,
  PlayCircle,
  Smartphone,
  Monitor,
  LayoutTemplate,
  User,
  Film,
} from "lucide-react";

// ─── Product lookup ───────────────────────────────────────

const PRODUCTS: Record<string, { name: string; provider: string; precio: number; imgUrl: string }> = {
  "1": { name: "Buzo Largo Dama Azul Bebe S",      provider: "MAYRO'S",           precio: 45000,  imgUrl: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=160&h=160&fit=crop&auto=format&q=80" },
  "2": { name: "Bota Jordan Six Orux",              provider: "LORAYNE'S BOUTIQUE",precio: 68000,  imgUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=160&h=160&fit=crop&auto=format&q=80" },
  "3": { name: "Aro De 33 Cm Corazon Tripode",      provider: "MARVIN",            precio: 65000,  imgUrl: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=160&h=160&fit=crop&auto=format&q=80" },
  "4": { name: "Duo Mayar Yara",                    provider: "FRAGANCE",          precio: 88000,  imgUrl: "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=160&h=160&fit=crop&auto=format&q=80" },
  "5": { name: "Kemei Profesional Recortadora 100", provider: "TECH MARKET",       precio: 89000,  imgUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=160&h=160&fit=crop&auto=format&q=80" },
  "6": { name: "Ultra Car Cleaner x2 Unidades",     provider: "AUTO CLEAN CO",     precio: 49000,  imgUrl: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=160&h=160&fit=crop&auto=format&q=80" },
  "7": { name: "Linterna Táctica LED 1500mAh",      provider: "DROPI TECH",        precio: 39000,  imgUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=160&h=160&fit=crop&auto=format&q=80" },
  "8": { name: "Kit Auto Supply Cuidado Premium",   provider: "AUTO SUPPLY",       precio: 120000, imgUrl: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=160&h=160&fit=crop&auto=format&q=80" },
};

// ─── Canvas data ──────────────────────────────────────────

const PROFILES = [
  { id: 1, emoji: "👩‍👧", name: "Mamá emprendedora", desc: "35–45 años · busca ingresos extra" },
  { id: 2, emoji: "🧑‍💻", name: "Joven digital",      desc: "18–28 años · vive en redes sociales" },
  { id: 3, emoji: "💼", name: "Profesional ocupado", desc: "28–40 años · valora practicidad" },
];

const ANGLES = [
  { id: 1, icon: "⚡", name: "Problema → Solución", desc: "Muestra el dolor y cómo el producto lo resuelve" },
  { id: 2, icon: "🎬", name: "Demostración",         desc: "El producto en uso real con resultados visibles" },
  { id: 3, icon: "⭐", name: "Testimonial",           desc: "Historia real de un cliente satisfecho" },
  { id: 4, icon: "🔥", name: "Comparación",           desc: "Antes vs después · tu producto vs la competencia" },
];

const HOOKS_BY_ANGLE: Record<number, { id: number; text: string }[]> = {
  1: [
    { id: 1,  text: "¿Cansado de no ver resultados? Mira esto..." },
    { id: 2,  text: "El 90% de personas comete este error..." },
    { id: 3,  text: "Así lo resolví en menos de 3 días" },
  ],
  2: [
    { id: 4,  text: "Mira lo que hace en solo 30 segundos" },
    { id: 5,  text: "No vas a creer lo fácil que es..." },
    { id: 6,  text: "La prueba que estabas esperando 👇" },
  ],
  3: [
    { id: 7,  text: "Me llegó y en 2 días ya tenía resultados" },
    { id: 8,  text: '"Pensé que era mentira hasta que lo probé"' },
    { id: 9,  text: "Esta es mi historia con este producto..." },
  ],
  4: [
    { id: 10, text: "Esto vs lo que vendían antes... no hay comparación" },
    { id: 11, text: "¿Por qué gastar más si esto hace lo mismo?" },
    { id: 12, text: "La diferencia entre este y los demás es enorme" },
  ],
};

function buildScript(productName: string, profileName: string, angleName: string, hookText: string) {
  return `🎬 Hook (0–5s)
"${hookText}"

📸 Desarrollo (5–20s)
Mostrar ${profileName} usando ${productName} en su día a día. Destacar: facilidad de uso, resultado visible, beneficio principal.

💡 Prueba social (20–25s)
Mostrar reseñas reales, número de ventas y badge verificado Dropi. Ángulo: ${angleName}.

✅ Cierre (25–30s)
"¿Lo quieres? Link en bio 🔗 · Envío gratis hoy"

──────────────────────
📝 Caption sugerido:
¿Eres ${profileName.toLowerCase()} y aún no conoces ${productName}? 👇 Esto cambia todo. Link en bio.`;
}

// ─── Wizard data ──────────────────────────────────────────

const FORMAT_OPTIONS = [
  { id: "tiktok",   Icon: Smartphone,    label: "TikTok / Reels",   sub: "Vertical 9:16" },
  { id: "youtube",  Icon: Monitor,       label: "YouTube / Ads",    sub: "Horizontal 16:9" },
  { id: "feed",     Icon: LayoutTemplate,label: "Feed Instagram",   sub: "Cuadrado 1:1" },
  { id: "story",    Icon: Smartphone,    label: "Story / Estado",   sub: "Vertical 9:16" },
];

const VISUAL_STYLES = [
  { id: "avatar",  Icon: User,          label: "Avatar IA",        desc: "Presentador virtual con voz y guión integrado" },
  { id: "broll",   Icon: Film,          label: "B-roll producto",  desc: "Tomas del producto en uso, sin presentador" },
  { id: "mixed",   Icon: LayoutTemplate,label: "Mixto",            desc: "Combina avatar con tomas del producto" },
];

// ─── Page ─────────────────────────────────────────────────

export default function CanvasPage() {
  const params = useParams();
  const productId = String(params.id ?? "1");
  const product = PRODUCTS[productId] ?? PRODUCTS["1"];

  // Canvas selections
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);
  const [selectedAngleId,   setSelectedAngleId]   = useState<number | null>(null);
  const [selectedHookId,    setSelectedHookId]    = useState<number | null>(null);

  // Wizard state
  const [showWizard,     setShowWizard]     = useState(false);
  const [wizardStep,     setWizardStep]     = useState(0);
  const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
  const [selectedStyle,  setSelectedStyle]  = useState<string | null>(null);
  const [scriptText,     setScriptText]     = useState("");
  const [generating,     setGenerating]     = useState(false);
  const [generated,      setGenerated]      = useState(false);

  const selectedProfile = PROFILES.find(p => p.id === selectedProfileId);
  const selectedAngle   = ANGLES.find(a => a.id === selectedAngleId);
  const availableHooks  = selectedAngleId ? (HOOKS_BY_ANGLE[selectedAngleId] ?? []) : [];
  const selectedHook    = availableHooks.find(h => h.id === selectedHookId);

  const canGenerate = selectedProfileId !== null && selectedAngleId !== null && selectedHookId !== null;
  const generatedScript = (canGenerate && selectedProfile && selectedAngle && selectedHook)
    ? buildScript(product.name, selectedProfile.name, selectedAngle.name, selectedHook.text)
    : "";

  function handleAngleSelect(id: number) {
    setSelectedAngleId(id);
    setSelectedHookId(null);
  }

  function openWizard() {
    setScriptText(generatedScript);
    setWizardStep(0);
    setSelectedFormat(null);
    setSelectedStyle(null);
    setGenerating(false);
    setGenerated(false);
    setShowWizard(true);
  }

  async function handleGenerate() {
    setGenerating(true);
    await new Promise(r => setTimeout(r, 2500));
    setGenerating(false);
    setGenerated(true);
  }

  function fmt(n: number) { return n.toLocaleString("es-CO"); }

  return (
    <div className="flex flex-col h-full bg-zinc-50">

      {/* ── Breadcrumb ── */}
      <div className="bg-white border-b border-zinc-200 px-5 py-3 flex items-center gap-2 flex-shrink-0">
        <Link href="/productos/v2" className="text-sm text-zinc-500 hover:text-zinc-800 transition-colors">
          Contenido IA
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
        <span className="text-sm text-zinc-900 font-medium truncate max-w-[220px]">{product.name}</span>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
        <span className="text-sm text-zinc-400">Canvas</span>

        {/* Product mini-info */}
        <div className="ml-auto flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.imgUrl}
            alt={product.name}
            className="w-8 h-8 rounded-lg object-cover border border-zinc-200"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="hidden sm:block">
            <p className="text-xs font-semibold text-zinc-900 leading-none">{product.name}</p>
            <p className="text-[11px] text-zinc-400">$ {fmt(product.precio)}</p>
          </div>
        </div>
      </div>

      {/* ── Canvas area ── */}
      <div className="flex-1 overflow-auto p-6">
        <div className="flex items-start gap-2 min-w-max">

          {/* Col 1 — Producto */}
          <CanvasColumn step={1} title="Producto" hint="Tu punto de partida" active>
            <div className="w-[176px] bg-white border-2 border-dropi rounded-xl overflow-hidden shadow-sm">
              <div className="aspect-square relative bg-gradient-to-br from-zinc-50 to-zinc-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.imgUrl}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div className="p-3">
                <p className="text-xs font-bold text-zinc-900 line-clamp-2 leading-snug">{product.name}</p>
                <p className="text-[11px] text-dropi font-semibold mt-0.5">{product.provider}</p>
                <p className="text-xs text-zinc-400 mt-0.5">$ {fmt(product.precio)}</p>
              </div>
            </div>
          </CanvasColumn>

          <ColArrow active={selectedProfileId !== null} />

          {/* Col 2 — Perfiles */}
          <CanvasColumn step={2} title="Perfil de audiencia" hint="¿A quién le vendes?" active={selectedProfileId !== null}>
            <div className="space-y-2">
              {PROFILES.map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProfileId(prev => prev === p.id ? null : p.id)}
                  className={`w-[176px] text-left p-3 rounded-xl border-2 transition-all ${
                    selectedProfileId === p.id
                      ? "border-dropi bg-dropi-muted shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <span className="text-2xl block mb-1">{p.emoji}</span>
                  <p className="text-xs font-bold text-zinc-900">{p.name}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{p.desc}</p>
                </button>
              ))}
            </div>
          </CanvasColumn>

          <ColArrow active={selectedAngleId !== null} />

          {/* Col 3 — Ángulos */}
          <CanvasColumn step={3} title="Ángulo creativo" hint="El enfoque del contenido" active={selectedAngleId !== null}>
            <div className="space-y-2">
              {ANGLES.map(a => (
                <button
                  key={a.id}
                  onClick={() => handleAngleSelect(a.id)}
                  className={`w-[196px] text-left p-3 rounded-xl border-2 transition-all ${
                    selectedAngleId === a.id
                      ? "border-dropi bg-dropi-muted shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300"
                  }`}
                >
                  <span className="text-xl block mb-1">{a.icon}</span>
                  <p className="text-xs font-bold text-zinc-900">{a.name}</p>
                  <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{a.desc}</p>
                </button>
              ))}
            </div>
          </CanvasColumn>

          <ColArrow active={selectedHookId !== null} />

          {/* Col 4 — Hooks */}
          <CanvasColumn step={4} title="Hook de apertura" hint="Las primeras palabras" active={selectedHookId !== null}>
            {availableHooks.length === 0 ? (
              <div className="w-[196px] p-4 rounded-xl border-2 border-dashed border-zinc-200 text-center min-h-[80px] flex items-center justify-center">
                <p className="text-xs text-zinc-400">Selecciona un ángulo primero</p>
              </div>
            ) : (
              <div className="space-y-2">
                {availableHooks.map(h => (
                  <button
                    key={h.id}
                    onClick={() => setSelectedHookId(prev => prev === h.id ? null : h.id)}
                    className={`w-[196px] text-left p-3 rounded-xl border-2 transition-all ${
                      selectedHookId === h.id
                        ? "border-dropi bg-dropi-muted shadow-sm"
                        : "border-zinc-200 bg-white hover:border-zinc-300"
                    }`}
                  >
                    <p className="text-xs font-semibold text-zinc-800 leading-snug italic">"{h.text}"</p>
                  </button>
                ))}
              </div>
            )}
          </CanvasColumn>

          <ColArrow active={canGenerate} />

          {/* Col 5 — Guión */}
          <CanvasColumn step={5} title="Guión generado" hint="Tu script listo para usar" active={canGenerate}>
            {!canGenerate ? (
              <div className="w-[212px] p-5 rounded-xl border-2 border-dashed border-zinc-200 flex flex-col items-center justify-center gap-2 min-h-[120px]">
                <Sparkles className="w-6 h-6 text-zinc-300" />
                <p className="text-xs text-zinc-400 text-center leading-snug">
                  Completa los pasos anteriores para ver tu guión
                </p>
              </div>
            ) : (
              <div className="w-[212px] bg-white border-2 border-dropi rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-dropi" />
                  <span className="text-[11px] font-bold text-dropi uppercase tracking-wide">Guión IA</span>
                  <span className="ml-auto flex items-center gap-0.5 text-[10px] text-zinc-400">
                    <Clock className="w-3 h-3" /> ~30s
                  </span>
                </div>
                <pre className="text-[11px] text-zinc-700 leading-relaxed whitespace-pre-wrap font-sans line-clamp-[14]">
                  {generatedScript}
                </pre>
              </div>
            )}
          </CanvasColumn>

        </div>
      </div>

      {/* ── Bottom action bar ── */}
      <div className="bg-white border-t border-zinc-200 px-5 py-3 flex items-center gap-3 flex-shrink-0">
        {/* Progress pills */}
        <div className="flex items-center gap-2 text-sm text-zinc-500 overflow-x-auto">
          {[
            { label: "Producto", done: true },
            { label: "Perfil",   done: selectedProfileId !== null },
            { label: "Ángulo",   done: selectedAngleId !== null },
            { label: "Hook",     done: selectedHookId !== null },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-1.5 flex-shrink-0">
              <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${step.done ? "bg-dropi" : "bg-zinc-200"}`}>
                {step.done && <Check className="w-2.5 h-2.5 text-white" />}
              </div>
              <span className={`text-xs ${step.done ? "text-zinc-800 font-medium" : "text-zinc-400"}`}>{step.label}</span>
              {i < 3 && <ChevronRight className="w-3 h-3 text-zinc-300" />}
            </div>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3 flex-shrink-0">
          <Link href="/productos/v2" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
            ← Volver
          </Link>
          <button
            onClick={openWizard}
            disabled={!canGenerate}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
              canGenerate
                ? "bg-dropi text-white hover:opacity-90 shadow-sm"
                : "bg-zinc-100 text-zinc-400 cursor-not-allowed"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            Generar contenido IA
          </button>
        </div>
      </div>

      {/* ── Wizard modal ── */}
      {showWizard && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">

            {/* Header */}
            <div className="px-6 pt-5 pb-4 border-b border-zinc-100 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-dropi flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-zinc-900">Crear contenido IA</h2>
                <p className="text-xs text-zinc-400 truncate max-w-[260px]">{product.name}</p>
              </div>
              <button onClick={() => setShowWizard(false)} className="ml-auto text-zinc-400 hover:text-zinc-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Step indicator */}
            <div className="px-6 py-3 border-b border-zinc-100">
              <div className="flex items-center gap-1.5">
                {["Formato", "Guión", "Estilo", "Preview"].map((s, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className={`flex items-center gap-1.5 text-xs font-semibold ${i === wizardStep ? "text-dropi" : i < wizardStep ? "text-zinc-400" : "text-zinc-300"}`}>
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${i === wizardStep ? "bg-dropi text-white" : i < wizardStep ? "bg-zinc-200 text-zinc-500" : "bg-zinc-100 text-zinc-300"}`}>
                        {i < wizardStep ? <Check className="w-3 h-3" /> : i + 1}
                      </div>
                      <span className="hidden sm:inline">{s}</span>
                    </div>
                    {i < 3 && <ChevronRight className="w-3 h-3 text-zinc-200 flex-shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Step content */}
            <div className="px-6 py-5 min-h-[280px]">

              {/* Step 0 — Formato */}
              {wizardStep === 0 && (
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-1">¿Qué formato vas a crear?</h3>
                  <p className="text-xs text-zinc-400 mb-4">Elige el canal donde vas a publicar tu contenido</p>
                  <div className="grid grid-cols-2 gap-3">
                    {FORMAT_OPTIONS.map(({ id, Icon, label, sub }) => (
                      <button
                        key={id}
                        onClick={() => setSelectedFormat(id)}
                        className={`p-3 rounded-xl border-2 text-left transition-all ${
                          selectedFormat === id ? "border-dropi bg-dropi-muted" : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${selectedFormat === id ? "bg-dropi" : "bg-zinc-100"}`}>
                          <Icon className={`w-4 h-4 ${selectedFormat === id ? "text-white" : "text-zinc-500"}`} />
                        </div>
                        <p className="text-xs font-bold text-zinc-900">{label}</p>
                        <p className="text-[11px] text-zinc-400">{sub}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 1 — Guión */}
              {wizardStep === 1 && (
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-1">Revisa tu guión</h3>
                  <p className="text-xs text-zinc-400 mb-3">Edítalo si necesitas ajustarlo antes de generar</p>
                  <textarea
                    value={scriptText}
                    onChange={e => setScriptText(e.target.value)}
                    className="w-full h-44 text-xs text-zinc-700 border border-zinc-200 rounded-xl p-3 resize-none focus:outline-none focus:border-dropi leading-relaxed"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[11px] text-zinc-400">{scriptText.length} caracteres</span>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400">
                      <Clock className="w-3 h-3" /> ~30 segundos de video
                    </span>
                  </div>
                </div>
              )}

              {/* Step 2 — Estilo visual */}
              {wizardStep === 2 && (
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 mb-1">Estilo visual</h3>
                  <p className="text-xs text-zinc-400 mb-4">¿Cómo quieres que se vea tu contenido?</p>
                  <div className="space-y-3">
                    {VISUAL_STYLES.map(({ id, Icon, label, desc }) => (
                      <button
                        key={id}
                        onClick={() => setSelectedStyle(id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                          selectedStyle === id ? "border-dropi bg-dropi-muted" : "border-zinc-200 hover:border-zinc-300"
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${selectedStyle === id ? "bg-dropi" : "bg-zinc-100"}`}>
                          <Icon className={`w-5 h-5 ${selectedStyle === id ? "text-white" : "text-zinc-500"}`} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-zinc-900">{label}</p>
                          <p className="text-xs text-zinc-400">{desc}</p>
                        </div>
                        {selectedStyle === id && (
                          <div className="w-5 h-5 rounded-full bg-dropi flex items-center justify-center flex-shrink-0">
                            <Check className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3 — Preview / Generate */}
              {wizardStep === 3 && (
                <div className="flex flex-col items-center justify-center min-h-[260px] gap-4">
                  {!generating && !generated && (
                    <>
                      <div className="w-16 h-16 rounded-2xl bg-dropi-muted flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-dropi" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-sm font-bold text-zinc-900 mb-1">¡Todo listo!</h3>
                        <p className="text-xs text-zinc-400">La IA va a generar tu contenido con el guión y estilo elegidos</p>
                      </div>
                      <div className="w-full bg-zinc-50 rounded-xl p-3 text-xs text-zinc-500 space-y-1.5">
                        <div className="flex justify-between">
                          <span>Formato:</span>
                          <span className="font-semibold text-zinc-800">{FORMAT_OPTIONS.find(f => f.id === selectedFormat)?.label ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Estilo:</span>
                          <span className="font-semibold text-zinc-800">{VISUAL_STYLES.find(s => s.id === selectedStyle)?.label ?? "—"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Duración:</span>
                          <span className="font-semibold text-zinc-800">~30 segundos</span>
                        </div>
                      </div>
                    </>
                  )}

                  {generating && (
                    <>
                      <div className="w-16 h-16 rounded-full bg-dropi-muted flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-dropi animate-spin" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-zinc-900 mb-1">Generando tu contenido...</p>
                        <p className="text-xs text-zinc-400">La IA está trabajando en tu video</p>
                      </div>
                      <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-dropi h-1.5 rounded-full w-3/4 transition-all duration-[2500ms]" />
                      </div>
                    </>
                  )}

                  {generated && (
                    <>
                      <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Check className="w-8 h-8 text-emerald-600" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-zinc-900 mb-1">¡Contenido creado!</p>
                        <p className="text-xs text-zinc-400">
                          Tu {FORMAT_OPTIONS.find(f => f.id === selectedFormat)?.label} está listo
                        </p>
                      </div>
                      <div className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0">
                          <PlayCircle className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-zinc-900 truncate">{product.name}</p>
                          <p className="text-[11px] text-zinc-400">
                            {FORMAT_OPTIONS.find(f => f.id === selectedFormat)?.sub} · {VISUAL_STYLES.find(s => s.id === selectedStyle)?.label}
                          </p>
                        </div>
                        <span className="text-[11px] font-bold text-dropi flex-shrink-0">Ver →</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 pb-5 flex items-center gap-3">
              {wizardStep > 0 && !generated && (
                <button
                  onClick={() => setWizardStep(s => s - 1)}
                  disabled={generating}
                  className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-800 transition-colors disabled:opacity-40"
                >
                  <ChevronLeft className="w-4 h-4" /> Atrás
                </button>
              )}
              <div className="ml-auto">
                {wizardStep < 2 && (
                  <button
                    onClick={() => setWizardStep(s => s + 1)}
                    disabled={wizardStep === 0 && !selectedFormat}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                      wizardStep === 0 && !selectedFormat
                        ? "bg-zinc-100 text-zinc-400 cursor-not-allowed"
                        : "bg-dropi text-white hover:opacity-90"
                    }`}
                  >
                    Siguiente →
                  </button>
                )}
                {wizardStep === 2 && (
                  <button
                    onClick={() => setWizardStep(3)}
                    disabled={!selectedStyle}
                    className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                      !selectedStyle ? "bg-zinc-100 text-zinc-400 cursor-not-allowed" : "bg-dropi text-white hover:opacity-90"
                    }`}
                  >
                    Siguiente →
                  </button>
                )}
                {wizardStep === 3 && !generated && !generating && (
                  <button
                    onClick={handleGenerate}
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-dropi text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    <Sparkles className="w-4 h-4" /> Generar ahora
                  </button>
                )}
                {wizardStep === 3 && generated && (
                  <button
                    onClick={() => setShowWizard(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Listo ✓
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

// ─── Canvas sub-components ────────────────────────────────

function CanvasColumn({ step, title, hint, active, children }: {
  step: number;
  title: string;
  hint: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black flex-shrink-0 transition-colors ${active ? "bg-dropi text-white" : "bg-zinc-200 text-zinc-400"}`}>
            {step}
          </div>
          <span className={`text-xs font-bold transition-colors ${active ? "text-zinc-900" : "text-zinc-400"}`}>{title}</span>
        </div>
        <p className="text-[11px] text-zinc-400 ml-7">{hint}</p>
      </div>
      {children}
    </div>
  );
}

function ColArrow({ active }: { active: boolean }) {
  return (
    <div className="flex items-center self-start mt-9 flex-shrink-0 w-7">
      <div className={`flex-1 h-px transition-colors ${active ? "bg-dropi" : "bg-zinc-300"}`} />
      <ChevronRight className={`w-4 h-4 -ml-0.5 flex-shrink-0 transition-colors ${active ? "text-dropi" : "text-zinc-300"}`} />
    </div>
  );
}
