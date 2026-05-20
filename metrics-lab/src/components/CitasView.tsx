"use client";

import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import type { CitasData } from "@/lib/crm-db";

type Props = { data: CitasData };

const BUCKET_COLORS: Record<string, string> = {
  "< 0 días": "#EF4444",
  "Mismo día": "#10B981",
  "1–7 días": "#34D399",
  "8–14 días": "#60A5FA",
  "15–30 días": "#F77F00",
  "31–60 días": "#F59E0B",
  "> 60 días": "#EF4444",
};

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
}

function diasColor(dias: number) {
  if (dias <= 7) return "#10B981";
  if (dias <= 30) return "#F77F00";
  if (dias <= 60) return "#F59E0B";
  return "#EF4444";
}

export function CitasView({ data }: Props) {
  const { stats, buckets, rows } = data;
  const [search, setSearch] = useState("");

  const filtered = rows.filter((r) =>
    r.full_name.toLowerCase().includes(search.toLowerCase()) ||
    r.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>

      {/* KPI Stats */}
      <section>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Tiempo de registro a cita — estadísticas
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
          {[
            { label: "Suppliers con cita", value: stats.total.toString(), unit: "" },
            { label: "Promedio", value: stats.avgDias.toString(), unit: "días" },
            { label: "Mediana", value: stats.medianaDias.toString(), unit: "días", highlight: true },
            { label: "Mínimo", value: stats.minDias.toString(), unit: "días" },
            { label: "Máximo", value: stats.maxDias.toString(), unit: "días" },
          ].map((s) => (
            <div key={s.label} style={{
              background: s.highlight ? "#FFF3E0" : "#fff",
              border: `1px solid ${s.highlight ? "#F77F00" : "var(--border)"}`,
              borderRadius: 12, padding: "20px 20px 16px",
            }}>
              <p style={{ fontSize: 11, color: "var(--muted-foreground)", marginBottom: 8 }}>{s.label}</p>
              <p style={{ fontSize: 28, fontWeight: 700, color: s.highlight ? "#F77F00" : "var(--foreground)", lineHeight: 1 }}>
                {s.value}
                {s.unit && <span style={{ fontSize: 13, fontWeight: 400, marginLeft: 4 }}>{s.unit}</span>}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Histograma */}
      <section>
        <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>
          Distribución por rango de días
        </p>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: 24 }}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={buckets} margin={{ left: 0, right: 16, top: 8, bottom: 0 }}>
              <XAxis dataKey="rango" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
              <Tooltip
                formatter={(v) => [v, "suppliers"]}
                contentStyle={{ borderRadius: 8, border: "1px solid var(--border)", fontSize: 12 }}
                cursor={{ fill: "#F3F4F6" }}
              />
              <Bar dataKey="n" radius={[4, 4, 0, 0]} maxBarSize={56}>
                {buckets.map((b) => (
                  <Cell key={b.rango} fill={BUCKET_COLORS[b.rango] ?? "#F77F00"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Tabla */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: "var(--muted-foreground)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            Detalle por supplier ({filtered.length})
          </p>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nombre o país…"
            style={{
              padding: "6px 12px", fontSize: 12, borderRadius: 8,
              border: "1px solid var(--border)", outline: "none",
              width: 220, color: "var(--foreground)",
            }}
          />
        </div>
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead>
                <tr style={{ background: "#F9FAFB", borderBottom: "1px solid var(--border)" }}>
                  {["Supplier", "País", "Etapa", "Fecha registro", "Fecha cita", "Días"].map((h) => (
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
                    <td style={{ padding: "10px 16px", color: "var(--muted-foreground)" }}>{r.stage_name}</td>
                    <td style={{ padding: "10px 16px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{fmt(r.date_created)}</td>
                    <td style={{ padding: "10px 16px", color: "var(--muted-foreground)", whiteSpace: "nowrap" }}>{fmt(r.ultima_cita_confirmada)}</td>
                    <td style={{ padding: "10px 16px" }}>
                      <span style={{
                        background: `${diasColor(r.dias)}18`,
                        color: diasColor(r.dias),
                        fontWeight: 600, fontSize: 11,
                        padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap",
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
