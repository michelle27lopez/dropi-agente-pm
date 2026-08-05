# Auditoría de duplicidad Ecom — bodegas externas

> Corte: 2026-08-03. Este artefacto documenta un bug candidato transversal a Logística/Ecom; no crea proyecto ni absorbe Supplier. La única escritura externa de este corte fue el comentario documental `51012` en PRM-403, aplicado y releído. No se copiaron imágenes, órdenes, guías ni datos de usuarios.

## 1 · Conclusión

El hallazgo “bodegas externas de Ecom generan pedidos duplicados” **no puede cerrarse como duplicado de PRM-403 todavía**.

Existe una cadena histórica relacionada, pero su cierre es inconsistente:

- PRM-403 está `Finalizada` y declara que DROP-6924 la implementa.
- DROP-6924 sigue en `Backlog`, sin comentarios ni evidencia de entrega.
- DROP-6818 fue un hotfix finalizado.
- DROP-6876, ejecutado después, se titula “Reversión a corrección manifiestos duplicados” y no explica alcance o causa.

La evidencia demuestra un riesgo de regresión y un cierre documental incompleto. No demuestra que el caso actual comparta objeto, punto de entrada o causa raíz.

## 2 · Cadena Jira verificada

| Jira | Tipo / estado | Qué afirma | Qué no prueba |
|---|---|---|---|
| PRM-403 | Solución · Finalizada | Una guía aparece en varios manifiestos; enlaza implementación DROP-6924. Comentario `51012` documenta la inconsistencia. | No tiene descripción ni evidencia de producción; su estado no prueba que DROP-6924 se entregó. |
| DROP-6924 | Epic · Backlog | Múltiples clics en “Generar lote” crean manifiestos repetidos con la misma guía; faltaba validación previa. | No tiene comentarios, adjuntos ni transición a desarrollo/Done. |
| DROP-6818 | Hotfix · Finalizada/Listo | Conserva regresión de estados válidos/finales por rol y evidencia visual. | No describe el cambio técnico ni una prueba explícita de idempotencia/concurrencia. |
| DROP-6876 | Hotfix · Finalizada/Listo | El título declara reversión de la corrección de manifiestos duplicados. | No tiene descripción, comentarios, adjuntos ni enlaces; se desconoce qué se revirtió y por qué. |

Cronología relevante:

1. 18-mar-2025: se crea DROP-6818.
2. 19-mar-2025: DROP-6818 pasa a Done; se crea y finaliza DROP-6876 como reversión; se crea PRM-403.
3. 21-mar-2025: se crea DROP-6924 y PRM-403 la registra como implementación.
4. 24-abr-2025: PRM-403 queda en Done/Finalizada.
5. 03-ago-2026: DROP-6924 continúa en Backlog; se aplica y relee comentario documental `51012` en PRM-403.

## 3 · Equivalencia aún no demostrada

| Dimensión | Antecedente 2025 | Hallazgo workshop México | Gate |
|---|---|---|---|
| Objeto duplicado | Una guía en múltiples manifiestos/lotes | “Pedidos duplicados” | Confirmar si se duplica orden, guía, lote, manifiesto o impresión. |
| Punto de entrada | Ecom Scanner, acción Generar lote | Ecom + bodegas externas | Identificar canal/API/UI y paso exacto. |
| Disparador | Múltiples clics/reintentos sin control | No documentado | Reproducir clic, retry, timeout y concurrencia. |
| Alcance | Flujos/roles validados en el hotfix | México / bodega externa | Confirmar país, tipo de bodega, carrier y versión. |
| Resultado | Trazabilidad, impresión, conciliación | Duplicación operativa | Medir incidencia y efecto real sin PII. |

## 4 · Protocolo mínimo de reproducción

### Preparación

- Entorno seguro/no productivo o caso controlado autorizado.
- País, tipo de bodega, carrier y rol documentados.
- Identificadores sintéticos o anonimizados; nunca copiar nombres, teléfonos, direcciones o guías reales al repo.
- Registrar versión/build y flags relevantes.

