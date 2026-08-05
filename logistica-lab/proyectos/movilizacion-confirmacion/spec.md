# Spec · Movilización: rescatar la confirmación (SHOP)  ·  flujo end-to-end

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. **Cada afirmación lleva estado + fuente.**
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo. Fuente: `data:` `jira:` `doc:`.
> Replica el molde de la rama de muestra (`direccion-confiable-geo/spec.md`). **Es la fuga #1 en palanca**
> (plan de 3 frentes, frente #1: la más barata y la que más mueve la NSM). Modelo: `metodologia/arbol-discovery-okr-jira.md`.

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista |
| Proyecto OKR (Jira) | **PRM-1497** "Movilizaciones: del 80% al 90%" |
| Célula | Logistic Success |
| Etapa de la cadena | Confirmación (pre-red) |
| Fuga | ① churn pre-red |
| OKR / KR | OKR2 · **KR2.1 Tasa de entrega ≥70%** (movilización = ½ de la NSM) |
| Estado global | 🟡 discovery · prueba de usabilidad completada con 6 usuarios; gate técnico e impacto en NSM pendientes |
| Última actualización | 2026-08-02 |

> **Corte auditado 02-ago** `[doc:Hub logístico + Drive; jira:PRM-1497/1574/1588/1589]`
> - La prueba moderada del configurador de autoconfirmación **sí ocurrió** entre el 18 y el 25-jul con 6 participantes. Resultado: aceptación conceptual 81/100, pero la interpretación del impacto económico solo fue correcta en 17% de la muestra. Evidencia estructurada: [`prueba-usabilidad-julio-2026.md`](prueba-usabilidad-julio-2026.md).
> - Esto valida **comprensión y usabilidad parcial**, no que la autoconfirmación aumente movilización, entrega o reduzca devoluciones. Aún no existe un A/B ni una medición outcome posterior.
> - El gate de ChateaPro continúa abierto: hay que verificar convivencia del trigger, atribución manual/automática e instrumentación antes de prometer handoff o fecha.
> - Jira ya contiene la oportunidad PRM-1574 y la cadena PRM-1588 → PRM-1589. Sin embargo, esa cadena describe WhatsApp y órdenes “confirmadas sin guía”; **no se comprobó** que represente el configurador general probado. Esa frase también puede invadir el problema de autogeneración de guías (LOG-012/PRM-1469).
> - No se encontró un E2E dedicado ni el artefacto canónico crudo de las seis sesiones en Drive. El Hub contiene el consolidado de resultados; las reuniones semanales de Drive confirman que las pruebas ocurrieron, no reemplazan grabaciones, guion ni matriz de observación.

> **🆕 16-jul · reclasificación + el gate de ChateaPro** `[fuente: Juan, 16-jul]` · detalle en [`planning/cronograma-pruebas-poc.md`](../../planning/cronograma-pruebas-poc.md) §3-4
> - **Autoconfirmación pasa a "prueba con usuarios"** y **autogeneración a "proyecto de discovery"** (deja de ser "2º experimento listo"). Objetivo: **entender la funcionalidad**, no medir impacto todavía.
> - **🔑 El gate de ChateaPro.** Hoy, cuando la orden entra en **"pendiente confirmación"**, el flujo de Chatea **se dispara de inmediato**. Propuesta de Juan: **que no se dispare hasta que el sistema decida si autoconfirma o no.**
>   - **Sin ese gate hay una carrera:** Chatea sale a confirmar **y** el sistema autoconfirma en paralelo → el cliente recibe contacto por una orden ya confirmada y **no se sabe quién confirmó** → rompe la trazabilidad que el propio experimento necesita.
>   - **Chatea es hoy la ÚNICA fuente con la marca** manual vs. automática → es a la vez el **riesgo de integración** y el **instrumento de medición**.
>   - **A entender con ellos:** ¿cómo confirman hoy? · ¿qué hacen con la orden después? · **¿cómo impacta a sus sistemas meter el gate?** · ¿su flujo tolera esperar o asume disparo inmediato?
>   - ⚠️ **La tercera pregunta puede matar la idea:** si el flujo de Chatea no tolera espera, autoconfirmación **no es "activar una regla"** sino **rediseñar el trigger de un sistema de un tercero** → otro tamaño de proyecto. Averiguarlo **antes de prometer fecha**.
> - **Entrevistas a dropshippers:** ¿cómo confirman hoy y **qué variables usan**? Alimenta las **reglas de madurez** (pendientes con Michel), que hoy salieron de *data agregada* (constancia + ≥50 órd/mes) y no de preguntarle a nadie — la data no dice el *por qué*.
> - **🆕 Variable "órdenes duplicadas"** (Juan, 16-jul): ya está abajo como rescatable (**80K**, §1.C / Sol B1). **Doble uso:** (a) señal de rescate y (b) **guardarraíl → si es duplicada, NO autoconfirmar.** Se suma a ⛔ zona rural (veredas/fincas) y ⛔ variantes (talla/color).

> **Histórico 09-jul · experimentos en montaje** `[doc:update de Juan a Maria, 09-jul; superado parcialmente por pruebas 18–25-jul]`
> - **Autoconfirmación por madurez** (del Cell Board 1-jul): quedó socializado con Santiago y entonces estaba a la espera de personas. Esa espera **se cerró para la prueba de usabilidad de 6 participantes**, no para la futura prueba de impacto. Reglas de madurez (constancia mensual + ≥50 órd/mes) seguían por validar con Michel. El sistema aún debe dejar trazabilidad manual vs. automática.
> - **Autogeneración de guías:** 2º experimento **listo para probar** (falta con quién correrlo). Ataca la fuga posterior a la confirmación (confirmó pero no genera guía → no entra a red).

## 0 · El flujo end-to-end
```
FUGA ① · La confirmación SHOP es un colador: mata la orden en vez de rescatarla   (= PRM-1497)
  └─ OPORTUNIDAD · "La confirmación SHOP mata órdenes y 428K mueren sin que sepamos por qué"
       ├─ Insight 1 · SHOP entra 57-69% vs MANUAL 93%; SHOP sin validar = 618K órd / GMV 66.244M
       ├─ Insight 2 · 428K cancelan "otros/sin nota" = no instrumentado (no se rescata lo que no se sabe por qué murió)
       └─ Insight 3 · la validación YA existe (+12 pts) → el producto es FORZARLA, no construirla
     ├─ IDEA A · Instrumentar el motivo de cancelación (saber qué muere, separar rescatable/no)
     │    └─ Sol A1 · Catálogo cerrado + motivo obligatorio (in-app/Userpilot)   ← el más barato, desbloquea todo
     └─ IDEA B · Forzar la validación en SHOP donde hoy se salta
          ├─ Sol B1 · Nudge de validación en SHOP + fricción al cancelar duplicado
          └─ Sol B2 · Recordatorio / auto-confirmación WhatsApp para las "confirmó sin guía" (266K)
  → IMPACTO: Alto (movilización es ½ de la NSM; validar las 618K ≈ +90K entregas)
  → MÉTRICA: % entra a red (68→90) · % SHOP validada · % cancelaciones con motivo · rescate duplicado/incompletos
```
> **Lente de usuario (dropshipper):** sus órdenes mueren en confirmación **sin que sepa por qué** y sin opción de
> rescatarlas. Darle visibilidad (motivo) + rescate (validar, de-duplicar) protege su venta. `[doc:tema 16]`

## 1 · Árbol de problema
**Raíz:** la orden no entra a la red porque la confirmación —sobre todo en SHOP— la mata sin rescatarla. La sangría está **pre-red**, no en la última milla. `[data:tema 04]`
- **A · No se fuerza la validación en SHOP** — 618K órdenes sin validar (GMV 66.244M); validar da +11.9 pts entra red. `[data:tema 04]`
- **B · La confirmación no rescata** — SHOP muere ~20% real (~920K), de los cuales **428K "otros/sin nota"** (no instrumentado). `[data:tema 04/05]`
- **C · Rescatables claros perdidos** — duplicado 80K, datos incompletos 63K, hoy no se interceptan. `[data:tema 05]`

## 2 · Oportunidad + los 3 Insights
**"La confirmación SHOP es un colador que mata órdenes en vez de rescatarlas, y la mayoría muere sin motivo registrado."**
### Insights
1. **El canal SHOP es la fuga #1 de movilización:** entra 57-69% vs MANUAL 93%; cancela ~20% vs 5.6%. SHOP sin validar = **618K órdenes / GMV 66.244M**; validar = +14.5 pts extremo a extremo ≈ **+90K entregas**. `[data:tema 04]`
2. **Mata a ciegas:** **428K** cancelan "otros/(sin nota)" → no instrumentado. *"No se rescata lo que no se sabe por qué murió."* `[data:tema 04/05]`
3. **La validación funciona y ya existe** (`is_validated`, +12 pts) → el producto es **forzarla en SHOP**, no construir un validador. `[data:tema 04/11]`

## 3 · Ideas (las palancas)
- **Idea A · Instrumentar el motivo de cancelación** — catálogo cerrado + motivo obligatorio, separando rescatable/no. Barato y **desbloquea todo lo demás**. `[⚪ · data:tema 05 frente #1]`
- **Idea B · Forzar la validación en SHOP** donde hoy se salta + interceptar rescatables (duplicado, incompletos). `[⚪]`

## 4 · Soluciones (experimentos, barato → caro)
- **A1 · Catálogo cerrado de motivos + obligatorio** (in-app/Userpilot). El experimento de arranque del cerebro. `[⚪ · data:tema 05]`
- **B1 · Nudge de validación en SHOP** + fricción al cancelar duplicado. Barato (UX/copy). `[⚪]`
- **B2 · Recordatorio / auto-confirmación WhatsApp (ChateaPro)** para las 266K "confirmó sin guía". Medio. `[⚪ · jira:PRM-1515]`
> No-objetivos (⛔): construir un validador nuevo (ya existe); validación de **origen/bodega** (descartada: bodegas movilizan 97-99.9%). `[⛔ · data:tema 05]`

## 5 · Impacto (aporte al KR)
**Alto — la apuesta más barata y de mayor palanca.** Movilización es **½ de la NSM** (entrega = movilización × % entrega sobre red); meta 68→90. Validar las 618K ≈ **+90K entregas**. Instrumentar el motivo es casi gratis y desbloquea el rescate. `[data:tema 04/05]`
> `Aporte a NSM` (al cargar): **Alto · movilización · ~+90K entregas (validación) + rescate por instrumentar**.

## 6 · Métricas (de éxito + cómo se mide)
- **Éxito:** % de órdenes que entran a red (base ~68%, meta 90%), mirando SHOP aparte de MANUAL. `[data:tema 04]`
- **Producto:** % de SHOP validada (cobertura) · % de cancelaciones **con motivo registrado** (instrumentación) · rescate de duplicado/incompletos. `[🟡]`
- **Tensión a vigilar:** movilización↑ vs devolución↓ no se optimizan con la misma palanca — mirar las dos juntas. `[data:tema 05]`
- **Datos:** `Order` (`created_from`, `is_validated`, `validation_date`, `status`) · `Historyorder`. El **catálogo de motivos es instrumentación nueva** (no query), lo demás es medible con data existente. `[data:tema 10]`

## 7 · Multi-país
CO primero; el catálogo de motivos y el nudge de validación aplican a todos los países. Umbrales/baseline por país. `[🟡 · arbol-discovery-okr-jira §6]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| OKR / KR | OKR2 [PRM-1391] → KR2.1 [PRM-1396] |
| Proyecto OKR | **PRM-1497** · Jira: `En Ruta (backlog)`, sin assignee ni descripción al corte 02-ago |
| Oportunidad confirmada | **PRM-1574** · baja movilización en órdenes de integraciones; relacionada con PRM-1497 |
| Idea / solución candidatas | **PRM-1588 → PRM-1589** · WhatsApp. Existen, pero su equivalencia con el configurador general no está validada |
| Rama separada | **LOG-012 / PRM-1469** · autogeneración de guía; comparte superficie, no actor ni decisión |
| Evidencia de prueba | [`prueba-usabilidad-julio-2026.md`](prueba-usabilidad-julio-2026.md) · Hub `AutoconfirmacionResultados.tsx` · Weekly Product 24/31-jul en Drive |
| Estado compartido | Hoja Drive “Estado de los proyectos 23/07”, tab LS: dos filas duplicadas de Autoconfirmación en Discovery / Concepción de experimento |
| Jira / Confluence sincronizados | PRM-1497 comentario **50933** · [síntesis LOG-001](https://dropi-it.atlassian.net/wiki/spaces/PD/pages/1572864001) creada e indexada; ambos releídos 02-ago |
| E2E Drive | No se encontró documento dedicado; sin escritura por salvaguarda del conector |
| Hermanas / antecedentes | `direccion-confiable-geo` (validación de destino) · PRM-91 · ChateaPro como dependencia técnica por identificar con ticket exacto |

## 9 · Preguntas abiertas
- [ ] **Catálogo de motivos:** ¿qué motivos entran y cómo se separan rescatable/no? — Juan + Michel/Laura `[data:tema 05]`
- [ ] **Forzar validación en SHOP:** ¿nudge o bloqueo? ¿dónde se salta hoy? — Juan + Data
- [ ] **Baseline de cancelación por motivo y canal** — hoy 428K "sin nota"; la instrumentación es el primer entregable. — Data
- [ ] **Gate ChateaPro:** ¿tolera esperar la decisión del motor? ¿cómo se atribuye quién confirmó y dónde queda el marcador? — Juan + ChateaPro
- [ ] **Equivalencia Jira:** ¿PRM-1588/1589 representan el configurador general de reglas o solo la recuperación por WhatsApp? — Juan
- [ ] **Frontera con LOG-012:** ¿“confirmada sin guía” pertenece realmente a autoconfirmación o a autogeneración? — Juan + Jira owner
- [ ] **Fuente canónica de la prueba:** enlazar guion, grabaciones/consentimiento y matriz de observación; hoy solo existe el consolidado del Hub y evidencia semanal en Drive.
- [ ] **Documento E2E:** crear una copia de la plantilla de nueve fases cuando se autorice la escritura en Drive; no usar este spec como sustituto del E2E vivo.
- [ ] **Estado compartido:** deduplicar las dos filas de Autoconfirmación en la hoja LS después de confirmar cuál es la fila canónica; no borrar sin owner.

## 10 · Changelog
- 2026-08-02 — Reconciliadas prueba de usabilidad (6 usuarios), Jira PRM-1574/1588/1589, reuniones Drive y hoja LS. Se separó usabilidad de impacto; se registraron los huecos de E2E, fuente cruda, gate ChateaPro y equivalencia con LOG-012.
- 2026-06-25 — Rama bajada end-to-end con el molde aprobado. Fuga #1 en palanca (frente #1 del plan). Pendiente: validar y, cuando se decida, replicar resto (novedad/posventa) + (último) cronograma + Jira.
