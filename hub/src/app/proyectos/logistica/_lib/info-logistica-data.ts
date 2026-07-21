// Datos de logística — Mayo 2026 (exploración real).
// Portados fielmente desde fuentes/funnel_prototipo (2).html.
// Fuente de verdad = el HTML original + los queries Q5/Q8/Q9/Q18 en Power BI.

export type SankeyNodeInput = { name: string; color: string };
export type SankeyLinkInput = { source: number; target: number; value: number };
export type SankeyData = {
  nodes: SankeyNodeInput[];
  links: SankeyLinkInput[];
  height: number;
};

export type KpiTone = "blue" | "green" | "red" | "amber" | "purple" | "cyan";
export type Kpi = { label: string; value: string; note: string; tone: KpiTone };

export type BarDatum = {
  label: string;
  value: number;
  detail?: string;
  color?: string;
};

export type TimeTransition = {
  label: string;
  orders: number;
  avgHours: number;
  medianHours: number;
  type: string;
  color: string;
};

// =============================================
// DATA BASE — Funnel Mayo 2026
// =============================================
export const F = {
  total: 1859341,
  cancel: 216473,
  rechaz: 22503,
  pend_conf: 86578,
  pendiente: 27737,
  guia_gen: 45780,
  confirmado: 29,
  otro_no_mov: 16185,
  no_mov: 176309,
  movil: 1444058,
  entreg: 848088,
  devol: 119214,
  con_nov: 571072,
  sin_nov: 872986,
  nov_entreg: 251217,
  nov_devol: 107118,
  nov_proceso: 212737,
  sn_entreg: 596871,
  sn_devol: 12096,
  sn_proceso: 264019,
};

// =============================================
// VIEW 1 · FUNNEL GENERAL
// =============================================
export const kpisFunnel: Kpi[] = [
  { label: "Órdenes creadas", value: "1,86M", note: "Mayo 2026", tone: "blue" },
  { label: "Tasa entrega", value: "58,7%", note: "848K de 1,44M movilizadas", tone: "green" },
  { label: "Cancelación", value: "11,6%", note: "216K canceladas", tone: "red" },
  { label: "Devolución", value: "8,3%", note: "119K sobre movilizadas", tone: "amber" },
  { label: "Pasaron novedad", value: "39,5%", note: "571K de 1,44M", tone: "cyan" },
  { label: "Devol. x novedad", value: "89,8%", note: "107K de 119K devol.", tone: "red" },
];

export const funnelSankey: SankeyData = {
  height: 430,
  nodes: [
    { name: "Creadas", color: "#3b82f6" },
    { name: "Canceladas", color: "#ef4444" },
    { name: "Rechazadas", color: "#f87171" },
    { name: "Pend. Confirmación", color: "#94a3b8" },
    { name: "Pendiente", color: "#a1a1aa" },
    { name: "Guía Generada", color: "#78716c" },
    { name: "Otro No Movil.", color: "#64748b" },
    { name: "Movilizadas", color: "#3b82f6" },
    { name: "Pasó por Novedad", color: "#f59e0b" },
    { name: "Sin Novedad", color: "#06b6d4" },
    { name: "Entregado", color: "#10b981" },
    { name: "Devolución", color: "#ef4444" },
    { name: "En Proceso", color: "#64748b" },
  ],
  links: [
    { source: 0, target: 1, value: F.cancel },
    { source: 0, target: 2, value: F.rechaz },
    { source: 0, target: 3, value: F.pend_conf },
    { source: 0, target: 4, value: F.pendiente },
    { source: 0, target: 5, value: F.guia_gen },
    { source: 0, target: 6, value: F.otro_no_mov + F.confirmado },
    { source: 0, target: 7, value: F.movil },
    { source: 7, target: 8, value: F.con_nov },
    { source: 7, target: 9, value: F.sin_nov },
    { source: 8, target: 10, value: F.nov_entreg },
    { source: 8, target: 11, value: F.nov_devol },
    { source: 8, target: 12, value: F.nov_proceso },
    { source: 9, target: 10, value: F.sn_entreg },
    { source: 9, target: 11, value: F.sn_devol },
    { source: 9, target: 12, value: F.sn_proceso },
  ],
};

// =============================================
// VIEW 2 · NOVEDADES & RESOLUCIÓN
// =============================================
export const kpisNovedades: Kpi[] = [
  { label: "Órdenes con novedad", value: "261K", note: "órdenes únicas · history_orders", tone: "amber" },
  { label: "Estado actual: novedad", value: "188,5K", note: "snapshot hoy · orders", tone: "purple" },
  { label: "Recuperadas", value: "—", note: "pendiente query real", tone: "green" },
  { label: "Perdidas", value: "—", note: "pendiente query real", tone: "red" },
  { label: "Peor resolución", value: "40,4%", note: "No se encuentra destinat.", tone: "red" },
  { label: "Mejor resolución", value: "75,6%", note: "Fija fecha y hora recibo", tone: "green" },
];

