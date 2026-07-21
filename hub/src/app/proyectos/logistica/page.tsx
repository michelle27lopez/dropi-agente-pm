import Link from "next/link";
import { indicadores, fugas, northStar, spotlight } from "@/app/proyectos/logistica/_lib/data";
import KpiCard from "@/app/proyectos/logistica/_components/KpiCard";

// Inicio = INDICADORES (los protagonistas) + insight de la semana + fugas + accesos.
export default function Home() {
  return (
    <main className="page">
      <section className="hero">
        <span className="tag">Logistic Success · Weekly Producto 3 jul 2026</span>
        <h1>Indicadores de la orden</h1>
        <p>North Star: ⬆️ movilización + ⬆️ % de entrega. El valor de Dropi es el COD.</p>
        <div className="ns">
          <div className="ns-item">
            <div className="k">Meta de entrega</div>
            <div className="v">{northStar.metaEntrega}</div>
          </div>
          <div className="ns-item">
            <div className="k">Baseline CO (s/creadas)</div>
            <div className="v">{northStar.baselineCO}</div>
          </div>
          <div className="ns-item">
            <div className="k">Brecha a cerrar</div>
            <div className="v">{northStar.brecha}</div>
          </div>
          <div className="ns-item">
            <div className="k">Meta Q3</div>
            <div className="v">{northStar.metaQ3}</div>
          </div>
        </div>
      </section>

      <div className="spotlight">
        <div className="spotlight-num">
          <div className="big">{spotlight.cifra}</div>
          <div className="lbl">{spotlight.cifraLabel}</div>
        </div>
        <div className="spotlight-body">
          <div className="eyebrow-inline">
            <span className="dot" />
            Insight de la semana
            <span className="fuente">· {spotlight.fecha}</span>
          </div>
          <h2>{spotlight.titulo}</h2>
          <p className="lectura">{spotlight.lectura}</p>
          <p className="accion"><b>Siguiente paso:</b> {spotlight.accion}</p>
          <Link href={spotlight.linkHref} className="go">{spotlight.linkTexto}</Link>
        </div>
      </div>

      <div className="eyebrow">Indicadores clave</div>
      <div className="kpis">
        {indicadores.map((k) => (
          <KpiCard key={k.nombre} k={k} />
        ))}
      </div>

      <div className="eyebrow">Las 2 fugas que cierran la brecha</div>
      <div className="leaks">
        {fugas.map((f) => (
          <div key={f.nombre} className={`leak ${f.tono}`}>
            <div className="top">
              <span className="name">{f.nombre}</span>
              <span className="big">{f.valor}</span>
            </div>
            <div className="track">
              <i style={{ width: `${f.barra}%` }} />
            </div>
            <p className="desc">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="eyebrow">Explorar</div>
      <div className="navcards">
        <Link href="/proyectos/logistica/mapa" className="navcard">
          <span className="ic" style={{ background: "#eef2ff" }}>🗺️</span>
          <div>
            <h3>Mapa de la orden</h3>
            <p>Dónde ataca cada proyecto en la cadena de valor.</p>
            <span className="go">Ver mapa →</span>
          </div>
        </Link>
        <Link href="/proyectos/logistica/info-logistica" className="navcard">
          <span className="ic" style={{ background: "#ecfeff" }}>📚</span>
          <div>
            <h3>Info logística</h3>
            <p>Funnel, data técnica, tiempos, carriers, roadmap y fuentes completas.</p>
            <span className="go">Ver info →</span>
          </div>
        </Link>
        <Link href="/proyectos/logistica/experimentos" className="navcard">
          <span className="ic" style={{ background: "#fdf1e0" }}>🧪</span>
          <div>
            <h3>Experimentos</h3>
            <p>Hipótesis, métrica y estado de cada apuesta.</p>
            <span className="go">Ver experimentos →</span>
          </div>
        </Link>
        <Link href="/proyectos/logistica/updates" className="navcard">
          <span className="ic" style={{ background: "#eaf1ff" }}>📝</span>
          <div>
            <h3>Updates</h3>
            <p>Registro semanal para el Weekly Product.</p>
            <span className="go">Ver updates →</span>
          </div>
        </Link>
        <Link href="/proyectos/logistica/pendientes" className="navcard">
          <span className="ic" style={{ background: "#e7f7ee" }}>✅</span>
          <div>
            <h3>Pendientes</h3>
            <p>Lo que sigue, por prioridad.</p>
            <span className="go">Ver pendientes →</span>
          </div>
        </Link>
      </div>
    </main>
  );
}
