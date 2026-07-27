# Síntesis — Logística como Producto (Dropi)

> Destilado accionable de la base de conocimiento. Lo que un PM de Logistic Success
> debe tener en la cabeza. Base de data: history_orders, abril 2026 (mes cerrado),
> 5 carriers principales. Re-validar contra data fresca antes de decidir.

## 1. La tesis (reescrita por la data)
La logística como producto NO es "hacer envíos": es **aumentar la probabilidad de que
una orden se cree bien, se confirme bien, entre a la red, se entregue y, si falla, se
recupere con trazabilidad.** El motor del sistema es el **consumidor final** (no se
loguea, pero su experiencia define si la cadena funcionó). La unidad de valor es **la
orden que llega bien**. Regla del motor: *a la orden se le cuida siempre — un feature
nuevo nunca puede afectar la orden.*
> Marco completo: [tema 13 · Día 2 — El motor](temas/13-dia2-el-motor-cadena-de-valor-y-consumidor-final.md)
> (cadena de valor, 5 fases de la orden, **Dropi como Trust Agent**) + [tema 12 · marca y comunidad](temas/12-marca-comunidad-y-cognicion-distribuida.md)
> (perfiles, niveles de conciencia, loops). **Ángulo estratégico nuevo:** el consumidor final no está en los
> dashboards, pero su **NPS es el techo de retención** de todos los perfiles; el COD es una compra por confianza
> y esa confianza es responsabilidad de Dropi.

## 2. El hallazgo que cambia la prioridad
**El problema NO es la última milla.** Una vez en la red del carrier, todos cierran
parejo (~72–77% entrega). La sangría (~20 pts) está **ANTES de la red**.

```
100 creadas → ~68% entra a red → de esas ~75% entrega → ~55% entrega sobre creadas
                    ▲ aquí se pierde el grueso          ▼ 25% devolución sobre red
```
El foso de Dropi es su **operación física**: rápida (~10h guía→handoff) y confiable.
El cuello es el carrier (48–73h P50, colas de 5–8 días).

## 3. Las 4 fugas (jerarquizadas)
| # | Fuga | Dónde | Palanca |
|---|------|-------|---------|
| 1 | **Churn pre-red · canal SHOP** | Confirmación/validación | Forzar validación en SHOP (ya existe `is_validated`, da +12 pts) |
| 2 | **COD fallido / devolución** | Entrega | Clavar 1er intento + triaje de novedad |
| 3 | **Stock-outs** | Producto/proveedor | Validación de inventario |
| 4 | **Posventa rota** | Posventa | Dueño Dropi de novedad/garantía |

## 4. Insights duros (con data) que deben guiar el roadmap
- **🥇 HALLAZGO #1 — La devolución es un problema de PAGO, no de logística.** COD devuelve **25%** vs prepago **1.3%** (H2). Matiz honesto: solo 3% es prepago (clientes más comprometidos), no es magia — pero la dirección es tan extrema que el pago es la palanca dominante. Como el **COD es la esencia del negocio**, la devolución se ataca **DENTRO del COD** (anticipo, ConfioPagos, score de riesgo), no empujando prepago.
- **El canal SHOP es la fuga #1 de movilización.** SHOP entra a red 66% vs MANUAL 93%; cancela 16% vs 3%. La integración automática trae basura sin validar.
- **La validación funciona: +12 pts.** El producto no es construir validación — es **forzarla en SHOP**.
- **El primer intento decide.** Entrega 72–99% al 1er intento; se desploma a 10–40% al 2º. NO construir motor de re-despacho → construir **gate pre-despacho** (validación de dirección, confirmación real).
- **"Solucionado" es humo.** `solved_by_logistic = 0` siempre: **no hay dueño Dropi de la novedad.** Recuperación real <5%.
- **Triar novedades:** "rehúsa recibir" (95% devuelve) → no pelear; "no se logra entrega"/"no encuentra destinatario" (41–55% recupera) → sí pelear.
- **El COD es hipótesis abierta de devolución** (contraentrega permite arrepentimiento sin costo) — aún no medido.

## 5. Tensión entre métricas (no optimizar con la misma palanca)
**Movilización ↑** y **Devolución ↓** se pelean: si subes movilización metiendo a red
órdenes dudosas (SHOP sin validar), esas son las que más se devuelven.
Movilización = batalla pre-red · Devolución = calidad de orden + triaje de novedad.

