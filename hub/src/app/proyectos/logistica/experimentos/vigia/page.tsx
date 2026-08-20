import VigiaConcept from "./VigiaConcept";
import { PageHeader, Pill } from "@/app/proyectos/logistica/_components/ui";

export const metadata = { title: "Vigía · Conceptualización · Tablero Logística" };

// Conceptualización de Vigía. Es capa de HANDOFF: aquí sí va el detalle técnico
// que se retiró de la ficha (arquitectura, umbrales por estado), porque quien
// abre esta pantalla viene a construirlo, no a decidir si vale la pena.
//
// Lo que se homologa es la cabecera y la primera frase: "extensión de Chrome
// Manifest V3 que intercepta el API y calcula SLAs" describe la implementación,
// no lo que hace. Quien llega desde el tablero necesita saber primero qué
// resuelve; el cómo viene después, dentro de la propia conceptualización.

export default function VigiaPage() {
  return (
    <main className="page">
      <PageHeader
        title="Vigía"
        subtitle="Avisa qué órdenes van a caerse antes de que ocurra, vigilando los plazos de cada estado. Cambia de pestaña para ver la experiencia de cada rol."
        back={{ href: "/proyectos/logistica/experimentos", label: "Experimentos" }}
        aside={<Pill tone="info">Diseñado</Pill>}
      />
      <VigiaConcept />
    </main>
  );
}
