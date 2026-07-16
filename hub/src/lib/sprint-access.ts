// Acceso restringido: /sprint y su API solo existen para Michelle y Jaime
// por ahora (decisión 2026-07-15) — no se lista en los homes de otras
// células ni se expone a nadie más, aunque conozcan la URL.
export const SPRINT_ALLOWED_EMAILS = [
  "michelle.lopez@dropi.co",
  "jaime.guevara@dropi.co",
];

// Regla confirmada 2026-07-16: un PM puede ver el dashboard de los PD de su
// equipo (Jaime → Michelle), no al revés todavía. `pd` solo ve el suyo.
export type SprintRole = "pm" | "pd";
export const SPRINT_ROLES: Record<string, SprintRole> = {
  "michelle.lopez@dropi.co": "pd",
  "jaime.guevara@dropi.co": "pm",
};

export function isSprintAllowed(email: string | null | undefined): boolean {
  if (!email) return false;
  return SPRINT_ALLOWED_EMAILS.includes(email.toLowerCase());
}

// A quién puede ver el dashboard de sprint el dueño de `viewerEmail`
// (siempre incluye el propio). Ambos emails deben estar en el alcance.
export function viewableSprintEmails(viewerEmail: string | null | undefined): string[] {
  if (!isSprintAllowed(viewerEmail)) return [];
  const viewer = viewerEmail!.toLowerCase();
  if (SPRINT_ROLES[viewer] !== "pm") return [viewer];
  return [viewer, ...SPRINT_ALLOWED_EMAILS.filter((e) => e !== viewer)];
}
