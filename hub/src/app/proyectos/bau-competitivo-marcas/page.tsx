// Fuente: agente-delivery/Documentos/Agente de Investigación BAU Competitivo para Marcas.docx
// Fuente: agente-delivery/Documentos/avance-bau-competitivo-marcas.html (17 jul 2026)
// Fuente: Insumo BAU Competitivo — Marcas.pdf (Equipo Comercial/Marcas, 22-jul-2026)
// Datos ecosistema: fact_marcas.csv · dim_marcas.csv · act. 14-jul-2026 · Diagnostico_Marcas_CSAT_16jul2026.xlsx

import { Fragment } from "react";
import Breadcrumb from "@/components/Breadcrumb";

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const RED = "#DC2626";
const AMBER = "#D97706";
const GREEN = "#059669";
const RED_BG = "#FEF2F2";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const GREEN_BG = "#ECFDF5";
const ORANGE = "#EA580C";
const ORANGE_BG = "#FFF7ED";
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
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--fg)",
};

// ─── Norte — 5 frentes del "Próximo paso 2: reunirse con equipos internos" (doc madre)
const FRENTES = [
  { icono: "✅", nombre: "Comercial", desc: "Negocios perdidos, competidores, objeciones, funcionalidades solicitadas, promesas — recibido 22-jul-2026.", estado: "done" },
  { icono: "⏳", nombre: "Customer Success", desc: "Marcas en riesgo, casos de acompañamiento, problemas de activación, workarounds.", estado: "pending" },
  { icono: "⏳", nombre: "Soporte y CAS", desc: "Tickets recurrentes, problemas sin resolver, tiempos de respuesta, escalamientos.", estado: "pending" },
  { icono: "⏳", nombre: "Logística", desc: "Intentos de entrega, evidencias, gestión de novedades, tiempos antes de devolución.", estado: "pending" },
  { icono: "⏳", nombre: "Data", desc: "Cuantificar frecuencia, impacto, volumen, retención, abandono, uso.", estado: "pending" },
] as const;

// ─── Metodología ────────────────────────────────────────────────────────
const FASES = [
  { n: 1, name: "Consolidación de evidencia existente", desc: "CSAT, respuestas abiertas, entrevistas, tickets, backlog", active: true },
  { n: 2, name: "Investigación cualitativa complementaria", desc: "Ampliar muestra: abandonadas, no convertidas, alto volumen, multi-sede", active: false },
  { n: 3, name: "Validación cuantitativa", desc: "Magnitud de los problemas — con Data", active: false },
  { n: 4, name: "Definición de capacidades BAU", desc: "Clasificar: indispensable / retención / competitiva / diferenciador", active: false },
  { n: 5, name: "Benchmark competitivo", desc: "Solo sobre capacidades ya priorizadas — no comparación general", active: false },
  { n: 6, name: "Priorización y recomendación", desc: "Backlog priorizado, roadmap, plan de medición", active: false },
] as const;

// ─── Dos lentes — numeración cerrada 2026-07-17: Lente 2 = Ecosistema, Lente 1 = Comercial
const ACTIVIDAD_MENSUAL = [
  { mes: "Enero 2026", l1u: "2.363", l1o: "387.997", l2u: "1.433", l2uPct: "60,6%", l2o: "246.644", l2oPct: "63,6%" },
  { mes: "Febrero 2026", l1u: "2.529", l1o: "371.202", l2u: "1.506", l2uPct: "59,5%", l2o: "241.044", l2oPct: "64,9%" },
  { mes: "Marzo 2026", l1u: "2.576", l1o: "416.933", l2u: "1.554", l2uPct: "60,3%", l2o: "264.760", l2oPct: "63,5%" },
  { mes: "Abril 2026", l1u: "2.488", l1o: "405.292", l2u: "1.501", l2uPct: "60,3%", l2o: "253.832", l2oPct: "62,6%" },
  { mes: "Mayo 2026", l1u: "2.511", l1o: "436.542", l2u: "1.494", l2uPct: "59,5%", l2o: "267.193", l2oPct: "61,2%" },
  { mes: "Junio 2026", l1u: "2.504", l1o: "474.713", l2u: "1.485", l2uPct: "59,3%", l2o: "289.956", l2oPct: "61,1%" },
] as const;

const MADUREZ = [
  { nivel: "Sin actividad reciente", usuarios: "6.231", pct: "67,5%", ordenes: "0" },
  { nivel: "Iniciando", usuarios: "2.161", pct: "23,4%", ordenes: "64.660" },
  { nivel: "Creciendo", usuarios: "577", pct: "6,3%", ordenes: "226.323" },
  { nivel: "Consolidando", usuarios: "152", pct: "1,6%", ordenes: "201.502" },
  { nivel: "Escalando", usuarios: "73", pct: "0,8%", ordenes: "554.976" },
  { nivel: "Pre-Escalando", usuarios: "34", pct: "0,4%", ordenes: "87.087" },
] as const;

