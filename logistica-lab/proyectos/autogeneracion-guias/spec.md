# Spec · Autogeneración de guías

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. Cada afirmación indica estado y fuente.

| Campo | Valor |
|---|---|
| Product driver | Juan Diego Bautista `[🟡 · drive:reuniones 08/14/16-jul; jira:INVS-67 reporter]` |
| Owner en Jira | Sin assignee en PRM-1469 e INVS-67 `[🟢 · jira:lectura 02-ago]` |
| Product Designer | N/A — no confirmado |
| Stakeholder | Proveedores de alto volumen; TI si el experimento supera el gate `[⚪ · doc:planning/todos.md]` |
| Célula | Logistic Success `[🟡 · jira:PRM-1469]` |
| Etapa de la cadena | Despacho / generación de guía `[🟡 · jira:PRM-1469]` |
| Estado global | 🟡 proyecto/solicitud en investigación y definición; prototipo conceptual, prueba propia pendiente |
| NSM que mueve | Movilización y tiempo por fase de generación de guía `[🟡 · data:weekly]` |
| Última actualización | 2026-08-02 |

## 0 · Resumen y estado global

Busca generar automáticamente las guías de despacho después de una confirmación válida para que el proveedor de alto volumen pase directamente a imprimir y alistar. Tiene código LOG-012, PRM-1469 e INVS-67; comparte superficie de configuración con autoconfirmación, pero es una decisión y actor distintos. El prototipo vive en una rama de RPP y no se considera producción. `[🟡 · jira:PRM-1469/INVS-67 · drive:Cell Board 08-jul · doc:RPP branch]`

> **Corte auditado 02-ago** `[ver auditoria-fuentes-agosto-2026.md]`
> - Maria Ossa lo clasificó explícitamente como **solicitud/proyecto en definición**, no como iniciativa propia o “segundo experimento”. Jira coincide: PRM-1469 es tipo `Solicitud`, estado `Inv. y definición`, sin assignee, y causa INVS-67 en Backlog.
> - El Cell Board del 08-jul prueba que existe un concepto/prototipo y concreta el valor esperado para proveedores de gran volumen: generar en lote y filtrar lo pendiente por imprimir. También abre colas de impresión, lotes y elegibilidad por carrier.
> - No se encontró una prueba de usuarios propia de LOG-012. La frase del Weekly 23-jul sobre “primeras validaciones con varios usuarios” aparece en el bloque de Autoconfirmación y no se puede trasladar a Autogeneración sin artefacto específico.
> - El antecedente operativo con Lucho/Kevin puede contradecir la prioridad: según el Weekly Ecom 14-jul, una exploración previa concluyó que el problema quizá “no era tan grave”. Es testimonio de reunión, no resultado recuperado; debe localizarse antes de invertir.
> - El documento de 2025 “Lanzamiento generación automática de guías de recolección” pertenece a garantías/recolección y exige selección manual de órdenes y carrier. **No es LOG-012** salvo equivalencia funcional demostrada.

## 1 · Problema raíz

- Después de confirmar, la guía todavía depende de una acción manual; la fase reporta 10,37 h promedio. `[🟡 · data:weekly Logistic Success]`
- La lectura local reporta 3,20 M de órdenes en la fase, 325 K críticas y 89,84% de cumplimiento <24 h, pero no enlaza todavía la consulta original ni segmenta proveedor/país. `[🟡 · data:Hub weekly; procedencia por cerrar]`
- Compartir UI con autoconfirmación puede ocultar que el actor, riesgo y criterio de madurez no son los mismos. `[🟡 · doc:RPP configuración de tienda]`
- No hay aún evidencia de prueba con proveedores que confirme reglas, excepciones o tolerancia operativa. `[⚪ · doc:planning/todos.md]`
- Existe contraevidencia pendiente de recuperar: Lucho había pedido una exploración a Kevin y, según Juan, la respuesta fue que el problema no parecía tan grave. Sin el artefacto no puede descartarse ni priorizarse con rigor. `[⚪ · drive:Weekly Ecom 14-jul]`

## 2 · Hipótesis de valor y métrica

- **Hipótesis:** para proveedores elegibles, generar la guía automáticamente tras una confirmación válida reduce el tiempo hasta alistamiento sin aumentar errores, duplicados ni guías inutilizables. `[⚪ · jira:PRM-1469]`
- **Métrica de éxito + línea base:** tiempo confirmación→guía (referencia agregada 10,37 h; meta conversada 4 h), % de guías automáticas válidas, tasa de error/anulación/duplicidad y tiempo hasta impresión; baseline por proveedor/país/carrier pendiente. `[🟡 · data:Hub weekly · drive:Cell Board 08-jul]`
- **NSM:** movilización y tiempo por fases; vínculo directo si la guía es requisito de entrada al handoff. `[🟡 · data:weekly]`

