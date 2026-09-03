"use client";

import { useState } from "react";
import HubFooter from "@/components/HubFooter";

// Insumo: Metricas/PROYECTO.md — spec de la infografía interactiva "CX
// Metrics" (React + Vite + Tailwind) que explica CES, CSAT y NPS aplicadas
// al dropshipping. Esta página reconstruye esa experiencia (simulador +
// gauges) dentro de Darwin, no solo documenta el spec como texto.
//
// La paleta roja/ámbar/verde del doc fuente (detractor/pasivo/promotor) no
// pasa el validador de contraste CVD del skill de dataviz (ΔE 4.9, bajo el
// piso de 8) — se sustituye por #DC2626 / #CA8A04 / #15803D, que sí separan.

const CES_TOKEN = "#1D4ED8"; // --color-info
const CSAT_TOKEN = "#0F766E"; // --color-warning (nombre del token, no del semáforo)
const NPS_ZONES = [
  { min: 0, max: 6, label: "Detractor", color: "#DC2626", icon: "👎" },
  { min: 7, max: 8, label: "Pasivo", color: "#CA8A04", icon: "😐" },
  { min: 9, max: 10, label: "Promotor", color: "#15803D", icon: "👍" },
];

function zoneFor(score: number) {
  return NPS_ZONES.find((z) => score >= z.min && score <= z.max)!;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginTop: 48, marginBottom: 12 }}>
      {children}
    </h2>
  );
}

function Callout({ tone, children }: { tone: "pending" | "info" | "success"; children: React.ReactNode }) {
  const map = {
    pending: { bg: "#FFF6E5", border: "#F0C766" },
    info: { bg: "var(--dropi-light)", border: "var(--dropi)" },
    success: { bg: "#F0FDF4", border: "#15803D" },
  } as const;
  const { bg, border } = map[tone];
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 10,
      padding: "12px 16px", fontSize: 13, color: "var(--fg)", lineHeight: 1.6, marginTop: 12, marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
      padding: "2px 6px", fontSize: 12.5, color: "var(--fg)",
    }}>
      {children}
    </code>
  );
}

// ── Meter — spec del skill de dataviz: el fill lleva la severidad, el
// track sin llenar es un paso más claro de la misma rampa, valor directo. ──
function Meter({ value, max, color, label, valueLabel }: { value: number; max: number; color: string; label: string; valueLabel: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{label}</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: "var(--fg)" }}>{valueLabel}</span>
      </div>
      <div style={{ height: 10, borderRadius: 999, background: `${color}22`, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 999, transition: "width 300ms ease" }} />
      </div>
    </div>
  );
}

function NpsMeter({ score }: { score: number }) {
  const pct = ((score + 100) / 200) * 100;
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>NPS</span>
        <span style={{ fontSize: 18, fontWeight: 800, color: "var(--fg)" }}>{score > 0 ? `+${score}` : score}</span>
      </div>
      <div style={{ position: "relative", height: 10, borderRadius: 999, overflow: "hidden", display: "flex" }}>
        <div style={{ flex: "0 0 35%", background: "#FCA5A5" }} />
        <div style={{ flex: "0 0 15%", background: "#FDE68A" }} />
        <div style={{ flex: "0 0 50%", background: "#86EFAC" }} />
        <div aria-hidden style={{
          position: "absolute", top: -2, left: `${pct}%`, transform: "translateX(-50%)",
          width: 3, height: 14, borderRadius: 2, background: "#0f172a",
        }} />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "var(--muted)" }}>
        <span>-100</span><span>0</span><span>+100</span>
      </div>
    </div>
  );
}

const METRICAS = [
  { metrica: "CES", color: CES_TOKEN, icon: "💬", mide: "Esfuerzo del cliente en soporte", touchpoint: "Chat pre-venta" },
  { metrica: "CSAT", color: CSAT_TOKEN, icon: "📦", mide: "Satisfacción con la entrega", touchpoint: "Tarjeta post-entrega" },
  { metrica: "NPS", color: "#C2550A", icon: "✉️", mide: "Lealtad y recomendación", touchpoint: "Email 30 días post-compra" },
];

