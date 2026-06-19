"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const WEEK = "Semana 19–25 jun 2026";
const SUBTITLE = "Avances gerenciales · Proyectos activos · Dolores comerciales cerrados";

// ─── Tipos ────────────────────────────────────────────────────────────────────
type MetricGroup = { label: string; value: string; sub?: string; tooltip?: string };
type ProyectoMetricas = {
  base: MetricGroup[];
  meta: MetricGroup[];
  seguimiento: MetricGroup[];
};

type Oportunidad = {
  code: string;
  name: string;
  status: string;
  statusColor: string;
  color: string;
  mueve: string;
  hipotesis: string;
  gmv: string;
  avance: string;
  next: string;
  badge: string;
  badgeColor: string;
  metricas: ProyectoMetricas;
  ttvLive?: boolean;
};

// ─── Proyectos ────────────────────────────────────────────────────────────────
const oportunidades: Oportunidad[] = [
  {
    code: "CAT-001",
    name: "Categorización y enriquecimiento del catálogo",
    status: "🎯 Objetivo de célula · En definición",
    statusColor: "#7C3AED",
    color: "#7C3AED",
    mueve: "Habilita búsqueda, campañas, IA y catálogo",
    hipotesis: "Sin proyección directa — medir lift vs. control",
    gmv: "Habilitador estructural",
    avance: "Reunión de célula realizada. Todos aportaron a la problemática. Cada integrante se lleva la tarea de investigar y revisar propuestas de árbol de categorías.",
    next: "Próxima célula: cada miembro presenta su propuesta — se decide árbol de categorías oficial y se formaliza el proyecto",
    badge: "🔥 Esta semana",
    badgeColor: "#7C3AED",
    metricas: {
      base: [
        { label: "Estado hoy", value: "Sin árbol", sub: "Categorías no estandarizadas" },
        { label: "Catálogo total", value: "~1,08M", sub: "Productos vigentes plataforma" },
        { label: "Sin categoría válida", value: "Por medir", sub: "Pendiente inventario" },
      ],
      meta: [
        { label: "Árbol formal", value: "Aprobado", sub: "Próxima célula" },
        { label: "Cobertura", value: "> 80%", sub: "Catálogo categorizado" },
        { label: "Lift búsqueda", value: "Medir", sub: "vs. grupo control" },
      ],
      seguimiento: [
        { label: "Propuestas en célula", value: "Sí / No", sub: "Decisión tomada" },
        { label: "% categorizado", value: "Semana a semana", sub: "Tras implementación" },
        { label: "Lift conversión", value: "Con/sin categoría", sub: "Métrica de impacto" },
      ],
    },
  },
  {
    code: "DCA-001 + DCA-002",
    name: "Campañas de catálogo · Experimento activo",
    status: "🚀 Kickoff realizado · Fase de decisión",
    statusColor: "#0EA5E9",
    color: "#0EA5E9",
    mueve: "Órdenes + GMV por curaduría de catálogo y descuentos",
    hipotesis: "149.300–626.000 órdenes/año (base según fase)",
    gmv: "USD 2,24M–9,39M potencial",
    avance: "Kickoff realizado esta semana con el equipo. Experimento de campañas manuales activo. Plan de despliegue definido.",
    next: "Semana 26 jun: reunión con equipo — cada uno lleva insights → se decide qué campaña lanzar → inicio del despliegue",
    badge: "🚀 Kickoff hecho",
    badgeColor: "#0EA5E9",
    metricas: {
      base: [
        { label: "Campañas activas", value: "0", sub: "Experimento iniciando" },
        { label: "Productos en campaña", value: "0", sub: "Sin campañas formales aún" },
        { label: "GMV atribuido", value: "Sin dato", sub: "Sin baseline" },
      ],
      meta: [
        { label: "Primera campaña", value: "Lanzada", sub: "Semana 26 jun" },
        { label: "Hipótesis base", value: "149.300", sub: "Órdenes/año DCA-001" },
        { label: "GMV potencial", value: "USD 2,24M", sub: "Escenario estándar" },
      ],
      seguimiento: [
        { label: "CTR banner campaña", value: "% clics", sub: "vs. sin campaña" },
        { label: "Importaciones", value: "Por campaña", sub: "Dropshippers que importan" },
        { label: "Órdenes atribuidas", value: "GMV incremental", sub: "Métrica de negocio" },
      ],
    },
  },
  {
    code: "COM-001",
    name: "Combos · Integración end-to-end",
    status: "⚠️ En riesgo · Fecha TBD (2º cambio)",
    statusColor: "#D97706",
    color: "#D97706",
    mueve: "Canal Shopify completo con combos + carga masiva + CAS + ECOM Scanner",
    hipotesis: "Desbloqueador de canal — sin cifra directa de órdenes",
    gmv: "Habilita Shopify completo para suppliers con combos",
    avance: "Shopify: desarrollador terminó, en QA (contrato de variantes pendiente de resolver). Carga masiva: funcional. CAS: avanzando en paralelo. ECOM Scanner: en backlog. 2º cambio de fecha: 16 jun → 30 jun → TBD. José reporta probable miss.",
    next: "Definir fecha realista con José. Resolver contrato Shopify variantes (bloquea Dropify). Entregar contexto CAS. Priorizar ECOM Scanner en próximo sprint.",
    badge: "⚠️ En riesgo",
    badgeColor: "#D97706",
    metricas: {
      base: [
        { label: "Shopify (QA)", value: "En curso", sub: "Contrato variantes abierto", tooltip: "El desarrollador terminó la integración. Está en pruebas QA pero el contrato de variantes (qué envía Shopify de vuelta cuando se vende un combo variable) sigue sin resolver. Sin esto, Dropify queda bloqueado." },
        { label: "Carga masiva", value: "Funcional", sub: "C-12 / C-13 resueltas", tooltip: "La carga masiva de órdenes con combos ya funciona. Era el mayor bloqueante operativo del lado del dropshipper. Épicas C-12 y C-13 cerradas." },
        { label: "CAS", value: "Avanzando", sub: "Equipo paralelo", tooltip: "El equipo de CAS está trabajando en paralelo. Contexto entregado. HUs C-14 y C-15 en progreso." },
        { label: "ECOM Scanner", value: "Backlog", sub: "C-16 / C-17 pendientes", tooltip: "Las HUs del escáner de bodega (C-16 y C-17) están en backlog. Aún no han entrado a sprint." },
      ],
      meta: [
        { label: "HUs totales", value: "17", sub: "C-01 a C-17 definidas" },
        { label: "Épicas", value: "6", sub: "Shopify · Dropify · CM · CAS · ECOM" },
        { label: "Fecha objetivo", value: "TBD", sub: "2º cambio — a confirmar con José" },
      ],
      seguimiento: [
        { label: "HUs cerradas", value: "% avance", sub: "Por sprint" },
        { label: "Shopify variantes", value: "Resuelto / Abierto", sub: "Desbloqueador Dropify" },
        { label: "Frentes activos", value: "# de 6", sub: "Con avance real" },
      ],
    },
  },
  {
    code: "TTV-001",
    name: "Time to Value · Activación de suppliers",
    status: "⏳ Esperando implementación GHL",
    statusColor: "#10B981",
    color: "#10B981",
    mueve: "620 nuevos suppliers activos con catálogo visible",
    hipotesis: "~105.000 órdenes/año (revisado con datos CO)",
    gmv: "USD 1,57M base año 1 · USD 12,6M maduro (año 3)",
    avance: "Pipeline GHL definido (11 etapas). Hipótesis, KPIs y proyección documentados en el hub. Análisis de base real CO completado.",
    next: "Esperando integración técnica Dropi → GHL (Laura + Enrique). Al activar: iniciar pipeline de activación de 620 suppliers",
    badge: "⏳ Implementación",
    badgeColor: "#10B981",
    ttvLive: true,
    metricas: {
      base: [
        { label: "Registrados (Userpilot)", value: "…", sub: "Cargando datos reales", tooltip: "Total de suppliers con cuenta activa en Userpilot.\n\nFuente: tabla userpilot_suppliers en Supabase.\nSe carga en tiempo real cada vez que abres esta página." },
        { label: "Tasa de activación", value: "…", sub: "% con ≥1 orden", tooltip: "Porcentaje de suppliers registrados que han generado al menos 1 orden entregada en la plataforma.\n\nCálculo: suppliers con real_orders_delivered ≥ 1 ÷ total registrados × 100.\n\nFuente: campo real_orders_delivered en userpilot_suppliers." },
        { label: "Churn sesiones", value: "…", sub: "Sin actividad 15+ días", tooltip: "Porcentaje de suppliers sin actividad de sesión por más de 15 días.\n\nCálculo: (alto riesgo 15–30d + churn confirmado 30d+) ÷ total × 100.\n\nFecha de referencia: 25 de mayo 2026 (punto fijo en el sistema).\nEs decir: 27% no ha abierto la app desde antes del 10 de mayo." },
        { label: "Churn activación", value: "…", sub: "Sin orden a 30 días", tooltip: "Suppliers que no lograron consolidarse en la plataforma. Incluye 2 grupos:\n\nGrupo A · Sin arrancar: registrados y con 0 órdenes en toda su historia.\n\nGrupo B · Arrancaron pero pararon: generaron entre 1 y 5 órdenes y ya no están activos (sin actividad en los últimos 30 días).\n\nCálculo: (Grupo A + Grupo B) ÷ total × 100.\n\nFuentes: real_orders_delivered + es_activo_30d (Userpilot/Supabase)." },
      ],
      meta: [
        { label: "Suppliers meta", value: "620", sub: "Activados en 6 meses" },
        { label: "TTA objetivo", value: "≤ 5 días", sub: "Registro → activo" },
        { label: "Primera orden", value: "≤ 20 días", sub: "Desde registro" },
        { label: "Órdenes/año base", value: "~105.000", sub: "Escenario base revisado" },
      ],
      seguimiento: [
        { label: "TTA real", value: "Días prom.", sub: "Registro → activo" },
        { label: "SLA auditoría", value: "< 12h", sub: "Para prioridad alta" },
        { label: "Suppliers con 1ª orden", value: "Acumulado", sub: "Semana a semana" },
        { label: "Churn cohorte", value: "% sin orden 30d", sub: "Nuevos activados" },
      ],
    },
  },
  {
    code: "NEG-001",
    name: "Negociaciones · Suppliers y Líderes de Comunidad",
    status: "📦 Handoff a comercial · Lanzamiento 6-jul",
    statusColor: "#F77F00",
    color: "#F77F00",
    mueve: "Negociaciones formalizadas → comisiones acordadas → GMV",
    hipotesis: "Métricas: negociaciones creadas, activas, acordadas / semana",
    gmv: "Palanca de crecimiento comercial — sin proyección inicial",
    avance: "Handoff formal realizado hoy. Bloqueante Emilille resuelto: reporte de comisiones descargable desde historial de cartera. Comunicación lista.",
    next: "19 jun–6 jul: piloto con 5 comunidades top (Emilille). 6 jul: lanzamiento masivo con comunicación formal.",
    badge: "📦 Handoff hoy",
    badgeColor: "#F77F00",
    metricas: {
      base: [
        { label: "Ingresos al módulo", value: "131", sub: "Semana 1 (sin comunicación)" },
        { label: "Negociaciones reales", value: "1", sub: "Usuarios únicos sem 1" },
        { label: "Conversión funnel", value: "0.76%", sub: "Entrada → negociación creada" },
        { label: "Notas registradas", value: "279", sub: "Alta actividad en seguimiento" },
      ],
      meta: [
        { label: "Negociaciones/semana", value: "Por definir", sub: "Tras piloto 5 comunidades" },
        { label: "Líderes activos", value: "≥ 5", sub: "Piloto hasta 6-jul" },
        { label: "Lanzamiento masivo", value: "6 jul", sub: "Comunicación formal lista" },
      ],
      seguimiento: [
        { label: "Negociaciones creadas", value: "Semanal", sub: "Métrica principal" },
        { label: "Negociaciones activas", value: "Acumulado", sub: "En curso" },
        { label: "Acordadas / cerradas", value: "Resultado", sub: "Negocio real" },
        { label: "Líderes con ≥1 neg.", value: "Penetración", sub: "De la herramienta" },
      ],
    },
  },
  {
    code: "CAZ-001",
    name: "Caza Productos + Búsqueda Semántica",
    status: "🔍 Oportunidad · Discovery pendiente",
    statusColor: "#EC4899",
    color: "#EC4899",
    mueve: "Demanda real → productos activados → órdenes",
    hipotesis: "54.000 órdenes/año con semántica activa",
    gmv: "USD 810K base · USD 1,62M alto",
    avance: "Oportunidad validada. Búsqueda semántica confirmada como inexistente hoy (José, jun 2026). Pendiente de priorización formal.",
    next: "Abordar en sprint posterior. No compromete desarrollo aún — requiere instrumentación primero.",
    badge: "⏸ Posterior",
    badgeColor: "#EC4899",
    metricas: {
      base: [
        { label: "Búsqueda semántica", value: "No existe", sub: "Confirmado — sin dato" },
        { label: "Queries capturadas", value: "0", sub: "Sin instrumentación" },
        { label: "Demanda explícita", value: "Sin medir", sub: "Caza productos pendiente" },
      ],
      meta: [
        { label: "Órdenes/año base", value: "54.000", sub: "Con semántica activa" },
        { label: "GMV base", value: "USD 810K", sub: "Escenario conservador" },
        { label: "GMV alto", value: "USD 1,62M", sub: "Escenario agresivo" },
      ],
      seguimiento: [
        { label: "Queries capturadas", value: "Por instrumentar", sub: "Fase 1 discovery" },
        { label: "Suppliers activados", value: "Por demanda", sub: "Tras instrumentación" },
        { label: "Órdenes atribuidas", value: "Métrica de impacto", sub: "Búsqueda → orden" },
      ],
    },
  },
];

