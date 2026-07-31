"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Product = {
  name: string;
  category: string;
  price_cost: number;
  price_suggested: number;
  stock: number;
  supplier_name: string;
  supplier_city: string;
  image_url: string;
  description: string;
};

type Phase = "loading" | "offer" | "accepted" | "already" | "invalid";

const UNIT_OPTIONS = [50, 100, 300, 500];

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80";

const SIGNALS = [
  {
    icon: "📈",
    stat: "+34%",
    label: "Señal de demanda",
    detail: "Google Trends Colombia esta semana",
    bg: "#FFF8F0",
    border: "#FDDCB5",
    color: "#D95F00",
  },
  {
    icon: "🎯",
    stat: "Match",
    label: "Tu perfil coincide",
    detail: "Historial en Fitness & Bienestar",
    bg: "#EFF6FF",
    border: "#BFDBFE",
    color: "#1D4ED8",
  },
  {
    icon: "⚡",
    stat: "Top 10",
    label: "Acceso anticipado",
    detail: "Seleccionado antes que otros dropshippers",
    bg: "#F5F3FF",
    border: "#DDD6FE",
    color: "#6D28D9",
  },
  {
    icon: "💰",
    stat: "42%",
    label: "Margen por encima",
    detail: "Promedio de categoría: 28%",
    bg: "#F0FDF4",
    border: "#BBF7D0",
    color: "#15803D",
  },
];

function DropiLogo() {
  return (
    <img
      src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
      alt="Dropi"
      style={{ height: 26, width: "auto", objectFit: "contain" }}
    />
  );
}

