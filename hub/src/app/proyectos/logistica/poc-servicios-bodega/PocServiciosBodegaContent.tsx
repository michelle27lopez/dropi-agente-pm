"use client";

import { useState, useEffect, useRef } from "react";
import {
  Card,
  Pill,
  Stat,
  SectionTitle,
  Table,
  DataList,
  type Column,
} from "@/app/proyectos/logistica/_components/ui";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

type Servicio = {
  nombre: string;
  formula: string;
  estimadoMes: string;
  confianza: "Alta" | "Media" | "Baja";
};

const servicios: Servicio[] = [
  {
    nombre: "Almacenamiento",
    formula: "ubicaciones x tarifa/ubicacion",
    estimadoMes: "$62K MXN",
    confianza: "Alta",
  },
  {
    nombre: "Etiquetado",
    formula: "cantidad etiquetas x $200",
    estimadoMes: "Por estimar",
    confianza: "Media",
  },
  {
    nombre: "Armado de kits",
    formula: "kits con >3 pasos x $300",
    estimadoMes: "Por estimar",
    confianza: "Baja",
  },
  {
    nombre: "Recepcion",
    formula: "tarifa fija por tipo de vehiculo",
    estimadoMes: "$140K-$350K",
    confianza: "Alta",
  },
  {
    nombre: "Multi-unidad",
    formula: "ordenes con >1 unidad x recargo",
    estimadoMes: "Sin data",
    confianza: "Baja",
  },
];

const colsServicios: Column<Servicio>[] = [
  { key: "nombre", header: "Servicio", render: (r) => <strong>{r.nombre}</strong> },
  {
    key: "formula",
    header: "Formula",
    render: (r) => <span style={{ fontFamily: "var(--mono)", fontSize: "var(--fs-label)" }}>{r.formula}</span>,
  },
  { key: "estimado", header: "Estimado/mes", align: "right", render: (r) => r.estimadoMes },
  {
    key: "confianza",
    header: "Confianza",
    render: (r) => (
      <Pill tone={r.confianza === "Alta" ? "ok" : r.confianza === "Media" ? "warn" : "risk"}>
        {r.confianza}
      </Pill>
    ),
  },
];

type Riesgo = {
  id: string;
  titulo: string;
  detalle: string;
  tone: "risk" | "warn" | "info";
};

const riesgos: Riesgo[] = [
  { id: "R1", titulo: "Resistencia del proveedor al cobro", detalle: "Proveedores pueden migrar a bodegas propias o competencia si perciben los cobros como injustos o excesivos. Requiere comunicacion gradual y propuesta de valor clara.", tone: "risk" },
  { id: "R2", titulo: "Data de multi-unidad inexistente", detalle: "El recargo por ordenes con mas de una unidad depende de data transaccional que hoy maneja otra celula. No hay acceso directo.", tone: "warn" },
  { id: "R3", titulo: "Tarifas diferenciadas por pais", detalle: "Los 12 paises tienen estructuras de costos distintas. Lanzar con tarifa unica puede generar margenes negativos en algunos mercados.", tone: "warn" },
  { id: "R4", titulo: "Doble cobro por superposicion", detalle: "La tarifa base por orden ($2,800) ya se cobra desde el core. Si los nuevos cobros no se desligan claramente, el proveedor percibe doble cobro.", tone: "warn" },
  { id: "R5", titulo: "Excel perpetuo como fuente", detalle: "Almacenamiento depende de un Excel mensual operativo. Si no se automatiza la ingesta, el cobro queda atado a un proceso manual fragil.", tone: "warn" },
  { id: "R6", titulo: "Adopcion de facturacion electronica", detalle: "La facturacion de estos servicios requiere integracion con el sistema contable de cada pais. Puede retrasar el go-live en mercados regulados.", tone: "info" },
  { id: "R7", titulo: "Descuento sin metrica de retencion", detalle: "Si se ofrecen descuentos por volumen para mitigar R1, no hay metrica clara para medir si el descuento retiene o solo reduce margen.", tone: "info" },
  { id: "R8", titulo: "Mora sin politica definida", detalle: "No existe politica de mora para servicios de bodega. Un proveedor que no paga almacenamiento sigue usando el espacio.", tone: "info" },
];

type Fase = {
  nombre: string;
  contenido: string;
  servicios: string;
  duracion: string;
  tone: "ok" | "warn" | "info" | "risk";
};

