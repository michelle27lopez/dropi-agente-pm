# Pipeline de datos — Same Day (densidad de demanda)

Convierte el export `Data samday.xlsx` en `datos-sameday.json` (lo que lee el mapa).

## Qué trae el export y qué NO

El archivo tiene **4 columnas**: `orden_id`, `direccion`, `ciudad_destino`, `dpto_destino`.
427.294 filas, sin vacíos: **Bogotá 235.310 · Medellín 103.322 · Cali 88.662**.

No trae **bodega de origen, fecha/hora de creación, hora de entrega, transportadora ni
estado final**. Por eso este mapa responde *dónde está la demanda*, y **no** *dónde se
puede cumplir same-day*: la mitad geográfica del problema (gap ④ del spec), no la horaria
(gap ②). Ver `logistica-lab/proyectos/same-day/spec.md` §7 y la petición de data.

## Flujo

1. **`xlsx2json.js`** — xlsx → `ordenes.ndjson`. Sin librerías: un xlsx es un ZIP con XML y
   node trae `zlib`. En streaming, porque la hoja son 92 MB de XML y las cadenas compartidas
   otros 38 MB.
2. **`osm.js`** — descarga la geometría de las vías de OpenStreetMap (Overpass) y construye
   el índice de nomenclatura. Es el corazón del pipeline; su cabecera explica los tres
   métodos que se descartaron **con medición** antes de llegar al que funciona.
3. **`zonas.js`** — límites administrativos (`admin_level=8`): localidades en Bogotá,
   comunas en Medellín y Cali. Cose los tramos sueltos de Overpass en anillos cerrados.
4. **`direccion.js`** — normalización y lectura de la dirección. La normalización es la
   misma de `recolecciones/pipeline/geo.js`; lo que cambia es que aquí se extrae **también
   el número generador** (el segundo), porque es el que identifica la vía que cruza.
5. **`geo-sameday.js`** — ubica las 427.294 órdenes, agrega en rejilla de 250 m y por zona,
   y escribe `../datos-sameday.json`.
6. **`barrios.js`** — barrios de OSM. Doble uso, deliberadamente separado: **pista** para
   desempatar vías homónimas y **validación**. El 20% de los nombres se aparta del primer uso
   para que la validación no sea circular.
7. **`verificar.js`** — la verificación buena: distancia al barrio que la propia dirección
   menciona. `--sin-pista` mide la línea base.
8. **`validar-osm.js`** — contraste contra Nominatim. Ver la advertencia de abajo.

## Correr

```bash
node osm.js --fetch                          # ~52 MB de geometría, se cachea
```
```bash
node zonas.js --fetch && node barrios.js --fetch
```

## Simulador de cobertura (modo "Simulación" del mapa)

Responde *"si la bodega está aquí, con esta hora de corte y esta flota, ¿qué es servible el
mismo día?"*. Tres capas encadenadas — una zona es servible sólo si pasa las tres:

1. **Accesibilidad** — `red-vial.js` + `rutas.js`. Red vial completa de OSM, grafo y **un
   Dijkstra por bodega**: una corrida deja el tiempo a toda la ciudad. Sin servicio externo,
   sin cuota, sin Docker. ~0,1 s por corrida sobre 253.000 nodos en Bogotá.
2. **Capacidad** — `simular.js` + el navegador. **Daganzo (1984)**: `L ≈ 2·r·n/Q + 0,57·√(n·A)`,
   la aproximación estándar de planeación de última milla. Da paradas que caben en la jornada
   y vehículos necesarios, sin resolver un VRP.
3. **Corte horario** — perfil de llegada de pedidos. **Simulado**: no hay timestamps.

`simular.js` precalcula los tiempos desde una rejilla de **bodegas candidatas** (~1 km) hasta
cada zona; el navegador busca la más cercana y hace la aritmética. Por eso arrastrar la bodega
responde al instante con un archivo de 100 KB.

### Las cuatro clases de variable — no mezclarlas

La credibilidad del simulador depende de esto, y por eso cada grupo se muestra distinto:

| | Qué es | Dónde vive |
|---|---|---|
| **A · Medido** | órdenes por celda y zona, área efectiva, red vial, precisión por ciudad | pipeline, con su error publicado |
| **B · Documentado** | corte 7–11 AM, olas de picking, ~100 ped/ciclo, cobertura Veloces · **el archivo es junio completo y se reparte de lunes a viernes → 20 días** | discovery del spec §0.1 y confirmación de Juan (26-jul) |
| **C · Supuesto** | tráfico, velocidad intra-zona, tiempo por entrega, ventana, paradas/vehículo, perfil de llegada, **factor de día pico** | **deslizadores visibles**, nunca constantes en el código |
| **D · Bloqueado** | **bodega origen**, timestamps, estado final | `peticion-data.md`, sin enviar |

**El periodo ya no es incógnita.** Junio completo, y la operación entrega **de lunes a viernes**
(el sábado es día corto y no da) → **20 días**. No se divide entre los 30 del calendario:
repartir entre días en los que no se despacha subestimaría la carga diaria un 33%.

**El día pico sí sigue siendo supuesto, y es el que dimensiona.** La flota no se calcula con el
día promedio: si se hace, la operación se queda corta la mitad de los días. El modelo escala la
demanda al día malo (default 1,4×, ajustable).

### Lo que ya dice el modelo (Bogotá, defaults)

- **La geografía no es el cuello de botella.** En todos los escenarios probados las 37 zonas
  quedan accesibles (37/0): desde una bodega céntrica, ir y volver nunca agota la jornada.
- **El corte sí lo es.** Con corte a las 11:00 sale el 24% de la demanda; a las 15:00, el 51%;
  a las 18:00, el 66%. **Mover el corte es la palanca**, y coincide con el gap ② del MVP.
- **Dimensionamiento con el periodo ya confirmado** (junio, 20 días de reparto, día pico 1,4×,
  corte 11:00): Bogotá **3.410 órdenes same-day/día con 86 vehículos**. Suba sola son 2.360
  órdenes/día de demanda, 569 que alcanzan el corte y **14,2 vehículos**.

> 🚩 **Contradicción abierta que hay que resolver antes de usar estas cifras.** Junio en 20 días
> implica **10.104 órdenes/día en Bogotá**, pero el discovery documenta **~2.500 órd/día de
> full-fill** (§0.1) — 4× de diferencia. La lectura más probable: el archivo trae **toda la
> demanda hacia esas ciudades**, no sólo lo que se despacha desde bodega Dropi, y el MVP fase 1
> sólo cubre lo segundo. Si es así, **el universo servible es una fracción de las 427.294 y el
> dimensionamiento de arriba está sobreestimado**. Lo resuelve `bodega_origen_id`: pasa a ser el
> campo más urgente de la petición de data — no para afinar, sino para saber sobre qué se mide.

### Vehículos: cómo se redondean

Los carros se muestran **enteros**, pero el redondeo se hace en dos grupos, no zona por zona:

- Zona que pide **≥ 1 vehículo** → tiene ruta propia y se redondea hacia arriba.
- Zona que pide **< 1** → dice **«comparte»**: no justifica un carro y se cubre junto a sus
  vecinas. Todas ellas se suman y se redondean **una sola vez**.

Redondear cada zona por separado metía un piso de 1 vehículo por zona: con 37 zonas salían 37
vehículos mínimo aunque muchas tuvieran 12 órdenes/día — **42 vehículos para 541 órdenes**, o
sea 13 por vehículo con capacidad 40. Artefacto del modelo, no necesidad operativa.

Con el reparto actual (junio, 20 días, pico 1,4×, corte 11:00): Bogotá **95 vehículos — 92 con
ruta propia y 3 para las 20 zonas pequeñas — a 36 órdenes cada uno**. El cálculo sin redondear
daría 86: **los 9 de diferencia son el costo real de que los carros sean enteros**.

Comprobado que el modelo responde a las dos restricciones: con ventana de 8 h manda la
**capacidad** (40 órd/vehículo); bajando la ventana a 3 h manda el **tiempo** (26 órd/vehículo).

⚠️ **Límites del modelo.** Los tiempos son de **flujo libre** — no hay tráfico real, semáforos ni
pico y placa, y el factor es un supuesto. **OSM prácticamente no trae `maxspeed` en estas tres
ciudades** (0,0% Bogotá · 0,6% Medellín · 0,2% Cali): de OSM viene la topología y el sentido de
circulación —dato real y bueno—, pero **las velocidades salen de la tabla `VEL` de
`red-vial.js`, que es un supuesto**. Hoy el factor de tráfico es **uno solo para las tres
ciudades**, cuando la congestión de Bogotá es peor: pendiente separarlo por ciudad y calibrarlo
contra pares reales. Daganzo supone paradas más o menos repartidas dentro de la zona, así que en
zonas muy alargadas o partidas por un cerro subestima.

