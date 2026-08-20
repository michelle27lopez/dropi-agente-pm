"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { TTV_FASE_1, TTV_FASE_2 } from "@/lib/ttv-fases-data";
import { CATALOGO_METAS } from "@/lib/catalogo-metas-data";

type MetricsProject = {
  key: string;
  name: string;
  icon: string;
  color: string;
  url: string;
};

// Panel de métricas — hoy es 100% específico de Suppliers (Jaime lo armó a
// mano, cada proyecto mide lo suyo en su propio contexto). Para cualquier
// otra célula todavía no existe el equivalente, así que se muestra un
// estado vacío en vez de inventar contenido (2026-08-17, ver conversación
// con Jaime).
const METRICS_PROJECTS: MetricsProject[] = [
  { key: "time-to-value", name: "Time to Value", icon: "⚡", color: "#F77F00", url: "/proyectos/time-to-value/metricas" },
  { key: "dinamicas-catalogo", name: "Dinámicas de Catálogo", icon: "🗂️", color: "#0EA5E9", url: "/proyectos/dinamicas-catalogo/metas" },
  { key: "indicadores", name: "Indicadores · Postulaciones", icon: "📈", color: "#6366F1", url: "/proyectos/indicadores" },
  { key: "negociaciones", name: "Negociaciones · Proveedor–Líder Comunidad", icon: "🤝", color: "#0D9488", url: "/proyectos/negociaciones" },
  { key: "categorizacion", name: "Categorización y Enriquecimiento", icon: "🏷️", color: "#7C3AED", url: "/proyectos/categorizacion" },
  { key: "caza-productos", name: "Caza Productos", icon: "🔍", color: "#EC4899", url: "/proyectos/caza-productos" },
  { key: "descuentos", name: "Descuentos en Catálogo", icon: "🏷️", color: "#F59E0B", url: "/proyectos/descuentos" },
  { key: "negociaciones-dropshipper", name: "Negociaciones · Proveedor–Dropshipper", icon: "🤝", color: "#F77F00", url: "/proyectos/negociaciones-dropshipper" },
  { key: "combos", name: "Combos Dropshipper", icon: "📦", color: "#F77F00", url: "/proyectos/combos" },
  { key: "dropi-activa", name: "Dropi Activa · ACT-001", icon: "🚀", color: "#7C3AED", url: "/proyectos/dropi-activa" },
  { key: "gali-demo", name: "Gali - Demo", icon: "🦊", color: "#FF6102", url: "/proyectos/gali-demo" },
  { key: "pulso-demo", name: "Dropi Pulso · Demo", icon: "⚡", color: "#F77F00", url: "/proyectos/pulso-demo" },
];

export default function FollowingPorCelulaPage() {
  return (
    <Suspense fallback={null}>
      <FollowingContent />
    </Suspense>
  );
}

