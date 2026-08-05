# Auditoría operativa y de paridad · LOG-013 Recolección proactiva

> Corte: 2026-08-03. Auditoría de lectura sobre Jira, Confluence y Drive, con contraste técnico del Hub. Única escritura externa: comentario documental Jira `51003` en PRM-1465, releído; descripción, estado, assignee y relaciones quedaron intactos. Las fuentes restringidas se describen sin copiar credenciales, PII, filas, URLs internas de automatización ni enlaces a hojas crudas.

## 1 · Corrección de frontera

La expresión **panel de recolecciones** estaba agrupando objetos diferentes. Al corte se distinguen seis:

| Objeto | Propósito | Evidencia | Decisión |
|---|---|---|---|
| Pickups con carriers externos | Recibir solicitudes de proveedores/emprendedores, validar duplicados, programar por carrier y aprobar tras confirmación | GP-512/SOP restringidos; reuniones 14/23-jul | Operación vigente que LOG-013 debe comprender. Combina automatización parcial y archivos/canales manuales. |
| Carrier interno / cross-docking | Recoger en proveedor, escanear, manifestar, recibir en bodega Dropi, segregar y entregar a transportadora | PS-503 restringido | Flujo saliente distinto. Comparte guías/estados, pero sus actores, soportes y causales no son los del pickup externo. |
| Indiana / Hub · recolección proactiva | Detectar guías listas sin movilizar, agrupar por bodega × transportadora y preparar una gestión preventiva | Hub local; reuniones del 24 y 29-jul | Es un experimento complementario. No reemplaza ni persiste todavía el ciclo operativo completo. |
| Migración PAU | Programar carrier interno en PAU, validar QR, escanear, manifestar y sincronizar estados | Propuesta de migración de mayo-2026 | Arquitectura futura adyacente. No prueba construcción ni se fusiona con LOG-013 por similitud. |
| Warranties / Garantías | Aprobar o rechazar solicitudes y descargar archivos para recolecciones de garantías/devoluciones | STID-550, STID-598, STID-2185; DROP-19642 y documentación técnica de Warranties | **Fuera de LOG-013.** Es logística inversa/garantías y sirve como frontera o patrón técnico, no como antecedente directo del panel saliente. |
| Hallazgo México | “Panel de recolecciones con limitaciones críticas” y necesidad de requerimientos operativos/rediseño | Workshop México del 3-jun | Intake ambiguo. Falta identificar usuario, flujo y sistema antes de relacionarlo con los objetos anteriores. |

## 2 · Cadena Jira candidata

