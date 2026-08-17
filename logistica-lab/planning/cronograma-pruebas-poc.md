# 🧪 Cronograma de pruebas de POC — Product Roadmap

> **Qué es:** la agenda de **pruebas de POC con usuarios** de la célula, para llevarla al
> **Product Roadmap** (② del orden de updates: indicador → **Product Road map** → Delivery Road map).
> **Para qué:** el objetivo de estas pruebas es **entender la funcionalidad**, no medir impacto todavía.
> Fuente: pedido de Juan, **16-jul-2026**. Estado: 🟠 **borrador — fechas por definir**.

> ⚠️ **No confundir con el [Cronograma de proyectos Q3/Q4](../estrategia/roadmap-q3-logistica.md)** (el que está
> 🔴 corrido desde 03-jul y hay que citarle a Maria). Aquel es **fases→fechas→dueños de ejecución**;
> éste es **qué POC se prueba con qué usuarios**. Si se mezclan, terminamos con dos cronogramas
> compitiendo y ninguno cerrado. → **Éste cuelga del Product Backlog; aquel del Delivery.**

---

## 1 · Reclasificación (decisión de Juan, 16-jul)

| Ítem | Tipo NUEVO | Antes era | Dónde vive |
|------|-----------|-----------|-----------|
| **Selección de transportadoras** | **Discovery — pruebas de usuarios** | "prueba/beta de 20 usuarios" | Product Backlog · [protocolo](../proyectos/sistema-inteligente-transportadoras/prueba-fase0-20-usuarios.md) |
| **Autoconfirmación** | **Prueba con usuarios** (+ gate **ChateaPro**, §3) | usabilidad con 6 usuarios completada; outcome pendiente | Product Backlog · [spec](../proyectos/movilizacion-confirmacion/spec.md) · PRM-1497 comentario 50933 |
| **Autogeneración de guías** | **Proyecto/solicitud de discovery** | concepto/prototipo; no prueba propia | Product Backlog · [spec](../proyectos/autogeneracion-guias/spec.md) · PRM-1469 → INVS-67 |
| **Notificación de optimización** | **Iniciativa de producto (nuestra)** | — *(ítem nuevo)* | ⚠️ **por precisar — §5** |

**Lo que cambia de fondo:** los tres primeros dejan de ser *experimentos que miden impacto* y pasan a
ser **discovery que entiende la funcionalidad**. Es un cambio bueno y hay que sostenerlo en el lenguaje:
un discovery no se juzga por "¿movió la aguja?" sino por "¿aprendimos lo que no sabíamos?".

---

## 2 · Cronograma

> 🔴 **Fechas por definir con Juan/Kate/Michel — no se inventaron aquí.** Es lo único que falta
> para que esto sea presentable en el Product Roadmap.

> 🆕 **16-jul · WIP = 1 (Juan): "de a una" también en el Product Roadmap.** → Esta tabla **NO son 4 POC
> en paralelo: es una fila y tres en cola.** El orden de abajo es propuesta; **la decisión es de Juan**
> (sustento en [`backlogs-y-priorizacion.md`](../estrategia/backlogs-y-priorizacion.md) §2.b).

| Orden | POC | Tipo | Usuarios | Fecha | Dueño | Prerrequisito |
|-------|-----|------|----------|-------|-------|---------------|
| **🎯 1º** | **Autoconfirmación** | Gate técnico + iteración T4 | ChateaPro + muestra segmentada | _por definir_ | Juan · Michel | Resolver trigger/atribución y fuente primaria (§3) |
| ⏸️ 2º | **Autogeneración de guías** | Proyecto/solicitud de discovery | proveedores de alto volumen, después del DoR | _por definir_ | Juan driver · owner Jira pendiente | Recuperar análisis Kevin/Lucho; baseline; lotes/impresión; fallback carrier; datos |
| ⏸️ 3º | **Selección de transportadoras** | Discovery · pruebas de usuarios | ≥20 dropshippers | _por definir_ | **Kate Pencue** (Juan = Carrier Ops) | Catálogo caracterizado (Juan + Paula) |
| ⏸️ — | **Notificación de optimización** | Iniciativa de producto | — | _por definir_ | Juan | **Definir qué es** (§5) |

**Por qué Autoconfirmación va 1º:** es la **fuga #1** (movilización), es la **más avanzada** (prototipo
funcional) y **tiene una pregunta que puede matarla** (¿ChateaPro tolera el gate?, §3). *Lo que puede
morir barato se prueba primero.*

