"use client";

import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { Anton } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookOpen, FileImage, Layers, Lock, MousePointerClick, Rocket, Star, Store, TrendingUp } from "lucide-react";
import JSZip from "jszip";
import { createClient } from "@/lib/supabase-browser";

// Display condensada para titulares, cronómetros y watermark — es lo que
// acerca la página al lenguaje tipográfico del board de referencia (el título
// del sistema anterior usaba la fuente del sistema y no se parecía en nada).
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-cyber" });

type EligibleProduct = { id: string | number; name: string; category?: string; stock?: number; image?: string };
type JourneyStep = { key: "seleccion" | "fotos" | "vivo"; label: string; window: string; state: "hecho" | "actual" | "bloqueado"; end: string };
type ChecklistKey = "pasoFotos" | "pasoCatalogo" | "nombre" | "categoria" | "fotoDropi";
type EligibleEntry = {
  supplier_name: string;
  products: EligibleProduct[];
  selectedProductIds?: (string | number)[];
  submitted_at?: string | null;
  selection_updated_at?: string | null;
  readyChecklist?: Partial<Record<ChecklistKey, boolean>>;
  feedback?: { rating: number; comment?: string; submitted_at: string };
  journey: JourneyStep[];
};

const MAX_PRODUCTS = 10;
// Orden real del journey de la fase "Prepara": descargar fotos (1) desbloquea
// subir al catálogo (2). El paso 3 (Dropi) no se puede bloquear técnicamente
// — es una plataforma externa — así que solo se comunica el orden con copy.
const CHECKLIST_KEYS: ChecklistKey[] = ["pasoFotos", "pasoCatalogo", "fotoDropi", "nombre", "categoria"];

// Link real del Catálogo de difusión (Canva), recibido de Michelle el 28/07.
const CANVA_LINK = "https://www.canva.com/design/DAHQC3nBq6c/qvqDaPIhyfMXBdvY2LBAdA/edit";
// Link de prueba (28/07): el catálogo de Dropi filtrado por la categoría
// real "Cyber Days" resuelve la parte "funcional" de compartir — el
// dropshipper lo abre y ya ve solo los productos de la campaña, listos
// para agregar a su tienda — a diferencia de CANVA_LINK arriba, que es el
// activo visual (imagen) para difundir en redes/WhatsApp. La categoría
// "Cyber Days" todavía no existe en Dropi, así que se usa "Navidad" como
// placeholder solo para probar el patrón de URL; cuando exista la
// categoría real, cambiar únicamente el valor de category=.
const DROPI_CATALOG_LINK = "https://app.dropi.co/dashboard/search?search_type=simple&category=Navidad";
// Evento de Luma para el Meet del 7 de agosto — cuando Michelle pase el
// link, la card del Meet se vuelve clickeable con "Agéndate →".
const LUMA_LINK = "";

const STEPPER_LABELS: Record<JourneyStep["key"], string> = {
  seleccion: "Elige", fotos: "Prepara", vivo: "En vivo",
};

// Título grande de la fase que se está viendo (va fuera de la tarjeta, bajo
// el stepper) y la etiqueta de su fecha límite. Indexados por posición de fase.
const PHASE_VIEW_TITLES = ["Elige tus productos", "Prepara tus productos", "Cyber Days en vivo"];
// Fecha exacta, no cuenta regresiva en horas — más fácil de planear que "20d 02h".
const PHASE_DEADLINE_LABELS = ["La selección cierra el", "Tenlo listo antes del", "Cyber Days termina el"];
// Vista previa de QA (solo dev): ?vista=<fase> fuerza el estado de las fases
// para revisar cada pantalla sin mover las fechas reales de route.ts.
const PREVIEW_ORDER: Record<string, number> = { seleccion: 0, fotos: 1, vivo: 2, cierre: 3 };
const PREVIEW_TABS: { key: string; label: string }[] = [
  { key: "seleccion", label: "1 Selección" },
  { key: "fotos", label: "2 Prepara" }, { key: "vivo", label: "3 En vivo" }, { key: "cierre", label: "4 Cierre" },
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

// ─── Fotos pre-enmarcadas (paso 1 de "Prepara") ───
// El marco (marcoo2.png, 1254x1254 — versión final entregada 30/07,
// reemplaza a marcocyber.png) tiene una ventana transparente para la foto
// del producto. MARCO_WINDOW es el bounding box real de esa transparencia,
// medido sobre el PNG con el canal alfa — no es un valor a ojo. Si Michelle
// regenera el marco, hay que volver a medirlo (no asumir que sigue en el
// mismo lugar).
const MARCO_SRC = "/cyberdays/assets/marcoo2.png";
const MARCO_WINDOW = { x: 87, y: 173, w: 1179 - 87, h: 1179 - 173 };

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    img.src = src;
  });
}

function slugify(s: string) {
  return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-+|-+$)/g, "") || "producto";
}

// Dibuja la foto del producto dentro de la ventana del marco (cover-fit,
// recorta lo que sobre) y el marco encima — sus bordes redondeados tapan las
// esquinas cuadradas de la foto sin necesitar clip/mask aparte. Devuelve
// null si la foto del producto no existe (137 productos sin foto reclamable,
// no es un error del marco).
async function frameProductPhoto(marco: HTMLImageElement, photoSrc: string): Promise<Blob | null> {
  let photo: HTMLImageElement;
  try {
    photo = await loadImage(photoSrc);
  } catch {
    return null;
  }
  const canvas = document.createElement("canvas");
  canvas.width = marco.naturalWidth;
  canvas.height = marco.naturalHeight;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const { x, y, w, h } = MARCO_WINDOW;
  const scale = Math.max(w / photo.naturalWidth, h / photo.naturalHeight);
  const dw = photo.naturalWidth * scale;
  const dh = photo.naturalHeight * scale;
  ctx.drawImage(photo, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
  ctx.drawImage(marco, 0, 0);
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b), "image/png"));
}

