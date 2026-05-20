"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { AgingData } from "@/lib/crm-db";

type Props = { data: AgingData };

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

const PIPELINE_COLORS: Record<string, string> = {
  "Verificación": "#F77F00",
  "Ascenso Verificado": "#10B981",
  "Ascenso Premium": "#6366F1",
};

export function AgingView({ data }: Props) {
  const { totalAtascados, mas90dias, mas180dias, buckets, rows } = data;
  const [search, setSearch] = useState("");
  const [filterPipeline, setFilterPipeline] = useState("Todos");

  const pipelines = ["Todos", "Verificación", "Ascenso Verificado", "Ascenso Premium"];

  const filtered = rows.filter((r) => {
    const matchSearch = r.full_name.toLowerCase().includes(search.toLowerCase()) || r.country.toLowerCase().includes(search.toLowerCase());
    const matchPipeline = filterPipeline === "Todos" || r.pipeline === filterPipeline;
    return matchSearch && matchPipeline;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* KPIs */}
      <section>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Suppliers en NUEVA SOLICITUD sin avanzar
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16 }}>
          {[
            { label: "Total atascados", value: totalAtascados, color: "#6B7280", bg: "#F9FAFB" },
            { label: "Más de 90 días", value: mas90dias, color: "#EF4444", bg: "#FEF2F2" },
            { label: "Más de 180 días", value: mas180dias, color: "#7F1D1D", bg: "#FEE2E2" },
          ].map((s) => (
            <div key={s.label} style={{ background: s.bg, border: `1px solid ${s.color}30`, borderRadius: 12, padding: "20px 20px 16px" }}>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 32, fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Histograma aging */}
      <section>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Distribución por tiempo en pipeline
        </p>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={buckets} margin={{ left: 0, right: 16, top: 8, bottom: 0 }}>
              <XAxis dataKey="rango" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [v, "suppliers"]} contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }} cursor={{ fill: "#F3F4F6" }} />
              <Bar dataKey="n" radius={[4, 4, 0, 0]} maxBarSize={56}>
                {buckets.map((b) => <Cell key={b.rango} fill={b.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tabla */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Detalle ({filtered.length})
          </p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {pipelines.map((p) => (
              <button key={p} onClick={() => setFilterPipeline(p)} style={{
                padding: "4px 12px", fontSize: 11, borderRadius: 20, cursor: "pointer",
                fontWeight: filterPipeline === p ? 600 : 400,
                background: filterPipeline === p ? "#F77F00" : "#F3F4F6",
                color: filterPipeline === p ? "#fff" : "#6B7280",
                border: "none",
              }}>{p}</button>
            ))}
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar…"
              style={{ padding: "4px 12px", fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", outline: "none", width: 160 }}
            />
          </div>
        </div>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
                  {["Supplier", "País", "Pipeline", "Desde", "Días atascado"].map((h) => (
                    <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontWeight: 600, color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px 16px", fontWeight: 500, color: "var(--foreground)", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {r.full_name}
                    </td>
                    <td style={{ padding: "10px 16px", color: "var(--muted-foreground)" }}>{r.country}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 20,
                        background: `${PIPELINE_COLORS[r.pipeline] ?? "#6B7280"}18`,
                        color: PIPELINE_COLORS[r.pipeline] ?? "#6B7280",
                      }}>{r.pipeline}</span>
                    </td>
                    <td style={{ padding: "10px 16px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{fmt(r.date_created)}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        fontWeight: 700, fontSize: 12,
                        color: r.dias > 180 ? "#7F1D1D" : r.dias > 90 ? "#EF4444" : r.dias > 30 ? "#F59E0B" : "#10B981",
                      }}>
                        {r.dias}d
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
