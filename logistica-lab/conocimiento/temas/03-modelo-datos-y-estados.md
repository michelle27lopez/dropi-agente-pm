# 03 · Modelo de datos y estados

> **Fuente:** `fuentes/contexto_maestro_dropi.html` + `fuentes/detalle_logistica.html` · **Tipo:** referencia técnica · **Confianza:** sólida (PostgreSQL `dropi_colombia`, read-only)

## TL;DR
- La **orden es el centro**; todo cuelga de `orders.id`. La historia logística vive en `history_orders` (append-only, grano evento → `COUNT(DISTINCT order_id)`).
- Dos sistemas de estado mezclados en `history_orders.status`, separados por `status_master_id` (null = Dropi/app · poblado = carrier).
- Modelo de **7 capas** para homologar el vocabulario de cada carrier. El salto **3→4 es el handoff** (movilización real).
- El flujo no es lineal: es un **diamante** (ruta Dropi vs proveedor-directo convergen en el handoff).

## Contenido
### Tablas clave
`orders` (~130 cols) · `order_details` (líneas/comisiones) · `history_orders` (log de estados) ·
`logistic_management` + `history_logistic_management` (eventos físicos Ecom) ·
`types_logistic_management` (catálogo Ecom, 8 tipos) · `history_new_orders` (novedades ricas: `solution`, `solved_by_user`, `date_solution`) · `distribution_companies` (carriers) · `servientrega_movements` (feed crudo sin homologar).
> ⚠️ `status_master_id` NO es una tabla: es un enum hardcodeado (1-9,13). La homologación buena vive en un Google Sheet externo (`Agrupacion_Estados_Col`, ~132 estados).

### Las 7 capas de estado
1 Pre-confirmación (app) · 2 Preparación (proveedor) · **3 Pierna física Dropi (Ecom, opcional)** · **4 Red carrier** · 5 Fricción (novedad) · 6 Cierre exitoso (ENTREGADO) · 7 Cierre con pérdida (DEVOLUCION/RECHAZADO/CANCELADO).
> Capas 1-3 las controla Dropi; 4-7 el carrier. Capa 3 opcional = marca la ruta.

### Reglas de estados (las trampas)
- "ENTREGADO A TRANSPORTADORA" es estado **Ecom** (pierna Dropi), NO proxy de "entró a red".
- "Movilización real" = alcanzó cualquier estado de carrier (capa 4+), por exclusión.
- "REEMPLAZADA" NO es fuga: es edición de orden (666K de 668K).
- "NOVEDAD SOLUCIONADA" no significa resuelto; se dispara sin resolver.
- Transiciones "hacia atrás" (EN REPARTO→EN BODEGA) son reintentos normales.

### Reglas de medición (obligatorias)
Cohorte por `created_at` · cohorte madura (90-15 días) para resultados · mes cerrado vs mes
cerrado · medir desde `history_orders` no `orders.date_*` · timestamps completos ·
percentiles no promedio · reintento por transición no por conteo · PostgreSQL (`"comillas"`, `EXTRACT(EPOCH...)`).

## Conexión con metodología / cadena de valor
- **Decisión recomendada:** Producto debe ser dueño de su **propia tabla de homologación** (carrier, estado_crudo → grupo). Si no controla "entregado/devuelto", no controla ninguna métrica.
- Mapea la Capa 2 (proceso) a estados medibles.

## Fases medibles y queries (KPI de tiempo por fases)
> **Motor:** PostgreSQL `dropi_colombia` (read-only, `cluster-ro`) · se corre desde Power BI con la estructura `[Query=ConsultaSQL]`. · **Mide desde `history_orders`, NO `orders.date_*`.** · Cohorte por `created_at`, **mes cerrado y maduro** (ej. abril 2026). · Percentiles, no promedio.

