// Apartado de Entrevistas — centraliza entrevistas cualitativas a Marcas /
// Emprendedores (dolores, insights, oportunidades de retención, BAU
// Competitivo, BAU Operativo) y las cruza con dim_marcas.csv / fact_marcas.csv
// para mostrar identidad, comercial asignado, pertenencia a portafolio y
// serie de órdenes 2026. Mismo patrón self-contained que
// proyectos/marcas/experimentos (sin dependencias externas de _lib/_components).
//
// Mantenimiento: curado manual. Cuando llegue una entrevista nueva desde
// agente-delivery/Documentos/Entrevistas/, se procesa el .docx, se cruza con
// dim_marcas.csv / fact_marcas.csv y se agrega una entrada en data.ts.
import { entrevistas, patronesTransversales, type Entrevista, type OrdenMensual } from "./data";

export const metadata = { title: "Entrevistas · Brands Success" };

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const RED = "#DC2626";
const AMBER = "#D97706";
const TEAL = "#0D9488";
const GREEN = "#059669";
const GREY = "#64748B";
const RED_BG = "#FEF2F2";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const TEAL_BG = "#F0FDFA";
const GREEN_BG = "#ECFDF5";
const GREY_BG = "#F1F5F9";

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "20px 22px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const sectionLabel = (color: string): React.CSSProperties => ({
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color,
  marginTop: 16,
  marginBottom: 8,
});

function formatPeriodo(periodo: string): string {
  const [anio, mes] = periodo.split("-");
  const meses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  const idx = parseInt(mes, 10) - 1;
  return `${meses[idx] ?? mes} ${anio}`;
}

function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        padding: "4px 10px",
        borderRadius: 999,
        color,
        background: bg,
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}

function PortafolioBadge({ entrevista }: { entrevista: Entrevista }) {
  const { enPortafolioMarcas } = entrevista.contacto;
  if (enPortafolioMarcas === true) return <Badge label="✓ Portafolio Marcas (L1)" color={GREEN} bg={GREEN_BG} />;
  if (enPortafolioMarcas === false) return <Badge label="Fuera de portafolio" color={GREY} bg={GREY_BG} />;
  return <Badge label="⚠ Cuenta no identificada" color={AMBER} bg={AMB_BG} />;
}

function ListSection({ title, color, bg, borderColor, items }: { title: string; color: string; bg: string; borderColor: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <>
      <div style={sectionLabel(color)}>{title}</div>
      <div style={{ display: "grid", gap: 6 }}>
        {items.map((item, i) => (
          <div key={i} style={{ background: bg, border: `1px solid ${borderColor}`, borderRadius: 8, padding: "8px 11px", fontSize: 12.5, lineHeight: 1.5, color: "#39415a" }}>
            {item}
          </div>
        ))}
      </div>
    </>
  );
}

function OrdenesTable({ ordenes, pico, tendencia }: { ordenes: OrdenMensual[]; pico: { periodo: string; propias: number } | null; tendencia: string }) {
  if (!ordenes.length) {
    return (
      <>
        <div style={sectionLabel(GREY)}>📊 Órdenes 2026 (propias vs. externas)</div>
        <div style={{ fontSize: 12.5, color: "var(--muted)", fontStyle: "italic" }}>{tendencia}</div>
      </>
    );
  }
  return (
    <>
      <div style={sectionLabel(GREY)}>📊 Órdenes 2026 (propias vs. externas)</div>
      <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 8 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1.6fr",
            background: "var(--bg)",
            borderBottom: "1px solid var(--border)",
            padding: "6px 10px",
            fontSize: 9,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: ".06em",
            color: "var(--muted)",
            gap: 6,
          }}
        >
          <div>Mes</div>
          <div>Propias</div>
          <div>Externas</div>
          <div>tipo_activo_churn</div>
        </div>
        {ordenes.map((o, i) => (
          <div
            key={o.periodo}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1.6fr",
              padding: "7px 10px",
              gap: 6,
              fontSize: 12,
              color: "var(--fg)",
              borderBottom: i < ordenes.length - 1 ? "1px solid var(--border)" : "none",
              background: o.propias === 0 ? RED_BG : "transparent",
            }}
          >
            <div style={{ fontWeight: 700, color: NAVY }}>{formatPeriodo(o.periodo)}</div>
            <div>{o.propias.toLocaleString("es-CO")}</div>
            <div>{o.externas.toLocaleString("es-CO")}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {o.tipoActivoChurn}
              {o.noDocumentado && <Badge label="no documentado" color={AMBER} bg={AMB_BG} />}
            </div>
          </div>
        ))}
      </div>
      {pico && (
        <div style={{ fontSize: 12.5, color: "#39415a", marginBottom: 4 }}>
          <b>Pico histórico:</b> {formatPeriodo(pico.periodo)} — {pico.propias.toLocaleString("es-CO")} órdenes propias.
        </div>
      )}
      <div style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
        <b>Tendencia:</b> {tendencia}
      </div>
    </>
  );
}

