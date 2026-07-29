"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Las iniciativas de Logística agrupadas por etapa del viaje de la orden, en
// lugar de la rejilla plana de "Discovery projects".
//
// Cada grupo mezcla las dos fuentes:
//   · con ficha en Darwin  → <ProjectCard> tal cual, para no perder el selector
//     de estado_interno, el vpv ni el "+ Crear POC".
//   · solo en el tablero   → chips. No se pintan como una tarjeta más a propósito:
//     que se vea de un vistazo cuáles no tienen ficha es parte del punto.
//
// Los POC no se separan en su propia sección aquí (como hace el resto de las
// células): el eje de organización pasa a ser la etapa, así que LOG-004 aparece
// en Generación, que es donde ataca.
// ─────────────────────────────────────────────────────────────────────────────

import { ProjectCard, type Proyecto as ProyectoDarwin } from "@/components/ProjectCard";
import {
  COLOR_TONO,
  COLOR_TONO_TINT,
  agruparPorEtapa,
  tonoDeEtapa,
} from "../_lib/logistica-torre";
import "./torre-logistica.css";

export default function ProyectosPorEtapa({
  deDarwin,
  etapaActiva,
  canCreate,
  pocsByParent,
  onEstadoChange,
  onVpvChange,
  onCrearPoc,
}: {
  deDarwin: ProyectoDarwin[];
  etapaActiva: string | null;
  canCreate: boolean;
  pocsByParent: Map<string, ProyectoDarwin[]>;
  onEstadoChange: (id: string, estado: string) => void;
  onVpvChange: (id: string, vpv: number | null) => void;
  onCrearPoc: (parent: ProyectoDarwin, name: string, summary: string) => Promise<void>;
}) {
  const { grupos, sinEtapa } = agruparPorEtapa(deDarwin);
  const visibles = etapaActiva ? grupos.filter((g) => g.etapa.nombre === etapaActiva) : grupos;

  return (
    <div className="torre-etapas-grupos">
      {visibles.map((g) => {
        const tono = tonoDeEtapa(g.etapa);
        const conFicha = g.filas.filter((f) => f.darwin);
        const sinFicha = g.filas.filter((f) => !f.darwin);

        return (
          <section
            key={g.etapa.n}
            className="torre-grupo"
            style={{
              ["--tono" as string]: COLOR_TONO[tono],
              ["--tono-tint" as string]: COLOR_TONO_TINT[tono],
            }}
          >
            <header className="torre-grupo-head">
              <span className="torre-grupo-n">{g.etapa.n}</span>
              <h3 className="torre-grupo-nombre">{g.etapa.nombre}</h3>
              <span className="torre-grupo-sub">{g.etapa.sub}</span>
              {g.etapa.fuga && (
                <span className="torre-grupo-fuga">
                  {g.etapa.fuga.n && (
                    <span className="fuga-n" aria-label={`Fuga ${g.etapa.fuga.n}`}>
                      <span>{g.etapa.fuga.n}</span>
                    </span>
                  )}
                  {g.etapa.fuga.label}
                </span>
              )}
            </header>

            {conFicha.length > 0 ? (
              <div className="torre-grupo-cards">
                {conFicha.map(({ iniciativa, darwin }) => (
                  <ProjectCard
                    key={darwin!.id}
                    project={darwin!}
                    dark={false}
                    canCreate={canCreate}
                    pocs={pocsByParent.get(darwin!.id) ?? []}
                    onEstadoChange={onEstadoChange}
                    onVpvChange={onVpvChange}
                    onCrearPoc={onCrearPoc}
                    // Sin esto la tarjeta enlaza a `/proyectos/log-00X`, que no
                    // existe: los 11 LOG-XXX tienen `prototype_url` en NULL. El
                    // tablero sí tiene ficha para cada una, así que se apunta ahí.
                    urlOverride={`/proyectos/logistica/proyecto/${iniciativa.slug}`}
                  />
                ))}
              </div>
            ) : (
              <p className="torre-vacio">Ninguna iniciativa de esta etapa tiene ficha en Darwin.</p>
            )}

            {sinFicha.length > 0 && (
              <div className="torre-huerfanas">
                <p className="torre-huerfanas-label">
                  También en esta etapa · sin ficha en Darwin
                </p>
                <div className="torre-chips">
                  {sinFicha.map(({ iniciativa }) => (
                    <a
                      key={iniciativa.slug}
                      className="torre-chip"
                      href={`/proyectos/logistica/proyecto/${iniciativa.slug}`}
                    >
                      <span className="marca" aria-hidden="true">
                        ○
                      </span>
                      {iniciativa.destacado && <span aria-hidden="true">⭐</span>}
                      {iniciativa.nombre}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </section>
        );
      })}

      {/* Proyectos creados en Darwin que el tablero todavía no conoce. Hoy no
          hay ninguno, pero si alguien usa "+ Proyecto vacío" caería aquí en vez
          de desaparecer de la vista. */}
      {!etapaActiva && sinEtapa.length > 0 && (
        <section className="torre-grupo">
          <header className="torre-grupo-head">
            <h3 className="torre-grupo-nombre">Sin etapa asignada</h3>
            <span className="torre-grupo-sub">
              Están en Darwin pero todavía no figuran en el tablero de logística
            </span>
          </header>
          <div className="torre-grupo-cards">
            {sinEtapa.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                dark={false}
                canCreate={canCreate}
                pocs={pocsByParent.get(p.id) ?? []}
                onEstadoChange={onEstadoChange}
                onVpvChange={onVpvChange}
                onCrearPoc={onCrearPoc}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
