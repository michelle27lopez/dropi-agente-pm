# Borrador · propuesta final visual de normalización de estados

> **Estado: 🟡 borrador de trabajo · 2026-07-17. No promovido al spec.**
> Vista interactiva: `tablero/app/normalizacion-estados/` → ruta `/normalizacion-estados`.

## 1 · Objetivo del entregable

Convertir la propuesta técnica existente en una pieza revisable que permita cerrar:

1. el recorrido homologado por las tres rutas operativas;
2. la cobertura de países y transportadoras;
3. los ejemplos reales que prueban el comportamiento del catálogo;
4. la traducción operador → cliente final;
5. las decisiones necesarias antes del hand-off a TI.

## 2 · Evidencia disponible

| Capa | Cobertura | Estado | Fuente |
|---|---:|---|---|
| Catálogo por país | 9 países | 🟡 verificado vía API | `CONTEXTO_ESTADOS_DROPI.md §3.1` · 2026-07-11 |
| Tráfico real | 133.555 órdenes / 52.636 guías | 🟡 Colombia | `CONTEXTO_ESTADOS_DROPI.md §4` · 2026-07-12 |
| Mapeo crudo → destino | 576 mapeos / 7 carriers | 🟡 trabajo de campo | `fuentes/Homologacion_Estados_Final.xlsx` |
| Casos de punta a punta | 14 guías / 7 carriers | 🟡 muestra real | Excel, hoja `4. Guías de Prueba` |
| Macroproceso | 7 fases / 3 rutas | 🟡 propuesta de proceso | `fuentes/Macro-proceso-Logistica-Homologacion-estados.pdf` |

### Límite que debe quedar visible

⚠️ Los 9 países tienen catálogo publicado, pero la validación transaccional profunda solo está
documentada para Colombia. Por tanto, **no se puede afirmar todavía que la cobertura real esté cerrada
en todos los países**. El cierre mínimo es tomar al menos una guía real por país y registrar los estados
crudos que caigan en `Por clasificar`.

## 3 · Inconsistencias que la visualización no debe esconder

- 🟡 **26 estados base vs. ciclos parametrizados:** recolección y entrega agregan niveles/reintentos;
  falta decidir si son estados independientes o `estado + contador`.
- 🟡 **8 estados cliente vs. retiro en punto:** `Disponible para retiro` agrega una novena lectura.
  Recomendación: conservarla porque habilita aviso, punto y fecha límite.
- 🔴 **Entregado no siempre es terminal:** existe `Entregado → En reparto → Entregado`.
- 🔴 **Proceso finalizado no siempre finaliza:** existe `Proceso finalizado → Cancelado → Devolución`.
- 🟡 **Las muestras de carriers no coinciden:** el mapeo incluye TCC/JAMV-Drive; las guías incluyen
  99minutos/Futura. La validación final debe cruzar ambas listas.
- 🔴 **El diff de 145 ajustes está desactualizado:** usa estados DB retirados; debe recalcularse.

## 4 · Gates para declarar la propuesta final

1. 🔴 Confirmar `INTENTO DE ENTREGA` con Interrapidísimo y Veloces.
2. 🔴 Definir cuándo `Entregado` pasa de observado a confirmado (N horas sin rebote).
3. 🟡 Cerrar reintentos como estados o como contador para recolección, entrega y devolución.
4. 🟡 Aprobar `Disponible para retiro` como estado cliente adicional.
5. 🟡 Completar por estado: movilizado, salida de bodega, terminal, reversible y efecto en stock.
6. 🟡 Validar al menos una guía por país contra el catálogo global.
7. ⚪ Recalcular el plan de implementación contra la DB vigente.

## 5 · Estructura visual implementada

- **Mapa objetivo:** selector Directo / ECOM / ECOM + Dropi y siete fases.
- **Países:** tamaño del catálogo y nivel de evidencia por país.
- **Carriers:** volumen de mapeos, concentración en Novedad y colisiones.
- **Ejemplos reales:** 14 trazas filtrables por carrier y desenlace.
- **Decisiones:** cola priorizada de gates con siguiente acción.

## 6 · Próxima iteración

La próxima iteración no debe agregar más diseño hasta resolver los dos gates críticos. Después:

1. incorporar ejemplos multinacionales;
2. cerrar el catálogo v1 con flags físicos;
3. reemplazar el borrador visual por la versión aprobada;
4. promover al spec únicamente con aprobación explícita de Juan.
