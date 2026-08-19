import { timingSafeEqual } from "crypto";

// Nombre y vigencia de la cookie que guarda el `state` del flujo de OAuth con
// Google. Vive aquí para que la ruta de login y la de callback no puedan
// desincronizarse: si una cambia el nombre y la otra no, el flujo se rompe
// entero en vez de fallar en silencio.
export const OAUTH_STATE_COOKIE = "google_oauth_state";

// 10 minutos: de sobra para dar consentimiento, poco para dejar un state
// reutilizable rondando en el navegador.
export const OAUTH_STATE_MAX_AGE = 60 * 10;

/**
 * Compara el `state` que devolvió Google contra el que guardamos en la cookie.
 *
 * Se compara en tiempo constante para no filtrar por cuánto tarda cuántos
 * caracteres iniciales coincidían. Ambos valores deben existir y medir lo
 * mismo: `timingSafeEqual` lanza si los buffers tienen distinto largo, así que
 * el largo se verifica antes — y esa comparación de largo no filtra nada útil,
 * porque el largo del state es fijo y conocido.
 */
export function statesMatch(fromGoogle: string | undefined, fromCookie: string | undefined): boolean {
  if (!fromGoogle || !fromCookie) return false;

  const a = Buffer.from(fromGoogle);
  const b = Buffer.from(fromCookie);
  if (a.length !== b.length) return false;

  return timingSafeEqual(a, b);
}
