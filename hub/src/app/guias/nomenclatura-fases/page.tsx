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

const niveles = [
  {
    n: 1,
    label: "Proyecto",
    vive: "Etiqueta (Label) de Jira",
    detalle: "Se pone la misma etiqueta en todos los Epics de sus distintas fases. Formato: proy- + nombre en minúsculas sin tildes, separado por guiones.",
    ejemplo: "proy-dinamicas-catalogo",
  },
  {
    n: 2,
    label: "Fase (Estado)",
    vive: "Un Epic de Jira nuevo por cada fase",
    detalle: "Al pasar de fase se crea un Epic nuevo (no se renombra el anterior), con la misma etiqueta de proyecto. El campo \"Creado\" del Epic en Jira ya da la fecha de entrada a esa fase, sin necesitar tracking manual aparte.",
    ejemplo: "[DISCOVERY] Dinámicas de catálogo  →  [DELIVERY] Dinámicas de catálogo",
  },
  {
    n: 3,
    label: "Subestado",
    vive: "El título de cada tarea dentro del Epic",
    detalle: "Se usa el subestado más específico que se conozca. Si todavía no está claro, se deja el nombre del Estado — es válido, no un error.",
    ejemplo: "[EXPERIMENTACIÓN] Campañas: Fase 2 mvp — Desplegar",
  },
];

const estados = [
  { epica: "Discovery", estado: "DISCOVERY", subestados: ["Research", "Ideación", "Experimentación"], nota: "Experimentación puede caer en Dependencia (bloqueo, no es una fase)." },
  { epica: "Discovery", estado: "POC", subestados: ["Seguimiento"], nota: "Opcional — no todo proyecto pasa por POC." },
  { epica: "Delivery", estado: "DELIVERY", subestados: ["En Definición", "En Priorización", "Pendiente Hand Off", "En Dev"], nota: "En Definición requiere E2E Completar + Documentación RPP. En Dev requiere QA (no siempre aplica) — puede caer en Errores por ajustar." },
  { epica: "Operación Product", estado: "FOLLOWING", subestados: ["Beta", "Producción"], nota: "Ambos pueden caer en Errores por ajustar." },
];

export default function NomenclaturaFasesPage() {
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
              🧭
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                Nomenclatura de fases de proyecto
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Cómo se nombran proyectos, fases y subfases en Jira — borrador para revisar con Laura Contreras
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>

          <Callout tone="pending">
            ⚠️ <strong>Borrador, no adoptado todavía.</strong> Esta página documenta la convención tal como quedó definida en conversación
            el 2026-07-28 (Michelle + Claude), para revisarla con Laura Contreras antes de que el equipo empiece a aplicarla.
            No asumir que ya está en uso en los Epics reales.
          </Callout>

          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Hoy no hay forma de saber, mirando Jira, en qué fase está un proyecto ni cuánto tiempo lleva ahí — esa información
            vive solo en la cabeza del equipo. Esta nomenclatura resuelve eso reutilizando campos que Jira ya tiene
            (Epic, Etiquetas, título de tarea), sin construir tracking manual nuevo.
          </p>

          <SectionTitle>Los 3 niveles</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {niveles.map((nv) => (
              <div key={nv.n} style={{
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 18,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                  <span style={{
                    width: 22, height: 22, borderRadius: "50%", background: "var(--dropi)", color: "#fff",
                    fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flex: "none",
                  }}>
                    {nv.n}
                  </span>
                  <strong style={{ fontSize: 14, color: "var(--fg)" }}>{nv.label}</strong>
                  <span style={{ fontSize: 12, color: "var(--muted)" }}>— {nv.vive}</span>
                </div>
                <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, margin: "0 0 8px" }}>{nv.detalle}</p>
                <Code>{nv.ejemplo}</Code>
              </div>
            ))}
          </div>

          <SectionTitle>Un 4° nivel: entregables (no son subestados)</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            E2E Completar, Documentación RPP y QA son checklist/gates dentro de un subestado, no fases nuevas.
            QA en particular no siempre aplica — depende del proyecto.
          </p>

          <SectionTitle>Épica → Estado → Subestado</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ textAlign: "left", borderBottom: "1px solid var(--border)" }}>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Épica (categoría)</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Estado</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Subestados</th>
                  <th style={{ padding: "8px 10px", color: "var(--muted)", fontWeight: 600 }}>Nota</th>
                </tr>
              </thead>
              <tbody>
                {estados.map((e, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "10px", color: "var(--fg)", verticalAlign: "top" }}>{e.epica}</td>
                    <td style={{ padding: "10px", verticalAlign: "top" }}><Code>{e.estado}</Code></td>
                    <td style={{ padding: "10px", color: "var(--fg)", verticalAlign: "top" }}>{e.subestados.join(" · ")}</td>
                    <td style={{ padding: "10px", color: "var(--muted)", verticalAlign: "top" }}>{e.nota}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>Ejemplos reales (sprint activo)</SectionTitle>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <Code>PROD-1609 — [PRODUCTO][EXPERIMENTACIÓN] Campañas: Fase 2 mvp - Desplegar</Code>
            <Code>PROD-1684 — [PRODUCTO][DEFINICIÓN] Dropi pulso - MVP</Code>
            <Code>PROD-1496 — [PRODUCTO][DISCOVERY] Time to value: Montaje de WA escucha en grupos</Code>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 8, lineHeight: 1.6 }}>
            PROD-1496 usa <Code>[DISCOVERY]</Code> (el Estado) en vez de un subestado específico — válido cuando el subestado exacto
            todavía no está definido.
          </p>

          <SectionTitle>¿Puede un proyecto retroceder de fase?</SectionTitle>
          <p style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.7 }}>
            Es raro, pero puede pasar (ej. de Delivery vuelve a Discovery por un hallazgo o una dependencia). Se modela igual
            que un avance: se crea un Epic nuevo con el Estado anterior, con la misma etiqueta de proyecto.
          </p>

          <SectionTitle>Pendiente de resolver con el equipo</SectionTitle>
          <ul style={{ fontSize: 14, color: "var(--fg)", lineHeight: 1.9, paddingLeft: 20 }}>
            <li>Que el equipo empiece a aplicar la etiqueta <Code>proy-*</Code> de forma consistente al crear Epics — hoy no existe en los Epics reales.</li>
            <li>Validación formal de Laura Contreras y el resto de la célula antes de tratarla como regla oficial.</li>
            <li>Quién es responsable de crear el Epic de la siguiente fase quien cierra la fase anterior (¿PM, PD, ambos?).</li>
          </ul>

        </div>
      </div>
      <HubFooter />
    </main>
  );
}
