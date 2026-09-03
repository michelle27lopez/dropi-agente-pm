"use client";

import { useState } from "react";
import HubFooter from "@/components/HubFooter";
import {
  MessageCircle, Package, Heart, Info, CheckCircle2, AlertTriangle, XCircle,
  ShoppingBag, CreditCard, ClipboardList, PackageCheck, Bell, Truck, Send,
  BarChart3, PlayCircle, RotateCcw, Star, TrendingUp, ThumbsUp,
} from "lucide-react";

// Réplica del prototipo Figma Site (https://pale-bet-02909846.figma.site),
// spec original en Metricas/PROYECTO.md. La paleta roja/ámbar del original
// (detractor/pasivo) no separa lo suficiente para daltonismo (ΔE 4.9, bajo
// el piso de 8 del validador de contraste del skill de dataviz) — se usa
// #DC2626 / #CA8A04 / #15803D en su lugar.

const THEME = {
  ces: { accent: "#2563EB", light: "#EFF6FF" },
  csat: { accent: "#0D9488", light: "#F0FDFA" },
  nps: { accent: "#C2410C", light: "#FFF7ED" },
};

const QUALITY = {
  good: { bg: "#F0FDF4", border: "#BBF7D0", text: "#15803D", icon: CheckCircle2 },
  ok: { bg: "#FFFBEB", border: "#FDE68A", text: "#B45309", icon: AlertTriangle },
  bad: { bg: "#FEF2F2", border: "#FECACA", text: "#B91C1C", icon: XCircle },
};

function Badge({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700,
      color, background: `${color}18`, borderRadius: 999, padding: "3px 10px",
    }}>
      {children}
    </span>
  );
}

function QualityRow({ tone, label, range, text }: { tone: "good" | "ok" | "bad"; label: string; range: string; text: string }) {
  const q = QUALITY[tone];
  const Icon = q.icon;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, background: q.bg,
      border: `1px solid ${q.border}`, borderRadius: 8, padding: "10px 14px", marginBottom: 8,
    }}>
      <Icon size={16} color={q.text} style={{ flexShrink: 0 }} />
      <strong style={{ fontSize: 12.5, color: q.text, width: 64, flexShrink: 0 }}>{label}</strong>
      <code style={{ fontSize: 11.5, color: q.text, fontWeight: 700, width: 90, flexShrink: 0 }}>{range}</code>
      <span style={{ fontSize: 12.5, color: "var(--fg)" }}>{text}</span>
    </div>
  );
}

function Bar({ label, pct, color, sub }: { label: string; pct: number; color: string; sub?: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
      <span style={{ fontSize: 11.5, color: "var(--muted)", width: 96, flexShrink: 0, textAlign: "right" }}>{label}</span>
      <div style={{ flex: 1, height: 8, borderRadius: 999, background: "var(--bg)", overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--fg)", width: 34, flexShrink: 0 }}>{pct}%</span>
      {sub}
    </div>
  );
}

function ResultBox({ value, label, sub, color }: { value: string; label: string; sub: string; color: string }) {
  return (
    <div style={{ border: `1px solid ${color}`, background: `${color}0D`, borderRadius: 10, padding: "18px 20px", textAlign: "center" }}>
      <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{label}</div>
      <div style={{ fontSize: 11.5, fontWeight: 700, color: "#15803D", marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function Formula({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 18, marginBottom: 12 }}>
      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 8 }}>FÓRMULA</div>
      {children}
    </div>
  );
}

// ── Sección genérica por métrica ─────────────────────────────────────────
function MetricSection({
  theme, icon: Icon, etapa, titulo, queMide, porQueImporta, calidad, children, footer,
}: {
  theme: { accent: string; light: string };
  icon: React.ElementType;
  etapa: string;
  titulo: string;
  queMide: React.ReactNode;
  porQueImporta: React.ReactNode;
  calidad: { tone: "good" | "ok" | "bad"; label: string; range: string; text: string }[];
  children: React.ReactNode;
  footer: string;
}) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderLeft: `3px solid ${theme.accent}`, borderRadius: 14, padding: 28, marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: theme.light, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color={theme.accent} />
        </div>
        <div>
          <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: theme.accent, textTransform: "uppercase" }}>{etapa}</div>
          <h2 style={{ fontSize: 19, fontWeight: 800, color: "var(--fg)", margin: 0 }}>{titulo}</h2>
        </div>
      </div>

      <p style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.7, marginBottom: 4 }}>
        <Info size={13} color={theme.accent} style={{ display: "inline", marginRight: 4, marginBottom: -1 }} />
        <strong>¿Qué mide? </strong>{queMide}
      </p>
      <p style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.7, marginBottom: 16 }}>
        <strong>¿Por qué importa? </strong>{porQueImporta}
      </p>

      <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 8 }}>
        ¿QUÉ SE CONSIDERA BUENO O MALO?
      </div>
      {calidad.map((c) => <QualityRow key={c.label} {...c} />)}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, marginTop: 20 }}>
        {children}
      </div>

      <p style={{ fontSize: 12, color: theme.accent, fontWeight: 600, marginTop: 20, marginBottom: 0 }}>
        › {footer}
      </p>
    </div>
  );
}

export default function MedicionCesCsatNpsPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        {/* ── Hero ── */}
        <div style={{
          background: "linear-gradient(135deg, #C2410C, #EA580C)", padding: "48px 32px", textAlign: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{
              display: "inline-block", fontSize: 11, fontWeight: 700, color: "#fff", letterSpacing: "0.06em",
              background: "rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 14px", marginBottom: 16,
            }}>
              📦 E-COMMERCE · DROPSHIPPING · CX INTELLIGENCE
            </span>
            <h1 style={{ fontSize: 34, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Métricas de CX en Dropshipping</h1>
            <p style={{ fontSize: 16, color: "rgba(255,255,255,0.92)", margin: "0 0 4px" }}>
              Cómo medir <strong>CES</strong>, <strong>CSAT</strong> y <strong>NPS</strong> al vender un producto
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", margin: "0 0 20px" }}>
              Ejemplo real: Luces LED para Carro
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
              <a href="#ces" style={pillLink}><MessageCircle size={13} /> Pre-compra</a>
              <a href="#csat" style={pillLink}><Package size={13} /> Post-entrega</a>
              <a href="#nps" style={pillLink}><Heart size={13} /> Lealtad 30d</a>
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 980, margin: "0 auto", padding: "32px 24px" }}>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 24 }}>
            <a href="/guias" style={{ color: "var(--muted)" }}>Guías</a> · Réplica interactiva del prototipo — spec en <code style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 4, padding: "1px 5px" }}>Metricas/PROYECTO.md</code>
          </p>

          {/* ── CES ── */}
          <div id="ces">
            <MetricSection
              theme={THEME.ces}
              icon={MessageCircle}
              etapa="Etapa 1 · Pre-compra"
              titulo="CES — Customer Effort Score"
              queMide="El nivel de esfuerzo que debe hacer el cliente para resolver su duda, completar una compra o solucionar un problema. Usa una escala del 1 (muy difícil) al 7 (muy fácil)."
              porQueImporta="Un proceso complicado genera abandono de carrito. Cuanto menos esfuerzo perciba el cliente, más probable es que finalice la compra y vuelva a comprar."
              calidad={[
                { tone: "good", label: "Bueno", range: "5.5 – 7.0", text: "Experiencia fluida: el cliente resolvió su duda sin fricción y completó la compra." },
                { tone: "ok", label: "Regular", range: "4.0 – 5.4", text: "Experiencia aceptable: hubo algo de esfuerzo; revisa el chat o la página de producto." },
                { tone: "bad", label: "Malo", range: "1.0 – 3.9", text: "Experiencia con fricción: alta probabilidad de abandono; rediseña el soporte y la navegación." },
              ]}
              footer="Producto entregado → encuesta de satisfacción"
            >
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: THEME.ces.accent, marginBottom: 10 }}>
                  CASO REAL — ORDEN #DS-2847
                </div>
                <div style={{ border: `1px solid ${THEME.ces.accent}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ background: THEME.ces.accent, color: "#fff", padding: "10px 14px" }}>
                    <div style={{ fontSize: 12.5, fontWeight: 700 }}>Soporte AutoLED Store</div>
                    <div style={{ fontSize: 10.5, opacity: 0.85 }}>● En línea ahora</div>
                  </div>
                  <div style={{ padding: 14, display: "flex", flexDirection: "column", gap: 8 }}>
                    <ChatBubble align="left">¡Hola! 👋 ¿En qué puedo ayudarte con tu pedido?</ChatBubble>
                    <ChatBubble align="right" accent={THEME.ces.accent}>¿Las Luces LED H4 6000K son compatibles con un Honda Civic 2019?</ChatBubble>
                    <ChatBubble align="left">✅ ¡Sí! Son 100% compatibles. El Honda Civic 2019 usa casquillo H4. ¿Te ayudo a finalizar la compra?</ChatBubble>
                    <div style={{ fontSize: 10.5, color: THEME.ces.accent, border: `1px dashed ${THEME.ces.accent}`, borderRadius: 6, padding: "6px 10px", textAlign: "center" }}>
                      📊 Encuesta CES enviada al cerrar el chat
                    </div>
                  </div>
                </div>
                <MiniPanel>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>PREGUNTA ENVIADA AL CLIENTE</div>
                  <p style={{ fontSize: 13, fontStyle: "italic", color: "var(--fg)", marginBottom: 8 }}>"¿Qué tan fácil fue resolver tus dudas sobre la compatibilidad de las Luces LED hoy?"</p>
                  <Badge color={THEME.ces.accent}>ESCALA 1-7</Badge> <span style={{ fontSize: 11, color: "var(--muted)" }}>1 = muy difícil · 7 = muy fácil</span>
                </MiniPanel>
                <Formula>
                  <code style={{ fontSize: 12, color: THEME.ces.accent }}>CES = Suma total de puntuaciones ÷ Número total de respuestas</code>
                  <div style={{ fontSize: 26, fontWeight: 800, color: THEME.ces.accent, margin: "10px 0 4px" }}>CES = 6.2</div>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>310 puntos ÷ 50 respuestas → Proceso ágil y sin fricción</p>
                </Formula>
                <p style={{ fontSize: 11.5, color: "var(--muted)" }}>💡 Puntaje <strong>alto = menos esfuerzo</strong> → menos abandono de carrito.</p>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 10 }}>
                  DISTRIBUCIÓN DE RESPUESTAS (EJEMPLO, 50 ENCUESTADOS)
                </div>
                <Bar label="1 — Muy difícil" pct={4} color="#FCA5A5" />
                <Bar label="2" pct={6} color="#FCA5A5" />
                <Bar label="3" pct={10} color="#FDBA74" />
                <Bar label="4 — Neutral" pct={14} color="#FDE68A" />
                <Bar label="5" pct={16} color="#BFDBFE" />
                <Bar label="6" pct={22} color="#93C5FD" />
                <Bar label="7 — Muy fácil" pct={28} color={THEME.ces.accent} />
                <div style={{ marginTop: 16 }}>
                  <ResultBox value="6.2" label="CES Promedio / 7" sub="✓ Experiencia sin fricción" color={THEME.ces.accent} />
                </div>
              </div>
            </MetricSection>
          </div>

          {/* ── CSAT ── */}
          <div id="csat">
            <MetricSection
              theme={THEME.csat}
              icon={Package}
              etapa="Etapa 2 · Post-entrega"
              titulo="CSAT — Customer Satisfaction Score"
              queMide="El porcentaje de clientes que declaran estar satisfechos (4 o 5 estrellas) con un producto o servicio específico. Se mide en un punto de contacto concreto, como la entrega del pedido."
              porQueImporta="En dropshipping no controlas el inventario ni el envío directamente. El CSAT te dice si tu proveedor está cumpliendo con la calidad y los tiempos prometidos al cliente."
              calidad={[
                { tone: "good", label: "Bueno", range: "80% – 100%", text: "Excelente: proveedor confiable; los clientes están satisfechos con el producto y la entrega." },
                { tone: "ok", label: "Regular", range: "60% – 79%", text: "Aceptable: hay oportunidades de mejora; evalúa tiempos de envío o calidad del empaque." },
                { tone: "bad", label: "Malo", range: "0% – 59%", text: "Crítico: cambia de proveedor o renegocia condiciones; los clientes están decepcionados." },
              ]}
              footer="30 días después → encuesta de lealtad y recomendación"
            >
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: THEME.csat.accent, marginBottom: 10 }}>
                  CASO REAL — ORDEN #DS-2847 ENTREGADA
                </div>
                <div style={{ border: `1px solid ${THEME.csat.accent}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ background: THEME.csat.accent, color: "#fff", padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 12.5, fontWeight: 700 }}>📦 AutoLED Store — Confirmación de entrega</span>
                    <Badge color="#fff">✓ Entregado</Badge>
                  </div>
                  <div style={{ padding: 14 }}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--bg)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>💡</div>
                      <div>
                        <strong style={{ fontSize: 12.5 }}>Kit LED H4 6000K — Bombillo Xenón</strong>
                        <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0 }}>Qty: 1 · SKU: LED-H4-6K · $42.00 USD</p>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 16, fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>
                      <span>PEDIDO<br /><strong style={{ color: "var(--fg)" }}>28 Jul 2026</strong></span>
                      <span>ENTREGADO<br /><strong style={{ color: "var(--fg)" }}>06 Ago 2026</strong></span>
                      <span>TRANSPORTADORA<br /><strong style={{ color: "var(--fg)" }}>YunExpress</strong></span>
                    </div>
                    <div style={{ fontSize: 10.5, color: THEME.csat.accent, border: `1px dashed ${THEME.csat.accent}`, borderRadius: 6, padding: "6px 10px", textAlign: "center" }}>
                      🔔 Encuesta CSAT enviada 24h después de confirmar entrega
                    </div>
                  </div>
                </div>
                <MiniPanel>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>PREGUNTA ENVIADA AL CLIENTE</div>
                  <p style={{ fontSize: 13, fontStyle: "italic", color: "var(--fg)", marginBottom: 8 }}>"¿Qué tan satisfecho estás con la calidad de tus Luces LED y el tiempo de entrega?"</p>
                  <Badge color={THEME.csat.accent}>ESCALA 1-5</Badge> <span style={{ fontSize: 11, color: "var(--muted)" }}>4–5 cuentan como satisfechos</span>
                </MiniPanel>
                <Formula>
                  <code style={{ fontSize: 12, color: THEME.csat.accent }}>CSAT = (Respuestas 4 y 5) × 100 ÷ Total de respuestas</code>
                  <div style={{ fontSize: 26, fontWeight: 800, color: THEME.csat.accent, margin: "10px 0 4px" }}>CSAT = 75%</div>
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>150 satisfechos ÷ 200 encuestados → Proveedor cumple con la calidad</p>
                </Formula>
                <p style={{ fontSize: 11.5, color: "var(--muted)" }}>💡 Controla la <strong>calidad de tus proveedores</strong> (AliExpress, CJ Dropshipping…)</p>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 10 }}>
                  ESCALA DE SATISFACCIÓN (200 RESPUESTAS)
                </div>
                <Bar label="😞 Muy insatisfecho" pct={5} color="#FCA5A5" />
                <Bar label="🙁 Insatisfecho" pct={7} color="#FDBA74" />
                <Bar label="😐 Neutral" pct={13} color="#FDE68A" />
                <Bar label="🙂 Satisfecho ✓" pct={38} color="#5EEAD4" />
                <Bar label="😄 Muy satisfecho ✓" pct={37} color={THEME.csat.accent} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 16 }}>
                  <ResultBox value="75%" label="CSAT Score" sub="" color={THEME.csat.accent} />
                  <ResultBox value="150" label="Satisfechos / 200" sub="" color={THEME.csat.accent} />
                </div>
              </div>
            </MetricSection>
          </div>

          {/* ── NPS ── */}
          <div id="nps">
            <MetricSection
              theme={THEME.nps}
              icon={Heart}
              etapa="Etapa 3 · Lealtad 30 días"
              titulo="NPS — Net Promoter Score"
              queMide="La probabilidad de que un cliente recomiende tu tienda a otras personas, medida en una escala del 0 al 10. Clasifica a los clientes en Promotores, Pasivos y Detractores para calcular la salud de tu marca."
              porQueImporta="En dropshipping, la reputación lo es todo. Un NPS alto significa que tus clientes se convierten en vendedores gratuitos de tu tienda. Un NPS negativo puede destruir tu marca con reseñas públicas antes de que puedas actuar."
              calidad={[
                { tone: "good", label: "Bueno", range: "+50 → +100", text: "Excelente: base sólida de promotores; ideal para campañas de referidos y remarketing." },
                { tone: "ok", label: "Regular", range: "0 → +49", text: "Aceptable: más promotores que detractores, pero hay margen de mejora en la experiencia postventa." },
                { tone: "bad", label: "Malo", range: "-100 → -1", text: "Crítico: los detractores superan a los promotores; riesgo alto de reseñas negativas y churn masivo." },
              ]}
              footer="De 100 compradores encuestados al mes · Excelente salud de marca para hacer remarketing"
            >
              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: THEME.nps.accent, marginBottom: 10 }}>
                  CASO REAL — EMAIL NPS · DÍA 30 TRAS ORDEN #DS-2847
                </div>
                <div style={{ border: `1px solid ${THEME.nps.accent}`, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
                  <div style={{ padding: "10px 14px", background: "var(--bg)", fontSize: 11, color: "var(--muted)" }}>
                    <div>De: noreply@autoleds.store</div>
                    <div>Para: diana.garcia@email.com</div>
                    <div>Asunto: ⭐ Diana, ¿nos recomendarías? — Cuéntanos tu experiencia</div>
                  </div>
                  <div style={{ background: THEME.nps.accent, color: "#fff", padding: "8px 14px", fontSize: 12, fontWeight: 700 }}>
                    ⭐ AutoLED Store · Encuesta de lealtad
                  </div>
                  <div style={{ padding: 14 }}>
                    <p style={{ fontSize: 12.5, margin: "0 0 8px" }}>¡Hola Diana! 👋 Han pasado 30 días desde que recibiste tu <strong>Kit LED H4 6000K</strong>. Nos encantaría saber cómo ha sido tu experiencia.</p>
                    <p style={{ fontSize: 12.5, fontWeight: 700, marginBottom: 8 }}>¿Qué probabilidad hay de que recomiendes nuestra tienda a un amigo?</p>
                    <div style={{ display: "flex", gap: 3, marginBottom: 6, flexWrap: "wrap" }}>
                      {Array.from({ length: 11 }, (_, n) => n).map((n) => (
                        <span key={n} style={{
                          width: 22, height: 22, borderRadius: 5, fontSize: 10.5, fontWeight: 700,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          border: `1px solid ${n === 9 ? "#15803D" : zoneColor(n)}`,
                          color: n === 9 ? "#fff" : zoneColor(n), background: n === 9 ? "#15803D" : "transparent",
                        }}>
                          {n}
                        </span>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--muted)", marginBottom: 10 }}>
                      <span>0 = Nada probable</span><span>10 = Muy probable</span>
                    </div>
                    <div style={{ background: "#F0FDF4", border: "1px solid #BBF7D0", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: "#15803D" }}>
                      ✓ Diana respondió: <strong>9 / 10</strong> — Promotora ✓
                    </div>
                  </div>
                </div>
                <Formula>
                  <code style={{ fontSize: 12, color: THEME.nps.accent }}>NPS = % Promotores (9–10) − % Detractores (0–6)</code>
                  <p style={{ fontSize: 12, color: "var(--fg)", margin: "8px 0" }}>NPS = 65% − 15% = +50</p>
                  <div style={{ fontSize: 26, fontWeight: 800, color: THEME.nps.accent, margin: "4px 0" }}>NPS = +50</div>
                </Formula>
              </div>

              <div>
                <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 10 }}>
                  ESCALA DEL NPS (0–10)
                </div>
                <div style={{ display: "flex", gap: 3, marginBottom: 6, flexWrap: "wrap" }}>
                  {Array.from({ length: 11 }, (_, n) => n).map((n) => (
                    <span key={n} style={{
                      width: 26, height: 26, borderRadius: 6, fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      border: `1px solid ${zoneColor(n)}`, color: zoneColor(n),
                    }}>
                      {n}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, fontWeight: 700, marginBottom: 16 }}>
                  <span style={{ color: "#DC2626" }}>DETRACTORES (0–6)</span>
                  <span style={{ color: "#CA8A04" }}>PASIVOS (7–8)</span>
                  <span style={{ color: "#15803D" }}>PROMOTORES (9–10)</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  <NpsCard icon="🙂" color="#15803D" bg="#F0FDF4" pct="65%" n="65 clientes" label="Promotores" rango="Puntuación 9–10" text="Clientes entusiasmados y totalmente satisfechos. Te volverán a comprar y recomendarán tu tienda por voz a voz de forma gratuita." accion="Activa campañas de referidos y reseñas en Google." />
                  <NpsCard icon="😐" color="#CA8A04" bg="#FFFBEB" pct="20%" n="20 clientes" label="Pasivos" rango="Puntuación 7–8" text="Clientes neutros. Quedaron satisfechos, pero sin lealtad hacia tu marca; si la competencia ofrece las mismas Luces LED más baratas, se irán." accion="Envía cupón de descuento exclusivo para fidelizarlos." />
                  <NpsCard icon="🙁" color="#DC2626" bg="#FEF2F2" pct="15%" n="10 clientes" label="Detractores" rango="Puntuación 0–6" text="Clientes insatisfechos (por retrasos en el envío o fallas en el producto). Pueden dañar tu reputación con malas reseñas en redes sociales." accion="Contacta inmediatamente · ofrece reemplazo o reembolso." />
                </div>
              </div>
            </MetricSection>
          </div>

          {/* ── Resumen ── */}
          <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderLeft: `3px solid ${THEME.nps.accent}`, borderRadius: 14, padding: 28, marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <Star size={16} color={THEME.nps.accent} />
              <strong style={{ fontSize: 13, letterSpacing: "0.04em", color: "var(--fg)", textTransform: "uppercase" }}>Resumen de utilidad para dropshippers</strong>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14, marginBottom: 16 }}>
              <SummaryCard icon={MessageCircle} color={THEME.ces.accent} bg={THEME.ces.light} title="CES" subtitle="Reduce carritos abandonados" text="Optimiza la navegación, el chat y el proceso de pago para que el cliente resuelva sus dudas antes de pagar." />
              <SummaryCard icon={ThumbsUp} color={THEME.csat.accent} bg={THEME.csat.light} title="CSAT" subtitle="Controla tus proveedores" text="Evalúa la calidad de AliExpress, CJ Dropshipping y otros suppliers. Si el CSAT baja, cambia de proveedor." />
              <SummaryCard icon={TrendingUp} color={THEME.nps.accent} bg={THEME.nps.light} title="NPS" subtitle="Maximiza el LTV" text="Identifica a quién hacer campañas de retención (Promotores) y a quién resolver problemas antes de una queja pública (Detractores)." />
            </div>
            <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", margin: 0 }}>
              Dashboard CX · Dropshipping · Métricas NPS · CSAT · CES · 2026
            </p>
          </div>

          <p style={{ textAlign: "center", fontSize: 12.5, fontWeight: 700, color: THEME.nps.accent, marginBottom: 24 }}>
            › Practica el ciclo completo con el simulador interactivo
          </p>

          <Simulator />
        </div>
      </div>
      <HubFooter />
    </main>
  );
}

