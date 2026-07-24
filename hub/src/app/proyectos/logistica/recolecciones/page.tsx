import type { Metadata } from "next";

// Control de recolecciones.
//
// El prototipo es un HTML autocontenido (Leaflet + datos mock deterministas) que vive
// en `public/logistica/recolecciones/`. Se embebe en un iframe en vez de portarlo a
// React porque todavía está en discovery: la definición de datos no está cerrada
// (falta la respuesta de Data sobre cobertura por municipio) y reescribirlo ahora
// sería trabajo perdido. Cuando el modelo se estabilice, se porta a componentes.

export const metadata: Metadata = {
  title: "Control de recolecciones · Logística — Dropi",
  description:
    "Guías preparadas sin recoger, por territorio DANE. Prototipo con datos simulados.",
};

const PROTOTIPO = "/logistica/recolecciones/control-recolecciones.html";

export default function RecoleccionesPage() {
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
            Control de recolecciones
          </h1>
          <p
            style={{
              margin: "3px 0 0",
              fontSize: 12.5,
              color: "var(--muted)",
            }}
          >
            Guías preparadas sin recoger, por territorio DANE · Colombia →
            departamento → municipio → punto
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
          Datos simulados
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
        title="Control de recolecciones — prototipo"
        style={{ flex: 1, width: "100%", border: 0, minHeight: 0, display: "block" }}
      />
    </main>
  );
}
