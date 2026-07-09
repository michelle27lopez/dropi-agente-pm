"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Caveat, Space_Mono } from "next/font/google";
import { useIsEmbedded } from "@/lib/use-is-embedded";

const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat" });
const mono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-mono" });

const FONT_HAND = "var(--font-caveat), cursive";
const FONT_MONO = "var(--font-mono), ui-monospace, monospace";

// ─── Paleta "Expediente Célula" ────────────────────────────────────────────
const BG = "#E8DCC0";
const BG_PANEL = "#1D2326";
const PAPER = "#F5F0E3";
const PAPER2 = "#FFFCF5";
const INK = "#2B2A28";
const INK_SOFT = "#6B6558";
const LINE = "#DDD3B8";
const TEXT_LIGHT = "#F2EEE2";
const MUTED_LIGHT = "#9B9686";

const CAZA = "#D97706";
const CAZA_BG = "#FCEEDA";
const CAT = "#0891B2";
const CAT_BG = "#E1F4F8";
const DESC = "#7C5CBF";
const DESC_BG = "#EEE8FA";
const NEUTRAL = "#8A8477";
const NEUTRAL_BG = "#EDEAE1";

const GOOD = "#2F9E63";
const GOOD_BG = "#E4F5EC";
const WARN = "#D64545";
const WARN_BG = "#FBE7E7";

const DOTS_BG = `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0) 0 0/24px 24px, ${BG}`;

type SegmentDef = {
  id: string;
  tag?: string;
  title: string;
  start: number; // minute offset
  end: number;
  accent: string;
  accentBg: string;
  rotate: number;
};

const SEGMENTS: SegmentDef[] = [
  { id: "apertura", title: "Apertura", start: 0, end: 2, accent: NEUTRAL, accentBg: NEUTRAL_BG, rotate: -0.3 },
  { id: "caza", tag: "CAZ-001", title: "Caza Productos", start: 2, end: 20, accent: CAZA, accentBg: CAZA_BG, rotate: 0.4 },
  { id: "categorizacion", tag: "CAT-001", title: "Categorización", start: 20, end: 38, accent: CAT, accentBg: CAT_BG, rotate: -0.35 },
  { id: "descuentos", tag: "DESC-001", title: "Descuentos", start: 38, end: 56, accent: DESC, accentBg: DESC_BG, rotate: 0.3 },
  { id: "cierre", title: "Cierre", start: 56, end: 60, accent: NEUTRAL, accentBg: NEUTRAL_BG, rotate: -0.25 },
];

