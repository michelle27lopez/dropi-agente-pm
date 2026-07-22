"use client";

import { useMemo, useState } from "react";
import {
  carriers,
  clientStates,
  countries,
  decisions,
  flowEdges,
  flowNodes,
  guideExamples,
  normalizacionSummary,
  routeLabels,
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

function MapView() {
  const [mode, setMode] = useState<RouteMode>("dropi");
  const [focus, setFocus] = useState<"completo" | "feliz" | "excepciones">("completo");
  const [selectedId, setSelectedId] = useState("received");
  const selected = flowNodes.find((node) => node.id === selectedId) ?? flowNodes[0];

  const nodeState = (node: typeof flowNodes[number]) => {
    const routeActive = node.modes.includes(mode);
    const focusMuted = focus === "feliz" ? node.kind === "exception" : focus === "excepciones" ? node.kind === "main" || node.kind === "optional" : false;
    return { routeActive, muted: !routeActive || focusMuted };
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
                <button key={key} type="button" className={mode === key ? "is-active" : ""} onClick={() => setMode(key)}>
                  {routeLabels[key].label}
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
        </div>
      </div>

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
              </defs>
              {flowEdges.map((edge) => {
                const routeActive = edge.modes.includes(mode);
                const focusMuted = focus === "feliz" ? edge.kind === "exception" : focus === "excepciones" ? edge.kind === "main" : false;
                return <path key={edge.id} d={edge.path} className={`ne-edge edge-${edge.tone}${!routeActive || focusMuted ? " is-muted" : ""}`} markerEnd={`url(#arrow-${edge.tone})`} />;
              })}
            </svg>

            {flowNodes.map((node) => {
              const state = nodeState(node);
              return (
                <button
                  key={node.id}
                  type="button"
                  className={`ne-flow-node tone-${node.tone} kind-${node.kind}${state.muted ? " is-muted" : ""}${selected.id === node.id ? " is-selected" : ""}`}
                  style={{ left: node.x, top: node.y }}
                  onClick={() => setSelectedId(node.id)}
                  aria-pressed={selected.id === node.id}
                >
                  <span className="ne-node-dot" />
                  <strong>{node.short ?? node.label}</strong>
                  <small>{node.client}</small>
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
        </div>
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

function ExamplesView() {
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
          <span className="ne-kicker">Trazas de punta a punta</span>
          <h2>14 guías reales muestran dónde el catálogo teórico se rompe</h2>
          <p>Las secuencias están deduplicadas por repetición consecutiva para hacer visibles rebotes, reintentos y cierres falsos.</p>
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
      <div className="ne-example-list">
        {filtered.map((guide) => (
          <article className="ne-example" key={`${guide.carrier}-${guide.id}`}>
            <header>
              <div><span>{guide.carrier}</span><strong>{guide.id}</strong></div>
              <span className={`ne-outcome ${guide.outcome === "Entregado" ? "done" : "returned"}`}>{guide.outcome}</span>
            </header>
            <p>{guide.highlight}</p>
            <div className="ne-trace">
              {guide.steps.map((step, index) => (
                <span key={`${step}-${index}`} className={step.includes("Novedad") || step.includes("Cancelado") ? "is-alert" : step.includes("Entregado") ? "is-done" : step.includes("Devolución") ? "is-return" : ""}>
                  {step}
                </span>
              ))}
            </div>
          </article>
        ))}
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
  return (
    <main className="page ne-page">
      <header className="ne-titlebar">
        <div>
          <span className="ne-status">Borrador de definición · PRM-1297</span>
          <h1>Normalización de estados</h1>
          <p>Lenguaje único para medir la orden, operar excepciones y mostrar al cliente solo lo que necesita.</p>
        </div>
        <a href="https://dropi-it.atlassian.net/browse/PRM-1297" target="_blank" rel="noreferrer">Abrir PRM-1297 ↗</a>
      </header>

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

      {tab === "mapa" && <MapView />}
      {tab === "paises" && <CountriesView />}
      {tab === "carriers" && <CarriersView />}
      {tab === "ejemplos" && <ExamplesView />}
      {tab === "decisiones" && <DecisionsView />}
    </main>
  );
}
