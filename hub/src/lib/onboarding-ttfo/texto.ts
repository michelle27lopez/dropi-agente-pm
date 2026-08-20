// Reparación de mojibake — texto con tildes/ñ que viene corrupto desde el
// payload de Raw Data (ej. "AÃºn no vendo" en vez de "Aún no vendo",
// "PatiÃ±o" en vez de "Patiño"). Encontrado por Kate (05-ago-2026): rompía
// el filtro de Nivel de madurez porque "AÃºn no vendo" no calza con ninguna
// clave de MADUREZ_DECLARADA.
//
// Patrón clásico: el texto ya era UTF-8 correcto, pero en algún punto del
// pipeline (probablemente al armar el JSON del webhook) se interpretó byte
// a byte como Latin-1/Windows-1252 y se reescribió como UTF-8 — reinterpretar
// esos mismos bytes como UTF-8 recupera el texto original.

const MARCADOR_MOJIBAKE = /Ã[\x80-\xBF]|Â[\x80-\xBF]/;

// TextDecoder (no Buffer) para que sirva igual en servidor y en cliente —
// este módulo se importa también desde page.tsx ("use client").
export function repararMojibake<T extends string | null>(texto: T): T {
  if (!texto || !MARCADOR_MOJIBAKE.test(texto)) return texto;
  try {
    const bytes = Uint8Array.from(texto, c => c.charCodeAt(0) & 0xff);
    return new TextDecoder("utf-8").decode(bytes) as T;
  } catch {
    return texto;
  }
}
