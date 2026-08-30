"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jiraUrl, type Hallazgo, type IndicadorHoy, type ProyectoLite, type Weekly } from "@/app/proyectos/logistica/_lib/data";
import { formatHoras, formatPct, formatPct1, partir } from "@/app/proyectos/logistica/_lib/format";
import PrintButton from "@/app/proyectos/logistica/_components/PrintButton";
import SerieMensual from "@/app/proyectos/logistica/_components/charts/SerieMensual";
import BarrasHorizontales from "@/app/proyectos/logistica/_components/charts/BarrasHorizontales";
import {
  Bar,
  Card,
  FilterPills,
  KpiCard,
  Narrativa,
  Pill,
  Table,
  PageHeader,
  SectionTitle,
  type Column,
  type Tone,
} from "@/app/proyectos/logistica/_components/ui";

// El Weekly Product de Logística.
//
// Dos renders según el dato: las semanas con `comparacionMensual` usan el
// formato ejecutivo (ExecutiveWeekly); las anteriores (w27–w30) conservan su
// layout histórico (HistoricWeekly) sin tocar — se dejaron de escribir así el
// 17-jul y no vale la pena migrarlas.
//
// El formato ejecutivo se rediseñó el 28-ago sobre el kit `ui/`, replicando lo
// que funciona en las pantallas de Suppliers: KPI cards elegibles que cambian
// la gráfica de al lado, serie mensual con recharts, países en barras contra
// la meta, y cada sección de proyectos como cards con estado. Antes cada bloque
// tenía su propia card (.wk-ind-card, .wk-proj2, .wk-kpi) y su propio badge
// (.wk-estado.est-*): cuatro vocabularios para decir "estado".

// Vocabulario del weekly → los cuatro estados del sistema. `IndicadorHoy` y
// `ProyectoLite` hablan en verde/ámbar/rojo porque así los escribe quien
// redacta; el kit habla en ok/warn/risk. La traducción vive aquí, una vez.
const TONO_INDICADOR: Record<IndicadorHoy["tono"], Tone> = { bueno: "ok", alerta: "warn", malo: "risk" };
const TONO_HALLAZGO: Record<Hallazgo["tono"], Tone> = {
  confirmacion: "risk",
  carrier: "info",
  zona: "ok",
};

const TONO_ESTADO: Record<ProyectoLite["estadoTono"], Tone> = {
  verde: "ok",
  ambar: "warn",
  rojo: "risk",
  azul: "info",
  gris: "neutral",
};

type FilaMensual = NonNullable<Weekly["comparacionMensual"]>["filas"][number];
type FilaPais = NonNullable<NonNullable<Weekly["comparacionMensual"]>["porPais"]>["filas"][number];

// Los meses eran tres columnas fijas (abril/mayo/junio). Al cerrar julio había
// que renombrarlas todas o tirar abril, así que la cabecera se arma desde los
// datos: la ventana se corre cambiando `meses` y el render no se entera.
function columnasMensual(meses: string[]): Column<FilaMensual>[] {
  return [
    { key: "metrica", header: "Métrica", width: "28%", render: (f) => f.metrica },
    ...meses.map((mes, i) => ({
      key: mes,
      header: mes,
      align: "right" as const,
      render: (f: FilaMensual) => f.valores[i] ?? "",
    })),
    {
      key: "delta",
      header: "Delta",
      align: "right" as const,
      render: (f: FilaMensual) => <span className={`u-delta is-${f.tono}`}>{f.delta}</span>,
    },
  ];
}

// Tono por distancia a la meta de movilización, no por umbrales inventados: en
// la meta o encima es verde, hasta diez puntos por debajo es ámbar, más abajo
// es rojo. Con meta 90% eso deja a casi todos los países en ámbar — que es
// exactamente lo que dice el dato.
function tonoMovilizacion(pct: number, meta: number): Tone {
  if (pct >= meta) return "ok";
  if (pct >= meta - 10) return "warn";
  return "risk";
}

