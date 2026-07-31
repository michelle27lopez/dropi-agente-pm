# Estados de Dropi — contexto completo para homologación

> Documento autocontenido. Todo lo que hay acá salió de (a) la API real de Dropi, (b) una
> auditoría de solo-lectura sobre una base con 133.555 órdenes y 52.636 guías reales de
> Colombia (2026-07-12), y (c) los dos documentos de trabajo previos (el macro-proceso en PDF
> de 24 estados y el Excel de homologación de 576 mapeos).
>
> No asume ningún sistema en particular: sirve como base para construir la homologación desde
> cero en cualquier repo.

---

## 0. Resumen ejecutivo — las 7 cosas que hay que saber antes de diseñar

1. **No existe "el estado de una orden Dropi". Existen tres fuentes distintas**, y sólo dos de
   ellas son homologables. Confundirlas es el error más caro del diseño (§1).
2. **El vocabulario real es chico.** El catálogo publica ~500 estados por país, pero en tráfico
   real circulan **~50**. El 46% del catálogo tiene **cero** ocurrencias históricas (§4).
3. **El histórico de estados NO viene en el listado de órdenes.** Sólo 1,7% de las órdenes
   traen `history[]` desde `myorders/v2`. Para la línea de tiempo hay que pegarle al **detalle**,
   orden por orden (§3.4).
4. **`servientrega_movements[]` no es homologable.** Es texto libre del carrier — a veces un
   código numérico (`"4"`), a veces un párrafo con coordenadas GPS. No lo trates como estado (§3.5).
5. **Hay 6 colisiones reales**: el mismo estado crudo significa cosas distintas según la
   transportadora. Eso decide si el modelo necesita el eje `transportadora` o no (§6).
6. **Multi-país: el BFF (`api-v2`) responde en todos los países; el legacy no.** En México el
   endpoint legacy de órdenes da **403** y sólo funciona el BFF (§2).
7. **Cualquier estado nuevo debe declarar qué implica físicamente** (¿el paquete salió de la
   bodega? ¿la orden está cerrada?). Una taxonomía que sólo define nombres bonitos no es una
   homologación, es una lista (§7).

---

## 1. El modelo real: tres fuentes de estado, dos vocabularios

Una orden de Dropi tiene el estado repartido en tres lugares. **Tienen vocabularios distintos y
cadencias distintas.**

```
┌─────────────────────────────────────────────────────────────────────────┐
│  A. ESTADO DE LA ORDEN         →  lo emite DROPI                        │
│     order.status  +  order.history[].status                             │
│     Vocabulario: ~15 en uso     Ej: PENDIENTE CONFIRMACION, PENDIENTE,  │
│                                     GUIA_GENERADA, CANCELADO, ENTREGADO │
│     ✅ HOMOLOGABLE — es el ciclo de vida comercial del pedido           │
├─────────────────────────────────────────────────────────────────────────┤
│  B. ESTADO DE LA GUÍA          →  lo emite la TRANSPORTADORA            │
│     guide.status (manifiesto / consultarhistoricoguia)                  │
│     Vocabulario: ~34 en uso, ~500 en catálogo                           │
│                                 Ej: ADMITIDA, EN PROCESAMIENTO,         │
│                                     CENTRO ACOPIO, EN REPARTO, NOVEDAD  │
│     ✅ HOMOLOGABLE — es el ciclo de vida físico del paquete             │
├─────────────────────────────────────────────────────────────────────────┤
│  C. MOVIMIENTOS DEL CARRIER    →  narrativa cruda de la transportadora  │
│     order.servientrega_movements[].nom_mov                              │
│     ❌ NO HOMOLOGABLE — texto libre, ver §3.5                           │
└─────────────────────────────────────────────────────────────────────────┘
```

**Por qué importa:** el PDF de macro-proceso (24 estados, 6 fases) describe **A**. El Excel de
576 mapeos, organizado por transportadora, describe **B**. No se contradicen — **cubren mitades
distintas del mismo flujo**. Cualquier modelo que los mezcle sin declararlo va a producir
contradicciones fantasma (p. ej. "Guía generada no está en la propuesta" — claro, ninguna
transportadora emite ese estado; lo emite Dropi).

Además, **A y B avanzan a ritmos distintos**: la orden puede seguir en `GUIA_GENERADA` mientras
la guía ya va por `EN REPARTO`. La UI final tiene que fusionar las dos líneas de tiempo, no
elegir una.

### 1.1 La cabecera se atrasa respecto de su propio historial

Caso real (orden `80006510`): el campo `status` de cabecera decía `PREPARADO PARA
TRANSPORTADORA` mientras el `history[]` de la MISMA respuesta ya tenía `RECOGIDO POR DROPI`.

**Regla:** el estado efectivo es la entrada de `history[]` con el **`id` más alto** (los ids son
monótonos), no el `status` de cabecera. Pero con un resguardo: si la cabecera **no aparece** en
el historial, quedate con la cabecera — señal de que el historial viene incompleto y no querés
inferir un retroceso.

