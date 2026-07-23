"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Anton } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Display condensada para titulares, cronómetros y watermark — es lo que
// acerca la página al lenguaje tipográfico del board de referencia (el título
// del sistema anterior usaba la fuente del sistema y no se parecía en nada).
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-cyber" });

type EligibleProduct = { id: string | number; name: string; category?: string; stock?: number; image?: string };
type JourneyStep = { key: "seleccion" | "curaduria" | "fotos" | "vivo"; label: string; window: string; state: "hecho" | "actual" | "bloqueado"; end: string };
type ChecklistKey = "nombre" | "categoria" | "fotoDropi" | "fotoCanva";
type EligibleEntry = {
  supplier_name: string;
  products: EligibleProduct[];
  selectedProductIds?: (string | number)[];
  submitted_at?: string | null;
  selection_updated_at?: string | null;
  approved_at?: string | null;
  readyChecklist?: Partial<Record<ChecklistKey, boolean>>;
  journey: JourneyStep[];
};

const MAX_PRODUCTS = 10;
const CHECKLIST_KEYS: ChecklistKey[] = ["nombre", "categoria", "fotoDropi", "fotoCanva"];

// Pendientes de Enrique (Canva) y Marketing (herramienta del marco) — hasta
// que lleguen los links reales, la sección se ve construida pero honesta
// sobre que el link todavía no existe (no un botón roto).
const CANVA_LINK = "";
const MARCO_LINK = "";
// Evento de Luma para el Meet del 24 de julio — cuando Michelle pase el
// link, la card del Meet se vuelve clickeable con "Agéndate →".
const LUMA_LINK = "";

const STEPPER_LABELS: Record<JourneyStep["key"], string> = {
  seleccion: "Elige", curaduria: "Revisión", fotos: "Prepara", vivo: "En vivo",
};

// Título grande de la fase que se está viendo (va fuera de la tarjeta, bajo
// el stepper) y la etiqueta de su cronómetro. Indexados por posición de fase.
const PHASE_VIEW_TITLES = ["Elige tus productos", "En revisión", "Prepara tus productos", "Cyber Days en vivo"];
const PHASE_TIMER_LABELS = ["La selección cierra en", "La revisión termina en", "Tiempo para tenerlo listo", "Cyber Days termina en"];
// Vista previa de QA (solo dev): ?vista=<fase> fuerza el estado de las fases
// para revisar cada pantalla sin mover las fechas reales de route.ts.
const PREVIEW_ORDER: Record<string, number> = { seleccion: 0, curaduria: 1, fotos: 2, vivo: 3, cierre: 4 };
const PREVIEW_TABS: { key: string; label: string }[] = [
  { key: "seleccion", label: "1 Selección" }, { key: "curaduria", label: "2 Revisión" },
  { key: "fotos", label: "3 Fotos" }, { key: "vivo", label: "4 En vivo" }, { key: "cierre", label: "5 Cierre" },
];
const IS_DEV = process.env.NODE_ENV === "development";

// Ícono + color por categoría — es el fallback cuando el producto no tiene
// miniatura en /cyberdays/productos/ (ver ProductThumb). Consistentes entre
// recargas, no aleatorios.
const CATEGORY_ICONS: { match: string; emoji: string }[] = [
  { match: "ROPA", emoji: "👕" }, { match: "CALZADO", emoji: "👟" },
  { match: "HOME", emoji: "🏠" }, { match: "HOGAR", emoji: "🏠" },
  { match: "BELLEZA", emoji: "💄" }, { match: "SALUD", emoji: "💊" },
  { match: "TECNO", emoji: "🎧" }, { match: "ELECTR", emoji: "🔌" },
  { match: "DEPORTE", emoji: "⚽" }, { match: "JUGUETE", emoji: "🧸" },
  { match: "MASCOTA", emoji: "🐾" }, { match: "COCINA", emoji: "🍳" },
  { match: "BEBE", emoji: "🍼" }, { match: "JOYER", emoji: "💍" },
  { match: "ACCESORIO", emoji: "👜" }, { match: "SUPLEMENTO", emoji: "🌿" },
];
const CATEGORY_COLORS = ["#2dd4bf", "#60a5fa", "#a78bfa", "#fbbf24", "#fb7185", "#34d399", "#94a3b8"];

// Las miniaturas viven en /cyberdays/productos/{id}.webp (generadas del
// drive de fotos de Juan). No toda tarjeta tiene foto (137 productos sin
// foto reclamable) — si el archivo no existe, el onError devuelve el emoji.
function ProductThumb({ id, image, emoji }: { id: string | number; image?: string; emoji: string }) {
  const [failed, setFailed] = useState(false);
  const src = image || `/cyberdays/productos/${id}.webp`;
  if (failed) return <>{emoji}</>;
  return <img src={src} alt="" loading="lazy" onError={() => setFailed(true)} />;
}

function categoryVisual(category?: string) {
  const key = (category || "").toUpperCase();
  const emoji = CATEGORY_ICONS.find((c) => key.includes(c.match))?.emoji ?? "📦";
  let hash = 0;
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) % 997;
  return { emoji, color: CATEGORY_COLORS[hash % CATEGORY_COLORS.length] };
}

// Página pública (sin login) para un proveedor: el panel completo de su
// participación en Cyber Days — reemplaza el formulario de postulación.
// Identificada por un token opaco en la URL, no por su ID de proveedor, para
// que no pueda ver la postulación de otro cambiando la URL.
//
// Estilo deliberadamente distinto al resto del Hub (que es claro/papel): esta
// es la única pantalla que un proveedor real ve directo, entra por WhatsApp
// desde la pieza de convocatoria — lleva la energía neón/oscura de esa pieza.
//
// Rediseño 18/07/2026 (cuarta pasada), guiado por el board de assets y el
// storyboard de 8 pantallas que Michelle trajo como referencia de layout:
// - Desktop arreglado: un solo riel de ancho (1060px) compartido por hero y
//   cuerpo. La versión anterior tenía el hero sin max-width contra un cuerpo
//   de 920px — dos rieles distintos, se veía roto en pantallas anchas.
// - Hero estilo mockup 0: texto a la izquierda, la persona de la imagen a la
//   derecha (en desktop la imagen se recorta a su mitad derecha con un mask
//   de fundido, porque la mitad izquierda trae el titular quemado en píxeles
//   y en viewports anchos aparecía cortado detrás del <h1> real). Cuando
//   llegue el fondo limpio sin texto (pendiente de generar en ChatGPT), solo
//   se reemplaza el archivo hero-cyberdays.png.
// - Animaciones (revisadas con web-animation-design): reveals por
//   IntersectionObserver al entrar en viewport (antes animaban al cargar con
//   delays fijos y ya habían corrido cuando el usuario bajaba), scramble del
//   titular, count-up de cifras, brasas flotantes solo con transform/opacity,
//   glows sin filter:blur (radial-gradients pre-difuminados — blur de 70px
//   era carísimo en Safari/móvil), ease-out cubic en entradas, scale(.97) en
//   :active, hover solo con puntero fino. Todo apagado si el usuario pide
//   reduced motion (el modo anim ni se activa).
// - Cronómetros de 3 celdas DÍAS/HORAS/MIN como el board (incluido el que
//   faltaba en la fase de selección), recibo con check hexagonal y fecha de
//   envío (mockup 2), barra de progreso "X de 4" en el checklist (mockup 4),
//   dato real de dropi.co en la espera de revisión (el "+60% de interacción"
//   del mockup era un número inventado por ChatGPT — no se muestra), botón
//   de copiar link del catálogo en vivo (mockup 5).
// - Sin sidebar (decidido: no hay login ni multi-campaña) y sin pantallas de
//   métricas en vivo (visualizaciones/pedidos/ventas del mockup 6-7): no
//   existe fuente de datos real conectada y esta página la ven proveedores
//   reales — nada de números inventados.

