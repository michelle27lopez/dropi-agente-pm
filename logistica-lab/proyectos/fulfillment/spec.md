# Spec · Parametrización de fulfillment

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. Cada afirmación indica estado y fuente.

| Campo | Valor |
|---|---|
| Owner / PM | Juan Diego Bautista `[🟡 · jira:PRM-1446]` |
| Product Designer | Michel Pino, según metadata del prototipo `[🟡 · doc:RPP meta.json · 2026-06-11]` |
| Stakeholder | Operación de bodegas 2PL; **el equipo de facturación es el responsable del cobro** `[🟡 · Juan · 2026-08-06]` |
| Célula | Logistic Success `[🟡 · jira:PRM-1446]` |
| Etapa de la cadena | Despacho / fulfillment `[🟡 · jira:PRM-1446]` |
| Estado global | 🟡 **no listo para handoff técnico completo**: PRM-1446 figura “Listo para hand off”, pero PROD-1526 está en Dependencia, PROD-240 sigue en backlog sin assignee y el tab Hand off del E2E conserva placeholders |
| NSM que mueve | Métrica operativa: ingresos/costo por servicios de fulfillment; vínculo indirecto con movilización `[🟡 · jira:PRM-1446]` |
| Última actualización | 2026-08-02 |

## 0 · Resumen y estado global

Parametriza el registro y cobro de servicios de fulfillment por bodega/proveedor y un corte consolidado por país. La fase de Producto avanzó por la cadena PROD-238 → PROD-648 → PROD-785 → PROD-995 → PROD-1171 → PROD-1330 → PROD-1526 y existe diseño navegable, pero esto **no equivale a desarrollo terminado**: el último issue de handoff está en Dependencia y el épico de implementación PROD-240 permanece en backlog sin responsable. El E2E tampoco soporta todavía el estado “Listo para hand off”: su tab de handoff contiene actores, sistemas, reglas, datos, Gherkin, riesgos y fecha de aprobación como placeholders. `[🟡 · jira:PRM-1446/PROD-1526/PROD-240 · drive:E2E · figma:2233:35839]`

**Decisión documental:** conservar los estados reales de Jira, pero describir el corte transversal como “handoff bloqueado por definición/evidencia”. No se cambiará el workflow hasta que el E2E, el ticket final de Producto y el épico técnico coincidan. `[🔵 · auditoría 2026-08-02]`

## 1 · Problema raíz

- El cobro se dispara al estado Entregado, aunque almacenamiento, etiquetado, kits/combos y multi-unidad ya fueron prestados antes; 20–25% de órdenes preparadas/despachadas no llega a ese estado y el servicio no se cobra. `[🟡 · jira:PRM-1446]`
- La operación necesita capturar cantidades reales por bodega y después consolidar el cobro definitivo por país. `[🔵 · doc:RPP design spec PROD-648]`
- El prototipo contiene valores configurables o nulos; tratarlos como tarifa acordada produciría un handoff falso. `[⚪ · doc:RPP design spec §Config]`
- Existe un antecedente de cargo incorrecto cuando un proveedor quedó asociado a una bodega que no despachaba su orden (STID-1960). El caso fue corregido operativamente; se usa como evidencia de la necesidad de validar elegibilidad bodega–proveedor y origen del cargo, no como prueba de que el nuevo módulo esté resuelto. `[🟢 · jira:STID-1960]`

## 2 · Hipótesis de valor y métrica

- **Hipótesis:** registrar los servicios cuando ocurren y consolidarlos de forma idempotente permite cobrar trabajo hoy perdido sin duplicar cargos. `[🟡 · jira:PRM-1446 · doc:RPP PROD-648]`
- **Métrica de éxito + línea base:** ingreso mensual recuperado y % de servicios prestados cobrados. El E2E reporta $355M actuales y $631M proyectados por mes; esa diferencia equivale a +77,7% (≈78%), mientras otras secciones declaran +68%. No existe todavía una reconciliación trazable de base, universo, periodo ni fórmula. `[⚪ · drive:Kick-off/Discovery · jira:INVS-66]`
- **NSM:** vínculo indirecto con movilización; la métrica primaria es económica/operativa, no tasa de entrega. `[🟡 · inferencia desde alcance]`

## 3 · Usuarios / actores