// ─── Dolores ──────────────────────────────────────────────────────────────────
const dolores = [
  {
    frente: "Trazabilidad del ciclo de orden",
    tag: "📁 Proyecto identificado",
    tagColor: "#7C3AED",
    salio: "360.000 cancelaciones/mes · 40.000 pendientes confirmación aprox.",
    accionables: "Motivo de cancelación en reporte, visual al proveedor sobre pendiente, revisar ventana 15 días, alinear con logística.",
    ruta: "Logística — montar como proyecto formal",
    rutaColor: "#7C3AED",
    metrica: "Cancelaciones por motivo, por stock, órdenes en pendiente.",
    decision: "Definido como proyecto. Pasa a Logística para formalización y roadmap.",
  },
  {
    frente: "Disponibilidad real de proveedor",
    tag: "→ Indexar a TTV-001",
    tagColor: "#10B981",
    salio: "Modo vacaciones, pausas por bodega, productos privatizados sin trazabilidad.",
    accionables: "Modo vacaciones; pausa por bodega; checklist previo; medir privatizados.",
    ruta: "TTV-001 · Checklist de activación / pipeline GHL",
    rutaColor: "#10B981",
    metrica: "Proveedores en pausa, órdenes durante pausa.",
    decision: "Se indexa a TTV-001 como regla operativa del checklist de activación.",
  },
  {
    frente: "Descubrimiento de proveedores confiables",
    tag: "→ Indexar a CAT-001",
    tagColor: "#7C3AED",
    salio: "Banner actual no comunica bien exclusivos; 35 proveedores exclusivos sin visibilidad.",
    accionables: "Mejorar banner; logo visible; copy 'proveedores exclusivos'; flecha de regreso.",
    ruta: "CAT-001 · Señal de confianza en taxonomía / vitrina",
    rutaColor: "#7C3AED",
    metrica: "Impresiones, CTR, clics a proveedor, órdenes atribuidas.",
    decision: "Se indexa a CAT-001 como señal de calidad/confianza en la categorización.",
  },
  {
    frente: "Garantías con recolección",
    tag: "Back Office / Data",
    tagColor: "#F77F00",
    salio: "Proveedor no ve costo de recolección; flete puede hacer no rentable la garantía.",
    accionables: "Mostrar costo de flete en reporte; cruzar costo logístico vs. valor producto.",
    ruta: "Back Office / Data — quick win sin desarrollo",
    rutaColor: "#F77F00",
    metrica: "Garantías con recolección, costo promedio, casos donde flete supera margen.",
    decision: "Quick win de información financiera. No proyecto grande.",
  },
  {
    frente: "Señales de capacitación / certificación",
    tag: "→ Indexar a CAT-001",
    tagColor: "#7C3AED",
    salio: "Insignia Dropi Academy para proveedores que completan proceso educativo.",
    accionables: "Criterio 100%; dónde se muestra; impacto en selección.",
    ruta: "CAT-001 · Señal de calidad en taxonomía",
    rutaColor: "#7C3AED",
    metrica: "Proveedores certificados, clics, órdenes, tasa de entrega.",
    decision: "Se indexa a CAT-001 como señal de calidad/confianza.",
  },
  {
    frente: "MVP de campañas",
    tag: "→ Indexado a DCA-001",
    tagColor: "#0EA5E9",
    salio: "Banner que filtre productos de campaña sin depender del buscador.",
    accionables: "Banner; agrupación por tag/categoría/IDs; botón con filtro automático.",
    ruta: "DCA-001 · Catálogos preseleccionados F1",
    rutaColor: "#0EA5E9",
    metrica: "Clics banner, productos vistos, importaciones, órdenes, GMV por campaña.",
    decision: "Ya indexado. Parte de la fase 1 de Catálogos preseleccionados.",
  },
];