export const lifecycleSankey: SankeyData = {
  height: 560,
  nodes: [
    { name: "CREADAS", color: "#3b82f6" },
    { name: "CANCELADO", color: "#ef4444" },
    { name: "RECHAZADO", color: "#f87171" },
    { name: "REEMPLAZADA", color: "#94a3b8" },
    { name: "GUÍA GENERADA", color: "#60a5fa" },
    { name: "PREPARACIÓN", color: "#8b5cf6" },
    { name: "LOGÍSTICA DROPI", color: "#7c3aed" },
    { name: "TRANSPORTE", color: "#06b6d4" },
    { name: "ÚLTIMA MILLA", color: "#10b981" },
    { name: "RECLAME OFICINA", color: "#f97316" },
    { name: "ENTREGADO", color: "#10b981" },
    { name: "NOVEDAD", color: "#f59e0b" },
    { name: "RE-DESPACHO", color: "#0891b2" },
    { name: "DEVOLUCIÓN", color: "#dc2626" },
    { name: "EN TRÁNSITO/PEND.", color: "#64748b" },
  ],
  links: [
    { source: 0, target: 1, value: 241000 },
    { source: 0, target: 2, value: 75000 },
    { source: 0, target: 3, value: 226000 },
    { source: 0, target: 4, value: 1296000 },
    { source: 4, target: 5, value: 1150000 },
    { source: 4, target: 14, value: 146000 },
    { source: 5, target: 6, value: 1150000 },
    { source: 6, target: 7, value: 830000 },
    { source: 6, target: 8, value: 320000 },
    { source: 7, target: 8, value: 480000 },
    { source: 7, target: 9, value: 250000 },
    { source: 7, target: 13, value: 100000 },
    { source: 8, target: 10, value: 540000 },
    { source: 8, target: 11, value: 170000 },
    { source: 8, target: 13, value: 90000 },
    { source: 9, target: 10, value: 200000 },
    { source: 9, target: 13, value: 50000 },
    { source: 11, target: 10, value: 30000 },
    { source: 11, target: 12, value: 90000 },
    { source: 11, target: 13, value: 50000 },
    { source: 12, target: 10, value: 50000 },
    { source: 12, target: 13, value: 25000 },
    { source: 12, target: 14, value: 15000 },
  ],
};

export const fuentesNovedad = [
  { num: "~261K", label: "Órdenes únicas con novedad", table: "history_orders", desc: "Órdenes distintas que alguna vez tuvieron novedad_servientrega. Una orden puede tener múltiples eventos.", tone: "amber" as KpiTone },
  { num: "188,5K", label: "Órdenes HOY en estado novedad", table: "orders", desc: "Snapshot actual: órdenes cuyo status es novedad ahora mismo. Menor porque muchas ya se resolvieron o devolvieron.", tone: "purple" as KpiTone },
  { num: "449K", label: "Eventos de novedad (carrier)", table: "history_orders", desc: "Total de eventos novedad_servientrega. Mayor porque 1 orden puede tener 5-10 novedades si el carrier reintenta y falla.", tone: "red" as KpiTone },
  { num: "464K", label: "Registros tracking interno", table: "history_new_orders", desc: "Eventos internos de tracking con campo solución. Sistema independiente del carrier. Incluye gestión interna.", tone: "blue" as KpiTone },
];

// Tipos de novedad — órdenes únicas (valor = órdenes; detalle = eventos)
export const novedadTipos: BarDatum[] = [
  { label: "REHUSA RECIBIR", value: 78765, detail: "110.742 eventos", color: "#ef4444" },
  { label: "COORDINAR ENTREGA", value: 75213, detail: "105.120 eventos", color: "#f59e0b" },
  { label: "DIRECCIÓN NO EXISTE", value: 21430, detail: "24.436 eventos", color: "#dc2626" },
  { label: "Se visita no logra entrega", value: 17970, detail: "25.358 eventos", color: "#fb923c" },
  { label: "Pedido cancelado", value: 13953, detail: "18.017 eventos", color: "#f87171" },
  { label: "No hay quien reciba", value: 13206, detail: "16.264 eventos", color: "#e879f9" },
  { label: "No contesta cliente", value: 11923, detail: "16.007 eventos", color: "#d97706" },
  { label: "No localiza dirección", value: 10941, detail: "16.380 eventos", color: "#8b5cf6" },
  { label: "DIRECCIÓN INCOMPLETA", value: 9413, detail: "10.525 eventos", color: "#a78bfa" },
  { label: "Reprogramar entrega", value: 8159, detail: "9.343 eventos", color: "#06b6d4" },
  { label: "FIJA FECHA Y HORA", value: 7208, detail: "8.486 eventos", color: "#10b981" },
  { label: "NO SE ENCUENTRA DESTINAT.", value: 5895, detail: "7.196 eventos", color: "#94a3b8" },
  { label: "No cancela valor RCE", value: 5158, detail: "6.206 eventos", color: "#64748b" },
  { label: "NO CONOCEN DESTINAT.", value: 4827, detail: "5.480 eventos", color: "#0d9488" },
  { label: "DESTINATARIO NO PAGARÁ", value: 4778, detail: "5.636 eventos", color: "#059669" },
];

// Destino final de órdenes con novedad (valor = %)
export const destinoFinal: BarDatum[] = [
  { label: "DEVOLUCIÓN", value: 31.1, detail: "58.600 órdenes", color: "#ef4444" },
  { label: "Aún en NOVEDAD", value: 28.3, detail: "53.400 órdenes", color: "#d97706" },
  { label: "ENTREGADO", value: 16.7, detail: "31.400 órdenes", color: "#10b981" },
  { label: "DESPACHADA (reintento)", value: 10.7, detail: "20.200 órdenes", color: "#3b82f6" },
  { label: "EN BODEGA / TRÁNSITO", value: 4.4, detail: "8.200 órdenes", color: "#06b6d4" },
  { label: "Otros estados", value: 5.4, detail: "10.200 órdenes", color: "#94a3b8" },
  { label: "NOVEDAD SOLUCIONADA", value: 3.4, detail: "6.500 órdenes", color: "#059669" },
];

