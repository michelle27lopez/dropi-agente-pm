"use client";

import { useState } from "react";

export default function CategorizacionPage() {
  const [docsOpen, setDocsOpen] = useState(false);

  return (
    <main id="categorizacion-project-page" style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header id="project-header" style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" id="back-to-home-link" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span id="breadcrumb-current" style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Categorización y Enriquecimiento</span>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
        {/* Title */}
        <div id="project-title-container" style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span id="project-code-badge" style={{
              fontSize: 11, fontWeight: 700, background: "#F5F3FF",
              color: "#7C3AED", padding: "3px 9px", borderRadius: 20,
            }}>
              CAT-001
            </span>
            <span id="project-status-badge" style={{
              fontSize: 11, fontWeight: 700, background: "#FFFBEB",
              color: "#D97706", padding: "3px 9px", borderRadius: 20,
            }}>
              Discovery / Fase 1
            </span>
          </div>
          <h1 id="project-main-title" style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Categorización y Enriquecimiento Inteligente del Catálogo
          </h1>
          <p id="project-description-text" style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Habilitador estructural para unificar la taxonomía de Dropi, corregir typos, eliminar redundancias y potenciar la búsqueda semántica mediante el procesamiento inteligente de productos.
          </p>
        </div>

        {/* Recursos del proyecto (Accordion) */}
        <div id="project-resources-accordion" style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, marginBottom: 32, overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <button
            id="toggle-resources-btn"
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "16px 20px", display: "flex", alignItems: "center", gap: 10,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 16 }}>📂</span>
            <span id="accordion-title" style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>
              Recursos del proyecto
            </span>
            <span id="accordion-project-reference" style={{ fontSize: 12, color: "var(--muted)", marginRight: 8 }}>
              CAT-001 · Documentación
            </span>
            <span
              id="accordion-arrow-indicator"
              style={{
                fontSize: 12, color: "var(--muted)", transition: "transform 0.2s",
                display: "inline-block",
                transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)",
              }}
            >
              ▼
            </span>
          </button>

          {docsOpen && (
            <div id="accordion-content-panel" style={{
              borderTop: "1px solid var(--border)", padding: "20px",
              background: "#fafafa", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12,
            }}>
              {/* Recurso 1 */}
              <div
                id="resource-card-taxonomy"
                style={{
                  background: "#fff", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "14px 16px",
                  display: "flex", alignItems: "flex-start", gap: 12,
                }}
              >
                <span style={{ fontSize: 20 }}>📖</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>
                    Taxonomía Estándar
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                    Propuesta de unificación del catálogo en 18 categorías principales.
                  </div>
                </div>
              </div>

              {/* Recurso 2 */}
              <div
                id="resource-card-ai-pilot"
                style={{
                  background: "#fff", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "14px 16px",
                  display: "flex", alignItems: "flex-start", gap: 12,
                }}
              >
                <span style={{ fontSize: 20 }}>🤖</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>
                    Piloto IA & Reglas
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                    Especificación de algoritmos de corrección por similitud y Levenshtein.
                  </div>
                </div>
              </div>

              {/* Recurso 3 */}
              <div
                id="resource-card-backlog"
                style={{
                  background: "#fff", border: "1px solid var(--border)",
                  borderRadius: 10, padding: "14px 16px",
                  display: "flex", alignItems: "flex-start", gap: 12,
                }}
              >
                <span style={{ fontSize: 20 }}>📋</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>
                    Backlog de Categorías
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                    Matriz de priorización Dropy Score para categorías con mayor volumen.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Placeholder para la herramienta o plan futuro */}
        <div id="project-content-placeholder" style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, padding: "32px", textAlign: "center",
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
        }}>
          <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
            Esperando Plan de Documentación
          </h2>
          <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 460, margin: "0 auto", lineHeight: 1.5 }}>
            Estructura base lista. Introduce el plan de documentación o los requerimientos para rellenar este espacio y comenzar a estructurar la taxonomía consolidada.
          </p>
        </div>
      </div>
    </main>
  );
}
