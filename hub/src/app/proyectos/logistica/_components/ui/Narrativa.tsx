import type { ReactNode } from "react";
import type { Tone } from "./tone";

// Un hallazgo con su conclusión: eyebrow → titular → detalle.
//
// Es el bloque `Narrativa` de caza-productos (Suppliers), que es lo que hace
// que esa página se lea como un informe y no como un dashboard: cada gráfica
// va acompañada de UNA frase que dice qué concluir de ella.
//
// En Logística, la "lectura" de la comparación mensual y el "foco" del weekly
// eran <p> de 400 caracteres en gris. Aquí el titular lleva la conclusión (ley
// §2: "el título dice la conclusión, no el tema") y el resto baja a detalle.
// El fondo se tiñe con el tono SOLO si el hallazgo pide reacción; neutro es
// gris suave.

type Props = {
  /** Quién/qué habla: "Cierre de julio", "Recolecciones", "Research". */
  eyebrow?: string;
  /** La conclusión, en una frase. ≤ 140 caracteres. */
  titulo: string;
  children?: ReactNode;
  tone?: Tone;
};

export default function Narrativa({ eyebrow, titulo, children, tone = "neutral" }: Props) {
  return (
    <div className="u-narrativa" data-tone={tone}>
      {eyebrow && <span className="u-narrativa__eyebrow">{eyebrow}</span>}
      <p className="u-narrativa__titulo">{titulo}</p>
      {children && <div className="u-narrativa__detalle">{children}</div>}
    </div>
  );
}
