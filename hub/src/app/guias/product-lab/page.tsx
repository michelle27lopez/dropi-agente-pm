import HubFooter from "@/components/HubFooter";

// Índice de sesiones de Product Lab 2.0. Cada tarjeta es un puntero: título,
// fecha, facilitador/a y 2-3 bullets — el detalle real vive en el Dropi Brain
// (Confluence). Se agrega una tarjeta nueva cada vez que se documenta una sesión.

const WIKI = "https://dropi-it.atlassian.net/wiki/spaces/PD/pages";

type Link = { label: string; href: string };
type Sesion = {
  fecha: string;
  titulo: string;
  facilitador?: string;
  bullets: string[];
  links: Link[];
};

const SESIONES: Sesion[] = [
  {
    fecha: "28 ago 2026",
    titulo: "El nuevo arte de lanzar productos en Dropi",
    facilitador: "Catherin Salazar (con Diana Aldana)",
    bullets: [
      "Taller del framework TARS: Target → Adopción → Retención → Satisfacción, la forma en que Product Marketing mide cada lanzamiento (etapa Impact).",
      "Público objetivo (principales / adyacentes / no adyacentes), funcionalidad ofensiva vs. defensiva, tiers de lanzamiento (0–3) y gobernanza del comité TARS.",
      "Quedó abierto: fórmula para consolidar CSAT/CES en %, umbral de “buena” puntuación (>50%) y el límite entre beta/prueba y un lanzamiento segmentado en producción (caso migración de Marcas, 29 sep).",
    ],
    links: [
      { label: "Marco Común §4.7", href: `${WIKI}/1484292098` },
      { label: "Glosario §13", href: `${WIKI}/1508278274` },
    ],
  },
  {
    fecha: "31 jul 2026",
    titulo: "Hablemos de células",
    facilitador: "María Ossa",
    bullets: [
      "Aterrizó el ownership de plataforma a nivel de submódulo, siguiendo la nueva rearquitectura de Dropi.",
      "Confirmó, matizó o amplió quién es dueño de cada módulo: Productos, Bodegas, Financiero, CAS, Marketing, Academy, Configuraciones, Home.",
      "Duda abierta: si el split CAS (Backoffice) / transportadora (Logistic Success) genera fricción operativa.",
    ],
    links: [{ label: "Marco Común §2.8.1", href: `${WIKI}/1484292098` }],
  },
  {
    fecha: "24 jul 2026",
    titulo: "Continuemos hablando de órdenes (P5)",
    facilitador: "María Ossa",
    bullets: [
      "Marco “antes / después de la orden”: por qué la activación de Dropi depende de una venta que la plataforma no ve.",
      "Rediseño del módulo de órdenes: Vista Card, alarmas contextuales, cierre de mes del dropshipper.",
      "Cerró el gap del % de órdenes de productos privados: 45%.",
    ],
    links: [
      { label: "Órdenes", href: `${WIKI}/1522761734` },
      { label: "Productos", href: `${WIKI}/1530593283` },
      { label: "Glosario §12", href: `${WIKI}/1508278274` },
    ],
  },
  {
    fecha: "17 jul 2026",
    titulo: "Conoce el detrás de Logistic Success",
    facilitador: "Equipo de Logistic Success",
    bullets: [
      "La operación logística en sí: tramos, estrategia de transportadoras, cross docking, manifiestos, StockPro.",
      "Se decidió separar Órdenes (el objeto orden) de Logística (la operación física y la estrategia).",
      "Conciliación del dato de tiempos de pago con Financiero: 7–15 días.",
    ],
    links: [
      { label: "Logística", href: `${WIKI}/1531379716` },
      { label: "Glosario §11", href: `${WIKI}/1508278274` },
    ],
  },
  {
    fecha: "3 y 10 jul 2026",
    titulo: "Hablemos de órdenes (P3 y P4)",
    bullets: [
      "Estados y flujo de la orden: los tres componentes de cada estado (tipo, fecha de cambio, responsable).",
      "Ejemplo real recorrido estado por estado.",
    ],
    links: [
      { label: "Órdenes", href: `${WIKI}/1522761734` },
      { label: "Glosario §10", href: `${WIKI}/1508278274` },
    ],
  },
  {
    fecha: "19 jun 2026",
    titulo: "Product Lab 2.0 — sesión fundacional",
    bullets: [
      "Cadena de valor y reglas comerciales del ecosistema.",
      "Alimentó las páginas de módulo del Dropi Brain: Home, Dashboard, Reportes, Financiero, Marketing, CAS/Posventa, Academy, Configuraciones.",
    ],
    links: [{ label: "Glosario §9", href: `${WIKI}/1508278274` }],
  },
];

export default function GuiaProductLabPage() {
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
              🧪
            </div>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", lineHeight: 1.2 }}>
                Product Lab
              </h1>
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>
                Índice de sesiones de Product Lab 2.0 — el detalle completo vive en el Dropi Brain (Confluence)
              </p>
            </div>
          </div>
        </header>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <div style={{
            background: "var(--dropi-light)", border: "1px solid var(--dropi)", borderRadius: 10,
            padding: "12px 16px", fontSize: 13, color: "var(--fg)", lineHeight: 1.6, marginBottom: 24,
          }}>
            Cada sesión de Product Lab se transcribe y se documenta en el Dropi Brain de Confluence.
            Esta página es solo el índice de punteros — la fuente única de cada tema está en el{" "}
            <a href={`${WIKI}/1531412483`} target="_blank" rel="noreferrer" style={{ color: "var(--dropi)" }}>
              Mapa de fuente única
            </a>.
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {SESIONES.map((s, i) => (
              <div key={i} style={{
                background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 20,
              }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, flexWrap: "wrap" }}>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "var(--dropi)",
                    background: "var(--dropi-light)", padding: "3px 8px", borderRadius: 999,
                  }}>
                    {s.fecha}
                  </span>
                  <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)", margin: 0 }}>{s.titulo}</h2>
                </div>
                {s.facilitador && (
                  <p style={{ fontSize: 12, color: "var(--muted)", margin: "6px 0 0" }}>
                    Facilitó: {s.facilitador}
                  </p>
                )}
                <ul style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.6, paddingLeft: 18, margin: "10px 0 0" }}>
                  {s.bullets.map((b, j) => <li key={j} style={{ marginBottom: 4 }}>{b}</li>)}
                </ul>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                  {s.links.map((l, j) => (
                    <a key={j} href={l.href} target="_blank" rel="noreferrer" style={{
                      fontSize: 12, fontWeight: 600, color: "var(--dropi)", textDecoration: "none",
                      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 10px",
                    }}>
                      {l.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