## Correrlo entero

Desde `hub/`. Los tres pasos en orden, con guarda de regresión al final:

```bash
npm run sameday
```

`npm run sameday:fuentes` descarga los caches de OSM (vías, zonas, barrios) — sólo hace falta
la primera vez o para refrescarlos. El paso de verificación **sale con código ≠ 0 si la
precisión empeora más de 1 pp** respecto a `verificacion-barrios.json`, que va versionado
justamente para poder comparar entre entregas.
```bash
node --max-old-space-size=6144 xlsx2json.js "C:/ruta/Data samday.xlsx"
```
```bash
node --max-old-space-size=6144 geo-sameday.js
```

## Cómo se ubica una dirección (y por qué así)

No se geocodifica: se **resuelve el cruce**. "Calle 80 # 20-15" no se pregunta como texto
libre, se busca **dónde se cruzan la Calle 80 y la Carrera 20**, intersectando la geometría
real de ambas vías. Un cruce es un hecho local y verificable, y resuelve solo las
sub-nomenclaturas: hay varias "Carrera 50" en Bogotá, pero sólo una cruza a la Calle 127.

Cada punto sale rotulado con su precisión y el mapa **sólo dibuja lo confiable**:

| Precisión | Qué es | ¿Entra al mapa? |
|---|---|---|
| `cruce` | intersección geométrica real de las dos vías | sí |
| `cercania` | no se cruzan, pero pasan a menos de 150 m | sí |
| `via` | sólo se resolvió una de las dos vías | **no** |

Cobertura obtenida: **324.554 de 427.294 órdenes (76,0%)** — Bogotá 77,5% · Medellín 73,5% ·
Cali 74,7%. Lo que no entra son direcciones sin nomenclatura legible ("Conjunto X casa 4")
o con una sola vía. No se descartan en silencio: quedan contadas en `precision`.

## ⚠ Precisión — leer antes de usar el mapa para decidir

**La ubicación es el cruce de las dos vías, no el domicilio.** La resolución útil es la
cuadra. No sirve como geolocalización de clientes.

### La medición que vale (`verificar.js`)

Casi la mitad de las direcciones traen escrito su barrio. Se mide **a qué distancia quedó el
punto del barrio que el propio cliente escribió** — sin fuente externa de verdad. El 20% de
los nombres de barrio se **aparta** (nunca se usa para ubicar) y es el único grupo con el que
se mide, para que la cifra no sea circular.

| Ciudad | n | p50 | p75 | p90 | ≤1 km | **>3 km** |
|---|---|---|---|---|---|---|
| Bogotá | 15.371 | 506 m | 2.294 m | 11.797 m | 65,6% | **22,6%** |
| Medellín | 7.158 | 448 m | 810 m | 1.420 m | 81,6% | **6,7%** |
| Cali | 4.374 | 281 m | 503 m | 2.916 m | 84,0% | **9,9%** |

La distancia es **cota superior del error**: el punto del barrio en OSM es su centro y un
barrio mide cientos de metros, así que una dirección bien ubicada en el borde de su barrio ya
arroja 400–600 m. Lo que sí son errores reales es la cola: **>3 km**.

**Bogotá sigue siendo la peor** (22,6% contra 6,7% y 9,9%), porque tiene varias nomenclaturas
paralelas — Bosa, Suba, Ciudad Bolívar y Usme numeran aparte —, así que "Calle 80 × Carrera
100" existe de verdad en más de un sitio.

### Qué bajó el error (jul-2026): la letra de la nomenclatura

Antes, tanto `direccion.js` como `osm.js` descartaban la letra con `[A-Z]{0,2}` sin capturar,
así que **"Calle 137B" y "Calle 137" caían en la misma clave**. En Bogotá el **45,9%** de las
direcciones traen letra (107.930 de 235.310) y OSM sí las distingue: `Carrera 78B`, `78D`,
`78F` y `78H` son vías distintas del mismo sector.

Al capturarla apareció además **un bug latente peor**: en `"Calle 80 Sur"` el `[A-Z]{0,2}`
glotón se comía `"Su"`, el grupo `Sur` no casaba y **la Calle 80 Sur de Bosa se indexaba como
Calle 80**. Eso era la fuente principal del error de Bogotá.

