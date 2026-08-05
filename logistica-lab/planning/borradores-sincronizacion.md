# Borradores de sincronización — Logistic Success

> Preparados el 2026-08-02 y revalidados contra Confluence el 2026-08-03. La cuenta genérica verificada es `producto@dropi.co` y fue autorizada expresamente para comenzar la sincronización documental. Esto autoriza contenido descriptivo y enlaces; **no** cambios de workflow, ownership o relaciones sin validar cada cruce. Ejecutar un cambio a la vez y volver a leerlo. Antes de publicar, consultar [`proyectos/_registro-confluence.md`](../proyectos/_registro-confluence.md): una página existente se reutiliza y las páginas de Laura permanecen en solo lectura.

## Registro de ejecución — 2026-08-02

| Proyecto | Jira | Confluence | Darwin | Drive/E2E |
|---|---|---|---|---|
| LOG-014 Fulfillment | PRM-1446 comentario `50931`, releído | Página `1572732930` creada e indexada, releída | Solo `summary` actualizado; gobierno intacto, releído | Escritura rechazada por salvaguarda del conector; **sin cambio parcial**. Requiere nueva aprobación explícita tras informar el riesgo. |
| LOG-016 POD | PRM-1517 comentario `50932`, releído | Página `1531772949` actualizada a v3 y releída | Solo `summary` actualizado; gobierno intacto, releído | Solo lectura estructural: 10 tabs, 1.404 párrafos, 129+ placeholders. Sin escritura. |
| LOG-001 Autoconfirmación | PRM-1497 comentario `50933`, releído; estado/owner/relaciones intactos | Página `1572864001` creada, indexada en `1531314208` v5 y releída | Borrador de `summary`; sin cambiar `Research` | No se encontró E2E dedicado; escritura bloqueada por salvaguarda. Evidencia local consolidada. |
| LOG-012 Autogeneración | PRM-1469 comentario `50934`, releído; gobierno intacto | Página `1572929537` creada, indexada en `1531314208` v6 y releída | Alineación `Proyecto/Discovery/Ideación` preparada; no aplicada en vivo | No se encontró E2E dedicado; sin escritura. |
| LOG-013 Recolección proactiva | PRM-1465 comentario `51003`, releído; PRM-1468→PRM-1465 confirmado; gobierno intacto | Sin página nueva; Warranties excluido | `044` aplicado/releído; solo presentación | Solo lectura: fuentes operativas y PROD auditados; sin escritura ni copia de data. RLS `043` bloqueada por 0 accesos `inidiana`. |
| LOG-004 · archivos de transportadoras | PRM-1219 comentario `51009`, releído; PRM-1150→PRM-203 confirmado; gobierno intacto | Sin página nueva; reutilizar Sistema Inteligente | `046` preparado, **no aplicado**: lectura externa bloqueada por límite del conector | GP/SOP/TO-BE leídos; hoja operativa no abierta ni copiada. Pendiente contrato de información y paridad. |
| Bug candidato · duplicidad Ecom | PRM-403 comentario `51012`, releído; gobierno intacto | Sin página: no es proyecto | No crear ficha Darwin | Jira auditado; falta reproducción actual con IDs anonimizados, sin copiar adjuntos/data. |

Correcciones materiales aplicadas: fases PROD no equivalen automáticamente a desarrollo; PROD-1072 se excluyó de POD porque corresponde a Print On Demand; token Veloces, código al destinatario y archivos de carriers quedaron separados.

## Orden de sincronización

1. Validar equivalencias y owner en Jira.
2. Ajustar Jira (fuente de clasificación/estado/relaciones) con la cuenta genérica autorizada.
3. Verificar que Darwin tenga el mismo `project_code`, estado y owner.
4. Actualizar E2E en Drive desde el spec.
5. Reutilizar la síntesis existente de Confluence y enlazar el E2E vivo. Crear página solo si el barrido anti-duplicados no encuentra canon y Jira/owner/alcance están confirmados.
6. Releer cada destino y registrar fecha/fuente.

## Jira — borradores

### LOG-001 · Autoconfirmación

**Aplicado y verificado:** comentario documental `50933` en PRM-1497. No se cambiaron estado, assignee ni relaciones.

