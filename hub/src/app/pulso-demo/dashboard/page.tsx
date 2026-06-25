"use client";
import { useEffect, useState, useRef, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type DashPhase = "qr" | "ready" | "detecting" | "sending" | "live" | "success";

type AcceptedEntry = { name: string; at: string; units?: number | null };

type Stats = {
  total: number;
  accepted: number;
  totalCommitted: number;
  session: { triggered_at: string; active: boolean } | null;
  supplierAccepted: string | null;
  acceptedAt: AcceptedEntry[];
};

type Product = {
  name: string;
  category: string;
  price_suggested: number;
  price_cost: number;
  stock: number;
  supplier_city: string;
  supplier_name: string;
  image_url: string;
};

type RegCount = { dropshippers: number; suppliers: number; total: number };

type SuccessData = {
  accepted: number;
  totalCommitted: number;
  gmv: number;
  elapsed: number;
};

// Confetti colors and fixed positions (deterministic, no hydration issues)
const CONFETTI_ITEMS = [
  { color: "#F77F00", left: 8, delay: 0, dur: 3.2, rot: 45 },
  { color: "#10B981", left: 15, delay: 0.3, dur: 2.8, rot: 120 },
  { color: "#3B82F6", left: 22, delay: 0.6, dur: 3.5, rot: 60 },
  { color: "#8B5CF6", left: 30, delay: 0.1, dur: 2.6, rot: 200 },
  { color: "#EC4899", left: 38, delay: 0.8, dur: 3.1, rot: 30 },
  { color: "#F59E0B", left: 45, delay: 0.4, dur: 2.9, rot: 150 },
  { color: "#EF4444", left: 52, delay: 0.2, dur: 3.4, rot: 90 },
  { color: "#F77F00", left: 60, delay: 0.7, dur: 2.7, rot: 270 },
  { color: "#10B981", left: 68, delay: 0.5, dur: 3.0, rot: 180 },
  { color: "#3B82F6", left: 75, delay: 0.9, dur: 3.3, rot: 45 },
  { color: "#8B5CF6", left: 82, delay: 0.1, dur: 2.8, rot: 330 },
  { color: "#EC4899", left: 90, delay: 0.6, dur: 3.6, rot: 75 },
  { color: "#F59E0B", left: 5, delay: 1.2, dur: 2.5, rot: 110 },
  { color: "#F77F00", left: 18, delay: 1.5, dur: 3.8, rot: 240 },
  { color: "#EF4444", left: 27, delay: 1.1, dur: 2.9, rot: 15 },
  { color: "#10B981", left: 35, delay: 1.8, dur: 3.2, rot: 300 },
  { color: "#3B82F6", left: 43, delay: 1.3, dur: 2.6, rot: 135 },
  { color: "#8B5CF6", left: 55, delay: 1.6, dur: 3.0, rot: 195 },
  { color: "#F77F00", left: 63, delay: 1.0, dur: 3.7, rot: 60 },
  { color: "#EC4899", left: 72, delay: 1.4, dur: 2.7, rot: 225 },
  { color: "#F59E0B", left: 80, delay: 1.7, dur: 3.1, rot: 345 },
  { color: "#EF4444", left: 88, delay: 1.2, dur: 2.8, rot: 90 },
  { color: "#10B981", left: 12, delay: 2.0, dur: 3.4, rot: 170 },
  { color: "#3B82F6", left: 48, delay: 2.3, dur: 2.9, rot: 50 },
  { color: "#F77F00", left: 95, delay: 1.9, dur: 3.6, rot: 280 },
];

function formatElapsed(secs: number) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function PulsoDemoDashboard() {
  const [phase, setPhase] = useState<DashPhase>("qr");
  const [stats, setStats] = useState<Stats>({ total: 0, accepted: 0, totalCommitted: 0, session: null, supplierAccepted: null, acceptedAt: [] });
  const [product, setProduct] = useState<Product | null>(null);
  const [pulseAnim, setPulseAnim] = useState(false);
  const [newAccepted, setNewAccepted] = useState<string | null>(null);
  const [regCount, setRegCount] = useState<RegCount>({ dropshippers: 0, suppliers: 0, total: 0 });
  const [triggering, setTriggering] = useState(false);
  const [triggerDone, setTriggerDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [successData, setSuccessData] = useState<SuccessData | null>(null);
  const [closing, setClosing] = useState(false);
  const [closeError, setCloseError] = useState<string | null>(null);
  const prevAccepted = useRef(0);
  const sessionActive = useRef(false);
  const isFirstPoll = useRef(true);
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const qrDropshipper = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(baseUrl + "/pulso-demo/registro/dropshipper")}&color=F77F00&bgcolor=FFFFFF`;
  const qrSupplier = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(baseUrl + "/pulso-demo/registro/supplier")}&color=2563EB&bgcolor=FFFFFF`;

  useEffect(() => {
    fetch("/api/pulso-demo/product").then((r) => r.json()).then((p) => {
      if (p && !p.error) setProduct(p);
    });
  }, []);

  // Elapsed timer (live phase)
  useEffect(() => {
    if (phase !== "live") return;
    const interval = setInterval(() => {
      if (stats.session?.triggered_at) {
        setElapsed(Math.floor((Date.now() - new Date(stats.session.triggered_at).getTime()) / 1000));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, stats.session]);

  // Poll
  useEffect(() => {
    const pollAll = async () => {
      const [s, a] = await Promise.all([
        fetch("/api/pulso-demo/stats").then((r) => r.json()),
        fetch("/api/pulso-demo/attendees").then((r) => r.json()),
      ]);
      if (s) {
        setStats(s);
        if (s.session && !sessionActive.current) {
          sessionActive.current = true;
          if (isFirstPoll.current) {
            setPhase("live");
          } else {
            setPhase("detecting");
            setTimeout(() => setPhase("sending"), 2200);
            setTimeout(() => setPhase("live"), 4000);
          }
        }
        if (!s.session) sessionActive.current = false;
        if (s.accepted > prevAccepted.current) {
          const newest = s.acceptedAt[s.acceptedAt.length - 1];
          if (newest) {
            setNewAccepted(newest.name.split(" ")[0]);
            setTimeout(() => setNewAccepted(null), 2500);
          }
          setPulseAnim(true);
          setTimeout(() => setPulseAnim(false), 700);
        }
        prevAccepted.current = s.accepted;
        isFirstPoll.current = false;
      }
      if (Array.isArray(a)) {
        const ds = a.filter((x: { role?: string }) => x.role === "dropshipper" || !x.role).length;
        const sup = a.filter((x: { role?: string }) => x.role === "supplier").length;
        setRegCount({ dropshippers: ds, suppliers: sup, total: a.length });
      }
    };
    pollAll();
    const interval = setInterval(pollAll, 2000);
    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Realtime
  useEffect(() => {
    const channel = supabaseClient
      .channel("pulso-demo-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "pulso_demo_attendees" }, () => {
        fetch("/api/pulso-demo/stats").then((r) => r.json()).then((s) => {
          if (!s) return;
          setStats(s);
          if (s.accepted > prevAccepted.current) {
            const newest = s.acceptedAt[s.acceptedAt.length - 1];
            if (newest) {
              setNewAccepted(newest.name.split(" ")[0]);
              setTimeout(() => setNewAccepted(null), 2500);
              setPulseAnim(true);
              setTimeout(() => setPulseAnim(false), 700);
            }
            prevAccepted.current = s.accepted;
          }
        });
        fetch("/api/pulso-demo/attendees").then((r) => r.json()).then((a) => {
          if (Array.isArray(a)) {
            const ds = a.filter((x: { role?: string }) => x.role === "dropshipper" || !x.role).length;
            const sup = a.filter((x: { role?: string }) => x.role === "supplier").length;
            setRegCount({ dropshippers: ds, suppliers: sup, total: a.length });
          }
        });
      })
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "pulso_demo_sessions" }, () => {
        if (!sessionActive.current) {
          sessionActive.current = true;
          isFirstPoll.current = false;
          setPhase("detecting");
          setTimeout(() => setPhase("sending"), 2200);
          setTimeout(() => setPhase("live"), 4000);
        }
      })
      .subscribe();
    return () => { supabaseClient.removeChannel(channel); };
  }, []);

  const triggerPulso = async () => {
    setTriggering(true);
    await fetch("/api/pulso-demo/trigger", { method: "POST" });
    setTriggering(false);
    setTriggerDone(true);
    sessionActive.current = true;
    isFirstPoll.current = false;
    setPhase("detecting");
    setTimeout(() => setPhase("sending"), 2200);
    setTimeout(() => setPhase("live"), 4000);
  };

  const closeNegotiation = async () => {
    setCloseError(null);
    if (!stats.supplierAccepted) {
      setCloseError("El proveedor aún no ha aceptado las condiciones.");
      return;
    }
    setClosing(true);
    const res = await fetch("/api/pulso-demo/close", { method: "POST" });
    const data = await res.json();
    setClosing(false);
    if (!data.ok) {
      setCloseError(data.error ?? "Error al cerrar la negociación");
      return;
    }
    const committed = stats.totalCommitted > 0 ? stats.totalCommitted : stats.accepted * 12;
    const gmv = committed * (product?.price_suggested ?? 89900);
    setSuccessData({ accepted: stats.accepted, totalCommitted: committed, gmv, elapsed });
    setPhase("success");
  };

  const margin = product ? Math.round((product.price_suggested - product.price_cost) * 100 / product.price_suggested) : 0;
  const committed = stats.totalCommitted > 0 ? stats.totalCommitted : stats.accepted * 12;
  const gmv = committed * (product?.price_suggested ?? 89900);
  const stockPct = product && product.stock > 0 ? Math.min((committed / product.stock) * 100, 100) : 0;

  // ─── QR ───
  if (phase === "qr") {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", flexDirection: "column" }}>
        <style>{`@keyframes countPop { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }`}</style>
        <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 24 }} />
            <div style={{ width: 1, height: 14, background: "#E5E7EB" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F77F00", letterSpacing: "1px", textTransform: "uppercase" }}>⚡ Pulso Demo</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: regCount.total > 0 ? "#F0FDF4" : "#F9FAFB", border: `1px solid ${regCount.total > 0 ? "#BBF7D0" : "#E5E7EB"}`, borderRadius: 99, padding: "6px 14px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{regCount.total} registrado{regCount.total !== 1 ? "s" : ""}</span>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: 14, color: "#888", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>Escanea para unirte al demo</div>
          <div style={{ fontSize: 34, fontWeight: 900, color: "#111", marginBottom: 40, textAlign: "center" }}>¿Eres Dropshipper o Proveedor?</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 700, width: "100%" }}>
            <div style={{ background: "#fff", border: "2px solid #FED7AA", borderRadius: 24, padding: "32px 28px", textAlign: "center", boxShadow: "0 4px 24px rgba(247,127,0,0.1)" }}>
              <div style={{ display: "inline-block", background: "#FFF8F0", borderRadius: 12, padding: "6px 14px", marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#F77F00", letterSpacing: "1px", textTransform: "uppercase" }}>🛒 Dropshipper</span>
              </div>
              <div style={{ border: "3px solid #FED7AA", borderRadius: 16, padding: 8, display: "inline-block", marginBottom: 16 }}>
                {baseUrl && <img src={qrDropshipper} alt="QR" style={{ width: 200, height: 200, display: "block" }} />}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>Regístrate como Dropshipper</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>Vende productos y gana comisión</div>
              <div style={{ marginTop: 14, background: "#FFF8F0", borderRadius: 99, padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#F77F00" }}>{regCount.dropshippers}</span>
                <span style={{ fontSize: 12, color: "#888" }}>registrado{regCount.dropshippers !== 1 ? "s" : ""}</span>
              </div>
            </div>
            <div style={{ background: "#fff", border: "2px solid #BFDBFE", borderRadius: 24, padding: "32px 28px", textAlign: "center", boxShadow: "0 4px 24px rgba(37,99,235,0.1)" }}>
              <div style={{ display: "inline-block", background: "#EFF6FF", borderRadius: 12, padding: "6px 14px", marginBottom: 20 }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#2563EB", letterSpacing: "1px", textTransform: "uppercase" }}>🏭 Proveedor</span>
              </div>
              <div style={{ border: "3px solid #BFDBFE", borderRadius: 16, padding: 8, display: "inline-block", marginBottom: 16 }}>
                {baseUrl && <img src={qrSupplier} alt="QR" style={{ width: 200, height: 200, display: "block" }} />}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>Regístrate como Proveedor</div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>Pon productos frente a miles de dropshippers</div>
              <div style={{ marginTop: 14, background: "#EFF6FF", borderRadius: 99, padding: "4px 12px", display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#2563EB" }}>{regCount.suppliers}</span>
                <span style={{ fontSize: 12, color: "#888" }}>registrado{regCount.suppliers !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>
          <button onClick={() => setPhase("ready")} style={{ marginTop: 48, background: "#F77F00", border: "none", borderRadius: 16, padding: "18px 48px", color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 24px rgba(247,127,0,0.3)", display: "flex", alignItems: "center", gap: 10 }}>
            Siguiente <span style={{ fontSize: 20 }}>→</span>
          </button>
        </div>
      </div>
    );
  }

  // ─── READY ───
  if (phase === "ready") {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        <style>{`
          @keyframes ring { 0% { transform: scale(0.8); opacity: 0.4; } 100% { transform: scale(2.8); opacity: 0; } }
          @keyframes breathe { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>
        {[0, 1, 2].map((i) => (
          <div key={i} style={{ position: "absolute", width: 320, height: 320, border: "1px solid rgba(247,127,0,0.2)", borderRadius: "50%", animation: `ring 3s ${i * 1}s ease-out infinite` }} />
        ))}
        <button onClick={() => setPhase("qr")} style={{ position: "absolute", top: 24, left: 32, background: "none", border: "none", cursor: "pointer", fontSize: 14, color: "#888", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>← Volver a QR</button>
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 32, marginBottom: 28 }} />
          <div style={{ fontSize: 13, color: "#aaa", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 10 }}>Sistema listo</div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#111", letterSpacing: "1px", lineHeight: 1 }}>Pulso en espera</div>
          <div style={{ display: "flex", gap: 24, justifyContent: "center", marginTop: 28, marginBottom: 36, animation: "fadeUp 0.5s 0.2s ease both", opacity: 0 }}>
            <div style={{ background: "#FFF8F0", border: "1px solid #FED7AA", borderRadius: 14, padding: "14px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#F77F00" }}>{regCount.dropshippers}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>dropshippers</div>
            </div>
            <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14, padding: "14px 24px", textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#2563EB" }}>{regCount.suppliers}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>proveedores</div>
            </div>
          </div>
          <button onClick={triggerPulso} disabled={triggering || triggerDone} style={{ background: triggering || triggerDone ? "#E5E7EB" : "linear-gradient(135deg, #F77F00, #E65C00)", border: "none", borderRadius: 18, padding: "20px 60px", color: triggering || triggerDone ? "#aaa" : "#fff", fontSize: 20, fontWeight: 900, cursor: triggering || triggerDone ? "default" : "pointer", letterSpacing: "1px", boxShadow: triggering || triggerDone ? "none" : "0 12px 40px rgba(247,127,0,0.4)", animation: "fadeUp 0.5s 0.4s ease both", opacity: 0 }}>
            {triggering ? "⏳ Enviando..." : triggerDone ? "✓ Pulso enviado" : "⚡ Activar Pulso"}
          </button>
          <div style={{ marginTop: 16, fontSize: 12, color: "#ccc", animation: "fadeUp 0.5s 0.6s ease both", opacity: 0 }}>Notifica a los {regCount.dropshippers} dropshippers registrados</div>
          <div style={{ width: 10, height: 10, background: "#F77F00", borderRadius: "50%", margin: "32px auto 0", animation: "breathe 2s ease-in-out infinite" }} />
        </div>
      </div>
    );
  }

  // ─── DETECTING ───
  if (phase === "detecting") {
    return (
      <div style={{ minHeight: "100vh", background: "#040404", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`
          @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes glitch { 0% { text-shadow: 2px 0 #F77F00,-2px 0 #00f0ff; } 20% { text-shadow: -2px 0 #F77F00,2px 0 #00f0ff; } 40% { text-shadow: 2px 2px #F77F00,-2px -2px #00f0ff; } 60% { text-shadow: none; } 80% { text-shadow: -2px 0 #F77F00,2px 0 #00f0ff; } 100% { text-shadow: 2px 0 #F77F00,-2px 0 #00f0ff; } }
        `}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 11, color: "#F77F00", letterSpacing: "8px", textTransform: "uppercase", marginBottom: 24, animation: "reveal 0.5s ease forwards" }}>Señal detectada</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: "#F77F00", letterSpacing: "4px", animation: "glitch 0.3s infinite, reveal 0.4s ease forwards", textTransform: "uppercase" }}>⚡ PULSO</div>
          <div style={{ fontSize: 28, fontWeight: 300, color: "#fff", marginTop: 8, letterSpacing: "8px", textTransform: "uppercase", animation: "reveal 0.6s 0.2s ease both" }}>DETECTADO</div>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            {[
              { label: "Categoría", value: product?.category ?? "Fitness & Bienestar", delay: 0.5 },
              { label: "Señal externa", value: "+34% Google Trends · Colombia", delay: 0.8 },
              { label: "Stock disponible", value: `${product?.stock.toLocaleString("es-CO") ?? "820"} unidades · ${product?.supplier_city ?? "Medellín"}`, delay: 1.1 },
            ].map((row) => (
              <div key={row.label} style={{ display: "flex", gap: 16, fontSize: 14, animation: `reveal 0.5s ${row.delay}s ease both`, opacity: 0 }}>
                <span style={{ color: "#555", minWidth: 130, textAlign: "right" }}>{row.label}</span>
                <span style={{ color: "#F77F00", fontWeight: 700 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─── SENDING ───
  if (phase === "sending") {
    return (
      <div style={{ minHeight: "100vh", background: "#040404", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#555", letterSpacing: "4px", textTransform: "uppercase", marginBottom: 16 }}>Matching en progreso</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", marginBottom: 8 }}>Enviando notificaciones</div>
          <div style={{ fontSize: 15, color: "#F77F00", marginBottom: 40 }}>{regCount.dropshippers} dropshippers seleccionados</div>
          <div style={{ width: 400, height: 4, background: "#1A1A1A", borderRadius: 99, overflow: "hidden" }}>
            <div style={{ height: "100%", background: "#F77F00", borderRadius: 99, animation: "progress 1.5s ease forwards" }} />
          </div>
          <div style={{ fontSize: 12, color: "#444", marginTop: 12 }}>WhatsApp + Email · Personalizado por dropshipper</div>
        </div>
      </div>
    );
  }

  // ─── SUCCESS ───
  if (phase === "success" && successData) {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAFA", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        <style>{`
          @keyframes confettiFall { 0% { transform: translateY(-80px) rotate(0deg); opacity: 1; } 100% { transform: translateY(110vh) rotate(720deg); opacity: 0; } }
          @keyframes successPop { 0% { transform: scale(0.5); opacity: 0; } 70% { transform: scale(1.06); } 100% { transform: scale(1); opacity: 1; } }
          @keyframes cardIn { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes titleSlide { from { opacity: 0; transform: translateY(-16px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Confetti */}
        {CONFETTI_ITEMS.map((c, i) => (
          <div key={i} style={{
            position: "fixed", top: -60, left: `${c.left}%`,
            width: i % 3 === 0 ? 10 : 8, height: i % 3 === 0 ? 10 : 16,
            borderRadius: i % 2 === 0 ? "50%" : 2,
            background: c.color, zIndex: 1,
            animation: `confettiFall ${c.dur}s ${c.delay}s ease-in infinite`,
            transform: `rotate(${c.rot}deg)`,
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 2, textAlign: "center", padding: "40px 24px", maxWidth: 860, width: "100%" }}>

          {/* Logo */}
          <img
            src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
            alt="Dropi"
            style={{ height: 24, marginBottom: 28, animation: "cardIn 0.4s ease both", opacity: 0 }}
          />

          <div style={{ fontSize: 72, marginBottom: 4, animation: "successPop 0.6s 0.1s ease both", opacity: 0 }}>🎉</div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#111", lineHeight: 1.1, marginBottom: 6, animation: "titleSlide 0.5s 0.3s ease both", opacity: 0 }}>
            ¡Campaña <span style={{ color: "#F77F00" }}>Exitosa!</span>
          </div>
          <div style={{ fontSize: 15, color: "#888", marginBottom: 44, animation: "cardIn 0.4s 0.5s ease both", opacity: 0 }}>
            {product?.name} · {product?.category}
          </div>

          {/* Metric cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
            {[
              { emoji: "🛒", label: "Dropshippers", value: successData.accepted.toString(), color: "#F77F00", bg: "#FFF8F0", border: "#FED7AA", delay: "0.55s" },
              { emoji: "📦", label: "Órdenes comprometidas", value: successData.totalCommitted.toLocaleString("es-CO"), color: "#10B981", bg: "#F0FDF4", border: "#BBF7D0", delay: "0.7s" },
              { emoji: "💰", label: "GMV generado", value: `$${(successData.gmv / 1000000).toFixed(1)}M`, color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE", delay: "0.85s" },
              { emoji: "⏱", label: "Tiempo total", value: formatElapsed(successData.elapsed), color: "#7C3AED", bg: "#F5F3FF", border: "#DDD6FE", delay: "1.0s" },
            ].map((k) => (
              <div key={k.label} style={{
                background: k.bg, border: `2px solid ${k.border}`,
                borderRadius: 20, padding: "28px 16px", textAlign: "center",
                animation: `cardIn 0.5s ${k.delay} ease both`, opacity: 0,
                boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
              }}>
                <div style={{ fontSize: 34, marginBottom: 12 }}>{k.emoji}</div>
                <div style={{ fontSize: 38, fontWeight: 900, color: k.color, lineHeight: 1, marginBottom: 8, fontVariantNumeric: "tabular-nums" }}>{k.value}</div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.4, fontWeight: 600 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 14, justifyContent: "center", animation: "cardIn 0.5s 1.15s ease both", opacity: 0 }}>
            <button
              onClick={() => { setPhase("qr"); setSuccessData(null); setTriggerDone(false); }}
              style={{ background: "#F77F00", border: "none", borderRadius: 14, padding: "16px 36px", color: "#fff", fontSize: 15, fontWeight: 800, cursor: "pointer", boxShadow: "0 8px 28px rgba(247,127,0,0.35)" }}
            >
              ↺ Nueva demo
            </button>
            <a
              href="/pulso-demo/proveedor" target="_blank"
              style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 14, padding: "16px 36px", color: "#111", fontSize: 15, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}
            >
              Ver portal proveedor →
            </a>
          </div>

          <div style={{ marginTop: 32, fontSize: 11, color: "#ccc", letterSpacing: "2px", animation: "cardIn 0.5s 1.25s ease both", opacity: 0 }}>
            DROPI PULSO · MOTOR DE MATCHING DE CATÁLOGO
          </div>
        </div>
      </div>
    );
  }

  // ─── LIVE (modo claro, casino) ───
  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5", color: "#111", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes counterPop {
          0% { transform: scale(1); }
          40% { transform: scale(1.12); filter: drop-shadow(0 0 20px rgba(247,127,0,0.8)); }
          100% { transform: scale(1); filter: none; }
        }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tickUp {
          0% { transform: translateY(100%); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulseGlow {
          0%, 100% { box-shadow: 0 0 0 0 rgba(247,127,0,0); }
          50% { box-shadow: 0 0 0 8px rgba(247,127,0,0.15); }
        }
        @keyframes dotIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>

      {/* Toast nueva aceptación */}
      {newAccepted && (
        <div style={{ position: "fixed", top: 24, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: "#fff", border: "2px solid #10B981", borderRadius: 14, padding: "14px 24px", display: "flex", alignItems: "center", gap: 10, animation: "slideInUp 0.3s ease", boxShadow: "0 8px 32px rgba(16,185,129,0.25)" }}>
          <span style={{ fontSize: 22 }}>✅</span>
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: "#111" }}>{newAccepted} aceptó la campaña</div>
            <div style={{ fontSize: 12, color: "#888" }}>Señal registrada · Proveedor notificado</div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", minHeight: "100vh" }}>

        {/* ── Panel izquierdo ── */}
        <div style={{ background: "#fff", display: "flex", flexDirection: "column", padding: "36px 52px 36px", borderRight: "1px solid #E5E7EB" }}>

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 22 }} />
              <div style={{ width: 1, height: 14, background: "#E5E7EB" }} />
              <span style={{ fontSize: 12, color: "#F77F00", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 800 }}>⚡ PULSO ACTIVO</span>
            </div>
            {/* Timer */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "6px 14px" }}>
              <span style={{ fontSize: 12, color: "#888" }}>⏱</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: "#111", fontVariantNumeric: "tabular-nums" }}>{formatElapsed(elapsed)}</span>
            </div>
          </div>

          {/* Contador principal casino */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 4 }}>
              Dropshippers confirmados
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
              <div style={{
                fontSize: 140, fontWeight: 900, lineHeight: 1, color: "#F77F00",
                animation: pulseAnim ? "counterPop 0.7s ease" : "none",
                fontVariantNumeric: "tabular-nums",
                letterSpacing: "-4px",
              }}>
                {stats.accepted}
              </div>
              <div style={{ fontSize: 18, color: "#aaa", fontWeight: 500 }}>/ {stats.total}</div>
            </div>
            <div style={{ fontSize: 14, color: "#888", marginTop: 4 }}>
              {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}% de participación
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: 28 }}>
            <div style={{ height: 10, background: "#F3F4F6", borderRadius: 99, overflow: "hidden" }}>
              <div style={{ height: "100%", background: "linear-gradient(90deg, #F77F00, #FFB347)", borderRadius: 99, width: stats.total > 0 ? `${(stats.accepted / stats.total) * 100}%` : "0%", transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
            </div>
          </div>

          {/* Dots */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 36 }}>
            {Array.from({ length: stats.total }).map((_, i) => (
              <div key={i} style={{
                width: 44, height: 44, borderRadius: "50%",
                background: i < stats.accepted ? "#F77F00" : "#F3F4F6",
                border: `2px solid ${i < stats.accepted ? "#F77F00" : "#E5E7EB"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 16, color: "#fff",
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                animation: i === stats.accepted - 1 && pulseAnim ? "dotIn 0.5s ease" : "none",
                boxShadow: i < stats.accepted ? "0 4px 12px rgba(247,127,0,0.35)" : "none",
              }}>
                {i < stats.accepted ? "✓" : ""}
              </div>
            ))}
          </div>

          {/* Casino counters */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>

            {/* Stock counter */}
            <div style={{ background: "#FFF8F0", border: "1px solid #FED7AA", borderRadius: 16, padding: "20px 24px", animation: pulseAnim ? "pulseGlow 0.7s ease" : "none" }}>
              <div style={{ fontSize: 11, color: "#92400E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>📦 Stock comprometido</div>
              <div style={{ fontSize: 48, fontWeight: 900, color: "#F77F00", lineHeight: 1, fontVariantNumeric: "tabular-nums", overflow: "hidden" }}>
                <span style={{ display: "inline-block", animation: pulseAnim ? "tickUp 0.4s ease" : "none" }}>
                  {committed.toLocaleString("es-CO")}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#D97706", marginTop: 4 }}>de {product?.stock.toLocaleString("es-CO") ?? "—"} disponibles</div>
              <div style={{ marginTop: 10, height: 6, background: "#FEF3C7", borderRadius: 99, overflow: "hidden" }}>
                <div style={{ height: "100%", background: "#F77F00", borderRadius: 99, width: `${stockPct}%`, transition: "width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }} />
              </div>
              <div style={{ fontSize: 11, color: "#D97706", marginTop: 4 }}>{stockPct.toFixed(0)}% del stock</div>
            </div>

            {/* Revenue counter */}
            <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 16, padding: "20px 24px", animation: pulseAnim ? "pulseGlow 0.7s ease" : "none" }}>
              <div style={{ fontSize: 11, color: "#065F46", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>💰 GMV proyectado</div>
              <div style={{ fontSize: committed > 0 ? 36 : 48, fontWeight: 900, color: "#10B981", lineHeight: 1, fontVariantNumeric: "tabular-nums", overflow: "hidden" }}>
                <span style={{ display: "inline-block", animation: pulseAnim ? "tickUp 0.4s ease" : "none" }}>
                  ${(gmv / 1000000).toFixed(1)}M
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#059669", marginTop: 4 }}>COP · precio de venta sugerido</div>
              <div style={{ marginTop: 10, background: "#DCFCE7", borderRadius: 10, padding: "8px 12px" }}>
                <div style={{ fontSize: 11, color: "#065F46" }}>
                  Ganancia dropshippers: <strong>${((committed * (product?.price_suggested ?? 89900) - committed * (product?.price_cost ?? 52000)) / 1000000).toFixed(1)}M</strong>
                </div>
              </div>
            </div>
          </div>

          {/* Cerrar negociaciones */}
          <div style={{ marginTop: "auto" }}>
            {closeError && (
              <div style={{
                background: "#FEF2F2", border: "1px solid #FECACA",
                borderRadius: 10, padding: "10px 14px", marginBottom: 10,
                fontSize: 13, color: "#DC2626", display: "flex", alignItems: "center", gap: 8,
              }}>
                <span>🔒</span> {closeError}
              </div>
            )}
            <button
              onClick={closeNegotiation}
              disabled={closing || !stats.supplierAccepted}
              title={!stats.supplierAccepted ? "El proveedor aún no ha aceptado" : undefined}
              style={{
                width: "100%",
                background: closing
                  ? "#E5E7EB"
                  : !stats.supplierAccepted
                  ? "#F3F4F6"
                  : "linear-gradient(135deg, #111, #1a1a1a)",
                border: "none", borderRadius: 14, padding: "18px",
                color: closing || !stats.supplierAccepted ? "#aaa" : "#fff",
                fontSize: 15, fontWeight: 800,
                cursor: closing || !stats.supplierAccepted ? "not-allowed" : "pointer",
                boxShadow: !stats.supplierAccepted || closing ? "none" : "0 4px 20px rgba(0,0,0,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                transition: "all 0.2s",
              }}
            >
              {closing
                ? "⏳ Enviando kits..."
                : !stats.supplierAccepted
                ? "🔒 Esperando al proveedor..."
                : "🏁 Cerrar negociaciones y ver resultados"}
            </button>
            {!stats.supplierAccepted && (
              <div style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 6 }}>
                El proveedor debe aceptar las condiciones primero
              </div>
            )}
          </div>
        </div>

        {/* ── Panel derecho ── */}
        <div style={{ background: "#FAFAFA", display: "flex", flexDirection: "column" }}>

          {/* Producto imagen */}
          {product?.image_url && (
            <div style={{ position: "relative", overflow: "hidden" }}>
              <img src={product.image_url} alt={product.name} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.7))" }} />
              <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#fff", marginBottom: 2 }}>{product.name}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{product.category} · {product.supplier_city}</div>
              </div>
              <div style={{ position: "absolute", top: 12, right: 12, background: "#F77F00", borderRadius: 99, padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "#fff" }}>
                {margin}% margen
              </div>
            </div>
          )}

          <div style={{ padding: "16px 20px", flex: 1, display: "flex", flexDirection: "column" }}>

            {/* Estado del proveedor */}
            <div style={{
              background: stats.supplierAccepted ? "#F0FDF4" : "#FFF8F0",
              border: `1px solid ${stats.supplierAccepted ? "#BBF7D0" : "#FED7AA"}`,
              borderRadius: 10, padding: "10px 14px", marginBottom: 16,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>{stats.supplierAccepted ? "✅" : "⏳"}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: stats.supplierAccepted ? "#065F46" : "#92400E" }}>
                  {stats.supplierAccepted ? "Proveedor aceptó las condiciones" : "Esperando respuesta del proveedor"}
                </div>
                {stats.supplierAccepted && (
                  <div style={{ fontSize: 11, color: "#059669" }}>
                    {new Date(stats.supplierAccepted).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                )}
              </div>
            </div>

            {/* Lista confirmaciones */}
            <div style={{ fontSize: 10, color: "#aaa", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 10 }}>
              Confirmaciones en vivo
            </div>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
              {stats.acceptedAt.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
                  <div style={{ fontSize: 13, color: "#aaa", fontWeight: 600 }}>Esperando ofertas...</div>
                  <div style={{ fontSize: 12, color: "#ccc", marginTop: 4 }}>Los dropshippers están revisando la propuesta</div>
                </div>
              ) : (
                [...stats.acceptedAt].reverse().map((a, i) => (
                  <div key={i} style={{
                    background: "#fff", borderRadius: 10, padding: "10px 14px",
                    display: "flex", alignItems: "center", gap: 10,
                    border: "1px solid #E5E7EB",
                    animation: i === 0 ? "slideInRight 0.3s ease" : "none",
                    boxShadow: i === 0 ? "0 2px 12px rgba(0,0,0,0.06)" : "none",
                  }}>
                    <div style={{ width: 32, height: 32, background: "#F0FDF4", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0, border: "2px solid #BBF7D0" }}>
                      ✓
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>{a.name}</div>
                      <div style={{ fontSize: 11, color: "#aaa" }}>
                        {new Date(a.at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                      </div>
                    </div>
                    {a.units && a.units > 0 && (
                      <div style={{ background: "#FFF8F0", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 800, color: "#F77F00", flexShrink: 0 }}>
                        {a.units} und
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            <div style={{ paddingTop: 12, borderTop: "1px solid #E5E7EB", marginTop: 8, textAlign: "center" }}>
              <div style={{ fontSize: 10, color: "#ccc", letterSpacing: "2px" }}>DROPI PULSO · MOTOR DE MATCHING</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
