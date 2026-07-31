# 04 · Hallazgos de data

> **Fuente:** `fuentes/hallazgos_logistica.html` + `fuentes/detalle_logistica.html` · **Base:** history_orders, abril 2026 (mes cerrado) + cohorte 90-15d · **Confianza:** ver §límites

## TL;DR
- **El problema no es la última milla.** En red todos cierran ~72-77%. La sangría (~20 pts) está **pre-red**.
- Funnel: 100 creadas → **~68% entra a red** → ~75% entrega s/red → **~55% entrega s/creadas** · 25% devolución s/red.
- **El primer intento decide.** 72-99% al 1er intento → 10-40% al 2º. Reintentar gestiona el fracaso, no recupera.
- **No hay dueño Dropi de la novedad** (`solved_by_logistic=0`). Recuperación real <5%.

## Contenido
### Funnel pre-red (dónde mueren)
Cancelado 844K + confirmó-sin-guía 266K = el grueso. El handoff (968) y preparación (13K) casi no pierden. **El problema está en confirmación, no en la operación física.**

### Carriers (5 = ~85% del volumen)
| Carrier | % ruta-Dropi | Entrega s/red | Devol s/red | P50 entrega |
|---------|-------------|---------------|-------------|-------------|
| INTERRAPIDISIMO | 18% | 73.4% | 25.4% | 73h (lento) |
| ENVIA | 39% | 76.0% | 23.4% | 52h |
| COORDINADORA | 26% | 74.7% | 20.9% | 63h |
| VELOCES | 70% | 71.7% | 26.5% | 63h |
| TCC | 33% | 77.0% | 22.3% | 48h (rápido) |
> Una vez en red, todos parejos (72-77%). NO priorizar por carrier (mueve 3-4 pts). El mismo "envío normal" son modelos operativos opuestos (18%→70% ruta-Dropi).

### Tiempos por tramo
Guía→Preparado ~3.5h · Preparado→Handoff ~6h (**Dropi ~10h total**) · Red→Entrega 48-73h P50 · cola P90 133-190h (5-8 días). **Dropi es rápido; el carrier es el cuello.**

### Reintentos (ej. ENVIA, base = llegó a reparto)
1er intento 81% entrega → 1 reintento 42% → 2 reintentos 10% → 3+ 7%. Patrón en los 5 carriers.

### Novedades (de `history_new_orders`)
> Tabla completa (9 motivos top) — fuente: reporte de novedades, captura 24-jun (Juan). ~946K órdenes con novedad en estos motivos.

| Motivo de novedad | Órdenes | % resuelta | % entrega final | % devuelve |
|-------------------|--------:|-----------:|----------------:|-----------:|
| Destinatario se rehúsa a recibir | 294.150 | 69.9% | **3.1%** | **95.0%** → soltar |
| Coordinar la entrega | 280.883 | 77.9% | 18.1% | 79.4% |
| Se visita, no se logra entrega | 84.313 | 69.1% | **41.5%** | 51.5% → pelear |
| Dirección destinatario no existe | 81.925 | 73.2% | 16.1% | 82.4% 📍 |
| No hay quien reciba | 63.534 | 50.8% | 39.1% | 59.0% |
| No se localiza dirección | 40.575 | 84.7% | 30.2% | 57.7% 📍 |
| Dirección incompleta | 38.833 | 71.9% | 19.8% | 79.0% 📍 |
| No contesta cliente | 37.400 | 49.2% | 26.0% | 70.9% |
| No encuentra destinatario | 24.355 | 35.7% | **55.0%** | 44.1% → pelear |

> **"Resuelta" es humo:** el % resuelta es alto (70-85%) pero el % entrega final es bajo → resolver la novedad **no** la convierte en entrega. La gestión administra el fracaso, no lo recupera. Cuando hay solución registrada suele ser "DEVOLVER AL REMITENTE".
> **📍 Causa-dirección (lo atacable con validación/normalización en captura):** *no existe* (82K) + *no se localiza* (41K) + *incompleta* (39K) = **~161K órdenes**, devolviendo **58-82%**. Es el dimensionamiento del experimento de direcciones: prevenir en la captura, no gestionar después. *No encuentra destinatario* (24K) es mixto (dirección + contactabilidad).
> **El resto es pago/contactabilidad:** *rehúsa* (294K, 95% devuelve) y *coordinar/no contesta* son COD y contacto, no dirección — atan con el hallazgo "devolución = problema de pago".

### Canal de creación / validación (la fuga #1 de movilización)
> Cruce canal × validada — fuente: reporte aportado por Juan, captura 24-jun. Confirma con números que validar mueve la aguja, sobre todo en SHOP.

| Canal | Validada | Órdenes | GMV (M) | % entra red | % entrega s/red | % devol s/red |
|-------|----------|--------:|--------:|------------:|----------------:|--------------:|
| SHOP | sí | 1.455.755 | 155.047 | **68.9%** | 76.2% | 24.7% |
| SHOP | **no** | **618.470** | **66.244** | **57.0%** | 66.6% | — |
| MANUAL | sí | 646.375 | 78.772 | 92.7% | 78.0% | — |
| MANUAL | no | 342.304 | 45.092 | 92.8% | 71.7% | — |
| MASIVO | sí | 44.324 | 4.548 | 86.1% | 70.9% | — |
| MASIVO | no | 14.815 | 1.620 | 78.2% | 57.9% | — |

> **SHOP:** validar = **+11.9 pts** entra red (68.9 vs 57.0) y **+9.6 pts** entrega s/red (76.2 vs 66.6) — doble efecto.
> **MANUAL:** validar NO cambia la entrada a red (~93% ambos, ya entra) pero sí la entrega (+6.3 pts).
> **El premio: SHOP sin validar = 618K órdenes / GMV ~66.244M.** De extremo a extremo (entra red × entrega s/red): validada rinde **52.5%** de las creadas vs **38.0%** sin validar = **+14.5 pts** → validar esas 618K ≈ **~90K entregas más**. Es correlación; el experimento prueba la causa.
> **El producto = subir la COBERTURA de validación en SHOP** (activarla donde hoy se salta), no construir validación (ya existe `is_validated`). Base del experimento de direcciones.

## Conexión con metodología
- Sustenta §4.2 de la metodología y las palancas de `temas/05`.
- Tensión Movilización↑ vs Devolución↓: no se optimizan con la misma palanca.

## Límites de la data
Sólido: entrega, % entra red, tiempos, reintentos. ±2-3%: devolución. No medible: Servientrega/99min, motivo de cancelación, margen, Fulfillment, geo. → ver `temas/05` correcciones.
