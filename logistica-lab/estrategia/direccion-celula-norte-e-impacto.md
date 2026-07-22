# Dirección de la célula — el norte y el árbol de impacto

> **Cómo construimos y dirigimos Logistic Success (+Ecom).** Síntesis operativa que conecta
> **OKR → NSM → palancas (data) → proyectos → experimentos → impacto.** Se apoya en:
> `estrategia/marco-comun-2026-s2.md` + `direccionamiento-logistic-success-2026-s2.md` (la BASE de la CPO) ·
> `conocimiento/temas/05` (verdades de data) · `metodologia/discovery-y-categorizacion.md` (proceso) ·
> `proyectos/_categorizacion.md` (roadmap por la orden). **Última actualización: 2026-06-25.**

## 1 · El norte (en una frase)
**Somos los dueños de la ORDEN: todo lo que le pasa una vez se crea.** Nuestro trabajo es **subir la
tasa de entrega exitosa** moviendo más órdenes a la red y logrando que más lleguen, cuidando el COD
(el valor de Dropi) y midiendo el tiempo por fases.
- **NSM:** **tasa de entrega exitosa ≥ 70%** (OKR2 · **KR2.1** de compañía — somos dueños directos).
- **KPI del semestre:** **tiempo de la orden hasta la transportadora ≤ 24h** *(dirección del umbral por confirmar)*.
- **Células:** **Logistic Success + Ecom** (ambas son de Juan). Somos **Enabler**.
- **Valor de Dropi = COD** (contraentrega): se cuida dentro del COD, no empujando prepago.

## 2 · El árbol de impacto (cómo se descompone la NSM)
> Regla de lectura: la entrega exitosa = **que la orden ENTRE a la red (movilización) × que se ENTREGUE (sobre red)**. Más dos lentes transversales: **COD/devolución** (el valor) y **tiempo por fases** (el KPI).

| Sub-métrica | Hoy (data abr-26) | Palanca dominante (tema 05) | Fuga | Proyecto(s) que la mueven | Experimento de arranque |
|---|---|---|---|---|---|
| **Movilización** (entra a red) | ~68% (SHOP 66% vs MANUAL 93%) → meta 90% | **Instrumentar + rescatar confirmación SHOP** + validación (+12pts) | ① | Validación/Normalización direcciones (PRM-91) · **falta proyecto que la nombre** | **Catálogo de motivos de cancelación** (barato, desbloquea) |
| **% entrega sobre red** | ~72–77% (parejo entre carriers) | **Primer intento decide** + dueño/triaje de novedad | ②④ | Notif. prevención devoluciones (PRM-1512) · Selección de transportadoras (PRM-1513) · pruebas de entrega (PRM-1364) | Gate de **no-reintento** + triaje de novedad |
| **COD / devolución** (valor) | devolución ~19–25% (COD 25% vs prepago 1.3%) | **Atacar DENTRO del COD** (anticipo, score de riesgo, ConfioPagos) | ② | disperso en Backoffice (PRM-1283/1209) · **sin frente logístico** | sub-estados de devolución (empezar VELOCES) |
| **Tiempo por fases** (KPI) | sin medir (queries listos) | **Normalizar estados** → medir transiciones | ⬚ | Normalización de estados (PRM-1297) · **falta el proyecto de medición** | correr KPIs F1–F5 + homologar F4/F5 |

> **Lo que la CPO ya listó como proyectos de KR2.1:** movilizaciones 80→90% · rediseño módulo de órdenes ·
> herramientas preventivas/predictivas · selección/gestión de transportadoras · coberturas y same-day ·
> ChateaPro en transportadoras · cierre logístico · pruebas de intentos de entrega · reducir devoluciones 10%.

## 3 · Los 3 gaps que hay que cerrar para poder dirigir con números
1. 🔴 **No existe el proyecto de la métrica norte** — "tiempo de entrega por fases" (torre de control por etapa). Es el KPI del semestre y nadie lo posee. **Crearlo.**
2. 🔴 **Movilización y COD no son objetivo directo de ningún proyecto** (movilización es media NSM; COD es el valor). COD vive disperso en Backoffice.
3. 🔴 **Roadmap sin línea de tiempo ni conexión al OKR** — `Aporte a NSM` 0/28, `Cronograma` 0/28, `OKR Ppal` vacío en ~15. Sin esto no se prioriza ni se reporta avance.

