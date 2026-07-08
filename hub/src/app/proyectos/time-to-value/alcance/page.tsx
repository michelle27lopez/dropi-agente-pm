"use client";

// ─── Shared styles ────────────────────────────────────────────────────────────
const card: React.CSSProperties = {
  background: "var(--card)", border: "1px solid var(--border)",
  borderRadius: 14, padding: "20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionTitle: React.CSSProperties = {
  fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4,
};
const sectionSub: React.CSSProperties = {
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4, marginBottom: 16,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700, color, background: bg,
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)", textAlign: "left",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)", fontSize: 13, verticalAlign: "top",
};

// ─── Pipeline GHL ─────────────────────────────────────────────────────────────
const PIPELINE_STAGES = [
  { etapa: "Nuevo registro", definicion: "Supplier recibido desde Dropi/UserPilot", accion: "Enviar bienvenida automática (correo + WhatsApp)", color: "#6366F1" },
  { etapa: "Perfil incompleto", definicion: "Faltan datos mínimos para operar", accion: "Enviar recordatorio + link de encuesta", color: "#8B5CF6" },
  { etapa: "Perfil calificado", definicion: "Datos suficientes para priorización", accion: "Asignar prioridad inicial (Alta/Media/Baja)", color: "#3B82F6" },
  { etapa: "En activación", definicion: "Completando documentación, bodega o catálogo", accion: "Secuencia de acompañamiento según prioridad", color: "#0EA5E9" },
  { etapa: "Checklist completo", definicion: "Cumplió requisitos mínimos previos", accion: "Crear solicitud de auditoría automáticamente", color: "#10B981" },
  { etapa: "Pendiente auditoría", definicion: "En cola para revisión operativa", accion: "Auditoría express (<12h para Alta prioridad)", color: "#14B8A6" },
  { etapa: "Auditoría aprobada", definicion: "Cumple requisitos operativos", accion: "Habilitar visibilidad de productos públicos", color: "#22C55E" },
  { etapa: "Proveedor activo", definicion: "Puede tener productos públicos visibles", accion: "Seguimiento hacia primera orden (día 0/3/7/14/20)", color: "#84CC16" },
  { etapa: "Activo sin primera orden", definicion: "Activo pero sin orden en ventana definida", accion: "Acción comercial o de catálogo específica", color: "#F59E0B" },
  { etapa: "Primera orden generada", definicion: "Recibió primera orden de un dropshipper", accion: "Cerrar hito de valor — registrar en Dropi + GHL", color: "#EF4444" },
  { etapa: "En frío", definicion: "No responde después de secuencias definidas", accion: "Sale de cola activa — campaña de reactivación", color: "#9CA3AF" },
];

