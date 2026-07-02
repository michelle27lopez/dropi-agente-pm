"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Attendee = { id: string; name: string; role: string; category: string; token: string; match_id: string | null };
type Message = { id: string; sender_role: string; content: string; created_at: string };
type MockConv = { city: string; daysAgo: number; outcome: "cerrada" | "perdida"; preview: string; messages: { role: "supplier" | "dropshipper"; text: string }[] };

const ACCENT = "#7C3AED";

// ─── Métricas mock por categoría ─────────────────────────────────────────────
const METRICS: Record<string, { gmv: string; ordenes: number; unidades: number; score: number; nivel: string }> = {
  ropa:       { gmv: "$47.8M", ordenes: 156, unidades: 1247, score: 74, nivel: "B" },
  tech:       { gmv: "$38.2M", ordenes: 89,  unidades: 456,  score: 81, nivel: "A" },
  cosmeticos: { gmv: "$52.6M", ordenes: 203, unidades: 891,  score: 68, nivel: "B" },
  hogar:      { gmv: "$29.1M", ordenes: 67,  unidades: 312,  score: 71, nivel: "B" },
};

// ─── Script de conversación activa (guiado, sin IA) ─────────────────────────
// replies[] = mensajes del dropshipper en orden.
// El proveedor escribe lo que quiera — su envío dispara el siguiente reply.
// hints[] orienta al proveedor qué decir en cada turno.
const SCRIPTS: Record<string, { replies: string[]; hints: string[] }> = {
  ropa: {
    replies: [
      "Hola! Vi que tienes ropa en el programa. ¿Qué tallas manejas y cuánto sale la unidad?",
      "Ese precio me cuadra. ¿Tienes fotos con fondo blanco listas para publicar?",
      "Perfecto. ¿Y el tiempo de despacho desde que hago el pedido?",
      "48 horas me funciona. ¿Tienes stock para empezar con unas 50 unidades?",
      "¿Cuánto me queda si vendo a $65.000? ¿El margen es bueno?",
      "¡Ese margen me convence! ¿Cómo hago el pedido por Dropi?",
      "Listo, todo claro. ¡Hago el pedido esta semana! 🤝",
    ],
    hints: [
      "Cuéntale qué tallas tienes y el precio por unidad",
      "Confirma que tienes fotos del producto listas",
      "Dile tu tiempo de despacho desde Cali",
      "Confirma disponibilidad de inventario",
      "Ayúdale a calcular el margen neto",
      "Explícale el proceso de pedido en Dropi",
      "¡Ya llegaron al acuerdo! Celebra el cierre.",
    ],
  },
  tech: {
    replies: [
      "Hola! ¿Qué accesorios tech tienes disponibles y cuánto sale la unidad?",
      "Los audífonos TWS me interesan. ¿Vienen en caja retail listos para revender?",
      "¿Y tienen garantía? Mis clientes siempre preguntan por eso.",
      "Ok, 6 meses es bueno. ¿Cuál es el pedido mínimo?",
      "Para 30 unidades, ¿hay precio especial por volumen?",
      "Ese precio me deja buen margen. ¿Cuánto tardas en despachar?",
      "Perfecto, ¡arrancamos! Hago el pedido la próxima semana 🔥",
    ],
    hints: [
      "Describe tu catálogo y precios",
      "Confirma presentación del producto",
      "Habla de tu política de garantía",
      "Dile el pedido mínimo",
      "Ofrece precio especial por volumen",
      "Confirma tiempo de despacho",
      "¡Ya tienen trato! Cierra la negociación.",
    ],
  },
  cosmeticos: {
    replies: [
      "Hola! Vi que tienes cosméticos. ¿Manejas línea natural? ¿Qué productos tienes?",
      "Las cremas hidratantes me interesan. ¿Tienen ácido hialurónico o vitamina E?",
      "¿Los productos tienen certificación INVIMA?",
      "Entiendo. ¿Puedes hacer marca blanca con mi logo?",
      "Para 50 unidades, ¿cuánto sale con mi logo personalizado?",
      "Ese precio me deja buen margen. ¿Cuánto tarda la personalización?",
      "Me convence. Arranquemos con 50 unidades con mi logo 💜",
    ],
    hints: [
      "Describe tu línea de productos naturales",
      "Habla de ingredientes y diferencial",
      "Explica el estado de tu certificación",
      "Explica opciones de personalización",
      "Da el precio con marca blanca",
      "Da tiempos de producción",
      "¡Cierre confirmado! Celebra el acuerdo.",
    ],
  },
  hogar: {
    replies: [
      "Hola! ¿Qué productos de hogar manejas? Vi que tienes decoración.",
      "Las lámparas LED me llaman mucho. ¿Son regulables en intensidad?",
      "¿Vienen con garantía? Mis clientes son exigentes con eso.",
      "¿Cuánto sale la unidad y hay precio por volumen?",
      "Si vendo a $95.000, ¿qué margen me queda?",
      "Ese margen me funciona. ¿Despachas a todo el país?",
      "¡Perfecto! Hago el primer pedido de 20 unidades. Fue fácil negociar 🙌",
    ],
    hints: [
      "Describe tu catálogo de hogar y decoración",
      "Explica características y diferencial del producto",
      "Describe tu garantía y postventa",
      "Da precios y descuentos por volumen",
      "Ayúdale a calcular el margen neto",
      "Confirma cobertura de despacho",
      "¡Ya cerraron! Confirma los próximos pasos.",
    ],
  },
};

