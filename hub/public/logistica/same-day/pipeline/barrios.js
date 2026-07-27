// Barrios de OpenStreetMap (place=suburb/neighbourhood/quarter) por ciudad.
//
// Sirven para dos cosas distintas y hay que mantenerlas separadas:
//
//  1. PISTA — casi la mitad de las direcciones traen escrito su barrio. Ese texto es
//     información real del cliente y desempata entre vías homónimas: hay varias
//     "Calle 80 × Carrera 100" en Bogotá, pero si la dirección dice "Engativá" ya
//     sabemos cuál. Es lo que corrige la cola larga de Bogotá.
//
//  2. VALIDACIÓN — medir a qué distancia del barrio nombrado quedó el punto.
//
// Usar el mismo barrio para las dos cosas sería circular: el punto quedaría cerca del
// barrio porque lo pusimos ahí. Por eso el 20% de los nombres queda APARTADO: nunca se
// usa como pista, y es el único con el que se valida. Es validación cruzada estándar y
// el reparto es determinista (hash del nombre), así que dos corridas comparan lo mismo.
const fs = require('fs');
const path = require('path');

const limpia = s => (s || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
  .replace(/[^A-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

// Nombres tan comunes que aparecerían dentro de cualquier dirección sin identificar nada.
const GENERICOS = new Set(['CENTRO', 'EL CENTRO', 'LA ESPERANZA', 'EL PORVENIR', 'LA UNION', 'SAN JOSE',
  'EL PARAISO', 'LA PAZ', 'EL PROGRESO', 'BUENOS AIRES', 'LA FLORESTA', 'EL JARDIN', 'VILLA NUEVA',
  'EL RECUERDO', 'SANTA ANA', 'SAN LUIS', 'LA VICTORIA', 'EL BOSQUE', 'LOS ALPES', 'EL PRADO']);

const APARTADO = 5;                     // 1 de cada 5 nombres se aparta para validar
function hash(s) { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
const esApartado = n => hash(n) % APARTADO === 0;

const km = (a, b, c, d) => Math.hypot((a - c) * 110.574, (b - d) * 111.32 * Math.cos(a * Math.PI / 180));

function cargar(ciudad) {
  const f = path.join(__dirname, `barrios-${ciudad.toLowerCase()}.json`);
  if (!fs.existsSync(f)) return null;

  const puntos = new Map();
  for (const e of JSON.parse(fs.readFileSync(f, 'utf8')).elements || []) {
    const n = limpia(e.tags?.name);
    const lat = e.lat ?? e.center?.lat, lng = e.lon ?? e.center?.lon;
    if (!n || n.length < 6 || GENERICOS.has(n) || lat == null) continue;
    if (!puntos.has(n)) puntos.set(n, []);
    puntos.get(n).push([lat, lng]);
  }

  const info = new Map();
  for (const [n, ps] of puntos) {
    // Si el nombre está repartido por la ciudad no sirve de pista: no sabríamos a cuál
    // se refiere. Se conserva para validar, pero sin usarlo para ubicar.
    const disperso = ps.some(p => ps.some(q => km(p[0], p[1], q[0], q[1]) > 3));
    const centro = [ps.reduce((s, p) => s + p[0], 0) / ps.length, ps.reduce((s, p) => s + p[1], 0) / ps.length];
    info.set(n, { puntos: ps, centro, disperso, apartado: esApartado(n) });
  }
  // Más largo primero: gana el nombre más específico ("VILLA LUZ" sobre "VILLA").
  const nombres = [...info.keys()].sort((a, b) => b.length - a.length);

  return {
    total: info.size,
    apartados: [...info.values()].filter(v => v.apartado).length,
    limpia,
    // Primer barrio reconocido dentro del texto de la dirección.
    buscar(texto) {
      const t = limpia(texto);
      for (const n of nombres) if (t.includes(n)) return { nombre: n, ...info.get(n) };
      return null;
    },
    // Pista utilizable para ubicar: null si el barrio está apartado o disperso.
    pista(texto) {
      const b = this.buscar(texto);
      return b && !b.apartado && !b.disperso ? b.centro : null;
    },
  };
}

const archivo = c => path.join(__dirname, `barrios-${c.toLowerCase()}.json`);

async function descargar(ciudad) {
  const { CIUDADES } = require('./osm.js');
  const bbox = CIUDADES[ciudad].bbox.join(',');
  const q = `[out:json][timeout:180];
(node["place"~"^(suburb|neighbourhood|quarter)$"](${bbox});way["place"~"^(suburb|neighbourhood|quarter)$"](${bbox}););
out center;`;
  const servidores = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
  for (let i = 0; i < 3; i++) {
    for (const srv of servidores) {
      try {
        const r = await fetch(srv, { method: 'POST',
          headers: { 'User-Agent': 'dropi-logistica-samedaymap/1.0 (producto@dropi.co)' },
          body: new URLSearchParams({ data: q }) });
        if (!r.ok) { console.log(`    HTTP ${r.status}`); continue; }
        const t = await r.text();
        fs.writeFileSync(archivo(ciudad), t);
        console.log(`  ${ciudad}: ${(JSON.parse(t).elements || []).length} barrios -> cache`);
        return;
      } catch (e) { console.log('    ', e.message); }
    }
    await new Promise(r => setTimeout(r, 20000));
  }
  throw new Error('Overpass no respondió para barrios de ' + ciudad);
}

module.exports = { cargar, limpia, archivo };

if (require.main === module && process.argv.includes('--fetch')) {
  (async () => {
    for (const c of ['BOGOTA', 'MEDELLIN', 'CALI']) {
      if (fs.existsSync(archivo(c)) && !process.argv.includes('--force')) { console.log(`  ${c}: cache ya existe`); continue; }
      await descargar(c);
      await new Promise(r => setTimeout(r, 6000));
    }
  })();
}
