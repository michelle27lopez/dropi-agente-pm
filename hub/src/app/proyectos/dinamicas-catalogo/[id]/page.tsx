"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { NODE_DEFINITIONS, NodeKey } from "./nodes";

type Campaign = { id: string; name: string; status: string; current_node: number };
type NodeData = Record<string, string>;
type SavedNode = { node_index: number; node_key: string; data: NodeData; completed: boolean };

export default function CampaignWizardPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [savedNodes, setSavedNodes] = useState<SavedNode[]>([]);
  const [activeNode, setActiveNode] = useState(0);
  const [formData, setFormData] = useState<NodeData>({});
  const [saving, setSaving] = useState(false);

  // Load campaign + its nodes
  useEffect(() => {
    Promise.all([
      fetch(`/api/campaigns/${id}`).then((r) => r.json()),
      fetch(`/api/campaigns/${id}/nodes`).then((r) => r.json()),
    ]).then(([camp, nodes]) => {
      if (camp?.id) {
        setCampaign(camp);
        setActiveNode(camp.current_node ?? 0);
      }
      if (Array.isArray(nodes)) setSavedNodes(nodes);
    });
  }, [id]);

  // When active node changes, pre-fill form with saved data
  useEffect(() => {
    const saved = savedNodes.find((n) => n.node_index === activeNode);
    setFormData(saved?.data ?? {});
  }, [activeNode, savedNodes]);

  const nodeDef = NODE_DEFINITIONS[activeNode];

  const saveAndAdvance = useCallback(async () => {
    if (!campaign) return;
    setSaving(true);

    // Save current node data
    await fetch(`/api/campaigns/${id}/nodes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        node_index: activeNode,
        node_key: nodeDef.key,
        data: formData,
        completed: true,
      }),
    });

    const nextNode = activeNode + 1;
    const isLast = nextNode >= NODE_DEFINITIONS.length;

    // Update campaign's current_node
    await fetch(`/api/campaigns/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_node: isLast ? NODE_DEFINITIONS.length : nextNode,
        status: isLast ? "completed" : "in_progress",
      }),
    });

    // Update local state
    setSavedNodes((prev) => {
      const filtered = prev.filter((n) => n.node_index !== activeNode);
      return [...filtered, { node_index: activeNode, node_key: nodeDef.key, data: formData, completed: true }];
    });
    setCampaign((prev) => prev ? { ...prev, current_node: isLast ? NODE_DEFINITIONS.length : nextNode } : prev);

    if (!isLast) setActiveNode(nextNode);
    setSaving(false);
  }, [campaign, id, activeNode, nodeDef, formData]);

  const goBack = () => {
    if (activeNode > 0) setActiveNode(activeNode - 1);
  };

  if (!campaign) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: "var(--muted)", fontSize: 14 }}>
        Cargando...
      </div>
    );
  }

  const isCompleted = (idx: number) => savedNodes.some((n) => n.node_index === idx && n.completed);
  const isLast = activeNode === NODE_DEFINITIONS.length - 1;

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "0 24px", height: 52, display: "flex", alignItems: "center",
        gap: 12, flexShrink: 0,
      }}>
        <button
          onClick={() => router.push("/proyectos/dinamicas-catalogo")}
          style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 13, padding: 0 }}
        >
          ← Campañas
        </button>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{campaign.name}</span>
        <span style={{
          marginLeft: 4, fontSize: 11, fontWeight: 600,
          color: campaign.status === "completed" ? "#10B981" : "var(--dropi)",
          background: campaign.status === "completed" ? "#ECFDF5" : "#FFF3E0",
          padding: "2px 8px", borderRadius: 20,
        }}>
          Nodo {Math.min(activeNode + 1, NODE_DEFINITIONS.length)} de {NODE_DEFINITIONS.length}
        </span>
      </header>

      {/* Body */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* LEFT: Graph canvas */}
        <aside style={{
          width: 300,
          background: "#FAFAFA",
          backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          borderRight: "1px solid var(--border)",
          overflowY: "auto",
          flexShrink: 0,
          position: "relative",
        }}>
          <GraphCanvas
            nodes={NODE_DEFINITIONS}
            activeNode={activeNode}
            isCompleted={isCompleted}
            currentNode={campaign.current_node ?? 0}
            onSelect={(idx) => {
              const reachable = isCompleted(idx) || idx <= (campaign.current_node ?? 0) || idx === activeNode;
              if (reachable) setActiveNode(idx);
            }}
          />
        </aside>

        {/* RIGHT: Form panel */}
        <main style={{ flex: 1, overflowY: "auto", padding: "36px 40px" }}>
          {/* Node header */}
          <div style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: 14, padding: "20px 24px", marginBottom: 24,
            display: "flex", alignItems: "center", gap: 16,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14, flexShrink: 0,
              background: "#FFF3E0", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24,
            }}>
              {nodeDef.icon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "var(--dropi)",
                  background: "#FFF3E0", padding: "2px 8px", borderRadius: 20,
                }}>
                  Nodo {activeNode + 1} de {NODE_DEFINITIONS.length}
                </span>
              </div>
              <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
                {nodeDef.title}
              </h2>
              <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
                {nodeDef.description}
              </p>
            </div>
          </div>

          {/* Form fields */}
          <div style={{
            background: "#fff", border: "1px solid var(--border)",
            borderRadius: 14, padding: "28px 28px",
          }}>
            <NodeFormFields
              nodeDef={nodeDef}
              data={formData}
              onChange={(key, value) => setFormData((prev) => ({ ...prev, [key]: value }))}
            />

            {/* Actions */}
            <div style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--border)",
            }}>
              <button
                onClick={goBack}
                disabled={activeNode === 0}
                style={{
                  background: "var(--bg)", border: "1px solid var(--border)",
                  borderRadius: 9, padding: "10px 20px", fontSize: 13, fontWeight: 600,
                  cursor: activeNode === 0 ? "default" : "pointer",
                  color: activeNode === 0 ? "var(--muted)" : "var(--fg)",
                }}
              >
                ← Anterior
              </button>

              <button
                onClick={saveAndAdvance}
                disabled={saving}
                style={{
                  background: "var(--dropi)", color: "#fff", border: "none",
                  borderRadius: 9, padding: "10px 24px", fontSize: 13, fontWeight: 700,
                  cursor: saving ? "default" : "pointer",
                  opacity: saving ? 0.7 : 1,
                }}
              >
                {saving ? "Guardando..." : isLast ? "✓ Finalizar campaña" : "Avanzar →"}
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Graph canvas ───────────────────────────────────────────────
const NODE_W = 220;
const NODE_H = 64;
const GAP_Y = 48;
const PAD_X = 40;
const PAD_Y = 24;