type Stage = { n: number; titulo: string; detalle: string; metrica?: "CES" | "NPS" | "dashboard" };

const STAGES: Stage[] = [
  { n: 1, titulo: "Descubrimiento", detalle: "Diana busca \"Luces LED H4\" en el catálogo." },
  { n: 2, titulo: "Soporte Pre-venta", detalle: "Escribe al chat para confirmar compatibilidad — aquí se mide CES.", metrica: "CES" },
  { n: 3, titulo: "Compra", detalle: "Confirma la orden #DS-2847 por $42.00 USD." },
  { n: 4, titulo: "Compra al Proveedor", detalle: "El pedido se despacha a CJ Dropshipping por $9.80 USD." },
  { n: 5, titulo: "Confirmación y Tracking", detalle: "Recibe el email automático con la guía de seguimiento." },
  { n: 6, titulo: "Entrega", detalle: "El paquete llega en buen estado, dentro del tiempo estimado." },
  { n: 7, titulo: "Encuesta NPS", detalle: "30 días después, responde \"¿qué tan probable es que nos recomiendes?\" — aquí se mide NPS.", metrica: "NPS" },
  { n: 8, titulo: "Análisis en Dashboard", detalle: "El equipo de CX ve el agregado de miles de respuestas como la de Diana.", metrica: "dashboard" },
];

function CesCapture({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--fg)", marginBottom: 10 }}>
        "¿Qué tanto esfuerzo te tomó resolver tu duda con nuestro equipo?" <span style={{ color: "var(--muted)" }}>(1 = mucho esfuerzo · 7 = muy fácil)</span>
      </p>
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              width: 36, height: 36, borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer",
              border: `1.5px solid ${value === n ? CES_TOKEN : "var(--border)"}`,
              background: value === n ? CES_TOKEN : "var(--card)",
              color: value === n ? "#fff" : "var(--fg)",
            }}
          >
            {n}
          </button>
        ))}
      </div>
      {value !== null && (
        <Callout tone={value >= 5 ? "success" : "pending"}>
          {value >= 5 ? "✅" : "⚠️"} Diana registró un esfuerzo de <strong>{value}/7</strong> — evento <Code>ces_response_submitted</Code> capturado en el chat de pre-venta.
        </Callout>
      )}
    </div>
  );
}

function NpsCapture({ value, onChange }: { value: number | null; onChange: (v: number) => void }) {
  return (
    <div>
      <p style={{ fontSize: 13, color: "var(--fg)", marginBottom: 10 }}>
        "¿Qué tan probable es que nos recomiendes a otro dropshipper?" <span style={{ color: "var(--muted)" }}>(0 = nada probable · 10 = muy probable)</span>
      </p>
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
        {Array.from({ length: 11 }, (_, n) => n).map((n) => {
          const zone = zoneFor(n);
          const selected = value === n;
          return (
            <button
              key={n}
              onClick={() => onChange(n)}
              style={{
                width: 32, height: 32, borderRadius: 8, fontWeight: 700, fontSize: 12.5, cursor: "pointer",
                border: `1.5px solid ${selected ? zone.color : "var(--border)"}`,
                background: selected ? zone.color : "var(--card)",
                color: selected ? "#fff" : "var(--fg)",
              }}
            >
              {n}
            </button>
          );
        })}
      </div>
      {value !== null && (() => {
        const zone = zoneFor(value);
        return (
          <Callout tone={zone.label === "Detractor" ? "pending" : "success"}>
            {zone.icon} Diana respondió <strong>{value}/10</strong> → <strong style={{ color: zone.color }}>{zone.label}</strong> de NPS.
          </Callout>
        );
      })()}
    </div>
  );
}

