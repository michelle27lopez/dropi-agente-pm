"use client";

import { useEffect, useState } from "react";

// Las páginas de proyecto se visitan solas (con su propio breadcrumb "← Dropi
// PM Tools") y también embebidas en un <iframe> dentro de /metricas, que ya
// trae su propio breadcrumb exterior. Sin esto, el usuario ve dos breadcrumbs
// apilados y el de adentro navega solo el iframe a un callejón sin salida.
export function useIsEmbedded() {
  const [embedded, setEmbedded] = useState(false);

  useEffect(() => {
    setEmbedded(window.self !== window.top);
  }, []);

  return embedded;
}
