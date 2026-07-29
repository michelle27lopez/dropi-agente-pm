"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Los updates de la célula de Logística.
//
// Por qué existe: /celula/logistica mostraba "Aún no hay updates registrados"
// aunque la célula lleva semanas publicando weekly. Eran dos vacíos sumados:
//
//   1. `celula_updates` no tiene fila para logística. La tabla tiene un
//      UNIQUE global sobre `week_date` (010_celula_updates.sql), así que la
//      semana que ya ocupó otra célula bloquea a las demás.
//   2. El registro de /weekly (app/weekly/data/index.ts) solo mapea semanas de
//      `suppliers` y `brands`. Logística no aparece, así que `SEMANAS.filter`
//      tampoco devolvía nada.
//
// Pero el weekly de logística SÍ existe: son las 4 entradas de `weeklies` en el
// tablero (proyectos/logistica/_lib/data.ts), que ya se publican en
// /proyectos/logistica/updates. Esto las trae a la home de la célula.
//
// Se reutiliza <Section> del hub para que la tarjeta se vea idéntica a la de
// las demás células — el contenido cambia, el lenguaje visual no.
// ─────────────────────────────────────────────────────────────────────────────

import { weeklies } from "@/app/proyectos/logistica/_lib/data";
import { Section, type Item } from "@/components/HomeSections";

const RUTA_WEEKLY = "/proyectos/logistica/updates";

function truncar(texto: string, max: number) {
  return texto.length > max ? texto.slice(0, max - 1).trimEnd() + "…" : texto;
}

export default function UpdatesLogistica({
  extra = [],
  onItemClick,
}: {
  /** Updates de `celula_updates`, si algún día logística consigue una fila. */
  extra?: Item[];
  onItemClick?: (item: Item) => void;
}) {
  // `weeklies` ya viene de la más reciente a la más antigua (lo documenta
  // data.ts), así que no se reordena: el orden es una decisión de quien escribe.
  //
  // Va como UNA tarjeta, no una por semana: cuatro tarjetas iguales llenaban la
  // rejilla sin decir más que la primera, y además /updates siempre abre en la
  // más reciente — las otras tres enlazaban al mismo sitio.
  const ultima = weeklies[0];
  const items: Item[] = ultima
    ? [
        {
          key: "weekly-logistica",
          name: `Weekly Producto · ${weeklies.length} semanas`,
          description: `${ultima.semana} — ${truncar(ultima.foco, 130)}`,
          url: RUTA_WEEKLY,
          tag: ultima.fecha,
          color: "#F77F00",
          icon: "📅",
        },
      ]
    : [];

  const todos = [...extra, ...items];

  return (
    <>
      <Section title="Updates" items={todos} ctaLabel="Ver weekly →" onItemClick={onItemClick} />
      {todos.length === 0 && (
        <p style={{ fontSize: 13, color: "var(--muted)" }}>Aún no hay updates registrados.</p>
      )}
    </>
  );
}
