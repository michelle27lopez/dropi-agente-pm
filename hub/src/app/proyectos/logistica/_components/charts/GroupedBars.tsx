import type { MonthlyBar } from "@/app/proyectos/logistica/_lib/info-logistica-data";

function fmtK(v: number) {
  return v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`;
}

// Barras agrupadas canceladas vs rechazadas por mes (SVG nativo, tooltip por <title>).
export default function GroupedBars({ data }: { data: MonthlyBar[] }) {
  const W = 720;
  const H = 260;
  const padL = 44;
  const padR = 16;
  const padB = 28;
  const padT = 26;
  const maxY = 100000;
  const plotW = W - padL - padR;
  const plotH = H - padT - padB;
  const band = plotW / data.length;
  const barW = (band * 0.7) / 2;
  const y = (v: number) => padT + plotH * (1 - v / maxY);
  const ticks = [0, 25000, 50000, 75000, 100000];

  return (
    <div className="chart-box">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Cancelaciones y rechazos por mes">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={padL} x2={W - padR} y1={y(t)} y2={y(t)} stroke="#e2e5eb" />
            <text x={padL - 6} y={y(t) + 4} textAnchor="end" fontSize="10" fill="#8d96a8">{fmtK(t)}</text>
          </g>
        ))}
        {data.map((d, i) => {
          const x0 = padL + band * i + band * 0.15;
          return (
            <g key={d.month}>
              <rect x={x0} y={y(d.cancel)} width={barW} height={y(0) - y(d.cancel)} fill="#ef4444" opacity={0.75} rx={3}>
                <title>{`${d.month} · Canceladas: ${d.cancel.toLocaleString("es-CO")}`}</title>
              </rect>
              <rect x={x0 + barW} y={y(d.rechaz)} width={barW} height={y(0) - y(d.rechaz)} fill="#f59e0b" opacity={0.75} rx={3}>
                <title>{`${d.month} · Rechazadas: ${d.rechaz.toLocaleString("es-CO")}`}</title>
              </rect>
              <text x={x0 + barW} y={H - 10} textAnchor="middle" fontSize="10.5" fill="#8d96a8">{d.month}</text>
            </g>
          );
        })}
        <g transform={`translate(${padL + 6}, 8)`}>
          <rect width={10} height={10} rx={2} fill="#ef4444" />
          <text x={14} y={9} fontSize="11" fill="#5a6478">Canceladas</text>
          <rect x={96} width={10} height={10} rx={2} fill="#f59e0b" />
          <text x={110} y={9} fontSize="11" fill="#5a6478">Rechazadas</text>
        </g>
      </svg>
    </div>
  );
}
