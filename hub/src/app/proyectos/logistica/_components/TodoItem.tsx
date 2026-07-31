import type { Pendiente } from "@/app/proyectos/logistica/_lib/data";

// Una fila de pendiente, con su prioridad y proyecto.
export default function TodoItem({ p }: { p: Pendiente }) {
  return (
    <div className="todo">
      <span className={`pri p-${p.prioridad}`}>{p.prioridad}</span>
      <span className="txt">{p.texto}</span>
      <span className="proj">{p.proyecto}</span>
    </div>
  );
}
