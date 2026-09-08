"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import HubHeader from "@/components/HubHeader";
import HubFooter from "@/components/HubFooter";

// ─────────────────────────────────────────────────────────────────────────────
// Roadmap cross-célula, dos carriles:
//   · Product  — proyectos en Discovery/POC, ubicados por sus fechas objetivo
//     (fecha_objetivo_experimento → fecha_objetivo_decision, 060_*.sql).
//   · Delivery — Delivery Proyectos, ubicados por su pipeline de fechas
//     (fecha_handoff → fecha_salida_produccion, 055_*.sql).
// Los que no tienen fecha se listan aparte — ese es justamente el hallazgo
// que este roadmap existe para mostrar (lo represado esperando a TI, lo que
// no tiene compromiso de fecha todavía). La edición de fechas se hace en
// /delivery (pipeline) y en la ficha de cada proyecto (discovery).
// ─────────────────────────────────────────────────────────────────────────────

type Proyecto = {
  id: string;
  name: string;
  project_code: string | null;
  type: string | null;
  estado_interno: string | null;
  prioridad: string | null;
  fecha_handoff: string | null;
  fecha_inicio_dev: string | null;
  fecha_entrega_qa: string | null;
  fecha_salida_produccion: string | null;
  fecha_objetivo_experimento: string | null;
  fecha_objetivo_decision: string | null;
  fechas_discovery_confirmadas: boolean | null;
};

type Celula = { id: string; nombre: string; slug: string; proyectos: Proyecto[] };

type Carril = "product" | "delivery";

// Paleta por célula (cae a un gris si aparece una nueva sin color asignado).
const CELULA_COLOR: Record<string, string> = {
  suppliers: "#1A6B52",
  sellers: "#2563EB",
  brands: "#DB2777",
  logistica: "#F77F00",
  backoffice: "#7C3AED",
  experience: "#0EA5E9",
  "product-designers": "#64748B",
};
const colorDe = (slug: string) => CELULA_COLOR[slug] ?? "#64748B";

const MES_MS = 86_400_000;

function isoADate(iso: string | null): Date | null {
  if (!iso) return null;
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function mesKey(d: Date) {
  return d.getFullYear() * 12 + d.getMonth();
}

function fmtMes(indice: number) {
  const y = Math.floor(indice / 12);
  const m = indice % 12;
  return new Date(y, m, 1).toLocaleDateString("es-CO", { month: "short", year: "2-digit" });
}

function fmtFecha(iso: string | null) {
  const d = isoADate(iso);
  return d ? d.toLocaleDateString("es-CO", { day: "2-digit", month: "short" }) : "—";
}

// Un item del roadmap: rango [inicio, fin] o un solo hito (inicio === fin).
type Item = {
  proyecto: Proyecto;
  celula: Celula;
  inicio: string;
  fin: string;
  soloHito: boolean;
  confirmada: boolean;
  etiquetaInicio: string;
  etiquetaFin: string;
};

function itemProduct(p: Proyecto, c: Celula): Item | null {
  const exp = p.fecha_objetivo_experimento;
  const dec = p.fecha_objetivo_decision;
  if (!exp && !dec) return null;
  const inicio = exp ?? dec!;
  const fin = dec ?? exp!;
  return {
    proyecto: p,
    celula: c,
    inicio,
    fin,
    soloHito: inicio === fin,
    confirmada: !!p.fechas_discovery_confirmadas,
    etiquetaInicio: "Experimento",
    etiquetaFin: "Decisión",
  };
}

function itemDelivery(p: Proyecto, c: Celula): Item | null {
  const ini = p.fecha_handoff ?? p.fecha_inicio_dev;
  const fin = p.fecha_salida_produccion ?? p.fecha_entrega_qa;
  if (!ini && !fin) return null;
  const inicio = ini ?? fin!;
  const cierre = fin ?? ini!;
  return {
    proyecto: p,
    celula: c,
    inicio,
    fin: cierre,
    soloHito: inicio === cierre,
    confirmada: true,
    etiquetaInicio: p.fecha_handoff ? "Handoff" : "Inicio dev",
    etiquetaFin: p.fecha_salida_produccion ? "Producción" : "QA",
  };
}

function esDiscovery(p: Proyecto) {
  return p.type !== "POC" && p.type !== "Delivery Proyecto" && p.type !== "Following";
}

function pill(active: boolean): CSSProperties {
  return {
    fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 999,
    border: `1px solid ${active ? "var(--dropi)" : "var(--border)"}`,
    background: active ? "var(--dropi-light)" : "#fff",
    color: active ? "var(--dropi)" : "var(--gray-400)", cursor: "pointer",
  };
}

function TimelineRow({ item, minMes, totalMeses }: { item: Item; minMes: number; totalMeses: number }) {
  const color = colorDe(item.celula.slug);
  const dIni = isoADate(item.inicio)!;
  const dFin = isoADate(item.fin)!;
  const colIni = Math.max(0, mesKey(dIni) - minMes);
  const colFin = Math.min(totalMeses - 1, mesKey(dFin) - minMes);
  const span = Math.max(1, colFin - colIni + 1);

  return (
    <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 10, alignItems: "center" }}>
      <div style={{ minWidth: 0 }}>
        <Link
          href={`/proyectos/${item.proyecto.project_code ? item.proyecto.project_code.toLowerCase() : item.proyecto.id}`}
          style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", textDecoration: "none", display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
        >
          {item.proyecto.name}
        </Link>
        <span style={{ fontSize: 10, color: "var(--gray-400)" }}>
          {item.proyecto.project_code ?? ""} · {item.celula.nombre}
          {item.proyecto.prioridad ? ` · ${item.proyecto.prioridad}` : ""}
        </span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: `repeat(${totalMeses}, 1fr)`, gap: 0, position: "relative", height: 28 }}>
        {Array.from({ length: totalMeses }).map((_, i) => (
          <div key={i} style={{ borderLeft: i === 0 ? "none" : "1px dashed var(--gray-100)" }} />
        ))}
        <div
          title={`${item.etiquetaInicio}: ${fmtFecha(item.inicio)} → ${item.etiquetaFin}: ${fmtFecha(item.fin)}`}
          style={{
            gridColumn: `${colIni + 1} / span ${span}`,
            gridRow: 1,
            alignSelf: "center",
            height: item.soloHito ? 0 : 16,
            width: item.soloHito ? 0 : "auto",
            background: item.soloHito ? "transparent" : `${color}${item.confirmada ? "" : "55"}`,
            border: item.soloHito ? "none" : `1px solid ${color}`,
            borderRadius: 6,
            borderStyle: item.confirmada ? "solid" : "dashed",
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative",
          }}
        >
          {item.soloHito && (
            <span style={{
              position: "absolute", left: 0, width: 12, height: 12, transform: "rotate(45deg)",
              background: item.confirmada ? color : "#fff", border: `2px solid ${color}`,
            }} />
          )}
        </div>
      </div>
    </div>
  );
}

