import Link from "next/link";
import BarrasHorizontales from "@/app/proyectos/logistica/_components/charts/BarrasHorizontales";
import {
  ACCIONES,
  ARQUITECTURAS,
  CASO,
  CEGUERAS,
  CLUSTERES,
  FASES,
  INSIGHTS,
  MOTIVOS,
  PAISES,
  PARES_AB,
  RESEARCH,
  SPREAD_REPROGRAMAR,
  TEST_ECUADOR,
  TIPOS_ETIQUETA,
  TRIAJE,
  UNIVERSO,
  VACIOS,
  type Motivo,
  type PaisNovedad,
} from "@/app/proyectos/logistica/_lib/novedades-data";
import { formatMiles, formatPct1 } from "@/app/proyectos/logistica/_lib/format";
import {
  Bar,
  Card,
  Disclosure,
  KpiCard,
  Narrativa,
  PageHeader,
  Pill,
  SectionTitle,
  Stat,
  Table,
  type Column,
  type Tone,
} from "@/app/proyectos/logistica/_components/ui";

export const metadata = { title: "Insights · Tablero Logística" };

// INSIGHTS de la célula: lo que aprendimos, con su evidencia.
//
// Existe porque el research vive en un .md de 623 líneas y en un artifact, y
// ninguno de los dos se puede consultar en una reunión: nadie abre markdown
// para responder "¿cuánto vale coordinación?".
//
// Cómo está armada: RESUMEN Y DATOS IMPORTANTES arriba —las cifras que hay que
// saberse y los siete hallazgos—, y el sustento debajo. Lo que no se cita en
// una conversación (las cinco arquitecturas del módulo, las quince acciones,
// el caso #80542212, los doce motivos) baja a plegables: no se pierde, deja de
// competir con lo que sí se cita.
//
// Lo que NO hace: recalcular. Cada cifra viene de `_lib/novedades-data.ts`, que
// transcribe el research con su fuente. Si una cifra cambia, cambia allá.
//
// Hoy hay un research (novedades, jun-2026). El siguiente —el cualitativo de
// quejas, que este mismo declara como su vacío #1— entra como otra sección,
// sin rediseñar nada.

const FUENTE_LABEL: Record<string, string> = { data: "export", obs: "observado", hipotesis: "hipótesis" };

function tonoTriaje(t: Motivo["triaje"]): Tone {
  if (t === "REDISEÑAR") return "risk";
  if (t === "PELEAR") return "ok";
  if (t === "MEJORAR") return "warn";
  return "neutral";
}

// Densidad = techo ÷ volumen. Es el criterio para decidir si un país se trabaja,
// y por eso es lo único teñido de la tabla: el resto son cifras de contexto.
function tonoDensidad(d: number): Tone {
  if (d >= 12) return "ok";
  if (d >= 5) return "warn";
  return "neutral";
}

const columnasCluster: Column<(typeof CLUSTERES)[number]>[] = [
  { key: "cluster", header: "Clúster de causa", width: "24%", render: (c) => <strong>{c.cluster}</strong> },
  { key: "novedades", header: "Novedades", align: "right", render: (c) => formatMiles(c.novedades) },
  { key: "rescate", header: "Rescate hoy", align: "right", render: (c) => formatPct1(c.rescate) },
  { key: "p75", header: "P75 observado", align: "right", render: (c) => formatPct1(c.p75) },
  {
    key: "techo",
    header: "Entregas extra / mes",
    align: "right",
    width: "26%",
    render: (c) => (
      <div className="u-celda__medida">
        <Bar value={(c.techo / 55703) * 100} tone={c.tone} label={`${c.cluster}: ${formatMiles(c.techo)} entregas de techo`} />
        <span>+{formatMiles(c.techo)}</span>
      </div>
    ),
  },
];

