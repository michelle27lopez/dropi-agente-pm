import MapaOrden from "@/app/proyectos/logistica/_components/MapaOrden";

export const metadata = { title: "Mapa de la orden · Tablero Logística" };

// Wrapper de servidor: la vista es cliente (filtros y resaltado de las
// iniciativas transversales), pero `metadata` solo se puede exportar desde un
// componente de servidor. Mismo patrón que /iniciativas y /updates.
export default function MapaPage() {
  return <MapaOrden />;
}
