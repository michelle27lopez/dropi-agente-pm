import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { createClient } from "@/lib/supabase-server";
import GlobalNavShell from "@/components/GlobalNavShell";

export const metadata: Metadata = {
  title: "Darwin",
  description: "Hub de herramientas de Supplier Success",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Nav global: para cualquier usuario autenticado (2026-08-17, globalización
  // aprobada por Jaime). Antes era solo para Michelle/Jaime — esa bandera
  // (isMiDiaOwner) ahora controla algo distinto: quién ve "Mi día" con
  // contenido real en vez del estado "Pendiente". Ver
  // [[project_darwin_pd_dashboard]].
  const showGlobalNav = !!user;

  return (
    <html lang="es">
      <body>
        <Suspense>
          {showGlobalNav ? <GlobalNavShell>{children}</GlobalNavShell> : children}
        </Suspense>
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
