import Link from "next/link";
import type { ReactNode } from "react";

// Cabecera de página. Existe para obligar a algo que faltaba:
//
// /mapa, /experimentos y /pendientes abrían directamente con un
// <div className="eyebrow"> — un div, no un heading. Sin <h1> no hay landmark
// de título para lectores de pantalla, y visualmente el título de la página y
// el encabezado de una sección interna pesaban exactamente lo mismo, así que la
// jerarquía era plana desde el primer píxel.
//
// El título va en `headline` (22px), no en `display` (32px): el 32 se reserva
// para el número que manda. Si el título de la página compite en tamaño con la
// métrica, el ojo va al título — y el título nunca es la noticia.

type Props = {
  title: string;
  /** Una frase. Qué pregunta responde esta pantalla. */
  subtitle?: string;
  /** Migaja de vuelta. Solo en pantallas de nivel 3 (ficha). */
  back?: { href: string; label: string };
  /** Filtros, botón de imprimir, selector de semana. */
  aside?: ReactNode;
};

export default function PageHeader({ title, subtitle, back, aside }: Props) {
  return (
    <header className="u-pagehead">
      <div className="u-pagehead__main">
        {back && (
          <Link href={back.href} className="u-pagehead__back">
            ← {back.label}
          </Link>
        )}
        <h1>{title}</h1>
        {subtitle && <p className="u-pagehead__sub">{subtitle}</p>}
      </div>
      {aside && <div className="u-pagehead__aside">{aside}</div>}
    </header>
  );
}