---

## 2. La API de Dropi — hosts, auth y multi-país

### 2.1 Dos hosts por país

Cada país corre su propia instancia completa. El schema de request/response es **idéntico**; sólo
cambian los valores (moneda, transportadoras, estados).

| | Host | Para qué |
|---|---|---|
| **Legacy** | `https://api.dropi.{tld}/api` | login, `helpers/*`, `users`, cambios de estado masivos, mobile |
| **BFF** | `https://api-v2.dropi.{tld}/bff` | **lista y detalle de órdenes** (`/orders/myorders/v2`) |
| api-v2 raw | `https://api-v2.dropi.{tld}` | endpoints de producto/stock (`produit`) |
| Frontend | `https://app.dropi.{tld}` | valor de `Origin` / `Referer` (el WAF los valida) |
| Assets | `https://d39ru7awumhhs2.cloudfront.net` | PDFs de guía e imágenes — **dominio único**, cambia el prefijo por país |

### 2.2 Tabla de países

| País | `tld` | `x-host` | Prefijo de assets | TZ | Moneda |
|---|---|---|---|---|---|
| Colombia | `co` | `co` | `colombia` | America/Bogota | COP |
| México | `mx` | `mx` | `mexico` | America/Mexico_City | MXN |
| Ecuador | `ec` | `ec` | `ecuador` | America/Guayaquil | USD |
| Perú | `pe` | `pe` | `peru` | America/Lima | PEN |
| Chile | `cl` | `cl` | `chile` | America/Santiago | CLP |
| Argentina | `ar` | `ar` | `argentina` | America/Argentina/Buenos_Aires | ARS |
| Panamá | `pa` | `pa` | `panama` | America/Panama | USD |
| Guatemala | `gt` | `gt` | `guatemala` | America/Guatemala | GTQ |
| **Paraguay** | **`com.py`** | `py` | `paraguay` | America/Asuncion | PYG |

> ⚠️ **Paraguay es la excepción**: el TLD es `com.py` (`api.dropi.com.py`), pero el header
> `x-host` sigue siendo `py`. También acepta `com.py`.

> ⚠️ **En México el endpoint legacy de órdenes devuelve 403.** Sólo responde el BFF. Como el BFF
> funciona en *todos* los países probados (CO, MX, EC, AR, PE, CL, GT, PY, PA), **la regla simple
> es: órdenes siempre por BFF.**

> ⚠️ **`white_brand_id` se reusa entre países** (brand `1` = Dropi en CO, MX, PA, AR…). **El país
> NO se puede derivar de la marca** — tiene que venir de la configuración de la cuenta.
> Las cuentas de marca blanca (`white_brand_id != 1`) **sólo** responden en el BFF; el legacy les
> da 403.

### 2.3 Login

```http
POST https://api.dropi.{tld}/api/login
Content-Type: application/json

{
  "email": "...",
  "password": "...",
  "white_brand_id": 1,
  "brand": "",
  "ipAddress": "181.49.123.45",
  "otp": null
}
```

- Devuelve `{ isSuccess, token, ... }`. **El token dura ~4 horas.**
- Puede responder pidiendo **2FA** (`status: "2fa_required"` + `challenge_token` + lista de
  contactos). En ese caso hay que reenviar el login con el `otp`. Un servicio automatizado no
  puede resolver esto solo: hay que marcar la cuenta y pedir re-auth manual.
- La **API mobile** es otro login distinto (`/api/mobile/login`), con header
  `dropi-app-api-key` y sin `x-authorization`. Devuelve un token propio, también de ~4h.

### 2.4 Headers — el WAF valida la calca de navegador

Dropi rechaza (403) las requests que no parecen venir del frontend. Hay que mandar el set completo:

```http
X-Authorization: Bearer {token}        # ← mayúscula X. Este es el que autentica.
Authorization:   Bearer {token}        # ← SOLO para el BFF (además del anterior)
x-host:          co                    # ← SOLO para el BFF. País en minúscula.

Accept: application/json, text/plain, */*
Accept-Encoding: gzip, deflate, br, zstd
Accept-Language: es-ES,es;q=0.9
Cache-Control: no-cache
Pragma: no-cache
Origin:  https://app.dropi.co
Referer: https://app.dropi.co/
Sec-Ch-Ua: "Google Chrome";v="143", "Chromium";v="143", "Not A(Brand";v="24"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "macOS"
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-site
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ...
x-captcha-token:
Priority: u=1, i
```

**Trampa:** el header de auth es `X-Authorization`, no `Authorization`. El BFF quiere **los dos**.

### 2.5 Dos envelopes distintos

El legacy y el BFF responden con formas diferentes. Hay que normalizar.

