"use client";

import { useState, useCallback } from "react";

const DROPI = "#FF6B35";
const RED = "#f85149";
const ORANGE = "#f97316";
const YELLOW = "#e3b341";
const GREEN = "#3fb950";
const GRAY = "#8b949e";

type Level = "abandono" | "critico" | "alerta" | "atencion" | "saludable";
type Role = "dropshipper" | "proveedor";

const LEVEL_COLORS: Record<Level, string> = {
  abandono: GRAY, critico: RED, alerta: ORANGE, atencion: YELLOW, saludable: GREEN,
};

const LEVEL_BG: Record<Level, string> = {
  abandono: "rgba(139,148,158,0.12)",
  critico: "rgba(248,81,73,0.12)",
  alerta: "rgba(249,115,22,0.12)",
  atencion: "rgba(227,179,65,0.10)",
  saludable: "rgba(63,185,80,0.12)",
};

const TINT_BG: Record<Level, string> = {
  abandono: "rgba(139,148,158,0.06)",
  critico: "rgba(248,81,73,0.06)",
  alerta: "rgba(249,115,22,0.06)",
  atencion: "rgba(227,179,65,0.04)",
  saludable: "rgba(63,185,80,0.04)",
};

type Order = {
  id: string; product: string; status: string; sla: string; level: Level;
  counterpart: string; tip: { title: string; body: string };
  actions: ("wa" | "esc" | "view")[];
};

const dropOrders: Order[] = [
  { id: "83086735", product: "DR.MELAXIN KOJIC-PEEL", status: "EN TRÁNSITO", sla: "5d · Abandono", level: "abandono", counterpart: "BeautyLab CO", tip: { title: "Acción sugerida", body: "Orden posiblemente perdida. Iniciar proceso de indemnización con el carrier." }, actions: ["wa", "esc"] },
  { id: "83086732", product: "Zapatos Ortopédicos Cuero", status: "NOVEDAD", sla: "38h · Crítico", level: "critico", counterpart: "CueroStyle", tip: { title: "Acción sugerida", body: "Contactar carrier por WhatsApp. Exigir actualización de estado en las próximas 4h." }, actions: ["wa", "esc"] },
  { id: "82914485", product: "FILTRO PRENSA PORTATIL", status: "NOVEDAD", sla: "28h · Alerta", level: "alerta", counterpart: "CaféTools", tip: { title: "Acción sugerida", body: "Verificar novedad y coordinar nueva entrega con carrier." }, actions: ["wa", "view"] },
  { id: "82925818", product: "INSIGNIA LED", status: "PENDIENTE", sla: "14h · Atención", level: "atencion", counterpart: "Wiilog CO", tip: { title: "Acción sugerida", body: "Proveedor no ha confirmado. Contactar por WhatsApp inmediatamente." }, actions: ["wa", "view"] },
  { id: "82887155", product: "Bolsa gato PRIVADO", status: "GUÍA GENERADA", sla: "6h · Saludable", level: "saludable", counterpart: "PetWorld", tip: { title: "Estado", body: "Todo en orden. La guía se generó hace 6 horas." }, actions: ["view"] },
];

const provOrders: Order[] = [
  { id: "83091201", product: "Sérum Vitamina C 30ml", status: "POR CONFIRMAR", sla: "18h · Crítico", level: "critico", counterpart: "TiendaSalud", tip: { title: "Acción requerida", body: "Confirmar disponibilidad de producto y generar guía inmediatamente. SLA superado." }, actions: ["wa", "esc"] },
  { id: "83088744", product: "Faja Reductora Térmica", status: "PENDIENTE", sla: "32h · Alerta", level: "alerta", counterpart: "FitStore", tip: { title: "Acción requerida", body: "Generar guía de envío y programar recogida con el carrier." }, actions: ["wa", "view"] },
  { id: "83090102", product: "Cargador Inalámbrico 15W", status: "POR CONFIRMAR", sla: "8h · Atención", level: "atencion", counterpart: "TechMundo", tip: { title: "Acción requerida", body: "Confirmar disponibilidad del producto." }, actions: ["view"] },
];