// Tasa de resolución por tipo (valor = % resueltas)
export const resolucionRates: BarDatum[] = [
  { label: "REHUSA RECIBIR", value: 64.4, detail: "124.057 eventos", color: "#f59e0b" },
  { label: "COORDINAR LA ENTREGA", value: 71.8, detail: "114.520 eventos", color: "#059669" },
  { label: "DIRECCIÓN NO EXISTE", value: 68.6, detail: "27.377 eventos", color: "#f59e0b" },
  { label: "Se visita no se logra", value: 61.0, detail: "26.442 eventos", color: "#fb923c" },
  { label: "No se localiza dirección", value: 69.4, detail: "17.317 eventos", color: "#059669" },
  { label: "No hay quien reciba", value: 48.3, detail: "15.930 eventos", color: "#ef4444" },
  { label: "NO CONTESTA CLIENTE", value: 41.1, detail: "15.352 eventos", color: "#dc2626" },
  { label: "DIRECCIÓN INCOMPLETA", value: 66.7, detail: "11.735 eventos", color: "#f59e0b" },
  { label: "NO LE INTERESA / CANCELA", value: 74.6, detail: "9.317 eventos", color: "#10b981" },
  { label: "FIJA FECHA Y HORA RECIBO", value: 75.6, detail: "9.228 eventos", color: "#10b981" },
  { label: "Reprogramar entrega", value: 41.9, detail: "9.062 eventos", color: "#dc2626" },
  { label: "NO SE ENCUENTRA DESTINAT.", value: 40.4, detail: "7.114 eventos", color: "#dc2626" },
  { label: "DESTINATARIO NO PAGARÁ", value: 70.3, detail: "6.448 eventos", color: "#059669" },
  { label: "Pedido cancel. por cliente", value: 44.2, detail: "4.692 eventos", color: "#ef4444" },
  { label: "Dirección incorrecta", value: 46.2, detail: "3.465 eventos", color: "#ef4444" },
  { label: "EXIGE INVENTARIO", value: 74.0, detail: "2.664 eventos", color: "#10b981" },
  { label: "DIRECCIÓN ERRADA", value: 75.5, detail: "2.242 eventos", color: "#10b981" },
];

export const resolucionStats = [
  { label: "Con novedad", value: "282.910", sub: "órdenes distintas", tone: "amber" as KpiTone },
  { label: "Solucionadas", value: "80.619", sub: "28,5% del total", tone: "green" as KpiTone },
  { label: "Sin solucionar", value: "202.291", sub: "71,5% del total", tone: "red" as KpiTone },
];

// Canales de las 82.871 NOVEDAD SOLUCIONADA (valor = registros; total base 172.800)
export const canalesResolucion: BarDatum[] = [
  { label: "SIN DETALLE", value: 101000, detail: "58,4%", color: "#94a3b8" },
  { label: "INTERNO (con notes)", value: 69000, detail: "39,9%", color: "#059669" },
  { label: "CHATEA PRO (usuario_chatcenter)", value: 2800, detail: "1,6%", color: "#3b82f6" },
];

// Novedades por transportadora — eventos y tasa
export type CarrierNov = { name: string; eventos: number; pct: number; ordenes: number; color: string };
export const novedadesPorTransp: CarrierNov[] = [
  { name: "ENVIA", eventos: 280000, pct: 62.4, ordenes: 743000, color: "#8b5cf6" },
  { name: "COORDINADORA", eventos: 55000, pct: 12.2, ordenes: 156000, color: "#059669" },
  { name: "VELOCES", eventos: 42000, pct: 9.4, ordenes: 74000, color: "#f59e0b" },
  { name: "TCC", eventos: 28000, pct: 6.2, ordenes: 37000, color: "#06b6d4" },
  { name: "JAMV-DRIVE", eventos: 22000, pct: 4.9, ordenes: 22000, color: "#f97316" },
  { name: "DEROCHA-EXPRESS", eventos: 8500, pct: 1.9, ordenes: 8000, color: "#10b981" },
  { name: "DOMINA", eventos: 5200, pct: 1.2, ordenes: 7700, color: "#e879f9" },
  { name: "WIILOG", eventos: 4100, pct: 0.9, ordenes: 4900, color: "#0d9488" },
  { name: "QUVI", eventos: 2800, pct: 0.6, ordenes: 313, color: "#64748b" },
  { name: "99MINUTOS", eventos: 1400, pct: 0.3, ordenes: 3900, color: "#dc2626" },
  { name: "INTERRAPIDISIMO", eventos: 0, pct: 0.0, ordenes: 781000, color: "#ef4444" },
];

// =============================================
// VIEW 3 · POR TRANSPORTADORA
// =============================================
export const kpisTransp: Kpi[] = [
  { label: "Transportadoras", value: "12", note: "activas Mayo 2026", tone: "blue" },
  { label: "Mayor volumen", value: "INTERRAP.", note: "781K órdenes (42%)", tone: "green" },
  { label: "Mayor % entrega", value: "DEROCHA", note: "62% tasa entrega", tone: "cyan" },
  { label: "Peor % entrega", value: "99MINUTOS", note: "38% tasa entrega", tone: "red" },
  { label: "Top 2 = 83%", value: "1,52M", note: "Interrap. + Envia", tone: "purple" },
  { label: "Total entregadas", value: "843K", note: "45,9% promedio pond.", tone: "green" },
];

