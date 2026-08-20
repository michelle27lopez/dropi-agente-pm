"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import * as XLSX from "xlsx";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Upload, Wand2 } from "lucide-react";
import {
  NODE_DEFINITIONS, NodeKey, NodeData, Field, SavedNode, isPlanningComplete, EXECUTION_NODE_INDEX,
} from "../../nodes";
import { PhaseTabs } from "../../PhaseTabs";
import { Sidebar } from "../../../Sidebar";

type Campaign = { id: string; name: string; status: string };

const RESULTADOS_IDX = NODE_DEFINITIONS.findIndex((n) => n.key === "resultados");
const RESULTADOS_DEF = NODE_DEFINITIONS[RESULTADOS_IDX];

function num(v: string | undefined): number {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
}
function fmt(n: number): string {
  return n.toLocaleString("es-CO");
}

function guessColumn(columns: string[], patterns: RegExp[]): string {
  for (const p of patterns) {
    const match = columns.find((c) => p.test(c.trim()));
    if (match) return match;
  }
  return "";
}

function StatCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px" }}>
      <div style={{ fontSize: 12, color: "#6b7280", fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent || "#111827" }}>{value}</div>
    </div>
  );
}

function FunnelChart({ data }: { data: { name: string; value: number }[] }) {
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24, top: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
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

function Section({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <h2 style={{ fontSize: 15, fontWeight: 800, color: "#111827", margin: 0 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12.5, color: "#6b7280", margin: "3px 0 0" }}>{subtitle}</p>}
      </div>
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "18px 22px" }}>
        {children}
      </div>
    </div>
  );
}

function FieldInput({
  field, value, onChange, onAiSuggest, aiLoading, aiError,
}: {
  field: Field; value: string; onChange: (v: string) => void;
  onAiSuggest?: () => void; aiLoading?: boolean; aiError?: string;
}) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 6 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#111827" }}>
          {field.label}
          {field.required ? <span style={{ color: "#F77F00", marginLeft: 2 }}>*</span> : <span style={{ fontSize: 11, fontWeight: 400, color: "#9ca3af", marginLeft: 4 }}>(opcional)</span>}
        </label>
        {field.aiSuggest && onAiSuggest && (
          <button
            type="button"
            onClick={onAiSuggest}
            disabled={aiLoading}
            style={{
              display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600,
              color: "#6366F1", background: "#EEF2FF", border: "1px solid rgba(99,102,241,.25)",
              borderRadius: 999, padding: "4px 10px", cursor: aiLoading ? "default" : "pointer", fontFamily: "inherit",
            }}
          >
            <Wand2 size={12} strokeWidth={2.4} />
            {aiLoading ? "Generando..." : "Sugerir con IA"}
          </button>
        )}
      </div>
      {field.hint && <p style={{ fontSize: 12, color: "#6b7280", margin: "0 0 8px", lineHeight: 1.5 }}>{field.hint}</p>}
      {aiError && <p style={{ fontSize: 12, color: "#EF4444", margin: "0 0 8px" }}>{aiError}</p>}

      {(field.type === "text" || field.type === "number") && (
        <input
          type={field.type}
          value={value}
          placeholder={field.placeholder || ""}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, fontFamily: "inherit", boxSizing: "border-box" }}
        />
      )}
      {field.type === "textarea" && (
        <textarea
          value={value}
          placeholder={field.placeholder || ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
        />
      )}
    </div>
  );
}