function EntrevistaCard({ e }: { e: Entrevista }) {
  const c = e.contacto;
  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10, marginBottom: 8, flexWrap: "wrap" }}>
        <div>
          <h3 style={{ margin: "0 0 3px", fontSize: 16, lineHeight: 1.25, color: NAVY }}>{e.entrevistado}</h3>
          <div style={{ fontSize: 12.5, color: "var(--muted)" }}>
            {e.marca} · {e.fechaEntrevista}
          </div>
        </div>
        <PortafolioBadge entrevista={e} />
      </div>

      <div style={{ fontSize: 12.5, color: "#39415a", margin: "8px 0", lineHeight: 1.5, fontStyle: "italic" }}>{e.perfilOperativo}</div>

      {/* Contacto / identidad */}
      <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8, padding: "10px 12px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 12 }}>
        <div><b style={{ color: "var(--muted)" }}>ID:</b> {c.userId ?? "no identificado"}</div>
        <div><b style={{ color: "var(--muted)" }}>Comercial:</b> {c.comercialId ?? "sin asignar"}</div>
        <div><b style={{ color: "var(--muted)" }}>Correo:</b> {c.email ?? "no mencionado"}</div>
        <div><b style={{ color: "var(--muted)" }}>Teléfono:</b> {c.telefono ?? "no mencionado"}</div>
        <div><b style={{ color: "var(--muted)" }}>Categoría:</b> {c.categoriaComportamiento ?? "—"}</div>
        <div><b style={{ color: "var(--muted)" }}>Comportamiento algorítmico:</b> {c.comportamientoAlgoritmico ?? "—"}</div>
        {c.comunidad && (
          <div style={{ gridColumn: "1 / -1" }}><b style={{ color: "var(--muted)" }}>Comunidad:</b> {c.comunidad}</div>
        )}
      </div>
      {c.nota && (
        <div style={{ background: AMB_BG, border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 11px", fontSize: 11.5, color: "#78350F", lineHeight: 1.5, marginTop: 8 }}>
          ⚠ {c.nota}
        </div>
      )}

      <ListSection title="🔴 Dolores" color={RED} bg={RED_BG} borderColor="#FECACA" items={e.dolores} />
      <ListSection title="💡 Insights" color={BLUE} bg={BLU_BG} borderColor="#BFDBFE" items={e.insights} />
      <ListSection title="🌱 Oportunidades de retención" color={TEAL} bg={TEAL_BG} borderColor="#99F6E4" items={e.oportunidadesRetencion} />

      <div style={sectionLabel(AMBER)}>⚔️ BAU Competitivo</div>
      <div style={{ background: AMB_BG, border: "1px solid #FDE68A", borderRadius: 8, padding: "9px 12px", fontSize: 12.5, color: "#78350F", lineHeight: 1.55 }}>
        {e.bauCompetitivo}
      </div>

      <ListSection title="⚙️ BAU Operativo" color={GREY} bg={GREY_BG} borderColor="var(--border)" items={e.bauOperativo} />

      <OrdenesTable ordenes={e.ordenes2026} pico={e.picoHistorico} tendencia={e.tendencia} />

      <div style={{ fontSize: 10.5, color: "var(--muted)", marginTop: 14, borderTop: "1px solid var(--border)", paddingTop: 8 }}>
        Fuente: agente-delivery/Documentos/Entrevistas/{e.archivoFuente}
      </div>
    </div>
  );
}

export default function EntrevistasPage() {
  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        <a href="/proyectos/marcas" style={{ fontSize: 13, color: "var(--muted)", textDecoration: "none" }}>
          ← Marcas
        </a>
      </div>

      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            Entrevistas
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5 }}>
            Centraliza entrevistas cualitativas a Marcas/Emprendedores: dolores, insights, oportunidades de retención, BAU Competitivo y BAU Operativo — cruzado con dim_marcas.csv / fact_marcas.csv.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        {/* NOTA: tipo_activo_churn tiene 8 estados (tabla ampliada 2026-07-17), no los 6 del CLAUDE.md raíz */}
        <div style={{ background: AMB_BG, border: "1px solid #FDE68A", borderRadius: 10, padding: "14px 16px", fontSize: 12.5, color: "#78350F", lineHeight: 1.6, marginBottom: 20 }}>
          <strong>Nota sobre tipo_activo_churn:</strong> las tablas de abajo usan la tabla ampliada de 8 estados confirmada por Kate el 2026-07-17 (Nuevo activado, Inactivo/Pre-Activación, Antiguo activado, Recurrente, <b>Fiel</b>, Reactivado, En Riesgo, Perdido) — no la tabla de 6 estados que sigue en el CLAUDE.md raíz del proyecto. <b>&quot;Fiel&quot;</b> e <b>&quot;Inactivo / Pre-Activación&quot;</b> SÍ son estados válidos y documentados bajo esa tabla ampliada. En producción, la columna trae abreviado <b>&quot;Nuevo&quot;</b> (= Nuevo activado) y <b>&quot;Activo Viejo&quot;</b> (= Antiguo activado) — la equivalencia es razonable pero sigue{" "}
          <b>sin confirmación textual explícita de Kate</b>, por eso se marcan &quot;no documentado&quot; en la tabla mientras eso no se cierre.
        </div>

        {/* PATRONES TRANSVERSALES */}
        <div style={{ ...card, marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 16, color: NAVY }}>Patrones transversales</h2>
          <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 12, lineHeight: 1.5 }}>
            Hipótesis a seguir observando — repetición entre entrevistas independientes, no confirmación de un growth loop (eso requiere ver el patrón repetirse en más de un periodo de tiempo).
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {patronesTransversales.map((p, i) => (
              <div key={i} style={{ background: BLU_BG, border: "1px solid #BFDBFE", borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 3 }}>
                  {p.tema} <span style={{ color: BLUE }}>({p.entrevistas.length}/8)</span>
                </div>
                <div style={{ fontSize: 11.5, color: "#1E3A5F", lineHeight: 1.5 }}>{p.nota}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {entrevistas.map((e) => (
            <EntrevistaCard key={e.id} e={e} />
          ))}
        </div>

        <div style={{ marginTop: 30, padding: "12px 0", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted)", textAlign: "center", lineHeight: 1.6 }}>
          Fuente: agente-delivery/Documentos/Entrevistas/ · cruce con dim_marcas.csv / fact_marcas.csv (corte 28-jul-2026) · Análisis agente Data_Brands · Uso interno Célula Brands Success
        </div>
      </div>
    </main>
  );
}
