/** El prefijo que le corresponde a una célula por su slug: `logistica` → `LOG`. */
function prefijoDeSlug(slug: string): string {
  return slug.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase() || "PRJ";
}

// Reusa el prefijo que la célula ya tenga en uso e incrementa; si no tiene
// ninguno todavía, deriva uno de su slug.
//
// El orden de preferencia importa. Antes se elegía el prefijo con el NÚMERO más
// alto, y eso se rompe en cuanto una célula tiene una ficha guardada con el
// ticket de Jira como código: logística convive con `LOG-017` y `PRM-1513`, así
// que 1513 > 17 y el siguiente proyecto se habría llamado `PRM-1514` — el
// código ajeno se perpetuaba solo. Ahora el prefijo propio de la célula gana
// siempre que ya esté en uso.
export function nextProjectCode(slug: string, existentes: { project_code: string | null }[]): string {
  const maxByPrefix = new Map<string, number>();
  for (const { project_code } of existentes) {
    if (!project_code) continue;
    const [prefix, numStr] = project_code.split("-");
    const num = parseInt(numStr, 10);
    if (!prefix || Number.isNaN(num)) continue;
    maxByPrefix.set(prefix, Math.max(maxByPrefix.get(prefix) ?? 0, num));
  }

  const propio = prefijoDeSlug(slug);
  if (maxByPrefix.has(propio)) {
    return `${propio}-${String((maxByPrefix.get(propio) ?? 0) + 1).padStart(3, "0")}`;
  }

  // La célula no usa su prefijo (sellers va con PROD-/PRM-, growth-marketing con
  // GMR-): se respeta lo que ya tiene, con la regla de antes.
  if (maxByPrefix.size > 0) {
    const [prefix, max] = [...maxByPrefix.entries()].sort((a, b) => b[1] - a[1])[0];
    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
  }

  return `${propio}-001`;
}
