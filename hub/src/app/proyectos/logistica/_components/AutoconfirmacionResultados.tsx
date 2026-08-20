"use client";

import { SectionTitle } from "@/app/proyectos/logistica/_components/ui";

import { useEffect, useRef } from "react";

// ── Data ────────────────────────────────────────────────────────────────────

const SCORES = [
  { label: "Accesibilidad", score: 72, color: "var(--positive, #1b7f56)", ring: "var(--positive-ring, #22c77e)", target: 70.37, sub: "2 de 6 tardaron +60s en encontrar el flujo" },
  { label: "Claridad", score: 58, color: "var(--warning, #b87016)", ring: "var(--warning-ring, #e8a020)", target: 105.56, sub: "4 de 6 no entendieron el impacto económico" },
  { label: "Satisfacción", score: 81, color: "var(--positive, #1b7f56)", ring: "var(--positive-ring, #22c77e)", target: 47.75, sub: "5 de 6 lo usarían si ven su ganancia" },
];

const TASKS = [
  { id: "T1", name: "Localizar", ok: 83.3, partial: 16.7, fail: 0, pct: "83%" },
  { id: "T2", name: "Configurar regla", ok: 100, partial: 0, fail: 0, pct: "100%" },
  { id: "T3", name: "Calcular", ok: 83.3, partial: 16.7, fail: 0, pct: "83%" },
  { id: "T4", name: "Interpretar", ok: 16.7, partial: 50, fail: 33.3, pct: "17%", critical: true },
  { id: "T5", name: "Guardar", ok: 100, partial: 0, fail: 0, pct: "100%" },
];

type CellResult = "ok" | "partial" | "fail";
type ParticipantRow = { name: string; cells: { result: CellResult; tip: string }[] };

const PARTICIPANTS: ParticipantRow[] = [
  { name: "Leonardo Fabio E.", cells: [
    { result: "ok", tip: "✓ 45s" }, { result: "ok", tip: "✓ 30s" }, { result: "ok", tip: "✓ 15s" },
    { result: "partial", tip: "Parcial 90s — no vio ganancia" }, { result: "ok", tip: "✓ 8s" },
  ]},
  { name: "Valeria Obando", cells: [
    { result: "ok", tip: "✓ 62s" }, { result: "ok", tip: "✓ 45s" }, { result: "ok", tip: "✓ 22s" },
    { result: "fail", tip: "Fallo — no entendió veredictos" }, { result: "ok", tip: "✓ 10s" },
  ]},
  { name: "Jorge Gallardo R.", cells: [
    { result: "ok", tip: "✓ 28s" }, { result: "ok", tip: "✓ 22s" }, { result: "ok", tip: "✓ 12s" },
    { result: "partial", tip: "Parcial 55s — pidió ver fletes" }, { result: "ok", tip: "✓ 6s" },
  ]},
  { name: "Maria Naranjo", cells: [
    { result: "partial", tip: "Parcial 78s — necesitó ayuda" }, { result: "ok", tip: "✓ 58s" },
    { result: "partial", tip: "Parcial 35s — no vio el botón" }, { result: "fail", tip: "Fallo — no interpretó resultados" },
    { result: "ok", tip: "✓ 14s" },
  ]},
  { name: "Diego Torres", cells: [
    { result: "ok", tip: "✓ 22s" }, { result: "ok", tip: "✓ 18s" }, { result: "ok", tip: "✓ 8s" },
    { result: "ok", tip: "✓ 40s — sugirió ver pérdida" }, { result: "ok", tip: "✓ 5s" },
  ]},
  { name: "Merly Arango", cells: [
    { result: "ok", tip: "✓ 35s" }, { result: "ok", tip: "✓ 32s" }, { result: "ok", tip: "✓ 16s" },
    { result: "partial", tip: "Parcial 70s — quería ver pérdida" }, { result: "ok", tip: "✓ 8s" },
  ]},
];

type Severity = "critical" | "high" | "medium" | "low";
type Finding = { severity: Severity; title: string; freq: string; body: string; quote?: string };

