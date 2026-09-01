// Página paraguas de BRA-002, renombrado "Onboarding" (antes "Activación
// Bruta · Onboarding TTFO") — no reemplaza ni mueve nada del detalle: arma
// la narrativa de negocio de un proyecto con dos frentes medibles de
// activación. El Frente 1 enlaza al contenido real que ya existe en
// /proyectos/onboarding-ttfo, sin modificar. El Frente 2 (Activación Neta /
// TTV) todavía no tiene página — queda como próximo.
// BRA-008 (Onboarding 2.0, Delivery) se eliminó de Darwin el 20-ago-2026 por
// quedar redundante con esta unificación — su fila no aportaba contenido
// propio (prototype_url y summary vacíos). BRA-009 (Seguimiento, Following)
// se reengancha directo a BRA-002 vía parent_project_id.

import Breadcrumb from "@/components/Breadcrumb";

export const metadata = { title: "Onboarding · Brands Success" };

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const RED = "#DC2626";
const AMBER = "#D97706";
const TEAL = "#0D9488";
const GREY = "#64748B";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const TEAL_BG = "#F0FDFA";
const GREY_BG = "#F1F5F9";
const RED_BG = "#FEF2F2";

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "20px 22px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

type EstadoExp = "Idea" | "Diseñado" | "Corriendo" | "Validado" | "Descartado";

const ESTADO_STYLE: Record<EstadoExp, { color: string; bg: string }> = {
  Idea: { color: GREY, bg: GREY_BG },
  Diseñado: { color: BLUE, bg: BLU_BG },
  Corriendo: { color: AMBER, bg: AMB_BG },
  Validado: { color: TEAL, bg: TEAL_BG },
  Descartado: { color: RED, bg: RED_BG },
};

type Frente = { nombre: string; estado: EstadoExp; resumen: string; href?: string };

const frentes: Frente[] = [
  {
    nombre: "Frente 1 — Activación Bruta (TTFO)",
    estado: "Corriendo",
    resumen: "Primera orden generada — el usuario superó la barrera inicial. Promedio 2026: 20 días, mediana 11 días, meta 7 días. Onboarding guiado (tour in-app) lanzado 10-jul-2026 para bajar la mediana.",
    href: "/proyectos/onboarding-ttfo",
  },
  {
    nombre: "Frente 2 — Activación Neta (TTV)",
    estado: "Idea",
    resumen: "Primera orden entregada con flujo completo — el indicador que sí predice retención. Promedio 2026: 24 días, mediana 15 días, meta 7 días. Todavía no tiene frente construido.",
  },
];

export default function OnboardingPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        <Breadcrumb items={[{ label: "Proyectos", href: "/proyectos" }, { label: "Onboarding" }]} />
      </div>

      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            Onboarding
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>
            Un solo proyecto, dos frentes medibles de activación: bruta (TTFO) y neta (TTV).
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        <div style={card}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11.5, fontWeight: 700, padding: "5px 11px", borderRadius: 999, color: AMBER, background: AMB_BG, whiteSpace: "nowrap" }}>
              Corriendo
            </span>
            <span style={{ fontSize: 11.5, color: "var(--muted)", fontWeight: 600, textAlign: "right" }}>Brands Success · Onboarding (BRA-002)</span>
          </div>
          <h3 style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.25, color: NAVY }}>Onboarding</h3>

          <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
            <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: RED, marginBottom: 2 }}>Problema</b>
            La brecha entre activación bruta y neta es crítica: una marca puede crear una orden (bruta) y nunca completarla (neta) — nunca experimenta el valor real de la plataforma. Reducir esa brecha es el objetivo del proyecto.
          </div>
          <div style={{ fontSize: 13, color: "#39415a", margin: "8px 0", lineHeight: 1.5 }}>
            <b style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: ".5px", color: TEAL, marginBottom: 2 }}>Solución</b>
            Medir y atacar la activación en dos frentes separados, cada uno con su propia meta de 7 días: primero la bruta (TTFO, ya corriendo), después la neta (TTV, próxima).
          </div>

          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase", color: "var(--muted)", marginTop: 16, marginBottom: 8 }}>
            🧭 Frentes del proyecto
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 4 }}>
            {frentes.map((f, i) => {
              const fest = ESTADO_STYLE[f.estado];
              return (
                <div key={i} style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6, marginBottom: 5 }}>
                    <div style={{ fontSize: 12.5, fontWeight: 800, color: NAVY }}>{f.nombre}</div>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999, color: fest.color, background: fest.bg, whiteSpace: "nowrap" }}>{f.estado}</span>
                  </div>
                  <div style={{ fontSize: 11.5, color: "#39415a", lineHeight: 1.45 }}>{f.resumen}</div>
                  {f.href && (
                    <a
                      href={f.href}
                      style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, fontSize: 11, fontWeight: 700, color: TEAL, textDecoration: "none" }}
                    >
                      Ver detalle completo →
                    </a>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ fontSize: 10.5, color: "var(--muted)", fontStyle: "italic", marginTop: 12 }}>
            Jerarquía en Darwin: BRA-002 (Onboarding — esta página) → BRA-009 (Seguimiento, Following). Esta página solo agrupa la narrativa de negocio; el detalle de cada frente vive donde ya vivía.
          </div>
        </div>

        <div style={{ marginTop: 30, padding: "12px 0", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
          Uso interno Célula Brands Success
        </div>
      </div>
    </main>
  );
}
