"use client";

import { useIsEmbedded } from "@/lib/use-is-embedded";
import Breadcrumb from "@/components/Breadcrumb";
import { FASE_LABEL, faseDe } from "@/lib/fase";

const METRICS = [
  { label: "Señales Pulso reales", value: "10", sub: "2 pruebas internas excluidas" },
  { label: "Proveedores confirmaron", value: "9/10", sub: "90% — 1 rechazó" },
  { label: "Llegaron a \"Completada\"", value: "1/9", sub: "11% con compromiso real cerrado" },
  { label: "Convocatorias a dropshippers", value: "301", sub: "sobre las 9 señales confirmadas" },
  { label: "Tasa de compromiso", value: "1,3%", sub: "4 de 301 convocatorias" },
  { label: "Dropshippers únicos que confirmaron", value: "2", sub: "de ~206 convocados distintos" },
  { label: "Unidades comprometidas", value: "185", sub: "175 de un solo dropshipper" },
  { label: "Proveedores reales detrás", value: "3", sub: "Tulastore SAS · Quality Tienda · Comercializadora GGP" },
  { label: "Confirmaciones con venta despachada", value: "1/4", sub: "Único compromiso que terminó en producto privado creado y venta real" },
];

const FUNNEL = [
  { estado: "Convocado", desc: "Recibió el link, nunca lo abrió", cantidad: 206, pct: "68,4%", color: "#94A3B8" },
  { estado: "Visto", desc: "Abrió el link, no confirmó unidades", cantidad: 91, pct: "30,2%", color: "#F77F00" },
  { estado: "Comprometido", desc: "Confirmó unidades a vender", cantidad: 4, pct: "1,3%", color: "#059669" },
];

const SENALES = [
  { producto: "Bota Master Cat Ro Caja", proveedor: "Tulastore SAS", estado: "Pendiente", convocados: "—", comprometido: "—" },
  { producto: "Under Motorbike Ultraliviana Caja", proveedor: "Tulastore SAS", estado: "Pendiente", convocados: "—", comprometido: "—" },
  { producto: "Coleccion Premium Cat Road Caja", proveedor: "Tulastore SAS", estado: "Pendiente", convocados: "—", comprometido: "—" },
  { producto: "Tv Stick Android 216", proveedor: "Quality Tienda", estado: "Pendiente Confirmación", convocados: "45", comprometido: "1 · 10 u." },
  { producto: "Pistola Masajeadora Corporal Alargada", proveedor: "Quality Tienda", estado: "Pendiente Confirmación", convocados: "45", comprometido: "1 · 100 u." },
  { producto: "Lampara Solar Recargable Led Potente", proveedor: "Quality Tienda", estado: "Pendiente", convocados: "45", comprometido: "—" },
  { producto: "Audífonos Onikuma T20 FX", proveedor: "Comercializadora GGP", estado: "Pendiente Confirmación", convocados: "23", comprometido: "1 · 50 u." },
  { producto: "Kit brocha Ojos metálica Trendy", proveedor: "Comercializadora GGP", estado: "Rechazada", convocados: "—", comprometido: "—" },
  { producto: "Rodillera De Compresión", proveedor: "Comercializadora GGP", estado: "Completada", convocados: "45", comprometido: "1 · 25 u." },
  { producto: "Doppler Fetal", proveedor: "Comercializadora GGP", estado: "Expirada", convocados: "20", comprometido: "0" },
];

const ESTADO_COLOR: Record<string, { bg: string; color: string }> = {
  "Pendiente": { bg: "#FFF8F0", color: "#F77F00" },
  "Pendiente Confirmación": { bg: "#FFF8F0", color: "#F77F00" },
  "Completada": { bg: "#F0FDF4", color: "#059669" },
  "Rechazada": { bg: "#FEF2F2", color: "#EF4444" },
  "Expirada": { bg: "#FEF2F2", color: "#EF4444" },
};

