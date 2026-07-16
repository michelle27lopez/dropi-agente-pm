"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { NodeKey, NodeData, SavedNode, isPlanningComplete, EXECUTION_NODE_INDEX } from "../../nodes";
import { PhaseTabs } from "../../PhaseTabs";

type Campaign = { id: string; name: string; status: string };

const TOKENS = `
  :root {
    --dropi: #F77F00; --bg: #fff; --card: #fff; --border: #E5E7EB; --fg: #111827; --muted: #6B7280;
    --success: #10B981; --success-light: #ECFDF5; --info: #6366F1; --info-light: #EEF2FF;
  }
`;

function num(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number): string {
  return n.toLocaleString("es-CO");
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: "var(--muted)", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent || "var(--fg)" }}>{value}</div>
    </div>
  );
}

function FunnelChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: "#6B7280" }} axisLine={false} tickLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 13, fill: "#111827" }} width={140} axisLine={false} tickLine={false} />
          <Tooltip formatter={(v) => fmt(Number(v))} />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={22}>
            {data.map((_, i) => <Cell key={i} fill={i === 0 ? "#F77F00" : i === data.length - 1 ? "#10B981" : "#FBBF7A"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function CampaignDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
    ]).then(([camp, n]) => {
      setCampaign(camp);
      setNodes(Array.isArray(n) ? n : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)", fontSize: 14 }}>Cargando dashboard...</div>;
  }
  if (!campaign) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)", fontSize: 14 }}>Campaña no encontrada.</div>;
  }

  const nd = (key: NodeKey): NodeData => nodes.find((n) => n.node_key === key)?.data ?? {};
  const identidad = nd("identidad");
  const resultados = nd("resultados");
  const hasResultados = Object.keys(resultados).length > 0;

  const planningComplete = isPlanningComplete(nodes);
  const executionNode = nodes.find((n) => n.node_index === EXECUTION_NODE_INDEX);
  const isActive = executionNode?.data?.status === "active";
  const closingDone = !!nd("decision").decision;

  const supplierFunnel = [
    { name: "Invitados", value: num(resultados.suppliers_invited) },
    { name: "Postularon", value: num(resultados.suppliers_applied) },
    { name: "Aprobados", value: num(resultados.suppliers_approved) },
    { name: "Con marco aplicado", value: num(resultados.suppliers_with_frame) },
  ];
  const dropshipperFunnel = [
    { name: "Impactados", value: num(resultados.dropshippers_impacted) },
    { name: "Clics en vitrina", value: num(resultados.banner_clicks) },
    { name: "Productos vistos", value: num(resultados.products_viewed) },
    { name: "Productos tomados", value: num(resultados.products_taken) },
  ];

  const participationRate = num(resultados.suppliers_invited) > 0
    ? Math.round((num(resultados.suppliers_applied) / num(resultados.suppliers_invited)) * 100)
    : 0;
  const approvalRate = num(resultados.suppliers_applied) > 0
    ? Math.round((num(resultados.suppliers_approved) / num(resultados.suppliers_applied)) * 100)
    : 0;

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <style dangerouslySetInnerHTML={{ __html: TOKENS }} />
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10,
      }}>
        <a href="/proyectos/dinamicas-catalogo" style={{ color: "var(--muted)", fontSize: 13, textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <button onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13, padding: 0 }}>
          Panel de campañas
        </button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{campaign.name}</span>
      </header>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 24px 80px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", margin: "0 0 16px" }}>{identidad.name || campaign.name}</h1>

        <div style={{ marginBottom: 24 }}>
          <PhaseTabs
            campaignId={id}
            active="resumen"
            planningComplete={planningComplete}
            isActive={isActive}
            closingDone={closingDone}
          />
        </div>

        {identidad.expected_result && (
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "0 0 28px", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--fg)" }}>Meta:</strong> {identidad.expected_result}
          </p>
        )}

        {!hasResultados ? (
          <div style={{ background: "var(--card)", border: "1px dashed var(--border)", borderRadius: 14, padding: "48px 24px", textAlign: "center" }}>
            <p style={{ fontSize: 14, color: "var(--muted)", margin: "0 0 16px" }}>
              {!planningComplete
                ? "La campaña todavía está en planeación."
                : !isActive
                ? "La planeación está lista. Falta iniciar la campaña en Ejecución."
                : "La campaña está en curso. Los resultados se cargan cuando termine, en Cierre."}
            </p>
            <button
              onClick={() => router.push(
                !planningComplete
                  ? `/proyectos/dinamicas-catalogo/planeacion/${id}`
                  : !isActive
                  ? `/proyectos/dinamicas-catalogo/planeacion/${id}/ejecucion`
                  : `/proyectos/dinamicas-catalogo/planeacion/${id}?phase=cierre`
              )}
              style={{ background: "var(--dropi)", color: "#fff", border: "none", borderRadius: 9, padding: "10px 20px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              {!planningComplete ? "Continuar planeación →" : !isActive ? "Ir a Ejecución →" : "Ir a Resultados →"}
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
              <StatCard label="Órdenes generadas" value={fmt(num(resultados.orders_generated))} accent="#F77F00" />
              <StatCard label="GMV generado" value={`$${fmt(num(resultados.gmv_generated))}`} accent="#F77F00" />
              <StatCard label="Tasa de participación" value={`${participationRate}%`} accent="#6366F1" />
              <StatCard label="Tasa de aprobación" value={`${approvalRate}%`} accent="#6366F1" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: "0 0 12px" }}>Embudo de suppliers</h3>
                <FunnelChart data={supplierFunnel} />
              </div>
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px" }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: "0 0 12px" }}>Embudo de dropshippers</h3>
                <FunnelChart data={dropshipperFunnel} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 28 }}>
              <StatCard label="Productos con primera orden" value={fmt(num(resultados.products_first_order))} />
              <StatCard label="Productos quietos activados" value={fmt(num(resultados.products_reactivated))} />
              <StatCard label="Suppliers con al menos una venta" value={fmt(num(resultados.suppliers_with_sales))} />
            </div>

            {(resultados.vs_expected || resultados.learnings) && (
              <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
                {resultados.vs_expected && (
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", margin: "0 0 6px" }}>Real vs. esperado</h3>
                    <p style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap" }}>{resultados.vs_expected}</p>
                  </div>
                )}
                {resultados.learnings && (
                  <div>
                    <h3 style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", margin: "0 0 6px" }}>Aprendizajes</h3>
                    <p style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.55, margin: 0, whiteSpace: "pre-wrap" }}>{resultados.learnings}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
