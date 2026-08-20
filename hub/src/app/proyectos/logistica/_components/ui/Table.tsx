import type { ReactNode } from "react";

// Tabla del tablero.
//
// No existía ninguna: había una `InfoTable` local sin exportar dentro de
// info-logistica/page.tsx, tablas con estilos inline en VigiaConcept y una
// `.rec-tabla` propia en recolecciones. Los experimentos, que son lo más
// comparable del tablero, se renderizaban como cards con cinco bloques de prosa
// cada una — imposible compararlos y, sobre todo, imposible ver qué faltaba.
//
// LA REGLA QUE JUSTIFICA EL COMPONENTE: una tabla sirve para comparar N cosas
// sobre los mismos ejes, y su superpoder es que UNA CELDA VACÍA ES UN HALLAZGO.
// Por eso el vacío no se deja en blanco: se dibuja como "—" con su tooltip. Un
// hueco silencioso se lee como "no aplica"; uno marcado se lee como "falta el
// dato", que es justo lo que el tablero tiene que delatar.

export type Column<T> = {
  key: string;
  header: string;
  /** Números a la derecha, con cifras tabulares. */
  align?: "left" | "right";
  width?: string;
  render: (fila: T) => ReactNode;
  /** Marca la cabecera como clicable para ordenar. El orden lo aplica quien consume. */
  sortable?: boolean;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  getKey: (fila: T, i: number) => string;
  /** Qué decir cuando no hay ni una fila. Un filtro sin resultados no es un error. */
  empty?: string;
  caption?: string;

  // ── Orden ──────────────────────────────────────────────────────────────────
  // El estado vive FUERA, en quien consume la tabla, y no aquí dentro. No es
  // capricho: `render` es una función y las funciones no cruzan la frontera
  // server→client, así que este componente no puede llevar "use client" sin
  // obligar a que toda página que lo use sea cliente. Manteniéndolo tonto,
  // sirve igual a una página de servidor que a una con filtros interactivos.
  /** Columna por la que está ordenado ahora mismo. */
  sortKey?: string;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
};

/** Marca explícita de dato ausente. Exportada para usarla dentro de un `render`. */
export function Vacio({ motivo = "sin dato" }: { motivo?: string }) {
  return (
    <span className="u-empty" title={motivo}>
      —
    </span>
  );
}

// null, undefined y "" son "no hay dato". `false` y `0` NO lo son: 0 órdenes es
// un dato real y tiene que poder pintarse.
function conVacio(valor: ReactNode): ReactNode {
  return valor === null || valor === undefined || valor === "" ? <Vacio /> : valor;
}

export default function Table<T>({
  columns,
  rows,
  getKey,
  empty = "Sin resultados.",
  caption,
  sortKey,
  sortDir,
  onSort,
}: Props<T>) {
  return (
    <div className="u-table-wrap">
      <table className="u-table">
        {caption && <caption className="u-table__empty">{caption}</caption>}
        <thead>
          <tr>
            {columns.map((c) => {
              const activa = sortKey === c.key;
              return (
                <th
                  key={c.key}
                  style={c.width ? { width: c.width } : undefined}
                  data-align={c.align ?? "left"}
                  aria-sort={activa ? (sortDir === "desc" ? "descending" : "ascending") : undefined}
                >
                  {c.sortable && onSort ? (
                    <button type="button" className="u-table__sort" onClick={() => onSort(c.key)}>
                      {c.header}
                      <span aria-hidden data-activa={activa || undefined}>
                        {activa ? (sortDir === "desc" ? "↓" : "↑") : "↕"}
                      </span>
                    </button>
                  ) : (
                    c.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="u-table__empty" colSpan={columns.length}>
                {empty}
              </td>
            </tr>
          ) : (
            rows.map((fila, i) => (
              <tr key={getKey(fila, i)}>
                {columns.map((c) => (
                  <td key={c.key} data-align={c.align ?? "left"}>
                    {conVacio(c.render(fila))}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
