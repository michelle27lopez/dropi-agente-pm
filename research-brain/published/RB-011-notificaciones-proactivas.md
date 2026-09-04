# Documento de Research: Notificaciones Proactivas B2B y Reglas Anti-Spam (RB-011)

**Iniciativa Relacionada:** Módulo Notificaciones 360 (`PROD-1664`)
**Segmento:** Dropshippers (Todos los niveles)
**Fecha:** 2026-08-27
**Estado:** Publicado
**Confianza:** Alta

## 1. Problema y Contexto Conductual

El Módulo de Notificaciones 360 fue declarado "listo para Handoff" prematuramente solo con el catálogo de eventos. El Agente PM identificó vacíos críticos de Discovery (Explore), específicamente en la prevención de "fatiga de notificaciones" y la falta de respuesta bidireccional. 

### Diagnóstico B=MAP y Sesgos
- **Ability (A) / Fatiga Cognitiva:** Si un seller recibe 20 notificaciones de "Novedad en Guía" en 1 hora, sufre sobrecarga cognitiva. Su *Ability* para procesarlas se agota y las ignora todas (ceguera por inatención).
- **Prompt (P):** Un prompt constante y ruidoso se vuelve invisible o se bloquea (spam).
- **Sesgo de Ambigüedad:** Notificaciones genéricas como "Hubo un error con tu pedido" generan estrés sin resolver la acción (falta de claridad en el *UX Writing*).

## 2. Hallazgos del Benchmark (Exa Deep Research)

La arquitectura de notificaciones B2B moderna prioriza la **estabilidad del sistema y la confianza del usuario**:
1. **Reglas Anti-Spam y Throttling:** Es vital limitar la frecuencia (ej. máximo 3 notificaciones push por hora por tipo de evento). Los eventos que superan el umbral deben agruparse en un "Digest" ("Tienes 17 novedades nuevas").
2. **UX Writing (Serious but Supportive):** Copys concisos (<80 caracteres), con voz activa, explicando *qué pasó* y *qué debe hacer el usuario*. Sin urgencias falsas.
3. **Respuesta Bi-direccional (Actionable Notifications):** En B2B, las notificaciones deben tener botones de acción profunda (Deep Links o botones "Aprobar/Rechazar" en línea) para que la notificación en sí misma sea la interfaz de resolución.

## 3. Intervención Conductual Propuesta para PROD-1664

El diseño del módulo debe incorporar las siguientes reglas:

- **Throttling Inteligente:** Implementar agrupación (batching) cuando se detectan ráfagas del mismo evento (ej. picos de novedades de transportadora a las 7:00 PM).
- **Taxonomía de Acción (UX Writing):** Alejandra Melo debe categorizar cada evento en: *Informativo* (pasivo), *Requiere Acción* (activo con botones in-line), o *Feedback de Sistema*.
- **Ciclo de Feedback Bi-direccional:** Si el usuario recibe un push de "Novedad: Dirección Errónea", el tap debe abrir el drawer nativo de Dropi con la solución pre-cargada, no solo el listado genérico de órdenes.

## 4. Supuesto Más Riesgoso (RAT)
- **Supuesto:** "Agrupar notificaciones urgentes (throttling) no afectará el SLA de resolución del seller, sino que mejorará su tasa de atención neta".
- **Falsificación:** Enviar notificaciones en tiempo real a una cohorte (A) vs. notificaciones agrupadas cada 30 min a otra cohorte (B) y medir el "Time to Resolve" (TTR) de las novedades.
