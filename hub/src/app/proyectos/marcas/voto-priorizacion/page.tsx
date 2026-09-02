"use client";

// Prototipo de votación — Ronda 1 (equipo interno, formato Cell Board).
// Fuente Bloque A: hub/src/app/proyectos/bau-competitivo-marcas/page.tsx
//   (CAPACIDADES_UNIFICADAS) — base activa de Dropi, 9 entrevistas + CSAT 716
//   respuestas + 6 negocios perdidos + research externo 24-jul/30-jul-2026.
// Fuente Bloque B: hub/src/app/proyectos/pmf-brand/page.tsx (PRODUCT_GROWTH)
//   — 17 marcas-lead externas, investigación cerrada 25-ago-2026.
// Se mantienen separados a propósito (Protocolo 6 — anti-colapso): base
// activa y leads externos son poblaciones distintas, "qué me retiene" no es
// lo mismo que "qué me haría entrar". Ronda 2 (con marcas, segmentado por
// nivel de madurez) queda pendiente de diseñar después de ver este resultado.
// Voto en vivo, sin backend: se guarda en localStorage del dispositivo que
// se comparte en pantalla durante la sesión — no across dispositivos.

import { useEffect, useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";

const NAVY = "#0A1628";
const BLUE = "#1458A8";
const RED = "#DC2626";
const AMBER = "#D97706";
const GREEN = "#16A34A";
const RED_BG = "#FEF2F2";
const AMB_BG = "#FFFBEB";
const BLU_BG = "#EFF6FF";
const GREEN_BG = "#F0FDF4";
const MUTED_BG = "#F1F5F9";

const card: React.CSSProperties = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "18px 20px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};
const sectionLabel: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.10em",
  textTransform: "uppercase",
  color: "var(--muted)",
  marginTop: 32,
  marginBottom: 12,
};
const tagChip = (color: string, bg: string): React.CSSProperties => ({
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  padding: "2px 8px",
  borderRadius: 4,
  color,
  background: bg,
  whiteSpace: "nowrap",
});

// ─── Bloque A — Base activa (BAU) ───────────────────────────────────────
type ItemA = { key: string; nombre: string; prioridad: "critica" | "alta" | "media"; evidencia: string };
const PRIORIDAD_COLOR: Record<string, { color: string; bg: string; label: string }> = {
  critica: { color: RED, bg: RED_BG, label: "Crítica" },
  alta: { color: AMBER, bg: AMB_BG, label: "Alta" },
  media: { color: BLUE, bg: BLU_BG, label: "Media" },
};
const BLOQUE_A: ItemA[] = [
  { key: "a1", nombre: "Confiabilidad del ciclo post-despacho (tracking, novedades, evidencia de entrega, devoluciones y garantías)", prioridad: "critica", evidencia: "CSAT + 6/9 entrevistas" },
  { key: "a2", nombre: "Comunicación automática nativa con el comprador", prioridad: "critica", evidencia: "Única de 8 competidores sin mensajería nativa" },
  { key: "a3", nombre: "Confiabilidad de la promesa base de la guía (peso y volumen)", prioridad: "alta", evidencia: "Santiago Lubo: -58% órdenes en 4 meses" },
  { key: "a4", nombre: "Perfil de marca unificado — fin de la doble cuenta Proveedor/Dropshipper", prioridad: "alta", evidencia: "Yercy Shop, ~14.000 órdenes/mes" },
  { key: "a5", nombre: "Gestión comercial proactiva a cuentas de volumen sin gestor activo", prioridad: "alta", evidencia: "4/4 entrevistas recientes" },
  { key: "a6", nombre: "Apertura logística al transportador propio del seller", prioridad: "media", evidencia: "Informe Gerencial — solo Mastershop lo ofrece" },
  { key: "a7", nombre: "Integraciones que quitan fricción de venta (SIIGO/ERP, Shopify masivo, guía sin crear producto)", prioridad: "media", evidencia: "2 negocios perdidos" },
  { key: "a8", nombre: "Modelos comerciales flexibles (SAMEDAY, envíos B2B, cobro solo flete, seguro anti-devolución, retiro ágil)", prioridad: "media", evidencia: "Negocio perdido Parchita + comparación activa 2 marcas" },
];

