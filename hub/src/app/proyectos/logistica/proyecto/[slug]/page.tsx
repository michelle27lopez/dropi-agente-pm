import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  proyectos, proyectoPorSlug, linksDe, experimentos, etapas,
} from "@/app/proyectos/logistica/_lib/data";
import LinkList from "@/app/proyectos/logistica/_components/LinkList";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

// Ficha de una iniciativa: qué es, dónde va, si TI puede tomarla, qué la
// bloquea, dónde cae en la cadena de valor, y TODO lo que existe de ella
// enlazado en un solo lugar.
//
// Cuando falta información se dice explícitamente en vez de dejar el hueco: un
// empty state que enseña qué falta, no un vacío mudo. Antes la ficha mostraba
// solo título + descripción + foco, así que los proyectos sin ticket ni
// experimentos (ej. torre-control) quedaban como una tarjeta suelta en una
// pantalla vacía.
export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = proyectoPorSlug(slug);
  if (!p) notFound();

  // Si el proyecto tiene entregable propio, esa ES su página. La ficha genérica
  // existía en paralelo y partía el proyecto en dos URLs que no se conocían.
  if (p.entregable) redirect(p.entregable);

  // Antes esto se adivinaba comparando substrings del nombre — bastaba con
  // renombrar un proyecto para que se perdieran sus experimentos. Ahora la
  // relación es explícita en los datos y se cruza por slug en los dos sentidos.
  const exps = experimentos.filter(
    (e) => e.proyectoSlug === p.slug || p.experimentos?.includes(e.slug)
  );
  // Posición en la cadena de valor de la orden (mismo eje que /mapa).
  const idxEtapa = etapas.findIndex((e) => p.etapa.startsWith(e.nombre) || e.nombre.startsWith(p.etapa));

  return (
    <main className="page">
      <Link href="/proyectos/logistica/iniciativas" className="back">
        ← Registro de iniciativas
      </Link>

      <div className="detail">
        <div className="detail-row">
          <span className={`badge b-tipo t-${p.tipo}`}>{p.tipo}</span>
          <span className="badge b-phase">{p.fase}</span>
          <span className={`badge b-handoff h-${p.handoff.replace(/\s/g, "-")}`}>{p.handoff}</span>
          <span className="badge b-code">{p.etapa}</span>
          {p.codigo ? (
            <span className="badge b-code">{p.codigo}</span>
          ) : (
            <span className="badge b-warn">sin registrar en Darwin</span>
          )}
          {p.destacado && <span className="badge b-code">⭐ En foco</span>}
        </div>
        <h1>{p.nombre}</h1>
        <p className="lead">{p.descripcion}</p>

        {p.bloqueo && (
          <div className="detail-bloqueo">
            <b>⛔ Qué lo detiene</b>
            {p.bloqueo}
          </div>
        )}

        {p.jira && (
          <div className="detail-field">
            <b>Estado en Jira</b>
            {p.jira}
          </div>
        )}

        <div className="detail-field">
          <b>Foco</b>
          {p.foco}
        </div>

        {/* Dónde vive este proyecto dentro de la cadena de valor de la orden. */}
        {idxEtapa >= 0 && (
          <div className="detail-field">
            <b>Etapa de la orden</b>
            <div className="fx-chain">
              {etapas.map((e, i) => (
                <span key={e.n} className={`fx-chain-step${i === idxEtapa ? " is-current" : ""}`}>
                  {e.nombre}
                </span>
              ))}
            </div>
            <small>{etapas[idxEtapa].sub}</small>
          </div>
        )}

        <LinkList links={linksDe(p)} titulo="Enlaces" />
        {linksDe(p).length === 0 && (
          <p className="detail-hint">
            Sin ticket ni enlaces todavía — esta iniciativa vive solo en discovery.
          </p>
        )}

        <div className="detail-exps">
          <b>Experimentos</b>
          {exps.length > 0 ? (
            <ul>
              {exps.map((e) => (
                <li key={e.slug}>
                  <span className={`estado e-${e.estado}`}>{e.estado}</span> {e.nombre}
                  {e.demoHref && (
                    <>
                      {" · "}
                      <Link href={e.demoHref}>probar →</Link>
                    </>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="detail-hint">
              Aún no hay experimentos asociados. Los experimentos de la célula se
              gestionan en <Link href="/proyectos/logistica/experimentos">Experimentos</Link>.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
