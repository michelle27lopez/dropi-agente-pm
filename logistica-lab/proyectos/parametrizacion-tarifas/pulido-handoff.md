# §6 · Hand-off a DEV & Stakeholders — Tarifas (contenido REAL para pegar)

> Reemplaza los placeholders genéricos de la §6. Documenta **SOLO lo construido** = panel de
> **Paquetería Express** (lo que está en los diseños/build, ver [`feature-real-ui.md`](feature-real-ui.md)).
> 🧠 Sección del PM (Juan). ⚠️ **Mercancía Industrial NO se construyó** (no está en los diseños) → ver §"Fuera de alcance".

## Cabecera
| Campo | Contenido |
|---|---|
| Segmento | Logistics |
| Equipo de TI receptor | Kevin Fory / Daniel Salazar |
| Tech Lead asignado | Jose Giraldo |
| Fecha de hand-off | 11/JUN/2026 |
| Documentos previos | ⚠️ Reemplazar "Links a docs 1, 2 y 3" por: doc E2E, Figma de tarifas, prototipo, Excel "Configuración Tarifa TT y Dropi 2026". |

## 4.1 Job To Be Done (JTBD)
> **Cuando** necesito ajustar las tarifas de una transportadora, **quiero** ver el impacto en el margen de Dropi antes de guardar, **para** no cometer errores que afecten la utilidad.

_(Ya redactado en §4 del doc; el placeholder de 4.1 quedó vacío — copiar aquí.)_

## 4.2 Contexto C4 — Nivel 1
**Actores (humanos):**
- **Operaciones Logísticas** (Head of Logistics, coordinadores) — *principal*; hoy gestionan tarifas por Excel + tickets a TI.
- **Finanzas** (Controller, analistas) — *secundario*; visibilidad de pricing para validar márgenes/discrepancias.
- **Administradores de plataforma** (admins internos Dropi) — *terciario*; operan el panel. 8–15 usuarios internos.

**Sistemas externos / integraciones:**
- **Motor de cotización** (core) — si se rompe, afecta la **generación de guías** en producción. Debe leer del nuevo modelo en vez de valores hardcodeados.
- **Transportadoras** (CO): Veloces, Coordinadora, Envia, Interrapidísimo, Domina.
- **Excel / Google Sheets** "Configuración Tarifa TT y Dropi 2026" — fuente de verdad paralela actual (a reemplazar por el panel).
- **Userpilot** — microsurveys in-app (medición).

**Dominios:** Pricing/Tarifas · Facturación (COD, IVA, seguro, sobreflete) · Generación de guías · Simulación de margen · **Auditoría** de cambios (existe el módulo "Auditorías").

**Flujo de datos:** admin entra a *Configuraciones → Parametrizar Tarifas* → elige carrier + trayecto (Local/Regional/Nacional) → ajusta conceptos (flete, COD, sobreflete, seguro, monetización, IVA) → **simula margen** con ruta+peso → guarda con **confirmación (diff) + auditoría** → el **motor de cotización** usa las tarifas vigentes para cotizar órdenes y generar guías.

## 4.3 Glosario de dominio
| Término | Definición |
|---|---|
| Trayecto | Alcance de la tarifa: **Local / Regional / Nacional**. Cada transportadora tiene N trayectos (la mayoría 4; Interrapidísimo 2). |
| Origen-Destino (O-D) | Par ruta (Depto/Ciudad origen → destino) que, con el peso, determina el flete. |
| Flete | Costo de transporte según ruta y peso. |
| COD (recaudo) | Pago contra entrega; se cobra como % del valor con un mínimo. |
| Sobreflete / sobreflete mínimo | Recargo sobre el flete (% o $); si el % < mínimo, se cobra el mínimo. Aplica **solo al sobreflete**, no al seguro. |
| Seguro | Cobertura sobre el valor declarado, con mínimo; si se cobra, la mercancía **se declara asegurada**. |
| Monetización Dropi | Incremento **fijo ($)** que añade Dropi para su margen. |
| Tarifa Dropi / Costo transportadora | Lo que cobra Dropi al usuario vs. lo que la transportadora le cobra a Dropi. |
| Ganancia estimada / Margen | Tarifa Dropi − Costo transportadora, por concepto. Puede ser **negativa**. |
| Flete de devolución | Costo que cobra la transportadora por devolver una orden. |
| Descuento por volumen / Factor | Descuento **en tiempo real** por guías/mes; Factor = multiplicador (ej. 98%). |

