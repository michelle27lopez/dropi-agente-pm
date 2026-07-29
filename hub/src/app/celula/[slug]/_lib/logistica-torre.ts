// ─────────────────────────────────────────────────────────────────────────────
// Cruce entre las DOS fuentes de logística, para la torre de control de
// /celula/logistica.
//
//   · Supabase (`projects` con celula_owner_id = logística) → los LOG-XXX. Es lo
//     que Darwin sabe: trae el estado_interno editable, el vpv y los permisos.
//   · El tablero (`proyectos/logistica/_lib/data.ts`) → las 16 iniciativas con
//     su etapa de la cadena de valor, tipo, fase, handoff, bloqueo y doc.
//
// La llave es `codigo` (LOG-XXX) ↔ `project_code`, tal como declara data.ts:196.
// Una iniciativa sin `codigo` NO es un error de datos: es una que todavía no está
// registrada en Darwin, y la torre la muestra marcada como tal en vez de
// esconderla. Ese hueco es justamente el hallazgo.
//
// Todo se calcula desde data.ts. No se duplica ni un número aquí.
// ─────────────────────────────────────────────────────────────────────────────

import {
  etapas,
  proyectos,
  weeklies,
  type Etapa,
  type Proyecto as Iniciativa,
} from "@/app/proyectos/logistica/_lib/data";
import type { Proyecto as ProyectoDarwin } from "@/components/ProjectCard";

export type { Etapa, Iniciativa };

// ── Cifras en formato español ────────────────────────────────────────────────
// El tablero guarda las cifras como texto ya formateado ("737.865", "3,86M",
// "82,3%") porque es lo que se lee en el weekly. Para dibujar la sparkline hacen
// falta números, así que se revierte el formato: `.` es separador de miles y `,`
// es el decimal — al revés que en inglés.
export function parseCifra(raw: string): number {
  const limpio = raw.trim().replace("%", "").replace(/\s/g, "");
  const multiplicador = /M$/i.test(limpio) ? 1e6 : /K$/i.test(limpio) ? 1e3 : 1;
  const cuerpo = limpio.replace(/[MK]$/i, "");
  // Si hay coma, es el decimal y los puntos son miles. Si no hay coma, los
  // puntos son miles igual ("737.865" → 737865).
  const normalizado = cuerpo.includes(",")
    ? cuerpo.replace(/\./g, "").replace(",", ".")
    : cuerpo.replace(/\./g, "");
  const n = Number(normalizado);
  return Number.isFinite(n) ? n * multiplicador : 0;
}

// ── Serie mensual (bloque A) ─────────────────────────────────────────────────
export type SerieKpi = {
  metrica: string;
  valores: number[];        // [abril, mayo, junio] ya numéricos
  etiquetas: string[];      // los mismos, como los escribió el weekly
  valorActual: string;      // junio, el último mes cerrado
  delta: string;
  tono: "bueno" | "alerta" | "malo";
};

export type Comparacion = {
  titulo: string;
  alcance: string;
  lectura: string;
  entregaNota: string;
  meses: string[];
  kpis: SerieKpi[];
};

/**
 * La comparación mensual del weekly más reciente que la tenga. Se busca en vez
 * de asumir `weeklies[0]` porque el campo es opcional: las semanas en formato
 * legacy no lo traen y la torre no debe romperse por eso.
 */
export function comparacionMensual(): Comparacion | null {
  const w = weeklies.find((x) => x.comparacionMensual);
  const c = w?.comparacionMensual;
  if (!c) return null;

  return {
    titulo: c.titulo,
    alcance: c.alcance,
    lectura: c.lectura,
    entregaNota: c.entregaNota,
    meses: ["Abril", "Mayo", "Junio"],
    kpis: c.filas.map((f) => ({
      metrica: f.metrica,
      valores: [parseCifra(f.abril), parseCifra(f.mayo), parseCifra(f.junio)],
      etiquetas: [f.abril, f.mayo, f.junio],
      valorActual: f.junio,
      delta: f.delta,
      tono: f.tono,
    })),
  };
}

/**
 * Path SVG de una sparkline en un viewBox de `ancho`×`alto`.
 * Con 3 puntos no tiene sentido suavizar: la línea recta entre meses es la
 * lectura honesta. Si todos los valores son iguales, se dibuja plana al centro.
 */
export function sparklinePath(valores: number[], ancho = 100, alto = 28): string {
  if (valores.length === 0) return "";
  const min = Math.min(...valores);
  const max = Math.max(...valores);
  const rango = max - min;
  const pad = 3;
  const util = alto - pad * 2;

  const puntos = valores.map((v, i) => {
    const x = valores.length === 1 ? ancho / 2 : (i / (valores.length - 1)) * ancho;
    // Sin rango (serie plana) → al centro. Con rango → invertido, porque en SVG
    // el eje Y crece hacia abajo.
    const y = rango === 0 ? alto / 2 : pad + util - ((v - min) / rango) * util;
    return { x, y };
  });

  return puntos.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
}

export function sparklinePuntos(valores: number[], ancho = 100, alto = 28) {
  const d = sparklinePath(valores, ancho, alto);
  if (!d) return [];
  return d.split(" ").map((seg) => {
    const [x, y] = seg.slice(1).split(",").map(Number);
    return { x, y };
  });
}

// ── Iniciativas por etapa (bloques C y E) ────────────────────────────────────
export type FilaIniciativa = {
  iniciativa: Iniciativa;
  /** La fila de Supabase, si la iniciativa está registrada en Darwin. */
  darwin: ProyectoDarwin | null;
};

export type GrupoEtapa = {
  etapa: Etapa;
  filas: FilaIniciativa[];
  total: number;
  enDarwin: number;
};

