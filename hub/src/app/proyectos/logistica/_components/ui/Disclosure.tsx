import type { ReactNode } from "react";

// El sitio donde vive el detalle que no cabe en dos líneas.
//
// Unifica los tres <details> estilizados distinto (.ne-plegable, .reg-como,
// .rec-t-detalle) y, sobre todo, le da un destino al texto largo mientras se
// reescriben los campos de `_lib/data.ts`: hoy hay campos de hasta 790
// caracteres renderizados crudos dentro de una card.
//
// ⚠️ No es la solución al texto largo, es el paliativo. Esconder un párrafo de
// 800 caracteres detrás de un clic no lo hace legible — solo lo hace opcional.
// La solución es la cirugía de contenido (ley §2). Este componente existe para
// lo que legítimamente es detalle: trazabilidad, notas de fuente, el histórico.

export default function Disclosure({
  summary,
  children,
  open,
}: {
  /** Qué hay dentro, no "ver más". El resumen tiene que decir si vale abrirlo. */
  summary: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <details className="u-disc" open={open}>
      <summary>{summary}</summary>
      <div className="u-disc__body">{children}</div>
    </details>
  );
}
