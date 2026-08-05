"use client";

import { useEffect, useState } from "react";
import { TTV_FASE_1, TTV_FASE_2, TTV_COMPARACION } from "@/lib/ttv-fases-data";

// ─── Types ───────────────────────────────────────────────────────────────────
type Stats = {
  totalSuppliers: number;
  avgSessions: number;
  activeRate: number;
  churnRate: number;
  dormantCount: number;
  churnedCount: number;
};

type FunnelStep = { step: string; count: number; pct: number; color: string };
type CountryItem = { name: string; value: number };
type ChurnTier = {
  key: string; name: string; range: string;
  count: number; percentage: number;
  avgSessions: number; avgLifespan: number;
  action: string; color: string;
};
type ActivationCohort = {
  key: string; name: string; description: string;
  count: number; percentage: number; color: string;
};

type BehaviorData = {
  source: string;
  stats: Stats;
  funnel: FunnelStep[];
  countries: CountryItem[];
  churnTiers: ChurnTier[];
  activationCohorts: ActivationCohort[];
};

const MAIN_MARKETS = ["Colombia", "Mexico", "México", "Ecuador"];

type CountryFilter = "ALL" | "CO" | "MX" | "EC";

const COUNTRY_LABELS: Record<CountryFilter, string> = {
  ALL: "Todos los países",
  CO: "Colombia",
  MX: "México",
  EC: "Ecuador",
};

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
  fontSize: 13, color: "var(--muted)", lineHeight: 1.4,
};
const tag = (color: string, bg: string): React.CSSProperties => ({
  display: "inline-flex", alignItems: "center", borderRadius: 999,
  padding: "3px 9px", fontSize: 11, fontWeight: 700,
  color, background: bg, whiteSpace: "nowrap",
});
const thStyle: React.CSSProperties = {
  color: "var(--muted)", background: "#FAFBFC",
  fontSize: 11, textTransform: "uppercase",
  letterSpacing: "0.06em", fontWeight: 700,
  padding: "10px 12px", borderBottom: "1px solid var(--border)",
  textAlign: "left", whiteSpace: "nowrap",
};
const tdStyle: React.CSSProperties = {
  padding: "10px 12px", borderBottom: "1px solid var(--border)",
  fontSize: 13, verticalAlign: "middle",
};
const tdR: React.CSSProperties = { ...tdStyle, textAlign: "right" };
const thR: React.CSSProperties = { ...thStyle, textAlign: "right" };

// ─── KpiCard ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, barColor = "var(--dropi)", barWidth = "100%", note }: {
  label: string; value: string; sub: string;
  barColor?: string; barWidth?: string; note?: string;
}) {
  return (
    <div style={card}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 6, lineHeight: 1.4 }}>{sub}</div>
      {note && (
        <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4, fontStyle: "italic" }}>{note}</div>
      )}
      <div style={{ marginTop: 12, height: 5, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
        <div style={{ height: "100%", width: barWidth, background: barColor, borderRadius: 999, transition: "width 0.4s" }} />
      </div>
    </div>
  );
}