- Operador de bodega no técnico: captura servicios por proveedor y periodo. `[🔵 · doc:RPP PROD-648]`
- Responsable de corte por país: **el equipo de facturación**. El corte es **por país y lo resuelve TI**, no un operador por bodega. `[🟡 · Juan · 2026-08-06]`
- Proveedor: recibe el cobro contra wallet y requiere trazabilidad del desglose. `[🔵 · doc:RPP PROD-648]`

## 4 · Alcance

**Entra (por estado):**

- Selección de bodega, periodo vencido y esquema; lista de proveedores y captura por concepto. `[🔵 · doc:RPP PROD-648]`
- Borrador, revisión, registro provisional inmutable y corte definitivo consolidado por país. `[🔵 · doc:RPP PROD-648]`
- Fulfillment base, multi-unidad, etiquetado, kits/combos, almacenamiento y recepción de mercancía. La sexta categoría aparece en el Figma y en decisiones posteriores del E2E, pero no en el RPP inicial. `[🔵 · jira:PRM-1446 · drive:Discovery/Bitácora · figma:2233:35839]`
- Prevención de doble cobro e identificación de estados Sin iniciar/Pendiente/Registrado/Cobrado. `[🔵 · doc:RPP PROD-648]`

**No-objetivos (⛔ — explícito):**

- Definir tarifas o políticas económicas faltantes desde el repo. `[⛔ · doc:RPP PROD-648]`
- Marcar el prototipo RPP como backend construido o desplegado en producción. `[⛔ · doc:RPP design spec]`
- Completar secciones de diseño del E2E que corresponden al Product Designer con supuestos del PM. `[⛔ · doc:metodologia/spec-driven.md]`

## 5 · Reglas de negocio

- **R1 ·** El periodo de captura es mes vencido; no admite mes actual ni futuro. `[🔵 · doc:RPP PROD-648]`
- **R2 ·** La captura ocurre por bodega y el corte definitivo consolida por país. `[🔵 · doc:RPP PROD-648]`
- **R3 ·** Registrado/Cobrado es inmutable y solo lectura; la política de reverso sigue abierta. `[🔵/⚪ · doc:RPP PROD-648]`
- **R4 ·** Multi-unidad aplica a órdenes multiproducto desde la cuarta unidad; valor unitario vigente requiere confirmación del negocio. `[🔵/⚪ · doc:RPP PROD-648]`
- **R5 ·** El corte debe ser idempotente y alertar si ya existe un registro. `[🔵 · doc:RPP PROD-648]`
- **R6 ·** Wallet sin saldo **no bloquea el cobro: dispara una alerta**. El cargo queda registrado y lo que se notifica es la falta de saldo — sigue pendiente definir a quién se le avisa y con qué reintento. `[🟡 · Juan · 2026-08-06]`
- **R7 ·** Antes de cobrar, la combinación bodega–proveedor–orden debe ser elegible y trazable; STID-1960 demuestra el riesgo operativo de una asociación incorrecta. `[🟡 · jira:STID-1960 · criterio derivado]`
- **R8 ·** Tarifas registradas en Discovery ($2.800 base, $400 multi-unidad desde cuarta unidad, $200 etiquetado, $300 kits, $60.000 almacenamiento y bandas de recepción/descuento) se consideran **valores reportados**, no tarifas aprobadas, hasta reconciliar INVS-66, Finanzas y la bitácora más reciente. `[⚪ · drive:Discovery · jira:INVS-66]`

## 6 · Criterios de aceptación (Gherkin)

**Módulo: captura por bodega**

- **Dado** un periodo cerrado y un esquema con proveedores **Cuando** el operador registra conceptos válidos **Entonces** el sistema calcula un subtotal provisional y permite guardar borrador o revisar el registro. `[🔵 · doc:RPP PROD-648]`
- **Dado** un proveedor ya registrado **Cuando** se abre el detalle **Entonces** se presenta solo lectura y no se permite alterar el cobro provisional. `[🔵 · doc:RPP PROD-648]`

**Módulo: corte por país**

- **Dado** que existen capturas de varias bodegas **Cuando** el responsable ejecuta el corte **Entonces** se consolidan órdenes/servicios por país, se evita duplicidad y se produce un total definitivo trazable. `[🔵 · doc:RPP PROD-648]`

## 7 · Datos (diccionario)

- Entidades propuestas: esquema/tarifa, proveedor, bodega, periodo, concepto de cobro y relación esquema–proveedor. Nombres físicos de tablas/campos no confirmados. `[⚪ · doc:RPP PROD-648]`
- Datos automáticos requeridos: órdenes preparadas, composición mono/multi-SKU, bodega, país y estado de cobro. Fuente backend exacta pendiente. `[⚪ · doc:RPP PROD-648]`
- Datos manuales: etiquetado, kits/combos y almacenamiento; se requiere auditoría de autor, fecha y origen. `[🟡 · inferencia de flujo RPP]`

