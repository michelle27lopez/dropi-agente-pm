"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { etapas, proyectoPorSlug } from "@/app/proyectos/logistica/_lib/data";
import {
  carriers,
  clientStates,
  countries,
  decisions,
  flowEdges,
  flowNodes,
  guideExamples,
  nodeById,
  normalizacionSummary,
  routeLabels,
  traceCycles,
  traceFindings,
  type GuideExample,
  type RouteMode,
} from "@/app/proyectos/logistica/_lib/normalizacion-estados-data";
import {
  evidenciaMeta,
  gateIntento,
  gateTerminalidad,
  hallazgoMapeo,
  reboteTerminales,
  topEstadosCarrier,
  topEstadosOrden,
  vocabularios,
} from "@/app/proyectos/logistica/_lib/normalizacion-evidencia-data";
import {
  crudos,
  destinoDe,
  estadosSinCrudo,
  flujoModal,
  propuestas,
  resumenes,
  resumirPropuesta,
  type PropuestaId,
} from "@/app/proyectos/logistica/_lib/normalizacion-catalogos-data";

type Tab = "mapa" | "homologacion" | "evidencia" | "decisiones";

/** Cada pestaña responde UNA pregunta. Antes eran 6 y dos de ellas mostraban evidencia. */
const tabs: { id: Tab; label: string; pregunta: string }[] = [
  { id: "mapa", label: "Mapa", pregunta: "¿Cómo es el flujo?" },
  { id: "homologacion", label: "Homologación", pregunta: "¿Cómo se traduce cada crudo?" },
  { id: "evidencia", label: "Evidencia", pregunta: "¿Qué dicen los datos?" },
  { id: "decisiones", label: "Decisiones", pregunta: "¿Qué falta decidir?" },
];

type MapViewProps = {
  guide: GuideExample | null;
  onClearGuide: () => void;
};

