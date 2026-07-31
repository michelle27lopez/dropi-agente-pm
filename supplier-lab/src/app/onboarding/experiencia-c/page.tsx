"use client";

import { useState, useRef, useEffect } from "react";
import {
  Home, Target, HelpCircle, Lock, Check, Bot, Package,
  Truck, ShoppingCart, Wallet, BarChart2, Settings, Box,
  GraduationCap, X, Save, Share, Info,
  CheckCircle2, ArrowLeft, Clock, PlayCircle, Send, ChevronDown,
} from "lucide-react";
import { Topbar } from "@/components/layout/Topbar";
import { ProductCreateWizard } from "@/components/ProductCreateWizard";
import { trackEvent } from "@/lib/analytics";

// ── Types ──────────────────────────────────────────────────────────────────

type View = "pipeline" | "bodega" | "producto";
type ActiveModal = "welcome" | "blocked" | "verify" | "complete" | "tutorial" | null;

// ── Real milestones from ChecklistPopup ────────────────────────────────────

const STEPS = [
  {
    id: 1,
    title: "Crea tu primera bodega",
    desc: "Agrega el punto de recolección y elige el formato de guía por transportadora.",
    time: "~5 min",
    cta: "Crear bodega",
    view: "bodega" as View,
    isActivationGate: true,
  },
  {
    id: 2,
    title: "Sube tus primeros productos",
    desc: "Carga tu inventario con fotos y descripciones claras para atraer más dropshippers.",
    time: "~10 min",
    cta: "Subir producto",
    view: "producto" as View,
    isActivationGate: true,
  },
  {
    id: 3,
    title: "Gestiona tus órdenes y guías",
    desc: "Recibe pedidos, revisa cada orden y despacha rápido para vender sin fricciones.",
    time: null,
    cta: "Ver órdenes",
    view: null,
    isActivationGate: false,
  },
  {
    id: 4,
    title: "Gestiona tus despachos y recogida",
    desc: "Conoce cómo coordinar despachos y recogidas de tus órdenes.",
    time: null,
    cta: "Ver logística",
    view: null,
    isActivationGate: false,
  },
  {
    id: 5,
    title: "Recibe tus ganancias",
    desc: "Recibe pagos seguros en tu Wallet y controla tus ganancias desde un solo lugar.",
    time: null,
    cta: "Ver Wallet",
    view: null,
    isActivationGate: false,
  },
  {
    id: 6,
    title: "Regístrate en Dropi Academy",
    desc: "Aprende a usar la plataforma y maximizar tus ventas con nuestros cursos.",
    time: null,
    cta: "Ir a Academy",
    view: null,
    isActivationGate: false,
  },
];

// Active sidebar items during activation
const ACTIVE_NAV = [
  { label: "Inicio", icon: Home },
  { label: "Mi Activación", icon: Target, current: true },
  { label: "Ayuda", icon: HelpCircle },
];

// Locked sidebar items (real items from Sidebar.tsx)
const LOCKED_NAV = [
  { label: "Productos", icon: Package },
  { label: "Órdenes", icon: ShoppingCart },
  { label: "Mis Garantías", icon: CheckCircle2 },
  { label: "Logistic", icon: Truck },
  { label: "Mis Integraciones", icon: Box },
  { label: "Mi Wallet", icon: Wallet },
  { label: "Reportes", icon: BarChart2 },
  { label: "Configuraciones", icon: Settings },
  { label: "Academy", icon: GraduationCap, badge: "Nuevo" },
];

// ── Modal wrapper ──────────────────────────────────────────────────────────