type StockItem = { name: string; warehouses: string; sku: string; stock: number; level: Level; detail: string };
const stockItems: StockItem[] = [
  { name: "Sérum Vitamina C 30ml", warehouses: "3 bodegas", sku: "SKU-4821", stock: 3, level: "critico", detail: "Bogotá: 3 uds · Medellín: 0 uds · Cali: 12 uds" },
  { name: "Faja Reductora Térmica", warehouses: "2 bodegas", sku: "SKU-7733", stock: 8, level: "critico", detail: "Bogotá: 8 uds · Barranquilla: 0 uds" },
  { name: "Cargador Inalámbrico 15W", warehouses: "2 bodegas", sku: "SKU-9102", stock: 42, level: "alerta", detail: "Bogotá: 42 uds · Medellín: 15 uds" },
  { name: "Audífonos Bluetooth TWS", warehouses: "2 bodegas", sku: "SKU-5540", stock: 88, level: "atencion", detail: "Bogotá: 88 uds · Cali: 5 uds" },
];

const slaTable = [
  { status: "POR CONFIRMAR", sla: "12h", level: "atencion" as Level, who: "Proveedor", action: "WhatsApp al proveedor" },
  { status: "PENDIENTE", sla: "24h", level: "atencion" as Level, who: "Proveedor", action: "Confirmar y despachar" },
  { status: "GUÍA GENERADA", sla: "48h", level: "alerta" as Level, who: "Carrier", action: "Verificar recogida" },
  { status: "RECOGIDO", sla: "24h", level: "atencion" as Level, who: "Carrier", action: "Monitorear tránsito" },
  { status: "EN TRÁNSITO", sla: "72h", level: "alerta" as Level, who: "Carrier", action: "Rastrear paquete" },
  { status: "NOVEDAD", sla: "24h", level: "critico" as Level, who: "Carrier + Dropshipper", action: "Escalar a líder carrier" },
];

function Badge({ level, children }: { level: Level; children: React.ReactNode }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 8, fontSize: 10, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", whiteSpace: "nowrap", background: LEVEL_BG[level], color: LEVEL_COLORS[level] }}>
      {children}
    </span>
  );
}

function ActionBtn({ type }: { type: "wa" | "esc" | "view" }) {
  const styles: Record<string, React.CSSProperties> = {
    wa: { background: "#25D366", borderColor: "#25D366", color: "white" },
    esc: { background: "rgba(248,81,73,0.12)", borderColor: "rgba(248,81,73,0.2)", color: RED },
    view: { background: "#242d3a", color: "rgba(255,255,255,0.35)" },
  };
  const icons = { wa: "💬", esc: "⬆", view: "👁" };
  return (
    <span style={{ width: 28, height: 28, borderRadius: 7, border: "1px solid rgba(255,255,255,0.12)", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 14, cursor: "default", ...styles[type] }}>
      {icons[type]}
    </span>
  );
}

