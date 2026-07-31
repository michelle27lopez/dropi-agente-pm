"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect — el panel de campañas se movió a /proyectos/dinamicas-catalogo/campanas.
export default function PlaneacionListRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/proyectos/dinamicas-catalogo/campanas");
  }, [router]);
  return null;
}
