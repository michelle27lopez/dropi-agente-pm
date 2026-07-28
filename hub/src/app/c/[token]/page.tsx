import { redirect, notFound } from "next/navigation";
import { supabaseGetEligibleByTokenOnly } from "@/lib/supabase-store-planeacion";
import { localGetEligibleByTokenOnly } from "@/lib/local-store-planeacion";

// Link corto para proveedores: /c/{token} en vez de la ruta completa
// /proyectos/dinamicas-catalogo/planeacion/{campaignId}/elegibles/{token}.
// El token ya es único globalmente, así que solo hace falta resolver a qué
// campaña pertenece y redirigir — no cambia nada de seguridad (sigue siendo
// el mismo token opaco, ver nota en elegibles/[token]/route.ts).
export default async function ShortLinkRedirect({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const entry = (await supabaseGetEligibleByTokenOnly(token)) ?? (await localGetEligibleByTokenOnly(token));
  if (!entry) notFound();
  redirect(`/proyectos/dinamicas-catalogo/planeacion/${entry.campaign_id}/elegibles/${token}`);
}
