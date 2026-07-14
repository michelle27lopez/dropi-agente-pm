"use client";
import { useEffect, useState, useRef } from "react";

type Attendee = {
  id: string;
  name: string;
  email: string | null;
  whatsapp: string | null;
  token: string;
  accepted_at: string | null;
  role?: string;
};

type Product = {
  name: string;
  category: string;
  price_cost: number;
  price_suggested: number;
  margin_pct: number;
  stock: number;
  supplier_name: string;
  supplier_city: string;
  image_url: string;
};

type Stats = {
  accepted: number;
  total: number;
  session: { triggered_at: string; active: boolean } | null;
};

const BASE = process.env.NEXT_PUBLIC_BASE_URL ?? "";

export default function PulsoDemoAdmin() {
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [stats, setStats] = useState<Stats>({ accepted: 0, total: 0, session: null });
  const [form, setForm] = useState({ name: "", email: "", whatsapp: "" });
  const [editProduct, setEditProduct] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [triggering, setTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const load = async () => {
    const [a, p, s] = await Promise.all([
      fetch("/api/pulso-demo/attendees").then((r) => r.json()),
      fetch("/api/pulso-demo/product").then((r) => r.json()),
      fetch("/api/pulso-demo/stats").then((r) => r.json()),
    ]);
    if (Array.isArray(a)) setAttendees(a);
    if (p && !p.error) { setProduct(p); setProductForm(p); }
    if (s) setStats(s);
  };

  useEffect(() => {
    load();
    intervalRef.current = setInterval(() => {
      fetch("/api/pulso-demo/stats").then((r) => r.json()).then((s) => { if (s) setStats(s); });
    }, 2000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const addAttendee = async () => {
    if (!form.name.trim()) return;
    const res = await fetch("/api/pulso-demo/attendees", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!data.error) {
      setAttendees((prev) => [...prev, data]);
      setForm({ name: "", email: "", whatsapp: "" });
    }
  };

  const removeAttendee = async (id: string) => {
    await fetch("/api/pulso-demo/attendees", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setAttendees((prev) => prev.filter((a) => a.id !== id));
  };

  const saveProduct = async () => {
    const res = await fetch("/api/pulso-demo/product", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productForm),
    });
    const data = await res.json();
    if (!data.error) { setProduct(data); setEditProduct(false); }
  };

  const triggerPulso = async () => {
    setTriggering(true);
    setTriggerResult(null);
    const res = await fetch("/api/pulso-demo/trigger", { method: "POST" });
    const data = await res.json();
    setTriggering(false);
    if (data.ok) {
      setTriggerResult(`✓ Pulso activado — ${data.sent}/${data.total} notificaciones enviadas`);
      load();
    } else {
      setTriggerResult(`✗ Error: ${data.error}`);
    }
  };

  const resetDemo = async () => {
    if (!confirm("¿Resetear el demo? Borra sesión activa y todas las aceptaciones.")) return;
    setResetting(true);
    setTriggerResult(null);
    const res = await fetch("/api/pulso-demo/reset", { method: "POST" });
    const data = await res.json();
    setResetting(false);
    setTriggerResult(data.ok ? "✓ Demo reseteado — sesión y aceptaciones borradas" : `✗ Error al resetear`);
    load();
  };

  const margin = product
    ? Math.round((product.price_suggested - product.price_cost) * 100 / product.price_suggested)
    : 0;

  return (
    <main style={{ minHeight: "100vh", background: "#0A0A0A", color: "#fff", padding: "0 0 80px" }}>
      {/* Header */}
      <div style={{
        background: "#111", borderBottom: "1px solid #222",
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ fontSize: 13, color: "#F77F00", fontWeight: 800, letterSpacing: "2px", textTransform: "uppercase" }}>
            ⚡ Dropi Pulso
          </div>
          <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>Panel de control · Solo para Jaime</div>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <a
            href="/pulso-demo/dashboard"
            target="_blank"
            style={{
              background: "#1A1A1A", border: "1px solid #333", color: "#aaa",
              padding: "8px 14px", borderRadius: 8, fontSize: 12, textDecoration: "none",
            }}
          >
            📺 Dashboard (pantalla)
          </a>
          <a
            href="/pulso-demo/proveedor"
            target="_blank"
            style={{
              background: "#1A1A1A", border: "1px solid #333", color: "#aaa",
              padding: "8px 14px", borderRadius: 8, fontSize: 12, textDecoration: "none",
            }}
          >
            🏭 Portal proveedor
          </a>
        </div>
      </div>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px", display: "grid", gap: 28 }}>

        {/* Status bar */}
        <div style={{
          background: stats.session
            ? "linear-gradient(135deg, #1a1a00 0%, #2a1800 100%)"
            : "#111",
          border: `1px solid ${stats.session ? "#F77F00" : "#222"}`,
          borderRadius: 14, padding: "20px 24px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#666", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 6 }}>
              Estado del demo
            </div>
            <div style={{ fontSize: 22, fontWeight: 800, color: stats.session ? "#F77F00" : "#444" }}>
              {stats.session ? "⚡ PULSO ACTIVO" : "○ En espera"}
            </div>
            {stats.session && (
              <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>
                Activado {new Date(stats.session.triggered_at).toLocaleTimeString("es-CO")}
              </div>
            )}
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 48, fontWeight: 900, color: "#F77F00", lineHeight: 1 }}>
              {stats.accepted}
            </div>
            <div style={{ fontSize: 13, color: "#666" }}>de {stats.total} aceptaron</div>
          </div>
        </div>

        {/* BOTÓN PRINCIPAL */}
        <button
          onClick={triggerPulso}
          disabled={triggering}
          style={{
            width: "100%",
            background: triggering
              ? "#1A1A1A"
              : "linear-gradient(135deg, #F77F00 0%, #E65C00 100%)",
            border: "none", borderRadius: 16,
            padding: "28px", cursor: triggering ? "default" : "pointer",
            fontSize: 22, fontWeight: 900, color: "#fff",
            letterSpacing: "1px", transition: "transform 0.1s",
            boxShadow: triggering ? "none" : "0 8px 32px rgba(247,127,0,0.4)",
          }}
          onMouseDown={(e) => { if (!triggering) e.currentTarget.style.transform = "scale(0.98)"; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
        >
          {triggering ? "⏳ Enviando notificaciones..." : "⚡ ACTIVAR PULSO"}
        </button>
        {triggerResult && (
          <div style={{
            background: triggerResult.startsWith("✓") ? "#0a2a0a" : "#2a0a0a",
            border: `1px solid ${triggerResult.startsWith("✓") ? "#14532d" : "#7f1d1d"}`,
            borderRadius: 10, padding: "12px 16px",
            color: triggerResult.startsWith("✓") ? "#4ade80" : "#f87171",
            fontSize: 14,
          }}>
            {triggerResult}
          </div>
        )}

        <button
          onClick={resetDemo}
          disabled={resetting}
          style={{
            width: "100%", background: "none",
            border: "1px solid #2a2a2a", borderRadius: 12,
            padding: "14px", cursor: resetting ? "default" : "pointer",
            fontSize: 13, fontWeight: 600, color: "#555",
          }}
        >
          {resetting ? "Reseteando..." : "↺ Resetear demo (borrar sesión y aceptaciones)"}
        </button>

        {/* Grid 2 col */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>

          {/* Asistentes */}
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 14, padding: "20px" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#F77F00", marginBottom: 16, textTransform: "uppercase", letterSpacing: "1px" }}>
              Asistentes ({attendees.length})
            </div>

            {/* Add form */}
            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              <input
                placeholder="Nombre *"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                style={inputStyle}
              />
              <input
                placeholder="WhatsApp (57XXXXXXXXXX)"
                value={form.whatsapp}
                onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))}
                style={inputStyle}
              />
              <input
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                style={inputStyle}
              />
              <button
                onClick={addAttendee}
                style={{
                  background: "#F77F00", border: "none", borderRadius: 8,
                  padding: "10px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                }}
              >
                + Agregar asistente
              </button>
            </div>

            {/* List */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {attendees.map((a) => (
                <div key={a.id} style={{
                  background: a.accepted_at ? "#0a2a0a" : "#1A1A1A",
                  border: `1px solid ${a.accepted_at ? "#14532d" : "#2a2a2a"}`,
                  borderRadius: 8, padding: "10px 12px",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", display: "flex", alignItems: "center", gap: 6 }}>
                      {a.name}
                      <span style={{
                        fontSize: 10, fontWeight: 700, borderRadius: 99, padding: "1px 7px",
                        background: a.role === "supplier" ? "#1e3a5f" : "#2a1800",
                        color: a.role === "supplier" ? "#60a5fa" : "#F77F00",
                      }}>
                        {a.role === "supplier" ? "🏭 proveedor" : "🛒 dropshipper"}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 1 }}>
                      {a.whatsapp && <span>📱 {a.whatsapp}</span>}
                      {a.whatsapp && a.email && " · "}
                      {a.email && <span>✉ {a.email}</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    {a.accepted_at && (
                      <span style={{ fontSize: 11, color: "#4ade80", fontWeight: 700 }}>✓ Aceptó</span>
                    )}
                    <a
                      href={`/pulso-demo/${a.token}`}
                      target="_blank"
                      style={{ fontSize: 11, color: "#555", textDecoration: "none" }}
                    >
                      🔗
                    </a>
                    <button
                      onClick={() => removeAttendee(a.id)}
                      style={{ background: "none", border: "none", color: "#444", cursor: "pointer", fontSize: 14 }}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              {attendees.length === 0 && (
                <div style={{ fontSize: 13, color: "#444", textAlign: "center", padding: "16px 0" }}>
                  Sin asistentes aún
                </div>
              )}
            </div>
          </div>

          {/* Producto */}
          <div style={{ background: "#111", border: "1px solid #222", borderRadius: 14, padding: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#F77F00", textTransform: "uppercase", letterSpacing: "1px" }}>
                Producto del demo
              </div>
              <button
                onClick={() => setEditProduct(!editProduct)}
                style={{ background: "none", border: "1px solid #333", color: "#888", borderRadius: 6, padding: "4px 10px", cursor: "pointer", fontSize: 12 }}
              >
                {editProduct ? "Cancelar" : "Editar"}
              </button>
            </div>

            {!editProduct && product ? (
              <div>
                {product.image_url && (
                  <img src={product.image_url} alt={product.name}
                    style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8, marginBottom: 14 }} />
                )}
                <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 4 }}>{product.name}</div>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 16 }}>{product.category} · {product.supplier_name} · {product.supplier_city}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  {[
                    { label: "Margen", value: `${margin}%` },
                    { label: "Ganancia", value: `$${(product.price_suggested - product.price_cost).toLocaleString("es-CO")}` },
                    { label: "Stock", value: product.stock.toLocaleString("es-CO") },
                  ].map((k) => (
                    <div key={k.label} style={{ background: "#1A1A1A", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: "#F77F00" }}>{k.value}</div>
                      <div style={{ fontSize: 10, color: "#555", marginTop: 2 }}>{k.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: "grid", gap: 8 }}>
                {([
                  { key: "name", label: "Nombre" },
                  { key: "category", label: "Categoría" },
                  { key: "supplier_name", label: "Proveedor" },
                  { key: "supplier_city", label: "Ciudad" },
                  { key: "price_cost", label: "Precio costo ($)" },
                  { key: "price_suggested", label: "Precio venta sugerido ($)" },
                  { key: "stock", label: "Stock (unidades)" },
                  { key: "image_url", label: "URL imagen" },
                ] as { key: keyof Product; label: string }[]).map(({ key, label }) => (
                  <div key={key}>
                    <div style={{ fontSize: 10, color: "#555", marginBottom: 3 }}>{label}</div>
                    <input
                      value={productForm[key] ?? ""}
                      onChange={(e) => setProductForm((f) => ({ ...f, [key]: e.target.value }))}
                      style={inputStyle}
                    />
                  </div>
                ))}
                <button
                  onClick={saveProduct}
                  style={{
                    background: "#F77F00", border: "none", borderRadius: 8,
                    padding: "10px", color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer",
                  }}
                >
                  Guardar producto
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Links útiles */}
        <div style={{ background: "#111", border: "1px solid #222", borderRadius: 14, padding: "20px" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
            Links para el día del demo
          </div>
          <div style={{ display: "grid", gap: 8 }}>
            {[
              { label: "📺 Dashboard (pantalla grande)", href: "/pulso-demo/dashboard", desc: "Proyectar en la sala" },
              { label: "🏭 Portal del proveedor", href: "/pulso-demo/proveedor", desc: "Mostrar el otro lado" },
              { label: "🛒 QR Dropshipper", href: "/pulso-demo/registro/dropshipper", desc: "Link de auto-registro dropshipper" },
              { label: "🏭 QR Proveedor", href: "/pulso-demo/registro/supplier", desc: "Link de auto-registro proveedor" },
              { label: "⚡ Este panel (admin)", href: "/pulso-demo/admin", desc: "Solo para Jaime" },
            ].map((l) => (
              <div key={l.href} style={{ display: "flex", alignItems: "center", gap: 12, background: "#1A1A1A", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff" }}>{l.label}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>{l.desc}</div>
                </div>
                <a href={l.href} target="_blank"
                  style={{ fontSize: 11, color: "#F77F00", textDecoration: "none" }}>
                  Abrir →
                </a>
              </div>
            ))}
            {attendees.slice(0, 2).map((a) => (
              <div key={a.id} style={{ display: "flex", alignItems: "center", gap: 12, background: "#1A1A1A", borderRadius: 8, padding: "10px 14px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: "#fff" }}>🧪 Preview: {a.name}</div>
                  <div style={{ fontSize: 11, color: "#555" }}>Lo que verá en su teléfono</div>
                </div>
                <a href={`/pulso-demo/${a.token}`} target="_blank"
                  style={{ fontSize: 11, color: "#F77F00", textDecoration: "none" }}>
                  Ver →
                </a>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#1A1A1A", border: "1px solid #2a2a2a",
  borderRadius: 8, padding: "9px 12px", color: "#fff", fontSize: 13,
  outline: "none",
};
