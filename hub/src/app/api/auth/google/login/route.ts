import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { isMiDiaOwner } from "@/lib/sprint-access";
import { buildConsentUrl } from "@/lib/google-calendar";

// Consentimiento de una sola vez para habilitar el sync en vivo del panel
// "Hoy" — ver [[project_darwin_pd_dashboard]]. El mismo redirect URI debe
// estar dado de alta en Google Cloud Console para el origin desde el que se
// visite esta ruta (localhost en dev, dominio de Vercel en prod).
export async function GET(request: NextRequest) {
  const user = await requireUser();
  if (!isMiDiaOwner(user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;

  try {
    const url = buildConsentUrl(redirectUri);
    return NextResponse.redirect(url);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error desconocido" }, { status: 500 });
  }
}
