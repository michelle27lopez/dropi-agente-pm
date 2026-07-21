import Link from "next/link";
import { notFound } from "next/navigation";
import { proyectos, proyectoPorSlug, jiraUrl, experimentos } from "@/app/proyectos/logistica/_lib/data";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

// Ficha de un proyecto.
export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = proyectoPorSlug(slug);
  if (!p) notFound();

  const url = jiraUrl(p.ticket);
  // Experimentos que mencionan este proyecto.
  const exps = experimentos.filter((e) =>
    e.proyecto.toLowerCase().includes(p.nombre.split(":")[0].toLowerCase().slice(0, 10))
  );

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

        <div className="detail-links">
          {url && (
            <a href={url} target="_blank" rel="noopener noreferrer" className="btn-link">
              Ver en Jira · {p.ticket} ↗
            </a>
          )}
        </div>

        {exps.length > 0 && (
          <div className="detail-exps">
            <b>Experimentos relacionados</b>
            <ul>
              {exps.map((e) => (
                <li key={e.nombre}>
                  <span className={`estado e-${e.estado}`}>{e.estado}</span> {e.nombre}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