function SinFecha({ proyectos, carril }: { proyectos: { p: Proyecto; c: Celula }[]; carril: Carril }) {
  if (proyectos.length === 0) return null;
  return (
    <div style={{ border: "1px solid #FCD9B6", background: "#FFF8F0", borderRadius: 12, padding: 16, marginBottom: 24 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "#B45309", margin: "0 0 10px" }}>
        {carril === "delivery" ? `Sin fecha de TI (${proyectos.length})` : `Sin fecha objetivo (${proyectos.length})`}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {proyectos.map(({ p, c }) => (
          <Link
            key={p.id}
            href={`/proyectos/${p.project_code ? p.project_code.toLowerCase() : p.id}`}
            style={{
              fontSize: 12, fontWeight: 600, color: "var(--fg)", textDecoration: "none",
              background: "#fff", border: "1px solid var(--border)", borderRadius: 8, padding: "5px 10px",
              display: "inline-flex", alignItems: "center", gap: 6,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: 999, background: colorDe(c.slug) }} />
            {p.name}
            <span style={{ color: "var(--gray-400)", fontWeight: 400 }}>
              {p.project_code ?? ""} · {p.estado_interno ?? "sin estado"}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function RoadmapPage() {
  const [celulas, setCelulas] = useState<Celula[]>([]);
  const [loading, setLoading] = useState(true);
  const [carril, setCarril] = useState<Carril>("product");
  const [selSlugs, setSelSlugs] = useState<string[] | null>(null);

  useEffect(() => {
    fetch("/api/celulas")
      .then((r) => r.json())
      .then((data: Celula[]) => {
        const list = Array.isArray(data) ? data : [];
        setCelulas(list);
        setSelSlugs(list.map((c) => c.slug));
      })
      .finally(() => setLoading(false));
  }, []);

  const visibles = useMemo(
    () => celulas.filter((c) => !selSlugs || selSlugs.includes(c.slug)),
    [celulas, selSlugs],
  );

  const { conFecha, sinFecha } = useMemo(() => {
    const conFecha: Item[] = [];
    const sinFecha: { p: Proyecto; c: Celula }[] = [];
    for (const c of visibles) {
      for (const p of c.proyectos) {
        if ((p.estado_interno ?? "") === "Cerrado") continue;
        if (carril === "product") {
          if (!esDiscovery(p) && p.type !== "POC") continue;
          const it = itemProduct(p, c);
          if (it) conFecha.push(it);
          else sinFecha.push({ p, c });
        } else {
          if (p.type !== "Delivery Proyecto") continue;
          const it = itemDelivery(p, c);
          if (it) conFecha.push(it);
          else sinFecha.push({ p, c });
        }
      }
    }
    conFecha.sort((a, b) => a.inicio.localeCompare(b.inicio));
    return { conFecha, sinFecha };
  }, [visibles, carril]);

  // Ventana temporal: del mes del primer inicio (o este mes) al del último
  // fin, acotada a [hoy-1mes, hoy+12meses] para que un dato lejano no
  // aplaste la escala.
  const { minMes, totalMeses } = useMemo(() => {
    const hoy = new Date();
    const pisoAbs = mesKey(new Date(hoy.getFullYear(), hoy.getMonth() - 1, 1));
    const techoAbs = mesKey(new Date(hoy.getFullYear(), hoy.getMonth() + 12, 1));
    let lo = mesKey(new Date(hoy.getFullYear(), hoy.getMonth(), 1));
    let hi = lo + 2;
    for (const it of conFecha) {
      const di = isoADate(it.inicio);
      const df = isoADate(it.fin);
      if (di) lo = Math.min(lo, mesKey(di));
      if (df) hi = Math.max(hi, mesKey(df));
    }
    lo = Math.max(pisoAbs, lo);
    hi = Math.min(techoAbs, Math.max(hi, lo + 2));
    return { minMes: lo, totalMeses: hi - lo + 1 };
  }, [conFecha]);

  const todasSel = selSlugs !== null && selSlugs.length === celulas.length;

  return (
    <main style={{ minHeight: "100vh", padding: 0, display: "flex", flexDirection: "column" }}>
      <div style={{ flex: 1 }}>
        <HubHeader title="Roadmap" subtitle="Product y Delivery · cross-célula" currentSlug="roadmap" />

        <div style={{ maxWidth: 1400, margin: "0 auto", padding: 32 }}>
          <p style={{ fontSize: 13, color: "var(--muted)", marginBottom: 20 }}>
            Dos carriles: <strong>Product</strong> (proyectos en Discovery/POC por fecha objetivo) y{" "}
            <strong>Delivery</strong> (Delivery Proyectos por su pipeline). Barra sólida = fecha confirmada;
            punteada = tentativa. Los proyectos sin fecha se listan aparte.
          </p>

          <div style={{ display: "inline-flex", border: "1px solid var(--border)", borderRadius: 10, padding: 2, marginBottom: 14, background: "#fff" }}>
            {(["product", "delivery"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setCarril(k)}
                style={{
                  fontSize: 12, fontWeight: 700, padding: "6px 14px", borderRadius: 8, border: "none",
                  background: carril === k ? "var(--fg)" : "transparent",
                  color: carril === k ? "#fff" : "var(--muted)", cursor: "pointer",
                }}
              >
                {k === "product" ? "Product" : "Delivery"}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 24 }}>
            <button
              onClick={() => setSelSlugs(todasSel ? [] : celulas.map((c) => c.slug))}
              style={pill(todasSel)}
            >
              Todas
            </button>
            {celulas.map((c) => {
              const on = !!selSlugs?.includes(c.slug);
              return (
                <button
                  key={c.id}
                  onClick={() =>
                    setSelSlugs((prev) =>
                      (prev ?? []).includes(c.slug) ? (prev ?? []).filter((s) => s !== c.slug) : [...(prev ?? []), c.slug],
                    )
                  }
                  style={{ ...pill(on), display: "inline-flex", alignItems: "center", gap: 6 }}
                >
                  <span style={{ width: 7, height: 7, borderRadius: 999, background: colorDe(c.slug) }} />
                  {c.nombre}
                </button>
              );
            })}
          </div>

          {loading && <p style={{ fontSize: 13, color: "var(--muted)" }}>Cargando…</p>}

          {!loading && (
            <>
              <SinFecha proyectos={sinFecha} carril={carril} />

              {conFecha.length === 0 ? (
                <p style={{ fontSize: 13, color: "var(--gray-300)", fontStyle: "italic" }}>
                  Ningún proyecto con fecha en este carril todavía.
                </p>
              ) : (
                <div style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--card)", overflow: "hidden" }}>
                  {/* Cabecera de meses */}
                  <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 10, padding: "10px 16px", borderBottom: "1px solid var(--border)", background: "var(--bg)" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted)" }}>
                      Proyecto
                    </span>
                    <div style={{ display: "grid", gridTemplateColumns: `repeat(${totalMeses}, 1fr)` }}>
                      {Array.from({ length: totalMeses }).map((_, i) => (
                        <span key={i} style={{ fontSize: 10, fontWeight: 700, color: "var(--gray-400)", textAlign: "center" }}>
                          {fmtMes(minMes + i)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: 10, padding: "14px 16px" }}>
                    {conFecha.map((it) => (
                      <TimelineRow key={it.proyecto.id} item={it} minMes={minMes} totalMeses={totalMeses} />
                    ))}
                  </div>
                </div>
              )}

              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 16 }}>
                {carril === "delivery"
                  ? "Editar fechas de delivery: en /delivery (pestaña Roadmap) o en la ficha del proyecto."
                  : "Cargar fechas objetivo de discovery: en la ficha de cada proyecto."}
              </p>
            </>
          )}
        </div>
      </div>
      <HubFooter />
    </main>
  );
}
