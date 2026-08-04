import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { createClient } from "@/lib/supabase-server";
import { isMiDiaOwner } from "@/lib/sprint-access";
import GlobalNavShell from "@/components/GlobalNavShell";

export const metadata: Metadata = {
  title: "Darwin",
  description: "Hub de herramientas de Supplier Success",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Nav global: solo para Michelle por ahora, ver [[project_darwin_pd_dashboard]].
  const showGlobalNav = isMiDiaOwner(user?.email);

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