### Matriz de disparadores

| Caso | Acción | Resultado esperado |
|---|---|---|
| Doble clic inmediato | Enviar dos veces la misma acción desde UI | Una sola operación aceptada; la segunda reutiliza resultado o responde conflicto controlado. |
| Retry por timeout | Repetir la solicitud con la misma clave | No crear orden/guía/lote/manifiesto adicional. |
| Dos sesiones | Ejecutar concurrentemente con el mismo objeto | Restricción de unicidad/idempotencia impide duplicado. |
| Reapertura/navegación | Volver a la pantalla y repetir | El estado ya procesado bloquea o explica la acción. |
| Reintento backend/cola | Reprocesar el mismo mensaje/evento | Consumidor idempotente; no duplica efectos. |
| Impresión | Reimprimir un manifiesto existente | Reimpresión explícita, sin crear un manifiesto nuevo. |

### Evidencia a capturar

- Correlation/idempotency key anonimizada.
- IDs técnicos anonimizados de orden, guía, lote y manifiesto.
- Timestamps de request, retry, persistencia y respuesta.
- Código HTTP/evento y resultado de cada intento.
- Conteo antes/después en cada entidad.
- Logs de restricción/lock/consumidor, sin payload con PII.
- Diferencia entre reimpresión y creación.

## 5 · Criterios de aceptación

1. Para una misma intención de negocio existe como máximo una orden, una guía activa y una asociación válida al manifiesto, según la regla de cada flujo.
2. Reintentos con la misma clave retornan el resultado previo o un conflicto controlado; no repiten efectos.
3. La UI deshabilita/indica procesamiento, pero la protección principal también existe en backend/base de datos.
4. La creación de lote/manifiesto usa una restricción o transacción que resiste concurrencia.
5. Reimpresión no crea un nuevo manifiesto.
6. Toda excepción queda auditable con actor, fecha y razón, sin exponer PII.
7. Las regresiones cubren Salidas, Ingreso PAU, Recolección, Recepción y Despacho cuando esos flujos apliquen al caso actual.

## 6 · Relación con otros frentes

- **LOG-001 Autoconfirmación:** una orden marcada como posible duplicado no se autoconfirma.
- **LOG-012 Autogeneración de guías:** la generación por lotes necesita la misma clave de idempotencia y regla bodega–carrier.
- **LOG-009 Guías reemplazatorias:** reemplazar/anular una guía es una transición explícita; no debe confundirse con duplicarla.
- **LOG-013 Recolecciones:** lote/manifiesto de recolección es otro objeto; no se relaciona hasta demostrar que comparte la misma operación técnica.
- **Supplier:** fuera de alcance; no se auditó ni modificó.

## 7 · Decisión después de reproducir

| Resultado | Acción |
|---|---|
| Misma causa y mismo componente que DROP-6924 | Tratar como recurrencia; actualizar el ticket existente con evidencia, versión y severidad. |
| Misma consecuencia, causa distinta | Crear/usar bug específico y relacionarlo como `relates`, no como duplicado. |
| Solo reimpresión/operación esperada | Corregir copy/proceso/SOP; no abrir bug de duplicidad. |
| No reproducible | Mantener observación con versión y telemetría; no cerrar por intuición. |

## 8 · Pendientes

- [x] Verificar estados, contenido, enlaces y changelog de PRM-403/DROP-6924/DROP-6818/DROP-6876.
- [x] Documentar la contradicción de cierre en PRM-403 comentario `51012` y releerla.
- [ ] Recuperar el motivo técnico y alcance de la reversión DROP-6876.
- [ ] Ejecutar la matriz de reproducción en el flujo actual de bodega externa México.
- [ ] Medir frecuencia e impacto con agregados anonimizados.
- [ ] Comparar el componente/versionado actual con DROP-6818 y DROP-6924.
- [ ] Decidir recurrencia, bug distinto u operación solo después de la evidencia.