function GraphCanvas({
  nodes,
  activeNode,
  isCompleted,
  currentNode,
  onSelect,
}: {
  nodes: typeof NODE_DEFINITIONS;
  activeNode: number;
  isCompleted: (idx: number) => boolean;
  currentNode: number;
  onSelect: (idx: number) => void;
}) {
  const totalH = PAD_Y * 2 + nodes.length * NODE_H + (nodes.length - 1) * GAP_Y;

  return (
    <svg
      width={NODE_W + PAD_X * 2}
      height={totalH}
      style={{ display: "block", minHeight: "100%" }}
    >
      {nodes.map((node, idx) => {
        const done = isCompleted(idx);
        const active = idx === activeNode;
        const reachable = done || idx <= currentNode || idx === activeNode;

        const x = PAD_X;
        const y = PAD_Y + idx * (NODE_H + GAP_Y);
        const cx = x + NODE_W / 2; // center x of node
        const topY = y;
        const botY = y + NODE_H;
        const midConnY = botY + GAP_Y / 2;

        const borderColor = done ? "#10B981" : active ? "#F77F00" : "#E5E7EB";
        const bgColor = active ? "#FFF3E0" : done ? "#F0FDF4" : "#ffffff";
        const textColor = active ? "#F77F00" : done ? "#111827" : reachable ? "#374151" : "#9CA3AF";
        const numBg = done ? "#10B981" : active ? "#F77F00" : "#E5E7EB";
        const numColor = done || active ? "#fff" : "#6B7280";

        return (
          <g key={node.key} style={{ cursor: reachable ? "pointer" : "default" }} onClick={() => onSelect(idx)}>
            {/* Connector to next node */}
            {idx < nodes.length - 1 && (
              <>
                <line
                  x1={cx} y1={botY}
                  x2={cx} y2={midConnY - 6}
                  stroke={done ? "#10B981" : "#E5E7EB"}
                  strokeWidth={2}
                />
                <polygon
                  points={`${cx},${midConnY + 6} ${cx - 5},${midConnY - 4} ${cx + 5},${midConnY - 4}`}
                  fill={done ? "#10B981" : "#D1D5DB"}
                />
                <line
                  x1={cx} y1={midConnY + 6}
                  x2={cx} y2={y + NODE_H + GAP_Y}
                  stroke={done ? "#10B981" : "#E5E7EB"}
                  strokeWidth={2}
                />
              </>
            )}

            {/* Node box shadow */}
            <rect
              x={x + 2} y={y + 3}
              width={NODE_W} height={NODE_H}
              rx={12} ry={12}
              fill="rgba(0,0,0,0.06)"
            />

            {/* Node box */}
            <rect
              x={x} y={y}
              width={NODE_W} height={NODE_H}
              rx={12} ry={12}
              fill={bgColor}
              stroke={borderColor}
              strokeWidth={active ? 2 : 1.5}
            />

            {/* Active glow */}
            {active && (
              <rect
                x={x - 3} y={y - 3}
                width={NODE_W + 6} height={NODE_H + 6}
                rx={15} ry={15}
                fill="none"
                stroke="#F77F00"
                strokeWidth={1}
                strokeOpacity={0.3}
              />
            )}

            {/* Number badge */}
            <circle cx={x + 26} cy={y + NODE_H / 2} r={13} fill={numBg} />
            <text
              x={x + 26} y={y + NODE_H / 2 + 1}
              textAnchor="middle" dominantBaseline="middle"
              fontSize={done ? 12 : 11} fontWeight={700} fill={numColor}
            >
              {done ? "✓" : idx + 1}
            </text>

            {/* Icon */}
            <text
              x={x + 50} y={y + NODE_H / 2 - 6}
              fontSize={16} dominantBaseline="middle"
            >
              {node.icon}
            </text>

            {/* Title */}
            <text
              x={x + 68} y={y + NODE_H / 2 - 8}
              fontSize={12} fontWeight={active ? 700 : 500}
              fill={textColor}
              style={{ maxWidth: "120px" }}
            >
              {node.title.length > 18 ? node.title.slice(0, 17) + "…" : node.title}
            </text>

            {/* Status label */}
            <text
              x={x + 68} y={y + NODE_H / 2 + 8}
              fontSize={10}
              fill={done ? "#10B981" : active ? "#F77F00" : "#9CA3AF"}
            >
              {done ? "Completado" : active ? "En progreso" : "Pendiente"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ── Condition builder ──────────────────────────────────────────
type ValueType = "boolean" | "number" | "select" | "relative_date" | "text";
interface FieldConfig { valueType: ValueType; options?: string[] }

const FIELD_CONFIG: Record<string, FieldConfig> = {
  "Supplier: País":                  { valueType: "select",        options: ["Colombia", "México", "Chile", "Ecuador", "Perú"] },
  "Supplier: Estado":                { valueType: "select",        options: ["Verificado", "Premium", "Exclusivo", "Estándar"] },
  "Supplier: Verificado":            { valueType: "boolean" },
  "Supplier: Tiene contacto válido": { valueType: "boolean" },
  "Supplier: Tiene productos activos":{ valueType: "boolean" },
  "Supplier: Alerta operativa crítica":{ valueType: "boolean" },
  "Supplier: Buen cumplimiento":     { valueType: "boolean" },
  "Supplier: Fecha de activación":   { valueType: "relative_date", options: ["últimos 7 días", "últimos 14 días", "últimos 30 días", "últimos 60 días", "últimos 90 días"] },
  "Supplier: Recomendado por comercial": { valueType: "boolean" },
  "Supplier: Estratégico":           { valueType: "boolean" },
  "Producto: Activo":                { valueType: "boolean" },
  "Producto: Stock":                 { valueType: "number" },
  "Producto: Tiene imagen":          { valueType: "boolean" },
  "Producto: Tiene precio vigente":  { valueType: "boolean" },
  "Producto: Ficha completa":        { valueType: "boolean" },
  "Producto: Categoría":             { valueType: "select",        options: ["Hogar", "Belleza", "Tecnología", "Cocina", "Salud", "Mascotas", "Bebé", "Deportes", "Herramientas", "Moda", "Juguetería", "Vehículos", "Otro"] },
  "Producto: Margen estimado (%)":   { valueType: "number" },
  "Producto: Órdenes últimos 30 días":{ valueType: "number" },
  "Producto: Órdenes últimos 60 días":{ valueType: "number" },
  "Producto: Órdenes últimos 90 días":{ valueType: "number" },
  "Producto: Baja rotación":         { valueType: "boolean" },
  "Producto: Recomendado por comercial": { valueType: "boolean" },
  "Producto: Potencial para pauta":  { valueType: "boolean" },
  "Producto: Alto margen":           { valueType: "boolean" },
  "Producto: Fuera de categoría":    { valueType: "boolean" },
  // Operativo
  "Operativo: Tiempo de despacho (h)": { valueType: "number" },
  "Operativo: Cancelaciones recientes (%)": { valueType: "number" },
  "Operativo: Novedades críticas":   { valueType: "boolean" },
  "Operativo: Riesgo de devolución": { valueType: "boolean" },
  "Operativo: Inconsistencias de inventario": { valueType: "boolean" },
  "Operativo: Supplier disponible para soporte": { valueType: "boolean" },
  // Campaña
  "Campaña: Descuento definido":     { valueType: "boolean" },
  "Campaña: Precio de campaña definido": { valueType: "boolean" },
  "Campaña: Vigencia de precio":     { valueType: "boolean" },
  "Campaña: Relación con temática":  { valueType: "boolean" },
  "Campaña: Supplier acepta participar": { valueType: "boolean" },
  "Campaña: Margen cumple mínimo":   { valueType: "boolean" },
};

const CONDITION_FIELDS = Object.keys(FIELD_CONFIG);

const OPERATORS_BY_TYPE: Record<ValueType, string[]> = {
  boolean:       ["es Sí", "es No"],
  number:        ["≥", "≤", "=", ">", "<", "≠"],
  select:        ["=", "≠"],
  relative_date: ["dentro de", "hace más de"],
  text:          ["=", "≠", "contiene"],
};

function getVT(field: string): ValueType { return FIELD_CONFIG[field]?.valueType ?? "text"; }
function getOps(field: string) { return OPERATORS_BY_TYPE[getVT(field)]; }

interface Condition { field: string; operator: string; value: string }
function parseConditions(raw: string): Condition[] {
  try { return JSON.parse(raw) ?? []; } catch { return []; }
}

function isImplicit(vt: ValueType) { return vt === "boolean"; }

function ValueInput({ field, operator, value, onChange }: {
  field: string; operator: string; value: string; onChange: (v: string) => void;
}) {
  const vt = getVT(field);
  const cfg = FIELD_CONFIG[field];
  const baseStyle: React.CSSProperties = {
    flex: 1, border: "1px solid var(--border)", borderRadius: 7,
    padding: "6px 10px", fontSize: 13, background: "#fff",
  };

  if (!field) return <div style={{ flex: 1 }} />;

  if (isImplicit(vt)) {
    return (
      <div style={{ flex: 1, fontSize: 12, color: "#9ca3af", fontStyle: "italic", padding: "6px 10px" }}>
        (sin valor — implícito en el operador)
      </div>
    );
  }

  if (vt === "number") {
    return (
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="ej. 20"
        style={baseStyle}
      />
    );
  }

  if (vt === "select" || vt === "relative_date") {
    return (
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ ...baseStyle, cursor: "pointer" }}>
        <option value="">Seleccionar...</option>
        {cfg?.options?.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Valor..."
      style={baseStyle}
    />
  );
}

function ConditionBuilder({ value, onChange, logic }: {
  value: string; onChange: (val: string) => void; logic: "AND" | "OR";
}) {
  const conditions = parseConditions(value);
  const [draft, setDraft] = useState<Condition>({ field: "", operator: "", value: "" });

  const save = (updated: Condition[]) => onChange(JSON.stringify(updated));

  const handleFieldChange = (field: string) => {
    const ops = getOps(field);
    setDraft({ field, operator: ops[0] ?? "=", value: "" });
  };

  const handleOperatorChange = (operator: string) => {
    setDraft((d) => ({ ...d, operator, value: "" }));
  };

  const add = () => {
    if (!draft.field) return;
    const vt = getVT(draft.field);
    const effectiveValue = isImplicit(vt) ? draft.operator : draft.value;
    save([...conditions, { field: draft.field, operator: draft.operator, value: effectiveValue }]);
    setDraft({ field: "", operator: "", value: "" });
  };

  const remove = (idx: number) => save(conditions.filter((_, i) => i !== idx));

  const logicColor = logic === "AND" ? "#1d4ed8" : "#7c3aed";
  const logicBg   = logic === "AND" ? "#eff6ff"  : "#f5f3ff";
  const canAdd = !!draft.field && (isImplicit(getVT(draft.field)) || !!draft.value);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {conditions.map((c, idx) => (
        <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {idx > 0
            ? <span style={{ fontSize: 10, fontWeight: 700, color: logicColor, background: logicBg, padding: "2px 7px", borderRadius: 6, flexShrink: 0, minWidth: 36, textAlign: "center" }}>{logic}</span>
            : <span style={{ width: 36, flexShrink: 0 }} />
          }
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "#f9fafb", border: "1px solid var(--border)", borderRadius: 9, padding: "9px 14px" }}>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{c.field}</span>
            <span style={{ fontSize: 12, color: logicColor, fontWeight: 700, flexShrink: 0 }}>{c.operator}</span>
            {c.value && <span style={{ fontSize: 13, color: "#111827" }}>{c.value}</span>}
            <button type="button" onClick={() => remove(idx)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 17, padding: 0, lineHeight: 1 }}>×</button>
          </div>
        </div>
      ))}

      {/* Add row */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 6 }}>
        <span style={{ width: 36, flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", gap: 6, alignItems: "center", background: "#fff", border: "1.5px dashed var(--border)", borderRadius: 9, padding: "8px 10px" }}>
          {/* Field */}
          <select
            value={draft.field}
            onChange={(e) => handleFieldChange(e.target.value)}
            style={{ flex: 2, border: "1px solid var(--border)", borderRadius: 7, padding: "6px 10px", fontSize: 13, background: "#fff", cursor: "pointer" }}
          >
            <option value="">Campo...</option>
            <optgroup label="Supplier">
              {CONDITION_FIELDS.filter(f => f.startsWith("Supplier:")).map(f => <option key={f} value={f}>{f.replace("Supplier: ", "")}</option>)}
            </optgroup>
            <optgroup label="Producto">
              {CONDITION_FIELDS.filter(f => f.startsWith("Producto:")).map(f => <option key={f} value={f}>{f.replace("Producto: ", "")}</option>)}
            </optgroup>
            <optgroup label="Operativo">
              {CONDITION_FIELDS.filter(f => f.startsWith("Operativo:")).map(f => <option key={f} value={f}>{f.replace("Operativo: ", "")}</option>)}
            </optgroup>
            <optgroup label="Campaña">
              {CONDITION_FIELDS.filter(f => f.startsWith("Campaña:")).map(f => <option key={f} value={f}>{f.replace("Campaña: ", "")}</option>)}
            </optgroup>
          </select>

          {/* Operator — only shown when field is selected */}
          {draft.field && (
            <select
              value={draft.operator}
              onChange={(e) => handleOperatorChange(e.target.value)}
              style={{ flex: "0 0 auto", minWidth: 90, border: "1px solid var(--border)", borderRadius: 7, padding: "6px 8px", fontSize: 13, background: "#fff", cursor: "pointer" }}
            >
              {getOps(draft.field).map(op => <option key={op} value={op}>{op}</option>)}
            </select>
          )}

          {/* Value — adaptive */}
          {draft.field && (
            <ValueInput
              field={draft.field}
              operator={draft.operator}
              value={draft.value}
              onChange={(v) => setDraft(d => ({ ...d, value: v }))}
            />
          )}

          <button
            type="button"
            onClick={add}
            disabled={!canAdd}
            style={{ background: canAdd ? "var(--dropi)" : "#e5e7eb", color: canAdd ? "#fff" : "#9ca3af", border: "none", borderRadius: 7, padding: "6px 14px", fontSize: 13, fontWeight: 700, cursor: canAdd ? "pointer" : "default", flexShrink: 0, transition: "all 0.12s" }}
          >+ Agregar</button>
        </div>
      </div>

      {conditions.length === 0 && (
        <p style={{ fontSize: 12, color: "#9ca3af", marginLeft: 42 }}>Sin condiciones todavía.</p>
      )}
    </div>
  );
}

// ── Multi-select chip picker ────────────────────────────────────
function MultiSelect({
  options,
  value,
  onChange,
  ranked,
}: {
  options: string[];
  value: string;
  onChange: (val: string) => void;
  ranked?: boolean;
}) {
  const selected = value ? value.split("||") : [];

  const toggle = (opt: string) => {
    const next = selected.includes(opt)
      ? selected.filter((s) => s !== opt)
      : [...selected, opt];
    onChange(next.join("||"));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {/* Selected chips with rank badges */}
      {ranked && selected.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {selected.map((opt, idx) => (
            <div key={opt} style={{ display: "flex", alignItems: "center", gap: 5,
              background: "#FFF3E0", border: "1.5px solid var(--dropi)",
              borderRadius: 20, padding: "5px 12px",
            }}>
              <span style={{
                fontSize: 10, fontWeight: 800, color: "#fff",
                background: idx === 0 ? "var(--dropi)" : "#bbb",
                borderRadius: 10, padding: "1px 6px", flexShrink: 0,
              }}>
                {idx === 0 ? "Principal" : "Secundario"}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dropi)" }}>{opt}</span>
              <button type="button" onClick={() => toggle(opt)}
                style={{ background: "none", border: "none", cursor: "pointer",
                  color: "#F77F0080", fontSize: 15, padding: 0, lineHeight: 1 }}>×</button>
            </div>
          ))}
        </div>
      )}

      {/* All options */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              style={{
                padding: "7px 14px",
                borderRadius: 20,
                border: `1.5px solid ${active ? (ranked ? "transparent" : "var(--dropi)") : "var(--border)"}`,
                background: active ? (ranked ? "#f0f0f0" : "#FFF3E0") : "#fff",
                color: active ? (ranked ? "#999" : "var(--dropi)") : "var(--muted)",
                fontSize: 13,
                fontWeight: active ? 700 : 400,
                cursor: "pointer",
                transition: "all 0.12s",
                textDecoration: active && ranked ? "line-through" : "none",
              }}
            >
              {active && !ranked && <span style={{ marginRight: 5 }}>✓</span>}
              {opt}
            </button>
          );
        })}
      </div>

      {ranked && selected.length === 0 && (
        <p style={{ fontSize: 12, color: "#9ca3af" }}>
          El primero que selecciones será el canal principal; los siguientes quedan como secundarios.
        </p>
      )}
    </div>
  );
}

