// Script desechable: corre el pipeline de Onboarding TTFO directo sobre los
// CSVs de agente-delivery/Documentos/Activacion_TFFO/, sin pasar por
// Supabase ni por la UI del hub. Para mostrar resultado real hoy mismo,
// sin depender de que el proyecto compartido ya tenga las migraciones.
import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import {
  clasificarLote, type ArchivoEntrada,
  parsearEncuesta, parsearModalOTour, parsearEvento,
  construirLineaDeTiempo, type SlotsParaCronologia,
  calcularCohorte, calcularAlertas,
  calcularComparacionOnboarding, CORTE_COHORTE,
  type ExclusionManual, type FilaCruda,
} from "../src/lib/onboarding-ttfo";

const CARPETA = path.resolve(
  __dirname,
  "../../agente-delivery/Documentos/Activacion_TFFO",
);

function leerCSVComoFilas(rutaArchivo: string): FilaCruda[] {
  const buffer = fs.readFileSync(rutaArchivo);
  const libro = XLSX.read(buffer, { type: "buffer" });
  const hoja = libro.Sheets[libro.SheetNames[0]];
  return XLSX.utils.sheet_to_json<FilaCruda>(hoja, { defval: null });
}

function main() {
  const nombresArchivos = fs.readdirSync(CARPETA).filter(n => n.toLowerCase().endsWith(".csv"));
  const entradas: ArchivoEntrada[] = nombresArchivos.map(nombreArchivo => ({
    nombreArchivo,
    filas: leerCSVComoFilas(path.join(CARPETA, nombreArchivo)),
  }));

  console.log(`\n📂 ${entradas.length} archivos leídos de Activacion_TFFO/`);

  const clasificacion = clasificarLote(entradas);
  console.log(`\n=== CLASIFICACIÓN ===`);
  for (const a of clasificacion.mapeados) console.log(`  ✓ ${a.nombreArchivo} → ${a.slot} (${a.filas} filas)`);
  for (const a of clasificacion.noReconocidos) console.log(`  ✗ NO RECONOCIDO: ${a.nombreArchivo}`);
  if (clasificacion.faltantes.length) console.log(`  ⚠ Faltantes: ${clasificacion.faltantes.join(", ")}`);
  if (clasificacion.duplicados.length) console.log(`  ⚠ Duplicados: ${JSON.stringify(clasificacion.duplicados)}`);
  if (clasificacion.conflictos.length) console.log(`  ⚠ Conflictos: ${JSON.stringify(clasificacion.conflictos)}`);

  const filasPorNombre = new Map(entradas.map(e => [e.nombreArchivo, e.filas]));
  const encuestaArchivo = clasificacion.mapeados.find(a => a.slot === "encuesta");
  const encuesta = encuestaArchivo ? parsearEncuesta(filasPorNombre.get(encuestaArchivo.nombreArchivo) ?? []) : [];

  const modalOTour: SlotsParaCronologia["modalOTour"] = {};
  const evento: SlotsParaCronologia["evento"] = {};
  for (const archivo of clasificacion.mapeados) {
    if (!archivo.slot || archivo.slot === "encuesta") continue;
    const filas = filasPorNombre.get(archivo.nombreArchivo) ?? [];
    if (archivo.familiaDetectada === "modal_o_tour") modalOTour[archivo.slot] = parsearModalOTour(filas);
    else if (archivo.familiaDetectada === "evento") evento[archivo.slot] = parsearEvento(filas);
  }

  const lineas = construirLineaDeTiempo({ encuesta, modalOTour, evento });

  // Sin conexión a Supabase en este script: exclusiones manuales vacías (solo
  // aplica exclusión por patrón — Usuario Prueba / dominios desechables).
  const exclusionesManuales = new Map<number, ExclusionManual>();

  const fechaCorte = new Date().toISOString().slice(0, 10);
  const resultados = calcularCohorte(lineas, fechaCorte, exclusionesManuales);
  const alertas = calcularAlertas(resultados, lineas);
  const comparacion = calcularComparacionOnboarding(
    encuesta,
    evento.evento_enviar_cliente ?? [],
    modalOTour.modal_felicidades_orden_manual ?? [],
    exclusionesManuales,
    CORTE_COHORTE,
  );

  console.log(`\n=== COHORTE (Encuesta con Submitted At >= ${CORTE_COHORTE}) ===`);
  console.log(`  Población: ${resultados.length}`);
  console.log(`  Cuentas de prueba (excluidas de alertas): ${resultados.filter(r => r.esPrueba).length}`);
  const activados = resultados.filter(r => r.primeraOrden !== null && !r.esPrueba);
  const sinPrueba = resultados.filter(r => !r.esPrueba);
  console.log(`  Activados (proxy = evento/modal orden manual): ${activados.length} de ${sinPrueba.length}`);
  console.log(`  Éxito (<=7 días): ${sinPrueba.filter(r => r.estadoMeta7d === "exito").length}`);
  console.log(`  Fracaso (>7 días, ventana cerrada): ${sinPrueba.filter(r => r.estadoMeta7d === "fracaso").length}`);
  console.log(`  En observación: ${sinPrueba.filter(r => r.estadoMeta7d === "en_observacion").length}`);

  const porSegmento = (seg: "marca" | "proveedor") => resultados.filter(r => !r.esPrueba && r.segmento === seg).length;
  console.log(`  Marca: ${porSegmento("marca")} | Proveedor: ${porSegmento("proveedor")}`);

  console.log(`\n=== ALERTA A: flujo completo + orden creada (gatillo cerrado) ===`);
  console.log(`  ${alertas.flujoCompletoYOrden.length} usuarios`);

  console.log(`\n=== ALERTA B: orden creada SIN completar el flujo ===`);
  console.log(`  ${alertas.ordenSinFlujo.length} usuarios`);

  console.log(`\n=== ALERTA C: población y caída por paso (dentro del cohorte, sin pruebas) ===`);
  for (const paso of alertas.mayorCaidaPorPaso) {
    console.log(`  ${paso.slot}: ${paso.poblacion} (caída ${paso.caidaAbsoluta} / ${(paso.caidaRelativa * 100).toFixed(1)}%)`);
  }

  console.log(`\n=== ALERTA D: Marca vs Proveedor — avanzan al menos 1 paso ===`);
  console.log(`  Marca: ${alertas.segmentoConMasCaida.marca.avanzan}/${alertas.segmentoConMasCaida.marca.poblacion} (${(alertas.segmentoConMasCaida.marca.pct * 100).toFixed(1)}%)`);
  console.log(`  Proveedor: ${alertas.segmentoConMasCaida.proveedor.avanzan}/${alertas.segmentoConMasCaida.proveedor.poblacion} (${(alertas.segmentoConMasCaida.proveedor.pct * 100).toFixed(1)}%)`);

  console.log(`\n=== COMPARACIÓN: con onboarding guiado (>= ${CORTE_COHORTE}) vs. sin él (Encuesta completa desde marzo) ===`);
  console.log(`  Cuentas de prueba excluidas: ${comparacion.cuentasDePrueba}`);
  const imprimeGrupo = (nombre: string, g: typeof comparacion.conOnboarding) => {
    console.log(`  ${nombre}: población=${g.poblacion} activados=${g.activados} (${(g.pctActivados * 100).toFixed(1)}%) TTFO mediana=${g.ttfoMedianaDias ?? "s/d"}d promedio=${g.ttfoPromedioDias?.toFixed(1) ?? "s/d"}d`);
    console.log(`    Marca: población=${g.marca.poblacion} activados=${g.marca.activados} (${(g.marca.pctActivados * 100).toFixed(1)}%) mediana=${g.marca.ttfoMedianaDias ?? "s/d"}d`);
    console.log(`    Proveedor: población=${g.proveedor.poblacion} activados=${g.proveedor.activados} (${(g.proveedor.pctActivados * 100).toFixed(1)}%) mediana=${g.proveedor.ttfoMedianaDias ?? "s/d"}d`);
  };
  imprimeGrupo("SIN onboarding guiado", comparacion.sinOnboarding);
  imprimeGrupo("CON onboarding guiado", comparacion.conOnboarding);

  fs.writeFileSync(
    path.resolve(__dirname, "../../agente-delivery/Documentos/_resultado-analisis-carpeta.json"),
    JSON.stringify({ clasificacion, resumenCohorte: {
      poblacion: resultados.length,
      cuentasDePrueba: resultados.filter(r => r.esPrueba).length,
      activados: activados.length,
      exito: sinPrueba.filter(r => r.estadoMeta7d === "exito").length,
      fracaso: sinPrueba.filter(r => r.estadoMeta7d === "fracaso").length,
      enObservacion: sinPrueba.filter(r => r.estadoMeta7d === "en_observacion").length,
      marca: porSegmento("marca"),
      proveedor: porSegmento("proveedor"),
    }, alertas, comparacion }, null, 2),
  );
  console.log(`\n📄 Resultado completo guardado en agente-delivery/Documentos/_resultado-analisis-carpeta.json`);
}

main();