export type TranspRow = { name: string; creadas: number; entreg: number; pctEnt: number; color: string };
export const transpData: TranspRow[] = [
  { name: "INTERRAPIDISIMO", creadas: 781000, entreg: 359260, pctEnt: 46.0, color: "#3b82f6" },
  { name: "ENVIA", creadas: 743000, entreg: 349210, pctEnt: 47.0, color: "#8b5cf6" },
  { name: "COORDINADORA", creadas: 156000, entreg: 65520, pctEnt: 42.0, color: "#059669" },
  { name: "VELOCES", creadas: 74000, entreg: 28860, pctEnt: 39.0, color: "#f59e0b" },
  { name: "TCC", creadas: 37000, entreg: 16650, pctEnt: 45.0, color: "#06b6d4" },
  { name: "JAMV-DRIVE", creadas: 22000, entreg: 10560, pctEnt: 48.0, color: "#f97316" },
  { name: "DEROCHA-EXPRESS", creadas: 8000, entreg: 4960, pctEnt: 62.0, color: "#10b981" },
  { name: "DOMINA", creadas: 7700, entreg: 3080, pctEnt: 40.0, color: "#e879f9" },
  { name: "WIILOG", creadas: 4900, entreg: 2842, pctEnt: 58.0, color: "#0d9488" },
  { name: "99MINUTOS", creadas: 3900, entreg: 1482, pctEnt: 38.0, color: "#dc2626" },
  { name: "QUVI", creadas: 313, entreg: 119, pctEnt: 38.0, color: "#64748b" },
  { name: "SUPPLI-EXPRESS", creadas: 1, entreg: 1, pctEnt: 100.0, color: "#94a3b8" },
];

// % de entrega por transportadora (top 10) — valor = %
export const carrierEntregaBars: BarDatum[] = transpData.slice(0, 10).map((t) => ({
  label: t.name,
  value: t.pctEnt,
  detail: `${(t.creadas / 1000).toLocaleString("es-CO")}K órdenes`,
  color: t.pctEnt >= 50 ? "#10b981" : t.pctEnt >= 42 ? "#f59e0b" : "#ef4444",
}));

// Volumen por transportadora (top 10) — valor = órdenes creadas
export const carrierVolumenBars: BarDatum[] = transpData.slice(0, 10).map((t) => ({
  label: t.name,
  value: t.creadas,
  detail: `${(t.creadas / F.total * 100).toFixed(1).replace(".", ",")}% del total`,
  color: t.color,
}));

export const interrapAlert = [
  { l: "Órdenes", v: "781K", s: "42% del total" },
  { l: "Novedades reportadas", v: "0", s: "novedad_servientrega" },
  { l: "Devoluciones", v: "173K", s: "22% de sus órdenes" },
  { l: "Sin manifiesto devol.", v: "130K", s: "75,3% de sus devol." },
];

// Sankeys por transportadora (Q18)
export type CarrierSankey = { key: string; title: string; badge: string } & SankeyData;
export const carrierSankeys: CarrierSankey[] = [
  {
    key: "inter",
    title: "INTERRAPIDISIMO — 781K ord. (42%)",
    badge: "46% ENT. · RECLAME OFICINA",
    height: 380,
    nodes: [
      { name: "ÓRDENES", color: "#3b82f6" },
      { name: "CANCEL./RECHAZ.", color: "#ef4444" },
      { name: "HUB LOGÍSTICO", color: "#8b5cf6" },
      { name: "RECLAME OFICINA", color: "#f97316" },
      { name: "VÍA REPARTO", color: "#06b6d4" },
      { name: "ENTREGADO", color: "#10b981" },
      { name: "DEVOLUCIÓN", color: "#dc2626" },
      { name: "EN PROCESO", color: "#64748b" },
    ],
    links: [
      { source: 0, target: 1, value: 156000 }, { source: 0, target: 2, value: 625000 },
      { source: 2, target: 3, value: 225000 }, { source: 2, target: 4, value: 285000 },
      { source: 2, target: 5, value: 80000 }, { source: 2, target: 6, value: 18000 }, { source: 2, target: 7, value: 17000 },
      { source: 3, target: 5, value: 175000 }, { source: 3, target: 6, value: 35000 }, { source: 3, target: 7, value: 15000 },
      { source: 4, target: 5, value: 104000 }, { source: 4, target: 6, value: 120000 }, { source: 4, target: 7, value: 61000 },
    ],
  },
  {
    key: "envia",
    title: "ENVIA — 743K ord. (40%)",
    badge: "47% ENT. · RE-DESPACHO",
    height: 380,
    nodes: [
      { name: "ÓRDENES", color: "#8b5cf6" },
      { name: "CANCEL./RECHAZ.", color: "#ef4444" },
      { name: "BOD→DESP→DESTINO", color: "#06b6d4" },
      { name: "NOVEDAD", color: "#f59e0b" },
      { name: "ENTREGADO", color: "#10b981" },
      { name: "DEVOLUCIÓN", color: "#dc2626" },
      { name: "RE-DESPACHO", color: "#0891b2" },
      { name: "EN PROCESO", color: "#64748b" },
    ],
    links: [
      { source: 0, target: 1, value: 197000 }, { source: 0, target: 2, value: 546000 },
      { source: 2, target: 3, value: 160000 }, { source: 2, target: 4, value: 248000 },
      { source: 2, target: 5, value: 80000 }, { source: 2, target: 7, value: 58000 },
      { source: 3, target: 4, value: 18000 }, { source: 3, target: 5, value: 28000 }, { source: 3, target: 6, value: 114000 },
      { source: 6, target: 4, value: 83000 }, { source: 6, target: 5, value: 28000 }, { source: 6, target: 7, value: 3000 },
    ],
  },
  {
    key: "coord",
    title: "COORDINADORA — 156K",
    badge: "42% ENT. · TERMINAL",
    height: 340,
    nodes: [
      { name: "ÓRDENES", color: "#059669" },
      { name: "SALIDAS", color: "#ef4444" },
      { name: "RED TERMINAL", color: "#06b6d4" },
      { name: "NOVEDAD", color: "#f59e0b" },
      { name: "ENTREGADO", color: "#10b981" },
      { name: "DEVOLUCIÓN", color: "#dc2626" },
      { name: "EN PROCESO", color: "#64748b" },
    ],
    links: [
      { source: 0, target: 1, value: 53000 }, { source: 0, target: 2, value: 103000 },
      { source: 2, target: 3, value: 38000 }, { source: 2, target: 4, value: 49000 },
      { source: 2, target: 5, value: 10000 }, { source: 2, target: 6, value: 6000 },
      { source: 3, target: 4, value: 17000 }, { source: 3, target: 5, value: 17000 }, { source: 3, target: 6, value: 4000 },
    ],
  },
  {
    key: "tcc",
    title: "TCC — 37K",
    badge: "45% ENT. · DISTRIBUCIÓN",
    height: 340,
    nodes: [
      { name: "ÓRDENES", color: "#06b6d4" },
      { name: "SALIDAS", color: "#ef4444" },
      { name: "DISTRIBUCIÓN", color: "#8b5cf6" },
      { name: "NOVEDAD", color: "#f59e0b" },
      { name: "ENTREGADO", color: "#10b981" },
      { name: "DEVOLUCIÓN", color: "#dc2626" },
      { name: "EN PROCESO", color: "#64748b" },
    ],
    links: [
      { source: 0, target: 1, value: 8000 }, { source: 0, target: 2, value: 29000 },
      { source: 2, target: 3, value: 8000 }, { source: 2, target: 4, value: 13000 },
      { source: 2, target: 5, value: 4000 }, { source: 2, target: 6, value: 4000 },
      { source: 3, target: 4, value: 4000 }, { source: 3, target: 5, value: 3000 }, { source: 3, target: 6, value: 1000 },
    ],
  },
  {
    key: "veloces",
    title: "VELOCES — 74K",
    badge: "39% ENT. · RUTA/CAMINO",
    height: 340,
    nodes: [
      { name: "ÓRDENES", color: "#f59e0b" },
      { name: "SALIDAS", color: "#ef4444" },
      { name: "RUTA/CAMINO", color: "#06b6d4" },
      { name: "NOVEDAD", color: "#f59e0b" },
      { name: "ENTREGADO", color: "#10b981" },
      { name: "DEVOLUCIÓN", color: "#dc2626" },
      { name: "EN PROCESO", color: "#64748b" },
    ],
    links: [
      { source: 0, target: 1, value: 22000 }, { source: 0, target: 2, value: 52000 },
      { source: 2, target: 3, value: 16000 }, { source: 2, target: 4, value: 24000 },
      { source: 2, target: 5, value: 7000 }, { source: 2, target: 6, value: 5000 },
      { source: 3, target: 4, value: 5000 }, { source: 3, target: 5, value: 10000 }, { source: 3, target: 6, value: 1000 },
    ],
  },
];