## 6. Modelo conceptual: NO 2 frentes, sino 4 CAPAS
Al conceptualizar logística como producto, separar:
1. **Dimensiones** (ejes que definen un producto): velocidad/SLA · tipo de carga · profundidad de servicio (dropshipping vs fulfillment) · modelo de cobro (COD/prepago) · geografía. Un "producto" = un punto/bundle sobre estos ejes.
2. **Proceso** (la cadena de la orden, común a todo producto): creación → confirmación → flujo proveedor (guía→picking→packing→despacho→recolección) → novedades → entrega. Lo que cambia entre productos no son las etapas, son los **parámetros**.
3. **Features/capacidades** (habilitan etapas; muchas son **transversales** — Chatea Pro, torre logística, validación de dirección sirven a varias). Separar capacidad de interfaz (pantalla).
4. **Beneficios por actor** (dropshipper · proveedor · transportadora · consumidor). Un beneficio siempre es "X para quién".

> ⚠️ Errores comunes a evitar: tratar same-day/envío normal como 2 productos (son velocidad); meter fulfillment como "tipo de envío" (es profundidad de servicio); amarrar features transversales a una etapa; confundir interfaz con capacidad.

> 🔴 **Huecos de primer nivel a no olvidar (mercado COD):** logística inversa/devoluciones como flujo de primer nivel, y la **conciliación COD** (transportadora recauda → remite a Dropi → Dropi paga al dropshipper) — el producto logístico-financiero más crítico.

## 7. Decisión PENDIENTE que bloquea el inventario de productos
> **¿Quién es el cliente/comprador de cada producto logístico — el dropshipper, el
> proveedor, o ambos según el producto?** De esto depende qué cuenta como "producto" y
> cómo se definen los beneficios. (ej: same-day lo *vive* el consumidor pero lo *compra*
> el dropshipper; fulfillment ¿se vende a dropshipper o proveedor?)

## 8. Marco PLG (cómo el producto mueve el valor)
Dropi ya es PLG por diseño (self-serve por necesidad, network effects bilaterales, viral
loop de líderes, valor en uso). Los 5 pilares: **TTV · self-serve · valor antes de pagar
· viralidad · expansión adentro.**
- **Momento Ajá** del dropshipper = primera venta **entregada** + primer cobro. Acerca o aleja: ese es el test de priorización.
- **PQL** (Product Qualified Lead) = setup + primera venta entregada + primer cobro en ≤30 días. Toda iniciativa de activación debe mejorar signup→PQL o PQL→retención.
- **TTV = activación neta** (orden entregada), que ata la cadena completa de la orden → es la misma métrica norte de la célula.

## 8.bis Plan de acción — los 3 frentes (del dossier)
Raíz común: **instrumentar y poner dueño a lo que hoy es ciego y de nadie** (motivo de
cancelación, sub-estados de devolución, novedad). Orden de ejecución:
1. **Plan 2 PRIMERO — Estructurar razones de cancelación.** 428K órdenes mueren con motivo "otros/sin nota". Catálogo cerrado de motivos (no texto libre), motivo obligatorio, separar rescatable (datos incompletos 63K, duplicado 80K) de no-rescatable. Barato, **desbloquea todo**. Mueve movilización ↑.
2. **Plan 3 — Dueño y triaje de la novedad.** `solved_by_logistic = 0`: nadie de Dropi la toca. Poner dueño, triar (pelear visita-no-logra 41%, soltar rehúsa-recibir 95%), gate pre-despacho. Mueve devolución ↓ entrega ↑.
3. **Plan 1 — Consumir sub-estados de devolución.** "Devolución" es caja negra. Homologar sub-estados (VELOCES ya los tiene en 4 pasos), interceptar en "en proceso de devolución" para reofrecer. Mueve devolución ↓. ⚠️ depende de que cada carrier los reporte → empezar con VELOCES.

**Primer experimento (por dónde empezar):** catálogo de motivos de cancelación (Userpilot
nativo, A/B limpio, barato, produce el dato que hoy no existe). Trampas A/B: cohorte madura
(2-3 semanas mín, P90 cierra a 8 días), mantener split dentro del mismo canal, mirar
movilización y devolución juntas (no subir una rompiendo la otra).

## 9. Pregunta de priorización (el filtro de una línea)
> *"¿Qué fuga cierro, en qué etapa de la cadena, para qué actor — y qué pilar PLG activo?"*
> Si una iniciativa no se puede ubicar ahí, no se prioriza.

## 10. Notas de confianza de la data (leer antes de citar números)
- Sólido: tasa de entrega, % entra a red, tiempos por tramo, reintentos (cuadre verificado).
- ±2-3%: tasa de devolución (homologación incompleta).
- No medible hoy (= hallazgos de instrumentación): Servientrega/99min (sin homologar, ~7.5M órdenes invisibles), motivo de cancelación (texto libre, ~30% "Otros"), margen (`amount_earned_dropi` null hasta cierre), Fulfillment by Dropi (flag FALSE 100%).
- **Producto debe ser dueño de su tabla de homologación** (carrier, estado_crudo → grupo). Si no controla "entregado/devuelto", no controla ninguna métrica.