> Corte documental 02-ago-2026. Se completaron seis pruebas moderadas de usabilidad del configurador entre el 18 y el 25-jul. El concepto obtuvo 81/100 de aceptación, pero solo 17% interpretó correctamente el impacto económico; 5/6 participantes pidieron visibilidad de ganancia/pérdida. Esto valida comprensión parcial, no impacto en movilización, entrega o devolución. Antes de handoff faltan: gate técnico y atribución con ChateaPro, reglas de duplicidad/ruralidad/variantes, instrumentación manual vs. motor y una prueba outcome. PRM-1574 es antecedente confirmado. PRM-1588/1589 describen una rama WhatsApp candidata, pero todavía no se comprobó que sea equivalente al configurador general ni que “confirmada sin guía” no pertenezca a LOG-012/PRM-1469. No se encontró E2E dedicado ni artefacto crudo canónico de las sesiones en Drive.

**No aplicar todavía:** una relación entre PRM-1497 y PRM-1588/1589 o cualquier reclasificación. Primero resolver la equivalencia semántica.

### LOG-013 · Recolección proactiva

**Aplicado y verificado:** comentario documental `51003` en PRM-1465; no se editaron descripción, estado, assignee ni relaciones.

> Corte documental 03-ago-2026. El historial y el enlace Polaris confirman que PRM-1468 (`Recolecciones y paquetes sin movilizar`) fue fusionada dentro de PRM-1465 (`Optimización de recolecciones`). PRM-1465 queda como principal candidato y ambos conectan con PRM-1497. La operación distingue pickups de carriers externos, carrier interno/cross-docking, una propuesta futura de PAU y la capa preventiva Hub/Indiana. El Hub todavía no persiste solicitud/gestión ni registra envío, acuse o resultado. PROD-821/1568/1800/1855 figuran Hecho sin descripción, adjuntos o enlaces; solo conservan comentarios automáticos de transición. STID/API encontrados pertenecen a Warranties/Garantías. México sigue ambiguo.

**Pendiente después del comentario:** Operación debe confirmar owner y frontera carrier externo/interno/PAU; recuperar entregables PROD; completar descripción, baseline, métrica, país/carrier y enlaces aprobados. No relacionar STID Warranties. Solo después se propone editar descripción/ownership; cualquier cambio se relee y no altera workflow por inferencia.

### LOG-012 · Autogeneración de guías

**Aplicado y verificado:** comentario documental `50934` en PRM-1469; no se editaron tipo, estado, assignee ni relación con INVS-67.

> Corte documental 02-ago-2026. LOG-012 se trata como proyecto/solicitud en investigación y definición, no como “segundo experimento” de Autoconfirmación. PRM-1469 e INVS-67 están sin descripción ni assignee. El Cell Board del 08-jul respalda el concepto para proveedores de alto volumen (generación por lotes, pendiente por imprimir y cola), pero no se encontró prueba propia ni outcome. Antes de handoff faltan recuperar el análisis previo Kevin/Lucho, segmentar la línea base de 10,37 h, validar lote/impresión, cerrar fallback bodega–carrier e idempotencia y ejecutar prueba con proveedores. El documento 2025 de guías de recolección/garantías es un homónimo excluido. La frase “confirmada sin guía” de PRM-1588/1589 se mantiene como frontera pendiente, no relación confirmada.

### Torre Logística + evidencias

> PROD-1706 es el discovery textual de Torre Logística + trazabilidad/evidencias; sus tareas PROD-1708–1711 siguen en backlog. DROP-18559, en cambio, registra la activación de Torre de Control México para efectividad por ciudad/carrier; STID-6894 reporta una limitación actual de filtros. LOG-011 mide tiempo por fases y LOG-016 gobierna POD. No fusionar por nombre: documentar usuario, decisión, eventos, país, granularidad y outcome.

### PRM-1341 / PRM-1144 · códigos postales México

**Solo nota de revisión; no aplicar aún:**

> Antecedentes candidatos para el problema de códigos postales/Sepomex del workshop México. PRM-1341 aborda captura/validación de datos y PRM-1144 cobertura/proceso de ciudades/códigos; hace falta confirmar fuente de catálogo, nivel de validación y experiencia objetivo antes de relacionarlos.

### PRM-1150 · archivos de información de transportadoras

**Aplicado y verificado en PRM-1219:** comentario documental `51009`. No se editaron estado, assignee ni relaciones; no se abrió ni copió la hoja operativa.

