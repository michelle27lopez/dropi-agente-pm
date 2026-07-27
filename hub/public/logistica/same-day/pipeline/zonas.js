// Zonas operativas: localidades (Bogotá) y comunas (Medellín, Cali), desde los límites
// administrativos de OpenStreetMap (admin_level=8). Descarga con:
//
//   node zonas.js --fetch
//
// Por qué la zona y no la celda: una ruta de reparto no se define por cuadras de 250 m.
// La localidad/comuna es la unidad con la que hablan la bodega y la transportadora, y
// además absorbe mejor el error de ubicación — un punto que se corre 500 m casi siempre
// sigue en la misma zona, mientras que cambia de celda.
const fs = require('fs');
const path = require('path');

const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.kumi.systems/api/interpreter'];
const UA = 'dropi-logistica-samedaymap/1.0 (producto@dropi.co)';
const { CIUDADES } = require('./osm.js');
const archivo = c => path.join(__dirname, `zonas-${c.toLowerCase()}.json`);
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function descargar(ciudad) {
  const q = `[out:json][timeout:240];
rel["boundary"="administrative"]["admin_level"="8"](${CIUDADES[ciudad].bbox.join(',')});
out geom;`;
  for (let i = 0; i < 3; i++) {
    for (const srv of OVERPASS) {
      try {
        const r = await fetch(srv, { method: 'POST', headers: { 'User-Agent': UA }, body: new URLSearchParams({ data: q }) });
        if (!r.ok) { console.log(`    HTTP ${r.status}`); continue; }
        fs.writeFileSync(archivo(ciudad), await r.text());
        console.log(`  ${ciudad}: zonas -> cache`);
        return;
      } catch (e) { console.log('    ', e.message); }
    }
    await sleep(20000);
  }
  throw new Error('Overpass no respondió para zonas de ' + ciudad);
}

// Une los tramos "outer" de una relación en anillos cerrados. Overpass los entrega
// sueltos y en cualquier orden/sentido, así que hay que coserlos por sus extremos.
function anillos(miembros, rol) {
  const tramos = miembros.filter(m => m.type === 'way' && (m.role || 'outer') === rol && m.geometry && m.geometry.length > 1)
    .map(m => m.geometry.map(p => [p.lon, p.lat]));
  const clave = p => p[0].toFixed(6) + ',' + p[1].toFixed(6);
  const libres = new Set(tramos.keys());
  const out = [];
  while (libres.size) {
    const i = libres.values().next().value;
    libres.delete(i);
    const anillo = [...tramos[i]];
    let creció = true;
    while (creció) {
      creció = false;
      for (const j of libres) {
        const t = tramos[j], fin = clave(anillo[anillo.length - 1]), ini = clave(anillo[0]);
        if (clave(t[0]) === fin) { anillo.push(...t.slice(1)); libres.delete(j); creció = true; break; }
        if (clave(t[t.length - 1]) === fin) { anillo.push(...t.slice(0, -1).reverse()); libres.delete(j); creció = true; break; }
        if (clave(t[t.length - 1]) === ini) { anillo.unshift(...t.slice(0, -1)); libres.delete(j); creció = true; break; }
        if (clave(t[0]) === ini) { anillo.unshift(...t.slice(1).reverse()); libres.delete(j); creció = true; break; }
      }
    }
    if (anillo.length >= 4) out.push(anillo);
  }
  return out;
}

const dentroAnillo = (x, y, a) => {
  let d = false;
  for (let i = 0, j = a.length - 1; i < a.length; j = i++) {
    if ((a[i][1] > y) !== (a[j][1] > y) &&
        x < (a[j][0] - a[i][0]) * (y - a[i][1]) / (a[j][1] - a[i][1]) + a[i][0]) d = !d;
  }
  return d;
};

// Limpia "Localidad Suba" -> "Suba"; deja "Comuna 14 - El Poblado" como está.
const bonito = n => (n || '(sin nombre)').replace(/^Localidad\s+/i, '').trim();

function cargar(ciudad) {
  if (!fs.existsSync(archivo(ciudad))) return null;
  const els = JSON.parse(fs.readFileSync(archivo(ciudad), 'utf8')).elements || [];
  const zonas = [];
  for (const e of els) {
    if (!e.members) continue;
    const out = anillos(e.members, 'outer');
    if (!out.length) continue;
    const inn = anillos(e.members, 'inner');
    let x0 = 180, y0 = 90, x1 = -180, y1 = -90;
    for (const a of out) for (const p of a) {
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    }
    zonas.push({ nombre: bonito(e.tags?.name), out, inn, caja: [x0, y0, x1, y1] });
  }
  return {
    zonas: zonas.map(z => z.nombre),
    ubicar(lat, lng) {
      for (const z of zonas) {
        if (lng < z.caja[0] || lng > z.caja[2] || lat < z.caja[1] || lat > z.caja[3]) continue;
        if (!z.out.some(a => dentroAnillo(lng, lat, a))) continue;
        if (z.inn.some(a => dentroAnillo(lng, lat, a))) continue;
        return z.nombre;
      }
      return null;
    },
    // contornos livianos para dibujar en el mapa (1 de cada N puntos)
    contornos: () => zonas.map(z => ({
      n: z.nombre,
      a: z.out.map(a => a.filter((_, i) => i % 3 === 0 || i === a.length - 1).map(p => [+p[1].toFixed(5), +p[0].toFixed(5)])),
    })),
  };
}

module.exports = { cargar, archivo };

if (require.main === module && process.argv.includes('--fetch')) {
  (async () => {
    for (const c of Object.keys(CIUDADES)) {
      if (fs.existsSync(archivo(c)) && !process.argv.includes('--force')) { console.log(`  ${c}: cache ya existe`); continue; }
      await descargar(c);
      await sleep(6000);
    }
  })();
}
