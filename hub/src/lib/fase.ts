// Fase de un proyecto derivada de `type` — mecanismo real que Jaime
// construyó en Darwin (migraciones 036 + 039). Compartido entre /proyectos
// (tabs + tabla) y el breadcrumb de cada página de proyecto. Ver
// [[project_nomenclatura_fases]]: "Following" es una fase de Jira que
// Darwin aún no sincroniza, así que nunca sale de esta función — no hay
// dato real que la produzca todavía.
export type Fase = "discovery" | "poc" | "delivery" | "following";

export function faseDe(type: string | null | undefined): Fase {
  if (type === "POC") return "poc";
  if (type === "Delivery Proyecto") return "delivery";
  return "discovery";
}

export const FASE_LABEL: Record<Fase, string> = {
  discovery: "Discovery",
  poc: "POC",
  delivery: "Delivery",
  following: "Following",
};

export const FASE_COLOR: Record<Fase, string> = {
  discovery: "var(--t-warning, #F1B44C)",
  poc: "var(--t-info, #50A5F1)",
  delivery: "var(--dropi)",
  following: "var(--t-success, #0ABB87)",
};