function columnasPais(meta: number): Column<FilaPais>[] {
  return [
    {
      key: "pais",
      header: "País",
      width: "22%",
      render: (f) => (
        <>
          <strong className="u-celda__nombre">{f.pais}</strong>
          <span className="u-celda__sub">{f.participacion}</span>
        </>
      ),
    },
    { key: "ordenes", header: "Órdenes", align: "right", render: (f) => f.ordenes },
    {
      key: "movilizacion",
      header: "Movilización",
      width: "24%",
      render: (f) => (
        <div className="u-celda__medida">
          <Bar
            value={f.movilizacion}
            meta={meta}
            tone={tonoMovilizacion(f.movilizacion, meta)}
            label={`${f.pais}: ${formatPct1(f.movilizacion)} de movilización, meta ${meta}%`}
          />
          <span>{formatPct1(f.movilizacion)}</span>
        </div>
      ),
    },
    { key: "noMovilizado", header: "No movilizado", align: "right", render: (f) => f.noMovilizado },
    { key: "entrega", header: "% entrega", align: "right", render: (f) => formatPct1(f.entrega) },
    { key: "transportadoras", header: "Transp.", align: "right", render: (f) => f.transportadoras },
  ];
}

function horasTono(horas: number): "verde" | "ambar" | "rojo" {
  if (horas <= 24) return "verde";
  if (horas <= 48) return "ambar";
  return "rojo";
}