const columnasPais: Column<PaisNovedad>[] = [
  {
    key: "pais",
    header: "País",
    width: "20%",
    render: (p) => (
      <>
        <strong className="u-celda__nombre">{p.pais}</strong>
        <span className="u-celda__sub">
          {p.etiquetas} etiquetas · {p.carriers} {p.carriers === 1 ? "carrier" : "carriers"}
        </span>
      </>
    ),
  },
  { key: "novedades", header: "Novedades", align: "right", render: (p) => formatMiles(p.novedades) },
  { key: "rescate", header: "Rescate", align: "right", render: (p) => formatPct1(p.rescate) },
  {
    key: "sinExplicar",
    header: "Sin explicar",
    align: "right",
    render: (p) => (p.sinExplicar >= 5 ? <Pill tone="warn">{formatPct1(p.sinExplicar)}</Pill> : formatPct1(p.sinExplicar)),
  },
  { key: "dominante", header: "Motivo dominante", render: (p) => `${p.motivoDominante} · ${formatPct1(p.pctDominante)}` },
  { key: "techo", header: "Techo / mes", align: "right", render: (p) => `+${formatMiles(p.techo)}` },
  {
    key: "densidad",
    header: "Densidad",
    align: "right",
    render: (p) => (
      <span className="u-stat__delta" data-tone={tonoDensidad(p.densidad)}>
        {formatPct1(p.densidad)}
      </span>
    ),
  },
];

const columnasMotivo: Column<Motivo>[] = [
  { key: "id", header: "ID", render: (m) => <Pill code>{m.id}</Pill> },
  { key: "nombre", header: "Motivo canónico", width: "28%", render: (m) => m.nombre },
  { key: "etiquetas", header: "Etiq.", align: "right", render: (m) => m.etiquetas },
  { key: "novedades", header: "Novedades", align: "right", render: (m) => formatMiles(m.novedades) },
  { key: "rescate", header: "Rescate", align: "right", render: (m) => formatPct1(m.rescate) },
  { key: "techo", header: "Techo", align: "right", render: (m) => (m.techoPct ? formatPct1(m.techoPct) : "") },
  { key: "enJuego", header: "En juego", align: "right", render: (m) => (m.enJuego ? `+${formatMiles(m.enJuego)}` : "") },
  { key: "triaje", header: "Triaje", render: (m) => <Pill tone={tonoTriaje(m.triaje)}>{m.triaje}</Pill> },
];

const columnasArquitectura: Column<(typeof ARQUITECTURAS)[number]>[] = [
  { key: "quien", header: "Carrier · país", width: "22%", render: (a) => (
      <>
        <strong className="u-celda__nombre">{a.quien}</strong>
        {a.nota && <span className="u-celda__sub">{a.nota}</span>}
      </>
    ) },
  { key: "estructura", header: "Estructura del formulario", render: (a) => a.estructura },
  { key: "catalogo", header: "Catálogo de solución", render: (a) => a.catalogo },
  { key: "mapa", header: "Mapa", align: "right", render: (a) => (a.mapa ? "sí" : <Pill>no</Pill>) },
  { key: "fecha", header: "Campo de fecha", align: "right", render: () => <Pill tone="risk">no existe</Pill> },
];

