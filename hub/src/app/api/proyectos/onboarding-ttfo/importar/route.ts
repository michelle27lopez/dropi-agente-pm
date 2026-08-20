import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { requireUser } from "@/lib/require-auth";
import {
  clasificarLote, type ArchivoEntrada,
  parsearEncuesta, parsearModalOTour, parsearEvento,
  type SlotsParaCronologia,
  calcularResultadoCompleto,
  esColumnasRawData, parsearRawDataUserPilot, empalmarConRawData, CORTE_EMPALME_RAW_DATA,
  type ExclusionManual, type FilaCruda, type SlotId,
} from "@/lib/onboarding-ttfo";
import { leerExclusiones, guardarCargaHistorica, type FilaGuardada } from "@/lib/onboarding-ttfo/almacenLocal";

// Carga de CSV histórico para la pizarra de Onboarding TTFO — sube todos los
// CSVs de una vez (Encuesta + pasos del tour), el servidor los clasifica,
// cruza y calcula el resultado completo (población, Marca/Proveedor, TTFO,
// gatillo, alertas) en un dry-run; solo con `confirmar` en el form-data se
// escribe a hub/data/ (sin Supabase mientras las migraciones 039/040 sigan
// sin aplicar — decisión 2026-07-29).
//
// Cada carga de ESTA ruta trae el histórico COMPLETO de UserPilot (no hay
// export delta de CSV), así que reemplaza por completo lo guardado antes —
// no hace falta upsert/merge. Esta ruta es la línea base "histórica"
// (decisión de Kate, 04-ago-2026): de ahí en adelante, las cargas rutinarias
// de la automatización van por /importar-raw-data, que SUMA sobre lo que
// esta ruta dejó guardado, sin volver a pedir los CSV. Si en el mismo lote
// además se incluye un export "Raw Data", se empalma también acá (ver
// rawData.ts) — pero no es el camino esperado semana a semana.
//
// Un archivo con nombre/columnas irreconocibles no rompe el resto del lote —
// se lista aparte en `noReconocidos` para que se corrija y se vuelva a
// intentar, sin perder lo que sí se clasificó bien.

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

  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "No se pudo leer el formulario." }, { status: 400 });

  const archivos = form.getAll("archivos").filter((a): a is File => a instanceof File);
  if (archivos.length === 0) {
    return NextResponse.json({ error: "Faltan archivos (campo 'archivos')." }, { status: 400 });
  }
  const confirmar = form.get("confirmar") === "true";
  const mapeoOverrideRaw = form.get("mapeoOverride");
  const mapeoOverride: Record<string, SlotId> = mapeoOverrideRaw
    ? JSON.parse(String(mapeoOverrideRaw))
    : {};

  // ── Parseo + clasificación ──────────────────────────────────────────────
  const entradas: ArchivoEntrada[] = [];
  for (const archivo of archivos) {
    try {
      const filas = leerHojaComoFilas(await archivo.arrayBuffer());
      entradas.push({ nombreArchivo: archivo.name, filas });
    } catch {
      return NextResponse.json(
        { error: `No se pudo leer "${archivo.name}". Debe ser .csv o .xlsx.` }, { status: 400 });
    }
  }

  // Los archivos "Raw Data" de la automatización (Google Sheets → webhook
  // UserPilot) no calzan con ninguna de las 3 firmas de columnas normales
  // (Encuesta/Modal-Tour/Evento) — se separan antes de clasificar el resto,
  // se agregan aparte con parsearRawDataUserPilot, y se empalman al final.
  // Ver rawData.ts y la decisión de Kate (04-ago-2026).
  const entradasRawData = entradas.filter(e => esColumnasRawData(Object.keys(e.filas[0] ?? {})));
  const entradasNormales = entradas.filter(e => !entradasRawData.includes(e));

  const clasificacion = clasificarLote(entradasNormales);

  // Aplicar reasignaciones manuales del mapeo (paso de revisión editable).
  for (const archivo of clasificacion.mapeados) {
    if (mapeoOverride[archivo.nombreArchivo]) archivo.slot = mapeoOverride[archivo.nombreArchivo];
  }
  for (const archivo of clasificacion.noReconocidos) {
    if (mapeoOverride[archivo.nombreArchivo]) archivo.slot = mapeoOverride[archivo.nombreArchivo];
  }

  const filasPorNombre = new Map(entradasNormales.map(e => [e.nombreArchivo, e.filas]));
  const encuestaFilas = clasificacion.mapeados.find(a => a.slot === "encuesta");
  const encuestaHistorico = encuestaFilas ? parsearEncuesta(filasPorNombre.get(encuestaFilas.nombreArchivo) ?? []) : [];

  const modalOTourHistorico: SlotsParaCronologia["modalOTour"] = {};
  const eventoHistorico: SlotsParaCronologia["evento"] = {};
  for (const archivo of clasificacion.mapeados) {
    if (!archivo.slot || archivo.slot === "encuesta") continue;
    const filas = filasPorNombre.get(archivo.nombreArchivo) ?? [];
    if (archivo.familiaDetectada === "modal_o_tour") {
      modalOTourHistorico[archivo.slot] = parsearModalOTour(filas);
    } else if (archivo.familiaDetectada === "evento") {
      eventoHistorico[archivo.slot] = parsearEvento(filas);
    }
  }

  let encuesta = encuestaHistorico;
  let modalOTour: SlotsParaCronologia["modalOTour"] = modalOTourHistorico;
  let evento: SlotsParaCronologia["evento"] = eventoHistorico;
  let resumenRawData: { archivos: number; filasLeidas: number; usuariosEncuestaNuevos: number; corteEmpalme: string } | null = null;

  if (entradasRawData.length > 0) {
    const filasRawData = entradasRawData.flatMap(e => e.filas);
    const rawData = parsearRawDataUserPilot(filasRawData, CORTE_EMPALME_RAW_DATA);
    const empalmado = empalmarConRawData(
      { encuesta: encuestaHistorico, modalOTour: modalOTourHistorico, evento: eventoHistorico },
      rawData,
    );
    encuesta = empalmado.encuesta;
    modalOTour = empalmado.modalOTour;
    evento = empalmado.evento;
    resumenRawData = {
      archivos: entradasRawData.length,
      filasLeidas: filasRawData.length,
      usuariosEncuestaNuevos: rawData.encuesta.length,
      corteEmpalme: CORTE_EMPALME_RAW_DATA,
    };
  }

  // ── Exclusiones manuales persistidas ─────────────────────────────────────
  const exclusionesData = await leerExclusiones();
  const exclusionesManuales = new Map<number, ExclusionManual>(
    exclusionesData.map(e => [e.user_id, { userId: e.user_id, motivo: e.motivo }]),
  );

  const fechaCorte = new Date().toISOString().slice(0, 10);
  const { resultados, alertas, comparacionOnboarding, resumen, inferidosPorParalelismo } =
    calcularResultadoCompleto({ encuesta, modalOTour, evento }, exclusionesManuales, fechaCorte);

  const preview = { clasificacion, resumen, resumenRawData, alertas, comparacionOnboarding, inferidosPorParalelismo };

  if (!confirmar) {
    return NextResponse.json({ dryRun: true, ...preview, mensaje: "Nada escrito todavía. Confirmá para guardar." });
  }

  // ── Escritura (JSON local, ver almacenLocal.ts) ─────────────────────────
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
    archivos: [...clasificacion.mapeados, ...clasificacion.noReconocidos],
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
    await guardarCargaHistorica({ filas, alertas, comparacionOnboarding, ultimaImportacion }, { encuesta, modalOTour, evento });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error escribiendo el resultado local" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ...preview });
}
