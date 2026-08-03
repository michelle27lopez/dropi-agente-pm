import { NextRequest, NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { requireUser } from "@/lib/require-auth";
import {
  clasificarLote, type ArchivoEntrada,
  parsearEncuesta, parsearModalOTour, parsearEvento,
  construirLineaDeTiempo, type SlotsParaCronologia,
  calcularCohorte, calcularAlertas,
  calcularComparacionOnboarding, CORTE_COHORTE,
  type ExclusionManual, type FilaCruda, type SlotId,
} from "@/lib/onboarding-ttfo";
import { leerExclusiones, guardarResultado, type FilaGuardada } from "@/lib/onboarding-ttfo/almacenLocal";

// Carga de un corte de cohorte para la pizarra de Onboarding TTFO — sube
// todos los CSVs de una vez (Encuesta + pasos del tour), el servidor los
// clasifica, cruza y calcula el resultado completo (población, Marca/
// Proveedor, TTFO, gatillo, alertas) en un dry-run; solo con `confirmar` en
// el form-data se escribe a hub/data/onboarding-ttfo.json (sin Supabase
// mientras las migraciones 039/040 sigan sin aplicar — decisión 2026-07-29).
// Cada carga trae el histórico COMPLETO de UserPilot (no hay export delta),
// así que el resultado calculado en esta corrida ya reemplaza al anterior
// por completo — no hace falta upsert/merge contra lo guardado antes.
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

  const clasificacion = clasificarLote(entradas);

  // Aplicar reasignaciones manuales del mapeo (paso de revisión editable).
  for (const archivo of clasificacion.mapeados) {
    if (mapeoOverride[archivo.nombreArchivo]) archivo.slot = mapeoOverride[archivo.nombreArchivo];
  }
  for (const archivo of clasificacion.noReconocidos) {
    if (mapeoOverride[archivo.nombreArchivo]) archivo.slot = mapeoOverride[archivo.nombreArchivo];
  }

  const filasPorNombre = new Map(entradas.map(e => [e.nombreArchivo, e.filas]));
  const encuestaFilas = clasificacion.mapeados.find(a => a.slot === "encuesta");
  const encuesta = encuestaFilas ? parsearEncuesta(filasPorNombre.get(encuestaFilas.nombreArchivo) ?? []) : [];

  const modalOTour: SlotsParaCronologia["modalOTour"] = {};
  const evento: SlotsParaCronologia["evento"] = {};
  for (const archivo of clasificacion.mapeados) {
    if (!archivo.slot || archivo.slot === "encuesta") continue;
    const filas = filasPorNombre.get(archivo.nombreArchivo) ?? [];
    if (archivo.familiaDetectada === "modal_o_tour") {
      modalOTour[archivo.slot] = parsearModalOTour(filas);
    } else if (archivo.familiaDetectada === "evento") {
      evento[archivo.slot] = parsearEvento(filas);
    }
  }

  const lineas = construirLineaDeTiempo({ encuesta, modalOTour, evento });

  // ── Exclusiones manuales persistidas ─────────────────────────────────────
  const exclusionesData = await leerExclusiones();
  const exclusionesManuales = new Map<number, ExclusionManual>(
    exclusionesData.map(e => [e.user_id, { userId: e.user_id, motivo: e.motivo }]),
  );

  const fechaCorte = new Date().toISOString().slice(0, 10);
  const resultados = calcularCohorte(lineas, fechaCorte, exclusionesManuales);
  const alertas = calcularAlertas(resultados, lineas);

  // Comparación "con onboarding vs. sin él" — usa la Encuesta COMPLETA (sin
  // filtrar al cohorte desde CORTE_COHORTE), porque necesita también a los
  // encuestados de antes del 28-jul, que calcularCohorte descarta a propósito.
  const comparacionOnboarding = calcularComparacionOnboarding(
    encuesta,
    evento.evento_enviar_cliente ?? [],
    modalOTour.modal_felicidades_orden_manual ?? [],
    exclusionesManuales,
    CORTE_COHORTE,
  );

  const resumen = {
    poblacion: resultados.length,
    activadas: resultados.filter(r => r.primeraOrden !== null).length,
    exito: resultados.filter(r => r.estadoMeta7d === "exito").length,
    fracaso: resultados.filter(r => r.estadoMeta7d === "fracaso").length,
    enObservacion: resultados.filter(r => r.estadoMeta7d === "en_observacion").length,
    cuentasDePrueba: resultados.filter(r => r.esPrueba).length,
  };

  const preview = {
    clasificacion,
    resumen,
    alertas,
    comparacionOnboarding,
    // Casos a revisar a mano: el modal final se disparó sin fila directa en
    // el evento correspondiente (resuelto por la regla de paralelismo, pero
    // no lo escondemos — se marca como inferido).
    inferidosPorParalelismo: resultados
      .filter(r => r.primeraOrden !== null && r.caminos.some(c => c.camino === "orden_manual"))
      .map(r => r.userId)
      .filter(userId => {
        const linea = lineas.get(userId);
        const evento = linea?.pasos.evento_enviar_cliente;
        return !(evento && typeof evento === "object" && "totalOcurrencias" in evento);
      }),
  };

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
    await guardarResultado({ filas, alertas, comparacionOnboarding, ultimaImportacion });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error escribiendo el resultado local" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, ...preview });
}