// ─── Bloque B — Leads externos (PMF) ────────────────────────────────────
type ItemB = { key: string; nombre: string; porque: string };
const BLOQUE_B: ItemB[] = [
  { key: "b1", nombre: "Conexión profunda con Shopify", porque: "16 de 17 marcas usan Shopify" },
  { key: "b2", nombre: "Tracking con la marca", porque: "Dolor más repetido, ninguna de las 17 lo tiene resuelto" },
  { key: "b3", nombre: "Elección automática de transportadora", porque: "Varias dependen de una sola transportadora" },
  { key: "b4", nombre: "COD inteligente y recaudo claro", porque: "COD sube ventas pero también rechazos" },
  { key: "b5", nombre: "Control de inventario y bodegas", porque: "Pérdida de ventas por agotados, sobreventa" },
  { key: "b6", nombre: "Novedades, cambios y devoluciones", porque: "Hoy depende de mensajes manuales" },
  { key: "b7", nombre: "Combos y promociones", porque: "Los kits descuadran el stock" },
];

const BUDGETS = [3, 5, 7, 10] as const;
const STORAGE_KEY = "voto-priorizacion-marcas-v1";

type Voto = { id: string; nombre: string; budget: number; a: Record<string, number>; b: Record<string, number>; ts: number };

function sumVals(o: Record<string, number>) {
  return Object.values(o).reduce((s, v) => s + v, 0);
}

