"use client";

import { useMemo, useState } from "react";
import {
  RESULTADO_SEMANAL,
  CORTE_COHORTE,
  FECHA_CORTE_DATA,
  META_DIAS,
  BASELINE_MEDIANA_HISTORICA,
  BASELINE_PROMEDIO_HISTORICO,
  type ResultadoRow,
  type EstadoMeta7d,
} from "./data";

const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});

const ESTADO_LABEL: Record<EstadoMeta7d, string> = {
  exito: "Éxito ≤7d",
  fracaso: "Fracaso",
  en_observacion: "En observación",
  sin_signed_up: "Sin Signed Up",
};
const ESTADO_COLOR: Record<EstadoMeta7d, { color: string; bg: string }> = {
  exito: { color: "#10B981", bg: "#ECFDF5" },
  fracaso: { color: "#EF4444", bg: "#FEF2F2" },
  en_observacion: { color: "#F59E0B", bg: "#FFFBEB" },
  sin_signed_up: { color: "#6B7280", bg: "#F3F4F6" },
};
const GATILLO_LABEL: Record<string, string> = {
  gatillo_cerrado: "Gatillo cerrado",
  activacion_sin_atribucion_cerrada: "Activación sin atribución",
  sin_atribucion: "Sin atribución",
};
const GATILLO_COLOR: Record<string, { color: string; bg: string }> = {
  gatillo_cerrado: { color: "#6366F1", bg: "#EEF2FF" },
  activacion_sin_atribucion_cerrada: { color: "#8B5CF6", bg: "#F5F3FF" },
  sin_atribucion: { color: "#9CA3AF", bg: "#F3F4F6" },
};

// Referencia de madurez a partir de la pregunta 7 de la encuesta de clasificación
// ("¿Cuántas ventas realiza tu marca al mes?"), mapeada a los rangos oficiales de
// madurez operativa (CLAUDE.md, jun 2026). Es autodeclarado en el momento de la
// encuesta, no medido sobre ordenes_mes_propias — sirve de referencia de volumen
// esperado, no como el dato validado de madurez.
const MADUREZ_DECLARADA: Record<string, { label: string; color: string; bg: string }> = {
  "Aún no vendo": { label: "Aún no vendo", color: "#9CA3AF", bg: "#F3F4F6" },
  "Menos de 50 al mes": { label: "Iniciando", color: "#3B82F6", bg: "#EFF6FF" },
  "51 a 300 al mes": { label: "Creciendo", color: "#10B981", bg: "#ECFDF5" },
  "301 a 1.000 al mes": { label: "Consolidando / Pre-Escalando", color: "#F59E0B", bg: "#FFFBEB" },
  "Más de 1.000 al mes": { label: "Escalando", color: "#DC2626", bg: "#FEF2F2" },
};
function nivelMadurezDeclarado(valor: string | null): { label: string; color: string; bg: string } {
  if (!valor || valor === "-") return { label: "No documentado", color: "#9CA3AF", bg: "#F3F4F6" };
  return MADUREZ_DECLARADA[valor] ?? { label: `No documentado (${valor})`, color: "#9CA3AF", bg: "#F3F4F6" };
}

type Filtro = "todos" | EstadoMeta7d;

