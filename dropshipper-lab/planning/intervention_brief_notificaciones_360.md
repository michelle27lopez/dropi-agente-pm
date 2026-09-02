# 🧠 INTERVENTION BRIEF CONDUCTUAL: MÓDULO DE NOTIFICACIONES 360 (`PROD-1664`)

> **Iniciativa:** `PROD-1664` / `PRM-1305` / `PROD-1694`  
> **Célula:** Seller Success  
> **PM Lead:** Santiago Herrera | **UX/UI Lead:** Alejandra Melo Salazar  
> **Estado:** 🔬 **Discovery (Explore - Intervention Shaping)**  
> **Métrica Core:** Reducción de TTV Neto (16d ➔ <12d) y Reducción de Tasa de Devoluciones (18% ➔ <12%)

---

## 1. Problema Conductual

### 1.1 Comportamiento Actual (Baseline)
El dropshipper o marca no se entera de los eventos críticos de su operación (órdenes paradas >24h, novedades de transportadora, carritos abandonados, stock agotado) porque **no existe un sistema proactivo de notificaciones oportunas**. Para enterarse, el usuario debe ingresar manualmente a la plataforma y navegar por múltiples pestañas (`/dashboard/novelties`, `/dashboard/orders`), lo cual **los novatos huérfanos (88.5% inactivos) no hacen**.

### 1.2 Comportamiento Objetivo Esperado
El comercio reacciona y resuelve novedades u ordenes paradas en **menos de 2 horas** directamente desde el canal de notificación (WhatsApp / Push / In-App) con **1 solo clic** (QuickActions), reduciendo la tasa de devolución y acelerando el TTV Neto.

### 1.3 El Gap Conductual
Una brecha de **fricción cognitiva y de atención**: el usuario no monitorea la plataforma 24/7 y la falta de alertas proactivas causa que las órdenes mueran en novedad.

---

## 2. Diagnóstico Conductual (B=MAP & Sistema 1 / Sistema 2)

### 2.1 Modelo B=MAP (Fogg Behavioral Model)
* **Behavior (B):** Resolver la novedad de la orden dentro de los primeros 120 minutos.
* **Motivation (M):** **Loss Aversion (Aversión a la Pérdida)**. En dropshipping, una orden devuelta representa la pérdida neta del flete (costo financiero directo). La motivación no es "ganar más", sino **"no perder dinero de mi Wallet"**.
* **Ability (A):** Maximizar la simplicidad (Aumentar la habilidad). Reducir los pasos de 5 clics (login + buscar orden + editar + guardar) a **1 clic directo** en WhatsApp (*QuickActions*).
* **Prompt (P):** Notificación proactiva contextualizada en el canal habitual del usuario (WhatsApp o Push) en el momento exacto en que ocurre el evento.

### 2.2 Nivel Cognitivo (Sistema 1 vs Sistema 2)
* **Sistema 1 (Rápido, Automático):** La notificación en WhatsApp debe procesarse en Sistema 1. Copy ultra-claro, botón de acción inmediata (*"Confirmar nueva dirección"*), sin exigir que el usuario razone o recuerde contraseñas.
* **Marcadores Somáticos:** Iconografía de urgencia suave (🟡 Alerta Novedad) combinada con el valor financiero en riesgo (ej: *"Evita perder $15,000 COP de flete"*).

---

## 3. Matriz de Throttling & Reglas Anti-Spam (Frecuencia)

Para evitar la sobrecarga cognitiva y el bloqueo por SPAM en WhatsApp, se establecen las siguientes reglas estrictas de throttling:

| Nivel de Prioridad | Tipo de Evento | Cap por Canal | Regla de Agrupación (Digest) | Canal Principal |
|---|---|---|---|---|
| **P0 (Urgente)** | Retiro de Wallet, Alerta de Seguridad | Sin límite | Envio inmediato 1 a 1 | WhatsApp + Email |
| **P1 (Operativo)** | Novedad de Guía, Orden Detenida >24h | Max 2 / hora por seller | Si ocurren >3 en <30m, consolidar en Digest | WhatsApp / Push |
| **P2 (Informativo)** | Reabastecimiento de Stock, Promociones | Max 1 / día | Digest diario resumen de las 6:00 PM | Userpilot In-App |

---

## 4. Flujo Bi-direccional de Respuestas (Inbound Handling)

```
                     Seller responde al WhatsApp de Notificación
                                         │
                   ┌─────────────────────┴─────────────────────┐
                   ▼                                           ▼
       [Opción A: Comando Directo]                 [Opción B: Duda / Complejidad]
       Acción estructurada (QuickAction)            Consulta en lenguaje natural
                   │                                           │
                   ▼                                           ▼
       Procesado por Sherlock AI                   Derivado a SAC (CAS)
       (Edición de dirección/guía)                  vía equipo de Laura Núñez
                   │                                           │
                   └─────────────────────┬─────────────────────┘
                                         ▼
                             Confirmación al Seller
```

---

## 5. Guardarraíles de Experiencia (Teoría SDT)

1. **Autonomía:** El seller debe tener control total para activar/desactivar canales o silenciar notificaciones operativas desde `/dashboard/settings`.
2. **Competencia (Mastery):** Cada notificación resuelta muestra feedback inmediato de éxito (ej: *"¡Excelente! Evitaste la devolución de la orden #99182"*).
3. **Relación (Relatedness):** Tono de comunicación empático y cercano, como un asistente operativo personal.

---

## 6. Validación de Supuestos (RAT - Riskiest Assumption Test)

* **Supuesto de Mayor Riesgo (RAT):** *"Los dropshippers novatos responderán y resolverán novedades más rápido por WhatsApp con QuickActions que entrando al Dashboard web"*.
* **Prueba Conductual (Piloto Concierge):**  
  * **Muestra:** 50 novatos huérfanos con órdenes en novedad.
  * **Test:** Envío manual asistido por WhatsApp de la alerta con link de 1 clic vs grupo de control (notificación estándar web).
  * **Métrica Falsable:** Tasa de resolución de novedades en <2h debe ser **>40%** en el grupo de test vs **<10%** en el grupo de control.

---

## 7. Métricas de Éxito

| Tipo de Métrica | Nombre | Baseline | Meta |
|---|---|---|---|
| **Outcome Conductual** | Tasa de Resolución de Novedades <2h | 8.2% | **>35.0%** |
| **Proxy Conductual** | CTR de Notificación WhatsApp / Push | 12.0% | **>45.0%** |
| **Métrica de Negocio** | Reducción de TTV Neto (Días) | 16.0 días | **<12.0 días** |
| **Métrica de Negocio** | Tasa de Devolución Global | 18.5% | **<13.0%** |
