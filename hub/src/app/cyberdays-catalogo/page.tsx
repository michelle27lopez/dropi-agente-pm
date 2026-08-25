import catalogo from "./catalogo.json";
import CatalogGrid from "./CatalogGrid";
import "./catalogo.css";

// Catálogo público de productos de Cyber Days, pensado para compartirse
// como link o como PDF (botón "Descargar PDF" -> window.print()). El dato
// es un JSON estático porque se actualiza manualmente por campaña (ver
// scripts/cyberdays-catalogo-import.js), no por interacción de usuario.
export default function CyberDaysCatalogoPage() {
  return <CatalogGrid products={catalogo} />;
}
