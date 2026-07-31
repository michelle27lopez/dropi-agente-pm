"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { etapas, proyectoPorSlug } from "@/app/proyectos/logistica/_lib/data";
import {
  crudosDe,
  decisiones,
  envios,
  estadoDelPaso,
  flechasOperacion,
  flechasUsuario,
  hallazgos,
  operacion,
  operacionDe,
  operacionPorId,
  usuario,
  usuarioPorId,
  vueltas,
  type Envio,
  type Vista,
} from "@/app/proyectos/logistica/_lib/normalizacion-estados-data";

/**
 * UNA PANTALLA, UN INTERRUPTOR.
 *
 * El problema · el mapa · qué se decide hoy. El mapa tiene dos niveles del MISMO vocabulario:
 * Operación (24, el entregable) y Usuario (9, el resumen para el cliente). Nunca los dos a la vez.
 * Al abrir un estado se ve la cadena completa: qué crudos caen ahí y qué ve el usuario.
 *
 * Diseño homologado contra DESIGN.md: cuatro tamaños de texto, tres radios, naranja Dropi más los
 * cuatro colores de estado. Sin bordes de color a la izquierda, sin numeración de secciones.
 */

/** Dos audiencias, no tres: quien vende y quien opera. El cliente final no se modela. */
const NIVELES: { id: Vista; label: string; cuantos: number; para: string }[] = [
  { id: "operacion", label: "Admin Dropi", cuantos: operacion.length, para: "Con estos se opera y se mide cuánto tarda cada tramo." },
  { id: "usuario", label: "Dropshipper y proveedor", cuantos: usuario.length, para: "Es lo que ve quien vende: sus propias acciones y el resultado del envío." },
];

