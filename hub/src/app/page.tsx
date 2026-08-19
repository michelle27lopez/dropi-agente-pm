"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// "/" redirige a la home de tu propia célula (2026-08-17, Jaime) — "Mi día"
// dejó de ser una página aparte y se volvió las dos capas de arriba de
// /celula/[slug] (célula + personal), así que ya no hace falta un home
// universal separado. El sidebar (GlobalNav) apunta "Mi día" directo a
// /celula/[slug] cuando ya sabe tu célula; esta ruta plana es el fallback
// para el primer load o un link viejo a "/".
//
// Único caso especial que se conserva: un stakeholder (Lucho, María) no
// pertenece a ninguna célula — su origen sigue siendo el resumen ejecutivo
// cross-célula, no una home de célula.
export default function HubRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {
        const profile = data?.profile;
        if (profile?.is_stakeholder && !profile?.is_super_admin) {
          router.replace("/resumen");
          return;
        }
        const slug = profile?.celulas?.slug;
        router.replace(slug ? `/celula/${slug}` : "/resumen");
      })
      .catch(() => router.replace("/resumen"));
  }, [router]);

  return <main style={{ minHeight: "100vh" }} />;
}
