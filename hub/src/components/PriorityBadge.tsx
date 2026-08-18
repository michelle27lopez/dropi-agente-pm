// Extraído de /sprint/page.tsx para reusarlo también en el panel de la home
// (mi-dia/SprintPanel.tsx) sin duplicar el SVG de flechas de prioridad.
export const PRIORITY_COLOR: Record<string, string> = {
  Highest: "var(--danger)", High: "var(--danger)", Medium: "var(--warning)", Low: "var(--info)", Lowest: "var(--info)",
};

function PriorityIcon({ priority }: { priority: string }) {
  const color = PRIORITY_COLOR[priority] ?? "var(--muted)";
  const stroke = { stroke: color, strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, fill: "none" };

  if (priority === "Medium") {
    return (
      <svg width={14} height={14} viewBox="0 0 16 16">
        <line x1="3" y1="6" x2="13" y2="6" {...stroke} />
        <line x1="3" y1="10" x2="13" y2="10" {...stroke} />
      </svg>
    );
  }

  const up = priority === "Highest" || priority === "High";
  const double = priority === "Highest" || priority === "Lowest";
  const points = up ? "3,9 8,4.5 13,9" : "3,7 8,11.5 13,7";

  return (
    <svg width={14} height={14} viewBox="0 0 16 16" style={{ overflow: "visible" }}>
      <polyline points={points} {...stroke} />
      {double && <polyline points={points} {...stroke} transform={`translate(0, ${up ? -5 : 5})`} />}
    </svg>
  );
}

export function PriorityBadge({ priority }: { priority: string | null }) {
  if (!priority) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, color: PRIORITY_COLOR[priority] ?? "var(--muted)" }}>
      <PriorityIcon priority={priority} />
      {priority}
    </span>
  );
}
