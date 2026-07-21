# 09 · MVP Dashboard interno de logística

> **Fuente:** `fuentes/proceso_mvp_logistica_producto_dropi.docx` · **Tipo:** spec de producto/proceso · **Confianza:** propuesta de MVP (V0)

## TL;DR
- Dashboard interno para que Producto entienda el comportamiento logístico real y decida **qué problema atacar primero**.
- Principios duros: no mezclar **rechazo** (antes de red) con **devolución** (después de red); no contar guía generada como movilización; timestamps completos; separar rutas logísticas.
- Pregunta guía: *¿qué patrones explican mayor pérdida de entrega y fricción?*

## Contenido
### Flujo normalizado (grupos de estado)
Prelogística · Handoff/movilización · Red logística · Cierre exitoso · Cierre con pérdida · Calidad de datos (excepción/desconocido).

### 6 rutas logísticas a diferenciar
A Dropi recoge · B Proveedor directo · C Sin Ecom con carrier · D Con Ecom sin carrier (problema de handoff) · E Sin movimiento · F Guía reemplazatoria (riesgo de trazabilidad).

### 6 vistas del dashboard
1 Resumen logístico · 2 Funnel por rutas · 3 Tiempos entre estados · 4 Novedades · 5 Devoluciones y rechazos · 6 Dropi Cobertura (por ciudad+transportadora).

### Métricas prioritarias (para empezar)
Tasa de entrega/devolución/rechazo · % guía generada con/sin 1er estado transportadora ·
tiempo guía→1er estado carrier · tiempo 1er estado→entregado · pedidos con novedad + motivos
+ % solucionadas + % entregado/devuelto tras novedad · razones de devolución + GMV devuelto ·
tasa entrega/devolución y tiempo mediano por ciudad+transportadora.

### Clasificación Dropi Cobertura
Fuerte · Media · Débil · Incierta (poco volumen) · Sin cobertura confiable.

### Qué NO incluir en V0
Recomendador de transportadora · alertas · bandeja operativa · automatizaciones · métricas de tickets sin clasificar · rentabilidad sin costos confiables.

### Orden de construcción (4 semanas)
S1 normalizar estados y fuentes · S2 funnel + rutas · S3 novedades + recuperación · S4 devoluciones + cobertura.

## Conexión con metodología
- Es el instrumento que produce la **evidencia** para la metodología y para el Plan 2 (instrumentar) de `temas/05`.
- Refuerza reglas de medición de `temas/03` (rechazo≠devolución, timestamps, percentiles).

## Campos mínimos (instrumentación)
order_id, guide_id, guide_replacement_id, carrier, provider/brand/dropshipper_id,
payment_method, order_value, y timestamps por estado (created_at … carrier_first_event_at,
delivered_at, returned_at, cancelled_at, rejected_at), final_status, status_source.
