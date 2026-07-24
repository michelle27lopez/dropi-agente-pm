"use client";

import { useIsEmbedded } from "@/lib/use-is-embedded";

const METRICS = [
  { label: "Usuarios Pareto", value: "535", sub: "505 base + 30 comunidad Iván" },
  { label: "Meta campañas/usuario/mes", value: "4", sub: "Actual: 2 (50% de meta)" },
  { label: "Stock crítico", value: "≤5 días", sub: "🔴 = escalación urgente" },
  { label: "Meta diaria/persona", value: "20", sub: "cuidados de campaña" },
  { label: "Solicitudes en Nexus", value: "229", sub: "≈76 únicas (triplicadas por categoría)" },
  { label: "IDs de producto (ene–jun)", value: "111K", sub: "Cronos · análisis manual de Valentina" },
  { label: "Drops en mismo producto", value: "52 / 50", sub: "Barba Apolo · Aire AC (colapso de stock)" },
  { label: "Proveedores activos jul 1–15", value: "2.413", sub: "de todos los disponibles en Dropy" },
];

const PAINS = [
  { id: "D1", intensity: "Crítico", color: "#EF4444", bg: "#FEF2F2",
    pain: "Stock consultado manualmente en Dropy — bug de IDs impide automatización.",
    evidence: "Diego intentó automatizar; los cruces de IDs de producto fallan entre Cronos y Dropy." },
  { id: "D10", intensity: "Crítico", color: "#EF4444", bg: "#FEF2F2",
    pain: `El mismo producto existe con 10+ IDs distintos — imposible agregar la demanda real.`,
    evidence: `"Bellaskin Solo" aparece con 5+ nombres distintos. 111,000 IDs en 6 meses, Excel colapsó.` },
  { id: "D11", intensity: "Crítico", color: "#EF4444", bg: "#FEF2F2",
    pain: "Riesgo de concentración no visible: 50+ dropshippers en el mismo producto → stock colapsa.",
    evidence: "Caso AC: 50 drops → stock agotado → campaña colapsada. El patrón no se detecta hasta que es tarde." },
  { id: "D5", intensity: "Alto", color: "#F77F00", bg: "#FFF8F0",
    pain: "Las observaciones de Nexus no sincronizan entre Fran y las chicas.",
    evidence: `Fran deja una nota al aplazar → a Luisa/Juliana no les aparece. Las chicas responden → Fran no lo ve.` },
  { id: "D6", intensity: "Alto", color: "#F77F00", bg: "#FFF8F0",
    pain: "Fran pierde visibilidad del caso en cuanto da una respuesta.",
    evidence: `"Ya yo no puedo abrir ni editar" el caso tras responder. El caso desaparece de su pantalla.` },
  { id: "D7", intensity: "Alto", color: "#F77F00", bg: "#FFF8F0",
    pain: "229 solicitudes en Nexus son en realidad ~76 — triplicadas por categoría.",
    evidence: "Cada solicitud se registra 3 veces (Premium, Verificado, No Verificado). Fran solo ve 2 de las 3." },
  { id: "D8", intensity: "Alto", color: "#F77F00", bg: "#FFF8F0",
    pain: `Si la respuesta de Fran no sirve, hay que cerrar el caso y abrir uno nuevo desde cero.`,
    evidence: `"De toca subir otra vez la solicitud" sin poder continuar el hilo del mismo caso.` },
  { id: "D9", intensity: "Alto", color: "#F77F00", bg: "#FFF8F0",
    pain: "Trabajo doble: se registra en Nexus Y en el Excel interno.",
    evidence: `"A veces lo reportamos aquí en el Nexus, pero en el de búsqueda interna no lo hayamos reportado." — Luisa` },
  { id: "D3", intensity: "Alto", color: "#F77F00", bg: "#FFF8F0",
    pain: "Los datos de producto dependen de que Diego exporte el CSV manualmente.",
    evidence: `"Dependo totalmente de esa base de datos que me pase Diego. Si no me la pasa, no tengo insumo." — Valentina` },
  { id: "D15", intensity: "Alto", color: "#F77F00", bg: "#FFF8F0",
    pain: "Ronald/Bogotá no tiene persona dedicada a búsqueda de producto — cuello de botella físico.",
    evidence: `"No tuvo tiempo en todo el día mandar a nadie a buscar el producto. A veces ni le responden a Fran."` },
  { id: "D2", intensity: "Medio", color: "#6366F1", bg: "#F5F3FF",
    pain: "No hay canal formal de escalación al proveedor cuando el stock cae a zona crítica.",
    evidence: "La escalación hoy ocurre por WhatsApp directo, sin trazabilidad." },
  { id: "D14", intensity: "Medio", color: "#6366F1", bg: "#F5F3FF",
    pain: `Sin métricas de efectividad: tasa de éxito en búsqueda, tiempo de respuesta, producto más pedido.`,
    evidence: `"Si no tenemos cómo medir, no vamos a saber qué tenemos que ajustar." — Valentina` },
];