function MapView({ guide, onClearGuide }: MapViewProps) {
  // ECOM + Dropi por defecto: medido, es el recorrido que sigue el grueso del tráfico
  // (68,5% pasa por ECOM, 44,2% por recolección Dropi sobre las órdenes con guía).
  const [mode, setMode] = useState<RouteMode>("dropi");
  const [focus, setFocus] = useState<"completo" | "feliz" | "excepciones">("completo");
  const [capa, setCapa] = useState<"operador" | "cliente">("operador");
  const [selectedId, setSelectedId] = useState("received");

  /**
   * Respaldo real de cada nodo: cuántos crudos caen en él y qué % del tráfico mueven.
   * Sale del mismo reparto que la pestaña Homologación (propuesta macroproceso), así que
   * el mapa y la tabla nunca pueden decir cosas distintas.
   */
  const evidenciaNodo = useMemo(() => {
    const mapa = new Map<string, { crudos: number; pct: number }>();
    for (const grupo of resumirPropuesta("macroproceso").grupos) {
      mapa.set(grupo.estado, { crudos: grupo.crudos, pct: grupo.pct });
    }
    return mapa;
  }, []);

  const nivelDe = (label: string): "observado" | "raro" | "propuesto" => {
    const ev = evidenciaNodo.get(label);
    if (!ev) return "propuesto";
    return ev.pct >= 0.5 ? "observado" : "raro";
  };

  const conteoPropuestos = flowNodes.filter((n) => nivelDe(n.label) === "propuesto").length;
  const selected = flowNodes.find((node) => node.id === selectedId) ?? flowNodes[0];

  // Por nodo: en qué posiciones de la traza aparece (1-indexadas) y cuántas veces se repite.
  const traceHits = useMemo(() => {
    const hits = new Map<string, number[]>();
    if (!guide) return hits;
    guide.steps.forEach((step, index) => {
      if (!step.node) return;
      hits.set(step.node, [...(hits.get(step.node) ?? []), index + 1]);
    });
    return hits;
  }, [guide]);

  const unmappedSteps = guide?.steps.filter((step) => !step.node) ?? [];

  // Segmentos del recorrido: centro de nodo a centro de nodo, en el orden de la traza.
  // Los pasos sin nodo se saltan (no hay dónde dibujarlos) y se avisan en el banner.
  const traceSegments = useMemo(() => {
    if (!guide) return [];
    const points = guide.steps
      .map((step) => (step.node ? nodeById.get(step.node) : undefined))
      .filter((node): node is NonNullable<typeof node> => Boolean(node))
      .map((node) => ({ x: node.x + 70, y: node.y + 36 }));

    return points.slice(0, -1).map((from, index) => {
      const to = points[index + 1];
      // Curva suave: separa los tramos de ida y vuelta entre el mismo par de nodos.
      const dx = to.x - from.x;
      const dy = to.y - from.y;
      const bend = 0.14;
      const control = { x: (from.x + to.x) / 2 - dy * bend, y: (from.y + to.y) / 2 + dx * bend };
      return {
        key: `${index}-${from.x}-${from.y}-${to.x}-${to.y}`,
        order: index + 1,
        path: `M${from.x} ${from.y} Q${control.x} ${control.y} ${to.x} ${to.y}`,
        mid: { x: (from.x + to.x) / 4 + control.x / 2, y: (from.y + to.y) / 4 + control.y / 2 },
      };
    });
  }, [guide]);

  const nodeState = (node: typeof flowNodes[number]) => {
    const routeActive = node.modes.includes(mode);
    const focusMuted = focus === "feliz" ? node.kind === "exception" : focus === "excepciones" ? node.kind === "main" || node.kind === "optional" : false;
    const inTrace = traceHits.has(node.id);
    // Con una guía activa manda la traza: lo que la guía no toca se apaga.
    if (guide) return { routeActive, muted: !inTrace, inTrace };
    return { routeActive, muted: !routeActive || focusMuted, inTrace };
  };

  return (
    <div className="ne-view">
      <div className="ne-view-head">
        <div>
          <span className="ne-kicker">Flujo canónico por ruta</span>
          <h2>Una máquina de estados, tres recorridos operativos</h2>
          <p>{routeLabels[mode].detail}</p>
        </div>
        <div className="ne-map-controls">
          <div>
            <span>Ruta</span>
            <div className="ne-segmented" aria-label="Ruta operativa">
              {(Object.keys(routeLabels) as RouteMode[]).map((key) => (
                <button key={key} type="button" className={mode === key ? "is-active" : ""} onClick={() => setMode(key)} title="Participación estimada, pendiente de medición">
                  {routeLabels[key].label}
                  <i className="ne-route-peso">{routeLabels[key].peso}</i>
                </button>
              ))}
            </div>
          </div>
          <div>
            <span>Lectura</span>
            <div className="ne-segmented is-neutral" aria-label="Lectura del flujo">
              {(["completo", "feliz", "excepciones"] as const).map((key) => (
                <button key={key} type="button" className={focus === key ? "is-active" : ""} onClick={() => setFocus(key)}>
                  {key === "completo" ? "Completo" : key === "feliz" ? "Camino feliz" : "Excepciones"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <span>Capa</span>
            <div className="ne-segmented is-neutral" aria-label="Capa mostrada en el mapa">
              {(["operador", "cliente"] as const).map((key) => (
                <button key={key} type="button" className={capa === key ? "is-active" : ""} onClick={() => setCapa(key)}>
                  {key === "operador" ? "Operador" : "Cliente"}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {guide && (
        <div className="ne-trace-banner">
          <div>
            <span>Traza sobre el mapa</span>
            <strong>{guide.carrier} · {guide.id}</strong>
            <p>{guide.steps.length} pasos · {guide.highlight}</p>
          </div>
          {unmappedSteps.length > 0 && (
            <p className="ne-trace-banner-warn">
              {unmappedSteps.length} paso{unmappedSteps.length > 1 ? "s" : ""} sin nodo homologado: {unmappedSteps.map((step) => step.raw).join(", ")} — no se puede pintar porque el catálogo no lo contempla.
            </p>
          )}
          <button type="button" onClick={onClearGuide}>Quitar traza</button>
        </div>
      )}

      <div className="ne-journey-shell">
        <div className="ne-journey-scroll">
          <div className="ne-journey" aria-label={`Flujo ${routeLabels[mode].label}`}>
            <div className="ne-canvas-band band-main"><span>Columna vertebral de la orden</span></div>
            <div className="ne-canvas-band band-optional"><span>Servicios opcionales</span></div>
            <div className="ne-canvas-band band-exceptions"><span>Excepciones, recuperación y cierre</span></div>

            <svg className="ne-journey-edges" viewBox="0 0 1530 600" aria-hidden="true">
              <defs>
                {(["main", "optional", "warning", "danger", "return"] as const).map((tone) => (
                  <marker key={tone} id={`arrow-${tone}`} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                    <path d="M 0 0 L 10 5 L 0 10 z" className={`arrow-${tone}`} />
                  </marker>
                ))}
                <marker id="arrow-trace" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M 0 0 L 10 5 L 0 10 z" className="arrow-trace" />
                </marker>
              </defs>

              {/* Recorrido real de la guía: se deriva de los pasos, no de las aristas dibujadas.
                  Por eso hace visibles los saltos que el mapa no modela (ej. Entregado → En reparto). */}
              {traceSegments.map((segment) => (
                <g key={segment.key} className="ne-trace-seg">
                  <path d={segment.path} className="ne-trace-line" markerEnd="url(#arrow-trace)" />
                  <circle cx={segment.mid.x} cy={segment.mid.y} r="9" className="ne-trace-seg-bg" />
                  <text x={segment.mid.x} y={segment.mid.y + 3} className="ne-trace-seg-num">{segment.order}</text>
                </g>
              ))}
              {flowEdges.map((edge) => {
                const routeActive = edge.modes.includes(mode);
                const focusMuted = focus === "feliz" ? edge.kind === "exception" : focus === "excepciones" ? edge.kind === "main" : false;
                const muted = guide ? true : !routeActive || focusMuted;
                return <path key={edge.id} d={edge.path} className={`ne-edge edge-${edge.tone}${muted ? " is-muted" : ""}`} markerEnd={`url(#arrow-${edge.tone})`} />;
              })}
            </svg>

            {flowNodes.map((node) => {
              const state = nodeState(node);
              const hits = traceHits.get(node.id);
              const ev = evidenciaNodo.get(node.label);
              const nivel = nivelDe(node.label);
              return (
                <button
                  key={node.id}
                  type="button"
                  className={`ne-flow-node tone-${node.tone} kind-${node.kind} nivel-${nivel}${state.muted ? " is-muted" : ""}${selected.id === node.id ? " is-selected" : ""}${state.inTrace ? " in-trace" : ""}`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={selected.id === node.id}
                  title={ev ? `${ev.crudos} estados crudos caen acá · ${ev.pct}% del tráfico` : "Estado propuesto: ningún crudo lo alimenta todavía"}
                >
                  <span className="ne-node-dot" />
                  <strong>{capa === "cliente" ? node.client : node.label}</strong>
                  <small>
                    {ev ? `${ev.crudos} crudo${ev.crudos > 1 ? "s" : ""} · ${ev.pct}%` : "propuesto · sin crudo"}
                  </small>
                  {hits && (
                    <span className="ne-node-steps" title={`Pasos ${hits.join(", ")} de la traza`}>
                      {hits.join("·")}
                      {hits.length > 1 && <b>×{hits.length}</b>}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        <div className="ne-canvas-legend">
          <span><i className="main" /> Flujo principal</span>
          <span><i className="optional" /> ECOM / Dropi</span>
          <span><i className="warning" /> Recuperable</span>
          <span><i className="danger" /> Cierre negativo</span>
          <span><i className="return" /> Devolución</span>
          {guide && <span><i className="trace" /> Paso de la traza · el número es el orden</span>}
        </div>
      </div>

      <div className="ne-niveles">
        <div className="nivel-observado"><b>Observado</b><span>tiene estados crudos detrás y volumen real</span></div>
        <div className="nivel-raro"><b>Raro</b><span>tiene crudo, pero mueve menos del 0,5% del tráfico</span></div>
        <div className="nivel-propuesto"><b>Propuesto ({conteoPropuestos})</b><span>ningún crudo lo alimenta: hay que derivarlo o pedírselo al carrier</span></div>
      </div>

      <aside className={`ne-node-detail detail-${selected.tone}`}>
        <div className="ne-detail-title">
          <span>{selected.phase}</span>
          <h3>{selected.label}</h3>
          <p>{selected.detail}</p>
        </div>
        <div className="ne-detail-meta">
          <div><span>Responsable</span><strong>{selected.actor}</strong></div>
          <div><span>Vista cliente</span><strong>{selected.client}</strong></div>
        </div>
        <div className="ne-detail-flags">
          {selected.flags.map((flag) => <span key={flag}>{flag}</span>)}
        </div>
      </aside>

      <section className="ne-layer-model">
        <div className="ne-layer source"><b>0</b><span>Estado crudo</span><small>Carrier / Dropi</small></div>
        <i>→</i>
        <div className="ne-layer canonical"><b>1</b><span>Homologado</span><small>26+ operador</small></div>
        <i>→</i>
        <div className="ne-layer phase"><b>2</b><span>Fase</span><small>7 fases</small></div>
        <i>→</i>
        <div className="ne-layer customer"><b>3</b><span>Vista cliente</span><small>8 base + retiro</small></div>
      </section>

      <div className="ne-client-strip">
        {clientStates.map((state) => (
          <div key={state.name} className={`ne-client-state tone-${state.tone}`}>
            <strong>{state.name}</strong>
            <small>{state.detail}</small>
          </div>
        ))}
      </div>

      <details className="ne-source-diagram">
        <summary>Macroproceso original · referencia de contraste</summary>
        <div className="ne-source-diagram-body">
          <img src="/logistica/normalizacion-estados/macro-proceso-original.png" alt="Macroproceso original de homologación de estados con las siete fases" />
          <p>La fuente conserva rutas, responsables, reintentos, siniestro y devolución. La propuesta interactiva separa esas capas para hacerlas revisables.</p>
        </div>
      </details>
    </div>
  );
}

function CountriesView() {
  const [selectedName, setSelectedName] = useState("Colombia");
  const max = Math.max(...countries.map((country) => country.states));
  const selected = countries.find((country) => country.name === selectedName) ?? countries[0];
  return (
    <div className="ne-view">
      <div className="ne-view-head">
        <div>
          <span className="ne-kicker">Cobertura multinacional</span>
          <h2>El país no es eje del modelo; sí es eje de validación</h2>
          <p>Los nombres no mostraron colisiones semánticas por país. La evidencia transaccional profunda sigue concentrada en Colombia.</p>
        </div>
        <div className="ne-evidence-legend">
          <span><i className="real" /> Tráfico real</span>
          <span><i className="catalog" /> Catálogo API</span>
        </div>
      </div>
      <div className="ne-country-explorer">
        <div className="ne-country-cloud" aria-label="Países por tamaño de catálogo">
          <div className="ne-global-core"><strong>Catálogo global</strong><span>Sin eje país</span></div>
          {countries.map((country) => {
            const size = 64 + Math.sqrt(country.states / max) * 64;
            return (
              <button
                key={country.name}
                type="button"
                className={`ne-country-bubble evidence-${country.evidence}${selected.name === country.name ? " is-selected" : ""}`}
                style={{ width: size, height: size }}
                onClick={() => setSelectedName(country.name)}
                aria-pressed={selected.name === country.name}
              >
                <strong>{country.name}</strong>
                <span>{country.display}</span>
              </button>
            );
          })}
        </div>
        <aside className={`ne-country-card evidence-${selected.evidence}`}>
          <span>{selected.evidence === "real" ? "Catálogo + tráfico real" : "Catálogo API"}</span>
          <h3>{selected.name}</h3>
          <strong>{selected.display} <small>estados publicados</small></strong>
          <p>{selected.note}</p>
          <div className="ne-country-proof">
            <div><b>Podemos afirmar</b><span>El vocabulario entra al catálogo global sin eje país.</span></div>
            <div><b>Falta cerrar</b><span>{selected.evidence === "real" ? "Cruzar los estados de mayor volumen con el mapeo v1." : "Tomar una guía real y medir estados crudos sin clasificar."}</span></div>
          </div>
        </aside>
      </div>

      <details className="ne-country-details">
        <summary>Ver cobertura completa en tabla</summary>
        <div className="ne-country-table">
          <div className="ne-country-row is-head"><span>País</span><span>Estados publicados</span><span>Evidencia</span></div>
          {countries.map((country) => (
            <div className="ne-country-row" key={country.name}>
              <strong>{country.name}</strong>
              <div className="ne-country-volume">
                <div><i style={{ width: `${Math.max((country.states / max) * 100, 4)}%` }} /></div>
                <b>{country.display}</b>
              </div>
              <div className="ne-country-evidence">
                <span className={`evidence-${country.evidence}`}>{country.evidence === "real" ? "Catálogo + tráfico" : "Catálogo"}</span>
                <small>{country.note}</small>
              </div>
            </div>
          ))}
        </div>
      </details>
      <div className="ne-country-conclusion">
        <div><strong>Decisión soportada</strong><p>Catálogo global por estado crudo, sin columna país.</p></div>
        <div><strong>Gate pendiente</strong><p>Una guía real por país para probar cobertura y detectar crudos no observados.</p></div>
        <div><strong>Excepción prevista</strong><p>Override por transportadora solo cuando el mismo texto represente eventos distintos.</p></div>
      </div>
    </div>
  );
}

function CarriersView() {
  const max = Math.max(...carriers.map((carrier) => carrier.mappings));
  const targetStats = [
    { value: "346", label: "mapeos terminan en Novedad", detail: "60% de toda la complejidad" },
    { value: "4", label: "estados siguen sin mapeo", detail: "CONFIRMADO, ARCHIVADAMENOR, PEND ING CUSTODIA, RECOLECCION" },
    { value: "6", label: "colisiones investigadas", detail: "5 de llenado; 1 posible semántica real" },
  ];
  return (
    <div className="ne-view">
      <div className="ne-view-head">
        <div>
          <span className="ne-kicker">Mapeo crudo → homologado</span>
          <h2>576 mapeos de campo en siete carriers</h2>
          <p>La complejidad no está distribuida: ENVIA concentra el mayor catálogo y Novedad absorbe seis de cada diez mapeos.</p>
        </div>
      </div>
      <div className="ne-carrier-layout">
        <div className="ne-carrier-bars">
          {carriers.map((carrier) => (
            <div className="ne-carrier-row" key={carrier.name}>
              <strong>{carrier.name}</strong>
              <div><i style={{ width: `${Math.max((carrier.mappings / max) * 100, 2)}%` }} /></div>
              <b>{carrier.mappings}</b>
            </div>
          ))}
        </div>
        <div className="ne-carrier-stats">
          {targetStats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
              <small>{stat.detail}</small>
            </div>
          ))}
        </div>
      </div>
      <div className="ne-callout warning">
        <strong>La muestra de mapeos y la muestra de guías no tienen los mismos siete carriers.</strong>
        <p>TCC y JAMV-Drive aparecen en el mapeo; 99minutos y Futura aparecen en las trazas. La cobertura final debe cruzar ambas listas, no tratarlas como equivalentes.</p>
      </div>
    </div>
  );
}

function ExamplesView({ onOpenInMap }: { onOpenInMap: (guide: GuideExample) => void }) {
  const [carrier, setCarrier] = useState("Todos");
  const [outcome, setOutcome] = useState("Todos");
  const carrierOptions = ["Todos", ...Array.from(new Set(guideExamples.map((guide) => guide.carrier)))];
  const filtered = useMemo(() => guideExamples.filter((guide) =>
    (carrier === "Todos" || guide.carrier === carrier) && (outcome === "Todos" || guide.outcome === outcome),
  ), [carrier, outcome]);

  return (
    <div className="ne-view">
      <div className="ne-view-head">
        <div>
          <span className="ne-kicker">Trazas de punta a punta · muestra del camino difícil</span>
          <h2>14 guías reales del camino difícil, no una muestra representativa</h2>
          <p>Cada paso está normalizado a un estado del mapa; al lado va lo que veía el cliente en ese momento. Si un paso crudo no tiene nodo, se muestra así en vez de inventarle uno.</p>
        </div>
        <div className="ne-filters">
          <label>Carrier<select value={carrier} onChange={(event) => setCarrier(event.target.value)}>{carrierOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
          <label>Desenlace<select value={outcome} onChange={(event) => setOutcome(event.target.value)}><option>Todos</option><option>Entregado</option><option>Devolución</option></select></label>
        </div>
      </div>
      <div className="ne-example-summary">
        <span><b>{filtered.length}</b> guías visibles</span>
        <span><b>3</b> entregadas en la muestra completa</span>
        <span><b>11</b> devueltas en la muestra completa</span>
      </div>

      <div className="ne-callout warning">
        <strong>Ojo: estas 14 guías son casi todas devoluciones. El grueso de las órdenes no se ve acá.</strong>
        <p>
          11 de 14 terminan devueltas, cuando la devolución es ~8% del volumen real. Y <b>ninguna guía es
          de una orden cancelada</b>, que es 1 de cada 7. Sirven para ver dónde se rompe el vocabulario,
          no para dimensionar.
        </p>
      </div>
      <div className="ne-findings">
        {traceFindings.map((finding) => (
          <div key={finding.title} className={`ne-finding level-${finding.level}`}>
            <strong>{finding.title}</strong>
            <p>{finding.detail}</p>
          </div>
        ))}
      </div>

      <div className="ne-example-list">
        {filtered.map((guide) => {
          const cycles = traceCycles(guide.steps);
          return (
            <article className="ne-example" key={`${guide.carrier}-${guide.id}`}>
              <header>
                <div><span>{guide.carrier}</span><strong>{guide.id}</strong></div>
                <span className={`ne-outcome ${guide.outcome === "Entregado" ? "done" : "returned"}`}>{guide.outcome}</span>
              </header>
              <p>{guide.highlight}</p>
              <ol className="ne-trace-table">
                <li className="is-head"><span>#</span><span>Estado homologado</span><span>Veía el cliente</span></li>
                {guide.steps.map((step, index) => {
                  const node = step.node ? nodeById.get(step.node) : undefined;
                  const cycle = cycles[index];
                  const client = node ? node.client : step.clientRaw;
                  // La vista cliente solo se escribe cuando CAMBIA. Repetirla es ruido y
                  // esconde el dato importante: cuántos estados de operador colapsan en uno.
                  const previous = guide.steps[index - 1];
                  const previousClient = previous
                    ? (previous.node ? nodeById.get(previous.node)?.client : previous.clientRaw)
                    : undefined;
                  const clientChanged = client !== previousClient;
                  return (
                    <li key={`${step.node ?? step.raw}-${index}`} className={node ? `tone-${node.tone}` : "is-unmapped"}>
                      <span className="ne-trace-num">{index + 1}</span>
                      <span className="ne-trace-state">
                        {node ? node.label : step.raw}
                        {cycle && <b title="Rebote: la traza vuelve a un estado ya visitado">ciclo {cycle}</b>}
                        {!node && <em>sin nodo homologado</em>}
                        {node && step.raw && step.raw !== node.label && <i title="Etiqueta original de la hoja de campo">crudo: {step.raw}</i>}
                      </span>
                      {clientChanged
                        ? <span className="ne-trace-client">{client}</span>
                        : <span className="ne-trace-client is-same" title={`Sigue en "${client}" — el cliente no ve ningún cambio`} aria-label="sin cambio para el cliente" />}
                    </li>
                  );
                })}
              </ol>
              <button type="button" className="ne-trace-map-link" onClick={() => onOpenInMap(guide)}>Ver esta traza sobre el mapa →</button>
            </article>
          );
        })}
      </div>
    </div>
  );
}

function HomologacionView() {
  const [propuesta, setPropuesta] = useState<PropuestaId>("macroproceso");
  const activa = propuestas.find((p) => p.id === propuesta) ?? propuestas[0];
  const resumen = resumirPropuesta(propuesta);
  const sinCrudo = estadosSinCrudo[propuesta];

  // Los crudos que caen en cada estado destino, para poder abrir el grupo.
  const crudosPorDestino = useMemo(() => {
    const mapa = new Map<string, typeof crudos>();
    for (const row of crudos) {
      const destino = destinoDe(row, propuesta);
      if (!destino) continue;
      mapa.set(destino, [...(mapa.get(destino) ?? []), row]);
    }
    return mapa;
  }, [propuesta]);

  return (
    <div className="ne-view">
      <div className="ne-view-head">
        <div>
          <span className="ne-kicker">Crudo → homologado · 51 estados observados</span>
          <h2>Cuatro catálogos posibles sobre el mismo tráfico real</h2>
          <p>Cada propuesta reparte los mismos {crudos.length} estados crudos de forma distinta. Elegí una y mirá qué colapsa en qué.</p>
        </div>
      </div>

      <div className="ne-props">
        {propuestas.map((item) => {
          const r = resumenes.find((x) => x.id === item.id)!;
          return (
            <button
              key={item.id}
              type="button"
              className={`ne-prop${propuesta === item.id ? " is-active" : ""}`}
              onClick={() => setPropuesta(item.id)}
              aria-pressed={propuesta === item.id}
            >
              <strong>{item.nombre}</strong>
              <small>{item.origen}</small>
              <div className="ne-prop-nums">
                <div><b>{r.estados}</b><span>estados</span></div>
                <div><b>{r.baldeMayor.crudos}</b><span>crudos en el balde mayor</span></div>
                <div className={r.sinCrudo > 0 ? "is-warn" : ""}><b>{r.sinCrudo}</b><span>sin crudo</span></div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="ne-prop-detail">
        <div><b>Para qué sirve</b><p>{activa.intencion}</p></div>
        <div><b>Qué se paga</b><p>{activa.riesgo}</p></div>
      </div>

      <h3 className="ne-sub">Reparto de los {crudos.length} crudos · {activa.nombre}</h3>
      <p className="ne-note">
        El balde más grande es <b>{resumen.baldeMayor.estado}</b>: absorbe <b>{resumen.baldeMayor.crudos} crudos</b> distintos
        ({resumen.baldeMayor.pct}% del tráfico). Cuanto más grande, menos se puede medir dónde se traba la orden.
      </p>

      <div className="ne-grupos">
        {resumen.grupos.map((grupo) => (
          <details className="ne-grupo" key={grupo.estado}>
            <summary>
              <strong>{grupo.estado}</strong>
              <span className="ne-grupo-crudos">{grupo.crudos} crudo{grupo.crudos > 1 ? "s" : ""}</span>
              <span className="ne-grupo-bar"><i style={{ width: `${Math.max(grupo.pct, 0.6)}%` }} /></span>
              <b>{grupo.pct}%</b>
            </summary>
            <ul>
              {(crudosPorDestino.get(grupo.estado) ?? []).map((row) => (
                <li key={row.crudo}>
                  <code>{row.crudo}</code>
                  <span>{row.eventos.toLocaleString("es-CO")}</span>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      {sinCrudo.length > 0 && (
        <>
          <h3 className="ne-sub">Estados que esta propuesta define pero ningún crudo alimenta</h3>
          <div className="ne-sincrudo">
            {sinCrudo.map((item) => (
              <div key={item.estado}>
                <strong>{item.estado}</strong>
                <p>{item.porQue}</p>
              </div>
            ))}
          </div>
          <p className="ne-note">
            No es un defecto por sí solo: varios existen para medir una ventana de tiempo que hoy no se registra.
            Pero <b>no llegan solos</b> — hay que derivarlos por regla o pedírselos al transportador. Eso es trabajo de TI, y hay que decirlo en el hand-off.
          </p>
        </>
      )}

      <h3 className="ne-sub">{flujoModal.titulo} · traducido por {activa.nombre}</h3>
      <p className="ne-note">{flujoModal.nota}</p>
      <ol className="ne-modal-flow">
        {flujoModal.pasos.map((paso, index) => {
          const row = crudos.find((c) => c.crudo === paso.crudo);
          const destino = row ? destinoDe(row, propuesta) : null;
          const previo = index > 0 ? flujoModal.pasos[index - 1] : null;
          const destinoPrevio = previo ? destinoDe(crudos.find((c) => c.crudo === previo.crudo)!, propuesta) : null;
          const colapsa = destino !== null && destino === destinoPrevio;
          return (
            <li key={paso.crudo} className={colapsa ? "is-colapsado" : ""}>
              <code>{paso.crudo}</code>
              <span className="ne-modal-arrow">→</span>
              <strong>{destino ?? "sin destino"}</strong>
              {colapsa && <em>se funde con el paso anterior</em>}
            </li>
          );
        })}
      </ol>
      <p className="ne-note">
        Los pasos marcados <b>se funden</b> con el anterior bajo esta propuesta: el cliente no vería ningún cambio ahí.
        Es la forma más directa de ver si un catálogo es demasiado grueso o demasiado fino.
      </p>
    </div>
  );
}

function EvidenceView() {
  const [vocab, setVocab] = useState<"A" | "C">("A");
  const activo = vocabularios.find((item) => item.id === vocab) ?? vocabularios[0];
  const top = vocab === "A" ? topEstadosOrden : topEstadosCarrier;
  const maxN = Math.max(...top.map((row) => row.n));

  return (
    <div className="ne-view">
      <div className="ne-view-head">
        <div>
          <span className="ne-kicker">Corrida de análisis · {evidenciaMeta.fecha}</span>
          <h2>Lo que los datos dicen, separado de lo que proponemos</h2>
          <p>{evidenciaMeta.fuente} · ventana {evidenciaMeta.ventana}. Esta pestaña no propone nada: mide.</p>
        </div>
      </div>

      <div className="ne-callout warning">
        <strong>Alcance real de la medición</strong>
        <p>{evidenciaMeta.advertencia}</p>
      </div>

      <h3 className="ne-sub">Hay dos vocabularios, y no dan la misma respuesta</h3>
      <div className="ne-vocab-grid">
        {vocabularios.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`ne-vocab tono-${item.tono}${vocab === item.id ? " is-active" : ""}`}
            onClick={() => setVocab(item.id as "A" | "C")}
            aria-pressed={vocab === item.id}
          >
            <span className="ne-vocab-id">{item.id}</span>
            <strong>{item.nombre}</strong>
            <code>{item.fuente}</code>
            <div className="ne-vocab-nums">
              <div><b>{item.eventos.toLocaleString("es-CO")}</b><span>eventos</span></div>
              <div><b>{item.estadosDistintos.toLocaleString("es-CO")}</b><span>estados distintos</span></div>
            </div>
            <div className="ne-vocab-cortes">
              {item.cortes.map((corte) => (
                <span key={corte.pct}><b>{corte.estados}</b> estados = {corte.pct}</span>
              ))}
            </div>
            <p>{item.lectura}</p>
          </button>
        ))}
      </div>

      <h3 className="ne-sub">Estados más frecuentes · vocabulario {activo.id}</h3>
      <div className="ne-freq">
        {top.map((row) => (
          <div className="ne-freq-row" key={row.estado}>
            <strong>{row.estado}</strong>
            <div><i style={{ width: `${Math.max((row.n / maxN) * 100, 1.5)}%` }} /></div>
            <b>{row.n.toLocaleString("es-CO")}</b>
            <small>{row.pct}%</small>
            <em>acum {row.cum}%</em>
          </div>
        ))}
      </div>
      <p className="ne-note">
        Sin clasificar en este vocabulario: <b>{activo.sinClasificar}</b> — {activo.sinClasificarDetalle}.
      </p>

      <h3 className="ne-sub">🟢 Gate resuelto · INTENTO DE ENTREGA</h3>
      <div className="ne-gate resuelto">
        <div className="ne-gate-head">
          <span>Resuelto con datos</span>
          <strong>{gateIntento.titular}</strong>
          <p>{gateIntento.ocurrenciasInter.toLocaleString("es-CO")} de {gateIntento.ocurrenciasTotales.toLocaleString("es-CO")} ocurrencias son de Interrapidísimo ({gateIntento.concentracion}%).</p>
        </div>
        <div className="ne-gate-table">
          <div className="is-head"><span>Transportadora</span><span>Término</span><span>n</span><span>→ entregado</span><span>→ falla</span><span>Lectura</span></div>
          {gateIntento.filas.map((fila) => (
            <div key={fila.carrier + fila.termino}>
              <strong>{fila.carrier}</strong>
              <span>{fila.termino}</span>
              <span>{fila.n.toLocaleString("es-CO")}</span>
              <span className={fila.entregado > 30 ? "is-good" : ""}>{fila.entregado}%</span>
              <span className={fila.falla > 50 ? "is-bad" : ""}>{fila.falla}%</span>
              <b>{fila.lectura}</b>
            </div>
          ))}
        </div>
        <p className="ne-gate-consecuencia">{gateIntento.consecuencia}</p>
        <p className="ne-note">⚠️ {gateIntento.reserva}</p>
      </div>

      <div className="ne-callout danger">
        <strong>Hallazgo colateral: {hallazgoMapeo.estado} está mal clasificado hoy</strong>
        <p>
          Mapeado a <code>{hallazgoMapeo.mapeoActual}</code> cuando los datos dicen <code>{hallazgoMapeo.mapeoCorrecto}</code>.
          Son <b>{hallazgoMapeo.ocurrencias.toLocaleString("es-CO")} eventos</b> ({hallazgoMapeo.pctTrafico}% del tráfico). {hallazgoMapeo.impacto}
        </p>
      </div>

      <h3 className="ne-sub">🟡 Gate abierto · ¿cuándo Entregado es terminal?</h3>
      <div className="ne-gate abierto">
        <div className="ne-gate-head">
          <span>Requiere decisión, no más datos</span>
          <strong>{gateTerminalidad.titular}</strong>
          <p>{gateTerminalidad.pregunta}</p>
        </div>
        <div className="ne-lecturas">
          {gateTerminalidad.lecturas.map((lectura) => (
            <div key={lectura.vocab}>
              <span>{lectura.vocab}</span>
              <b>{lectura.pregunta}</b>
              <div className="ne-lectura-nums">
                <div><strong>{lectura.rebotePct}%</strong><small>rebota</small></div>
                <div><strong>{lectura.p99h} h</strong><small>p99</small></div>
                <div><strong>{lectura.maxh} h</strong><small>máximo</small></div>
              </div>
              <p>{lectura.conclusion}</p>
              <small className="ne-reserva">⚠️ {lectura.reserva}</small>
            </div>
          ))}
        </div>
        <p className="ne-gate-consecuencia">{gateTerminalidad.recomendacion}</p>
      </div>

      <h3 className="ne-sub">Estados «terminales» que rebotan</h3>
      <div className="ne-rebote">
        <div className="ne-rebote-row is-head"><span>Transportadora</span><span>Estado terminal</span><span>Alcanzado</span><span>Rebota</span><span>p99</span></div>
        {reboteTerminales.map((row) => (
          <div className={`ne-rebote-row${row.alerta ? " is-alert" : ""}`} key={row.carrier + row.terminal}>
            <strong>{row.carrier}</strong>
            <span>{row.terminal}</span>
            <span>{row.alcanzado.toLocaleString("es-CO")}</span>
            <b>{row.pct}%</b>
            <span>{row.p99h} h</span>
          </div>
        ))}
      </div>
      <p className="ne-note">
        <b>PEDIDO CANCELADO de Coordinadora rebota el 99,59%</b>, con mediana de 3 minutos hasta el evento
        siguiente. No es un estado terminal: es una etiqueta que se emite junto con otras. Quien lo trate
        como cierre, cuenta mal.
      </p>
    </div>
  );
}

function DecisionsView() {
  return (
    <div className="ne-view">
      <div className="ne-view-head">
        <div>
          <span className="ne-kicker">Definition of Ready</span>
          <h2>Siete decisiones separan el borrador de una propuesta final</h2>
          <p>Los dos gates críticos afectan arquitectura y medición. El resto cierra catálogo, experiencia y plan de implementación.</p>
        </div>
      </div>
      <div className="ne-decision-list">
        {decisions.map((decision, index) => (
          <article key={decision.title} className={`ne-decision level-${decision.level}`}>
            <span className="ne-decision-num">{String(index + 1).padStart(2, "0")}</span>
            <div><h3>{decision.title}</h3><p>{decision.question}</p></div>
            <div className="ne-decision-action"><span>Siguiente cierre</span><p>{decision.action}</p></div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default function NormalizacionEstadosView() {
  const [tab, setTab] = useState<Tab>("mapa");
  const [activeGuide, setActiveGuide] = useState<GuideExample | null>(null);
  const openInMap = (guide: GuideExample) => {
    setActiveGuide(guide);
    setTab("mapa");
  };
  const proyecto = proyectoPorSlug("normalizacion-estados");
  const idxEtapa = proyecto
    ? etapas.findIndex((e) => proyecto.etapa.startsWith(e.nombre) || e.nombre.startsWith(proyecto.etapa))
    : -1;

  return (
    <main className="page ne-page">
      <Link href="/celula/logistica" className="back">← Célula Logística</Link>

      <header className="ne-titlebar">
        <div>
          <span className="ne-status">Borrador de definición · PRM-1297</span>
          <h1>Normalización de estados</h1>
          <p>Lenguaje único para medir la orden, operar excepciones y mostrar al cliente solo lo que necesita.</p>
        </div>
        <a href="https://dropi-it.atlassian.net/browse/PRM-1297" target="_blank" rel="noreferrer">Abrir PRM-1297 ↗</a>
      </header>

      {/* Contexto que antes vivía en una ficha aparte: foco y posición en la cadena de valor. */}
      {proyecto && (
        <section className="ne-project-context">
          <div>
            <b>Foco</b>
            <p>{proyecto.foco}</p>
          </div>
          {idxEtapa >= 0 && (
            <div>
              <b>Etapa de la orden</b>
              <div className="fx-chain">
                {etapas.map((etapa, index) => (
                  <span key={etapa.n} className={`fx-chain-step${index === idxEtapa ? " is-current" : ""}`}>{etapa.nombre}</span>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      <section className="ne-summary" aria-label="Resumen de evidencia">
        {normalizacionSummary.map((item) => (
          <div key={item.label}><span>{item.label}</span><strong>{item.value}</strong><small>{item.note}</small></div>
        ))}
      </section>

      <div className="ne-alert-strip">
        <strong>Lectura honesta</strong>
        <span>El modelo global está bien sustentado; la validación transaccional multinacional todavía no está cerrada.</span>
      </div>

      <nav className="ne-tabs" role="tablist" aria-label="Vistas de normalización">
        {tabs.map((item) => (
          <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? "is-active" : ""} onClick={() => setTab(item.id)} title={item.pregunta}>
            {item.label}
            <i>{item.pregunta}</i>
          </button>
        ))}
      </nav>

      {tab === "mapa" && (
        <>
          <MapView guide={activeGuide} onClearGuide={() => setActiveGuide(null)} />
          <ExamplesView onOpenInMap={openInMap} />
        </>
      )}
      {tab === "homologacion" && (
        <>
          <HomologacionView />
          <CarriersView />
        </>
      )}
      {tab === "evidencia" && (
        <>
          <EvidenceView />
          <CountriesView />
        </>
      )}
      {tab === "decisiones" && <DecisionsView />}
    </main>
  );
}
