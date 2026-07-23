"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { etapas, proyectoPorSlug } from "@/app/proyectos/logistica/_lib/data";
import {
  carriers,
  clientStates,
  countries,
  decisions,
  exercisedNodeIds,
  flowEdges,
  flowNodes,
  guideExamples,
  nodeById,
  normalizacionSummary,
  routeLabels,
  traceCycles,
  traceFindings,
  unexercisedNodes,
  type GuideExample,
  type RouteMode,
} from "@/app/proyectos/logistica/_lib/normalizacion-estados-data";

type Tab = "mapa" | "paises" | "carriers" | "ejemplos" | "decisiones";

const tabs: { id: Tab; label: string }[] = [
  { id: "mapa", label: "Mapa objetivo" },
  { id: "paises", label: "Países" },
  { id: "carriers", label: "Carriers" },
  { id: "ejemplos", label: "Ejemplos reales" },
  { id: "decisiones", label: "Decisiones" },
];

type MapViewProps = {
  guide: GuideExample | null;
  onClearGuide: () => void;
};

function MapView({ guide, onClearGuide }: MapViewProps) {
  // Directo por defecto: es la ruta que mueve el grueso del volumen. Antes abría en
  // "ECOM + Dropi", que es la más rara (~1%) — la primera pantalla mostraba la excepción.
  const [mode, setMode] = useState<RouteMode>("directo");
  const [focus, setFocus] = useState<"completo" | "feliz" | "excepciones">("completo");
  const [coverage, setCoverage] = useState(false);
  const [selectedId, setSelectedId] = useState("received");
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
            <span>Evidencia</span>
            <div className="ne-segmented is-neutral" aria-label="Cobertura por guías reales">
              <button type="button" className={coverage ? "is-active" : ""} onClick={() => setCoverage((value) => !value)}>
                Marcar sin validar ({unexercisedNodes.length})
              </button>
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
              const unvalidated = coverage && !exercisedNodeIds.has(node.id);
              return (
                <button
                  key={node.id}
                  type="button"
                  className={`ne-flow-node tone-${node.tone} kind-${node.kind}${state.muted ? " is-muted" : ""}${selected.id === node.id ? " is-selected" : ""}${state.inTrace ? " in-trace" : ""}${unvalidated ? " is-unvalidated" : ""}`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={selected.id === node.id}
                >
                  <span className="ne-node-dot" />
                  <strong>{node.label}</strong>
                  <small>{node.client}</small>
                  {hits && (
                    <span className="ne-node-steps" title={`Pasos ${hits.join(", ")} de la traza`}>
                      {hits.join("·")}
                      {hits.length > 1 && <b>×{hits.length}</b>}
                    </span>
                  )}
                  {unvalidated && <span className="ne-node-unvalidated" title="Ninguna de las 14 guías recorre este estado">sin validar</span>}
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
          {coverage && <span><i className="unvalidated" /> Sin guía que lo recorra</span>}
        </div>
      </div>

      {coverage && (
        <div className="ne-coverage-panel">
          <div>
            <strong>{exercisedNodeIds.size} de {flowNodes.length} estados</strong>
            <span>los recorre al menos una de las 14 guías reales</span>
          </div>
          <p>
            Los otros {unexercisedNodes.length} están en el catálogo porque el macroproceso los define, no porque la muestra los pruebe:{" "}
            {unexercisedNodes.map((node) => node.label).join(" · ")}. Todo el tramo ECOM sin Dropi, el ciclo de recolección fallida,
            el retiro en punto, el siniestro y el rechazo entran a TI como propuesta, no como comportamiento observado.
          </p>
        </div>
      )}

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
        <strong>Esta muestra sobre-representa el fracaso a propósito. No la uses para dimensionar.</strong>
        <p>
          11 de 14 guías terminan en devolución (79%) cuando la devolución es ~8% del volumen; 9 de 14 pasan
          por recolección Dropi (64%) cuando esa ruta es ~1%. <b>Cancelado no tiene ni una guía</b>, siendo
          1 de cada 7 órdenes. Sirve para estresar el catálogo — que es donde el vocabulario se rompe —
          pero <b>no prueba cobertura</b>.
        </p>
        <p>
          Los porcentajes de contraste salen de la ventana auditada (133.555 órdenes / 52.636 guías),
          que es ~0,7% del volumen anual. Son orden de magnitud, no medición: pendiente el conteo sobre
          el universo completo.
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
          <button key={item.id} type="button" role="tab" aria-selected={tab === item.id} className={tab === item.id ? "is-active" : ""} onClick={() => setTab(item.id)}>
            {item.label}
          </button>
        ))}
      </nav>

      {tab === "mapa" && <MapView guide={activeGuide} onClearGuide={() => setActiveGuide(null)} />}
      {tab === "paises" && <CountriesView />}
      {tab === "carriers" && <CarriersView />}
      {tab === "ejemplos" && <ExamplesView onOpenInMap={openInMap} />}
      {tab === "decisiones" && <DecisionsView />}
    </main>
  );
}
