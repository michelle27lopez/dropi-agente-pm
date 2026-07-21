import type { TimeTransition } from "@/app/proyectos/logistica/_lib/info-logistica-data";

function fmtHours(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1).replace(".", ",")}h`;
}

export default function TimeFlowChart({ data }: { data: TimeTransition[] }) {
  const max = Math.max(...data.map((d) => d.medianHours));
  return (
    <div className="time-flow-chart">
      {data.map((d) => (
        <div key={d.label} className="time-flow-row" title={`${d.label} · ${d.type} · ${d.orders.toLocaleString("es-CO")} órdenes — mediana ${fmtHours(d.medianHours)}, prom. ${fmtHours(d.avgHours)}`}>
          <div className="time-flow-label">
            <strong>{d.label}</strong>
            <span>{d.type} · {d.orders.toLocaleString("es-CO")} órdenes</span>
          </div>
          <div className="time-flow-bars">
            <div className="time-flow-bar">
              <i style={{ width: `${Math.max(2, (d.medianHours / max) * 100)}%`, background: d.color }} />
              <span>mediana {fmtHours(d.medianHours)}</span>
            </div>
            <div className="time-flow-bar muted">
              <i style={{ width: `${Math.max(2, (d.avgHours / max) * 100)}%` }} />
              <span>prom. {fmtHours(d.avgHours)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
