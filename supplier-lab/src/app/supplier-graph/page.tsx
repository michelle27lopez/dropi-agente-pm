"use client";

import "@xyflow/react/dist/style.css";

import React, { useCallback, useMemo, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  Background,
  Controls,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
} from "@xyflow/react";
import { X, Search, Download, Upload, GitBranch } from "lucide-react";
import graphDataV4 from "@/data/supplier-success-graph-v4.json";
import { type GraphData } from "@/lib/graph-validator";


// ─── Types ──────────────────────────────────────────────────────────────────

type NodeType =
  | "supplier_segment"
  | "flow"
  | "milestone"
  | "friction"
  | "hypothesis"
  | "experiment"
  | "metric"
  | "data_source"
  | "project"
  | "objective"
  | "benefit"
  | "integration"
  | "decision"
  | "capability";

type EdgeRelationType =
  | "requires"
  | "enables"
  | "impacts"
  | "blocks"
  | "measures"
  | "belongs_to"
  | "tests"
  | "depends_on"
  | "reduces"
  | "feeds"
  | "includes"
  | "integrates";

interface GraphNodeData extends Record<string, unknown> {
  label: string;
  nodeType: NodeType;
  description: string;
  originalId: string;
}

interface GraphEdgeData extends Record<string, unknown> {
  relationType: EdgeRelationType;
}

// ─── Layer Groups ────────────────────────────────────────────────────────────

const LAYER_GROUPS = {
  capacidades: {
    label: "Capacidades",
    types: ["flow", "objective", "project", "capability"] as NodeType[],
    color: "#3b82f6",
    defaultOn: true,
  },
  fricciones: {
    label: "Fricciones",
    types: ["friction"] as NodeType[],
    color: "#ef4444",
    defaultOn: true,
  },
  investigacion: {
    label: "Investigación",
    types: ["hypothesis", "experiment"] as NodeType[],
    color: "#a855f7",
    defaultOn: false,
  },
  datos: {
    label: "Datos",
    types: ["metric", "milestone", "data_source"] as NodeType[],
    color: "#06b6d4",
    defaultOn: false,
  },
  contexto: {
    label: "Contexto",
    types: ["supplier_segment", "benefit", "integration", "decision"] as NodeType[],
    color: "#64748b",
    defaultOn: false,
  },
} as const;

type LayerKey = keyof typeof LAYER_GROUPS;

// ─── Color Maps ─────────────────────────────────────────────────────────────

const NODE_COLORS: Record<NodeType, string> = {
  supplier_segment: "#f97316",
  flow: "#3b82f6",
  milestone: "#10b981",
  friction: "#ef4444",
  hypothesis: "#a855f7",
  experiment: "#a78bfa",
  metric: "#06b6d4",
  data_source: "#eab308",
  project: "#6366f1",
  objective: "#14b8a6",
  benefit: "#f59e0b",
  integration: "#64748b",
  decision: "#dc2626",
  capability: "#0ea5e9",
};

const EDGE_COLORS: Record<string, string> = {
  requires: "#3b82f6",
  enables: "#10b981",
  impacts: "#f97316",
  blocks: "#ef4444",
  measures: "#06b6d4",
  belongs_to: "#6366f1",
  tests: "#a855f7",
  depends_on: "#64748b",
  reduces: "#14b8a6",
  feeds: "#eab308",
  includes: "#10b981",
  integrates: "#64748b",
};

const NODE_TYPE_LABELS: Record<NodeType, string> = {
  supplier_segment: "Segmento",
  flow: "Flujo",
  milestone: "Hito",
  friction: "Fricción",
  hypothesis: "Hipótesis",
  experiment: "Experimento",
  metric: "Métrica",
  data_source: "Fuente de datos",
  project: "Proyecto",
  objective: "Objetivo",
  benefit: "Beneficio",
  integration: "Integración",
  decision: "Decisión abierta",
  capability: "Capacidad del sistema",
};

// ─── Layout ──────────────────────────────────────────────────────────────────

const TYPE_ORDER: NodeType[] = [
  "objective",
  "capability",
  "supplier_segment",
  "flow",
  "milestone",
  "benefit",
  "friction",
  "hypothesis",
  "experiment",
  "metric",
  "data_source",
  "project",
  "integration",
  "decision",
];