export default function MetricasPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [resultados, setResultados] = useState<NodeData>({});
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<Set<string>>(new Set());
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<string>("");

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
    ]).then(([camp, n]) => {
      setCampaign(camp);
      const list: SavedNode[] = Array.isArray(n) ? n : [];
      setNodes(list);
      setResultados(list.find((x) => x.node_index === RESULTADOS_IDX)?.data ?? {});
      setLoading(false);
    }).catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); }, []);

  const nd = (key: NodeKey): NodeData => nodes.find((n) => n.node_key === key)?.data ?? {};
  const identidad = nd("identidad");
  const planningComplete = isPlanningComplete(nodes);
  const executionNode = nodes.find((n) => n.node_index === EXECUTION_NODE_INDEX);
  const isActive = executionNode?.data?.status === "active";

  const getRequiredMissing = useCallback((data: NodeData) => {
    let missing = 0;
    RESULTADOS_DEF.sections.forEach((sec) => sec.fields.forEach((f) => {
      if (!f.required) return;
      const v = data[f.key];
      if (!v || (typeof v === "string" && v.trim() === "")) missing++;
    }));
    return missing;
  }, []);

  const saveResultados = useCallback(async (data: NodeData) => {
    if (autosaveTimer.current) { clearTimeout(autosaveTimer.current); autosaveTimer.current = null; }
    setSaving(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_index: RESULTADOS_IDX, node_key: "resultados", data, completed: getRequiredMissing(data) === 0 }),
      });
    } finally {
      setSaving(false);
    }
  }, [id, getRequiredMissing]);

  const handleFieldChange = (key: string, value: string) => {
    setResultados((prev) => {
      const next = { ...prev, [key]: value };
      if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
      autosaveTimer.current = setTimeout(() => { saveResultados(next); }, 900);
      return next;
    });
  };

  const handleAiSuggest = async (field: Field) => {
    const existing = resultados[field.key] || "";
    if (existing.trim() && !window.confirm("Esto va a reemplazar lo que ya escribiste en este campo. ¿Continuar?")) return;
    setAiLoading((prev) => new Set(prev).add(field.key));
    setAiErrors((prev) => { const next = { ...prev }; delete next[field.key]; return next; });
    try {
      const allData: Partial<Record<NodeKey, NodeData>> = {};
      NODE_DEFINITIONS.forEach((n) => { allData[n.key] = nd(n.key); });
      allData.resultados = resultados;
      const res = await fetch("/api/campaigns-planeacion/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ nodeKey: "resultados", fieldKey: field.key, fieldLabel: field.label, hint: field.hint, placeholder: field.placeholder, allData }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "No se pudo generar la sugerencia.");
      handleFieldChange(field.key, json.suggestion);
    } catch (err) {
      setAiErrors((prev) => ({ ...prev, [field.key]: err instanceof Error ? err.message : "Error desconocido" }));
    } finally {
      setAiLoading((prev) => { const next = new Set(prev); next.delete(field.key); return next; });
    }
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json<Record<string, string | number>>(sheet, { defval: "" });
        if (!json.length) { setImportResult("El archivo no tiene filas de datos."); return; }
        const columns = Object.keys(json[0]);
        const idCol = guessColumn(columns, [/^(id|product_id|producto_id)$/i, /id.*producto|producto.*id|product.*id/i]);
        const nameCol = guessColumn(columns, [/nombre.*producto|producto.*nombre|product.*name/i]);
        const ordersCol = guessColumn(columns, [/^(ordenes|órdenes|orders|orders_count)$/i, /orden|order/i]);
        if (!idCol || !ordersCol) {
          setImportResult("No se encontró columna de ID de producto y/o de órdenes. Revisa los encabezados del archivo.");
          return;
        }
        const rows = json.map((r) => ({
          productId: String(r[idCol] ?? "").trim(),
          productName: nameCol ? String(r[nameCol] ?? "").trim() : undefined,
          ordersCount: Number(r[ordersCol]),
        }));
        setImporting(true);
        const res = await fetch(`/api/campaigns-planeacion/${id}/product-orders/import`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rows }),
        });
        const json2 = await res.json();
        if (!res.ok) {
          setImportResult(json2.error || "No se pudo importar el archivo.");
        } else {
          setImportResult(`Se importaron ${json2.imported} productos.`);
        }
      } catch {
        setImportResult("No se pudo leer el archivo. ¿Es un Excel (.xlsx/.xls) o CSV válido?");
      } finally {
        setImporting(false);
      }
    };
    reader.readAsBinaryString(file);
  };

  const hasResultados = Object.keys(resultados).length > 0;
  const resultadosDone = hasResultados && getRequiredMissing(resultados) === 0;

  const supplierFunnel = useMemo(() => [
    { name: "Invitados", value: num(resultados.suppliers_invited) },
    { name: "Postularon", value: num(resultados.suppliers_applied) },
    { name: "Aprobados", value: num(resultados.suppliers_approved) },
    { name: "Con marco aplicado", value: num(resultados.suppliers_with_frame) },
  ], [resultados]);
  const dropshipperFunnel = useMemo(() => [
    { name: "Impactados", value: num(resultados.dropshippers_impacted) },
    { name: "Clics en vitrina", value: num(resultados.banner_clicks) },
    { name: "Productos vistos", value: num(resultados.products_viewed) },
    { name: "Productos tomados", value: num(resultados.products_taken) },
  ], [resultados]);

  const participationRate = num(resultados.suppliers_invited) > 0
    ? Math.round((num(resultados.suppliers_applied) / num(resultados.suppliers_invited)) * 100)
    : 0;
  const approvalRate = num(resultados.suppliers_applied) > 0
    ? Math.round((num(resultados.suppliers_approved) / num(resultados.suppliers_applied)) * 100)
    : 0;

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
          {saving && <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>Guardando…</span>}
        </header>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px" }}>
          <div style={{ marginBottom: 20 }}>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{identidad.name || campaign.name}</h1>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
              Resultados agregados de la campaña — manual por ahora, alguien trae estos números a mano.
            </p>
          </div>

          <div style={{ marginBottom: 22 }}>
            <PhaseTabs campaignId={id} active="metricas" planningComplete={planningComplete} isActive={isActive} resultadosDone={resultadosDone} />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4, flexWrap: "wrap" }}>
            <label style={{
              display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, fontWeight: 700, color: "#374151",
              background: "#fff", border: "1px solid #d1d5db", borderRadius: 8, padding: "7px 12px", cursor: "pointer",
            }}>
              <Upload size={13} />
              {importing ? "Importando..." : "Importar órdenes por producto (CSV/Excel)"}
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                disabled={importing}
                onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImportFile(f); }}
                style={{ display: "none" }}
              />
            </label>
            {importResult && <span style={{ fontSize: 12, color: "#6b7280" }}>{importResult}</span>}
          </div>
          <p style={{ fontSize: 11.5, color: "#9ca3af", margin: "0 0 20px" }}>
            El archivo debe traer una columna de ID de producto y una de órdenes (ej. "ID producto", "Órdenes"). Un producto que no aparezca en el archivo conserva su número anterior.
          </p>

          {hasResultados && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 16 }}>
                <StatCard label="Órdenes generadas" value={fmt(num(resultados.orders_generated))} accent="#F77F00" />
                <StatCard label="GMV generado" value={`$${fmt(num(resultados.gmv_generated))}`} accent="#F77F00" />
                <StatCard label="Tasa de participación" value={`${participationRate}%`} accent="#6366F1" />
                <StatCard label="Tasa de aprobación" value={`${approvalRate}%`} accent="#6366F1" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Embudo de suppliers</h3>
                  <FunnelChart data={supplierFunnel} />
                </div>
                <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 14, padding: "20px 22px" }}>
                  <h3 style={{ fontSize: 14, fontWeight: 700, color: "#111827", margin: "0 0 12px" }}>Embudo de dropshippers</h3>
                  <FunnelChart data={dropshipperFunnel} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
                <StatCard label="Productos con primera orden" value={fmt(num(resultados.products_first_order))} />
                <StatCard label="Productos quietos activados" value={fmt(num(resultados.products_reactivated))} />
                <StatCard label="Suppliers con al menos una venta" value={fmt(num(resultados.suppliers_with_sales))} />
              </div>
            </>
          )}

          {RESULTADOS_DEF.sections.map((sec) => (
            <Section key={sec.key} title={sec.title} subtitle={sec.subtitle}>
              {sec.fields.map((f) => (
                <FieldInput
                  key={f.key}
                  field={f}
                  value={resultados[f.key] || ""}
                  onChange={(v) => handleFieldChange(f.key, v)}
                  onAiSuggest={f.aiSuggest ? () => handleAiSuggest(f) : undefined}
                  aiLoading={aiLoading.has(f.key)}
                  aiError={aiErrors[f.key]}
                />
              ))}
            </Section>
          ))}
        </div>
      </main>
    </div>
  );
}
