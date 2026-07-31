"use client";

import { useState } from "react";
import {
  Sprout, Rocket, Building2,
  Package, ShoppingCart, ShieldCheck, Truck, Wallet, BarChart2,
  Settings, GraduationCap, Lock, Check, CheckCircle2, ArrowRight,
  HelpCircle, Laptop, Home as HomeIcon, Shirt, Dumbbell, Sparkles,
  Star, FileSpreadsheet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { ProductCreateWizard } from "@/components/ProductCreateWizard";
import { trackEvent } from "@/lib/analytics";

// ─── Types ─────────────────────────────────────────────────────────────────

type Route = "principiante" | "consolidacion" | "escalabilidad";
type Moment = 1 | 2 | 3 | 4 | 5;

interface ProfileAnswers {
  productVolume: string;
  category: string;
  sellsOnline: boolean | null;
  city: string;
}

interface BodegaData {
  nombre: string;
  telefono: string;
  departamento: string;
  ciudad: string;
  direccion: string;
}

interface ProductoData {
  nombre: string;
  stock: string;
}

// ─── Static data ───────────────────────────────────────────────────────────

const ROUTES_CONFIG = [
  {
    id: "principiante" as Route,
    icon: Sprout,
    label: "Principiante",
    tagline: "Soy nuevo vendiendo online",
    desc: "No te preocupes, te guiamos paso a paso sin tecnicismos.",
    bullets: ["Explicaciones en cada campo", "Un paso a la vez", "Listo en ~15 min"],
    color: "#ff7b00",
    bg: "#fff7f0",
    border: "#ffb366",
    badge: "Más elegido",
  },
  {
    id: "consolidacion" as Route,
    icon: Rocket,
    label: "Consolidación",
    tagline: "Ya vendo en otra plataforma",
    desc: "Actívate rápido con el formulario directo, sin pasos extra.",
    bullets: ["Sin tutoriales extra", "Formulario estándar", "Listo en ~5 min"],
    color: "#0ea5e9",
    bg: "#f0f9ff",
    border: "#7dd3fc",
    badge: null,
  },
  {
    id: "escalabilidad" as Route,
    icon: Building2,
    label: "Escalabilidad",
    tagline: "Tengo un negocio establecido",
    desc: "Carga masiva, múltiples bodegas y configuración avanzada.",
    bullets: ["Importación de catálogo CSV", "Multi-bodega", "Config avanzada"],
    color: "#8b5cf6",
    bg: "#f5f3ff",
    border: "#c4b5fd",
    badge: null,
  },
] as const;

const ACTIVATION_STEPS = [
  { id: 1 as Moment, label: "Elige tu ruta" },
  { id: 2 as Moment, label: "Tu perfil" },
  { id: 3 as Moment, label: "Bodega" },
  { id: 4 as Moment, label: "Primer producto" },
  { id: 5 as Moment, label: "¡Todo listo!" },
];

const LOCKED_NAV = [
  { label: "Productos", icon: Package },
  { label: "Órdenes", icon: ShoppingCart },
  { label: "Mis Garantías", icon: ShieldCheck },
  { label: "Logistic", icon: Truck },
  { label: "Mi Wallet", icon: Wallet },
  { label: "Reportes", icon: BarChart2 },
  { label: "Configuraciones", icon: Settings },
  { label: "Academy", icon: GraduationCap },
];

const CATEGORIES = [
  { id: "tecnologia", label: "Tecnología", icon: Laptop },
  { id: "hogar", label: "Hogar", icon: HomeIcon },
  { id: "moda", label: "Moda", icon: Shirt },
  { id: "deportes", label: "Deportes", icon: Dumbbell },
  { id: "belleza", label: "Belleza", icon: Sparkles },
  { id: "otro", label: "Otro", icon: Star },
];

// ─── Root component ────────────────────────────────────────────────────────

export default function ActivacionGuiadaPage() {
  const router = useRouter();

  const [moment, setMoment] = useState<Moment>(1);
  const [completedMoments, setCompletedMoments] = useState<Set<Moment>>(new Set());
  const [route, setRoute] = useState<Route | null>(null);

  const [profile, setProfile] = useState<ProfileAnswers>({
    productVolume: "",
    category: "",
    sellsOnline: null,
    city: "",
  });

  const [bodega, setBodega] = useState<BodegaData>({
    nombre: "",
    telefono: "",
    departamento: "",
    ciudad: "",
    direccion: "",
  });

  const [producto, setProducto] = useState<ProductoData>({ nombre: "", stock: "" });
  const [wizardDone, setWizardDone] = useState(false);

  const selectedRoute = ROUTES_CONFIG.find((r) => r.id === route);

  const canAdvance = (): boolean => {
    if (moment === 1) return route !== null;
    if (moment === 2) return profile.productVolume !== "" && profile.category !== "" && profile.sellsOnline !== null;
    if (moment === 3) return bodega.nombre.trim() !== "" && bodega.direccion.trim() !== "";
    if (moment === 4) {
      if (route === "principiante") return wizardDone;
      return producto.nombre.trim() !== "" && producto.stock.trim() !== "";
    }
    return false;
  };

  const advanceTo = (next: Moment) => {
    setCompletedMoments((prev) => new Set([...prev, moment]));
    setMoment(next);
    trackEvent("activation_moment_completed", { moment, route: route ?? "none" });
  };

  return (
    <div className="flex h-screen bg-zinc-50 overflow-hidden font-sans text-zinc-900">

      {/* ── Left sidebar ───────────────────────────────────────────── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-zinc-200 flex flex-col h-full">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-100 flex-shrink-0">
          <img
            src="https://d1l4mzebo786pw.cloudfront.net/image/input/white-labels/1/logos/secondary_logo/logo-naranja.png"
            alt="Dropi"
            className="h-8 object-contain"
          />
        </div>

        <div className="flex-1 flex flex-col overflow-y-auto px-4 py-5 gap-5">
          {/* Route badge */}
          {selectedRoute ? (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border"
              style={{
                color: selectedRoute.color,
                background: selectedRoute.bg,
                borderColor: selectedRoute.border,
              }}
            >
              <selectedRoute.icon className="w-4 h-4 flex-shrink-0" />
              <span>{selectedRoute.label}</span>
            </div>
          ) : (
            <div className="px-3 py-2 rounded-xl border border-dashed border-zinc-200 text-xs text-zinc-400">
              Elige tu ruta para comenzar
            </div>
          )}

          {/* Steps */}
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-3">
              Activación · {Math.min(moment, 5)} de 5
            </p>
            <div className="space-y-0">
              {ACTIVATION_STEPS.map((step, i) => {
                const isDone = completedMoments.has(step.id);
                const isActive = moment === step.id;
                return (
                  <div key={step.id} className="flex items-start gap-3">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                          isDone
                            ? "bg-[#ff7b00] text-white"
                            : isActive
                            ? "border-2 border-[#ff7b00] text-[#ff7b00] bg-white"
                            : "border-2 border-zinc-200 text-zinc-400 bg-white"
                        }`}
                      >
                        {isDone ? <Check className="w-3.5 h-3.5" /> : step.id}
                      </div>
                      {i < ACTIVATION_STEPS.length - 1 && (
                        <div
                          className="w-px h-8 mt-0.5 transition-all duration-300"
                          style={{ background: isDone ? "#ff7b00" : "#e4e4e7" }}
                        />
                      )}
                    </div>
                    <p
                      className={`pt-1 text-sm leading-tight transition-colors ${
                        isActive
                          ? "font-semibold text-zinc-900"
                          : isDone
                          ? "text-zinc-400 line-through"
                          : "text-zinc-400"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Locked nav */}
          <div className="border-t border-zinc-100 pt-4">
            <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest mb-2">
              Disponible al activarte
            </p>
            <div className="space-y-0.5">
              {LOCKED_NAV.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-2.5 px-2 py-1.5 rounded-md select-none"
                >
                  <item.icon className="w-4 h-4 text-zinc-300 flex-shrink-0" />
                  <span className="text-xs text-zinc-300 flex-1">{item.label}</span>
                  <Lock className="w-3 h-3 text-zinc-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Help */}
          <div className="mt-auto">
            <button className="w-full flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-600 transition-colors py-1">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              ¿Necesitas ayuda?
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main content ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Thin progress bar */}
        <div className="h-1 bg-zinc-100 flex-shrink-0">
          <div
            className="h-full bg-[#ff7b00] transition-all duration-500 ease-out"
            style={{ width: `${((moment - 1) / 4) * 100}%` }}
          />
        </div>

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-8 py-10">
            {moment === 1 && (
              <Moment1RouteSelection route={route} onSelect={setRoute} />
            )}
            {moment === 2 && (
              <Moment2Profile profile={profile} onChange={setProfile} />
            )}
            {moment === 3 && (
              <Moment3Bodega bodega={bodega} onChange={setBodega} route={route!} />
            )}
            {moment === 4 && route === "principiante" && (
              <Moment4Principiante
                done={wizardDone}
                onDone={() => setWizardDone(true)}
              />
            )}
            {moment === 4 && route !== "principiante" && (
              <Moment4Fast
                producto={producto}
                onChange={setProducto}
                route={route!}
              />
            )}
            {moment === 5 && (
              <Moment5Success
                route={selectedRoute!}
                profile={profile}
                bodega={bodega}
                producto={
                  route === "principiante"
                    ? { nombre: "Primer producto (wizard)", stock: "—" }
                    : producto
                }
                onGo={() => router.push("/dashboard")}
              />
            )}
          </div>
        </div>

        {/* Footer nav */}
        {moment < 5 && (
          <div className="border-t border-zinc-200 bg-white px-8 py-4 flex items-center justify-between flex-shrink-0">
            <button
              onClick={() => moment > 1 && setMoment((moment - 1) as Moment)}
              className={`text-sm text-zinc-400 hover:text-zinc-700 transition-colors ${
                moment === 1 ? "invisible" : ""
              }`}
            >
              ← Volver
            </button>

            <div className="flex items-center gap-3">
              {!canAdvance() && moment !== 1 && (
                <span className="text-xs text-zinc-400">
                  {moment === 4 && route === "principiante"
                    ? "Completa el wizard para continuar"
                    : "Completa los campos requeridos"}
                </span>
              )}
              <button
                onClick={() => canAdvance() && advanceTo((moment + 1) as Moment)}
                disabled={!canAdvance()}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  canAdvance()
                    ? "bg-[#ff7b00] hover:bg-[#e06c00] text-white shadow-sm active:scale-95"
                    : "bg-zinc-100 text-zinc-300 cursor-not-allowed"
                }`}
              >
                {moment === 4 ? "Ver resumen" : "Continuar"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Momento 1 — Selección de ruta ────────────────────────────────────────

function Moment1RouteSelection({
  route,
  onSelect,
}: {
  route: Route | null;
  onSelect: (r: Route) => void;
}) {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <p className="text-sm font-semibold text-[#ff7b00] mb-2">Bienvenido a Dropi</p>
        <h1 className="text-2xl font-bold text-zinc-900 mb-3">¿Cómo describes tu situación?</h1>
        <p className="text-zinc-500 text-sm leading-relaxed">
          Elige el perfil que mejor te represente. Esto nos permite guiarte de la
          forma más adecuada durante tu activación.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {ROUTES_CONFIG.map((r) => {
          const Icon = r.icon;
          const selected = route === r.id;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className={`relative text-left rounded-2xl border-2 p-5 transition-all duration-200 group ${
                selected ? "shadow-md" : "border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm"
              }`}
              style={selected ? { borderColor: r.color, background: r.bg } : {}}
            >
              {r.badge && (
                <span
                  className="absolute top-4 right-4 text-[10px] font-bold px-2.5 py-1 rounded-full"
                  style={{ background: r.color + "20", color: r.color }}
                >
                  ★ {r.badge}
                </span>
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200"
                  style={
                    selected
                      ? { background: r.color, color: "white" }
                      : { background: r.bg, color: r.color }
                  }
                >
                  <Icon className="w-5 h-5" />
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0 pr-8">
                  <p className="font-bold text-zinc-900 mb-0.5">{r.label}</p>
                  <p className="text-sm text-zinc-500 mb-3">{r.tagline}</p>
                  <p className="text-xs text-zinc-400 mb-3">{r.desc}</p>
                  <ul className="flex flex-wrap gap-x-4 gap-y-1">
                    {r.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ background: r.color }}
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Radio indicator */}
                <div
                  className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 transition-all duration-200"
                  style={
                    selected
                      ? { borderColor: r.color, background: r.color }
                      : { borderColor: "#d4d4d8" }
                  }
                >
                  {selected && <Check className="w-3 h-3 text-white" />}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Momento 2 — Perfil del negocio ────────────────────────────────────────

function Moment2Profile({
  profile,
  onChange,
}: {
  profile: ProfileAnswers;
  onChange: (p: ProfileAnswers) => void;
}) {
  const set = <K extends keyof ProfileAnswers>(key: K, value: ProfileAnswers[K]) =>
    onChange({ ...profile, [key]: value });

  return (
    <div className="animate-in fade-in duration-300 space-y-8">
      <div>
        <p className="text-sm font-semibold text-[#ff7b00] mb-2">Paso 2 de 5</p>
        <h1 className="text-2xl font-bold text-zinc-900 mb-3">Cuéntanos sobre tu negocio</h1>
        <p className="text-zinc-500 text-sm">Solo toma 30 segundos. Personalizamos todo para ti.</p>
      </div>

      {/* Q1 — volume */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-zinc-700">
          ¿Cuántos productos tienes para vender?
        </label>
        <div className="flex flex-wrap gap-2">
          {["1 a 5 productos", "6 a 20 productos", "Más de 20 productos"].map((v) => (
            <button
              key={v}
              onClick={() => set("productVolume", v)}
              className={`px-4 py-2 rounded-full text-sm border-2 font-medium transition-all ${
                profile.productVolume === v
                  ? "border-[#ff7b00] bg-[#fff7f0] text-[#ff7b00]"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300 bg-white"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Q2 — category */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-zinc-700">
          ¿Cuál es tu categoría principal?
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const selected = profile.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => set("category", cat.id)}
                className={`flex flex-col items-center gap-2 py-4 px-2 rounded-xl border-2 transition-all ${
                  selected
                    ? "border-[#ff7b00] bg-[#fff7f0] text-[#ff7b00]"
                    : "border-zinc-200 text-zinc-400 hover:border-zinc-300 bg-white hover:text-zinc-600"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Q3 — sells online */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-zinc-700">
          ¿Ya vendes en alguna plataforma online?
        </label>
        <div className="grid grid-cols-2 gap-3">
          {[
            {
              val: true,
              label: "Sí, ya vendo online",
              sub: "Ej: Mercado Libre, Shopify, TiendaNube",
            },
            {
              val: false,
              label: "No, es mi primera vez",
              sub: "¡Bienvenido! Te acompañamos en todo",
            },
          ].map((opt) => (
            <button
              key={String(opt.val)}
              onClick={() => set("sellsOnline", opt.val)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                profile.sellsOnline === opt.val
                  ? "border-[#ff7b00] bg-[#fff7f0]"
                  : "border-zinc-200 bg-white hover:border-zinc-300"
              }`}
            >
              <p
                className={`text-sm font-semibold mb-1 ${
                  profile.sellsOnline === opt.val ? "text-[#ff7b00]" : "text-zinc-700"
                }`}
              >
                {opt.label}
              </p>
              <p className="text-xs text-zinc-400 leading-relaxed">{opt.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Q4 — city (optional) */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-zinc-700">
          ¿Desde qué ciudad despachas?{" "}
          <span className="text-zinc-400 font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          placeholder="Ej: Bogotá, Medellín, Cali…"
          value={profile.city}
          onChange={(e) => set("city", e.target.value)}
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#ff7b00] focus:ring-2 focus:ring-[#ff7b00]/10 transition-all"
        />
      </div>
    </div>
  );
}

// ─── Momento 3 — Bodega ────────────────────────────────────────────────────

function Moment3Bodega({
  bodega,
  onChange,
  route,
}: {
  bodega: BodegaData;
  onChange: (b: BodegaData) => void;
  route: Route;
}) {
  const set = <K extends keyof BodegaData>(key: K, value: string) =>
    onChange({ ...bodega, [key]: value });

  const isPrincipiante = route === "principiante";

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#ff7b00] mb-2">Paso 3 de 5</p>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Crea tu bodega de despacho</h1>
        <p className="text-zinc-500 text-sm">
          Es el punto desde donde la transportadora recogerá tus pedidos.
        </p>
      </div>

      {isPrincipiante && (
        <div className="flex items-start gap-3 rounded-xl p-4 border"
          style={{ background: "#fff7f0", borderColor: "#ffb366" }}>
          <div className="w-8 h-8 rounded-full bg-[#ff7b00] flex items-center justify-center flex-shrink-0 text-sm select-none">
            💡
          </div>
          <div>
            <p className="text-sm font-semibold mb-0.5" style={{ color: "#c25a00" }}>
              Sin presión — son solo unos datos básicos
            </p>
            <p className="text-xs leading-relaxed" style={{ color: "#994700" }}>
              Solo necesitas la dirección donde la transportadora puede recogerte.
              Si algo no sabes, puedes editarlo después.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">
              Nombre de la bodega
              {isPrincipiante && (
                <span className="ml-2 text-xs font-normal text-zinc-400">
                  — algo fácil de recordar
                </span>
              )}
            </label>
            <input
              value={bodega.nombre}
              onChange={(e) => set("nombre", e.target.value)}
              placeholder={isPrincipiante ? "Ej: Mi casa, Oficina central" : "Nombre"}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#ff7b00] focus:ring-2 focus:ring-[#ff7b00]/10 transition-all"
            />
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Teléfono de contacto</label>
            <input
              value={bodega.telefono}
              onChange={(e) => set("telefono", e.target.value)}
              placeholder="3XXXXXXXXX"
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#ff7b00] focus:ring-2 focus:ring-[#ff7b00]/10 transition-all"
            />
          </div>

          {/* Departamento */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Departamento</label>
            <select
              value={bodega.departamento}
              onChange={(e) => set("departamento", e.target.value)}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm bg-white focus:outline-none focus:border-[#ff7b00] focus:ring-2 focus:ring-[#ff7b00]/10 transition-all"
            >
              <option value="">Selecciona</option>
              {[
                "ANTIOQUIA", "BOGOTÁ D.C.", "CUNDINAMARCA", "VALLE DEL CAUCA",
                "ATLÁNTICO", "BOLÍVAR", "SANTANDER", "NARIÑO", "RISARALDA",
                "CÓRDOBA", "TOLIMA", "CAUCA",
              ].map((d) => (
                <option key={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Ciudad */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-zinc-700">Ciudad</label>
            <input
              value={bodega.ciudad}
              onChange={(e) => set("ciudad", e.target.value)}
              placeholder="Ciudad"
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#ff7b00] focus:ring-2 focus:ring-[#ff7b00]/10 transition-all"
            />
          </div>

          {/* Dirección */}
          <div className="space-y-1.5 md:col-span-2">
            <label className="text-sm font-semibold text-zinc-700">
              Dirección exacta
              {isPrincipiante && (
                <span className="ml-2 text-xs font-normal text-zinc-400">
                  — incluye barrio o referencia
                </span>
              )}
            </label>
            <textarea
              value={bodega.direccion}
              onChange={(e) => set("direccion", e.target.value)}
              placeholder={
                isPrincipiante
                  ? "Ej: Kra 56 # 7-96, Casa C1, Barrio San Fernando"
                  : "Dirección"
              }
              rows={2}
              className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm resize-none focus:outline-none focus:border-[#ff7b00] focus:ring-2 focus:ring-[#ff7b00]/10 transition-all"
            />
          </div>
        </div>

        {/* Formato de guía */}
        <div className="border-t border-zinc-100 pt-5">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-bold text-zinc-700">Formato de guía</h3>
            <span className="text-xs bg-zinc-100 text-zinc-400 px-2 py-0.5 rounded-full">
              {isPrincipiante ? "Puedes dejarlo en blanco" : "Opcional"}
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["VELOCES", "ENVIA", "INTERRAPIDISIMO", "DOMINA", "COORDINADORA", "TCC"].map((c) => (
              <div key={c} className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">
                  {c}
                </label>
                <select className="w-full px-2 py-1.5 border border-zinc-200 rounded-lg text-xs bg-white focus:outline-none focus:border-[#ff7b00] appearance-none transition-all">
                  <option value="">Formato</option>
                  <option value="CARTA">CARTA</option>
                  <option value="STICKER">STICKER 10×15</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Momento 4 — Principiante (usa wizard existente) ───────────────────────

function Moment4Principiante({
  done,
  onDone,
}: {
  done: boolean;
  onDone: () => void;
}) {
  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#ff7b00] mb-2">Paso 4 de 5</p>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Agrega tu primer producto</h1>
        <p className="text-zinc-500 text-sm">
          Completa los 4 pasos del asistente. Te guiamos campo a campo.
        </p>
      </div>

      {done ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 flex flex-col items-center text-center gap-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          <p className="font-bold text-emerald-700 text-lg">¡Producto creado con éxito!</p>
          <p className="text-sm text-emerald-600">
            Ya puedes continuar al resumen final.
          </p>
        </div>
      ) : (
        /* Embed ProductCreateWizard — interceptSave marks this moment done */
        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
          <ProductCreateWizard interceptSave={onDone} />
        </div>
      )}
    </div>
  );
}

// ─── Momento 4 — Consolidación / Escalabilidad ─────────────────────────────

function Moment4Fast({
  producto,
  onChange,
  route,
}: {
  producto: ProductoData;
  onChange: (p: ProductoData) => void;
  route: Route;
}) {
  const set = <K extends keyof ProductoData>(key: K, value: string) =>
    onChange({ ...producto, [key]: value });

  const isEscalabilidad = route === "escalabilidad";

  return (
    <div className="animate-in fade-in duration-300 space-y-6">
      <div>
        <p className="text-sm font-semibold text-[#ff7b00] mb-2">Paso 4 de 5</p>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">Agrega tu primer producto</h1>
        <p className="text-zinc-500 text-sm">
          {isEscalabilidad
            ? "Carga uno de forma manual o importa todo tu catálogo en bulk."
            : "Completa los datos básicos. Puedes editar el detalle desde Productos."}
        </p>
      </div>

      {isEscalabilidad && (
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 text-sm font-semibold transition-all"
            style={{ borderColor: "#8b5cf6", color: "#8b5cf6", background: "#f5f3ff" }}>
            <Package className="w-4 h-4" />
            Cargar manual
          </button>
          <button className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-zinc-200 text-zinc-500 text-sm font-semibold hover:border-zinc-300 transition-all bg-white">
            <FileSpreadsheet className="w-4 h-4" />
            Importar CSV
          </button>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 space-y-5">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700">
            Nombre del producto <span className="text-red-400">*</span>
          </label>
          <input
            value={producto.nombre}
            onChange={(e) => set("nombre", e.target.value)}
            placeholder="Ej: Cable USB-C trenzado 2 metros"
            className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#ff7b00] focus:ring-2 focus:ring-[#ff7b00]/10 transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700">
            Stock disponible <span className="text-red-400">*</span>
          </label>
          <input
            type="number"
            value={producto.stock}
            onChange={(e) => set("stock", e.target.value)}
            placeholder="Ej: 100"
            min={0}
            className="w-full px-3 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:border-[#ff7b00] focus:ring-2 focus:ring-[#ff7b00]/10 transition-all"
          />
        </div>

        {/* Image upload area */}
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-zinc-700">Imagen principal</label>
          <div className="border-2 border-dashed border-zinc-200 rounded-xl p-8 flex flex-col items-center gap-2 cursor-pointer hover:border-[#ff7b00] hover:bg-[#fff7f0] transition-all group">
            <div className="w-10 h-10 rounded-xl bg-zinc-100 group-hover:bg-[#ffb36630] flex items-center justify-center transition-all">
              <Package className="w-5 h-5 text-zinc-300 group-hover:text-[#ff7b00] transition-colors" />
            </div>
            <p className="text-sm text-zinc-400 group-hover:text-[#ff7b00] transition-colors font-medium">
              Arrastra o haz clic para subir
            </p>
            <p className="text-xs text-zinc-300">PNG, JPG — máximo 5 MB</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Momento 5 — Celebración ───────────────────────────────────────────────

function Moment5Success({
  route,
  profile,
  bodega,
  producto,
  onGo,
}: {
  route: (typeof ROUTES_CONFIG)[number];
  profile: ProfileAnswers;
  bodega: BodegaData;
  producto: ProductoData;
  onGo: () => void;
}) {
  const RouteIcon = route.icon;
  const categoryLabel = CATEGORIES.find((c) => c.id === profile.category)?.label ?? "—";

  const summaryItems = [
    { label: "Ruta elegida", value: route.label, Icon: RouteIcon },
    { label: "Categoría", value: categoryLabel, Icon: Sparkles },
    { label: "Bodega", value: bodega.nombre || "—", Icon: Truck },
    { label: "Primer producto", value: producto.nombre || "—", Icon: Package },
  ];

  return (
    <div className="animate-in fade-in duration-500 flex flex-col items-center text-center gap-8 py-4">
      {/* Animated success icon */}
      <div className="relative flex items-center justify-center">
        <div
          className="absolute w-24 h-24 rounded-full animate-ping opacity-10"
          style={{ background: "#ff7b00" }}
        />
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{ background: "#fff7f0" }}
        >
          <CheckCircle2 className="w-10 h-10" style={{ color: "#ff7b00" }} />
        </div>
      </div>

      {/* Headline */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-zinc-900">¡Todo listo para revisión!</h1>
        <p className="text-zinc-500 text-sm max-w-sm leading-relaxed">
          Tu cuenta fue enviada. En menos de 24 horas te confirmamos por correo
          y podrás empezar a vender con Dropi.
        </p>
      </div>

      {/* Summary card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-zinc-200 shadow-sm p-5 text-left space-y-4">
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
          Resumen de tu activación
        </p>
        <div className="space-y-3">
          {summaryItems.map(({ label, value, Icon }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg border border-zinc-100 bg-zinc-50 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] text-zinc-400 uppercase tracking-wide font-semibold">
                  {label}
                </p>
                <p className="text-sm font-semibold text-zinc-700 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col items-center gap-3">
        <button
          onClick={onGo}
          className="flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-bold text-white shadow-md transition-all active:scale-95"
          style={{ background: "#ff7b00" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#e06c00")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ff7b00")}
        >
          Ir al dashboard
          <ArrowRight className="w-4 h-4" />
        </button>
        <p className="text-xs text-zinc-400">
          Tu cuenta estará activa una vez que el equipo de Dropi la verifique.
        </p>
      </div>
    </div>
  );
}
