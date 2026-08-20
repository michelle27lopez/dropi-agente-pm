"use client";

import "primeicons/primeicons.css";
import { use, useEffect, useRef, useState } from "react";

// Mismos tokens reales que /proyectos/indicadores/prospectos — ver ese archivo
// para la fuente (dropi-prototypes/src/styles/_variables-new.scss).
const DS = {
  primary100: "#FDE8D0", primary500: "#FF6102", primary600: "#D98432",
  gray50: "#F7F8FA", gray100: "#EEF0F4", gray200: "#C3C9D9", gray400: "#858EA6", gray500: "#69738C", gray700: "#333B4D",
  white: "#FFFFFF",
  success500: "#0ABB87",
  error500: "#F46A6B", error700: "#AA4849", error100: "#FCD4D4",
  radius2: "8px", radius3: "12px", radius4: "24px",
  shadowMedium: "0.5px 4px 8px rgba(0, 0, 0, 0.08)",
};

const card: React.CSSProperties = {
  background: DS.white, border: `1px solid ${DS.gray100}`, borderRadius: DS.radius3,
  padding: 28, boxShadow: DS.shadowMedium,
};

// Insignias reales del producto (assets entregados por Michelle 29/07/2026).
const BADGE_IMG: Record<string, string> = { Verificado: "/badges/verificado.png", Premium: "/badges/premium.png" };

// Premium es el nivel tope: mismo lenguaje visual (fondo, tipografía, spring de
// la insignia), pero con un acento más rico (champán/oro en vez de ámbar) para
// que se sienta un escalón arriba de Verificado sin inventar un sistema nuevo.
const NIVEL_THEME: Record<string, { accent: string; accentSoft: string; ctaBg: string; ctaText: string; ctaShadow: string }> = {
  Verificado: {
    accent: "#FFD8A8", accentSoft: "rgba(255, 209, 140, 0.55)",
    ctaBg: DS.primary500, ctaText: DS.white, ctaShadow: "rgba(255, 97, 2, 0.28)",
  },
  Premium: {
    accent: "#E8CB8C", accentSoft: "rgba(232, 203, 140, 0.5)",
    ctaBg: "linear-gradient(135deg, #F1DBA3 0%, #C99A45 100%)", ctaText: "#241A08", ctaShadow: "rgba(201, 154, 69, 0.35)",
  },
};

const BENEFICIOS: Record<string, string[]> = {
  Verificado: ["Aprobación automática de productos", "Acceso a Caza Productos", "Banner destacado en catálogo"],
  Premium: ["Visita comercial personalizada", "Presencia en lives de Dropi", "Relacionamiento con comunidades"],
};

// Copy por nivel — versión celebratoria acordada con Michelle (29/07/2026):
// el dato (órdenes) es la única prueba de logro, sin adjetivos nuestros sobre
// el proveedor. Los requisitos que debe sostener van escondidos como fine
// print (ver REQUISITOS), no en el cuerpo principal.
const COPY: Record<string, { eyebrow: string; badge: string; cuerpo: (n: number) => string; beneficiosLead: string; cta: string; ctaSecundario: string }> = {
  Verificado: {
    eyebrow: "¡Tu esfuerzo tiene recompensa!",
    badge: "¡Llegaste al Nivel Verificado!",
    cuerpo: (n) => `¡Lograste ${n.toLocaleString("es-CO")} órdenes en 90 días y superaste con éxito la meta de este nivel!`,
    beneficiosLead: "Al subir de nivel, desbloqueas:",
    cta: "Activar Mis Beneficios",
    ctaSecundario: "Quizás más tarde",
  },
  Premium: {
    eyebrow: "¡Tu esfuerzo tiene recompensa!",
    badge: "¡Llegaste al Nivel Premium!",
    cuerpo: (n) => `¡Procesaste ${n.toLocaleString("es-CO")} órdenes en los últimos 90 días! Superaste todas las expectativas.`,
    beneficiosLead: "Al subir de nivel, desbloqueas:",
    cta: "Activar Mis Beneficios",
    ctaSecundario: "Todavía no",
  },
};

