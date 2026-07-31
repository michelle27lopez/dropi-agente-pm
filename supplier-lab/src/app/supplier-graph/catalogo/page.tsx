"use client";

import "@xyflow/react/dist/style.css";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { X, Search, Download, RefreshCw, TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type CatalogNodeType = "capacidad" | "friccion" | "investigacion" | "datos" | "contexto";
type HealthStatus = "good" | "warning" | "critical" | "neutral";
type EdgeRelation = "enables" | "feeds" | "impacts" | "measures" | "requires";

interface CatalogNodeData extends Record<string, unknown> {
  label: string;
  nodeType: CatalogNodeType;
  description: string;
  originalId: string;
  value?: string;
  unit?: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  health?: HealthStatus;
  interpretation?: string;
}

interface CatalogEdgeData extends Record<string, unknown> {
  relationType: EdgeRelation;
}

// ─── Colors ───────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<CatalogNodeType, string> = {
  capacidad:     "#3b82f6",
  friccion:      "#ef4444",
  investigacion: "#a855f7",
  datos:         "#10b981",
  contexto:      "#f97316",
};

const HEALTH_COLORS: Record<HealthStatus, string> = {
  good:     "#10b981",
  warning:  "#f59e0b",
  critical: "#ef4444",
  neutral:  "#52525b",
};

const EDGE_COLORS: Record<EdgeRelation, string> = {
  enables:  "#10b981",
  feeds:    "#3b82f6",
  impacts:  "#ef4444",
  measures: "#a855f7",
  requires: "#f97316",
};

const TYPE_LABELS: Record<CatalogNodeType, string> = {
  capacidad:     "Capacidad del Sistema",
  friccion:      "Fricción",
  investigacion: "Investigación",
  datos:         "Datos",
  contexto:      "Contexto",
};

// ─── Layer Groups ─────────────────────────────────────────────────────────────

const LAYER_GROUPS = {
  capacidades:   { label: "Capacidades",   types: ["capacidad"]     as CatalogNodeType[], color: "#3b82f6", defaultOn: true },
  fricciones:    { label: "Fricciones",    types: ["friccion"]      as CatalogNodeType[], color: "#ef4444", defaultOn: true },
  investigacion: { label: "Investigación", types: ["investigacion"] as CatalogNodeType[], color: "#a855f7", defaultOn: true },
  datos:         { label: "Datos",         types: ["datos"]         as CatalogNodeType[], color: "#10b981", defaultOn: true },
  contexto:      { label: "Contexto",      types: ["contexto"]      as CatalogNodeType[], color: "#f97316", defaultOn: true },
} as const;

type LayerKey = keyof typeof LAYER_GROUPS;

// ─── Raw Catalog Data · 1,000,000 productos simulados ─────────────────────────

