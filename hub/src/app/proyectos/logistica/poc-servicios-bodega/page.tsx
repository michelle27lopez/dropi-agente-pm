import { PageHeader, Pill } from "@/app/proyectos/logistica/_components/ui";
import PocServiciosBodegaContent from "./PocServiciosBodegaContent";

export const metadata = { title: "POC Servicios en Bodega · Logistica" };

export default function Page() {
  return (
    <main className="page">
      <PageHeader
        title="POC Servicios en Bodega"
        subtitle="Auditoria y plataforma de cobros para los 5 servicios que Dropi presta en bodega pero no factura."
        back={{ href: "/proyectos/logistica/iniciativas", label: "Iniciativas" }}
        aside={<Pill code>LOG-020</Pill>}
      />
      <PocServiciosBodegaContent />
    </main>
  );
}
