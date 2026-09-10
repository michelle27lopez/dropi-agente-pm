# Diccionario de Features — Algoritmo de Oportunidades

> Artefacto 3 del Data Model Package. Fija la **fórmula canónica** de cada variable para que signifique exactamente lo mismo en R (entrenamiento) que en Next.js (operación). Esa identidad es el Criterio 3 del DoD (*zero training-serving skew*).
>
> Contrato vigente: **v1** · Fuente: [`seller-metrics-contract.ts`](./seller-metrics-contract.ts) · Tabla: [`056_marketplace_feature_store.sql`](../../../supabase/056_marketplace_feature_store.sql)

**Regla de oro:** una variable no existe hasta que está en esta tabla con su fórmula escrita. Si el algoritmo necesita algo que no está acá, primero se agrega acá y al contrato, y recién después se envía.

---

## 1. Estado real de la cobertura

El documento de arquitectura (§4.1) propone un contrato con features de ML —`tasa_entrega_30d`, `tiempo_promedio_despacho_horas`, `tasa_devolucion_30d`, `saturacion_anuncios`, `margen_neto`—. **Ninguna de esas se produce ni se envía hoy.** El único emisor real es [`data_analyst_webhook_sender.py`](../../../../dropshipper-lab/data_analyst_webhook_sender.py) con un CSV de perfil de Userpilot.

Por eso el contrato v1 declara solo lo que existe. Declarar campos que nadie manda daría cobertura falsa: el schema pasaría verde y el feature store quedaría vacío en las columnas que de verdad alimentan el score.

| Grupo | Variables | Estado |
|---|---|---|
| Identidad y perfil | `user_id`, `name`, `email`, `phone`, `country`, `role` | ✅ Se recibe |
| Operación | `real_orders_delivered`, `real_products_created`, `real_dropshipper_clients`, `dias_en_activarse`, `web_sessions`, `es_activo_30d` | ✅ Se recibe |
| Comunidad / comercial | `referred_by`, `belong_to_community`, `owner_of_community` | ✅ Se recibe |
| Encuesta de onboarding | `survey_*` (8 campos) | ✅ Se recibe |
| Telemetría | `device_type`, `os`, `browser`, `browser_language`, fechas | ✅ Se recibe |
| **Logística y confianza** | `tasa_entrega_30d`, `tiempo_promedio_despacho_horas`, `tasa_devolucion_30d` | ❌ **Pendiente de Data** |
| **Economía del producto** | `margen_neto`, `costo_flete_promedio_regional`, `comision_dropi` | ❌ **Pendiente de Data** |
| **Saturación publicitaria** | `anunciantes_activos`, `saturacion` | ❌ **Pendiente (Apify)** |
| **Preferencia declarada** | vector de swipes de Gali/ExpoWinners | ❌ **Pendiente (Fase 3)** |

Sin los tres primeros bloques pendientes, el score $Score_{D,P}$ de §5 del documento **no se puede calcular**: tres de sus cuatro factores dependen de datos que nadie produce todavía.

---

## 2. Variables recibidas hoy — fórmula canónica

`event_timestamp` = el corte al que se refiere la fila. Todas las ventanas (`30d`, etc.) se cuentan **hacia atrás desde `event_timestamp`**, nunca desde `now()`. Contar desde `now()` en la app y desde el corte en R es la forma más común de introducir skew.

