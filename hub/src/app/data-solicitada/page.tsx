const DOCS = [
  {
    href: "/solicitud-data-campana-cyber-2026.html",
    icon: "🛍️",
    title: "Campaña Cyber Days 2026",
    code: "DCA",
    description: "Variables de rendimiento de campañas: órdenes, GMV, conversión por categoría y supplier.",
    color: "#F77F00",
    colorBg: "#FFF8F0",
    date: "Jun 2026",
  },
  {
    href: "/solicitud-data-caza-productos.html",
    icon: "🔍",
    title: "Caza Productos · CAZ-001",
    code: "CAZ-001",
    description: "Solicitudes de productos no encontrados, tasa de atención de suppliers, señales de demanda.",
    color: "#EC4899",
    colorBg: "#FDF2F8",
    date: "Jun 2026",
  },
  {
    href: "/solicitud-data-indicadores.html",
    icon: "📈",
    title: "Indicadores de Proveedores · IND-001",
    code: "IND-001",
    description: "Panel de desempeño: postulaciones, activaciones, nivel A/B/C, métricas de adopción.",
    color: "#6366F1",
    colorBg: "#EEF2FF",
    date: "Jun 2026",
  },
  {
    href: "/solicitud-data-negociaciones.html",
    icon: "🤝",
    title: "Negociaciones Supplier–LC · NEG-001",
    code: "NEG-001",
    description: "Adopción de negociaciones, órdenes generadas, comunidades activas, métricas del piloto.",
    color: "#059669",
    colorBg: "#F0FDF4",
    date: "Jun 2026",
  },
];

export default function DataSolicitadaPage() {
  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>← Dropi PM Tools</a>
          <span style={{ color: "var(--border)" }}>/</span>
          <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Data Solicitada</span>
        </div>
      </header>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "40px 24px 60px" }}>

        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "var(--fg)", marginBottom: 8 }}>
            Data Solicitada · Miguel / BI
          </h1>
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            Documentos de solicitud de extracción de datos enviados al equipo de BI.
            Abrí el que necesitás, copiá al Word y envialo.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))", gap: 16 }}>
          {DOCS.map((doc) => (
            <a
              key={doc.href}
              href={doc.href}
              target="_blank"
              rel="noreferrer"
              style={{
                background: "#fff", border: "1px solid var(--border)",
                borderRadius: 14, padding: "20px 22px",
                textDecoration: "none", display: "block",
                transition: "box-shadow 0.15s, transform 0.1s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.07)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "none";
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: doc.colorBg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 22, flexShrink: 0,
                }}>
                  {doc.icon}
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700,
                    color: doc.color, background: doc.colorBg,
                    border: `1px solid ${doc.color}30`,
                    padding: "2px 8px", borderRadius: 99,
                  }}>{doc.code}</span>
                  <span style={{
                    fontSize: 10, fontWeight: 600,
                    color: "var(--muted)", background: "var(--bg)",
                    border: "1px solid var(--border)",
                    padding: "2px 8px", borderRadius: 99,
                  }}>{doc.date}</span>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
                {doc.title}
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.55, marginBottom: 16 }}>
                {doc.description}
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: doc.color }}>
                Abrir documento ↗
              </div>
            </a>
          ))}
        </div>

        <div style={{
          marginTop: 40, background: "#F8FAFC", border: "1px solid var(--border)",
          borderRadius: 12, padding: "16px 20px",
          fontSize: 12, color: "var(--muted)", lineHeight: 1.6,
        }}>
          <strong style={{ color: "var(--fg)" }}>Cómo usarlo:</strong> Abrí el documento → Ctrl+A → Ctrl+C → pegalo en Word → envialo a Miguel.
          Cada documento incluye el contexto del proyecto, las variables específicas que se necesitan y el formato esperado.
        </div>

      </div>
    </main>
  );
}
