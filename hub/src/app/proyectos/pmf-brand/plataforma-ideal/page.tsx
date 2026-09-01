"use client";

// Prototipo interno — Roadmap de Marcas (priorizar, no diseñar desde cero).
// Fuente: agente-delivery/Documentos/prompt-plataforma-ideal-marcas-26ago2026.md
//   (mismo insumo que se le pasó a Lovable para la versión pública de cara a marcas).
// Reemplaza la v1 "blank slate" — Kate corrigió el enfoque 26-ago-2026: no se
// puede ignorar lo que Dropi ya tiene (ej. el cotizador de tarifas ya existe,
// no es un gap a priorizar). Esto ya no es un ejercicio de diseño libre: son
// las capacidades que BAU (base activa) y PMF (17 marcas-lead) ya
// identificaron, organizadas en 3 temas simples para que una marca las
// priorice. Esta versión es SOLO para revisión del equipo interno (login del
// hub) antes de mandar la versión pública de Lovable a marcas reales.
// Votación: guardada en localStorage (sesión del equipo, no compartida entre
// dispositivos) — la versión de Lovable guarda esto en base de datos real.

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "20px 22px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginTop: 32,
  marginBottom: 12,
};
const arrowBtn = (disabled: boolean): React.CSSProperties => ({
  width: 24, height: 20, borderRadius: 5, border: "1px solid var(--border)",
  background: disabled ? "var(--border)" : "var(--card)", color: disabled ? "var(--muted)" : "var(--fg)",
  fontSize: 10, cursor: disabled ? "not-allowed" : "pointer", lineHeight: 1, padding: 0,
});
const CATEGORIA_COLOR: Record<string, { color: string; bg: string }> = {
  ERP: { color: "#7C3AED", bg: "#F5F3FF" },
  Tienda: { color: "#0D9488", bg: "#F0FDFA" },
  Marketplace: { color: "#1D4ED8", bg: "#EFF6FF" },
  Crédito: { color: "#B45309", bg: "#FFFBEB" },
};
const tagChip = (categoria: string): React.CSSProperties => {
  const c = CATEGORIA_COLOR[categoria] ?? { color: "var(--muted)", bg: "var(--border)" };
  return {
    fontSize: 9.5, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
    padding: "2px 7px", borderRadius: 4, color: c.color, background: c.bg, whiteSpace: "nowrap",
  };
};
const statusChip = (color: string, bg: string): React.CSSProperties => ({
  fontSize: 10, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase",
  padding: "3px 9px", borderRadius: 4, color, background: bg, whiteSpace: "nowrap",
});

// ─── Los 3 temas — capacidades ya identificadas por BAU + PMF, no inventadas ──
type Item = { key: string; nombre: string; detalle: string; categoria?: string };
type Tema = { key: "plataforma" | "integraciones" | "servicio"; emoji: string; label: string; intro?: string; items: Item[] };