### Hitos que acotan cada fase
| Fase | Inicio → fin | Detección en `history_orders` | Robustez |
|---|---|---|---|
| F1 Creada → Confirmada | `orders.created_at` → 1er `status='PENDIENTE'` | estado Dropi homologado | ✅ |
| F2 Confirmada → Guía | → 1er `status='GUIA_GENERADA'` | estado Dropi homologado | ✅ |
| **F3 Guía → Handoff carrier ⭐** | → 1er evento con `status_master_id IS NOT NULL` | movilización real (capa 4) — KPI CPO "orden→transportadora" | ✅ |
| F4 Handoff → En reparto | → 1er estado de reparto | estados crudos por carrier | ⚠️ requiere `Agrupacion_Estados_Col` |
| F5 En reparto → Entregado | → 1er `status='ENTREGADO'` | estado de cierre | ✅ |

### Query 1 — Tiempo por fases (mediana/p90/prom, mes cerrado)
```
let
    ConsultaSQL = "
        WITH cohorte AS (
          SELECT id AS order_id, created_at
          FROM public.orders
          WHERE deleted_at IS NULL
            AND created_at >= DATE '2026-04-01'
            AND created_at <  DATE '2026-05-01'   -- mes cerrado y maduro
        ),
        hitos AS (
          SELECT c.order_id, c.created_at AS t_creada,
                 MIN(h.created_at) FILTER (WHERE h.status = 'PENDIENTE')         AS t_confirmada,
                 MIN(h.created_at) FILTER (WHERE h.status = 'GUIA_GENERADA')     AS t_guia,
                 MIN(h.created_at) FILTER (WHERE h.status_master_id IS NOT NULL) AS t_handoff,
                 MIN(h.created_at) FILTER (WHERE h.status = 'ENTREGADO')         AS t_entregado
          FROM cohorte c
          JOIN public.history_orders h ON h.order_id = c.order_id
          GROUP BY c.order_id, c.created_at
        ),
        fases AS (
          SELECT 1 AS ord, 'F1 creada->confirmada'    AS fase, EXTRACT(EPOCH FROM (t_confirmada - t_creada))    /3600.0 AS horas FROM hitos
          UNION ALL SELECT 2, 'F2 confirmada->guia',           EXTRACT(EPOCH FROM (t_guia       - t_confirmada)) /3600.0        FROM hitos
          UNION ALL SELECT 3, 'F3 guia->handoff carrier',      EXTRACT(EPOCH FROM (t_handoff    - t_guia))       /3600.0        FROM hitos
          UNION ALL SELECT 4, 'F5 handoff->entregado (total)', EXTRACT(EPOCH FROM (t_entregado  - t_handoff))    /3600.0        FROM hitos
        )
        SELECT fase,
               COUNT(horas)                                                           AS n_ordenes,
               ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY horas)::numeric, 1)   AS mediana_h,
               ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY horas)::numeric, 1)   AS p90_h,
               ROUND(AVG(horas)::numeric, 1)                                          AS prom_h
        FROM fases
        WHERE horas IS NOT NULL AND horas >= 0
        GROUP BY ord, fase
        ORDER BY ord
    ",
    Origen = PostgreSQL.Database(
        "prod-dropi-colombia.cluster-ro-cecixmjsmmit.us-east-2.rds.amazonaws.com",
        "dropi_colombia",
        [CommandTimeout=#duration(0, 2, 0, 0), Query=ConsultaSQL]
    )
in
    Origen
```

