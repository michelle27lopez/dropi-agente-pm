import RegistroIniciativas from "@/app/proyectos/logistica/_components/RegistroIniciativas";

// Envoltorio server: existe solo para conservar `metadata`, que no funciona en
// un client component. Todo el registro vive en la isla, que necesita estado
// para los filtros de la cabecera.
export const metadata = { title: "Registro de iniciativas · Tablero Logística" };

export default function IniciativasPage() {
  return <RegistroIniciativas />;
}
