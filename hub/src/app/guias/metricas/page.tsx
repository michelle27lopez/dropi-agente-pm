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

const metricasClave = [
  { metrica: "Órdenes totales plataforma", valor: "1.798.254" },
  { metrica: "Órdenes rol Supplier", valor: "369.281 (~20,5% del total)" },
  { metrica: "Promedio mensual 2026 del vertical Marcas", valor: "no ha superado las 220.000 órdenes" },
  { metrica: "Meta del vertical Marcas", valor: "600.000 órdenes mensuales" },
];

const activacion = [
  { metrica: "TTFO (activación bruta)", promedio: "20 días", mediana: "11 días", meta: "7 días" },
  { metrica: "TTV (activación neta)", promedio: "24 días", mediana: "15 días", meta: "7 días" },
];

const churnMensual = [
  { mes: "Enero", retencion: "83,8%", churn: "16,2%" },
  { mes: "Febrero", retencion: "89,0%", churn: "11,0%" },
  { mes: "Marzo", retencion: "88,6%", churn: "11,4%" },
  { mes: "Abril", retencion: "86,1%", churn: "13,9%" },
  { mes: "Mayo", retencion: "88,3%", churn: "11,7%" },
  { mes: "Junio", retencion: "84,0%", churn: "16,0%" },
];

const madurez = [
  { nivel: "Iniciando", rango: "1–50", usuarios: "1.487u", avg: "13", necesita: "Acompañamiento y primeros casos de éxito — no funcionalidades avanzadas" },
  { nivel: "Creciendo", rango: "51–300", usuarios: "576u", avg: "135", necesita: "Apoyo para crecer — todavía no para escalar" },
  { nivel: "Consolidando", rango: "301–700", usuarios: "153u", avg: "444", necesita: "No busca crecer — busca no colapsar con el volumen que tiene" },
  { nivel: "Pre-Escalando", rango: "701–1.000", usuarios: "38u", avg: "827", necesita: "Confiabilidad y herramientas robustas — no acompañamiento" },
  { nivel: "Escalando", rango: "1.001+", usuarios: "87u", avg: "2.765", necesita: "Conversaciones de API, integraciones empresariales y acuerdos" },
];

export default function MetricasPage() {
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
              📊
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                Métricas
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Cifras y metas de referencia del ecosistema Dropi — activación, retención/churn y madurez operativa
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 780, margin: "0 auto", padding: "40px 24px" }}>

          <Callout tone="info">
            📌 <strong>Fuente:</strong> grounding técnico usado por el agente de Discovery de Marcas/Brands, consolidado aquí
            porque describe el ecosistema completo (Suppliers, Dropshippers, Marcas/Emprendedores) — no solo el portafolio de una célula.
            Antes de citar una cifra en un análisis, confirma que sigue vigente con el equipo de Data. Para el marco conceptual
            (roles, comportamiento algorítmico, funnel) ver la guía <a href="/guias/entendimiento-negocio" style={{ color: "var(--dropi)", fontWeight: 600 }}>Entendimiento del Negocio</a>.
          </Callout>

          <SectionTitle>Métricas clave</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <tbody>
                {metricasClave.map((m) => (
                  <tr key={m.metrica} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", color: "var(--fg)", fontWeight: 600 }}>{m.metrica}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{m.valor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>Activación — bruta vs. neta</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            <strong>TTFO (bruta):</strong> primera orden generada — superó la barrera inicial. <strong>TTV (neta):</strong> primera
            orden entregada con flujo completo — experimentó el valor real y predice retención. La brecha entre ambas es crítica.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Métrica</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Promedio 2026</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Mediana 2026</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Meta</th>
                </tr>
              </thead>
              <tbody>
                {activacion.map((a) => (
                  <tr key={a.metrica} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", color: "var(--fg)", fontWeight: 600 }}>{a.metrica}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{a.promedio}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{a.mediana}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{a.meta}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>Retención y Churn mensual 2026</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Mes</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Retención</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Churn</th>
                </tr>
              </thead>
              <tbody>
                {churnMensual.map((c) => (
                  <tr key={c.mes} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{c.mes}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{c.retencion}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{c.churn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Callout tone="pending">
            ⚠️ El churn de junio volvió al nivel de enero — señal de alerta activa. Churn se define solo a nivel mensual
            (estado "En riesgo"); el estado "Perdido" existe en la data pero aún no está incorporado a las métricas activas.
          </Callout>

          <SectionTitle>Clasificación de madurez operativa (jun 2026)</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Base: <strong>3.036 usuarios activos del ecosistema completo</strong> (Lente 2). Métrica: <Code>ordenes_mes_propias</Code> únicamente
            — nunca <Code>ordenes_creadas</Code> (propias + externas), que infla los niveles. El muro crítico es cruzar 300 propias/mes
            (entrada a Consolidando) — el 73% de "Creciendo" no lo ha cruzado.
          </p>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Nivel</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Rango propias/mes</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Usuarios</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Avg propias/u</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Qué necesita</th>
                </tr>
              </thead>
              <tbody>
                {madurez.map((m) => (
                  <tr key={m.nivel} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", color: "var(--fg)", fontWeight: 600 }}>{m.nivel}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{m.rango}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{m.usuarios}</td>
                    <td style={{ padding: "10px", color: "var(--fg)" }}>{m.avg}</td>
                    <td style={{ padding: "10px", color: "var(--muted)" }}>{m.necesita}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
            Dato clave: los 87 usuarios "Escalando" concentran ~55% de las propias del ecosistema — perder uno
            (avg 2.765 propias/u) equivale a activar ~213 usuarios "Iniciando" (avg 13 propias/u).
          </p>

        </div>
      </div>
      <HubFooter />
    </main>
  );
}
