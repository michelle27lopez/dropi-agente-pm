// Precálculo para el simulador de cobertura same-day.
//
//   node --max-old-space-size=6144 simular.js
//
// QUÉ HACE Y POR QUÉ ASÍ.
// El simulador tiene que responder en vivo mientras se arrastra la bodega, pero un Dijkstra
// sobre 250.000 nodos no puede correr en el navegador. La salida: se precalculan aquí los
// tiempos desde una REJILLA DE BODEGAS CANDIDATAS (~1 km) hasta cada zona, y el navegador
// sólo busca la candidata más cercana y hace la aritmética de Daganzo, que es instantánea.
//
// El modelo vive en el navegador a propósito: todos los supuestos (velocidad, tiempo de
// servicio, ventana, capacidad) son deslizadores. Si se calcularan aquí quedarían congelados
// y el usuario no podría ver a qué es sensible la conclusión — que es justo lo que hay que
// mirar cuando media entrada es un supuesto.
//
// ⚠️ Los tiempos son de FLUJO LIBRE. El factor de tráfico se aplica en el navegador.
const fs = require('fs');
const path = require('path');
const rutas = require('./rutas.js');
const zonasLib = require('./zonas.js');

const ENTRADA = path.join(__dirname, '..', 'datos-sameday.json');
const SALIDA = path.join(__dirname, '..', 'datos-simulacion.json');
const PASO_KM = 1;              // separación de la rejilla de bodegas candidatas
const CELDA_KM = 0.25;          // lado de la celda de demanda (250 m, ver geo-sameday.js)

(async () => {
  const D = JSON.parse(fs.readFileSync(ENTRADA, 'utf8'));
  const salida = { ciudades: {} };

  for (const [ciudad, c] of Object.entries(D.ciudades)) {
    const t0 = Date.now();
    const g = rutas.construir(ciudad);
    const Z = zonasLib.cargar(ciudad);

    // --- zonas: centroide PONDERADO POR DEMANDA y área efectiva ---
    // El área de Daganzo debe ser aquella donde de verdad hay paradas, no la del polígono
    // administrativo: una localidad puede medir 50 km² con la demanda apiñada en 10, y usar
    // los 50 infla la distancia de recorrido y hunde artificialmente la capacidad.
    const zonas = new Map();
    for (const [lat, lng, ord] of c.celdas) {
      const z = Z ? Z.ubicar(lat, lng) : null;
      if (!z) continue;
      let a = zonas.get(z);
      if (!a) zonas.set(z, a = { nombre: z, ordenes: 0, celdas: 0, slat: 0, slng: 0 });
      a.ordenes += ord; a.celdas++; a.slat += lat * ord; a.slng += lng * ord;
    }
    const listaZonas = [...zonas.values()].map(z => ({
      n: z.nombre, ordenes: z.ordenes, celdas: z.celdas,
      area: +(z.celdas * CELDA_KM * CELDA_KM).toFixed(2),
      lat: +(z.slat / z.ordenes).toFixed(5), lng: +(z.slng / z.ordenes).toFixed(5),
    })).sort((a, b) => b.ordenes - a.ordenes);

    // --- candidatas: rejilla sobre las celdas CON demanda (no sobre el bbox: la mitad del
    // bbox de Bogotá son cerros y páramo, y gastar un Dijkstra ahí no sirve de nada) ---
    const kmLat = 110.574, kmLng = 111.320 * Math.cos(c.nucleo[0] * Math.PI / 180);
    const dLat = PASO_KM / kmLat, dLng = PASO_KM / kmLng;
    const vistas = new Set();
    const candidatas = [];
    for (const [lat, lng] of c.celdas) {
      const k = Math.round(lat / dLat) + ':' + Math.round(lng / dLng);
      if (vistas.has(k)) continue;
      vistas.add(k);
      candidatas.push([+(Math.round(lat / dLat) * dLat).toFixed(5), +(Math.round(lng / dLng) * dLng).toFixed(5)]);
    }

    // --- un Dijkstra por candidata -> minutos a cada zona ---
    const T = [];                                   // T[candidata][zona] = minutos (entero)
    const medio = [];                               // minutos medios ponderados por demanda
    const totalOrd = listaZonas.reduce((s, z) => s + z.ordenes, 0);
    for (const cand of candidatas) {
      const dist = g.tiempos([cand], 1);
      const fila = [];
      let acc = 0, conDato = 0;
      for (const z of listaZonas) {
        const m = g.minutosA(dist, z.lat, z.lng);
        fila.push(m == null ? -1 : Math.round(m));
        if (m != null) { acc += m * z.ordenes; conDato += z.ordenes; }
      }
      T.push(fila);
      medio.push(conDato ? +(acc / conDato).toFixed(2) : 9999);
    }

    // p-mediana: la candidata que minimiza el tiempo medio ponderado por demanda.
    // No es "donde está la bodega" sino "dónde convendría que estuviera" según la demanda real.
    let mejor = 0;
    for (let i = 1; i < medio.length; i++) if (medio[i] < medio[mejor]) mejor = i;

    salida.ciudades[ciudad] = {
      nucleo: c.nucleo, bbox: c.bbox,
      zonas: listaZonas, candidatas, t: T, medio, mejor,
      paso_km: PASO_KM,
      nodos: g.nodos, aristas: g.aristas,
    };
    console.log(`${ciudad.padEnd(9)} ${g.nodos.toLocaleString('es-CO')} nodos · ${listaZonas.length} zonas · ` +
      `${candidatas.length} bodegas candidatas · mejor ${candidatas[mejor]} (${medio[mejor]} min medios) · ` +
      `${((Date.now() - t0) / 1000).toFixed(0)}s`);
  }

  salida.meta = {
    generado: new Date().toISOString().slice(0, 10),
    metodo: 'Dijkstra sobre red vial de OpenStreetMap; tiempos en flujo libre (el factor de tráfico se aplica en el simulador)',
    modelo: 'Daganzo (1984): L ≈ 2·r·n/Q + 0,57·√(n·A) — aproximación continua para planeación de última milla',
    advertencia: 'Los tiempos NO incluyen tráfico real, semáforos ni pico y placa. El área por zona es la de las celdas con demanda, no la del polígono administrativo.',
    paso_km: PASO_KM, celda_km: CELDA_KM,
  };
  fs.writeFileSync(SALIDA, JSON.stringify(salida));
  console.log('\n->', SALIDA, (fs.statSync(SALIDA).size / 1024).toFixed(0), 'KB');
})();
