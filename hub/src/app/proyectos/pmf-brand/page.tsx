// Fuente: agente-delivery/Documentos/pmf-antes-que-crecimiento-06ago2026.html
//   (marco de la CPO, respaldado con fact_marcas.csv/dim_marcas.csv, corte 03/06-ago-2026)
// Fuente: agente-delivery/Documentos/PMF/guia-clara-dropi-brands-prioridades .md
//   (investigación de mercado de 17 marcas-lead, cierre 25-ago-2026)
// Fuente: memory/project_data_brands_framework.md — evolución de la cifra del "núcleo"
//   (64 → 67 → 68, confirmado 68 por Kate 21-ago-2026, pendiente recalcular volumen desde fact_marcas)

import Breadcrumb from "@/components/Breadcrumb";

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const AMBER = "#D97706";
const GREEN = "#059669";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const GREEN_BG = "#ECFDF5";
const MUTED_BG = "#F1F5F9";

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
const subLabel: React.CSSProperties = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginBottom: 8,
};
const tagChip = (color: string, bg: string): React.CSSProperties => ({
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "2px 8px",
  borderRadius: 4,
  color,
  background: bg,
  whiteSpace: "nowrap",
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--fg)", verticalAlign: "top",
};

function Stat({ n, sub, label }: { n: string; sub?: string; label: string }) {
  return (
    <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8 }}>
      <div style={{ fontSize: 21, fontWeight: 800, color: "var(--fg)", lineHeight: 1.1 }}>
        {n} {sub && <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>{sub}</span>}
      </div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

// ─── Marco de la CPO — 4 puntos, diagnóstico (06-ago-2026) ─────────────────
type CardKind = "data" | "gap" | "action";
const CARD_STYLE: Record<CardKind, { border: string; bg: string; tagColor: string; label: string }> = {
  data: { border: BLUE, bg: "transparent", tagColor: BLUE, label: "Lo que la data confirma" },
  gap: { border: AMBER, bg: AMB_BG, tagColor: AMBER, label: "Lo que la data NO puede confirmar — necesita escuchar" },
  action: { border: GREEN, bg: "transparent", tagColor: GREEN, label: "A quién hablarle primero" },
};

function EvidenceCard({ kind, children, tagOverride }: { kind: CardKind; children: React.ReactNode; tagOverride?: string }) {
  const s = CARD_STYLE[kind];
  return (
    <div style={{ ...card, borderLeft: `3px solid ${s.border}`, background: s.bg, marginBottom: 10 }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--muted)", marginBottom: 6 }}>
        {tagOverride ?? s.label}
      </div>
      <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg)", margin: 0 }}>{children}</p>
    </div>
  );
}

