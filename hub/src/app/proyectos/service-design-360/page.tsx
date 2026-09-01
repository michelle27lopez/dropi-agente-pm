"use client";

import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";

type Row = {
  id: string;
  dimension: "arquetipos" | "procesos";
  criterio_1: boolean;
  criterio_2: boolean;
  criterio_3: boolean;
  criterio_4: boolean;
  porcentaje: number;
  notas: string | null;
  guia_url: string | null;
  updated_at: string;
  celulas: { id: string; nombre: string; slug: string } | null;
};

// Mismo set de células que la semilla de la migración 054 — se usa como
// esqueleto mientras carga y como fallback si la migración todavía no se
// corrió en Supabase (paso manual, ver el .sql).
const CELULAS_TRACKEADAS = [
  { slug: "sellers", nombre: "Sellers" },
  { slug: "suppliers", nombre: "Suppliers" },
  { slug: "brands", nombre: "Brands" },
  { slug: "logistica", nombre: "Logística" },
  { slug: "backoffice", nombre: "Backoffice" },
  { slug: "growth", nombre: "Growth" },
  { slug: "growth-marketing", nombre: "Growth Marketing" },
  { slug: "experience", nombre: "Experience" },
  { slug: "fintech", nombre: "Fintech" },
];

// Los 4 criterios (25% c/u) que sustentan el % — el mismo texto vive en el
// comentario de la migración 054. El % nunca se escribe a mano: sale de
// cuántos de estos 4 están marcados como cumplidos, con evidencia real de
// Confluence detrás de cada marca (ver notas de cada celda).
const DIMENSIONES = [
  {
    key: "arquetipos" as const,
    label: "Por usuario",
    detalle: "Arquetipos / user personas del segmento",
    criterios: [
      "Segmentos/arquetipos nombrados y diferenciados (no un usuario genérico)",
      "Necesidades y dolores documentados por arquetipo",
      "Evidencia/datos reales citados detrás (research, números — no solo intuición)",
      "Centralizado en una página de referencia findable",
    ],
  },
  {
    key: "procesos" as const,
    label: "Por proceso",
    detalle: "Journeys 360 de experiencia y servicio",
    criterios: [
      "Journey end-to-end documentado (no una etapa aislada)",
      "Touchpoints de experiencia/servicio, no solo el flujo transaccional",
      "Fugas o dolores identificados explícitamente en el journey",
      "Métricas/indicadores ligados a las etapas del journey",
    ],
  },
];

function colorPorcentaje(pct: number): string {
  if (pct >= 75) return "#047857";
  if (pct >= 50) return "#B45309";
  if (pct >= 25) return "#B91C1C";
  return "var(--muted)";
}

