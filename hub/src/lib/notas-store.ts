import fs from "fs";
import path from "path";
import os from "os";
import crypto from "crypto";

// Notas privadas: viven solo en esta máquina, nunca en la Supabase
// compartida. Por eso el archivo va en el home del usuario, fuera del repo.
const DATA_DIR = path.join(os.homedir(), ".dropi-notas");
const DATA_FILE = path.join(DATA_DIR, "data.json");

export type Carpeta = { id: string; nombre: string; created_at: string };
export type Nota = {
  id: string;
  titulo: string;
  contenido: string;
  carpeta_id: string | null;
  created_at: string;
  updated_at: string;
};
type Store = { carpetas: Carpeta[]; notas: Nota[] };

function readStore(): Store {
  if (!fs.existsSync(DATA_FILE)) return { carpetas: [], notas: [] };
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeStore(store: Store) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2));
}

export function listCarpetas(): Carpeta[] {
  return readStore().carpetas.slice().sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function createCarpeta(nombre: string): Carpeta {
  const store = readStore();
  const carpeta: Carpeta = { id: crypto.randomUUID(), nombre, created_at: new Date().toISOString() };
  store.carpetas.push(carpeta);
  writeStore(store);
  return carpeta;
}

export function findCarpetaByNombre(nombre: string): Carpeta | null {
  return readStore().carpetas.find((c) => c.nombre.toLowerCase() === nombre.toLowerCase()) ?? null;
}

export function renameCarpeta(id: string, nombre: string): Carpeta | null {
  const store = readStore();
  const carpeta = store.carpetas.find((c) => c.id === id);
  if (!carpeta) return null;
  carpeta.nombre = nombre;
  writeStore(store);
  return carpeta;
}

export function deleteCarpeta(id: string): void {
  const store = readStore();
  store.carpetas = store.carpetas.filter((c) => c.id !== id);
  store.notas.forEach((n) => {
    if (n.carpeta_id === id) n.carpeta_id = null;
  });
  writeStore(store);
}

export function listNotas(): Nota[] {
  return readStore().notas.slice().sort((a, b) => b.updated_at.localeCompare(a.updated_at));
}

export function createNota(carpeta_id: string | null, titulo = "Sin título", contenido = ""): Nota {
  const store = readStore();
  const now = new Date().toISOString();
  const nota: Nota = { id: crypto.randomUUID(), titulo, contenido, carpeta_id, created_at: now, updated_at: now };
  store.notas.push(nota);
  writeStore(store);
  return nota;
}

export function updateNota(
  id: string,
  patch: Partial<Pick<Nota, "titulo" | "contenido" | "carpeta_id">>
): Nota | null {
  const store = readStore();
  const nota = store.notas.find((n) => n.id === id);
  if (!nota) return null;
  Object.assign(nota, patch, { updated_at: new Date().toISOString() });
  writeStore(store);
  return nota;
}

export function deleteNota(id: string): void {
  const store = readStore();
  store.notas = store.notas.filter((n) => n.id !== id);
  writeStore(store);
}
