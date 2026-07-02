"use client";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";

type Attendee = { id: string; name: string; role: string; category: string; token: string; match_id: string | null };
type Message = { id: string; sender_role: string; content: string; created_at: string };

// ─── Mock data por categoría ─────────────────────────────────────────────────
const MOCK: Record<string, {
  score: number; level: string; levelColor: string;
  interacciones: number; cerradas: number; perdidas: number;
  respuesta: string; respuestaColor: string;
  negs: { city: string; daysAgo: number; outcome: "cerrada" | "perdida" | "activa"; note: string }[];
}> = {
  ropa: {
    score: 74, level: "Activo", levelColor: "#7C3AED",
    interacciones: 24, cerradas: 9, perdidas: 13,
    respuesta: "1.8h", respuestaColor: "#10B981",
    negs: [
      { city: "Medellín", daysAgo: 3, outcome: "cerrada", note: "50 unidades de blusas de lino · Pedido recurrente" },
      { city: "Bogotá", daysAgo: 6, outcome: "perdida", note: "Eligió otro proveedor por precio" },
      { city: "Cali", daysAgo: 11, outcome: "cerrada", note: "Primera orden · Cliente activo" },
      { city: "Barranquilla", daysAgo: 15, outcome: "perdida", note: "No había tallas disponibles" },
      { city: "Pereira", daysAgo: 22, outcome: "cerrada", note: "3 órdenes en total · Relación activa" },
    ],
  },
  tech: {
    score: 58, level: "Activo", levelColor: "#3B82F6",
    interacciones: 17, cerradas: 6, perdidas: 10,
    respuesta: "3.2h", respuestaColor: "#F59E0B",
    negs: [
      { city: "Bogotá", daysAgo: 2, outcome: "cerrada", note: "30 audífonos TWS · Margen 42%" },
      { city: "Medellín", daysAgo: 7, outcome: "perdida", note: "Stock insuficiente para el pedido" },
      { city: "Cali", daysAgo: 13, outcome: "cerrada", note: "Cargadores 65W · Pedido quincenal" },
      { city: "Bucaramanga", daysAgo: 20, outcome: "perdida", note: "Precio fuera del rango esperado" },
      { city: "Manizales", daysAgo: 28, outcome: "cerrada", note: "Kit accesorios celular · Nuevo cliente" },
    ],
  },
  cosmeticos: {
    score: 82, level: "Consolidado", levelColor: "#EC4899",
    interacciones: 31, cerradas: 14, perdidas: 15,
    respuesta: "1.1h", respuestaColor: "#10B981",
    negs: [
      { city: "Cali", daysAgo: 1, outcome: "cerrada", note: "Cremas hidratantes · 80 unidades" },
      { city: "Medellín", daysAgo: 4, outcome: "cerrada", note: "Sérum vitamina C · Cliente fidelizado" },
      { city: "Barranquilla", daysAgo: 9, outcome: "perdida", note: "Buscaba certificación orgánica" },
      { city: "Bogotá", daysAgo: 14, outcome: "cerrada", note: "Kit facial completo · Marca blanca" },
      { city: "Pereira", daysAgo: 21, outcome: "perdida", note: "Competidor con empaque premium" },
    ],
  },
  hogar: {
    score: 47, level: "Creciendo", levelColor: "#F59E0B",
    interacciones: 12, cerradas: 4, perdidas: 7,
    respuesta: "5.4h", respuestaColor: "#EF4444",
    negs: [
      { city: "Bogotá", daysAgo: 5, outcome: "cerrada", note: "Lámparas LED · 20 unidades" },
      { city: "Cali", daysAgo: 10, outcome: "perdida", note: "Tiempo de despacho muy largo" },
      { city: "Medellín", daysAgo: 18, outcome: "cerrada", note: "Organizadores cocina · Recompra" },
      { city: "Manizales", daysAgo: 24, outcome: "perdida", note: "No había colores disponibles" },
      { city: "Bucaramanga", daysAgo: 30, outcome: "cerrada", note: "Set decoración sala · Cliente nuevo" },
    ],
  },
};

