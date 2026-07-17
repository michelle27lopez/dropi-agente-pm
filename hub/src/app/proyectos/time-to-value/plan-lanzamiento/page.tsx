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
const FASE0_METRICAS = [
  { label: "Universo del piloto", value: "22", color: "#6366F1", note: "300+ pedidos/mes declarados (300_1000 + 1000_plus)" },
  { label: "Estancados en \"En activación\"", value: "11", color: "#EF4444", note: "50% del universo — la urgencia real" },
  { label: "Llegaron a \"Listo para vender\"", value: "0", color: "#9CA3AF", note: "Igual que el resto de la cohorte" },
];

const FASE0_PASOS = [
  {
    n: "1",
    titulo: "Alcance: 300+ pedidos/mes declarados",
    detalle: "Segmentos 300_1000 + 1000_plus = 22 personas hoy. Universo chico, manejable a mano, sin esperar ningún desarrollo.",
    color: "#6366F1",
  },
  {
    n: "2",
    titulo: "Activación manual con un tag en GHL",
    detalle: "Se agrega el tag activado-piloto a la oportunidad, sin mover ni renombrar la etapa de auditoría real (se queda donde está). El tag es la señal manual de \"ya puede vender\" mientras no existe el flag automático puede_vender.",
    color: "#3B82F6",
  },
  {
    n: "3",
    titulo: "Mensaje de activación por WhatsApp",
    detalle: "\"¡Hola [nombre]! Ya tienes acceso para publicar tus productos en Dropi — puedes empezar ya mismo, sin esperar más. Nuestro equipo está terminando de revisar tu perfil en paralelo. Cualquier duda para publicar, escríbenos aquí mismo.\"",
    color: "#10B981",
  },
  {
    n: "4",
    titulo: "Seguimiento casi diario",
    detalle: "Vista filtrada en el dashboard de TTV que ya existe (segment_key IN ('300_1000','1000_plus')) + una columna extra: ¿tiene el tag? ¿publicó su primer producto? ¿generó su primera orden? No requiere nada nuevo que construir.",
    color: "#F59E0B",
  },
  {
    n: "5",
    titulo: "Canal de seguimiento — número y agente propios de Producto, fuera de GHL",
    detalle: "No es el mismo WhatsApp ni el AI Agent de GHL (eso es de Comercial, con su propio roadmap). Producto monta su propio número (WhatsApp Cloud API o un BSP tipo Twilio/360dialog) + un agente sobre el mismo stack que ya usan (n8n + LLM + Supabase). Ahí Producto tiene control total: qué pregunta, cuándo empuja, qué datos guarda del perfil — sin depender de nadie más para iterar. El único punto de conexión con GHL es de entrada: el tag activado-piloto dispara, vía el mismo n8n que ya conecta UserPilot→GHL, que el número de Producto empiece a escribirle. De ahí en adelante todo pasa en el canal propio.",
    color: "#8B5CF6",
    highlight: true,
  },
];