const fases: Fase[] = [
  { nombre: "Fase 1 — MVP", contenido: "Almacenamiento + Recepcion", servicios: "Los dos servicios con data y formula confirmada. Se pueden cobrar ya.", duracion: "2-3 semanas", tone: "ok" },
  { nombre: "Fase 2 — Etiquetado + Kits", contenido: "Cuando se defina fuente de conteo", servicios: "Requiere definir quien genera el conteo de etiquetas y el criterio de complejidad de kits.", duracion: "Por definir", tone: "warn" },
  { nombre: "Fase 3 — Multi-unidad", contenido: "Requiere integracion con BD de ordenes", servicios: "Depende de acceso a data transaccional de otra celula. No debe bloquear Fases 1 y 2.", duracion: "Por definir", tone: "warn" },
  { nombre: "Fase 4 — Dashboard P&L", contenido: "Automatizacion StockPro + dashboard", servicios: "Consolidar todos los servicios en un dashboard de P&L por proveedor con automatizacion de la ingesta.", duracion: "Por definir", tone: "info" },
];

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

type Tab = "alcance" | "metricas" | "leakage" | "servicios" | "riesgos";

const TABS: { key: Tab; label: string }[] = [
  { key: "alcance", label: "Alcance" },
  { key: "metricas", label: "Métricas de éxito" },
  { key: "leakage", label: "Revenue leakage" },
  { key: "servicios", label: "Servicio por servicio" },
  { key: "riesgos", label: "Riesgos y roadmap" },
];

// ---------------------------------------------------------------------------
// Tab contents
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Alcance homologado
// ---------------------------------------------------------------------------

type AlcanceItem = { concepto: string; detalle: string };

const DENTRO: AlcanceItem[] = [
  { concepto: "Nombre", detalle: '"Servicios en Bodega" (nunca "Fulfillment")' },
  { concepto: "5 servicios", detalle: "Almacenamiento, Kits, Recepción, Etiquetado, Multi-unidad (F4)" },
  { concepto: "Contratos", detalle: "Campo editable contract_status por proveedor (firmado/pendiente/rechazado). Sin validación legal automática" },
  { concepto: "4 roles", detalle: "Logística (Alexis), Facturación (Camila), Admin (Jorge/Andrés), Comercial (por definir)" },
  { concepto: "Import Excel", detalle: "Wizard 4 pasos con validación Zod, preview, país/periodo" },
  { concepto: "Motor cálculo", detalle: "calculateBreakdown() sin sumando base fulfillment" },
  { concepto: "Auditoría", detalle: "Triggers en DB: log_charge_status_change, check_supplier_contract" },
  { concepto: "Bloqueo por deuda", detalle: "Política implementada en schema" },
];

const FUERA: { concepto: string; razon: string }[] = [
  { concepto: "Tarifa base fulfillment $2,800/orden", razon: "Ya se cobra desde core Dropi" },
  { concepto: "Descuento por volumen", razon: "Eliminado — no aplica" },
  { concepto: "Validación legal de contratos", razon: "Solo campo editable, sin bloqueo automático" },
  { concepto: "TARIFA_BASE_ORDEN, calcFulfillmentBase", razon: "Removidos del código" },
];

const colsDentro: Column<AlcanceItem>[] = [
  { key: "concepto", header: "Concepto", render: (r) => <strong>{r.concepto}</strong> },
  { key: "detalle", header: "Detalle", render: (r) => r.detalle },
];

const colsFuera: Column<{ concepto: string; razon: string }>[] = [
  { key: "concepto", header: "Concepto", render: (r) => <strong>{r.concepto}</strong> },
  { key: "razon", header: "Razón", render: (r) => r.razon },
];

function TabAlcance() {
  return (
    <>
      <SectionTitle hint="Lo que entra en la plataforma de Servicios en Bodega">
        DENTRO (homologado)
      </SectionTitle>
      <Card tone="ok">
        <Table columns={colsDentro} rows={DENTRO} getKey={(r) => r.concepto} />
      </Card>

      <SectionTitle hint="Lo que queda explícitamente fuera del alcance">
        FUERA (eliminado)
      </SectionTitle>
      <Card tone="risk">
        <Table columns={colsFuera} rows={FUERA} getKey={(r) => r.concepto} />
      </Card>

      <Card tone="warn">
        <p style={{ margin: 0, lineHeight: 1.6 }}>
          <strong>Regla de naming:</strong> esta herramienta se llama &quot;Servicios en Bodega&quot;, nunca
          &quot;Fulfillment&quot;. Llamarla fulfillment causa confusión con el cobro base por orden que ya
          existe en el core de Dropi. El proveedor necesita entender que se le cobra por servicios
          específicos que su inventario consume en bodega, no por fulfillment general.
        </p>
      </Card>
    </>
  );
}

