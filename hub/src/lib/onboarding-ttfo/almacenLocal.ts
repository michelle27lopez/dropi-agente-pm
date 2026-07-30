import fs from "node:fs/promises";
import path from "node:path";
import type { EstadoMeta7d, Gatillo, Segmento } from "./tipos";

// Almacenamiento local en JSON — reemplaza las tablas brands_ttfo_* de
// Supabase mientras las migraciones 039/040 sigan sin aplicar (decisión
// 2026-07-29: trabajar con CSV, sin depender de la BD). Mismo patrón que
// src/lib/product-lens/contextStore.ts: hub/data/ como fuente de verdad,
// trackeado en git, sin fallback a otra base.

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const RESULTADO_PATH = path.join(DATA_DIR, "onboarding-ttfo.json");
const EXCLUSIONES_PATH = path.join(DATA_DIR, "onboarding-ttfo-exclusiones.json");

export interface FilaGuardada {
  userId: number;
  submittedAt: string;
  signedUp: string;
  primeraOrden: string | null;
  ttfoDias: number | null;
  estadoMeta7d: EstadoMeta7d;
  gatillo: Gatillo;
  segmento: Segmento | null;
  esPrueba: boolean;
  caminos: string;
  ordenesCreadas: number | null;
  ordenesEntregadas: number | null;
  ventasMesDeclaradas: string | null;
}

export interface ResultadoGuardado {
  filas: FilaGuardada[];
  alertas: unknown;
  comparacionOnboarding: unknown;
  ultimaImportacion: unknown;
}

export interface ExclusionGuardada {
  user_id: number;
  motivo: string;
  agregado_por: string | null;
  created_at: string;
}

async function leerJSON<T>(rutaArchivo: string, porDefecto: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(rutaArchivo, "utf8")) as T;
  } catch {
    return porDefecto;
  }
}

async function escribirJSON(rutaArchivo: string, datos: unknown): Promise<void> {
  await fs.mkdir(path.dirname(rutaArchivo), { recursive: true });
  await fs.writeFile(rutaArchivo, JSON.stringify(datos, null, 2) + "\n");
}

export async function leerResultado(): Promise<ResultadoGuardado | null> {
  return leerJSON<ResultadoGuardado | null>(RESULTADO_PATH, null);
}

export async function guardarResultado(resultado: ResultadoGuardado): Promise<void> {
  await escribirJSON(RESULTADO_PATH, resultado);
}

export async function leerExclusiones(): Promise<ExclusionGuardada[]> {
  return leerJSON<ExclusionGuardada[]>(EXCLUSIONES_PATH, []);
}

export async function agregarExclusion(
  userId: number, motivo: string, agregadoPor: string | null,
): Promise<void> {
  const actuales = await leerExclusiones();
  const sinEsta = actuales.filter(e => e.user_id !== userId);
  const nueva: ExclusionGuardada = {
    user_id: userId, motivo, agregado_por: agregadoPor, created_at: new Date().toISOString(),
  };
  await escribirJSON(EXCLUSIONES_PATH, [nueva, ...sinEsta]);
}

export async function quitarExclusion(userId: number): Promise<void> {
  const actuales = await leerExclusiones();
  await escribirJSON(EXCLUSIONES_PATH, actuales.filter(e => e.user_id !== userId));
}