> El historial confirma que PRM-1150 fue fusionada en PRM-203 el 20-mar-2026 y está conectada con PRM-1219. No es un proyecto autónomo. PRM-1219 ya decidió no parsear Excel por fragilidad: V1 con documentos curados en Drive y tabla posterior desde fuente canónica. GP/SOP-101 describen el alta de carriers, un flujo adyacente que puede alimentar el catálogo pero no sustituye la fuente visible al dropshipper. Antes de retirar la fuente: data owner, diccionario, sensibilidad, productor/consumidor, frecuencia/SLA, control de versiones, paridad, migración y rollback. No publicar datos crudos, credenciales, endpoints, contratos, tarifas internas ni PII.

### Duplicidad Ecom / bodegas externas

**Comentario documental `51012` aplicado y verificado en PRM-403. No se cambió estado, assignee ni relación con DROP-6924. No marcar como duplicado aún:**

> PRM-403 figura finalizada aunque DROP-6924, su épica implementadora, sigue en backlog sin evidencia de entrega. DROP-6818 fue el hotfix y DROP-6876 registra una reversión sin descripción. El antecedente duplica una guía en manifiestos por múltiples clics en “Generar lote”; el workshop habla de pedidos duplicados en bodegas externas. Reproducir país, objeto, canal, retry/concurrencia, versión e idempotencia antes de decidir recurrencia o bug distinto.

### LOG-010 · token de devoluciones Veloces

**No aplicado en Jira ni en artefactos de Laura.**

> Corte documental 02-ago-2026. PRM-1523 (Proyecto OKR) y PRM-1580 (Oportunidad) están relacionados y permanecen en `En Ruta (backlog)`, sin assignee; PRM-1523 no tiene descripción. El token Veloces es un piloto/capacidad de conciliación de logística inversa: manifiesto previo, código a la bodega, recepción, novedades y firma. No evita la devolución, no confirma entrega al destinatario y no equivale a archivos de carriers. DROP-3455 y sus historias DROP-4595/4596 son antecedentes de Ecom Scanner; las historias siguen en backlog, por lo que no prueban integración Dropi. Juan acompaña/direcciona y no es owner del desarrollo. Antes de tocar Jira: validar vigencia de esas historias, owner, informe anonimizado del piloto y contrato de datos/contactos.

**Relación candidata, no ejecutar aún:** relacionar PRM-1523 con DROP-3455 solo si Producto/TI confirma equivalencia vigente. No marcar duplicidad, no reabrir historias y no crear un issue nuevo para el token.

### PROD-1045 · lanzamiento guías reemplazatorias (Laura)

**Estado:** ya existe y está relacionado a PRM-745/1380/1381. No crear duplicado.

> Referencia solamente; no editar el trabajo de Laura. La capacidad está construida y las PRM están en Versión Beta. Antes de ampliar: reconciliar el bloqueo/hotfix reportado el 27-jul con el balance positivo del 31-jul, enlazar bitácora del piloto, definir métrica y confirmar flags/cohortes. Comunicación, Tango y activación solo se consideran completos cuando PROD-1045 enlace el artefacto publicado.

## Drive / E2E — borradores de cierre

### Selección inteligente de transportadoras · LOG-004

- Reutilizar el kickoff de Kate y la síntesis Confluence existentes; no crear otro E2E o página por el alias “Sistema Inteligente”.
- Registrar la historia completa: PRM-203 → DROP-13739 → DROP-17946; PRM-1219 como ticket asignado para handoff; PRM-1513 como paraguas OKR; PRM-1150 como subfrente de catálogo/archivos; más las cadenas PROD de diseño, lanzamiento, seguimiento y handoff.
- Estado honesto: documentación/definición avanzada y POC iterado; no producción. PRM-1219 está asignado para handoff a Kate, pero DROP-17946 sigue En curso, PRM-1513 está sin assignee y PROD-1992 permanece en backlog como pendiente de handoff.
- Conservar decisiones V1/V2/V3, modelo de utilidad logística, apertura por riesgo y eventos HEART/Userpilot.
- No copiar exports crudos, correos, identificadores de usuarios ni archivos operativos de carriers. PRM-1150 se relaciona con el catálogo V1, pero el flujo/formato/frecuencia de los archivos se audita como línea separada. Referenciar el análisis de apertura por su síntesis anonimizada.
- Antes de handoff: squad y owner de delivery, arquitectura productiva, estimación, carga/índices, caracterización de carriers, instrumentación y evidencia de sesiones/piloto estables.