const FINDINGS: Finding[] = [
  { severity: "critical", title: "No se visualiza el impacto en ganancia", freq: "5/6",
    body: "El simulador muestra auto vs manual pero no refleja cuánto gana o pierde el usuario con cada configuración.",
    quote: "\"Se pierde el mapeo de la ganancia en la confirmación de la automatización.\" — Leonardo Fabio E." },
  { severity: "high", title: "Sin precios de flete por transportadora", freq: "4/6",
    body: "Los usuarios necesitan ver cuánto cobra cada transportadora para definir el tope de flete con criterio.",
    quote: "\"Transparencia de transportadoras y fletes dentro de las reglas.\" — Leonardo Fabio E., Jorge Gallardo R." },
  { severity: "high", title: "Sin alerta visual de pérdida potencial", freq: "4/6",
    body: "El veredicto \"auto\" se muestra en verde sin distinguir si es rentable o genera pérdida.",
    quote: "\"Diferenciación visual de posible pérdida antes de guardar reglas.\" — Leonardo Fabio E., Merly Arango" },
  { severity: "medium", title: "Separar en tabs Manual vs Automatización", freq: "3/6",
    body: "Usuarios sugirieron una pestaña para órdenes manuales y otra para automatización, en lugar de un toggle único." },
  { severity: "medium", title: "Posible solapamiento con tools existentes", freq: "2/6",
    body: "Los usuarios más experimentados preguntaron si ya existen herramientas de automatización y si esto genera doble trabajo.",
    quote: "\"Revisar si ya hay automatizaciones por parte de los sellers… o si se hace doble trabajo.\" — Leonardo Fabio E., Diego Torres" },
  { severity: "low", title: "Sin historial de transportadoras por cliente", freq: "2/6",
    body: "Algunos usuarios quisieran ver con cuáles transportadoras se le ha entregado a cada cliente para tomar mejores decisiones." },
];

const IMPROVEMENTS = [
  { n: 1, tier: 1, text: "Preview de impacto en ganancia/pérdida por orden en el simulador", freq: "5/6" },
  { n: 2, tier: 1, text: "Tabla de precios de flete por transportadora dentro del modal", freq: "4/6" },
  { n: 3, tier: 1, text: "Indicadores rojo/amarillo para órdenes con pérdida potencial", freq: "4/6" },
  { n: 4, tier: 2, text: "Dos pestañas: confirmación manual vs reglas de automatización", freq: "3/6" },
  { n: 5, tier: 2, text: "Historial de transportadoras que han entregado al cliente", freq: "2/6" },
  { n: 6, tier: 3, text: "Validar con operaciones si existen herramientas de automatización previas", freq: "2/6" },
];

const PPL = [
  { initials: "LF", name: "Leonardo Fabio E.", info: "Dropshipper · 3a · grabado", color: "#e48832" },
  { initials: "VO", name: "Valeria Obando", info: "Dropshipper · 1a", color: "#6366f1" },
  { initials: "JG", name: "Jorge Gallardo R.", info: "Proveedor · 2a", color: "#1b7f56" },
  { initials: "MN", name: "Maria Naranjo", info: "Dropshipper · 4m", color: "#e05080" },
  { initials: "DT", name: "Diego Torres", info: "Prov+Drop · 2.5a", color: "#3572b0" },
  { initials: "MA", name: "Merly Arango", info: "Dropshipper · 1.5a", color: "#b87016" },
];

// ── Styles (scoped via className prefix) ────────────────────────────────────