export default function VotoPriorizacionPage() {
  const [budget, setBudget] = useState<number>(5);
  const [votos, setVotos] = useState<Voto[]>([]);
  const [nombre, setNombre] = useState("");
  const [a, setA] = useState<Record<string, number>>({});
  const [b, setB] = useState<Record<string, number>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setVotos(JSON.parse(raw));
    } catch {
      // localStorage puede fallar (ventana privada, storage bloqueado) — se sigue sin historial previo.
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(votos));
    } catch {
      // ver nota arriba.
    }
  }, [votos, loaded]);

  const totalA = sumVals(a);
  const totalB = sumVals(b);

  function bump(setter: typeof setA, state: Record<string, number>, key: string, total: number, delta: number) {
    const current = state[key] ?? 0;
    const next = current + delta;
    if (next < 0) return;
    if (delta > 0 && total >= budget) return;
    setter({ ...state, [key]: next });
  }

  function registrarVoto() {
    if (!nombre.trim()) return;
    const voto: Voto = { id: `${Date.now()}-${Math.random()}`, nombre: nombre.trim(), budget, a, b, ts: Date.now() };
    setVotos([...votos, voto]);
    setNombre("");
    setA({});
    setB({});
  }

  function reiniciar() {
    if (!window.confirm("¿Borrar todos los votos registrados en esta sesión?")) return;
    setVotos([]);
  }

  function agregados(items: { key: string; nombre: string }[], campo: "a" | "b") {
    const totals: Record<string, { puntos: number; votantes: number }> = {};
    for (const it of items) totals[it.key] = { puntos: 0, votantes: 0 };
    for (const v of votos) {
      const alloc = v[campo];
      for (const it of items) {
        const p = alloc[it.key] ?? 0;
        if (p > 0) {
          totals[it.key].puntos += p;
          totals[it.key].votantes += 1;
        }
      }
    }
    const maxPuntos = Math.max(1, ...Object.values(totals).map((t) => t.puntos));
    return items
      .map((it) => ({ ...it, ...totals[it.key] }))
      .sort((x, y) => y.puntos - x.puntos)
      .map((it) => ({ ...it, pct: (it.puntos / maxPuntos) * 100 }));
  }

  const resultadosA = agregados(BLOQUE_A, "a");
  const resultadosB = agregados(BLOQUE_B, "b");

  return (
    <main style={{ minHeight: "100vh", padding: "0 0 60px" }}>
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "24px 32px 0" }}>
        <Breadcrumb items={[{ label: "Proyectos", href: "/proyectos" }, { label: "Marcas · Plan de ataque", href: "/proyectos/marcas" }, { label: "Voto de priorización" }]} />
      </div>

      {/* Header */}
      <div style={{ background: NAVY, padding: "26px 24px 22px", marginTop: 16 }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,.4)", marginBottom: 8 }}>
            Brands Success · Dropi · Ronda 1 — equipo interno · Cell Board · agosto 2026
          </div>
          <div style={{ fontSize: 25, fontWeight: 800, color: "white", lineHeight: 1.15, marginBottom: 4, letterSpacing: "-0.02em" }}>
            Voto de priorización — qué necesita la Marca
          </div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,.5)", lineHeight: 1.5, maxWidth: "62ch" }}>
            Dot-voting sobre la evidencia ya recogida en BAU (base activa) y PMF Brand (leads externos). No es una
            decisión tomada — es para que el equipo la tome en vivo.
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 32px" }}>

        {/* INSTRUCCIONES */}
        <div style={{ ...card, borderRadius: 0, borderTop: "none", marginTop: 0 }}>
          <div style={sectionLabel as React.CSSProperties}>Cómo se vota</div>
          <p style={{ fontSize: 13, color: "var(--fg)", lineHeight: 1.7, margin: "0 0 12px" }}>
            Cada persona reparte un presupuesto de puntos <b>por separado en cada bloque</b> (no se mezclan Bloque A y
            Bloque B — son poblaciones distintas, ver nota abajo). Se puede poner más de un punto en la misma
            capacidad. Los resultados se guardan en este navegador mientras dure la sesión — usar una sola pantalla
            compartida para que el conteo sea real.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)" }}>Puntos por persona por bloque:</span>
            {BUDGETS.map((n) => (
              <button
                key={n}
                onClick={() => setBudget(n)}
                style={{
                  fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 999, cursor: "pointer",
                  border: budget === n ? `1.5px solid ${BLUE}` : "1px solid var(--border)",
                  background: budget === n ? BLU_BG : "transparent",
                  color: budget === n ? BLUE : "var(--muted)",
                }}
              >
                {n}
              </button>
            ))}
            <span style={{ fontSize: 11, color: "var(--muted)" }}>(default 5 — ajustable en vivo)</span>
          </div>
        </div>

        {/* NOMBRE */}
        <div style={{ ...card, marginTop: 16 }}>
          <div style={sectionLabel as React.CSSProperties}>Quién vota</div>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            style={{
              width: "100%", fontSize: 14, padding: "10px 12px", borderRadius: 8,
              border: "1px solid var(--border)", background: "var(--card)", color: "var(--fg)",
            }}
          />
        </div>

        {/* BLOQUE A */}
        <div style={sectionLabel}>Bloque A — Base activa (BAU) · presupuesto: {totalA}/{budget}</div>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 12 }}>
          Qué retiene a quien ya es marca en Dropi. Fuente: <code>bau-competitivo-marcas</code> — 9 entrevistas + CSAT
          716 respuestas + 6 negocios perdidos + research externo.
        </p>
        {BLOQUE_A.map((it) => {
          const pc = PRIORIDAD_COLOR[it.prioridad];
          const val = a[it.key] ?? 0;
          return (
            <div key={it.key} style={{ ...card, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 4, flexWrap: "wrap" }}>
                  <span style={tagChip(pc.color, pc.bg)}>{pc.label}</span>
                  <span style={{ fontSize: 11, color: "var(--muted)" }}>{it.evidencia}</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg)", lineHeight: 1.4 }}>{it.nombre}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button onClick={() => bump(setA, a, it.key, totalA, -1)} disabled={val === 0} style={stepBtn(val === 0)}>−</button>
                <span style={{ fontSize: 16, fontWeight: 800, color: NAVY, width: 20, textAlign: "center" }}>{val}</span>
                <button onClick={() => bump(setA, a, it.key, totalA, 1)} disabled={totalA >= budget} style={stepBtn(totalA >= budget)}>+</button>
              </div>
            </div>
          );
        })}

        {/* BLOQUE B */}
        <div style={sectionLabel}>Bloque B — Leads externos (PMF) · presupuesto: {totalB}/{budget}</div>
        <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6, marginTop: -4, marginBottom: 12 }}>
          Qué haría entrar a una marca que hoy evalúa Dropi. Fuente: <code>pmf-brand</code> — 17 marcas-lead,
          investigación cerrada 25-ago-2026.
        </p>
        {BLOQUE_B.map((it) => {
          const val = b[it.key] ?? 0;
          return (
            <div key={it.key} style={{ ...card, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: "var(--muted)", marginBottom: 4 }}>{it.porque}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--fg)", lineHeight: 1.4 }}>{it.nombre}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                <button onClick={() => bump(setB, b, it.key, totalB, -1)} disabled={val === 0} style={stepBtn(val === 0)}>−</button>
                <span style={{ fontSize: 16, fontWeight: 800, color: NAVY, width: 20, textAlign: "center" }}>{val}</span>
                <button onClick={() => bump(setB, b, it.key, totalB, 1)} disabled={totalB >= budget} style={stepBtn(totalB >= budget)}>+</button>
              </div>
            </div>
          );
        })}

        {/* REGISTRAR */}
        <div style={{ ...card, marginTop: 8, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>
            {votos.length} voto{votos.length === 1 ? "" : "s"} registrado{votos.length === 1 ? "" : "s"} en esta sesión.
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={reiniciar} style={{ fontSize: 12, fontWeight: 700, color: "var(--muted)", background: "transparent", border: "1px solid var(--border)", borderRadius: 8, padding: "9px 14px", cursor: "pointer" }}>
              Reiniciar votación
            </button>
            <button
              onClick={registrarVoto}
              disabled={!nombre.trim()}
              style={{
                fontSize: 13, fontWeight: 700, color: "white", background: nombre.trim() ? GREEN : "var(--muted)",
                border: "none", borderRadius: 8, padding: "10px 18px", cursor: nombre.trim() ? "pointer" : "not-allowed",
              }}
            >
              Registrar mi voto →
            </button>
          </div>
        </div>

        {/* RESULTADOS */}
        <div style={sectionLabel}>Resultados en vivo — Bloque A</div>
        <ResultBars items={resultadosA} color={BLUE} />

        <div style={sectionLabel}>Resultados en vivo — Bloque B</div>
        <ResultBars items={resultadosB} color={GREEN} />

        {/* VOTOS INDIVIDUALES */}
        {votos.length > 0 && (
          <>
            <div style={sectionLabel}>Votos individuales — evidencia, no solo el agregado</div>
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              {votos.map((v, i) => (
                <div key={v.id} style={{ padding: "10px 16px", borderBottom: i < votos.length - 1 ? "1px solid var(--border)" : "none", fontSize: 12.5 }}>
                  <b style={{ color: "var(--fg)" }}>{v.nombre}</b>
                  <span style={{ color: "var(--muted)" }}> · presupuesto {v.budget} · A: {sumVals(v.a)} pts · B: {sumVals(v.b)} pts</span>
                </div>
              ))}
            </div>
          </>
        )}

        {/* PENDIENTE */}
        <div style={{ ...card, borderLeft: `3px solid ${AMBER}`, background: AMB_BG, marginTop: 32, marginBottom: 24 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", color: AMBER, marginBottom: 6 }}>Pregunta abierta — pendiente de diseñar</div>
          <p style={{ fontSize: 13, lineHeight: 1.6, color: "var(--fg)", margin: 0 }}>
            Este resultado es solo la Ronda 1 (equipo interno). La Ronda 2 — validar con marcas directamente,
            segmentado por nivel de madurez (Iniciando → Escalando, mismo corte que usa el JTBD) — se diseña después
            de ver qué queda arriba acá. No se declara ninguna capacidad lista para Handoff con este voto solo.
          </p>
        </div>

      </div>
    </main>
  );
}

function stepBtn(disabled: boolean): React.CSSProperties {
  return {
    width: 28, height: 28, borderRadius: "50%", border: "1px solid var(--border)",
    background: disabled ? MUTED_BG : "var(--card)", color: disabled ? "var(--muted)" : NAVY,
    fontSize: 16, fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer", lineHeight: 1,
  };
}

function ResultBars({ items, color }: { items: { key: string; nombre: string; puntos: number; votantes: number; pct: number }[]; color: string }) {
  return (
    <div style={{ marginBottom: 10 }}>
      {items.map((it) => (
        <div key={it.key} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 4, gap: 12 }}>
            <span style={{ color: "var(--fg)", fontWeight: 600 }}>{it.nombre}</span>
            <span style={{ color: "var(--muted)", flexShrink: 0 }}>{it.puntos} pts · {it.votantes} votante{it.votantes === 1 ? "" : "s"}</span>
          </div>
          <div style={{ height: 8, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${it.puntos > 0 ? it.pct : 0}%`, background: color, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}
