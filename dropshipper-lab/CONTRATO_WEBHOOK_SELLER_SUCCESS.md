# Contrato de envío de data — Webhook Célula Seller Success

> **Para:** Miguel Ángel (Data Analyst)
> **De:** Santiago Herrera (PM Seller Success)
> **Versión del contrato:** `v1` · 3 de septiembre de 2026
> **Endpoint en código:** [`hub/src/app/api/webhooks/seller-success/route.ts`](../hub/src/app/api/webhooks/seller-success/route.ts)

Este documento es todo lo que necesitas para enviarnos la data de sellers. Si algo acá no coincide con lo que ves al probar, avísame — el documento manda.

---

## 1. Cómo conectarse

| | |
|---|---|
| **URL** | `https://<dominio-del-hub>/api/webhooks/seller-success` |
| **Método** | `POST` |
| **Content-Type** | `application/json` |
| **Autenticación** | Header `x-api-key: <TOKEN>` (también sirve `Authorization: Bearer <TOKEN>`) |

El token te lo paso yo por canal privado. **No lo escribas en el script ni lo subas a ningún repo** — léelo de una variable de entorno.

### Probar que estás conectado

Un `GET` a la misma URL no requiere token y responde el estado del endpoint:

```bash
curl https://<dominio-del-hub>/api/webhooks/seller-success
```

Debe responder `{"status":"active", ...}`. Si responde otra cosa, avísame antes de intentar el POST.

---

## 2. Formato del envío

Un arreglo JSON de objetos. Un objeto = un seller.

```json
[
  {
    "user_id": "671121",
    "corte_timestamp": "2026-09-01T00:00:00Z",
    "name": "Sandry Rodelo",
    "email": "sandryrodelo07@gmail.com",
    "country": "Colombia",
    "real_orders_delivered": 393,
    "real_products_created": 12,
    "dias_en_activarse": 14,
    "es_activo_30d": true,
    "tipo_proveedor": "Explorador"
  }
]
```

También aceptamos `{"records": [...]}`, `{"sellers": [...]}` o `{"data": [...]}`.

**Manda lotes de máximo 500 registros por POST.** El endpoint hoy escribe todo el arreglo en una sola operación; con lotes muy grandes se cae entero y no queda nada. Con 500 por request, si uno falla solo pierdes ese lote.

---

## 3. Los campos

`user_id` es el único obligatorio. Todo lo demás es opcional — manda lo que tengas.

### Identidad

| Campo | Tipo | Ejemplo | Nota |
|---|---|---|---|
| `user_id` | texto | `"671121"` | **Obligatorio.** El `users.id` de Dropi. Acepta número o texto |
| `name` | texto | `"Sandry Rodelo"` | |
| `email` | texto | `"sandry@gmail.com"` | |
| `phone` | texto | `"3001234567"` | |
| `country` | texto | `"Colombia"` | Nombre completo del país |
| `role` | texto | `"DROPSHIPPER"` | |

### Corte temporal — **el campo más importante que hoy no llega**

| Campo | Tipo | Ejemplo |
|---|---|---|
| `corte_timestamp` | ISO 8601 | `"2026-09-01T00:00:00Z"` |

Es **la fecha a la que se refieren las métricas de esa fila**, no la fecha en que corres el script. Sin este campo no podemos distinguir un dato del 1 de septiembre cargado tarde de uno del 3, y eso rompe cualquier análisis histórico o modelo predictivo. Hoy no lo envías: es el pedido número uno.

### Métricas operativas

| Campo | Tipo | Ejemplo | Definición que asumimos |
|---|---|---|---|
| `real_orders_delivered` | entero ≥ 0 | `393` | Órdenes en estado `ENTREGADO`, acumulado histórico (no del mes) |
| `real_products_created` | entero ≥ 0 | `12` | Productos creados por el usuario, acumulado |
| `real_dropshipper_clients` | entero ≥ 0 | `4` | Dropshippers distintos que le compran (solo aplica a rol Supplier) |
| `dias_en_activarse` | entero ≥ 0 | `14` | Días entre registro y primera orden **creada** (TTFO) |
| `web_sessions` | entero ≥ 0 | `27` | Sesiones registradas por Userpilot |
| `es_activo_30d` | booleano | `true` | **Ver la pregunta abierta abajo** |

### Comunidad y gestión comercial

| Campo | Tipo | Nota |
|---|---|---|
| `referred_by` | texto | ⚠️ Hoy este campo mezcla nombres de KAM con IDs numéricos de referido. Dime cuál de los dos estás mandando |
| `belong_to_community` | texto | Nombre de la comunidad |
| `owner_of_community` | texto | Líder de la comunidad |

### Encuesta de onboarding

`survey_brand_sales`, `survey_volume`, `survey_stage`, `survey_source`, `survey_purpose`, `survey_role`, `survey_sell_pref`, `survey_shipping_pref` — todos texto libre.

### Estado de cuenta

| Campo | Tipo |
|---|---|
| `billing_information` | booleano |
| `verified` | booleano |
| `saldo_promedio_fletes` | número ≥ 0 |

### Segmentación

| Campo | Tipo | Nota |
|---|---|---|
| `tipo_proveedor` | texto | ⚠️ Ver la pregunta abierta abajo |

### Telemetría y fechas

`device_type`, `os`, `browser`, `browser_language` — texto.
`fecha_activacion`, `first_seen`, `last_seen`, `signed_up`, `created_at` — ISO 8601.

---

## 4. Reglas de formato (importan más de lo que parece)

**Números.** Si vienen del CSV como texto (`"393"`) está bien, los convertimos. Lo que **no** aceptamos:

| Valor | Qué pasa | Por qué |
|---|---|---|
| `"1,234"` | ❌ Rechazado | El separador de miles rompe la conversión |
| `"1.5"` en un campo entero | ❌ Rechazado | |
| `-5` | ❌ Rechazado | No existen órdenes negativas |
| `"abc"` | ❌ Rechazado | |
| `""` (vacío) | ✅ Se trata como "no informado" | **No** se convierte en 0 |

Ese último caso es el más peligroso y por eso lo tratamos así: un `""` convertido en `0` haría que un seller activo aparezca como huérfano. Si un seller de verdad tiene cero, manda `0`. Si no tienes el dato, manda `""` o no mandes el campo.

**Booleanos.** Aceptamos `true`/`false`, `1`/`0`, `"si"`/`"no"`, `"yes"`/`"no"`. Cualquier otra cosa se rechaza — no asumimos `false` por descarte.

**Fechas.** ISO 8601: `2026-09-01T00:00:00Z` o `2026-09-01`.

---

## 5. Nombres de columna que hay que dejar de usar

Hoy el endpoint traduce estos nombres por debajo, pero **esa traducción se va a eliminar**. Renómbralos en tu export y te ahorras el corte:

| Deja de mandar | Manda |
|---|---|
| `id`, `userId` | `user_id` |
| `nombre`, `seller_name` | `name` |
| `correo` | `email` |
| `telefono`, `celular` | `phone` |
| `pais` | `country` |
| `rol` | `role` |
| `total_orders`, `ordenes`, `ordenes_entregadas` | `real_orders_delivered` |
| `productos`, `productos_creados` | `real_products_created` |
| `ttv_dias`, `dias_activacion` | `dias_en_activarse` |
| `nivel_leyendas`, `segmento` | `tipo_proveedor` |
| `kam`, `kam_asignado` | `referred_by` |
| `comunidad`, `comunidad_nombre` | `belong_to_community` |
| `lider_comunidad` | `owner_of_community` |
| `categoria`, `categoria_producto` | `survey_brand_sales` |
| `volumen_declarado` | `survey_volume` |
| `etapa_onboarding` | `survey_stage` |
| `origen_registro` | `survey_source` |
| `billing`, `datos_facturacion` | `billing_information` |

Cuando activemos la validación estricta, un nombre no reconocido devuelve **HTTP 422** con el campo exacto y el nombre correcto — no vas a tener que adivinar.

---

## 6. Respuestas del endpoint

| Código | Significa | Qué hacer |
|---|---|---|
| `200` | Recibido. El cuerpo trae `records_processed` | Verifica que el número coincida con lo que enviaste |
| `400` | Payload vacío o ningún registro traía `user_id` | Revisa el export |
| `401` | Token inválido | Revisa el header |
| `422` | Un campo violó el contrato *(cuando activemos modo estricto)* | El cuerpo dice cuál y qué esperaba |
| `501` | El endpoint no tiene el secreto configurado | Avísame — es de nuestro lado |

---

## 7. Ejemplo listo para probar

```bash
curl -X POST "https://<dominio-del-hub>/api/webhooks/seller-success" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $SELLER_SUCCESS_WEBHOOK_KEY" \
  -d '[{
    "user_id": "671121",
    "corte_timestamp": "2026-09-01T00:00:00Z",
    "name": "Sandry Rodelo",
    "country": "Colombia",
    "real_orders_delivered": 393,
    "dias_en_activarse": 14,
    "es_activo_30d": true
  }]'
```

Ya existe un script de Python que hace el envío desde un CSV:
[`dropshipper-lab/data_analyst_webhook_sender.py`](./data_analyst_webhook_sender.py)

```bash
export SELLER_SUCCESS_WEBHOOK_URL="https://<dominio-del-hub>/api/webhooks/seller-success"
export SELLER_SUCCESS_WEBHOOK_KEY="<el-token>"
python3 data_analyst_webhook_sender.py mi_export.csv
```

⚠️ Ese script hoy manda los nombres viejos (`pais`, `total_orders`, `nivel_leyendas`). Hay que actualizarlo a los canónicos de la sección 5 antes de usarlo en serio.

---

## 8. Dos preguntas que necesito que respondas

**1. ¿Qué significa exactamente `es_activo_30d`?**
Nos llega como booleano ya calculado, pero no sabemos con qué regla: ¿al menos una orden *creada* en 30 días? ¿*entregada*? ¿una sesión en la plataforma? Sin la fórmula no podemos reproducir el número del lado del análisis, y eso significa que un modelo entrenado con esa variable aprende algo que no podemos verificar.

*Propuesta:* en vez del booleano, manda `ordenes_ultimos_30d` como entero y el umbral lo ponemos nosotros. Así la definición queda de un solo lado y deja de haber ambigüedad.

**2. ¿Qué taxonomía estás mandando en `tipo_proveedor`?**
Hoy ese campo tiene tres cosas distintas mezcladas:

- Niveles de **Leyendas** (Explorador…) — gamificación
- Niveles de **madurez operativa** (Iniciando, Creciendo, Consolidando, Pre-Escalando, Escalando) — por órdenes/mes
- Tipo **comercial** (VERIFICADO, PREMIUM, PREMIUM EXCLUSIVO, ESTÁNDAR, PARETO 360)

Si estás mandando más de una, deberían ser campos separados. Dime cuál es la tuya y lo partimos.

---

## 9. Lo que hacemos de nuestro lado

- Validamos cada lote contra este contrato y te reportamos exactamente qué campo falló, si falla.
- Guardamos cada envío como un **evento histórico**, no pisando el anterior: así se puede reconstruir cómo se veía un seller en cualquier fecha pasada.
- Si reenvías el mismo lote por un reintento, no se duplica.