// ── Form renderer ──────────────────────────────────────────────
function NodeFormFields({
  nodeDef,
  data,
  onChange,
}: {
  nodeDef: (typeof NODE_DEFINITIONS)[number];
  data: NodeData;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div style={{ display: "grid", gap: 20 }}>
      {nodeDef.fields.map((field) => (
        <div key={field.key}>
          <label style={{
            display: "block", fontSize: 12, fontWeight: 700,
            color: "var(--fg)", marginBottom: 8,
          }}>
            {field.label}
            {field.required && <span style={{ color: "var(--dropi)", marginLeft: 3 }}>*</span>}
          </label>

          {field.hint && (
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 8, lineHeight: 1.4 }}>
              {field.hint}
            </p>
          )}

          {field.type === "text" && (
            <input
              value={data[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              style={{
                width: "100%", border: "1px solid var(--border)", borderRadius: 9,
                padding: "10px 14px", fontSize: 14, outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--dropi)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          )}

          {field.type === "textarea" && (
            <textarea
              value={data[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              style={{
                width: "100%", border: "1px solid var(--border)", borderRadius: 9,
                padding: "10px 14px", fontSize: 14, outline: "none",
                resize: "vertical", fontFamily: "inherit",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--dropi)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          )}

          {field.type === "select" && (
            <>
              <select
                value={data[field.key] ?? ""}
                onChange={(e) => onChange(field.key, e.target.value)}
                style={{
                  width: "100%", border: "1px solid var(--border)", borderRadius: 9,
                  padding: "10px 14px", fontSize: 14, outline: "none",
                  background: "#fff", cursor: "pointer",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--dropi)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <option value="">Seleccionar...</option>
                {field.options?.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              {field.optionDescriptions && data[field.key] && field.optionDescriptions[data[field.key]] && (
                <div style={{
                  marginTop: 8, padding: "10px 14px",
                  background: "#FFF8F0", border: "1px solid #F77F0030",
                  borderRadius: 9, fontSize: 13, color: "#7a4f1e", lineHeight: 1.5,
                }}>
                  {field.optionDescriptions[data[field.key]]}
                </div>
              )}
            </>
          )}

          {field.type === "multiselect" && (
            <MultiSelect
              options={field.options ?? []}
              value={data[field.key] ?? ""}
              onChange={(val) => onChange(field.key, val)}
              ranked={field.ranked}
            />
          )}

          {field.type === "date" && (
            <input
              type="date"
              value={data[field.key] ?? ""}
              onChange={(e) => onChange(field.key, e.target.value)}
              style={{
                width: "100%", border: "1px solid var(--border)", borderRadius: 9,
                padding: "10px 14px", fontSize: 14, outline: "none",
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--dropi)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
            />
          )}

          {field.type === "dates_group" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {field.subfields?.map((sf) => (
                <div key={sf.key}>
                  <label style={{ fontSize: 11, color: "var(--muted)", display: "block", marginBottom: 6 }}>
                    {sf.label}
                  </label>
                  <input
                    type="date"
                    value={data[sf.key] ?? ""}
                    onChange={(e) => onChange(sf.key, e.target.value)}
                    style={{
                      width: "100%", border: "1px solid var(--border)", borderRadius: 9,
                      padding: "9px 12px", fontSize: 13, outline: "none",
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "var(--dropi)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                  />
                </div>
              ))}
            </div>
          )}

          {field.type === "condition_builder" && (
            <ConditionBuilder
              value={data[field.key] ?? ""}
              onChange={(val) => onChange(field.key, val)}
              logic={field.conditionLogic ?? "AND"}
            />
          )}

          {field.type === "static" && (
            <div style={{
              background: "#FFF3E0", border: "1px solid #F77F0030",
              borderRadius: 9, padding: "10px 14px", fontSize: 14,
              color: "var(--dropi)", fontWeight: 600,
            }}>
              {field.value}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
