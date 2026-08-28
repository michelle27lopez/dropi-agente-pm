"use client";

import { Bar, BarChart, Cell, LabelList, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatCompacto, formatMiles, formatPct1 } from "../../_lib/format";
import type { Tone } from "../ui/tone";

// Ranking en barras horizontales, opcionalmente contra una meta.
//
// La tabla da la precisión; esta gráfica da la lectura de un vistazo que la
// tabla no puede dar: quién está lejos y cuánto. Es el patrón de barras +
// ReferenceLine de caza-productos (Suppliers), en horizontal porque las
// etiquetas —diez países, doce motivos de novedad— no caben en un eje X.
//
// El tono lo decide quien llama, con el MISMO criterio que usa su tabla, para
// que gráfica y tabla nunca digan cosas distintas de la misma fila.

const TONO: Record<Tone, string> = {
  neutral: "var(--dropi-gray-500)",
  ok: "var(--green)",
  warn: "var(--amber)",
  risk: "var(--red)",
  info: "var(--info)",
};

export type FilaBarra = { label: string; valor: number; tone: Tone; detalle?: string };

type Props = {
  filas: FilaBarra[];
  /** Línea de referencia punteada: la meta, el promedio, el P75. */
  meta?: number;
  /** Etiqueta de esa línea. Por defecto, "Meta <valor>". */
  metaLabel?: string;
  /** Nombre de la métrica para el tooltip. */
  nombre?: string;
  /** Porcentajes recortan la escala; los conteos arrancan en cero. */
  formato?: "pct" | "miles";
  /** Ancho del eje de etiquetas. Súbelo si los nombres son largos. */
  anchoLabel?: number;
};

export default function BarrasHorizontales({
  filas,
  meta,
  metaLabel,
  nombre = "Valor",
  formato = "pct",
  anchoLabel = 84,
}: Props) {
  const pct = formato === "pct";
  const fmt = (v: number) => (pct ? formatPct1(v) : formatMiles(v));
  const alto = 28 * filas.length + 40;
  const valores = filas.map((f) => f.valor);
  // Porcentajes: ventana recortada, porque de 0 a 100 las diferencias que
  // importan (35% vs 60%) se aplastan. Conteos: desde cero, si no las barras
  // mienten sobre la proporción.
  const dominio: [number, number] = pct
    ? [Math.max(0, Math.floor(Math.min(...valores, meta ?? Infinity) / 10) * 10 - 10), 100]
    : [0, Math.max(...valores, meta ?? 0) * 1.12];

  return (
    <div
      className="u-chart"
      style={{ height: alto }}
      role="img"
      aria-label={`${nombre}: ${filas.map((f) => `${f.label} ${fmt(f.valor)}`).join(", ")}`}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={filas} layout="vertical" margin={{ top: 4, right: 56, left: 4, bottom: 0 }} barCategoryGap={6}>
          <XAxis
            type="number"
            domain={dominio}
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "var(--dropi-gray-500)" }}
            tickFormatter={(v) => (pct ? `${v}%` : formatCompacto(v))}
          />
          <YAxis type="category" dataKey="label" width={anchoLabel} tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: "var(--dropi-gray-700)" }} interval={0} />
          <Tooltip
            cursor={{ fill: "var(--soft)" }}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", background: "var(--card)" }}
            formatter={(v, _n, item) => [
              `${typeof v === "number" ? fmt(v) : String(v)}${item?.payload?.detalle ? ` · ${item.payload.detalle}` : ""}`,
              nombre,
            ]}
          />
          {meta !== undefined && (
            <ReferenceLine
              x={meta}
              stroke="var(--dropi-gray-700)"
              strokeDasharray="4 4"
              label={{ value: metaLabel ?? `Meta ${fmt(meta)}`, position: "insideTopRight", fill: "var(--dropi-gray-600)", fontSize: 10, fontWeight: 600 }}
            />
          )}
          <Bar dataKey="valor" name={nombre} radius={[0, 4, 4, 0]} maxBarSize={18}>
            <LabelList dataKey="valor" position="right" formatter={(v: unknown) => (typeof v === "number" ? fmt(v) : "")} style={{ fontSize: 10, fill: "var(--dropi-gray-600)", fontWeight: 600 }} />
            {filas.map((f) => (
              <Cell key={f.label} fill={TONO[f.tone]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