**Borrador de sincronización, no aplicado externamente:**

- **Jira:** no crear ni relacionar tickets nuevos. PRM-1219 ya conecta PRM-203, PRM-1150, PRM-1513, KR2.1 y OKR2; PROD-1992 ya cuelga de DROP-17946. Completar contenido de la historia de handoff antes de mover estado.
- **Confluence:** actualizar únicamente la página `1531936779` cuando su owner lo apruebe. Añadir PRM-1219 y la cadena PROD posterior; cambiar “POC listo para prueba/producción” por “POC de referencia, arquitectura productiva por definir”. No crear página nueva.
- **Darwin/Hub:** `project_code = LOG-004`, tipo Proyecto, fase Definición, handoff Pendiente; owner Kate mientras Jira mantenga PRM-1219/DROP-17946 asignados a ella. PRM-1513 se conserva como paraguas OKR, no como owner operativo.
- **Drive:** el kickoff continúa como fuente viva encontrada. Los apéndices citados —POC, simulaciones, clusters y sesiones— deben enlazarse donde estén, no copiarse a una nueva carpeta.

### Fulfillment · LOG-014

- Reconciliar las nueve fases con `proyectos/fulfillment/spec.md`.
- En Kick-off: problema de cobros no percibidos, actores, alcance y métrica económica con fuente.
- En Definición/Hand-off: modelo captura por bodega + corte por país, estados e idempotencia.
- Mantener como preguntas abiertas tarifas, IVA, rezagados, wallet, reverso y actor del corte.
- No presentar RPP como backend construido.
- Registrar la cadena PROD-238/648/785/995/1171/1330/1526 como avance de Producto, no como desarrollo.
- Registrar PROD-240 como épico técnico aún en backlog y STID-1960 como antecedente operativo.
- Corregir la falsa certeza “listo para handoff”: +68%/+78%, tarifas, triggers, país, wallet, reversos y actores siguen abiertos.

### POD · LOG-016

- Conservar Kick-off existente y completar solo lo respaldado por PRM/PROD/build.
- Separar evidencia por carrier y fase: ENVÍA finalizado; demás estados según lectura Jira vigente.
- Documentar foto/firma/sello/geolocalización y doble verificación.
- Dejar el código al destinatario en discovery y excluir expresamente el token Veloces y los archivos de carrier.

### Autoconfirmación y autogeneración · LOG-001/012

- Documentar experiencias separadas aunque compartan pantalla.
- Para LOG-001, trasladar al E2E la prueba moderada 18–25-jul: 6 usuarios, aceptación 81/100, T4 17%, hallazgos y límites. No llamarla prueba de impacto.
- Enlazar guion, grabaciones/consentimiento y matriz de observación cuando se identifique la fuente canónica.
- Adjuntar cada encuesta/Userpilot adicional con fuente, fecha, segmento, muestra, hallazgo y decisión.
- Hand-off a TI = N/A/condicional hasta validar el experimento y las reglas de datos.
- Guardarraíles comunes candidatos: duplicidad, zona/elegibilidad, idempotencia y recuperación manual.
- Para LOG-012, incorporar la clasificación `Solicitud/proyecto`, PRM-1469→INVS-67, análisis Kevin/Lucho pendiente, lotes/cola de impresión y dependencia de fallback carrier. Excluir explícitamente las guías de recolección de garantías de 2025.

### Recolección proactiva · LOG-013

- Crear/completar un solo E2E gobernado por PRM-1465; no reutilizar el E2E de Warranties ni crear una copia por país.
- Kick-off/Discovery: documentar por separado pickups externos, carrier interno/cross-docking, PAU futuro, canales por carrier, fija/esporádica, mínimos, cutoff, dedupe y visibilidad preventiva.
- Definición: separar módulo actual de la capa Indiana/Hub y acordar el ciclo solicitud → envío → acuse → resultado/causal.
- Following: registrar protocolo del piloto, carrier, muestra, baseline, ventana y criterio de éxito; recuperar los artefactos de PROD-1568/1800/821.
- Activación: aplicar/probar RLS, usuarios autorizados, soporte y rollback antes de datos reales.
- Hallazgos: tratar el volumen reportado como señal autodeclarada hasta reconciliar fuente, denominador y atribución; no copiar la cifra desde la fuente restringida.
- Referenciar SOP y data como restringidos; no copiar hojas, teléfonos, direcciones, credenciales ni enlaces internos de automatización.

