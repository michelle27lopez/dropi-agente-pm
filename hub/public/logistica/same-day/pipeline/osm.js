// Índice de nomenclatura por ciudad sobre geometría real de OpenStreetMap.
// Traduce "Calle 80 # 20-15" -> coordenada, sin geocodificador y sin cuota.
//
// Descarga (una vez; se cachea en osmgeom-<ciudad>.json):
//   node osm.js --fetch
//
// ---------------------------------------------------------------------------
// POR QUÉ ASÍ. Cuatro intentos; los tres primeros se descartaron CON MEDICIÓN, no
// por opinión. El banco de pruebas son intersecciones conocidas (ver validar.js).
//
// 1. Geocodificar cada dirección. Inviable: ~422.600 direcciones únicas a 1 req/s
//    son ~117 horas. Y de fondo no sirve: Nominatim resuelve "Calle 13, Cali" a UN
//    segmento cualquiera de los muchos con ese nombre (medido: puntos absurdos).
//
// 2. Recta lat = a + b·calle, la malla de `recolecciones/pipeline/geo.js`.
//    Medellín ajusta (R²=0,98) pero Bogotá se derrumba: carreras R²=0,32, error
//    típico 2,4 km. Bogotá no es una malla uniforme.
//
// 3. Posición mediana por número + regresión isotónica. También falla: para ordenar
//    las carreras de Bogotá hubo que corregir 1.603 m medianos. El dato no ordena.
//
// 4. LO QUE FUNCIONA: no preguntar dónde está la Carrera 50, sino DÓNDE SE CRUZA con
//    la Calle C. Un cruce es un hecho local y verificable. Con la geometría completa
//    de las vías el cruce se calcula exacto, y las sub-nomenclaturas se resuelven
//    solas: hay varias "Carrera 50" en Bogotá, pero sólo una cruza a la Calle 127.
//
// Cuando no hay cruce se dice, no se inventa: cada punto sale rotulado con su
// precisión ('cruce' | 'cercania' | 'via') y el mapa agrega sólo lo confiable.
// ---------------------------------------------------------------------------
const fs = require('fs');
const path = require('path');

const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const UA = 'dropi-logistica-samedaymap/1.0 (producto@dropi.co)';

// `nucleo` = centroide urbano DANE (los mismos de recolecciones/pipeline/geo.js).
// Sólo desempata vías homónimas; no ubica.
const CIUDADES = {
  BOGOTA:   { dane: '11001', bbox: [4.47, -74.24, 4.84, -73.99], nucleo: [4.6486, -74.0828] },
  MEDELLIN: { dane: '05001', bbox: [6.15, -75.66, 6.38, -75.49], nucleo: [6.2442, -75.5812] },
  CALI:     { dane: '76001', bbox: [3.32, -76.58, 3.50, -76.45], nucleo: [3.4516, -76.5320] },
};

