export type Item = {
  key: string;
  name: string;
  description: string;
  url?: string;
  tag: string;
  color: string;
  icon: string;
};

export function matchesQuery(item: Item, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    item.name.toLowerCase().includes(q) ||
    item.description.toLowerCase().includes(q) ||
    item.tag.toLowerCase().includes(q)
  );
}

export function Section({ title, items, ctaLabel }: { title: string; items: Item[]; ctaLabel: string }) {
  if (items.length === 0) return null;
  return (
    <div>
      {title && (
        <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>
          {title}
        </p>
      )}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 20,
      }}>
        {items.map((item, index) => (
          <Card key={item.key} item={item} ctaLabel={ctaLabel} index={index} />
        ))}
      </div>
    </div>
  );
}

export function Card({ item, ctaLabel, index }: { item: Item; ctaLabel: string; index: number }) {
  const Tag = item.url ? "a" : "div";
  const isExternal = item.url?.startsWith("http");
  return (
    <Tag
      href={item.url}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="hub-card"
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "24px",
        textDecoration: "none",
        display: "block",
        animationDelay: `${index * 60}ms`,
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div className="hub-card-icon" style={{
          width: 44, height: 44, borderRadius: 12,
          background: "var(--card)",
          border: "1px solid var(--border)",
          alignItems: "center", justifyContent: "center",
          fontSize: 22,
        }}>
          {item.icon}
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600,
          color: item.color,
          background: `${item.color}12`,
          padding: "3px 8px", borderRadius: 999,
          marginTop: 4,
        }}>
          {item.tag}
        </span>
      </div>
      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
        {item.name}
      </h2>
      <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
        {item.description}
      </p>
      {item.url && (
        <div className="hub-card-arrow" style={{ marginTop: 20, fontSize: 12, fontWeight: 600, color: "var(--dropi)" }}>
          {ctaLabel}
        </div>
      )}
    </Tag>
  );
}
