"use client";

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 15, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4,
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

// ─── Bitácora de Seguimiento · NEG-001 ────────────────────────────────────────
// Fuente: UserPilot. Feature reactivado el 8 de junio de 2026.
// Actualizar semanalmente agregando un objeto nuevo a WEEKS.
// El rol Líder de Comunidad solo tiene datos medibles desde Semana 3 (dashboard UserPilot
// "Negociaciones"); Semanas 1–2 vienen de la bitácora manual (Sheet) y solo cubren Proveedor.
type ProveedorWeek = {
  ingresoEventos?: number;
  ingresoUnicos: number;
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

type LiderWeek = {
  ingresoEventos: number;
  ingresoUnicos: number;
  aprobadasEventos: number;
  aprobadasUnicos: number;
  rechazadasEventos: number;
  rechazadasUnicos: number;
  canceladasEventos: number;
  canceladasUnicos: number;
  opcionesCard: { verDetalle: number; rechazar: number; aprobar: number };
  historial: number;
  funnelAprobadaPct: string;
  funnelAprobadaTiempo: string;
  funnelModalAprobadaPct: string;
  funnelRechazadaPct: string;
  funnelRechazadaTiempo: string;
  funnelModalRechazadaPct: string;
};

type Week = {
  id: string;
  fechas: string;
  lanzamiento: string;
  proveedor: ProveedorWeek;
  lider?: LiderWeek;
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
    },
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
    },
    conclusionAdopcion: "Caída fuerte en creación frente a la Semana 1 (de 274 a 2 negociaciones, aunque ambas semanas con 2 usuarios únicos). El 22 de junio se realizó una prueba puntual con el proveedor GGP Comercializadora (ID 5935), dentro del grupo beta. El uso general bajó en todas las acciones de engagement (notas, opciones de card) frente a la semana anterior.",
    conclusionTaskSuccess: "Los 4 funnels de creación muestran 0% de conversión total esta semana, lo cual NO es representativo: el funnel está configurado en orden secuencial estricto y no captura correctamente los pasos cuando el usuario no sigue el orden exacto (se intentó modo 'any order' y tampoco refleja la conversión real). La tarjeta 'Creadas' (2/2) es la fuente confiable de adopción esta semana, no el % de conversión del funnel.",
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
      funnelAprobadaPct: "10%",
      funnelAprobadaTiempo: "2d 6h 55m 26s",
      funnelModalAprobadaPct: "0%",
      funnelRechazadaPct: "10%",
      funnelRechazadaTiempo: "10s",
      funnelModalRechazadaPct: "0%",
    },
    conclusionAdopcion: "Primera semana con datos medibles del rol Líder de Comunidad en el dashboard de UserPilot: 10 usuarios únicos ingresaron (16 eventos), aprobaron 1 negociación, rechazaron 5 y cancelaron 5 — todo concentrado en 1 usuario único por acción. En Proveedor, la creación de negociaciones toca su mínimo histórico (1 negociación, 1 usuario único, vs 2 en Semana 2 y 274 en Semana 1), mientras el ingreso al módulo se mantiene alto (102 usuarios únicos, 276 eventos).",
    conclusionTaskSuccess: "Los 4 funnels de creación del Proveedor siguen en 0% de conversión total — mismo problema de configuración reportado en semanas anteriores (no representativo). Los funnels de respuesta del Líder sí muestran conversión real: 10% en aprobación y 10% en rechazo (1 de 10 negociaciones recibidas en cada caso), con tiempo promedio de respuesta de 2d 6h 55m en aprobaciones y 10 segundos en rechazos.",
    retencionTendencia: "Proveedor: alta al inicio de semana (25–26 jun), cae a mínimo miércoles-jueves (27–29 jun) y repunta hacia el cierre (30 jun–1 jul). Líder: actividad baja y dispersa toda la semana, con un pico puntual el 30 de junio.",
    conclusionRetencion: "Lectura aproximada de los gráficos de barras del dashboard (no expone cifras exactas por día); el patrón general del Proveedor es de caída a mitad de semana con recuperación al cierre, mientras el Líder mantiene actividad baja y esporádica.",
    csat: "Sin dato",
    conclusionHappiness: "Sin dato — no hay tarjeta de CSAT/SEQ en el dashboard de esta semana. Sigue pendiente activar la micro-survey.",
    hallazgos: "Primera semana con visibilidad completa del rol Líder de Comunidad en UserPilot (ingreso, aprobadas/rechazadas/canceladas, funnels y retención). El funnel de respuesta del Líder sí es representativo (10%), a diferencia del de creación del Proveedor. El uso de tabs dentro del modal se concentra en 'Historial' (2 aperturas) tanto en Proveedor como en Líder.",
    dolores: "Creación de negociaciones del Proveedor cae a mínimo histórico (1). El Líder rechaza 5 de las 10 negociaciones que le llegan y solo aprueba 1 — proporción de rechazo alta. Hipótesis sin confirmar (Michelle): podría tratarse de un usuario probando el flujo más que un rechazo real de negociaciones, similar al patrón de uso de pruebas visto en Semana 1 (Paola Angulo) y Semana 2 (GGP Comercializadora).",
    bugs: "Pendiente confirmar si el bug de los funnels de creación del Proveedor (0% no representativo) y el del correo de pruebas uxdropi@gmail.com siguen abiertos esta semana — el dashboard de UserPilot no lo confirma ni lo descarta.",
    proximosPasos: "Confirmar si el usuario único que rechazó 5 negociaciones era una prueba (hipótesis de Michelle) o un rechazo real — de ser prueba, excluirlo del cálculo igual que se hizo con los usuarios de prueba de S1–S2. Dar seguimiento a si persisten los bugs reportados en Semana 1–2. Activar CSAT/SEQ. Definir si la bitácora manual (Sheet) se sigue llevando en paralelo al dashboard de UserPilot o si este último la reemplaza.",
    notasSalvedades: "Datos tomados directamente del dashboard UserPilot \"Negociaciones\" (captura del 2 jul 2026), no de la bitácora manual del Sheet usada en Semana 1–2. Los valores de retención diaria son una lectura aproximada de gráficos de barras sin etiquetas numéricas — no exactos. El evento \"Historial de la negociación\" del Líder aparece truncado en el dashboard como \"Historial de la negociacion - Dro...\"; se asume Líder por su posición junto al de Proveedor, pero el nombre completo no se pudo confirmar.",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function NegociacionesPage() {
  const latest = WEEKS[WEEKS.length - 1];
  const prev = WEEKS.length > 1 ? WEEKS[WEEKS.length - 2] : null;
  const liderWeeks = WEEKS.filter(w => w.lider);

  const kpisProveedor = [
    { label: "Neg. creadas (eventos)", value: String(latest.proveedor.creadasEventos), sub: prev ? `Semana anterior: ${prev.proveedor.creadasEventos}` : "—", color: ACCENT, bg: ACCENT_BG },
    { label: "Neg. creadas (únicos)", value: String(latest.proveedor.creadasUnicos), sub: prev ? `Semana anterior: ${prev.proveedor.creadasUnicos}` : "—", color: "#3B82F6", bg: "#EFF6FF" },
    { label: "Ingreso al módulo (únicos)", value: String(latest.proveedor.ingresoUnicos), sub: prev ? `Semana anterior: ${prev.proveedor.ingresoUnicos}` : "—", color: "#8B5CF6", bg: "#F5F3FF" },
    { label: "Canceladas (ev / únicos)", value: `${latest.proveedor.canceladasEventos} / ${latest.proveedor.canceladasUnicos}`, sub: "Eventos / usuarios únicos", color: "#EF4444", bg: "#FEF2F2" },
    { label: "Clic enviar negociación", value: String(latest.proveedor.clicEnviar), sub: "Total eventos", color: "#F59E0B", bg: "#FFFBEB" },
    { label: "CSAT / SEQ", value: latest.csat, sub: "Survey pendiente de activar", color: "#9CA3AF", bg: "#F3F4F6" },
  ];

  const kpisLider = latest.lider ? [
    { label: "Ingreso al módulo (únicos)", value: String(latest.lider.ingresoUnicos), sub: `${latest.lider.ingresoEventos} eventos`, color: LIDER_COLOR, bg: LIDER_BG },
    { label: "Aprobadas", value: `${latest.lider.aprobadasEventos} / ${latest.lider.aprobadasUnicos}`, sub: "Eventos / usuarios únicos", color: "#10B981", bg: "#ECFDF5" },
    { label: "Rechazadas", value: `${latest.lider.rechazadasEventos} / ${latest.lider.rechazadasUnicos}`, sub: "Eventos / usuarios únicos", color: "#EF4444", bg: "#FEF2F2" },
    { label: "Canceladas", value: `${latest.lider.canceladasEventos} / ${latest.lider.canceladasUnicos}`, sub: "Eventos / usuarios únicos", color: "#F59E0B", bg: "#FFFBEB" },
  ] : [];

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Dropi PM Tools
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Negociaciones</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={tag(ACCENT, ACCENT_BG)}>NEG-001</span>
          <span style={tag("#10B981", "#ECFDF5")}>Live · Beta proveedores</span>
          <span style={tag("#F59E0B", "#FFFBEB")}>Bugs por confirmar</span>
          <span style={tag("var(--muted)", "#F3F4F6")}>10 jun–1 jul 2026</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* Title */}
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 6, letterSpacing: "-0.02em" }}>
            Negociaciones Proveedor–Líder de Comunidad · Bitácora de Seguimiento
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.5 }}>
            Roles Proveedor y Líder de Comunidad. {WEEKS.length} semanas evaluadas desde la reactivación del feature (8 jun 2026) —
            el Líder solo tiene datos medibles desde {liderWeeks[0]?.id ?? "—"}.
            Fuente: <strong>UserPilot</strong> · actualizado al cierre de {latest.id.toLowerCase()} ({latest.fechas}).
          </p>
        </div>

        {/* KPI strip · Proveedor */}
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 8 }}>
            Rol Proveedor
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(0,1fr))", gap: 12 }}>
            {kpisProveedor.map(k => (
              <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}`, padding: "14px 16px" }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>
                  {k.label}
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: k.color, lineHeight: 1 }}>
                  {k.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, lineHeight: 1.3 }}>{k.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* KPI strip · Líder */}
        {latest.lider && (
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 8 }}>
              Rol Líder de Comunidad
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 12 }}>
              {kpisLider.map(k => (
                <div key={k.label} style={{ ...card, borderTop: `3px solid ${k.color}`, padding: "14px 16px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>
                    {k.label}
                  </div>
                  <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: "-0.03em", color: k.color, lineHeight: 1 }}>
                    {k.value}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 5, lineHeight: 1.3 }}>{k.sub}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alerta */}
        <div style={{ background: "linear-gradient(135deg, #F59E0B, #FBBF24)", borderRadius: 14, padding: "18px 20px", color: "#fff" }}>
          <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 6 }}>Creación del Proveedor en mínimo histórico — pero el Líder ya tiene datos medibles</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, opacity: 0.95 }}>
            {latest.dolores} Bugs de semanas anteriores (funnels de creación no representativos, correo de pruebas uxdropi@gmail.com sin ver el módulo) <strong>sin confirmar si siguen abiertos</strong> esta semana.
          </p>
        </div>

        {/* Evolución semanal · Proveedor */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Evolución semanal · Rol Proveedor</div>
              <div style={sectionSub}>{WEEKS.length} semanas · desde reactivación del feature (8 jun 2026). Fuente: UserPilot.</div>
            </div>
            <span style={tag("var(--muted)", "#F3F4F6")}>{WEEKS.length} semanas</span>
          </div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Semana</th>
                  <th style={thStyle}>Fechas</th>
                  <th style={thR}>Creadas (ev.)</th>
                  <th style={thR}>Creadas (únicos)</th>
                  <th style={thR}>Canceladas (ev.)</th>
                  <th style={thR}>Ingreso módulo (únicos)</th>
                  <th style={thR}>Notas</th>
                  <th style={thR}>Funnel creación</th>
                  <th style={thStyle}>Retención</th>
                </tr>
              </thead>
              <tbody>
                {WEEKS.map((w, i) => (
                  <tr key={w.id} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                    <td style={{ ...tdStyle, fontWeight: 800, color: ACCENT }}>{w.id}</td>
                    <td style={{ ...tdStyle, color: "var(--muted)", fontSize: 12 }}>{w.fechas}</td>
                    <td style={{ ...tdR, fontWeight: 700 }}>{w.proveedor.creadasEventos}</td>
                    <td style={tdR}>{w.proveedor.creadasUnicos}</td>
                    <td style={{ ...tdR, color: "#EF4444" }}>{w.proveedor.canceladasEventos}</td>
                    <td style={tdR}>{w.proveedor.ingresoUnicos}</td>
                    <td style={tdR}>{w.proveedor.notas}</td>
                    <td style={{ ...tdR, fontWeight: 700, color: w.proveedor.funnelRepresentativo ? "var(--fg)" : "#9CA3AF" }}>
                      {w.proveedor.funnelPct}{!w.proveedor.funnelRepresentativo && " *"}
                    </td>
                    <td style={{ ...tdStyle, fontSize: 12 }}>{w.retencionTendencia}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
            * Funnel no representativo esta semana — ver nota metodológica en Task Success más abajo.
          </div>
        </div>

        {/* Evolución semanal · Líder */}
        {liderWeeks.length > 0 && (
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <div style={sectionTitle}>Evolución semanal · Rol Líder de Comunidad</div>
                <div style={sectionSub}>{liderWeeks.length} semana(s) con datos medibles. Fuente: UserPilot.</div>
              </div>
              <span style={tag(LIDER_COLOR, LIDER_BG)}>{liderWeeks.length} semana(s)</span>
            </div>
            <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Semana</th>
                    <th style={thStyle}>Fechas</th>
                    <th style={thR}>Ingreso (únicos)</th>
                    <th style={thR}>Aprobadas</th>
                    <th style={thR}>Rechazadas</th>
                    <th style={thR}>Canceladas</th>
                    <th style={thR}>Funnel aprobación</th>
                    <th style={thR}>Funnel rechazo</th>
                  </tr>
                </thead>
                <tbody>
                  {liderWeeks.map((w, i) => (
                    <tr key={w.id} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                      <td style={{ ...tdStyle, fontWeight: 800, color: LIDER_COLOR }}>{w.id}</td>
                      <td style={{ ...tdStyle, color: "var(--muted)", fontSize: 12 }}>{w.fechas}</td>
                      <td style={tdR}>{w.lider!.ingresoUnicos}</td>
                      <td style={{ ...tdR, color: "#10B981", fontWeight: 700 }}>{w.lider!.aprobadasEventos}</td>
                      <td style={{ ...tdR, color: "#EF4444", fontWeight: 700 }}>{w.lider!.rechazadasEventos}</td>
                      <td style={{ ...tdR, color: "#F59E0B" }}>{w.lider!.canceladasEventos}</td>
                      <td style={tdR}>{w.lider!.funnelAprobadaPct} <span style={{ color: "var(--muted)", fontSize: 11 }}>({w.lider!.funnelAprobadaTiempo})</span></td>
                      <td style={tdR}>{w.lider!.funnelRechazadaPct} <span style={{ color: "var(--muted)", fontSize: 11 }}>({w.lider!.funnelRechazadaTiempo})</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Conclusiones por dimensión — semana más reciente */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Conclusiones por dimensión · {latest.id} ({latest.fechas})</div>
            <div style={sectionSub}>Adopción / Engagement · Task Success · Retención · Happiness.</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              { titulo: "A · Adopción y Engagement", desc: latest.conclusionAdopcion, color: ACCENT, bg: ACCENT_BG },
              { titulo: "T · Task Success (funnels)", desc: latest.conclusionTaskSuccess, color: "#F59E0B", bg: "#FFFBEB" },
              { titulo: "R · Retención", desc: latest.conclusionRetencion, color: "#3B82F6", bg: "#EFF6FF" },
              { titulo: "H · Happiness", desc: latest.conclusionHappiness, color: "#9CA3AF", bg: "#F3F4F6" },
            ].map(c => (
              <div key={c.titulo} style={{ padding: "12px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: c.color, marginBottom: 4 }}>{c.titulo}</div>
                <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Seguimiento cualitativo */}
        <div style={card}>
          <div style={{ marginBottom: 14 }}>
            <div style={sectionTitle}>Seguimiento cualitativo · {latest.id}</div>
            <div style={sectionSub}>Hallazgos, fricciones, bugs y próximos pasos reportados esta semana.</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { icon: "🔎", titulo: "Hallazgos clave", desc: latest.hallazgos, color: ACCENT, bg: ACCENT_BG },
              { icon: "⚠️", titulo: "Dolores / fricciones", desc: latest.dolores, color: "#F59E0B", bg: "#FFFBEB" },
              { icon: "🐞", titulo: "Bugs", desc: latest.bugs, color: "#EF4444", bg: "#FEF2F2" },
              { icon: "➡️", titulo: "Próximos pasos", desc: latest.proximosPasos, color: "#3B82F6", bg: "#EFF6FF" },
            ].map(h => (
              <div key={h.titulo} style={{ display: "flex", gap: 10, padding: "12px", background: h.bg, borderRadius: 10, border: "1px solid var(--border)" }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>{h.titulo}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>{h.desc}</div>
                </div>
              </div>
            ))}
          </div>
          {latest.notasSalvedades && (
            <div style={{ marginTop: 12, padding: "10px 12px", background: "#F8FAFC", borderRadius: 8, fontSize: 12, color: "var(--muted)", border: "1px solid var(--border)", lineHeight: 1.4 }}>
              <strong>Notas / salvedades:</strong> {latest.notasSalvedades}
            </div>
          )}
        </div>

        {/* Historial semanas anteriores */}
        {WEEKS.length > 1 && (
          <div style={card}>
            <div style={{ marginBottom: 14 }}>
              <div style={sectionTitle}>Historial · semanas anteriores</div>
              <div style={sectionSub}>Detalle cualitativo completo de cada semana previa a la más reciente.</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {WEEKS.slice(0, -1).reverse().map(w => (
                <details key={w.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "10px 14px" }}>
                  <summary style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", cursor: "pointer" }}>
                    {w.id} · {w.fechas} — {w.proveedor.creadasEventos} negociaciones creadas ({w.proveedor.creadasUnicos} únicos)
                    {w.lider ? ` · Líder: ${w.lider.aprobadasEventos} aprobadas, ${w.lider.rechazadasEventos} rechazadas` : ""}
                  </summary>
                  <div style={{ marginTop: 10, display: "flex", flexDirection: "column", gap: 8, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                    <div><strong style={{ color: "var(--fg)" }}>Lanzamiento:</strong> {w.lanzamiento}</div>
                    <div><strong style={{ color: "var(--fg)" }}>Hallazgos:</strong> {w.hallazgos}</div>
                    <div><strong style={{ color: "var(--fg)" }}>Dolores:</strong> {w.dolores}</div>
                    <div><strong style={{ color: "var(--fg)" }}>Bugs:</strong> {w.bugs}</div>
                    <div><strong style={{ color: "var(--fg)" }}>Próximos pasos:</strong> {w.proximosPasos}</div>
                  </div>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Fuente de datos */}
        <div style={{ ...card, background: "#F8FAFC", border: "1px solid #E5E7EB" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 8 }}>
            Fuente de datos · Cómo actualizar
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              { icon: "📊", titulo: "Bitácora fuente", desc: "Semana 1–2: Google Sheet \"Bitacora_Negociaciones_Semana1\" (rol Proveedor). Semana 3 en adelante: dashboard UserPilot \"Negociaciones\" (ambos roles). Cada semana nueva se agrega al array WEEKS en esta página." },
              { icon: "🧑‍🤝‍🧑", titulo: "Alcance por rol", desc: "Proveedor: datos desde Semana 1. Líder de Comunidad: datos medibles recién desde Semana 3 — no hay histórico previo para ese rol." },
              { icon: "🗓️", titulo: "Cadencia", desc: "Semanal, cortes lunes a domingo. Fuente: UserPilot (eventos, funnels, retención, CSAT/SEQ)." },
              { icon: "🐞", titulo: "Bugs a confirmar", desc: "Correo de pruebas uxdropi@gmail.com sin ver el módulo desde 16/06 y funnels de creación no representativos — reportados en Semana 1–2, sin confirmar si siguen abiertos en Semana 3." },
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
        </div>

      </div>
    </main>
  );
}