export default function OnboardingTTFOPage() {
  // Abre en "Éxito" — los casos que dispararon el gatillo son el protagonista.
  // Fracaso/en observación siguen accesibles con un clic, no se borran del dato.
  const [filtro, setFiltro] = useState<Filtro>("exito");

  const stats = useMemo(() => {
    const poblacion = RESULTADO_SEMANAL.length;
    const activadas = RESULTADO_SEMANAL.filter((r) => r.primeraOrden !== null).length;
    const exito = RESULTADO_SEMANAL.filter((r) => r.estadoMeta7d === "exito").length;
    const fracaso = RESULTADO_SEMANAL.filter((r) => r.estadoMeta7d === "fracaso").length;
    const observacion = RESULTADO_SEMANAL.filter((r) => r.estadoMeta7d === "en_observacion").length;
    const gatillo = RESULTADO_SEMANAL.filter((r) => r.gatillo === "gatillo_cerrado").length;
    const conVeredicto = exito + fracaso;
    const consumioSinOrden = RESULTADO_SEMANAL.filter((r) => r.primeraOrden === null && r.caminos !== "").length;
    const sinConsumoSinOrden = RESULTADO_SEMANAL.filter((r) => r.primeraOrden === null && r.caminos === "").length;
    const ordenManualSinOrden = RESULTADO_SEMANAL.filter(
      (r) => r.primeraOrden === null && r.caminos.split(",").includes("orden_manual")
    ).length;
    return {
      poblacion, activadas, exito, fracaso, observacion, gatillo, conVeredicto,
      consumioSinOrden, sinConsumoSinOrden, ordenManualSinOrden,
    };
  }, []);

  const filas = useMemo(() => {
    const rows = filtro === "todos"
      ? RESULTADO_SEMANAL
      : RESULTADO_SEMANAL.filter((r) => r.estadoMeta7d === filtro);
    return [...rows].sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  }, [filtro]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>
          Activación Bruta · Onboarding TTFO
        </span>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        {/* Title */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "var(--dropi-light)",
              color: "var(--dropi, #F77F00)", padding: "3px 9px", borderRadius: 20,
            }}>
              TTFO-001
            </span>
            <span style={tag("#6366F1", "#EEF2FF")}>Fase 1 · Validación local</span>
            <span style={tag("#9CA3AF", "#F3F4F6")}>No conectado a Supabase</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Onboarding guiado (tour in-app) · Activación Bruta TTFO
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Baseline histórico (método viejo): mediana <b>{BASELINE_MEDIANA_HISTORICA} días</b>, promedio{" "}
            {BASELINE_PROMEDIO_HISTORICO} días. Meta: bajar la mediana a <b>{META_DIAS} días</b>.
            Cohorte: marcas con encuesta (<code>Submitted At</code>) ≥ {CORTE_COHORTE} — fecha de lanzamiento del onboarding.
            Corte de datos de órdenes: {FECHA_CORTE_DATA} (T-1).
          </p>
        </div>

        {/* KPI cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
          {[
            { label: "Población cohorte", value: stats.poblacion, color: "var(--fg)" },
            { label: "Activadas (1ra orden)", value: stats.activadas, color: "#3B82F6" },
            { label: "Éxito ≤7d", value: stats.exito, color: "#10B981" },
            { label: "Fracaso (ventana cerrada)", value: stats.fracaso, color: "#EF4444" },
            { label: "En observación", value: stats.observacion, color: "#F59E0B" },
            { label: "Gatillo onboarding cerrado", value: stats.gatillo, color: "#6366F1" },
            { label: "Consumió sin crear orden", value: stats.consumioSinOrden, color: "#0891B2" },
            { label: "Sin consumo y sin orden", value: stats.sinConsumoSinOrden, color: "#6B7280" },
          ].map((c) => (
            <div key={c.label} style={card}>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "var(--muted)",
                textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8,
              }}>
                {c.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: c.color, lineHeight: 1 }}>
                {c.value}
              </div>
            </div>
          ))}
        </div>

        {/* Nota de censura */}
        <div style={{
          ...card, marginBottom: 24, background: "#FFFBEB", borderColor: "#FDE68A",
          fontSize: 13, color: "#92400E", lineHeight: 1.5,
        }}>
          <b>{stats.observacion} de {stats.poblacion}</b> marcas siguen "en observación" — aún no se cumplen
          los {META_DIAS} días desde su <code>Signed Up</code>, así que no cuentan todavía como éxito ni fracaso.
          Solo <b>{stats.conVeredicto}</b> tienen veredicto cerrado por ahora. La muestra es pequeña — estos números
          son línea base de la cohorte, no una conclusión sobre si el onboarding movió la aguja.
        </div>

        {/* Tabla */}
        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{
            padding: "14px 20px", borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
          }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
              Resultado semanal · {filas.length} marca{filas.length === 1 ? "" : "s"}
            </span>
            <div style={{ display: "flex", gap: 6, marginLeft: "auto", flexWrap: "wrap" }}>
              {(["todos", "exito", "fracaso", "en_observacion"] as Filtro[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setFiltro(f)}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 8,
                    border: "1px solid var(--border)", cursor: "pointer",
                    background: filtro === f ? "var(--dropi, #F77F00)" : "#fff",
                    color: filtro === f ? "#fff" : "var(--muted)",
                  }}
                >
                  {f === "todos" ? "Todos" : ESTADO_LABEL[f]}
                </button>
              ))}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>User ID</th>
                  <th style={thStyle}>Submitted At</th>
                  <th style={thStyle}>Signed Up</th>
                  <th style={thStyle}>1ra orden</th>
                  <th style={thStyle}>TTFO (días)</th>
                  <th style={thStyle}>Meta 7d</th>
                  <th style={thStyle}>Gatillo onboarding</th>
                  <th style={thStyle}>Caminos</th>
                  <th style={thStyle}>Órdenes creadas</th>
                  <th style={thStyle}>Entregadas</th>
                  <th style={thStyle}>Ventas/mes declaradas</th>
                  <th style={thStyle}>Nivel madurez (ref.)</th>
                </tr>
              </thead>
              <tbody>
                {filas.map((r: ResultadoRow) => {
                  const estadoStyle = ESTADO_COLOR[r.estadoMeta7d];
                  const gatilloStyle = GATILLO_COLOR[r.gatillo] ?? GATILLO_COLOR.sin_atribucion;
                  const madurez = nivelMadurezDeclarado(r.ventasMesDeclaradas);
                  // Cuenta previa al tour: se registró antes del lanzamiento (10-jul) y solo
                  // llenó la encuesta tarde — no estuvo expuesta al onboarding desde el día 1.
                  const cuentaPrevia = r.signedUp < CORTE_COHORTE;
                  return (
                    <tr key={r.userId} style={cuentaPrevia ? { background: "#FFFBEB" } : undefined}>
                      <td style={tdStyle}>{r.userId}</td>
                      <td style={tdStyle}>
                        {r.submittedAt}
                        {cuentaPrevia && (
                          <span style={{ ...tag("#B45309", "#FEF3C7"), marginLeft: 6 }}>Cuenta previa</span>
                        )}
                      </td>
                      <td style={tdStyle}>{r.signedUp}</td>
                      <td style={tdStyle}>{r.primeraOrden ?? "—"}</td>
                      <td style={tdStyle}>{r.ttfoDias ?? "—"}</td>
                      <td style={tdStyle}>
                        <span style={tag(estadoStyle.color, estadoStyle.bg)}>{ESTADO_LABEL[r.estadoMeta7d]}</span>
                      </td>
                      <td style={tdStyle}>
                        <span style={tag(gatilloStyle.color, gatilloStyle.bg)}>
                          {GATILLO_LABEL[r.gatillo] ?? r.gatillo}
                        </span>
                      </td>
                      <td style={tdStyle}>{r.caminos || "—"}</td>
                      <td style={tdStyle}>{r.ordenesCreadas ?? "—"}</td>
                      <td style={tdStyle}>{r.ordenesEntregadas ?? "—"}</td>
                      <td style={tdStyle}>{r.ventasMesDeclaradas ?? "—"}</td>
                      <td style={tdStyle}>
                        <span style={tag(madurez.color, madurez.bg)}>{madurez.label}</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 16, lineHeight: 1.5 }}>
          Fuente: Excel "Encuesta Clasificación Marcas" (UserPilot), cruzado según esquema de medición
          del 16-jul-2026. Datos estáticos de Fase 1 — no hay conexión a Supabase todavía; la próxima
          carga semanal reemplaza este archivo, no lo acumula.
        </p>
        <div style={{
          ...card, marginTop: 16, background: "#ECFEFF", borderColor: "#A5F3FC",
          fontSize: 13, color: "#155E75", lineHeight: 1.5,
        }}>
          <b>{stats.consumioSinOrden} de {stats.poblacion}</b> marcas ({Math.round((stats.consumioSinOrden / stats.poblacion) * 100)}%)
          que aún no crearon su primera orden sí completaron al menos un camino del onboarding
          (<code>bodega</code> / <code>producto</code> / <code>orden_manual</code> / <code>integraciones</code>) —
          no están en silencio total. Solo <b>{stats.sinConsumoSinOrden}</b> no muestran ninguna señal de consumo.
          Dentro de las que consumieron sin ordenar, <b>{stats.ordenManualSinOrden}</b> completaron puntualmente
          el camino <code>orden_manual</code> sin llegar a crear la orden real — la brecha entre "aprendió el paso"
          y "lo ejecutó" se concentra ahí. Cruce: <code>Onboarding_Match.csv</code> (fuente: eventos de producto
          UserPilot), columna <code>Caminos</code> de la tabla.
        </div>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
          Filas resaltadas y con badge <span style={tag("#B45309", "#FEF3C7")}>Cuenta previa</span> = <code>Signed Up</code>{" "}
          es anterior al {CORTE_COHORTE} (lanzamiento del tour) — la marca ya existía y solo llenó la encuesta de
          clasificación tarde, así que entra a esta cohorte por <code>Submitted At</code> pero no estuvo expuesta
          al onboarding nuevo desde el día 1 de su registro. Son {" "}
          {RESULTADO_SEMANAL.filter((r) => r.signedUp < CORTE_COHORTE).length} de {stats.poblacion} — sus resultados
          no deberían usarse para juzgar si el onboarding funciona.
        </p>
        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, lineHeight: 1.5 }}>
          <b>Nivel madurez (ref.)</b> se deriva de la respuesta a "7.¿Cuántas ventas realiza tu marca al mes?" de
          la encuesta de clasificación, mapeada a los rangos oficiales (Iniciando 1–50 · Creciendo 51–300 ·
          Consolidando 301–700 · Pre-Escalando 701–1.000 · Escalando 1.001+). Es <b>autodeclarado</b> al momento
          de responder la encuesta — no medido sobre <code>ordenes_mes_propias</code> (métrica oficial del
          framework) — y "301 a 1.000 al mes" no permite distinguir Consolidando de Pre-Escalando, por eso va
          combinado. Úsalo como referencia de volumen esperado, no como el dato validado de madurez.
        </p>
      </div>
    </main>
  );
}