// Requisitos reales por nivel (tabla "Categorías de Proveedores") — el umbral
// de órdenes se toma de la oferta (dinámico); el resto son constantes de
// política, iguales para todos los proveedores de ese nivel.
// Premium en la tabla oficial es 45.000/trimestre — confirmado por Michelle
// (30/07/2026). El import (/api/proyectos/prospectos-ascenso/importar)
// también quedó en 45.000; cualquier fila vieja en supplier_ascenso_panel
// con 20.000 sembrado se corrige sola en la próxima carga semanal del CSV.
const REQUISITOS_TIEMPO: Record<string, string> = { Verificado: "48h", Premium: "24h" };
function requisitos(nivel: string, umbralOrdenes: number) {
  const tiempo = REQUISITOS_TIEMPO[nivel] ?? "48h";
  return [
    { variable: "Órdenes movilizadas por trimestre", valor: umbralOrdenes.toLocaleString("es-CO") },
    { variable: "Utilización de EcomScanner", valor: "100%" },
    { variable: "Gestión de garantías", valor: "100%" },
    { variable: "Tiempos en garantías", valor: tiempo },
    { variable: "% de despachos", valor: "100%" },
    { variable: "Tiempo de despachos", valor: tiempo },
    { variable: "Comunicación con el área", valor: "Efectiva" },
  ];
}

const MOTIVOS_RECHAZO = [
  "No quiero comprometerme con tiempos de despacho/garantía menores",
  "No tengo capacidad operativa para sostener el volumen",
  "No conocía los beneficios, necesito más información antes de decidir",
  "No es el momento adecuado para mi negocio",
  "Prefiero mantenerme en mi nivel actual",
  "Otro",
];

type Oferta = {
  token: string; supplier_name: string; nivel_actual: string; nivel_objetivo: string;
  ordenes_movilizadas_90d: number | null; umbral_objetivo: number;
  estado: "enviada" | "aceptada" | "rechazada"; motivo_rechazo: string | null;
};

// Modo de pruebas: tokens `preview-{verificado|premium}-{pendiente|aceptada}`
// no dependen de que exista una oferta real en Supabase — sirven para que el
// equipo pueda ver ambas pantallas (y sus estilos) en cualquier momento, sin
// esperar a que un proveedor real llegue a ese nivel. Enlazados desde el
// header de /proyectos/indicadores/prospectos.
const PREVIEW_DATA: Record<string, { ordenes: number; umbral: number }> = {
  verificado: { ordenes: 3420, umbral: 3000 },
  premium: { ordenes: 52340, umbral: 45000 },
};
function buildPreviewOferta(nivel: "verificado" | "premium", estado: "pendiente" | "aceptada" | "rechazada"): Oferta {
  const nivelObjetivo = nivel === "premium" ? "Premium" : "Verificado";
  const { ordenes, umbral } = PREVIEW_DATA[nivel];
  return {
    token: `preview-${nivel}-${estado}`,
    supplier_name: "Proveedor de Prueba",
    nivel_actual: nivelObjetivo === "Premium" ? "Verificado" : "No Verificado",
    nivel_objetivo: nivelObjetivo,
    ordenes_movilizadas_90d: ordenes,
    umbral_objetivo: umbral,
    estado: estado === "aceptada" ? "aceptada" : estado === "rechazada" ? "rechazada" : "enviada",
    motivo_rechazo: estado === "rechazada" ? MOTIVOS_RECHAZO[0] : null,
  };
}