const CSS = `
  html { scroll-behavior: smooth; }
  .cd-page {
    --cd-bg: #0c0705;
    --cd-ink: #fdf4ea;
    --cd-muted: #cdb7a3;
    --cd-muted-2: #a68a75;
    --cd-accent: #ff8a2b;
    --cd-accent-2: #ff3d1a;
    --cd-card: #1a100a;
    --cd-card-border: #3c2617;
    --cd-done: #34d399;
    --cd-ease-out: cubic-bezier(0.215, 0.61, 0.355, 1);
    --cd-display: var(--font-cyber), "Arial Narrow", Impact, sans-serif;
    min-height: 100vh;
    overflow-x: hidden;
    background:
      radial-gradient(circle at 20% 6%, rgba(255,138,43,.2), transparent 46%),
      radial-gradient(circle at 84% 70%, rgba(255,61,26,.14), transparent 50%),
      var(--cd-bg);
    color: var(--cd-ink);
    font-family: -apple-system, "Segoe UI", ui-sans-serif, Roboto, system-ui, sans-serif;
  }

  /* Un solo riel de ancho para TODO (hero incluido) — el desktop roto venía
     de tener el hero full-bleed sin max-width contra un cuerpo de 920px. */
  .cd-rail { max-width: 1060px; margin: 0 auto; padding-left: 20px; padding-right: 20px; }
  .cd-wrap { padding-top: 8px; padding-bottom: 64px; }

  /* ─── Hero ───
     Dos alturas: pantalla completa mientras "participar" es la acción
     pendiente (el botón cobra sentido: el panel vive bajo el fold y el clic
     te lleva allá), compacto una vez postulado o en fases posteriores (ahí
     el punto es el panel, no el pitch — y el botón desaparece). */
  .cd-hero { position: relative; min-height: 46vh; display: flex; }
  @media (min-width: 860px) { .cd-hero { min-height: min(48vh, 460px); } }
  .cd-hero--full { min-height: 100vh; min-height: 100dvh; }
  .cd-hero-media { position: absolute; inset: 0; overflow: hidden; }
  .cd-hero-media img { width: 100%; height: 100%; object-fit: cover; object-position: 92% 20%; display: block; }
  @media (min-width: 860px) {
    .cd-hero-media img {
      width: 56%; margin-left: auto; object-position: 100% 18%;
      -webkit-mask-image: linear-gradient(90deg, transparent, #000 26%);
      mask-image: linear-gradient(90deg, transparent, #000 26%);
    }
  }
  .cd-hero-scrim { position: absolute; inset: 0; pointer-events: none; }
  .cd-hero-scrim::before { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(12,7,5,.6), rgba(12,7,5,.25) 38%, rgba(12,7,5,.55) 72%, var(--cd-bg) 100%); }
  @media (min-width: 860px) {
    .cd-hero-scrim::before { background: linear-gradient(90deg, rgba(12,7,5,.94) 34%, rgba(12,7,5,.55) 56%, rgba(12,7,5,.15)), linear-gradient(0deg, var(--cd-bg), transparent 26%); }
  }
  /* Halftone del board — grilla de puntos sutil sobre el hero */
  .cd-dots { position: absolute; inset: 0; pointer-events: none; background-image: radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px); background-size: 22px 22px; opacity: .045; }
  /* Glows sin filter:blur — el blur(70px) anterior era muy costoso en móvil */
  .cd-glow { position: absolute; border-radius: 50%; pointer-events: none; width: 420px; height: 420px; }
  .cd-glow--a { top: -120px; right: 4%; background: radial-gradient(circle, rgba(255,138,43,.32), rgba(255,138,43,0) 65%); }
  .cd-glow--b { bottom: -100px; left: -60px; background: radial-gradient(circle, rgba(255,61,26,.25), rgba(255,61,26,0) 65%); }
  .cd-anim .cd-glow--a { animation: cd-float-a 9s ease-in-out infinite; }
  .cd-anim .cd-glow--b { animation: cd-float-b 11s ease-in-out infinite; }
  @keyframes cd-float-a { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(-20px, 16px); } }
  @keyframes cd-float-b { 0%, 100% { transform: translate(0,0); } 50% { transform: translate(22px, -14px); } }
  /* Brasas — solo transform/opacity, se renderizan únicamente en modo anim */
  .cd-embers { position: absolute; inset: 0; overflow: hidden; pointer-events: none; }
  .cd-embers span { position: absolute; bottom: -12px; width: 5px; height: 5px; border-radius: 50%; background: radial-gradient(circle, rgba(255,175,90,.9), rgba(255,90,26,0) 70%); opacity: 0; animation: cd-ember linear infinite; }
  @keyframes cd-ember { 0% { transform: translateY(0) scale(var(--s, .8)); opacity: 0; } 8% { opacity: .65; } 100% { transform: translateY(-76vh) translateX(16px) scale(var(--s, .8)); opacity: 0; } }

  .cd-hero-inner { position: relative; z-index: 2; width: 100%; display: flex; flex-direction: column; padding-top: 24px; padding-bottom: 36px; }
  .cd-hero-spacer { flex: 1; min-height: 60px; }
  .cd-hero-copy { max-width: 34rem; }

  .cd-topbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  .cd-topbar-brand { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--cd-accent); }
  .cd-topbar-logo { height: 24px; width: auto; display: block; }
  .cd-topbar-supplier { display: flex; align-items: center; gap: 8px; background: rgba(26,16,10,.85); border: 1px solid var(--cd-card-border); border-radius: 999px; padding: 5px 14px 5px 5px; font-size: 12.5px; font-weight: 700; color: var(--cd-ink); max-width: 60vw; }
  .cd-topbar-avatar { width: 24px; height: 24px; border-radius: 50%; background: linear-gradient(135deg, var(--cd-accent), var(--cd-accent-2)); display: flex; align-items: center; justify-content: center; font-size: 10.5px; font-weight: 900; color: #1a0d05; flex-shrink: 0; }
  .cd-topbar-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  .cd-eyebrow { font-size: 13px; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: var(--cd-accent); margin-bottom: 10px; }
  .cd-title {
    font-family: var(--cd-display);
    font-weight: 400;
    font-size: clamp(38px, 8vw, 72px);
    letter-spacing: .015em;
    text-transform: uppercase;
    line-height: .98;
    margin: 0 0 14px;
    color: #fff6ec;
    text-shadow: 0 0 10px rgba(255,138,43,.6), 0 0 30px rgba(255,138,43,.45), 0 0 60px rgba(255,61,26,.35);
  }
  .cd-anim .cd-title { animation: cd-flicker 3.6s ease-in-out 1.4s infinite; }

  .cd-stat-sentence { font-size: clamp(16px, 4vw, 19px); font-weight: 600; color: var(--cd-ink); line-height: 1.55; max-width: 46ch; margin: 0 0 22px; }
  .cd-stat-sentence b { color: var(--cd-accent); font-weight: 900; font-variant-numeric: tabular-nums; }

  .cd-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 22px; border-radius: 10px; border: none; cursor: pointer;
    font-size: 14.5px; font-weight: 800; font-family: inherit; text-decoration: none;
    background: linear-gradient(135deg, var(--cd-accent), var(--cd-accent-2)); color: #1a0d05;
    box-shadow: 0 6px 20px -6px rgba(255,90,30,.5);
    transition: transform .12s var(--cd-ease-out);
  }
  .cd-btn:active:not(:disabled) { transform: scale(.97); }
  @media (hover: hover) and (pointer: fine) { .cd-btn:hover:not(:disabled) { transform: translateY(-1px); } }
  .cd-btn:disabled { background: var(--cd-card); color: var(--cd-muted-2); box-shadow: none; cursor: default; border: 1px solid var(--cd-card-border); }
  .cd-btn--block { width: 100%; margin-top: 4px; }

  /* Chips de beneficio (mockup 0) — una fila compacta, no tarjetas grandes */
  .cd-chips { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 26px; }
  @media (min-width: 640px) { .cd-chips { grid-template-columns: repeat(3, 1fr); } }
  .cd-chipcard { display: flex; align-items: center; gap: 10px; background: rgba(26,16,10,.8); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 11px 14px; }
  .cd-chipcard-icon { font-size: 16px; flex-shrink: 0; }
  .cd-chipcard-title { font-size: 12.5px; font-weight: 800; color: var(--cd-ink); }
  .cd-chipcard-sub { font-size: 11px; color: var(--cd-muted); line-height: 1.35; margin-top: 1px; }

  .cd-meet {
    display: inline-flex; align-items: center; gap: 10px; margin: 26px 0 8px;
    border: 1px solid rgba(255,138,43,.4); border-radius: 12px; padding: 10px 16px;
    background: rgba(255,138,43,.08);
  }
  .cd-anim .cd-meet { animation: cd-pulse 2.6s ease-in-out 1s infinite; }
  a.cd-meet { text-decoration: none; color: inherit; }
  .cd-meet-cta { font-size: 12.5px; font-weight: 800; color: var(--cd-accent); white-space: nowrap; }
  .cd-meet b { font-size: 20px; font-weight: 900; color: var(--cd-accent); font-family: var(--cd-display); letter-spacing: .04em; }
  .cd-meet small { display: block; font-size: 10.5px; color: var(--cd-muted-2); letter-spacing: .05em; }
  .cd-meet-sep { width: 1px; height: 26px; background: rgba(255,138,43,.3); }
  .cd-meet-time { font-size: 14px; font-weight: 700; color: var(--cd-ink); }

  .cd-hero-micro { font-size: 11.5px; font-weight: 700; letter-spacing: .05em; color: var(--cd-muted-2); margin-top: 12px; text-transform: uppercase; }

  /* ─── Intro de reentrada ───
     El banner aparece a pantalla completa y se disuelve solo hasta la
     pantalla del paso actual — la reentrada nunca es un panel frío. */
  .cd-intro { position: fixed; inset: 0; z-index: 100; background: var(--cd-bg); display: flex; align-items: center; justify-content: center; overflow: hidden; }
  .cd-intro img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: center 20%; opacity: .55; }
  .cd-intro-scrim { position: absolute; inset: 0; background: radial-gradient(circle at 50% 52%, rgba(12,7,5,.25), rgba(12,7,5,.88)); }
  .cd-intro-copy { position: relative; text-align: center; padding: 0 24px; }
  .cd-intro-eyebrow { font-size: 12px; font-weight: 800; letter-spacing: .2em; text-transform: uppercase; color: var(--cd-accent); margin-bottom: 10px; }
  .cd-intro-title { font-family: var(--cd-display); font-weight: 400; font-size: clamp(46px, 11vw, 104px); text-transform: uppercase; line-height: .96; color: #fff6ec; text-shadow: 0 0 12px rgba(255,138,43,.6), 0 0 36px rgba(255,138,43,.45), 0 0 70px rgba(255,61,26,.35); }

  /* Watermark gigante detrás de las fases — stroke, no relleno */
  .cd-body { position: relative; z-index: 1; min-height: 100vh; }
  .cd-body::before {
    content: "CYBER DAYS"; position: absolute; top: 30px; left: 50%; transform: translateX(-50%);
    font-family: var(--cd-display); font-size: clamp(90px, 17vw, 210px); white-space: nowrap;
    color: transparent; -webkit-text-stroke: 1px rgba(255,138,43,.06); pointer-events: none; z-index: 0;
  }
  .cd-body > * { position: relative; z-index: 1; }

  /* ─── Stepper ─── */
  .cd-stepper { display: flex; align-items: flex-start; margin: 32px 0 4px; }
  .cd-stepper-node { display: flex; flex-direction: column; align-items: center; flex: 1; min-width: 0; position: relative; padding: 0 2px; text-decoration: none; color: inherit; background: none; border: none; font-family: inherit; cursor: pointer; }
  .cd-stepper-line { position: absolute; top: 15px; left: -50%; width: 100%; height: 2px; z-index: 0; }
  .cd-stepper-circle { width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12.5px; font-weight: 900; border: 2px solid var(--dot); background: var(--fill); position: relative; z-index: 1; flex-shrink: 0; }
  .cd-anim .cd-stepper-circle.is-actual { animation: cd-pulse-dot 2.2s ease-in-out infinite; }
  .cd-stepper-label { font-size: 11px; font-weight: 700; margin-top: 8px; text-align: center; }
  .cd-stepper-sub { font-size: 9.5px; color: var(--cd-muted-2); margin-top: 2px; text-align: center; }
  /* Título grande de la fase + cronómetro, fuera de la tarjeta */
  .cd-phase-hero { text-align: center; margin: 34px 0 0; }
  .cd-phase-hero-title { font-family: var(--cd-display); font-weight: 400; font-size: clamp(34px, 7.5vw, 66px); text-transform: uppercase; line-height: 1; color: #fff6ec; text-shadow: 0 0 10px rgba(255,138,43,.5), 0 0 28px rgba(255,61,26,.35); margin: 0; }
  .cd-phase-hero-sub { font-size: clamp(13.5px, 3vw, 15.5px); font-weight: 600; color: var(--cd-muted); margin: 10px auto 0; max-width: 44ch; line-height: 1.5; }
  .cd-phase-hero .cd-timer { margin-top: 16px; }
  @keyframes cd-pulse-dot { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,138,43,.4); } 50% { box-shadow: 0 0 0 6px rgba(255,138,43,0); } }

  /* ─── Cronómetro de 3 celdas (board: DÍAS / HORAS / MIN) ─── */
  .cd-timer { margin-top: 14px; }
  .cd-timer-label { display: block; font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--cd-muted-2); margin-bottom: 8px; }
  .cd-timer-cells { display: inline-flex; gap: 8px; }
  .cd-timer-cell { min-width: 62px; text-align: center; background: rgba(255,138,43,.07); border: 1px solid rgba(255,138,43,.3); border-radius: 10px; padding: 8px 10px; }
  .cd-timer-cell b { display: block; font-family: var(--cd-display); font-weight: 400; font-size: 24px; color: var(--cd-accent); line-height: 1.05; }
  .cd-timer-cell small { font-size: 9px; font-weight: 800; letter-spacing: .08em; color: var(--cd-muted-2); }

  /* ─── Tarjetas de fase ─── */
  .cd-phase { margin-top: 22px; scroll-margin-top: 20px; }
  .cd-phase-card { background: var(--cd-card); border: 1px solid var(--cd-card-border); border-radius: 16px; padding: 20px; }
  .cd-phase-card.is-active { border-color: rgba(255,138,43,.5); box-shadow: 0 0 0 1px rgba(255,138,43,.15), 0 10px 30px -12px rgba(255,138,43,.4); }
  .cd-phase-card.is-locked { opacity: .6; }
  .cd-phase-card.is-celebrate { border-color: rgba(255,138,43,.5); background: linear-gradient(160deg, rgba(255,138,43,.12), var(--cd-card) 55%); }
  .cd-phase-body { margin-top: 0; }
  .cd-back-current { display: inline-flex; margin-top: 16px; background: none; border: none; padding: 4px 0; font-family: inherit; font-size: 12.5px; font-weight: 700; color: var(--cd-accent); cursor: pointer; }
  .cd-phase-sub { font-size: 12.5px; color: var(--cd-muted); margin: 0 0 14px; }
  .cd-phase-note { font-size: 12.5px; color: var(--cd-muted); background: rgba(255,255,255,.03); border: 1px solid var(--cd-card-border); border-radius: 10px; padding: 11px 14px; display: flex; align-items: center; gap: 4px; }
  .cd-waiting-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--cd-accent); margin-right: 7px; flex-shrink: 0; }
  .cd-anim .cd-waiting-dot { animation: cd-pulse-dot 1.4s ease-in-out infinite; }
  .cd-fact { margin-top: 12px; font-size: 12.5px; color: var(--cd-ink); background: rgba(255,138,43,.07); border: 1px solid rgba(255,138,43,.3); border-radius: 10px; padding: 11px 14px; line-height: 1.5; }
  .cd-fact b { color: var(--cd-accent); }

  /* ─── Selección ─── */
  .cd-selection-layout { display: flex; flex-direction: column; gap: 16px; }
  @media (min-width: 680px) { .cd-selection-layout { display: grid; grid-template-columns: 1fr 250px; align-items: start; gap: 18px; } }
  .cd-pgrid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
  @media (min-width: 420px) { .cd-pgrid { grid-template-columns: repeat(3, 1fr); } }
  @media (min-width: 860px) { .cd-pgrid { grid-template-columns: repeat(4, 1fr); } }
  .cd-pcard {
    /* min-width: 0 pisa el "auto" implícito de los ítems de grid — sin esto,
       el <img> dentro de .cd-thumb (elemento reemplazado) le impone a su
       columna un mínimo igual al tamaño intrínseco de la imagen, y las 4
       columnas de "repeat(4, 1fr)" dejan de repartirse parejo (grid blowout:
       cada columna termina con un ancho distinto según qué tan "pesada" sea
       la imagen de esa posición, verificado con Playwright — no era el ojo). */
    min-width: 0;
    background: rgba(255,255,255,.02); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 10px;
    display: flex; flex-direction: column; gap: 8px; position: relative;
    transition: border-color .15s ease, box-shadow .15s ease, opacity .15s ease;
  }
  .cd-pcard.is-selectable { cursor: pointer; }
  @media (hover: hover) and (pointer: fine) { .cd-pcard.is-selectable:hover { border-color: rgba(255,138,43,.5); } }
  .cd-pcard.is-selected { border-color: var(--cd-accent); box-shadow: 0 0 0 1px rgba(255,138,43,.3); }
  .cd-pcard.is-disabled { opacity: .45; cursor: default; }
  .cd-thumb { width: 100%; aspect-ratio: 1; border-radius: 9px; display: flex; align-items: center; justify-content: center; font-size: 24px; background: var(--thumb-bg); overflow: hidden; }
  .cd-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .cd-pcard-badge { position: absolute; top: 6px; right: 6px; width: 20px; height: 20px; border-radius: 50%; background: var(--cd-accent); color: #1a0d05; font-size: 11px; font-weight: 900; display: flex; align-items: center; justify-content: center; z-index: 1; }
  .cd-pcard-id { font-family: ui-monospace, "SF Mono", monospace; font-size: 10px; color: var(--cd-muted-2); }
  .cd-pcard-name { font-size: 12px; font-weight: 700; color: var(--cd-ink); line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 2.6em; }
  .cd-pcard-stock { font-size: 10.5px; font-weight: 700; color: var(--cd-accent); }

  .cd-readiness { background: rgba(255,255,255,.02); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .cd-readiness-title { font-size: 13px; font-weight: 800; color: var(--cd-ink); }
  .cd-readiness-count { font-size: 13px; color: var(--cd-muted); }
  .cd-readiness-count b { font-family: var(--cd-display); font-weight: 400; font-size: 24px; color: var(--cd-accent); margin-right: 5px; }
  .cd-readiness-hint { font-size: 12px; color: var(--cd-muted); line-height: 1.45; margin: 0; }
  .cd-readiness-warn { font-size: 10.5px; color: var(--cd-muted-2); line-height: 1.45; border-top: 1px solid var(--cd-card-border); padding-top: 10px; }

  /* ─── Recibo (mockup 2: check hexagonal + stats + fecha) ─── */
  .cd-hex-wrap { filter: drop-shadow(0 0 18px rgba(255,138,43,.45)); width: 64px; margin-bottom: 14px; }
  /* Celebración al postular: el check entra con rebote — solo al enviar,
     no en cada visita al recibo. */
  .cd-anim .cd-hex-wrap.is-pop { animation: cd-hex-pop .8s cubic-bezier(.34, 1.56, .64, 1) both; }
  @keyframes cd-hex-pop { 0% { transform: scale(.3); opacity: 0; } 60% { transform: scale(1.12); opacity: 1; } 100% { transform: scale(1); opacity: 1; } }
  /* Franja de edición: la selección sigue abierta hasta la fecha límite */
  .cd-receipt-edit { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: rgba(255,138,43,.07); border: 1px solid rgba(255,138,43,.3); border-radius: 10px; padding: 11px 14px; margin-bottom: 14px; }
  .cd-receipt-edit span { font-size: 12.5px; color: var(--cd-ink); line-height: 1.45; }
  .cd-receipt-edit b { color: var(--cd-accent); }
  .cd-hex { width: 64px; height: 58px; clip-path: polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%); background: linear-gradient(160deg, var(--cd-accent), var(--cd-accent-2)); display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 900; color: #1a0d05; }
  .cd-receipt-head { font-size: 17px; font-weight: 800; color: var(--cd-ink); margin-bottom: 3px; }
  .cd-receipt-date { font-size: 12px; color: var(--cd-muted); margin-bottom: 16px; }
  .cd-receipt-stats { display: flex; gap: 24px; margin-bottom: 16px; flex-wrap: wrap; }
  .cd-receipt-stat-num { font-family: var(--cd-display); font-weight: 400; font-size: 24px; color: var(--cd-ink); }
  .cd-receipt-stat-label { font-size: 10px; color: var(--cd-muted-2); text-transform: uppercase; letter-spacing: .04em; margin-top: 2px; }
  .cd-receipt-list { display: flex; flex-direction: column; gap: 9px; margin-bottom: 16px; padding-top: 14px; border-top: 1px dashed var(--cd-card-border); }
  .cd-receipt-item { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-size: 13px; color: var(--cd-ink); font-weight: 600; padding-bottom: 9px; border-bottom: 1px dashed var(--cd-card-border); }
  .cd-receipt-item:last-child { border-bottom: none; padding-bottom: 0; }
  .cd-receipt-item-id { font-family: ui-monospace, "SF Mono", monospace; font-size: 11px; color: var(--cd-muted-2); font-weight: 400; white-space: nowrap; }
  .cd-receipt-note { font-size: 11.5px; color: var(--cd-muted-2); line-height: 1.5; border-top: 1px solid var(--cd-card-border); padding-top: 12px; }

  /* ─── Checklist de preparación (mockup 4: barra "X de 4 completadas") ─── */
  .cd-approved-banner { display: inline-flex; align-items: center; gap: 8px; font-size: 13.5px; font-weight: 800; color: var(--cd-ink); background: rgba(52,211,153,.12); border: 1px solid rgba(52,211,153,.35); padding: 8px 14px; border-radius: 10px; margin-bottom: 14px; }
  .cd-prep-head { display: flex; align-items: center; justify-content: space-between; margin: 16px 0 8px; }
  .cd-checklist-title { font-size: 13px; font-weight: 800; color: var(--cd-ink); }
  .cd-checklist-count { font-size: 12px; font-weight: 800; color: var(--cd-accent); }
  .cd-progress { height: 5px; background: rgba(255,255,255,.07); border-radius: 4px; overflow: hidden; }
  .cd-progress > span { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--cd-accent), var(--cd-accent-2)); transform-origin: left; transform: scaleX(var(--p, 0)); transition: transform .4s var(--cd-ease-out); }
  .cd-check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--cd-ink); line-height: 1.4; cursor: pointer; position: relative; }
  .cd-check-item input { position: absolute; opacity: 0; width: 0; height: 0; }
  .cd-check-box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--cd-card-border); flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: var(--cd-bg); transition: background .15s ease, border-color .15s ease, transform .15s var(--cd-ease-out); }
  .cd-check-box.is-done { background: var(--cd-done); border-color: var(--cd-done); transform: scale(1.08); }

  /* Fase 3 como pasos en el orden real del journey: marco → Dropi → Canva */
  .cd-steps { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
  .cd-step { display: flex; gap: 12px; background: rgba(255,255,255,.02); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 14px 16px; }
  .cd-step-num { width: 28px; height: 28px; border-radius: 50%; border: 1.5px solid rgba(255,138,43,.5); color: var(--cd-accent); font-family: var(--cd-display); font-size: 14px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .cd-step-body { flex: 1; }
  .cd-step-title { font-size: 13.5px; font-weight: 800; color: var(--cd-ink); margin-bottom: 3px; }
  .cd-step-sub { font-size: 12px; color: var(--cd-muted); line-height: 1.45; }
  .cd-step-checks { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
  .cd-step-actions { margin-top: 10px; }

  /* Los dos catálogos de la fase Prepara — cada uno con su propia ventana de
     fechas. El del PDF va primero (cierra antes) y el de Dropi tiene ventana
     tardía a propósito: vestirse antes del 9 delataría la campaña. */
  .cd-catgrid { display: grid; grid-template-columns: 1fr; gap: 12px; margin-top: 12px; }
  @media (min-width: 720px) { .cd-catgrid { grid-template-columns: 1fr 1fr; align-items: start; } }
  .cd-catcard { background: rgba(255,255,255,.02); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 16px 18px; }
  .cd-catcard-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
  .cd-catcard-title { font-size: 14px; font-weight: 800; color: var(--cd-ink); }
  .cd-catcard-tag { font-size: 11.5px; color: var(--cd-muted); margin-top: 2px; }
  .cd-catcard-chip { flex-shrink: 0; font-size: 10.5px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: var(--cd-accent); background: rgba(255,138,43,.12); border: 1px solid rgba(255,138,43,.35); border-radius: 999px; padding: 4px 10px; white-space: nowrap; }
  .cd-catcard-sub { font-size: 12px; color: var(--cd-muted); line-height: 1.5; margin: 8px 0 0; }
  .cd-catcard-warn { font-size: 12px; color: var(--cd-ink); background: rgba(255,138,43,.07); border: 1px solid rgba(255,138,43,.3); border-radius: 10px; padding: 10px 12px; line-height: 1.5; margin-top: 10px; }
  .cd-catcard-warn b { color: var(--cd-accent); }

  .cd-toolcard {
    display: flex; align-items: center; justify-content: space-between; gap: 14px;
    background: rgba(255,255,255,.02); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 16px 18px; margin-top: 10px;
  }
  .cd-toolcard-icon { width: 36px; height: 36px; border-radius: 10px; background: rgba(255,138,43,.14); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .cd-toolcard-title { font-size: 14px; font-weight: 700; color: var(--cd-ink); }
  .cd-toolcard-sub { font-size: 12px; color: var(--cd-muted); margin-top: 2px; }
  .cd-toolcard-cta {
    flex-shrink: 0; font-size: 12.5px; font-weight: 800; padding: 8px 14px; border-radius: 8px; text-decoration: none; cursor: pointer;
    background: rgba(255,138,43,.12); color: var(--cd-accent); border: 1px solid rgba(255,138,43,.35); font-family: inherit;
    transition: transform .12s var(--cd-ease-out);
  }
  .cd-toolcard-cta:active { transform: scale(.97); }
  .cd-toolcard-cta.is-pending { color: var(--cd-muted-2); background: rgba(255,255,255,.03); border-color: var(--cd-card-border); cursor: default; }

  /* ─── En vivo / cierre ─── */
  .cd-celebrate { display: flex; align-items: center; gap: 14px; }
  .cd-celebrate-icon { width: 42px; height: 42px; border-radius: 50%; background: rgba(255,138,43,.18); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .cd-celebrate-text { font-size: 13.5px; font-weight: 600; color: var(--cd-ink); line-height: 1.4; }

  .cd-footnote { font-size: 12.5px; color: var(--cd-muted-2); margin-top: 16px; }
  .cd-brandline { text-align: center; font-size: 12.5px; color: var(--cd-muted-2); margin-top: 48px; }
  .cd-brandline b { color: var(--cd-accent); font-weight: 800; }

  /* Barra de QA (solo dev): cambiar de fase sin copiar y pegar links */
  .cd-devbar { position: fixed; bottom: 14px; left: 14px; z-index: 50; display: flex; align-items: center; gap: 2px; background: #1a0d05; border: 1px solid rgba(255,138,43,.4); border-radius: 999px; padding: 5px 10px; max-width: calc(100vw - 28px); overflow-x: auto; }
  .cd-devbar-label { font-size: 10px; font-weight: 800; letter-spacing: .06em; color: var(--cd-muted-2); margin-right: 4px; flex-shrink: 0; }
  .cd-devbar a { font-size: 11px; font-weight: 700; color: var(--cd-muted); text-decoration: none; padding: 3px 8px; border-radius: 999px; white-space: nowrap; }
  .cd-devbar a.is-on { background: rgba(255,138,43,.16); color: var(--cd-accent); }

  @keyframes cd-flicker { 0%, 100% { opacity: 1; } 50% { opacity: .93; } }
  @keyframes cd-pulse { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,138,43,.35); } 50% { box-shadow: 0 0 0 6px rgba(255,138,43,0); } }

  /* Si la preferencia de reduced motion cambia con la página abierta: el modo
     anim ya no se activa al cargar con la preferencia puesta, esto cubre el
     cambio en caliente sin !important. */
  @media (prefers-reduced-motion: reduce) {
    .cd-anim .cd-title, .cd-anim .cd-embers span, .cd-anim .cd-meet, .cd-anim .cd-hex-wrap.is-pop,
    .cd-anim .cd-glow--a, .cd-anim .cd-glow--b, .cd-anim .cd-stepper-circle.is-actual, .cd-anim .cd-waiting-dot { animation: none; }
  }
`;