```jsonc
// Legacy (api.dropi.{tld})
{ "isSuccess": true, "status": 200, "message": "...", "objects": [...], "count": 123 }

// BFF (api-v2.dropi.{tld}/bff)
{ "is_succesfull": true,           // ← sic, con el typo. Otros endpoints api-v2
  "status_code": 200,              //    usan "is_successful" (bien escrito).
  "status_reason": "...",          //    Soportá las dos grafías.
  "data": { "objects": [...] } }
```

---

## 3. Los endpoints que importan

### 3.1 Catálogo de estados de un país — `getStatusesByCountry`

**La fuente autoritativa del vocabulario.** Es lo primero que hay que consultar.

```http
GET https://api.dropi.{tld}/api/helpers/getStatusesByCountry?country=
```

- `country=` **vacío** significa "los estados de *esta* instancia" — el host ya define el país.
- Devuelve `{ isSuccess, objects: [...] }` donde cada objeto tiene `id` y `name`.
- **Dato clave:** los objetos que traen la propiedad `company` son **estados de transportadora**;
  los que no la traen son **estados de orden**. Esa es la forma de separar los dos vocabularios
  del §1 directamente desde el catálogo.

Tamaño del catálogo por país (medido 2026-07-11):

| País | Estados publicados |
|---|---|
| México | 193 |
| Paraguay | 99 |
| Ecuador | 94 |
| Chile | 73 |
| Perú | 65 |
| Panamá | 55 |
| Guatemala | 21 |
| Argentina | 19 |
| Colombia | ~500 (el más grande, por la cantidad de transportadoras) |

> **Los estados NO colisionan entre países.** Se revisaron 205 estados de 7 países: ningún texto
> significa cosas distintas según el país. Un `PENDIENTE` es un `PENDIENTE` en CO y en MX. Esto
> significa que **el modelo de homologación no necesita un eje `país`** — un catálogo global
> alcanza. (Sí puede necesitar un eje `transportadora`; ver §6.)

### 3.2 Listar órdenes — `myorders/v2`

```http
GET https://api-v2.dropi.{tld}/bff/orders/myorders/v2
```

Todos los parámetros son **obligatorios** aunque vayan vacíos. Omitir uno cambia el
comportamiento en silencio.

| Param | Valor | Nota |
|---|---|---|
| `exportAs` | `orderByRow` | **requerido** |
| `orderBy` | `id` | |
| `orderDirection` | `desc` | |
| `textToSearch` | `` (vacío) | |
| `status` | `null` o el estado | literal `"null"`, string |
| `supplier_id` | id numérico o `null` | ⚠️ ver abajo |
| `user_id` | `null` | |
| `from` / `until` | `YYYY-MM-DD` | **máximo 90 días de ventana** |
| `filter_date_by` | `FECHA DE CREADO` \| `FECHA DE CAMBIO DE ESTATUS` | ⚠️ ver §3.3 |
| `radio_downloaded` | `IMPRESAS Y NO IMPRESAS` | o `IMPRESAS` / `NO IMPRESAS` |
| `filter_product` | `undefined` o id | |
| `tag_id` | `` (vacío) | **requerido** |
| `warranty` | `false` | `true` incluye órdenes de garantía |
| `seller` | `undefined` | **requerido** |
| `invoiced` | `null` | **requerido** |
| `result_number` | `1001` | ver paginación |
| `start` | `0`, `1000`, `2000`… | **offset, NO número de página** |
| `warehouse_id` | id | opcional; **uno a la vez** — no acepta lista |

**Trampas de paginación:**
- `start` es un **offset**, no una página.
- `result_number=1001` es un centinela: la página real trae hasta **1000** filas. Si volvés
  1000+, hay más páginas.
- **`count` puede venir `null`.** No confíes en él para decidir cuántas páginas pedir; usá el
  largo del array `objects`.

**Trampa de `supplier_id` (silenciosa y cara):**
- Cuentas de tipo **SUPPLIER** o **SELLER**: hay que mandar el **id numérico** de la cuenta.
  Si mandás `null`, la API devuelve **0 órdenes** aunque el panel muestre pedidos.
- Cuentas **DROPSHIPPER** o **LOGISTIC**: `null` (la visibilidad la define el token).

### 3.3 El eje de fecha: ninguno cubre solo

Este es un detalle que cuesta caro descubrir en producción.

| `filter_date_by` | Qué trae | Qué **pierde** |
|---|---|---|
| `FECHA DE CREADO` | órdenes creadas en la ventana | las órdenes **viejas que cambiaron de estado ahora** (Dropi no expone `updated_at`) |
| `FECHA DE CAMBIO DE ESTATUS` | órdenes que cambiaron de estado en la ventana | las órdenes que **nunca cambiaron de estado** (la `PENDIENTE` inicial) |

**"La creación es el primer evento de estado" es FALSO en Dropi.** Una orden que se creó y nunca
cambió de estado no aparece en el eje de cambio-de-estatus. En una muestra real: 48 de 102
órdenes pendientes eran invisibles por ese eje.

