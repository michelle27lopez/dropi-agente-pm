# Pipeline de datos — Control de Recolecciones

Convierte el export crudo de Chronos en `datos-recolecciones.json` (lo que lee el HTML).

## Flujo
1. **`rec2.json`** (input) — export de Chronos, grano bodega. **NO se versiona** (data cruda de
   Dropi + efímero). El esquema de columnas y la petición de data detallada viven en la
   **bóveda privada**, no aquí.
2. **`geocode2.js`** — geocodifica direcciones con LocationIQ + validación por municipio
   (reanudable). Token por env var: `LIQ_KEY` (NO hardcodeado). Escribe coords a un cache.
3. **`geo.js`** — arma `datos-recolecciones.json` (bodegas + coords + agregados). Ubica en
   3 niveles: vía (geocodificada) → municipio/depto (centroide, marcado "sin ubicar").
4. **`centroides.json`** — lookup de centroides municipio/depto (DANE) para validar y como fallback.

## Correr
```bash
export LIQ_KEY=...     # rotar en el dashboard de LocationIQ
node geocode2.js       # geocodifica (reanudable)
node geo.js            # genera datos-recolecciones.json
```

## Notas
- La geocodificación normaliza el código DANE oficial (8 díg). El id de departamento del export
  es interno de Dropi y no coincide con el DANE, por eso la validación se hace por `cod_dane`.
- El export actual es una **foto agregada por bodega**. El detalle de qué falta para pasar a
  "película" (transportadora por bodega, timestamps, historial de estados) está en la petición
  de data de la bóveda privada.