export default function NovedadesPage() {
  const existen = ACCIONES.filter((a) => a.estado !== "no existe").length;

  return (
    <main className="page">
      <PageHeader
        title="Insights de la célula"
        subtitle="Lo que aprendimos, con su evidencia. Hoy: novedades y devoluciones — la novedad dice qué pasó, nunca dice qué hacer."
        back={{ href: "/proyectos/logistica", label: "Indicadores" }}
        aside={
          <div className="u-row">
            <a className="u-link" href={RESEARCH.artifact} target="_blank" rel="noreferrer">
              Manifiesto ↗
            </a>
            <a className="u-link" href={RESEARCH.docRepo} target="_blank" rel="noreferrer">
              Research completo ↗
            </a>
          </div>
        }
      />

      <SectionTitle hint={`${RESEARCH.id} · ${RESEARCH.periodo} · ${RESEARCH.alcance} · alimenta ${RESEARCH.tickets.join(" · ")}`}>
        Novedades y devoluciones
      </SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "220px" }}>
        <KpiCard
          label="Novedades en junio"
          value={formatMiles(UNIVERSO.novedades)}
          hint={`${RESEARCH.alcance}.`}
        />
        <KpiCard
          label="Se rescatan"
          value={formatPct1(UNIVERSO.rescatePct)}
          tone="ok"
          delta={{ text: `${formatMiles(UNIVERSO.rescatadas)} terminan entregadas`, tone: "ok" }}
        />
        <KpiCard
          label="Se devuelven"
          value={formatPct1(UNIVERSO.devolucionPct)}
          tone="risk"
          delta={{ text: `${formatMiles(UNIVERSO.devueltas)} vuelven al proveedor`, tone: "risk" }}
        />
        <KpiCard
          label="Techo del ejercicio"
          value={`+${formatMiles(UNIVERSO.techo)}`}
          tone="warn"
          delta={{ text: "entregas/mes al P75 de cada clúster", tone: "neutral" }}
          hint="No es meta, no es pronóstico, no es KR: es un instrumento de priorización."
        />
      </div>

      {/* ── Lo que hay que llevarse ────────────────────────────────────────── */}
      <SectionTitle hint="Los siete hallazgos, en el orden en que se sostienen unos a otros.">
        Lo que hay que llevarse de aquí
      </SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "330px" }}>
        {INSIGHTS.map((i) => (
          <Card key={i.id} tone={i.tone}>
            <div className="u-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <span className="u-card__title">{i.titulo}</span>
              <Pill code>{i.id}</Pill>
            </div>
            <p className="u-card__body">{i.detalle}</p>
            <p className="u-fuente">Fuente: {FUENTE_LABEL[i.fuente]}</p>
          </Card>
        ))}
      </div>

      {/* ── El hallazgo central ────────────────────────────────────────────── */}
      <SectionTitle hint="Las 324 etiquetas clasificadas por qué le dicen al sistema, no por qué causó la novedad.">
        El desenlace no lo decide la causa: lo decide si la etiqueta nombra una acción
      </SectionTitle>
      <Table
        columns={[
          { key: "tipo", header: "Tipo de etiqueta", width: "30%", render: (t) => (
              <>
                <strong className="u-celda__nombre">{t.tipo}</strong>
                <span className="u-celda__sub">{t.ejemplos}</span>
              </>
            ) },
          { key: "etiquetas", header: "Etiq.", align: "right", render: (t) => t.etiquetas },
          { key: "novedades", header: "Novedades", align: "right", render: (t) => formatMiles(t.novedades) },
          { key: "mix", header: "% del mix", align: "right", render: (t) => formatPct1(t.mix) },
          { key: "rescate", header: "Rescate", align: "right", width: "22%", render: (t) => (
              <div className="u-celda__medida">
                <Bar value={t.rescate} tone={t.tone} label={`${t.tipo}: ${formatPct1(t.rescate)} de rescate`} />
                <span>{formatPct1(t.rescate)}</span>
              </div>
            ) },
          { key: "devolucion", header: "Devolución", align: "right", render: (t) => formatPct1(t.devolucion) },
        ]}
        rows={TIPOS_ETIQUETA}
        getKey={(t) => t.tipo}
      />

      <div className="u-grid" style={{ ["--u-min" as string]: "330px", marginTop: 12 }}>
        {PARES_AB.map((par) => (
          <Card key={par.situacion}>
            <div className="u-row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
              <span className="u-card__title">{par.situacion}</span>
              <Pill tone="warn">{par.factor}</Pill>
            </div>
            <div className="u-grid" style={{ ["--u-min" as string]: "130px", marginTop: 12 }}>
              <Stat
                label="Sin acción"
                value={formatPct1(par.sin.rescate)}
                tone="risk"
                hint={`${formatMiles(par.sin.novedades)} · ${par.sin.etiqueta}`}
              />
              <Stat
                label="Con acción"
                value={formatPct1(par.con.rescate)}
                tone="ok"
                hint={`${formatMiles(par.con.novedades)} · ${par.con.etiqueta}`}
              />
            </div>
          </Card>
        ))}
      </div>
      <div style={{ marginTop: 12 }}>
        <Narrativa eyebrow="[HIPÓTESIS a validar]" tone="warn" titulo="Esto es asociación, no causa.">
          <p>
            Lectura alternativa: la transportadora solo escribe «solicita cambio de dirección» cuando ya logró
            hablar con el comprador — la etiqueta sería consecuencia del contacto, no causa del rescate. Separar
            las dos lecturas es el experimento crítico.
          </p>
        </Narrativa>
      </div>

      {/* ── El spread ──────────────────────────────────────────────────────── */}
      <SectionTitle hint="Reprogramar entrega — etiqueta idéntica, operador idéntico. Solo pares con n ≥ 200 novedades.">
        La misma etiqueta, el mismo carrier, otro país
      </SectionTitle>
      <Card>
        <BarrasHorizontales filas={SPREAD_REPROGRAMAR} nombre="Rescate" meta={53.3} metaLabel="P75 del motivo 53,3%" anchoLabel={116} />
        <p className="u-fuente">
          El mismo patrón en <strong>NO HAY QUIEN RECIBA</strong>: Ecuador/Servientrega 45,9% ↔ México/Veloces 8,5%.
          Si el resultado varía 2,3× con la misma causa y el mismo operador, la variable no es la novedad: es cómo se
          gestiona. Y un proceso se copia.
        </p>
      </Card>

      {/* ── El techo ───────────────────────────────────────────────────────── */}
      <SectionTitle hint="Llevar cada motivo al P75 de su propio clúster — el cuartil que algún país×carrier ya alcanza hoy, en producción.">
        {`El tamaño del premio: +${formatMiles(UNIVERSO.techo)} entregas al mes`}
      </SectionTitle>
      <Table columns={columnasCluster} rows={CLUSTERES} getKey={(c) => c.cluster} />
      <div style={{ marginTop: 12 }}>
        <Narrativa eyebrow="Concentración" tone="risk" titulo="El 58% del techo está en Coordinación.">
          <p>
            Y 43.053 de esas entregas están en una sola etiqueta: <strong>COORDINAR LA ENTREGA</strong>, exclusiva de
            Envía / Colombia — 118.988 novedades al mes, 13,1% de todas las del mundo Dropi, con 15,1% de rescate.
            Es literalmente una novedad que se llama «coordinar» y en la que 85 de cada 100 veces nadie coordina.
          </p>
        </Narrativa>
      </div>

      {/* ── El triaje ──────────────────────────────────────────────────────── */}
      <SectionTitle hint="No hay un tratamiento: hay tres, y el criterio está en la data.">
        Pelear, soltar, rediseñar
      </SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "280px" }}>
        {TRIAJE.map((t) => (
          <Card key={t.veredicto} tone={t.tone}>
            <Stat
              label={t.veredicto}
              value={formatMiles(t.volumen)}
              tone={t.tone}
              delta={{ text: `${t.mix}% del volumen · ${t.criterio}` }}
            />
            <p className="u-card__body">{t.accion}</p>
          </Card>
        ))}
      </div>

      {/* ── Los países ─────────────────────────────────────────────────────── */}
      <SectionTitle hint="Desagregado por país, el perfil cambia por completo — y con él, qué conviene hacer en cada uno.">
        No hay un problema de novedades. Hay diez
      </SectionTitle>
      <Card>
        <BarrasHorizontales
          filas={PAISES.map((p) => ({
            label: p.pais,
            valor: p.densidad,
            tone: tonoDensidad(p.densidad),
            detalle: `${formatMiles(p.novedades)} novedades · techo +${formatMiles(p.techo)}`,
          }))}
          nombre="Densidad de oportunidad"
          meta={UNIVERSO.techo / UNIVERSO.novedades * 100}
          metaLabel="Promedio global 10,5%"
        />
        <p className="u-fuente">
          Densidad = techo ÷ volumen del país: cuánto de lo que se cae ahí es recuperable. El volumen dice dónde está
          el problema; la densidad, dónde rinde el esfuerzo.
        </p>
      </Card>
      <div style={{ marginTop: 12 }}>
        <Table columns={columnasPais} rows={PAISES} getKey={(p) => p.pais} />
      </div>
      <div className="u-grid" style={{ ["--u-min" as string]: "330px", marginTop: 12 }}>
        <Narrativa eyebrow="Colombia" tone="risk" titulo="73% del techo global, y no en su motivo más grande.">
          <p>Rechazo es el 32,6% de su volumen pero solo +4.534 de techo; reprogramación aporta +51.926. Se construye para Colombia primero por aritmética, no por sesgo.</p>
        </Narrativa>
        <Narrativa eyebrow="Chile" titulo="Invertir en recuperación en Chile no paga.">
          <p>74,7% es rechazo puro y su techo entero es 2,3% de su volumen. Lo que paga es devolver rápido y barato. Es la conclusión más contraintuitiva del research.</p>
        </Narrativa>
        <Narrativa eyebrow="Ecuador" tone="warn" titulo="Ese frente no se arregla con producto: se arregla con el carrier.">
          <p>31,1% son incidentes operativos — casi todo DEVUELTO DE de Servientrega: 30.383 novedades con 5,6% de rescate. Vale +9.413 entregas.</p>
        </Narrativa>
      </div>

      {/* ── El módulo ──────────────────────────────────────────────────────── */}
      <Disclosure summary="El módulo por dentro: cinco arquitecturas, las 15 acciones y lo que no deja ver">
      <SectionTitle hint="19 fichas observadas en producción entre el 24 y el 25 de agosto, en Colombia y Ecuador. Solo lectura.">
        El formulario cambia por transportadora — y ninguno tiene fecha
      </SectionTitle>
      <Table columns={columnasArquitectura} rows={ARQUITECTURAS} getKey={(a) => a.id} />
      <div style={{ marginTop: 12 }}>
        <Narrativa eyebrow="El test decisivo" tone="ok" titulo={TEST_ECUADOR.conclusion}>
          <p>
            <strong>{TEST_ECUADOR.etiqueta}</strong> — {TEST_ECUADOR.campos.join(" · ")}. Rescate: Colombia{" "}
            {formatPct1(TEST_ECUADOR.colombia)} ↔ Ecuador {formatPct1(TEST_ECUADOR.ecuador)}, con el P75 del motivo en{" "}
            {formatPct1(TEST_ECUADOR.p75)}.
          </p>
          <p>{TEST_ECUADOR.reserva}</p>
        </Narrativa>
      </div>

      <SectionTitle hint="Las que faltan son justo las que mueven el motivo más grande: reprogramar fecha y elegir franja.">
        {`Las acciones que una novedad podría ofrecer · ${existen} de ${ACCIONES.length} existen`}
      </SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "210px" }}>
        {ACCIONES.map((a) => (
          <Card key={a.id} tone={a.estado === "existe" ? "ok" : a.estado === "parcial" ? "warn" : "neutral"}>
            <div className="u-row" style={{ justifyContent: "space-between" }}>
              <span className="u-stat__label">{a.id}</span>
              <Pill tone={a.estado === "existe" ? "ok" : a.estado === "parcial" ? "warn" : "risk"}>{a.estado}</Pill>
            </div>
            <span className="u-card__title">{a.nombre}</span>
            {"nota" in a && a.nota && <p className="u-card__body">{a.nota}</p>}
          </Card>
        ))}
      </div>

      <SectionTitle hint="Todo verificable en pantalla. No es que falten campos: es que el flujo no se completa.">
        Lo que el módulo no deja ver
      </SectionTitle>
      <Table
        columns={[
          { key: "que", header: "Lo que falta", width: "20%", render: (c) => <strong>{c.que}</strong> },
          { key: "hoy", header: "Qué se ve hoy", width: "42%", render: (c) => c.hoy },
          { key: "consecuencia", header: "Consecuencia", render: (c) => c.consecuencia },
        ]}
        rows={CEGUERAS}
        getKey={(c) => c.que}
      />
      </Disclosure>

      <Disclosure summary="El caso completo: una orden, 55 días y cero soluciones">
      {/* ── El caso ────────────────────────────────────────────────────────── */}
      <SectionTitle hint={`${CASO.carrier} · ${CASO.contexto}`}>
        {`Una orden, de principio a fin: ${CASO.orden}`}
      </SectionTitle>
      <Card>
        <ol className="nov-timeline">
          {CASO.eventos.map((e) => (
            <li key={`${e.fecha}-${e.texto}`}>
              <span className="u-salud" data-salud={e.tono === "risk" ? "risk" : e.tono === "warn" ? "warn" : undefined} />
              <span className="nov-timeline__fecha">{e.fecha}</span>
              <span className="nov-timeline__texto">{e.texto}</span>
            </li>
          ))}
        </ol>
        <p className="u-fuente">{CASO.cierre}</p>
      </Card>
      </Disclosure>

      {/* ── Qué construir ──────────────────────────────────────────────────── */}
      <Disclosure summary="Los 12 motivos canónicos, con su triaje y lo que tienen en juego">
      <SectionTitle hint="Cobertura de la homologación: 99,5% del volumen. Cada motivo con su triaje y lo que tiene en juego.">
        324 etiquetas caben en 12 motivos
      </SectionTitle>
      <Table columns={columnasMotivo} rows={MOTIVOS} getKey={(m) => m.id} />
      </Disclosure>

      <SectionTitle hint="El orden importa: sin lo primero, nada de lo demás es medible.">
        El orden de construcción
      </SectionTitle>
      <div className="u-grid" style={{ ["--u-min" as string]: "280px" }}>
        {FASES.map((f) => (
          <Card key={f.fase}>
            <div className="u-row" style={{ justifyContent: "space-between" }}>
              <span className="u-stat__label">{f.fase}</span>
              <Pill tone={f.costo === "cero" ? "ok" : f.costo === "bajo" ? "info" : "neutral"}>costo {f.costo}</Pill>
            </div>
            <span className="u-card__title">{f.titulo}</span>
            <p className="u-card__body">{f.detalle}</p>
          </Card>
        ))}
      </div>

      {/* ── Los límites ────────────────────────────────────────────────────── */}
      <SectionTitle>Lo que este research no puede decir</SectionTitle>
      <Card tone="warn">
        <ol className="u-lista">
          {VACIOS.map((v) => (
            <li key={v}>{v}</li>
          ))}
        </ol>
        <Disclosure summary="Cómo se construyeron rescate, techo y densidad">
          <p>
            <strong>Rescate</strong> = ENTREGADO ÷ CANTIDAD. Las dos columnas vienen del export de Power BI, no se
            calcularon aquí. No suma 100% con devolución: faltan {formatMiles(UNIVERSO.sinExplicar)} novedades (
            {formatPct1(UNIVERSO.sinExplicarPct)} global, 46,1% en México). Es una foto a fecha de corte, así que
            sesga hacia abajo las novedades recientes. Sirve para comparar, no para publicar como cifra absoluta.
          </p>
          <p>
            <strong>Techo</strong> — construcción propia, no es un dato. Por cada motivo se toman las celdas
            país×carrier con ≥300 novedades, se calcula el percentil 75 de sus rescates y el techo es lo que faltaría
            para llegar ahí. P75 y no el máximo, porque el máximo suele ser una celda chica con suerte. Supuesto
            débil: asume que la mezcla de casos fáciles y difíciles es comparable entre países dentro del mismo
            motivo — probablemente no lo es.
          </p>
          <p>
            <strong>Densidad</strong> = techo ÷ volumen del país. El criterio para decidir si un país se trabaja.
          </p>
        </Disclosure>
      </Card>

      <p className="u-fuente">
        Fuente: <code>{RESEARCH.id}</code> · export Power BI <code>data (11).xlsx</code>, Año 2026 / Mes JUN, 702
        filas · recorrido del módulo en producción {RESEARCH.fecha}, solo lectura, sin ejecutar acciones. Alimenta{" "}
        {RESEARCH.tickets.join(" · ")} y el KR2.1 de tasa de entrega.{" "}
        <Link className="u-link" href="/proyectos/logistica/proyecto/novedad-triaje">
          Ver la ficha del proyecto →
        </Link>
      </p>
    </main>
  );
}
