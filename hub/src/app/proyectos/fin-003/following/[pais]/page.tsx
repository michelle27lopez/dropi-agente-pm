"use client";

import { useParams } from "next/navigation";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";
import {
  Users, MousePointerClick, TrendingUp, TrendingDown, AlertTriangle, Wrench, ArrowRight,
} from "lucide-react";

/* ── Shared styles (mismo lenguaje visual que /proyectos/fin-003) ── */
const badgeStyle = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", gap: 4, borderRadius: 999,
  padding: "4px 10px", fontSize: 12, fontWeight: 700, color, background: bg, whiteSpace: "nowrap",
});

const sectionHeadingStyle: React.CSSProperties = {
  fontSize: 16, fontWeight: 800, color: "var(--fg)", marginBottom: 12,
  display: "flex", alignItems: "center", gap: 8,
};

const tableHeaderStyle: React.CSSProperties = {
  background: "#F8FAFC", color: "#475569", fontSize: 11, fontWeight: 700,
  textTransform: "uppercase", padding: "10px 14px", borderBottom: "1px solid #E2E8F0", textAlign: "left",
};

const tableCellStyle: React.CSSProperties = {
  padding: "12px 14px", fontSize: 13, borderBottom: "1px solid #E2E8F0", color: "#1E293B",
};

const cardStyle: React.CSSProperties = {
  background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: 20, marginBottom: 20,
};

