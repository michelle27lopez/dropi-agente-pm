import Link from "next/link";
import { notFound } from "next/navigation";
import "@/app/proyectos/logistica/_styles/experimentos.css";
import {
  experimentos,
  experimentoPorSlug,
  proyectoPorSlug,
  aportaDeExperimento,
  estaDisenado,
  APORTA_GLOSA,
  LINK_ICONO,
  type EstadoExp,
  type AportaA,
} from "@/app/proyectos/logistica/_lib/data";
import {
  Card,
  Pill,
  DataList,
  PageHeader,
  SectionTitle,
  type Dato,
} from "@/app/proyectos/logistica/_components/ui";

// Ficha de un experimento — nivel 3 de la escalera, igual que la de proyecto.
//
// POR QUÉ PÁGINA Y NO MODAL
// El tablero se lee en Cell Board y se comparte por enlace. Un modal no tiene
// URL: "mándame el link del experimento de autoconfirmación" deja de existir.
// Además no se puede imprimir, se comporta mal en proyector, y mete un scroll
// dentro de otro scroll.
//
// OJO CON LAS RUTAS: /experimentos/autoconfirmacion y /experimentos/vigia ya
// existen como rutas ESTÁTICAS con sus pantallas propias (simulador y
// conceptualización). Next da precedencia a la estática sobre la dinámica, así
// que esas dos conservan su página rica y esta ficha cubre las otras seis. Por
// eso `generateStaticParams` las excluye: generarlas aquí sería trabajo muerto.

const CON_PANTALLA_PROPIA = ["autoconfirmacion", "vigia"];

export function generateStaticParams() {
  return experimentos
    .filter((e) => !CON_PANTALLA_PROPIA.includes(e.slug))
    .map((e) => ({ slug: e.slug }));
}

const TONO_ESTADO: Record<EstadoExp, "neutral" | "info" | "warn" | "ok" | "risk"> = {
  Idea: "neutral",
  Diseñado: "info",
  Corriendo: "warn",
  Validado: "ok",
  Descartado: "risk",
};

const QUE_SIGNIFICA: Record<EstadoExp, string> = {
  Idea: "Todavía no tiene diseño experimental.",
  Diseñado: "Listo para correr; falta arrancarlo.",
  Corriendo: "Se está ejecutando ahora mismo.",
  Validado: "Concluido: la hipótesis se sostuvo.",
  Descartado: "Concluido: la hipótesis no se sostuvo.",
};

function tonoAporta(a?: AportaA) {
  if (a === "Movilización" || a === "Devolución") return "risk" as const;
  if (a === "Habilitador") return "info" as const;
  return "neutral" as const;
}