Resultado del arreglo (cascada específica → base, así que la cobertura sólo puede subir):

| Ciudad | >3 km antes | después | cobertura antes | después |
|---|---|---|---|---|
| Bogotá | 27,4% | **22,6%** | 77,5% | **86,1%** |
| Cali | 13,2% | **9,9%** | 74,7% | 74,6% |
| Medellín | 6,9% | **6,7%** | 73,5% | **76,1%** |

La dirección del cambio confirma el diagnóstico: **Bosa +1,3 pp y Ciudad Bolívar +0,9 pp**
—las localidades del sur cuya nomenclatura "Sur" se estaba perdiendo— a costa de Suba
(−1,4 pp), Engativá (−1,1 pp) y Usaquén (−0,9 pp), que las absorbían.

**Mitigación previa, aún activa:** el barrio escrito en la dirección se usa como pista para
desempatar homónimos (`barrios.js`), cubriendo ~49% de las direcciones de Bogotá. Su efecto
**no se puede leer como precisión** (la métrica y la pista comparten señal); el número honesto
es siempre el del grupo apartado.

### Lo que NO cambia con el método: el agregado

Se regeneró todo con y sin la pista de barrio — un cambio que movió miles de puntos:

Ante una variación **neutra** del método (activar o no la pista de barrio), el reparto por zona
apenas se movió: máximo **0,37 pp** en Bogotá, 0,34 en Medellín, 0,08 en Cali. Los errores
individuales se cancelan en vez de sesgar.

Ante una **corrección real** (el arreglo de la letra), sí se movió, y en la dirección correcta:
hasta **1,4 pp**. Ese es el número que manda como umbral de lectura. La distribución vigente
—Bogotá **Suba 16,6% · Kennedy 12,0% · Engativá 11,6% · Usaquén 10,8%**; Medellín **El Poblado,
Belén, La Candelaria**; Cali **comunas 17 y 19**— reproduce la geografía real del consumo.

⚠️ **El orden entre zonas vecinas cambió con el arreglo** (Kennedy pasó a Engativá; El Poblado
a Belén). Es la prueba de que **diferencias menores a ~1,5 pp no se sostienen** y no deben
usarse para decidir entre una zona y su vecina.

### El barrio antes de la nomenclatura no afecta

Duda razonable: direcciones tipo *"Barrio Santa Rita Suba Calle 137 B # 153A-53"*. Medido
sobre el grupo apartado, la diferencia es nula:

| Ciudad | Empieza por la vía | Trae el barrio antes |
|---|---|---|
| Bogotá | 505 m (n=14.654) | 544 m (n=717) |
| Medellín | 447 m (n=6.687) | 474 m (n=471) |
| Cali | 277 m (n=4.119) | 309 m (n=255) |

El patrón busca la **primera vía** del texto, y un nombre de barrio no contiene
"Calle"/"Carrera". Comprobado a mano: con y sin el prefijo, la dirección de arriba devuelve
la coordenada idéntica.

### Otras dos mediciones, y por qué no se usan como referencia

- **Banco de intersecciones conocidas:** ≈530 m en Bogotá, ≈575 m en Medellín. Depende de
  coordenadas recordadas, no de una fuente citable.
- **Contra Nominatim** (`validacion.json`): 1.700–2.400 m. **No concluyente:** Nominatim
  resuelve estas direcciones a nivel de *calle* y elige un segmento cualquiera entre los
  homónimos — medido, devolvió "Calle 13, Cali" en el extremo sur. Mide desacuerdo entre dos
  métodos imperfectos, no el error de éste. Sólo 35–60 de 150 direcciones fueron comparables.

### Conclusión operativa

Sirve para **forma y concentración de la demanda por zona**, que es la decisión que habilita.
**No** para afirmar nada de una dirección concreta, ni para diferencias finas entre celdas
vecinas, ni —en Bogotá— para conclusiones que dependan de una sola localidad frente a su
vecina.

## Datos y privacidad

`ordenes.ndjson` contiene 427.294 direcciones de clientes finales: **dato personal**, no se
versiona (ver `.gitignore`). `datos-sameday.json` sí se versiona porque es agregado —
conteos por celda y por zona, sin ninguna dirección.

El xlsx original es data cruda de Dropi y vive en Drive / la bóveda privada, no aquí.
