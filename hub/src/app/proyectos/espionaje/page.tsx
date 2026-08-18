"use client";

import { useState } from "react";
import { useIsEmbedded } from "@/lib/use-is-embedded";
import Breadcrumb from "@/components/Breadcrumb";
import { FASE_LABEL, faseDe } from "@/lib/fase";

const COLOR = "#10B981"; // success-green/WhatsApp Green for this project

export default function EspionajePage() {
  const isEmbedded = useIsEmbedded();
  const [docsOpen, setDocsOpen] = useState(true);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      {!isEmbedded && (
        <header style={{ background: "#fff", padding: "16px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 16 }}>
            <Breadcrumb
              items={[
                { label: "Proyectos", href: "/proyectos" },
                { label: FASE_LABEL[faseDe("Proyecto")] },
                { label: "Escucha de canales (espionaje)" },
              ]}
            />
          </div>
        </header>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>

        {/* Title & Tags */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 700,
              background: `${COLOR}18`, color: COLOR,
              padding: "3px 9px", borderRadius: 20,
            }}>
              ESP-001
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "#ECFDF5",
              color: "#047857", padding: "3px 9px", borderRadius: 20,
            }}>
              Research Completado · Sesión de Célula
            </span>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "#EFF6FF",
              color: "#1D4ED8", padding: "3px 9px", borderRadius: 20,
            }}>
              Célula Suppliers Success
            </span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Escucha de canales (espionaje)
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 680 }}>
            Monitoreo automatizado de canales y grupos públicos de WhatsApp de dropshipping mediante 
            <strong> Evolution API</strong> y procesamiento por IA. Recopila fricciones logísticas, dolores operativos 
            y tendencias directamente de la conversación del usuario.
          </p>
        </div>

        {/* Accordion Recursos */}
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, marginBottom: 32, overflow: "hidden",
        }}>
          <button
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "14px 20px", display: "flex", alignItems: "center", gap: 10,
              textAlign: "left",
              outline: "none",
            }}
          >
            <span style={{ fontSize: 15 }}>📂</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>
              Recursos de Investigación y Documentación
            </span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>
              ESP-001 · Escucha de canales
            </span>
            <span style={{
              fontSize: 16, color: "var(--muted)", transition: "transform 0.2s",
              display: "inline-block",
              transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}>
              ⌄
            </span>
          </button>

          {docsOpen && (
            <div style={{
              borderTop: "1px solid var(--border)", padding: "16px 20px",
              display: "flex", gap: 12, flexWrap: "wrap", background: "#FAFBFC",
            }}>
              {[
                {
                  href: "/esp001-escucha-canales-research.html",
                  icon: "📋",
                  title: "Documentación de Research",
                  sub: "Diagnóstico B=MAP · Insights de Célula (23-jul) · Arquitectura técnica y KPIs",
                  badge: "Research",
                  badgeColor: COLOR,
                  external: true,
                },
                {
                  href: "file:///Users/jaime.guevara/Documents/proyectos/Agente%20delivery%20manager/memory/project_data_suppliers.md",
                  icon: "🧠",
                  title: "Memoria del Proyecto (Suppliers)",
                  sub: "Contexto estratégico y refinamientos de la célula Suppliers en la memoria del Hub",
                  badge: "Estrategia",
                  badgeColor: "#3B82F6",
                  external: true,
                },
                {
                  href: "https://radar-comunidad.vercel.app/",
                  icon: "📡",
                  title: "Radar de Comunidad",
                  sub: "Insights curados de los grupos de WhatsApp escuchados (Panorama, Banco de Trabajo, Depurar)",
                  badge: "Producto",
                  badgeColor: "#F77F00",
                  external: true,
                },
              ].map((card) => (
                <a
                  key={card.href}
                  href={card.href}
                  target={card.external ? "_blank" : undefined}
                  rel={card.external ? "noopener noreferrer" : undefined}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    background: "#fff", border: `1px solid var(--border)`,
                    borderTop: `3px solid ${card.badgeColor}`,
                    borderRadius: 10, padding: "12px 16px", textDecoration: "none",
                    flex: "1 1 200px", minWidth: 220, maxWidth: 340,
                    transition: "box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.09)")}
                  onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{card.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
                        {card.title}
                      </span>
                      <span style={{
                        fontSize: 9, fontWeight: 800,
                        background: `${card.badgeColor}18`, color: card.badgeColor,
                        padding: "1px 6px", borderRadius: 999,
                      }}>
                        {card.badge}
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.4 }}>{card.sub}</div>
                  </div>
                  <span style={{ fontSize: 11, color: card.badgeColor, fontWeight: 700, flexShrink: 0 }}>↗</span>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Métricas clave */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "KPI de procesamiento", value: ">500 msgs/día", sub: "Volumen mínimo para análisis estadístico útil", color: COLOR },
            { label: "Precisión IA", value: ">90%", sub: "Categorización automática y análisis de sentimiento", color: "#0EA5E9" },
            { label: "Trigger inicial", value: "WhatsApp", sub: "Canal con fricción cero y mayor volumen", color: "#F77F00" },
          ].map((metric, i) => (
            <div
              key={i}
              style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: 12, padding: "16px 20px",
              }}
            >
              <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 6 }}>
                {metric.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: metric.color, marginBottom: 4 }}>
                {metric.value}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.3 }}>
                {metric.sub}
              </div>
            </div>
          ))}
        </div>

        {/* Resumen Ejecutivo del Research */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>
            Alineación y Hallazgos del Diagnóstico Cualitativo
          </h2>
          <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, marginBottom: 12 }}>
            La justificación central del proyecto es mitigar la desconexión entre la data puramente cuantitativa de soporte y 
            el sentimiento real del usuario (fricciones, quiebres de stock y dolores logísticos), capturándolos directamente en 
            su hábitat natural (canales de WhatsApp).
          </p>
          <div style={{ borderLeft: `3px solid ${COLOR}`, paddingLeft: 16, fontStyle: "italic", fontSize: 13, color: "#374151", margin: "16px 0", background: "#f9faf9", padding: "10px 14px", borderRadius: "0 8px 8px 0" }}>
            "Cada vez que entre un mensaje o grupo de mensajes, la IA interpretará el texto y lo asociará de manera algorítmica a las funcionalidades correspondientes. De esta manera alimentamos la escucha cualitativa de primera mano para respaldar y guiar nuestros experimentos de producto."
          </div>
        </div>

        {/* Fases del Proyecto */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 16 }}>
            Fases de Implementación y Priorización
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {[
              { title: "Fase 1: Conexión y Piloto Pasivo", desc: "Integración básica con Evolution API sobre un número corporativo exclusivo del área. Conexión de prueba con 2 grupos piloto para auditar volumen de ruido." },
              { title: "Fase 2: Enriquecimiento AI & Clasificación por Feature", desc: "Clasificación automatizada por temáticas y asociación con features del proyecto Tars (buscador, pasarela, wallet) y experimentos activos (autoconfirmación)." },
              { title: "Fase 3: Explotación y Acciones Preventivas", desc: "Consolidación de resúmenes de picos de dolor semanales/mensuales para guiar contenidos de nutrición en redes y mitigar información engañosa en soporte." },
            ].map((phase, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <span style={{
                  display: "inline-flex", alignItems: "center", justifyContent: "center",
                  width: 24, height: 24, borderRadius: "50%", background: `${COLOR}15`,
                  color: COLOR, fontWeight: 700, fontSize: 12, flexShrink: 0,
                }}>
                  {i + 1}
                </span>
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>
                    {phase.title}
                  </h3>
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