// =============================================
// VIEW 4 · MANIFIESTOS & DEVOLUCIONES
// =============================================
export const kpisManifiestos: Kpi[] = [
  { label: "Movilizadas", value: "1,44M", note: "base real — solo despachadas", tone: "blue" },
  { label: "Con manif. salida", value: "60,6%", note: "978K de movilizadas", tone: "green" },
  { label: "Con algún manif.", value: "72,8%", note: "1,17M de movilizadas", tone: "amber" },
  { label: "PreDevol. / Devol.", value: "25,3%", note: "30K de 118,8K devoluciones", tone: "purple" },
  { label: "Devol. sin PreDevol.", value: "74,7%", note: "88,8K sin trazab. retorno", tone: "red" },
  { label: "Sin ningún manif.", value: "27,2%", note: "439K sin trazabilidad", tone: "red" },
];

// Cobertura por tipo de manifiesto (valor = órdenes; base movilizadas)
export const manifestCoverage: BarDatum[] = [
  { label: "Salidas (id=9)", value: 978444, color: "#10b981" },
  { label: "Recepciones (id=4)", value: 593969, color: "#3b82f6" },
  { label: "Despachos (id=3)", value: 595306, color: "#06b6d4" },
  { label: "Recogidas (id=5)", value: 469521, color: "#8b5cf6" },
  { label: "Recepciones PAU (id=10)", value: 48480, color: "#059669" },
  { label: "PreDevolution (id=43)", value: 30459, color: "#ef4444" },
];

export type ManifestRow = { id: number; tipo: string; manif: number; ordenes: number; color: string };
export const manifestTable: ManifestRow[] = [
  { id: 9, tipo: "Salidas", manif: 61388, ordenes: 978444, color: "#10b981" },
  { id: 5, tipo: "Recogidas", manif: 23618, ordenes: 469521, color: "#8b5cf6" },
  { id: 10, tipo: "Recepciones PAU", manif: 6004, ordenes: 48480, color: "#059669" },
  { id: 4, tipo: "Recepciones", manif: 26268, ordenes: 593969, color: "#3b82f6" },
  { id: 3, tipo: "Despachos", manif: 3696, ordenes: 595306, color: "#06b6d4" },
  { id: 43, tipo: "PreDevolution", manif: 4795, ordenes: 30459, color: "#ef4444" },
];

export const devGap = { total: 118827, conPre: 30015, sinPre: 88812 };

