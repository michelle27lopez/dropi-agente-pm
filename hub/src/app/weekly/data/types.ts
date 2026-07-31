export type MetricGroup = {
  label: string;
  value: string;
  sub?: string;
  tooltip?: string;
};

export type ProyectoMetricas = {
  base: MetricGroup[];
  meta: MetricGroup[];
  seguimiento: MetricGroup[];
};

export type Oportunidad = {
  code: string;
  name: string;
  status: string;
  statusColor: string;
  color: string;
  mueve: string;
  hipotesis: string;
  gmv: string;
  avance: string;
  next: string;
  badge: string;
  badgeColor: string;
  metricas: ProyectoMetricas;
  ttvLive?: boolean; // si true → base se sobreescribe con datos en vivo de la API
};

export type Dolor = {
  frente: string;
  tag: string;
  tagColor: string;
  salio: string;
  ruta: string;
  rutaColor: string;
  metrica: string;
  decision: string;
};

export type ProximoPaso = {
  titulo: string;
  color: string;
  items: string[];
};

export type HeroChip = {
  label: string;
  value: string;
  sub: string;
};

export type Insight = {
  id: string;
  titulo: string;
  descripcion: string;
  proyecto: string;
  tipo: string;       // "Hallazgo" | "Riesgo" | "Decisión" | "Dato"
  tipoColor: string;
  impacto: string;    // "Alto" | "Medio" | "Bajo"
};

export type Documento = {
  code: string;
  nombre: string;
  descripcion: string;
  tipo: string;       // "E2E" | "Discovery" | "TOBE" | "Research" | "Data"
  color: string;
  href: string;       // ruta pública, ej. "/desc001-precio-antes-ahora-e2e.html"
  proyecto: string;
  fecha: string;
};

export type KpiCard = {
  label: string;
  value: string;
  sub: string;
  color: string;       // accent color del valor y la barra
  icon: string;        // emoji
  progress?: number;   // 0-100 para barra de progreso opcional
  alert?: boolean;     // tratamiento visual de alerta (rojo/amarillo)
};

export type KpiOkr = {
  titulo: string;      // nombre del OKR
  etiqueta: string;    // chip badge, e.g. "OKR 1.1"
  actual: string;      // valor actual formateado, e.g. "18"
  objetivo: string;    // valor objetivo formateado, e.g. "104"
  brecha: string;      // diferencia formateada, e.g. "86"
  pct: number;         // 0-100 para la barra
  nota?: string;       // aviso opcional bajo la barra (e.g. "Medición manual por ahora")
};

export type WeeklySnapshot = {
  week: string;          // "Semana 19–25 jun 2026"
  subtitle: string;
  heroBadge: string;     // chip pill en el hero
  heroTitle: string;     // h1 principal
  heroStrip: HeroChip[]; // los chips de métricas del hero
  kpiOkrs?: KpiOkr[];    // una o más tarjetas OKR con barra de progreso (opcional)
  kpis?: KpiCard[];      // grilla de métricas clave (opcional)
  insights?: Insight[];  // siempre primera sección — se agregan durante la semana
  oportunidades: Oportunidad[];
  documentos?: Documento[];
  dolores: Dolor[];
  resumen: string;       // párrafo del resumen ejecutivo (puede contener HTML)
  proximosPasos: ProximoPaso[];
};
