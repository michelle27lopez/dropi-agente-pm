"use client";

import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  Sparkles, Tag, CheckCircle2, Calendar, Megaphone, Store, FileCheck2,
  BarChart3, GitBranch, Check, ChevronDown, X, ChevronUp, Wand2, Plus, Trash2,
} from "lucide-react";
import { NODE_DEFINITIONS, PLANNING_NODES, Field, SectionDefinition, NodeKey, NodeData, NodeIconKey, Milestone, parseMilestones, CampaignMessage, parseMessages } from "../nodes";

type Campaign = { id: string; name: string; status: string; current_node: number };
type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };
type ContextRef = { fromKey: NodeKey; field: string; label: string };

const PLANNING_COUNT = PLANNING_NODES.length;

const ICONS: Record<NodeIconKey, React.ComponentType<{ size?: number; strokeWidth?: number }>> = {
  "sparkles": Sparkles,
  "tag": Tag,
  "check-circle-2": CheckCircle2,
  "calendar": Calendar,
  "megaphone": Megaphone,
  "store": Store,
  "file-check-2": FileCheck2,
  "bar-chart-3": BarChart3,
  "git-branch": GitBranch,
};

// Recuerdos de contexto: qué respuestas de nodos anteriores vale la pena
// mantener visibles mientras se llena un nodo posterior, para no repetir preguntas.
const CONTEXT_REFS: Partial<Record<NodeKey, ContextRef[]>> = {
  elegibilidad: [
    { fromKey: "identidad", field: "expected_result", label: "Resultado esperado (ya definido)" },
  ],
  convocatoria: [
    { fromKey: "elegibilidad", field: "universe", label: "Universo base" },
    { fromKey: "elegibilidad", field: "supplier_type", label: "Tipo de supplier" },
  ],
  vitrina: [
    { fromKey: "identidad", field: "objective", label: "Objetivo de la campaña" },
  ],
  handoff: [
    { fromKey: "identidad", field: "expected_result", label: "Resultado esperado" },
  ],
};

function formatVal(v: string): string {
  return v.includes("||") ? v.split("||").filter(Boolean).join(", ") : v;
}

function buildAllDataByKey(data: Record<number, NodeData>): Partial<Record<NodeKey, NodeData>> {
  const map: Partial<Record<NodeKey, NodeData>> = {};
  NODE_DEFINITIONS.forEach((n, idx) => { map[n.key] = data[idx] || {}; });
  return map;
}

