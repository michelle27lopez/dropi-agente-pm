import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { requireUser } from "@/lib/require-auth";
import {
  esColumnasRawData, parsearRawDataUserPilot, empalmarConRawData,
  calcularResultadoCompleto,
  type ExclusionManual, type FilaCruda,
} from "@/lib/onboarding-ttfo";
import { leerExclusiones, leerFuentesAcumuladas, guardarCargaRawData, type FilaGuardada } from "@/lib/onboarding-ttfo/almacenLocal";

// Carga RUTINARIA — a diferencia de /importar (CSV histórico, línea base),
// esta ruta solo acepta el export "Raw Data" de la automatización (Google
// Sheets → webhook UserPilot) y lo SUMA sobre la última base guardada por
// /importar, sin volver a pedir los CSV (decisión de Kate, 04-ago-2026).
//
// Sin cutoff de fecha: a diferencia del primer empalme (que sí necesitaba
// filtrar desde 2026-08-03 17:20 para no duplicar contra el CSV histórico
// que se cargaba EN LA MISMA corrida), acá la base ya guardada define el
// punto de partida — empalmarConRawData combina por userId tomando el
// máximo/lo más reciente de cada campo, así que aunque el Raw Data que subas
// se solape con lo ya guardado (ej. exportaste "todo lo acumulado" en vez de
// solo lo nuevo), no se duplica ni se cuenta dos veces.

export const runtime = "nodejs";
export const maxDuration = 60;

function leerHojaComoFilas(buffer: ArrayBuffer): FilaCruda[] {
  const libro = XLSX.read(buffer, { type: "array" });
  const hoja = libro.Sheets[libro.SheetNames[0]];
  return XLSX.utils.sheet_to_json<FilaCruda>(hoja, { defval: null });
}

export async function POST(req: NextRequest) {
  const user = await requireUser();
  if (!user) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const fuentesBase = await leerFuentesAcumuladas();
  if (!fuentesBase) {
    return NextResponse.json(
      { error: "No hay una línea base guardada todavía. Sube primero el histórico completo desde \"Cargar cohorte nueva\" (CSV)." },
      { status: 400 },
    );
  }

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "No se pudo leer el formulario." }, { status: 400 });

  const archivos = form.getAll("archivos").filter((a): a is File => a instanceof File);
  if (archivos.length === 0) {
    return NextResponse.json({ error: "Falta el archivo de Raw Data (campo 'archivos')." }, { status: 400 });
  }
  const confirmar = form.get("confirmar") === "true";

  const entradas: { nombreArchivo: string; filas: FilaCruda[] }[] = [];
  for (const archivo of archivos) {
    try {
      entradas.push({ nombreArchivo: archivo.name, filas: leerHojaComoFilas(await archivo.arrayBuffer()) });
    } catch {
      return NextResponse.json({ error: `No se pudo leer "${archivo.name}". Debe ser .csv o .xlsx.` }, { status: 400 });
    }
  }

  const noReconocidos = entradas.filter(e => !esColumnasRawData(Object.keys(e.filas[0] ?? {})));
  if (noReconocidos.length > 0) {
    return NextResponse.json({
      error: `${noReconocidos.map(e => e.nombreArchivo).join(", ")} no tiene la forma de un export "Raw Data" `
        + `(se esperan las columnas Timestamp/Event Type/Full Payload). Si es un CSV histórico, súbelo desde "Cargar cohorte nueva".`,
    }, { status: 400 });
  }

  const filasRawData = entradas.flatMap(e => e.filas);
  const rawData = parsearRawDataUserPilot(filasRawData, "");
  const fuentes = empalmarConRawData(fuentesBase, rawData);

  const exclusionesData = await leerExclusiones();
  const exclusionesManuales = new Map<number, ExclusionManual>(
    exclusionesData.map(e => [e.user_id, { userId: e.user_id, motivo: e.motivo }]),
  );

  const fechaCorte = new Date().toISOString().slice(0, 10);
  const { resultados, alertas, comparacionOnboarding, resumen, inferidosPorParalelismo } =
    calcularResultadoCompleto(fuentes, exclusionesManuales, fechaCorte);

  const resumenRawData = {
    archivos: entradas.length,
    filasLeidas: filasRawData.length,
    usuariosEncuestaNuevos: rawData.encuesta.length,
    poblacionBase: fuentesBase.encuesta.length,
    poblacionTotalDespues: fuentes.encuesta.length,
  };

  const preview = { resumen, resumenRawData, alertas, comparacionOnboarding, inferidosPorParalelismo };

  if (!confirmar) {
    return NextResponse.json({ dryRun: true, ...preview, mensaje: "Nada escrito todavía. Confirmá para sumar a la base." });
  }

  const filas: FilaGuardada[] = resultados.map(r => ({
    userId: r.userId,
    submittedAt: r.submittedAt,
    signedUp: r.signedUp,
    primeraOrden: r.primeraOrden,
    ttfoDias: r.ttfoDias,
    estadoMeta7d: r.estadoMeta7d,
    gatillo: r.gatillo,
    segmento: r.segmento,
    esPrueba: r.esPrueba,
    caminos: r.caminos.map(c => c.camino).join(","),
    ordenesCreadas: r.ordenesCreadas,
    ordenesEntregadas: r.ordenesEntregadas,
    ventasMesDeclaradas: r.ventasMesDeclaradas,
  }));

  const ultimaImportacion = {
    archivos: entradas.map(e => ({ nombreArchivo: e.nombreArchivo, filas: e.filas.length })),
    tipo: "raw_data_incremental",
    poblacion: resumen.poblacion,
    activadas: resumen.activadas,
    exito: resumen.exito,
    fracaso: resumen.fracaso,
    enObservacion: resumen.enObservacion,
    alertaAFlujoYOrden: alertas.flujoCompletoYOrden.length,
    alertaBOrdenSinFlujo: alertas.ordenSinFlujo.length,
    usuario: user.email ?? user.id,
    fechaCorte,
    createdAt: new Date().toISOString(),
  };

  try {
    await guardarCargaRawData({ filas, alertas, comparacionOnboarding, ultimaImportacion }, fuentes);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error escribiendo el resultado local" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ...preview });
}
