import Link from "next/link";
import type { Experimento } from "@/app/proyectos/logistica/_lib/data";

// Tarjeta de un experimento / hipótesis.
export default function ExperimentCard({ e }: { e: Experimento }) {
  return (
    <div className="exp">
      <div className="row">
        <span className={`estado e-${e.estado}`}>{e.estado}</span>
        <span className="exp-proj">{e.proyecto}</span>
      </div>
      <h3>{e.nombre}</h3>
      <div className="exp-field">
        <b>Hipótesis</b>
        {e.hipotesis}
      </div>
      <div className="exp-field">
        <b>Métrica</b>
        {e.metrica}
      </div>
      <div className="exp-field">
        <b>Impacto</b>
        {e.impacto}
      </div>
      {e.aprendizaje && (
        <div className="exp-field">
          <b>📚 Aprendizaje</b>
          {e.aprendizaje}
        </div>
      )}
      {e.demoHref && (
        <Link href={e.demoHref} className="exp-demo">
          🎛️ Probar simulador →
        </Link>
      )}
    </div>
  );
}
