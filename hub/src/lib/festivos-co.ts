// Festivos de Colombia calculados, no hardcodeados: la Ley Emiliani traslada
// buena parte de ellos al lunes siguiente, así que una lista fija se
// desactualiza cada año. Aquí se derivan de la fecha de Pascua (algoritmo
// gregoriano anónimo) más las reglas de traslado.

/** Domingo de Pascua del año dado, en hora local. */
export function pascua(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, mes - 1, dia);
}

function sumarDias(base: Date, dias: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + dias);
  return d;
}

/** Ley Emiliani: si no cae lunes, se traslada al lunes siguiente. */
function trasladarALunes(fecha: Date): Date {
  const dow = fecha.getDay(); // 0=domingo … 1=lunes
  if (dow === 1) return fecha;
  return sumarDias(fecha, (8 - dow) % 7);
}

function iso(fecha: Date): string {
  const y = fecha.getFullYear();
  const m = String(fecha.getMonth() + 1).padStart(2, "0");
  const d = String(fecha.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Set de festivos colombianos del año, como fechas 'YYYY-MM-DD'. */
export function festivosColombia(year: number): Set<string> {
  const p = pascua(year);

  // Fecha fija, sin traslado.
  const fijos: Array<[number, number]> = [
    [1, 1],   // Año Nuevo
    [5, 1],   // Día del Trabajo
    [7, 20],  // Independencia
    [8, 7],   // Batalla de Boyacá
    [12, 8],  // Inmaculada Concepción
    [12, 25], // Navidad
  ];

  // Fecha fija pero trasladable al lunes siguiente.
  const trasladables: Array<[number, number]> = [
    [1, 6],   // Reyes Magos
    [3, 19],  // San José
    [6, 29],  // San Pedro y San Pablo
    [8, 15],  // Asunción
    [10, 12], // Día de la Raza
    [11, 1],  // Todos los Santos
    [11, 11], // Independencia de Cartagena
  ];

  const fechas: Date[] = [];
  fijos.forEach(([m, d]) => fechas.push(new Date(year, m - 1, d)));
  trasladables.forEach(([m, d]) => fechas.push(trasladarALunes(new Date(year, m - 1, d))));

  // Relativos a Pascua, sin traslado.
  fechas.push(sumarDias(p, -3)); // Jueves Santo
  fechas.push(sumarDias(p, -2)); // Viernes Santo

  // Relativos a Pascua, trasladados al lunes.
  fechas.push(trasladarALunes(sumarDias(p, 39))); // Ascensión
  fechas.push(trasladarALunes(sumarDias(p, 60))); // Corpus Christi
  fechas.push(trasladarALunes(sumarDias(p, 68))); // Sagrado Corazón

  return new Set(fechas.map(iso));
}

export function esFestivo(fecha: Date): boolean {
  return festivosColombia(fecha.getFullYear()).has(iso(fecha));
}

/**
 * ¿Hoy toca mandar el recordatorio de arranque de sprint?
 *
 * La regla del negocio es "lunes en la mañana, o martes si el lunes es
 * festivo". Se generaliza a: el primer día hábil de la semana. Así también
 * queda cubierto el caso raro de lunes y martes festivos seguidos.
 */
export function esDiaDeRecordatorio(hoy: Date): boolean {
  const dow = hoy.getDay();
  if (dow === 0 || dow === 6) return false; // fin de semana
  if (esFestivo(hoy)) return false;

  // Es día de recordatorio si todos los días hábiles previos de esta semana
  // (desde el lunes) fueron festivos.
  for (let d = 1; d < dow; d++) {
    const previo = sumarDias(hoy, -(dow - d));
    if (!esFestivo(previo)) return false;
  }
  return true;
}

export { iso as fechaISO };
