# Evidencia · Prueba de usabilidad de Autoconfirmación — julio 2026

> Corte de auditoría: 2026-08-02. Este archivo conserva el resultado del estudio dentro del proyecto LOG-001; **no crea otra iniciativa**. Cada conclusión distingue evidencia observada, interpretación y decisión pendiente.

## 1. Veredicto ejecutivo

| Afirmación | Estado | Fuente |
|---|---|---|
| Se ejecutaron seis sesiones moderadas entre el 18 y el 25-jul-2026 | 🟢 observado | `hub/src/app/proyectos/logistica/experimentos/autoconfirmacion/AutoconfirmacionResultados.tsx`; Weekly Product 24/31-jul en Drive |
| El concepto obtuvo 81/100 de aceptación | 🟢 consolidado local | componente de resultados del Hub |
| La propuesta puede pasar a producción | 🔴 no demostrado | no hubo prueba técnica ni medición outcome |
| La comprensión del impacto económico es suficiente | 🔴 refutado en la muestra | tarea T4: 17% de éxito; 5/6 pidieron visibilidad de ganancia/pérdida |
| La solución mejora movilización, entrega o devolución | ⚪ pendiente | requiere instrumentación y prueba de impacto posterior |

**Decisión recomendada:** continuar discovery, corregir primero la visibilidad económica y cerrar el gate de ChateaPro. No pasar a handoff ni llamar “validado” al experimento completo.

## 2. Pregunta y alcance de la prueba

- **Objetivo observado:** entender si dropshippers y proveedores comprenden la configuración de reglas de autoconfirmación y pueden completar las tareas principales. `[doc:Hub]`
- **Método:** sesiones remotas moderadas por Google Meet, de 30–45 minutos, usando el prototipo funcional Angular/RPP. `[doc:Hub]`
- **Facilitación registrada:** Michel Pino. `[doc:Hub]`
- **Lo que no probó:** integración con ChateaPro, atribución manual/automática, estabilidad técnica, movilización, entrega, devolución, adopción longitudinal ni retorno económico. `[inferencia sustentada: no aparece medición de esos outcomes en las fuentes]`

## 3. Muestra

Se registraron seis participantes: cuatro con rol dropshipper, uno proveedor y uno con ambos roles; la antigüedad reportada va de 4 meses a 3 años. Una sesión figura como grabada en el consolidado local.

| ID auditado | Rol | Antigüedad reportada | Nota |
|---|---|---:|---|
| P01 | Dropshipper | 3 años | sesión marcada como grabada |
| P02 | Dropshipper | 1 año | — |
| P03 | Proveedor | 2 años | — |
| P04 | Dropshipper | 4 meses | — |
| P05 | Proveedor + dropshipper | 2,5 años | — |
| P06 | Dropshipper | 1,5 años | — |

> El componente del Hub conserva los nombres de presentación. Este expediente usa IDs para no duplicar datos personales innecesarios. No se encontró en Drive el reclutamiento, consentimiento ni criterio de selección; por eso N=6 se trata como muestra cualitativa, no representativa.

## 4. Resultados por tarea

| Tarea | Éxito | Lectura válida |
|---|---:|---|
| T1 | 83% | una persona no completó o interpretó correctamente la entrada al flujo |
| T2 | 100% | la configuración evaluada fue comprendida por toda la muestra |
| T3 | 83% | persistió una fricción en una de las seis sesiones |
| T4 · interpretar impacto | **17%** | bloqueo crítico: la interfaz no hace visible ganancia, pérdida o consecuencia económica |
| T5 | 100% | la tarea final evaluada fue completada por toda la muestra |

Puntajes consolidados: **Accesibilidad 72**, **Claridad 58**, **Satisfacción 81**. Estos son puntajes del estudio local; falta enlazar el instrumento y fórmula para poder reproducirlos.

## 5. Hallazgos observados