// ─── FunnelBar ───────────────────────────────────────────────────────────────
function FunnelBar({ steps, total }: { steps: FunnelStep[]; total: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {steps.map((s, i) => {
        const width = total > 0 ? `${s.pct}%` : "0%";
        const dropPct = i > 0 ? steps[i - 1].pct - s.pct : 0;
        return (
          <div key={s.step}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{s.step}</span>
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                {dropPct > 0 && (
                  <span style={{ fontSize: 11, color: "#EF4444", fontWeight: 600 }}>
                    −{dropPct}pp
                  </span>
                )}
                <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>
                  {s.count.toLocaleString("es-CO")}
                </span>
                <span style={{ fontSize: 12, color: "var(--muted)", minWidth: 40, textAlign: "right" }}>
                  {s.pct}%
                </span>
              </div>
            </div>
            <div style={{ height: 10, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
              <div style={{
                height: "100%", width, background: s.color,
                borderRadius: 999, transition: "width 0.5s ease",
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AsisTtvPage() {
  const [data, setData] = useState<BehaviorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<CountryFilter>("ALL");
  const [showOutsiders, setShowOutsiders] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/metrics/behavior?country=${country}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, [country]);

  // Países principales vs outsiders
  const mainCountries = data?.countries.filter(c =>
    MAIN_MARKETS.some(m => c.name.toLowerCase().includes(m.toLowerCase()))
  ) ?? [];
  const outsiderCountries = data?.countries.filter(c =>
    !MAIN_MARKETS.some(m => c.name.toLowerCase().includes(m.toLowerCase()))
  ) ?? [];
  const outsiderTotal = outsiderCountries.reduce((s, c) => s + c.value, 0);

  // KPIs ajustados sin outsiders
  const adjustedTotal = showOutsiders || country !== "ALL"
    ? data?.stats.totalSuppliers ?? 0
    : (data?.stats.totalSuppliers ?? 0) - outsiderTotal;

  const displayTotal = country !== "ALL" ? data?.stats.totalSuppliers ?? 0 : adjustedTotal;

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
        <span style={{ fontSize: 13, color: "var(--fg)", fontWeight: 600 }}>Diagnóstico AS-IS</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <span style={tag("var(--dropi)", "var(--dropi-light)")}>TTV-001</span>
          <span style={tag("#6366F1", "#EEF2FF")}>🔍 AS-IS</span>
          {data?.source === "mock" && (
            <span style={tag("#F59E0B", "#FFFBEB")}>⚠ Datos simulados</span>
          )}
        </div>
      </header>

      {/* Filtros */}
      <div style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "10px 32px", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap",
      }}>
        {/* Filtro país */}
        <div style={{ display: "flex", gap: 4 }}>
          {(["ALL", "CO", "MX", "EC"] as CountryFilter[]).map(c => (
            <button
              key={c}
              onClick={() => setCountry(c)}
              style={{
                padding: "6px 14px", borderRadius: 20, border: "1px solid var(--border)",
                fontSize: 12, fontWeight: 600, cursor: "pointer",
                background: country === c ? "var(--dropi)" : "#F8FAFC",
                color: country === c ? "#fff" : "var(--muted)",
                transition: "all 0.15s",
              }}
            >
              {c === "ALL" ? "Todos" : c}
            </button>
          ))}
        </div>

        {/* Toggle outsiders — solo visible en ALL */}
        {country === "ALL" && (
          <button
            onClick={() => setShowOutsiders(v => !v)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 20,
              border: `1px solid ${showOutsiders ? "var(--border)" : "#6366F1"}`,
              fontSize: 12, fontWeight: 600, cursor: "pointer",
              background: showOutsiders ? "#F8FAFC" : "#EEF2FF",
              color: showOutsiders ? "var(--muted)" : "#6366F1",
              transition: "all 0.15s",
            }}
          >
            <span>{showOutsiders ? "Con outsiders" : "Sin outsiders"}</span>
            {outsiderTotal > 0 && (
              <span style={{
                background: showOutsiders ? "#F3F4F6" : "#C7D2FE",
                color: showOutsiders ? "var(--muted)" : "#4338CA",
                borderRadius: 999, padding: "1px 7px", fontSize: 11,
              }}>
                {outsiderTotal.toLocaleString("es-CO")}
              </span>
            )}
          </button>
        )}

        <span style={{ fontSize: 12, color: "var(--muted)", marginLeft: "auto" }}>
          Fuente: UserPilot → Supabase (userpilot_suppliers)
        </span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px" }}>
        {loading && (
          <p style={{ color: "var(--muted)", fontSize: 14 }}>Cargando diagnóstico...</p>
        )}

        {!loading && data && (() => {
          const s = data.stats;

          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

              {/* Métricas por Fase */}
              <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={sectionTitle}>Métricas por fase</div>
                    <div style={sectionSub}>
                      De dónde partimos (línea base histórica) a qué medimos hoy (pipeline dedicado, mes a mes).
                    </div>
                  </div>
                  <a
                    href={TTV_FASE_2.metabaseUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      background: "var(--dropi)", color: "#fff", textDecoration: "none",
                      padding: "8px 14px", borderRadius: 8, fontSize: 12, fontWeight: 700,
                      whiteSpace: "nowrap",
                    }}
                  >
                    📊 Ver dashboard en vivo (Metabase)
                  </a>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  {/* Fase 1 */}
                  <div style={{ background: "#F8FAFC", border: "1px solid var(--border)", borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={tag("#6366F1", "#EEF2FF")}>Fase 1</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Levantamiento inicial</span>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 14 }}>
                      {TTV_FASE_1.periodo}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { l: "Registrados (total)", v: TTV_FASE_1.registradosLabel, sub: TTV_FASE_1.registradosSub },
                        { l: "Activados (≥1 orden, histórico)", v: TTV_FASE_1.activadosLabel, sub: TTV_FASE_1.activadosSub },
                        { l: "Tasa de activación", v: TTV_FASE_1.tasaActivacion, sub: null },
                        { l: "Churn (inactivos +15 días)", v: TTV_FASE_1.churn, sub: null },
                      ].map(m => (
                        <div key={m.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", borderBottom: "1px solid #E5E7EB" }}>
                          <span style={{ fontSize: 12, color: "var(--muted)" }}>{m.l}{m.sub ? <span style={{ display: "block", fontSize: 10, color: "var(--faint, #9CA3AF)" }}>{m.sub}</span> : null}</span>
                          <span style={{ fontSize: 15, fontWeight: 800, color: "var(--fg)" }}>{m.v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, color: "var(--muted)", fontStyle: "italic" }}>
                      Medición acumulada histórica — sin pipeline dedicado, sin corte mes a mes.
                    </div>
                  </div>

                  {/* Fase 2 */}
                  <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: 12, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <span style={tag("#10B981", "#D1FAE5")}>Fase 2</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)" }}>Pipeline CRM/GHL — medible mes a mes</span>
                    </div>
                    <div style={{ fontSize: 11, color: "#065F46", marginBottom: 14 }}>
                      {TTV_FASE_2.periodo}
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {[
                        { l: "Registrados (en el CRM)", v: TTV_FASE_2.registradosLabel },
                        { l: "Activación bruta (orden generada)", v: TTV_FASE_2.activacionBruta, sub: TTV_FASE_2.activacionBrutaSub },
                        { l: "Activación neta (orden entregada)", v: TTV_FASE_2.activacionNeta, sub: TTV_FASE_2.activacionNetaSub },
                        { l: "Generadas ÷ Entregadas (ratio)", v: TTV_FASE_2.ratioGeneradasEntregadas },
                        { l: "Días registro → orden entregada (prom., desde 30-jun-2026)", v: TTV_FASE_2.tiempoRegistroEntrega },
                        { l: "Brecha 41→18 (generada → entregada)", v: TTV_FASE_2.fuga },
                      ].map(m => (
                        <div key={m.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "6px 0", borderBottom: "1px solid #D1FAE5", gap: 12 }}>
                          <span style={{ fontSize: 12, color: "#065F46" }}>
                            {m.l}
                            {"sub" in m && m.sub ? <span style={{ display: "block", fontSize: 10, color: "#10B981" }}>{m.sub}</span> : null}
                          </span>
                          <span style={{ fontSize: 15, fontWeight: 800, color: "#059669", whiteSpace: "nowrap" }}>{m.v}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 10, fontSize: 11, color: "#065F46", fontStyle: "italic" }}>
                      Plan de choque Fast Track (10 llamadas manuales) no rindió como se esperaba — bajo interés
                      del proveedor, formulario de volumen declarado no confiable. Pivote decidido: agente de WA
                      que filtra por comportamiento real antes del contacto humano (arranca semana 04-ago).
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 14, padding: "12px 16px", background: "#EEF2FF", borderRadius: 10, border: "1px solid #C7D2FE", fontSize: 13, color: "#312E81", lineHeight: 1.6 }}>
                  <strong>Comparación en los mismos términos (orden entregada, sobre el total de registrados):</strong>
                  {" "}{TTV_COMPARACION.texto}
                </div>
                <div style={{ marginTop: 8, padding: "8px 14px", background: "#FFFBEB", borderRadius: 10, border: "1px solid #FDE68A", fontSize: 11, color: "#78350F", lineHeight: 1.5 }}>
                  <strong>Ojo con el universo:</strong> {TTV_COMPARACION.ojoUniverso}
                </div>
              </div>

              {/* KPIs principales */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px,1fr))", gap: 14 }}>
                <KpiCard
                  label="Total registrados"
                  value={displayTotal.toLocaleString("es-CO")}
                  sub={country === "ALL" && !showOutsiders
                    ? `Mercados principales CO/MX/EC (excl. ${outsiderTotal.toLocaleString("es-CO")} outsiders)`
                    : country !== "ALL" ? COUNTRY_LABELS[country] : "Todos los países registrados en UserPilot"}
                  barColor="#6366F1"
                />
                <KpiCard
                  label="Sesiones promedio"
                  value={String(s.avgSessions)}
                  sub="Sesiones web por supplier registrado"
                  note="Activación considerada: > 7 sesiones"
                  barColor="#3B82F6"
                  barWidth={`${Math.min(s.avgSessions * 10, 100)}%`}
                />
                <KpiCard
                  label="Tasa de activación"
                  value={`${s.activeRate}%`}
                  sub="Suppliers con al menos 1 orden generada"
                  barColor="#10B981"
                  barWidth={`${s.activeRate}%`}
                />
                <KpiCard
                  label="Churn (sin retorno)"
                  value={`${s.churnRate}%`}
                  sub={`${s.churnedCount.toLocaleString("es-CO")} suppliers — 15+ días inactivos`}
                  barColor="#EF4444"
                  barWidth={`${s.churnRate}%`}
                />
              </div>

              {/* Embudo de activación */}
              <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                  <div>
                    <div style={sectionTitle}>Embudo de activación</div>
                    <div style={sectionSub}>
                      De registro en UserPilot hasta bodega activa en Dropi.
                      Cada caída representa la fricción en esa etapa.
                    </div>
                  </div>
                  <span style={tag("#6366F1", "#EEF2FF")}>AS-IS</span>
                </div>
                <FunnelBar steps={data.funnel} total={s.totalSuppliers} />
                <div style={{
                  marginTop: 20, padding: "12px 16px", background: "#FFF8F0",
                  borderRadius: 10, border: "1px solid #FDE68A",
                  fontSize: 12, color: "#92400E", lineHeight: 1.5,
                }}>
                  <strong>Lectura:</strong> El 90.8% de los suppliers registrados nunca genera una orden.
                  El mayor cuello de botella está entre Registro → Catálogo (pocos publican productos)
                  y Catálogo → Primera Venta (pocos logran su primera orden).
                </div>
              </div>

              {/* Cohorts de sesión + Activación temprana */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

                {/* Cohortes de activación */}
                <div style={card}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={sectionTitle}>Comportamiento de activación</div>
                    <div style={sectionSub}>Clasificación por patrón de uso post-registro</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {data.activationCohorts.map(c => (
                      <div key={c.key} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 12px", borderRadius: 8, background: "#F8FAFC",
                        border: "1px solid var(--border)",
                      }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{c.name}</div>
                          <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 2 }}>{c.description}</div>
                        </div>
                        <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 12 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: c.color }}>{c.percentage}%</div>
                          <div style={{ fontSize: 11, color: "var(--muted)" }}>{c.count.toLocaleString("es-CO")}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Churn tiers */}
                <div style={card}>
                  <div style={{ marginBottom: 14 }}>
                    <div style={sectionTitle}>Estado de inactividad</div>
                    <div style={sectionSub}>Distribución por días desde última sesión</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {data.churnTiers.map(t => (
                      <div key={t.key} style={{
                        padding: "10px 12px", borderRadius: 8, background: "#F8FAFC",
                        border: "1px solid var(--border)",
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{t.name}</span>
                          <span style={{ fontSize: 17, fontWeight: 800, color: t.color }}>{t.percentage}%</span>
                        </div>
                        <div style={{ display: "flex", gap: 12, fontSize: 11, color: "var(--muted)" }}>
                          <span>{t.range}</span>
                          <span>·</span>
                          <span>{t.count.toLocaleString("es-CO")} suppliers</span>
                          <span>·</span>
                          <span>Prom. {t.avgSessions} sesiones</span>
                        </div>
                        <div style={{ marginTop: 6, height: 4, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${t.percentage}%`, background: t.color, borderRadius: 999 }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Países */}
              {country === "ALL" && (
                <div style={card}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
                    <div>
                      <div style={sectionTitle}>Distribución por país</div>
                      <div style={sectionSub}>
                        Mercados principales (CO/MX/EC) vs outsiders (otros países).
                        Outsiders = suppliers registrados fuera de los 3 mercados operativos de Dropi.
                      </div>
                    </div>
                    {outsiderTotal > 0 && (
                      <span style={tag("#6366F1", "#EEF2FF")}>
                        {outsiderTotal.toLocaleString("es-CO")} outsiders
                      </span>
                    )}
                  </div>
                  <div style={{ overflowX: "auto", border: "1px solid var(--border)", borderRadius: 10 }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr>
                          <th style={thStyle}>País</th>
                          <th style={thStyle}>Tipo</th>
                          <th style={thR}>Registrados</th>
                          <th style={thR}>% del total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...mainCountries, ...outsiderCountries]
                          .sort((a, b) => b.value - a.value)
                          .map(c => {
                            const isMain = MAIN_MARKETS.some(m => c.name.toLowerCase().includes(m.toLowerCase()));
                            const pct = s.totalSuppliers > 0 ? Math.round((c.value / s.totalSuppliers) * 100) : 0;
                            return (
                              <tr key={c.name} style={{ background: !isMain ? "#FAFAFA" : undefined }}>
                                <td style={{ ...tdStyle, fontWeight: isMain ? 600 : 400 }}>{c.name}</td>
                                <td style={tdStyle}>
                                  <span style={isMain
                                    ? tag("#10B981", "#ECFDF5")
                                    : tag("var(--muted)", "#F3F4F6")
                                  }>
                                    {isMain ? "Principal" : "Outsider"}
                                  </span>
                                </td>
                                <td style={{ ...tdR, fontWeight: 600 }}>{c.value.toLocaleString("es-CO")}</td>
                                <td style={tdR}>
                                  <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                                    <div style={{ width: 60, height: 6, background: "#F3F4F6", borderRadius: 999, overflow: "hidden" }}>
                                      <div style={{ height: "100%", width: `${pct}%`, background: isMain ? "#10B981" : "#D1D5DB", borderRadius: 999 }} />
                                    </div>
                                    <span>{pct}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Hallazgos clave */}
              <div style={{
                ...card,
                background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
                color: "#fff",
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: "rgba(255,255,255,0.9)" }}>
                  🔍 Hallazgos clave del diagnóstico
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {[
                    { icon: "📉", text: "~30–40 nuevos registros diarios. La mayoría sin productos ni órdenes." },
                    { icon: "⏱️", text: "Suppliers de +1.000 órdenes/mes declaradas llevan 66+ días inactivos, 0 productos." },
                    { icon: "🔁", text: "El CRM (GHL) actualmente solo tiene 2 pipelines activos — los nuevos NO llegan al CRM." },
                    { icon: "🎯", text: "La solución definida es operativa: CRM + automatización, sin desarrollo nuevo." },
                  ].map((h, i) => (
                    <div key={i} style={{
                      background: "rgba(255,255,255,0.08)", borderRadius: 10,
                      padding: "12px 14px", display: "flex", gap: 10, alignItems: "flex-start",
                    }}>
                      <span style={{ fontSize: 18, flexShrink: 0 }}>{h.icon}</span>
                      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>{h.text}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          );
        })()}
      </div>
    </main>
  );
}
