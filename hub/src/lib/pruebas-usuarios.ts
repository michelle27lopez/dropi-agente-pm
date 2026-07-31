export type PruebaUsuario = {
  key: string;
  name: string;
  description: string;
  url: string;
  tag: string;
  color: string;
  icon: string;
};

export const pruebasUsuarios: PruebaUsuario[] = [
  {
    key: "prueba-descuentos",
    name: "Descuentos en Catálogo",
    description: "Pantallas de Precio Antes / Precio Ahora para probar directamente con el usuario, sin pasar por el resto del proyecto.",
    url: "/proyectos/descuentos/prototipo",
    tag: "DESC-001",
    color: "#F59E0B",
    icon: "🧪",
  },
  {
    key: "prueba-categorizacion",
    name: "Categorización y Enriquecimiento",
    description: "Simulador de categorías para probar directamente con el usuario, sin pasar por el resto del proyecto.",
    url: "/proyectos/categorizacion/prototipo",
    tag: "CAT-001",
    color: "#7C3AED",
    icon: "🧪",
  },
];
