import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { requireUser } from "@/lib/require-auth";
import { isMiDiaOwner } from "@/lib/sprint-access";
import { buildConsentUrl } from "@/lib/google-calendar";
import { OAUTH_STATE_COOKIE, OAUTH_STATE_MAX_AGE } from "@/lib/google-oauth-state";

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
    // Un valor aleatorio por intento, que viaja a Google en `state` y se queda
    // también en una cookie httpOnly. El callback exige que los dos coincidan:
    // así solo se canjea el `code` del flujo que arrancó en este navegador.
    const state = randomBytes(32).toString("base64url");

    const url = buildConsentUrl(redirectUri, state);
    const response = NextResponse.redirect(url);

    response.cookies.set(OAUTH_STATE_COOKIE, state, {
      httpOnly: true,
      secure: request.nextUrl.protocol === "https:",
      sameSite: "lax", // "lax" y no "strict": la cookie debe sobrevivir el redirect de vuelta desde Google.
      path: "/api/auth/google",
      maxAge: OAUTH_STATE_MAX_AGE,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error desconocido" }, { status: 500 });
  }
}
