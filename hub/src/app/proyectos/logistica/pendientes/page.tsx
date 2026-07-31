import { getPendientes } from "@/app/proyectos/logistica/_lib/pendientes";
import TodoItem from "@/app/proyectos/logistica/_components/TodoItem";

export const metadata = { title: "Pendientes · Tablero Logística" };

// Pendientes vivos: se leen de planning/todos.md en cada build, ordenados por prioridad.
const orden = { Alta: 0, Media: 1, Baja: 2 } as const;

export default function PendientesPage() {
  const items = getPendientes().sort((a, b) => orden[a.prioridad] - orden[b.prioridad]);
  return (
    <main className="page">
      <div className="eyebrow">Pendientes · lo que sigue</div>
      <div className="todos">
        {items.map((p, i) => (
          <TodoItem key={i} p={p} />
        ))}
      </div>
      <p className="footer" style={{ textAlign: "left", marginTop: 18 }}>
        Se leen del bloque marcado en <code>planning/todos.md</code> — se actualizan solos con cada deploy.
      </p>
    </main>
  );
}
