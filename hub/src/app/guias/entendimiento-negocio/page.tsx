import HubFooter from "@/components/HubFooter";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)", marginTop: 40, marginBottom: 12 }}>
      {children}
    </h2>
  );
}

function Callout({ tone, children }: { tone: "pending" | "info"; children: React.ReactNode }) {
  const bg = tone === "pending" ? "#FFF6E5" : "var(--dropi-light)";
  const border = tone === "pending" ? "#F0C766" : "var(--dropi)";
  return (
    <div style={{
      background: bg, border: `1px solid ${border}`, borderRadius: 10,
      padding: "12px 16px", fontSize: 13, color: "var(--fg)", lineHeight: 1.6, marginTop: 12, marginBottom: 12,
    }}>
      {children}
    </div>
  );
}

function Code({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6,
      padding: "2px 6px", fontSize: 12.5, color: "var(--fg)",
    }}>
      {children}
    </code>
  );
}

const comportamientos = [
  { valor: "Evidente", definicion: "Realiza órdenes únicamente desde su usuario Supplier. Sin Dropshippers asociados. Caso más limpio y predecible." },
  { valor: "Estándar", definicion: "Realiza solo órdenes propias desde su rol Supplier. Puede tener Dropshippers que venden su catálogo, pero su operación principal son sus propias órdenes." },
  { valor: "Oculto", definicion: "Recibe órdenes de un solo Dropshipper con inventario oculto. Opera simultáneamente como Supplier y Dropshipper — dos roles técnicos para una sola operación real de marca." },
  { valor: "Mayoritariamente Dropshipper", definicion: "Recibe más órdenes de Dropshippers externos que las que genera por sí mismo." },
  { valor: "Mayoritariamente Supplier", definicion: "Genera más órdenes propias que las que recibe de Dropshippers externos." },
  { valor: "Marcas Dropshippers", definicion: "Gestiona sus propias órdenes y además abre su catálogo al dropshipping." },
];

