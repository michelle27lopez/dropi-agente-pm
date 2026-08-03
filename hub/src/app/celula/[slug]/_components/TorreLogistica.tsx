"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Torre de control de Logística — la cabecera de /celula/logistica.
//
// Antes la home de la célula abría con "Aún no hay updates registrados" y una
// rejilla plana de LOG-XXX: no decía cómo va el negocio ni dónde duele. Esta
// sección pone primero los indicadores y el mapa de la orden, y deja el mapa
// como el filtro de las iniciativas de abajo.
//
// Todas las cifras salen de proyectos/logistica/_lib/data.ts. Aquí no se
// hardcodea ni un número: si el weekly cambia, esto cambia solo.
// ─────────────────────────────────────────────────────────────────────────────

import { fugas, northStar } from "@/app/proyectos/logistica/_lib/data";
import type { Proyecto as ProyectoDarwin } from "@/components/ProjectCard";
import {
  COLOR_TONO,
  COLOR_TONO_TINT,
  agruparPorEtapa,
  comparacionMensual,
  parseCifra,
  resumenPortafolio,
  sparklinePath,
  sparklinePuntos,
  tonoDeEtapa,
} from "../_lib/logistica-torre";
import "./torre-logistica.css";

const SPARK_ANCHO = 100;
const SPARK_ALTO = 28;

