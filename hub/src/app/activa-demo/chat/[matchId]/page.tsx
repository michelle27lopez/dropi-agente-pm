"use client";
import { useEffect, useRef, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type Message = { id: string; sender_role: string; content: string; created_at: string };

const ROLE_LABEL: Record<string, string> = { supplier: "Proveedor", dropshipper: "Dropshipper", ai: "" };
const ROLE_COLOR: Record<string, string> = { supplier: "#7C3AED", dropshipper: "#F77F00", ai: "#6B7280" };

const OPENING_MESSAGES: Record<string, Record<string, string>> = {
  supplier: {
    ropa: "Hola! Vi que hay interés en mi línea de ropa. Trabajo con blusas de lino y camisetas oversize, ¿qué tipo de productos te interesan más?",
    tech: "Hola, qué bueno que llegaste! Tengo audífonos TWS y accesorios de carga. ¿Qué categoría estás buscando principalmente?",
    cosmeticos: "Hola! Cuéntame qué tipo de productos de cuidado personal te interesan. Tengo cremas, sérums y línea natural.",
    hogar: "Hola! Me contaron que buscas productos de hogar. Tengo lámparas LED y organizadores con muy buena rotación. ¿Qué te llama más?",
  },
  dropshipper: {
    ropa: "Hola! Llevo varios meses vendiendo ropa online y estoy buscando un proveedor confiable. ¿Cuál es tu tiempo de despacho y tienes fotos del producto?",
    tech: "Buenas! Vendo accesorios tech y necesito un proveedor con stock constante. ¿Qué garantías manejas y cuál es el pedido mínimo?",
    cosmeticos: "Hola! Tengo clientes que siempre piden cremas y productos naturales. ¿Tienes algo con certificación o ingredientes naturales?",
    hogar: "Hola! Me interesa el tema de hogar, hay mucha demanda. ¿Cuánto tiempo llevas con estos productos y qué margen manejas normalmente?",
  },
};

export default function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const searchParams = useSearchParams();
  const userRole = searchParams.get("role") ?? "dropshipper";
  const otherRole = userRole === "supplier" ? "dropshipper" : "supplier";

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [category, setCategory] = useState<string>("ropa");
  const [aiTyping, setAiTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const aiTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastCountRef = useRef(0);

  const accent = userRole === "supplier" ? "#7C3AED" : "#F77F00";
  const accentLight = userRole === "supplier" ? "#F5F3FF" : "#FFF8F0";

  // Load match category
  useEffect(() => {
    fetch("/api/activa-demo/attendees").then(r => r.json()).then(() => {});
    // Get category from match
    fetch(`/api/activa-demo/chat/${matchId}`).then(r => r.json()).then((msgs: Message[]) => {
      if (msgs && msgs.length > 0) setMessages(msgs);
    });
    // Try to get category from URL or attendees
    const fetchCategory = async () => {
      const res = await fetch("/api/activa-demo/stats");
      // Simple approach: default to ropa, will be set correctly via messages
    };
    fetchCategory();
  }, [matchId]);

  // Poll messages
  useEffect(() => {
    const poll = async () => {
      const res = await fetch(`/api/activa-demo/chat/${matchId}`);
      const msgs: Message[] = await res.json();
      if (Array.isArray(msgs)) {
        setMessages(msgs);
        // If new messages from other side, cancel AI timer
        const otherMessages = msgs.filter(m => m.sender_role === otherRole || m.sender_role === "ai");
        if (otherMessages.length > lastCountRef.current) {
          lastCountRef.current = otherMessages.length;
          setAiTyping(false);
          if (aiTimerRef.current) { clearTimeout(aiTimerRef.current); aiTimerRef.current = null; }
        }
      }
    };
    const t = setInterval(poll, 1500);
    return () => clearInterval(t);
  }, [matchId, otherRole]);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, aiTyping]);

  // Send opening message if chat is empty after 1 second
  useEffect(() => {
    const timer = setTimeout(async () => {
      const res = await fetch(`/api/activa-demo/chat/${matchId}`);
      const msgs: Message[] = await res.json();
      if (!msgs || msgs.length === 0) {
        // AI sends opening message as the other role
        setAiTyping(true);
        await new Promise(r => setTimeout(r, 1500));
        await fetch("/api/activa-demo/ai-reply", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ matchId, userRole }),
        });
        setAiTyping(false);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [matchId, userRole]);

  const sendMessage = async () => {
    if (!input.trim() || sending) return;
    const text = input.trim();
    setInput("");
    setSending(true);

    await fetch(`/api/activa-demo/chat/${matchId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text, sender_role: userRole }),
    });
    setSending(false);

    // Schedule AI response after 5 seconds if no human response
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current);
    aiTimerRef.current = setTimeout(async () => {
      setAiTyping(true);
      await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
      await fetch("/api/activa-demo/ai-reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, userRole }),
      });
      setAiTyping(false);
      aiTimerRef.current = null;
    }, 5000);
  };

  const isMyMessage = (role: string) => role === userRole;
  const partnerLabel = otherRole === "supplier" ? "Proveedor" : "Dropshipper";

  return (
    <div style={{ height: "100dvh", display: "flex", flexDirection: "column", background: "#F8FAFC", fontFamily: "system-ui, sans-serif", maxWidth: 480, margin: "0 auto" }}>

      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 20px", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
        <div style={{ width: 40, height: 40, borderRadius: "50%", background: accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
          {otherRole === "supplier" ? "🏭" : "🛒"}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>{partnerLabel}</div>
          <div style={{ fontSize: 11, color: "#10B981", fontWeight: 600 }}>● Conectado via Dropi Activa</div>
        </div>
        <div style={{ background: "#F3F4F6", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#6B7280" }}>
          🔒 Identidad protegida
        </div>
      </div>

      {/* Info banner */}
      <div style={{ background: `${accent}12`, borderBottom: `1px solid ${accent}20`, padding: "8px 20px", fontSize: 12, color: "#555", textAlign: "center", flexShrink: 0 }}>
        Estás hablando como <strong style={{ color: accent }}>{ROLE_LABEL[userRole] || userRole}</strong> · Dropi es el canal de comunicación
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
        {messages.length === 0 && !aiTyping && (
          <div style={{ textAlign: "center", padding: "40px 20px" }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>💬</div>
            <div style={{ fontSize: 14, color: "#9CA3AF" }}>Iniciando conexión...</div>
          </div>
        )}

        {messages.map((msg) => {
          const isMine = isMyMessage(msg.sender_role);
          const isAi = msg.sender_role === "ai";
          return (
            <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", gap: 8, alignItems: "flex-end" }}>
              {!isMine && (
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, flexShrink: 0 }}>
                  {otherRole === "supplier" ? "🏭" : "🛒"}
                </div>
              )}
              <div style={{ maxWidth: "75%" }}>
                {!isMine && (
                  <div style={{ fontSize: 10, color: "#9CA3AF", marginBottom: 2, fontWeight: 600 }}>
                    {partnerLabel}{isAi ? "" : ""}
                  </div>
                )}
                <div style={{
                  background: isMine ? accent : "#fff",
                  color: isMine ? "#fff" : "#111",
                  borderRadius: isMine ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                  padding: "10px 14px",
                  fontSize: 14,
                  lineHeight: 1.5,
                  border: isMine ? "none" : "1px solid #E5E7EB",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                }}>
                  {msg.content}
                </div>
                <div style={{ fontSize: 10, color: "#C4C4C4", marginTop: 2, textAlign: isMine ? "right" : "left" }}>
                  {new Date(msg.created_at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            </div>
          );
        })}

        {/* AI typing indicator */}
        {aiTyping && (
          <div style={{ display: "flex", justifyContent: "flex-start", gap: 8, alignItems: "flex-end" }}>
            <div style={{ width: 28, height: 28, borderRadius: "50%", background: accentLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>
              {otherRole === "supplier" ? "🏭" : "🛒"}
            </div>
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: "18px 18px 18px 4px", padding: "12px 16px", display: "flex", gap: 4, alignItems: "center" }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#D1D5DB", animation: "bounce 1.2s infinite", animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{ background: "#fff", borderTop: "1px solid #E5E7EB", padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-end", flexShrink: 0 }}>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
          placeholder={`Escribe un mensaje...`}
          rows={1}
          style={{
            flex: 1, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 22,
            padding: "10px 16px", fontSize: 14, color: "#111", outline: "none", resize: "none",
            fontFamily: "inherit", lineHeight: 1.4, maxHeight: 120, overflowY: "auto",
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || sending}
          style={{
            width: 44, height: 44, borderRadius: "50%",
            background: input.trim() && !sending ? accent : "#E5E7EB",
            border: "none", cursor: input.trim() && !sending ? "pointer" : "default",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            transition: "background 0.2s",
          }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill={input.trim() && !sending ? "#fff" : "#aaa"}>
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
