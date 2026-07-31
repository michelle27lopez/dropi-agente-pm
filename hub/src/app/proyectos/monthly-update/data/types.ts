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
  abril: string;
  mayo: string;
  junio: string;
  delta: string;
  direction: "up" | "down" | "flat";
};

export type CelulaComparativoRow = {
  metrica: string;
  abril: string;
  mayo: string;
  junio: string;
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

export type MonthlySnapshot = {
  month: string;
  monthLabel: string;
  kpis: Kpi[];
  cicloCompletoNota: string;
  cicloCompletoItems: CicloCompletoItem[];
  cicloCompletoPromedio: string;
  experimentacion: Experimentacion;
  statusDistribution: StatusSlice[];
  handoffsPorCelula: HandoffBar[];
  celulasDetail: CelulaDetail[];
  mejorasMetodologia: string[];
  reflexiones: ReflexionCard[];
  comparativoMeses: string[];
  comparativoGlobal: ComparativoRow[];
  comparativoCelulas: CelulaComparativo[];
  novedades: Novedad[];
  fuente: string;
};
