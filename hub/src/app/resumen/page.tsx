"use client";

import { useState, useEffect } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

type Proyecto = { id: string; handoff_status: string | null };
type Celula = {
  id: string; nombre: string; slug: string; lead: string | null;
  proyectos: Proyecto[];
};

type Riesgo = { titulo: string; impacto: string; prioridad: "Alto" | "Medio" | "Bajo" };

const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B", "Listo para handoff": "#0EA5E9", "Handoff hecho": "#22C55E",
};

const PRIORIDAD_COLOR: Record<Riesgo["prioridad"], string> = {
  Alto: "#DC2626", Medio: "#F59E0B", Bajo: "#94A3B8",
};

const PRIORIDAD_ORDEN: Record<Riesgo["prioridad"], number> = { Alto: 0, Medio: 1, Bajo: 2 };

// Delivery Project Risks por célula — contenido estático, redactado a partir
// de "Pendientes TI.txt" (jul 2026). Próximo paso: alimentar esto desde datos
// reales de projects/celula_updates en vez de texto fijo.
const DELIVERY_RISKS: Record<string, Riesgo[]> = {
  logistica: [
    {
      titulo: "Cola de Handoff sin Estimación",
      impacto: "2 proyectos ya entregados a TI (Selección de Transportadoras, Parametrización de Tarifas) no tienen fecha de entrada — la célula no puede comprometer resultados con el negocio.",
      prioridad: "Alto",
    },
    {
      titulo: "Accesos a Datos Bloqueados",
      impacto: "Sin acceso a huella digital, normalización de estados, coberturas de transportadoras y catálogo, el equipo no puede validar ni avanzar sus propias iniciativas.",
      prioridad: "Medio",
    },
  ],
  suppliers: [
    {
      titulo: "DESC-001 · Descuentos Cyber Days",
      impacto: "Crítico: si no se resuelve antes del 11-ago se pierde la ventana de la campaña más importante del semestre.",
      prioridad: "Alto",
    },
    {
      titulo: "Cola de 6 Proyectos sin TI",
      impacto: "NEG-001/002, COM-002 y CAT-001 tienen documentación lista pero sin desarrollador asignado — CAT-001 se proyecta hasta feb 2027.",
      prioridad: "Alto",
    },
    {
      titulo: "COM-001 Detenido",
      impacto: "Bloqueado por Dropify sin terminar en TI, sin fecha de reanudación.",
      prioridad: "Medio",
    },
    {
      titulo: "4 APIs para Dropi Pulso",
      impacto: "Ya tienen aval de Lucho pero sin desarrollo — sin ellas, Pulso no puede escalar su motor de matching.",
      prioridad: "Medio",
    },
  ],
  brands: [
    {
      titulo: "Migración a Perfil de Marcas",
      impacto: "Sin la estrategia técnica definida, no se puede lanzar la Beta controlada ni liberar a producción el nuevo perfil.",
      prioridad: "Alto",
    },
    {
      titulo: "API de Comportamiento Transaccional",
      impacto: "Bloqueada por el mismatch de user_id backend↔UserPilot — sin esto, los experimentos de activación siguen dependiendo de CSVs manuales, sin escalar.",
      prioridad: "Alto",
    },
    {
      titulo: "Usuarios de Prueba Emprendedores Plus",
      impacto: "Sin candidatos con contrato directo Inter Rapidísimo/Coordinadora, no se puede validar el caso de uso real antes de escalar.",
      prioridad: "Medio",
    },
  ],
  sellers: [
    {
      titulo: "Bugs Críticos Tienda Nube",
      impacto: "5 fallos técnicos bloquean que el Seller complete una venta — riesgo de que abandone Dropi y vuelva a procesos manuales.",
      prioridad: "Alto",
    },
    {
      titulo: "Módulo de Notificaciones",
      impacto: "La pieza de infraestructura más crítica para retención en Q4 — sin ella no hay forma de avisar al Seller que confirme órdenes pendientes. Requiere crear proyecto nuevo en TI.",
      prioridad: "Alto",
    },
    {
      titulo: "Page Pilot QA Bloqueado",
      impacto: "El Seller no puede crear landings mientras la feature siga en beta — bloqueado esperando pruebas de TI.",
      prioridad: "Medio",
    },
    {
      titulo: "Dropify 2.0 · WooCommerce",
      impacto: "En curso, con entrega pactada 4-ago-2026.",
      prioridad: "Bajo",
    },
  ],
  experience: [
    {
      titulo: "Órdenes y Dropi Tester Bloqueados",
      impacto: "Sin developer asignado — ambos módulos detenidos por completo.",
      prioridad: "Alto",
    },
    {
      titulo: "Error 505 en Búsqueda Semántica (Paraguay)",
      impacto: "Bloquea la evaluación de expansión a otros países hasta que se resuelva.",
      prioridad: "Medio",
    },
    {
      titulo: "Inconsistencias en Dashboard de Indicadores",
      impacto: "Los conteos de órdenes por estado no concuerdan con lo real — reduce la confianza en el dato para tomar decisiones.",
      prioridad: "Medio",
    },
  ],
  backoffice: [
    {
      titulo: "8 Frentes sin Actualización de TI",
      impacto: "2+ semanas sin visibilidad — pone en riesgo directo el OKR2 (Consolidar operación multipaís) y el cierre del Delivery Backlog obligatorio de Q3.",
      prioridad: "Alto",
    },
    {
      titulo: "Facturación Chile y Ecuador en QA",
      impacto: "2 correcciones llevan 2+ semanas estancadas en QA, con impacto directo en la operación de esos países.",
      prioridad: "Alto",
    },
    {
      titulo: "Validación de Identidad (Sumsub)",
      impacto: "TI no tiene compromiso de recurso ni estimación — sin definición no se puede avanzar la Fase 0 ni planear la Fase 1.",
      prioridad: "Medio",
    },
    {
      titulo: "Conciliaciones sin Developer",
      impacto: "Sin recurso asignado, el proyecto no puede avanzar.",
      prioridad: "Medio",
    },
  ],
};

