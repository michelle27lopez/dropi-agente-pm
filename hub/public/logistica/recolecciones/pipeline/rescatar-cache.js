// Una sola vez: extrae las coordenadas ya geocodificadas del datos-recolecciones.json
// vigente y las guarda como cache propio, para que sobrevivan a la regeneración.
// El cache se llavea por warehouse_id y guarda la DIRECCIÓN con la que se resolvió:
// si la dirección cambia en un export futuro, la coord deja de valer y hay que
// re-geocodificar esa bodega (regla del roadmap).
const fs = require('fs');

const SALIDA = 'geocache-coords.json';
const D = JSON.parse(fs.readFileSync('../datos-recolecciones.json', 'utf8'));
const cache = fs.existsSync(SALIDA) ? JSON.parse(fs.readFileSync(SALIDA, 'utf8')) : {};

let nuevas = 0;
for (const p of D.puntos) {
  // solo lo que es una ubicación resuelta: centroides y malla se recalculan siempre
  if (!p.geo || !p.geo.startsWith('geo')) continue;
  const k = String(p.id);
  if (cache[k]) continue;
  cache[k] = { lat: p.lat, lng: p.lng, geo: p.geo, dir: p.a, fuente: 'locationiq' };
  nuevas++;
}

fs.writeFileSync(SALIDA, JSON.stringify(cache, null, 1));
console.log(`cache: ${Object.keys(cache).length} bodegas (${nuevas} nuevas) -> ${SALIDA}`);
