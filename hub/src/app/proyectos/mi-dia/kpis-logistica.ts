// KPIs de la célula Logistic Success para el panel de "Mi día".
//
// ⚠️ DATO CONGELADO, NO SERIE. Ninguna cifra de logística del hub se refresca:
// todas son transcripciones manuales de Power BI / Monitor Operativo. Y los dos
// bloques vienen de MESES DISTINTOS — por eso cada uno lleva su corte impreso en
// la UI en vez de un "actualizado hoy" que sería mentira.
//
// Se transcriben aquí (6 números) en vez de importar `_lib/data.ts`, que son
// 2.257 líneas del tablero: no vale meter todo ese bundle en el home de célula
// para leer seis valores. Las fuentes quedan citadas por si divergen.
//
// Fuentes:
//   · Fases        → proyectos/logistica/_lib/data.ts (fasesTiempo, junio 2026)
//                    y logistica-lab/estrategia/primera-medicion-kpis-y-meta.md §2.1
//   · Entrega      → logistica-lab/estrategia/primera-medicion-kpis-y-meta.md §1
//   · Novedad      → proyectos/logistica/_lib/info-logistica-data.ts (F, destinoFinal, mayo 2026)

export type KpiLogistica = {
  label: string;
  /** Valor ya formateado para mostrar. */
  valueLabel: string;
  /** Valor numérico para comparar contra la meta (en %). */
  value: number;
  /** Meta en %. `null` = sin meta validada todavía. */
  target: number | null;
  /** Hacia dónde es bueno moverse. `statusFor` lo necesita. */
  dir: "mayor" | "menor";
  meta: string;
};

export type GrupoKpiLogistica = {
  titulo: string;
  corte: string;
  kpis: KpiLogistica[];
};

// KPI de Q3/Q4 de la célula: tiempo de la orden hasta la transportadora ≤ 24h.
//
// ⚠️ NO existe el número único acumulado (creación → handoff). Está declarado
// como faltante en primera-medicion-kpis-y-meta.md §2.1 y en _lib/data.ts, y el
// propio repo advierte que las fases NO se pueden sumar: los volúmenes difieren
// (2,11M en confirmación vs 973K en handoff), es un diamante, no un embudo.
// Por eso se muestran las tres fases que el PM pidió como submétricas, no un
// total inventado. El acumulado sale cuando Data corra la Query 2 de
// conocimiento/temas/03-modelo-datos-y-estados.md.
export const TIEMPO_24H: GrupoKpiLogistica = {
  titulo: "Entrega a la transportadora en 24h",
  corte: "Monitor Operativo · junio 2026",
  kpis: [
    {
      label: "Tiempo de confirmación",
      valueLabel: "84,9%",
      value: 84.91,
      target: 90,
      dir: "mayor",
      meta: "11,8 h promedio · 318K sobre 24h",
    },
    {
      label: "Tiempo de recolección",
      valueLabel: "80,6%",
      value: 80.64,
      target: 90,
      dir: "mayor",
      meta: "8,3 h promedio · 96K sobre 24h",
    },
    {
      label: "Entregado a transportadora",
      valueLabel: "99,4%",
      value: 99.37,
      target: 90,
      dir: "mayor",
      meta: "2,0 h promedio · 6K sobre 24h",
    },
  ],
};

// NSM de la célula: tasa de entrega exitosa ≥ 70% (OKR 2 · KR 2.1).
//
// El embudo de novedad va SIN meta a propósito: "Primera medición de KPIs y
// definición de meta" sigue sin cerrarse en el Product Backlog, y el % de
// novedades "solucionadas" tiene dos valores según la base (28,5% vs 3,4%,
// ver info-logistica-data.ts). Se publica lo que sí es unívoco —cuántas entran
// y cuántas terminan entregadas— y se omite "solucionadas" hasta elegir base:
// el propio repo registra el hallazgo de que "'resuelta' es humo".
export const TASA_ENTREGA: GrupoKpiLogistica = {
  titulo: "% de entrega",
  corte: "Q5/Q8 · mayo 2026",
  kpis: [
    {
      label: "Tasa de entrega",
      valueLabel: "62,5%",
      value: 62.5,
      target: 70,
      dir: "mayor",
      meta: "Colombia · NSM de la célula",
    },
    {
      label: "Órdenes que entran a novedad",
      valueLabel: "39,5%",
      value: 39.5,
      target: null,
      dir: "menor",
      meta: "571K de 1,44M movilizadas",
    },
    {
      label: "Novedades que se entregan",
      valueLabel: "16,7%",
      value: 16.7,
      target: null,
      dir: "mayor",
      meta: "el 31,1% termina en devolución",
    },
  ],
};

export const GRUPOS_LOGISTICA: GrupoKpiLogistica[] = [TIEMPO_24H, TASA_ENTREGA];