function FollowingContent() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get("p");
  const esSuppliers = params.slug === "suppliers";

  // null = portada (resumen TTV + Catálogo, ver más abajo) en vez de saltar
  // directo a un iframe — 2026-08-17, Jaime: eran las 2 tarjetas que tenía la
  // home vieja de Suppliers en "/" y se perdieron al volver esa ruta "Mi día"
  // universal. Con `?p=` en la URL (ej. desde un link directo) se salta la
  // portada e ir directo al iframe.
  const [selectedKey, setSelectedKey] = useState<string | null>(
    METRICS_PROJECTS.some((p) => p.key === initial) ? (initial as string) : null
  );

  const selected = METRICS_PROJECTS.find((p) => p.key === selectedKey) ?? null;

  const selectProject = (key: string) => {
    setSelectedKey(key);
    router.replace(`/celula/${params.slug}/following?p=${key}`, { scroll: false });
  };

  if (!esSuppliers) {
    return (
      <main style={{ minHeight: "100vh", background: "var(--card)" }}>
        <header style={{
          background: "#fff", borderBottom: "1px solid var(--border)",
          padding: "16px 32px", display: "flex", alignItems: "center", gap: 16,
        }}>
          <Breadcrumb items={[{ label: "Following" }]} />
        </header>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: 32 }}>
          <div style={{
            background: "#fff", border: "1px dashed var(--border)", borderRadius: 14,
            padding: "48px 32px", textAlign: "center",
          }}>
            <p style={{ fontSize: 32, marginBottom: 12 }}>📭</p>
            <p style={{ fontSize: 14, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>
              Aún no hay panel de métricas configurado para esta célula
            </p>
            <p style={{ fontSize: 13, color: "var(--muted)", maxWidth: 420, margin: "0 auto" }}>
              Esta vista todavía es específica de Suppliers. Se construye cuando esta célula lo necesite.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--card)" }}>
      <header style={{
        background: "#fff", borderBottom: "1px solid var(--border)",
        padding: "16px 32px", display: "flex", alignItems: "center", gap: 16, flexShrink: 0,
      }}>
        <Breadcrumb items={[{ label: "Following" }]} />
      </header>

      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <aside style={{
          width: 240, flexShrink: 0, overflowY: "auto",
          borderRight: "1px solid var(--border)", padding: "16px 10px",
        }}>
          <button
            onClick={() => {
              setSelectedKey(null);
              router.replace(`/celula/${params.slug}/following`, { scroll: false });
            }}
            className="hub-nav-item"
            style={{
              display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
              padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
              fontSize: 13, fontWeight: selectedKey === null ? 700 : 500,
              color: selectedKey === null ? "var(--dropi)" : "var(--fg)",
              marginBottom: 8,
              ...(selectedKey === null ? { background: "var(--dropi-light)" } : {}),
            }}
          >
            <span>🏠</span>
            <span>Resumen</span>
          </button>
          {METRICS_PROJECTS.map((p) => {
            const active = p.key === selectedKey;
            return (
              <button
                key={p.key}
                onClick={() => selectProject(p.key)}
                className="hub-nav-item"
                style={{
                  ["--item-accent" as string]: p.color,
                  ["--item-tint" as string]: `${p.color}12`,
                  display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left",
                  padding: "9px 12px", borderRadius: 8, border: "none", cursor: "pointer",
                  fontSize: 13, fontWeight: active ? 700 : 500,
                  color: active ? p.color : "var(--fg)",
                  marginBottom: 2,
                  ...(active ? { background: `${p.color}12` } : {}),
                }}
              >
                <span>{p.icon}</span>
                <span>{p.name}</span>
              </button>
            );
          })}
        </aside>

        {selected ? (
          <iframe
            key={selected.key}
            src={selected.url}
            title={`Métricas — ${selected.name}`}
            style={{ flex: 1, border: "none", height: "100%" }}
          />
        ) : (
          <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 960 }}>
              <Link href="/proyectos/time-to-value/asis" style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
                  padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", height: "100%",
                  transition: "box-shadow 0.15s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>
                      ⚡ TTV-001 · Activación
                    </p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", padding: "3px 9px", borderRadius: 20 }}>
                      Ver diagnóstico →
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 24, marginTop: 16 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Fase 1 · Baseline</div>
                      <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>
                        {TTV_FASE_1.tasaActivacion}
                      </div>
                    </div>
                    <div style={{ fontSize: 20, color: "var(--muted)" }}>→</div>
                    <div>
                      <div style={{ fontSize: 11, color: "#059669", marginBottom: 4 }}>Fase 2 · Pipeline (neta)</div>
                      <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "#10B981" }}>
                        {TTV_FASE_2.activacionNeta}
                      </div>
                    </div>
                  </div>
                  <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>⏱️ Registro → orden entregada (prom., desde 30-jun-2026)</div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>
                      {TTV_FASE_2.tiempoRegistroEntrega}
                    </div>
                  </div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 14, lineHeight: 1.5 }}>
                    Activación neta ya supera el baseline. La brecha sigue entre generar la orden ({TTV_FASE_2.activacionBruta})
                    y entregarla — punto exacto detrás del pivote a agente de WA.
                  </div>
                </div>
              </Link>

              <Link href={CATALOGO_METAS.detalleUrl} style={{ textDecoration: "none", color: "inherit" }}>
                <div style={{
                  background: "var(--card)", border: "1px solid var(--border)", borderRadius: 16,
                  padding: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", height: "100%",
                  transition: "box-shadow 0.15s",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
                    <p style={{ fontSize: 13, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>
                      🗂️ DCA-001 · Metas de Catálogo
                    </p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "var(--dropi)", background: "var(--dropi-light)", padding: "3px 9px", borderRadius: 20 }}>
                      Ver detalle →
                    </span>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>Meta de órdenes/mes</div>
                    <div style={{ fontSize: 34, fontWeight: 800, letterSpacing: "-0.03em", color: "var(--fg)" }}>
                      {CATALOGO_METAS.metaOrdenesMes}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 24, marginTop: 14 }}>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>% catálogo con orden</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{CATALOGO_METAS.pctConOrden}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--muted)" }}>Productividad (actual → meta)</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>
                        {CATALOGO_METAS.productividadActual} → {CATALOGO_METAS.productividadMeta}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--faint, #9CA3AF)", marginTop: 12, fontStyle: "italic" }}>
                    Prototipo de escenarios — no es data en vivo.
                  </div>
                </div>
              </Link>
            </div>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 24 }}>
              Elegí una métrica en el panel de la izquierda para ver el detalle completo.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