const OPPORTUNITIES = [
  { id: "O1", label: `Señal "Stock" en Dropi Pulso`, priority: "Alta",
    desc: `Cuando un producto cae a ≤5 días, el equipo dispara una señal formal al proveedor desde Pulso — sin WhatsApp.`,
    who: "Valentina (pedido explícito)", pains: "D2, D1" },
  { id: "O2", label: "Auto-señal desde el Excel de cuidados", priority: "Alta",
    desc: `Cuando se sube el Excel con datos de riesgo, Pulso detecta los 🔴 y crea la señal automáticamente sin intervención manual.`,
    who: `Jaime propuso · Valentina: "sería buenísimo"`, pains: "D2, D13" },
  { id: "O3", label: "Panel unificado: reemplazar Nexus + Excel en Pulso", priority: "Alta",
    desc: "Un solo lugar para todas las solicitudes de búsqueda de producto. Elimina el triple registro (Nexus + Excel + BI).",
    who: "Natalia (visión declarada)", pains: "D5, D6, D7, D8, D9" },
  { id: "O4", label: "Threading tipo WhatsApp en solicitudes", priority: "Alta",
    desc: "Cada mensaje queda visible para todos (Fran + Luisa + Juliana), en orden cronológico, con nombre del remitente.",
    who: "Franshesca (pedido explícito)", pains: "D5, D6, D8" },
  { id: "O6", label: "Alerta de concentración de dropshippers", priority: "Alta",
    desc: `Cuando N dropshippers están vendiendo el mismo producto, el sistema alerta antes de que el stock colapse.`,
    who: "Inferido del caso AC (50 drops → colapso)", pains: "D11" },
  { id: "O5", label: "Eliminar triplicación por categoría en Nexus", priority: "Alta",
    desc: "1 solicitud = 1 caso. Fran ve todas las categorías en una sola vista sin duplicados.",
    who: "Natalia", pains: "D7" },
  { id: "O7", label: "Estandarización de IDs de producto", priority: "Media",
    desc: "Índice de equivalencia: mismo producto con diferente nombre/proveedor = mismo ID canónico. Desbloquea las proyecciones.",
    who: "Valentina (problema identificado)", pains: "D10, D12" },
  { id: "O9", label: "API de catálogo en Pulso (18 ago)", priority: "Media",
    desc: "Consulta del catálogo completo desde Pulso en tiempo real — agiliza la búsqueda de producto que hoy hacen en Dropy.",
    who: "Jaime (confirmado para 18-ago)", pains: "D1, D3" },
  { id: "O10", label: "Dashboard de métricas de búsqueda", priority: "Media",
    desc: "Solicitudes exitosas vs. fallidas, tiempo de respuesta, producto más pedido, evolución mensual.",
    who: "Valentina · Natalia", pains: "D14" },
  { id: "O8", label: "Vista de producto para el área de proveedores", priority: "Media",
    desc: "Hoy solo el área de dropshippers tiene el dashboard de movimiento de producto. Natalia quiere la misma vista.",
    who: "Natalia", pains: "D3" },
];

