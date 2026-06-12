"use client";

const WEEK = "Semana 12–18 junio 2026";
const SUBTITLE = "Estado de oportunidades, hipótesis y accionables comerciales";

const oportunidades = [
  {
    code: "DCA-002",
    name: "Descuentos para activar y mover catálogo",
    status: "Aprobada · Exploración con hipótesis numérica",
    color: "#F77F00",
    mueve: "Órdenes / activación de catálogo",
    hipotesis: "626.000 órdenes/año base",
    gmv: "USD 9,39M teórico",
    fases: "F1 descuento básico · F2 filtro/vitrina · F3 campañas",
    next: "Validar piloto: productos con descuento vs. grupo control",
  },
  {
    code: "DCA-001",
    name: "Catálogos preseleccionados para activación comercial",
    status: "Aprobada · MVP de campañas en curso",
    color: "#0EA5E9",
    mueve: "Órdenes + GMV por curaduría de ticket alto",
    hipotesis: "149.300 órdenes/año base",
    gmv: "USD 2,24M estándar · USD 3,73M high ticket",
    fases: "F1 vitrina curada · F2 postulación supplier · F3 gestión campañas",
    next: "Conectar MVP: banner/filtro de productos por campaña",
  },
  {
    code: "CAT-001",
    name: "Categorización y enriquecimiento inteligente del catálogo",
    status: "Aprobada · Habilitador estructural",
    color: "#7C3AED",
    mueve: "Habilita búsqueda, campañas, IA y catálogo",
    hipotesis: "Sin proyección directa — medir lift vs. control",
    gmv: "Medir por lift vs. control",
    fases: "F1 taxonomía + piloto IA · F2 reprocesamiento · F3 asistente IA",
    next: "Preparar Dropy Score / backlog con piloto por categorías críticas",
  },
  {
    code: "CAZ-001",
    name: "Caza Productos + Búsqueda Semántica como motor de demanda",
    status: "Aprobada · Discovery / instrumentación",
    color: "#EC4899",
    mueve: "Demanda real → productos activados → órdenes",
    hipotesis: "54.000 órdenes/año con semántica activa",
    gmv: "USD 810K base · USD 1,62M alto",
    fases: "F1 instrumentación · F2 Verificados light · F3 marketplace oportunidades",
    next: "Instrumentar búsqueda semántica y medir respuesta supplier",
  },
  {
    code: "TTV-001",
    name: "Time to Value · Activación de suppliers",
    status: "Aprobada · En ejecución operativa / GHL",
    color: "#10B981",
    mueve: "Nuevos suppliers activos con catálogo visible",
    hipotesis: "620 suppliers · 80.500 órdenes/año base",
    gmv: "USD 1,21M base · USD 3,44M maduro (año 3)",
    fases: "F1 pipeline · F2 automatización · F3 optimización por segmentos",
    next: "Automatizar eventos webhook GHL: registro, primera orden creada y entregada",
  },
];

