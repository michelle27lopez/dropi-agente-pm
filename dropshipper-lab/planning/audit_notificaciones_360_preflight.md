# 🔬 AUDITORÍA DE PRE-FLIGHT & VACÍOS CRÍTICOS: MÓDULO DE NOTIFICACIONES 360 (`PROD-1664`)

> **Fecha:** 2026-08-05  
> **Líder de Producto:** Santiago Herrera  
> **Product Designer (UX/UI):** Alejandra Melo Salazar  
> **Estado Real:** 🔬 **Discovery (35% de avance — Fase Explore)**  
> **Dictamen:** ⛔ **HANDOFF DETENIDO**. La extracción del catálogo de eventos de backend representa solo el **25% del insumo técnico de Backend**, pero NO constituye el paquete de Pre-Flight requerido para cruzar el *Gate of Reality* hacia Delivery (`agente-delivery`).

---

## 📊 1. Re-evaluación del Avance Real (35% Total)

| Componente del Pre-Flight Package | Avance | Estado | Brecha a Resolver |
|---|---|---|---|
| **1. Catálogo Técnico de Eventos (BE/Data)** | **25%** | 🟢 Completado | Extraído hoy de `Atributos y eventos Dropi.xlsx`. |
| **2. Contratos Técnicos Separados (FE vs BE)** | **10%** | 🟡 En progreso | Requiere separar eventos Userpilot Client-Side de Webhooks Server-Side. |
| **3. Reglas Anti-Spam & Throttling** | **0%** | 🔴 Pendiente | Sin reglas de frecuencia, volumen ni cap por hora/seller. |
| **4. UX Writing & Respuesta Bi-direccional** | **0%** | 🔴 Pendiente | Copies de Alejandra Melo pendientes; enrutamiento de respuestas (Sherlock AI vs SAC vs Bot). |
| **5. Intervention Brief Conductual (B=MAP/SDT)** | **0%** | 🔴 Pendiente | Sin formalización de B=MAP, Loss Aversion, trilema de fricción y guardarraíles SDT. |
| **6. RAT (Riskiest Assumption Test)** | **0%** | 🔴 Pendiente | Sin prueba barata de canal preferido (Concierge WhatsApp vs Push vs Email). |

---

## 🧐 2. Auditoría Detallada de los 5 Vacíos Críticos

### 🔴 Vacío 1: Reglas Anti-Spam (Throttling & Frequency Capping)
* **El Dolor Operativo:** Si un seller sufre 20 novedades en 1 hora por retrasos de transportadora, enviar 20 mensajes individuales por WhatsApp genera **bloqueo de número por spam**, frustración del usuario y desactivación de notificaciones.
* **Requerimiento para Handoff:**
  1. **Cap por Canal:** Máximo 2 mensajes por WhatsApp por hora por seller (P0/P1).
  2. **Agrupación (Digest):** Si ocurren >3 novedades en <30 min, consolidar en 1 mensaje digest (*"Tienes 4 órdenes con novedad que requieren tu atención"*).
  3. **Matriz de Prioridad:**
     * **P0 (Crítico / Inmediato):** Verificación de retiro de dinero / Alertas de seguridad.
     * **P1 (Operativo / Frecuencia Capped):** Novedades de guía / Orden parara >24h.
     * **P2 (Informativo / Digest Diario):** Novedades de catálogo, promociones, resumen de ventas.

---

### 🔴 Vacío 2: UX Writing & Respuesta Bi-direccional
* **El Dolor Operativo:** Enviar una notificación por WhatsApp sin definir la interacción cuando el seller responde genera **conversación muerta o sobrecarga a SAC**.
* **Requerimiento para Handoff:**
  1. **Copies Definitivos:** Redactados por Alejandra Melo en tono conciso, directo y enfocado en la acción (QuickActions).
  2. **Flujo de Respuesta Bi-direccional (Inbound Handling):**
     ```
     Seller responde al WhatsApp de Notificación
                        │
       ┌────────────────┴────────────────┐
       ▼                                 ▼
   [Opción A]                       [Opción B]
   Bot Interactivo /                Derivación a SAC (CAS)
   QuickActions (1 clic)            vía Laura Núñez
   (ej: resolver novedad)           (si requiere intervención humana)
       │                                 │
       └────────────────┬────────────────┘
                        ▼
            Sherlock AI / Motor Dropi
     ```

