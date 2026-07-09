export type Semana = {
  slug: string;
  fecha: string;
  resumen: string;
  temas: string[];
};

// Registro histórico de presentaciones semanales del cellboard.
// Cada semana nueva: agregar aquí + crear proyectos/celula/<slug>/page.tsx.
export const SEMANAS: Semana[] = [
  {
    slug: "2026-07-09",
    fecha: "09 de julio, 2026",
    resumen:
      "Caza Productos, Categorización y Descuentos — los 3 conectados por las mismas 2 entrevistas con proveedores del 08/07 (Gisela y Andrés). Métricas + insights, demo de cada prototipo y preguntas para el equipo.",
    temas: ["Caza Productos", "Categorización", "Descuentos"],
  },
];