## 4 · Cómo se dirige la célula (el motor operativo)
- **Dos backlogs en paralelo:** terminar el **Delivery** heredado (5 proyectos: PRM-1513 transportadoras · 1366 Same Day · 1512 notif/devoluciones · 1297 normalización · 91 direcciones) **+** correr **discovery** con enfoque OKR (Product Backlog).
- **WIP cap: 2–3 oportunidades activas.** Entra una, sale otra.
- **Pipeline:** Outcome → ideas → **Gate 1** (F0 estratégico vs OKR · F1 señal · F2 cartera) → Product Backlog (Wander→Explore→Make→Impact) → **Gate 2 = Dropi Score** `(Impacto OKR × Confianza)/Complejidad × 20` → Delivery. Balance de cartera con **Lente 4D**.
- **Seguimiento (Following):** PD (Michel/Laura) + Data instrumentan (Userpilot · HEART · SEQ · plan 12 sem) — ver `metodologia/discovery-y-categorizacion.md §6.1`.
- **Ritmo:** Cell Board (mié, idear/repartir) → Weekly TI (sincronizar) → Weekly Producto (showcase + dirección Maria) → reporte viernes. Ver `planning/semana.md`.

### Equipo (quién mueve qué)
PM **Juan** · PD **Michel Pino** (UX) · **Laura Torres** (rollout/Userpilot) · Owner tech **Kevin Fory/Marcos Amado** · Project lead **José Giraldo** · Front **Johan Palacio** · Back **Víctor Orobio/Álvaro Romero/Daniel Pozo** · Data **Jaime** · Growth **Maria Ossa** · GrowthOps **Juan Camilo Rojas** · Coms **María José Calderón** · aliadas: Logística (Morales/Peralta) · Legal.

## 5 · Prioridades recomendadas (secuencia para mover la NSM)
> Principio: **instrumentar lo ciego primero** (barato, desbloquea) → luego construir. Plan de 3 frentes (`temas/05`).
1. **Estructurar razones de cancelación** (catálogo cerrado + motivo obligatorio) → desbloquea **movilización**. *Lo más barato y de mayor palanca.*
2. **Crear el proyecto "Tiempo de entrega por fases"** (North Star/KPI) → correr KPIs F1–F5 + normalizar estados (PRM-1297).
3. **Dueño + triaje de la novedad** (gate pre-despacho, primer intento) → **entrega ↑, devolución ↓** (apoya PRM-1512).
4. **Sub-estados de devolución** (empezar con VELOCES) → **devolución ↓**.
5. En paralelo, **Delivery EJECUTAR**: transportadoras (Carrier Ops de Juan), Same Day, direcciones.
6. **Higiene de roadmap:** poblar `OKR Ppal` + `Aporte a NSM` + `Cronograma` en los activos → el roadmap gana trazabilidad y línea de tiempo.

## 6 · Decisiones abiertas (para dirigir con certeza)
- [ ] **Meta numérica de cada KPI** (movilización, entrega, tiempo) con **Dir. Producto / Maria Ossa** — hoy sin baseline (depende de la 1ª medición).
- [ ] **Umbral del KPI de tiempo:** ≤24h vs ≥24h (el insumo original se contradice).
- [ ] **Frente COD/recaudo:** ¿lo asume logística o se coordina con Backoffice? (COD = el valor, hoy disperso).
- [x] ~~Qué define el roadmap de logística~~ → **la orden, por contenido** (resuelto 24-jun).
- [x] ~~KR2.1 vs KR2.2~~ → canónico **KR2.1**.

## 7 · Resumen para la cabeza (lo que no se re-litiga)
La orden es el producto · entrega ≥70% es el norte · COD es el valor · el tiempo se mide por fases ·
se instrumenta antes de construir · 2–3 apuestas a la vez · todo proyecto se ata a un KR con métrica y data.
