import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
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
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isPublicPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/pulso-demo") ||
    pathname.startsWith("/api/pulso-demo") ||
    pathname.startsWith("/proyectos/gali-demo") ||
    pathname.startsWith("/api/gali") ||
    pathname.startsWith("/proyectos/indicadores/ascenso") ||
    pathname.startsWith("/api/proyectos/ascenso-ofertas") ||
    pathname.startsWith("/api/public") ||
    pathname.startsWith("/docs") ||
    // Página de "productos elegibles" que se le manda a cada proveedor por
    // WhatsApp — pública a propósito, el token opaco en la URL es el control
    // de acceso (ver hub/src/lib/local-store-planeacion.ts). OJO: las rutas
    // internas del equipo bajo /elegibles/ (aprobar, export) deben quedar
    // excluidas aquí — si agregas otra subruta interna, exclúyela también.
    (pathname.includes("/dinamicas-catalogo/planeacion/") && pathname.includes("/elegibles/")) ||
    (pathname.startsWith("/api/campaigns-planeacion/") && pathname.includes("/elegibles/") &&
      !pathname.endsWith("/elegibles/aprobar") && !pathname.endsWith("/elegibles/export"));

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Usuarios con role "contributor" solo pueden ver /iniciativas.
  // Cualquier otra ruta del Hub los redirige ahí.
  const role = user?.user_metadata?.role;
  const isIniciativasPath =
    pathname.startsWith("/iniciativas") || pathname.startsWith("/api/iniciativas");

  if (role === "contributor" && !isIniciativasPath && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/iniciativas";
    return NextResponse.redirect(url);
  }

  // pruebas@dropi.co solo puede ver la vista de Pruebas con Usuarios y los
  // prototipos que esta enlaza.
  const isPruebasUsuariosPath =
    pathname.startsWith("/pruebas-usuarios") ||
    pathname.startsWith("/proyectos/descuentos/prototipo") ||
    pathname.startsWith("/proyectos/categorizacion/prototipo");

  if (user?.email === "pruebas@dropi.co" && !isPruebasUsuariosPath && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/pruebas-usuarios";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