const CATEGORY_LABELS: Record<string, string> = { ropa: "Ropa y accesorios", tech: "Tecnología", cosmeticos: "Cosméticos y cuidado", hogar: "Hogar y decoración" };
const CATEGORY_EMOJIS: Record<string, string> = { ropa: "👗", tech: "📱", cosmeticos: "✨", hogar: "🏠" };

// ─── Chat helpers ────────────────────────────────────────────────────────────
const ACCENT = "#7C3AED";

export default function SupplierPortal() {
  const { token } = useParams<{ token: string }>();

  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [aiTyping, setAiTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<"panel" | "chat">("panel");
  const bottomRef = useRef<HTMLDivElement>(null);
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Poll until matched
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

  // Poll chat messages
  useEffect(() => {
    if (!attendee?.match_id) return;
    const poll = async () => {
      const res = await fetch(`/api/activa-demo/chat/${attendee.match_id}`);
      const msgs: Message[] = await res.json();
      if (Array.isArray(msgs)) setMessages(msgs);
    };
    poll();
    const t = setInterval(poll, 1500);
    return () => clearInterval(t);
  }, [attendee?.match_id]);

  // Opening AI message if chat empty
  useEffect(() => {
    if (!attendee?.match_id) return;
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/activa-demo/chat/${attendee.match_id}`);
      const msgs: Message[] = await res.json();
      if (!msgs || msgs.length === 0) {
        setAiTyping(true);
        await new Promise(r => setTimeout(r, 1500));
        await fetch("/api/activa-demo/ai-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId: attendee.match_id, userRole: "supplier" }),
        });
        setAiTyping(false);
        setActiveTab("chat");
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [attendee?.match_id]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  const sendMessage = async () => {
    if (!input.trim() || sending || !attendee?.match_id) return;
    const text = input.trim();
    setInput("");
    setSending(true);
    await fetch(`/api/activa-demo/chat/${attendee.match_id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, sender_role: "supplier" }),
    });
    setSending(false);
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    aiTimerRef.current = setTimeout(async () => {
      setAiTyping(true);
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 1000));
      await fetch("/api/activa-demo/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId: attendee.match_id, userRole: "supplier" }),
      });
      setAiTyping(false);
      aiTimerRef.current = null;
    }, 5000);
  };

  // ─── Loading / not found ─────────────────────────────────────────────────
  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F3FF" }}><div style={{ fontSize: 36, animation: "spin 1s linear infinite" }}>⏳</div></div>;
  if (!attendee) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FEF2F2" }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 48 }}>❌</div><div style={{ color: "#DC2626", marginTop: 8 }}>Link no válido</div></div></div>;

  // ─── Pre-activation ──────────────────────────────────────────────────────
  if (!attendee.match_id) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 340, textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#111", marginBottom: 8 }}>Estás en lista, {attendee.name.split(" ")[0]}</div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>Cuando activemos Dropi Activa recibirás tu señal. Mira el dashboard en pantalla grande.</div>
        </div>
      </div>
    );
  }

  // ─── Main portal ─────────────────────────────────────────────────────────
  const cat = attendee.category;
  const mock = MOCK[cat] ?? MOCK.ropa;
  const catLabel = CATEGORY_LABELS[cat] ?? cat;
  const catEmoji = CATEGORY_EMOJIS[cat] ?? "📦";
  const firstName = attendee.name.split(" ")[0];
  const closedRate = Math.round((mock.cerradas / (mock.cerradas + mock.perdidas)) * 100);
  const newMessages = messages.filter(m => m.sender_role !== "supplier").length;

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#0F0F13", fontFamily: "system-ui, sans-serif", color: "#fff" }}>

      {/* Top bar */}
      <div style={{ background: "#18181F", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "12px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 18, filter: "brightness(0) invert(1)", opacity: 0.85 }} />
        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>·</span>
        <span style={{ fontSize: 12, fontWeight: 800, color: ACCENT, letterSpacing: "0.1em", textTransform: "uppercase" }}>Activa</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: mock.levelColor, background: `${mock.levelColor}18`, padding: "3px 10px", borderRadius: 99 }}>
            {catEmoji} {catLabel}
          </span>
        </div>
      </div>

      {/* Mobile tabs */}
      <div style={{ display: "flex", background: "#18181F", borderBottom: "1px solid rgba(255,255,255,0.07)", flexShrink: 0 }}>
        {[
          { id: "panel", label: "📊 Mi panel" },
          { id: "chat", label: `💬 Conversación${newMessages > 0 ? ` · ${newMessages}` : ""}` },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as "panel" | "chat")}
            style={{
              flex: 1, background: "none", border: "none", borderBottom: `2px solid ${activeTab === tab.id ? ACCENT : "transparent"}`,
              padding: "11px", fontSize: 13, fontWeight: 700, cursor: "pointer",
              color: activeTab === tab.id ? ACCENT : "rgba(255,255,255,0.4)",
              transition: "all 0.2s",
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Body: two-column on desktop, tabbed on mobile */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>

        {/* ── LEFT PANEL ── */}
        <div style={{
          width: 340, flexShrink: 0, overflowY: "auto", padding: "20px 16px",
          display: activeTab === "panel" ? "flex" : "none",
          flexDirection: "column", gap: 14,
          // On desktop always visible
          // @ts-ignore
          "@media (min-width: 768px)": { display: "flex" },
        }}
          className="panel-col">

          {/* Dropi Score */}
          <div style={{ background: "#18181F", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>Dropi Activa Score</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)" }}>Hola, <strong style={{ color: "#fff" }}>{firstName}</strong></div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 42, fontWeight: 900, color: mock.levelColor, lineHeight: 1, letterSpacing: "-0.04em" }}>{mock.score}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: mock.levelColor }}>{mock.level}</div>
              </div>
            </div>
            {/* Score bar */}
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 99, height: 6, overflow: "hidden" }}>
              <div style={{ width: `${mock.score}%`, height: "100%", background: `linear-gradient(90deg, ${mock.levelColor}, ${mock.levelColor}88)`, borderRadius: 99, transition: "width 1s" }} />
            </div>
          </div>

          {/* Stats 2x2 */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { label: "Interacciones", value: mock.interacciones, icon: "💬", color: "#6366F1" },
              { label: "Cerradas", value: mock.cerradas, icon: "✅", color: "#10B981" },
              { label: "Perdidas", value: mock.perdidas, icon: "❌", color: "#EF4444" },
              { label: "Tasa cierre", value: `${closedRate}%`, icon: "🎯", color: "#F59E0B" },
            ].map(s => (
              <div key={s.label} style={{ background: "#18181F", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px" }}>
                <div style={{ fontSize: 18, marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color, letterSpacing: "-0.03em", lineHeight: 1, marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Response time */}
          <div style={{ background: "#18181F", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, padding: "14px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: mock.respuestaColor, letterSpacing: "-0.03em" }}>{mock.respuesta}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.6)" }}>Tiempo de respuesta</div>
              <div style={{ fontSize: 10, color: mock.respuestaColor, fontWeight: 700, marginTop: 2 }}>
                {mock.respuestaColor === "#10B981" ? "● Excelente" : mock.respuestaColor === "#F59E0B" ? "● Bueno" : "● Mejorar"}
              </div>
            </div>
            <div style={{ marginLeft: "auto", fontSize: 20 }}>⏱</div>
          </div>

          {/* Negotiation history */}
          <div style={{ background: "#18181F", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16, overflow: "hidden" }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.7)" }}>Negociaciones recientes</span>
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>últimas {mock.negs.length}</span>
            </div>
            {mock.negs.map((neg, i) => (
              <div key={i} style={{ padding: "12px 16px", borderBottom: i < mock.negs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", display: "flex", gap: 10, alignItems: "flex-start" }}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                  background: neg.outcome === "cerrada" ? "rgba(16,185,129,0.15)" : neg.outcome === "activa" ? "rgba(99,102,241,0.15)" : "rgba(239,68,68,0.15)",
                }}>
                  {neg.outcome === "cerrada" ? "✅" : neg.outcome === "activa" ? "🔄" : "❌"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>Dropshipper · {neg.city}</span>
                    <span style={{ fontSize: 9, fontWeight: 700, color: neg.outcome === "cerrada" ? "#10B981" : neg.outcome === "activa" ? "#6366F1" : "#EF4444", background: neg.outcome === "cerrada" ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)", padding: "1px 6px", borderRadius: 99 }}>
                      {neg.outcome === "cerrada" ? "Cerrada" : neg.outcome === "activa" ? "En curso" : "Perdida"}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.4 }}>{neg.note}</div>
                  <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 2 }}>hace {neg.daysAgo} días</div>
                </div>
              </div>
            ))}
          </div>

          {/* Current signal */}
          <div style={{ background: `${ACCENT}15`, border: `1px solid ${ACCENT}30`, borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Señal activa ahora</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
              Un dropshipper verificado está en conversación contigo. Identidad protegida por Dropi.
            </div>
            <button onClick={() => setActiveTab("chat")} style={{ marginTop: 10, background: ACCENT, border: "none", borderRadius: 8, padding: "8px 16px", color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
              Ir al chat →
            </button>
          </div>

        </div>

        {/* ── DIVIDER (desktop only) ── */}
        <div style={{ width: 1, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} className="divider-col" />

        {/* ── RIGHT: CHAT ── */}
        <div style={{
          flex: 1, display: activeTab === "chat" ? "flex" : "none",
          flexDirection: "column", overflow: "hidden",
        }}
          className="chat-col">

          {/* Chat header */}
          <div style={{ background: "#18181F", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(247,127,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🛒</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: "#fff" }}>Dropshipper</div>
              <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>● Conectado via Dropi Activa</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "4px 10px", fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.4)" }}>🔒 Identidad protegida</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
            {messages.length === 0 && !aiTyping && (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "rgba(255,255,255,0.25)", fontSize: 13 }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
                Conectando con el dropshipper...
              </div>
            )}
            {messages.map(msg => {
              const isMine = msg.sender_role === "supplier";
              return (
                <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
                  {!isMine && (
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(247,127,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>🛒</div>
                  )}
                  <div style={{ maxWidth: "72%" }}>
                    {!isMine && <div style={{ fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 2, fontWeight: 600 }}>Dropshipper</div>}
                    <div style={{
                      background: isMine ? ACCENT : "#2A2A35",
                      color: "#fff",
                      borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                      padding: "10px 14px", fontSize: 14, lineHeight: 1.5,
                    }}>
                      {msg.content}
                    </div>
                    <div style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", marginTop: 2, textAlign: isMine ? "right" : "left" }}>
                      {new Date(msg.created_at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              );
            })}
            {aiTyping && (
              <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(247,127,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>🛒</div>
                <div style={{ background: "#2A2A35", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.35)", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ background: "#18181F", borderTop: "1px solid rgba(255,255,255,0.07)", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
            <textarea value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Escribe un mensaje..."
              rows={1}
              style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 22, padding: "10px 16px", fontSize: 14, color: "#fff", outline: "none", resize: "none", fontFamily: "inherit", lineHeight: 1.4 }} />
            <button onClick={sendMessage} disabled={!input.trim() || sending}
              style={{ width: 42, height: 42, borderRadius: "50%", background: input.trim() && !sending ? ACCENT : "rgba(255,255,255,0.1)", border: "none", cursor: input.trim() && !sending ? "pointer" : "default", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "background 0.2s" }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="#fff"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce { 0%,60%,100%{transform:translateY(0)} 30%{transform:translateY(-4px)} }
        @media (min-width: 700px) {
          .panel-col { display: flex !important; }
          .chat-col { display: flex !important; }
          .divider-col { display: block !important; }
        }
      `}</style>
    </div>
  );
}
