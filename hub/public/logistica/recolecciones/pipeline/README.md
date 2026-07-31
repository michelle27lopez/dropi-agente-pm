# Pipeline de datos — Control de Recolecciones

Convierte el export de Chronos en `datos-recolecciones.json` (lo que lee el HTML).

## Flujo vigente (jul-2026)
1. **Export de Chronos** (`.xlsx`, grano **bodega × transportadora**) — vive en la **bóveda
   privada**, NO se versiona. Columnas: `warehouse_id, bodega, address, municipio, dpto,
   cod_dane, transportadora, preparadas, guia_generada, ultimo_evento`.
2. **`build.js`** — agrega por bodega (guardando el desglose por transportadora en `tr`),
   ubica cada bodega y escribe `../datos-recolecciones.json` + `por-geocodificar.json`.
3. **`geocache-coords.json`** — cache de coordenadas por `warehouse_id`, con la **dirección
   con la que se resolvió**. Es el activo que hay que preservar: si la dirección cambia en
   un export futuro, la coord se descarta y esa bodega vuelve a la cola.
4. **`geocode2.js`** — geocodifica contra LocationIQ con validación por municipio. Alimenta
   el cache. ⚠️ Requiere `LIQ_KEY` (hoy **vacía** en `.env`, pendiente de rotar).
5. **`centroides.json`** — centroides DANE de municipio/depto: validación y último recurso.

```bash
node build.js                       # usa el xlsx por defecto de la bóveda
node build.js /ruta/export.xlsx     # o uno explícito
```

`rescatar-cache.js` fue de un solo uso: extrajo las coords ya geocodificadas del JSON
anterior para que no se perdieran al regenerar. No hace falta volver a correrlo.

## Cascada de ubicación
```
cache geocodificado (misma dirección)  -> geo / geo_alta / geo_baja
centroide del municipio (DANE)         -> municipio      ┐ marcados "sin ubicar"
centroide del departamento             -> depto          ┘ en el mapa
```
**Nunca se inventa un punto.** Se eliminó la interpolación por nomenclatura ("malla") que
tenía el pipeline anterior: eran coordenadas calculadas, no observadas, y se mostraban
igual que una dirección real.

## Obsoletos
`geo.js` y `../_generar-datos.js` son el generador anterior (esquema sin transportadora,
input `rec2.json`, con malla). No usarlos; quedan hasta confirmar el borrado con Juan.

## Notas
- La validación de geocoding se hace por `cod_dane` (8 díg): el id de departamento del
  export es interno de Dropi y no coincide con el DANE.
- `ultimo_evento` es `MAX(updated_at)`: **no** es la antigüedad del estado. El 95,7% de las
  guías tiene `updated_at` de las últimas 24h, así que no sirve como proxy de "hace cuánto
  está preparada". Esa métrica solo sale de `Historyorder` o de snapshots diarios.
- El export ya **no trae** `estado_recogida` (`pick_ups` venía vacío) ni `bodega_creada`.
  El frontend no debe inventarlos: se declaran en `meta.sin_dato`.
