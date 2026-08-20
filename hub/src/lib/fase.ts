// Fase de un proyecto derivada de `type` — mecanismo real que Jaime
// construyó en Darwin (migraciones 036 + 039). Compartido entre /proyectos
// (tabs + tabla) y el breadcrumb de cada página de proyecto. "Following" es
// un `type` real de la tabla `projects` (con `related_delivery_id` propio),
// no depende de Jira — los estados de Jira son solo referencia, la fuente
// de verdad es esta arquitectura en Supabase.
export type Fase = "discovery" | "poc" | "delivery" | "following";

export function faseDe(type: string | null | undefined): Fase {
  if (type === "POC") return "poc";
  if (type === "Delivery Proyecto") return "delivery";
  if (type === "Following") return "following";
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
