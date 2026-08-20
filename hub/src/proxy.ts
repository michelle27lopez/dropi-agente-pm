import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const pathname = request.nextUrl.pathname;
  const isSensitiveLogisticsPath =
    pathname.startsWith("/logistica/") ||
    pathname.startsWith("/proyectos/logistica") ||
    pathname.startsWith("/api/logistica") ||
    pathname.startsWith("/proyectos/oportunidades-paises");

  if (!supabaseUrl || !supabaseAnonKey) {
    // Los artefactos bajo public/logistica se sirven como rutas directas. Si la
    // autenticación está mal configurada, continuar dejaría documentación y
    // datos operativos expuestos. Este cierre es deliberadamente acotado a
    // Logistic Success para no cambiar el comportamiento del resto del Hub.
    if (isSensitiveLogisticsPath) {
      return new NextResponse("Autenticación no disponible.", {
        status: 503,
        headers: {
          "Cache-Control": "no-store",
          "Content-Type": "text/plain; charset=utf-8",
        },
      });
    }
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

  const isPublicPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/auth/callback") ||
    // Pulso Demo — piloto externo (los asistentes llegan por WhatsApp/QR,
    // sin cuenta en el hub). Las páginas y rutas de lectura/registro/
    // aceptación quedan públicas; el panel de control (/pulso-demo/admin)
    // y las rutas que disparan envíos reales o borran el estado del piloto
    // (trigger, reset) quedan afuera — esas exigen login vía requireUser()
    // en sus handlers. Si agregas otra ruta administrativa bajo pulso-demo,
    // exclúyela aquí también.
    ((pathname.startsWith("/pulso-demo") || pathname.startsWith("/api/pulso-demo")) &&
      !pathname.startsWith("/pulso-demo/admin") &&
      !pathname.startsWith("/api/pulso-demo/trigger") &&
      !pathname.startsWith("/api/pulso-demo/reset")) ||
    pathname.startsWith("/proyectos/gali-demo") ||
    pathname.startsWith("/api/gali") ||
    pathname.startsWith("/proyectos/indicadores/ascenso") ||
    pathname.startsWith("/api/proyectos/ascenso-ofertas") ||
    pathname.startsWith("/api/public") ||
    // Webhooks entrantes de sistemas externos (n8n, pipeline de Dagster, …):
    // no llegan con cookie de sesión del Hub, llegan con su propio token/
    // header de auth, que cada ruta valida adentro (ver p.ej.
    // /api/webhooks/cuidado-de-campanas). Sin esta excepción, este gate los
    // redirige a /login antes de que su propia auth corra.
    pathname.startsWith("/api/webhooks/") ||
    // Página de "productos elegibles" que se le manda a cada proveedor por
    // WhatsApp — pública a propósito, el token opaco en la URL es el control
    // de acceso (ver hub/src/lib/local-store-planeacion.ts). OJO: las rutas
    // internas del equipo bajo /elegibles/ (aprobar, export) deben quedar
    // excluidas aquí — si agregas otra subruta interna, exclúyela también.
    (pathname.includes("/dinamicas-catalogo/planeacion/") && pathname.includes("/elegibles/")) ||
    (pathname.startsWith("/api/campaigns-planeacion/") && pathname.includes("/elegibles/") &&
      !pathname.endsWith("/elegibles/aprobar") && !pathname.endsWith("/elegibles/export") &&
      !pathname.endsWith("/elegibles/export-links")) ||
    // Link corto /c/[token] que redirige a la ruta de arriba — mismo token
    // opaco como control de acceso, ver hub/src/app/c/[token]/page.tsx.
    pathname.startsWith("/c/");

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Usuarios con role "contributor" solo pueden ver /iniciativas.
  // Cualquier otra ruta del Hub los redirige ahí.
  // Se lee de app_metadata (solo escribible con service-role), no de
  // user_metadata — ese lo puede reescribir el propio usuario desde el
  // navegador con supabase.auth.updateUser(). Ver AGP-17 y
  // scripts/migrate-role-to-app-metadata.js.
  const role = user?.app_metadata?.role;
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
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|webm)$).*)"],
};
