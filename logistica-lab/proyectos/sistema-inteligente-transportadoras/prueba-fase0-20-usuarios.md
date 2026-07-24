# Discovery · Pruebas de usuarios — Selección de transportadoras

> **Estado: 🟠 BORRADOR de Juan (Carrier Ops) — NO aprobado, NO ejecutable por Juan solo.**
> Owner de la decisión = **Katherine Pencue** (PM). Gate = **María Ossa**.
> Este doc existe para **llegar con el protocolo diseñado** a esa conversación, no para arrancar por fuera.
> Creado 2026-07-16 · **Reencuadrado 2026-07-16** (ver §0) · Base: [`spec.md`](spec.md) §5-6, Kickoff §2-5, §10.
> Entra al **Product Roadmap** vía [`planning/cronograma-pruebas-poc.md`](../../planning/cronograma-pruebas-poc.md).

---

## 0 · Qué es esto (decisión de Juan, 16-jul)

**Es: discovery — pruebas de usuarios.** Objetivo = **entender la funcionalidad**. ≥20 dropshippers.

**NO es** un experimento que mida impacto en devoluciones, **ni** un beta con brazo de control.

> **Por qué el reencuadre es correcto:** la primera versión de este doc lo diseñó como cuasi-experimento
> (control pareado, ventanas de 4 semanas, Δ de share como titular) y chocaba con la aritmética: N=20
> queda **~5× corto** para detectar el −1pp de devolución (ver §3). Al declararlo **discovery**, la
> tensión desaparece — para *entender*, 20 usuarios no solo alcanzan, **sobran**.
> **Lo que cambia:** el titular deja de ser *"cómo cambia la distribución"* y pasa a ser
> **las preguntas abiertas del Kickoff §10**. La distribución baja a **observación secundaria** (Q3).
> Un discovery no se juzga por *"¿movió la aguja?"* sino por *"¿aprendimos lo que no sabíamos?"*.

### La pregunta que además justifica correrlo ahora (ángulo Carrier Ops)
El spec §9 deja abierta una pregunta asignada a Juan: *¿cómo se gestiona la comunicación con las
transportadoras ante cambios en los rankings recomendados?* **No se puede responder en teoría.**
Con 20 usuarios se observa el desplazamiento de share sin mover volumen suficiente como para
tensionar la relación con ningún carrier — la forma barata de tener evidencia antes de Fase 1–4.

---

## 1 · Preguntas del discovery

### 1.a Las del Kickoff §10 — **el titular** (cualitativas, sesión observada)
| # | Pregunta | Cómo se responde |
|---|----------|------------------|
| K1 | ¿El dropshipper **acepta la sugerencia cuando contradice su costumbre**? | Observar + preguntar por qué. **La pregunta central.** |
| K2 | ¿**"Mayor probabilidad de éxito"** resuena mejor que "puntaje"/"Score IA"? | Reacción al copy en sesión |
| K3 | ¿Cómo reacciona cuando la sugerencia **se basa en Golden y no en su historial**? | Mostrar ambos casos |
| K4 | ¿Cuánto tarda en adoptarlo vs. su config manual? | Observación + TTV |

> ⚠️ **Alinear UX ↔ modelo antes de la sesión:** el CTA del Figma dice *"efectividad, costo de flete y
> **precisión de datos**"*, pero el modelo V1 pesa **50% efectividad / 50% costo** (días=0). Si un usuario
> pregunta por "precisión de datos" en la sesión, no hay respuesta. → Kate/Michelle/Jaime (spec §5.1).

### 1.b Observaciones secundarias (de la instrumentación, si existe §5)
| # | Observación | Métrica |
|---|-------------|---------|
| Q1 | ¿Lo activan? | % de los 20 que corren "Optimizar con IA" ≥1 vez |
| Q2 | ¿Aceptan sin ajustar? | % de ciudades que quedan **Optimizado (IA)** sin ajuste posterior |
| Q3 | ¿Cambia la distribución? | Δ share de guías por carrier, **por usuario**, antes vs después |
| Q4 | ¿Se revierte? | % de ciudades que vuelven a **Personalizado (manual)** en ≤14 días |
| Q5 | ¿Se concentra el volumen? | share del carrier #1 sobre el total de los 20 → **guardarraíl §6** |

**Q3 sí es observable con 20 usuarios** (es un cambio *dentro* del usuario y de efecto grande: pasar de
90% Interrapidísimo a 40% se ve con decenas de guías). **Lo que no se puede saber es si fue bueno** → §3.

---

## 3 · ⚠️ El límite, para decirlo antes y no después

Hipótesis del proyecto: **−1pp de devolución** (19,24% → 18,24%) sobre base CO feb-26.

- Poder 80%, α=0,05, dos colas → **~24.000 órdenes por brazo (~48K total)**.
- 20 usuarios de volumen medio (101–500 ord/mes) → **~2.000–10.000 órdenes/mes**.
- Con ~5.000 órdenes el efecto mínimo detectable es **~2,2pp** — más del doble del esperado.
- **~5× corto.** Tener poder para el outcome tomaría **3–12 meses** con N=20.

> 🔴 **Riesgo de encuadre:** si esto se presenta sin la aclaración, a las 4 semanas alguien pregunta
> *"¿bajaron las devoluciones?"* y la respuesta honesta ("aún no se puede saber") se lee como fracaso
> en vez de como diseño. **Es discovery. El impacto se mide en Fase 2+, con volumen.**

---

## 4 · A quién

