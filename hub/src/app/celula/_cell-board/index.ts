import type { CellBoardEntry, CellBoardUpdate } from "./types";
import { entry as brands_2026_08_27 } from "./brands/2026-08-27";
import { entry as brands_2026_09_03 } from "./brands/2026-09-03";

export type { CellBoardEntry, CellBoardUpdate } from "./types";

// ─── Registro de Cell Boards por célula (servidos desde el repo) ──────────────
// Clave = slug de la célula. Ordena de más nuevo a más viejo (la página igual
// re-ordena por fecha, pero se mantiene la convención del Weekly).
const CELL_BOARDS_BY_CELULA: Record<string, CellBoardEntry[]> = {
  brands: [brands_2026_09_03, brands_2026_08_27],
};

/**
 * Cell Boards de una célula servidos desde el repo, ya con la forma de una
 * fila normalizada de `celula_updates` para poder mezclarlos con los de la
 * base sin ramas extra. El `id` es estable y prefijado (`cb-local-…`) para no
 * chocar nunca con un uuid de la tabla.
 */
export function localCellBoards(celulaSlug: string): CellBoardUpdate[] {
  const entries = CELL_BOARDS_BY_CELULA[celulaSlug] ?? [];
  return entries.map((e) => ({
    id: `cb-local-${celulaSlug}-${e.weekDate}`,
    week_date: e.weekDate,
    title: e.title,
    content: e.content,
    url: e.url ?? null,
    tipo: "cell_board" as const,
  }));
}
