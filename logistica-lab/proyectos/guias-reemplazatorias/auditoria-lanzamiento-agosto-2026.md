# Auditoría de lanzamiento · LOG-009 Guías reemplazatorias

> Corte: 2026-08-02. Alcance exclusivo de Logistic Success/Ecom Scanner. Este documento usa fuentes de Laura y del equipo como referencia; no las modifica ni replica datos operativos confidenciales.

## 1 · Conclusión ejecutiva

LOG-009 es una **capacidad construida en beta**, no un discovery nuevo. La cadena Jira técnica está finalizada y las tres oportunidades por transportadora están en `Versión Beta`. Sin embargo, no hay evidencia suficiente para afirmar que el lanzamiento global terminó:

- las fuentes de junio reportan pruebas satisfactorias y un piloto restringido;
- una mesa operativa del 27-jul vuelve a reportar bloqueos de lectura y acuerda hotfix + pruebas de campo;
- el Weekly Product del 31-jul afirma que la beta llevaba cerca de un mes funcionando bien y que era buen momento para desplegar, pero deja abierta la instrumentación de adopción y la campaña;
- PROD-1045 sigue en `En Ruta (backlog)`, sin resolución y sin enlaces a Tango, comunicación publicada, cohorte activada o cierre del monitoreo.

Clasificación correcta al corte: **beta con evidencia operativa por reconciliar; comunicación, activación e impacto no demostrados**.

## 2 · Qué es y qué no es

La capacidad reconoce una guía reemplazatoria en los flujos de Recepción y Gestión de devoluciones, resuelve la guía original y conserva la relación para trazabilidad.

No corresponde a:

- token de devolución de Veloces (LOG-010);
- código de seguridad que confirma entrega al destinatario (POD/LOG-016);
- archivos periódicos enviados por transportadoras;
- autogeneración de guías de despacho (LOG-012).

## 3 · Evidencia y cronología