const DIAGNOSTICO = [
  {
    n: 1,
    titulo: "Product-Market Fit, no crecimiento",
    frase: "El problema no es falta de activación. Es que las marcas usan Dropi solo por el flujo de caja, no porque les encante el producto.",
    contenido: (
      <>
        <EvidenceCard kind="data">
          Activación nunca fue el cuello de botella real: <b>Activaciones + Reactivaciones</b> nunca superó 2,3% del
          volumen de Lente 1 en 4 meses seguidos (abr–jul). No es un mes malo, es estructural. Crecer esa cifra al
          doble no cierra la brecha a 600K. El 98% del NSM ya viene de la base existente — ahí está el
          apalancamiento, no en más adquisición.
        </EvidenceCard>
        <EvidenceCard kind="gap">
          Si las marcas están porque &quot;aman el producto&quot; o solo por flujo de caja no se ve en{" "}
          <code>fact_marcas</code>/<code>dim_marcas</code> — son órdenes, no motivación.{" "}
          <b>[HIPÓTESIS a validar]</b> — es la pregunta central del punto 3.
        </EvidenceCard>
      </>
    ),
  },
  {
    n: 2,
    titulo: "Define la narrativa del producto",
    frase: "¿Qué le vendemos a las marcas — cash flow? logística? ecosistema? ¿Cómo lo contamos para que sea difícil decir que no?",
    contenido: (
      <EvidenceCard kind="gap" tagOverride="Decisión de posicionamiento, no hallazgo de data">
        Es una decisión de posicionamiento, no algo que la data resuelva sola. Única pista indirecta: las marcas que
        usan Shopify/integración ecommerce y la herramienta &quot;Chatea&quot; de Dropi llegan a niveles de madurez
        mucho más altos (Shopify: 25,6% en Iniciando → 76,7% en Pre-Escalando; Chatea: 5,0% → 51,2%). Sugiere que la
        propuesta que mejor prende no es solo el flujo de caja — es integrarse de verdad al ecosistema operativo de
        la marca. <b>Es correlación, no causalidad probada</b> — la narrativa se define hablando con marcas (punto 3).
      </EvidenceCard>
    ),
  },
  {
    n: 3,
    titulo: "Escucha activa — no esperar reportes",
    frase: "Hablar con marcas actuales, cliente fantasma de Melonn/competidores, contactar leads que dijeron \"no\".",
    contenido: (
      <>
        <EvidenceCard kind="action">
          <b>El núcleo</b> (marcas Pre-Escalando/Escalando de Lente 1) — priorizar las que muestran devolución/novedad
          reciente sobre las que están limpias, para entender qué las hace quedarse a pesar de la fricción. Cruzar
          contra <b>Iniciando</b> con alta rotación (22,8% pasó por &quot;En riesgo&quot;, 19,0% por &quot;Perdido&quot;
          en 6 meses) para entender qué le falta a ese nivel que al núcleo no.
        </EvidenceCard>
        <ul style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.8, margin: "10px 0 0", paddingLeft: 20 }}>
          <li><b>Entrevistas a marcas actuales:</b> por qué se quedarían vs. por qué se irían — mezclar marcas del núcleo (algunas con fricción reciente, algunas sin) con marcas Iniciando de alta rotación.</li>
          <li><b>Cliente fantasma de Melonn y otros competidores</b> — qué ofrecen ellos que Dropi no, en logística/novedades.</li>
          <li><b>Leads que dijeron &quot;no&quot;</b> — necesita data de CRM/ventas que no está en fact_marcas/dim_marcas; pedir aparte a Comercial.</li>
        </ul>
      </>
    ),
  },
  {
    n: 4,
    titulo: "Quita fricciones, no sumes features",
    frase: "El tema logístico (novedades, transportadoras) es donde se están yendo. Resolver eso primero.",
    contenido: (
      <>
        <EvidenceCard kind="data">
          La data ya apunta aquí: el núcleo (60,6% del NSM al corte 06-ago) tuvo 100% devolución propia en 6 meses,
          tasa agregada 18,9% — ya aislada de dropshipping externo. <b>Recurrente</b> (el escalón que alimenta al
          núcleo) se achica 4 meses seguidos. <b>Reactivado</b> tiene la tasa de novedad más alta con muestra
          confiable. Tres síntomas, una causa: la fricción logística con transportadoras.
        </EvidenceCard>
        <EvidenceCard kind="data" tagOverride="Constancia verificada — no es un promedio inflado">
          95,3% del núcleo (corte 06-ago) estuvo activo los 6 meses completos (feb–jul) — los otros solo se
          perdieron febrero, el mes más antiguo de la ventana. Nadie tiene un patrón irregular (ej. un mes pico
          disfrazando meses en cero). Como el NSM se mide mes a mes, esto confirma aportantes reales y sostenidos, no
          un artefacto del promedio.
        </EvidenceCard>
      </>
    ),
  },
] as const;

// ─── Cómo experimentar — qué sigue para validar PMF ────────────────────────
// Cierra las preguntas abiertas del diagnóstico (puntos 1-4 arriba) con un
// experimento concreto y barato por cada una — incluye el piloto de evidencia
// georreferenciada del documento fuente (pmf-antes-que-crecimiento-06ago2026.html)
// que no estaba reflejado en esta página todavía.
type ExperimentoPMF = { n: number; pregunta: string; supuesto: string; experimento: string; metrica: string; owner: string; pendiente?: string };
const EXPERIMENTOS_PMF: ExperimentoPMF[] = [
  {
    n: 1,
    pregunta: "¿El núcleo se queda por flujo de caja o porque el producto le aporta valor real?",
    supuesto: "Que la retención de hoy es puramente financiera — si aparece una alternativa de flujo de caja igual de buena, el núcleo se va sin importar el producto.",
    experimento: "Entrevistas cualitativas al núcleo (mezcla con/sin fricción reciente) + pregunta tipo Sean Ellis (\"¿qué tan decepcionado estarías si no pudieras seguir usando Dropi?\") a una muestra del núcleo e Iniciando de alta rotación.",
    metrica: "% que responde \"muy decepcionado\" (referencia de mercado para señal de PMF: ~40%) + razones cualitativas agrupadas por tema.",
    owner: "CPO + Kate",
  },
  {
    n: 2,
    pregunta: "¿Qué mensaje engancha más — cash flow o integración operativa al ecosistema?",
    supuesto: "Que la correlación Shopify/Chatea ↔ madurez es causal (la integración retiene), no solo un marcador de marcas que ya eran más sofisticadas antes de llegar a Dropi.",
    experimento: "Probar 2 mensajes de venta distintos con leads nuevos comparables: \"te ayudamos a cobrar mejor tu contraentrega\" vs. \"te integramos a tu operación completa (Shopify + inventario + logística)\".",
    metrica: "Tasa de respuesta / agenda de demo por mensaje.",
    owner: "Comercial + CPO",
  },
  {
    n: 3,
    pregunta: "¿Dar evidencia de entrega con la transportadora de mayor peso sube la retención del núcleo?",
    supuesto: "Que la falta de evidencia georreferenciada (y no otra causa — dirección errada, cliente no paga) es lo que explica la devolución disputada.",
    experimento: "Piloto de evidencia georreferenciada (foto con fecha/hora/ubicación al reportar novedad) — ya lo exige Coordinadora en su proceso; extenderlo a la transportadora con más peso en el volumen del núcleo.",
    metrica: "% de novedades/devoluciones disputadas y revertidas · tasa de devolución propia del núcleo · paso Reactivado → Recurrente.",
    owner: "Kate + Logística/Operaciones — Producto no lo puede correr solo",
    pendiente: "Cuál transportadora priorizar es decisión operativa de Logística, no de Producto.",
  },
  {
    n: 4,
    pregunta: "¿Qué ofrece Melonn (u otro competidor) que hace que una marca prefiera irse?",
    supuesto: "Que la brecha percibida frente a la competencia es de servicio postventa/logística, no de precio.",
    experimento: "Cliente fantasma a Melonn y 1–2 competidores más, enfocado específicamente en logística/novedades — no una comparación general de mercado.",
    metrica: "Hallazgos cualitativos comparados punto a punto contra los mismos procesos en Dropi.",
    owner: "CPO / Producto",
  },
];

