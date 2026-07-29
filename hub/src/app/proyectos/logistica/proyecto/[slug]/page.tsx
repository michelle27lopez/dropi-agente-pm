import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  proyectos, proyectoPorSlug, linksDe, experimentos, etapas,
} from "@/app/proyectos/logistica/_lib/data";
import LinkList from "@/app/proyectos/logistica/_components/LinkList";

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

// Mismas etiquetas que usa el registro en /iniciativas, para que un proyecto no
// se describa de dos maneras distintas según por dónde se mire.
const DOC_LABEL: Record<string, string> = {
  completo: "spec completo",
  parcial: "spec parcial",
  ninguno: "sin documentar",
};

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

  const relatedSet = new Set(
    (p.etapasRelacionadas ?? []).map((r) => r.etapa)
  );
  // Dos cosas distintas que antes se decidían con la misma condición: el badge
  // "Transversal" solo tiene sentido con más de una etapa, pero el detalle de
  // rol por etapa hay que pintarlo aunque sea una sola — si no, ese dato se
  // perdía en silencio al caer en la rama de etapa única.
  const isTransversal = relatedSet.size > 1;
  const tieneRelacionadas = relatedSet.size > 0;

  return (
    <main className="page">
      <Link href="/proyectos/logistica/iniciativas" className="back">
        ← Registro de iniciativas
      </Link>

      <div className="detail">
        {/* El título abre la ficha. Antes venían seis pastillas de colores
            primero y había que leerlas todas para saber qué proyecto era. */}
        {p.codigo && <span className="detail-codigo">{p.codigo}</span>}
        <h1>{p.nombre}</h1>
        <p className="lead">{p.descripcion}</p>

        {/* Los metadatos son texto, no pastillas: son categorías (qué es, en qué
            fase va, qué etapa ataca) y el color no debe usarse para eso. Solo se
            destacan con .tag las dos cosas que piden acción. */}
        <div className="detail-meta">
          <strong>{p.tipo}</strong>
          <span className="sep">·</span>
          {/* `fase` y `handoff` son ejes distintos, pero colapsan al mismo valor
              en fulfillment y tarifas — se decía dos veces seguidas. */}
          {p.fase !== p.handoff && (
            <>
              <span>{p.fase}</span>
              <span className="sep">·</span>
            </>
          )}
          {/* Mismo trato que en el registro: handoff son los cuatro estados, así
              que lleva color; el resto de la línea es texto. */}
          <span className={`pill h-${p.handoff.replace(/\s/g, "-")}`}>{p.handoff}</span>
          <span className="sep">·</span>
          <span>{isTransversal ? "transversal a la cadena" : p.etapa}</span>

          {p.destacado && (
            <>
              <span className="sep">·</span>
              <span>⭐ en foco</span>
            </>
          )}

          {!p.codigo && <span className="pill is-warn">sin registrar en Darwin</span>}
          {(p.doc ?? "ninguno") === "ninguno" ? (
            <span className="pill is-risk">sin documentar</span>
          ) : (
            <span>{DOC_LABEL[p.doc ?? "ninguno"]}</span>
          )}
        </div>

        {/* Same Day tiene página propia y estaba en el sidebar, pero su ficha no
            sabía que existía: no había ni link ni `entregable`. Ahora cualquier
            iniciativa con `vista` la ofrece desde arriba. */}
        {p.vista && (
          <p className="detail-hint" style={{ marginBottom: 14 }}>
            <Link href={p.vista}>Abrir la pantalla de {p.nombre} →</Link>
          </p>
        )}

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

        {/* La cadena de las 6 etapas SOLO se pinta cuando el proyecto es
            transversal: ahí la cobertura es el dato. Para una iniciativa de una
            sola etapa era caro y redundante — la etapa ya está en la línea de
            metadatos de arriba y en el sidebar. */}
        {isTransversal && (
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
        )}

        {/* Una sola etapa relacionada: el rol se perdía en silencio al no ser
            "transversal". Se dice en una línea, sin la cadena. */}
        {!isTransversal && tieneRelacionadas && (
          <div className="detail-field">
            <b>Etapa de la orden</b>
            {p.etapasRelacionadas!.map((r) => (
              <span key={r.etapa}>
                <strong>{r.etapa}</strong> — {r.rol}
              </span>
            ))}
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
