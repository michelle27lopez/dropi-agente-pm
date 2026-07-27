import fs from "node:fs";
import path from "node:path";
import type { Pendiente, Prioridad } from "@/app/proyectos/logistica/_lib/data";

// Lee el bloque marcado de logistica-lab/planning/todos.md (fuente de verdad) — nada
// hardcodeado aquí. Se recalcula en cada build/deploy de Vercel: editar el bloque +
// git push = /pendientes al día.
//
// El build corre con cwd = hub/, así que el cerebro queda un nivel arriba. Antes de
// migrar a Darwin, este path era "../planning/todos.md" porque el tablero vivía en
// tablero/ dentro del propio repo del cerebro.
const TODOS_PATH = path.join(process.cwd(), "..", "logistica-lab", "planning", "todos.md");
const START = "<!-- tablero:pendientes:start -->";
const END = "<!-- tablero:pendientes:end -->";
const LINE = /^-\s*(🔴|🟡|🟢)\s*\[([^\]]+)\]\s*(.+)$/;
const PRIORIDAD_POR_EMOJI: Record<string, Prioridad> = {
  "🔴": "Alta",
  "🟡": "Media",
  "🟢": "Baja",
};

export function getPendientes(): Pendiente[] {
  // Nunca tumbar el build del hub por un archivo de logística: si el cerebro no está
  // (checkout parcial, root directory distinto en Vercel), esta página sale vacía y el
  // resto de las células despliega igual.
  let raw: string;
  try {
    raw = fs.readFileSync(TODOS_PATH, "utf-8");
  } catch {
    console.warn(`[logistica] no se pudo leer ${TODOS_PATH} — /pendientes queda vacía`);
    return [];
  }
  const start = raw.indexOf(START);
  const end = raw.indexOf(END);
  if (start === -1 || end === -1) return [];

  return raw
    .slice(start + START.length, end)
    .split("\n")
    .map((linea) => linea.trim().match(LINE))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map(([, emoji, proyecto, texto]) => ({
      texto,
      proyecto,
      prioridad: PRIORIDAD_POR_EMOJI[emoji],
    }));
}
