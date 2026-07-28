# 🧪 PLAN DE EJECUCIÓN: Piloto Concierge - Dropi Wrapped

Este documento detalla el plan operativo para ejecutar la prueba controlada (concierge) de **Dropi Wrapped** en agosto 2026, validando el supuesto de reactivación antes de pasar a desarrollo formal.

---

## 1. Extracción y Segmentación de Datos (Supabase)

Para construir la muestra de 60 sellers (30 Piloto / 30 Control), ejecutaremos la siguiente consulta SQL en la base de datos de Dropi para identificar dropshippers que tuvieron tracción pero se encuentran inactivos (en riesgo de churn).

### Consulta 1: Identificación de la Cohorte en Riesgo
```sql
WITH seller_activity AS (
    SELECT 
        o.seller_id,
        u.email,
        u.nombre,
        COUNT(o.id) FILTER (WHERE o.estado = 'entregada') as total_entregadas,
        MAX(o.created_at) as ultima_orden_fecha
    FROM orders o
    JOIN users u ON o.seller_id = u.id
    WHERE o.created_at >= '2026-01-01'::timestamp
      AND u.rol = 'dropshipper'
    GROUP BY o.seller_id, u.email, u.nombre
)
SELECT 
    seller_id,
    email,
    nombre,
    total_entregadas,
    ultima_orden_fecha,
    date_part('day', now() - ultima_orden_fecha) as dias_inactivo
FROM seller_activity
-- Criterio de Selección:
WHERE total_entregadas >= 20               -- Tuvo tracción histórica mínima
  AND ultima_orden_fecha BETWEEN now() - interval '20 days' AND now() - interval '10 days' -- Inactivo entre 10 y 20 días
ORDER BY total_entregadas DESC
LIMIT 60;
```

### Consulta 2: Extracción de Métricas del Wrapped (Para los 30 del Grupo Piloto)
Para cada uno de los 30 dropshippers seleccionados para el piloto, extraeremos las siguientes variables correspondientes al año en curso:

```sql
-- 1. Órdenes Totales y GMV
SELECT 
    COUNT(id) as total_ordenes,
    SUM(valor_venta) FILTER (WHERE metodo_pago = 'COD') as gmv_cod,
    COUNT(id) FILTER (WHERE estado = 'entregada')::float / COUNT(id) as tasa_entrega
FROM orders
WHERE seller_id = :seller_id 
  AND created_at >= '2026-01-01';

-- 2. Top 3 Productos
SELECT 
    producto_nombre,
    COUNT(id) as cantidad_vendida
FROM orders
WHERE seller_id = :seller_id
GROUP BY producto_nombre
ORDER BY cantidad_vendida DESC
LIMIT 3;

-- 3. Ruta Campeona (Mejor Tasa de Entrega Ciudad → Ciudad)
SELECT 
    ciudad_origen,
    ciudad_destino,
    COUNT(id) as total_envios,
    COUNT(id) FILTER (WHERE estado = 'entregada')::float / COUNT(id) as efectividad
FROM orders
WHERE seller_id = :seller_id
GROUP BY ciudad_origen, ciudad_destino
HAVING COUNT(id) >= 10
ORDER BY efectividad DESC
LIMIT 1;

-- 4. Distribución Horaria (Para Arquetipo)
SELECT 
    COUNT(id) FILTER (WHERE date_part('hour', created_at) BETWEEN 21 AND 23 OR date_part('hour', created_at) BETWEEN 0 AND 2) as ordenes_nocturnas,
    COUNT(id) as ordenes_totales
FROM orders
WHERE seller_id = :seller_id;
```

---

## 2. Plantilla de Mensaje / Email (Trigger)

Los 30 sellers del **Grupo Piloto** recibirán una comunicación personalizada por WhatsApp (canal prioritario para dropshippers) o Email, simulando una atención prioritaria de su Account Manager:

> **Asunto / Primer Mensaje:**
> *"Hola {{nombre}}, soy Santiago de Dropi. Estaba revisando tu historial y he preparado algo especial para ti. 
> 
> Diseñamos tu **Dropi Wrapped** personalizado para repasar tu gran progreso este año y ayudarte a planificar tu siguiente nivel de comisiones. Te dejo tu enlace privado:
> 
> 👉 [Ver mi Dropi Wrapped](http://wrapped.dropi.co/view/{{user_id}})
> 
> Cuéntame qué te parece tu arquetipo y si necesitas que te ayude a configurar la pauta para tu producto estrella esta semana."*

---

## 3. Protocolo de Seguimiento (7 Días)

A partir del envío de los mensajes (Día 0), mediremos el comportamiento transaccional durante los 7 días posteriores:

```
   Día 0: Envío de Wrapped a Grupo Piloto (30 sellers)
   Día 1-3: Monitoreo de aperturas in-app y compartidos (Métricas de Actividad)
   Día 7: Extracción transaccional final (Métricas de Outcome)
```

### Consulta de Evaluación de Outcome (Día 7)
```sql
SELECT 
    u.id as seller_id,
    u.email,
    CASE 
        WHEN pilot.seller_id IS NOT NULL THEN 'Grupo Piloto'
        ELSE 'Grupo Control'
    END as cohorte,
    COUNT(o.id) as ordenes_creadas_post_7d,
    COUNT(o.id) FILTER (WHERE o.estado = 'entregada') as ordenes_entregadas_post_7d
FROM users u
LEFT JOIN orders o ON o.seller_id = u.id AND o.created_at >= :fecha_envio_wrapped
-- Filtro del universo del experimento (Grupo Piloto + Grupo Control)
WHERE u.id IN (:lista_60_sellers)
GROUP BY u.id, u.email, cohorte;
```

---

## 4. Criterios de Evaluación y Gate para Rollout

* **Decisión de Escalar (Aprobación):** El Grupo Piloto muestra un **incremento $\ge 20\%$ en la tasa de reactivación** (proporción de usuarios que montan al menos 1 orden) frente al Grupo Control.
* **Decisión de Iterar:** El Grupo Piloto abre y comparte el Wrapped (actividad alta), pero no genera más órdenes que el control. Acción: Rediseñar el slide final (Slide 9) para simplificar el botón de "Reordenar/Escalar producto estrella" conectándolo directamente al checkout de Dropi.
* **Decisión de Matar:** Sin diferencias observables en actividad ni conversión.
