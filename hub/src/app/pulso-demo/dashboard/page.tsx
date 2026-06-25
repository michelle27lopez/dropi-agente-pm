"use client";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type DashPhase = "qr" | "ready" | "detecting" | "sending" | "live";

type AcceptedEntry = { name: string; at: string; units?: number | null };

type Stats = {
  total: number;
  accepted: number;
  totalCommitted: number;
  session: { triggered_at: string; active: boolean } | null;
  acceptedAt: AcceptedEntry[];
};

type Product = {
  name: string;
  category: string;
  price_suggested: number;
  price_cost: number;
  stock: number;
  supplier_city: string;
  image_url: string;
};

type RegCount = { dropshippers: number; suppliers: number; total: number };

export default function PulsoDemoDashboard() {
  const [phase, setPhase] = useState<DashPhase>("qr");
  const [stats, setStats] = useState<Stats>({ total: 0, accepted: 0, totalCommitted: 0, session: null, acceptedAt: [] });
  const [product, setProduct] = useState<Product | null>(null);
  const [pulseAnim, setPulseAnim] = useState(false);
  const [newAccepted, setNewAccepted] = useState<string | null>(null);
  const [regCount, setRegCount] = useState<RegCount>({ dropshippers: 0, suppliers: 0, total: 0 });
  const [triggering, setTriggering] = useState(false);
  const [triggerDone, setTriggerDone] = useState(false);
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

  // Poll attendees for reg count (QR phase) + stats
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
            // Sesión ya existía antes de que abriera el dashboard → ir directo a live
            setPhase("live");
          } else {
            // Sesión apareció mientras estábamos en QR/Ready → animación cinemática
            setPhase("detecting");
            setTimeout(() => setPhase("sending"), 2200);
            setTimeout(() => setPhase("live"), 4000);
          }
        }
        if (!s.session) {
          sessionActive.current = false;
        }
        if (s.accepted > prevAccepted.current) {
          const newest = s.acceptedAt[s.acceptedAt.length - 1];
          if (newest) {
            setNewAccepted(newest.name.split(" ")[0]);
            setTimeout(() => setNewAccepted(null), 2500);
          }
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

  // Realtime via Supabase
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
              setTimeout(() => setPulseAnim(false), 600);
            }
            prevAccepted.current = s.accepted;
          }
        });
        // Refresh reg count
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
    setPhase("detecting");
    setTimeout(() => setPhase("sending"), 2200);
    setTimeout(() => setPhase("live"), 4000);
  };

  const margin = product
    ? Math.round((product.price_suggested - product.price_cost) * 100 / product.price_suggested)
    : 0;
  const projectedOrders = stats.totalCommitted > 0 ? stats.totalCommitted : stats.accepted * 12;
  const projectedGMV = projectedOrders * (product?.price_suggested ?? 89900);

  // ─────────────── QR PHASE ───────────────
  if (phase === "qr") {
    return (
      <div style={{
        minHeight: "100vh", background: "#FAFAFA",
        display: "flex", flexDirection: "column",
      }}>
        <style>{`@keyframes countPop { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }`}</style>

        {/* Top bar */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #E5E7EB",
          padding: "14px 40px", display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
              alt="Dropi" style={{ height: 24, width: "auto" }}
            />
            <div style={{ width: 1, height: 14, background: "#E5E7EB" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#F77F00", letterSpacing: "1px", textTransform: "uppercase" }}>
              ⚡ Pulso Demo
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: regCount.total > 0 ? "#F0FDF4" : "#F9FAFB",
            border: `1px solid ${regCount.total > 0 ? "#BBF7D0" : "#E5E7EB"}`,
            borderRadius: 99, padding: "6px 14px",
          }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10B981" }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#111" }}>
              {regCount.total} registrado{regCount.total !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Main QR area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px" }}>
          <div style={{ fontSize: 14, color: "#888", fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 }}>
            Escanea para unirte al demo
          </div>
          <div style={{ fontSize: 34, fontWeight: 900, color: "#111", marginBottom: 40, textAlign: "center" }}>
            ¿Eres Dropshipper o Proveedor?
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40, maxWidth: 700, width: "100%" }}>
            {/* Dropshipper QR */}
            <div style={{
              background: "#fff", border: "2px solid #FED7AA", borderRadius: 24,
              padding: "32px 28px", textAlign: "center",
              boxShadow: "0 4px 24px rgba(247,127,0,0.1)",
            }}>
              <div style={{
                display: "inline-block", background: "#FFF8F0", borderRadius: 12,
                padding: "6px 14px", marginBottom: 20,
              }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#F77F00", letterSpacing: "1px", textTransform: "uppercase" }}>
                  🛒 Dropshipper
                </span>
              </div>
              <div style={{
                border: "3px solid #FED7AA", borderRadius: 16, padding: 8,
                display: "inline-block", marginBottom: 16,
              }}>
                {baseUrl && (
                  <img src={qrDropshipper} alt="QR Dropshipper" style={{ width: 200, height: 200, display: "block" }} />
                )}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>
                Regístrate como Dropshipper
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                Vende productos y gana comisión por cada venta
              </div>
              <div style={{
                marginTop: 14, background: "#FFF8F0", borderRadius: 99, padding: "4px 12px",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#F77F00" }}>
                  {regCount.dropshippers}
                </span>
                <span style={{ fontSize: 12, color: "#888" }}>registrado{regCount.dropshippers !== 1 ? "s" : ""}</span>
              </div>
            </div>

            {/* Supplier QR */}
            <div style={{
              background: "#fff", border: "2px solid #BFDBFE", borderRadius: 24,
              padding: "32px 28px", textAlign: "center",
              boxShadow: "0 4px 24px rgba(37,99,235,0.1)",
            }}>
              <div style={{
                display: "inline-block", background: "#EFF6FF", borderRadius: 12,
                padding: "6px 14px", marginBottom: 20,
              }}>
                <span style={{ fontSize: 12, fontWeight: 800, color: "#2563EB", letterSpacing: "1px", textTransform: "uppercase" }}>
                  🏭 Proveedor
                </span>
              </div>
              <div style={{
                border: "3px solid #BFDBFE", borderRadius: 16, padding: 8,
                display: "inline-block", marginBottom: 16,
              }}>
                {baseUrl && (
                  <img src={qrSupplier} alt="QR Proveedor" style={{ width: 200, height: 200, display: "block" }} />
                )}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 6 }}>
                Regístrate como Proveedor
              </div>
              <div style={{ fontSize: 12, color: "#888", lineHeight: 1.5 }}>
                Pon tus productos frente a miles de dropshippers
              </div>
              <div style={{
                marginTop: 14, background: "#EFF6FF", borderRadius: 99, padding: "4px 12px",
                display: "inline-flex", alignItems: "center", gap: 6,
              }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: "#2563EB" }}>
                  {regCount.suppliers}
                </span>
                <span style={{ fontSize: 12, color: "#888" }}>registrado{regCount.suppliers !== 1 ? "s" : ""}</span>
              </div>
            </div>
          </div>

          {/* Next button */}
          <button
            onClick={() => setPhase("ready")}
            style={{
              marginTop: 48, background: "#F77F00", border: "none", borderRadius: 16,
              padding: "18px 48px", color: "#fff", fontSize: 18, fontWeight: 800,
              cursor: "pointer", boxShadow: "0 8px 24px rgba(247,127,0,0.3)",
              display: "flex", alignItems: "center", gap: 10,
            }}
          >
            Siguiente
            <span style={{ fontSize: 20 }}>→</span>
          </button>
        </div>
      </div>
    );
  }

  // ─────────────── READY PHASE ───────────────
  if (phase === "ready") {
    return (
      <div style={{
        minHeight: "100vh", background: "#FAFAFA",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden", position: "relative",
      }}>
        <style>{`
          @keyframes ring { 0% { transform: scale(0.8); opacity: 0.4; } 100% { transform: scale(2.8); opacity: 0; } }
          @keyframes breathe { 0%, 100% { opacity: 0.4; transform: scale(1); } 50% { opacity: 1; transform: scale(1.3); } }
          @keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        `}</style>

        {/* Pulsing rings */}
        {[0, 1, 2].map((i) => (
          <div key={i} style={{
            position: "absolute", width: 320, height: 320,
            border: "1px solid rgba(247,127,0,0.2)",
            borderRadius: "50%",
            animation: `ring 3s ${i * 1}s ease-out infinite`,
          }} />
        ))}

        {/* Back link */}
        <button
          onClick={() => setPhase("qr")}
          style={{
            position: "absolute", top: 24, left: 32,
            background: "none", border: "none", cursor: "pointer",
            fontSize: 14, color: "#888", fontWeight: 600,
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          ← Volver a QR
        </button>

        {/* Logo */}
        <div style={{ position: "relative", zIndex: 2, textAlign: "center" }}>
          <img
            src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
            alt="Dropi"
            style={{ height: 32, width: "auto", marginBottom: 28 }}
          />

          <div style={{ fontSize: 13, color: "#aaa", letterSpacing: "3px", textTransform: "uppercase", marginBottom: 10 }}>
            Sistema listo
          </div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#111", letterSpacing: "1px", lineHeight: 1 }}>
            Pulso en espera
          </div>

          {/* Registration counters */}
          <div style={{
            display: "flex", gap: 24, justifyContent: "center", marginTop: 28, marginBottom: 36,
            animation: "fadeUp 0.5s 0.2s ease both", opacity: 0,
          }}>
            <div style={{
              background: "#FFF8F0", border: "1px solid #FED7AA", borderRadius: 14,
              padding: "14px 24px", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#F77F00" }}>{regCount.dropshippers}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>dropshippers</div>
            </div>
            <div style={{
              background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 14,
              padding: "14px 24px", textAlign: "center",
            }}>
              <div style={{ fontSize: 36, fontWeight: 900, color: "#2563EB" }}>{regCount.suppliers}</div>
              <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>proveedores</div>
            </div>
          </div>

          {/* Trigger button */}
          <button
            onClick={triggerPulso}
            disabled={triggering || triggerDone}
            style={{
              background: triggering || triggerDone
                ? "#E5E7EB"
                : "linear-gradient(135deg, #F77F00, #E65C00)",
              border: "none", borderRadius: 18, padding: "20px 60px",
              color: triggering || triggerDone ? "#aaa" : "#fff",
              fontSize: 20, fontWeight: 900, cursor: triggering || triggerDone ? "default" : "pointer",
              letterSpacing: "1px", boxShadow: triggering || triggerDone ? "none" : "0 12px 40px rgba(247,127,0,0.4)",
              transition: "all 0.2s",
              animation: "fadeUp 0.5s 0.4s ease both", opacity: 0,
            }}
          >
            {triggering ? "⏳ Enviando..." : triggerDone ? "✓ Pulso enviado" : "⚡ Activar Pulso"}
          </button>

          <div style={{
            marginTop: 16, fontSize: 12, color: "#ccc",
            animation: "fadeUp 0.5s 0.6s ease both", opacity: 0,
          }}>
            Notifica a los {regCount.dropshippers} dropshippers registrados
          </div>

          {/* Breathing dot */}
          <div style={{
            width: 10, height: 10, background: "#F77F00", borderRadius: "50%",
            margin: "32px auto 0",
            animation: "breathe 2s ease-in-out infinite",
          }} />
        </div>
      </div>
    );
  }

  // ─────────────── DETECTING ───────────────
  if (phase === "detecting") {
    return (
      <div style={{
        minHeight: "100vh", background: "#040404",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
        <style>{`
          @keyframes reveal { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes glitch {
            0% { text-shadow: 2px 0 #F77F00, -2px 0 #00f0ff; }
            20% { text-shadow: -2px 0 #F77F00, 2px 0 #00f0ff; }
            40% { text-shadow: 2px 2px #F77F00, -2px -2px #00f0ff; }
            60% { text-shadow: none; }
            80% { text-shadow: -2px 0 #F77F00, 2px 0 #00f0ff; }
            100% { text-shadow: 2px 0 #F77F00, -2px 0 #00f0ff; }
          }
        `}</style>
        <div style={{ textAlign: "center", zIndex: 2, position: "relative" }}>
          <div style={{
            fontSize: 11, color: "#F77F00", letterSpacing: "8px",
            textTransform: "uppercase", marginBottom: 24,
            animation: "reveal 0.5s ease forwards",
          }}>
            Señal detectada
          </div>
          <div style={{
            fontSize: 72, fontWeight: 900, color: "#F77F00",
            letterSpacing: "4px", animation: "glitch 0.3s infinite, reveal 0.4s ease forwards",
            textTransform: "uppercase",
          }}>
            ⚡ PULSO
          </div>
          <div style={{
            fontSize: 28, fontWeight: 300, color: "#fff",
            marginTop: 8, letterSpacing: "8px", textTransform: "uppercase",
            animation: "reveal 0.6s 0.2s ease both",
          }}>
            DETECTADO
          </div>
          <div style={{ marginTop: 40, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
            {[
              { label: "Categoría", value: product?.category ?? "Fitness & Bienestar", delay: 0.5 },
              { label: "Señal externa", value: "+34% Google Trends · Colombia", delay: 0.8 },
              { label: "Stock disponible", value: `${product?.stock.toLocaleString("es-CO") ?? "820"} unidades · ${product?.supplier_city ?? "Medellín"}`, delay: 1.1 },
            ].map((row) => (
              <div key={row.label} style={{
                display: "flex", gap: 16, fontSize: 14,
                animation: `reveal 0.5s ${row.delay}s ease both`, opacity: 0,
              }}>
                <span style={{ color: "#555", minWidth: 130, textAlign: "right" }}>{row.label}</span>
                <span style={{ color: "#F77F00", fontWeight: 700 }}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────── SENDING ───────────────
  if (phase === "sending") {
    return (
      <div style={{
        minHeight: "100vh", background: "#040404",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      }}>
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#555", letterSpacing: "4px", textTransform: "uppercase", marginBottom: 16 }}>
            Matching en progreso
          </div>
          <div style={{ fontSize: 48, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
            Enviando notificaciones
          </div>
          <div style={{ fontSize: 15, color: "#F77F00", marginBottom: 40 }}>
            {regCount.dropshippers} dropshippers seleccionados por el sistema
          </div>
          <div style={{ width: 400, height: 4, background: "#1A1A1A", borderRadius: 99, overflow: "hidden" }}>
            <div style={{
              height: "100%", background: "#F77F00", borderRadius: 99,
              animation: "progress 1.5s ease forwards",
            }} />
          </div>
          <div style={{ fontSize: 12, color: "#444", marginTop: 12 }}>
            WhatsApp + Email · Personalizado por dropshipper
          </div>
        </div>
      </div>
    );
  }

  // ─────────────── LIVE ───────────────
  return (
    <div style={{ minHeight: "100vh", background: "#040404", color: "#fff", overflow: "hidden", position: "relative" }}>
      <style>{`
        @keyframes pop { 0% { transform: scale(1); } 50% { transform: scale(1.08); } 100% { transform: scale(1); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>

      {/* Toast de nueva aceptación */}
      {newAccepted && (
        <div style={{
          position: "fixed", top: 32, right: 32, zIndex: 100,
          background: "#14532d", border: "1px solid #4ade80",
          borderRadius: 14, padding: "14px 20px",
          display: "flex", alignItems: "center", gap: 10,
          animation: "slideIn 0.3s ease",
          boxShadow: "0 8px 32px rgba(74,222,128,0.3)",
        }}>
          <span style={{ fontSize: 20 }}>✅</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4ade80" }}>{newAccepted} aceptó</div>
            <div style={{ fontSize: 11, color: "#86efac" }}>Acaba de confirmar la campaña</div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", minHeight: "100vh" }}>
        {/* Panel izquierdo */}
        <div style={{
          display: "flex", flexDirection: "column", justifyContent: "center",
          padding: "60px 80px", borderRight: "1px solid #111",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <img
              src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
              alt="Dropi"
              style={{ height: 20, width: "auto", filter: "brightness(0) invert(1)", opacity: 0.7 }}
            />
            <span style={{ fontSize: 12, color: "#F77F00", letterSpacing: "4px", textTransform: "uppercase", fontWeight: 700 }}>
              ⚡ Pulso activo · {product?.category}
            </span>
          </div>

          <div style={{
            fontSize: 160, fontWeight: 900, lineHeight: 1, color: "#F77F00",
            animation: pulseAnim ? "pop 0.4s ease" : "none",
            fontVariantNumeric: "tabular-nums",
          }}>
            {stats.accepted}
          </div>
          <div style={{ fontSize: 20, color: "#555", marginTop: 8, marginBottom: 48 }}>
            de {stats.total} dropshippers confirmaron
          </div>

          <div style={{ marginBottom: 48 }}>
            <div style={{ height: 8, background: "#111", borderRadius: 99, overflow: "hidden" }}>
              <div style={{
                height: "100%", background: "linear-gradient(90deg, #F77F00, #FFB347)",
                borderRadius: 99,
                width: stats.total > 0 ? `${(stats.accepted / stats.total) * 100}%` : "0%",
                transition: "width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
              }} />
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 11, color: "#444" }}>0</span>
              <span style={{ fontSize: 11, color: "#F77F00", fontWeight: 700 }}>
                {stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0}% de participación
              </span>
              <span style={{ fontSize: 11, color: "#444" }}>{stats.total}</span>
            </div>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {Array.from({ length: stats.total }).map((_, i) => (
              <div key={i} style={{
                width: 40, height: 40, borderRadius: "50%",
                background: i < stats.accepted ? "#F77F00" : "#111",
                border: `2px solid ${i < stats.accepted ? "#F77F00" : "#1A1A1A"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14,
                transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
                boxShadow: i < stats.accepted ? "0 0 12px rgba(247,127,0,0.5)" : "none",
              }}>
                {i < stats.accepted ? "✓" : ""}
              </div>
            ))}
          </div>

          {stats.accepted > 0 && (
            <div style={{ marginTop: 40, display: "flex", gap: 24, animation: "fadeIn 0.5s ease" }}>
              {[
                { label: "Órdenes proyectadas", value: projectedOrders.toLocaleString("es-CO") },
                { label: "GMV estimado", value: `$${(projectedGMV / 1000000).toFixed(1)}M` },
              ].map((k) => (
                <div key={k.label}>
                  <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Panel derecho */}
        <div style={{ background: "#080808", display: "flex", flexDirection: "column", padding: "40px 28px" }}>
          {product && (
            <div style={{ marginBottom: 28 }}>
              {product.image_url && (
                <img src={product.image_url} alt={product.name}
                  style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginBottom: 14 }} />
              )}
              <div style={{ fontSize: 14, fontWeight: 700, color: "#fff" }}>{product.name}</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>{product.category} · {product.supplier_city}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12 }}>
                {[
                  { label: "Margen", value: `${margin}%` },
                  { label: "Stock", value: product.stock.toLocaleString("es-CO") },
                ].map((k) => (
                  <div key={k.label} style={{ background: "#111", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: "#F77F00" }}>{k.value}</div>
                    <div style={{ fontSize: 10, color: "#444" }}>{k.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ fontSize: 11, color: "#333", letterSpacing: "2px", textTransform: "uppercase", marginBottom: 12 }}>
            Confirmaciones en vivo
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
            {stats.acceptedAt.length === 0 && (
              <div style={{ fontSize: 13, color: "#222", textAlign: "center", paddingTop: 20 }}>
                Esperando confirmaciones...
              </div>
            )}
            {[...stats.acceptedAt].reverse().map((a, i) => (
              <div key={i} style={{
                background: "#111", borderRadius: 10, padding: "10px 14px",
                display: "flex", alignItems: "center", gap: 10,
                border: "1px solid #14532d",
                animation: i === 0 ? "slideIn 0.3s ease" : "none",
              }}>
                <div style={{
                  width: 28, height: 28, background: "#14532d", borderRadius: "50%",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12,
                }}>✓</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{a.name}</div>
                  <div style={{ fontSize: 10, color: "#444" }}>
                    {new Date(a.at).toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ borderTop: "1px solid #111", paddingTop: 16, marginTop: 16, textAlign: "center" }}>
            <div style={{ fontSize: 10, color: "#222", letterSpacing: "2px" }}>DROPI PULSO · MOTOR DE MATCHING</div>
          </div>
        </div>
      </div>
    </div>
  );
}
