"use client";

import { useState } from "react";

// ── Types ──────────────────────────────────────────────────────
type SectionId = "intro" | "n1" | "n2" | "n3" | "n4" | "n5" | "n6" | "n7" | "conceptos";

// ── Navigation items ───────────────────────────────────────────
const NAV: { id: SectionId; label: string; icon: string; sub?: string }[] = [
  { id: "intro",    icon: "🗺️",  label: "Visión general",         sub: "¿Qué es este sistema?" },
  { id: "n1",       icon: "➕",  label: "Nodo 1 — Nueva campaña", sub: "Identidad y punto de partida" },
  { id: "n2",       icon: "🏷️", label: "Nodo 2 — Tipo",          sub: "Mecánica comercial" },
  { id: "n3",       icon: "👥",  label: "Nodo 3 — Segmentación",  sub: "A quién se dirige" },
  { id: "n4",       icon: "📏",  label: "Nodo 4 — Reglas",        sub: "Quién puede entrar" },
  { id: "n5",       icon: "📣",  label: "Nodo 5 — Convocatoria",  sub: "Cómo se invita al supplier" },
  { id: "n6",       icon: "📝",  label: "Nodo 6 — Postulación",   sub: "Qué postula el supplier" },
  { id: "n7",       icon: "🛍️", label: "Nodo 7 — Vitrina",       sub: "Qué ve el dropshipper" },
  { id: "conceptos",icon: "⚙️",  label: "Conceptos clave",        sub: "Condition builder y más" },
];

// ── Components ─────────────────────────────────────────────────
function Tag({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <span style={{
      display: "inline-block", background: `${color}18`, color,
      border: `1px solid ${color}35`, borderRadius: 20,
      padding: "2px 10px", fontSize: 11, fontWeight: 700,
    }}>{children}</span>
  );
}

function FieldRow({ name, req, type, note }: { name: string; req?: boolean; type: string; note: string }) {
  return (
    <tr>
      <td style={{ padding: "8px 12px", borderBottom: "1px solid #f3f4f6", fontSize: 13, fontWeight: 600, color: "#374151", whiteSpace: "nowrap" as const }}>
        {name}{req && <span style={{ color: "#F77F00", marginLeft: 3 }}>*</span>}
      </td>
      <td style={{ padding: "8px 12px", borderBottom: "1px solid #f3f4f6" }}>
        <span style={{ background: "#f3f4f6", color: "#6b7280", borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 600 }}>{type}</span>
      </td>
      <td style={{ padding: "8px 12px", borderBottom: "1px solid #f3f4f6", fontSize: 13, color: "#6b7280", lineHeight: 1.5 }}>{note}</td>
    </tr>
  );
}

function Example({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: `${color}08`, border: `1px solid ${color}25`, borderLeft: `3px solid ${color}`, borderRadius: "0 10px 10px 0", padding: "14px 18px", marginBottom: 10 }}>
      <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.06em" }}>{title}</div>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function NodeHeader({ num, icon, title, color, tagline }: { num: number; icon: string; title: string; color: string; tagline: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color, background: `${color}15`, padding: "2px 9px", borderRadius: 20 }}>Nodo {num} de 7</span>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#111827", margin: "0 0 4px" }}>{title}</h2>
        <p style={{ fontSize: 14, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{tagline}</p>
      </div>
    </div>
  );
}

function SectionCard({ id, children }: { id: SectionId; children: React.ReactNode }) {
  return (
    <section id={id} style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 16, padding: "32px 36px", marginBottom: 24 }}>
      {children}
    </section>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 style={{ fontSize: 14, fontWeight: 700, color: "#374151", marginBottom: 10, marginTop: 24 }}>{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 14, color: "#374151", lineHeight: 1.75, marginBottom: 12 }}>{children}</p>;
}

function Callout({ icon, color, children }: { icon: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ background: `${color}0c`, border: `1px solid ${color}28`, borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, marginBottom: 16 }}>
      <span style={{ fontSize: 18, flexShrink: 0, lineHeight: 1.4 }}>{icon}</span>
      <div style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{children}</div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────
