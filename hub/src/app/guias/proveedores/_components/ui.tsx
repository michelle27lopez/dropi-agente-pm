"use client";

import React from "react";

// Piezas compartidas de la base de conocimiento del vertical Proveedores.
// Dos de ellas cargan la regla del documento: <Fuente> obliga a que ninguna
// cifra se publique sin origen y fecha de corte, y <Vacio> convierte lo que
// no sabemos en contenido de primera clase en vez de una nota al pie.

export function SectionCard({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section
      id={id}
      style={{
        background: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: "32px 36px",
        marginBottom: 24,
      }}
    >
      {children}
    </section>
  );
}

export function H1({ children, sub }: { children: React.ReactNode; sub?: string }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", margin: 0, lineHeight: 1.2 }}>{children}</h1>
      {sub && <p style={{ fontSize: 14, color: "var(--muted)", margin: "6px 0 0", lineHeight: 1.5 }}>{sub}</p>}
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--fg)", margin: "32px 0 12px" }}>{children}</h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", margin: "24px 0 10px" }}>{children}</h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, margin: "0 0 12px" }}>{children}</p>
  );
}

export function Tag({ color = "var(--dropi)", children }: { color?: string; children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: `color-mix(in srgb, ${color} 12%, transparent)`,
        color,
        border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
        borderRadius: 999,
        padding: "2px 10px",
        fontSize: 11,
        fontWeight: 700,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

// Pie de evidencia. Va debajo de cada bloque con cifras.
export function Fuente({ origen, corte, nota }: { origen: string; corte?: string; nota?: string }) {
  return (
    <div
      style={{
        marginTop: 12,
        paddingTop: 10,
        borderTop: "1px dashed var(--border)",
        fontSize: 11,
        color: "var(--muted)",
        lineHeight: 1.6,
      }}
    >
      <strong style={{ color: "#4B5563" }}>Fuente:</strong> {origen}
      {corte && <> · <strong style={{ color: "#4B5563" }}>Corte:</strong> {corte}</>}
      {nota && <div style={{ marginTop: 4 }}>{nota}</div>}
    </div>
  );
}

// Lo que no sabemos, con dueño. Si no hay dueño, el vacío no está cerrado.
export function Vacio({ pregunta, dueno, detalle }: { pregunta: string; dueno: string; detalle?: string }) {
  return (
    <div
      style={{
        background: "var(--warning-tint)",
        border: "1px solid color-mix(in srgb, var(--warning) 35%, transparent)",
        borderLeft: "3px solid var(--warning)",
        borderRadius: "0 10px 10px 0",
        padding: "14px 18px",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, color: "#B45309", marginBottom: 6, letterSpacing: "0.04em" }}>
        SIN EVIDENCIA DOCUMENTADA
      </div>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, fontWeight: 600 }}>{pregunta}</div>
      {detalle && (
        <div style={{ fontSize: 13, color: "#4B5563", lineHeight: 1.7, marginTop: 6 }}>{detalle}</div>
      )}
      <div style={{ fontSize: 12, color: "#92400E", marginTop: 8 }}>
        Quién tiene el dato: <strong>{dueno}</strong>
      </div>
    </div>
  );
}

// Contradicción entre dos fuentes internas. No se elige la más cómoda.
export function Discrepancia({ titulo, a, b, estado }: { titulo: string; a: string; b: string; estado: string }) {
  return (
    <div
      style={{
        background: "var(--danger-tint)",
        border: "1px solid color-mix(in srgb, var(--danger) 30%, transparent)",
        borderLeft: "3px solid var(--danger)",
        borderRadius: "0 10px 10px 0",
        padding: "14px 18px",
        marginBottom: 12,
      }}
    >
      <div style={{ fontSize: 11, fontWeight: 800, color: "#B91C1C", marginBottom: 8, letterSpacing: "0.04em" }}>
        DOS FUENTES NO COINCIDEN
      </div>
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>{titulo}</div>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7, marginBottom: 4 }}>· {a}</div>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>· {b}</div>
      <div style={{ fontSize: 12, color: "#991B1B", marginTop: 8 }}>{estado}</div>
    </div>
  );
}

export function Callout({ icon, color = "var(--info)", children }: { icon: string; color?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: `color-mix(in srgb, ${color} 7%, transparent)`,
        border: `1px solid color-mix(in srgb, ${color} 25%, transparent)`,
        borderRadius: 10,
        padding: "12px 16px",
        display: "flex",
        gap: 10,
        marginBottom: 16,
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

// Tabla con scroll propio: el body de la página nunca scrollea en horizontal.
export function Tabla({ head, children, min = 520 }: { head: string[]; children: React.ReactNode; min?: number }) {
  return (
    <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 12, marginBottom: 4 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", minWidth: min }}>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th
                key={i}
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  fontSize: 11,
                  fontWeight: 700,
                  color: "var(--muted)",
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  background: "#FAFAFA",
                  borderBottom: "1px solid var(--border)",
                  whiteSpace: "nowrap",
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Td({ children, bold, color }: { children: React.ReactNode; bold?: boolean; color?: string }) {
  return (
    <td
      style={{
        padding: "10px 14px",
        borderBottom: "1px solid #F3F4F6",
        fontSize: 13,
        lineHeight: 1.6,
        color: color || (bold ? "var(--fg)" : "#4B5563"),
        fontWeight: bold ? 700 : 400,
        verticalAlign: "top",
      }}
    >
      {children}
    </td>
  );
}

// Cifra suelta con su etiqueta. Sin sombra en reposo (DESIGN.md).
export function KPI({ valor, label, sub, color = "var(--fg)" }: { valor: string; label: string; sub?: string; color?: string }) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: 12,
        padding: "16px 18px",
        background: "var(--card)",
        flex: "1 1 160px",
        minWidth: 160,
      }}
    >
      <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1.2 }}>{valor}</div>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#374151", marginTop: 6 }}>{label}</div>
      {sub && <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 3, lineHeight: 1.5 }}>{sub}</div>}
    </div>
  );
}

export function KPIRow({ children }: { children: React.ReactNode }) {
  return <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 16 }}>{children}</div>;
}

// Barra horizontal para distribuciones. Un solo color por serie.
export function Barra({ label, pct, valor, color = "var(--dropi)" }: { label: string; pct: number; valor: string; color?: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4, gap: 12 }}>
        <span style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, color: "var(--muted)", whiteSpace: "nowrap" }}>{valor}</span>
      </div>
      <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ width: `${Math.min(pct, 100)}%`, height: "100%", background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}
