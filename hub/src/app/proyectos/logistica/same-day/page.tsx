import type { Metadata } from "next";

// Same Day — densidad de demanda.
//
// Mismo patrón que `recolecciones`: el prototipo es un HTML autocontenido (Leaflet +
// datos reales agregados) en `public/logistica/same-day/`, embebido por iframe en vez de
// portado a React. La razón es la misma: el proyecto sigue en discovery y la definición
// de datos no está cerrada (falta origen, timestamps, transportadora y estado final —
// ver §7 del spec). Cuando el modelo se estabilice, se porta a componentes.
//
// La data que alimenta el mapa sale de `pipeline/` (ver su README): 427.294 órdenes de
// Bogotá, Medellín y Cali, ubicadas por cruce de nomenclatura contra OpenStreetMap.

export const metadata: Metadata = {
  title: "Same Day · densidad de demanda · Logística — Dropi",
  description:
    "Dónde se concentra la demanda de Bogotá, Medellín y Cali, y cuánta captura un centro de operación según su radio.",
};

const PROTOTIPO = "/logistica/same-day/mapa-sameday.html";

export default function SameDayPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        minWidth: 0,
      }}
    >
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          padding: "16px 22px",
          borderBottom: "1px solid var(--border)",
          background: "#fff",
          flexShrink: 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 19,
              fontWeight: 600,
              color: "var(--fg)",
              lineHeight: 1.25,
            }}
          >
            Same Day · densidad de demanda
          </h1>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 12.5,
              color: "var(--muted)",
            }}
          >
            427.294 órdenes de Bogotá, Medellín y Cali · ubicación por cruce de
            nomenclatura contra OpenStreetMap
          </p>
        </div>

        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            color: "#8A5A16",
            background: "#FEF6EC",
            border: "1px solid #F6E6CF",
            borderRadius: 999,
            padding: "4px 10px",
            whiteSpace: "nowrap",
          }}
        >
          Demanda, no factibilidad
        </span>

        <a
          href={PROTOTIPO}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: 12.5,
            fontWeight: 600,
            color: "var(--muted)",
            textDecoration: "none",
            border: "1px solid var(--border)",
            borderRadius: 8,
            padding: "7px 12px",
            whiteSpace: "nowrap",
          }}
        >
          Abrir en pestaña nueva ↗
        </a>
      </header>

      <iframe
        src={PROTOTIPO}
        title="Same Day — densidad de demanda"
        style={{ flex: 1, width: "100%", border: 0, minHeight: 0, display: "block" }}
      />
    </main>
  );
}