export default function MedicionCesCsatNpsPage() {
  const [activeStep, setActiveStep] = useState(1);
  const [cesAnswer, setCesAnswer] = useState<number | null>(null);
  const [npsAnswer, setNpsAnswer] = useState<number | null>(9);
  const stage = STAGES.find((s) => s.n === activeStep)!;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)", borderBottom: "1px solid var(--border)",
          padding: "20px 32px", display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: 8, flex: "none",
            background: "var(--dropi-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
          }}>
            🎯
          </div>
          <div>
            <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
              Métricas de CX en Dropshipping
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              <a href="/guias" style={{ color: "var(--muted)" }}>Guías</a> · Simulador interactivo de CES, CSAT y NPS
            </p>
          </div>
        </header>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, marginBottom: 8 }}>
            Dónde se captura cada métrica de experiencia en el recorrido real de un dropshipper, y cómo se lee
            el resultado agregado en el dashboard. Recorre los 8 pasos y responde como Diana para ver cómo se
            arma cada dato.
          </p>

          <Callout tone="info">
            📌 <strong>Fuente:</strong> <Code>Metricas/PROYECTO.md</Code> — spec de la infografía interactiva
            "CX Metrics". Este simulador reconstruye esa experiencia dentro de Darwin.
          </Callout>

          <SectionTitle>Métricas cubiertas</SectionTitle>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 12 }}>
            {METRICAS.map((m) => (
              <div key={m.metrica} style={{ background: "var(--card)", border: "1px solid var(--border)", borderLeft: `3px solid ${m.color}`, borderRadius: 10, padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 16 }}>{m.icon}</span>
                  <strong style={{ fontSize: 14, color: "var(--fg)" }}>{m.metrica}</strong>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--fg)", margin: "0 0 4px" }}>{m.mide}</p>
                <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0 }}>📍 {m.touchpoint}</p>
              </div>
            ))}
          </div>

          <SectionTitle>Simulador — el recorrido de Diana</SectionTitle>

          {/* Stepper */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 24, overflowX: "auto", paddingBottom: 4 }}>
            {STAGES.map((s, i) => (
              <div key={s.n} style={{ display: "flex", alignItems: "center", flex: i < STAGES.length - 1 ? 1 : "none" }}>
                <button
                  onClick={() => setActiveStep(s.n)}
                  title={s.titulo}
                  style={{
                    width: 34, height: 34, borderRadius: "50%", flexShrink: 0, cursor: "pointer",
                    border: `2px solid ${activeStep === s.n ? "var(--dropi)" : activeStep > s.n ? "#15803D" : "var(--border)"}`,
                    background: activeStep === s.n ? "var(--dropi)" : activeStep > s.n ? "#F0FDF4" : "var(--card)",
                    color: activeStep === s.n ? "#fff" : activeStep > s.n ? "#15803D" : "var(--muted)",
                    fontWeight: 800, fontSize: 13,
                  }}
                >
                  {activeStep > s.n ? "✓" : s.n}
                </button>
                {i < STAGES.length - 1 && (
                  <div style={{ flex: 1, height: 2, minWidth: 12, background: activeStep > s.n ? "#15803D" : "var(--border)" }} />
                )}
              </div>
            ))}
          </div>

          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{
                width: 26, height: 26, borderRadius: "50%", background: "var(--dropi-light)", color: "var(--dropi)",
                display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 12, flexShrink: 0,
              }}>
                {stage.n}
              </span>
              <strong style={{ fontSize: 15, color: "var(--fg)" }}>{stage.titulo}</strong>
            </div>
            <p style={{ fontSize: 13.5, color: "var(--muted)", lineHeight: 1.6, marginBottom: stage.metrica ? 18 : 0 }}>
              {stage.detalle}
            </p>

            {stage.metrica === "CES" && <CesCapture value={cesAnswer} onChange={setCesAnswer} />}
            {stage.metrica === "NPS" && <NpsCapture value={npsAnswer} onChange={setNpsAnswer} />}
            {stage.metrica === "dashboard" && (
              <div>
                <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 16 }}>
                  Diana es un caso dentro de miles — así se ve el agregado real en el dashboard del equipo de CX:
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, marginBottom: 16 }}>
                  <Meter value={6.2} max={7} color={CES_TOKEN} label="CES promedio" valueLabel="6.2 / 7" />
                  <Meter value={75} max={100} color={CSAT_TOKEN} label="CSAT" valueLabel="75%" />
                </div>
                <NpsMeter score={50} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16 }}>
            <button
              onClick={() => setActiveStep((s) => Math.max(1, s - 1))}
              disabled={activeStep === 1}
              style={{
                fontSize: 13, fontWeight: 600, padding: "8px 14px", borderRadius: 8,
                border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)",
                cursor: activeStep === 1 ? "default" : "pointer", opacity: activeStep === 1 ? 0.4 : 1,
              }}
            >
              ← Anterior
            </button>
            <button
              onClick={() => setActiveStep((s) => Math.min(8, s + 1))}
              disabled={activeStep === 8}
              style={{
                fontSize: 13, fontWeight: 700, padding: "8px 14px", borderRadius: 8,
                border: "none", background: "var(--dropi)", color: "#fff",
                cursor: activeStep === 8 ? "default" : "pointer", opacity: activeStep === 8 ? 0.4 : 1,
              }}
            >
              Siguiente →
            </button>
          </div>

          <Callout tone="success">
            ✅ <strong>Resultado del caso Diana:</strong> respondió 9/10 en NPS → Promotora. Margen neto del
            dropshipper en esta orden: $32.20 USD.
          </Callout>

          <details style={{ marginTop: 40 }}>
            <summary style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", cursor: "pointer" }}>
              Ficha técnica del prototipo original (stack, tokens, estructura de archivos)
            </summary>
            <div style={{ marginTop: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 20 }}>
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
                  <strong style={{ fontSize: 13, color: "var(--fg)" }}>Stack técnico</strong>
                  <ul style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.8, margin: "8px 0 0", paddingLeft: 18 }}>
                    <li>React 19 + Vite 8 + Tailwind CSS v4</li>
                    <li>lucide-react para iconos</li>
                    <li>SVG puro para visualizaciones</li>
                    <li>Paleta de marca Dropi (#FB9445)</li>
                    <li>Accesibilidad WCAG AA</li>
                  </ul>
                </div>
                <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
                  <strong style={{ fontSize: 13, color: "var(--fg)" }}>Estructura de archivos</strong>
                  <pre style={{ fontSize: 12, color: "var(--fg)", background: "var(--bg)", padding: 12, borderRadius: 8, marginTop: 8, overflowX: "auto" }}>
{`src/
├── App.tsx       # UI completa
├── index.css     # Design system tokens
└── main.tsx      # Punto de entrada`}
                  </pre>
                </div>
              </div>
              <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.7 }}>
                La paleta original de detractor/pasivo/promotor del spec (<Code>#B91C1C</Code> / <Code>#B45309</Code> / <Code>#15803D</Code>)
                no separa lo suficiente para daltonismo (ΔE 4.9, por debajo del piso de 8 del validador de contraste) —
                este simulador usa <Code>#DC2626</Code> / <Code>#CA8A04</Code> / <Code>#15803D</Code> en su lugar, que sí pasan.
              </p>
              <ul style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.9, paddingLeft: 18, marginTop: 12 }}>
                <li><strong>Colores:</strong> tokens originales en <Code>src/index.css</Code> del prototipo Vite.</li>
                <li><strong>Nombre del cliente:</strong> "Diana" en <Code>src/App.tsx</Code>.</li>
                <li><strong>Datos del simulador:</strong> arreglo <Code>STAGES</Code> dentro de <Code>OrderSimulator</Code>.</li>
                <li><strong>Rangos de métricas:</strong> props de <Code>MetricExplainer</Code> por sección.</li>
              </ul>
            </div>
          </details>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
