// Lectura de direcciones colombianas y construcción de la CLAVE DE VÍA.
//
// La normalización es la misma que usa `recolecciones/pipeline/geo.js`; lo que cambia es qué
// se extrae: allá bastaba la vía, acá hace falta TAMBIÉN el número generador (el segundo),
// porque es el que identifica la vía que cruza y permite resolver la dirección como una
// intersección.
//
// LA CLAVE VIVE AQUÍ, no en osm.js, y las dos puntas la piden a esta función. Si cada lado
// armara la suya, bastaría un cambio en un patrón para que dejaran de casar — y el fallo no
// sería un error sino una caída silenciosa de cobertura.
//
// POR QUÉ IMPORTA LA LETRA (medido, no supuesto). Antes se descartaba con `[A-Z]{0,2}` sin
// capturar, así que "Calle 137B" y "Calle 137" caían en la misma clave. En Bogotá el 45,9%
// de las direcciones traen letra (107.930 de 235.310) y OSM sí las distingue: "Carrera 78B",
// "78D", "78F" y "78H" son vías distintas del mismo sector. Colapsarlas era la causa
// principal del 27,4% de errores gruesos de Bogotá — medido: "Calle 80 # 100-20" se resolvía
// en Bosa en vez de Engativá, ~10 km.
const EJE = { CALLE: 'C', DIAGONAL: 'C', AVENIDA: 'C', CARRERA: 'K', TRANSVERSAL: 'K' };

function norm(s) {
  return (s || '').toUpperCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\bKRA?\b|\bCRA?\b|\bCR\b|\bKR\b/g, 'CARRERA')
    .replace(/\bCLL?E?\b|\bCL\b/g, 'CALLE')
    .replace(/\bAVDA?\b|\bAV\b/g, 'AVENIDA')
    .replace(/\bDG\b|\bDIAG\b/g, 'DIAGONAL')
    .replace(/\bTV\b|\bTRANSV\b/g, 'TRANSVERSAL')
    .replace(/\bNO\.?(?=\s|\d)|\bNUM(ERO)?\.?(?=\s|\d)|N°/g, '#')
    .replace(/\s+/g, ' ').trim();
}

// Sufijo cardinal -> una letra. Antes Sur y Oeste se marcaban IGUAL ('S'), lo que fundía
// "Calle 5 Sur" con "Calle 5 Oeste": en Cali, donde Oeste y Norte son nomenclatura central,
// eso mezclaba media ciudad.
const SUF = { SUR: 'S', ESTE: 'E', OESTE: 'O', NORTE: 'N' };

// Clave específica: distingue letra, Bis y cardinal.  "Calle 137B" -> C137B
//                                                     "Calle 7A Bis" -> C7A*
//                                                     "Calle 48C Sur" -> C48CS
// Clave base: sólo número y cardinal.                 "Calle 137B" -> C137
// La base conserva el cardinal a propósito: "Calle 48 Sur" y "Calle 48" son vías distintas.
function clave(eje, n, letra, bis, suf) {
  return eje + n + (letra || '') + (bis ? '*' : '') + (suf || '');
}
function claveBase(eje, n, suf) {
  return eje + n + (suf || '');
}

// El `(?![A-Z])` evita que la letra se coma la inicial de la palabra siguiente: sin él,
// "CALLE 7 BIS" leería letra='B' y luego fallaría al buscar "BIS", y "CALLE 7 SUR" leería
// letra='S'. Con el veto, sólo captura una letra que de verdad va suelta.
const L = '([A-Z]{1,2}(?![A-Z]))?';
const RE_DIR = new RegExp(
  '\\b(CALLE|CARRERA|AVENIDA|DIAGONAL|TRANSVERSAL)\\s*(\\d{1,3})\\s*' + L + '\\s*(BIS)?\\s*(SUR|ESTE|OESTE|NORTE)?' +
  '\\s*#?\\s*(?:(\\d{1,3})\\s*' + L + '\\s*(BIS)?\\s*(SUR|ESTE|OESTE|NORTE)?' +
  '\\s*[-–#]?\\s*(\\d{1,3})?)?');

// "CALLE 137B # 153A-53" -> { via:'CALLE', n:137, letra:'B', gen:153, genLetra:'A', placa:53 }
function parseDir(dir) {
  const a = norm(dir);
  const m = RE_DIR.exec(a);
  if (!m) return null;
  // "sur" puede ir pegado a la vía ("CALLE 50 SUR") o más adelante ("CALLE 50 # 12-30 SUR")
  const hasta = (m.index || 0) + m[0].length;
  const suf = SUF[m[5]] || (/\b\d{1,3}\s*SUR\b/.test(a.slice(0, hasta)) ? 'S' : '');
  return {
    via: m[1], n: +m[2], letra: m[3] || '', bis: !!m[4], suf,
    gen: m[6] ? +m[6] : null, genLetra: m[7] || '', genBis: !!m[8], genSuf: SUF[m[9]] || '',
    placa: m[10] ? +m[10] : null,
  };
}

// Claves de la dirección, de la más específica a la más laxa. `ubicar` las prueba en este
// orden y se queda con el primer cruce: así la letra sólo puede AÑADIR precisión, nunca
// quitar cobertura — si no hay cruce con letra, se reintenta sin ella.
function clavesDe(p) {
  const ejeA = EJE[p.via] || 'K', ejeB = ejeA === 'C' ? 'K' : 'C';
  const via = [], gen = [];
  const push = (arr, v) => { if (v && !arr.includes(v)) arr.push(v); };

  if (p.letra || p.bis) push(via, clave(ejeA, p.n, p.letra, p.bis, p.suf));
  push(via, claveBase(ejeA, p.n, p.suf));
  // Red de seguridad histórica: mucha dirección omite el "Sur" que la vía sí lleva (y al
  // revés). Se prueba también el cardinal opuesto, siempre después de lo específico.
  push(via, claveBase(ejeA, p.n, p.suf === 'S' ? '' : 'S'));

  if (p.gen != null) {
    if (p.genLetra || p.genBis) push(gen, clave(ejeB, p.gen, p.genLetra, p.genBis, p.genSuf));
    push(gen, claveBase(ejeB, p.gen, p.genSuf));
    push(gen, claveBase(ejeB, p.gen, p.genSuf === 'S' ? '' : 'S'));
  }
  return { via, gen };
}

module.exports = { norm, parseDir, clave, claveBase, clavesDe, EJE, SUF, L };
