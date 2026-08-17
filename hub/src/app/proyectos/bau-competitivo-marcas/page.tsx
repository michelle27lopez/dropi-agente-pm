// Fuente: agente-delivery/Documentos/Agente de Investigación BAU Competitivo para Marcas.docx
// Fuente: agente-delivery/Documentos/avance-bau-competitivo-marcas.html (17 jul 2026)
// Fuente: Insumo BAU Competitivo — Marcas.pdf (Equipo Comercial/Marcas, 22-jul-2026)
// Fuente: hub/src/app/proyectos/marcas/entrevistas/data.ts — 4 entrevistas nuevas incorporadas 30-jul-2026
//   (Santiago Lubo, Yohana Quintero, Yercy Shop, Ingrid Pinzón)
// Fuente: agente-delivery/Documentos/BAU/Informe_Gerencial_Dropi_vs_Competencia.pdf — incorporado 30-jul-2026
//   (Dropi vs. Grupo Effi, Melonn, 99envios, Mastershop, Coordinadora, Aveonline — copiado a hub/public/)
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

// ─── Mapa de capacidades — síntesis priorizada ──────────────────────────
// Unifica hallazgos de entrevistas + CSAT + negocios perdidos + research externo
// (24-jul) + Informe Gerencial (30-jul) en capacidades BAU con nombre propio,
// no en una lista plana de citas. Prioridad es lectura preliminar sobre la
// evidencia de Fase 1 — no es la clasificación formal de Fase 4
// (indispensable / retención / competitiva / diferenciador), que abre después
// de cerrar Fase 3.
const PRIORIDAD_COLOR: Record<string, { color: string; bg: string; label: string }> = {
  critica: { color: RED, bg: RED_BG, label: "Crítica" },
  alta: { color: AMBER, bg: AMB_BG, label: "Alta" },
  media: { color: BLUE, bg: BLU_BG, label: "Media" },
};

type CapacidadUnificada = { nombre: string; prioridad: "critica" | "alta" | "media"; pitch: string; evidencia: string };