const GUARDRAILS = [
  {
    titulo: "Políticas de producto",
    dueno: "TI (José Giraldo)",
    definicion: "No se resuelve con una lista de categorías excluidas a mano. La solución correcta es que TI construya un motor de validación que revise los productos ya publicados y banee los que no cumplen — post-publicación, igual que el resto del modelo: abre primero, corrige después.",
    estado: "Workstream de desarrollo aparte — no bloquea el arranque del piloto",
    color: "#3B82F6",
    bg: "#EFF6FF",
  },
  {
    titulo: "Fraude / Riesgo",
    dueno: "Sin dueño hoy — escalar a Lucho (CEO) + Legal",
    definicion: "No existe un área que posea esto en la organización. Se necesita una conversación de definición para decidir si se asigna a alguien existente o se crea la función. Sin esa decisión, los umbrales de los guardrails (tope de productos, % de retención) no tienen quién los calibre ni los monitoree.",
    estado: "🔴 Bloqueante — es lo primero a agendar",
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    titulo: "Retención del primer pago",
    dueno: "Financiero de Dropi",
    definicion: "Dueño confirmado. Falta identificar la persona puntual del equipo financiero y agendar la conversación de mecanismo (retención total o parcial hasta primera entrega sin reclamo).",
    estado: "Agendar — dueño ya conocido",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
];

const APROBACIONES = [
  { quien: "María Ossa (CPO)", que: "Concepto y dirección del modelo", urgencia: "✅ Ya dado", color: "#10B981" },
  { quien: "Lucho (CEO) + Legal", que: "Quién posee Fraude/Riesgo en la organización y cómo se calibran los guardrails", urgencia: "🔴 Bloqueante", color: "#EF4444" },
  { quien: "José Giraldo (Tech Lead)", que: "Flag puede_vender desacoplado del pipeline (rápido) + motor de validación/baneo de productos (workstream aparte, más grande)", urgencia: "🟡 Dos conversaciones distintas", color: "#F59E0B" },
  { quien: "Financiero de Dropi", que: "Mecanismo de retención del primer pago", urgencia: "🟡 Agendar, identificar persona", color: "#F59E0B" },
  { quien: "Emerson + equipo comercial/auditoría", que: "Nuevo guion de la primera reunión (foco en venta, no en auditoría)", urgencia: "🟢 Solo comunicar", color: "#10B981" },
];

const COMUNICACION = [
  { a: "Lucho (CEO) + Legal", mensaje: "Necesitamos definir quién en la organización es dueño de Fraude/Riesgo para calibrar los guardrails de este piloto — ¿lo asignamos a alguien existente o se crea la función?" },
  { a: "José / TI", mensaje: "Necesitamos desacoplar el permiso de vender del estado de auditoría en el pipeline, sin tocar las etapas de GHL. Aparte, necesitamos un motor que valide y banee productos que no cumplan política — ¿cuánto esfuerzo real es cada uno?" },
  { a: "Financiero de Dropi", mensaje: "Vamos a retener el primer pago de proveedores nuevos hasta confirmar la primera entrega sin reclamo. Necesitamos definir el mecanismo con ustedes." },
  { a: "Equipo comercial (Emerson, Eric, Kevin)", mensaje: "La reunión con nuevos proveedores cambia de foco — de auditoría a ayudarles a vender. Aquí está el guion nuevo." },
  { a: "Kate / otras células dependientes", mensaje: "Informativo — el modelo de activación de Suppliers cambia. No requiere acción de su parte." },
];

const FASES = [
  { paso: "01", titulo: "Piloto arranca con moderación manual", detalle: "Bajo volumen, spot-check a mano como parche temporal mientras TI construye el motor automático. No se espera a que el motor esté listo para empezar.", color: "#6366F1" },
  { paso: "02", titulo: "TI arranca el motor de validación/baneo en paralelo", detalle: "No bloquea el piloto — corre aparte, se integra cuando esté listo.", color: "#3B82F6" },
  { paso: "03", titulo: "Conversación con Lucho + Legal — esta semana", detalle: "Es la única pieza que si no se resuelve pronto, frena la calibración real de los guardrails (hoy son principio, no política numérica).", color: "#EF4444", highlight: true },
  { paso: "04", titulo: "Expansión de Fast-track a Normal", detalle: "Una vez haya dueño de Riesgo definido y el motor de TI avanzando, se expande el modelo al segmento Normal.", color: "#10B981" },
  { paso: "05", titulo: "Autogestión al final", detalle: "Sin sesión en vivo, necesita el guardrail documental (Automas-style) más maduro antes de abrir el default ahí, porque no hay verificación humana en tiempo real.", color: "#8B5CF6" },
];

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function PlanLanzamientoTtvPage() {
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
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Plan de Choque — Lanzamiento</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>TTV-001</span>
          <span style={tag("#EF4444", "#FEF2F2")}>🚀 Plan de choque</span>
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
              Plan de ejecución · TTV-001
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.15, marginBottom: 8 }}>
              Plan de Choque — Activar ahora, auditar después
            </div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.9)", maxWidth: 680, lineHeight: 1.55 }}>
              María dio el Go al concepto. Este plan resuelve lo operativo: quién debe aprobar qué, quién es
              dueño de cada guardrail, cómo se comunica a stakeholders, y en qué orden se lanza — sin esperar
              a que todo esté perfecto para arrancar.
            </div>
          </div>
        </div>

        {/* Fase 0 — Piloto manual */}
        <div style={card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6, flexWrap: "wrap", gap: 8 }}>
            <div>
              <div style={sectionTitle}>Fase 0 — Piloto manual (arranca ya)</div>
              <div style={{ ...sectionSub, marginBottom: 0 }}>
                No espera a Riesgo, a TI ni a Financiero — arranca con lo que ya existe.
              </div>
            </div>
            <span style={tag("#8B5CF6", "#F5F3FF")}>300+ pedidos/mes</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 12, margin: "16px 0" }}>
            {FASE0_METRICAS.map(m => (
              <div key={m.label} style={{ background: "#F8FAFC", borderRadius: 10, padding: 14, border: "1px solid var(--border)" }}>
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
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {FASE0_PASOS.map((p, i, arr) => (
              <div key={p.n} style={{ display: "flex", gap: 0, alignItems: "stretch" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: "50%",
                    background: p.color, color: "#fff",
                    fontSize: 12, fontWeight: 800,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, zIndex: 1,
                  }}>
                    {p.n}
                  </div>
                  {i < arr.length - 1 && (
                    <div style={{ width: 2, flex: 1, background: "#E5E7EB", margin: "4px 0" }} />
                  )}
                </div>
                <div style={{ flex: 1, paddingBottom: i < arr.length - 1 ? 16 : 0, paddingLeft: 12, paddingTop: 2 }}>
                  <div style={{
                    background: p.highlight ? "#F5F3FF" : "#F8FAFC",
                    border: `1px solid ${p.highlight ? "#DDD6FE" : "var(--border)"}`,
                    borderRadius: 10, padding: "12px 16px",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
                      {p.titulo}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                      {p.detalle}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Guardrails con dueño */}
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 12 }}>
            Guardrails — con dueño real, no solo principio
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {GUARDRAILS.map(g => (
              <div key={g.titulo} style={{ ...card, borderLeft: `4px solid ${g.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)" }}>{g.titulo}</div>
                  <span style={tag(g.color, g.bg)}>{g.dueno}</span>
                </div>
                <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.55, marginBottom: 10 }}>
                  {g.definicion}
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: g.color }}>{g.estado}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa de aprobaciones */}
        <div style={card}>
          <div style={sectionTitle}>Mapa de aprobaciones necesarias</div>
          <div style={sectionSub}>Quién debe decidir qué antes de escalar el piloto más allá de Fast-track.</div>
          <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={thStyle}>Quién</th>
                  <th style={thStyle}>Qué debe aprobar / definir</th>
                  <th style={{ ...thStyle, textAlign: "right" }}>Urgencia</th>
                </tr>
              </thead>
              <tbody>
                {APROBACIONES.map((a, i) => (
                  <tr key={a.quien} style={{ background: i % 2 === 0 ? "#F8FAFC" : "#fff" }}>
                    <td style={{ ...tdStyle, fontWeight: 700, color: "var(--fg)" }}>{a.quien}</td>
                    <td style={{ ...tdStyle, color: "var(--muted)" }}>{a.que}</td>
                    <td style={{ ...tdStyle, textAlign: "right", fontWeight: 700, color: a.color, whiteSpace: "nowrap" }}>
                      {a.urgencia}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Comunicación a stakeholders */}
        <div style={card}>
          <div style={sectionTitle}>Comunicación a stakeholders</div>
          <div style={sectionSub}>Mensaje puntual por audiencia — corto y directo, no un documento largo.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {COMUNICACION.map(c => (
              <div key={c.a} style={{ background: "#F8FAFC", borderRadius: 10, padding: "12px 16px", border: "1px solid var(--border)" }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--dropi)", marginBottom: 4 }}>→ {c.a}</div>
                <div style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5, fontStyle: "italic" }}>"{c.mensaje}"</div>
              </div>
            ))}
          </div>
        </div>

        {/* Fases de lanzamiento */}
        <div style={card}>
          <div style={sectionTitle}>Fases de lanzamiento — no todo de una vez</div>
          <div style={sectionSub}>El motor de TI y la definición de Riesgo corren en paralelo al piloto, no antes de él.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {FASES.map((p, i, arr) => (
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
                    background: p.highlight ? "#FEF2F2" : "#F8FAFC",
                    border: `1px solid ${p.highlight ? "#FECACA" : "var(--border)"}`,
                    borderRadius: 10, padding: "12px 16px",
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>
                      {p.titulo}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                      {p.detalle}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bloqueante principal */}
        <div style={{ ...card, border: "1px solid #FECACA", background: "#FEF2F2" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 8 }}>
            🔴 Lo único que de verdad frena esto
          </div>
          <div style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6 }}>
            No es la tecnología ni el guion de la reunión — ambos pueden arrancar ya. Lo único bloqueante es
            la conversación con <strong>Lucho (CEO) + Legal</strong> para definir quién posee Fraude/Riesgo en
            la organización. Sin esa decisión, los guardrails del piloto se quedan en principio y nunca se
            calibran con números reales. Es la primera reunión a agendar de todo este plan.
          </div>
        </div>

      </div>
    </main>
  );
}