// ─── Negociaciones pasadas mock ───────────────────────────────────────────────
const HISTORY: Record<string, MockConv[]> = {
  ropa: [
    { city: "Medellín", daysAgo: 3, outcome: "cerrada", preview: "Perfecto, te hago el pedido esta semana 🤝",
      messages: [
        { role: "dropshipper", text: "Hola! Vi que tienes blusas de lino. ¿Cuánto sale la unidad?" },
        { role: "supplier",    text: "Hola! Sale a $32.000. Para 50+ te la dejo a $28.000." },
        { role: "dropshipper", text: "¿Tienes fotos con fondo blanco?" },
        { role: "supplier",    text: "Sí, catálogo completo disponible." },
        { role: "dropshipper", text: "¿Tiempo de despacho?" },
        { role: "supplier",    text: "48 horas hábiles desde Cali. Tengo 200 unidades." },
        { role: "dropshipper", text: "Perfecto, te hago el pedido esta semana 🤝" },
      ],
    },
    { city: "Bogotá", daysAgo: 6, outcome: "perdida", preview: "Encontré otro proveedor con precio mejor",
      messages: [
        { role: "dropshipper", text: "¿Manejas camisetas oversize en tallas grandes?" },
        { role: "supplier",    text: "Sí, hasta 3XL. ¿Qué colores?" },
        { role: "dropshipper", text: "Negro, blanco y gris. ¿Precio?" },
        { role: "supplier",    text: "$25.000, mínimo 30 piezas." },
        { role: "dropshipper", text: "Encontré otro proveedor con precio mejor. Gracias!" },
      ],
    },
    { city: "Cali", daysAgo: 11, outcome: "cerrada", preview: "Ya llegó el pedido, todo bien 👍",
      messages: [
        { role: "dropshipper", text: "¿Trabajas con accesorios también, bolsos?" },
        { role: "supplier",    text: "Sí, bolsos de cuero sintético a $45.000." },
        { role: "dropshipper", text: "Dame 20 para empezar." },
        { role: "supplier",    text: "Listo, en 48h despachados con guía." },
        { role: "dropshipper", text: "Ya llegó el pedido, todo bien 👍" },
      ],
    },
    { city: "Barranquilla", daysAgo: 15, outcome: "perdida", preview: "Necesito talla XS y no tienes stock",
      messages: [
        { role: "dropshipper", text: "¿Tienes blusas en talla XS?" },
        { role: "supplier",    text: "Justo en XS estoy bajo, solo 5 unidades." },
        { role: "dropshipper", text: "Necesito 30 mínimo." },
        { role: "supplier",    text: "Nueva llegada en 15 días." },
        { role: "dropshipper", text: "Necesito talla XS y no tienes stock. Busco otro, gracias!" },
      ],
    },
    { city: "Pereira", daysAgo: 22, outcome: "cerrada", preview: "Hicimos ya 3 pedidos, sigamos así 🚀",
      messages: [
        { role: "dropshipper", text: "¿Tienes conjuntos para mujeres jóvenes?" },
        { role: "supplier",    text: "$55.000 el conjunto, para 20+ a $48.000." },
        { role: "dropshipper", text: "Dale, arrancamos con 25." },
        { role: "supplier",    text: "Listo! Despachamos mañana." },
        { role: "dropshipper", text: "Hicimos ya 3 pedidos, sigamos así 🚀" },
      ],
    },
  ],
  tech: [
    { city: "Bogotá", daysAgo: 2, outcome: "cerrada", preview: "El pedido llegó perfecto, voy por más",
      messages: [
        { role: "dropshipper", text: "¿Tienes audífonos TWS con buen sonido y precio accesible?" },
        { role: "supplier",    text: "TWS Pro, 6h batería + case. $38.000, para 30+ a $33.000." },
        { role: "dropshipper", text: "¿Caja retail incluida?" },
        { role: "supplier",    text: "Sí, caja retail lista para revender." },
        { role: "dropshipper", text: "El pedido llegó perfecto, voy por más la próxima semana 👍" },
      ],
    },
    { city: "Medellín", daysAgo: 7, outcome: "perdida", preview: "Solo necesito 5 unidades y el mínimo es mucho",
      messages: [
        { role: "dropshipper", text: "¿Cuánto es el pedido mínimo?" },
        { role: "supplier",    text: "Mínimo 20 unidades." },
        { role: "dropshipper", text: "Solo necesito 5 para probar el mercado." },
        { role: "dropshipper", text: "Solo necesito 5 y el mínimo es mucho. Gracias!" },
      ],
    },
    { city: "Cali", daysAgo: 13, outcome: "cerrada", preview: "Pedido hecho. Cuéntame cuando despache.",
      messages: [
        { role: "dropshipper", text: "¿Tienes cargadores rápidos 65W?" },
        { role: "supplier",    text: "$22.000 para 40+. Compatibles Samsung y Xiaomi." },
        { role: "dropshipper", text: "¿Garantía?" },
        { role: "supplier",    text: "6 meses." },
        { role: "dropshipper", text: "Pedido hecho. Cuéntame cuando despache." },
      ],
    },
    { city: "Manizales", daysAgo: 28, outcome: "cerrada", preview: "Ya tengo el segundo pedido listo 🔥",
      messages: [
        { role: "dropshipper", text: "¿Kits de accesorios para celular?" },
        { role: "supplier",    text: "Kit funda + vidrio + cable a $28.000. Samsung, iPhone, Xiaomi." },
        { role: "dropshipper", text: "Dame 50 kits mixtos." },
        { role: "dropshipper", text: "Ya tengo el segundo pedido listo 🔥" },
      ],
    },
  ],
  cosmeticos: [
    { city: "Cali", daysAgo: 1, outcome: "cerrada", preview: "Mis clientes amaron las cremas 💜",
      messages: [
        { role: "dropshipper", text: "¿Tienes cremas hidratantes con buenos ingredientes?" },
        { role: "supplier",    text: "Línea natural, ácido hialurónico y vitamina E. Para 40+ a $24.000." },
        { role: "dropshipper", text: "¿Marca blanca?" },
        { role: "supplier",    text: "Para 100+ sí. Para 40 va con mi marca." },
        { role: "dropshipper", text: "Mis clientes amaron las cremas, quiero pedido mensual 💜" },
      ],
    },
    { city: "Medellín", daysAgo: 4, outcome: "cerrada", preview: "Vamos con el kit sérum + crema",
      messages: [
        { role: "dropshipper", text: "¿Tienes sérum vitamina C?" },
        { role: "supplier",    text: "30ml con 15% vitamina C. $35.000, kit con crema a $55.000." },
        { role: "dropshipper", text: "Vamos con el kit completo 🛍️" },
      ],
    },
    { city: "Barranquilla", daysAgo: 9, outcome: "perdida", preview: "Necesito INVIMA y aún no la tienes",
      messages: [
        { role: "dropshipper", text: "¿Tus productos tienen certificación INVIMA?" },
        { role: "supplier",    text: "En proceso, en ~3 meses." },
        { role: "dropshipper", text: "Necesito INVIMA y aún no la tienes. Retomo cuando la tengas!" },
      ],
    },
    { city: "Bogotá", daysAgo: 14, outcome: "cerrada", preview: "Sigamos con la línea de noche también 🌙",
      messages: [
        { role: "dropshipper", text: "¿Tienes rutina de noche con retinol?" },
        { role: "supplier",    text: "Crema noche con retinol y argán. 30ml $22.000, muestras gratis con pedido 20+." },
        { role: "dropshipper", text: "Sigamos con la línea de noche también 🌙" },
      ],
    },
    { city: "Pereira", daysAgo: 21, outcome: "perdida", preview: "El empaque no es premium para mi clientela",
      messages: [
        { role: "dropshipper", text: "¿Cómo es el empaque?" },
        { role: "supplier",    text: "Plástico reciclado. Para 200+ puedo hacer premium." },
        { role: "dropshipper", text: "El empaque no es premium para mi clientela. Gracias!" },
      ],
    },
  ],
  hogar: [
    { city: "Bogotá", daysAgo: 5, outcome: "cerrada", preview: "Voy a pedir el doble el próximo mes 💡",
      messages: [
        { role: "dropshipper", text: "¿Tienes lámparas decorativas LED?" },
        { role: "supplier",    text: "Nórdicas regulables, $52.000 para 20+ con despacho incluido." },
        { role: "dropshipper", text: "¿Garantía?" },
        { role: "supplier",    text: "1 año, reemplazo sin costo si falla." },
        { role: "dropshipper", text: "Llegaron perfectas, voy a pedir el doble el próximo mes 💡" },
      ],
    },
    { city: "Cali", daysAgo: 10, outcome: "perdida", preview: "Necesito entrega en 24h y no puedes",
      messages: [
        { role: "dropshipper", text: "¿Cuánto tiempo tardas a Cali?" },
        { role: "supplier",    text: "2-3 días hábiles." },
        { role: "dropshipper", text: "Necesito 24h para mi cliente, no puedes. Busco otro." },
      ],
    },
    { city: "Medellín", daysAgo: 18, outcome: "cerrada", preview: "Todo llegó bien. Ya mandé otro pedido 🎉",
      messages: [
        { role: "dropshipper", text: "¿Tienes organizadores de cocina en bambú?" },
        { role: "supplier",    text: "Set 5 piezas bambú a $42.000. Fotos reales disponibles." },
        { role: "dropshipper", text: "Dame 15 sets." },
        { role: "supplier",    text: "Despachado en 48h con guía." },
        { role: "dropshipper", text: "Todo llegó bien. Ya mandé otro pedido 🎉" },
      ],
    },
    { city: "Bucaramanga", daysAgo: 30, outcome: "cerrada", preview: "Calidad excelente, seguimos 🖼️",
      messages: [
        { role: "dropshipper", text: "¿Tienes cuadros abstractos modernos?" },
        { role: "supplier",    text: "40x60cm a $58.000 para 10+. Empaque protegido." },
        { role: "dropshipper", text: "Mis clientes están felices, seguimos 🖼️" },
      ],
    },
  ],
};

