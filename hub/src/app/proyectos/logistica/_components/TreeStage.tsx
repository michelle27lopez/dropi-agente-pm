import type { CSSProperties } from "react";
import Link from "next/link";
import type { Etapa, Proyecto } from "@/app/proyectos/logistica/_lib/data";

// Una rama del árbol: la etapa como nodo en el tronco + sus proyectos como hojas.
// Cada hoja lleva a la ficha del proyecto.
export default function TreeStage({
  etapa,
  proyectos,
  last,
}: {
  etapa: Etapa;
  proyectos: Proyecto[];
  last: boolean;
}) {
  const style = { ["--sc"]: etapa.color } as CSSProperties;
  return (
    <div className="branch" style={style}>
      <div className="spine">
        <span className="node">{etapa.n}</span>
        {!last && <span className="line" />}
      </div>
      <div className="branch-body">
        <div className="branch-head">
          <span className="stage-name">{etapa.nombre}</span>
          <span className="stage-sub">{etapa.sub}</span>
        </div>
        {etapa.fuga && (
          <div className={`fuga ${etapa.fuga.tono}`}>
            {/* El número dejó de vivir dentro del texto: era un glifo circulado
                de Unicode que se veía distinto en cada sistema. */}
            {etapa.fuga.n && (
              <span className="fuga-n" aria-label={`Fuga ${etapa.fuga.n}`}>
                <span>{etapa.fuga.n}</span>
              </span>
            )}
            {etapa.fuga.label}
          </div>
        )}
        <div className="leaves">
          {proyectos.length === 0 && <span className="chip empty">sin proyecto</span>}
          {proyectos.map((p) => (
            // Ojo: la ruta es /proyectos/logistica/proyecto/<slug>. Estuvo
            // apuntando a /proyecto/<slug> (sin el prefijo de la sección), así
            // que TODAS las hojas del mapa daban 404.
            <Link key={p.slug} className="chip leaf" href={`/proyectos/logistica/proyecto/${p.slug}`}>
              {p.destacado ? "⭐ " : ""}
              {p.nombre}
              <small className="chip-tipo">{p.tipo}</small>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