const TOTAL_MIN = 60;

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m < 10 ? "0" + m : m}:${s < 10 ? "0" + s : s}`;
}

// ─── Scroll reveal ──────────────────────────────────────────────────────────
function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, visible };
}

// ─── Número animado (count-up al entrar en pantalla) ───────────────────────
function CountUp({ value }: { value: string }) {
  const { ref, visible } = useReveal<HTMLSpanElement>();
  const m0 = value.match(/^([\d.]+)(.*)$/);
  const [display, setDisplay] = useState(() => (m0 ? "0" + m0[2] : value));

  useEffect(() => {
    if (!visible) return;
    const m = value.match(/^([\d.]+)(.*)$/);
    if (!m) { setDisplay(value); return; }
    const target = parseFloat(m[1]);
    const suffix = m[2];
    const decimals = m[1].includes(".") ? 1 : 0;
    let start: number | null = null;
    let raf = 0;
    const dur = 800;
    function step(ts: number) {
      if (start === null) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const val = target * (1 - Math.pow(1 - p, 3));
      setDisplay(val.toFixed(decimals) + suffix);
      if (p < 1) raf = requestAnimationFrame(step);
      else setDisplay(target.toFixed(decimals) + suffix);
    }
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, value]);

  return <span ref={ref}>{display}</span>;
}

function InlineCode({ children }: { children: React.ReactNode }) {
  return (
    <code style={{
      fontFamily: FONT_MONO,
      background: "rgba(0,0,0,0.07)", color: INK, padding: "1px 5px", borderRadius: 3, fontSize: "0.86em",
    }}>
      {children}
    </code>
  );
}

function Block({ kind, label, accent, children }: { kind: "demo" | "decision"; label: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: kind === "demo" ? "rgba(0,0,0,0.03)" : "rgba(0,0,0,0.02)",
      border: `1px dashed ${LINE}`, borderRadius: 6, padding: "14px 16px", marginBottom: 12,
    }}>
      <span style={{
        display: "inline-block", fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700,
        textTransform: "uppercase", letterSpacing: "0.07em", color: "#fff", background: accent,
        padding: "3px 9px", borderRadius: 3, marginBottom: 10,
      }}>
        {label}
      </span>
      <div style={{ fontSize: 13.5, lineHeight: 1.6, color: INK }}>{children}</div>
    </div>
  );
}

function Kpi({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div style={{ background: PAPER2, border: `1px solid ${LINE}`, borderRadius: 6, padding: "12px 12px 10px", position: "relative" }}>
      <span style={{
        position: "absolute", top: -6, left: "50%", transform: "translateX(-50%)",
        width: 9, height: 9, borderRadius: "50%", background: color, boxShadow: "0 2px 3px rgba(0,0,0,0.3)",
      }} />
      <div style={{ fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, color: INK_SOFT, textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 19, fontWeight: 700, color, margin: "4px 0 2px", fontVariantNumeric: "tabular-nums" }}>
        <CountUp value={value} />
      </div>
      <div style={{ fontSize: 10.5, color: INK_SOFT, lineHeight: 1.35 }}>{sub}</div>
    </div>
  );
}

function Quote({ name, role, points, accent }: { name: string; role: string; points: React.ReactNode[]; accent: string }) {
  return (
    <div style={{
      padding: "12px 14px", borderRadius: 4, background: PAPER2,
      border: `1px dashed ${LINE}`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
        <span style={{ width: 8, height: 8, borderRadius: "50%", background: accent, flexShrink: 0 }} />
        <div style={{ fontFamily: FONT_HAND, fontWeight: 700, fontSize: 20, color: INK, lineHeight: 1 }}>{name}</div>
      </div>
      {role && (
        <div style={{ fontFamily: FONT_MONO, fontSize: 10, color: INK_SOFT, marginTop: 4, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.03em" }}>
          {role}
        </div>
      )}
      <ul style={{ margin: role ? 0 : "8px 0 0", paddingLeft: 16, fontSize: 12, color: INK, lineHeight: 1.6 }}>
        {points.map((p, i) => <li key={i}>{p}</li>)}
      </ul>
    </div>
  );
}

function QList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((it, i) => (
        <li key={i} style={{ fontSize: 13.5, lineHeight: 1.55, display: "flex", gap: 8 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, color: INK_SOFT, flexShrink: 0 }}>
            {String(i + 1).padStart(2, "0")}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ol>
  );
}

function DecisionStamp({
  owner, id, closed, onToggle,
}: { owner: string; id: string; closed: boolean; onToggle: (id: string) => void }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
      <span style={{ fontFamily: FONT_MONO, fontSize: 11, color: INK_SOFT }}>
        decide: <b style={{ color: INK }}>{owner}</b>
      </span>
      <button
        onClick={() => onToggle(id)}
        style={{
          fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
          cursor: "pointer", padding: "6px 14px", borderRadius: 3,
          border: `2px solid ${closed ? GOOD : INK_SOFT}`,
          color: closed ? GOOD : INK_SOFT,
          background: closed ? GOOD_BG : "transparent",
          transform: closed ? "rotate(-6deg) scale(1.06)" : "rotate(0deg) scale(1)",
          transition: "transform 0.25s cubic-bezier(.34,1.56,.64,1), background 0.2s, border-color 0.2s, color 0.2s",
        }}
      >
        {closed ? "✓ Resuelto" : "Pendiente"}
      </button>
    </div>
  );
}

function CaseCard({
  seg, active, overtime, closed, children,
}: { seg: SegmentDef; active: boolean; overtime: boolean; closed: boolean; children: React.ReactNode }) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section
      id={seg.id}
      ref={ref}
      style={{
        position: "relative", background: PAPER,
        border: `1px solid ${active ? seg.accent : LINE}`,
        borderRadius: 6, padding: "26px 22px 20px", marginBottom: 24,
        scrollMarginTop: 130,
        transform: `rotate(${seg.rotate}deg) translateY(${visible ? 0 : 16}px)`,
        opacity: visible ? 1 : 0,
        boxShadow: active
          ? `0 0 0 3px ${seg.accentBg}, 0 14px 30px rgba(0,0,0,0.35)`
          : "0 8px 20px rgba(0,0,0,0.25)",
        transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease, border-color 0.3s ease",
      }}
    >
      <span style={{
        position: "absolute", top: -7, left: "50%", transform: "translateX(-50%)",
        width: 13, height: 13, borderRadius: "50%", background: seg.accent,
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)", border: `2px solid ${PAPER}`,
      }} />

      {overtime && !closed && (
        <span style={{
          position: "absolute", top: 12, right: -6,
          fontFamily: FONT_MONO, fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
          color: WARN, border: `1.5px solid ${WARN}`, background: WARN_BG,
          padding: "2px 8px", borderRadius: 3, transform: "rotate(6deg)",
        }}>
          tiempo excedido
        </span>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div>
          {seg.tag && (
            <div style={{
              fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700, color: "#fff",
              background: seg.accent, display: "inline-block",
              padding: "2px 8px", borderRadius: 3, letterSpacing: "0.04em", marginBottom: 8,
            }}>
              caso {seg.tag}
            </div>
          )}
          <h2 style={{ fontFamily: FONT_HAND, fontWeight: 700, fontSize: 30, color: INK, margin: 0, lineHeight: 1 }}>
            {seg.title}
          </h2>
        </div>
        <span style={{
          fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700, color: INK_SOFT,
          border: `1px solid ${LINE}`, padding: "3px 8px", borderRadius: 3, whiteSpace: "nowrap",
        }}>
          min {seg.start}–{seg.end}
        </span>
      </div>
      {children}
    </section>
  );
}

function TimerStamp({ remaining, over, running }: { remaining: number; over: boolean; running: boolean }) {
  const color = over ? WARN : running ? GOOD : MUTED_LIGHT;
  return (
    <div style={{
      position: "relative", border: `2.5px solid ${color}`, borderRadius: 6,
      padding: "8px 16px", transform: "rotate(-6deg)", color, textAlign: "center",
      background: "rgba(0,0,0,0.15)",
    }}>
      {running && (
        <span style={{
          position: "absolute", top: -4, right: -4, width: 9, height: 9, borderRadius: "50%",
          background: over ? WARN : GOOD, animation: "pulseDot 1.4s ease-in-out infinite",
        }} />
      )}
      <div style={{ fontFamily: FONT_MONO, fontWeight: 700, fontSize: 22, fontVariantNumeric: "tabular-nums", letterSpacing: "0.02em" }}>
        {over ? "+" : ""}{fmt(over ? -remaining : remaining)}
      </div>
      <div style={{ fontFamily: FONT_MONO, fontSize: 9, textTransform: "uppercase", letterSpacing: "0.1em", marginTop: 2 }}>
        {over ? "excedido" : running ? "en vivo" : "restantes"}
      </div>
    </div>
  );
}

function FolderTab({ seg, isActive, isPast }: { seg: SegmentDef; isActive: boolean; isPast: boolean }) {
  const bg = isActive ? seg.accent : isPast ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.015)";
  const color = isActive ? "#fff" : INK_SOFT;
  return (
    <a
      href={`#${seg.id}`}
      style={{
        flex: "0 0 auto", fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700, textDecoration: "none",
        color, background: bg,
        border: `1px solid ${isActive ? seg.accent : "rgba(0,0,0,0.1)"}`,
        padding: "7px 13px 6px", borderRadius: "6px 6px 2px 2px", whiteSpace: "nowrap",
        transform: isActive ? "translateY(-3px)" : "translateY(0)",
        boxShadow: isActive ? "0 4px 10px rgba(0,0,0,0.35)" : "none",
        transition: "transform 0.2s, box-shadow 0.2s, background 0.2s, color 0.2s",
      }}
    >
      {isPast && !isActive ? "✓ " : ""}{seg.title}
      <span style={{ opacity: 0.7, fontWeight: 400, marginLeft: 5 }}>{seg.end - seg.start}m</span>
    </a>
  );
}