// ---------------------------------------------------------------------------
// Métricas de éxito del experimento
// ---------------------------------------------------------------------------

const KPIS = [
  { label: "Tasa de cobro exitoso", value: "85%+", pct: 85, color: "#22c77e", ringColor: "#22c77e" },
  { label: "Tiempo promedio de cobro", value: "<15 días", pct: 62, color: "#e8a020", ringColor: "#e8a020" },
  { label: "Proveedores en mora >60d", value: "<5%", pct: 95, color: "#22c77e", ringColor: "#22c77e" },
  { label: "Países cubiertos (6 meses)", value: "100%", pct: 100, color: "#22c77e", ringColor: "#22c77e" },
];

const CIRC = 2 * Math.PI * 40; // 251.33

const METRICAS_CSS = `
.mk-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin: 0 0 24px; }
.mk-tile { background: var(--card, #fff); border: 1px solid var(--border); border-radius: 14px;
  padding: 24px 16px; text-align: center; transition: transform 0.2s, box-shadow 0.2s; cursor: default; }
.mk-tile:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
.mk-svg { width: 110px; height: 110px; margin: 0 auto 12px; display: block; }
.mk-track { fill: none; stroke: var(--border); stroke-width: 6; }
.mk-ring { fill: none; stroke-width: 6; stroke-linecap: round; transform-origin: center;
  transform: rotate(-90deg); transition: stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1); }
.mk-num { font-size: 22px; font-weight: 800; font-variant-numeric: tabular-nums; }
.mk-label { font-size: 11px; color: var(--muted); margin-top: 4px; line-height: 1.3; text-transform: uppercase;
  letter-spacing: 0.03em; font-weight: 600; }
.mk-phase { background: var(--card, #fff); border: 1px solid var(--border); border-radius: 14px;
  padding: 20px; transition: transform 0.15s, box-shadow 0.15s; cursor: default; }
.mk-phase:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,0.06); }
.mk-phase-head { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.mk-phase-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
.mk-phase-title { font-size: 14px; font-weight: 700; color: var(--fg); }
.mk-phase li { margin-bottom: 6px; font-size: 13px; color: var(--muted); line-height: 1.5; }
.mk-phase li strong { color: var(--fg); }
.mk-north { background: linear-gradient(135deg, rgba(247,127,0,0.08) 0%, rgba(247,127,0,0.02) 100%);
  border: 2px solid var(--brand, #F77F00); border-radius: 14px; padding: 20px 24px;
  animation: mk-pulse 3s ease-in-out infinite; }
@keyframes mk-pulse { 0%,100% { box-shadow: 0 0 0 0 rgba(247,127,0,0.15); } 50% { box-shadow: 0 0 0 8px rgba(247,127,0,0); } }
.mk-north-title { font-size: 14px; font-weight: 700; color: var(--brand, #F77F00); margin-bottom: 6px; }
.mk-north p { margin: 0; color: var(--muted); line-height: 1.6; font-size: 13px; }
@media (max-width: 700px) { .mk-grid { grid-template-columns: repeat(2, 1fr); } }
`;

