"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
  ReferenceLine,
} from "recharts";

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "#fff", border: "1px solid #EDEDED",
  borderRadius: 16, padding: "20px",
  boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 4px 10px rgba(0,0,0,0.04)",
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
  whiteSpace: "nowrap",
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13,
};
const tdR: React.CSSProperties = { ...tdStyle, textAlign: "right" };
const thR: React.CSSProperties = { ...thStyle, textAlign: "right" };

const ACCENT = "#0D9488";
const ACCENT_BG = "#F0FDFA";
const LIDER_COLOR = "#8B5CF6";
const LIDER_BG = "#F5F3FF";

// Base elegible de proveedores para Negociaciones: Verificado (358) + Premium (50) +
// Premium Exclusivo (29) = 437. Negociaciones no está disponible para proveedores "Activo"
// (no verificado). Cifra tomada de /proyectos/indicadores (snapshot Dropi DB, jun 2026),
// confirmada por Michelle el 03/07/2026 como base válida para Negociaciones.
const BASE_ELEGIBLE = 437;
const basePct = (n: number) => {
  const p = (n / BASE_ELEGIBLE) * 100;
  return p < 1 ? p.toFixed(1) : p.toFixed(0);
};

// Metas de producto confirmadas por Michelle el 03/07/2026 — son objetivos de negocio, no
// derivados de datos ni de un benchmark externo validado. Ajustar aquí si cambian.
const META_CONVERSION_CREACION = 25; // % Proveedor: de quienes entran al módulo, % que completa el flujo de creación
const META_APROBACION_LIDER = 35; // % Líder: de las negociaciones respondidas, % que se aprueban

// ─── Bitácora de Seguimiento · NEG-001 ────────────────────────────────────────
// Fuente: UserPilot. Feature reactivado el 8 de junio de 2026.
// Comunicación oficial de lanzamiento de Negociaciones: 6 de julio de 2026.
// Actualizar semanalmente agregando un objeto nuevo a WEEKS.
// Semana 1–2: bitácora manual (Google Sheet), un tab por rol. Semana 3 en adelante: dashboard
// nativo de UserPilot "Negociaciones" (screenshot). En UserPilot la etiqueta "Dropshipper"
// corresponde en realidad a Líder de Comunidad — el feature aún no está disponible para dropshippers.
type RoleWeek = {
  ingresoEventos?: number;
  ingresoUnicos: number;
  conclusionAdopcion: string;
  conclusionTaskSuccess: string;
  retencionTendencia: string;
  conclusionRetencion: string;
  csat: string;
  conclusionHappiness: string;
  hallazgos: string;
  dolores: string;
  bugs: string;
  proximosPasos: string;
  notasSalvedades: string;
};

type ProveedorWeek = RoleWeek & {
  creadasEventos: number;
  creadasUnicos: number;
  canceladasEventos: number;
  canceladasUnicos: number;
  opcionesCard: { cancelar: number; verDetalle: number; editar: number };
  notas: number;
  editarNeg: number;
  historial: number;
  clicEnviar: number;
  funnelPct: string;
  funnelRepresentativo: boolean;
};

type LiderWeek = RoleWeek & {
  aprobadasEventos: number;
  aprobadasUnicos: number;
  rechazadasEventos: number;
  rechazadasUnicos: number;
  canceladasEventos: number;
  canceladasUnicos: number;
  opcionesCard: { rechazar: number; verDetalle: number; aprobar: number };
  historial: number;
  funnelAprobacionSinModalPct: string;
  funnelAprobacionSinModalTiempo?: string;
  funnelAprobacionViaModalPct: string;
  funnelRechazoSinModalPct: string;
  funnelRechazoSinModalTiempo?: string;
  funnelRechazoViaModalPct: string;
};

type Week = {
  id: string;
  fechas: string;
  lanzamiento: string;
  proveedor: ProveedorWeek;
  lider?: LiderWeek;
};

