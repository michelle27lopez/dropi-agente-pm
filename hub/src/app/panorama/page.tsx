"use client";

import { useState } from "react";
import HubFooter from "@/components/HubFooter";

// Panorama: kanban por fase de todos los proyectos de Supplier Success.
// Datos de ejemplo por ahora — la fuente real será Jira (Epics agrupados
// por label proy-*, ver /guias/nomenclatura-fases), pero ese label todavía
// no existe en Epics reales, así que conectar hoy devolvería vacío.
// Ver [[project_nomenclatura_fases]] y [[project_darwin_pd_dashboard]].

type Entregable = { nombre: string; hecho: boolean; aplica: boolean };

type ProyectoPanorama = {
  code: string;
  name: string;
  icon: string;
  fase: "Discovery" | "POC" | "Delivery" | "Following";
  subestado: string;
  entregables: Entregable[];
  bloqueo: string | null;
  entradaFase: string; // fecha de ejemplo — vendrá de "created" del Epic
  url?: string;
};

const FASES: { key: ProyectoPanorama["fase"]; label: string; color: string }[] = [
  { key: "Discovery", label: "Discovery", color: "#7C3AED" },
  { key: "POC", label: "POC", color: "#0EA5E9" },
  { key: "Delivery", label: "Delivery", color: "#F77F00" },
  { key: "Following", label: "Following", color: "#22C55E" },
];

const PROYECTOS: ProyectoPanorama[] = [
  {
    code: "CAT-001", name: "Categorización", icon: "🏷️", fase: "Discovery", subestado: "Experimentación",
    entregables: [], bloqueo: "Bug de IA en producción sin resolver", entradaFase: "2026-06-02",
    url: "/proyectos/categorizacion",
  },
  {
    code: "CAZ-001", name: "Caza Productos", icon: "🔍", fase: "Discovery", subestado: "Ideación",
    entregables: [], bloqueo: "Conversión sube pero CSAT empeora, 0% acuerdos Q3", entradaFase: "2026-07-08",
    url: "/proyectos/caza-productos",
  },
  {
    code: "PUL-001", name: "Dropi Pulso", icon: "🔭", fase: "POC", subestado: "Seguimiento",
    entregables: [], bloqueo: null, entradaFase: "2026-06-20",
    url: "/proyectos/pulso-demo",
  },
  {
    code: "DCA-001", name: "Dinámicas de Catálogo", icon: "🗂️", fase: "Delivery", subestado: "En Dev",
    entregables: [
      { nombre: "E2E Completar", hecho: true, aplica: true },
      { nombre: "Documentación RPP", hecho: true, aplica: true },
      { nombre: "QA", hecho: false, aplica: true },
    ],
    bloqueo: "Webhook CRM pendiente (Enrique)", entradaFase: "2026-07-01",
    url: "/proyectos/dinamicas-catalogo",
  },
  {
    code: "NEG-002", name: "Negociaciones Proveedor–Dropshipper", icon: "🤝", fase: "Delivery", subestado: "En Definición",
    entregables: [
      { nombre: "E2E Completar", hecho: false, aplica: true },
      { nombre: "Documentación RPP", hecho: false, aplica: true },
    ],
    bloqueo: null, entradaFase: "2026-07-15",
    url: "/proyectos/negociaciones-dropshipper",
  },
  {
    code: "DESC-001", name: "Descuentos", icon: "🏷️", fase: "Delivery", subestado: "Pendiente Hand Off",
    entregables: [
      { nombre: "E2E Completar", hecho: true, aplica: true },
      { nombre: "Documentación RPP", hecho: true, aplica: true },
    ],
    bloqueo: null, entradaFase: "2026-07-10",
    url: "/proyectos/descuentos",
  },
  {
    code: "IND-001", name: "Prospectos de Ascenso", icon: "📈", fase: "Following", subestado: "Producción",
    entregables: [], bloqueo: null, entradaFase: "2026-07-17",
    url: "/proyectos/indicadores",
  },
  {
    code: "NEG-001", name: "Negociaciones Proveedor–Líder de Comunidad", icon: "🤝", fase: "Following", subestado: "Producción",
    entregables: [], bloqueo: null, entradaFase: "2026-05-27",
    url: "/proyectos/negociaciones",
  },
];

function diasEnFase(fechaISO: string) {
  const ms = Date.now() - new Date(fechaISO).getTime();
  return Math.max(0, Math.round(ms / 86_400_000));
}

function Stat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div style={{
      background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12,
      padding: "16px 18px", flex: "1 1 140px", minWidth: 140,
    }}>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{label}</div>
    </div>
  );
}

