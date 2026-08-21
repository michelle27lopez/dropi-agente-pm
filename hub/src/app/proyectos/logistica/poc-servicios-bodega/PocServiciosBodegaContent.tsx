"use client";

import { useState } from "react";
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

type Tab = "leakage" | "servicios" | "riesgos";

const TABS: { key: Tab; label: string }[] = [
  { key: "leakage", label: "Revenue leakage" },
  { key: "servicios", label: "Servicio por servicio" },
  { key: "riesgos", label: "Riesgos y roadmap" },
];

// ---------------------------------------------------------------------------
// Tab contents
// ---------------------------------------------------------------------------

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
  const [tab, setTab] = useState<Tab>("leakage");

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

      {tab === "leakage" && <TabLeakage />}
      {tab === "servicios" && <TabServicios />}
      {tab === "riesgos" && <TabRiesgos />}
    </>
  );
}
