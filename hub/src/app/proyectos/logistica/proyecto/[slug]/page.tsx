import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  proyectos, proyectoPorSlug, linksDe, experimentos, etapas,
} from "@/app/proyectos/logistica/_lib/data";
import LinkList from "@/app/proyectos/logistica/_components/LinkList";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

export default async function ProyectoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = proyectoPorSlug(slug);
  if (!p) notFound();

  if (p.entregable) redirect(p.entregable);

  const exps = experimentos.filter(
    (e) => e.proyectoSlug === p.slug || p.experimentos?.includes(e.slug)
  );
  const idxEtapa = etapas.findIndex((e) => p.etapa.startsWith(e.nombre) || e.nombre.startsWith(p.etapa));

  const relatedSet = new Set(
    (p.etapasRelacionadas ?? []).map((r) => r.etapa)
  );
  const isTransversal = relatedSet.size > 1;

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
          {isTransversal ? (
            <span className="badge b-phase">Transversal</span>
          ) : (
            <span className="badge b-code">{p.etapa}</span>
          )}
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

        {/* Cadena de valor: etapa única o transversal con detalle por etapa */}
        {isTransversal ? (
          <div className="detail-field">
            <b>Cobertura en la cadena de valor</b>
            <div className="fx-chain">
              {etapas.map((e) => {
                const isRelated = relatedSet.has(e.nombre);
                const isPrimary = e.nombre === p.etapa || p.etapa.startsWith(e.nombre) || e.nombre.startsWith(p.etapa);
                return (
                  <span
                    key={e.n}
                    className={`fx-chain-step${isPrimary ? " is-current" : isRelated ? " is-related" : ""}`}
                  >
                    {e.nombre}
                  </span>
                );
              })}
            </div>
            <div className="vigia-etapas">
              {p.etapasRelacionadas!.map((r) => {
                const et = etapas.find((e) => e.nombre === r.etapa);
                return (
                  <div key={r.etapa} className="vigia-etapa-row">
                    <span className="vigia-etapa-name" style={{ borderLeftColor: et?.color ?? "#6366f1" }}>
                      {r.etapa}
                    </span>
                    <span className="vigia-etapa-role">{r.rol}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : idxEtapa >= 0 ? (
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
        ) : null}

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
