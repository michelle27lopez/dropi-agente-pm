"use client";

import { Bar, BarChart, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatPct1 } from "../../_lib/format";
import type { Tone } from "../ui/tone";

// Movilización por país, en barras horizontales contra la meta.
//
// La tabla de países ya lleva una `Bar` por fila y da la precisión; esta
// gráfica da la lectura de un vistazo que la tabla no puede dar: dónde está la
// fuga y cuánto falta a cada país para la meta, ordenado por volumen. Es el
// patrón de barras + ReferenceLine de caza-productos (Suppliers), en
// horizontal porque los nombres de país no caben en un eje X de diez.
//
// El color es el mismo tono que ya calcula la tabla (distancia a la meta), así
// que gráfica y tabla nunca dicen cosas distintas del mismo país.

const TONO: Record<Tone, string> = {
  neutral: "var(--dropi-gray-500)",
  ok: "var(--green)",
  warn: "var(--amber)",
  risk: "var(--red)",
  info: "var(--info)",
};

export type FilaPaisChart = { pais: string; valor: number; tone: Tone; detalle?: string };

type Props = {
  filas: FilaPaisChart[];
  meta: number;
  /** Nombre de la métrica para el tooltip. */
  nombre?: string;
};

export default function PaisBars({ filas, meta, nombre = "Movilización" }: Props) {
  const alto = 28 * filas.length + 40;
  const min = Math.max(0, Math.floor(Math.min(...filas.map((f) => f.valor), meta) / 10) * 10 - 10);

  return (
    <div className="u-chart" style={{ height: alto }} role="img" aria-label={`${nombre} por país frente a la meta ${meta}%`}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filas} layout="vertical" margin={{ top: 4, right: 48, left: 4, bottom: 0 }} barCategoryGap={6}>
          <XAxis type="number" domain={[min, 100]} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--dropi-gray-500)" }} tickFormatter={(v) => `${v}%`} />
          <YAxis type="category" dataKey="pais" width={84} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--dropi-gray-700)" }} interval={0} />
          <Tooltip
            cursor={{ fill: "var(--soft)" }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", background: "var(--card)" }}
            formatter={(v, _n, item) => [
              `${typeof v === "number" ? formatPct1(v) : String(v)}${item?.payload?.detalle ? ` · ${item.payload.detalle}` : ""}`,
              nombre,
            ]}
          />
          <ReferenceLine
            x={meta}
            stroke="var(--dropi-gray-700)"
            strokeDasharray="4 4"
            label={{ value: `Meta ${meta}%`, position: "insideTopRight", fill: "var(--dropi-gray-600)", fontSize: 10, fontWeight: 600 }}
          />
          <Bar dataKey="valor" name={nombre} radius={[0, 4, 4, 0]} maxBarSize={18}>
            <LabelList dataKey="valor" position="right" formatter={(v: unknown) => (typeof v === "number" ? formatPct1(v) : "")} style={{ fontSize: 10, fill: "var(--dropi-gray-600)", fontWeight: 600 }} />
            {filas.map((f) => (
              <Cell key={f.pais} fill={TONO[f.tone]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