// ─── Guía clara — qué esperan las marcas (17 marcas-lead) ──────────────────
const EXPECTATIVAS = [
  { n: 1, titulo: "Entregar bien", simple: "Que el pedido llegue rápido, con la mejor transportadora, y saber qué pasó si algo falla.", ejemplo: "Muchas marcas dependen principalmente de Coordinadora; necesitan alternativa si hay retrasos o mala cobertura." },
  { n: 2, titulo: "Ver el pedido", simple: "Que el cliente y el equipo vean el estado del pedido sin llamar ni escribir por WhatsApp.", ejemplo: "Ninguna de las 17 marcas tiene un tracking propio sólido." },
  { n: 3, titulo: "Cobrar el COD", simple: "Que contraentrega no se vuelva pérdida por clientes que no reciben, direcciones erradas o recaudos lentos.", ejemplo: "Dynamo pide confirmación por llamada/WhatsApp y anticipos para reducir riesgo." },
  { n: 4, titulo: "No vender lo que no existe", simple: "Que Shopify muestre solo inventario disponible y el stock se actualice en bodega, tiendas y canales.", ejemplo: "Health Company: 46,8% de variantes agotadas; Fajas Salomé: 29,5%; Naty London: 27,6%." },
  { n: 5, titulo: "Resolver problemas sin caos", simple: "Que cambios, devoluciones, direcciones erradas y rechazos tengan un flujo claro.", ejemplo: "Muchas marcas resuelven novedades por correo, llamadas y WhatsApp." },
  { n: 6, titulo: "Mantener promociones bajo control", simple: "Que kits, combos, descuentos y ventas mayoristas no dañen inventario ni margen.", ejemplo: "Drops vende packs x12; Purpure usa mínimos por referencia y precios mayoristas." },
] as const;

const PRODUCT_GROWTH = [
  { p: 1, que: "Conexión profunda con Shopify", porque: "16 de 17 marcas usan Shopify. Si pedidos o inventario no sincronizan bien, Dropi no puede ser el centro de la operación." },
  { p: 2, que: "Tracking con la marca", porque: "Es el dolor más repetido y el más fácil de mostrar. Reduce consultas de \"¿dónde está mi pedido?\"." },
  { p: 3, que: "Elección automática de transportadora", porque: "Varias marcas dependen de una sola transportadora. Necesitan menor riesgo y mejor costo." },
  { p: 4, que: "COD inteligente y recaudo claro", porque: "COD puede aumentar ventas, pero también genera rechazos y pérdida de dinero." },
  { p: 5, que: "Control de inventario y bodegas", porque: "Las marcas pierden ventas por agotados y pueden vender productos que ya no tienen." },
  { p: 6, que: "Novedades, cambios y devoluciones", porque: "Una entrega fallida debe tener solución clara, no depender de mensajes manuales." },
  { p: 7, que: "Combos y promociones", porque: "Los kits consumen varios productos y pueden descuadrar el stock." },
] as const;

const NO_PRIORIZAR_PRODUCTO = [
  "Crear tiendas desde cero.",
  "Catálogo de productos para dropshipping.",
  "Herramientas de pauta o creativos.",
  "IA de marketing como mensaje principal.",
  "Expansión internacional para todas las marcas desde el inicio.",
];