// Tags de salto rápido entre las 3 pantallas del flujo — solo visibles en modo
// de pruebas (token preview-*), para que el equipo no tenga que ir y volver a
// /proyectos/indicadores/prospectos cada vez que quiere ver otro estado.
function PreviewNav({ nivel, estado }: { nivel: "verificado" | "premium"; estado: "pendiente" | "aceptada" | "rechazada" }) {
  const opciones: { key: "pendiente" | "aceptada" | "rechazada"; label: string }[] = [
    { key: "pendiente", label: "Pendiente" },
    { key: "aceptada", label: "Aceptada" },
    { key: "rechazada", label: "Rechazada" },
  ];
  const accent = NIVEL_THEME[nivel === "premium" ? "Premium" : "Verificado"].accent;
  return (
    <div style={{
      position: "fixed", left: "50%", bottom: 14, transform: "translateX(-50%)", zIndex: 50,
      display: "flex", gap: 6, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
      border: "1px solid rgba(255,255,255,0.14)", borderRadius: 999, padding: 5,
    }}>
      {opciones.map(o => (
        <a
          key={o.key}
          href={`/proyectos/indicadores/ascenso/preview-${nivel}-${o.key}`}
          style={{
            fontSize: 11, fontWeight: 600, padding: "5px 10px", borderRadius: 999, textDecoration: "none",
            color: o.key === estado ? "#0c0a08" : "rgba(255,255,255,0.75)",
            background: o.key === estado ? accent : "transparent",
          }}
        >
          {o.label}
        </a>
      ))}
    </div>
  );
}

// ─── Momento de revelación ──────────────────────────────────────────────
// Escenario a pantalla completa (sin card blanca ni fondo gris alrededor —
// el fondo real generado por IA ES la pantalla). Insignia real con
// spring/overshoot + destello + conteo animado. Partículas ámbar en canvas.
// Concepto: "insignia de negocio" (condecoración), no gamificación infantil.
// Respeta prefers-reduced-motion (partículas y animaciones se desactivan).
function EmberParticles({ variant }: { variant: "drift" | "burst" }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const colors = ["rgba(255,138,61,0.85)", "rgba(255,196,110,0.85)", "rgba(255,224,168,0.9)"];
    type P = { x: number; y: number; r: number; vx: number; vy: number; life: number; maxLife: number; color: string };
    const particles: P[] = [];
    const spawnDrift = (): P => ({
      x: Math.random() * w, y: h + 6, r: 1 + Math.random() * 1.8,
      vx: (Math.random() - 0.5) * 0.15, vy: -(0.25 + Math.random() * 0.35),
      life: 0, maxLife: 6000 + Math.random() * 4000, color: colors[Math.floor(Math.random() * colors.length)],
    });
    const spawnBurst = (): P => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.6 + Math.random() * 1.4;
      return {
        x: w / 2, y: h / 2, r: 1.5 + Math.random() * 2,
        vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed - 0.3,
        life: 0, maxLife: 900 + Math.random() * 500, color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    if (variant === "burst") {
      for (let i = 0; i < 46; i++) particles.push(spawnBurst());
    } else {
      for (let i = 0; i < 22; i++) { const p = spawnDrift(); p.life = Math.random() * p.maxLife; particles.push(p); }
    }

    let raf = 0;
    let last = performance.now();
    function tick(now: number) {
      const dt = now - last;
      last = now;
      ctx!.clearRect(0, 0, w, h);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life += dt;
        p.x += p.vx * (dt / 16);
        p.y += p.vy * (dt / 16);
        const t = p.life / p.maxLife;
        if (variant === "drift") {
          if (t >= 1) { particles[i] = spawnDrift(); continue; }
          const alpha = t < 0.15 ? t / 0.15 : t > 0.8 ? (1 - t) / 0.2 : 1;
          ctx!.globalAlpha = Math.max(0, alpha) * 0.8;
        } else {
          if (t >= 1) { particles.splice(i, 1); continue; }
          ctx!.globalAlpha = Math.max(0, 1 - t);
        }
        ctx!.beginPath();
        ctx!.fillStyle = p.color;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }
      ctx!.globalAlpha = 1;
      if (variant === "drift" || particles.length > 0) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant]);

  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

