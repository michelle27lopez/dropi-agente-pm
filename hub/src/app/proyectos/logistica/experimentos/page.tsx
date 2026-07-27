import { experimentos } from "@/app/proyectos/logistica/_lib/data";
import ExperimentCard from "@/app/proyectos/logistica/_components/ExperimentCard";

export const metadata = { title: "Experimentos · Tablero Logística" };

// Las apuestas de discovery: hipótesis → métrica → estado → aprendizaje.
export default function ExperimentosPage() {
  return (
    <main className="page">
      <div className="eyebrow">Experimentos · las apuestas de la semana</div>
      <div className="exps">
        {experimentos.map((e) => (
          <ExperimentCard key={e.nombre} e={e} />
        ))}
      </div>
    </main>
  );
}