const ANTIGUEDAD = [
  { rango: "<3 meses", usuarios: "221", pct: "2,4%" },
  { rango: "3–6 meses", usuarios: "407", pct: "4,4%" },
  { rango: "6–12 meses", usuarios: "925", pct: "10,0%" },
  { rango: "1–2 años", usuarios: "2.672", pct: "29,0%" },
  { rango: "2+ años", usuarios: "5.000", pct: "54,2%" },
] as const;

// ─── Mapa de capacidades ────────────────────────────────────────────────
const ESTADO_COLOR: Record<string, { color: string; bg: string; label: string }> = {
  alta: { color: GREEN, bg: GREEN_BG, label: "Alta evidencia" },
  media: { color: AMBER, bg: AMB_BG, label: "Evidencia media" },
  ampliar: { color: ORANGE, bg: ORANGE_BG, label: "Pendiente de ampliar" },
  validar: { color: RED, bg: RED_BG, label: "Pendiente de validar" },
  pendiente: { color: RED, bg: RED_BG, label: "Pendiente" },
  nuevo: { color: BLUE, bg: BLU_BG, label: "Nuevo · Comercial" },
};

const CAPACIDADES = [
  { cap: "Sincronización de órdenes, guías y estados", ev: "Varias entrevistas", niveles: "Creciendo, Consolidando, Escalando", estado: "alta" },
  { cap: "Tracking automático", ev: "Varias entrevistas y CSAT", niveles: "Iniciando, Creciendo, Consolidando, Escalando", estado: "alta" },
  { cap: "Gestión preventiva de novedades", ev: "Varias entrevistas y CSAT (5/5 entrevistas)", niveles: "Iniciando, Creciendo, Consolidando, Escalando", estado: "alta" },
  { cap: "Gestión de devoluciones y garantías", ev: "Varias entrevistas y CSAT", niveles: "Iniciando, Creciendo, Consolidando, Escalando", estado: "alta" },
  { cap: "Evidencia de intentos de entrega", ev: "Dos entrevistas", niveles: "Creciendo, Escalando", estado: "media" },
  { cap: "Gestión de bodegas e inventario", ev: "Una entrevista de alto volumen", niveles: "Escalando", estado: "media" },
  { cap: "Reportes financieros", ev: "Tres entrevistas (Blendit, Mateo, María Paula)", niveles: "Creciendo, Consolidando, Escalando", estado: "media" },
  { cap: "Validación de direcciones", ev: "Dos entrevistas", niveles: "Creciendo, Consolidando", estado: "media" },
  { cap: "Atención según volumen", ev: "Tres entrevistas (Tienda Virtual1, María Paula, Cuidándote)", niveles: "Creciendo, Escalando", estado: "media" },
  { cap: "Operación internacional", ev: "Una entrevista", niveles: "Creciendo (único caso)", estado: "ampliar" },
  { cap: "Huella del comprador", ev: "Una entrevista", niveles: "Creciendo (único caso)", estado: "validar" },
  { cap: "Roles y permisos", ev: "Sin evidencia directa", niveles: "—", estado: "pendiente" },
  { cap: "Integración SIIGO / ERPs", ev: "1 negocio perdido (Benjamín de la Torre) + promesa ya comunicada", niveles: "—", estado: "nuevo" },
  { cap: "Integración masiva e-commerce (Shopify)", ev: "Solicitud de prospectos/clientes", niveles: "—", estado: "nuevo" },
  { cap: "Envíos B2B / mayoristas", ev: "Solicitud de prospectos + promesa ya comunicada", niveles: "—", estado: "nuevo" },
  { cap: "Generación de guía sin crear producto", ev: "1 negocio perdido (Andrés Castro) + solicitud + research externo 24-jul-2026: 4/8 competidores (Skydropx, 99 Envíos, Interrapidísimo, Coordinadora) no lo exigen", niveles: "—", estado: "nuevo" },
  { cap: "Autocompletado de datos (pedido manual recurrente)", ev: "Solicitud de prospectos/clientes", niveles: "—", estado: "nuevo" },
  { cap: "Cobro contra entrega flexible (solo flete)", ev: "Solicitud de prospectos/clientes", niveles: "—", estado: "nuevo" },
  { cap: "Seguro de flete anti-devolución (Básico/Plus)", ev: "Solicitud + referencia de precios de competencia", niveles: "—", estado: "nuevo" },
  { cap: "Domiciliarios propios como transportadora", ev: "Solicitud de prospectos/clientes", niveles: "—", estado: "nuevo" },
  { cap: "Entregas SAMEDAY en ciudades principales", ev: "1 negocio perdido (Parchita) + solicitud", niveles: "—", estado: "nuevo" },
  { cap: "Notificación automática al comprador post-despacho", ev: "Research externo 24-jul-2026: 5/8 competidores (Skydropx, Envía.com, Coordinadora, Mastershop, Melonn) ya lo tienen en producción; en Dropi sin evidencia pública, depende de apps de terceros", niveles: "—", estado: "nuevo" },
] as const;