### Devoluciones COD / token Veloces · LOG-010

- Conservar las nueve fases aunque el desarrollo del token sea externo.
- Enlazar capacitación y revisión de pendientes; referenciar la hoja de prueba como restringida, sin copiar filas ni contactos.
- Estado: piloto con flujo documentado. No afirmar impacto o rollout sin informe final.
- Separar KPI de devolución COD de KPI de discrepancias/cierre de manifiestos.
- Dejar Hand-off DEV como externo/por comprobar y registrar que Juan no es owner del desarrollo.
- No editar ni duplicar materiales de Laura; usarlos solo como referencias cuando correspondan.

## Confluence — borrador LOG-012

**Aplicado y verificado:** [LOG-012 · Autogeneración de guías — síntesis y gates](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572929537), página `1572929537`, indexada bajo `1531314208` v6.

> LOG-012 es una solicitud/proyecto en investigación y definición. Busca que proveedores de alto volumen generen en lote las guías de despacho de órdenes confirmadas y pasen a imprimir/alistar. Existe concepto/prototipo, pero no prueba propia ni evidencia outcome. Jira: PRM-1469 → INVS-67, ambos sin descripción/assignee. Gates: recuperar análisis Kevin/Lucho; segmentar baseline; definir lotes/cola, compatibilidad bodega–carrier, fallback, idempotencia y recuperación; validar con proveedores. No confundir con Autoconfirmación, guías reemplazatorias ni las guías de recolección/garantías lanzadas en 2025.

## Darwin — borrador LOG-012

> Proyecto/solicitud en discovery para generación automática de guías de despacho a proveedores de alto volumen. Concepto existente; pendientes contraevidencia Kevin/Lucho, baseline segmentado, lotes/impresión, fallback carrier, idempotencia y prueba propia. PRM-1469 → INVS-67.

Mapeo propuesto por limitación del enum: `type = Proyecto`, `status = Discovery`, `handoff_status = Experimentación`, `estado_interno = Ideación`. No aplicar en vivo hasta ejecutar y verificar la migración autorizada.

## Confluence — borrador LOG-001

**Aplicado y verificado:** [LOG-001 · Autoconfirmación — síntesis y gates](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572864001), página `1572864001`, indexada bajo `1531314208`.

> Autoconfirmación permanece en discovery. Entre el 18 y el 25-jul se realizaron seis sesiones moderadas con dropshippers/proveedores. La aceptación conceptual fue 81/100, pero la tarea de interpretar impacto económico tuvo 17% de éxito; la principal corrección es mostrar ganancia/pérdida antes de volver a probar. Este resultado no demuestra mejora de movilización, entrega o devolución. El handoff está condicionado al gate de ChateaPro, atribución manual/automática, guardarraíles y una prueba outcome. Jira principal: PRM-1497; oportunidad antecedente: PRM-1574; PRM-1588/1589 son una rama WhatsApp candidata cuya equivalencia está pendiente. No existe E2E dedicado localizado al corte.

**Enlaces incluidos:** PRM-1497/1574/1588/1589/1469. Pendiente añadir repo/spec cuando exista URL compartible y el E2E vivo cuando sea creado.

## Darwin — borrador LOG-001

> Discovery de autoconfirmación: prueba de usabilidad con 6 usuarios completada; aceptación 81/100, pero comprensión económica 17%. Pendientes gate ChateaPro, guardarraíles, trazabilidad manual/automática y prueba de impacto. Rama WhatsApp Jira aún no equivalente.

Mantener `estado_interno = Research` hasta que el equipo valide el cambio de fase; actualizar solo `summary` si se aprueba y releer la fila.

### Guías reemplazatorias · LOG-009

