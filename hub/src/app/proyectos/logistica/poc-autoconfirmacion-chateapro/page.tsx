import { PageHeader, Pill } from "@/app/proyectos/logistica/_components/ui";
import PocAutoconfirmacionContent from "./PocAutoconfirmacionContent";

export const metadata = { title: "POC Autoconfirmacion x ChateaPro · Logistica" };

// Documentacion del POC wizard de autoconfirmacion con ChateaPro.
//
// Esta no es la pantalla del prototipo Angular — es la ficha de discovery que
// presenta el concepto, los hallazgos de las sesiones con ChateaPro, y los
// gates pendientes antes de pasar a delivery. Quien abre esto viene a entender
// que se descubrio y que falta, no a probar el flujo.

export default function Page() {
  return (
    <main className="page">
      <PageHeader
        title="POC Autoconfirmacion x ChateaPro"
        subtitle="Wizard de 3 pasos: reglas con impacto economico, comunicacion automatica al cliente, y simulador con acciones ChateaPro por orden."
        back={{ href: "/proyectos/logistica/iniciativas", label: "Iniciativas" }}
        aside={<Pill code>LOG-019</Pill>}
      />
      <PocAutoconfirmacionContent />
    </main>
  );
}