// Un solo vocabulario de estado en toda la página: Completado / En curso /
// Próximamente. Antes convivían "Listo", "Sellado", "Ahora", "Live" y
// "Finalizada" — cada tarjeta hablaba distinto y confundía.
function stepVisual(state: JourneyStep["state"]) {
  if (state === "hecho") return { dot: "var(--cd-done)", fill: "var(--cd-done)", line: "var(--cd-done)", label: "var(--cd-ink)", pillBg: "rgba(52,211,153,.14)", pillColor: "var(--cd-done)", pillText: "Completado" };
  if (state === "actual") return { dot: "var(--cd-accent)", fill: "var(--cd-accent)", line: "var(--cd-card-border)", label: "var(--cd-ink)", pillBg: "rgba(255,138,43,.16)", pillColor: "var(--cd-accent)", pillText: "En curso" };
  return { dot: "var(--cd-card-border)", fill: "transparent", line: "var(--cd-card-border)", label: "var(--cd-muted-2)", pillBg: "transparent", pillColor: "var(--cd-muted-2)", pillText: "Próximamente" };
}

// Titular con revelado tipo scramble (tomado del patrón de referencia que
// trajo Michelle). Escribe directo en textContent — sin re-render por frame.
// memo: los re-renders del padre (clicks de selección) no lo reinician.
const ScrambleText = memo(function ScrambleText({ text, anim }: { text: string; anim: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!anim || !ref.current) return;
    const el = ref.current;
    const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&";
    let reveal = 0;
    const frame = () => {
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        if (ch === " ") { out += " "; continue; }
        if (i < reveal) out += ch;
        else if (i < reveal + 3) out += CHARS[Math.floor(Math.random() * CHARS.length)];
        else out += " ";
      }
      el.textContent = out;
    };
    frame();
    const id = setInterval(() => {
      reveal += 1;
      frame();
      if (reveal >= text.length) clearInterval(id);
    }, 24);
    return () => clearInterval(id);
  }, [text, anim]);
  return <span ref={ref}>{text}</span>;
});