const CATEGORY_LABELS: Record<string, string> = { ropa: "Ropa y accesorios", tech: "Tecnología", cosmeticos: "Cosméticos", hogar: "Hogar y decoración" };
const CATEGORY_EMOJIS: Record<string, string> = { ropa: "👗", tech: "📱", cosmeticos: "✨", hogar: "🏠" };

function delay(ms: number) { return new Promise<void>(r => setTimeout(r, ms)); }

export default function SupplierPortal() {
  const { token } = useParams<{ token: string }>();

  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);
  const [expandedConv, setExpandedConv] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"historial" | "chat">("chat");

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [typing, setTyping] = useState(false);
  const [scriptStep, setScriptStep] = useState(0);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  // Load attendee
  useEffect(() => {
    const load = async () => {
      const res = await fetch("/api/activa-demo/attendees");
      const all: Attendee[] = await res.json();
      const found = all.find(a => a.token === token && a.role === "supplier");
      setAttendee(found ?? null);
      setLoading(false);
      if (found?.match_id) setPolling(false);
    };
    load();
  }, [token]);

  useEffect(() => {
    if (!polling) return;
    const t = setInterval(async () => {
      const res = await fetch("/api/activa-demo/attendees");
      const all: Attendee[] = await res.json();
      const found = all.find(a => a.token === token);
      if (found?.match_id) { setAttendee(found); setPolling(false); }
    }, 2000);
    return () => clearInterval(t);
  }, [polling, token]);

  // Load existing messages + init script
  useEffect(() => {
    if (!attendee?.match_id || initialized.current) return;
    initialized.current = true;

    const cat = attendee.category;
    const script = SCRIPTS[cat] ?? SCRIPTS.ropa;

    const init = async () => {
      const res = await fetch(`/api/activa-demo/chat/${attendee.match_id}`);
      const existing: Message[] = await res.json();

      if (Array.isArray(existing) && existing.length > 0) {
        setMessages(existing);
        const supplierCount = existing.filter(m => m.sender_role === "supplier").length;
        const step = Math.min(supplierCount, script.replies.length);
        setScriptStep(step);
        if (step >= script.replies.length) setDone(true);
      } else {
        // Send first scripted dropshipper message
        await delay(900);
        setTyping(true);
        await delay(1400);
        const firstMsg = script.replies[0];
        await fetch(`/api/activa-demo/chat/${attendee.match_id}`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: firstMsg, sender_role: "dropshipper" }),
        });
        setMessages([{ id: `init-${Date.now()}`, sender_role: "dropshipper", content: firstMsg, created_at: new Date().toISOString() }]);
        setTyping(false);
      }
    };
    init();
  }, [attendee?.match_id, attendee?.category]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  const sendMessage = async () => {
    if (!input.trim() || sending || !attendee?.match_id) return;
    const text = input.trim();
    const cat = attendee.category;
    const script = SCRIPTS[cat] ?? SCRIPTS.ropa;
    const currentStep = scriptStep;

    setInput("");
    setSending(true);

    // Store supplier message
    await fetch(`/api/activa-demo/chat/${attendee.match_id}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, sender_role: "supplier" }),
    });
    const supplierMsg: Message = { id: `sup-${Date.now()}`, sender_role: "supplier", content: text, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, supplierMsg]);
    setSending(false);

    const nextStep = currentStep + 1;

    if (nextStep < script.replies.length) {
      await delay(300);
      setTyping(true);
      const replyText = script.replies[nextStep];
      await delay(Math.min(900 + replyText.length * 20, 2800));

      await fetch(`/api/activa-demo/chat/${attendee.match_id}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: replyText, sender_role: "dropshipper" }),
      });
      const dsMsg: Message = { id: `ds-${Date.now()}`, sender_role: "dropshipper", content: replyText, created_at: new Date().toISOString() };
      setMessages(prev => [...prev, dsMsg]);
      setTyping(false);
      setScriptStep(nextStep);

      if (nextStep === script.replies.length - 1) {
        await delay(700);
        setDone(true);
        setActiveTab("chat");
      }
    } else {
      setScriptStep(nextStep);
      setDone(true);
    }
  };

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 32 }}>⏳</div></div>;
  if (!attendee) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 48 }}>❌</div><div style={{ color: "#DC2626", marginTop: 8 }}>Link no válido</div></div></div>;

  if (!attendee.match_id) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 340, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#111", marginBottom: 8 }}>Estás en lista, {attendee.name.split(" ")[0]}</div>
          <div style={{ fontSize: 14, color: "#666", lineHeight: 1.7 }}>Cuando activemos Dropi Activa recibirás tu señal aquí.</div>
        </div>
      </div>
    );
  }

  const cat = attendee.category;
  const convs = HISTORY[cat] ?? HISTORY.ropa;
  const metrics = METRICS[cat] ?? METRICS.ropa;
  const script = SCRIPTS[cat] ?? SCRIPTS.ropa;
  const catLabel = CATEGORY_LABELS[cat] ?? cat;
  const catEmoji = CATEGORY_EMOJIS[cat] ?? "📦";
  const firstName = attendee.name.split(" ")[0];
  const cerradas = convs.filter(c => c.outcome === "cerrada").length;
  const tasa = Math.round((cerradas / convs.length) * 100);
  const currentHint = script.hints[scriptStep] ?? "";
  const newDsMessages = messages.filter(m => m.sender_role === "dropshipper").length;

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#fff", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "11px 20px", display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
        <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 18 }} />
        <span style={{ fontSize: 11, color: "#D1D5DB" }}>·</span>
        <span style={{ fontSize: 11, fontWeight: 800, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.08em" }}>Activa · Proveedor</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 11, color: "#555", fontWeight: 700 }}>{firstName}</span>
          <span style={{ fontSize: 10, background: "#F5F3FF", color: ACCENT, fontWeight: 700, padding: "3px 9px", borderRadius: 99 }}>{catEmoji} {catLabel}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: "1px solid #E5E7EB", background: "#FAFAFA", flexShrink: 0 }}>
        {[
          { id: "historial", label: "📋 Mi panel" },
          { id: "chat", label: `💬 Negociación activa${done ? " ✅" : newDsMessages > 0 ? ` · ${newDsMessages}` : ""}` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as "historial" | "chat")}
            style={{
              flex: 1, background: "none", border: "none",
              borderBottom: `2px solid ${activeTab === tab.id ? ACCENT : "transparent"}`,
              padding: "11px 8px", fontSize: 12, fontWeight: 700, cursor: "pointer",
              color: activeTab === tab.id ? ACCENT : "#9CA3AF", transition: "all 0.15s",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>

        {/* ── PANEL IZQUIERDO: Métricas + Historial ── */}
        <div className="panel-col" style={{
          width: 370, flexShrink: 0, overflowY: "auto",
          display: activeTab === "historial" ? "flex" : "none",
          flexDirection: "column", borderRight: "1px solid #E5E7EB",
        }}>

          {/* Métricas card */}
          <div style={{ margin: 14, background: "linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)", borderRadius: 16, padding: "18px 20px", color: "#fff" }}>
            <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", opacity: 0.7, marginBottom: 14, textTransform: "uppercase" }}>Tu actividad en Dropi Activa</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {[
                { label: "GMV generado", value: metrics.gmv, sub: "COP" },
                { label: "Órdenes", value: String(metrics.ordenes), sub: "creadas" },
                { label: "Unidades", value: metrics.unidades.toLocaleString("es-CO"), sub: "despachadas" },
                { label: "Dropi Score", value: `${metrics.score} pts`, sub: `Nivel ${metrics.nivel}` },
              ].map(m => (
                <div key={m.label}>
                  <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, letterSpacing: "-0.02em" }}>{m.value}</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 3, fontWeight: 600 }}>{m.label} · {m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Negociaciones stats strip */}
          <div style={{ padding: "0 14px 10px", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {[
              { label: "Negociaciones", value: convs.length, color: "#6366F1" },
              { label: "Cerradas", value: cerradas, color: "#10B981" },
              { label: "Tasa cierre", value: `${tasa}%`, color: ACCENT },
            ].map(s => (
              <div key={s.label} style={{ background: "#F8FAFC", border: "1px solid #E5E7EB", borderRadius: 10, padding: "10px 8px", textAlign: "center" }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "#9CA3AF", fontWeight: 700, marginTop: 2, textTransform: "uppercase", letterSpacing: "0.04em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Section label */}
          <div style={{ padding: "8px 16px 8px", fontSize: 11, fontWeight: 800, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Negociaciones recientes
          </div>

          {/* Conversation cards */}
          <div style={{ padding: "0 12px 24px", display: "flex", flexDirection: "column", gap: 8 }}>
            {convs.map((conv, i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
                <button onClick={() => setExpandedConv(expandedConv === i ? null : i)}
                  style={{ width: "100%", background: "none", border: "none", cursor: "pointer", padding: "12px 14px", display: "flex", alignItems: "flex-start", gap: 10, textAlign: "left" }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14,
                    background: conv.outcome === "cerrada" ? "#F0FDF4" : "#FEF2F2",
                    border: `1px solid ${conv.outcome === "cerrada" ? "#BBF7D0" : "#FECACA"}`,
                  }}>
                    {conv.outcome === "cerrada" ? "✅" : "❌"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>Dropshipper · {conv.city}</span>
                      <span style={{ fontSize: 9, fontWeight: 800, padding: "1px 7px", borderRadius: 99, background: conv.outcome === "cerrada" ? "#F0FDF4" : "#FEF2F2", color: conv.outcome === "cerrada" ? "#10B981" : "#EF4444" }}>
                        {conv.outcome === "cerrada" ? "Cerrada" : "Perdida"}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6B7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      "{conv.preview}"
                    </div>
                    <div style={{ fontSize: 10, color: "#C4C4C4", marginTop: 3 }}>hace {conv.daysAgo} días · {conv.messages.length} mensajes</div>
                  </div>
                  <span style={{ fontSize: 12, color: "#C4C4C4", marginTop: 2, transform: expandedConv === i ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                </button>

                {expandedConv === i && (
                  <div style={{ borderTop: "1px solid #F3F4F6", padding: "12px 14px", background: "#FAFAFA", display: "flex", flexDirection: "column", gap: 8 }}>
                    {conv.messages.map((msg, j) => (
                      <div key={j} style={{ display: "flex", justifyContent: msg.role === "supplier" ? "flex-end" : "flex-start" }}>
                        <div style={{
                          maxWidth: "80%", padding: "8px 12px", fontSize: 12, lineHeight: 1.5,
                          borderRadius: msg.role === "supplier" ? "14px 14px 3px 14px" : "14px 14px 14px 3px",
                          background: msg.role === "supplier" ? ACCENT : "#fff",
                          color: msg.role === "supplier" ? "#fff" : "#333",
                          border: msg.role === "supplier" ? "none" : "1px solid #E5E7EB",
                        }}>
                          {msg.text}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── PANEL DERECHO: Chat guiado ── */}
        <div className="chat-col" style={{
          flex: 1, display: activeTab === "chat" ? "flex" : "none",
          flexDirection: "column", overflow: "hidden",
        }}>

          {/* Chat header */}
          <div style={{ background: "#FAFAFA", borderBottom: "1px solid #E5E7EB", padding: "13px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#FFF8F0", border: "1px solid #FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛒</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>Dropshipper</div>
              <div style={{ fontSize: 11, color: done ? "#10B981" : "#F59E0B", fontWeight: 600 }}>
                {done ? "● Negociación cerrada" : "● Negociando via Dropi Activa"}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ background: "#F3F4F6", borderRadius: 8, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: "#6B7280" }}>🔒 Identidad protegida</div>
              <div style={{ background: done ? "#F0FDF4" : "#F5F3FF", borderRadius: 8, padding: "3px 9px", fontSize: 10, fontWeight: 700, color: done ? "#10B981" : ACCENT }}>
                {done ? "✅ Cerrada" : `${scriptStep}/${script.replies.length - 1} turnos`}
              </div>
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ height: 3, background: "#F3F4F6", flexShrink: 0 }}>
            <div style={{
              height: "100%",
              background: done ? "#10B981" : ACCENT,
              width: `${Math.min((scriptStep / Math.max(script.replies.length - 1, 1)) * 100, 100)}%`,
              transition: "width 0.4s ease",
            }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10, background: "#fff" }}>
            {messages.length === 0 && !typing && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#C4C4C4", fontSize: 13 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                Conectando con el dropshipper...
              </div>
            )}

            {messages.map(msg => {
              const isMine = msg.sender_role === "supplier";
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                  {!isMine && (
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFF8F0", border: "1px solid #FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, flexShrink: 0 }}>🛒</div>
                  )}
                  <div style={{ maxWidth: "72%" }}>
                    {!isMine && <div style={{ fontSize: 9, color: "#C4C4C4", marginBottom: 2, fontWeight: 600 }}>Dropshipper</div>}
                    <div style={{
                      background: isMine ? ACCENT : "#F3F4F6",
                      color: isMine ? "#fff" : "#111",
                      borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                    }}>
                      {msg.content}
                    </div>
                    <div style={{ fontSize: 9, color: "#D1D5DB", marginTop: 2, textAlign: isMine ? "right" : "left" }}>
                      {new Date(msg.created_at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}

            {typing && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFF8F0", border: "1px solid #FED7AA", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13 }}>🛒</div>
                <div style={{ background: "#F3F4F6", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#C4C4C4", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />)}
                </div>
              </div>
            )}

            {/* Conclusion banner */}
            {done && !typing && (
              <div style={{ margin: "16px 0", background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", border: "1px solid #86EFAC", borderRadius: 16, padding: "20px 24px", textAlign: "center" }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🤝</div>
                <div style={{ fontSize: 17, fontWeight: 900, color: "#166534", marginBottom: 4 }}>¡Negociación cerrada!</div>
                <div style={{ fontSize: 13, color: "#15803D", lineHeight: 1.6 }}>
                  Esta conversación queda en tu historial.<br />
                  Dropi registra el acuerdo y coordina el despacho.
                </div>
                <button onClick={() => setActiveTab("historial")}
                  style={{ marginTop: 14, background: "#16A34A", color: "#fff", border: "none", borderRadius: 10, padding: "9px 20px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                  Ver mi panel →
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input + hint */}
          {!done ? (
            <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", flexShrink: 0 }}>
              {currentHint && !typing && (
                <div style={{ padding: "8px 18px 0", fontSize: 11, color: "#9CA3AF", display: "flex", alignItems: "center", gap: 5 }}>
                  <span>💡</span> {currentHint}
                </div>
              )}
              <div style={{ padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-end" }}>
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                  placeholder="Escribe tu respuesta..." rows={1}
                  disabled={typing}
                  style={{ flex: 1, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 22, padding: "10px 16px", fontSize: 14, color: "#111", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.4, opacity: typing ? 0.5 : 1 }} />
                <button onClick={sendMessage} disabled={!input.trim() || sending || typing}
                  style={{ width: 42, height: 42, borderRadius: "50%", background: input.trim() && !sending && !typing ? ACCENT : "#E5E7EB", border: "none", cursor: input.trim() && !sending && !typing ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
                  <svg width="17" height="17" viewBox="0 0 24 24" fill={input.trim() && !sending && !typing ? "#fff" : "#aaa"}><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                </button>
              </div>
            </div>
          ) : (
            <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", padding: "14px 20px", textAlign: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>Negociación finalizada · Dropi coordina el despacho</span>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-5px)} }
        @media (min-width: 700px) {
          .panel-col { display: flex !important; }
          .chat-col { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