export default function PulsoHallazgosPage() {
  const isEmbedded = useIsEmbedded();

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {!isEmbedded && (
        <header style={{ background: "#fff", padding: "16px 0" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
            <Breadcrumb
              items={[
                { label: "Proyectos", href: "/proyectos" },
                { label: FASE_LABEL[faseDe("POC")] },
                { label: "Dropi Pulso · Demo", href: "/proyectos/pulso-demo" },
                { label: "Hallazgos · Señales" },
              ]}
            />
          </div>
        </header>
      )}

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#FFF8F0", color: "#F77F00", padding: "3px 9px", borderRadius: 20 }}>Señales · Pulso</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#F0FDF4", color: "#059669", padding: "3px 9px", borderRadius: 20 }}>Primer Pulso: 21 de agosto</span>
            <a
              href="https://beta-pulso.vercel.app/senales?tipo=pulso"
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 11, fontWeight: 700, color: "#F77F00", background: "#FFF8F0", border: "1px solid #FDBA74", borderRadius: 20, padding: "3px 12px", textDecoration: "none", marginLeft: "auto" }}
            >
              Abrir señales en Pulso ↗
            </a>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", marginBottom: 10, lineHeight: 1.2 }}>
            Hallazgos — Confirmación de dropshippers en el oráculo de demanda
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 700 }}>
            De los 9 tipos de señal que maneja Pulso, "Pulso" es el único donde, tras confirmar el proveedor qué
            puede vender, se convoca a dropshippers para que confirmen unidades. Esto mide qué tanto de ese ciclo
            realmente se cierra desde que se envió la primera señal el 21 de agosto.
          </p>
        </div>

        {/* Métricas clave */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>📊</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Métricas clave</span>
          </div>
          <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
            {METRICS.map((m) => (
              <div key={m.label} style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--fg)", marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", marginBottom: 2, lineHeight: 1.3 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.3 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Funnel de convocatoria */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>🔻</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Funnel de convocatoria (301 dropshippers convocados, sobre 9 señales)</span>
          </div>
          <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>
            {FUNNEL.map((f) => (
              <div key={f.estado}>
                <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{f.estado}</span>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{f.desc}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: f.color, fontVariantNumeric: "tabular-nums" }}>{f.cantidad} · {f.pct}</span>
                </div>
                <div style={{ background: "#F3F4F6", borderRadius: 6, height: 10, overflow: "hidden" }}>
                  <div style={{ background: f.color, height: "100%", width: f.pct, borderRadius: 6 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{ margin: "0 20px 20px", padding: "12px 16px", background: "#FFF8F0", borderRadius: 8, fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
            💡 Solo 2 dropshippers únicos comprometieron unidades en las 4 confirmaciones (de ~206 convocados distintos): Aacsstore4
            (3 veces, 175 u.) y Jhonjairomedina11 (1 vez, 10 u.). No es un patrón de adopción amplia — es un mismo dropshipper
            recurrente respondiendo cada vez que llega una convocatoria. Y de esas 4, solo 1 llegó a concluir (ver abajo).
          </div>
        </div>

        {/* Tabla de señales */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>📋</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Las 10 señales Pulso reales</span>
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}>2 pruebas [PRUEBA] excluidas</span>
          </div>
          <div style={{ padding: 20, overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Producto</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Proveedor</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Estado</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Convocados</th>
                  <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Comprometido</th>
                </tr>
              </thead>
              <tbody>
                {SENALES.map((s, i) => {
                  const ec = ESTADO_COLOR[s.estado] ?? { bg: "#F3F4F6", color: "var(--muted)" };
                  return (
                    <tr key={s.producto} style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--fg)" }}>{s.producto}</td>
                      <td style={{ padding: "12px 14px", color: "var(--muted)" }}>{s.proveedor}</td>
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: ec.color, background: ec.bg, padding: "2px 8px", borderRadius: 99 }}>{s.estado}</span>
                      </td>
                      <td style={{ padding: "12px 14px", color: "var(--muted)" }}>{s.convocados}</td>
                      <td style={{ padding: "12px 14px", color: s.comprometido === "0" || s.comprometido === "—" ? "var(--muted)" : "#059669", fontWeight: s.comprometido.startsWith("1") ? 700 : 400 }}>{s.comprometido}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Envío manual */}
        <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🔧</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "var(--fg)" }}>Hallazgo de proceso — la convocatoria todavía es manual</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 10px" }}>
            El propio producto lo dice en la UI: el envío automático a los dropshippers convocados no está conectado
            todavía, así que hoy alguien del equipo comparte cada link a mano.
          </p>
          <blockquote style={{ margin: 0, padding: "12px 16px", background: "#fff", borderLeft: "4px solid #F77F00", borderRadius: "0 8px 8px 0", fontSize: 13, color: "var(--fg)", fontStyle: "italic" }}>
            &quot;El envío automático por WhatsApp/email todavía no está conectado — comparte el link de cada convocado
            manualmente mientras tanto.&quot;
          </blockquote>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, marginTop: 10 }}>
            Este cuello de botella es candidato directo a explicar buena parte del 68,4% que nunca abrió el link — no
            hay forma de distinguir hoy, con la data disponible, cuánto de eso es desinterés real vs. link que nunca llegó.
          </p>
        </div>

        {/* Producto privado */}
        <div style={{ background: "#FFF8F0", border: "2px solid #F77F00", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#F77F00" }}>
              Hallazgo cualitativo — el compromiso no termina el trabajo del proveedor
            </span>
          </div>
          <p style={{ fontSize: 13, color: "#92400E", lineHeight: 1.6, margin: 0 }}>
            Una vez el dropshipper confirma qué puede vender, hoy no hay forma en Dropi de entregarle ese producto con
            el descuento acordado sin que el proveedor cree un <strong>producto privado</strong> aparte. Eso vuelve a ensuciar
            el catálogo, con el mismo patrón de deuda técnica ya documentado para el vertical Marcas. Pulso no lo
            trackea automáticamente, así que se validó a mano: de las 4 confirmaciones, solo <strong>1 terminó en producto
            privado creado y venta despachada</strong> — el compromiso de <strong>Aacsstore4</strong> por Rodillera De Compresión
            (producto 1752145, 25 u., la única señal en estado "Completada"). En las otras tres confirmaciones el
            equipo comercial ya se comunicó con el dropshipper, pero ninguno ha confirmado todavía que sí va a vender
            el producto — por eso el proveedor aún no crea el producto privado con el descuento en ninguna de ellas.
          </p>
        </div>

        {/* Preguntas abiertas */}
        <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
            Preguntas abiertas
          </div>
          {[
            "¿Qué pasó con las otras 3 confirmaciones que no llegaron a producto privado + venta despachada? ¿se quedaron en el proveedor, o el dropshipper tampoco siguió?",
            "¿Qué tanto del 68,4% que nunca abrió el link es porque el envío es manual y no llegó, vs. desinterés real del dropshipper?",
            "¿Vale la pena automatizar WhatsApp/email antes de escalar el volumen de señales Pulso, o el volumen todavía es muy chico (10 señales) para justificarlo?",
            "Aacsstore4 confirmó 3 de las 4 veces — ¿es un dropshipper especialmente activo que vale la pena entrevistar, o un caso atípico que infla la tasa real de adopción?",
          ].map((q, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 3 ? 8 : 0 }}>
              <span style={{ fontSize: 12, color: "#F77F00", flexShrink: 0, marginTop: 1 }}>◆</span>
              <span style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{q}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/proyectos/pulso-demo" style={{ fontSize: 13, fontWeight: 600, color: "#F77F00", textDecoration: "none", padding: "8px 16px", background: "#FFF8F0", borderRadius: 8, border: "1px solid #FDBA74" }}>
            ← Volver al proyecto
          </a>
          <span style={{ fontSize: 12, color: "var(--muted)", alignSelf: "center" }}>
            Fuente: Supabase de Pulso (signals, signal_pulso_dropshippers) · consultado 2026-08-28
          </span>
        </div>

      </div>
    </main>
  );
}
