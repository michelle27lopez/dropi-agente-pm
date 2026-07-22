"use client";

import { useEffect, useState } from "react";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

type Proyecto = { id: string; handoff_status: string | null };
type Celula = {
  id: string; nombre: string; slug: string; lead: string | null;
  proyectos: Proyecto[];
};

const HANDOFF_COLOR: Record<string, string> = {
  "Experimentación": "#F59E0B", "Listo para handoff": "#0EA5E9", "Handoff hecho": "#22C55E",
};

// Pendientes con TI por célula — contenido estático, transcrito de
// "Pendientes TI.txt" (jul 2026). Próximo paso: alimentar esto desde datos
// reales de projects/celula_updates en vez de texto fijo.
const PENDIENTES_TI: Record<string, string[]> = {
  logistica: [
    "2 proyectos listos para hand-off sin estimación de entrada (Selección de Transportadoras, Parametrización de Tarifas)",
    "4 accesos pendientes: huella digital, panel de normalización de estados, coberturas de transportadoras, catálogo",
  ],
  suppliers: [
    "6 proyectos en cola esperando TI — DESC-001 es crítico para Cyber Days (11-ago)",
    "COM-001 detenido por Dropify sin terminar en TI",
    "4 APIs pendientes (catálogo, órdenes, suppliers, dropshippers) con aval de Lucho, para Dropi Pulso",
  ],
  brands: [
    "Difícil conseguir usuarios de prueba para Emprendedores Plus (se requiere contrato directo Inter Rapidísimo/Coordinadora)",
    "Pendiente estrategia de migración técnica al nuevo perfil de Marcas",
    "API de comportamiento transaccional bloqueada por mismatch de user_id backend↔UserPilot",
  ],
  sellers: [
    "5 bugs críticos de Tienda Nube bloqueando retención — fixes pendientes de ejecución",
    "Page Pilot QA bloqueado esperando pruebas de TI",
    "Módulo de Notificaciones: diseño completo, requiere creación de proyecto nuevo en TI",
    "Dropify 2.0 · WooCommerce: entrega pactada 4-ago-2026",
  ],
  experience: [
    "Órdenes y Dropi Tester bloqueados por falta de developer asignado",
    "Búsqueda semántica: error 505 en Paraguay sin resolver",
    "QA del dashboard de indicadores: filtros y conteos inconsistentes",
  ],
  backoffice: [
    "8 frentes bloqueados (6 proyectos) sin actualización de TI hace 2+ semanas — riesgo directo sobre el OKR de consolidar operación multipaís",
    "Validación de Identidad (Sumsub): sin compromiso de recurso ni tiempos de TI",
    "Automatización de Conciliaciones: sin developer asignado",
    "2 correcciones de facturación (Chile, Ecuador) llevan 2+ semanas en QA sin resolución",
  ],
};

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

        <div style={{ maxWidth: 1000, margin: "0 auto", padding: "48px 24px" }}>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 32 }}>
            Vista de solo lectura del estado de cada célula: proyectos por etapa y sus pendientes más relevantes con TI.
          </p>

          {!celulas && <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
            {celulas?.map((c) => {
              const counts: Record<string, number> = {};
              for (const p of c.proyectos) {
                const key = p.handoff_status ?? "Sin estado";
                counts[key] = (counts[key] ?? 0) + 1;
              }
              const pendientes = PENDIENTES_TI[c.slug];

              return (
                <div key={c.id} style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 20, background: "var(--card)" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{c.nombre}</h2>
                    <a href={`/celula/${c.slug}`} style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>Ver →</a>
                  </div>
                  {c.lead && <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14 }}>Lead: {c.lead}</p>}

                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: pendientes ? 16 : 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--fg)", background: "var(--bg)", borderRadius: 999, padding: "3px 9px" }}>
                      {c.proyectos.length} proyecto{c.proyectos.length === 1 ? "" : "s"}
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

                  {pendientes && (
                    <div>
                      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 8 }}>
                        Pendientes con TI
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 16, display: "flex", flexDirection: "column", gap: 6 }}>
                        {pendientes.map((item, i) => (
                          <li key={i} style={{ fontSize: 12.5, color: "var(--fg)", lineHeight: 1.5 }}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
