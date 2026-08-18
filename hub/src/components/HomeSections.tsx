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

// Panel al estilo Mi día (2026-08-17, Jaime) — reemplaza el grid de cards
// aisladas por un panel único con filas (mismo lenguaje visual que
// SprintPanel/KpiPreviewPanel: .midia-panel + .midia-row). Section/Card son
// compartidos por la home de célula y por UpdatesLogistica/UpdatesBackoffice
// — rediseñar acá alcanza a las tres sin tocar su lógica de datos propia.
export function Section({ title, items, ctaLabel, onItemClick }: { title: string; items: Item[]; ctaLabel: string; onItemClick?: (item: Item) => void }) {
  if (items.length === 0) return null;
  return (
    <div className="midia-panel">
      {title && (
        <div className="midia-panel-header">
          <div className="midia-panel-header-left">
            <span className="midia-panel-label">{title}</span>
          </div>
        </div>
      )}
      {items.map((item) => (
        <Card key={item.key} item={item} ctaLabel={ctaLabel} onItemClick={onItemClick} />
      ))}
    </div>
  );
}

export function Card({ item, ctaLabel, onItemClick }: { item: Item; ctaLabel: string; onItemClick?: (item: Item) => void }) {
  // Las cards con url navegan directo (proyectos, weekly). Las que no tienen
  // url (ej. celula_updates) solo son interactivas si el padre pasa onItemClick
  // — ahí se abren en un modal en vez de intentar navegar a ningún lado.
  const clickable = !item.url && !!onItemClick;
  const Tag = item.url ? "a" : "div";
  const isExternal = item.url?.startsWith("http");
  return (
    <Tag
      href={item.url}
      onClick={clickable ? () => onItemClick!(item) : undefined}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="midia-row"
      style={{ cursor: item.url || clickable ? "pointer" : undefined }}
    >
      <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{item.icon}</span>
      <div className="midia-row-body">
        <p className="midia-row-title">{item.name}</p>
        <div className="midia-row-meta">
          <span style={{ color: item.color, fontWeight: 700 }}>{item.tag}</span>
          <span className="midia-row-meta-sep">·</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.description}</span>
        </div>
      </div>
      {(item.url || clickable) && (
        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", flexShrink: 0, alignSelf: "center" }}>
          {ctaLabel}
        </span>
      )}
    </Tag>
  );
}