function Mapa({ envio, onQuitar }: { envio: Envio | null; onQuitar: () => void }) {
  const [nivel, setNivel] = useState<Vista>("operacion");
  const [abierto, setAbierto] = useState<string | null>(null);

  const esOperacion = nivel === "operacion";
  const nodos = esOperacion ? operacion : usuario;
  const flechas = esOperacion ? flechasOperacion : flechasUsuario;
  const nivelActual = NIVELES.find((n) => n.id === nivel)!;

  // En qué pasos del envío aparece cada estado, ya traducido al nivel que se mira.
  const pasosPorEstado = useMemo(() => {
    const m = new Map<string, number[]>();
    if (!envio) return m;
    envio.steps.forEach((paso, i) => {
      const id = estadoDelPaso(paso, nivel);
      if (id) m.set(id, [...(m.get(id) ?? []), i + 1]);
    });
    return m;
  }, [envio, nivel]);

  const sinHomologar = envio?.steps.filter((s) => !s.estado) ?? [];

  const cambiarNivel = (id: Vista) => {
    setNivel(id);
    setAbierto(null); // los ids no se comparten entre niveles
  };

  return (
    <section className="ne-bloque">
      <div className="ne-bloque-head">
        <div>
          <h2>El mapa de estados</h2>
          <p>{nivelActual.para} Toca cualquiera para ver qué llega de la operación y qué ve el usuario en ese momento.</p>
        </div>
        <div className="ne-interruptor" role="group" aria-label="Nivel del mapa">
          {NIVELES.map((n) => (
            <button
              key={n.id}
              type="button"
              className={nivel === n.id ? "is-activo" : ""}
              aria-pressed={nivel === n.id}
              onClick={() => cambiarNivel(n.id)}
            >
              {n.label} <i>{n.cuantos}</i>
            </button>
          ))}
        </div>
      </div>

      {envio && (
        <div className="ne-recorrido-activo">
          <p>
            Viendo <b>{envio.id}</b> · {envio.carrier} · {envio.steps.length} pasos
            {sinHomologar.length > 0 && ` · ${sinHomologar.length} sin estado: ${sinHomologar.map((s) => s.raw).join(", ")}`}
          </p>
          <button type="button" onClick={onQuitar}>Quitar</button>
        </div>
      )}

      <div className="ne-mapa-scroll">
        <div className={`ne-mapa es-${nivel}`}>
          <svg viewBox={esOperacion ? "0 0 1530 600" : "0 0 1360 380"} role="img" aria-label={`Mapa de estados para ${nivelActual.label}`}>
            <defs>
              {(["info", "exito", "alerta", "critico", "neutral"] as const).map((t) => (
                <marker key={t} id={`punta-${t}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
                  <path d="M0 0 L10 5 L0 10 z" className={`punta-${t}`} />
                </marker>
              ))}
            </defs>
            {flechas.map((f) => (
              <path key={f.id} d={f.path} className={`ne-flecha tono-${f.tone}${envio ? " is-apagada" : ""}`} markerEnd={`url(#punta-${f.tone})`} />
            ))}
          </svg>

          {nodos.map((e) => {
            const pasos = pasosPorEstado.get(e.id) ?? [];
            const apagado = envio ? pasos.length === 0 : false;
            const cuantos = esOperacion
              ? (e as typeof operacion[number]).crudos.length
              : crudosDe(e.id).length;
            return (
              <button
                key={e.id}
                type="button"
                className={`ne-estado tono-${e.tone}${apagado ? " is-apagado" : ""}${abierto === e.id ? " is-abierto" : ""}`}
                style={{ left: e.x, top: e.y }}
                onClick={() => setAbierto(abierto === e.id ? null : e.id)}
                aria-expanded={abierto === e.id}
              >
                <strong>{e.nombre}</strong>
                <small>{cuantos === 0 ? "sin datos todavía" : `${cuantos} ${cuantos === 1 ? "estado" : "estados"}`}</small>
                {pasos.length > 0 && <span className="ne-estado-pasos">{pasos.join("·")}</span>}
              </button>
            );
          })}
        </div>
      </div>

      {abierto && <Detalle nivel={nivel} id={abierto} onCerrar={() => setAbierto(null)} />}
    </section>
  );
}

function Detalle({ nivel, id, onCerrar }: { nivel: Vista; id: string; onCerrar: () => void }) {
  const esOperacion = nivel === "operacion";
  const nodo = esOperacion ? operacionPorId.get(id) : usuarioPorId.get(id);
  if (!nodo) return null;

  const crudos = esOperacion ? operacionPorId.get(id)!.crudos : crudosDe(id);
  const veElUsuario = esOperacion ? operacionPorId.get(id)!.usuario : null;
  const agrupa = esOperacion ? [] : operacionDe(id);

  return (
    <div className="ne-detalle">
      <div className="ne-detalle-cab">
        <h3>{nodo.nombre}</h3>
        <button type="button" onClick={onCerrar}>Cerrar</button>
      </div>
      <p>{nodo.queSignifica}</p>

      <dl className="ne-detalle-meta">
        {esOperacion && <div><dt>Quién lo genera</dt><dd>{operacionPorId.get(id)!.quienLoGenera}</dd></div>}
        {esOperacion && (
          <div>
            <dt>El usuario ve</dt>
            <dd>{veElUsuario ? usuarioPorId.get(veElUsuario)?.nombre : "nada — no le cambia el estado"}</dd>
          </div>
        )}
      </dl>

      {agrupa.length > 0 && (
        <>
          <p className="ne-detalle-label">Estados de operación que agrupa</p>
          <ul className="ne-chips">
            {agrupa.map((o) => <li key={o.id} className="es-operacion">{o.nombre}</li>)}
          </ul>
        </>
      )}

      <p className="ne-detalle-label">Lo que llega de la operación y cae acá</p>
      {crudos.length > 0 ? (
        <ul className="ne-chips">
          {crudos.map((c) => <li key={c}>{c}</li>)}
        </ul>
      ) : (
        <p className="ne-sin-datos">
          Ninguno todavía. Este estado existe porque el proceso lo necesita, pero hoy no llega ningún
          dato que lo alimente: hay que derivarlo por regla o pedírselo a la transportadora.
        </p>
      )}
    </div>
  );
}

function Envios({ onVerEnMapa }: { onVerEnMapa: (envio: Envio) => void }) {
  return (
    <details className="ne-plegable">
      <summary>Ver 14 envíos reales, paso a paso</summary>
      <div className="ne-plegable-body">
        <p className="ne-nota">
          Son envíos del camino difícil, no una muestra representativa: 11 de 14 terminaron devueltos,
          cuando la devolución es cerca del 8% del volumen. Sirven para ver dónde se rompe el
          vocabulario, no para dimensionar.
        </p>

        <div className="ne-hallazgos">
          {hallazgos.map((h) => (
            <div key={h.titulo} className={`ne-hallazgo tono-${h.tone}`}>
              <strong>{h.titulo}</strong>
              <p>{h.detalle}</p>
            </div>
          ))}
        </div>

        <div className="ne-envios">
          {envios.map((envio) => {
            const ciclos = vueltas(envio.steps, "operacion");
            return (
              <article className="ne-envio" key={envio.id}>
                <header>
                  <div>
                    <span>{envio.carrier}</span>
                    <strong>{envio.id}</strong>
                  </div>
                  <span className={`ne-desenlace ${envio.outcome === "Entregado" ? "es-exito" : "es-devolucion"}`}>{envio.outcome}</span>
                </header>
                <p className="ne-envio-nota">{envio.highlight}</p>
                <ol className="ne-pasos">
                  <li className="es-cabecera"><span>Lo que llegó</span><span>Estado</span><span>El usuario ve</span></li>
                  {envio.steps.map((paso, i) => {
                    const op = paso.estado ? operacionPorId.get(paso.estado) : undefined;
                    const usu = op?.usuario ? usuarioPorId.get(op.usuario) : undefined;
                    const ciclo = ciclos[i];
                    // El estado del usuario solo se escribe cuando CAMBIA: repetirlo esconde
                    // cuántos pasos de la operación colapsan en uno solo para él.
                    const prev = envio.steps[i - 1];
                    const usuPrev = prev?.estado ? operacionPorId.get(prev.estado)?.usuario : undefined;
                    const cambia = op?.usuario !== usuPrev;
                    return (
                      <li key={`${paso.raw}-${i}`} className={op ? `tono-${op.tone}` : "es-huerfano"}>
                        <span className="ne-paso-raw">
                          {paso.raw}
                          {ciclo && <b title="Vuelve a un estado por el que ya había pasado">vuelta {ciclo}</b>}
                        </span>
                        <span className="ne-paso-op">{op ? op.nombre : <em>sin estado</em>}</span>
                        <span className="ne-paso-usu">
                          {usu && cambia ? usu.nombre : <i aria-hidden="true">·</i>}
                        </span>
                      </li>
                    );
                  })}
                </ol>
                <button type="button" className="ne-ver-mapa" onClick={() => onVerEnMapa(envio)}>Ver sobre el mapa</button>
              </article>
            );
          })}
        </div>
      </div>
    </details>
  );
}

export default function NormalizacionEstadosView() {
  const [envioActivo, setEnvioActivo] = useState<Envio | null>(null);
  const proyecto = proyectoPorSlug("normalizacion-estados");
  const idxEtapa = proyecto
    ? etapas.findIndex((e) => proyecto.etapa.startsWith(e.nombre) || e.nombre.startsWith(proyecto.etapa))
    : -1;

  const hoy = decisiones.filter((d) => d.cuando === "hoy");
  const despues = decisiones.filter((d) => d.cuando === "despues");

  const verEnMapa = (envio: Envio) => {
    setEnvioActivo(envio);
    document.querySelector(".ne-mapa-scroll")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <main className="page ne-page">
      <Link href="/celula/logistica" className="back">← Célula Logística</Link>

      <header className="ne-cabecera">
        <div>
          <div className="ne-tags">
            <span className="ne-tag">PRM-1297</span>
            <span className="ne-tag">Borrador de definición</span>
            {idxEtapa >= 0 && <span className="ne-tag es-etapa">{etapas[idxEtapa].nombre}</span>}
          </div>
          <h1>Normalización de estados</h1>
          <p>Un solo lenguaje para saber dónde está cada orden y poder contárselo al cliente.</p>
        </div>
        <a href="https://dropi-it.atlassian.net/browse/PRM-1297" target="_blank" rel="noreferrer">Abrir en Jira</a>
      </header>

      <section className="ne-bloque">
        <div className="ne-bloque-head">
          <div>
            <h2>Hoy casi todo el viaje del paquete cabe en una sola palabra</h2>
          </div>
        </div>
        <p className="ne-problema">
          Entre marzo y julio se registraron 51 estados distintos para las órdenes en Colombia.
          <b> 35 de ellos se guardan bajo una sola etiqueta.</b> Da igual si el paquete está en una
          bodega, viajando entre ciudades, en la moto del repartidor o esperando al cliente en un
          punto físico: por dentro queda registrado igual.
        </p>
        <p className="ne-fuente">
          Medido sobre los estados de orden de Colombia, 19 de marzo a 22 de julio de 2026. Una vez
          generada la guía, más de 8 de cada 10 registros caen en esa única etiqueta.
        </p>
        <div className="ne-consecuencias">
          <div>
            <strong>No sabemos dónde se traba una orden</strong>
            <p>Si todo el transporte es un solo estado, no se puede medir qué tramo se demora.</p>
          </div>
          <div>
            <strong>No le podemos contar nada al cliente</strong>
            <p>No hay forma de distinguir que va en camino de que llega hoy, ni de avisarle que su paquete lo espera en un punto.</p>
          </div>
        </div>
      </section>

      <Mapa envio={envioActivo} onQuitar={() => setEnvioActivo(null)} />

      <section className="ne-bloque">
        <div className="ne-bloque-head">
          <div>
            <h2>Qué necesitamos decidir hoy</h2>
            <p>Solo estas dos. El resto queda anotado y se cierra después.</p>
          </div>
        </div>
        <div className="ne-decisiones">
          {hoy.map((d) => (
            <article key={d.titulo} className="ne-decision">
              <h3>{d.titulo}</h3>
              <p>{d.pregunta}</p>
              <div className="ne-propuesta">
                <span>Propuesta</span>
                <p>{d.propuesta}</p>
              </div>
            </article>
          ))}
        </div>

        <details className="ne-plegable es-compacto">
          <summary>Y {despues.length} cosas más que quedan abiertas</summary>
          <div className="ne-plegable-body">
            <ul className="ne-despues">
              {despues.map((d) => (
                <li key={d.titulo}>
                  <strong>{d.titulo}</strong>
                  <span>{d.pregunta} {d.propuesta}</span>
                </li>
              ))}
            </ul>
          </div>
        </details>
      </section>

      <Envios onVerEnMapa={verEnMapa} />

      <details className="ne-plegable">
        <summary>Ver el macroproceso original, como referencia</summary>
        <div className="ne-plegable-body">
          <img src="/logistica/normalizacion-estados/macro-proceso-original.png" alt="Macroproceso original con las siete fases" />
        </div>
      </details>
    </main>
  );
}
