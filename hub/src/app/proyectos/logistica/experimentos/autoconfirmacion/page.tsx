"use client";

import { useState } from "react";
import AutoconfirmacionSim from "@/app/proyectos/logistica/_components/AutoconfirmacionSim";
import AutoconfirmacionResultados from "@/app/proyectos/logistica/_components/AutoconfirmacionResultados";
import { PageHeader, Pill } from "@/app/proyectos/logistica/_components/ui";

// Pantalla propia del experimento de autoconfirmación: el simulador de reglas y
// los resultados de las pruebas con usuarios.
//
// Es capa de HANDOFF, no de lectura gerencial: aquí sí cabe el detalle. Lo que
// se homologa es la cabecera y el lenguaje — "M4 masticado de la dinámica del
// Cell Board" y "el prototipo RPP" no significan nada para quien abre el enlace
// desde fuera de la célula.

type Tab = "simulador" | "resultados";

export default function AutoconfirmacionPage() {
  const [tab, setTab] = useState<Tab>("simulador");

  return (
    <main className="page">
      <PageHeader
        title="Autoconfirmación por madurez del dropshipper"
        subtitle="Simula las reglas de autoconfirmación y consulta lo que dijeron los usuarios al probarlas."
        back={{ href: "/proyectos/logistica/experimentos", label: "Experimentos" }}
        aside={<Pill tone="warn">En curso</Pill>}
      />

      <div className="exp-tabs">
        <button
          className={`exp-tab${tab === "simulador" ? " exp-tab--active" : ""}`}
          onClick={() => setTab("simulador")}
        >
          Simulador de reglas
        </button>
        <button
          className={`exp-tab${tab === "resultados" ? " exp-tab--active" : ""}`}
          onClick={() => setTab("resultados")}
        >
          Pruebas con usuarios
          <span className="exp-tab-badge">6 participantes</span>
        </button>
      </div>

      {tab === "simulador" && (
        <>
          <p className="sim-sub">
            Mueve las reglas y mira cómo se reparten las órdenes entre <b>autoconfirmadas</b> y{" "}
            <b>manuales</b>, con el motivo de cada una. Los datos son de ejemplo: el experimento real
            corre sobre órdenes reales y mide tiempo de confirmación, entrega y devolución.
          </p>
          <AutoconfirmacionSim />
        </>
      )}

      {tab === "resultados" && (
        <>
          <p className="sim-sub">
            Seis usuarios reales —dropshippers y proveedores— probaron el prototipo del flujo en
            sesiones remotas moderadas por Michel Pino, en julio de 2026.
          </p>
          <AutoconfirmacionResultados />
        </>
      )}
    </main>
  );
}
