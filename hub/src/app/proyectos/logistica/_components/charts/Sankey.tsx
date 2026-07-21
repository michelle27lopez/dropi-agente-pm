"use client";

import { useMemo, useState } from "react";
import { sankey, sankeyLinkHorizontal, sankeyLeft } from "d3-sankey";
import type { SankeyData } from "@/app/proyectos/logistica/_lib/info-logistica-data";

function fmt(n: number) {
  return Math.round(n).toLocaleString("es-CO");
}
function pct(a: number, b: number) {
  return b ? `${((a / b) * 100).toFixed(1).replace(".", ",")}%` : "0%";
}

type Tip = { x: number; y: number; title: string; detail: string } | null;

export default function Sankey({ data, compact = false }: { data: SankeyData; compact?: boolean }) {
  const [tip, setTip] = useState<Tip>(null);
  const W = 1000;
  const H = data.height;

  const graph = useMemo(() => {
    const right = compact ? 150 : 210;
    const layout = sankey<{ name: string; color: string }, object>()
      .nodeWidth(compact ? 10 : 14)
      .nodePadding(compact ? 10 : 16)
      .nodeAlign(sankeyLeft)
      .extent([
        [10, 16],
        [W - right, H - 16],
      ]);
    return layout({
      nodes: data.nodes.map((d) => ({ ...d })),
      links: data.links.map((d) => ({ ...d })),
    });
  }, [data, compact, H]);

  const total = graph.nodes[0]?.value ?? 1;
  const linkPath = sankeyLinkHorizontal();
  const fs = compact ? 9.5 : 12;
  const fsv = compact ? 8.5 : 10.5;

  function move(ev: React.MouseEvent, title: string, detail: string) {
    setTip({ x: ev.clientX, y: ev.clientY, title, detail });
  }

  return (
    <div className="chart-box sankey-box">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Diagrama Sankey">
        <g>
          {graph.links.map((l, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const src = l.source as any;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const tgt = l.target as any;
            return (
              <path
                key={i}
                d={linkPath(l) ?? undefined}
                fill="none"
                stroke={src.color}
                strokeOpacity={0.25}
                strokeWidth={Math.max(compact ? 1.5 : 2, l.width ?? 1)}
                onMouseMove={(e) => move(e, `${src.name} → ${tgt.name}`, `${fmt(l.value ?? 0)} órdenes (${pct(l.value ?? 0, src.value ?? 0)})`)}
                onMouseLeave={() => setTip(null)}
                style={{ transition: "stroke-opacity .15s" }}
                onMouseEnter={(e) => (e.currentTarget.style.strokeOpacity = "0.5")}
                onMouseOut={(e) => (e.currentTarget.style.strokeOpacity = "0.25")}
              />
            );
          })}
        </g>
        <g>
          {graph.nodes.map((n, i) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const nn = n as any;
            const w = (nn.x1 ?? 0) - (nn.x0 ?? 0);
            const h = Math.max(compact ? 3 : 4, (nn.y1 ?? 0) - (nn.y0 ?? 0));
            return (
              <g key={i} transform={`translate(${nn.x0 ?? 0}, ${nn.y0 ?? 0})`}>
                <rect
                  width={w}
                  height={h}
                  rx={compact ? 2 : 3}
                  fill={nn.color}
                  onMouseMove={(e) => move(e, nn.name, `${fmt(nn.value ?? 0)} (${pct(nn.value ?? 0, total)})`)}
                  onMouseLeave={() => setTip(null)}
                />
                <text x={w + 5} y={h / 2} dy="0.35em" fontSize={fs} fontWeight={700} fill={nn.color}>
                  {nn.name}
                </text>
                <text x={w + 5} y={h / 2 + (compact ? 11 : 15)} dy="0.35em" fontSize={fsv} fontWeight={600} fill="#8b95a5" fontFamily="ui-monospace, monospace">
                  {fmt(nn.value ?? 0)} ({pct(nn.value ?? 0, total)})
                </text>
              </g>
            );
          })}
        </g>
      </svg>
      {tip && (
        <div className="chart-tooltip" style={{ left: tip.x + 12, top: tip.y + 12 }}>
          <strong>{tip.title}</strong>
          <span>{tip.detail}</span>
        </div>
      )}
    </div>
  );
}
