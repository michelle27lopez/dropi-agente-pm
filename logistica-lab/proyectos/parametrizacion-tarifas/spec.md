# Spec · Parametrización de Tarifas por Transportadora

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. El doc E2E de Drive se genera DESDE aquí.
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.
> Material de apoyo: [`feature-real-ui.md`](feature-real-ui.md) · [`pulido-handoff.md`](pulido-handoff.md) · [`pulido-kickoff.md`](pulido-kickoff.md) · [`revision-doc-e2e.md`](revision-doc-e2e.md).

| Campo | Valor |
|-------|-------|
| Owner / PM | Juan Diego Bautista |
| Product Designer | Michel Pino |
| Stakeholder | William Morales (Operaciones) |
| Célula | Logistics |
| Etapa de la cadena | Costo por orden / tarifas |
| Estado global | 🟢 Express construido · ⚪ Industrial en discovery |
| NSM que mueve | Costo por orden / margen (NSM directa: indirecta — protege economía del COD) |
| Última actualización | 2026-06-23 |

## 0 · Resumen y estado global
Panel para parametrizar tarifas de transportadoras con simulador de margen en tiempo real.
**Lo construido = solo Paquetería Express (≤5 kg)** `[🟢 · screenshot:parametrizar-tarifas]`: lo que hoy
vive hardcodeado pasa a un panel auto-gestionable por Ops/Finanzas. **Mercancía Industrial (>5 kg)**
está en el doc como intención estratégica pero **NO se diseñó ni construyó** `[⚪ · doc:E2E §1.3 · NO en Figma]`.

## 1 · Problema raíz
- No existe panel de parametrización: las tarifas se cambian **por código** vía ticket a TI.  `[🟢 confirmado · doc:E2E §1.2]`
- Discrepancias de facturación por tarifas hardcodeadas: Urbano AR cobra $5.737 vs costo real $10.412 (**82%** que Dropi absorbe).  `[doc:E2E §1.2]`
- COD AR estaba en 0,7% cuando el objetivo de utilidad requería 1,5% — se detectó meses después por falta de visibilidad.  `[doc:E2E §1.2]`
- Excel ("Configuración Tarifa TT y Dropi 2026") es fuente de verdad paralela al código → sin fuente única.  `[doc:E2E §2.1]`

## 2 · Hipótesis de valor y métrica
- **Hipótesis:** creemos que dar a Ops/Finanzas un panel con **simulación de margen antes de guardar** reduce las discrepancias de facturación y protege el margen, porque hoy los errores (Urbano 82%, COD 0,7%) ocurren por no poder validar pricing.  `[doc:E2E §1.3]`
- **Métrica de éxito + línea base:** discrepancia tarifa↔costo real (base: caso Urbano 82%) → meta acercar a 0; gross margin promedio (base por confirmar).  `[⚪ · doc:E2E §1.4 OKR · línea base pendiente]`
- **NSM:** **indirecta.** Tarifas mueve *costo por orden / margen* (métrica operativa, `product-logistics.md §4`), no directamente movilización/% entrega.

## 3 · Usuarios / actores
- **Operaciones Logísticas** (Head of Logistics, coordinadores) — perfil principal; hoy por Excel + tickets a TI.  `[doc:E2E §2.1]`
- **Finanzas** (Controller, analistas) — validan márgenes/discrepancias.  `[doc:E2E §2.1]`
- **Administradores de plataforma** (admins Dropi) — operan el panel. 8–15 usuarios internos.  `[doc:E2E §2.1, §4]`

## 4 · Alcance
**Entra — Paquetería Express (construido):**
- Selector de transportadoras CO (Veloces, Coordinadora, Envia, Interrapidísimo, Domina) + comparación.  `[🟢 · screenshot]`
- Tarifa por trayecto **Local / Regional / Nacional**.  `[🟢 · screenshot]`
- Conceptos Dropi/Transportadora: Flete, COD (+mínimos), Sobreflete (%/$), Seguro (+mínimo), Monetización fija, IVA por concepto, Cargos adicionales, Flete devolución.  `[🟢 · screenshot]`
- **Simulador de ganancia** (valor, peso, con recaudo, O-D) → Tarifas Dropi, Costo transportadora, **Margen/Ganancia estimada**.  `[🟢 · screenshot]`
- **Descuentos por volumen** (rangos guías/mes, factor, vigente/aplicar).  `[🟢 · screenshot]`
- **Guardar con diff + confirmación** no reversible + **Auditorías**.  `[🟢 · screenshot + sidebar "Auditorias"]`

