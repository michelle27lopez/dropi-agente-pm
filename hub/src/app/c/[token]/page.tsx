import { redirect, notFound } from "next/navigation";
import { supabaseGetEligibleByTokenOnly, supabaseRegisterMeetRsvpClick } from "@/lib/supabase-store-planeacion";
import { localGetEligibleByTokenOnly, localRegisterMeetRsvpClick } from "@/lib/local-store-planeacion";

// Link del Meet del 20/08 en Google Calendar (evento "Cyber Days", 4:00-5:00pm
// America/Bogota) — mismo link que usa el botón "Agendarme" del panel interno,
// hardcodeado aquí igual que el resto de fechas de esta campaña de un solo uso.
const MEET_CALENDAR_LINK =
  "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Meet%20Cyber%20Days&dates=20260820T210000Z%2F20260820T220000Z&details=Reuni%C3%B3n%20de%20preparaci%C3%B3n%20para%20Cyber%20Days.%0A%0AEnlace%3A%20https%3A%2F%2Fmeet.google.com%2Fzty-fqfh-xwr%0ATel%C3%A9fono%3A%20(CO)%20%2B57%20601%208956531%20PIN%3A%20826%20889%20725%23&location=https%3A%2F%2Fmeet.google.com%2Fzty-fqfh-xwr&ctz=America%2FBogota";

// Link corto para proveedores: /c/{token} en vez de la ruta completa
// /proyectos/dinamicas-catalogo/planeacion/{campaignId}/elegibles/{token}.
// El token ya es único globalmente, así que solo hace falta resolver a qué
// campaña pertenece y redirigir — no cambia nada de seguridad (sigue siendo
// el mismo token opaco, ver nota en elegibles/[token]/route.ts).
//
// ?meet=1 es el botón "Agendarme" del mensaje de WhatsApp de reprogramación:
// un link plano no puede hacer un fetch antes de navegar (no hay JS en el
// mensaje), así que el tracking del clic pasa por acá — se registra el clic
// del lado del servidor y se redirige directo a Google Calendar en vez de al
// panel.
export default async function ShortLinkRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ meet?: string }>;
}) {
  const { token } = await params;
  const { meet } = await searchParams;
  const entry = (await supabaseGetEligibleByTokenOnly(token)) ?? (await localGetEligibleByTokenOnly(token));
  if (!entry) notFound();

  if (meet === "1") {
    (await supabaseRegisterMeetRsvpClick(entry.campaign_id, token)) ?? (await localRegisterMeetRsvpClick(entry.campaign_id, token));
    redirect(MEET_CALENDAR_LINK);
  }

  redirect(`/proyectos/dinamicas-catalogo/planeacion/${entry.campaign_id}/elegibles/${token}`);
}
