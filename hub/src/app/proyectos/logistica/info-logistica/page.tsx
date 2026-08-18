import Link from "next/link";
import BarListChart from "@/app/proyectos/logistica/_components/charts/BarListChart";
import Sankey from "@/app/proyectos/logistica/_components/charts/Sankey";
import TimeFlowChart from "@/app/proyectos/logistica/_components/charts/TimeFlowChart";
import GroupedBars from "@/app/proyectos/logistica/_components/charts/GroupedBars";
import SectionNav from "@/app/proyectos/logistica/_components/charts/SectionNav";
import { PageHeader, SectionTitle } from "@/app/proyectos/logistica/_components/ui";
import {
  F,
  bottlenecks,
  canalesResolucion,
  cancelByMonth,
  cancellationReasons,
  carrierEntregaBars,
  carrierSankeys,
  carrierVolumenBars,
  cicloPorMes,
  destinoFinal,
  devGap,
  devGapCarrier,
  flujoManifiestos,
  fuentesNovedad,
  funnelSankey,
  interrapAlert,
  kpisFunnel,
  kpisManifiestos,
  kpisMotivos,
  kpisNovedades,
  kpisTiempos,
  kpisTransp,
  lifecycleSankey,
  manifestCoverage,
  manifestTable,
  manifiestoSankey,
  novedadTipos,
  novedadesPorTransp,
  pauStats,
  rejectionReasons,
  resolucionRates,
  resolucionStats,
  tiemposSankey,
  tiemposTable,
  timeTransitions,
  timeFlowSteps,
  transpData,
  type Kpi,
} from "@/app/proyectos/logistica/_lib/info-logistica-data";

export const metadata = { title: "Info logística · Tablero Logística" };

function fmt(n: number) {
  return n.toLocaleString("es-CO");
}
function pctStr(a: number, b: number) {
  return `${((a / b) * 100).toFixed(1).replace(".", ",")}%`;
}

function KpiStrip({ items }: { items: Kpi[] }) {
  return (
    <div className={`info-kpi-grid${items.length === 6 ? " six" : ""}`}>
      {items.map((k) => (
        <div key={k.label} className={`info-kpi-card ${k.tone}`}>
          <span>{k.label}</span>
          <strong>{k.value}</strong>
          <p>{k.note}</p>
        </div>
      ))}
    </div>
  );
}

const etapas = [
  { n: "1", title: "Creación", detail: "La orden nace desde canal manual, Shopify u otro origen.", tag: "origen", tone: "blue" },
  { n: "2", title: "Confirmación", detail: "Primer cuello pre-red: órdenes SHOP, validación y acción del dropshipper.", tag: "no moviliza", tone: "amber" },
  { n: "3", title: "Guía", detail: "Se genera guía, se elige transportadora y se activa el flujo logístico.", tag: "preparación", tone: "sky" },
  { n: "4", title: "Handoff", detail: "Preparación, recogida, bodega y entrega a transportadora.", tag: "Dropi", tone: "green" },
  { n: "5", title: "Entrega", detail: "Carrier mueve, ofrece, gestiona novedades y entrega o devuelve.", tag: "devuelve", tone: "red" },
  { n: "6", title: "Postventa", detail: "Reclamos, garantías, devolución y recuperación operativa.", tag: "cierre", tone: "purple" },
];

const dataModel = [
  ["Estado actual", "orders.status", "Foto final. No sirve para reconstruir historia."],
  ["Historia logística", "history_orders", "Append-only. Usar eventos y ordenar por tiempo."],
  ["Eventos físicos Dropi", "logistic_management", "Scanner, bodega y recolección conectados al log."],
  ["Tiempos por transición", "Q8 / q18", "Promedio, mediana y volumen por estado anterior → destino."],
  ["Ciclo de vida", "Q9", "Días promedio hasta entrega o devolución por mes."],
  ["Novedades", "history_new_orders", "Solución, responsable y fecha de solución."],
];

const roadmap = [
  ["Movilización", "Recupera órdenes que no llegan a red.", "PRM-1497"],
  ["Devolución", "Baja el hueco post-red sobre movilizadas.", "PRM-1523"],
  ["Carrier × zona", "La misma zona cambia fuerte por transportadora.", "PRM-1513"],
  ["Estados", "Sin homologación, México y carriers miden mal.", "PRM-1297"],
];

