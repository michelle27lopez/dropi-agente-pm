// Un color por célula, para distinguirlas de un vistazo (Directorio de POCs).
// Reutiliza los semánticos del hub donde alcanza (--dropi, --success,
// --warning, --danger, --info) y suma un par de tonos propios para el
// resto — mismo criterio de paleta que ya usa PROJECT_STYLE en
// curated-projects.ts para íconos/colores de proyecto.
export const CELULA_COLOR: Record<string, { fg: string; bg: string }> = {
  sellers: { fg: "var(--dropi)", bg: "var(--dropi-light)" },
  suppliers: { fg: "var(--info)", bg: "var(--info-tint)" },
  brands: { fg: "#DB2777", bg: "#FDF2F8" },
  growth: { fg: "#7C3AED", bg: "#F5F3FF" },
  "growth-marketing": { fg: "#7C3AED", bg: "#F5F3FF" },
  logistica: { fg: "#0D9488", bg: "#F0FDFA" },
  experience: { fg: "#4F46E5", bg: "#EEF2FF" },
  fintech: { fg: "var(--success)", bg: "var(--success-tint)" },
  backoffice: { fg: "var(--warning)", bg: "var(--warning-tint)" },
};

export const CELULA_COLOR_DEFAULT = { fg: "var(--muted)", bg: "var(--gray-100)" };

export function celulaColor(slug: string | undefined | null) {
  return (slug && CELULA_COLOR[slug]) || CELULA_COLOR_DEFAULT;
}
