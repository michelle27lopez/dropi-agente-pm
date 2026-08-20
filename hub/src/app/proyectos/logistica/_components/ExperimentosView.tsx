import Link from "next/link";
import "@/app/proyectos/logistica/_styles/experimentos.css";
import {
  experimentos,
  proyectoPorSlug,
  aportaDeExperimento,
  estaDisenado,
  sePuedePriorizar,
  APORTA_GLOSA,
  type Experimento,
  type EstadoExp,
  type AportaA,
} from "@/app/proyectos/logistica/_lib/data";
import { Card, Pill, Table, PageHeader, SectionTitle, type Column } from "@/app/proyectos/logistica/_components/ui";

// EXPERIMENTOS — el índice. Responde: ¿qué probamos y qué decide cada apuesta?
//
// Esta pantalla NO lleva el detalle. Antes eran ocho tarjetas con cinco bloques
// de prosa cada una —cuarenta párrafos— y no se podía ver de un vistazo cuántas
// apuestas estaban corriendo ni qué iba a decidir ninguna. Ahora el detalle
// vive en /experimentos/[slug], igual que los proyectos en /proyecto/[slug]:
// una URL por experimento, compartible y enlazable desde el Cell Board.
//
// LA COLUMNA "QUÉ DECIDE" es la prueba de fuego del diseño experimental. Si no
// se puede escribir, el experimento mide algo pero nadie sabe qué se hará con
// el resultado — así que el resultado no cambia nada. La celda vacía es el
// hallazgo y por eso no se rellena.

// Rutas estáticas que ya existen con pantalla propia y ganan a la ficha genérica.
const PANTALLA_PROPIA: Record<string, string> = {
  autoconfirmacion: "simulador",
  vigia: "conceptualización",
};

// Orden de lectura: lo que pasa ahora, lo listo para pasar, el backlog, y al
// final lo concluido. Un backlog arriba engaña sobre cuánta apuesta viva hay.
const ORDEN: EstadoExp[] = ["Corriendo", "Diseñado", "Idea", "Validado", "Descartado"];

const TONO_ESTADO: Record<EstadoExp, "neutral" | "info" | "warn" | "ok" | "risk"> = {
  Idea: "neutral",
  Diseñado: "info",
  Corriendo: "warn",
  Validado: "ok",
  Descartado: "risk",
};

function tonoAporta(a?: AportaA) {
  if (a === "Movilización" || a === "Devolución") return "risk" as const;
  if (a === "Habilitador") return "info" as const;
  return "neutral" as const;
}

function href(e: Experimento) {
  return `/proyectos/logistica/experimentos/${e.slug}`;
}

