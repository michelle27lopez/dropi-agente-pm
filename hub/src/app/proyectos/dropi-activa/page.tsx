"use client";

import { useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";

const COLOR = "#7C3AED";

const ACCESS_CARDS = [
  { href: "/activa-demo/dashboard", icon: "📺", title: "Dashboard · Sala", sub: "Proyectar en pantalla grande · QR · Counter en vivo", badge: "Sala", color: "#7C3AED", colorBg: "#F5F3FF", external: true },
  { href: "/activa-demo/admin", icon: "⚙️", title: "Panel Admin", sub: "Ver asistentes · Crear matches · Activar demo", badge: "Solo Jaime", color: "#6366F1", colorBg: "#EEF2FF", external: true },
  { href: "/activa-demo/registro/supplier", icon: "🏭", title: "Registro · Proveedor", sub: "QR para asistentes que son proveedores", badge: "QR", color: "#7C3AED", colorBg: "#F5F3FF", external: true },
  { href: "/activa-demo/registro/dropshipper", icon: "🛒", title: "Registro · Dropshipper", sub: "QR para asistentes que son dropshippers", badge: "QR", color: "#F77F00", colorBg: "#FFF8F0", external: true },
];

const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});

const HIPOTESIS = [
  {
    id: "H1",
    texto: "La primera semana es determinante. Si un supplier no genera actividad en sus primeros 7 días, la probabilidad de que active después cae drásticamente.",
    estado: "Por validar",
    critica: true,
  },
  {
    id: "H2",
    texto: "El dropshipper está en búsqueda constante. Existe demanda activa esperando oferta — el problema no es crear demanda, es conectarla con el proveedor correcto.",
    estado: "Confirmada",
    critica: true,
  },
  {
    id: "H3",
    texto: "Dropi puede garantizar la primera negociación en 7 días si el equipo hace matching activo. La capacidad operativa define el techo del programa.",
    estado: "Asumida",
    critica: true,
  },
  {
    id: "H4",
    texto: "El silencio mata antes que el rechazo. Un supplier tolera que no le compren. No tolera que no le hablen.",
    estado: "Por validar",
    critica: false,
  },
  {
    id: "H5",
    texto: "Entre más interacciones tempranas tiene un supplier (mensajes, negociaciones, muestras, rechazos), mayor la probabilidad y velocidad de cerrar su primera orden.",
    estado: "Por validar",
    critica: false,
  },
  {
    id: "H6",
    texto: "Una interacción que no cierra (muestra enviada, negociación sin acuerdo) tiene valor propio: crea relación, genera aprendizaje y mantiene al supplier activo.",
    estado: "Por validar",
    critica: false,
  },
  {
    id: "H7",
    texto: "Si tenemos señales de demanda (búsquedas, caza productos, categorías activas por dropshipper), podemos hacer matching preciso y reducir el tiempo a primera negociación de semanas a días.",
    estado: "Por validar",
    critica: false,
  },
];

