// URL raíz del proyecto Rapid Prototype (Angular RPP / dropi-prototypes).
// En local apunta al ng serve de tu máquina; en producción (Vercel) apunta
// siempre a dropitesters.co, donde vive el RPP desplegado.
export const RPP_BASE_URL =
  process.env.NEXT_PUBLIC_RPP_BASE_URL ??
  (process.env.NODE_ENV === "production"
    ? "https://www.dropitesters.co"
    : "http://localhost:4200");
