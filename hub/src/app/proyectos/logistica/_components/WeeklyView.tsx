"use client";

import { useState } from "react";
import { jiraUrl, type Weekly } from "@/app/proyectos/logistica/_lib/data";
import PrintButton from "@/app/proyectos/logistica/_components/PrintButton";
import { Card, Table, PageHeader, SectionTitle, type Column } from "@/app/proyectos/logistica/_components/ui";

// Columnas de la comparación mensual. El delta se tiñe porque es lo único de
// la tabla que pide una reacción; el resto son cifras de contexto.
type FilaMensual = NonNullable<Weekly["comparacionMensual"]>["filas"][number];

const COLUMNAS_MENSUAL: Column<FilaMensual>[] = [
  { key: "metrica", header: "Métrica", width: "34%", render: (f) => f.metrica },
  { key: "abril", header: "Abril", align: "right", render: (f) => f.abril },
  { key: "mayo", header: "Mayo", align: "right", render: (f) => f.mayo },
  { key: "junio", header: "Junio", align: "right", render: (f) => f.junio },
  {
    key: "delta",
    header: "Delta",
    align: "right",
    render: (f) => <span className={`wk-delta is-${f.tono}`}>{f.delta}</span>,
  },
];

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
      {/* Sin numeración: DESIGN.md §6 prohíbe el patrón "01 / 02 / 03" en los
          títulos de sección. La secuencia ya la da el orden de lectura. */}
      <SectionTitle hint={comparacion.alcance}>{comparacion.titulo}</SectionTitle>
      <Card>
        {/* Era una tabla falsa: divs con role="table" sobre CSS Grid. Funcionaba,
            pero duplicaba el primitivo y obligaba a mantener su propio
            responsive con data-label. Ahora es una <table> de verdad. */}
        <Table
          columns={COLUMNAS_MENSUAL}
          rows={comparacion.filas}
          getKey={(f) => f.metrica}
        />
        <p className="wk-monthly-reading">{comparacion.lectura}</p>
        <p className="wk-monthly-caveat">
          <strong>% entrega:</strong> {comparacion.entregaNota}
        </p>
      </Card>

      {w.secciones.map((seccion, index) => (
        <section className="wk-executive-section" key={seccion.titulo}>
          {/* El título vive en SectionTitle; la nota de la sección es su `hint`.
              Antes se repetían: título de sección + <h3> idéntico debajo. */}
          <SectionTitle hint={seccion.nota}>
            {`${seccion.titulo} · ${seccion.proyectos.length}`}
          </SectionTitle>
          <div className="wk-seccion">
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
                    {proyecto.impacto && (
                      <p className="wk-proj2-impacto">
                        <span className="wk-impacto-badge">💰 Impacto</span>
                        {proyecto.impacto}
                      </p>
                    )}
                    {proyecto.enlace && (
                      <a href={proyecto.enlace.href} className="wk-proj-ticket">
                        {proyecto.enlace.label} →
                      </a>
                    )}
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
          <SectionTitle>Foco de la siguiente semana</SectionTitle>
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
      {/* El selector de semana y el botón de imprimir van en la cabecera, no en
          una barra suelta encima: son acciones sobre lo que se está viendo. */}
      <PageHeader
        title="Weekly Product · Logística"
        subtitle={w.foco}
        aside={
          <div className="wk-switch no-print">
            <label className="wk-switch-label" htmlFor="wk-semana">
              Semana
            </label>
            <select
              id="wk-semana"
              className="wk-select"
              value={idx}
              onChange={(e) => setIdx(Number(e.target.value))}
            >
              {weeklies.map((wk, i) => (
                <option key={wk.id} value={i}>
                  {wk.semana}
                  {i === 0 ? " · actual" : ""}
                </option>
              ))}
            </select>
            <PrintButton docTitle={`Weekly Product · Logística — ${w.semana}`} />
          </div>
        }
      />
      <p className="wk-fecha">{w.fecha}</p>

      {w.comparacionMensual ? <ExecutiveWeekly w={w} /> : <>

      {/* 1 · BRECHA DE ENTREGA */}
      <SectionTitle hint="De dónde salen los puntos que faltan.">La brecha de entrega</SectionTitle>
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
          {w.brecha.perdidas.map((d) => (
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
      <SectionTitle>Los indicadores, como están hoy</SectionTitle>
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
      <SectionTitle hint="Tiempo de la orden por tramo. La meta es menos de 24 horas.">Primera lectura</SectionTitle>
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
      <SectionTitle>Hallazgos de la semana</SectionTitle>
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
      <SectionTitle hint="En qué va cada uno.">Proyectos</SectionTitle>
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
                    {p.enlace && (
                      <a href={p.enlace.href} className="wk-proj-ticket">
                        {p.enlace.label} →
                      </a>
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
