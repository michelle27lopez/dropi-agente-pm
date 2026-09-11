// Taller Dropi Lab — registro de fichas personalizadas.
//
// Cada quien agrega SU propia línea acá (import + entrada en el mapa), con
// la llave en minúscula igual al project_code de su POC. No toques las
// líneas de nadie más — así ningún PR choca con otro.
//
// Ejemplo, una vez copiado el archivo detalle/_ejemplo.tsx a detalle/fin-004.tsx:
//
//   import FinCuatroCero4 from "./fin-004";
//   ...
//   "fin-004": FinCuatroCero4,

import type { ComponentType } from "react";
import type { PocDetailProps } from "./types";
import PulsoDetalle from "./pulso-001";

export const registry: Record<string, ComponentType<PocDetailProps>> = {
  // Ejemplo que se muestra en vivo en la teoría del taller.
  "pulso-001": PulsoDetalle,
  // Agrega tu entrada debajo de esta línea 👇
};