function computeLayout(nodes: typeof graphDataV4.nodes): Map<string, { x: number; y: number }> {
  const positions = new Map<string, { x: number; y: number }>();
  const groups = new Map<NodeType, typeof graphDataV4.nodes>();

  for (const type of TYPE_ORDER) groups.set(type, []);
  for (const node of nodes) {
    const type = node.type as NodeType;
    if (!groups.has(type)) groups.set(type, []);
    groups.get(type)!.push(node);
  }

  const NODE_W = 180;
  const NODE_H = 60;
  const COL_GAP = 40;
  const ROW_GAP = 100;
  let rowY = 40;

  for (const type of TYPE_ORDER) {
    const group = groups.get(type) ?? [];
    if (group.length === 0) continue;
    const totalWidth = group.length * (NODE_W + COL_GAP) - COL_GAP;
    let startX = -totalWidth / 2;
    for (const node of group) {
      positions.set(node.id, { x: startX, y: rowY });
      startX += NODE_W + COL_GAP;
    }
    rowY += NODE_H + ROW_GAP;
  }

  return positions;
}

// ─── Custom Node ─────────────────────────────────────────────────────────────

function GraphNode({ data, selected }: NodeProps<Node<GraphNodeData>>) {
  const color = NODE_COLORS[data.nodeType] ?? "#64748b";
  const typeLabel = NODE_TYPE_LABELS[data.nodeType] ?? data.nodeType;

  return (
    <div
      className="relative"
      style={{
        outline: selected ? `3px solid ${color}` : "none",
        outlineOffset: "3px",
        borderRadius: "12px",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: color, width: 8, height: 8 }} />
      <div
        style={{
          background: color,
          borderRadius: "12px",
          padding: "8px 14px",
          minWidth: "140px",
          maxWidth: "180px",
          boxShadow: selected
            ? `0 0 0 3px ${color}55, 0 4px 16px ${color}44`
            : "0 2px 8px rgba(0,0,0,0.35)",
        }}
      >
        <p className="text-white text-xs font-semibold leading-tight text-center truncate">{data.label}</p>
        <p className="text-white/70 text-[9px] text-center mt-0.5 uppercase tracking-wider font-medium">
          {typeLabel}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: color, width: 8, height: 8 }} />
    </div>
  );
}

// ─── Custom Edge ─────────────────────────────────────────────────────────────

function GraphEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, markerEnd, selected,
}: EdgeProps<Edge<GraphEdgeData>>) {
  const relationType = (data?.relationType ?? "requires") as string;
  const color = EDGE_COLORS[relationType] ?? "#64748b";

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: color, strokeWidth: selected ? 2 : 1.5, strokeOpacity: 0.7 }}
      />
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <span
              style={{
                background: `${color}22`,
                border: `1px solid ${color}66`,
                color,
                fontSize: "8px",
                padding: "1px 4px",
                borderRadius: "4px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                letterSpacing: "0.02em",
              }}
            >
              {relationType}
            </span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}

const nodeTypes = { graphNode: GraphNode };
const edgeTypes = { graphEdge: GraphEdge };

