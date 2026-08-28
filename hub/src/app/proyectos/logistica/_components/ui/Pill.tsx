import type { ReactNode } from "react";
import type { Tone } from "./tone";

// Etiqueta de estado.
//
// No define CSS propio a propósito: se apoya en `.pill` de registro.css, que ya
// estaba bien resuelto (rampa --tint/--edge/--on, que es la que da contraste
// legible a 11px sobre fondo teñido). Lo que aporta este componente es cerrar
// la puerta a los otros TRES vocabularios de píldora que convivían con él —
// `.estado.e-*`, `.wk-estado.est-*` y `.pri.p-*`—, cada uno con su propia
// paleta hardcodeada.
//
// `code` es para identificadores (LOG-004, PRM-1219): monoespaciada y neutra,
// porque un código no es un estado y no debe ganar color.

type Props = {
  children: ReactNode;
  tone?: Tone;
  code?: boolean;
  /** Amplía, nunca sustituye: el tooltip no existe en móvil ni en proyector. */
  title?: string;
};

const CLASE: Record<Tone, string> = {
  neutral: "",
  ok: "is-ok",
  warn: "is-warn",
  risk: "is-risk",
  info: "is-info",
};

export default function Pill({ children, tone = "neutral", code, title }: Props) {
  const clase = ["pill", CLASE[tone], code && "is-code"].filter(Boolean).join(" ");
  return (
    <span className={clase} title={title}>
      {children}
    </span>
  );
}