**Consecuencia de diseño:** si querés cobertura completa tenés que **alternar los dos ejes** (o
hacer la unión de ambos). Y si alternás por tick, el próximo eje debe salir del *último eje
realmente usado*, no de una paridad de reloj — un tick salteado se lleva su eje con él.

### 3.4 Detalle de una orden (**acá está el histórico**)

```http
GET https://api-v2.dropi.{tld}/bff/orders/myorders/v2/{order_id}?warranty=false
```

> 🔴 **El listado NO trae el histórico.** Medido sobre 133.555 órdenes reales: sólo **1,7%**
> traían `history[]` desde el listado, contra **78%** que traían `servientrega_movements[]`.
> **Si necesitás la línea de tiempo de estados, tenés que pegarle al detalle, orden por orden.**
> Presupuestá ese costo desde el día uno: no hay un endpoint de histórico masivo.

Claves del objeto de detalle:

```
id  status  created_at  type  country
name  surname  phone  dir  city  state  zip_code  colonia    ← cliente (PII)
shipping_guide  shipping_company  distribution_company{id,name,is_veloces}
warehouse{...}  warehouse_id     supplier{...}  supplier_id
shop{...}  shop_id  shop_order_number                        ← trazabilidad al canal de venta
user{...}  user_id                                           ← el dropshipper
orderdetails[]                                               ← líneas: product, variation, quantity, price
history[]                                                    ← ★ LÍNEA DE TIEMPO DE ESTADOS
servientrega_movements[]                                     ← narrativa del carrier (§3.5)
monetary_data{}  total_order  shipping_amount  discounted_amount
indemnized  is_validated  has_validated_historial  novedad_servientrega
```

**`history[]` — la estructura que importa:**

```jsonc
{
  "id": 595398664,                        // ★ monótono. El más alto = el evento más reciente.
  "order_id": 76611663,
  "status": "PENDIENTE CONFIRMACION",     // ★ el estado. ESTO es lo homologable.
  "created_at": "2026-05-26T18:29:36",    // ⚠️ naive — sin timezone. Ver §5.
  "user": { "id": 764279, "name": "...", "role_user": { "name": "DROPSHIPPER" } },
  "user_id": 764279,
  "notes": null,
  "novedad_servientrega": null,
  "usuario_chatcenter": null
}
```

Secuencia típica: `PENDIENTE CONFIRMACION` → `PENDIENTE` → `GUIA_GENERADA` → …

### 3.5 `servientrega_movements[]` — **no es un estado**

```jsonc
{ "id": 655014981, "nom_mov": "4", "created_at": "2026-07-11T12:29:00",
  "key_base_data": 81925797, "image_evidence": null }
```

El campo `nom_mov` es **texto libre del carrier**, y su forma cambia radicalmente:

| Carrier | Ejemplo real de `nom_mov` |
|---|---|
| SUPPLI-EXPRESS | `"4"`, `"8"`, `"3"`, `"2"` — códigos numéricos sin diccionario público |
| ENVIA | `"GENERADA EN CALI"` |
| TCC | `"MERCANCÍA NO HA LLEGADO A CENTRO DE OPERACIÓN DESTINO TCC - FALLAS DE VEHÍCULO Novedad Rutas Nacionales, Viaje UNIGIS: 2489105, Motor - Conductor informa que el móvil se le estaba apagando… Latitud: 6.0265114684276, Longitud: -75.170569591426"` |

**No intentes homologar `nom_mov`.** Sirve para: (a) mostrar la narrativa cruda al usuario, y
(b) **fechar** eventos (el `created_at` del primer movimiento de devolución es la fecha real en
que arrancó la devolución — más confiable que cualquier otra columna). Nada más.

> ⚠️ **Los movimientos vienen duplicados.** Se ven 5 movimientos con el mismo texto y timestamps
> a segundos de distancia. Deduplicá por `(nom_mov, created_at)` antes de mostrar.
>
> ⚠️ **Mojibake en TCC.** El texto llega con doble-encoding UTF-8 (`mÃ³vil` en vez de `móvil`).
> Si te importa mostrarlo bien, hay que re-decodificar (`latin-1` → `utf-8`).

### 3.6 Histórico de una guía

```http
GET https://api.dropi.{tld}/api/orders/consultarhistoricoguia?shipping_guide={guia}
```

Devuelve el rastreo de la transportadora: `estado`, `ciudad_origen`, `ciudad_destino`,
`fecha_entrega`, `hora`, `fec_recoleccion`, `fec_despacho`, `fec_bodegadestino`, `fec_reparto`,
`novedad`, `mensaje_novedad`, `imagen`.

Es el camino para el vocabulario **B** (estados de guía) sin pasar por el manifiesto.

### 3.7 Escritura de estados

