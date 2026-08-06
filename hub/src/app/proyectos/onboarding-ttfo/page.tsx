"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { buscarDefinicion } from "@/lib/onboarding-ttfo/registroSlots";
import { repararMojibake } from "@/lib/onboarding-ttfo/texto";
import type { SlotId } from "@/lib/onboarding-ttfo/tipos";

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

type EstadoMeta7d = "exito" | "fracaso" | "en_observacion" | "sin_signed_up";
type Gatillo = "gatillo_cerrado" | "activacion_sin_atribucion_cerrada" | "sin_atribucion";

interface FilaAPI {
  userId: number;
  submittedAt: string;
  signedUp: string;
  primeraOrden: string | null;
  ttfoDias: number | null;
  estadoMeta7d: EstadoMeta7d;
  gatillo: Gatillo;
  segmento: "marca" | "proveedor" | null;
  esPrueba: boolean;
  caminos: string;
  ordenesCreadas: number | null;
  ordenesEntregadas: number | null;
  ventasMesDeclaradas: string | null;
}

interface AlertasAPI {
  flujoCompletoYOrden: { userId: number; segmento: string | null }[];
  ordenSinFlujo: { userId: number; segmento: string | null }[];
  mayorCaidaPorPaso: {
    slot: string; poblacion: number; caidaAbsoluta: number; caidaRelativa: number;
    marca: { poblacion: number; caidaAbsoluta: number; caidaRelativa: number };
    proveedor: { poblacion: number; caidaAbsoluta: number; caidaRelativa: number };
  }[];
  videoAEncuesta: {
    poblacionVideo: number; poblacionEncuesta: number; caidaAbsoluta: number; caidaRelativa: number;
    marca: { poblacionVideo: number; poblacionEncuesta: number };
    proveedor: { poblacionVideo: number; poblacionEncuesta: number };
  };
  segmentoConMasCaida: {
    marca: { poblacion: number; avanzan: number; pct: number };
    proveedor: { poblacion: number; avanzan: number; pct: number };
  };
}

interface ResumenTTFO {
  poblacion: number; activados: number; pctActivados: number;
  ttfoMedianaDias: number | null; ttfoPromedioDias: number | null;
}
interface ResumenGrupoOnboarding extends ResumenTTFO {
  marca: ResumenTTFO;
  proveedor: ResumenTTFO;
}
interface ComparacionOnboardingAPI {
  corteOnboarding: string;
  desdeFecha: string;
  conOnboarding: ResumenGrupoOnboarding;
  sinOnboarding: ResumenGrupoOnboarding;
  cuentasDePrueba: number;
}

const META_DIAS = 7;
const BASELINE_MEDIANA_HISTORICA = 11;
const BASELINE_PROMEDIO_HISTORICO = 21;
const CORTE_COHORTE = "2026-07-28"; // modificación definitiva del flujo de onboarding

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

const MADUREZ_DECLARADA: Record<string, { label: string; color: string; bg: string }> = {
  "Aún no vendo": { label: "Aún no vendo", color: "#9CA3AF", bg: "#F3F4F6" },
  "Menos de 50 al mes": { label: "Iniciando", color: "#3B82F6", bg: "#EFF6FF" },
  "51 a 300 al mes": { label: "Creciendo", color: "#10B981", bg: "#ECFDF5" },
  "301 a 1.000 al mes": { label: "Consolidando / Pre-Escalando", color: "#F59E0B", bg: "#FFFBEB" },
  "Más de 1.000 al mes": { label: "Escalando", color: "#DC2626", bg: "#FEF2F2" },
};
const SEGMENTO_VACIO = { poblacion: 0, caidaAbsoluta: 0, caidaRelativa: 0 };

/**
 * Rellena campos que un `alertas` guardado con una versión anterior del
 * código puede no tener (ej. `videoAEncuesta` y el desglose marca/proveedor
 * de `mayorCaidaPorPaso`, agregados 05-ago-2026) — para que ver el tablero
 * antes de la próxima carga no tumbe la página con un undefined.
 */
function normalizarAlertas(alertas: AlertasAPI | null): AlertasAPI | null {
  if (!alertas) return alertas;
  return {
    ...alertas,
    mayorCaidaPorPaso: (alertas.mayorCaidaPorPaso ?? []).map(p => ({
      ...p, marca: p.marca ?? SEGMENTO_VACIO, proveedor: p.proveedor ?? SEGMENTO_VACIO,
    })),
    videoAEncuesta: alertas.videoAEncuesta ?? {
      poblacionVideo: 0, poblacionEncuesta: 0, caidaAbsoluta: 0, caidaRelativa: 0,
      marca: { poblacionVideo: 0, poblacionEncuesta: 0 }, proveedor: { poblacionVideo: 0, poblacionEncuesta: 0 },
    },
  };
}

function nivelMadurezDeclarado(valorCrudo: string | null): { label: string; color: string; bg: string } {
  const valor = repararMojibake(valorCrudo);
  if (!valor || valor === "-") return { label: "No documentado", color: "#9CA3AF", bg: "#F3F4F6" };
  return MADUREZ_DECLARADA[valor] ?? { label: `No documentado (${valor})`, color: "#9CA3AF", bg: "#F3F4F6" };
}

function TarjetaGrupoOnboarding({ titulo, sub, color, r }: { titulo: string; sub: string; color: string; r: ResumenTTFO }) {
  return (
    <div style={{ ...card, flex: 1, minWidth: 240 }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 4 }}>{titulo}</div>
      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 12 }}>{sub}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 32, fontWeight: 800, color }}>{r.ttfoMedianaDias ?? "—"}</span>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>días · mediana TTFO</span>
      </div>
      <div style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 10 }}>
        Promedio: {r.ttfoPromedioDias !== null ? r.ttfoPromedioDias.toFixed(1) : "—"} días
      </div>
      <div style={{ fontSize: 12.5, color: "var(--fg)" }}>
        {r.activados} de {r.poblacion} activaron ({Math.round(r.pctActivados * 100)}%)
      </div>
    </div>
  );
}

type Filtro = "todos" | EstadoMeta7d;
type FiltroSegmento = "todos" | "marca" | "proveedor";
const OPCIONES_MADUREZ = ["Aún no vendo", "Iniciando", "Creciendo", "Consolidando / Pre-Escalando", "Escalando", "No documentado"];