const navItems = [
  { id: "s-funnel", label: "Funnel" },
  { id: "s-novedades", label: "Novedades" },
  { id: "s-transportadoras", label: "Transportadoras" },
  { id: "s-manifiestos", label: "Manifiestos" },
  { id: "s-tiempos", label: "Tiempos" },
  { id: "s-motivos", label: "Motivos" },
  { id: "s-marco", label: "Marco" },
  { id: "s-fuentes", label: "Fuentes" },
];

const fuentes = [
  { label: "Funnel operativo", href: "/logistica/info-logistica/funnel-prototipo.html", note: "Prototipo interactivo: funnel, novedades, carriers, manifiestos y tiempos." },
  { label: "Detalle logística", href: "/logistica/info-logistica/detalle-logistica.html", note: "Modelo de datos, estados, flujos por carrier y reglas de lectura." },
  { label: "Dossier completo", href: "/logistica/info-logistica/dossier-completo-dropi.html", note: "Marco completo de logística como producto, hipótesis y metodología." },
  { label: "Visión logística", href: "/logistica/info-logistica/vision-logistica.html", note: "Resumen ejecutivo, KPIs, etapas y roadmap Q3." },
];

function InfoTable({ rows, columns }: { rows: string[][]; columns: string[] }) {
  return (
    <div className="info-table-wrap">
      <table className="info-table">
        <thead>
          <tr>{columns.map((c) => <th key={c}>{c}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.join("-")}>
              {row.map((cell, i) => <td key={cell} className={i === 0 ? "n" : i === row.length - 1 ? "tagcell" : ""}>{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InfoLogisticaPage() {
  return (
    <main className="page info-page">
      {/* Capa de REFERENCIA: aquí se viene a buscar un número, no a decidir. Su
          densidad es correcta y sus gráficos no se tocan — lo que se homologa es
          la cabecera, los títulos de sección y el lenguaje. */}
      <PageHeader
        title="Logística como producto"
        subtitle="El detalle completo: el recorrido de la orden, las novedades, las transportadoras, los manifiestos y los tiempos. Es la fuente a la que apuntan las demás pantallas."
      />

      <SectionNav items={navItems} />

      {/* ============ VIEW 1 · FUNNEL ============ */}
      <div id="s-funnel"><SectionTitle>Funnel general de órdenes</SectionTitle></div>
      <KpiStrip items={kpisFunnel} />
      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>Funnel general — creadas a desenlace</h2>
            <p>Creadas → no movilizadas / movilizadas → novedad → entregado / devolución / en proceso. Mayo 2026.</p>
          </div>
        </div>
        <Sankey data={funnelSankey} />
      </section>

      {/* ============ VIEW 2 · NOVEDADES ============ */}
      <div id="s-novedades"><SectionTitle>Novedades y resolución</SectionTitle></div>
      <KpiStrip items={kpisNovedades} />
      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>Ciclo de vida — flujo de órdenes por fase</h2>
            <p>Sankey de fases principales: dónde entra la novedad y cómo termina la orden.</p>
          </div>
        </div>
        <Sankey data={lifecycleSankey} />
      </section>

      <section className="info-panel accent-blue">
        <h2>¿Por qué hay diferentes cifras de novedades?</h2>
        <p>Las novedades se registran en 3 tablas distintas. Cada una mide algo diferente:</p>
        <div className="source-note-grid">
          {fuentesNovedad.map((s) => (
            <div key={s.label} className={`source-note ${s.tone}`}>
              <div className="source-note-top">
                <strong>{s.num}</strong>
                <code>{s.table}</code>
              </div>
              <b>{s.label}</b>
              <span>{s.desc}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="info-two">
        <section className="info-panel">
          <h2>Tipos de novedad — órdenes únicas</h2>
          <p>~261K órdenes únicas · history_orders. REHUSA RECIBIR y COORDINAR ENTREGA concentran el 59%.</p>
          <BarListChart data={novedadTipos} scroll />
        </section>
        <section className="info-panel">
          <h2>Destino final — ¿qué pasó con esas órdenes?</h2>
          <p>282K órdenes. Solo 1 de cada 6 con novedad se entrega (16,7%); 31,1% se pierden en devolución.</p>
          <BarListChart data={destinoFinal} max={100} suffix="%" />
        </section>
      </div>

      <div className="info-two">
        <section className="info-panel">
          <h2>Tasa de resolución por tipo</h2>
          <p>history_new_orders · % con solución. Solo 28,5% de novedades se resuelven.</p>
          <BarListChart data={resolucionRates} max={100} suffix="%" scroll />
        </section>
        <section className="info-panel">
          <h2>Canales de resolución</h2>
          <p>82K NOVEDAD SOLUCIONADA · history_orders. Chatea PRO apenas 1,6%; 58% sin detalle de canal.</p>
          <div className="stat-boxes">
            {resolucionStats.map((s) => (
              <div key={s.label} className={`stat-box ${s.tone}`}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
                <small>{s.sub}</small>
              </div>
            ))}
          </div>
          <BarListChart data={canalesResolucion} />
        </section>
      </div>

      <section className="info-panel">
        <h2>Novedades por transportadora</h2>
        <p>INTERRAPIDISIMO = 0 novedades reportadas con 781K órdenes · history_orders. Punto ciego del 42% del volumen.</p>
        <div className="carrier-nov-grid">
          {novedadesPorTransp.map((c) => {
            const maxEv = novedadesPorTransp[0].eventos || 1;
            const zero = c.eventos === 0;
            return (
              <div key={c.name} className="carrier-nov-row" title={`${c.name}: ${zero ? "0 eventos — 781K órdenes" : `${fmt(c.eventos)} eventos (${c.pct}%)`}`}>
                <span className="cn-name" style={{ color: zero ? "#ef4444" : undefined }}>{c.name}{zero ? " ⛔" : ""}</span>
                <div className="cn-track">
                  <i style={{ width: `${zero ? 0 : (c.eventos / maxEv) * 100}%`, background: c.color }} />
                </div>
                <span className="cn-val" style={{ color: zero ? "#ef4444" : c.color }}>
                  {zero ? "0 ev." : `${fmt(c.eventos)} (${c.pct}%)`}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ VIEW 3 · TRANSPORTADORAS ============ */}
      <div id="s-transportadoras"><SectionTitle>Por transportadora</SectionTitle></div>
      <KpiStrip items={kpisTransp} />
      <section className="info-panel accent-red">
        <h2>⚠ Hallazgo crítico: INTERRAPIDISIMO</h2>
        <p>42% del volumen sin visibilidad de novedades. Sin novedades reportadas no hay gestión proactiva para casi la mitad de las órdenes.</p>
        <div className="mini-stat-grid">
          {interrapAlert.map((k) => (
            <div key={k.l} className="mini-stat">
              <span>{k.l}</span>
              <strong>{k.v}</strong>
              <small>{k.s}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>Funnel por transportadora — creadas a entregadas</h2>
            <p>12 transportadoras · Mayo 2026.</p>
          </div>
        </div>
        <div className="info-table-wrap">
          <table className="info-table tbl">
            <thead>
              <tr>
                <th>Transportadora</th><th>Órdenes</th><th>Entregadas</th><th>% Entrega</th><th>% del Total</th>
              </tr>
            </thead>
            <tbody>
              {transpData.map((t) => (
                <tr key={t.name}>
                  <td className="n" style={{ color: t.color, fontWeight: 700 }}>{t.name}</td>
                  <td className="mono">{fmt(t.creadas)}</td>
                  <td className="mono">{fmt(t.entreg)}</td>
                  <td className="mono" style={{ fontWeight: 700, color: t.pctEnt >= 50 ? "#10b981" : t.pctEnt >= 42 ? "#f59e0b" : "#ef4444" }}>{t.pctEnt.toFixed(1).replace(".", ",")}%</td>
                  <td className="mono">{pctStr(t.creadas, F.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="info-two">
        <section className="info-panel">
          <h2>% Entrega por transportadora</h2>
          <p>Efectividad — top 10 por volumen.</p>
          <BarListChart data={carrierEntregaBars} max={100} suffix="%" />
        </section>
        <section className="info-panel">
          <h2>Volumen por transportadora</h2>
          <p>Participación — top 10.</p>
          <BarListChart data={carrierVolumenBars} />
        </section>
      </div>

      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>Flujo por transportadora — estados principales (Q18)</h2>
            <p>Top 5 carriers · datos reales Mayo 2026. Cada transportadora usa estados distintos.</p>
          </div>
        </div>
        <div className="carrier-sankey-grid">
          {carrierSankeys.map((c) => (
            <div key={c.key} className="carrier-sankey-card">
              <div className="csc-head">
                <strong>{c.title}</strong>
                <span>{c.badge}</span>
              </div>
              <Sankey data={c} />
            </div>
          ))}
        </div>
        <p className="info-note">
          INTERRAPIDISIMO pasa por RECLAME EN OFICINA (212h mediana). ENVIA tiene ciclo NOVEDAD→RE-DESPACHO (53h).
          COORDINADORA usa TERMINALES. TCC usa EN DISTRIBUCIÓN. VELOCES usa EN RUTA/EN CAMINO.
        </p>
      </section>

      {/* ============ VIEW 4 · MANIFIESTOS ============ */}
      <div id="s-manifiestos"><SectionTitle>Manifiestos y devoluciones</SectionTitle></div>
      <KpiStrip items={kpisManifiestos} />
      <section className="info-panel">
        <h2>Cobertura de manifiestos — base: movilizadas</h2>
        <p>% de movilizadas (1,44M) que pasan por cada tipo. Canceladas y rechazadas excluidas.</p>
        <BarListChart data={manifestCoverage.map((m) => ({ ...m, detail: pctStr(m.value, F.movil) + " de movilizadas" }))} max={F.movil} />
      </section>

      <section className="info-panel">
        <h2>Tipos de manifiesto</h2>
        <p>via history_logistic_management · Mayo 2026.</p>
        <div className="info-table-wrap">
          <table className="info-table tbl">
            <thead>
              <tr><th>ID</th><th>Tipo</th><th>Manifiestos</th><th>Órdenes asociadas</th><th>% Movilizadas</th></tr>
            </thead>
            <tbody>
              {manifestTable.map((m) => (
                <tr key={m.id}>
                  <td className="mono">{m.id}</td>
                  <td className="n" style={{ color: m.color, fontWeight: 700 }}>{m.tipo}</td>
                  <td className="mono">{fmt(m.manif)}</td>
                  <td className="mono">{fmt(m.ordenes)}</td>
                  <td className="mono">{pctStr(m.ordenes, F.movil)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="info-two">
        <section className="info-panel">
          <h2>Brecha devoluciones sin PreDevolution</h2>
          <p>74,7% sin manifiesto de retorno.</p>
          <div className="stat-boxes">
            <div className="stat-box green">
              <span>Con manif. PreDevolution</span>
              <strong>{fmt(devGap.conPre)}</strong>
              <small>{pctStr(devGap.conPre, devGap.total)} de {fmt(devGap.total)} devol.</small>
            </div>
            <div className="stat-box red">
              <span>Sin manif. PreDevolution</span>
              <strong>{fmt(devGap.sinPre)}</strong>
              <small>{pctStr(devGap.sinPre, devGap.total)} de {fmt(devGap.total)} devol.</small>
            </div>
          </div>
          <p className="info-note">{fmt(devGap.sinPre)} devoluciones sin manifiesto = brecha operativa. No hay trazabilidad del proceso de retorno.</p>
        </section>
        <section className="info-panel">
          <h2>Brecha por transportadora</h2>
          <p>118K devoluciones · 10 carriers. Devoluciones sin manifiesto de retorno.</p>
          <BarListChart data={devGapCarrier} scroll />
        </section>
      </div>

      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>Trazabilidad paso a paso — ¿dónde se pierde el tracking?</h2>
            <p>Sankey · movilizadas · Mayo 2026. 572K (35%) solo tienen SALIDA; 440K (27%) sin ningún manifiesto.</p>
          </div>
        </div>
        <Sankey data={manifiestoSankey} />
      </section>

      <div className="info-two">
        <section className="info-panel">
          <h2>Cobertura por tipo de manifiesto — vs movilizadas</h2>
          <p>Cada tipo, % de movilizadas.</p>
          <div className="insight-list">
            {flujoManifiestos.map((f) => (
              <div key={f.label} className="insight-row">
                <div className="insight-top">
                  <b>{f.label}</b>
                  <span style={{ color: f.color }}>{f.val} — {f.detail}</span>
                </div>
                <em>{f.nota}</em>
              </div>
            ))}
          </div>
        </section>
        <section className="info-panel">
          <h2>Recepciones PAU — paso interno Dropi</h2>
          <p>56,7% terminan entregado = indicador positivo. No es devolución.</p>
          <div className="stat-boxes">
            {pauStats.map((s) => (
              <div key={s.label} className={`stat-box ${s.tone}`}>
                <span>{s.label}</span>
                <strong>{s.value}</strong>
                <small>{s.sub}</small>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ============ VIEW 5 · TIEMPOS ============ */}
      <div id="s-tiempos"><SectionTitle>Tiempos entre estados</SectionTitle></div>
      <KpiStrip items={kpisTiempos} />
      <section className="info-panel">
        <h2>Ciclo de vida completo — creación a entrega/devolución (Q9)</h2>
        <p>Datos reales Mar–May 2026. Las devoluciones tardan 2-3x más que las entregas.</p>
        <div className="ciclo-grid">
          {cicloPorMes.map((m) => (
            <div key={m.mes} className="ciclo-card">
              <h4>{m.mes}</h4>
              <div className="ciclo-row">
                <div className="ciclo-box green">
                  <span>ENTREGADAS</span>
                  <strong>{fmt(m.entregadas)}</strong>
                  <small>{m.diasEnt.toString().replace(".", ",")}d promedio</small>
                </div>
                <div className="ciclo-box red">
                  <span>DEVUELTAS</span>
                  <strong>{fmt(m.devueltas)}</strong>
                  <small>{m.diasDev.toString().replace(".", ",")}d promedio</small>
                </div>
              </div>
              <p className="ciclo-ratio">Devolución toma {(m.diasDev / m.diasEnt).toFixed(1).replace(".", ",")}x más que entrega</p>
            </div>
          ))}
        </div>
      </section>

      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>Embudo de transiciones — volumen por paso (Q8)</h2>
            <p>Sankey · medianas · Mayo 2026. Ruta feliz ≈ 66h (2,8 días); cuello: transporte 28,4h.</p>
          </div>
        </div>
        <Sankey data={tiemposSankey} />
      </section>

      <div className="info-two">
        <section className="info-panel">
          <h2>Transiciones entre estados — Top 19 (Q8 medianas)</h2>
          <p>Datos reales · Mayo 2026. La mediana es más representativa que el promedio.</p>
          <div className="info-table-wrap">
            <table className="info-table tbl small">
              <thead>
                <tr><th>Transición</th><th>Órdenes</th><th>Prom.</th><th>Mediana</th><th>Tipo</th></tr>
              </thead>
              <tbody>
                {tiemposTable.map((t) => (
                  <tr key={t.label}>
                    <td className="n" style={{ color: t.color, fontWeight: 700, fontSize: 11 }}>{t.label}</td>
                    <td className="mono">{fmt(t.orders)}</td>
                    <td className="mono">{t.avgHours.toFixed(1).replace(".", ",")}h</td>
                    <td className="mono" style={{ fontWeight: 700, color: t.medianHours > 100 ? "#991b1b" : t.medianHours > 30 ? "#dc2626" : t.medianHours > 15 ? "#d97706" : "#059669" }}>{t.medianHours.toFixed(1).replace(".", ",")}h</td>
                    <td style={{ color: t.color, fontWeight: 600, fontSize: 11 }}>{t.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <section className="info-panel">
          <h2>Tiempos entre estados — mediana vs promedio</h2>
          <p>Ruta típica vs cola operativa. Los 12 pasos clave.</p>
          <TimeFlowChart data={timeTransitions} />
        </section>
      </div>

      <section className="info-panel">
        <h2>Flujo de tiempo — ruta feliz (medianas reales)</h2>
        <p>66,1h ≈ 2,8 días. Cuello: Despachada→Bod.Destino = 28,4h (43% del tiempo total).</p>
        <div className="step-flow">
          {timeFlowSteps.map((s, i) => (
            <span key={s.name} className="step-flow-item">
              <span className="step-chip" style={{ background: `${s.color}18`, color: s.color }}>
                {s.name}{i > 0 && <b>{s.hours.toString().replace(".", ",")}h</b>}
              </span>
              {i < timeFlowSteps.length - 1 && <span className="step-arrow">→</span>}
            </span>
          ))}
        </div>
        <div className="bottleneck-list">
          {bottlenecks.map((b) => (
            <div key={b.label} className="bottleneck-row" style={{ borderLeftColor: b.color }}>
              <div className="bn-top">
                <b style={{ color: b.color }}>{b.label}</b>
                <span>{b.med} — {b.ordenes} órdenes</span>
              </div>
              <em>{b.desc}</em>
            </div>
          ))}
        </div>
      </section>

      {/* ============ VIEW 6 · MOTIVOS ============ */}
      <div id="s-motivos"><SectionTitle>Motivos de cancelación y rechazo</SectionTitle></div>
      <KpiStrip items={kpisMotivos} />
      <div className="info-two">
        <section className="info-panel">
          <h2>Motivos de cancelación</h2>
          <p>238K cancel. · notes en history_orders. “Otros” y sin motivo siguen siendo deuda de instrumentación.</p>
          <BarListChart data={cancellationReasons} scroll />
        </section>
        <section className="info-panel">
          <h2>Motivos de rechazo</h2>
          <p>48K rechaz. · el rechazo está dominado por “Autorizado por gerencia” (57%).</p>
          <BarListChart data={rejectionReasons} />
        </section>
      </div>
      <section className="info-panel">
        <h2>Cancelaciones + rechazos por mes</h2>
        <p>Serie de 12 meses. Tendencia al alza en cancelaciones.</p>
        <GroupedBars data={cancelByMonth} />
      </section>

      {/* ============ MARCO CONCEPTUAL ============ */}
      <div id="s-marco"><SectionTitle>Mapa mental</SectionTitle></div>
      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>La orden por etapas</h2>
            <p>La unidad de valor no es la guía ni el escaneo: es la orden que llega bien al cliente.</p>
          </div>
        </div>
        <div className="info-stage-grid">
          {etapas.map((e) => (
            <div key={e.n} className={`info-stage-card ${e.tone}`}>
              <span className="num">{e.n}</span>
              <h3>{e.title}</h3>
              <p>{e.detail}</p>
              <small>{e.tag}</small>
            </div>
          ))}
        </div>
      </section>

      <SectionTitle>Data</SectionTitle>
      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>Modelo de datos</h2>
            <p>Cómo no mezclar cortes: estado actual, historia, eventos físicos, tiempos y novedades viven en fuentes distintas.</p>
          </div>
        </div>
        <InfoTable rows={dataModel} columns={["Pregunta", "Fuente", "Regla de uso"]} />
      </section>

      <SectionTitle>Roadmap</SectionTitle>
      <section className="info-panel">
        <h2>Qué mueve el 70%</h2>
        <InfoTable rows={roadmap} columns={["Frente", "Por qué importa", "Proyecto"]} />
      </section>

      <div id="s-fuentes"><SectionTitle>Fuentes completas</SectionTitle></div>
      <section className="info-panel">
        <div className="info-section-head">
          <div>
            <h2>Anexos servidos por Vercel</h2>
            <p>Los HTML completos viven dentro de esta misma sección para auditoría o consulta profunda.</p>
          </div>
        </div>
        <div className="info-source-grid">
          {fuentes.map((f) => (
            <a key={f.href} href={f.href} className="info-source-card" target="_blank" rel="noreferrer">
              <strong>{f.label}</strong>
              <p>{f.note}</p>
              <span>Abrir HTML completo →</span>
            </a>
          ))}
        </div>
      </section>

      <div className="info-actions">
        <Link href="/proyectos/logistica/updates">Ver weekly</Link>
        <Link href="/proyectos/logistica/mapa">Ver mapa de la orden</Link>
      </div>
    </main>
  );
}
