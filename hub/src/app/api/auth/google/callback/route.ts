import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { isMiDiaOwner } from "@/lib/sprint-access";
import { exchangeCodeForRefreshToken } from "@/lib/google-calendar";
import { OAUTH_STATE_COOKIE, statesMatch } from "@/lib/google-oauth-state";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const user = await requireUser();
  if (!isMiDiaOwner(user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  // El `state` se valida ANTES de tocar el `code`: si el flujo no arrancó en
  // este navegador, no hay nada que canjear. Sin esta comprobación, un tercero
  // puede inducir a un usuario autorizado a canjear un `code` ajeno y dejar el
  // refresh_token de OTRA cuenta de Google guardado bajo el email de la
  // víctima — el panel "Hoy" pasaría a leer el calendario del atacante.
  const state = request.nextUrl.searchParams.get("state") ?? undefined;
  const expected = request.cookies.get(OAUTH_STATE_COOKIE)?.value;

  if (!statesMatch(state, expected)) {
    const rejected = NextResponse.json(
      { error: "Parámetro state inválido o ausente. Vuelve a iniciar la conexión desde /api/auth/google/login" },
      { status: 400 }
    );
    // La cookie se quema pase lo que pase: un state que ya falló no debe poder
    // reintentarse.
    rejected.cookies.delete(OAUTH_STATE_COOKIE);
    return rejected;
  }

  const code = request.nextUrl.searchParams.get("code");
  if (!code) {
    return NextResponse.json({ error: "Falta el parámetro code" }, { status: 400 });
  }
  if (!supabase) {
    return NextResponse.json({ error: "Supabase no configurado" }, { status: 500 });
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`;

  try {
    const refreshToken = await exchangeCodeForRefreshToken(code, redirectUri);

    const { error } = await supabase
      .from("google_oauth_tokens")
      .upsert({ person_email: user!.email, refresh_token: refreshToken, updated_at: new Date().toISOString() });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const done = NextResponse.redirect(new URL("/", request.nextUrl.origin));
    done.cookies.delete(OAUTH_STATE_COOKIE);
    return done;
  } catch (err) {
    const failed = NextResponse.json(
      { error: err instanceof Error ? err.message : "Error desconocido" },
      { status: 500 }
    );
    failed.cookies.delete(OAUTH_STATE_COOKIE);
    return failed;
  }
}
