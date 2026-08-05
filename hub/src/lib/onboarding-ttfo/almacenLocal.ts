import fs from "node:fs/promises";
import path from "node:path";
import type { EstadoMeta7d, Gatillo, Segmento } from "./tipos";
import type { FuentesAcumuladas } from "./calculoCompleto";

// Almacenamiento local en JSON — reemplaza las tablas brands_ttfo_* de
// Supabase mientras las migraciones 039/040 sigan sin aplicar (decisión
// 2026-07-29: trabajar con CSV, sin depender de la BD). Mismo patrón que
// src/lib/product-lens/contextStore.ts: hub/data/ como fuente de verdad,
// trackeado en git, sin fallback a otra base.
//
// Desde 04-ago-2026 (decisión de Kate) se guardan DOS cosas en cada
// confirmación, no solo el resultado calculado: también las fuentes crudas
// ya combinadas (Encuesta/Modal-Tour/Evento). La carga de CSV histórico deja
// de ser "la única fuente de verdad de una sola vez" — pasa a ser la línea
// base sobre la que la carga de Raw Data (incremental, sin CSV) va sumando,
// sin tener que volver a pedir los archivos históricos cada vez. Ver
// rawData.ts (empalmarConRawData) y las rutas /importar y /importar-raw-data.

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), "data");
const RESULTADO_PATH = path.join(DATA_DIR, "onboarding-ttfo.json");
const FUENTES_PATH = path.join(DATA_DIR, "onboarding-ttfo-fuentes.json");
const EXCLUSIONES_PATH = path.join(DATA_DIR, "onboarding-ttfo-exclusiones.json");

// Dos respaldos independientes, no uno solo — a pedido de Kate (04-ago-2026):
// jerarquía fija Histórico → Raw Data. Deshacer Raw Data solo revierte la
// última carga incremental (vuelve a lo que había justo antes, sea la base
// histórica sola o un empalme de Raw Data previo). Deshacer Histórico
// reemplaza toda la base — por construcción arrastra con él cualquier Raw
// Data acumulado desde entonces, así que al restaurarlo también se invalida
// el respaldo de Raw Data (pertenecía a una era que ya no existe).
const RESULTADO_BACKUP_HISTORICO_PATH = path.join(DATA_DIR, "onboarding-ttfo.backup-historico.json");
const FUENTES_BACKUP_HISTORICO_PATH = path.join(DATA_DIR, "onboarding-ttfo-fuentes.backup-historico.json");
const RESULTADO_BACKUP_RAWDATA_PATH = path.join(DATA_DIR, "onboarding-ttfo.backup-rawdata.json");
const FUENTES_BACKUP_RAWDATA_PATH = path.join(DATA_DIR, "onboarding-ttfo-fuentes.backup-rawdata.json");

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

export async function leerFuentesAcumuladas(): Promise<FuentesAcumuladas | null> {
  return leerJSON<FuentesAcumuladas | null>(FUENTES_PATH, null);
}

async function respaldarVigente(resultadoBackupPath: string, fuentesBackupPath: string): Promise<void> {
  const [resultadoAnterior, fuentesAnteriores] = await Promise.all([leerResultado(), leerFuentesAcumuladas()]);
  if (resultadoAnterior) await escribirJSON(resultadoBackupPath, resultadoAnterior);
  if (fuentesAnteriores) await escribirJSON(fuentesBackupPath, fuentesAnteriores);
}

async function borrarRespaldo(resultadoBackupPath: string, fuentesBackupPath: string): Promise<void> {
  await fs.unlink(resultadoBackupPath).catch(() => {});
  await fs.unlink(fuentesBackupPath).catch(() => {});
}

/**
 * Guarda una carga HISTÓRICA (CSV) — respalda lo vigente en el slot
 * "histórico" antes de sobrescribir, y de paso invalida cualquier respaldo
 * de Raw Data que hubiera (pertenecía a una base que ya no existe, no tiene
 * sentido ofrecer "deshacer" hacia una era anterior sin pasar por acá).
 */
export async function guardarCargaHistorica(resultado: ResultadoGuardado, fuentes: FuentesAcumuladas): Promise<void> {
  await respaldarVigente(RESULTADO_BACKUP_HISTORICO_PATH, FUENTES_BACKUP_HISTORICO_PATH);
  await borrarRespaldo(RESULTADO_BACKUP_RAWDATA_PATH, FUENTES_BACKUP_RAWDATA_PATH);
  await escribirJSON(RESULTADO_PATH, resultado);
  await escribirJSON(FUENTES_PATH, fuentes);
}

/** Guarda una carga de Raw Data (rutinaria) — respalda solo en el slot "raw data", nunca toca el respaldo histórico. */
export async function guardarCargaRawData(resultado: ResultadoGuardado, fuentes: FuentesAcumuladas): Promise<void> {
  await respaldarVigente(RESULTADO_BACKUP_RAWDATA_PATH, FUENTES_BACKUP_RAWDATA_PATH);
  await escribirJSON(RESULTADO_PATH, resultado);
  await escribirJSON(FUENTES_PATH, fuentes);
}

export async function hayRespaldoHistorico(): Promise<boolean> {
  return (await leerJSON<ResultadoGuardado | null>(RESULTADO_BACKUP_HISTORICO_PATH, null)) !== null;
}

export async function hayRespaldoRawData(): Promise<boolean> {
  return (await leerJSON<ResultadoGuardado | null>(RESULTADO_BACKUP_RAWDATA_PATH, null)) !== null;
}

/**
 * Restaura el respaldo histórico — vuelve a lo que había antes de la última
 * carga de CSV. Como eso arrastra con él cualquier Raw Data sumado después
 * (esa base ya no existe), también se borra el respaldo de Raw Data.
 */
export async function restaurarRespaldoHistorico(): Promise<ResultadoGuardado> {
  const respaldo = await leerJSON<ResultadoGuardado | null>(RESULTADO_BACKUP_HISTORICO_PATH, null);
  if (!respaldo) throw new Error("No hay una carga histórica anterior guardada para restaurar.");
  const fuentesRespaldo = await leerJSON<FuentesAcumuladas | null>(FUENTES_BACKUP_HISTORICO_PATH, null);

  await escribirJSON(RESULTADO_PATH, respaldo);
  if (fuentesRespaldo) await escribirJSON(FUENTES_PATH, fuentesRespaldo);
  await borrarRespaldo(RESULTADO_BACKUP_HISTORICO_PATH, FUENTES_BACKUP_HISTORICO_PATH);
  await borrarRespaldo(RESULTADO_BACKUP_RAWDATA_PATH, FUENTES_BACKUP_RAWDATA_PATH);
  return respaldo;
}

/** Restaura el respaldo de Raw Data — deshace solo la última carga incremental, deja intacto el respaldo histórico. */
export async function restaurarRespaldoRawData(): Promise<ResultadoGuardado> {
  const respaldo = await leerJSON<ResultadoGuardado | null>(RESULTADO_BACKUP_RAWDATA_PATH, null);
  if (!respaldo) throw new Error("No hay una carga de Raw Data anterior guardada para restaurar.");
  const fuentesRespaldo = await leerJSON<FuentesAcumuladas | null>(FUENTES_BACKUP_RAWDATA_PATH, null);

  await escribirJSON(RESULTADO_PATH, respaldo);
  if (fuentesRespaldo) await escribirJSON(FUENTES_PATH, fuentesRespaldo);
  await borrarRespaldo(RESULTADO_BACKUP_RAWDATA_PATH, FUENTES_BACKUP_RAWDATA_PATH);
  return respaldo;
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