const RAW_NODES: Array<{
  id: string; label: string; type: CatalogNodeType;
  description: string; value?: string; unit?: string;
  trend?: "up" | "down" | "stable"; trendValue?: string;
  health?: HealthStatus; interpretation?: string;
  x: number; y: number;
}> = [
  {
    id: "pulso_catalogo",
    label: "Pulso vivo del catálogo",
    type: "capacidad",
    description: "Representa la salud dinámica y sistémica del catálogo en su conjunto. Integra señales de oferta, demanda, calidad y operación para dar una lectura general. No analiza un producto individual, sino el pulso colectivo que permite tomar decisiones estratégicas.",
    value: "67", unit: "/ 100 · Salud Media",
    trend: "up", trendValue: "+3 vs mes ant.",
    health: "warning",
    interpretation: "El catálogo tiene salud media. La mitad (500K productos) es ruido sin valor real. El potencial dormido (248K) es la mayor oportunidad inmediata si se activa con visibilidad y adopción dropshipper.",
    x: 0, y: 0,
  },

  // ── Dimensiones del score (inputs, lado izquierdo) ────────────────────────
  {
    id: "completitud",
    label: "Completitud",
    type: "datos",
    description: "Porcentaje de productos con ficha completa: título, descripción, imágenes, precio, categoría y atributos requeridos.",
    value: "61%", unit: "de completitud promedio",
    trend: "up", trendValue: "+5pp",
    health: "warning",
    interpretation: "El 39% del catálogo tiene fichas incompletas. Más afectadas: Hogar (48%), Electrónica (52%), Moda (55%). Completar estas fichas puede mover ~156K productos al estado activo.",
    x: -430, y: -180,
  },
  {
    id: "stock",
    label: "Stock",
    type: "datos",
    description: "Porcentaje de productos con stock disponible para venta en este momento.",
    value: "740K", unit: "productos con stock (74%)",
    trend: "stable", trendValue: "→ estable",
    health: "good",
    interpretation: "740,000 productos con stock disponible. El 26% sin stock: agotado temporal (61%), descontinuado (24%), en revisión (15%). La tasa de quiebre en top 1,000 es 8%.",
    x: -460, y: 0,
  },
  {
    id: "demanda",
    label: "Demanda",
    type: "datos",
    description: "Porcentaje de productos que generaron al menos una venta en los últimos 30 días.",
    value: "380K", unit: "productos con ventas (38%)",
    trend: "up", trendValue: "+6pp",
    health: "warning",
    interpretation: "Solo el 38% generó ventas en 30 días. El 62% sin ventas no implica que no haya demanda — 124K tienen señales latentes. Los 380K activos concentran el 97% del GMV.",
    x: -420, y: 200,
  },
  {
    id: "operacion",
    label: "Operación",
    type: "datos",
    description: "Porcentaje de órdenes completadas sin incidentes operativos en los últimos 30 días.",
    value: "82%", unit: "sin incidentes operativos",
    trend: "up", trendValue: "+2pp",
    health: "good",
    interpretation: "El 82% de las órdenes se completan sin fricción. Incidentes restantes: devoluciones (8%), reclamos de calidad (5%), errores logísticos (3%), garantías activas (2%).",
    x: -320, y: 380,
  },
  {
    id: "senales_mercado",
    label: "Señales de mercado",
    type: "investigacion",
    description: "Tendencias activas de búsqueda, categorías en crecimiento y oportunidades identificadas externamente que impactan el catálogo.",
    value: "14", unit: "tendencias activas",
    trend: "up", trendValue: "+4 nuevas",
    health: "good",
    interpretation: "14 tendencias activas alineadas con el catálogo: Belleza natural (+38%), Organización hogar (+29%), Fitness en casa (+24%), Eco-friendly (+21%). 4 tendencias sin representación sólida.",
    x: -290, y: -380,
  },

  // ── Actores / contexto (top, bidireccionales) ─────────────────────────────
  {
    id: "adopcion_dropshipper",
    label: "Adopción dropshipper",
    type: "contexto",
    description: "Promedio de dropshippers activos que ofrecen cada producto. Indica nivel de distribución y adopción en la red.",
    value: "1.4", unit: "drops activos / producto",
    trend: "up", trendValue: "+0.2",
    health: "warning",
    interpretation: "Activos sanos tienen 4.2 drops/producto. El potencial dormido tiene 0.8. Aumentar adopción en ese segmento es la palanca más directa para activar el catálogo dormido.",
    x: -130, y: -430,
  },
  {
    id: "suppliers_fuertes",
    label: "Suppliers fuertes",
    type: "contexto",
    description: "Suppliers con catálogo sano: alta completitud, stock estable, bajo nivel de reclamos y buen historial de ventas.",
    value: "312", unit: "de 1,847 activos (17%)",
    trend: "stable", trendValue: "→ estable",
    health: "warning",
    interpretation: "312 suppliers (17%) tienen catálogo sano y concentran el 64% del GMV. Los 1,535 restantes tienen al menos una dimensión débil: stock bajo (52%), contenido incompleto (38%), alta tasa de reclamos (10%).",
    x: 60, y: -450,
  },
  {
    id: "categorias_fuertes",
    label: "Categorías fuertes",
    type: "contexto",
    description: "Categorías con alta demanda, buena completitud, stock estable y bajo nivel de fricciones.",
    value: "7", unit: "de 23 categorías",
    trend: "up", trendValue: "+1",
    health: "good",
    interpretation: "7 categorías lideran: Belleza & Cuidado, Hogar & Deco, Deportes, Tecnología Básica, Moda Mujer, Bebé y Mascotas. Concentran el 71% de las ventas. 4 categorías en alerta por alto ruido.",
    x: 260, y: -410,
  },

  // ── Salidas de salud (derecha) ────────────────────────────────────────────
  {
    id: "activos_sanos",
    label: "Activos sanos",
    type: "datos",
    description: "Productos que venden, tienen stock, buen margen, buen contenido y baja fricción operativa.",
    value: "183K", unit: "productos (18.3%)",
    trend: "up", trendValue: "+12%",
    health: "good",
    interpretation: "183,200 productos cumplen todos los criterios de salud. Son el motor del GMV. Meta del trimestre: crecer este grupo a 220K activando potencial dormido.",
    x: 380, y: -290,
  },
  {
    id: "atractivo_comercial",
    label: "Atractivo comercial",
    type: "investigacion",
    description: "Score compuesto: margen promedio, competitividad de precio, visibilidad en búsquedas y tasa de conversión.",
    value: "5.8", unit: "/ 10 · score comercial",
    trend: "up", trendValue: "+0.4",
    health: "warning",
    interpretation: "Margen promedio 34% (bueno), competitividad precio 6.2/10, visibilidad búsqueda 5.1/10, conversión 3.2% (baja). La conversión baja es el principal área de mejora.",
    x: 490, y: -160,
  },
  {
    id: "activos_riesgo",
    label: "Activos en riesgo",
    type: "friccion",
    description: "Productos con demanda o ventas, pero que generan fricciones: reclamos, devoluciones, quiebres de stock o fallas operativas.",
    value: "68K", unit: "productos (6.8%)",
    trend: "down", trendValue: "-4%",
    health: "critical",
    interpretation: "68,400 productos generan ventas y fricciones. Causas: quiebres de stock (41%), reclamos de calidad (31%), problemas de entrega (18%), garantías activas (10%).",
    x: 470, y: -30,
  },
  {
    id: "demanda_probable",
    label: "Demanda probable",
    type: "investigacion",
    description: "Productos sin ventas recientes pero con señales de demanda: búsquedas en plataforma, wishlist, comparaciones de precio.",
    value: "124K", unit: "con señal latente",
    trend: "up", trendValue: "+11%",
    health: "good",
    interpretation: "124,500 productos sin ventas en 30d tienen señales latentes. El 48% está en potencial dormido. Se estima que el 22% convertiría si se activa con visibilidad en las próximas 4 semanas.",
    x: 460, y: 120,
  },
  {
    id: "potencial_dormido",
    label: "Potencial dormido",
    type: "datos",
    description: "Productos completos y operables que no despegan por baja visibilidad, poca adopción de dropshippers o bajo posicionamiento.",
    value: "248K", unit: "productos (24.8%)",
    trend: "stable", trendValue: "→ sin cambio",
    health: "warning",
    interpretation: "248,400 productos listos pero sin activar. El 63% tiene stock, el 78% tiene contenido completo. Activar el top 10% (24,840) representa el mayor ROI inmediato para Supplier Success.",
    x: 430, y: 260,
  },
  {
    id: "ruido_catalogo",
    label: "Ruido de catálogo",
    type: "friccion",
    description: "Productos que existen pero no aportan valor: duplicados, incompletos, sin stock, irrelevantes o mal configurados.",
    value: "500K", unit: "productos (50.1%)",
    trend: "down", trendValue: "-8% trim.",
    health: "critical",
    interpretation: "500,000 productos sin valor real. Distribución: sin stock activo (38%), contenido incompleto (29%), sin ventas históricas (22%), duplicados/mal configurados (11%). Reducirlo un 20% libera capacidad operativa significativa.",
    x: 350, y: 400,
  },

  // ── Oportunidad y resultado (abajo) ───────────────────────────────────────
  {
    id: "oportunidades_crecimiento",
    label: "Oportunidades de crecimiento",
    type: "datos",
    description: "Productos del potencial dormido con señales de demanda que podrían activarse con visibilidad o adopción dropshipper.",
    value: "248K", unit: "productos activables",
    trend: "up", trendValue: "↑ alta prioridad",
    health: "good",
    interpretation: "Activar solo el top 10% del potencial dormido (24,840 productos) estima un +18% en GMV del catálogo el próximo trimestre.",
    x: 150, y: 460,
  },
  {
    id: "disponibilidad",
    label: "Disponibilidad",
    type: "datos",
    description: "Porcentaje de productos disponibles para ordenar ahora mismo (stock, precio activo y sin bloqueos).",
    value: "74%", unit: "· 740K disponibles hoy",
    trend: "stable", trendValue: "→ estable",
    health: "good",
    interpretation: "740,000 productos disponibles para generar órdenes ahora. El 26% bloqueado: sin stock (68%), precio inactivo (18%), en revisión (14%).",
    x: -90, y: 470,
  },
  {
    id: "orden_sana",
    label: "Orden sana",
    type: "datos",
    description: "Porcentaje de órdenes completadas sin devoluciones, reclamos ni incidentes logísticos en los últimos 30 días.",
    value: "76%", unit: "sin incidente (30d)",
    trend: "up", trendValue: "+3pp",
    health: "good",
    interpretation: "El 76% de las órdenes se completan sin ningún incidente. El 24% con fricción: devoluciones (10%), reclamos (8%), problemas logísticos (6%).",
    x: -310, y: 400,
  },
];

