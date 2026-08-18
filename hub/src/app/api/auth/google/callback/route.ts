import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/require-auth";
import { isMiDiaOwner } from "@/lib/sprint-access";
import { exchangeCodeForRefreshToken } from "@/lib/google-calendar";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const user = await requireUser();
  if (!isMiDiaOwner(user?.email)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
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

    return NextResponse.redirect(new URL("/", request.nextUrl.origin));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Error desconocido" }, { status: 500 });
  }
}
