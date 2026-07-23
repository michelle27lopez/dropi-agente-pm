# Spec · Guías reemplazatorias en Ecom Scanner

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md` + `metodologia/jira-tipos-y-estructura.md`.
> **Capacidad ya CONSTRUIDA (beta).** Falta ordenar el discovery (PRM) y enlazar todo según la convención Dropi.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista (discovery PRM) |
| Célula | Ecom (logística) |
| Etapa cadena | Novedad / Devolución (recepción y gestión de devoluciones) |
| Estado global | 🟢 dev finalizado (beta) · 🟡 discovery PRM por ordenar · 🔵 lanzamiento en curso |
| Última actualización | 2026-06-23 |

## 0 · Resumen
Permitir **escanear y leer guías reemplazatorias en Ecom Scanner** (Recepción y Gestión de devoluciones).
Cuando una transportadora gestiona una devolución, genera una **guía reemplazatoria** que se pega sobre la
guía original de Dropi (no se puede leer sin levantar el sticker). El escáner ahora la detecta por patrón,
la resuelve a la guía original (vía dropi-logistic), de-duplica por ambos números y persiste la relación.
**Tres transportadoras** con patrón propio.

## 1 · Patrones por transportadora
| Transportadora | Patrón guía reemplazatoria | Oportunidad PRM |
|---|---|---|
| Interrapidísimo | `300` + 10 dígitos (`300\d{10}`) | [PRM-745](https://dropi-it.atlassian.net/browse/PRM-745) |
| Coordinadora | `39` + 9 dígitos (`39\d{9}`) | [PRM-1380](https://dropi-it.atlassian.net/browse/PRM-1380) |
| TCC | `6` + 8 dígitos (`6\d{8}`, ej. `614526711`) | [PRM-1381](https://dropi-it.atlassian.net/browse/PRM-1381) |

## 2 · Inventario completo (quién, tipo, estado, cómo quedó)
| Key | Proy | Tipo | Estado | Asignado | Reporter |
|---|---|---|---|---|---|
| [DROP-23090](https://dropi-it.atlassian.net/browse/DROP-23090) | DROP | Historia | ✅ Finalizada | Juan | Juan |
| [DROP-25407](https://dropi-it.atlassian.net/browse/DROP-25407) | DROP | Historia (actúa como épica) | ✅ Finalizada | joan.palacio | joan.palacio |
| [DROP-25499](https://dropi-it.atlassian.net/browse/DROP-25499) | DROP | Subtarea (de 25407) | ✅ | joan | joan |
| [DROP-25516](https://dropi-it.atlassian.net/browse/DROP-25516) | DROP | Subtarea (de 25407) | ✅ | joan | joan |
| [DROP-25557](https://dropi-it.atlassian.net/browse/DROP-25557) | DROP | Subtarea (de 25407) | ✅ | joan | joan |
| [DROP-25564](https://dropi-it.atlassian.net/browse/DROP-25564) | DROP | Historia | ✅ | joan | Nodus IA |
| [DROP-25614](https://dropi-it.atlassian.net/browse/DROP-25614) | DROP | Historia | ✅ | joan | Nodus IA |
| [DROP-25667](https://dropi-it.atlassian.net/browse/DROP-25667) | DROP | Error | ✅ | joan | joan |
| [PRM-745](https://dropi-it.atlassian.net/browse/PRM-745) | PRM | Oportunidad | 🟢 Versión Beta (24-jun) | — | Juan |
| [PRM-1380](https://dropi-it.atlassian.net/browse/PRM-1380) | PRM | Oportunidad | 🟢 Versión Beta (24-jun) | — | Juan |
| [PRM-1381](https://dropi-it.atlassian.net/browse/PRM-1381) | PRM | Oportunidad | 🟢 Versión Beta (24-jun) | — | Juan |
| [PROD-1045](https://dropi-it.atlassian.net/browse/PROD-1045) | PROD | Tarea (lanzamiento) | 🔵 backlog · **en sprint 3535** | Laura | Juan |

## 3 · Lo ya hecho esta sesión (cuenta Michel Pino)
- ✅ **PROD-1045** — descripción completa de lanzamiento para Laura (contexto, patrones, beneficio, origen dev, pendientes).
- ✅ **PROD-1045** metido al sprint **"Product Sprint 24 - 26"** (id 3535, board PROD 1267) — junto a PROD-1044 (Re-lanzamiento Servientrega).

## 4 · ⚠️ Bloqueo y por qué se entrega a otro agente
**La sesión Jira es Michel Pino, que NO puede editar PRM** (probado 23-jun: `editmeta` vacío; `editJiraIssue` de `description` y de un customfield → "Field cannot be set. It is not on the appropriate screen"). Por eso las 3 oportunidades PRM (descripción, campos, enlaces, estado) las debe hacer **otro agente con la cuenta de Juan** (Juan sí editó PRM-1568 hoy) o **a mano en la UI de Polaris**.
> Además, los enlaces específicos de Polaris (10008/10012/10009) podrían ser **solo-UI** (no creables por API). Probar; si rebotan, hacerlos en la idea → panel *Delivery/Connections*.

## 5 · 📋 HANDOFF — qué debe hacer el otro agente (con cuenta de Juan)
Para **cada** oportunidad (PRM-745 Interrap. · PRM-1380 Coord. · PRM-1381 TCC), DEJARLAS SEPARADAS (no merge):

**(a) Descripción** (plantilla; ajustar transportadora y patrón):
> **Contexto:** al gestionar una devolución, <Transportadora> genera una guía reemplazatoria (patrón `<patrón>`) pegada sobre la guía original de Dropi, ilegible sin levantar el sticker.
> **Objetivo:** escanear/leer la guía reemplazatoria de <Transportadora> en Ecom Scanner (Recepción y Gestión de devoluciones) y resolverla a la guía original.
> **Estado real:** capacidad construida (beta) → DROP-25407 (+subtareas), DROP-25564 (carrier_guide), DROP-25614 (ecom_web), DROP-25667 (fix país).
> **Pendiente:** confirmar cobertura/lanzamiento de <Transportadora>; enlazar a dev y a PROD-1045.

**(b) Campos estructurados Polaris** (PRM-1380 ya los tiene; copiar a 745 y 1381):
Celula `cf_10783`=Ecom (14682) · Dominio `cf_10322`=Ecom scannar (11741) · Producto/Feature `cf_11080`=Ecom (12341) · Producto `cf_10153`=Dropi (10205) · País `cf_10228`=Todos (11250) · Problema nivel II `cf_11116`=Trazabilidad completa de la Orden (14117) · **Transportadora `cf_12541`** = la que aplique (buscar option id) · Etapa Delivery `cf_11410` → revisar (está "Exploración" pero el dev ya está hecho).

**(c) Enlaces (convención Dropi confirmada):**
- `Discovery - Connected` (id **10012**) → **PRM-1288** "[Ecom] Manejo de devoluciones" *(proyecto madre elegido por Juan = devoluciones)*. ⚠️ PRM-1380 hoy está conectada a **PRM-1287** (Cobertura de guías) → cambiar/mover a PRM-1288.
- `Polaris work item link` = *is implemented by* (id **10008**) → DROP-25407, DROP-25564, DROP-25614 (y DROP-23090 / DROP-25667 opcional).
- Relacionar **PROD-1045** (lanzamiento) con las 3 oportunidades.

**(d) Estado:** sacar PRM-745 de *Impedimientos* y actualizar las 3 al estado que refleje que el dev ya está (¿"Listo para hand off" / "Producción"? según workflow de la Oportunidad).

## 6 · Trazabilidad / convención
Tipos y enlaces en `metodologia/jira-tipos-y-estructura.md`. Cadena: Proyecto (PRM) —Discovery-Connected→ Oportunidad (PRM) —is implemented by→ Épica/Historia (DROP) → Subtarea.

## 6.1 · ✅ HANDOFF EJECUTADO (24-jun, cuenta Juan)
Hecho en PRM-745, PRM-1380, PRM-1381 (las 3, separadas):
- ✅ **Descripción** por transportadora (contexto/objetivo/estado real/pendiente).
- ✅ **Estado** → **Versión Beta** (745 salió de *Impedimientos*).
- ✅ **Campos** PRM-1381: Producto=Dropi + Problema nivel II=Trazabilidad completa de la Orden.
- ✅ **Discovery - Connected** (10012) → **PRM-1288** "Manejo de devoluciones" añadido a las 3.
- ✅ **is implemented by** (Polaris 10008) → DROP-25407, DROP-25564, DROP-25614 en las 3.
- ✅ **Relates** → PROD-1045 en las 3.

### ✅ Cerrado (Juan en UI + agente, 24-jun)
1. ✅ **Conexión vieja a PRM-1287 eliminada** en las 3 (Juan en UI). Hoy quedan conectadas SOLO a PRM-1288.
2. ✅ **Campo Transportadora (`cf_12541`):** Juan creó las opciones **Coordinadora** (15687) y **TCC** (15688); el agente las asignó → PRM-745=Inter rapidisimo · PRM-1380=Coordinadora · PRM-1381=TCC.

**🟢 Handoff 100% completo. Nada pendiente en Jira.**

## 7 · Changelog
- 2026-06-24 (cierre) — Transportadora asignada (745 Interrap / 1380 Coord / 1381 TCC), conexión 1287 eliminada (solo 1288), nota obsoleta limpiada de descripciones. Handoff completo.
- 2026-06-24 — Handoff PRM ejecutado con cuenta Juan: descripciones, estado Versión Beta, campos 1381, enlaces a PRM-1288 + DROP + PROD-1045. Pendiente UI: borrar conexión 1287 y crear opciones Transportadora Coord/TCC.
- 2026-06-23 — Inventario + estructura. PROD-1045 documentado y en sprint 3535. PRM bloqueado para Michel → handoff a otro agente con cuenta de Juan.
