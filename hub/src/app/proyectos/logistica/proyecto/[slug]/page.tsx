import Link from "next/link";
import { notFound } from "next/navigation";
import { proyectos, proyectoPorSlug, linksDe, experimentos } from "@/app/proyectos/logistica/_lib/data";
import LinkList from "@/app/proyectos/logistica/_components/LinkList";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

// Ficha de una iniciativa: qué es, dónde va, si TI puede tomarla, qué la
// bloquea, y TODO lo que existe de ella enlazado en un solo lugar.
export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = proyectoPorSlug(slug);
  if (!p) notFound();

  // Antes esto se adivinaba comparando substrings del nombre — bastaba con
  // renombrar un proyecto para que se perdieran sus experimentos. Ahora la
  // relación es explícita en los datos y se cruza por slug en los dos sentidos.
  const exps = experimentos.filter(
    (e) => e.proyectoSlug === p.slug || p.experimentos?.includes(e.slug)
  );

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

        <div className="detail-field">
          <b>Foco</b>
          {p.foco}
        </div>

        <LinkList links={linksDe(p)} titulo="Enlaces" />

        {exps.length > 0 && (
          <div className="detail-exps">
            <b>Experimentos relacionados</b>
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
          </div>
        )}
      </div>
    </main>
  );
}
