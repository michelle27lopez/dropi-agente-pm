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

// ─── Data ─────────────────────────────────────────────────────────────────────
const REUNION_AGENDA = [
  { tiempo: "0–1 min", accion: "\"Esta sesión es para dejar tu primer producto listo para vender hoy. No es una auditoría.\"", razon: "Marca el tono desde el segundo 1 — cambia lo que la persona espera de la llamada" },
  { tiempo: "1–5 min", accion: "\"Cuéntame qué quieres vender\" — categoría, de dónde sale el producto, a quién se lo vende hoy", razon: "Reemplaza la encuesta estática. La persona habla, no llena un formulario" },
  { tiempo: "5–15 min", accion: "Creamos la bodega juntos, en vivo, compartiendo pantalla", razon: "Soporte real, no trámite — y de paso confirma que la bodega existe (auditoría implícita)" },
  { tiempo: "15–25 min", accion: "Publicamos su primer producto: fotos, precio, descripción", razon: "Aquí es donde hoy se cae la gente sola. Con acompañamiento, no se cae" },
  { tiempo: "25–28 min", accion: "\"Ahora, de paso, una foto rápida de tu cédula para nuestros registros\"", razon: "Al final, como trámite menor — no como condición para lo anterior" },
  { tiempo: "28–30 min", accion: "Cierre: qué esperar, a quién escribir si algo falla", razon: "Deja la puerta abierta para la primera venta, no para la próxima auditoría" },
];
const DIAGNOSTICO = [
  { label: "Registrados (última cohorte)", value: "616", color: "#6366F1", note: "Desde 30-jun" },
  { label: "Llegaron al CRM", value: "495", color: "#3B82F6", note: "80,4% de los registrados" },
  { label: "Estancados en \"En activación\"", value: "159", color: "#F59E0B", note: "32% del CRM — el cuello de botella real" },
  { label: "Llegaron a \"Listo para vender\"", value: "0", color: "#EF4444", note: "0% en dos cohortes distintas" },
];

const PASOS = [
  {
    paso: "01",
    titulo: "\"Puede vender\" se desacopla de la etapa de auditoría",
    detalle: "Se activa un flag independiente en Dropi (puede_vender) apenas el proveedor completa el registro básico. No depende de en qué etapa del pipeline de GHL esté sentado. El pipeline sigue existiendo igual, para lo que ya sirve: que el equipo vea dónde está cada quien.",
    resultado: "Vende desde el día 1",
    color: "#6366F1",
  },
  {
    paso: "02",
    titulo: "Las mismas etapas de auditoría, doble función en paralelo",
    detalle: "\"Auditoría Solicitada / Confirmada / Rechazada\" no cambian de nombre ni de orden en GHL. Lo que cambia es qué disparan: ya no bloquean, corren en paralelo mientras el proveedor ya está vendiendo. Cada etapa hace dos cosas a la vez — revisar documentos y verificar si ya publicó su primer producto.",
    resultado: "Cero reprocesamiento en GHL",
    color: "#3B82F6",
  },
  {
    paso: "03",
    titulo: "El rechazo es el gatillo, no la aprobación",
    detalle: "Hoy el default es cerrado: nadie vende hasta ser aprobado. El default se invierte: todos venden, con un tope de riesgo bajo (ej. máx. 10 productos, o retención del primer pago hasta la primera entrega sin reclamo). Solo una auditoría rechazada — señal real de problema — cierra el flag.",
    resultado: "Abierto por defecto, se cierra por excepción",
    color: "#10B981",
    highlight: true,
  },
];

