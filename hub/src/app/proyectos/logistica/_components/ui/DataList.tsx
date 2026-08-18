import type { ReactNode } from "react";

// Lista de etiqueta → valor.
//
// Nace de un problema concreto de la ficha de proyecto: la línea de metadatos
// era una sopa. Se leía así:
//
//     Proyecto · Definición · [Pendiente] · Generación · spec parcial
//
// Cinco EJES DISTINTOS —tipo, fase, handoff, etapa y estado del spec— puestos
// en fila, separados por puntos y sin una sola etiqueta. Nadie que abra la
// ficha puede saber que "Pendiente" es el handoff y "Definición" es la fase; y
// como el único con color era el handoff, el color parecía señalar importancia
// cuando solo señalaba qué eje era.
//
// Un dato sin su etiqueta no es información: es una palabra suelta.
//
// El vacío se dibuja "—" por la misma razón que en Table: un hueco silencioso
// se lee como "no aplica" y uno marcado se lee como "falta el dato".

export type Dato = { label: string; value: ReactNode; hint?: string };

export default function DataList({
  items,
  columns = 2,
}: {
  items: Dato[];
  /** 2 en ficha; 1 en panel lateral estrecho. */
  columns?: 1 | 2 | 3;
}) {
  return (
    <dl className="u-datalist" data-cols={columns}>
      {items.map((d) => (
        <div key={d.label} className="u-datalist__item">
          <dt title={d.hint}>{d.label}</dt>
          <dd>
            {d.value === null || d.value === undefined || d.value === "" ? (
              <span className="u-empty" title="sin dato">
                —
              </span>
            ) : (
              d.value
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}
