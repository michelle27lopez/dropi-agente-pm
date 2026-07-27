import { etapas, proyectos } from "@/app/proyectos/logistica/_lib/data";
import TreeStage from "@/app/proyectos/logistica/_components/TreeStage";

export const metadata = { title: "Mapa de la orden · Tablero Logística" };

// El viaje de la orden como ÁRBOL: el tronco = la cadena de valor,
// cada etapa un nodo, y los proyectos colgando como hojas.
export default function MapaPage() {
  return (
    <main className="page">
      <div className="eyebrow">Mapa de la orden · el viaje de la orden</div>
      <div className="tree">
        {etapas.map((e, i) => (
          <TreeStage
            key={e.n}
            etapa={e}
            proyectos={proyectos.filter((p) => p.etapa === e.nombre)}
            last={i === etapas.length - 1}
          />
        ))}
      </div>
    </main>
  );
}