const dolores = [
  {
    frente: "Trazabilidad del ciclo de orden",
    tag: "Accionables claros",
    tagColor: "#0EA5E9",
    salio: "360.000 cancelaciones/mes · 40.000 pendientes confirmación aprox.",
    accionables: "Agregar motivo/texto de cancelación al reporte; visual al proveedor sobre pendiente confirmación; revisar ventana 15 días; alinear con logística.",
    ruta: "Back Office / Data / Soporte",
    rutaColor: "#F77F00",
    metrica: "Cancelaciones por motivo, por stock, órdenes en pendiente, stock comprometido.",
    decision: "Prioridad alta como quick win de visibilidad.",
  },
  {
    frente: "Disponibilidad real de proveedor y productos",
    tag: "Requiere definición",
    tagColor: "#7C3AED",
    salio: "Modo vacaciones, pausas por bodega, productos privatizados sin trazabilidad.",
    accionables: "Diseñar modo vacaciones; evaluar pausa por bodega; checklist previo; medir productos privatizados por fecha y movimiento.",
    ruta: "Nuevo discovery / OPS + Producto",
    rutaColor: "#6B7280",
    metrica: "Proveedores en pausa, órdenes durante pausa, indemnizaciones evitadas.",
    decision: "Dejar como candidato posterior; primero cerrar reglas operativas.",
  },
  {
    frente: "Descubrimiento de proveedores confiables",
    tag: "Quick win visual",
    tagColor: "#10B981",
    salio: "Banner actual no comunica bien exclusivos; 35 proveedores exclusivos sin visibilidad.",
    accionables: "Mejorar banner; agregar flecha de regreso; mostrar logo; cambiar copy a proveedores exclusivos.",
    ruta: "Marketing / WordPress primero · Producto después",
    rutaColor: "#10B981",
    metrica: "Impresiones, CTR, clics a proveedor, contactos, órdenes atribuidas.",
    decision: "Acción corta con Majo/Marketing antes de convertirlo en proyecto.",
  },
  {
    frente: "Garantías con recolección",
    tag: "Dolor puntual",
    tagColor: "#F77F00",
    salio: "Proveedor no ve costo de recolección; flete puede hacer no rentable la garantía.",
    accionables: "Mostrar costo de flete en reporte; cruzar costo logístico vs. valor producto; detectar garantías no rentables.",
    ruta: "Data / Back Office / Garantías",
    rutaColor: "#6B7280",
    metrica: "Garantías con recolección, costo promedio, casos donde flete supera margen.",
    decision: "Quick win de información financiera, no proyecto grande inicialmente.",
  },
  {
    frente: "Señales de capacitación / certificación",
    tag: "Conectar con confianza",
    tagColor: "#EC4899",
    salio: "Insignia Dropi Academy para proveedores que completan proceso educativo.",
    accionables: "Definir criterio 100%; definir dónde se muestra; medir impacto en selección.",
    ruta: "Integrar con Descubrimiento de proveedores confiables",
    rutaColor: "#7C3AED",
    metrica: "Proveedores certificados, clics, publicaciones, órdenes, tasa de entrega.",
    decision: "No tratarlo aislado — sumarlo como señal dentro de confianza.",
  },
  {
    frente: "MVP de campañas",
    tag: "Conectado a DCA-001",
    tagColor: "#0EA5E9",
    salio: "Banner que filtre productos de campaña sin depender de escribir nombre en buscador.",
    accionables: "Diseñar banner; definir agrupación por tag/categoría/IDs; botón con filtro automático; revisar con Fer/José/Majo.",
    ruta: "Integrar en DCA-001 · Catálogos preseleccionados F1",
    rutaColor: "#0EA5E9",
    metrica: "Clics banner, productos vistos, importaciones, órdenes, GMV por campaña.",
    decision: "Meterlo dentro de la fase 1 de Catálogos preseleccionados.",
  },
];

const matriz = [
  {
    titulo: "OPS / Back Office / Data",
    color: "#F77F00",
    items: ["Motivos de cancelación en reporte", "Flete de recolección en garantías", "Reporte pendiente confirmación"],
    nota: "Mover rápido, medir impacto y no esperar un proyecto grande.",
  },
  {
    titulo: "Marketing / WordPress",
    color: "#0EA5E9",
    items: ["Banner proveedores exclusivos", "Logos y copy actualizados", "Links de contacto directo"],
    nota: "Validar con Majo; tratar como quick win visual.",
  },
  {
    titulo: "Fase aprobada",
    color: "#10B981",
    items: ["MVP campañas → DCA-001 F1", "Señales de confianza → Descubrimiento", "Insignia → frente de confianza"],
    nota: "Conectar lo comercial con oportunidades ya aprobadas.",
  },
  {
    titulo: "Discovery posterior",
    color: "#7C3AED",
    items: ["Modo vacaciones por bodega", "Reglas de productos privatizados", "Ranking robusto de proveedores"],
    nota: "No comprometer desarrollo sin reglas y métricas base.",
  },
];