const RAW_EDGES: Array<{ id: string; source: string; target: string; type: EdgeRelation }> = [
  // Inputs → pulso_catalogo
  { id: "e1",  source: "completitud",            target: "pulso_catalogo",           type: "feeds"   },
  { id: "e2",  source: "stock",                  target: "pulso_catalogo",           type: "feeds"   },
  { id: "e3",  source: "demanda",                target: "pulso_catalogo",           type: "feeds"   },
  { id: "e4",  source: "operacion",              target: "pulso_catalogo",           type: "feeds"   },
  { id: "e5",  source: "senales_mercado",        target: "pulso_catalogo",           type: "feeds"   },
  { id: "e6",  source: "adopcion_dropshipper",   target: "pulso_catalogo",           type: "feeds"   },
  { id: "e7",  source: "suppliers_fuertes",      target: "pulso_catalogo",           type: "feeds"   },
  { id: "e8",  source: "categorias_fuertes",     target: "pulso_catalogo",           type: "feeds"   },
  { id: "e9",  source: "orden_sana",             target: "pulso_catalogo",           type: "feeds"   },
  // pulso_catalogo → outputs
  { id: "e10", source: "pulso_catalogo",         target: "activos_sanos",            type: "enables" },
  { id: "e11", source: "pulso_catalogo",         target: "activos_riesgo",           type: "impacts" },
  { id: "e12", source: "pulso_catalogo",         target: "potencial_dormido",        type: "enables" },
  { id: "e13", source: "pulso_catalogo",         target: "ruido_catalogo",           type: "impacts" },
  { id: "e14", source: "pulso_catalogo",         target: "oportunidades_crecimiento",type: "enables" },
  { id: "e15", source: "pulso_catalogo",         target: "disponibilidad",           type: "enables" },
  { id: "e16", source: "pulso_catalogo",         target: "atractivo_comercial",      type: "enables" },
  { id: "e17", source: "pulso_catalogo",         target: "demanda_probable",         type: "measures"},
  // Cross-connections
  { id: "e18", source: "potencial_dormido",      target: "oportunidades_crecimiento",type: "enables" },
  { id: "e19", source: "demanda",                target: "demanda_probable",         type: "feeds"   },
  { id: "e20", source: "senales_mercado",        target: "atractivo_comercial",      type: "feeds"   },
  { id: "e21", source: "operacion",             target: "orden_sana",               type: "measures"},
  { id: "e22", source: "activos_sanos",          target: "orden_sana",               type: "enables" },
];