const pillLink: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 600, color: "#fff",
  background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 999,
  padding: "6px 14px", textDecoration: "none",
};

function ChatBubble({ children, align, accent }: { children: React.ReactNode; align: "left" | "right"; accent?: string }) {
  return (
    <div style={{
      alignSelf: align === "right" ? "flex-end" : "flex-start",
      maxWidth: "85%", fontSize: 12, lineHeight: 1.5, borderRadius: 10, padding: "8px 12px",
      background: align === "right" ? accent : "var(--bg)",
      color: align === "right" ? "#fff" : "var(--fg)",
    }}>
      {children}
    </div>
  );
}

function MiniPanel({ children }: { children: React.ReactNode }) {
  return <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10, padding: 14, marginBottom: 12 }}>{children}</div>;
}

function zoneColor(n: number) {
  if (n <= 6) return "#DC2626";
  if (n <= 8) return "#CA8A04";
  return "#15803D";
}

function NpsCard({ icon, color, bg, pct, n, label, rango, text, accion }: {
  icon: string; color: string; bg: string; pct: string; n: string; label: string; rango: string; text: string; accion: string;
}) {
  return (
    <div style={{ background: bg, border: `1px solid ${color}44`, borderRadius: 10, padding: 14 }}>
      <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{pct}</div>
      <div style={{ fontSize: 10.5, color: "var(--muted)", marginBottom: 8 }}>{n}</div>
      <strong style={{ fontSize: 12.5, color: "var(--fg)" }}>{label}</strong>
      <div style={{ fontSize: 10.5, fontWeight: 700, color, marginBottom: 6 }}>{rango}</div>
      <p style={{ fontSize: 11, color: "var(--fg)", lineHeight: 1.5, marginBottom: 8 }}>{text}</p>
      <p style={{ fontSize: 10.5, fontWeight: 600, color, margin: 0 }}>◎ {accion}</p>
    </div>
  );
}