export default function DropiActivaPage() {
  const isEmbedded = useIsEmbedded();
  const [docsOpen, setDocsOpen] = useState(true);
  const [researchOpen, setResearchOpen] = useState(false);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      {!isEmbedded && (
        <header style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
            ← Dropi PM Tools
          </a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Dropi Activa</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <span style={tag(COLOR, "#FFF8F0")}>ACT-001</span>
            <span style={tag("#3B82F6", "#EFF6FF")}>Prueba de Concepto</span>
            <span style={tag("#F59E0B", "#FFFBEB")}>En diseño</span>
          </div>
        </header>
      )}

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Dropi Activa · Activación de Suppliers por Matching de Demanda
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 680 }}>
            POC que demuestra cómo Dropi puede reducir el tiempo a primera negociación de 60+ días a 7 días,
            conectando proactivamente a suppliers nuevos con dropshippers que tienen demanda real en su categoría.
            La plataforma no espera que el mercado los descubra — los presenta.
          </p>
        </div>

        {/* Accesos del demo */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 15 }}>🔗</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>Accesos del demo · ACT-001</span>
            <span style={{ fontSize: 12, color: "var(--muted)" }}>4 vistas · todos públicos</span>
          </div>
          <div style={{ padding: "16px 20px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10 }}>
            {ACCESS_CARDS.map((card) => (
              <a key={card.href} href={card.href} target={card.external ? "_blank" : undefined} rel={card.external ? "noreferrer" : undefined}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 12, padding: "12px 14px", textDecoration: "none", position: "relative" }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: card.colorBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{card.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>{card.title}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{card.sub}</div>
                  <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: card.color }}>Abrir →</div>
                </div>
                <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9, fontWeight: 800, background: card.colorBg, color: card.color, padding: "1px 6px", borderRadius: 99 }}>{card.badge}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recursos del proyecto */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <button
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "14px 20px", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
            }}
          >
            <span style={{ fontSize: 15 }}>📂</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>Recursos del proyecto</span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>ACT-001</span>
            <span style={{
              fontSize: 16, color: "var(--muted)", transition: "transform 0.2s", display: "inline-block",
              transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}>⌄</span>
          </button>

          {docsOpen && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "16px 20px", display: "flex", gap: 12, flexWrap: "wrap", background: "#FAFBFC" }}>

              {/* Research card — expandible */}
              <div style={{
                background: "#fff", border: "1px solid var(--border)",
                borderTop: `3px solid #7C3AED`,
                borderRadius: 10, flex: "1 1 300px", minWidth: 280, overflow: "hidden",
              }}>
                <button
                  onClick={() => setResearchOpen(!researchOpen)}
                  style={{
                    width: "100%", background: "none", border: "none", cursor: "pointer",
                    padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, textAlign: "left",
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>🔬</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
                        Research · Interacciones Comerciales sin Venta
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 800, background: "#F3E8FF", color: "#7C3AED",
                        padding: "1px 6px", borderRadius: 999,
                      }}>
                        Por ejecutar
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>
                      ¿Las interacciones sin venta mantienen al supplier activo? · 7 hipótesis
                    </div>
                  </div>
                  <span style={{
                    fontSize: 14, color: "#7C3AED", display: "inline-block", transition: "transform 0.2s",
                    transform: researchOpen ? "rotate(180deg)" : "rotate(0deg)", flexShrink: 0,
                  }}>⌄</span>
                </button>

                {researchOpen && (
                  <div style={{ borderTop: "1px solid var(--border)", padding: "16px", background: "#FAFBFC" }}>

                    {/* Por qué */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        Por qué lo queremos hacer
                      </div>
                      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
                        En Dropi, el tiempo a primera venta es de 60+ días — el doble del benchmark de la industria (14-35 días).
                        La hipótesis central es que el supplier no necesita una venta para quedarse en la plataforma:
                        necesita sentir que <strong>hay alguien del otro lado interesado</strong>.
                        Si eso es verdad en la vida real (vendedores, artesanos, founders), entonces el diseño del
                        sistema debe garantizar interacciones constantes — no solo ventas.
                      </p>
                    </div>

                    {/* Pregunta de investigación */}
                    <div style={{
                      background: "#F3E8FF", border: "1px solid #DDD6FE",
                      borderRadius: 8, padding: "10px 14px", marginBottom: 16,
                    }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED", marginBottom: 4 }}>Pregunta central</div>
                      <p style={{ fontSize: 12, color: "#4C1D95", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
                        "¿Las interacciones comerciales sin venta son suficientes para mantener a una persona activa,
                        motivada y comprometida con su actividad comercial?"
                      </p>
                    </div>

                    {/* Hipótesis */}
                    <div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                        Hipótesis ({HIPOTESIS.length})
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {HIPOTESIS.map((h) => (
                          <div
                            key={h.id}
                            style={{
                              background: "#fff", border: `1px solid ${h.critica ? "#FCA5A5" : "var(--border)"}`,
                              borderRadius: 8, padding: "10px 12px",
                              display: "flex", gap: 10, alignItems: "flex-start",
                            }}
                          >
                            <span style={{
                              fontSize: 10, fontWeight: 800, color: h.critica ? "#DC2626" : "#7C3AED",
                              background: h.critica ? "#FEF2F2" : "#F3E8FF",
                              padding: "2px 7px", borderRadius: 999, flexShrink: 0, marginTop: 1,
                            }}>
                              {h.id}
                            </span>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.5, margin: "0 0 4px 0" }}>
                                {h.texto}
                              </p>
                              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                                {h.critica && (
                                  <span style={{ fontSize: 9, fontWeight: 700, color: "#DC2626", background: "#FEF2F2", padding: "1px 6px", borderRadius: 999 }}>
                                    Crítica
                                  </span>
                                )}
                                <span style={{ fontSize: 9, fontWeight: 700, color: "#6B7280", background: "#F3F4F6", padding: "1px 6px", borderRadius: 999 }}>
                                  {h.estado}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Metodología breve */}
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: "#7C3AED", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>
                        Metodología
                      </div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {["8-10 entrevistas en vida real", "Vendedores B2B", "Artesanos en ferias", "Freelancers", "Founders pre-revenue"].map((m) => (
                          <span key={m} style={{ fontSize: 10, color: "#6B7280", background: "#F3F4F6", padding: "3px 8px", borderRadius: 999 }}>
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* Acerca del POC */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
            Acerca de esta Prueba de Concepto
          </div>
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: 14 }}>

            <div style={{ background: `${COLOR}0d`, border: `1px solid ${COLOR}30`, borderRadius: 10, padding: "14px 16px" }}>
              <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>
                "Dropi sabe quién te necesita antes de que vos lo sepas."
              </p>
            </div>

            {[
              {
                icon: "🎯",
                title: "El problema central",
                desc: "Un supplier nuevo en Dropi tarda 60+ días en su primera venta. El modelo actual es pasivo — publica y espera. Sin interacciones en la primera semana, el riesgo de abandono es muy alto.",
              },
              {
                icon: "⚡",
                title: "La propuesta del POC",
                desc: "El supplier entra y el sistema le muestra quién lo está buscando. Hay 23 dropshippers activos en su categoría. 5 tienen demanda insatisfecha. 1 solicitó exactamente su producto hace 2 semanas. Un clic inicia la negociación — que llega por WhatsApp al dropshipper en tiempo real.",
              },
              {
                icon: "🔁",
                title: "El insight clave",
                desc: "El supplier no necesita una venta para quedarse. Necesita interacciones. Una negociación que no cerró, una muestra enviada sin acuerdo — eso es más que silencio. El sistema garantiza que nunca pase más de 48 horas sin que alguien del otro lado le hable.",
              },
              {
                icon: "🧠",
                title: "Lo que simulamos en el POC",
                desc: "Las señales de demanda se siembran manualmente para la demo. La negociación y el WhatsApp son reales (NEG-001 está vivo). El matching lo hace el equipo a mano. El POC demuestra la experiencia — no el motor.",
              },
            ].map((item) => (
              <div key={item.title} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>{item.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