---

### 🔴 Vacío 3: Separación Estricta FE (Userpilot) vs BE (Webhooks TI)
* **El Dolor Operativo:** Mezclar eventos de interfaz de cliente con webhooks de servidor impide construir las Historias de Jira `[Frontend]` y `[Backend]` de forma independiente.
* **Requerimiento para Handoff:**
  1. **Contrato FE (Userpilot / SDK Web):** Disparado desde el navegador del usuario para tracking UI y guías in-app (ej: `general:finger_print_used`, `products:product_searched`).
  2. **Contrato BE (Webhooks API / Jose Giraldo):** Disparado desde el servidor de Dropi mediante webhooks seguros (ej: `orders:first_order_delivered`, `withdrawals:withdrawal_requested`).

---

### 🔴 Vacío 4: Intervention Brief Conductual (Metodología Dropi)
* **El Dolor Operativo:** Tratar la notificación como un simple "mensaje informativo" en lugar de un **Prompt conductual que detona una Acción**.
* **Requerimiento para Handoff (Documento `intervention_brief_notificaciones_360.md`):**
  * **B=MAP:**
    * **Behavior (B):** El seller ingresa y resuelve la novedad en <2 horas.
    * **Motivation (M):** Loss Aversion (evitar la devolución de la orden y la pérdida del flete).
    * **Ability (A):** Reducir la fricción a 1 solo clic desde WhatsApp o la App sin necesidad de login complejo.
    * **Prompt (P):** Mensaje enriquecido con QuickActions inmediatas.
  * **Guardarraíles SDT:** Respetar la **Autonomía** del usuario permitiéndole configurar sus preferencias de canal en `/dashboard/settings`.

---

### 🔴 Vacío 5: Checklist de Pre-Flight Handoff (Gate of Reality)

Antes de invocar al **Agente de Delivery** (`agente-delivery`) para desglosar Épicas e Historias en Jira (`[UX]`, `[UI]`, `[Frontend]`, `[Backend]`, `[QA]` con Gherkin), Discovery debe completar el siguiente paquete:

```
[ ] 1. Opportunity Brief & OST vinculado (Impacto en Activación Neta y Reducción de Devoluciones).
[ ] 2. Intervention Brief Conductual (B=MAP, Loss Aversion, Guardarraíles SDT).
[ ] 3. RAT Validado (Test Concierge / Split de Canales para verificar CTR de WhatsApp vs Push).
[ ] 4. UX Writing & Prototipo RPP/Angular completado por Alejandra Melo.
[ ] 5. Matriz de Throttling & Reglas Anti-Spam definidas.
[ ] 6. Flujo Bi-direccional de respuestas de WhatsApp definido (Sherlock AI / SAC / Bot).
[ ] 7. Contratos Técnicos FE vs BE separados y especificados.
```

---

## 🎯 Plan de Acción Organizado para Cerrar el Pre-Flight Package

1. **Paso 1 (Documentar Intervention Brief):** Crear `dropshipper-lab/planning/intervention_brief_notificaciones_360.md` aplicando el modelo B=MAP, Trilema de Fricción y Throttling.
2. **Paso 2 (Separación de Contratos FE vs BE):** Estructurar las especificaciones técnicas en dos documentos independientes: `CONTRATO_FE_USERPILOT.md` y `CONTRATO_BE_WEBHOOKS.md`.
3. **Paso 3 (Alineación UX/UI con Alejandra Melo):** Entregar el marco de triggers para que Alejandra arme los copies definitivos, botones QuickActions y los flujos bi-direccionales.
4. **Paso 4 (Diseño del RAT):** Diseñar un experimento de bajo costo (ej: piloto Concierge por WhatsApp a 50 novatos) para validar si el canal WhatsApp incrementa el CTR de resolución frente a las notificaciones actuales.
