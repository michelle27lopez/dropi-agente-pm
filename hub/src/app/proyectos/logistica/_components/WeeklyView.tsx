"use client";

import { useState } from "react";
import { jiraUrl, type Weekly } from "@/app/proyectos/logistica/_lib/data";
import PrintButton from "@/app/proyectos/logistica/_components/PrintButton";

function horasTono(horas: number): "verde" | "ambar" | "rojo" {
  if (horas <= 24) return "verde";
  if (horas <= 48) return "ambar";
  return "rojo";
}

function formatHoras(horas: number) {
  return `${horas.toFixed(horas % 1 === 0 ? 0 : 1).replace(".", ",")}h`;
}

function formatPct(pct?: number) {
  if (pct === undefined) return "";
  return `${pct.toFixed(2).replace(".", ",")}%`;
}

function ExecutiveWeekly({ w }: { w: Weekly }) {
  const comparacion = w.comparacionMensual;
  if (!comparacion) return null;

  return (
    <>
      <div className="eyebrow">1 · El indicador — ¿se movió?</div>
      <section className="wk-kpi wk-monthly">
        <div className="wk-monthly-head">
          <div>
            <h2>{comparacion.titulo}</h2>
            <p>{comparacion.alcance}</p>
          </div>
          <span className="wk-monthly-status">Movilización plana</span>
        </div>
        <div className="wk-monthly-table" role="table" aria-label={comparacion.titulo}>
          <div className="wk-monthly-row is-head" role="row">
            <span role="columnheader">Métrica</span>
            <span role="columnheader">Abril</span>
            <span role="columnheader">Mayo</span>
            <span role="columnheader">Junio</span>
            <span role="columnheader">Delta</span>
          </div>
          {comparacion.filas.map((fila) => (
            <div className="wk-monthly-row" role="row" key={fila.metrica}>
              <strong role="cell">{fila.metrica}</strong>
              <span role="cell" data-label="Abril">{fila.abril}</span>
              <span role="cell" data-label="Mayo">{fila.mayo}</span>
              <span role="cell" data-label="Junio">{fila.junio}</span>
              <span role="cell" data-label="Delta" className={`is-${fila.tono}`}>{fila.delta}</span>
            </div>
          ))}
        </div>
        <p className="wk-monthly-reading">{comparacion.lectura}</p>
        <p className="wk-monthly-caveat"><strong>% entrega:</strong> {comparacion.entregaNota}</p>
      </section>

      {w.secciones.map((seccion, index) => (
        <section className="wk-executive-section" key={seccion.titulo}>
          <div className="eyebrow">{index + 2} · {seccion.titulo}</div>
          <div className="wk-seccion">
            <div className="wk-seccion-head">
              <h3>{seccion.titulo}</h3>
              <span className="wk-seccion-nota">{seccion.nota}</span>
              <span className="wk-seccion-count">{seccion.proyectos.length}</span>
            </div>
            {index === 0 && w.avanceInvestigacion && (
              <div className="wk-research-progress">
                <div className="wk-research-intro">
                  <strong>{w.avanceInvestigacion.titulo}</strong>
                  <p>{w.avanceInvestigacion.descripcion}</p>
                </div>
                <div className="wk-research-steps">
                  {w.avanceInvestigacion.pasos.map((paso, pasoIndex) => (
                    <div className={`wk-research-step is-${paso.estado}`} key={paso.nombre}>
                      <span className="wk-research-index">{pasoIndex + 1}</span>
                      <div>
                        <strong>{paso.nombre}</strong>
                        <small>{paso.detalle}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="wk-seccion-body">
              {seccion.proyectos.map((proyecto) => {
                const url = jiraUrl(proyecto.ticket);
                return (
                  <div className="wk-proj2" key={proyecto.nombre}>
                    <div className="wk-proj2-top">
                      <span className="wk-proj2-nombre">{proyecto.nombre}</span>
                      <span className={`wk-estado est-${proyecto.estadoTono}`}>{proyecto.estado}</span>
                    </div>
                    <p className="wk-proj2-nota">{proyecto.nota}</p>
                    {url && (
                      <a href={url} target="_blank" rel="noreferrer" className="wk-proj-ticket">
                        {proyecto.ticket} ↗
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ))}

      {w.focoSiguienteSemana && (
        <section className="wk-next-focus">
          <div className="eyebrow">{w.secciones.length + 2} · Foco de la siguiente semana</div>
          <div className="wk-kpi">
            <ol>
              {w.focoSiguienteSemana.map((foco) => <li key={foco}>{foco}</li>)}
            </ol>
          </div>
        </section>
      )}
    </>
  );
}

// El Weekly Product con switch de semana: se conservan todas las semanas y se
// elige cuál ver (por defecto, la más reciente = weeklies[0]).
export default function WeeklyView({ weeklies }: { weeklies: Weekly[] }) {
  const [idx, setIdx] = useState(0);
  const w = weeklies[idx];

  const gapPct = w.brecha.meta - w.brecha.actual;
  const dropiTotal = w.tiempo.dropi.reduce((sum, f) => sum + f.horas, 0);
  const dropiMetaTotal = w.tiempo.dropi.reduce((sum, f) => sum + f.metaHoras, 0);
  const dropiPlan = w.tiempo.dropi.reduce(
    (acc, f) => {
      const last = acc.rows[acc.rows.length - 1];
      const inicio = last ? last.fin : 0;
      const metaInicio = last ? last.metaFin : 0;
      acc.rows.push({ ...f, inicio, fin: inicio + f.horas, metaInicio, metaFin: metaInicio + f.metaHoras });
      return acc;
    },
    { rows: [] as (typeof w.tiempo.dropi[number] & { inicio: number; fin: number; metaInicio: number; metaFin: number })[] },
  ).rows;
  const carrierPlan = w.tiempo.carrier.map((f) => ({ ...f, inicio: 0, fin: f.horas, metaInicio: 0, metaFin: f.metaHoras }));
  const dropiScale = Math.ceil(Math.max(dropiTotal, dropiMetaTotal, 24) / 12) * 12;
  const carrierScale = Math.ceil(Math.max(...w.tiempo.carrier.map((f) => f.horas), 24) / 24) * 24;
  const dropiTicks = Array.from({ length: dropiScale / 12 + 1 }, (_, i) => i * 12);
  const carrierTicks = Array.from({ length: carrierScale / 24 + 1 }, (_, i) => i * 24);

  return (
    <main className="page wk-print">
      {/* Barra: elegir semana + bajar el PDF de esa semana. Selector desplegable
          porque las semanas se acumulan y en botones no caben. */}
      <div className="wk-switch no-print">
        <label className="wk-switch-label" htmlFor="wk-semana">Semana</label>
        <select
          id="wk-semana"
          className="wk-select"
          value={idx}
          onChange={(e) => setIdx(Number(e.target.value))}
        >
          {weeklies.map((wk, i) => (
            <option key={wk.id} value={i}>
              {wk.semana}{i === 0 ? " · actual" : ""}
            </option>
          ))}
        </select>
        <PrintButton docTitle={`Weekly Product · Logística — ${w.semana}`} />
      </div>

      {/* Cabecera */}
      <section className="wk-hero">
        <span className="tag">{w.semana}</span>
        <h1>Weekly Product · Logística</h1>
        <p className="wk-fecha">{w.fecha}</p>
        <p className="wk-foco">{w.foco}</p>
      </section>

      {w.comparacionMensual ? <ExecutiveWeekly w={w} /> : <>

      {/* 1 · BRECHA DE ENTREGA */}
      <div className="eyebrow">1 · La brecha de entrega — de dónde salen los puntos que faltan</div>
      <div className="wk-kpi">
        <div className="wk-kpi-name">Tasa de entrega — dónde estamos vs. la meta (todos los países)</div>
        <div className="wk-gap-row">
          <div className="wk-gap-item">
            <span className="k">Hoy (consolidado)</span>
            <span className="v now">{w.brecha.actualLabel}</span>
          </div>
          <div className="wk-gap-arrow">
            <span className="brecha">FALTAN {w.brecha.gap}</span>
            <span className="arrow">→</span>
          </div>
          <div className="wk-gap-item">
            <span className="k">Meta</span>
            <span className="v goal">{w.brecha.metaLabel}</span>
          </div>
          <div className="wk-gap-item q3">
            <span className="k">Meta Q3</span>
            <span className="v">{w.brecha.metaQ3}</span>
          </div>
        </div>
        <div className="wk-gap-bar">
          <i style={{ width: `${w.brecha.actual}%` }} />
          <span className="wk-gap-shade" style={{ left: `${w.brecha.actual}%`, width: `${gapPct}%` }} />
          <span className="wk-gap-tick" style={{ left: `${w.brecha.meta}%` }}>
            <b>meta 70%</b>
          </span>
        </div>
        <p className="wk-pais-foco">{w.brecha.paisFoco}</p>
        <div className="wk-desglose">
          {w.brecha.fugas.map((d) => (
            <div key={d.label} className={`wk-desg-item d-${d.tono}`}>
              <span className="dv">{d.valor}</span>
              <span className="dl">{d.label}</span>
              <span className="ds">{d.sub}</span>
            </div>
          ))}
        </div>
        <p className="wk-okr-lectura">{w.brecha.lectura}</p>
      </div>

      {/* 2 · INDICADORES HOY */}
      <div className="eyebrow">2 · Los indicadores, como están hoy</div>
      <div className="wk-ind">
        {w.indicadores.map((k) => (
          <div key={k.nombre} className={`wk-ind-card i-${k.tono}`}>
            <div className="wk-ind-top">
              <span className="wk-ind-nombre">{k.nombre}</span>
              <span className={`wk-ind-estado e-${k.tono}`}>{k.estado}</span>
            </div>
            <div className="wk-ind-valor">
              {k.valor}
              {k.meta && <span className="wk-ind-meta">/ meta {k.meta}</span>}
            </div>
            <p className="wk-ind-nota">{k.nota}</p>
          </div>
        ))}
      </div>

      {/* 3 · TIEMPO POR FASES */}
      <div className="eyebrow">3 · Primera lectura — tiempo de la orden por tramo (meta &lt;24h)</div>
      <div className="wk-kpi">
        <div className="wk-tiempo-summary">
          <div>
            <span className="wk-tiempo-kicker">Objetivo de la célula</span>
            <strong>Orden en transportadora en menos de 24h</strong>
            <p>El Gantt separa lo que puede mover Dropi de lo que ya depende del carrier.</p>
          </div>
          <div className="wk-tiempo-stat">
            <span>Ruta Dropi de referencia</span>
            <strong>{formatHoras(dropiTotal)}</strong>
            <small>meta operativa {formatHoras(dropiMetaTotal)}</small>
          </div>
        </div>

        <div className="wk-gantt-legend">
          <span><i className="leg-actual" />Actual</span>
          <span><i className="leg-meta" />Meta de reducción</span>
          <span><i className="leg-line" />Límite 24h</span>
        </div>

        <div className="wk-gantt-section s-dropi">
          <div className="wk-tiempo-col-head">
            <span className="dot dot-verde" />
            Lo que controla Dropi <span className="muted">(secuencia hasta handoff)</span>
          </div>
          <div className="wk-gantt-axis">
            <span />
            <div>
              {dropiTicks.map((h) => <b key={h} style={{ left: `${(h / dropiScale) * 100}%` }}>{h}h</b>)}
            </div>
            <span>actual / meta</span>
          </div>
          {dropiPlan.map((f) => (
            <div key={f.fase} className="wk-gantt-row">
              <div className="wk-gantt-label">
                {f.responsable && <span className="wk-gantt-resp">Resp · {f.responsable}</span>}
                <strong>{f.fase}</strong>
                <span>{f.palanca}</span>
                <small>{f.volumen} · {formatPct(f.cumplimiento)} &lt;24h · {f.criticos} críticos</small>
              </div>
              <div className="wk-gantt-track">
                <span className="wk-gantt-limit" style={{ left: `${(24 / dropiScale) * 100}%` }} />
                <i
                  className="wk-gantt-bar is-actual is-dropi"
                  style={{ left: `${(f.inicio / dropiScale) * 100}%`, width: `${(f.horas / dropiScale) * 100}%` }}
                />
                <i
                  className="wk-gantt-bar is-meta"
                  style={{ left: `${(f.metaInicio / dropiScale) * 100}%`, width: `${(f.metaHoras / dropiScale) * 100}%` }}
                />
              </div>
              <div className="wk-gantt-values">
                <strong>{formatHoras(f.horas)}</strong>
                <span>meta {formatHoras(f.metaHoras)}</span>
              </div>
            </div>
          ))}
          <div className="wk-gantt-total">
            <span>Ruta Dropi 1→6</span>
            <strong>{formatHoras(dropiTotal)}</strong>
            <em>{dropiTotal <= 24 ? `${formatHoras(24 - dropiTotal)} de colchón vs 24h` : `${formatHoras(dropiTotal - 24)} por encima de 24h`}</em>
          </div>
        </div>

        <div className="wk-gantt-section s-carrier">
          <div className="wk-tiempo-col-head">
            <span className="dot dot-rojo" />
            Lo que hace el carrier <span className="muted">(post-handoff, fuera del KPI Dropi)</span>
          </div>
          <div className="wk-gantt-axis">
            <span />
            <div>
              {carrierTicks.map((h) => <b key={h} style={{ left: `${(h / carrierScale) * 100}%` }}>{h}h</b>)}
            </div>
            <span>actual / meta</span>
          </div>
          {carrierPlan.map((f) => (
            <div key={f.fase} className="wk-gantt-row">
              <div className="wk-gantt-label">
                <strong>{f.fase}</strong>
                <span>{f.palanca}</span>
                <small>{f.volumen} · {formatPct(f.cumplimiento)} &lt;24h · {f.criticos} críticos</small>
              </div>
              <div className="wk-gantt-track">
                <span className="wk-gantt-limit" style={{ left: `${(24 / carrierScale) * 100}%` }} />
                <i
                  className={`wk-gantt-bar is-actual is-${horasTono(f.horas)}`}
                  style={{ left: 0, width: `${(f.horas / carrierScale) * 100}%` }}
                />
                <i
                  className="wk-gantt-bar is-meta"
                  style={{ left: 0, width: `${(f.metaHoras / carrierScale) * 100}%` }}
                />
              </div>
              <div className="wk-gantt-values">
                <strong>{formatHoras(f.horas)}</strong>
                <span>meta {formatHoras(f.metaHoras)}</span>
              </div>
            </div>
          ))}
          <p className="wk-tiempo-nota">
            Carrier se muestra abajo porque empieza después del handoff. Sirve para priorizar Selección de Transportadoras, no para culpar el KPI interno de Dropi.
          </p>
        </div>

        <p className="wk-okr-lectura">{w.tiempo.lectura}</p>
        <div className="wk-tiempo-next">
          <span>Próximos pasos</span>
          <ul>
            {w.tiempo.proximosPasos.map((p) => <li key={p}>{p}</li>)}
          </ul>
        </div>
      </div>

      {/* 4 · HALLAZGOS */}
      <div className="eyebrow">4 · Hallazgos de la semana</div>
      <div className="wk-hallazgos">
        {w.hallazgos.map((h) => (
          <div key={h.titulo} className={`wk-hallazgo h-${h.tono}`}>
            <h3>{h.titulo}</h3>
            <p>{h.detalle}</p>
            {h.compara && (
              <div className="wk-compara">
                <span className="wk-compara-tit">{h.compara.etiqueta}</span>
                <div className="wk-compara-row">
                  <span className="lbl">{h.compara.a.label}</span>
                  <div className="wk-compara-bar"><i className="b-verde" style={{ width: `${h.compara.a.pct * 2}%` }} /></div>
                  <span className="pct c-verde">{h.compara.a.pct}%</span>
                </div>
                <div className="wk-compara-row">
                  <span className="lbl">{h.compara.b.label}</span>
                  <div className="wk-compara-bar"><i className="b-rojo" style={{ width: `${h.compara.b.pct * 2}%` }} /></div>
                  <span className="pct c-rojo">{h.compara.b.pct}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 5 · PROYECTOS POR SECCIÓN */}
      <div className="eyebrow">5 · Proyectos — en qué va cada uno</div>
      <div className="wk-secciones">
        {w.secciones.map((s) => (
          <div key={s.titulo} className="wk-seccion">
            <div className="wk-seccion-head">
              <h3>{s.titulo}</h3>
              <span className="wk-seccion-nota">{s.nota}</span>
              <span className="wk-seccion-count">{s.proyectos.length}</span>
            </div>
            <div className="wk-seccion-body">
              {s.proyectos.map((p) => {
                const url = jiraUrl(p.ticket);
                return (
                  <div key={p.nombre} className="wk-proj2">
                    <div className="wk-proj2-top">
                      <span className="wk-proj2-nombre">{p.nombre}</span>
                      <span className={`wk-estado est-${p.estadoTono}`}>{p.estado}</span>
                    </div>
                    <p className="wk-proj2-nota">{p.nota}</p>
                    {p.impacto && (
                      <p className="wk-proj2-impacto">
                        <span className="wk-impacto-badge">💰 Impacto</span>
                        {p.impacto}
                      </p>
                    )}
                    {url && (
                      <a href={url} target="_blank" rel="noreferrer" className="wk-proj-ticket">
                        {p.ticket} ↗
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      </>}
    </main>
  );
}