**No-objetivos (⛔):**
- **Mercancía Industrial (>5 kg)**: tabla O-D, peso volumétrico, remesas, rangos sin techo, carrier TCC. Discovery, **no se construyó** → fase futura.  `[⛔ · doc:E2E §1.3 · NO en Figma]`
- **Rangos de peso escalonados con 4 modos de cobro** (fijo/adicional/mínimo/por kg): descritos en el doc, **no visibles en los diseños** → confirmar.  `[⚪ · doc:E2E §1.3]`

## 5 · Reglas de negocio
- **R1 · COD = MAX:** mayor entre (% del valor) y (mínimo), por par Dropi/Transportadora.  `[🟢 · screenshot + doc:E2E §1.5]`
- **R2 · Flete:** por ruta (Origen-Destino) + peso del simulador.  `[🟢 · screenshot]`
- **R3 · IVA:** cada concepto puede incluirse o no (toggle); tasa por país (CO 19%).  `[🟢 · screenshot]`
- **R4 · Sobreflete:** % o valor fijo ($); `sobreflete_minimo` aplica solo al sobreflete.  `[🟢 · screenshot + doc:E2E §1.5]`
- **R5 · Seguro:** Dropi/Transportadora con mínimo; cobrarlo ⇒ mercancía declarada asegurada.  `[🟢 screenshot · 🟡 regla doc:E2E §1.5]`
- **R6 · Monetización:** incremento fijo en $.  `[🟢 · screenshot]`
- **R7 · Margen:** Tarifa Dropi − Costo transportadora (ΔSobreflete+ΔSeguro+ΔCOD+Monetización−Flete devolución). Puede ser negativo.  `[🟢 · screenshot]`
- **R8 · Descuento por volumen:** en tiempo real por guías/mes; un solo rango Vigente.  `[🟢 screenshot · doc:E2E §1.5]`
- **R9 · Trayecto:** tarifas independientes por Local/Regional/Nacional.  `[🟢 · screenshot]`
- **R10 · Migración:** todos los carriers migran al nuevo modelo (no coexisten).  `[🟡 · doc:E2E §1.5]`
- **R11 · Auditoría:** se registra cada cambio desde el inicio.  `[🟢 · sidebar "Auditorias" + doc:E2E §1.5]`
- **R12 · Confirmación:** cambios como diff, confirmación explícita, no reversible.  `[🟢 · screenshot modal]`

## 6 · Criterios de aceptación (Gherkin)
**Simulador**
- **Dado** Veloces·Local, **Cuando** ingreso $50.000, 3 kg, con recaudo, O-D y *Cotizar*, **Entonces** muestra Tarifas Dropi, Costo transportadora y Ganancia estimada desglosada.  `[🟢]`
- **Dado** flete de devolución > margen, **Cuando** cotizo, **Entonces** la Ganancia estimada se muestra negativa (ej. −$1.350).  `[🟢]`

**COD** — **Dado** COD 1,5% y mínimo $X, **Cuando** 1,5% < $X, **Entonces** se cobra $X.  `[🟢]`
**Volumen** — **Dado** los rangos, **Cuando** aplico 501–2.000, **Entonces** ese rango pasa a Vigente y los demás a "Aplicar".  `[🟢]`
**Guardar** — **Dado** COD 1,5%→5%, **Cuando** *Guardar*, **Entonces** modal con diff `[Local] COD Dropi 1.5% → 5%` + advertencia no-reversible; persiste solo al *Aplicar* y queda auditado.  `[🟢]`

## 7 · Datos (diccionario)
- `distribution_companies` — `pricing_rules`, `porcentaje_tasa_sobreflete*`, `insurance`, `iva_percentage`.  `[data · conocimiento/temas/10]`
- `colombia_shipping_orders` — `base_shipping`, `overload_base`, `devolution_shipping_base`, `base_profit`.  `[data · conocimiento/temas/10]`
- Campos del modelo Express citados en el doc: `flete base`, `dropi_shipping_increment_amount`, `sobreflete_minimo(_company)`, `insurance(_company)`, `iva_percentage`, `devolución`.  `[doc:E2E §1.3]`

