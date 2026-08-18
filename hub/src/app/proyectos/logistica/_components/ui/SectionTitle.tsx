// Encabezado de sección dentro de una página.
//
// Reemplaza a `.eyebrow`, que era el único separador de sección del tablero y
// arrastraba tres problemas a la vez:
//
//   1. Un <div>, no un heading: la página no tenía estructura navegable.
//   2. `font-weight: 800` + tracking + una barrita naranja — el patrón de
//      "kicker en mayúsculas sobre cada sección" que DESIGN.md §6 rechaza por
//      nombre como parte del look genérico que este proyecto evita.
//   3. Se usaba tanto para titular la PÁGINA como para titular una SECCIÓN,
//      con el mismo peso en ambos casos. Dos jerarquías distintas, un solo
//      tamaño: por eso todo pesaba igual.
//
// Ahora es un <h2> real, subordinado al <h1> del PageHeader, y la barrita
// naranja desaparece: el acento de marca va en un solo elemento por vista, no
// repetido delante de cada bloque.

export default function SectionTitle({ children, hint }: { children: string; hint?: string }) {
  return (
    <div className="u-section">
      <h2>{children}</h2>
      {hint && <p>{hint}</p>}
    </div>
  );
}
