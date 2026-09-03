import HubFooter from "@/components/HubFooter";

// Insumo: Metricas/PROYECTO.md — spec de la infografía educativa e
// interactiva "CX Metrics" (React + Vite + Tailwind) que explica CES, CSAT
// y NPS aplicadas al dropshipping, con un simulador del recorrido de compra.

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginTop: 40, marginBottom: 12 }}>
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

const METRICAS = [
  { metrica: "CES", color: "#1D4ED8", mide: "Esfuerzo del cliente en soporte", touchpoint: "Chat pre-venta" },
  { metrica: "CSAT", color: "#0F766E", mide: "Satisfacción con la entrega", touchpoint: "Tarjeta post-entrega" },
  { metrica: "NPS", color: "#C2550A", mide: "Lealtad y recomendación", touchpoint: "Email 30 días post-compra" },
];

const PASOS = [
  { n: 1, titulo: "Descubrimiento", detalle: "Diana busca Luces LED H4." },
  { n: 2, titulo: "Soporte Pre-venta", detalle: "Chat de soporte — aquí se mide CES.", metrica: "CES" },
  { n: 3, titulo: "Compra", detalle: "Orden #DS-2847, $42.00 USD." },
  { n: 4, titulo: "Compra al Proveedor", detalle: "CJ Dropshipping, $9.80 USD." },
  { n: 5, titulo: "Confirmación y Tracking", detalle: "Email automático." },
  { n: 6, titulo: "Entrega", detalle: "El paquete llega en buen estado." },
  { n: 7, titulo: "Encuesta NPS", detalle: "30 días post-compra — aquí se mide NPS.", metrica: "NPS" },
  { n: 8, titulo: "Análisis en Dashboard", detalle: "CES 6.2 · CSAT 75% · NPS +50." },
];

const COLOR_TOKENS = [
  { token: "--color-brand-light", valor: "#FB9445", uso: "Naranja Dropi (fills, UI chrome)" },
  { token: "--color-brand-primary", valor: "#C2550A", uso: "Texto pequeño WCAG AA ≥4.5:1 · métrica NPS" },
  { token: "--color-brand-dark", valor: "#A03D05", uso: "Hover / bordes" },
  { token: "--color-info", valor: "#1D4ED8", uso: "Métrica CES" },
  { token: "--color-warning", valor: "#0F766E", uso: "Métrica CSAT" },
  { token: "--color-success", valor: "#15803D", uso: "Semántico — éxito" },
  { token: "--color-danger", valor: "#B91C1C", uso: "Semántico — error" },
  { token: "--color-promoter", valor: "#15803D", uso: "NPS — promotor" },
  { token: "--color-passive", valor: "#B45309", uso: "NPS — pasivo" },
  { token: "--color-detractor", valor: "#B91C1C", uso: "NPS — detractor" },
];

export default function MedicionCesCsatNpsPage() {
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
              Medición CES, CSAT y NPS
            </h1>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
              <a href="/guias" style={{ color: "var(--muted)" }}>Guías</a> · Infografía CX Metrics — Dropi Dropshipping
            </p>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 15, color: "var(--muted)", lineHeight: 1.6, marginBottom: 8, maxWidth: 780 }}>
            Infografía educativa e interactiva sobre CES, CSAT y NPS aplicadas al dropshipping — dónde se captura
            cada métrica en el recorrido real de un dropshipper y cómo se lee el resultado en el dashboard.
          </p>

          <Callout tone="info">
            📌 <strong>Fuente:</strong> <Code>Metricas/PROYECTO.md</Code> — spec del prototipo interactivo (React 19 +
            Vite 8 + Tailwind CSS v4). Esta guía documenta las definiciones y el caso de referencia; el prototipo
            navegable vive aparte del hub.
          </Callout>

          <SectionTitle>Métricas cubiertas</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, maxWidth: 780 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Métrica</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Qué mide</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Touchpoint</th>
                </tr>
              </thead>
              <tbody>
                {METRICAS.map((m) => (
                  <tr key={m.metrica} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", fontWeight: 700 }}>
                      <span style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                      }}>
                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: m.color, flexShrink: 0 }} />
                        {m.metrica}
                      </span>
                    </td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{m.mide}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{m.touchpoint}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>Simulador interactivo — 8 pasos con Diana</SectionTitle>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, maxWidth: 780 }}>
            Caso de referencia del prototipo: recorrido completo de un dropshipper buscando y vendiendo un producto,
            desde el descubrimiento hasta el análisis final en el dashboard.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 0, maxWidth: 780 }}>
            {PASOS.map((p) => (
              <div key={p.n} style={{
                display: "grid", gridTemplateColumns: "36px 1fr", gap: 16,
                padding: "16px 0", borderBottom: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%", border: "1px solid var(--border)",
                  background: "var(--card)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 13, color: "var(--fg)", flex: "none",
                }}>
                  {p.n}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
                    <strong style={{ fontSize: 13.5, color: "var(--fg)" }}>{p.titulo}</strong>
                    {p.metrica && (
                      <span style={{
                        fontSize: 10.5, fontWeight: 700, color: "var(--dropi)",
                        background: "var(--dropi-light)", padding: "2px 8px", borderRadius: 999,
                      }}>
                        mide {p.metrica}
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: 13, color: "var(--muted)", margin: 0, lineHeight: 1.5 }}>{p.detalle}</p>
                </div>
              </div>
            ))}
          </div>

          <Callout tone="success">
            ✅ <strong>Resultado del caso:</strong> Diana respondió 9/10 → Promotora NPS. Margen neto del
            dropshipper: $32.20 USD.
          </Callout>

          <SectionTitle>Ficha técnica del prototipo</SectionTitle>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 16, maxWidth: 780 }}>
            Referencia para quien construya o mantenga la infografía interactiva — no es información de negocio.
          </p>

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

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, maxWidth: 780 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Token</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Valor</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Uso</th>
                </tr>
              </thead>
              <tbody>
                {COLOR_TOKENS.map((t) => (
                  <tr key={t.token} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px" }}><Code>{t.token}</Code></td>
                    <td style={{ padding: "10px", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 12, height: 12, borderRadius: 3, background: t.valor, border: "1px solid var(--border)", flexShrink: 0 }} />
                      {t.valor}
                    </td>
                    <td style={{ padding: "10px", color: "var(--muted)" }}>{t.uso}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>Cómo personalizar el prototipo</SectionTitle>
          <ul style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.9, paddingLeft: 20, maxWidth: 780 }}>
            <li><strong>Colores:</strong> edita los tokens en <Code>src/index.css</Code>.</li>
            <li><strong>Nombre del cliente:</strong> reemplaza "Diana" en <Code>src/App.tsx</Code>.</li>
            <li><strong>Datos del simulador:</strong> arreglo <Code>STAGES</Code> dentro de <Code>OrderSimulator</Code>.</li>
            <li><strong>Rangos de métricas:</strong> props de <Code>MetricExplainer</Code> por sección.</li>
          </ul>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