function Proyectos({ proyectos }: { proyectos: ProyectoLite[] }) {
  return (
    <div className="u-grid" style={{ ["--u-min" as string]: "300px" }}>
      {proyectos.map((p) => {
        const tone = TONO_ESTADO[p.estadoTono];
        const jira = jiraUrl(p.ticket);
        return (
          <Card key={p.nombre} tone={tone}>
            <div className="u-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <span className="u-card__title">{p.nombre}</span>
              <Pill tone={tone}>{p.estado}</Pill>
            </div>
            <p className="u-card__body">{p.nota}</p>
            {p.impacto && (
              <div className="u-row u-card__impacto">
                <Pill tone="ok">Impacto</Pill>
                <span>{p.impacto}</span>
              </div>
            )}
            {(p.enlace || jira) && (
              <div className="u-row" style={{ marginTop: 10, gap: 14 }}>
                {p.enlace && (
                  <a href={p.enlace.href} className="u-link" target={p.enlace.href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">
                    {p.enlace.label} →
                  </a>
                )}
                {jira && (
                  <a href={jira} target="_blank" rel="noreferrer" className="u-link">
                    {p.ticket} ↗
                  </a>
                )}
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function ExecutiveWeekly({ w }: { w: Weekly }) {
  const comparacion = w.comparacionMensual;
  // La serie que se grafica. Arranca en la del primer indicador que declare
  // una; si ninguno la declara, en la primera fila de la tabla.
  const [serie, setSerie] = useState<string>(
    () => w.indicadores.find((k) => k.serie)?.serie ?? comparacion?.filas[0]?.metrica ?? "",
  );
  if (!comparacion) return null;

  const fila = comparacion.filas.find((f) => f.metrica === serie) ?? comparacion.filas[0];
  const [focoTitulo, focoDetalle] = partir(w.foco);
  const [lecturaTitulo, lecturaDetalle] = partir(comparacion.lectura);
  const [entregaTitulo, entregaDetalle] = partir(comparacion.entregaNota);
  const metaSerie = fila.metrica === "Movilización" ? comparacion.porPais?.metaMovilizacion ?? 90 : undefined;

  return (
    <>
      <Narrativa eyebrow={w.semana} titulo={focoTitulo}>
        {focoDetalle && <p>{focoDetalle}</p>}
      </Narrativa>

      {/* ── Los indicadores, como están hoy ─────────────────────────────────
          Una KPI card por indicador. La que declara `serie` se puede elegir
          y cambia la gráfica del cierre mensual — mismo patrón que el Metrics
          Lab de Suppliers, sin duplicar el dato. */}
      <SectionTitle>Los indicadores, como están hoy</SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "240px" }}>
        {w.indicadores.map((k) => {
          const tone = TONO_INDICADOR[k.tono];
          return (
            <KpiCard
              key={k.nombre}
              label={k.nombre}
              value={k.valor}
              meta={k.meta}
              tone={tone}
              delta={{ text: k.estado, trend: k.trend, tone }}
              hint={k.nota}
              selected={k.serie ? k.serie === serie : undefined}
              onSelect={k.serie ? () => setSerie(k.serie!) : undefined}
            />
          );
        })}
      </div>

      {/* ── Cierre mensual ──────────────────────────────────────────────────
          Tabla y gráfica leen el mismo texto; la gráfica es la tendencia y la
          tabla la precisión. Sin numeración de secciones (DESIGN.md §6). */}
      <SectionTitle hint={comparacion.alcance}>{comparacion.titulo}</SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "340px", alignItems: "start" }}>
        <Table columns={columnasMensual(comparacion.meses)} rows={comparacion.filas} getKey={(f) => f.metrica} />
        <Card>
          <div className="u-row" style={{ justifyContent: "space-between" }}>
            <span className="u-stat__label">Serie mensual</span>
            <FilterPills
              label="Métrica de la gráfica"
              options={comparacion.filas.map((f) => ({ value: f.metrica, label: f.metrica }))}
              value={fila.metrica}
              onChange={setSerie}
            />
          </div>
          <SerieMensual
            key={fila.metrica}
            meses={comparacion.meses}
            valores={fila.valores}
            nombre={fila.metrica}
            tone={TONO_INDICADOR[fila.tono]}
            meta={metaSerie}
            height={200}
          />
        </Card>
      </div>
      <div className="u-grid" style={{ ["--u-min" as string]: "340px", marginTop: 12 }}>
        <Narrativa eyebrow="Lectura" titulo={lecturaTitulo}>
          {lecturaDetalle && <p>{lecturaDetalle}</p>}
        </Narrativa>
        <Narrativa eyebrow="% entrega" tone="warn" titulo={entregaTitulo}>
          {entregaDetalle && <p>{entregaDetalle}</p>}
        </Narrativa>
      </div>

      {/* ── Por país ────────────────────────────────────────────────────────
          El consolidado esconde que el rango va de 58,8% a 90,3%: un solo
          número ponderado por Colombia no deja ver dónde está la fuga. Las
          barras dan el vistazo; la tabla, las seis columnas. */}
      {comparacion.porPais && (
        <>
          <SectionTitle hint={comparacion.porPais.nota}>{comparacion.porPais.titulo}</SectionTitle>
          <Card>
            <BarrasHorizontales
              nombre="Movilización"
              meta={comparacion.porPais.metaMovilizacion}
              metaLabel={`Meta ${comparacion.porPais.metaMovilizacion}%`}
              filas={comparacion.porPais.filas.map((f) => ({
                label: f.pais,
                valor: f.movilizacion,
                tone: tonoMovilizacion(f.movilizacion, comparacion.porPais!.metaMovilizacion),
                detalle: `${f.ordenes} órdenes · ${f.noMovilizado} sin movilizar`,
              }))}
            />
          </Card>
          <div style={{ marginTop: 12 }}>
            <Table columns={columnasPais(comparacion.porPais.metaMovilizacion)} rows={comparacion.porPais.filas} getKey={(f) => f.pais} />
          </div>
        </>
      )}

      {/* ── Proyectos, por sección ─────────────────────────────────────────── */}
      {w.secciones.map((seccion, index) => (
        <section key={seccion.titulo}>
          <SectionTitle hint={seccion.nota}>{`${seccion.titulo} · ${seccion.proyectos.length}`}</SectionTitle>
          {index === 0 && w.avanceInvestigacion && (
            <Card flush className="wk-research-card">
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
            </Card>
          )}
          <Proyectos proyectos={seccion.proyectos} />
        </section>
      ))}

      {w.focoSiguienteSemana && (
        <section>
          <SectionTitle>Foco de la siguiente semana</SectionTitle>
          <Card>
            <ol className="u-lista">
              {w.focoSiguienteSemana.map((foco) => (
                <li key={foco}>{foco}</li>
              ))}
            </ol>
          </Card>
        </section>
      )}
    </>
  );
}

// Layout histórico (w27–w30): brecha, indicadores, Gantt de tiempos, hallazgos
// y proyectos. Estas semanas no tuvieron cierre mensual, así que no pueden
// renderizarse como las nuevas — pero sí con los mismos primitivos: hasta el
// 29-ago pintaban `.wk-ind-card`, `.wk-estado` y tres barras con gradiente, de
// modo que pasar de w35 a w28 era cambiar de diseño a mitad de navegación. El
// Gantt de tiempos se queda en CSS propio: es el único de su tipo y ningún
// primitivo lo cubre.
function HistoricWeekly({ w }: { w: Weekly }) {
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
    <>
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
        <Bar value={w.brecha.actual} meta={w.brecha.meta} tone="warn" label={`Faltan ${w.brecha.gap} para la meta`} />
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
      <div className="u-grid" style={{ ["--u-min" as string]: "240px" }}>
        {w.indicadores.map((k) => {
          const tone = TONO_INDICADOR[k.tono];
          return (
            <KpiCard
              key={k.nombre}
              label={k.nombre}
              value={k.valor}
              meta={k.meta}
              tone={tone}
              delta={{ text: k.estado, trend: k.trend, tone }}
              hint={k.nota}
            />
          );
        })}
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
      <div className="u-grid" style={{ ["--u-min" as string]: "340px" }}>
        {w.hallazgos.map((h) => (
          <Narrativa key={h.titulo} tone={TONO_HALLAZGO[h.tono]} titulo={h.titulo}>
            <p>{h.detalle}</p>
            {h.compara && (
              <div className="u-compara">
                <span className="u-compara__tit">{h.compara.etiqueta}</span>
                <Bar value={h.compara.a.pct} tone="ok" label={`${h.compara.a.label} · ${h.compara.a.pct}%`} />
                <Bar value={h.compara.b.pct} tone="risk" label={`${h.compara.b.label} · ${h.compara.b.pct}%`} />
              </div>
            )}
          </Narrativa>
        ))}
      </div>

      {w.secciones.map((seccion) => (
        <section key={seccion.titulo}>
          <SectionTitle hint={seccion.nota}>{`${seccion.titulo} · ${seccion.proyectos.length}`}</SectionTitle>
          <Proyectos proyectos={seccion.proyectos} />
        </section>
      ))}
    </>
  );
}

// `useSearchParams` obliga a un límite de Suspense (Next lo exige para poder
// prerenderizar la parte estática de la página).
export default function WeeklyView({ weeklies }: { weeklies: Weekly[] }) {
  return (
    <Suspense fallback={null}>
      <WeeklyContent weeklies={weeklies} />
    </Suspense>
  );
}

// Selector de semana: pills mientras quepan de un vistazo (≤ 8), select después.
// Se conservan todas las semanas; por defecto la más reciente = weeklies[0].
//
// La semana vive en la URL (`?semana=2026-w34`), no solo en el estado. Sin eso
// no se podía enlazar a una semana concreta —por eso la pantalla de updates de
// la célula colapsaba las siete en una sola tarjeta que siempre abría en la
// última— y volver atrás desde el weekly perdía dónde estabas. Un id
// desconocido no rompe nada: cae en la más reciente.
function WeeklyContent({ weeklies }: { weeklies: Weekly[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const pedida = params.get("semana");
  const desdeUrl = weeklies.findIndex((wk) => wk.id === pedida);
  const [idx, setIdx] = useState(desdeUrl >= 0 ? desdeUrl : 0);
  const w = weeklies[idx];

  // Escribe la URL al cambiar, que es la mitad que /weekly dejó sin hacer:
  // allá el deep-link entra pero no sale, así que no se puede compartir "mira
  // la semana que estoy viendo".
  const elegir = (i: number) => {
    setIdx(i);
    const id = weeklies[i]?.id;
    if (id) router.replace(`?semana=${id}`, { scroll: false });
  };

  const selector =
    weeklies.length <= 8 ? (
      <FilterPills
        label="Semana"
        value={idx}
        onChange={elegir}
        options={weeklies.map((wk, i) => ({
          value: i,
          label: wk.semana.replace(/^Semana\s+/, ""),
          hint: i === 0 ? "actual" : undefined,
        }))}
      />
    ) : (
      <select id="wk-semana" className="wk-select" value={idx} onChange={(e) => elegir(Number(e.target.value))} aria-label="Semana">
        {weeklies.map((wk, i) => (
          <option key={wk.id} value={i}>
            {wk.semana}
            {i === 0 ? " · actual" : ""}
          </option>
        ))}
      </select>
    );

  return (
    <main className="page wk-print">
      {/* El selector de semana y el botón de imprimir van en la cabecera, no en
          una barra suelta encima: son acciones sobre lo que se está viendo. */}
      <PageHeader
        title="Weekly Product · Logística"
        subtitle={w.fecha}
        aside={
          <div className="u-row no-print">
            {selector}
            <PrintButton docTitle={`Weekly Product · Logística — ${w.semana}`} />
          </div>
        }
      />

      {w.comparacionMensual ? <ExecutiveWeekly key={w.id} w={w} /> : <HistoricWeekly w={w} />}
    </main>
  );
}
