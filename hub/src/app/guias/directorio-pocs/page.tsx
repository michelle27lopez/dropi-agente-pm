"use client";

import { useEffect, useState } from "react";
import HubFooter from "@/components/HubFooter";
import { projectUrl, type Proyecto } from "@/components/ProjectCard";
import { PROJECT_STYLE } from "@/lib/curated-projects";

// Inventario de POCs cruzando todas las células. Complementa
// /celula/[slug]/proyectos, que solo muestra la célula de la URL.

type Grupo = { celula: { nombre: string; slug: string }; pocs: Proyecto[] };
type Respuesta = { celulas: Grupo[]; huerfanos: Proyecto[]; total: number };

function urlDe(p: Proyecto) {
  const code = p.project_code ?? "";
  return PROJECT_STYLE[code]?.url ?? projectUrl(p);
}

function Estado({ valor }: { valor: string | null }) {
  if (!valor) return <span style={{ color: "var(--muted)" }}>—</span>;
  return (
    <span style={{
      fontSize: 11.5, fontWeight: 600, color: "var(--fg)",
      background: "var(--bg)", border: "1px solid var(--border)",
      padding: "2px 8px", borderRadius: 999, whiteSpace: "nowrap",
    }}>
      {valor}
    </span>
  );
}

function TablaPocs({ pocs }: { pocs: Proyecto[] }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
            <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600, width: 110 }}>Código</th>
            <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>POC</th>
            <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600, width: 150 }}>Estado</th>
            <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600, width: 150 }}>Handoff</th>
          </tr>
        </thead>
        <tbody>
          {pocs.map((p) => {
            const color = PROJECT_STYLE[p.project_code ?? ""]?.color;
            const icon = PROJECT_STYLE[p.project_code ?? ""]?.icon ?? "🧪";
            return (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--border)" }}>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <span style={{
                    fontSize: 11.5, fontWeight: 700, fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                    color: color ?? "var(--muted)",
                  }}>
                    {p.project_code ?? "—"}
                  </span>
                </td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <a href={urlDe(p)} style={{ color: "var(--fg)", fontWeight: 600, textDecoration: "none" }}>
                    <span style={{ marginRight: 6 }}>{icon}</span>{p.name}
                  </a>
                  {p.summary && (
                    <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5, margin: "4px 0 0" }}>
                      {p.summary}
                    </p>
                  )}
                </td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <Estado valor={p.estado_interno ?? p.status} />
                </td>
                <td style={{ padding: "10px", verticalAlign: "top" }}>
                  <Estado valor={p.handoff_status} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function DirectorioPocsPage() {
  const [data, setData] = useState<Respuesta | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pocs")
      .then(async (res) => {
        if (res.status === 401) throw new Error("Inicia sesión en el hub para ver el inventario.");
        if (!res.ok) throw new Error(`El servidor respondió ${res.status}.`);
        return res.json();
      })
      .then(setData)
      .catch((e: Error) => setError(e.message));
  }, []);

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <a href="/guias" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Guías</a>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flex: "none",
              background: "var(--dropi-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>
              🧪
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                Directorio de POCs
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Todos los POCs del equipo, de todas las células, en una sola vista
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32, width: "100%" }}>

          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7, marginBottom: 8 }}>
            Tu home de célula (<a href="/celula" style={{ color: "var(--dropi)" }}>/celula/…/proyectos</a>) solo te muestra
            los proyectos de tu célula. Esta página existe para lo otro: ver qué está probando el resto del equipo antes de
            arrancar un POC que quizá ya existe.
          </p>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 24 }}>
            Se alimenta en vivo de la tabla <code style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace" }}>projects</code> de
            Supabase, filtrando <code style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace" }}>type = &apos;POC&apos;</code>.
            Si tu POC no aparece acá, es porque todavía no está registrado como POC en tu home de célula —
            no porque falte en esta página. ¿Vas a crear uno? Empieza por el <a href="/guias/taller-pocs" style={{ color: "var(--dropi)" }}>taller de POCs</a>.
          </p>

          {error && (
            <div style={{
              background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10,
              padding: "12px 16px", fontSize: 13, color: "var(--fg)", lineHeight: 1.6,
            }}>
              {error}
            </div>
          )}

          {!data && !error && (
            <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando el inventario…</p>
          )}

          {data && data.total === 0 && (
            <div style={{
              background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12,
              padding: 24, fontSize: 13, color: "var(--muted)", lineHeight: 1.6,
            }}>
              No hay ningún proyecto marcado como POC todavía. Se crean desde la ficha de un proyecto
              en tu home de célula, con el botón <strong>+ Crear POC</strong>.
            </div>
          )}

          {data && data.total > 0 && (
            <>
              <div style={{
                display: "flex", alignItems: "baseline", gap: 8, marginBottom: 20,
                paddingBottom: 12, borderBottom: "1px solid var(--border)",
              }}>
                <span style={{ fontSize: 26, fontWeight: 800, color: "var(--dropi)" }}>{data.total}</span>
                <span style={{ fontSize: 13, color: "var(--muted)" }}>
                  POCs en {data.celulas.length} {data.celulas.length === 1 ? "célula" : "células"}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
                {data.celulas.map((g) => (
                  <section key={g.celula.slug ?? g.celula.nombre}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: 0 }}>
                        {g.celula.nombre}
                      </h2>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: "var(--dropi)",
                        background: "var(--dropi-light)", padding: "2px 8px", borderRadius: 999,
                      }}>
                        {g.pocs.length}
                      </span>
                      {g.celula.slug && (
                        <a href={`/celula/${g.celula.slug}/proyectos`} style={{ fontSize: 12, color: "var(--muted)", textDecoration: "none" }}>
                          ver su home →
                        </a>
                      )}
                    </div>
                    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "4px 8px" }}>
                      <TablaPocs pocs={g.pocs} />
                    </div>
                  </section>
                ))}

                {data.huerfanos.length > 0 && (
                  <section>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                      <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: 0 }}>
                        Sin célula asignada
                      </h2>
                      <span style={{
                        fontSize: 11, fontWeight: 600, color: "#B45309",
                        background: "#FFF6E5", padding: "2px 8px", borderRadius: 999,
                      }}>
                        {data.huerfanos.length}
                      </span>
                    </div>
                    <p style={{ fontSize: 12.5, color: "var(--muted)", lineHeight: 1.6, margin: "0 0 10px" }}>
                      Estos POCs no tienen <code style={{ fontFamily: "ui-monospace, Menlo, Consolas, monospace" }}>celula_owner_id</code>.
                      No aparecen en la home de ninguna célula — si son tuyos, asígnalos desde la ficha del proyecto.
                    </p>
                    <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: "4px 8px" }}>
                      <TablaPocs pocs={data.huerfanos} />
                    </div>
                  </section>
                )}
              </div>
            </>
          )}

        </div>
      </div>
      <HubFooter />
    </main>
  );
}