| Fecha | Fuente | Evidencia utilizable | Lectura / límite |
|---|---|---|---|
| 23-jun | [Weekly Ecom/Logística](https://docs.google.com/document/d/17B6iNuZFamA4mt_rw4FtMphDE3sgK50jnn6l60v9Uws) | Funcionalidad reportada como operativa, con ajustes menores; decisión de probar y lanzar progresivamente. | Testimonio de equipo; no incluye bitácora ni métricas. |
| 24-jun | PRM-745, PRM-1380, PRM-1381 | Oportunidades separadas por transportadora, `Versión Beta`, conectadas a PRM-1288, implementación y PROD-1045. | Prueba trazabilidad y estado Jira, no resultado real. |
| 30-jun | [Weekly Ecom/Logística](https://docs.google.com/document/d/1bBhUeaObza-F5qc4mbhDML4f1M1wCyjhEZzpWShpRZk) | Se reporta operación con tres transportadoras, usuarios restringidos y monitoreo previo al despliegue global. | No se localizó reporte de cierre del monitoreo. |
| 27-jul | [ECOMSCANNER — requerimientos/mejoras](https://docs.google.com/document/d/1RuLTWCBUd6mrmQOhM8nW-e2nyzkl1R0IqPndDcmUGOE) | Operaciones reporta bloqueos para ciertos casos; se acuerdan hotfix, revisión de permisos/bodega y pruebas con operación. También se confirma que el diseño contempla cadenas de reemplazo. | Evidencia contradictoria: puede ser regresión, cobertura incompleta o regla de autorización; no asumir equivalencia con el problema original sin ticket/hotfix. |
| 31-jul | [Weekly Product](https://docs.google.com/document/d/1aCXC8LlrjdErjFovQvgATRBx0wRRFz4u8gvKAUa6SFo) | Juan reporta beta prolongada y pruebas satisfactorias en varias bodegas/proveedores; se propone despliegue y campaña de adopción. | La conversación confirma intención, no activación global ni medición. |
| 02-ago | PROD-1045 | Historia canónica de lanzamiento asignada a Laura: comunicar, crear Tango, beneficios y activar beta. Estado actual: backlog, sin resolución. | No crear historia paralela y no modificar el trabajo de Laura. |

## 4 · Trazabilidad canónica

| Capa | Registro | Rol |
|---|---|---|
| Producto / oportunidad | PRM-745 · PRM-1380 · PRM-1381 | Una oportunidad por transportadora; todas en beta. |
| Proyecto madre | PRM-1288 | Manejo de devoluciones. |
| Implementación | DROP-25407 · DROP-25564 · DROP-25614; antecedentes DROP-23090/25667 | Lectura, persistencia, web y correcciones. `Finalizada` no reemplaza validación operacional. |
| Lanzamiento | PROD-1045 | Única historia de comunicación/activación de Laura. |
| Repo | `guias-reemplazatorias/spec.md` + esta auditoría | Spec y evidencia; no sustituye Jira ni el E2E vivo. |

## 5 · Auditoría de las nueve fases E2E

| Fase | Estado | Evidencia / cierre requerido |
|---|---|---|
| Kick-off | Parcial | Problema y flujo claros; falta baseline operativo aprobable sin exponer datos sensibles. |
| Discovery | Parcial | Dolor y transportadoras confirmados; falta consolidar muestra, casos de borde y permisos por bodega. |
| Definición | Verificada para beta | Patrones, resolución a guía original, deduplicación y persistencia documentados. |
| Following | Parcial / contradictorio | Hay testimonios de buen funcionamiento y un incidente operativo posterior; falta bitácora única. |
| Hand-off DEV | Verificado | Cadena DROP finalizada y relacionada. Criterios de aceptación descritos, pero no se encontró acta de ejecución. |
| Comunicación | No verificada | PROD-1045 describe el trabajo; no se encontró pieza publicada ni Tango. |
| Activación | No verificada | Se reportó piloto restringido; faltan cohortes, fechas, flags y cobertura por país/bodega. |
| Hallazgos | Parcial | Existen testimonios cualitativos; faltan resultados trazables de lectura/adopción y decisión por carrier. |
| Checklist | Abierto | No hay evidencia de cierre global ni reversibilidad/soporte probados. |

## 6 · Gate de activación y despliegue

Antes de marcar lanzamiento completo, PROD-1045 o el E2E deben enlazar evidencia de:

- versión desplegada y estado del feature flag `return_guide`;
- cohorte beta por país, bodega, rol y transportadora, sin publicar datos personales;
- casos exitosos y fallidos por patrón, incluidos reemplazos encadenados;
- comportamiento cuando la guía no pertenece a la bodega/usuario y cuando no es de Dropi;
- deduplicación cruzada entre guía original y reemplazatoria;
- contingencia ante caída o error de `dropi-logistic`;
- soporte/override operativo para falsos positivos o bloqueos;
- cierre del hotfix o ticket surgido de la mesa del 27-jul;
- Tango/paso a paso, mensaje, audiencia, canal de soporte y fecha de comunicación;
- decisión registrada: ampliar, mantener beta, corregir o revertir.

## 7 · Medición sin datos confidenciales

Registrar agregados con fuente, ventana y denominador; no copiar órdenes, guías, usuarios ni cifras de producción al repo o Confluence.

| Señal | Definición mínima | Decisión que alimenta |
|---|---|---|
| Cobertura de lectura | intentos resueltos a guía original / intentos con patrón, por carrier | ampliar o corregir patrón/integración |
| Error técnico | fallos 4xx/5xx/timeout por intento | hotfix, fallback o rollback |
| Falso positivo | lectura que coincide con patrón pero no es reemplazatoria válida | ajustar patrón o añadir override |
| Duplicado evitado | intento rechazado por original/reemplazatoria ya registrada | validar deduplicación |
| Adopción | bodegas/cohortes que usan scanner sobre elegibles | campaña y activación |
| Caso no resuelto | paquete físico sin vínculo operativo verificable | soporte y no ampliar cohorte |

## 8 · Riesgos abiertos

| Riesgo | Evidencia | Mitigación / gate |
|---|---|---|
| Regla de bodega/usuario bloquea devoluciones válidas | Mesa 27-jul | Separar autorización, captura y visibilidad; probar con escenarios reales. |
| Patrón produce falso positivo | Riesgo conocido en DROP-25407 | Telemetría, validación server-side y override controlado. |
| Dependencia de `dropi-logistic` impide recibir | Riesgo conocido en DROP-25407 | Timeout/fallback, cola de reintento y procedimiento operativo. |
| No existe override manual | Riesgo conocido en DROP-25407 | Definir rol, auditoría y recuperación antes de global. |
| Campaña sin medición | Weekly Product 31-jul | Definir baseline/eventos antes de comunicación masiva. |
| Exposición de datos operativos | Fuentes internas | Mantener fuentes restringidas; publicar solo síntesis y agregados aprobados. |

## 9 · Pendientes concretos

- [ ] Localizar el ticket/hotfix asociado a la mesa del 27-jul y determinar si fue regresión, permiso o cobertura.
- [ ] Recuperar bitácora del piloto y cierre de las tres semanas.
- [ ] Identificar cohortes y flags por carrier/país sin publicar datos sensibles.
- [ ] Enlazar evidencia de Tango/comunicación si Laura la publica; no editar su artefacto.
- [ ] Definir dashboard o consulta agregada de adopción, lectura y errores.
- [ ] Registrar decisión de rollout por carrier y gate de rollback.