**Por qué Selección de transportadoras NO gasta el slot:** **no es proyecto de Juan** (PM = Kate). Su
aporte ahí — el **catálogo con Paula** — es **una dependencia que debe, no su foco**. Se paga y se sigue;
no consume WIP. Si Kate corre el discovery, Juan entra como Carrier Ops, no como dueño.

**Entrevistas de usuarios (transversal, §4)** alimentan el 1º y el 2º.

---

## 3 · 🔑 Autoconfirmación con **ChateaPro** — el hallazgo del 16-jul

**Cómo funciona hoy:** cuando la orden entra en **"pendiente confirmación"**, el flujo de Chatea
**se dispara de inmediato** (sale a confirmar con el cliente).

**Lo que propone Juan:** que **no se dispare hasta que el sistema decida si autoconfirma o no**.

**Por qué esto importa más de lo que parece — es una condición de existencia del experimento, no un detalle:**
- Sin ese gate hay una **carrera**: Chatea sale a confirmar **y** el sistema autoconfirma en paralelo
  → el cliente recibe un contacto por una orden ya confirmada, y no se sabe **quién** confirmó.
- Eso rompe la trazabilidad que el propio experimento necesita. Recordar: **hoy el sistema NO distingue
  confirmación manual de automática — salvo Chatea.** Chatea es **la única fuente que hoy tiene la marca**.
  → **ChateaPro es a la vez el riesgo de integración y el instrumento de medición.**

**Qué hay que entender de ellos (objetivo de la sesión):**
1. ¿Cómo confirman la orden hoy? ¿Qué pasos, qué decide un agente vs. el bot?
2. ¿**Qué hacen** con la orden después de confirmar/no confirmar?
3. ¿**Cómo impacta a sus sistemas** meter un gate antes del disparo? (¿reprocesan? ¿tienen cola? ¿latencia máxima tolerable?)
4. ¿Pueden **esperar** la decisión del autoconfirmador, o su flujo asume disparo inmediato?

> **Mentor:** la pregunta #3 es la que puede matar la idea. Si el flujo de Chatea asume disparo inmediato
> y no tolera espera, la autoconfirmación no es "activar una regla" — es **rediseñar el trigger de un
> sistema de un tercero**, y eso cambia el tamaño del proyecto. **Averiguarlo antes de prometer fecha.**

---

## 4 · Entrevistas de usuarios — dropshippers (cómo confirman)

**Objetivo:** entender **cómo confirman hoy** y **qué variables usan** para decidir.
Alimenta las **reglas de madurez** (que seguían pendientes con Michel) y los guardarraíles.

**Por qué vale:** las reglas de madurez actuales (constancia mensual + ≥50 órd/mes) salieron de
**data agregada**, no de preguntarle a nadie. Las entrevistas dicen *por qué* confirman así — que es
lo que la data no da. Complementa la crítica de Juan Camilo Rojas: *el promedio ~11h oculta segmentos*.

**Variables a levantar (lista viva):**
- 🆕 **Órdenes duplicadas** ← *(Juan, 16-jul)*. Ya está en el spec como rescatable (**80K órdenes**,
  [spec §1.C](../proyectos/movilizacion-confirmacion/spec.md)) y como Sol B1 ("fricción al cancelar duplicado").
  **Doble uso:** (a) señal de rescate y (b) **guardarraíl de autoconfirmación → si es duplicada, NO autoconfirmar.**
  Se suma a los guardarraíles ya acordados: ⛔ zona rural (veredas/fincas) · ⛔ variantes (talla/color).
- Variables por levantar en las entrevistas: _(pendiente — salen de la sesión)_

---

## 5 · ⚠️ "Notificación de optimización" — falta definir qué es

Juan la nombra como **iniciativa de producto nuestra**, pero no está en ningún doc del cerebro.
**No se asumió nada.** Lecturas posibles:
- (a) La **notificación que invita al dropshipper a optimizar** su selección de transportadoras
  (empuja el banner *"Optimiza tu logística con IA"* del Figma) → sería de Selección de transportadoras.
- (b) Algo distinto de **Notificaciones de Prevención de Devoluciones** ([PRM-1512](https://dropi-it.atlassian.net/browse/PRM-1512), que está en Delivery, FINALIZAR).

→ **Pendiente: que Juan aclare.** Sin eso no entra al Product Roadmap con contenido.

## 6 · Changelog
- 2026-07-16 — Creado por pedido de Juan. Reclasificados 4 ítems; documentado el gate de ChateaPro,
  las entrevistas a dropshippers y la variable "órdenes duplicadas". Fechas y §5 pendientes de Juan.
