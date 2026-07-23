# 📄 Parametrización de Tarifas por Transportadora — Documento E2E (para pegar)

> **Contenido limpio listo para copiar/pegar al Google Doc, manteniendo la arquitectura estándar
> (9 fases + apéndice).** Solo **Paquetería Express (≤5 kg)** = lo construido. **Mercancía industrial:
> removida** del cuerpo (queda como una línea de no-objetivo). Derivado del [`spec.md`](spec.md).
> Al pegar, **renombrar el Doc** a "Parametrización de Tarifas por Transportadora".
>
> 🧠 = secciones de **Juan (PM)**: Kick-off (§1) y Hand-off (§6). · 🎨 = **Product Designer (Michel)**. · 💻 = **TI**.
> *Quedan abiertas como dudas reales (no asumidas): la base de cálculo de los % (§1.5/§6.7) y la
> severidad de riesgos (§2.4), que asigna el PD.*

---

# 🧠 1. Kick-off de Producto & Alineación  *(PM — Juan)*

## 1.1 Información general & equipo
| Campo | Contenido |
|---|---|
| Nombre del proyecto | Parametrización de Tarifas por Transportadora |
| Célula | Logistic Success |
| Owner / PM | Juan Diego Bautista |
| Product Designer | Michel Pino |
| Stakeholder principal | William Morales (Operaciones) |
| Desarrollador | Kevin Fory |
| Países | Arranca **Colombia**; modelo pensado para los 12 países |
| Fecha de kick-off | 10/05/2026 |
| Estado | Discovery completado · panel Express construido en diseños |

## 1.2 POR QUÉ ahora (contexto)
Hoy las tarifas de cada transportadora viven **hardcodeadas en código**: cambiarlas exige un **ticket a TI**.
No hay forma de que Operaciones/Finanzas ajusten pricing ni de **ver el margen antes de guardar**. Esto produce:
- **Discrepancias de facturación:** ej. Urbano AR cobra **$5.737** vs. costo real **$10.412** → Dropi absorbe el **82%**.
- **Errores detectados tarde:** el COD en AR estuvo en **0,7%** cuando la utilidad objetivo requería **1,5%**; se vio meses después.
- Un **Excel paralelo** ("Configuración Tarifa TT y Dropi 2026") como fuente de verdad fuera del código.

**Costo de no hacerlo:** se sigue erosionando el margen por errores de pricing invisibles y dependientes de TI.

## 1.3 Problema, painpoints y objetivos
**Painpoints:**
1. No existe panel de parametrización: toda tarifa se cambia por código vía ticket a TI.
2. Tarifas mal configuradas que Dropi absorbe (caso Urbano 82%).
3. Sin visibilidad de margen → decisiones de pricing a ciegas (COD 0,7% vs 1,5%).
4. Fuente de verdad fragmentada (Excel ≠ código).
5. Sin trazabilidad de quién cambió qué tarifa y cuándo.

**Objetivos:**
- **Negocio:** panel auto-gestionable que proteja el margen y elimine las discrepancias de facturación.
- **Experiencia:** simular el margen **antes de guardar**; todo cambio auditado y confirmado.
- **Alineación estratégica:** **OKR 3 — Eficiencia y rentabilidad · KR3.1 Gross margin ≥ 22%** (monetización del flete / refacturación de fletes).