```http
POST https://api.dropi.{tld}/api/orders/myorder/masive
[ { "id": 66750477, "status": "GUIA_GENERADA", "reasonComment": "" } ]
```

El mismo endpoint sirve para `GUIA_GENERADA` (generar guía), `GUIA_ANULADA` (anular) y
`RECHAZADO` (rechazar).

Respuesta: `objects[]` (las que salieron bien, con `shipping_guide`, `shipping_company`,
`guia_urls3`) **y `error_guias_generadas[]`** (las que fallaron, con `order_id` + `error`).

> ⚠️ **Es parcialmente exitoso.** `isSuccess: true` a nivel batch **no** significa que todas las
> órdenes se procesaron. Hay que leer `error_guias_generadas[]` siempre.
>
> ⚠️ **El timeout miente.** Si el POST hace timeout, Dropi **igual suele haber generado las
> guías**. Reintentar cae en "ya generada" y devuelve la URL existente. Nunca asumas que un
> timeout = no pasó nada.

### 3.8 PDF de la guía

Dropi expone `guia_urls3` **sólo mientras la orden está en `GUIA_GENERADA`**. Cuando avanza
(`EN PROCESAMIENTO`, `DESPACHADA`, `ENTREGADO`…), **el campo desaparece** — pero el PDF sigue
existiendo, con path determinista:

```
https://d39ru7awumhhs2.cloudfront.net/{prefijo_pais}/guias/{carrier}/ORDEN-{order_id}-GUIA-{shipping_guide}.pdf
```

- `{prefijo_pais}` = `colombia` | `mexico` | … (ver §2.2)
- `{carrier}` = el `shipping_company` en minúscula, **con una excepción conocida**:
  `envia` → carpeta `servientrega`.
- **Excepción MX:** AMPM (99minutos) **no** sirve el PDF por este path (da 403 incluso con la
  URL que la propia API devuelve). Se sirve por otra vía.

---

## 4. Qué estados existen de verdad (datos reales, no catálogo)

Auditoría sobre 133.555 órdenes y 52.636 guías de Colombia.

### 4.1 El catálogo está inflado ~10×

De ~900 estados catalogados, **el tráfico real toca ~50**. Un 46% del catálogo (los estados de
tipo "novedad" de transportadora) tiene **cero ocurrencias en toda la historia** — ni una orden,
ni una guía, ni un evento de historial.

**Implicación de producto:** no gastes esfuerzo homologando a mano 400 strings que nunca
llegaron. Homologá **por volumen**, y dejá que los que no existen caigan en un default
observable.

### 4.2 Estados de GUÍA que sí circulan (top real)

| Guías | Estado crudo | Fase lógica |
|---:|---|---|
| 31.449 | `ENTREGADO` | entrega |
| 3.510 | `EN REPARTO` | última milla |
| 2.524 | `EN BODEGA ORIGEN` | tránsito |
| **2.372** | **`NOVEDAD`** | novedad |
| 1.836 | `RECLAME EN OFICINA` | novedad / retiro en punto |
| 1.259 | `EN BODEGA TRANSPORTADORA` | tránsito |
| 1.223 | `DESPACHADA` | tránsito |
| 1.069 | `PREPARADO PARA TRANSPORTADORA` | pre-tránsito |
| 939 | `EN PROCESAMIENTO` | tránsito |
| 900 | `DEVOLUCION` | devolución |
| 887 | `EN DISTRIBUCION` | tránsito |
| 633 | `RECOGIDO POR DROPI` | recolección |
| 569 | `EN TERMINAL DESTINO` | tránsito |
| 536 | `INTENTO DE ENTREGA` | última milla |
| 535 | `EN BODEGA DROPI` | recolección |
| 340 | `EN REEXPEDICION` | tránsito |
| 280 | `EN DESPACHO` | tránsito |
| 245 | `EN TERMINAL ORIGEN` | tránsito |
| 234 | `NOVEDAD SOLUCIONADA` | novedad resuelta |
| 215 | `ENTREGADO A TRANSPORTADORA` | pre-tránsito |
| 177 | `EN TRANSPORTE` | tránsito |
| 173 | `EN BODEGA DESTINO` | tránsito |
| 164 | `EN ESPERA DE RUTA DOMESTICA` | tránsito |
| 153 | `EN TRASLADO NACIONAL` | tránsito |
| 132 | `TELEMERCADEO` | novedad (contacto al cliente) |
| 75 | `ENTREGADA A CONEXIONES` | tránsito |
| 72 | `REENVÍO` | tránsito |
| 52 | `EN PUNTO DROOP` | retiro en punto |
| 23 | `BODEGA DESTINO` | tránsito |
| 13 | `GUIA_GENERADA` | pre-tránsito |

### 4.3 Volumen de órdenes por fase