const WEEKS: Week[] = [
  {
    id: "Semana 1",
    fechas: "10–17 jun 2026",
    lanzamiento: "Reactivación del feature: 8 jun 2026",
    proveedor: {
      ingresoUnicos: 131,
      creadasEventos: 274,
      creadasUnicos: 2,
      canceladasEventos: 22,
      canceladasUnicos: 2,
      opcionesCard: { cancelar: 22, verDetalle: 22, editar: 13 },
      notas: 279,
      editarNeg: 2,
      historial: 6,
      clicEnviar: 274,
      funnelPct: "0.76%",
      funnelRepresentativo: true,
      conclusionAdopcion: "Solo 2 proveedores únicos crearon negociaciones esta semana (incluye 1 usuario de pruebas, Paola Angulo), consistente con la primera semana post-reactivación. El uso se concentra en revisar (ver detalle, historial) más que en crear: el alto volumen de notas (279) sugiere que el campo de comentarios se usa activamente.",
      conclusionTaskSuccess: "Los 4 funnels de creación tienen la misma conversión total (0.76%) esta semana. El cuello de botella está entre 'Entrar al módulo' y 'Click en Crear' (131 → 19 usuarios, 14.50%), y se profundiza al seleccionar producto y comisión (19 → 1 usuario, 5.26%).",
      retencionTendencia: "Decreciente (~50 → ~15)",
      conclusionRetencion: "La actividad de envío de negociaciones tuvo un pico fuerte el 13 de junio, pero la recurrencia general muestra una tendencia decreciente a lo largo de la semana (de ~50 eventos el 10 de junio a ~10-25 hacia el 17).",
      csat: "Sin dato",
      conclusionHappiness: "Sin información suficiente para concluir. Prioridad: activar y validar la micro-survey de CSAT/SEQ en UserPilot para el rol Proveedor en la próxima semana.",
      hallazgos: "Primera semana real de actividad post-reactivación (8 jun). El módulo ya se usa para gestionar negociaciones existentes (notas, historial), aunque la creación de nuevas aún es baja.",
      dolores: "Caída fuerte en el funnel de creación entre el paso 1 y 2 (131 → 19 usuarios, 14.50%), y casi a cero en el paso 3 (5.26%). Posible fricción en el flujo de selección de producto/comisión.",
      bugs: "En el correo de pruebas rol Proveedor (uxdropi@gmail.com) no se visualiza el módulo de Negociaciones desde el martes 16 de junio.",
      proximosPasos: "Investigar el cuello de botella entre 'Entrar al módulo' y 'Click en Crear'. Activar micro-survey de Happiness. Confirmar exclusión del usuario de pruebas en próximas semanas. Dar seguimiento al bug del correo uxdropi@gmail.com.",
      notasSalvedades: "Los datos de Adopción incluyen 1 usuario de pruebas (Paola Angulo).",
    },
    lider: {
      ingresoUnicos: 28,
      aprobadasEventos: 2,
      aprobadasUnicos: 1,
      rechazadasEventos: 35,
      rechazadasUnicos: 20,
      canceladasEventos: 35,
      canceladasUnicos: 20,
      opcionesCard: { rechazar: 35, verDetalle: 35, aprobar: 1 },
      historial: 17,
      funnelAprobacionSinModalPct: "3.57%",
      funnelAprobacionViaModalPct: "3.57%",
      funnelRechazoSinModalPct: "71.43%",
      funnelRechazoViaModalPct: "0%",
      conclusionAdopcion: "Solo 1 líder único aprobó negociaciones esta semana, frente a 20 líderes únicos que rechazaron o cancelaron. El uso del líder se concentra fuertemente en rechazar y ver el detalle de la negociación (35 cada una), más que en aprobar (1 evento).",
      conclusionTaskSuccess: "El rechazo sin pasar por modal tiene la conversión más alta de toda la bitácora esta semana (71.43%), pero esa misma acción vía modal cae a 0%. La aprobación es baja en ambas rutas (3.57%), con una caída fuerte justo antes de confirmar. Esto sugiere que el líder revisa el detalle pero algo lo frena antes de aprobar, mientras que prefiere que la acción directa (rechazo) se haga desde la card.",
      retencionTendencia: "Intermitente (picos 13 y 15 jun)",
      conclusionRetencion: "La actividad del líder es intermitente a lo largo de la semana, con picos el 13 y 15 de junio y varios días sin actividad registrada. Aún no hay un patrón claro de recurrencia; se necesitan más semanas de datos para evaluar tendencia.",
      csat: "Sin dato",
      conclusionHappiness: "Sin información suficiente para concluir. Prioridad: activar y validar la micro-survey de CSAT/SEQ en UserPilot para el rol Líder en la próxima semana.",
      hallazgos: "El funnel de rechazo directo (sin modal) es la conversión más alta de toda la bitácora esta semana (71.43%).",
      dolores: "Fricción fuerte en el flujo de aprobación vía modal: de 71.43% (ver detalle) cae a 5% al confirmar la aprobación. El rechazo vía modal no se completó ninguna vez (0%).",
      bugs: "Sin bugs reportados esta semana para el rol Líder.",
      proximosPasos: "Investigar por qué el líder abandona el flujo de aprobación justo antes de confirmar, especialmente vía modal. Activar micro-survey de Happiness para Líder.",
      notasSalvedades: "En UserPilot, la etiqueta 'Dropshipper' corresponde en realidad a Líder de Comunidad, ya que el feature aún no está disponible para dropshippers.",
    },
  },
  {
    id: "Semana 2",
    fechas: "18–24 jun 2026",
    lanzamiento: "Beta limitada a 12 proveedores: 394337, 781868, 31118, 607646, 607642, 5935, 803802, 74525, 245055, 504502",
    proveedor: {
      ingresoUnicos: 110,
      creadasEventos: 2,
      creadasUnicos: 2,
      canceladasEventos: 1,
      canceladasUnicos: 1,
      opcionesCard: { cancelar: 1, verDetalle: 1, editar: 0 },
      notas: 1,
      editarNeg: 0,
      historial: 1,
      clicEnviar: 2,
      funnelPct: "0%",
      funnelRepresentativo: false,
      conclusionAdopcion: "Caída fuerte en creación frente a la Semana 1 (de 274 a 2 negociaciones, aunque ambas semanas con 2 usuarios únicos). El 22 de junio se realizó una prueba puntual con el proveedor GGP Comercializadora (ID 5935), dentro del grupo beta. El uso general bajó en todas las acciones de engagement (notas, opciones de card) frente a la semana anterior.",
      conclusionTaskSuccess: "Los 4 funnels de creación muestran 0% de conversión total esta semana, lo cual NO es representativo: el funnel está configurado en orden secuencial estricto y no captura correctamente los pasos cuando el usuario no sigue el orden exacto. La tarjeta 'Creadas' (2/2) es la fuente confiable de adopción esta semana, no el % de conversión del funnel.",
      retencionTendencia: "Sostenida, más alta que Semana 1 (~5 a ~30 eventos/día)",
      conclusionRetencion: "A pesar de la caída en creación de negociaciones, la actividad general de retención y recurrencia del proveedor fue sostenida y más alta que en la Semana 1, con actividad diaria entre ~5 y ~30 eventos a lo largo de toda la semana.",
      csat: "Sin dato",
      conclusionHappiness: "Sin información suficiente para concluir. Sigue pendiente activar y validar la micro-survey de CSAT/SEQ en UserPilot.",
      hallazgos: "Prueba puntual con el proveedor GGP Comercializadora (ID 5935) el 22 de junio, dentro del grupo beta. La beta sigue limitada a 12 proveedores específicos.",
      dolores: "Conversión de los funnels de creación en 0% esta semana — no representativo, ver nota metodológica de Task Success. Caída fuerte en negociaciones creadas (274 → 2) frente a la Semana 1.",
      bugs: "Los funnels de creación del Proveedor (orden estricto y 'any order') no reflejan correctamente la conversión real cuando el usuario no sigue el flujo en el orden exacto — pendiente de ajuste de configuración en UserPilot. Sigue activo el bug del correo de pruebas (uxdropi@gmail.com) sin visualizar el módulo desde el 16 de junio.",
      proximosPasos: "Validar con UserPilot el ajuste de configuración de los funnels de creación. Confirmar si la caída en creación es por la base reducida de la beta (12 proveedores) o por otro factor. Seguimiento al bug del correo uxdropi@gmail.com.",
      notasSalvedades: "Beta limitada a 12 proveedores (IDs listados arriba). El proveedor GGP (5935) está dentro de ese grupo.",
    },
    lider: {
      ingresoUnicos: 7,
      aprobadasEventos: 1,
      aprobadasUnicos: 1,
      rechazadasEventos: 4,
      rechazadasUnicos: 3,
      canceladasEventos: 4,
      canceladasUnicos: 3,
      opcionesCard: { rechazar: 4, verDetalle: 4, aprobar: 0 },
      historial: 0,
      funnelAprobacionSinModalPct: "0%",
      funnelAprobacionViaModalPct: "14.29%",
      funnelRechazoSinModalPct: "42.86%",
      funnelRechazoViaModalPct: "0%",
      conclusionAdopcion: "Adopción del líder se mantiene baja: 1 aprobación (1 usuario único) frente a 4 rechazos y 4 cancelaciones (3 usuarios únicos cada una). El engagement se concentra en rechazar y ver detalle (4 cada una) desde la card; casi no hay uso del modal salvo 1 aprobación.",
      conclusionTaskSuccess: "La aprobación sin pasar por el modal tuvo 0% de conversión esta semana, mientras que vía detalle subió a 14.29% — es decir, el líder solo aprobó cuando pasó primero por ver el detalle. El rechazo sin modal se mantiene como la ruta más usada (42.86%), pero el rechazo vía modal cayó a 0%, repitiendo el patrón de la Semana 1 donde la confirmación final vía modal pierde conversión.",
      retencionTendencia: "Intermitente (picos 18, 22, 23 y 24 jun)",
      conclusionRetencion: "Actividad intermitente, con picos el 18, 22, 23 y 24 de junio. Se mantiene el patrón errático visto en la Semana 1, sin un día fijo de mayor actividad.",
      csat: "Sin dato",
      conclusionHappiness: "Sin información suficiente para concluir. Sigue pendiente activar y validar la micro-survey de CSAT/SEQ en UserPilot para el rol Líder.",
      hallazgos: "El líder solo aprueba negociaciones cuando pasa primero por ver el detalle vía modal (14.29% vs 0% directo).",
      dolores: "Conversión de aprobación directa en 0% esta semana — el líder no aprueba sin revisar el detalle primero. Confirmar si esto es una preferencia de comportamiento o una limitación de la interfaz en la acción directa desde la card.",
      bugs: "Sin bugs nuevos reportados esta semana para el rol Líder.",
      proximosPasos: "Investigar por qué la aprobación directa (sin modal) no convierte nada esta semana. Activar micro-survey de Happiness para Líder.",
      notasSalvedades: "En UserPilot, la etiqueta 'Dropshipper' corresponde en realidad a Líder de Comunidad, ya que el feature aún no está disponible para dropshippers.",
    },
  },
  {
    id: "Semana 3",
    fechas: "25 jun–1 jul 2026",
    lanzamiento: "Sin nota de rollout registrada esta semana — confirmar con Michelle si la beta sigue limitada a los mismos 12 proveedores.",
    proveedor: {
      ingresoEventos: 276,
      ingresoUnicos: 102,
      creadasEventos: 1,
      creadasUnicos: 1,
      canceladasEventos: 3,
      canceladasUnicos: 3,
      opcionesCard: { cancelar: 3, verDetalle: 3, editar: 0 },
      notas: 1,
      editarNeg: 0,
      historial: 1,
      clicEnviar: 1,
      funnelPct: "0%",
      funnelRepresentativo: false,
      conclusionAdopcion: "La creación de negociaciones toca su mínimo histórico esta semana: 1 negociación, 1 usuario único (vs 2 en Semana 2 y 274 en Semana 1), mientras el ingreso al módulo se mantiene alto (102 usuarios únicos, 276 eventos) — hay tráfico pero casi no se traduce en negociaciones nuevas.",
      conclusionTaskSuccess: "Los 4 funnels de creación siguen en 0% de conversión total — mismo problema de configuración reportado en Semana 1–2 (no representativo).",
      retencionTendencia: "Alta al inicio de semana (25–26 jun), cae a mínimo miércoles-jueves (27–29 jun) y repunta hacia el cierre (30 jun–1 jul)",
      conclusionRetencion: "Lectura aproximada de los gráficos de barras del dashboard de UserPilot (no expone cifras exactas por día); el patrón es de caída a mitad de semana con recuperación al cierre.",
      csat: "Sin dato",
      conclusionHappiness: "Sin dato — no hay tarjeta de CSAT/SEQ en el dashboard de esta semana. Sigue pendiente activar la micro-survey.",
      hallazgos: "Ingreso al módulo se mantiene alto (102 únicos) pese a la caída en creación — el problema no parece ser de tráfico sino de conversión dentro del flujo.",
      dolores: "Creación de negociaciones cae a mínimo histórico (1 negociación, 1 usuario único).",
      bugs: "Pendiente confirmar si el bug de los funnels de creación (0% no representativo) y el del correo de pruebas uxdropi@gmail.com siguen abiertos esta semana — el dashboard de UserPilot no lo confirma ni lo descarta.",
      proximosPasos: "Dar seguimiento a si persisten los bugs reportados en Semana 1–2. Activar CSAT/SEQ. Definir si la bitácora manual (Sheet) se sigue llevando en paralelo al dashboard de UserPilot o si este último la reemplaza.",
      notasSalvedades: "Datos tomados directamente del dashboard UserPilot \"Negociaciones\" (captura del 2 jul 2026), no de la bitácora manual del Sheet usada en Semana 1–2.",
    },
    lider: {
      ingresoEventos: 16,
      ingresoUnicos: 10,
      aprobadasEventos: 1,
      aprobadasUnicos: 1,
      rechazadasEventos: 5,
      rechazadasUnicos: 1,
      canceladasEventos: 5,
      canceladasUnicos: 1,
      opcionesCard: { verDetalle: 5, rechazar: 5, aprobar: 1 },
      historial: 2,
      funnelAprobacionSinModalPct: "10%",
      funnelAprobacionSinModalTiempo: "2d 6h 55m 26s",
      funnelAprobacionViaModalPct: "0%",
      funnelRechazoSinModalPct: "10%",
      funnelRechazoSinModalTiempo: "10s",
      funnelRechazoViaModalPct: "0%",
      conclusionAdopcion: "Primera semana con datos medibles del rol Líder directamente en el dashboard de UserPilot (antes solo se tenía la bitácora manual): 10 usuarios únicos ingresaron (16 eventos), aprobaron 1 negociación, rechazaron 5 y cancelaron 5 — todo concentrado en 1 usuario único por acción, muy por debajo del volumen de Semana 1 (20 usuarios únicos rechazando/cancelando).",
      conclusionTaskSuccess: "A diferencia de Semana 1–2, el funnel sin modal sí muestra conversión real tanto en aprobación (10%) como en rechazo (10%), con tiempo promedio de respuesta de 2d 6h 55m en aprobaciones y 10 segundos en rechazos. La ruta vía modal quedó en 0% en ambos casos, repitiendo el patrón de pérdida de conversión al pasar por el detalle visto en semanas anteriores.",
      retencionTendencia: "Baja y dispersa toda la semana, con un pico puntual el 30 de junio",
      conclusionRetencion: "Lectura aproximada del gráfico de barras del dashboard (no expone cifras exactas por día) — consistente con el patrón intermitente ya visto en Semana 1–2.",
      csat: "Sin dato",
      conclusionHappiness: "Sin dato — no hay tarjeta de CSAT/SEQ en el dashboard de esta semana. Sigue pendiente activar la micro-survey.",
      hallazgos: "Primera semana con visibilidad del rol Líder directamente en el dashboard de UserPilot. El volumen de rechazos/cancelaciones cae fuerte frente a Semana 1 (de 20 a 1 usuario único).",
      dolores: "El líder rechaza 5 de las 10 negociaciones que le llegan y solo aprueba 1 — proporción de rechazo alta. Hipótesis sin confirmar (Michelle): podría tratarse de un usuario probando el flujo más que un rechazo real, similar al patrón de usuarios de prueba visto en Semana 1 (Paola Angulo, rol Proveedor) y Semana 2 (GGP Comercializadora).",
      bugs: "Pendiente confirmar si los bugs reportados en Semana 1–2 para rol Proveedor (funnels no representativos, correo uxdropi@gmail.com) también afectan al rol Líder — el dashboard de UserPilot no lo dice.",
      proximosPasos: "Confirmar si el usuario único que rechazó 5 negociaciones era una prueba o un rechazo real — de ser prueba, excluirlo del cálculo igual que se hizo con los usuarios de prueba de S1–S2. Retomar la bitácora manual (Sheet) para Líder si se sigue llevando en paralelo al dashboard de UserPilot.",
      notasSalvedades: "Datos tomados directamente del dashboard UserPilot \"Negociaciones\" (captura del 2 jul 2026). El evento de historial del Líder aparece en UserPilot bajo la etiqueta 'Dropshipper' — confirmado por la bitácora manual que esa etiqueta equivale a Líder de Comunidad mientras el feature no esté disponible para dropshippers.",
    },
  },
];