// ─── Componente principal ──────────────────────────────────────────────────────
export default function WeeklyPage() {
  const [ttvData, setTtvData] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/metrics/behavior?country=ALL")
      .then((r) => r.json())
      .then((d) => {
        const stats = d?.stats || {};
        const funnel: { count: number }[] = d?.funnel || [];
        const total = stats.totalSuppliers ?? funnel[0]?.count ?? 0;
        const conOrden = funnel[2]?.count ?? 0;
        const activationRate = total > 0 ? ((conOrden / total) * 100).toFixed(1) : "–";
        const churnSesiones = stats.churnRate != null ? `${stats.churnRate}%` : "–";
        const churnActivacion = stats.activationChurnRate != null ? `${stats.activationChurnRate}%` : "–";
        setTtvData({
          registrados: total.toLocaleString("es-CO"),
          activacion: `${activationRate}%`,
          sesiones: stats.avgSessions != null ? stats.avgSessions.toFixed(1) : "–",
          churnSesiones,
          churnActivacion,
        });
      })
      .catch(() => {});
  }, []);

  // Inyectar datos live en TTV
  const proyectos = oportunidades.map((op) => {
    if (!op.ttvLive || Object.keys(ttvData).length === 0) return op;
    return {
      ...op,
      metricas: {
        ...op.metricas,
        base: [
          { label: "Registrados (Userpilot)", value: ttvData.registrados, sub: "Total en plataforma", tooltip: "Total de suppliers con cuenta activa en Userpilot.\n\nFuente: tabla userpilot_suppliers en Supabase.\nSe carga en tiempo real cada vez que abres esta página." },
          { label: "Tasa de activación", value: ttvData.activacion, sub: "% con ≥1 orden", tooltip: "Porcentaje de suppliers registrados que han generado al menos 1 orden entregada en la plataforma.\n\nCálculo: suppliers con real_orders_delivered ≥ 1 ÷ total registrados × 100.\n\nFuente: campo real_orders_delivered en userpilot_suppliers." },
          { label: "Churn sesiones", value: ttvData.churnSesiones, sub: "Sin actividad 15+ días", tooltip: "Porcentaje de suppliers sin actividad de sesión por más de 15 días.\n\nCálculo: (alto riesgo 15–30d + churn confirmado 30d+) ÷ total × 100.\n\nFecha de referencia: 25 de mayo 2026 (punto fijo en el sistema).\nEs decir: este % no ha abierto la app desde antes del 10 de mayo." },
          { label: "Churn activación", value: ttvData.churnActivacion, sub: "Sin orden a 30 días", tooltip: "Suppliers que no lograron consolidarse en la plataforma. Incluye 2 grupos:\n\nGrupo A · Sin arrancar: registrados y con 0 órdenes en toda su historia.\n\nGrupo B · Arrancaron pero pararon: generaron entre 1 y 5 órdenes y ya no están activos (sin actividad en los últimos 30 días).\n\nCálculo: (Grupo A + Grupo B) ÷ total × 100.\n\nFuentes: real_orders_delivered + es_activo_30d (Userpilot/Supabase)." },
        ],
      },
    };
  });

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Weekly · Supplier Success</span>
        <span style={{
          marginLeft: "auto", fontSize: 11, fontWeight: 700,
          background: "#FFF3E0", color: "#C05600", padding: "4px 10px", borderRadius: 999,
        }}>{WEEK}</span>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #111827 0%, #1f2937 55%, #c2410c 100%)",
          borderRadius: 20, padding: "40px", marginBottom: 28, color: "#fff",
        }}>
          <div style={{
            display: "inline-flex", background: "rgba(255,255,255,0.12)",
            borderRadius: 999, padding: "6px 14px", fontSize: 12, fontWeight: 700, marginBottom: 16,
          }}>
            Avances gerenciales · Semana 19–25 jun
          </div>
          <h1 style={{
            fontSize: "clamp(26px,4vw,42px)", fontWeight: 900,
            letterSpacing: "-0.04em", lineHeight: 1.05, margin: "0 0 14px",
          }}>
            Proyectos en movimiento<br />+ Dolores comerciales indexados
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, margin: 0 }}>{SUBTITLE}</p>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12, marginTop: 28,
          }}>
            {[
              { label: "Kickoff esta semana", value: "DCA", sub: "Campañas catálogo" },
              { label: "Handoff realizado", value: "NEG", sub: "A comercial hoy" },
              { label: "Objetivo de célula", value: "CAT", sub: "Categorización" },
              { label: "Esperando impl.", value: "TTV", sub: "Pipeline GHL" },
              { label: "En riesgo · 2º cambio", value: "COM", sub: "Fecha TBD" },
              { label: "Lanzamiento formal", value: "6-jul", sub: "NEG-001 masivo" },
            ].map((m) => (
              <div key={m.label} style={{
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.10)",
                borderRadius: 14, padding: "14px 16px",
              }}>
                <span style={{ display: "block", color: "rgba(255,255,255,0.68)", fontSize: 11, fontWeight: 800 }}>{m.label}</span>
                <strong style={{ display: "block", fontSize: 26, letterSpacing: "-0.04em", marginTop: 4 }}>{m.value}</strong>
                <small style={{ display: "block", color: "rgba(255,255,255,0.72)", fontSize: 11, fontWeight: 700, marginTop: 2 }}>{m.sub}</small>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sección 1: Proyectos ── */}
        <Section title="1. Proyectos activos · avances y métricas" badge="Gerencial"
          sub="Estado, avance semanal y métricas base / objetivo / seguimiento por proyecto.">
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {proyectos.map((op) => (
              <div key={op.code} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderLeft: `4px solid ${op.color}`, borderRadius: 14,
              }}>
                {/* Fila superior: identidad + avance + siguiente */}
                <div style={{
                  display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                  gap: 16, padding: "18px 20px", alignItems: "start",
                }}>
                  {/* Col 1 */}
                  <div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
                      <span style={{
                        fontSize: 11, fontWeight: 800,
                        background: `${op.color}18`, color: op.color,
                        padding: "3px 9px", borderRadius: 999,
                      }}>{op.code}</span>
                      <span style={{
                        fontSize: 10, fontWeight: 700,
                        background: `${op.badgeColor}18`, color: op.badgeColor,
                        padding: "2px 7px", borderRadius: 999,
                      }}>{op.badge}</span>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6, lineHeight: 1.3 }}>{op.name}</div>
                    <div style={{ fontSize: 11, color: "var(--muted)", fontWeight: 600 }}>{op.status}</div>
                  </div>
                  {/* Col 2 */}
                  <div>
                    <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Avance esta semana</div>
                    <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5, marginBottom: 10 }}>{op.avance}</div>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      {[{ l: "Mueve", v: op.mueve }, { l: "Hipótesis", v: op.hipotesis }].map(m => (
                        <div key={m.l} style={{
                          background: "#F8FAFC", border: "1px solid var(--border)",
                          borderRadius: 8, padding: "6px 10px", flex: "1 1 120px",
                        }}>
                          <div style={{ fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.l}</div>
                          <div style={{ fontSize: 11, fontWeight: 600, color: "var(--fg)", marginTop: 3, lineHeight: 1.3 }}>{m.v}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Col 3 */}
                  <div style={{
                    background: `${op.color}0d`, border: `1px solid ${op.color}30`,
                    borderRadius: 10, padding: "12px 14px",
                  }}>
                    <div style={{ fontSize: 10, fontWeight: 800, color: op.color, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>Siguiente paso</div>
                    <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.5 }}>{op.next}</div>
                  </div>
                </div>

                {/* Franja de métricas */}
                <div style={{
                  borderTop: "1px solid var(--border)",
                  background: "#FAFBFC",
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  borderRadius: "0 0 14px 14px",
                  overflow: "hidden",
                }}>
                  {[
                    { grupo: "Base · AS-IS hoy", items: op.metricas.base, color: "#6B7280", bg: "#F3F4F6" },
                    { grupo: "Meta · Objetivo", items: op.metricas.meta, color: op.color, bg: `${op.color}0a` },
                    { grupo: "Seguimiento · Qué medimos", items: op.metricas.seguimiento, color: "#374151", bg: "#fff" },
                  ].map((g, gi) => (
                    <div key={g.grupo} style={{
                      padding: "14px 16px",
                      borderLeft: gi > 0 ? "1px solid var(--border)" : "none",
                      background: g.bg,
                      position: "relative",
                      overflow: "visible",
                    }}>
                      <div style={{
                        fontSize: 10, fontWeight: 800, textTransform: "uppercase",
                        letterSpacing: "0.07em", color: g.color, marginBottom: 10,
                      }}>{g.grupo}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                        {g.items.map((m) => (
                          <div key={m.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}>
                            <span style={{ fontSize: 11, color: "#6B7280", flexShrink: 0, display: "flex", alignItems: "center" }}>
                              {m.label}
                              {m.tooltip && <MetricTooltip text={m.tooltip} />}
                            </span>
                            <div style={{ textAlign: "right" }}>
                              <span style={{ fontSize: 12, fontWeight: 700, color: gi === 1 ? g.color : "var(--fg)" }}>{m.value}</span>
                              {m.sub && <div style={{ fontSize: 10, color: "#9CA3AF" }}>{m.sub}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Sección 2: Dolores ── */}
        <Section title="2. Dolores de Comercial · indexados y cerrados" badge="Clasificados"
          sub="Cada dolor queda indexado a un proyecto existente o a una ruta concreta.">
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", minWidth: 800 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Frente / dolor", "Qué salió", "Ruta definida", "Métrica", "Decisión"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 14px", textAlign: "left",
                      fontSize: 11, fontWeight: 700, color: "#6B7280",
                      textTransform: "uppercase", letterSpacing: "0.04em",
                      borderBottom: "1px solid var(--border)",
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dolores.map((d, i) => (
                  <tr key={i} style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "14px", verticalAlign: "top", minWidth: 160 }}>
                      <strong style={{ fontSize: 13, color: "var(--fg)", display: "block", marginBottom: 6 }}>{d.frente}</strong>
                      <span style={{
                        fontSize: 10, fontWeight: 800,
                        background: `${d.tagColor}15`, color: d.tagColor,
                        padding: "3px 8px", borderRadius: 999,
                      }}>{d.tag}</span>
                    </td>
                    <td style={{ padding: "14px", fontSize: 12, color: "var(--muted)", verticalAlign: "top", minWidth: 180 }}>{d.salio}</td>
                    <td style={{ padding: "14px", verticalAlign: "top", minWidth: 160 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: `${d.rutaColor}15`, color: d.rutaColor,
                        padding: "4px 9px", borderRadius: 999, display: "inline-block",
                      }}>{d.ruta}</span>
                    </td>
                    <td style={{ padding: "14px", fontSize: 12, color: "var(--muted)", verticalAlign: "top", minWidth: 160 }}>{d.metrica}</td>
                    <td style={{ padding: "14px", fontSize: 12, color: "var(--fg)", fontWeight: 600, verticalAlign: "top", minWidth: 160 }}>{d.decision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Section>

        {/* ── Sección 3: Resumen ejecutivo ── */}
        <Section title="3. Resumen ejecutivo" badge="Cierre">
          <div style={{
            borderLeft: "4px solid var(--dropi)", background: "#FFFBF5",
            borderRadius: "0 14px 14px 0", padding: "20px 24px",
            fontSize: 14, color: "#374151", lineHeight: 1.7,
          }}>
            Esta semana la célula movió en varios frentes simultáneos. <strong>Categorización</strong> pasó de ser una iniciativa técnica a un objetivo formal de célula: se realizó la reunión de alineación y cada integrante lleva la tarea de investigar propuestas de árbol de categorías para decidirlo en la próxima sesión. <strong>Campañas / Catálogo</strong> (DCA-001 y DCA-002) tuvo kickoff esta semana; la próxima se decide qué campaña lanzar y arranca el despliegue. <strong>Negociaciones</strong> cierra su fase de producto hoy con handoff formal a comercial: el último bloqueante está resuelto, el piloto puede iniciar ya con las 5 comunidades top y el lanzamiento masivo está fechado el 6 de julio. <strong>Time to Value</strong> tiene toda la documentación, hipótesis y proyección revisada con datos reales de CO — esperamos la implementación técnica del pipeline GHL para activar. Los dolores de comercial quedan cerrados: cada uno indexado a un proyecto existente o ruta concreta.
          </div>
        </Section>

        {/* ── Sección 4: Próximos pasos ── */}
        <Section title="4. Próximos pasos" badge="Secuencia">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {[
              {
                titulo: "Esta semana",
                color: "#F77F00",
                items: [
                  "Emilille: arrancar piloto con 5 comunidades top (NEG-001)",
                  "Jaime: activar micro-survey Happiness en UserPilot",
                  "Equipo: preparar insights para reunión DCA semana 26 jun",
                  "Laura + Enrique: integración Dropi → GHL (TTV-001)",
                ],
              },
              {
                titulo: "Próxima célula",
                color: "#7C3AED",
                items: [
                  "Cada integrante presenta propuesta árbol de categorías (CAT-001)",
                  "Decisión formal: árbol que se va a implementar",
                  "Reunión DCA: decidir campaña a lanzar → inicio despliegue",
                  "Seguimiento semana 2 Bitácora NEG-001",
                ],
              },
              {
                titulo: "6 de julio",
                color: "#10B981",
                items: [
                  "Lanzamiento formal NEG-001: comunicación masiva",
                  "Revisión métricas semana 3 de Negociaciones",
                  "Estado de implementación GHL (TTV-001)",
                ],
              },
            ].map((p) => (
              <div key={p.titulo} style={{
                background: "#fff", border: "1px solid var(--border)",
                borderTop: `4px solid ${p.color}`, borderRadius: 14, padding: 18,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: "0 0 12px" }}>{p.titulo}</h3>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {p.items.map((it) => (
                    <li key={it} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, lineHeight: 1.4 }}>{it}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        <p style={{ fontSize: 12, color: "var(--muted)", textAlign: "center", marginTop: 32 }}>
          Dropi · Supplier Success · {WEEK}
        </p>
      </div>
    </main>
  );
}

function MetricTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, above: true });
  const ref = useRef<HTMLSpanElement>(null);

  const handleEnter = () => {
    if (ref.current) {
      const r = ref.current.getBoundingClientRect();
      const above = r.top > 220;
      setPos({
        top: above ? r.top - 8 : r.bottom + 8,
        left: Math.min(Math.max(r.left + r.width / 2, 160), window.innerWidth - 160),
        above,
      });
    }
    setOpen(true);
  };

  const tooltip = open && typeof document !== "undefined" ? createPortal(
    <div style={{
      position: "fixed",
      top: pos.above ? pos.top : pos.top,
      left: pos.left,
      transform: pos.above ? "translate(-50%, -100%)" : "translate(-50%, 0)",
      background: "#1F2937", color: "#F9FAFB",
      borderRadius: 12, padding: "12px 16px",
      fontSize: 11.5, lineHeight: 1.7,
      width: 300, zIndex: 9999,
      boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
      whiteSpace: "pre-wrap",
      pointerEvents: "none",
    }}>
      {text}
      <div style={{
        position: "absolute",
        ...(pos.above
          ? { top: "100%", borderTop: "7px solid #1F2937", borderBottom: "none" }
          : { bottom: "100%", borderBottom: "7px solid #1F2937", borderTop: "none" }),
        left: "50%", transform: "translateX(-50%)",
        width: 0, height: 0,
        borderLeft: "7px solid transparent",
        borderRight: "7px solid transparent",
      }} />
    </div>,
    document.body
  ) : null;

  return (
    <span
      ref={ref}
      style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 4 }}
      onMouseEnter={handleEnter}
      onMouseLeave={() => setOpen(false)}
    >
      <span style={{
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        width: 14, height: 14, borderRadius: "50%",
        background: "#E5E7EB", color: "#6B7280",
        fontSize: 9, fontWeight: 800, cursor: "help", flexShrink: 0,
      }}>i</span>
      {tooltip}
    </span>
  );
}

function Section({ title, badge, sub, children }: {
  title: string; badge?: string; sub?: string; children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff", border: "1px solid var(--border)",
      borderRadius: 18, padding: 24, marginBottom: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>{title}</h2>
          {sub && <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{sub}</p>}
        </div>
        {badge && (
          <span style={{
            fontSize: 11, fontWeight: 700, background: "#FFF3E0", color: "#C05600",
            padding: "5px 12px", borderRadius: 999, whiteSpace: "nowrap",
          }}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
}