const CELDA_M = 250;          // rejilla espacial y radio de union-find
const CERCA_M = 150;          // dos vías que no se tocan pero pasan a menos de esto
const archivo = c => path.join(__dirname, `osmgeom-${c.toLowerCase()}.json`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

// "Calle 80 A Sur" -> { clave: 'C80S' }. Diagonal se numera como calle; Transversal,
// como carrera (convención de Bogotá).
//
// El patrón NO se ancla al inicio del nombre a propósito: en OSM las arterias de Bogotá
// se llaman "Avenida Calle 26", "Avenida Carrera 30" (NQS), "Avenida Carrera 7". Anclando
// al inicio se perdían justo las vías más transitadas de la ciudad y las direcciones sobre
// ellas caían al fallback — medido: Calle 80 con Carrera 30 erraba 4,7 km.
// La clave la arma `direccion.js`, que es también quien lee las direcciones. Un solo sitio
// para las dos puntas: si divergieran, el índice dejaría de casar sin dar error.
const { clave: mkClave, claveBase, clavesDe, EJE, SUF, L } = require('./direccion.js');

// Mismo alfabeto que el lado de las direcciones: letra, Bis y cardinal cuentan.
// "Carrera 78B" y "Carrera 78H" son vías distintas del mismo sector y antes se fundían.
//
// "Avenida" NO entra en la alternancia, a propósito. En Bogotá es ambigua — "Avenida 68" es
// la Carrera 68, pero "Avenida Calle 26" es una calle — y EJE la mapea a 'C', así que
// admitirla metería la Avenida 68 dentro de la Calle 68. Las arterias siguen entrando por el
// patrón sin anclar: "Avenida Calle 26" encuentra "Calle 26" igual.
const RE_VIA = new RegExp(
  '(Calle|Carrera|Diagonal|Transversal) ?(\\d{1,3}) ?' + L + ' ?(Bis)? ?(Sur|Este|Oeste|Norte)?\\b', 'i');
function clasificar(nombre) {
  const m = RE_VIA.exec((nombre || '').trim());
  if (!m) return null;
  const n = +m[2];
  if (n < 1 || n > 250) return null;
  const eje = EJE[m[1].toUpperCase()];
  const letra = (m[3] || '').toUpperCase();
  const suf = SUF[(m[5] || '').toUpperCase()] || '';
  return { clave: mkClave(eje, n, letra, !!m[4], suf), base: claveBase(eje, n, suf) };
}

async function descargar(ciudad) {
  const { bbox } = CIUDADES[ciudad];
  // Bogotá no cabe en una sola consulta (Overpass devuelve 504): se parte en cuadrantes.
  const cajas = ciudad === 'BOGOTA'
    ? [[bbox[0], bbox[1], (bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2],
       [bbox[0], (bbox[1] + bbox[3]) / 2, (bbox[0] + bbox[2]) / 2, bbox[3]],
       [(bbox[0] + bbox[2]) / 2, bbox[1], bbox[2], (bbox[1] + bbox[3]) / 2],
       [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2, bbox[2], bbox[3]]]
    : [bbox];
  const vistos = new Map();
  for (const caja of cajas) {
    const q = `[out:json][timeout:300];
way["highway"]["name"~"(Calle|Carrera|Diagonal|Transversal) ?[0-9]"](${caja.join(',')});
out geom;`;
    let ok = false;
    for (let i = 0; i < 3 && !ok; i++) {
      for (const srv of OVERPASS) {
        try {
          const r = await fetch(srv, { method: 'POST', headers: { 'User-Agent': UA }, body: new URLSearchParams({ data: q }) });
          if (!r.ok) { console.log(`    HTTP ${r.status} en ${new URL(srv).host}`); continue; }
          for (const e of (await r.json()).elements || []) if (!vistos.has(e.id)) vistos.set(e.id, e);
          ok = true; break;
        } catch (e) { console.log('    ', e.message); }
      }
      if (!ok) await sleep(25000);
    }
    if (!ok) throw new Error(`Overpass no respondió para ${ciudad} ${caja}`);
    await sleep(5000);
  }
  fs.writeFileSync(archivo(ciudad), JSON.stringify({ elements: [...vistos.values()] }));
  console.log(`  ${ciudad}: ${vistos.size.toLocaleString('es-CO')} vías -> cache`);
}

// Intersección de dos segmentos en el plano (x = lng, y = lat). El achatamiento por
// latitud es una transformación afín y no cambia SI se cruzan, así que sobra corregirlo.
function corte(ax, ay, bx, by, cx, cy, dx, dy) {
  const rx = bx - ax, ry = by - ay, sx = dx - cx, sy = dy - cy;
  const den = rx * sy - ry * sx;
  if (Math.abs(den) < 1e-14) return null;
  const t = ((cx - ax) * sy - (cy - ay) * sx) / den;
  const u = ((cx - ax) * ry - (cy - ay) * rx) / den;
  if (t < 0 || t > 1 || u < 0 || u > 1) return null;
  return [ax + t * rx, ay + t * ry];
}

// Distancia mínima punto-segmento, en grados (se usa sólo para comparar).
function distPS(px, py, ax, ay, bx, by) {
  const dx = bx - ax, dy = by - ay, l2 = dx * dx + dy * dy;
  const t = l2 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / l2)) : 0;
  return Math.hypot(px - (ax + t * dx), py - (ay + t * dy));
}