function useCountUp(target: number | null, durationMs = 1100, startDelayMs = 260) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target == null) return;
    const finalValue = target;
    let raf = 0;
    let start: number | null = null;
    const timeout = setTimeout(() => {
      function step(ts: number) {
        if (start === null) start = ts;
        const progress = Math.min((ts - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(eased * finalValue));
        if (progress < 1) raf = requestAnimationFrame(step);
      }
      raf = requestAnimationFrame(step);
    }, startDelayMs);
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf); };
  }, [target, durationMs, startDelayMs]);
  return value;
}

// Escenario a pantalla completa: fondo real generado por IA (fondo3, entregado
// por Michelle 29/07/2026 — reemplazó dos tandas anteriores descartadas por
// grano/ruido) + degradado sutil de legibilidad + partículas ámbar en canvas.
function FullBleedStage({ variant, children }: { variant: "drift" | "burst"; children: React.ReactNode }) {
  return (
    <main style={{ position: "relative", minHeight: "100vh", overflow: "hidden", isolation: "isolate", background: "#0c0a08" }}>
      <img src="/ascenso/spotlight-bg.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0.25) 60%, rgba(5,3,2,0.6) 100%)",
      }} />
      <EmberParticles variant={variant} />
      <div style={{ position: "relative", zIndex: 1, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "56px 24px" }}>
        <div style={{ width: "100%", maxWidth: 440 }}>{children}</div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 22, zIndex: 1, display: "flex", justifyContent: "center", pointerEvents: "none" }}>
        <img src="/Logo-dropi.svg" alt="Dropi" style={{ height: 40, opacity: 0.92 }} />
      </div>
    </main>
  );
}