export default async function ExperimentoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = experimentoPorSlug(slug);
  if (!e) notFound();

  const p = e.proyectoSlug ? proyectoPorSlug(e.proyectoSlug) : undefined;
  const ataca = aportaDeExperimento(e);
  const disenado = estaDisenado(e);

  return (
    <main className="page">
      <PageHeader
        title={e.nombre}
        back={{ href: "/proyectos/logistica/experimentos", label: "Experimentos" }}
        aside={<Pill tone={TONO_ESTADO[e.estado]}>{e.estado}</Pill>}
      />

      <div className="ficha__layout">
        <div className="ficha__main">
          {/* ── LA EVIDENCIA ABRE, NO LA HIPÓTESIS ──────────────────────────
              El formato Cell Board de la célula manda "mostrar la evidencia
              antes que las conclusiones", y una hipótesis es una conclusión con
              forma de frase: leerla sin saber el tamaño del problema no permite
              juzgar si vale la pena.

              Antes el impacto era el CUARTO bloque y además estaba dentro de un
              párrafo — "317K órdenes >24h" enterrado entre la usabilidad y el
              promedio. Ahora la cifra es un dato propio y encabeza la página. */}
          {/* El recorrido del indicador de izquierda a derecha: de dónde parte,
              a dónde se espera llegar, y dónde está de verdad. Juntos se leen
              como promesa y resultado; separados por media pantalla nadie los
              contrasta y el experimento nunca rinde cuentas. */}
          <Card tone={TONO_ESTADO[e.estado]}>
            <span className="exp-ficha__label">
              {e.impactoEsperado ? e.impactoEsperado.indicador : "Indicador"}
              {e.esDiscovery && <span className="exp-discovery">discovery</span>}
            </span>

            {e.impactoEsperado ? (
              <div className="exp-det__recorrido">
                <div>
                  <span className="exp-det__paso-label">Hoy</span>
                  {e.impactoEsperado.hoy ? (
                    <span className="exp-det__cifra">{e.impactoEsperado.hoy}</span>
                  ) : (
                    <span className="exp-det__paso-falta">Sin línea base</span>
                  )}
                </div>
                <span className="exp-det__flecha" aria-hidden>
                  →
                </span>
                <div>
                  <span className="exp-det__paso-label">Objetivo</span>
                  {e.impactoEsperado.objetivo ? (
                    <span className="exp-det__cifra">{e.impactoEsperado.objetivo}</span>
                  ) : (
                    <span className="exp-det__paso-falta">Sin definir</span>
                  )}
                </div>
                <span className="exp-det__flecha" aria-hidden>
                  →
                </span>
                <div>
                  <span className="exp-det__paso-label">Resultado</span>
                  {e.impactoReal ? (
                    <span className="exp-det__real">{e.impactoReal}</span>
                  ) : (
                    <span className="exp-det__paso-pendiente">Pendiente de medición</span>
                  )}
                </div>
              </div>
            ) : (
              <p className="exp-ficha__falta">
                Sin indicador declarado. Mientras no se nombre qué se espera mover, este experimento
                no es comparable con los demás al priorizar.
              </p>
            )}

            <p className="exp-det__contexto">{e.impacto}</p>
          </Card>

          <SectionTitle hint="Lo que el experimento pone a prueba. Debe poder salir falsa.">
            La hipótesis
          </SectionTitle>
          <Card>
            <p className="exp-det__hipotesis">{e.hipotesis}</p>
          </Card>

          <SectionTitle
            hint={
              disenado
                ? undefined
                : "Sin esta respuesta el experimento mide, pero no cambia ninguna decisión."
            }
          >
            Qué decide
          </SectionTitle>
          <Card tone={disenado ? "neutral" : "warn"}>
            {disenado ? (
              <p className="u-prose">{e.decide}</p>
            ) : (
              <p className="u-prose exp-ficha__falta">
                Sin definir. La métrica todavía está en “candidatas”, así que el estado{" "}
                <b>{e.estado}</b> afirma algo que la métrica no sostiene: falta elegir qué se mide y
                qué se hace con el resultado.
              </p>
            )}
          </Card>

          <SectionTitle>Cómo se mide</SectionTitle>
          <Card>
            <p className="u-prose">{e.metrica}</p>
          </Card>

          {e.aprendizaje && (
            <>
              <SectionTitle>Qué hemos aprendido</SectionTitle>
              <Card>
                <p className="u-prose">{e.aprendizaje}</p>
              </Card>
            </>
          )}

          {(e.links?.length || e.demoHref) && (
            <>
              <SectionTitle>Enlaces</SectionTitle>
              <Card>
                <div className="exp-ficha__pie" style={{ marginTop: 0, paddingTop: 0, borderTop: 0 }}>
                  {e.demoHref && (
                    <Link href={e.demoHref} className="exp-ficha__demo">
                      Probar el simulador →
                    </Link>
                  )}
                  {(e.links ?? []).map((l) =>
                    l.falta || !l.href ? (
                      <span key={l.label} className="exp-ficha__falta-link" title="Falta el enlace">
                        {l.label}
                      </span>
                    ) : l.href.startsWith("http") ? (
                      <a key={l.label} href={l.href} target="_blank" rel="noreferrer" className="u-link">
                        <span aria-hidden>{LINK_ICONO[l.tipo]}</span> {l.label} ↗
                      </a>
                    ) : (
                      <Link key={l.label} href={l.href} className="u-link">
                        <span aria-hidden>{LINK_ICONO[l.tipo]}</span> {l.label} →
                      </Link>
                    )
                  )}
                </div>
              </Card>
            </>
          )}
        </div>

        <aside className="ficha__rail">
          <Card>
            <span className="ficha__rail-titulo">Ficha</span>
            <DataList
              columns={1}
              items={
                [
                  {
                    label: "Estado",
                    value: <Pill tone={TONO_ESTADO[e.estado]}>{e.estado}</Pill>,
                    hint: QUE_SIGNIFICA[e.estado],
                  },
                  {
                    label: "AportaA",
                    value: ataca ? (
                      <Pill tone={tonoAporta(ataca)} title={APORTA_GLOSA[ataca]}>
                        {ataca}
                      </Pill>
                    ) : null,
                    hint: "Se hereda del proyecto al que cuelga",
                  },
                  {
                    label: "Proyecto",
                    value: p ? (
                      <Link href={`/proyectos/logistica/proyecto/${p.slug}`} className="u-link">
                        {p.nombre} →
                      </Link>
                    ) : (
                      e.proyecto
                    ),
                  },
                  {
                    label: "¿Está diseñado?",
                    value: disenado ? (
                      <Pill tone="ok">Sí</Pill>
                    ) : (
                      <Pill tone="warn">Falta qué decide</Pill>
                    ),
                    hint: "Un experimento que no decide nada no está diseñado",
                  },
                ] as Dato[]
              }
            />
          </Card>
        </aside>
      </div>
    </main>
  );
}
