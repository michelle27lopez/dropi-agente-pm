import Link from "next/link";
import { cronograma, jiraUrl } from "@/app/proyectos/logistica/_lib/data";
import PrintButton from "@/app/proyectos/logistica/_components/PrintButton";
import { PageHeader, SectionTitle, Table, type Column } from "@/app/proyectos/logistica/_components/ui";
import {
  proyeccion,
  tiempoEsperando,
  mesesEsperando,
  COLA_TI_FUENTE,
  SEMANAS_POR_FRENTE,
} from "@/app/proyectos/logistica/_lib/cola-ti";

export const metadata = { title: "Cronograma · Tablero Logística" };

const MES_CORTO = new Intl.DateTimeFormat("es", { month: "short", year: "2-digit" });

type ItemProyectado = ReturnType<typeof proyeccion>[number];

const COLUMNAS_COLA: Column<ItemProyectado>[] = [
  {
    key: "prioridad",
    header: "#",
    width: "5%",
    align: "right",
    render: (i) => <span className="cola-num">{i.prioridad}</span>,
  },
  {
    key: "nombre",
    header: "Lo que Logística pidió",
    width: "26%",
    render: (i) => (
      <>
        {i.slug ? (
          <Link href={`/proyectos/logistica/proyecto/${i.slug}`} className="cola-link">
            {i.nombre}
          </Link>
        ) : (
          <span className="cola-nombre">{i.nombre}</span>
        )}
        {i.transportadora && <span className="cola-transportadora">{i.transportadora}</span>}
        {i.descripcion && <span className="cola-desc">{i.descripcion}</span>}
      </>
    ),
  },
  {
    // El dato más duro de la hoja, y el que no estaba: cuánto lleva esperando.
    // Una petición de dos años y medio dice del cuello más que cualquier
    // estimación de fecha. Se tiñe cuando pasa del año.
    key: "espera",
    header: "Pedido hace",
    width: "11%",
    render: (i) => {
      const meses = mesesEsperando(i.pedidoDesde);
      return (
        <span
          className={meses >= 12 ? "cola-espera cola-espera--vieja" : "cola-espera"}
          title={`Registrado el ${i.pedidoDesde}`}
        >
          {tiempoEsperando(i.pedidoDesde)}
        </span>
      );
    },
  },
  // Vacío = nadie lo tiene asignado en TI. Mismo criterio que en iniciativas:
  // el hueco se dibuja porque el hueco es la información.
  { key: "dev", header: "Quién lo tiene en TI", width: "13%", render: (i) => i.desarrollador },
  {
    // La proyección: cuándo alcanzaría, si la cola y la capacidad no cambian.
    key: "arranca",
    header: "Arrancaría",
    width: "9%",
    render: (i) => (
      <span className="cola-fecha" title={`Tras ${i.semanasDeEspera} semanas de espera en cola`}>
        {MES_CORTO.format(i.inicio)}
      </span>
    ),
  },
  {
    key: "compromiso",
    header: "Compromiso de TI",
    width: "10%",
    render: (i) => i.compromiso,
  },
  { key: "estado", header: "Última nota", render: (i) => i.ultimoEstado },
];

// El Gantt conserva su CSS propio (`.cr-*`) a propósito: las barras temporales
// posicionadas en porcentaje sobre una pista de 12 meses no son un patrón que
// ningún primitivo pueda cubrir, y forzarlas a uno solo añadiría capas. Lo que
// SÍ se homologa es lo que comparte con el resto del tablero: la cabecera de
// página, los títulos de sección y el lenguaje.

const N = 12; // meses (Jul'26 – Jun'27)
const pc = (m: number) => `${(m / N) * 100}%`;

