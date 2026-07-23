import { weeklies } from "@/app/proyectos/logistica/_lib/data";
import WeeklyView from "@/app/proyectos/logistica/_components/WeeklyView";

export const metadata = { title: "Weekly Product · Tablero Logística" };

// El Weekly Product: switch de semana → indicadores hoy → tiempo por fases →
// hallazgos → proyectos. El contenido y el switch viven en WeeklyView (cliente).
export default function UpdatesPage() {
  return <WeeklyView weeklies={weeklies} />;
}