const TEMAS: Tema[] = [
  {
    key: "plataforma",
    emoji: "🏗️",
    label: "Plataforma",
    items: [
      { key: "p1", nombre: "Centro de novedades y devoluciones", detalle: "Esto no es que el pedido se arregle solo — siempre va a necesitar seguimiento. Es que ese seguimiento sea más fácil: tracking con tu marca, evidencia de la entrega y un flujo claro para devoluciones, todo en un solo lugar, en vez de armarlo tú a mano." },
      { key: "p2", nombre: "Reportes financieros separados: ventas propias, wallet y devoluciones", detalle: "Cuando manejas tu propio inventario y además otros venden tu catálogo, necesitas ver por separado cuánto vendiste tú directamente, cuánto generaron terceros, tus movimientos de saldo (wallet), y cómo pegan las devoluciones en tu caja — sin sumar manualmente entre dos cuentas." },
      { key: "p3", nombre: "Sincronización de inventario en tiempo real", detalle: "Dropi ya registra cuántas unidades tienes, pero eso hoy no se actualiza solo con tu tienda ni con tu bodega. Si vendes en más de un lugar, puedes terminar vendiendo algo que ya no tienes. Esto sincroniza esa cantidad entre tu tienda, tu bodega y Dropi, en tiempo real." },
      { key: "p4", nombre: "La entrega se adapta a tu operación, no al revés", detalle: "Si dependes de una sola transportadora hoy, un mal día de ella es un mal día tuyo. Esto es elegir automáticamente la mejor opción por pedido, o usar tu propio mensajero cuando te conviene más." },
      { key: "p5", nombre: "Cobro y protección flexible por pedido", detalle: "No todos tus pedidos son iguales: a veces despachas un volumen grande a otro negocio (B2B), a veces quieres cobrar solo el flete porque el producto ya se pagó aparte, o necesitas asegurar el pedido para no perder plata si te lo devuelven. Hoy la plataforma no te deja elegir esto pedido por pedido." },
      { key: "p6", nombre: "Gestión de combos y kits", detalle: "Un kit o combo mueve varios productos a la vez — sabemos que eso desordena tu inventario si el sistema no lo entiende como una sola unidad de venta." },
      { key: "p7", nombre: "Notificaciones automáticas al comprador", detalle: "Hoy dependes de una herramienta externa y de pago para avisarle a tu comprador que su pedido va en camino o fue entregado — un costo extra y un eslabón que no controlas tú. Esto es aparte de resolver una novedad: es que tu comprador esté informado durante todo el trayecto, no solo cuando algo falla." },
      { key: "p8", nombre: "Fulfillment: Dropi como tu bodega", detalle: "Si no quieres manejar tu propia bodega, que Dropi almacene tu inventario y despache por ti — sin que tengas que operar tú misma el almacenamiento y el picking." },
      { key: "p9", nombre: "Última milla propia o aliada", detalle: "El tramo final hasta la puerta de tu cliente es el que más se nota. Poder elegir cómo se resuelve — con tu propio mensajero o con un aliado especializado en tu zona." },
      { key: "p10", nombre: "Entrega el mismo día (Same Day)", detalle: "Cuando un cliente necesita su pedido hoy mismo, poder ofrecerlo sin que se vuelva un proceso manual aparte." },
      { key: "p11", nombre: "Tarifas especiales por volumen", detalle: "Mientras más pedidos despachas, más debería bajar tu costo por pedido — hoy eso depende de negociarlo caso a caso con tu comercial, no de una estructura clara." },
    ],
  },
  {
    key: "integraciones",
    emoji: "🔌",
    label: "Integraciones",
    items: [
      { key: "i1", nombre: "SIIGO — tu contabilidad conectada", categoria: "ERP", detalle: "Si ya llevas tu contabilidad en SIIGO, hoy registras cada pedido dos veces — la guía por un lado, la factura por otro. Conectarlo mueve solas la venta, la nota crédito de una devolución, y el costo real de tu producto entre las dos plataformas." },
      { key: "i2", nombre: "SIESA — tu contabilidad conectada", categoria: "ERP", detalle: "Lo mismo que con SIIGO, pero si tu contabilidad está en SIESA: que la venta, la devolución y el costo real de tu producto se muevan solos, sin doble registro." },
      { key: "i3", nombre: "Shopify", categoria: "Tienda", detalle: "Si tu tienda está en Shopify, que tu inventario y tus pedidos se conecten directo con Dropi, sin migrar de plataforma para trabajar con nosotros." },
      { key: "i5", nombre: "VTEX", categoria: "Tienda", detalle: "Lo mismo si tu operación corre sobre VTEX — conexión directa, sin tener que cambiar de plataforma de tienda." },
      { key: "i6", nombre: "Mercado Libre", categoria: "Marketplace", detalle: "El marketplace que más marcas ya usan o quieren centralizar junto con su operación." },
      { key: "i7", nombre: "Rappi", categoria: "Marketplace", detalle: "Vitrina, venta y en algunos casos entrega rápida local, en un solo lugar." },
      { key: "i8", nombre: "Falabella", categoria: "Marketplace", detalle: "Relevante si tu marca es de moda o retail." },
      { key: "i9", nombre: "Éxito", categoria: "Marketplace", detalle: "Canal de retail/marketplace local relevante para varias categorías." },
      { key: "i10", nombre: "Amazon", categoria: "Marketplace", detalle: "Relevante si tu marca ya vende fuera de Colombia o tiene esa visión." },
      { key: "i11", nombre: "TikTok Shop", categoria: "Marketplace", detalle: "Relevante si vendes por contenido o redes." },
      { key: "i13", nombre: "Crédito al consumidor en el checkout", categoria: "Crédito", detalle: "Muchas marcas ya ofrecen Addi o Sistecrédito a sus compradores — que la plataforma reconozca ese pedido como pagado, no como pendiente." },
    ],
  },
  {
    key: "servicio",
    emoji: "🤝",
    label: "Acompañamiento y soporte",
    intro: "Que sientas que Dropi te respalda cuando algo sale mal — no que estás resolviendo esto sola.",
    items: [
      { key: "s2", nombre: "Un comercial que de verdad te acompañe", detalle: "Sabemos que estar \"asignada en el papel\" no es lo mismo que sentir que alguien te está gestionando — 4 de las últimas 4 marcas que entrevistamos nos dijeron justo eso." },
      { key: "s3", nombre: "Que el soporte responda en un tiempo razonable, sea Customer Success o SAC", detalle: "Hoy no sabes cuánto va a tardar una respuesta, venga por Customer Success o por atención al cliente (SAC). Solo queremos que tengas un tiempo claro de espera, no una caja negra." },
      { key: "s4", nombre: "Un proceso claro de a dónde y cómo reportar un problema", detalle: "Cuando algo falla, hoy no siempre es obvio si hay que escribirle a tu comercial, a soporte técnico o a SAC. Queremos que sepas el canal correcto sin adivinar ni perder tiempo buscando a quién escribirle." },
    ],
  },
];

