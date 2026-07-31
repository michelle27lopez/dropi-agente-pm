import Link from "next/link";
import VigiaConcept from "./VigiaConcept";

export const metadata = { title: "Vigía · Conceptualización · Tablero Logística" };

export default function VigiaPage() {
  return (
    <main className="page">
      <Link href="/proyectos/logistica/experimentos" className="go" style={{ display: "inline-block", marginBottom: 10 }}>
        ← Volver a experimentos
      </Link>
      <div className="eyebrow">Experimento · Vigía — extensión Chrome sobre el módulo de órdenes</div>
      <p className="sim-sub">
        Conceptualización interactiva de Vigía: una extensión de Chrome (Manifest V3) que intercepta
        el API de Dropi, calcula SLAs automáticamente e inyecta alertas accionables directamente en el
        dashboard. Dos roles (Dropshipper y Proveedor), cero configuración. Cambia entre las pestañas
        para ver la experiencia de cada rol.
      </p>
      <VigiaConcept />
    </main>
  );
}
