import Link from "next/link";
import { notFound } from "next/navigation";
import {
  proyectos, proyectoPorSlug, jiraUrl, experimentos, etapas,
} from "@/app/proyectos/logistica/_lib/data";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

// Ficha de un proyecto.
//
// Antes mostraba solo título + descripción + foco, así que los proyectos sin
// ticket ni experimentos (ej. torre-control) quedaban como una tarjeta suelta en
// una pantalla vacía. Ahora la ficha sitúa el proyecto en la cadena de valor y,
// cuando falta información, lo dice explícitamente en vez de dejar el hueco:
// un empty state que enseña qué falta, no un vacío mudo.
export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = proyectoPorSlug(slug);
  if (!p) notFound();

  const url = jiraUrl(p.ticket);
  const exps = experimentos.filter((e) =>
    e.proyecto.toLowerCase().includes(p.nombre.split(":")[0].toLowerCase().slice(0, 10))
  );
  // Posición en la cadena de valor de la orden (mismo eje que /mapa).
  const idxEtapa = etapas.findIndex((e) => p.etapa.startsWith(e.nombre) || e.nombre.startsWith(p.etapa));

  return (
    <main className="page">
      <Link href="/proyectos/logistica/mapa" className="back">
        ← Mapa de la orden
      </Link>

      <div className="detail">
        <div className="detail-row">
          <span className={`badge b-phase-${p.fase}`}>{p.fase}</span>
          <span className="badge b-code">{p.etapa}</span>
          {p.destacado && <span className="badge b-code">⭐ En foco</span>}
        </div>
        <h1>{p.nombre}</h1>
        <p className="lead">{p.descripcion}</p>

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

        <div className="detail-links">
          {url ? (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-link">
              Ver en Jira · {p.ticket} ↗
            </a>
          ) : (
            <span className="detail-hint">
              Sin ticket de Jira todavía — este proyecto vive en discovery.
            </span>
          )}
        </div>

        <div className="detail-exps">
          <b>Experimentos</b>
          {exps.length > 0 ? (
            <ul>
              {exps.map((e) => (
                <li key={e.nombre}>
                  <span className={`estado e-${e.estado}`}>{e.estado}</span> {e.nombre}
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
