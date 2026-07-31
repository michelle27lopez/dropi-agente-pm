"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function RegistroPage() {
  const { role } = useParams<{ role: string }>();
  const isDropshipper = role !== "supplier";

  const [form, setForm] = useState({ name: "", whatsapp: "", email: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ name: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const accent = isDropshipper ? "#F77F00" : "#2563EB";
  const accentLight = isDropshipper ? "#FFF8F0" : "#EFF6FF";
  const accentBorder = isDropshipper ? "#FED7AA" : "#BFDBFE";
  const roleLabel = isDropshipper ? "Dropshipper" : "Proveedor";
  const roleEmoji = isDropshipper ? "🛒" : "🏭";
  const roleDesc = isDropshipper
    ? "Vende productos en tus canales y gana comisión por cada venta"
    : "Pon tus productos en el catálogo de miles de dropshippers";

  const submit = async () => {
    if (!form.name.trim()) return;
    setSending(true);
    setErr(null);
    try {
      const res = await fetch("/api/pulso-demo/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, whatsapp: form.whatsapp || null, email: form.email || null, role }),
      });
      const data = await res.json();
      if (data.ok) {
        setDone({ name: data.name });
      } else {
        setErr(data.error ?? "Error al registrar");
      }
    } catch {
      setErr("Error de conexión");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div style={{
        minHeight: "100vh", background: accentLight,
        display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
      }}>
        <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 80, marginBottom: 8 }}>✅</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#111", marginBottom: 10 }}>
            ¡Listo, {done.name.split(" ")[0]}!
          </div>
          <div style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 28 }}>
            Estás registrado como <strong style={{ color: accent }}>{roleLabel}</strong>.
            {isDropshipper
              ? " Cuando el Pulso se active, recibirás una notificación con tu oferta personalizada."
              : " El sistema te notificará cuando haya demanda confirmada para tus productos."}
          </div>
          <div style={{
            background: "#fff", border: `1px solid ${accentBorder}`,
            borderRadius: 14, padding: "16px 20px",
          }}>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>Dropi Pulso · Demo en vivo</div>
            <div style={{ fontSize: 14, color: "#333", fontWeight: 600, lineHeight: 1.5 }}>
              Mira el dashboard en la pantalla grande mientras tanto 👆
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAFA" }}>
      <div style={{ maxWidth: 420, margin: "0 auto", padding: "32px 24px 60px" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <img
            src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png"
            alt="Dropi"
            style={{ height: 24, width: "auto", marginBottom: 20 }}
          />
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: accentLight, border: `1px solid ${accentBorder}`,
            borderRadius: 99, padding: "6px 14px", marginBottom: 20,
          }}>
            <span style={{ fontSize: 16 }}>{roleEmoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px" }}>
              {roleLabel}
            </span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 8 }}>
            Únete al demo
          </div>
          <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
            {roleDesc}
          </div>
        </div>

        <div style={{
          background: "#fff", border: "1px solid #E5E7EB",
          borderRadius: 18, padding: "28px 24px", display: "grid", gap: 16,
        }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#333", display: "block", marginBottom: 6 }}>
              Nombre <span style={{ color: accent }}>*</span>
            </label>
            <input
              placeholder="Tu nombre"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={{
                width: "100%", background: "#F9FAFB", border: "1px solid #E5E7EB",
                borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#111",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#333", display: "block", marginBottom: 6 }}>
              WhatsApp
            </label>
            <input
              placeholder="57 310 XXX XXXX"
              value={form.whatsapp}
              onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
              type="tel"
              style={{
                width: "100%", background: "#F9FAFB", border: "1px solid #E5E7EB",
                borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#111",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 700, color: "#333", display: "block", marginBottom: 6 }}>
              Email
            </label>
            <input
              placeholder="tu@correo.com"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              type="email"
              style={{
                width: "100%", background: "#F9FAFB", border: "1px solid #E5E7EB",
                borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#111",
                outline: "none", boxSizing: "border-box",
              }}
            />
          </div>

          {err && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626" }}>
              {err}
            </div>
          )}

          <button
            onClick={submit}
            disabled={sending || !form.name.trim()}
            style={{
              background: form.name.trim() && !sending ? accent : "#E5E7EB",
              border: "none", borderRadius: 12, padding: "16px",
              color: form.name.trim() && !sending ? "#fff" : "#aaa",
              fontSize: 16, fontWeight: 800, cursor: form.name.trim() && !sending ? "pointer" : "default",
              transition: "all 0.2s",
            }}
          >
            {sending ? "Registrando..." : `Registrarme como ${roleLabel} →`}
          </button>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#aaa" }}>
          Dropi Pulso · Solo para el demo · No compartimos tu info
        </div>
      </div>
    </div>
  );
}
