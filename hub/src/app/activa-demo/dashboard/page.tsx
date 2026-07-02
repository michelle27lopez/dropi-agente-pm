"use client";
import { useEffect, useState } from "react";

type Stats = {
  suppliers: number;
  dropshippers: number;
  total: number;
  matched: number;
  activated: boolean;
  byCategory: Record<string, { suppliers: number; dropshippers: number }>;
};

const CATEGORY_LABELS: Record<string, string> = {
  ropa: "👗 Ropa y accesorios",
  tech: "📱 Tecnología",
  cosmeticos: "✨ Cosméticos",
  hogar: "🏠 Hogar y decoración",
};

export default function ActivaDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    const load = () => fetch("/api/activa-demo/stats").then(r => r.json()).then(s => setStats(s));
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, []);

  const activated = stats?.activated ?? false;
  const accentColor = "#7C3AED";

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0F", color: "#fff", fontFamily: "system-ui, sans-serif", display: "flex", flexDirection: "column" }}>

      {/* Top bar */}
      <div style={{ padding: "20px 40px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 22, filter: "brightness(0) invert(1)", opacity: 0.9 }} />
          <span style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: "0.05em" }}>·</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>Activa · Demo en vivo</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: activated ? "#10B981" : "#F59E0B", boxShadow: `0 0 12px ${activated ? "#10B981" : "#F59E0B"}` }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: activated ? "#10B981" : "#F59E0B" }}>
            {activated ? "DEMO ACTIVO — Matches en curso" : "ESPERANDO ACTIVACIÓN"}
          </span>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 60px", gap: 48 }}>

        {/* Headline */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: accentColor, textTransform: "uppercase", letterSpacing: "0.15em", marginBottom: 12 }}>
            Dropi Activa
          </div>
          <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 10 }}>
            {activated ? "Connecting" : "Registrándose"}
          </div>
          <div style={{ fontSize: 18, color: "rgba(255,255,255,0.45)", fontWeight: 400 }}>
            {activated ? "Tu primera negociación ya comenzó." : "Escanea el QR para unirte al demo"}
          </div>
        </div>

        {/* Counters */}
        <div style={{ display: "flex", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {[
            { label: "Proveedores", value: stats?.suppliers ?? 0, color: "#7C3AED", bg: "rgba(124,58,237,0.12)" },
            { label: "Dropshippers", value: stats?.dropshippers ?? 0, color: "#F77F00", bg: "rgba(247,127,0,0.12)" },
            { label: "Conectados", value: stats?.matched ?? 0, color: "#10B981", bg: "rgba(16,185,129,0.12)" },
          ].map((c) => (
            <div key={c.label} style={{ textAlign: "center", background: c.bg, border: `1px solid ${c.color}30`, borderRadius: 20, padding: "28px 44px" }}>
              <div style={{ fontSize: 72, fontWeight: 900, color: c.color, lineHeight: 1, letterSpacing: "-0.04em", marginBottom: 8 }}>
                {c.value}
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                {c.label}
              </div>
            </div>
          ))}
        </div>

        {/* By category */}
        {stats && Object.keys(stats.byCategory).length > 0 && (
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", maxWidth: 700 }}>
            {Object.entries(stats.byCategory).map(([cat, counts]) => (
              <div key={cat} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>{CATEGORY_LABELS[cat] ?? cat}</span>
                <span style={{ fontSize: 12, color: "#7C3AED", fontWeight: 700 }}>{counts.suppliers}P</span>
                <span style={{ fontSize: 12, color: "#F77F00", fontWeight: 700 }}>{counts.dropshippers}D</span>
              </div>
            ))}
          </div>
        )}

        {/* QR codes */}
        {!activated && baseUrl && (
          <div style={{ display: "flex", gap: 48, justifyContent: "center", flexWrap: "wrap" }}>
            {[
              {
                label: "Soy Proveedor",
                path: "/activa-demo/registro/supplier",
                color: "#7C3AED",
                colorHex: "7C3AED",
                emoji: "🏭",
              },
              {
                label: "Soy Dropshipper",
                path: "/activa-demo/registro/dropshipper",
                color: "#F77F00",
                colorHex: "F77F00",
                emoji: "🛒",
              },
            ].map((q) => {
              const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(baseUrl + q.path)}&color=${q.colorHex}&bgcolor=FFFFFF`;
              return (
                <div key={q.label} style={{ textAlign: "center" }}>
                  <div style={{ background: "#fff", borderRadius: 20, padding: 12, display: "inline-block", marginBottom: 14, boxShadow: `0 0 0 4px ${q.color}30` }}>
                    <img src={qrUrl} alt={`QR ${q.label}`} style={{ width: 200, height: 200, display: "block", borderRadius: 8 }} />
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: q.color, marginBottom: 4 }}>{q.emoji} {q.label}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{baseUrl}{q.path}</div>
                </div>
              );
            })}
          </div>
        )}

        {activated && (
          <div style={{ textAlign: "center", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 16, padding: "20px 40px" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#10B981", marginBottom: 4 }}>Los mensajes ya llegaron</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)" }}>Revisa tu WhatsApp · La conversación sucede aquí</div>
          </div>
        )}
      </div>
    </div>
  );
}
