# Intake México — clasificación Logistic Success

> Corte: 2026-08-02. Fuente primaria: [workshop “Hablemos del producto en MX”](https://docs.google.com/document/d/1nI-Sxs4m0sKiDh9j6qXvSTPcV3BXLB7ok1TL6VyAuxs/edit) y su vista en `/proyectos/oportunidades-paises`. Este documento clasifica únicamente Logística. No modifica ni audita Supplier, materiales de Laura ni tickets Jira.

## Regla de lectura

El workshop es un **intake cualitativo**, no una priorización ejecutable. Un dolor marcado como crítico puede corresponder a una capacidad existente, un bug, una operación manual, una hipótesis o un proyecto. Los comentarios posteriores del documento pueden contradecir su tabla-resumen y tienen que conservarse como contraevidencia.

## Mapa de hallazgos logísticos

| # | Hallazgo del workshop | Clasificación actual | Antecedente / destino | Decisión al corte |
|---:|---|---|---|---|
| 1 | Trazabilidad en creación de bodegas externas | Oportunidad de proceso/auditoría | Reunión operativa mencionada en el workshop; ticket exacto no localizado | Levantar flujo, actor que aprueba, log y SLA. No crear proyecto todavía. |
| 2 | Panel de recolecciones limitado | Intake ambiguo de operación/rediseño | **LOG-013**; PRM-1465 ← PRM-1468; pickups externos, carrier interno/PAU y Hub/Indiana | Confirmar usuario, flujo y sistema. STID-550/598/2185 pertenecen a Warranties/Garantías y no se relacionan con LOG-013. |
| 3 | Códigos postales / Sepomex | Oportunidad de cobertura con antecedentes parciales | PRM-1144 es el antecedente más cercano; PRM-1341 captura datos Sitidata y CP, pero no demuestra Sepomex | Mantener ambos como candidatos, sin tocar relaciones. Definir catálogo, validación y nivel ciudad/CP. |
| 4 | Notificaciones de guía al cliente final | Capacidad/solución por carrier, ticket principal no confirmado | El workshop dice que se desarrolla con paqueteras; puede cruzar tracking/POD | Buscar implementación y owner por carrier. No absorber en Torre por defecto. |
| 5 | Archivos manuales de transportadoras | **Capacidad/fuente dentro del proyecto de selección + operación vigente** | PRM-1150 fue fusionada en PRM-203 y está conectada con PRM-1219; carpeta/hoja restringida | No crear proyecto ni eliminar la fuente. Curar documentos para usuario final y cerrar owner, diccionario, sensibilidad, frecuencia, paridad y migración. |
| 6 | Pedidos/manifiestos duplicados Ecom | **Bug candidato / posible recurrencia** | PRM-403 Finalizada ↔ DROP-6924 Backlog; DROP-6818 hotfix y DROP-6876 reversión; comentario `51012` | Cierre histórico inconsistente. Reproducir objeto/punto de entrada/causa en bodega externa; no marcar duplicado sin equivalencia. |
| 7 | LOGIAPP y manuales desactualizados | Operación/documentación; vigencia del producto pendiente | El comentario original pregunta si LOGIAPP desaparece | Confirmar vigencia y owner antes de invertir en manuales o IA. Materiales de Laura solo como referencia. |
| 8 | Torre de Control de ciudades, efectividad y CP | **Capacidad existente + bug operativo** | DROP-18559 Finalizada (activación México); STID-6894 abierto (filtros/rangos) | Corregir la narrativa “inexistente”. Resolver bug y auditar cobertura funcional. |
| 9 | Código de seguridad al destinatario | **Hipótesis POD con contraevidencia de fricción** | LOG-016 / PRM-1517; no hay ticket específico localizado | No implementar todavía. El comentario original dice “no aplicable” por fricción; investigar fraude, fallback y carrier. Distinto del token Veloces. |
| 10 | Control de información/generación de guías impresas | Problema operativo / calidad; frontera con LOG-012 | Ticket exacto no confirmado | Levantar reglas previas a despacho, lote, impresión, idempotencia y carrier antes de relacionar. |
| 11 | Torre Logística E2E | **Discovery compuesto** | PROD-1706 y tareas PROD-1708/1709/1710/1711, todas en backlog | Separar tracking, POD, código, contenido de guía y cobertura; no fusionar con la Torre de Control MX. |

## Las tres torres no son una sola

| Nombre usado | Usuario/decisión | Capacidades | Evidencia actual |
|---|---|---|---|
| Torre de Control MX | Operación/dropshipper elige ciudad/carrier | efectividad por ciudad, cobertura y filtros | DROP-18559 + STID-6894 |
| Torre Logística + evidencias | Dropshipper/soporte explica qué pasó en calle | tracking, POD, foto/firma, cobertura de evidencia | PROD-1706 discovery; cruza LOG-016 |
| Torre de tiempo por fases | Logistic Success identifica cuellos de botella | timestamps y duración F1→F5 | LOG-011; no equivale a las dos anteriores |

El nombre “torre” no basta para deduplicar. Antes de relacionar se comparan usuario, decisión, eventos, fuente, país, granularidad y outcome.

## Antecedentes confirmados con límites

### Archivos de transportadoras — PRM-1150

- Confirma que Logística comunica información mediante archivos Excel y que se busca una consulta web actualizable.
- Su historial confirma que fue **fusionada en PRM-203** el 20-mar-2026; también está conectada con PRM-1219. No es un proyecto autónomo.
- PRM-1219 ya decidió no parsear Excel por fragilidad: V1 con documentos curados; tabla posterior desde una fuente canónica.
- Los SOP de integración de nuevas transportadoras son otro flujo operativo. Pueden producir insumos, pero no reemplazan el catálogo visible al dropshipper.
- No demuestra formato canónico, data owner, frecuencia/SLA, clasificación de sensibilidad ni reemplazo listo.
- La hoja/carpeta actual es una dependencia operativa; retirarla sin migración rompería consumidores. Debe mantenerse restringida, no publicarse ni copiarse a Confluence/Darwin.
- Auditoría completa: [`sistema-inteligente-transportadoras/auditoria-archivos-transportadoras-agosto-2026.md`](sistema-inteligente-transportadoras/auditoria-archivos-transportadoras-agosto-2026.md). Jira PRM-1219 comentario `51009`, aplicado y releído.

### Duplicidad Ecom — PRM-403 / DROP-6924 / hotfixes

- El antecedente histórico describe múltiples manifiestos para la misma guía por repetición de la acción “Generar lote”.
- PRM-403 figura finalizada aunque su épica implementadora DROP-6924 sigue en backlog, sin comentarios ni evidencia de entrega.
- DROP-6818 fue un hotfix finalizado y DROP-6876, ejecutada después, declara una reversión sin explicar motivo o alcance.
- Esa secuencia deja riesgo de regresión y cierre documental inconsistente, pero no prueba que el dolor México de bodegas externas tenga la misma causa.
- Reproducción mínima: país, flujo, bodega externa, acción, identificadores técnicos anonimizados, frecuencia, resultado esperado/actual y versión.
- Jira PRM-403 comentario `51012` aplicado/releído. Protocolo: [`movilizacion-confirmacion/auditoria-duplicidad-ecom-agosto-2026.md`](movilizacion-confirmacion/auditoria-duplicidad-ecom-agosto-2026.md).

### Compatibilidad bodega–transportadora

- DROP-6070/6071/6072 prueban una solución finalizada para **órdenes manuales** cuando la transportadora no está habilitada para la bodega de salida.
- Esto es antecedente de elegibilidad y copy, no equivalencia automática con configuración de producto, Ecom ni autogeneración.
- LOG-004 y LOG-012 deben consumir la misma regla de elegibilidad, pero conservar sus decisiones de usuario separadas.

### Códigos postales

- PRM-1144 documenta que México opera por CP, el mantenimiento depende de Tecnología y no existe panel formal para Logística. Es el antecedente más próximo a cobertura/Sepomex.
- PRM-1341 almacena resultados de Sitidata, incluidos CP/coordenadas, y está en desarrollo; su objetivo es captura/trazabilidad de datos, no validar Sepomex ni administrar cobertura.
- Por tanto, no deben fusionarse todavía.

## Riesgos de la página actual corregidos

- Se añadió el aviso de que el tablero es intake, no portafolio aprobado.
- El código al destinatario pasó a “por validar” por la contraevidencia de fricción.
- Torre de Control MX dejó de figurar como inexistente.
- Archivos y duplicidad muestran antecedentes en vez de sugerir proyectos nuevos.
- La etiqueta `Q3 2025` se corrigió a `Q3 2026`, consistente con la creación del workshop en junio de 2026.
- Supplier y sus entradas permanecieron sin modificación.

## Pendientes ejecutables

- [ ] Confirmar con Operación MX el flujo actual: data owner, productor, consumidores, campos, frecuencia, canal, errores, SLA y país/carrier.
- [x] Revisar sin abrir la hoja la frontera de acceso/confidencialidad de PRM-1150, su merge a PRM-203 y los SOP adyacentes; no se copiaron datos.
- [ ] Completar diccionario y paridad del reemplazo; mantener la fuente restringida hasta validar migración y rollback.
- [ ] Reproducir duplicidad Ecom y contrastar causa con PRM-403/DROP-6924/6818/6876.
- [ ] Confirmar vigencia de LOGIAPP antes de actualizar documentación.
- [ ] Completar tareas discovery PROD-1708–1711 sin absorber LOG-011 ni la Torre de Control MX.
- [ ] Leer implementación/resultado de DROP-18559 y resolver STID-6894 mediante su flujo operativo, sin crear otra iniciativa.
- [ ] Definir prueba para código de seguridad que mida fricción y fraude; no confundir con token de retorno.
- [ ] Confirmar ticket de notificaciones al cliente final por carrier.
- [ ] Mantener PRM-1341/1144 intactos hasta cerrar la equivalencia Sepomex/cobertura.
