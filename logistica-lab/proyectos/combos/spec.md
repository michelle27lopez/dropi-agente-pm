# Spec · Combos CAS + Lectura de combos en Ecom (apoyo a Supplier)

> Fuente de verdad INTERNA de este proyecto. Obedece a `metodologia/spec-driven.md`.
> El documento E2E de Drive se genera DESDE aquí. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.
> Fuente: `figma:` `jira:` `screenshot:` `data:` `reunion:` `doc:` `drive:`.

> ⚠️ **REENCUADRE (23-jun):** este frente NO es combos de dropshippers. Es **apoyo a la célula
> Supplier** (PM Jaime Guevara): **Combos CAS** + **lectura de combos en Ecom**, conectados con
> **Ecom Scanner** para la **lectura y creación de órdenes por punto**. Juan trabaja en modo apoyo.
>
> ✅ **EJECUTADO (23-jun, cuenta de Juan):** creada Solución **PRM-1568** (Combos CAS) en PRM,
> documentada Oportunidad **PRM-1467** (lectura de combos en Ecom), ambas conectadas al Proyecto
> Ecom **PRM-1287** y enlazadas (*Relates*) con **PROD-471**. ⚠️ Jaime Guevara **no es asignable
> en PRM** (no es miembro del proyecto) → ambas quedaron sin asignar; falta agregarlo al proyecto.

| Campo | Valor |
|-------|-------|
| Owner / PM | Apoyo a **Supplier** — PM **Jaime Guevara** (`712020:7d1d84e7-f4ab-444b-bc86-df8c7be30256`) |
| Product Designer | Michel Pino (sesión Jira activa; hizo CAS Combos y UX de Ecom Scanner) |
| Stakeholder | Célula **Supplier Success / Catálogo** |
| Célula | Supplier (Catálogo) · vínculo logístico vía **Ecom Scanner** |
| Etapa de la cadena | Selección/Generación (lectura y **creación de órdenes** por punto) |
| Estado global | 🟡 documentado y organizado en Jira (PRM-1568 + PRM-1467 bajo PRM-1287); pendiente métrica + asignación a Jaime |
| NSM que mueve | Operativa (cobertura de lectura/creación de órdenes); indirecto a movilización |
| Última actualización | 2026-06-23 |

## 0 · Resumen y estado global
Objetivo: que mediante **Combos CAS** y **Ecom Scanner** se pueda hacer la **lectura y creación
de órdenes de cada punto**, incluyendo órdenes con productos tipo combo. Hay que **documentar** la
lectura de combos en Ecom (PRM-1467), **crear y organizar** la épica de Combos CAS (en desarrollo,
asignada a Jaime Guevara), y **reorganizar** las vistas/columnas de Ecom en PRM. Trabajo de **apoyo
a Supplier**; se continúa desde otro agente.

## 1 · Problema raíz
- El módulo **CAS** (soporte / comunicación) no maneja de forma específica las órdenes con producto
  **combo**: faltan validaciones progresivas y coherencia entre alertas y evidencias.  `[⚪ jira:PROD-471]`
