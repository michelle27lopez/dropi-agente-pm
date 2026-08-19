// Acceso restringido: /sprint y su API solo existen para este grupo
// (decisión 2026-07-15) — no se lista en los homes de otras células ni se
// expone a nadie más, aunque conozcan la URL.
//
// Ampliado 2026-08-19: entra Juan Diego como PM de Logistic Success. Su home
// de célula mostraba "Pendiente" en Retomando, Sprint actual y Hoy — los tres
// consultan esta lista, así que sin estar aquí no podía ni conectar su propio
// calendario (/api/auth/google/login responde 401 vía isMiDiaOwner).
export const SPRINT_ALLOWED_EMAILS = [
  "michelle.lopez@dropi.co",
  "jaime.guevara@dropi.co",
  "juan.bautista@dropi.co",
];

// Regla confirmada 2026-07-16: un PM puede ver el dashboard de los PD de su
// equipo (Jaime → Michelle), no al revés todavía. `pd` solo ve el suyo.
export type SprintRole = "pm" | "pd";
export const SPRINT_ROLES: Record<string, SprintRole> = {
  "michelle.lopez@dropi.co": "pd",
  "jaime.guevara@dropi.co": "pm",
  "juan.bautista@dropi.co": "pm",
};

// Home privado tipo "mi día" (proyectos/mi-dia) — solo se renderiza en vez
// de la home de célula estándar para estos emails (decisión 2026-07-21,
// ampliada 2026-08-17 para que Jaime pueda explorar el rediseño con su
// propia identidad, no viendo lo de Michelle). Mismo alcance que
// SPRINT_ALLOWED_EMAILS a propósito — es el mismo grupo de preview.
export const MI_DIA_OWNER_EMAIL = "michelle.lopez@dropi.co";

export function isMiDiaOwner(email: string | null | undefined): boolean {
  if (!email) return false;
  return SPRINT_ALLOWED_EMAILS.includes(email.toLowerCase());
}

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
