import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Taller TARS · El nuevo arte de lanzar productos en Dropi",
  description:
    "Taller interactivo para Product Manager y Product Design: framework TARS (Población objetivo, Adopción, Retención, Satisfacción), calculadora en vivo, clasificador ofensiva/defensiva, event tracking y exportación de insumos para el documento E2E.",
};

export default function Gro008Page() {
  return (
    <iframe
      src="/taller-tars-standalone.html"
      title="Taller TARS"
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", border: 0 }}
    />
  );
}