| Fase | Órdenes | Estados crudos distintos |
|---|---:|---:|
| Entregado | 73.014 | 1 |
| Cancelado | 18.762 | 2 |
| En tránsito | 18.712 | 37 |
| Devolución | 10.565 | 2 |
| Guía generada | 4.909 | 1 |
| Pendiente | 3.082 | 2 |
| Excepción / novedad | 2.975 | 6 |
| Rechazado | 1.437 | 1 |
| Devolución en proceso | 74 | 2 |

**Lectura:** el 55% de las órdenes terminan entregadas y el 14% canceladas, con **un solo estado
crudo cada una**. Toda la complejidad del vocabulario está concentrada en el tránsito (37
estados) — que es exactamente donde el usuario final menos detalle necesita, y el operador
logístico más.

### 4.4 Transportadoras reales (Colombia)

| Carrier | Guías | Formato del nombre |
|---|---:|---|
| ENVIA | 26.077 | MAYÚSCULAS |
| INTERRAPIDISIMO | 14.763 | MAYÚSCULAS |
| TCC | 6.231 | MAYÚSCULAS |
| COORDINADORA | 5.425 | MAYÚSCULAS |
| VELOCES | 140 | MAYÚSCULAS |

> ⚠️ **Inconsistencia de casing:** el catálogo `getStatusesByCountry` publica el carrier en
> **Title Case** (`Urbano`, `Blue`, `Servientrega`), pero las órdenes y guías reales lo traen en
> **MAYÚSCULAS** (`URBANO`, `STARKEN`, `ENVIA`). Si vas a indexar por transportadora,
> **normalizá el casing en los dos lados** o el match falla siempre y en silencio.
>
> ⚠️ **Los universos no coinciden.** Se vio una orden real de Chile con
> `shipping_company = STARKEN`, carrier que **ni figura** en el catálogo de estados de Chile
> (que sólo lista `Blue` y `Asdelivery`). No asumas que el catálogo es exhaustivo.

---

## 5. Fechas y zonas horarias

- Todos los timestamps de Dropi llegan **naive** (`2026-05-26T18:29:36`, sin offset).
- **Están en la hora local de la instancia del país**, no en UTC y no siempre en hora Colombia.
  Interpretar un timestamp de MX como si fuera de Bogotá corre el instante **1 hora**.
- Argentina tiene historia de DST → **nunca uses un offset fijo**; usá la zona IANA
  (`America/Argentina/Buenos_Aires`).

---

## 6. Las 6 colisiones — la decisión de arquitectura más importante

En el Excel de homologación, **el mismo estado crudo recibe una clasificación distinta según la
transportadora**. Esto es lo que decide si el modelo necesita un eje `transportadora` o le
alcanza con un catálogo global.

| Estado crudo | ENVIA | INTERRAPIDISIMO | TCC | VELOCES |
|---|---|---|---|---|
| `PENDIENTE` | **Por confirmar** | En preparación | — | En preparación |
| `RECHAZADO` | Devolución | **Rechazado** | — | Devolución |
| `INTENTO DE ENTREGA` | — | **En reparto** | — | **Novedad** |
| `MERCANCIA RECOGIDA` | **Recibido transp.** | — | **En tránsito** | — |
| `REEMPLAZADA` | Cancelado | Cancelado | **Excepción** | Cancelado |
| `RECOGIDA FALLIDA` | **En preparación** | **Novedad** | — | — |

**Mi lectura (a validar caso por caso):**

- `RECHAZADO`, `REEMPLAZADA`, `PENDIENTE`, `RECOGIDA FALLIDA` → **huelen a inconsistencia de
  llenado**, no a semántica real. `RECHAZADO` no puede significar "devolución" en un carrier y
  "rechazado" en otro; es la misma cosa vista con dos nombres.
- `INTENTO DE ENTREGA` (¿el paquete está en reparto, o ya falló la entrega?) y
  `MERCANCIA RECOGIDA` (¿ya está en tránsito, o recién la recibió el carrier?) → **podrían ser
  colisiones genuinas**: son estados donde el mismo evento tiene un significado operativo
  distinto según cómo cada transportadora los emite.

**Si las 6 son errores de llenado** → catálogo global, clave = `estado_crudo`. Simple.
**Si aunque sea una es real** → la clave tiene que ser `(transportadora, estado_crudo)` con
fallback global. Más caro, pero es la única forma de no mentir.

**Es una decisión de negocio, no técnica. Hay que resolverla mirando qué emite cada carrier.**

### 6.1 Estados sin propuesta (4)

Quedaron sin clasificar en el Excel:

| Carrier | Estado crudo |
|---|---|
| ENVIA | `CONFIRMADO` |
| INTERRAPIDISIMO | `ARCHIVADAMENOR` |
| INTERRAPIDISIMO | `PEND ING CUSTODIA` |
| VELOCES | `RECOLECCION` |

---

## 7. Lo que le falta a la propuesta actual (y es lo más importante)