// Count-up al entrar en viewport, ~900ms ease-out. Escribe en textContent
// (cero re-renders por frame) y memo para que el padre no lo resetee.
const CountUp = memo(function CountUp({ value, anim }: { value: number; anim: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!anim || !ref.current) return;
    const el = ref.current;
    let raf = 0;
    let started = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || started) return;
      started = true;
      io.disconnect();
      const t0 = performance.now();
      const dur = 900;
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(value * eased).toLocaleString("es-CO");
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, anim]);
  return <span ref={ref}>{anim ? "0" : value.toLocaleString("es-CO")}</span>;
});

// Intro de reentrada: el banner de campaña aparece a pantalla completa y se
// disuelve solo (~2.3s) hasta la pantalla del paso en el que va el proveedor.
// Solo se monta cuando NO aplica el hero completo de primera visita, y nunca
// con reduced motion (el padre no lo renderiza en ese caso).
const IntroOverlay = memo(function IntroOverlay({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const tl = gsap.timeline({ onComplete: () => doneRef.current() });
    tl.fromTo(el.querySelector("img"), { scale: 1.12 }, { scale: 1, duration: 2.3, ease: "power2.out" }, 0)
      .fromTo(el.querySelector(".cd-intro-eyebrow"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.15)
      .fromTo(el.querySelector(".cd-intro-title"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.3)
      .to(el, { autoAlpha: 0, scale: 1.02, duration: 0.7, ease: "power2.inOut" }, 1.65);
    return () => { tl.kill(); };
  }, []);
  return (
    <div ref={ref} className="cd-intro" aria-hidden>
      <img src="/cyberdays/hero-cyberdays.png" alt="" />
      <div className="cd-intro-scrim" />
      <div className="cd-intro-copy">
        <div className="cd-intro-eyebrow">Del 11 al 24 de agosto</div>
        <div className="cd-intro-title">Cyber Days</div>
      </div>
    </div>
  );
});

// Cuenta regresiva hasta el cierre de una fase (día completo, hora local).
// Tick cada 30s — la ventana es de días, no necesita segundos.
function useCountdown(endISO?: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (!endISO) return;
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, [endISO]);
  if (!endISO) return null;
  const end = new Date(`${endISO}T23:59:59`).getTime();
  const diff = end - now;
  if (diff <= 0) return { expired: true as const, days: 0, hours: 0, mins: 0 };
  return {
    expired: false as const,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    mins: Math.floor((diff % 3600000) / 60000),
  };
}

