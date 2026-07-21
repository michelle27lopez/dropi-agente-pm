"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import {
  NodeKey, NodeData, SavedNode, isPlanningComplete, EXECUTION_NODE_INDEX,
  parseMilestones, MILESTONE_LABEL, milestoneState, parseMessages,
} from "../../nodes";
import { PhaseTabs } from "../../PhaseTabs";
import { Sidebar } from "../../../Sidebar";

type Campaign = { id: string; name: string; status: string };
type EligibleSelected = { id: string | number; name: string; stock: number | null };
type EligibleListEntry = {
  token: string; supplier_name: string; product_count: number;
  submitted_at?: string | null; approved_at?: string | null; selected: EligibleSelected[];
};

const ENRIQUE_DOC_URL = "https://claude.ai/code/artifact/ddfa6912-03f8-415c-bee1-e38d45dcf678";

const TOKENS = `
  :root {
    --dropi: #F77F00; --bg: #fff; --card: #fff; --border: #E5E7EB; --fg: #111827; --muted: #6B7280;
    --success: #10B981; --success-light: #ECFDF5; --info: #6366F1; --info-light: #EEF2FF;
    --warn: #F59E0B; --warn-light: #FFFBEB;
  }
`;

function num(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}

function fmt(n: number): string {
  return n.toLocaleString("es-CO");
}

