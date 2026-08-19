"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NodeKey, NodeData, SavedNode, isPlanningComplete, EXECUTION_NODE_INDEX } from "../../nodes";
import { PhaseTabs } from "../../PhaseTabs";
import { Sidebar } from "../../../Sidebar";

type Campaign = { id: string; name: string; status: string };
type EligibleSelected = { id: string | number; name: string; stock: number | null };
type EligibleListEntry = {
  token: string; supplier_name: string; product_count: number;
  submitted_at: string | null; approved_at: string | null; selected: EligibleSelected[];
  view_count: number; last_viewed_at: string | null;
  meet_click_count: number; meet_last_clicked_at: string | null; meet_attended: boolean;
};
type ProductOrderEntry = { product_id: string; product_name?: string; orders_count: number };

function fmt(n: number): string {
  return n.toLocaleString("es-CO");
}
function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function Pill({ text, color, bg }: { text: string; color: string; bg: string }) {
  return (
    <span style={{ fontSize: 11, fontWeight: 700, color, background: bg, padding: "2px 8px", borderRadius: 20, whiteSpace: "nowrap" }}>
      {text}
    </span>
  );
}

export default function SeguimientoPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [eligibles, setEligibles] = useState<EligibleListEntry[]>([]);
  const [productOrders, setProductOrders] = useState<Record<string, ProductOrderEntry>>({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [attendanceSaving, setAttendanceSaving] = useState<string | null>(null);
  const [orderDrafts, setOrderDrafts] = useState<Record<string, string>>({});
  const [orderSaving, setOrderSaving] = useState<string | null>(null);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [resettingToken, setResettingToken] = useState<string | null>(null);

  const load = () => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/elegibles`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/product-orders`).then((r) => r.json()),
    ]).then(([camp, n, el, po]) => {
      setCampaign(camp);
      setNodes(Array.isArray(n) ? n : []);
      setEligibles(Array.isArray(el) ? el : []);
      const map: Record<string, ProductOrderEntry> = {};
      (Array.isArray(po) ? po : []).forEach((p: { product_id: string; product_name?: string; orders_count: number }) => {
        map[String(p.product_id)] = { product_id: String(p.product_id), product_name: p.product_name, orders_count: p.orders_count };
      });
      setProductOrders(map);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const nd = (key: NodeKey): NodeData => nodes.find((n) => n.node_key === key)?.data ?? {};
  const identidad = nd("identidad");
  const planningComplete = isPlanningComplete(nodes);
  const executionNode = nodes.find((n) => n.node_index === EXECUTION_NODE_INDEX);
  const isActive = executionNode?.data?.status === "active";

  const toggleExpand = (token: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(token)) next.delete(token); else next.add(token);
      return next;
    });
  };

  const copyLink = async (token: string) => {
    const url = `${window.location.origin}/c/${token}`;
    await navigator.clipboard.writeText(url);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken((prev) => (prev === token ? null : prev)), 1500);
  };

  const resetLink = async (token: string, supplierName: string) => {
    if (!window.confirm(`Esto invalida el enlace actual de ${supplierName} y genera uno nuevo. ¿Confirmar?`)) return;
    setResettingToken(token);
    try {
      await fetch(`/api/campaigns-planeacion/${id}/elegibles/${token}/reset`, { method: "POST" });
      load();
    } finally {
      setResettingToken(null);
    }
  };

  const toggleAttendance = async (token: string, attended: boolean) => {
    setAttendanceSaving(token);
    setEligibles((prev) => prev.map((e) => (e.token === token ? { ...e, meet_attended: attended } : e)));
    try {
      await fetch(`/api/campaigns-planeacion/${id}/elegibles/${token}/meet`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attended }),
      });
    } finally {
      setAttendanceSaving(null);
    }
  };

  const saveOrder = async (productId: string, productName: string) => {
    const draft = orderDrafts[productId];
    const ordersCount = Number(draft);
    if (!Number.isFinite(ordersCount) || ordersCount < 0) return;
    setOrderSaving(productId);
    try {
      const res = await fetch(`/api/campaigns-planeacion/${id}/product-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, productName, ordersCount }),
      });
      const json = await res.json();
      setProductOrders((prev) => ({ ...prev, [productId]: { product_id: productId, product_name: productName, orders_count: json.orders_count ?? ordersCount } }));
    } finally {
      setOrderSaving(null);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? eligibles.filter((e) => e.supplier_name.toLowerCase().includes(q)) : eligibles;
  }, [eligibles, search]);

  const totals = useMemo(() => ({
    total: eligibles.length,
    clicked: eligibles.filter((e) => e.view_count > 0).length,
    meetAttended: eligibles.filter((e) => e.meet_attended).length,
    submitted: eligibles.filter((e) => e.submitted_at).length,
  }), [eligibles]);

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Cargando...</div>;
  }
  if (!campaign) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Campaña no encontrada.</div>;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
        <header style={{
          background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 32px", height: 52,
          display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10,
        }}>
          <button onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0 }}>
            Panel de campañas
          </button>
          <span style={{ color: "#e5e7eb" }}>/</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{campaign.name}</span>
        </header>

        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "32px" }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{identidad.name || campaign.name}</h1>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
              Vista comercial: quién hizo clic, asistió al Meet, postuló y qué órdenes generó cada producto elegido.
            </p>
          </div>

          <div style={{ marginBottom: 22 }}>
            <PhaseTabs campaignId={id} active="seguimiento" planningComplete={planningComplete} isActive={isActive} />
          </div>

          {eligibles.length === 0 ? (
            <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>
              Todavía no hay proveedores con productos elegibles cargados. Eso se arma desde Planeación → Elegibilidad y el Excel agrupado de proveedores.
            </p>
          ) : (
            <>
              <div style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}>
                <div style={{ background: "#F8F9FA", borderRadius: 10, padding: "8px 14px" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#111827" }}>{totals.total}</span>{" "}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280" }}>Proveedores</span>
                </div>
                <div style={{ background: "#EFF6FF", borderRadius: 10, padding: "8px 14px" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#3B82F6" }}>{totals.clicked}</span>{" "}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#3B82F6" }}>Hicieron clic</span>
                </div>
                <div style={{ background: "#FFF3E0", borderRadius: 10, padding: "8px 14px" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#F77F00" }}>{totals.meetAttended}</span>{" "}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#F77F00" }}>Asistieron al Meet</span>
                </div>
                <div style={{ background: "#ECFDF5", borderRadius: 10, padding: "8px 14px" }}>
                  <span style={{ fontSize: 18, fontWeight: 800, color: "#10B981" }}>{totals.submitted}</span>{" "}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#10B981" }}>Participaron</span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18, flexWrap: "wrap" }}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar proveedor..."
                  style={{ fontSize: 13, padding: "7px 10px", border: "1px solid #e5e7eb", borderRadius: 8, width: 240, fontFamily: "inherit" }}
                />
                {totals.submitted > 0 && (
                  <a
                    href={`/api/campaigns-planeacion/${id}/elegibles/export`}
                    style={{ marginLeft: "auto", fontSize: 12, fontWeight: 700, color: "#6b7280", textDecoration: "none" }}
                  >
                    ⬇ Selecciones (CSV)
                  </a>
                )}
              </div>

              {filtered.length === 0 ? (
                <p style={{ fontSize: 13, color: "#9ca3af", margin: 0 }}>Ningún proveedor coincide con "{search}".</p>
              ) : (
                <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden" }}>
                  <table style={{ borderCollapse: "collapse", fontSize: 13, width: "100%" }}>
                    <thead>
                      <tr style={{ background: "#F8F9FA" }}>
                        <th style={{ width: 28 }} />
                        {["Proveedor", "Clics", "Meet", "Participó", "Productos", "Enlace"].map((h) => (
                          <th key={h} style={{ textAlign: "left", padding: "9px 12px", borderBottom: "1px solid #e5e7eb", fontWeight: 700, color: "#6b7280", fontSize: 11.5, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((e) => {
                        const isOpen = expanded.has(e.token);
                        return (
                          <>
                            <tr key={e.token} style={{ borderBottom: isOpen ? "none" : "1px solid #f3f4f6", cursor: e.selected.length > 0 ? "pointer" : "default" }} onClick={() => e.selected.length > 0 && toggleExpand(e.token)}>
                              <td style={{ padding: "10px 6px 10px 12px", verticalAlign: "top" }}>
                                {e.selected.length > 0 && (isOpen ? <ChevronDown size={14} color="#9ca3af" /> : <ChevronRight size={14} color="#9ca3af" />)}
                              </td>
                              <td style={{ padding: "10px 12px", fontWeight: 600, color: "#111827", verticalAlign: "top" }}>{e.supplier_name}</td>
                              <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                                {e.view_count > 0 ? (
                                  <span title={e.last_viewed_at ? `Última visita: ${new Date(e.last_viewed_at).toLocaleString("es-CO")}` : ""}>
                                    {e.view_count} clic{e.view_count === 1 ? "" : "s"}
                                  </span>
                                ) : <span style={{ color: "#9ca3af" }}>Sin visitas</span>}
                              </td>
                              <td style={{ padding: "10px 12px", verticalAlign: "top" }} onClick={(ev) => ev.stopPropagation()}>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  <span style={{ fontSize: 11.5, color: e.meet_click_count > 0 ? "#374151" : "#9ca3af" }}>
                                    {e.meet_click_count > 0 ? `${e.meet_click_count} clic${e.meet_click_count === 1 ? "" : "s"} al link` : "Sin clic al link"}
                                  </span>
                                  <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: e.meet_attended ? "#10B981" : "#6b7280", cursor: "pointer" }}>
                                    <input
                                      type="checkbox"
                                      checked={e.meet_attended}
                                      disabled={attendanceSaving === e.token}
                                      onChange={(ev) => toggleAttendance(e.token, ev.target.checked)}
                                    />
                                    Asistió
                                  </label>
                                </div>
                              </td>
                              <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                                {e.submitted_at ? (
                                  <Pill text={`Sí · ${fmtDate(e.submitted_at)}`} color="#10B981" bg="#ECFDF5" />
                                ) : (
                                  <Pill text="No" color="#9ca3af" bg="#F8F9FA" />
                                )}
                              </td>
                              <td style={{ padding: "10px 12px", verticalAlign: "top" }}>{e.selected.length}</td>
                              <td style={{ padding: "10px 12px", verticalAlign: "top" }} onClick={(ev) => ev.stopPropagation()}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                  <a
                                    href={`/proyectos/dinamicas-catalogo/planeacion/${id}/elegibles/${e.token}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ fontSize: 11.5, fontWeight: 700, color: "#F77F00", textDecoration: "none" }}
                                  >
                                    Abrir →
                                  </a>
                                  <button
                                    onClick={() => copyLink(e.token)}
                                    style={{ background: "none", border: "1px solid #d1d5db", color: "#374151", borderRadius: 8, padding: "3px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                                  >
                                    {copiedToken === e.token ? "Copiado ✓" : "Copiar"}
                                  </button>
                                  <button
                                    onClick={() => resetLink(e.token, e.supplier_name)}
                                    disabled={resettingToken === e.token}
                                    style={{ background: "none", border: "1px solid #d1d5db", color: "#6b7280", borderRadius: 8, padding: "3px 10px", fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "inherit", opacity: resettingToken === e.token ? 0.6 : 1 }}
                                  >
                                    {resettingToken === e.token ? "..." : "Resetear"}
                                  </button>
                                </div>
                              </td>
                            </tr>
                            {isOpen && e.selected.length > 0 && (
                              <tr>
                                <td colSpan={7} style={{ padding: "0 12px 14px 40px", borderBottom: "1px solid #f3f4f6" }}>
                                  <table style={{ borderCollapse: "collapse", fontSize: 12.5, width: "100%", background: "#F8F9FA", borderRadius: 8 }}>
                                    <thead>
                                      <tr>
                                        <th style={{ textAlign: "left", padding: "6px 10px", color: "#6b7280", fontWeight: 700, fontSize: 11 }}>Producto</th>
                                        <th style={{ textAlign: "left", padding: "6px 10px", color: "#6b7280", fontWeight: 700, fontSize: 11 }}>Stock</th>
                                        <th style={{ textAlign: "left", padding: "6px 10px", color: "#6b7280", fontWeight: 700, fontSize: 11 }}>Órdenes generadas</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {e.selected.map((p) => {
                                        const pid = String(p.id);
                                        const order = productOrders[pid];
                                        const draft = orderDrafts[pid] ?? (order ? String(order.orders_count) : "");
                                        return (
                                          <tr key={pid}>
                                            <td style={{ padding: "5px 10px", color: "#111827" }}>{p.name} <span style={{ color: "#9ca3af" }}>#{pid}</span></td>
                                            <td style={{ padding: "5px 10px", color: "#6b7280" }}>{p.stock != null ? fmt(p.stock) : "—"}</td>
                                            <td style={{ padding: "5px 10px" }}>
                                              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <input
                                                  type="number"
                                                  min={0}
                                                  value={draft}
                                                  placeholder="0"
                                                  onChange={(ev) => setOrderDrafts((prev) => ({ ...prev, [pid]: ev.target.value }))}
                                                  style={{ fontSize: 12, padding: "4px 6px", border: "1px solid #d1d5db", borderRadius: 6, width: 70, fontFamily: "inherit" }}
                                                />
                                                <button
                                                  type="button"
                                                  disabled={orderSaving === pid || draft === "" || Number(draft) === (order?.orders_count ?? 0)}
                                                  onClick={() => saveOrder(pid, p.name)}
                                                  style={{
                                                    fontSize: 11, fontWeight: 700, color: "#fff", background: "#F77F00", border: "none",
                                                    borderRadius: 6, padding: "4px 8px", cursor: "pointer", fontFamily: "inherit", opacity: orderSaving === pid ? 0.6 : 1,
                                                  }}
                                                >
                                                  {orderSaving === pid ? "..." : "Guardar"}
                                                </button>
                                              </div>
                                            </td>
                                          </tr>
                                        );
                                      })}
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