function RiskItem({ riesgo }: { riesgo: Riesgo }) {
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
      <span style={{
        width: 7, height: 7, borderRadius: 999, marginTop: 5, flexShrink: 0,
        background: PRIORIDAD_COLOR[riesgo.prioridad],
      }} />
      <div>
        <p style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{riesgo.titulo}</p>
        <p style={{ fontSize: 12, color: "var(--muted)", margin: "2px 0 0", lineHeight: 1.45 }}>{riesgo.impacto}</p>
      </div>
    </div>
  );
}

function CelulaCard({ celula }: { celula: Celula }) {
  const [expanded, setExpanded] = useState(false);

  const counts: Record<string, number> = {};
  for (const p of celula.proyectos) {
    const key = p.handoff_status ?? "Sin estado";
    counts[key] = (counts[key] ?? 0) + 1;
  }

  const riesgos = [...(DELIVERY_RISKS[celula.slug] ?? [])].sort(
    (a, b) => PRIORIDAD_ORDEN[a.prioridad] - PRIORIDAD_ORDEN[b.prioridad]
  );
  const visibles = expanded ? riesgos : riesgos.slice(0, 2);
  const restantes = riesgos.length - visibles.length;

  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 20, background: "var(--card)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{celula.nombre}</h2>
        <a href={`/celula/${celula.slug}`} style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>Ver →</a>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: riesgos.length ? 18 : 0 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--fg)", background: "var(--bg)", borderRadius: 999, padding: "3px 9px" }}>
          {celula.proyectos.length} proyecto{celula.proyectos.length === 1 ? "" : "s"}
        </span>
        {Object.entries(counts).map(([status, n]) => (
          <span key={status} style={{
            fontSize: 11, fontWeight: 600,
            color: HANDOFF_COLOR[status] ?? "#6B7280",
            background: `${HANDOFF_COLOR[status] ?? "#6B7280"}15`,
            borderRadius: 999, padding: "3px 9px",
          }}>
            {n} · {status}
          </span>
        ))}
      </div>

      {riesgos.length > 0 && (
        <div>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>
            Delivery Project Risks
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {visibles.map((r) => <RiskItem key={r.titulo} riesgo={r} />)}
          </div>
          {riesgos.length > 2 && (
            <button
              onClick={() => setExpanded((v) => !v)}
              style={{
                marginTop: 12, fontSize: 12, fontWeight: 700, color: "var(--dropi)",
                background: "none", border: "none", cursor: "pointer", padding: 0,
              }}
            >
              {expanded ? "Ver menos" : `Ver más (+${restantes})`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResumenPage() {
  const [celulas, setCelulas] = useState<Celula[] | null>(null);

  useEffect(() => {
    fetch("/api/celulas")
      .then((res) => res.json())
      .then((data) => { if (Array.isArray(data)) setCelulas(data); });
  }, []);

  return (
    <main style={{ minHeight: "100vh", padding: 0, background: "var(--card)", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <HubHeader title="Resumen ejecutivo" subtitle="Vista cross-célula · Darwin" currentSlug="resumen" />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32 }}>
            Vista de solo lectura del estado de cada célula: proyectos por etapa y sus riesgos de delivery más relevantes.
          </p>

          {!celulas && <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {celulas?.map((c) => <CelulaCard key={c.id} celula={c} />)}
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
