// ─── Graph Validator ────────────────────────────────────────────────────────
// Pure TypeScript utility — no external dependencies.

export interface GraphNode {
  id: string;
  label: string;
  type: string;
  description: string;
}

export interface GraphEdge {
  id?: string;
  source: string;
  target: string;
  type: string;
  label: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface ValidationIssue {
  code: string;
  severity: "warning" | "error";
  message: string;
  affected: string[];
}

export interface ValidationReport {
  valid: boolean;
  summary: string;
  additions: {
    nodes: GraphNode[];
    edges: GraphEdge[];
  };
  warnings: ValidationIssue[];
  errors: ValidationIssue[];
}

// ─── Known types ─────────────────────────────────────────────────────────────

const KNOWN_NODE_TYPES = new Set([
  "supplier_segment",
  "flow",
  "milestone",
  "friction",
  "hypothesis",
  "experiment",
  "metric",
  "data_source",
  "project",
  "objective",
  "benefit",
]);

const KNOWN_EDGE_TYPES = new Set([
  "requires",
  "enables",
  "impacts",
  "blocks",
  "measures",
  "belongs_to",
  "tests",
  "depends_on",
  "reduces",
  "feeds",
  "includes",
]);

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Normalize a string for loose comparison: lowercase + strip common accents.
 */
function normalizeLabel(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}

// ─── Main validator ───────────────────────────────────────────────────────────

export function validateGraphUpdate(
  current: GraphData,
  proposed: Partial<GraphData>
): ValidationReport {
  const errors: ValidationIssue[] = [];
  const warnings: ValidationIssue[] = [];

  const proposedNodes: GraphNode[] = proposed.nodes ?? [];
  const proposedEdges: GraphEdge[] = proposed.edges ?? [];

  // Build lookup sets from current graph
  const currentNodeIds = new Set(current.nodes.map((n) => n.id));
  const currentLabelsNorm = new Map(
    current.nodes.map((n) => [normalizeLabel(n.label), n.id])
  );

  // Build combined id set (current + proposed) for dangling-edge check
  const allNodeIds = new Set([
    ...currentNodeIds,
    ...proposedNodes.map((n) => n.id),
  ]);

  // ── Rule 1: DUPLICATE_ID ─────────────────────────────────────────────────
  for (const node of proposedNodes) {
    if (currentNodeIds.has(node.id)) {
      errors.push({
        code: "DUPLICATE_ID",
        severity: "error",
        message: `Node id "${node.id}" already exists in the current graph.`,
        affected: [node.id],
      });
    }
  }

  // ── Rule 2: DANGLING_EDGE ────────────────────────────────────────────────
  for (const edge of proposedEdges) {
    const missing: string[] = [];
    if (!allNodeIds.has(edge.source)) missing.push(edge.source);
    if (!allNodeIds.has(edge.target)) missing.push(edge.target);
    if (missing.length > 0) {
      errors.push({
        code: "DANGLING_EDGE",
        severity: "error",
        message: `Edge "${edge.source} → ${edge.target}" references unknown node(s): ${missing.join(", ")}.`,
        affected: [`${edge.source}→${edge.target}`, ...missing],
      });
    }
  }

  // ── Rule 3: INVALID_NODE_TYPE ────────────────────────────────────────────
  for (const node of proposedNodes) {
    if (!KNOWN_NODE_TYPES.has(node.type)) {
      warnings.push({
        code: "INVALID_NODE_TYPE",
        severity: "warning",
        message: `Node "${node.id}" has unknown type "${node.type}". Known types: ${[...KNOWN_NODE_TYPES].join(", ")}.`,
        affected: [node.id],
      });
    }
  }

  // ── Rule 4: INVALID_EDGE_TYPE ────────────────────────────────────────────
  for (const edge of proposedEdges) {
    if (!KNOWN_EDGE_TYPES.has(edge.type)) {
      warnings.push({
        code: "INVALID_EDGE_TYPE",
        severity: "warning",
        message: `Edge "${edge.source} → ${edge.target}" has unknown type "${edge.type}". Known types: ${[...KNOWN_EDGE_TYPES].join(", ")}.`,
        affected: [`${edge.source}→${edge.target}`],
      });
    }
  }

  // ── Rule 5: MISSING_DESCRIPTION ─────────────────────────────────────────
  for (const node of proposedNodes) {
    if (!node.description || node.description.trim() === "") {
      warnings.push({
        code: "MISSING_DESCRIPTION",
        severity: "warning",
        message: `Node "${node.id}" has an empty or missing description.`,
        affected: [node.id],
      });
    }
  }

  // ── Rule 6: NAMING_CONFLICT ──────────────────────────────────────────────
  for (const node of proposedNodes) {
    const norm = normalizeLabel(node.label);
    const existingId = currentLabelsNorm.get(norm);
    if (existingId) {
      warnings.push({
        code: "NAMING_CONFLICT",
        severity: "warning",
        message: `Node "${node.id}" label "${node.label}" is too similar (case/accent-insensitive match) to existing node "${existingId}".`,
        affected: [node.id, existingId],
      });
    }
  }

  // ── Rule 7: SEMANTIC_CONFLICT ────────────────────────────────────────────
  // Detects "verificado" label confusion for supplier_segment nodes.
  const verificadoSegments = current.nodes.filter(
    (n) =>
      n.type === "supplier_segment" &&
      normalizeLabel(n.label).includes("verificado")
  );

  for (const node of proposedNodes) {
    if (
      node.type === "supplier_segment" &&
      normalizeLabel(node.label).includes("verificado")
    ) {
      for (const existing of verificadoSegments) {
        if (
          normalizeLabel(node.label) !== normalizeLabel(existing.label) &&
          normalizeLabel(node.label).includes("verificado")
        ) {
          warnings.push({
            code: "SEMANTIC_CONFLICT",
            severity: "warning",
            message: `Node "${node.id}" ("${node.label}") may be semantically confused with existing supplier_segment "${existing.id}" ("${existing.label}"). Both use "verificado".`,
            affected: [node.id, existing.id],
          });
          break;
        }
      }
    }
  }

  // ── Build report ─────────────────────────────────────────────────────────
  const hasErrors = errors.length > 0;
  const totalIssues = errors.length + warnings.length;

  const summary = hasErrors
    ? `Validation failed with ${errors.length} error(s) and ${warnings.length} warning(s). Cannot apply changes.`
    : totalIssues > 0
    ? `Validation passed with ${warnings.length} warning(s). ${proposedNodes.length} node(s) and ${proposedEdges.length} edge(s) ready to add.`
    : `Validation passed. ${proposedNodes.length} node(s) and ${proposedEdges.length} edge(s) ready to add.`;

  return {
    valid: !hasErrors,
    summary,
    additions: {
      nodes: proposedNodes,
      edges: proposedEdges,
    },
    warnings,
    errors,
  };
}
