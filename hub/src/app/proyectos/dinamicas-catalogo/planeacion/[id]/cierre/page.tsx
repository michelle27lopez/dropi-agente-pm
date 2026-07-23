"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Check, Wand2 } from "lucide-react";
import { NODE_DEFINITIONS, NodeKey, NodeData, Field, SavedNode, isPlanningComplete, EXECUTION_NODE_INDEX } from "../../nodes";
import { PhaseTabs } from "../../PhaseTabs";
import { Sidebar } from "../../../Sidebar";

type Campaign = { id: string; name: string; status: string; current_node: number };

const RESULTADOS_IDX = NODE_DEFINITIONS.findIndex((n) => n.key === "resultados");
const DECISION_IDX = NODE_DEFINITIONS.findIndex((n) => n.key === "decision");

type CierreTabKey = "resultados" | "decision";

// Qué respuestas de nodos anteriores vale la pena mostrar mientras se llena
// Cierre, para no obligar a saltar de pestaña a comparar (mismo patrón que
// CONTEXT_REFS del wizard de Planeación).
const CONTEXT_REFS: Partial<Record<NodeKey, { fromKey: NodeKey; field: string; label: string }[]>> = {
  resultados: [{ fromKey: "identidad", field: "expected_result", label: "Resultado esperado (compara tu número real contra esto)" }],
  decision: [{ fromKey: "resultados", field: "vs_expected", label: "Resultado real vs. esperado" }],
};

function buildAllDataByKey(nodes: SavedNode[]): Partial<Record<NodeKey, NodeData>> {
  const map: Partial<Record<NodeKey, NodeData>> = {};
  NODE_DEFINITIONS.forEach((n) => { map[n.key] = nodes.find((x) => x.node_key === n.key)?.data ?? {}; });
  return map;
}

function computeMissing(nodeIdx: number, list: SavedNode[]): number {
  const def = NODE_DEFINITIONS[nodeIdx];
  const data = list.find((x) => x.node_index === nodeIdx)?.data ?? {};
  const allData = buildAllDataByKey(list);
  let missing = 0;
  def.sections.forEach((sec) => sec.fields.forEach((f) => {
    if (!f.required) return;
    if (f.hidden && f.hidden(allData)) return;
    const v = data[f.key];
    if (!v || (typeof v === "string" && v.trim() === "")) missing++;
  }));
  return missing;
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

function CierreTabs({
  active, onChange, resultadosDone, decisionDone,
}: { active: CierreTabKey; onChange: (t: CierreTabKey) => void; resultadosDone: boolean; decisionDone: boolean }) {
  const tabs: { key: CierreTabKey; label: string; done: boolean }[] = [
    { key: "resultados", label: "Resultados", done: resultadosDone },
    { key: "decision", label: "Decisión", done: decisionDone },
  ];
  return (
    <div style={{ display: "inline-flex", gap: 2, background: "#F8F9FA", borderRadius: 10, padding: 4, marginBottom: 22 }}>
      {tabs.map((t) => {
        const isActiveTab = t.key === active;
        return (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: isActiveTab ? "#fff" : "transparent",
              border: isActiveTab ? "1px solid #e5e7eb" : "1px solid transparent",
              borderRadius: 7, padding: "7px 14px", fontSize: 13,
              fontWeight: isActiveTab ? 700 : 600,
              color: isActiveTab ? "#111827" : "#6b7280",
              cursor: "pointer", fontFamily: "inherit",
            }}
          >
            {t.done && <Check size={12} strokeWidth={3} color="#10B981" />}
            {t.label}
          </button>
        );
      })}
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
      {field.type === "select" && field.optionDescriptions && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {field.options?.map((opt) => {
            const isSel = value === opt;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => onChange(opt)}
                style={{
                  textAlign: "left", border: isSel ? "1px solid #F77F00" : "1px solid #e5e7eb",
                  background: isSel ? "#FFF3E0" : "#fff", borderRadius: 8, padding: "10px 12px",
                  cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", gap: 4,
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 700, color: isSel ? "#F77F00" : "#111827" }}>{opt}</span>
                {field.optionDescriptions?.[opt] && <span style={{ fontSize: 11.5, color: "#6b7280", lineHeight: 1.45 }}>{field.optionDescriptions[opt]}</span>}
              </button>
            );
          })}
        </div>
      )}
      {field.type === "select" && !field.optionDescriptions && (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 8, padding: "10px 12px", fontSize: 13.5, fontFamily: "inherit", background: "#fff" }}
        >
          <option value="">Seleccionar...</option>
          {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      )}
    </div>
  );
}