| Variable | Tipo en el contrato | Fórmula canónica | Notas |
|---|---|---|---|
| `user_id` | string, obligatorio | `users.id` de Dropi, como texto | Se acepta numérico y se normaliza a string. Es el `entity_id` del log |
| `real_orders_delivered` | entero ≥ 0 | `count(orders)` con `status='ENTREGADO'`, **lifetime**, no ventana móvil | Es acumulado, no mensual. No confundir con `ordenes_mes_propias` |
| `real_products_created` | entero ≥ 0 | `count(products)` creados por el usuario, lifetime | |
| `real_dropshipper_clients` | entero ≥ 0 | `count(distinct orders.user_id)` con `supplier_id = user_id` | Solo tiene sentido para rol Supplier |
| `dias_en_activarse` | entero ≥ 0 | `fecha_primera_orden − signed_up`, en días | Es **TTFO** (activación bruta). El TTV (activación neta, primera orden *entregada*) **no se recibe** y es la métrica que predice retención |
| `es_activo_30d` | booleano | ¿tuvo ≥ 1 orden en los 30 días previos a `event_timestamp`? | Ver §3: hoy no está confirmado el criterio exacto de Data |
| `web_sessions` | entero ≥ 0 | sesiones registradas por Userpilot, lifetime | |
| `tipo_proveedor` | string libre | — | **Taxonomía en disputa, ver §3** |
| `billing_information`, `verified` | booleano | flags de estado de cuenta | Acepta `true/1/si/yes` y `false/0/no` |
| `email` | string sin validar formato | — | A propósito: es PII de paso, no una feature. Bloquear un lote entero por un correo mal escrito cuesta más de lo que protege |
| fechas | ISO 8601 como string | — | Se guardan como string, no como `Date`, para que el JSONB sea idéntico a lo que se hasheó |

---

## 3. Las tres ambigüedades abiertas

Están acá porque afectan directamente al modelo, y ninguna se resuelve leyendo código.

### 3.1 `tipo_proveedor` tiene tres taxonomías encima

| Origen | Valores | Qué mide |
|---|---|---|
| El documento de arquitectura §4.1 | Iniciando · Creciendo · Consolidando · Pre-Escalando · Escalando | **Madurez operativa** (por `ordenes_mes_propias`) |
| El emisor real de Miguel | Explorador… | **Nivel de Leyendas** (gamificación) |
| La columna en Supabase | VERIFICADO · PREMIUM · `" -"` · null | **Tipo de proveedor** (comercial) |

Tres cosas distintas en un solo campo. Por eso v1 lo acepta como **string libre**: congelar el enum del documento rechazaría el único payload real que existe. El modo observador del PR 3 registra la distribución real de valores y con esa evidencia se decide si son uno, dos o tres campos separados en v2.

### 3.2 `corte_timestamp` no llega

Data no envía el corte al que corresponden las métricas. Cuando falta, la API usa la hora de ingesta y marca la fila con `_timestamp_suplido: true` dentro del payload.

Mientras eso pase, el point-in-time join **no distingue** una métrica del 1 de septiembre cargada tarde de una del 3. Es una degradación conocida y acotada del Criterio 1, no un bug: la marca permite excluir esas filas del entrenamiento. **Pasa a campo obligatorio en v2** — es el pedido más importante a Miguel.

### 3.3 `es_activo_30d` no tiene definición verificada

Llega como booleano ya calculado por Data. No sabemos si "activo" significa ≥1 orden creada, ≥1 entregada, o sesión en la plataforma. Recibir un booleano precalculado sin su fórmula **es** el training-serving skew: R no puede reproducirlo.

Dos salidas, la segunda es la buena: (a) Miguel documenta la fórmula acá, o (b) dejamos de recibir el booleano y recibimos `ordenes_ultimos_30d` como entero, calculando el umbral de este lado. La (b) elimina la ambigüedad de raíz.

---

## 4. Contrato del hash (no tocar sin cambiar `contract_version`)

`event_hash = sha256(serializarCanonico(payload))`, donde `serializarCanonico`:

1. Ordena las claves alfabéticamente en **todos** los niveles.
2. Elimina las propiedades `undefined`.
3. Conserva el orden de los arreglos.
4. Serializa con `JSON.stringify` por valor escalar.

DuckDB y R tienen que reproducir exactamente esto para poder deduplicar del lado offline. Cualquier cambio en la función es un **cambio de versión de contrato**, no un refactor.

---

## 5. Cómo se agrega una feature nueva

1. Se escribe la fila en la tabla de §2 con su fórmula canónica.
2. Se agrega el campo al `SellerMetricsPayloadSchema`.
3. Se corre `node scripts/validar-contrato-seller-success.mjs`.
4. Si el significado de un campo existente cambia → sube `contract_version`. Nunca se reinterpreta el histórico.
