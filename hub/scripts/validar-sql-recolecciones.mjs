// Valida la migración ANTES de pegarla en el SQL Editor. Busca los errores que
// de verdad la hacen fallar a mitad de camino y dejan la base a medio crear.
import fs from "node:fs";

import path from "node:path";
const f = path.resolve(import.meta.dirname, "../supabase/037_recolecciones.sql");
const sql = fs.readFileSync(f, "utf8");

// Quitar comentarios para no analizar SQL que está apagado
const activo = sql.split("\n").filter(l => !l.trimStart().startsWith("--")).join("\n");

const problemas = [];
const aviso = m => problemas.push(m);

// 1. Tablas creadas, en orden
const tablas = [...activo.matchAll(/create table if not exists (\w+)/g)].map(m => m[1]);
console.log("TABLAS (en orden de creación)");
tablas.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));

const dup = tablas.filter((t, i) => tablas.indexOf(t) !== i);
if (dup.length) aviso(`Tablas duplicadas: ${dup.join(", ")}`);

// 2. Toda FK debe apuntar a una tabla YA creada (Postgres exige el orden)
console.log("\nFOREIGN KEYS");
const bloques = [...activo.matchAll(/create table if not exists (\w+) \(([\s\S]*?)\n\);/g)];
for (const [, tabla, cuerpo] of bloques) {
  const posicion = tablas.indexOf(tabla);
  for (const fk of cuerpo.matchAll(/references (\w+)\s*\((\w+)\)/g)) {
    const [, destino, col] = fk;
    const posDestino = tablas.indexOf(destino);
    if (posDestino === -1) {
      console.log(`  ✗ ${tabla} → ${destino}(${col})  — LA TABLA NO SE CREA`);
      aviso(`${tabla} referencia ${destino}, que no existe en esta migración`);
    } else if (posDestino > posicion) {
      console.log(`  ✗ ${tabla} → ${destino}(${col})  — se crea DESPUÉS`);
      aviso(`${tabla} referencia ${destino}, creada más abajo: Postgres falla`);
    } else {
      console.log(`  ✓ ${tabla} → ${destino}(${col})`);
    }
  }
}

// 3. Índices: sobre tablas existentes, sin nombres repetidos
console.log("\nÍNDICES");
const indices = [...activo.matchAll(/create index if not exists (\w+)\s+on (\w+)\s*\(([^)]*)\)/g)];
const nombres = new Set();
for (const [, nombre, tabla, cols] of indices) {
  if (nombres.has(nombre)) { console.log(`  ✗ ${nombre} — nombre REPETIDO`); aviso(`índice duplicado: ${nombre}`); }
  nombres.add(nombre);

  if (!tablas.includes(tabla)) {
    console.log(`  ✗ ${nombre} on ${tabla} — LA TABLA NO EXISTE`);
    aviso(`índice ${nombre} sobre ${tabla}, que no se crea`);
    continue;
  }
  // ¿las columnas existen?
  const cuerpo = bloques.find(b => b[1] === tabla)?.[2] ?? "";
  const declaradas = new Set(
    cuerpo.split("\n").map(l => l.replace(/--.*$/, "").trim().match(/^(\w+)\s+\w/)?.[1]).filter(Boolean));
  const faltan = cols.split(",").map(c => c.trim().split(/\s+/)[0])
    .filter(c => c && !declaradas.has(c));
  if (faltan.length) {
    console.log(`  ✗ ${nombre} on ${tabla}(${cols.trim()}) — columnas inexistentes: ${faltan.join(", ")}`);
    aviso(`índice ${nombre} usa columnas que no existen: ${faltan.join(", ")}`);
  } else {
    console.log(`  ✓ ${nombre} on ${tabla}`);
  }
}

// 4. El bloque de RLS solo debe listar tablas que existen
console.log("\nRLS");
const arr = activo.match(/tables text\[\] := array\[([\s\S]*?)\]/);
if (!arr) aviso("no se encontró el array de RLS");
else {
  const listadas = [...arr[1].matchAll(/'(\w+)'/g)].map(m => m[1]);
  for (const t of listadas) {
    if (!tablas.includes(t)) { console.log(`  ✗ ${t} — no se crea`); aviso(`RLS sobre ${t}, que no existe`); }
    else console.log(`  ✓ ${t}`);
  }
  for (const t of tablas) {
    if (!listadas.includes(t)) { console.log(`  ✗ ${t} — SIN RLS`); aviso(`${t} queda sin RLS`); }
  }
}

// 5. La semilla debe insertar en columnas que existan
console.log("\nSEMILLA");
for (const m of activo.matchAll(/insert into (\w+)\s*\(([^)]*)\)/g)) {
  const [, tabla, cols] = m;
  const cuerpo = bloques.find(b => b[1] === tabla)?.[2] ?? "";
  const declaradas = new Set(
    cuerpo.split("\n").map(l => l.replace(/--.*$/, "").trim().match(/^(\w+)\s+\w/)?.[1]).filter(Boolean));
  const faltan = cols.split(",").map(c => c.trim()).filter(c => c && !declaradas.has(c));
  console.log(faltan.length
    ? `  ✗ insert into ${tabla}: columnas inexistentes: ${faltan.join(", ")}`
    : `  ✓ insert into ${tabla} (${cols.split(",").length} columnas)`);
  if (faltan.length) aviso(`insert en ${tabla} con columnas inexistentes`);
}

// 6. Balance de paréntesis y de bloques do $$
const abre = (activo.match(/\(/g) || []).length, cierra = (activo.match(/\)/g) || []).length;
if (abre !== cierra) aviso(`paréntesis desbalanceados: ${abre} abren, ${cierra} cierran`);
const dolares = (activo.match(/\$\$/g) || []).length;
if (dolares % 2) aviso(`bloques do $$ sin cerrar (${dolares} marcadores)`);

console.log("\n" + "═".repeat(60));
if (problemas.length) {
  console.log(`${problemas.length} PROBLEMA(S) — la migración fallaría:`);
  problemas.forEach(p => console.log("  ✗ " + p));
  process.exit(1);
}
console.log("Sin problemas detectados. Lista para correr.");