// Arma el ZIP con las fotos ya enmarcadas de la selección del proveedor y
// dispara la descarga — un solo clic, sin depender de una herramienta
// externa. Devuelve qué productos se saltaron (sin foto) para avisarlo.
async function downloadFramedPhotosZip(products: EligibleProduct[], supplierName: string) {
  const marco = await loadImage(MARCO_SRC);
  const zip = new JSZip();
  const skipped: string[] = [];
  for (const p of products) {
    const photoSrc = p.image || `/cyberdays/productos/${p.id}.webp`;
    const blob = await frameProductPhoto(marco, photoSrc);
    if (!blob) { skipped.push(p.name); continue; }
    zip.file(`${p.id}-${slugify(p.name)}.png`, blob);
  }
  if (Object.keys(zip.files).length === 0) return { skipped, downloaded: false };
  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  const a = document.createElement("a");
  a.href = url;
  a.download = `fotos-cyber-days-${slugify(supplierName)}.zip`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { skipped, downloaded: true };
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
  /* Halftone del board — grilla de puntos sutil sobre el hero */
  .cd-dots { position: absolute; inset: 0; pointer-events: none; background-image: radial-gradient(rgba(255,255,255,.6) 1px, transparent 1px); background-size: 22px 22px; opacity: .045; }

  /* ─── Grainient del hero ───
     Reemplaza la foto de fondo por un degradado abstracto con rayas
     verticales + grano (referencia que Michelle aprobó el 22/07, tipo
     "Grainient"/"Fahrenheit"): resuelve que un video generado con IA salía
     como macro de carbón literal o como HUD genérico de videojuego. Es
     100% CSS/SVG — cero peso de archivo, cero dependencia de un asset
     externo, misma paleta ya aprobada del resto de la página.
     isolation:isolate es necesario para que mix-blend-mode de las rayas y
     el grano compongan contra el glow de abajo y no contra el body. */
  .cd-grainient { position: absolute; inset: 0; overflow: hidden; isolation: isolate; background: var(--cd-bg); }
  .cd-grainient-glow { position: absolute; inset: -10%; background: radial-gradient(60% 55% at 50% 42%, rgba(255,138,43,.65), rgba(255,61,26,.4) 48%, rgba(12,7,5,0) 78%); }
  /* Video reinstalado 22/07: opacity reducida + blend para que se lea como
     una capa más de textura, no un video crudo pegado encima del grainient. */
  .cd-grainient-video {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; opacity: .55; mix-blend-mode: soft-light;
  }
  /* Rayas: patrón de 16px que se repite — el translateX del drift usa el
     mismo múltiplo para que el loop no se note. */
  .cd-grainient-ribs {
    position: absolute; top: -10%; bottom: -10%; left: -25%; width: 150%;
    background-image: repeating-linear-gradient(90deg,
      rgba(255,255,255,.09) 0px, rgba(255,255,255,.09) 1px,
      transparent 3px, transparent 8px,
      rgba(0,0,0,.14) 8px, rgba(0,0,0,.14) 9px,
      transparent 11px, transparent 16px);
    mix-blend-mode: overlay;
    opacity: .85;
  }
  /* Sin drift continuo (revertido 22/07): un patrón de rayas moviéndose sin
     parar de borde a borde es justo el tipo de estímulo de campo completo
     que marea — Michelle lo reportó al probarlo. Las rayas quedan fijas;
     el único movimiento de fondo que queda es el scan, que pausa largo
     entre pasadas. */
  /* Grano vía feTurbulence — textura táctil, no decoración vistosa */
  .cd-grainient-grain {
    position: absolute; inset: 0; opacity: .16; mix-blend-mode: overlay; pointer-events: none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
  }
  /* Barrido de escaneo: la señal "tech" que le pidió Michelle (22/07) al
     grainient — una línea de luz que cruza el hero y hace una pausa larga
     antes de repetir, no un loop constante que se sienta ansioso. Solo
     transform/opacity animan; el box-shadow queda fijo en cada frame. */
  .cd-grainient-scan {
    position: absolute; left: -10%; right: -10%; top: 0; height: 2px; opacity: 0;
    background: linear-gradient(90deg, transparent, rgba(255,200,150,.9) 45%, rgba(255,246,236,.95) 50%, rgba(255,200,150,.9) 55%, transparent);
    box-shadow: 0 0 12px 2px rgba(255,138,43,.55), 0 0 28px 6px rgba(255,61,26,.25);
  }
  .cd-anim .cd-grainient-scan { animation: cd-scan 7s cubic-bezier(0.65, 0, 0.35, 1) infinite; }
  /* translateY en vh, no %: el % de un elemento de 2px de alto se resuelve
     contra SU PROPIA caja (2px), no contra el contenedor — vh sí cruza
     toda la altura del hero, y el overflow:hidden del padre recorta el
     sobrante cuando el hero es compacto (46vh) en vez de completo. */
  @keyframes cd-scan {
    0% { transform: translateY(-10px); opacity: 0; }
    4% { opacity: .9; }
    46% { opacity: .9; }
    50%, 100% { transform: translateY(100vh); opacity: 0; }
  }
  /* Viñeta oscura arriba/abajo para que el texto siga legible sin foto que
     oscurecer (reemplaza a cd-hero-scrim). */
  .cd-grainient::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(12,7,5,.75), rgba(12,7,5,.15) 30%, rgba(12,7,5,.2) 68%, rgba(12,7,5,.85)); }

  /* ─── Personaje del hero (capa aparte del grainient) ───
     PNG recortado con transparencia (pendiente de que Michelle lo genere,
     22/07) sobre el fondo abstracto — dos capas con velocidad de scroll
     distinta para dar sensación de profundidad, no solo textura. Si el
     archivo todavía no existe, HeroCharacter no renderiza nada (onError). */
  /* Más grande y más cerca del borde (22/07, pedido de Michelle): el
     scale(1.18) simulaba un encuadre más cerrado, pero con transform-origin
     abajo eso empuja la imagen hacia arriba y el overflow:hidden del hero
     le cortaba la cabeza (visto en captura real 22/07). Fix: contenedor a
     todo el alto del hero + object-fit:cover con object-position:top — el
     "zoom" ahora recorta por abajo (piernas/torso), la cabeza siempre queda
     completa arriba. */
  .cd-hero-character { position: absolute; right: -4%; top: 0; bottom: 0; width: 40%; display: flex; align-items: flex-end; pointer-events: none; z-index: 1; }
  /* Encuadre codo-arriba (22/07, Michelle pidió más cerca): scale adicional
     con transform-origin arriba mantiene la cabeza pegada al top y recorta
     el resto del cuerpo por abajo — el overflow:hidden de .cd-hero-media
     (ancestro) es lo que oculta el sobrante. */
  .cd-hero-character img { height: 100%; width: 100%; display: block; object-fit: cover; object-position: top center; transform: scale(1.85); transform-origin: top center; }
  @media (max-width: 859px) { .cd-hero-character { right: -10%; width: 58%; } }
  /* Respiración idle sutil — el personaje no debe sentirse una foto muerta */
  .cd-anim .cd-hero-character { animation: cd-character-float 6s ease-in-out infinite; }
  @keyframes cd-character-float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

  .cd-hero-inner { position: relative; z-index: 2; width: 100%; display: flex; flex-direction: column; padding-top: 24px; padding-bottom: 36px; }
  /* Tope al espaciador (22/07): sin max-height el contenido quedaba pegado
     al borde inferior en pantallas anchas/bajas, con un vacío enorme en el
     centro — Michelle lo señaló al verlo en desktop. */
  .cd-hero-spacer { flex: 1; min-height: 24px; max-height: 14vh; }
  .cd-hero-copy { max-width: 34rem; }

  .cd-topbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
  /* Botón, no div: clic vuelve al contexto de campaña desde cualquier paso.
     Logo y chip del proveedor agrandados (22/07) — se sentían secundarios
     frente al resto del hero. */
  .cd-topbar-brand { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; color: var(--cd-accent); background: none; border: none; padding: 0; font-family: inherit; cursor: pointer; }
  .cd-topbar-logo { height: 32px; width: auto; display: block; }
  .cd-topbar-supplier { display: flex; align-items: center; gap: 9px; background: rgba(26,16,10,.85); border: 1px solid var(--cd-card-border); border-radius: 999px; padding: 6px 14px 6px 6px; font-size: 14px; font-weight: 700; color: var(--cd-ink); max-width: 60vw; }
  .cd-topbar-avatar { width: 30px; height: 30px; border-radius: 50%; background: linear-gradient(135deg, var(--cd-accent), var(--cd-accent-2)); display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 900; color: #1a0d05; flex-shrink: 0; }
  .cd-topbar-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* Fechas de campaña grandes — antes eran un eyebrow de 13px, casi
     invisible para el dato más importante de la página (cuándo es todo). */
  .cd-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--cd-display); font-weight: 400; font-size: clamp(19px, 3.4vw, 26px); letter-spacing: .01em; text-transform: uppercase; color: var(--cd-accent); margin-bottom: 12px; text-shadow: 0 0 16px rgba(255,138,43,.4); }
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
  /* Titular de dos tonos (referencia de layout 22/07): "Cyber Days" siempre
     en acento con subrayado, el resto de la frase en blanco, cada parte en
     su propia línea — igual que la referencia "SOBRE / CYBER DAYS". */
  .cd-title-line { display: block; }
  .cd-title-accent { display: inline-block; color: var(--cd-accent); }

  .cd-stat-sentence { font-size: clamp(16px, 4vw, 19px); font-weight: 600; color: var(--cd-ink); line-height: 1.55; max-width: 46ch; margin: 0 0 22px; }
  .cd-stat-sentence b { color: var(--cd-accent); font-weight: 900; font-variant-numeric: tabular-nums; }

  .cd-btn {
    display: inline-flex; align-items: center; justify-content: center; gap: 8px;
    padding: 13px 22px; border-radius: 10px; border: none; cursor: pointer;
    font-size: 14.5px; font-weight: 800; font-family: inherit; text-decoration: none;
    background: linear-gradient(135deg, var(--cd-accent), var(--cd-accent-2)); color: #fff;
    box-shadow: 0 6px 20px -6px rgba(255,90,30,.5);
    transition: transform .12s var(--cd-ease-out);
  }
  .cd-btn:active:not(:disabled) { transform: scale(.97); }
  @media (hover: hover) and (pointer: fine) { .cd-btn:hover:not(:disabled) { transform: translateY(-1px); } }
  .cd-btn:disabled { background: var(--cd-card); color: var(--cd-muted-2); box-shadow: none; cursor: default; border: 1px solid var(--cd-card-border); }
  .cd-btn--block { width: 100%; margin-top: 4px; }
  /* Flash de éxito: reacción propia del botón antes de saltar al recibo,
     para que el clic se sienta causante de algo (no solo un cambio mudo). */
  .cd-btn.is-success { background: linear-gradient(135deg, var(--cd-done), #22c55e); color: #06281a; box-shadow: 0 6px 20px -6px rgba(52,211,153,.5); }
  .cd-anim .cd-btn.is-success { animation: cd-success-pulse .45s ease-out; }
  @keyframes cd-success-pulse { 0% { transform: scale(1); } 45% { transform: scale(1.04); } 100% { transform: scale(1); } }

  /* Chips de beneficio (mockup 0) — una fila compacta, no tarjetas grandes */
  .cd-chips { display: grid; grid-template-columns: 1fr; gap: 10px; margin-top: 26px; }
  @media (min-width: 640px) { .cd-chips { grid-template-columns: repeat(3, 1fr); } }
  /* Glassmorphismo propio (22/07, pedido de Michelle) — más transparente que
     el resto de tarjetas de la página, para que el personaje/grainient del
     hero se note detrás. inset highlight sutil arriba, como vidrio real. */
  .cd-chipcard {
    display: flex; align-items: center; gap: 10px;
    background: rgba(40, 22, 12, .38);
    border: 1px solid rgba(255,255,255,.14);
    border-radius: 14px; padding: 11px 14px;
    backdrop-filter: blur(18px) saturate(160%);
    -webkit-backdrop-filter: blur(18px) saturate(160%);
    box-shadow: inset 0 1px 0 rgba(255,255,255,.09);
  }
  /* Badge de ícono en vez de emoji (22/07) — los emoji sueltos se sentían
     genéricos/"IA", un ícono de línea fina dentro de una placa lee más
     técnico y consistente con el resto del sistema (cd-toolcard-icon).
     Circular (no squircle) desde la referencia de layout que trajo Michelle. */
  .cd-chipcard-icon { width: 30px; height: 30px; border-radius: 50%; background: rgba(255,138,43,.14); display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: var(--cd-accent); }
  .cd-chipcard-title { font-size: 12.5px; font-weight: 800; color: var(--cd-ink); }
  .cd-chipcard-sub { font-size: 11px; color: var(--cd-muted); line-height: 1.35; margin-top: 1px; }

  /* Banner del Meet — franja fija bajo el topbar, visible en cualquier paso
     (antes vivía solo en la fase Elige, escondida, y nadie la relacionaba
     con "dónde reviso la reunión"). Ancho completo, no card suelta. */
  .cd-meet {
    display: flex; align-items: center; gap: 10px; margin: 16px 0 4px;
    border: 1px solid rgba(255,138,43,.35); border-radius: 12px; padding: 10px 16px;
    background: rgba(60,32,14,.55);
  }
  .cd-anim .cd-meet { animation: cd-pulse 2.6s ease-in-out 1s infinite; }
  a.cd-meet { text-decoration: none; color: inherit; }
  .cd-meet-icon { font-size: 16px; flex-shrink: 0; }
  .cd-meet-body { flex: 1; min-width: 0; }
  .cd-meet-label { font-size: 10.5px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--cd-muted-2); }
  .cd-meet-time { font-size: 13.5px; font-weight: 700; color: var(--cd-ink); }
  .cd-meet-cta { flex-shrink: 0; font-size: 12.5px; font-weight: 800; color: var(--cd-accent); white-space: nowrap; }


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
  /* Título grande de la fase + fecha límite, fuera de la tarjeta */
  .cd-phase-hero { text-align: center; margin: 34px 0 0; }
  .cd-phase-hero-title { font-family: var(--cd-display); font-weight: 400; font-size: clamp(34px, 7.5vw, 66px); text-transform: uppercase; line-height: 1; color: #fff6ec; text-shadow: 0 0 10px rgba(255,138,43,.5), 0 0 28px rgba(255,61,26,.35); margin: 0; }
  .cd-phase-hero-sub { font-size: clamp(13.5px, 3vw, 15.5px); font-weight: 600; color: var(--cd-muted); margin: 10px auto 0; max-width: 44ch; line-height: 1.5; }
  .cd-phase-hero .cd-deadline { margin-top: 16px; }
  /* Señal de "en vivo" explícita — antes solo el título en texto lo decía,
     sin nada gráfico que se reconozca de un vistazo (patrón de streaming:
     punto verde pulsando + texto). Verde a propósito, no ámbar: es la única
     señal de "activo ahora mismo" en toda la página y necesita distinguirse
     del resto del sistema de color. */
  .cd-live-badge {
    display: inline-flex; align-items: center; gap: 7px; margin-bottom: 14px;
    background: rgba(52,211,153,.12); border: 1px solid rgba(52,211,153,.4); border-radius: 999px;
    padding: 6px 14px 6px 10px; font-size: 12px; font-weight: 800; letter-spacing: .08em; color: var(--cd-done);
  }
  .cd-live-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--cd-done); flex-shrink: 0; box-shadow: 0 0 0 0 rgba(52,211,153,.6); }
  .cd-anim .cd-live-dot { animation: cd-live-dot-pulse 1.8s ease-out infinite; }
  @keyframes cd-live-dot-pulse { 0% { box-shadow: 0 0 0 0 rgba(52,211,153,.6); } 70% { box-shadow: 0 0 0 8px rgba(52,211,153,0); } 100% { box-shadow: 0 0 0 0 rgba(52,211,153,0); } }
  @keyframes cd-pulse-dot { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,138,43,.4); } 50% { box-shadow: 0 0 0 6px rgba(255,138,43,0); } }

  /* ─── Fecha límite exacta (reemplaza el cronómetro D/H/M) ─── */
  .cd-deadline { display: inline-flex; flex-direction: column; align-items: center; gap: 4px; margin-top: 14px; background: rgba(60,32,14,.55); backdrop-filter: blur(14px) saturate(140%); -webkit-backdrop-filter: blur(14px) saturate(140%); border: 1px solid rgba(255,138,43,.3); border-radius: 12px; padding: 10px 22px; }
  .cd-deadline-label { font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; color: var(--cd-muted-2); }
  .cd-deadline-date { font-family: var(--cd-display); font-weight: 400; font-size: clamp(20px, 4vw, 26px); color: var(--cd-accent); line-height: 1.1; }


  /* ─── Fases sin card envolvente: el contenido respira sobre el fondo de la
     página. La señal de estado (en curso / completado / próximamente) la da
     un pill chico arriba de cada fase, no un borde de tarjeta. ─── */
  .cd-phase { position: relative; margin-top: 26px; scroll-margin-top: 20px; }
  .cd-phase.is-locked { opacity: .65; }
  .cd-phase-status { display: inline-flex; align-items: center; font-size: 10.5px; font-weight: 800; letter-spacing: .05em; text-transform: uppercase; border-radius: 999px; padding: 4px 12px; margin-bottom: 14px; }
  .cd-phase-body { margin-top: 0; }
  .cd-back-current { display: inline-flex; margin-top: 16px; background: none; border: none; padding: 4px 0; font-family: inherit; font-size: 12.5px; font-weight: 700; color: var(--cd-accent); cursor: pointer; }

  /* Fondo cinemático de toda la pantalla del journey (assets de Michelle) —
     fijo detrás de todo el contenido, cambia según la fase. Visible en toda
     la página (no solo arriba): opacidad alta + un tinte parejo, no un
     degradado que lo apague hacia abajo. Los bloques de contenido (cards,
     inputs) ya tienen su propio fondo opaco encima. */
  .cd-page-backdrop { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
  /* Capa media del set de parallax de fase (23/07, fase Elige/Prepara):
     PNG transparente con elementos flotantes — encima de la base, blend
     screen para que las líneas/fragmentos se sumen a la luz en vez de
     taparla. Falta la capa 3 (partículas cercanas, Michelle la regenera
     porque salió sin transparencia real) — cuando llegue se agrega igual. */
  .cd-page-backdrop-base { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .65; transform: scale(1.06); }
  .cd-page-backdrop-mid { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .85; mix-blend-mode: screen; transform: scale(1.1); }
  .cd-page-backdrop-top { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; opacity: .7; mix-blend-mode: screen; transform: scale(1.05); }
  /* Deriva continua e independiente del scroll — cada capa a distinta
     velocidad/duración para dar sensación de profundidad (más cerca de
     cámara = se mueve más). */
  .cd-anim .cd-page-backdrop-base { animation: cd-backdrop-drift-base 24s ease-in-out infinite; }
  .cd-anim .cd-page-backdrop-mid { animation: cd-backdrop-drift-mid 16s ease-in-out infinite; }
  .cd-anim .cd-page-backdrop-top { animation: cd-backdrop-drift-top 11s ease-in-out infinite; }
  @keyframes cd-backdrop-drift-base { 0%, 100% { transform: scale(1.06) translateY(0); } 50% { transform: scale(1.1) translateY(-10px); } }
  @keyframes cd-backdrop-drift-mid { 0%, 100% { transform: scale(1.1) translateY(0); } 50% { transform: scale(1.16) translateY(-22px); } }
  @keyframes cd-backdrop-drift-top { 0%, 100% { transform: scale(1.05) translateY(0); } 50% { transform: scale(1.13) translateY(-32px); } }
  .cd-page-backdrop::after { content: ""; position: absolute; inset: 0; background: rgba(8,5,3,.55); }

  /* Glassmorphismo sutil: con el fondo cinemático detrás, las tarjetas
     planas (casi transparentes) se leían mal — blur + un poco más de
     opacidad, sin perder el look "vidrio" (siguen dejando pasar el fondo). */
  .cd-toolcard, .cd-catcard, .cd-step, .cd-readiness, .cd-phase-note,
  .cd-pcard, .cd-topbar-supplier, .cd-meet, .cd-fact, .cd-receipt-edit {
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
  }
  .cd-phase-sub { font-size: 12.5px; color: var(--cd-muted); margin: 0 0 8px; }
  /* "Elige máximo 10 productos" — antes iba diluido a media frase, ahora es
     su propia línea con peso, para que nadie postule más de la cuenta. */
  .cd-phase-max { font-size: 14px; font-weight: 700; color: var(--cd-ink); background: rgba(255,138,43,.08); border: 1px solid rgba(255,138,43,.3); border-radius: 10px; padding: 9px 14px; margin: 0 0 14px; display: inline-block; }
  .cd-phase-max b { color: var(--cd-accent); font-weight: 900; }
  .cd-phase-note { font-size: 12.5px; color: var(--cd-muted); background: rgba(20,12,8,.55); border: 1px solid var(--cd-card-border); border-radius: 10px; padding: 11px 14px; display: flex; align-items: center; gap: 4px; }
  .cd-waiting-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: var(--cd-accent); margin-right: 7px; flex-shrink: 0; }
  .cd-anim .cd-waiting-dot { animation: cd-pulse-dot 1.4s ease-in-out infinite; }
  .cd-fact { margin-top: 12px; font-size: 12.5px; color: var(--cd-ink); background: rgba(60,32,14,.55); border: 1px solid rgba(255,138,43,.3); border-radius: 10px; padding: 11px 14px; line-height: 1.5; }
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
    background: rgba(20,12,8,.5); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 10px;
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

  .cd-readiness { background: rgba(20,12,8,.55); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 12px; }
  .cd-readiness-title { font-size: 13px; font-weight: 800; color: var(--cd-ink); }
  .cd-readiness-count { font-size: 13px; color: var(--cd-muted); }
  .cd-readiness-count b { font-family: var(--cd-display); font-weight: 400; font-size: 24px; color: var(--cd-accent); margin-right: 5px; }
  .cd-readiness-warn { font-size: 10.5px; color: var(--cd-muted-2); line-height: 1.45; border-top: 1px solid var(--cd-card-border); padding-top: 10px; }

  /* ─── Recibo (mockup 2: check hexagonal + stats + fecha) ─── */
  .cd-hex-wrap { filter: drop-shadow(0 0 18px rgba(255,138,43,.45)); width: 64px; margin-bottom: 14px; }
  /* Celebración al postular: entrada suave sin rebote (ease-out-expo) —
     solo al enviar, no en cada visita al recibo. Antes tenía overshoot con
     cubic-bezier elástico; se quitó por pedido de Michelle (22/07), para
     que combine con el tono más quieto del grainient. */
  .cd-anim .cd-hex-wrap.is-pop { animation: cd-hex-pop .5s cubic-bezier(0.19, 1, 0.22, 1) both; }
  @keyframes cd-hex-pop { 0% { transform: scale(.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  /* Franja de edición: la selección sigue abierta hasta la fecha límite */
  .cd-receipt-edit { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; background: rgba(60,32,14,.55); border: 1px solid rgba(255,138,43,.3); border-radius: 10px; padding: 11px 14px; margin-bottom: 14px; }
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

  /* ─── Checklist de preparación (barra "X de N completados") ─── */
  .cd-prep-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin: 16px 0 8px; }
  .cd-checklist-title { font-size: 13px; font-weight: 800; color: var(--cd-ink); }
  .cd-checklist-count { font-size: 12px; font-weight: 800; color: var(--cd-accent); }
  .cd-prep-head-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .cd-progress { height: 5px; background: rgba(255,255,255,.07); border-radius: 4px; overflow: hidden; }
  .cd-progress > span { display: block; height: 100%; border-radius: 4px; background: linear-gradient(90deg, var(--cd-accent), var(--cd-accent-2)); transform-origin: left; transform: scaleX(var(--p, 0)); transition: transform .4s var(--cd-ease-out); }
  .cd-check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 13px; color: var(--cd-ink); line-height: 1.4; cursor: pointer; position: relative; }
  .cd-check-item input { position: absolute; opacity: 0; width: 0; height: 0; }
  .cd-check-box { width: 18px; height: 18px; border-radius: 5px; border: 1.5px solid var(--cd-card-border); flex-shrink: 0; margin-top: 1px; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: var(--cd-bg); transition: background .15s ease, border-color .15s ease, transform .15s var(--cd-ease-out); }
  .cd-check-box.is-done { background: var(--cd-done); border-color: var(--cd-done); transform: scale(1.08); }

  /* Fase 3 como pasos en el orden real del journey: marco → Dropi → Canva */
  .cd-steps { display: flex; flex-direction: column; gap: 12px; margin-top: 14px; }
  .cd-step { display: flex; gap: 12px; background: rgba(20,12,8,.55); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 14px 16px; }
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
  .cd-catcard { background: rgba(20,12,8,.55); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 16px 18px; }
  .cd-catcard-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
  .cd-catcard-title { font-size: 14px; font-weight: 800; color: var(--cd-ink); }
  .cd-catcard-tag { font-size: 11.5px; color: var(--cd-muted); margin-top: 2px; }
  .cd-catcard-chip { flex-shrink: 0; font-size: 10.5px; font-weight: 800; letter-spacing: .04em; text-transform: uppercase; color: var(--cd-accent); background: rgba(255,138,43,.12); border: 1px solid rgba(255,138,43,.35); border-radius: 999px; padding: 4px 10px; white-space: nowrap; }
  .cd-catcard-sub { font-size: 12px; color: var(--cd-muted); line-height: 1.5; margin: 8px 0 0; }
  .cd-catcard-warn { font-size: 12px; color: var(--cd-ink); background: rgba(255,138,43,.07); border: 1px solid rgba(255,138,43,.3); border-radius: 10px; padding: 10px 12px; line-height: 1.5; margin-top: 10px; }
  .cd-catcard-warn b { color: var(--cd-accent); }

  .cd-toolcard {
    display: flex; align-items: center; justify-content: space-between; gap: 14px;
    background: rgba(20,12,8,.55); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 16px 18px; margin-top: 10px;
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

  /* Link al manual de instrucciones — vive junto al título de "Prepara"
     (no dentro de un paso puntual) porque cubre los 3 pasos, no solo el
     marco. Variante "is-primary" para que se lea como CTA, igual peso
     visual que los botones principales del resto de la página. */
  .cd-manual-link {
    display: inline-flex; align-items: center; gap: 6px;
    font-size: 12.5px; font-weight: 700; padding: 7px 12px; border-radius: 8px; text-decoration: none;
    background: rgba(255,138,43,.08); color: var(--cd-accent); border: 1px dashed rgba(255,138,43,.4);
  }
  .cd-manual-link.is-primary {
    background: linear-gradient(135deg, var(--cd-accent), var(--cd-accent-2)); color: #fff; border: none;
    font-weight: 800; box-shadow: 0 4px 14px -4px rgba(255,90,30,.5);
  }

  /* Dos cards de "Comparte" en En vivo (28/07) — reemplazan el toolcard
     único de una fila: en columna, título+CTA no caben lado a lado en la
     mitad del ancho, así que cada card apila ícono/texto arriba y las
     acciones abajo, con el botón ocupando el ancho completo de la card. */
  .cd-share-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 14px; }
  @media (max-width: 640px) { .cd-share-grid { grid-template-columns: 1fr; } }
  .cd-share-card {
    display: flex; flex-direction: column; gap: 14px;
    background: rgba(20,12,8,.55); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 18px;
  }
  .cd-share-card-head { display: flex; align-items: flex-start; gap: 12px; }
  .cd-share-card-actions { display: flex; flex-direction: column; gap: 8px; margin-top: auto; }
  .cd-share-card-actions .cd-toolcard-cta { text-align: center; }

  /* ─── En vivo / cierre ─── */
  /* La copa ahora es el "hero" visual de este paso, no un icono de línea de
     texto: flota igual que el personaje del hero (mismo lenguaje de motion
     en toda la página), y la foto enmarcada real del proveedor cuelga de
     ella como prueba tangible de "así se ve tu catálogo" — la pantalla se
     sentía vacía con solo texto plano. */
  /* Copa a la izquierda, texto al lado (24/07): en vertical, con la copa
     chica arriba y el texto centrado debajo, la pantalla de cierre se leía
     como un aviso perdido en medio de tanto negro. La copa grande y anclada
     a un lado le da peso de "logro" y deja el texto acompañándola, no
     debajo de ella. */
  .cd-celebrate { display: flex; align-items: center; gap: clamp(24px, 4vw, 48px); text-align: left; padding: 4px 0; }
  .cd-celebrate-trophy-wrap { position: relative; flex-shrink: 0; width: clamp(180px, 20vw, 340px); height: clamp(180px, 20vw, 340px); display: flex; align-items: center; justify-content: center; }
  .cd-celebrate-trophy { width: 100%; height: 100%; object-fit: contain; filter: drop-shadow(0 0 34px rgba(255,138,43,.5)); }
  .cd-celebrate-preview { position: absolute; right: 6%; bottom: 4%; width: clamp(64px, 8vw, 130px); height: clamp(64px, 8vw, 130px); object-fit: contain; transform: rotate(8deg); filter: drop-shadow(0 12px 18px rgba(0,0,0,.5)); }
  /* La pantalla de cierre repetía "gracias por participar" en el título Y en
     este texto (28/07) — se quitó la frase suelta y este espacio ahora es
     donde vive "qué hacer después" (antes flotaba abajo como líneas sueltas
     sin relación visual con la copa). */
  .cd-celebrate-body { flex: 1; max-width: 460px; }
  /* Cada nota es un renglón con ícono, separadas por una línea fina en vez de
     flotar como dos párrafos sueltos sin relación entre sí. */
  .cd-note-item { display: flex; align-items: flex-start; gap: 14px; padding-bottom: 16px; margin-bottom: 16px; border-bottom: 1px solid var(--cd-card-border); }
  .cd-note-item:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
  .cd-note-icon { width: 34px; height: 34px; border-radius: 50%; border: 1.5px solid rgba(255,138,43,.4); background: rgba(255,138,43,.08); display: flex; align-items: center; justify-content: center; color: var(--cd-accent); flex-shrink: 0; }
  .cd-note-text { font-size: 13px; color: var(--cd-muted); line-height: 1.55; margin: 5px 0 0; }
  .cd-note-text b { color: var(--cd-ink); font-weight: 700; }
  @media (max-width: 640px) { .cd-celebrate { flex-direction: column; text-align: center; gap: 10px; } .cd-celebrate-body { max-width: 400px; } .cd-note-item { flex-direction: column; align-items: center; text-align: center; gap: 8px; } }
  /* Signature moment de "En vivo" (clímax narrativo del journey): la copa
     entra con rebote y queda flotando con un pulso de brillo continuo —
     antes era un emoji 🎉 estático, sin peso para el momento más importante
     del recorrido. */
  .cd-anim .cd-celebrate-trophy--live { animation: cd-trophy-pop .6s cubic-bezier(0.19, 1, 0.22, 1) both, cd-trophy-float 5.5s ease-in-out .6s infinite, cd-trophy-glow 2.4s ease-in-out .6s infinite; }
  .cd-anim .cd-celebrate-preview { animation: cd-preview-float 6.5s ease-in-out .3s infinite; }
  @keyframes cd-trophy-pop { 0% { transform: scale(.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  @keyframes cd-trophy-float { 0%, 100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-16px) rotate(2deg); } }
  @keyframes cd-trophy-glow { 0%, 100% { filter: drop-shadow(0 0 22px rgba(255,138,43,.5)); } 50% { filter: drop-shadow(0 0 36px rgba(255,138,43,.85)); } }
  @keyframes cd-preview-float { 0%, 100% { transform: translateY(0) rotate(8deg); } 50% { transform: translateY(-10px) rotate(4deg); } }

  /* "Ayúdanos a mejorar" (28/07): feedback de cierre, mismo lenguaje visual
     que .cd-toolcard (panel oscuro translúcido + borde) para que se lea como
     parte del mismo sistema y no como un formulario pegado aparte. */
  .cd-feedback { background: rgba(20,12,8,.55); border: 1px solid var(--cd-card-border); border-radius: 12px; padding: 20px 22px; margin-top: 20px; }
  .cd-feedback-title { font-size: 14.5px; font-weight: 800; color: var(--cd-ink); }
  .cd-feedback-sub { font-size: 12.5px; color: var(--cd-muted); margin: 3px 0 14px; }
  .cd-feedback-stars { display: flex; gap: 6px; margin-bottom: 14px; }
  .cd-star { background: none; border: none; padding: 2px; cursor: pointer; color: var(--cd-muted-2); transition: transform .12s var(--cd-ease-out), color .15s ease; }
  .cd-star:active { transform: scale(.9); }
  .cd-star.is-active { color: var(--cd-accent); }
  @media (hover: hover) and (pointer: fine) { .cd-star:hover { color: var(--cd-accent); } }
  .cd-feedback-input {
    width: 100%; resize: vertical; min-height: 64px; background: rgba(0,0,0,.25);
    border: 1px solid var(--cd-card-border); border-radius: 9px; padding: 10px 12px;
    font-family: inherit; font-size: 13px; color: var(--cd-ink); line-height: 1.5; margin-bottom: 14px;
  }
  .cd-feedback-input::placeholder { color: var(--cd-muted-2); }
  .cd-feedback-input:focus { outline: none; border-color: var(--cd-accent); }
  .cd-feedback-thanks { display: flex; align-items: center; gap: 10px; font-size: 13.5px; font-weight: 600; color: var(--cd-ink); }
  .cd-feedback-thanks-check { width: 24px; height: 24px; border-radius: 50%; background: rgba(52,211,153,.16); color: var(--cd-done); display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: 900; flex-shrink: 0; }


  .cd-footnote { font-size: 12.5px; color: var(--cd-muted-2); margin-top: 16px; }

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
    .cd-anim .cd-title, .cd-anim .cd-meet, .cd-anim .cd-hex-wrap.is-pop,
    .cd-anim .cd-stepper-circle.is-actual, .cd-anim .cd-waiting-dot,
    .cd-anim .cd-celebrate-trophy--live, .cd-anim .cd-celebrate-preview, .cd-anim .cd-grainient-ribs,
    .cd-anim .cd-grainient-scan, .cd-anim .cd-hero-character,
    .cd-anim .cd-page-backdrop-base, .cd-anim .cd-page-backdrop-mid, .cd-anim .cd-page-backdrop-top,
    .cd-anim .cd-live-dot { animation: none; }
    .cd-grainient-video { display: none; }
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

// Titular de dos tonos (referencia de layout 22/07): parte la frase
// alrededor de "Cyber Days" y la muestra en su propia línea con acento +
// subrayado, el resto en blanco. Reutiliza ScrambleText por segmento para
// no perder la animación de revelado.
function TwoToneTitle({ text, anim }: { text: string; anim: boolean }) {
  const idx = text.indexOf("Cyber Days");
  if (idx === -1) return <ScrambleText text={text} anim={anim} />;
  const before = text.slice(0, idx).trim();
  const after = text.slice(idx + "Cyber Days".length).trim();
  return (
    <>
      {before && <span className="cd-title-line"><ScrambleText text={before} anim={anim} /></span>}
      <span className="cd-title-line cd-title-accent">
        <ScrambleText text="Cyber Days" anim={anim} />
      </span>
      {after && <span className="cd-title-line"><ScrambleText text={after} anim={anim} /></span>}
    </>
  );
}

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

// Fondo abstracto del hero (rayas + glow + grano) — reemplaza la foto
// hero-cyberdays.png en los dos lugares donde se usaba (intro de reentrada y
// hero de primera visita). Sin <img>: nada que cargar ni que generar.
// Video reinstalado (22/07): el drift continuo de las rayas quedó apagado
// (esa era la fuente principal de mareo), el video se conserva porque
// Michelle lo pidió explícitamente — pendiente de regenerar con un
// movimiento más lento (ver prompt en la respuesta del chat). onError lo
// oculta sin romper nada si el archivo aún no existe o falla al cargar.
function HeroGrainient() {
  const [videoFailed, setVideoFailed] = useState(false);
  return (
    <div className="cd-grainient">
      <div className="cd-grainient-glow" />
      {!videoFailed && (
        <video
          className="cd-grainient-video"
          src="/cyberdays/assets/video-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          onError={() => setVideoFailed(true)}
        />
      )}
      <div className="cd-grainient-ribs" />
      <div className="cd-grainient-grain" />
      <div className="cd-grainient-scan" />
    </div>
  );
}

// Personaje recortado (PNG transparente) sobre el grainient — capa aparte
// para poder darle su propio parallax. Si el archivo aún no existe
// (pendiente de que Michelle lo genere), onError la oculta sin romper nada.
function HeroCharacter() {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <div className="cd-hero-character">
      <img src="/cyberdays/assets/personaje-hero.png" alt="" onError={() => setFailed(true)} />
    </div>
  );
}

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
    tl.fromTo(el.querySelector(".cd-grainient"), { scale: 1.12 }, { scale: 1, duration: 2.3, ease: "power2.out" }, 0)
      .fromTo(el.querySelector(".cd-intro-eyebrow"), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.15)
      .fromTo(el.querySelector(".cd-intro-title"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.3)
      .to(el, { autoAlpha: 0, scale: 1.02, duration: 0.7, ease: "power2.inOut" }, 1.65);
    return () => { tl.kill(); };
  }, []);
  return (
    <div ref={ref} className="cd-intro" aria-hidden>
      <HeroGrainient />
      <div className="cd-intro-scrim" />
      <div className="cd-intro-copy">
        <div className="cd-intro-eyebrow">Del 18 al 31 de agosto</div>
        <div className="cd-intro-title">Cyber Days</div>
      </div>
    </div>
  );
});