const WORKFLOW_STEPS = [
  { step: "1", label: "Revisar el BI", who: "Luisa / Juliana",
    desc: "Abren Power BI y revisan los 2–4 productos que más mueve cada usuario del Pareto." },
  { step: "2", label: "Consultar stock en Dropy", who: "Luisa / Juliana",
    desc: "Consultan el stock manualmente en Dropy. Los IDs no coinciden con la BD de analítica (bug Diego) — no hay automatización posible hoy." },
  { step: "3", label: "Calcular días de stock", who: "Luisa / Juliana",
    desc: "Fórmula: días = stock ÷ promedio de órdenes diarias. El promedio lo actualiza Diego bi-semanalmente." },
  { step: "4", label: "Actualizar el Excel semáforo", who: "Luisa / Juliana",
    desc: "🔴 ≤5 días (urgente) · 🟡 riesgo medio · 🟢 stock seguro. Meta: 20 cuidados/persona/día." },
  { step: "5", label: "Buscar proveedor alternativo (si falta stock)", who: "Luisa → Nexus → Fran → Ronald/Bogotá",
    desc: "Si el producto no tiene stock: buscan en Dropy → suben solicitud a Nexus → Fran contacta proveedores → Ronald/Bogotá busca físicamente." },
  { step: "6", label: "Escalar al proveedor existente (si es 🔴)", who: "Valentina / Natalia",
    desc: "Canal actual: WhatsApp directo sin trazabilidad. Canal propuesto: señal en Dropi Pulso." },
];

const NEXUS_STATES = [
  { state: "Sin responder", who: "Fran (inbox)", issue: "OK — es el inbox de Fran" },
  { state: "Aplazado", who: "Fran (solo ella)", issue: "Las chicas NO ven la observación de Fran al aplazar" },
  { state: "Completado", who: "Chicas lo ven como cerrado", issue: "Fran pierde la visibilidad del caso; las chicas no pueden reabrir ni continuar" },
  { state: "Pendiente de confirmación", who: "Ninguna puede cerrar", issue: "Bug del aplicativo: caso en limbo que nadie puede resolver" },
];

const CONCENTRATION_CASES = [
  { product: "Estimulante de barba Apolo", drops: 52, outcome: "Alta concentración detectada" },
  { product: "Aire acondicionado", drops: 50, outcome: "🔴 Stock agotado → campaña colapsada" },
  { product: "Almohada ortopédica cervical", drops: 45, outcome: "Alta concentración detectada" },
];

const QUOTES = [
  { text: `"Lo que menos quiero es generar doble trabajo. Que ellas no tengan otro drive aparte — que puedan tener toda la información dentro del mismo Pulso."`, who: "Natalia Cuéllar" },
  { text: `"Dependo totalmente de esa base de datos que me pase Diego. Si no me la pasa, no tengo insumo."`, who: "Valentina García Grajales" },
  { text: `"Me gustaría que por las observaciones quedara como un tipo WhatsApp, que cuando yo le responda aparezca acá y cuando ya me responden aparezcan abajo y así sucesivamente."`, who: "Franshesca Leal" },
  { text: `"Los proveedores se quedaron sin stock. ¿Y qué tenemos en este momento? Un déficit para que ellos sigan escalando esas campañas porque no hay stock de aires acondicionados."`, who: "Valentina García Grajales" },
  { text: `"Esto está hecho con las uñas."`, who: "Natalia Cuéllar" },
  { text: `"Si no tenemos cómo medir, no vamos a saber qué tenemos que ajustar."`, who: "Valentina García Grajales" },
];