## 8 · Trazabilidad
| Tipo | Referencia |
|------|-----------|
| Épica Jira | [PROD-235](https://dropi-it.atlassian.net/browse/PROD-235) (Epic, *En Ruta backlog*) |
| Solicitud (implementa) | [PRM-1362](https://dropi-it.atlassian.net/browse/PRM-1362) (*Inv. y definición*) ← `implements` PROD-235 |
| Solicitud origen | [INVS-13](https://dropi-it.atlassian.net/browse/INVS-13) |
| Figma | [Parametrización de tarifas](https://www.figma.com/design/PDeeZVQMyF3i6SUFCWyuQa/Parametrizaci%C3%B3n-de-tarifas) |
| Doc E2E original | [Google Doc](https://docs.google.com/document/d/1zVCV1UJDkqTHr7SxP9LlfCy4ciVlucg2U-5nVQfIIhQ/edit) (mezcla real + plantilla; mercancía industrial) |
| **Doc Producto (USAR)** | [E2E COMPLETO](https://docs.google.com/document/d/1thbG6YzEXcUFpUIM5lWSR-qfyM5qOQf6sjY0EhMXt0o/edit) — Kick-off + Discovery + Definición + Hand-off, **nada recortado** (incluye mercancía industrial), colores, enlaces reales · 23-jun |
| Versiones descartadas | [9-fases](https://docs.google.com/document/d/1IaoHn7UeoeH0_tj-MawAIdLS_AVkLaUfxk1bvhFRGt8/edit) · [condensada Kick+Hand](https://docs.google.com/document/d/1T1t8-LkMJowjmdJsfGtZQz15hjsOy8emM1ZWRFHspFY/edit) ⚠️ Juan las borra |
| Borrador interno (md) | [`doc-e2e-LISTO.md`](doc-e2e-LISTO.md) (condensado — referencia) |
| Carpeta Drive | [11DPZPnWbR…](https://drive.google.com/drive/folders/11DPZPnWbR1kfho2eR2TetBnB7UkSfCPl) |
| Verificado en Jira | 2026-06-23 (sesión Michel Pino → solo lectura) |

## 9 · Preguntas abiertas y pendientes (consolidado — RESOLVER, no enterrar)

**Inconsistencias (no cuadran — decidir una sola versión):**
- [ ] **KR de órdenes:** 7.6M/mes (§1.3) vs 9.6M total / 7.8M/mes (§1.4). ¿Cuál es la cifra real? — resp: PM (Dir. Producto).
- [ ] **Corte Express/Industrial:** 5 kg (Kick-off/Discovery) vs >8 kg (Conceptualización prototipo). ¿5 u 8 kg? — resp: Ops/PM.
- [ ] **OKR:** ¿impacta solo OKR 3·KR3.1 (margen) o también OKR 1 (volumen, vía industrial)? Se alineó a OKR 3 — confirmar. — resp: PM.

**Preguntas de negocio abiertas (con responsable):**
- [ ] **Base de cálculo de cada %** (sobreflete/seguro/COD): ¿sobre valor recaudado, flete o valor declarado? — resp: PM+TI.  `[screenshot: no cuadran como % directo]`
- [ ] **Identificación de "Marca"** en el sistema + sellers híbridos (express+industrial). — resp: Producto/negocio.
- [ ] **Escalamiento de industrial** más allá de Marcas (plan de apertura). — resp: Estrategia.
- [ ] **Corte de 5 kg en los 12 países:** ¿aplica igual o se parametriza por país? — resp: Logística.
- [ ] **Fórmulas de peso volumétrico** nacionales vs internacionales: ¿dependen del trayecto? — resp: Producto/TI.
- [ ] **Descuento por volumen:** ¿solo Guatemala o más países? — resp: Logística/Data.

## 10 · Changelog
- 2026-06-23 — Spec creado (piloto del estándar). Consolidado de revisión del doc E2E (96K) + screenshots del feature real + conexiones Jira. Express marcado 🟢, Industrial reclasificado ⛔/⚪ (no construido).
- 2026-06-23 — **Doc E2E limpio generado como Google Doc nativo** (HTML→Doc) en la carpeta de Tarifas: Express only, sin mercancía industrial (1 línea no-objetivo), **OKR 3·KR3.1 (margen ≥22%)** confirmado por Juan, métrica = solo uso de la herramienta, comunicación = socialización formal interna. Arquitectura E2E completa (9 fases + apéndice). Decisiones tomadas con Juan (no asumidas).