export default function VigiaConcept() {
  const [role, setRole] = useState<Role>("dropshipper");
  const [tooltip, setTooltip] = useState<{ x: number; y: number; title: string; body: string } | null>(null);

  const showTip = useCallback((e: React.MouseEvent, title: string, body: string) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({ x: Math.min(rect.left, window.innerWidth - 280), y: rect.bottom + 8, title, body });
  }, []);
  const hideTip = useCallback(() => setTooltip(null), []);

  const bg = "#0d1117";
  const bg1 = "#151b24";
  const bg2 = "#1c232e";
  const border = "rgba(255,255,255,0.06)";
  const text = "#e6edf3";
  const text2 = "rgba(255,255,255,0.65)";
  const text3 = "rgba(255,255,255,0.35)";

  const th: React.CSSProperties = { textAlign: "left", padding: "10px 12px", fontSize: 11, fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.04em", background: bg2, borderBottom: `1px solid ${border}` };
  const td: React.CSSProperties = { padding: 12, fontSize: 13, borderBottom: `1px solid ${border}`, verticalAlign: "middle" };

  return (
    <div style={{ fontFamily: "'IBM Plex Sans', -apple-system, sans-serif", color: text, WebkitFontSmoothing: "antialiased" }}>
      {/* Problem cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, margin: "24px 0" }}>
        {[
          { num: "59%", color: RED, label: "Tasa de entrega actual" },
          { num: "70%", color: GREEN, label: "Meta de entrega" },
          { num: "3.4M", color: DROPI, label: "Órdenes / mes" },
        ].map((c) => (
          <div key={c.label} style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 12, padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 36, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", lineHeight: 1, color: c.color }}>{c.num}</div>
            <div style={{ fontSize: 12, color: text3, marginTop: 6 }}>{c.label}</div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ fontSize: 10, fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Cómo funciona</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {[
          { n: 1, t: "Intercepta", d: "Parcha fetch/XHR y captura cada respuesta de api.dropi.co en tiempo real" },
          { n: 2, t: "Calcula", d: "Motor SLA evalúa cada orden contra umbrales por estado (12h–72h)" },
          { n: 3, t: "Inyecta", d: "Badges, tints y CTAs aparecen directo en la tabla de Dropi" },
          { n: 4, t: "Acciona", d: "WhatsApp al proveedor/carrier, escalar, exportar — un click" },
        ].map((s) => (
          <div key={s.n} style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 12, padding: "20px 16px", textAlign: "center" }}>
            <div style={{ width: 24, height: 24, borderRadius: 12, background: DROPI, color: "white", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px" }}>{s.n}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>{s.t}</div>
            <div style={{ fontSize: 11, color: text3, lineHeight: 1.4 }}>{s.d}</div>
          </div>
        ))}
      </div>

      {/* Role tabs */}
      <div style={{ fontSize: 10, fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Demo interactiva por rol</div>
      <div style={{ display: "flex", gap: 4, background: bg1, borderRadius: 12, padding: 4, marginBottom: 20, border: `1px solid ${border}` }}>
        {(["dropshipper", "proveedor"] as Role[]).map((r) => (
          <button key={r} onClick={() => setRole(r)} style={{ flex: 1, padding: "12px 16px", borderRadius: 10, border: "none", background: role === r ? DROPI : "none", color: role === r ? "white" : text3, fontSize: 14, fontWeight: 600, fontFamily: "'IBM Plex Sans', sans-serif", cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" }}>
            {r}
          </button>
        ))}
      </div>

      {/* Dropshipper panel */}
      {role === "dropshipper" && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, animation: "vigiaBlink 2s infinite" }} />
            Vista en vivo — /dashboard/orders
          </div>

          {/* Summary bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: bg, borderRadius: 10, border: `1px solid rgba(255,107,53,0.25)`, marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: DROPI }}>👁 Vigía</span>
              <span style={{ fontSize: 24, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color: RED }}>22</span>
              <span style={{ fontSize: 12, color: text2 }}>órdenes necesitan acción</span>
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color: RED }}>· $2,389,376 en riesgo</span>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", background: "rgba(249,115,22,0.12)", color: ORANGE }}>EN TRÁNSITO 42</span>
              <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", background: "rgba(248,81,73,0.12)", color: RED }}>NOVEDAD 12</span>
              <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", background: "rgba(227,179,65,0.10)", color: YELLOW }}>PENDIENTE 8</span>
            </div>
          </div>

          {/* Orders table */}
          <div style={{ width: "100%", background: bg1, borderRadius: 12, overflow: "hidden", border: `1px solid ${border}` }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead><tr><th style={th}>ID</th><th style={th}>Producto</th><th style={th}>Estado</th><th style={th}>SLA</th><th style={th}>Proveedor</th><th style={th}></th></tr></thead>
              <tbody>
                {dropOrders.map((o) => (
                  <tr key={o.id} style={{ cursor: "default" }} onMouseEnter={(e) => showTip(e, o.tip.title, o.tip.body)} onMouseLeave={hideTip}>
                    <td style={{ ...td, background: TINT_BG[o.level] }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 12 }}>{o.id}</span></td>
                    <td style={{ ...td, background: TINT_BG[o.level], color: text2, fontSize: 12, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product}</td>
                    <td style={{ ...td, background: TINT_BG[o.level] }}>{o.status}</td>
                    <td style={{ ...td, background: TINT_BG[o.level] }}><Badge level={o.level}>{o.sla}</Badge></td>
                    <td style={{ ...td, background: TINT_BG[o.level], fontSize: 12, color: text3 }}>{o.counterpart}</td>
                    <td style={{ ...td, background: TINT_BG[o.level] }}>
                      <div style={{ display: "flex", gap: 4 }}>{o.actions.map((a) => <ActionBtn key={a} type={a} />)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* WhatsApp action */}
          <div style={{ fontSize: 10, fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 20, marginBottom: 10 }}>Acción clave: WhatsApp directo al proveedor</div>
          <div style={{ background: bg1, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 16px", fontSize: 12, color: text2, lineHeight: 1.5 }}>
            Cuando una orden no se ha despachado, Vigía extrae el <strong style={{ color: text }}>número de WhatsApp del proveedor</strong> directamente del objeto API y pre-arma el mensaje:
            <div style={{ background: bg, borderRadius: 8, padding: "10px 12px", fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: "#25D366", borderLeft: "3px solid #25D366", marginTop: 12 }}>
              🚨 Orden #83086732 — PENDIENTE hace 14h.<br />
              Producto: INSIGNIA LED<br />
              SLA: 24h | Nivel: Atención<br />
              ¿Puedes confirmar disponibilidad y despacho?
            </div>
          </div>
        </div>
      )}

      {/* Proveedor panel */}
      {role === "proveedor" && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: GREEN, animation: "vigiaBlink 2s infinite" }} />
            Vista en vivo — /dashboard/orders/supplier
          </div>

          {/* Summary bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: bg, borderRadius: 10, border: `1px solid rgba(255,107,53,0.25)`, marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: DROPI }}>👁 Vigía · Proveedor</span>
              <span style={{ fontSize: 24, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color: RED }}>8</span>
              <span style={{ fontSize: 12, color: text2 }}>órdenes por gestionar</span>
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color: RED }}>· $868,864 en riesgo</span>
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", background: "rgba(248,81,73,0.12)", color: RED }}>POR CONFIRMAR 5</span>
              <span style={{ padding: "4px 10px", borderRadius: 8, fontSize: 11, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", background: "rgba(249,115,22,0.12)", color: ORANGE }}>SIN GUÍA 3</span>
            </div>
          </div>

          {/* Orders table */}
          <div style={{ width: "100%", background: bg1, borderRadius: 12, overflow: "hidden", border: `1px solid ${border}` }}>
            <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
              <thead><tr><th style={th}>ID</th><th style={th}>Producto</th><th style={th}>Estado</th><th style={th}>SLA</th><th style={th}>Dropshipper</th><th style={th}></th></tr></thead>
              <tbody>
                {provOrders.map((o) => (
                  <tr key={o.id} style={{ cursor: "default" }} onMouseEnter={(e) => showTip(e, o.tip.title, o.tip.body)} onMouseLeave={hideTip}>
                    <td style={{ ...td, background: TINT_BG[o.level] }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", fontWeight: 600, fontSize: 12 }}>{o.id}</span></td>
                    <td style={{ ...td, background: TINT_BG[o.level], color: text2, fontSize: 12, maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{o.product}</td>
                    <td style={{ ...td, background: TINT_BG[o.level] }}>{o.status}</td>
                    <td style={{ ...td, background: TINT_BG[o.level] }}><Badge level={o.level}>{o.sla}</Badge></td>
                    <td style={{ ...td, background: TINT_BG[o.level], fontSize: 12, color: text3 }}>{o.counterpart}</td>
                    <td style={{ ...td, background: TINT_BG[o.level] }}>
                      <div style={{ display: "flex", gap: 4 }}>{o.actions.map((a) => <ActionBtn key={a} type={a} />)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Stock monitor */}
          <div style={{ fontSize: 10, fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 24, marginBottom: 10 }}>Monitor de Stock — /dashboard/products</div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 16px", background: bg, borderRadius: 10, border: "1px solid rgba(248,81,73,0.25)", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: DROPI }}>📦 Stock</span>
              <span style={{ fontSize: 20, fontWeight: 600, fontFamily: "'IBM Plex Mono', monospace", color: RED }}>4</span>
              <span style={{ fontSize: 12, color: text2 }}>productos en riesgo de quiebre</span>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {stockItems.map((s) => (
              <div key={s.sku} style={{ background: bg1, border: `1px solid ${s.level === "critico" ? "rgba(248,81,73,0.2)" : border}`, borderRadius: 10, padding: 14, display: "flex", alignItems: "center", gap: 12, cursor: "default" }} onMouseEnter={(e) => showTip(e, "Stock por bodega", s.detail)} onMouseLeave={hideTip}>
                <div style={{ width: 36, height: 36, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, background: LEVEL_BG[s.level], flexShrink: 0 }}>
                  {s.level === "critico" ? "🔴" : s.level === "alerta" ? "🟠" : "🟡"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</div>
                  <div style={{ fontSize: 11, color: text3, marginTop: 2 }}>{s.warehouses} · {s.sku}</div>
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "'IBM Plex Mono', monospace", padding: "2px 8px", borderRadius: 6, background: LEVEL_BG[s.level], color: LEVEL_COLORS[s.level], whiteSpace: "nowrap" }}>
                  {s.stock} uds
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SLA table */}
      <div style={{ fontSize: 10, fontWeight: 600, color: text3, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 28, marginBottom: 10 }}>Umbrales SLA por estado</div>
      <div style={{ width: "100%", background: bg1, borderRadius: 12, overflow: "hidden", border: `1px solid ${border}` }}>
        <table style={{ width: "100%", borderCollapse: "separate", borderSpacing: 0 }}>
          <thead><tr><th style={th}>Estado</th><th style={th}>SLA</th><th style={th}>Quién controla</th><th style={th}>Acción Vigía</th></tr></thead>
          <tbody>
            {slaTable.map((r) => (
              <tr key={r.status}>
                <td style={{ ...td, fontWeight: 600 }}>{r.status}</td>
                <td style={td}><Badge level={r.level}>{r.sla}</Badge></td>
                <td style={{ ...td, fontSize: 12, color: text3 }}>{r.who}</td>
                <td style={{ ...td, fontSize: 12 }}>{r.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ textAlign: "center", padding: "32px 0 16px", fontSize: 11, color: text3, borderTop: `1px solid ${border}`, marginTop: 40 }}>
        <strong style={{ color: DROPI, fontWeight: 600 }}>Vigía v4</strong> · Chrome Extension · Manifest V3 · Dropi Product Team<br />
        Interceptor API-first · Hybrid DOM fallback · Angular-resilient polling
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{ position: "fixed", left: tooltip.x, top: tooltip.y, background: bg, border: `1px solid ${DROPI}`, borderRadius: 10, padding: "12px 16px", fontSize: 12, color: text, maxWidth: 260, zIndex: 100, pointerEvents: "none", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}>
          <div style={{ fontWeight: 600, color: DROPI, marginBottom: 4, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.04em" }}>{tooltip.title}</div>
          <div>{tooltip.body}</div>
        </div>
      )}

      {/* CSS animation */}
      <style>{`@keyframes vigiaBlink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }`}</style>
    </div>
  );
}
