# Fuentes Userpilot y encuestas — Logistic Success

> Corte: 2026-08-02. Inventario de solo lectura. Los artefactos e historias de Laura permanecen intactos y se usan únicamente como referencia. No se copian IDs, nombres, correos, respuestas individuales ni enlaces directos a exports con PII.

## Regla de evidencia

Una historia Jira en `hecho` puede significar que se definió una encuesta, un dashboard o un tracking; no demuestra que la campaña corrió ni que exista un resultado. Se distinguen cuatro niveles:

1. **Definición:** preguntas, eventos y métricas escritos.
2. **Instrumentación:** tags/eventos/campaña configurados y verificados.
3. **Datos:** export o dashboard con periodo y población.
4. **Hallazgo/decisión:** síntesis anonimizada que cambia una regla, alcance o experimento.

## Inventario por proyecto

| Proyecto | Fuente de referencia | Estado verificable | Datos/hallazgo disponible | Uso correcto |
|---|---|---|---|---|
| LOG-004 Selección de transportadoras | PROD-576 | `hecho`; lanzamiento relacionado con PROD-432 | Descripción extensa del alcance, no resultados | Antecedente de lanzamiento; no prueba adopción ni outcome |
| LOG-004 | PROD-729 “Userpilot y eventos” | **Despriorizada**; clonada de PROD-576 | No attachments ni resultado; solo cambio de workflow | Evidencia de que la instrumentación/lanzamiento Userpilot no quedó cerrada |
| LOG-004 | PROD-577 dashboard Userpilot | `hecho` | Define funnels/eventos HEART; sin enlace, attachment ni cifras en Jira | Especificación de medición, no dashboard verificado |
| LOG-004 | DROP-24402 tracking del módulo | `Finalizada` | Comentario de Laura enlaza un export restringido entregado a Kate | Fuente primaria candidata del uso del módulo anterior; requiere agregación anonimizada |
| LOG-006 Tarifas | PROD-797 microsurveys | **Despriorizada** | Comentario 31-jul: proyecto aún sin desarrollo, revisar cantidad de surveys y esperar lanzamiento | No hay campaña ni respuestas; conservar como borrador de medición |
| LOG-002 Direcciones | PROD-1086 encuesta | `hecho` | Define población, trigger, duración y preguntas; no hay link/attachment/comentario con resultados | Definición/configuración probable; no inferir que alcanzó muestra ni que produjo hallazgos |
| Ecom Scanner / devoluciones | Weekly Ecom 23-jun | Matriz de eventos preparada para adaptar a Userpilot | La reunión habla de empezar a medir, no de resultados | Antecedente de instrumentación; no outcome |

## Export restringido de Transportadoras

La hoja entregada en DROP-24402 se titula “Data transportadoras - 05/05/2026”. Su pestaña principal tiene una cuadrícula de gran volumen y encabezados que incluyen `User ID`, nombre, correo, rol, vistas, compañía y fechas de uso. Una segunda pestaña contiene un diccionario de campos para sesiones con acción, frecuencia, volumen y rol.

Decisiones de seguridad:

- no guardar el enlace directo en Darwin, Confluence, specs públicos ni la página de oportunidades;
- no copiar filas o identificadores al repo;
- no equiparar el número de filas con usuarios únicos ni con adopción;
- solicitar una vista agregada por cohorte/periodo/país, con mínimos de grupo y sin correos;
- definir retención y acceso antes de usar el export para reclutamiento o segmentación.

Además, el export corresponde al uso del módulo existente de preferencias de transportadoras. Puede informar cohortes para discovery, pero no demuestra que la recomendación inteligente aumente entrega, reduzca devolución o ahorre tiempo.

## Eventos definidos para LOG-004

PROD-577 especifica, entre otros, apertura del módulo, ejecución individual/global/lote, apertura de confirmación, guardado, ajuste manual, alertas de presupuesto y consulta de detalle. La estructura cubre Adoption, Task Success, Engagement, Happiness y Retention.

Vacíos antes de considerarla medición activa:

- confirmar que cada evento existe en producción y se dispara una sola vez con propiedades válidas;
- confirmar ambiente, país, rol, versión y fecha inicial de captura;
- comprobar enlace y permisos del dashboard;
- establecer denominadores: elegibles, expuestos, activos y guardados;
- unir Userpilot con evento backend de configuración efectiva y, para outcome, con entrega/devolución;
- excluir cuentas internas/bots y documentar consentimiento/retención.

## Encuestas de Tarifas y Direcciones

### Tarifas — PROD-797

La historia contiene siete microsurveys y reglas de supresión, pero fue despriorizada porque el proyecto todavía no estaba en desarrollo. El propio comentario pide simplificar la cantidad y esperar fecha de lanzamiento. Por tanto:

- estado documental: **borrador de medición**;
- respuestas: **no demostradas**;
- decisión: revisar triggers y reducir carga antes de reactivar;
- Laura: referencia/owner histórico; no editar su historia.

### Direcciones — PROD-1086

La historia define una encuesta a dropshippers de Colombia, disparada al crear una orden y con cierre por tiempo o muestra. Jira no contiene enlace de campaña, export, resultados ni decisión posterior. Por tanto:

- estado documental: **encuesta definida / ejecución no comprobada**;
- no usar el estado `hecho` como prueba de respuestas;
- pedir fuente de campaña, fechas reales, invitados/expuestos, respuestas, abandonos y síntesis anonimizada;
- mantener PRM-1341/1144 separados hasta que el hallazgo realmente informe cobertura/Sepomex o captura de datos.

## Ficha mínima para incorporar un resultado

| Campo | Requisito |
|---|---|
| Proyecto LOG / Jira | código y ticket que recibe la decisión |
| Fuente | campaña/dashboard/export exacto, con acceso restringido si contiene PII |
| Estado de fuente | definición / instrumentación / datos / hallazgo |
| Periodo | inicio, fin y fecha de extracción |
| Población | país, rol, elegibles, expuestos y criterio de inclusión |
| Muestra | usuarios únicos, respuestas completas y abandonos; nunca filas brutas como N |
| Hallazgo | agregado observado, separado de interpretación |
| Decisión | regla, alcance, copy o experimento que cambia |
| Outcome | evento backend y ventana; no solo clic o percepción |
| Privacidad | owner, acceso, retención, anonimización y mínimo de cohorte |

## Pendientes

- [ ] Solicitar síntesis anonimizada del export DROP-24402 y validar periodo/cobertura real.
- [ ] Verificar eventos y dashboard PROD-577 contra Userpilot, no solo Jira.
- [ ] Confirmar si PROD-1086 se publicó y localizar su resultado; si no, dejarla como definición.
- [ ] Mantener PROD-797 despriorizada hasta que LOG-006 tenga lanzamiento y triggers verificables.
- [ ] Para Ecom Scanner, localizar la matriz de eventos mencionada el 23-jun y comprobar implementación.
- [ ] Enlazar únicamente agregados aprobados al E2E; materiales de Laura permanecen sin edición.
