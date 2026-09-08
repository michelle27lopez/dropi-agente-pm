// Cell Board de célula servido desde el repo (no desde la tabla Supabase
// `celula_updates`). Nace para Brands (2026-09-03, Kate): el Cell Board vivía
// solo como fila en `celula_updates`, y agregar uno obligaba a correr un
// `.sql` a mano contra la base — a diferencia del Weekly PM, que es un
// archivo `.ts` en el repo y fluye con el merge + deploy. Esto le da al Cell
// Board el mismo flujo que el Weekly.
//
// La carpeta arranca con `_` → Next.js la trata como carpeta privada y NO
// genera ninguna ruta bajo /celula.
//
// Para agregar un Cell Board nuevo:
// 1. Crear hub/src/app/celula/_cell-board/<celula>/YYYY-MM-DD.ts con la entry.
// 2. Importarlo en index.ts y sumarlo al array de esa célula.
// El `content` es markdown a mano (## títulos, líneas "---", párrafos) — lo
// interpreta el mismo modal que ya renderiza los updates de la base.

export type CellBoardEntry = {
  weekDate: string;   // "YYYY-MM-DD"
  title: string;      // ej. "Cell Board 03-sep-2026 · PMF segmento Escalando"
  content: string;    // markdown a mano
  url?: string | null; // link opcional "Ver más →" (ej. a una página propia)
};

// Forma que consumen las páginas de updates — idéntica a una fila de
// `celula_updates` ya normalizada, para poder mezclarlas sin ramas extra.
export type CellBoardUpdate = {
  id: string;
  week_date: string;
  title: string;
  content: string;
  url: string | null;
  tipo: "cell_board";
};