export default function WeeklyPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>

      {/* Header */}
      <header style={{
        background: "#fff",
        borderBottom: "1px solid var(--border)",
        padding: "16px 32px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
        <span style={{ color: "var(--border)" }}>/</span>
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Weekly · Supplier Success</span>
        <span style={{
          marginLeft: "auto",
          fontSize: 11, fontWeight: 700,
          background: "#FFF3E0", color: "#C05600",
          padding: "4px 10px", borderRadius: 999,
        }}>
          {WEEK}
        </span>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Hero */}
        <div style={{
          background: "linear-gradient(135deg, #111827 0%, #1f2937 55%, #c2410c 100%)",
          borderRadius: 20,
          padding: "40px",
          marginBottom: 28,
          color: "#fff",
        }}>
          <div style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.12)",
            borderRadius: 999,
            padding: "6px 14px",
            fontSize: 12, fontWeight: 700,
            marginBottom: 16,
          }}>
            Portafolio organizado por estado
          </div>
          <h1 style={{
            fontSize: "clamp(26px,4vw,46px)",
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1.05,
            margin: "0 0 14px",
          }}>
            Oportunidades aprobadas<br />+ accionables de Comercial
          </h1>
          <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 15, margin: 0 }}>
            {SUBTITLE}
          </p>

          {/* Metrics strip */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: 12,
            marginTop: 28,
          }}>
            {[
              { label: "Oportunidades propias", value: "5", sub: "aprobadas / alineadas" },
              { label: "Con hipótesis numérica", value: "4", sub: "órdenes + GMV" },
              { label: "Habilitador", value: "1", sub: "categorización" },
              { label: "Dolores Comercial", value: "5 + 1", sub: "incluye MVP campañas" },
              { label: "GMV base por orden", value: "USD 15", sub: "referencia mercado CO" },
            ].map((m) => (
              <div key={m.label} style={{
                border: "1px solid rgba(255,255,255,0.16)",
                background: "rgba(255,255,255,0.10)",
                borderRadius: 14,
                padding: "14px 16px",
              }}>
                <span style={{ display: "block", color: "rgba(255,255,255,0.68)", fontSize: 11, fontWeight: 800 }}>{m.label}</span>
                <strong style={{ display: "block", fontSize: 26, letterSpacing: "-0.04em", marginTop: 4 }}>{m.value}</strong>
                <small style={{ display: "block", color: "rgba(255,255,255,0.72)", fontSize: 11, fontWeight: 700, marginTop: 2 }}>{m.sub}</small>
              </div>
            ))}
          </div>
        </div>

        {/* ── Sección 1: Oportunidades ── */}
        <Section title="1. Oportunidades aprobadas · estado y métricas" badge="Estratégicas"
          sub="Iniciativas con hipótesis funcional, fases y señales numéricas para presentar como portafolio OKR.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
            {oportunidades.map((op) => (
              <div key={op.code} style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderTop: `4px solid ${op.color}`,
                borderRadius: 16,
                padding: 20,
              }}>
                <div style={{
                  display: "inline-block",
                  fontSize: 11, fontWeight: 800,
                  background: "#F3F4F6", color: "#374151",
                  padding: "5px 10px", borderRadius: 999,
                  marginBottom: 10,
                }}>
                  {op.status}
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: "0 0 14px", lineHeight: 1.3 }}>
                  <span style={{ color: op.color, marginRight: 6, fontSize: 12 }}>{op.code}</span>
                  {op.name}
                </h3>

                {/* Mini metrics */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 12 }}>
                  {[
                    { label: "Mueve", val: op.mueve },
                    { label: "Hipótesis", val: op.hipotesis },
                    { label: "GMV", val: op.gmv },
                  ].map((m) => (
                    <div key={m.label} style={{
                      background: "#F8FAFC",
                      border: "1px solid var(--border)",
                      borderRadius: 10, padding: "10px 10px",
                    }}>
                      <span style={{ display: "block", fontSize: 10, fontWeight: 800, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>{m.label}</span>
                      <strong style={{ display: "block", fontSize: 12, color: "var(--fg)", marginTop: 4, lineHeight: 1.3 }}>{m.val}</strong>
                    </div>
                  ))}
                </div>

                {/* Fases */}
                <div style={{
                  background: `${op.color}12`,
                  color: op.color,
                  borderRadius: 10, padding: "8px 12px",
                  fontSize: 11, fontWeight: 800,
                  marginBottom: 12,
                }}>
                  {op.fases}
                </div>

                <p style={{ fontSize: 12, color: "var(--muted)", margin: 0 }}>
                  <strong style={{ color: "var(--fg)" }}>Siguiente:</strong> {op.next}
                </p>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Sección 2: Dolores Comercial ── */}
        <Section title="2. Dolores de Comercial · clasificación de accionables" badge="Por decidir ruta"
          sub="No todo debe convertirse en desarrollo. Cada accionable cae en una ruta concreta.">
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 14 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", minWidth: 800 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Frente / dolor", "Qué salió", "Accionables posibles", "Ruta propuesta", "Métrica", "Decisión"].map((h) => (
                    <th key={h} style={{
                      padding: "12px 14px", textAlign: "left",
                      fontSize: 11, fontWeight: 700,
                      color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.04em",
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
                    <td style={{ padding: "14px", fontSize: 12, color: "var(--muted)", verticalAlign: "top", minWidth: 200 }}>{d.accionables}</td>
                    <td style={{ padding: "14px", verticalAlign: "top", minWidth: 160 }}>
                      <span style={{
                        fontSize: 11, fontWeight: 700,
                        background: `${d.rutaColor}15`, color: d.rutaColor,
                        padding: "4px 9px", borderRadius: 999,
                        display: "inline-block",
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

        {/* ── Sección 3: Matriz de decisión ── */}
        <Section title="3. Matriz de decisión · próxima semana" badge="Rutas"
          sub="Para ordenar el seguimiento y evitar una lista infinita de features.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {matriz.map((m) => (
              <div key={m.titulo} style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderLeft: `4px solid ${m.color}`,
                borderRadius: 14,
                padding: 18,
              }}>
                <strong style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", display: "block", marginBottom: 12 }}>
                  {m.titulo}
                </strong>
                <ul style={{ margin: "0 0 14px", paddingLeft: 16 }}>
                  {m.items.map((it) => (
                    <li key={it} style={{ fontSize: 12, color: "var(--muted)", marginBottom: 4 }}>{it}</li>
                  ))}
                </ul>
                <div style={{
                  borderLeft: `3px solid ${m.color}`,
                  background: `${m.color}0d`,
                  borderRadius: "0 10px 10px 0",
                  padding: "10px 12px",
                  fontSize: 12, fontWeight: 600, color: "#374151",
                }}>
                  {m.nota}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Sección 4: Resumen ejecutivo ── */}
        <Section title="4. Resumen ejecutivo · para María" badge="Cierre">
          <div style={{
            borderLeft: "4px solid var(--dropi)",
            background: "#FFFBF5",
            borderRadius: "0 14px 14px 0",
            padding: "20px 24px",
            fontSize: 14,
            color: "#374151",
            lineHeight: 1.7,
          }}>
            Las oportunidades propias ya están organizadas como portafolio OKR: tienen hipótesis funcionales, fases y estimaciones numéricas de órdenes/GMV. En paralelo, la sesión con Comercial fue valiosa porque aterrizó dolores operativos reales; ahora el trabajo no es convertirlos todos en proyectos, sino clasificarlos. Algunos pueden resolverse rápido por reporte, Back Office, OPS o Marketing; otros pueden entrar como parte de fases ya aprobadas, como el MVP de campañas dentro de Catálogos preseleccionados; y otros, como modo vacaciones por bodega, requieren discovery posterior antes de comprometer desarrollo.
          </div>
        </Section>

        {/* ── Sección 5: Próximos pasos ── */}
        <Section title="5. Próximos pasos" badge="Secuencia">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
            {[
              {
                titulo: "Esta semana",
                color: "#F77F00",
                items: ["Validar con María qué accionables van por Back Office / OPS", "Revisar banner con Majo (Marketing)", "Revisar reportes con Fer/José", "Conectar MVP campañas con DCA-001"],
              },
              {
                titulo: "Próxima célula",
                color: "#0EA5E9",
                items: ["Traer estado de cada accionable", "Confirmar qué se mueve sin desarrollo", "Separar quick wins de proyectos", "Asignar responsables por ruta"],
              },
              {
                titulo: "Para junta",
                color: "#10B981",
                items: ["Presentar portafolio aprobado con números", "Mostrar Comercial como fuente de insumos y quick wins", "Evitar prometer desarrollo sin data"],
              },
            ].map((p) => (
              <div key={p.titulo} style={{
                background: "#fff",
                border: "1px solid var(--border)",
                borderTop: `4px solid ${p.color}`,
                borderRadius: 14,
                padding: 18,
              }}>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", margin: "0 0 12px" }}>{p.titulo}</h3>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {p.items.map((it) => (
                    <li key={it} style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6, lineHeight: 1.4 }}>{it}</li>
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

function Section({
  title, badge, sub, children,
}: {
  title: string;
  badge?: string;
  sub?: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{
      background: "#fff",
      border: "1px solid var(--border)",
      borderRadius: 18,
      padding: 24,
      marginBottom: 20,
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 18, flexWrap: "wrap" }}>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", margin: "0 0 4px", letterSpacing: "-0.02em" }}>{title}</h2>
          {sub && <p style={{ fontSize: 13, color: "var(--muted)", margin: 0 }}>{sub}</p>}
        </div>
        {badge && (
          <span style={{
            fontSize: 11, fontWeight: 700,
            background: "#FFF3E0", color: "#C05600",
            padding: "5px 12px", borderRadius: 999,
            whiteSpace: "nowrap",
          }}>{badge}</span>
        )}
      </div>
      {children}
    </div>
  );
}