export default function EntendimientoNegocioPage() {
  return (
    <main style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <header style={{
          background: "var(--card)",
          borderBottom: "1px solid var(--border)",
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: 10,
        }}>
          <a href="/guias" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Guías</a>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, flex: "none",
              background: "var(--dropi-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
            }}>
              🧠
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                Entendimiento del Negocio
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Roles, comportamiento algorítmico y modelo de análisis del ecosistema Dropi — punto de partida conceptual antes de mirar data
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px" }}>

          <Callout tone="info">
            📌 <strong>Fuente:</strong> grounding técnico usado por el agente de Discovery de Marcas/Brands, consolidado aquí
            porque describe el ecosistema completo (Suppliers, Dropshippers, Marcas/Emprendedores) — no solo el portafolio de una célula.
            Para cifras y metas de referencia ver la guía <a href="/guias/metricas" style={{ color: "var(--dropi)", fontWeight: 600 }}>Métricas</a>.
          </Callout>

          <SectionTitle>Deuda técnica: Marca vs. Supplier</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Marcas/Emprendedores y Proveedores (Suppliers) conviven dentro del <strong>mismo rol técnico</strong> — no existe
            todavía un perfil separado para cada uno. Lo que los diferencia no es el rol técnico, sino el
            <strong> comportamiento de sus órdenes</strong>.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
              <strong style={{ fontSize: 14, color: "var(--fg)" }}>Supplier (Proveedor puro)</strong>
              <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, margin: "6px 0 0" }}>
                Actor del modelo de dropshipping. Pone su catálogo a disposición de Dropshippers. No genera órdenes propias
                hacia clientes finales — su negocio depende de que otros vendan su inventario.
              </p>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
              <strong style={{ fontSize: 14, color: "var(--fg)" }}>Marca / Emprendedor</strong>
              <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, margin: "6px 0 0" }}>
                Tiene su propio negocio y productos, y despacha directo a sus clientes finales. No depende del dropshipping
                para operar, aunque puede abrir su catálogo estratégicamente — ahí opera también como Proveedor sin dejar
                de ser Marca (comportamiento híbrido). "Marca" y "Emprendedor" se usan indistintamente en Dropi.
              </p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 12, lineHeight: 1.6 }}>
            Grounding técnico: <Code>orders.user_id</Code> = quien vende, <Code>orders.supplier_id</Code> = quien provee
            (si son iguales → operación propia/marca). <Code>users.role_id</Code>: Dropshipper(2) / Supplier(3) —
            excepción Argentina: 3=Dropshipper, 4=Supplier.
          </p>

          <SectionTitle>Comportamiento algorítmico</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Clasifica cómo se compone el volumen de un usuario, calculado <em>lifetime</em> sobre órdenes con
            <Code>status='ENTREGADO'</Code>. Cualquier valor que no esté en esta tabla debe reportarse como
            "no documentado" — nunca forzarlo a encajar en una categoría existente.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Valor</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Definición</th>
                </tr>
              </thead>
              <tbody>
                {comportamientos.map((c) => (
                  <tr key={c.valor} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", verticalAlign: "top" }}><Code>{c.valor}</Code></td>
                    <td style={{ padding: "10px", color: "var(--fg)", verticalAlign: "top" }}>{c.definicion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>Dos lentes de análisis</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
              <strong style={{ fontSize: 14, color: "var(--fg)" }}>Lente 1 — Portafolio comercial de Marcas</strong>
              <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, margin: "6px 0 0" }}>
                Cumplimiento y gestión comercial hacia la meta de 600.000 órdenes mensuales. Se conforma únicamente por
                usuarios con comercial asignado a los ID <Code>71445</Code> o <Code>21553</Code>. La comunidad Brands
                (ID 410) ya no es un camino alterno de entrada — solo el ID comercial define pertenencia.
              </p>
            </div>
            <div style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18 }}>
              <strong style={{ fontSize: 14, color: "var(--fg)" }}>Lente 2 — Ecosistema emprendedor completo</strong>
              <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, margin: "6px 0 0" }}>
                Visión holística: todo usuario con comportamiento de marca/emprendedor, esté o no gestionado comercialmente
                — incluye huérfanos (fuera de la unión de esos dos IDs comerciales) y emprendedores ocultos. La meta de
                600K es referencia de dirección, no el único criterio.
              </p>
            </div>
          </div>

          <SectionTitle>Funnel, Palancas y Loops</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Tres preguntas distintas, no intercambiables:
          </p>
          <ul style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.9, paddingLeft: 20 }}>
            <li><strong>Funnel</strong> — "¿dónde está la marca?". Estructura fija: Adquisición → Activación → Retención → Resurrección (Churn = sale del ciclo). La Expansión ocurre dentro de Retención, vía progresión de madurez.</li>
            <li><strong>Palancas de crecimiento</strong> — "¿dónde conviene empujar?". No están predefinidas: se descubren comparando volumen e impacto entre segmentos en cada análisis.</li>
            <li><strong>Growth Loops</strong> — "¿qué se repite solo?". Solo se confirman con evidencia de repetición en más de un periodo — un hallazgo puntual es hipótesis, no un loop.</li>
          </ul>

          <SectionTitle>Hallazgos de Discovery (encuesta activación mar–may 2026)</SectionTitle>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 8 }}>
            Insights a tratar como hipótesis a profundizar, no como certezas.
          </p>
          <ul style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.9, paddingLeft: 20 }}>
            <li>88,5% de los registros de marcas nunca generó una orden.</li>
            <li>Solo ~4,4% logró activación neta (3+ órdenes con recurrencia).</li>
            <li>El churn parece ser falla de activación, no de retención — la mediana de órdenes de una marca churneada es casi cero.</li>
            <li>Ninguna marca reportó haber activado usando Academy o soporte oficial — todas mencionaron ayuda de un contacto externo.</li>
            <li>Quienes activan entre días 8–14 generan volumen desproporcionado (ventana ampliada de 7 a 14 días).</li>
            <li>Churn acelerado por cohortes: 72 marcas salieron hace 6–12 meses → 106 hace 3–6 meses → 140 en los últimos 3 meses.</li>
          </ul>

          <Callout tone="pending">
            ⚠️ Estos hallazgos y esta clasificación describen el estado del negocio a la fecha de la fuente — antes de citarlos
            en un análisis, confirma con el equipo de Data que siguen vigentes.
          </Callout>

        </div>
      </div>
      <HubFooter />
    </main>
  );
}