const S = `
.ut-donuts { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 28px; }
.ut-donut { background: var(--card, #fff); border: 1px solid var(--border); border-radius: 12px; padding: 22px 16px; text-align: center; }
.ut-donut svg { width: 120px; height: 120px; margin: 0 auto 10px; display: block; }
.ut-donut-track { fill: none; stroke: var(--border); stroke-width: 7; }
.ut-donut-ring { fill: none; stroke-width: 7; stroke-linecap: round; transform-origin: center; transform: rotate(-90deg); transition: stroke-dashoffset 1.2s cubic-bezier(.4,0,.2,1); }
.ut-donut-num { font-size: 32px; font-weight: 700; font-variant-numeric: tabular-nums; }
.ut-donut-max { font-size: 12px; fill: var(--muted); }
.ut-donut-label { font-size: 13px; font-weight: 600; color: var(--fg); margin-bottom: 3px; }
.ut-donut-sub { font-size: 12px; color: var(--muted); line-height: 1.4; }

.ut-tasks { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
.ut-task { display: grid; grid-template-columns: 120px 1fr 42px; align-items: center; gap: 12px; }
.ut-task-name { font-size: 12px; color: var(--muted); text-align: right; line-height: 1.3; }
.ut-task-name strong { display: block; color: var(--fg); font-weight: 600; font-size: 13px; }
.ut-task-bar { height: 26px; border-radius: 4px; background: var(--border); overflow: hidden; display: flex; }
.ut-seg { height: 100%; transition: width 1s cubic-bezier(.4,0,.2,1); }
.ut-seg-ok { background: #22c77e; }
.ut-seg-partial { background: #e8a020; }
.ut-seg-fail { background: #e85050; }
.ut-task-pct { font-size: 13px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; color: var(--fg); }

.ut-heat { background: var(--card, #fff); border: 1px solid var(--border); border-radius: 12px; padding: 18px 20px; overflow-x: auto; margin-bottom: 28px; }
.ut-hm { display: grid; grid-template-columns: 140px repeat(5, 1fr); gap: 0; min-width: 500px; }
.ut-hm-head { font-size: 11px; font-weight: 600; letter-spacing: 0.03em; text-transform: uppercase; color: var(--muted); text-align: center; padding: 0 0 10px; }
.ut-hm-head:first-child { text-align: left; }
.ut-hm-name { font-size: 13px; color: var(--fg); font-weight: 500; display: flex; align-items: center; padding: 8px 0; border-top: 1px solid var(--border); }
.ut-hm-cell { display: flex; align-items: center; justify-content: center; padding: 8px 0; border-top: 1px solid var(--border); position: relative; cursor: default; }
.ut-hm-dot { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 700; transition: transform .15s ease; }
.ut-hm-cell:hover .ut-hm-dot { transform: scale(1.2); }
.ut-hm-cell:hover::after { content: attr(data-tip); position: absolute; bottom: calc(100% + 4px); left: 50%; transform: translateX(-50%); font-size: 11px; font-weight: 500; white-space: nowrap; padding: 4px 8px; border-radius: 4px; background: var(--fg); color: var(--card, #fff); pointer-events: none; z-index: 2; }
.ut-ok .ut-hm-dot { background: rgba(27,127,86,0.1); color: #1b7f56; }
.ut-partial .ut-hm-dot { background: rgba(184,112,22,0.1); color: #b87016; }
.ut-fail .ut-hm-dot { background: rgba(190,50,50,0.08); color: #be3232; }
.ut-legend { display: flex; gap: 16px; margin-top: 14px; justify-content: center; }
.ut-legend-item { display: flex; align-items: center; gap: 5px; font-size: 11.5px; color: var(--muted); }
.ut-legend-dot { width: 10px; height: 10px; border-radius: 50%; }

.ut-findings { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 28px; }
.ut-finding { background: var(--card, #fff); border: 1px solid var(--border); border-left-width: 3px; border-radius: 8px; overflow: hidden; }
.ut-finding[open] { background: var(--bg, #fafafa); }
.ut-f-critical { border-left-color: #be3232; }
.ut-f-high { border-left-color: #b87016; }
.ut-f-medium { border-left-color: #e48832; }
.ut-f-low { border-left-color: var(--muted); }
.ut-f-sum { padding: 12px 14px; cursor: pointer; list-style: none; display: flex; align-items: start; gap: 8px; }
.ut-f-sum::-webkit-details-marker { display: none; }
.ut-f-sev { font-size: 9.5px; font-weight: 700; letter-spacing: 0.05em; text-transform: uppercase; padding: 2px 7px; border-radius: 3px; white-space: nowrap; flex-shrink: 0; margin-top: 1px; }
.ut-f-critical .ut-f-sev { background: rgba(190,50,50,0.08); color: #be3232; }
.ut-f-high .ut-f-sev { background: rgba(184,112,22,0.08); color: #b87016; }
.ut-f-medium .ut-f-sev { background: rgba(228,136,50,0.09); color: #e48832; }
.ut-f-low .ut-f-sev { background: var(--bg, #fafafa); color: var(--muted); }
.ut-f-text { flex: 1; min-width: 0; }
.ut-f-title { font-size: 13px; font-weight: 600; color: var(--fg); line-height: 1.35; }
.ut-f-expand { font-size: 11px; color: var(--muted); margin-top: 3px; display: block; }
.ut-finding[open] .ut-f-expand { display: none; }
.ut-f-freq { font-size: 11px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; white-space: nowrap; flex-shrink: 0; margin-top: 2px; }
.ut-f-body { padding: 0 14px 14px; font-size: 12.5px; color: var(--muted); line-height: 1.5; }
.ut-f-quote { font-style: italic; margin-top: 6px; padding-left: 8px; border-left: 2px solid var(--border); font-size: 12px; }

.ut-imps { background: var(--card, #fff); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; margin-bottom: 28px; }
.ut-imp { display: grid; grid-template-columns: 32px 1fr auto; align-items: center; gap: 10px; padding: 11px 14px; border-bottom: 1px solid var(--border); }
.ut-imp:last-child { border-bottom: none; }
.ut-imp-n { width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; font-family: 'IBM Plex Mono', monospace; flex-shrink: 0; }
.ut-imp-n1 { background: rgba(190,50,50,0.08); color: #be3232; }
.ut-imp-n2 { background: rgba(184,112,22,0.08); color: #b87016; }
.ut-imp-n3 { background: rgba(228,136,50,0.09); color: #e48832; }
.ut-imp-text { font-size: 13px; color: var(--fg); line-height: 1.4; }
.ut-imp-freq { font-size: 11px; color: var(--muted); font-family: 'IBM Plex Mono', monospace; }

.ut-verdict { background: rgba(228,136,50,0.09); border: 1px solid var(--border); border-radius: 12px; padding: 16px 18px; display: grid; grid-template-columns: auto 1fr; gap: 12px; align-items: start; margin-bottom: 28px; }
.ut-verdict-icon { font-size: 24px; line-height: 1; }
.ut-verdict-text { font-size: 13.5px; color: var(--fg); line-height: 1.55; }
.ut-verdict-text strong { color: var(--dropi, #e48832); font-weight: 600; }

.ut-foot { border-top: 1px solid var(--border); padding-top: 20px; }
.ut-foot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
.ut-foot-title { font-size: 11px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.ut-ppl { display: flex; flex-direction: column; gap: 4px; }
.ut-ppl-row { display: flex; align-items: center; gap: 8px; font-size: 12.5px; }
.ut-avatar { width: 22px; height: 22px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 9px; font-weight: 700; color: #fff; flex-shrink: 0; }
.ut-ppl-name { color: var(--fg); font-weight: 500; }
.ut-ppl-info { color: var(--muted); font-size: 11.5px; }
.ut-method { list-style: none; display: flex; flex-direction: column; gap: 5px; padding: 0; }
.ut-method li { font-size: 12.5px; color: var(--muted); display: flex; gap: 6px; }
.ut-method li::before { content: ''; width: 4px; height: 4px; border-radius: 50%; background: var(--muted); flex-shrink: 0; margin-top: 7px; }

@media (max-width: 700px) {
  .ut-donuts { grid-template-columns: 1fr; }
  .ut-task { grid-template-columns: 90px 1fr 38px; }
  .ut-findings { grid-template-columns: 1fr; }
  .ut-foot-grid { grid-template-columns: 1fr; }
}
`;

