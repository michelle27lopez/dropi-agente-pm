import Link from "next/link";
import AutoconfirmacionSim from "@/app/proyectos/logistica/_components/AutoconfirmacionSim";

export const metadata = { title: "Simulador · Autoconfirmación · Tablero Logística" };

export default function AutoconfirmacionPage() {
  return (
    <main className="page">
      <Link href="/proyectos/logistica/experimentos" className="go" style={{ display: "inline-block", marginBottom: 10 }}>
        ← Volver a experimentos
      </Link>
      <div className="eyebrow">Experimento · Autoconfirmación por madurez del dropshipper</div>
      <p className="sim-sub">
        Simulador de las reglas de autoconfirmación (M4 masticado de la dinámica del Cell Board).
        Mueve las perillas y mira cómo se parten en vivo tus órdenes entre <b>autoconfirmadas</b> y{" "}
        <b>manuales</b>, con el motivo. Data de ejemplo — el experimento real corre sobre órdenes
        reales y mide tiempo de confirmación, % de entrega y devolución.
      </p>
      <AutoconfirmacionSim />
    </main>
  );
}