const PAIN_PRIORITY_COLOR: Record<string, { bg: string; color: string }> = {
  "Alta": { bg: "#FEF2F2", color: "#EF4444" },
  "Media": { bg: "#FFF8F0", color: "#F77F00" },
  "Baja": { bg: "#F0FDF4", color: "#059669" },
};

export default function PulsoResearchPage() {
  const isEmbedded = useIsEmbedded();

  return (
    <main style={{ minHeight: "100vh", background: "var(--card)" }}>
      {!isEmbedded && (
        <header style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap",
        }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
          <span style={{ color: "var(--border)" }}>/</span>
          <a href="/proyectos/pulso-demo" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>Dropi Pulso · Demo</a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Research · RB-005</span>
        </header>
      )}

      <div style={{ maxWidth: 940, margin: "0 auto", padding: "40px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#F0FDF4", color: "#059669", padding: "3px 9px", borderRadius: 20 }}>RB-005</span>
            <span style={{ fontSize: 11, fontWeight: 700, background: "#ECFDF5", color: "#059669", padding: "3px 9px", borderRadius: 20 }}>Confianza alta · 2 sesiones · 40 min</span>
            <span style={{ fontSize: 11, color: "var(--muted)", marginLeft: "auto" }}>2026-07-21 · Cuidado de Campañas + Proveedores</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "var(--fg)", marginBottom: 10, lineHeight: 1.2 }}>
            Cuidado de Campañas — Flujos, Dolores y Oportunidades para Dropi Pulso
          </h1>
          <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6, maxWidth: 700 }}>
            Dos sesiones con el equipo de Cuidado de Campañas y Proveedores (Natalia, Valentina, Luisa, Juliana, Franshesca).
            Objetivo: entender el flujo operativo real, mapear los dolores del sistema actual (Excel + Nexus + WhatsApp)
            e identificar cómo Dropi Pulso puede convertirse en la herramienta unificada del equipo.
          </p>
        </div>

        {/* Métricas clave */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>📊</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Métricas clave del ecosistema</span>
          </div>
          <div style={{ padding: 20, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
            {METRICS.map((m) => (
              <div key={m.label} style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "var(--fg)", marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{m.value}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", marginBottom: 2, lineHeight: 1.3 }}>{m.label}</div>
                <div style={{ fontSize: 11, color: "var(--muted)", lineHeight: 1.3 }}>{m.sub}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>🔄</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Workflow de cuidado de campañas — 6 pasos, 100% manual</span>
          </div>
          <div style={{ padding: "20px 24px" }}>
            {WORKFLOW_STEPS.map((s, i) => (
              <div key={s.step} style={{ display: "flex", gap: 16, paddingBottom: i < WORKFLOW_STEPS.length - 1 ? 20 : 0 }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "#FFF8F0", border: "2px solid #F77F00", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#F77F00" }}>{s.step}</div>
                  {i < WORKFLOW_STEPS.length - 1 && <div style={{ width: 2, flex: 1, background: "#F3F4F6", marginTop: 4 }} />}
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>{s.label}</div>
                  <div style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5, marginBottom: 4 }}>{s.desc}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#6366F1" }}>👤 {s.who}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Nexus: diagnóstico */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>🔧</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Nexus — herramienta actual de solicitudes: 4 fallos estructurales</span>
            <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 700, marginLeft: "auto", background: "#FEF2F2", padding: "2px 8px", borderRadius: 99 }}>
              229 casos · ~76 únicos
            </span>
          </div>
          <div style={{ padding: 20 }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F8FAFC" }}>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Estado en Nexus</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Quién lo ve</th>
                    <th style={{ textAlign: "left", padding: "10px 14px", color: "var(--muted)", fontWeight: 700, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>Problema</th>
                  </tr>
                </thead>
                <tbody>
                  {NEXUS_STATES.map((row, i) => (
                    <tr key={row.state} style={{ borderTop: i > 0 ? "1px solid var(--border)" : "none" }}>
                      <td style={{ padding: "12px 14px", fontWeight: 600, color: "var(--fg)" }}>{row.state}</td>
                      <td style={{ padding: "12px 14px", color: "var(--muted)" }}>{row.who}</td>
                      <td style={{ padding: "12px 14px", color: row.issue.startsWith("OK") ? "#059669" : "#EF4444", fontWeight: row.issue.startsWith("OK") ? 400 : 500 }}>{row.issue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ marginTop: 16, padding: "12px 16px", background: "#FFF8F0", borderRadius: 8, fontSize: 13, color: "#92400E", lineHeight: 1.5 }}>
              <strong>Solución pedida por Fran:</strong> threading tipo WhatsApp — cada mensaje queda visible para todos, en orden cronológico, con nombre del remitente. El caso solo se cierra cuando ambos lados confirman resolución.
            </div>
          </div>
        </div>

        {/* Concentración de riesgo */}
        <div style={{ background: "#FEF2F2", border: "2px solid #EF4444", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
            <span style={{ fontSize: 18 }}>⚠️</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#EF4444" }}>Riesgo de concentración — el caso del aire acondicionado</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 14 }}>
            {CONCENTRATION_CASES.map((c) => (
              <div key={c.product} style={{ background: "#fff", borderRadius: 10, padding: "14px 16px", border: "1px solid #FECACA" }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: "#EF4444", marginBottom: 4, fontVariantNumeric: "tabular-nums" }}>{c.drops} drops</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)", marginBottom: 4, lineHeight: 1.3 }}>{c.product}</div>
                <div style={{ fontSize: 11, color: c.outcome.includes("🔴") ? "#EF4444" : "#6B7280" }}>{c.outcome}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 13, color: "#7F1D1D", lineHeight: 1.6, margin: 0 }}>
            Cuando demasiados dropshippers se concentran en el mismo producto, el proveedor colapsa. Este patrón no se detecta hasta que el stock se agota. Una alerta de concentración en Dropi Pulso podría prevenir el colapse con tiempo suficiente para coordinar con el proveedor.
          </p>
        </div>

        {/* Señal Stock highlight */}
        <div style={{ background: "#FFF8F0", border: "2px solid #F77F00", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 18 }}>⚡</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#F77F00" }}>
              Pedido explícito: señal "Stock" + auto-señal desde el Excel
            </span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ background: "#fff", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#92400E", lineHeight: 1.6, border: "1px solid #FDBA74" }}>
              <strong>Señal "Stock":</strong> Valentina pidió agregar este tipo de señal en el formulario. Trigger: cuando un producto del Pareto llega a ≤5 días, el equipo dispara la señal al proveedor desde Pulso. Hoy ese canal no existe.<br />
              <em style={{ fontSize: 12, marginTop: 4, display: "block" }}>Tipos actuales en Pulso: relacionamiento · tendencia · temporada · reactivación · privatización · pulso</em>
            </div>
            <div style={{ background: "#fff", borderRadius: 8, padding: "12px 16px", fontSize: 13, color: "#92400E", lineHeight: 1.6, border: "1px solid #FDBA74" }}>
              <strong>Auto-señal:</strong> Jaime propuso en sesión: cuando el equipo sube el Excel con la data de Diego y hay productos en 🔴, Pulso detecta el riesgo y crea la señal automáticamente sin que las chicas tengan que ir a crearla manualmente.
              <br /><em style={{ fontSize: 12 }}>Respuesta de Valentina: "Pues sería buenísimo."</em>
            </div>
          </div>
        </div>

        {/* Dolores */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>😩</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Dolores detectados (12 confirmados)</span>
          </div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {PAINS.map((p) => (
              <div key={p.id} style={{ display: "flex", gap: 14, alignItems: "flex-start", background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: p.color, background: p.bg, padding: "2px 8px", borderRadius: 99 }}>{p.id}</span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: p.color, background: p.bg, padding: "2px 7px", borderRadius: 99, whiteSpace: "nowrap" }}>{p.intensity}</span>
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", marginBottom: 4, lineHeight: 1.4 }}>{p.pain}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.4 }}>💬 {p.evidence}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Oportunidades */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, marginBottom: 28, overflow: "hidden" }}>
          <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 14 }}>💡</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Oportunidades para Dropi Pulso (10 identificadas)</span>
          </div>
          <div style={{ padding: 20, display: "flex", flexDirection: "column", gap: 10 }}>
            {OPPORTUNITIES.map((o) => {
              const pc = PAIN_PRIORITY_COLOR[o.priority];
              return (
                <div key={o.id} style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color: pc.color, background: pc.bg, padding: "2px 8px", borderRadius: 99 }}>{o.id}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>{o.label}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, fontWeight: 700, color: pc.color, background: pc.bg, padding: "2px 8px", borderRadius: 99 }}>Prioridad {o.priority}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 6, lineHeight: 1.5 }}>{o.desc}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>👤 {o.who}</span>
                    <span style={{ fontSize: 11, color: "var(--muted)" }}>· Dolores: {o.pains}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Visión de Natalia */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
            Visión de Natalia — adónde debería llegar Dropi Pulso
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              "Panel unificado con todas las solicitudes, estados, tiempos de respuesta y métricas — sin Excels paralelos.",
              "Exportable por mes y trimestre para revisiones de equipo.",
              "Franshesca con visibilidad de las 3 categorías (Premium, Verificado, No Verificado) en una sola vista.",
              "Ronald/Bogotá incorporado al flujo — con su propia vista para gestionar la búsqueda física de producto.",
              "Área de proveedores con la misma inteligencia de producto que hoy solo tiene el área de dropshippers.",
              "Sin doble registro — una sola fuente de verdad para todo el proceso.",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <span style={{ fontSize: 14, color: "#059669", flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Citas clave */}
        <div style={{ background: "#fff", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 16 }}>
            Citas directas de la sesión
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {QUOTES.map((q, i) => (
              <blockquote key={i} style={{ margin: 0, padding: "14px 18px", background: "#F8FAFC", borderLeft: "4px solid #F77F00", borderRadius: "0 8px 8px 0" }}>
                <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, margin: 0, fontStyle: "italic" }}>{q.text}</p>
                <footer style={{ fontSize: 11, color: "var(--muted)", marginTop: 6 }}>— {q.who}</footer>
              </blockquote>
            ))}
          </div>
        </div>

        {/* Vacíos */}
        <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 14, padding: "20px 24px", marginBottom: 28 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 14 }}>
            Vacíos pendientes
          </div>
          {[
            "Flujo completo de Ronald/Bogotá — Natalia propuso una sesión con él para completarlo.",
            "Sin datos cuantitativos del tiempo de escalación actual (detección 🔴 → respuesta del proveedor por WhatsApp).",
            "El bug de IDs de producto (Cronos ≠ Dropy) necesita sesión con Diego/Miguel Ángel para entender el alcance exacto.",
            `La API de catálogo para el 18 de agosto no fue confirmada con Tech — es expectativa de Jaime, no compromiso formal.`,
            "El umbral de concentración de dropshippers para activar alerta no fue definido — ¿a partir de cuántos drops?",
          ].map((g, i) => (
            <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: i < 4 ? 8 : 0 }}>
              <span style={{ fontSize: 12, color: "#F77F00", flexShrink: 0, marginTop: 1 }}>◆</span>
              <span style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>{g}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/proyectos/pulso-demo" style={{ fontSize: 13, fontWeight: 600, color: "#F77F00", textDecoration: "none", padding: "8px 16px", background: "#FFF8F0", borderRadius: 8, border: "1px solid #FDBA74" }}>
            ← Volver al proyecto
          </a>
          <span style={{ fontSize: 12, color: "var(--muted)", alignSelf: "center" }}>
            Archivo: research-brain/RB-005-cuidado-campanas-dropi-pulso.md
          </span>
        </div>

      </div>
    </main>
  );
}
