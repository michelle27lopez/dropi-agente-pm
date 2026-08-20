import { getPendientes } from "@/app/proyectos/logistica/_lib/pendientes";
import type { Pendiente, Prioridad } from "@/app/proyectos/logistica/_lib/data";
import { Table, Pill, PageHeader, type Column } from "@/app/proyectos/logistica/_components/ui";

export const metadata = { title: "Pendientes · Tablero Logística" };

// Los pendientes vivos de la célula. Se leen del bloque marcado en
// logistica-lab/planning/todos.md en cada build: editar el archivo y hacer push
// deja esta pantalla al día, sin nada duplicado aquí.
//
// Pasa a tabla por el mismo motivo que iniciativas y experimentos: son N cosas
// comparables sobre los mismos ejes. Antes eran filas con tres anchos fijos y
// una píldora de prioridad, lo que impedía agrupar visualmente por proyecto o
// ver de un golpe cuántas cosas de prioridad alta hay abiertas.

const ORDEN: Record<Prioridad, number> = { Alta: 0, Media: 1, Baja: 2 };

// La prioridad SÍ se gana color: es lo único de esta pantalla que pide acción.
const TONO: Record<Prioridad, "risk" | "warn" | "neutral"> = {
  Alta: "risk",
  Media: "warn",
  Baja: "neutral",
};

const columnas: Column<Pendiente>[] = [
  {
    key: "prioridad",
    header: "Prioridad",
    width: "12%",
    render: (p) => <Pill tone={TONO[p.prioridad]}>{p.prioridad}</Pill>,
  },
  { key: "texto", header: "Pendiente", render: (p) => p.texto },
  {
    key: "proyecto",
    header: "Proyecto",
    width: "22%",
    render: (p) => <span className="pen-proyecto">{p.proyecto}</span>,
  },
];

export default function PendientesPage() {
  const items = getPendientes().sort((a, b) => ORDEN[a.prioridad] - ORDEN[b.prioridad]);
  const altas = items.filter((p) => p.prioridad === "Alta").length;

  return (
    <main className="page">
      <PageHeader
        title="Pendientes"
        subtitle="Lo que sigue, ordenado por prioridad."
        aside={
          <Pill tone={altas > 0 ? "risk" : "neutral"}>
            {altas} de prioridad alta
          </Pill>
        }
      />

      <Table
        columns={columnas}
        rows={items}
        getKey={(p, i) => `${p.proyecto}-${i}`}
        empty="No hay pendientes registrados."
      />

      <p className="pen-fuente">
        Se actualiza sola: sale del archivo de pendientes de la célula cada vez que se publica el tablero.
      </p>
    </main>
  );
}
