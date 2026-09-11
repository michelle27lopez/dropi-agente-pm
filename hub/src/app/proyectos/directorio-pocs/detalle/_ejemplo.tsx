// PLANTILLA — Taller Dropi Lab
//
// Este archivo es solo un ejemplo, no está registrado en registry.tsx así
// que no afecta a ningún POC real. Para proponer tu propia versión de la
// ficha de detalle de TU POC:
//
// 1. Copia este archivo con el nombre de tu POC en minúscula, ej.
//    "fin-004.tsx" (usa el project_code que ves en la tarjeta del directorio).
// 2. Cambia lo que quieras del layout, los colores, el orden de la
//    información — es tuyo.
// 3. Abre registry.tsx y agrega tu import + tu línea en el mapa.
// 4. Guarda, haz commit, push, y abre tu PR. Como cada quien edita un
//    archivo distinto, tu PR no choca con el de nadie más.
//
// Tokens disponibles del hub (usa estos, no colores sueltos):
// var(--dropi), var(--dropi-light), var(--bg), var(--card), var(--border),
// var(--fg), var(--muted), var(--success), var(--warning), var(--danger),
// var(--info), var(--info-tint)

import type { PocDetailProps } from "./types";

export default function EjemploDetalle({ poc }: PocDetailProps) {
  return (
    <div
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: 28,
      }}
    >
      <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", textTransform: "uppercase" }}>
        {poc.project_code}
      </span>
      <h1 style={{ fontSize: 20, fontWeight: 800, color: "var(--fg)", margin: "8px 0 12px" }}>
        {poc.name}
      </h1>
      <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7 }}>{poc.summary}</p>
      {poc.celulaNombre && (
        <p style={{ marginTop: 16, fontSize: 12, color: "var(--info)" }}>Célula: {poc.celulaNombre}</p>
      )}
    </div>
  );
}