## 3 · Usuarios / actores

- Proveedor de alto volumen que hoy genera guías manualmente. `[⚪ · doc:planning/todos.md]`
- Dropshipper/orden confirmada como evento upstream, sin ser el actor configurador principal. `[🟡 · doc:RPP configuración]`
- Operación/transportadora cuando una guía falla, se duplica o no es elegible. `[⚪ · inferencia a validar]`
- José Giraldo, Lucho y Kevin aparecen como portadores de antecedentes/viabilidad; no son owners confirmados. `[🟡 · drive:Weekly Ecom 14-jul]`

## 4 · Alcance

**Entra (por estado):**

- Prototipo de configuración para perfil proveedor. `[🔵 · doc:RPP rama wireframe/DROP-configuracion-pedidos-autoconfirmacion]`
- Definir elegibilidad, evento disparador, excepciones y opción de desactivar. `[⚪ · jira:PRM-1469]`
- Definir generación por lotes, cola/orden de impresión y filtro “pendiente por imprimir”. `[🟡 · drive:Cell Board 08-jul]`
- Prueba acotada con proveedores antes de handoff. `[⚪ · doc:planning/todos.md]`

**No-objetivos (⛔ — explícito):**

- Tratar la autogeneración como la misma iniciativa de autoconfirmación solo porque comparten pantalla. `[⛔ · doc:RPP]`
- Marcar el prototipo de una rama como funcionalidad desplegada. `[⛔ · doc:RPP branch]`
- Automatizar órdenes duplicadas o no elegibles sin guardarraíles verificados. `[⛔ · drive:workshop MX]`
- Absorber la generación de **guías de recolección de garantías** lanzada en 2025 por coincidencia de nombre. `[⛔ · drive:1KWwXL1WRzPLHnShEgthmF1x1TH1w69nCCCWRKLet6HA]`
- Presentar PRM-1588/1589 (“confirmada sin guía”) como implementación de LOG-012 sin validar la frontera con la rama WhatsApp. `[⛔ · jira:PRM-1588/1589]`

## 5 · Reglas de negocio

- **R1 ·** Solo se genera guía después de una confirmación válida y para una combinación bodega/transportadora elegible. `[⚪ · por definir]`
- **R2 ·** Una orden detectada como duplicada no dispara autogeneración. `[⚪ · drive:workshop MX · guardarraíl candidato]`
- **R3 ·** El proceso debe ser idempotente: reintentar no crea una segunda guía. `[⚪ · criterio técnico candidato]`
- **R4 ·** Fallos deben ser visibles y permitir recuperación manual sin ocultar el error. `[⚪ · criterio de operación candidato]`
- **R5 ·** Si el carrier preferido no tiene cobertura/recaudo compatible, la orden no puede quedar rota: se requiere fallback elegible o salida manual explícita. `[🟡 · drive:Weekly Product 23-jul; conecta LOG-004]`
- **R6 ·** El lote debe conservar trazabilidad por orden: éxito, fallo, carrier y estado de impresión; un resultado parcial no se reporta como éxito total. `[⚪ · drive:Cell Board 08-jul; criterio por validar]`

## 6 · Criterios de aceptación (Gherkin)

**Módulo: autogeneración**

- **Dado** un proveedor y orden elegibles, confirmada y sin guía **Cuando** se ejecuta la regla **Entonces** se crea una única guía y queda trazabilidad del evento. `[⚪ · por validar]`
- **Dado** una orden duplicada, no elegible o ya guiada **Cuando** llega el disparador **Entonces** no se crea otra guía y se registra el motivo. `[⚪ · por validar]`
- **Dado** un error del carrier **Cuando** falla la generación **Entonces** el proveedor ve una salida accionable y puede continuar manualmente. `[⚪ · por validar]`

## 7 · Datos (diccionario)

- Requeridos conceptualmente: order id, estado y fecha de confirmación, supplier/warehouse, carrier elegible y fallback, guide id, origen de generación, batch id, estado de impresión, intentos, error y timestamps. Nombres físicos pendientes. `[⚪ · definición de datos no cerrada]`
- Se requiere identificar el origen automática/manual para medir adopción y errores sin ambigüedad. `[⚪ · pregunta abierta]`

