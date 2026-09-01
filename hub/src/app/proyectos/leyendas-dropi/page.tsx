import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leyendas Dropi · Consulta tu nivel",
  description:
    "Descubre tu nivel en el programa de gamificación Leyendas Dropi. Verifica tu progreso, subnivel actual y tu historial de órdenes de los últimos 3 meses.",
};

export default function LeyendasDropiPage() {
  return (
    <iframe
      src="/leyendas-dropi-standalone.html"
      title="Leyendas Dropi"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0 }}
    />
  );
}
