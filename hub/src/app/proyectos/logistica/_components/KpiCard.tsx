import type { Indicador } from "@/app/proyectos/logistica/_lib/data";

// Tarjeta de indicador — protagonista de la home. Icono, valor, gauge y lectura.
export default function KpiCard({ k }: { k: Indicador }) {
  return (
    <div className={`kpi ${k.tono}`}>
      <div className="head">
        <span className="chip">{k.icono}</span>
        <span className="name">{k.nombre}</span>
        <span className="delta">{k.delta}</span>
      </div>
      <div className="val">{k.valorLabel}</div>
      <div className="metaLabel">{k.metaLabel}</div>
      <div className="gauge">
        <i style={{ width: `${Math.min(k.valor, 100)}%` }} />
        {k.meta != null && <span className="tick" style={{ left: `${k.meta}%` }} />}
      </div>
      <div className="lectura">{k.lectura}</div>
    </div>
  );
}