// Brecha de devoluciones sin manifiesto por transportadora (valor = sin manif.)
export const devGapCarrier: BarDatum[] = [
  { label: "INTERRAPIDISIMO", value: 47508, detail: "79,4% · de 59.827 devol.", color: "#ef4444" },
  { label: "ENVIA", value: 30416, detail: "67,4% · de 45.107 devol.", color: "#f59e0b" },
  { label: "COORDINADORA", value: 5808, detail: "85,9% · de 6.759 devol.", color: "#ef4444" },
  { label: "TCC", value: 2015, detail: "85,0% · de 2.371 devol.", color: "#ef4444" },
  { label: "VELOCES", value: 1640, detail: "63,9% · de 2.565 devol.", color: "#fb923c" },
  { label: "JAMV-DRIVE", value: 796, detail: "63,6% · de 1.252 devol.", color: "#fb923c" },
  { label: "DEROCHA-EXPRESS", value: 391, detail: "71,0% · de 551 devol.", color: "#fb923c" },
  { label: "DOMINA", value: 135, detail: "55,1% · de 245 devol.", color: "#059669" },
  { label: "WIILOG", value: 89, detail: "81,7% · de 109 devol.", color: "#ef4444" },
  { label: "99MINUTOS", value: 74, detail: "73,3% · de 101 devol.", color: "#fb923c" },
];

export const manifiestoSankey: SankeyData = {
  height: 560,
  nodes: [
    { name: "MOVILIZADAS (1,61M)", color: "#3b82f6" },
    { name: "CON SALIDA (978K)", color: "#2563eb" },
    { name: "SIN SALIDA (636K)", color: "#94a3b8" },
    { name: "SAL+RECOG+RECEP+DESP (301K)", color: "#10b981" },
    { name: "SOLO SALIDA — sin más (572K)", color: "#f59e0b" },
    { name: "SAL+RECEP+DESP sin recogida (97K)", color: "#06b6d4" },
    { name: "SAL+otros combos (8K)", color: "#64748b" },
    { name: "SIN NINGÚN MANIFIESTO (440K)", color: "#ef4444" },
    { name: "RECOG+RECEP+DESP sin salida (160K)", color: "#8b5cf6" },
    { name: "Otros sin salida (36K)", color: "#a1a1aa" },
  ],
  links: [
    { source: 0, target: 1, value: 978444 },
    { source: 0, target: 2, value: 635351 },
    { source: 1, target: 3, value: 301337 },
    { source: 1, target: 4, value: 572040 },
    { source: 1, target: 5, value: 97351 },
    { source: 1, target: 6, value: 7716 },
    { source: 2, target: 7, value: 439536 },
    { source: 2, target: 8, value: 160047 },
    { source: 2, target: 9, value: 35768 },
  ],
};

// Cobertura por tipo — flujo secuencial (valor = % de movilizadas)
export const flujoManifiestos = [
  { label: "SALIDA — manifiesto principal", val: "60,6%", detail: "978.444 de movilizadas", color: "#10b981", nota: "Mayor cobertura. Mejor proxy de “orden realmente despachada con trazabilidad”." },
  { label: "RECOGIDA", val: "29,1%", detail: "469.521 de movilizadas", color: "#8b5cf6", nota: "Paralelo a salida. Menos de un tercio — muchas órdenes se despachan sin recogida formal." },
  { label: "RECEPCIÓN PAU", val: "3,0%", detail: "48.480 de movilizadas", color: "#059669", nota: "Paso interno Dropi. Solo una fracción pasa por PAU." },
  { label: "RECEPCIÓN", val: "36,8%", detail: "593.969 de movilizadas", color: "#3b82f6", nota: "Recepción en bodega destino." },
  { label: "DESPACHO", val: "36,9%", detail: "595.306 de movilizadas", color: "#06b6d4", nota: "Similar a recepción — probablemente las mismas órdenes." },
  { label: "PRE-DEVOLUCIÓN", val: "25,3%", detail: "30.015 de 118.827 devoluciones", color: "#ef4444", nota: "Solo 25,3% de devoluciones tienen manifiesto de retorno. 74,7% sin trazabilidad." },
];

export const pauStats = [
  { label: "Órdenes PAU", value: "48.480", sub: "Recepciones PAU (id=10)", tone: "blue" as KpiTone },
  { label: "% de movilizadas", value: "3,0%", sub: "48,5K de 1,44M", tone: "green" as KpiTone },
  { label: "Manifiestos PAU", value: "6.004", sub: "manifiestos creados", tone: "amber" as KpiTone },
];

// =============================================
// VIEW 5 · TIEMPOS ENTRE ESTADOS
// =============================================
export const kpisTiempos: Kpi[] = [
  { label: "Entrega promedio", value: "4,5–5,2d", note: "Q9 real Mar–May 2026", tone: "blue" },
  { label: "Devolución promedio", value: "9–15,6d", note: "2-3x más lento que entrega", tone: "red" },
  { label: "Ruta feliz (mediana)", value: "66h", note: "≈2,8 días (Q8 transiciones)", tone: "green" },
  { label: "Cuello botella", value: "28,4h", note: "Despachada→Bodega Destino", tone: "amber" },
  { label: "Reclame oficina", value: "212h", note: "¡9 días mediana! Alerta", tone: "red" },
  { label: "Novedad→Solución", value: "16,1h", note: "97K órdenes (mediana)", tone: "cyan" },
];

export type CicloMes = { mes: string; entregadas: number; diasEnt: number; devueltas: number; diasDev: number };
export const cicloPorMes: CicloMes[] = [
  { mes: "Marzo 2026", entregadas: 1822807, diasEnt: 5.2, devueltas: 560755, diasDev: 15.6 },
  { mes: "Abril 2026", entregadas: 1723020, diasEnt: 5.2, devueltas: 513778, diasDev: 13.8 },
  { mes: "Mayo 2026 (parcial)", entregadas: 843708, diasEnt: 4.5, devueltas: 111257, diasDev: 9.0 },
];

