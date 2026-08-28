// Los CUATRO estados del sistema, más el neutro. No hay un quinto.
//
// DESIGN.md §2 "La Regla de los Cuatro Estados": verde/ámbar/rojo/azul son los
// únicos colores con significado. Para diferenciar una CATEGORÍA (el tipo de
// iniciativa, la fase en la que va, la etapa de la cadena) no se introduce un
// color nuevo — se usan la tipografía y el layout. Ese fue el origen del
// índigo y el morado que vivían dentro de `_lib/data.ts`.
export type Tone = "neutral" | "ok" | "warn" | "risk" | "info";

// El naranja de marca no es un estado: es la firma de Dropi, y va en UN SOLO
// elemento por vista (Regla del Acento Único). Por eso vive aparte del tipo
// `Tone` y solo lo acepta `Card` — para que no se pueda colar en una píldora,
// que es donde se multiplicaría.
export type CardTone = Tone | "brand";
