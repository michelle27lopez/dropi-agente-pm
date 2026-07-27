# 05 · Hipótesis, palancas y plan de acción ⭐

> **Fuente:** `fuentes/dossier_completo_dropi.html` (secciones 19-31) · **Tipo:** análisis/decisión · **Confianza:** ver veredictos. **El documento más accionable de la base.**

## TL;DR
- **Hallazgo #1: la devolución es un problema de PAGO.** COD 25% vs prepago 1.3% (H2). Atacar **dentro del COD**, no empujar prepago.
- Las palancas grandes ya están identificadas; las hipótesis nuevas salen descartadas/no-medibles (señal de que la data ya se exprimió).
- **Plan de 3 frentes**, raíz común: instrumentar y poner dueño a lo ciego (motivo de cancelación, sub-estados de devolución, novedad).
- Correlación ≠ causa: toda query es asociación; confirmar requiere A/B.

## Contenido
### Hipótesis H1–H8 (veredicto)
| H | Tema | Veredicto |
|---|------|-----------|
| **H2** | COD vs Prepago | 🥇 **HALLAZGO #1** — devolución 25% vs 1.3%. Pago = palanca dominante |
| **H3** | Validación × canal | ✅ Confirmada — validar SHOP: +12pts entra red, +9 entrega, −8 devol (pero sola no llega a meta 10%) |
| **H7** | Tiempo de confirmación | Binario: importa confirmar o no, no la velocidad. SHOP sin confirmar cancela 51% |
| H1 | Hora de guía | Velocidad, no NSM. Corte 14h (AM→handoff ~9h, PM→22h) pero moviliza ~98% a toda hora |
| H6 | Tiempo proveedor→guía | Menor: +72h moviliza 85% vs 98% (solo 54K órd) |
| H4 | Día de la semana | ❌ Descartada — sin efecto |
| H8 | Ticket (caro=más devol) | ❌ FALSA — baratas y caras ~18%, el medio 25% |
| H5 | Calidad de dirección | No concluyente / geo NO MEDIBLE (116 de 7.9M con coordenadas) |

### Rescate de confirmación (lote 3)
SHOP muere ~20% real (~920K órdenes) vs MANUAL 5.6%. Motivos: **428K son "otros/(sin nota)"** = no instrumentado. Rescatables claros: duplicado (80K), datos incompletos (63K). Confirmación hoy es un colador que MATA (18% cancela) en vez de rescatar. Validación de **origen DESCARTADA** (todas las bodegas movilizan 97-99.9%).

### Mapa de palancas consolidado
| Meta | Palanca dominante | Estado |
|------|-------------------|--------|
| Devolución →10% | Modelo de pago (dentro del COD) | hallazgo fuerte |
| Movilización 80→90% | Instrumentar + rescatar confirmación SHOP | accionable |
| Movilización (sec.) | Validación en SHOP (+12pts) | confirmada |
| Entrega ↑ | Primer intento (no reintentar) | confirmada |

### Plan de acción — 3 frentes (orden de ejecución)
1. **Plan 2 PRIMERO · Estructurar razones de cancelación** — catálogo cerrado, motivo obligatorio, separar rescatable/no. Barato, desbloquea todo. → movilización ↑.
2. **Plan 3 · Dueño y triaje de la novedad** — poner dueño Dropi, triar (pelear 41%, soltar 95%), gate pre-despacho. → devolución ↓ entrega ↑.
3. **Plan 1 · Sub-estados de devolución** — homologar (VELOCES los tiene en 4 pasos), interceptar para reofrecer. → devolución ↓. ⚠️ depende del carrier; empezar con VELOCES.

### Experimentos (empezar por el catálogo de motivos)
In-app/Userpilot: catálogo de motivos · fricción al cancelar duplicado · nudge de validación · recordatorio de confirmación. ChateaPro/backend: auto-confirmación WhatsApp · triaje de novedad · gate de no-reintento.
> Trampas A/B: cohorte madura (2-3 sem mín), split dentro del mismo canal, mirar movilización y devolución juntas.

### Correcciones de método (para no repetir)
"ENTREGADO A TRANSPORTADORA" no es movilización (es Ecom) · reintentos por transición no por conteo · base de reintentos solo los que llegaron a reparto · confirmar = PENDIENTE CONFIRMACION→PENDIENTE · "saltar confirmación" es sesgo de selección · REEMPLAZADA no es fuga.

## Conexión con metodología
- Es la fuente de §4.2 (verdades de data) y del plan en la síntesis §8.bis. Aterriza la metodología en acciones priorizadas.