export default function Cellboard20260709Page() {
  const isEmbedded = useIsEmbedded();
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [closedMap, setClosedMap] = useState<Record<string, boolean>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  const elapsedMin = elapsed / 60;
  const activeId = useMemo(
    () => (running ? SEGMENTS.find((s) => elapsedMin >= s.start && elapsedMin < s.end)?.id ?? null : null),
    [running, elapsedMin]
  );

  const remaining = TOTAL_MIN * 60 - elapsed;
  const over = remaining < 0;

  function toggleDecision(id: string) {
    setClosedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function reset() {
    setRunning(false);
    setElapsed(0);
  }

  function isOvertime(seg: SegmentDef) {
    return running && elapsedMin >= seg.end;
  }

  return (
    <div className={`${caveat.variable} ${mono.variable}`} style={{ minHeight: "100vh", background: DOTS_BG }}>
      <style jsx>{`
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.35; }
        }
      `}</style>

      {!isEmbedded && (
        <header style={{
          background: BG_PANEL, borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "16px 32px", display: "flex", alignItems: "center", gap: "16px",
        }}>
          <a href="/" style={{ fontFamily: FONT_MONO, fontSize: 12, color: MUTED_LIGHT, textDecoration: "none" }}>← Dropi PM Tools</a>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <a href="/proyectos/celula" style={{ fontFamily: FONT_MONO, fontSize: 12, color: MUTED_LIGHT, textDecoration: "none" }}>Célula</a>
          <span style={{ color: "rgba(255,255,255,0.2)" }}>/</span>
          <span style={{ fontFamily: FONT_MONO, fontSize: 12, color: TEXT_LIGHT, fontWeight: 700 }}>09 jul 2026</span>
        </header>
      )}

      <div style={{ maxWidth: 780, margin: "0 auto", padding: "36px 24px 80px" }}>

        {/* Portada del expediente */}
        <div style={{
          background: PAPER, borderRadius: 8, padding: "22px 24px 18px",
          boxShadow: "0 14px 30px rgba(0,0,0,0.4)", transform: "rotate(-0.3deg)", position: "relative",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, flexWrap: "wrap" }}>
            <div>
              <div style={{
                fontFamily: FONT_MONO, fontSize: 10.5, fontWeight: 700, color: INK_SOFT,
                textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 6,
              }}>
                Caso abierto · Célula Supplier Success
              </div>
              <h1 style={{ fontFamily: FONT_HAND, fontWeight: 700, fontSize: 40, color: INK, margin: 0, lineHeight: 1 }}>
                Expediente Célula
              </h1>
              <div style={{ fontFamily: FONT_MONO, fontSize: 11.5, color: INK_SOFT, marginTop: 6 }}>
                09 jul 2026 · Caza Productos → Categorización → Descuentos
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
              <TimerStamp remaining={remaining} over={over} running={running} />
              <div style={{ display: "flex", gap: 10, fontFamily: FONT_MONO, fontSize: 11, fontWeight: 700 }}>
                <button
                  onClick={() => setRunning((r) => !r)}
                  style={{ background: "none", border: "none", color: CAT, cursor: "pointer", padding: 0, textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  {running ? "pausar" : elapsed > 0 ? "reanudar" : "iniciar"}
                </button>
                <span style={{ color: LINE }}>·</span>
                <button
                  onClick={reset}
                  style={{ background: "none", border: "none", color: INK_SOFT, cursor: "pointer", padding: 0, textDecoration: "underline", textUnderlineOffset: 3 }}
                >
                  reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pestañas del expediente — sticky */}
        <nav style={{
          position: "sticky", top: 0, zIndex: 10,
          display: "flex", gap: 5, overflowX: "auto", padding: "14px 4px 10px",
          background: "rgba(245,240,227,0.92)", backdropFilter: "blur(8px)",
          borderBottom: `1px solid ${LINE}`, marginTop: -1,
        }}>
          {SEGMENTS.map((s) => (
            <FolderTab key={s.id} seg={s} isActive={activeId === s.id} isPast={running && elapsedMin >= s.end} />
          ))}
        </nav>

        {/* Contenido */}
        <div style={{ paddingTop: 26 }}>

          <CaseCard seg={SEGMENTS[0]} active={activeId === "apertura"} overtime={false} closed={false}>
            <p style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.6, margin: 0 }}>
              Los 3 temas de hoy salen de la <b style={{ color: INK }}>misma fuente</b>: las 2 entrevistas moderadas del 08/07 con
              <b style={{ color: INK }}> Gisela</b> (Gold Stone International, multicategoría, 4 años en Dropi) y <b style={{ color: INK }}>Andrés</b> (Katz
              Supply/Cup Play, bodega premium/verificada) — un recorrido en vivo que tocó Caza Productos,
              Categorización y Descuentos con las mismas 2 personas. Por eso están conectados: el mismatch de
              categoría que aparece en Caza Productos es la misma razón por la que Categorización importa ahora.
            </p>
          </CaseCard>

          {/* ── Caza Productos ─────────────────────────────────────── */}
          <CaseCard seg={SEGMENTS[1]} active={activeId === "caza"} overtime={isOvertime(SEGMENTS[1])} closed={!!closedMap.caza}>
            <p style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.6, marginTop: 0, marginBottom: 14 }}>
              Conversión sube a máximo histórico, pero CSAT se deteriora — señal mixta que las entrevistas ya
              empiezan a explicar.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 8, marginBottom: 12 }}>
              <Kpi label="Prov. activos" value="56 / 80" sub="meta Q3 · ratio 1:30" color={CAZA} />
              <Kpi label="Conversión" value="44.1%" sub="máx. histórico (Q2: 34.1%)" color={GOOD} />
              <Kpi label="CSAT no avanzó" value="55.6%" sub="↑ desde 42.9% en Q2" color={WARN} />
              <Kpi label="Acordó precio" value="0%" sub="↓ desde 21.4% en Q2" color={WARN} />
            </div>

            <Block kind="demo" label="Evidencia · entrevistas 08/07" accent={CAZA}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10, marginBottom: 10 }}>
                <Quote accent={CAZA} name="Gisela · Gold Stone" role="Multicategoría · 4 años en Dropi" points={[
                  "Nunca cerró un negocio a través del módulo — usó la herramienta a diario al inicio, luego bajó la frecuencia.",
                  <>Motivo principal: después de ofertar <b>no hay contraoferta ni respuesta</b> dentro de la plataforma.</>,
                  "Mismatch de categoría: la mayoría de búsquedas recientes eran de laboratorio/cremas/calzado — ella no maneja esos nichos.",
                  "Sigue negociando por WhatsApp con su base propia de 4 años, porque le funciona mejor.",
                ]} />
                <Quote accent={CAZA} name="Andrés · Katz Supply" role="Bodega premium/verificada · importador" points={[
                  "~8 de 10 productos buscados no son de su nicho.",
                  "No sabe si un producto ya tiene campaña activa (demanda validada) o es solo tanteo — duda si vale la pena cotizar.",
                  "Ofertó y no recibió respuesta dentro de la plataforma; la negociación real ocurre por WhatsApp externo.",
                ]} />
              </div>
              <p style={{ margin: 0, fontSize: 12.5, color: INK_SOFT, fontStyle: "italic" }}>
                Causa raíz común: <b style={{ color: INK }}>mismatch estructural de categoría</b> + <b style={{ color: INK }}>ausencia de un loop de negociación
                dentro del producto</b> (sin contraoferta ni señal de demanda validada).
              </p>
            </Block>

            <Block kind="decision" label="A discutir — sin desarrollo" accent={CAZA}>
              <p style={{ margin: "0 0 8px" }}>¿Qué de esto se puede mover esta semana sin pedirle nada a Dev?</p>
              <QList items={[
                <><b>Arrancar el experimento de reactivación manual</b> (15–20 proveedores premium inactivos, contacto 1:1, meta 20–30% reactivados) — ya definido, sigue &quot;por iniciar&quot;.</>,
                <><b>Curaduría manual de nicho por WhatsApp:</b> si el mismatch de categoría es la causa raíz, ¿puede Ops mandar un digest segmentado por nicho mientras la taxonomía nueva no está lista?</>,
                <><b>Puente humano al WhatsApp:</b> si la negociación real siempre termina ahí, ¿CS puede facilitar activamente esa conexión apenas hay una oferta, en vez de dejarla muda dentro de la plataforma?</>,
                <><b>Análisis Clarity profundo</b> — research puro, sin dev, insumo directo para Categorización.</>,
              ]} />
              <DecisionStamp owner="Ops/CS + Michelle" id="caza" closed={!!closedMap.caza} onToggle={toggleDecision} />
            </Block>
          </CaseCard>

          {/* ── Categorización ─────────────────────────────────────── */}
          <CaseCard seg={SEGMENTS[2]} active={activeId === "categorizacion"} overtime={isOvertime(SEGMENTS[2])} closed={!!closedMap.categorizacion}>
            <p style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.6, marginTop: 0, marginBottom: 14 }}>
              Fase 1 (taxonomía + prototipo con IA) completada. El propio doc del proyecto ya dice:
              &quot;coordinar timing con Caza Productos — dependencia directa para resolver el mismatch reportado
              ahí&quot;. Cerramos ese loop hoy mismo.
            </p>

            <Block kind="demo" label="En vivo · simulador de homologación" accent={CAT}>
              <ul style={{ margin: "0 0 10px", paddingLeft: 18 }}>
                <li><b>Typo:</b> <InlineCode>TEGNOLOGIA</InlineCode> → se corrige sola a <i>Tecnología y Electrónica</i></li>
                <li><b>Basura:</b> <InlineCode>MARIKADITAS</InlineCode>, <InlineCode>OTRO</InlineCode>, <InlineCode>GENERAL</InlineCode> → caen en <i>Sin Categorizar</i></li>
                <li><b>Campaña, no categoría:</b> <InlineCode>BLACK FRIDAY</InlineCode>, <InlineCode>DROPI LOVE</InlineCode> → agrupadas aparte</li>
              </ul>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                <Quote accent={CAT} name="Gisela · Gold Stone" role="Probó: crear producto “olla naranja”" points={[
                  <>La IA sugirió <b>Hogar › Ollas y cacerolas</b> como primera opción — la aceptó sin objeción.</>,
                  "Las otras sugerencias (repostería) no aplicaban, pero no confundieron la elección.",
                  "Hoy categoriza a mano alineando a la más cercana de las ~6-7 categorías que usa.",
                ]} />
                <Quote accent={CAT} name="Andrés · Katz Supply" role="Probó: producto de baño" points={[
                  "La IA sugirió “elemento decorativo y accesorio para baño” — lo aceptó.",
                  <>Preguntó si el criterio es categorizar <b>por el artículo en sí o por su función final</b> — ambigüedad conceptual sin resolver en el copy.</>,
                ]} />
              </div>
            </Block>

            <Block kind="decision" label="Preguntas para el equipo" accent={CAT}>
              <QList items={[
                <>La duda que dejó Andrés (¿por qué es el producto o para qué sirve?) — ¿cuál es el criterio oficial, y cómo lo aclaramos en el copy antes del piloto?</>,
                <>¿El árbol de 4 niveles (base Mercado Libre) cubre bien las categorías que hoy generan más ruido (<InlineCode>BLACK FRIDAY</InlineCode>, <InlineCode>IMPORTADOS</InlineCode>, <InlineCode>TELEVENTAS</InlineCode>), o necesitan tratamiento aparte de &quot;producto&quot;?</>,
                <>Con feedback consistentemente positivo en las 2 sesiones, ¿pasamos ya a piloto con más proveedores? ¿Cuántos y quién lo coordina?</>,
                <>Dado el mismatch que se está viendo ahora mismo en Caza Productos, ¿esto se puede esperar el ciclo normal o hay que acelerarlo?</>,
              ]} />
              <DecisionStamp owner="Jaime + equipo (voto abierto)" id="categorizacion" closed={!!closedMap.categorizacion} onToggle={toggleDecision} />
            </Block>
          </CaseCard>

          {/* ── Descuentos ──────────────────────────────────────────── */}
          <CaseCard seg={SEGMENTS[3]} active={activeId === "descuentos"} overtime={isOvertime(SEGMENTS[3])} closed={!!closedMap.descuentos}>
            <p style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.6, marginTop: 0, marginBottom: 14 }}>
              Mismas 2 personas, mismo día — probaron el prototipo de Vista Proveedor (crear descuento por %
              o valor fijo, con fecha fin o límite de unidades).
            </p>

            <Block kind="demo" label="Evidencia · feedback recogido 08/07" accent={DESC}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
                <Quote accent={DESC} name="Gisela · Gold Stone" role="" points={[
                  "Validó el set de reglas como completo — no pidió nada adicional.",
                  "Usaría más el valor fijo (ya tiene el precio pre-calculado).",
                  "La fecha fin automática resuelve un problema real: hoy se le olvida revertir el precio y el descuento queda activo por error.",
                ]} />
                <Quote accent={DESC} name="Andrés · Katz Supply" role="" points={[
                  <>Reacción muy positiva a la vista &quot;antes/ahora&quot; tachada.</>,
                  <><b>Riesgo:</b> sugirió subir el precio antes de aplicar el descuento para que se vea más grande — precio-ancla falso a prevenir con política de producto.</>,
                  "Propuso que el feature sea exclusivo para bodegas premium/verificadas.",
                  "Aparte (fuera de alcance): señaló “bodegas falsas” que distorsionan precios en catálogo — hallazgo para verificación de proveedores.",
                ]} />
              </div>
            </Block>

            <Block kind="decision" label="Preguntas para el equipo" accent={DESC}>
              <QList items={[
                <>Precio-ancla falso: ¿piso mínimo de descuento o validación contra histórico de precio — cuál mecanismo, y quién lo especifica?</>,
                <>La propuesta de Andrés de limitarlo a bodegas premium/verificadas — ¿la adoptamos como regla de elegibilidad de la Fase 1, o es muy restrictivo?</>,
                <>El hallazgo de &quot;bodegas falsas&quot; es de otro proyecto (verificación de proveedores) — ¿a quién se lo pasamos hoy mismo?</>,
                <>Riesgo wallet: ¿ya lo confirmó José Giraldo (TI)? Si no, fecha esta semana — Cyber Days no espera.</>,
              ]} />
              <DecisionStamp owner="Jaime + TI" id="descuentos" closed={!!closedMap.descuentos} onToggle={toggleDecision} />
            </Block>
          </CaseCard>

          <CaseCard seg={SEGMENTS[4]} active={activeId === "cierre"} overtime={false} closed={false}>
            <p style={{ fontSize: 13.5, color: INK_SOFT, lineHeight: 1.6, margin: 0 }}>
              Repasar qué decisión quedó cerrada (✓) y cuál sigue pendiente con dueño y fecha. Las 3
              conversaciones de hoy dependen de las mismas 2 personas — vale la pena abrir una tercera ronda de
              entrevistas con perfiles distintos antes de escalar cualquiera de los 3 proyectos.
            </p>
          </CaseCard>

        </div>

        <footer style={{
          textAlign: "center", fontFamily: FONT_MONO, fontSize: 11, color: MUTED_LIGHT,
          marginTop: 30, paddingTop: 18, borderTop: "1px dashed rgba(255,255,255,0.15)",
        }}>
          contenido armado a partir del estado real de cada proyecto · verificar cifras en vivo antes de darlas por vigentes
        </footer>
      </div>
    </div>
  );
}
