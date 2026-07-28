"use client";

import { useState } from "react";
import Link from "next/link";
import AutoconfirmacionSim from "@/app/proyectos/logistica/_components/AutoconfirmacionSim";
import AutoconfirmacionResultados from "@/app/proyectos/logistica/_components/AutoconfirmacionResultados";

type Tab = "simulador" | "resultados";

export default function AutoconfirmacionPage() {
  const [tab, setTab] = useState<Tab>("simulador");

  return (
    <main className="page">
      <Link href="/proyectos/logistica/experimentos" className="go" style={{ display: "inline-block", marginBottom: 10 }}>
        ← Volver a experimentos
      </Link>
      <div className="eyebrow">Experimento · Autoconfirmación por madurez del dropshipper</div>

      {/* Tabs */}
      <div className="exp-tabs">
        <button
          className={`exp-tab${tab === "simulador" ? " exp-tab--active" : ""}`}
          onClick={() => setTab("simulador")}
        >
          🎛️ Simulador
        </button>
        <button
          className={`exp-tab${tab === "resultados" ? " exp-tab--active" : ""}`}
          onClick={() => setTab("resultados")}
        >
          📊 Pruebas de usuario
          <span className="exp-tab-badge">6 participantes</span>
        </button>
      </div>

      {tab === "simulador" && (
        <>
          <p className="sim-sub">
            Simulador de las reglas de autoconfirmación (M4 masticado de la dinámica del Cell Board).
            Mueve las perillas y mira cómo se parten en vivo tus órdenes entre <b>autoconfirmadas</b> y{" "}
            <b>manuales</b>, con el motivo. Data de ejemplo — el experimento real corre sobre órdenes
            reales y mide tiempo de confirmación, % de entrega y devolución.
          </p>
          <AutoconfirmacionSim />
        </>
      )}

      {tab === "resultados" && (
        <>
          <p className="sim-sub">
            Resultados conductuales de las pruebas de usabilidad con 6 usuarios reales (dropshippers y proveedores).
            Pruebas moderadas remotas sobre el prototipo RPP del flujo de autoconfirmación. Julio 2026, facilitadas
            por Michel Pino.
          </p>
          <AutoconfirmacionResultados />
        </>
      )}
    </main>
  );
}