function TimerCells({ label, endISO }: { label: string; endISO?: string }) {
  const c = useCountdown(endISO);
  if (!c || c.expired) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="cd-timer">
      <span className="cd-timer-label">{label}</span>
      <div className="cd-timer-cells">
        <div className="cd-timer-cell"><b>{pad(c.days)}</b><small>DÍAS</small></div>
        <div className="cd-timer-cell"><b>{pad(c.hours)}</b><small>HORAS</small></div>
        <div className="cd-timer-cell"><b>{pad(c.mins)}</b><small>MIN</small></div>
      </div>
    </div>
  );
}

export default function ElegiblesPage() {
  const { id, token } = useParams<{ id: string; token: string }>();
  const [entry, setEntry] = useState<EligibleEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selected, setSelected] = useState<Set<string | number>>(new Set());
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [checklist, setChecklist] = useState<Partial<Record<ChecklistKey, boolean>>>({});
  const [copied, setCopied] = useState(false);
  // La selección es editable hasta que cierra la ventana: `editing` devuelve
  // al proveedor a la grilla con su selección precargada, y `celebrate` hace
  // el pop del check solo justo después de enviar (no en cada visita).
  const [editing, setEditing] = useState(false);
  const [celebrate, setCelebrate] = useState(false);
  // El modo anim se decide una sola vez: si el usuario pide reduced motion,
  // nada se anima (ni reveals ni brasas ni scramble). El contenido solo se
  // renderiza en cliente después del fetch, así que leer matchMedia acá no
  // genera mismatch de hidratación.
  const [anim] = useState(() => typeof window !== "undefined" && !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  // Solo existe en dev: en el build de producción NODE_ENV lo mata, así que
  // un proveedor real no puede adelantarse de fase agregando ?vista= a su URL.
  const [vista] = useState<string | null>(() => {
    if (process.env.NODE_ENV !== "development" || typeof window === "undefined") return null;
    const v = new URLSearchParams(window.location.search).get("vista");
    return v && PREVIEW_ORDER[v] !== undefined ? v : null;
  });

  useEffect(() => {
    fetch(`/api/campaigns-planeacion/${id}/elegibles/${token}`)
      .then((r) => {
        if (!r.ok) { setNotFound(true); return null; }
        return r.json();
      })
      .then((data: EligibleEntry | null) => {
        if (data) {
          setEntry(data);
          setSelected(new Set(data.selectedProductIds ?? []));
          setChecklist(data.readyChecklist ?? {});
        }
      })
      .finally(() => setLoading(false));
  }, [id, token]);

  // Las fechas mandan en selección y en vivo, pero el paso revisión→fotos lo
  // manda la aprobación REAL del equipo (`approved_at`, desde el panel
  // interno): sin ella la página nunca dice "aprobado" aunque el calendario
  // haya pasado, y si el equipo aprueba antes, el proveedor avanza de una —
  // ese es el momento del WhatsApp masivo.
  const journey = useMemo<JourneyStep[]>(() => {
    const base = entry?.journey ?? [];
    if (base.length === 0) return base;
    if (vista) {
      const idx = PREVIEW_ORDER[vista];
      return base.map((s, i) => ({ ...s, state: i < idx ? "hecho" : i === idx ? "actual" : "bloqueado" }));
    }
    const submitted = !!entry?.submitted_at;
    const approved = !!entry?.approved_at;
    return base.map((s) => {
      if (approved) {
        if (s.key === "seleccion" || s.key === "curaduria") return { ...s, state: "hecho" as const };
        if (s.key === "fotos") return s.state === "hecho" ? s : { ...s, state: "actual" as const };
        return s;
      }
      // Sin aprobación: quien no postuló no tiene nada en revisión, y nadie
      // avanza a fotos ni a en vivo por puro calendario.
      if (s.key === "curaduria") {
        if (!submitted) return { ...s, state: "bloqueado" as const };
        if (s.state === "hecho") return { ...s, state: "actual" as const };
        return s;
      }
      if (s.key === "fotos" || s.key === "vivo") return { ...s, state: "bloqueado" as const };
      return s;
    });
  }, [entry?.journey, entry?.submitted_at, entry?.approved_at, vista]);
  const seleccionStep = journey.find((j) => j.key === "seleccion");
  const curaduriaStep = journey.find((j) => j.key === "curaduria");
  const fotosStep = journey.find((j) => j.key === "fotos");
  const vivoStep = journey.find((j) => j.key === "vivo");
  const canSelect = seleccionStep?.state === "actual";
  const selectionWindowClosed = seleccionStep?.state === "hecho";
  const fotosOpen = fotosStep?.state === "actual" || fotosStep?.state === "hecho";
  // Postular NO sella: la selección se puede seguir ajustando desde la misma
  // página hasta que cierre la ventana de selección (el endpoint valida la
  // fecha). "Sellado" aquí solo decide si se ve el recibo o la grilla; el
  // sellado real llega cuando la ventana cierra. En vista previa, "seleccion"
  // siempre muestra la grilla editable y las demás el recibo.
  const isSealed = vista ? vista !== "seleccion" : !!entry?.submitted_at && !editing;

  // Solo se muestra UNA fase a la vez — por defecto la que le toca al
  // usuario hoy (si ya postuló durante la ventana de selección, lo que le
  // toca es esperar la revisión, no su fase técnica). El stepper navega a
  // las demás; nada de tarjetas apiladas que obliguen a hacer scroll.
  const [openPhase, setOpenPhase] = useState<number | null>(null);
  const autoIdx = useMemo(() => {
    if (journey.length === 0) return 0;
    const activeIdx = journey.findIndex((j) => j.state === "actual");
    if (activeIdx === -1) return journey.every((j) => j.state === "hecho") ? journey.length - 1 : 0;
    return activeIdx === 0 && isSealed ? 1 : activeIdx;
  }, [journey, isSealed]);
  const expandedIdx = openPhase ?? autoIdx;
  // Hero a pantalla completa solo mientras participar es la acción pendiente
  // (antes de la campaña o durante la selección sin postular todavía).
  const heroFull = !isSealed && autoIdx === 0 && !selectionWindowClosed;
  // Primera visita: solo se ve el banner; "Quiero participar" lo disuelve y
  // entra al paso 1. En reentradas el banner es el IntroOverlay (se disuelve
  // solo) y se aterriza directo en la pantalla del paso actual.
  const heroRef = useRef<HTMLDivElement>(null);
  const [entered, setEntered] = useState(false);
  const [introOn, setIntroOn] = useState(true);
  const showHero = heroFull && !entered;

  function handleEnter() {
    const el = heroRef.current;
    const done = () => { setEntered(true); window.scrollTo(0, 0); };
    if (!anim || !el) { done(); return; }
    gsap.to(el, { autoAlpha: 0, scale: 1.03, duration: 0.55, ease: "power2.in", onComplete: done });
  }
  // El Meet del 24 de julio deja de mostrarse cuando ya pasó.
  const meetVisible = Date.now() <= new Date("2026-07-24T23:59:59").getTime();

  // Animación cinemática con GSAP + ScrollTrigger (reemplaza el sistema
  // anterior de IntersectionObserver + classList: aquel escribía clases a
  // mano sobre elementos cuyo className React reescribe al cambiar estado —
  // por eso al seleccionar un producto su tarjeta "desaparecía". GSAP anima
  // con estilos inline que la reconciliación de React no toca).
  // data-gs-done marca lo ya revelado para que un re-render no lo reanime.
  useEffect(() => {
    if (!anim || !entry) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
        if (el.dataset.gsDone) return;
        el.dataset.gsDone = "1";
        gsap.from(el, {
          y: 18,
          autoAlpha: 0,
          duration: 0.65,
          ease: "power3.out",
          delay: parseFloat(el.dataset.delay || "0"),
          scrollTrigger: { trigger: el, start: "top 92%", once: true },
        });
      });
      // Parallax: la imagen del hero se expande suavemente y se desplaza más
      // lento que el scroll (reemplaza el ken-burns de CSS, que era ambient
      // y no respondía al scroll). Solo si el hero está montado.
      if (document.querySelector(".cd-hero-media img")) {
        gsap.to(".cd-hero-media img", {
          scale: 1.14,
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: ".cd-hero", start: "top top", end: "bottom top", scrub: true },
        });
      }
    });
    return () => ctx.revert();
  }, [anim, entry, expandedIdx, entered]);

  const eligibleCount = entry?.products.length ?? 0;
  const totalStock = useMemo(() => (entry?.products ?? []).reduce((sum, p) => sum + (p.stock ?? 0), 0), [entry?.products]);
  const viewedStep = journey[expandedIdx];
  // En vivo con jerarquía real: la celebración es el titular grande y el dato
  // informativo baja a subtítulo — antes competían con el mismo tamaño.
  const viewTitle =
    expandedIdx === 3
      ? vivoStep?.state === "hecho"
        ? "¡Gracias por participar!"
        : vivoStep?.state === "actual"
          ? "¡Tu campaña está en vivo!"
          : PHASE_VIEW_TITLES[3]
      : PHASE_VIEW_TITLES[expandedIdx];
  const viewSubtitle = expandedIdx === 3 && vivoStep?.state === "actual" ? "Tus productos ya están en el catálogo que ven los dropshippers." : null;
  // El cronómetro de la fase vive junto al título grande, no dentro de la
  // tarjeta. Solo cuando la fase que se ve está en curso — y en selección,
  // solo si aún no postuló (sellado, el plazo ya no le aplica).
  const viewedTimer = viewedStep?.state === "actual" && !(expandedIdx === 0 && isSealed);
  const selectedProducts = useMemo(() => {
    if (!entry) return [];
    const ids = new Set(entry.selectedProductIds ?? []);
    const real = entry.products.filter((p) => ids.has(p.id));
    // En vista previa sellada sin postulación real, se muestran los primeros
    // productos como selección de ejemplo — solo existe en dev.
    if (real.length === 0 && vista && vista !== "seleccion") return entry.products.slice(0, 3);
    return real;
  }, [entry, vista]);
  const selectedStock = useMemo(() => selectedProducts.reduce((sum, p) => sum + (p.stock ?? 0), 0), [selectedProducts]);
  const initials = (entry?.supplier_name || "?").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

  const receiptStatusText = useMemo(() => {
    if (vivoStep?.state === "hecho") return "Cyber Days ya cerró";
    if (vivoStep?.state === "actual") return "en vivo ahora";
    if (fotosOpen) return "aprobado · prepara tus fotos";
    return "en revisión por Dropi";
  }, [vivoStep?.state, fotosOpen]);

  const doneCount = CHECKLIST_KEYS.filter((k) => checklist[k]).length;

  function toggle(pid: string | number) {
    if (!canSelect) return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(pid)) next.delete(pid);
      else if (next.size < MAX_PRODUCTS) next.add(pid);
      return next;
    });
  }

  async function handleSubmit() {
    if (selected.size === 0) { setSubmitError("Elige al menos 1 producto"); return; }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch(`/api/campaigns-planeacion/${id}/elegibles/${token}/seleccion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productIds: Array.from(selected) }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error ?? "No se pudo enviar"); return; }
      setEntry((prev) => (prev ? { ...prev, selectedProductIds: data.selectedProductIds, submitted_at: data.submitted_at, selection_updated_at: data.selection_updated_at } : prev));
      // Aterriza en el recibo con el check en celebración — sin esto, el
      // auto-avance de fase lo mandaría directo a "En revisión" y el envío
      // se sentiría como si no hubiera pasado nada.
      setEditing(false);
      setCelebrate(true);
      setOpenPhase(0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  // Volver a la grilla con la selección enviada precargada. Solo disponible
  // mientras la ventana de selección siga abierta y la curaduría no haya
  // aprobado (después de eso, cambios por WhatsApp).
  function startEdit() {
    setSelected(new Set(entry?.selectedProductIds ?? []));
    setCelebrate(false);
    setEditing(true);
    setOpenPhase(0);
  }

  // Autorreporte, no una verificación real — si el POST falla, el ítem se
  // queda marcado igual en pantalla (no es información crítica del negocio).
  async function toggleChecklist(key: ChecklistKey) {
    const next = { ...checklist, [key]: !checklist[key] };
    setChecklist(next);
    if (vista) return; // en vista previa no se persiste — es solo QA visual
    try {
      await fetch(`/api/campaigns-planeacion/${id}/elegibles/${token}/checklist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: next[key] }),
      });
    } catch {
      // best-effort
    }
  }

  async function copyCatalog() {
    if (!CANVA_LINK) return;
    try {
      await navigator.clipboard.writeText(CANVA_LINK);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // sin permiso de clipboard: el link sigue disponible en "Abrir"
    }
  }

  const submittedDate = useMemo(() => {
    const iso = entry?.submitted_at ?? (vista && vista !== "seleccion" ? new Date().toISOString() : null);
    if (!iso) return "";
    return new Date(iso).toLocaleDateString("es-CO", { day: "numeric", month: "long" });
  }, [entry?.submitted_at, vista]);

  // "Actualizada el 19 jul, 3:40 p.m." — evidencia de que el ajuste sí quedó.
  const updatedStamp = useMemo(() => {
    const iso = entry?.selection_updated_at;
    if (!iso) return "";
    return new Date(iso).toLocaleString("es-CO", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
  }, [entry?.selection_updated_at]);

  // Editable mientras la ventana de selección siga abierta y la curaduría no
  // haya aprobado. El endpoint valida lo mismo del lado del servidor.
  const canEditSelection = canSelect && !entry?.approved_at;

  if (loading) {
    return (
      <div className="cd-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <span style={{ color: "#cdb7a3", fontSize: 14 }}>Cargando...</span>
      </div>
    );
  }

  if (notFound || !entry) {
    return (
      <div className="cd-page" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style dangerouslySetInnerHTML={{ __html: CSS }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: 24, textAlign: "center", maxWidth: 360 }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fdf4ea" }}>Este link ya no es válido</div>
          <div style={{ fontSize: 13.5, color: "#cdb7a3" }}>Si crees que es un error, escríbenos por el mismo canal donde recibiste este link.</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`cd-page ${anton.variable}${anim ? " cd-anim" : ""}`}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      {IS_DEV && (
        <div className="cd-devbar">
          <span className="cd-devbar-label">QA</span>
          <a href="?" className={!vista ? "is-on" : ""}>Real</a>
          {PREVIEW_TABS.map((t) => (
            <a key={t.key} href={`?vista=${t.key}`} className={vista === t.key ? "is-on" : ""}>{t.label}</a>
          ))}
        </div>
      )}

      {/* Reentrada: el banner aparece y se disuelve solo hasta el paso actual */}
      {anim && introOn && !heroFull && <IntroOverlay onDone={() => setIntroOn(false)} />}

      {/* ─── Primera visita: banner a pantalla completa. El CTA lo disuelve
          y aterriza directo en el paso 1. ─── */}
      {showHero && (
      <div ref={heroRef} className="cd-hero cd-hero--full">
        <div className="cd-hero-media"><img src="/cyberdays/hero-cyberdays.png" alt="" /></div>
        <div className="cd-hero-scrim" />
        <div className="cd-dots" />
        <div className="cd-glow cd-glow--a" />
        <div className="cd-glow cd-glow--b" />
        {anim && (
          <div className="cd-embers" aria-hidden>
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                style={{
                  left: `${(i * 71 + 9) % 100}%`,
                  animationDelay: `${(i * 0.9) % 7}s`,
                  animationDuration: `${7 + (i % 5) * 1.6}s`,
                  ["--s" as string]: `${0.5 + (i % 3) * 0.35}`,
                }}
              />
            ))}
          </div>
        )}

        <div className="cd-hero-inner cd-rail">
          <div className="cd-topbar" data-reveal>
            <div className="cd-topbar-brand">
              <img src="/Logo-dropi.svg" alt="Dropi" className="cd-topbar-logo" />
              <span>Cyber Days</span>
            </div>
            <div className="cd-topbar-supplier">
              <span className="cd-topbar-avatar">{initials}</span>
              <span className="cd-topbar-name">{entry.supplier_name}</span>
            </div>
          </div>

          <div className="cd-hero-spacer" />

          <div className="cd-hero-copy">
            <div className="cd-eyebrow" data-reveal>Del 11 al 24 de agosto</div>
            <h1 className="cd-title"><ScrambleText text="Los Cyber Days te eligieron" anim={anim} /></h1>
            <p className="cd-stat-sentence" data-reveal data-delay="0.08">
              Tienes <b><CountUp value={eligibleCount} anim={anim} /></b> producto{eligibleCount === 1 ? "" : "s"} elegible{eligibleCount === 1 ? "" : "s"} con{" "}
              <b><CountUp value={totalStock} anim={anim} /></b> unidades disponibles para Cyber Days.
            </p>
            <button type="button" className="cd-btn" data-reveal data-delay="0.16" onClick={handleEnter}>Quiero participar →</button>
            <div className="cd-hero-micro" data-reveal data-delay="0.22">4 pasos · 15 minutos</div>
          </div>

          <div className="cd-chips">
            <div className="cd-chipcard" data-reveal data-delay="0.2">
              <span className="cd-chipcard-icon">🚀</span>
              <div>
                <div className="cd-chipcard-title">Más visibilidad</div>
                <div className="cd-chipcard-sub">Miles de dropshippers verán tus productos.</div>
              </div>
            </div>
            <div className="cd-chipcard" data-reveal data-delay="0.26">
              <span className="cd-chipcard-icon">📈</span>
              <div>
                <div className="cd-chipcard-title">Más ventas</div>
                <div className="cd-chipcard-sub">Tu catálogo se promociona durante toda la campaña.</div>
              </div>
            </div>
            <div className="cd-chipcard" data-reveal data-delay="0.32">
              <span className="cd-chipcard-icon">✨</span>
              <div>
                <div className="cd-chipcard-title">Nosotros hacemos el trabajo</div>
                <div className="cd-chipcard-sub">Solo eliges qué productos participan.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* ─── Escenario del journey ─── */}
      {!showHero && (
      <>
      <div className="cd-body">
        <div className="cd-rail cd-wrap">
          <div className="cd-topbar" data-reveal style={{ paddingTop: 16 }}>
            <div className="cd-topbar-brand">
              <img src="/Logo-dropi.svg" alt="Dropi" className="cd-topbar-logo" />
              <span>Cyber Days</span>
            </div>
            <div className="cd-topbar-supplier">
              <span className="cd-topbar-avatar">{initials}</span>
              <span className="cd-topbar-name">{entry.supplier_name}</span>
            </div>
          </div>

          {expandedIdx === 0 && meetVisible && (LUMA_LINK ? (
            <a className="cd-meet" href={LUMA_LINK} target="_blank" rel="noopener noreferrer" data-reveal>
              <div>
                <b>24</b>
                <small>JULIO</small>
              </div>
              <div className="cd-meet-sep" />
              <div className="cd-meet-time">2:00pm · Meet de Cyber Days</div>
              <span className="cd-meet-cta">Agéndate →</span>
            </a>
          ) : (
            <div className="cd-meet" data-reveal>
              <div>
                <b>24</b>
                <small>JULIO</small>
              </div>
              <div className="cd-meet-sep" />
              <div className="cd-meet-time">2:00pm · Meet de Cyber Days</div>
            </div>
          ))}

          <div className="cd-stepper" data-reveal>
            {journey.map((step, i) => {
              const v = stepVisual(step.state);
              return (
                <button key={step.key} type="button" className="cd-stepper-node" onClick={() => { setOpenPhase(i); setCelebrate(false); }}>
                  {i > 0 && <div className="cd-stepper-line" style={{ background: stepVisual(journey[i - 1].state).line }} />}
                  <div className={`cd-stepper-circle${step.state === "actual" ? " is-actual" : ""}`} style={{ ["--dot" as string]: v.dot, ["--fill" as string]: v.fill, color: step.state === "bloqueado" ? "var(--cd-muted-2)" : "#1a0d05" }}>
                    {step.state === "hecho" ? "✓" : i + 1}
                  </div>
                  <div className="cd-stepper-label" style={{ color: v.label }}>{STEPPER_LABELS[step.key]}</div>
                  {step.state === "actual" && <div className="cd-stepper-sub">Ahora</div>}
                </button>
              );
            })}
          </div>
          <div className="cd-phase-hero" data-reveal>
            <h2 className="cd-phase-hero-title">{viewTitle}</h2>
            {viewSubtitle && <p className="cd-phase-hero-sub">{viewSubtitle}</p>}
            {viewedTimer && <TimerCells label={PHASE_TIMER_LABELS[expandedIdx]} endISO={viewedStep?.end} />}
          </div>

          {/* Solo se renderiza la fase seleccionada — el stepper es la
              navegación. Nada de tarjetas colapsadas apiladas: en cada paso
              se ve únicamente lo de ese paso. */}

          {/* Fase 1 — Selección */}
          {expandedIdx === 0 && (
          <div id="fase-1" className="cd-phase" data-reveal>
            <div className={`cd-phase-card${canSelect && !isSealed ? " is-active" : ""}`}>
              <div className="cd-phase-body">{isSealed ? (
                <>
                  <div className={`cd-hex-wrap${celebrate ? " is-pop" : ""}`} data-reveal><div className="cd-hex">✓</div></div>
                  <div className="cd-receipt-head">¡Postulación enviada!</div>
                  {submittedDate && (
                    <div className="cd-receipt-date">
                      Enviada el {submittedDate}{updatedStamp && <> · actualizada el {updatedStamp}</>} · {receiptStatusText}
                    </div>
                  )}
                  {canEditSelection && (
                    <div className="cd-receipt-edit">
                      <span>Puedes ajustar tu selección hasta el <b>31 de julio</b>.</span>
                      <button type="button" className="cd-toolcard-cta" onClick={startEdit}>Editar selección</button>
                    </div>
                  )}
                  <div className="cd-receipt-stats">
                    <div>
                      <div className="cd-receipt-stat-num">{selectedProducts.length}</div>
                      <div className="cd-receipt-stat-label">Productos</div>
                    </div>
                    <div>
                      <div className="cd-receipt-stat-num">{selectedStock.toLocaleString("es-CO")}</div>
                      <div className="cd-receipt-stat-label">Unidades</div>
                    </div>
                    {submittedDate && (
                      <div>
                        <div className="cd-receipt-stat-num">{submittedDate}</div>
                        <div className="cd-receipt-stat-label">Fecha de envío</div>
                      </div>
                    )}
                  </div>
                  <div className="cd-receipt-list">
                    {selectedProducts.map((p) => (
                      <div className="cd-receipt-item" key={p.id}>
                        <span>{p.name}</span>
                        <span className="cd-receipt-item-id">#{p.id}</span>
                      </div>
                    ))}
                  </div>
                  {!canEditSelection && (
                    <div className="cd-receipt-note">Esta selección ya está sellada. ¿Necesitas un cambio? Escríbenos por el mismo canal donde recibiste este link.</div>
                  )}
                </>
              ) : (
                <>
                  <p className="cd-phase-sub">Estos cumplen hoy el criterio de la campaña (500+ unidades de stock disponible). Selecciona hasta {MAX_PRODUCTS}.</p>

                  {editing && (
                    <div className="cd-phase-note" style={{ marginBottom: 14 }}>✏️ Tu postulación sigue enviada. Al guardar, la reemplazamos con esta selección.</div>
                  )}

                  {!canSelect && !selectionWindowClosed && (
                    <div className="cd-phase-note" style={{ marginBottom: 14 }}>🔒 Podrás postular a partir del {seleccionStep?.window.split("–")[0].trim()}. Por ahora puedes revisar tu lista.</div>
                  )}
                  {selectionWindowClosed && (
                    <div className="cd-phase-note" style={{ marginBottom: 14 }}>La postulación ya cerró y no alcanzaste a enviar tu selección. Escríbenos si crees que es un error.</div>
                  )}

                  <div className="cd-selection-layout">
                    <div className="cd-pgrid">
                      {entry.products.map((p, i) => {
                        const isChecked = selected.has(p.id);
                        const disabled = !canSelect;
                        const cv = categoryVisual(p.category);
                        return (
                          <div
                            key={i}
                            className={`cd-pcard${canSelect ? " is-selectable" : ""}${isChecked ? " is-selected" : ""}${disabled && !isChecked ? " is-disabled" : ""}`}
                            data-reveal
                            data-delay={`${(i % 12) * 0.04}`}
                            onClick={() => toggle(p.id)}
                          >
                            {isChecked && <span className="cd-pcard-badge">✓</span>}
                            <div className="cd-thumb" style={{ ["--thumb-bg" as string]: `${cv.color}26`, color: cv.color }}>
                              <ProductThumb id={p.id} image={p.image} emoji={cv.emoji} />
                            </div>
                            <div className="cd-pcard-id">#{p.id}</div>
                            <div className="cd-pcard-name">{p.name}</div>
                            <div className="cd-pcard-stock">{p.stock != null ? p.stock.toLocaleString("es-CO") : "—"} u.</div>
                          </div>
                        );
                      })}
                    </div>

                    {canSelect && (
                      <div className="cd-readiness" data-reveal data-delay="0.1">
                        <div className="cd-readiness-title">Tu selección</div>
                        <div className="cd-readiness-count"><b>{selected.size}</b>de {MAX_PRODUCTS} productos</div>
                        <p className="cd-readiness-hint">Revisa que estén en buen estado antes de postular.</p>
                        <button className="cd-btn cd-btn--block" onClick={handleSubmit} disabled={submitting || selected.size === 0}>
                          {submitting ? "Enviando..." : editing ? "Guardar cambios" : "Postular productos"}
                        </button>
                        {editing && (
                          <button type="button" className="cd-back-current" style={{ margin: "0 auto" }} onClick={() => { setEditing(false); setOpenPhase(0); }}>
                            Cancelar y volver al recibo
                          </button>
                        )}
                        {submitError && <p style={{ color: "var(--cd-accent-2)", fontSize: 12, margin: 0 }}>{submitError}</p>}
                        <div className="cd-readiness-warn">Podrás ajustar tu selección desde esta misma página hasta el 31 de julio.</div>
                      </div>
                    )}
                  </div>

                  <p className="cd-footnote">{entry.products.length} producto{entry.products.length === 1 ? "" : "s"} elegible{entry.products.length === 1 ? "" : "s"} en total.</p>
                </>
              )}</div>
            </div>
          </div>
          )}

          {/* Fase 2 — En revisión */}
          {expandedIdx === 1 && (
          <div id="fase-2" className="cd-phase" data-reveal>
            <div className={`cd-phase-card${curaduriaStep?.state === "bloqueado" ? " is-locked" : ""}`}>
              <div className="cd-phase-body">
                <div className="cd-phase-note">
                  {curaduriaStep?.state === "bloqueado" && "Empieza cuando cierre la postulación. No necesitas hacer nada todavía."}
                  {curaduriaStep?.state === "actual" && (<><span className="cd-waiting-dot" />Estamos revisando tu selección. Te avisamos por WhatsApp en cuanto esté lista.</>)}
                  {curaduriaStep?.state === "hecho" && "Tu revisión ya se resolvió. Sigue con la preparación de tus productos."}
                </div>
                {curaduriaStep?.state === "actual" && (
                  <div className="cd-fact">💡 Mientras esperas: más de <b>63.000 dropshippers</b> en Dropi podrán ver tu catálogo cuando esté en vivo.</div>
                )}
              </div>
            </div>
          </div>
          )}

          {/* Fase 3 — Prepara tus fotos */}
          {expandedIdx === 2 && (
          <div id="fase-3" className="cd-phase" data-reveal>
            <div className={`cd-phase-card${fotosStep?.state === "actual" ? " is-active" : fotosStep?.state === "bloqueado" ? " is-locked" : ""}`}>
              <div className="cd-phase-body">
                  {fotosStep?.state === "bloqueado" && <div className="cd-phase-note">🔒 Se habilita cuando termine la revisión ({fotosStep?.window}).</div>}

                  {fotosOpen && (
                    <>
                      <div className="cd-approved-banner">🎉 ¡Tus productos fueron aprobados!</div>

                      <div className="cd-prep-head">
                        <span className="cd-checklist-title">Antes de que empiece Cyber Days</span>
                        <span className="cd-checklist-count">{doneCount} de 4</span>
                      </div>
                      <div className="cd-progress"><span style={{ ["--p" as string]: doneCount / 4 }} /></div>

                      <div className="cd-steps">
                        <div className="cd-step">
                          <div className="cd-step-num">1</div>
                          <div className="cd-step-body">
                            <div className="cd-step-title">Consigue tus fotos con el marco</div>
                            <div className="cd-step-sub">Descarga la foto de cada producto con el marco oficial de Cyber Days. Estas fotos las vas a usar en los dos catálogos de abajo.</div>
                            <div className="cd-step-actions">
                              {MARCO_LINK ? (
                                <a className="cd-toolcard-cta" href={MARCO_LINK} target="_blank" rel="noopener noreferrer">Abrir la herramienta →</a>
                              ) : (
                                <span className="cd-toolcard-cta is-pending">Link pendiente</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="cd-catgrid">
                        <div className="cd-catcard">
                          <div className="cd-catcard-head">
                            <div>
                              <div className="cd-catcard-title">📄 Catálogo PDF</div>
                              <div className="cd-catcard-tag">El que reciben los dropshippers por WhatsApp</div>
                            </div>
                            <span className="cd-catcard-chip">Antes del 9 ago</span>
                          </div>
                          <p className="cd-catcard-sub">Monta cada producto en la plantilla: foto con marco, precio con descuento y nombre. Lo que no esté aquí el 9 de agosto no sale en el PDF.</p>
                          <div className="cd-step-checks">
                            <label className="cd-check-item">
                              <input type="checkbox" checked={!!checklist.fotoCanva} onChange={() => toggleChecklist("fotoCanva")} />
                              <span className={`cd-check-box${checklist.fotoCanva ? " is-done" : ""}`}>{checklist.fotoCanva ? "✓" : ""}</span>
                              <span>Mis productos ya están en el catálogo PDF</span>
                            </label>
                          </div>
                          <div className="cd-step-actions">
                            {CANVA_LINK ? (
                              <a className="cd-toolcard-cta" href={CANVA_LINK} target="_blank" rel="noopener noreferrer">Abrir Canva →</a>
                            ) : (
                              <span className="cd-toolcard-cta is-pending">Link pendiente</span>
                            )}
                          </div>
                        </div>

                        <div className="cd-catcard">
                          <div className="cd-catcard-head">
                            <div>
                              <div className="cd-catcard-title">🛍️ Catálogo de Dropi</div>
                              <div className="cd-catcard-tag">Tus productos dentro de la plataforma</div>
                            </div>
                            <span className="cd-catcard-chip">Del 9 al 11 ago</span>
                          </div>
                          <div className="cd-catcard-warn">⏳ <b>No lo hagas antes del 9</b> — tus productos se verían vestidos de una campaña que todavía no empieza.</div>
                          <div className="cd-step-checks">
                            <label className="cd-check-item">
                              <input type="checkbox" checked={!!checklist.fotoDropi} onChange={() => toggleChecklist("fotoDropi")} />
                              <span className={`cd-check-box${checklist.fotoDropi ? " is-done" : ""}`}>{checklist.fotoDropi ? "✓" : ""}</span>
                              <span>Foto con marco en tu producto</span>
                            </label>
                            <label className="cd-check-item">
                              <input type="checkbox" checked={!!checklist.nombre} onChange={() => toggleChecklist("nombre")} />
                              <span className={`cd-check-box${checklist.nombre ? " is-done" : ""}`}>{checklist.nombre ? "✓" : ""}</span>
                              <span>Nombre con &quot;Cyber Days&quot;</span>
                            </label>
                            <label className="cd-check-item">
                              <input type="checkbox" checked={!!checklist.categoria} onChange={() => toggleChecklist("categoria")} />
                              <span className={`cd-check-box${checklist.categoria ? " is-done" : ""}`}>{checklist.categoria ? "✓" : ""}</span>
                              <span>Categoría &quot;Cyber Days&quot;</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </div>
            </div>
          </div>
          )}

          {/* Fase 4 — En vivo / cierre */}
          {expandedIdx === 3 && (
          <div id="fase-4" className="cd-phase" data-reveal>
            <div className={`cd-phase-card${vivoStep?.state !== "bloqueado" ? " is-celebrate" : " is-locked"}`}>
              <div className="cd-phase-body">
              {vivoStep?.state === "actual" && (
                <>
                  <div className="cd-celebrate">
                    <div className="cd-celebrate-icon">🎉</div>
                    <div className="cd-celebrate-text">Del 11 al 24 de agosto tu catálogo se promociona con toda la campaña. ¡Éxitos!</div>
                  </div>
                  <div className="cd-toolcard">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div className="cd-toolcard-icon">🔗</div>
                      <div>
                        <div className="cd-toolcard-title">Comparte tu catálogo</div>
                        <div className="cd-toolcard-sub">Envía el link a tus dropshippers para que vean tus productos en Cyber Days.</div>
                      </div>
                    </div>
                    {CANVA_LINK ? (
                      <span style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                        <button className="cd-toolcard-cta" onClick={copyCatalog}>{copied ? "¡Copiado!" : "Copiar link"}</button>
                        <a className="cd-toolcard-cta" href={CANVA_LINK} target="_blank" rel="noopener noreferrer">Abrir →</a>
                      </span>
                    ) : (
                      <span className="cd-toolcard-cta is-pending">Link pendiente</span>
                    )}
                  </div>
                </>
              )}

              {vivoStep?.state === "hecho" && (
                <>
                  <div className="cd-celebrate">
                    <div className="cd-celebrate-icon">🏆</div>
                    <div className="cd-celebrate-text">Cyber Days terminó, ¡gracias por participar!</div>
                  </div>
                  <div className="cd-phase-note" style={{ marginTop: 12 }}>Vuelve a dejar tus productos como estaban: quita &quot;Cyber Days&quot; del nombre, la categoría y la foto con marco.</div>
                  <p className="cd-footnote">Esta es la primera de varias campañas que vamos a hacer. Te avisamos por WhatsApp cuando arranque la próxima.</p>
                </>
              )}

              {vivoStep?.state === "bloqueado" && (
                <div className="cd-phase-note">Del 11 al 24 de agosto tus productos aparecen en el catálogo para dropshippers.</div>
              )}
              </div>
            </div>
          </div>
          )}

          {openPhase !== null && openPhase !== autoIdx && (
            <div style={{ textAlign: "center" }}>
              <button type="button" className="cd-back-current" onClick={() => setOpenPhase(null)}>← Volver a tu paso actual</button>
            </div>
          )}

          <p className="cd-brandline">Más ventas para más dropshippers en <b>Latinoamérica</b> ⚡</p>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
