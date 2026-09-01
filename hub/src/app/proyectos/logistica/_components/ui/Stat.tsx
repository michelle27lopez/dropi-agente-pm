import type { ReactNode } from "react";
import type { Tone } from "./tone";

// Un número con su etiqueta.
//
// Reemplaza .stat-box, .mini-stat, .info-kpi-card, .reg-hueco y .rec-kpi: cinco
// variantes del mismo tile que no se diferenciaban en nada salvo el radio.
//
// REGLA: un solo número por Stat. El bloque `.ns` de la home ponía cuatro
// métricas del mismo tamaño una al lado de otra —meta, baseline, brecha, meta
// Q3— y el resultado era que el número que manda perdía la pelea contra tres
// números de contexto. Si hay un número principal, `size="lg"`, y los demás son
// contexto tipográficamente subordinado.
//
// `delta` es la excepción que confirma la regla: no es un segundo número, es
// la dirección del primero ("+0,4 pts", "↓ 3 días"). Va debajo, en 11px, y se
// tiñe con el mismo vocabulario de cuatro estados. Es el "badge de delta
// tricolor" de caza-productos (Suppliers), pero como texto: la flecha basta y
// no compite con el número.

export type Delta = {
  text: string;
  /** Dirección. Pinta la flecha; el color lo decide `tone`, no la dirección —
      subir no siempre es bueno (órdenes no movilizadas). */
  trend?: "up" | "down" | "flat";
  tone?: Tone;
};

const FLECHA: Record<NonNullable<Delta["trend"]>, string> = { up: "↑", down: "↓", flat: "→" };

type Props = {
  label: string;
  value: ReactNode;
  /** Color SOLO si el número comunica salud. Un número neutro se queda neutro. */
  tone?: Tone;
  size?: "md" | "lg";
  /** Contexto pegado al número, subordinado: "/ meta 90%". */
  meta?: string;
  delta?: Delta;
  /** Una línea de lectura. Máximo ~120 caracteres (ley §2). */
  hint?: ReactNode;
  /** Badge o cualquier apoyo al lado de la etiqueta. */
  aside?: ReactNode;
};

export default function Stat({ label, value, tone = "neutral", size = "md", meta, delta, hint, aside }: Props) {
  return (
    <div className={size === "lg" ? "u-stat u-stat--lg" : "u-stat"}>
      <div className="u-row" style={{ gap: 8 }}>
        <span className="u-stat__label">{label}</span>
        {aside}
      </div>
      <span className="u-stat__value" data-tone={tone}>
        {value}
        {meta && <span className="u-stat__meta">/ meta {meta}</span>}
      </span>
      {delta && (
        <span className="u-stat__delta" data-tone={delta.tone ?? "neutral"}>
          {delta.trend && <span aria-hidden>{FLECHA[delta.trend]} </span>}
          {delta.text}
        </span>
      )}
      {hint && <span className="u-stat__hint">{hint}</span>}
    </div>
  );
}
