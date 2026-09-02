"use client";

import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";

type Row = {
  id: string;
  dimension: "arquetipos" | "procesos";
  porcentaje: number;
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

// dimKey → anchor de la guía + copy corto. La documentación real vive en
// /guias/entendimiento-360-ecosistema — cada barra lleva directo a su
// sección ahí, no hay edición ni checklist acá: esta página es solo el
// semáforo, la guía es donde se lee/entiende el porqué.
const DIMENSIONES = [
  { key: "arquetipos" as const, label: "Por usuario", anchor: "usuario" },
  { key: "procesos" as const, label: "Por proceso", anchor: "proceso" },
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

  useEffect(() => {
    fetch("/api/service-design-360")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok && !data.migracionPendiente) throw new Error(data.error || "No se pudo cargar el avance.");
        setMigracionPendiente(!!data.migracionPendiente);
        setRows(data.rows ?? []);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Matriz célula → dimensión → %. Si la migración no se ha corrido, se
  // arma el esqueleto en 0% para que la página igual comunique la
  // estructura completa, no un error en blanco.
  const porCelula = CELULAS_TRACKEADAS.map((c) => {
    const real = rows.filter((r) => r.celulas?.slug === c.slug);
    const cells = DIMENSIONES.map((d) => real.find((r) => r.dimension === d.key)?.porcentaje ?? 0);
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

      <div style={{ maxWidth: 800, width: "100%", margin: "0 auto", padding: 32, boxSizing: "border-box" }}>

        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.6, margin: 0 }}>
            Qué tan bien entendemos a cada célula: su segmento (<strong>por usuario</strong>) y los procesos que afectan su
            experiencia y servicio (<strong>por proceso</strong>) — incluye Growth Ops. Clic en cualquier barra para ver la
            documentación completa en <a href="/guias/entendimiento-360-ecosistema" style={{ color: "var(--dropi)" }}>Guías</a>.
          </p>
          {!loading && !migracionPendiente && (
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 18 }}>
              <div style={{ flex: 1, height: 8, borderRadius: 999, background: "var(--bg)", overflow: "hidden" }}>
                <div style={{ width: `${promedioGeneral}%`, height: "100%", background: colorPorcentaje(promedioGeneral), borderRadius: 999 }} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: colorPorcentaje(promedioGeneral), fontVariantNumeric: "tabular-nums" }}>
                {promedioGeneral}% general
              </span>
            </div>
          )}
        </div>

        {migracionPendiente && (
          <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: 16, marginBottom: 24, fontSize: 13, color: "#92400E" }}>
            ⚠️ La tabla de progreso todavía no existe en Supabase — falta correr <code>supabase/054_service_design_360.sql</code> en
            el SQL Editor del dashboard (paso manual). Mientras tanto se muestra la estructura completa en 0%.
          </div>
        )}

        {error && !migracionPendiente && (
          <p style={{ fontSize: 13, color: "#DC2626", marginBottom: 16 }}>Error: {error}</p>
        )}

        {loading ? (
          <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando avance…</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {porCelula.map(({ celula, cells }) => (
              <div key={celula.slug} style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "16px 20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--fg)" }}>{celula.nombre}</span>
                  {celula.slug === "growth" && (
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", padding: "2px 8px", borderRadius: 999 }}>
                      incluye Growth Ops
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {DIMENSIONES.map((dim, i) => {
                    const pct = cells[i];
                    const color = colorPorcentaje(pct);
                    return (
                      <a
                        key={dim.key}
                        href={`/guias/entendimiento-360-ecosistema#${dim.anchor}-${celula.slug}`}
                        style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}
                      >
                        <span style={{ fontSize: 12, color: "var(--muted)", width: 90, flex: "none" }}>{dim.label}</span>
                        <div style={{ flex: 1, height: 7, borderRadius: 999, background: "var(--bg)", overflow: "hidden" }}>
                          <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 999 }} />
                        </div>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color, minWidth: 34, textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                          {pct}%
                        </span>
                      </a>
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
