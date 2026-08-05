# Auditoría de fuentes · LOG-012 Autogeneración de guías

> Corte: 2026-08-02. Objetivo: reconciliar clasificación, alcance, evidencia y homónimos antes de modificar relaciones o promover el proyecto a handoff.

## Dictamen

LOG-012 es un **proyecto/solicitud en investigación y definición**. Tiene una hipótesis que podrá probarse como experimento, pero el proyecto no es en sí “el segundo experimento” de Autoconfirmación. El prototipo demuestra una dirección de solución; no demuestra necesidad, viabilidad ni outcome.

## Registro de fuentes

| Fuente | Hecho que sí soporta | Lo que no soporta |
|---|---|---|
| PRM-1469 | tipo Solicitud; estado `Inv. y definición`; título para proveedores de alto volumen; enlace a INVS-67 | no tiene descripción, assignee, comentarios, criterio de éxito ni evidencia |
| INVS-67 | intake creado 28-abr por Juan; Backlog; relación con PRM-1469 | no contiene solicitud original, adjuntos ni responsable |
| Cell Board 08-jul | concepto junto a Autoconfirmación; proveedor de alto volumen; filtrar pendiente por imprimir; lotes y cola de impresión; meta de fase conversada en 4 h | no prueba que proveedores lo usen ni que ahorre tiempo |
| Juan/Maria 16-jul | Maria lo llama solicitud y pide ubicarlo como proyecto en definición, separado de iniciativas propias | no decide owner ni readiness |
| Weekly Ecom 14-jul | necesidad planteada; reunión por hacer con José/Lucho; referencia a exploración previa de Kevin que habría relativizado el problema | el análisis de Kevin no está adjunto; es testimonio indirecto |
| Weekly Product 23-jul | la selección/fallback de carrier condiciona la generación automática; confirma riesgo de cobertura/recaudo | el comentario sobre pruebas con usuarios aparece en otro bloque y no prueba una prueba propia de LOG-012 |
| Hub weekly | referencia agregada 10,37 h; 3,20 M de órdenes; 325 K críticas; 89,84% de cumplimiento | no enlaza consulta original ni segmentación reproducible |
| RPP branch | existe una superficie conceptual compartida con Autoconfirmación | no está mergeada ni prueba backend, idempotencia o producción |
| Hoja “Estado de los proyectos 23/07” · LS | una fila de Autogeneración en Discovery / Concepción de experimento | no tiene ticket ni detalle; no gobierna clasificación |
| Drive “Lanzamiento generación automática de guías de recolección” (2025) | existe una capacidad anterior para garantías/recolección con selección de órdenes y carrier | no es autogeneración de guía de despacho al confirmar |
| PROD-1729 | épica amplia de mejoras de gestión de órdenes del seller | no está relacionada con PRM-1469 y el copy local “150 guías” no es evidencia canónica |

## Colisiones semánticas que no deben fusionarse

| Concepto | Diferencia |
|---|---|
| LOG-001 Autoconfirmación | decide si confirmar una orden; actor principal dropshipper/regla de madurez |
| LOG-012 Autogeneración | crea la guía tras confirmación válida; actor principal proveedor/operación de impresión |
| Guías de recolección de garantías 2025 | el usuario selecciona órdenes y carrier para generar guías de retorno/recolección |
| PRM-1588/1589 WhatsApp | recupera/continúa órdenes vía WhatsApp; “confirmada sin guía” es una frontera pendiente, no equivalencia |
| Guías reemplazatorias LOG-009 | sustituye/lee una guía ante novedad; no genera automáticamente el despacho inicial |

## Definition of Ready auditada

| Gate | Estado | Evidencia / hueco |
|---|---|---|
| Problema raíz | 🟡 | fricción y tiempo agregado identificados; contraevidencia Kevin no recuperada |
| Hipótesis | 🟡 | formulada en spec; falta acordarla con owner y actores |
| Métrica + baseline | 🟡 | 10,37 h agregado; falta consulta original, cohorte y calidad/error |
| Datos | 🔴 | no hay contrato físico ni `generation_source`, `batch_id`, fallback o errores definidos |
| Dependencias | 🟡 | LOG-004/carrier, bodega, impresión, TI y operación identificados; owners pendientes |
| Usuarios | 🔴 | no existe muestra ni artefacto de prueba propio localizado |
| Handoff | ⛔ | no listo; Jira sin descripción/assignee y E2E inexistente |

## Prueba mínima recomendada

Antes de construir backend:

1. recuperar el análisis de Kevin/Lucho y confrontarlo con la lectura de 10,37 h;
2. segmentar proveedores por volumen, país, bodega y carrier;
3. observar a 5–8 proveedores ejecutando generación e impresión en lote;
4. medir tiempo activo, esperas, tamaño de lote, fallos y reintentos;
5. probar el prototipo con casos de cobertura, recaudo, parcial, duplicada y guía existente;
6. cerrar contrato de datos e idempotencia;
7. solo entonces diseñar un piloto outcome.

## Criterio de salida

El discovery no se considera listo hasta responder con evidencia:

- qué segmento tiene el problema y cuánto tiempo recuperable pierde;
- si el cuello está en generar, imprimir, alistar o elegir carrier;
- qué porcentaje de lotes falla y por qué;
- quién configura/activa y quién recupera el error;
- cómo se evita crear dos guías;
- cuál es el fallback cuando la combinación bodega–carrier no es elegible.