- [x] Auditar desarrollo, PRM, PROD y fuentes operativas sin editar artefactos de Laura.
- [ ] Localizar ticket/hotfix de la mesa Ecom Scanner del 27-jul y reconciliarlo con el reporte positivo del 31-jul.
- [ ] Completar Comunicación, Activación, Hallazgos y Checklist solo por enlaces/evidencia desde PROD-1045; no copiar ni reescribir el trabajo de Laura.
- [ ] Registrar cobertura por carrier, fecha de activación, error de lectura, soporte, rollback y decisión tras el piloto, usando agregados aprobados y sin datos confidenciales.

## Confluence — borrador de actualización del índice logístico

**Regla anti-duplicación validada el 2026-08-03:** el índice `1531314208` ya contiene 12 subpáginas. POD (`1531772949`), Fulfillment (`1572732930`), Autoconfirmación (`1572864001`), Autogeneración (`1572929537`), Validación de direcciones (`1530855466`), Sistema Inteligente de Transportadoras (`1531936779`), Same Day (`1531576355`), Normalización de estados (`1530560582`) y Prevención de Devoluciones (`1530560555`) se **actualizan o relacionan; no se vuelven a crear**. En Drive, la carpeta de POD contiene un único E2E, por lo que ese documento también se conserva como canónico.

Casos que no deben resolverse creando páginas nuevas:

- `Selección de Transportadoras` (`1530593304`) es un análisis previo de apertura; se relaciona con LOG-004 como antecedente hasta confirmar equivalencia con el sistema inteligente.
- `Combos (Logistic Success)` (`1531609123`) declara Supplier Success en su propia fuente: queda fuera de alcance y no se toca.
- `Data (Logistic Success)` (`1531347002`) no es un proyecto y apunta a hojas operativas. No se copia ni se enlaza desde el Hub; la página de Laura queda intacta como referencia excluida.
- No hay páginas localizadas por título para Tarifas, LOG-013/Recolección proactiva, Guías reemplazatorias o Torre Logística. Los endpoints de “recolecciones” encontrados pertenecen a Warranties/Garantías y no cubren LOG-013. Esto es un hueco de descubrimiento, no autorización para crear: primero validar Jira, owner y E2E.

> **Corte 2026-08-02.** El portafolio logístico usa Jira para estado/ownership, Darwin para presentación y Drive para el E2E vivo. El repo conserva specs y auditorías. Se cerraron specs iniciales de Fulfillment, POD y Autogeneración; siguen abiertos los gates listados en sus documentos. El intake México se mantiene como triaje, no como proyectos creados. LOG-013 concentra el frente de recolecciones. El token Veloces se registra dentro de LOG-010 y se distingue del código de seguridad al destinatario/POD.

Enlaces que solo se añadirán al índice existente cuando tengan URL compartible y aprobación; no implican páginas espejo:

- mapa de trazabilidad del repo;
- auditoría E2E;
- E2E Fulfillment y POD;
- workshop México;
- specs LOG-014, LOG-016 y LOG-012.

## Userpilot y encuestas de Laura — ficha reusable

**Lectura 02-ago-2026; solo referencia, sin cambios a Laura:** PROD-729 (instrumentación de Selección) y PROD-797 (microsurveys de Tarifas) están despriorizadas. PROD-577 define el dashboard/eventos de Selección, pero Jira no enlaza resultados. DROP-24402 entrega un export restringido con PII del módulo anterior; no copiar ni enlazar públicamente. PROD-1086 define la encuesta de Direcciones, pero Jira no demuestra campaña/resultados. Inventario: `proyectos/_fuentes-userpilot-logistica.md`.

| Campo | Valor requerido |
|---|---|
| Proyecto LOG / Jira | código y ticket que recibe la decisión |
| Fuente | campaña Userpilot, export, grabación o formulario exacto |
| Fecha | inicio/fin + fecha de extracción |
| Segmento | país, rol, volumen/madurez, canal y criterio de selección |
| Muestra | invitados, respuestas completas, abandonos |
| Pregunta/acción | texto o interacción medida |
| Hallazgo | observación sin interpretación |
| Decisión | regla/alcance/copy/experimento que cambia |
| Métrica posterior | evento visible o evento backend necesario |
| Owner | quién decide y quién implementa |

> Userpilot mide directamente interacciones visibles configuradas; para confirmar autoconfirmación, generación real de guía, entrega o devolución se necesita evento backend/consulta. No usar una encuesta como prueba de impacto operacional.
