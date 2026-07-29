import type { CSSProperties } from "react";
import Link from "next/link";
import { proyectoPorSlug, type EstadoExp, type Experimento } from "@/app/proyectos/logistica/_lib/data";
import LinkList from "@/app/proyectos/logistica/_components/LinkList";

// Tarjeta de un experimento / hipótesis.
//
// La versión anterior se veía plana porque apilaba cuatro bloques idénticos
// —Hipótesis, Métrica, Impacto, Aprendizaje— con el mismo peso, y el título
// quedaba enterrado bajo la fila de estado. Nada decía qué mirar primero.
//
// Ahora: el título abre, el estado tiñe el borde izquierdo (es un estado, así
// que el color es legítimo) y el IMPACTO sube a un bloque propio, porque es el
// dato duro que justifica el experimento — "317K órdenes >24h" merece más que
// ser la tercera línea de un muro de texto.

// Rampa ordinal: de "todavía no existe" a "ya se decidió".
const TONO: Record<EstadoExp, string> = {
  Idea: "var(--on-neutral, #6b7280)",
  Diseñado: "var(--on-info, #1e50c0)",
  Corriendo: "var(--on-amber, #a15c00)",
  Validado: "var(--on-green, #1b7d3f)",
  Descartado: "var(--on-red, #a3143a)",
};

export default function ExperimentCard({ e }: { e: Experimento }) {
  const p = e.proyectoSlug ? proyectoPorSlug(e.proyectoSlug) : undefined;
  const style = { ["--exp-tono"]: TONO[e.estado] } as CSSProperties;

  return (
    <div className="exp" style={style}>
      <h3>{e.nombre}</h3>

      <div className="exp-meta">
        <span className={`pill e-${e.estado}`}>{e.estado}</span>
        {p ? (
          <Link href={`/proyectos/logistica/proyecto/${p.slug}`} className="exp-proj exp-proj-link">
            {e.proyecto} →
          </Link>
        ) : (
          <span className="exp-proj">{e.proyecto}</span>
        )}
      </div>

      {/* El dato que justifica el experimento, arriba y con superficie propia. */}
      <div className="exp-impacto">
        <b>Impacto</b>
        {e.impacto}
      </div>

      <div className="exp-field">
        <b>Hipótesis</b>
        {e.hipotesis}
      </div>
      <div className="exp-field">
        <b>Métrica</b>
        {e.metrica}
      </div>
      {e.aprendizaje && (
        <div className="exp-field">
          <b>Aprendizaje</b>
          {e.aprendizaje}
        </div>
      )}

      {e.demoHref && (
        <Link href={e.demoHref} className="exp-demo">
          Probar simulador →
        </Link>
      )}
      <LinkList links={e.links ?? []} titulo="Enlaces" />
    </div>
  );
}
