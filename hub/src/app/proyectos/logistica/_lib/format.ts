// Formateo y parseo de cifras del tablero.
//
// Las cifras del weekly viven como TEXTO ya formateado ("82,7%", "786.573",
// "3,86M", "+0,4 pts") porque así las escribe quien redacta el weekly y así se
// pintan en la tabla. Pero una gráfica necesita el número. En vez de duplicar
// cada valor en dos formatos dentro de `data.ts` —y que un día no coincidan—,
// se parsea el texto: la tabla y la gráfica leen exactamente el mismo dato.

/**
 * "82,7%" → 82.7 · "786.573" → 786573 · "3,86M" → 3_860_000 · "+0,4 pts" → 0.4
 * "≈ 0 · plano" → null. Cualquier cosa que no tenga un número es `null`, no
 * `NaN`: la gráfica debe poder saltarse el punto sin romperse.
 */
export function parseValor(texto: string | number | undefined | null): number | null {
  if (texto === undefined || texto === null) return null;
  if (typeof texto === "number") return Number.isFinite(texto) ? texto : null;
  const m = texto.replace(/\s/g, "").match(/([+-]?)(\d[\d.]*)(?:,(\d+))?([MKk%])?/);
  if (!m) return null;
  const [, signo, entero, decimal, sufijo] = m;
  let n = Number(entero.replace(/\./g, "") + (decimal ? "." + decimal : ""));
  if (!Number.isFinite(n)) return null;
  if (sufijo === "M") n *= 1_000_000;
  if (sufijo === "K" || sufijo === "k") n *= 1_000;
  return signo === "-" ? -n : n;
}

/** ¿El texto expresa un porcentaje? Decide el eje y el formateador del tooltip. */
export function esPorcentaje(texto: string | undefined) {
  return typeof texto === "string" && texto.includes("%");
}

/** Un decimal, coma decimal: 82.7 → "82,7%". */
export function formatPct1(pct: number) {
  return `${pct.toFixed(1).replace(".", ",")}%`;
}

/** Dos decimales, coma decimal. Vacío si no hay dato. */
export function formatPct(pct?: number) {
  if (pct === undefined) return "";
  return `${pct.toFixed(2).replace(".", ",")}%`;
}

/** Miles con punto, como se escribe en Colombia: 786573 → "786.573". */
export function formatMiles(n: number) {
  return Math.round(n).toLocaleString("es-CO");
}

/** Compacto para ejes: 3_860_000 → "3,9M" · 786_573 → "787K" · 82.7 → "83". */
export function formatCompacto(n: number) {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(".", ",")}M`;
  if (Math.abs(n) >= 10_000) return `${Math.round(n / 1_000)}K`;
  return Math.round(n).toString();
}

/** 44.9 → "44,9h" · 24 → "24h". */
export function formatHoras(horas: number) {
  return `${horas.toFixed(horas % 1 === 0 ? 0 : 1).replace(".", ",")}h`;
}

/**
 * Parte un párrafo en titular + resto por la primera frase.
 *
 * La ley del tablero (§2) pide que el título diga la conclusión, y los textos
 * del weekly ya están escritos así: la primera frase de `foco` o de `lectura`
 * ES la conclusión, y lo que sigue la sustenta. En vez de pedirle a quien
 * redacta que escriba dos campos, se parte al renderizar.
 *
 * Si no hay un corte claro, devuelve todo como titular: mejor un titular largo
 * que un detalle huérfano.
 */
export function partir(texto: string): [string, string] {
  const m = texto.match(/^([^]+?[.!?])\s+(?=[A-ZÁÉÍÓÚÑ¿¡"'])/);
  if (!m) return [texto, ""];
  return [m[1], texto.slice(m[0].length)];
}
