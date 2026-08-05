# Auditoría de antecedentes — token de devoluciones Veloces

> Corte: 2026-08-02. Alcance exclusivo de Logística. Revisión de solo lectura; no se modificaron artefactos de Laura, Jira, Drive ni Confluence.

## Veredicto

El token es una **capacidad de conciliación de logística inversa en piloto**, no un proyecto nuevo ni un código de entrega al destinatario. La evidencia de julio de 2026 demuestra el flujo y una cohorte controlada; no demuestra todavía impacto ni despliegue global. Existen antecedentes Ecom Scanner desde 2024/2025, pero las historias Front/Back siguen en backlog y no prueban que Dropi haya implementado la integración.

## Línea de tiempo verificable

| Fecha | Fuente | Evidencia | Lectura correcta |
|---|---|---|---|
| 2024-11-01 | DROP-3455 | Epic de rediseño Ecom Scanner para trazabilidad de devoluciones | Paraguas funcional histórico, hoy `HANDOFF` |
| 2025-01-08 | DROP-4595/4596 | Historias Front/Back con manifiesto, evidencia, firma y flujo Veloces | Definición en backlog, no prueba de implementación |
| 2026-06-05 | Revisión Dropi–Veloces | Veloces mapea el proceso; Dropi debe corregir contactos e integración | Dependencias de datos/operación abiertas |
| 2026-06-05 | PRM-1523 | Se crea el Proyecto OKR de reducción de devoluciones | Paraguas en backlog, sin descripción ni assignee |
| 2026-06-26 | PRM-1580 | Oportunidad de alta devolución COD, relacionada con PRM-1523 | Problema relacionado; no contiene por sí solo el token |
| 2026-07-10 | Capacitación token | Manifiesto previo, código, recepción, novedades y firma para una cohorte acotada | Piloto con flujo documentado |
| 2026-07 | Hoja de prueba restringida | Registro operativo de la prueba | Requiere síntesis anonimizada; no publicar datos crudos |

## Riesgos encontrados

- **Causalidad:** resolver la disputa de retorno no reduce el número de pedidos que se devuelven.
- **Estado:** “capacidad conocida” no equivale a integración Dropi ni rollout global.
- **Ownership:** Juan acompaña; atribuirle el desarrollo escondería la dependencia real con Veloces.
- **PII:** teléfono, correo, firma y nombre del receptor requieren fuente canónica, propósito, acceso y retención.
- **Historias antiguas:** DROP-4595/4596 pueden ser definición obsoleta; hay que comprobar vigencia antes de relacionarlas.
- **Métrica:** sin baseline e informe final, no se puede afirmar reducción de disputas.

## Decisión documental

1. Mantener el token como subcapacidad de LOG-010 para no crear una iniciativa paralela.
2. Etiquetarlo como `piloto / evidencia de logística inversa`, no `construido global`.
3. Conservar DROP-3455/4595/4596 como antecedentes candidatos, sin editar ni enlazar Jira todavía.
4. Referenciar la hoja de prueba como fuente restringida, sin copiar filas, contactos o resultados no aprobados.
5. Exigir el informe anonimizado del piloto antes de decidir expansión o integración.

## Fuentes

- [Capacitación token de devolución](https://docs.google.com/document/d/1BZINWZLxXkVy4hTbE6uVZFBaQpUfJ01BJWjZ4Cl-Di0/edit)
- [Revisión de pendientes Dropi–Veloces](https://docs.google.com/document/d/1z0BQyRznjthNcKayorFvxAYJJKdaNu0xlhuoWP19YRc/edit)
- [PRM-1523](https://dropi-it.atlassian.net/browse/PRM-1523)
- [PRM-1580](https://dropi-it.atlassian.net/browse/PRM-1580)
- [DROP-3455](https://dropi-it.atlassian.net/browse/DROP-3455)
- [DROP-4595](https://dropi-it.atlassian.net/browse/DROP-4595)
- [DROP-4596](https://dropi-it.atlassian.net/browse/DROP-4596)