La propuesta de 21 estados es una **taxonomía de display**: dice cómo se llama cada cosa. No dice
**qué implica**. Y en logística, cada estado implica hechos físicos y contables:

| Pregunta que todo estado debe responder | Por qué importa |
|---|---|
| **¿El paquete ya salió de la bodega?** | Decide si el inventario se descuenta o no |
| **¿La orden está cerrada?** | Decide si sigue contando como "pendiente" |
| **¿Es un estado terminal o reversible?** | Una novedad se resuelve; una entrega no se deshace |
| **¿Consume o libera reserva de stock?** | Una devolución devuelve unidades al inventario |

**Ejemplo concreto del riesgo.** El Excel propone reclasificar `ENTREGADO A TRANSPORTADORA` (215
guías reales) de "en tránsito" a **"En preparación"**. Suena razonable a nivel de nombre. Pero
"entregado a la transportadora" significa que **el paquete ya no está en la bodega**. Si el
sistema lee "En preparación" como "todavía adentro", el inventario **nunca se descuenta**. Un
cambio de nombre se convirtió en un cambio silencioso de reglas contables.

Lo mismo aplica a `DESPACHADA` (1.223 guías) → "Recibido transportadora": ¿ese estado nuevo
declara salida física, o no?

> 🔴 **Regla dura: ningún estado nuevo se aprueba sin declarar sus implicaciones físicas.**
> La tabla de homologación tiene que tener esas columnas, no sólo `crudo → bonito`.

### 7.1 Un hueco concreto que ya existe

Hoy, la marca de "salida física" está puesta **sólo** en los estados de tránsito. Los estados de
**novedad** y **devolución** no la tienen. Pero:

- Un paquete en `NOVEDAD` (2.372 guías) **está en manos de la transportadora** — intentaron
  entregarlo y falló. Salió de la bodega.
- Un paquete en `DEVOLUCION` (900 guías) **obviamente salió** — está volviendo.

Si una guía salta directo a `NOVEDAD` sin que el sistema la haya visto en tránsito, queda
registrada como "todavía en bodega". El daño está acotado (casi siempre pasa por tránsito
primero), pero el modelo es incorrecto y produce reservas fantasma.

---

## 8. Las tres propuestas sobre la mesa (y en qué se contradicen)

### 8.1 PDF de macro-proceso — 24 estados, 6 fases

Es el más completo a nivel de **flujo**. Modela algo que los otros dos no: **los 3 casos de
ruteo** según qué use el proveedor.

```
CASO 1: proveedor NO usa ECOM  → Entrega directa a transportadora
        Guía generada ─────────────────────────────────────► Recogido

CASO 2: proveedor USA ECOM     → Entrega directa a transportadora (sin Dropi)
        Guía generada → Preparado para transp. (ECOM) → Entregado a transp. (ECOM) → Recogido

CASO 3: proveedor USA ECOM     → Recogido por Dropi (ECOM obligatorio)
        Guía generada → Preparado (ECOM) → Entregado a transp. (ECOM)
                      → Recogido Dropi → En bodega Dropi → Recogido
```
> **Regla del PDF:** si usa Dropi (recolección), **ECOM es obligatorio**.

**Fases:**

| Fase | Estados |
|---|---|
| **1. Gestión de orden** | Por confirmar → Pendiente → Guía generada → (Rechazado / Cancelado) |
| **2. ECOM** *(sólo si el proveedor usa ECOM)* | Preparado para transportadora → Entregado a transportadora |
| **3. Dropi** *(sólo si usa el servicio de recolección)* | Recogido por Dropi → En bodega Dropi |
| **4. Transporte y entrega** | Recogido → En tránsito → En bodega destino → En reparto → Entregado |
| **5. Novedades y reintentos** | Novedad 1 → Reintento 1 → Novedad 2 → Reintento 2 → Novedad 3 → (Devolución) |
| **6. Siniestro** | Siniestro → En proceso de indemnización → Indemnizado |
| **7. Devolución** | En devolución → Devuelta → Devolución confirmada por bodega |

**Estados finales:** Cancelado · Rechazado · Entregado · Indemnizado · Devolución confirmada.

**Aporte único del PDF:** el **ciclo de reintentos** (3 intentos de entrega antes de devolución)
y la **rama de siniestro**. Ninguno de los otros dos documentos los modela.

### 8.2 Excel — 576 mapeos por transportadora, 21 estados destino

**Aporte único:** es el único que baja al **estado crudo real de cada transportadora** (7
carriers, 517 estados únicos). Es el trabajo de campo.

**Los 21 estados propuestos** (los ✦ son nuevos):