export default function ExperimentosView() {
  const sinDisenar = experimentos.filter((e) => !estaDisenado(e));
  // Sin objetivo no se puede priorizar. Los de discovery se excluyen: su
  // resultado es información, no un movimiento del indicador, así que exigirles
  // una meta numérica sería pedirles que se inventen una.
  const sinObjetivo = experimentos.filter((e) => !e.esDiscovery && !e.impactoEsperado?.objetivo);
  const corriendo = experimentos.filter((e) => e.estado === "Corriendo").length;
  const ordenados = [...experimentos].sort(
    (a, b) => ORDEN.indexOf(a.estado) - ORDEN.indexOf(b.estado)
  );

  const columnas: Column<Experimento>[] = [
    // El nombre lleva SIEMPRE su proyecto debajo. Se probó a darle columna
    // propia y luego a quitarla para hacer sitio a "Tamaño", y quitarla fue un
    // error: sin el proyecto, "Ruteo por mejor carrier × zona" se lee como una
    // iniciativa suelta cuando en realidad es la apuesta central de LOG-004
    // (Selección inteligente de transportadoras). Un experimento sin su
    // proyecto a la vista parece trabajo duplicado.
    {
      key: "nombre",
      header: "Experimento",
      width: "30%",
      render: (e) => {
        const p = e.proyectoSlug ? proyectoPorSlug(e.proyectoSlug) : undefined;
        return (
          <>
            <Link href={href(e)} className="exp-link">
              {e.nombre}
            </Link>
            <span className="exp-link__proyecto">
              {p ? (
                <Link href={`/proyectos/logistica/proyecto/${p.slug}`}>
                  {p.codigo ? `${p.codigo} · ` : ""}
                  {p.nombre}
                </Link>
              ) : (
                e.proyecto
              )}
            </span>
            {PANTALLA_PROPIA[e.slug] && (
              <span className="exp-link__extra">tiene {PANTALLA_PROPIA[e.slug]}</span>
            )}
          </>
        );
      },
    },
    {
      key: "estado",
      header: "Estado",
      width: "9%",
      render: (e) => <Pill tone={TONO_ESTADO[e.estado]}>{e.estado}</Pill>,
    },
    // Indicador · Hoy · Objetivo en columnas separadas, no en una frase.
    //
    // Con texto libre se coló un indicador equivocado sin que nada lo delatara
    // (se escribió que Recolección proactiva subía "Recogido por Dropi" cuando
    // sube movilización). Separadas, la celda vacía señala exactamente qué
    // falta, y `Hoy`/`Objetivo` son de 5–15 caracteres: esa brevedad es la que
    // permite comparar ocho experimentos de una pasada.
    //
    // Sale la columna "Aporta a": el indicador ya lo dice —Movilización es la
    // perdida 1, Devolución la 2— y tenerlo dos veces solo permite que se
    // contradigan entre sí.
    {
      key: "indicador",
      header: "Indicador",
      width: "16%",
      render: (e) =>
        e.impactoEsperado ? (
          <span className="exp-indicador">
            {e.impactoEsperado.indicador}
            {e.esDiscovery && <span className="exp-discovery">discovery</span>}
          </span>
        ) : null,
    },
    { key: "hoy", header: "Hoy", width: "8%", align: "right", render: (e) => e.impactoEsperado?.hoy },
    {
      key: "objetivo",
      header: "Objetivo",
      width: "15%",
      render: (e) =>
        e.impactoEsperado?.objetivo ? (
          <span className="exp-objetivo">{e.impactoEsperado.objetivo}</span>
        ) : null,
    },
    {
      key: "decide",
      header: "Qué decide",
      render: (e) => e.decide,
    },
    // Vacío en todo lo que no ha concluido, y eso es correcto: no es un dato
    // pendiente de cargar, es que todavía no hay resultado.
    {
      key: "real",
      header: "Impacto real",
      width: "18%",
      render: (e) => (e.impactoReal ? <span className="exp-real">{e.impactoReal}</span> : null),
    },
  ];

  return (
    <main className="page">
      <PageHeader
        title="Experimentos"
        subtitle="Qué se está probando, cuánto se espera mover y qué decide cada resultado."
        aside={
          <Pill tone={corriendo > 0 ? "warn" : "neutral"}>
            {corriendo} en curso de {experimentos.length}
          </Pill>
        }
      />

      {/* Dos huecos distintos, y conviene no confundirlos: uno impide DECIDIR
          con el resultado, el otro impide PRIORIZAR antes de correrlo. Ambos se
          arreglan escribiendo una frase, y las dos cuestan menos que el
          experimento que justifican. */}
      {(sinObjetivo.length > 0 || sinDisenar.length > 0) && (
        <Card tone="warn">
          <div className="exp-huecos">
            {sinObjetivo.length > 0 && (
              <div>
                <p className="u-prose">
                  <b>
                    {sinObjetivo.length} de {experimentos.length} sin objetivo declarado.
                  </b>{" "}
                  Se sabe qué indicador mueven y de dónde parten, pero no a dónde se quiere llegar,
                  de modo que no son comparables entre sí al priorizar.
                </p>
                <ul className="exp-sin-disenar">
                  {sinObjetivo.map((e) => (
                    <li key={e.slug}>
                      <Link href={href(e)}>{e.nombre}</Link>
                      <span>
                        {e.impactoEsperado
                          ? `falta el objetivo de ${e.impactoEsperado.indicador.toLowerCase()}`
                          : "falta el indicador"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {sinDisenar.length > 0 && (
              <div>
                <p className="u-prose">
                  <b>
                    {sinDisenar.length} de {experimentos.length} sin decisión declarada.
                  </b>{" "}
                  Sus métricas siguen en “candidatas”, de modo que el estado registrado afirma algo
                  que la métrica todavía no sostiene.
                </p>
                <ul className="exp-sin-disenar">
                  {sinDisenar.map((e) => (
                    <li key={e.slug}>
                      <Link href={href(e)}>{e.nombre}</Link>
                      <span>{e.estado.toLowerCase()} · métrica sin cerrar</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      )}

      <SectionTitle hint="Ordenados por estado: primero los que están en curso. Cada nombre abre su ficha.">
        {`Los ${experimentos.length} experimentos`}
      </SectionTitle>
      <Table columns={columnas} rows={ordenados} getKey={(e) => e.slug} />
    </main>
  );
}