### Query 1b — Pendiente → Guía por flujo excluyente
La fase a guía tiene **dos caminos que NO se mezclan**: A) `PENDIENTE→GUIA` (auto-confirmada) · B) `PENDIENTE CONFIRMACION→PENDIENTE→GUIA`. Se clasifica cada orden con `BOOL_OR(status='PENDIENTE CONFIRMACION')` y se mide dentro de cada grupo.
```
let
    ConsultaSQL = "
        WITH cohorte AS (
          SELECT id AS order_id, created_at FROM public.orders
          WHERE deleted_at IS NULL
            AND created_at >= DATE '2026-04-01' AND created_at < DATE '2026-05-01'
        ),
        ev AS (
          SELECT c.order_id,
                 BOOL_OR(h.status = 'PENDIENTE CONFIRMACION')                      AS tuvo_confirmacion,
                 MIN(h.created_at) FILTER (WHERE h.status='PENDIENTE CONFIRMACION') AS t_pend_conf,
                 MIN(h.created_at) FILTER (WHERE h.status='PENDIENTE')              AS t_pendiente,
                 MIN(h.created_at) FILTER (WHERE h.status='GUIA_GENERADA')          AS t_guia
          FROM cohorte c JOIN public.history_orders h ON h.order_id = c.order_id
          GROUP BY c.order_id
        ),
        clasificado AS (
          SELECT CASE WHEN tuvo_confirmacion THEN 'B: pend_conf -> pendiente -> guia'
                      ELSE 'A: pendiente -> guia (sin confirmacion)' END AS flujo,
                 EXTRACT(EPOCH FROM (t_guia      - t_pendiente))/3600.0 AS h_pend_guia,
                 EXTRACT(EPOCH FROM (t_pendiente - t_pend_conf))/3600.0 AS h_confirmacion
          FROM ev WHERE t_pendiente IS NOT NULL AND t_guia IS NOT NULL
        )
        SELECT flujo,
               COUNT(*) AS n_ordenes,
               ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY h_pend_guia) FILTER (WHERE h_pend_guia>=0)::numeric,1) AS mediana_pend_guia_h,
               ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY h_pend_guia) FILTER (WHERE h_pend_guia>=0)::numeric,1) AS p90_pend_guia_h,
               ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY h_confirmacion) FILTER (WHERE h_confirmacion>=0)::numeric,1) AS mediana_confirmacion_h
        FROM clasificado GROUP BY flujo ORDER BY flujo
    ",
    Origen = PostgreSQL.Database(
        "prod-dropi-colombia.cluster-ro-cecixmjsmmit.us-east-2.rds.amazonaws.com",
        "dropi_colombia", [CommandTimeout=#duration(0,2,0,0), Query=ConsultaSQL])
in
    Origen
```
> Generalizable: el mismo patrón (`BOOL_OR` por estado clave) sirve para clasificar **rutas completas** (con/sin pierna Ecom, con/sin novedad) y medir cada fase dentro de su ruta — pendiente de homologar los estados intermedios del carrier.

### Query 2 — KPI estrella CPO: tiempo orden → transportadora (handoff)
Cambia el `SELECT` final de la query 1 por:
```
SELECT
  COUNT(*) FILTER (WHERE t_handoff > t_creada)                                                           AS n_movilizadas,
  ROUND(PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (t_handoff - t_creada))/3600.0)
        FILTER (WHERE t_handoff > t_creada)::numeric, 1)                                                 AS mediana_h_a_transportadora,
  ROUND(PERCENTILE_CONT(0.9) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (t_handoff - t_creada))/3600.0)
        FILTER (WHERE t_handoff > t_creada)::numeric, 1)                                                 AS p90_h
FROM hitos
```

### Query 3 — segmentado por transportadora (F3, la palanca)
Añade `MIN(o.shipping_company)` a `hitos` (join a `orders o`) o agrupa por `distribution_companies`, y `GROUP BY transportadora`. Pendiente de cerrar con la homologación para F4/F5.

> ⚠️ **F4/F5 internas del carrier requieren homologar** los ~132 estados crudos (`Agrupacion_Estados_Col` = hoja `ESTADOS`/`ESTATUS_AGRUPADO` en Power BI). Hasta entonces, F4 queda fuera y F3→entregado se mide como bloque.

## Preguntas abiertas
- Servientrega/99min: ~7.5M órdenes invisibles (estados en inglés/typos sin homologar).
- ¿`status='PENDIENTE'` es el hito fiable de "confirmada", o hay órdenes que saltan directo a guía? (validar cobertura de F1 con `n_ordenes`).
