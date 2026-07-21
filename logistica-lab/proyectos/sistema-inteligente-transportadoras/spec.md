# Spec · Sistema Inteligente de Selección de Transportadoras

> Fuente de verdad INTERNA. Obedece a `metodologia/spec-driven.md`. Cada afirmación lleva estado + fuente.
> Estados: ⚪ discovery · 🟡 definido · 🔵 en diseño · 🟢 construido · ⛔ no-objetivo.

> ⚠️ **No es proyecto liderado por Juan.** PM/Owner = **Katherine Pencue**. **Juan entra como Carrier
> Operations** (caracterización de atributos de transportadoras + coordinación con carriers ante cambios de ranking).
> Aquí se documenta para contexto de la célula y para rastrear **las dependencias de Juan**.

| Campo | Valor |
|-------|-------|
| PM / Owner | **Katherine Pencue** |
| Co-resp. | Jaime Reinoso (Data/modelo) · Juan Felipe Cubillos (Tech Lead, Go) · Michelle López (UX) · Laura Torres (Diseño/Rollout) · José Giraldo (PO) |
| Rol de Juan | **Carrier Operations** (con Paula Macías): caracterización de transportadoras + comunicación con carriers |
| Etapa de la cadena | **Generación de guía / selección de transportadora** (impacta Movilización + % entrega) |
| Estado global | 🔵 **épica dev en curso** ([DROP-17946](https://dropi-it.atlassian.net/browse/DROP-17946) *In Progress, 72% progreso, prioridad Highest*; diseño alta fidelidad avanzando). Viabilidad técnica ✅ (31-mar-26). **Gate: aprobación de María Ossa** (es reporter/owner del Proyecto OKR [PRM-1513](https://dropi-it.atlassian.net/browse/PRM-1513)) |
| NSM que mueve | ⬆️ **% de entrega** (↓ devoluciones evitables) · indirecto ⬆️ movilización |
| OKR/KR | OKR1·KR1.1 · **OKR2·KR2.1** (tasa entrega ≥70%, canónico célula; el core lo llama KR2.2) · OKR2·KR2.3 · OKR3·KR3.2 |
| Última actualización | 2026-06-24 |

## 0 · Resumen y estado global
Reemplazar la **selección de transportadora por costumbre/intuición** por **decisiones basadas en datos**.
Tres pilares: **catálogo centralizado**, **configuración manual mejorada** (ordenamiento completo por ciudad,
no una sola) y **optimización inteligente** (modelo bayesiano con inteligencia colectiva). **Piloto en Colombia**;
infraestructura pensada para multi-país (14 países, 2026). **POC ya construido y validado**; falta gate de
María Ossa + asignación de squad + dependencias técnicas.

## 1 · Problema raíz
- La elección de transportadora se hace por **costumbre/precio visible/recomendación informal**, sin respaldo en
  desempeño histórico → **devoluciones evitables**.  `[🟡 doc: Kickoff §1-2]`
- **Torre Logística** existe pero NO está en el momento de decisión: de 85.774 MAU (dic25–mar26) solo **22,4% la abrió y 4,2% la usó** (95,8% resuelve fuera de Dropi).  `[data: Kickoff §2]`
- Config por ciudad limitada a **una sola transportadora** → fragilidad si la 1ª no cubre/restringe.  `[🟡 doc]`

## 2 · Hipótesis de valor y métrica
- **Colombia feb-2026:** 74,39% entregado · **19,24% devuelto (422.382 ord/mes)** · 6,37% sin resultado (139.886). 2.196.177 envíos movilizados.  `[data: Kickoff §2]`
- **Hipótesis:** orientar con datos reduce la elección de carriers con alta devolución → **−1pp (19,24%→18,24%) ≈ 21.960 órdenes/mes menos devueltas** (−5,2% relativo).  `[🟡 doc §2-8]`
- **Métricas piloto:** Adopción ≥20% MAU activan Optimización en 4 sem · TTV ≤5 min · Churn ≤15% · efectividad significativa a 60 días vs control.  `[🟡 doc §3]`

## 3 · Usuarios / actores
- **Dropshipper** (elige transportadora al crear orden).  `[doc]`
- **Transportadora** (su ranking cambia; coordinación = Juan).  `[doc §11]`
- **Golden Users** (top 25% volumen + top 50% entrega) = prior del modelo.  `[doc §4]`

## 4 · Alcance (por versión)
**V1 (esta épica):**  `[🟡 doc §4 + 🟢 DROP-17946]`
- **Catálogo** de transportadoras con accesos directos a **4 documentos en Drive** (sin parseo Excel; tabla dinámica → V2). Los 4 docs: (1) destinos con recaudo · (2) destinos sin recaudo · (3) trayectos especiales · (4) métodos de pago e intentos de entrega. ← **lo que Juan debe caracterizar/curar (Carrier Ops)**.
- **Config manual mejorada**: ordenamiento completo por ciudad (con fallback a la siguiente).
- **Optimización inteligente**: modelo bayesiano, **pesos fijos 50% efectividad / 50% costo**, alcance depto/país, flujo en 2 pasos, **scores NO expuestos** (lenguaje claro: "mayor probabilidad de éxito"), indica si el dato es propio o de inteligencia colectiva.
- Batch nocturno en **Cronos** (Golden) + cálculo individual en tiempo real. Concurrencia 20.000 usuarios, respuesta <30s/solicitud. Migración de configs sin pérdida.
**No-objetivos / aplazado:**  `[⛔ doc §4]`
- ⛔ Multi-país (V3) · ⛔ automatización del reordenamiento (a evaluar en piloto) · ⛔ notificaciones a transportadoras · ⛔ **modelo de ganancia en $** (descartado V1: desviación 2-3× el valor) · ⛔ pesos personalizables por perfil (V2) · ⛔ descartar carriers por ciudad (V2) · ⛔ tabla dinámica de beneficios (V2) · ⛔ optimización dentro del flujo de creación de orden (V3).

## 5 · Reglas de negocio / modelo técnico (POC validado)  `[🟢 doc §4]`
- **Horizonte:** últimos 3 meses del dropshipper (POC: oct–dic 2025).
- **Golden Users** = prior bayesiano cuando no hay historial propio.
- **Factor K (Cochran)** define cuándo el historial propio pesa lo suficiente. **Peso W = n/(n+K)** (n = pedidos propios con ese carrier).
- **Bootstrap 5.000 iteraciones** por carrier → distribución, no un número.
- **Utilidad:** `U = We·Efectividad + Wf·Flete_std + Wd·Días_std` (normalizado 0-1; V1 We=Wf=50%, Wd=0).
- **Ranking** por utilidad esperada; criterio en lenguaje claro (no caja negra).
- **Capa de atributos** (no altera el score): puntos de entrega/cobertura, telemercadeo, datáfono, ConfioPago (pago diferido), seguimiento, seguro, recogida, devolución express.  ← **insumo de Juan (Carrier Ops)**.

## 5.1 · Flujo UX (prototipo Figma, Michelle)  `[🔵 figma: revisado 24-jun, nodo 4875:340845 y flujo "Optimizar por único departamento"]`
**Pantalla base "Selección de transportadoras":**
- Banner **"Optimiza tu logística con IA"** (entrada al modo optimizado).
- **Tu preferencia global:** ranking de carriers **arrastrable** (#1 Veloces, #2 Interrapidísimo…) — define el orden por defecto.
- **Tus preferencias por ciudad destino:** tabla con **override por ciudad** (Departamento · Ciudad · Preferencia · Última modificación · Acciones), filtro por departamento + búsqueda ("1534 ciudades"). Donde no se configura, aplica la Preferencia Global.
- CTA **"Optimizar con IA"** ("prioriza según efectividad, costo de flete y precisión de datos en cada ciudad").
- Botón **"Detalle transportadoras"** = el **catálogo** (donde viven los atributos que Juan caracteriza).

**Flujo de optimización (2 pasos, coincide con doc §4):** base → **modal de alcance** (departamento / país) → estado **"Optimizando todo el departamento"** → resultado (ranking optimizado por ciudad) → confirmación **"Guardado: N ciudades optimizadas y M personalizada"**.
- **3 estados** de la pantalla: Default → Optimizado → Guardado.
- **3 granularidades** del flujo: desde departamento contraído · departamento desplegado · ciudad puntual.
- Cada ciudad queda marcada como **Preferencia global · Optimizado (IA) · Personalizado (manual)** → es la **trazabilidad del origen de config** que pide el doc §6. ✅
- **Alertas de presupuesto:** vista de alertas (ligada a los caps por ciudad–transportadora del rollout).

**Observaciones para producto / Carrier Ops:**
- ⚠️ El copy del CTA dice *"efectividad, costo de flete y **precisión de datos**"* — pero el modelo V1 usa pesos **50% efectividad / 50% costo** (días=0). Revisar si "precisión de datos" es un 3er factor real o solo copy → alinear UX ↔ modelo (Kate/Michelle/Jaime).
- El **catálogo** ("Detalle transportadoras") es el punto donde aterriza tu caracterización de atributos (cobertura, telemercadeo, datáfono, ConfioPago, etc.).

## 5.2 · Score de una transportadora — fórmula de ganancia esperada  `[🔵 en diseño · fuente: screenshot Juan, 2026-07-21]`
Aterriza en fórmula el prior bayesiano de §5 (Golden Users + factor K). El score de cada
transportadora es la **ganancia esperada**, una mezcla ponderada entre la experiencia propia del
dropshipper y la de la comunidad:

```
G_esperada = W · G_user + (1 − W) · G_global
```
- **G_user** = ganancia esperada del **dropshipper** (su propio historial con ese carrier).
- **G_global** = ganancia esperada de la **comunidad** (o de los **GOLDEN**) — el prior.
- **W** = cuánto se confía en el dato propio vs. el global.

**Peso de credibilidad** (ya en §5 como `W = n/(n+K)`):
```
W = n / (n + K)
```
- **n** = número de pedidos del dropshipper **en esa transportadora**.
- Con **n pequeño → W→0** (manda el global/GOLDEN); a medida que el dropshipper acumula pedidos,
  **W→1** (manda su propia experiencia). Es la transición suave que evita juzgar un carrier con 2 pedidos.

**Factor K** (tamaño de muestra, fórmula de Cochran):
```
K = ( Z² · R_global · (1 − R_global) ) / E²
```
- **Z = 1,96** (95% de confianza) · **E = 15%** de error.
- **R_global** = tasa base global de la comunidad. ⚠️ **Por confirmar qué métrica es** (efectividad de
  entrega, presumiblemente) — no está explícita en la fuente; cerrar con Kate/Data antes de construir.

> Coherente con §5 ("criterio en lenguaje claro, no caja negra"): K sale de estadística estándar, no
> de un número arbitrario. Pendiente reconciliar **G_esperada (ganancia)** con la **U = We·Efectividad +
> Wf·Flete + Wd·Días** de §5 — ¿la "ganancia" es la utilidad U, o un factor aparte? Alinear con el doc.

## 6 · Estrategia de apertura  `[🟡 doc §5]`
- **Fase 0 — Beta cerrado** (Shopi + perfiles de prueba), 2-3 meses, tráfico real.
- **Fase 1** no-Golden bajo volumen (1–100 ord/mes) · **Fase 2** medio (101–500) · **Fase 3** 501–1.500 · **Fase 4** Golden/alto volumen (solo con controles maduros + **validación legal de decisiones por IA**).
- Controles: cap diario por ciudad–transportadora · monitoreo de efectividad/concentración · **cada orden registra el origen de su config** (global/IA/ajuste post-IA/manual).

## 7 · Datos (diccionario)
- Desempeño por país/ruta; efectividad por carrier·ciudad; volumen por dropshipper (cluster Cronos).  `[data: Cronos — Jaime Reinoso]`
- **Bloqueo técnico activo:** permisos de índices en **Cronos** (Henry Mogollón) limitan el rendimiento del proceso nocturno y son **prerrequisito** para que las pruebas de carga sean representativas.  `[DROP-17946 · acta 31-mar]`
- Gap del POC documentado: asimetría en W + columnas de efectividad faltantes.  `[doc §12]`

## 8 · Trazabilidad  `[🟢 verificado en Jira 24-jun]`
**Cadena de planeación (PRM/Polaris):** OKR2 multi-país [PRM-1391] → KR2.1 tasa de entrega ≥70% [PRM-1396] → Proyecto OKR [PRM-1513] *(vacío, owner Maria Ossa)* · Proyecto discovery [PRM-1219] *(Asignado para hand off)* · Solución/Fase 1 [PRM-203] *(Diseño)* → **se implementa en** épica dev [DROP-17946].

| Tipo | Referencia | Estado real |
|------|-----------|-------------|
| OKR | [PRM-1391](https://dropi-it.atlassian.net/browse/PRM-1391) "OKR 2 2026: Consolidar operación multi-país" | En Ruta (backlog) |
| KR / NSM | [PRM-1396](https://dropi-it.atlassian.net/browse/PRM-1396) "**KR2.1: Tasa de entrega promedio ≥ 70%**" | En Ruta (backlog) |
| Proyecto OKR (gate) | [PRM-1513](https://dropi-it.atlassian.net/browse/PRM-1513) "Optimización selección y gestión de transportadoras" — **descripción vacía**, owner/reporter **Maria Ossa**, célula Logistic Success, fase "Definición" | To Do · En Ruta |
| Proyecto discovery | [PRM-1219](https://dropi-it.atlassian.net/browse/PRM-1219) "Rediseño de Selección de transportadora y optimización logística automatizada" | Asignado para hand off |
| Solución (Fase 1) | [PRM-203](https://dropi-it.atlassian.net/browse/PRM-203) "[Fase 1] Predicción devoluciones: Automatización de selección de transportadoras en panel" | Diseño |
| Épica dev | [DROP-17946](https://dropi-it.atlassian.net/browse/DROP-17946) "Sistema Inteligente de Selección de Transportadoras" — *implementa* PRM-203 | **In Progress · 72% · Highest** |
| Épica V1 previa (bloquea) | [DROP-13739](https://dropi-it.atlassian.net/browse/DROP-13739) "Optimización selección transportadoras - Proveedores y Dropshippers V1" | Done |
| Kickoff (Doc) | [Kickoff Sistema Inteligente de Selección de Transportadoras](https://docs.google.com/document/d/1oiKOFdQ27P2COPSRQVVu9WlRAh7c5_bq/edit) | — |
| Prototipo UX (Figma, Michelle) | [Selección de transportadoras](https://www.figma.com/design/RxEb9heslhkDA7tMpAvYXJ/Selecci%C3%B3n-de-transportadoras?node-id=4875-295751) | — |
| Análisis de apertura (Sheet) | [Análisis cluster/uso/simulación](https://docs.google.com/spreadsheets/d/1LAhDYQB2xOiaach6MZaC42Qf-R3E9QDo/edit?gid=463163455) | — |
| Carpeta Drive | [Sistema_Inteligente_Transportadoras](https://drive.google.com/drive/folders/12BmWGJb2r1V3kH_hP4tsLlgyx8p8pLlm) | — |
| Conocimiento | devoluciones/efectividad carriers → [temas/04](../../conocimiento/temas/04-hallazgos-data.md), [síntesis §2-3](../../conocimiento/sintesis-logistica-producto.md) | — |

> ⚠️ **Hallazgos de la lectura de Jira (24-jun):**
> 1. **PRM-1513 NO es la "idea"**: es un **Proyecto OKR vacío** de Maria Ossa; el discovery real vive en **PRM-1219** y la solución en **PRM-203**. Corregido respecto al sembrado inicial.
> 2. **Discrepancia de KR (ya rastreada, no nueva):** la épica DROP-17946 dice **KR2.2** (lo tomó del *core* / OKR de compañía), pero la numeración canónica de la célula es **KR2.1** (tasa de entrega ≥70%), según el direccionamiento de la CPO en [`estrategia/marco-comun-2026-s2.md`](../../estrategia/marco-comun-2026-s2.md) y el TBD ya abierto en [`estrategia/direccionamiento-logistic-success-2026-s2.md:63`](../../estrategia/direccionamiento-logistic-success-2026-s2.md). **Para este spec manda KR2.1.** No requiere acción nueva; se resuelve cuando el core homologue la numeración.
> 3. **PRM-1513 sin descripción** → si Maria Ossa lo pide, hay base para llenarlo desde el Kickoff.

## 8.1 · Reunión de viabilidad técnica (31-mar-2026)  `[🟢 comentario DROP-17946]`
- **Resultado:** propuesta **viable, sin bloqueos** para avanzar a diseño en alta fidelidad.
- Arquitectura (individual + Golden nocturno) **aprobada conceptualmente** por arquitectura (José Giraldo) y Daniel De La Pava, **condicionada a pruebas de carga reales** (hasta 20.000 concurrentes: latencia, errores, comportamiento de BD).
- **Compromisos:** Jaime Reinoso + Juan Felipe Cubillos corren las pruebas de carga con la herramienta de Juan David Nates → entregan a Daniel De La Pava. Juan Felipe escala con **Henry Mogollón** los permisos de índices en Cronos (prerrequisito). Producto (Laura Torres + Michelle) avanza diseño en paralelo sin esperar resultados.
- Tabla de beneficios: **se descartó parsear Excel** (riesgo de inconsistencia/deuda técnica) → V1 = accesos directos a Drive; tabla visual desde BD propia → fase posterior.

## 9 · Dependencias / acciones de JUAN (Carrier Operations)
- [ ] **Caracterización completa de transportadoras activas** para el catálogo (atributos §5). Insumo concreto = curar/estructurar los **4 docs de Drive** (recaudo / sin recaudo / trayectos especiales / métodos de pago e intentos) — con **Paula Macías**.
- [ ] Responder la pregunta abierta asignada a él: **¿cómo se gestiona la comunicación/coordinación con transportadoras ante cambios en los rankings recomendados?**
> Otras dependencias del proyecto (no de Juan): aprobación María Ossa (gate) · squad+stack (Tech) · carga 20K (Daniel De La Pava) · índices Kronos (Henry Mogollón) · Userpilot (Laura Torres).

## 10 · Preguntas abiertas (del Kickoff §8)
- ¿El dropshipper acepta la sugerencia cuando contradice su costumbre? ¿Tiempo de adopción vs manual?
- ¿"Mayor probabilidad de éxito" resuena mejor que "puntaje"/"Score IA"?
- ¿Impacto en devoluciones medible en 4 semanas o requiere más?
- Reacción cuando la sugerencia se basa en Golden y no en historial propio.

## 11 · Changelog
- 2026-07-21 — **Fórmula de score añadida (§5.2)** desde screenshot de Juan: `G_esperada = W·G_user + (1−W)·G_global`, con `W = n/(n+K)` y `K = Z²·R_global·(1−R_global)/E²` (Z=1,96 · E=15%). Aterriza el prior bayesiano de §5. Abiertas: qué métrica es R_global, y cómo se reconcilia "ganancia esperada" con la utilidad U del doc §4.
- 2026-06-24 (b) — **Revisión a fondo del Figma** (flujo "Optimizar por único departamento"): documentado el flujo UX en §5.1 (pantalla base, modo IA de 2 pasos, 3 estados, 3 granularidades, marca origen-config por ciudad). Hallazgo: posible inconsistencia copy CTA ("precisión de datos") vs modelo V1 (50/50).
- 2026-06-24 — Spec sembrado desde el Kickoff (Doc) + Figma. Jira (PRM-1513/DROP-17946) por leer cuando reconecte. Foco: rastrear las dependencias de Juan (Carrier Ops).
- 2026-06-24 (tarde) — **Jira reconectado, ambos tickets leídos.** Corregido el grafo de trazabilidad (PRM-1513 = Proyecto OKR vacío de Maria Ossa, no la idea; discovery real en PRM-1219, solución en PRM-203, implementada por DROP-17946 que está In Progress 72%). Fix Kronos→**Cronos**. Añadidos: los 4 docs de Drive del catálogo, reunión de viabilidad 31-mar (§8.1), bloqueo de índices Cronos, criterio <30s. Detectadas 2 cosas a confirmar: KR2.1 vs KR2.2 y PRM-1513 sin descripción.
