import type { FilaEncuesta } from "./tipos";

// Detección de cuentas de prueba/QA. Dos vías, nunca solo una:
//   1. Patrón detectable en código: nombre "Usuario Prueba" (o variantes) +
//      dominio de correo desechable conocido.
//   2. Exclusión manual: cuentas con nombre de apariencia real que el equipo
//      confirma como prueba por conocimiento externo (ej. Catalina Trujillo,
//      28-jul-2026) — NO detectables por patrón, requieren una lista
//      persistida y editable (brands_ttfo_exclusiones en Supabase), nunca
//      una constante en código.

const DOMINIOS_DESECHABLES = ["hidepost.net"];

export function esCuentaPruebaPorPatron(fila: FilaEncuesta): { esPrueba: boolean; motivo: string | null } {
  const nombreEsPrueba = /^usuario\s*prueba$/i.test(fila.nombre.trim());
  const dominioDesechable = fila.email
    ? DOMINIOS_DESECHABLES.some(dominio => fila.email!.toLowerCase().endsWith(`@${dominio}`))
    : false;

  if (nombreEsPrueba || dominioDesechable) {
    const razones = [
      nombreEsPrueba ? 'nombre "Usuario Prueba"' : null,
      dominioDesechable ? "dominio de correo desechable" : null,
    ].filter(Boolean);
    return { esPrueba: true, motivo: `Detectado por patrón: ${razones.join(" + ")}` };
  }
  return { esPrueba: false, motivo: null };
}

export interface ExclusionManual {
  userId: number;
  motivo: string;
}

/**
 * Combina la detección por patrón con la lista manual persistida. La lista
 * manual siempre gana (puede confirmar un caso que el patrón no detecta, o
 * en teoría revertir un falso positivo si se documenta así).
 */
export function aplicarExclusiones(
  fila: FilaEncuesta,
  exclusionesManuales: Map<number, ExclusionManual>,
): { esPrueba: boolean; motivo: string | null } {
  const manual = exclusionesManuales.get(fila.userId);
  if (manual) return { esPrueba: true, motivo: `Exclusión manual: ${manual.motivo}` };
  return esCuentaPruebaPorPatron(fila);
}