// ─── Campaña de activación · UserPilot Workflow "[Experimento] Negociaciones Proveedor" ──
const CAMPANA = {
  fechas: "25 jun–1 jul 2026",
  enrolled: 5,
  enrolledDeltaPct: -99.17,
  completed: 36,
  completedDeltaPct: 500,
  achievedGoal: 0,
  achievedGoalDeltaPct: 0,
  avgTimeToComplete: "7d 19h 54m 57s",
  avgTimeDeltaPct: 0,
  steps: [
    { step: "Recordatorio Negociaciones proveedores", reachedStep: 94, contentTriggered: "50 (53%)" },
    { step: "Recordatorio 2 Negociaciones proveedores", reachedStep: 50, contentTriggered: "29 (58%)" },
    { step: "Hotspot negociaciones", reachedStep: 49, contentTriggered: "50 (102%)" },
    { step: "hotsport negociaciones (typo original)", reachedStep: 26, contentTriggered: "95 (365%)" },
    { step: "[Experimento] Negociaciones Proveedor", reachedStep: 5, contentTriggered: "25 (500%)" },
  ],
  secuencia: [
    { paso: "Trigger", detalle: "Coincide con condición · segmento Custom · ambiente Production." },
    { paso: "Flow inicial", detalle: "Entra al flow \"[Experimento] Negociaciones Proveedor\"." },
    { paso: "Chequeo de condición", detalle: "True → sale del workflow (ya cumplió el objetivo). False → continúa." },
    { paso: "1er recordatorio", detalle: "Spotlight \"hotsport negociaciones\" (typo así en la herramienta) + Flow \"Recordatorio Negociaciones proveedores\"." },
    { paso: "Espera 1 sesión", detalle: "Vuelve a chequear la condición. True → sale. False → continúa." },
    { paso: "2do recordatorio", detalle: "Spotlight \"Hotspot negociaciones\" + Flow \"Recordatorio 2 Negociaciones proveedores\"." },
    { paso: "Espera 5 días + 5 días", detalle: "Chequeo final y salida del workflow (\"Reach the end\")." },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const pct = (s: string) => parseFloat(s.replace("%", ""));
const pctFormatter = (v: unknown) => `${v}%`;
const axisTick = { fontSize: 11, fill: "#6B7280" };
const gridStroke = "#E5E7EB";
const tooltipStyle = { fontSize: 12, borderRadius: 8, border: "1px solid #E5E7EB", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };
const labelStyle = { fontSize: 10, fill: "#6B7280", fontWeight: 700 };

function withPct(items: { label: string; value: number }[]) {
  const max = Math.max(...items.map(i => i.value), 1);
  return items.map(i => ({ ...i, pct: Math.round((i.value / max) * 100) }));
}

function BarRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", marginBottom: 4 }}>{label}</div>
      <div style={{ height: 26, background: "#F3F4F6", borderRadius: 7, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${Math.max(pct, 8)}%`, background: color, borderRadius: 7,
          display: "flex", alignItems: "center", paddingLeft: 10, minWidth: 34,
        }}>
          <span style={{ color: "#fff", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{value}</span>
        </div>
      </div>
    </div>
  );
}

function FunnelStep({ n, label, value, pctOfTop, color, sub }: { n: number; label: string; value: number; pctOfTop: number; color: string; sub?: string }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            width: 22, height: 22, borderRadius: "50%", background: color,
            color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>{n}</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{label}</span>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "baseline" }}>
          <span style={{ fontSize: 17, fontWeight: 800, color }}>{value}</span>
          <span style={{ fontSize: 11, color: "var(--muted)", width: 42, textAlign: "right" }}>{pctOfTop.toFixed(1)}%</span>
        </div>
      </div>
      <div style={{ height: 8, background: "#F3F4F6", borderRadius: 999, overflow: "hidden", marginLeft: 30 }}>
        <div style={{ height: "100%", width: `${Math.max(Math.min(pctOfTop, 100), 1.5)}%`, background: color, borderRadius: 999 }} />
      </div>
      {sub && <div style={{ fontSize: 11, color: "var(--muted)", marginLeft: 30, marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function Meter({ label, value, target, color, unit }: { label: string; value: number; target: number; color: string; unit?: "count" | "pct" }) {
  const rawPct = (value / target) * 100;
  const fmt = (n: number) => (n < 1 ? n.toFixed(1) : n.toFixed(0));
  const fillPct = Math.min(Math.max(rawPct, 1.5), 100);
  const valueLabel = unit === "pct" ? `${fmt(value)}%` : String(value);
  const targetLabel = unit === "pct" ? `meta ${target}%` : `/ ${target}`;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 6 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 800, color }}>{valueLabel} <span style={{ color: "var(--muted)", fontWeight: 600 }}>{targetLabel}</span></span>
      </div>
      <div style={{ height: 12, background: `${color}1A`, borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${fillPct}%`, background: color, borderRadius: 999 }} />
      </div>
    </div>
  );
}

