// La card "Entrevistas" (BRA-005) en /celula/brands enruta por defecto a
// /proyectos/bra-005 (project_code en minúscula) — el contenido real vive en
// /proyectos/marcas/entrevistas (decisión de ubicación de Kate, 30-jul-2026).
// Esta página solo redirige para que el click de la card llegue al lugar correcto.
import { redirect } from "next/navigation";

export default function Bra005Redirect() {
  redirect("/proyectos/marcas/entrevistas");
}