// ─── Detail Panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  node: GraphNodeData & { id: string };
  edges: Edge<GraphEdgeData>[];
  allNodes: Node<GraphNodeData>[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function DetailPanel({ node, edges, allNodes, onClose, onNavigate }: DetailPanelProps) {
  const color = NODE_COLORS[node.nodeType] ?? "#64748b";
  const typeLabel = NODE_TYPE_LABELS[node.nodeType] ?? node.nodeType;

  const outgoing = edges
    .filter((e) => e.source === node.id)
    .map((e) => ({
      id: e.target,
      label: allNodes.find((n) => n.id === e.target)?.data?.label ?? e.target,
      relation: (e.data?.relationType as string) ?? "—",
      color: EDGE_COLORS[(e.data?.relationType as string) ?? ""] ?? "#64748b",
    }));

  const incoming = edges
    .filter((e) => e.target === node.id)
    .map((e) => ({
      id: e.source,
      label: allNodes.find((n) => n.id === e.source)?.data?.label ?? e.source,
      relation: (e.data?.relationType as string) ?? "—",
      color: EDGE_COLORS[(e.data?.relationType as string) ?? ""] ?? "#64748b",
    }));

  return (
    <div className="w-72 flex-shrink-0 h-full bg-zinc-900 border-r border-zinc-800 overflow-y-auto flex flex-col">
      <div className="flex items-start justify-between p-4 border-b border-zinc-800 gap-2">
        <div className="min-w-0">
          <h2 className="text-white font-bold text-sm leading-tight">{node.label}</h2>
          <span
            className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: `${color}33`, color }}
          >
            {typeLabel}
          </span>
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-zinc-400 hover:text-white mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs leading-relaxed">{node.description}</p>
      </div>

      {outgoing.length > 0 && (
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold mb-2">
            Sale hacia ({outgoing.length})
          </h3>
          <ul className="space-y-1.5">
            {outgoing.map((o, i) => (
              <li key={i}>
                <button
                  onClick={() => onNavigate(o.id)}
                  className="w-full flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-zinc-800 transition-colors text-left group"
                >
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ background: `${o.color}22`, color: o.color }}
                  >
                    {o.relation}
                  </span>
                  <span className="text-white text-xs truncate group-hover:text-zinc-200">{o.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {incoming.length > 0 && (
        <div className="p-4">
          <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold mb-2">
            Viene desde ({incoming.length})
          </h3>
          <ul className="space-y-1.5">
            {incoming.map((o, i) => (
              <li key={i}>
                <button
                  onClick={() => onNavigate(o.id)}
                  className="w-full flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-zinc-800 transition-colors text-left group"
                >
                  <span
                    className="text-[9px] font-bold px-1.5 py-0.5 rounded flex-shrink-0"
                    style={{ background: `${o.color}22`, color: o.color }}
                  >
                    {o.relation}
                  </span>
                  <span className="text-white text-xs truncate group-hover:text-zinc-200">{o.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ─── Export Modal ─────────────────────────────────────────────────────────────

function ExportModal({ onClose, data }: { onClose: () => void; data: unknown }) {
  const json = JSON.stringify(data, null, 2);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl mx-4">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-700">
          <span className="text-white font-semibold text-sm">supplier-success-graph.json</span>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <pre className="flex-1 overflow-auto p-4 text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
          {json}
        </pre>
      </div>
    </div>
  );
}

// ─── Update Modal ─────────────────────────────────────────────────────────────

interface ValidationReport {
  valid: boolean;
  summary: string;
  additions: { nodes: unknown[]; edges: unknown[] };
  warnings: { code: string; severity: string; message: string; affected: string[] }[];
  errors: { code: string; severity: string; message: string; affected: string[] }[];
}

interface UpdateModalProps {
  onClose: () => void;
  onApplied: (updated: GraphData) => void;
}

function UpdateModal({ onClose, onApplied }: UpdateModalProps) {
  const [text, setText] = useState("");
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);

  async function handleAnalyze() {
    setAnalyzeError(null);
    setReport(null);
    setAnalyzing(true);
    try {
      let proposed: Partial<GraphData>;
      try {
        proposed = JSON.parse(text);
      } catch {
        setAnalyzeError("JSON inválido. Verifica la sintaxis e intenta de nuevo.");
        return;
      }
      const res = await fetch("/api/graph/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposed }),
      });
      const data = await res.json();
      setReport(data as ValidationReport);
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "Error al analizar");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleApply() {
    if (!report?.valid) return;
    setApplying(true);
    try {
      let proposed: Partial<GraphData>;
      try {
        proposed = JSON.parse(text);
      } catch {
        return;
      }
      const res = await fetch("/api/graph/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposed }),
      });
      const data = await res.json();
      if (res.ok && data.graph) {
        onApplied(data.graph as GraphData);
        onClose();
      } else {
        setAnalyzeError(data.error ?? "Error al aplicar cambios");
      }
    } catch (e) {
      setAnalyzeError(e instanceof Error ? e.message : "Error al aplicar");
    } finally {
      setApplying(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl mx-4">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-700">
          <span className="text-white font-semibold text-sm flex items-center gap-2">
            <Upload className="w-4 h-4 text-zinc-400" />
            Actualizar grafo
          </span>
          <button onClick={onClose} className="text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-4 border-b border-zinc-800">
          <p className="text-zinc-400 text-xs mb-2">
            Pega el JSON propuesto. Puede ser{" "}
            <code className="text-zinc-300">{"{ nodes: [], edges: [] }"}</code> o solo{" "}
            <code className="text-zinc-300">{"{ nodes: [] }"}</code> /{" "}
            <code className="text-zinc-300">{"{ edges: [] }"}</code>.
          </p>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setReport(null); setAnalyzeError(null); }}
            className="w-full h-40 bg-zinc-800 text-zinc-200 text-xs font-mono rounded-lg p-3 border border-zinc-700 focus:outline-none focus:border-zinc-500 resize-none"
            placeholder='{ "nodes": [], "edges": [] }'
            spellCheck={false}
          />
        </div>
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={handleAnalyze}
              disabled={analyzing || !text.trim()}
              className="px-4 py-1.5 bg-zinc-700 hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white text-xs font-medium transition-colors"
            >
              {analyzing ? "Analizando..." : "Analizar"}
            </button>
            <button
              onClick={handleApply}
              disabled={!report?.valid || applying}
              className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white text-xs font-medium transition-colors"
            >
              {applying ? "Aplicando..." : "Aplicar cambios"}
            </button>
          </div>
          {analyzeError && (
            <div className="rounded-lg bg-red-900/40 border border-red-700 px-3 py-2 text-red-300 text-xs">
              {analyzeError}
            </div>
          )}
          {report && (
            <div className="flex flex-col gap-2">
              <div
                className={`rounded-lg px-3 py-2 text-xs font-medium border ${
                  report.valid
                    ? "bg-emerald-900/40 border-emerald-700 text-emerald-300"
                    : "bg-red-900/40 border-red-700 text-red-300"
                }`}
              >
                {report.summary}
              </div>
              <div className="text-zinc-400 text-xs">
                Adiciones:{" "}
                <span className="text-white font-semibold">{report.additions.nodes.length}</span> nodo(s),{" "}
                <span className="text-white font-semibold">{report.additions.edges.length}</span> arista(s)
              </div>
              {report.errors.length > 0 && (
                <div>
                  <p className="text-red-400 text-[10px] uppercase tracking-widest font-semibold mb-1">
                    Errores ({report.errors.length})
                  </p>
                  <ul className="flex flex-col gap-1">
                    {report.errors.map((e, i) => (
                      <li key={i} className="bg-red-900/30 border border-red-800 rounded px-2 py-1.5 text-xs text-red-200">
                        <span className="font-bold text-red-400 mr-1">[{e.code}]</span>
                        {e.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {report.warnings.length > 0 && (
                <div>
                  <p className="text-yellow-400 text-[10px] uppercase tracking-widest font-semibold mb-1">
                    Advertencias ({report.warnings.length})
                  </p>
                  <ul className="flex flex-col gap-1">
                    {report.warnings.map((w, i) => (
                      <li key={i} className="bg-yellow-900/20 border border-yellow-800/50 rounded px-2 py-1.5 text-xs text-yellow-200">
                        <span className="font-bold text-yellow-400 mr-1">[{w.code}]</span>
                        {w.message}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Graph ───────────────────────────────────────────────────────────────

function SupplierGraph() {
  const { fitView } = useReactFlow();
  const [search, setSearch] = useState("");
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(
    () => new Set((Object.keys(LAYER_GROUPS) as LayerKey[]).filter((k) => LAYER_GROUPS[k].defaultOn))
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [showUpdate, setShowUpdate] = useState(false);
  const [liveGraph, setLiveGraph] = useState<GraphData>(graphDataV4 as unknown as GraphData);

  function toggleLayer(key: LayerKey) {
    setActiveLayers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setSelectedNodeId(null);
  }

  // Types visible given active layers
  const activeTypes = useMemo(
    () => new Set([...activeLayers].flatMap((k) => [...LAYER_GROUPS[k].types])),
    [activeLayers]
  );

  const positionMap = useMemo(() => computeLayout(liveGraph.nodes as typeof graphDataV4.nodes), [liveGraph.nodes]);

  const initialNodes: Node<GraphNodeData>[] = useMemo(
    () =>
      liveGraph.nodes.map((n) => ({
        id: n.id,
        type: "graphNode",
        position: positionMap.get(n.id) ?? { x: 0, y: 0 },
        data: {
          label: n.label,
          nodeType: n.type as NodeType,
          description: n.description,
          originalId: n.id,
        },
      })),
    [liveGraph.nodes, positionMap]
  );

  const initialEdges: Edge<GraphEdgeData>[] = useMemo(
    () =>
      liveGraph.edges.map((e) => ({
        id: e.id ?? `${e.source}-${e.target}`,
        source: e.source,
        target: e.target,
        type: "graphEdge",
        data: { relationType: e.type as EdgeRelationType },
        label: e.label,
      })),
    [liveGraph.edges]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);


  const handleApplied = useCallback(
    (updated: GraphData) => {
      setLiveGraph(updated);
      const newPositionMap = computeLayout(updated.nodes as typeof graphDataV4.nodes);
      setNodes(
        updated.nodes.map((n) => ({
          id: n.id,
          type: "graphNode",
          position: newPositionMap.get(n.id) ?? { x: 0, y: 0 },
          data: {
            label: n.label,
            nodeType: n.type as NodeType,
            description: n.description,
            originalId: n.id,
          },
        }))
      );
      setEdges(
        updated.edges.map((e) => ({
          id: e.id ?? `${e.source}-${e.target}`,
          source: e.source,
          target: e.target,
          type: "graphEdge",
          data: { relationType: e.type as EdgeRelationType },
          label: e.label,
        }))
      );
    },
    [setNodes, setEdges]
  );

  // Neighbors of selected node (direct connections only)
  const neighborIds = useMemo(() => {
    if (!selectedNodeId) return null;
    const set = new Set<string>([selectedNodeId]);
    for (const e of edges) {
      if (e.source === selectedNodeId) set.add(e.target);
      if (e.target === selectedNodeId) set.add(e.source);
    }
    return set;
  }, [selectedNodeId, edges]);

  // Nodes visible based on layer filter + search (used when no node is selected)
  const layerVisibleIds = useMemo(() => {
    const q = search.toLowerCase().trim();
    return new Set(
      nodes
        .filter((n) => {
          const inLayer = activeTypes.has(n.data.nodeType);
          const matchesSearch = q === "" || n.data.label.toLowerCase().includes(q);
          return inLayer && matchesSearch;
        })
        .map((n) => n.id)
    );
  }, [nodes, search, activeTypes]);

  const styledNodes = useMemo(
    () =>
      nodes.map((n) => {
        let opacity: number;
        if (neighborIds) {
          // Focus mode: selected node + direct neighbors at full opacity
          opacity = neighborIds.has(n.id) ? 1 : 0.08;
        } else {
          // Layer+search mode
          opacity = layerVisibleIds.has(n.id) ? 1 : 0;
        }
        return {
          ...n,
          hidden: !neighborIds && !layerVisibleIds.has(n.id),
          style: { ...n.style, opacity, transition: "opacity 0.15s" },
        };
      }),
    [nodes, layerVisibleIds, neighborIds]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((e) => {
        let opacity: number;
        if (neighborIds) {
          const connected = e.source === selectedNodeId || e.target === selectedNodeId;
          opacity = connected ? 1 : 0.04;
        } else {
          opacity =
            layerVisibleIds.has(e.source) && layerVisibleIds.has(e.target) ? 0.6 : 0;
        }
        return {
          ...e,
          hidden: !neighborIds && (!layerVisibleIds.has(e.source) || !layerVisibleIds.has(e.target)),
          style: { ...e.style, opacity, transition: "opacity 0.15s" },
        };
      }),
    [edges, layerVisibleIds, neighborIds, selectedNodeId]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<GraphNodeData>) => {
    setSelectedNodeId((prev) => (prev === node.id ? null : node.id));
  }, []);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId),
    [nodes, selectedNodeId]
  );

  // Count nodes per layer for the toggle labels
  const layerCounts = useMemo(() => {
    const counts: Record<LayerKey, number> = {} as Record<LayerKey, number>;
    for (const key of Object.keys(LAYER_GROUPS) as LayerKey[]) {
      const types = new Set(LAYER_GROUPS[key].types);
      counts[key] = liveGraph.nodes.filter((n) => types.has(n.type as NodeType)).length;
    }
    return counts;
  }, [liveGraph.nodes]);

  const visibleCount = styledNodes.filter((n) => !n.hidden).length;

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#0f0f11" }}>
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-20 border-b border-zinc-800"
        style={{ background: "#0f0f11" }}
      >
        {/* Top row */}
        <div className="h-12 flex items-center px-4 gap-3">
          <img
            src="https://d1l4mzebo786pw.cloudfront.net/image/input/white-labels/1/logos/secondary_logo/logo-naranja.png"
            alt="Dropi"
            className="h-6 object-contain flex-shrink-0"
          />
          <div className="flex flex-col justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm leading-tight">Supplier Success Graph</span>
          </div>

          {/* Version */}
          <div className="flex items-center gap-1.5 bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-1.5 flex-shrink-0">
            <GitBranch className="w-3 h-3 text-zinc-500" />
            <span className="text-zinc-300 text-[10px] font-semibold">v4 · Producto como capacidad core</span>
          </div>

          <div className="flex-1" />

          {/* Node count */}
          <span className="text-zinc-500 text-[10px] flex-shrink-0">
            {visibleCount} nodos visibles
          </span>

          {/* Search */}
          <div className="relative flex-shrink-0">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar nodo..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSelectedNodeId(null); }}
              className="bg-zinc-800 text-white text-xs rounded-lg pl-7 pr-3 py-1.5 w-36 placeholder-zinc-500 border border-zinc-700 focus:outline-none focus:border-zinc-500"
            />
          </div>

          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 transition-colors flex-shrink-0"
          >
            <Download className="w-3 h-3" />
            JSON
          </button>
          <button
            onClick={() => setShowUpdate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 transition-colors flex-shrink-0"
          >
            <Upload className="w-3 h-3" />
            Actualizar
          </button>
        </div>

        {/* Layer toggles row */}
        <div className="h-9 flex items-center px-4 gap-2 border-t border-zinc-800/60">
          <span className="text-zinc-600 text-[10px] uppercase tracking-widest font-semibold flex-shrink-0 mr-1">
            Capas
          </span>
          {(Object.keys(LAYER_GROUPS) as LayerKey[]).map((key) => {
            const layer = LAYER_GROUPS[key];
            const active = activeLayers.has(key);
            return (
              <button
                key={key}
                onClick={() => toggleLayer(key)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold whitespace-nowrap transition-all border"
                style={{
                  background: active ? `${layer.color}22` : "transparent",
                  borderColor: active ? `${layer.color}66` : "#3f3f46",
                  color: active ? layer.color : "#52525b",
                }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: active ? layer.color : "#3f3f46" }}
                />
                {layer.label}
                <span
                  className="text-[9px] opacity-70"
                  style={{ color: active ? layer.color : "#52525b" }}
                >
                  {layerCounts[key]}
                </span>
              </button>
            );
          })}
          {selectedNodeId && (
            <span className="ml-auto text-[10px] text-zinc-500 flex-shrink-0">
              Click en el mismo nodo para deseleccionar · Esc para salir
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex w-full pt-[84px] h-full">
        {/* Detail panel */}
        {selectedNode && (
          <DetailPanel
            node={{ ...selectedNode.data, id: selectedNode.id }}
            edges={edges as Edge<GraphEdgeData>[]}
            allNodes={nodes as Node<GraphNodeData>[]}
            onClose={() => setSelectedNodeId(null)}
            onNavigate={(id) => {
              setSelectedNodeId(id);
              setTimeout(() => fitView({ nodes: [{ id }], duration: 400, padding: 0.5 }), 50);
            }}
          />
        )}

        {/* Canvas */}
        <div className="flex-1 h-full">
          <ReactFlow
            nodes={styledNodes}
            edges={styledEdges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            onPaneClick={() => setSelectedNodeId(null)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.1}
            maxZoom={3}
            colorMode="dark"
          >
            <Background color="#27272a" gap={24} size={1} />
            <Controls className="!bg-zinc-800 !border-zinc-700" />
          </ReactFlow>
        </div>
      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} data={liveGraph} />}
      {showUpdate && (
        <UpdateModal onClose={() => setShowUpdate(false)} onApplied={handleApplied} />
      )}
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function SupplierGraphPage() {
  return (
    <ReactFlowProvider>
      <SupplierGraph />
    </ReactFlowProvider>
  );
}