| # | Hallazgo | Frecuencia | Decisión que informa |
|---:|---|---:|---|
| 1 | No se ve el impacto en ganancia/pérdida | 5/6 | convertir visibilidad económica en gate antes de otra prueba |
| 2 | Faltan precios de flete por transportadora | 4/6 | mostrar el costo relevante o declarar que la regla no decide carrier |
| 3 | Falta alerta visual de pérdida | 4/6 | probar señal y copy de riesgo, no solo el switch |
| 4 | Se perciben separadas las pestañas manual y automatización | 3/6 | revisar modelo mental y navegación de la configuración compartida |
| 5 | Hay solapamiento con automatización existente | 2/6 | inventariar reglas actuales antes de construir otra capacidad |
| 6 | Se pide historial de transportadora por cliente | 2/6 | tratarlo como necesidad adyacente; no incorporarlo automáticamente a LOG-001 |

## 6. Fuentes y trazabilidad

| Fuente | Aporta | Límite |
|---|---|---|
| `hub/.../AutoconfirmacionResultados.tsx` | participantes, tareas, puntajes, hallazgos y veredicto | consolidado local; no enlaza artefacto crudo |
| `hub/.../autoconfirmacion/page.tsx` | contexto, periodo y facilitación | presentación, no registro primario |
| Drive · Weekly Product 24-jul (`1blabZq87gJcnVj-q3S4b1PeQOj5xmrd9CppiIlbO2QU`) | preparación de entrevistas y afirmación de que se hicieron pruebas | acta/transcripción, no detalle por sesión |
| Drive · Weekly Product 31-jul (`1aCXC8LlrjdErjFovQvgATRBx0wRRFz4u8gvKAUa6SFo`) | confirma cierre de pruebas y feedback favorable | no contiene matriz ni métricas completas |
| Drive · Cell Board 1 y 8-jul | variables, guardarraíles y prototipo previo | evidencia de diseño, no resultado del estudio |
| Jira PRM-1497/1574/1588/1589 | gobierno y rama de oportunidad/WhatsApp | no contienen el resultado del estudio |
| Hoja Drive “Estado de los proyectos 23/07”, `LS` | estado compartido de discovery | Autoconfirmación aparece duplicada y sin ticket |

## 7. Huecos que bloquean el cierre

1. **Artefacto primario:** falta URL de grabación, guion, consentimiento y matriz de observación de cada sesión.
2. **Reproducibilidad:** falta definición de cómo se calcularon Accesibilidad, Claridad y Satisfacción.
3. **Segmentación:** no hay país, volumen mensual, canal de creación ni criterio de madurez por participante.
4. **Gate técnico:** falta resolver la carrera con ChateaPro y la atribución manual/automática.
5. **Guardarraíles de datos:** duplicidad, ruralidad, variantes, elegibilidad e idempotencia no están definidos como contrato medible.
6. **Prueba outcome:** falta baseline por segmento, evento de asignación, grupo de comparación, duración, criterio de stop y lectura conjunta movilización–devolución.
7. **Arquitectura documental:** no se encontró E2E dedicado; la hoja LS tiene dos filas de la misma iniciativa.

## 8. Próxima prueba recomendada

Primero ejecutar un **gate técnico corto con ChateaPro**, no otro test de pantalla. Si la integración tolera esperar y puede registrar quién confirmó, iterar el prototipo con visibilidad económica y volver a probar T4. Solo después diseñar el experimento outcome con:

- segmento de madurez definido y auditable;
- exclusión de duplicadas, ruralidad y variantes según reglas verificadas;
- evento `decision_source` que diferencie manual, motor y ChateaPro;
- métrica primaria de tiempo/movilización y guardarraíl de devolución;
- muestra, duración y criterio de stop definidos antes de correr.

## 9. Relación con otras iniciativas

- **LOG-012 / PRM-1469:** autogeneración de guías comparte superficie, pero ocurre después de confirmar y tiene otro actor/decisión.
- **PRM-1574:** oportunidad de baja movilización en integraciones; sí es antecedente confirmado.
- **PRM-1588/1589:** rama WhatsApp candidata. No absorber el configurador general hasta comprobar equivalencia.
- **Órdenes duplicadas desde Ecom:** asunto logístico y guardarraíl; todavía falta ticket exacto y definición de detección.
