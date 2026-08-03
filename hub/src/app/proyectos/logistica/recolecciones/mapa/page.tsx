import type { Metadata } from "next";
import "../recolecciones.css";

// El mapa, en su propia página y sin nada alrededor.
//
// Embebido debajo del tablero no servía: el mapa tiene navegación por territorio
// (país → departamento → municipio), buscador, filtros y un panel de detalle
// adentro. Todo eso en una caja chica obliga a hacer scroll dentro del scroll y
// vuelve inusable justamente lo que el mapa hace bien.
//
// Acá no hay barra propia ni panel lateral (ver SIN_PANEL en Sidebar.tsx): el
// mapa ya trae su propio encabezado y sus propias migas adentro, así que una
// barra del hub encima solo repetía lo mismo y le robaba alto. La salida es el
// botón "atrás" del navegador o las migas del propio mapa.
//
// Sigue siendo el HTML de public/: ya consume /api/logistica/recolecciones (la
// base) con el JSON como respaldo, y ya trae la ingesta del export conectada.
// No es un prototipo a la espera de un port — es la herramienta, y funciona
// igual en producción.

export const metadata: Metadata = {
  title: "Mapa de recolecciones · Logística — Dropi",
  description: "Guías preparadas sin recoger, por territorio DANE.",
};

export default function MapaRecoleccionesPage() {
  return (
    <main className="rec-mapa-pagina">
      <iframe
        src="/logistica/recolecciones/control-recolecciones.html"
        title="Mapa de control de recolecciones"
      />
    </main>
  );
}