function Narrativa({ role, color, bg, hallazgo, detalle }: { role: string; color: string; bg: string; hallazgo: string; detalle: string }) {
  return (
    <div style={{ padding: "16px 18px", background: bg, borderRadius: 12 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        🔎 {role} · Hallazgo clave
      </div>
      <div style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", lineHeight: 1.4, marginBottom: 8 }}>{hallazgo}</div>
      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>{detalle}</div>
    </div>
  );
}

function KpiCard({ label, value, color, delta, note }: { label: string; value: string | number; color: string; delta?: number | null; note?: string }) {
  return (
    <div style={{ ...card, padding: "14px 16px" }}>
      <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color }}>{value}</div>
      {delta != null && (
        <div style={{ fontSize: 11, color: delta > 0 ? "#10B981" : delta < 0 ? "#EF4444" : "var(--muted)", marginTop: 4, fontWeight: 600 }}>
          {delta > 0 ? "↑" : delta < 0 ? "↓" : "="} {Math.abs(delta)} vs. semana anterior
        </div>
      )}
      {note && (
        <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 3 }}>{note}</div>
      )}
    </div>
  );
}

// ─── Panel de una semana ────────────────────────────────────────────────────────
function WeekPanel({ week, prev }: { week: Week; prev: Week | null }) {
  const p = week.proveedor;
  const l = week.lider;

  const opcionesCardItems = withPct([
    { label: `Cancelar (${p.opcionesCard.cancelar})`, value: p.opcionesCard.cancelar },
    { label: `Ver detalle (${p.opcionesCard.verDetalle})`, value: p.opcionesCard.verDetalle },
    { label: `Editar (${p.opcionesCard.editar})`, value: p.opcionesCard.editar },
  ]);

  const liderRespuestaItems = l ? withPct([
    { label: `Aprobadas (${l.aprobadasEventos})`, value: l.aprobadasEventos },
    { label: `Rechazadas (${l.rechazadasEventos})`, value: l.rechazadasEventos },
    { label: `Canceladas (${l.canceladasEventos})`, value: l.canceladasEventos },
  ]) : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
        <span style={tag(ACCENT, ACCENT_BG)}>{week.id}</span>
        <span style={{ fontSize: 13, color: "var(--muted)" }}>{week.fechas}</span>
        <span style={{ fontSize: 12, color: "var(--muted)" }}>· {week.lanzamiento}</span>
      </div>

      <div style={{ ...card, background: "#FAFAF9" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: "var(--fg)" }}>🎯 Progreso hacia el universo elegible</div>
          <div style={{ fontSize: 11, color: "var(--muted)" }}>{BASE_ELEGIBLE} proveedores (Verificado + Premium + P. Exclusivo)</div>
        </div>
        <Meter label="Ingreso al módulo (proveedores únicos)" value={p.ingresoUnicos} target={BASE_ELEGIBLE} color="#8B5CF6" />
        <Meter label="Crearon una negociación (proveedores únicos)" value={p.creadasUnicos} target={BASE_ELEGIBLE} color="#3B82F6" />
      </div>

      <Narrativa role="Proveedor" color={ACCENT} bg={ACCENT_BG} hallazgo={p.hallazgos} detalle={p.conclusionAdopcion} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
        <KpiCard label="Creadas (eventos)" value={p.creadasEventos} color={ACCENT} delta={prev ? p.creadasEventos - prev.proveedor.creadasEventos : null} />
        <KpiCard label="Creadas (únicos)" value={p.creadasUnicos} color="#3B82F6" delta={prev ? p.creadasUnicos - prev.proveedor.creadasUnicos : null} />
        <KpiCard label="Ingreso al módulo (únicos)" value={p.ingresoUnicos} color="#8B5CF6" delta={prev ? p.ingresoUnicos - prev.proveedor.ingresoUnicos : null} />
        <KpiCard label="Canceladas" value={p.canceladasEventos} color="#EF4444" delta={prev ? p.canceladasEventos - prev.proveedor.canceladasEventos : null} />
      </div>

      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>🗂️ ¿Qué hicieron con la negociación?</div>
        {opcionesCardItems.map(it => <BarRow key={it.label} label={it.label} value={String(it.value)} pct={it.pct} color={ACCENT} />)}
      </div>

      <div style={{ ...card, background: "#FAFAF9" }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: "var(--fg)", marginBottom: 14 }}>🎯 Meta: conversión de creación</div>
        <Meter label="% que completa el flujo de creación (de quienes entran)" value={pct(p.funnelPct)} target={META_CONVERSION_CREACION} color={ACCENT} unit="pct" />
        {!p.funnelRepresentativo && (
          <div style={{ fontSize: 11, color: "#B45309", background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "6px 10px", marginTop: 2 }}>
            ⚠️ Este número no es representativo esta semana — bug de configuración del funnel en UserPilot (ver Próximos pasos).
          </div>
        )}
      </div>

      {l && (
        <>
          <Narrativa role="Líder de Comunidad" color={LIDER_COLOR} bg={LIDER_BG} hallazgo={l.hallazgos} detalle={l.conclusionAdopcion} />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
            <KpiCard label="Ingreso al módulo (únicos)" value={l.ingresoUnicos} color={LIDER_COLOR} />
            <KpiCard label="Aprobadas" value={l.aprobadasEventos} color="#10B981" />
            <KpiCard label="Rechazadas" value={l.rechazadasEventos} color="#EF4444" />
            <KpiCard label="Canceladas" value={l.canceladasEventos} color="#F59E0B" />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>💬 ¿Cómo respondió?</div>
              {liderRespuestaItems.map(it => <BarRow key={it.label} label={it.label} value={String(it.value)} pct={it.pct} color={LIDER_COLOR} />)}
            </div>
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>🔀 Conversión: sin modal vs. vía modal</div>
              <BarRow label="Aprobación · sin modal" value={l.funnelAprobacionSinModalPct} pct={pct(l.funnelAprobacionSinModalPct)} color={LIDER_COLOR} />
              <BarRow label="Aprobación · vía modal" value={l.funnelAprobacionViaModalPct} pct={pct(l.funnelAprobacionViaModalPct)} color="#F59E0B" />
              <BarRow label="Rechazo · sin modal" value={l.funnelRechazoSinModalPct} pct={pct(l.funnelRechazoSinModalPct)} color={LIDER_COLOR} />
              <BarRow label="Rechazo · vía modal" value={l.funnelRechazoViaModalPct} pct={pct(l.funnelRechazoViaModalPct)} color="#F59E0B" />
            </div>
          </div>

          <div style={{ ...card, background: "#FAFAF9" }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: "var(--fg)", marginBottom: 14 }}>🎯 Meta: aprobación del líder</div>
            <Meter
              label="% aprobadas (de lo que el líder alcanzó a responder)"
              value={(l.aprobadasEventos + l.rechazadasEventos + l.canceladasEventos) > 0 ? (l.aprobadasEventos / (l.aprobadasEventos + l.rechazadasEventos + l.canceladasEventos)) * 100 : 0}
              target={META_APROBACION_LIDER}
              color={LIDER_COLOR}
              unit="pct"
            />
          </div>
        </>
      )}

      <div style={{ ...card, background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom: 8 }}>➡️ Próximos pasos</div>
        <div style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.5 }}>{p.proximosPasos}</div>
        {l && l.proximosPasos !== p.proximosPasos && <div style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.5, marginTop: 6 }}>{l.proximosPasos}</div>}
      </div>
    </div>
  );
}