## 8 · Trazabilidad

| Tipo | Referencia |
|---|---|
| Proyecto Jira | [PRM-1446](https://dropi-it.atlassian.net/browse/PRM-1446) |
| Cadena de Producto | PROD-238 → PROD-648 → PROD-785 → PROD-995 → PROD-1171 → PROD-1330 → PROD-1526 `[🟢 · jira:relaciones Cloners]` |
| Desarrollo | PROD-240 (épico, backlog sin assignee al corte) `[🟢 · jira:PROD-240]` |
| Finanzas / ingresos | INVS-66 (en curso) `[🟢 · jira:INVS-66]` |
| Relación de discovery | PRM-1510 (backlog) `[🟢 · jira:PRM-1446]` |
| Antecedente operativo | STID-1960 — cargo/bodega incorrectos, resuelto operativamente `[🟢 · jira:STID-1960]` |
| Figma | `iR3wuYGNrfTfaDKpViDf0Y`, nodo `2233:35839` `[🔵 · doc:RPP meta.json]` |
| Doc E2E / Drive | [Parametrización de Fulfillment](https://docs.google.com/document/d/1-t3LtPde36OIYE6mDuNWneRn2IL1UPA8paLLiZdbhYI/edit) |
| Confluence | [Síntesis auditada — página 1572732930](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572732930) |
| Comentario Jira canónico | PRM-1446 comentario `50931` `[🟢 · verificado por lectura]` |
| RPP | `/old/fulfillment/parametrizar` · `docs/superpowers/specs/2026-06-11-parametrizar-fulfillment-design.md` |
| Darwin | LOG-014 |

## 9 · Preguntas abiertas

- [ ] Reconciliar +68% vs +78%, base actual, universo facturado/preparado, periodo y fórmula — responsable: Juan + Finanzas/INVS-66. `[⚪ · drive:Kick-off/Discovery · jira:INVS-66]`
- [ ] Confirmar tarifa base, multi-unidad, kits, etiquetado, almacenamiento, recepción, rangos de descuento, IVA y momento del descuento — responsable: Juan + Finanzas/Operación. `[⚪ · drive:Discovery/Bitácora · jira:INVS-66]`
- [ ] Definir política de wallet sin saldo y reverso/anulación — responsable: Juan + Fintech/Finanzas. `[⚪ · doc:RPP PROD-648]`
- [ ] Confirmar identidad y permisos del actor que ejecuta el corte nacional — responsable: Juan. `[⚪ · doc:RPP PROD-648]`
- [ ] Confirmar trigger estable por cada servicio, base de multi-unidad, identificación de etiquetado, pasos de kits y unidad de almacenamiento — responsable: Producto + Operación + TI. `[⚪ · jira:INVS-66]`
- [ ] Reconciliar esquema mensual/diario, captura por bodega, corte por país y acciones masivas de la bitácora con el Figma actual — responsable: Juan + Michel. `[⚪ · drive:Bitácora · figma:2233:35839]`
- [ ] Definir alcance por país y plan de comunicación/T&C; el E2E alterna “CO primero” con “todos los países”. `[⚪ · drive:Kick-off/Comunicación · jira:INVS-66]`
- [ ] Alinear el E2E con el prototipo actual y resolver el comentario abierto de Michel. `[⚪ · drive:comentario 2026-07-02]`
- [ ] Confirmar equipo/lead técnico, actor, sistemas, datos, criterios Gherkin, riesgos y fecha de aprobación antes de mover PROD-1526/PRM-1446. `[⚪ · drive:Hand off · jira:PROD-1526]`

## 10 · Changelog

- 2026-08-02 — Auditoría vertical completada con Jira, Drive, Figma y RPP. Se documentó la cadena completa de Producto, el bloqueo real de handoff, el épico técnico sin iniciar, STID-1960 y la inconsistencia +68%/+78%.
- 2026-08-02 — Sincronización aplicada y releída en Jira (comentario 50931), Confluence (página 1572732930 e índice logístico) y Darwin (resumen de LOG-014). Estados y ownership permanecieron intactos.
- 2026-08-02 — Spec inicial creado desde PRM-1446, Drive y evidencia RPP; supuestos económicos se mantienen abiertos.
