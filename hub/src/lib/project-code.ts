// Reusa el prefijo que la célula ya tenga en uso (el de mayor número, si hay
// varios) e incrementa; si no tiene ninguno todavía, deriva uno de su slug.
export function nextProjectCode(slug: string, existentes: { project_code: string | null }[]): string {
  const maxByPrefix = new Map<string, number>();
  for (const { project_code } of existentes) {
    if (!project_code) continue;
    const [prefix, numStr] = project_code.split("-");
    const num = parseInt(numStr, 10);
    if (!prefix || Number.isNaN(num)) continue;
    maxByPrefix.set(prefix, Math.max(maxByPrefix.get(prefix) ?? 0, num));
  }

  if (maxByPrefix.size > 0) {
    const [prefix, max] = [...maxByPrefix.entries()].sort((a, b) => b[1] - a[1])[0];
    return `${prefix}-${String(max + 1).padStart(3, "0")}`;
  }

  const prefix = slug.replace(/[^a-z]/gi, "").slice(0, 3).toUpperCase() || "PRJ";
  return `${prefix}-001`;
}