function KPI({ label, value, sub, color, icon }: {
  label: string; value: string; sub?: string; color: string; icon?: React.ReactNode;
}) {
  return (
    <div style={{ background: "#fff", border: `1.5px solid ${color}20`, borderRadius: 12, padding: "14px 18px", borderTop: `3px solid ${color}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
        {icon && <div style={{ color, opacity: 0.7 }}>{icon}</div>}
      </div>
      <div style={{ fontSize: 24, fontWeight: 900, color, lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

/* ── Datos del following — corte 20 de agosto, 2026 (fuente: Following_Experimento_USDT.md) ── */
type UsuarioNuevo = { usuario: string; rol: "Dropshipper" | "Supplier"; monto: string };

type PaisData = {
  flag: string;
  nombre: string;
  fecha: string;
  objetivo: string;
  expuestos: string;
  clicCta: string;
  pctClic: string;
  adopcion: string;
  adopcionSub: string;
  hallazgos: string;
  dolores: string;
  bugs: string;
  proximosPasos: string;
  embudo?: { etapa: string; usuarios: string; pct: string }[];
  desgloseRol?: { rol: string; usuarios: string }[];
  usuariosNuevos?: UsuarioNuevo[];
  montoAtribuible?: string;
  volumenTotal?: string;
  participacion?: string;
};

const DATA: Record<string, PaisData> = {
  colombia: {
    flag: "🇨🇴",
    nombre: "Colombia",
    fecha: "20 de agosto, 2026",
    objetivo: "Validar si el modal genera visibilidad y conversión hacia el retiro en USDT en el momento de mayor intención transaccional. Segundo corte, con una semana adicional de following para capturar el ciclo natural de retiro.",
    expuestos: "9.808",
    clicCta: "752",
    pctClic: "7,67%",
    adopcion: "2,12%",
    adopcionSub: "21 retirantes nuevos de 752 (4,65% del total de retirantes)",
    hallazgos: "El monto atribuible casi triplicó (13.632 → 39.384 USDT) con solo 7 días más de following, lo que valida que el tiempo de medición original era insuficiente. Un solo usuario (Reginaldo Amaral) concentra el 67% del monto atribuible (26.528 USDT), lo que hace la métrica sensible a casos individuales. Persisten los proveedores con muy baja conversión: solo 4 suppliers nuevos frente a 17 dropshippers. La tasa de clic mejoró levemente (6,55% → 7,67%) con el crecimiento natural de exposición.",
    dolores: "Alta concentración en pocos usuarios reduce la robustez estadística del hallazgo. Aún falta la métrica de cuentas USDT agregadas para cerrar el embudo completo.",
    bugs: "Ninguno técnico.",
    proximosPasos: "Extender following. Solicitar a Tech (con autorización de María Ossa) el cruce de cuentas USDT agregadas por primera vez entre los 752 que hicieron clic. Ejecutar A/B test combinado (filtro 90d → 30d + copy simplificado).",
    embudo: [
      { etapa: "Expuestos al modal", usuarios: "9.808", pct: "100%" },
      { etapa: "Clic en CTA", usuarios: "752", pct: "7,67%" },
      { etapa: "Retiraron USDT (30 días)", usuarios: "35", pct: "0,36%" },
      { etapa: "Retirantes nuevos (atribuibles)", usuarios: "21", pct: "0,21%" },
    ],
    desgloseRol: [
      { rol: "Dropshipper", usuarios: "17" },
      { rol: "Supplier", usuarios: "4" },
    ],
    montoAtribuible: "39.384 USDT",
    volumenTotal: "1.853.544 USDT",
    participacion: "2,12% del volumen total — subió desde 0,72% en el corte anterior.",
    usuariosNuevos: [
      { usuario: "Reginaldo Amaral", rol: "Dropshipper", monto: "26.528,49" },
      { usuario: "Samyra Souza", rol: "Dropshipper", monto: "5.054,52" },
      { usuario: "Micael Lourenço", rol: "Dropshipper", monto: "2.148,44" },
      { usuario: "Michael Rivas", rol: "Supplier", monto: "1.566,67" },
      { usuario: "Jorge Patiño", rol: "Supplier", monto: "1.256,49" },
      { usuario: "Ronaldo Gomez", rol: "Dropshipper", monto: "984,20" },
      { usuario: "Dhiego Valerio", rol: "Dropshipper", monto: "623,22" },
      { usuario: "Robin Hernandez", rol: "Dropshipper", monto: "517,92" },
      { usuario: "Jeferson Pascacio", rol: "Dropshipper", monto: "155,58" },
      { usuario: "Xiomara Bolivar", rol: "Dropshipper", monto: "74,77" },
      { usuario: "Blanca Serna", rol: "Dropshipper", monto: "72,30" },
      { usuario: "Justin Castillo", rol: "Dropshipper", monto: "72,27" },
      { usuario: "Daniel Ortega", rol: "Dropshipper", monto: "72,14" },
      { usuario: "GOLDBOX COL", rol: "Supplier", monto: "43,25" },
      { usuario: "Christopher Carreño", rol: "Dropshipper", monto: "37,38" },
      { usuario: "Bluemoon Axm", rol: "Supplier", monto: "32,67" },
      { usuario: "Dilan Restrepo", rol: "Dropshipper", monto: "32,13" },
      { usuario: "Yeltsin Romero", rol: "Dropshipper", monto: "29,54" },
      { usuario: "richard young", rol: "Dropshipper", monto: "29,53" },
      { usuario: "VANESSA HURTADO", rol: "Dropshipper", monto: "26,41" },
      { usuario: "Heidy Rivera", rol: "Dropshipper", monto: "26,20" },
    ],
  },
  ecuador: {
    flag: "🇪🇨",
    nombre: "Ecuador",
    fecha: "20 de agosto, 2026",
    objetivo: "Validar visibilidad y conversión del modal en el servidor de Ecuador.",
    expuestos: "13",
    clicCta: "2",
    pctClic: "15,38%",
    adopcion: "0%",
    adopcionSub: "ninguno de los 2 completó un retiro en USDT en 30 días",
    hallazgos: "La exposición es extremadamente baja (13 usuarios en todo el periodo) frente al tráfico real del módulo reportado por Laura Torres (~600-700 visitas semanales a Datos Bancarios). Confirma con fuerza la hipótesis de que el filtro de 90 días excluye a la gran mayoría de la base en mercados de apertura reciente. Uno de los 2 completers parece ser una cuenta de prueba del equipo (Laura Torres), no un usuario real — a validar antes de reportar.",
    dolores: "Muestra insuficiente para sacar conclusiones de conversión. El filtro de antigüedad es la barrera dominante, no el mensaje.",
    bugs: "Ninguno.",
    proximosPasos: "Priorizar Ecuador en el A/B test de reducción de filtro (90d → 30d) — es el país donde el ajuste tiene mayor potencial de impacto en volumen de exposición.",
  },
  chile: {
    flag: "🇨🇱",
    nombre: "Chile",
    fecha: "20 de agosto, 2026",
    objetivo: "Validar visibilidad y conversión del modal en el servidor de Chile.",
    expuestos: "11",
    clicCta: "3",
    pctClic: "27,27%",
    adopcion: "0%",
    adopcionSub: "ninguno de los 3 completó un retiro en USDT en 30 días",
    hallazgos: "Igual que Ecuador, la exposición es mínima (11 usuarios) frente al tráfico real reportado (~700-900 visitas semanales combinadas). La tasa de clic (27,27%) es la más alta de los tres países medidos, pero con una base de 11 personas no es estadísticamente representativa.",
    dolores: "Muestra insuficiente para conclusiones. Recordar que Chile tuvo una caída de -63% en transacciones USDT en el periodo anterior, por causas ajenas al experimento (baja exposición) — pendiente de investigar con stakeholders locales.",
    bugs: "Ninguno.",
    proximosPasos: "Incluir en el A/B test de filtro reducido. Dar seguimiento a la investigación pendiente sobre la caída de transacciones de Chile.",
  },
};

const COMPARATIVO = [
  { pais: "🇨🇴 Colombia", expuestos: "9.808", clic: "752", pctClic: "7,67%", retiraron: "35", nuevos: "21" },
  { pais: "🇪🇨 Ecuador", expuestos: "13", clic: "2", pctClic: "15,38%*", retiraron: "0", nuevos: "0" },
  { pais: "🇨🇱 Chile", expuestos: "11", clic: "3", pctClic: "27,27%*", retiraron: "0", nuevos: "0" },
];

export default function FollowingPaisPage() {
  const params = useParams();
  const paisSlug = (Array.isArray(params.pais) ? params.pais[0] : params.pais) || "";
  const data = DATA[paisSlug];

  if (!data) {
    return (
      <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <HubHeader title="Following FIN-003" subtitle="País no encontrado" currentSlug="fin-003" />
        <main style={{ maxWidth: 900, width: "100%", margin: "0 auto", padding: "40px 20px", flex: 1 }}>
          <p style={{ fontSize: 14, color: "#475569" }}>
            No hay following registrado para “{paisSlug}”. Países disponibles: Colombia, Ecuador, Chile.
          </p>
          <a href="/proyectos/fin-003" style={{ color: "#6366F1", fontWeight: 700, fontSize: 13 }}>← Volver a FIN-003</a>
        </main>
        <HubFooter />
      </div>
    );
  }

  return (
    <div style={{ background: "#F8FAFC", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <HubHeader
        title={`Following FIN-003 · ${data.flag} ${data.nombre}`}
        subtitle="Masificación Dropipay — Visibilidad de retiros en USDT · Célula Fintech"
        currentSlug="fin-003"
      />

      <main style={{ maxWidth: 1100, width: "100%", margin: "0 auto", padding: "24px 20px", flex: 1 }}>

        {/* ── Breadcrumb & title ── */}
        <div style={{ marginBottom: 20 }}>
          <a href="/proyectos/fin-003" style={{ fontSize: 13, fontWeight: 600, color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4, marginBottom: 12 }}>
            ← Volver a FIN-003
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6, flexWrap: "wrap" }}>
            <span style={badgeStyle("#0369A1", "#E0F2FE")}>🏦 Célula Fintech</span>
            <span style={badgeStyle("#B45309", "#FEF3C7")}>🟢 M2 · Quincenal</span>
            <span style={badgeStyle("#7C3AED", "#F3E8FF")}>Corte: {data.fecha}</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>
            {data.flag} Following — {data.nombre}
          </h1>
          <p style={{ fontSize: 14, color: "#475569", margin: "6px 0 0 0", maxWidth: 780 }}>
            {data.objetivo}
          </p>
        </div>

        {/* ── KPI row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 16, marginBottom: 28 }}>
          <KPI label="Usuarios expuestos" value={data.expuestos} color="#3B82F6" icon={<Users size={18} />} />
          <KPI label="Clic en CTA" value={data.pctClic} sub={`${data.clicCta} usuarios`} color="#8B5CF6" icon={<MousePointerClick size={18} />} />
          <KPI label="Adopción (retirantes nuevos)" value={data.adopcion} sub={data.adopcionSub} color={data.adopcion === "0%" ? "#EF4444" : "#10B981"} icon={data.adopcion === "0%" ? <TrendingDown size={18} /> : <TrendingUp size={18} />} />
          {data.montoAtribuible && (
            <KPI label="Monto atribuible" value={data.montoAtribuible} sub={data.participacion} color="#F59E0B" icon={<TrendingUp size={18} />} />
          )}
        </div>

        {/* ── Embudo (solo países con data suficiente) ── */}
        {data.embudo && (
          <div style={cardStyle}>
            <h3 style={sectionHeadingStyle}>📊 Embudo acumulado</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={tableHeaderStyle}>Etapa</th><th style={tableHeaderStyle}>Usuarios</th><th style={tableHeaderStyle}>%</th></tr></thead>
              <tbody>
                {data.embudo.map((row) => (
                  <tr key={row.etapa}>
                    <td style={tableCellStyle}>{row.etapa}</td>
                    <td style={tableCellStyle}>{row.usuarios}</td>
                    <td style={tableCellStyle}>{row.pct}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Desglose por rol + usuarios nuevos (solo Colombia) ── */}
        {data.desgloseRol && (
          <div style={cardStyle}>
            <h3 style={sectionHeadingStyle}>👥 Desglose por rol (retirantes nuevos)</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Usuarios nuevos</th></tr></thead>
              <tbody>
                {data.desgloseRol.map((row) => (
                  <tr key={row.rol}>
                    <td style={tableCellStyle}>{row.rol}</td>
                    <td style={tableCellStyle}>{row.usuarios}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {data.usuariosNuevos && (
          <div style={cardStyle}>
            <h3 style={sectionHeadingStyle}>💰 Usuarios nuevos identificados (retirantes atribuibles)</h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead><tr><th style={tableHeaderStyle}>Usuario</th><th style={tableHeaderStyle}>Rol</th><th style={tableHeaderStyle}>Monto (USDT)</th></tr></thead>
                <tbody>
                  {data.usuariosNuevos.map((u) => (
                    <tr key={u.usuario}>
                      <td style={tableCellStyle}>{u.usuario}</td>
                      <td style={tableCellStyle}>{u.rol}</td>
                      <td style={tableCellStyle}>{u.monto}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Hallazgos / Dolores / Bugs / Próximos pasos ── */}
        <div style={cardStyle}>
          <h3 style={sectionHeadingStyle}>💡 Hallazgos claves</h3>
          <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: 0 }}>{data.hallazgos}</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", padding: 16, borderRadius: 10 }}>
            <strong style={{ color: "#991B1B", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <AlertTriangle size={16} /> Dolores identificados
            </strong>
            <p style={{ fontSize: 12, color: "#7F1D1D", margin: "6px 0 0 0", lineHeight: 1.5 }}>{data.dolores}</p>
          </div>
          <div style={{ background: "#F0FDF4", border: "1px solid #86EFAC", padding: 16, borderRadius: 10 }}>
            <strong style={{ color: "#166534", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Wrench size={16} /> Bugs
            </strong>
            <p style={{ fontSize: 12, color: "#14532D", margin: "6px 0 0 0", lineHeight: 1.5 }}>{data.bugs}</p>
          </div>
        </div>

        <div style={{ background: "#EFF6FF", border: "1px solid #93C5FD", borderRadius: 10, padding: 16, marginBottom: 28 }}>
          <strong style={{ color: "#1E40AF", fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
            <ArrowRight size={16} /> Próximos pasos
          </strong>
          <p style={{ fontSize: 12, color: "#1E3A8A", margin: "6px 0 0 0", lineHeight: 1.5 }}>{data.proximosPasos}</p>
        </div>

        {/* ── Comparativo entre países ── */}
        <div style={cardStyle}>
          <h3 style={sectionHeadingStyle}>🌎 Comparativo entre países (corte 20 agosto)</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={tableHeaderStyle}>País</th><th style={tableHeaderStyle}>Expuestos</th><th style={tableHeaderStyle}>Clic CTA</th>
                <th style={tableHeaderStyle}>% Clic</th><th style={tableHeaderStyle}>Retiraron USDT</th><th style={tableHeaderStyle}>Nuevos atribuibles</th>
              </tr>
            </thead>
            <tbody>
              {COMPARATIVO.map((row) => (
                <tr key={row.pais} style={{ background: row.pais.includes(data.nombre) ? "#EEF2FF" : undefined }}>
                  <td style={tableCellStyle}>{row.pais}</td>
                  <td style={tableCellStyle}>{row.expuestos}</td>
                  <td style={tableCellStyle}>{row.clic}</td>
                  <td style={tableCellStyle}>{row.pctClic}</td>
                  <td style={tableCellStyle}>{row.retiraron}</td>
                  <td style={tableCellStyle}>{row.nuevos}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p style={{ fontSize: 11, color: "#94A3B8", margin: "8px 0 0 0" }}>
            *Porcentajes de Ecuador y Chile no son comparables con Colombia por tamaño de muestra — se incluyen solo como referencia, no como señal de desempeño.
          </p>
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {Object.entries(DATA).filter(([slug]) => slug !== paisSlug).map(([slug, d]) => (
            <a key={slug} href={`/proyectos/fin-003/following/${slug}`} style={{ fontSize: 13, fontWeight: 700, color: "#6366F1", background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 8, padding: "8px 14px", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
              Ver following {d.flag} {d.nombre} <ArrowRight size={14} />
            </a>
          ))}
        </div>
      </main>

      <HubFooter />
    </div>
  );
}
