# Auditoría de archivos de transportadoras — agosto de 2026

> Corte: 2026-08-03. Alcance exclusivo de Logistic Success. Jira, Drive y Confluence se consultaron en lectura; la única escritura externa de este corte fue el comentario documental `51009` en PRM-1219, releído después de publicarlo. No se abrió, descargó ni copió la hoja operativa enlazada en PRM-1150. Supplier y los materiales de Laura permanecen intactos.

## 1 · Decisión de clasificación

“Archivos de transportadoras” **no es un proyecto nuevo** ni una automatización independiente.

El historial de Jira registra el 20-mar-2026: `PRM-1150 se fusionó en PRM-203`. PRM-1150 también está conectado con PRM-1219. La cadena canónica queda:

`PRM-1219 (proyecto/discovery) → PRM-203 (solución) → DROP-17946 (delivery)`

PRM-1150 se conserva como antecedente de la capacidad de información visible al dropshipper. Su estado `En Ruta (backlog)` no demuestra que haya vuelto a ser una iniciativa autónoma; cambiarlo requiere una decisión explícita en Jira.

## 2 · Objetos que no deben mezclarse

| Objeto | Usuario / decisión | Fuente | Clasificación | Tratamiento |
|---|---|---|---|---|
| Catálogo curado de características y beneficios | Dropshipper compara y elige carrier | Cuatro documentos de recaudo, sin recaudo, trayectos especiales y métodos/intentos | Capacidad dentro de PRM-1219/203 | Curar atributos y exponer solo contenido aprobado para usuario final. |
| Carpeta/hoja operativa de PRM-1150 | Logística mantiene y consulta información vigente | Enlace restringido dentro del ticket | Fuente operativa transitoria | No copiar ni eliminar. Mantener hasta demostrar paridad del reemplazo. |
| Selección/recomendación inteligente | Dropshipper recibe ranking por destino y desempeño | PRM-1219/203, DROP-17946, Figma y POC | Proyecto/solución existente | Gobernar en el spec principal; no abrir otro LOG. |
| Integración de una nueva transportadora | Operaciones, Legal, Finanzas y TI deciden viabilidad, contrato, integración y go-live | GP-101, SOP-101 y TO-BE Short | Proceso operativo E2E distinto | Puede producir insumos para el catálogo, pero no reemplaza por sí solo la fuente visible al usuario. |
| Documentación técnica de carriers | TI integra APIs, estados, guías y novedades | Documentos técnicos restringidos | Evidencia técnica | No publicar credenciales, endpoints, secretos ni ejemplos reales. |

## 3 · Evidencia Jira verificada

| Jira | Estado al corte | Owner visible | Evidencia relevante |
|---|---|---|---|
| PRM-1150 · Información transportadoras en web | En Ruta (backlog) | Paola Angulo | Describe comunicación actual por Excel y consulta web actualizable. Historial: fusionado en PRM-203. Sin comentarios previos. |
| PRM-1219 · Rediseño y optimización logística | Asignado para hand off | Katerine Pencue | Proyecto activo. El 31-mar descartó parsear Excel por inconsistencia/fragilidad: V1 con accesos a documentos curados; tabla visual posterior desde fuente canónica. Comentario documental `51009` aplicado y releído. |
| PRM-203 · Fase 1 selección automatizada | Diseño | Katerine Pencue | Solución que recibió PRM-1150 y conecta con PRM-1219 y DROP-17946. |
| DROP-17946 · Sistema inteligente | En curso | Ver Jira | Delivery del frente; el estado de implementación no convierte los archivos crudos en producto publicable. |

No se modificaron estados, assignees ni relaciones.

## 4 · Evidencia de proceso en Drive

Fuentes leídas sin copiar anexos ni datos sensibles:

- [GP-101 · Integración de transportadoras](https://docs.google.com/document/d/1rW_POSWg_-9DxfyuEyUaedlqDlH7iTm23HKKabyRxyE): cinco fases desde contacto/NDA hasta go-live y mantenimiento; identifica responsabilidades por área y un filtro técnico aún por formalizar.
- [SOP-101 · Integración de transportadoras](https://drive.google.com/file/d/1npqKvbhG3fhCdTYTuuNmncMlKydsg-Ez): consolida viabilidad, mínimos técnicos, ANS, auditoría de costos, QA y seguimiento; conserva campos de aprobación incompletos.
- [TO-BE Short · Integración de transportadoras](https://drive.google.com/file/d/1cktFwNM4yrPq0s1AZD0cR_YBJtgOeAxZ): versión futura con RACI, métricas y riesgos; todavía marca aprobador, SLA interno y frecuencia de revisión como pendientes.

Estas fuentes demuestran el proceso de alta de carriers, no el diccionario final de información que verá un dropshipper. La frase “Convenio Transportadoras LATAM” identifica un repositorio de operación/CLM, no autoriza a replicarlo en el repo, Darwin o Confluence.

## 5 · Contrato de información pendiente

Antes de construir una tabla, mover fuentes o retirar archivos debe existir un contrato aprobado:

| Campo | Pregunta que debe cerrar el owner |
|---|---|
| Data owner | ¿Quién aprueba cada atributo y responde por su vigencia? No se infiere del assignee de Jira ni del autor del SOP. |
| Productor | ¿Qué área o sistema genera cada dato? |
| Consumidor | ¿Uso interno, dropshipper, proveedor, soporte o TI? Un mismo dato no se publica igual para todos. |
| País/carrier | ¿Cobertura y granularidad por país, departamento, ciudad o servicio? |
| Definición | Nombre, semántica, unidad, valores permitidos, fuente y regla de ausencia. |
| Frecuencia/SLA | Cuándo cambia, cuánto puede atrasarse y cómo se alerta una fuente vencida. |
| Sensibilidad | Público al usuario, interno, contractual o secreto técnico. |
| Historial | Versionado, fecha efectiva y evidencia de aprobación. |
| Paridad | Comparación campo a campo entre fuente vigente y reemplazo, con muestreo por país/carrier. |
| Retiro | Fecha, owner, consumidores migrados, rollback y periodo de coexistencia. |

## 6 · Regla de privacidad y publicación

Contenido que sí puede llegar al producto, después de aprobación: beneficios comerciales públicos, servicios disponibles, cobertura publicable, métodos de pago, intentos y condiciones explicadas al usuario.

Contenido que no se replica en Jira, Darwin, Confluence o repo: datos crudos de operaciones, PII, credenciales, secretos, endpoints privados, contratos, ANS completos, tarifarios internos, costos negociados y ejemplos reales de órdenes/guías.

La V1 de enlaces a Drive solo es segura si apunta a documentos curados para el público objetivo. Un enlace directo a la hoja operativa no cumple ese gate.

## 7 · Auditoría de las nueve fases E2E

| Fase | Estado | Evidencia / gate |
|---|---|---|
| Kick-off | Parcial | Problema y cadena Jira existen; falta data owner explícito para la capacidad de catálogo. |
| Discovery | Parcial | Se conocen archivos y necesidad de consulta; faltan consumidores, uso real y errores medidos por país. |
| Definición | Parcial | V1 de documentos curados y tabla posterior están decididas; falta diccionario y arquitectura canónica. |
| Following | Parcial | Jira conserva avances de diseño; no hay bitácora verificable de vigencia/calidad de los documentos. |
| Hand-off DEV | Parcial/bloqueado | PRM-1219 está asignado para handoff, pero faltan fuente canónica, permisos, prueba de carga y ownership de datos. |
| Comunicación | No verificada | No se encontró plan de publicación que distinga documento curado de fuente operativa. |
| Activación | No verificada | No hay evidencia de cohortes, permisos ni rollback de la capacidad de información. |
| Hallazgos | Parcial | Existe señal cualitativa de errores/retrasos y consulta mensual; no se abrió la hoja ni se validó outcome. |
| Checklist | Abierto | Faltan contrato de información, seguridad, paridad, aprobación y retiro controlado. |

## 8 · Plan de cierre

- [x] Confirmar PRM-1150 → PRM-203 en el historial de Jira.
- [x] Confirmar relación con PRM-1219 y cadena hacia DROP-17946.
- [x] Separar catálogo, fuente operativa, selección inteligente e integración de nuevos carriers.
- [x] Registrar y releer comentario Jira `51009` sin cambiar gobierno.
- [x] Revisar GP/SOP/TO-BE en lectura y excluir contenido sensible.
- [x] Preparar `046_darwin_log004_archivos_fuente.sql` para alinear solo el resumen de presentación.
- [ ] Aplicar y releer `046` cuando vuelva a estar disponible la conexión a Darwin; no se declara aplicado en este corte.
- [ ] Nombrar data owner y aprobador por país.
- [ ] Completar diccionario de atributos y clasificación de sensibilidad.
- [ ] Identificar productores/consumidores, frecuencia, errores y SLA sin copiar la hoja cruda.
- [ ] Definir fuente canónica futura y prueba de paridad.
- [ ] Revisar que los cuatro documentos curados no expongan información interna antes de enlazarlos en producto.
- [ ] Ejecutar piloto por cohortes, medir consulta/comprensión/decisión y documentar rollback.
- [ ] Retirar la fuente anterior solo después de verificar migración y coexistencia.