function SummaryCard({ icon: Icon, color, bg, title, subtitle, text }: { icon: React.ElementType; color: string; bg: string; title: string; subtitle: string; text: string }) {
  return (
    <div style={{ background: bg, borderRadius: 10, padding: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
        <Icon size={15} color={color} />
        <strong style={{ fontSize: 13, color }}>{title}</strong>
      </div>
      <p style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px" }}>{subtitle}</p>
      <p style={{ fontSize: 11.5, color: "var(--muted)", lineHeight: 1.5, margin: 0 }}>{text}</p>
    </div>
  );
}

// ── Simulador interactivo ────────────────────────────────────────────────
type Step = {
  n: number; role: "Cliente" | "Dropshipper" | "Proveedor" | "Sistema"; tag: string;
  icon: React.ElementType; titulo: string; detalle: string;
  encuesta?: { metrica: string; color: string; pregunta: string; nota: string };
};

const ROLE_COLOR: Record<Step["role"], string> = {
  Cliente: "#2563EB", Dropshipper: "#EA580C", Proveedor: "#C2410C", Sistema: "#15803D",
};

const STEPS: Step[] = [
  { n: 1, role: "Cliente", tag: "Tienda online", icon: ShoppingBag, titulo: "Cliente encuentra el producto", detalle: "Diana busca «Luces LED H4» en tu tienda online y tiene dudas sobre la compatibilidad con su auto. Abre el chat de soporte.", encuesta: { metrica: "CES", color: THEME.ces.accent, pregunta: "¿Qué tan fácil fue resolver tus dudas sobre compatibilidad?", nota: "Se envía al cerrar el chat de soporte (pre-compra)." } },
  { n: 2, role: "Cliente", tag: "$42.00 USD", icon: CreditCard, titulo: "Cliente hace el pago", detalle: "Diana confirma el pedido: 1× Kit LED H4 6000K — $42.00 USD. El pago se procesa vía Stripe. Tu tienda recibe la orden #DS-2847." },
  { n: 3, role: "Dropshipper", tag: "CJ Dropshipping", icon: ClipboardList, titulo: "Dropshipper crea la orden al proveedor", detalle: "Tú (dropshipper) ingresas a CJ Dropshipping y haces el pedido del mismo producto por $9.80 USD. Indicas la dirección de Diana como destino final. Margen bruto: $32.20 USD." },
  { n: 4, role: "Proveedor", tag: "En tránsito", icon: PackageCheck, titulo: "Proveedor prepara y despacha", detalle: "El almacén en Shenzhen empaca el kit LED y lo entrega a YunExpress. Número de tracking: YT2400847326CN. Tiempo estimado: 7–12 días hábiles." },
  { n: 5, role: "Sistema", tag: "Email automático", icon: Bell, titulo: "Notificación de seguimiento al cliente", detalle: "Tu tienda envía un email automático a Diana con el número de tracking y el enlace de rastreo. Esto reduce la ansiedad del cliente durante la espera." },
  { n: 6, role: "Cliente", tag: "Día 9", icon: Truck, titulo: "Entrega al domicilio (día 9)", detalle: "El paquete con las Luces LED llega a casa de Diana. Condición del empaque: buena. El producto funciona correctamente en su auto Honda Civic 2019.", encuesta: { metrica: "CSAT", color: THEME.csat.accent, pregunta: "¿Qué tan satisfecha estás con la calidad de tus Luces LED y el tiempo de entrega?", nota: "Se envía por email 24h después de marcar el pedido como entregado." } },
  { n: 7, role: "Sistema", tag: "Día 30", icon: Send, titulo: "Campaña de retención (día 30)", detalle: "30 días después de la compra, tu sistema de email marketing envía la encuesta NPS a Diana junto con una oferta de accesorios relacionados (funda de volante, cargador USB).", encuesta: { metrica: "NPS", color: THEME.nps.accent, pregunta: "¿Qué probabilidad hay de que recomiendes nuestra tienda a un amigo?", nota: "Se envía a los 30 días post-compra mediante email marketing automatizado." } },
  { n: 8, role: "Dropshipper", tag: "Dashboard CX", icon: BarChart3, titulo: "Dropshipper revisa métricas CX", detalle: "Tú accedes al dashboard y ves: CES 6.2 (chat fluido ✓), CSAT 75% (proveedor aceptable), NPS +50 (Diana fue Promotora y recomendó tu tienda). Acción: optimizar proveedor para subir CSAT." },
];

function Simulator() {
  const [state, setState] = useState<"idle" | "running" | "done">("idle");
  const [step, setStep] = useState(1);
  const current = STEPS.find((s) => s.n === step)!;

  function reset() {
    setState("idle");
    setStep(1);
  }

  return (
    <div style={{ background: "var(--card)", border: `1px solid ${THEME.nps.accent}55`, borderTop: `3px solid ${THEME.nps.accent}`, borderRadius: 14, padding: 28 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: THEME.nps.light, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <PlayCircle size={20} color={THEME.nps.accent} />
          </div>
          <div>
            <div style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.08em", color: THEME.nps.accent, textTransform: "uppercase" }}>Caso interactivo · Simulador</div>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--fg)", margin: 0 }}>Crea una orden como Dropshipper</h2>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {(["Cliente", "Dropshipper", "Proveedor", "Sistema"] as const).map((r) => (
            <Badge key={r} color={ROLE_COLOR[r]}>{r}</Badge>
          ))}
        </div>
      </div>

      {/* progress bar */}
      <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
        {STEPS.map((s) => (
          <div key={s.n} style={{ flex: 1, height: 4, borderRadius: 999, background: (state !== "idle" && s.n <= step) ? THEME.nps.accent : "var(--border)" }} />
        ))}
      </div>
      <div style={{ textAlign: "right", fontSize: 11.5, color: "var(--muted)", marginBottom: 18 }}>
        {state === "idle" ? "Presiona \"Siguiente paso\" para comenzar" : `Paso ${step} de 8`}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 24 }}>
        {/* step list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {STEPS.map((s) => {
            const completed = state === "done" || (state === "running" && s.n < step);
            const active = state !== "idle" && s.n === step;
            return (
              <div key={s.n} style={{
                display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 10px", borderRadius: 8,
                background: active ? `${THEME.nps.accent}12` : "transparent",
                border: active ? `1px solid ${THEME.nps.accent}55` : "1px solid transparent",
              }}>
                {completed ? (
                  <CheckCircle2 size={18} color="#15803D" style={{ flexShrink: 0, marginTop: 1 }} />
                ) : (
                  <span style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0, fontSize: 10, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1,
                    background: active ? THEME.nps.accent : "var(--border)", color: active ? "#fff" : "var(--muted)",
                  }}>
                    {s.n}
                  </span>
                )}
                <div>
                  <div style={{ fontSize: 12, fontWeight: active ? 700 : 500, color: active ? THEME.nps.accent : "var(--fg)", lineHeight: 1.3 }}>{s.titulo}</div>
                  <div style={{ fontSize: 10.5, fontWeight: 600, color: ROLE_COLOR[s.role] }}>{s.role}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* detail panel */}
        <div>
          {state === "idle" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{
                width: 64, height: 64, borderRadius: "50%", background: THEME.nps.light, display: "flex",
                alignItems: "center", justifyContent: "center", margin: "0 auto 16px",
              }}>
                <PlayCircle size={30} color={THEME.nps.accent} />
              </div>
              <strong style={{ fontSize: 15, color: "var(--fg)" }}>Simulación: orden de Luces LED H4</strong>
              <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 380, margin: "8px auto 0", lineHeight: 1.6 }}>
                Recorre los 8 pasos del ciclo completo: desde que el cliente Diana hace su pedido hasta que tú
                analizas las métricas CX en tu dashboard.
              </p>
            </div>
          )}

          {state === "running" && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <div style={{ width: 34, height: 34, borderRadius: 8, border: `1px solid ${ROLE_COLOR[current.role]}55`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <current.icon size={16} color={ROLE_COLOR[current.role]} />
                </div>
                <Badge color={ROLE_COLOR[current.role]}>{current.role}</Badge>
                <span style={{ fontSize: 11.5, color: "var(--muted)" }}>{current.tag}</span>
              </div>
              <strong style={{ fontSize: 15, color: "var(--fg)" }}>{current.titulo}</strong>
              <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, background: "var(--bg)", borderRadius: 10, padding: 14, margin: "10px 0" }}>
                {current.detalle}
              </p>
              {current.encuesta && (
                <div style={{ border: `1px solid ${current.encuesta.color}55`, borderRadius: 10, padding: 14 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: current.encuesta.color, marginBottom: 6 }}>
                    🔔 ENCUESTA CX — {current.encuesta.metrica}
                  </div>
                  <p style={{ fontSize: 13, fontStyle: "italic", color: "var(--fg)", margin: "0 0 6px" }}>"{current.encuesta.pregunta}"</p>
                  <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                    <Info size={12} /> {current.encuesta.nota}
                  </p>
                </div>
              )}
            </div>
          )}

          {state === "done" && (
            <div style={{ textAlign: "center", padding: "24px 10px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#F0FDF4", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <CheckCircle2 size={30} color="#15803D" />
              </div>
              <strong style={{ fontSize: 17, color: "#15803D" }}>¡Ciclo completo! 🎉</strong>
              <p style={{ fontSize: 13, color: "var(--fg)", maxWidth: 400, margin: "10px auto 20px", lineHeight: 1.6 }}>
                Diana recibió sus Luces LED, quedó satisfecha (Promotora NPS 9/10) y ya recomendó tu tienda a
                2 amigos. Tu margen neto fue de <strong style={{ color: "#15803D" }}>$32.20 USD</strong> en esta orden.
              </p>
              <div style={{ display: "flex", justifyContent: "center", gap: 12 }}>
                <ResultBox value="6.2" label="CES" sub="" color={THEME.ces.accent} />
                <ResultBox value="75%" label="CSAT" sub="" color={THEME.csat.accent} />
                <ResultBox value="+50" label="NPS" sub="" color={THEME.nps.accent} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
        <button
          onClick={reset}
          style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--fg)", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 14px", cursor: "pointer" }}
        >
          <RotateCcw size={14} /> Reiniciar
        </button>

        {state !== "done" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {state === "running" && (
              <span style={{ fontSize: 12, color: "var(--muted)" }}>
                {step === 8 ? "Último paso" : `${8 - step} pasos restantes`}
              </span>
            )}
            <button
              onClick={() => {
                if (state === "idle") { setState("running"); setStep(1); return; }
                if (step < 8) { setStep((s) => s + 1); return; }
                setState("done");
              }}
              style={{ fontSize: 13, fontWeight: 700, color: "#fff", background: THEME.nps.accent, border: "none", borderRadius: 8, padding: "9px 18px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}
            >
              {step === 8 && state === "running" ? <>✓ Ver resultado final</> : <>Siguiente paso →</>}
            </button>
          </div>
        ) : (
          <button disabled style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 18px" }}>
            ✓ Ver resultado final
          </button>
        )}
      </div>
    </div>
  );
}