function ProyectoCard({ p, onClick }: { p: ProyectoPanorama; onClick: () => void }) {
  const total = p.entregables.filter((e) => e.aplica).length;
  const hechos = p.entregables.filter((e) => e.aplica && e.hecho).length;
  return (
    <button
      onClick={onClick}
      style={{
        display: "block", width: "100%", textAlign: "left", cursor: "pointer",
        background: "var(--card)", border: "1px solid var(--border)", borderRadius: 10,
        padding: 14, fontFamily: "inherit",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>{p.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{p.name}</span>
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, color: "var(--muted)" }}>{p.code}</span>
      </div>
      <div style={{ marginTop: 8, fontSize: 11, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", display: "inline-block", padding: "2px 8px", borderRadius: 999 }}>
        {p.subestado}
      </div>
      {total > 0 && (
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
          Entregables: {hechos}/{total}
        </div>
      )}
      {p.bloqueo && (
        <div style={{ fontSize: 11, color: "#DC2626", marginTop: 8, lineHeight: 1.4 }}>
          ⚠️ {p.bloqueo}
        </div>
      )}
      <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 8 }}>
        {diasEnFase(p.entradaFase)} días en esta fase
      </div>
    </button>
  );
}

function Detalle({ p, onClose }: { p: ProyectoPanorama; onClose: () => void }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 50,
        display: "flex", justifyContent: "flex-end",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: 380, maxWidth: "100%", height: "100%", background: "var(--card)",
          borderLeft: "1px solid var(--border)", padding: 28, overflowY: "auto",
        }}
      >
        <button onClick={onClose} style={{ fontSize: 12, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", marginBottom: 16, padding: 0, fontFamily: "inherit" }}>
          ✕ Cerrar
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 20 }}>{p.icon}</span>
          <h2 style={{ fontSize: 17, fontWeight: 800, color: "var(--fg)" }}>{p.name}</h2>
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>{p.code}</p>

        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Fase actual</div>
        <p style={{ fontSize: 14, color: "var(--fg)", marginBottom: 4 }}>{p.fase} — {p.subestado}</p>
        <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 20 }}>
          Entró a esta fase el {p.entradaFase} ({diasEnFase(p.entradaFase)} días)
        </p>

        {p.entregables.length > 0 && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Entregables</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 20 }}>
              {p.entregables.map((e) => (
                <div key={e.nombre} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--fg)" }}>
                  <span>{e.hecho ? "✅" : "⬜️"}</span>
                  {e.nombre}
                </div>
              ))}
            </div>
          </>
        )}

        {p.bloqueo && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 6 }}>Bloqueo / dependencia</div>
            <p style={{ fontSize: 13, color: "#DC2626", lineHeight: 1.5, marginBottom: 20 }}>{p.bloqueo}</p>
          </>
        )}

        {p.url && (
          <a href={p.url} style={{ fontSize: 13, fontWeight: 700, color: "var(--dropi)", textDecoration: "none" }}>
            Ir al proyecto →
          </a>
        )}
      </div>
    </div>
  );
}

export default function PanoramaPage() {
  const [seleccionado, setSeleccionado] = useState<ProyectoPanorama | null>(null);

  const conBloqueo = PROYECTOS.filter((p) => p.bloqueo).length;

  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1, padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)" }}>Panorama</h1>
          <span style={{ fontSize: 10, fontWeight: 700, color: "#B45309", background: "#FFF6E5", padding: "2px 8px", borderRadius: 999 }}>
            Datos de ejemplo
          </span>
        </div>
        <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 4, marginBottom: 24 }}>
          Estado de todos los proyectos de Supplier Success, por fase.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
          <Stat label="Proyectos activos" value={PROYECTOS.length} color="var(--fg)" />
          {FASES.map((f) => (
            <Stat key={f.key} label={f.label} value={PROYECTOS.filter((p) => p.fase === f.key).length} color={f.color} />
          ))}
          <Stat label="Con bloqueo" value={conBloqueo} color="#DC2626" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
          {FASES.map((f) => {
            const proyectos = PROYECTOS.filter((p) => p.fase === f.key);
            return (
              <div key={f.key}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: f.color }} />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{f.label}</span>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>{proyectos.length}</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {proyectos.length === 0 && (
                    <p style={{ fontSize: 12, color: "var(--muted)", fontStyle: "italic" }}>Sin proyectos en esta fase.</p>
                  )}
                  {proyectos.map((p) => (
                    <ProyectoCard key={p.code} p={p} onClick={() => setSeleccionado(p)} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <HubFooter />
      {seleccionado && <Detalle p={seleccionado} onClose={() => setSeleccionado(null)} />}
    </main>
  );
}