## 8 · Trazabilidad

| Tipo | Referencia |
|---|---|
| Solicitud Jira | [PRM-1469](https://dropi-it.atlassian.net/browse/PRM-1469) · `Inv. y definición`, sin assignee/description/comentarios |
| Intake origen | [INVS-67](https://dropi-it.atlassian.net/browse/INVS-67) · Backlog, sin assignee/description/adjuntos; causada por PRM-1469 |
| Darwin | LOG-012 · hoy mapeado como `Oportunidad / Discovery / Research`; clasificación por reconciliar con Jira y decisión de Maria |
| RPP | rama `wireframe/DROP-configuracion-pedidos-autoconfirmacion`; configuración de tienda, perfil proveedor |
| Doc E2E | N/A — documento específico no localizado en la auditoría del 2026-08-02 |
| Userpilot/encuesta | N/A — campaña/fuente específica no localizada; debe registrarse con el formato de `_auditoria-e2e.md` |
| Fuente principal de concepto | [Cell Board 08-jul](https://docs.google.com/document/d/1uCxKpciZycmZ6vYVaIRt0-G9rcNcq7WvMDVHt6rnv14) |
| Reclasificación | [Juan / Maria 16-jul](https://docs.google.com/document/d/1fVuV_gvSJtGLlEgmysSJTghvc8yGOoB_LxQFEGuvITg) |
| Viabilidad/contraevidencia | [Weekly Ecom 14-jul](https://docs.google.com/document/d/131j6NkRD8Cb85AnFcDuU4SEjbl4eB-MAIMtryNiZCxA) |
| Dependencia carrier | [Weekly Product 23-jul](https://docs.google.com/document/d/1j7iO6sV4KUWg_TcWO7LTHBWz-eHRdsF8NqmqvziMW44) · LOG-004 candidato |
| Homónimo excluido | [Guías de recolección/garantías 2025](https://docs.google.com/document/d/1KWwXL1WRzPLHnShEgthmF1x1TH1w69nCCCWRKLet6HA) |
| Auditoría detallada | [auditoria-fuentes-agosto-2026.md](auditoria-fuentes-agosto-2026.md) |
| Sincronización verificada | PRM-1469 comentario **50934** · [Confluence 1572929537](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572929537) · índice logístico v6 |

## 9 · Preguntas abiertas

- [ ] ¿Qué proveedores/órdenes/carriers son elegibles y cuál es la línea base por segmento? — responsable: Juan + Data/Operación. `[⚪]`
- [ ] ¿Qué evento confirma que una orden no es duplicada y que la guía no existe? — responsable: Juan + TI. `[⚪]`
- [ ] ¿Cómo se distingue generación automática de manual en datos? — responsable: TI/Data. `[⚪]`
- [ ] ¿Con quién y cuándo se corre la primera prueba? — responsable: Juan. `[⚪ · doc:planning/todos.md]`
- [ ] ¿Dónde está el análisis previo de Kevin solicitado por Lucho y qué métrica usó para decir que el problema no era grave? — responsable: Juan + José/Lucho. `[⚪ · drive:Weekly Ecom 14-jul]`
- [ ] ¿Qué significa “alto volumen” en una regla ejecutable y qué pasa con lotes parciales/cola de impresión? — responsable: Juan + Operación. `[⚪]`
- [ ] ¿LOG-004 gobierna el fallback de carrier y la compatibilidad bodega–transportadora, o LOG-012 debe resolverlo? — responsable: Juan + Kate/TI. `[⚪]`
- [ ] ¿PRM-1588/1589 usa “confirmada sin guía” para este problema o para recuperación por WhatsApp? — responsable: Juan. `[⚪]`
- [ ] ¿Quién acepta ownership en PRM-1469? Jira está sin assignee; no confundir driver documental con owner aprobado. `[⚪]`

## 10 · Changelog

- 2026-08-02 — Auditoría multifuente: PRM-1469/INVS-67, Cell Board, Weekly Ecom/Product, reclasificación de Maria, homónimo 2025 y dependencia de carrier. Se reclasifica como proyecto/solicitud en discovery, no “segundo experimento”, y se registra contraevidencia pendiente. Comentario Jira 50934 y Confluence 1572929537 creados y releídos.
- 2026-08-02 — Spec inicial; se corrige que LOG-012 ya está registrado en Darwin y se explicitan gates de prueba/idempotencia.
