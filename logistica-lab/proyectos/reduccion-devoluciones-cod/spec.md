# Spec · Reducir devoluciones COD y trazabilidad de logística inversa

> Fuente interna de Logistic Success. Corte: 2026-08-02. Jira gobierna estado, ownership y relaciones; este documento conserva la definición, la evidencia y los vacíos. No reproduce identidades, contactos, órdenes ni métricas operativas restringidas.

| Campo | Valor |
|---|---|
| Código | **LOG-010** |
| Owner / PM documental | Juan Diego Bautista |
| Proyecto Jira | [PRM-1523](https://dropi-it.atlassian.net/browse/PRM-1523) · “Reducir devoluciones 10%” |
| Oportunidad relacionada en Jira | [PRM-1580](https://dropi-it.atlassian.net/browse/PRM-1580) · “Alto porcentaje de devoluciones en la contraentrega” |
| Célula | Logistic Success |
| Etapa | Desenlace COD y retorno al proveedor |
| Estado verificable | **Discovery/backlog**. PRM-1523 y PRM-1580 están en `En Ruta (backlog)`, sin assignee; PRM-1523 no tiene descripción. |
| Última actualización | 2026-08-02 |

## 1. Decisión de arquitectura

LOG-010 reúne dos capas relacionadas, pero causalmente distintas:

1. **Reducir la incidencia de devolución COD:** actuar antes o durante el intento de entrega sobre riesgo de pago, voluntad, contactabilidad y gestión de la novedad.
2. **Trazar la logística inversa:** cuando la devolución ya ocurrió, demostrar el traspaso físico al proveedor y cerrar discrepancias.

El **token de devoluciones de Veloces pertenece a la segunda capa**. Se conserva dentro de LOG-010 como capacidad/evidencia adyacente para evitar otro registro paralelo, pero no se contabiliza como experimento primario para reducir la tasa de devoluciones. Un token exitoso puede reducir disputas, pérdidas y tiempo de conciliación; no evita que el destinatario rehúse o que el pedido regrese.

## 2. Qué es —y qué no es— el token Veloces

### Flujo observado en el piloto

1. Veloces prepara el manifiesto digital y notifica que la devolución va en ruta.
2. El contacto autorizado de la bodega recibe un código de cuatro dígitos.
3. La persona que recibe físicamente la devolución entrega el código al conductor.
4. Se registran recepción, novedades, nombre/firma y cierre del manifiesto.
5. El manifiesto firmado se comparte por los canales acordados, de modo que bodega y transportadora consulten la misma evidencia.

La capacitación de julio documenta un piloto controlado con un grupo acotado de bodegas. No se localizaron todavía un reporte final, métricas de discrepancias antes/después ni una decisión formal de expansión a otros carriers. Por eso el estado correcto es **piloto con flujo documentado**, no “desplegado globalmente”.

### Fronteras obligatorias

| Concepto | Actor que confirma | Momento | Clasificación |
|---|---|---|---|
| Código de seguridad de entrega | Destinatario final | Entrega de última milla | Capacidad candidata de POD / LOG-016 |
| Token de devolución Veloces | Persona autorizada en bodega/proveedor | Recepción del retorno | Capacidad de logística inversa dentro de LOG-010 |
| Archivos de transportadoras | Sistema/equipo que intercambia lotes | Conciliación periódica | Integración u operación independiente; requiere auditoría propia |
| Guía reemplazatoria | Bodega/operación identifica un paquete retornado | Lectura y clasificación | LOG-009; no confirma por sí sola la recepción final |

## 3. Evidencia y antecedentes

| Fuente | Fecha / estado | Qué demuestra | Qué no demuestra |
|---|---|---|---|
| [Capacitación token de devolución](https://docs.google.com/document/d/1BZINWZLxXkVy4hTbE6uVZFBaQpUfJ01BJWjZ4Cl-Di0/edit) | 2026-07-10 | Flujo real del piloto: manifiesto previo, token, firma, novedades y canales de cierre | Resultado del piloto, reducción de disputas o rollout global |
| [Revisión de pendientes Dropi–Veloces](https://docs.google.com/document/d/1z0BQyRznjthNcKayorFvxAYJJKdaNu0xlhuoWP19YRc/edit) | 2026-06-05 | Veloces ya había mapeado su proceso; Dropi debía resolver contactos de bodega, integración y sensibilización | Que los datos de contacto ya estén corregidos o que la integración esté terminada |
| Hoja “Prueba token Veloces devoluciones” | Fuente restringida | Existe un registro operativo de la prueba | No se replica ni se usa como publicación; falta síntesis anonimizada y aprobada |
| [DROP-3455](https://dropi-it.atlassian.net/browse/DROP-3455) | Epic `HANDOFF`, creada 2024 | Antecedente amplio de rediseño/trazabilidad Ecom Scanner para devoluciones | Que cada historia hija esté construida |
| [DROP-4595](https://dropi-it.atlassian.net/browse/DROP-4595) / [DROP-4596](https://dropi-it.atlassian.net/browse/DROP-4596) | Historias Front/Back en `Backlog`, enero 2025 | Definición previa de lectura, evidencias, manifiesto, firma y flujo Veloces | Implementación en Dropi; siguen en backlog y sin relaciones propias |
| [PRM-1523](https://dropi-it.atlassian.net/browse/PRM-1523) | Proyecto OKR en backlog | Paraguas vigente para reducción de devoluciones; relacionado con PRM-1580 | Alcance definido: no tiene descripción ni assignee |

Los artefactos de Laura que aparezcan en este frente se consultan únicamente como referencia. No se editan, duplican ni se reclasifican desde este trabajo.

## 4. Problema y árbol causal

```text
Devolución COD
├── antes/durante la entrega
│   ├── riesgo de pago o cambio de voluntad
│   ├── contactabilidad y coordinación
│   ├── dirección/elegibilidad (frente relacionado, no absorbido)
│   └── gestión de novedad sin triaje ni owner
└── después de la devolución
    ├── falta de evidencia del traspaso al proveedor
    ├── contactos de bodega incorrectos o desactualizados
    ├── novedades sin cierre compartido
    └── disputa proveedor–transportadora
```

La analítica restringida indica que los motivos no tienen el mismo potencial de recuperación. Este spec conserva la conclusión y la fuente, pero no replica conteos, identidades ni consultas productivas. El baseline debe publicarse únicamente como agregado aprobado, con fecha, país, definición de denominador y owner.

## 5. Hipótesis y líneas de solución

### Capa A — prevenir la devolución

- **Score de riesgo predespacho:** identificar órdenes con mayor probabilidad de retorno y activar una intervención proporcional.
- **Red de seguridad dentro del COD:** recordatorio o anticipo selectivo sin eliminar la promesa de pago contraentrega.
- **Triaje de novedades:** separar casos recuperables de casos sin señal de recuperación y asignar owner/SLA.
- **Guardarraíles:** duplicidad, elegibilidad de zona/carrier, atribución de la intervención e idempotencia.

Estas líneas siguen en discovery. No existe evidencia localizada de experimento outcome para LOG-010.

### Capa B — conciliar la devolución ya materializada

- **Token Veloces + manifiesto:** prueba del traspaso físico a la bodega.
- **Novedades y firma:** evidencia común antes de cerrar el manifiesto.
- **Contacto autorizado:** WhatsApp/correo de la bodega debe ser actual, consentido, limitado al propósito y no expuesto en Jira, Confluence, Darwin o repositorio.
- **Expansión por carrier:** solo después de revisar resultado, capacidad equivalente, contrato de datos, soporte y tratamiento de novedades.

## 6. Ownership y RACI provisional

| Actividad | Responsable verificable / candidato | Límite |
|---|---|---|
| Desarrollo y operación del token | Veloces | La evidencia disponible atribuye el proceso a la transportadora; falta owner nominal confirmado |
| Dirección del piloto y articulación | Juan / Logistic Success | Acompaña y direcciona; no es owner del desarrollo |
| Datos de contacto de bodega | Operación/Producto Dropi, owner por confirmar | No publicar datos personales; definir fuente canónica y consentimiento |
| Cambios Ecom Scanner / integración | Equipo técnico por identificar | DROP-4595/4596 son antecedentes en backlog, no una asignación vigente |
| Decisión de expansión | Logistic Success + Operaciones + Veloces | Requiere resultados y criterios de salida |

## 7. Contrato mínimo de datos, sin información confidencial

| Entidad/evento | Campos mínimos permitidos en el diseño | Regla |
|---|---|---|
| Manifiesto de devolución | id técnico, carrier, bodega referenciada, estado, timestamps | Sin nombres/teléfonos en documentación compartida |
| Token emitido | id del manifiesto, estado de emisión, expiración, canal abstracto | Nunca guardar el token en logs analíticos ni documentos |
| Recepción validada | timestamp, resultado, actor por rol, novedad agregada | Separar identificador técnico de PII |
| Cierre | firma/evidencia referenciada, conteos agregados, resultado | Acceso por rol, retención definida y auditoría |
| Contacto fallido | razón normalizada y canal | Medir calidad sin publicar el dato de contacto |

Antes de integración se deben resolver expiración, reintentos, reenvío, múltiples contactos, cambio de contacto, acceso al manifiesto, retención, derecho de corrección e idempotencia del cierre.

## 8. Métricas y criterio de decisión

### Prevención COD

- tasa de devolución con denominador y ventana explícitos;
- recuperación por motivo de novedad;
- entrega y costo incremental por intervención;
- falsos positivos del score y efecto por país/carrier.

### Token/logística inversa

- manifiestos notificados, recibidos y cerrados;
- validaciones exitosas/fallidas y causa agregada;
- contactos no alcanzables;
- novedades abiertas y tiempo de cierre;
- discrepancias proveedor–carrier antes/después;
- soporte requerido, reenvíos y cierres duplicados;
- integridad de la evidencia y cumplimiento de acceso/retención.

**Gate de expansión:** no ampliar a otros carriers solo porque el flujo funcione en una demostración. Exigir periodo, cohorte, baseline, guardarraíles, resultado, soporte y decisión documentada.

## 9. Auditoría de las nueve fases E2E

| Fase | Estado | Evidencia / pendiente |
|---|---|---|
| Kick-off | 🟡 | Problema de trazabilidad y disputa documentado; falta owner formal y alcance Jira |
| Discovery | 🟡 | Reunión de pendientes y antecedente Ecom Scanner; falta mapa del proceso actual por actor |
| Definición | 🟡 | Flujo token/manifiesto documentado; faltan excepciones y contrato de datos |
| Following | 🟡 | Capacitación/piloto registrados; falta bitácora anonimizada y resultado |
| Hand-off DEV | ⛔/⚪ | Token parece desarrollado por Veloces; integración Dropi no comprobada. No atribuir a Juan |
| Comunicación | 🟡 | WhatsApp/correo forman parte del flujo; faltan plantillas aprobadas y manejo de contactos |
| Activación | 🟡 piloto | Cohorte controlada reportada; no rollout global |
| Hallazgos | ⚪ | No se localizó informe de resultado ni decisión antes/después |
| Checklist | ⚪ | Faltan seguridad, soporte, rollback, owner, métricas y expansión |

## 10. Relaciones Jira: estado actual y propuesta

- `PRM-1523 ↔ PRM-1580` ya están relacionados en Jira.
- `DROP-3455 → DROP-4595/4596` conserva el antecedente técnico/funcional.
- No existe relación Jira confirmada entre PRM-1523 y DROP-3455/4595/4596.
- No crear un issue “token de devoluciones” mientras no se demuestre un trabajo nuevo separado.
- Si se valida la equivalencia, proponer una relación documental entre PRM-1523 y DROP-3455, no marcar duplicidad ni reabrir historias sin decisión de Producto/TI.

## 11. Preguntas abiertas y siguientes acciones

- [ ] Obtener una síntesis anonimizada y aprobada del piloto: periodo, cohorte, intentos, cierres, fallas, discrepancias y decisión.
- [ ] Confirmar owner nominal en Veloces y owner de integración/contactos en Dropi.
- [ ] Verificar si DROP-4595/4596 siguen siendo la definición vigente o si fueron sustituidas por otra implementación.
- [ ] Definir fuente canónica y proceso de actualización de contactos de bodega sin exponer PII.
- [ ] Cerrar expiración, reenvío, fallback, novedades, idempotencia, acceso y retención.
- [ ] Separar el KPI de reducción COD del KPI de conciliación de logística inversa.
- [ ] Revisar expansión por carrier solo después del informe de piloto.

## 12. Changelog

- 2026-08-02 — Auditoría multifuente: se incorporaron PRM-1580, DROP-3455/4595/4596 y documentos de piloto; token reclasificado como piloto/capacidad de conciliación, no como prevención de devolución ni proyecto nuevo. Se retiraron cifras operativas restringidas del spec.
- 2026-08-02 — Separación explícita frente a código de entrega al destinatario, archivos de carriers y guías reemplazatorias.
- 2026-06-25 — Rama inicial de discovery COD creada.