function crearIndice(ciudad) {
  const { bbox, nucleo } = CIUDADES[ciudad];
  const els = JSON.parse(fs.readFileSync(archivo(ciudad), 'utf8')).elements;
  const latMed = (bbox[0] + bbox[2]) / 2;
  const kx = 111.320 * Math.cos(latMed * Math.PI / 180), ky = 110.574;   // km por grado
  const dLat = CELDA_M / 1000 / ky, dLng = CELDA_M / 1000 / kx;

  // --- 1. segmentos por clave de vía ---
  const segs = new Map();                        // clave -> [ [x1,y1,x2,y2], ... ]
  // Cada vía se indexa DOS veces: bajo su clave específica ("K78B") y bajo la base ("K78").
  // Así la base sigue conteniendo exactamente lo de antes —la cobertura no puede bajar— y la
  // específica permite resolver el cruce sin mezclar la Carrera 78B con la 78H.
  for (const e of els) {
    const c = clasificar(e.tags?.name);
    if (!c || !e.geometry || e.geometry.length < 2) continue;
    for (const k of (c.clave === c.base ? [c.clave] : [c.clave, c.base])) {
      let a = segs.get(k);
      if (!a) segs.set(k, a = []);
      for (let i = 1; i < e.geometry.length; i++)
        a.push([e.geometry[i - 1].lon, e.geometry[i - 1].lat, e.geometry[i].lon, e.geometry[i].lat]);
    }
  }

  // --- 2. trazos: un nombre puede repetirse en barrios distintos (la "Calle 44" de
  // Medellín y la de Bello). Se separan por conectividad espacial: cada componente
  // conexa es una vía real. Sin esto el cruce se resolvía en el municipio equivocado.
  const indice = new Map();                      // clave -> { trazos:[{cel:Map, largo}] }
  for (const [clave, lista] of segs) {
    const padre = lista.map((_, i) => i);
    const raiz = i => { while (padre[i] !== i) i = padre[i] = padre[padre[i]]; return i; };
    const une = (i, j) => { const a = raiz(i), b = raiz(j); if (a !== b) padre[a] = b; };

    const enCelda = new Map();                   // "i:j" -> [idx de segmento]
    lista.forEach((s, idx) => {
      // el segmento se registra en las celdas de sus extremos y su punto medio
      for (const [x, y] of [[s[0], s[1]], [s[2], s[3]], [(s[0] + s[2]) / 2, (s[1] + s[3]) / 2]]) {
        const k = Math.round(y / dLat) + ':' + Math.round(x / dLng);
        let a = enCelda.get(k);
        if (!a) enCelda.set(k, a = []);
        if (a[a.length - 1] !== idx) a.push(idx);
      }
    });
    for (const [k, a] of enCelda) {
      for (let i = 1; i < a.length; i++) une(a[0], a[i]);
      const [ci, cj] = k.split(':').map(Number);
      for (let p = -1; p <= 1; p++) for (let q = -1; q <= 1; q++) {
        const v = enCelda.get((ci + p) + ':' + (cj + q));
        if (v) une(a[0], v[0]);
      }
    }

    const porTrazo = new Map();
    lista.forEach((s, idx) => {
      const r = raiz(idx);
      let t = porTrazo.get(r);
      if (!t) porTrazo.set(r, t = { cel: new Map(), largo: 0 });
      t.largo += Math.hypot((s[2] - s[0]) * kx, (s[3] - s[1]) * ky);
      const k = Math.round(((s[1] + s[3]) / 2) / dLat) + ':' + Math.round(((s[0] + s[2]) / 2) / dLng);
      let c = t.cel.get(k);
      if (!c) t.cel.set(k, c = []);
      c.push(s);
    });
    indice.set(clave, [...porTrazo.values()].sort((a, b) => b.largo - a.largo));
  }

  const distKm = (la, lo) => Math.hypot((la - nucleo[0]) * ky, (lo - nucleo[1]) * kx);
  const memo = new Map();

  // Cruce entre dos claves de vía. Prueba trazo contra trazo; gana el candidato mejor
  // sostenido (trazo más largo), con castigo suave por lejanía al núcleo para desempatar
  // homónimos periféricos.
  function cruce(ca, cb, pista) {
    // Con pista el resultado depende de ella, así que entra a la clave del memo
    // (redondeada, para que direcciones del mismo barrio compartan cálculo).
    const mk = pista ? ca + '|' + cb + '@' + pista[0].toFixed(2) + ',' + pista[1].toFixed(2) : ca + '|' + cb;
    if (memo.has(mk)) return memo.get(mk);
    const A = indice.get(ca), B = indice.get(cb);
    let mejor = null, mejorPuntaje = -1;
    if (A && B) {
      for (const ta of A) for (const tb of B) {
        const tope = Math.min(ta.largo, tb.largo);
        if (tope * 4 < mejorPuntaje) continue;         // no puede ganar; se salta
        let pt = null, prec = null, mejorD = Infinity;
        for (const [k, sa] of ta.cel) {
          const [i, j] = k.split(':').map(Number);
          for (let p = -1; p <= 1 && !(pt && prec === 'cruce'); p++) for (let q = -1; q <= 1; q++) {
            const sb = tb.cel.get((i + p) + ':' + (j + q));
            if (!sb) continue;
            for (const s of sa) for (const t of sb) {
              const x = corte(s[0], s[1], s[2], s[3], t[0], t[1], t[2], t[3]);
              if (x) { pt = x; prec = 'cruce'; mejorD = 0; break; }
              // sin cruce real, se guarda el acercamiento más próximo
              const d = Math.min(distPS(s[0], s[1], t[0], t[1], t[2], t[3]), distPS(t[0], t[1], s[0], s[1], s[2], s[3]));
              if (d < mejorD) { mejorD = d; pt = [(s[0] + t[0]) / 2, (s[1] + t[1]) / 2]; prec = 'cercania'; }
            }
            if (pt && prec === 'cruce') break;
          }
          if (pt && prec === 'cruce') break;
        }
        if (!pt) continue;
        if (prec === 'cercania' && mejorD * Math.max(kx, ky) * 1000 > CERCA_M) continue;
        // Sin pista sólo se puede preferir el trazo mejor sostenido y algo céntrico. Con
        // pista (el barrio que la propia dirección menciona) el criterio es mucho más
        // fuerte: entre dos "Calle 80 × Carrera 100" gana la que está cerca del barrio
        // escrito. Es lo que corrige la cola larga de Bogotá, que tiene varias
        // nomenclaturas paralelas (Bosa, Suba, Ciudad Bolívar, Usme).
        const cerca = pista
          ? Math.hypot((pt[1] - pista[0]) * ky, (pt[0] - pista[1]) * kx)
          : distKm(pt[1], pt[0]);
        const puntaje = tope / (1 + cerca / (pista ? 1.5 : 25)) * (prec === 'cruce' ? 4 : 1);
        if (puntaje > mejorPuntaje) { mejorPuntaje = puntaje; mejor = { lat: pt[1], lng: pt[0], prec }; }
      }
    }
    memo.set(mk, mejor);
    return mejor;
  }

  // Sin cruce: centro del trazo más largo. Ubica un eje pero no el otro; se marca 'via'
  // para que el mapa pueda excluirlo en vez de mostrarlo como si fuera un punto real.
  const centroVia = (clave) => {
    const t = indice.get(clave);
    if (!t || !t.length) return null;
    let sx = 0, sy = 0, n = 0;
    for (const [, ss] of t[0].cel) for (const s of ss) { sx += (s[0] + s[2]) / 2; sy += (s[1] + s[3]) / 2; n++; }
    return n ? { lat: sy / n, lng: sx / n, prec: 'via' } : null;
  };

  return {
    ciudad, bbox, claves: indice.size,
    // `p` = objeto de `parseDir`. `pista` = [lat,lng] opcional del barrio nombrado en la
    // dirección, para desempatar entre vías homónimas. Ver `cruce`.
    //
    // Las claves vienen de `clavesDe` ordenadas de específica a laxa, y se prueban en
    // cascada: primero "C137B × K153A", y sólo si eso no cruza se afloja a "C137 × K153".
    // De ahí que la letra no pueda costar cobertura: en el peor caso se cae al
    // comportamiento anterior.
    ubicar(p, pista) {
      const { via, gen } = clavesDe(p);
      for (const x of via) for (const y of gen) { const r = cruce(x, y, pista); if (r) return r; }
      for (const x of via) { const c = centroVia(x); if (c) return c; }
      return null;
    },
    dentro: p => !!p && p.lat >= bbox[0] && p.lat <= bbox[2] && p.lng >= bbox[1] && p.lng <= bbox[3],
  };
}

module.exports = { CIUDADES, crearIndice, clasificar, archivo };

if (require.main === module && process.argv.includes('--fetch')) {
  (async () => {
    for (const c of Object.keys(CIUDADES)) {
      if (fs.existsSync(archivo(c)) && !process.argv.includes('--force')) { console.log(`  ${c}: cache ya existe`); continue; }
      await descargar(c);
    }
  })();
}