function TabMetricas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.querySelectorAll<SVGCircleElement>(".mk-ring").forEach((r) => {
        r.style.strokeDashoffset = r.dataset.target!;
      });
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref}>
      <style>{METRICAS_CSS}</style>

      <SectionTitle hint="Cómo saber si la herramienta está funcionando y moviendo el P&L">
        Métricas de éxito del experimento
      </SectionTitle>

      {/* Donut KPIs */}
      <div className="mk-grid">
        {KPIS.map((k) => {
          const offset = CIRC * (1 - k.pct / 100);
          return (
            <div key={k.label} className="mk-tile">
              <svg className="mk-svg" viewBox="0 0 100 100">
                <circle className="mk-track" cx="50" cy="50" r="40" />
                <circle className="mk-ring" cx="50" cy="50" r="40"
                  stroke={k.ringColor} strokeDasharray={CIRC}
                  strokeDashoffset={CIRC} data-target={String(offset)} />
                <text x="50" y="50" textAnchor="middle" dominantBaseline="central"
                  className="mk-num" fill={k.color}>{k.value}</text>
              </svg>
              <div className="mk-label">{k.label}</div>
            </div>
          );
        })}
      </div>

      {/* Métricas por fase */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="mk-phase">
          <div className="mk-phase-head">
            <span className="mk-phase-dot" style={{ background: "#22c77e" }} />
            <span className="mk-phase-title">Métricas de captura (mes 1–2)</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Revenue capturado</strong> vs revenue potencial por servicio</li>
            <li><strong>Proveedores con contrato firmado</strong> vs total en bodega</li>
            <li><strong>Tiempo de carga a cobro</strong> (desde que logística sube Excel hasta que facturación descuenta)</li>
            <li><strong>Errores de importación</strong> (filas rechazadas por formato)</li>
          </ul>
        </div>
        <div className="mk-phase">
          <div className="mk-phase-head">
            <span className="mk-phase-dot" style={{ background: "#e8a020" }} />
            <span className="mk-phase-title">Métricas de operación (mes 3+)</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 18 }}>
            <li><strong>Deuda acumulada</strong> por proveedor y antigüedad</li>
            <li><strong>Servicios activados</strong> (de 5 posibles, cuántos se cobran por país)</li>
            <li><strong>Reversa rate</strong> (cobros revertidos / cobros totales)</li>
            <li><strong>P&L fulfillment delta</strong> (antes vs después de la herramienta)</li>
          </ul>
        </div>
      </div>

      {/* North Star con pulso */}
      <div className="mk-north">
        <div className="mk-north-title">
          El KPI que importa: dinero nuevo que entra al P&L de fulfillment
        </div>
        <p>
          Todo lo demás (adopción, uptime, velocidad) son proxies. La herramienta existe para facturar
          servicios que hoy se prestan gratis. Si al mes 3 no hay revenue nuevo entrando, algo falló:
          o los proveedores no firmaron, o la data no se carga, o las tarifas son incorrectas. Medir
          desde día 1.
        </p>
      </div>
    </div>
  );
}

function TabLeakage() {
  return (
    <>
      {/* Critical callout */}
      <Card tone="warn">
        <p style={{ margin: 0, lineHeight: 1.5 }}>
          <strong>La tarifa base por orden ($2,800 COP) NO entra en este analisis</strong> — ya se cobra
          desde el core de la plataforma. Este POC cubre exclusivamente los 5 servicios adicionales que
          Dropi presta en bodega y que hoy no se facturan.
        </p>
      </Card>

      <SectionTitle hint="Potencial mensual estimado across 12 paises">
        Revenue potencial
      </SectionTitle>

      <Card>
        <p style={{ margin: 0, fontSize: "var(--fs-body)", lineHeight: 1.6, color: "var(--fg)" }}>
          El revenue potencial combinado de los 5 servicios se estima entre{" "}
          <strong style={{ color: "var(--brand)" }}>$2.9M y $6.4M MXN/mes</strong> considerando los 12
          paises donde Dropi opera bodegas. La cifra exacta depende del volumen por servicio — hoy solo
          almacenamiento tiene data real confirmada.
        </p>
      </Card>

      {/* Stat tiles */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, margin: "18px 0" }}>
        <Card>
          <Stat label="Paises con bodega" value="12" hint="Todos con servicios activos sin cobro" />
        </Card>
        <Card>
          <Stat
            label="Servicios sin cobrar"
            value="4 de 5"
            tone="risk"
            hint="Solo almacenamiento tiene formula validada"
          />
        </Card>
        <Card>
          <Stat
            label="Dato real (mayo MX)"
            value="$62K MXN"
            tone="ok"
            hint="Almacenamiento — 382 lineas, 124 proveedores"
          />
        </Card>
      </div>

      <SectionTitle hint="Formula, estimado mensual y nivel de confianza de cada servicio">
        Servicios en bodega
      </SectionTitle>
      <Card flush>
        <Table
          columns={colsServicios}
          rows={servicios}
          getKey={(r) => r.nombre}
          caption="5 servicios identificados en la auditoria"
        />
      </Card>
    </>
  );
}