const RIESGOS = [
  { texto: "Tope de productos/valor mientras no hay auditoría confirmada — el daño posible queda acotado, no eliminado pero sí pequeño.", tag: "Guardrail 1" },
  { texto: "Retención del primer pago hasta que la primera entrega se confirme sin reclamo — protege al dropshipper sin bloquear al proveedor.", tag: "Guardrail 2" },
  { texto: "Cualquier bandera real (documento inválido, categoría de alto riesgo, patrón de fraude) puede cerrar el flag puede_vender de inmediato — el sistema reacciona, no interroga por adelantado.", tag: "Guardrail 3" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PropuestaTtvPage() {
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
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Propuesta: Activar → Vender</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>TTV-001</span>
          <span style={tag("#8B5CF6", "#F5F3FF")}>💡 Propuesta</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px", display: "flex", flexDirection: "column", gap: 20 }}>

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
              Propuesta operativa · TTV-001
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 8 }}>
              Activar ahora, auditar después
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", maxWidth: 680, lineHeight: 1.55 }}>
              Hoy le pedimos al proveedor que demuestre que es confiable <em>antes</em> de dejarlo intentar.
              Eso es al revés: nadie llega a vender esperando a que lo aprueben. La propuesta invierte el default —
              vende desde el día 1, con un margen de riesgo acotado, y la auditoría se convierte en la red de
              seguridad que corre en paralelo, no en la puerta que hay que cruzar primero.
            </div>
          </div>
        </div>

        {/* El diagnóstico */}
        <div style={card}>
          <div style={sectionTitle}>El diagnóstico — por qué esto y por qué ahora</div>
          <div style={sectionSub}>
            Datos reales de la cohorte activa (desde 30-jun). No es un problema de ejecución del equipo —
            es que el diseño del embudo pone la fricción más alta justo en el momento de menor compromiso del usuario.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 12, marginBottom: 14 }}>
            {DIAGNOSTICO.map(m => (
              <div key={m.label} style={{
                background: "#F8FAFC", borderRadius: 10, padding: "14px",
                border: "1px solid var(--border)",
              }}>
                <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)", marginBottom: 6 }}>
                  {m.label}
                </div>
                <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", color: m.color, lineHeight: 1 }}>
                  {m.value}
                </div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>{m.note}</div>
              </div>
            ))}
          </div>
          <div style={{ padding: "10px 14px", background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A", fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
            <strong>La pista está en dónde se atasca la gente:</strong> no es en "Auditoría solicitada" (ahí solo hay 6
            personas) — es en "En activación", con 159. La gente sí llega, sí es contactada, y se queda esperando un
            proceso que no le deja vender mientras espera.
          </div>
        </div>

        {/* La propuesta — 3 pasos */}
        <div style={card}>
          <div style={sectionTitle}>La propuesta — sin tocar el pipeline de GHL</div>
          <div style={sectionSub}>
            Ningún cambio de estructura, nombres o etapas en el CRM. Lo que cambia es qué significa cada etapa
            y qué dispara cada una.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {PASOS.map((p, i, arr) => (
              <div key={p.paso} style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
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
                <div style={{ flex: 1, paddingBottom: i < arr.length - 1 ? 16 : 0, paddingLeft: 12, paddingTop: 2 }}>
                  <div style={{
                    background: p.highlight ? "#FFF7EF" : "#F8FAFC",
                    border: `1px solid ${p.highlight ? "rgba(247,127,0,0.3)" : "var(--border)"}`,
                    borderRadius: 10, padding: "14px 16px",
                    display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap",
                  }}>
                    <div style={{ flex: 1, minWidth: 260 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
                        {p.titulo}
                      </div>
                      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
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
        </div>

        {/* Antes / Después */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              Modelo actual
            </div>
            {[
              "Auditar = tarea a cerrar",
              "Aprobación abre la puerta a vender",
              "Auditor revisa documentos únicamente",
              "El proveedor espera sin poder hacer nada",
              "North Star: % auditados",
            ].map(t => (
              <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", fontSize: 13, color: "var(--muted)" }}>
                <span style={{ color: "#EF4444" }}>✕</span>{t}
              </div>
            ))}
          </div>
          <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10 }}>
              Modelo propuesto
            </div>
            {[
              "Vender = tarea a lograr; auditar es la red de seguridad",
              "El registro abre la puerta, con tope de riesgo",
              "Auditor revisa documentos + ayuda a vender",
              "El proveedor ya está vendiendo mientras se revisa",
              "North Star: Time to First Sale",
            ].map(t => (
              <div key={t} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", fontSize: 13, color: "#065F46", fontWeight: 500 }}>
                <span style={{ color: "#10B981" }}>✓</span>{t}
              </div>
            ))}
          </div>
        </div>

        {/* Qué cambia para el equipo de auditoría */}
        <div style={card}>
          <div style={sectionTitle}>Qué cambia para el equipo de auditoría</div>
          <div style={sectionSub}>Mismo rol, un checklist con una pregunta más — no un puesto nuevo.</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Hoy revisa</div>
              <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
                ¿Cédula válida? ¿Bodega existe? ¿Documentos en regla?
              </div>
            </div>
            <div style={{ background: "#ECFDF5", borderRadius: 10, padding: 14, border: "1px solid #A7F3D0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#065F46", marginBottom: 6 }}>Suma una pregunta</div>
              <div style={{ fontSize: 13, color: "#065F46", lineHeight: 1.6 }}>
                ¿Ya publicó su primer producto? Si no — ¿qué le falta, y cómo se lo resuelvo ahora mismo?
              </div>
            </div>
          </div>
          <div style={{ marginTop: 12, fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
            La conversación deja de sentirse como un interrogatorio ("te voy a revisar") y pasa a sentirse como
            acompañamiento ("te voy a ayudar a vender"). Mismo tiempo del auditor, mejor primera impresión del proveedor.
          </div>
        </div>

        {/* La primera reunión */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={sectionTitle}>La primera reunión — cómo se ve en la práctica</div>
              <div style={{ ...sectionSub, marginBottom: 0 }}>
                Aplica a Fast-track (1:1) y Normal (grupal) — los segmentos que ya tienen una llamada en vivo.
              </div>
            </div>
            <span style={tag("#6366F1", "#EEF2FF")}>30 min · sin agenda de auditoría</span>
          </div>
          <div style={{ margin: "16px 0", padding: "10px 14px", background: "#EFF6FF", borderRadius: 10, border: "1px solid #BFDBFE", fontSize: 12, color: "#1E3A8A", lineHeight: 1.5 }}>
            <strong>La llamada misma es la auditoría.</strong> Ver a alguien mostrar su bodega en cámara mientras la
            creamos juntos es más difícil de falsificar que una foto subida — la auditoría deja de ser un paso
            aparte y se vuelve un subproducto de ayudar.
          </div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ ...thStyle, width: 90 }}>Tiempo</th>
                  <th style={thStyle}>Qué pasa</th>
                  <th style={thStyle}>Por qué en ese orden</th>
                </tr>
              </thead>
              <tbody>
                {REUNION_AGENDA.map((r, i) => (
                  <tr key={r.tiempo} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: "var(--dropi)", whiteSpace: "nowrap" }}>{r.tiempo}</td>
                    <td style={{ ...tdStyle, color: "var(--fg)" }}>{r.accion}</td>
                    <td style={{ ...tdStyle, color: "var(--muted)" }}>{r.razon}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 20, marginBottom: 10, fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
            La transcripción se vuelve data de perfil
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6, marginBottom: 12 }}>
            En vez de que el proveedor llene la encuesta ramificada Proveedor/Marca (11 preguntas, columnas
            duplicadas, mucha respuesta vacía porque se llena sin ganas), la transcripción de esta conversación
            se pasa por un modelo que extrae los mismos campos — categoría, volumen, canal de venta preferido —
            con mucha más señal, porque la persona lo cuenta con sus palabras en vez de marcar una casilla.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: 12, alignItems: "center", marginBottom: 12 }}>
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>🎙️</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginTop: 6 }}>Conversación grabada</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Con consentimiento del proveedor</div>
            </div>
            <div style={{ fontSize: 18, color: "var(--muted)" }}>→</div>
            <div style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, border: "1px solid var(--border)", textAlign: "center" }}>
              <div style={{ fontSize: 20 }}>📝</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginTop: 6 }}>Transcripción + extracción</div>
              <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>Un modelo llena los campos del perfil</div>
            </div>
          </div>
          <div style={{ padding: "10px 14px", background: "#ECFDF5", borderRadius: 10, border: "1px solid #A7F3D0", fontSize: 12, color: "#065F46", lineHeight: 1.5, marginBottom: 10 }}>
            Mismo destino de datos que ya existe hoy (<code>survey_role</code>, <code>survey_volume</code>,{" "}
            <code>tipo_proveedor</code> en <code>userpilot_suppliers</code>) — fuente mucho mejor, sin pedirle
            al proveedor que llene nada. Conecta directo con Research Brain / Inteligencia de Catálogo: cada
            conversación se vuelve una entrada de data reutilizable, no un formulario que se llena una vez y se olvida.
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
            <strong>Dónde no aplica:</strong> Autogestión (bajo volumen, todo por WhatsApp) no tiene sesión en vivo —
            ahí el flujo de auditoría sigue siendo el de subir fotos (ver sección "Nice to have" abajo), porque no
            hay llamada que grabar.
          </div>
        </div>

        {/* Guardrails */}
        <div style={{ ...card, border: "1px solid #BFDBFE", background: "#EFF6FF" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#1E40AF", marginBottom: 10 }}>
            🛡️ Cómo se controla el riesgo de abrir la puerta por defecto
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {RIESGOS.map((r, i) => (
              <div key={i} style={{
                display: "flex", gap: 12, alignItems: "flex-start",
                padding: "10px 14px", background: "#fff", borderRadius: 10,
                border: "1px solid #BFDBFE",
              }}>
                <span style={{
                  fontSize: 11, fontWeight: 700, color: "#1E40AF",
                  background: "#DBEAFE", padding: "3px 9px", borderRadius: 20, flexShrink: 0, whiteSpace: "nowrap",
                }}>
                  {r.tag}
                </span>
                <div style={{ flex: 1, fontSize: 13, color: "#1E3A8A", lineHeight: 1.5 }}>{r.texto}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Nice to have — Automas */}
        <div style={{ ...card, borderLeft: "4px solid #9CA3AF" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>Nice to have — automatizar la revisión documental</div>
            <span style={tag("#6B7280", "#F3F4F6")}>Fase futura, no bloqueante</span>
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55 }}>
            Inspirado en plataformas de validación tipo <strong>Automas</strong> (diagnósticos para seguros): un link
            único, no una llamada agendada. "Sube foto de cédula aquí, foto de bodega aquí, foto de producto aquí" —
            el auditor revisa en una cola async, aprueba o rechaza con un motivo de un clic, y el sistema notifica
            automáticamente qué corregir. Una persona atendiendo decenas en paralelo en vez de sesiones agendadas
            una por una. No es necesario para arrancar el cambio de modelo — es la evolución natural una vez que
            la auditoría deja de bloquear y se puede optimizar solo por eficiencia, no por urgencia.
          </div>
        </div>

        {/* Próximos pasos */}
        <div style={card}>
          <div style={sectionTitle}>Próximos pasos</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              "Definir el flag puede_vender y su condición mínima de activación (¿basta el registro, o requiere un dato mínimo como categoría declarada?)",
              "Definir el tope de riesgo inicial (máx. productos y/o retención de pago) para el proveedor no auditado",
              "Ajustar el checklist del auditor con la pregunta de primera venta",
              "Redefinir el KPI principal del dashboard TTV: Time to First Sale por encima de Auditados",
            ].map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: i < 3 ? "1px solid var(--border)" : "none" }}>
                <span style={{
                  width: 22, height: 22, borderRadius: "50%", background: "var(--dropi)",
                  color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>{i + 1}</span>
                <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{t}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