- **Ecom** no lee productos tipo combo → no se pueden leer/crear correctamente esas órdenes por punto.  `[🟡 jira:PRM-1467 (documentada 23-jun)]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** "si CAS + Ecom Scanner manejan combos, se habilita la lectura y creación de órdenes
  por punto sin errores, mejorando cobertura operativa."  `[jira:PROD-471, PRM-1467]`
- **Métrica + base:** por definir con Supplier.  `[pendiente]`

## 3 · Usuarios / actores
- **Soporte** (usa CAS para atender solicitudes).  `[jira:PROD-471]`
- **Proveedor / operador de punto** (lee y crea órdenes en Ecom Scanner).  `[jira:PROD-459]`

## 4 · Alcance
**Entra:**
- **Combos CAS:** validaciones progresivas + alertas del modal de inicio de conversación coherentes
  con evidencias, cuando la orden tiene un combo.  `[⚪ jira:PROD-471 (discovery hecho)]`
- **Lectura de combos en Ecom:** documentar PRM-1467 (hoy Oportunidad suelta, sin descripción).  `[⚪ jira:PRM-1467]`
- **Ecom Scanner:** lectura y creación de órdenes por punto.  `[🟢/🔵 jira:DROP-20368 (en revisión), PROD-459 (discovery hecho, Juan)]`

**No-objetivos (⛔):**
- **Combos de dropshippers** (PRM-555, PRM-1372, PROB-243). Es otro frente; aquí **no se toca**.  `[⛔ indicación de Juan 23-jun]`

## 5 · Reglas de negocio
- En CAS, los motivos de consulta obedecen a **la orden, no al producto**; las validaciones se
  especializan solo cuando la orden contiene un combo.  `[🟡 jira:PROD-471 (conclusión discovery)]`

## 6 · Criterios de aceptación (Gherkin)
- Por definir tras documentar PRM-1467 y la épica Combos CAS.

## 7 · Datos (diccionario)
- `order_details.quantity_combo`, `order_details.combo_combination_id` — líneas de orden tipo combo.  `[data: PowerBI order_details]`
- `product_combo` (tablas) — modelo de combos en BD.  `[data: jira:DROP-24843]`
- **Modelo CAS** (del doc de arquitectura): `cas_request`, `cas_chats` (estados `queues → active → close`), `cas_interactions`, `cas_service_types`, `cas_ticket_types`. Tiempo real vía Centrifugo; filtra por `supplierId` (PRODUCTO) o `enterpriseId` (TRANSPORTADORA).  `[🟡 confluence: Doc Arquitectura Nuevo Módulo CAS, 888406075]`

### Contexto CAS (hallazgo 23-jun, Confluence 888406075)
CAS maneja casos por **tipo de servicio**: `TRANSPORTADORA` (por orden) y el nuevo `PRODUCTO/PROVEEDOR` (dropshipper ↔ proveedor, sin transportadora). **Ya existe un tipo de ticket "Solicitar combo de producto"** (`casServiceType = PRODUCTO`, prioridad MEDIUM) → punto de contacto real combo ↔ CAS. Endpoints: `POST /api/v1/casrequest/create`, `GET /api/v1/cas-types-tickets`, `GET/POST /api/v1/product-chat/...`. El ciclo de vida del chat es común; cambian las dependencias (supplier vs enterprise).
> ⚠️ **Inconsistencia a resolver con Jaime/soporte:** PROD-471 encuadra Combos CAS como validaciones por **ORDEN** (caso logístico); el doc de arquitectura es por **PRODUCTO** (dropshipper↔proveedor) e incluye el ticket "Solicitar combo". ¿Alcance = casos por orden, por producto, o ambos?

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Combos CAS (origen) | [PROD-471](https://dropi-it.atlassian.net/browse/PROD-471) (discovery, hecho) |
| Lectura combos Ecom | [PRM-1467](https://dropi-it.atlassian.net/browse/PRM-1467) (Oportunidad · ✅ documentada 23-jun · conectada a PRM-1287) |
| Ecom Scanner | [PROD-459](https://dropi-it.atlassian.net/browse/PROD-459) (Juan) · [DROP-20368](https://dropi-it.atlassian.net/browse/DROP-20368) (dev) · [PRM-1344](https://dropi-it.atlassian.net/browse/PRM-1344) · épica [DROP-22160](https://dropi-it.atlassian.net/browse/DROP-22160) |
| Proyectos Ecom (PRM) | **PRM-1287** (padre elegido) · [PRM-1288](https://dropi-it.atlassian.net/browse/PRM-1288) · [PRM-1292](https://dropi-it.atlassian.net/browse/PRM-1292) · PRM-1289 |
| **Solución Combos CAS** | ✅ [PRM-1568](https://dropi-it.atlassian.net/browse/PRM-1568) (creada 23-jun en PRM · conectada a PRM-1287 · Relates PROD-471 y PRM-1467 · sin asignar) |
| Doc E2E plantilla (Drive) | [Proyectos E2E - Combos](https://docs.google.com/document/d/1Uq2blBt89RhnSrk6OFNhQZ23bvo7DYJxVoOwj6rztp0/edit) (plantilla en blanco) |
| **Doc E2E lleno (Kick-off + Hand-off)** | ✅ [Proyectos E2E - Combos (Kick-off + Hand-off) — Juan](https://docs.google.com/document/d/1XbfedX7wOwPIabPwzmVE2l4U3eRSA3UWWldUP26wUMM/edit) (creado 23-jun; enlazado en campos Doc kickoff/Doc hand off de PRM-1568 y PRM-1467) |
| Carpeta Drive | [carpeta Combos](https://drive.google.com/drive/folders/1Wz39TLJkZPOpX8_0IiAuKXP7sF1-_t-x) · dentro de [7. Logistic Success](https://drive.google.com/drive/folders/1H_q-rVZG_ktDoLiDT3iYDQWbiVSYFmkF) |

### Solución Combos CAS — ✅ CREADA (PRM-1568)
Decisión 23-jun (Juan): se creó como **Solución en PRM** (discovery), no Epic en DROP.
| Campo | Valor |
|---|---|
| Proyecto / Tipo | **PRM** · Solución |
| Key | **PRM-1568** |
| Título | `[Dropi] Combos CAS: validaciones y evidencias para órdenes con producto combo` |
| Asignado | ⚠️ sin asignar — Jaime Guevara no es miembro de PRM (no asignable). Owner indicado en la descripción. |
| Conexión | Discovery–Connected a **PRM-1287** · Relates **PROD-471** y **PRM-1467** |

### Campos estructurados de Polaris llenados (23-jun)
> No basta con la descripción: los Pinned fields de Polaris se llenaron en ambas.
| Campo | PRM-1467 (Ecom) | PRM-1568 (CAS) |
|---|---|---|
| Célula | Ecom | Supplier Succes (Proveedores) |
| Etapa Delivery | Backlog | Backlog |
| Dominio | Ecom scannar | CAS |
| Feature | [Productos] Combos | [Productos] Combos |
| Producto/Feature | Ecom | CAS |
| Producto | Dropi | Dropi |
| Roles de usuarios | Proveedor | Proveedor |
| Objetivo Negocio | Aumentar Órdenes | Aumentar Órdenes |
| OKR Ppal | OKR1 Escalar volumen | OKR1 Escalar volumen |
| KR Ppal | OKR1·KR1 (9.6M órdenes) | OKR1·KR1 (9.6M órdenes) |
| Manager | Jaime Guevara | Jaime Guevara |
| Diseñador | Michel Pino | Michel Pino |

**Segunda tanda (23-jun, ambas):** País = Colombia · Público objetivo = Proveedores · Categoría = business as usual · Priorización = Medium · Doc kickoff + Doc hand off = doc E2E lleno. Específicos → Módulos: 1467 Órdenes / 1568 Servicio al cliente · Problema nivel II: 1467 Cobertura logística / 1568 Optimización casos Logísticos · Stakeholders: 1467 Logística / 1568 CAS · Lente 4D: 1467 Negocio / 1568 Cliente · Tamaño Idea: 1467 Guijarro / 1568 Roca.

**Sin llenar (desconocidos):** Assignee (Jaime no asignable en PRM), Front/Back/PL, fechas (Inicio/Fin desarrollo, diseño, definición, hand-off, liberación), Tipo de lanzamiento.

## 9 · Preguntas abiertas
- [x] ~~Alcance de "Combos CAS": (a) o (b)~~ → **resuelto:** abarca ambos lados (soporte CAS + lectura Ecom/Scanner); es el frente de apoyo a Supplier.
- [ ] ¿"Punto" = punto de venta / bodega / punto de recogida? Qué se lee y qué orden se crea.
- [ ] ¿Un solo doc E2E (Combos CAS ↔ Ecom Scanner) o dos separados?
- [ ] Métrica de éxito + línea base (con Supplier). **← principal pendiente.**
- [ ] **Agregar a Jaime Guevara como miembro de PRM** para asignarle PRM-1568 y PRM-1467 (lo hace admin de Jira).

## 10 · Changelog
- 2026-06-23 (c) — **Campos Polaris completados** (2 tandas) en PRM-1467 y PRM-1568; **creado doc E2E lleno** (Kick-off + Hand-off) en carpeta Combos y **enlazado** en los campos Doc kickoff/Doc hand off de ambos issues. Falta: definir métrica con Supplier, afinar Gherkin en sesión, crear historias al pasar a desarrollo.
- 2026-06-23 (b) — **Ejecutado con cuenta de Juan:** creada Solución **PRM-1568** (Combos CAS), documentada **PRM-1467** (lectura combos Ecom), ambas conectadas a **PRM-1287** y enlazadas a **PROD-471**. Jaime no asignable en PRM → sin asignar.
- 2026-06-23 — Reencuadre: de "Combos dropshippers" a **Combos CAS + lectura combos Ecom (apoyo a Supplier)**. Investigación Jira/Confluence, borrador de épica, decisiones pendientes.
