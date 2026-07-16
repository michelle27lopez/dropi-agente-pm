import { snapshot as s_2026_06_19 } from "./2026-06-19";
import { snapshot as s_2026_06_26 } from "./2026-06-26";
import { snapshot as s_2026_07_03 } from "./2026-07-03";
import { snapshot as s_2026_07_08 } from "./2026-07-08";
import { snapshot as s_2026_07_10 } from "./2026-07-10";
import { snapshot as s_2026_07_17 } from "./2026-07-17";
import type { WeeklySnapshot } from "./types";

// ─── Registro de semanas ──────────────────────────────────────────────────────
// Para agregar una nueva semana:
// 1. Crear hub/src/app/weekly/data/YYYY-MM-DD.ts copiando la semana anterior
// 2. Importarla aquí y agregarla al REGISTRY y a SEMANAS
// 3. Actualizar CURRENT a la nueva fecha

export const REGISTRY: Record<string, WeeklySnapshot> = {
  "2026-07-17": s_2026_07_17,
  "2026-07-10": s_2026_07_10,
  "2026-07-08": s_2026_07_08,
  "2026-07-03": s_2026_07_03,
  "2026-06-26": s_2026_06_26,
  "2026-06-19": s_2026_06_19,
};

// `celula`: slug de la célula dueña de esa semana (usado para el header/pie
// dinámico de /weekly y para la tarjeta "Weekly" en /celula/[slug]).
export const SEMANAS: { date: string; label: string; celula: string }[] = [
  { date: "2026-07-17", label: "Semana 17 jul 2026", celula: "suppliers" },
  { date: "2026-07-10", label: "Semana 10 jul 2026", celula: "suppliers" },
  { date: "2026-07-08", label: "Semana 08 jul 2026", celula: "suppliers" },
  { date: "2026-07-03", label: "Semana 03 jul 2026", celula: "suppliers" },
  { date: "2026-06-26", label: "Semana 26 jun–02 jul 2026", celula: "suppliers" },
  { date: "2026-06-19", label: "Semana 19–25 jun 2026", celula: "suppliers" },
];

export const CELULA_LABELS: Record<string, string> = {
  suppliers: "Supplier Success",
  brands: "Brands Success",
};

export const CURRENT = "2026-07-17";