// Cabecera de tiempo reutilizable (trimestres + meses).
function TimeHead({ quarters = false }: { quarters?: boolean }) {
  const { meses, trimestres } = cronograma;
  return (
    <div className="cr-row cr-row-head">
      <div className="cr-label-col cr-label-head">Proyecto</div>
      <div className="cr-track">
        {quarters && (
          <div className="cr-qband">
            {trimestres.map((t) => (
              <span key={t.label} className={`cr-q ${t.clase}`} style={{ left: pc(t.desde), width: pc(t.hasta - t.desde + 1) }}>
                {t.label}
              </span>
            ))}
          </div>
        )}
        <div className="cr-months">
          {meses.map((m, i) => (
            <span key={m} style={{ left: pc(i), width: pc(1) }}>{m}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Gridlines() {
  return (
    <>
      {cronograma.meses.map((_, i) => (
        <span key={i} className="cr-gl" style={{ left: pc(i) }} />
      ))}
      <span className="cr-hoy" style={{ left: pc(cronograma.hoy) }} />
    </>
  );
}

export default function CronogramaPage() {
  const c = cronograma;
  const cola = proyeccion();

  return (
    <main className="page">
      <PageHeader title="Cronograma de proyectos" subtitle={c.meta} aside={<PrintButton />} />

      <SectionTitle hint="El cuello no es el diseño: es la capacidad de desarrollo disponible.">
        Cola de desarrollo
      </SectionTitle>
      <div className="cr-board">
        <TimeHead quarters />
        {c.cola.map((it) => {
          const url = jiraUrl(it.ticket);
          return (
            <div key={it.proyecto} className="cr-row">
              <div className="cr-label-col">
                <strong>{it.proyecto}</strong>
                <span className="cr-meta">
                  {url ? <a href={url} target="_blank" rel="noreferrer" className="cr-ticket">{it.ticket}</a> : it.ticket}
                  {it.kr ? ` · ${it.kr}` : ""}
                </span>
                {it.nota && <small>{it.nota}</small>}
              </div>
              <div className="cr-track cr-track-cola">
                <Gridlines />
                {it.devInicio > it.listoMes && (
                  <span className="cr-queue" style={{ left: pc(it.listoMes), width: pc(it.devInicio - it.listoMes) }}>
                    <span className="cr-queue-txt">en cola</span>
                  </span>
                )}
                <div className={`cr-devbar t-${it.tono}`} style={{ left: pc(it.devInicio), width: pc(it.devFin - it.devInicio) }} title={`${it.proyecto} · ${it.estado}`}>
                  <span>{it.estado}</span>
                </div>
                <span className="cr-listo-tag" style={{ left: pc(it.listoMes) }}>{it.listoLabel}</span>
                <span className="cr-hito" style={{ left: pc(it.devFin) }}>
                  <i />
                  <b>{it.hito}</b>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── LA COLA DE LOGÍSTICA CON TI ──────────────────────────────────────
          No es un calendario: es una cola priorizada. Las fechas son la
          consecuencia aritmética de la prioridad más la capacidad declarada
          (~1 dev, ~6 semanas, secuencial), y por eso van etiquetadas como
          proyección y con la fuente al lado. */}
      <SectionTitle hint="La prioridad que Logística declaró ante TI. Las fechas son proyección, no compromiso.">
        Cola de Logística con TI
      </SectionTitle>

      <p className="u-fuente" style={{ marginTop: 0, marginBottom: 10 }}>
        Fuente: hoja <em>{COLA_TI_FUENTE.hoja}</em> · copiada el {COLA_TI_FUENTE.leidaEl} ·{" "}
        <a href={COLA_TI_FUENTE.url} target="_blank" rel="noreferrer" className="u-link">
          abrir la hoja ↗
        </a>
      </p>

      <Table
        columns={COLUMNAS_COLA}
        rows={cola}
        getKey={(i) => `${i.prioridad}-${i.nombre}`}
        empty="La hoja no trae ítems priorizados."
      />

      <p className="u-fuente">
        La columna <b>Arrancaría</b> supone {SEMANAS_POR_FRENTE} semanas por frente y un solo
        desarrollador en secuencia — el mismo supuesto que ya declara este cronograma. Si la
        capacidad cambia, cambian todas las fechas de golpe: por eso es proyección y no compromiso.
      </p>

      {/* 2 · FRENTES DE DISCOVERY */}
      <SectionTitle hint="Metodología completa: unas 5 semanas por frente.">
        Frentes de discovery
      </SectionTitle>
      <div className="cr-board">
        <TimeHead />
        {c.frentes.map((f) => {
          const url = jiraUrl(f.ticket);
          return (
            <div key={f.proyecto} className={`cr-row${f.tentativa ? " cr-row-tent" : ""}`}>
              <div className="cr-label-col">
                <strong>
                  {f.slug ? <Link href={`/proyectos/logistica/proyecto/${f.slug}`}>{f.proyecto}</Link> : f.proyecto}
                </strong>
                <span className="cr-meta">
                  {url ? <a href={url} target="_blank" rel="noreferrer" className="cr-ticket">{f.ticket}</a> : f.ticket}
                  {f.estadoHoy && <span className={`cr-estado-hoy${f.tentativa ? " tent" : ""}`}>{f.estadoHoy}</span>}
                </span>
                {f.nota && <small>{f.nota}</small>}
              </div>
              <div className="cr-track cr-track-frente">
                <Gridlines />
                {f.fases.map((ph) => (
                  <div key={ph.label} className={`cr-fase f-${ph.tono}${f.tentativa ? " cr-tent" : ""}`} style={{ left: pc(ph.inicio), width: pc(ph.fin - ph.inicio) }} title={f.tentativa ? `${ph.label} · ventana tentativa` : ph.label}>
                    <span>{ph.label}</span>
                  </div>
                ))}
                {f.handoffMes !== undefined && (
                  <span className="cr-hito cr-hito-handoff" style={{ left: pc(f.handoffMes) }} title="Entrega a desarrollo">
                    <i />
                    <b>hand off</b>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 3 · EXPERIMENTOS */}
      <SectionTitle hint="Investigación, luego experimento, y la entrega a desarrollo queda condicionada al resultado.">
        Experimentos
      </SectionTitle>
      <div className="cr-board">
        <TimeHead />
        {c.experimentos.map((e) => {
          const url = jiraUrl(e.ticket);
          return (
            <div key={e.proyecto} className={`cr-row${e.tentativa ? " cr-row-tent" : ""}`}>
              <div className="cr-label-col">
                <strong>
                  {e.slug ? <Link href={`/proyectos/logistica/proyecto/${e.slug}`}>{e.proyecto}</Link> : e.proyecto}
                </strong>
                <span className="cr-meta">
                  {url ? <a href={url} target="_blank" rel="noreferrer" className="cr-ticket">{e.ticket}</a> : e.ticket ?? <em>sin ticket</em>}
                  {e.bloqueo && <span className="cr-estado-hoy bloq">⛔ {e.bloqueo}</span>}
                </span>
                {e.nota && <small>{e.nota}</small>}
              </div>
              <div className="cr-track cr-track-frente">
                <Gridlines />
                <span className={`cr-research${e.tentativa ? " cr-tent" : ""}`} style={{ left: pc(e.researchInicio), width: pc(e.researchFin - e.researchInicio) }}>Research</span>
                <div className={`cr-band cr-band-exp${e.tentativa ? " cr-tent" : ""}`} style={{ left: pc(e.expInicio), width: pc(e.expFin - e.expInicio) }}>
                  <span>Experimento operativo</span>
                </div>
                <span className="cr-hito cr-hito-cond" style={{ left: pc(e.expFin) }}>
                  <i />
                  <b>{e.handoff}</b>
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4 · COMPROMISOS POR TRIMESTRE */}
      <SectionTitle>Compromisos por trimestre</SectionTitle>
      <div className="cr-kpis">
        {c.kpiTrimestre.map((k) => (
          <div key={k.label} className={`cr-kpi k-${k.clase}`}>
            <h3>{k.label}</h3>
            <ul>{k.puntos.map((p) => <li key={p}>{p}</li>)}</ul>
          </div>
        ))}
      </div>

      {/* Supuestos */}
      <div className="cr-supuestos">
        <span className="cr-sup-head">Supuestos y restricciones</span>
        <ul>{c.supuestos.map((s) => <li key={s}>{s}</li>)}</ul>
      </div>

      {/* Leyenda */}
      <div className="cr-legend">
        <span className="cr-leg lg-dev">Desarrollo activo</span>
        <span className="cr-leg lg-queue">En cola de dev (listo PM)</span>
        <span className="cr-leg lg-band">Frente de discovery</span>
        <span className="cr-leg lg-exp">Experimento</span>
        <span className="cr-leg lg-hito">Hito</span>
        <span className="cr-leg lg-hoy">Hoy</span>
        <span className="cr-leg lg-tent">Ventana tentativa (planeada, no activa hoy)</span>
      </div>
    </main>
  );
}