export default function TorreLogistica({
  deDarwin,
  etapaActiva,
  onEtapaChange,
}: {
  deDarwin: ProyectoDarwin[];
  etapaActiva: string | null;
  onEtapaChange: (etapa: string | null) => void;
}) {
  const comparacion = comparacionMensual();
  const { grupos, total, totalEnDarwin } = agruparPorEtapa(deDarwin);
  // El portafolio se recalcula con la etapa seleccionada: si no cambiara al
  // filtrar, no habría forma de saber si el clic hizo algo.
  const portafolio = resumenPortafolio(etapaActiva);
  const grupoActivo = etapaActiva ? grupos.find((g) => g.etapa.nombre === etapaActiva) : null;

  // El % de entrega se dibuja sobre una escala 0–100 completa, con la meta como
  // marca. Recortar el eje haría ver la brecha más grande de lo que es.
  const entregaActual = parseCifra(northStar.baselineCO);
  const entregaMeta = parseCifra(northStar.metaEntrega);

  return (
    <section className="torre-log" aria-label="Torre de control de Logística">
      {/* ── A · North Star ───────────────────────────────────────────────── */}
      <div className="torre-bloque">
        <div className="torre-titulo">
          <h2>El indicador — ¿se movió?</h2>
          {comparacion && <p className="torre-nota">{comparacion.alcance}</p>}
        </div>

        <div className="torre-ns">
          <div className="torre-ns-head">
            <div>
              <p className="torre-ns-label">% de entrega sobre órdenes creadas · Colombia</p>
              <div className="torre-ns-cifra">
                <b>{northStar.baselineCO}</b>
                <span className="torre-ns-flecha">→</span>
                <span className="torre-ns-meta">meta {northStar.metaEntrega}</span>
              </div>
            </div>
            <span className="torre-ns-brecha">brecha {northStar.brecha}</span>
          </div>

          <div className="torre-ns-barra">
            <i style={{ width: `${entregaActual}%` }} />
            <span
              className="torre-ns-tick"
              style={{ left: `${entregaMeta}%` }}
              aria-hidden="true"
            />
          </div>
          <div className="torre-ns-escala">
            <span>0%</span>
            <span>Meta Q3: {northStar.metaQ3}</span>
            <span>100%</span>
          </div>

          {comparacion && (
            <div className="torre-kpis">
              {comparacion.kpis.map((kpi, i) => {
                const d = sparklinePath(kpi.valores, SPARK_ANCHO, SPARK_ALTO);
                const puntos = sparklinePuntos(kpi.valores, SPARK_ANCHO, SPARK_ALTO);
                const color = COLOR_TONO[kpi.tono === "bueno" ? "bueno" : kpi.tono];

                return (
                  <article
                    key={kpi.metrica}
                    className="torre-kpi"
                    style={{ animationDelay: `${i * 70}ms` }}
                  >
                    <p className="torre-kpi-nombre">{kpi.metrica}</p>
                    <div className="torre-kpi-valor">
                      <b>{kpi.valorActual}</b>
                      <span className={`torre-delta is-${kpi.tono}`}>{kpi.delta}</span>
                    </div>

                    <svg
                      className="torre-spark"
                      viewBox={`0 0 ${SPARK_ANCHO} ${SPARK_ALTO}`}
                      preserveAspectRatio="none"
                      role="img"
                      aria-label={`${kpi.metrica}: ${kpi.etiquetas.join(", ")} en ${comparacion.meses.join(", ")}`}
                    >
                      <path className="linea" d={d} stroke={color} />
                      {puntos.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          r={idx === puntos.length - 1 ? 3 : 2}
                          fill={idx === puntos.length - 1 ? color : "var(--card)"}
                          stroke={color}
                          strokeWidth={1.5}
                          vectorEffect="non-scaling-stroke"
                        />
                      ))}
                    </svg>
                    <div className="torre-spark-meses">
                      {comparacion.meses.map((m) => (
                        <span key={m}>{m.slice(0, 3)}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {comparacion && (
          <p className="torre-lectura">
            {comparacion.lectura} <em>{comparacion.entregaNota}</em>
          </p>
        )}
      </div>

      {/* ── B · Las 2 fugas ──────────────────────────────────────────────── */}
      <div className="torre-bloque">
        <div className="torre-titulo">
          <h2>Las 2 fugas que cierran la brecha</h2>
        </div>
        <div className="torre-fugas">
          {fugas.map((f) => (
            <article
              key={f.nombre}
              className="torre-fuga"
              style={{ ["--tono" as string]: COLOR_TONO[f.tono] }}
            >
              <div className="torre-fuga-head">
                <span className="torre-fuga-nombre">
                  <span className="fuga-n" aria-label={`Fuga ${f.n}`}>
                    <span>{f.n}</span>
                  </span>
                  {f.nombre}
                </span>
                <span className="torre-fuga-valor">{f.valor}</span>
              </div>
              <div className="torre-fuga-barra">
                <i style={{ width: `${f.barra}%` }} />
              </div>
              <p className="torre-fuga-desc">{f.desc}</p>
            </article>
          ))}
        </div>
      </div>

      {/* ── C · Mapa de la orden ─────────────────────────────────────────── */}
      <div className="torre-bloque">
        <div className="torre-titulo">
          <h2>El viaje de la orden</h2>
          <p className="torre-nota">Clic en una etapa para filtrar las iniciativas</p>
        </div>

        <div className="torre-mapa">
          <div className="torre-rail">
            {grupos.map((g, i) => {
              const tono = tonoDeEtapa(g.etapa);
              const activa = etapaActiva === g.etapa.nombre;
              const huecos = g.total - g.enDarwin;

              return (
                <button
                  key={g.etapa.n}
                  type="button"
                  className="torre-etapa"
                  aria-pressed={activa}
                  onClick={() => onEtapaChange(activa ? null : g.etapa.nombre)}
                  style={{
                    ["--tono" as string]: COLOR_TONO[tono],
                    ["--tono-tint" as string]: COLOR_TONO_TINT[tono],
                    animationDelay: `${i * 60}ms`,
                  }}
                >
                  <span className="torre-etapa-n">{g.etapa.n}</span>
                  <span className="torre-etapa-nombre">{g.etapa.nombre}</span>
                  <span className="torre-etapa-sub">{g.etapa.sub}</span>
                  {g.etapa.fuga && (
                    <span className="torre-etapa-fuga">
                      {g.etapa.fuga.n && (
                        <span className="fuga-n" aria-label={`Fuga ${g.etapa.fuga.n}`}>
                          <span>{g.etapa.fuga.n}</span>
                        </span>
                      )}
                      {g.etapa.fuga.label}
                    </span>
                  )}
                  <span className="torre-etapa-cuenta">
                    {g.total} {g.total === 1 ? "iniciativa" : "iniciativas"}
                    {huecos > 0 && <span className="hueco"> · {huecos} sin ficha</span>}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="torre-mapa-pie">
            <span>
              {grupoActivo ? (
                <>
                  <b>{grupoActivo.etapa.nombre}</b> · {grupoActivo.total}{" "}
                  {grupoActivo.total === 1 ? "iniciativa" : "iniciativas"} ·{" "}
                  {grupoActivo.enDarwin} con ficha en Darwin
                </>
              ) : (
                <>
                  {total} iniciativas · {totalEnDarwin} con ficha en Darwin ·{" "}
                  {total - totalEnDarwin} solo en el tablero
                </>
              )}
            </span>
            {/* Siempre visible, no solo cuando hay filtro: así se ve que "todas"
                es un estado del mapa y no una acción que aparece de la nada. */}
            <button
              type="button"
              className="torre-limpiar"
              aria-pressed={etapaActiva === null}
              onClick={() => onEtapaChange(null)}
            >
              Todas
            </button>
          </div>
        </div>
      </div>

      {/* ── D · Estado del portafolio ────────────────────────────────────── */}
      <div className="torre-bloque">
        <div className="torre-titulo">
          <h2>Estado del portafolio</h2>
          <p className="torre-nota">
            {etapaActiva
              ? `${portafolio.total} ${portafolio.total === 1 ? "iniciativa" : "iniciativas"} en ${etapaActiva}`
              : `${portafolio.total} iniciativas en discovery activo`}
          </p>
        </div>

        <div className="torre-portafolio">
          <div
            className="torre-stack"
            role="img"
            aria-label={portafolio.tramos
              .map((t) => `${t.nombre}: ${t.cantidad}`)
              .join(" · ")}
          >
            {portafolio.tramos.map((t, i) => (
              <span
                key={t.nombre}
                style={{
                  width: `${t.pct}%`,
                  background: t.color,
                  animationDelay: `${i * 80}ms`,
                }}
              />
            ))}
          </div>

          <div className="torre-leyenda">
            {portafolio.tramos.map((t) => (
              <span key={t.nombre} className="torre-leyenda-item">
                <i className="torre-leyenda-punto" style={{ background: t.color }} />
                {t.nombre} <b>{t.cantidad}</b>
              </span>
            ))}
          </div>

          <div className="torre-contadores">
            <div className="torre-contador" style={{ ["--tono" as string]: "var(--danger)" }}>
              <b>{portafolio.bloqueadas.length}</b>
              <span>bloqueadas — no avanzan por algo externo</span>
            </div>
            <div className="torre-contador" style={{ ["--tono" as string]: "var(--info)" }}>
              <b>{portafolio.sinRegistrar.length}</b>
              <span>sin ficha en Darwin — trabajo real que no se ve aquí</span>
            </div>
            <div className="torre-contador" style={{ ["--tono" as string]: "var(--warning)" }}>
              <b>{portafolio.sinDoc.length}</b>
              <span>sin documentación en el repo</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
