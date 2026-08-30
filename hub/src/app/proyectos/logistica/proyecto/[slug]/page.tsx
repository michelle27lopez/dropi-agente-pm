import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import "@/app/proyectos/logistica/_styles/ficha.css";
import {
  proyectos,
  proyectoPorSlug,
  linksDe,
  experimentos,
  etapas,
  saludDe,
  motivoSalud,
  APORTA_GLOSA,
  type LinkRef,
  type Proyecto,
} from "@/app/proyectos/logistica/_lib/data";
import {
  Card,
  Pill,
  DataList,
  Disclosure,
  PageHeader,
  SectionTitle,
  type Dato,
  Recursos,} from "@/app/proyectos/logistica/_components/ui";

// NIVEL 3 de la escalera — la ficha lo tiene TODO, y es la única pantalla que
// puede permitírselo (ley: logistica-lab/metodologia/tablero-diseno.md §6).
//
// Qué estaba roto y cómo se arregla:
//
// 1. LA SOPA DE METADATOS. La cabecera decía "Proyecto · Definición ·
//    [Pendiente] · Generación · spec parcial": cinco ejes distintos en una
//    fila, sin etiquetas, con un solo color repartido al azar. Ahora cada dato
//    lleva su nombre encima (DataList) y el color solo aparece donde significa
//    algo.
//
// 2. NO DECÍA PARA QUÉ SIRVE, NI QUIÉN LO LLEVA, NI QUÉ SIGUE. Las tres
//    preguntas con las que alguien abre una ficha no tenían respuesta en
//    ninguna parte. Ahora son el primer bloque, antes que cualquier otra cosa.
//
// 3. BLOQUES IDÉNTICOS CON IMPORTANCIA DISTINTA. "Estado en Jira" y "Foco" se
//    veían iguales. El foco —hasta 790 caracteres de trazabilidad— era lo
//    tercero que se leía. Ahora baja a un plegable: no se pierde, deja de
//    estorbar.
//
// 4. SIETE PASTILLAS NARANJAS IGUALES en Enlaces. El naranja es el acento de
//    marca y va en un elemento por vista, no en siete. Ahora los enlaces se
//    agrupan por tipo y son texto.

export function generateStaticParams() {
  return proyectos.map((p) => ({ slug: p.slug }));
}

const DOC_LABEL: Record<string, string> = {
  completo: "Spec completo",
  parcial: "Spec parcial",
  ninguno: "Sin documentar",
};