const INTEGRACIONES_P1 = [
  { nombre: "Shopify", porque: "Es la tienda principal de 16 de 17 leads. Obligatoria.", evidencia: "16 de 17 marcas." },
  { nombre: "WooCommerce", porque: "Hay marcas con más de una tienda o sitios adicionales.", evidencia: "Biosa Market usa Shopify + dos WooCommerce." },
  { nombre: "Releasit", porque: "App de COD ya utilizada. Si Dropi no convive con ella, pedir cambio puede bloquear la venta.", evidencia: "Stark, BLESS, Primura, VOU FIT y Mexicaps." },
  { nombre: "Addi", porque: "Muchas marcas ya ofrecen crédito al consumidor. Dropi debe reconocer el estado correcto de esos pedidos.", evidencia: "12 de 17 marcas usan Addi." },
  { nombre: "Mercado Pago", porque: "Aparece como pago confirmado en algunas marcas; importa para saber cuándo despachar.", evidencia: "Purpure y Drops Colombia." },
  { nombre: "Transportadoras", porque: "Son la ejecución física de la promesa de venta.", evidencia: "Coordinadora, Servientrega, Interrapidísimo, Envía, TCC, DHL, FedEx." },
] as const;

const INTEGRACIONES_P2 = [
  { nombre: "Gorgias", porque: "Atención al cliente: muestra pedido, guía y novedad dentro del ticket.", evidencia: "Nipskin usa Gorgias + Wizybot." },
  { nombre: "Reversso", porque: "Logística inversa, cambios y devoluciones.", evidencia: "Wargo Sports ya lo usa." },
  { nombre: "Sistecrédito", porque: "Crédito al consumidor en checkout.", evidencia: "Fajas Salomé lo usa junto con Addi." },
  { nombre: "POS / ERP de tiendas", porque: "Si una marca tiene tiendas físicas, hay que sincronizar ventas e inventario.", evidencia: "Purpure, Dynamo, Health Company, Fajas Salomé, Naty London." },
  { nombre: "Herramientas de bundles", porque: "Pueden crear combos en Shopify y Dropi debe entender sus componentes.", evidencia: "Relevante para campañas, packs y B2B." },
] as const;

const MARKETPLACES = [
  { canal: "Mercado Libre", porque: "El marketplace más claro para centralizar pedidos e inventario en Colombia.", evidencia: "Drops (Tienda Oficial); Biosa (uso limitado).", prioridad: "Alta" },
  { canal: "Rappi", porque: "Combina vitrina, venta y en algunos casos entrega rápida/local.", evidencia: "Purpure, Drops, Nipskin.", prioridad: "Alta" },
  { canal: "WhatsApp", porque: "No es marketplace, pero es canal de venta y postventa crítico.", evidencia: "Purpure, Dynamo y muchas otras — atención, confirmación, mayoristas.", prioridad: "Muy alta" },
  { canal: "Falabella", porque: "Relevante para marcas de moda y retail.", evidencia: "Nipskin presente; Naty London con puntos dentro de Falabella.", prioridad: "Media" },
  { canal: "TikTok Shop", porque: "Importante para marcas que venden por contenido y social commerce.", evidencia: "Nipskin.", prioridad: "Media" },
  { canal: "Amazon", porque: "Relevante para expansión internacional y marcas maduras.", evidencia: "Nipskin.", prioridad: "Media" },
  { canal: "Éxito", porque: "Canal de retail/marketplace local para algunas categorías.", evidencia: "Nipskin.", prioridad: "Media" },
  { canal: "Walmart", porque: "Relevante para internacionalización, no para todos los leads de Colombia.", evidencia: "Nipskin.", prioridad: "Baja inicial" },
] as const;

const ICP = [
  { rasgo: "Tiene Shopify", porque: "Dropi puede conectarse rápido sin construir una integración nueva." },
  { rasgo: "Tiene volumen constante", porque: "El ahorro y la mejora operativa justifican el esfuerzo de onboarding." },
  { rasgo: "Usa COD o tiene alta tasa de novedades", porque: "Tiene un dolor económico claro que Dropi puede atacar." },
  { rasgo: "Tiene bodega propia, tiendas o más de un canal", porque: "Sufre inventario y pedidos fragmentados." },
  { rasgo: "Tiene una persona responsable de e-commerce/operaciones", porque: "Existe alguien que puede liderar el cambio." },
  { rasgo: "Dispuesta a compartir datos y hacer piloto", porque: "Sin datos no se puede demostrar valor." },
] as const;

const MENSAJES_VENTA = [
  { tipo: "Mucho COD y muchos rechazos", decir: "Te ayudamos a convertir más pedidos contraentrega en dinero cobrado.", noDecir: "Tenemos una plataforma de IA y fulfillment." },
  { tipo: "Tiendas + bodega + Shopify + varios canales", decir: "Te ayudamos a no vender inventario que no tienes y a despachar desde el mejor lugar.", noDecir: "Tenemos muchas transportadoras." },
  { tipo: "Muchos mensajes preguntando por pedidos", decir: "Reducimos consultas de seguimiento y resolvemos novedades antes de que el cliente reclame.", noDecir: "Tenemos chatbot." },
  { tipo: "Marketplaces + web propia", decir: "Centralizamos pedidos e inventario para que vendas en más canales sin perder control.", noDecir: "Conectamos marketplaces." },
] as const;

