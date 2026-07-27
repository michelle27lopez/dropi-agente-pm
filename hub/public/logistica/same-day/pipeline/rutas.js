// Grafo vial + Dijkstra: tiempo de viaje desde una bodega a TODA la ciudad.
//
// Por qué Dijkstra y no un servicio de rutas: una sola corrida desde la bodega deja el tiempo
// a todos los nodos a la vez, que es exactamente lo que hacen falta para isócronas y para la
// tabla por zona. Pedirle eso a una API serían miles de llamadas y cuota; acá son ~3 segundos,
// sin llave, sin Docker y reproducible.
//
// ⚠️ EL TIEMPO ES DE FLUJO LIBRE. El grafo no sabe de tráfico, semáforos ni pico y placa. Por
// eso todo sale multiplicado por un `factor` explícito que el simulador expone como deslizador:
// es un supuesto del usuario, no una constante escondida aquí.
const redVial = require('./red-vial.js');

const R = 6371000;
const rad = x => x * Math.PI / 180;

// Montículo binario de pares (prioridad, valor). Se necesita propio porque el grafo de Bogotá
// ronda el millón de nodos y ordenar un array en cada extracción no termina nunca.
class Monticulo {
  constructor() { this.p = []; this.v = []; }
  get tam() { return this.p.length; }
  meter(prio, val) {
    const p = this.p, v = this.v;
    let i = p.length; p.push(prio); v.push(val);
    while (i > 0) {
      const padre = (i - 1) >> 1;
      if (p[padre] <= p[i]) break;
      [p[padre], p[i]] = [p[i], p[padre]]; [v[padre], v[i]] = [v[i], v[padre]];
      i = padre;
    }
  }
  sacar() {
    const p = this.p, v = this.v, top = v[0], prio = p[0], ult = p.length - 1;
    p[0] = p[ult]; v[0] = v[ult]; p.pop(); v.pop();
    let i = 0;
    for (;;) {
      const iz = 2 * i + 1, de = iz + 1;
      let m = i;
      if (iz < p.length && p[iz] < p[m]) m = iz;
      if (de < p.length && p[de] < p[m]) m = de;
      if (m === i) break;
      [p[m], p[i]] = [p[i], p[m]]; [v[m], v[i]] = [v[i], v[m]];
      i = m;
    }
    return { prio, val: top };
  }
}