export default function OnboardingTTFOPage() {
  const [filas, setFilas] = useState<FilaAPI[]>([]);
  const [alertas, setAlertas] = useState<AlertasAPI | null>(null);
  const [comparacionOnboarding, setComparacionOnboarding] = useState<ComparacionOnboardingAPI | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtro, setFiltro] = useState<Filtro>("exito");
  const [filtroSegmento, setFiltroSegmento] = useState<FiltroSegmento>("todos");
  const [filtroMadurez, setFiltroMadurez] = useState<string>("todos");
  const [signedUpDesde, setSignedUpDesde] = useState("");
  const [submittedAtDesde, setSubmittedAtDesde] = useState("");
  const [hayRespaldoHistorico, setHayRespaldoHistorico] = useState(false);
  const [hayRespaldoRawData, setHayRespaldoRawData] = useState(false);
  const [funnelAbierto, setFunnelAbierto] = useState(false);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/proyectos/onboarding-ttfo");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error cargando datos");
      setFilas(data.filas ?? []);
      setAlertas(normalizarAlertas(data.alertas ?? null));
      setComparacionOnboarding(data.comparacionOnboarding ?? null);
      setHayRespaldoHistorico(Boolean(data.hayRespaldoHistorico));
      setHayRespaldoRawData(Boolean(data.hayRespaldoRawData));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  const stats = useMemo(() => {
    const poblacion = filas.filter(r => !r.esPrueba).length;
    const activadas = filas.filter(r => !r.esPrueba && r.primeraOrden !== null).length;
    const exito = filas.filter(r => !r.esPrueba && r.estadoMeta7d === "exito").length;
    const fracaso = filas.filter(r => !r.esPrueba && r.estadoMeta7d === "fracaso").length;
    const observacion = filas.filter(r => !r.esPrueba && r.estadoMeta7d === "en_observacion").length;
    const gatillo = filas.filter(r => !r.esPrueba && r.gatillo === "gatillo_cerrado").length;
    const conVeredicto = exito + fracaso;
    const consumioSinOrden = filas.filter(r => !r.esPrueba && r.primeraOrden === null && r.caminos !== "").length;
    const sinConsumoSinOrden = filas.filter(r => !r.esPrueba && r.primeraOrden === null && r.caminos === "").length;
    const cuentasDePrueba = filas.filter(r => r.esPrueba).length;
    return { poblacion, activadas, exito, fracaso, observacion, gatillo, conVeredicto, consumioSinOrden, sinConsumoSinOrden, cuentasDePrueba };
  }, [filas]);

  // Aplica los 4 filtros activos, pudiendo omitir uno — así el mismo cálculo
  // sirve para la lista visible (no omite nada) y para los conteos "por
  // faceta" de cada dropdown (omite la dimensión propia del dropdown, para
  // que el número mostrado sea "cuántos quedan si elijo esta opción", no
  // "cuántos hay ya filtrando por mí mismo").
  type DimensionFiltro = "estado" | "segmento" | "madurez" | "fechas";
  const pasaFiltros = useCallback((r: FilaAPI, omitir?: DimensionFiltro) => {
    if (omitir !== "estado" && filtro !== "todos" && r.estadoMeta7d !== filtro) return false;
    if (omitir !== "segmento" && filtroSegmento !== "todos" && r.segmento !== filtroSegmento) return false;
    if (omitir !== "madurez" && filtroMadurez !== "todos") {
      const label = nivelMadurezDeclarado(r.ventasMesDeclaradas).label;
      const calza = filtroMadurez === "No documentado" ? label.startsWith("No documentado") : label === filtroMadurez;
      if (!calza) return false;
    }
    // Mismas reglas de fecha para todos los orígenes (CSV histórico y Raw
    // Data quedan mezclados en la misma `encuesta` desde el empalme — no hay
    // un campo de "fuente" separado, así que estos filtros son la forma de
    // aislar visualmente lo que entró vía automatización: sus Signed
    // Up/Submitted At van a caer después del corte de empalme).
    if (omitir !== "fechas") {
      if (signedUpDesde && r.signedUp < signedUpDesde) return false;
      if (submittedAtDesde && r.submittedAt < submittedAtDesde) return false;
    }
    return true;
  }, [filtro, filtroSegmento, filtroMadurez, signedUpDesde, submittedAtDesde]);

  const filasNoPrueba = useMemo(() => filas.filter(r => !r.esPrueba), [filas]);

  const filasVisibles = useMemo(() => {
    return [...filasNoPrueba.filter(r => pasaFiltros(r))].sort((a, b) => a.submittedAt.localeCompare(b.submittedAt));
  }, [filasNoPrueba, pasaFiltros]);

  // Conteos por opción de cada filtro, calculados sobre las OTRAS 3
  // dimensiones activas (sin contar la propia) — a pedido de Kate
  // (05-ago-2026): "totalice la cantidad de usuarios por cada filtro que se
  // aplique".
  //
  // El 100% de referencia para el % del header NO puede ser siempre el
  // cohorte combinado — corrección de Kate (05-ago-2026): "castiga mucho a
  // marcas si indicas que el 100% es de proveedores, cada uno debe manejar
  // su 100%". Si el filtro de Segmento está en "Solo Marca"/"Solo
  // Proveedor", el 100% es el total de ESE segmento (fijo, no se mueve con
  // los demás filtros); si está en "todos", el 100% es el cohorte completo.
  const poblacionTotalCohorte = filasNoPrueba.length;
  const poblacionMarcaTotal = useMemo(() => filasNoPrueba.filter(r => r.segmento === "marca").length, [filasNoPrueba]);
  const poblacionProveedorTotal = useMemo(() => filasNoPrueba.filter(r => r.segmento === "proveedor").length, [filasNoPrueba]);
  const referencia100 = filtroSegmento === "marca"
    ? { total: poblacionMarcaTotal, etiqueta: "de Marca" }
    : filtroSegmento === "proveedor"
    ? { total: poblacionProveedorTotal, etiqueta: "de Proveedor" }
    : { total: poblacionTotalCohorte, etiqueta: "del cohorte" };

  // Con filtro de Segmento en "todos" un solo % combinado vuelve a mezclar
  // Marca y Proveedor (el problema que ya corregimos) — acá se parte en dos,
  // cada uno contra su propio 100%, para que "todos" no pierda la lectura
  // segmentada.
  const desgloseVisibleSegmento = useMemo(() => ({
    marca: filasVisibles.filter(r => r.segmento === "marca").length,
    proveedor: filasVisibles.filter(r => r.segmento === "proveedor").length,
  }), [filasVisibles]);
  const conteosSegmento = useMemo(() => {
    const base = filasNoPrueba.filter(r => pasaFiltros(r, "segmento"));
    return {
      todos: base.length,
      marca: base.filter(r => r.segmento === "marca").length,
      proveedor: base.filter(r => r.segmento === "proveedor").length,
    };
  }, [filasNoPrueba, pasaFiltros]);
  const conteosMadurez = useMemo(() => {
    const base = filasNoPrueba.filter(r => pasaFiltros(r, "madurez"));
    const porNivel: Record<string, number> = { todos: base.length };
    for (const m of OPCIONES_MADUREZ) {
      porNivel[m] = base.filter(r => {
        const label = nivelMadurezDeclarado(r.ventasMesDeclaradas).label;
        return m === "No documentado" ? label.startsWith("No documentado") : label === m;
      }).length;
    }
    return porNivel;
  }, [filasNoPrueba, pasaFiltros]);

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <a href="/celula/brands" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>
          Activación Bruta · Onboarding TTFO
        </span>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
            <span style={{
              fontSize: 11, fontWeight: 700, background: "var(--dropi-light)",
              color: "var(--dropi, #F77F00)", padding: "3px 9px", borderRadius: 20,
            }}>
              TTFO-001
            </span>
            <span style={tag("#6366F1", "#EEF2FF")}>Fase 3 · CSV local (sin BD por ahora)</span>
            {stats.cuentasDePrueba > 0 && (
              <span style={tag("#B45309", "#FEF3C7")}>{stats.cuentasDePrueba} cuenta(s) de prueba excluida(s)</span>
            )}
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
            Onboarding guiado (tour in-app) · Activación Bruta TTFO
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Baseline histórico (método viejo): mediana <b>{BASELINE_MEDIANA_HISTORICA} días</b>, promedio{" "}
            {BASELINE_PROMEDIO_HISTORICO} días. Meta: bajar la mediana a <b>{META_DIAS} días</b>.
            Cohorte acumulado desde la modificación definitiva del flujo de onboarding
            (<code>Submitted At</code> ≥ {CORTE_COHORTE}) — crece con cada carga nueva, no se resetea semana a
            semana. Sin fuente separada de órdenes reales todavía: <code>primeraOrden</code> es un proxy tomado
            del evento/modal "Enviar al cliente" de UserPilot.
          </p>
        </div>

        {error && (
          <div style={{ ...card, marginBottom: 24, background: "#FEF2F2", borderColor: "#FECACA", color: "#991B1B" }}>
            {error}
          </div>
        )}

        {/* Lo que hemos logrado — comparación con/sin onboarding guiado */}
        {comparacionOnboarding && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
              Lo que hemos logrado — ¿el onboarding guiado baja el TTFO?
            </h2>
            <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
              Encuestados entre <b>{comparacionOnboarding.desdeFecha}</b> y <b>{comparacionOnboarding.corteOnboarding}</b> (sin
              el tour, método viejo) vs. desde esa fecha (con el flujo definitivo). Snapshot de la última carga, no
              se recalcula solo.
            </p>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 10 }}>
              <TarjetaGrupoOnboarding
                titulo="Sin onboarding guiado"
                sub={`Encuesta ${comparacionOnboarding.desdeFecha} → ${comparacionOnboarding.corteOnboarding}`}
                color="#6B7280"
                r={comparacionOnboarding.sinOnboarding}
              />
              <TarjetaGrupoOnboarding
                titulo="Con onboarding guiado"
                sub={`Encuesta desde el ${comparacionOnboarding.corteOnboarding}`}
                color="#10B981"
                r={comparacionOnboarding.conOnboarding}
              />
            </div>

            <div style={{ ...card, padding: 0, overflow: "hidden", marginBottom: 10 }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>
                Desglose por segmento
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Segmento</th>
                    <th style={thStyle}>Sin onboarding — mediana TTFO</th>
                    <th style={thStyle}>Sin onboarding — % activó</th>
                    <th style={thStyle}>Con onboarding — mediana TTFO</th>
                    <th style={thStyle}>Con onboarding — % activó</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={tdStyle}><span style={tag("#3B82F6", "#EFF6FF")}>Marca</span></td>
                    <td style={tdStyle}>{comparacionOnboarding.sinOnboarding.marca.ttfoMedianaDias ?? "—"} días</td>
                    <td style={tdStyle}>{Math.round(comparacionOnboarding.sinOnboarding.marca.pctActivados * 100)}% ({comparacionOnboarding.sinOnboarding.marca.activados}/{comparacionOnboarding.sinOnboarding.marca.poblacion})</td>
                    <td style={tdStyle}>{comparacionOnboarding.conOnboarding.marca.ttfoMedianaDias ?? "—"} días</td>
                    <td style={tdStyle}>{Math.round(comparacionOnboarding.conOnboarding.marca.pctActivados * 100)}% ({comparacionOnboarding.conOnboarding.marca.activados}/{comparacionOnboarding.conOnboarding.marca.poblacion})</td>
                  </tr>
                  <tr>
                    <td style={tdStyle}><span style={tag("#F97316", "#FFF7ED")}>Proveedor</span></td>
                    <td style={tdStyle}>{comparacionOnboarding.sinOnboarding.proveedor.ttfoMedianaDias ?? "—"} días</td>
                    <td style={tdStyle}>{Math.round(comparacionOnboarding.sinOnboarding.proveedor.pctActivados * 100)}% ({comparacionOnboarding.sinOnboarding.proveedor.activados}/{comparacionOnboarding.sinOnboarding.proveedor.poblacion})</td>
                    <td style={tdStyle}>{comparacionOnboarding.conOnboarding.proveedor.ttfoMedianaDias ?? "—"} días</td>
                    <td style={tdStyle}>{Math.round(comparacionOnboarding.conOnboarding.proveedor.pctActivados * 100)}% ({comparacionOnboarding.conOnboarding.proveedor.activados}/{comparacionOnboarding.conOnboarding.proveedor.poblacion})</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p style={{ fontSize: 11, color: "#92400E", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 10px", lineHeight: 1.5 }}>
              ⚠️ TTFO acá es un proxy — la activación se mide con el evento <b>"Enviar al cliente"</b> (o el modal
              "Felicidades orden manual creada" cuando falta la fila directa del evento, por la regla de
              paralelismo), no la fecha real de la orden en la plataforma. Comparable entre grupos y segmentos,
              pero no reemplaza el baseline oficial de {BASELINE_MEDIANA_HISTORICA} días de arriba.
            </p>
          </div>
        )}

        {/* Alertas */}
        {alertas && (
          <div style={{ marginBottom: 24 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 10 }}>Alertas</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
              <div style={card}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  A · Flujo completo + orden
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#10B981" }}>{alertas.flujoCompletoYOrden.length}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                  Consumieron el flujo entero y crearon su orden, atribuible al onboarding.
                </div>
              </div>
              <div style={card}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  B · Orden sin flujo completo
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#F59E0B" }}>{alertas.ordenSinFlujo.length}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                  Dispararon el evento de crear orden sin haber completado los 3 caminos, dentro del cohorte.
                </div>
              </div>
              <div style={card}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  C · Mayor caída por paso
                </div>
                {alertas.mayorCaidaPorPaso.length > 0 ? (() => {
                  const lista = alertas.mayorCaidaPorPaso;
                  let peorIdx = 0;
                  for (let i = 1; i < lista.length; i++) {
                    if (lista[i].caidaAbsoluta > lista[peorIdx].caidaAbsoluta) peorIdx = i;
                  }
                  const peor = lista[peorIdx];
                  const anterior = peorIdx > 0 ? lista[peorIdx - 1] : null;
                  const etiquetaPeor = buscarDefinicion(peor.slot as SlotId).etiqueta;
                  const etiquetaAnterior = anterior ? buscarDefinicion(anterior.slot as SlotId).etiqueta : "la Encuesta (población total)";
                  const poblacionBase = anterior ? anterior.poblacion : peor.poblacion + peor.caidaAbsoluta;
                  return (
                    <>
                      <div style={{ fontSize: 18, fontWeight: 800, color: "#EF4444" }}>{etiquetaPeor}</div>
                      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6 }}>
                        {poblacionBase} usuarios (100%) en {etiquetaAnterior} → -{peor.caidaAbsoluta} usuarios
                        ({Math.round(peor.caidaRelativa * 100)}%).
                      </div>
                    </>
                  );
                })() : (
                  <div style={{ fontSize: 12, color: "var(--muted)" }}>Sin datos de la última carga todavía.</div>
                )}
                {alertas.videoAEncuesta && (
                <div style={{ borderTop: "1px solid var(--border)", marginTop: 10, paddingTop: 10 }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>
                    Otro paso a revisar
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: alertas.videoAEncuesta.caidaAbsoluta > 0 ? "#EF4444" : "#B45309", marginTop: 2 }}>
                    ① Video Bienvenida → Encuesta
                  </div>
                  {alertas.videoAEncuesta.caidaAbsoluta > 0 ? (
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                      {alertas.videoAEncuesta.poblacionVideo} vieron el video (cohorte desde 28-jul-2026) → solo{" "}
                      {alertas.videoAEncuesta.poblacionEncuesta} respondieron la Encuesta
                      {" "}(-{alertas.videoAEncuesta.caidaAbsoluta}, {Math.round(alertas.videoAEncuesta.caidaRelativa * 100)}%).
                      Es el primer tramo del flujo (Bienvenida → Encuesta → Bodega → Producto → Orden) y hoy es
                      invisible en el funnel de abajo, porque ese cálculo solo mira población ya dentro del cohorte
                      (que por definición ya respondió la Encuesta).
                    </div>
                  ) : (
                    <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>
                      No se puede leer como caída real: solo <b>{alertas.videoAEncuesta.poblacionVideo}</b> filas con
                      evidencia de Video Bienvenida dentro del cohorte desde 28-jul-2026, contra{" "}
                      <b>{alertas.videoAEncuesta.poblacionEncuesta}</b> de Encuesta — el archivo de Bienvenida no
                      cubre bien ni siquiera esta ventana (revisar con Miguel/UserPilot su cobertura real). No sirve
                      para medir este tramo hasta que se corrija esa cobertura.
                    </div>
                  )}
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
                    <span style={tag("#3B82F6", "#DBEAFE")}>Marca</span>{" "}
                    {alertas.videoAEncuesta.marca.poblacionVideo} video / {alertas.videoAEncuesta.marca.poblacionEncuesta} encuesta
                    {"  "}
                    <span style={{ ...tag("#F97316", "#FFEDD5"), marginLeft: 8 }}>Proveedor</span>{" "}
                    {alertas.videoAEncuesta.proveedor.poblacionVideo} video / {alertas.videoAEncuesta.proveedor.poblacionEncuesta} encuesta
                  </div>
                </div>
                )}
              </div>
              <div style={card}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", marginBottom: 8 }}>
                  D · Marca vs. Proveedor
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 4 }}>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#3B82F6" }}>
                      {Math.round(alertas.segmentoConMasCaida.marca.pct * 100)}%
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      Marca ({alertas.segmentoConMasCaida.marca.avanzan}/{alertas.segmentoConMasCaida.marca.poblacion})
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#F97316" }}>
                      {Math.round(alertas.segmentoConMasCaida.proveedor.pct * 100)}%
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)" }}>
                      Proveedor ({alertas.segmentoConMasCaida.proveedor.avanzan}/{alertas.segmentoConMasCaida.proveedor.poblacion})
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 10, lineHeight: 1.5 }}>
                  % que tocó al menos un paso del tour guiado (un Modal o Tour que llegó a "Completado" o
                  "Descartado") — no exige que lo haya terminado, solo que interactuó con él. No mide si creó
                  bodega, producto u orden reales: eso es un dato aparte (ver caso 960524, que operó completo sin
                  tocar ningún paso del tour).
                </div>
              </div>
            </div>

            {(() => {
              // Conclusión: solo se compara caída entre pasos Modal/Tour
              // consecutivos (misma familia de fuente) — los pasos "Evento"
              // quedan afuera de esta comparación porque su población ya no
              // es comparable 1-a-1 desde que Raw Data dejó de mandarlos (ver
              // nota de abajo). Es la transición con mayor caída LIMPIA, no
              // la mayor caída del funnel completo (esa puede incluir ruido
              // de fuentes mezcladas).
              const lista = alertas.mayorCaidaPorPaso;
              let peorIdx = -1;
              for (let i = 1; i < lista.length; i++) {
                const actual = buscarDefinicion(lista[i].slot as SlotId);
                const anterior = buscarDefinicion(lista[i - 1].slot as SlotId);
                if (actual.tipoPaso === "evento" || anterior.tipoPaso === "evento") continue;
                if (peorIdx === -1 || lista[i].caidaAbsoluta > lista[peorIdx].caidaAbsoluta) peorIdx = i;
              }
              if (peorIdx === -1) return null;
              const peor = lista[peorIdx];
              const anterior = lista[peorIdx - 1];
              const etiquetaPeor = buscarDefinicion(peor.slot as SlotId).etiqueta;
              const etiquetaAnterior = buscarDefinicion(anterior.slot as SlotId).etiqueta;
              return (
                <div style={{
                  ...card, marginTop: 16, background: "#EFF6FF", borderColor: "#BFDBFE",
                  fontSize: 13, color: "#1E3A8A", lineHeight: 1.6,
                }}>
                  <b>Dónde poner el ojo:</b> la caída más grande y más confiable del funnel está entre{" "}
                  <b>"{etiquetaAnterior}"</b> y <b>"{etiquetaPeor}"</b> — de {anterior.poblacion} usuarios,{" "}
                  <b>{peor.caidaAbsoluta} ({Math.round(peor.caidaRelativa * 100)}%)</b> no llegan al siguiente paso.
                  Es la transición Modal/Tour más grande de todo el funnel (comparando solo pasos con la misma
                  fuente de población, sin el ruido de los pasos "Evento" — ver nota abajo).
                  <div style={{ display: "flex", gap: 20, marginTop: 8, fontSize: 12.5 }}>
                    <span>
                      <span style={tag("#3B82F6", "#DBEAFE")}>Marca</span>{" "}
                      {anterior.marca.poblacion} → {peor.marca.poblacion} (-{peor.marca.caidaAbsoluta}, {Math.round(peor.marca.caidaRelativa * 100)}%)
                    </span>
                    <span>
                      <span style={tag("#F97316", "#FFEDD5")}>Proveedor</span>{" "}
                      {anterior.proveedor.poblacion} → {peor.proveedor.poblacion} (-{peor.proveedor.caidaAbsoluta}, {Math.round(peor.proveedor.caidaRelativa * 100)}%)
                    </span>
                  </div>
                  <div style={{ marginTop: 8 }}>
                    Ahí es donde un esfuerzo de producto tiene más chance de mover el número, no en los pasos con
                    menos gente porque ya vienen filtrados por las caídas de antes.
                  </div>
                </div>
              );
            })()}

            <div style={{ ...card, padding: 0, overflow: "hidden", marginTop: 16 }}>
              <button
                onClick={() => setFunnelAbierto(v => !v)}
                style={{
                  width: "100%", textAlign: "left", background: "none", border: "none", cursor: "pointer",
                  padding: "10px 16px", fontSize: 12, fontWeight: 700, color: "var(--fg)",
                  display: "flex", alignItems: "center", gap: 8,
                }}
              >
                {funnelAbierto ? "▾" : "▸"} Funnel completo — los 14 pasos, no solo el de mayor caída
              </button>
              {funnelAbierto && (
                <>
                  <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", borderTop: "1px solid var(--border)" }}>
                    <thead>
                      <tr>
                        <th style={thStyle}>Paso</th>
                        <th style={thStyle}>Camino</th>
                        <th style={thStyle}>Marca</th>
                        <th style={thStyle}>Proveedor</th>
                        <th style={thStyle}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {alertas.mayorCaidaPorPaso.map((paso, i) => {
                        const def = buscarDefinicion(paso.slot as SlotId);
                        const caminoAnterior = i > 0 ? buscarDefinicion(alertas.mayorCaidaPorPaso[i - 1].slot as SlotId).camino : null;
                        const nuevoCamino = def.camino !== caminoAnterior;
                        const CAMINO_LABEL: Record<string, string> = {
                          bodega: "Bodega", producto: "Producto", orden_manual: "Orden manual", integraciones: "Integraciones",
                        };
                        const celda = (pob: number, caidaAbs: number, caidaRel: number, color: string) => (
                          <td style={tdStyle}>
                            <span style={{ fontWeight: 700, color }}>{pob}</span>
                            {i > 0 && (
                              <span style={{ color: caidaAbs > 0 ? "#EF4444" : "var(--muted)", marginLeft: 6, fontSize: 11.5 }}>
                                (-{caidaAbs}, {Math.round(caidaRel * 100)}%)
                              </span>
                            )}
                          </td>
                        );
                        return (
                          <tr key={paso.slot} style={nuevoCamino ? { borderTop: "2px solid var(--border)" } : undefined}>
                            <td style={tdStyle}>{def.etiqueta}</td>
                            <td style={tdStyle}>
                              {def.camino
                                ? <span style={tag("#6366F1", "#EEF2FF")}>{CAMINO_LABEL[def.camino] ?? def.camino}</span>
                                : <span style={{ ...tag("#9CA3AF", "#F3F4F6") }}>Obligatorio (todos)</span>}
                            </td>
                            {celda(paso.marca.poblacion, paso.marca.caidaAbsoluta, paso.marca.caidaRelativa, "#3B82F6")}
                            {celda(paso.proveedor.poblacion, paso.proveedor.caidaAbsoluta, paso.proveedor.caidaRelativa, "#F97316")}
                            {celda(paso.poblacion, paso.caidaAbsoluta, paso.caidaRelativa, "var(--fg)")}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  </div>
                  <div style={{ padding: "8px 16px", fontSize: 11, color: "var(--muted)", borderTop: "1px solid var(--border)", lineHeight: 1.5 }}>
                    "① Video Bienvenida" es el único paso obligatorio para todos, sin importar el camino que sigan
                    después. Los otros 13 pertenecen a uno de los 4 caminos (Bodega, Producto, Orden manual,
                    Integraciones) — la caída se mide contra el paso inmediatamente anterior en esta lista, no
                    contra el total de la Encuesta. Los pasos "Evento" pueden mostrar caída negativa (población
                    sube): desde que Raw Data dejó de mandar eventos, su población depende casi solo del CSV
                    histórico mientras que Modal/Tour ya mezcla histórico + Raw Data — son fuentes distintas, no
                    directamente comparables paso a paso.
                  </div>
                </>
              )}
            </div>
          </div>
        )}

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
              <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>
                {c.label}
              </div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: c.color, lineHeight: 1 }}>
                {cargando ? "…" : c.value}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          ...card, marginBottom: 24, background: "#FFFBEB", borderColor: "#FDE68A",
          fontSize: 13, color: "#92400E", lineHeight: 1.5,
        }}>
          <b>{stats.observacion} de {stats.poblacion}</b> marcas siguen "en observación" — aún no se cumplen
          los {META_DIAS} días desde su <code>Signed Up</code>, así que no cuentan todavía como éxito ni fracaso.
          Solo <b>{stats.conVeredicto}</b> tienen veredicto cerrado por ahora.
        </div>

        <InstruccionesDeCarga />
        <SeccionCarga onImportado={cargar} />
        <BotonDeshacer
          hayRespaldo={hayRespaldoHistorico}
          onImportado={cargar}
          ruta="/api/proyectos/onboarding-ttfo/deshacer-historico"
          etiqueta="Deshacer última carga histórica (CSV)"
          confirmacion="¿Volver a la base histórica de antes de la última carga de CSV? Esto también descarta cualquier Raw Data sumado desde entonces."
        />
        <SeccionCargaRawData onImportado={cargar} />
        <BotonDeshacer
          hayRespaldo={hayRespaldoRawData}
          onImportado={cargar}
          ruta="/api/proyectos/onboarding-ttfo/deshacer-raw-data"
          etiqueta="Deshacer última carga de Raw Data"
          confirmacion="¿Volver al estado de justo antes de la última carga de Raw Data? La base histórica no se toca."
        />
        <SeccionExclusiones />

        <div style={{ ...card, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
              {(() => {
                const singular = filtroSegmento === "marca" ? "marca" : filtroSegmento === "proveedor" ? "proveedor" : "usuario";
                const plural = filtroSegmento === "proveedor" ? "proveedores" : `${singular}s`;
                const etiquetaPoblacion = filasVisibles.length === 1 ? singular : plural;
                return <>Resultado acumulado · {filasVisibles.length} {etiquetaPoblacion}</>;
              })()}{" "}
              {filtroSegmento === "todos" ? (
                <span style={{ fontWeight: 600, color: "var(--muted)" }}>
                  (<span style={{ color: "#3B82F6" }}>Marca: {desgloseVisibleSegmento.marca} —{" "}
                    {poblacionMarcaTotal > 0 ? Math.round((desgloseVisibleSegmento.marca / poblacionMarcaTotal) * 100) : 0}% de {poblacionMarcaTotal}</span>
                  {" · "}
                  <span style={{ color: "#F97316" }}>Proveedor: {desgloseVisibleSegmento.proveedor} —{" "}
                    {poblacionProveedorTotal > 0 ? Math.round((desgloseVisibleSegmento.proveedor / poblacionProveedorTotal) * 100) : 0}% de {poblacionProveedorTotal}</span>
                  {" "}— cohorte desde 28-jul-2026)
                </span>
              ) : (
                <span style={{ fontWeight: 600, color: "var(--muted)" }}>
                  ({referencia100.total > 0 ? Math.round((filasVisibles.length / referencia100.total) * 100) : 0}%
                  {" "}{referencia100.etiqueta} — {referencia100.total} desde 28-jul-2026)
                </span>
              )}
            </span>
            <div style={{ display: "flex", gap: 6, marginLeft: "auto", flexWrap: "wrap", alignItems: "center" }}>
              {(["todos", "exito", "en_observacion"] as Filtro[]).map((f) => (
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
              <select
                value={filtroSegmento}
                onChange={e => setFiltroSegmento(e.target.value as FiltroSegmento)}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "5px 8px", borderRadius: 8,
                  border: "1px solid var(--border)", cursor: "pointer",
                  background: "#fff", color: "var(--muted)",
                }}
              >
                <option value="todos">Marca / Proveedor ({conteosSegmento.todos})</option>
                <option value="marca">Solo Marca ({conteosSegmento.marca})</option>
                <option value="proveedor">Solo Proveedor ({conteosSegmento.proveedor})</option>
              </select>
              <select
                value={filtroMadurez}
                onChange={e => setFiltroMadurez(e.target.value)}
                style={{
                  fontSize: 12, fontWeight: 600, padding: "5px 8px", borderRadius: 8,
                  border: "1px solid var(--border)", cursor: "pointer",
                  background: "#fff", color: "var(--muted)",
                }}
              >
                <option value="todos">Todos los niveles ({conteosMadurez.todos})</option>
                {OPCIONES_MADUREZ.map(m => <option key={m} value={m}>{m} ({conteosMadurez[m] ?? 0})</option>)}
              </select>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--muted)" }}>
                Signed Up desde
                <input
                  type="date"
                  value={signedUpDesde}
                  onChange={e => setSignedUpDesde(e.target.value)}
                  style={{ fontSize: 12, padding: "4px 6px", borderRadius: 8, border: "1px solid var(--border)" }}
                />
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11.5, color: "var(--muted)" }}>
                Submitted At desde
                <input
                  type="date"
                  value={submittedAtDesde}
                  onChange={e => setSubmittedAtDesde(e.target.value)}
                  style={{ fontSize: 12, padding: "4px 6px", borderRadius: 8, border: "1px solid var(--border)" }}
                />
              </label>
              {(signedUpDesde || submittedAtDesde) && (
                <button
                  onClick={() => { setSignedUpDesde(""); setSubmittedAtDesde(""); }}
                  style={{ fontSize: 11.5, color: "var(--muted)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                >
                  Limpiar fechas
                </button>
              )}
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>User ID</th>
                  <th style={thStyle}>Segmento</th>
                  <th style={thStyle}>Submitted At</th>
                  <th style={thStyle}>Signed Up</th>
                  <th style={thStyle}>1ra orden (proxy)</th>
                  <th style={thStyle}>TTFO (días)</th>
                  <th style={thStyle}>Meta 7d</th>
                  <th style={thStyle}>Gatillo onboarding</th>
                  <th style={thStyle}>Caminos</th>
                  <th style={thStyle}>Ventas/mes declaradas</th>
                  <th style={thStyle}>Nivel madurez (ref.)</th>
                </tr>
              </thead>
              <tbody>
                {filasVisibles.map((r) => {
                  const estadoStyle = ESTADO_COLOR[r.estadoMeta7d];
                  const gatilloStyle = GATILLO_COLOR[r.gatillo] ?? GATILLO_COLOR.sin_atribucion;
                  const madurez = nivelMadurezDeclarado(r.ventasMesDeclaradas);
                  const cuentaPrevia = r.signedUp < CORTE_COHORTE;
                  return (
                    <tr key={r.userId} style={cuentaPrevia ? { background: "#FFFBEB" } : undefined}>
                      <td style={tdStyle}>{r.userId}</td>
                      <td style={tdStyle}>
                        {r.segmento
                          ? <span style={tag(r.segmento === "marca" ? "#3B82F6" : "#F97316", r.segmento === "marca" ? "#EFF6FF" : "#FFF7ED")}>{r.segmento}</span>
                          : <span style={{ color: "var(--muted)" }}>—</span>}
                      </td>
                      <td style={tdStyle}>
                        {r.submittedAt}
                        {cuentaPrevia && <span style={{ ...tag("#B45309", "#FEF3C7"), marginLeft: 6 }}>Cuenta previa</span>}
                      </td>
                      <td style={tdStyle}>{r.signedUp}</td>
                      <td style={tdStyle}>{r.primeraOrden ?? "—"}</td>
                      <td style={tdStyle}>{r.ttfoDias ?? "—"}</td>
                      <td style={tdStyle}><span style={tag(estadoStyle.color, estadoStyle.bg)}>{ESTADO_LABEL[r.estadoMeta7d]}</span></td>
                      <td style={tdStyle}><span style={tag(gatilloStyle.color, gatilloStyle.bg)}>{GATILLO_LABEL[r.gatillo] ?? r.gatillo}</span></td>
                      <td style={tdStyle}>{r.caminos || "—"}</td>
                      <td style={tdStyle}>{r.ventasMesDeclaradas ?? "—"}</td>
                      <td style={tdStyle}><span style={tag(madurez.color, madurez.bg)}>{madurez.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 16, lineHeight: 1.5 }}>
          Fuente: cargas subidas desde esta misma página (Encuesta + 11 CSVs del tour de UserPilot), cruzadas con
          el módulo <code>src/lib/onboarding-ttfo</code>. Reemplaza el array estático de la Fase 1
          (<code>data.ts</code>, cohorte 10–15 jul, congelado como referencia histórica del método manual).
        </p>
      </div>
    </main>
  );
}

// ── Instrucciones de carga (para quien gestione esto sin supervisión) ───────

const ARCHIVOS_ESPERADOS: { paso: string; archivo: string }[] = [
  { paso: "Encuesta", archivo: "Encuesta.csv" },
  { paso: "① Video Bienvenida (Modal)", archivo: "Video Bienvenida.csv" },
  { paso: "② Crea tu primera bodega (Modal)", archivo: "Modal Crea tu primera bodega.csv" },
  { paso: "③ Tour bodegas (Tour)", archivo: "Tour guiado bodegas.csv" },
  { paso: "④ Guardar bodega (Evento)", archivo: "Guardar bodega_Bodegas_Bodegas[...].csv" },
  { paso: "⑤ Sube producto (Modal)", archivo: "Modal Sube producto.csv" },
  { paso: "⑥ Tour productos (Tour)", archivo: "Tour guiado productos.csv" },
  { paso: "⑦ Guardar Producto (Evento)", archivo: "Botón guardar Producto_...csv" },
  { paso: "⑧ Felicidades producto creado (Modal)", archivo: "Felicidades producto creado.csv" },
  { paso: "⑨ Tour orden manual (Tour)", archivo: "Tour guiado orden manual.csv" },
  { paso: "⑩ Enviar al cliente (Evento)", archivo: "Enviar al cliente_orden manual_....csv" },
  { paso: "⑪ Felicidades orden manual creada (Modal)", archivo: "Felicidades Orden manual creada.csv" },
  { paso: "⑫ Tour integración con tienda (Tour)", archivo: "Tour guiado integracion con tienda.csv" },
  { paso: "⑬ Token generado (Evento, integraciones)", archivo: "token generado_mis integraciones.csv" },
  { paso: "⑭ Felicidades Integración creada (Modal)", archivo: "Felicidades Integracion creada.csv" },
];

function InstruccionesDeCarga() {
  const [abierto, setAbierto] = useState(false);
  return (
    <div style={{ ...card, marginBottom: 20 }}>
      <button
        onClick={() => setAbierto(v => !v)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13, fontWeight: 700, color: "var(--fg)" }}
      >
        {abierto ? "▾" : "▸"} Instrucciones para cargar la información (leer antes de subir)
      </button>
      {abierto && (
        <div style={{ marginTop: 14, fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
          <p><b>1. Cada carga debe traer la información COMPLETA, no solo lo nuevo.</b> UserPilot no permite
          exportar un delta — cada export trae el histórico entero (la Encuesta puede traer miles de filas desde
          hace meses). Eso está bien: el sistema filtra internamente por <code>Submitted At ≥ 28-jul-2026</code> y
          actualiza (upsert) sin duplicar ni perder lo ya cargado. Nunca recortes un archivo pensando que "ya
          subiste esa parte antes".</p>

          <p><b>2. Archivos que el sistema reconoce</b> (por nombre y por columnas — no hace falta el nombre
          exacto, basta con que contenga las palabras clave):</p>
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 10, fontSize: 12.5 }}>
            <thead>
              <tr><th style={{ ...thStyle, padding: "6px 8px" }}>Paso</th><th style={{ ...thStyle, padding: "6px 8px" }}>Nombre de archivo esperado</th></tr>
            </thead>
            <tbody>
              {ARCHIVOS_ESPERADOS.map(a => (
                <tr key={a.paso}>
                  <td style={{ ...tdStyle, padding: "6px 8px" }}>{a.paso}</td>
                  <td style={{ ...tdStyle, padding: "6px 8px" }}><code>{a.archivo}</code></td>
                </tr>
              ))}
            </tbody>
          </table>

          <p><b>3. Siempre revisar el preview antes de confirmar.</b> Si un archivo aparece en "no reconocido",
          no fuerces la carga — revisa si el nombre cambió o si es el archivo equivocado. Un archivo con
          columnas irreconocibles no rompe el resto del lote, pero tampoco se cuenta en el resultado.</p>

          <p><b>4. Cuentas de prueba.</b> Nombre "Usuario Prueba" o correo de dominio desechable se excluyen
          solos. Si detectas una cuenta de prueba con nombre real (no se detecta automáticamente), agrégala a
          mano en "Cuentas de prueba (exclusión manual)" más abajo — con el motivo, para dejar rastro de por qué.</p>

          <p><b>5. Reglas fijas que no deben cambiar sin discutirlo primero:</b> el corte del cohorte detallado es
          <code> 28-jul-2026</code> (cuando se modificó definitivamente el flujo de onboarding — no confundir con
          la vista de "Activación histórica", que sí acepta cualquier fecha). El evento y el modal final de cada
          camino (orden_manual, integraciones) se tratan como paralelos: si aparece el modal de felicidades, se
          asume que el evento ocurrió aunque no tenga fila propia.</p>
        </div>
      )}
    </div>
  );
}

// ── Exclusión manual de cuentas de prueba ────────────────────────────────────

interface ExclusionAPI { user_id: number; motivo: string; agregado_por: string | null; created_at: string; }

function SeccionExclusiones() {
  const [abierto, setAbierto] = useState(false);
  const [exclusiones, setExclusiones] = useState<ExclusionAPI[]>([]);
  const [userId, setUserId] = useState("");
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);

  const cargarLista = useCallback(async () => {
    const res = await fetch("/api/proyectos/onboarding-ttfo/exclusiones");
    const data = await res.json();
    if (res.ok) setExclusiones(data.exclusiones ?? []);
  }, []);

  useEffect(() => { if (abierto) cargarLista(); }, [abierto, cargarLista]);

  const agregar = async () => {
    const idNum = Number(userId);
    if (!Number.isFinite(idNum) || !motivo.trim()) {
      setError("Falta el User ID (número) o el motivo.");
      return;
    }
    setCargando(true);
    setError(null);
    try {
      const res = await fetch("/api/proyectos/onboarding-ttfo/exclusiones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: idNum, motivo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error al agregar");
      setUserId(""); setMotivo("");
      await cargarLista();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setCargando(false);
    }
  };

  const quitar = async (id: number) => {
    await fetch(`/api/proyectos/onboarding-ttfo/exclusiones?userId=${id}`, { method: "DELETE" });
    await cargarLista();
  };

  return (
    <div style={{ ...card, marginBottom: 24 }}>
      <button
        onClick={() => setAbierto(v => !v)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13, fontWeight: 700, color: "var(--fg)" }}
      >
        {abierto ? "▾" : "▸"} Cuentas de prueba (exclusión manual)
      </button>
      {abierto && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
            Para cuentas de prueba que NO se detectan por patrón (nombre real, correo normal) — ej. confirmadas
            por el equipo por conocimiento externo. Se excluyen de todas las estadísticas y alertas, pero quedan
            visibles en la tabla principal con el motivo.
          </p>
          <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
            <input placeholder="User ID" value={userId} onChange={e => setUserId(e.target.value)}
              style={{ fontSize: 13, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border)", width: 120 }} />
            <input placeholder="Motivo (ej. confirmada por Kate 28-jul)" value={motivo} onChange={e => setMotivo(e.target.value)}
              style={{ fontSize: 13, padding: "6px 8px", borderRadius: 8, border: "1px solid var(--border)", flex: 1, minWidth: 220 }} />
            <button onClick={agregar} disabled={cargando}
              style={{ fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 8, border: "none", background: "var(--dropi, #F77F00)", color: "#fff", cursor: "pointer" }}>
              Agregar
            </button>
          </div>
          {error && <div style={{ color: "#EF4444", fontSize: 12.5, marginBottom: 10 }}>{error}</div>}
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
            <thead>
              <tr>
                <th style={{ ...thStyle, padding: "6px 8px" }}>User ID</th>
                <th style={{ ...thStyle, padding: "6px 8px" }}>Motivo</th>
                <th style={{ ...thStyle, padding: "6px 8px" }}>Agregado por</th>
                <th style={{ ...thStyle, padding: "6px 8px" }}></th>
              </tr>
            </thead>
            <tbody>
              {exclusiones.map(e => (
                <tr key={e.user_id}>
                  <td style={{ ...tdStyle, padding: "6px 8px" }}>{e.user_id}</td>
                  <td style={{ ...tdStyle, padding: "6px 8px" }}>{e.motivo}</td>
                  <td style={{ ...tdStyle, padding: "6px 8px" }}>{e.agregado_por ?? "—"}</td>
                  <td style={{ ...tdStyle, padding: "6px 8px" }}>
                    <button onClick={() => quitar(e.user_id)}
                      style={{ fontSize: 11, color: "#EF4444", background: "none", border: "none", cursor: "pointer" }}>
                      Quitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── Sección de carga (dry-run / confirm) ─────────────────────────────────────

function BotonDeshacer({
  hayRespaldo, onImportado, ruta, etiqueta, confirmacion,
}: {
  hayRespaldo: boolean; onImportado: () => void; ruta: string; etiqueta: string; confirmacion: string;
}) {
  const [deshaciendo, setDeshaciendo] = useState(false);
  const [error, setError] = useState<string | null>(null);
  if (!hayRespaldo) return null;

  const deshacer = async () => {
    if (!confirm(confirmacion)) return;
    setDeshaciendo(true);
    setError(null);
    try {
      const res = await fetch(ruta, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error deshaciendo la importación");
      onImportado();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setDeshaciendo(false);
    }
  };

  return (
    <div style={{ marginBottom: 12 }}>
      <button
        onClick={deshacer}
        disabled={deshaciendo}
        title={confirmacion}
        style={{
          fontSize: 11.5, fontWeight: 600, padding: "4px 10px", borderRadius: 8,
          border: "1px solid #FDE68A", background: "#FFFBEB", color: "#92400E", cursor: "pointer",
        }}
      >
        {deshaciendo ? "Restaurando…" : `↩ ${etiqueta}`}
      </button>
      {error && <div style={{ color: "#EF4444", fontSize: 12, marginTop: 6 }}>{error}</div>}
    </div>
  );
}

function SeccionCarga({ onImportado }: { onImportado: () => void }) {
  const [archivos, setArchivos] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abierto, setAbierto] = useState(false);

  const enviar = async (confirmar: boolean) => {
    if (!archivos || archivos.length === 0) return;
    setEnviando(true);
    setError(null);
    try {
      const form = new FormData();
      Array.from(archivos).forEach(f => form.append("archivos", f));
      if (confirmar) form.append("confirmar", "true");

      const res = await fetch("/api/proyectos/onboarding-ttfo/importar", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error en la importación");

      if (confirmar) {
        setPreview(null);
        setArchivos(null);
        onImportado();
      } else {
        setPreview(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ ...card, marginBottom: 24 }}>
      <button
        onClick={() => setAbierto(v => !v)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13, fontWeight: 700, color: "var(--fg)" }}
      >
        {abierto ? "▾" : "▸"} Cargar cohorte nueva (CSV histórico)
      </button>

      {abierto && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
            Esta es la <b>línea base histórica</b> — arrastra todos los CSVs de este corte a la vez (Encuesta + los
            pasos del tour que tengas). El sistema los clasifica por nombre y columnas — un archivo irreconocible no
            rompe el resto, se lista aparte. Nada se escribe hasta que confirmes, y si el resultado no te convence,
            "Deshacer última importación" vuelve exactamente a lo que había antes. Una vez confirmada, las cargas
            rutinarias de la automatización van por la sección de abajo (Raw Data) — no hace falta volver a subir
            estos CSV cada vez.
          </p>
          <input
            type="file" multiple accept=".csv,.xlsx"
            onChange={e => { setArchivos(e.target.files); setPreview(null); }}
            style={{ fontSize: 13, marginBottom: 10 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => enviar(false)}
              disabled={!archivos || enviando}
              style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", cursor: "pointer" }}
            >
              {enviando ? "Procesando…" : "Previsualizar"}
            </button>
            {preview && (
              <button
                onClick={() => enviar(true)}
                disabled={enviando}
                style={{ fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 8, border: "none", background: "var(--dropi, #F77F00)", color: "#fff", cursor: "pointer" }}
              >
                Confirmar e importar
              </button>
            )}
          </div>

          {error && <div style={{ color: "#EF4444", fontSize: 12.5, marginTop: 10 }}>{error}</div>}

          {preview && (
            <pre style={{
              marginTop: 14, fontSize: 11.5, background: "#FAFBFC", border: "1px solid var(--border)",
              borderRadius: 8, padding: 12, overflow: "auto", maxHeight: 400,
            }}>
              {JSON.stringify(preview, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

function SeccionCargaRawData({ onImportado }: { onImportado: () => void }) {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<Record<string, unknown> | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abierto, setAbierto] = useState(false);

  const enviar = async (confirmar: boolean) => {
    if (!archivo) return;
    setEnviando(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("archivos", archivo);
      if (confirmar) form.append("confirmar", "true");

      const res = await fetch("/api/proyectos/onboarding-ttfo/importar-raw-data", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Error en la importación");

      if (confirmar) {
        setPreview(null);
        setArchivo(null);
        onImportado();
      } else {
        setPreview(data);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ ...card, marginBottom: 24 }}>
      <button
        onClick={() => setAbierto(v => !v)}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, fontSize: 13, fontWeight: 700, color: "var(--fg)" }}
      >
        {abierto ? "▾" : "▸"} Cargar Raw Data (automatización, rutinario)
      </button>

      {abierto && (
        <div style={{ marginTop: 14 }}>
          <p style={{ fontSize: 12.5, color: "var(--muted)", marginBottom: 10, lineHeight: 1.5 }}>
            Solo el export "Raw Data" de la automatización (Plantilla → Google Sheets), un archivo — nada de CSV
            acá. Se suma sobre la línea base ya guardada (arriba), no la reemplaza. Si el archivo trae filas que
            ya estaban contadas, no se duplican (el empalme toma lo más reciente/mayor por usuario). Nada se
            escribe hasta que confirmes.
          </p>
          <input
            type="file" accept=".csv,.xlsx"
            onChange={e => { setArchivo(e.target.files?.[0] ?? null); setPreview(null); }}
            style={{ fontSize: 13, marginBottom: 10 }}
          />
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() => enviar(false)}
              disabled={!archivo || enviando}
              style={{ fontSize: 12, fontWeight: 600, padding: "6px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "#fff", cursor: "pointer" }}
            >
              {enviando ? "Procesando…" : "Previsualizar"}
            </button>
            {preview && (
              <button
                onClick={() => enviar(true)}
                disabled={enviando}
                style={{ fontSize: 12, fontWeight: 700, padding: "6px 12px", borderRadius: 8, border: "none", background: "var(--dropi, #F77F00)", color: "#fff", cursor: "pointer" }}
              >
                Confirmar y sumar a la base
              </button>
            )}
          </div>

          {error && <div style={{ color: "#EF4444", fontSize: 12.5, marginTop: 10 }}>{error}</div>}

          {preview && (
            <pre style={{
              marginTop: 14, fontSize: 11.5, background: "#FAFBFC", border: "1px solid var(--border)",
              borderRadius: 8, padding: 12, overflow: "auto", maxHeight: 400,
            }}>
              {JSON.stringify(preview, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
