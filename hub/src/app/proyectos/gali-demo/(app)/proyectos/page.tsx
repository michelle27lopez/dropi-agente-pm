"use client";

import { useEffect, useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { GaliProject, getLocalProjects } from "../v5/project-storage";

const STEP_LABELS: Record<string, string> = {
  goal: "Objetivo",
  discovery: "Descubrir",
  espionaje: "Espionaje",
  select: "Elegir",
  estrategia: "Estrategia",
  landing: "Landing",
  campana: "Campaña",
  launch: "Lanzado",
};

const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #e2e5f0", borderRadius: 14,
  padding: 20, display: "flex", flexDirection: "column", gap: 10,
};

export default function ProyectosPage() {
  const [projects, setProjects] = useState<GaliProject[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setProjects(getLocalProjects());
    setLoaded(true);
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 800, color: "#232938", marginBottom: 4 }}>Proyectos</h1>
        <p style={{ fontSize: 14, color: "#69738c" }}>Todos los proyectos que has armado con Gali, o crea uno nuevo.</p>
      </div>

      <a
        href="/proyectos/gali-demo/v5"
        style={{
          ...card, flexDirection: "row", alignItems: "center", gap: 14,
          textDecoration: "none", border: "1.5px dashed #ffa067", background: "#fff7f2",
        }}
      >
        <div style={{
          width: 40, height: 40, borderRadius: 10, background: "#ff6102", color: "#fff",
          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
        }}>
          <Plus size={20} />
        </div>
        <div>
          <strong style={{ fontSize: 14, color: "#232938" }}>Crear nuevo proyecto</strong>
          <p style={{ margin: 0, fontSize: 12, color: "#69738c" }}>Elige tu objetivo y arranca con Gali paso a paso.</p>
        </div>
      </a>

      {loaded && projects.length === 0 && (
        <div style={{ ...card, alignItems: "center", textAlign: "center", padding: 40 }}>
          <p style={{ margin: 0, fontSize: 14, color: "#69738c" }}>Aún no has creado ningún proyecto con Gali.</p>
        </div>
      )}

      {projects.map(p => (
        <div key={p.id} style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
            <strong style={{ fontSize: 15, color: "#232938" }}>{p.nombre}</strong>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 999,
              background: p.estado === "activo" ? "#ecfdf5" : "#fff7ed",
              color: p.estado === "activo" ? "#047857" : "#c2410c",
              textTransform: "capitalize",
            }}>
              {p.estado}
            </span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, fontSize: 12, color: "#69738c" }}>
            {p.producto_nombre && <span>Producto: <strong style={{ color: "#333b4d" }}>{p.producto_nombre}</strong></span>}
            {typeof p.presupuesto_diario === "number" && (
              <span>Presupuesto: <strong style={{ color: "#333b4d" }}>${p.presupuesto_diario.toLocaleString("es-CO")}/día</strong></span>
            )}
            <span>Paso: <strong style={{ color: "#333b4d" }}>{STEP_LABELS[p.step_actual] || p.step_actual}</strong></span>
          </div>

          <a
            href={`/proyectos/gali-demo/v5?resume=${p.id}`}
            style={{
              alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 6,
              fontSize: 13, fontWeight: 700, color: "#ff6102", textDecoration: "none",
            }}
          >
            Continuar <ArrowRight size={14} />
          </a>
        </div>
      ))}
    </div>
  );
}
