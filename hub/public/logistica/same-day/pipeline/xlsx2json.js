// Convierte "Data samday.xlsx" -> ordenes.ndjson (una orden por línea).
//
// Sin librerías: un .xlsx es un ZIP con XML adentro, y node trae zlib. Se hace en
// streaming por una razón concreta: la hoja son 92 MB de XML y las cadenas compartidas
// otros 38 MB. Cargar el XML completo en memoria revienta o se arrastra.
//
//   node xlsx2json.js "C:/Users/USUARIO/Downloads/Data samday.xlsx"
//
// El xlsx es data cruda de Dropi: NO se versiona (ver .gitignore de esta carpeta).
const fs = require('fs');
const zlib = require('zlib');
const path = require('path');

const XLSX = process.argv[2] || 'C:/Users/USUARIO/Downloads/Data samday.xlsx';
const SALIDA = path.join(__dirname, 'ordenes.ndjson');

// ---------- lectura del ZIP (directorio central -> entradas) ----------
function entradas(archivo) {
  const fd = fs.openSync(archivo, 'r');
  const tam = fs.fstatSync(fd).size;
  // El "end of central directory" está al final; puede traer comentario, así que se busca.
  const cola = Buffer.alloc(Math.min(65557, tam));
  fs.readSync(fd, cola, 0, cola.length, tam - cola.length);
  let eocd = -1;
  for (let i = cola.length - 22; i >= 0; i--) if (cola.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('ZIP inválido: no se encontró el EOCD');

  const cdTam = cola.readUInt32LE(eocd + 12);
  const cdOff = cola.readUInt32LE(eocd + 16);
  const cd = Buffer.alloc(cdTam);
  fs.readSync(fd, cd, 0, cdTam, cdOff);

  const out = {};
  let p = 0;
  while (p < cd.length && cd.readUInt32LE(p) === 0x02014b50) {
    const metodo = cd.readUInt16LE(p + 10);
    const compSize = cd.readUInt32LE(p + 20);
    const nLen = cd.readUInt16LE(p + 28);
    const eLen = cd.readUInt16LE(p + 30);
    const cLen = cd.readUInt16LE(p + 32);
    const lhOff = cd.readUInt32LE(p + 42);
    const nombre = cd.toString('utf8', p + 46, p + 46 + nLen);
    out[nombre] = { metodo, compSize, lhOff };
    p += 46 + nLen + eLen + cLen;
  }
  return { fd, out };
}

// Devuelve un stream con el contenido descomprimido de una entrada.
function abrir(fd, e) {
  // El header local repite los tamaños de nombre/extra, y no siempre coinciden con
  // los del directorio central: hay que leerlo para saber dónde empiezan los datos.
  const lh = Buffer.alloc(30);
  fs.readSync(fd, lh, 0, 30, e.lhOff);
  if (lh.readUInt32LE(0) !== 0x04034b50) throw new Error('header local inválido');
  const inicio = e.lhOff + 30 + lh.readUInt16LE(26) + lh.readUInt16LE(28);
  const crudo = fs.createReadStream(null, { fd, start: inicio, end: inicio + e.compSize - 1, autoClose: false });
  return e.metodo === 0 ? crudo : crudo.pipe(zlib.createInflateRaw());
}

// ---------- utilidades XML ----------
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" };
const desescapar = s => s.replace(/&(#x?[0-9a-fA-F]+|amp|lt|gt|quot|apos);/g, (m, c) =>
  c[0] === '#' ? String.fromCodePoint(c[1] === 'x' ? parseInt(c.slice(2), 16) : +c.slice(1)) : ENT[c]);

// Recorre un stream aplicando un regex global, procesando SÓLO hasta el último `cierre`
// visto en el buffer. Sin ese corte, un chunk que parte un elemento por la mitad produce
// coincidencias truncadas y se pierden celdas en silencio (nos costó 206 ciudades vacías).
function escanear(stream, regex, alEncontrar, cierre) {
  return new Promise((resolve, reject) => {
    let buf = '';
    const procesar = (txt) => {
      regex.lastIndex = 0;
      let m;
      while ((m = regex.exec(txt)) !== null) alEncontrar(m);
    };
    stream.setEncoding('utf8');
    stream.on('data', (chunk) => {
      buf += chunk;
      const corte = buf.lastIndexOf(cierre);
      if (corte < 0) return;                       // todavía no hay un elemento completo
      const fin = corte + cierre.length;
      procesar(buf.slice(0, fin));
      buf = buf.slice(fin);
    });
    stream.on('end', () => { if (buf) procesar(buf); resolve(); });
    stream.on('error', reject);
  });
}

(async () => {
  if (!fs.existsSync(XLSX)) { console.error('No existe el archivo:', XLSX); process.exit(1); }
  console.log('leyendo', XLSX);
  const { fd, out } = entradas(XLSX);

  // --- 1. cadenas compartidas (todas las celdas del archivo son referencias a esta tabla) ---
  console.log('cadenas compartidas…');
  const sst = [];
  // Un <si> puede traer varios <t> (texto enriquecido): se concatenan.
  await escanear(abrir(fd, out['xl/sharedStrings.xml']), /<si>([\s\S]*?)<\/si>/g, (m) => {
    const partes = m[1].match(/<t[^>]*>[\s\S]*?<\/t>/g);
    sst.push(partes ? desescapar(partes.map(t => t.replace(/^<t[^>]*>|<\/t>$/g, '')).join('')) : '');
  }, '</si>');
  console.log('  ', sst.length.toLocaleString('es-CO'), 'cadenas');

  // --- 2. hoja ---
  console.log('hoja…');
  const ws = fs.createWriteStream(SALIDA);
  const COL = { A: 'orden_id', B: 'direccion', C: 'ciudad', D: 'dpto' };
  let fila = null, filaN = 0, escritas = 0, encabezado = null;
  const porCiudad = {};

  const volcar = () => {
    if (!fila) return;
    if (!encabezado) { encabezado = fila; return; }          // primera fila = nombres de columna
    if (!fila.orden_id && !fila.direccion) return;
    porCiudad[fila.ciudad] = (porCiudad[fila.ciudad] || 0) + 1;
    ws.write(JSON.stringify(fila) + '\n');
    escritas++;
  };

  await escanear(abrir(fd, out['xl/worksheets/sheet1.xml']),
    /<row[^>]*r="(\d+)"[^>]*>|<c r="([A-Z]+)\d+"([^>]*)>(?:<v>([^<]*)<\/v>)?/g, (m) => {
      if (m[1] !== undefined) { volcar(); fila = {}; filaN++; return; }
      if (!fila) return;
      const campo = COL[m[2]];
      if (!campo || m[4] === undefined) return;
      // t="s" -> índice a la tabla de cadenas; cualquier otro tipo -> valor literal.
      fila[campo] = /t="s"/.test(m[3]) ? (sst[+m[4]] ?? '') : desescapar(m[4]);
    }, '</row>');
  volcar();

  ws.end();
  await new Promise(r => ws.on('finish', r));
  fs.closeSync(fd);

  console.log('\nencabezado leído:', JSON.stringify(encabezado));
  console.log('filas en la hoja :', filaN.toLocaleString('es-CO'), '(incluye encabezado)');
  console.log('órdenes escritas :', escritas.toLocaleString('es-CO'));
  console.log('\npor ciudad:');
  for (const [c, n] of Object.entries(porCiudad).sort((a, b) => b[1] - a[1]))
    console.log('  ', c.padEnd(10), n.toLocaleString('es-CO').padStart(9), (n / escritas * 100).toFixed(1) + '%');
  console.log('\n->', SALIDA, (fs.statSync(SALIDA).size / 1048576).toFixed(1), 'MB');
})();
