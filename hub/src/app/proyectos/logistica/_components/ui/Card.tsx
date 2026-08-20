import Link from "next/link";
import type { ReactNode } from "react";
import type { CardTone } from "./tone";

// Superficie única del tablero.
//
// Reemplaza las 14 definiciones de card que había repartidas (.kpi, .leak,
// .navcard, .exp, .info-panel, .wk-ind-card, .wk-hallazgo, .cr-kpi, .rule,
// .sim-summary, .source-note, .ciclo-card…), todas con el mismo patrón
// —fondo blanco, borde 1px, radio— pero con seis radios distintos y sombras
// inconsistentes.
//
// Dos decisiones que vienen con ella:
//
// 1. Plana en reposo. La sombra aparece SOLO si la card es navegable (`href`),
//    porque una superficie elevada promete que algo pasa al tocarla.
// 2. El acento de estado es una barra a la izquierda, siempre. Antes convivían
//    borde-izquierdo y borde-superior sin que la diferencia significara nada.

type Props = {
  children: ReactNode;
  /** Acento de estado. Omitir cuando la card no comunica salud — que es casi siempre. */
  tone?: CardTone;
  /** Si está, la card entera es un destino. Externa (http) abre en pestaña nueva. */
  href?: string;
  /** Sin padding: para tablas o listas que llevan su propio ritmo interno. */
  flush?: boolean;
  className?: string;
  title?: string;
};

export default function Card({ children, tone = "neutral", href, flush, className, title }: Props) {
  const clase = ["u-card", flush && "u-card--flush", className].filter(Boolean).join(" ");
  const props = { className: clase, "data-tone": tone, title };

  if (!href) return <div {...props}>{children}</div>;

  return href.startsWith("http") ? (
    <a {...props} href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  ) : (
    <Link {...props} href={href}>
      {children}
    </Link>
  );
}
