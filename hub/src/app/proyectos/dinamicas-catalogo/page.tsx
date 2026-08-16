"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { NodeKey, NodeData } from "./planeacion/nodes";
import { Sidebar } from "./Sidebar";

type Campaign = { id: string; name: string; status: string; current_node: number };
type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };
type CampaignWithResults = Campaign & { resultados: NodeData; hasResultados: boolean };

function num(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number): string {
  return n.toLocaleString("es-CO");
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: "var(--dropi)" }}>{value}</div>
    </div>
  );
}

export default function DinamicasCatalogoDashboardPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<CampaignWithResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [docsOpen, setDocsOpen] = useState(false);

  useEffect(() => {
    fetch("/api/campaigns-planeacion")
      .then((r) => r.json())
      .then(async (list: Campaign[]) => {
        const arr = Array.isArray(list) ? list : [];
        const withResults = await Promise.all(
          arr.map(async (c) => {
            const nodes: SavedNode[] = await fetch(`/api/campaigns-planeacion/${c.id}/nodes`).then((r) => r.json()).catch(() => []);
            const resultados = (Array.isArray(nodes) ? nodes : []).find((n: SavedNode) => n.node_key === ("resultados" as NodeKey))?.data ?? {};
            return { ...c, resultados, hasResultados: Object.keys(resultados).length > 0 };
          })
        );
        setCampaigns(withResults);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)", fontSize: 14 }}>Cargando dashboard...</div>;
  }

  const withResults = campaigns.filter((c) => c.hasResultados);
  const withoutResults = campaigns.filter((c) => !c.hasResultados);

  const totals = withResults.reduce(
    (acc, c) => ({
      invited: acc.invited + num(c.resultados.suppliers_invited),
      applied: acc.applied + num(c.resultados.suppliers_applied),
      approved: acc.approved + num(c.resultados.suppliers_approved),
      orders: acc.orders + num(c.resultados.orders_generated),
      gmv: acc.gmv + num(c.resultados.gmv_generated),
    }),
    { invited: 0, applied: 0, approved: 0, orders: 0, gmv: 0 }
  );

  const gmvByCampaign = withResults.map((c) => ({ name: c.name, value: num(c.resultados.gmv_generated) }));
  const ordersByCampaign = withResults.map((c) => ({ name: c.name, value: num(c.resultados.orders_generated) }));

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px" }}>
        <div style={{
          background: "#fff", border: "1px solid var(--border)",
          borderRadius: 14, marginBottom: 28, overflow: "hidden",
        }}>
          <button
            onClick={() => setDocsOpen(!docsOpen)}
            style={{
              width: "100%", background: "none", border: "none", cursor: "pointer",
              padding: "12px 18px", display: "flex", alignItems: "center", gap: 10,
              textAlign: "left",
            }}
          >
            <span style={{ fontSize: 14 }}>📂</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", flex: 1 }}>Recursos del proyecto</span>
            <span style={{ fontSize: 12, color: "var(--muted)", marginRight: 4 }}>DCA-001 · Dinámicas de Catálogo</span>
            <span style={{ fontSize: 16, color: "var(--muted)", transition: "transform 0.2s", display: "inline-block", transform: docsOpen ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
          </button>

          {docsOpen && (
            <div style={{ borderTop: "1px solid var(--border)", padding: "14px 18px", display: "flex", gap: 12, flexWrap: "wrap" }}>
              <a href="/proyectos/dinamicas-catalogo/docs" style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", textDecoration: "none", flex: "1 1 200px", minWidth: 200, maxWidth: 260 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>📋</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>Documentación</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Nodos, campos, ejemplos y casos de uso</div>
                </div>
              </a>
              <a href="/proyectos/dinamicas-catalogo/metas" style={{ display: "flex", alignItems: "center", gap: 10, background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: "12px 16px", textDecoration: "none", flex: "1 1 200px", minWidth: 200, maxWidth: 260 }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>🎯</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 2 }}>Metas del experimento</div>
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Productividad del catálogo · ruta a 10M</div>
                </div>
              </a>
            </div>
          )}
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Dashboard general de campañas</h1>
        <p style={{ fontSize: 14, color: "var(--muted)", marginBottom: 28, maxWidth: 620, lineHeight: 1.6 }}>
          Compara los resultados reales de todas las campañas que ya tienen datos cargados en el nodo Resultados.
        </p>

        {withResults.length === 0 ? (
          <div style={{ background: "#fff", border: "2px dashed var(--border)", borderRadius: 14, padding: "56px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: "var(--fg)", marginBottom: 6 }}>Todavía no hay campañas con resultados</p>
            <p style={{ fontSize: 13, color: "var(--muted)" }}>En cuanto una campaña llegue al nodo Resultados y se llenen los números, aparece aquí comparada contra las demás.</p>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
              <StatCard label="Campañas medidas" value={fmt(withResults.length)} />
              <StatCard label="Suppliers invitados (total)" value={fmt(totals.invited)} />
              <StatCard label="Suppliers aprobados (total)" value={fmt(totals.approved)} />
              <StatCard label="Órdenes generadas (total)" value={fmt(totals.orders)} />
              <StatCard label="GMV generado (total)" value={`$${fmt(totals.gmv)}`} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28 }}>
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: "0 0 12px" }}>GMV por campaña</h3>
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={gmvByCampaign} margin={{ left: 0, right: 12, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => `$${fmt(Number(v))}`} />
                      <Bar dataKey="value" fill="#F77F00" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: "0 0 12px" }}>Órdenes por campaña</h3>
                <div style={{ width: "100%", height: 220 }}>
                  <ResponsiveContainer>
                    <BarChart data={ordersByCampaign} margin={{ left: 0, right: 12, top: 8, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
                      <Tooltip formatter={(v) => fmt(Number(v))} />
                      <Bar dataKey="value" fill="#6366F1" radius={[6, 6, 0, 0]} barSize={32} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "var(--bg)", textAlign: "left" }}>
                    {["Campaña", "Invitados", "Aprobados", "Órdenes", "GMV"].map((h) => (
                      <th key={h} style={{ padding: "10px 16px", fontWeight: 700, color: "var(--muted)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.03em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {withResults.map((c) => (
                    <tr key={c.id} onClick={() => router.push(`/proyectos/dinamicas-catalogo/planeacion/${c.id}/seguimiento`)}
                      style={{ borderTop: "1px solid var(--border)", cursor: "pointer" }}>
                      <td style={{ padding: "12px 16px", fontWeight: 600, color: "var(--fg)" }}>{c.name}</td>
                      <td style={{ padding: "12px 16px", color: "var(--fg)" }}>{fmt(num(c.resultados.suppliers_invited))}</td>
                      <td style={{ padding: "12px 16px", color: "var(--fg)" }}>{fmt(num(c.resultados.suppliers_approved))}</td>
                      <td style={{ padding: "12px 16px", color: "var(--fg)" }}>{fmt(num(c.resultados.orders_generated))}</td>
                      <td style={{ padding: "12px 16px", color: "var(--fg)" }}>${fmt(num(c.resultados.gmv_generated))}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {withoutResults.length > 0 && (
          <div style={{ marginTop: 28 }}>
            <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", marginBottom: 10 }}>Sin resultados todavía</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {withoutResults.map((c) => (
                <span key={c.id} onClick={() => router.push(`/proyectos/dinamicas-catalogo/planeacion/${c.id}/seguimiento`)}
                  style={{ fontSize: 12.5, background: "#fff", border: "1px solid var(--border)", borderRadius: 20, padding: "6px 14px", cursor: "pointer", color: "var(--muted)" }}>
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
      </main>
    </div>
  );
}
