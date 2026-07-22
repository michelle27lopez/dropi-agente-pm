# 🗺️ Roadmap Q3 — Logistic Success (la ruta completa)

> **Qué es:** el plan de la célula para Q3 2026, de la idea a la ejecución. Integra en un solo hilo: idea → norte → etapas de la orden → apuestas → **fases con dueño, métrica y secuencia**. Cierra el ítem #2 del Product Backlog (*"cronograma de ejecución Q3"*).
> **Se apoya en:** [primera-medicion-kpis-y-meta.md](primera-medicion-kpis-y-meta.md) (baseline+meta) · [mapa-etapas-orden.md](mapa-etapas-orden.md) (las 6 etapas) · [roadmap-okr-impacto.md](roadmap-okr-impacto.md) (OKR→proyecto→aporte) · [direccionamiento](direccionamiento-logistic-success-2026-s2.md) (los 2 backlogs, equipo).
> **Fechas:** por fases y ventanas relativas; las fechas duras salen del Cell Board / Delivery. No se inventan.

---

## 0 · La idea (una línea)
**Somos dueños de la orden. Subimos la entrega sobre creadas de 59% a 70% cerrando las dos fugas —no-movilización y devolución— sin tocar lo que ya funciona (Dropi entrega al transportador en horas).**

El resto del documento es *cómo*, en orden.

## 1 · El norte (decisiones cerradas 01-jul)
- **KR2.1 · Tasa de entrega ≥ 70%, sobre órdenes CREADAS.** Hoy: **59% consolidado · Colombia 62,5%.** Faltan ~8–11 pts.
- **KPI Q3 · Tiempo de la orden hasta la transportadora < 24h**, medido como **% de órdenes bajo el umbral** (tasa, no promedio). En el tramo Dropi cumplimos 82–99% por fase; el cuello es el carrier.
- La brecha del KR solo sale de dos sitios: **no-movilización (~17%) + devolución (~21%).**

## 2 · Cómo trabaja la célula (marco de Maria)
- **Dos frentes a la vez:** terminar el **Delivery Backlog heredado** + **discovery** para mover el KPI.
- **Tope: 2–3 apuestas activas.** Cada oportunidad gradúa de Product → Delivery al pasar el **Gate 2 (Dropi Score)**.
- Discovery por etapas: **Wonder → Explore → Make → Impact.**

## 3 · La orden por etapas (el terreno)
De 6 etapas, **2 están sanas** (no tocar) y **2 son las fugas** (aquí vive el roadmap):

`Creación 🟡 → Confirmación 🔴 → Alistamiento 🟢 → Handoff 🟢 → Entrega 🔴 → Postventa 🔴`

Detalle y datos por etapa: [mapa-etapas-orden.md](mapa-etapas-orden.md).

## 4 · Las apuestas (una palanca por fuga, con métrica)
| # | Apuesta | Fuga / etapa | Métrica (base → meta) | Proyecto | Discovery |
|---|---|---|---|---|---|
| 1 | **Instrumentar el motivo de cancelación** | ① Confirmación | % cancelaciones clasificadas (53% ciego → 100%) | PRM-1497 | Wonder→Explore |
| 2 | **Forzar validación en SHOP** | ① Creación/Conf. | % entra red SHOP (57%→68%+) | PRM-91 | Explore→Make |
| 3 | **Transportadora correcta por zona** | ② Entrega | devolución (26%→−2–3 pts); Δ carrier/zona 20–27 pts | PRM-1513 | Make (dev 72%) |
| 4 | **Dueño + triaje de la novedad** | ②④ Postventa | recuperación real (<5%→subir en recuperables) | PRM-1512 | Impact (finalizar) |
| 5 | **Normalizar estados** *(habilitador)* | medición | % guías con estado homologado (mide MX) | PRM-1297 | Explore |
| 6 | **Same Day** *(cobertura)* | velocidad | cobertura same-day · tiempo | PRM-1366 | Explore |

## 5 · EL ROADMAP EN FASES (la ruta)
> Principio: **instrumentar antes de construir · barato → caro · empezar por lo que no depende de terceros.** WIP cap 2–3.

