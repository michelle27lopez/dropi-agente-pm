import type { Tone } from "./tone";

// Barra de progreso / proporción.
//
// Reemplaza las OCHO barras que había (.gauge, .leak .track, .wk-gap-bar,
// .wk-compara-bar, .bar-list-track, .cn-track, .sim-bar, .rec-t-barra), con
// alturas entre 6px y 16px, unas con gradiente y otras planas — variación que
// no significaba nada.
//
// Los gradientes de `.gauge` se retiran: DESIGN.md los rechaza como decoración,
// y en una barra de 8px un gradiente de dos verdes es invisible salvo que se
// mire de cerca, que es precisamente lo que un tablero no debe exigir.

type Props = {
  /** 0–100. Se recorta al rango: un dato fuera de escala no debe romper el layout. */
  value: number;
  tone?: Tone;
  /** Marca de meta, en la misma escala 0–100. Se pinta encima del relleno. */
  meta?: number;
  /** Descripción para lectores de pantalla — la barra sola no dice nada. */
  label?: string;
};

const acotar = (n: number) => Math.max(0, Math.min(100, n));

export default function Bar({ value, tone = "neutral", meta, label }: Props) {
  return (
    <div
      className="u-bar"
      data-tone={tone}
      role="img"
      aria-label={label ?? `${Math.round(value)}%`}
    >
      <span className="u-bar__fill" style={{ width: `${acotar(value)}%` }} />
      {meta !== undefined && <span className="u-bar__meta" style={{ left: `${acotar(meta)}%` }} />}
    </div>
  );
}
