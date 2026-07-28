// Mide el error real del índice de nomenclatura contra Nominatim, usando direcciones
// REALES del dataset (no puntos de referencia de memoria, que fue como se coló un error
// de 2 km en Cali que resultó ser de la referencia, no del índice).
//
//   node validar-osm.js [n_por_ciudad]      # por defecto 150
//
// Nominatim: 1 req/s y User-Agent identificado, según su política de uso. Reanudable:
// lo ya consultado queda en validacion-cache.json.
//
// Sólo se comparan las direcciones que Nominatim resuelve a calle o mejor Y que caen
// dentro del bbox de la ciudad. Un geocodificador que devuelve el centroide del municipio
// no sirve como patrón de medida.
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { CIUDADES, crearIndice } = require('./osm.js');

const N = +(process.argv[2] || 150);
const CACHE = path.join(__dirname, 'validacion-cache.json');
const UA = 'dropi-logistica-samedaymap/1.0 (producto@dropi.co)';
const sleep = ms => new Promise(r => setTimeout(r, ms));

const hav = (a, b, c, d) => { const R = 6371000, t = x => x * Math.PI / 180;
  const dp = t(c - a), dl = t(d - b);
  const h = Math.sin(dp / 2) ** 2 + Math.cos(t(a)) * Math.cos(t(c)) * Math.sin(dl / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h))); };

// Recorte de ruido: apartamento, torre, barrio, referencias… (de geocode2.js)
const RUIDO = /\b(APTO?|APARTAMENTO|OFC|OFICINA|LOCAL|BODEGA|PISO|TORRE|BLOQUE|BL|INT|INTERIOR|CASA|MZ|MANZANA|ETAPA|CONJUNTO|EDIFICIO|EDIF|CC|CENTRO COMERCIAL|MODULO|SOTANO|BARRIO|BRR?|URB|URBANIZACION)\b.*$/i;
function limpiar(addr) {
  let a = (addr || '').toUpperCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/\bKRA?\b|\bCRA?\b|\bCR\b|\bKR\b/g, 'CARRERA')
    .replace(/\bCLL?E?\b|\bCL\b/g, 'CALLE')
    .replace(/\bAVDA?\b|\bAV\b/g, 'AVENIDA')
    .replace(/\bNO\.?(?=\s|\d)|\bNUM(ERO)?\.?(?=\s|\d)|N°/g, '#')
    .replace(/\s+/g, ' ').trim();
  const m = a.match(/\b(CALLE|CARRERA|AVENIDA|DIAGONAL|TRANSVERSAL)\b/);
  if (m && m.index !== undefined) {
    const cortado = a.slice(m.index).replace(RUIDO, '').trim();
    if (cortado.length >= 6) a = cortado;
  }
  return a.replace(/[,;.\-]+$/, '').trim();
}

const { parseDir } = require('./direccion.js');

const cache = fs.existsSync(CACHE) ? JSON.parse(fs.readFileSync(CACHE, 'utf8')) : {};
const BUENOS = new Set(['building', 'house', 'road', 'residential', 'amenity', 'shop', 'place']);

async function nominatim(q) {
  const u = new URL('https://nominatim.openstreetmap.org/search');
  u.searchParams.set('q', q);
  u.searchParams.set('format', 'json');
  u.searchParams.set('limit', '1');
  u.searchParams.set('countrycodes', 'co');
  u.searchParams.set('addressdetails', '1');
  const r = await fetch(u, { headers: { 'User-Agent': UA } });
  if (r.status === 429) { await sleep(5000); return nominatim(q); }
  if (!r.ok) return null;
  const j = await r.json();
  if (!Array.isArray(j) || !j.length) return null;
  const h = j[0];
  return { lat: +h.lat, lng: +h.lon, tipo: h.addresstype || h.type };
}

const pct = (a, p) => a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : null;

(async () => {
  // muestra determinista: 1 de cada K, para que dos corridas comparen lo mismo
  const muestra = { BOGOTA: [], MEDELLIN: [], CALI: [] };
  const vistas = { BOGOTA: 0, MEDELLIN: 0, CALI: 0 };
  const rl = readline.createInterface({ input: fs.createReadStream(path.join(__dirname, 'ordenes.ndjson')), crlfDelay: Infinity });
  for await (const linea of rl) {
    if (!linea) continue;
    const o = JSON.parse(linea);
    if (!muestra[o.ciudad]) continue;
    vistas[o.ciudad]++;
    if (vistas[o.ciudad] % 97 === 0 && muestra[o.ciudad].length < N) muestra[o.ciudad].push(o.direccion);
  }

  const resumen = {};
  for (const ciudad of Object.keys(muestra)) {
    const ix = crearIndice(ciudad);
    const errs = { cruce: [], cercania: [] };
    let comparadas = 0, sinRef = 0, refMala = 0, sinIndice = 0;

    for (let i = 0; i < muestra[ciudad].length; i++) {
      const dir = muestra[ciudad][i];
      const p = parseDir(dir);
      if (!p) continue;
      const mio = ix.ubicar(p);
      if (!mio || mio.prec === 'via') { sinIndice++; continue; }

      const q = `${limpiar(dir)}, ${ciudad}, Colombia`;
      if (!(q in cache)) {
        try { cache[q] = await nominatim(q); } catch { cache[q] = null; }
        fs.writeFileSync(CACHE, JSON.stringify(cache));
        await sleep(1100);
        if ((i + 1) % 25 === 0) console.log(`  ${ciudad} ${i + 1}/${muestra[ciudad].length}`);
      }
      const ref = cache[q];
      if (!ref) { sinRef++; continue; }
      if (!ix.dentro(ref) || !BUENOS.has(ref.tipo)) { refMala++; continue; }
      errs[mio.prec].push(hav(ref.lat, ref.lng, mio.lat, mio.lng));
      comparadas++;
    }

    const todos = [...errs.cruce, ...errs.cercania].sort((a, b) => a - b);
    errs.cruce.sort((a, b) => a - b);
    resumen[ciudad] = {
      comparadas, sin_referencia: sinRef, referencia_descartada: refMala, sin_indice: sinIndice,
      error_mediano_m: pct(todos, 0.5), p75_m: pct(todos, 0.75), p90_m: pct(todos, 0.9),
      error_mediano_cruce_m: pct(errs.cruce, 0.5), n_cruce: errs.cruce.length,
    };
    console.log(`\n${ciudad}: ${comparadas} comparables de ${muestra[ciudad].length}`);
    console.log(`  error mediano ${pct(todos, 0.5)} m · p75 ${pct(todos, 0.75)} m · p90 ${pct(todos, 0.9)} m`);
    console.log(`  sólo 'cruce' (n=${errs.cruce.length}): mediano ${pct(errs.cruce, 0.5)} m`);
    console.log(`  descartadas: sin respuesta ${sinRef} · referencia imprecisa ${refMala} · sin índice ${sinIndice}`);
  }

  const f = path.join(__dirname, 'validacion.json');
  fs.writeFileSync(f, JSON.stringify({ generado: new Date().toISOString().slice(0, 10), muestra_por_ciudad: N, patron: 'Nominatim/OSM', resumen }, null, 1));
  console.log('\n->', f);
})();