function TabServicios() {
  return (
    <>
      {/* 1. Almacenamiento */}
      <Card tone="ok">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <strong style={{ fontSize: "var(--fs-body)" }}>1. Almacenamiento</strong>
          <Pill tone="ok">Listo para POC</Pill>
        </div>
        <DataList
          items={[
            { label: "Fuente", value: "Excel mensual operativo" },
            { label: "Formula", value: "ubicaciones x tarifa por ubicacion" },
            { label: "Data real", value: "382 lineas, 124 proveedores (mayo Mexico)" },
            { label: "Monto real", value: "$62K MXN (mayo)" },
          ]}
        />
      </Card>

      {/* 2. Etiquetado */}
      <Card tone="warn">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <strong style={{ fontSize: "var(--fs-body)" }}>2. Etiquetado</strong>
          <Pill tone="warn">Requiere definir fuente</Pill>
        </div>
        <DataList
          items={[
            { label: "Formula", value: "cantidad de etiquetas x $200" },
            { label: "Bloqueante", value: "No esta definido quien genera el conteo de etiquetas impresas por proveedor" },
            { label: "Pregunta abierta", value: "El conteo debe ser por turno, por dia o por periodo de facturacion?" },
          ]}
          columns={1}
        />
      </Card>

      {/* 3. Armado de kits */}
      <Card tone="warn">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <strong style={{ fontSize: "var(--fs-body)" }}>3. Armado de kits</strong>
          <Pill tone="warn">Requiere criterio</Pill>
        </div>
        <DataList
          items={[
            { label: "Formula", value: "kits con >3 pasos de ensamblaje x $300" },
            { label: "Pregunta 1", value: "Que cuenta como un 'paso' de ensamblaje? Falta definicion operativa." },
            { label: "Pregunta 2", value: "Se cobra por kit armado o por tipo de kit (SKU unico)?" },
            { label: "Pregunta 3", value: "Los kits promocionales temporales tienen la misma tarifa que los permanentes?" },
          ]}
          columns={1}
        />
      </Card>

      {/* 4. Recepcion */}
      <Card tone="ok">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <strong style={{ fontSize: "var(--fs-body)" }}>4. Recepcion</strong>
          <Pill tone="ok">Formula clara</Pill>
        </div>
        <DataList
          items={[
            { label: "Formula", value: "Tarifa fija por tipo de vehiculo" },
            { label: "Sencillo 8T", value: "$140,000 COP" },
            { label: "Contenedor 40P", value: "$300,000 COP" },
            { label: "HQ (High Quality)", value: "$350,000 COP" },
          ]}
        />
      </Card>

      {/* 5. Multi-unidad */}
      <Card tone="risk">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
          <strong style={{ fontSize: "var(--fs-body)" }}>5. Multi-unidad</strong>
          <Pill tone="risk">Bloqueado: sin data</Pill>
        </div>
        <DataList
          items={[
            { label: "Formula", value: "ordenes con >1 unidad x recargo por unidad adicional" },
            { label: "Bloqueante", value: "Depende de data transaccional de ordenes que hoy maneja otra celula" },
            { label: "Recomendacion", value: "No debe bloquear el MVP. Incorporar en Fase 3 cuando haya acceso a la data." },
          ]}
          columns={1}
        />
      </Card>
    </>
  );
}

function TabRiesgos() {
  return (
    <>
      <SectionTitle hint="Ordenados por impacto estimado, de mayor a menor">
        Riesgos identificados
      </SectionTitle>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {riesgos.map((r) => (
          <Card key={r.id} tone={r.tone}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Pill tone={r.tone}>{r.id}</Pill>
              <strong>{r.titulo}</strong>
            </div>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "var(--fs-body)", lineHeight: 1.5 }}>
              {r.detalle}
            </p>
          </Card>
        ))}
      </div>

      <SectionTitle hint="Secuencia incremental — cada fase desbloquea la siguiente">
        Roadmap de implementacion
      </SectionTitle>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {fases.map((f) => (
          <Card key={f.nombre} tone={f.tone}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <strong>{f.nombre}</strong>
              <Pill tone={f.tone}>{f.duracion}</Pill>
            </div>
            <p style={{ margin: "0 0 6px", fontWeight: 600, fontSize: "var(--fs-label)", color: "var(--fg)" }}>
              {f.contenido}
            </p>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "var(--fs-body)", lineHeight: 1.5 }}>
              {f.servicios}
            </p>
          </Card>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

export default function PocServiciosBodegaContent() {
  const [tab, setTab] = useState<Tab>("alcance");

  return (
    <>
      <div className="exp-tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={`exp-tab${tab === t.key ? " exp-tab--active" : ""}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "alcance" && <TabAlcance />}
      {tab === "metricas" && <TabMetricas />}
      {tab === "leakage" && <TabLeakage />}
      {tab === "servicios" && <TabServicios />}
      {tab === "riesgos" && <TabRiesgos />}
    </>
  );
}
