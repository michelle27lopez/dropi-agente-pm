import HubHeader from "@/components/HubHeader";

// EXP-003 · Célula Design Ops. Ficha de detalle a la que apunta el
// `detailHref` de la fila "Búsqueda semántica" en /proyectos/seguimiento
// (antes rota — no existía este archivo).

export default function Exp003Page() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Búsqueda semántica de productos mediante lenguaje natural"
        subtitle="Proyecto EXP-003 · Célula Design Ops"
        currentSlug="seguimiento"
      />

      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto", padding: "40px 24px", boxSizing: "border-box" }}>
        {/* Breadcrumb */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 24, fontSize: 13 }}>
          <a href="/proyectos/seguimiento" style={{ color: "var(--muted)", textDecoration: "none" }}>
            ← Volver a Seguimiento
          </a>
        </div>

        {/* Card principal del proyecto */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "var(--dropi-light)", color: "var(--dropi)", padding: "3px 9px", borderRadius: 20 }}>
              EXP-003
            </span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#ECFDF5", color: "#10B981", padding: "3px 9px", borderRadius: 20 }}>
              En Progreso
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.6, margin: 0 }}>
            Piloto que compara Colombia (control, Clásica por defecto) vs. Paraguay (experimental, IA como
            modo de búsqueda por defecto desde el 17 de junio de 2026) — mide si la búsqueda por lenguaje
            natural mejora adopción, retención y conversión frente al buscador clásico. PM: Diana Aldana.
          </p>

          {/* Detalle del Proyecto → bitácora, en pestaña nueva */}
          <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
            <div>
              <strong style={{ fontSize: 12.5, display: "block", color: "var(--fg)" }}>Bitácora del piloto</strong>
              <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Colombia vs Paraguay · 4 semanas + línea base</span>
            </div>
            <a
              href="/proyectos/exp-003/bitacora"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: 12.5, fontWeight: 750, color: "#fff", background: "var(--dropi)",
                border: "none", borderRadius: 8, padding: "8px 16px", cursor: "pointer", textDecoration: "none",
                display: "inline-flex", alignItems: "center", gap: 6, minHeight: 44,
              }}
            >
              Abrir bitácora
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