export const tiemposSankey: SankeyData = {
  height: 560,
  nodes: [
    { name: "CONFIRMADAS [2h]", color: "#94a3b8" },
    { name: "GUÍA GENERADA [2.5h]", color: "#3b82f6" },
    { name: "PREPARADO [3.4h]", color: "#06b6d4" },
    { name: "LOGÍSTICA DROPI [4.4h]", color: "#7c3aed" },
    { name: "TRANSPORTE [28.4h⚠]", color: "#ef4444" },
    { name: "REPARTO [7.1h]", color: "#10b981" },
    { name: "RECLAME OFIC. [212h🔴]", color: "#f97316" },
    { name: "ENTREGADO", color: "#10b981" },
    { name: "NOVEDAD [16.1h]", color: "#f59e0b" },
    { name: "RE-DESPACHO [53h⚠]", color: "#0891b2" },
    { name: "DEVOLUCIÓN [5.9h]", color: "#dc2626" },
    { name: "EN PROCESO", color: "#64748b" },
  ],
  links: [
    { source: 0, target: 1, value: 1538000 },
    { source: 0, target: 11, value: 300000 },
    { source: 1, target: 2, value: 1004000 },
    { source: 1, target: 11, value: 534000 },
    { source: 2, target: 3, value: 1004000 },
    { source: 3, target: 4, value: 610000 },
    { source: 3, target: 5, value: 320000 },
    { source: 3, target: 11, value: 74000 },
    { source: 4, target: 5, value: 460000 },
    { source: 4, target: 6, value: 100000 },
    { source: 4, target: 10, value: 50000 },
    { source: 5, target: 7, value: 647000 },
    { source: 5, target: 8, value: 328000 },
    { source: 5, target: 10, value: 136000 },
    { source: 6, target: 7, value: 175000 },
    { source: 6, target: 11, value: 48000 },
    { source: 8, target: 9, value: 114000 },
    { source: 8, target: 7, value: 97000 },
    { source: 8, target: 10, value: 117000 },
    { source: 9, target: 7, value: 64000 },
    { source: 9, target: 10, value: 35000 },
    { source: 9, target: 11, value: 15000 },
  ],
};

// Tabla top-19 de transiciones (Q8 medianas)
export const tiemposTable: TimeTransition[] = [
  { label: "PEND.CONFIRM. → PENDIENTE", orders: 993482, avgHours: 10.5, medianHours: 2.0, type: "Confirmación", color: "#94a3b8" },
  { label: "PENDIENTE → GUIA_GENERADA", orders: 1537639, avgHours: 9.5, medianHours: 2.5, type: "Guía", color: "#3b82f6" },
  { label: "GUIA → PREPARADO TRANSP.", orders: 1004301, avgHours: 9.4, medianHours: 3.4, type: "Preparación", color: "#06b6d4" },
  { label: "PREPARADO → RECOGIDO DROPI", orders: 313371, avgHours: 9.1, medianHours: 3.6, type: "Recogida", color: "#8b5cf6" },
  { label: "RECOGIDO → EN BODEGA DROPI", orders: 480498, avgHours: 2.4, medianHours: 2.0, type: "Bodega", color: "#7c3aed" },
  { label: "BODEGA DROPI → ENT. TRANSP.", orders: 612401, avgHours: 2.0, medianHours: 0.4, type: "Entrega transp.", color: "#2563eb" },
  { label: "ENT. TRANSP. → BODEGA ORIGEN", orders: 342159, avgHours: 4.7, medianHours: 2.3, type: "Bodega origen", color: "#0d9488" },
  { label: "BODEGA ORIGEN → DESPACHADA", orders: 289311, avgHours: 10.5, medianHours: 7.5, type: "Despacho", color: "#059669" },
  { label: "DESPACHADA → BODEGA DESTINO", orders: 324668, avgHours: 33.5, medianHours: 28.4, type: "⚠ Transporte", color: "#ef4444" },
  { label: "BODEGA DESTINO → EN REPARTO", orders: 459130, avgHours: 13.9, medianHours: 6.9, type: "Reparto", color: "#10b981" },
  { label: "EN REPARTO → ENTREGADO", orders: 647178, avgHours: 13.3, medianHours: 7.1, type: "✓ Entrega", color: "#10b981" },
  { label: "EN REPARTO → NOVEDAD", orders: 328463, avgHours: 17.3, medianHours: 5.1, type: "Novedad", color: "#f59e0b" },
  { label: "NOVEDAD → NOV. SOLUCIONADA", orders: 96632, avgHours: 27.7, medianHours: 16.1, type: "Resolución", color: "#06b6d4" },
  { label: "NOVEDAD → DESPACHADA", orders: 113997, avgHours: 67.8, medianHours: 53.0, type: "⚠ Re-despacho", color: "#dc2626" },
  { label: "EN REPARTO → DEVOLUCION", orders: 136215, avgHours: 9.1, medianHours: 5.9, type: "Devolución", color: "#ef4444" },
  { label: "RECLAME OFICINA → INT. ENTREGA", orders: 16332, avgHours: 218.0, medianHours: 212.0, type: "🔴 Crítico", color: "#991b1b" },
  { label: "RECLAME OFICINA → ENTREGADO", orders: 174551, avgHours: 56.9, medianHours: 44.0, type: "⚠ Lento", color: "#b45309" },
  { label: "EN PROCESAM. → BODEGA TRANSP.", orders: 581083, avgHours: 21.3, medianHours: 16.0, type: "Procesamiento", color: "#64748b" },
  { label: "EN PROCESAM. → RECLAME OFIC.", orders: 223319, avgHours: 22.1, medianHours: 14.9, type: "⚠ Reclame", color: "#dc2626" },
];

