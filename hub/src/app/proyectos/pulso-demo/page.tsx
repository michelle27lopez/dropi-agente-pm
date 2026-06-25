"use client";

const ACCESS_CARDS = [
  {
    href: "/pulso-demo/dashboard",
    icon: "📺",
    title: "Dashboard · Pantalla grande",
    sub: "Proyectar en sala · QR → Ready → Live counter",
    color: "#F77F00",
    colorBg: "#FFF8F0",
    external: true,
    badge: "Sala",
  },
  {
    href: "/pulso-demo/admin",
    icon: "⚙️",
    title: "Panel de control · Admin",
    sub: "Gestionar asistentes · Activar Pulso · Ver estado",
    color: "#6366F1",
    colorBg: "#F5F3FF",
    external: true,
    badge: "Solo Jaime",
  },
  {
    href: "/pulso-demo/proveedor",
    icon: "🏭",
    title: "Portal del Proveedor",
    sub: "Demanda en vivo · Condiciones · Aceptar campaña",
    color: "#059669",
    colorBg: "#F0FDF4",
    external: true,
    badge: "Proyectar",
  },
  {
    href: "/pulso-demo/registro/dropshipper",
    icon: "🛒",
    title: "Registro · Dropshipper",
    sub: "QR para asistentes que son dropshippers",
    color: "#F77F00",
    colorBg: "#FFF8F0",
    external: true,
    badge: "QR",
  },
  {
    href: "/pulso-demo/registro/supplier",
    icon: "🏭",
    title: "Registro · Proveedor",
    sub: "QR para asistentes que son proveedores",
    color: "#2563EB",
    colorBg: "#EFF6FF",
    external: true,
    badge: "QR",
  },
  {
    href: "/pulso-demo/kit/demo-token",
    icon: "📦",
    title: "Kit de campaña · Preview",
    sub: "Lo que recibe el dropshipper tras aceptación del proveedor",
    color: "#7C3AED",
    colorBg: "#F5F3FF",
    external: true,
    badge: "Mock",
  },
];

const FLOW_STEPS = [
  { step: "1", label: "Dashboard en QR", desc: "Proyectar en sala. Dos QR para que los asistentes se registren como Dropshipper o Proveedor." },
  { step: "2", label: "Auto-registro", desc: "Cada asistente escanea el QR de su rol, completa nombre y teléfono. El dashboard muestra el counter en vivo." },
  { step: "3", label: "Activar Pulso", desc: "Jaime pasa a fase Ready y presiona ⚡ Activar Pulso. Solo los dropshippers reciben notificación real por WhatsApp + email." },
  { step: "4", label: "Dropshippers aceptan", desc: "Cada dropshipper abre su link personalizado, ve las señales del producto y elige cuántas unidades puede mover." },
  { step: "5", label: "Proveedor ve la señal", desc: "El portal del proveedor muestra en tiempo real cuántos confirmaron y las unidades comprometidas. Acepta condiciones." },
  { step: "6", label: "Kit de campaña", desc: "Al aceptar el proveedor, los dropshippers reciben notificación con acceso a gráficos, copies, videos y brief." },
];

export default function PulsoDemoProjectPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Dropi Pulso · Demo</span>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 60px" }}>

        {/* Title */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "#FFF8F0",
              color: "#F77F00", padding: "3px 9px", borderRadius: 20,
            }}>
              Demo · Stakeholders
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "#ECFDF5",
              color: "#10B981", padding: "3px 9px", borderRadius: 20,
            }}>
              ⚡ Listo para presentar
            </span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", marginBottom: 8, lineHeight: 1.2 }}>
            Dropi Pulso · Demo interactivo
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 640 }}>
            Prototipo funcional del motor de matching de catálogo. Durante la presentación los asistentes
            escanean QR, se registran con su rol real y reciben notificaciones reales por WhatsApp y email.
            El dashboard proyectado muestra el counter actualizándose en vivo.
          </p>
        </div>

        {/* Accesos */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, marginBottom: 32, overflow: "hidden",
        }}>
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ fontSize: 15 }}>🔗</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
              Accesos del demo
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>
              6 vistas · todos públicos
            </span>
          </div>
          <div style={{
            padding: "20px", display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12,
          }}>
            {ACCESS_CARDS.map((card) => (
              <a
                key={card.href}
                href={card.href}
                target={card.external ? "_blank" : undefined}
                rel={card.external ? "noreferrer" : undefined}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 12,
                  background: "#F8FAFC", border: "1px solid var(--border)",
                  borderRadius: 12, padding: "14px 16px", textDecoration: "none",
                  transition: "box-shadow 0.15s, transform 0.1s",
                  position: "relative",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)";
                  e.currentTarget.style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "none";
                }}
              >
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: card.colorBg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 20, flexShrink: 0,
                }}>
                  {card.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
                      {card.title}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                    {card.sub}
                  </div>
                  <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: card.color }}>
                    Abrir →
                  </div>
                </div>
                <span style={{
                  position: "absolute", top: 10, right: 10,
                  fontSize: 10, fontWeight: 700,
                  background: card.colorBg, color: card.color,
                  padding: "2px 7px", borderRadius: 99,
                }}>
                  {card.badge}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Flujo de la presentación */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, marginBottom: 32, overflow: "hidden",
        }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 15 }}>🎬</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
              Flujo de la presentación
            </span>
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 0 }}>
            {FLOW_STEPS.map((s, i) => (
              <div key={s.step} style={{ display: "flex", gap: 16, paddingBottom: i < FLOW_STEPS.length - 1 ? 20 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: "#FFF8F0", border: "2px solid #F77F00",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 800, color: "#F77F00",
                  }}>
                    {s.step}
                  </div>
                  {i < FLOW_STEPS.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: "#F3F4F6", marginTop: 4 }} />
                  )}
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
                    {s.label}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                    {s.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Infra */}
        <div style={{
          background: "#F8FAFC", border: "1px solid var(--border)",
          borderRadius: 14, padding: "20px 24px",
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
            Stack técnico
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {[
              "Next.js 14 · App Router",
              "Supabase · Realtime",
              "Evolution API · WhatsApp",
              "Gmail SMTP · Email",
              "QR server · Registro",
              "Token-based auth",
            ].map((t) => (
              <span key={t} style={{
                fontSize: 12, fontWeight: 600, color: "var(--fg)",
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: 99, padding: "4px 12px",
              }}>
                {t}
              </span>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