export default async function ProyectoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = proyectoPorSlug(slug);
  if (!p) notFound();
  if (p.entregable) redirect(p.entregable);

  const exps = experimentos.filter((e) => e.proyectoSlug === p.slug || p.experimentos?.includes(e.slug));
  const relacionadas = p.etapasRelacionadas ?? [];
  const esTransversal = new Set(relacionadas.map((r) => r.etapa)).size > 1;
  const salud = saludDe(p);
  const links = linksDe(p);

  return (
    <main className="page">
      <PageHeader
        title={p.nombre}
        subtitle={p.descripcion}
        back={{ href: "/proyectos/logistica/iniciativas", label: "Registro de iniciativas" }}
        aside={p.codigo ? <Pill code>{p.codigo}</Pill> : <Pill tone="warn">sin registrar en Darwin</Pill>}
      />

      <div className="ficha__layout">
        <div className="ficha__main">
      {/* ── Lo esencial: las tres preguntas con las que se abre una ficha ─── */}
      <Card tone={salud}>
        <DataList
          items={[
            {
              label: "Aporta a",
              value:
                p.aportaA === "Sin definir" ? (
                  <span className="ficha__pendiente" title={APORTA_GLOSA[p.aportaA]}>
                    Sin definir
                  </span>
                ) : (
                  <span title={APORTA_GLOSA[p.aportaA]}>{p.aportaA}</span>
                ),
              hint: "Si mueve movilización o devolución",
            },
            { label: "Responsable", value: p.owner },
            { label: "Próximo paso", value: p.proximoPaso },
            {
              label: "Salud",
              value: (
                <span className="ficha__salud">
                  <span className="u-salud" data-salud={salud} />
                  {salud === "risk" ? "Bloqueado" : salud === "warn" ? "Información incompleta" : "En avance"}
                </span>
              ),
              hint: motivoSalud(p),
            },
          ]}
        />
        {p.porQue && <p className="ficha__porque">{p.porQue}</p>}
      </Card>

      {/* El bloqueo va inmediatamente después, y solo si existe. No lleva
          mayúsculas ni emoji: el rojo ya dice que es urgente, gritarlo encima
          es redundante y hace que todo lo demás parezca menos importante. */}
      {p.bloqueo && (
        <>
          <SectionTitle>Bloqueo</SectionTitle>
          <Card tone="risk">
            <p className="u-prose">{p.bloqueo}</p>
          </Card>
        </>
      )}

      {p.vista && (
        <p className="ficha__vista">
          <Link href={p.vista} className="u-link">
            Abrir la pantalla de {p.nombre} →
          </Link>
        </p>
      )}

      {/* El estado literal de Jira: cuando no coincide con nuestra lectura, esa
          diferencia ES el hallazgo — para eso existe el campo. */}
      {p.jira && (
        <>
          <SectionTitle hint="Tal como está hoy en el ticket. Si no coincide con la fase de arriba, esa diferencia es el hallazgo.">
            Estado en Jira
          </SectionTitle>
          <Card>
            <p className="u-prose">{p.jira}</p>
          </Card>
        </>
      )}

      {/* ── Cobertura en la cadena ────────────────────────────────────────── */}
      {relacionadas.length > 0 && (
        <>
          <SectionTitle hint={esTransversal ? "Este proyecto toca varias etapas de la orden." : undefined}>
            {esTransversal ? "Cobertura en la cadena de valor" : "Etapa de la orden"}
          </SectionTitle>
          <Card>
            {esTransversal && <CadenaValor proyecto={p} />}
            <DataList
              columns={1}
              items={relacionadas.map((r) => ({ label: r.etapa, value: r.rol }))}
            />
          </Card>
        </>
      )}

      {/* ── Experimentos ──────────────────────────────────────────────────── */}
      <SectionTitle>Experimentos</SectionTitle>
      <Card>
        {exps.length > 0 ? (
          <ul className="ficha__exps">
            {exps.map((e) => (
              <li key={e.slug}>
                <Pill tone={e.estado === "Validado" ? "ok" : e.estado === "Corriendo" ? "warn" : "info"}>
                  {e.estado}
                </Pill>
                <span>{e.nombre}</span>
                {e.demoHref && (
                  <Link href={e.demoHref} className="u-link">
                    probar →
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="u-prose" style={{ color: "var(--muted)" }}>
            Todavía no hay experimentos asociados. Se gestionan en{" "}
            <Link href="/proyectos/logistica/experimentos" className="u-link">
              Experimentos
            </Link>
            .
          </p>
        )}
      </Card>

      {/* ── Enlaces, agrupados ────────────────────────────────────────────── */}
      <SectionTitle hint="Lo que existe de esta iniciativa. Lo que falta se dibuja igual: que no exista es el dato.">
        Recursos
      </SectionTitle>
      <Card>
        {links.length > 0 ? (
          <Recursos links={links} />
        ) : (
          <p className="u-prose" style={{ color: "var(--muted)" }}>
            Sin ticket ni enlaces todavía — esta iniciativa vive solo en discovery.
          </p>
        )}
      </Card>

      {/* ── El contexto largo, disponible pero fuera del camino ───────────── */}
      <Disclosure summary="Contexto, antecedentes y trazabilidad">
        {p.foco}
      </Disclosure>
        </div>

        {/* ── Rail: la clasificación, siempre visible, nunca primero ─────────
            Va al lado y no arriba a propósito. Subirla sería volver al problema
            original de esta pantalla: metadatos antes que significado. Tipo,
            Fase y Handoff no responden ninguna pregunta, solo etiquetan — pero
            se consultan a cada rato, así que tampoco pueden estar enterradas.
            El rail resuelve las dos cosas: presentes siempre, primeras nunca.
            Es el mismo patrón de GitHub, Linear y Jira en sus vistas de
            detalle, y no por moda: es la única posición que no obliga a elegir
            entre visibilidad y jerarquía. */}
        <aside className="ficha__rail">
          <Card>
            <span className="ficha__rail-titulo">Clasificación</span>
            <DataList
              columns={1}
              items={
                [
                  { label: "Tipo", value: p.tipo, hint: "Qué es" },
                  { label: "Fase", value: p.fase, hint: "Dónde va dentro de su ciclo" },
                  {
                    label: "Handoff",
                    value: <Pill tone={handoffTono(p)}>{p.handoff}</Pill>,
                    hint: "¿TI ya puede tomarlo?",
                  },
                  {
                    label: "Etapa de la orden",
                    value: esTransversal ? "Transversal a la cadena" : p.etapa,
                  },
                  { label: "Ticket", value: p.ticket, hint: "El ticket paraguas en Jira" },
                  {
                    label: "Documentación",
                    value:
                      (p.doc ?? "ninguno") === "ninguno" ? (
                        <span className="ficha__pendiente">Sin documentar</span>
                      ) : (
                        DOC_LABEL[p.doc ?? "ninguno"]
                      ),
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

function handoffTono(p: Proyecto) {
  if (p.handoff === "Handoff hecho") return "ok" as const;
  if (p.handoff === "Listo para handoff") return "info" as const;
  if (p.handoff === "Pendiente") return "warn" as const;
  return "neutral" as const;
}

/** Las 6 etapas con las que toca este proyecto resaltadas. Solo si es transversal. */
function CadenaValor({ proyecto }: { proyecto: Proyecto }) {
  const relacionadas = new Set((proyecto.etapasRelacionadas ?? []).map((r) => r.etapa));
  return (
    <div className="ficha__cadena">
      {etapas.map((e) => {
        const principal =
          e.nombre === proyecto.etapa ||
          proyecto.etapa.startsWith(e.nombre) ||
          e.nombre.startsWith(proyecto.etapa);
        const estado = principal ? "principal" : relacionadas.has(e.nombre) ? "toca" : "no";
        return (
          <span key={e.n} className="ficha__cadena-paso" data-estado={estado}>
            {e.nombre}
          </span>
        );
      })}
    </div>
  );
}