export default function CierrePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [nodes, setNodes] = useState<SavedNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<CierreTabKey>("resultados");
  const [nodeData, setNodeData] = useState<Record<number, NodeData>>({});
  const [saving, setSaving] = useState(false);
  const [closing, setClosing] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [aiLoading, setAiLoading] = useState<Set<string>>(new Set());
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tabInitialized = useRef(false);

  const load = useCallback(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
    ]).then(([camp, n]) => {
      setCampaign(camp);
      const list: SavedNode[] = Array.isArray(n) ? n : [];
      setNodes(list);
      setNodeData({
        [RESULTADOS_IDX]: list.find((x) => x.node_index === RESULTADOS_IDX)?.data ?? {},
        [DECISION_IDX]: list.find((x) => x.node_index === DECISION_IDX)?.data ?? {},
      });

      if (!tabInitialized.current) {
        tabInitialized.current = true;
        if (computeMissing(RESULTADOS_IDX, list) === 0) setTab("decision");
      }

      setLoading(false);
    }).catch(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); }, []);

  const allDataByKey = useMemo(() => {
    const base = buildAllDataByKey(nodes);
    return {
      ...base,
      resultados: nodeData[RESULTADOS_IDX] ?? base.resultados ?? {},
      decision: nodeData[DECISION_IDX] ?? base.decision ?? {},
    };
  }, [nodes, nodeData]);

  const getRequiredMissing = useCallback((nodeIdx: number) => {
    const def = NODE_DEFINITIONS[nodeIdx];
    const data = nodeData[nodeIdx] || {};
    let missing = 0;
    def.sections.forEach((sec) => sec.fields.forEach((f) => {
      if (!f.required) return;
      if (f.hidden && f.hidden(allDataByKey)) return;
      const v = data[f.key];
      if (!v || (typeof v === "string" && v.trim() === "")) missing++;
    }));
    return missing;
  }, [nodeData, allDataByKey]);

  const saveNode = useCallback(async (nodeIdx: number) => {
    if (autosaveTimer.current) { clearTimeout(autosaveTimer.current); autosaveTimer.current = null; }
    const def = NODE_DEFINITIONS[nodeIdx];
    const data = nodeData[nodeIdx] || {};
    const missing = getRequiredMissing(nodeIdx);
    setSaving(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_index: nodeIdx, node_key: def.key, data, completed: missing === 0 }),
      });
      // El progreso visible en el Panel de campañas (current_node/9) solo avanza
      // hacia adelante — igual que hacía el wizard con los nodos de Planeación.
      if (campaign && (campaign.current_node ?? 0) < nodeIdx + 1) {
        await fetch(`/api/campaigns-planeacion/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ current_node: nodeIdx + 1 }),
        });
        setCampaign((prev) => (prev ? { ...prev, current_node: nodeIdx + 1 } : prev));
      }
    } finally {
      setSaving(false);
    }
  }, [id, nodeData, getRequiredMissing, campaign]);

  const handleFieldChange = (nodeIdx: number, key: string, value: string) => {
    setNodeData((prev) => ({ ...prev, [nodeIdx]: { ...(prev[nodeIdx] || {}), [key]: value } }));
    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => { saveNode(nodeIdx); }, 900);
  };

  const handleAiSuggest = async (nodeIdx: number, field: Field) => {
    const fieldKey = `${nodeIdx}:${field.key}`;
    const def = NODE_DEFINITIONS[nodeIdx];
    const existing = nodeData[nodeIdx]?.[field.key] || "";
    if (existing.trim() && !window.confirm("Esto va a reemplazar lo que ya escribiste en este campo. ¿Continuar?")) return;

    setAiLoading((prev) => new Set(prev).add(fieldKey));
    setAiErrors((prev) => { const next = { ...prev }; delete next[fieldKey]; return next; });

    try {
      const res = await fetch("/api/campaigns-planeacion/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nodeKey: def.key, fieldKey: field.key, fieldLabel: field.label,
          hint: field.hint, placeholder: field.placeholder, allData: allDataByKey,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "No se pudo generar la sugerencia.");
      handleFieldChange(nodeIdx, field.key, json.suggestion);
    } catch (err) {
      setAiErrors((prev) => ({ ...prev, [fieldKey]: err instanceof Error ? err.message : "Error desconocido" }));
    } finally {
      setAiLoading((prev) => { const next = new Set(prev); next.delete(fieldKey); return next; });
    }
  };

  const switchTab = async (t: CierreTabKey) => {
    await saveNode(tab === "resultados" ? RESULTADOS_IDX : DECISION_IDX);
    setTab(t);
  };

  const handleCerrar = async () => {
    await saveNode(DECISION_IDX);
    if (getRequiredMissing(DECISION_IDX) > 0) { setShowValidation(true); return; }
    setClosing(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });
      router.push(`/proyectos/dinamicas-catalogo/planeacion/${id}/dashboard`);
    } finally {
      setClosing(false);
    }
  };

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Cargando...</div>;
  }
  if (!campaign) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "#9ca3af", fontSize: 14 }}>Campaña no encontrada.</div>;
  }

  const identidad = allDataByKey.identidad ?? {};
  const planningComplete = isPlanningComplete(nodes);
  const executionNode = nodes.find((n) => n.node_index === EXECUTION_NODE_INDEX);
  const isActive = executionNode?.data?.status === "active";
  const resultadosDone = Object.keys(nodeData[RESULTADOS_IDX] || {}).length > 0 && getRequiredMissing(RESULTADOS_IDX) === 0;
  const decisionDone = !!nodeData[DECISION_IDX]?.decision;

  const activeIdx = tab === "resultados" ? RESULTADOS_IDX : DECISION_IDX;
  const activeDef = NODE_DEFINITIONS[activeIdx];
  const contextRefs = CONTEXT_REFS[activeDef.key] || [];
  const missing = getRequiredMissing(activeIdx);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#fff" }}>
      <Sidebar />
      <main style={{ flex: 1, minWidth: 0 }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 12, position: "sticky", top: 0, zIndex: 10,
      }}>
        <button onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, padding: 0 }}>
          Panel de campañas
        </button>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{campaign.name}</span>
        {saving && <span style={{ marginLeft: "auto", fontSize: 12, color: "#9ca3af" }}>Guardando…</span>}
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 80px" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{identidad.name || campaign.name}</h1>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.6, margin: 0 }}>
            Cierre de la campaña: qué pasó de verdad, comparado contra lo esperado, y qué sigue.
          </p>
        </div>

        <div style={{ marginBottom: 22 }}>
          <PhaseTabs campaignId={id} active="cierre" planningComplete={planningComplete} isActive={isActive} closingDone={decisionDone} />
        </div>

        <CierreTabs active={tab} onChange={switchTab} resultadosDone={resultadosDone} decisionDone={decisionDone} />

        {activeDef.phaseNote && (
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#EEF2FF", border: "1px solid rgba(99,102,241,.25)", borderRadius: 12, padding: "12px 16px", marginBottom: 20, fontSize: 13, color: "#3730a3", lineHeight: 1.55 }}>
            <span>🧪</span>
            <span>{activeDef.phaseNote}</span>
          </div>
        )}

        {contextRefs.some((ref) => allDataByKey[ref.fromKey]?.[ref.field]) && (
          <div style={{ background: "#F8F9FA", border: "1px solid #e5e7eb", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
            {contextRefs.map((ref) => {
              const refVal = allDataByKey[ref.fromKey]?.[ref.field];
              if (!refVal) return null;
              return (
                <div key={`${ref.fromKey}.${ref.field}`} style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.03em" }}>{ref.label}: </span>
                  <span style={{ fontSize: 13, color: "#111827" }}>{refVal}</span>
                </div>
              );
            })}
          </div>
        )}

        {showValidation && missing > 0 && (
          <div style={{ background: "#FFFBEB", border: "1px solid rgba(245,158,11,.3)", borderRadius: 12, padding: "12px 16px", marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#92400e", margin: 0 }}>
              Faltan {missing} campo{missing > 1 ? "s" : ""} obligatorio{missing > 1 ? "s" : ""} para cerrar la campaña.
            </p>
          </div>
        )}

        {activeDef.sections.map((sec) => {
          const allData = allDataByKey;
          const visibleFields = sec.fields.filter((f) => !(f.hidden && f.hidden(allData)));
          if (visibleFields.length === 0) return null;
          return (
            <Section key={sec.key} title={sec.title} subtitle={sec.subtitle}>
              {visibleFields.map((f) => {
                const fieldKey = `${activeIdx}:${f.key}`;
                return (
                  <FieldInput
                    key={f.key}
                    field={f}
                    value={nodeData[activeIdx]?.[f.key] || ""}
                    onChange={(v) => handleFieldChange(activeIdx, f.key, v)}
                    onAiSuggest={f.aiSuggest ? () => handleAiSuggest(activeIdx, f) : undefined}
                    aiLoading={aiLoading.has(fieldKey)}
                    aiError={aiErrors[fieldKey]}
                  />
                );
              })}
            </Section>
          );
        })}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 8 }}>
          {tab === "resultados" ? (
            <button
              onClick={() => switchTab("decision")}
              style={{ background: "#F77F00", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 700, cursor: "pointer" }}
            >
              Continuar a Decisión →
            </button>
          ) : (
            <button
              onClick={handleCerrar}
              disabled={closing}
              style={{ background: "#F77F00", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontSize: 13.5, fontWeight: 700, cursor: closing ? "default" : "pointer" }}
            >
              {closing ? "Cerrando..." : "✓ Cerrar campaña"}
            </button>
          )}
        </div>
      </div>
      </main>
    </div>
  );
}