export default function ServiceDesign360Page() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [migracionPendiente, setMigracionPendiente] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftNotas, setDraftNotas] = useState("");
  const [draftGuia, setDraftGuia] = useState("");
  const [saving, setSaving] = useState(false);

  function cargar() {
    setLoading(true);
    fetch("/api/service-design-360")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok && !data.migracionPendiente) throw new Error(data.error || "No se pudo cargar el avance.");
        setMigracionPendiente(!!data.migracionPendiente);
        setRows(data.rows ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => { cargar(); }, []);

  async function toggleCriterio(row: Row, campo: "criterio_1" | "criterio_2" | "criterio_3" | "criterio_4") {
    const nuevoValor = !row[campo];
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, [campo]: nuevoValor } : r)));
    const res = await fetch("/api/service-design-360", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id, [campo]: nuevoValor }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRows((prev) => prev.map((r) => (r.id === row.id ? updated : r)));
    }
  }

  function abrirEdicion(row: Row) {
    setEditingId(row.id);
    setDraftNotas(row.notas ?? "");
    setDraftGuia(row.guia_url ?? "");
  }

  async function guardarEdicion(id: string) {
    setSaving(true);
    const res = await fetch("/api/service-design-360", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, notas: draftNotas.trim() || null, guia_url: draftGuia.trim() || null }),
    });
    setSaving(false);
    if (!res.ok) return;
    const updated = await res.json();
    setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
    setEditingId(null);
  }

  // Matriz célula → dimensión → fila. Si la migración no se ha corrido, se
  // arma el esqueleto vacío con el fallback estático para que la página
  // igual comunique la estructura completa, no un error en blanco.
  const porCelula = CELULAS_TRACKEADAS.map((c) => {
    const real = rows.filter((r) => r.celulas?.slug === c.slug);
    const cells = DIMENSIONES.map((d) => {
      const found = real.find((r) => r.dimension === d.key);
      return found ?? {
        id: `placeholder-${c.slug}-${d.key}`,
        dimension: d.key,
        criterio_1: false, criterio_2: false, criterio_3: false, criterio_4: false,
        porcentaje: 0,
        notas: null,
        guia_url: null,
        updated_at: "",
        celulas: null,
        _placeholder: true,
      };
    });
    return { celula: c, cells };
  });

  const promedioGeneral = rows.length > 0
    ? Math.round(rows.reduce((sum, r) => sum + r.porcentaje, 0) / rows.length)
    : 0;

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title="Service design: Entendimiento 360 del ecosistema"
        subtitle="Proyecto PRO-001 · Product team"
        currentSlug="product-designers"
      />

      <div style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: 32, boxSizing: "border-box" }}>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.6, margin: 0 }}>
            Trackea, por célula, el % de entendimiento documentado de su segmento (<strong>arquetipos/user personas</strong>) y de los
            procesos que inciden en experiencia y servicio dentro de su ecosistema (<strong>journeys 360</strong>) — incluye Growth Ops.
            El % no se escribe a mano: sale de 4 criterios auditables por celda (ver "Ver criterios"), evaluados contra la documentación
            real hoy en Confluence. La documentación final vive en <a href="/guias" style={{ color: "var(--dropi)" }}>Guías</a>.
          </p>
          {!loading && !migracionPendiente && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
              <div style={{ flex: 1, height: 8, borderRadius: 999, background: "var(--bg)", overflow: "hidden" }}>
                <div style={{ width: `${promedioGeneral}%`, height: "100%", background: colorPorcentaje(promedioGeneral), borderRadius: 999, transition: "width .3s" }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: colorPorcentaje(promedioGeneral), fontVariantNumeric: "tabular-nums" }}>
                {promedioGeneral}% entendimiento general
              </span>
            </div>
          )}
        </div>

        {migracionPendiente && (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 16, marginBottom: 24, fontSize: 13, color: "#92400E" }}>
            ⚠️ La tabla de progreso todavía no existe en Supabase — falta correr <code>supabase/054_service_design_360.sql</code> en
            el SQL Editor del dashboard (paso manual). Mientras tanto se muestra la estructura completa sin poder guardar cambios.
          </div>
        )}

        {error && !migracionPendiente && (
          <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 16 }}>Error: {error}</p>
        )}

        {loading ? (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando avance…</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {porCelula.map(({ celula, cells }) => (
              <div key={celula.slug} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 20 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  <a href={`/celula/${celula.slug}`} style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", textDecoration: "none" }}>
                    {celula.nombre}
                  </a>
                  {celula.slug === "growth" && (
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", padding: "2px 8px", borderRadius: 999 }}>
                      incluye Growth Ops
                    </span>
                  )}
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 12 }}>
                  {cells.map((row, i) => {
                    const dim = DIMENSIONES[i];
                    const isPlaceholder = "_placeholder" in row;
                    const pct = row.porcentaje;
                    const color = colorPorcentaje(pct);
                    return (
                      <div key={dim.key} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 14 }}>
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 12.5, fontWeight: 700, color: "var(--fg)" }}>{dim.label}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{dim.detalle}</div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                          <div style={{ flex: 1, height: 7, borderRadius: 999, background: "var(--bg)", overflow: "hidden" }}>
                            <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999, transition: "width .3s" }} />
                          </div>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color, minWidth: 34, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                            {pct}%
                          </span>
                        </div>

                        <button
                          onClick={() => setExpandedId(expandedId === row.id ? null : row.id)}
                          disabled={isPlaceholder}
                          style={{ fontSize: 11.5, color: "var(--dropi)", background: "none", border: "none", cursor: isPlaceholder ? "default" : "pointer", padding: 0, marginBottom: 8 }}
                        >
                          {expandedId === row.id ? "Ocultar criterios ▲" : "Ver criterios ▼"}
                        </button>

                        {expandedId === row.id && !isPlaceholder && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10, paddingLeft: 2 }}>
                            {dim.criterios.map((texto, idx) => {
                              const campo = `criterio_${idx + 1}` as "criterio_1" | "criterio_2" | "criterio_3" | "criterio_4";
                              return (
                                <label key={campo} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 11.5, color: "var(--fg)", cursor: "pointer" }}>
                                  <input
                                    type="checkbox"
                                    checked={(row as Row)[campo]}
                                    onChange={() => toggleCriterio(row as Row, campo)}
                                    style={{ marginTop: 2, flex: "none" }}
                                  />
                                  <span>{texto}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {editingId === row.id ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                            <textarea
                              value={draftNotas}
                              onChange={(e) => setDraftNotas(e.target.value)}
                              placeholder="Notas / evidencia encontrada en Confluence"
                              rows={2}
                              style={{ fontSize: 12, padding: 8, borderRadius: 8, border: "1px solid var(--border)", resize: "vertical" }}
                            />
                            <input
                              value={draftGuia}
                              onChange={(e) => setDraftGuia(e.target.value)}
                              placeholder="/guias/... (una vez esté escrita)"
                              style={{ fontSize: 12, padding: 8, borderRadius: 8, border: "1px solid var(--border)" }}
                            />
                            <div style={{ display: "flex", gap: 6 }}>
                              <button
                                onClick={() => guardarEdicion(row.id)}
                                disabled={saving}
                                style={{ fontSize: 11.5, fontWeight: 700, color: "#fff", background: "var(--dropi)", border: "none", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}
                              >
                                {saving ? "Guardando…" : "Guardar"}
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                style={{ fontSize: 11.5, fontWeight: 700, color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <p style={{ fontSize: 12, color: row.notas ? "var(--fg)" : "var(--muted)", margin: "0 0 8px", lineHeight: 1.5 }}>
                              {row.notas || "Sin notas todavía."}
                            </p>
                            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                              {row.guia_url && (
                                <a href={row.guia_url} style={{ fontSize: 11.5, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>
                                  📚 Ver guía
                                </a>
                              )}
                              {!isPlaceholder && (
                                <button
                                  onClick={() => abrirEdicion(row as Row)}
                                  style={{ fontSize: 11.5, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", padding: 0, textDecoration: "underline" }}
                                >
                                  Editar notas / guía
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
