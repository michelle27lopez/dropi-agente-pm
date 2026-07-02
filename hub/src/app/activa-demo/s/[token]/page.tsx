"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Attendee = { id: string; name: string; role: string; category: string; token: string; match_id: string | null };

const CATEGORY_LABELS: Record<string, string> = { ropa: "Ropa y accesorios", tech: "Tecnología", cosmeticos: "Cosméticos y cuidado", hogar: "Hogar y decoración" };
const CATEGORY_EMOJIS: Record<string, string> = { ropa: "👗", tech: "📱", cosmeticos: "✨", hogar: "🏠" };
const CATEGORY_STATS: Record<string, { dropshippers: number; week: string }> = {
  ropa: { dropshippers: 34, week: "esta semana" },
  tech: { dropshippers: 28, week: "esta semana" },
  cosmeticos: { dropshippers: 41, week: "esta semana" },
  hogar: { dropshippers: 19, week: "esta semana" },
};

export default function SupplierPortal() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [attendee, setAttendee] = useState<Attendee | null>(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(true);

  useEffect(() => {
    const fetchAttendee = async () => {
      const res = await fetch("/api/activa-demo/attendees");
      const all: Attendee[] = await res.json();
      const found = all.find((a) => a.token === token && a.role === "supplier");
      setAttendee(found ?? null);
      setLoading(false);
      if (found?.match_id) setPolling(false);
    };
    fetchAttendee();
  }, [token]);

  // Poll until match is assigned
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

  if (loading) return <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F5F3FF" }}><div style={{ fontSize: 40 }}>🔄</div></div>;

  if (!attendee) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FEF2F2", padding: 24 }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 48, marginBottom: 12 }}>❌</div><div style={{ fontSize: 16, color: "#DC2626" }}>Link no válido</div></div>
    </div>
  );

  const cat = attendee.category;
  const catLabel = CATEGORY_LABELS[cat] ?? cat;
  const catEmoji = CATEGORY_EMOJIS[cat] ?? "📦";
  const catStats = CATEGORY_STATS[cat] ?? { dropshippers: 20, week: "esta semana" };
  const firstName = attendee.name.split(" ")[0];

  if (!attendee.match_id) {
    return (
      <div style={{ minHeight: "100vh", background: "#F5F3FF", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#111", marginBottom: 8 }}>Estás en la lista, {firstName}</div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.7, marginBottom: 20 }}>
            Cuando activemos Dropi Activa te llegará tu señal de demanda. Mira el dashboard en la pantalla grande.
          </div>
          <div style={{ background: "#fff", border: "1px solid #DDD6FE", borderRadius: 12, padding: "14px 20px" }}>
            <div style={{ fontSize: 12, color: "#7C3AED", fontWeight: 700 }}>{catEmoji} {catLabel}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F5F3FF", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ maxWidth: 440, margin: "0 auto", padding: "32px 24px 60px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 22, width: "auto", marginBottom: 16 }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#7C3AED", borderRadius: 99, padding: "6px 16px", marginBottom: 16 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", textTransform: "uppercase", letterSpacing: "1.5px" }}>🚀 Dropi Activa</span>
          </div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 6 }}>Tu señal llegó, {firstName}</div>
          <div style={{ fontSize: 14, color: "#555", lineHeight: 1.6 }}>
            Dropi encontró demanda activa para tu categoría. La conversación sucede aquí — sin contactos directos.
          </div>
        </div>

        {/* Demand signal card */}
        <div style={{ background: "#fff", border: "2px solid #7C3AED", borderRadius: 16, padding: "20px", marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 28 }}>{catEmoji}</span>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.08em" }}>Señal de demanda</div>
              <div style={{ fontSize: 15, fontWeight: 800, color: "#111" }}>{catLabel}</div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {[
              { label: "Dropshippers activos", value: `${catStats.dropshippers}`, sub: catStats.week },
              { label: "Buscando proveedor", value: "1", sub: "Conectado ahora" },
            ].map(s => (
              <div key={s.label} style={{ background: "#F5F3FF", borderRadius: 10, padding: "12px 14px" }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: "#7C3AED", marginBottom: 2 }}>{s.value}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555" }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "#9CA3AF" }}>{s.sub}</div>
              </div>
            ))}
          </div>
          <div style={{ background: "#F5F3FF", borderRadius: 10, padding: "12px 14px", fontSize: 13, color: "#4C1D95", lineHeight: 1.5 }}>
            <strong>Un dropshipper verificado</strong> está interesado en tu categoría. No compartimos su contacto — la conversación sucede a través de Dropi.
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => router.push(`/activa-demo/chat/${attendee.match_id}?role=supplier`)}
          style={{ width: "100%", background: "#7C3AED", border: "none", borderRadius: 14, padding: "18px", color: "#fff", fontSize: 17, fontWeight: 800, cursor: "pointer", marginBottom: 12 }}>
          Iniciar conversación →
        </button>
        <div style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF" }}>
          La identidad se protege hasta que ambos acuerden compartirla
        </div>
      </div>
    </div>
  );
}
