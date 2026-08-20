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

type Props = {
  label: string;
  value: ReactNode;
  /** Color SOLO si el número comunica salud. Un número neutro se queda neutro. */
  tone?: Tone;
  size?: "md" | "lg";
  /** Una línea de lectura. Máximo ~120 caracteres (ley §2). */
  hint?: ReactNode;
  /** Delta, badge o cualquier apoyo al lado de la etiqueta. */
  aside?: ReactNode;
};

export default function Stat({ label, value, tone = "neutral", size = "md", hint, aside }: Props) {
  return (
    <div className={size === "lg" ? "u-stat u-stat--lg" : "u-stat"}>
      <div className="u-row" style={{ gap: 8 }}>
        <span className="u-stat__label">{label}</span>
        {aside}
      </div>
      <span className="u-stat__value" data-tone={tone}>
        {value}
      </span>
      {hint && <span className="u-stat__hint">{hint}</span>}
    </div>
  );
}
