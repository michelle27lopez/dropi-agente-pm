// Primitivos del tablero de logística.
//
// Ley: logistica-lab/metodologia/tablero-diseno.md §4.
// Estilos: ../../_styles/ui.css (cargado desde el layout de la sección).
//
// REGLA: ninguna pantalla define su propia card, píldora, barra, tabla ni stat
// tile. Si un primitivo no alcanza, se EXTIENDE el primitivo — no se inventa
// una clase local. Así fue como se llegó a 14 cards, 8 barras y 4 vocabularios
// de píldora distintos.
//
// Los cuatro últimos (KpiCard, FilterPills, Narrativa, Recursos) llegaron el
// 28-ago replicando lo que funciona en las pantallas de Suppliers —KPI card
// elegible, pill tabs, bloque de hallazgo, grid de recursos— pero con los
// tokens y las reglas de acá.

export { default as Card } from "./Card";
export { default as Pill } from "./Pill";
export { default as Table, Vacio, type Column } from "./Table";
export { default as DataList, type Dato } from "./DataList";
export { default as Stat, type Delta } from "./Stat";
export { default as Bar } from "./Bar";
export { default as Disclosure } from "./Disclosure";
export { default as PageHeader } from "./PageHeader";
export { default as SectionTitle } from "./SectionTitle";
export { default as KpiCard } from "./KpiCard";
export { default as FilterPills, type OpcionPill } from "./FilterPills";
export { default as Narrativa } from "./Narrativa";
export { default as Recursos, GRUPO_LINK } from "./Recursos";
export type { Tone, CardTone } from "./tone";