// Fecha exacta de cierre de una fase, no cuenta regresiva — a Kate y a los
// proveedores les es más fácil planear con "Cierra el 31 de julio" que con
// "20d 02h 42min", que además obliga a volver a la página para saber cuánto
// queda de verdad.
function formatExactDate(endISO: string) {
  const raw = new Date(`${endISO}T00:00:00`).toLocaleDateString("es-CO", { weekday: "long", day: "numeric", month: "long" });
  // toLocaleDateString ya da minúsculas correctas ("lunes, 10 de agosto") —
  // solo la primera letra se sube, para no capitalizar "de" con CSS.
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}

function PhaseDeadline({ label, endISO }: { label: string; endISO?: string }) {
  if (!endISO) return null;
  const today = new Date().toISOString().slice(0, 10);
  if (today > endISO) return null;
  return (
    <div className="cd-deadline">
      <span className="cd-deadline-label">{label}</span>
      <span className="cd-deadline-date">{formatExactDate(endISO)}</span>
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
  const [framing, setFraming] = useState(false);
  const [framingNote, setFramingNote] = useState("");
  // Flash de éxito en el botón antes de saltar al recibo — sin esto, el
  // cambio de vista era instantáneo y el clic se sentía como si no hiciera
  // nada (Michelle lo probó y no vio ninguna reacción).
  const [justSubmitted, setJustSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [checklist, setChecklist] = useState<Partial<Record<ChecklistKey, boolean>>>({});
  // Dos links distintos en "En vivo" (28/07: catálogo Dropi filtrado +
  // catálogo PDF de difusión) necesitan feedback de "copiado" independiente
  // uno de otro, no un solo booleano compartido.
  const [copiedKey, setCopiedKey] = useState<"dropi" | "canva" | null>(null);
  // Feedback de cierre ("ayúdanos a mejorar"): rating 1-5 + comentario
  // opcional. `fbSent` refleja tanto lo que ya venía guardado (entry.feedback)
  // como lo que se acaba de enviar en esta sesión.
  const [fbRating, setFbRating] = useState(0);
  const [fbComment, setFbComment] = useState("");
  const [fbSubmitting, setFbSubmitting] = useState(false);
  const [fbError, setFbError] = useState("");
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
  // El QA solo debe funcionar para el equipo, nunca para un proveedor real.
  // En dev siempre está disponible; en producción se habilita solo si hay
  // una sesión activa del hub (equipo logueado) — un proveedor real no tiene
  // esa sesión, así que agregar ?vista= a su URL no le hace nada.
  const [isInternalUser, setIsInternalUser] = useState(false);
  useEffect(() => {
    if (IS_DEV) return;
    createClient().auth.getUser().then(({ data }) => {
      if (data.user) setIsInternalUser(true);
    });
  }, []);
  const canPreview = IS_DEV || isInternalUser;
  const [rawVista] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const v = new URLSearchParams(window.location.search).get("vista");
    return v && PREVIEW_ORDER[v] !== undefined ? v : null;
  });
  const vista = canPreview ? rawVista : null;

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

  // Sin paso de curaduría: el journey lo manda el calendario que ya calcula
  // route.ts (nada de gate manual por `approved_at` — el equipo puede seguir
  // revisando por dentro, pero ya no es lo que abre "Prepara" para el
  // proveedor). Si nunca postuló, se lo avisamos en cada fase en vez de
  // fingir que tiene algo en curso.
  const journey = useMemo<JourneyStep[]>(() => {
    const base = entry?.journey ?? [];
    if (base.length === 0) return base;
    if (vista) {
      const idx = PREVIEW_ORDER[vista];
      return base.map((s, i) => ({ ...s, state: i < idx ? "hecho" : i === idx ? "actual" : "bloqueado" }));
    }
    return base;
  }, [entry?.journey, vista]);
  const submitted = !!entry?.submitted_at;
  const seleccionStep = journey.find((j) => j.key === "seleccion");
  const vivoStep = journey.find((j) => j.key === "vivo");
  const canSelect = seleccionStep?.state === "actual";
  const selectionWindowClosed = seleccionStep?.state === "hecho";
  // De los 3 pasos de "Prepara", solo el 3 (actualizar en Dropi) hay que
  // esperar a que abra por calendario: es el único que ensucia el catálogo
  // real antes de que arranque la campaña. Los pasos 1 y 2 (fotos, catálogo
  // de difusión) no tocan Dropi, así que se habilitan en cuanto el vendedor
  // postula su selección, sin esperar a que cierre la ventana de "Elige".
  const fotosOpen = submitted;
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
  // Sin curaduría de por medio, "seleccion" y "fotos" son contiguas por
  // calendario, así que por fecha el paso actual seguiría siendo "Elige"
  // aunque ya haya postulado. Pero como "Prepara" tiene pasos 1 y 2 usables
  // en cuanto postula (fotosOpen ya no depende del calendario), si le
  // quedan pasos pendientes ahí y Cyber Days todavía no arranca, el
  // aterrizaje por defecto debe ser "Prepara" — no dejarlo viendo el recibo
  // de "Elige" cuando ya tiene algo pendiente por hacer.
  const autoIdx = useMemo(() => {
    if (journey.length === 0) return 0;
    const activeIdx = journey.findIndex((j) => j.state === "actual");
    const calendarIdx = activeIdx === -1 ? (journey.every((j) => j.state === "hecho") ? journey.length - 1 : 0) : activeIdx;
    const vivoStarted = journey.find((j) => j.key === "vivo")?.state !== "bloqueado";
    const prepPending = CHECKLIST_KEYS.some((k) => !checklist[k]);
    if (calendarIdx === 0 && submitted && prepPending && !vivoStarted) return 1;
    return calendarIdx;
  }, [journey, submitted, checklist]);
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
  // "Volver al contexto": el logo/marca del topbar reabre esta misma pantalla
  // de campaña (fechas, beneficios) desde cualquier paso, sin perder en cuál
  // iba — al cerrar vuelve exactamente a su fase actual, nada se resetea.
  const [contextOpen, setContextOpen] = useState(false);
  const showHero = (heroFull && !entered) || contextOpen;

  function handleEnter() {
    const el = heroRef.current;
    const done = () => {
      if (contextOpen) setContextOpen(false);
      else setEntered(true);
      window.scrollTo(0, 0);
    };
    if (!anim || !el) { done(); return; }
    gsap.to(el, { autoAlpha: 0, scale: 1.03, duration: 0.55, ease: "power2.in", onComplete: done });
  }
  // El Meet del 7 de agosto deja de mostrarse cuando ya pasó, y solo aplica
  // en el paso 1 (Elige) — no tiene sentido seguir empujándolo una vez el
  // proveedor ya avanzó de fase (23/07, antes se veía en cualquier paso).
  const meetVisible = expandedIdx === 0 && Date.now() <= new Date("2026-08-07T23:59:59").getTime();

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
      // Parallax: el grainient del hero se expande suavemente y se desplaza
      // más lento que el scroll (antes era la foto; incluida cuando se
      // reemplazó por el grainient el 22/07). Solo si el hero está montado.
      if (document.querySelector(".cd-hero-media .cd-grainient")) {
        gsap.to(".cd-hero-media .cd-grainient", {
          scale: 1.14,
          yPercent: 10,
          ease: "none",
          scrollTrigger: { trigger: ".cd-hero", start: "top top", end: "bottom top", scrub: true },
        });
      }
      // El personaje se mueve MENOS que el grainient al hacer scroll — esa
      // diferencia de velocidad es lo que lee como profundidad (capa cercana
      // vs. capa lejana), no la textura por sí sola.
      if (document.querySelector(".cd-hero-character")) {
        gsap.to(".cd-hero-character", {
          yPercent: 3,
          ease: "none",
          scrollTrigger: { trigger: ".cd-hero", start: "top top", end: "bottom top", scrub: true },
        });
      }
      // El parallax de fondo ya NO depende del scroll (antes usaba
      // ScrollTrigger contra `.cd-body`) — en pasos cortos como "En vivo"
      // casi no hay scroll, así que el efecto no se llegaba a ver. Ahora es
      // una deriva continua por CSS (misma familia que cd-character-float /
      // cd-grainient-ribs), visible siempre sin importar cuánto contenido
      // tenga la fase. Ver clases .cd-page-backdrop-base/-mid/-top.
    });
    return () => ctx.revert();
  }, [anim, entry, expandedIdx, entered]);

  const eligibleCount = entry?.products.length ?? 0;
  const totalStock = useMemo(() => (entry?.products ?? []).reduce((sum, p) => sum + (p.stock ?? 0), 0), [entry?.products]);
  const viewedStep = journey[expandedIdx];
  // En vivo con jerarquía real: la celebración es el titular grande y el dato
  // informativo baja a subtítulo — antes competían con el mismo tamaño.
  const viewTitle =
    expandedIdx === 2
      ? vivoStep?.state === "hecho"
        ? "¡Gracias por participar!"
        : vivoStep?.state === "actual"
          ? "¡Tu campaña está en vivo!"
          : PHASE_VIEW_TITLES[2]
      : PHASE_VIEW_TITLES[expandedIdx];
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
  // El dato de cuántos productos están en vivo vivía repetido en 3 textos
  // distintos de esta pantalla (subtítulo, párrafo bajo la escena, y el
  // toolcard) — se deja una sola vez aquí, en el subtítulo, que es lo
  // primero que se lee después del título.
  const viewSubtitle = expandedIdx === 2 && vivoStep?.state === "actual"
    ? `Tus ${selectedProducts.length} producto${selectedProducts.length === 1 ? "" : "s"} ya están en el catálogo que ven los dropshippers.`
    : expandedIdx === 2 && vivoStep?.state === "hecho"
      ? `Participaste con ${selectedProducts.length} producto${selectedProducts.length === 1 ? "" : "s"} en la primera Cyber Days.`
      : null;
  // La fecha límite de la fase vive junto al título grande, no dentro de la
  // tarjeta. Solo cuando la fase que se ve está en curso — y en selección,
  // solo si aún no postuló (sellado, el plazo ya no le aplica).
  const viewedDeadline = viewedStep?.state === "actual" && !(expandedIdx === 0 && isSealed);
  const initials = (entry?.supplier_name || "?").trim().split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join("") || "?";

  // Fondo cinemático de toda la pantalla del journey (assets de Michelle):
  // general para Elige/Prepara, live mientras la campaña corre, cierre una
  // vez termina — cambia con la fase que se está viendo, no con el paso real
  // del proveedor, para que la vista previa de QA también lo muestre.
  // Set de fondos por fase (22/07): f1 = Elige/Prepara, f2 = En vivo,
  // f3 = Cierre. Cada uno con su propia capa base opaca + capas de
  // transparencia real verificada por alfa (ver bitácora del proyecto).
  const journeyBackdrop = useMemo(() => {
    if (expandedIdx === 2) {
      return vivoStep?.state === "hecho" ? "/cyberdays/assets/f3.png" : "/cyberdays/assets/f2.png";
    }
    return "/cyberdays/assets/f1.png";
  }, [expandedIdx, vivoStep?.state]);

  const journeyBackdropMid = useMemo(() => {
    if (expandedIdx === 2) {
      return vivoStep?.state === "hecho" ? "/cyberdays/assets/f3-c1.png" : "/cyberdays/assets/f2-c1.png";
    }
    return "/cyberdays/assets/f1-c1.png";
  }, [expandedIdx, vivoStep?.state]);

  // Capa 3 (partículas cercanas): solo Cierre la tiene completa por ahora
  // (f3-c2.png) — las de Elige/Prepara y En vivo (f1-c2, f2c-2) salieron sin
  // transparencia real o con contenido equivocado, pendientes de regenerar.
  const journeyBackdropTop = expandedIdx === 2 && vivoStep?.state === "hecho" ? "/cyberdays/assets/f3-c2.png" : null;

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
      // Flash "¡Listo! ✓" en verde antes de saltar de vista, para que el
      // clic tenga una reacción visible propia — no solo el cambio de vista.
      setSubmitting(false);
      setJustSubmitted(true);
      await new Promise((r) => setTimeout(r, 550));
      setEntry((prev) => (prev ? { ...prev, selectedProductIds: data.selectedProductIds, submitted_at: data.submitted_at, selection_updated_at: data.selection_updated_at } : prev));
      setEditing(false);
      setCelebrate(true);
      setJustSubmitted(false);
      // Con "Prepara" ya usable en cuanto postula (pasos 1 y 2 no dependen
      // del cierre de la selección), tiene sentido llevarlo directo ahí en
      // vez de dejarlo en el recibo de "Elige" — el recibo sigue disponible
      // desde el stepper cuando quiera volver a verlo.
      setOpenPhase(1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownloadFramed() {
    if (selectedProducts.length === 0) return;
    setFraming(true);
    setFramingNote("");
    try {
      const { skipped, downloaded } = await downloadFramedPhotosZip(selectedProducts, entry?.supplier_name ?? "proveedor");
      if (!downloaded) setFramingNote("No pudimos armar tus fotos — ninguno de tus productos tiene foto todavía. Escríbenos si crees que es un error.");
      else if (skipped.length > 0) setFramingNote(`Listo. ${skipped.length} producto${skipped.length === 1 ? "" : "s"} sin foto no se incluyó${skipped.length === 1 ? "" : "n"} en el ZIP.`);
    } catch {
      setFramingNote("No pudimos preparar tus fotos. Intenta de nuevo o escríbenos si el problema sigue.");
    } finally {
      setFraming(false);
    }
  }

  // Preview enmarcada de un producto real (paso "En vivo") — la pantalla se
  // veía vacía con solo la copa y texto, esto le da algo concreto que mostrar:
  // "así se ve tu catálogo". Reutiliza el mismo canvas de frameProductPhoto,
  // decorativa: si falla (sin fotos), simplemente no aparece.
  const [catalogPreview, setCatalogPreview] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    let url: string | null = null;
    async function run() {
      const withPhoto = selectedProducts.find((p) => p.image) ?? selectedProducts[0];
      if (!withPhoto) return;
      try {
        const marco = await loadImage(MARCO_SRC);
        const photoSrc = withPhoto.image || `/cyberdays/productos/${withPhoto.id}.webp`;
        const blob = await frameProductPhoto(marco, photoSrc);
        if (!blob || cancelled) return;
        url = URL.createObjectURL(blob);
        setCatalogPreview(url);
      } catch {
        // decorativo, sin fallback visible
      }
    }
    run();
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [selectedProducts]);

  // Volver a la grilla con la selección enviada precargada. Solo disponible
  // mientras la ventana de selección siga abierta (después de que cierra,
  // cambios por WhatsApp).
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

  async function submitFeedback() {
    if (fbRating === 0) { setFbError("Elige una calificación"); return; }
    setFbSubmitting(true);
    setFbError("");
    if (vista) {
      // en vista previa no se persiste — es solo QA visual
      await new Promise((r) => setTimeout(r, 300));
      setEntry((prev) => (prev ? { ...prev, feedback: { rating: fbRating, comment: fbComment || undefined, submitted_at: new Date().toISOString() } } : prev));
      setFbSubmitting(false);
      return;
    }
    try {
      const res = await fetch(`/api/campaigns-planeacion/${id}/elegibles/${token}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: fbRating, comment: fbComment || undefined }),
      });
      const data = await res.json();
      if (!res.ok) { setFbError(data.error ?? "No se pudo enviar"); return; }
      setEntry((prev) => (prev ? { ...prev, feedback: data.feedback } : prev));
    } catch {
      setFbError("No se pudo enviar, intenta de nuevo");
    } finally {
      setFbSubmitting(false);
    }
  }

  async function copyCatalogLink(link: string, key: "dropi" | "canva") {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey((k) => (k === key ? null : k)), 1600);
    } catch {
      // sin permiso de clipboard: el link sigue disponible en "Abrir"
    }
  }

  // "Compartir catálogo" va directo a WhatsApp con el link ya redactado —
  // antes copiaba al portapapeles y el proveedor tenía que pegar el link él
  // mismo en el chat, un paso de fricción que no aportaba nada.
  function shareCatalogLinkWhatsApp(link: string, message: string) {
    if (!link) return;
    const text = `${message} ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
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

  // Editable mientras la ventana de selección siga abierta. El endpoint
  // valida lo mismo del lado del servidor.
  const canEditSelection = canSelect;

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
      {canPreview && (
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
        <div className="cd-hero-media"><HeroGrainient /><HeroCharacter /></div>
        <div className="cd-dots" />

        <div className="cd-hero-inner cd-rail">
          <div className="cd-topbar" data-reveal>
            <button type="button" className="cd-topbar-brand" onClick={contextOpen ? handleEnter : undefined} style={contextOpen ? { cursor: "default" } : undefined}>
              <img src="/Logo-dropi.svg" alt="Dropi" className="cd-topbar-logo" />
              <span>Cyber Days</span>
            </button>
            <div className="cd-topbar-supplier">
              <span className="cd-topbar-avatar">{initials}</span>
              <span className="cd-topbar-name">{entry.supplier_name}</span>
            </div>
          </div>

          <div className="cd-hero-spacer" />

          <div className="cd-hero-copy">
            <div className="cd-eyebrow" data-reveal>Del 18 al 31 de agosto</div>
            <h1 className="cd-title"><TwoToneTitle text="Los Cyber Days te eligieron" anim={anim} /></h1>
            <p className="cd-stat-sentence" data-reveal data-delay="0.08">
              Puedes seleccionar <b><CountUp value={eligibleCount} anim={anim} /></b> producto{eligibleCount === 1 ? "" : "s"} para Cyber Days, con hasta{" "}
              <b><CountUp value={totalStock} anim={anim} /></b> venta{totalStock === 1 ? "" : "s"} por ganar.
            </p>
            <button type="button" className="cd-btn" data-reveal data-delay="0.16" onClick={handleEnter}>
              {contextOpen ? "Continuar con mi progreso →" : "Quiero participar →"}
            </button>
          </div>

          {/* Beneficios reescritos (22/07): visibilidad en los dos catálogos
              reales (Dropi + difusión), el motivo real de negocio (mover
              stock quieto) y la facilidad de participar — "nosotros hacemos
              el trabajo" no decía nada concreto. Íconos de línea (lucide) en
              vez de emoji, más técnico y consistente con el resto del sistema. */}
          <div className="cd-chips">
            <div className="cd-chipcard" data-reveal data-delay="0.2">
              <span className="cd-chipcard-icon"><Layers size={16} strokeWidth={2} /></span>
              <div>
                <div className="cd-chipcard-title">Doble catálogo</div>
                <div className="cd-chipcard-sub">Tus productos aparecen en el catálogo de Dropi y en el catálogo de difusión de la campaña.</div>
              </div>
            </div>
            <div className="cd-chipcard" data-reveal data-delay="0.26">
              <span className="cd-chipcard-icon"><TrendingUp size={16} strokeWidth={2} /></span>
              <div>
                <div className="cd-chipcard-title">Dale salida a lo que no se mueve</div>
                <div className="cd-chipcard-sub">Cyber Days es la vitrina perfecta para el stock que llevas tiempo sin vender.</div>
              </div>
            </div>
            <div className="cd-chipcard" data-reveal data-delay="0.32">
              <span className="cd-chipcard-icon"><MousePointerClick size={16} strokeWidth={2} /></span>
              <div>
                <div className="cd-chipcard-title">Elige y nosotros hacemos el resto</div>
                <div className="cd-chipcard-sub">Solo escoges tus productos; la promoción durante la campaña corre por nuestra cuenta.</div>
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
        <div className="cd-page-backdrop" aria-hidden>
          <img key={journeyBackdrop} src={journeyBackdrop} alt="" className="cd-page-backdrop-base" />
          {journeyBackdropMid && <img key={journeyBackdropMid} src={journeyBackdropMid} alt="" className="cd-page-backdrop-mid" />}
          {journeyBackdropTop && <img key={journeyBackdropTop} src={journeyBackdropTop} alt="" className="cd-page-backdrop-top" />}
        </div>
        <div className="cd-rail cd-wrap">
          <div className="cd-topbar" data-reveal style={{ paddingTop: 16 }}>
            <button type="button" className="cd-topbar-brand" onClick={() => setContextOpen(true)}>
              <img src="/Logo-dropi.svg" alt="Dropi" className="cd-topbar-logo" />
              <span>Cyber Days</span>
            </button>
            <div className="cd-topbar-supplier">
              <span className="cd-topbar-avatar">{initials}</span>
              <span className="cd-topbar-name">{entry.supplier_name}</span>
            </div>
          </div>

          {/* Banner fijo, visible en cualquier paso — antes vivía solo en la
              fase Elige y nadie sabía dónde volver a encontrarlo. */}
          {meetVisible && (LUMA_LINK ? (
            <a className="cd-meet" href={LUMA_LINK} target="_blank" rel="noopener noreferrer" data-reveal>
              <span className="cd-meet-icon">🎥</span>
              <div className="cd-meet-body">
                <div className="cd-meet-label">Reunión informativa de Cyber Days</div>
                <div className="cd-meet-time">Viernes 7 de agosto · 2:00pm</div>
              </div>
              <span className="cd-meet-cta">Agéndate →</span>
            </a>
          ) : (
            <div className="cd-meet" data-reveal>
              <span className="cd-meet-icon">🎥</span>
              <div className="cd-meet-body">
                <div className="cd-meet-label">Reunión informativa de Cyber Days</div>
                <div className="cd-meet-time">Viernes 7 de agosto · 2:00pm</div>
              </div>
            </div>
          ))}

          <div className="cd-stepper" data-reveal>
            {journey.map((step, i) => {
              // El punto resaltado del stepper tiene que coincidir con lo que
              // se está viendo (expandedIdx), no solo con el estado por
              // calendario — si no, un paso puede estar abierto y usable
              // (ej. "Prepara" en cuanto postula) mientras el stepper sigue
              // marcando "Elige" como el actual, y el usuario no sabe dónde
              // está parado. "Hecho" real siempre se respeta (el check no
              // desaparece solo por estar mirando otro paso).
              const displayState = step.state === "hecho" ? "hecho" : i === expandedIdx ? "actual" : step.state;
              const v = stepVisual(displayState);
              return (
                <button key={step.key} type="button" className="cd-stepper-node" onClick={() => { setOpenPhase(i); setCelebrate(false); }}>
                  {i > 0 && <div className="cd-stepper-line" style={{ background: stepVisual(journey[i - 1].state).line }} />}
                  <div className={`cd-stepper-circle${displayState === "actual" ? " is-actual" : ""}`} style={{ ["--dot" as string]: v.dot, ["--fill" as string]: v.fill, color: displayState === "bloqueado" ? "var(--cd-muted-2)" : "#1a0d05" }}>
                    {step.state === "hecho" ? "✓" : i + 1}
                  </div>
                  <div className="cd-stepper-label" style={{ color: v.label }}>{STEPPER_LABELS[step.key]}</div>
                  {displayState === "actual" && <div className="cd-stepper-sub">Ahora</div>}
                </button>
              );
            })}
          </div>
          <div className="cd-phase-hero" data-reveal>
            {expandedIdx === 2 && vivoStep?.state === "actual" && (
              <span className="cd-live-badge"><span className="cd-live-dot" />EN VIVO</span>
            )}
            <h2 className="cd-phase-hero-title">{viewTitle}</h2>
            {viewSubtitle && <p className="cd-phase-hero-sub">{viewSubtitle}</p>}
            {viewedDeadline && <PhaseDeadline label={PHASE_DEADLINE_LABELS[expandedIdx]} endISO={viewedStep?.end} />}
          </div>

          {/* Solo se renderiza la fase seleccionada — el stepper es la
              navegación. Nada de tarjetas colapsadas apiladas: en cada paso
              se ve únicamente lo de ese paso. Sin card envolvente: el pill de
              estado (arriba) es la señal visual, no un borde. */}

          {/* Fase 1 — Selección */}
          {expandedIdx === 0 && (
          <div id="fase-1" className="cd-phase" data-reveal>
              <div className="cd-phase-body">{isSealed ? (
                <>
                  <div className={`cd-hex-wrap${celebrate ? " is-pop" : ""}`} data-reveal><div className="cd-hex">✓</div></div>
                  <div className="cd-receipt-head">¡Ya estás participando!</div>
                  {submittedDate && (
                    <div className="cd-receipt-date">
                      Enviada el {submittedDate}{updatedStamp && <> · actualizada el {updatedStamp}</>} · {receiptStatusText}
                    </div>
                  )}
                  {canEditSelection && (
                    <div className="cd-receipt-edit">
                      <span>Puedes ajustar tu selección hasta el <b>14 de agosto</b>.</span>
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
                  {(() => { const v = stepVisual(seleccionStep?.state ?? "actual"); return <span className="cd-phase-status" style={{ background: v.pillBg, color: v.pillColor }}>{v.pillText}</span>; })()}
                  <p className="cd-phase-sub">Estos cumplen hoy el criterio de la campaña (500+ unidades de stock disponible).</p>
                  <p className="cd-phase-max"><Layers size={13} strokeWidth={2.5} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />Elige <b>máximo {MAX_PRODUCTS} productos</b> para participar.</p>

                  {editing && (
                    <div className="cd-phase-note" style={{ marginBottom: 14 }}>Tu selección sigue enviada. Al guardar, la reemplazamos con esta.</div>
                  )}

                  {!canSelect && !selectionWindowClosed && (
                    <div className="cd-phase-note" style={{ marginBottom: 14 }}><Lock size={13} strokeWidth={2.5} style={{ display: "inline", verticalAlign: -2, marginRight: 5 }} />Podrás seleccionar a partir del {seleccionStep?.window.split("–")[0].trim()}. Por ahora puedes revisar tu lista.</div>
                  )}
                  {selectionWindowClosed && (
                    <div className="cd-phase-note" style={{ marginBottom: 14 }}>La selección ya cerró y no alcanzaste a enviar la tuya. Escríbenos si crees que es un error.</div>
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
                        <div className="cd-readiness-count"><b>{selected.size}</b>de {MAX_PRODUCTS} productos máx.</div>
                        <button className={`cd-btn cd-btn--block${justSubmitted ? " is-success" : ""}`} onClick={handleSubmit} disabled={submitting || justSubmitted || selected.size === 0}>
                          {submitting ? "Enviando..." : justSubmitted ? "Listo" : editing ? "Guardar cambios" : "Participar"}
                        </button>
                        {editing && (
                          <button type="button" className="cd-back-current" style={{ margin: "0 auto" }} onClick={() => { setEditing(false); setOpenPhase(0); }}>
                            Cancelar y volver al recibo
                          </button>
                        )}
                        {submitError && <p style={{ color: "var(--cd-accent-2)", fontSize: 12, margin: 0 }}>{submitError}</p>}
                        <div className="cd-readiness-warn">Podrás ajustar tu selección desde esta misma página hasta el 14 de agosto.</div>
                      </div>
                    )}
                  </div>

                  <p className="cd-footnote">{entry.products.length} producto{entry.products.length === 1 ? "" : "s"} elegible{entry.products.length === 1 ? "" : "s"} en total.</p>
                </>
              )}</div>
          </div>
          )}

          {/* Fase 2 — Prepara tus productos */}
          {expandedIdx === 1 && (
          <div id="fase-2" className={`cd-phase${!submitted ? " is-locked" : ""}`} data-reveal>
              <div className="cd-phase-body">
                  {(() => { const v = stepVisual(submitted ? "actual" : "bloqueado"); return <span className="cd-phase-status" style={{ background: v.pillBg, color: v.pillColor }}>{submitted ? "En curso" : "Pendiente"}</span>; })()}
                  {!submitted && (
                    <div className="cd-phase-note">No tienes productos postulados para esta campaña. Escríbenos por el mismo canal donde recibiste este link si crees que es un error.</div>
                  )}

                  {fotosOpen && (
                    <>
                      <div className="cd-prep-head">
                        <span className="cd-checklist-title">Antes de que empiece Cyber Days — sigue el orden de los 3 pasos</span>
                        <div className="cd-prep-head-right">
                          <span className="cd-checklist-count">{doneCount} de {CHECKLIST_KEYS.length}</span>
                          <a className="cd-manual-link is-primary" href="https://www.canva.com/design/DAHQC6nXyDs/zyKj0Q83RihZV7DPQDhiBg/edit" target="_blank" rel="noopener noreferrer">
                            <BookOpen size={13} strokeWidth={2.5} />
                            Ver manual de instrucciones
                          </a>
                        </div>
                      </div>
                      <div className="cd-progress"><span style={{ ["--p" as string]: doneCount / CHECKLIST_KEYS.length }} /></div>

                      {/* Paso 1: descargar fotos — desbloquea el paso 2 (Catálogo de difusión). */}
                      <div className="cd-steps">
                        <div className="cd-step">
                          <div className="cd-step-num">1</div>
                          <div className="cd-step-body">
                            <div className="cd-step-title">Descarga tus fotos con el marco</div>
                            <div className="cd-step-sub">Cada producto con el marco oficial de Cyber Days. Las vas a usar en los dos pasos siguientes.</div>
                            <div className="cd-step-checks">
                              <label className="cd-check-item">
                                <input type="checkbox" checked={!!checklist.pasoFotos} onChange={() => toggleChecklist("pasoFotos")} />
                                <span className={`cd-check-box${checklist.pasoFotos ? " is-done" : ""}`}>{checklist.pasoFotos ? "✓" : ""}</span>
                                <span>Ya descargué mis fotos con el marco</span>
                              </label>
                            </div>
                            <div className="cd-step-actions">
                              <button type="button" className="cd-toolcard-cta" onClick={handleDownloadFramed} disabled={framing || selectedProducts.length === 0}>
                                {framing ? "Preparando tus fotos…" : "Descargar mis fotos con el marco →"}
                              </button>
                            </div>
                            {framingNote && <div className="cd-phase-note" style={{ marginTop: 8 }}>{framingNote}</div>}
                          </div>
                        </div>

                        {/* Paso 2: Catálogo de difusión (antes "Vitrina Cyber Days", antes de
                            eso "catálogo PDF") — bloqueado hasta que el paso 1 esté marcado,
                            así el proveedor no llega sin fotos. */}
                        <div className="cd-step">
                          <div className="cd-step-num">2</div>
                          <div className="cd-step-body">
                            <div className="cd-step-title">Súbelos a tu Catálogo de difusión</div>
                            <div className="cd-step-sub">El catálogo que reciben los dropshippers por WhatsApp: foto con marco, precio con descuento y nombre. Fecha límite <b style={{ color: "var(--cd-accent)" }}>17 de agosto</b> — lo que no esté montado ese día no sale.</div>
                            <div className="cd-step-checks">
                              <label className="cd-check-item">
                                <input type="checkbox" checked={!!checklist.pasoCatalogo} onChange={() => toggleChecklist("pasoCatalogo")} />
                                <span className={`cd-check-box${checklist.pasoCatalogo ? " is-done" : ""}`}>{checklist.pasoCatalogo ? "✓" : ""}</span>
                                <span>Ya monté mis productos en el Catálogo de difusión</span>
                              </label>
                            </div>
                            <div className="cd-step-actions">
                              {!checklist.pasoFotos ? (
                                <span className="cd-toolcard-cta is-pending"><Lock size={12} strokeWidth={2.5} style={{ display: "inline", verticalAlign: -1, marginRight: 4 }} />Descarga tus fotos primero (paso 1)</span>
                              ) : CANVA_LINK ? (
                                <a className="cd-toolcard-cta" href={CANVA_LINK} target="_blank" rel="noopener noreferrer">Abrir Catálogo de difusión →</a>
                              ) : (
                                <span className="cd-toolcard-cta is-pending">Link pendiente</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Paso 3: Dropi — no se puede bloquear técnicamente (plataforma
                            externa), así que el orden se comunica con copy + fecha. */}
                        <div className="cd-step">
                          <div className="cd-step-num">3</div>
                          <div className="cd-step-body">
                            <div className="cd-step-title">Actualiza tus productos en Dropi</div>
                            <div className="cd-step-sub">Hazlo <b style={{ color: "var(--cd-ink)" }}>después del paso 2</b>, el <b style={{ color: "var(--cd-accent)" }}>17 de agosto</b>. Antes no — tus productos se verían vestidos de una campaña que todavía no empieza.</div>
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
                      </div>
                    </>
                  )}
              </div>
          </div>
          )}

          {/* Fase 3 — En vivo / cierre */}
          {expandedIdx === 2 && (
          <div id="fase-3" className="cd-phase" data-reveal>
              <div className="cd-phase-body">
              {vivoStep?.state === "actual" && (
                <>
                  {/* Dos cards con trabajos distintos (28/07) en vez de un objeto
                      decorativo flotando solo en el vacío (constelación, luego una
                      esfera generada con IA — ninguna funcionó): la de Dropi mueve a
                      la acción real (agregar productos a la tienda), la de PDF mueve
                      a la difusión visual. El espacio se llena con la acción de la
                      pantalla, no con decoración. */}
                  <div className="cd-share-grid" data-reveal>
                    <div className="cd-share-card">
                      <div className="cd-share-card-head">
                        <div className="cd-toolcard-icon"><Store size={16} strokeWidth={2.25} color="var(--cd-accent)" /></div>
                        <div>
                          <div className="cd-toolcard-title">Catálogo en Dropi</div>
                          <div className="cd-toolcard-sub">El dropshipper lo abre y ve solo tus productos de Cyber Days, listos para agregar a su tienda.</div>
                        </div>
                      </div>
                      <div className="cd-share-card-actions">
                        <button className="cd-btn cd-btn--block" onClick={() => shareCatalogLinkWhatsApp(DROPI_CATALOG_LINK, "¡Mira mi catálogo de Cyber Days en Dropi! 🔥")}>Compartir por WhatsApp →</button>
                        <button className="cd-toolcard-cta" onClick={() => copyCatalogLink(DROPI_CATALOG_LINK, "dropi")}>{copiedKey === "dropi" ? "¡Copiado!" : "Copiar link"}</button>
                      </div>
                    </div>
                    <div className="cd-share-card">
                      <div className="cd-share-card-head">
                        <div className="cd-toolcard-icon"><FileImage size={16} strokeWidth={2.25} color="var(--cd-accent)" /></div>
                        <div>
                          <div className="cd-toolcard-title">Catálogo de difusión</div>
                          <div className="cd-toolcard-sub">Imagen lista para publicar en tus redes o estados de WhatsApp.</div>
                        </div>
                      </div>
                      <div className="cd-share-card-actions">
                        {CANVA_LINK ? (
                          <>
                            <button className="cd-btn cd-btn--block" onClick={() => shareCatalogLinkWhatsApp(CANVA_LINK, "¡Mira mi catálogo de Cyber Days en Dropi! 🔥")}>Compartir por WhatsApp →</button>
                            <button className="cd-toolcard-cta" onClick={() => copyCatalogLink(CANVA_LINK, "canva")}>{copiedKey === "canva" ? "¡Copiado!" : "Copiar link"}</button>
                          </>
                        ) : (
                          <span className="cd-toolcard-cta is-pending">Link pendiente</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {vivoStep?.state === "hecho" && (
                <>
                  <div className="cd-celebrate" data-reveal>
                    <div className="cd-celebrate-trophy-wrap">
                      <img src="/cyberdays/assets/copa.png" alt="" className="cd-celebrate-trophy cd-celebrate-trophy--live" />
                      {catalogPreview && <img src={catalogPreview} alt="" className="cd-celebrate-preview" />}
                    </div>
                    <div className="cd-celebrate-body">
                      <div className="cd-note-item">
                        <span className="cd-note-icon"><Rocket size={16} strokeWidth={2} /></span>
                        <p className="cd-note-text"><b>Vuelve a dejar tus productos</b> como estaban: quita &quot;Cyber Days&quot; del nombre, la categoría y la foto con marco.</p>
                      </div>
                      <div className="cd-note-item">
                        <span className="cd-note-icon"><Star size={16} strokeWidth={2} /></span>
                        <p className="cd-note-text">Esta es la primera de varias campañas que vamos a hacer. Te avisamos por WhatsApp cuando arranque la próxima.</p>
                      </div>
                    </div>
                  </div>

                  <div className="cd-feedback" data-reveal data-delay="0.15">
                    {entry?.feedback ? (
                      <div className="cd-feedback-thanks">
                        <span className="cd-feedback-thanks-check">✓</span>
                        Gracias por tu feedback, lo tenemos en cuenta para la próxima campaña.
                      </div>
                    ) : (
                      <>
                        <div className="cd-feedback-title">Ayúdanos a mejorar</div>
                        <p className="cd-feedback-sub">¿Cómo te fue participando en Cyber Days?</p>
                        <div className="cd-feedback-stars">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button key={n} type="button" className={`cd-star${n <= fbRating ? " is-active" : ""}`} onClick={() => setFbRating(n)} aria-label={`${n} de 5`}>
                              <Star size={22} strokeWidth={2} fill={n <= fbRating ? "currentColor" : "none"} />
                            </button>
                          ))}
                        </div>
                        <textarea
                          className="cd-feedback-input"
                          placeholder="Cuéntanos qué podríamos mejorar (opcional)"
                          value={fbComment}
                          onChange={(e) => setFbComment(e.target.value)}
                          maxLength={500}
                          rows={3}
                        />
                        <button type="button" className="cd-btn" onClick={submitFeedback} disabled={fbSubmitting}>
                          {fbSubmitting ? "Enviando..." : "Enviar feedback"}
                        </button>
                        {fbError && <p style={{ color: "var(--cd-accent-2)", fontSize: 12, margin: "8px 0 0" }}>{fbError}</p>}
                      </>
                    )}
                  </div>
                </>
              )}

              {vivoStep?.state === "bloqueado" && (
                <div className="cd-phase-note"><Lock size={13} strokeWidth={2.5} style={{ display: "inline", verticalAlign: -2, marginRight: 5 }} />Del 18 al 31 de agosto tus productos aparecen en el catálogo para dropshippers.</div>
              )}
              </div>
          </div>
          )}

          {openPhase !== null && openPhase !== autoIdx && (
            <div style={{ textAlign: "center" }}>
              <button type="button" className="cd-back-current" onClick={() => setOpenPhase(null)}>← Volver a tu paso actual</button>
            </div>
          )}
        </div>
      </div>
      </>
      )}
    </div>
  );
}
