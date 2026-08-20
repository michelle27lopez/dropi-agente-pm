import type { FilaCruda, FilaEncuesta, FilaEvento, FilaModalOTour, Segmento } from "./tipos";

// Parsers por tipo de archivo. Reglas tomadas de esquema_medicion_onboarding_
// brands.md §10.4 (gotchas confirmados al procesar el archivo real):
//   - "-" es null, no texto.
//   - Timestamps se normalizan quitando el offset de zona horaria (se asume
//     que todo ya viene en hora Colombia) para poder comparar fechas entre
//     archivos sin arrastrar un offset mixto.
//   - User ID duplicado en la encuesta: quedarse con la fila de Submitted At
//     más reciente.
//   - Nunca cruzar ni deduplicar por Name — solo por User ID.

function limpiarNulo(valor: unknown): string | null {
  if (valor === null || valor === undefined) return null;
  const texto = String(valor).trim();
  if (texto === "" || texto === "-") return null;
  return texto;
}

/** Quita el offset de timezone (ej. "-05:00") asumiendo hora Colombia ya local. */
export function normalizarFecha(valor: unknown): string | null {
  const texto = limpiarNulo(valor);
  if (!texto) return null;
  return texto.replace(/([+-]\d{2}:\d{2}|Z)$/, "");
}

function numeroOCero(valor: unknown): number {
  const texto = limpiarNulo(valor);
  if (!texto) return 0;
  const n = Number(texto);
  return Number.isFinite(n) ? n : 0;
}

function userIdDe(fila: FilaCruda): number | null {
  const crudo = fila["User ID"] ?? fila["user_id"] ?? fila["userId"];
  const texto = limpiarNulo(crudo);
  if (!texto) return null;
  const n = Number(texto);
  return Number.isFinite(n) ? n : null;
}

/** ¿Cómo quieres usar Dropi? → segmento Marca/Proveedor. */
function segmentoDeRespuesta(valor: unknown): Segmento | null {
  const texto = limpiarNulo(valor);
  if (!texto) return null;
  if (/^marca\s*:/i.test(texto)) return "marca";
  if (/^proveedor\s*:/i.test(texto)) return "proveedor";
  return null;
}

/**
 * Segmento de una fila de Encuesta — a pedido de Kate (06-ago-2026): "no
 * quiero que vuelva a pasar, no debe salir en blanco la columna Segmento".
 * Primero intenta la columna conocida (rápido, caso normal); si el header
 * del CSV varía (numeración de pregunta distinta, mojibake no previsto,
 * export con otra codificación), escanea TODAS las columnas de la fila por
 * la primera que arranque con "Marca:"/"Proveedor:" — el prefijo de la
 * respuesta es el dato real, no depende de acertarle al nombre de columna.
 */
function segmentoDeFila(fila: FilaCruda): Segmento | null {
  const directo = fila["1.¿Cómo quieres usar Dropi?"] ?? fila["1.Â¿CÃ³mo quieres usar Dropi?"];
  const segmentoDirecto = segmentoDeRespuesta(directo);
  if (segmentoDirecto) return segmentoDirecto;
  for (const valor of Object.values(fila)) {
    const segmento = segmentoDeRespuesta(valor);
    if (segmento) return segmento;
  }
  return null;
}

/**
 * Parsea la Encuesta y aplica la regla de dedup: si un User ID aparece más
 * de una vez, se queda con la fila de Submitted At más reciente.
 */
export function parsearEncuesta(filas: FilaCruda[]): FilaEncuesta[] {
  const porUsuario = new Map<number, FilaEncuesta>();

  for (const fila of filas) {
    const userId = userIdDe(fila);
    if (userId === null) continue;

    const submittedAt = normalizarFecha(fila["Submitted At"]);
    if (!submittedAt) continue;

    const signedUp = normalizarFecha(fila["Signed Up"]);
    if (!signedUp) continue;

    const candidato: FilaEncuesta = {
      userId,
      nombre: limpiarNulo(fila["Full Name"] ?? fila["Name"]) ?? "",
      submittedAt,
      signedUp,
      segmento: segmentoDeFila(fila),
      ventasMesDeclaradas: limpiarNulo(
        fila["7.¿Cuántas ventas realiza tu marca al mes?"] ?? fila["7.Â¿CuÃ¡ntas ventas realiza tu marca al mes?"]
      ),
      email: limpiarNulo(fila["Email"]),
    };

    // Se queda con la fila más reciente, pero sin dejar que un segmento/
    // ventas en blanco de esa fila más nueva borre un valor ya bueno de una
    // fila vieja del mismo User ID duplicado — mismo criterio que
    // combinarFilaEncuesta en rawData.ts (a pedido de Kate, 06-ago-2026).
    const existente = porUsuario.get(userId);
    if (!existente) {
      porUsuario.set(userId, candidato);
    } else if (candidato.submittedAt > existente.submittedAt) {
      porUsuario.set(userId, {
        ...candidato,
        segmento: candidato.segmento ?? existente.segmento,
        ventasMesDeclaradas: candidato.ventasMesDeclaradas ?? existente.ventasMesDeclaradas,
      });
    } else {
      porUsuario.set(userId, {
        ...existente,
        segmento: existente.segmento ?? candidato.segmento,
        ventasMesDeclaradas: existente.ventasMesDeclaradas ?? candidato.ventasMesDeclaradas,
      });
    }
  }

  return [...porUsuario.values()];
}

/** Parsea un archivo Modal o Tour (Total Seen/Dismissed/Completed). */
export function parsearModalOTour(filas: FilaCruda[]): FilaModalOTour[] {
  const resultado: FilaModalOTour[] = [];
  for (const fila of filas) {
    const userId = userIdDe(fila);
    if (userId === null) continue;
    resultado.push({
      userId,
      totalSeen: numeroOCero(fila["Total Seen"]),
      totalDismissed: numeroOCero(fila["Total Dismissed"]),
      totalCompleted: numeroOCero(fila["Total Completed"]),
      lastCompleted: normalizarFecha(fila["Last Completed"]),
      lastDismissed: normalizarFecha(fila["Last Dismissed"]),
    });
  }
  return resultado;
}

/** Parsea un archivo Evento (Total Occurrences / First / Last Occurred). */
export function parsearEvento(filas: FilaCruda[]): FilaEvento[] {
  const resultado: FilaEvento[] = [];
  for (const fila of filas) {
    const userId = userIdDe(fila);
    if (userId === null) continue;
    resultado.push({
      userId,
      totalOcurrencias: numeroOCero(fila["Total Occurrences"]),
      firstOccurred: normalizarFecha(fila["First Occurred"]),
      lastOccurred: normalizarFecha(fila["Last Occurred"]),
    });
  }
  return resultado;
}