function Modal({
  children,
  onClose,
  wide = false,
}: {
  children: React.ReactNode;
  onClose?: () => void;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className={`bg-white rounded-xl shadow-2xl w-full mx-4 overflow-hidden animate-in zoom-in-95 duration-200 relative ${wide ? "max-w-lg" : "max-w-md"}`}
      >
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-600 z-10"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}

// ── DropiBot ───────────────────────────────────────────────────────────────

type BotMsg = {
  id: string;
  role: "bot" | "user";
  text: string;
  quickReplies?: string[];
};

type BotIntent = "bodega" | "producto" | "ordenes" | "wallet" | "tutorial" | "ayuda" | "unknown";

function detectIntent(text: string): BotIntent {
  const t = text.toLowerCase();
  if (/bodega|despacho|recolec|direc|almac/.test(t)) return "bodega";
  if (/producto|inventar|subir|cat[aá]l|artíc|carg/.test(t)) return "producto";
  if (/orden|pedido|gu[ií]a|env[ií]o/.test(t)) return "ordenes";
  if (/wallet|pago|cobro|dinero|ganancia/.test(t)) return "wallet";
  if (/tutorial|video|aprend/.test(t)) return "tutorial";
  if (/ayuda|hola|qu[eé]|hi|c[oó]mo|empez/.test(t)) return "ayuda";
  return "unknown";
}

const INITIAL_BOT_MESSAGES: BotMsg[] = [
  {
    id: "init",
    role: "bot",
    text: "¡Hola! Soy Dropibot 🤖 Estoy aquí para ayudarte a activarte como proveedor. Puedo crear tu bodega, subir tu primer producto o resolver cualquier duda. ¿Por dónde empezamos?",
    quickReplies: ["Crear mi bodega", "Subir un producto", "¿Cómo funciona Dropi?"],
  },
];

function DropiBot({
  completed,
  onNavigate,
  onOpenModal,
  hidden,
}: {
  completed: Set<number>;
  onNavigate: (view: View) => void;
  onOpenModal: (modal: ActiveModal) => void;
  hidden: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<BotMsg[]>(INITIAL_BOT_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(1);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  if (hidden) return null;

  const pushBot = (msg: Omit<BotMsg, "id" | "role">) =>
    setMessages((prev) => [...prev, { ...msg, id: String(Date.now()), role: "bot" }]);

  const handleIntent = (text: string) => {
    const intent = detectIntent(text);

    const bodegaDone = completed.has(1);
    const productoDone = completed.has(2);

    const map: Record<BotIntent, { text: string; quickReplies?: string[]; action?: () => void }> = {
      bodega: {
        text: bodegaDone
          ? "Tu bodega ya está creada ✅ ¿Quieres subir tu primer producto ahora?"
          : "¡Vamos! Te llevo al formulario de bodega 🏭 Rellena la dirección de tu punto de despacho y en menos de 5 minutos quedas listo.",
        quickReplies: bodegaDone
          ? ["Subir producto", "¿Puedo crear otra bodega?"]
          : ["Ir al formulario ahora", "¿Qué necesito para crearla?"],
        action: bodegaDone ? undefined : () => onNavigate("bodega"),
      },
      producto: {
        text: !bodegaDone
          ? "Para subir productos primero debes crear una bodega 🏭 ¿Te llevo ahí?"
          : productoDone
          ? "Ya tienes tu primer producto cargado ✅ ¿Necesitas agregar otro o tienes alguna otra duda?"
          : "¡Perfecto! Vamos a subir tu primer producto 📦 Necesitarás nombre, peso, medidas y al menos una foto.",
        quickReplies: !bodegaDone
          ? ["Crear bodega primero", "¿Por qué necesito bodega?"]
          : productoDone
          ? ["Ver mi progreso", "Agregar otro producto"]
          : ["Ir a subir producto", "¿Qué fotos necesito?"],
        action: !bodegaDone ? () => onNavigate("bodega") : productoDone ? undefined : () => onNavigate("producto"),
      },
      ordenes: {
        text:
          bodegaDone && productoDone
            ? "¡Ya estás activo! 🎉 Gestiona tus órdenes desde el panel lateral una vez estés en el dashboard principal."
            : "Las órdenes se habilitan al completar tu activación (bodega + primer producto) 🔒",
        quickReplies: ["Completar activación", "¿Cómo funciona el despacho?"],
      },
      wallet: {
        text: "Tu Wallet es donde recibirás los pagos de tus ventas 💰 Se activa automáticamente al completar el proceso de activación.",
        quickReplies: ["¿Cuándo me pagan?", "Completar activación"],
      },
      tutorial: {
        text: "¡Claro! Tengo tutoriales en video para cada paso del proceso. ¿Los abro ahora?",
        quickReplies: ["Ver tutoriales", "Crear bodega", "Subir producto"],
        action: () => onOpenModal("tutorial"),
      },
      ayuda: {
        text: "Con mucho gusto 😊 Cuéntame qué quieres hacer: puedo llevar tu bodega, cargar tu primer producto o explicarte cualquier cosa sobre Dropi.",
        quickReplies: ["Crear mi bodega", "Subir un producto", "Ver tutoriales"],
      },
      unknown: {
        text: "Hmm, no estoy 100% seguro de entenderte 😅 ¿Me cuentas con más detalle qué necesitas? Puedo ayudarte con bodegas, productos, órdenes o pagos.",
        quickReplies: ["Crear bodega", "Subir producto", "Hablar con soporte"],
      },
    };

    const response = map[intent];
    setTyping(true);
    setTimeout(() => {
      setTyping(false);
      pushBot({ text: response.text, quickReplies: response.quickReplies });
      if (response.action) {
        setTimeout(() => {
          response.action!();
          setOpen(false);
        }, 700);
      }
    }, 900);
  };

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    trackEvent("dropibot_message_sent");
    setMessages((prev) => [...prev, { id: String(Date.now()), role: "user", text }]);
    setInput("");
    handleIntent(text);
  };

  const handleOpen = () => {
    setOpen(true);
    setUnread(0);
    setTimeout(() => inputRef.current?.focus(), 200);
  };

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div
          className="fixed bottom-6 right-6 z-[200] w-[360px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-zinc-200 animate-in slide-in-from-bottom-4 fade-in duration-300"
          style={{ height: "520px" }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #f08c3e 0%, #e67e22 100%)" }}
          >
            <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-white text-sm">Dropibot</p>
              <p className="text-white/70 text-[11px]">Asistente de activación · siempre disponible</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors">
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-[#f7f8fa] px-4 py-3 space-y-3 scrollbar-thin">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex flex-col gap-1.5 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                {msg.role === "bot" && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-[#f08c3e]" />
                    </div>
                    <div className="bg-white border border-zinc-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5 max-w-[260px] shadow-sm">
                      <p className="text-sm text-zinc-700 leading-relaxed">{msg.text}</p>
                    </div>
                  </div>
                )}
                {msg.role === "user" && (
                  <div className="bg-[#f08c3e] rounded-2xl rounded-br-sm px-3.5 py-2.5 max-w-[240px]">
                    <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                  </div>
                )}
                {msg.role === "bot" && msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 ml-9 mt-0.5">
                    {msg.quickReplies.map((qr) => (
                      <button
                        key={qr}
                        onClick={() => sendMessage(qr)}
                        className="text-xs font-medium text-[#f08c3e] border border-orange-200 hover:bg-orange-50 px-2.5 py-1 rounded-full transition-colors"
                      >
                        {qr}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {typing && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-[#f08c3e]" />
                </div>
                <div className="bg-white border border-zinc-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-zinc-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-zinc-100 flex gap-2 flex-shrink-0">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }}
              placeholder="Escríbeme lo que necesitas..."
              className="flex-1 text-sm px-3.5 py-2.5 rounded-xl border border-zinc-200 focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-300 bg-[#f7f8fa]"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-[#f08c3e] hover:bg-[#e67e22] disabled:bg-zinc-200 text-white flex items-center justify-center transition-colors flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* FAB */}
      {!open && (
        <div className="fixed bottom-3 right-4 z-[200]">
          <button
            onClick={handleOpen}
            className="flex items-center gap-2 bg-white hover:bg-orange-50 border border-zinc-200 hover:border-orange-300 text-zinc-600 hover:text-[#f08c3e] px-3 py-2 rounded-full shadow-md hover:shadow-lg transition-all text-sm font-medium"
          >
            <Bot className="w-4 h-4 text-[#f08c3e]" />
            Asistente
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 text-white text-[9px] font-black flex items-center justify-center">
                {unread}
              </span>
            )}
          </button>
        </div>
      )}
    </>
  );
}

// ── Inline BodegaForm ──────────────────────────────────────────────────────

const CARRIERS = ["VELOCES", "ENVIA", "INTERRAPIDISIMO", "DOMINA", "COORDINADORA", "99MINUTOS", "TCC"];

function BodegaFormInline({ onSave, onBack }: { onSave: () => void; onBack: () => void }) {
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = () => {
    trackEvent("bodega_created");
    setShowSuccess(true);
  };

  return (
    <div className="flex flex-col gap-6 pb-24 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 text-sm font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a la ruta
        </button>
      </div>

      <h1 className="text-2xl font-bold text-zinc-800">Crear primera bodega</h1>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-sm relative">
        {/* Modal de éxito */}
        {showSuccess && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center bg-zinc-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <Bot className="w-10 h-10 text-[#f08c3e]" />
              </div>
              <h3 className="text-xl font-bold text-zinc-800 mb-2">¡Bodega creada!</h3>
              <p className="text-zinc-500 text-sm mb-6">
                Tu punto de despacho ha sido configurado. Ahora puedes subir tus primeros productos.
              </p>
              <button
                onClick={() => {
                  setShowSuccess(false);
                  onSave();
                }}
                className="w-full bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3 rounded-lg transition-colors"
              >
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Encabezado del formulario */}
        <div className="p-6 border-b border-zinc-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-zinc-800">Datos de la Bodega</h2>
          <div className="flex items-center gap-4">
            <button className="text-zinc-500 hover:text-zinc-700">
              <Share className="w-5 h-5" />
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-400 hover:bg-emerald-500 text-white rounded-md text-sm font-medium shadow-sm transition-colors"
            >
              <Save className="w-4 h-4" />
              Guardar
            </button>
          </div>
        </div>

        <div className="p-6 space-y-8">

          {/* Info general de la sección */}
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-3.5 flex gap-3 text-sky-800">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold mb-0.5">¿Qué es una bodega en Dropi?</p>
              <p className="text-sky-700 text-xs leading-relaxed">
                Es el punto físico desde donde despachas tus productos cuando llega un pedido. Puede ser tu local,
                oficina, casa o depósito. Los mensajeros de las transportadoras irán a esta dirección a recoger los paquetes.
              </p>
            </div>
          </div>

          {/* Datos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Nombre de la bodega</label>
              <p className="text-xs text-zinc-500">
                Ponle un nombre que te ayude a identificarla fácilmente. Si tienes varias, usa nombres como "Bodega Cali Centro" o "Depósito Principal".
              </p>
              <input
                type="text"
                placeholder="Ej: Bodega principal Cali"
                className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Teléfono de contacto</label>
              <p className="text-xs text-zinc-500">
                Número al que llamarán los mensajeros para coordinar la recolección. Puede ser celular o fijo. Asegúrate de que siempre haya alguien disponible.
              </p>
              <input
                type="text"
                placeholder="Ej: 322 440 0784"
                className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Departamento</label>
              <p className="text-xs text-zinc-500">
                El departamento donde está tu bodega. Afecta las transportadoras disponibles y los tiempos de entrega a destinos cercanos.
              </p>
              <select className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 text-sm bg-white text-zinc-500">
                <option>Departamento</option>
                <option>VALLE</option>
                <option>CUNDINAMARCA</option>
                <option>ANTIOQUIA</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-zinc-700">Ciudad</label>
              <p className="text-xs text-zinc-500">
                La ciudad exacta de tu punto de despacho. Dropi la usa para calcular costos de envío y asignarte las transportadoras activas en esa zona.
              </p>
              <select className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 text-sm bg-white text-zinc-500">
                <option>Ciudad</option>
                <option>CALI</option>
                <option>BOGOTÁ</option>
                <option>MEDELLÍN</option>
              </select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-semibold text-zinc-700">Dirección completa</label>
              <p className="text-xs text-zinc-500">
                Escribe la dirección exacta donde los mensajeros deben llegar a recoger los pedidos. Incluye número de casa, apartamento, piso o referencia adicional si es necesario.
              </p>
              <textarea
                placeholder="Ej: Cra 56 #7 oeste-96, Casa C1, barrio El Ingenio"
                rows={2}
                className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 text-sm resize-none"
              />
            </div>
          </div>

          <hr className="border-zinc-100" />

          {/* Guide Format */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-800 mb-1">Guide Format por transportadora</h3>
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3.5 flex gap-3 text-amber-800">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-semibold mb-0.5">¿Qué es el Guide Format?</p>
                  <p className="text-amber-700 text-xs leading-relaxed">
                    Es el formato de impresión de la guía de envío que usa cada transportadora al recoger el paquete.
                    <br />
                    <strong>CARTA:</strong> guía impresa en hoja tamaño oficio estándar — ideal si tienes impresora de papel regular.
                    <br />
                    <strong>STICKER 10×15:</strong> etiqueta adhesiva pequeña — requiere impresora de etiquetas térmica.
                    Si no sabes cuál usar, elige CARTA.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {CARRIERS.map((carrier) => (
                <div key={carrier} className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-500 tracking-wide">{carrier}</label>
                  <select className="w-full px-3 py-2 border border-zinc-200 rounded-md focus:outline-none focus:border-orange-400 text-sm bg-white text-zinc-500">
                    <option value="">Guide format</option>
                    <option value="CARTA">CARTA</option>
                    <option value="STICKER">STICKER 10x15</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ExperienciaCPage() {
  const [view, setView] = useState<View>("pipeline");
  const [modal, setModal] = useState<ActiveModal>("welcome");
  const [completed, setCompleted] = useState<Set<number>>(new Set());

  const gatesDone = completed.has(1) && completed.has(2);
  const completedCount = completed.size;
  const progressPct = Math.round((completedCount / STEPS.length) * 100);

  const markDone = (id: number) => {
    setCompleted((prev) => new Set([...prev, id]));
  };

  const handleStepCta = (step: (typeof STEPS)[number]) => {
    if (step.isActivationGate) {
      if (step.view) setView(step.view);
    } else {
      // Post-activation steps: only accessible once gates are done
      if (!gatesDone) {
        setModal("blocked");
      }
    }
  };

  // ProductCreateWizard interceptSave → show the verify modal
  const handleProductInterceptSave = () => {
    setModal("verify");
  };

  const handleVerifyConfirm = () => {
    trackEvent("product_saved", { variant: "wizard" });
    trackEvent("survey_started");
    window.open("https://link.dropi.co/widget/survey/RHwFslXWbg01teWQk04b", "_blank");
    markDone(2);
    setView("pipeline");
    setModal("complete");
  };

  const isStepLocked = (step: (typeof STEPS)[number]) => {
    if (step.id === 1) return false;
    if (step.id === 2) return !completed.has(1);
    // Steps 3-6 locked until both activation gates done
    return !gatesDone;
  };

  const isStepDone = (id: number) => completed.has(id);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f7f8fa] font-sans">
      {/* ── Sidebar ── */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-zinc-200 h-screen flex flex-col hidden md:flex sticky top-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-zinc-100 flex-shrink-0">
          <img
            src="https://d1l4mzebo786pw.cloudfront.net/image/input/white-labels/1/logos/secondary_logo/logo-naranja.png"
            alt="Dropi"
            className="h-8 object-contain"
          />
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-thin">
          {/* Active items */}
          {ACTIVE_NAV.map(({ label, icon: Icon, current }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors text-left ${
                current
                  ? "bg-orange-50 text-[#f08c3e] font-semibold"
                  : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
              }`}
            >
              <Icon
                className={`w-5 h-5 ${current ? "text-[#f08c3e]" : "text-zinc-400"}`}
              />
              <span className="flex-1">{label}</span>
            </button>
          ))}

          {/* Divider */}
          <div className="pt-2 pb-1 px-3">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
              Disponible al activarte
            </p>
          </div>

          {/* Locked items */}
          {LOCKED_NAV.map(({ label, badge }) => (
            <button
              key={label}
              onClick={() => setModal("blocked")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-zinc-300 hover:bg-zinc-50 transition-colors text-left"
            >
              <Lock className="w-5 h-5 text-zinc-200 flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {badge && (
                <span className="px-1.5 py-0.5 rounded-full bg-zinc-100 text-zinc-300 text-[10px] font-bold">
                  {badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Activation progress hint */}
        <div className="p-4 border-t border-zinc-100">
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">🤖</span>
              <p className="text-xs font-bold text-orange-600">Actívate como proveedor</p>
            </div>
            <div className="w-full bg-white rounded-full h-2 mb-1">
              <div
                className="h-2 bg-[#f08c3e] rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-[11px] text-orange-400">
              {completedCount} de {STEPS.length} pasos completados · {progressPct}%
            </p>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          {/* ── Vista: Bodega ── */}
          {view === "bodega" && (
            <BodegaFormInline
              onBack={() => setView("pipeline")}
              onSave={() => {
                markDone(1);
                setView("pipeline");
              }}
            />
          )}

          {/* ── Vista: Producto ── */}
          {view === "producto" && (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => setView("pipeline")}
                className="flex items-center gap-2 text-zinc-500 hover:text-zinc-800 text-sm font-medium w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver a la ruta
              </button>
              <ProductCreateWizard
                onBack={() => setView("pipeline")}
                onSaveSuccess={() => {
                  markDone(2);
                  setView("pipeline");
                }}
                interceptSave={handleProductInterceptSave}
              />
            </div>
          )}

          {/* ── Vista: Pipeline ── */}
          {view === "pipeline" && (
            <div className="max-w-5xl mx-auto space-y-6">

              {/* Banner naranja — mismo estilo que ChecklistPopup */}
              <div
                className="rounded-2xl p-7 text-white shadow-sm"
                style={{ background: "linear-gradient(135deg, #f08c3e 0%, #e67e22 100%)" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🤖</span>
                  <h1 className="text-2xl font-bold">Actívate como Proveedor</h1>
                </div>
                <p className="text-white/85 text-sm mb-5 max-w-xl">
                  Activa tu negocio y empieza a vender. Completa estos pasos para recibir tus primeras órdenes a través de los dropshippers de Dropi.
                </p>
                <button
                  onClick={() => { trackEvent("tutorial_panel_opened"); setModal("tutorial"); }}
                  className="flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all w-fit mb-5"
                >
                  <PlayCircle className="w-4 h-4" />
                  Ver tutoriales de activación
                </button>
                {/* Progress bar */}
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-white/30 rounded-full h-2.5">
                    <div
                      className="bg-white h-2.5 rounded-full transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-sm flex-shrink-0">
                    {completedCount} de {STEPS.length} · {progressPct}%
                  </span>
                </div>
              </div>

              {/* Step list — estilo de ChecklistPopup pero expandido */}
              <div className="bg-white rounded-xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="relative p-6 space-y-0">
                  {/* Vertical connecting line */}
                  <div className="absolute left-[42px] top-12 bottom-12 w-[2px] bg-emerald-600/20" />

                  {STEPS.map((step, idx) => {
                    const done = isStepDone(step.id);
                    const locked = isStepLocked(step);

                    return (
                      <div
                        key={step.id}
                        className={`flex gap-5 relative z-10 py-5 ${idx < STEPS.length - 1 ? "border-b border-zinc-50" : ""}`}
                      >
                        {/* Circle indicator */}
                        <div className="flex-shrink-0 relative bg-white">
                          {done ? (
                            <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-white mt-0.5">
                              <Check className="w-4 h-4 stroke-[2.5]" />
                            </div>
                          ) : locked ? (
                            <div className="w-7 h-7 rounded-full border-2 border-zinc-200 bg-white flex items-center justify-center mt-0.5">
                              <Lock className="w-3 h-3 text-zinc-300" />
                            </div>
                          ) : (
                            <div className="w-7 h-7 rounded-full border-2 border-emerald-600 bg-white flex items-center justify-center mt-0.5">
                              <div className="w-3 h-3 rounded-full bg-emerald-600" />
                            </div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex items-start justify-between gap-4 min-w-0">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4
                                className={`font-semibold text-sm ${
                                  done ? "text-zinc-500 line-through" : locked ? "text-zinc-400" : "text-zinc-800"
                                }`}
                              >
                                {step.title}
                              </h4>
                              {step.time && !done && !locked && (
                                <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-medium flex-shrink-0">
                                  <Clock className="w-3 h-3" />
                                  {step.time}
                                </span>
                              )}
                            </div>
                            <p
                              className={`text-sm leading-relaxed mt-0.5 pr-4 ${
                                locked ? "text-zinc-400" : "text-zinc-500"
                              }`}
                            >
                              {step.desc}
                            </p>
                          </div>

                          {/* CTA */}
                          <div className="flex-shrink-0">
                            {done ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full">
                                <Check className="w-3 h-3" />
                                Completado
                              </span>
                            ) : locked ? (
                              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-50 px-3 py-1.5 rounded-full border border-zinc-100">
                                <Lock className="w-3 h-3" />
                                Bloqueado
                              </span>
                            ) : (
                              <button
                                onClick={() => handleStepCta(step)}
                                className="px-4 py-2 bg-[#f08c3e] hover:bg-[#e67e22] text-white rounded-lg text-xs font-bold transition-colors shadow-sm whitespace-nowrap"
                              >
                                {step.cta} →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Botón flotante de tutoriales */}
              <div className="fixed left-6 bottom-6 z-40">
                <button
                  onClick={() => { trackEvent("tutorial_fab_clicked"); setModal("tutorial"); }}
                  className="flex items-center gap-2 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 font-semibold px-4 py-3 rounded-xl shadow-lg border border-zinc-200 transition-all hover:scale-105 text-sm"
                >
                  <PlayCircle className="w-4 h-4 text-[#f08c3e]" />
                  Ver tutoriales
                </button>
              </div>

              {/* Hint cuando la activación está completa */}
              {gatesDone && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-emerald-800 text-sm">
                      ¡Tu cuenta está activa! Ya puedes gestionar órdenes, pagos y reportes.
                    </p>
                    <p className="text-emerald-600 text-xs mt-0.5">
                      Completa los pasos restantes para aprovechar todo el potencial de Dropi.
                    </p>
                  </div>
                  <button
                    onClick={() => (window.location.href = "/")}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-bold transition-colors flex-shrink-0"
                  >
                    Ir al dashboard
                  </button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* ── MODALS ── */}

      {/* Bienvenida */}
      {modal === "welcome" && (
        <Modal>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-[#f08c3e] mb-5">
              <Bot className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-800 mb-2">¡Bienvenido a Dropi!</h2>
            <p className="text-zinc-600 text-[15px] mb-8 leading-relaxed max-w-sm">
              Lo mejor está por empezar 🧡. Antes de empezar a vender necesitamos activar tu cuenta como proveedor. Te guiaremos paso a paso.
            </p>
            <button
              onClick={() => {
                trackEvent("activation_welcome_accepted");
                setModal(null);
              }}
              className="w-full max-w-xs bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3.5 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Empezar activación
            </button>
          </div>
        </Modal>
      )}

      {/* Sección bloqueada */}
      {modal === "blocked" && (
        <Modal onClose={() => setModal(null)}>
          <div className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#f08c3e] mb-4 relative">
              <Bot className="w-8 h-8" />
              <div className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm">
                <Lock className="w-4 h-4 text-zinc-400" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-zinc-800 mb-2">Sección no disponible</h2>
            <p className="text-sm text-zinc-500 mb-6 leading-relaxed">
              Esta sección estará disponible cuando completes tu activación como proveedor.
            </p>
            <div className="flex gap-3 w-full">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border-2 border-orange-400 text-orange-500 hover:bg-orange-50 font-bold py-2.5 rounded-lg text-sm transition-colors"
              >
                Cerrar
              </button>
              <button
                onClick={() => setModal(null)}
                className="flex-1 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-2.5 rounded-lg text-sm transition-colors"
              >
                Continuar activación
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Verificar operación (antes de publicar primer producto) */}
      {modal === "verify" && (
        <Modal onClose={() => setModal(null)} wide>
          <div className="p-8">
            <h3 className="text-2xl font-bold text-zinc-800 mb-4">Verificar operación</h3>
            <p className="text-[15px] text-zinc-700 mb-5 leading-relaxed">
              Antes de publicar tu primer producto en el catálogo público, queremos conocerte y acompañarte para que tengas todo listo como proveedor Dropi.
              <br />
              <br />
              Por eso, realizaremos una verificación de tu operación donde te solicitaremos:
            </p>
            <ul className="list-disc pl-5 space-y-2 mb-5 text-[15px] text-zinc-700 font-medium">
              <li>Datos y documentos de la empresa</li>
              <li>Procesos administrativos y financieros</li>
              <li>Equipo operativo</li>
              <li>Canales de venta</li>
              <li>Agendar la reunión de auditoría</li>
            </ul>
            <div className="bg-sky-50 border border-sky-100 p-4 rounded-xl mb-6">
              <p className="text-sm text-sky-800 text-center font-medium">
                Completar esta información nos ayudará a validar tu operación más rápido.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModal(null)}
                className="flex-1 border-2 border-orange-400 text-orange-500 hover:bg-orange-50 font-bold py-3 rounded-xl transition-colors text-sm"
              >
                Cancelar
              </button>
              <button
                onClick={handleVerifyConfirm}
                className="flex-1 bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3 rounded-xl shadow-sm transition-colors text-sm"
              >
                Comenzar
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Panel de tutoriales */}
      {modal === "tutorial" && (
        <Modal onClose={() => setModal(null)} wide>
          <div>
            {/* Header */}
            <div className="px-6 pt-6 pb-4 border-b border-zinc-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
                  <PlayCircle className="w-5 h-5 text-[#f08c3e]" />
                </div>
                <div>
                  <h3 className="font-bold text-zinc-800 text-base">Tutoriales de activación</h3>
                  <p className="text-xs text-zinc-400">Aprende a completar cada paso antes de empezar</p>
                </div>
              </div>
            </div>

            {/* Video principal */}
            <div className="p-6 space-y-5">
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Video principal</p>
                <div className="rounded-xl overflow-hidden border border-zinc-200 shadow-sm">
                  <div className="relative w-full pt-[56.25%] bg-zinc-900">
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src="https://www.youtube.com/embed/D78m0v4p1k0?controls=1&rel=0"
                      title="Cómo activarte como proveedor en Dropi"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <div className="p-4 bg-white">
                    <p className="font-semibold text-zinc-800 text-sm">Cómo activarte como proveedor en Dropi</p>
                    <p className="text-xs text-zinc-500 mt-1">Todo lo que necesitas saber para completar tu activación paso a paso.</p>
                  </div>
                </div>
              </div>

              {/* Tutoriales por paso */}
              <div>
                <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide mb-3">Por paso</p>
                <div className="space-y-2">
                  {[
                    { step: 1, title: "Cómo crear tu primera bodega", dur: "2:14" },
                    { step: 2, title: "Cómo cargar tu primer producto", dur: "3:40" },
                    { step: 3, title: "Gestión de órdenes desde el dashboard", dur: "4:10" },
                    { step: 4, title: "Cómo coordinar tus despachos", dur: "3:22" },
                  ].map(({ step, title, dur }) => (
                    <div
                      key={step}
                      className="flex items-center gap-4 p-3 rounded-xl border border-zinc-100 hover:border-orange-200 hover:bg-orange-50/40 transition-all cursor-pointer group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-orange-100 text-[#f08c3e] flex items-center justify-center font-black text-sm flex-shrink-0">
                        {step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900 truncate">{title}</p>
                        <p className="text-xs text-zinc-400">{dur}</p>
                      </div>
                      <PlayCircle className="w-5 h-5 text-zinc-300 group-hover:text-[#f08c3e] flex-shrink-0 transition-colors" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Activación completa */}
      {modal === "complete" && (
        <Modal>
          <div className="p-8 py-12 flex flex-col items-center text-center animate-in zoom-in-95 fade-in duration-500">
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-[#f08c3e] mb-5">
              <Bot className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-bold text-zinc-800 mb-2">¡Tu cuenta está activa!</h2>
            <p className="text-zinc-600 mb-3 font-medium flex items-center gap-2 text-[15px]">
              Lo mejor está por empezar <span className="text-xl">🧡</span>
            </p>
            <p className="text-sm text-zinc-500 mb-8 max-w-xs leading-relaxed">
              Ahora puedes gestionar productos, órdenes, pagos y reportes desde tu dashboard.
            </p>
            <button
              onClick={() => {
                trackEvent("activation_completed");
                setModal(null);
              }}
              className="w-full max-w-xs bg-[#f08c3e] hover:bg-[#e67e22] text-white font-bold py-3.5 px-6 rounded-lg shadow-md transition-transform hover:scale-105"
            >
              Continuar
            </button>
          </div>
        </Modal>
      )}

      {/* ── Dropibot ── */}
      <DropiBot
        completed={completed}
        onNavigate={(v) => { setView(v); }}
        onOpenModal={(m) => { setModal(m); }}
        hidden={modal !== null}
      />
    </div>
  );
}