// ─── Custom Node ──────────────────────────────────────────────────────────────

function CatalogNode({ data, selected }: NodeProps<Node<CatalogNodeData>>) {
  const typeColor = TYPE_COLORS[data.nodeType] ?? "#64748b";
  const healthColor = data.health ? HEALTH_COLORS[data.health] : "#52525b";
  const isCenter = data.originalId === "pulso_catalogo";

  const TrendIcon =
    data.trend === "up" ? TrendingUp : data.trend === "down" ? TrendingDown : Minus;
  const trendColor =
    data.trend === "up" ? "#10b981" : data.trend === "down" ? "#ef4444" : "#71717a";

  return (
    <div
      style={{
        outline: selected ? `2px solid ${typeColor}` : "none",
        outlineOffset: "4px",
        borderRadius: isCenter ? "20px" : "14px",
      }}
    >
      <Handle type="target" position={Position.Top}  style={{ background: typeColor, width: 6, height: 6, opacity: 0.7 }} />
      <Handle type="target" position={Position.Left} style={{ background: typeColor, width: 6, height: 6, opacity: 0.7 }} id="tl" />

      <div
        style={{
          position: "relative",
          background: "#0e0e18",
          border: `1.5px solid ${healthColor}`,
          borderRadius: isCenter ? "20px" : "14px",
          padding: isCenter ? "16px 22px" : "10px 14px",
          minWidth: isCenter ? "190px" : "155px",
          maxWidth: isCenter ? "220px" : "190px",
          boxShadow: selected
            ? `0 0 0 2px ${typeColor}44, 0 0 28px ${typeColor}33, 0 4px 20px rgba(0,0,0,0.6)`
            : `0 0 18px ${healthColor}18, 0 2px 10px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Health dot */}
        <div
          style={{
            position: "absolute", top: 8, right: 8,
            width: 7, height: 7, borderRadius: "50%",
            background: healthColor,
            boxShadow: `0 0 8px ${healthColor}`,
          }}
        />

        {/* Type badge */}
        <span
          style={{
            display: "inline-block", marginBottom: 6,
            fontSize: 8, fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.08em", color: typeColor,
            background: `${typeColor}18`, padding: "2px 6px", borderRadius: 4,
          }}
        >
          {TYPE_LABELS[data.nodeType]}
        </span>

        {/* Label */}
        <p
          style={{
            color: "#e2e8f0",
            fontSize: isCenter ? 12 : 10,
            fontWeight: 600,
            lineHeight: 1.3,
            marginBottom: isCenter ? 10 : 6,
          }}
        >
          {data.label}
        </p>

        {/* Value */}
        {data.value && (
          <p
            style={{
              color: "#ffffff",
              fontSize: isCenter ? 30 : 22,
              fontWeight: 800,
              lineHeight: 1,
              marginBottom: 4,
              letterSpacing: "-0.5px",
            }}
          >
            {data.value}
          </p>
        )}

        {/* Unit + trend */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
          {data.unit && (
            <span style={{ color: "#71717a", fontSize: 9, lineHeight: 1.3 }}>
              {data.unit}
            </span>
          )}
          {data.trendValue && (
            <span
              style={{
                color: trendColor, fontSize: 9, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 2,
              }}
            >
              <TrendIcon style={{ width: 9, height: 9 }} />
              {data.trendValue}
            </span>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} style={{ background: typeColor, width: 6, height: 6, opacity: 0.7 }} />
      <Handle type="source" position={Position.Right}  style={{ background: typeColor, width: 6, height: 6, opacity: 0.7 }} id="sr" />
    </div>
  );
}

// ─── Custom Edge ──────────────────────────────────────────────────────────────

function CatalogEdge({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, markerEnd, selected,
}: EdgeProps<Edge<CatalogEdgeData>>) {
  const relationType = (data?.relationType ?? "feeds") as EdgeRelation;
  const color = EDGE_COLORS[relationType] ?? "#64748b";

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id} path={edgePath} markerEnd={markerEnd}
        style={{ stroke: color, strokeWidth: selected ? 2.5 : 1.5, strokeOpacity: 0.65 }}
      />
      {selected && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%,-50%) translate(${labelX}px,${labelY}px)`,
              pointerEvents: "all",
            }}
            className="nodrag nopan"
          >
            <span
              style={{
                background: `${color}22`, border: `1px solid ${color}55`,
                color, fontSize: 8, padding: "2px 5px",
                borderRadius: 4, fontWeight: 700, whiteSpace: "nowrap",
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

const nodeTypes = { catalogNode: CatalogNode };
const edgeTypes = { catalogEdge: CatalogEdge };

// ─── Detail Panel ─────────────────────────────────────────────────────────────

interface DetailPanelProps {
  node: CatalogNodeData & { id: string };
  edges: Edge<CatalogEdgeData>[];
  allNodes: Node<CatalogNodeData>[];
  onClose: () => void;
  onNavigate: (id: string) => void;
}

function DetailPanel({ node, edges, allNodes, onClose, onNavigate }: DetailPanelProps) {
  const typeColor = TYPE_COLORS[node.nodeType] ?? "#64748b";
  const healthColor = node.health ? HEALTH_COLORS[node.health] : "#52525b";
  const TrendIcon =
    node.trend === "up" ? TrendingUp : node.trend === "down" ? TrendingDown : Minus;
  const trendColor =
    node.trend === "up" ? "#10b981" : node.trend === "down" ? "#ef4444" : "#71717a";

  const outgoing = edges
    .filter((e) => e.source === node.id)
    .map((e) => ({
      id: e.target,
      label: allNodes.find((n) => n.id === e.target)?.data?.label ?? e.target,
      relation: (e.data?.relationType as string) ?? "—",
      color: EDGE_COLORS[(e.data?.relationType as EdgeRelation)] ?? "#64748b",
    }));

  const incoming = edges
    .filter((e) => e.target === node.id)
    .map((e) => ({
      id: e.source,
      label: allNodes.find((n) => n.id === e.source)?.data?.label ?? e.source,
      relation: (e.data?.relationType as string) ?? "—",
      color: EDGE_COLORS[(e.data?.relationType as EdgeRelation)] ?? "#64748b",
    }));

  return (
    <div className="w-72 flex-shrink-0 h-full bg-zinc-900 border-r border-zinc-800 overflow-y-auto flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between p-4 border-b border-zinc-800 gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div
              style={{
                width: 8, height: 8, borderRadius: "50%",
                background: healthColor, boxShadow: `0 0 6px ${healthColor}`, flexShrink: 0,
              }}
            />
            <h2 className="text-white font-bold text-sm leading-tight">{node.label}</h2>
          </div>
          <span
            className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: `${typeColor}22`, color: typeColor }}
          >
            {TYPE_LABELS[node.nodeType]}
          </span>
        </div>
        <button onClick={onClose} className="flex-shrink-0 text-zinc-400 hover:text-white mt-0.5">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Metric block */}
      {node.value && (
        <div className="p-4 border-b border-zinc-800" style={{ background: `${typeColor}08` }}>
          <p
            style={{
              color: "#ffffff", fontSize: 38, fontWeight: 800,
              lineHeight: 1, letterSpacing: "-1px",
            }}
          >
            {node.value}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
            {node.unit && (
              <span style={{ color: "#94a3b8", fontSize: 11 }}>{node.unit}</span>
            )}
            {node.trendValue && (
              <span
                style={{
                  color: trendColor, fontSize: 10, fontWeight: 700,
                  display: "flex", alignItems: "center", gap: 3,
                }}
              >
                <TrendIcon style={{ width: 10, height: 10 }} />
                {node.trendValue}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Description */}
      <div className="p-4 border-b border-zinc-800">
        <p className="text-zinc-400 text-xs leading-relaxed">{node.description}</p>
      </div>

      {/* Interpretation */}
      {node.interpretation && (
        <div className="p-4 border-b border-zinc-800">
          <h3 className="text-zinc-500 text-[10px] uppercase tracking-widest font-semibold mb-2">
            Lectura estratégica
          </h3>
          <p className="text-zinc-300 text-xs leading-relaxed">{node.interpretation}</p>
        </div>
      )}

      {/* Outgoing */}
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

      {/* Incoming */}
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

function ExportModal({ onClose }: { onClose: () => void }) {
  const json = JSON.stringify({ nodes: RAW_NODES, edges: RAW_EDGES }, null, 2);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl mx-4">
        <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-700">
          <span className="text-white font-semibold text-sm">catalogo-graph-v1.json</span>
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

// ─── Main Component ───────────────────────────────────────────────────────────

function CatalogGraph() {
  const { fitView } = useReactFlow();
  const [search, setSearch] = useState("");
  const [activeLayers, setActiveLayers] = useState<Set<LayerKey>>(
    () => new Set(Object.keys(LAYER_GROUPS) as LayerKey[])
  );
  const [panelNodeId, setPanelNodeId] = useState<string | null>("pulso_catalogo");
  const [focusedNodeId, setFocusedNodeId] = useState<string | null>(null);
  const [showExport, setShowExport] = useState(false);
  const [snapshotDate, setSnapshotDate] = useState<string | null>(null);
  const [dataSource, setDataSource] = useState<"mock" | "live">("mock");

  const initialNodes: Node<CatalogNodeData>[] = useMemo(
    () =>
      RAW_NODES.map((n) => ({
        id: n.id,
        type: "catalogNode",
        position: { x: n.x, y: n.y },
        data: {
          label: n.label,
          nodeType: n.type,
          description: n.description,
          originalId: n.id,
          value: n.value,
          unit: n.unit,
          trend: n.trend,
          trendValue: n.trendValue,
          health: n.health,
          interpretation: n.interpretation,
        },
      })),
    []
  );

  const initialEdges: Edge<CatalogEdgeData>[] = useMemo(
    () =>
      RAW_EDGES.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        type: "catalogEdge",
        data: { relationType: e.type },
      })),
    []
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  useEffect(() => {
    fetch("/api/catalog/metrics")
      .then((r) => r.json())
      .then((res: { metrics?: Array<Record<string, unknown>>; snapshot_date?: string }) => {
        if (!res.metrics?.length) return;
        const metricMap = Object.fromEntries(res.metrics.map((m) => [m.node_id as string, m]));
        setNodes((prev) =>
          prev.map((n) => {
            const m = metricMap[n.id];
            if (!m) return n;
            return {
              ...n,
              data: {
                ...n.data,
                ...(m.value_display != null && { value: m.value_display as string }),
                ...(m.unit != null && { unit: m.unit as string }),
                ...(m.trend != null && { trend: m.trend as "up" | "down" | "stable" }),
                ...(m.trend_value != null && { trendValue: m.trend_value as string }),
                ...(m.health != null && { health: m.health as HealthStatus }),
                ...(m.breakdown != null &&
                  typeof m.breakdown === "object" &&
                  "interpretacion" in (m.breakdown as Record<string, unknown>) && {
                    interpretation: (m.breakdown as Record<string, unknown>).interpretacion as string,
                  }),
              },
            };
          })
        );
        if (res.snapshot_date) {
          setSnapshotDate(res.snapshot_date);
          setDataSource("live");
        }
      })
      .catch(() => {});
  }, [setNodes]);

  const activeTypes = useMemo(
    () => new Set([...activeLayers].flatMap((k) => [...LAYER_GROUPS[k].types])),
    [activeLayers]
  );

  const neighborIds = useMemo(() => {
    if (!focusedNodeId) return null;
    const set = new Set<string>([focusedNodeId]);
    for (const e of edges) {
      if (e.source === focusedNodeId) set.add(e.target);
      if (e.target === focusedNodeId) set.add(e.source);
    }
    return set;
  }, [focusedNodeId, edges]);

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
          opacity = neighborIds.has(n.id) ? 1 : 0.07;
        } else {
          opacity = layerVisibleIds.has(n.id) ? 1 : 0;
        }
        return {
          ...n,
          selected: n.id === focusedNodeId,
          hidden: !neighborIds && !layerVisibleIds.has(n.id),
          style: { ...n.style, opacity, transition: "opacity 0.15s" },
        };
      }),
    [nodes, layerVisibleIds, neighborIds, focusedNodeId]
  );

  const styledEdges = useMemo(
    () =>
      edges.map((e) => {
        let opacity: number;
        if (neighborIds) {
          opacity = e.source === focusedNodeId || e.target === focusedNodeId ? 1 : 0.04;
        } else {
          opacity =
            layerVisibleIds.has(e.source) && layerVisibleIds.has(e.target) ? 0.65 : 0;
        }
        return {
          ...e,
          hidden: !neighborIds && (!layerVisibleIds.has(e.source) || !layerVisibleIds.has(e.target)),
          style: { ...e.style, opacity, transition: "opacity 0.15s" },
        };
      }),
    [edges, layerVisibleIds, neighborIds, focusedNodeId]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node<CatalogNodeData>) => {
      const isSame = node.id === focusedNodeId;
      setFocusedNodeId(isSame ? null : node.id);
      setPanelNodeId(node.id);
    },
    [focusedNodeId]
  );

  const panelNode = useMemo(
    () => nodes.find((n) => n.id === panelNodeId),
    [nodes, panelNodeId]
  );

  const layerCounts = useMemo(() => {
    const counts = {} as Record<LayerKey, number>;
    for (const key of Object.keys(LAYER_GROUPS) as LayerKey[]) {
      const types = new Set(LAYER_GROUPS[key].types);
      counts[key] = RAW_NODES.filter((n) => types.has(n.type)).length;
    }
    return counts;
  }, []);

  const visibleCount = styledNodes.filter((n) => !n.hidden).length;

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: "#0a0a12" }}>
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-20 border-b border-zinc-800"
        style={{ background: "#0a0a12" }}
      >
        {/* Top row */}
        <div className="h-12 flex items-center px-4 gap-3">
          <img
            src="https://d1l4mzebo786pw.cloudfront.net/image/input/white-labels/1/logos/secondary_logo/logo-naranja.png"
            alt="Dropi"
            className="h-6 object-contain flex-shrink-0"
          />
          <div className="flex-shrink-0">
            <span className="text-white font-bold text-sm">Supplier Success Graph</span>
            <span className="text-zinc-500 text-xs ml-2">· Pulso Vivo del Catálogo</span>
          </div>

          {/* Version badge */}
          <div className="flex items-center gap-1.5 bg-zinc-800/60 border border-zinc-700 rounded-lg px-3 py-1.5 flex-shrink-0">
            <Activity className="w-3 h-3 text-emerald-500" />
            <span className="text-zinc-300 text-[10px] font-semibold">v1 · Base</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          {/* Total counter + data source */}
          <div className="flex items-center gap-1.5 bg-zinc-800/40 border border-zinc-800 rounded-lg px-3 py-1.5 flex-shrink-0">
            <span className="text-zinc-500 text-[10px]">Total catálogo</span>
            <span className="text-white text-[10px] font-bold">1,000,000</span>
            <span className="text-zinc-500 text-[10px]">productos</span>
          </div>
          <div
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 flex-shrink-0 border"
            style={{
              background: dataSource === "live" ? "#10b98110" : "#f59e0b10",
              borderColor: dataSource === "live" ? "#10b98140" : "#f59e0b40",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: dataSource === "live" ? "#10b981" : "#f59e0b" }}
            />
            <span
              className="text-[9px] font-semibold uppercase tracking-wider"
              style={{ color: dataSource === "live" ? "#10b981" : "#f59e0b" }}
            >
              {dataSource === "live"
                ? `Supabase · ${snapshotDate}`
                : "Mock · seed local"}
            </span>
          </div>

          <div className="flex-1" />

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
              onChange={(e) => { setSearch(e.target.value); setFocusedNodeId(null); }}
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
            onClick={() => {
              setFocusedNodeId(null);
              setTimeout(() => fitView({ duration: 600, padding: 0.15 }), 50);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-zinc-300 hover:text-white text-xs font-medium border border-zinc-700 transition-colors flex-shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            Centrar
          </button>
        </div>

        {/* Layer toggles */}
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
                onClick={() => {
                  setActiveLayers((prev) => {
                    const next = new Set(prev);
                    if (next.has(key)) next.delete(key);
                    else next.add(key);
                    return next;
                  });
                  setFocusedNodeId(null);
                }}
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
          {focusedNodeId && (
            <span className="ml-auto text-[10px] text-zinc-500 flex-shrink-0">
              Click en el mismo nodo para deseleccionar
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="flex w-full pt-[84px] h-full">
        {/* Detail panel */}
        {panelNode && (
          <DetailPanel
            node={{ ...panelNode.data, id: panelNode.id }}
            edges={edges as Edge<CatalogEdgeData>[]}
            allNodes={nodes as Node<CatalogNodeData>[]}
            onClose={() => { setPanelNodeId(null); setFocusedNodeId(null); }}
            onNavigate={(id) => {
              setPanelNodeId(id);
              setFocusedNodeId(id);
              setTimeout(() => fitView({ nodes: [{ id }], duration: 400, padding: 0.6 }), 50);
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
            onPaneClick={() => setFocusedNodeId(null)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.08}
            maxZoom={3}
            colorMode="dark"
          >
            <Background color="#1a1a2e" gap={28} size={1} />
            <Controls className="!bg-zinc-800 !border-zinc-700" />
          </ReactFlow>
        </div>
      </div>

      {showExport && <ExportModal onClose={() => setShowExport(false)} />}
    </div>
  );
}

// ─── Page export ──────────────────────────────────────────────────────────────

export default function CatalogGraphPage() {
  return (
    <ReactFlowProvider>
      <CatalogGraph />
    </ReactFlowProvider>
  );
}