const CAPACIDADES_UNIFICADAS: CapacidadUnificada[] = [
  {
    nombre: "Confiabilidad del ciclo post-despacho (tracking, novedades, evidencia de entrega, devoluciones y garantías)",
    prioridad: "critica",
    pitch: "Es el hallazgo más grande de toda la investigación, no una funcionalidad más entre varias: 6 de 9 entrevistas lo mencionan sin que se les pregunte, y CSAT lo confirma en todos los niveles de madurez. Las marcas ya construyeron soluciones caseras — inflar inventario, revisar guías a diario a las 9am, grabar video al recibir paquetes, reenviar guías a mano — porque hoy Dropi no les da con qué confiar. Mientras esto no se resuelva, cualquier otra mejora compite por atención con el problema que más le cuesta a la marca en dinero y tiempo real.",
    evidencia: "CSAT + 6/9 entrevistas (Blendit, María Paula, Santiago Lubo, Yohana Quintero, Ingrid Pinzón, Yercy Shop) + Mateo Garzón/María Paula piden evidencia de intentos de entrega.",
  },
  {
    nombre: "Comunicación automática nativa con el comprador",
    prioridad: "critica",
    pitch: "Dropi es hoy la excepción del mercado, no la norma: de 8 plataformas comparadas en el Informe Gerencial, es la única sin mensajería nativa — depende 100% de Chatea Pro, un aliado externo. Tres fuentes independientes lo señalan en menos de una semana (research 24-jul, entrevista de Santiago Lubo, Informe Gerencial), y la propia organización ya lo declara su dolor prioritario. Es la brecha de mayor visibilidad frente al seller y la de mejor caso de negocio: baja devoluciones en contraentrega y quita carga de soporte de un solo movimiento.",
    evidencia: "Research externo 24-jul (5/8 competidores) + Informe Gerencial 30-jul (única sin mensajería nativa de 8) + Blendit (prioridad #1 declarada) + Santiago Lubo/benchmark de Miguel Perdomo.",
  },
  {
    nombre: "Confiabilidad de la promesa base de la guía (peso y volumen)",
    prioridad: "alta",
    pitch: "No es una función nueva que pedir — es una promesa básica que ya se rompió con costo medible: un bug de transmisión de peso/volumen le costó a Santiago Lubo -58% de sus órdenes propias en 4 meses y lo empujó a dividir operación con un competidor que sí lo resuelve. Un solo caso, pero con evidencia cuantitativa de fuga real de volumen, no solo de riesgo.",
    evidencia: "Entrevista Santiago Lubo, 28-jul-2026 — caso único pero con causalidad clara y cifra de impacto.",
  },
  {
    nombre: "Perfil de marca unificado — fin de la doble cuenta Proveedor/Dropshipper",
    prioridad: "alta",
    pitch: "Yercy Shop, la cuenta de mayor volumen entrevistada (~14.000 órdenes propias/mes), opera 2 cuentas solo para separar wallets contables — no por límite técnico. Es la validación de campo de que el proyecto Perfil Marca Independiente, ya en desarrollo, resuelve un dolor real y no solo deuda técnica interna.",
    evidencia: "Entrevista Yercy Shop, 29-jul-2026 — coincide con el proyecto activo Perfil Marca Independiente.",
  },
  {
    nombre: "Gestión comercial proactiva a cuentas de volumen sin gestor activo",
    prioridad: "alta",
    pitch: "4 de las últimas 4 entrevistas llegaron sin comercial asignado pese a volumen relevante — y varias ya estaban formalmente en portafolio (21553). El problema no es de asignación, es de contacto real: cada una de estas cuentas es una marca que un competidor puede capturar antes de que Dropi la llame primero.",
    evidencia: "María Paula, Santiago Lubo, Yohana Quintero, Ingrid Pinzón (jul-2026) — patrón consistente en las 4 entrevistas más recientes.",
  },
  {
    nombre: "Apertura logística al transportador propio del seller",
    prioridad: "media",
    pitch: "Mastershop ya deja que el seller dé de alta su propio domiciliario como una transportadora más, sin perder el resto de la red. Marcas con logística híbrida real (mensajero propio + transportadoras, como Ingrid Pinzón/UBY) son exactamente el perfil que hoy no puede operar así dentro de Dropi.",
    evidencia: "Informe Gerencial 30-jul — dolor estructural exclusivo de Mastershop, sin equivalente en Dropi.",
  },
  {
    nombre: "Integraciones que quitan fricción de venta (SIIGO/ERP, Shopify masivo, guía sin crear producto)",
    prioridad: "media",
    pitch: "No es exploración — ya tiene precio: Benjamín de la Torre (+500 órdenes/mes) migró a Mastershop por falta de SIIGO, con una promesa de Dropi ya comunicada y sin fecha. Es el paquete de integraciones que más veces aparece pedido por prospectos y clientes, y el que más rápido convierte en negocio perdido si sigue sin fecha.",
    evidencia: "Negocio perdido Benjamín de la Torre (SIIGO) + negocio perdido Andrés Castro (guía sin producto) + solicitudes recurrentes de Comercial.",
  },
  {
    nombre: "Modelos comerciales flexibles (SAMEDAY, envíos B2B, cobro solo flete, seguro anti-devolución, retiro de wallet ágil)",
    prioridad: "media",
    pitch: "Un paquete de fricciones menores que, sumadas, empujan hacia la competencia: Parchita (+1.000 órdenes/mes) se fue por falta de SAMEDAY, 99envios ya cobra $0 al seller cuando falla una entrega contraentrega (Seguro Plus) y dos marcas de alto volumen comparan activamente la velocidad de retiro de Dropi contra SkyDrop. Ninguno rompe la relación por sí solo, pero juntos definen cuán flexible se percibe Dropi frente al resto del mercado.",
    evidencia: "Negocio perdido Parchita (SAMEDAY) + Informe Gerencial (Seguro Plus 99envios) + Yercy Shop / Ingrid Pinzón (retiro de wallet).",
  },
];

