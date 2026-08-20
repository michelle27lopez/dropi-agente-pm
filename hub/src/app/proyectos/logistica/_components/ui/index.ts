// Primitivos del tablero de logística.
//
// Ley: logistica-lab/metodologia/tablero-diseno.md §4.
// Estilos: ../../_styles/ui.css (cargado desde el layout de la sección).
//
// REGLA: ninguna pantalla define su propia card, píldora, barra, tabla ni stat
// tile. Si un primitivo no alcanza, se EXTIENDE el primitivo — no se inventa
// una clase local. Así fue como se llegó a 14 cards, 8 barras y 4 vocabularios
// de píldora distintos.

export { default as Card } from "./Card";
export { default as Pill } from "./Pill";
export { default as Table, Vacio, type Column } from "./Table";
export { default as DataList, type Dato } from "./DataList";
export { default as Stat } from "./Stat";
export { default as Bar } from "./Bar";
export { default as Disclosure } from "./Disclosure";
export { default as PageHeader } from "./PageHeader";
export { default as SectionTitle } from "./SectionTitle";
export type { Tone, CardTone } from "./tone";
