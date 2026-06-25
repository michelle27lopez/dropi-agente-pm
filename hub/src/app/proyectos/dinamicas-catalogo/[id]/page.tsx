"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { NODE_DEFINITIONS, NodeDefinition, Field, SectionDefinition } from "./nodes";

type Campaign = { id: string; name: string; status: string; current_node: number };
type NodeData = Record<string, string>;
type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };

export default function CampaignWizardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [campaignData, setCampaignData] = useState<Record<number, NodeData>>({});
  const [activeNode, setActiveNode] = useState(0);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const [startedNodes, setStartedNodes] = useState<Set<number>>(new Set());
  const [saving, setSaving] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // 1. Load Campaign & Nodes from database
  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns/${id}/nodes`).then((r) => r.json()),
    ]).then(([camp, nodes]) => {
      if (camp?.id) {
        setCampaign(camp);
        setActiveNode(Math.min(camp.current_node ?? 0, NODE_DEFINITIONS.length - 1));
      }
      
      const loadedData: Record<number, NodeData> = {};
      const started = new Set<number>();
      
      // Initialize all 8 nodes with empty objects
      for (let i = 0; i < NODE_DEFINITIONS.length; i++) {
        loadedData[i] = {};
      }
      
      if (Array.isArray(nodes)) {
        nodes.forEach((n: SavedNode) => {
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
  }, [id]);

  // 2. Expand first section of active node by default
  useEffect(() => {
    const nodeDef = NODE_DEFINITIONS[activeNode];
    if (nodeDef) {
      const initial: Record<string, boolean> = {};
      nodeDef.sections.forEach((sec, idx) => {
        initial[sec.key] = idx === 0;
      });
      setExpandedSections(initial);
    }
  }, [activeNode]);

  const nodeDef = NODE_DEFINITIONS[activeNode];

  // Helper: Get count of missing required fields for a specific node
  const getRequiredMissing = useCallback((nodeIdx: number) => {
    const def = NODE_DEFINITIONS[nodeIdx];
    const data = campaignData[nodeIdx] || {};
    let missing = 0;
    def.sections.forEach((sec) => {
      sec.fields.forEach((f) => {
        if (!f.required) return;
        const v = data[f.key];
        if (!v || (typeof v === "string" && v.trim() === "")) {
          missing++;
        }
      });
    });
    return missing;
  }, [campaignData]);

  // Helper: Verify if a specific section is complete
  const isSectionDone = (sec: SectionDefinition, nodeIdx: number) => {
    const data = campaignData[nodeIdx] || {};
    return sec.fields
      .filter((f) => f.required)
      .every((f) => {
        const v = data[f.key];
        return v && (typeof v === "string" ? v.trim() !== "" : true);
      });
  };

  // 3. Save Node & Advance
  const saveNodeData = async (nodeIdx: number) => {
    const def = NODE_DEFINITIONS[nodeIdx];
    const data = campaignData[nodeIdx] || {};
    const missing = getRequiredMissing(nodeIdx);

    setSaving(true);
    try {
      // Post node data to DB
      await fetch(`/api/campaigns/${id}/nodes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          node_index: nodeIdx,
          node_key: def.key,
          data: data,
          completed: missing === 0,
        }),
      });

      // Update local started state
      setStartedNodes((prev) => {
        const next = new Set(prev);
        next.add(nodeIdx);
        return next;
      });
    } catch (err) {
      console.error("Failed to save node:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleNext = async () => {
    if (!campaign) return;
    
    // Save current step first
    await saveNodeData(activeNode);

    const isLast = activeNode === NODE_DEFINITIONS.length - 1;
    if (isLast) {
      // Check validation on all nodes
      let hasMissing = false;
      for (let i = 0; i < NODE_DEFINITIONS.length; i++) {
        if (getRequiredMissing(i) > 0) {
          hasMissing = true;
        }
      }

      if (hasMissing) {
        setShowValidation(true);
      } else {
        // Complete campaign
        try {
          await fetch(`/api/campaigns/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              status: "completed",
              current_node: NODE_DEFINITIONS.length,
            }),
          });
          setCampaign((prev) => prev ? { ...prev, status: "completed", current_node: NODE_DEFINITIONS.length } : null);
          alert("✓ Campaña finalizada y guardada correctamente.");
          router.push("/proyectos/dinamicas-catalogo");
        } catch (err) {
          console.error("Error finalizing campaign:", err);
        }
      }
      return;
    }

    const nextNode = activeNode + 1;
    // Update campaign's current reached node in DB
    const nextNodeTarget = Math.max(campaign.current_node ?? 0, nextNode);
    try {
      await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_node: nextNodeTarget,
          status: "in_progress",
        }),
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

  const handleFieldChange = (key: string, value: string) => {
    setCampaignData((prev) => ({
      ...prev,
      [activeNode]: {
        ...(prev[activeNode] || {}),
        [key]: value,
      },
    }));

    // Mark as started
    setStartedNodes((prev) => {
      const next = new Set(prev);
      next.add(activeNode);
      return next;
    });
  };

  // Calculate global progress percentage based on all required fields
  const calculateProgress = () => {
    let totalRequired = 0;
    let completedRequired = 0;

    NODE_DEFINITIONS.forEach((node, nodeIdx) => {
      const nodeData = campaignData[nodeIdx] || {};
      node.sections.forEach((sec) => {
        sec.fields.forEach((f) => {
          if (f.required) {
            totalRequired++;
            const val = nodeData[f.key];
            if (val && (typeof val === "string" ? val.trim() !== "" : true)) {
              completedRequired++;
            }
          }
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
  const isLast = activeNode === NODE_DEFINITIONS.length - 1;

  // Compile list of steps with errors for the validation banner
  const stepsWithErrors: { idx: number; title: string; missing: number }[] = [];
  NODE_DEFINITIONS.forEach((node, idx) => {
    const missing = getRequiredMissing(idx);
    if (missing > 0) {
      stepsWithErrors.push({ idx, title: node.title, missing });
    }
  });

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "#fff", position: "relative" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        :root {
          --dropi: #F77F00;
          --dropi-light: #FFF3E0;
          --dropi-border: rgba(247,127,0,.25);
          --bg: #F7F7F7;
          --white: #fff;
          --border: #E8E8E8;
          --fg: #1A1A1A;
          --muted: #8A8A8A;
          --muted-light: #C4C4C4;
          --success: #22C55E;
          --success-light: #F0FDF4;
          --success-border: rgba(34,197,94,.3);
          --warn: #F59E0B;
          --warn-light: #FFFBEB;
          --warn-border: rgba(245,158,11,.3);
          --error: #EF4444;
          --radius-sm: 8px;
          --radius-md: 12px;
        }

        /* Structural layout */
        #hdr {
          background: var(--white);
          border-bottom: 1px solid var(--border);
          padding: 0 24px;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .hdr-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .back {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          font-size: 20px;
          padding: 0;
          line-height: 1;
          font-family: inherit;
        }
        .back:hover {
          color: var(--fg);
        }
        .hdr-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--fg);
        }
        .hdr-pills {
          display: flex;
          gap: 6px;
          margin-left: 12px;
        }
        .hdr-pill {
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          background: var(--bg);
          border: 1px solid var(--border);
          color: var(--muted);
          font-weight: 500;
        }
        .close-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--muted);
          font-size: 18px;
          padding: 4px;
          font-family: inherit;
        }
        .close-btn:hover {
          color: var(--fg);
        }

        #layout {
          flex: 1;
          display: flex;
          overflow: hidden;
          height: calc(100vh - 56px - 60px); /* Discounting header and bottom-bar */
        }

        /* Stepper panel */
        #stepper-panel {
          width: 220px;
          background: var(--white);
          border-right: 1px solid var(--border);
          padding: 24px 0;
          overflow-y: auto;
          flex-shrink: 0;
        }

        .step-item {
          display: flex;
          align-items: flex-start;
          padding: 10px 18px;
          cursor: pointer;
          transition: background-color 0.15s ease;
        }
        .step-item:hover {
          background-color: #FAFAFA;
        }
        .step-item:hover .step-label {
          color: var(--fg);
        }
        .step-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          border: 1.5px solid var(--muted-light);
          background: var(--white);
          color: var(--muted);
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .step-circle.active {
          border-color: var(--dropi);
          color: var(--dropi);
        }
        .step-circle.done {
          border-color: var(--success);
          background: var(--success-light);
          color: var(--success);
          font-size: 12px;
        }
        .step-circle.started {
          border-color: var(--dropi);
          color: var(--dropi);
          border-style: dashed;
        }
        .step-circle.has-errors {
          border-color: var(--warn);
          color: var(--warn);
        }
        .step-line {
          width: 1.5px;
          min-height: 22px;
          flex: 1;
          background: var(--border);
          margin: 4px auto;
        }
        .step-line.done {
          background: var(--success);
          opacity: 0.4;
        }
        .step-label {
          font-size: 13px;
          font-weight: 500;
          color: var(--muted);
          line-height: 1.3;
          transition: color 0.15s ease;
        }
        .step-label.active {
          color: var(--dropi);
          font-weight: 700;
        }
        .step-label.done {
          color: var(--fg);
        }
        .step-sublabel {
          font-size: 11px;
          color: var(--muted-light);
          margin-top: 2px;
        }
        .step-sublabel.err {
          color: var(--warn);
        }

        /* Form panel */
        #form-panel {
          flex: 1;
          overflow-y: auto;
          background: var(--bg);
          padding-bottom: 80px; /* Space for the fixed bottom-bar */
        }
        #form-inner {
          max-width: 680px;
          margin: 0 auto;
          padding: 28px 24px 120px;
        }

        .node-eyebrow {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 4px;
        }
        .node-title {
          font-size: 22px;
          font-weight: 700;
          color: var(--fg);
          margin-bottom: 6px;
        }
        .node-desc {
          font-size: 14px;
          color: var(--muted);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        /* Accordion */
        .acc-section {
          background: var(--white);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          margin-bottom: 10px;
          overflow: hidden;
        }
        .acc-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 20px;
          cursor: pointer;
          user-select: none;
        }
        .acc-header:hover {
          background: #FAFAFA;
        }
        .acc-header-left {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .acc-title {
          font-size: 14.5px;
          font-weight: 600;
          color: var(--fg);
        }
        .acc-subtitle {
          font-size: 12.5px;
          color: var(--muted);
        }
        .acc-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .acc-check {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          border: 1.5px solid var(--muted-light);
          background: var(--white);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--muted-light);
          transition: all 0.2s ease;
        }
        .acc-check.done {
          border-color: var(--success-border);
          background: var(--success-light);
          color: var(--success);
        }
        .acc-chevron {
          font-size: 12px;
          color: var(--muted);
          transition: transform 0.2s ease;
        }
        .acc-chevron.open {
          transform: rotate(180deg);
        }
        .acc-body {
          display: none;
          padding: 4px 20px 20px;
          border-top: 1px solid var(--border);
        }
        .acc-body.open {
          display: block;
        }

        /* Fields */
        .fld {
          margin-top: 18px;
        }
        .fld-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: var(--fg);
          margin-bottom: 6px;
        }
        .fld-req {
          color: var(--dropi);
          margin-left: 2px;
        }
        .fld-opt {
          font-size: 11px;
          font-weight: 400;
          color: var(--muted-light);
          margin-left: 4px;
        }
        .fld-hint {
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 8px;
          line-height: 1.5;
        }
        #form-panel input[type=text], 
        #form-panel textarea, 
        #form-panel select {
          width: 100% !important;
          max-width: 100% !important;
          border: 1px solid #D1D5DB !important;
          border-radius: var(--radius-sm) !important;
          padding: 10px 14px !important;
          font-size: 14px !important;
          outline: none !important;
          font-family: inherit !important;
          background: #FAFAFA !important;
          color: var(--fg) !important;
          box-sizing: border-box !important;
          display: block !important;
          transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease !important;
        }

        #form-panel input[type=text]:focus, 
        #form-panel textarea:focus, 
        #form-panel select:focus {
          border-color: var(--dropi) !important;
          background: var(--white) !important;
          box-shadow: 0 0 0 3px rgba(247,127,0,.12) !important;
        }

        .opt-desc {
          margin-top: 8px;
          padding: 10px 14px;
          background: #FFF8F0;
          border: 1px solid var(--dropi-border);
          border-radius: var(--radius-sm);
          font-size: 13px;
          color: #7a4f1e;
          line-height: 1.5;
        }

        /* Summary panel */
        #summary-panel {
          width: 240px;
          background: var(--white);
          border-left: 1px solid var(--border);
          padding: 24px 18px;
          overflow-y: auto;
          flex-shrink: 0;
        }
        .sum-title {
          font-size: 11px;
          font-weight: 700;
          color: var(--muted);
          text-transform: uppercase;
          letter-spacing: .06em;
          margin-bottom: 16px;
        }
        .sum-item {
          margin-bottom: 12px;
        }
        .sum-label {
          font-size: 11px;
          color: var(--muted);
          margin-bottom: 2px;
        }
        .sum-value {
          font-size: 13px;
          font-weight: 500;
          color: var(--fg);
          line-height: 1.4;
          word-break: break-word;
        }
        .sum-value.empty {
          color: var(--muted-light);
          font-style: italic;
          font-weight: 400;
        }
        .sum-divider {
          border: none;
          border-top: 1px solid var(--border);
          margin: 16px 0;
        }
        .sum-prog-label {
          display: flex;
          justify-content: space-between;
          font-size: 12px;
          color: var(--muted);
          margin-bottom: 6px;
        }
        .sum-prog-bar {
          height: 4px;
          background: var(--border);
          border-radius: 4px;
          overflow: hidden;
        }
        .sum-prog-fill {
          height: 100%;
          background: var(--dropi);
          border-radius: 4px;
          transition: width .3s;
        }

        /* Multiselect field */
        .ms-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
        }
        .ms-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          background: var(--dropi-light);
          border: 1px solid var(--dropi-border);
          border-radius: 20px;
          padding: 4px 10px 4px 8px;
        }
        .ms-chip-rank {
          font-size: 9px;
          font-weight: 750;
          color: #fff;
          border-radius: 10px;
          padding: 1px 6px;
        }
        .ms-chip-rank.pr {
          background: var(--dropi);
        }
        .ms-chip-rank.sc {
          background: var(--muted-light);
        }
        .ms-chip-name {
          font-size: 12px;
          font-weight: 600;
          color: var(--dropi);
        }
        .ms-chip-rm {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(247,127,0,.5);
          font-size: 14px;
          padding: 0;
          line-height: 1;
          margin-left: 2px;
        }
        .ms-opts {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .ms-opt {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid var(--border);
          background: var(--white);
          color: var(--muted);
          font-size: 13px;
          cursor: pointer;
          transition: all 0.12s;
          font-family: inherit;
        }
        .ms-opt:hover {
          border-color: var(--dropi-border);
          color: var(--fg);
        }
        .ms-opt.on {
          border-color: var(--dropi);
          background: var(--dropi-light);
          color: var(--dropi);
          font-weight: 600;
        }
        .ms-opt.on.rk {
          border-color: transparent;
          background: #f0f0f0;
          color: #999;
          text-decoration: line-through;
        }
        .ms-hint {
          font-size: 12px;
          color: var(--muted-light);
          margin-top: 6px;
        }

        /* Bottom bar */
        #bottom-bar {
          position: fixed;
          bottom: 0;
          right: 0;
          width: calc(100% - 220px);
          background: var(--white);
          border-top: 1px solid var(--border);
          padding: 12px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 100;
        }
        .btn-prev {
          background: none;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          padding: 10px 20px;
          font-size: 14px;
          font-weight: 500;
          color: var(--fg);
          cursor: pointer;
          font-family: inherit;
        }
        .btn-prev:disabled {
          opacity: .4;
          cursor: default;
        }
        .btn-prev:not(:disabled):hover {
          border-color: var(--muted);
        }
        .btn-next {
          background: var(--dropi);
          color: #fff;
          border: none;
          border-radius: var(--radius-sm);
          padding: 11px 28px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          font-family: inherit;
          min-width: 140px;
        }
        .btn-next:hover {
          opacity: .9;
        }

        /* Validation banner */
        .val-banner {
          background: var(--warn-light);
          border: 1px solid var(--warn-border);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          margin-bottom: 16px;
        }
        .val-banner-title {
          font-size: 13px;
          font-weight: 600;
          color: #92400e;
          margin-bottom: 6px;
        }
        .val-banner-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .val-banner-list li {
          font-size: 12px;
          color: #78350f;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }
        .val-banner-list li:hover {
          text-decoration: underline;
        }
        .val-banner-list li::before {
          content: "→";
          flex-shrink: 0;
        }
      ` }} />

      {/* Header */}
      <header id="hdr">
        <div className="hdr-left">
          <button className="back" onClick={() => router.push("/proyectos/dinamicas-catalogo")}>←</button>
          <span className="hdr-title" id="hdr-title" style={{ marginLeft: 8 }}>
            {campaignName ? `Generador: ${campaignName}` : "Crear campaña"}
          </span>
          <div className="hdr-pills" id="hdr-pills">
            {campaignData[0]?.objective && (
              <span className="hdr-pill">{campaignData[0].objective}</span>
            )}
            {campaignData[0]?.country && (
              <span className="hdr-pill">
                {campaignData[0].country.split("||").filter(Boolean).join(", ")}
              </span>
            )}
          </div>
        </div>
        <button 
          className="close-btn" 
          onClick={() => router.push("/proyectos/dinamicas-catalogo")}
          style={{ fontSize: 16, cursor: "pointer", background: "none", border: "none", color: "var(--muted)" }}
        >✕</button>
      </header>

      {/* Main Layout Area */}
      <div id="layout">
        {/* Left Sidebar: Stepper */}
        <aside id="stepper-panel">
          {NODE_DEFINITIONS.map((node, idx) => {
            const done = startedNodes.has(idx) && getRequiredMissing(idx) === 0;
            const active = idx === activeNode;
            const started = startedNodes.has(idx) && !done && !active;
            const missing = getRequiredMissing(idx);
            const hasErrors = !done && missing > 0 && startedNodes.has(idx);

            let circleClass = "step-circle";
            if (done) circleClass += " done";
            else if (active) circleClass += " active";
            else if (hasErrors) circleClass += " has-errors";
            else if (started) circleClass += " started";

            let labelClass = "step-label";
            if (active) labelClass += " active";
            else if (done) labelClass += " done";

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
                  <div className={`step-circle ${circleClass}`}>{done ? "✓" : idx + 1}</div>
                  {idx < NODE_DEFINITIONS.length - 1 && (
                    <div className={`step-line ${done ? "done" : ""}`} />
                  )}
                </div>
                <div className="step-content">
                  <div className={labelClass}>{node.title}</div>
                  {active && missing > 0 && (
                    <div className="step-sublabel err">
                      {missing} campo{missing > 1 ? "s" : ""} pendiente{missing > 1 ? "s" : ""}
                    </div>
                  )}
                  {!active && hasErrors && (
                    <div className="step-sublabel err">{missing} pendiente{missing > 1 ? "s" : ""}</div>
                  )}
                  {done && <div className="step-sublabel" style={{ color: "var(--success)" }}>Completo</div>}
                </div>
              </div>
            );
          })}
        </aside>

        {/* Center Panel: Forms */}
        <main id="form-panel" style={{ flex: 1, overflowY: "auto", position: "relative" }}>
          <div id="form-inner">
            {/* Validation Banner (appears if showValidation is true on the last step) */}
            {isLast && showValidation && stepsWithErrors.length > 0 && (
              <div className="val-banner">
                <div className="val-banner-title">Faltan campos obligatorios para finalizar</div>
                <ul className="val-banner-list">
                  {stepsWithErrors.map(({ idx, title, missing }) => (
                    <li 
                      key={idx} 
                      onClick={() => {
                        setActiveNode(idx);
                        setShowValidation(false);
                      }}
                    >
                      Paso {idx + 1} · {title} — {missing} campo{missing > 1 ? "s" : ""} pendiente{missing > 1 ? "s" : ""}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="node-eyebrow">Paso {activeNode + 1} de {NODE_DEFINITIONS.length}</div>
            <div className="node-title">{nodeDef.title}</div>
            <div className="node-desc">{nodeDef.description}</div>

            {/* Accordion Sections */}
            {nodeDef.sections.map((sec, sIdx) => {
              const isOpen = !!expandedSections[sec.key];
              const secDone = isSectionDone(sec, activeNode);

              return (
                <div key={sec.key} className="acc-section">
                  <div 
                    className="acc-header"
                    onClick={() => {
                      setExpandedSections((prev) => ({
                        ...prev,
                        [sec.key]: !prev[sec.key],
                      }));
                    }}
                  >
                    <div className="acc-header-left">
                      <div className="acc-title">{sec.title}</div>
                      <div className="acc-subtitle">{sec.subtitle}</div>
                    </div>
                    <div className="acc-right">
                      <div className={`acc-check ${secDone ? "done" : ""}`}>
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7L5.5 10L11.5 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className={`acc-chevron ${isOpen ? "open" : ""}`} style={{ fontSize: 10 }}>▼</span>
                    </div>
                  </div>
                  <div className={`acc-body ${isOpen ? "open" : ""}`}>
                    {sec.fields.map((f) => (
                      <div key={f.key} className="fld">
                        <label className="fld-label">
                          {f.label}
                          {f.required ? (
                            <span className="fld-req">*</span>
                          ) : (
                            <span className="fld-opt">(opcional)</span>
                          )}
                        </label>
                        {f.hint && <p className="fld-hint">{f.hint}</p>}

                        {/* Input Switch */}
                        {f.type === "text" && (
                          <input 
                            type="text" 
                            placeholder={f.placeholder || ""}
                            value={campaignData[activeNode]?.[f.key] || ""}
                            onChange={(e) => handleFieldChange(f.key, e.target.value)}
                          />
                        )}

                        {f.type === "textarea" && (
                          <textarea
                            placeholder={f.placeholder || ""}
                            value={campaignData[activeNode]?.[f.key] || ""}
                            onChange={(e) => handleFieldChange(f.key, e.target.value)}
                          />
                        )}

                        {f.type === "select" && (
                          <>
                            <select
                              value={campaignData[activeNode]?.[f.key] || ""}
                              onChange={(e) => handleFieldChange(f.key, e.target.value)}
                            >
                              <option value="">Seleccionar...</option>
                              {f.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                            {f.optionDescriptions && campaignData[activeNode]?.[f.key] && f.optionDescriptions[campaignData[activeNode][f.key]] && (
                              <div className="opt-desc" style={{ display: "block" }}>
                                {f.optionDescriptions[campaignData[activeNode][f.key]]}
                              </div>
                            )}
                          </>
                        )}

                        {f.type === "multiselect" && (
                          <MultiSelectField
                            field={f}
                            value={campaignData[activeNode]?.[f.key] || ""}
                            onChange={(val) => handleFieldChange(f.key, val)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </main>

        {/* Right Panel: Live Summary */}
        <aside id="summary-panel">
          <div className="sum-title">Resumen</div>
          <div id="sum-content">
            <div className="sum-item">
              <div className="sum-label">Campaña</div>
              <div className={`sum-value ${campaignName ? "" : "empty"}`}>
                {campaignName || "—"}
              </div>
            </div>
            <div className="sum-item">
              <div className="sum-label">Objetivo</div>
              <div className={`sum-value ${campaignData[0]?.objective ? "" : "empty"}`}>
                {campaignData[0]?.objective || "—"}
              </div>
            </div>
            <div className="sum-item">
              <div className="sum-label">Evento</div>
              <div className={`sum-value ${campaignData[0]?.commercial_event ? "" : "empty"}`}>
                {campaignData[0]?.commercial_event || "—"}
              </div>
            </div>
            <div className="sum-item">
              <div className="sum-label">Países</div>
              <div className={`sum-value ${campaignData[0]?.country ? "" : "empty"}`}>
                {campaignData[0]?.country ? campaignData[0].country.split("||").filter(Boolean).join(", ") : "—"}
              </div>
            </div>
            <div className="sum-item">
              <div className="sum-label">Responsable</div>
              <div className={`sum-value ${campaignData[0]?.responsible ? "" : "empty"}`}>
                {campaignData[0]?.responsible || "—"}
              </div>
            </div>
          </div>
          <div className="sum-divider" />
          <div className="sum-prog-label">
            <span>Progreso</span>
            <span id="sum-pct" style={{ fontWeight: 700, color: "var(--dropi)" }}>{progressPct}%</span>
          </div>
          <div className="sum-prog-bar">
            <div className="sum-prog-fill" id="sum-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </aside>
      </div>

      {/* Bottom Bar Controls */}
      <footer id="bottom-bar" style={{
        position: "fixed", bottom: 0, right: 0,
        width: "calc(100% - 220px)",
        background: "var(--white)", borderTop: "1px solid var(--border)",
        padding: "12px 24px", display: "flex", alignItems: "center",
        justifyContent: "space-between", zIndex: 10,
      }}>
        <button 
          className="btn-prev" 
          id="btn-prev" 
          disabled={activeNode === 0}
          onClick={handlePrev}
        >
          ← Anterior
        </button>
        <button 
          className="btn-next" 
          id="btn-next" 
          onClick={handleNext}
        >
          {isLast ? (saving ? "Guardando..." : "✓ Finalizar campaña") : (saving ? "Guardando..." : "Siguiente →")}
        </button>
      </footer>
    </div>
  );
}

// ── Multi-select field component ──────────────────────────────
function MultiSelectField({
  field,
  value,
  onChange,
}: {
  field: Field;
  value: string;
  onChange: (v: string) => void;
}) {
  const selected = value ? value.split("||").filter(Boolean) : [];

  const toggle = (opt: string) => {
    let next;
    if (selected.includes(opt)) {
      next = selected.filter((s) => s !== opt);
    } else {
      next = [...selected, opt];
    }
    onChange(next.join("||"));
  };

  const removeOpt = (opt: string) => {
    const next = selected.filter((s) => s !== opt);
    onChange(next.join("||"));
  };

  return (
    <div>
      {selected.length > 0 && (
        <div className="ms-chips">
          {selected.map((opt, idx) => {
            if (field.ranked) {
              const isPrimary = idx === 0;
              return (
                <div key={opt} className="ms-chip">
                  <span className={`ms-chip-rank ${isPrimary ? "pr" : "sc"}`}>
                    {isPrimary ? "Principal" : "Secundario"}
                  </span>
                  <span className="ms-chip-name">{opt}</span>
                  <button type="button" className="ms-chip-rm" onClick={() => removeOpt(opt)}>×</button>
                </div>
              );
            }
            return (
              <div key={opt} className="ms-chip">
                <span className="ms-chip-name">{opt}</span>
                <button type="button" className="ms-chip-rm" onClick={() => removeOpt(opt)}>×</button>
              </div>
            );
          })}
        </div>
      )}
      <div className="ms-opts">
        {field.options?.map((opt) => {
          const isSelected = selected.includes(opt);
          const optClass = `ms-opt ${isSelected ? "on" : ""} ${isSelected && field.ranked ? "rk" : ""}`;
          return (
            <button
              key={opt}
              type="button"
              className={optClass}
              onClick={() => toggle(opt)}
            >
              {isSelected && !field.ranked && "✓ "}
              {opt}
            </button>
          );
        })}
      </div>
      {field.ranked && selected.length === 0 && (
        <p className="ms-hint">El primero que selecciones será el canal principal.</p>
      )}
    </div>
  );
}