## 4.4 Reglas de negocio
- **R1 · COD = MAX:** se cobra el mayor entre (% del valor) y (mínimo), por par Dropi/Transportadora.
- **R2 · Flete:** se determina por **ruta (Origen-Destino) + peso** ingresados en el simulador.
- **R3 · IVA:** cada concepto (flete, COD, sobreflete, seguro, monetización) puede **incluirse o no** (toggle independiente); **tasa por país** (CO 19%).
- **R4 · Sobreflete:** se define como **% o valor fijo ($)**; `sobreflete_minimo` aplica solo al sobreflete.
- **R5 · Seguro:** Dropi/Transportadora con mínimo; cobrarlo implica **declarar la mercancía asegurada**.
- **R6 · Monetización:** incremento **fijo** en $.
- **R7 · Margen:** `Ganancia = Tarifa Dropi − Costo transportadora` (ΔSobreflete + ΔSeguro + ΔCOD + Monetización − Flete de devolución). **Puede ser negativa.**
- **R8 · Descuento por volumen:** **en tiempo real** según guías/mes; solo **un rango Vigente** a la vez.
- **R9 · Trayecto:** tarifas **independientes por Local / Regional / Nacional**.
- **R10 · Migración:** todos los carriers **migran** al nuevo modelo (no coexisten con el código viejo).
- **R11 · Auditoría:** se registra **cada cambio** desde el inicio.
- **R12 · Confirmación:** los cambios se previsualizan como **diff** y requieren confirmación explícita; **no reversibles**.

## 4.5 Criterios de aceptación (Gherkin)
**Simulador de ganancia**
- **Dado** Veloces · Local, **Cuando** ingreso valor $50.000, peso 3 kg, "con recaudo", origen y destino y *Cotizar*, **Entonces** muestra Tarifas Dropi, Costo transportadora y **Ganancia estimada** desglosada.
- **Dado** una orden cuyo flete de devolución supera el margen, **Cuando** cotizo, **Entonces** la Ganancia estimada se muestra **negativa** (ej. −$1.350).

**COD**
- **Dado** COD Dropi 1,5% y mínimo $X, **Cuando** 1,5% del valor < $X, **Entonces** se cobra **$X** (el mínimo).

**IVA**
- **Dado** un concepto con toggle IVA activo, **Cuando** se cotiza, **Entonces** entra a la base de IVA; si está inactivo, queda fuera.

**Descuentos por volumen**
- **Dado** los rangos de guías/mes, **Cuando** aplico 501–2.000 (factor 98%), **Entonces** ese rango pasa a **Vigente** y los demás a "Aplicar".

**Guardar cambios**
- **Dado** que cambio COD Dropi 1,5%→5%, **Cuando** *Guardar cambios*, **Entonces** aparece el modal con el diff `[Local] COD Dropi 1.5% → 5%` y advertencia de no-reversible; solo al *Aplicar* se persiste y **queda auditado**.

**Comparar**
- **Dado** que selecciono 2+ transportadoras, **Entonces** puedo ver sus tarifas en paralelo.

## 4.6 Consideraciones de negocio/UX
- El simulador debe dejar ver **márgenes negativos antes de guardar** (valor central del feature).
- Módulo bajo **Configuraciones → Parametrizar Tarifas** (no bajo Transportadora).
- Mostrar separados **lo que cobra la transportadora vs lo que cobra Dropi vs la monetización (margen)**.

## 4.7 Riesgos desde Producto
- **Motor de cotización es core:** un error rompe la generación de guías en producción.
- **Base de cálculo de los %** sin cerrar (sobreflete/seguro/COD — ver `feature-real-ui.md`).

## 4.8 Lo que TI debe devolver
C4 N2–N4, estimación, cronograma, dependencias (motor de cotización, migración desde Excel/código), observabilidad, seguridad, riesgos técnicos.

---

## ⛔ Fuera de alcance de esta entrega (NO construido)
- **Mercancía Industrial (>5 kg)** — completa: **tabla Origen-Destino**, **peso volumétrico** (PV = L×A×H×400 m / ÷2500 cm), **remesas**, rangos de peso sin techo, carriers industriales (TCC). Está en el **Discovery/Kick-off del doc como intención estratégica para Marcas**, pero **NO se diseñó ni construyó** (no aparece en Figma ni en el panel). → tratar como **fase futura / no-objetivo de esta versión**; sacarlo del Hand-off a TI.
- **Rangos de peso escalonados con 4 modos de cobro** (fijo/adicional/mínimo/por kg) — descritos en el doc pero **no visibles en los diseños actuales** → confirmar si entran en esta entrega o quedan para después.
