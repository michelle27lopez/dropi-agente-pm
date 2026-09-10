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

// Dos tabs (2026-09-07, a pedido de Laura): "Contexto del proyecto" es lo
// estable — qué es esto y por qué importa, no cambia cada semana.
// "Seguimiento / Avances" es lo vivo — el % por célula y la bitácora del
// piloto, lo que sí se revisa seguido. Antes vivía todo en una sola página
// larga; separarlo evita que alguien que solo quiere ver el avance tenga
// que pasar por el contexto cada vez.
type Tab = "contexto" | "seguimiento";
const TABS: { value: Tab; label: string }[] = [
  { value: "contexto", label: "Contexto del proyecto" },
  { value: "seguimiento", label: "Seguimiento / Avances" },
];

export default function ServiceDesign360Page() {
  const [tab, setTab] = useState<Tab>("seguimiento");
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

      <div style={{ maxWidth: 900, width: "100%", margin: "0 auto", padding: 32, boxSizing: "border-box" }}>

        <div style={{ display: "flex", gap: 8, marginBottom: 28 }}>
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              style={{
                fontSize: 13, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                padding: "8px 16px", borderRadius: 999,
                border: `1px solid ${tab === t.value ? "var(--dropi)" : "var(--border)"}`,
                background: tab === t.value ? "var(--dropi-light)" : "var(--card)",
                color: tab === t.value ? "var(--dropi)" : "var(--muted)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "contexto" && (
          <>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.6, margin: 0 }}>
                Qué tan bien entendemos a cada célula: su segmento (<strong>por usuario</strong>) y los procesos que afectan su
                experiencia y servicio (<strong>por proceso</strong>) — incluye Growth Ops. La documentación real, dividida en esas
                dos mismas categorías, célula por célula, vive en{" "}
                <a href="/guias/entendimiento-360-ecosistema" style={{ color: "var(--dropi)" }}>Guías</a>.
              </p>
            </div>

            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: "0 0 14px" }}>Por qué importa el Service Design</h2>
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 10, padding: 14, fontSize: 12.5, color: "#92400E", lineHeight: 1.6 }}>
                ⚠️ Falta el contexto que Diana Aldana documentó en célula Experience — lo busqué en Confluence y no encontré una página
                suya sobre esto. Pégalo aquí (o dime el link) y lo dejo citado con la fuente real, en vez de parafrasearlo sin tenerlo.
              </div>
            </div>
          </>
        )}

        {tab === "seguimiento" && (
          <>
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24, marginBottom: 24 }}>
              <p style={{ fontSize: 12, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, margin: "0 0 12px" }}>
                Avance general
              </p>
              {!loading && !migracionPendiente && (
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
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
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
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

            {/* Bitácora del piloto (2026-09-03): avances, siguientes pasos y
                roadmap — la parte que sí cambia semana a semana. */}
            <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: "0 0 14px" }}>Avances</h2>
              <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, color: "var(--fg)", lineHeight: 1.8 }}>
                <li>📅 Reunión <strong>"Procesos en Dropi"</strong> — punto de partida conceptual para conectar los procesos del servicio.</li>
              </ul>

              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: "24px 0 14px" }}>Siguientes pasos: piloto SAC → Service Blueprint global</h2>
              <p style={{ fontSize: 13.5, color: "var(--fg)", lineHeight: 1.7, margin: "0 0 14px" }}>
                Vamos a levantar una prueba piloto para entender y conectar todos los procesos dentro del servicio que inciden con la
                plataforma — empezando por <strong>SAC</strong>, con <strong>Laura Núñez</strong> y <strong>Juan Sebastián Maldonado</strong>.
                Qué haremos: revisar la documentación existente, conectarla, y ponerla en un <strong>Service Blueprint global de Dropi</strong>.
                Los procesos entran priorizados y con criterio — filtrando el nivel de detalle para que de verdad sea útil, no exhaustivo.
              </p>

              <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 16, marginBottom: 20 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", margin: "0 0 10px" }}>
                  Borrador de invitación — kickoff del piloto
                </p>
                <p style={{ fontSize: 13, color: "var(--fg)", margin: "0 0 6px" }}><strong>Asunto:</strong> Kickoff piloto — Service Blueprint global de Dropi (SAC)</p>
                <p style={{ fontSize: 13, color: "var(--fg)", margin: "0 0 6px" }}><strong>Invitados:</strong> Laura Núñez, Juan Sebastián Maldonado, Diana Aldana, Juan Camilo Rojas</p>
                <p style={{ fontSize: 13, color: "var(--fg)", margin: "0 0 10px" }}>
                  <strong>Agenda:</strong> (1) contexto del proyecto Entendimiento 360 y por qué arrancamos por SAC · (2) qué documentación de
                  procesos de SAC ya existe y dónde vive · (3) acuerdo sobre procesos prioritarios y nivel de detalle del blueprint ·
                  (4) próximos pasos y dueños.
                </p>
                <p style={{ fontSize: 11.5, color: "var(--muted)", margin: 0 }}>
                  No tengo acceso para crear el evento directo en tu Calendar — copia esto al armar la invitación.
                </p>
              </div>

              <p style={{ fontSize: 13, color: "var(--fg)", margin: "0 0 20px" }}>
                🎫 Tarea creada en Jira: <a href="https://dropi-it.atlassian.net/browse/PROD-2539" target="_blank" rel="noreferrer" style={{ color: "var(--dropi)", fontWeight: 700 }}>PROD-2539</a>
              </p>

              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: "0 0 6px" }}>Roadmap del piloto</h2>
              <p style={{ fontSize: 11.5, color: "var(--muted)", margin: "0 0 16px" }}>
                Secuencia propuesta, no fechas confirmadas — ajusta una vez se agende el kickoff.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { fase: "Kickoff con SAC + Experience", semanas: [1, 1] },
                  { fase: "Revisar documentación existente de SAC", semanas: [1, 2] },
                  { fase: "Conectar documentación al blueprint global", semanas: [2, 3] },
                  { fase: "Definir procesos prioritarios y criterios", semanas: [3, 4] },
                  { fase: "Service Blueprint global v0 (SAC)", semanas: [4, 5] },
                ].map((row) => (
                  <div key={row.fase} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 12, color: "var(--fg)", width: 260, flex: "none" }}>{row.fase}</span>
                    <div style={{ flex: 1, height: 20, position: "relative", background: "var(--bg)", borderRadius: 6 }}>
                      <div style={{
                        position: "absolute", top: 0, bottom: 0,
                        left: `${((row.semanas[0] - 1) / 5) * 100}%`,
                        width: `${((row.semanas[1] - row.semanas[0] + 1) / 5) * 100}%`,
                        background: "var(--dropi)", borderRadius: 6,
                      }} />
                    </div>
                    <span style={{ fontSize: 11, color: "var(--muted)", width: 76, flex: "none", textAlign: "right", fontVariantNumeric: "tabular-nums" }}>
                      Sem {row.semanas[0]}–{row.semanas[1]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