// ─── Entrevistas cualitativas ───────────────────────────────────────────
const ENTREVISTAS = [
  { marca: "Blendit", tipo: "Marca", antiguedad: "+6 meses", volumen: "~600/mes", segmento: "Activa · volumen medio-alto (Consolidando)" },
  { marca: "Cuidándote", tipo: "Marca", antiguedad: "3 meses", volumen: "~300/mes", segmento: "Activa reciente · riesgo temprano de abandono" },
  { marca: "Tienda Virtual1", tipo: "Mixto (marca + proveedor)", antiguedad: "+12 meses (4 años ecosistema)", volumen: "+2.000/mes", segmento: "Alto volumen · multi-bodega (Escalando)" },
  { marca: "Mateo Garzón (llevatelonline)", tipo: "Marca", antiguedad: "+12 meses (4-5 años)", volumen: "~150/mes", segmento: "Antigua · operación multi-país (CO/GT/CR/MX)" },
  { marca: "Distribuidora Natural (María Paula Arrechea)", tipo: "Marca", antiguedad: "~6 meses (cuenta actual)", volumen: "~2.712/mes (confirmado CSAT)", segmento: "Alto volumen (Escalando) · comercial sin gestión percibida" },
] as const;

// ─── Negocios perdidos — insumo Comercial 22-jul-2026 (Fase 2: llena el sesgo de cobertura) ──
const NEGOCIOS_PERDIDOS = [
  { categoria: "+1000 órdenes", marca: "Parchita", plataforma: "Melonn", motivo: "Bodega y tiempos — requería SAMEDAY en 4 ciudades, RFID, cuarto propio y mejor transporte." },
  { categoria: "+500 órdenes", marca: "Duja Kids", plataforma: "Otra (no responde)", motivo: "Mejores tarifas. Última duda: facturación. Inactiva, no responde a contacto." },
  { categoria: "+500 órdenes", marca: "Hello Patch", plataforma: "No responde", motivo: "Fricción en parametrización de envíos (selección de bodega de despacho)." },
  { categoria: "+500 órdenes", marca: "Benjamín de la Torre", plataforma: "Mastershop", motivo: "Falta de integración con SIIGO — operación ya 100% automatizada, no quiso migrar sin esa solución." },
  { categoria: "100–499 órdenes", marca: "Beaulife - Apiflower", plataforma: "Melonn", motivo: "Melonn ofreció mejores tarifas en fletes sin recaudo." },
  { categoria: "100–499 órdenes", marca: "Andrés Castro", plataforma: "99 envíos", motivo: "Productos personalizados — prefiere generar guía sin crear producto." },
] as const;

const COMPETIDORES = ["Melonn", "Mastershop", "99 envíos", "Coordinadora", "Interrapidísimo", "Skydrop", "Envía", "Efficommerce"] as const;

const PROMESAS = [
  { titulo: "Integración con SIIGO", texto: "Comunicada como “próxima a finalizar”. Ya costó al menos 1 negocio perdido (Benjamín de la Torre, +500 órdenes/mes) que migró a Mastershop por esto." },
  { titulo: "Tracking de guías", texto: "Comunicado que “más adelante” se habilitará el rastreo con notificación al comprador." },
  { titulo: "Envíos mayoristas", texto: "Comunicado que quedará definido junto con los nuevos SLAs de transportadoras, aún en negociación." },
] as const;

