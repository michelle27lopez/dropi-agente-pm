"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { StageRow } from "@/lib/crm-db";

type Props = {
  title: string;
  stages: StageRow[];
  color: string;
};

function truncate(str: string, max = 20) {
  return str.length > max ? str.slice(0, max - 1) + "…" : str;
}

export function PipelineChart({ title, stages, color }: Props) {
  if (stages.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[var(--border)] p-6 flex flex-col items-center justify-center min-h-[220px]">
        <p className="text-sm font-medium text-[var(--foreground)] mb-2">{title}</p>
        <p className="text-xs text-[var(--muted-foreground)]">Sin datos aún</p>
      </div>
    );
  }

  const data = stages.map((s) => ({
    name: truncate(s.stage_name),
    value: s.n,
    full: s.stage_name,
  }));

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] p-6 space-y-4">
      <p className="text-sm font-semibold text-[var(--foreground)]">{title}</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} layout="vertical" margin={{ left: 0, right: 16, top: 0, bottom: 0 }}>
          <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 11, fill: "#374151" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(v, _, props) => [v, (props.payload as { full?: string })?.full ?? ""]}
            contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }}
            cursor={{ fill: "var(--muted)" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={24}>
            {data.map((_, idx) => (
              <Cell key={idx} fill={color} fillOpacity={idx === 0 ? 1 : 0.55 + idx * 0.05} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
