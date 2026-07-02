"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Attendee = { id: string; name: string; role: string; category: string; token: string; match_id: string | null };

const CATEGORY_LABELS: Record<string, string> = { ropa: "Ropa y accesorios", tech: "Tecnología", cosmeticos: "Cosméticos y cuidado", hogar: "Hogar y decoración" };
const CATEGORY_EMOJIS: Record<string, string> = { ropa: "👗", tech: "📱", cosmeticos: "✨", hogar: "🏠" };
const CATEGORY_MOCK: Record<string, { product: string; priceRange: string; city: string; dispatch: string; stock: number; margin: number }> = {
  ropa: { product: "Blusas de lino premium · Camisetas oversize", priceRange: "$25.000 – $45.000", city: "Cali", dispatch: "48h", stock: 320, margin: 38 },
  tech: { product: "Audífonos TWS inalámbricos · Cargadores 65W", priceRange: "$35.000 – $65.000", city: "Bogotá", dispatch: "48h", stock: 150, margin: 42 },
  cosmeticos: { product: "Cremas hidratantes · Sérum con vitamina C", priceRange: "$18.000 – $38.000", city: "Medellín", dispatch: "48h", stock: 480, margin: 35 },
  hogar: { product: "Lámparas LED decorativas · Organizadores de cocina", priceRange: "$42.000 – $78.000", city: "Bogotá", dispatch: "48h", stock: 95, margin: 45 },
};

export default function DropshipperPortal() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    const fetchAttendee = async () => {
      const res = await fetch("/api/activa-demo/attendees");
      const all: Attendee[] = await res.json();
      const found = all.find((a) => a.token === token && a.role === "dropshipper");
      setAttendee(found ?? null);
      setLoading(false);
      if (found?.match_id) setPolling(false);
    };
    fetchAttendee();
  }, [token]);

  useEffect(() => {
    if (!polling) return;
    const t = setInterval(async () => {
      const res = await fetch("/api/activa-demo/attendees");
      const all: Attendee[] = await res.json();
      const found = all.find((a) => a.token === token);
      if (found?.match_id) { setAttendee(found); setPolling(false); }
    }, 2000);
    return () => clearInterval(t);
  }, [polling, token]);

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FFF8F0" }}><div style={{ fontSize: 40 }}>🔄</div></div>;

  if (!attendee) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FEF2F2", padding: 24 }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 12 }}>❌</div><div style={{ fontSize: 16, color: "#DC2626" }}>Link no válido</div></div>
    </div>
  );

  const cat = attendee.category;
  const catLabel = CATEGORY_LABELS[cat] ?? cat;
  const catEmoji = CATEGORY_EMOJIS[cat] ?? "📦";
  const mock = CATEGORY_MOCK[cat] ?? { product: "Productos varios", priceRange: "$20.000 – $50.000", city: "Colombia", dispatch: "48h", stock: 100, margin: 35 };
  const firstName = attendee.name.split(" ")[0];

  if (!attendee.match_id) {
    return (
      <div style={{ minHeight: "100vh", background: "#FFF8F0", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 8 }}>Estás registrado, {firstName}</div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7 }}>
            Cuando activemos Dropi Activa, te conectaremos con un proveedor en {catLabel}.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FFF8F0", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 22, width: "auto", marginBottom: 16 }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#F77F00", borderRadius: 99, padding: "6px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "1.5px" }}>🔍 Señal para ti</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 6 }}>Encontramos algo, {firstName}</div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
            Un proveedor verificado en tu categoría está disponible ahora. Sin contacto directo — todo por Dropi.
          </div>
        </div>

        {/* Supplier card (anonymous) */}
        <div style={{ background: "#fff", border: "2px solid #F77F00", borderRadius: 16, padding: "20px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 44, height: 44, background: "#FFF8F0", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{catEmoji}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#F77F00", textTransform: "uppercase", letterSpacing: "0.08em" }}>Proveedor verificado</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111" }}>{catLabel}</div>
            </div>
            <div style={{ marginLeft: "auto", background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 700, color: "#166534" }}>✓ Verificado</div>
          </div>

          <div style={{ background: "#FFF8F0", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#92400E", marginBottom: 6 }}>Productos disponibles</div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{mock.product}</div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Precio unitario", value: mock.priceRange },
              { label: "Margen aprox.", value: `${mock.margin}%` },
              { label: "Despacho", value: mock.dispatch },
            ].map(s => (
              <div key={s.label} style={{ background: "#F9FAFB", borderRadius: 8, padding: "10px 12px", textAlign: "center" }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: "#111", marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[`📍 ${mock.city}`, `📦 ${mock.stock} uds disponibles`, "✓ Responde en 24h"].map(tag => (
              <span key={tag} style={{ fontSize: 11, fontWeight: 600, color: "#555", background: "#F3F4F6", padding: "4px 10px", borderRadius: 99 }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Notice */}
        <div style={{ background: "#FFF8F0", border: "1px solid #FED7AA", borderRadius: 10, padding: "12px 14px", marginBottom: 16, fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
          🔒 El nombre y contacto del proveedor se protegen. La conversación sucede dentro de Dropi.
        </div>

        <button
          onClick={() => router.push(`/activa-demo/chat/${attendee.match_id}?role=dropshipper`)}
          style={{ width: "100%", background: "#F77F00", border: "none", borderRadius: 14, padding: "18px", color: "#fff", fontSize: 17, fontWeight: 800, cursor: "pointer", marginBottom: 12 }}>
          Iniciar conversación →
        </button>
        <div style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF" }}>
          Responde en WhatsApp o aquí — el proveedor ya está esperando
        </div>
      </div>
    </div>
  );
}
