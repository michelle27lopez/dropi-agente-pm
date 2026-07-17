"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect — el dashboard general se movió a /proyectos/dinamicas-catalogo (raíz).
export default function PlaneacionDashboardRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/proyectos/dinamicas-catalogo");
  }, [router]);
  return null;
}