export default function DocsPage() {
  const [activeNav, setActiveNav] = useState<SectionId>("intro");

  const scrollTo = (id: SectionId) => {
    setActiveNav(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <header style={{
        background: "#fff", borderBottom: "1px solid #e5e7eb",
        padding: "0 24px", height: 52,
        display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
        position: "sticky", top: 0, zIndex: 20,
      }}>
        <a href="/proyectos/dinamicas-catalogo" style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", fontSize: 13, textDecoration: "none" }}>
          ← Campañas
        </a>
        <span style={{ color: "#e5e7eb" }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>Documentación</span>
        <Tag color="#0EA5E9">DCA-001</Tag>
      </header>

      <div style={{ flex: 1, display: "flex", maxWidth: 1100, margin: "0 auto", width: "100%", padding: "32px 24px", gap: 32 }}>

        {/* Left nav */}
        <aside style={{ width: 220, flexShrink: 0, alignSelf: "flex-start", position: "sticky", top: 68 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", marginBottom: 10, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>Contenido</div>
          {NAV.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              style={{
                width: "100%", background: activeNav === item.id ? "#FFF3E0" : "none",
                border: "none", borderRadius: 9, cursor: "pointer",
                padding: "8px 10px", textAlign: "left" as const,
                display: "flex", alignItems: "center", gap: 8, marginBottom: 2,
                borderLeft: activeNav === item.id ? "3px solid #F77F00" : "3px solid transparent",
              }}
            >
              <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: activeNav === item.id ? "#F77F00" : "#374151", lineHeight: 1.3 }}>{item.label}</div>
                {item.sub && <div style={{ fontSize: 11, color: "#9ca3af", lineHeight: 1.3 }}>{item.sub}</div>}
              </div>
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* ── INTRO ───────────────────────────────────────── */}
          <SectionCard id="intro">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: 32 }}>🗺️</span>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: 0 }}>Dinámicas de Catálogo — DCA-001</h1>
                <p style={{ fontSize: 14, color: "#6b7280", margin: "4px 0 0" }}>Prototipo funcional del creador de campañas</p>
              </div>
            </div>

            <P>
              <strong>DCA-001 es un experimento lean</strong> que busca responder una pregunta central antes de construir cualquier módulo formal en Dropi: <em>¿podemos hacer que suppliers participen activamente en campañas curadas por Dropi, y que los dropshippers adopten esos productos?</em>
            </P>
            <P>
              En lugar de desarrollar un módulo complejo, se construyó un <strong>prototipo funcional interno</strong>: un wizard de 7 nodos que permite a la célula de Supplier Success estructurar, documentar y ejecutar campañas de catálogo de forma manual, con toda la información operativa organizada en un solo lugar.
            </P>

            <Callout icon="💡" color="#F77F00">
              <strong>El objetivo no es la herramienta en sí — es aprender.</strong> Cada campaña que se crea y ejecuta con este wizard genera datos sobre participación supplier, adopción dropshipper y señales comerciales que luego informan si vale la pena construir el módulo real en Dropi.
            </Callout>

            <H3>¿Cómo funciona el flujo?</H3>
            <P>Cada campaña recorre 7 nodos en secuencia. Cada nodo captura una capa de decisiones operativas:</P>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { n: 1, icon: "➕", label: "Nueva campaña",      desc: "Nombre, objetivo, fechas, hipótesis", color: "#F77F00" },
                { n: 2, icon: "🏷️",label: "Tipo de campaña",    desc: "Mecánica comercial: temporada, remate, visibilidad...", color: "#F77F00" },
                { n: 3, icon: "👥", label: "Segmentación",       desc: "A qué suppliers/productos se dirige", color: "#0EA5E9" },
                { n: 4, icon: "📏", label: "Reglas",             desc: "Quién puede realmente entrar", color: "#8B5CF6" },
                { n: 5, icon: "📣", label: "Convocatoria",       desc: "Mensaje, canal, CTA al supplier", color: "#F59E0B" },
                { n: 6, icon: "📝", label: "Postulación",        desc: "Formulario que diligencia el supplier", color: "#EC4899" },
                { n: 7, icon: "🛍️",label: "Vitrina",            desc: "Qué ve y cómo actúa el dropshipper", color: "#10B981" },
              ].map(({ n, icon, label, desc, color }) => (
                <div key={n} style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#f9fafb", borderRadius: 10, padding: "10px 14px", border: "1px solid #e5e7eb" }}>
                  <span style={{ width: 26, height: 26, borderRadius: 7, background: color, color: "#fff", fontSize: 11, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{n}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{icon} {label}</div>
                    <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <P>Al completar los 7 nodos, el sistema genera un <strong>handoff operativo</strong> con 12 secciones (resumen, objetivo, segmento, reglas, convocatoria, postulación, vitrina, comunicación, RACI, métricas, riesgos y checklist) listo para compartir con Comercial, Growth, Comunicaciones y el resto de la célula.</P>

            <H3>Estructura del experimento</H3>
            <div style={{ overflowX: "auto" as const }}>
              <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f9fafb" }}>
                    {["Eje", "Hipótesis a validar"].map(h => (
                      <th key={h} style={{ padding: "9px 14px", textAlign: "left" as const, fontWeight: 700, color: "#6b7280", fontSize: 11, borderBottom: "2px solid #e5e7eb" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Participación supplier", "¿Los suppliers postularán productos si Dropi les ofrece visibilidad o la posibilidad de rematar inventario?"],
                    ["Adopción dropshipper", "¿Los dropshippers explorarán y tomarán productos de una vitrina curada por Dropi?"],
                    ["Señal comercial", "¿Una campaña manual genera órdenes o GMV medibles sin necesitar desarrollo?"],
                    ["Operación interna", "¿La célula puede ejecutar el proceso de extremo a extremo con esta estructura?"],
                  ].map(([eje, hip], i) => (
                    <tr key={i}>
                      <td style={{ padding: "9px 14px", borderBottom: "1px solid #f3f4f6", fontWeight: 600, color: "#374151", fontSize: 13, whiteSpace: "nowrap" as const }}>{eje}</td>
                      <td style={{ padding: "9px 14px", borderBottom: "1px solid #f3f4f6", color: "#6b7280", fontSize: 13, lineHeight: 1.5 }}>{hip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* ── NODO 1 ──────────────────────────────────────── */}
          <SectionCard id="n1">
            <NodeHeader num={1} icon="➕" title="Nueva campaña" color="#F77F00" tagline="El punto de partida. Define la identidad, intención y alcance de la campaña antes de entrar a segmentación o reglas." />

            <P>
              Este nodo crea el <strong>contenedor de la campaña</strong>: todo lo que se define después (segmento, reglas, vitrina) va a vivir dentro de lo que aquí se establece. No define todavía a quién se va a invitar ni cómo — solo responde: <em>¿qué queremos probar y por qué?</em>
            </P>

            <Callout icon="🎯" color="#F77F00">
              <strong>El campo más importante es la hipótesis.</strong> No es un campo decorativo — es la razón por la que existe la campaña. Debe ser una apuesta verificable: "Si hacemos X, esperamos que pase Y."
            </Callout>

            <H3>Campos del nodo</H3>
            <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13, marginBottom: 16 }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Campo", "Tipo", "Para qué sirve"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                <FieldRow name="Nombre" req type="Texto" note="Identificador público de la campaña. Debe ser claro y distintivo. Ej: 'Dropicup Mundial 2026', 'Remates de Stock Junio'" />
                <FieldRow name="Descripción corta" req type="Texto" note="Una frase que explica qué se quiere probar. Se mostrará en el handoff como contexto de la campaña." />
                <FieldRow name="Objetivo principal" req type="Multiselección" note="Qué resultado comercial se busca: GMV, órdenes, visibilidad a suppliers, activar productos quietos, validar interés de dropshippers, etc." />
                <FieldRow name="Tipo de experimento" req type="Multiselección" note="Cómo se va a ejecutar: vitrina manual, GHL, WhatsApp, Userpilot, comunicación comercial, o una combinación." />
                <FieldRow name="País / mercado" req type="Multiselección" note="Aplica para Colombia, México, Chile, Ecuador o multipaís. Condiciona segmentación y comunicación." />
                <FieldRow name="Fechas base" req type="4 fechas" note="Inicio convocatoria supplier → Cierre postulación → Publicación para dropshippers → Cierre de campaña." />
                <FieldRow name="Responsable" req type="Selección" note="Equipo o persona responsable de coordinar la campaña: Producto, Growth, Comercial, Supplier Success." />
                <FieldRow name="Hipótesis" req type="Texto" note="La apuesta central que queremos validar. Debe ser falseable: '¿Qué creemos que va a pasar y por qué?'" />
                <FieldRow name="Resultado esperado" req type="Texto" note="Qué métricas o señales indicarían que la hipótesis se confirmó. Base para el nodo de medición." />
              </tbody>
            </table>

            <H3>Ejemplos</H3>
            <Example title="Dropicup Mundial 2026" color="#F77F00">
              <strong>Hipótesis:</strong> Si Dropi crea una vitrina curada del Mundial, los suppliers postularán por visibilidad y los dropshippers tendrán mayor intención de explorar esos productos, generando órdenes incrementales.<br />
              <strong>Resultado esperado:</strong> 20+ suppliers participantes, 60+ productos aprobados, 100+ dropshippers con clic en vitrina, señal de 30+ órdenes en la primera semana.
            </Example>
            <Example title="Remates de Stock — Junio 2026" color="#EC4899">
              <strong>Hipótesis:</strong> Si Dropi cura productos con descuento real de suppliers con inventario quieto, los dropshippers tendrán mayor intención de tomar esos productos para pauta directa.<br />
              <strong>Resultado esperado:</strong> 15+ suppliers con productos de remate aprobados, descuentos mínimos del 15%, adopción en 50+ dropshippers en la primera semana.
            </Example>
          </SectionCard>

          {/* ── NODO 2 ──────────────────────────────────────── */}
          <SectionCard id="n2">
            <NodeHeader num={2} icon="🏷️" title="Tipo de campaña" color="#F77F00" tagline="Define la mecánica comercial. La elección aquí condiciona segmentación, reglas, descuentos y medición." />

            <P>
              No todas las campañas funcionan igual. Una campaña de remate necesita descuento obligatorio. Una de visibilidad no. Una de temporada se mueve por contexto comercial externo (Navidad, Día de la Madre, Mundial). Definir el tipo correcto desde el principio evita inconsistencias en los nodos siguientes.
            </P>

            <H3>Catálogo de tipos</H3>
            {[
              { tipo: "Temporada", color: "#F77F00", desc: "Creada alrededor de momentos comerciales claros: Black Week, Navidad, Día de la Madre, Mundial, Regreso a clases. El contexto hace el trabajo de activación — el dropshipper ya quiere vender ese tipo de producto.", requiere: "Descuento opcional", mover: "GMV + órdenes", ejemplo: "Dropicup Mundial, Black Friday, Navidad Dropi" },
              { tipo: "Remate",    color: "#EF4444", desc: "Para suppliers que necesitan salir de inventario acumulado. El supplier define el descuento, Dropi pone la vitrina y los dropshippers. La condición obligatoria es descuento real y verificable.", requiere: "Descuento obligatorio", mover: "Productos quietos + unidades", ejemplo: "Remates de Stock Junio, Liquidación de Bodega" },
              { tipo: "Visibilidad", color: "#0EA5E9", desc: "El beneficio para el supplier NO es el descuento sino la exposición. Valida si los suppliers participan solo por aparecer en una vitrina curada por Dropi.", requiere: "Sin descuento obligatorio", mover: "Adopción dropshipper + GMV", ejemplo: "Productos Seleccionados por Dropi, Catálogo Premium" },
              { tipo: "Por categoría", color: "#8B5CF6", desc: "Agrupa productos por vertical temática. Facilita al dropshipper encontrar productos con intención de venta clara.", requiere: "Sin descuento obligatorio", mover: "GMV por categoría + adopción", ejemplo: "Belleza de Temporada, Hogar y Organización, Tecnología Alto Margen" },
              { tipo: "Productos quietos", color: "#6B7280", desc: "Enfocada en productos publicados que no han tenido movimiento. Mide si la visibilidad adicional es suficiente para activar productos dormidos.", requiere: "Descuento recomendado", mover: "Primera venta + rotación", ejemplo: "Activa tu Catálogo, Productos sin Órdenes en 60 días" },
              { tipo: "Suppliers nuevos", color: "#10B981", desc: "Acelera el Time to Value de suppliers recién activados. Les da visibilidad inicial para conseguir primeras órdenes sin esperar adopción orgánica.", requiere: "Sin descuento obligatorio", mover: "Primera venta + adopción inicial", ejemplo: "Nuevos Suppliers Destacados, Primeras Órdenes" },
              { tipo: "Alto margen",  color: "#F59E0B", desc: "Agrupa productos atractivos por rentabilidad para el dropshipper. Ideal para dropshippers que quieren escalar pauta con buena promesa económica.", requiere: "Sin descuento obligatorio", mover: "Adopción por rentabilidad", ejemplo: "Productos para Pauta, Top Rentabilidad" },
              { tipo: "Mixta",        color: "#EC4899", desc: "Combina varias lógicas. Ejemplo: Dropicup puede ser simultáneamente temporada + visibilidad + remate + productos para pauta.", requiere: "Depende de la combinación", mover: "Múltiples objetivos", ejemplo: "Dropicup, Black Week con remate incluido" },
            ].map(({ tipo, color, desc, requiere, mover, ejemplo }) => (
              <div key={tipo} style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px 18px", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <Tag color={color}>{tipo}</Tag>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Descuento: {requiere}</span>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>·</span>
                  <span style={{ fontSize: 12, color: "#9ca3af" }}>Mueve: {mover}</span>
                </div>
                <p style={{ fontSize: 13, color: "#374151", margin: "0 0 6px", lineHeight: 1.6 }}>{desc}</p>
                <p style={{ fontSize: 12, color: "#9ca3af", margin: 0 }}>Ej: {ejemplo}</p>
              </div>
            ))}
          </SectionCard>

          {/* ── NODO 3 ──────────────────────────────────────── */}
          <SectionCard id="n3">
            <NodeHeader num={3} icon="👥" title="Segmentación" color="#0EA5E9" tagline="Define a quién se dirige la campaña usando condiciones tipo query — no una lista manual." />

            <P>
              La segmentación es la primera decisión de <em>escala</em> de la campaña. En lugar de seleccionar proveedores uno a uno, se define una lógica que describe el universo objetivo: condiciones que deben cumplirse, condiciones opcionales que amplían el alcance, y exclusiones que protegen la campaña de casos de riesgo.
            </P>

            <Callout icon="⚠️" color="#0EA5E9">
              <strong>Diferencia clave con el Nodo 4 (Reglas):</strong> La segmentación define a quién <em>mirar y contactar</em>. Las reglas definen quién realmente <em>puede entrar</em>. Un supplier puede estar en el segmento y aun así no pasar las reglas por tener productos con stock insuficiente.
            </Callout>

            <H3>Estructura de condiciones</H3>
            <div style={{ background: "#f0f9ff", border: "1px solid #0EA5E930", borderRadius: 10, padding: "14px 18px", marginBottom: 16, fontFamily: "monospace", fontSize: 13, lineHeight: 2, color: "#374151" }}>
              Incluir suppliers/productos que cumplan:<br />
              &nbsp;&nbsp;Condición A <Tag color="#1d4ed8">AND</Tag> Condición B <Tag color="#1d4ed8">AND</Tag> Condición C<br /><br />
              También permitir (opcionales):<br />
              &nbsp;&nbsp;Condición D <Tag color="#7c3aed">OR</Tag> Condición E<br /><br />
              Excluir si se cumple:<br />
              &nbsp;&nbsp;Condición F <Tag color="#7c3aed">OR</Tag> Condición G
            </div>

            <H3>Campos del nodo</H3>
            <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13, marginBottom: 16 }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Campo", "Tipo", "Para qué sirve"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                <FieldRow name="Universo base" req type="Selección" note="Punto de partida: Suppliers+productos (recomendado MVP), solo suppliers, solo productos, categoría, país, base manual, campaña anterior." />
                <FieldRow name="Condiciones obligatorias" req type="Condition builder AND" note="Todas deben cumplirse. Ejemplo: Supplier verificado AND tiene contacto válido AND producto activo AND stock ≥ 20." />
                <FieldRow name="Condiciones opcionales" type="Condition builder OR" note="Amplían el alcance por oportunidad. Ejemplo: OR recomendado por comercial OR órdenes últimos 30d ≥ 5." />
                <FieldRow name="Exclusiones" req type="Condition builder OR" note="Si se cumple cualquiera, queda fuera. Ejemplo: OR alerta operativa crítica OR cancelaciones > 20%." />
                <FieldRow name="Tamaño esperado" req type="Texto" note="Estimado de cuántos suppliers/productos entran. MVP recomendado: 20-50 suppliers o 50-150 productos." />
                <FieldRow name="Fuente de datos" req type="Multiselección" note="Comercial, CRM/GHL, reporte de stock, reporte de órdenes, base de productos, sheet manual, etc." />
                <FieldRow name="Responsable" req type="Selección" note="Quién construye y valida la lista final: Supplier Success, Comercial, Data, Producto." />
              </tbody>
            </table>

            <H3>Casos de uso documentados</H3>
            <Example title="Dropicup Mundial — Temporada" color="#F77F00">
              Supplier en Colombia, verificado, con contacto válido, producto activo con stock ≥ 20 y categoría relacionada con fútbol/decoración/tecnología.<br />
              <strong>Exclusiones:</strong> Alerta operativa crítica, cancelaciones recientes &gt; 20%.
            </Example>
            <Example title="Remates de Stock — Remate" color="#EF4444">
              Supplier con buen cumplimiento, producto activo con stock ≥ 30 y órdenes últimos 60 días ≤ 5.<br />
              <strong>Opcionales:</strong> Producto con baja rotación, órdenes últimos 90d ≤ 10.<br />
              <strong>Exclusiones:</strong> Novedades críticas, cancelaciones &gt; 25%.
            </Example>
            <Example title="Productos Seleccionados — Visibilidad" color="#0EA5E9">
              Producto activo, ficha completa, imagen válida, stock ≥ 20, supplier con buen cumplimiento.<br />
              <strong>Opcionales:</strong> Potencial para pauta, margen estimado ≥ X%.<br />
              <strong>Exclusiones:</strong> Sin stock, sin imagen, alerta operativa crítica.
            </Example>
          </SectionCard>

          {/* ── NODO 4 ──────────────────────────────────────── */}
          <SectionCard id="n4">
            <NodeHeader num={4} icon="📏" title="Reglas de participación" color="#8B5CF6" tagline="El filtro final. Protege la experiencia del dropshipper y la reputación de la campaña." />

            <P>
              Mientras la segmentación decide a quién <em>contactar</em>, las reglas de participación definen quién realmente <em>puede entrar</em>. Un supplier puede estar en el segmento objetivo y aun así tener productos que no cumplen los mínimos para aparecer en la vitrina.
            </P>
            <P>
              Este nodo evita que la campaña tenga productos sin stock, sin imagen, con problemas operativos o que no tengan relación con la temática. Protege tanto al dropshipper (que ve una oferta de calidad) como al supplier (que no quiere comprometerse con algo que no puede cumplir).
            </P>

            <H3>Los 5 estados de elegibilidad</H3>
            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              {[
                { estado: "Elegible", color: "#10B981", desc: "Cumple todas las reglas obligatorias. Puede entrar a la campaña sin ajustes." },
                { estado: "Requiere ajuste", color: "#F59E0B", desc: "Cumple las principales pero falta algo corregible (ej. imagen, ficha incompleta). Se puede incluir si se corrige antes del cierre." },
                { estado: "No elegible", color: "#EF4444", desc: "Incumple una regla bloqueante (sin stock, inactivo, sin relación temática). Queda fuera." },
                { estado: "Pendiente de validación", color: "#6B7280", desc: "Requiere revisión manual por parte del equipo. Casos grises o información incompleta." },
                { estado: "Aprobado por excepción", color: "#8B5CF6", desc: "No cumple todo pero se aprueba con justificación documentada del comercial o PM." },
              ].map(({ estado, color, desc }) => (
                <div key={estado} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", background: `${color}0a`, border: `1px solid ${color}25`, borderRadius: 10 }}>
                  <Tag color={color}>{estado}</Tag>
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{desc}</span>
                </div>
              ))}
            </div>

            <H3>Campos del nodo</H3>
            <table style={{ width: "100%", borderCollapse: "collapse" as const, fontSize: 13, marginBottom: 16 }}>
              <thead><tr style={{ background: "#f9fafb" }}>
                {["Campo", "Tipo", "Para qué sirve"].map(h => <th key={h} style={{ padding: "8px 12px", textAlign: "left" as const, fontSize: 11, fontWeight: 700, color: "#6b7280", borderBottom: "2px solid #e5e7eb" }}>{h}</th>)}
              </tr></thead>
              <tbody>
                <FieldRow name="Reglas obligatorias" req type="Condition builder AND" note="Sin cumplir estas, el producto no puede entrar. Mínimo: activo, tiene imagen, stock suficiente." />
                <FieldRow name="Reglas recomendadas" type="Condition builder AND" note="No bloquean pero ayudan a priorizar productos dentro de la campaña." />
                <FieldRow name="Reglas excluyentes" req type="Condition builder OR" note="Si se cumple cualquiera, el producto queda fuera automáticamente." />
                <FieldRow name="Stock mínimo" req type="Número" note="Umbral mínimo de unidades para garantizar disponibilidad. MVP recomendado: 20u (temporada), 30u (remate)." />
                <FieldRow name="Descuento mínimo (%)" type="Número" note="Solo si aplica al tipo de campaña. Remate: mínimo 15%. Temporada: puede ser 0." />
                <FieldRow name="Margen mínimo (%)" type="Número" note="Protege la rentabilidad del dropshipper. Recomendado: mínimo 20%." />
                <FieldRow name="Máx. productos / supplier" type="Número" note="Evita que un solo supplier domine la vitrina. Recomendado: 5-8 productos por supplier." />
                <FieldRow name="Reglas específicas de campaña" type="Texto" note="Condiciones únicas de esta campaña. Ej: Dropicup — el producto debe relacionarse con fútbol." />
                <FieldRow name="Criterios de elegibilidad" req type="Texto" note="Documenta cuándo cada producto pasa a cada estado (elegible / ajuste / no elegible / excepción)." />
              </tbody>
            </table>
          </SectionCard>

          {/* ── NODO 5 ──────────────────────────────────────── */}
          <SectionCard id="n5">
            <NodeHeader num={5} icon="📣" title="Convocatoria supplier" color="#F59E0B" tagline="El momento de verdad: ¿el supplier muestra intención cuando Dropi le ofrece visibilidad o la posibilidad de rematar?" />

            <P>
              Este nodo valida la primera hipótesis del experimento: si Dropi ofrece visibilidad u oportunidad de remate, ¿los suppliers realmente muestran interés de participar? La respuesta a esta pregunta define si el modelo de campañas tiene tracción o no.
            </P>

            <H3>Tipos de convocatoria</H3>
            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              {[
                { tipo: "Abierta", color: "#6B7280", desc: "Se comunica a todos los suppliers que cumplen las condiciones básicas del segmento. Buena para campañas amplias como Black Week o remates generales." },
                { tipo: "Segmentada", color: "#0EA5E9", desc: "Solo llega a suppliers que cumplen una condición específica (ej: solo Colombia, solo categoría hogar). El mensaje puede ser más personalizado." },
                { tipo: "Por invitación", color: "#8B5CF6", desc: "Mensaje personalizado: 'Tu catálogo fue seleccionado'. Más impacto, menor escala. Ideal para suppliers estratégicos o con alto potencial." },
                { tipo: "Comercial manual", color: "#F77F00", desc: "El comercial contacta directamente. Recomendado para el MVP porque obtiene respuesta más rápida y permite resolver dudas en tiempo real." },
                { tipo: "Mixta", color: "#10B981", desc: "Invitación directa para estratégicos + convocatoria abierta para el resto del segmento. Maximiza cobertura y calidad." },
              ].map(({ tipo, color, desc }) => (
                <div key={tipo} style={{ display: "flex", gap: 12, padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                  <Tag color={color}>{tipo}</Tag>
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{desc}</span>
                </div>
              ))}
            </div>

            <H3>Estructura mínima del mensaje de convocatoria</H3>
            <div style={{ background: "#FFFBF0", border: "1px solid #F59E0B30", borderRadius: 10, padding: "14px 18px", marginBottom: 16, fontSize: 13, lineHeight: 1.8, color: "#374151" }}>
              1. <strong>Nombre de la campaña</strong> — qué es lo que se está invitando<br />
              2. <strong>Beneficio para el supplier</strong> — visibilidad / salida de stock / primera venta<br />
              3. <strong>Qué productos puede postular</strong> — contexto o restricciones<br />
              4. <strong>Si aplica descuento o precio especial</strong><br />
              5. <strong>Fecha límite de postulación</strong><br />
              6. <strong>CTA claro con link</strong> — acción concreta que debe tomar
            </div>

            <H3>Métricas que registra este nodo</H3>
            <P>Para cada supplier convocado: ¿fue contactado? ¿respondió? ¿se interesó? ¿postuló productos? ¿cuál fue su motivación declarada? Estos datos son la primera señal del experimento.</P>

            <Example title="Mensaje de convocatoria — Dropicup Mundial" color="#F77F00">
              "Hola [nombre] 👋 Te queremos invitar a participar en <strong>Dropicup Mundial</strong>, la campaña especial de Dropi para la temporada del Mundial. Seleccionamos tu catálogo porque tienes productos que los dropshippers van a estar buscando. Es gratis participar — solo necesitas postular tus mejores productos antes del 12 de junio. Los seleccionados aparecerán en la vitrina especial de Dropicup 🏆 con mayor visibilidad ante miles de dropshippers. 👉 Postula aquí: [link]"
            </Example>
            <Example title="Mensaje de convocatoria — Remates de Stock" color="#EF4444">
              "Hola [nombre] 👋 Vemos que tienes productos con stock acumulado que no han tenido movimiento. Queremos ayudarte a sacarlos. Estamos armando una campaña de Remates de Junio — tú defines el descuento, nosotros ponemos la vitrina y los dropshippers. ¿Te interesa? Tienes hasta el 7 de junio para postular. 👉 [link]"
            </Example>
          </SectionCard>

          {/* ── NODO 6 ──────────────────────────────────────── */}
          <SectionCard id="n6">
            <NodeHeader num={6} icon="📝" title="Postulación de productos" color="#EC4899" tagline="El supplier registra qué quiere postular y bajo qué condiciones comerciales." />

            <P>
              Este nodo configura el proceso mediante el cual el supplier (o el comercial en su nombre) registra los productos que quiere incluir en la campaña. En el MVP no es un módulo en plataforma — es un formulario externo (Google Form por defecto) que captura la información mínima para que Dropi pueda revisar y aprobar.
            </P>

            <Callout icon="💡" color="#EC4899">
              <strong>El campo de motivación es estratégico.</strong> Saber por qué el supplier quiere participar (visibilidad, salir de stock, activar producto nuevo) es una de las señales más valiosas del experimento para entender qué mueve a los proveedores.
            </Callout>

            <H3>Herramientas de captura recomendadas para el MVP</H3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
              {[
                { tool: "Google Form", rec: true, desc: "Rápido de crear, fácil de compartir. Respuestas en Sheet directo. Recomendado para el MVP." },
                { tool: "Airtable Form", desc: "Mejor estructura y vista de base de datos. Útil si ya usan Airtable." },
                { tool: "Tally", desc: "Alternativa ligera. Buena UX y fácil de configurar." },
                { tool: "Sheet + Comercial", desc: "El comercial llena en nombre del supplier. Más control, más trabajo manual." },
              ].map(({ tool, rec, desc }) => (
                <div key={tool} style={{ padding: "10px 14px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                  <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>{tool}</span>
                    {rec && <Tag color="#10B981">Recomendado</Tag>}
                  </div>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: 0, lineHeight: 1.5 }}>{desc}</p>
                </div>
              ))}
            </div>

            <H3>Datos que debe capturar el formulario</H3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { section: "Del supplier", color: "#0EA5E9", items: ["Nombre", "ID del supplier", "País", "Contacto (WA/correo)", "Comercial responsable"] },
                { section: "Del producto", color: "#8B5CF6", items: ["Nombre del producto", "ID o link en Dropi", "Categoría", "Estado (activo/inactivo)", "Tipo (simple o variable)"] },
                { section: "Comercial", color: "#EC4899", items: ["Precio actual", "Precio de campaña", "Descuento (%)", "Stock disponible", "Vigencia del precio"] },
              ].map(({ section, color, items }) => (
                <div key={section} style={{ background: `${color}08`, border: `1px solid ${color}25`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color, marginBottom: 8 }}>{section}</div>
                  {items.map(i => <div key={i} style={{ fontSize: 12, color: "#374151", lineHeight: 1.8 }}>· {i}</div>)}
                </div>
              ))}
            </div>

            <H3 >Estados de la postulación</H3>
            <P>Recibido → Incompleto → Pendiente de revisión → Enviado a curaduría → Requiere información adicional</P>
          </SectionCard>

          {/* ── NODO 7 ──────────────────────────────────────── */}
          <SectionCard id="n7">
            <NodeHeader num={7} icon="🛍️" title="Construir vitrina" color="#10B981" tagline="Cómo se presenta la campaña al dropshipper. La campaña solo tiene valor si el dropshipper percibe una oportunidad clara." />

            <P>
              Este es el último nodo del flujo de definición. Todo lo anterior (segmento, reglas, convocatoria, postulación) sirve para llegar a este punto: mostrarle al dropshipper una vitrina curada con productos atractivos. Si la vitrina no es clara y el CTA no es obvio, el experimento no va a generar señal.
            </P>

            <Callout icon="🛍️" color="#10B981">
              <strong>Regla de oro del MVP:</strong> La información mínima por producto es imagen + nombre + supplier + precio + stock + CTA. Sin estos 6 elementos, el dropshipper no tiene suficiente contexto para tomar una decisión.
            </Callout>

            <H3>Tipos de vitrina disponibles en el MVP</H3>
            <div style={{ display: "grid", gap: 8, marginBottom: 16 }}>
              {[
                { tipo: "Categoría temporal beta", esfuerzo: "Bajo", color: "#10B981", desc: "Crear una categoría temporal dentro del catálogo de Dropi. Simula el módulo sin construirlo. Mide si la categoría atrae uso orgánico de dropshippers." },
                { tipo: "Landing manual",          esfuerzo: "Medio", color: "#0EA5E9", desc: "Página sencilla con cards de productos. Buena experiencia. Requiere algo más de construcción pero da mejor señal de UX." },
                { tipo: "Sheet curado",            esfuerzo: "Muy bajo", color: "#6B7280", desc: "Vista compartida con comerciales o dropshippers. MVP ultra-rápido. Debe tener: producto, imagen/link, supplier, precio, stock, descuento y CTA." },
                { tipo: "Campaña GHL / WhatsApp",  esfuerzo: "Bajo", color: "#F59E0B", desc: "Mensaje con productos destacados enviado a dropshippers segmentados vía GHL. Ideal para dropshippers ya activos en el CRM." },
                { tipo: "Documento handoff comercial", esfuerzo: "Muy bajo", color: "#EC4899", desc: "Documento para que comercial o Growth envíen directamente a dropshippers. Más manual, pero valida interés rápido." },
                { tipo: "Mixta",                   esfuerzo: "Variable", color: "#8B5CF6", desc: "Combina formatos. Ej: categoría temporal + envío por GHL para maximizar cobertura." },
              ].map(({ tipo, esfuerzo, color, desc }) => (
                <div key={tipo} style={{ display: "flex", gap: 12, padding: "12px 16px", background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10 }}>
                  <div style={{ flexShrink: 0 }}>
                    <Tag color={color}>{tipo}</Tag>
                    <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>Esfuerzo: {esfuerzo}</div>
                  </div>
                  <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.6 }}>{desc}</span>
                </div>
              ))}
            </div>

            <H3>Cómo organizar los productos (agrupaciones)</H3>
            <P>Evita la lista plana. Los productos deben estar agrupados para facilitar la exploración del dropshipper. Opciones: Destacados · Alto margen · Remates / descuento · Por categoría · Por supplier · Terminan pronto · Nuevos · Productos para pauta.</P>

            <H3>Badges disponibles</H3>
            <P>Máximo 2–3 badges por producto para no saturar. Opciones: Seleccionado por Dropi · Precio especial · Remate · Alto stock · Alto margen · Producto de temporada · Nuevo · Últimas unidades · Supplier verificado · Despacho rápido · Termina pronto · Campaña activa.</P>

            <Callout icon="✅" color="#10B981">
              <strong>Al completar este nodo la campaña queda lista para handoff.</strong> El sistema genera automáticamente el documento operativo con las 12 secciones para distribuir a todos los equipos involucrados.
            </Callout>
          </SectionCard>

          {/* ── CONCEPTOS ───────────────────────────────────── */}
          <SectionCard id="conceptos">
            <NodeHeader num={0} icon="⚙️" title="Conceptos clave" color="#6B7280" tagline="Condition Builder, multiselect con ranking y cómo interpretar el handoff." />

            <H3>Condition Builder</H3>
            <P>
              El Condition Builder es el componente de los nodos 3 y 4 que permite construir segmentos y reglas de forma estructurada. Funciona como un constructor de queries visuales donde cada condición tiene tres partes: <strong>campo → operador → valor</strong>.
            </P>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: "14px 18px", marginBottom: 12, fontSize: 13, lineHeight: 1.8, color: "#374151" }}>
              Ejemplo de condición AND:<br />
              <Tag color="#1d4ed8">AND</Tag> &nbsp;<strong>Supplier: Verificado</strong> <Tag color="#1d4ed8">es Sí</Tag><br />
              <Tag color="#1d4ed8">AND</Tag> &nbsp;<strong>Producto: Stock</strong> <Tag color="#1d4ed8">≥</Tag> <strong>20</strong><br />
              <Tag color="#1d4ed8">AND</Tag> &nbsp;<strong>Supplier: País</strong> <Tag color="#1d4ed8">=</Tag> <strong>Colombia</strong>
            </div>
            <P>Los campos disponibles cubren 4 dimensiones: <strong>Supplier</strong> (estado, verificación, alertas, activación), <strong>Producto</strong> (stock, margen, órdenes, imágenes, rotación), <strong>Operativo</strong> (cancelaciones, despacho, novedades) y <strong>Campaña</strong> (descuento, precio, vigencia).</P>

            <H3>Multiselect con ranking de canales</H3>
            <P>
              En los nodos 5 y 7, al seleccionar canales de comunicación o distribución, el primero que se selecciona queda marcado como <strong>Principal</strong> y los siguientes como <strong>Secundarios</strong>. Este orden importa: define qué canal se debe priorizar en la ejecución.
            </P>

            <H3>El handoff generado</H3>
            <P>
              Al completar los 7 nodos, el botón <strong>↓ Handoff</strong> aparece en la lista de campañas. El documento generado consolida automáticamente toda la información en 12 secciones operativas, ensamblando los responsables en una matriz RACI, mostrando las condiciones del Condition Builder de forma legible, y generando un checklist dinámico basado en los campos completados. Se puede imprimir o descargar como PDF.
            </P>

            <H3>Estado de la campaña</H3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { estado: "Borrador", color: "#6B7280", desc: "Campaña creada, sin avanzar nodos." },
                { estado: "En progreso", color: "#F77F00", desc: "Al menos un nodo guardado. El nodo 1 ya avanzó." },
                { estado: "Completada", color: "#10B981", desc: "Los 7 nodos completos. Handoff disponible." },
              ].map(({ estado, color, desc }) => (
                <div key={estado} style={{ background: `${color}0a`, border: `1px solid ${color}25`, borderRadius: 10, padding: "12px 14px", textAlign: "center" as const }}>
                  <Tag color={color}>{estado}</Tag>
                  <p style={{ fontSize: 12, color: "#6b7280", margin: "8px 0 0", lineHeight: 1.5 }}>{desc}</p>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Footer */}
          <div style={{ textAlign: "center" as const, fontSize: 12, color: "#9ca3af", padding: "20px 0 40px" }}>
            Dropi · Supplier Success · DCA-001 · Dinámicas de Catálogo
          </div>

        </main>
      </div>
    </div>
  );
}