function construir(ciudad) {
  const d = redVial.cargar(ciudad);
  const [s, w, n, e] = d.bbox;
  const latMed = (s + n) / 2;
  const kx = 111320 * Math.cos(rad(latMed)), ky = 110574;      // metros por grado

  // --- nodos: la coordenada redondeada a 1e-6 ES la identidad. OSM comparte el vértice exacto
  // en los cruces, así que dos vías que se cortan caen en la misma clave sin tolerancias.
  const idDe = new Map();
  const xs = [], ys = [];
  const nodo = (lng, lat) => {
    const k = Math.round(lng * 1e6) + ',' + Math.round(lat * 1e6);
    let i = idDe.get(k);
    if (i === undefined) { i = xs.length; idDe.set(k, i); xs.push(lng); ys.push(lat); }
    return i;
  };

  // --- aristas en listas de adyacencia encadenadas (CSR "perezoso"): head/next/to/peso.
  const head = [], next = [], hacia = [], peso = [];
  const arista = (a, b, seg) => { hacia.push(b); peso.push(seg); next.push(head[a] === undefined ? -1 : head[a]); head[a] = hacia.length - 1; };

  for (const via of d.vias) {
    const mps = via.v * 1000 / 3600;
    let prev = -1, plng = 0, plat = 0;
    for (const [lng, lat] of via.pts) {
      const cur = nodo(lng, lat);
      if (head[cur] === undefined) head[cur] = -1;
      if (prev >= 0 && prev !== cur) {
        const dx = (lng - plng) * kx, dy = (lat - plat) * ky;
        const seg = Math.hypot(dx, dy) / mps;                  // segundos
        if (via.s >= 0) arista(prev, cur, seg);                // sentido de la geometría
        if (via.s <= 0) arista(cur, prev, seg);                // sentido contrario
      }
      prev = cur; plng = lng; plat = lat;
    }
  }

  // --- rejilla para encontrar el nodo más cercano a un punto cualquiera ---
  const CELDA = 300;                                            // metros
  const dLat = CELDA / ky, dLng = CELDA / kx;
  const rejilla = new Map();
  const claveCelda = (lng, lat) => Math.round(lat / dLat) + ':' + Math.round(lng / dLng);
  for (let i = 0; i < xs.length; i++) {
    const k = claveCelda(xs[i], ys[i]);
    let a = rejilla.get(k);
    if (!a) rejilla.set(k, a = []);
    a.push(i);
  }

  function nodoCerca(lat, lng) {
    const ci = Math.round(lat / dLat), cj = Math.round(lng / dLng);
    for (let anillo = 0; anillo <= 12; anillo++) {              // ~3,6 km de búsqueda máxima
      let mejor = -1, mejorD = Infinity;
      for (let p = -anillo; p <= anillo; p++) for (let q = -anillo; q <= anillo; q++) {
        if (anillo > 0 && Math.abs(p) !== anillo && Math.abs(q) !== anillo) continue;  // sólo el borde
        const a = rejilla.get((ci + p) + ':' + (cj + q));
        if (!a) continue;
        for (const i of a) {
          const dd = Math.hypot((xs[i] - lng) * kx, (ys[i] - lat) * ky);
          if (dd < mejorD) { mejorD = dd; mejor = i; }
        }
      }
      if (mejor >= 0) return { i: mejor, dist: mejorD };
    }
    return null;
  }

  // Dijkstra desde uno o varios orígenes. Con varios (multi-bodega) el resultado es el tiempo
  // a la bodega MÁS CERCANA de cada punto, que es justo el criterio operativo: una orden la
  // despacha el centro que mejor le queda, no uno fijo.
  function tiempos(origenes, factor) {
    const f = factor || 1;
    // Float64 y no Float32 a propósito. Con Float32 el valor guardado se redondea y deja de
    // ser idéntico a la prioridad (que es un doble), así que el descarte `prio > dist[u]`
    // daba verdadero para casi todo y el Dijkstra no salía del origen. Costó un rato.
    const dist = new Float64Array(xs.length).fill(Infinity);
    const h = new Monticulo();
    for (const o of origenes) {
      const nc = nodoCerca(o[0], o[1]);
      if (!nc) continue;
      if (dist[nc.i] > 0) { dist[nc.i] = 0; h.meter(0, nc.i); }
    }
    while (h.tam) {
      const { prio, val: u } = h.sacar();
      if (prio > dist[u]) continue;
      for (let a = head[u]; a !== undefined && a !== -1; a = next[a]) {
        const v = hacia[a], nd = prio + peso[a] * f;
        if (nd < dist[v]) { dist[v] = nd; h.meter(nd, v); }
      }
    }
    return dist;
  }

  return {
    ciudad, nodos: xs.length, aristas: hacia.length, bbox: d.bbox,
    nodoCerca, tiempos,
    // Minutos hasta un punto. `null` si el punto no tiene red cerca o quedó inalcanzable
    // (isla del grafo): se dice, no se inventa un número.
    minutosA(dist, lat, lng) {
      const nc = nodoCerca(lat, lng);
      if (!nc) return null;
      const t = dist[nc.i];
      if (!isFinite(t)) return null;
      // se suma el tramo a pie/acceso desde el nodo hasta el punto, a 4 km/h
      return (t + nc.dist / (4000 / 3600)) / 60;
    },
  };
}

module.exports = { construir, Monticulo };

if (require.main === module) {
  const ciudad = (process.argv[2] || 'BOGOTA').toUpperCase();
  const t0 = Date.now();
  const g = construir(ciudad);
  console.log(`${ciudad}: ${g.nodos.toLocaleString('es-CO')} nodos · ${g.aristas.toLocaleString('es-CO')} aristas · ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  const { CIUDADES } = require('./osm.js');
  const centro = CIUDADES[ciudad].nucleo;
  const t1 = Date.now();
  const dist = g.tiempos([centro], 1);
  let alcanzados = 0;
  for (let i = 0; i < dist.length; i++) if (isFinite(dist[i])) alcanzados++;
  console.log(`Dijkstra desde el centro: ${((Date.now() - t1) / 1000).toFixed(1)}s · alcanza ${(alcanzados * 100 / dist.length).toFixed(1)}% de los nodos`);
}