El Kickoff §5 manda arrancar Fase 1 en **no-Golden de bajo volumen (1–100 ord/mes)**.
Como esto es **discovery y no medición**, el volumen importa mucho menos que **la diversidad de casos**.

**Propuesta (decide Kate):** ≥20 dropshippers **estratificados** por —
- **Departamento** (no todos Bogotá → la config por ciudad es el corazón de la feature),
- **Historial:** con ≥2 carriers usados **y** algunos sin historial propio (para ver K3, el caso Golden),
- **Volumen:** mezcla de Fase 1 y Fase 2 (101–500) → los de Fase 2 dan además señal utilizable en Q3.

**Sin grupo de control** — no aplica a un discovery. (Si más adelante se quiere medir impacto, ahí sí,
y ahí sí hay que hablar de volumen.)

---

## 5 · Trazabilidad del origen en LA ORDEN — degradada a 🟡 por el reencuadre

El Figma marca cada ciudad como **Preferencia global · Optimizado (IA) · Personalizado (manual)** —
eso es trazabilidad **en la pantalla de configuración**. Para que **cada guía generada** registre el
origen de la config con la que se eligió el carrier (global / IA / ajuste post-IA / manual), como pide
el Kickoff §5, hace falta instrumentación en la orden.

> **Precedente:** en autoconfirmación el sistema **no distingue** confirmación manual de automática
> (salvo Chatea) — el mismo agujero. → **Preguntar a Juan Felipe Cubillos si aquí existe.**

**⚠️ Qué cambió con el reencuadre a discovery:** esto **ya NO bloquea**. En sesión observada, el origen
se ve directamente (estás mirando al usuario). Sin instrumentación se pierden **Q1–Q5** (§1.b), que son
las **observaciones secundarias**, no el titular. → **La pregunta a Juan Felipe sigue valiendo, pero
baja de 🔴 bloqueante a 🟡: define si hay observaciones secundarias, no si hay discovery.**

## 5.1 · Prerrequisitos

- 🔴 **Catálogo caracterizado** (4 docs de Drive, Juan + Paula Macías) — **bloquea de verdad, y ahora más**:
  es el botón "Detalle transportadoras". Si el objetivo es *entender la funcionalidad* y el catálogo está
  vacío, el usuario evalúa media feature y el aprendizaje sale sesgado. **Es dependencia de Juan.**
- 🔴 **Gate de María Ossa** + los usuarios (§7).
- 🟡 **Alinear el copy del CTA con el modelo** (§1.a) — antes de sentar a nadie.
- 🟡 **Origen de config en la orden** (§5) — solo para las observaciones secundarias.
- 🟢 **Índices en Cronos (Henry Mogollón) — NO bloquea.** El bloqueo aplica al *batch nocturno Golden* y
  a las *pruebas de carga a 20.000 concurrentes*. Con 20 usuarios el cálculo individual en tiempo real
  basta. **Este es el argumento para no esperar a Cronos.**

---

## 6 · Guardarraíl (Q5) — lo que Juan vigila como Carrier Ops

- **Cap diario por ciudad–transportadora** activo desde el día 1 (Kickoff §5).
- **Regla de parada:** si el share de un carrier sobre el total de los 20 sube **>25 pts** en una
  semana, se pausa la optimización y se escala a Kate + Carrier Ops **antes** de que el carrier lo note.
- **Comunicación con carriers:** *no* se notifica a las transportadoras en V1 (⛔ no-objetivo).
  Con N=20 el delta absoluto de volumen es despreciable → no dispara conversación comercial.
  **El output de esta prueba es la respuesta a la pregunta abierta del §9 del spec**, con datos.

---

## 7 · Qué necesita Juan para que esto arranque

1. **Kate Pencue:** ¿acepta esto como el discovery de pruebas de usuarios del proyecto? ¿Cómo se
   estratifican los ≥20 (§4)? + fecha para el [cronograma de POC](../../planning/cronograma-pruebas-poc.md).
2. **Paula Macías:** cerrar la caracterización de los 4 docs **antes de reclutar** — es el prerrequisito real.
3. **Juan Felipe Cubillos:** ¿la orden registra el origen de la config? (§5) — 🟡 ya no bloqueante.
4. **María Ossa:** gate + los **20 usuarios**. ⚠️ Es el **mismo cuello que tiene frenados
   autoconfirmación y autogeneración**: el prototipo está listo y faltan las personas.
   → **No pedirlo como petición nueva; sumarlo a la petición existente** de
   `reportes/para-maria-carta-al-nino-dios.md` *(bóveda)* §"Personas para
   correr los experimentos". Tres cosas bloqueadas por lo mismo pesa más que tres pedidos sueltos.

## 8 · Changelog
- 2026-07-16 (b) — **Reencuadrado a "Discovery · pruebas de usuarios"** (decisión de Juan): objetivo =
  entender la funcionalidad, no medir. Titular = preguntas abiertas del Kickoff §10 (§1.a); la distribución
  baja a observación secundaria (§1.b); **eliminado el grupo de control** (no aplica a discovery);
  trazabilidad en la orden **degradada de 🔴 a 🟡**; el **catálogo** queda como el prerrequisito que sí
  bloquea. Entra al Product Roadmap vía [cronograma-pruebas-poc.md](../../planning/cronograma-pruebas-poc.md).
- 2026-07-16 — Borrador creado a pedido de Juan ("prueba de ≥20 usuarios para ver cómo cambia la
  distribución"). Aporta: cálculo de poder (no mide devoluciones), prerrequisito de trazabilidad en la
  orden, guardarraíl de concentración, y el hallazgo de que Cronos no bloquea a N=20.
