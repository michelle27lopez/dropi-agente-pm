import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Supplier Lab es un clon/laboratorio interno — a diferencia de Darwin (hub),
// no tiene flujos pensados para usuarios externos sin cuenta. Todo exige
// sesión salvo login y el callback de magic link.
function getIsPublicPath(pathname: string): boolean {
  return pathname.startsWith("/login") || pathname.startsWith("/auth/callback");
}

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isPublicPath = getIsPublicPath(pathname);

  if (!supabaseUrl || !supabaseAnonKey) {
    // Sin cliente de auth no hay forma de saber quién llama — fallar cerrado
    // (503) en vez de dejar pasar todo sin autenticar. Ver AGP-19.
    if (isPublicPath) return NextResponse.next({ request });
    return new NextResponse("Autenticación no disponible.", {
      status: 503,
      headers: { "Cache-Control": "no-store" },
    });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const { data: { user } } = await supabase.auth.getUser();

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