// Los primeros 12 (compat con la sección resumida existente)
export const timeTransitions: TimeTransition[] = tiemposTable.slice(0, 12);

export type FlowStep = { name: string; hours: number; color: string };
export const timeFlowSteps: FlowStep[] = [
  { name: "Confirmada", hours: 0, color: "#94a3b8" },
  { name: "Guía", hours: 2.5, color: "#3b82f6" },
  { name: "Preparado", hours: 3.4, color: "#06b6d4" },
  { name: "Recogido", hours: 3.6, color: "#8b5cf6" },
  { name: "Bod. Dropi", hours: 2.0, color: "#7c3aed" },
  { name: "Ent.Transp", hours: 0.4, color: "#2563eb" },
  { name: "Bod.Origen", hours: 2.3, color: "#0d9488" },
  { name: "Despachada", hours: 7.5, color: "#059669" },
  { name: "Bod.Destino", hours: 28.4, color: "#ef4444" },
  { name: "Reparto", hours: 6.9, color: "#10b981" },
  { name: "Entregado", hours: 7.1, color: "#10b981" },
];

export const bottlenecks = [
  { label: "RECLAME EN OFICINA → INTENTO ENTREGA", med: "212h (8,8 días)", ordenes: "16,3K", desc: "Órdenes en “reclame en oficina” se estancan casi 9 DÍAS antes del siguiente intento. 223K órdenes pasan por este estado.", color: "#991b1b" },
  { label: "DESPACHADA → BODEGA DESTINO", med: "28,4h (1,2 días)", ordenes: "325K", desc: "El transporte entre ciudades es el paso más lento de la ruta feliz. 325K órdenes esperan más de un día.", color: "#dc2626" },
  { label: "NOVEDAD → RE-DESPACHO", med: "53h (2,2 días)", ordenes: "114K", desc: "Cuando una novedad se resuelve re-despachando, toma 2+ días. Sumado al ciclo normal = entrega en 5+ días.", color: "#d97706" },
  { label: "RECLAME OFICINA → ENTREGADO", med: "44h (1,8 días)", ordenes: "175K", desc: "Incluso las que se entregan desde reclame oficina tardan casi 2 días. Es un canal lento.", color: "#f59e0b" },
];

// =============================================
// VIEW 6 · MOTIVOS CANCELACIÓN / RECHAZO
// =============================================
export const kpisMotivos: Kpi[] = [
  { label: "Total canceladas", value: "238K", note: "12,9% de creadas", tone: "red" },
  { label: "Total rechazadas", value: "48K", note: "2,6% de creadas", tone: "amber" },
  { label: "Cancel: top motivo", value: "Otros", note: "62K — mal categorizado", tone: "red" },
  { label: "Rechaz: top motivo", value: "Aut. Gerencia", note: "43K (57% de rechazos)", tone: "amber" },
  { label: "Sin motivo cancel.", value: "51K", note: "21,4% del total cancel.", tone: "purple" },
  { label: "Sin motivo rechaz.", value: "9,5K", note: "19,8% del total rechaz.", tone: "cyan" },
];

export const cancellationReasons: BarDatum[] = [
  { label: '"Otros" (agente elige Otros)', value: 62159, color: "#ef4444" },
  { label: "Cliente final cancela", value: 60818, color: "#f87171" },
  { label: "Sin motivo (null/vacío)", value: 50809, color: "#cbd5e1" },
  { label: "Pedido duplicado", value: 23857, color: "#fb923c" },
  { label: "Datos incompletos", value: 17471, color: "#f59e0b" },
  { label: "Otros (texto libre irrepetible)", value: 6883, color: "#64748b" },
  { label: "Mal historial / riesgoso", value: 3394, color: "#dc2626" },
  { label: "Cambio transportadora", value: 3386, color: "#a78bfa" },
  { label: "Cambio tipo recaudo", value: 2825, color: "#8b5cf6" },
  { label: "Sin contacto / confirmación", value: 2490, color: "#d97706" },
  { label: "Excede valor a recaudar", value: 2119, color: "#94a3b8" },
  { label: "Fraude / fake", value: 840, color: "#991b1b" },
];

export const rejectionReasons: BarDatum[] = [
  { label: "Autorizado por gerencia", value: 43000, color: "#ef4444" },
  { label: "Sin motivo (null)", value: 9500, color: "#cbd5e1" },
  { label: "No despacho del proveedor", value: 3600, color: "#fb923c" },
  { label: "Otros", value: 1600, color: "#f59e0b" },
  { label: "Cobertura", value: 1100, color: "#a78bfa" },
  { label: "Pedido duplicado", value: 1000, color: "#94a3b8" },
];

export type MonthlyBar = { month: string; cancel: number; rechaz: number };
export const cancelByMonth: MonthlyBar[] = [
  { month: "Jun", cancel: 68000, rechaz: 14000 },
  { month: "Jul", cancel: 72000, rechaz: 15000 },
  { month: "Ago", cancel: 71000, rechaz: 14500 },
  { month: "Sep", cancel: 74000, rechaz: 15500 },
  { month: "Oct", cancel: 76000, rechaz: 16000 },
  { month: "Nov", cancel: 62000, rechaz: 13000 },
  { month: "Dic", cancel: 75000, rechaz: 15500 },
  { month: "Ene", cancel: 73000, rechaz: 15000 },
  { month: "Feb", cancel: 70000, rechaz: 14500 },
  { month: "Mar", cancel: 78000, rechaz: 16000 },
  { month: "Abr", cancel: 80000, rechaz: 16500 },
  { month: "May", cancel: 82000, rechaz: 16000 },
];