### Fase 0 · Ver claro *(Julio, semanas 1–2)* — barato, desbloquea todo
| Acción | Dueño | Métrica de salida |
|---|---|---|
| Catálogo cerrado y obligatorio de motivo de cancelación (apuesta 1) | Juan + Michel + Data | % clasificadas → 100% |
| Pedir a Data 2 números que faltan: **(a)** % órdenes creación→handoff < 24h (acumulado); **(b)** motivo de cierre por carrier×zona | Juan + Data (Miguel Á.) | ambos exports entregados |
| Confirmar el riesgo de homologación (`SIN MOVIMIENTOS`=movilizado) | Juan + Data | movilización validada |
> **Gate:** con esto medimos bien las dos fugas y el tiempo real. Sin esto, todo lo demás se prioriza a ciegas.

### Fase 1 · Ganancias rápidas *(Julio–Agosto)* — bajo costo, mueve ya
| Acción | Dueño | Métrica |
|---|---|---|
| Forzar validación en SHOP (apuesta 2) | Juan + Michel + Back (Víctor/Álvaro) | % entra red SHOP |
| Cerrar dueño + triaje de novedad — PRM-1512 a **finalizar** (apuesta 4) | Juan + Ops (W. Morales) + CAS | % recuperación en recuperables |
> **Gate:** Cell Board / Dropi Score. Respetando el cap, esto + Fase 0 son las apuestas activas.

### Fase 2 · Construcción *(Agosto–Septiembre)*
| Acción | Dueño | Métrica |
|---|---|---|
| Transportadora por zona — PRM-1513 (apuesta 3; épica DROP-17946 ~72%) | K. Pencue (owner) + Juan (Carrier Ops) + C. Peralta | devolución por zona |
| Normalizar estados — PRM-1297 (apuesta 5; habilita medir MX) | Juan + Data + J. Giraldo | % estados homologados |

### Fase 3 · Apuestas mayores / terceros *(Septiembre+ · Q4 se planea al cierre de Q3)*
| Acción | Dueño | Nota |
|---|---|---|
| Same Day — PRM-1366 (apuesta 6) | Juan + Michel | cobertura/tiempo |
| Pagos dentro del COD · posventa | + Fintech / Backoffice | dependencia externa |

> **Meta al final del camino:** Colombia entrega s/creadas **62,5% → ~67% en Q3**, rumbo a 70%.

## 6 · Cómo mapea a los 2 backlogs
- **Delivery Backlog (heredado, ejecutar):** PRM-1513 · 1366 · 1512 (finalizar) · 1297 · 91 → todos entran en las fases 1–3.
- **Product Backlog (discovery):** #1 medición+meta ✅ hecho · #2 este cronograma ✅ · #3 visión de producto ([vision-producto-logistico.md](vision-producto-logistico.md)).

## 7 · Riesgos y dependencias (no enterrar)
- **Homologación:** `SIN MOVIMIENTOS`=movilizado → movilización quizá sobreestimada (confirmar Data, Fase 0).
- **Tiempo acumulado:** hoy tenemos cumplimiento por fase, no el número único creación→handoff < 24h (pedir, Fase 0).
- **México "mide mal":** ~13% brecha de medición → no prometer meta MX hasta Normalización (PRM-1297).
- **Carrier:** el tiempo grave (primer ofrecimiento, entrega final) y parte de la devolución dependen del transportador, no de Dropi → palanca vía PRM-1513 + acuerdos, no build propio.

## 8 · Qué necesito de Dirección de Producto
- Confirmar por escrito para toda la célula: KR = **s/creadas**, **KR2.1**, umbral **< 24h**.
- Validar el **orden de las fases** (¿arrancamos por confirmación como #1?).
- Aprobar la **meta Q3** (CO +4–5 pts) para fijarla.

## 9 · Changelog
- **2026-07-01 · v1** — Roadmap Q3 integrado (idea → norte → etapas → apuestas → 5 fases con dueño/métrica) sobre las 3 decisiones cerradas y la data de junio.