export default function AttendeeOfferPage() {
  const params = useParams();
  const token = params?.token as string;

  const [phase, setPhase] = useState<Phase>("loading");
  const [product, setProduct] = useState<Product | null>(null);
  const [name, setName] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [selectedUnits, setSelectedUnits] = useState<number | null>(null);

  useEffect(() => {
    if (!token) return;
    fetch("/api/pulso-demo/product")
      .then((r) => r.json())
      .then((p) => { if (p && !p.error) setProduct(p); });

    fetch("/api/pulso-demo/attendees")
      .then((r) => r.json())
      .then((list) => {
        if (Array.isArray(list)) {
          const found = list.find((a: { token: string; name: string; accepted_at: string | null }) => a.token === token);
          if (found) {
            setName(found.name);
            setPhase(found.accepted_at ? "already" : "offer");
          } else {
            setPhase("offer");
          }
        }
      });
  }, [token]);

  const accept = async () => {
    if (!selectedUnits) return;
    setAccepting(true);
    const res = await fetch("/api/pulso-demo/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, committed_units: selectedUnits }),
    });
    const data = await res.json();
    setAccepting(false);
    if (data.ok) {
      if (data.name) setName(data.name);
      setPhase(data.already ? "already" : "accepted");
    } else {
      setPhase("invalid");
    }
  };

  const margin = product
    ? Math.round((product.price_suggested - product.price_cost) * 100 / product.price_suggested)
    : 0;
  const profit = product ? product.price_suggested - product.price_cost : 0;
  const productImage = product?.image_url || FALLBACK_IMAGE;

  if (phase === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#F77F00", fontSize: 12, letterSpacing: "3px", textTransform: "uppercase" }}>
          Cargando...
        </div>
      </div>
    );
  }

  if (phase === "invalid") {
    return (
      <div style={{ minHeight: "100vh", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <DropiLogo />
          <div style={{ fontSize: 36, marginTop: 32, marginBottom: 12 }}>⚠️</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#111" }}>Link no válido</div>
        </div>
      </div>
    );
  }

  if (phase === "accepted" || phase === "already") {
    return (
      <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
        {/* Header */}
        <div style={{
          background: "#fff", borderBottom: "1px solid #E5E7EB",
          padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <DropiLogo />
          <span style={{
            background: "#FFF3E0", border: "1px solid #FDDCB5",
            borderRadius: 20, padding: "4px 12px",
            fontSize: 11, color: "#F77F00", fontWeight: 700, letterSpacing: "1px",
          }}>⚡ PULSO ACTIVO</span>
        </div>

        <div style={{ maxWidth: 440, margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#15803D", marginBottom: 10 }}>
            ¡Confirmado{name ? `, ${name.split(" ")[0]}` : ""}!
          </div>
          <div style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.7, marginBottom: 32 }}>
            Tu compromiso de <strong style={{ color: "#111" }}>{selectedUnits ?? "—"} unidades</strong> ya viajó al proveedor.
            El equipo de Dropi coordina los siguientes pasos.
          </div>
          {product && (
            <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 16, padding: "24px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 16 }}>{product.name}</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Tu margen", value: `${margin}%`, color: "#F77F00" },
                  { label: "Ganancia/u", value: `$${profit.toLocaleString("es-CO")}`, color: "#111" },
                  { label: "Comprometiste", value: `${selectedUnits ?? "—"} und`, color: "#F77F00" },
                  { label: "Potencial", value: selectedUnits ? `$${(selectedUnits * profit).toLocaleString("es-CO")}` : "—", color: "#111" },
                ].map((k) => (
                  <div key={k.label} style={{ background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "14px" }}>
                    <div style={{ fontSize: 18, fontWeight: 900, color: k.color }}>{k.value}</div>
                    <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>{k.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ fontSize: 11, color: "#D1D5DB", marginTop: 24 }}>Dropi Pulso · Motor de matching</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>

      {/* Header */}
      <div style={{
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <DropiLogo />
        <div style={{
          background: "#FFF3E0", border: "1px solid #FDDCB5",
          borderRadius: 20, padding: "4px 12px",
          fontSize: 11, color: "#F77F00", fontWeight: 700, letterSpacing: "1px",
        }}>
          ⚡ PULSO ACTIVO
        </div>
      </div>

      <div style={{ maxWidth: 440, margin: "0 auto", padding: "24px 20px 100px" }}>

        {/* Contexto del rol */}
        <div style={{
          background: "#FFF8F0", border: "1px solid #FDDCB5",
          borderRadius: 12, padding: "14px 16px", marginBottom: 24,
          display: "flex", gap: 10, alignItems: "flex-start",
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>🎭</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#C2410C", marginBottom: 3 }}>
              En este ejercicio, tú eres un dropshipper de Dropi
            </div>
            <div style={{ fontSize: 12, color: "#9A3412", lineHeight: 1.5 }}>
              El sistema de Pulso te eligió porque tu perfil coincide con esta oportunidad.
              Revisa la oferta y decide si quieres participar.
            </div>
          </div>
        </div>

        {/* Saludo */}
        {name && (
          <div style={{ fontSize: 24, fontWeight: 900, color: "#111827", marginBottom: 4 }}>
            Hola, {name.split(" ")[0]} 👋
          </div>
        )}
        <div style={{ fontSize: 14, color: "#6B7280", marginBottom: 20 }}>
          El Pulso detectó una oportunidad en tu categoría
        </div>

        {/* Imagen del producto */}
        <div style={{ borderRadius: 16, overflow: "hidden", marginBottom: 20, position: "relative", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <img
            src={productImage}
            alt={product?.name ?? "Producto"}
            style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 55%)",
          }} />
          <div style={{ position: "absolute", top: 12, left: 12 }}>
            <span style={{
              background: "#F77F00", color: "#fff",
              fontSize: 10, fontWeight: 800, padding: "4px 10px",
              borderRadius: 20, letterSpacing: "1px", textTransform: "uppercase",
            }}>
              Acceso anticipado
            </span>
          </div>
          <div style={{ position: "absolute", bottom: 14, left: 16, right: 16 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>{product?.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>
              {product?.category} · {product?.supplier_city}
            </div>
          </div>
        </div>

        {/* Métricas */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
          {[
            { label: "Margen", value: `${margin}%`, sub: "Por unidad", highlight: true },
            { label: "Tu ganancia", value: `$${profit.toLocaleString("es-CO")}`, sub: "Por unidad", highlight: false },
            { label: "Stock", value: product?.stock.toLocaleString("es-CO") ?? "—", sub: "Disponible", highlight: false },
          ].map((k) => (
            <div key={k.label} style={{
              background: "#fff",
              border: `1.5px solid ${k.highlight ? "#FDDCB5" : "#E5E7EB"}`,
              borderRadius: 12, padding: "14px 10px", textAlign: "center",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 20, fontWeight: 900, color: k.highlight ? "#F77F00" : "#111827" }}>
                {k.value}
              </div>
              <div style={{ fontSize: 10, color: "#6B7280", marginTop: 3, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                {k.label}
              </div>
            </div>
          ))}
        </div>

        {/* Señales del sistema */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "2px", marginBottom: 12 }}>
            Por qué el sistema te eligió
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {SIGNALS.map((s) => (
              <div key={s.label} style={{
                background: s.bg,
                border: `1px solid ${s.border}`,
                borderRadius: 14, padding: "16px 14px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
              }}>
                <div style={{ fontSize: 20, marginBottom: 8 }}>{s.icon}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>
                  {s.stat}
                </div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#111827", marginBottom: 3 }}>
                  {s.label}
                </div>
                <div style={{ fontSize: 10, color: "#6B7280", lineHeight: 1.4 }}>
                  {s.detail}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selector de unidades */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: "#111827", marginBottom: 4 }}>
            ¿Cuántas unidades podrías mover?
          </div>
          <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 14 }}>
            Tu compromiso viaja al proveedor y define el tamaño de la campaña
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {UNIT_OPTIONS.map((u) => {
              const selected = selectedUnits === u;
              const revenue = u * profit;
              return (
                <button
                  key={u}
                  onClick={() => setSelectedUnits(u)}
                  style={{
                    background: selected ? "#FFF3E0" : "#fff",
                    border: `2px solid ${selected ? "#F77F00" : "#E5E7EB"}`,
                    borderRadius: 14, padding: "16px 12px",
                    cursor: "pointer", textAlign: "center",
                    transition: "all 0.15s",
                    boxShadow: selected ? "0 0 0 3px rgba(247,127,0,0.12)" : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <div style={{ fontSize: 24, fontWeight: 900, color: selected ? "#F77F00" : "#111827" }}>
                    {u === 500 ? "500+" : u}
                  </div>
                  <div style={{ fontSize: 10, color: selected ? "#C2410C" : "#6B7280", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    unidades
                  </div>
                  <div style={{
                    marginTop: 8, fontSize: 12, fontWeight: 700,
                    color: selected ? "#F77F00" : "#9CA3AF",
                  }}>
                    ${revenue.toLocaleString("es-CO")}
                  </div>
                  <div style={{ fontSize: 9, color: "#9CA3AF" }}>potencial</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={accept}
          disabled={!selectedUnits || accepting}
          style={{
            width: "100%",
            background: selectedUnits && !accepting
              ? "linear-gradient(135deg, #F77F00 0%, #E65C00 100%)"
              : "#F3F4F6",
            border: "none",
            borderRadius: 16, padding: "20px",
            cursor: selectedUnits && !accepting ? "pointer" : "default",
            fontSize: 16, fontWeight: 900,
            color: selectedUnits ? "#fff" : "#9CA3AF",
            transition: "all 0.2s",
            boxShadow: selectedUnits ? "0 8px 24px rgba(247,127,0,0.35)" : "none",
            marginBottom: 12,
          }}
        >
          {accepting
            ? "Confirmando..."
            : selectedUnits
              ? `Confirmar ${selectedUnits} unidades →`
              : "Selecciona cuántas unidades movería"}
        </button>

        {selectedUnits && (
          <div style={{ textAlign: "center", fontSize: 13, color: "#6B7280" }}>
            Potencial estimado:{" "}
            <span style={{ color: "#F77F00", fontWeight: 800 }}>
              ${(selectedUnits * profit).toLocaleString("es-CO")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
