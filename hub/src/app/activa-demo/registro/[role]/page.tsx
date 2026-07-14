"use client";
import { useState } from "react";
import { useParams } from "next/navigation";

const CATEGORIES = [
  { id: "ropa", label: "Ropa y accesorios", emoji: "👗" },
  { id: "tech", label: "Tecnología", emoji: "📱" },
  { id: "cosmeticos", label: "Cosméticos y cuidado", emoji: "✨" },
  { id: "hogar", label: "Hogar y decoración", emoji: "🏠" },
];

export default function ActivaRegistroPage() {
  const { role } = useParams<{ role: string }>();
  const isSupplier = role === "supplier";

  const accent = isSupplier ? "#7C3AED" : "#F77F00";
  const accentLight = isSupplier ? "#F5F3FF" : "#FFF8F0";
  const accentBorder = isSupplier ? "#DDD6FE" : "#FED7AA";
  const roleLabel = isSupplier ? "Proveedor" : "Dropshipper";
  const roleEmoji = isSupplier ? "🏭" : "🛒";
  const categoryQuestion = isSupplier ? "¿Qué tipo de productos tienes?" : "¿Qué tipo de productos buscas?";

  const [step, setStep] = useState<1 | 2>(1);
  const [form, setForm] = useState({ name: "", whatsapp: "", email: "", category: "" });
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState<{ name: string } | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const submit = async () => {
    if (!form.name.trim() || !form.category) return;
    setSending(true);
    setErr(null);
    try {
      const res = await fetch("/api/activa-demo/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, whatsapp: form.whatsapp || null, email: form.email || null, role, category: form.category }),
      });
      const data = await res.json();
      if (data.ok) setDone({ name: data.name });
      else setErr(data.error ?? "Error al registrar");
    } catch {
      setErr("Error de conexión");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div style={{ minHeight: "100vh", background: accentLight, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 380, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 80, marginBottom: 8 }}>🚀</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 10 }}>
            ¡Listo, {done.name.split(" ")[0]}!
          </div>
          <div style={{ fontSize: 15, color: "#555", lineHeight: 1.7, marginBottom: 28 }}>
            Estás en el demo como <strong style={{ color: accent }}>{roleLabel}</strong>.
            {isSupplier
              ? " Cuando activemos Dropi Activa, te llegará una señal de demanda real."
              : " Cuando activemos Dropi Activa, te conectaremos con un proveedor."}
          </div>
          <div style={{ background: "#fff", border: `1px solid ${accentBorder}`, borderRadius: 14, padding: "16px 20px" }}>
            <div style={{ fontSize: 12, color: "#aaa", marginBottom: 4 }}>Dropi Activa · Demo en vivo</div>
            <div style={{ fontSize: 14, color: "#333", fontWeight: 600, lineHeight: 1.5 }}>
              Mira el dashboard en la pantalla grande 👆
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
          <img src="https://d39ru7awumhhs2.cloudfront.net/colombia/brands/1/logo/16951779761695177976GVUXDo6TWDrk6URjLWgAFjH65gE1D1c7MAfWNF6r.png" alt="Dropi" style={{ height: 24, width: "auto", marginBottom: 20 }} />
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: accentLight, border: `1px solid ${accentBorder}`, borderRadius: 99, padding: "6px 14px", marginBottom: 20 }}>
            <span style={{ fontSize: 16 }}>{roleEmoji}</span>
            <span style={{ fontSize: 12, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "1px" }}>{roleLabel}</span>
          </div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#111", marginBottom: 8 }}>Dropi Activa · Demo</div>
          <div style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>
            {isSupplier ? "Te conectamos con quien ya te está buscando." : "Encontramos el proveedor que necesitas."}
          </div>
        </div>

        {step === 1 && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 18, padding: "28px 24px", display: "grid", gap: 16 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#333", display: "block", marginBottom: 6 }}>Nombre <span style={{ color: accent }}>*</span></label>
              <input placeholder="Tu nombre" value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                style={{ width: "100%", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#111", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#333", display: "block", marginBottom: 6 }}>WhatsApp</label>
              <input placeholder="57 310 XXX XXXX" value={form.whatsapp} onChange={(e) => setForm(f => ({ ...f, whatsapp: e.target.value }))} type="tel"
                style={{ width: "100%", background: "#F9FAFB", border: "1px solid #E5E7EB", borderRadius: 10, padding: "12px 14px", fontSize: 15, color: "#111", outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={() => { if (form.name.trim()) setStep(2); }}
              disabled={!form.name.trim()}
              style={{ background: form.name.trim() ? accent : "#E5E7EB", border: "none", borderRadius: 12, padding: "16px", color: form.name.trim() ? "#fff" : "#aaa", fontSize: 16, fontWeight: 800, cursor: form.name.trim() ? "pointer" : "default" }}>
              Continuar →
            </button>
          </div>
        )}

        {step === 2 && (
          <div style={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 18, padding: "28px 24px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#111", marginBottom: 16 }}>{categoryQuestion}</div>
            <div style={{ display: "grid", gap: 10, marginBottom: 20 }}>
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                  style={{
                    display: "flex", alignItems: "center", gap: 12,
                    background: form.category === cat.id ? accentLight : "#F9FAFB",
                    border: `2px solid ${form.category === cat.id ? accent : "#E5E7EB"}`,
                    borderRadius: 12, padding: "14px 16px", cursor: "pointer", textAlign: "left",
                  }}>
                  <span style={{ fontSize: 24 }}>{cat.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: form.category === cat.id ? accent : "#333" }}>{cat.label}</span>
                  {form.category === cat.id && <span style={{ marginLeft: "auto", fontSize: 18, color: accent }}>✓</span>}
                </button>
              ))}
            </div>
            {err && <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8, padding: "10px 14px", fontSize: 13, color: "#DC2626", marginBottom: 12 }}>{err}</div>}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
              <button onClick={() => setStep(1)} style={{ background: "#F3F4F6", border: "none", borderRadius: 12, padding: "16px", color: "#555", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>← Volver</button>
              <button onClick={submit} disabled={!form.category || sending}
                style={{ background: form.category && !sending ? accent : "#E5E7EB", border: "none", borderRadius: 12, padding: "16px", color: form.category && !sending ? "#fff" : "#aaa", fontSize: 16, fontWeight: 800, cursor: form.category && !sending ? "pointer" : "default" }}>
                {sending ? "Registrando..." : `Registrarme →`}
              </button>
            </div>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: "#aaa" }}>
          Dropi Activa · Solo para el demo · No compartimos tu info
        </div>
      </div>
    </div>
  );
}