## 1.4 Enlaces
- **Épica:** [PROD-235](https://dropi-it.atlassian.net/browse/PROD-235) · **Solicitud:** [PRM-1362](https://dropi-it.atlassian.net/browse/PRM-1362) · **Origen:** [INVS-13](https://dropi-it.atlassian.net/browse/INVS-13)
- **Figma:** [Parametrización de tarifas](https://www.figma.com/design/PDeeZVQMyF3i6SUFCWyuQa/Parametrizaci%C3%B3n-de-tarifas) · **Prototipo:** [panel_tarifas_transportadora.html](https://drive.google.com/file/d/1v20bIOaMpjhtcEkQNgRpj5ill6yKuYhj/view)

## 1.5 Dudas e incógnitas (abiertas)
- **Base de cálculo de cada %** (sobreflete / seguro / COD): ¿sobre valor recaudado, flete o valor declarado? Los % del simulador no cuadran como % directo. → responsable: PM + TI.

---

# 🎨 2. Discovery  *(Product Designer — Michel)*

## 2.1 Usuarios implicados & madurez
- **Operaciones Logísticas** (Head of Logistics, coordinadores) — *principal*. Hoy por Excel + tickets a TI. Madurez: manual → migrando a self-serve.
- **Finanzas** (Controller, analistas) — *secundario*. Valida márgenes y discrepancias.
- **Administradores de plataforma** (admins internos Dropi) — *operativo*. 8–15 usuarios.

## 2.2 AS-IS (solución actual y limitaciones)
- Tarifas hardcodeadas en código; cambios solo vía TI · Excel paralelo como fuente · sin simulación de margen ni auditoría → errores detectados tarde.

## 2.3 Discovery / research / evidencia
- Caso Urbano AR ($5.737 vs $10.412 = 82% absorbido) · COD AR 0,7% vs objetivo 1,5% · Excel paralelo al código.

## 2.4 Riesgos de producto  *(severidad la asigna el PD)*
- **Valor:** ¿Ops/Finanzas adoptan el panel y confían en la simulación?
- **Usabilidad:** muchos conceptos por configurar → riesgo de error (mitiga el diff + confirmación).
- **Factibilidad:** el **motor de cotización es core**; debe leer del nuevo modelo sin romper la generación de guías.
- **Viabilidad:** alineado a margen/refacturación.
- **Legal:** N/A — configuración interna, sin datos de usuario final.

## 2.5 Hipótesis
Creemos que un panel con **simulación de margen antes de guardar** reduce las discrepancias de facturación y protege el margen, porque hoy los errores (Urbano 82%, COD 0,7%) ocurren por no poder validar el pricing.

## 2.6 Conclusión del discovery
El panel de **Paquetería Express** está conceptualizado y diseñado, listo para hand-off a TI. Reemplaza el código + Excel por una fuente única auditable con simulación de margen.

## 2.7 Requerimientos generales
- **Solución:** panel web de administración para parametrizar tarifas + simulador de margen + auditoría.
- **Dispositivos:** desktop (uso interno de administración).
- **Performance:** N/A — lo define TI.

---

# 🎨 3. Definición & Alcance  *(Product Designer — Michel)*

## 3.1 Propuesta
Panel **Configuraciones → Parametrizar Tarifas**: por transportadora y trayecto (Local/Regional/Nacional), configurar los conceptos de cobro, **simular la ganancia** y guardar con confirmación auditada.

## 3.2 Fases y alcance
- **Fase 1 (MVP):** Paquetería Express (≤5 kg) en Colombia — panel + simulador + auditoría.
- **Fase 2 (evolutivo):** despliegue al resto de países con sus tablas de tarifa.

### No-objetivos
- **Mercancía industrial (>5 kg)** — fuera de esta entrega.
- **Rangos de peso escalonados con 4 modos de cobro** — no visibles en los diseños actuales; por confirmar.

## 3.3 Estimación de esfuerzo
N/A — la define TI tras el hand-off.

## 3.4 Segmento y país
Administradores internos (Ops/Finanzas), Colombia primero.

## 3.5 Supuestos
- El **motor de cotización** puede leer del nuevo modelo en vez de los valores hardcodeados.
- Todos los carriers **migran** al nuevo modelo (no coexiste con el código viejo).

## 3.6 Próximos pasos
Hand-off a TI (§6) para arquitectura y estimación.

## 3.7 Entregables
Figma final · prototipo. (TANGO / Loom: N/A en esta etapa.)

---

# 🎨 4. Following y lanzamiento  *(Product Designer — Michel)*

## 4.1 Métrica de éxito (básica)
- **Uso de la herramienta** — que Ops/Finanzas hagan los cambios de tarifa **en el panel** (no por ticket a TI). Seguimiento del uso/adopción del panel. *(Sin más métricas en esta etapa.)*

## 4.2 Seguimiento
Piloto en Colombia: monitoreo del uso y de bugs las primeras semanas tras liberar.

---

# ⭐ 5. Estrategia de comunicación  *(socialización formal interna)*
Herramienta **interna** (administradores Dropi). Lanzamiento = **socialización formal interna**: capacitación + proceso de change-management con **Operaciones y Finanzas** (sesión + paso a paso TANGO/doc). **Sin campaña a usuarios finales.**

---

# 🧠 6. Hand-off a DEV & Stakeholders  *(PM — Juan)*

## Cabecera
| Campo | Contenido |
|---|---|
| Segmento | Logistics |
| Equipo de TI receptor | Kevin Fory / Daniel Salazar |
| Tech Lead asignado | Jose Giraldo |
| Fecha de hand-off | 11/JUN/2026 |
| Documentos previos | Doc E2E · Figma de tarifas · prototipo · Excel "Configuración Tarifa TT y Dropi 2026" |

## 6.1 Job To Be Done
> **Cuando** necesito ajustar las tarifas de una transportadora, **quiero** ver el impacto en el margen de Dropi antes de guardar, **para** no cometer errores que afecten la utilidad.

## 6.2 Contexto C4 — Nivel 1
**Actores:** Operaciones Logísticas (principal) · Finanzas (valida márgenes) · Administradores de plataforma (operan el panel, 8–15 internos).
**Sistemas externos:** Motor de cotización (core — usa las tarifas para cotizar y generar guías) · Transportadoras CO (Veloces, Coordinadora, Envia, Interrapidísimo, Domina) · Excel "Configuración Tarifa TT y Dropi 2026" (a reemplazar) · Userpilot (microsurveys).
**Dominios:** Pricing/Tarifas · Facturación (COD, IVA, seguro, sobreflete) · Generación de guías · Simulación de margen · Auditoría.
**Flujo de datos:** admin entra a *Configuraciones → Parametrizar Tarifas* → elige carrier + trayecto → ajusta conceptos (flete, COD, sobreflete, seguro, monetización, IVA) → **simula margen** con ruta + peso → guarda con **confirmación (diff) + auditoría** → el **motor de cotización** usa las tarifas vigentes.

## 6.3 Glosario
| Término | Definición |
|---|---|
| Trayecto | Alcance de la tarifa: Local / Regional / Nacional. |
| Origen-Destino (O-D) | Par de ruta que, con el peso, determina el flete. |
| Flete | Costo de transporte según ruta y peso. |
| COD (recaudo) | Pago contra entrega; % del valor con un mínimo. |
| Sobreflete / mínimo | Recargo sobre el flete (% o $); si % < mínimo, se cobra el mínimo. Solo al sobreflete. |
| Seguro | Cobertura sobre el valor declarado, con mínimo; cobrarlo declara la mercancía asegurada. |
| Monetización Dropi | Incremento fijo ($) que añade Dropi para su margen. |
| Tarifa Dropi / Costo transportadora | Lo que cobra Dropi vs. lo que la transportadora cobra a Dropi. |
| Ganancia estimada / Margen | Tarifa Dropi − Costo transportadora. Puede ser negativa. |
| Flete de devolución | Costo que cobra la transportadora por devolver una orden. |
| Descuento por volumen / Factor | Descuento en tiempo real por guías/mes; Factor = multiplicador (ej. 98%). |

## 6.4 Reglas de negocio
- **R1 · COD = MAX:** mayor entre (% del valor) y (mínimo), por par Dropi/Transportadora.
- **R2 · Flete:** por ruta (O-D) + peso del simulador.
- **R3 · IVA:** cada concepto puede incluirse o no (toggle); tasa por país (CO 19%).
- **R4 · Sobreflete:** % o valor fijo ($); el mínimo aplica solo al sobreflete.
- **R5 · Seguro:** Dropi/Transportadora con mínimo; cobrarlo declara la mercancía asegurada.
- **R6 · Monetización:** incremento fijo en $.
- **R7 · Margen:** Tarifa Dropi − Costo transportadora (ΔSobreflete + ΔSeguro + ΔCOD + Monetización − Flete devolución). Puede ser negativo.
- **R8 · Descuento por volumen:** en tiempo real por guías/mes; un solo rango Vigente.
- **R9 · Trayecto:** tarifas independientes por Local/Regional/Nacional.
- **R10 · Migración:** todos los carriers migran al nuevo modelo (no coexisten).
- **R11 · Auditoría:** se registra cada cambio desde el inicio.
- **R12 · Confirmación:** cambios como diff, confirmación explícita, no reversible.

## 6.5 Criterios de aceptación (Gherkin)
**Simulador de ganancia**
- **Dado** Veloces · Local, **Cuando** ingreso $50.000, 3 kg, "con recaudo", O-D y *Cotizar*, **Entonces** muestra Tarifas Dropi, Costo transportadora y Ganancia estimada desglosada.
- **Dado** que el flete de devolución supera el margen, **Cuando** cotizo, **Entonces** la Ganancia estimada se muestra negativa (ej. −$1.350).

**COD** — **Dado** COD 1,5% y mínimo $X, **Cuando** 1,5% del valor < $X, **Entonces** se cobra $X.
**IVA** — **Dado** un concepto con toggle IVA activo, **Cuando** se cotiza, **Entonces** entra a la base de IVA; si está inactivo, queda fuera.
**Volumen** — **Dado** los rangos, **Cuando** aplico 501–2.000 (factor 98%), **Entonces** ese rango pasa a Vigente y los demás a "Aplicar".
**Guardar** — **Dado** que cambio COD 1,5%→5%, **Cuando** *Guardar*, **Entonces** modal con diff `[Local] COD Dropi 1.5% → 5%` + advertencia no-reversible; persiste solo al *Aplicar* y queda auditado.
**Comparar** — **Dado** que selecciono 2+ transportadoras, **Entonces** veo sus tarifas en paralelo.

## 6.6 Consideraciones de negocio/UX
- El simulador debe dejar ver **márgenes negativos antes de guardar** (valor central del feature).
- Módulo bajo **Configuraciones → Parametrizar Tarifas** (no bajo Transportadora).
- Mostrar separado lo que cobra la transportadora vs. lo que cobra Dropi vs. la monetización.

## 6.7 Riesgos desde Producto
- **Motor de cotización es core:** un error rompe la generación de guías en producción.
- **Base de cálculo de los %** sin cerrar (ver duda abierta §1.5).

## 6.8 Lo que TI debe devolver
C4 N2–N4, estimación por fase, cronograma, dependencias (motor de cotización, migración desde Excel/código), observabilidad, seguridad y riesgos técnicos.

---

# 💻 7. Activación TDL / TPL  *(la llena TI tras el hand-off)*
Pendiente de TI: **RACI · DORA Metrics · Risk Heat Map · PERT · Traffic Light.** N/A en esta entrega de Producto.

---

# ⭐ 8. Lanzamiento
Salida **interna**: liberación a los administradores (Ops/Finanzas) con la socialización formal de §5. Sin estrategia de marketing externa.

---

# 🎨 9. Hallazgos Following (post-lanzamiento)
**N/A hoy** — se llena al lanzar el piloto: seguimiento del uso del panel + bitácora de cambios/bugs + próximos pasos.

---

# 📎 Apéndice · Checklist
- [x] Kick-off: POR QUÉ ahora, 5 painpoints, perfil de usuario, objetivo de negocio + experiencia, OKR/KR.
- [x] Hand-off: JTBD, C4 N1, glosario, reglas numeradas (R1–R12), Gherkin por módulo, riesgos.
- [x] Sin placeholders (todo valor real o N/A).
- [x] Cifras consistentes (OKR 3 · KR3.1; sin números de órdenes contradictorios; 5 carriers CO).
- [ ] Duda real abierta: base de cálculo de los % (§1.5) — la cierran PM + TI.
