"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Redirect — el roadmap se fusionó con los hitos reales en /proyectos/dinamicas-catalogo/calendario.
export default function ProximasCampanasRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/proyectos/dinamicas-catalogo/calendario");
  }, [router]);
  return null;
}
