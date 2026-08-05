# Spec · LOG-013 Recolección proactiva

> Corte: 2026-08-03. Fuente de navegación y decisión del frente; no es base operacional ni registro paralelo. Jira gobierna clasificación/estado/ownership cuando se valide el issue principal; Darwin presenta; Drive conserva fuentes/E2E; Confluence indexa; el repo conserva esta síntesis y la auditoría.

| Campo | Valor |
|---|---|
| Código interno | LOG-013 |
| Owner documental / driver producto | Juan Diego Bautista |
| Owner operativo | Rol: Área de Recolecciones + coordinador/líder de Logística; persona nominal pendiente |
| Owner técnico | Pendiente |
| Etapa | Preparado / guía generada → solicitud de recolección → handoff al carrier |
| Clasificación | Oportunidad en Discovery con experimento técnico |
| Estado | Operación actual reconstruida; piloto y ciclo E2E aún no demostrados |
| Jira principal candidato | [PRM-1465](https://dropi-it.atlassian.net/browse/PRM-1465); Jira confirma que [PRM-1468](https://dropi-it.atlassian.net/browse/PRM-1468) fue fusionada dentro. Comentario documental `51003` aplicado/releído. |
| Datos sensibles | Direcciones, teléfonos, coordenadas, guías, mensajes, actividad y volúmenes por bodega: restringidos; no publicar ni replicar |

## 1 · Decisión ejecutiva

LOG-013 busca volver **preventiva, trazable y medible** la recolección de paquetes listos para despachar. No es el panel de Garantías y tampoco es todavía un reemplazo del módulo operativo actual.

La arquitectura de producto queda así:

1. El módulo de pickups de carriers externos conserva la recepción, validación, programación y aprobación de solicitudes.
2. El carrier interno/cross-docking opera otro flujo: recogida en proveedor, lectura, manifiesto, recepción en bodega Dropi y entrega a transportadora.
3. Indiana/Hub detecta guías listas sin movilizar, prioriza y prepara gestiones preventivas sobre la operación que se acuerde.
4. La propuesta de migración PAU describe arquitectura futura para carrier interno; es adyacente y no se fusiona por nombre.
5. Los flujos de novedades, retornos y Warranties/Garantías permanecen separados como excepción/logística inversa.
6. El hallazgo México se mantiene como intake hasta identificar qué flujo y sistema describe.

La separación completa y la matriz de paridad están en [auditoria-operacion-paridad-agosto-2026.md](auditoria-operacion-paridad-agosto-2026.md).

## 2 · Correcciones de clasificación

- **STID-550, STID-598 y STID-2185 no pertenecen a LOG-013.** Son incidencias de Warranties/Garantías: aprobación/rechazo y descarga de archivos en un flujo de logística inversa.
- Las páginas API de recolecciones encontradas en Confluence también documentan Warranties; son referencia técnica de otro dominio, no prueba del panel saliente.
- El historial de PRM-1468 dice literalmente que fue **fusionada dentro de PRM-1465**. PRM-1465 es el principal candidato, no PRM-1468; ambos conectan con PRM-1497.
- PROD-821, PROD-1568, PROD-1800 y PROD-1855 figuran Hecho, pero no tienen descripción, adjuntos ni enlaces. Solo conservan comentarios automáticos de transición; su estado no prueba entregable ni outcome.
- GP-512 documenta pickups de carriers externos; PS-503 documenta carrier interno/cross-docking. No son un solo flujo operacional.
- La propuesta PAU de mayo-2026 es arquitectura futura de carrier interno; el responsable del documento no se convierte automáticamente en owner de LOG-013.
- El workshop México solo afirma que existe un panel con limitaciones críticas; no permite concluir si es el módulo saliente, Warranties u otro panel.

## 3 · Problema

La operación combina automatización parcial y gestión manual por carrier, sin una vista preventiva y auditada que conecte:

- guías realmente listas por bodega y transportadora;
- cobertura, mínimos, cutoff y condición fija/esporádica;
- solicitud efectivamente enviada y recibida;
- resultado real de recogida/no recogida y causal;
- aprendizaje que cambie la regla o la operación.

Como consecuencia, parte de los incumplimientos se descubre por quejas, y una caída de stock puede confundirse con una recogida sin tener el evento que la prueba.

## 4 · Resultado y métrica

### Resultado buscado

Que el Área de Recolecciones identifique a tiempo paquetes listos sin movilizar, genere una gestión válida para el carrier y confirme el resultado al día siguiente, con trazabilidad y sin exponer datos de bodega.

### Métrica primaria propuesta

`% de guías elegibles recogidas dentro de la ventana acordada después de la gestión proactiva`

Debe especificar país, carrier, ventana, denominador, eventos elegibles y exclusiones. Hasta existir esa consulta, no usar “guías desaparecidas de la foto” como recogidas ni atribuir a Indiana el volumen autodeclarado del 24-jul.

### Guardarraíles

- solicitudes duplicadas;
- carrier sin cobertura o bodega incompatible;
- falsos positivos de guía lista;
- solicitudes sin acuse;
- recogida inferida sin evento;
- exposición de PII/datos por bodega;
- mayor carga manual por carrier o por excepción.

## 5 · Usuarios y ownership

| Actor | Necesidad / responsabilidad |
|---|---|
| Área de Recolecciones | Validar, programar, hacer seguimiento y registrar causales. |
| Coordinador/líder de Logística | Monitorear el proceso y aprobar cambios operativos. |
| Proveedor/emprendedor | Solicitar la recolección y declarar información válida. |
| Transportadora | Confirmar recepción/ruta, recoger y reportar resultado. |
| Carrier interno / recolector | Ejecutar ruta, lectura, manifiesto y entrega en bodega Dropi. |
| Personal de cross-docking | Recibir, segregar, despachar, gestionar novedades y soportes de entrega. |
| Coordinador PAU | Rol propuesto para programar carrier interno; no confirmado como operación vigente de LOG-013. |
| Juan / Producto | Conducir discovery, reglas, piloto, evidencia y decisión de producto. |
| Jhon / SME operativo-datos | Aportar usuarios/bodegas y revisar la propuesta; no se infiere ownership final. |
| Tecnología | Owner pendiente para integración, persistencia, eventos y operación del Hub. |

PS-503 contiene una inconsistencia de gobierno: nombra un líder ligado a Tesorería, pero sus autores, contenido operativo y campos de aprobación no sostienen esa asignación. Se conserva como fuente de proceso, **no como prueba de owner**.

## 6 · Alcance

### Incluye

- consolidación por bodega × transportadora;
- elegibilidad por antigüedad, cobertura, cutoff, mínimos y tipo fija/esporádica;
- priorización preventiva de guías listas sin movilizar;
- frontera explícita entre pickup externo, carrier interno/cross-docking y PAU futuro;
- solicitud congelada con actor/canal/timestamp;
- acuse del carrier;
- resultado recogida/no recogida, causal y auditoría;
- piloto inicialmente acotado a un carrier;
- acceso restringido y documentación anonimizada.

### No incluye

- Warranties/Garantías, token Veloces o devoluciones al proveedor;
- construir la migración PAU o absorberla en LOG-013 sin decisión de arquitectura;
- convertir el intake México automáticamente en proyecto;
- reemplazar el módulo operativo antes de demostrar paridad;
- crear otra regla de compatibilidad bodega–carrier distinta a la fuente canónica de LOG-004/012;
- afirmar outcome con tareas Jira Hecho, testimonios o variación de stock;
- publicar hojas, contactos, credenciales, coordenadas o volúmenes identificables.

## 7 · Flujo E2E objetivo

1. Capturar foto vigente con fuente, ventana y calidad verificables.
2. Determinar elegibilidad con reglas versionadas y explicar exclusiones.
3. Agrupar y congelar la solicitud por carrier/bodegas/paquetes.
4. Enviar por el canal/integración correspondiente sin doble solicitud.
5. Registrar acuse e identificador externo cuando aplique.
6. Recibir evento de recogida/no recogida; registrar causal y excepción.
7. Comparar contra baseline y decidir mantener, ajustar o detener la regla.

## 8 · Estado del Hub

| Capacidad | Estado |
|---|---|
| Acceso de páginas/APIs por permiso `inidiana` o superadmin | Implementado en código; falta prueba en entorno correcto. |
| Importación con preview/dry-run | Implementada. |
| Tabla, métricas, filtros, mapa y detalle | Implementados sobre la base autorizada; sin fallback público. |
| CSV y mensaje/WhatsApp | Preparación local implementada; **no equivale a envío ni acuse**. |
| Tablas `rec_importacion`, `rec_solicitud`, `rec_solicitud_bodega`, `rec_gestion` | Modelo preparado. |
| Escritura de solicitud/gestión desde UI/API | No implementada. |
| Integración con carrier, acuse y resultado | No implementados. |
| Cobertura/cutoff/fija-esporádica configurables | No demostrados. |
| RLS restringida | Migración `043` preparada, no aplicada: el entorno tiene 0 usuarios `inidiana`; primero debe aprobarse la lista de acceso. |

## 9 · Fuentes de verdad

| Sistema | Rol correcto |
|---|---|
| Jira | PRM-1465 principal candidato; PRM-1468 ya figura fusionada dentro. Comentario `51003` documenta el corte sin cambiar gobierno. PROD conserva tareas/evidencias, no reemplaza el proyecto. |
| Darwin | Ficha de presentación unida por `project_code=LOG-013`; `044` aplicada/releída el 03-ago; no operación ni PII. |
| Drive/E2E | Notas, SOP y futuro E2E vivo. Las fuentes restringidas no se copian al repo/Confluence. |
| Confluence | Índice/síntesis cuando Jira, owner y alcance estén confirmados; no duplicar Warranties ni crear página por ausencia de título. |
| Hub | Interfaz experimental y operación futura solo tras aprobar el ciclo. |
| Repo | Spec, auditoría, decisiones, contrato y migraciones específicas de Logística. |

## 10 · Evidencia y límites

| Evidencia | Qué permite afirmar | Qué no permite afirmar |
|---|---|---|
| SOP/GP-512 y reuniones 14/23-jul | Pickup externo, canales manuales, duplicados, aprobación, fija/esporádica y ventanas | Uso/adopción de Indiana o resultado del piloto. |
| PS-503 | Carrier interno, lecturas, manifiestos, cross-docking, contingencia y causales | Owner vigente: el documento tiene campos contradictorios/incompletos. |
| Propuesta PAU mayo-2026 | Arquitectura candidata para coordinador, QR, escaneo, manifiesto y estados del carrier interno | Construcción, despliegue o equivalencia automática con LOG-013. |
| Reunión 24-jul | Existencia del enfoque proactivo y señal autodeclarada de movilización | Atribución causal, denominador u outcome verificado. |
| Cell Board 29-jul | Diseño de piloto, carrier inicial, comparación posterior y acciones | Ejecución o éxito del piloto. |
| Hub local | Capacidades presentes en código | Despliegue, uso real, acuse del carrier o resultado. |
| PRM/PROD | Existencia y estado de work items | Entregables o resultados cuando no hay descripción/enlaces. |
| Workshop México | Dolor percibido | Equivalencia con el flujo colombiano o solución escogida. |

## 11 · Seguridad

- Páginas y APIs deben exigir permiso `user_access.inidiana` o superadmin.
- No hay fallback a snapshots en `public/`; la API autorizada es la única entrada de datos.
- La migración `043_recolecciones_acceso_restringido.sql` debe aplicarse y releerse antes de datos reales.
- Probar 403 sin permiso, acceso autorizado, RLS directa y ausencia de artefactos públicos.
- Una transcripción del 24-jul contiene una credencial hablada: no se enlaza/reproduce y debe ser saneada/rotada por el dueño.
- Data Recolecciones Juan Diego.xlsx y el SOP son fuentes restringidas; no se descargan ni replican.

## 12 · Nueve fases E2E

| Fase | Estado | Evidencia / gate |
|---|---|---|
| Kick-off | Parcial | Problema y actores reconstruidos; falta sponsor y owner nominal. |
| Discovery | Parcial | Operación y dolor documentados; falta México y recuperar artefactos PROD. |
| Definición | Parcial | Flujo objetivo y paridad definidos; falta contrato aprobado/configuración. |
| Following | No iniciado | No hay bitácora de piloto verificable. |
| Hand-off DEV | No aplica aún | Persistencia/integración no deben construirse antes del acuerdo operativo. |
| Comunicación | No aplica aún | Sin piloto/decisión no hay lanzamiento que comunicar. |
| Activación | No iniciada | RLS, usuarios, carrier, datos y soporte pendientes. |
| Hallazgos | Parcial | Señales cualitativas; no outcome reconciliado. |
| Checklist | Abierto | Jira, owner, seguridad, E2E, métrica y decisión pendientes. |

## 13 · Plan de cierre

- [x] Separar pickup externo, carrier interno/cross-docking, PAU futuro, Indiana, Warranties y México.
- [x] Corregir STID/API Warranties como fuera del alcance directo de LOG-013.
- [x] Reconstruir el flujo y RACI actuales sin copiar data restringida.
- [x] Verificar en historial que PRM-1468 fue fusionada dentro de PRM-1465; registrar comentario Jira `51003` sin cambiar gobierno.
- [x] Documentar paridad y huecos técnicos reales del Hub.
- [ ] Completar descripción/ownership de PRM-1465 cuando Operación confirme la frontera externo/interno/PAU.
- [ ] Recuperar entregables de PROD-821/1568/1800/1855 o corregir la lectura de “Hecho”.
- [ ] Confirmar owner operativo nominal y owner técnico.
- [ ] Clasificar el panel México por flujo/sistema.
- [ ] Aprobar y sembrar accesos `inidiana` (el entorno tiene 0 usuarios autorizados); solo después aplicar/verificar RLS `043` en el entorno correcto.
- [ ] Aprobar el ciclo e implementar persistencia, envío, acuse y resultado.
- [ ] Ejecutar piloto con baseline, denominador, causales y criterio de éxito.
- [ ] Solo entonces sincronizar Jira → Darwin → Drive/E2E → Confluence y releer cada cambio.
