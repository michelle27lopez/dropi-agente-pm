export function StatBadge({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
      minWidth: 72, padding: "10px 14px",
      background: color + "0D", border: `1px solid ${color}33`, borderRadius: 10,
    }}>
      <span style={{ fontSize: 20, fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </span>
    </div>
  );
}

export function StatRow({ stats }: { stats: { label: string; value: number; color: string }[] }) {
  return (
    <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      {stats.map((s) => <StatBadge key={s.label} {...s} />)}
    </div>
  );
}
