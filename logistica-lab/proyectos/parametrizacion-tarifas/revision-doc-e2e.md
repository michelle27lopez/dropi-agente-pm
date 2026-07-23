# Revisión del doc E2E de Tarifas — REAL vs GENÉRICO (plantilla)

> Revisión completa del [doc E2E](https://docs.google.com/document/d/1zVCV1UJDkqTHr7SxP9LlfCy4ciVlucg2U-5nVQfIIhQ/edit) (96K caracteres, leído entero) · 23-jun-2026.
> Objetivo de Juan: **pulir**, no rehacer. El problema: hay **mucho relleno genérico de la plantilla** que parece contenido pero NO es real. Aquí está marcado qué conservar y qué reemplazar.
> Para llenar lo genérico con la realidad → usar [`feature-real-ui.md`](feature-real-ui.md).

## Veredicto
El doc **NO está casi terminado**. Está **~50% real, ~50% plantilla en blanco**:
- ✅ **REAL y fuerte:** Sección 1 (Kick-off), 2 (Discovery), 4 (Following).
- ❌ **GENÉRICO (placeholder de plantilla, sin tocar):** Sección 3 (parcial), 5, 6 (el hand-off a TI, lo más grave), 7, 9.
- 🐛 **Transversal:** emojis de rol corruptos (encoding) en todos los encabezados + inconsistencias de cifras.

## Inventario sección por sección
| # | Sección | Estado | Detalle |
|---|---------|--------|---------|
| 1 | Kick-off | ✅ REAL | Completo: info, POR QUÉ ahora, 5 painpoints, OKR/KR, 17 dudas. La mejor. |
| 2 | Discovery | ✅ REAL | Usuarios+madurez, AS-IS (express/industrial), research (4 hallazgos), riesgos, 4 hipótesis, conclusiones. |
| 3 | Definición & Alcance | 🟡 PARCIAL | 3.1–3.6 **vacíos (plantilla)**. Solo un bloque crudo "Conceptualización Prototipo" con notas en 1ª persona. |
| 4 | Following y lanzamiento | ✅ REAL | Muy bueno: 7 triggers, 7 microsurveys, métricas con fórmula, piloto 12 sem. **Pero** no nombra HEART ni SEQ y usa numeración propia. |
| 5 | Estrategia de comunicación | ❌ GENÉRICO | Plantilla literal: *"Nombre oficial del producto…"*, *"Explica en 2-3 líneas…"*. Cero contenido de Tarifas. |
| 6 | **Hand-off a DEV/Stakeholders** | ❌ GENÉRICO | **Lo más grave.** Cabecera llena (Kevin Fory/Daniel Salazar, Tech Lead Jose Giraldo) pero JTBD, C4 N1, glosario, reglas y Gherkin son **todos placeholders**. |
| 7 | Activación TDL/TPL | 🟡 GENÉRICO | RACI/DORA/Risk/PERT/Traffic Light son la plantilla genérica; ningún dato de Tarifas. (OK: lo llena TI, pero hoy 100% vacío.) |
| 8 | Lanzamiento | 🟡 PARCIAL | No tiene encabezado propio; el contenido vive dentro de 4.10 "Lanzamiento y Kick-off" (sí está lleno). Consolidar. |
| 9 | Hallazgos Following | ❌ GENÉRICO | Plantilla: *"[Enlace a Mixpanel/Looker…]"*, *"[Métrica 1, ej: Conversión]"*. |

## Lo genérico que parece real (placeholders a ELIMINAR o reemplazar)
Citas textuales para ubicarlos:
- 6 · JTBD: `"Cuando [situación / contexto del usuario], quiero [acción], para [resultado]."` → **ya existe el JTBD real** redactado en el doc ("Cuando necesito ajustar las tarifas… quiero ver el impacto en el margen… para no cometer errores"): copiarlo.
- 6 · C4 N1: `"Actor 1: rol y qué hace"`, `"Sistema externo 1: (ej. pasarela de pagos)"`, `"Dominio 1: (ej. Catálogo de productos)"` → reemplazar con actores/sistemas reales (ver abajo).
- 6 · Glosario: `"Término 1 | Definición clara y única"` → llenar con el glosario real de tarifas.
- 6 · Reglas: `"Regla 1: condición y resultado esperado."` → reemplazar con R-COD, R-Flete, R-IVA… de `feature-real-ui.md`.
- 6 · Gherkin: `"Dado que [Condición inicial]"` → escribir escenarios reales del simulador/COD/confirmación.
- 3 · `"No-objetivo 1: y razón…"`, `"Supuesto 1: (ej. el usuario tiene cuenta bancaria activa)"` → genéricos, no aplican a Tarifas.
- 5 · `"Nombre oficial del producto…"`, typo `"Estrategia de prdoucto"`.
- 9 · `"[Enlace a Mixpanel / Looker Studio…]"`, `"[DD/MM/AAAA]"`.

## Inconsistencias de datos (cifras de negocio — corregir)
- **KR de órdenes contradictorio:** `"7.6M órdenes mensuales"` vs `"9.6M órdenes (7.8M/mes)"` (tres cifras distintas).
- **Numeración OKR rota:** salta de `"OKR 1 — KR 1"` a `"OKR 3 — KR 1"` (no hay OKR 2); dos enunciados de OKR distintos entre 1.3 y 1.4.
- **Corte de peso:** 5 kg en el cuerpo vs `"Mercancia industrial es rango de peso >8kg"` en la nota de prototipo.
- **# transportadoras:** "12" vs "10 activas" vs "~10-15 por país". (UI real muestra **5** en CO: Veloces, Coordinadora, Envia, Interrapidísimo, Domina.)
- **Ticket:** la sección 4 referencia **PROD-237** mientras el doc usa épica **PROD-235**. Verificar.
- **Base de los %:** sobreflete/seguro/COD del simulador no cuadran como % directo del valor → **definir base de cálculo** (ver `feature-real-ui.md`).

## Material REAL para llenar la sección 6 (de los screenshots)
- **Actores:** administrador de tarifas (Dropi Ops/Finanzas/Pricing).
- **Sistemas externos:** transportadoras (Veloces, Coordinadora, Envia, Interrapidísimo, Domina), motor de cotización, tablas de tarifa Origen-Destino.
- **Dominios:** pricing/tarifas, facturación/refacturación, guías/remesas, margen/monetización.
- **Glosario:** Flete, COD, Sobreflete, Seguro, Monetización Dropi, Trayecto (Local/Regional/Nacional), Origen-Destino (O-D), Descuento por volumen, Factor, Flete de devolución, Tarifa Dropi, Costo transportadora, Ganancia estimada, Peso volumétrico.
- **Reglas numeradas:** R-COD (MAX %, mínimo), R-Flete (ruta+peso), R-IVA (toggle por concepto, tasa por país), R-Sobreflete (%/$), R-Monetización (fijo), R-Margen, R-Volumen, R-Trayecto, R-Confirmación (diff, no reversible). Detalle en `feature-real-ui.md`.
- **Gherkin (mínimo 1 por módulo):** simular ganancia · COD = MAX · confirmar cambios con diff · aplicar descuento por volumen · comparar 2+ transportadoras.

## Bug transversal: emojis de rol corruptos (encoding)
En TODO el doc los emojis salen mal: `ð§`→🧠 (PM), `ð«`→🎨 (PD), `ð»`→💻 (TI), `ð¢/ð¡/ð´`→🟢/🟡/🔴 (Traffic Light). Reemplazo global.
Typos de nombres propios: `"Michel pino"`→Michel Pino, `"William morale,"`→William Morales, `"Kevin fory"`→Kevin Fory, `"Juan Diego Bautista."` (punto colgante), `"prdoucto"`→producto.

## Plan de pulido — Top 10 (priorizado)
1. **6 · JTBD:** copiar el JTBD ya escrito al placeholder de 4.1.
2. **6 · C4 N1:** llenar actores/sistemas/dominios reales (arriba).
3. **6 · Reglas de negocio:** numerar R-COD…R-Confirmación desde `feature-real-ui.md`.
4. **6 · Gherkin:** escribir ≥1 escenario real por módulo.
5. **6 · Glosario:** llenar términos reales de tarifas.
6. **Encoding:** arreglar todos los emojis de rol + Traffic Light.
7. **Cifras:** unificar KR de órdenes, arreglar numeración OKR, cerrar corte de peso (5 vs 8 kg), # transportadoras (5 en CO).
8. **3 · Definición:** convertir el bloque crudo "Conceptualización Prototipo" en propuesta + fases (MVP/evolutivo) + no-objetivos + supuestos reales.
9. **4 · HEART/SEQ:** etiquetar las métricas con HEART y rotular los microsurveys como SEQ; renumerar a 4.x.
10. **5 y 9:** completar Comunicación (reusando JTBD/beneficios) y dejar Hallazgos Following como estructura + **N/A** donde aún no hay data (regla "campo que no aplica = N/A", nunca placeholder).

## Cómo aplicarlo
El MCP no edita el Google Doc directamente. Opciones: (a) genero el **contenido de reemplazo de cada sección** aquí en el repo para que pegues; (b) creo un **doc nuevo en Drive** ya pulido. Pendiente decidir con Juan.