function Reveal({ badgeImg, eyebrow, title, numero, numeroLabel, size = 112, accent = "#FFD8A8", accentSoft = "rgba(255, 209, 140, 0.55)" }: {
  badgeImg?: string; eyebrow: string; title?: string; numero?: number | null; numeroLabel?: string; size?: number; accent?: string; accentSoft?: string;
}) {
  const count = useCountUp(numero ?? null);
  return (
    <div style={{ textAlign: "center", marginBottom: 28 }}>
      <div className="spot-badge" style={{ position: "relative", display: "inline-block" }}>
        <div className="spot-glow" style={{ background: `radial-gradient(circle, ${accentSoft} 0%, rgba(0,0,0,0) 70%)` }} />
        {badgeImg ? (
          <img src={badgeImg} alt="" style={{ width: size, height: size, position: "relative", zIndex: 1, display: "block" }} />
        ) : (
          <i className="pi pi-check-circle" style={{ fontSize: size * 0.6, color: DS.success500, position: "relative", zIndex: 1, display: "block" }} />
        )}
      </div>
      <div style={{ marginTop: 16 }}>
        <div className="spot-fade" style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.6, color: accent, textTransform: "uppercase" }}>
          {eyebrow}
        </div>
        {title && (
          <div className="spot-fade spot-fade-2" style={{ fontSize: 30, fontWeight: 780, color: "#FFF", marginTop: 8, lineHeight: 1.1, letterSpacing: -0.5 }}>
            {title}
          </div>
        )}
        {numero != null && (
          <div className="spot-fade spot-fade-2" style={{ marginTop: title ? 18 : 6 }}>
            <div style={{ fontSize: 52, fontWeight: 820, color: "#FFF", letterSpacing: -1.5, lineHeight: 1 }}>{count.toLocaleString("es-CO")}</div>
            {numeroLabel && <div style={{ fontSize: 13, fontWeight: 650, color: accent, marginTop: 6 }}>{numeroLabel}</div>}
          </div>
        )}
      </div>
      <style jsx>{`
        .spot-badge { animation: spotBadgeIn 700ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
        .spot-glow {
          position: absolute; inset: -26px; border-radius: 50%;
          animation: spotGlowPulse 1800ms ease-out 650ms both;
        }
        .spot-fade { opacity: 0; animation: spotFadeUp 500ms ease-out 480ms both; }
        .spot-fade-2 { animation-delay: 620ms; }
        @keyframes spotBadgeIn {
          0% { transform: scale(0) rotate(-8deg); opacity: 0; }
          60% { transform: scale(1.12) rotate(2deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes spotGlowPulse {
          0% { opacity: 0; transform: scale(0.6); }
          40% { opacity: 1; }
          100% { opacity: 0; transform: scale(1.4); }
        }
        @keyframes spotFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .spot-badge, .spot-glow, .spot-fade { animation: none !important; opacity: 1 !important; transform: none !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Tarjeta descargable para compartir ────────────────────────────────
// Formato historia (1080×1920) sobre el mismo fondo real generado por IA
// que usa el momento in-app. El proveedor la comparte para darle
// credibilidad a SU negocio frente a SUS clientes — por eso el copy habla
// en lenguaje de comprador final ("pedidos entregados"), no en la jerga
// interna de Dropi ("órdenes movilizadas"), y la marca Dropi queda solo
// como sello discreto abajo, nunca como protagonista.
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function buildShareCard(oferta: Oferta): Promise<string> {
  const W = 1080, H = 1920;
  const canvas = document.createElement("canvas");
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext("2d")!;
  const theme = NIVEL_THEME[oferta.nivel_objetivo] ?? NIVEL_THEME.Verificado;

  const [bg, badge, logo] = await Promise.all([
    loadImage("/ascenso/spotlight-bg.png"),
    loadImage(BADGE_IMG[oferta.nivel_objetivo]),
    loadImage("/Logo-dropi.svg"),
  ]);

  // El fondo real (941×1672) casi coincide con el aspect ratio de la
  // tarjeta (1080×1920) — cover-fit centrado, sin recortes visibles.
  const bgScale = Math.max(W / bg.width, H / bg.height);
  const bgW = bg.width * bgScale, bgH = bg.height * bgScale;
  ctx.drawImage(bg, (W - bgW) / 2, (H - bgH) / 2, bgW, bgH);

  const badgeSize = 300;
  ctx.save();
  ctx.shadowColor = theme.accentSoft;
  ctx.shadowBlur = 70;
  ctx.drawImage(badge, (W - badgeSize) / 2, 200, badgeSize, badgeSize);
  ctx.restore();

  ctx.textAlign = "center";
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.6)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = theme.accent;
  ctx.font = "700 32px system-ui, -apple-system, sans-serif";
  ctx.fillText(`NEGOCIO ${oferta.nivel_objetivo.toUpperCase()} EN DROPI`, W / 2, 630);
  ctx.restore();

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "800 74px system-ui, -apple-system, sans-serif";
  ctx.fillText(oferta.supplier_name, W / 2, 730);

  if (oferta.ordenes_movilizadas_90d != null) {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "800 168px system-ui, -apple-system, sans-serif";
    ctx.fillText(oferta.ordenes_movilizadas_90d.toLocaleString("es-CO"), W / 2, 930);
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "670 38px system-ui, -apple-system, sans-serif";
    ctx.fillText("pedidos entregados", W / 2, 1000);
    ctx.fillStyle = theme.accent;
    ctx.font = "500 26px system-ui, -apple-system, sans-serif";
    ctx.fillText("en los últimos 90 días", W / 2, 1045);
  }

  // Cierre institucional: línea + logo Dropi grande y centrado — el nivel ya
  // quedó dicho en el eyebrow de arriba, no hace falta repetirlo aquí.
  const ruleY = 1400;
  ctx.strokeStyle = "rgba(255,255,255,0.14)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(88, ruleY);
  ctx.lineTo(W - 88, ruleY);
  ctx.stroke();

  const logoH = 56, logoW = logoH * (logo.width / logo.height);
  ctx.drawImage(logo, (W - logoW) / 2, ruleY + 60, logoW, logoH);

  return canvas.toDataURL("image/png");
}

// Ícono flotante — acción secundaria de verdad, no compite con la
// celebración. Vive sobre la esquina superior del bloque de revelación.
function ShareIconButton({ oferta }: { oferta: Oferta }) {
  const [generating, setGenerating] = useState(false);
  const theme = NIVEL_THEME[oferta.nivel_objetivo] ?? NIVEL_THEME.Verificado;

  async function handleDownload() {
    setGenerating(true);
    try {
      const dataUrl = await buildShareCard(oferta);
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `dropi-${oferta.nivel_objetivo.toLowerCase()}-${oferta.supplier_name.replace(/\s+/g, "-").toLowerCase()}.png`;
      a.click();
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={generating}
      aria-label="Descargar imagen para compartir"
      title="Descargar imagen para compartir"
      className="share-icon-btn"
      style={{
        position: "absolute", top: -8, right: -8, display: "flex", flexDirection: "column", alignItems: "center", gap: 5,
        background: "none", border: "none", cursor: "pointer", zIndex: 2,
      }}
    >
      <span className="share-icon-circle" style={{
        width: 44, height: 44, borderRadius: "50%",
        background: "rgba(20,14,10,0.55)", border: "1px solid rgba(255,255,255,0.25)", color: theme.accent,
        display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)",
      }}>
        <i className={generating ? "pi pi-spin pi-spinner" : "pi pi-download"} style={{ fontSize: 17 }} />
      </span>
      <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.75)" }}>Compartir</span>
      <style jsx>{`
        .share-icon-circle { transition: background-color 150ms ease-out, transform 150ms ease-out; }
        .share-icon-btn:hover:not(:disabled) .share-icon-circle { background: rgba(20,14,10,0.75); transform: scale(1.05); }
        .share-icon-btn:focus-visible { outline: 2px solid #FFD8A8; outline-offset: 2px; }
      `}</style>
    </button>
  );
}

export default function AscensoOfertaPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const [oferta, setOferta] = useState<Oferta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showRechazo, setShowRechazo] = useState(false);
  const [motivo, setMotivo] = useState(MOTIVOS_RECHAZO[0]);
  const [motivoOtro, setMotivoOtro] = useState("");
  const [showRequisitos, setShowRequisitos] = useState(false);

  const preview = /^preview-(verificado|premium)-(pendiente|aceptada|rechazada)$/.exec(token);

  useEffect(() => {
    if (preview) {
      setOferta(buildPreviewOferta(preview[1] as "verificado" | "premium", preview[2] as "pendiente" | "aceptada" | "rechazada"));
      setLoading(false);
      return;
    }
    fetch(`/api/proyectos/ascenso-ofertas/${token}`)
      .then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setOferta)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [token]);

  async function responder(accepted: boolean) {
    const motivoFinal = motivo === "Otro" ? motivoOtro : motivo;
    if (preview) {
      setOferta(o => o ? { ...o, estado: accepted ? "aceptada" : "rechazada", motivo_rechazo: accepted ? null : motivoFinal } : o);
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/proyectos/ascenso-ofertas/${token}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accepted, motivo: accepted ? undefined : motivoFinal }),
      });
      const data = await res.json();
      if (res.ok) setOferta(data.oferta);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Wrapper><div style={{ ...card, textAlign: "center", color: DS.gray400 }}>Cargando tu oferta…</div></Wrapper>;
  if (error || !oferta) return <Wrapper><div style={{ ...card, textAlign: "center", color: DS.error500 }}>No encontramos esta oferta. El link puede haber expirado.</div></Wrapper>;

  const beneficios = BENEFICIOS[oferta.nivel_objetivo] ?? [];
  const theme = NIVEL_THEME[oferta.nivel_objetivo] ?? NIVEL_THEME.Verificado;

  if (oferta.estado === "aceptada") {
    return (
      <FullBleedStage variant="burst">
        <div style={{ position: "relative" }}>
          <ShareIconButton oferta={oferta} />
          <Reveal
            badgeImg={BADGE_IMG[oferta.nivel_objetivo]}
            eyebrow="Ahora eres"
            title={oferta.nivel_objetivo}
            numero={oferta.ordenes_movilizadas_90d}
            numeroLabel="órdenes en 90 días"
            size={128}
            accent={theme.accent}
            accentSoft={theme.accentSoft}
          />
          <div style={{
            textAlign: "center", background: "rgba(18,12,9,0.38)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: DS.radius3, padding: "16px 18px", backdropFilter: "blur(10px)",
          }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#FFF", marginBottom: 6 }}>¡Confirmado, {oferta.supplier_name}!</div>
            <div style={{ fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.5 }}>
              Ya eres <strong style={{ color: theme.accent }}>{oferta.nivel_objetivo}</strong>. Descarga tu insignia y compártela con tus clientes.
            </div>
          </div>
        </div>
        {preview && <PreviewNav nivel={preview[1] as "verificado" | "premium"} estado="aceptada" />}
      </FullBleedStage>
    );
  }

  if (oferta.estado === "rechazada") {
    return (
      <Wrapper>
        <div style={{ ...card, textAlign: "center" }}>
          <i className="pi pi-thumbs-up" style={{ fontSize: 36, color: DS.gray400, marginBottom: 12, display: "block" }} />
          <div style={{ fontSize: 18, fontWeight: 700, color: DS.gray700, marginBottom: 8 }}>Gracias por tu respuesta</div>
          <div style={{ fontSize: 14, color: DS.gray500, lineHeight: 1.5 }}>
            Quedas en <strong>{oferta.nivel_actual}</strong> por ahora. Cuando quieras avanzar, la oferta va a seguir disponible en tu tablero de desempeño.
          </div>
        </div>
        {preview && <PreviewNav nivel={preview[1] as "verificado" | "premium"} estado="rechazada" />}
      </Wrapper>
    );
  }

  const copy = COPY[oferta.nivel_objetivo] ?? COPY.Verificado;

  return (
    <FullBleedStage variant="drift">
      <Reveal
        badgeImg={BADGE_IMG[oferta.nivel_objetivo]}
        eyebrow={copy.eyebrow}
        title={copy.badge}
        numero={null}
        size={104}
        accent={theme.accent}
        accentSoft={theme.accentSoft}
      />
      <div style={{ fontSize: 16, fontWeight: 600, color: "#FFF", marginBottom: 8 }}>Hola, {oferta.supplier_name}:</div>
      <div style={{ fontSize: 14, color: "rgba(255,255,255,0.85)", lineHeight: 1.6 }}>
        {oferta.ordenes_movilizadas_90d != null ? copy.cuerpo(oferta.ordenes_movilizadas_90d) : `Estos son los beneficios de ${oferta.nivel_objetivo}:`}
      </div>

      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 0.3, color: "rgba(255,255,255,0.6)", margin: "22px 0 10px" }}>
        {copy.beneficiosLead}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
        {beneficios.map(b => (
          <div key={b} style={{
            display: "flex", gap: 10, alignItems: "flex-start", fontSize: 13, color: "rgba(255,255,255,0.9)",
            background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: DS.radius3, padding: "11px 12px",
            backdropFilter: "blur(14px) saturate(160%)", WebkitBackdropFilter: "blur(14px) saturate(160%)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 20px rgba(0,0,0,0.16)",
          }}>
            <span style={{
              flex: "0 0 20px", width: 20, height: 20, borderRadius: "50%", background: "rgba(10,187,135,0.16)",
              color: "#43d7ad", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
            }}>
              <i className="pi pi-check" />
            </span>
            <span style={{ lineHeight: 1.35, marginTop: 1 }}>{b}</span>
          </div>
        ))}
      </div>

      {!showRechazo ? (
        <>
          <div className="cta-reveal" style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 12 }}>
            <button onClick={() => responder(true)} disabled={submitting} className="cta-primary" style={{ background: theme.ctaBg, color: theme.ctaText, border: "none", borderRadius: DS.radius3, padding: "14px", fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%" }}>
              {copy.cta}
            </button>
            <button onClick={() => setShowRechazo(true)} disabled={submitting} className="cta-ghost" style={{ background: "rgba(255,255,255,0.1)", color: "#FFF", border: "1px solid rgba(255,255,255,0.3)", borderRadius: DS.radius3, padding: "14px", fontSize: 15, fontWeight: 600, cursor: "pointer", width: "100%" }}>
              {copy.ctaSecundario}
            </button>
          </div>
          <style jsx>{`
            .cta-reveal { opacity: 0; animation: ctaFadeUp 480ms ease-out 900ms both; }
            .cta-primary { transition: transform 150ms ease-out, box-shadow 150ms ease-out; }
            .cta-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 14px ${theme.ctaShadow}; }
            .cta-primary:active:not(:disabled) { transform: translateY(0); }
            .cta-ghost { transition: background-color 150ms ease-out; }
            .cta-ghost:hover:not(:disabled) { background: rgba(255,255,255,0.18); }
            @keyframes ctaFadeUp {
              from { opacity: 0; transform: translateY(6px); }
              to { opacity: 1; transform: translateY(0); }
            }
            @media (prefers-reduced-motion: reduce) {
              .cta-reveal { animation: none !important; opacity: 1 !important; transform: none !important; }
            }
          `}</style>

          <button onClick={() => setShowRequisitos(s => !s)} style={{ background: "none", border: "none", padding: 0, fontSize: 11, color: "rgba(255,255,255,0.6)", cursor: "pointer", textDecoration: "underline" }}>
            Requisitos del nivel y Términos y Condiciones
          </button>

          {showRequisitos && (
            <div style={{ marginTop: 12, background: "rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: DS.radius2, padding: 14 }}>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.75)", lineHeight: 1.5, marginBottom: 10 }}>
                Para mantenerte en {oferta.nivel_objetivo} debes sostener estos indicadores. Si en algún momento no los cumples, tu comercial te contacta primero para ver qué está pasando y te da tiempo para recuperarte — bajar de categoría es siempre el último paso.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {requisitos(oferta.nivel_objetivo, oferta.umbral_objetivo).map(r => (
                  <div key={r.variable} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#FFF", gap: 12 }}>
                    <span style={{ color: "rgba(255,255,255,0.65)" }}>{r.variable}</span>
                    <span style={{ fontWeight: 600 }}>{r.valor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: DS.radius3, padding: 16 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#FFF", marginBottom: 8 }}>¿Cuál es el motivo?</div>
          <select value={motivo} onChange={e => setMotivo(e.target.value)} style={{ width: "100%", height: 40, padding: "0 12px", borderRadius: DS.radius3, border: `1px solid ${DS.gray200}`, fontSize: 13, marginBottom: 10, background: DS.white, color: DS.gray700 }}>
            {MOTIVOS_RECHAZO.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          {motivo === "Otro" && (
            <textarea value={motivoOtro} onChange={e => setMotivoOtro(e.target.value)} placeholder="Cuéntanos brevemente…" style={{ width: "100%", padding: "10px 12px", borderRadius: DS.radius3, border: `1px solid ${DS.gray200}`, fontSize: 13, marginBottom: 10, minHeight: 60, background: DS.white, color: DS.gray700 }} />
          )}
          <div style={{ display: "flex", gap: 10 }}>
            <button onClick={() => responder(false)} disabled={submitting || (motivo === "Otro" && !motivoOtro.trim())} style={{ flex: 1, background: DS.error500, color: DS.white, border: "none", borderRadius: DS.radius3, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Confirmar rechazo
            </button>
            <button onClick={() => setShowRechazo(false)} style={{ flex: 1, background: "rgba(255,255,255,0.1)", color: "#FFF", border: "1px solid rgba(255,255,255,0.3)", borderRadius: DS.radius3, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
              Volver
            </button>
          </div>
        </div>
      )}
      {preview && <PreviewNav nivel={preview[1] as "verificado" | "premium"} estado="pendiente" />}
    </FullBleedStage>
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", background: DS.gray50, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ width: "100%", maxWidth: 460 }}>{children}</div>
    </main>
  );
}