export default function PlaneacionWizardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignData, setCampaignData] = useState<Record<number, NodeData>>({});
  const [activeNode, setActiveNode] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [startedNodes, setStartedNodes] = useState<Set<number>>(new Set());
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);
  const [aiLoading, setAiLoading] = useState<Set<string>>(new Set());
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});

  const autosaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns-planeacion/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns-planeacion/${id}/nodes`).then((r) => r.json()),
    ]).then(([camp, nodes]) => {
      if (camp?.id) {
        setCampaign(camp);
        const wantedKey = searchParams.get("node") as NodeKey | null;
        const wantedIdx = wantedKey ? NODE_DEFINITIONS.slice(0, PLANNING_COUNT).findIndex((n) => n.key === wantedKey) : -1;
        setActiveNode(wantedIdx >= 0 ? wantedIdx : Math.min(camp.current_node ?? 0, PLANNING_COUNT - 1));
      }

      const loadedData: Record<number, NodeData> = {};
      const started = new Set<number>();
      for (let i = 0; i < NODE_DEFINITIONS.length; i++) loadedData[i] = {};

      if (Array.isArray(nodes)) {
        nodes.forEach((n: SavedNode) => {
          if (n.node_index >= NODE_DEFINITIONS.length) return;
          loadedData[n.node_index] = n.data ?? {};
          if (n.completed || Object.keys(n.data ?? {}).length > 0) {
            started.add(n.node_index);
          }
        });
      }

      setCampaignData(loadedData);
      setStartedNodes(started);
    }).catch((err) => {
      console.error("Error loading campaign data:", err);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    const nodeDef = NODE_DEFINITIONS[activeNode];
    if (nodeDef) {
      const initial: Record<string, boolean> = {};
      nodeDef.sections.forEach((sec, idx) => { initial[sec.key] = idx === 0; });
      setExpandedSections(initial);
    }
  }, [activeNode]);

  useEffect(() => {
    return () => { if (autosaveTimer.current) clearTimeout(autosaveTimer.current); };
  }, []);

  const nodeDef = NODE_DEFINITIONS[activeNode];
  const allDataByKey = useMemo(() => buildAllDataByKey(campaignData), [campaignData]);
  const isFieldHidden = useCallback((f: Field) => !!f.hidden && f.hidden(allDataByKey), [allDataByKey]);

  const getRequiredMissing = useCallback((nodeIdx: number) => {
    const def = NODE_DEFINITIONS[nodeIdx];
    const data = campaignData[nodeIdx] || {};
    const allData = buildAllDataByKey(campaignData);
    let missing = 0;
    def.sections.forEach((sec) => {
      sec.fields.forEach((f) => {
        if (!f.required) return;
        if (f.hidden && f.hidden(allData)) return;
        const v = data[f.key];
        if (!v || (typeof v === "string" && v.trim() === "")) missing++;
      });
    });
    return missing;
  }, [campaignData]);

  const isSectionDone = (sec: SectionDefinition, nodeIdx: number) => {
    const data = campaignData[nodeIdx] || {};
    const allData = buildAllDataByKey(campaignData);
    return sec.fields
      .filter((f) => f.required && !(f.hidden && f.hidden(allData)))
      .every((f) => {
        const v = data[f.key];
        return v && (typeof v === "string" ? v.trim() !== "" : true);
      });
  };

  const planningComplete = useMemo(() => {
    for (let i = 0; i < PLANNING_COUNT; i++) {
      if (getRequiredMissing(i) > 0) return false;
    }
    return true;
  }, [getRequiredMissing]);

  const saveNodeData = async (nodeIdx: number) => {
    if (autosaveTimer.current) { clearTimeout(autosaveTimer.current); autosaveTimer.current = null; }

    const def = NODE_DEFINITIONS[nodeIdx];
    const data = campaignData[nodeIdx] || {};
    const missing = getRequiredMissing(nodeIdx);

    setSaving(true);
    try {
      await fetch(`/api/campaigns-planeacion/${id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ node_index: nodeIdx, node_key: def.key, data, completed: missing === 0 }),
      });
      setStartedNodes((prev) => { const next = new Set(prev); next.add(nodeIdx); return next; });

      // El nombre visible de la campaña en las listas (Panel, Dashboard, Calendario) vive en
      // campaigns_planeacion.name — se mantiene sincronizado con lo que se escribe acá.
      if (def.key === "identidad" && data.name?.trim() && data.name !== campaign?.name) {
        await fetch(`/api/campaigns-planeacion/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: data.name.trim() }),
        });
        setCampaign((prev) => prev ? { ...prev, name: data.name.trim() } : null);
      }
    } catch (err) {
      console.error("Failed to save node:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (!campaign) return;
    await saveNodeData(activeNode);

    const isLast = activeNode === PLANNING_COUNT - 1;
    if (isLast) {
      let hasMissing = false;
      for (let i = 0; i < PLANNING_COUNT; i++) {
        if (getRequiredMissing(i) > 0) hasMissing = true;
      }
      if (hasMissing) {
        setShowValidation(true);
      } else {
        try {
          await fetch(`/api/campaigns-planeacion/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ current_node: PLANNING_COUNT }),
          });
          setCampaign((prev) => prev ? { ...prev, current_node: PLANNING_COUNT } : null);
          router.push(`/proyectos/dinamicas-catalogo/planeacion/${id}/handoff`);
        } catch (err) {
          console.error("Error finalizing planning:", err);
        }
      }
      return;
    }

    const nextNode = activeNode + 1;
    const nextNodeTarget = Math.max(campaign.current_node ?? 0, nextNode);
    try {
      await fetch(`/api/campaigns-planeacion/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_node: nextNodeTarget, status: "in_progress" }),
      });
      setCampaign((prev) => prev ? { ...prev, current_node: nextNodeTarget } : null);
    } catch (err) {
      console.error("Error updating current node:", err);
    }

    setActiveNode(nextNode);
    const formPanel = document.getElementById("form-panel");
    if (formPanel) formPanel.scrollTop = 0;
  };

  const handlePrev = async () => {
    if (activeNode > 0) {
      await saveNodeData(activeNode);
      setActiveNode(activeNode - 1);
      const formPanel = document.getElementById("form-panel");
      if (formPanel) formPanel.scrollTop = 0;
    }
  };

  const markTouched = (key: string) => {
    setTouched((prev) => { const next = new Set(prev); next.add(`${activeNode}:${key}`); return next; });
  };

  const handleFieldChange = (key: string, value: string) => {
    setCampaignData((prev) => ({ ...prev, [activeNode]: { ...(prev[activeNode] || {}), [key]: value } }));
    markTouched(key);
    setStartedNodes((prev) => { const next = new Set(prev); next.add(activeNode); return next; });

    if (autosaveTimer.current) clearTimeout(autosaveTimer.current);
    autosaveTimer.current = setTimeout(() => { saveNodeData(activeNode); }, 900);
  };

  const handleAiSuggest = async (field: Field) => {
    const fieldKey = `${activeNode}:${field.key}`;
    const existing = campaignData[activeNode]?.[field.key] || "";
    if (existing.trim() && !window.confirm("Esto va a reemplazar lo que ya escribiste en este campo. ¿Continuar?")) return;

    setAiLoading((prev) => new Set(prev).add(fieldKey));
    setAiErrors((prev) => { const next = { ...prev }; delete next[fieldKey]; return next; });

    try {
      const res = await fetch("/api/campaigns-planeacion/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nodeKey: nodeDef.key,
          fieldKey: field.key,
          fieldLabel: field.label,
          hint: field.hint,
          placeholder: field.placeholder,
          allData: allDataByKey,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "No se pudo generar la sugerencia.");
      handleFieldChange(field.key, json.suggestion);
    } catch (err) {
      setAiErrors((prev) => ({ ...prev, [fieldKey]: err instanceof Error ? err.message : "Error desconocido" }));
    } finally {
      setAiLoading((prev) => { const next = new Set(prev); next.delete(fieldKey); return next; });
    }
  };

  const calculateProgress = () => {
    let totalRequired = 0;
    let completedRequired = 0;
    const allData = buildAllDataByKey(campaignData);

    NODE_DEFINITIONS.slice(0, PLANNING_COUNT).forEach((node, nodeIdx) => {
      const nodeData = campaignData[nodeIdx] || {};
      node.sections.forEach((sec) => {
        sec.fields.forEach((f) => {
          if (!f.required) return;
          if (f.hidden && f.hidden(allData)) return;
          totalRequired++;
          const val = nodeData[f.key];
          if (val && (typeof val === "string" ? val.trim() !== "" : true)) completedRequired++;
        });
      });
    });

    if (totalRequired === 0) return 100;
    return Math.round((completedRequired / totalRequired) * 100);
  };

  if (!campaign || !nodeDef) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)", fontSize: 14 }}>
        Cargando...
      </div>
    );
  }

  const campaignName = campaignData[0]?.name || campaign.name || "";
  const progressPct = calculateProgress();
  const isLast = activeNode === PLANNING_COUNT - 1;
  const contextRefs = CONTEXT_REFS[nodeDef.key] || [];

  const stepsWithErrors: { idx: number; title: string; missing: number }[] = [];
  NODE_DEFINITIONS.slice(0, PLANNING_COUNT).forEach((node, idx) => {
    const missing = getRequiredMissing(idx);
    if (missing > 0) stepsWithErrors.push({ idx, title: node.title, missing });
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--card)", position: "relative" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --dropi: #F77F00;
          --dropi-light: #FFF3E0;
          --dropi-border: rgba(247,127,0,.25);
          --bg: #F8F9FA;
          --card: #ffffff;
          --border: #E5E7EB;
          --fg: #111827;
          --muted: #6B7280;
          --muted-light: #9CA3AF;
          --success: #10B981;
          --success-light: #ECFDF5;
          --success-border: rgba(16,185,129,.3);
          --warn: #F59E0B;
          --warn-light: #FFFBEB;
          --warn-border: rgba(245,158,11,.3);
          --error: #EF4444;
          --error-light: #FEF2F2;
          --error-border: rgba(239,68,68,.35);
          --info: #6366F1;
          --info-light: #EEF2FF;
          --radius-sm: 8px;
          --radius-md: 12px;
          --radius-pill: 999px;
        }

        #hdr { background: var(--card); border-bottom: 1px solid var(--border); padding: 0 32px; height: 56px; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0; gap: 16px; }
        .hdr-left { display: flex; align-items: center; gap: 10px; min-width: 0; flex-wrap: wrap; }
        .crumb { background: none; border: none; cursor: pointer; color: var(--muted); font-size: 13px; padding: 0; font-family: inherit; text-decoration: none; }
        .crumb:hover { color: var(--fg); }
        .crumb-sep { color: var(--border); font-size: 13px; }
        .crumb.current { color: var(--fg); font-weight: 700; font-size: 13px; cursor: default; }
        .hdr-pills { display: flex; gap: 6px; margin-left: 6px; flex-wrap: wrap; }
        .hdr-pill { font-size: 11px; padding: 3px 10px; border-radius: var(--radius-pill); background: var(--bg); border: 1px solid var(--border); color: var(--muted); font-weight: 500; white-space: nowrap; }
        .hdr-pill.exp { background: var(--info-light); border-color: rgba(99,102,241,.25); color: var(--info); font-weight: 700; }
        .hdr-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
        .saving-indicator { font-size: 12px; color: var(--muted-light); }
        .btn-exit { background: none; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 6px 14px; font-size: 13px; font-weight: 600; color: var(--muted); cursor: pointer; font-family: inherit; }
        .btn-exit:hover { border-color: var(--muted-light); color: var(--fg); }

        #layout { flex: 1; display: flex; overflow: hidden; height: calc(100vh - 56px - 60px); }

        #stepper-panel { width: 226px; background: var(--card); border-right: 1px solid var(--border); padding: 24px 0; overflow-y: auto; flex-shrink: 0; }
        .phase-label { font-size: 10.5px; font-weight: 800; color: var(--muted-light); text-transform: uppercase; letter-spacing: .07em; padding: 4px 18px 10px; }
        .phase-label.closing { color: var(--info); border-top: 1px solid var(--border); margin-top: 6px; padding-top: 16px; }

        .step-item { display: flex; align-items: flex-start; padding: 10px 18px; cursor: pointer; transition: background-color 0.15s ease; gap: 10px; }
        .step-item:hover { background-color: var(--bg); }
        .step-item.locked { cursor: not-allowed; opacity: .55; }
        .step-item.locked:hover { background-color: transparent; }
        .step-item:hover .step-label { color: var(--fg); }
        .step-left { display: flex; flex-direction: column; align-items: center; }
        .step-icon { width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 1.5px solid var(--muted-light); background: var(--card); color: var(--muted); transition: all 0.15s ease; flex-shrink: 0; }
        .step-icon.active { border-color: var(--dropi); color: var(--dropi); background: var(--dropi-light); }
        .step-icon.done { border-color: var(--success-border); background: var(--success-light); color: var(--success); }
        .step-icon.started { border-color: var(--dropi); color: var(--dropi); border-style: dashed; }
        .step-icon.has-errors { border-color: var(--warn); color: var(--warn); background: var(--warn-light); }
        .step-icon.locked { border-color: var(--border); color: var(--muted-light); }
        .step-line { width: 1.5px; min-height: 22px; flex: 1; background: var(--border); margin: 4px auto; }
        .step-line.done { background: var(--success); opacity: 0.4; }
        .step-content { padding-top: 2px; }
        .step-label { font-size: 13px; font-weight: 500; color: var(--muted); line-height: 1.3; transition: color 0.15s ease; }
        .step-label.active { color: var(--dropi); font-weight: 700; }
        .step-label.done { color: var(--fg); }
        .step-sublabel { font-size: 11px; color: var(--muted-light); margin-top: 2px; }
        .step-sublabel.err { color: var(--warn); }

        #form-panel { flex: 1; overflow-y: auto; background: #fff; padding-bottom: 80px; }
        #form-inner { max-width: 680px; margin: 0 auto; padding: 28px 24px 120px; }

        .node-eyebrow { font-size: 12px; color: var(--muted); margin-bottom: 4px; }
        .node-title { font-size: 22px; font-weight: 700; color: var(--fg); margin-bottom: 6px; letter-spacing: -0.01em; }
        .node-desc { font-size: 14px; color: var(--muted); line-height: 1.6; margin-bottom: 14px; }

        .phase-note { display: flex; gap: 10px; align-items: flex-start; background: var(--info-light); border: 1px solid rgba(99,102,241,.25); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 20px; font-size: 13px; color: #3730a3; line-height: 1.55; }

        .acc-section { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md); margin-bottom: 10px; overflow: hidden; }
        .acc-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px; cursor: pointer; user-select: none; }
        .acc-header:hover { background: var(--bg); }
        .acc-header-left { display: flex; flex-direction: column; gap: 2px; }
        .acc-title { font-size: 14.5px; font-weight: 600; color: var(--fg); }
        .acc-subtitle { font-size: 12.5px; color: var(--muted); }
        .acc-right { display: flex; align-items: center; gap: 10px; }
        .acc-check { width: 26px; height: 26px; border-radius: 50%; border: 1.5px solid var(--muted-light); background: var(--card); display: flex; align-items: center; justify-content: center; color: var(--muted-light); transition: all 0.2s ease; }
        .acc-check.done { border-color: var(--success-border); background: var(--success-light); color: var(--success); }
        .acc-chevron { color: var(--muted); transition: transform 0.2s ease; display: flex; }
        .acc-chevron.open { transform: rotate(180deg); }
        .acc-body { display: none; padding: 4px 20px 20px; border-top: 1px solid var(--border); }
        .acc-body.open { display: block; }

        .fld { margin-top: 18px; }
        .fld-label-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
        .fld-label { display: block; font-size: 13px; font-weight: 600; color: var(--fg); margin-bottom: 6px; }
        .fld-req { color: var(--dropi); margin-left: 2px; }
        .fld-opt { font-size: 11px; font-weight: 400; color: var(--muted-light); margin-left: 4px; }
        .fld-hint { font-size: 12px; color: var(--muted); margin-bottom: 8px; line-height: 1.5; }
        .fld-error-msg { font-size: 12px; color: var(--error); margin-top: 6px; font-weight: 500; }
        .ai-suggest-btn {
          display: flex; align-items: center; gap: 5px; font-size: 11.5px; font-weight: 600;
          color: var(--info); background: var(--info-light); border: 1px solid rgba(99,102,241,.25);
          border-radius: 999px; padding: 4px 10px; cursor: pointer; white-space: nowrap;
          transition: background-color .15s ease; margin-bottom: 6px;
        }
        .ai-suggest-btn:hover:not(:disabled) { background: rgba(99,102,241,.16); }
        .ai-suggest-btn:disabled { opacity: .6; cursor: default; }
        .ai-error-msg { font-size: 12px; color: var(--error); margin-bottom: 8px; font-weight: 500; }
        #form-panel input[type=text], #form-panel input[type=number], #form-panel textarea, #form-panel select {
          width: 100% !important; max-width: 100% !important; border: 1px solid #D1D5DB !important;
          border-radius: var(--radius-sm) !important; padding: 10px 14px !important; font-size: 14px !important;
          outline: none !important; font-family: inherit !important; background: var(--bg) !important;
          color: var(--fg) !important; box-sizing: border-box !important; display: block !important;
          transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease !important;
        }
        #form-panel input[type=text]:focus, #form-panel input[type=number]:focus, #form-panel textarea:focus, #form-panel select:focus {
          border-color: var(--dropi) !important; background: var(--card) !important; box-shadow: 0 0 0 3px rgba(247,127,0,.12) !important;
        }
        #form-panel textarea { min-height: 140px !important; resize: vertical !important; line-height: 1.5 !important; }
        .fld-error input[type=text], .fld-error input[type=number], .fld-error textarea, .fld-error select { border-color: var(--error) !important; background: var(--error-light) !important; }

        .opt-desc { margin-top: 8px; padding: 10px 14px; background: #FFF8F0; border: 1px solid var(--dropi-border); border-radius: var(--radius-sm); font-size: 13px; color: #7a4f1e; line-height: 1.5; }

        .opt-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        .opt-card { text-align: left; border: 1px solid var(--border); background: var(--card); border-radius: var(--radius-sm); padding: 10px 12px; cursor: pointer; font-family: inherit; display: flex; flex-direction: column; gap: 4px; transition: border-color 0.12s ease, background-color 0.12s ease; }
        .opt-card:hover { border-color: var(--dropi-border); }
        .opt-card.selected { border-color: var(--dropi); background: var(--dropi-light); }
        .opt-card-title { font-size: 13px; font-weight: 700; color: var(--fg); }
        .opt-card.selected .opt-card-title { color: var(--dropi); }
        .opt-card-desc { font-size: 11.5px; color: var(--muted); line-height: 1.45; }
        .fld-error .opt-cards { outline: 1px solid var(--error); outline-offset: 4px; border-radius: var(--radius-sm); }

        #summary-panel { width: 260px; background: var(--card); border-left: 1px solid var(--border); padding: 24px 18px; overflow-y: auto; flex-shrink: 0; }
        .sum-title { font-size: 11px; font-weight: 700; color: var(--muted); text-transform: uppercase; letter-spacing: .06em; margin-bottom: 14px; }
        .sum-item { margin-bottom: 12px; }
        .sum-label { font-size: 11px; color: var(--muted); margin-bottom: 2px; }
        .sum-value { font-size: 13px; font-weight: 500; color: var(--fg); line-height: 1.4; word-break: break-word; }
        .sum-value.empty { color: var(--muted-light); font-style: italic; font-weight: 400; }
        .sum-divider { border: none; border-top: 1px solid var(--border); margin: 16px 0; }
        .sum-prog-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-top: 8px; }
        .seg-bar { display: flex; gap: 3px; }
        .seg { height: 6px; flex: 1; border-radius: 3px; background: var(--border); }
        .seg.active { background: var(--dropi); }
        .seg.done { background: var(--success); }
        .seg.warn { background: var(--warn); }
        .seg.closing { background: repeating-linear-gradient(45deg, var(--border), var(--border) 2px, transparent 2px, transparent 4px); }

        .ms-chips { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 8px; }
        .ms-chip { display: flex; align-items: center; gap: 6px; background: var(--dropi-light); border: 1px solid var(--dropi-border); border-radius: var(--radius-pill); padding: 4px 8px; }
        .ms-chip-rank { font-size: 9px; font-weight: 750; color: #fff; border-radius: 10px; padding: 1px 6px; white-space: nowrap; }
        .ms-chip-rank.pr { background: var(--dropi); }
        .ms-chip-rank.sc { background: var(--muted-light); }
        .ms-chip-name { font-size: 12px; font-weight: 600; color: var(--dropi); }
        .ms-chip-reorder { display: flex; flex-direction: column; }
        .ms-chip-reorder button { background: none; border: none; cursor: pointer; color: rgba(247,127,0,.55); padding: 0; line-height: 1; display: flex; }
        .ms-chip-reorder button:disabled { opacity: .25; cursor: default; }
        .ms-chip-rm { background: none; border: none; cursor: pointer; color: rgba(247,127,0,.5); padding: 0; line-height: 1; margin-left: 2px; display: flex; }
        .ms-opts { display: flex; flex-wrap: wrap; gap: 6px; }
        .ms-opt { padding: 6px 14px; border-radius: var(--radius-pill); border: 1px solid var(--border); background: var(--card); color: var(--muted); font-size: 13px; cursor: pointer; transition: all 0.12s; font-family: inherit; }
        .ms-opt:hover { border-color: var(--dropi-border); color: var(--fg); }
        .ms-opt.on { border-color: var(--dropi); background: var(--dropi-light); color: var(--dropi); font-weight: 600; }
        .ms-opt.on.rk { border-color: transparent; background: var(--bg); color: var(--muted-light); text-decoration: line-through; }

        .ml-list { display: flex; flex-direction: column; gap: 10px; }
        .ml-row { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; background: var(--bg); }
        .ml-row-top { display: grid; grid-template-columns: 20px minmax(0, 1fr) 140px auto; gap: 8px; align-items: center; }
        .ml-row-num { font-size: 11px; font-weight: 700; color: var(--muted-light); text-align: center; }
        .ml-row-actions { display: flex; align-items: center; gap: 2px; }
        .ml-row-actions button { background: none; border: none; cursor: pointer; color: var(--muted-light); padding: 2px; display: flex; }
        .ml-row-actions button:disabled { opacity: .25; cursor: default; }
        .ml-row-actions button:not(:disabled):hover { color: var(--fg); }
        .ml-row-actions button.rm:not(:disabled):hover { color: var(--error); }
        .ml-row textarea { margin-top: 8px; font-size: 12.5px; min-height: 44px; }
        .ml-add-btn { margin-top: 2px; background: none; border: 1px dashed var(--muted-light); border-radius: var(--radius-sm); padding: 8px 14px; font-size: 12.5px; font-weight: 600; color: var(--muted); cursor: pointer; font-family: inherit; width: 100%; }
        .ml-add-btn:hover { border-color: var(--dropi); color: var(--dropi); }
        .ml-empty { font-size: 12.5px; color: var(--muted-light); padding: 8px 0; }

        #bottom-bar { position: fixed; bottom: 0; right: 0; width: calc(100% - 226px); background: var(--card); border-top: 1px solid var(--border); padding: 12px 24px; display: flex; align-items: center; justify-content: space-between; z-index: 100; }
        .btn-prev { background: none; border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 10px 20px; font-size: 14px; font-weight: 500; color: var(--fg); cursor: pointer; font-family: inherit; }
        .btn-prev:disabled { opacity: .4; cursor: default; }
        .btn-prev:not(:disabled):hover { border-color: var(--muted); }
        .btn-next { background: var(--dropi); color: #fff; border: none; border-radius: var(--radius-sm); padding: 11px 28px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; min-width: 160px; }
        .btn-next:hover { opacity: .9; }

        .val-banner { background: var(--warn-light); border: 1px solid var(--warn-border); border-radius: var(--radius-md); padding: 12px 16px; margin-bottom: 16px; }
        .val-banner-title { font-size: 13px; font-weight: 600; color: #92400e; margin-bottom: 6px; }
        .val-banner-list { list-style: none; display: flex; flex-direction: column; gap: 4px; margin: 0; padding: 0; }
        .val-banner-list li { font-size: 12px; color: #78350f; display: flex; align-items: center; gap: 6px; cursor: pointer; }
        .val-banner-list li:hover { text-decoration: underline; }
        .val-banner-list li::before { content: "→"; flex-shrink: 0; }
      ` }} />

      <header id="hdr">
        <div className="hdr-left">
          <a className="crumb" href="/">← Dropi PM Tools</a>
          <span className="crumb-sep">/</span>
          <button className="crumb" onClick={() => router.push("/proyectos/dinamicas-catalogo/campanas")}>Panel de campañas</button>
          <span className="crumb-sep">/</span>
          <span className="crumb current">{campaignName || "Nueva campaña"}</span>
          <div className="hdr-pills">
            {campaignData[0]?.objective && <span className="hdr-pill">{campaignData[0].objective}</span>}
          </div>
        </div>
        <div className="hdr-right">
          {saving && <span className="saving-indicator">Guardando…</span>}
          <button className="btn-exit" onClick={() => router.push(`/proyectos/dinamicas-catalogo/planeacion/${id}/dashboard`)}>← Volver al resumen</button>
        </div>
      </header>

      <div id="layout">
        <aside id="stepper-panel">
          <div className="phase-label">Planeación</div>
          {NODE_DEFINITIONS.slice(0, PLANNING_COUNT).map((node, idx) => {
            const done = startedNodes.has(idx) && getRequiredMissing(idx) === 0;
            const active = idx === activeNode;
            const started = startedNodes.has(idx) && !done && !active;
            const missing = getRequiredMissing(idx);
            const hasErrors = !done && missing > 0 && startedNodes.has(idx) && !active;

            let iconClass = "step-icon";
            if (done) iconClass += " done";
            else if (active) iconClass += " active";
            else if (hasErrors) iconClass += " has-errors";
            else if (started) iconClass += " started";

            let labelClass = "step-label";
            if (active) labelClass += " active";
            else if (done) labelClass += " done";

            const StepIcon = ICONS[node.icon];

            return (
              <div
                key={node.key}
                className="step-item"
                onClick={async () => {
                  await saveNodeData(activeNode);
                  setActiveNode(idx);
                }}
              >
                <div className="step-left">
                  <div className={iconClass}>
                    {done ? <Check size={13} strokeWidth={3} /> : <StepIcon size={13} strokeWidth={2.3} />}
                  </div>
                  {idx < PLANNING_COUNT - 1 && <div className={`step-line ${done ? "done" : ""}`} />}
                </div>
                <div className="step-content">
                  <div className={labelClass}>{node.title}</div>
                  {active && missing > 0 && (
                    <div className="step-sublabel err">{missing} campo{missing > 1 ? "s" : ""} pendiente{missing > 1 ? "s" : ""}</div>
                  )}
                  {!active && hasErrors && <div className="step-sublabel err">{missing} pendiente{missing > 1 ? "s" : ""}</div>}
                  {done && <div className="step-sublabel" style={{ color: "var(--success)" }}>Completo</div>}
                </div>
              </div>
            );
          })}
        </aside>

        <main id="form-panel" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <div id="form-inner">
            {isLast && showValidation && stepsWithErrors.length > 0 && (
              <div className="val-banner">
                <div className="val-banner-title">Faltan campos obligatorios para terminar la planeación</div>
                <ul className="val-banner-list">
                  {stepsWithErrors.map(({ idx, title, missing }) => (
                    <li key={idx} onClick={() => { setActiveNode(idx); setShowValidation(false); }}>
                      Paso {idx + 1} · {title} — {missing} campo{missing > 1 ? "s" : ""} pendiente{missing > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="node-eyebrow">
              Planeación · Paso {activeNode + 1} de {PLANNING_COUNT}
            </div>
            <div className="node-title">{nodeDef.title}</div>
            <div className="node-desc">{nodeDef.description}</div>
            {nodeDef.phaseNote && (
              <div className="phase-note">
                <span>🧪</span>
                <span>{nodeDef.phaseNote}</span>
              </div>
            )}

            {nodeDef.sections.map((sec) => {
              const isOpen = !!expandedSections[sec.key];
              const secDone = isSectionDone(sec, activeNode);
              const visibleFields = sec.fields.filter((f) => !isFieldHidden(f));
              if (visibleFields.length === 0) return null;

              return (
                <div key={sec.key} className="acc-section">
                  <div
                    className="acc-header"
                    onClick={() => {
                      if (isOpen) {
                        setTouched((prev) => {
                          const next = new Set(prev);
                          visibleFields.forEach((f) => next.add(`${activeNode}:${f.key}`));
                          return next;
                        });
                      }
                      setExpandedSections((prev) => ({ ...prev, [sec.key]: !isOpen }));
                    }}
                  >
                    <div className="acc-header-left">
                      <div className="acc-title">{sec.title}</div>
                      <div className="acc-subtitle">{sec.subtitle}</div>
                    </div>
                    <div className="acc-right">
                      <div className={`acc-check ${secDone ? "done" : ""}`}><Check size={12} strokeWidth={2.6} /></div>
                      <span className={`acc-chevron ${isOpen ? "open" : ""}`}><ChevronDown size={14} /></span>
                    </div>
                  </div>
                  <div className={`acc-body ${isOpen ? "open" : ""}`}>
                    {visibleFields.map((f) => {
                      const fieldKey = `${activeNode}:${f.key}`;
                      const val = campaignData[activeNode]?.[f.key] || "";
                      const isInvalid = !!f.required && touched.has(fieldKey) && !val.trim();

                      const aiKey = `${activeNode}:${f.key}`;
                      const isAiLoading = aiLoading.has(aiKey);
                      const aiError = aiErrors[aiKey];

                      return (
                        <div key={f.key} className={`fld${isInvalid ? " fld-error" : ""}`}>
                          <div className="fld-label-row">
                            <label className="fld-label">
                              {f.label}
                              {f.required ? <span className="fld-req">*</span> : <span className="fld-opt">(opcional)</span>}
                            </label>
                            {f.aiSuggest && (
                              <button type="button" className="ai-suggest-btn" disabled={isAiLoading}
                                onClick={() => handleAiSuggest(f)}>
                                <Wand2 size={12} strokeWidth={2.4} />
                                {isAiLoading ? "Generando..." : "Sugerir con IA"}
                              </button>
                            )}
                          </div>
                          {f.hint && <p className="fld-hint">{f.hint}</p>}
                          {aiError && <p className="ai-error-msg">{aiError}</p>}

                          {f.type === "text" && (
                            <input type="text" placeholder={f.placeholder || ""} value={val}
                              onChange={(e) => handleFieldChange(f.key, e.target.value)} onBlur={() => markTouched(f.key)} />
                          )}
                          {f.type === "number" && (
                            <input type="number" placeholder={f.placeholder || ""} value={val}
                              onChange={(e) => handleFieldChange(f.key, e.target.value)} onBlur={() => markTouched(f.key)} />
                          )}
                          {f.type === "textarea" && (
                            <textarea placeholder={f.placeholder || ""} value={val}
                              onChange={(e) => handleFieldChange(f.key, e.target.value)} onBlur={() => markTouched(f.key)} />
                          )}
                          {f.type === "select" && f.optionDescriptions && (
                            <div className="opt-cards">
                              {f.options?.map((opt) => {
                                const isSel = val === opt;
                                return (
                                  <button key={opt} type="button" className={`opt-card ${isSel ? "selected" : ""}`}
                                    onClick={() => handleFieldChange(f.key, opt)}>
                                    <span className="opt-card-title">{opt}</span>
                                    {f.optionDescriptions?.[opt] && <span className="opt-card-desc">{f.optionDescriptions[opt]}</span>}
                                  </button>
                                );
                              })}
                            </div>
                          )}
                          {f.type === "select" && !f.optionDescriptions && (
                            <select value={val} onChange={(e) => handleFieldChange(f.key, e.target.value)} onBlur={() => markTouched(f.key)}>
                              <option value="">Seleccionar...</option>
                              {f.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          )}
                          {f.type === "multiselect" && (
                            <MultiSelectField field={f} value={val} onChange={(v) => handleFieldChange(f.key, v)} />
                          )}
                          {f.type === "milestones" && (
                            <MilestoneListField value={val} onChange={(v) => handleFieldChange(f.key, v)} />
                          )}
                          {f.type === "messages" && (
                            <MessageListField
                              value={val}
                              onChange={(v) => handleFieldChange(f.key, v)}
                              milestones={parseMilestones(allDataByKey.calendario?.milestones)}
                              allData={allDataByKey}
                            />
                          )}

                          {isInvalid && <p className="fld-error-msg">Este campo es obligatorio.</p>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        <aside id="summary-panel">
          <div className="sum-title">Identidad</div>
          <div className="sum-item">
            <div className="sum-label">Campaña</div>
            <div className={`sum-value ${campaignName ? "" : "empty"}`}>{campaignName || "—"}</div>
          </div>
          <div className="sum-item">
            <div className="sum-label">Objetivo</div>
            <div className={`sum-value ${campaignData[0]?.objective ? "" : "empty"}`}>{campaignData[0]?.objective || "—"}</div>
          </div>
          <div className="sum-item">
            <div className="sum-label">Resultado esperado</div>
            <div className={`sum-value ${campaignData[0]?.expected_result ? "" : "empty"}`}>{campaignData[0]?.expected_result || "—"}</div>
          </div>

          {contextRefs.some((ref) => allDataByKey[ref.fromKey]?.[ref.field]) && (
            <>
              <div className="sum-divider" />
              <div className="sum-title">Ya definiste</div>
              {contextRefs.map((ref) => {
                const refVal = allDataByKey[ref.fromKey]?.[ref.field];
                if (!refVal) return null;
                return (
                  <div className="sum-item" key={`${ref.fromKey}.${ref.field}`}>
                    <div className="sum-label">{ref.label}</div>
                    <div className="sum-value">{formatVal(refVal)}</div>
                  </div>
                );
              })}
            </>
          )}

          <div className="sum-divider" />
          <div className="sum-title" style={{ marginBottom: 8 }}>Progreso</div>
          <div className="seg-bar">
            {NODE_DEFINITIONS.slice(0, PLANNING_COUNT).map((n, idx) => {
              const done = startedNodes.has(idx) && getRequiredMissing(idx) === 0;
              const active = idx === activeNode;
              const hasErrors = !done && !active && startedNodes.has(idx) && getRequiredMissing(idx) > 0;
              let cls = "seg";
              if (done) cls += " done";
              else if (active) cls += " active";
              else if (hasErrors) cls += " warn";
              return <div key={n.key} className={cls} title={n.title} />;
            })}
          </div>
          <div className="sum-prog-label"><span>{progressPct}% completo</span></div>
        </aside>
      </div>

      <footer id="bottom-bar">
        <button className="btn-prev" disabled={activeNode === 0} onClick={handlePrev}>← Anterior</button>
        <button className="btn-next" onClick={handleNext}>
          {isLast
            ? (saving ? "Guardando..." : "✓ Finalizar planeación →")
            : (saving ? "Guardando..." : "Siguiente →")}
        </button>
      </footer>
    </div>
  );
}

function MultiSelectField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const selected = value ? value.split("||").filter(Boolean) : [];

  const toggle = (opt: string) => {
    const next = selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt];
    onChange(next.join("||"));
  };
  const removeOpt = (opt: string) => onChange(selected.filter((s) => s !== opt).join("||"));
  const move = (idx: number, dir: -1 | 1) => {
    const next = [...selected];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    onChange(next.join("||"));
  };

  return (
    <div>
      {selected.length > 0 && (
        <div className="ms-chips">
          {selected.map((opt, idx) => (
            <div key={opt} className="ms-chip">
              {field.ranked && (
                <span className={`ms-chip-rank ${idx === 0 ? "pr" : "sc"}`}>{idx + 1}º{idx === 0 ? " Principal" : ""}</span>
              )}
              <span className="ms-chip-name">{opt}</span>
              {field.ranked && selected.length > 1 && (
                <span className="ms-chip-reorder">
                  <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} title="Subir"><ChevronUp size={11} /></button>
                  <button type="button" disabled={idx === selected.length - 1} onClick={() => move(idx, 1)} title="Bajar"><ChevronDown size={11} /></button>
                </span>
              )}
              <button type="button" className="ms-chip-rm" onClick={() => removeOpt(opt)}><X size={12} /></button>
            </div>
          ))}
        </div>
      )}
      <div className="ms-opts">
        {field.options?.map((opt) => {
          const isSelected = selected.includes(opt);
          const optClass = `ms-opt ${isSelected ? "on" : ""} ${isSelected && field.ranked ? "rk" : ""}`;
          return (
            <button key={opt} type="button" className={optClass} onClick={() => toggle(opt)}>
              {isSelected && !field.ranked && "✓ "}{opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function MilestoneListField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const items = parseMilestones(value);

  const commit = (next: Milestone[]) => onChange(JSON.stringify(next));

  const update = (idx: number, patch: Partial<Milestone>) => {
    const next = items.map((m, i) => (i === idx ? { ...m, ...patch } : m));
    commit(next);
  };
  const remove = (idx: number) => commit(items.filter((_, i) => i !== idx));
  const add = () => commit([...items, { label: "", date: "", notes: "" }]);
  const move = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[idx], next[target]] = [next[target], next[idx]];
    commit(next);
  };

  return (
    <div>
      {items.length === 0 && <p className="ml-empty">Todavía no hay hitos. Agrega el primero.</p>}
      <div className="ml-list">
        {items.map((m, idx) => (
          <div key={idx} className="ml-row">
            <div className="ml-row-top">
              <span className="ml-row-num">{idx + 1}</span>
              <input type="text" placeholder="Nombre del hito" value={m.label} onChange={(e) => update(idx, { label: e.target.value })} />
              <input type="text" className="ml-date" placeholder="ej. 24/jul/2026" value={m.date} onChange={(e) => update(idx, { date: e.target.value })} />
              <span className="ml-row-actions">
                <button type="button" disabled={idx === 0} onClick={() => move(idx, -1)} title="Subir"><ChevronUp size={14} /></button>
                <button type="button" disabled={idx === items.length - 1} onClick={() => move(idx, 1)} title="Bajar"><ChevronDown size={14} /></button>
                <button type="button" className="rm" onClick={() => remove(idx)} title="Eliminar"><Trash2 size={14} /></button>
              </span>
            </div>
            <textarea
              placeholder="Qué pasa en este hito: CTA, mensaje, responsable... (opcional)"
              value={m.notes || ""}
              onChange={(e) => update(idx, { notes: e.target.value })}
            />
          </div>
        ))}
      </div>
      <button type="button" className="ml-add-btn" onClick={add}>
        <Plus size={13} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
        Agregar hito
      </button>
    </div>
  );
}

// Mensajes ligados a hitos del Calendario por nombre (no por índice, para
// sobrevivir a reordenamientos). "Sincronizar" solo AGREGA mensajes para
// hitos nuevos sin mensaje todavía — nunca pisa el texto de uno que ya
// existe, aunque el hito relacionado haya cambiado de fecha o se haya
// borrado (en ese caso queda marcado como huérfano, no se borra solo).
function MessageListField({
  value, onChange, milestones, allData,
}: { value: string; onChange: (v: string) => void; milestones: Milestone[]; allData: Partial<Record<NodeKey, NodeData>> }) {
  const items = parseMessages(value);
  const [aiLoadingIds, setAiLoadingIds] = useState<Set<string>>(new Set());
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});

  const commit = (next: CampaignMessage[]) => onChange(JSON.stringify(next));

  const update = (idx: number, patch: Partial<CampaignMessage>) => {
    commit(items.map((m, i) => (i === idx ? { ...m, ...patch } : m)));
  };
  const remove = (idx: number) => commit(items.filter((_, i) => i !== idx));
  const addBlank = () => commit([...items, { id: crypto.randomUUID(), milestoneLabel: null, body: "" }]);

  const sync = () => {
    const existingLabels = new Set(items.map((m) => m.milestoneLabel).filter(Boolean));
    const additions: CampaignMessage[] = milestones
      .filter((m) => m.label.trim() && !existingLabels.has(m.label))
      .map((m) => ({ id: crypto.randomUUID(), milestoneLabel: m.label, body: "" }));
    if (additions.length) commit([...items, ...additions]);
  };

  const milestoneFor = (label: string | null) => (label ? milestones.find((m) => m.label === label) ?? null : null);
  const newMilestonesCount = milestones.filter((m) => m.label.trim() && !items.some((i) => i.milestoneLabel === m.label)).length;

  const suggestFor = async (idx: number) => {
    const item = items[idx];
    if (item.body.trim() && !window.confirm("Esto va a reemplazar lo que ya escribiste en este mensaje. ¿Continuar?")) return;

    setAiLoadingIds((prev) => new Set(prev).add(item.id));
    setAiErrors((prev) => { const next = { ...prev }; delete next[item.id]; return next; });

    try {
      const linked = milestoneFor(item.milestoneLabel);
      const displayLabel = item.label || item.milestoneLabel || "este momento de la campaña";
      const res = await fetch("/api/campaigns-planeacion/ai-suggest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          nodeKey: "convocatoria",
          fieldKey: "messages",
          fieldLabel: `Mensaje de WhatsApp/CRM para el proveedor — "${displayLabel}"`,
          hint: linked?.notes?.trim()
            ? `Qué pasa en este momento (según el Calendario): ${linked.notes}`
            : "Mensaje breve, tono directo, con un CTA claro para el proveedor.",
          allData,
        }),
      });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "No se pudo generar la sugerencia.");
      update(idx, { body: json.suggestion });
    } catch (err) {
      setAiErrors((prev) => ({ ...prev, [item.id]: err instanceof Error ? err.message : "Error desconocido" }));
    } finally {
      setAiLoadingIds((prev) => { const next = new Set(prev); next.delete(item.id); return next; });
    }
  };

  return (
    <div>
      <button type="button" className="ml-add-btn" onClick={sync} style={{ marginBottom: 10, borderStyle: "solid" }}>
        🔄 Sincronizar con hitos del Calendario{newMilestonesCount > 0 ? ` (${newMilestonesCount} nuevo${newMilestonesCount > 1 ? "s" : ""})` : ""}
      </button>
      {items.length === 0 && <p className="ml-empty">Sin mensajes todavía. Sincroniza con el Calendario o agrega uno independiente.</p>}
      <div className="ml-list">
        {items.map((m, idx) => {
          const linked = milestoneFor(m.milestoneLabel);
          const orphan = !!m.milestoneLabel && !linked;
          const isAiLoading = aiLoadingIds.has(m.id);
          const aiError = aiErrors[m.id];
          return (
            <div key={m.id} className="ml-row">
              <div className="ml-row-top" style={{ gridTemplateColumns: "1fr auto auto" }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg)", display: "flex", alignItems: "baseline", gap: 4 }}>
                  <input
                    type="text"
                    value={m.label || ""}
                    placeholder={m.milestoneLabel || "Nombre de este mensaje (ej. Recordatorio, Confirmación...)"}
                    onChange={(e) => update(idx, { label: e.target.value })}
                    style={{
                      border: "none", borderBottom: "1px dashed var(--muted-light)", background: "transparent",
                      fontSize: 12.5, fontWeight: 700, color: "var(--fg)", padding: "2px 0", fontFamily: "inherit", flex: "0 1 auto", minWidth: 120,
                    }}
                  />
                  {linked && <span style={{ color: "var(--muted)", fontWeight: 500 }}>· {linked.date || "sin fecha"}</span>}
                  {orphan && <span style={{ color: "var(--warn)", fontWeight: 600 }}>· el hito ya no existe en el Calendario</span>}
                </div>
                <button type="button" className="ai-suggest-btn" disabled={isAiLoading} onClick={() => suggestFor(idx)}>
                  <Wand2 size={12} strokeWidth={2.4} />
                  {isAiLoading ? "Generando..." : "Sugerir con IA"}
                </button>
                <span className="ml-row-actions">
                  <button type="button" className="rm" onClick={() => remove(idx)} title="Eliminar"><Trash2 size={14} /></button>
                </span>
              </div>
              {aiError && <p className="ai-error-msg">{aiError}</p>}
              <textarea
                placeholder="Mensaje listo para copiar/enviar en este momento de la campaña..."
                value={m.body}
                onChange={(e) => update(idx, { body: e.target.value })}
              />
            </div>
          );
        })}
      </div>
      <button type="button" className="ml-add-btn" onClick={addBlank}>
        <Plus size={13} style={{ display: "inline", verticalAlign: -2, marginRight: 4 }} />
        Agregar mensaje independiente
      </button>
    </div>
  );
}
