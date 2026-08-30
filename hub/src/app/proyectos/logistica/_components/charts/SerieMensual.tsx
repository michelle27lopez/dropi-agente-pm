"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { esPorcentaje, formatCompacto, formatMiles, formatPct1, parseValor } from "../../_lib/format";
import type { Tone } from "../ui/tone";
import { FS_BODY, FS_LABEL } from "./escala";

// Serie mensual del weekly: los meses de `comparacionMensual` como gráfica.
//
// Es el gráfico del Metrics Lab de Suppliers (área con gradiente para la
// tendencia, barras para volúmenes) y el BarChart "minimal" de indicadores:
// sin grid vertical, eje Y sin línea, radio arriba, etiqueta encima de cada
// barra, y las barras que no son el mes elegido se atenúan a gris (`Cell`).
//
// Lee el MISMO dato que la tabla —los textos de `valores[]`— vía parseValor,
// así que no hay dos copias de cada cifra que puedan desincronizarse.
//
// Colores por token y no por hex: el tono lo decide el dato (verde/ámbar/rojo)
// y el neutro es el gris del sistema. El naranja no entra aquí: el acento de
// la vista es la KPI card elegida.

const TONO: Record<Tone, string> = {
  neutral: "var(--dropi-gray-500)",
  ok: "var(--green)",
  warn: "var(--amber)",
  risk: "var(--red)",
  info: "var(--info)",
};

const EJE = { fontSize: FS_LABEL, fill: "var(--dropi-gray-500)" } as const;
const TOOLTIP = {
  fontSize: FS_BODY,
  borderRadius: 8,
  border: "1px solid var(--border)",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  background: "var(--card)",
} as const;

type Props = {
  meses: string[];
  /** Un valor por mes, tal como está en la tabla ("82,7%", "786.573", "3,86M"). */
  valores: string[];
  nombre: string;
  tone?: Tone;
  /** Meta en la misma escala que los valores. Se pinta como línea punteada. */
  meta?: number;
  /** Mes resaltado (los demás se atenúan). Por defecto, el último. */
  mesActivo?: string;
  height?: number;
};

export default function SerieMensual({ meses, valores, nombre, tone = "neutral", meta, mesActivo, height = 220 }: Props) {
  const pct = esPorcentaje(valores[valores.length - 1]);
  const data = meses.map((mes, i) => ({ mes, valor: parseValor(valores[i]), texto: valores[i] ?? "" }));
  const activo = mesActivo ?? meses[meses.length - 1];
  const color = TONO[tone];
  const formato = (v: number) => (pct ? formatPct1(v) : formatMiles(v));
  const gradId = `serie-${nombre.replace(/\W+/g, "-").toLowerCase()}`;

  // Dominio del eje Y: para porcentajes, una ventana estrecha alrededor de los
  // datos —de 0 a 100 una subida de 0,4 pts es invisible, y esa subida es la
  // noticia. Para volúmenes, desde cero: las barras deben ser comparables.
  const nums = data.map((d) => d.valor).filter((v): v is number => v !== null);
  const dominio: [number, number] | undefined = pct && nums.length
    ? [Math.floor(Math.min(...nums, meta ?? Infinity) - 3), Math.ceil(Math.max(...nums, meta ?? -Infinity) + 3)]
    : undefined;

  const tooltip = (
    <Tooltip
      contentStyle={TOOLTIP}
      cursor={pct ? { stroke: "var(--border)" } : { fill: "var(--soft)" }}
      formatter={(v) => [typeof v === "number" ? formato(v) : String(v), nombre]}
    />
  );
  const referencia = meta !== undefined && (
    <ReferenceLine
      y={meta}
      stroke="var(--dropi-gray-400)"
      strokeDasharray="4 4"
      label={{ value: `Meta ${formato(meta)}`, position: "insideTopRight", fill: "var(--dropi-gray-500)", fontSize: FS_LABEL, fontWeight: 600 }}
    />
  );

  return (
    <div className="u-chart" role="img" aria-label={`${nombre} por mes: ${data.map((d) => `${d.mes} ${d.texto}`).join(", ")}`}>
      <ResponsiveContainer width="100%" height={height} debounce={60}>
        {pct ? (
          <AreaChart data={data} margin={{ top: 18, right: 12, left: -12, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.18} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="mes" tickLine={false} axisLine={{ stroke: "var(--border)" }} tick={EJE} interval={0} />
            <YAxis tickLine={false} axisLine={false} tick={EJE} width={44} domain={dominio} tickFormatter={(v) => formatCompacto(v) + "%"} />
            {tooltip}
            {referencia}
            <Area type="monotone" dataKey="valor" stroke={color} strokeWidth={2.25} fill={`url(#${gradId})`} dot={{ r: 3, fill: color, strokeWidth: 0 }} activeDot={{ r: 5 }} connectNulls>
              <LabelList dataKey="texto" position="top" style={{ fontSize: FS_LABEL, fill: "var(--dropi-gray-600)", fontWeight: 600 }} />
            </Area>
          </AreaChart>
        ) : (
          <BarChart data={data} margin={{ top: 18, right: 8, left: -8, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" />
            <XAxis dataKey="mes" tickLine={false} axisLine={{ stroke: "var(--border)" }} tick={EJE} interval={0} />
            <YAxis tickLine={false} axisLine={false} tick={EJE} width={40} tickFormatter={(v) => formatCompacto(v)} />
            {tooltip}
            {referencia}
            <Bar dataKey="valor" name={nombre} radius={[4, 4, 0, 0]} maxBarSize={44}>
              <LabelList dataKey="texto" position="top" style={{ fontSize: FS_LABEL, fill: "var(--dropi-gray-600)", fontWeight: 600 }} />
              {data.map((d) => (
                <Cell key={d.mes} fill={d.mes === activo ? color : "var(--dropi-gray-200)"} />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