function chipList(value: string | undefined): string[] {
  return value ? value.split("||").filter(Boolean) : [];
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

function Chips({ value, color = "#F77F00" }: { value?: string; color?: string }) {
  const items = chipList(value);
  if (!items.length) return <span style={{ color: "var(--muted)", fontSize: 13 }}>—</span>;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {items.map((item, i) => (
        <span key={i} style={{ background: `${color}15`, color, border: `1px solid ${color}30`, borderRadius: 20, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>
          {item}
        </span>
      ))}
    </div>
  );
}

function Row({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "140px 1fr", gap: 12, alignItems: "start", padding: "5px 0" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)" }}>{label}</div>
      <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
        {children ?? (value?.trim() ? value : <span style={{ color: "#9ca3af" }}>—</span>)}
      </div>
    </div>
  );
}

// Card de solo lectura para una sección de Planeación, con un link directo
// al paso correspondiente del wizard — así "ver" y "editar" quedan separados.
function SummaryCard({
  title, editHref, extra, children,
}: { title: string; editHref?: string; extra?: React.ReactNode; children: React.ReactNode }) {
  const router = useRouter();
  return (
    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12, gap: 8 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{title}</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {extra}
          {editHref && (
            <button
              onClick={() => router.push(editHref)}
              style={{ background: "none", border: "none", color: "var(--dropi)", fontSize: 12, fontWeight: 700, cursor: "pointer", padding: 0, fontFamily: "inherit" }}
            >
              ✎ Editar
            </button>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function CampaignDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [eligibleList, setEligibleList] = useState<EligibleListEntry[]>([]);
  const [eligibleSearch, setEligibleSearch] = useState("");
  const [approving, setApproving] = useState(false);

  async function refreshEligibles() {
    const el = await fetch(`/api/campaigns-planeacion/${id}/elegibles`).then((r) => r.json());
    setEligibleList(Array.isArray(el) ? el : []);
  }

  // Aprobar dispara el cambio en la página pública del proveedor (su fase de
  // fotos se desbloquea con `approved_at`, no con el calendario) — es el
  // momento en que también debe salir el WhatsApp de "fuiste aprobado".
  async function approveOne(token: string) {
    setApproving(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}/elegibles/aprobar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      await refreshEligibles();
    } finally {
      setApproving(false);
    }
  }

  async function approveAll(pending: number) {
    if (!window.confirm(`¿Aprobar a los ${pending} proveedores que postularon y siguen pendientes? Sus páginas pasarán a "Aprobado" de inmediato.`)) return;
    setApproving(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}/elegibles/aprobar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      await refreshEligibles();
    } finally {
      setApproving(false);
    }
  }

  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/elegibles`).then((r) => r.json()),
    ]).then(([camp, n, el]) => {
      setCampaign(camp);
      setNodes(Array.isArray(n) ? n : []);
      setEligibleList(Array.isArray(el) ? el : []);
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
  const elegibilidad = nd("elegibilidad");
  const calendario = nd("calendario");
  const convocatoria = nd("convocatoria");
  const vitrina = nd("vitrina");
  const handoff = nd("handoff");
  const resultados = nd("resultados");
  const hasResultados = Object.keys(resultados).length > 0;

  const milestones = parseMilestones(calendario.milestones);
  const supplierMessages = parseMessages(convocatoria.messages);
  const dropshipperMessages = parseMessages(vitrina.messages);
  const supplierMessagesDone = supplierMessages.filter((m) => m.body.trim()).length;
  const dropshipperMessagesDone = dropshipperMessages.filter((m) => m.body.trim()).length;

  const planningComplete = isPlanningComplete(nodes);
  const executionNode = nodes.find((n) => n.node_index === EXECUTION_NODE_INDEX);
  const isActive = executionNode?.data?.status === "active";
  const closingDone = !!nd("decision").decision;

  const base = `/proyectos/dinamicas-catalogo/planeacion/${id}`;
  const editHref = (key: NodeKey) => `${base}?node=${key}`;

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
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
      <style dangerouslySetInnerHTML={{ __html: TOKENS }} />
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13, padding: 0 }}>
          Panel de campañas
        </button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{campaign.name}</span>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", margin: 0 }}>{identidad.name || campaign.name}</h1>
          <button
            onClick={() => router.push(base)}
            style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "8px 16px", fontSize: 13, fontWeight: 700, color: "var(--fg)", cursor: "pointer", flexShrink: 0 }}
          >
            ✎ Editar
          </button>
        </div>

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
          <p style={{ fontSize: 13.5, color: "var(--muted)", margin: "0 0 20px", lineHeight: 1.5 }}>
            <strong style={{ color: "var(--fg)" }}>Meta:</strong> {identidad.expected_result}
          </p>
        )}

        {!planningComplete && (
          <div style={{ background: "var(--warn-light)", border: "1px solid rgba(245,158,11,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: "#92400e" }}>La planeación todavía no está completa — lo que ves abajo puede tener huecos.</span>
            <button onClick={() => router.push(base)} style={{ background: "var(--dropi)", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", fontWeight: 700, fontSize: 12.5, cursor: "pointer" }}>
              Continuar planeación →
            </button>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SummaryCard title="Identidad y objetivo" editHref={editHref("identidad")}>
            <Row label="Objetivo"><Chips value={identidad.objective} /></Row>
            <Row label="País"><Chips value={identidad.country} color="#6366F1" /></Row>
            <Row label="Responsable" value={identidad.responsible} />
            <Row label="Hipótesis" value={identidad.hypothesis} />
          </SummaryCard>

          <SummaryCard title="Elegibilidad" editHref={editHref("elegibilidad")}>
            <Row label="Tipo de supplier"><Chips value={elegibilidad.supplier_type} color="#0EA5E9" /></Row>
            <Row label="Stock mínimo" value={elegibilidad.min_stock} />
            <Row label="Descuento" value={elegibilidad.min_discount || "No requiere"} />
            <Row label="Categorías" value={elegibilidad.categories_scope === "Todas las categorías" ? "Todas" : elegibilidad.categories_theme} />
          </SummaryCard>
        </div>

        <SummaryCard title="Calendario" editHref={editHref("calendario")}>
          {milestones.length === 0 ? (
            <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>Sin hitos todavía.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {milestones.map((m, i) => {
                const st = MILESTONE_LABEL[milestoneState(m.date)];
                return (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "130px 1fr auto", gap: 12, alignItems: "start", borderBottom: i < milestones.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>{m.date || "Sin fecha"}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{m.label}</div>
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: st.color, background: st.bg, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
                      {st.text}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </SummaryCard>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <SummaryCard
            title="Convocatoria y postulación"
            editHref={editHref("convocatoria")}
            extra={
              <a
                href={ENRIQUE_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "var(--muted)", fontSize: 12, fontWeight: 600, textDecoration: "none" }}
              >
                Plantillas para Enrique →
              </a>
            }
          >
            <Row label="Tipo" value={convocatoria.invite_type} />
            <Row label="Canales"><Chips value={convocatoria.channels} color="#F59E0B" /></Row>
            <Row label="Mensajes">
              {supplierMessages.length === 0 ? (
                <span style={{ color: "#9ca3af" }}>Sin mensajes definidos</span>
              ) : (
                <span>{supplierMessagesDone} de {supplierMessages.length} redactados</span>
              )}
            </Row>
          </SummaryCard>

          <SummaryCard title="Vitrina" editHref={editHref("vitrina")}>
            <Row label="Nombre" value={vitrina.showcase_name} />
            <Row label="Tipo" value={vitrina.showcase_type} />
            <Row label="CTA" value={vitrina.cta_main} />
            <Row label="Mensajes">
              {dropshipperMessages.length === 0 ? (
                <span style={{ color: "#9ca3af" }}>Sin mensajes definidos</span>
              ) : (
                <span>{dropshipperMessagesDone} de {dropshipperMessages.length} redactados</span>
              )}
            </Row>
          </SummaryCard>
        </div>

        {eligibleList.length > 0 && (() => {
          const pendingApproval = eligibleList.filter((e) => e.submitted_at && !e.approved_at).length;
          const submittedCount = eligibleList.filter((e) => e.submitted_at).length;
          return (
          <SummaryCard
            title={`Productos elegibles por proveedor (${eligibleList.length})`}
            extra={
              <>
                {submittedCount > 0 && (
                  <a
                    href={`/api/campaigns-planeacion/${id}/elegibles/export`}
                    style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textDecoration: "none" }}
                  >
                    ⬇ Selecciones (CSV)
                  </a>
                )}
                {pendingApproval > 0 && (
                  <button
                    onClick={() => approveAll(pendingApproval)}
                    disabled={approving}
                    style={{ background: "var(--success)", color: "#fff", border: "none", borderRadius: 8, padding: "5px 12px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: approving ? 0.6 : 1 }}
                  >
                    Aprobar todos ({pendingApproval})
                  </button>
                )}
              </>
            }
          >
            <p style={{ fontSize: 12.5, color: "var(--muted)", margin: "0 0 10px" }}>
              Link personalizado por proveedor, sin login — es el que va en el mensaje "Formulario de postulación habilitado".
              {submittedCount > 0 && ` ${submittedCount} ya postularon.`} Aprobar desbloquea la fase de fotos en la página del proveedor.
            </p>
            <input
              type="text"
              value={eligibleSearch}
              onChange={(e) => setEligibleSearch(e.target.value)}
              placeholder="Buscar proveedor..."
              style={{ fontSize: 13, padding: "7px 10px", border: "1px solid var(--border)", borderRadius: 8, marginBottom: 10, width: 240, fontFamily: "inherit" }}
            />
            <div style={{ maxHeight: 320, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 8 }}>
              {eligibleList
                .filter((e) => e.supplier_name.toLowerCase().includes(eligibleSearch.trim().toLowerCase()))
                .map((e, i, arr) => (
                  <div
                    key={e.token}
                    style={{ padding: "8px 12px", borderBottom: i < arr.length - 1 ? "1px solid #f3f4f6" : "none" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{e.supplier_name}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {e.approved_at ? (
                          <span style={{ fontSize: 11, fontWeight: 700, color: "#059669", background: "#ecfdf5", padding: "2px 7px", borderRadius: 20 }}>Aprobado ✓</span>
                        ) : e.submitted_at ? (
                          <>
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#6366F1", background: "#eef2ff", padding: "2px 7px", borderRadius: 20 }}>Postuló · {e.selected.length}</span>
                            <button
                              onClick={() => approveOne(e.token)}
                              disabled={approving}
                              style={{ background: "none", border: "1px solid var(--success)", color: "var(--success)", borderRadius: 8, padding: "3px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: approving ? 0.6 : 1 }}
                            >
                              Aprobar
                            </button>
                          </>
                        ) : (
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>{e.product_count} producto{e.product_count === 1 ? "" : "s"}</span>
                        )}
                        <a
                          href={`${base}/elegibles/${e.token}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}
                        >
                          Abrir →
                        </a>
                      </span>
                    </div>
                    {e.submitted_at && e.selected.length > 0 && (
                      <details style={{ marginTop: 4 }}>
                        <summary style={{ fontSize: 12, color: "var(--muted)", cursor: "pointer" }}>Ver selección ({e.selected.length})</summary>
                        <ul style={{ margin: "6px 0 2px", paddingLeft: 18 }}>
                          {e.selected.map((p) => (
                            <li key={String(p.id)} style={{ fontSize: 12.5, color: "var(--fg)", marginBottom: 2 }}>
                              {p.name} <span style={{ color: "var(--muted)" }}>· #{p.id}{p.stock != null ? ` · ${fmt(p.stock)} u.` : ""}</span>
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                ))}
            </div>
          </SummaryCard>
          );
        })()}

        <SummaryCard
          title="Handoff operativo"
          editHref={editHref("handoff")}
          extra={
            <button
              onClick={() => router.push(`${base}/handoff`)}
              style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 12, fontWeight: 600, cursor: "pointer", padding: 0, fontFamily: "inherit" }}
            >
              Ver documento completo →
            </button>
          }
        >
          <Row label="Cronograma" value={handoff.schedule} />
          <Row label="Responsables" value={handoff.area_responsibilities} />
        </SummaryCard>

        {hasResultados && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginTop: 8, marginBottom: 16 }}>
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

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
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
      </main>
    </div>
  );
}