| Jira | Lectura al corte | Uso correcto |
|---|---|---|
| [PRM-1465](https://dropi-it.atlassian.net/browse/PRM-1465) · Optimización de recolecciones | Oportunidad en backlog, reportada por Maria, sin descripción/assignee. El enlace Polaris muestra PRM-1468 como `merged from`; conecta con PRM-1497. | **Principal candidato de LOG-013.** Comentario documental `51003` aplicado/releído; gobierno intacto. |
| [PRM-1468](https://dropi-it.atlassian.net/browse/PRM-1468) · Recolecciones y paquetes sin movilizar | Oportunidad en backlog, reportada por Juan, sin descripción/assignee. El historial dice `This work item merged into PRM-1465`; conecta con PRM-1497. | Fuente fusionada dentro de PRM-1465. No usar como principal ni crear duplicado. |
| [PROD-1568](https://dropi-it.atlassian.net/browse/PROD-1568) · Experimento de recolecciones | Figura Hecho, asignado y reportado por Juan; sin descripción, entregable ni enlaces verificables. | Señal de trabajo, no prueba de experimento ejecutado ni de outcome. |
| [PROD-1800](https://dropi-it.atlassian.net/browse/PROD-1800) · Recolecciones proactivas | Figura Hecho, asignado y reportado por Juan; sin descripción ni enlaces verificables. | Señal de actividad; hace falta enlazar protocolo, muestra, resultado y decisión. |
| [PROD-1855](https://dropi-it.atlassian.net/browse/PROD-1855) · Recolecciones | Figura Hecho desde el 03-ago; asignado/reportado por Juan; sin descripción, adjuntos ni enlaces. | Transición reciente sin artefacto; no prueba cierre documental u operativo. |
| [PROD-821](https://dropi-it.atlassian.net/browse/PROD-821) · ¿Qué nos falta en recolecciones? | Figura Hecho; sin contenido verificable. | Fuente candidata de discovery, no evidencia hasta recuperar el artefacto. |

Otros PRM de integraciones automáticas por transportadora —PRM-1613, PRM-470 y PRM-388— pueden aportar patrones, pero no se absorben en LOG-013 sin comprobar país, flujo y alcance.

### Decisión Jira

- No crear un issue nuevo.
- Usar PRM-1465 como principal candidato; PRM-1468 ya está fusionada dentro por Jira.
- Comentario `51003` registra alcance/gates; no se editaron descripción, estado, assignee ni relaciones.
- No agregar relaciones nuevas: los PRM carecen de descripción y los cuatro PROD “Hecho” no enlazan resultados.
- No relacionar STID-550/598/2185 con LOG-013; pertenecen a Warranties.

## 3 · Operación actual reconstruida

### Pickups con carriers externos

1. Proveedor o emprendedor genera una solicitud desde el módulo actual.
2. El Área de Recolecciones descarga y valida la información, diferencia bodegas fijas/esporádicas y controla duplicados y campos obligatorios.
3. Para Coordinadora existe automatización parcial: el panel toma solicitudes y devuelve un identificador de recolección.
4. Con otras transportadoras predomina la gestión manual por correo, WhatsApp, archivos o grupos.
5. La transportadora confirma recepción/ruta y ejecuta; el equipo monitorea resultado y causales.
6. La visibilidad preventiva es débil: parte de los incumplimientos se descubre por queja, y los mínimos por carrier pueden inducir a inflar cantidades.

Las reuniones registran ventanas/cortes operativos, distinción fija/esporádica y una propuesta inicial de dos cargas manuales diarias. Estas reglas son contexto de diseño, no configuración aprobada del producto.

### Carrier interno / cross-docking

1. El proveedor solicita y alista, separando por transportadora.
2. Un recolector interno valida empaque, lee los paquetes y obtiene manifiesto firmado en origen.
3. Bodega Dropi recibe y escanea, hace cross-docking y segrega por transportadora.
4. Se entrega al carrier externo con lectura/manifiesto; el estado se actualiza a entregado a transportadora.
5. Supervisión controla estados, novedades y contingencia manual cuando Ecom Scanner falla.

PS-503 enumera causales como duplicidad, peso/volumen, falta de cobertura, anulaciones, incumplimientos, no recolección y problemas de etiqueta/empaque. El documento es útil para el proceso, pero no para ownership: su encabezado de liderazgo, autores y campos de aprobación son inconsistentes/incompletos.

### Migración PAU candidata

La propuesta de mayo-2026 modela coordinador, carrier interno, operario PAU, QR, escaneo individual, manifiestos y estados sincronizados. Es una arquitectura futura coherente con carrier interno, pero no hay evidencia aquí de construcción/despliegue ni de que PRM-1465 la gobierne. Se conserva como **adyacencia por comparar**, no como alcance absorbido.

### Flujo proactivo Indiana / Hub

1. Importa una foto operativa de guías listas/no movilizadas.
2. Consolida por bodega × transportadora y aplica reglas de elegibilidad/prioridad.
3. Muestra tabla y mapa, y permite preparar un CSV/mensaje para la transportadora.
4. El piloto propuesto compara estados al día siguiente, observa inactividad de 48 h y comienza con una transportadora.

El 24-jul se reportó manualmente la movilización de un volumen de guías y se mostró un ejemplo de un carrier. El dato no tiene denominador, consulta, reconciliación ni atribución verificables; se conserva como **señal autodeclarada**, no como outcome. Los volúmenes exactos permanecen en la fuente restringida.

## 4 · Ownership comprobable

| Rol | Evidencia | Estado |
|---|---|---|
| Driver/PM de Producto | PRM-1468 fue creada por Juan; PROD-821/1568/1800/1855 y acciones 24/29-jul están asignados a Juan | Juan, confirmado como driver documental/producto; no owner operativo/técnico. |
| Gobierno pickup externo | GP-512/SOP: Área de Recolecciones ejecuta; coordinador/líder monitorea y aprueba | Roles confirmados; persona nominal pendiente. |
| Gobierno carrier interno | PS-503: supervisor/asistente controla y líderes de bodega operan; encabezado/autores/aprobación se contradicen | Rol operativo parcialmente claro; owner nominal **no confirmado**. |
| Responsable propuesta PAU | Documento de migración atribuido a Víctor Ney Orobio | Responsable del documento, no owner comprobado de LOG-013 o del sistema productivo. |
| SME operativo/datos | Acciones de Jhon para usuarios/bodegas y revisión de propuesta el 29-jul | Participación confirmada; no implica ownership final. |
| Owner técnico | No hay ticket/arquitectura que lo asigne | Pendiente. |

No se debe usar “asignado a Juan” en tareas PROD ni la autoría de documentos como prueba de ownership operativo/técnico.

## 5 · Matriz de paridad

| Capacidad | Pickup externo | Carrier interno / PAU | Indiana / Hub | Cierre requerido |
|---|---|---|---|---|
| Crear/recibir solicitud | Sí, módulo actual | Asignación del coordinador; PAU lo propone | No; parte de foto/importación | Definir qué flujo gobierna cada gestión del Hub. |
| Fija vs. esporádica | Sí, con evidencia contradictoria por fuente | PS-503 afirma operación fija; excepciones gerenciales | No explícito | Resolver por país/red y versionar la regla. |
| Programación por carrier/canal | Parcialmente automática para Coordinadora; manual en otros | Coordinador/ruta interna; PAU propone asignación móvil | Prepara archivo/mensaje; no envía | Diseñar adaptadores por red/canal. |
| Lectura física / manifiesto | No es núcleo del panel de solicitud | Sí, origen, bodega Dropi y entrega a carrier | No | Elegir eventos canónicos sin duplicar Ecom Scanner. |
| Ventanas/cutoff | Existen operativamente | Franjas/rutas internas | Sin calendario configurable demostrado | Convertir reglas aprobadas en configuración versionada. |
| Mínimos y elegibilidad | Varían por carrier y afectan conducta | Umbrales/ruta interna | Umbrales experimentales | Calibrar por red, carrier, país y vigencia. |
| Cobertura bodega–carrier | Se valida en operación | Ruta lógica/ciudad | Sin contrato canónico confirmado | Consumir fuente común de LOG-004/012. |
| Detección preventiva | Limitada | Seguimiento y cierre posterior | Núcleo del experimento | Definir evento, ventana y falso positivo. |
| Dedupe / idempotencia | Duplicados se anulan con causal | Causal operativa + manifiestos | Import valida; E2E no demostrado | Llaves separadas para solicitud, asignación y guía. |
| Persistencia de gestión | Existe en módulos/archivos actuales | Ecom Scanner/manifiestos; PAU futuro | Tablas `rec_*` sin escritura UI/API | Integrar, no crear un tercer registro paralelo. |
| Acuse | Confirmación/ID según carrier | QR/lectura/manifiesto en PAU propuesto | No implementado | Registrar actor, canal, timestamp y evidencia. |
| Resultado y causal | Monitoreo operativo | Estados/causales/contingencia | No implementado; caída de stock no basta | Consumir evento físico y causal. |
| Roles/acceso | Área de Recolecciones y coordinación | Operación/cross-docking; PAU propone roles | `user_access.inidiana`; RLS pendiente | Confirmar owners y mínimo privilegio por flujo. |
| País/red | Evidencia Colombia | Ciudades/red Dropi; PAU candidato | Experimento Colombia | México sigue sin paridad comprobada. |

## 6 · Estado técnico del Hub

### Implementado

- Control de acceso de páginas y APIs mediante permiso `inidiana` o superadmin.
- Importación con preview/dry-run y validaciones.
- Foto consolidada, tabla, filtros, métricas, mapa y detalle por bodega.
- Armado local de CSV y texto/WhatsApp.
- Modelo SQL para importaciones, solicitudes, bodegas y gestiones.

### No implementado o no demostrado

- Sembrar/confirmar accesos `inidiana` —el entorno tiene 0— y después aplicar/verificar RLS `043`.
- Persistencia desde UI/API en `rec_solicitud`, `rec_solicitud_bodega` y `rec_gestion`.
- Envío real, acuse del carrier, resultado al día siguiente y bitácora auditada.
- Cobertura canónica, calendario/cutoff por carrier, fija/esporádica e idempotencia E2E.
- Ciclo real con usuarios autorizados y decisión posterior.

La interfaz no debe presentar la descarga de CSV o copia de mensaje como si la transportadora hubiese recibido una solicitud.

## 7 · Fuentes consultadas y tratamiento

| Fuente | Tratamiento documental |
|---|---|
| [Notas operativas 14-jul](https://docs.google.com/document/d/1DwHl_-dY40KmF8Cf_Bx1rOJzJY3FOMNAafzYnOTafAU/edit) | Fuente de flujo y dolor; no copiar contactos ni datos identificables. |
| [Notas operativas 23-jul](https://docs.google.com/document/d/1nVGXDk0S6kvCp62L3i09c5rtDBgZm0pWBqfUHkydQ3o/edit) | Fuente de ventanas, fija/esporádica y propuesta de cargas. |
| Reunión/transcripción 24-jul | Fuente restringida: contiene una credencial expuesta. No se enlaza ni reproduce; requiere saneamiento/rotación por el dueño del sistema. |
| [Cell Board 29-jul](https://docs.google.com/document/d/18Jyf8m7QbnBelmAok81oGVo51LIVZ_JeSFhhfXDbBpE/edit) | Fuente del piloto, reglas y reparto de acciones. |
| SOP 512 · Programación de recolecciones | Fuente operativa restringida. Se sintetiza el proceso/RACI; no se copian enlaces internos ni data. |
| GP-512 · Programación de recolecciones | Paso a paso del pickup externo: pendientes, archivos por carrier, duplicados, envío, estado y aprobación. Contiene enlaces operativos internos que no se reproducen. |
| PS-503 · Proceso de Recolecciones | Carrier interno/cross-docking, escaneos, manifiestos, contingencia y causales. Su ownership es inconsistente/incompleto. |
| [Propuesta migración PAU](https://docs.google.com/document/d/1TLjcVDfEgpIdCqrPGgsvkH8RvxRJ4RYSdg8E5MstFAs/edit) | Arquitectura candidata de carrier interno/PAU. Referencia adyacente, no alcance confirmado. |
| [Workshop México](https://docs.google.com/document/d/1nI-Sxs4m0sKiDh9j6qXvSTPcV3BXLB7ok1TL6VyAuxs/edit) | Intake cualitativo ambiguo; no convierte el hallazgo en proyecto. |
| Data Recolecciones Juan Diego.xlsx | Datos crudos restringidos. No se descargan, enlazan ni replican. |
| Confluence Warranties y Jira STID/DROP | Evidencia para excluir Garantías del alcance saliente de LOG-013. |

## 8 · Gates de cierre

- [x] Confirmar en Jira PRM-1468 → PRM-1465 y registrar/releer comentario `51003` sin tocar gobierno.
- [ ] Completar PRM-1465 con problema, segmento, baseline, métrica, owner operativo/técnico y enlaces aprobados.
- [ ] Recuperar entregables/resultados de PROD-821/1568/1800/1855; si no existen, corregir la lectura “Hecho”.
- [ ] Nombrar responsable operativo y técnico sin inferirlos de la participación en reuniones.
- [ ] Confirmar qué parte gobierna PRM-1465: pickup externo, carrier interno, PAU o solo la capa preventiva.
- [ ] Confirmar si el hallazgo México es pickup externo, carrier interno/PAU, Warranties u otro sistema.
- [ ] Acordar el flujo producto–operación y solo entonces implementar persistencia/envío/acuse/resultado.
- [ ] Aprobar/sembrar usuarios `inidiana` —hoy 0—; después aplicar RLS y probar 403/acceso permitido antes de datos reales.
- [ ] Ejecutar un piloto con un carrier, baseline, muestra, ventana, causales y criterio de éxito.
- [ ] Publicar una síntesis anonimizada; no copiar hojas, PII, credenciales ni datos por bodega.

Hasta cerrar esos gates, LOG-013 permanece como **Oportunidad en Discovery con experimento técnico**, no como producto operativo terminado.