| # | Estado | # | Estado |
|---|---|---|---|
| 1 | ✦ Por confirmar | 12 | Incautado |
| 2 | ✦ En preparación | 13 | Pendiente recolección |
| 3 | ✦ Recolectado por Dropi | 14 | ✦ En proceso de indemnización |
| 4 | Recibido transportadora | 15 | ✦ Indemnizado |
| 5 | En tránsito | 16 | ✦ Proceso finalizado |
| 6 | En reparto | 17 | ✦ Siniestro |
| 7 | Novedad | 18 | ✦ Rechazado |
| 8 | ✦ Novedad solucionada | 19 | Excepción |
| 9 | Entregado | 20 | Cancelado |
| 10 | ✦ Reclamo en oficina | 21 | ⚠ Sin mapeo |
| 11 | Devolución / Devolución en proceso | | |

### 8.3 La capa que nadie formalizó: **la vista del usuario final**

El Excel tiene una hoja ("Vista Usuario") que insinúa algo importante y nunca lo convirtió en
modelo: **el cliente final no debería ver 21 estados. Debería ver 8.**

| Estado logístico (operador) | → Vista usuario (cliente final) |
|---|---|
| Pendiente confirmación, Pendiente, Guía generada, En preparación, Recolectado por Dropi, En bodega Dropi | **En preparación** |
| Recibido transportadora, En tránsito, Novedad solucionada | **En camino** |
| En reparto | **En reparto** |
| Novedad | **Novedad en tu pedido** |
| Entregado | **Entregado** |
| Devolución, Devolución en proceso | **En devolución** |
| Cancelado | **Cancelado** |
| Proceso finalizado | **Proceso finalizado** |

**Esta separación es la mejor idea que hay en los tres documentos.** Deja que el operador tenga
todo el detalle que necesita sin llenar de ruido al cliente ("Recolectado por Dropi", "En proceso
de indemnización" y "Excepción" no significan nada para quien compró un producto).

### 8.4 Dónde se contradicen

| Tema | PDF | Excel | Nota |
|---|---|---|---|
| **Guía generada** | Es un estado de Fase 1 | **No existe** en la propuesta | No es contradicción: las transportadoras no lo emiten. Lo emite Dropi. **Debe existir.** |
| **Pendiente recolección** | No lo tiene | Lo lista pero le asigna **0 mapeos** | Está siendo retirado. Sacarlo de la lista. |
| **Reintentos (1/2/3)** | Los modela explícitamente | No los modela | El Excel colapsa todo en "Novedad" |
| **Siniestro / Indemnización** | Fase 5 completa | 3 estados sueltos | El PDF es más rico |
| **Novedad** | 3 niveles con reintentos | 1 estado (346 mapeos) | |

---

## 9. Errata del trabajo previo (importante si se reusa el Excel)

> 🔴 **La columna "Estado Actual (DB)" del Excel está desactualizada.**
> Usa las categorías `PENDIENTE_RECOLECCION`, `RECIBIDO_TRANSPORTADORA` y `EN_REPARTO`, que
> **fueron eliminadas en abril de 2026**. Por lo tanto:
> - El "Plan de Ajustes" (145 cambios) diffea contra una base que ya no existe.
> - La columna "¿Cambia?" y el comparativo "ANTES vs DESPUÉS" **no son confiables**.
> - Los totales tampoco: el Excel dice 576 mapeos; la base real tiene ~900.
>
> **El contenido semántico del Excel (qué significa cada estado crudo) sigue siendo válido y es
> trabajo valioso. El diff hay que recalcularlo contra la base actual.**

---

## 10. Checklist para construir la homologación correcta

- [ ] **Separar los dos vocabularios** (estado de orden vs. estado de guía) desde el modelo de
      datos, no desde la UI. El catálogo ya los distingue con la propiedad `company`.
- [ ] **Decidir las 6 colisiones** (§6) — determina si la clave es `estado_crudo` o
      `(transportadora, estado_crudo)`.
- [ ] **Declarar las implicaciones físicas de cada estado** (§7): salida de bodega, terminal,
      reversible, efecto en stock. Sin esto no es una homologación.
- [ ] **Priorizar por volumen real** (§4), no por tamaño de catálogo. ~50 estados cubren el 100%
      del tráfico; 400 no aparecieron nunca.
- [ ] **Definir el default de los estados desconocidos** y hacerlo **observable** (que el nuevo
      estado se registre solo, con una categoría "por clasificar", y alguien lo vea).
- [ ] **Formalizar la capa de vista usuario** (§8.3) — 8 estados, no 21.
- [ ] **Modelar los reintentos y el siniestro** (§8.1) — están en el PDF y en ningún otro lado.
- [ ] **Normalizar el casing de transportadora** en los dos lados (§4.4).
- [ ] **Presupuestar el costo del histórico**: no viene en el listado (§3.4).
- [ ] **Resolver el eje de fecha** para la sincronización (§3.3) — ninguno cubre solo.

---

*Auditoría de datos: 2026-07-12, sobre datos reales de Colombia (133.555 órdenes, 52.636 guías,
5 transportadoras). Catálogos de estados por país verificados contra la API el 2026-07-11.*