/**
 * Agrupa las 16 iniciativas del tablero por etapa de la cadena de valor y les
 * pega su fila de Darwin cuando existe.
 *
 * `sinEtapa` recoge los proyectos de Supabase cuyo `project_code` no aparece en
 * el tablero. Hoy está vacío (los 11 LOG-XXX están cruzados), pero si alguien
 * crea un proyecto nuevo desde la UI de Darwin caería ahí en vez de
 * desaparecer de la vista.
 */
export function agruparPorEtapa(deDarwin: ProyectoDarwin[]): {
  grupos: GrupoEtapa[];
  sinEtapa: ProyectoDarwin[];
  total: number;
  totalEnDarwin: number;
} {
  const porCodigo = new Map<string, ProyectoDarwin>();
  for (const p of deDarwin) {
    if (p.project_code) porCodigo.set(p.project_code.toUpperCase(), p);
  }

  const usados = new Set<string>();
  const grupos = etapas.map((etapa) => {
    const filas: FilaIniciativa[] = proyectos
      .filter((p) => p.etapa === etapa.nombre)
      .map((iniciativa) => {
        const codigo = iniciativa.codigo?.toUpperCase();
        const darwin = codigo ? porCodigo.get(codigo) ?? null : null;
        if (darwin && codigo) usados.add(codigo);
        return { iniciativa, darwin };
      });

    return {
      etapa,
      filas,
      total: filas.length,
      enDarwin: filas.filter((f) => f.darwin).length,
    };
  });

  const sinEtapa = deDarwin.filter(
    (p) => !p.project_code || !usados.has(p.project_code.toUpperCase()),
  );

  return {
    grupos,
    sinEtapa,
    total: grupos.reduce((acc, g) => acc + g.total, 0),
    totalEnDarwin: grupos.reduce((acc, g) => acc + g.enDarwin, 0),
  };
}

// ── Estado del portafolio (bloque D) ─────────────────────────────────────────
// Las 9 fases del tipo `FaseIniciativa` son demasiadas para una barra legible,
// así que se agrupan en los 5 tramos reales del ciclo. El color NO es decorativo:
// es una rampa ordinal (nada → explorando → esperando → construyendo) usando los
// mismos cuatro colores de estado del DESIGN.md.
const TRAMOS = [
  { nombre: "Backlog", fases: ["Backlog"], color: "#9CA3AF" },
  { nombre: "Research", fases: ["Research"], color: "#93C5FD" },
  { nombre: "Definición y diseño", fases: ["Discovery", "Definición", "Diseño"], color: "#3B82F6" },
  { nombre: "Listo para handoff", fases: ["Listo para handoff"], color: "#F59E0B" },
  { nombre: "En construcción", fases: ["En desarrollo", "Beta", "Lanzado"], color: "#10B981" },
] as const;

export type TramoPortafolio = {
  nombre: string;
  color: string;
  cantidad: number;
  pct: number;
};

export type ResumenPortafolio = {
  total: number;
  tramos: TramoPortafolio[];
  bloqueadas: Iniciativa[];
  sinRegistrar: Iniciativa[];
  sinDoc: Iniciativa[];
};

/**
 * Los tres contadores accionables usan la misma definición que ya calcula
 * /proyectos/logistica/iniciativas: bloqueada = tiene `bloqueo`; sin registrar =
 * no tiene `codigo` LOG-XXX; sin doc = `doc === "ninguno"`.
 *
 * `etapa` acota el cálculo a una etapa del viaje de la orden. Sin ella se lee
 * todo el portafolio. Es lo que permite que al filtrar en el mapa el bloque
 * responda en vez de quedarse mostrando el total: un portafolio que no cambia
 * al filtrar hace dudar de si el filtro sirvió.
 */
export function resumenPortafolio(etapa?: string | null): ResumenPortafolio {
  const universo = etapa ? proyectos.filter((p) => p.etapa === etapa) : proyectos;
  const total = universo.length;

  const tramos = TRAMOS.map((t) => {
    const cantidad = universo.filter((p) => (t.fases as readonly string[]).includes(p.fase)).length;
    return {
      nombre: t.nombre,
      color: t.color,
      cantidad,
      pct: total === 0 ? 0 : (cantidad / total) * 100,
    };
  }).filter((t) => t.cantidad > 0);

  return {
    total,
    tramos,
    bloqueadas: universo.filter((p) => !!p.bloqueo),
    sinRegistrar: universo.filter((p) => !p.codigo),
    sinDoc: universo.filter((p) => p.doc === "ninguno"),
  };
}

// ── Tono de una etapa (bloque C) ─────────────────────────────────────────────
// `etapas` trae un `color` decorativo por etapa (índigo, cyan, morado…) que
// choca con la "Regla de los Cuatro Estados" del DESIGN.md — y que tablero.css
// ya remapeó a azul en el resto del tablero. Aquí el color codifica SALUD, no
// identidad: lo dicta la fuga de la etapa, no su posición.
export type TonoEtapa = "malo" | "alerta" | "bueno" | "neutro";

export function tonoDeEtapa(etapa: Etapa): TonoEtapa {
  return etapa.fuga?.tono ?? "neutro";
}

export const COLOR_TONO: Record<TonoEtapa, string> = {
  malo: "#EF4444",
  alerta: "#F59E0B",
  bueno: "#10B981",
  neutro: "#9CA3AF",
};

/** Fondo del pill de cada tono — los `*-tint` que ya define globals.css. */
export const COLOR_TONO_TINT: Record<TonoEtapa, string> = {
  malo: "var(--danger-tint)",
  alerta: "var(--warning-tint)",
  bueno: "var(--success-tint)",
  neutro: "var(--bg)",
};