// ─── Piloto MVP ───────────────────────────────────────────────────────────────
const PILOTO = {
  meta: { comunidades: 1, negociaciones: 5 },
  actual: {
    comunidades: 1,
    negociacionesEnCurso: 1,
    productosPendientes: 11125,
    fechaDesbloqueo: "21 jul 2026",
    proveedor: "GGP Comercializadora (ID 5935)",
    bloqueante: "Funcionalidad de carga masiva en desarrollo — disponible el 21-jul-2026",
    contexto: "El proveedor tiene ~10.000 productos bajo múltiples cuentas y marcas blancas. El importador por Excel (3 columnas: ID · tipo · valor) está en desarrollo con Giancarlos y sale el 21-jul.",
  },
};

function PilotoMVP() {
  const { meta, actual } = PILOTO;
  const comPct = Math.round((actual.comunidades / meta.comunidades) * 100);
  const negPct = Math.round((actual.negociacionesEnCurso / meta.negociaciones) * 100);

  return (
    <div style={{ ...card, border: "1px solid #D1FAE5", background: "#F0FDF4" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🧪</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#065F46" }}>Prueba MVP · Piloto comercial con comunidades</div>
            <div style={{ fontSize: 11, color: "#6B7280" }}>Seguimiento independiente a las métricas de UserPilot</div>
          </div>
        </div>
        <span style={tag("#D97706", "#FFFBEB")}>⏳ Bloqueado hasta 21-jul</span>
      </div>

      {/* Meta vs actual */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
        {[
          {
            label: "Comunidades activas",
            actual: actual.comunidades,
            meta: meta.comunidades,
            pct: comPct,
            color: "#10B981",
          },
          {
            label: "Negociaciones en curso",
            actual: actual.negociacionesEnCurso,
            meta: meta.negociaciones,
            pct: negPct,
            color: "#3B82F6",
          },
        ].map(m => (
          <div key={m.label} style={{ background: "#fff", borderRadius: 12, padding: "12px 14px", border: "1px solid #D1FAE5" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#6B7280", marginBottom: 6 }}>{m.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 8 }}>
              <span style={{ fontSize: 28, fontWeight: 900, color: m.color, lineHeight: 1 }}>{m.actual}</span>
              <span style={{ fontSize: 12, color: "#9CA3AF" }}>/ {m.meta} meta</span>
            </div>
            <div style={{ height: 6, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${m.pct}%`, background: m.color, borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>

      {/* Productos pendientes */}
      <div style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #FDE68A", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ fontSize: 22, flexShrink: 0 }}>📦</span>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 900, color: "#D97706" }}>
                {actual.productosPendientes.toLocaleString("es-CO")}
              </span>
              <span style={{ fontSize: 12, color: "#92400E", fontWeight: 700 }}>productos en negociación · pendientes de subir</span>
            </div>
            <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.5 }}>
              <strong>{actual.proveedor}</strong> — tiene múltiples cuentas y marcas blancas. El volumen hace imposible la carga manual uno a uno.
            </div>
          </div>
        </div>
      </div>

      {/* Bloqueante + fecha */}
      <div style={{ background: "#FEF3C7", borderRadius: 10, padding: "12px 14px", border: "1px solid #FDE68A", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <span style={{ fontSize: 18, flexShrink: 0 }}>🚧</span>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: "#92400E", marginBottom: 3 }}>
            Bloqueante: carga masiva disponible el <span style={{ color: "#D97706" }}>21 jul 2026</span>
          </div>
          <div style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>{actual.contexto}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Panel de resumen (todas las semanas) ────────────────────────────────────
function ResumenPanel({ weeks, campana }: { weeks: Week[]; campana: typeof CAMPANA }) {
  const liderWeeks = weeks.filter(w => w.lider);
  const first = weeks[0];
  const last = weeks[weeks.length - 1];

  const chartProveedor = weeks.map(w => ({
    semana: w.id.replace("Semana ", "S"),
    creadas: w.proveedor.creadasEventos,
    ingreso: w.proveedor.ingresoUnicos,
  }));
  const chartLider = liderWeeks.map(w => ({
    semana: w.id.replace("Semana ", "S"),
    Aprobadas: w.lider!.aprobadasEventos,
    Rechazadas: w.lider!.rechazadasEventos,
    Canceladas: w.lider!.canceladasEventos,
  }));
  const chartAprobacion = liderWeeks.map(w => ({
    semana: w.id.replace("Semana ", "S"),
    "Sin modal": pct(w.lider!.funnelAprobacionSinModalPct),
    "Vía modal": pct(w.lider!.funnelAprobacionViaModalPct),
  }));
  const chartRechazo = liderWeeks.map(w => ({
    semana: w.id.replace("Semana ", "S"),
    "Sin modal": pct(w.lider!.funnelRechazoSinModalPct),
    "Vía modal": pct(w.lider!.funnelRechazoViaModalPct),
  }));

  // Funnel end-to-end (acumulado, no semana-por-semana): el líder tiene 72h para responder,
  // así que una negociación creada a fin de semana se resuelve en la semana siguiente —
  // sumar todo el período compensa ese desfase.
  const totalCreadas = weeks.reduce((s, w) => s + w.proveedor.creadasEventos, 0);
  const totalRespondidas = liderWeeks.reduce((s, w) => s + w.lider!.aprobadasEventos + w.lider!.rechazadasEventos + w.lider!.canceladasEventos, 0);
  const totalAprobadas = liderWeeks.reduce((s, w) => s + w.lider!.aprobadasEventos, 0);
  const pctRespondidas = totalCreadas ? (totalRespondidas / totalCreadas) * 100 : 0;
  const pctAprobadasDeTop = totalCreadas ? (totalAprobadas / totalCreadas) * 100 : 0;
  const pctAprobadasDeRespondidas = totalRespondidas ? (totalAprobadas / totalRespondidas) * 100 : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <PilotoMVP />
      <div style={card}>
        <div style={{ fontSize: 13, fontWeight: 800, color: ACCENT, marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.04em" }}>
          🔎 Hallazgos clave · {weeks.length} semanas
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {weeks.map(w => (
            <div key={w.id} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <span style={tag(ACCENT, ACCENT_BG)}>{w.id.replace("Semana ", "S")}</span>
              <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>
                <div><strong>Proveedor:</strong> {w.proveedor.hallazgos}</div>
                {w.lider && <div style={{ marginTop: 4 }}><strong>Líder:</strong> {w.lider.hallazgos}</div>}
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #EDEDED", fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
          En resumen: creación del Proveedor cayó de <strong>{first.proveedor.creadasEventos}</strong> a <strong>{last.proveedor.creadasEventos}</strong> mientras el ingreso al módulo se mantuvo estable, y el Líder repite en todas las semanas el mismo patrón: la vía directa convierte mejor que pasar por el modal.
        </div>
      </div>

      {liderWeeks.length > 0 && (
        <div style={card}>
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "var(--fg)" }}>🔗 Funnel end-to-end · Proveedor → Líder</div>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 16, lineHeight: 1.4 }}>
            Acumulado de las {weeks.length} semanas (no semana-por-semana): el líder tiene 72h para responder, así que una negociación creada a fin de semana se resuelve en la siguiente — sumar todo el período compensa ese desfase. Esta vista no existe en UserPilot porque Proveedor y Líder se trackean por separado allá.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <FunnelStep n={1} label="Creadas por el Proveedor" value={totalCreadas} pctOfTop={100} color={ACCENT} />
            <FunnelStep
              n={2} label="Respondidas por el Líder (aprobó, rechazó o canceló)" value={totalRespondidas} pctOfTop={pctRespondidas} color={LIDER_COLOR}
              sub={`${totalRespondidas > totalCreadas ? "Supera el total creado en el período — parte son negociaciones creadas antes de S1 o resueltas con desfase de semana." : ""}`}
            />
            <FunnelStep
              n={3} label="Aprobadas por el Líder" value={totalAprobadas} pctOfTop={pctAprobadasDeTop} color="#10B981"
              sub={`${pctAprobadasDeRespondidas.toFixed(1)}% de lo que el líder alcanzó a responder — meta: ${META_APROBACION_LIDER}%`}
            />
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Proveedor · Negociaciones creadas (eventos)</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartProveedor} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={gridStroke} />
              <XAxis dataKey="semana" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
              <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
              <Bar dataKey="creadas" name="Creadas" fill={ACCENT} radius={[4, 4, 0, 0]} maxBarSize={40}>
                <LabelList dataKey="creadas" position="top" style={labelStyle} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={card}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Proveedor · Ingreso al módulo (usuarios únicos) — vs. universo elegible</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartProveedor} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={gridStroke} />
              <XAxis dataKey="semana" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
              <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} domain={[0, BASE_ELEGIBLE + 40]} />
              <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
              <ReferenceLine
                y={BASE_ELEGIBLE}
                stroke="#9CA3AF"
                strokeDasharray="4 4"
                label={{ value: `Meta: ${BASE_ELEGIBLE} elegibles`, position: "insideTopRight", fill: "#6B7280", fontSize: 11, fontWeight: 700 }}
              />
              <Bar dataKey="ingreso" name="Ingreso" fill="#3B82F6" radius={[4, 4, 0, 0]} maxBarSize={40}>
                <LabelList dataKey="ingreso" position="top" style={labelStyle} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>
            {last.proveedor.ingresoUnicos} de {BASE_ELEGIBLE} ({basePct(last.proveedor.ingresoUnicos)}%) — la barra apenas se nota junto a la meta.
          </div>
        </div>
      </div>

      {liderWeeks.length > 0 && (
        <>
          <div style={card}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Líder · Aprobadas / Rechazadas / Canceladas por semana</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartLider} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke={gridStroke} />
                <XAxis dataKey="semana" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
                <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Aprobadas" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={22}>
                  <LabelList dataKey="Aprobadas" position="top" style={labelStyle} />
                </Bar>
                <Bar dataKey="Rechazadas" fill="#EF4444" radius={[4, 4, 0, 0]} maxBarSize={22}>
                  <LabelList dataKey="Rechazadas" position="top" style={labelStyle} />
                </Bar>
                <Bar dataKey="Canceladas" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={22}>
                  <LabelList dataKey="Canceladas" position="top" style={labelStyle} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Líder · Aprobación: sin modal vs. vía modal</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartAprobacion} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="semana" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
                  <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} domain={[0, 80]} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={pctFormatter} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Sin modal" fill={LIDER_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28}>
                    <LabelList dataKey="Sin modal" position="top" formatter={pctFormatter} style={labelStyle} />
                  </Bar>
                  <Bar dataKey="Vía modal" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    <LabelList dataKey="Vía modal" position="top" formatter={pctFormatter} style={labelStyle} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div style={card}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>Líder · Rechazo: sin modal vs. vía modal</div>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartRechazo} margin={{ top: 20, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid vertical={false} stroke={gridStroke} />
                  <XAxis dataKey="semana" tickLine={false} axisLine={{ stroke: gridStroke }} tick={axisTick} />
                  <YAxis tickLine={false} axisLine={false} tick={axisTick} width={36} domain={[0, 80]} />
                  <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#F8FAFC" }} formatter={pctFormatter} />
                  <Legend wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="Sin modal" fill={LIDER_COLOR} radius={[4, 4, 0, 0]} maxBarSize={28}>
                    <LabelList dataKey="Sin modal" position="top" formatter={pctFormatter} style={labelStyle} />
                  </Bar>
                  <Bar dataKey="Vía modal" fill="#F59E0B" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    <LabelList dataKey="Vía modal" position="top" formatter={pctFormatter} style={labelStyle} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      <details style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px" }}>
        <summary style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", cursor: "pointer" }}>Ver tabla de datos (Proveedor y Líder)</summary>
        <div style={{ overflowX: "auto", marginTop: 12, border: "1px solid var(--border)", borderRadius: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Semana</th>
                <th style={thR}>Prov. creadas (ev.)</th>
                <th style={thR}>Prov. ingreso (únicos)</th>
                <th style={thR}>Líder aprobadas</th>
                <th style={thR}>Líder rechazadas</th>
                <th style={thR}>Líder canceladas</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((w, i) => (
                <tr key={w.id} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                  <td style={{ ...tdStyle, fontWeight: 700 }}>{w.id}</td>
                  <td style={tdR}>{w.proveedor.creadasEventos}</td>
                  <td style={tdR}>{w.proveedor.ingresoUnicos}</td>
                  <td style={tdR}>{w.lider?.aprobadasEventos ?? "—"}</td>
                  <td style={tdR}>{w.lider?.rechazadasEventos ?? "—"}</td>
                  <td style={tdR}>{w.lider?.canceladasEventos ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <div style={{ ...card, background: ACCENT_BG, border: `1px solid ${ACCENT}33` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: ACCENT, marginBottom: 6 }}>Campaña de activación (resumen)</div>
        <div style={{ fontSize: 12, color: "var(--fg)", lineHeight: 1.5 }}>
          Workflow de recordatorios: {campana.enrolled} enrolled, {campana.completed} completed, <strong>0% de goal alcanzado en todos los pasos</strong> — ver detalle en la pestaña Campaña.
        </div>
      </div>
    </div>
  );
}

// ─── Panel de campaña ────────────────────────────────────────────────────────
function CampanaPanel({ campana }: { campana: typeof CAMPANA }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>Campaña de activación · Recordatorios y hotspots</div>
        <div style={{ fontSize: 13, color: "var(--muted)" }}>Workflow "[Experimento] Negociaciones Proveedor" en UserPilot · {campana.fechas}.</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
        {[
          { label: "Proveedores en la campaña", desc: "Entraron al flujo de recordatorios (cumplían la condición del trigger)", value: String(campana.enrolled), delta: campana.enrolledDeltaPct, color: "#3B82F6" },
          { label: "Completaron el recorrido", desc: "Veces que alguien llegó al final del flujo (puede ser > proveedores si repiten el recorrido)", value: String(campana.completed), delta: campana.completedDeltaPct, color: "#10B981" },
          { label: "Cumplieron el objetivo real", desc: "De los que pasaron por la campaña, cuántos hicieron la acción que buscábamos (crear una negociación)", value: String(campana.achievedGoal), delta: campana.achievedGoalDeltaPct, color: "#EF4444" },
          { label: "Tiempo prom. en completarlo", desc: "El workflow espera 1 sesión + 5 días + 5 días entre recordatorios, por eso tarda días", value: campana.avgTimeToComplete, delta: campana.avgTimeDeltaPct, color: "#9CA3AF" },
        ].map(k => (
          <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}`, padding: "14px 16px" }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color }}>{k.value}</div>
            <div style={{ fontSize: 11, color: k.delta >= 0 ? "#10B981" : "#EF4444", marginTop: 5, fontWeight: 600 }}>
              {k.delta === 0 ? "— 0% vs. período anterior" : `${k.delta > 0 ? "↑" : "↓"} ${Math.abs(k.delta)}% vs. período anterior`}
            </div>
            <div style={{ fontSize: 10, color: "var(--muted)", marginTop: 6, lineHeight: 1.3 }}>{k.desc}</div>
          </div>
        ))}
      </div>

      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 10 }}>🔗 Cómo funciona el workflow</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {campana.secuencia.map((s, i) => (
            <div key={s.paso} style={{ display: "flex", gap: 12 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#6366F1",
                  color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</div>
                {i < campana.secuencia.length - 1 && (
                  <div style={{ width: 2, flex: 1, background: "var(--border)", minHeight: 18 }} />
                )}
              </div>
              <div style={{ paddingBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)" }}>{s.paso}</div>
                <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{s.detalle}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={card}>
        <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>📋 Contenido del workflow</div>
        <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Paso del workflow</th>
                <th style={thR}>Alcanzó el paso</th>
                <th style={thR}>Contenido activado</th>
              </tr>
            </thead>
            <tbody>
              {campana.steps.map((s, i) => (
                <tr key={s.step} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                  <td style={tdStyle}>{s.step}</td>
                  <td style={tdR}>{s.reachedStep}</td>
                  <td style={tdR}>{s.contentTriggered}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ marginTop: 12, padding: "10px 12px", background: "#FFFBEB", borderRadius: 8, fontSize: 12, color: "#78350F", border: "1px solid #FDE68A", lineHeight: 1.4 }}>
          <strong>Achieved goal en 0% en todos los pasos</strong> — a confirmar si el objetivo del workflow está bien configurado en UserPilot, o si de verdad nadie completa la acción esperada tras el recordatorio/hotspot.
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NegociacionesPage() {
  const [tabId, setTabId] = useState("resumen");
  const latest = WEEKS[WEEKS.length - 1];

  const tabs = [
    { id: "resumen", label: "Resumen" },
    ...WEEKS.map(w => ({ id: w.id, label: w.id.replace("Semana ", "S") })),
    { id: "campana", label: "Campaña" },
  ];

  const activeWeekIndex = WEEKS.findIndex(w => w.id === tabId);

  return (
    <main style={{ minHeight: "100vh", background: "#fff" }}>
      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid #EDEDED",
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>🤝 Negociaciones</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={tag(ACCENT, ACCENT_BG)}>NEG-001</span>
          <span style={tag("#10B981", "#ECFDF5")}>Live · Beta proveedores</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Negociaciones Proveedor–Líder de Comunidad · Bitácora de Seguimiento
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            {WEEKS.length} semanas evaluadas desde la reactivación del feature (8 jun 2026) · actualizado al cierre de {latest.id.toLowerCase()} ({latest.fechas}).
          </p>
        </div>

        {/* Aviso: comunicación oficial 6 de julio */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
          background: "#EEF2FF", border: "1px solid #C7D2FE", borderRadius: 12,
        }}>
          <span style={{ fontSize: 22 }}>📣</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#3730A3" }}>La comunicación oficial de Negociaciones sale el 6 de julio de 2026</div>
            <div style={{ fontSize: 12, color: "#4338CA", lineHeight: 1.4 }}>
              Toda la data hasta hoy es pre-anuncio (beta limitada). Después del 6 de julio se espera un salto de tráfico — buen punto de corte para comparar adopción antes/después.
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 5, background: "#fff", paddingTop: 4, paddingBottom: 4 }}>
          <div style={{
            display: "inline-flex", gap: 2, padding: 4, background: "#F3F4F6",
            borderRadius: 12, maxWidth: "100%", overflowX: "auto",
          }}>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTabId(t.id)}
                style={{
                  padding: "8px 18px", fontSize: 13, fontWeight: 700, border: "none", borderRadius: 9,
                  background: tabId === t.id ? "#fff" : "transparent",
                  color: tabId === t.id ? ACCENT : "var(--muted)",
                  boxShadow: tabId === t.id ? "0 1px 3px rgba(0,0,0,0.10)" : "none",
                  cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s ease",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        {tabId === "resumen" && <ResumenPanel weeks={WEEKS} campana={CAMPANA} />}
        {activeWeekIndex >= 0 && (
          <WeekPanel week={WEEKS[activeWeekIndex]} prev={activeWeekIndex > 0 ? WEEKS[activeWeekIndex - 1] : null} />
        )}
        {tabId === "campana" && <CampanaPanel campana={CAMPANA} />}

        {/* Fuente de datos */}
        <details style={{ ...card, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
          <summary style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", cursor: "pointer" }}>
            Fuente de datos · Cómo actualizar
          </summary>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12, marginTop: 12 }}>
            {[
              { icon: "📊", titulo: "Bitácora fuente", desc: "Semana 1–2: Google Sheet \"Bitacora_Negociaciones_Semana1\", un tab por rol (Proveedor / Líder de Comunidad). Semana 3 en adelante: dashboard nativo UserPilot \"Negociaciones\"." },
              { icon: "📋", titulo: "Formato preferido", desc: "Para actualizar: pegar el texto/CSV del rango de celdas directo en el chat (más confiable que screenshot en tablas anchas) o adjuntar captura de pantalla — ambos funcionan." },
              { icon: "🗓️", titulo: "Cadencia", desc: "Semanal, cortes lunes a domingo. Comunicación oficial de lanzamiento: 6 de julio de 2026 — punto de corte esperado entre adopción pre y post anuncio." },
              { icon: "🧮", titulo: "Base elegible (437)", desc: "Verificado (358) + Premium (50) + Premium Exclusivo (29), Colombia. Negociaciones no está disponible para proveedores 'Activo' (no verificado). Base confirmada por Michelle el 03/07/2026." },
              { icon: "🎯", titulo: "Metas de producto", desc: `Conversión de creación (Proveedor): ${META_CONVERSION_CREACION}%. Aprobación del Líder (de lo respondido): ${META_APROBACION_LIDER}%. Confirmadas por Michelle el 03/07/2026 — objetivos de negocio, no derivados de datos.` },
            ].map(f => (
              <div key={f.titulo} style={{ display: "flex", gap: 10 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>{f.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </details>

      </div>
    </main>
  );
}
