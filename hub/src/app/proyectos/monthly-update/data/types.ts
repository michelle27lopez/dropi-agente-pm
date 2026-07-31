export type Kpi = {
  icon: string;
  label: string;
  value: string;
  sub: string;
  subExtra?: string;
  accent?: boolean;
};

export type CicloCompletoItem = {
  proyecto: string;
  fechas: string;
  dias: number;
  sprints: number;
};

export type Experimentacion = {
  titulo: string;
  desc: string;
  numExperimentos: number;
  numCelulas: number;
};

export type StatusSlice = {
  label: string;
  value: number;
  color: string;
};

export type HandoffBar = {
  celula: string;
  value: number;
  color: string;
};

export type CelulaRow = {
  label: string;
  value: string;
  color: string;
};

export type CelulaDetail = {
  celula: string;
  pm: string;
  color: string;
  rows: CelulaRow[];
  badge: string;
  badgeColor: string;
  badgeBg: string;
  experimentos?: string;
  dedupNote?: string;
};

export type ReflexionCard = {
  titulo: string;
  color: string;
  items: string[];
};

export type ComparativoRow = {
  metrica: string;
  nota?: string;
  valores: string[]; // alineado con MonthlySnapshot.comparativoMeses, mismo orden
  delta: string;
  direction: "up" | "down" | "flat";
};

export type CelulaComparativoRow = {
  metrica: string;
  valores: string[]; // alineado con MonthlySnapshot.comparativoMeses, mismo orden
};

export type CelulaComparativo = {
  celula: string;
  color: string;
  rows: CelulaComparativoRow[];
};

export type Novedad = {
  text: string;
  color: string;
};

// Resumen ejecutivo que va primero en el dashboard — conecta la adopción de
// herramientas/metodología con el momento en que los tiempos del equipo vuelven
// a ser una conversación confiable. No es "el reporte", es la lectura de por qué
// el reporte se ve como se ve este mes.
export type PilarAdopcion = {
  nombre: string;
  icon: string;
  estado: string;
};

export type MesLectura = {
  mes: string;
  rol: string;
  activo: boolean; // true = mes actual
};

export type ConclusionEjecutiva = {
  mensaje: string;
  submensaje: string;
  pilares: PilarAdopcion[];
  meses: MesLectura[];
};

// Tiempo promedio entre el arranque de una etapa y la siguiente (Discovery → POC →
// Delivery → Following), calculado con la fecha de creación del primer ticket
// etiquetado de cada etapa dentro de un mismo proyecto. Requiere que el proyecto
// tenga 2+ etapas distintas ya tagueadas — por eso el tamaño de muestra (n) suele
// ser bajo al principio y crece mes a mes según se adopta la taxonomía.
export type EtapaTransicion = {
  transicion: string; // "Discovery → POC"
  dias: number;
  n: number;
};

export type TiempoPorEtapa = {
  celula: string;
  color: string;
  transiciones: EtapaTransicion[];
};

export type MonthlySnapshot = {
  month: string;
  monthLabel: string;
  conclusionEjecutiva: ConclusionEjecutiva;
  kpis: Kpi[];
  cicloCompletoNota: string;
  cicloCompletoItems: CicloCompletoItem[];
  cicloCompletoPromedio: string;
  experimentacion: Experimentacion;
  statusDistribution: StatusSlice[];
  handoffsPorCelula: HandoffBar[];
  tiempoPorEtapa: TiempoPorEtapa[];
  celulasDetail: CelulaDetail[];
  mejorasMetodologia: string[];
  reflexiones: ReflexionCard[];
  comparativoMeses: string[];
  comparativoGlobal: ComparativoRow[];
  comparativoCelulas: CelulaComparativo[];
  novedades: Novedad[];
  fuente: string;
};