const SENALES_MENORES = [
  "Algoritmo de ruteo automático por transportadora (Mastershop, Aveonline) — Informe Gerencial, sin evidencia en entrevistas todavía.",
  "Capacitación masiva de activación en vivo (99envios) — posible palanca para TTFO/TTV, un solo competidor la valida.",
  "Bodegaje gratuito de entrada / periodo de gracia (Aveonline, Mastershop) — Informe Gerencial, sin mención en entrevistas.",
  "Verificación/filtro de vendedores en la guía (Ingrid Pinzón) — caso único.",
  "Huella del comprador / historial de fraude por cliente (Mateo Garzón, Santiago Lubo) — 2 casos, útil pero no bloquea operación.",
  "Roles y permisos segmentados por perfil (Yercy Shop) — caso único, alto volumen.",
  "Gestión de bodegas/inventario, reportes financieros, validación de direcciones, operación internacional — ya documentados en el mapa anterior con evidencia media, sin cambios nuevos esta ronda.",
];

// ─── Entrevistas cualitativas ───────────────────────────────────────────
const ENTREVISTAS = [
  { marca: "Blendit", tipo: "Marca", antiguedad: "+6 meses", volumen: "~600/mes", segmento: "Activa · volumen medio-alto (Consolidando)" },
  { marca: "Cuidándote", tipo: "Marca", antiguedad: "3 meses", volumen: "~300/mes", segmento: "Activa reciente · riesgo temprano de abandono" },
  { marca: "Tienda Virtual1", tipo: "Mixto (marca + proveedor)", antiguedad: "+12 meses (4 años ecosistema)", volumen: "+2.000/mes", segmento: "Alto volumen · multi-bodega (Escalando)" },
  { marca: "Mateo Garzón (llevatelonline)", tipo: "Marca", antiguedad: "+12 meses (4-5 años)", volumen: "~150/mes", segmento: "Antigua · operación multi-país (CO/GT/CR/MX)" },
  { marca: "Distribuidora Natural (María Paula Arrechea)", tipo: "Marca", antiguedad: "~6 meses (cuenta actual)", volumen: "~2.712/mes (confirmado CSAT)", segmento: "Alto volumen (Escalando) · comercial sin gestión percibida" },
  { marca: "Armonix Home (Santiago Lubo)", tipo: "Marca", antiguedad: "~1,5 años (migró 100% desde EFI)", volumen: "284–578/mes 2026 (Creciendo)", segmento: "Volumen cayendo -58% desde bug de peso/guía · dividió operación con SkyDrop" },
  { marca: "Yohana Esther Quintero", tipo: "Híbrido (marca + proveedor no planeado desde mar-2026)", antiguedad: "+4 años declarados (cuenta no identificada en fact_marcas.csv)", volumen: "No verificable — autoreportado: pico 168/mes (may-2026)", segmento: "Huérfana operativa · sin comercial hasta la llamada" },
  { marca: "Yercy Shop (Camilo Moreno)", tipo: "Híbrido deliberado — Marcas Dropshippers (\"se dropshipea a sí mismo\")", antiguedad: "Antigua, pico histórico jun-2025", volumen: "~13.733/mes jul-2026 (pico histórico 16.331)", segmento: "Altísimo volumen (Escalando)" },
  { marca: "UBY Tienda Online (Ingrid Pinzón)", tipo: "Marca", antiguedad: "Declarado feb-2024 (ambigüedad de cuenta — 2 candidatas)", volumen: "Muy volátil: 0–100/mes 2026 (cuenta 769528)", segmento: "Baja consistencia · huérfana operativa hasta la llamada del 28-jul" },
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

const COMPETIDORES = ["Melonn", "Mastershop", "99 envíos", "Coordinadora", "Interrapidísimo", "Skydrop", "Envía", "Efficommerce", "Eca", "99 minutos", "Aveonline"] as const;

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
  { n: 10, titulo: "Un bug técnico ya causó fuga real de volumen, no solo riesgo teórico", texto: "Santiago Lubo (Armonix Home) dividió operación con SkyDrop desde may-jun por un bug de transmisión de peso/volumen a la guía en Dropi — sus órdenes propias cayeron -58% desde el pico de enero (578→244) en el mismo periodo. Es el primer caso del corpus donde una falla técnica puntual, no una decisión comercial, se correlaciona con pérdida de volumen medible dentro de una cuenta que sigue activa.", fuente: "Entrevista Santiago Lubo, 28-jul-2026" },
  { n: 11, titulo: "Comparado cara a cara con un competidor, Dropi gana en integraciones pero pierde en velocidad de resolución", texto: "Dos entrevistas nuevas comparan a Dropi directamente contra SkyDrop con trade-offs medidos, no lealtad ciega: Ingrid Pinzón migró 100% a SkyDrop y regresó por automatización de notificaciones y transparencia de wallet, pero SkyDrop resuelve novedades en <2h vs. la demora reportada en Dropi; Santiago Lubo no migra por dependencia de integraciones Shopify/Chatea Pro exclusivas de Dropi, pese a que SkyDrop sí transmite peso/volumen correctamente. La retención de estas cuentas depende de mantener la ventaja de integración mientras se cierra la brecha de velocidad.", fuente: "Entrevistas Ingrid Pinzón e Santiago Lubo, 28-jul-2026" },
  { n: 12, titulo: "Cuentas ya en portafolio comercial llegan a la entrevista sin gestión percibida", texto: "4 de las últimas 4 entrevistas (jul-2026) — María Paula, Santiago Lubo, Yohana Quintero e Ingrid Pinzón — reportaron no tener comercial asignado o sin contacto activo hasta la propia llamada, pese a volumen relevante y (en los 3 casos identificados en dim_marcas.csv) estar formalmente en comercial 21553. La asignación por comercial_id no garantiza gestión activa percibida por la marca — coincide con el patrón transversal ya detectado en el hub de Entrevistas (4/8 casos).", fuente: "Entrevistas jul-2026 + patronesTransversales, hub/entrevistas" },
  { n: 13, titulo: "La organización ya declara la mensajería automática como su dolor prioritario, con brecha cuantificada frente a 5 de 8 competidores", texto: "El Informe Gerencial dedica una sección completa a este punto: Dropi es la única de 8 plataformas comparadas sin mensajería básica nativa al comprador — depende de Chatea Pro (aliado externo, no módulo integrado). 99envios y Aveonline la dan gratis e ilimitada; Mastershop a $29 COP/mensaje; Envia.com integrada de fábrica con 4 eventos + confirmación COD previa. Coincide y refuerza con cifras exactas el Hallazgo 9 (research externo 24-jul-2026) y la mención espontánea de Miguel Perdomo en la entrevista de Santiago Lubo (Hallazgo 10 relacionado). Tres fuentes independientes convergen en el mismo punto en menos de una semana.", fuente: "Informe Gerencial Dropi vs. Competencia, 30-jul-2026" },
  { n: 14, titulo: "Aparecen 2 brechas nuevas no detectadas en los research anteriores: integración de transportador local del seller y algoritmo de ruteo", texto: "Mastershop permite que el seller dé de alta su propio domiciliario/transportador local dentro de la plataforma sin perder el resto de la red — Dropi no lo expone, declarado \"dolor estructural\" en el informe. Mastershop (Inteliflete) y Aveonline también tienen algoritmo de ruteo automático que decide el carrier óptimo por pedido; Dropi tiene la red de transportadoras más amplia del grupo pero sin capa de optimización que la aproveche.", fuente: "Informe Gerencial Dropi vs. Competencia, 30-jul-2026" },
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
  { texto: "Resolver bugs técnicos que rompen promesas base de la guía (ej. transmisión de peso/volumen) previene fuga de volumen medible incluso sin que la marca decida migrar por completo.", fuente: "A validar — 1 caso confirmado (Santiago Lubo, -58% correlacionado), no es aún patrón" },
  { texto: "Asignar comercial activo a cuentas de volumen relevante ya en portafolio (21553/71445) reduce el riesgo de que la marca busque alternativas antes de recibir gestión — hoy la asignación formal no se traduce en contacto percibido.", fuente: "4/4 entrevistas de jul-2026 lo reportan; validar con Comercial si es un problema de proceso o de capacidad del equipo" },
  { texto: "Nativizar la mensajería automática al comprador (hoy dependiente de Chatea Pro como aliado externo) reduce devoluciones en contraentrega y carga de soporte, cerrando la brecha frente a 5 de 8 competidores que ya la ofrecen incluida.", fuente: "Informe Gerencial 30-jul-2026 + research externo 24-jul-2026 — dos fuentes convergentes, pendiente cuantificar impacto en devoluciones con Data" },
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

        {/* CAPACIDADES — síntesis priorizada, no tabla de citas */}
        <div style={sectionLabel}>Capacidades BAU priorizadas — síntesis, no clasificación oficial de Fase 4</div>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 14 }}>
          Cruce entre entrevistas, CSAT, negocios perdidos y los dos research externos (24-jul y 30-jul) en capacidades con nombre propio, no en una lista de citas sueltas. La prioridad es una lectura preliminar sobre la evidencia de Fase 1 — no adelanta la clasificación formal de Fase 4 (indispensable / retención / competitiva / diferenciador).
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {CAPACIDADES_UNIFICADAS.map((c) => {
            const p = PRIORIDAD_COLOR[c.prioridad];
            return (
              <div key={c.nombre} style={{ ...card, borderLeft: `4px solid ${p.color}` }}>
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 6 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: NAVY, lineHeight: 1.35 }}>{c.nombre}</div>
                  <span style={{ ...tagChip(p.color, p.bg), flexShrink: 0 }}>{p.label}</span>
                </div>
                <p style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.6, margin: "0 0 6px" }}>{c.pitch}</p>
                <div style={{ fontSize: 10.5, color: "var(--muted)", fontStyle: "italic" }}>Evidencia: {c.evidencia}</div>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 14, padding: "14px 16px", border: "1px dashed var(--border)", borderRadius: 10 }}>
          <div style={subLabel}>Señales menores — evidencia insuficiente para priorizar todavía</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 12, color: "var(--muted)", lineHeight: 1.7 }}>
            {SENALES_MENORES.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>

        {/* ENTREVISTAS */}
        <div style={sectionLabel}>Entrevistas cualitativas (9) — 4 incorporadas 30-jul-2026</div>
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
          0 de 9 entrevistas corresponden a marcas abandonadas o que evaluaron Dropi y no ingresaron — sesgo de cobertura hacia activas, ya señalado en el documento fuente. Sí aparece por primera vez fuga parcial de volumen dentro de una marca activa (Santiago Lubo dividió operación con SkyDrop) — ver Hallazgo 10.
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
          Melonn, Mastershop, 99 envíos, Coordinadora e Interrapidísimo vienen del insumo Comercial (22-jul-2026). <b>Skydrop</b> y <b>Envía</b> se agregan por conocimiento directo de Kate — no vienen del PDF ni de <code>fact_marcas.csv</code>. Envía domina el volumen de órdenes en México y también tiene presencia en Colombia. <b>Efficommerce</b> (<a href="https://efficommerce.com" target="_blank" rel="noopener noreferrer" style={{ color: BLUE }}>efficommerce.com</a>) fue mencionado por María Paula Arrechea (Distribuidora Natural) y también por Santiago Lubo (como &quot;EFI&quot;, 2 años de uso previo) — es el mismo Grupo Effi del Informe Gerencial 30-jul-2026. <b>Skydrop</b> se refuerza con dos entrevistas nuevas: Santiago Lubo (uso paralelo actual, capta parte de su volumen) e Ingrid Pinzón (migró 100% en 2024/2025 y regresó a Dropi). <b>Eca</b> y <b>99 minutos</b> son mención nueva de Yohana Esther Quintero — se los recomendaron pero no los ha probado, sin evidencia de uso real. <b>Aveonline</b> es incorporación nueva del Informe Gerencial 30-jul-2026 (multitransportadora + CRM) — no viene de ninguna entrevista ni del insumo Comercial.
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

        <div style={{ ...card, borderLeft: `4px solid ${BLUE}`, borderRadius: 10, marginTop: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: BLUE }}>🔎 Investigación externa disponible — Informe Gerencial (30-jul-2026)</span>
            <span style={tagChip(BLUE, BLU_BG)}>Standalone — no es la Fase 5 oficial</span>
          </div>
          <p style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.6, margin: "0 0 6px" }}>
            Benchmarking gerencial que compara a Dropi contra <b>Grupo Effi, Melonn, 99envios, Mastershop, Coordinadora y Aveonline</b> (elaborado a partir de la propuesta comercial de Dropi para Beaulife-Apiflower, mayo 2026, más los benchmarks individuales de cada competidor). A diferencia del research de 24-jul-2026, este informe presenta tanto ventajas como brechas de Dropi con data cuantificada, y dedica una sección completa a la mensajería automática al cliente — declarándola explícitamente <b>&quot;dolor prioritario&quot;</b> desde la propia organización, no solo desde el research externo. Igual que el research anterior, es investigación standalone: no adelanta ni reemplaza la Fase 5 oficial.
          </p>
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, margin: 0 }}>
            Documento completo: <a href="/Informe_Gerencial_Dropi_vs_Competencia.pdf" target="_blank" rel="noopener noreferrer" style={{ color: BLUE, fontWeight: 700 }}>ver informe gerencial (PDF) →</a>. Ver Hallazgo 13 abajo para el resumen y las secciones &quot;Dónde Dropi ya gana&quot; y Mapa de capacidades para el detalle de brechas nuevas.
          </p>
        </div>

        {/* VENTAJAS VALIDADAS — contrapeso a la página, orientada a brechas */}
        <div style={sectionLabel}>Dónde Dropi ya gana — evidencia validada, Informe Gerencial 30-jul-2026</div>
        <div style={{ border: `1px solid ${GREEN}`, background: GREEN_BG, borderRadius: 10, padding: "16px 18px" }}>
          <p style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.7, margin: 0 }}>
            <b>Cobertura internacional:</b> 12 países (LATAM + Europa) — 2,4x el competidor más cercano (Effi, 5 países). <b>Infraestructura física propia:</b> 3 bodegas activas (Cali, Bogotá, Medellín) y red completa de transportadoras con presencia in-house para resolver incidencias — ningún agregador del grupo (99envios, Mastershop, Aveonline) expone esto. <b>Barrera de entrada:</b> afiliación y plataforma $0, sin permanencia — empatado con 99envios, Mastershop y Aveonline, mejor que Effi (pago semestral/anual $110k–260k+/mes) y Melonn ($1.649.900/mes). <b>Wallet:</b> retiro del recaudo COD en cualquier momento, sin esperar ciclo — empatado solo con Aveonline; mejor que Melonn (semanal) y Coordinadora (5-11 días hábiles). <b>Devoluciones:</b> flete $0 excepto vía Coordinadora — mejor que Effi (cobra fulfillment en devoluciones) y Melonn (cobra envío + unpacking).
          </p>
          <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10, paddingTop: 10, borderTop: "1px solid var(--border)", lineHeight: 1.6 }}>
            Nota de la fuente: &quot;same-day&quot; delivery también figura como ventaja frente a 99envios/Aveonline/Coordinadora, pero el propio informe señala que <b>el servicio no está funcionando del todo en este momento y requiere consolidación operativa</b> antes de sostenerlo comercialmente — no se incluye aquí como ventaja cerrada.
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
          Fuente: Agente de Investigación BAU Competitivo para Marcas.docx · Insumo Comercial 22-jul-2026 · fact_marcas.csv · dim_marcas.csv act. 14-jul-2026 · Diagnostico_Marcas_CSAT_16jul2026.xlsx · Research externo competitivo 24-jul-2026 (analisis-competitivo-bau-marcas-24jul2026.html, standalone) · 4 entrevistas incorporadas 30-jul-2026 (Santiago Lubo, Yohana Quintero, Yercy Shop, Ingrid Pinzón — hub/entrevistas) · Informe Gerencial Dropi vs. Competencia, 30-jul-2026 (Informe_Gerencial_Dropi_vs_Competencia.pdf, standalone)<br />
          Análisis agente Data_Brands · Uso interno Célula Brands Success · Jul 2026
        </div>
      </div>
    </main>
  );
}