const PILOTOS = [
  { problema: "Rechazos COD", piloto: "Confirmación + seguimiento + recaudo para pedidos COD de una región.", exito: "Sube la tasa de entrega/cobro y baja el rechazo." },
  { problema: "Muchas consultas de pedido", piloto: "Tracking de marca + notificaciones + gestión de novedades.", exito: "Bajan los mensajes de \"¿dónde está mi pedido?\"." },
  { problema: "Inventario desordenado", piloto: "Conectar Shopify con una bodega y una tienda/canal.", exito: "Bajan la sobreventa y los pedidos cancelados por falta de stock." },
  { problema: "Combos y kits", piloto: "Controlar 5 combos de alta rotación.", exito: "No se venden componentes agotados y el picking sale correcto." },
] as const;

const NO_HACER_TODAVIA = [
  "Intentar vender el mismo paquete a toda marca Shopify.",
  "Construir todas las integraciones posibles sin demanda comprobada.",
  "Vender IA, marketing o expansión internacional como propuesta principal.",
  "Migrar una marca completa antes de probar un flujo pequeño.",
  "Declarar PMF por reuniones positivas o pilotos gratis.",
];

export default function PmfBrandPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        <Breadcrumb items={[{ label: "Proyectos", href: "/proyectos" }, { label: "PMF Brand" }]} />
      </div>

      {/* Header */}
      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi · Marco estratégico + investigación de mercado · agosto 2026
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            PMF Brand — PMF antes que crecimiento
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5, maxWidth: "62ch" }}>
            Antes de escalar adquisición, ajustar el producto al mercado: por qué las marcas se quedan, qué necesitan
            de verdad y cómo validarlo barato antes de construir. Une el diagnóstico de la CPO con fact_marcas/
            dim_marcas y la investigación de mercado de 17 marcas-lead.
          </div>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginTop: 12 }}>
            <a
              href="/proyectos/pmf-brand/plataforma-ideal"
              style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "white", textDecoration: "none", opacity: 0.85 }}
            >
              🚀 Plataforma ideal — priorización interna →
            </a>
            <a
              href="/plataforma-ideal-marcas-28ago2026.html"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-block", fontSize: 12, fontWeight: 700, color: "white", textDecoration: "none", opacity: 0.85 }}
            >
              🧪 Landing + prototipo para testeo con marcas →
            </a>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 32px" }}>

        {/* PANORAMA */}
        <div style={{ ...card, borderRadius: 0, borderTop: "none", marginTop: 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={tagChip(BLUE, BLU_BG)}>Marco de la CPO — 06-ago-2026</span>
            <span style={tagChip(AMBER, AMB_BG)}>Investigación 17 marcas — cierre 25-ago-2026</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            <Stat n="~14.000" sub="órdenes/mes" label="Techo estimado de Adquisición hoy (activación + huérfanos + Recurrente recuperado) — 4,5% de la brecha a 600K" />
            <Stat n="68" sub="marcas" label="El núcleo (Pre-Escalando/Escalando Lente 1) — cifra vigente confirmada por Kate 21-ago-2026" />
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginTop: 14, marginBottom: 0 }}>
            La cifra del núcleo pasó de 64 (corte 06-ago, 176.835 órdenes propias/mes · 60,6% del NSM) a 67 (regla de
            madurez por consistencia reciente) a <b>68</b>, confirmado directamente por Kate el 21-ago-2026 sin
            recalcular volumen desde <code>fact_marcas</code> en esa conversación. Tratar <b>68</b> como la cifra
            vigente de cabezas — el volumen de órdenes/% NSM que se cita abajo (60,6%) sigue siendo el del corte de 64
            y está pendiente de recalcular con el corte de 68.
          </p>
        </div>

        {/* DIAGNÓSTICO */}
        <div style={sectionLabel}>El diagnóstico de la CPO — 4 puntos que reencuadran el proyecto</div>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 16 }}>
          Fuente: <code>agente-delivery/Documentos/pmf-antes-que-crecimiento-06ago2026.html</code>. Cada punto separa
          lo que la data de <code>fact_marcas</code>/<code>dim_marcas</code> puede confirmar de lo que sigue siendo
          hipótesis — no se colapsan en una sola conclusión.
        </p>
        {DIAGNOSTICO.map((d) => (
          <div key={d.n} style={{ marginBottom: 22 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: BLUE, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{d.n}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>{d.titulo}</div>
            </div>
            <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 10px 40px", fontStyle: "italic" }}>&quot;{d.frase}&quot;</p>
            <div style={{ marginLeft: 40 }}>{d.contenido}</div>
          </div>
        ))}

        {/* CIERRE MARÍA */}
        <div style={{ ...card, border: `1.5px solid ${GREEN}`, marginBottom: 8 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: GREEN, marginBottom: 8 }}>
            La fórmula de la CPO para 600K
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--fg)", margin: 0 }}>
            <b>Retención (el núcleo) + Product-Market Fit = base sólida para crecer.</b> Recién ahí, con un producto
            que funcione, se trae más volumen con Sales Growth — no antes. La data confirma el orden: intentar crecer
            Adquisición hoy (techo de ~14.000/mes) sin resolver la fricción del núcleo (176.835 órdenes/mes en juego
            al corte de 64) es invertir esfuerzo donde menos pesa.
          </p>
        </div>

        {/* CÓMO EXPERIMENTAR */}
        <div style={sectionLabel}>Cómo experimentar — qué sigue para validar PMF</div>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 16 }}>
          Cada pregunta abierta del diagnóstico necesita un experimento barato antes de convertirse en proyecto —
          no se escala ninguna sin validar primero el supuesto más riesgoso detrás. La escucha directa a leads
          (entrevistas + outreach) ya está corriendo aparte en <b>BRA-010 — Experimento de Descubrimiento, Leads
          Clasificados</b> (17 leads Shopify ICP) — no se repite aquí.
        </p>
        {EXPERIMENTOS_PMF.map((e) => (
          <div key={e.n} style={{ ...card, borderLeft: `3px solid ${GREEN}`, marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: GREEN, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>{e.n}</div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "var(--fg)" }}>{e.pregunta}</div>
            </div>
            <dl style={{ margin: "0 0 0 32px", display: "grid", gridTemplateColumns: "120px 1fr", rowGap: 6, columnGap: 12, fontSize: 12.5 }}>
              <dt style={{ color: "var(--muted)", fontWeight: 600 }}>Supuesto riesgoso</dt>
              <dd style={{ margin: 0, color: "var(--fg)" }}>{e.supuesto}</dd>
              <dt style={{ color: "var(--muted)", fontWeight: 600 }}>Experimento</dt>
              <dd style={{ margin: 0, color: "var(--fg)" }}>{e.experimento}</dd>
              <dt style={{ color: "var(--muted)", fontWeight: 600 }}>Métrica</dt>
              <dd style={{ margin: 0, color: "var(--fg)" }}>{e.metrica}</dd>
              <dt style={{ color: "var(--muted)", fontWeight: 600 }}>Owner</dt>
              <dd style={{ margin: 0, color: "var(--fg)" }}>{e.owner}</dd>
              {e.pendiente && (
                <>
                  <dt style={{ color: AMBER, fontWeight: 600 }}>Pendiente</dt>
                  <dd style={{ margin: 0, color: AMBER }}>{e.pendiente}</dd>
                </>
              )}
            </dl>
          </div>
        ))}

        {/* QUÉ ESPERAN LAS MARCAS */}
        <div style={sectionLabel}>Qué esperan las marcas de Dropi — investigación de 17 marcas-lead</div>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 12 }}>
          Fuente: <code>agente-delivery/Documentos/PMF/guia-clara-dropi-brands-prioridades.md</code>. Son marcas
          externas (leads), no la base activa de Dropi — complementan el diagnóstico de retención, no lo reemplazan.
        </p>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {EXPECTATIVAS.map((e, i) => (
            <div key={e.n} style={{ display: "flex", gap: 12, padding: "12px 16px", borderBottom: i < EXPECTATIVAS.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", background: MUTED_BG, color: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{e.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg)" }}>{e.titulo}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{e.simple}</div>
                <div style={{ fontSize: 11.5, color: BLUE, marginTop: 4 }}>{e.ejemplo}</div>
              </div>
            </div>
          ))}
        </div>

        {/* PRODUCT GROWTH */}
        <div style={sectionLabel}>Qué priorizar en producto — Product Growth</div>
        <div style={{ overflowX: "auto", marginBottom: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>#</th><th style={thStyle}>Qué debe tener o mejorar Dropi</th><th style={thStyle}>Por qué</th></tr></thead>
            <tbody>
              {PRODUCT_GROWTH.map((r, i) => (
                <tr key={r.p}>
                  <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === PRODUCT_GROWTH.length - 1 ? "none" : undefined }}>{r.p}</td>
                  <td style={{ ...tdStyle, fontWeight: 600, borderBottom: i === PRODUCT_GROWTH.length - 1 ? "none" : undefined }}>{r.que}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", borderBottom: i === PRODUCT_GROWTH.length - 1 ? "none" : undefined }}>{r.porque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...card, background: MUTED_BG, border: "none" }}>
          <div style={subLabel}>Qué NO debe ser la prioridad inicial</div>
          <ul style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
            {NO_PRIORIZAR_PRODUCTO.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {/* INTEGRACIONES */}
        <div style={sectionLabel}>Integraciones en el radar</div>
        <div style={subLabel}>Prioridad 1 — integrar o funcionar perfectamente</div>
        <div style={{ overflowX: "auto", marginBottom: 18 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>Integración</th><th style={thStyle}>Por qué importa</th><th style={thStyle}>Evidencia</th></tr></thead>
            <tbody>
              {INTEGRACIONES_P1.map((r, i) => (
                <tr key={r.nombre}>
                  <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === INTEGRACIONES_P1.length - 1 ? "none" : undefined }}>{r.nombre}</td>
                  <td style={{ ...tdStyle, borderBottom: i === INTEGRACIONES_P1.length - 1 ? "none" : undefined }}>{r.porque}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", borderBottom: i === INTEGRACIONES_P1.length - 1 ? "none" : undefined }}>{r.evidencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={subLabel}>Prioridad 2 — integrar cuando la cuenta lo requiera</div>
        <div style={{ overflowX: "auto", marginBottom: 12 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>Integración</th><th style={thStyle}>Por qué importa</th><th style={thStyle}>Ejemplo</th></tr></thead>
            <tbody>
              {INTEGRACIONES_P2.map((r, i) => (
                <tr key={r.nombre}>
                  <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === INTEGRACIONES_P2.length - 1 ? "none" : undefined }}>{r.nombre}</td>
                  <td style={{ ...tdStyle, borderBottom: i === INTEGRACIONES_P2.length - 1 ? "none" : undefined }}>{r.porque}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", borderBottom: i === INTEGRACIONES_P2.length - 1 ? "none" : undefined }}>{r.evidencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...card, borderLeft: `3px solid ${AMBER}`, background: AMB_BG }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: AMBER, marginBottom: 6 }}>Regla importante</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg)", margin: 0 }}>
            <b>Primero conectar y convivir; después reemplazar.</b> Una marca grande no aceptará probar Dropi si tiene
            que apagar de inmediato Releasit, Addi, Gorgias, su ERP o sus procesos de devoluciones.
          </p>
        </div>

        {/* MARKETPLACES */}
        <div style={sectionLabel}>Marketplaces en el radar</div>
        <div style={{ overflowX: "auto", marginBottom: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>Canal</th><th style={thStyle}>Por qué</th><th style={thStyle}>Evidencia</th><th style={thStyle}>Prioridad</th></tr></thead>
            <tbody>
              {MARKETPLACES.map((r, i) => (
                <tr key={r.canal}>
                  <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === MARKETPLACES.length - 1 ? "none" : undefined }}>{r.canal}</td>
                  <td style={{ ...tdStyle, borderBottom: i === MARKETPLACES.length - 1 ? "none" : undefined }}>{r.porque}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", borderBottom: i === MARKETPLACES.length - 1 ? "none" : undefined }}>{r.evidencia}</td>
                  <td style={{ ...tdStyle, borderBottom: i === MARKETPLACES.length - 1 ? "none" : undefined }}>
                    <span style={tagChip(r.prioridad === "Muy alta" || r.prioridad === "Alta" ? GREEN : r.prioridad === "Media" ? BLUE : "var(--muted)", r.prioridad === "Muy alta" || r.prioridad === "Alta" ? GREEN_BG : r.prioridad === "Media" ? BLU_BG : MUTED_BG)}>{r.prioridad}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
          No construir todas las integraciones de marketplace de una vez. Primero Mercado Libre y Rappi, luego
          Falabella y TikTok Shop según el tipo de marca, y Amazon/Walmart/Éxito solo para cuentas que ya venden fuera
          o tienen operación multicanal madura — validando primero cuántas marcas tienen volumen real y quieren
          centralizarlas en Dropi.
        </p>

        {/* SALES GROWTH */}
        <div style={sectionLabel}>A quién vender — Sales Growth</div>
        <div style={subLabel}>El cliente ideal inicial (ICP) — no es cualquier marca Shopify</div>
        <div style={{ overflowX: "auto", marginBottom: 18 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>Característica</th><th style={thStyle}>Por qué importa</th></tr></thead>
            <tbody>
              {ICP.map((r, i) => (
                <tr key={r.rasgo}>
                  <td style={{ ...tdStyle, fontWeight: 600, borderBottom: i === ICP.length - 1 ? "none" : undefined }}>{r.rasgo}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", borderBottom: i === ICP.length - 1 ? "none" : undefined }}>{r.porque}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={subLabel}>Dos mensajes de venta claros</div>
        <div style={{ overflowX: "auto", marginBottom: 18 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>Tipo de marca</th><th style={thStyle}>Qué decirle</th><th style={thStyle}>No empezar diciendo</th></tr></thead>
            <tbody>
              {MENSAJES_VENTA.map((r, i) => (
                <tr key={r.tipo}>
                  <td style={{ ...tdStyle, fontWeight: 600, borderBottom: i === MENSAJES_VENTA.length - 1 ? "none" : undefined }}>{r.tipo}</td>
                  <td style={{ ...tdStyle, color: GREEN, borderBottom: i === MENSAJES_VENTA.length - 1 ? "none" : undefined }}>&quot;{r.decir}&quot;</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", borderBottom: i === MENSAJES_VENTA.length - 1 ? "none" : undefined }}>&quot;{r.noDecir}&quot;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...card, background: MUTED_BG, border: "none" }}>
          <div style={subLabel}>Cómo cobrar — no comparar solo el precio de una guía</div>
          <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
            Comparar cuánto cuesta realmente servir un pedido: flete, pedido rechazado, reintentos, devoluciones,
            tiempo de WhatsApp y soporte, errores de picking, sobreventa y cancelaciones, dinero atrapado en recaudo.
          </p>
        </div>

        {/* VALIDACIÓN */}
        <div style={sectionLabel}>Cómo validar antes de escalar</div>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 14 }}>
          Un dolor público no significa que la marca pagará o cambiará su operación. No asumir que ya hay
          Product-Market Fit.
        </p>
        <ol style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.9, marginTop: 0, marginBottom: 18, paddingLeft: 20 }}>
          <li>Elegir 6 marcas: 3 con problema fuerte de COD y 3 con problema fuerte de inventario/omnicanalidad.</li>
          <li>Confirmar pedidos mensuales, ciudades, mezcla COD/prepago, costos, devoluciones, herramientas actuales y decisor.</li>
          <li>Hacer un piloto pequeño: una ciudad, una bodega, un tipo de pedido o una categoría.</li>
          <li>Medir antes y después.</li>
          <li>Convertir el piloto a contrato pagado solo si hay valor comprobado.</li>
        </ol>
        <div style={{ overflowX: "auto", marginBottom: 18 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr><th style={thStyle}>Problema</th><th style={thStyle}>Piloto</th><th style={thStyle}>Cómo saber si funcionó</th></tr></thead>
            <tbody>
              {PILOTOS.map((r, i) => (
                <tr key={r.problema}>
                  <td style={{ ...tdStyle, fontWeight: 600, borderBottom: i === PILOTOS.length - 1 ? "none" : undefined }}>{r.problema}</td>
                  <td style={{ ...tdStyle, borderBottom: i === PILOTOS.length - 1 ? "none" : undefined }}>{r.piloto}</td>
                  <td style={{ ...tdStyle, color: "var(--muted)", borderBottom: i === PILOTOS.length - 1 ? "none" : undefined }}>{r.exito}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ ...card, borderLeft: `3px solid ${GREEN}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: GREEN, marginBottom: 8 }}>Cuándo decir &quot;sí hay PMF inicial&quot; — solo cuando</div>
          <ul style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.8, margin: 0, paddingLeft: 18 }}>
            <li>Las marcas usan la solución semanalmente.</li>
            <li>Al menos varias convierten a contrato pagado sin descuento excepcional.</li>
            <li>Las métricas mejoran frente a la línea base.</li>
            <li>El onboarding se puede repetir sin trabajo manual excesivo de Dropi.</li>
            <li>Las marcas piden ampliar el uso a más canales, ciudades o pedidos.</li>
          </ul>
        </div>

        {/* QUÉ NO HACER */}
        <div style={sectionLabel}>Lo que no debemos hacer todavía</div>
        <div style={{ ...card, background: MUTED_BG, border: "none", marginBottom: 8 }}>
          <ul style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.9, margin: 0, paddingLeft: 18 }}>
            {NO_HACER_TODAVIA.map((t) => <li key={t}>{t}</li>)}
          </ul>
        </div>

        {/* DECISIÓN ESTRATÉGICA */}
        <div style={{ ...card, border: `1.5px solid ${BLUE}`, marginTop: 8, marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: BLUE, marginBottom: 8 }}>
            La decisión estratégica
          </div>
          <p style={{ fontSize: 13.5, lineHeight: 1.6, color: "var(--fg)", margin: 0 }}>
            Dropi debe entrar por uno de dos problemas — <b>Revenue &amp; Delivery</b> (&quot;más pedidos entregados y
            cobrados&quot;) u <b>Operations Control</b> (&quot;menos desorden de inventario y pedidos&quot;). Después
            de resolver uno de esos problemas de forma comprobable, Dropi puede crecer dentro de la cuenta con
            fulfillment, automatización, marketplaces, IA, formación y expansión internacional.
          </p>
        </div>

        <p style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.6, textAlign: "center", paddingBottom: 20 }}>
          Fuentes: pmf-antes-que-crecimiento-06ago2026.html (corte 03/06-ago-2026, fact_marcas/dim_marcas) ·
          guía-clara-dropi-brands-prioridades.md (investigación 17 marcas-lead, cierre 25-ago-2026) · evolución del
          núcleo (64→67→68) confirmada por Kate 21-ago-2026, pendiente recalcular volumen exacto.
        </p>

      </div>
    </main>
  );
}