const STORAGE_KEY = "roadmap-marcas-v3";

type Voto = {
  id: string;
  nombre: string;
  segmento: string;
  ordenes: Record<string, string[]>;
  noAplica: Record<string, boolean>;
  feedbackTemas: Record<string, string>;
  feedbackGeneral: string;
  ts: number;
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ordenInicial(): Record<string, string[]> {
  const o: Record<string, string[]> = {};
  for (const t of TEMAS) o[t.key] = t.items.map((i) => i.key);
  return o;
}

export default function RoadmapMarcasPage() {
  const [votos, setVotos] = useState<Voto[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [nombre, setNombre] = useState("");
  const [segmento, setSegmento] = useState("");
  const [ordenes, setOrdenes] = useState<Record<string, string[]>>(ordenInicial());
  const [noAplica, setNoAplica] = useState<Record<string, boolean>>({});

  // ─── Mockup — lo que le falta a la plataforma, en pantallas ────────────
  const [mockupTab, setMockupTab] = useState<"hoy" | "novedad" | "inventario" | "envios" | "integraciones" | "comercial" | "reportes">("hoy");
  const [novedadResuelta, setNovedadResuelta] = useState(false);
  const [fulfillmentOn, setFulfillmentOn] = useState(false);
  const [transportadoraModo, setTransportadoraModo] = useState<"auto" | "propio">("auto");
  const [sameDayOn, setSameDayOn] = useState(false);
  const [cobroFleteOn, setCobroFleteOn] = useState(false);
  const [seguroOn, setSeguroOn] = useState(false);
  const [conectadas, setConectadas] = useState<Record<string, boolean>>({ SIIGO: true, Shopify: true, "Mercado Libre": true, "Crédito al consumidor": true });
  const [feedbackTemas, setFeedbackTemas] = useState<Record<string, string>>({});
  const [feedbackGeneral, setFeedbackGeneral] = useState("");

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setVotos(JSON.parse(raw));
    } catch {
      // localStorage puede fallar — se sigue sin historial previo.
    }
    const shuffled: Record<string, string[]> = {};
    for (const t of TEMAS) shuffled[t.key] = shuffle(t.items.map((i) => i.key));
    setOrdenes(shuffled);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(votos));
    } catch {
      // ver nota arriba.
    }
  }, [votos, loaded]);

  function mover(temaKey: string, index: number, direccion: -1 | 1) {
    const lista = ordenes[temaKey];
    const destino = index + direccion;
    if (destino < 0 || destino >= lista.length) return;
    const next = [...lista];
    [next[index], next[destino]] = [next[destino], next[index]];
    setOrdenes({ ...ordenes, [temaKey]: next });
  }

  function registrarVoto() {
    if (!nombre.trim()) return;
    const voto: Voto = {
      id: `${Date.now()}-${Math.random()}`,
      nombre: nombre.trim(),
      segmento,
      ordenes,
      noAplica: { ...noAplica },
      feedbackTemas: { ...feedbackTemas },
      feedbackGeneral: feedbackGeneral.trim(),
      ts: Date.now(),
    };
    setVotos([...votos, voto]);
    setNombre("");
    setSegmento("");
    const shuffled: Record<string, string[]> = {};
    for (const t of TEMAS) shuffled[t.key] = shuffle(t.items.map((i) => i.key));
    setOrdenes(shuffled);
    setNoAplica({});
    setFeedbackTemas({});
    setFeedbackGeneral("");
  }

  function reiniciar() {
    if (!window.confirm("¿Borrar todos los votos registrados en esta sesión?")) return;
    setVotos([]);
  }

  const feedbacksGenerales = votos.filter((v) => v.feedbackGeneral).map((v) => ({ nombre: v.nombre, texto: v.feedbackGeneral }));

  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "24px 32px 0" }}>
        <Breadcrumb items={[{ label: "Proyectos", href: "/proyectos" }, { label: "PMF Brand", href: "/proyectos/pmf-brand" }, { label: "Roadmap (prototipo)" }]} />
      </div>

      {/* Header */}
      <div style={{ background: "var(--fg)", padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi · Priorización con marcas reales · agosto 2026
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            Ayúdanos a decidir qué construimos primero
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.6)", lineHeight: 1.5, maxWidth: "60ch" }}>
            No es evaluar un producto terminado — es ordenar, en 3 temas simples, lo que más necesitas hoy.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 32px" }}>

        {/* SEGMENTO */}
        <div style={{ ...card, borderRadius: 0, borderTop: "none", marginTop: 0 }}>
          <div style={sectionLabel as React.CSSProperties}>Antes de empezar</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Tu nombre" style={{ fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)" }} />
            <select value={segmento} onChange={(e) => setSegmento(e.target.value)} style={{ fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)" }}>
              <option value="">Pedidos/mes (opcional)</option>
              <option value="1-50">1-50</option>
              <option value="51-300">51-300</option>
              <option value="301-700">301-700</option>
              <option value="701-1000">701-1.000</option>
              <option value="1000+">1.000+</option>
            </select>
          </div>
        </div>

        {/* MOCKUP — lo que le falta a la plataforma */}
        <div style={sectionLabel}>Prototipo — lo que le falta a la plataforma hoy</div>
        <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 14 }}>
          7 pantallas que muestran, en contexto, las 25 capacidades que vas a priorizar abajo — no todas tienen
          pantalla propia todavía, pero las más representativas de cada tema sí.
        </p>
        <div style={{ display: "flex", gap: 6, marginBottom: 14, flexWrap: "wrap" }}>
          {([
            { id: "hoy", label: "Hoy" },
            { id: "novedad", label: "Centro de novedades" },
            { id: "inventario", label: "Inventario" },
            { id: "envios", label: "Envíos" },
            { id: "integraciones", label: "Integraciones" },
            { id: "comercial", label: "Mi comercial" },
            { id: "reportes", label: "Reportes" },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setMockupTab(t.id)}
              style={{
                fontSize: 12, fontWeight: 700, padding: "7px 14px", borderRadius: 999, cursor: "pointer",
                border: mockupTab === t.id ? "1.5px solid var(--dropi)" : "1px solid var(--border)",
                background: mockupTab === t.id ? "var(--dropi-light)" : "transparent",
                color: mockupTab === t.id ? "var(--dropi)" : "var(--muted)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div style={{ ...card, minHeight: 220, marginBottom: 28 }}>
          {mockupTab === "hoy" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14 }}>Buenos días — así va tu operación hoy</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 }}>
                <div style={{ padding: 14, borderRadius: 10, background: "var(--dropi-light)" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "var(--dropi)" }}>34</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>pedidos despachados hoy</div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, background: "#FEF2F2" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#DC2626" }}>3</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>novedades sin resolver</div>
                </div>
                <div style={{ padding: 14, borderRadius: 10, background: "#F0FDF4" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#16A34A" }}>$1.240.500</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>saldo disponible</div>
                </div>
              </div>
              <span style={statusChip("#B45309", "#FFFBEB")}>Tarifas especiales por volumen — activas para tu cuenta</span>
            </div>
          )}

          {mockupTab === "novedad" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>Pedido #48213 — Dirección no encontrada</div>
              <div style={{ fontSize: 11.5, color: "var(--muted)", marginBottom: 16 }}>Cliente: María G. · Transportadora: Coordinadora · Hace 2h</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
                {[
                  { label: "Pedido despachado", done: true },
                  { label: "Aviso automático enviado al comprador", done: true },
                  { label: "Novedad reportada por transportadora", done: true },
                  { label: novedadResuelta ? "Resuelto — reintento programado" : "Esperando tu acción", done: novedadResuelta },
                ].map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: s.done ? "var(--fg)" : "var(--muted)" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: s.done ? "var(--dropi)" : "var(--border)" }} />
                    {s.label}
                  </div>
                ))}
              </div>
              {!novedadResuelta ? (
                <button onClick={() => setNovedadResuelta(true)} style={{ fontSize: 12.5, fontWeight: 700, color: "white", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer" }}>
                  Confirmar nueva dirección y reintentar →
                </button>
              ) : (
                <span style={statusChip("#16A34A", "#F0FDF4")}>Resuelto — evidencia y devolución quedan en el historial</span>
              )}
            </div>
          )}

          {mockupTab === "inventario" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)" }}>Stock por canal — sincronizado en tiempo real</div>
                <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)", cursor: "pointer" }}>
                  <input type="checkbox" checked={fulfillmentOn} onChange={(e) => setFulfillmentOn(e.target.checked)} />
                  Fulfillment: Dropi es mi bodega
                </label>
              </div>
              {[
                { producto: "Faja reductora talla M", canal: fulfillmentOn ? "Bodega Dropi" : "Tu bodega", stock: 2, alerta: true },
                { producto: "Kit skincare x3 (combo)", canal: fulfillmentOn ? "Bodega Dropi" : "Tu bodega", stock: 0, alerta: true },
                { producto: "Combo verano x12", canal: fulfillmentOn ? "Bodega Dropi" : "Tu bodega + Mercado Libre", stock: 1, alerta: true },
                { producto: "Bolso tote básico", canal: fulfillmentOn ? "Bodega Dropi" : "Tu bodega", stock: 48, alerta: false },
              ].map((p) => (
                <div key={p.producto} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)" }}>{p.producto}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>{p.canal}</div>
                  </div>
                  <span style={statusChip(p.alerta ? "#DC2626" : "#16A34A", p.alerta ? "#FEF2F2" : "#F0FDF4")}>{p.stock} unidades</span>
                </div>
              ))}
            </div>
          )}

          {mockupTab === "envios" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14 }}>Configura este envío</div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", marginBottom: 6 }}>ÚLTIMA MILLA</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {([{ id: "auto", label: "Elegir mejor transportadora" }, { id: "propio", label: "Mi propio mensajero" }] as const).map((o) => (
                    <button key={o.id} onClick={() => setTransportadoraModo(o.id)} style={{
                      fontSize: 12, fontWeight: 700, padding: "8px 14px", borderRadius: 8, cursor: "pointer",
                      border: transportadoraModo === o.id ? "1.5px solid var(--dropi)" : "1px solid var(--border)",
                      background: transportadoraModo === o.id ? "var(--dropi-light)" : "transparent",
                      color: transportadoraModo === o.id ? "var(--dropi)" : "var(--muted)",
                    }}>{o.label}</button>
                  ))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer" }}>
                  <input type="checkbox" checked={sameDayOn} onChange={(e) => setSameDayOn(e.target.checked)} /> Entrega el mismo día (Same Day)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer" }}>
                  <input type="checkbox" checked={cobroFleteOn} onChange={(e) => setCobroFleteOn(e.target.checked)} /> Cobrar solo el flete (producto ya pagado)
                </label>
                <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, cursor: "pointer" }}>
                  <input type="checkbox" checked={seguroOn} onChange={(e) => setSeguroOn(e.target.checked)} /> Asegurar contra devolución
                </label>
              </div>
            </div>
          )}

          {mockupTab === "integraciones" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14 }}>Tus conexiones — clic para simular conectar/desconectar</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {["SIIGO", "SIESA", "Shopify", "VTEX", "Mercado Libre", "Rappi", "Falabella", "Éxito", "Amazon", "TikTok Shop", "Crédito al consumidor"].map((nombre) => {
                  const on = !!conectadas[nombre];
                  return (
                    <button
                      key={nombre}
                      onClick={() => setConectadas({ ...conectadas, [nombre]: !on })}
                      style={{
                        textAlign: "left", padding: "10px 12px", borderRadius: 8, cursor: "pointer",
                        border: on ? "1.5px solid #16A34A" : "1px solid var(--border)",
                        background: on ? "#F0FDF4" : "var(--card)",
                      }}
                    >
                      <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>{nombre}</div>
                      <div style={{ fontSize: 10.5, color: on ? "#16A34A" : "var(--muted)", fontWeight: 700 }}>{on ? "● Conectado" : "○ No conectado"}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {mockupTab === "comercial" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14 }}>Tu equipo de acompañamiento</div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderRadius: 10, background: "var(--dropi-light)", marginBottom: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--dropi)", color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800 }}>MR</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Mayra Ramírez — tu comercial</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Última gestión: hace 2 días · Tarifa por volumen activa</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
                <div style={{ padding: 12, borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Tiempo de respuesta — Customer Success</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--fg)" }}>&lt; 4 horas</div>
                </div>
                <div style={{ padding: 12, borderRadius: 10, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>Tiempo de respuesta — SAC</div>
                  <div style={{ fontSize: 16, fontWeight: 800, color: "var(--fg)" }}>&lt; 24 horas</div>
                </div>
              </div>
              <button style={{ fontSize: 12.5, fontWeight: 700, color: "white", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "10px 16px", cursor: "pointer" }}>
                Reportar un problema →
              </button>
            </div>
          )}

          {mockupTab === "reportes" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 14 }}>Reportes financieros — este mes</div>
              {[
                { label: "Ventas propias", valor: "$18.420.000", color: "var(--dropi)" },
                { label: "Generado por terceros (si abres tu catálogo)", valor: "$3.100.000", color: "#3B82F6" },
                { label: "Movimientos de wallet (saldo disponible)", valor: "$1.240.500", color: "#16A34A" },
                { label: "Impacto de devoluciones en caja", valor: "-$620.000", color: "#DC2626" },
              ].map((r) => (
                <div key={r.label} style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{r.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 800, color: r.color }}>{r.valor}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3 TEMAS */}
        {TEMAS.map((tema) => {
          const lista = ordenes[tema.key] ?? [];
          const temaNoAplica = !!noAplica[tema.key];
          const votosValidos = votos.filter((v) => !v.noAplica?.[tema.key]);
          const votosNoAplica = votos.length - votosValidos.length;
          const ranking = tema.items
            .map((it) => ({
              ...it,
              puntos: votosValidos.reduce((sum, v) => {
                const o = v.ordenes[tema.key] ?? [];
                const idx = o.indexOf(it.key);
                return sum + (idx === -1 ? 0 : tema.items.length - idx);
              }, 0),
            }))
            .sort((a, b) => b.puntos - a.puntos);
          const maxPuntos = Math.max(1, ...ranking.map((r) => r.puntos));

          return (
            <div key={tema.key}>
              <div style={sectionLabel}>{tema.emoji} {tema.label} — ordena de más a menos importante</div>
              {tema.intro && (
                <p style={{ fontSize: 12.5, color: "var(--muted)", fontStyle: "italic", marginTop: -8, marginBottom: 14 }}>{tema.intro}</p>
              )}
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--muted)", marginBottom: 14, cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={temaNoAplica}
                  onChange={(e) => setNoAplica({ ...noAplica, [tema.key]: e.target.checked })}
                />
                No aplica para mi negocio — no quiero priorizar nada de este apartado
              </label>
              {lista.map((key, index) => {
                const it = tema.items.find((i) => i.key === key)!;
                return (
                  <div key={key} style={{ ...card, marginBottom: 8, display: "flex", alignItems: "flex-start", gap: 12, opacity: temaNoAplica ? 0.4 : 1, pointerEvents: temaNoAplica ? "none" : "auto" }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: "50%", flexShrink: 0, fontSize: 11, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
                      background: "var(--dropi)", color: "white",
                    }}>
                      {index + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
                        {it.categoria && <span style={tagChip(it.categoria)}>{it.categoria}</span>}
                        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{it.nombre}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, fontStyle: "italic", borderLeft: "2px solid var(--border)", paddingLeft: 10 }}>
                        {it.detalle}
                      </div>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2, flexShrink: 0, marginTop: 2 }}>
                      <button onClick={() => mover(tema.key, index, -1)} disabled={index === 0} style={arrowBtn(index === 0)}>▲</button>
                      <button onClick={() => mover(tema.key, index, 1)} disabled={index === lista.length - 1} style={arrowBtn(index === lista.length - 1)}>▼</button>
                    </div>
                  </div>
                );
              })}
              <textarea
                value={feedbackTemas[tema.key] ?? ""}
                onChange={(e) => setFeedbackTemas({ ...feedbackTemas, [tema.key]: e.target.value })}
                placeholder={
                  tema.key === "integraciones"
                    ? "¿Usas otro ERP, otra tienda online o otro marketplace que no esté en esta lista? Escríbelo aquí."
                    : `¿Algo de ${tema.label.toLowerCase()} que no esté en esta lista?`
                }
                rows={2}
                style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", resize: "vertical", marginBottom: 8 }}
              />

              <div style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 20, marginBottom: 8 }}>
                Ranking en vivo — {tema.label}
                {votosNoAplica > 0 && (
                  <span style={{ fontWeight: 600, textTransform: "none", letterSpacing: "normal", color: "var(--muted)" }}>
                    {" "}· {votosNoAplica} de {votos.length} dijeron que no les aplica
                  </span>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                {ranking.map((it) => (
                  <div key={it.key} style={{ marginBottom: 8 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3, gap: 12 }}>
                      <span style={{ color: "var(--fg)", fontWeight: 600 }}>{it.nombre}</span>
                      <span style={{ color: "var(--muted)", flexShrink: 0 }}>{it.puntos} pts</span>
                    </div>
                    <div style={{ height: 6, background: "var(--border)", borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${it.puntos > 0 ? (it.puntos / maxPuntos) * 100 : 0}%`, background: "var(--dropi)", borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* FEEDBACK GENERAL + SUBMIT */}
        <div style={sectionLabel}>Feedback general</div>
        <textarea
          value={feedbackGeneral}
          onChange={(e) => setFeedbackGeneral(e.target.value)}
          placeholder="Algo más que quieras decirnos antes de enviar tus prioridades..."
          rows={2}
          style={{ width: "100%", fontSize: 13, padding: "9px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)", resize: "vertical", marginBottom: 12 }}
        />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {votos.length} voto{votos.length === 1 ? "" : "s"} registrado{votos.length === 1 ? "" : "s"} en esta sesión.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={reiniciar} style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 14px", cursor: "pointer" }}>
              Reiniciar votación
            </button>
            <button
              onClick={registrarVoto}
              disabled={!nombre.trim()}
              style={{
                fontSize: 13, fontWeight: 700, color: "white",
                background: nombre.trim() ? "var(--dropi)" : "var(--muted)",
                border: "none", borderRadius: 8, padding: "10px 18px",
                cursor: nombre.trim() ? "pointer" : "not-allowed",
              }}
            >
              Enviar mis prioridades →
            </button>
          </div>
        </div>

        {feedbacksGenerales.length > 0 && (
          <>
            <div style={sectionLabel}>Feedback general recibido</div>
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 24 }}>
              {feedbacksGenerales.map((f, i) => (
                <div key={i} style={{ padding: "10px 16px", borderBottom: i < feedbacksGenerales.length - 1 ? "1px solid var(--border)" : "none", fontSize: 12.5 }}>
                  <b style={{ color: "var(--fg)" }}>{f.nombre}:</b> <span style={{ color: "var(--muted)" }}>{f.texto}</span>
                </div>
              ))}
            </div>
          </>
        )}

        <div style={{ ...card, borderLeft: "3px solid var(--warning, #F59E0B)", background: "#FFFBEB", marginTop: 8, marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: "#B45309", marginBottom: 6 }}>Nota</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg)", margin: 0 }}>
            Esta copia interna vota en local (una sola sesión, un solo dispositivo). La versión pública
            (Lovable) que se comparte con marcas reales por WhatsApp guarda esto en base de datos compartida.
            No se declara ninguna capacidad lista para Handoff con este ejercicio solo.
          </p>
        </div>

      </div>
    </main>
  );
}
