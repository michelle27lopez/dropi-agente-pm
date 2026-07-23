import { cronograma, jiraUrl } from "@/app/proyectos/logistica/_lib/data";
import PrintButton from "@/app/proyectos/logistica/_components/PrintButton";

export const metadata = { title: "Cronograma · Tablero Logística" };

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

  return (
    <main className="page">
      <section className="wk-hero cr-hero">
        <span className="tag">Cronograma · Logística</span>
        <h1>Cronograma de proyectos · Logística</h1>
        <p className="wk-fecha">Para Dirección de Producto — Maria Ossa</p>
        <p className="wk-foco">{c.meta}</p>
        <PrintButton />
      </section>

      {/* 1 · COLA DE DESARROLLO */}
      <div className="eyebrow">1 · Cola de desarrollo — el cuello es la capacidad de dev</div>
      <div className="cr-alert">
        <span className="cr-alert-ico">⚠️</span>
        <div>
          <strong>{c.colaAlerta.titulo}</strong>
          <p>{c.colaAlerta.detalle}</p>
        </div>
      </div>
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

      {/* 2 · FRENTES DE DISCOVERY */}
      <div className="eyebrow">2 · Frentes de discovery — metodología completa (~5 sem)</div>
      <div className="cr-board">
        <TimeHead />
        {c.frentes.map((f) => {
          const url = jiraUrl(f.ticket);
          return (
            <div key={f.proyecto} className="cr-row">
              <div className="cr-label-col">
                <strong>{f.proyecto}</strong>
                <span className="cr-meta">{url ? <a href={url} target="_blank" rel="noreferrer" className="cr-ticket">{f.ticket}</a> : f.ticket}</span>
                {f.nota && <small>{f.nota}</small>}
              </div>
              <div className="cr-track cr-track-frente">
                <Gridlines />
                {f.fases.map((ph) => (
                  <div key={ph.label} className={`cr-fase f-${ph.tono}`} style={{ left: pc(ph.inicio), width: pc(ph.fin - ph.inicio) }} title={ph.label}>
                    <span>{ph.label}</span>
                  </div>
                ))}
                {f.handoffMes !== undefined && (
                  <span className="cr-hito cr-hito-handoff" style={{ left: pc(f.handoffMes) }} title="Hand off (1 punto)">
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
      <div className="eyebrow">3 · Experimentos (POC) — research → experimento → handoff TI condicional</div>
      <div className="cr-board">
        <TimeHead />
        {c.experimentos.map((e) => {
          const url = jiraUrl(e.ticket);
          return (
            <div key={e.proyecto} className="cr-row">
              <div className="cr-label-col">
                <strong>{e.proyecto}</strong>
                <span className="cr-meta">{url ? <a href={url} target="_blank" rel="noreferrer" className="cr-ticket">{e.ticket}</a> : e.ticket}</span>
                {e.nota && <small>{e.nota}</small>}
              </div>
              <div className="cr-track cr-track-frente">
                <Gridlines />
                <span className="cr-research" style={{ left: pc(e.researchInicio), width: pc(e.researchFin - e.researchInicio) }}>Research</span>
                <div className="cr-band cr-band-exp" style={{ left: pc(e.expInicio), width: pc(e.expFin - e.expInicio) }}>
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

      {/* 4 · KPI POR TRIMESTRE */}
      <div className="eyebrow">4 · KPI por trimestre</div>
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
        <span className="cr-leg lg-exp">Experimento POC</span>
        <span className="cr-leg lg-hito">Hito</span>
        <span className="cr-leg lg-hoy">Hoy</span>
      </div>
    </main>
  );
}