const SEV_LABELS: Record<Severity, string> = { critical: "Crítico", high: "Alto", medium: "Medio", low: "Bajo" };
const CELL_ICONS: Record<CellResult, string> = { ok: "✓", partial: "~", fail: "✗" };

export default function AutoconfirmacionResultados() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const timer = setTimeout(() => {
      el.querySelectorAll<SVGCircleElement>(".ut-donut-ring").forEach((r) => {
        r.style.strokeDashoffset = r.dataset.target!;
      });
      el.querySelectorAll<HTMLElement>(".ut-seg").forEach((s) => {
        s.style.width = s.dataset.w + "%";
      });
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={ref}>
      <style>{S}</style>

      {/* Score donuts */}
      <SectionTitle>Métricas conductuales</SectionTitle>
      <div className="ut-donuts">
        {SCORES.map((s) => (
          <div key={s.label} className="ut-donut">
            <svg viewBox="0 0 100 100">
              <circle className="ut-donut-track" cx="50" cy="50" r="40" />
              <circle className="ut-donut-ring" cx="50" cy="50" r="40"
                stroke={s.ring} strokeDasharray="251.33"
                strokeDashoffset="251.33" data-target={String(s.target)} />
              <text x="50" y="44" textAnchor="middle" dominantBaseline="central"
                className="ut-donut-num" fill={s.color}>{s.score}</text>
              <text x="50" y="58" textAnchor="middle" dominantBaseline="hanging"
                className="ut-donut-max">/100</text>
            </svg>
            <div className="ut-donut-label">{s.label}</div>
            <div className="ut-donut-sub">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Task bars */}
      <SectionTitle>Tasa de éxito por tarea</SectionTitle>
      <div className="ut-tasks">
        {TASKS.map((t) => (
          <div key={t.id} className="ut-task">
            <div className="ut-task-name"><strong>{t.id}</strong>{t.name}</div>
            <div className="ut-task-bar">
              {t.ok > 0 && <div className="ut-seg ut-seg-ok" style={{ width: 0 }} data-w={t.ok} />}
              {t.partial > 0 && <div className="ut-seg ut-seg-partial" style={{ width: 0 }} data-w={t.partial} />}
              {t.fail > 0 && <div className="ut-seg ut-seg-fail" style={{ width: 0 }} data-w={t.fail} />}
            </div>
            <div className="ut-task-pct" style={t.critical ? { color: "#be3232" } : undefined}>{t.pct}</div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <SectionTitle>Detalle por participante</SectionTitle>
      <div className="ut-heat">
        <div className="ut-hm">
          <div className="ut-hm-head" />
          {["T1", "T2", "T3", "T4", "T5"].map((t) => <div key={t} className="ut-hm-head">{t}</div>)}
          {PARTICIPANTS.map((p) => (
            <>
              <div key={p.name} className="ut-hm-name">{p.name}</div>
              {p.cells.map((c, i) => (
                <div key={i} className={`ut-hm-cell ut-${c.result}`} data-tip={c.tip}>
                  <span className="ut-hm-dot">{CELL_ICONS[c.result]}</span>
                </div>
              ))}
            </>
          ))}
        </div>
        <div className="ut-legend">
          <span className="ut-legend-item"><span className="ut-legend-dot" style={{ background: "#1b7f56" }} />Éxito</span>
          <span className="ut-legend-item"><span className="ut-legend-dot" style={{ background: "#e8a020" }} />Parcial</span>
          <span className="ut-legend-item"><span className="ut-legend-dot" style={{ background: "#e85050" }} />Fallo</span>
        </div>
      </div>

      {/* Findings */}
      <SectionTitle>Hallazgos clave</SectionTitle>
      <div className="ut-findings">
        {FINDINGS.map((f) => (
          <details key={f.title} className={`ut-finding ut-f-${f.severity}`}>
            <summary className="ut-f-sum">
              <span className="ut-f-sev">{SEV_LABELS[f.severity]}</span>
              <span className="ut-f-text">
                <span className="ut-f-title">{f.title}</span>
                <span className="ut-f-expand">Click para detalle</span>
              </span>
              <span className="ut-f-freq">{f.freq}</span>
            </summary>
            <div className="ut-f-body">
              {f.body}
              {f.quote && <div className="ut-f-quote">{f.quote}</div>}
            </div>
          </details>
        ))}
      </div>

      {/* Improvements */}
      <SectionTitle>Mejoras priorizadas</SectionTitle>
      <div className="ut-imps">
        {IMPROVEMENTS.map((imp) => (
          <div key={imp.n} className="ut-imp">
            <div className={`ut-imp-n ut-imp-n${imp.tier}`}>{imp.n}</div>
            <div className="ut-imp-text">{imp.text}</div>
            <div className="ut-imp-freq">{imp.freq}</div>
          </div>
        ))}
      </div>

      {/* Verdict */}
      <div className="ut-verdict">
        <div className="ut-verdict-icon">⚠️</div>
        <div className="ut-verdict-text">
          Alta aceptación del concepto (81/100), pero <strong>no puede ir a producción sin visibilidad de impacto económico</strong>. La tarea T4 (interpretar resultados) tiene solo 17% de éxito. Las 3 mejoras críticas giran alrededor del mismo eje: el usuario necesita saber cuánto gana o pierde con cada regla.
        </div>
      </div>

      {/* Footer */}
      <div className="ut-foot">
        <div className="ut-foot-grid">
          <div>
            <div className="ut-foot-title">Participantes</div>
            <div className="ut-ppl">
              {PPL.map((p) => (
                <div key={p.initials} className="ut-ppl-row">
                  <span className="ut-avatar" style={{ background: p.color }}>{p.initials}</span>
                  <span className="ut-ppl-name">{p.name}</span>
                  <span className="ut-ppl-info">{p.info}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="ut-foot-title">Metodología</div>
            <ul className="ut-method">
              <li>Pruebas moderadas remotas vía Google Meet</li>
              <li>30–45 min por sesión</li>
              <li>5 tareas sobre flujo de autoconfirmación</li>
              <li>Prototipo Angular en vivo (RPP)</li>
              <li>Facilitado por Michel Pino (Producto)</li>
              <li>18–25 julio 2026</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