// ─── Hallazgos e hipótesis ──────────────────────────────────────────────
type Hallazgo = { n: number; titulo: string; texto: string; fuente?: string };
const HALLAZGOS: Hallazgo[] = [
  { n: 1, titulo: "La necesidad va más allá de funciones corporativas", texto: "Las marcas necesitan confiabilidad, automatización, trazabilidad, control, escalabilidad y capacidad de resolución — no solo roles/permisos/aprobaciones." },
  { n: 2, titulo: "El mayor riesgo está después del despacho", texto: "Tracking, novedades, devoluciones, garantías y comunicación con transportadoras concentran las fricciones." },
  { n: 3, titulo: "Las marcas activas usan soluciones temporales", texto: "Inflan inventario, descargan guías a mano, revisan novedades a diario, usan Excel para finanzas, resuelven garantías fuera de Dropi." },
  { n: 4, titulo: "Permanecer no significa estar satisfecho", texto: "Cambiar de plataforma tiene costos y riesgos propios. Continuidad en Dropi ≠ fidelidad." },
  { n: 5, titulo: "El servicio hace parte del BAU", texto: "Para marcas de mayor volumen, acompañamiento y resolución son parte de la experiencia esperada — no todo se resuelve con funcionalidades nuevas." },
  { n: 6, titulo: "La pérdida de negocio ya ocurre en Adquisición/Activación, no solo en Retención", texto: "A diferencia de las 5 entrevistas de Fase 1 (todas marcas activas), los 6 negocios perdidos reportados por Comercial muestran fricción temprana — bodega, SAMEDAY, tarifas, parametrización de envíos e integración contable — que hizo salir cuentas de entre 100 y +1000 órdenes/mes hacia Melonn, Mastershop y 99 envíos antes de consolidar operación en Dropi.", fuente: "Insumo Comercial 22-jul-2026 — 6 negocios perdidos" },
  { n: 7, titulo: "La terminología y los flujos heredados del rol Dropshipper confunden a marcas tradicionales", texto: "Comercial reporta informes con lenguaje de dropshipping (“ganancia dropshipper”) y la obligación de crear una bodega pese a que Dropi hace el fulfillment — fricción de comprensión coherente con que Marcas y Suppliers comparten el mismo rol técnico.", fuente: "Insumo Comercial 22-jul-2026 — objeciones de venta y onboarding" },
  { n: 8, titulo: "Una promesa sin fecha ya generó una pérdida de negocio medible", texto: "La integración con SIIGO se comunicó como “próxima a finalizar” sin fecha — y ya costó 1 negocio de +500 órdenes/mes (Benjamín de la Torre, migró a Mastershop). Primera evidencia que conecta directamente una promesa incumplida con una pérdida cuantificada.", fuente: "Insumo Comercial 22-jul-2026 — negocio perdido + promesa no cumplida" },
  { n: 9, titulo: "La competencia ya resuelve dos fricciones estructurales que Dropi no confirma tener", texto: "Research externo (mismo rigor para Dropi y 8 competidores) encontró que 5/8 ya notifican automáticamente al comprador tras el despacho y 4/8 no exigen bodega/producto previo para generar guía — en Dropi ninguna de las dos está confirmada en producción. Además, la promesa interna de “pago el mismo día de la entrega” no se pudo confirmar en Términos y Condiciones oficiales (bloqueados) y una fuente externa describe hasta 7 días hábiles en al menos un escenario — pendiente validar con Finanzas. Es investigación standalone, no es la Fase 5 oficial (ver sección de Competidores).", fuente: "Research externo competitivo 24-jul-2026 — analisis-competitivo-bau-marcas-24jul2026.html" },
];

type Hipotesis = { texto: string; fuente?: string };
const HIPOTESIS: Hipotesis[] = [
  { texto: "Las marcas abandonan o reducen operación por combinación de fallas operativas, trabajo manual y falta de resolución." },
  { texto: "Las capacidades más críticas están después de la generación de la guía." },
  { texto: "Las marcas de mayor volumen requieren un modelo de servicio diferente." },
  { texto: "La confiabilidad de la operación es más urgente que algunas funciones corporativas tradicionales." },
  { texto: "Roles, permisos y aprobaciones pueden ser relevantes, pero requieren validación adicional." },
  { texto: "Las marcas evalúan Dropi y no convierten, o abandonan tempranamente, por fricciones de bodega/tiempos de despacho e integraciones contables — antes incluso de llegar a los problemas post-despacho ya identificados en marcas activas.", fuente: "A validar con Data — sin cifra de conversión/abandono temprano todavía" },
  { texto: "El lenguaje y los flujos heredados del modelo dropshipping (bodegas, “ganancia dropshipper”) reducen la comprensión y confianza inicial de una marca tradicional durante el onboarding.", fuente: "A validar con CS/Soporte — sin cifra de abandono en onboarding todavía" },
  { texto: "Cumplir o comunicar con fecha las promesas ya hechas a marcas (SIIGO, tracking, mayoristas) reduce el riesgo de fuga hacia competidores que ya ofrecen esas capacidades.", fuente: "A validar — 1 caso confirmado (Benjamín de la Torre), no es aún patrón" },
];

function Stat({ n, sub, ordenes, label }: { n: string; sub?: string; ordenes?: string; label: string }) {
  return (
    <div style={{ padding: "12px 14px", border: "1px solid var(--border)", borderRadius: 8 }}>
      <div style={{ fontSize: 21, fontWeight: 800, color: "var(--fg)", lineHeight: 1.1 }}>
        {n} {sub && <span style={{ fontSize: 12, fontWeight: 500, color: "var(--muted)" }}>{sub}</span>}
      </div>
      {ordenes && <div style={{ fontSize: 12, fontWeight: 700, color: BLUE, marginTop: 2 }}>{ordenes} órdenes propias</div>}
      <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, lineHeight: 1.4 }}>{label}</div>
    </div>
  );
}

export default function BauCompetitivoMarcasPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        <Breadcrumb items={[{ label: "Proyectos", href: "/proyectos" }, { label: "BAU Competitivo para Marcas" }]} />
      </div>

      {/* Header */}
      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi · Investigación · Julio 2026
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            BAU Competitivo para Marcas
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5, maxWidth: "62ch" }}>
            Qué capacidades de producto, operación y servicio debe garantizar Dropi para que una Marca opere, controle y escale su negocio sin depender de procesos manuales, herramientas externas o acompañamiento constante.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 32px" }}>

        {/* PANORAMA */}
        <div style={{ ...card, borderRadius: 0, borderTop: "none", marginTop: 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            <span style={tagChip(AMBER, AMB_BG)}>En progreso — fase 1 de 6</span>
            <span style={tagChip(BLUE, BLU_BG)}>No es conclusión definitiva</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
            <Stat n={String(ENTREVISTAS.length)} label="Entrevistas analizadas" />
            <Stat n={String(HALLAZGOS.length)} label="Hallazgos preliminares" />
            <Stat n={String(HIPOTESIS.length)} label="Hipótesis activas" />
            <Stat n="1/6" label="Fases completadas" />
          </div>
        </div>

        {/* NORTE */}
        <div style={{ ...card, borderLeft: `4px solid ${BLUE}`, borderRadius: 10, marginTop: 16 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: BLUE, marginBottom: 6 }}>
            🧭 Norte — próxima acción
          </div>
          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", lineHeight: 1.5, margin: 0 }}>
            Cerrar los 4 frentes internos que faltan (CS, Soporte/CAS, Logística, Data) con el mismo formato que ya usó Comercial. Solo entonces se pasa a Fase 3 (validación cuantitativa). Hoy: 1 de 5 frentes cerrado.
          </p>
        </div>

        {/* METODOLOGIA */}
        <div style={sectionLabel}>Metodología — 6 fases</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {FASES.map((f, i) => (
            <div key={f.n} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < FASES.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0, background: f.active ? BLUE : "var(--border)", color: f.active ? "white" : "var(--muted)" }}>{f.n}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg)" }}>{f.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{f.desc}</div>
              </div>
              {f.active && <span style={tagChip(AMBER, AMB_BG)}>En progreso</span>}
            </div>
          ))}
        </div>

        {/* 5 FRENTES */}
        <div style={sectionLabel}>Los 5 frentes del &quot;Próximo paso 2&quot; (doc madre) — reunirse con equipos internos</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          {FRENTES.map((f, i) => (
            <div key={f.nombre} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderBottom: i < FRENTES.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: 15, flexShrink: 0 }}>{f.icono}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg)" }}>{f.nombre}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>{f.desc}</div>
              </div>
              <span style={tagChip(f.estado === "done" ? GREEN : "var(--muted)", f.estado === "done" ? GREEN_BG : MUTED_BG)}>
                {f.estado === "done" ? "Cerrado" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>

        {/* ECOSISTEMA */}
        <div style={sectionLabel}>Contexto general del ecosistema · fact_marcas.csv, act. 14-jul-2026</div>
        <div style={card}>
          <div style={subLabel}>Tamaño del universo — % sobre 12.321 (rol técnico Supplier = 100%)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginBottom: 14 }}>
            <Stat n="12.321" sub="(100%)" label="Rol técnico Supplier (2020–hoy) — base. Sin dato de órdenes disponible a este nivel." />
            <Stat n="9.228" sub="(74,9%)" ordenes="17.537.349" label="En fact_marcas.csv (brecha 3.093 sin explicar)" />
            <Stat n="8.874" sub="(72,0%)" ordenes="17.537.349" label="Marcas reales — ≥1 orden propia lifetime" />
            <Stat n="4.302" sub="(34,9%)" ordenes="8.822.353" label="Lente 1 — Portafolio comercial" />
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginBottom: 18 }}>
            Los 12.321 NO son &quot;marcas&quot; — por la deuda técnica, ese número incluye Suppliers puros de dropshipping que nunca operan como marca (comparten el mismo rol técnico). La definición que manda: marca real = usuario con órdenes propias.
          </p>

          <div style={subLabel}>Dos lentes — regla cerrada 2026-07-17</div>
          <div style={{ overflowX: "auto", marginBottom: 18 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={thStyle}>Lente</th><th style={thStyle}>Definición</th><th style={thStyle}>Usuarios</th></tr></thead>
              <tbody>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>Lente 2 — Ecosistema</td>
                  <td style={tdStyle}>Todos los usuarios con comportamiento de marca real — al menos una orden propia en su historia</td>
                  <td style={tdStyle}>8.874</td>
                </tr>
                <tr>
                  <td style={{ ...tdStyle, fontWeight: 700, borderBottom: "none" }}>Lente 1 — Portafolio comercial</td>
                  <td style={{ ...tdStyle, borderBottom: "none" }}>Únicamente unión de comercial_id 71445 (manager.marcaspropias@dropi.co, &quot;marcas&quot;) + 21553 (mayra.ramirez@dropi.co, Mayra Ramírez, &quot;emprendedores&quot;)</td>
                  <td style={{ ...tdStyle, borderBottom: "none" }}>4.302 (4.241 con propias, 98,6%)</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={subLabel}>Volumen histórico</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 18 }}>
            <Stat n="17,5M" label="Órdenes propias históricas (2020–2026) — 17.537.349 exacto" />
            <Stat n="1.976" label="Promedio órdenes propias/marca" />
            <Stat n="101" label="Mediana — brecha enorme vs. promedio, confirma concentración" />
          </div>

          <div style={subLabel}>Actividad mensual — marcas con ≥1 orden propia, mes a mes (no acumulado)</div>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginBottom: 10 }}>
            De junio 2026 hacia atrás — julio queda fuera porque el mes está incompleto (solo 14 días de datos, distorsiona la comparación). Cada mes trae dos filas: <b>Lente 2 — Ecosistema</b> (todas las marcas activas ese mes, siempre 100%) y <b>Lente 1 — Comercial</b> (el subconjunto con comercial 71445/21553 asignado, con su % dentro de Lente 2).
          </p>
          <div style={{ overflowX: "auto", marginBottom: 6 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Mes</th>
                  <th style={thStyle}>Lente</th>
                  <th style={thStyle}>Usuarios</th>
                  <th style={thStyle}>% usuarios</th>
                  <th style={thStyle}>Órdenes</th>
                  <th style={thStyle}>% órdenes</th>
                </tr>
              </thead>
              <tbody>
                {ACTIVIDAD_MENSUAL.map((r, i) => {
                  const last = i === ACTIVIDAD_MENSUAL.length - 1;
                  return (
                    <Fragment key={r.mes}>
                      <tr>
                        <td rowSpan={2} style={{ ...tdStyle, fontWeight: 700, verticalAlign: "top", borderBottom: last ? "none" : undefined }}>{r.mes}</td>
                        <td style={tdStyle}>Lente 2 — Ecosistema</td>
                        <td style={tdStyle}>{r.l1u}</td>
                        <td style={tdStyle}>100%</td>
                        <td style={tdStyle}>{r.l1o}</td>
                        <td style={tdStyle}>100%</td>
                      </tr>
                      <tr>
                        <td style={{ ...tdStyle, borderBottom: last ? "none" : undefined }}>Lente 1 — Comercial</td>
                        <td style={{ ...tdStyle, borderBottom: last ? "none" : undefined }}>{r.l2u}</td>
                        <td style={{ ...tdStyle, borderBottom: last ? "none" : undefined, color: BLUE, fontWeight: 700 }}>{r.l2uPct}</td>
                        <td style={{ ...tdStyle, borderBottom: last ? "none" : undefined }}>{r.l2o}</td>
                        <td style={{ ...tdStyle, borderBottom: last ? "none" : undefined, color: BLUE, fontWeight: 700 }}>{r.l2oPct}</td>
                      </tr>
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginBottom: 18 }}>
            La participación de Lente 1 se mantiene estable mes a mes: ~59–61% de usuarios y ~61–65% de órdenes. Es decir, entre 39–41% de las marcas activas cada mes están fuera del portafolio comercial gestionado — un patrón consistente en los 6 meses, no un hallazgo puntual.
          </p>

          <div style={subLabel}>Nivel de madurez (avg propias/mes, últimos 3 periodos)</div>
          <div style={{ overflowX: "auto", marginBottom: 18 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={thStyle}>Nivel</th><th style={thStyle}>Usuarios</th><th style={thStyle}>%</th><th style={thStyle}>Órdenes propias (3 meses)</th></tr></thead>
              <tbody>
                {MADUREZ.map((m, i) => (
                  <tr key={m.nivel}>
                    <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === MADUREZ.length - 1 ? "none" : undefined }}>{m.nivel}</td>
                    <td style={{ ...tdStyle, borderBottom: i === MADUREZ.length - 1 ? "none" : undefined }}>{m.usuarios}</td>
                    <td style={{ ...tdStyle, borderBottom: i === MADUREZ.length - 1 ? "none" : undefined }}>{m.pct}</td>
                    <td style={{ ...tdStyle, borderBottom: i === MADUREZ.length - 1 ? "none" : undefined }}>{m.ordenes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginBottom: 18 }}>
            El 67,5% &quot;sin actividad reciente&quot; es esperable — el universo es el histórico completo desde 2020. No comparar directo con la foto de &quot;3.036 activos jun-2026&quot; (esa base es distinta). Escalando bajó de 87 a 73 frente a esa foto, probablemente por julio parcial arrastrando el promedio hacia abajo.
          </p>

          <div style={subLabel}>Antigüedad (desde fecha de registro, referencia 14-jul-2026)</div>
          <div style={{ overflowX: "auto", marginBottom: 18 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={thStyle}>Rango</th><th style={thStyle}>Usuarios</th><th style={thStyle}>%</th></tr></thead>
              <tbody>
                {ANTIGUEDAD.map((a, i) => (
                  <tr key={a.rango}>
                    <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === ANTIGUEDAD.length - 1 ? "none" : undefined }}>{a.rango}</td>
                    <td style={{ ...tdStyle, borderBottom: i === ANTIGUEDAD.length - 1 ? "none" : undefined }}>{a.usuarios}</td>
                    <td style={{ ...tdStyle, borderBottom: i === ANTIGUEDAD.length - 1 ? "none" : undefined }}>{a.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={subLabel}>Canal de creación de órdenes (propias + externas, histórico)</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
            <Stat n="60,1%" label="Integración — 38.956.593 órdenes" />
            <Stat n="35,3%" label="Manual — 22.832.299 órdenes" />
            <Stat n="4,6%" label="Masivas — 2.977.685 órdenes" />
          </div>
        </div>

        {/* CAPACIDADES */}
        <div style={sectionLabel}>Mapa preliminar de capacidades</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={thStyle}>Capacidad</th><th style={thStyle}>Evidencia</th><th style={thStyle}>Nivel de madurez</th><th style={thStyle}>Estado</th></tr></thead>
              <tbody>
                {CAPACIDADES.map((c, i) => {
                  const est = ESTADO_COLOR[c.estado];
                  return (
                    <tr key={c.cap}>
                      <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === CAPACIDADES.length - 1 ? "none" : undefined }}>{c.cap}</td>
                      <td style={{ ...tdStyle, borderBottom: i === CAPACIDADES.length - 1 ? "none" : undefined }}>{c.ev}</td>
                      <td style={{ ...tdStyle, borderBottom: i === CAPACIDADES.length - 1 ? "none" : undefined }}>{c.niveles}</td>
                      <td style={{ ...tdStyle, borderBottom: i === CAPACIDADES.length - 1 ? "none" : undefined }}><span style={tagChip(est.color, est.bg)}>{est.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* ENTREVISTAS */}
        <div style={sectionLabel}>Entrevistas cualitativas (5)</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={thStyle}>Marca</th><th style={thStyle}>Tipo</th><th style={thStyle}>Antigüedad</th><th style={thStyle}>Volumen</th><th style={thStyle}>Segmento</th></tr></thead>
              <tbody>
                {ENTREVISTAS.map((e, i) => (
                  <tr key={e.marca}>
                    <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === ENTREVISTAS.length - 1 ? "none" : undefined }}>{e.marca}</td>
                    <td style={{ ...tdStyle, borderBottom: i === ENTREVISTAS.length - 1 ? "none" : undefined }}>{e.tipo}</td>
                    <td style={{ ...tdStyle, borderBottom: i === ENTREVISTAS.length - 1 ? "none" : undefined }}>{e.antiguedad}</td>
                    <td style={{ ...tdStyle, borderBottom: i === ENTREVISTAS.length - 1 ? "none" : undefined }}>{e.volumen}</td>
                    <td style={{ ...tdStyle, borderBottom: i === ENTREVISTAS.length - 1 ? "none" : undefined }}>{e.segmento}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
          0 de 5 entrevistas corresponden a marcas abandonadas o que evaluaron Dropi y no ingresaron — sesgo de cobertura hacia activas, ya señalado en el documento fuente.
        </p>

        {/* NEGOCIOS PERDIDOS — insumo Comercial, Fase 2 */}
        <div style={sectionLabel}>Negocios perdidos — insumo Comercial, 22-jul-2026 (llena el sesgo de cobertura de arriba)</div>
        <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={thStyle}>Categoría</th><th style={thStyle}>Marca</th><th style={thStyle}>Fue a</th><th style={thStyle}>Motivo principal</th></tr></thead>
              <tbody>
                {NEGOCIOS_PERDIDOS.map((n, i) => (
                  <tr key={n.marca}>
                    <td style={{ ...tdStyle, fontWeight: 700, borderBottom: i === NEGOCIOS_PERDIDOS.length - 1 ? "none" : undefined }}>{n.categoria}</td>
                    <td style={{ ...tdStyle, borderBottom: i === NEGOCIOS_PERDIDOS.length - 1 ? "none" : undefined }}>{n.marca}</td>
                    <td style={{ ...tdStyle, borderBottom: i === NEGOCIOS_PERDIDOS.length - 1 ? "none" : undefined }}>{n.plataforma}</td>
                    <td style={{ ...tdStyle, borderBottom: i === NEGOCIOS_PERDIDOS.length - 1 ? "none" : undefined }}>{n.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
          ⚠️ Son 6 cuentas puntuales reportadas por comercial, no una muestra representativa — evidencia cualitativa adicional, no validación estadística. Los volúmenes son estimaciones comerciales, no cifras de <code>fact_marcas.csv</code>.
        </p>

        {/* COMPETIDORES — insumo para Fase 5, aún no se ejecuta */}
        <div style={sectionLabel}>Competidores mencionados explícitamente — insumo guardado para Fase 5 (benchmark)</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {COMPETIDORES.map((c) => (
            <span key={c} style={tagChip(BLUE, BLU_BG)}>{c}</span>
          ))}
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.5 }}>
          Melonn, Mastershop, 99 envíos, Coordinadora e Interrapidísimo vienen del insumo Comercial (22-jul-2026). <b>Skydrop</b> y <b>Envía</b> se agregan por conocimiento directo de Kate — no vienen del PDF ni de <code>fact_marcas.csv</code>. Envía domina el volumen de órdenes en México y también tiene presencia en Colombia. <b>Efficommerce</b> (<a href="https://efficommerce.com" target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>efficommerce.com</a>) fue mencionado por María Paula Arrechea (Distribuidora Natural) en su entrevista de Fase 1 — evidencia de entrevista, no del insumo Comercial.
        </p>

        <div style={{ ...card, borderLeft: `4px solid ${BLUE}`, borderRadius: 10, marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: BLUE }}>🔎 Investigación externa disponible</span>
            <span style={tagChip(BLUE, BLU_BG)}>Standalone — no es la Fase 5 oficial</span>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.6, margin: "0 0 6px" }}>
            El 24-jul-2026 se investigó a Dropi y a estos 8 competidores con el mismo rigor externo (sitio oficial, centro de ayuda, App Store/Google Play, Trustpilot, Capterra, reviews reales — con verificación de fecha de las reseñas) en 7 aspectos: notificación al cliente, tracking, modelos de pago, palancamiento financiero, facilidad operativa, soporte y puntuación general. Se hizo a pedido explícito de Kate, aparte del semáforo de fases — no adelanta ni reemplaza la Fase 5, que sigue esperando a que cierren los 4 frentes internos pendientes de Fase 1.
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
            Documento completo: <a href="/analisis-competitivo-bau-marcas-24jul2026.html" target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontWeight: 700 }}>ver análisis competitivo →</a>. Priorizado por amplitud de brecha frente a competidores (cuántos ya tienen algo que Dropi no), no por conteo de negocios perdidos — los 6 casos de Comercial se usan ahí solo como contexto, nunca como criterio de prioridad. Ver Hallazgo 9 abajo para el resumen.
          </p>
        </div>

        {/* HALLAZGOS */}
        <div style={sectionLabel}>Hallazgos preliminares — evidencia, no conclusiones cerradas</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {HALLAZGOS.map((h) => (
            <div key={h.n} style={card}>
              <div style={{ fontSize: 10, fontWeight: 700, color: BLUE, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>Hallazgo {h.n}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, marginBottom: 6 }}>{h.titulo}</div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>{h.texto}</div>
              {h.fuente && <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 6, fontStyle: "italic" }}>Fuente: {h.fuente}</div>}
            </div>
          ))}
        </div>

        {/* HIPOTESIS */}
        <div style={sectionLabel}>Hipótesis actuales — sin validar, no presentar como certeza</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {HIPOTESIS.map((h, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 4, ...card, padding: "10px 14px" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <span style={{ flexShrink: 0, fontSize: 11, fontWeight: 700, color: "var(--muted)", background: "var(--bg)", borderRadius: 5, padding: "2px 6px", height: "fit-content" }}>H{i + 1}</span>
                <span style={{ fontSize: 13, color: "var(--fg)" }}>{h.texto}</span>
              </div>
              {h.fuente && <span style={{ fontSize: 10.5, color: "var(--muted)", fontStyle: "italic", marginLeft: 34 }}>{h.fuente}</span>}
            </div>
          ))}
        </div>

        {/* RIESGO: PROMESAS NO CUMPLIDAS */}
        <div style={sectionLabel}>⚠️ Se ofrece pero no se cumple — riesgo activo, no es research</div>
        <div style={{ border: `1px solid ${RED}`, background: RED_BG, borderRadius: 10, padding: "16px 18px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 10 }}>
            Promesas ya comunicadas a marcas, sin fecha de cumplimiento confirmada
          </div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12.5, color: "var(--fg)", lineHeight: 1.6 }}>
            {PROMESAS.map((p, i) => (
              <li key={p.titulo} style={{ marginBottom: i === PROMESAS.length - 1 ? 0 : 6 }}>
                <b>{p.titulo}</b> — {p.texto}
              </li>
            ))}
          </ul>
          <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)" }}>
            Esto no es un hallazgo de investigación — es una brecha entre lo que Comercial ya prometió y lo que Producto/Tech tiene en roadmap. Revisar con José Giraldo antes del próximo contacto comercial con estas cuentas, para no seguir prometiendo sin fecha.
          </div>
        </div>

        <div style={{ marginTop: 30, padding: "12px 0", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
          Fuente: Agente de Investigación BAU Competitivo para Marcas.docx · Insumo Comercial 22-jul-2026 · fact_marcas.csv · dim_marcas.csv act. 14-jul-2026 · Diagnostico_Marcas_CSAT_16jul2026.xlsx · Research externo competitivo 24-jul-2026 (analisis-competitivo-bau-marcas-24jul2026.html, standalone)<br />
          Análisis agente Data_Brands · Uso interno Célula Brands Success · Jul 2026
        </div>
      </div>
    </main>
  );
}