// ─── Hipótesis ────────────────────────────────────────────────────────────────
const HIPOTESIS = [
  {
    codigo: "H1",
    titulo: "Activación acelerada de suppliers potenciales",
    descripcion: "Si identificamos temprano a los suppliers con mayor potencial y los llevamos a auditoría fast-track sin esperar a que completen todo el checklist, aumentará la cantidad de proveedores activos con capacidad real de publicar productos visibles.",
    mueve: "Base de suppliers activos y disponibilidad futura de catálogo. No mueve GMV por sí sola.",
    metricas: [
      "↑ Suppliers potenciales identificados",
      "↑ Suppliers auditados fast-track",
      "↑ Suppliers que llegan a Proveedor Activo",
      "↓ Tiempo de activación",
      "↓ Abandono antes de auditoría",
    ],
    color: "#6366F1",
    bg: "#EEF2FF",
  },
  {
    codigo: "H2",
    titulo: "Más catálogo público con stock real aumenta órdenes",
    descripcion: "Si los suppliers activados publican productos con stock disponible, suficiente profundidad y categorías relevantes, los dropshippers tendrán más oferta vendible y aumentará la probabilidad de órdenes.",
    mueve: "La hipótesis más conectada con catálogo y órdenes. GMV depende del ticket promedio, demanda y rotación.",
    metricas: [
      "↑ Productos públicos de suppliers nuevos",
      "↑ SKUs con stock > 0",
      "↑ Categorías cubiertas por nuevos suppliers",
      "↑ Productos de suppliers nuevos con al menos 1 orden",
      "↑ Órdenes y GMV de suppliers nuevos",
    ],
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    codigo: "H3",
    titulo: "Mejor validación operativa protege GMV",
    descripcion: "Si validamos capacidad operativa antes de habilitar productos públicos, aumentaremos órdenes de suppliers nuevos sin deteriorar cumplimiento, cancelaciones ni experiencia del dropshipper.",
    mueve: "Protege la conversión y evita pérdida de GMV. No genera más órdenes brutas, pero evita que se pierdan por mala operación.",
    metricas: [
      "↓ Cancelaciones por falta de stock",
      "↓ Órdenes rechazadas por supplier nuevo",
      "↑ % órdenes dentro de SLA",
      "↓ GMV perdido por cancelaciones",
      "↑ Recompra / continuidad dropshipper",
    ],
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
];

// ─── KPIs ─────────────────────────────────────────────────────────────────────
const KPIS = [
  { kpi: "Suppliers activos en ≤ 5 días", definicion: "North Star operativa", objetivo: "Meta principal del experimento" },
  { kpi: "Tiempo de Activación (TTA)", definicion: "Días entre registro y proveedor activo", objetivo: "≤ 5 días" },
  { kpi: "Tasa de avance a checklist completo", definicion: "% que completan requisitos mínimos", objetivo: "Definir línea base" },
  { kpi: "SLA de auditoría", definicion: "Tiempo entre solicitud y decisión", objetivo: "< 12h para Alta prioridad" },
  { kpi: "Tasa de aprobación primer intento", definicion: "% aprobados sin reproceso", objetivo: "> 85%" },
  { kpi: "Suppliers con primera orden en ≤ 20 días", definicion: "Outcome comercial — registro → orden", objetivo: "Meta comercial" },
  { kpi: "Activos sin primera orden", definicion: "Suppliers activos que no han generado orden", objetivo: "Reducir progresivamente" },
  { kpi: "GMV de suppliers nuevos", definicion: "GMV generado por suppliers activados recientemente", objetivo: "Métrica de impacto" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function AlcanceTtvPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "14px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
      }}>
        <a href="/proyectos/time-to-value" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Time to Value
        </a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Alcance / Meta</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>TTV-001</span>
          <span style={tag("#10B981", "#ECFDF5")}>🎯 TOBE</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ¿Por qué 620? */}
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 18, fontWeight: 800, color: "var(--fg)" }}>¿Por qué 620 suppliers?</div>
              <div style={{ fontSize: 13, color: "var(--muted)", marginTop: 2 }}>
                Base del análisis · Snapshot real de la plataforma Dropi · 2026-06-10
              </div>
            </div>
            <span style={tag("var(--muted)", "#F3F4F6")}>📅 Snapshot 2026-06-10</span>
          </div>

          {/* Bloque 1 — Estado de la plataforma */}
          <div style={card}>
            <div style={{ marginBottom: 14 }}>
              <div style={sectionTitle}>Estado real de la plataforma</div>
              <div style={{ ...sectionSub, marginBottom: 0 }}>
                Datos de Dropi al momento del análisis. Punto de partida para calcular el potencial.
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 12 }}>
              {[
                { label: "Productos creados (histórico)", value: "1.446.780", color: "#6366F1", note: "Todos los que alguna vez existieron" },
                { label: "Productos vigentes hoy", value: "1.079.982", color: "#3B82F6", note: "Activos en la plataforma" },
                { label: "Productos con ≥ 1 orden", value: "536.590", color: "#10B981", note: "37.1% del total vigente" },
                { label: "Productos SIN órdenes", value: "~679.311", color: "#F59E0B", note: "Pool dormido — mayor oportunidad" },
                { label: "Órdenes históricas totales", value: "53.448.588", color: "#8B5CF6", note: "Base de productividad" },
                { label: "Run rate actual", value: "3.2M / mes", color: "#EF4444", note: "38.4M/año · suppliers = 65–70%" },
              ].map(m => (
                <div key={m.label} style={{
                  background: "#F8FAFC", borderRadius: 10, padding: "14px",
                  border: "1px solid var(--border)",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em", color: m.color, lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{m.note}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bloque 2 — Métricas clave */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <div style={{ ...card, borderTop: "3px solid #10B981" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>
                Métrica clave 1
              </div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#10B981", letterSpacing: "-0.05em", lineHeight: 1 }}>
                37.1%
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginTop: 6 }}>
                Conversión histórica producto → orden
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                De cada 100 productos publicados en Dropi, 37 han generado al menos 1 orden alguna vez.
                Usamos este porcentaje para proyectar cuántos de los 31.000 productos nuevos
                van a generar órdenes.
              </div>
            </div>
            <div style={{ ...card, borderTop: "3px solid #6366F1" }}>
              <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted)", marginBottom: 8 }}>
                Métrica clave 2
              </div>
              <div style={{ fontSize: 42, fontWeight: 800, color: "#6366F1", letterSpacing: "-0.05em", lineHeight: 1 }}>
                19.9
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginTop: 6 }}>
                Órdenes / año por producto activo
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, lineHeight: 1.5 }}>
                Un producto que tiene al menos 1 orden genera en promedio 99.6 órdenes en su vida útil
                histórica (~19.9/año ajustado a 5 años). Usamos este dato para calcular el potencial
                de GMV de la cohorte.
              </div>
            </div>
          </div>

          {/* Bloque 2.5 — Análisis Colombia sin atípicos */}
          <div style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={sectionTitle}>Análisis de la base real — Colombia</div>
                <div style={{ ...sectionSub, marginBottom: 0 }}>
                  596 suppliers activos en CO. Análisis de distribución para depurar atípicos antes de proyectar.
                </div>
              </div>
              <span style={tag("#6366F1", "#EEF2FF")}>Solo CO · Snapshot 2026-06-10</span>
            </div>

            {/* Fila de exclusión */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 20 }}>
              {[
                { label: "Total suppliers CO", value: "596", color: "var(--fg)", bg: "#F8FAFC", note: "Base completa" },
                { label: "Ghosts (0 órdenes)", value: "56", color: "#EF4444", bg: "#FEF2F2", note: "9.4% — nunca activaron" },
                { label: "Mega-suppliers (+200k ord)", value: "22", color: "#F59E0B", bg: "#FFFBEB", note: "3.7% — marcas establecidas" },
                { label: "Población limpia", value: "487", color: "#10B981", bg: "#ECFDF5", note: "81.9% — universo real" },
              ].map(m => (
                <div key={m.label} style={{ background: m.bg, border: "1px solid var(--border)", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6 }}>
                    {m.label}
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: m.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {m.value}
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{m.note}</div>
                </div>
              ))}
            </div>

            {/* Distribución por buckets */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Distribución de órdenes por supplier
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "0 órdenes", count: 56, pct: 9.4, color: "#EF4444", excluir: true },
                  { label: "1 – 50", count: 30, pct: 5.0, color: "#F97316", excluir: true },
                  { label: "51 – 300", count: 13, pct: 2.2, color: "#F59E0B", excluir: false },
                  { label: "301 – 1.000", count: 26, pct: 4.4, color: "#84CC16", excluir: false },
                  { label: "1.001 – 5.000", count: 56, pct: 9.4, color: "#10B981", excluir: false },
                  { label: "5.001 – 50.000", count: 274, pct: 46.0, color: "#3B82F6", excluir: false },
                  { label: "50.001 – 200.000", count: 119, pct: 20.0, color: "#6366F1", excluir: false },
                  { label: "+200.000", count: 22, pct: 3.7, color: "#9CA3AF", excluir: true },
                ].map(b => (
                  <div key={b.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 140, fontSize: 12, color: b.excluir ? "#9CA3AF" : "var(--fg)", fontWeight: b.excluir ? 400 : 600, flexShrink: 0, display: "flex", alignItems: "center", gap: 6 }}>
                      {b.excluir && <span style={{ fontSize: 10, color: "#EF4444", fontWeight: 700 }}>✕</span>}
                      {b.label}
                    </div>
                    <div style={{ flex: 1, height: 22, background: "#F3F4F6", borderRadius: 6, overflow: "hidden", position: "relative" }}>
                      <div style={{
                        height: "100%", width: `${Math.max(b.pct * 2, 1)}%`,
                        background: b.excluir ? "#E5E7EB" : b.color,
                        borderRadius: 6, opacity: b.excluir ? 0.5 : 1,
                        transition: "width 0.3s",
                      }} />
                    </div>
                    <div style={{ width: 70, fontSize: 12, textAlign: "right", color: b.excluir ? "#9CA3AF" : "var(--fg)", flexShrink: 0 }}>
                      {b.count} <span style={{ color: "var(--muted)" }}>({b.pct}%)</span>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 8 }}>
                ✕ Filas marcadas = excluidas del análisis limpio
              </div>
            </div>

            {/* Comparación con vs sin atípicos */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "14px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                  Con todos (596 suppliers)
                </div>
                {[
                  { label: "Órdenes promedio", value: "41.839" },
                  { label: "Órdenes mediana", value: "14.736" },
                  { label: "Productos mediana", value: "98" },
                ].map(m => (
                  <div key={m.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #F3F4F6", fontSize: 12 }}>
                    <span style={{ color: "var(--muted)" }}>{m.label}</span>
                    <span style={{ fontWeight: 700, color: "#9CA3AF" }}>{m.value}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#ECFDF5", borderRadius: 10, padding: "14px", border: "1px solid #A7F3D0" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                  Sin atípicos (487 suppliers) ✓
                </div>
                {[
                  { label: "Órdenes promedio", value: "34.806" },
                  { label: "Órdenes mediana", value: "18.977" },
                  { label: "Productos mediana", value: "119" },
                ].map(m => (
                  <div key={m.label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #D1FAE5", fontSize: 12 }}>
                    <span style={{ color: "#065F46" }}>{m.label}</span>
                    <span style={{ fontWeight: 700, color: "#059669" }}>{m.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Segmentación limpia */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
                Segmentación de la población limpia
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                {[
                  { label: "Bajo", rango: "≤ 50k órdenes", count: 369, pctTotal: "62%", ordProm: "16.105", prodProm: "215", prodOrd: "158", color: "#3B82F6" },
                  { label: "Medio", rango: "50k – 100k órdenes", count: 78, pctTotal: "13%", ordProm: "70.996", prodProm: "514", prodOrd: "425", color: "#8B5CF6" },
                  { label: "Alto", rango: "+100k órdenes", count: 40, pctTotal: "7%", ordProm: "136.747", prodProm: "453", prodOrd: "410", color: "#EF4444" },
                ].map(s => (
                  <div key={s.label} style={{ background: "#F8FAFC", border: `1px solid var(--border)`, borderTop: `3px solid ${s.color}`, borderRadius: 10, padding: "14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{s.label}</div>
                      <span style={{ fontSize: 11, fontWeight: 700, color: s.color, background: "#fff", padding: "2px 8px", borderRadius: 20, border: `1px solid ${s.color}30` }}>
                        {s.count} sup.
                      </span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10 }}>{s.rango}</div>
                    {[
                      { l: "Órd. promedio", v: s.ordProm },
                      { l: "Prods. vigentes prom.", v: s.prodProm },
                      { l: "Prods. con orden prom.", v: s.prodOrd },
                    ].map(m => (
                      <div key={m.l} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: "1px solid #E5E7EB", fontSize: 11 }}>
                        <span style={{ color: "var(--muted)" }}>{m.l}</span>
                        <span style={{ fontWeight: 700, color: "var(--fg)" }}>{m.v}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Alerta conversión */}
            <div style={{ padding: "10px 14px", background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A", fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
              <strong>⚠ Nota sobre conversión:</strong> El ratio productos_con_orden / productos_vigentes supera el 100% en muchos casos (mediana 86.7%, promedio 115%). Esto ocurre porque el numerador es histórico (todos los productos que alguna vez tuvieron una orden) pero el denominador es vigente hoy. No son comparables directamente — el dato de 37.1% del análisis original viene de la plataforma total, no de este cálculo por supplier.
            </div>
          </div>

          {/* Bloque 3 — El razonamiento paso a paso */}
          <div style={card}>
            <div style={{ marginBottom: 16 }}>
              <div style={sectionTitle}>El cálculo — paso a paso</div>
              <div style={{ ...sectionSub, marginBottom: 0 }}>
                Revisado con datos reales de CO (n=487 sin atípicos). Escenario base: ~105.000 órdenes/año.
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                {
                  paso: "01",
                  titulo: "Definir meta de suppliers a activar",
                  detalle: "Target de activación del experimento. No segmentado por volumen declarado sino por potencial operativo real.",
                  resultado: "620 suppliers",
                  color: "#6366F1",
                },
                {
                  paso: "02",
                  titulo: "Estimar productos publicados en año 1",
                  detalle: "Mediana real CO Bajo = 94 vigentes, pero nuevos suppliers empiezan desde cero. Estimación conservadora: ~60 productos al cierre del año.",
                  resultado: "37.200 productos",
                  color: "#3B82F6",
                },
                {
                  paso: "03",
                  titulo: "Aplicar conversión producto → orden",
                  detalle: "Plataforma total: 37.1% · Segmento Bajo CO establecido: 73%. Para suppliers nuevos usamos punto intermedio conservador: 50%.",
                  resultado: "18.600 con orden",
                  color: "#10B981",
                },
                {
                  paso: "04",
                  titulo: "Productividad real anualizada (CO Bajo)",
                  detalle: "Segmento Bajo CO: 45.2 órd/producto-activo/año (mediana, anualizado por antigüedad real de 2.7 años). Dato de la plataforma real, no estimado.",
                  resultado: "45.2 órd/prod/año",
                  color: "#F59E0B",
                },
                {
                  paso: "05",
                  titulo: "Factor de maduración año 1 — revisado",
                  detalle: "El Bajo CO lleva 2.7 años acumulando demanda. Un supplier nuevo empieza sin historial. Factor realista año 1: 10–15% (vs 35% original que sobreestimaba). Base: 12.5%.",
                  resultado: "12.5% ramp",
                  color: "#8B5CF6",
                },
                {
                  paso: "06",
                  titulo: "Resultado escenario base (revisado)",
                  detalle: "18.600 productos × 45.2 órd/año × 12.5% ramp = 105.090 órdenes/año · ~8.758/mes",
                  resultado: "~105.000 órdenes/año",
                  color: "#EF4444",
                  highlight: true,
                },
              ].map((p, i, arr) => (
                <div key={p.paso} style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
                  {/* Línea vertical */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: "50%",
                      background: p.color, color: "#fff",
                      fontSize: 11, fontWeight: 800,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      flexShrink: 0, zIndex: 1,
                    }}>
                      {p.paso}
                    </div>
                    {i < arr.length - 1 && (
                      <div style={{ width: 2, flex: 1, background: "#E5E7EB", margin: "4px 0" }} />
                    )}
                  </div>
                  {/* Contenido */}
                  <div style={{
                    flex: 1, paddingBottom: i < arr.length - 1 ? 16 : 0,
                    paddingLeft: 12, paddingTop: 2,
                    paddingRight: 0,
                  }}>
                    <div style={{
                      background: p.highlight ? "#FFF7EF" : "#F8FAFC",
                      border: `1px solid ${p.highlight ? "rgba(247,127,0,0.3)" : "var(--border)"}`,
                      borderRadius: 10, padding: "12px 14px",
                      display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12,
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>
                          {p.titulo}
                        </div>
                        <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>
                          {p.detalle}
                        </div>
                      </div>
                      <div style={{
                        fontSize: 13, fontWeight: 800, color: p.color,
                        background: p.highlight ? "#FEF3C7" : "#fff",
                        padding: "6px 12px", borderRadius: 8,
                        border: `1px solid ${p.color}20`,
                        whiteSpace: "nowrap", flexShrink: 0,
                      }}>
                        {p.resultado}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Gap al OKR */}
            <div style={{
              marginTop: 16, padding: "12px 16px",
              background: "#EFF6FF", borderRadius: 10,
              border: "1px solid #BFDBFE",
              display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap",
            }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#1E40AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
                  Contexto — Gap al OKR
                </div>
                <div style={{ fontSize: 12, color: "#1E3A8A", lineHeight: 1.5 }}>
                  Run rate actual de suppliers: ~25.9M órdenes/año.
                  OKR objetivo: 93.6M/año. <strong>Gap: 55.2M órdenes adicionales.</strong>
                  Las ~105.000 de este experimento representan ~0.19% del gap — es validación, no solución total.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen ejecutivo */}
        <div style={{
          ...card,
          background: "linear-gradient(135deg, var(--dropi) 0%, #FF8A2B 100%)",
          color: "#fff", position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", width: 300, height: 300, borderRadius: "50%",
            background: "rgba(255,255,255,0.08)", right: -120, top: -100, pointerEvents: "none",
          }} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.75)", marginBottom: 6 }}>
              North Star · TTV-001
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1, marginBottom: 8 }}>
              Registro → Activo en ≤ 5 días
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", maxWidth: 600, lineHeight: 1.5, marginBottom: 16 }}>
              Activación operativa de suppliers sin desarrollo nuevo. Solución vía CRM (GHL) + automatización.
              Lineamiento: no gastar presupuesto de desarrollo hasta validar impacto económico.
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, maxWidth: 700 }}>
              {[
                { v: "620", l: "Suppliers meta" },
                { v: "≤ 5d", l: "Activación" },
                { v: "≤ 20d", l: "Primera orden" },
                { v: "6 meses", l: "Horizonte" },
              ].map(({ v, l }) => (
                <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px" }}>
                  <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.02em" }}>{v}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 3 }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline GHL */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Pipeline GHL — 11 etapas</div>
              <div style={{ ...sectionSub, marginBottom: 0 }}>
                Fuente de verdad operativa: GHL gestiona · Dropi confirma.
              </div>
            </div>
            <span style={tag("#6366F1", "#EEF2FF")}>GHL Fast-Track</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {PIPELINE_STAGES.map((s, i) => (
              <div key={s.etapa} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "10px 14px", borderRadius: 10,
                background: i % 2 === 0 ? "#F8FAFC" : "#fff",
                border: "1px solid var(--border)",
              }}>
                <div style={{
                  width: 26, height: 26, borderRadius: "50%",
                  background: s.color, color: "#fff",
                  fontSize: 11, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{s.etapa}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{s.definicion}</div>
                </div>
                <div style={{
                  fontSize: 12, color: "#374151",
                  background: "#F3F4F6", borderRadius: 8,
                  padding: "4px 10px", flexShrink: 0, maxWidth: 280, textAlign: "right",
                }}>
                  {s.accion}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hitos del proceso */}
        <div style={card}>
          <div style={sectionTitle}>Hitos del proceso (5)</div>
          <div style={{ ...sectionSub }}>De registro a primera orden. Cada hito tiene sistema responsable.</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
            {[
              { n: 1, nombre: "Registro recibido", sistema: "Dropi / UserPilot / GHL", color: "#6366F1" },
              { n: 2, nombre: "Perfil calificado", sistema: "GHL", color: "#3B82F6" },
              { n: 3, nombre: "Checklist completo", sistema: "Dropi / UserPilot / GHL", color: "#10B981" },
              { n: 4, nombre: "Proveedor activo", sistema: "Dropi / GHL", color: "#F59E0B" },
              { n: 5, nombre: "Primera orden generada", sistema: "Dropi / GHL", color: "#EF4444" },
            ].map((h, i, arr) => (
              <div key={h.n} style={{ position: "relative" }}>
                {i < arr.length - 1 && (
                  <div style={{
                    position: "absolute", right: -6, top: "30%",
                    fontSize: 14, color: "#D1D5DB", zIndex: 2, fontWeight: 700,
                  }}>→</div>
                )}
                <div style={{
                  ...card, textAlign: "center", padding: "14px 10px",
                  borderTop: `3px solid ${h.color}`,
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%", background: h.color,
                    color: "#fff", fontSize: 13, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    margin: "0 auto 8px",
                  }}>{h.n}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>{h.nombre}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>{h.sistema}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hipótesis */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>
            Las 3 hipótesis del experimento
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {HIPOTESIS.map(h => (
              <div key={h.codigo} style={{ ...card, borderLeft: `4px solid ${h.color}` }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <span style={{
                    ...tag(h.color, h.bg),
                    fontSize: 13, fontWeight: 800, padding: "4px 10px", flexShrink: 0,
                  }}>
                    {h.codigo}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
                      {h.titulo}
                    </div>
                    <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 10 }}>
                      {h.descripcion}
                    </div>
                    <div style={{ fontSize: 11, color: h.color, fontWeight: 700, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      Qué mueve
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>{h.mueve}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {h.metricas.map(m => (
                        <span key={m} style={{
                          fontSize: 11, padding: "3px 9px", borderRadius: 20,
                          background: h.bg, color: h.color, fontWeight: 600,
                        }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Proyección de impacto */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
            <div>
              <div style={sectionTitle}>Proyección de impacto — Revisada con datos CO</div>
              <div style={{ ...sectionSub, marginBottom: 0 }}>
                620 suppliers · 60 prods/supplier · 50% conversión · 45.2 órd/prod/año (mediana CO Bajo)
              </div>
            </div>
            <span style={tag("#10B981", "#ECFDF5")}>~105.000 órdenes/año</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
            {[
              { label: "Conservador", factor: "10%", ordenes: "84.072", mes: "7.006", color: "#3B82F6" },
              { label: "Base", factor: "12.5%", ordenes: "105.090", mes: "8.757", color: "#10B981", highlight: true },
              { label: "Agresivo", factor: "15%", ordenes: "126.108", mes: "10.509", color: "#F59E0B" },
            ].map(s => (
              <div key={s.label} style={{
                ...card,
                border: s.highlight ? `2px solid ${s.color}` : "1px solid var(--border)",
                padding: "16px",
              }}>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", color: s.color, marginBottom: 6 }}>
                  {s.label} {s.highlight ? "★" : ""}
                </div>
                <div style={{ fontSize: 10, color: "var(--muted)", marginBottom: 4 }}>Factor maduración: {s.factor}</div>
                <div style={{ fontSize: 26, fontWeight: 800, color: "var(--fg)", letterSpacing: "-0.03em" }}>
                  {s.ordenes}
                </div>
                <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>órdenes/año · {s.mes}/mes</div>
                <div style={{ marginTop: 10, height: 4, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: s.factor, background: s.color, borderRadius: 999 }} />
                </div>
              </div>
            ))}
          </div>
          <div style={{
            padding: "10px 14px", background: "#F8FAFC", borderRadius: 10,
            fontSize: 12, color: "var(--muted)", lineHeight: 1.5,
          }}>
            <strong>Potencial maduro de la cohorte (año 3+, 100% ramp):</strong> ~840.000 órdenes anuales
            (18.600 prods × 45.2 órd/año sin descuento de maduración).
            Conversión usada: 50% — entre el 37.1% de plataforma total y el 73% del segmento CO Bajo establecido.
          </div>
        </div>

        {/* KPIs */}
        <div style={card}>
          <div style={sectionTitle}>KPIs del experimento</div>
          <div style={{ ...sectionSub }}>Métricas que definen éxito y permiten medir el avance.</div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>KPI</th>
                  <th style={thStyle}>Definición</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Objetivo</th>
                </tr>
              </thead>
              <tbody>
                {KPIS.map((k, i) => (
                  <tr key={k.kpi} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                    <td style={{ ...tdStyle, fontWeight: 600, color: "var(--fg)" }}>{k.kpi}</td>
                    <td style={{ ...tdStyle, color: "var(--muted)" }}>{k.definicion}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: "var(--dropi)" }}>
                      {k.objetivo}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Gaps vigentes */}
        <div style={{ ...card, border: "1px solid #FDE68A", background: "#FFFBEB" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#92400E", marginBottom: 10 }}>
            ⚠ Gaps vigentes — Bloqueantes activos
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { n: 1, texto: "Integración Dropi → GHL sin fecha confirmada — cuello de botella técnico. Laura + Enrique responsables.", owner: "Laura + Enrique" },
              { n: 2, texto: "SLA de auditoría < 12h para prioridad alta — no validado con el equipo de auditoría. Riesgo operativo real.", owner: "Equipo Auditoría" },
            ].map(g => (
              <div key={g.n} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "10px 14px", background: "#fff", borderRadius: 10,
                border: "1px solid #FDE68A",
              }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%", background: "#F59E0B",
                  color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{g.n}</span>
                <div style={{ flex: 1, fontSize: 13, color: "#78350F", lineHeight: 1.5 }}>{g.texto}</div>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#92400E",
                  background: "#FEF3C7", padding: "3px 9px", borderRadius: 20, flexShrink: 0,
                }}>
                  {g.owner}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
