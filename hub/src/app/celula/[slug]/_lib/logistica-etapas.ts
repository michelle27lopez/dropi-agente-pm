// ─────────────────────────────────────────────────────────────────────────────
// La etapa del viaje de la orden, reducida a lo que necesita la home de célula.
//
// Contexto: /celula/logistica agrupaba las iniciativas POR etapa, con un
// encabezado por cada una. Eso rompía la interfaz común de célula (Updates ·
// Discovery · Delivery · Followings). Ahora la etapa deja de ser la estructura
// de la página y pasa a ser UN DATO de la tarjeta: un tag, más una fila de
// chips para filtrar. Las secciones vuelven a ser las mismas en todas las
// células.
//
// Este módulo se importa con `import()` dinámico desde page.tsx. No es una
// optimización cosmética: importar `proyectos/logistica/_lib/data.ts` de forma
// estática mete ~1.500 líneas de tablero en el bundle de TODAS las células, que
// no lo usan. Misma razón por la que la torre se cargaba aparte.
//
// La llave del cruce es `codigo` (LOG-XXX) ↔ `project_code` de Supabase, igual
// que en logistica-torre.ts. Nada se duplica aquí: todo sale de data.ts.
// ─────────────────────────────────────────────────────────────────────────────

import { etapas, proyectos } from "@/app/proyectos/logistica/_lib/data";

export type ChipEtapa = {
  n: number;
  nombre: string;
  /** Iniciativas del tablero en esta etapa, tengan ficha en Darwin o no. */
  total: number;
};

/** Una iniciativa del tablero, con lo mínimo para cruzarla contra Darwin. */
export type IniciativaTablero = {
  slug: string;
  nombre: string;
  etapa: string;
  /**
   * Todos los `project_code` con los que esta iniciativa puede estar guardada
   * en Supabase, en mayúsculas. Normalmente uno (`LOG-XXX`); dos cuando la
   * ficha quedó registrada con el ticket de Jira (ver `codigoDarwin` en el
   * tablero). Vacío = todavía no tiene código asignado.
   */
  codigos: string[];
  destacado?: boolean;
};

export type MapaEtapas = {
  chips: ChipEtapa[];
  /** `project_code` en mayúsculas → nombre de la etapa. Incluye las dos llaves. */
  etapaPorCodigo: Record<string, string>;
  /**
   * `project_code` en mayúsculas → slug del tablero.
   *
   * Hace falta porque `ProjectCard` enlaza a `/proyectos/<código>`, y esa ruta
   * no existe para estos proyectos: su ficha vive en el tablero de logística.
   * Sin este override las tarjetas apuntan a un 404.
   */
  slugPorCodigo: Record<string, string>;
  /**
   * Las 16 iniciativas, para cruzarlas contra las filas de Supabase.
   *
   * El cruce se hace en la página y no aquí a propósito: tener `codigo` en
   * data.ts NO significa tener ficha en Darwin — las 16 tienen código y aun así
   * varias no tienen fila. La única prueba de que existe la ficha es que el
   * `project_code` aparezca en lo que devolvió `/api/celulas/logistica`.
   */
  iniciativas: IniciativaTablero[];
};

export function mapaEtapas(): MapaEtapas {
  const etapaPorCodigo: Record<string, string> = {};
  const slugPorCodigo: Record<string, string> = {};

  const iniciativas: IniciativaTablero[] = proyectos.map((p) => {
    // Las dos llaves apuntan a la misma iniciativa: da igual con cuál de los
    // dos códigos esté guardada la fila, la tarjeta recibe su etapa y su enlace.
    const codigos = [p.codigo, p.codigoDarwin]
      .filter(Boolean)
      .map((c) => (c as string).toUpperCase());

    for (const codigo of codigos) {
      etapaPorCodigo[codigo] = p.etapa;
      slugPorCodigo[codigo] = p.slug;
    }

    return { slug: p.slug, nombre: p.nombre, etapa: p.etapa, codigos, destacado: p.destacado };
  });

  const chips = etapas.map((e) => ({
    n: e.n,
    nombre: e.nombre,
    total: iniciativas.filter((p) => p.etapa === e.nombre).length,
  }));

  return { chips, etapaPorCodigo, slugPorCodigo, iniciativas };
}
