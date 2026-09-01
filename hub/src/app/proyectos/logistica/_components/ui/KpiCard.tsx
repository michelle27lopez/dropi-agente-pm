import type { ReactNode } from "react";
import Card from "./Card";
import Stat, { type Delta } from "./Stat";
import type { Tone } from "./tone";

// Un indicador en su card: Card + Stat, y nada que no esté ya en los dos.
//
// Existe para cerrar `.wk-ind-card` (la card de indicador del weekly, con
// borde superior de color, hover que la levantaba 3px y un cuarto vocabulario
// de badge) y para traer el patrón que sí vale la pena del Metrics Lab de
// Suppliers: la KPI card ELEGIBLE. Se toca una y la gráfica de al lado cambia
// de serie. La card no sabe de gráficas; solo avisa con `onSelect`.
//
// Lo que NO trae de Suppliers, a propósito: el icono lucide de tendencia (la
// flecha en texto ya lo dice), el badge "Saludable/Riesgo/Crítico" redundante
// con el color, y el círculo decorativo de la esquina.

type Props = {
  label: string;
  value: ReactNode;
  tone?: Tone;
  meta?: string;
  delta?: Delta;
  hint?: ReactNode;
  /** Badge junto a la etiqueta (una Pill, normalmente el estado corto). */
  badge?: ReactNode;
  /** Card grande: para el número que manda en la pantalla. */
  size?: "md" | "lg";
  selected?: boolean;
  onSelect?: () => void;
};

export default function KpiCard({ label, value, tone, meta, delta, hint, badge, size, selected, onSelect }: Props) {
  return (
    <Card tone={tone && tone !== "neutral" ? tone : "neutral"} onClick={onSelect} selected={selected} className="u-kpi">
      <Stat label={label} value={value} tone={tone} meta={meta} delta={delta} hint={hint} aside={badge} size={size} />
    </Card>
  );
}
